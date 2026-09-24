# TASK-3.20: `priority`, `sizes` ve hi-dpi varyant tavanı gerçek yerleşime çekilir

**Durum:** ✅ Tamamlandı
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md) · M2 kullanımı
**Feature:** F5.1 Ürün ekran görüntüsü hattı · F2.1/F2.2 sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.18 ✅ · TASK-3.19 ✅

---

## Hedef

Görsel teslim katmanının üç ölçülmüş sapmasını kapatmak:

1. **`priority` mobilde görünmeyen bir görselde.** `ProductStory`'nin `priority={i === 0}` taşıyan `<Image>`'ı `hidden lg:block` içinde — 390 ve 768 px'te preload edilen görsel `display:none`. `/ozellikler`'de bu, mobilde **sayfadaki tek görsel preload'u**; gerçekten görünen ilk ürün ekranı `loading="lazy"`. `/segmentler`'in ilk kart görseli 768 px ve üstünde ekran üstüne giriyor ama `lazy` — Next onu LCP elemanı seçip **uyarı basıyor**.
2. **`sizes` beyanları gerçek yerleşimin üstünde:** `Frames.tsx` `62vw` ↔ gerçek 45,8vw · `ProductStory.tsx` `58vw` ↔ 52,8vw · `SegmentsGrid.tsx` `42vw` ↔ 37vw.
3. **Hi-dpi varyant tavanı:** altı kullanım yeri gereken pikselin altında (oranlar 0,56-0,79), biri ise **2,05 fazla** teslim alıyor. Bant slotlarına 3:2 kaynaklar `object-cover` ile giriyor ve dikey pikselin %40-60'ı atılıyor — oysa hattın ürettiği **2000×760 bant varyantı (`salon-genis-wide.webp`) hiç kullanılmıyor**.

---

## Bağlam

B-046 kalem (1) ve (6). Kök neden: `priority` ve `sizes` beyanları yazıldıkları anda doğruydu ama yerleşim sonradan kırılıma bağlandı (`hidden lg:block`) ve beyan güncellenmedi — kimse mobilde ne preload edildiğine bakmadı.

**Ölçüm yöntemi uyarısı:** gerçek teslim `_next/image` yanıtı `sharp` ile açılarak ölçülür. `naturalWidth` srcset altında yoğunluğa bölündüğü için **yanıltıcıdır** — o yöntem 10 örnekte doğrulanıp atıldı.

