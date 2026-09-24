# DECISIONS — Karar Günlüğü

**Amaç:** Önemli mimari ve tasarım kararlarının kaydı. "Neden X yerine Y tercih edildi?" sorusunun cevabı burada.
**Ne zaman güncellenir:** Önemli bir teknik, mimari veya tasarım kararı alındığında.

> İddia sınırı (ne söylenir, ne söylenmez) burada değil → `CLAIMS.md`. Tasarım kuralları → `STYLE-GUIDE.md`. Buradaki kayıtlar onların **üzerine** gelen tercihlerdir.

<!-- KURAL: Bu günlük append-only'dir — yazılmış bir karar silinmez, düzeltilmez. Geçersizleşen karar YENİ bir kararla geçersiz kılınır. -->

**Kapanan aralıklar (arşiv):**

- [`DECISIONS-2026-09-10..2026-09-13.md`](DECISIONS-2026-09-10..2026-09-13.md) — kuruluş dönemi, 22 kayıt: dil (yalnız Türkçe), fiyat sunumu, fotoğraf ve görsel ton, chatbot sırası, modül yapısı, rakip adsızlığı, faz sırası, Vercel ortam modeli, analitik (Umami), lead hedefinin ilk iki tur kararı, Vitest, alıcı provası, e-posta kaynağı.
- [`DECISIONS-2026-09-14..2026-09-22.md`](DECISIONS-2026-09-14..2026-09-22.md) — Faz 1'in kapanışı ve Faz 2'nin kuruluşu, 12 kayıt: lead hedefinin son tur kararı ve depo sözleşmesinin sınanması, Umami site kaydı, bildirim durumu (`notify_*`) ve onay e-postasıyla gelen geçersiz kılma, anahtar kasası, analitik olay adları, `.env` sızıntısının ölçülen kapsamı ve döndürmenin düşmesi, ölçüm sunucusunun ham IP gerçeği, yetenek iddialarının tek listeden türemesi.

<!-- KURAL: Doküman kırmızı çizgiyi (~20k token) aştığında EN ESKİ kapanan aralık `DECISIONS-<ilk>..<son>.md`'ye taşınır ve buraya tek satırlık pointer düşer; kayıt, sıra ve anlam korunur (içerik-koruyan bölme). Giriş noktası HER ZAMAN bu dosyadır — kararı arayan adım (review-phase'in `Superseded` araması, audit-product'ın bilinçli-tercih süzgeci) buradan çocuğa izler. Kanon: CLAUDE.md → Boyut ve Bölünme. -->

---

## Kararlar

<!-- Her yeni karar aşağıdaki formatta en üste eklenir (en yeni en üstte) -->

### 2026-09-25 — `Benefits` bölümünün ritmi "döküm"dür: tam genişlikte saç teli satırlar + ortada tek gerçek fotoğraf; ızgara ve ikon karosu geri gelmez

**Bağlam:** B-051, ana sayfada kullanıcının reddettiği kalıbın üç kez tekrarlandığını ölçmüştü. `Benefits` tarifin birebir örneğiydi: `lg:grid-cols-4` üzerinde 8 eşit kart, her kart `IconBox` karosu + başlık + iki satır gövde. STYLE-GUIDE → Kullanıcının Refleksleri → Kullanma: *"Jenerik ikonlu kart ızgarası (3×N eşit kart, ikon + başlık + iki satır). Bölüm tasarlarken düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma."* Bölüm kickoff'tan önce yazılmıştı; refleks 2026-09-11'de kayda geçti ve mevcut bölümlere geri uygulanmadı.

**Karar:**
- **Bölümün ritmi DÖKÜMDÜR.** Kart yok, yüzey dolgusu yok, halka yok: sekiz kalem tam genişlikte, saç teli çizgilerle ayrılmış satırlar hâlinde durur. Satır geniş ekranda asimetriktir (**0,36 / 0,64** — başlık solda kendi kulvarında, gövde sağda, `items-baseline`), dar ekranda dikeye yığılır.
- **İkon karosu geri gelmez.** İkon, başlığın satır içinde 18×18 `sage-ink` bir işarettir ve `aria-hidden` taşır. `IconBox` bu bölümde kullanılmaz.
- **Bölümün ortasında tek bir gerçek fotoğraf bandı durur** (dördüncü kalemin ardında) ve **üzerine metin yazılmaz**. Bant kompozisyonlu bir zemindir; STYLE-GUIDE'ın `faint` kuralı böyle zeminlerde kontrast payının yendiğini ölçmüştür, o yüzden bant sessiz bırakılır. Bilgi taşımadığı için `alt=""`.
- **Metin bu bölümün işi değildir.** Sekiz kalemin cümlesi ve sırası `src/content/product.ts` → `BENEFITS`'tedir; düzen değişimi cümleye de sıraya da dokunmaz.

