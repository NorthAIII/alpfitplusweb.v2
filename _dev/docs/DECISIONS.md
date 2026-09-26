# DECISIONS — Karar Günlüğü

**Amaç:** Önemli mimari ve tasarım kararlarının kaydı. "Neden X yerine Y tercih edildi?" sorusunun cevabı burada.
**Ne zaman güncellenir:** Önemli bir teknik, mimari veya tasarım kararı alındığında.

> İddia sınırı (ne söylenir, ne söylenmez) burada değil → `CLAIMS.md`. Tasarım kuralları → `STYLE-GUIDE.md`. Buradaki kayıtlar onların **üzerine** gelen tercihlerdir.

<!-- KURAL: Bu günlük append-only'dir — yazılmış bir karar silinmez, düzeltilmez. Geçersizleşen karar YENİ bir kararla geçersiz kılınır. -->

**Kapanan aralıklar (arşiv):**

- [`DECISIONS-2026-09-10..2026-09-13.md`](DECISIONS-2026-09-10..2026-09-13.md) — kuruluş dönemi, 22 kayıt: dil (yalnız Türkçe), fiyat sunumu, fotoğraf ve görsel ton, chatbot sırası, modül yapısı, rakip adsızlığı, faz sırası, Vercel ortam modeli, analitik (Umami), lead hedefinin ilk iki tur kararı, Vitest, alıcı provası, e-posta kaynağı.
- [`DECISIONS-2026-09-14..2026-09-22.md`](DECISIONS-2026-09-14..2026-09-22.md) — Faz 1'in kapanışı ve Faz 2'nin kuruluşu, 12 kayıt: lead hedefinin son tur kararı ve depo sözleşmesinin sınanması, Umami site kaydı, bildirim durumu (`notify_*`) ve onay e-postasıyla gelen geçersiz kılma, anahtar kasası, analitik olay adları, `.env` sızıntısının ölçülen kapsamı ve döndürmenin düşmesi, ölçüm sunucusunun ham IP gerçeği, yetenek iddialarının tek listeden türemesi.
- [`DECISIONS-2026-09-23..2026-09-23.md`](DECISIONS-2026-09-23..2026-09-23.md) — Faz 2'nin kapanış günü, 7 kayıt: yetenek/yol haritası tek kaynağı (`CAPABILITIES`), site sürüm etiketinin ürün sürüm haritasına çapalanması, yayınlanan yetenek kaleminin onu "henüz yok" diye anan cümleyi derleme hatasına çevirmesi, yasaklı iddia sözlüğünde rakip adının tutulmaması, devralınan ölçüm özetinin iddia kadar riskli olması, yasal metin aktarımının olgu olarak yazılması, onay e-postası alıcısının adres başına tavanı.

<!-- KURAL: Doküman kırmızı çizgiyi (~20k token) aştığında EN ESKİ kapanan aralık `DECISIONS-<ilk>..<son>.md`'ye taşınır ve buraya tek satırlık pointer düşer; kayıt, sıra ve anlam korunur (içerik-koruyan bölme). Giriş noktası HER ZAMAN bu dosyadır — kararı arayan adım (review-phase'in `Superseded` araması, audit-product'ın bilinçli-tercih süzgeci) buradan çocuğa izler. Kanon: CLAUDE.md → Boyut ve Bölünme. -->

---

## Kararlar

<!-- Her yeni karar aşağıdaki formatta en üste eklenir (en yeni en üstte) -->

### 2026-09-26 — Alan adı geçişinin teknik yolu: tek çağrılık taşıma, tek atlamalı 301, JS'siz gönderilen form, v1'in CSP'si, depoda sabitlenen bölge

**Bağlam:** Faz 4'ün araştırması (`phases/PHASE-4.md` → Araştırma Bulguları) v1 canlısını, v2 önizlemesini ve Vercel proje ayarlarını ölçtü. Kapsam tartışmasının devraldığı üç daralma ölçümde çürüdü (adres kümesi 27 değil 45 kalem + iki biçim; sayfa başına paylaşım kartı v1'de var; B-059 kalem 3 bayat) ve iki sessiz çakışma çıktı: Frankfurt kararı yasal metnin "form ucu Washington'da" cümlesini yanlışa çeviriyor, ve üretim ile önizleme bugün aynı depo token'ını tek kayıtta paylaşıyor.

**Kararlar ve gerekçeleri:**

