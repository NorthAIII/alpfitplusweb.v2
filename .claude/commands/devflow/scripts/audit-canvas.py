#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DevFlow — Audit Canvas (rolling audit kuyruğu)

Bir DevFlow projesinin dokümanlarını (parent CLAUDE.md — kökte ya da `.claude/`
altında — + _dev/**/*.md) izleyen,
SQLite tabanlı bir "kontrol kuyruğu" yönetir. Asıl kaynak _dev/'in kendisidir;
bu canvas yalnızca "hangi doküman ne zaman / hangi konvansiyon versiyonuna göre
kontrol edildi" durumunu tutan, yeniden üretilebilir bir cursor'dır.

- Store: _dev/.audit/canvas.db   (SQLite; gitignore'lı, yerel)
- Ayna:  _dev/.audit/canvas.tsv  (git-tracked; her yazımda deterministik üretilir;
         canvas.db kaybolursa buradan rebuild edilir)

Bu script dokümanları ASLA değiştirmez (READ-ONLY). Proje kökünde yalnızca kendi KAP
dosyalarına dokunur, ve yalnız eksikse: .audit/ altı · .gitignore (canvas satırları) ·
.prettierignore (motor kopyasının muafiyeti — YALNIZ prettier yapılandırılmış projede;
gerekçe: ensure_prettierignore). Üçü de içerik değil kap. Tüm düzeltmeler Claude + kullanıcı
onayı üzerinden yapılır; script sadece tarar, seçer, durumu tutar.

Bağımlılık: yalnızca python3 stdlib (sqlite3 + hashlib) — sqlite3 CLI gerekmez.

Komutlar:
  reconcile            _dev/ + parent CLAUDE.md tara; yeni dokümanı ekle, silineni çıkar
  scan                 mekanik acil tespit (boyut red-line) → status=urgent
  next [--limit N]     sıradaki kontrol edilecek doküman(lar)ı gerekçeyle döndür
                       (boyut kırmızı çizgisini uçuş-anında da tespit eder:
                        urgent:token-hard — db'ye yazmadan, yalnız çıktıda)
       [--rotate]      güncel/uygun dokümanları da en-eskiden rotasyona kat
  touch <path>         dokümanı "kontrol edildi" işaretle (--status, vars. conformant)
  invalidate (--filter GLOB | --all)   eşleşenleri yeniden kuyruğa al (biri zorunlu)
  bump-version         konvansiyon versiyonunu artır (eski-versiyonlu herkes due olur)
  exclude <path>       dokümanı kalıcı kapsam-dışı yap
  include <path>       kapsam-dışı işaretini kaldır
  accept-size <path>   boyut aşımını KAYITLI olarak kabul et (--reason zorunlu)
  unaccept-size <path> boyut kabulünü geri al
  status               özet

Boyut kabulü (accept-size) — `exclude` DEĞİLDİR:
  `exclude` dokümanı TÜM sorgulardan çıkarır (drift'i sessizleşir). `accept-size`
  yalnız **boyut kulvarını** kapatır: doküman `urgent:token-hard` olarak prio-0'da
  slot tutmayı bırakır ve normal `conformance` kuyruğuna akar — yani uygunluk
  denetimi almaya DEVAM eder. Kabul, verildiği andaki içerik hash'ine bağlıdır:
  doküman değişirse kabul kendiliğinden DÜŞER (süresiz muafiyet yoktur).
"""

import argparse
import datetime
import fnmatch
import hashlib
import os
import sqlite3
import sys

CANVAS_REL_DIR = os.path.join("_dev", ".audit")
DB_NAME = "canvas.db"
MIRROR_NAME = "canvas.tsv"

# Boyut eşiği — doc-scan.sh ile AYNI tutulmalı (değişirse ikisini de güncelle).
# Token oranı da (char/1,69) iki script'te aynı tutulmalı — kalibrasyon kaydı ve
# yeniden-ölçüm tarifi doc-scan.sh başlığındadır (2026-07-24, 2026-08-08,
# yeniden ölçüldü 2026-08-09). Formül DÖRT noktada geçer ve dördü BİRLİKTE
# değişir: burada scan(), next() ve cmd_accept_size(), doc-scan.sh'ta esttok. cmd_accept_size
# atlanırsa eşikler ıraksar ve doküman kilitlenir: scan onu `urgent` yapar,
# accept-size "zaten eşiğin altında" diye reddeder — çıkışı olmayan bir S1
# kulvarı doğar, doküman `touch` alamadığı için bir daha hiç uygunluk denetimi
# görmez (audit-docs → Section 1: "bu kulvar kalıcı olmamalı").
# Char sayımı da hizalı: scan() ve next() ikisi de dosyayı bytes okuyup
# utf-8/errors=replace ile decode eder — newline çevirisi yok, CR'ler dahil,
# UTF-8 locale'de `wc -m` gibi. (scan() eskiden newline='' text modu kullanıyordu;
# hash'i de aynı bytes'tan üretebilmek için bytes'a geçirildi — sayım değişmedi.)
TOKEN_HARD = int(os.environ.get("TOKEN_HARD", "20000"))

DEFAULT_CONVENTION_VERSION = "1"
# 1 → 2: docs.size_accepted sütunu eklendi (boyut kabulü). Göç idempotent
# ALTER TABLE ile init_schema'da yapılır; eski canvas.tsv aynaları sütunsuz
# okunur (import_mirror ada göre eşler, eksik alan None olur).
SCHEMA_VERSION = "2"

MIRROR_COLUMNS = ["id", "path", "status", "status_reason", "checked_version",
                  "last_checked", "content_hash", "exclude", "added_at",
                  "size_accepted"]
# Sondaki BOŞ değerleri kırpılabilen sütunlar: satır-sonu boşluk temizleyen bir
# araç (`.editorconfig` → trim_trailing_whitespace; filoda .tsv muaf DEĞİL) bu
# alanları düşürür. Eksiklikleri kayıpsız geri yüklenir, hata sayılmaz.
MIRROR_OPTIONAL_TAIL = {"size_accepted"}

# `next` öncelik katmanları — path-based, statik (DevFlow yapısı sabit yollar kullanır).
# Aynı bucket'ta (urgent / conformance) düşük tier önce gider, tier içinde ise
# doktrin parent'ı (`PARENT_DOCS`) ilk; rotation bucket'ında yaş öne geçer (en eski
# önce, parent istisnası yok) — proaktif rotasyonun "en uzun süredir denetlenmemiş"
# sözünü tutmak için (üç kuralın gerekçesi de: bkz. cmd_next sort).
#   Tier 1 = çekirdek yaşayan dokümanlar. Ölçüt İKİ KOLLUDUR — "her oturum
#            bağlama girer" YA DA "blast radius geniş" — ve tek kollu okumak
#            kümeye yeni aday tartılırken yanlış ölçüt uygular.
#            Birinci kol DAR: protokolün **koşulsuz** çekirdeği (OVERVIEW ·
#            INDEX · DURUM · MEMORY · GIT-STRATEJI) artı parent — onu harness
#            her oturum kendiliğinden yükler — ve `_dev/claude/*`, parent'a
#            `@import` ile bağlı. Protokolün KOŞULLU maddeleri bu kolu geçmez
#            ve bilinçle kümenin dışındadır: aktif task varken okunan
#            TASKS-README (Tier 3 — motor template'inin kopyası, audit'in işi
#            minimaldir) ve task dokümanı (Tier 2). Projeye özgü sabit
#            dokümanlar da geçmez — yolları motorda bilinemez.
#            İkinci kol: MODULE-MAP ve PHASES faz döngüsünün haritasıdır,
#            ILKELER Korumalı sınıftır, QUALITY kalite kapısıdır. Üye SAYISI
#            buraya yazılmaz (bayatlar) — ölçüt iki kollu tanımın kendisidir.
#   Tier 3 = tarihsel/sistem (audit'in işi minimal — içerik-koruyan reformat)
#   Tier 2 = kalan her şey (modüller, memory atomları, aktif task, faz, PRD, docs/*)
#
# NOT — `_dev/phases/PHASE-N.md` her zaman Tier 2 kalır (path-static): tamamlanmış
# (✅) fazlar CLAUDE-MD'de "tarihsel" sayılır ama bunu bilmek PHASES.md parse
# etmeyi gerektirir; script tasarımı READ-ONLY ve format-agnostik tutmak için
# path-static. Yargı (✅ mı?) ve uygun ele alış (içerik-koruyan reformat) Claude'a
# bırakılır — audit-conform.md Adım 5 bunu doğru ele alır. Sonuç: tamamlanmış faz
# dokümanı yüksek öncelikle (Tier 2) gelebilir ama davranış yine doğrudur.
# NOT — `_dev/claude/*.md` (CLAUDE.md doktrin çocukları) Tier 1'dir: kök
# CLAUDE.md'ye @import edildikleri için her oturumda bağlamdadırlar ve blast
# radius'ları parent'ınkiyle aynıdır. Prefix ile eşlenir (sayı/ad motorun
# kesimine bağlıdır, burada literal liste tutmak bayatlar).
# Parent'ın ikinci meşru konumu. Harness `.claude/CLAUDE.md`'yi de bağlama yükler
# (resmî doküman), yani oradaki dosya projenin canlı talimat dosyasıdır — ama
# canvas onu görmezse sessizce denetim dışında kalır.
PARENT_ALT_REL = ".claude/CLAUDE.md"

# NOT — parent'ın İKİ meşru yolu da Tier 1'dir. Küme yol-tabanlı olduğu için
# `.claude/CLAUDE.md` buraya yazılmazsa `tier_for` onu Tier 2 döndürür ve doktrin
# parent'ı, kendisinin @import ettiği çocuklarının ARKASINA sıralanır — yukarıdaki
# gerekçenin ("blast radius'ları parent'ınkiyle aynıdır") tam tersi. İki yol aynı
# mantıksal dokümanın alternatif konumudur; bir projede normalde yalnız biri bulunur,
# yani bölünmüş bir projede parent kümeye bir kez girer. "İki canlı parent"
# hâli sayım sorunu değil kalemin kendisidir ve rotası `kickoff-verify` Adım
# 3'ün birleştirme koludur. (Üye sayısı yazılmaz — yukarıdaki gloss'un kendi
# yasağı; küme `TIER1_DOCS` + `TIER1_PREFIXES`'in kendisidir, `ls` sayar.)
# ⚠️ Tier üyeliği bu yasağı tek başına TUTMUYOR — gerekli ama YETERLİ değil: aynı
# tier içinde sıra `last_checked`'a düşer ve doktrin çocukları boş `last_checked`
# ile doğar (boş dize her tarihten küçüktür), yani parent yine çocuklarının
# arkasına düşer. Yasağı fiilen tutan şey `PARENT_DOCS` + `cmd_next` sort'undaki
# parent-rank'tir; gerekçesi orada.
PARENT_DOCS = frozenset(("CLAUDE.md", PARENT_ALT_REL))
TIER1_PREFIXES = ("_dev/claude/",)
TIER1_DOCS = set(PARENT_DOCS) | {
    "_dev/OVERVIEW.md",
    "_dev/DURUM.md",
    "_dev/INDEX.md",
    "_dev/MODULE-MAP.md",
    "_dev/PHASES.md",
    "_dev/QUALITY.md",
    "_dev/ILKELER.md",
    "_dev/MEMORY.md",
    "_dev/GIT-STRATEJI.md",
}
TIER3_DOCS = {
    "_dev/tasks/TASKS-README.md",
    "_dev/docs/DECISIONS.md",
}
TIER3_PREFIXES = ("_dev/tasks/archive/", "_dev/bulgular/archive/")


def tier_for(path):
    """Statik path-temelli öncelik bucket'ı (1=çekirdek, 2=normal, 3=tarihsel/sistem)."""
    if path in TIER1_DOCS:
        return 1
    for prefix in TIER1_PREFIXES:
        if path.startswith(prefix):
            return 1
    if path in TIER3_DOCS:
        return 3
    for prefix in TIER3_PREFIXES:
        if path.startswith(prefix):
            return 3
    return 2


def today():
    return datetime.date.today().isoformat()


def norm(rel):
    return rel.replace(os.sep, "/")


def db_path(root):
    return os.path.join(root, CANVAS_REL_DIR, DB_NAME)


def mirror_path(root):
    return os.path.join(root, CANVAS_REL_DIR, MIRROR_NAME)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


# Türkçe aksan katlaması — ayırt edici testler için. **NFKD YETMEZ:** 'ı' (U+0131)
# ayrı bir harftir, birleşen işareti yoktur; NFKD onu 'i' yapmaz (ölçüldü:
# "Başlangıç" --NFKD--> "Baslangıc", hâlâ "Baslangic" değil).
# Gerekçe dürüstçe: filoda başlığını TÜMÜYLE AKSANSIZ yazan canlı bir proje var
# (EnderLLC/rakorix → "## Oturum Baslangic Protokolu"; aksana duyarlı arama 0,
# katlamalı 1 bulur). O projenin parent'ı KÖKTE olduğu için bu fonksiyon ona hiç
# çağrılmaz — yani katlama BUGÜN filoda hiçbir hükmü değiştirmiyor. Katlama, o
# yazım biçiminin gerçek olduğu ÖLÇÜLDÜĞÜ için var: aynı biçimde yazılmış bir
# `.claude/` parent'ını katlamasız bir test "global kural kopyası" sayar ve
# sessizce denetim dışında bırakır — tam da bu fonksiyonun önlediği şey.
# Markup da katlanır: karşılaştırmanın İKİ tarafına da uygulanır. Küme burada
# `*`, backtick VE `_` — sonuncusu prettier'ın `*vurgu*` → `_vurgu_` yeniden
# yazımı yüzünden gerekli. Ölçüldü: sarmalayan vurgu (`## _Ad_`) alt-dize testini
# zaten geçiyor, ama **başlığın ORTASINDAKİ** vurgu (`## Oturum _Başlangıç_
# Protokolü`) `_` katlanmadan KAÇIYOR ve o proje sessizce denetim dışında kalır —
# tam olarak bu fonksiyonun önlemek için var olduğu şey. Filoda bugün 0 vaka;
# yine de tek karakterlik katlama, sessiz bir kaçış yolundan ucuzdur.
# NOT: `lib/audit-conform.md` Adım 1'in çapa süzgeci `_`'yi DAHA DAR alır (yalnız
# tırnağa bitişik) — orası ad ÇIKARIR, burası ad EŞLEŞTİRİR; çıkarmada fazla
# silme adı bozar, eşleştirmede bozmaz. Kümelerin ayrılığı bilinçlidir.
_ASCII_FOLD = str.maketrans("çğıİöşüÇĞÖŞÜâîûÂÎÛ",
                            "cgiIosuCGOSUaiuAIU")
_PARENT_MARK = "oturum baslangic protokolu"


def fold(s):
    """Aksan + markup katlaması (küçük harfe indirir)."""
    return (s.translate(_ASCII_FOLD)
            .replace("*", "").replace("`", "").replace("_", "").lower())


def is_devflow_parent(path):
    """`.claude/CLAUDE.md` projenin KENDİ doktrin parent'ı mı, yoksa kullanıcının
    global kural kopyası mı?

    Ayırt edici motorda zaten kuruludur — `## Oturum Başlangıç Protokolü` başlığı
    (aynı ölçüt: `kickoff-verify` Adım 3 · `audit-docs` Adım 1).
    Gerekçe ölçülmüştür: filoda protokol başlığı TAŞIMAYAN bir `.claude/CLAUDE.md`
    gerçekten vardır (EnderLLC/vercelender → "# Global Claude Code Kuralları",
    üstelik o projenin gerçek parent'ı kökte); koşulsuz eklenirse denetim
    kullanıcının global kural dosyasına proje doktrini yazmaya çalışır.

    Okuma başarısız olursa SESSİZ DÜŞÜRME YOK — uyarı stderr'e yazılır.
    Okunamayan dosya "parent değil" demek değildir, "bilgi yok" demektir.
    """
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            text = f.read()
    except OSError as e:
        sys.stderr.write(
            "uyarı: %s okunamadı (%s) — parent testi YAPILAMADI, izlenen kümeye "
            "alınmadı. Dosya projenin parent'ıysa denetim dışında kalıyor demektir.\n"
            % (PARENT_ALT_REL, e))
        return False
    # BOM kırpılır: `str.strip()` onu boşluk saymaz, dolayısıyla başlık dosyanın
    # İLK satırıysa `startswith("##")` BOM yüzünden tutmaz ve gerçek bir parent
    # "global kural kopyası" sayılırdı. Aynı tuzak `ensure_gitignore`'da zaten
    # çözülmüş durumda — aynı idiom kullanılıyor.
    for line in text.lstrip("﻿").splitlines():
        line = line.strip()
        if line.startswith("##") and _PARENT_MARK in fold(line):
            return True
    return False


def iter_doc_paths(root):
    """İzlenecek doküman seti: parent CLAUDE.md (kökte ve/veya `.claude/` altında)
    + _dev/**/*.md (.audit/ hariç)."""
    paths = []
    # Kök CLAUDE.md KOŞULSUZ eklenir (bugünkü davranış korunur): oradaki dosya
    # tanımı gereği projenin kendisinindir ve koşula bağlamak hâlihazırda izlenen
    # dokümanları kuyruktan düşürürdü.
    if os.path.isfile(os.path.join(root, "CLAUDE.md")):
        paths.append("CLAUDE.md")
    # `.claude/` altına os.walk ile İNİLMEZ — motorun projeye kurulmuş kendi komut
    # dokümanları oradadır (`.claude/commands/devflow/**.md` — motorun her komutu,
    # template'i ve lib dosyası) ve kuyruğa girerlerse audit motorun vendored
    # kopyasını proje dokümanı sanıp düzenlemeye çalışır. Sayı yazılmıyor: motor
    # büyüdükçe bayatlar, soru bayatlamaz. Yalnız TEK dosya, tek koşulla eklenir.
    # İkisi birden varsa ikisi de izlenir: "iki canlı parent" hâli hatalıdır ama
    # görünür olması gizli kalmasından iyidir (rota: `kickoff-verify` Adım 3).
    alt = os.path.join(root, ".claude", "CLAUDE.md")
    if os.path.isfile(alt) and is_devflow_parent(alt):
        paths.append(PARENT_ALT_REL)
    dev = os.path.join(root, "_dev")
    audit_abs = os.path.abspath(os.path.join(root, CANVAS_REL_DIR))
    if os.path.isdir(dev):
        for dirpath, dirnames, filenames in os.walk(dev):
            # .audit/ alt ağacına inme (kendi artifact'larımız)
            dirnames[:] = [d for d in dirnames
                           if os.path.abspath(os.path.join(dirpath, d)) != audit_abs]
            for fn in filenames:
                if fn.endswith(".md"):
                    rel = os.path.relpath(os.path.join(dirpath, fn), root)
                    paths.append(norm(rel))
    return sorted(set(paths))


def init_schema(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS docs (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            path            TEXT UNIQUE NOT NULL,
            status          TEXT NOT NULL DEFAULT 'pending',
            status_reason   TEXT,
            checked_version INTEGER,
            last_checked    TEXT,
            content_hash    TEXT,
            exclude         INTEGER NOT NULL DEFAULT 0,
            added_at        TEXT NOT NULL,
            size_accepted   TEXT
        );
        CREATE TABLE IF NOT EXISTS meta (
            key   TEXT PRIMARY KEY,
            value TEXT
        );
    """)
    # Şema göçü (idempotent): eski canvas.db'lerde size_accepted yoktur.
    # ALTER TABLE ... ADD COLUMN veri kaybetmez; db'yi aynadan yeniden kurmaya
    # gerek yok (o yol, ayna bir sebeple bayatsa durum kaybettirirdi).
    cols = set(r[1] for r in conn.execute("PRAGMA table_info(docs)"))
    if "size_accepted" not in cols:
        conn.execute("ALTER TABLE docs ADD COLUMN size_accepted TEXT")
    conn.execute("INSERT OR IGNORE INTO meta(key,value) VALUES('current_convention_version',?)",
                 (DEFAULT_CONVENTION_VERSION,))
    conn.execute("INSERT OR IGNORE INTO meta(key,value) VALUES('schema_version',?)",
                 (SCHEMA_VERSION,))
    # schema_version aynadan gelmiş olabilir (eski değer) — göçten sonra güncelle.
    conn.execute("UPDATE meta SET value=? WHERE key='schema_version'", (SCHEMA_VERSION,))
    conn.commit()


def get_meta(conn, key, default=None):
    r = conn.execute("SELECT value FROM meta WHERE key=?", (key,)).fetchone()
    return r[0] if r else default


def current_version(conn):
    return int(get_meta(conn, "current_convention_version", DEFAULT_CONVENTION_VERSION))


def ensure_gitignore(root):
    """canvas.db (ve yan dosyaları) git'e girmesin; ayna canvas.tsv izlenir."""
    gip = os.path.join(root, ".gitignore")
    # Üçüncü desen GLOB'dur çünkü geçici ayna adı sürece özgüdür
    # (`canvas.tsv.tmp.<pid>` — gerekçe: write_mirror). Eski projelerde duran
    # birebir `canvas.tsv.tmp` satırı zararsız kalır; glob bir kez eklenir.
    needed = ["_dev/.audit/canvas.db", "_dev/.audit/canvas.db-*",
              "_dev/.audit/canvas.tsv.tmp*"]
    raw = ""
    if os.path.exists(gip):
        with open(gip, "r", encoding="utf-8", newline="") as f:
            raw = f.read()
    existing = [l.rstrip("\r\n") for l in raw.splitlines()]
    missing = [e for e in needed if e not in existing]
    if not missing:
        return
    # Bu dosya KULLANICININ; append ile körlemesine yazılmaz. İki kural:
    # (1) Son satırın newline'ı yoksa ÖNCE tamamlanır — yoksa eklenen satır
    #     kullanıcının son kuralına yapışır, o kural yok olur ve yerine hiçbir
    #     şeyi eşleşmeyen bir desen kalır (ölçüldü: `node_modules/` →
    #     `node_modules/_dev/.audit/canvas.tsv.tmp`). Sessiz ve kalıcıdır.
    # (2) Blok zaten varsa eksik satır bloğun İÇİNE, son canvas satırının
    #     ardına eklenir — dosyanın sonuna değil: son, başka bir başlığın altı
    #     olabilir (filoda 4 projede öyle) ve o blok silinince canvas satırı da
    #     birlikte gider. İkinci bir başlık da yazılmaz: başlık altındakileri
    #     etiketler, ikincisi kendinden öncekileri yanlış etiketler.
    eol = "\r\n" if "\r\n" in raw else "\n"
    lines = raw.splitlines(True)          # satır sonları korunur (CRLF dahil)
    last = -1
    for i, l in enumerate(lines):
        if l.lstrip("﻿").startswith("_dev/.audit/canvas."):
            last = i
    if last >= 0:
        if not lines[last].endswith(("\n", "\r")):
            lines[last] += eol
        lines[last + 1:last + 1] = [e + eol for e in missing]
    else:
        if lines and not lines[-1].endswith(("\n", "\r")):
            lines[-1] += eol
        if lines and lines[-1].strip():
            lines.append(eol)
        lines.append("# DevFlow audit canvas — yerel/geçici dosyalar "
                     "(git'e girmez; ayna canvas.tsv izlenir)" + eol)
        lines.extend(e + eol for e in missing)
    with open(gip, "w", encoding="utf-8", newline="") as f:
        f.write("".join(lines))
    # BİLDİRİM — sessiz yazma, projenin kendi kuralıyla çelişiyordu: filoda
    # projelerin bir bölümü `.gitignore`'u kanonlarındaki "sormadan değiştirme"
    # listesine koyuyor ve script o dosyaya zaten yazmış oluyor. Sayıyı buraya
    # gömme, ölç: kanonlarda `.gitignore` geçen projeleri say, sonra o projelerin
    # `.gitignore`'unda `_dev/.audit/canvas.` satırı var mı bak.
    # Yazımın kendisi doğrudur ve README'de beyanlıdır (kurulum değil script
    # ekler, her çağrıda kontrol eder) — eksik olan tek şey bildirimdi; sessiz
    # ihlal ile raporlanan altyapı dokunuşu arasındaki fark budur. stderr'e
    # yazılır: stdout komutun makine-okunur çıktısıdır (`next`/`status` onu
    # ayrıştırır), uyarı oraya karışmaz — `reconcile`'ın kayıp-yol uyarısıyla
    # aynı kulvar. Yalnız GERÇEKTEN yazıldığında basar; no-op sessizdir.
    print("ℹ️  .gitignore güncellendi (DevFlow canvas satırları: "
          + ", ".join(missing) + ") — altyapı dokunuşu, o turun commit'ine dahildir.",
          file=sys.stderr)


PRETTIER_IGNORE_LINE = ".claude/commands/"


def ensure_prettierignore(root):
    """Motor kopyası projenin KENDİ biçimlendiricisinden muaf kalsın.

    GEREKÇE (ampirik, filoda ölçüldü): prettier motor dosyalarını yeniden yazıyor
    (`*vurgu*` → `_vurgu_`); `lib/audit-conform.md`'nin çapa taraması adları `_`
    yapışık çıkarıyor ve projede GERÇEKTEN duran adlar "düşmüş" görünüyor —
    kalem 🔧 kulvarında olduğu için sorulmadan Tier-1 doktrin parent'ına yazılırdı.

    NEDEN BURADA, KURULUMDA DEĞİL (yalnız kurulumda da var, ama yetmiyor):
    kurulumun yazdığı satır yalnız **kurulum penceresinde** iner — o an prettier
    izi olmayan, korumadan önceki bir motorla kurulmuş ya da `.prettierignore`'u
    sonradan temizlenmiş projeyi kaçırır. Teslim yolu bu yüzden buradadır —
    `ensure_gitignore` ile aynı çağrı noktası: kurulum nasıl yapılmış olursa olsun,
    çapa taramasını çalıştıran ilk komut korumayı da yerine koyar (yani koruma,
    koruduğu taramadan ÖNCE iner).

    YALNIZ prettier yapılandırılmışsa yazar — yapılandırılmamış projede
    `.prettierignore` yaratmak projeye ait olmayan bir dosya eklemek olurdu.
    Tespit `"prettier"`i package.json'da bilerek GENİŞ arar (config anahtarı da,
    devDependency de sayılır): elde prettier varsa `npx prettier --write` bir
    komut uzaktadır, ve satır yazmanın maliyeti iki satırdır — kaçırmanınki
    sorulmadan doktrin parent'ına yazılan bir yanlış-pozitif.
    """
    pip_ = os.path.join(root, ".prettierignore")
    yapilandirilmis = os.path.exists(pip_)
    if not yapilandirilmis:
        try:
            for ad in os.listdir(root):
                if ad.startswith(".prettierrc") or ad.startswith("prettier.config."):
                    yapilandirilmis = True
                    break
        except OSError:
            return
    if not yapilandirilmis:
        pkg = os.path.join(root, "package.json")
        try:
            with open(pkg, "r", encoding="utf-8", errors="replace") as f:
                yapilandirilmis = '"prettier"' in f.read()
        except OSError:
            return
    if not yapilandirilmis:
        return
    raw = ""
    if os.path.exists(pip_):
        try:
            with open(pip_, "r", encoding="utf-8", newline="") as f:
                raw = f.read()
        except OSError:
            return
        # Eşleşme DİZE eşitliği değil, "motor kopyası zaten muaf mı" sorusudur:
        # elle yazılmış meşru biçimler var (`.claude/commands/**`, `.claude/`,
        # sondaki eğik çizgisiz hâl). Dize eşitliği ararsak pilotun kendi
        # satırının (`.claude/commands/**`) üstüne mükerrer bir satır yazardık.
        for l in raw.splitlines():
            s = l.strip().lstrip("﻿")
            if s.startswith("#"):
                continue
            if s.rstrip("/*") in (".claude/commands", ".claude"):
                return
    # Kullanıcının dosyası — `ensure_gitignore`'ın (1) numaralı kuralı burada da
    # geçerli: son satırın newline'ı yoksa ÖNCE tamamlanır, yoksa eklenen yorum
    # kullanıcının son kuralına yapışır ve o kural sessizce yok olur.
    eol = "\r\n" if "\r\n" in raw else "\n"
    parcalar = [raw]
    if raw and not raw.endswith(("\n", "\r")):
        parcalar.append(eol)
    if raw.strip():
        parcalar.append(eol)
    # Metin install.sh ve install.ps1 ile BİREBİR aynı ve bilerek ASCII: aynı depo
    # iki makinede kurulunca `.prettierignore` aynı içeriği taşımalı.
    parcalar.append("# DevFlow motoru - bicimlendirici motorun kendi metnini "
                    "yeniden yazmamali" + eol)
    parcalar.append(PRETTIER_IGNORE_LINE + eol)
    try:
        with open(pip_, "w", encoding="utf-8", newline="") as f:
            f.write("".join(parcalar))
    except OSError:
        sys.stderr.write("uyarı: .prettierignore yazılamadı, atlandı\n")
        return
    # Aynı bildirim ölçütü `ensure_gitignore`'daki gerekçeyle — burada
    # tekrarlanmaz. Kural yüzey saymaz: kullanıcının bir dosyasına sessizce
    # yazan her yol bildirir.
    print("ℹ️  .prettierignore güncellendi (" + PRETTIER_IGNORE_LINE
          + ") — motor kopyası biçimlendiriciden muaf tutuldu; o turun commit'ine dahildir.",
          file=sys.stderr)


_CONFLICT_MSG = (
    "hata: %s git-conflict marker içeriyor%s.\n"
    "Çözüm: marker'ları elle temizleyip her iki tarafın en güncel\n"
    "kaydını koru (daha yeni last_checked kazanır; aynı günse\n"
    "daha büyük checked_version), sonra `reconcile` çağır.\n"
    "Detay: README → 'Doküman Denetimi' → canvas.tsv merge conflict."
)


def validate_mirror(path):
    """Pre-flight conflict-marker kontrolü: sqlite3.connect() çağrılmadan ÖNCE
    çalıştırılır. Mirror bozuksa SystemExit; aksi halde sqlite3.connect() boş
    bir canvas.db yaratır, import_mirror içindeki guard SystemExit eder ama
    yan-etki olarak diskte boş db kalır → sonraki çağrı rebuild'i atlatır →
    canvas state sessizce kaybolur."""
    with open(path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f, 1):
            if line.startswith(("<<<<<<<", "=======", ">>>>>>>")):
                raise SystemExit(_CONFLICT_MSG % (path, " (satır %d)" % i))


def mirror_has_rows(path):
    """Aynada en az bir VERİ satırı var mı? (yorum ve başlık satırları sayılmaz.)

    Öksüz-boş-db onarımının koşuludur: kurtarılacak bir şey ancak aynada veri
    varsa vardır. Başlıklı-boş aynada rebuild'e girmek, import_mirror'ın
    "ayna kayıp" guard'ını haksız yere ateşler.
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip() or line.startswith("#"):
                    continue
                if line.split("\t", 1)[0].strip() == "id":   # başlık satırı
                    continue
                return True
    except OSError:
        return False
    return False


_MIRROR_LOST_MSG = (
    "hata: %s kullanılabilir bir ayna değil — %s.\n"
    "canvas.db oluşturulmadı.\n"
    "Kurtarma (tercih edilen): git checkout -- %s\n"
    "  (bu komut o dosyadaki commit'lenmemiş işi de siler — aynada commit'ten\n"
    "   sonra alınmış bir `exclude`/`accept-size` kararı varsa önce `git diff`\n"
    "   ile bak; çakışma çözülmemişse komut zaten çalışmaz. Başka bir dosyada\n"
    "   kullanma.)\n"
    "Kurtarılamıyorsa aynayı sil, kuyruğu diskten kur:\n"
    "  rm %s && python3 <script> --root <kök> reconcile\n"
    "  Bu yol `exclude` ve `accept-size` kayıtlarını KAYBEDER — ikisi yalnız aynada yaşar."
)


def import_mirror(conn, path):
    """canvas.db yoksa, git-tracked aynadan (canvas.tsv) durumu geri yükle.
    Conflict guard burada da var — savunma derinliği için; pratikte
    connect() içinden validate_mirror önce çağrıldığı için tetiklenmez."""
    meta = {}
    header = None
    data = []
    with open(path, "r", encoding="utf-8") as f:
        for ln, line in enumerate(f, 1):
            line = line.rstrip("\n")
            if line.startswith(("<<<<<<<", "=======", ">>>>>>>")):
                raise SystemExit(_CONFLICT_MSG % (path, " (satır %d)" % ln))
            if line.startswith("# meta:"):
                for pair in line[len("# meta:"):].split(";"):
                    if "=" in pair:
                        k, v = pair.split("=", 1)
                        meta[k.strip()] = v.strip()
                continue
            if line.startswith("#") or line == "":
                continue
            if header is None:
                header = line.split("\t")
                continue
            data.append((ln, line.split("\t")))
    for k, v in meta.items():
        # schema_version aynadan geri YÜKLENMEZ: o bir durum değil, çalışan
        # script'in şema kuşağıdır (init_schema göçü zaten yaptı). Aynadan
        # yüklersek eski değer geri gelir ve mirror "göç olmamış" gibi görünür.
        if k == "schema_version":
            continue
        conn.execute("INSERT OR REPLACE INTO meta(key,value) VALUES(?,?)", (k, v))
    if header is None or set(header) - set(MIRROR_COLUMNS):
        # Boş/başlıksız dosya "bozuk satır" değildir: onarılacak satır yoktur.
        # Genel hata metni ("bozuk satırı onarıp tekrar dene") burada çıkmaza
        # götürür, o yüzden kurtarma yolları doğrudan söylenir.
        raise SystemExit(_MIRROR_LOST_MSG % (
            path, "başlık satırı yok ya da tanınmıyor (dosya boş ya da yarım yazılmış)",
            path, path))
    # Aynı `path` iki kez geçebilir (merge her iki tarafı da bıraktıysa). Gerçek
    # kimlik path'tir (UNIQUE) — SON geçen kazanır. Tekilleştirme id ayrımından
    # ÖNCE yapılır, yoksa "son yazan kazanır" sözü id üzerinden terslenebilir.
    rows_by_path = {}
    for ln, fields in data:
        # Sağdan kesik satır sessizce kabul edilmemeli: dict(zip(...)) eksik
        # anahtarları None yapar ve TEK dokümanın denetim geçmişi/`exclude`/
        # `size_accepted` kaydı uyarısız silinir. Karşılaştırma dosyanın KENDİ
        # başlığıyla yapılır, len(MIRROR_COLUMNS) ile DEĞİL — filodaki aynaların
        # bir kısmı 9 sütunlu (şema-1) ve sabit 10'a karşı kontrol rebuild'i her
        # yerde kırardı. Sondaki BOŞ isteğe-bağlı alanın düşmesi hata değildir.
        if len(fields) > len(header) or set(header[len(fields):]) - MIRROR_OPTIONAL_TAIL:
            raise ValueError(
                "ayna satırı %d: %d alan var, başlıkta %d (%.60r)"
                % (ln, len(fields), len(header), "\t".join(fields)))
        rec = dict(zip(header, fields))
        rows_by_path[rec["path"]] = rec
    # `id` KORUNUR (ayna diff'i sabit kalsın) ama TEKRARLANAN id yeniden atanır:
    # iki makine paralel `reconcile` yaptığında AUTOINCREMENT aynı id'yi farklı
    # dokümanlara verir; merge sonrası INSERT OR REPLACE önceki kaydı sessizce
    # silerdi. Önce açık id'li satırlar, sonra yeniden atanacaklar yazılır —
    # auto id gerçek max'ın üstünden başlasın.
    seen, deferred, straight = set(), [], []
    for rec in rows_by_path.values():

        def val(k):
            v = rec.get(k, "")
            return None if v == "" else v

        rid = int(rec["id"]) if rec.get("id") else None
        row = (rid,
               rec["path"],
               rec.get("status") or "pending",
               val("status_reason"),
               int(rec["checked_version"]) if val("checked_version") else None,
               val("last_checked"),
               val("content_hash"),
               int(rec.get("exclude") or 0),
               rec.get("added_at") or today(),
               val("size_accepted"))  # eski (9 sütunlu) aynada yok → None
        if rid is None or rid in seen:
            deferred.append((None,) + row[1:])
        else:
            seen.add(rid)
            straight.append(row)
    for row in straight + deferred:
        conn.execute(
            "INSERT OR REPLACE INTO docs(id,path,status,status_reason,checked_version,"
            "last_checked,content_hash,exclude,added_at,size_accepted) "
            "VALUES(?,?,?,?,?,?,?,?,?,?)", row)
    conn.commit()
    # Dönen sayı DB'den okunur, `len(data)`'dan değil: mükerrer path tekilleşince
    # ikisi ayrışır ve operatörün merge kurtarmasında karşılaştıracağı sayının
    # dürüst olması gereken tek an burasıdır.
    return conn.execute("SELECT COUNT(*) FROM docs").fetchone()[0]


def write_mirror(conn, root):
    rows = conn.execute(
        "SELECT id,path,status,status_reason,checked_version,last_checked,"
        "content_hash,exclude,added_at,size_accepted FROM docs ORDER BY path").fetchall()
    cv = current_version(conn)
    sv = get_meta(conn, "schema_version", SCHEMA_VERSION)
    lines = [
        "# DevFlow audit canvas — otomatik üretildi (kaynak: canvas.db). Elle düzenleme.",
        "# meta: current_convention_version=%d; schema_version=%s" % (cv, sv),
        "\t".join(MIRROR_COLUMNS),
    ]
    for r in rows:
        # Ayna TSV'dir: hiçbir alan ham newline/tab taşıyamaz — biri kaçarsa satır
        # bölünür ya da sütun kayar ve git-tracked ayna sessizce zehirlenir (rebuild
        # o noktada patlar). Yazım anında koşulsuz düzleştir: girdi doğrulaması
        # (accept-size --reason) ilk savunma, bu ikincisi — format bir daha delinmesin.
        lines.append("\t".join(
            "" if v is None else " ".join(str(v).split()) for v in r))
    # Ayna git-tracked'dir: YERİNDE truncate edilmez. `open(...,"w")` dosyayı
    # açılış anında 0 bayta düşürür; o pencerede ölen bir süreç aynayı bozuk
    # commit'lenmeye hazır bırakır. Geçici dosya + os.replace (POSIX'te atomik).
    #
    # GEÇİCİ AD SÜRECE ÖZGÜDÜR ve `finally` yalnız KENDİ tmp'sini siler. Sabit
    # adla iki eş zamanlı yazıcı birbirinin tmp'sini siliyordu: `os.replace`
    # FileNotFoundError ile çöküyor ve o komut hiçbir şey yazmadan düşüyordu
    # (ölçüldü ve yeniden üretildi). Yol teorik değil: motor paralel oturumu
    # "beklenen hâl, arıza değil" sayar (kanon: Paralel Oturum Farkındalığı) ve
    # kanvasa İKİ ayrı komut ailesi yazar — `audit-docs` turu sürekli, faz
    # döngüsünün `accept-size` kapıları (research/verify/review/prd-refine)
    # kendi commit adımlarında. Aynı anda koşan iki oturumda çakışırlar.
    # Kapsam bilinçle dar: bu düzeltme ÇÖKMEYİ kaldırır, "son yazan kazanır"
    # semantiğini değiştirmez — o, aynanın türetilmiş olmasının sonucudur
    # (README → canvas.db asıl kaynaktır) ve ayrı bir karardır.
    # İKİNCİ BİLİNÇLİ KABUL: sabit adın bir yan faydası vardı — öksüz kalan
    # tmp'yi bir sonraki koşumun `open(...,"w")`'ı üzerine yazıyordu. Süreç
    # özgü adla o kendiliğinden toplanma düştü: `finally` normal ve istisnalı
    # çıkışta temizler, ama SERT ölümde (SIGKILL, güç kesintisi) kalan tmp
    # kalıcıdır. Süpürme YAZILMADI ve yazılmamalı — başkasının
    # `canvas.tsv.tmp.*` dosyasını yaş ya da pid-canlılığı ölçütüyle silmek,
    # yukarıda düzeltilen "başkasının tmp'sini sil" sınıfını geri getirir
    # (pid yeniden kullanılır). Artık zararsızdır: gitignore glob'u onu kapsar
    # (ensure_gitignore) ve ayna zaten türetilmiştir.
    tmp = "%s.tmp.%d" % (mirror_path(root), os.getpid())
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        os.replace(tmp, mirror_path(root))
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def connect(root):
    """DB'yi aç; yoksa ve ayna varsa aynadan rebuild et; şemayı garanti et."""
    os.makedirs(os.path.join(root, CANVAS_REL_DIR), exist_ok=True)
    dbp = db_path(root)
    mp = mirror_path(root)
    rebuilt = not os.path.exists(dbp) and os.path.exists(mp)
    orphan = False
    if rebuilt:
        # sqlite3.connect() çağrılmadan önce: hata atılırsa diskte boş db
        # kalmamalı (kalırsa sonraki çağrıda rebuilt=False → import_mirror
        # atlanır → veri kaybı).
        validate_mirror(mp)
    conn = sqlite3.connect(dbp)
    init_schema(conn)
    if (not rebuilt and os.path.exists(mp)
            and conn.execute("SELECT COUNT(*) FROM docs").fetchone()[0] == 0
            and mirror_has_rows(mp)):
        # ÖKSÜZ BOŞ DB — "db yok" kadar "db boş" da rebuild tetikler.
        # connect() şemayı kurduktan SONRA hata veren her komut (örn. canvas'ta
        # olmayan bir yola `accept-size`: faz döngüsünün boyut kapıları bunu
        # canvas'ı hiç kurulmamış projede yapar) diskte tam olarak bu hâli
        # bırakır: dosya var, içi boş. Ayna sonradan git'ten gelirse yukarıdaki
        # ölçüt rebuilt=False der, import atlanır ve ilk yazan komut aynayı bu
        # boşlukla ezer — denetim geçmişi (conformant/exclude/accept/hash)
        # sessizce silinir. Ölçüldü ve yeniden üretildi.
        # Koşulun üçüncü ayağı bilinçlidir ve AYNAYA bakar, diske değil:
        # kurtarılacak bir şey ancak aynada veri satırı varsa vardır. Aynası
        # başlıklı-boş olan projede öksüz db zararsızdır — orada rebuild'e
        # girmek aşağıdaki "ayna kayıp" guard'ını haksız yere ateşler ve
        # kurtarılabilir bir projeyi ölümcül hatayla durdurur (ölçüldü).
        # Diske bakmak yetmez: BU DALDA diskte doküman + başlıklı-boş ayna
        # meşrudur (kanvas dokümanlar eklenmeden önce yazılmış) — çünkü db'nin
        # kendisi zaten çöp, kaybedilecek state yok. Aşağıdaki db-YOK dalında
        # aynı kanıt hâlâ ÖLÜMCÜLDÜR ve öyle kalmalı: orada db gerçekten
        # kaybolmuş olabilir ve boş ayna truncate'in imzasıdır (§38 ölçümü).
        # Asimetri bilinçlidir: ayrım aynada değil, db'nin ne olduğunda.
        validate_mirror(mp)
        rebuilt = True
        orphan = True
    if rebuilt:
        # Rebuild ATOMİKTİR: import yarıda patlarsa diskte YARIM/BOŞ db bırakma.
        # Bırakılırsa sonraki çağrıda rebuilt=False olur, import atlanır ve script
        # "Toplam doküman: 0" diyerek sessizce çalışır — ardından ilk yazan komut
        # aynayı o boş durumla ezer ve canvas state'i git'e kayıp olarak yazılır.
        # (README'nin merge-conflict kurtarma tarifi tam bu yolu öneriyor.)
        try:
            n = import_mirror(conn, mp)
            # 0 kayıt: ayna var, başlık var, veri yok. Diskte doküman VARSA bu
            # yarım/ezilmiş bir aynadır — sessizce boş canvas kurmak, ilk yazan
            # komutun git-tracked aynayı o boşlukla ezmesi demektir. Diskte de
            # doküman yoksa bu meşru bir boş projedir, gürültülü çökertme.
            if n == 0 and iter_doc_paths(root):
                raise SystemExit(_MIRROR_LOST_MSG % (
                    mp, "başlık var ama hiç veri satırı yok, oysa diskte doküman var "
                        "(yarım yazılmış ya da ezilmiş)", mp, mp))
        except SystemExit:
            conn.close()
            os.remove(dbp)
            raise
        except Exception as e:
            conn.close()
            os.remove(dbp)
            raise SystemExit(
                "hata: canvas.tsv okunamadı (%s: %s).\n"
                "canvas.db oluşturulmadı — aynadaki bozuk satırı onarıp tekrar dene.\n"
                "Ayna TSV'dir: her doküman TEK satır, alanlar tab ile ayrılır." % (type(e).__name__, e))
        sys.stderr.write(
            "not: canvas.db %s, canvas.tsv aynasından %d kayıt geri yüklendi.\n"
            % ("boştu (başarısız bir komuttan kalmış)" if orphan else "yoktu", n))
    ensure_gitignore(root)
    ensure_prettierignore(root)
    return conn


# ----------------------------- komutlar -----------------------------

def cmd_reconcile(conn, root, args):
    disk = set(iter_doc_paths(root))
    dbset = set(r[0] for r in conn.execute("SELECT path FROM docs").fetchall())
    added = sorted(disk - dbset)
    # Kümeden düşen yolun dosyası diskte DURUYORSA satır SİLİNMEZ: `.claude/CLAUDE.md`
    # üyeliği içeriğe bağlıdır (protokol başlığı), başlık yeniden yazılırsa yol düşer
    # ama dosya durur — satırı silmek `exclude`/`checked_version`/`size_accepted` ve
    # tüm denetim geçmişini yok ederdi.
    # Üye OLMAYAN satır kuyrukta da görünmez, ama bunun için bir KAPSAM işareti
    # yazılmaz: `cmd_next`, `cmd_scan` ve `cmd_status` üyeliği `iter_doc_paths` ile
    # sorgu anında sorar. (Tek istisna aşağıdaki bayat-`urgent` normalleştirmesidir;
    # o bir kapsam işareti değil, koşulları ortadan kalkmış bir ÖLÇÜMÜN silinmesidir.)
    # Bu bilinçli bir tasarım kararıdır ve ölçümle
    # alınmıştır — üyeliği `exclude`+`status_reason` ile KALICILAŞTIRAN bir sürüm
    # denendi ve üç ayrı yerden bozuldu: `bump-version`/`invalidate`/`touch` üçü de
    # `status_reason`'ı NULL'lar (damga silinince geri alma kalıcı olarak ölür), ve
    # koşulsuz UPDATE kullanıcının ELLE verdiği `exclude`'u otomatiğe çevirip sonra
    # geri alıyordu. Durum tutmayan süzgeç bu sınıfın tamamını ortadan kaldırır:
    # senkronu bozulacak bir damga yoktur, kullanıcının `exclude`'una dokunulmaz.
    # Dal pratikte YALNIZ `.claude/CLAUDE.md` için ateşler: yol-tabanlı bir üye
    # kümeden ancak o yoldaki dosya yok olunca düşer (taşımak yolu değiştirir,
    # yani eski yol gerçekten yoktur ve silme doğrudur). Egzotik bir istisna
    # kalır — `os.walk` dizin symlink'lerini izlemez ama `os.path.isfile` izler,
    # yani bir `_dev/` alt dizini sonradan symlink olduysa altındaki satırlar
    # burada korunur. Davranış o hâlde de doğrudur.
    stale = sorted(dbset - disk)
    removed = [p for p in stale if not os.path.isfile(os.path.join(root, p))]
    kept = [p for p in stale if p not in removed]
    for p in added:
        conn.execute("INSERT INTO docs(path,status,added_at) VALUES(?,?,?)",
                     (p, "pending", today()))
    for p in removed:
        conn.execute("DELETE FROM docs WHERE path=?", (p,))
    # Kümeden düşen satırın tek yazılan alanı: bayat `urgent` YARGISI temizlenir.
    # Gerekçe ölçüldü — `scan` üyelik süzgecinden döndüğü, `invalidate`/`bump-version`
    # ise `urgent`'i bilinçle koruduğu için etiket başka hiçbir ROTALI komutla
    # düşmez; yol yeniden üye olduğunda `cmd_next` uçuş-anı ölçümüne hiç gelmeden
    # o bayat etiketten prio-0 dispatch üretir (45 baytlık bir dosya için
    # `urgent:token-hard` döndüğü ölçüldü). Kapsam dar tutuldu: yalnız `status`
    # sütunu, yalnız `urgent` satırda. `exclude`'a ve boyut kabulüne DOKUNULMAZ —
    # onlar kullanıcı kararıdır; `urgent` ise script'in kendi ölçümüdür ve ölçüm
    # koşulları ortadan kalkmıştır. `urgent:token-hard` motorun yazdığı tek urgent
    # gerekçesidir, yani normalleştirme hiçbir geçerli yargıyı düşürmez.
    for p in kept:
        conn.execute("UPDATE docs SET status='pending', status_reason=NULL "
                     "WHERE path=? AND status='urgent'", (p,))
    conn.commit()
    write_mirror(conn, root)
    # Toplam DB satır sayısıdır — `status`'ın bastığı sayıyla aynı olsun diye
    # (`len(disk)` korunan satırları saymaz, iki çıktı ıraksardı).
    total = conn.execute("SELECT COUNT(*) FROM docs").fetchone()[0]
    print("reconcile: +%d yeni, -%d silinen, toplam %d doküman"
          % (len(added), len(removed), total))
    for p in added:
        print("  + " + p)
    for p in removed:
        print("  - " + p)
    for p in kept:
        sys.stderr.write(
            "uyarı: %s izlenen kümeden düştü ama dosya diskte DURUYOR — satır ve "
            "geçmişi KORUNDU, kuyrukta görünmüyor (silinmedi, kapsam dışı da "
            "işaretlenmedi; üyelik her sorguda yeniden ölçülür). Parent'sa "
            "`## Oturum Başlangıç Protokolü` başlığını hâlâ taşıyor mu bak — "
            "başlık düzelince yol kendiliğinden geri döner. Dosya artık projenin "
            "dokümanı değilse yapacak bir şey yok; bu uyarı her `reconcile`'da "
            "yinelenir.\n" % p)


def parse_size_ack(raw):
    """`size_accepted` alanını çöz: 'tarih|hash|gerekçe' → (tarih, hash, gerekçe)."""
    if not raw:
        return None
    parts = raw.split("|", 2)
    if len(parts) != 3:
        return None
    return parts[0], parts[1], parts[2]


def size_ack_active(raw, cur_hash):
    """Kabul HÂLÂ geçerli mi? Kabul, verildiği andaki içerik hash'ine bağlıdır —
    doküman değişmişse kabul düşer (süresiz muafiyet yok)."""
    ack = parse_size_ack(raw)
    return bool(ack) and ack[1] == cur_hash


def cmd_scan(conn, root, args):
    rows = conn.execute(
        "SELECT path,status,status_reason,size_accepted FROM docs WHERE exclude=0").fetchall()
    members = set(iter_doc_paths(root))
    became, cleared, lapsed, accepted = [], [], [], []
    for path, status, reason, ack_raw in rows:
        full = os.path.join(root, path)
        if not os.path.isfile(full):
            continue
        # Üyelik sorgu anında ölçülür (tek ev: `iter_doc_paths`). Diskte duran ama
        # artık üye olmayan satır — parent olmaktan çıkmış `.claude/CLAUDE.md` —
        # kuyruğa girmez: `is_devflow_parent` kimlik testi kadar güvenlik testidir,
        # kullanıcının global kural kopyasına proje doktrini yazılmasını engeller.
        if path not in members:
            continue
        try:
            data = open(full, "rb").read()
            chars = len(data.decode("utf-8", errors="replace"))
        except OSError:
            continue
        esttok = chars * 100 // 169  # doc-scan.sh ile aynı kaba tahmin (~char/1,69, kalibrasyon: doc-scan.sh başlığı); bytes→decode sayımı wc -m'e hizalı (CRLF dahil)
        if esttok > TOKEN_HARD:
            if ack_raw is not None:
                # Kabul var — hâlâ geçerli mi? (hash değiştiyse düşer)
                if size_ack_active(ack_raw, hashlib.sha256(data).hexdigest()):
                    accepted.append(path)
                    # Kabul edilmiş doküman boyut yüzünden urgent TUTULMAZ:
                    # conformance kuyruğuna akar (kulvar değişimi, muafiyet değil).
                    if status == "urgent" and (reason or "").startswith("urgent:token-hard"):
                        conn.execute("UPDATE docs SET status='pending', status_reason=NULL "
                                     "WHERE path=?", (path,))
                    continue
                lapsed.append(path)
                conn.execute("UPDATE docs SET size_accepted=NULL WHERE path=?", (path,))
            if status != "urgent":
                became.append(path)
            conn.execute("UPDATE docs SET status='urgent', status_reason=? WHERE path=?",
                         ("urgent:token-hard", path))
        else:
            # Gerekçesi olmayan (ya da `urgent:` öneki taşımayan) `urgent` GEÇERSİZ
            # bir hâldir: hiçbir kulvara yönlenmez (audit-docs Adım 3'ün dağıtım
            # tablosu `urgent:*` kalıbıyla eşleşir, gerekçesiz `urgent` eşleşMEZ),
            # `scan` onu temizlemezdi ve doküman her turda bir
            # prio-0 slot tutardı. Eşiğin altındaysa normalize edilir.
            if status == "urgent" and (
                    (reason or "").startswith("urgent:token-hard")
                    or not (reason or "").startswith("urgent:")):
                cleared.append(path)
                conn.execute("UPDATE docs SET status='pending', status_reason=NULL WHERE path=?",
                             (path,))
            if ack_raw is not None:
                # Eşiğin altına indi — kabul konusuz kaldı, kaydı bırakma.
                conn.execute("UPDATE docs SET size_accepted=NULL WHERE path=?", (path,))
    conn.commit()
    write_mirror(conn, root)
    print("scan: %d acil (boyut) işaretlendi, %d temizlendi (eşik ~%d token)"
          % (len(became), len(cleared), TOKEN_HARD))
    for p in became:
        print("  ! " + p)
    if accepted:
        print("scan: %d doküman eşik üstü ama boyut kabulü KAYITLI (conformance kuyruğunda):"
              % len(accepted))
        for p in accepted:
            print("  = " + p)
    if lapsed:
        print("scan: %d dokümanın boyut kabulü DÜŞTÜ (içerik değişti) → yeniden acil:"
              % len(lapsed))
        for p in lapsed:
            print("  × " + p)


def cmd_next(conn, root, args):
    if args.limit < 1:
        raise SystemExit("hata: --limit en az 1 olmalı (verilen: %d)" % args.limit)
    cv = current_version(conn)
    rows = conn.execute(
        "SELECT path,status,status_reason,checked_version,content_hash,last_checked,"
        "size_accepted FROM docs WHERE exclude=0").fetchall()
    members = set(iter_doc_paths(root))
    cand = []  # (öncelik, tier, last_checked, path, gerekçe)
    for path, status, reason, cver, chash, lchecked, ack_raw in rows:
        full = os.path.join(root, path)
        if not os.path.isfile(full):
            continue
        # Üyelik sorgu anında ölçülür — gerekçe `cmd_scan`'in aynı satırındadır.
        if path not in members:
            continue
        t = tier_for(path)
        # Boyut kabulü bu iki kapının ikisini de aşmalı: DB'deki `urgent` etiketi
        # ve aşağıdaki uçuş-anı ölçümü. Yalnız biri delinirse kabul NO-OP olur.
        size_ack = ack_raw is not None
        if status == "urgent" and not (
                size_ack and (reason or "").startswith("urgent:token-hard")):
            cand.append((0, t, lchecked or "", path, reason or "urgent"))
            continue
        # Boyut kırmızı çizgisi uçuş-anında da tespit edilir: dosya hash için
        # zaten okunuyor; aynı bytes'tan char sayılır, eşik aşımı anında
        # urgent:token-hard döner. DB'YE YAZILMAZ — etiket yalnız çıktıda,
        # kalıcılaştırma scan'de kalır (README: salt-okunur next aynayı yazmaz).
        try:
            with open(full, "rb") as f:
                data = f.read()
        except OSError:
            sys.stderr.write("uyarı: okunamadı, atlandı: %s\n" % path)
            continue
        chars = len(data.decode("utf-8", errors="replace"))  # cmd_scan ile aynı sayım
        cur_hash = hashlib.sha256(data).hexdigest()
        if chars * 100 // 169 > TOKEN_HARD and not size_ack_active(ack_raw, cur_hash):
            # Kabul yoksa ya da kabul edildiği hâlden sonra doküman değiştiyse
            # (kabul düştü) boyut yine acildir. Kalıcılaştırma `scan`'de.
            cand.append((0, t, lchecked or "", path, "urgent:token-hard"))
            continue
        if cver is None:
            cand.append((1, t, lchecked or "", path, "conformance:never"))
        elif int(cver) < cv:
            cand.append((1, t, lchecked or "", path, "conformance:version-outdated"))
        elif chash != cur_hash:
            cand.append((1, t, lchecked or "", path, "conformance:changed"))
        elif args.rotate and (lchecked or "") < today():
            # Rotasyona aynı gün re-touch'lanan dokümanları katma — bugün denetlenen
            # doküman yarın tekrar en-eski olarak başa gelmesin; rotasyon doğal bir
            # günlük döngüye dönüşür (yaş-öncelikli sıralama zaten en eskiyi seçer,
            # bu skip aynı-gün tekrarını engeller).
            cand.append((2, t, lchecked or "", path, "rotation:oldest"))
    # urgent/conformance bucket'ı tier-first ve tier İÇİNDE doktrin parent'ı ilk;
    # rotation bucket'ı (prio==2) yaş-first (last_checked tier'in önünde) →
    # "en uzun süredir denetlenmemiş" sözünü tutar.
    # PARENT-RANK NEDEN VAR (ölçüldü, pilot `EnderLLC/DevToolBox`): parent'ı
    # TIER1_DOCS'a koymak yasağı tutmuyor (bkz. TIER1_DOCS üstündeki NOT). Doktrin
    # çocukları bölmeyle YENİ doğar; `reconcile` yeni yolu `last_checked`'i NULL
    # bırakarak ekler ve boş dize her tarihten küçüktür — yani parent, kendi
    # @import ettiği çocuklarının ARKASINA düşer (pilotta 5. sıra). Mekanizma
    # `bump-version` DEĞİLDİR: o `last_checked`'e dokunmaz, yalnız durumu
    # `pending`e çeker (bkz. cmd_bump_version) — kusuru doğuran şey yeni doğan
    # yolun boş tarihidir.
    # KURALIN KAPSAMI, mekanizmasıyla aynı genişlikte yazılıyor: rank yalnız
    # kendi (öncelik, tier) grubunun içinde sıralar. Farklı önceliğe geçmez —
    # `urgent` satırı taşıyan bir doküman parent'ın `conformance` satırının
    # önünde kalır, ve bu bilinçlidir: o kulvarın işi mekanik/boyuttur, dokümanı
    # parent'ın kanonuna göre uygunlamaz. Kanon gerektiren hâlin tabanı
    # `audit-docs.md` → Kulvarın tabanı'ndadır.
    # ROTASYON DALINA KONMAZ: oradaki söz yaş sözüdür ve parent istisnası tanımaz;
    # kusur da orada doğmaz (rotation adayı olmak `checked_version`'ın dolu
    # olmasını gerektirir, `touch` ikisini birlikte yazar → boş tarih oluşmaz).
    cand.sort(key=lambda c: (c[0], c[2], c[1], c[3]) if c[0] == 2
              else (c[0], c[1], 0 if c[3] in PARENT_DOCS else 1, c[2], c[3]))
    if not cand:
        print("# kuyrukta hazır doküman yok (her şey güncel konvansiyona uygun)")
        return
    for _prio, _tier, _lc, path, reason in cand[:args.limit]:
        print("%s\t%s" % (path, reason))


def cmd_touch(conn, root, args):
    path = norm(args.path)
    if not conn.execute("SELECT 1 FROM docs WHERE path=?", (path,)).fetchone():
        sys.stderr.write("hata: '%s' canvas'ta yok (önce reconcile?)\n" % path)
        sys.exit(1)
    full = os.path.join(root, path)
    chash = sha256_file(full) if os.path.isfile(full) else None
    conn.execute(
        "UPDATE docs SET last_checked=?, checked_version=?, content_hash=?, "
        "status=?, status_reason=NULL WHERE path=?",
        (today(), current_version(conn), chash, args.status, path))
    conn.commit()
    write_mirror(conn, root)
    print("touch: %s → %s (v%d, %s)" % (path, args.status, current_version(conn), today()))


def cmd_invalidate(conn, root, args):
    # Filtreyi belirle: --all veya --filter GLOB (biri zorunlu — yanlışlıkla tüm
    # canvas'ı vuran çıplak `invalidate` çağrısını engellemek için).
    flt = "*" if args.all else args.filter
    hit = [p for (p,) in conn.execute("SELECT path FROM docs").fetchall()
           if fnmatch.fnmatch(p, flt)]
    for p in hit:
        # status='pending' de eklenir: salt checked_version=NULL bırakırsak
        # eski 'conformant' status sütunda kalır → `status` raporu yanıltıcı
        # ("conformant" gösterir ama `next` aynı dokümanı `conformance:never`
        # döner). 'urgent' bayraklılar urgent kalır — mekanik acil bağımsız.
        conn.execute(
            "UPDATE docs SET checked_version=NULL, "
            "status=CASE WHEN status='urgent' THEN status ELSE 'pending' END, "
            "status_reason=CASE WHEN status='urgent' THEN status_reason ELSE NULL END "
            "WHERE path=?", (p,))
    conn.commit()
    write_mirror(conn, root)
    print("invalidate: %d doküman yeniden kuyruğa alındı (filtre: %s)" % (len(hit), flt))


def cmd_bump_version(conn, root, args):
    nv = current_version(conn) + 1
    conn.execute("UPDATE meta SET value=? WHERE key='current_convention_version'", (str(nv),))
    # `invalidate` ile AYNI gerekçe, salt **versiyon** artışı için: versiyonu
    # artırıp status'ü bırakırsak eski 'conformant' sütunda kalır → `status`
    # raporu "conformant" der ama `next` aynı dokümanı
    # `conformance:version-outdated` döner. 'urgent' korunur (mekanik acil
    # versiyondan bağımsızdır). `checked_version`'a DOKUNULMAZ: invalidate onu
    # NULL'lar, bump'ta geçmiş korunmalı — yoksa gerekçe `conformance:never`'a
    # düşer. `exclude` filtresi BİLİNÇLİ olarak YOK: exclude'lu doküman kuyruğa
    # zaten girmiyor, ama sonradan include edilirse eski versiyonda 'conformant'
    # etiketiyle geri dönmemeli.
    conn.execute(
        "UPDATE docs SET status=CASE WHEN status='urgent' THEN status ELSE 'pending' END, "
        "status_reason=CASE WHEN status='urgent' THEN status_reason ELSE NULL END "
        "WHERE checked_version IS NOT NULL AND checked_version < ?", (nv,))
    conn.commit()
    write_mirror(conn, root)
    print("bump-version: konvansiyon versiyonu → %d (eski-versiyonlu tüm dokümanlar artık due; exclude hariç)" % nv)


def cmd_set_exclude(conn, root, args, value):
    path = norm(args.path)
    n = conn.execute("UPDATE docs SET exclude=? WHERE path=?", (value, path)).rowcount
    conn.commit()
    if not n:
        sys.stderr.write("hata: '%s' canvas'ta yok\n" % path)
        sys.exit(1)
    write_mirror(conn, root)
    print("%s: %s" % ("include" if value == 0 else "exclude", path))


def cmd_accept_size(conn, root, args):
    """Boyut aşımını KAYITLI olarak kabul et — `exclude` değil, kulvar değişimi.

    Giriş koşulu doküman kuralıdır ve tek evi `lib/audit-mekanik.md` → Boyut
    kırmızı-çizgisi'dir (giriş yolları orada sayılır). Ortak yan: kabul,
    serbest bir bayrak değil
    KULLANICININ KARARININ kaydıdır. Script bunu zorlayamaz, ama --reason'ı
    zorunlu tutarak kaydın gerekçesiz kalmasını engeller.

    Aşağıdaki eşik kontrolü bir yan etki değil, o kuralın uygulama sırasını
    dayatır: uygulanmış bir bölme geri alınmadan bu komut çağrılırsa doküman
    hâlâ eşiğin altındadır ve kabul reddedilir — önce geri al, sonra kaydet.
    """
    path = norm(args.path)
    row = conn.execute("SELECT exclude FROM docs WHERE path=?", (path,)).fetchone()
    if not row:
        sys.stderr.write("hata: '%s' canvas'ta yok (önce reconcile?)\n" % path)
        sys.exit(1)
    if row[0]:
        # `exclude`'lu doküman hiçbir kuyrukta değildir; ona "uygunluk kuyruğunda
        # kalıyor" demek yalan olur ve kayıt `status`'ta (WHERE exclude=0) görünmez.
        sys.stderr.write(
            "hata: '%s' kapsam dışı (`exclude`) — boyut kabulü anlamsız, doküman\n"
            "zaten hiçbir kuyrukta değil. Önce `include`, sonra `accept-size`.\n" % path)
        sys.exit(1)
    full = os.path.join(root, path)
    if not os.path.isfile(full):
        sys.stderr.write("hata: dosya yok: %s\n" % path)
        sys.exit(1)
    data = open(full, "rb").read()
    esttok = len(data.decode("utf-8", errors="replace")) * 100 // 169
    if esttok <= TOKEN_HARD:
        sys.stderr.write(
            "hata: '%s' zaten eşiğin altında (~%d ≤ %d token) — kabul edilecek bir "
            "boyut aşımı yok.\n" % (path, esttok, TOKEN_HARD))
        sys.exit(1)
    # Gerekçe TEK SATIRA indirgenir. Ayna TSV'dir: ham newline satırı ikiye böler
    # (git-tracked ayna zehirlenir), ham tab sütun kaydırır. '|' de alan ayırıcısıdır.
    # Yasaklamak yerine normalize ediyoruz — kullanıcı metnini reddetmek yerine taşımak.
    reason = " ".join(args.reason.replace("|", "/").split())
    if not reason:
        sys.stderr.write("hata: --reason boş olamaz — kullanıcının kararını yaz.\n")
        sys.exit(1)
    chash = hashlib.sha256(data).hexdigest()
    conn.execute("UPDATE docs SET size_accepted=?, "
                 "status=CASE WHEN status='urgent' AND status_reason LIKE 'urgent:token-hard%' "
                 "THEN 'pending' ELSE status END, "
                 "status_reason=CASE WHEN status='urgent' AND status_reason LIKE 'urgent:token-hard%' "
                 "THEN NULL ELSE status_reason END "
                 "WHERE path=?",
                 ("%s|%s|%s" % (today(), chash, reason), path))
    conn.commit()
    write_mirror(conn, root)
    print("accept-size: %s (~%d token) — boyut kulvarı kapandı, uygunluk kuyruğunda kalıyor."
          % (path, esttok))
    print("   gerekçe: %s" % reason)
    print("   NOT: kabul bu içeriğe bağlıdır; doküman değişirse kendiliğinden düşer.")


def cmd_unaccept_size(conn, root, args):
    path = norm(args.path)
    row = conn.execute("SELECT size_accepted FROM docs WHERE path=?", (path,)).fetchone()
    if not row:
        sys.stderr.write("hata: '%s' canvas'ta yok (önce reconcile?)\n" % path)
        sys.exit(1)
    if row[0] is None:
        print("unaccept-size: %s zaten kabul kaydı taşımıyor — değişiklik yok." % path)
        return
    conn.execute("UPDATE docs SET size_accepted=NULL WHERE path=?", (path,))
    conn.commit()
    write_mirror(conn, root)
    print("unaccept-size: %s — kabul kaldırıldı (sonraki `scan` boyutu yeniden yargılar)." % path)


def cmd_status(conn, root, args):
    print("Konvansiyon versiyonu: %d" % current_version(conn))
    print("Toplam doküman: %d" % conn.execute("SELECT COUNT(*) FROM docs").fetchone()[0])
    # Sayaçlar ÜYELİĞE göre bölünür: `next`/`scan` üye olmayan satırı hiç görmez,
    # bu yüzden onları canlı kuyruk sayacında göstermek `status`'u yalancı yapardı
    # (aşağıdaki `accepted` yorumuyla aynı ilke: iki çıktı birbirini yalanlamamalı).
    # Üye olmayan satır sessizce kaybolmaz da — kendi borç satırında görünür.
    members = set(iter_doc_paths(root))
    live, orphan = {}, []
    for path, status in conn.execute("SELECT path,status FROM docs WHERE exclude=0"):
        if path in members:
            live[status] = live.get(status, 0) + 1
        else:
            orphan.append(path)
    for status in sorted(live):
        print("  %-12s %d" % (status, live[status]))
    print("  excluded     %d" % conn.execute(
        "SELECT COUNT(*) FROM docs WHERE exclude=1").fetchone()[0])
    # BORÇ satırı: diskte duruyor ama izlenen kümede değil (parent olmaktan çıkmış
    # `.claude/CLAUDE.md`). Kuyruğa girmez, geçmişi durur; `reconcile` her koşuda
    # uyarır. Sıfırsa basılmaz — gürültü yapmasın.
    if orphan:
        print("  üye değil    %d" % len(orphan))
        for p in orphan:
            print("     ~ %s  (izlenen kümede yok; `reconcile` gerekçeyi yazar)" % p)
    # `accepted` de `excluded` gibi bir BORÇ kalemidir, iş listesi değil: doküman
    # kırmızı çizginin üstünde durmaya devam eder, yalnız acil kulvarı kapalıdır.
    # Farkı — excluded'ın drift'i sessizdir, accepted uygunluk denetimi almaya
    # devam eder. Rapor manifestinde tek satır olarak basılır (audit-docs Adım 1).
    acc = conn.execute(
        "SELECT path,size_accepted FROM docs WHERE exclude=0 AND size_accepted IS NOT NULL "
        "ORDER BY path").fetchall()
    # Kabul hash'e bağlıdır: doküman değiştiyse kabul DÜŞMÜŞTÜR ve `next` onu yine
    # `urgent` döner. Sayacı canlı gerçeğe göre bas — aksi halde `status` "accepted"
    # derken `next` "urgent" der ve iki çıktı birbirini yalanlar.
    canli, dusen = [], []
    for path, raw in acc:
        full = os.path.join(root, path)
        cur = sha256_file(full) if os.path.isfile(full) else None
        (canli if size_ack_active(raw, cur) else dusen).append((path, raw))
    print("  accepted     %d" % len(canli))
    for path, raw in canli:
        parsed = parse_size_ack(raw)
        if parsed:
            print("     = %s  (%s — %s)" % (path, parsed[0], parsed[2]))
        else:
            print("     = %s  (kayıt bozuk: %r)" % (path, raw))
    for path, raw in dusen:
        parsed = parse_size_ack(raw)
        print("     × %s  (kabul DÜŞTÜ — içerik değişti%s; sonraki `scan` acile alır)"
              % (path, ", kayıt: " + parsed[0] if parsed else ""))


def main():
    ap = argparse.ArgumentParser(description="DevFlow audit canvas (rolling audit kuyruğu)")
    ap.add_argument("--root", default=os.getcwd(), help="proje kökü (varsayılan: cwd)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("reconcile", help="doküman listesini gerçekle uzlaştır")
    sub.add_parser("scan", help="mekanik acil tespit (boyut)")
    p = sub.add_parser("next", help="sıradaki doküman(lar)")
    p.add_argument("--limit", type=int, default=1)
    p.add_argument("--rotate", action="store_true", help="uygun dokümanları da rotasyona kat")
    p = sub.add_parser("touch", help="dokümanı kontrol edildi işaretle")
    p.add_argument("path")
    p.add_argument("--status", default="conformant",
                   choices=["conformant", "pending", "urgent"])
    p = sub.add_parser("invalidate", help="yeniden kuyruğa al (--filter veya --all zorunlu)")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--filter", help="fnmatch GLOB pattern (örn. '_dev/modules/*')")
    g.add_argument("--all", action="store_true", help="TÜM dokümanları yeniden kuyruğa al")
    sub.add_parser("bump-version", help="konvansiyon versiyonunu artır")
    p = sub.add_parser("exclude",
                       help="kalıcı kapsam-dışı (yalnız dondurulmuş/tarihsel; boyut için accept-size)")
    p.add_argument("path")
    p = sub.add_parser("include", help="kapsam-dışı işaretini kaldır")
    p.add_argument("path")
    p = sub.add_parser("accept-size",
                       help="boyut aşımını kayıtlı olarak kabul et (exclude DEĞİL)")
    p.add_argument("path")
    p.add_argument("--reason", required=True,
                   help="kabulün gerekçesi (kullanıcı kararı; '|' ve satır sonları tek boşluğa/'/'e normalize edilir)")
    p = sub.add_parser("unaccept-size", help="boyut kabulünü geri al")
    p.add_argument("path")
    sub.add_parser("status", help="özet")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    conn = connect(root)
    try:
        if args.cmd == "reconcile":
            cmd_reconcile(conn, root, args)
        elif args.cmd == "scan":
            cmd_scan(conn, root, args)
        elif args.cmd == "next":
            cmd_next(conn, root, args)
        elif args.cmd == "touch":
            cmd_touch(conn, root, args)
        elif args.cmd == "invalidate":
            cmd_invalidate(conn, root, args)
        elif args.cmd == "bump-version":
            cmd_bump_version(conn, root, args)
        elif args.cmd == "exclude":
            cmd_set_exclude(conn, root, args, 1)
        elif args.cmd == "include":
            cmd_set_exclude(conn, root, args, 0)
        elif args.cmd == "accept-size":
            cmd_accept_size(conn, root, args)
        elif args.cmd == "unaccept-size":
            cmd_unaccept_size(conn, root, args)
        elif args.cmd == "status":
            cmd_status(conn, root, args)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
