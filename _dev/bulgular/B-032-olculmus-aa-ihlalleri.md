# B-032: Ana sayfada ve segment sayfalarında ölçülmüş WCAG AA kontrast ihlalleri

**Önem:** 🔴 | **Tip:** hata / erişilebilirlik | **Alan:** M2 — Sayfalar ve bölümler
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → Pazarlık Konusu Olmayanlar: *"Erişilebilirlik WCAG AA'nın altına düşmez — kontrast ve klavye erişimi eşiğin altına inmez."* `QUALITY.md` → 7: normal metin ≥ 4.5, büyük metin (≥24px, ya da ≥18.66px bold) ≥ 3.0.

**Gözlenen:** Beş yüzeyde eşik altı, hepsi bağımsız piksel ölçümüyle. Hiçbiri bugüne dek görünmedi, çünkü kapının yöntemi onları atlıyor ([B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md)) ya da sayfayı hiç gezmiyor ([B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md)).

| # | Yüzey | Ölçülen | Gereken | Kapsam |
|---|---|---|---|---|
| 1 | **Ürün turu soluk adım kartları** — `ProductStory.tsx:223` `lg:opacity-45`; etiket `text-sage-br`, gövde `text-canvas/65` | **2.54 – 2.99:1** | 4.5 | `/` ve `/ozellikler`, masaüstü (≥lg), **16 eleman**. Kapı bunu 8.03–10.63:1 sanıyor (ata opaklığını renge uygulamıyor) |
| 2 | **Kapanış çağrısı paragrafı** — `FinalCta`, `text-ink-deep/75` gradyan bant üzerinde ("Demoyu biz planlıyoruz…") | 1440px **p02 3.97 / min 3.83–3.90** · 390px **p02 3.59–3.62 / min 3.48** | 4.5 | `/` + **dört segment sayfasının hepsi**. Kapı gradyan zemini atlıyor |
| 3 | **Gradyan metin** `.text-gradient-sage` — "kendi ekranından", "aynı üründe", "tamamı", "işletme değişir", "biz yapıyoruz"; 41.6–44px/700 | en açık durak (`sage-br`) canvas üstünde **1.74:1**, canvas-soft üstünde **1.64:1** | 3.0 | `/`, 5 yer. Kapı `background-clip:text`i "ölçülemez" diye atlıyor — STYLE-GUIDE zaten *"açık zeminde `sage` metin olarak kontrastı geçmez"* diyor, `sage-br` ondan daha açık |
| 4 | **`faint` desenli zemin üzerinde** — `bg-dotgrid` noktaları (`line-2`) glifin altına denk geldiğinde; `Chaos` bölümü | **p02 4.06 / min 3.95** (med 4.63) | 4.5 | `/`. STYLE-GUIDE ve `globals.css:73` "dört zeminde de ≥ 4.71" diyor; bu **beşinci** zemin |
| 5 | **404'teki dev "404" rakamı** — `not-found.tsx:13` `text-sage-wash-2` canvas üstünde, 112px (390px'te 80px) | **1.12 – 1.17:1** | 3.0 | 404. `aria-hidden` **yok**, yani ekran okuyucu "404" okur ve kapının kuralı onu metin sayar. Aynı desen `global-error.tsx`'te "Hata" için **1.17:1** ([B-045](B-045-hata-yuzeyleri.md)) |

Ölçüm yöntemi ve sınırı: iki ekran görüntüsü farkından glif maskesi; **metin rengi CSS'ten** (antialias karışmaz), **zemin o koordinattaki gerçek pikselden** (foto + gradyan + saydam katman dâhil); sabit/yapışkan katmanların kapladığı pikseller maskeden çıkarıldı. `p02` (en kötü %2 piksel) desenli zeminlerde bilinçli olarak katı ölçüt — `min` ve `med` de birlikte verildi ki yargı yumuşatılabilsin. `mix-blend-mode`/`filter` kullanan bir yüzey görülmedi ama sistematik taranmadı.

**Temiz çıkanlar ayrıca kaydedilir:** dört segment ve üç yasal sayfanın tamamı 1440/390/320 px'te **eşik altı 0** (en düşük 4.76); asistan paneli içindeki 14 metin öğesinin hepsi AA geçiyor (en düşük 6,04); OG görselindeki altı metin bölgesi 6,51–17,86 arası, hepsi geçiyor. Yani site geniş ölçüde doğru kurulmuş — ihlaller **ölçülmeyen** beş yüzeyde toplanmış ve bu dağılım ölçüm kapsamının haritasını birebir izliyor.

## Kanıt

Betikler scratchpad'de: `karsi-olcum.mjs` (opaklık zinciri), `rotalar-6-kontrast-v3.mjs` (piksel yöntemi).

```
# 1 — ata opaklığı renge uygulanarak, /ozellikler @1440
✗ opacity 0.45 → kapı 10.63:1 · gerçek 2.99:1 (gereken 4.5) — "02 · grup"
✗ opacity 0.45 → kapı  8.03:1 · gerçek 2.54:1 (gereken 4.5) — "Haftalık tekrarlı program…"

# 2 — /segmentler/boks-dovus @1440
✗ p02=3.97 min=3.89 med=4.71 (gereken 4.5) 17px/400 <p> "Demoyu biz planlıyoruz…"
     en kotu: metin rgb(33,50,31) / zemin rgb(93,150,89) · glif 5062px
     A11Y.MJS NE DERDI: ATLADI (gradyan zemin)

# 5 — a11y.mjs birebir kopyası, PAGES satırı 404'e çevrildi
── /olmayan-sayfa   kontrast ihlali:1
   ✗ 1.17:1 (gereken 3) 112px undefined — "404"
```

## Kök Neden Yönü

Dört kalem aynı kökten: **kompozisyonla oluşan renk** (opaklık, gradyan, desen, fotoğraf) tasarımda serbestçe kullanılmış, ama proje kontrastı hesaplanmış-stil düzeyinde ölçüyor. Yani ihlaller tasarım cesaretinin değil, **ölçüm modelinin** kör noktasında birikmiş — nitekim tek renk üzerine tek renk olan her yüzey (yasal sayfalar, segment gövdeleri, asistan paneli, OG görseli) temiz.

Beşinci kalem ayrı: 404 dekoratif bir tipografi jesti, ama ne `aria-hidden` almış ne kontrastı ölçülmüş — sayfanın kapı listesinde olmaması onu hiç sınanmamış bırakmış.

## Koruma Önerisi

- Düzeltmeler bağımsız ve küçük: (1) soluk kart opaklığı ≥ 0.7'ye çıkar **ya da** soluk hâlin metin rengi ayrıca seçilir; (2) `text-ink-deep/75` tam opak `ink-deep`'e çekilir (tek değişiklik beş sayfayı birden düzeltir); (3) gradyan metnin en açık durağı koyulaştırılır (STYLE-GUIDE'ın `sage-ink` emsali var); (4) `faint` desenli zemin üzerinde kullanılmaz ya da desen açılır; (5) "404" ya `aria-hidden` + dekoratif ilan edilir ya kontrastı 3:1'e çıkarılır.
- **Kalıcı koruma [B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md)'in kendisidir.** Bu beş kalem düzeltilip kapının yöntemi düzeltilmezse aynı sınıf bir sonraki gradyan bantta yeniden doğar ve yine görünmez.
- Düzeltme sonrası **1440 px'in yanında 390 ve 320 px'te de** ölçülmeli: kalem 2'nin en kötü değeri (3.48) mobilde.

## Çözüm Kaydı

—
