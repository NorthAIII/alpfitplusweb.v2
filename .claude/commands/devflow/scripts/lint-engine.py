#!/usr/bin/env python3
"""DevFlow motor lint'i — v1.

NE YAPAR: motorun kendi `.md` dosyalarını mekanik olarak yakalanabilen kusur sınıfları için tarar.
NE YAPMAZ: düzeltmez. Script beyin (mekanik tespit, READ-ONLY), Claude yargı — kanonun kendi kuralı.

KULLANIM (motor deposunun kökünden):
    python3 commands/devflow/scripts/lint-engine.py [kök]
    python3 commands/devflow/scripts/lint-engine.py --json     # makine okuru

ÇIKIŞ: bulgu yoksa 0, varsa 1. **Bayrak, kapı değil** — `exit 1` "dur" değil "bak" demektir;
bulguların gerçek mi yanlış-pozitif mi olduğuna Claude karar verir.

İKİ DÜZENDE DE KOŞAR: motor deposunda `commands/devflow/`, kurulu projede `.claude/commands/devflow/`.
İkincisinin işi, kaynak depo elde yokken bir projenin vendored kopyasını **aşağıdaki KAPSAM bloğundaki
sınıflar için** taramaktır (sayıyı buradan okuma, blok kendisi sayar).
⚠️ **Prettier'ın `_` emphasis hasarını YAKALAMAZ** — fikstürde üretildi, tarama hiç bulgu vermedi:
`*vurgu*` → `_vurgu_` dönüşümü ne kod çitini ne `**` dengesini ne de bir yolu bozar. O sınıfın çaresi
bu script değil kurulumun `.prettierignore` muafiyetidir — ama o muafiyet **prettier'a özgü ve ileriye
dönüktür**: başka bir biçimlendirici, ya da koruma inmeden önce yazılmış hasar için `lib/audit-conform.md`
→ Adım 1'in çapa süzgeci ayrıca gerekir (orada adıyla sayılı). Ölçümün ve filo maruziyetinin kaydı motor
deposunun yol haritasındadır (kurulumlara kopyalanmaz; buradan adresle atıf yapılmaz). Motor ağacı **hiçbir düzende** bulunamazsa hata
verip 2 ile çıkar, sessizce "0 bulgu" demez ("boş çıktı 'sorun yok' değil 'bilgi yok'tur" — kanonun
yasakladığı okuma).

KAPSAM (v1) — sınıflar aşağıda sayılıdır (gerekçeleri motor deposunun yol
haritasındadır; o dosya kurulumlara KOPYALANMAZ, bu yüzden buradan adresle
atıf yapılmaz):
  B  ölü çapa       — motor metninde geçen doküman yolu gerçekte var mı. Yalnız `lib/` · `templates/` ·
                     `scripts/` · `commands/` segmenti taşıyan yollar; çıplak dosya adları kapsam
                     dışıdır (proje dokümanı adlarından ayırt edilemezler — ölçüldü)
  C  markdown       — dengesiz kalın işaretleme (**), PARAGRAF bazında
  G  koşamayan komut — kurulu projede koşacak bir komutta motor-düzen yolu
  D  boyut          — devredilir: `doc-scan.sh` (bu script onu çağırmaz, çağıranı sen çağır)
  A  bayat sayı     — v1 DOĞRULAYICI TAŞIMAZ: `<!-- ASSERT: … -->` satırlarını toplar ve
                     "doğrulanmadı" diye bayraklar. ASSERT benimsenecekse doğrulayıcı aynı adımda yazılır
E (tek yönlü işaretçi) ve F (sayım ≠ kanon) v1 kapsamı DIŞINDA — ikisi de anlam işi.

ÖLÇÜLMÜŞ KALİBRASYON (2026-09-04, 62 motor dosyası): ham desenler **818** bulgu verdi, üç
iterasyonda **0**'a indi. Elenen yanlış-pozitiflerin sınıfları — yeniden gevşetmeden önce oku:
  · iç içe kalını regex ile ayırt etmek İMKÂNSIZ (`**a** **b**` ile `**a **b** c**` aynı deseni verir) → 723
  · kalın işaretleme SATIR SINIRINI AŞAR, ölçüt paragraf olmalı → 8
  · placeholder/glob/komut içeren "yol"lar çözülecek yol değildir → 10
  · motor BAKIM komutu (blockquote'ta, "yeniden numaralandırırsan ölç") kurulu düzende koşulmaz → 3
"""
import os, re, sys, json

