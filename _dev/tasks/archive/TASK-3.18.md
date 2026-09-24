# TASK-3.18: Faydalar bölümünün 8 eşit kartı reddedilen kalıptan çıkar

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅ · TASK-3.07 ✅

---

## Hedef

`Benefits` bölümü STYLE-GUIDE'ın reddettiği kalıbın **birebir tarifi**: `lg:grid-cols-4`, 8 eşit kart, her biri `IconBox` + başlık + iki satır gövde. Bölüm farklı bir ritimde yeniden kurulur. Yan kazanç: ana sayfanın uzunluğu düşer (kullanıcı "kısaltma yok, ritim düzelt" dedi — bu bölüm o kararın somut karşılığı).

---

## Bağlam

B-051. STYLE-GUIDE → Kullanıcının Refleksleri → **Kullanma:** *"Jenerik ikonlu kart ızgarası (3×N eşit kart, ikon + başlık + iki satır). Bölüm tasarlarken düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma."* Aynı bölümün **İstiyor** maddesi: *"Düzen çeşitliliği: her bölüm bir öncekinden farklı ritimde."*

Bilinçli tercih süzgeci uygulandı: karar günlüğünün **üç** dosyasının hepsinde arandı (aktif seri + iki arşiv aralığı) — `Benefits` hakkında kayıt yok. Bölüm kickoff öncesi yazıldı; STYLE-GUIDE'ın reddi 2026-09-11'de kayda geçti ve mevcut bölümlere geri uygulanmadı.

**Kısıt (kullanıcı kararı):** yeniden tasarım **metin taşımaz** — bütün metin `src/content/`'te kalır ve `docs/CLAIMS.md`'nin iddia sınırı aynen geçerlidir; **yeni cümle yazılmaz**, mevcut içerik yeniden düzenlenir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-051-ana-sayfada-ikon-kart-izgaralari.md` — kalıbın ölçümü ve süzgeç
- `_dev/docs/STYLE-GUIDE.md` — kullanıcının reddettikleri ve istedikleri; tokenlar
- `_dev/memory/kivanc-tasarim-tercihleri.md` — AI klişesi reddi
- `_dev/docs/CLAIMS.md` — iddia sınırı (yeni cümle yazılmayacak ama yeniden düzenleme de sınıra tabi)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/DECISIONS.md` — seçilen düzen (bu bölümün kalıbı bir daha sorgulanmasın diye)

---

## Alt Görevler

