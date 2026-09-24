# TASK-3.19: Modüller bölümünün tırtıklı 5'li ızgarası yeniden kurulur

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.18 ✅

---

## Hedef

`Modules` bölümünün öne çıkan modülleri `lg:grid-cols-3` ızgarada **5 kart** olarak diziliyor — masaüstünde 3 + 2, ikinci satır tırtıklı bitiyor. Izgara içeriğe göre yeniden kurulur: öne çıkanların sayısı ızgaraya göre değil **içeriğe göre** seçilir (5 kart → ya 2+3 kurgusu ya farklı düzen).

**Kapsam dışı:** aynı bölümün 5'li ikon şeridi (`lg:grid-cols-5`) — kullanıcı kararıyla olduğu gibi kalır ve kanvasta açık durur.

---

## Bağlam

B-051'in ikinci ızgarası. `Benefits`'ten farkı yalnız madde listesi; kalıp aynı. Kullanıcı ikisini de kapsama aldı, üçüncüsünü (ikon şeridi) bilinçle dışarıda bıraktı — *"üçünü birden yeniden kurmak ana sayfanın orta bölümünü baştan tasarlamak demekti ve fazı birkaç beğeni turuna bağlardı."*

**Kısıt:** metin taşımaz, yeni cümle yazılmaz (TASK-3.18 ile aynı kural).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-051-ana-sayfada-ikon-kart-izgaralari.md` — ızgaraların ölçümü
- `_dev/docs/STYLE-GUIDE.md` — reddedilen ve istenen kalıplar
- `_dev/tasks/archive/TASK-3.18.md` — seçilen ritim; iki bölüm birbirini tekrar etmemeli
- `_dev/docs/CLAIMS.md` — modül anlatımının iddia sınırı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/DECISIONS.md` — seçilen düzen

---

## Alt Görevler

- [x] **1. Öne çıkan sayısını içeriğe göre seç**
  - Bugün 5 (`featured: true`); ızgaraya göre değil, anlatıya göre belirlenir
  - Çapa: `src/content/product.ts` → `featured` alanları · `src/components/sections/Modules.tsx` (⚠️ `grep -n` ile konumlan)

- [x] **2. Düzeni kur**
  - TASK-3.18'in seçtiği ritimden **farklı** olmalı — ardışık iki bölüm aynı kalıbı kullanmaz
  - Tırtıklı satır bırakmayan bir yerleşim

- [x] **3. İkon şeridine dokunma**
  - `lg:grid-cols-5` şerit kapsam dışıdır; yerinde kalır

---

## Etkilenen Dosyalar

```
src/components/sections/Modules.tsx   # öne çıkanların düzeni (ikon şeridi hariç)
src/content/product.ts                # featured seçimi (cümle değişmez)
```

---

## Dikkat Noktaları

- **İkon şeridi kapsam dışı** — kullanıcı kararı; kanvasta açık kalır, "kapandı" işaretlenmez.
- **Tasarım kararı kullanıcıya getirilir** (TASK-3.18 ile aynı disiplin).
- **Yeni cümle yazılmaz**; `featured` seçimi değişse bile metinler `src/content/`'te olduğu gibi kalır.
- **İddia sınırı:** modül anlatımı `CAPABILITIES` kademelerine bağlı — "bugün var / yolda" ayrımı `src/content/product.ts`'ten türer ve `tests/capabilities.test.ts` bunu doğrular. Öne çıkan seçimi bu ayrımı bozmamalı.
- **Kapılar koşulur** — yeni düzen kontrast, kırpma ve dokunma hedefi riski getirir.

---

## Test Kriterleri

- [~] Kullanıcı düzeni onayladı — **alınmadı**, düzen duran yetkilendirmeyle seçildi → `kanal: UAT`
- [x] Masaüstünde tırtıklı biten satır kalmadı — üst sıra 631 + 457 = 1088, alt sıra 3 × 362,7 = 1088 (ölçüldü @1440)
- [x] Bölüm TASK-3.18'in ritmini tekrar etmiyor — o döküm (tam genişlik, tek kulvar, satır içi ikon), bu pano (tek çerçeve, eşit olmayan hücre, ikon yok)
- [x] `npm test` **219 geçti + 2 atlandı** (birebir taban)
- [x] `a11y` **6 / çıkış 1** (tabana eşit, hepsi `/gecis`; `/` 0 ihlal) · `mobile-audit` **0 / çıkış 0 · KAPI YEŞİL** · `font-guard` **çıkış 0, 85.129 karakter** · `scan` `/` @320 · @390 · @1440 **konsol temiz**
- [x] `src/content/` cümleleri değişmedi — `git diff --stat -- src/content/` **boş**