**Gerekçe:**
- **"İki sütunlu bölme" bu sayfada ritim değişimi DEĞİLDİR — sayıldı:** ana sayfanın 15 bölümünün **8'i** zaten iki sütunlu bölme (Hero · Chaos · Roles · ProductStory · HowItWorks · PricingBlock · FounderProgram · Faq). Dokuzuncusunu eklemek kalıbı kırmaz. Tam genişlikte saç teli döküm sayfada hiç kullanılmıyor; öteki liste ritimleri (Chaos'un `divide-y` listesi, PricingBlock'un `dl`'i, Faq'ın akordeonu) hep bir bölmenin **dar** sütununda yaşıyor. Refleks listesinin kendisi de **liste**yi adıyla meşru alternatif sayıyor.
- **"lg'de iki sütunlu döküm" reddedildi:** masaüstü boyunu yarıya indirirdi ama "8 eşit hücre"yi geri getirirdi — yasaklanan şeyin yumuşatılmış hâli.
- **"Sahne / ürün görseline bağlı anlatım" reddedildi:** bir önceki bölüm (`ProductStory`) zaten yapışkan ürün turudur; aynı ritmi ard arda iki kez kullanmak "her bölüm bir öncekinden farklı ritimde" maddesini bozardı.
- **"Üç kümeye ayırma" reddedildi** (bölümün kendi lead cümlesi *"para, kapasite ve üye"* diyor): küme etiketleri **yeni metin** olurdu ve sekiz kalem 3/2/2'ye temiz bölünmüyordu — "Çift kayıt biter" hiçbir kümeye oturmuyor.
- **Fotoğraf bilinçli bir boy bedeli taşır ve bedeli ölçüldü.** Masaüstünde bölüm +447 px uzuyor, bunun ~272 px'i banttır. Fotoğrafsız hâl masaüstünde başa baş olurdu ama bölüm sade bir metin listesine inerdi; kullanıcının brief'i *"görsel olarak çok daha zengin"* ve refleks listesinin "İstiyor" maddesi gerçek fotoğrafı adıyla sayıyor. Kullanılan dosya (`salon-genis-wide.webp`, 2000×760) foto hattının kendi notunda *"Tam genişlik bant için"* diye üretilmiş ve bugüne kadar hiç çağrılmamıştı.
- **Mobil boy düşer, masaüstü boyu artar — bilinçli.** Kayıttaki şikâyet mobil uzunluktur: @390 **−320 px**, @320 **−311 px**; masaüstünde **+447 px** (sayfanın %2,9'u).
- **Ölçüldü ki kalıptan gerçekten çıkıldı** (3100, kalıbın üç mekanik ayağı ayrı ayrı sayıldı): ızgara kabı **1 → 0**, ikon karosu **8 × 44×44 → 0**, kalem kutusu benzersiz ölçü @1440 **1 → 2** (eskiden sekizi de birebir 271×231), gerçek fotoğraf **0 → 1**. Beş kapı da tabanda kaldı: mobil kapı **0 / çıkış 0 (yeşil)**, a11y **6 / çıkış 1** (tabana eşit), font-guard **85.129 karakter / çıkış 0**, perf `/` **141 KB masaüstü · 132 KB mobil** (fotoğraf tembel), `npm test` **219 + 2**. Hiçbir kapsam tabanı oynamadı.

**Etki:** `src/components/sections/Benefits.tsx` (tek dosya). `src/content/product.ts`'e **dokunulmadı**. B-051'in ikinci yarısı (`Modules`'ün tırtıklı 5'li ızgarası) TASK-3.19'dadır ve bu kararın kapsamı dışındadır. **Kullanıcı beğenisi alınmadı** (koşumun duran yetkilendirmesiyle seçildi) → `kanal: UAT`; düzen reddedilirse eski hâl `ae80fb0`'da.

### 2026-09-24 — Gradyanla boyanmış metin muafiyet kovası değil, ölçülen bir daldır; yargı değeri gradyanın en açık durağıdır

**Bağlam:** Bir gün önceki ölçüm sözleşmesi (aşağıdaki kayıt) `gradyan metin`i **"adı konmuş, sahibi belli bir muafiyet kovası"** olarak sabitlemişti: raporlanır, kapıyı düşürmez. İcra sırasında (TASK-3.05) bu fıkra düştü. Sebep teknik: `background-clip: text` ile boyanan metnin glif dolgusu **zaten** şeffaf olduğu için TASK-3.04'ün gizleme kuralı onu hiç değiştirmiyor — iki kare birebir aynı çıkıyor ve glif maskesi boş kalıyor. Ama boyayan şey metnin rengi değil, elemanın **gliflere kırpılmış arka planı**: o kaldırılınca maske doğuyor ve sınıf ölçülebilir hâle geliyor.

**Karar:**
- **Gradyan metin ölçülür ve eşik altındaysa kapıyı düşürür.** `ÖLÇÜLEMEYEN` satırı beş kovadan **dörde** iner (`yapışkan borcu` · `görünmez` · `ekran dışı` · `kalan`); gradyan metin ayrı bir satırda `N ölçüldü · M eşik altı` olarak raporlanır ve ihlalleri `[gradyan]` işaretiyle **aynı** `TOPLAM SORUN` sayısına girer. Ayrı bir çıkış yolu açılmaz: aynı WCAG kuralı, aynı eşik, yalnız rengin kaynağı farklı.
- **Yargı değeri gradyanın kaynağındaki EN AÇIK DURAKTIR** — boyanan pikselin kendisi değil. Zemin yine glif maskesinin altındaki gerçek pikselden okunur, ata opaklık çarpımı durak alfasıyla birlikte uygulanır.
- **Sınıfın ölçütü `background-clip: text`tir, şeffaf metin rengi değil.** Clip'siz şeffaf metin `görünmez` kovasına gider.
- **Dalın kendi kapsam tabanı vardır** (`BEKLENEN_GRADYAN`, bugün 19; `BEKLENEN_ROTA` ile aynı sözleşme — taban, üst sınır değil). Durağı okunamayan bir gradyan `kalan` kovasına düşer, yani kapıyı düşürür ve eleman adıyla basılır.

**Gerekçe:**
- **"En açık durak" bilinçli olarak katı ölçüttür ve bu bir karardır, betik ayarı değil** (PHASE-3 → Teknik Kararlar bunu yöntem olarak seçmişti; burada sabitleniyor). Gradyan boyunca metnin bir kısmı daha koyu boyanır, ama okunabilirliği **en kötü nokta** belirler. Ölçüm devralınan rakamları birebir yeniden üretti: `sage-br` canvas üstünde **1,74:1**, canvas-soft üstünde **1,64:1** (B-032 kalem 3'ün kayıtlı değerleri).
- **Muafiyet olarak bırakmak, düzeltmeyi görünmez kılardı.** TASK-3.11 durakları koyulaştırdığında kapı hiçbir şey söylemezdi — ne kırmızıydı ne yeşile dönerdi. Ölçülen bir dal, düzeltmenin kendi kanıtını üretir.
- **Üçüncü bir ekran görüntüsü alınmadı; ikinci karenin kuralı genişletildi.** Alternatif (gradyan kalemler için ayrı bir kare çifti) reddedildi: adım başına %50 daha fazla kare demekti. Bedeli, gizleme kuralının artık iki iş yapması — ölçümle kapatıldı: dal açıldıktan sonra ölçülen eleman (**1835**), ekran adımı (**105**), süre (**66 sn**) ve kontrast ihlali (**39**) sayılarının hepsi TASK-3.04 tabanından **sapmadı**.
- **Kapsam tabanı olmadan dal fail-open'dı.** Kümesini bir taramadan türeten her dedektör, seçici körleştiğinde "0 buldum" deyip yeşil kalır. Sonda ile ölçüldü: hiç gradyan metin içermeyen bir hedefte kapı **TOPLAM SORUN 0 olduğu hâlde** çıkış kodu 1 veriyor.

**Etki:** `research/lib/piksel-kontrast.mjs` + `research/scripts/a11y.mjs`. Aşağıdaki 2026-09-24 kaydının **"gradyan metin adı konmuş bir muafiyettir — raporlanır, düşürmez"** fıkrası bu kararla geçersiz kılındı; o kaydın diğer hükümleri (yargı değeri `p02`, `kalan`ın kırmızıya döndürmesi, iki geçerlilik koşulu) aynen yürürlükte.

---

### 2026-09-24 — Piksel kontrast ölçümünün okunma sözleşmesi: yargı değeri `p02`, ölçülemeyenin üç kovası, ve iki geçerlilik koşulu

**Bağlam:** Bir gün önceki karar yöntemi seçmişti (piksel ölçümü, fg CSS'ten, yayın kopyası, hareket azaltma). İcra sırasında (TASK-3.04) yöntemin **okunmasına** dair üç şey daha sabitlenmek zorunda kaldı: her eleman artık tek bir sayı değil bir **dağılım** üretiyor (bir metnin binlerce glif pikseli var ve her birinin zemini farklı olabilir), "ölçülemedi" tek bir çöp kutusu olmaktan çıkıp sahibi belli kovalara ayrılıyor, ve ölçümün kendisi iki sessiz zamanlama yarışına açık çıktı. Üçü de **biriken verinin yorumunu** belirliyor: bundan sonra kayda geçen her kontrast rakamı bu sözleşmeye göre okunacak.

**Karar:**
- **Yargı değeri `p02`'dir** (en kötü %2 piksel), `min` ya da `med` değil. Her ihlal satırında üçü birlikte basılır.
- **Ölçülemeyen beş kovaya ayrılır ve yalnız biri kapıyı düşürür.** `yapışkan borcu` (B-063) ve `gradyan metin` (TASK-3.05) adı konmuş, sahibi belli muafiyetlerdir — raporlanır, düşürmez. `görünmez` (ekran okuyucuya özel metin, etkin opaklığı sıfıra yakın) ve `ekran dışı` ölçüm dışıdır. **`kalan`** — ölçülmesi gerekirken tek piksel bile üretmeyen eleman — sıfır olmayan her değerde **kırmızıya döndürür** ve elemanlar adıyla basılır.
- **Ölçümün iki geçerlilik koşulu yazılı hâle geldi:** (a) yumuşak kaydırma ölçüm süresince kapatılır **ve** her adımda kaydırmanın hedefe oturduğu ayrıca ölçülür; (b) her kare, stil değişiminin **boyamaya işlendiği** doğrulandıktan sonra alınır. İkisi de kapının kendi kodundadır ve atlanamaz.

**Gerekçe:**
- **`p02` ölçüldü, seçilmedi.** Desenli zeminde (nokta ızgarası glifin altına denk geldiğinde) `min` tek bir talihsiz pikseli cezalandırır, `med` sorunu tamamen gizler: `Chaos` bölümünün paragrafında üçü sırasıyla **3,95 / 4,06 / 4,63** — yani `med`'e bakan bir kapı bu ihlali hiç görmezdi. B-032 de aynı ölçütü kullanmıştı ve kayıtlı rakamlar ancak `p02` ile birebir yeniden üretilebiliyor.
- **Tek bir "ölçülemedi" sayısı fail-open'dır.** B-031'in en can alıcı kalemi buydu: `<body>`'ye tek bir dekoratif gradyan konduğunda `/fiyat`'ta ölçülen eleman 157 → 0 düşerken kapı "TOPLAM SORUN: 0" diyordu. Sonda ile birebir sınandı: metni opak bir örtünün altına koyan hedefte yeni kapı **kontrast ihlali 0 olduğu hâlde** `kalan 64` deyip çıkış kodu 1 veriyor.
- **İki yarış da ölçülerek bulundu, tahminle değil — ve ikisi de SAHTE KIRMIZI üretiyordu.** (a) `globals.css`'in `html{scroll-behavior:smooth}` kuralı `prefers-reduced-motion: reduce` altında **kapanmıyor** (o blok yalnız animasyon/geçiş süresini sıfırlıyor); DOM ölçümü ile ekran karesi farklı konumda alınınca sayfaların altındaki 25 eleman "ölçülemedi" diye kırmızıya düştü. (b) Glif gizleme stili eklenip kare hemen alındığında yalnız yapışkan başlığın kendi bileşke katmanı yeniden boyanmış çıktı, gövde metni kareye görünür girdi: `/kvkk` adım 1'de kare farkı **1.839 piksel**, komşu adımlarda 69.016. Boyama beklendikten sonra aynı adım **45.742** verdi ve **iki ardışık tam koşum birebir aynı** oldu.
- **Alternatif — "kalan"ı raporlayıp kırmızıya döndürmemek** — reddedildi: o hâlde kapı tam da kör kaldığı yerde sessiz kalır ve kör nokta kimsenin bakmadığı bir sayıya dönüşür. Bedeli kabul edildi: ölçümün kendi arızası da kapıyı kırmızıya çevirir, ama elemanlar adıyla basıldığı için arıza ile gerçek ihlal ayrışıyor.

**Etki:** `research/lib/piksel-kontrast.mjs` (yeni) + `research/scripts/a11y.mjs`. Bundan sonra kaydedilen kontrast rakamları `p02`'dir ve `min`/`med` ile birlikte anlam taşır; `1440×900`, yayın kopyası ve hareket azaltma dışında ölçülen bir rakam bu sözleşmenin dışındadır.

---

### 2026-09-23 — Kontrast ve mobil kapılarının ölçüm sözleşmesi yeniden kuruluyor: piksel ölçümü, yayın kopyası, hareket azaltma, kademeli dokunma hedefi

**Bağlam:** Faz 3'ün araştırması (`phases/PHASE-3.md` → Araştırma Bulguları) iki kapıyı gerçek kapı hâline getirmeden önce ölçüm yönteminin kendisini sınadı. Bugünkü model kontrastı **hesaplanmış stilden** türetiyor (renk + en yakın opak zemin) ve üç şeyi yapısal olarak göremiyor: gradyan/fotoğraf zemini, ata opaklığı, gradyanla boyanmış metin. Devralınan "çalışan uygulama scratchpad'de, devralınabilir" kaydı **ölçülerek çürütüldü** — adı geçen betiklerin hiçbiri yok; yöntem sıfırdan prototiplendi.

**Seçenekler:**
1. **Hesaplanmış stili yamamak** — her kör nokta için ayrı düzeltme. Ucuz; ama gradyan zemin ve `transparent` metin tek renkle temsil edilemediği için "ölçülemeyen" kümesi büyümeye devam eder.
2. **Piksel ölçümü** — iki kare (normal / metni görünmez) farkından glif maskesi; zemin maskenin altındaki gerçek pikselden. Üç kör noktayı tek değişiklikle kapatır.

**Karar:** **2 — ve yanında üç sözleşme değişikliği daha.**
- **Metin rengi CSS'ten okunur, boyanan pikselden değil.** Piksel yalnız **zemini** verir.
- **Kapılar yayın kopyasını ölçer** (üretim konteyneri), bugünkü geliştirme sunucusunu değil.
- **Kontrast ölçümü `prefers-reduced-motion: reduce` altında koşar.**
- **Dokunma hedefi kuralı kademelidir ve mekanik ölçütü yazılıdır:** buton · form alanı · sekme · menü (`header`/`nav`) · `/demo`, `wa.me` ve `tel:` hedefli bağlantılar kırmızıya düşürür; alt bilgi **ve içerik yolu** bağlantıları ölçülür, raporlanır, düşürmez.
- Rota listesi ayakta olan siteden `/sitemap.xml` ile türetilir (+ `/olmayan-sayfa` elle) — araştırma konteyneri depoyu görmediği için `sitemap.ts` import edilemez.

**Gerekçe:**
- **Metin rengini pikselden okumak ölçümü çöpe çeviriyor — ölçüldü.** İlk prototip fg'yi boyanan pikselden aldı ve 100 ölçümün **95'ini** eşik altı gösterdi; okunan şey metin değil antialias kenarıydı. Glif gövdesini erozyonla ayıklamak ince yazıda çalışmıyor (11-15 px gövde metninin inmesi çoğu yerde tek piksel). fg CSS'ten alınınca aynı sayfalarda eşik altı 95 → 1'e düştü ve yöntem kayıtlı rakamları **birebir** yeniden üretti.
- **Hareket azaltma bir eksen tercihi değil, doğruluk koşulu.** Ata opaklık çarpımı uygulanır uygulanmaz `Reveal`'in geçiş ortası opaklıkları (0,459 · 0,618 · 0,666 · 0,711 · 0,818 — hepsi ölçüldü) ihlal gibi okunuyor. Eski modelin "Reveal kapıyı kör etmiyor" gözlemi kendi modeli için doğruydu; kör noktayı kapatmak bu sınıfı açıyor. Aynı koşum `modules/M2-Sayfalar-ve-Bolumler.md` → F2.3'ün bugüne dek hiç ölçülmemiş kriterini de doğruladı.
- **Yayın kopyasını ölçmek ILKELER'in kalıcılık maddesinden geliyor:** geliştirme sunucusunu ölçen bir kapının yeşili, yayınlanan sürüm için kanıt değildir. Bilinçle kabul edilen bedel: her koşumdan önce imaj tazeliği — `build` imajı tazeler ama konteyneri yeniden yaratmaz (`memory/alternatif-env-ile-uretim-derlemesi.md`).
- **Dokunma hedefi ölçütü ILKELER'in 1. ekseninden (Dönüşüm) türedi ve ölçüldü:** alt bilgi ile içerik yolu dışarıda tutulduğunda kritik küme **19 benzersiz hedefe** iniyor (gövde metni içi bağlantı 324). Hepsini 44 px'e çıkarmak satır aralıklarını açıp tipografiyi bozardı; kritik kümenin tamamı ise somut ve küçük (şube seçici butonları, WhatsApp ve telefon bağlantısı, form alanı ve onay kutusu).
- **Kapsamın tamamı düzelir, muafiyet yazılmaz.** Ölçüm kayıtlı beş kalemden fazlasını buldu (soluk kart başlıkları **1,13:1**, iki yeni yüzey, gradyan metin 5 değil 11 yerde). Düzeltilmeyen kalem için kapıya adıyla muafiyet yazmak gerekirdi; muafiyet listesi zamanla unutulur ve kapı sessizce darlaşır.

**Geçersiz kıldığı:** `modules/M6-Kalite-Kapilari.md` → Teknik Notlar'daki başlangıç ölçümünün *"Kontrast ihlali: 0"* satırı bu yöntemle **geçersizdir** — o sıfır dar bir kapsamda ve yanlış modelle alınmıştı. Yeni regresyon çizgisi bu fazın sonunda, yeni yöntemle yeniden yazılır.

**İlgili Task/Faz:** Faz 3 — araştırma oturumu (`phases/PHASE-3.md`). Bulgular: B-031, B-030 (a11y/mobil ayağı), B-012 (a11y/mobil ayağı), B-032, B-033, B-022.

---

### 2026-09-23 — Onay e-postasının alıcısı doğrulanmıyor: adres başına tavan + selamlamadaki serbest metnin kaldırılması

**Bağlam:** TASK-2.07 (B-059) talep sahibine onay e-postasını açtı. Faz 2'nin kabul testi (senaryo 26, 2026-09-23) uçta şunu ölçtü: e-posta, **istek gövdesinde yazan her biçimsel geçerli adrese** gidiyor, doğrulanmış `alpfitplus.com` göndericisinden çıkıyor ve selamlamada istek sahibinin 120 karakterine kadar metnini taşıyor. Sınırlayan kapılar ölçüldü — IP başına 10 dk / 5 istek (6. istek `429`), bal küpü, onay kutusu — ama **adresin sahipliğini gösteren kapı yok**. Zarar içerik değil, gönderici itibarı ve istenmeyen posta. `isValidEmail`'i sıkılaştırmak çözüm değil: gevşekliği bilinçli (B-021/TASK-1.12) ve sorun biçim değil sahiplik.

**Seçenekler:**
1. **Adres başına tavan** — aynı alıcıya belirli bir pencerede en fazla N onay. Akışa dokunmaz; hacmi kırpar, kapatmaz.
2. **Selamlamadaki serbest metni kaldır** — istek sahibinin yazdığı metin alıcıya hiç ulaşmaz; e-posta yine gider. Kötüye kullanımı **içeriksiz** bırakır.
3. **Onayı ikinci adıma bağla** (çift katılım) — e-posta yalnız doğrulama bağlantısına tıklanınca gider. En sağlamı; yeni durum, saklanan jeton ve yasal metin revizyonu getirir, dönüşüm yoluna dokunur.

**Karar:** **1 + 2 birlikte; 3 reddedildi.** Tavan **24 saatte 3** onay e-postası, anahtar `email.trim().toLowerCase()` (`api/demo/route.ts` → `confirmCapped`). Onay metni artık **parametre almaz** (`content/mail.ts` → `text` sabit bir dizge, `Merhaba ${name},` → `Merhaba,`). Tavana takılan gönderim kayda `skipped` yazar — `notify_lead` kümesi **büyütülmez** (alan adı geçişinde v1 ile aynı koleksiyon okunacak). Ziyaretçinin gördüğü yanıt, kayıt ve ekip bildirimi **hiç değişmez**.

**Gerekçe:**
- **Tek başına hiçbiri bulguyu kapatmıyordu.** 1 tek başına saldırganın **kendi yazdığı metni** üçüncü bir adrese tavan kadar göndermesine izin verirdi; 2 tek başına gönderici itibarını yiyen hacmi hiç kırpmazdı. Bedeli üç dosya ve **sıfır akış değişikliği**, yani ikisini birden almamak için bir gerekçe yok.
- **3 ILKELER'in 1. ekseniyle (Dönüşüm) doğrudan çatışıyor.** Saklanan jeton yeni bir kişisel veri alanıdır ve M3 F3.2'nin kalıcı koruma kriterini (aynı turda yasal metin revizyonu) ateşler; pilot aşamadaki bir tanıtım sitesinin bugünkü hacmiyle orantısız. Kapanmayan artık — adres sahipliğinin **gerçekten** doğrulanması — bu seçenekte durur ve ihtiyaç doğarsa kendi bulgusuyla açılır.
- **Metnin parametresiz olması biçimsel bir kapıdır.** Parametre yoksa enjekte edilecek yer de yoktur; kişiselleştirmeyi geri isteyen her değişiklik aynı soruyu yeniden açar ve bunu kod yorumunda yazılı bulur.
- **Sayaç `HITS`'in ölçülmüş kusurlarını tekrarlamaz** (B-037 k.2): reddedilen deneme sayaca yazılmaz, harita dolduğunda `clear()` ile herkesin sayacı silinmez. **Bilinen sınırlar, bilinçle:** sayaç bellek içi ve örnek başınadır (`HITS` ile aynı tercih) ve alt-adresleme (`ad+etiket@…`) normalleştirilmez — o normalleştirme farklı iki **gerçek** adresi aynı sayaca koyup meşru bir onayı düşürebilirdi; kalan yüzey 2 sayesinde içeriksizdir.
- **Yasal metin değişmedi ve gerekçesi yazıldı** (M3 F3.2): yeni hedef, kayda yeni alan ve yeni sağlayıcı yok; adres yalnız sunucunun geçici belleğinde tutuluyor. Metnin IP paragrafının öznesi *"IP adresiniz"*dir, İşleme amaçları listesi zaten *"aynı adresten gelen talep sayısını sınırlamak"* diyor — hiçbir yaşayan cümle yanlışlaşmıyor.

**İlgili Task/Faz:** Faz 2 — TASK-2.21 (`tasks/archive/TASK-2.21.md`), UAT senaryo 26 (`phases/PHASE-2-UAT.md`)

---

### 2026-09-23 — Yasal metin aktarımı olgu olarak yazar: dört tedarikçinin ülkesi sayılır, hukuki dayanak hukukçuya bırakılır

**Bağlam:** 2026-09-22 «Ölçüm sunucusu ham IP tutuyor…» kararı metnin ne diyemeyeceğini sabitlemişti; ne **diyeceği** TASK-2.17'ye kalmıştı. Aynı turda aktarım maddesinin olgu tarafı da yazıldı. Ölçüm dört tedarikçinin dördü için de kaynağından yapıldı (döküm: `tasks/archive/TASK-2.17.md`).

**Karar:** Metin aktarımı **koşullu ihtimal olarak değil olgu olarak** anlatır (`aktarılabilir` → `aktarılır`) ve tedarikçi listesi her kalemin **rolünü ve verinin işlendiği ülkeyi** söyler; liste 3 → 4 kaleme çıkar (ekip posta kutusu eklenir). Ölçüm beyanlarında *"IP tutulmaz"* sınıfı iddia kullanılmaz ve **hiçbir saklama süresi yazılmaz** — bunun yerine dokümanın yerleşik deyimi tekrarlanır: *"bugün için otomatik bir silme süresi işletmiyoruz."* Yurt dışı aktarımın **hukuki dayanağı (KVKK m.9) yazılmaz**; o B-008'de hukukçunundur.

**Gerekçe:**
- **Ölçülen yazılır, ölçülmeyen yazılmaz — ve ikisi aynı cümlede karışmaz.** Vercel için *nerede işlediği* ölçüldü (`x-vercel-id` üç koşumda `iad1`, repoda `vercel.json`/`preferredRegion` yok), Google için yalnız *şirketin nerede olduğu* biliniyor (MX Google'da; Workspace veri bölgesi ölçülmedi) — metin birincisini bölge adıyla, ikincisini yalnız "ABD merkezli" diye yazar.
- **Gönderim bölgesi ile saklama yeri ayrı cümlelerde durur.** Resend `eu-west-1`'den gönderiyor ama kendi DPA'sında *"primary processing operations take place in the United States"* diyor. v1 bu ikisini bir kez birleştirip yanlış sonuca varmıştı (`bunker-ortami.md`); tekrarlanmaması için ayrım metne yerleştirildi.
- **Süre vaadi vermemek, uydurma süre yazmaktan dürüsttür** (2026-09-22 kararının devamı). Rotasyon `altyapi/vps` tarafında düzeltilirse ≈ 30 günlük pencere doğar ve metin o gün bir süre yazabilir; bu yüzden metne *"Bir silme süresi işletmeye başladığımızda bu metne yazılacaktır"* çapası kondu.
- **v1'den gerileme yok** (B-059 k.3): v1'in `RECIPIENTS` listesindeki beş kalemin beşi de karşılandı, `TRANSFER_FACT` karşılığı yazıldı; v2 iki yerde daha ileride (fonksiyon bölgesi adıyla; erişim kaydının kendisi v1'in metninde yok).

**Bedel, bilerek kabul:** Metin yurt dışı aktarımı olgu olarak duyurur ama dayanağını kurmaz — bu boşluk **görünür** kalır ve hukukçu incelemesinde kapanır (B-008). Uydurma bir madde numarası yazmak bu boşluğu gizlerdi.

**İlgili Task/Faz:** Faz 2 — TASK-2.17 (`tasks/archive/TASK-2.17.md`), B-024 kapanışı

---

### 2026-09-23 — Devralınan ölçüm ÖZETİ, devralınan iddia kadar risklidir: yasal cümle özetten değil ölçümün kendisinden yazılır

**Bağlam:** TASK-2.17, Umami'nin veritabanı hakkında bir cümle yazacaktı. Elde TASK-2.01'in bir gün önceki özeti vardı: *"`session` yalnız türetilmiş ülke/bölge/şehir tutuyor."* Özet kullanılmadı, `information_schema` yeniden sorgulandı.

**Karar:** Yasal metne giren her olgu, ondan üretilmiş bir **özetten değil ölçümün kendisinden** yazılır — özet aynı projenin bir gün önceki task'ından gelse bile. Ölçüm tekrarı pahalıysa cümle o kalemde yazılmaz.

**Gerekçe:** Yeniden ölçüm özetin **eksik** olduğunu gösterdi: IP sütunu gerçekten yok, ama `session` ayrıca `browser, os, device, screen, language` tutuyor. Özet **yanlış değil, tam değildi** — ve yasal metin tam olmayan bir listeyle yazılsaydı tam olarak B-024'ün kapattığı sınıfta yeni bir eksik beyan doğardı. Maliyet tek bir `SELECT`'ti; bedeli yayındaki bir taahhütte eksik kalem olurdu. Bu, memory'deki *"yerine yazdığın cümle de bir iddiadır"* disiplininin bir basamak yukarısıdır: iddia kadar **iddianın kaynağı da** doğrulanır.

**İlgili Task/Faz:** Faz 2 — TASK-2.17 (`tasks/archive/TASK-2.17.md`)

---

### 2026-09-23 — Yasaklı iddia sözlüğünde rakip adı tutulmaz: ne düz metin ne hash; slot beyan edilir, mekanizma F6.4'e bırakılır

**Bağlam:** TASK-2.15 görsel denetime iddia dalı ekledi ve sözlüğü `research/lib/claim-leak.mjs`'te tek kaynak olarak kurdu. Sözlüğün dayanağı `CLAIMS.md`'nin "Söylenemez" sütunu; o sütunun bir satırı **rakip adı**. Ama aynı sınır depoya da uzanıyor: M6 F6.4'ün edge case'i *"rakip adı repoda geçerse kendisi sızıntıdır"* diyor. Task dokümanı bu yüzden bir karar noktası bırakmıştı: düz metin mi, kalıp/hash mı.

**Ölçüm (2026-09-23):** satış dosyasının (`../alpfit-plus-satis/rekabet/`, salt okunur) başlıklarından çıkan **18 gerçek rakip ürün adının 0 tanesi** demo kaynağında (`../Alpfit.v1/demo/*.html`) geçiyor — bu hattın girdisi kendi ürünümüzün demosu, yani sınıfın bu hatta **hiç girdisi yok**. Aynı tarama v2 `src/` içinde bir "rakip adı" bildirdi; bakıldı ve sıradan bir Türkçe sözcük çıktı (kaba ad listesinin yanlış alarmı).

**Seçenekler:**
1. Adları düz metin olarak sözlüğe yaz — F6.4'ün edge case'inin adıyla yasakladığı şey; deponun kendisi sızıntı olur.
2. Adların SHA-256 özetlerini tut, jetonları hash'leyerek karşılaştır — düz metin sızdırmaz ama bugün **girdisi olmayan** bir sınıf için mekanizma kurar; ayrıca jeton sınırı (ad kaç sözcük?) ölçülmeden seçilemez.
3. Slotu sözlükte **adıyla ve gerekçesiyle** beyan et, kalıp/hash mekanizmasını girdinin gerçekten olduğu yere (F6.4 → `src/` metin denetimi) bırak.

**Karar:** 3. `claim-leak.mjs` başlığı slotu ve ölçümü yazılı tutar; dosyada ne ad ne hash durur.

**Gerekçe:**
- **Bugün koruduğu bir şey yok.** Görsel hattın girdisi kendi demomuz; ölçülen vuruş 0. Girdisi olmayan bir dal, kapının kapsamını büyütmeden bakım borcu üretir.
- **Yanlış alarm ölçüldü.** Kaba ad eşlemesi bir Türkçe sözcüğü rakip adı sandı. Doğru jeton sınırını seçmek, sınıfın gerçek girdisine (site metni) bakmayı gerektirir — o da F6.4'ün işi.
- **Tek kaynak korunur.** Sözlük zaten F6.4'ün devralacağı dosya; mekanizma oraya eklendiğinde aynı dosyaya girer, ikinci bir ev açılmaz.
- **Bedel, bilerek kabul:** görsel hat bugün bir rakip adını göremez. Kaynak salt okunur bir demo olduğu için bu ancak ürün demosuna rakip adı girerse anlam kazanır; o gün F6.4 mekanizması zaten kurulmuş olur.

**İlgili Task/Faz:** Faz 2 — TASK-2.15 (`tasks/archive/TASK-2.15.md`), M6 F6.4'ün girdisi

---

### 2026-09-23 — Yayınlanan yetenek kalemi, onu "henüz yok" diye anan cümleyi derleme hatasına çevirir

**Bağlam:** TASK-2.11 yol haritasının son dört evini `CAPABILITIES`'e bağlarken şu sınıf ortaya çıktı: yedi düzyazı cümle kalemi **adıyla** anıyor ve o adın **henüz olmadığını** söylüyor ("QR ve turnike ile giriş **yol haritamızda**", "kartla online ödeme **bugünkü sürümde yok**"). Adı sabitten almak **adı** hizalar; kalem yayınlandığı gün ad doğru kalır, **cümle sessizce yanlış olur** — B-040'ın ölçtüğü ayrışmanın ters yönü.

**Seçenekler:**
1. Yalnız adı türet, sınırı kod yorumuna yaz (task dokümanının önerisi).
2. Adı türet + kademeyi de türet, ama `simdi` kademesinde sessizce "bugün var" bas.
3. Adı türet + kalem `simdi`'ye geçtiğinde **hata fırlat** (fail-closed).

**Karar:** 3. `product.ts` → `upcomingCapability(id)` kalemi döndürür, `stageNote(id)` cümle-içi kademe ekini (`yolda` · `yol haritasında`) `STAGE_LABEL`'dan türetir; ikisi de kalem `simdi` kademesindeyse `Error` atar.

**Gerekçe:**
- **Kod yorumu bir kapı değildir** — bu projede tam olarak bu ölçüldü: ürünün kendi "v1.5 / ertelendi" yorumları bayatlamıştı (2026-09-23 sürüm etiketi kararı). Sınırı yorumda bırakmak onu bayatlamaya açık bırakırdı.
- **Sessiz "bugün var" en kötü hâl:** 2. seçenek "pakete dâhil değil" listesinde *"Online kart ile tahsilat (bugün var)"* gibi anlamsız ve yanlış bir satır üretirdi.
- **Fail-closed ucuz ve gürültülü:** fonksiyonlar modül düzeyinde çağrıldığı için hata **import anında** doğuyor. Sondada ölçüldü: `qr-turnike` `simdi`'ye taşındığında test suite yüklenemedi ve dev sunucusunda `/`, `/fiyat`, `/yazilim-secerken` **500** döndü. Bir kalemi yayına almanın bedeli, onu anan cümleleri elden geçirmektir — bu bilinçli bir maliyettir.

**Bedel, bilerek kabul:** `CAPABILITIES`'te bir kalemi `yolda`/`sonra` → `simdi` taşımak **tek satırlık bir iş değildir**; derleme durur ve ilgili cümleler düzeltilene kadar site ayağa kalkmaz. Ters yön (yeni kalem eklemek, `sonra` → `yolda` taşımak) etkilenmez — `stageNote` kendiliğinden hizalanır. Bu sınır DURUM'un aktif task notunda da duruyor ki sıradaki tur şaşırmasın.

**Kapsam notu:** SSS'nin *"Online ödeme alabiliyor muyum?"* **sorusu** bu kapıyı taşımaz (`capability()` kullanır) — kalem yayınlandığında soru geçerli kalır, değişen yalnız cevaptır. Kapı cevabın son cümlesindedir.

**İlgili Task/Faz:** Faz 2 — TASK-2.11 (`tasks/archive/TASK-2.11.md`)

---

### 2026-09-23 — Site sürüm etiketi ürünün sürüm haritasına çapalanır; `nextVersion` açılmaz (aynı günün 7. kararı geçersiz)

**Bağlam:** TASK-2.10 `FounderProgram`'ın üç durum satırını sabite bağlarken orta satırın başlığını (`"v1.5 yolda"`) `PRODUCT_STATUS.nextVersion`'a taşıyacaktı — aynı günün bir önceki kararının 7. maddesi bunu açıkça devrediyordu. Bağlamadan önce ölçüldü.

**Ölçüm** (`../Alpfit.v1/_dev/PRD/VERSIONS.md`, dosyanın kendi beyanı *"Bu dosya source of truth"*):

| Ürünün sürüm haritası | Sitedeki karşılığı |
|---|---|
| **v1.5** = kampanya derinleşmesi · gelişmiş raporlama/Excel · bekleme listesi otomasyonu · churn paneli olgunlaşması | `CAPABILITIES.yolda`'nın **ilk üçü** |
| **v2** = online ödeme · QR/turnike · Apple Health/Google Fit · AI gelişim/beslenme analizi · kurumsal üyelik | `CAPABILITIES.sonra`'nın **beşi de, birebir** |
| — (haritada **hiç geçmiyor**) | `yolda`'ya TASK-2.08'in taşıdığı **dört B-029 kalemi**: Üye 360 tam fazı · iptal eşiği ayarı · üyelik bitişi bildirimi · tek-yetki revoke |

**Karar:** `"yolda"` kademesi bir **sürümün kapsamı değildir** — yedisine birden "v1.5" demek, B-029'un tam olarak ölçtüğü çapasız iddia sınıfına girer. Bu yüzden:

1. **`nextVersion` açılmadı.** Aynı günün 7. kararı (*"alanı tüketicisini bağlayan task açar — TASK-2.10"*) bu ölçümle **geçersizdir**: alanın tüketicisi doğmadı, çünkü doğru cümle sürüm numarası taşımıyor. Alan ancak **kalem düzeyinde** sürüm bilgisi doğarsa anlamlı olur.
2. **Alt iki satırın başlığı `STAGE_LABEL`'dan okunur** ("Yolda" · "Yol haritasında") — `/ozellikler`'in kolon başlıklarıyla artık birebir aynı sözlük.
3. **`version` ("v1") bağlandı** ve çapası ölçüldü: aynı dosya v1 içeriğini tamamlanmış sayıyor (*"v1 içerik tamamlandı, Faz 8–22 ✅"*). 6. karar yerinde duruyor.
4. **Yeni kural:** sitede bir **sürüm numarası** iddiası yazılacaksa çapası ürünün kod yorumu değil `VERSIONS.md`'dir. Kod yorumundaki *"v1.5 adayı / ertelendi"* bir **kapsam taahhüdü değildir** ve bayatlar — ürünün kendi deposunda bunu kovalayan bir test bile var (`web/src/groups/GroupSessionsPanel.test.tsx:817`, *"bileşen kaynağında 'v1.5' ibaresi kalmadı"*).

**İlgili Task/Faz:** Faz 2 — TASK-2.10 (`tasks/archive/TASK-2.10.md`)

---

### 2026-09-23 — Yetenek/yol haritası tek kaynağı `CAPABILITIES`; `PRODUCT_STATUS.short` silinir, `version` kalır

**Bağlam:** "Bugün var / yolda / yol haritasında" ayrımı beş evde elle yazılıydı ve üçü birbirinden farklıydı (B-040); ayrıca beş yetenek cümlesinin ürün kodunda karşılığı yoktu (B-029). `PRODUCT_STATUS.short` ve `.version` alanlarının ise hiç tüketicisi yoktu (B-047).

**Kararlar ve gerekçeleri:**

1. **Sabitin adı `CAPABILITIES`, kademeler `simdi` / `yolda` / `sonra`.** B-040 `ROADMAP = { simdi, yolda, sonra }` önermişti; "roadmap" adı ilk kademeyi ("bugün var") yanlış çatı altına alıyor — bugün var olan şey yol haritası değil. Kademe anahtarları önerildiği gibi bırakıldı.

2. **Kalem `{ id, label, modul? }` — düz dizi değil.** Beş düzyazı cümle yol haritasındaki tek bir kalemi adıyla anıyor ("QR ve turnike", "Online ödeme"); düz dizide çağrı yeri kalemi indeksle aramak zorunda kalırdı. `capability(id)` bilinmeyen id'de sessizce boş dönmek yerine hata veriyor.

3. **Etiketler cümle-içi biçimde saklanır, başlık türetilir.** Ters yön (başlıktan küçültme) "QR" ve "Apple Health"i bozardı — yalnız büyütme kayıpsızdır. Büyütme Türkçe locale ile yapılır: `iptal` → `İptal` (locale verilmezse `Iptal` olurdu).

4. **`capabilityProse` "simdi" kademesini tip düzeyinde kabul etmez.** Ölçüldü: o kademenin etiketleri kendi içlerinde virgül taşıyor ("takvim, rezervasyon ve bekleme listesi") ve virgülle bağlandıklarında cümle okunamaz hale geliyor. O kademenin düzyazı evi `moduleProse()`; kademeyi liste olarak gösteren `CAPABILITIES.simdi` + `capabilityTitle()` kullanır.

5. **`PRODUCT_STATUS.modules` artık türetiliyor** — "simdi" kademesinin modül düzeyli kalemlerinden. Üretilen cümle bugünkünden **bir kalem farklı**: "antrenör performansı" eklendi (eskisi ürünün on modülünün sekizini sayıyordu). Karşılığı ölçüldü: `../Alpfit.v1` → `backend/src/routes/finance-trainer-performance.ts` (server.ts:427'de kayıtlı), `services/trainer-performance.service.ts`, `web/src/pages/TrainerPerformancePage.tsx`. **"Üye 360" bilinçle dışarıda:** ekran var ama ölçüm grafiği ve diyetisyen notu ürünün kendi "Yakında" kutusunda (B-029, W8) — o kalem "yolda" kademesinde.

6. **`PRODUCT_STATUS.short` ("Pilot aşamada") silindi.** Sıfır tüketici, sıfır planlı tüketici; sitede hiçbir yer bu ifadeyi elle de yazmıyor (ölçüldü). Pilot iddiasını `sentence` taşıyor, yani CLAIMS'in tek-kaynak disiplini zayıflamıyor. **`version` ("v1") kaldı** — "v1 hazır" bugün üç yerde elle yazılı (`chat.ts:126`, `faq.ts:48`, `FounderProgram.tsx:83`) ve TASK-2.10/2.11 onları buraya bağlayacak. Ölçüt alanın büyüklüğü değil tüketicisinin var olup olmadığıydı.

7. **`nextVersion` ("v1.5") AÇILMADI.** `FounderProgram.tsx:88` "v1.5 yolda" başlığını elle yazıyor ve kardeşi bağlanırken o da bağlanmalı — ama tüketicisi doğmadan alan açmak `short`'u ölü borç yapan hatanın ta kendisi. Alanı **tüketicisini bağlayan task açar** (TASK-2.10).

**Kapsam dışı (bilinçle):** Tüketicilerin bağlanması TASK-2.10/2.11'de, karşılıksız cümlelerin düzeltilmesi TASK-2.09'da. Bu task'tan sonra beş ev hâlâ kendi metnini yazıyor — ölçüldü: sabiti atlayan **17 çağrı satırı / 6 dosya** (`ozellikler/page.tsx` 6 · `faq.ts` 3 · `karsilastirma.ts` 2 · `chat.ts` 2 · `FounderProgram.tsx` 2 · `fiyat/page.tsx` 2). Bu sayı TASK-2.10 + 2.11'in kapanış ölçütüdür.

**İlgili Task/Faz:** Faz 2 — TASK-2.08 (`tasks/archive/TASK-2.08.md`)

---