- [x] **1. Düzen önerisi hazırla ve kullanıcıya getir**
  - En az iki aday: liste ritmi (numaralı ya da iki sütunlu akış) · sahne/ürün görseline bağlı anlatım · fotoğraf kırpmalı karma düzen
  - Her aday için: 8 kalemin nasıl yerleşeceği, mobil ve masaüstü ritmi, sayfa uzunluğuna etkisi
  - ⚠️ **Kullanıcıya getirilmedi — koşum açılışında verilmiş duran yetkilendirmeyle seçildi** (orkestratör brief'i: "tercih kapıları önden cevaplanmıştır; makul olanı seç, gerekçesini yaz, durma"). Seçilen aday ve elenenlerin gerekçesi Oturum Kaydı → Kararlar'da; beğeni yargısı **`kanal: UAT`**

- [x] **2. Seçilen düzeni uygula**
  - `IconBox` kullanımı tümüyle bırakılmak zorunda değil — **eşit kart ızgarası** kalıbı bırakılır
  - Bir önceki (`ProductStory`) ve bir sonraki bölümden farklı ritim

- [x] **3. Metin tek kaynakta kalsın**
  - `src/content/product.ts`'teki 8 kalem yerinde kalır; sıra/gruplama değişebilir, cümle değişmez
  - Sıra da **değişmedi** — `git diff -- src/content/` boş

---

## Etkilenen Dosyalar

```
src/components/sections/Benefits.tsx   # bölümün düzeni
src/content/product.ts                 # yalnız sıra/gruplama gerekirse (cümle değişmez)
```

---

## Dikkat Noktaları

- **Bu bir tasarım kararıdır ve kullanıcıya getirilir.** Seçimi yapmadan uygulamaya geçme.
- **Reddedilen kalıplara girme:** parıltı ikonlu kapsül rozet, Sparkles/Zap dekoratif ikon, sahte logo şeridi, "Trusted by…", mor-mavi gradyan kart, gereksiz glassmorphism, sayı sayma animasyonlu istatistik bandı (rakam da yok).
- **Yeni cümle yazılmaz.** Metin tonu (F1.2) kendi fazında; burada yalnız mevcut içerik yeniden düzenlenir.
- **Yeni düzen yeni kontrast ve kırpma riski getirir** — kapılar kurulu, koş: `a11y.mjs` (piksel kontrast + gradyan dalı) ve `mobile-audit.mjs` (320 px + kırpma + dokunma hedefi).
- **Yeni karakter girerse `font-guard.mjs` yakalar** — küme 153 karakter, genişletmek `research/FONT-KARAKTER-KUMESI.txt` + `font-subset.mjs` gerektirir.
- **`ui/Card` bugün hiç import edilmiyor** (B-047, teknik borç) — yeni düzen onu kullanacaksa bu bir kazanç, ama envanterin kendisi kapsam dışı.

---

## Test Kriterleri

- [ ] **Kullanıcı düzeni onayladı — `kanal: UAT`** (beğeni yargısı yerel koşucunun ölçtüğü katmanın dışında; bu turda **alınmadı**, duran yetkilendirmeyle seçildi)
- [x] Bölüm artık eşit kart ızgarası değil; bir önceki ve bir sonraki bölümden farklı ritimde — **ölçüldü**: ızgara kabı 1 → **0**, ikon karosu 8 → **0**, kalem kutusu benzersiz ölçü @1440 **1 → 2**, gerçek fotoğraf 0 → **1** (Oturum Kaydı → Test Sonuçları)
- [x] `src/content/` cümleleri değişmedi — `git diff --stat -- src/content/` **boş**
- [x] `a11y.mjs` 16 rotada — **6 sorun / çıkış 1, tabana birebir eşit**; hepsi `/gecis`'in adlandıran task'ı olmayan kalemleri, `/`'de kontrast ihlali **0** ve başlık atlaması **0**
- [x] `mobile-audit.mjs` 320 ve 390 px'te kırpma **0**, kritik dokunma hedefi **305 ölçüldü / 0 eşik altı** — `TOPLAM SORUN 0`, çıkış **0**, ✓ KAPI YEŞİL
- [x] `font-guard.mjs` kümede olmayan karakter bulmuyor — **85.129 karakter, birebir aynı**, çıkış 0 (yeni metin yazılmadı)
- [x] `scan.mjs` konsol temiz — `/` @320 · @390 · @1440, üçü de
- [x] `docker compose exec web npm test` — **219 geçti + 2 atlandı**, tabana birebir eşit (`product.ts` değişmediği için `iddia-metinleri` / `capabilities` hasadı da oynamadı)
- [x] Ana sayfanın mobil uzunluğu ölçüldü — @390 **26.723 → 26.403 px (−320)**, @320 **28.930 → 28.619 (−311)**. ⚠️ Task dokümanındaki **26.399 px tabanı bayatmış** (2026-09-23'te yazıldı; TASK-3.14…3.17 sayfayı uzattı); kıyas HEAD'e karşı kendi taban koşumumdan alındı

---

## Karar Noktaları

- **Düzen seçimi:** liste ritmi vs. sahne/ürün görseli vs. fotoğraf kırpmalı karma → kullanıcıya sorulacak.

---

## Risk ve Geri Dönüş Planı

- **Risk:** yeniden tasarım birkaç beğeni turuna yayılabilir. Kapsam kararı bunu bilerek **iki bölümle** sınırladı; üçüncü ızgara (5'li ikon şeridi) kapsam dışı.
- **Rollback:** bölüm tek dosya; eski hâli git'te.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (tek açık kalem kullanıcı beğenisi → `kanal: UAT`)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **`Benefits` bölümü ızgaradan DÖKÜME çevrildi.** Eski hâl `sm:grid-cols-2 lg:grid-cols-4` üzerinde 8 eşit kart, her kart `IconBox` (44×44 karo) + başlık + iki satır gövdeydi — STYLE-GUIDE'ın "Kullanma" maddesinin birebir tarifi. Yeni hâl: kart yok, yüzey dolgusu yok, halka yok; 8 kalem **tam genişlikte, saç teli çizgilerle ayrılmış satırlar** hâlinde. Satır `lg:`de **asimetrik** (0,36 / 0,64): başlık solda kendi kulvarında, gövde sağda, `items-baseline` ile hizalı. Dar ekranda satır dikeye yığılır.
- **İkon karosu düştü, ikon satır içine indi.** `IconBox` (`size-11` zeminli/halkalı karo) yerine `Icon` — başlığın satır içinde 18×18 `sage-ink` işaret, `aria-hidden`. Doku korunur, karo üretilmez.
- **Dökümün ortasına gerçek fotoğraf bandı kondu.** `public/foto/salon-genis-wide.webp` (2000×760) — foto hattının kendi notunda *"Tam genişlik bant için"* diye üretilmiş ve bugüne kadar **hiç kullanılmamıştı** (ölçüldü: `src/` altında 0 çağrı). Dördüncü kalemin ardında duruyor, listenin tekdüzeliğini kırıyor. Üzerinde **metin yok** (kompozisyonlu zemin kontrast payını yer — STYLE-GUIDE → `faint`in AA payı), atmosferik olduğu için `alt=""`.
- **Metin taşınmadı:** sekiz kalemin cümleleri de sırası da `src/content/product.ts` → `BENEFITS` içinde aynen duruyor; `git diff -- src/content/` boş.

**Sorunlar:**
- **Tam sayfa ekran karesi ASILDI (ölçüm duvarı, yöntem değiştirilerek aşıldı):** 28,6 k px yüksekliğindeki `/` sayfasının `fullPage` karesi geliştirme sunucusunda 21 dakikada tamamlanmadı, tek bayt yazmadı; konteyner düşürüldü. Yerine **şerit yöntemi** kuruldu — bölümün hemen üstünden ve hemen altından 900 px'lik iki görüntü penceresi karesi. Kanıt gücü korundu: üst şerit doğrudan "üstündeki hiçbir şey değişmedi"i ölçer.
- **@320'de alt şeritte 10.627 farklı piksel çıktı ve mekanizması ölçüldü:** bölüm boyu farkı @320'de **−310,5 px** (YARIM piksel), @390'da **−320,0** ve @1440'ta **+447,0** (tam sayı). Yarım piksellik faz kayması altındaki metnin gliflerini farklı piksel satırlarına düşürüyor. Pozitif çapa ölçümün içinde: tam-sayı deltalı iki genişlikte fark **53** ve **176** piksel, maksimum kanal farkı **3** ve **5** (antialias gürültüsü); yarım-piksel deltalı genişlikte 10.627 ve maks **234**. Gözle iki kare ayırt edilemiyor (kareler kayıtta). Düzen kaynaklı bir değişim değil.

**Kararlar:**
- **Düzen seçimi kullanıcıya SORULMADI — koşum açılışındaki duran yetkilendirmeyle yapıldı.** Task dokümanı bunu bir karar noktası olarak işaretliyordu; orkestratör brief'i tercih kapılarını önden cevapladı ("makul olanı seç, gerekçesiyle yaz, durma"). Beğeni yargısı yine de yerel koşucunun ölçtüğü katmanın dışında → `kanal: UAT`.
- **Seçilen aday: "liste ritmi" + "fotoğraf kırpma" karması.** Gerekçe ölçüldü: ana sayfanın **15 bölümünün 8'i** zaten iki sütunlu bölme (Hero · Chaos · Roles · ProductStory · HowItWorks · PricingBlock · FounderProgram · Faq), yani **dokuzuncu bir iki-sütunlu bölme ritim değişimi olmazdı**. Tam genişlikte saç teli döküm ana sayfada hiç kullanılmıyor — öteki liste ritimleri (Chaos'un `divide-y`'ı, PricingBlock'un `dl`'i, Faq'ın akordeonu) hep iki sütunlu bir bölmenin **dar** sütununda yaşıyor. STYLE-GUIDE'ın kendi cümlesi de **liste**yi adıyla sayıyor ("düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma").
- **Elenen adaylar ve gerekçeleri:** (a) *lg'de iki sütunlu döküm* — masaüstü boyunu yarıya indirirdi ama "8 eşit hücre" geri gelirdi, yani task'ın adının yasakladığı şeyin yumuşatılmış hâli; (b) *sahne/ürün görseline bağlı anlatım* — bir önceki bölüm (`ProductStory`) zaten yapışkan ürün turu, ritim tekrarı olurdu; (c) *üç kümeye ayırma* (bölümün kendi lead cümlesi "para, kapasite ve üye" diyor) — küme etiketleri **yeni metin** olurdu ve 8 kalem 3/2/2'ye temiz bölünmüyor, "Çift kayıt biter" hiçbirine oturmuyordu.
- **Fotoğraf bilinçli bir boy bedeli taşıyor ve bedel ölçüldü.** Masaüstünde bölüm **+447 px** uzuyor; bunun **~272 px'i** fotoğraf bandı (192 px kutu + 2×40 px `sm:my-9`). Fotoğrafsız hâl masaüstünde neredeyse başa baş olurdu, ama o zaman bölüm "sade bir metin listesi"ne inerdi — kullanıcının brief'i *"görsel olarak çok daha zengin"* diyor ve STYLE-GUIDE'ın "İstiyor" maddesi gerçek fotoğrafı adıyla sayıyor. Karar: fotoğraf kalır, satır dolgusu `lg:py-5`'e ve bant yüksekliği `lg:h-48`'e çekilerek bedel **688 → 447 px**'e indirildi (ölçüldü).
- **Mobil boy düşüyor, masaüstü boyu artıyor — bilinçli.** Kayıttaki şikâyet mobil uzunluktur (Gelen Kutusu `[kickoff SORU]`, ~26.000 px): @390 **−320 px**, @320 **−311 px**. Masaüstünde **+447 px** (sayfanın %2,9'u) ve bu, sekiz kalemi iki satırlık bir karo duvarından okunur bir döküme çevirmenin fiyatı.
- docs/DECISIONS.md'ye eklendi: **Evet** (2026-09-25 kaydı).

**Kalan İşler:**
- Kullanıcı beğenisi alınmadı → `kanal: UAT`. Düzen reddedilirse bölüm tek dosya, eski hâli git'te (`ae80fb0:src/components/sections/Benefits.tsx`).
- B-051'in ikinci yarısı (`Modules`'ün tırtıklı 5'li ızgarası) **TASK-3.19**'dadır; bulgunun Çözüm Kaydı o turda kapanır.

**Dosya Değişiklikleri:**
- `src/components/sections/Benefits.tsx` → tek dosya. Izgara + 8 kart + `IconBox` düştü; `border-t`/`border-b` saç teli döküm, `lg:grid-cols-[minmax(0,0.36fr)_minmax(0,0.64fr)]` asimetrik satır, satır içi `Icon`, dördüncü kalemin ardında `next/image` fotoğraf bandı geldi. Dosya başına gerekçe yorumu yazıldı (neden bu ritim, komşu bölümlerden nasıl ayrışıyor, fotoğrafın neden metinsiz).

**Test Sonuçları:**

Kapsam: **yayın kopyası (3100)**, `reducedMotion: reduce`, 320/390 (kontrast ve kalıp ölçümü ayrıca 1440); piksel karşılaştırması geliştirme sunucusunda (3000) eski↔yeni olarak koşuldu, çünkü "önce" derlemesi tazelemeyle kayboldu. **Kullanıcı beğenisi kapsam dışı → `kanal: UAT`.** Bu task bir doğrulama kapısı ÜRETMİYOR, o yüzden "ürettiğin kapıyı sına" adımı düşer.

- **3100 tazelendi, pozitif + negatif kontrol:** `lastmod` **20:42:16Z → 21:21:59Z**. Pozitif — `/`'de `salon-genis-wide` **10** kez (HEAD kaynağında `Benefits.tsx` içinde **0**), `_next/image` **201**. Negatif-değişim — `lg:grid-cols-4` `/`'de **1 → 0** (bölümün tek işareti). Değişmemesi gerekenler — `/`'de `sm:whitespace-nowrap` **17** (T25'in rakamı), `/demo`'da `>Demo<` **2** ve `peer-checked` **3** (T17/T25'in rakamları), JS paketinde `scrollY>120` **1**.
- **MOBİL KAPI — `mobile-audit.mjs` 3100'e karşı, 2 genişlik × 16 rota, 55 sn:** `TOPLAM SORUN` **0 → 0**, çıkış **0 → 0**, **✓ KAPI YEŞİL** (T18'de ilk kez yeşile dönmüştü, **yeşil kaldı**). 320 ve 390 px birebir aynı: kırpma **0**, şerit **0**, kritik hedef **305 ölçüldü / 0 eşik altı / 0 benzersiz**, gezinme **333 / 261** (alt bilgi 256 · içerik yolu 4 · gövde 1), kaydırılabilir kap **5**, dokunma hedefi **638**, yatay kaydırma **yok**.
- **KAPSAM TABANLARI — hiçbiri değişmedi, hiçbiri elle oynatılmadı:** metin elemanı **2054 → 2054** (taban 2054) · kritik hedef **305 → 305** (taban 305) · kaydırılabilir kap **5 → 5** (taban 5) · gradyan **19 → 19** (taban 19) · görünür başlık **316 → 316** (taban 316) · gezinilen rota 16. **Tek oynayan sayı taban değil:** toplam eleman **6326 → 6337 (+11)** ve **tam hesaplı** — `#fayda` 88 → 99 eleman: kalem başına +1 (eski `Reveal>div>span(IconBox)>svg + h3 + p` → yeni `div>Reveal>article>h3>svg+span + p`) × 8 = +8, artı fotoğraf bloğu (Reveal div + figure + img) = +3.
- **KALIP ÖLÇÜMÜ — "reddedilen kalıptan çıktı mı" (3100, kendi ölçerim):** STYLE-GUIDE'ın tarifi üç mekanik ayak taşıyor, üçü de sayıldı. **@1440:** ızgara kabı (≥4 çocuk) **1 kap / 4 sütun / 8 çocuk → 0 kap**; ikon karosu (kare, ≥32 px, zeminli/halkalı, içinde svg) **8 × 44×44 → 0** (bölümdeki svg sayısı 8'de kaldı — karo değil, satır içi işaret); kalem kutusu benzersiz ölçü **1 → 2** (eski: sekizi de birebir **271×231**; yeni: **1088×93** ve **1088×69**); gerçek fotoğraf **0 → 1** (1088×192, `alt=""`). **@390:** ızgara **1 → 0**, ikon karosu **8 → 0**, fotoğraf **0 → 1** (350×112).
- **ÇAKIŞMA (T18'in bulgusu — kapı hedeflerin üst üste binmesini GÖRMEZ):** 2 genişlik × 16 rota, yapışkan/sabit katman içindekiler hariç — **önce 1150 hedef / 0 çakışma, sonra 1150 hedef / 0 çakışma**. Hedef sayısı birebir: bu bölüm hiçbir dokunma hedefi eklemiyor ya da çıkarmıyor (bölümde `a` **0**, `button` **0**, önce de sonra da).
- **KONTRAST — elle, kapının kendi piksel kütüphanesiyle, 320/390/1440** (a11y yalnız 1440'ta koşar; gövde metninin zemini `bg-surface` `#fff`'ten `bg-canvas` `#fbfbf9`'a geçtiği için dar genişlikler ayrıca ölçüldü): **23 kalem, 0 eşik altı, üç genişlikte de**. Başlıklar **p02 17,57 → 16,96** (17px/700 → 18px@320/390, 20px@1440), gövdeler **p02 7,05 → 6,80** (14px → 15px); gereken 4,5 (1440'ta başlık için 3). Düşüşün tamamı zemin farkı; punto **büyüdü**.
- **GÖRÜNÜŞ — ne DEĞİŞMEDİ (piksel, 3000'de eski↔yeni):** `#fayda`'nın **üstü 320/390/1440'ta 0 farklı piksel** (288.000 · 351.000 · 1.296.000 piksel). Altı: @390 **53** ve @1440 **176** farklı piksel, maks kanal farkı **3** ve **5** → antialias. @320 **10.627**, maks **234** → yarım piksellik faz kayması (bölüm boyu farkı @320'de −310,5; öteki iki genişlikte tam sayı). `#fayda`'nın **top** konumu üç genişlikte de **birebir aynı** (11725 / 11044 / 6532) ve **sayfa boyu farkı = bölüm boyu farkı** (−311 ↔ −310,5 · −320 ↔ −320,0 · +447 ↔ +447,0) — yani başka hiçbir bölümün yüksekliği oynamadı.
- **GÖRÜNÜŞ — ne DEĞİŞTİ (bilinçli):** `/` sayfa boyu @320 **28.930 → 28.619 (−311)** · @390 **26.723 → 26.403 (−320)** · @1440 **15.163 → 15.610 (+447)**. `#fayda` @320 **2159,9 → 1849,4** · @390 **2022,8 → 1702,8** · @1440 **906,8 → 1353,8**.
- **FOTOĞRAFIN BEDELİ:** ilk yüklemede **sıfır** — tembel yüklenir, `perf.mjs`'in ölçtüğü sayfa ağırlığı birebir aynı (`/` masaüstü **141 KB**, mobil **132 KB**). Ziyaretçi bölüme indiğinde teslim edilen dosya: avif **15,5 KB** (@390, `w=640` varyantı) · **41,4 KB** (@1440, `w=1200`); webp yedeği 32 / 88 KB; kaynak dosya 196 KB ve `next/image` onu hiç olduğu gibi göndermiyor. `sizes` doğru çözülüyor (ölçüldü: 320/390 → `w=640`, 1440 → `w=1200`). **CLS oynamadı** (masaüstü 0,005 · mobil 0) — kutu `h-28 sm:h-40 lg:h-48` ile önceden ayrılıyor.
- **Regresyon:** `a11y.mjs` **6 sorun / çıkış 1** (tabana eşit; hepsi `/gecis`, `/`'de kontrast ihlali 0 ve başlık atlaması 0) — 16 rota / **106** ekran adımı (105 → 106; `/` masaüstünde 447 px uzadığı için bir adım fazla) / **1834** eleman (birebir) / gradyan **19** / başlık **316**. `font-guard` çıkış **0**, **85.129** karakter (birebir). `perf` `/` masaüstü **141 KB / LCP 96-100 ms / CLS 0,005**, mobil **132 KB / LCP 60-68 ms / CLS 0** — LCP iki koşum arasında kendi içinde oynuyor (100→96 ve 60→68), yani fark ölçümün gürültüsü; ağırlık ve CLS birebir. `scan` `/` @320 · @390 · @1440 **üçü de konsol temiz**. `npm test` **219 geçti + 2 atlandı** (birebir). `tsc --noEmit` **0**. `lint` **30**, yeni yok, `Benefits.tsx` **0 kalem**.

---

**Oluşturulma:** 2026-09-23