---

## Karar Noktaları

- **Öne çıkan modül sayısı ve düzen:** kullanıcıya **sorulmadı** — koşum açılışındaki duran yetkilendirmeyle karar verildi (makul olanı seç, gerekçesiyle yaz, durma). Sayı **5'te kaldı** ve gerekçesi ölçüldü (kapsam dışı şerit `lg:grid-cols-5`); düzen **pano** oldu. Beğeni yargısı yerel koşucunun ölçtüğü katmanın dışında → `kanal: UAT`.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (kullanıcı beğenisi hariç → `kanal: UAT`)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Öne çıkanların ızgarası PANOYA çevrildi.** Eski hâl `md:grid-cols-2 lg:grid-cols-3` üzerinde beş **eşit** kart (ölçüldü @1440: beşi de 349,3 px genişlikte, iki yükseklik — 378,1 ve 358,1), her kart `IconBox` (44×44 karo) + başlık + blurb + dört madde, ve masaüstünde 3 + 2 dizildiği için ikinci satır **tırtıklı**. Yeni hâl: beş hücre **tek çerçeveli bir panonun** (`rounded-card ring-1 ring-line bg-surface`) içinde, iç saç teli çizgilerle ayrılmış; üst sıra **iki** hücre (`lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]`), alt sıra **üç** hücre (`lg:grid-cols-3`). İki sıra da kabı tam doldurur — **tırtıklı satır kalmadı**.
- **Omurga hücresi üç işaretle belirtildi:** genişlik (0,58), punto (`text-xl sm:text-2xl` ↔ ötekiler `text-lg`) ve soluk zemin (`bg-surface-2`, bölümün kapsam dışı şeridiyle aynı ton). Maddeleri `sm:columns-2` ile iki sütuna akar. Seçim içeriğin kendi cümlesinden geldi (`Takvim ve Rezervasyon` blurb'ü *"Ürünün en kritik modülü"* diyor) — **yeni etiket yazılmadı**.
- **Panoda ikon YOK ve yerine başka bir ikon konmadı.** `IconBox` karosu kalıbın ikinci ayağıydı; satır içi küçük işaret ise TASK-3.18'in jesti — tekrarı "çeşitlilik" olmazdı. Madde işareti `::before` ile çizilen 10 px'lik tek piksellik çizgi (svg değil, yeni karakter değil). `Check` ikonları da düştü.
- **`src/content/product.ts`'e DOKUNULMADI** (task'ın "Etkilenen Dosyalar"ı onu adıyla sayıyordu): öne çıkan sayısı **5'te kaldı** ve gerekçesi ölçüldü — kapsam dışı şerit `lg:grid-cols-5`'tir, yani 4 ya da 6 öne çıkan tırtıklı satırı çözmez, **dokunulmayacak şeride taşır**. Düzeltilen sayı değil düzendir. Madde kırpması da eskisi gibi `slice(0, 4)`; `/ozellikler` zaten on modülü **tüm** maddeleriyle gösteriyor, yani siteden hiçbir cümle düşmedi.
- **Değişen tek dosya `src/components/sections/Modules.tsx`** (geri dönüş tek `git revert`). Dosya başına gerekçe yorumu yazıldı: neden pano, neden ikonsuz, öne çıkan sayısının neden içerikten geldiği, sayfanın ritim envanteri.

