# B-039: Metin bileşende — 402 gömülü prose, 70 bölüm başlığının 67'si literal

**Önem:** 🟡 | **Tip:** tutarsızlık / modülerlik | **Alan:** M1 — İçerik ve iddia kaynağı / M2 — Bölümler
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** Kök `CLAUDE.md` → Kod kuralları: *"**Metin bileşende değil `src/content/`'te.** Bileşenler içeriği okur, taşımaz; ton değişimi bileşene dokunmaz."* `M2-Sayfalar-ve-Bolumler.md` → Teknik Notlar aynısını tekrarlıyor. `M1-Icerik-ve-Iddia-Kaynagi.md` → F1.2 ("Metin tonu") kabul kriteri: *"Onaylanan ton `src/content/` genelindeki tüm metin dosyalarına yayıldı; **bileşen dosyalarında metin değişmedi**."*

**Gözlenen:** Kural yapısal olarak tutmuyor. `src/components/**` altındaki **32 dosyanın 26'sında** çok-kelimeli kullanıcı-görünür gömülü metin var.

| Alan | Distinct gömülü prose |
|---|---|
| `src/components/**` | **238** |
| `src/app/**` (sayfalar) | **164** |
| `src/content/**` (doğru ev) | 1.548 satır / 10 dosya |

**En keskin tek metrik:** `<SectionHead>` ve `<PageHero>` çağrılarındaki `label=` / `title=` / `lead=` değerleri — **70 adet**, ve bunlardan yalnız **3'ü** `src/content/`'ten geliyor (`yazilim-secerken/page.tsx:72` → `ARASTIRMA.note`; `LegalPage.tsx:16-17` → `doc.title`, `doc.intro`). Yani sitenin **en ton-hassas metni** — her bölümün üst etiketi, başlığı ve giriş paragrafı — bileşende ve sayfada duruyor.

En ağır yoğunlaşmalar: `DemoForm.tsx` ~35 (tüm form kabuk metni) · `fiyat/page.tsx` ~35 · `ozellikler/page.tsx` ~33 (yol haritası üç kolon = 3 etiket + 18 kalem) · `Solution.tsx` ~26 · `HowItWorks.tsx` ~21 (`STEPS` 5×3) · `ProductStory.tsx` ~20 (`STEPS` 5×2 + 5 pin etiketi) · `PriceCalculator.tsx` ~20 · `Footer.tsx` **19** (`COLS`: 3 kolon başlığı + 13 bağlantı etiketi) · `FounderProgram.tsx` ~19 · `Hero.tsx` ~18 · `WhyUs.tsx` **16** (`AXES` 4×3 = 12 içerik dizgesi) · `Marquee.tsx` 11 (`ITEMS` 10 segment adı) · `Chaos.tsx` 14 + ~62 illüstrasyon dizgesi.

**Ayrım yapıldı:** gerçek içerik (yukarıdakiler, taşınmalı) · **illüstrasyon metni** (`Chaos.tsx`'in `aria-hidden` sahnesi, ~62 dizge — ekran okuyucuya gitmiyor ama **görünür**, tonu var ve `render-product.mjs` sızıntı denetiminin dışında: o yalnız `public/product/` görsellerini süzüyor, bu sahnedeki uydurma isim ve tutarlar hiçbir kapıdan geçmiyor) · **teknik dizge** (~20 `aria-label`/dekoratif işaret, kalabilir).

**Somut bir görünür bedel:** `ProductStory.tsx:227` ürün turu adım etiketini `{String(i+1).padStart(2,"0")} · {s.key === "cockpit" ? "Çok şube" : s.key}` ile kuruyor. Beş adımın **dördü ziyaretçiye teknik anahtarla** görünüyor — render edilmiş HTML'de doğrulandı:
```
>01 · takvim    >02 · grup    >03 · finans    >04 · Çok şube    >05 · raporlar
```
`Step` tipinde bir `eyebrow`/`label` alanı olmadığı için tek istisna elle özel-durumla düzeltilmiş; altı ay sonra "neden sadece cockpit farklı" sorusunun cevabı kodda yok.

## Kanıt

```
$ node scratchpad/audit/prose.mjs        # yorumlar, SVG d=, sınıf dizgeleri hariç
src/components/** : 238 distinct
src/app/**        : 164 distinct

$ grep -rn "SectionHead\|PageHero" src/ | grep -cE 'label=|title=|lead='     → 70
$ grep -rn "SectionHead\|PageHero" src/ | grep -E 'label=\{[A-Z]|title=\{[a-z]+\.' → 3

$ curl -s http://localhost:3000/ | grep -oE '>0[1-5]<!-- --> · <!-- -->[a-zA-ZçğıöşüÇĞİÖŞÜ ]+'
>01 · takvim   >02 · grup   >03 · finans   >04 · Çok şube   >05 · raporlar
```

## Kök Neden Yönü

`src/content/` **veri** için açılmış (fiyat, segment, SSS, yasal, chat ağacı) ve o alanlarda kural mükemmel tutuyor. Ama "bölüm başlığı / göz-kaşı etiketi / lead" için hiç **ev açılmamış**; bileşen yazan kişinin önünde iki seçenek vardı ve doğal olanı JSX'e yazmak oldu. Yani ihlal bir disiplin gevşemesi değil, **eksik bir yapı**: kuralın gerektirdiği evin kendisi yok.

İkinci katman: aynı boşluk `Assistant.tsx`'in dokuz kabuk dizgesini de ([B-026](B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md)'nın çelişen kolu dâhil) ve `Footer`'ın kendi navigasyon kopyasını da doğurmuş.

## Koruma Önerisi

- `src/content/`'e **bölüm metni evi** açılır (ör. `sections.ts` ya da bölüm başına sabit) ve 70 başlık/etiket/lead oraya taşınır; `WhyUs.AXES`, `HowItWorks.STEPS`, `ProductStory.STEPS`, `FounderProgram.PERKS`, `Marquee.ITEMS`, `Footer.COLS`, `ozellikler` yol haritası da aynı kapsamda. `Step` tipine `eyebrow` alanı eklenir ve teknik anahtar gösterimi biter.
- **Bu iş M1 F1.2'nin ("Metin tonu") ön koşuludur, kendisi değil.** F1.2'nin kabul kriteri *"bileşen dosyalarında metin değişmedi"* bugünkü envanterle **sağlanamaz**: ton oturumu 26 bileşene dokunmak zorunda kalır ve kriter kendi kendini çürütür. Taşıma ayrı bir task olarak F1.2'nin **önüne** alınmalı.
- Kalıcı koruma: M6 F6.4 (iddia sızıntı denetimi) kurulurken aynı kapıya mekanik bir kontrol eklenebilir — `src/components/**` ve `src/app/**` içinde N kelimeden uzun JSX metin düğümü aramak. Eşik bilinçle seçilir (teknik dizgeler ve illüstrasyon muaf listesi olur), ama kural insan hafızasından kapıya taşınır.

## Çözüm Kaydı

—
