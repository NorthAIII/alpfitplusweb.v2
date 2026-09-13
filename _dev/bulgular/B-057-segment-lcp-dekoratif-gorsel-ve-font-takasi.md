# B-057: Segment giriş sayfalarında LCP dekoratif arka plan fotoğrafı, yavaş ağda eşiği aşıyor; font takası iki sayfada görünür yeniden akış üretiyor

**Önem:** 🟢 | **Tip:** öneri-performans (ilk ölçüm) | **Alan:** M2 — segment sayfası · M5 — font teslimi · M6 — ölçüm yöntemi
**Kaynak:** audit-product (performansın ilk ölçümü) | **Tarih:** 2026-09-13
**Durum:** Açık

## Gözlem

**Beklenen:**
- `QUALITY.md` → 4 Performans:
  - *"Bu, mobil ağda ilk ziyarette de hızlı mı?"*
  - *"CLS sıfıra yakın mı — boyutu bildirilmemiş görsel, geç yüklenen font var mı?"*
- web.dev eşikleri: LCP ≤ 2,5 s, CLS ≤ 0,1.
- `ILKELER.md` → Dönüşüm birinci eksen. Segment sayfaları paylaşımla gelinen giriş sayfalarıdır ([B-050](B-050-segment-sayfalarinda-pilot-nitelemesi-yok.md)).