**Sorunlar:**
- **Alt şerit karesi önce/sonra arasında farklı çıktı ve mekanizması ölçülerek ayrıldı.** Ham fark: @320 **68.402** px (maks kanal farkı **7**), @390 **78.179** (maks **2**), @1440 **12.062** (maks **163**). Önce belirlenimlilik sınandı — **aynı yapıyı iki kez ölçtüm, altı karede de 0 farklı piksel**, yani ölçüm oynamıyor. Sonra **telafi kontrolü**: kaynağa dokunmadan `#moduller`'e bölümün kısaldığı kadar dolgu enjekte edildi (sayfa ve bölüm boyu eski değerlere **birebir** döndü) ve alt şerit yeniden alındı → @320 **0**, @390 **0**, @1440 **205 px / 1.296.000 (%0,016**, hepsi ürün ekran görüntüsünün içinde, yeniden ölçekleme gürültüsü). **Sonuç: altındaki içerik değişmedi, yalnızca YERİ değişti** — koyu zeminli `ProductStory`'nin gradyan taraması belge konumuna bağlı (düşük genlikli, ≤ 7) ve @1440'ta bölüm boyu farkı **tam sayı değil** (−205,9), o yüzden altındaki metin altpiksel faz kaydırıyor (T18'in kuralı: fark tam sayıysa antialias, kesirliyse gözle görülmeyen büyük sayı).
- **Telafi enjeksiyonunun ilk turu 1440'ta 24 px şaştı:** `Section`'ın dolgusu `py-18 sm:py-24`'tür, yani `calc(4.5rem + …)` dar genişliklerde doğru, ≥ 640 px'te **eksik** telafi verir (96 − 72 = 24 px). Düzeltilince fark 5.568 → **205** pikselle kapandı. Ders: enjekte telafi, telafi ettiği kutunun **duyarlı** değerini de taşımalı.

**Kararlar:**
- **Düzen kullanıcıya SORULMADI** — koşum açılışındaki duran yetkilendirme (makul olanı seç, gerekçesiyle yaz, durma). Task dokümanı bunu karar noktası olarak işaretliyordu; beğeni yargısı yerel koşucunun ölçtüğü katmanın dışında → `kanal: UAT`.
- **Seçilen ritim sayfanın bugünkü hâline karşı ölçüldü.** İki sütunlu bölme zaten 8 bölümde var (T18 saydı) — dokuzuncusu değişim olmazdı; tam genişlikte saç teli döküm bir önceki turda `Benefits`'e verildi, tekrarı olurdu; eşit kartlı ızgara `WhyUs` ve `SegmentsGrid`'in ritmi; akordeon `Faq`'ın, yapışkan tur `ProductStory` ve `HowItWorks`'ün. **Çerçeveli, eşit olmayan hücreli pano sayfada hiç yok.** Ek gerekçe: pano bölümün kendi cümlesini görselleştiriyor — *"Kulübün tamamı, parça parça değil."*
- **Elenen adaylar:** (a) *12 sütunlu tek ızgarada 7+5 / 4+4+4* — tırtıklı satırı çözerdi ama tek kapta 5 çocuk bırakır, yani kalıbın **birinci ayağı** ölçümde 1'de kalırdı; iki ayrı sıra kabı seçildi; (b) *lg'de iki sütunlu bölme (solda sabit başlık, sağda liste)* — sayfanın dokuzuncu bölmesi olurdu; (c) *akordeon/sekme* — `Faq` zaten akordeon, ayrıca etkileşim yeni dokunma hedefi ve yeni kapı riski getirirdi; (d) *fotoğraf bandı* — bir önceki tur `Benefits`'e koydu, ayrıca hemen ardından gelen `ProductStory` zaten görsel ağırlıklı; (e) *üç kümeye ayırıp etiketlemek* — küme etiketi **yeni metin** olurdu.
- **Omurga hücresine soluk zemin verildi ve bedeli ölçüldü** (gövde `p02` 7,05 → 6,61; başlık 17,57 → 16,48; gerekenler 4,5 ve 3). Gerekçe: hiyerarşi punto farkına kalmadan da okunsun; ton bölümün ikinci yarısındaki şeritle aynı aileden (`surface-2`).
- docs/DECISIONS.md'ye eklendi: **Evet** (2026-09-25 kaydı). B-051'in **Çözüm Kaydı yazıldı**; atom arşivlenmedi, satırı silinmedi — teyidin evi `verify-phase`.
- **STYLE-GUIDE'a plan dışı iki ölçülmüş kural yazıldı** (task dokümanı çıktı olarak saymıyordu; B-051'in "Koruma Önerisi" ayağı): reddedilen kalıbın **üç mekanik ayağı** ve *"her bölüm bir öncekinden farklı ritimde"* maddesinin sayfanın **ritim envanteriyle** nasıl sayılarak uygulandığı. **Kullanıcının refleks listesine, tokenlara ve tipografiye dokunulmadı.**

