#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DevFlow — Audit Canvas (rolling audit kuyruğu)

Bir DevFlow projesinin dokümanlarını (kök CLAUDE.md + _dev/**/*.md) izleyen,
SQLite tabanlı bir "kontrol kuyruğu" yönetir. Asıl kaynak _dev/'in kendisidir;
bu canvas yalnızca "hangi doküman ne zaman / hangi konvansiyon versiyonuna göre
kontrol edildi" durumunu tutan, yeniden üretilebilir bir cursor'dır.

- Store: _dev/.audit/canvas.db   (SQLite; gitignore'lı, yerel)
- Ayna:  _dev/.audit/canvas.tsv  (git-tracked; her yazımda deterministik üretilir;
         canvas.db kaybolursa buradan rebuild edilir)

Bu script dokümanları ASLA değiştirmez (READ-ONLY). Yalnızca .audit/ altına ve
(eksik canvas satırı varsa) kök .gitignore'a yazar. Tüm düzeltmeler Claude + kullanıcı onayı
üzerinden yapılır; script sadece tarar, seçer, durumu tutar.

Bağımlılık: yalnızca python3 stdlib (sqlite3 + hashlib) — sqlite3 CLI gerekmez.

Komutlar:
  reconcile            _dev/ + CLAUDE.md tara; yeni dokümanı ekle, silineni çıkar
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
# Aynı bucket'ta (urgent / conformance) düşük tier önce gider; rotation bucket'ında
# ise yaş öne geçer (en eski önce) — proaktif rotasyonun "en uzun süredir
# denetlenmemiş" sözünü tutmak için (bkz. cmd_next sort).
#   Tier 1 = çekirdek yaşayan dokümanlar (her oturum okunur, blast radius geniş)
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
TIER1_PREFIXES = ("_dev/claude/",)
TIER1_DOCS = {
    "CLAUDE.md",
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


def iter_doc_paths(root):
    """İzlenecek doküman seti: kök CLAUDE.md + _dev/**/*.md (.audit/ hariç)."""
    paths = []
    if os.path.isfile(os.path.join(root, "CLAUDE.md")):
        paths.append("CLAUDE.md")
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
    needed = ["_dev/.audit/canvas.db", "_dev/.audit/canvas.db-*",
              "_dev/.audit/canvas.tsv.tmp"]
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


_MIRROR_LOST_MSG = (
    "hata: %s kullanılabilir bir ayna değil — %s.\n"
    "canvas.db oluşturulmadı.\n"
    "Kurtarma (tercih edilen): git checkout -- %s\n"
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
    tmp = mirror_path(root) + ".tmp"
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
    if rebuilt:
        # sqlite3.connect() çağrılmadan önce: hata atılırsa diskte boş db
        # kalmamalı (kalırsa sonraki çağrıda rebuilt=False → import_mirror
        # atlanır → veri kaybı).
        validate_mirror(mp)
    conn = sqlite3.connect(dbp)
    init_schema(conn)
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
            "not: canvas.db yoktu, canvas.tsv aynasından %d kayıt geri yüklendi.\n" % n)
    ensure_gitignore(root)
    return conn


# ----------------------------- komutlar -----------------------------

def cmd_reconcile(conn, root, args):
    disk = set(iter_doc_paths(root))
    dbset = set(r[0] for r in conn.execute("SELECT path FROM docs").fetchall())
    added = sorted(disk - dbset)
    removed = sorted(dbset - disk)
    for p in added:
        conn.execute("INSERT INTO docs(path,status,added_at) VALUES(?,?,?)",
                     (p, "pending", today()))
    for p in removed:
        conn.execute("DELETE FROM docs WHERE path=?", (p,))
    conn.commit()
    write_mirror(conn, root)
    print("reconcile: +%d yeni, -%d silinen, toplam %d doküman"
          % (len(added), len(removed), len(disk)))
    for p in added:
        print("  + " + p)
    for p in removed:
        print("  - " + p)


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
    became, cleared, lapsed, accepted = [], [], [], []
    for path, status, reason, ack_raw in rows:
        full = os.path.join(root, path)
        if not os.path.isfile(full):
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
            # bir hâldir: hiçbir kulvara yönlenmez (audit-docs Adım 2 dağıtımı
            # `urgent:*` kalıbıyla eşleşir, gerekçesiz `urgent` eşleşMEZ),
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
    cand = []  # (öncelik, tier, last_checked, path, gerekçe)
    for path, status, reason, cver, chash, lchecked, ack_raw in rows:
        full = os.path.join(root, path)
        if not os.path.isfile(full):
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
    # urgent/conformance bucket'ı tier-first; rotation bucket'ı (prio==2) yaş-first
    # (last_checked tier'in önünde) → "en uzun süredir denetlenmemiş" sözünü tutar.
    cand.sort(key=lambda c: (c[0], c[2], c[1], c[3]) if c[0] == 2 else (c[0], c[1], c[2], c[3]))
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

    Giriş koşulu doküman kuralıdır (audit-docs → Section 1): kabul, ❓ bölme/
    sıkıştırma sorusu sorulduktan SONRA kullanıcının erteleme/ret kararının
    kaydıdır; serbest bir bayrak değildir. Script bunu zorlayamaz, ama
    --reason'ı zorunlu tutarak kaydın gerekçesiz kalmasını engeller.
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
    for status, n in conn.execute(
            "SELECT status, COUNT(*) FROM docs WHERE exclude=0 GROUP BY status ORDER BY status"):
        print("  %-12s %d" % (status, n))
    print("  excluded     %d" % conn.execute(
        "SELECT COUNT(*) FROM docs WHERE exclude=1").fetchone()[0])
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