1. **Alan adı Vercel'in "proje alan adını taşı" ucuyla tek çağrıda taşınır** (`POST /v1/projects/{kaynak}/domains/{alan}/move`); `www` yönlendirmesi 307'den 301'e çevrilir. Sök-tak yolunda iki adım arasında alan adı hiçbir projede değildir; taşıma ucunda bu ara hâl yok ve geri dönüş aynı çağrının tersidir.
2. **v1'in her adresi tek atlamada 301 alır** (kullanıcı). Next'te `permanent: true` 308 üretir ve eğik-çizgi çevrimi özel kuralların önünde öncelikli bir iç kuraldır (ölçüldü, routes-manifest) — yani varsayılanla v1 site haritasındaki `/en/` bile 308 → 301 iki atlama alırdı. Çözüm `skipTrailingSlashRedirect` + `statusCode: 301` kurallarıdır; sitenin eğik-çizgi davranışı 308'den 301'e döner ve bu bilinçlidir. `/404` · `/en/404` · `/404.html` yönlenmez, 404 döner (kullanıcı) — tanım gereği karşılığı olmayan adresler; ana sayfaya yönlendirmek arama motorunda "yumuşak 404" sayılır.
3. **Form JavaScript olmadan da gönderilir** (kullanıcı, B-065): native POST, uç form kodlamasını da kabul eder ve 303 ile iki sonuç sayfasından birine yönlendirir. Düğmeyi hidrasyona bağlayan küçük çözüm reddedildi: ölçüm sızıntının sınıfının "JS kapalı" değil "hidrasyonsuz gönderim" olduğunu gösterdi, ve hidrasyonun hiç olmadığı hâlde (eklenti, hata, yanlış bir CSP kuralı) o çözüm düğmeyi ölü bırakırdı — "gelen talep kaybolmaz" ilkesine karşı. Köken kontrolü yalnız yeni yolda; JSON yolu (B-037) bu fazda değişmez.
4. **CSP başlıkta sabit ve v1'in politikasıdır (`'unsafe-inline'` dahil).** Nonce yolu Next'te her sayfayı dinamik render'a zorlar (statik üretim ve CDN önbelleği kaybolur); deneysel SRI satır içi RSC betiklerini kapsamaz. Parite ölçütü v1'in bugün yaptığıdır. CSP, B-065'ten **sonra** yayına girer.
5. **Fonksiyon bölgesi depoda sabitlenir** (`vercel.json` → `regions: ["fra1"]`), panelde değil — yasal metnin bölge cümlesini çivileyen test yalnız depoyu görebilir. Bölge, yasal metnin düzeltilmesi ve testin iki yönlü yeniden yazılması aynı yayına biner.
6. **Dal önizlemesi Vercel girişli kalır** (kullanıcı). Bu, 2026-09-11 kurulumundaki "açık adres + üç katman `noindex`, Vercel koruması kullanılmaz" kararını **dal önizlemesi için** geçersiz kılar: o karar önizlemenin tek yayın yüzeyi olduğu dönem içindi; geçişten sonra paylaşılacak yüzey canlı sitedir. Otomatik ölçüm için otomasyon atlatma anahtarı üretilir.
7. **Üç canlı env değeri alan adı taşımasıyla aynı yeniden derlemeye biner.** Paylaşılan iki kayıt (`LEAD_STORE_TOKEN`, `IP_HASH_SALT`) önizlemeye daraltılır, üretim için yeni kayıt açılır. Önce girerse `.vercel.app`'teki önizleme derlemeleri canlı `leads` koleksiyonuna yazar.
8. **Sayfa başına paylaşım kartı faza alındı** (kullanıcı; B-042 kalem 1) — kapsam tartışması onu "parite dışı" saymıştı, ölçüm v1'in yaptığını gösterdi. Alt bilgideki "Giriş Yap" gizlemesi bu faza **alınmadı** (kullanıcı).
9. **Geçiş bir betikle ölçülür** (kullanıcı): adres haritası, başlıklar, dizin açıklığı ve paylaşım kartı aynı betikle yerel yayın kopyasına, dal önizlemesine ve canlıya karşı koşar.

**Geçersiz kıldığı:** 2026-09-11 Vercel ortam modeli kararının önizleme koruması kısmı (madde 6) — yalnız dal önizlemesi için; `modules/M7-Yayin-ve-Altyapi.md` → F7.3 Edge Case'ler aynı gün hizalandı.

**İlgili Task/Faz:** Faz 4 — araştırma oturumu (`phases/PHASE-4.md`). Bulgular: B-065, B-043, B-042 (kalem 1 ve 3), B-059 (kalem 3), B-016, B-011, B-027

---

### 2026-09-25 — `Modules`'ün öne çıkan beş modülü "pano"dur: tek çerçeve, eşit olmayan hücreler (2 + 3), ikonsuz; öne çıkan sayısı 5'tir ve bunu kapsam dışı şerit belirler

**Bağlam:** B-051'in ikinci ızgarası. Öne çıkan beş modül `md:grid-cols-2 lg:grid-cols-3` üzerinde beş **eşit** kart olarak diziliyordu (ölçüldü @1440: beşi de 349,3 px genişlikte, iki yükseklik değeri — 378,1 ve 358,1) ve masaüstünde 3 + 2 dizildiği için ikinci satır **tırtıklı** bitiyordu. Her kart `IconBox` (44×44 karo) + başlık + blurb + dört madde taşıyordu. Aynı bölümün ikinci yarısı (kalan beş modülün `lg:grid-cols-5` şeridi) kullanıcı kararıyla **kapsam dışıdır**.

