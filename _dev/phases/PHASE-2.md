# Phase 2: Yayın öncesi düzeltmeler

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-2.md`) faz HÂLÂ AKTİFKEN `PHASE-2-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-2 · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder. -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). -->

---

## Genel Bilgiler

**Amaç:** Alan adı geçişinden önce sitenin ziyaretçiye söylediği her şeyi ölçülmüş gerçeğe hizalamak: yetenek iddiaları, ürün görselleri, yasal metinler ve KVKK başvuru adresi. Aynı fazda huninin son metresi kapanır (mobilde onay ve hata görünür hâle gelir, talep sahibi onay e-postası alır) ve üretim imajına sızan sırlar çıkarılır. Faz, yayın anına "site doğruyu söylüyor ve talep kaybolmuyor" diyerek girilebilmesi için vardır.

**Milestone:** Site ürünün bugün yapamadığı hiçbir şeyi "var" diye anlatmıyor ve beş cümlenin dayanağı `src/content/`'te **tek bir yetenek listesi**; ana sayfada render edilen ürün görselinde gerçek kişi adı ve olmayan özellik yok, hattın denetimi bir sonraki sızıntıyı kendisi yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor (IP özeti ve saklama süresi, onay kapsamı, ölçüm sunucusunun gerçeği) ve dört beyanı bir test çiviliyor; `destek@alpfitplus.com` gerçek bir test postası alıyor; üretim imajında `.env` yok ve iki anahtar döndürülmüş; 320-412 px'te demo formunun onayı **ve** hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

Bu faz bir **bulgu fazıdır**: yeni yetenek getirmez, tamamlanmış feature'ların ziyaretçiye yanlış görünen yerlerini düzeltir. Bu yüzden **feature matrisi değişmez** — yeni satır açılmaz, mevcut atamalar ve ✅ durumları olduğu gibi kalır (Faz 1'in destek-işi deseninin aynısı). Aşağıdaki tablo hangi feature'ın hangi bulguyla dokunulduğunu gösterir.

| Dokunulan feature | Modül | Bulgu ve iş |
|---|---|---|
| F1.1: Tek kaynak içerik ve iddia sabitleri | M1-İçerik ve İddia Kaynağı | **B-029** — beş karşılıksız yetenek iddiası; "bugün var / yolda" ayrımı tek yetenek listesinden türer (yan kazanç: **B-040**, yol haritasının dört evde ayrışması) |
| F1.1 / F2.2 (yasal sayfalar) | M1 / M2-Sayfalar | **B-024** — yasal metin gerçek veri akışını eksik anlatıyor (IP özeti ve 12 ay saklama, ters yönde "tarayıcı bilgisi", Gizlilik listesinin ayrışması, form onayının kapsamı) · **B-060** — düzeltilen beyanları çiviler test paketi |
| F5.1: Ürün ekran görüntüsü hattı | M5-Görsel Varlık Hattı | **B-018** — ana sayfadaki görselde gerçek kişi adı, altı görselde olmayan menü girdisi, raporlarda olmayan kart; denetime iddia sızıntısı dalı |
| F3.1: Demo formu ve talep ucu | M3-Lead Hattı | **B-055** — 320-360 px'te onay hiç görünmüyor, hata kutusu ekran dışında, hatalı alanda işaret yok, odak yanlış alana ya da hiçbir yere gidiyor |
| F3.3: E-posta bildirimi | M3-Lead Hattı | **B-059**'un e-posta ayağı — talep sahibine onay e-postası (v1'de var, v2'de yok) |
| F2.1 / F2.2 (fiyat ve segment sayfaları) | M2-Sayfalar | **B-034** — mobil ana çağrı 52 px yerine 24 px (kırılım öneki eksik) |
| F7.1: Docker çalışma ortamı | M7-Yayın ve Altyapı | **B-058** — `.env` üretim imajı katmanında; yerel üretim provasının hedefi sessiz; iki anahtar döndürülür |
| F7.5'in ön koşulu (feature bu fazda açılmaz) | M7-Yayın ve Altyapı | **B-011** — apex'te MX kaydı yok, KVKK başvuru adresi posta alamıyor |

---

## Kapsam Tartışması