**Temiz çıkanlar korunur:** ham `<img>` yok (0/0), boyut bildirimi tam (yapısal CLS riski sıfır), AVIF devrede (48/48), kırık varlık yok (22/22).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (1) ve (6), teslim tablosu
- `_dev/bulgular/B-047-bakim-borcu-envanteri.md` — `salon-genis-wide.webp`'in öksüzlüğü
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.2 fotoğraf hattı
- `_dev/QUALITY.md` — 4 Performans

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [x] **1. `priority`'yi gerçekten görünen görsele taşı**
  - Mobilde ürün turunun mobil kartı, masaüstünde yapışkan sütun
  - `/segmentler`'in ilk kartı 768 px ve üstünde `priority` alır
  - Çapa: `src/components/sections/ProductStory.tsx` · `src/components/sections/SegmentsGrid.tsx` (⚠️ `grep -n "priority"` ile konumlan)
  - ⚠️ **Plandan sapıldı, ölçümle:** `priority` mobil karta *taşınmadı*, **ikisinden de kaldırıldı** (gerekçe → Kararlar #1). `/segmentler` `priority` değil **`loading="eager"`** aldı ve sayfa-kapsamlı (`eagerFirst` bayrağı), çünkü aynı bileşen `/`'da da kullanılıyor (Kararlar #2).

- [x] **2. `sizes` değerlerini ölçülen yerleşime çek**
  - `Frames.tsx` · `ProductStory.tsx` · `SegmentsGrid.tsx`
  - Kapsam **üçten dokuz beyana çıktı**: `Frames.tsx`'in iki bileşeninin de **ikişer çağrı yeri** var ve gerçek genişlikleri birbirinin iki katı, yani beyan bileşende sabitlenemiyordu → `sizes` prop'a çevrildi, değer çağrı yerinden geliyor. Ayrıca `HowItWorks` · `/gecis` · `Benefits` bantları da ölçüldü ve düzeltildi.

- [x] **3. Bant slotlarına doğru varyantı ver**
  - ~~`public/foto/salon-genis-wide.webp` (2000×760) bugün öksüz; bant slotları onu kullanır~~ → **iki gerekçe de çürüdü, ikinci rota seçildi** (Kararlar #3): dosya TASK-3.18'den beri `Benefits`'te kullanılıyor (öksüz değil), ve iki bandın fotoğrafını onunla değiştirmek alt metinleri yalan yapardı.
  - Seçilen rota alt görevin kendi ikinci cümlesi: `photos-build.mjs` yeniden koştu ve **`-band` varyantı** (1600×608, 2,63:1) doğdu — `grup-dersi` ve `cok-subeli-zincir` için. Aynı fotoğraf, aynı alt metin, doğru oran.

- [x] **4. Fazla teslimi kıs**
  - Roller telefon çerçevesi 640 px alıyor, gereken 312 — `sizes` düzeltmesi bunu kendiliğinden çözmeli, doğrula
  - ✅ Çözdü: **2,05 → 1,23**. ⚠️ Ama o satır **Roller'in değil Hero'nun** telefonu (ölçüldü → Kararlar #4).

---

## Etkilenen Dosyalar

```
src/components/sections/ProductStory.tsx   # priority + sizes
src/components/sections/SegmentsGrid.tsx   # priority + sizes
src/components/ui/Frames.tsx               # sizes
src/components/sections/HowItWorks.tsx     # bant slotu varyantı
src/app/gecis/page.tsx                     # bant slotu varyantı
research/FOTOGRAF-KAYNAKLARI.txt           # yeni varyant üretilirse kaynak kaydı
```

---

## Dikkat Noktaları

- **Görsel elle konmaz.** Yeni bir varyant gerekiyorsa `photos-build.mjs` üretir; `public/foto/` betik çıktısıdır (CLAUDE.md → Dokunulmazlar). Önce `research/FOTOGRAF-KAYNAKLARI.txt`'ye kaynak yazılır, sonra betik koşar.
- **`naturalWidth` ile ölçme** — srcset altında yoğunluğa bölünür ve yanıltır. Teslimi `_next/image` yanıtını `sharp` ile açarak ölç.
- **`next/image` `src`'i URL-kodlar** — `img[src*="/product/"]` seçicisi hiç eşleşmez (ölçülmüş tuzak). Doğrulama betiğinde eşleşme sayısını bas.
- **Yapısal CLS riski bugün sıfır** — boyut bildirimi tam. `sizes` değişikliği bunu bozmamalı.
- **Ölçüm yayın kopyasına karşı** — `docker compose --profile prod up -d web-prod`; `perf.mjs` zaten 3100'e bakıyor.
- **Regresyon çizgisi bu fazda değişmez** (B-035 kapsam dışı): `perf.mjs`'in ağırlık muhasebesi ve yeniden ölçüm "Kalite kapıları otomatik" fazında. Burada öncesi/sonrası kıyası bu task'ın kendi ölçümüdür.

---

## Test Kriterleri

- [x] 390 ve 768 px'te preload edilen görsel **gerçekten görünen** görsel (ölçüldü: preload listesi + `display` durumu) → **görsel preload 28 → 24** (4 profil × 16 rota); `/ozellikler`'de mobilde preload **1 → 0**, `/`'da kalan tek preload Hero'nun ürün ekranı ve o **görünür**; görünmez görsele giden istek 390'da 17 KB → **0**, 768'de 39 KB → **0**
- [x] Next'in "`… was detected as the Largest Contentful Paint`" uyarısı `/segmentler`'de düşmüyor → **düşmüyor** (ölçüldü) + **negatif kontrol**: bayrak kapatılınca uyarı **geri geldi**, yani dedektör kör değil. ⚠️ Uyarı yalnız geliştirme kipinde basılır (`get-img-props.js` → `NODE_ENV !== 'production'`), bu yüzden bu tek kalem 3000'e karşı ölçüldü; **performans yargısı yine 3100'e ait**
- [x] Üç `sizes` beyanı ölçülen yerleşimin ±%10'u içinde → **dokuz beyan**, hepsi ölçülen yerleşimden türetildi, sapma **≤ %3**
- [~] Altı kullanım yerinin teslim/gereken oranı ≥ 1,0; fazla teslim (2,05) 1,0-1,3 aralığına indi → **3/6 kapandı, 3'ü kaynak genişliğiyle sınırlı ve bu task'ın dosya listesinin dışında** (tablo → Test Sonuçları). Fazla teslim **2,05 → 1,23** ✅
- [x] Bant slotları ~~2000×760~~ **1600×608 `-band`** varyantını kullanıyor; dikey piksel kaybı ölçüldü ve düştü → `/gecis` **%50,1 → %12,3** · `HowItWorks` **%38,3 → %0** (orada kalan kayıp yatay, %7,7)
- [x] `perf.mjs` öncesi/sonrası ölçüldü → `/` masaüstü **141 → 111 KB**, mobil **132 → 111 KB**; LCP ve CLS tabloda
- [x] `scan.mjs` konsol temiz; kırık varlık yok → 4 kombinde de temiz

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (biri kısmi — kaynak genişliği sınırı, gerekçe yazılı)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Görsel teslim envanteri sıfırdan çıkarıldı** (`envanter.mjs`, scratchpad): 4 profil (390/2 · 768/2 · 1440/2 · 1440/1) × 16 rota = **156 `<img>` kaydı + 28 görsel preload bağlantısı**, her biri için gerçek yerleşim genişliği, `sizes`, `loading`, görünürlük (`getClientRects()`) ve **gerçek teslim** (`_next/image` yanıtı `sharp` ile açılarak). `naturalWidth` kullanılmadı. Devralınan B-046 tablosunun **altı satırının altısı da birebir doğrulandı** (0,79 · 0,75 · 0,74 · 0,69 · 0,56 · 2,05) — atom bayat değil.
- **`priority` ProductStory'den tamamen kalktı.** Ölçüm: yapışkan sütun `hidden lg:block` içinde, 390 ve 768'de `display:none` — ama `priority`nin doğurduğu preload bağlantısı tarayıcıya onu yine de çektiriyordu (**390'da 17 KB, 768'de 39 KB**) ve `/ozellikler`'de mobildeki **tek** görsel preload'u oydu.
- **`/segmentler`'in ilk kartı `loading="eager"` aldı**, sayfa-kapsamlı `eagerFirst` bayrağıyla.
- **`sizes` dokuz yerde ölçülen yerleşime çekildi:** `Frames.tsx`'in iki bileşeni (değer artık çağrı yerinden), `Hero` ×2, `Roles` ×2, `ProductStory` ×2, `SegmentsGrid`, `HowItWorks`, `/gecis`, `Benefits`.
- **`photos-build.mjs`'e `-band` varyantı eklendi** (1600×608, 2,63:1) ve hat yeniden koştu; `grup-dersi-band.webp` (55 KB) ve `cok-subeli-zincir-band.webp` (38 KB) doğdu, iki bant slotu onlara bağlandı.
- Hattın **bayt-belirlenimli** olduğu ölçüldü (11/11 dosya md5 ile aynı) ve bunun iki sonucu kayda geçti: yeniden koşmak mevcut dosyaları kıpırdatmıyor, ve `Indirme tarihi` artık `new Date()` değil sabit (kaynağın alındığı gün).

**Sorunlar:**
- **İlk envanter koşumu tembel görselleri yakalayamadı** (teslim 0 KB göründü): sayfayı 600 px'lik adımlarla hızlı gezip başa dönüyordu. Çözüm: `innerHeight × 0,8` adımlarla sona kadar gez, **başa dönme**, sonra her görünür `img.complete` olana dek bekle (tavan 15 sn). İkinci koşumda 156/156 kayıt doldu.
- **`calc()` içeren `sizes`, Next'in srcset filtresini kapatıyor.** `get-img-props.js`'in regex'i `(^|\s)(1?\d?\d)vw` arar; `calc(100vw - 64px)` içindeki `100vw`'nin önünde `(` olduğu için eşleşmiyor ve Next 8 aday yerine **16 adayın tamamını** basıyor. Ölçüldü (`/`): 19 srcset'in 12'si 15 adaya çıktı, maliyet **5.915 bayt ham / 599 bayt gzip**. Kabul edildi — karşılığında küçük kutular için daha yakın aday geliyor (Hero telefonu 384 → **256**).
- **`loading="eager"` de preload bağlantısı doğuruyor**, `get-img-props.js`'teki `preload: preload || priority` satırına rağmen (ölçüldü: `/segmentler`'de `rel="preload" as="image"` **1**). Yani `priority` yerine `eager` seçmek preload'dan kurtarmıyor; ama ölçüm gösterdi ki 390'da dört kartın **dördü de** kaydırma olmadan zaten yükleniyor, yani bayrağın dar ekranda ek maliyeti yok.
- **Sayfa boyu iki rotada +1 px oynadı** (`/` 28.062 → 28.063 · `/ozellikler` 14.089 → 14.090, @320). Sebep ölçüldü: `width`/`height` nitelikleri en-boy oranını **yükleme sonrası pinlemiyor** — tarayıcı yüklenen dosyanın kendi doğal oranını kullanıyor, yani teslim varyantı değişince kutu yüksekliği ±0,1-0,4 px kayıyor. Beş ürün ekranı × ≤0,4 px = 1 px. Kutu **genişliği** 156 kaydın hiçbirinde oynamadı.

**Kararlar:**
1. **`priority` mobil karta taşınmadı, ikisinden de kaldırıldı.** Taşımak sorunu simetrik olarak masaüstüne geçirirdi (mobil kart orada `lg:hidden`). Ölçüm kararı verdi: ürün turunun görseli **16 rotanın hiçbirinde, üç profilin hiçbirinde LCP elemanı değil** (`/ozellikler`'de LCP 390/768/1440'ta da bir `<p>`), ve `loading="lazy"` + gizli eleman **hiç istek üretmiyor** (0 bayt, ölçüldü). Yani iki görseli de tembel bırakmak hem preload israfını hem gizli indirmeyi sıfırlıyor, LCP'ye bedeli yok. Doğrulandı: LCP elemanları 7 rota × 3 profilde **birebir aynı** kaldı.
2. **`/segmentler` için `priority` değil `loading="eager"`, ve bileşen geneli değil sayfa kapsamlı.** Next 16.3.4'ün uyarı koşulu tam olarak `lcpImage.loading === 'lazy'` ve uyarının kendi önerdiği çare `loading="eager"`. Bileşen `/`'da da kullanılıyor ve orada kartlar ekranın çok altında, LCP Hero'nun ürün ekranı — bu yüzden bayrak sayfaya bağlandı.
3. **Bant slotları `salon-genis-wide`'ı DEĞİL, kendi fotoğraflarının `-band` varyantını kullandı.** Task'ın gerekçesi (*"bugün öksüz"*) TASK-3.18'den beri geçersiz — dosya `Benefits`'te 10 kez geçiyor. Üstüne, iki bandın fotoğrafını onunla değiştirmek `alt` metinlerini (*"daire şeklinde yapılan grup dersi"*, *"sade ve aydınlık bir stüdyo iç mekânı"*) yalan yapardı ve aynı fotoğraf sitede üç yerde görünürdü (STYLE-GUIDE → düzen çeşitliliği). Alt görevin kendi ikinci cümlesi (*"`-sm` varyantlarının kaynak genişliği kullanım boyutuna göre yeniden seçilir; gerekirse `photos-build.mjs` yeniden koşar"*) izlendi. Oran `-wide` ile aynı tutuldu (2,63:1) ki hat tek bir "bant oranı" taşısın.
4. **B-046'nın *"Roller telefon çerçevesi"* satırı aslında Hero'nun bindirme telefonu.** Ölçüldü: Hero'nunki @1440/2 **156 px** (gereken 312, teslim 640 → 2,05 — atomun rakamı), Roller'inki **244 px** (gereken 488, teslim 640 → 1,31). Satırın adı yanlış, rakamı doğru.
5. **`photos-build.mjs`'in `Indirme tarihi` alanı `new Date()` olmaktan çıktı.** Hat bayt-belirlenimli olduğu ölçüldüğü için yeniden koşmak yeni bir indirme değil; `new Date()` her koşumda lisans açısından anlamlı tek tarihi siliyordu.
6. **Kaynak genişliğiyle sınırlı üç satır kapatılmadı ve bu bilinçli.** Ürün turu `raporlar` 0,79 ve segment kartı 0,75 için daha geniş kaynak gerekir (`render-product.mjs` / yeni foto varyantı) — ikisi de bu task'ın "Etkilenen Dosyalar" listesinin dışında. Segment kahramanı 0,56 ise **kovalanmamalı**: `opacity-45` + `from-ink-deep/92` gradyanın altında dekoratif bir doku ve atomun kendisi onu *"neredeyse görünmez bir doku için en pahalı tek istek"* diye yazıyor — oraya 2880 px teslim etmek yanlış yön olurdu.
- docs/DECISIONS.md'ye eklendi: **Hayır** — altı kalem de mekanizma düzeyinde ve geri dönüşü tek dosya; sözleşme/ad/şema bırakan bir karar yok. Tek adaylık `-band` varyantının adı, o da hattın kendi tablosunda yazılı.

**Kalan İşler:** yok.

**Dosya Değişiklikleri:**
- `research/scripts/photos-build.mjs` → `-band` varyantı (1600×608); her kaynağın varyant listesi artık açık (`v: [...]`, iki ad-hoc `continue` guard'ı kalktı); `Indirme tarihi` sabitlendi
- `public/foto/grup-dersi-band.webp` · `public/foto/cok-subeli-zincir-band.webp` → **yeni** (hat çıktısı, md5 `photos-out/final` ile birebir)
- `research/photos-out/final/{grup-dersi-band,cok-subeli-zincir-band}.webp` + `KAYNAK.txt` → hat çıktısı
- `research/FOTOGRAF-KAYNAKLARI.txt` → `KAYNAK.txt`'ten senkronlandı (yalnız iki "Uretilen" satırı değişti)
- `src/components/ui/Frames.tsx` → `sizes` artık prop (iki bileşende de); sabit beyan kalktı
- `src/components/sections/Hero.tsx` → BrowserFrame ve PhoneFrame'e ölçülmüş `sizes`
- `src/components/sections/Roles.tsx` → aynı ikisine ölçülmüş `sizes`
- `src/components/sections/ProductStory.tsx` → `priority` kalktı; iki `sizes` de ölçülen yerleşime çekildi
- `src/components/sections/SegmentsGrid.tsx` → ölçülmüş `sizes` + `eagerFirst` prop
- `src/app/segmentler/page.tsx` → `<SegmentsGrid eagerFirst />`
- `src/components/sections/HowItWorks.tsx` · `src/app/gecis/page.tsx` → bant `-band` varyantına bağlandı, `sizes` ölçüldü
- `src/components/sections/Benefits.tsx` → bandın `sizes`'ı 640-1151 aralığında düzeltildi

**Test Sonuçları:**

Kapsam: **yayın kopyası (3100)**, `reducedMotion: reduce`, 4 profil × 16 rota. Bu task **kapı üretmiyor** (validator/guard/lint kuralı yok), o yüzden "ürettiğin kapıyı sına" adımı düşer — ama Next'in LCP uyarısı için yine de **bozuk girdi/negatif kontrol** koşuldu. **3100 tazelendi:** `lastmod` 2026-09-24T22:24:41Z → **23:20:40Z**; pozitif kontrol — `/gecis`'te `cok-subeli-zincir-band` **10**, `/`'da `grup-dersi-band` **10**, `/segmentler`'de `loading="eager"` **1**; negatif-değişim — `/gecis`'te `cok-subeli-zincir-sm` **1 → 0**, `/`'da `grup-dersi-sm` **1 → 0**, `/ozellikler`'de takvim preload **1 → 0**, site genelinde `62vw` **→ 0**; değişmemesi gerekenler — `salon-genis-wide` `/`'da duruyor, `/segmentler`'de `cok-subeli-zincir-sm` (kart küçük resmi) duruyor, `sm:whitespace-nowrap` **17**, `/demo` `peer-checked` **3** ve `>Demo<` **2**, `/`'da `minmax(0,0.58fr)` **2** ve `lg:grid-cols-5` **2**.

**B-046 kalem (6) — altı satırın önce ➜ sonra hâli (@1440/2):**

| Kullanım | gereken | teslim önce | oran | teslim sonra | oran | |
|---|---|---|---|---|---|---|
| Ürün turu `raporlar` | 1520 | 1200 | 0,79 | 1200 | **0,79** | kaynak 1200 px — `render-product.mjs` işi, kapsam dışı |
| Segment kartı (`-sm`) | 1068 | 800 | 0,75 | 800 | **0,75** | kaynak 800 px — yeni varyant gerekir, kapsam dışı |
| HowItWorks bandı | 1088 | 800 | 0,74 | **1200** | **1,10** | ✅ `-band` |
| `/gecis` bandı | 1152 | 800 | 0,69 | **1200** | **1,04** | ✅ `-band` |
| Segment kahramanı | 2880 | 1600 | 0,56 | 1600 | **0,56** | bilinçli — dekoratif doku (Kararlar #6) |
| Hero telefon çerçevesi | 312 | 640 | **2,05** | **384** | **1,23** | ✅ hedef aralık 1,0-1,3 |

**Tüm slotların özeti (görünür, teslim ölçülmüş):** 390/2 fazla teslim **13 → 2**, teslim bayt toplamı **921 → 764 KB** · 768/2 **4 → 4**, 1672 → 1641 KB · 1440/2 eksik **25 → 23**, fazla 3 → 2 · 1440/1 fazla **14 → 1**, 1310 → **1147 KB**. **27 slot düzeldi, 0 slot bozuldu.**

**Dikey piksel kaybı (`object-cover`, @1440):** `/gecis` bandı **%50,1 → %12,3** · `HowItWorks` bandı **%38,3 → %0** (kalan kayıp yatay: %7,7) · `Benefits` bandı %53,6 → **%53,6 değişmedi** (slot 5,67:1, kaynak 2,63:1 — kendi varyantı yok, kayıt aşağıda).

**`perf.mjs` önce ➜ sonra** (iki koşum; ağırlık belirlenimli, LCP ms değil):

| sayfa | profil | ağırlık | TTFB | FCP | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | masaüstü | **141 → 111 KB** | 6 → 4 ms | 84 → 80 | **84 → 80 ms** | 0,005 → 0,005 |
| `/` | mobil | **132 → 111 KB** | 4 → 4 ms | 60 → 64 | 60 → **64/68 ms** | 0 → 0 |
| `/fiyat` | masaüstü/mobil | 95 → 95 / 95 → 95 | — | — | 40→44 / 36→36 | 0,001 / 0 |
| `/segmentler/pilates-reformer` | masaüstü/mobil | 182 → 182 / 125 → 125 | — | — | 40→40/60 / 44→44/64 | 0,001 / 0 |
| `/demo` | masaüstü/mobil | 73 → 73 / 73 → 73 | — | — | 36→32/36 / 28→28/52 | 0,001 / 0 |

**M6 regresyon çizgisi 144 KB / 96 ms** — `/` iki profilde de **111 KB** ve LCP 80/64 ms ile çizginin altında; ağırlık çizgiye göre **33 KB pay** bıraktı (önce 3 KB idi). Düşüşün tamamı görselde: `/` avif masaüstü **46 → 16 KB**, mobil **37 → 16 KB**; font 95 KB birebir. **LCP ms gürültülüdür ve kanıtı var:** görseli hiç olmayan `/demo` mobilde iki koşum arasında 28 → 52 ms oynadı; ağırlık ise `/` için iki koşumda da **111 KB** (belirlenimli).

**İstek ve DOM:** `/` masaüstü 36 → 35 istek, mobil 25 → 24; DOM **1492 → 1491** (masaüstü) ve **1489 → 1488** (mobil) — fark **tam hesaplı**: kaldırılan `<link rel="preload">` elemanının ta kendisi, `img` sayısı **19 → 19** birebir.

**Kapılar (önce ➜ sonra):**
- **`mobile-audit` — MOBİL KAPI YEŞİLDİ, HÂLÂ YEŞİL:** 2 genişlik × 16 rota, `TOPLAM SORUN` **0 → 0**, çıkış **0 → 0**, `✓ KAPI YEŞİL`. **Kapsam tabanlarının hiçbiri oynamadı ve hiçbiri elle değiştirilmedi**: eleman **6253 → 6253** · metin elemanı **2054** · kritik hedef **305 / 0 eşik altı / 0 benzersiz** · gezinme **333 / 261** (alt bilgi 256 · içerik yolu 4 · gövde 1) · kaydırılabilir kap **5** · dokunma hedefi **638** · kırpma 0 · şerit 0 · yatay kaydırma yok.
- **`a11y` — birebir:** 6 sorun / çıkış 1 (hepsi `/gecis`, adlandıran task yok) · 16 rota · **105** adım · **1834** eleman · gradyan **19** · başlık **316** · yapışkan borcu 151 · görünmez 43.
- **`font-guard`:** çıkış **0**, **85.129** karakter (birebir — yeni metin yazılmadı).
- **`scan`:** `/` @390 (20 kare) · `/` @1440 (18 kare) · `/gecis` @1440 (6 kare) · `/segmentler` @768 (5 kare) — **dördünde de konsol temiz**, kırık varlık yok.
- **`npm test`:** **219 geçti + 2 atlandı** (iki env kapısı kapalı) · `tsc --noEmit` **0** · `lint` **30** (25 hata + 5 uyarı, HEAD ile birebir; dokunduğum altı dosyanın hiçbirinde yeni kalem yok — `ProductStory.tsx:106` `shot` uyarısı HEAD'de de vardı, doğrulandı).

**Görünüş — ne DEĞİŞMEDİ:** 16 rota × 2 genişlik = 32 sayfa boyu ölçümünün **30'u birebir**; görsel kutu **genişliği 156 kaydın 156'sında birebir**; bant slotlarının kutuları (`h-48` / `h-56`) birebir; `/gecis`, `/segmentler` ve dört segment sayfasında hiçbir geometri farkı yok. **Ne DEĞİŞTİ:** `/` @320 **28.062 → 28.063** ve `/ozellikler` @320 **14.089 → 14.090** — ikisi de **+1 px**, ve mekanizması ölçüldü (yukarıda Sorunlar); 24 görselin yüksekliği ±0,1-0,4 px oynadı, toplam **+1,2 px**.

**Negatif kontrol + belirlenimlilik:** (a) Next'in LCP uyarısı — bayrak **kapatılınca uyarı geri geldi** (`loading=lazy`, uyarı basıldı), açıkken basılmıyor → dedektör kör değil; kontrol geliştirme sunucusunda, **kaynak geri alındı ve doğrulandı**. (b) `perf.mjs` iki kez koştu, `/` ağırlığı iki koşumda da **111/111 KB**. (c) Envanter betiği her koşumda **"kaç eşleşme buldum"** bastı: **156 `<img>` + 28/24 preload**, iki koşumda da aynı kayıt sayısı. (d) Hat belirlenimliliği: `photos-build.mjs` scratch dizine koşuldu, **11/11 dosya md5 ile mevcutla aynı** çıktı — gerçek koşumda da 9 eski dosya `git status`'ta görünmedi.

**Kapsam tabanı değişikliği:** **yok** — altı tabanın (`BEKLENEN_ROTA` 16 · `BEKLENEN_GRADYAN` 19 · `BEKLENEN_BASLIK` 316 · `BEKLENEN_METIN_ELEMANI` 2054 · `BEKLENEN_SERIT` 5 · `BEKLENEN_KRITIK_HEDEF` 305) hiçbirine dokunulmadı ve hiçbiri kendiliğinden oynamadı.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-25

**Ne Yapıldı:**
- Görsel teslim katmanının üç sapması ölçülerek kapatıldı: görünmeyen görsele giden `priority` kalktı (mobilde 17-39 KB'lik boş indirme ve `/ozellikler`'in tek preload'u sıfırlandı), dokuz `sizes` beyanı gerçek yerleşimden yeniden yazıldı, ve bant slotları hattın yeni `-band` varyantına (1600×608) bağlandı.
- Sonuç rakamla: `/` sayfa ağırlığı masaüstünde **141 → 111 KB**, mobilde **132 → 111 KB**; 27 slot düzeldi, 0 slot bozuldu; fazla teslim 1440/1'de **14 → 1**.
- Beş kapının beşi de önceki hâlini korudu; mobil kapı yeşil kaldı, altı kapsam tabanının hiçbiri oynamadı.

**Öğrenilenler:**
- **`width`/`height` nitelikleri yükleme SONRASI en-boy oranını pinlemiyor** — tarayıcı yüklenen dosyanın doğal oranını kullanıyor. Pratik sonucu: bir `sizes` ya da varyant değişikliği sayfa boyunu ±1 px oynatabilir ve bu bir yerleşim regresyonu **değildir**. Piksel kıyası yapan sonraki turlar bunu bilmeli (ölçüldü: 24 görselde ±0,1-0,4 px, iki sayfada toplam +1 px).
- **`sizes` içinde `calc()` kullanmak Next'in srcset budamasını kapatıyor** (regex `(^|\s)(1?\d?\d)vw`, `calc(` önekiyle eşleşmiyor) → 8 aday yerine 16. Bedeli ölçüldü: `/` için 5.915 bayt ham, **599 bayt gzip**; karşılığı küçük kutularda daha yakın aday.
- **`loading="eager"` de `priority` gibi preload bağlantısı doğuruyor** (`preload: preload || priority` satırına rağmen), yani "eager ama preload'suz" diye bir ara hâl yok.
- **Bir ölçüm betiği tembel görselleri uyandırmak için sona kadar gezmeli ve başa DÖNMEMELİ**; ilk koşum bunu yapmadığı için teslim 0 bayt göründü ve tablo sahte "eksik" doluydu.

---

**Oluşturulma:** 2026-09-23
