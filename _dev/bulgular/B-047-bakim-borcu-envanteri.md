# B-047: Bakım borcu — ölü ilkel 43 yerde elle tekrarlanıyor, tipografi ölçeğinin token'ı yok, ilkel katmanı yapısal garanti vermiyor

**Önem:** 🟡 | **Tip:** öneri-altyapı / bakım | **Alan:** M2 — UI ilkelleri ve bölümler (QUALITY 1 ve 3)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `QUALITY.md` → 1 Modülerlik: *"Tekrar eden kod var mı? Ortak mantık (`ui/`) paylaşılıyor mu?"* → 3 Bakım Maliyeti: *"Konfigürasyon hardcode değil, env veya `src/content/` sabitinde mi?"*, *"6 ay sonra bunu değiştirmem gerekse ne kadar zor olur?"* `ILKELER.md` → öncelik 3: **Bakım kolaylığı** — *"bugün ucuz olan değil, altı ay sonra ucuz olan seçilir."*

**Gözlenen — dört küme.**

### (a) İlkel katmanı yapısal garanti vermiyor

| Kalem | Ölçüm | Bugünkü etki |
|---|---|---|
| **`ui/Card.tsx` tamamen ölü** | `Card` ve `Chip` **0 import** (`grep -rn "ui/Card" src` → 0). Buna karşılık `rounded-card` **43 yerde** elle; `h-full rounded-card bg-surface p-7 shadow-sm ring-1 ring-line` dizgesi birebir **6 kez** — yani `<Card hover>`'ın ürettiği şey | 61 satır sıfır fayda + yanlış izlenim |
| **`SectionLabel` yanından geçiliyor** | JSX'te 4 kullanım (biri kendi dosyasında); aynı sınıf yığını **13 yerde elle**. **Bedeli ölçüldü:** `fiyat/page.tsx:137` ve `:189` `tracking-[0.14em]` yazıyor, diğerleri `0.16em` — kopya kayması gerçekleşmiş | görsel tutarsızlık |
| **`Roles.tsx:21` cast, guard değil** | `VISUAL[role.key as keyof typeof VISUAL]` → `src/content/product.ts`'e **beşinci bir `ROLES` kalemi eklemek** (bir *içerik* düzenlemesi) `shot`'ı `undefined` yapar ve `:115` `shot.src` çalışma anında patlar | QUALITY 1'in kontrol sorusu ("bağımsız değiştirebilir miyim?") burada **hayır** |
| **`ui/Button` `...rest`'i iki dalda düşürüyor** | Tip imzası `ButtonHTMLAttributes` yayıyor ama `rest` yalnız `<button>` dalında (`:69`) spread ediliyor; `<a>` (`:52-59`) ve `<Link>` (`:62-66`) dallarında **hiç kullanılmıyor** → `<Button href="/demo" aria-label="…">` derlenir, çalışır, özniteliği **sessizce düşürür** | bugün tetiklenmiyor (tek ek prop `type`/`disabled`, ikisi de `<button>` dalında); akmakta olan analitik işi tam bu öznitelik sınıfını kullanıyor |
| **`ui/Button` `type` varsayılanı yok** | `:69` `<button {...rest}>` — HTML varsayılanı `submit` | bugün canlı hata yok; bir formun içine `<Button onClick>` koyan gelecek bir düzenleme formu sessizce gönderir |
| **`ui/Icon` bilinmeyen adı yutuyor** | `:32` `MAP[name] ?? Layers`, `name: string` (union değil) | 13 ikon adının tamamı bugün geçerli; `icon: "calender"` yazımı tip hatası vermez, `Layers` çizer |
| **`segmentler/[slug]` iki sessiz düşürme** | `:46-48` `seg.modules` yazım hatası `.filter(Boolean)` ile kaybolur; `:136-137` `pains[i]` ↔ `answers[i]` **indeksle** eşleştirilir ve eşleşmeyen kalem boş sütun olarak render edilir. `Segment` tipi bu eşlemeyi hiçbir yerde beyan etmiyor | bugün 10 anahtar da çözülüyor |
| **`lm-g` id'si her sayfada iki kez** | `Logo.tsx:8` `id = "lm"` varsayılanı; `LogoMark` header ve footer'da iki kez render ediliyor, `url(#lm-g)` belgedeki **ilk** gradyanı çözüyor. Bileşen bunun için zaten bir `id` prop'u taşıyor, çağıranlar geçmiyor | iki gradyan aynı olduğu için görünür etki yok; `tone` varyantı ayrışırsa sessizce kırılır |
| **Boşta `aria-controls` her sayfada 2** | `button[aria-controls="mobil-menu"]` ve `[aria-controls="asistan-panel"]` — hedef id'ler panel kapalıyken DOM'da **yok** | [B-017](B-017-asistan-erisilebilirlik-katmani-eksik.md)'nin komşusu, listesinde yok |