> `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-22).

### Alınan Kararlar

- **Faz "site doğruyu söylüyor" temasıdır, artı huninin son metresi.** Konu listesinin dört bulgusu (B-029, B-018, B-024, B-011) ortak bir cümleyi paylaşıyor: site ziyaretçiye dayanağı olmayan bir şey söylüyor. Bunlara **B-058** (üretim imajına sızan sırlar — Faz 1 retrospektifi geçişten önce kapanmasını istedi) ve iki ucuz ama dönüşüme doğrudan dokunan arayüz kalemi eklendi: **B-034** (fiyat sayfasının mobil ana çağrısı tasarlananın %46'sı, düzeltme tek kelime) ve **B-055** (320-360 px'te başarılı gönderimde ziyaretçi hiçbir onay görmüyor). Gerekçe: ikisi de ILKELER'in 1. önceliği olan **Dönüşüm**'e dokunuyor ve ikisi de küçük.
- **Kontrast ihlalleri (B-032), 320 px'te içerik kaybı (B-033) ve ölçüm aracının kör noktaları (B-031) bu fazda değil** — "Görsel ve mobil iyileştirme" fazında. Gerekçe: B-032'yi ölçerek doğrulayacak aracın kendisi kör (B-031) ve onun onarımı piksel-tabanlı yeni bir ölçüm yöntemi demek; B-033'ün düzeltmesi `ui/Button` temel sınıfına dokunuyor, yani her butonu etkiliyor. İkisi de dar bir düzeltme fazına sığmaz.
- **"Görsel ve mobil iyileştirme" fazı alan adı geçişinin ÖNÜNE alındı.** Bugünkü sıra onu geçişten sonraya koyuyordu; o sırayla ölçülmüş AA kontrast ihlalleri canlıya çıkacaktı ve ILKELER "erişilebilirlik WCAG AA'nın altına düşmez" maddesini pazarlıksız sayıyor. Yeni sıra: Faz 2 → Görsel ve mobil iyileştirme → Alan adı geçişi (PHASES.md → Sıradaki Fazlar).
- **B-029 yapıyla kapanır, cümle cümle değil.** "Bugün var / yolda" ayrımı `src/content/` içinde **tek bir yetenek listesinden** türer; beş cümle o listeye göre düzeltilir. Gerekçe ILKELER → "Kalıcılık önceliği": ürün ilerlemeye devam edecek, cümle bazlı düzeltme aynı sınıfı yeniden doğurur. Yol haritasının bugün dört ayrı evde ve birbiriyle çelişik durması (**B-040**) aynı hamlede kapanır; ileride kurulacak otomatik iddia denetimi (M6 F6.4) bu listeyi ürün deposuna karşı kontrol eder.
- **B-018'de denetim de düzelir, yalnız kalemler değil.** Ölçüm şunu gösterdi: görsel üretim hattının denetimi iddia sızıntısına **hiç** bakmıyor (21 gerçek sızıntı dizgesi verildi, 20'si kör) ve temizlik listesi sekiz ekranın üçünü kapsıyor. Denetim adları regex'ten değil kendi temizlik tablosundan okuyacak; yasaklı iddia kalıpları (ciro, yüzde, "en hızlı", yol haritası özelliği) **tek dosyada** tutulacak ki ileride metin denetimi (M6 F6.4) aynı sözlüğü devralsın.
- **B-024'te sunucu gerçeği önce ölçülür, metin ona göre yazılır.** Yasal metin "bu ölçüm kayıtlarında IP adresinizi tutmaz" diyor; ölçüm betiği kendi sunucumuzdan yüklendiği için her ziyaretçinin ham IP'si önündeki nginx'in erişim kaydına düşüyor (v1 tarafında ölçüldü, 2026-07-28: rotasyon yok, kayıt sınırsız büyüyor). **Bugünkü hâli ölçülmedi** — fazın ilk işlerinden biri SSH ile salt-okuma ölçümü. Metin uydurma süre vaadi vermez; sunucu düzeltmesi gerekiyorsa (kayıt rotasyonu / IP maskeleme) altyapı tarafının işi olarak kayda geçer ve **bu fazı kilitlemez** (ILKELER → proje-dışı iş faz bitişini kilitlemez).
- **B-011 DNS'te çözülür, metinde değil.** Google Workspace'in yarısı zaten kurulu (gönderim yetkisi, DKIM, alan adı doğrulaması); eksik olan yalnız gelen posta kaydı. MX kayıtları Squarespace'te girilir ve **gerçek bir test postasıyla** ölçülür. Alternatif (başvuru adresini başka bir şirketin alan adına çevirmek) reddedildi — KVKK başvuru kanalı şirketin kendi alan adında kalır.
- **B-058'de iki anahtar döndürülür.** `.dockerignore` düzeltilir (`.env` ve `.env.*`, `!.env.example` istisnasıyla), `web-prod`'a **bilinçli** env verilir ki yerel prova neye bağlandığını söylesin, ve iki değer yenilenir: IP tuzu (ölçüldü — v1'in değeri değil, TASK-1.18'de v2 için üretilmiş rastgele; döndürmenin v1 kayıtlarıyla süreklilik bedeli yok, tek etkisi v2'nin 15 test kaydının IP kimliği bağının kopması) ve lead deposunun **önizleme** token'ı (sunucuda bir işlem; v1'in canlı akışı üretim token'ını kullandığı için etkilenmez). Kalan üç değer **beyana göre** yerel ya da gizli-olmayan — ⚠️ bu beyan ölçülmedi: `.env`'deki `LEAD_TOKEN_PRODUCTION` gerçekten yerel depo kopyasının token'ı mı, yoksa canlı üretim token'ı mı? Canlı değer oradaysa döndürme kapsamı üçe çıkar ve v1'in canlı lead akışı da ilgilenir. Ölçüm fazın ilk işlerinden biri (`docs/DECISIONS.md` 2026-09-22 → açık kalem).
- **B-055 tam kapanır, yarım değil.** Altı ayak: onay ve hata her telefonda görünür (odak oraya taşınır, yapışkan başlığın arkasına düşmez) · hata metni ilgili alanın hemen altında · hatalı alan görsel işaret alır · odak hata türüne göre doğru alana gider (eksik alanda boş olana, bozuk alanda bozuk olana) · eşlenmeyen kodlar ve ağ hatası hata kutusuna odaklanır · gönderim başında eski hata işaretleri sıfırlanır.
- **B-059'un e-posta ayağı bu faza alındı.** Faz 1'in kapanışı ekran onayı (B-055) ile onay e-postasının yokluğunu **tek dikiş** olarak işaretlemişti: ikisi üst üste geldiğinde ziyaretçi talebinin ulaştığını hiçbir kanaldan öğrenemiyor. Ekran onayı bu fazda düzeldiği için e-posta ayağı da burada kapanır — altyapı kurulu (Resend, doğrulanmış alan adı), iş küçük, ve alan adı geçişinde v1'e göre gerileme doğmaz. B-059'un kalan ayakları (depo alanlarının kalıcı `pending` hâli, yasal metnin v1'den az bilgi vermesi) geçiş fazının parite listesinde kalır.
- **B-060 aynı fazda yazılır.** Bu faz yasal metinleri ve görsel beyanları yeniden yazıyor; v2'de o beyanları koruyan hiçbir test yok (v1'de vardı, taşınmadı). ILKELER → "Kümülatif test altyapısı: her yeni yetenek kendi güvencesini de getirir" — düzeltilen beyanı çivilemeyen bir düzeltme, bir sonraki metin düzenlemesinde sessizce çürür. Test altyapısı Faz 1'de kurulduğu için iş küçük.

### Kullanıcı Tercihleri

- Faz kapsamı: dört konu bulgusu + sır sızıntısı + iki ucuz arayüz kalemi (B-034, B-055).
- Faz sırası: görsel ve mobil iyileştirme alan adı geçişinden **önce**.
- Anahtar döndürme: **ikisi de** (IP tuzu + önizleme depo token'ı). `.env`'in üretim değerleri taşıdığı kullanıcı tarafından teyit edildi.
- IP gerçeği: önce ölç, metni ölçülene göre yaz, sunucu düzeltmesini ayrı eve kaydet.
- KVKK adresi: MX kayıtlarını ekle (DNS adımı kullanıcıda, faz yönergeyi yazar ve sonucu ölçer).
- Abartılı iddialar: tek yetenek listesi kur (yapısal çözüm).
- Görsel sızıntısı: üç kalem + denetime iddia dalı.
- Mobil onay: tam düzeltme.
- Onay e-postası: bu faza alınsın.
- Beyan koruma testi: bu faza alınsın.

### Kapsam Dışı

- **B-032** (ölçülmüş AA kontrast ihlalleri, beş yüzey) · **B-033** (320 px'te Kurucu Programı bölümünde içerik ve işlev kaybı) · **B-031** (`a11y.mjs`'in kontrast yönteminin üç kör noktası) → **"Görsel ve mobil iyileştirme" fazı** (artık geçişten önce). ⚠️ O fazın kapsam tartışmasına not: B-031'in atomu düzeltmenin **B-030 ile aynı turda** yapılmasını istiyor (yöntem düzeltilip çıkış kodu eklenmezse ihlaller görünür olur ama kapı yine yeşil kalır); B-030'un bugünkü evi "Kalite kapıları otomatik" fazı. İkisinin birlikte mi yürüyeceği o fazın kararı — burada kararlaştırılmadı.
- **Demo formunun kalıcı tarayıcı ölçüm betiği** (B-055'in koruma önerisinin son kalemi: 320/390/1440 × hata türleri × odak × onay) → "Kalite kapıları otomatik" fazı, tek komutun (M6 F6.2) parçası. Bu fazda düzeltme elle ölçülür.
- **Yasal metinlerin hukukçu onayı (B-008)** ve **yurt dışına aktarımın hukuki dayanağı** (B-024'ün 2. kaleminin yarısı) → dış aktör; fazı kilitlemez ve bu oturumda uydurulmaz. Faz metnin **olgu** tarafını doğru yazar, hukuki sebep bölümünü hukukçuya bırakır.
- **Ölçüm sunucusunun nginx kaydının düzeltilmesi** (rotasyon / IP maskeleme) → altyapı tarafı (`altyapi/vps`), bu repo değil. Faz yalnız ölçer ve metni ölçülene göre yazar.
- **Ana sayfanın mobilde ~26.000 px uzunluğu kararı** → "Görsel ve mobil iyileştirme" fazı (Gelen Kutusu'ndaki `[kickoff SORU]`).
- **Fiziksel telefonla uçtan uca tur** → aynı faz (Gelen Kutusu'ndaki `[TASK-1.06]` notu).
- **`npm run lint`'in kırık olması (B-028)** ve dokuz paketin geride olması → "Kalite kapıları otomatik" / teknik borç fazı.
- **Alan adı geçişinin kendisi (F7.5)**, 301 haritası ve üç env değerinin taşınması → sonraki fazlar.
- **Metin tonu (F1.2)** → kendi fazı, alan adı geçişinden sonra. Bu fazda iddia **doğruluğu** düzelir, **ton** değişmez.
- **Ürün görsellerinin tam sızıntı envanterinin kalan kalemleri (B-044)** → bu fazda yalnız B-018'in üç kalemi ve denetimin iddia dalı kapsamda; B-044'ün avatar-ad uyumsuzlukları ve Hero'daki elle yazılmış "%78" kalemi kanvasta kalır.

---

## Araştırma Bulguları

> `/devflow:research-phase` oturumunda dolduruldu (2026-09-22). Ölçümler bu makinede, çalışan konteynerlere ve komşu depolara karşı yapıldı.

### Değerlendirilen Yaklaşımlar

**1. Yetenek iddialarının tek kaynağı (B-029 · B-040)**

Bugünkü hâl ölçüldü: "bugün var / yolda / yol haritasında" ayrımı **beş evde** elle yazılı — `src/app/ozellikler/page.tsx` (Yol haritası bölümü, üç kolon: 10/3/5 kalem), `src/components/sections/FounderProgram.tsx:81-95` (üç `StatusRow`, düzyazı), `src/content/chat.ts:126-127` (düzyazı), `src/content/faq.ts:48` (düzyazı), `src/app/fiyat/page.tsx:29-34` (`NOT_INCLUDED`, "(yol haritasında)" ekiyle iki kalem). Altıncı bir kısmî ev `src/content/site.ts:38-44` → `PRODUCT_STATUS.modules` (sekiz modülü düzyazı sayar).

- **(a) Yalnız yol haritası sabiti.** `src/content/product.ts`'e üç kademeli bir sabit konur; beş ev oradan okur. Artı: küçük, tüketicilerin hepsi düzyazıyı listeden türetebiliyor (ölçüldü — dördü de kalemleri virgülle bağlıyor). Eksi: beş yanlış cümlenin kendisi listeye **bağlı değil**, elle düzeltilir ve aynı sınıf yeniden doğabilir.
- **(b) İddiaya bağlı yetenek envanteri.** Her modül maddesi / segment iddiası bir yetenek kimliğine bağlanır, kimlik durumunu listeden alır. Artı: en sağlamı. Eksi: 124 içerik maddesinin tamamının yeniden yapılandırılması — dar bir düzeltme fazının sınırını aşar.
- **(c) Liste + ürünün kendi işaretlerinden türeyen tarama.** (a)'nın üstüne: ürün deposu bugün-yok kalemlerini **adıyla aranabilir** notlarda taşıyor ("Yakında", "v1.5", "W8", "ertelendi" — B-029 dördünü böyle buldu). O notlardan konu sözcükleri çıkarılır, sitede o konulara değen cümleler taranır.

**Seçilen: (a) + (c)** (kullanıcı kararı, research 2026-09-22). Liste kurulur ve beş ev ondan okur; ayrıca ürünün kendi "bugün yok" işaretlerinden türeyen bir tarama, beş cümleden geniş ama 124'ten dar bir alt küme verir. (b) reddedildi: bu faz iddianın **doğruluğunu** düzeltir, içerik mimarisini yeniden kurmaz.

**2. Görsel denetimin temizlikten bağımsızlaşması (B-018)**

- **(a) Ad kalıbını genişlet** (`auditTexts`'teki iki-tam-sözcük regex'ine `&`, tek harfli soyad, vb. eklenir). Reddedildi: denetim temizliğin varsayımını paylaşmaya devam eder — kalıbı büyütmek körlüğü taşır, kaldırmaz.
- **(b) Denetim tablodan beslenir + ayrı iddia dalı.** `REPLACEMENTS`/`INITIALS` tablosundaki **her adın her parçası** yasaklı sözcük olur (tablo adları zaten biliyor); iddia sızıntısı için ayrı bir sözlük dalı açılır.

**Seçilen: (b).** Tablo kaynağın gerçeğidir, regex bir tahmindir.

**3. Yasaklı iddia sözlüğünün evi (B-018 → M6 F6.4 devri)**

Ölçülmüş kısıt: araştırma konteyneri **yalnız `research/`'ü görüyor** (`docker-compose.yml` → `research` servisi, tek bağlama `./research:/work`); `web` konteyneri ise deponun tamamını görüyor (`.:/app`). Yani iki konteynerin **ortak gördüğü tek dizin `research/`**.

- **(a) `research/lib/` altında tek dosya** — render hattı doğrudan import eder, ileride `tests/` ve F6.4 metin denetimi aynı dosyayı `web` konteynerinden okur.
- **(b) `src/lib/` altında** — render hattı erişemez (mount yok).
- **(c) İki kopya** — tanım gereği drift kaynağı.

**Seçilen: (a).** Tek dosya, iki tüketici, bağlama değişikliği gerekmez.

**4. Yasal beyan testinin çapraz-depo dalı (B-060)**

"12 ay" saklama süresinin mekanizması komşu depoda (`../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` → `RETENTION_MONTHS = 12`) ve **`web` konteyneri o yolu görmüyor** (ölçüldü: `/app/../Alpfitplus-website.v1` yok). v1'in kendi testi bu dosyayı göreli yolla okuyabiliyordu çünkü orada aynı depodaydı; v2'de değil.

- **(a) Sabiti v2'ye kopyala** — bulgunun şikâyet ettiği tekrarın ta kendisi.
- **(b) Salt-okunur bağlama + env kapısı.** `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:ro` bağlanır; test dalı bir env anahtarıyla açılır, anahtar tanımsızsa **atlanır**. Depo sözleşme paketinin (`tests/lead-store.contract.test.ts`) zaten kurduğu desen.
- **(c) Yerel depo konteynerinin API'sinden oku** — `lead-store` profili ayakta olmalı; `npm test`'i ayakta bir servise bağlar.

**Seçilen: (b).** Projenin kendi kurduğu desen; komşu depo yokken `npm test`'in geri kalanı etkilenmez.

**5. Mobil onay ve hata görünürlüğü (B-055 f/g ayakları)**

`src/app/globals.css:124` zaten `scroll-padding-top: 5.5rem` (88 px) taşıyor ve yapışkan başlık `h-17` (68 px) — yani **offset altyapısı kurulu**. Eksik olan kaydırmanın kendisi: gönderim başarılı olunca form (`state === "ok"` dalında) tamamen değişiyor, sayfa kısalıyor ve tarayıcı `scrollY`'yi olduğu yerde bırakıyor; hiç kaydırma olmadığı için `scroll-padding-top` hiç devreye girmiyor.

- **(a) Her sonuç öğesine `scroll-margin-top`** — mevcut genel ayarı yerelde ikizler; iki yerden yönetilen bir offset doğar.
- **(b) Durum değişiminde açık odak taşıma** (`tabIndex={-1}` + `focus()`); odak kaydırması `scroll-padding-top`'u zaten onurlandırır.

**Seçilen: (b).** Tek mekanizma, hem onay hem hata kutusu için aynı; (g) ayağı (başlığın h1'i örtmesi) aynı hamlede kapanır.

**6. KVKK başvuru adresinin posta alması (B-011)**

İki geçerli Google Workspace kaydı var: klasik beş kayıtlı küme ve tek kayıtlı modern küme (`smtp.google.com`, öncelik 1). **Seçilen: klasik beş kayıtlı küme** — bu hesapta bugün çalıştığı ölçüldü (`kiwiailab.com` → `1 aspmx.l.google.com` + `5 alt1/alt2` + `10 alt3/alt4`), yani hedef kayıt kümesi tahmin değil kopya.

---

### Kullanılacak Araçlar/Kütüphaneler

**Yeni bağımlılık yok.** Fazın tamamı kurulu araçlarla yapılır:

- **Vitest 4** (`package.json`, `vitest.config.ts` → `environment: "node"`) — yasal beyan testi (B-060) ve onay e-postasının sözleşme sınaması. `npm test` `web` konteynerinde koşar.
- **Playwright** (araştırma konteyneri, `Dockerfile.research`) — B-055 ve B-034 düzeltmelerinin ölçümü ve `render-product.mjs`. Betik scratchpad'e yazılıp `-v` ile bağlanır, `research/`'e kalıcı dosya bırakılmaz (`memory/arastirma-konteynerinde-tarayici-olcumu.md`).
- **Tailwind CSS 4'ün `aria-invalid:` varyantı** — hatalı alanın görsel işareti için (B-055 (a) ayağı). Yeni seçici ya da eklenti gerekmez; renk `neg` / `neg-wash` tokenlarından gelir ve kontrastı `a11y.mjs` ile ölçülüp CSS yorumuna rakamıyla yazılır (STYLE-GUIDE geleneği).
- **DNS over HTTPS** (`curl` + `dns.google` / `cloudflare-dns.com`) — MX doğrulaması. Sandbox'ta doğrudan UDP DNS kapalı, `dig` sessiz boş döner (B-011 atomunda ölçülmüş yöntem).
- **`openssl rand -hex 32`** — anahtar döndürme gerekirse (bkz. Teknik Kararlar → anahtar kapsamı).
- **Resend API** — onay e-postası aynı uçtan gider (`src/app/api/demo/route.ts` → `toEmail`), ek kütüphane yok.

---

### Dikkat Edilecekler

**Devralınan daralmaların ölçümü** — üç iddia sınandı, üçü de kapsamı genişletti:

- **"Beş karşılıksız yetenek iddiası" bir taban, tavan değil.** Sınıfın kendisi ölçüldü: `src/content/product.ts` 10 modül × ~5 madde + 11 blurb, 4 rol × 5 madde + özet, 8 fayda; `src/content/segments.ts` 32 iddia bloğu — **~124 present-tense yetenek cümlesi**. B-029 beşini yanlış buldu, dördünü doğruladı, kalanı hiç kontrol edilmedi. Somut örnek: B-029'un 1. kalemi ("ölçüm grafiği + diyetisyen notu tek ekranda") `product.ts:129/133/135` olarak sayılmış; aynı yeteneği `product.ts:23-24` (üye rolü maddeleri) ve `chat.ts:97` de **present-tense** anlatıyor ve bunlar listede yok. Kapsam kararı: risk alt kümesi taranır (→ Teknik Kararlar).
- **"Üç yasal beyan" da taban.** `src/content/legal.ts` satır satır okundu: koda/konfige bağlı **en az sekiz** olgu iddiası var. B-060'ın saydığı üçü (`:129` 12 ay · `:203` soru işareti · `:302` gerçek kişi verisi) + beş tane daha: `:100` "sitenin anahtarı yalnız yeni kayıt oluşturabilir, var olan kayıtları okuyamaz" ve "dışarıya açık okuma kuralları kapalı" · `:116` "ölçüm için üçüncü bir tarafa veri göndermiyoruz" · `:195` "çalışması için gerekli olmayan hiçbir çerez yerleştirmez" · `:203` "adınız, telefonunuz, e-postanız ve mesajınız ölçüme gönderilmez" · `:157`/`:234` "otuz gün içinde sonuçlandırılır" (dayanağı B-011'in kendisi — adres posta almıyorsa taahhüt boştur). Faz sekizinin tamamını bağlar (kullanıcı kararı). **Milestone'un "dört beyan" ifadesi bu yüzden alt sınırdır**, hedef küçülmüyor büyüyor.
- **B-034 sınıfı gerçekten tek örnek, ama mekanik kural yanlış kurulursa dört yanlış alarm verir.** Bulgunun koruma önerisi "kırılım öneki taşımayan `flex-1`'i `flex-col` kabında ara" diyor; ölçüldü: depoda yedi `flex-1` var, beşi kırılımsız ve **dördü meşru** (`SegmentsGrid.tsx:50,54` kart gövdesi yüksekliği · `Assistant.tsx:167` akış alanı · `ProductStory.tsx:200` satır kabında genişlik · `Assistant.tsx:150` satır kabında genişlik). Ayırt edici imza dar: **sabit yükseklik sınıfı (`h-*`) + `flex-1` + kolon kabı**. Kural bu imzayla yazılmazsa gürültü üretir.

**Anahtar sızıntısının kapsamı ölçüldü — döndürme bir ölçüme bağlandı.** `.env`'in beş değeri değer basılmadan parmak izlendi (SHA-256 önekleri): `LEAD_STORE_URL` yerel konteyneri gösteriyor (`lead-store:8090`, canlı depo değil), `LEAD_STORE_TOKEN` ile `LEAD_TOKEN_PREVIEW` **bayt bayt aynı**, `LEAD_TOKEN_PRODUCTION` ayrı bir 64-hex. `tasks/archive/TASK-1.17.md:146` bu iki token'ın bu makinede `openssl rand -hex 32` ile üretildiğini yazıyor; `tasks/archive/TASK-1.18.md:150,184` canlı `IP_HASH_SALT`'ın Vercel'e **boru içinden** girildiğini ve hiçbir yere kaydedilmediğini yazıyor. Üçü birlikte şunu söylüyor: **imaja giren beş değerin hiçbiri canlı değil.** Tek üretim imajı bugün 15:30'da derlendi (TASK-1.18'den sonra) ve makineden çıkmadı. ⚠️ Kesin teyit, sunucudaki `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PREVIEW` / `LEAD_TOKEN_PRODUCTION` değerlerinin **parmak iziyle** karşılaştırılmasıdır (tek satır, hiçbir değer görünmez; sunucu kuralları `../altyapi/vps/CLAUDE.md`). Milestone'un "iki anahtar döndürülmüş" ayağı bu karşılaştırmaya bağlıdır: eşleşmezse döndürme düşer ve ayak o gün yeniden yazılır (kullanıcı kararı, research 2026-09-22).

**Ad temizliğinde sıra tuzağı.** B-018'in "Gizem Ö." ve "Simge & Gizem" kalemleri için tabloya çıplak ilk ad eşlemeleri girecek. `REPLACEMENTS` düz metin değişimidir: "Gizem" → "Yasemin" kuralı "Gizem Örge" kuralından **önce** koşarsa sonuç "Yasemin Örge" olur. Eşlemeler **en uzun önce** sıralanmalı, ve düşürme (`DROP_NODES`) zaten değişimden önce koştuğu için düşen düğümlerdeki adlar hiç görülmez (`render-product.mjs` içi yorum).

**İddia sözlüğü demo verisini de vuracak.** `₺…B/ay`, `+%NN`, "en hızlı", "rekor" kalıpları ürün ekranlarının **meşru** gösterge verisine de değebilir (finans ekranı ciro gösterir — bu ürünün işlevidir, iddia değil). Ayraç: **projeksiyon / üstünlük / büyüme kıyası** yasak, nötr gösterge değeri serbest. Ekran bazlı izin listesi (`AUDIT_ALLOW` deseni) bu ayrımı taşır; kapı önce boş izin listesiyle koşulup raporladığı her kalem kaynakta aranır (v2 tablosunun `grup`/`sube` için kurduğu yöntem, `screen-cleanup-v2.mjs:63-88`).

**Düşürülecek yol haritası kalemleri `src/content/`'ten beslenemez.** B-018'in koruma önerisi temizliğin "Yolda" listesinden beslenmesini istiyor; araştırma konteyneri `src/`'i görmüyor (yukarıda ölçüldü) ve `src/content/*.ts` TypeScript. Bu fazda kalemler `research/lib/` içinde elle tutulur; listeyi kaynaktan beslemek bağlama değişikliği ya da üretilmiş bir JSON ara katmanı ister — o iş bu fazda **açılmaz**, kaydı burada durur.

**"Kampanyalar" ortak kabuktadır, ekran başına değil.** Kaynak HTML'lerde altı dosyada birer geçiş (`cockpit`, `takvim`, `grup`, `finans`, `antrenor`, `raporlar`, `uye`), hepsi sol menüde `<a>` olarak; `uye-telefon` çıktısı `takvim.html`'in `.phone` kökünden üretildiği için menüyü taşımaz. Düşürme kuralı ekran başına tekrarlanmak yerine ortak kabuk kuralı olarak yazılmalı. `"Yenileme & Churn"` tek yerde: `../Alpfit.v1/demo/raporlar.html:242`.

**Tarayıcı katmanı bu fazda otomatik ölçülmüyor — bilinçli.** Fazın çekirdek teslimlerinden ikisi (B-055 mobil onay/hata, B-034 dokunma hedefi) gerçek tarayıcı yerleşimi ve odağıyla belirlenir; projenin otomatik katmanı (`vitest`, `environment: "node"`) bu katmanı **ölçmüyor** ve `mobile-audit.mjs` etkileşim durumuna hiç bakmıyor. Kalıcı tarayıcı betiği kapsam kararıyla "Kalite kapıları otomatik" fazına bırakıldı (→ Kapsam Dışı). Bu fazda doğrulama kanalı: düzeltme sırasında scratchpad'e yazılan geçici Playwright betiğiyle **rakamlı ölçüm** (320/360/390/412 genişlik × hata türleri × onay yolu), UAT'ta ise manuel kol. Task test kriterleri bu kanala göre yazılır.

**Tanımlayıcı kaynakları** (plan ve verify-plan bunu buradan okur):

| Tanımlayıcı | Kaynak |
|---|---|
| Yetenek/yol haritası sabiti | **yeni** — `src/content/product.ts` |
| Yasaklı iddia sözlüğü dosyası | **yeni** — `research/lib/` altında |
| `RETENTION_MONTHS` | **dış** — `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` |
| Yasal beyan testinin env kapısı | **yeni** — `.env.example`'a slot adı eklenir, değer yazılmaz |
| `data-exclude-search` | tanımlı — `src/app/layout.tsx:181` |
| `scroll-padding-top: 5.5rem` | tanımlı — `src/app/globals.css:124` |
| `ERROR_ID` (`demo-form-error`), `FIELD_ERRORS`, `aria-invalid` | tanımlı — `src/components/sections/DemoForm.tsx:20-28, 203-204, 286-301` |
| `SURFACES.demoForm`, `track()` | tanımlı — `src/lib/analytics.ts` |
| `REPLACEMENTS` · `INITIALS` · `DROP_NODES` · `AUDIT_ALLOW` · `auditTexts` | tanımlı — `research/lib/screen-cleanup-v2.mjs` |
| `SCREENS` (7 çıktı, 6 kaynak HTML) | tanımlı — `research/scripts/render-product.mjs:23-43` |
| `notify_lead` / `notify_team` | **dış** — depo şeması, v1 `pocketbase/pb_hooks/` |
| `LEAD_STORE_URL` · `LEAD_STORE_TOKEN` · `IP_HASH_SALT` · `LEAD_TOKEN_PREVIEW` · `LEAD_TOKEN_PRODUCTION` | tanımlı slot adları — `.env.example` §1, §3 (değer yok) |
| Sunucudaki karşılaştırma kaynağı | **dış** — `/opt/alpfit-lead/.env` (salt okuma) |
| Hedef MX kayıtları | **dış** — Squarespace DNS bölgesi; referans küme `kiwiailab.com` |

---

### Teknik Kararlar

- **Yetenek listesi `src/content/product.ts`'te üç kademeli tek sabit olur; beş ev oradan okur.** Gerekçe: tüketicilerin dördü kalemleri düzyazıda virgülle bağlıyor (ölçüldü), yani liste → düzyazı türetmesi kayıpsız. `PRODUCT_STATUS.modules` de aynı listeden türer — B-040'ın "dört evde ayrışmış" ve "8/10 modül" kalemleri böylece aynı hamlede kapanır. `fiyat` sayfasının "(yol haritasında)" ekli iki kalemi listenin alt kümesidir, kendi metnini yeniden yazmaz.
- **Kapsam: liste + riskli alt küme taraması** (kullanıcı kararı, research 2026-09-22). Ürün deposunun kendi "Yakında / v1.5 / W8 / ertelendi" notlarından konu sözcükleri çıkarılır ve sitede o konulara değen cümleler taranır. ~124 cümlenin tamamının doğrulanması **bu fazda yapılmaz**; ölçüm ve gerekçesi yukarıda, kalan yüzey kanvasta durur.
- **Görsel denetimin ad dalı temizlik tablosundan beslenir, kalıptan değil**; ikinci bir dal olarak yasaklı iddia sözlüğü eklenir ve sözlük `research/lib/` altında **tek dosyada** yaşar. Gerekçe: `research/` iki konteynerin ortak gördüğü tek dizin (ölçüldü), yani M6 F6.4'ün metin denetimi aynı dosyayı devralabilir.
- **Yasal beyan testi sekiz olgunun tamamını bağlar** (kullanıcı kararı). Yedisi depo içinden doğrulanır; "12 ay" dalı komşu depoya salt-okunur bağlamayla ve **env kapısıyla** gelir — anahtar tanımsızken dal atlanır, `npm test`'in geri kalanı etkilenmez (`tests/lead-store.contract.test.ts`'in kurduğu desen).
- **`notify_lead` artık gerçek sonucu taşır** (kullanıcı kararı): gönderildi / gönderilemedi / ziyaretçi e-posta vermedi. Gerekçe: 2026-09-14 «Bildirim durumu» kararının dayanağı *"v2 talep sahibine e-posta göndermiyor"* idi; onay e-postası bu fazda açıldığı için dayanak düştü ve alanın kalıcı `pending` kalması alan adı geçişinden sonra iki dönemin kaydını okunamaz kılardı. Karar `docs/DECISIONS.md`'ye yeni kayıt olarak yazılır, eskisi geçersiz kılınır.
- **Anahtar döndürme sunucudaki parmak izi karşılaştırmasına bağlandı** (kullanıcı kararı). `.dockerignore` düzeltmesi ve `web-prod`'a bilinçli env verilmesi **koşulsuz** yapılır; döndürme yalnız karşılaştırma canlı değer gösterirse yapılır. Gerekçe ve ölçüm → Dikkat Edilecekler.
- **Mobil onay/hata görünürlüğü tek mekanizmayla çözülür:** durum değişiminde sonuç öğesine odak taşınır (`tabIndex={-1}` + `focus()`); mevcut genel `scroll-padding-top` offseti zaten uygular, yeni bir `scroll-margin-top` **eklenmez**.
- **MX kaydı olarak klasik beş kayıtlı Google kümesi girilir** (`kiwiailab.com`'da bugün çalıştığı ölçüldü). DNS adımı kullanıcıdadır; faz yönergeyi yazar, kaydı DoH ile ölçer ve **gerçek bir test postasıyla** doğrular.
- **B-034 düzeltmesi iki satırdır** (`flex-1` → `sm:flex-1`, `PriceCalculator.tsx:164,167`); mekanik kural eklenecekse imza "sabit yükseklik + `flex-1` + kolon kabı" olur, yalnız "kırılımsız `flex-1`" değil (dört yanlış alarm ölçüldü).

---

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda doldurulur.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| — | Henüz planlanmadı | — | `/devflow:plan-phase` dolduracak |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## UAT Sonuçları

> Bu bölüm `/devflow:verify-phase` oturumunda doldurulur.

**Tarih:** [tarih]
**Toplam Senaryo:** X | **Geçen:** Y | **Kalan:** Z

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ✅/❌ | [not] |

---

## Retrospektif

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

### Ne İyi Gitti?
- [Tekrarlanması gereken pratikler]

### Ne Kötü Gitti?
- [Sorunlar ve darboğazlar]

### Sonraki Faz İçin Öneriler

<!-- Alınan dersler ve tavsiyeler. Memory'den MEZUN EDİLEN öğrenimlerin çapalı tek satırlık kaydı da buraya düşer ("<öğrenim> artık <test/lint/CI/validator/guard> tarafından yakalanıyor — memory'den mezun edildi") — kanon: .claude/commands/devflow/lib/memory-sistemi.md → Supaplar. Kayıt faz ✅ damgalanmadan ÖNCE yazılır. -->
- [Alınan dersler, tavsiyeler]

### Task-Spesifik Teknik Öğrenimler

<!-- OPSİYONEL: Bu fazdaki task'larda öğrenilen ama proje genelinde geçerli olmayan teknik nüanslar (araç davranışı, framework bug'ı, vb.). MEMORY.md'nin değil, faz retrosunun evidir. Bu fazda böyle bir nüans çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

### DevFlow'a Öneri

<!-- OPSİYONEL: Bu fazda fark edilen, DevFlow yönteminin geneline dair (proje-özel OLMAYAN) iyileştirmeler — aracın kendisinin nasıl çalışması gerektiği. Buraya yazılır + kullanıcıya bildirilir; DevFlow'a ayrı oturumda taşınır. Disiplin çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

---

## Kalite Kontrol Sonuçları

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

| Eksen | Durum | Not |
|-------|-------|-----|
| Modülerlik | ✅ / ⚠️ / ❌ | ... |
| Güvenlik | ✅ / ⚠️ / ❌ | ... |
| Bakım Maliyeti | ✅ / ⚠️ / ❌ | ... |
| Performans | ✅ / ⚠️ / ❌ | ... |
| Hata Yönetimi | ✅ / ⚠️ / ❌ | ... |
| Test Kapsamı | ✅ / ⚠️ / ❌ | ... |
| Erişilebilirlik | ✅ / N/A | ... |

---

**Oluşturulma:** 2026-09-22
