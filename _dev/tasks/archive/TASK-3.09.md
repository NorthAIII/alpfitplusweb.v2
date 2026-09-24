# TASK-3.09: Ürün turunun soluk adım kartları AA'ya çıkar

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

Ürün turunun (`ProductStory`) etkin olmayan adım kartları masaüstünde kalıcı `lg:opacity-45` taşıyor ve içindeki üç metin katmanı da eşik altında kalıyor: **etiket 2,98-3,00**, **gövde 2,52-2,54**, ve araştırmanın bulduğu **başlıklar 1,13:1** (gereken 3). Üç katman da AA'ya çıkarılır. Kalem `/` ve `/ozellikler` sayfalarını, 16 elemanı etkiler.

---

## Bağlam

B-032 kalem 1. Kapı bu kartları bugüne dek **8,03-10,63:1** sanıyordu — ata opaklığını renge uygulamadığı için. TASK-3.04 o kör noktayı kapattı; bu task kapının artık gösterdiği ihlali kapatır.

Araştırma, kayıtlı beş kalemin **eksik** olduğunu ölçtü: soluk kartların **başlıkları** kayıttaki hiçbir rakamdan kötü — **1,13:1** ("Gün, tek ekranda" · "Şubeler yan yana"). Kullanıcı kararı: **hepsi düzelir.**

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 1 ve düzeltme seçenekleri
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 3. satır (küme neden daha geniş)
- `_dev/docs/STYLE-GUIDE.md` — token değerleri, "ölçümü rakamıyla CSS yorumuna yaz" geleneği

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — seçilen çözüm bir deyim kuruyorsa (soluk hâlin metin rengi) kaydı

---

## Alt Görevler

- [x] **1. Üç katmanı ölç**
  - Etkin olmayan kartın etiketi (`text-sage-br`), başlığı ve gövdesi (`text-canvas/65`) — düzeltme öncesi değerleri yaz
  - Çapa: `src/components/sections/ProductStory.tsx` — `lg:opacity-45` ve içindeki metin sınıfları (⚠️ satır numaraları kaydı, `grep -n` ile yeniden konumlan)

- [x] **2. Çözümü seç ve uygula**
  - Seçenek A: soluk hâlin opaklığı ≥ 0,7'ye çıkar (tek değişiklik, üç katmanı birden etkiler)
  - Seçenek B: soluk hâl için metin renkleri ayrıca seçilir (opaklık korunur, görsel ayrım daha belirgin kalır)
  - Karar ölçütü: etkin/etkin-olmayan ayrımı gözle korunmalı **ve** üç katman da eşiği geçmeli

- [x] **3. Ölçülen rakamı koda yaz**
  - Seçilen değerin yanına kontrast rakamı yorum olarak (mevcut token yorumlarının kurduğu gelenek)

---

## Etkilenen Dosyalar

```
src/components/sections/ProductStory.tsx   # soluk adım kartlarının opaklığı / metin renkleri
```

---

## Dikkat Noktaları

- **Görsel ayrım kaybolmamalı.** Ürün turunun anlatısı etkin adımın öne çıkmasına dayanıyor; opaklığı yükseltmek ayrımı zayıflatırsa Seçenek B'ye geç.
- **Ölçüm masaüstünde (≥ lg) yapılır** — kalem yalnız orada doğuyor; mobilde kartlar `bg-white/5 ring-white/10` ile ayrı bir deyim kullanıyor ve o hâl ayrıca ölçülmeli.
- **Kapı yayın kopyasını ölçüyor:** düzeltmeyi gördükten sonra `docker compose build web-prod` **ve** `docker compose --profile prod up -d web-prod` — yalnız `build` konteyneri tazelemez. Ara doğrulama için `BASE=http://localhost:3000` ile geliştirme sunucusuna yönlendirebilirsin.
- **Bu bölüm `priority` ve `opacity-0` kalemlerini de taşıyor** (TASK-3.20 ve TASK-3.21) — onlara bu task'ta dokunma, aynı dosyada olsalar bile.

---

## Test Kriterleri