### (b) Tipografi ölçeğinin token'ı yok — 254 arbitrary değer

`globals.css` → `@theme` renk, yarıçap, gölge ve animasyon tanımlıyor; **`--text-*` tanımlamıyor.** Sonuç:

| Değer | Kaç kez | Ne |
|---|---|---|
| `text-[0.9375rem]` | **52** | sitenin de facto gövde ölçüsü (15px) |
| `text-[0.6875rem]` | **28** | göz-kaşı etiketi |
| `text-[0.625rem]` | 10 | illüstrasyon içi |
| `text-[1.0625rem]` | 9 | kart başlığı |
| `tracking-[0.16em]` | 17 | etiket harf aralığı |

Gövde metnini 15 px'ten 15,5 px'e çekme kararı bugün **52 yerlik** bir düzenleme. Tailwind 4 CSS-first bunu zaten destekliyor (`@theme { --text-body: 0.9375rem }`).

### (c) Ham renk `@theme` dışına taşmış — 51 hex, üç sınıf

| Sınıf | Yer | Değerlendirme |
|---|---|---|
| **Mevcut token'ı ham hex olarak tekrarlayan** | `Logo.tsx:13-15` `#94D08E`/`#74B36F`/`#3E6B3C` = tam olarak `sage-br`/`sage`/`sage-deep` · `Chaos.tsx:184,207` `#f7f8f4` = `surface-2` · `:199` `#fceeec` = `neg-wash` · `DemoForm.tsx:143` `accent-[#3e6b3c]` = `sage-deep` · `layout.tsx:55` `themeColor:"#fbfbf9"` = `canvas` | **Marka rengi değişirse logo değişmez.** Tek kaynak kırılmış |
| **Token'ı olmayan, gerekçesi yazılmayan** | WhatsApp üçlüsü `#25D366`/`#06331a`/`#128C4A` → **9 yerde**; neredeyse-siyah dörtlüsü `#111410`/`#14170f`/`#0a0c08`/`#0f1511` (hepsi `ink-deep`'ten biraz farklı, hiçbirinde neden yazılı değil); `#171914` iki dosyada; `#fdfaf1`, `#1f2c34`, `#0b141a`, `#005c4b`, `#f3f4f1`, `#e0796f` | STYLE-GUIDE *"yeni renk eklerken kontrastı ölç, rakamı CSS yorumuna yaz"* diyor; bu dokuz renk **CSS'te hiç değil**, yani geleneğin eli oraya yetişmiyor. `#25D366` üzerine `#06331a` metni için hiçbir yerde kontrast rakamı yok |
| **Gerekçeli** | `global-error.tsx` 10 değer — kök layout devre dışı, `globals.css` yüklenmiyor, satır-içi zorunlu | Gerekçe **yazılı değil** → [B-045](B-045-hata-yuzeyleri.md) |

### (d) Ölü kod ve öksüz varlık — mekanik envanter