**Kalan İşler:**
- Kullanıcı beğenisi alınmadı → `kanal: UAT`. Yön reddedilirse bölüm tek dosya: `git revert <bu commit>` ya da `git show 091f2a9:src/components/sections/Modules.tsx`.
- 5'li ikon şeridi bilinçle duruyor (kullanıcı kararı) — bölümde kalan 1 ızgara kabı ve 5 × 36×36 karo onundur.

**Dosya Değişiklikleri:**
- `src/components/sections/Modules.tsx` → tek dosya. Izgara + 5 kart + `IconBox` + `Check` düştü; çerçeveli pano, iki sıra (0,58/0,42 ve 3 eşit), `Reveal as="article"` doğrudan ızgara öğesi (sarmalayıcı `div` kalktı), omurga hücresinde `bg-surface-2` + `sm:columns-2` madde akışı, madde işareti `::before` çizgisi. `src/content/product.ts` **değişmedi**.

**Test Sonuçları:**

Kapsam: **yayın kopyası (3100)**, `reducedMotion: reduce`, 320/390/1440. **Kullanıcı beğenisi kapsam dışı → `kanal: UAT`.** Bu task bir doğrulama kapısı **üretmiyor**, o yüzden "ürettiğin kapıyı sına" adımı düşer.

- **3100 tazelendi, pozitif + negatif kontrol:** `lastmod` **21:21:59Z → 22:24:41Z**. Pozitif — `/`'de `minmax(0,0.58fr)` **2** (HEAD kaynağında `0.58fr` **0 kez** geçiyor). Negatif-değişim — `md:grid-cols-2 lg:grid-cols-3` **1 → 0** (bölümün tek işaretiydi). Değişmemesi gerekenler — `/`'de `lg:grid-cols-5` **2**, `salon-genis-wide` **10**, `sm:whitespace-nowrap` **17**; `/demo`'da `peer-checked` **3** ve `>Demo<` **2**.
- **MOBİL KAPI — `mobile-audit.mjs` 3100'e karşı, 2 genişlik × 16 rota, 55 sn:** `TOPLAM SORUN` **0 → 0**, çıkış **0 → 0**, **✓ KAPI YEŞİL** (kendi taban koşumum da alındı: değişiklikten önce aynı betik aynı hedefte 0/çıkış 0). Kırpma **0**, şerit **0**, kritik hedef **305 ölçüldü / 0 eşik altı / 0 benzersiz**, gezinme **333 / 261** (alt bilgi 256 · içerik yolu 4 · gövde 1), kaydırılabilir kap **5**, dokunma hedefi **638**, yatay kaydırma **yok**.
- **KAPSAM TABANLARI — hiçbiri değişmedi, hiçbiri elle oynatılmadı:** metin elemanı **2054 → 2054** (taban 2054; bölümün kendi metin elemanı da **45 → 45**) · kritik hedef **305 → 305** · kaydırılabilir kap **5 → 5** · gradyan **19 → 19** · görünür başlık **316 → 316** (bölümde `h3` **10 → 10**) · gezilen rota 16.
- **Tek oynayan sayı taban değil, toplam eleman: 6337 → 6253 (−84) ve TAM HESAPLI.** `/` sayfasında bölümün eleman sayısı **188 → 102 (−86)**; ayrışımı: **−18 yapısal düğüm** (ızgara kabı 1 ↔ pano+2 sıra kabı 3; kart başına `Reveal` sarmalayıcısı + parıltı `span`'i + `relative div` + `IconBox span` = 4 × 5 = 20 düğüm düştü) ve **−68 svg düğümü** (5 modül ikonu: calendar-days 11 + users 5 + wallet 3 + building-2 6 + leaf 3 = **28**, artı 20 `Check` × 2 = **40**). Kapının sayacı ile aradaki **2** düğümlük fark da ölçüldü: `calendar-days`'in iki dikey `path`'i (`M8 2v4`, `M16 2v4`) **genişliği 0** olduğu için kapının `geom` sayacına hiç girmiyordu.
- **KALIP ÖLÇÜMÜ — "reddedilen kalıptan çıktı mı" (3100, T18'in üç ayağı, aynı tanım):** öne çıkanlar tarafında **ızgara kabı 1 → 0** · **ikon karosu 5 × 44×44 → 0** · **kalem kutusu benzersiz ölçü @1440 2 → 3** (631×262,5 · 457×262,5 · 362,7×287,9; @390 3 → 4, @320 4 → 5). Bölümde kalan **1 ızgara kabı (5 çocuk / 5 sütun)** ve **5 × 36×36 karo** kapsam dışı şeride aittir ve bilinçle duruyor. Bölümdeki svg **31 → 6** (kalan 5 şerit ikonu + 1 ok).
- **TIRTIKLI SATIR KALMADI (@1440):** üst sıra **631 + 457 = 1088**, alt sıra **3 × 362,7 = 1088** — kabın genişliği 1088.
- **ÇAKIŞMA (kapı hedeflerin üst üste binmesini görmez — T17'nin bulgusu):** 2 genişlik × 16 rota, yapışkan/sabit katman hariç, ata-torun çiftleri elenerek — **önce 1164 hedef / 0 çakışma, sonra 1164 / 0**. Bölüm hiç dokunma hedefi eklemiyor/çıkarmıyor (`a` **1 → 1**, `button` **0 → 0**).
- **KONTRAST — elle, kapının kendi piksel kütüphanesiyle, 320/390/1440** (a11y yalnız 1440'ta koşar; omurga hücresinin zemini `#fff` → `#f7f8f4` değiştiği için dar genişlikler ayrıca ölçüldü): **her genişlikte 45 kalem, 0 eşik altı.** Omurga hücresi: gövde **p02 6,61** · madde **6,61** · başlık **16,48** (beyaz zemindeki eşleri 7,05 ve 17,57; gerekenler 4,5 ve 1440'ta başlık için 3). Gradyan başlık **3,65** (gereken 3). @1440'ta "ölçülemeyen 1" satırı çıktı ve kimliği bulundu: **başka bir bölümdeki 14 px'lik "Grup Dersleri"** — metin eşleşmeli süzgecimin yakaladığı yabancı kalem, bölümün kendi kalemi değil.
- **GÖRÜNÜŞ — ne DEĞİŞMEDİ:** `#moduller`'in **top** konumu üç genişlikte de **birebir** (6100,1 / 5805,7 / 3408,6) ve **üst şerit karesi 320/390/1440'ta 0 farklı piksel** (288.000 · 351.000 · 1.296.000 piksel) — üstündeki hiçbir şey oynamadı. **Sayfa boyu farkı = bölüm boyu farkı** (−557 ↔ −557,0 · −531 ↔ −531,0 · −205 ↔ −205,9), yani başka hiçbir bölümün yüksekliği değişmedi; `#fayda` yüksekliği üç genişlikte de **birebir aynı** (1849,4 / 1702,8 / 1353,8) ve top'u tam delta kadar kaydı → aradaki `ProductStory` de birebir. Alt şeridin piksel farkının **konumsal** olduğu telafi kontrolüyle ölçüldü (yukarıda, Sorunlar).
- **GÖRÜNÜŞ — ne DEĞİŞTİ (bilinçli):** `#moduller` @320 **3181,3 → 2624,3 (−557)** · @390 **2811,6 → 2280,6 (−531)** · @1440 **1388,3 → 1182,4 (−206)**. `/` sayfa boyu @320 **28.619 → 28.062** · @390 **26.403 → 25.872** · @1440 **15.610 → 15.405**. Bu turda **her genişlikte kısaldı** (T18 masaüstünde 447 px uzatmıştı; ikisinin toplamı masaüstünde hâlâ +241 px).
- **Regresyon:** `a11y.mjs` **6 sorun / çıkış 1** (tabana eşit; hepsi `/gecis`, `/`'de kontrast ihlali 0 ve başlık atlaması 0) — 16 rota / **105** ekran adımı (106 → 105: `/` masaüstünde 206 px kısaldığı için bir adım azaldı, T18'in tersi) / **1834** eleman (birebir) / gradyan **19** / başlık **316**. `font-guard` çıkış **0**, **85.129** karakter (birebir — yeni metin yazılmadı, yeni karakter de yok). `perf` `/` masaüstü **141 KB / LCP 96 ms / CLS 0,005**, mobil **132 KB / LCP 60 ms / CLS 0** (birebir); DOM 1492 / 1489. `scan` `/` @320 · @390 · @1440 **üçü de konsol temiz**. `npm test` **219 geçti + 2 atlandı**. `tsc --noEmit` **0**. `lint` **30** (25 hata + 5 uyarı, birebir), `Modules.tsx` **0 kalem**.

---

**Oluşturulma:** 2026-09-23