def motor_agaci(kok):
    """Motor ağacını bul; yoksa None. Kurulu projede `.claude/commands/devflow` da denenir."""
    for aday in (os.path.join(kok, "commands", "devflow"),
                 os.path.join(kok, ".claude", "commands", "devflow")):
        if os.path.isdir(aday):
            return aday
    return None

def motor_dosyalari(engine):
    out = []
    for dp, dn, fn in os.walk(engine):
        dn[:] = [d for d in dn if d != "__pycache__"]
        out += [os.path.join(dp, f) for f in fn if f.endswith(".md")]
    return sorted(out)

# --- B: ölü çapa -----------------------------------------------------------
YOL_RE = re.compile(r'`([^`\n]*?(?:lib|templates|scripts|commands)/[^`\n]*?\.(?:md|py|sh|ps1))`')
# ⚠️ Çıplak `.claude/` BİLİNÇLE YOK: onu soymak, kurulu düzende yanlış konumdaki bir çapayı
# (`.claude/lib/x.md`) canlı gösterir — sessiz yanlış-negatif, fikstürde üretildi.
ONEKLER = (".claude/commands/devflow/", "commands/devflow/")

def onek_soy(r):
    """Kurulu-düzen ve motor-düzen öneklerini sırayla soyar.
    ⚠️ `lstrip` KULLANMA — o bir karakter kümesi siler, önek değil: `.claude/x`.lstrip('./') → `claude/x`."""
    r = r.strip()
    if r.startswith("@"):
        r = r[1:]
    if r.startswith("./"):
        r = r[2:]
    for pre in ONEKLER:
        if r.startswith(pre):
            return r[len(pre):]
    return r

def cozulur_mu(ref, engine):
    ref = ref.strip()
    # placeholder (`<komut>.md`) · glob (`claude/*.md`) · komutun içinden çekilmiş parça → yol değil
    if "*" in ref or "<" in ref or " " in ref or "=" in ref:
        return True
    # `_dev/` proje dokümanıdır, motor ağacında aranmaz
    if ref.startswith("_dev/"):
        return True
    r = onek_soy(ref)
    if not r:
        return True
    # ⚠️ TEK TABAN MOTOR AĞACIDIR — depo kökü BİLİNÇLE taban değildir. İkinci bir taban olarak
    # denendiğinde ölü bir çapayı projenin kendi dosyası **gölgeler** ve bulgu sessizce düşer
    # (fikstürde üretildi: kökte aynı adlı dosya varken 0 bulgu, yokken 1). Zemin de canlıdır —
    # filodaki projelerin çoğu kökünde `scripts/` taşır. Kaldırmanın bedeli ölçüldü ve sıfır çıktı:
    # motor metnindeki çözülebilir referansların TAMAMI motor ağacından çözülüyor, kök tabanından
    # çözülen tek referans yok (iki düzende de ayrı ayrı ölçüldü). Motor dokümanı proje tarafına
    # atıf yapacaksa yolu `_dev/` ile başlar, o da yukarıda zaten muaf.
    return os.path.exists(os.path.join(engine, r))

# --- C: dengesiz kalın -----------------------------------------------------
def dengesiz_kalin(blok):
    """⚠️ Ölçüt SATIR değil PARAGRAF: kalın işaretleme satır sınırını aşabilir ve motorda aşıyor."""
    # Yalnız `*` ve boşluktan oluşan satır markdown yatay çizgisidir (`***`), kalın değil.
    govde = "\n".join(ln for ln in blok.split("\n") if ln.strip().strip("*") != "" or ln.strip() == "")
    return re.sub(r'`[^`]*`', '', govde).count("**") % 2 == 1

# --- G: koşamayan komut ----------------------------------------------------
KOMUT_RE = re.compile(r'`([^`\n]*?\b(?:bash|grep|cat|python3|sed|find|ls|wc|head|tail|rg)\s[^`\n]*)`')

def kurulu_duzende_kosmaz(cmd):
    """Kurulu projede koşacak bir komutta motor-düzen yolu var mı.

    ⚠️ Ayırt edici `_dev/` DOKUNUŞUDUR, yolun kendisi değil. Motorun bakım komutları
    (`grep -rn 'brief madde' commands/devflow/…`) bilinçle motor-düzendedir: onları
    motor oturumu koşar, kurulu projede kimse o dosyayı yeniden numaralandırmaz.
    Kurulu düzende koşacak komut ise tanımı gereği projenin `_dev/` ağacına dokunur."""
    if "commands/devflow/" not in cmd or ".claude/commands/devflow/" in cmd:
        return False
    return "_dev/" in cmd