| Ölü şey | Kanıt |
|---|---|
| `ui/Card.tsx` → `Card`, `Chip` · `ui/BrandIcons.tsx:13-19` → `WhatsAppIcon` | 0 import (WhatsApp her yerde lucide `MessageCircle` ile çiziliyor) |
| `CONTACT.phone.display` · `PRODUCT_STATUS.short` · `PRODUCT_STATUS.version` · `PRICING.annualPrepayBenefit` · `Segment.accent` (4 değer) | 0 tüketici. `Segment.accent` bir **tuzak**: biri `accent:"neg"` yazıp sayfanın rengini bekler, hiçbir şey olmaz |
| `SHOTS.sube` + `public/product/sube.webp` (62.494 B) | 0 tüketici; hat üretiyor, site kullanmıyor, adres 200 dönüyor → [B-044](B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md) |
| `public/foto/salon-genis-wide.webp` (200.878 B, 2000×760 — `public/`'in **en büyük dosyası**) · `grup-dersi.webp` (84.294 B) | `src/` içinde 0 referans. İlki tam-genişlik bant için üretilmiş; site 3:2 kaynakları bant slotlarına kırpıyor → [B-046](B-046-gorsel-teslim-katmani.md) |
| `public/next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg` (3.314 B) | `create-next-app` kalıntısı; **`next.svg`/`vercel.svg` ticari bir sitede üçüncü-taraf marka dosyası olarak servis ediliyor** |
| `twitter-image.png` ≡ `opengraph-image.png` | **aynı md5**, 123.905 B → depoda ve dağıtımda 124 KiB ikiz. OG PNG'de ayrıca gereksiz alfa kanalı |
| `research/scripts/` — 20 betiğin **7'si** hiçbir yerde anılmıyor | `demo-shots`, `fonts`, `hero`, `overflow`, `photo-debug`, `photos`, `shot`. Hepsi kickoff öncesi tek-seferlik prob; adlandırılmış ardılları var (`photos`→`photos-build`, `fonts`→`font-subset`, `overflow`→`mobile-audit`, `shot`/`hero`/`demo-shots`→`render-product`). CLAUDE.md 6 kapı betiği sayıyor, klasörde 20 dosya var |
| `Logo.tsx:54` ölü üçlü operatör | `{tone === "light" ? "" : ""}` — iki dal da boş dizge |
| `Assistant.tsx:74` ölü fallback dalı | `topic.next?.length ? topic.next : CHAT_ROOT.filter(...)` — 10 düğümün hepsinde `next` dolu |
| `chat.ts:151` `CHAT_FALLBACK` | 0 kullanım → [B-026](B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md) |

**`.gitignore` asimetrisi:** `research/out/` (121 MB) ve `product-out/` (348 KB) yok sayılıyor, ama `photos-out/` (2.016 KiB), `fonts-out/` (95 KiB) ve `brand-out/` (180 KiB) **izleniyor** — ve `md5sum` ile doğrulandı: içerikleri `public/` altındaki sevk edilen dosyalarla **bayt bayt aynı**. `.gitignore:44` yorumunun kendi ölçütü (*"arastirma ciktilari — buyuk ikili dosyalar, uretilebilir"*) üç dizine uygulanmamış; izlenen yinelenen kopya ≈ **1,25 MiB** + `photos-out/adaylar/*.jpg` 1.136 KiB ara JPEG.

**Doküman boşluğu:** `CLAUDE.md` → Dokunulmazlar tablosu yalnız `public/product/` ve `public/fonts/`'u "betik çıktısı, elle dosya konmaz" diye işaretliyor; `public/foto/` (`photos-build.mjs`) ve `src/app/*.png` (`brand-assets.mjs`) **aynı sınıf ama tabloda yok**.

**Bu eksende iyi olan ayrıca kaydedilir:** STYLE-GUIDE ↔ `globals.css` arasında **sapma yok** (20 token değeri ve üç kontrast rakamı birebir tutuyor — doküman bayat değil). "Ölçülmüş kararı yorumda rakamıyla açıkla" geleneği **11 yerde gerçekten yaşıyor** (`globals.css:64-66,80,83` · `next.config.ts:52` · `stage.ts` başlığı · `Roles.tsx:37-40` 614px · `Chaos.tsx:64-74` · `HowItWorks.tsx:48-51` · `ProductStory.tsx:22-30,109-112` · `Hero.tsx:113-115`). Tüm olay dinleyicileri sökülüyor (sızıntı yok); odak stili `globals.css`'te global `:focus-visible` ile **yapısal olarak** garantili; 9 `"use client"` dosyasının hepsinin gerekçesi var; ham `<img>` yok. Bağımlılıklar: 4 çalışma-zamanı, `npm audit` **0 açık**, `next` ve `react` tam sabit, lock dosyası izleniyor. Borç *"belgeleme kültürü yok"*tan değil, **kültürün `@theme` ve `src/content/` sınırının dışına çıkmamasından** doğuyor.

## Kanıt

```
$ grep -rn "ui/Card\|<Card\|<Chip" src/ | wc -l                      → 0
$ grep -ro "rounded-card" src/ | wc -l                               → 43
$ grep -rno "text-\[0\.9375rem\]" src/ | wc -l                       → 52
$ grep -rnoE "#[0-9a-fA-F]{6}" src/ | wc -l                          → 51
$ md5sum research/photos-out/final/crossfit.webp public/foto/crossfit.webp   → aynı
$ md5sum src/app/twitter-image.png src/app/opengraph-image.png              → aynı
$ grep -rn "SHOTS.sube\|phone.display\|PRODUCT_STATUS.short\|Segment\b.*accent" src/ | grep -v content/  → (yok)
```

## Kök Neden Yönü

Proje **çok iyi belgelenmiş ama iki sınırda duruyor**: `@theme` (renk/yarıçap/gölge) ve `src/content/` (veri). O iki evin içinde tek kaynak disiplini ve ölçüm-yorumu geleneği kusursuz işliyor. Dışında — tipografi ölçeği, bölüm metni ([B-039](B-039-metin-bilesende.md)), ilkel garantileri, ham renk — aynı disiplinin karşılığı yok, çünkü **ev açılmamış**. `ui/Card`'ın ölü kalması da aynı desen: ilkel yazılmış, benimseme adımı hiç yapılmamış, ve arada kalmış hâl (0 kullanım + 43 elle tekrar) en pahalı hâl.

Ölü kod ve öksüz varlıklar ise **kickoff öncesi hızlı geliştirmenin** normal tortusu; tehlikeli olanı `Segment.accent` gibi *çalışıyormuş gibi görünen* ölü alanlar ve `.gitignore`'un kendi ölçütünü üç dizine uygulamaması.

## Koruma Önerisi

- **`Card` + `Chip` silinir** (yeniden yazmak kolay, yanlış izlenim pahalı); **`SectionLabel` benimsenir** — 13 çağrı yeri zaten birebir aynı yığını yazıyor ve `0.14em` kayması tekrarın bedelini kanıtlıyor.
- **Tipografi `@theme`'e alınır** (`--text-body`, `--text-label`, …) — tek oturumluk iş, gövde ölçüsü kararını 52 dokunuştan 1'e indirir. WhatsApp yeşili üçlüsü de token'a alınırsa STYLE-GUIDE'ın "kontrastı ölç, rakamı yaz" geleneği o renklere de erişir.
- `Logo.tsx`'teki üç hex `sage` token'larına bağlanır (marka rengi tek kaynaktan değişsin).
- **İlkel garantileri:** `Button` `rest`'i üç dalda da spread eder ve `type="button"` varsayılanı alır; `Icon` `name: keyof typeof MAP` olur; `Roles.tsx` `VISUAL`'ı `Record<string, Shot | undefined>` yapıp guard ekler; `Logo` çağıranları `id` geçer.
- Ölü kod ve öksüz varlıklar tek bir temizlik turunda silinir; `twitter-image` OG'ye referansla değiştirilir; `.gitignore` kendi ölçütünü `photos-out/`, `fonts-out/`, `brand-out/`'a da uygular (üretilebilir ve `public/`'te zaten var). `research/scripts/`'teki 7 öksüz betik silinir ya da `research/scripts/arsiv/` altına alınır — CLAUDE.md'nin saydığı 6 kapı betiği klasörde görünür kalsın.
- `CLAUDE.md` → Dokunulmazlar tablosuna `public/foto/` ve `src/app/*.png` eklenir (aynı sınıf, aynı kural).
- Bu kalemlerin hiçbiri tek başına acil değil; **hepsi birlikte** "Metin tonu" ve "Kalite kapıları otomatik" fazlarının maliyetini belirliyor — o iki faz bu temizlikten önce başlarsa her ikisi de bugünkü tekrar sayısıyla çarpılmış bir iş hacmiyle karşılaşır.

## Çözüm Kaydı

—