**Karar:**
- **Bölümün ritmi PANODUR.** Beş hücre tek bir çerçeveli panonun (`rounded-card ring-1 ring-line bg-surface`) içinde, iç saç teli çizgilerle ayrılır. Üst sıra **iki** hücre (`0,58 / 0,42`), alt sıra **üç** hücre; iki sıra da tam dolar, yani **tırtıklı satır kalmaz**. `lg` altında hücreler tek sütuna yığılır ve panonun içinde kalır.
- **Omurga hücresi vardır ve üç ayrı işaretle belirtilir:** genişlik (0,58), punto (başlık `text-xl sm:text-2xl`, ötekiler `text-lg`) ve soluk zemin (`surface-2` — bölümün ikinci yarısındaki şeridin tonuyla aynı). Seçilen modül **Takvim ve Rezervasyon**'dur; gerekçe içeriğin kendi cümlesidir (*"Ürünün en kritik modülü"*), yeni bir etiket yazılmadı.
- **Panoda ikon yoktur ve yerine başka bir ikon konmaz.** `IconBox` karosu reddedilen kalıbın ikinci ayağıydı; satır içi küçük işaret ise TASK-3.18'in (Faydalar) jestidir — aynı hareketi iki bölümde tekrarlamak "düzen çeşitliliği" değil kopyadır. Madde işareti svg değil, `::before` ile çizilen 10 px'lik tek piksellik bir çizgidir.
- **Öne çıkan sayısı BEŞTİR ve bu sayı düzene göre değil içeriğe göre sabitlenmiştir.** Kapsam dışı şerit `lg:grid-cols-5`'tir; öne çıkanı dörde ya da altıya çekmek tırtıklı satırı çözmez, yalnızca **dokunulmayacak şeride** taşır (4 öğe / 5 sütun ya da 6 öğe / 5 sütun). Düzeltilen sayı değil düzendir.
- **Metin bu bölümün işi değildir.** Beş modülün başlığı, blurb'ü, madde sırası ve `slice(0, 4)` kırpması `src/content/product.ts` → `MODULES`'tedir; `git diff -- src/content/` **boş**.

**Gerekçe:**
- **Sayfanın bugünkü ritmine karşı seçildi.** İki sütunlu bölme sayfada zaten 8 kez var (TASK-3.18'de sayıldı) — dokuzuncusu ritim değişimi olmaz. Tam genişlikte saç teli döküm bir önceki turda `Benefits`'e verildi, tekrarı olurdu. Eşit kartlı ızgara zaten `WhyUs` ve `SegmentsGrid`'in ritmidir. Çerçeveli, eşit olmayan hücreli pano sayfada başka hiçbir yerde yok.
- **Pano bölümün kendi cümlesini görselleştiriyor:** *"Kulübün tamamı, parça parça değil."* Beş ayrı kart yerine tek bir nesne.
- **Kalıptan gerçekten çıkıldığı ölçüldü** (3100, T18'in üç mekanik ayağı aynı tanımla): öne çıkanlar tarafında ızgara kabı **1 → 0**, ikon karosu **5 × 44×44 → 0**, kalem kutusu benzersiz ölçü @1440 **2 → 3** (631×262,5 · 457×262,5 · 362,7×287,9 — iki sıra da 1088 px'i tam dolduruyor). Bölümde kalan tek ızgara kabı ve kalan beş karo **kapsam dışı şeride** aittir.
- **Bölüm her genişlikte kısaldı** (mobil uzunluk şikâyeti — Gelen Kutusu `[kickoff SORU]`): @320 **3181 → 2624 (−557)** · @390 **2812 → 2281 (−531)** · @1440 **1388 → 1182 (−206)**. Sayfa boyu farkı üç genişlikte de bölüm boyu farkına **eşit**, yani başka hiçbir bölümün yüksekliği oynamadı.
- **Soluk zeminin bedeli ölçüldü:** omurga hücresindeki gövde metni `#fff` yerine `surface-2` üstünde duruyor ve `p02` **7,05 → 6,61**'e, başlık **17,57 → 16,48**'e düşüyor (gerekenler 4,5 ve 3). Üç genişlikte de **45 kalem, 0 eşik altı**.
- **Kapılar tabanda kaldı:** mobil kapı **0 / çıkış 0 (yeşil)**, a11y **6 / çıkış 1** (tabana eşit, hepsi `/gecis`), font-guard **85.129 karakter / çıkış 0** (birebir), perf `/` **141 KB masaüstü · 132 KB mobil** (birebir), `npm test` **219 + 2**. Hiçbir kapsam tabanı oynamadı.

---

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