ASSERT_RE = re.compile(r'<!--\s*ASSERT:\s*(.+?)\s*-->')

def tara(kok):
    engine = motor_agaci(kok)
    if engine is None:
        print(f"HATA: motor ağacı bulunamadı — ne {kok}/commands/devflow ne "
              f"{kok}/.claude/commands/devflow. Tarama YAPILMADI; bu 'temiz' değildir.", file=sys.stderr)
        sys.exit(2)
    dosyalar = motor_dosyalari(engine)
    if not dosyalar:
        print(f"HATA: {engine} altında hiç .md yok — tarama yapılmadı (bu 'temiz' DEĞİL).", file=sys.stderr)
        sys.exit(2)

    bulgular = []
    def ekle(sinif, path, satir, metin, detay):
        bulgular.append({"sinif": sinif, "dosya": os.path.relpath(path, kok),
                         "satir": satir, "detay": detay, "metin": metin.strip()[:240]})

    for p in dosyalar:
        try:
            satirlar = open(p, encoding="utf-8").read().split("\n")
        except (OSError, UnicodeDecodeError) as e:
            # Okunamayan dosya "bulgusuz" değildir — kısmi tarama tam sanılmasın (exit 2 dalı).
            print(f"HATA: {os.path.relpath(p, kok)} okunamadı ({e}). Tarama EKSİK; "
                  f"sonucu 'temiz' sayma.", file=sys.stderr)
            sys.exit(2)
        # B/G/A kod çitinin İÇİNİ de tarar (örnek yollar da denetlenir); yalnız çit çizgisi atlanır.
        for i, ln in enumerate(satirlar, 1):
            if ln.lstrip().startswith("```"):
                continue
            for m in YOL_RE.finditer(ln):
                if not cozulur_mu(m.group(1), engine):
                    ekle("B", p, i, ln, f"çözülemeyen doküman yolu: {m.group(1)}")
            for m in KOMUT_RE.finditer(ln):
                if kurulu_duzende_kosmaz(m.group(1)):
                    ekle("G", p, i, ln, f"kurulu düzende koşmaz (→ .claude/commands/devflow/): {m.group(1)[:130]}")
            for m in ASSERT_RE.finditer(ln):
                ekle("A", p, i, ln, f"ASSERT doğrulanmadı (v1 doğrulayıcı taşımaz): {m.group(1)}")

        # C — paragraf bazlı
        blok, bas, cit, cit_bas = [], 1, False, 1
        def kapat():
            if blok and dengesiz_kalin("\n".join(blok)):
                ekle("C", p, bas, blok[0], "dengesiz ** (paragrafta tek adet)")
        for i, ln in enumerate(satirlar, 1):
            if ln.lstrip().startswith("```"):
                kapat()
                if not cit:
                    cit_bas = i
                blok, cit = [], not cit
                continue
            if cit:
                continue
            if ln.strip() == "":
                kapat(); blok = []
            else:
                if not blok:
                    bas = i
                blok.append(ln)
        kapat()
        # Kapanmayan çit C'yi dosyanın sonuna kadar susturur — sessiz kapsam kaybı, bulgu olarak yaz.
        if cit:
            ekle("C", p, cit_bas, satirlar[cit_bas - 1] if cit_bas <= len(satirlar) else "",
                 "kapanmamış kod çiti — dosyanın kuyruğu C için taranmadı")
    return dosyalar, bulgular

def main():
    args = [a for a in sys.argv[1:] if a != "--json"]
    kok = os.path.abspath(args[0] if args else ".")
    dosyalar, bulgular = tara(kok)

    if "--json" in sys.argv:
        print(json.dumps({"dosya_sayisi": len(dosyalar), "toplam": len(bulgular),
                          "bulgular": bulgular}, ensure_ascii=False, indent=2))
    else:
        print(f"lint-engine v1 — {len(dosyalar)} motor dokümanı tarandı, {len(bulgular)} bulgu.")
        if bulgular:
            print()
            for b in bulgular:
                print(f"  [{b['sinif']}] {b['dosya']}:{b['satir']}")
                print(f"      {b['detay']}")
            print("\n⚠️ Bayrak, kapı değil: her bulguyu yargıla — gerçek mi, yanlış-pozitif mi.")
        print("\nBoyut/uzun satır bu script'in işi değil → scripts/doc-scan.sh")
    sys.exit(1 if bulgular else 0)

if __name__ == "__main__":
    main()