- [x] `a11y.mjs` koşumunda ürün turunun soluk kart kalemleri (etiket · başlık · gövde) **eşiğin üstünde**; ölçülen rakamlar task dokümanına yazıldı
- [x] `/` ve `/ozellikler`'de bu sınıftan eşik altı eleman **0**
- [x] Etkin / etkin olmayan adım ayrımı 1440 px'te gözle korunuyor (ekran görüntüsü ile karşılaştırıldı)
- [x] Mobil (390 px) hâlinde de eşik altı yok
- [x] Beş ölçümün geri kalanı regresyon çizgisini koruyor (a11y, mobil, font, tarama)

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Üç katman düzeltmeden önce yeniden ölçüldü** (kapının kendi yöntemiyle, `a11y.mjs` 3100'e karşı @1440×900) — devralınan rakama güvenilmedi: gövde `p02` **2,52-2,54**, etiket **2,98-2,99**, başlık **4,39-4,43**. Kapı `/`'da 6, `/ozellikler`'de 5 kalem basıyordu (toplam **11**).
- **Kapının basmadığı katman ayrıca ölçüldü.** Kapı yalnız ihlali yazar; başlığın değerini görmek için aynı lib'i (`research/lib/piksel-kontrast.mjs`) kullanan bir sonda yazıldı (scratchpad'de, repoya girmedi) ve **eşleşen her kalem** basıldı — böylece "başlık kaçta" sorusu tahminle değil ölçümle cevaplandı.
- **Çözüm ölçülerek seçildi ve iki ayaklı oldu:** etkin olmayan kartın opaklığı `lg:opacity-45` → **`lg:opacity-70`**, gövdenin kendi alfası `text-canvas/65` → **`text-canvas/78`**.
- **Ölçülen rakamlar koda yorum olarak yazıldı** (STYLE-GUIDE'ın kurduğu gelenek): önce/sonra üçlüsü, eşikler, ve "tek başına opaklık neden yetmezdi" gerekçesi.

**Sorunlar:**
- **Görev dokümanının "Seçenek B: opaklık korunur, metin renkleri ayrıca seçilir" maddesi matematiksel olarak uygulanamaz çıktı.** Ölçüldü/hesaplandı: 0,45 opaklıkta gövdeye **tam beyaz** verilse bile `ink-deep` üzerinde ~4,5 çıkıyor, yani 4,5 eşiğinde **hiç pay yok**. Opaklık yükselmek zorundaydı; soru "yükselsin mi" değil "ne kadar yükselsin"e indi.
- **390 px'te ölçüm hedefi sonucu değiştirdi.** `BASE=http://localhost:3000` (task dokümanının önerdiği ara doğrulama yolu) 390 px'te `"05 · raporlar"` etiketini **1,35** basıyor; aynı kod, aynı pencere, aynı betikle 3100 **9,54** basıyor. Nedeni bulundu: `next dev` sayfaya bir geliştirici göstergesi enjekte ediyor (3000'in HTML'inde `devtools` izi **var**, 3100'de **yok**), sabit ve açık renkli bu katman dar ekranda son kartın etiketinin üstüne biniyor ve piksel kapısı onu zemin sanıyor. **Sahte kırmızıdır, düzeltmeyle ilgisi yok** — düzeltmeden önceki hâlde de, sonraki hâlde de aynı 1,35 çıkıyor (3000'de 3/3 ve 2/2 koşum birebir; 3100'de 2/2 koşum temiz). Hafızaya yazıldı.

**Kararlar:**
- **Tek değişiklik yerine iki değişiklik** (opaklık **ve** gövde alfası): gövde iki kez soluyordu (`0,65 × 0,45 = 0,29` etkin alfa) ve eşiği zorlayan katman oydu. Yalnız opaklıkla aynı payı tutturmak **0,80** isterdi; iki ayaklı çözüm **0,70**'te aynı payı verdi, yani etkin/etkin-olmayan ayrımı daha az yıprandı. Ölçülen ayrım: başlıkta 9,28 (soluk) ↔ 18,46 (etkin), gövdede 5,82 ↔ 11,3 — etkin kart hâlâ yaklaşık iki katı.
- **Token'a (`--color-canvas`) dokunulmadı, bileşene dokunuldu.** T5'in gradyan task'ında ölçtüğü risk burada da geçerliydi: `canvas` token'ı sitenin her yerinde kullanılıyor, değiştirmek bugün geçen kalemleri de oynatırdı. Değişiklik iki sınıf değerinde kaldı, kapsamı `ProductStory.tsx`.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü maliyetli bir sözleşme (ad/şema/API) doğmadı; iki sınıf değeri, gerekçesi kodda yorum olarak duruyor.

**Kalan İşler:** yok

**Dosya Değişiklikleri:**
- `src/components/sections/ProductStory.tsx` → etkin olmayan adım kartı `lg:opacity-45` → `lg:opacity-70`; adım gövdesi `text-canvas/65` → `text-canvas/78`; iki yere ölçülmüş rakamları ve gerekçeyi taşıyan yorum

**Test Sonuçları:**
- **`a11y.mjs` (3100, 1440×900, 16 rota — kapının tam koşumu):** `TOPLAM SORUN` **57 → 46**, çıkış kodu **1** (kalan 46 bu task'ın kapsamı dışı: 17 gradyan metin + 1 başlık atlaması + 28 kontrast). Düşen tam olarak **11** kalem — bu task'ın listesinin tamamı. Kapsam tabanlarının hiçbiri oynamadı: 16 rota · 105 ekran adımı · **1835 eleman** · gradyan **19 ölçüldü (taban 19) / 17 eşik altı** · başlık **316 (taban 316) / 1 atlama** · kovalar yapışkan 151 · görünmez 43 · ekran dışı 0 · **kalan 0** · 66 → 69 sn.
- **Kalem kalem, yayın kopyasına karşı (p02 · @1440×900):** etiket 2,98/2,98/2,99 → **5,34/5,43/5,43** · gövde 2,52/2,54/2,54 → **5,82/5,94/5,96** · başlık 4,39/4,43/4,43 → **9,11/9,28/9,28**. Etkin karttaki kalemler de ölçüldü: etiket 9,84 (değişmedi) · gövde 8,03 → **11,3** · başlık 18,46 (değişmedi). `/ozellikler`'de aynı sınıfın 15 kaleminin **hepsi** geçiyor.
- **Dar genişlik (390 px) — kapı buraya bakmıyor, ayrıca ölçüldü:** 3100'e karşı ProductStory'nin 15 kaleminin hepsi geçiyor — etiket **8,39-9,54**, gövde **9,70-9,79**, başlık **15,06-16,57**. Bu genişlikte kart opaklığı zaten hiç uygulanmıyor (`lg:` öneki), değişen yalnız gövde alfası: 7,11 → 9,70 (7,11 dev sunucusunda ölçüldü — 3100'ün düzeltme öncesi kopyası artık yok).
- **Görsel ayrım (test kriteri):** 1440 px'te iki kare yan yana alındı — biri bugünkü hâl, öteki aynı sayfaya CSS enjekte edilerek eski değerlere döndürülmüş hâl (kaynağa dokunulmadı). Etkin kart her iki karede de en parlak olan; soluk kartlar okunur hâle geldi ama hiyerarşi ayırt edilir kaldı.
- **Regresyon çizgisi:** `mobile-audit.mjs` (2 genişlik × 16 rota) **285 sorun, çıkış 1** — T8'in çizgisiyle birebir (320 px: kırpma 19 · şerit 8 · kritik 125/19; 390 px: kırpma 0 · şerit 8 · kritik 125/19) · `font-guard.mjs` **çıkış 0**, 16 sayfa / 85.129 karakter tarandı, kümede olmayan karakter yok · `scan.mjs` `/` @1440 (17 kare) ve `/ozellikler` @390 (16 kare) **konsol temiz** · `npm test` **210 geçti + 2 atlandı**, çıkış 0 (iki atlama env kapılı, beklenen).
- **Yayın kopyası tazelendi ve tazelik POZİTİF KONTROLLE ölçüldü** (B-019): `docker compose --profile prod up -d --build web-prod` sonrası site haritası `lastmod` **2026-09-24T12:28:32.356Z → 2026-09-24T15:08:10.582Z**, ve ayırt edici sınıf sayıları `lg:opacity-45` **4 → 0** · `lg:opacity-70` **0 → 4** · `text-canvas/65` **13 → 8** · `text-canvas/78` **0 → 5**. "Build koştu" kanıt sayılmadı.
- **Kapsam:** ölçüm yayın kopyasına (3100) karşı, `reducedMotion: reduce`, **etkileşimsiz hâl** (açılmamış menü/sekme/akordeon dışarıda — B-015). Yargı değeri `p02`.

---

**Oluşturulma:** 2026-09-23