**Genel tablo — site çoğunlukla hızlı.** Önizleme `147c5e8`, iki bağımsız ölçüm (denetim ajanı + düşmanca doğrulama, toplam 300'e yakın koşum):
- Lighthouse 12.8.2 mobil perf skoru 0,89–1,00.
- TBT ≤ 51 ms, üçüncü taraf istek 0, HTML kenarda statik ve `HIT`.
- Hızlı 4G'de (150 ms, 9 Mbps) LCP ~0,64 s.
- Lighthouse varsayılanı Slow 4G'de (562,5 ms, 1,47 Mbps; Lighthouse dokümanına göre "4G'nin en yavaş %25'i") LCP 1,7–2,4 s.
- Türkiye mobil medyanı bundan çok hızlı (SpeedOf.Me 2026: 19 Mbps / 83 ms).

İki sıcak nokta var; ikisi de yalnız yavaş bağlantıda görünür ve ucuz düzelir.

### (a) Segment sayfasında LCP dekoratif fotoğraf

- **Görsel:** `src/app/segmentler/[slug]/page.tsx:72-79` → `<Image fill priority sizes="100vw" className="object-cover opacity-45">`. Üstünde `:80-83` koyu gradyan var (`from-ink-deep/92 via-ink-deep/78 to-ink-deep/45`), yani görsel %45 opaklıkta ve büyük ölçüde örtülü.
- **LCP'yi itiyor:** Metin (`p.mt-5`) 1,92 s'de boyanıyor. Görsel 2,18 s'de gelip LCP'yi **+240–264 ms** itiyor (5 koşum, sapma ≤ ±40 ms, gürültü değil). Görsel engellenince LCP metne düşüyor: 1,85–1,88 s.
- **Chrome görseli adaylıktan elemiyor.** Elenenler:
  - opaklığı 0 olanlar,
  - tüm viewport'u kaplayanlar (bu görsel 264.310 px², viewport 339.076 px²),
  - 0,05 bpp altı düşük entropililer (bu görsel ≈ 0,81 bpp).
- **İstek önceliği Low:** ne preload'da ne `<img>`'de `fetchpriority` var.
- **Yüksek DPR'de büyük varyant iniyor:** `sizes="100vw"` yüzünden, Slow 4G'de:

  | Ekran | İnen varyant | LCP |
  |---|---|---|
  | 360, 384 px | 1080w · 45 KB | 2,47 s |
  | **390, 393, 412×915 @~3** | **1200w · 52 KB** | **2,61–2,68 s** |
  | 430 px @3 | 1920w · 90 KB | 3,27 s |
  | Masaüstü | 1920w | 3,24 s |

  Yaygın telefon genişliklerinde eşik aşılıyor. Hızlı 4G'de fark kayboluyor.

### (b) Font takası görünür yeniden akış üretiyor

- **Kurulum:** `src/app/globals.css:20-44`'teki beş `@font-face` `font-display: swap` taşıyor; `size-adjust`, `ascent-override` ya da metrik eşli yedek yüz yok. Preload yalnız inter-400 ve sora-800 için var (`src/app/layout.tsx:140-141`). HTML'de iki kez yazılmış (4 etiket), ama çift istek oluşmuyor.
- **Neden font geç geliyor:** Preload bozuk değil, yarışıyor. CSS (13 KB) ve 8 JS parçası aynı anda iniyor, sora-800 (14,9 KB) CSS'ten sonra geliyor, ilk kare yedek fontla çiziliyor.
- **Ne kayıyor (Slow 4G):**
  - `/demo`: sora-800 ilk yerleşimden (1808 ms) sonra, 1838 ms'de iniyor. FCP 1847 ms, kayma 1850 ms. h1 3 satırdan 4 satıra çıkıyor, form bölümü 34 px iniyor. Görüntü kareleri: yedek fontlu kare ekranda ~17–20 ms kalıyor.
  - Segment sayfası (412 px): inter-400 hero bloğunu 24 px itiyor, breadcrumb'ın son öğesi alt satıra kırılıyor.
- **Atıf kontrollü deneyle kanıtlı:**

  | Deney | `/demo` | Segment |
  |---|---|---|
  | Normal | 0,152 | 0,173 |
  | Tüm fontlar engelli | 0 | 0 |
  | Fontlar önbellekte | 0,0005 | 0 |
  | Yalnız sora-800 engelli | 0,0005 | — |
  | Yalnız inter-400 engelli | — | 0,026 |

- **Lighthouse'un CLS'i:** `/demo` 0,152–0,160, segment 0,170–0,173, eşik 0,1. Android yedek fontu Roboto ile de aynı.
- **Ama alan metriğinde büyük olasılıkla görünmez.** Chrome'un kendi CLS'i (CrUX'u besler) ve web-vitals, aynı koşumlarda bu kaymaları **saymıyor** (0,0005 / 0). Nedeni:
  - Mobil viewport ilk yerleşimden sonra 981 px'ten 412 px'e yeniden boyutlanıyor.
  - Bu 500 ms'lik bir girdi penceresi açıyor ve kaymalar `hadRecentInput=true` işaretiyle geliyor.
  - Lighthouse bunları bilerek sayıyor (crbug 1302667).
  - Gerçek Android'de de sayılmayacağı **kaynak koddan çıkarım**, cihazda ölçülmedi.
  - İstisna: Slow 3G'de segment kayması pencereden sonra düşüyor ve alan tanımıyla da **0,148**.
- **Duyarlılık:**
  - `/demo`'daki kayma için ~562 ms gecikme ile ≤ 3 Mbps birlikte gerekiyor.
  - Segment kayması ≤ 3 Mbps ve **yalnız 412 px** genişlikte oluşuyor (breadcrumb kırılması). 360–393 ve 430 px'te 0,01–0,03.
  - CPU etkisiz.

**Sonuç:**
- Yavaş bağlantıdaki azınlıkta görünür bir sıçrama var.
- Lighthouse ve PageSpeed Insights'ta eşik aşılıyor.
- Alan metriklerinde çoğunlukla görünmüyor.

### (c) Ölçüm yöntemi bu iki noktaya kör

- **Başlangıç çizgisi:** `modules/M6-Kalite-Kapilari.md` → Teknik Notlar'daki çizgi (CLS 0–0,005, ağırlık 133 KB) kısıtsız ölçülmüş.
- **Lighthouse `simulate` (varsayılan):** (b)'yi 0,0006 / 0 gösteriyor. (a)'nın farkını ayırt edemiyor: görselli ve görselsiz LCP dağılımları üst üste biniyor.
- **Gerçek ilk yük** mobilde 307–400 KB aktarım, 20–31 istek ([B-035](B-035-perf-agirlik-muhasebesi-kor.md)'in kör muhasebesinin bu turdaki rakamı).
- **F6.3 etkisi:** CI'ye Lighthouse kapısı konursa (F6.3), `devtools` yöntemi (b) için kırmızı, `simulate` yöntemi yeşil verir. Kapının yöntemi bu bulguya bağlı.

## Kanıt

```
# (b) Lighthouse devtools — lh/dev-demo-1.json → layout-shifts
{"selector":"body.min-h-dvh > main#icerik > section.relative","score":0.1442518600904492,
 "cause":[["Web font loaded","https://alpfitplus-web-v2.vercel.app/fonts/sora-800-tr.woff2"]]}
# segment
{"selector":"main#icerik > section.relative > div.mx-auto > div.max-w-3xl","score":0.1440522701851793,
 "cause":[["Web font loaded",".../fonts/inter-400-tr.woff2"]]}

# (b) bağımsız CDP — aynı koşumda iki tanım
/demo r1  FCP=1844  CLS(hepsi)=0.1597  CLS(girdi hariç)=0.0006
 t=1845.6 v=0.1443 hadRecentInput=True  section 449→483 ; h1 son satır 249→282
segment r1 FCP=1948 CLS(hepsi)=0.1696 CLS(girdi hariç)=0
 t=2126.9 v=0.1441 hadRecentInput=True  div.max-w-3xl 180→204 ; li "Reformer ve Pilates Stüdyoları" [175,132]→[20,156]

# (a) LCP alt bölümleri — lh/dev-segmentler_pilates-reformer-2.json
[{"phase":"TTFB","timing":142.8},{"phase":"Load Delay","timing":547.4},{"phase":"Load Time","timing":1469.5},{"phase":"Render Delay","timing":8.6}]
```

**Yeniden üretme** (araştırma konteyneri, yalnız GET):
```
npx -y lighthouse@12 https://alpfitplus-web-v2.vercel.app/demo --form-factor=mobile --throttling-method=devtools --output=json
```
- `CHROME_PATH` Playwright chromium'u.
- Denetim betikleri repo dışında, oturum scratchpad'inde kaldı.

## Kök Neden Yönü

- **(a)** Dekoratif arka plan içerik görseli gibi yükleniyor: `priority` ve `100vw`. Görünür etkisi düşük bir kare, en ağır varyantla LCP adayı oluyor.
- **(b)** Yedek fontun metrikleri Sora ve Inter'e eşlenmemiş. Preload, fontun ilk boyamadan önce gelmesini garanti etmiyor; CSS ve JS'le yarışıyor.
- **(c)** Ölçümler kısıtsız ya da `simulate` yöntemiyle alındığı için ikisi de hiç görünmedi.

## Koruma Önerisi

- **(a)** Dekoratif görselin `sizes`'ı sabit ve küçük bir varyanta çekilsin (ör. 640w; %45 opaklık ve %78–92 gradyan altında çözünürlük görünmez), ya da görsel CSS arka planına alınıp LCP adaylığından çıkarılsın. `priority` gerçek içerik görseline kalsın.
- **(b)** Yedek yüze `size-adjust` ve `ascent-override`/`descent-override` verilsin (Sora ve Inter için metrik eşleme). Kayma kaybolur, `font-display: swap` korunur. Çift preload etiketi temizlensin.
- **(c)** M6 başlangıç çizgisi Slow 4G + `devtools` yöntemiyle, en az 390 ve 412 px genişlikte yeniden ölçülsün. F6.3'te Lighthouse kapısı kurulacaksa yöntem seçimi ve "Lighthouse CLS ≠ alan CLS" farkı karara yazılsın.

## Çözüm Kaydı

—
