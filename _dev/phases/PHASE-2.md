# Phase 2: Yayın öncesi düzeltmeler

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-2.md`) faz HÂLÂ AKTİFKEN `PHASE-2-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-2 · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder. -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). -->

---

**Bölme çocukları** (faz hâlâ aktifken bölündü; parent bu fazın mini-index'idir):
`PHASE-2-ARASTIRMA.md` — araştırma-detayı · `PHASE-2-UAT.md` — uat

---

## Genel Bilgiler

**Amaç:** Alan adı geçişinden önce sitenin ziyaretçiye söylediği her şeyi ölçülmüş gerçeğe hizalamak: yetenek iddiaları, ürün görselleri, yasal metinler ve KVKK başvuru adresi. Aynı fazda huninin son metresi kapanır (mobilde onay ve hata görünür hâle gelir, talep sahibi onay e-postası alır) ve üretim imajına sızan sırlar çıkarılır. Faz, yayın anına "site doğruyu söylüyor ve talep kaybolmuyor" diyerek girilebilmesi için vardır.

**Milestone:** Site ürünün bugün yapamadığı hiçbir şeyi "var" diye anlatmıyor ve beş cümlenin dayanağı `src/content/`'te **tek bir yetenek listesi**; ana sayfada render edilen ürün görselinde gerçek kişi adı ve olmayan özellik yok, hattın denetimi bir sonraki sızıntıyı kendisi yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor (IP özeti ve saklama süresi, onay kapsamı, ölçüm sunucusunun gerçeği) ve dört beyanı bir test çiviliyor; üretim imajında `.env` yok, yerel üretim provası neye bağlandığını açıkça söylüyor ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü — döndürme gerekmedi; 320-412 px'te demo formunun onayı **ve** hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.

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
| F7.1: Docker çalışma ortamı | M7-Yayın ve Altyapı | **B-058** — `.env` üretim imajı katmanında; yerel üretim provasının hedefi sessiz. Döndürme ayağı ölçümle düştü (TASK-2.01: eşleşme yok) |
| F7.5'in ön koşulu — **kapsam dışına alındı (2026-09-23)** | M7-Yayın ve Altyapı | **B-011** — apex'te MX kaydı yok, KVKK başvuru adresi posta alamıyor. Fazın ürettiği ölçülmüş zemin (Squarespace yönergesi, bozulmama tabanı, bugünkü başarısızlık biçimi) bulgunun atomuna mezun edildi; işin kendisi alan adı geçişi fazına taşındı |

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
- **B-058'de iki anahtar döndürülür.** `.dockerignore` düzeltilir (`.env` ve `.env.*`, `!.env.example` istisnasıyla), `web-prod`'a **bilinçli** env verilir ki yerel prova neye bağlandığını söylesin, ve iki değer yenilenir: IP tuzu (ölçüldü — v1'in değeri değil, TASK-1.18'de v2 için üretilmiş rastgele; döndürmenin v1 kayıtlarıyla süreklilik bedeli yok, tek etkisi v2'nin 15 test kaydının IP kimliği bağının kopması) ve lead deposunun **önizleme** token'ı (sunucuda bir işlem; v1'in canlı akışı üretim token'ını kullandığı için etkilenmez). Kalan üç değer **beyana göre** yerel ya da gizli-olmayan — ⚠️ bu beyan ölçülmedi: `.env`'deki `LEAD_TOKEN_PRODUCTION` gerçekten yerel depo kopyasının token'ı mı, yoksa canlı üretim token'ı mı? Canlı değer oradaysa döndürme kapsamı üçe çıkar ve v1'in canlı lead akışı da ilgilenir. Ölçüm fazın ilk işlerinden biri (`docs/DECISIONS.md` 2026-09-22 → açık kalem). **→ Ölçüldü (TASK-2.01, 2026-09-22): sunucu↔yerel parmak izi eşleşmedi, yani imaja giren hiçbir değer canlı değil — döndürme ayağı düştü, TASK-2.03 iptal edildi ve milestone o ayağı ölçümü anacak şekilde yeniden yazdı (plan revizyonu 2026-09-23).**
- **B-055 tam kapanır, yarım değil.** Altı ayak: onay ve hata her telefonda görünür (odak oraya taşınır, yapışkan başlığın arkasına düşmez) · hata metni ilgili alanın hemen altında · hatalı alan görsel işaret alır · odak hata türüne göre doğru alana gider (eksik alanda boş olana, bozuk alanda bozuk olana) · eşlenmeyen kodlar ve ağ hatası hata kutusuna odaklanır · gönderim başında eski hata işaretleri sıfırlanır.
- **B-059'un e-posta ayağı bu faza alındı.** Faz 1'in kapanışı ekran onayı (B-055) ile onay e-postasının yokluğunu **tek dikiş** olarak işaretlemişti: ikisi üst üste geldiğinde ziyaretçi talebinin ulaştığını hiçbir kanaldan öğrenemiyor. Ekran onayı bu fazda düzeldiği için e-posta ayağı da burada kapanır — altyapı kurulu (Resend, doğrulanmış alan adı), iş küçük, ve alan adı geçişinde v1'e göre gerileme doğmaz. B-059'un kalan ayakları (depo alanlarının kalıcı `pending` hâli, yasal metnin v1'den az bilgi vermesi) geçiş fazının parite listesinde kalır.
- **KVKK başvuru adresinin posta alması bu fazdan çıktı ve "Alan adı geçişi" fazına taşındı** (kullanıcı kararı, yeniden tartışma 2026-09-23). Fazın repo tarafında yapılacak iş kalmamıştı; kalan tek kalem (B-011) beş MX kaydının Squarespace'te girilmesine, yani **kullanıcı tarafındaki bir adıma** bağlıydı. ILKELER'in pazarlıksız maddesi bunu emrediyor: *"proje-dışı bir aktöre bağlı iş hiçbir versiyonun ya da fazın bitişini kilitlemeyecek şekilde yerleştirilir; `BULGULAR.md`'de açık iş olarak durur."* Hedef faz keyfi değil — B-011 bu fazın kendi feature tablosunda zaten **F7.5'in ön koşulu** olarak yazılıydı, ve otuz gün taahhüdü ancak site `alpfitplus.com`'a bağlandığında birine görünür hâle gelir: bugün site noindex bir önizleme adresinde ve alan adını hâlâ v1 sunuyor. Milestone'un *"`destek@alpfitplus.com` test postası alıyor"* ayağı bu yüzden **düştü** — bu bir ad kayması değil kapsam kararıdır, yani faz ortasında sessizce daraltılmadı, kullanıcıya sunuldu ve onunla karara bağlandı. Fazın ürettiği ölçülmüş zemin kaybolmuyor: Squarespace yönergesi, bozulmama tabanı tablosu ve bugünkü başarısızlık biçimi (örtük MX) B-011'in atomuna mezun edildi; TASK-2.20 ❌ iptal edildi ve arşive gitti.

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
- **KVKK başvuru adresinin posta alması (B-011)** → **"Alan adı geçişi" fazı** (yeniden tartışma 2026-09-23, kullanıcı kararı). Kullanıcı tarafındaki DNS adımına bağlı, ILKELER gereği fazı kilitlemez. O faz sıfırdan başlamaz: beş MX kaydının hangi ekrandan nasıl gireceği, TXT/NS/SOA bozulmama tabanı ve bugünkü başarısızlık biçimi bulgunun atomunda ölçülmüş hâliyle duruyor — ayrıca Google tarafında kutunun açık olması gereken **ikinci** kullanıcı adımı da orada yazılı (MX postayı yönlendirir, kutuyu açmaz).
- **Ürün görsellerinin tam sızıntı envanterinin kalan kalemleri (B-044)** → bu fazda yalnız B-018'in üç kalemi ve denetimin iddia dalı kapsamda; B-044'ün avatar-ad uyumsuzlukları ve Hero'daki elle yazılmış "%78" kalemi kanvasta kalır.

---

## Araştırma Bulguları

> `/devflow:research-phase` oturumunda dolduruldu (2026-09-22). Ölçümler bu makinede, çalışan konteynerlere ve komşu depolara karşı yapıldı.
>
> **Bölme çocuğu:** `PHASE-2-ARASTIRMA.md` — altı yaklaşımın tam karşılaştırması (elenen seçenekler ve gerekçeleriyle) ve ölçülmüş tuzakların tam listesi (araştırma-detayı).

### Seçilen Yaklaşımlar — özet

Tam karşılaştırma (elenenler, artı/eksi, ölçüm çıktıları) → `PHASE-2-ARASTIRMA.md`. Seçilenler:

1. **Yetenek iddiaları (B-029 · B-040):** `src/content/product.ts`'te üç kademeli **tek sabit** + ürünün kendi "bugün yok" işaretlerinden türeyen **riskli alt küme taraması** ((a)+(c)). ~124 cümlenin tamamını yetenek kimliğine bağlamak ((b)) reddedildi — bu faz iddianın doğruluğunu düzeltir, içerik mimarisini yeniden kurmaz.
2. **Görsel denetim (B-018):** denetimin ad dalı **temizlik tablosundan** beslenir, regex'ten değil — *tablo kaynağın gerçeğidir, regex bir tahmindir*.
3. **Yasaklı iddia sözlüğünün evi:** `research/lib/` altında **tek dosya**. Ölçülmüş kısıt: araştırma konteyneri yalnız `research/`'ü görüyor, `web` konteyneri deponun tamamını — ikisinin ortak gördüğü tek dizin `research/`. M6 F6.4'ün metin denetimi aynı dosyayı devralır.
4. **Yasal beyan testi (B-060):** "12 ay" dalı komşu depoya **salt-okunur bağlama + env kapısıyla** gelir; anahtar tanımsızken dal atlanır ve `npm test`'in geri kalanı etkilenmez (`tests/lead-store.contract.test.ts`'in kurduğu desen). Sabiti v2'ye kopyalamak reddedildi.
5. **Mobil onay/hata (B-055):** durum değişiminde **açık odak taşıma** (`tabIndex={-1}` + `focus()`); mevcut `globals.css:124` → `scroll-padding-top: 5.5rem` offseti zaten uygular, ikinci bir `scroll-margin-top` **eklenmez**.
6. **MX kaydı (B-011):** klasik beş kayıtlı Google kümesi — bu hesapta bugün çalıştığı ölçüldü (`kiwiailab.com`), yani hedef küme tahmin değil kopya.

**Yeni bağımlılık yok.** Fazın tamamı kurulu araçlarla yapılır: Vitest 4 (`web` konteynerinde), Playwright (araştırma konteyneri), Tailwind 4'ün `aria-invalid:` varyantı, DoH (`curl` + `dns.google`/`cloudflare-dns.com` — sandbox'ta `dig` sessiz boş döner), `openssl rand -hex 32`, Resend API. Sürüm ve kullanım detayı → çocuk doküman.

### Ölçümün Genişlettiği Sınırlar — özet

Üç devralınan daralma sınandı, üçü de kapsamı genişletti; tam ölçümler çocukta:

- **"Beş karşılıksız yetenek iddiası" bir taban, tavan değil** — sınıf ~124 present-tense yetenek cümlesi (`product.ts` + `segments.ts`). B-029 beşini yanlış buldu, dördünü doğruladı, **kalanı hiç kontrol edilmedi**. Kapsam kararı: riskli alt küme taranır.
- **"Üç yasal beyan" da taban** — `legal.ts`'te koda/konfige bağlı **en az sekiz** olgu iddiası var. Faz sekizinin tamamını bağlar (kullanıcı kararı); **milestone'un "dört beyan" ifadesi alt sınırdır.**
- **B-034 sınıfı tek gerçek örnek** ama mekanik kural yanlış kurulursa beş yanlış alarm verir; ayırt edici imza dar: sabit yükseklik (`h-*`) + `flex-1` + kolon kabı.
- **Anahtar sızıntısının kapsamı ölçüldü** — `.env`'in beş değeri parmak izlendi, üçü birlikte **imaja giren hiçbir değerin canlı olmadığını** söylüyor. Kesin teyit sunucudaki `/opt/alpfit-lead/.env` karşılaştırmasıdır; milestone'un "iki anahtar döndürülmüş" ayağı o sonuca bağlıydı (kullanıcı kararı → `docs/DECISIONS.md`). **Ölçüldü (TASK-2.01): eşleşme yok — döndürme düştü, ayak yeniden yazıldı.**
- **Tarayıcı katmanı bu fazda otomatik ölçülmüyor — bilinçli.** Projenin otomatik katmanı (`vitest`, `environment: "node"`) B-055 ve B-034'ün belirleyici katmanını ölçmüyor; `mobile-audit.mjs` etkileşim durumuna hiç bakmıyor. **Bu fazda doğrulama kanalı:** düzeltme sırasında scratchpad'e yazılan geçici Playwright betiğiyle rakamlı ölçüm, UAT'ta manuel kol. **Task test kriterleri bu kanala göre `kanal: UAT` işaretlidir.**

### Teknik Kararlar — özet

Gerekçelerin tam metni → `PHASE-2-ARASTIRMA.md` → Teknik Kararlar.

- Yetenek listesi `product.ts`'te üç kademeli tek sabit; beş ev ondan okur, `PRODUCT_STATUS.modules` de aynı listeden türer (B-040'ın iki kalemi aynı hamlede kapanır).
- Görsel denetimin ad dalı tabloyla, iddia dalı `research/lib/` altındaki tek sözlükle beslenir.
- Yasal beyan testi sekiz olgunun tamamını bağlar; yedisi depo içinden, "12 ay" dalı env kapısıyla.
- **`notify_lead` artık gerçek sonucu taşır** (kullanıcı kararı): 2026-09-14 «Bildirim durumu» kararının dayanağı düştü, yeni kayıt `docs/DECISIONS.md`'ye yazılır.
- Anahtar döndürme sunucudaki parmak izi karşılaştırmasına bağlandı; `.dockerignore` düzeltmesi ve `web-prod`'a bilinçli env **koşulsuz**.
- Mobil onay/hata tek mekanizmayla: odak taşıma; yeni `scroll-margin-top` eklenmez.
- B-034 düzeltmesi iki satır (`flex-1` → `sm:flex-1`, `PriceCalculator.tsx:164,167`).
- MX olarak klasik beş kayıtlı Google kümesi; DNS adımı kullanıcıda, faz ölçer ve **gerçek test postasıyla** doğrular.

### Tanımlayıcı Kaynakları

<!-- KURAL: Bu tablo plan ve verify-plan'ın referans gerçeklik-kontrolünün tabanıdır — bölme çocuğuna taşınmaz, parent'ta kalır. -->

| Tanımlayıcı | Kaynak |
|---|---|
| Yetenek/yol haritası sabiti | **yeni** — `src/content/product.ts` |
| Yasaklı iddia sözlüğü dosyası | **yeni** — `research/lib/` altında |
| `RETENTION_MONTHS` | **dış** — `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` |
| Yasal beyan testinin env kapısı | **yeni** — `.env.example`'a slot adı eklenir, değer yazılmaz |
| `data-exclude-search` | tanımlı — `src/app/layout.tsx:182` |
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

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda doldurulur.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->
<!-- KURAL: Bu tablo 2026-09-23'te (TASK-2.15) bir kez TEMİZLENDİ — tetik ölçümdü: doküman 20.399 token ile kırmızı çizgiyi aştı ve bölümün kendisi 7.561 token tutuyordu (20 satır, satır başına ~378). Teşhis (a) şişme: satırlar yukarıdaki kuralın yasakladığı icra detayını taşıyordu (sonda dökümleri, yöntem tartışmaları, dosya/satır kanıtı). İçerik SİLİNMEDİ — kanonik evi her task'ın `tasks/archive/TASK-2.NN.md` dokümanıdır ve on dördünün de orada olduğu doğrulandı. Bölme YAPILMADI, çünkü kanon snapshot tablosunun yerinde kalmasını emrediyor (CLAUDE.md → Boyut ve Bölünme, faz dokümanı hibrittir). Satır yazarken ölçü: ne kapandı + belirleyici rakam; sonda dökümü ve yöntem gerekçesi task dokümanına. -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 2.01 | TASK-2.01 | ✅ Tamamlandı | Sunucu ölçümü (keşif ayağı): nginx erişim kaydının bugünkü hâli + `.env` parmak izi karşılaştırması. B-024 ve B-058'i besledi; sonucu TASK-2.03'ü düşürdü |
| 2.02 | TASK-2.02 | ✅ Tamamlandı | `.dockerignore` düzeltildi, `web-prod` üç kayıt yolunun baş anahtarını açıkça boş alıyor; üretim imajında `.env` yok, uç `503 no-sink`. **B-058 kapandı** (kalıcı kapı M6 F6.2'ye devredildi) |
| 2.03 | TASK-2.03 | ❌ İptal | İki anahtarın döndürülmesi — ön koşul ölçümle düştü: sunucu↔yerel parmak izi eşleşmedi, döndürülecek canlı anahtar yok (plan revizyonu 2026-09-23) |
| 2.04 | TASK-2.04 | ✅ Tamamlandı | Fiyat sayfasının mobil ana çağrısı 24 → **52 px** (`flex-1` → `sm:flex-1`, iki satır); dört genişlikte 0/8 → 8/8, altı rotada 0/12 → 12/12. **B-034 kapandı** |
| 2.05 | TASK-2.05 | ✅ Tamamlandı | Gönderim sonrası odak sonuç yüzeyine taşınıyor: onay kutusu altı genişlikte de 88 px'te (taban 2/6 → 6/6), odak tablosu 54/54. B-055'in (b) ayağının alana eşlenen yarısı 2.06'ya kaldı |
| 2.06 | TASK-2.06 | ✅ Tamamlandı | Hatalı alan kendi üstünde görünür: `aria-invalid` halkası + alan altı hata metni; kontrol gruplu ölçümde alan farkı 0/16 → 8/8, alan düğümü 0/36 → 28/28. **B-055 kapandı** |
| 2.07 | TASK-2.07 | ✅ Tamamlandı | Talep sahibine onay e-postası açıldı ve `notify_lead` gerçek sonucu taşıyor; yerel depoya karşı gerçek turda iki e-posta da `delivered`, uç 575 ms. **B-059'un iki ayağı kapandı** (atom açık) |
| 2.08 | TASK-2.08 | ✅ Tamamlandı | Yetenek/yol haritası tek kaynağı kuruldu: `product.ts` → `CAPABILITIES` (`simdi` 12 · `yolda` 7 · `sonra` 5); B-029'un beş iddiasının hiçbiri "bugün var"da değil. Tüketiciler 2.10+2.11'e kaldı (17 çağrı satırı / 6 dosya) |
| 2.09 | TASK-2.09 | ✅ Tamamlandı | Beş cümleden **dördü düzeltildi, biri ölçümle çürütüldü** ("yetkiler geri alınır" doğruymuş — `revokeTemplate` üzerinden koşuyor). Yeni kapı `tests/iddia-metinleri.test.ts` |
| 2.10 | TASK-2.10 | ✅ Tamamlandı | `/ozellikler` ve Kurucu Programı `CAPABILITIES`'ten okuyor; B-040 kanıtı 15 → 10 satır. Devralınan `nextVersion` devri ölçümle çürütüldü (ürünün sürüm haritası yalnız üç kalemi v1.5'e koyuyor) |
| 2.11 | TASK-2.11 | ✅ Tamamlandı | Son dört ev bağlandı (chat · SSS · `/fiyat` · karşılaştırma); kanıt 10 → 3 satır. **B-040 ve B-014 kapandı.** Yeni yayın kapısı `upcomingCapability`/`stageNote` ters yönü fail-closed yapıyor |
| 2.12 | TASK-2.12 | ✅ Tamamlandı | Riskli alt küme taraması: 27 küme / 66 dosya / **129 vuruş satırı**; iki karşılıksız iddia düzeltildi. Yöntem sondayla düzeltildi (21 → 121 vuruş). **B-029 kapandı** |
| 2.13 | TASK-2.13 | ✅ Tamamlandı | B-018'in **dört kalemi de** görüntüden kalktı (Gizem Ö. · Kampanyalar 7/7 · Yenileme & Churn · Öğrenci Tutma); devralınan bir alt metin ölçümle çürütüldü. Görsel toplamı 275.172 → **264.962 B**. Atom açık kaldı (kök neden denetimde) |
| 2.14 | TASK-2.14 | ✅ Tamamlandı | Denetimin **ad dalı** `REPLACEMENTS`/`INITIALS`'ın kaynak tarafından türüyor (52 parça + 13 baş harfi, hedef tarafı çıkarılıyor); kalıp ikincil ağa indi. Kontrol gruplu sonda: eski denetim çıkış 0 + sızıntılı görsel, yeni denetim çıkış 1. Çıktı 7/7 birebir aynı |
| 2.15 | TASK-2.15 | ✅ Tamamlandı | Denetimin **iddia dalı** açıldı; sözlük `research/lib/claim-leak.mjs`'te tek evde (20 kalıp, F6.4 devralır). Ayraç: projeksiyon/üstünlük/büyüme kıyası yasak, nötr gösterge serbest. Boş izin listesiyle **27 vuruş** → 25'i kapatıldı, 2'si gerekçeli; 20'si ana sayfanın **hero** görselindeydi. Dizge ölçümü **3/20 → 10/20**. Dört görsel değişti (264.962 → **258.782 B**, cockpit 655 → 629 px). **B-018 kapandı** |
| 2.16 | TASK-2.16 | ✅ Tamamlandı | IP'nin iki kullanımı metne girdi (bellekteki sayaç ↔ kayda giren özet + 12 ay); karşılıksız "tarayıcı bilgisi" kalemi düşürüldü — `LEAD_FILE_PATH` Vercel'de hiçbir ortamda tanımlı değil (ölçüldü). KVKK ↔ Gizlilik listeleri hizalandı, amaç listesi onay e-postasını ve hız sınırını kapsadı. Onay metni 138 → **171 karakter** (320 px'te 5 → 6 satır). **B-024 k.1·3·4 kapandı** (atom açık, 2.17'de biter) |
| 2.17 | TASK-2.17 | ✅ Tamamlandı | İki yanlış ölçüm iddiası silindi (*"kayıtlarında IP adresinizi tutmaz"*, *"bu ölçüme kişisel verileriniz aktarılmaz"*); erişim kaydının IP ve tarayıcı bilgisi tuttuğu, **hiçbir süre vaat edilmeden** yazıldı. Tedarikçi listesi 3 → **4 kalem** (ekip posta kutusu eklendi) ve dördünün de ülkesi **bu turda kaynağından ölçüldü**: Vercel fonksiyonu `iad1`/Washington D.C. · Hetzner `CLOUD-NBG1`/DE · Resend kendi DPA'sında ABD (gönderim `eu-west-1`/İrlanda, ayrı yazıldı) · ekip kutusu Google MX. Devralınan bir özet çürütüldü (`session` ayrıca `browser/os/device/screen/language` tutuyor). v1 paritesi 5/5 + `TRANSFER_FACT`. **B-024 kapandı ve arşive gitti** (hukuki dayanak B-008'de) |
| 2.18 | TASK-2.18 | ✅ Tamamlandı | Yasal beyan kapısı kuruldu: `tests/legal-consistency.test.ts`, **8 dal / 24 test** (sekizinci dal DURUM Not bloğundan — bölge cümlesinin depo içi yarısı), batarya 180 → **204**. Metin kopyalanmaz, ilişki doğrulanır; sessiz geçmeye karşı üç katman. **12 negatif kontrolün 12'si kırmızı**, ikisi kapının kendi fail-open'ını buldu (göreli URL'li depo okuması · cast'li doğrudan izleyici çağrısı). Anahtar yetkisi ve MX olgusu bilerek çivilenmedi (komşu depo / DNS) |
| 2.19 | TASK-2.19 | ✅ Tamamlandı | "12 ay" dalı komşu depodan okunuyor: `web`'e `pb_hooks` `:ro` bağlandı (hedef `/app` dışında — içi repoya root sahipli dizin bırakıyor, ölçüldü), kapı `LEGAL_CONTRACT_HOOKS_DIR` ile açılıyor. Beyan parçası **ölçülen sayıdan türetiliyor**. Anahtar tanımsız 204 geçti + 2 atlandı (geçen taban birebir), tanımlı **211**; dosya 24 → 31 test. **14 negatif kontrolün 14'ü kırmızı** (kopya üzerinde — kaynak dokunulmaz); biri bölüm-geneli kontrolün hakkını verdi. **B-060 kapandı** |
| 2.20 | TASK-2.20 | ❌ İptal | KVKK başvuru adresi posta alır (B-011) — **kapsam kararıyla "Alan adı geçişi" fazına taşındı** (2026-09-23). Ölçülebilir yarısı bu fazda yapıldı ve B-011 atomuna mezun edildi: Squarespace yönergesi kaynağından doğrulandı (**Add preset → Google Workspace MX**, kararlaştırılan beş kayıtla birebir), apex MX hâlâ NODATA (iki çözümleyici), referans küme `kiwiailab.com`'da 5/5, TXT/NS/SOA tabanı alındı, apex A `76.76.21.21` → bugünkü posta **örtük MX** ile web IP'sine düşüyor. Kalan iki ayak kullanıcının DNS adımına bağlıydı |
| 2.21 | TASK-2.21 | ✅ Tamamlandı | Onay e-postası yalnızca doğrulanabilir bir alıcıya gider (UAT senaryo 26). İki kapı kondu: **adres başına tavan** (24 saatte 3, `confirmCapped`) ve **parametresiz onay metni** (ziyaretçinin yazdığı hiçbir şey alıcıya ulaşmıyor). Çift-katılım bilinçle alınmadı — dönüşüm yoluna dokunuyor, jeton yeni kişisel veri alanı açıyor (`docs/DECISIONS.md` 2026-09-23). Ziyaretçinin yanıtı, kayıt ve ekip bildirimi değişmedi |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## UAT Sonuçları

> `/devflow:verify-phase` oturumunda dolduruldu (2026-09-23, tek tur — otonom kol).
>
> **Bölme çocuğu:** `PHASE-2-UAT.md` — 30 senaryonun tam tablosu ve otomatik kontrol dökümü (uat).

**Tarih:** 2026-09-23
**Toplam Senaryo:** 30 | **Geçen:** 29 | **Kalan:** 1 — düzeltme task'ı doğurdu ve **TASK-2.21 ile kapandı** (2026-09-23)

**Ölçüm yüzeyi:** yerel üretim imajı (3100, HEAD'ten yeniden derlendi), dev sunucusu (3000), canlı önizleme (`alpfitplus-web-v2.vercel.app`), `web` konteynerinde Vitest (9 dosya), araştırma konteynerinde Playwright (320/360/390/412/1440 px), görsel üretim hattı (kopya tablo ile, kaynak dokunulmadan), beş kapı betiği ve Vercel dağıtım listesi.

**Kapıların kendisi sınandı — yeşiller kör değil.** Sekiz ters-çevirme koşuldu ve sekizi de kırmızı verdi: yayın kapısı (kalem «bugün var»a taşındı → 4 test dosyası düştü + dört rota HTTP 500), tüketici kapısı, yasal beyan kapısının iki yanı (metin ve kod), görsel denetimin ad ve iddia dalları, sözlüğün alt sınırı, `notify_lead` üç dalı, bal küpü kapısı. Bozulan her hâlde **girdi** bozuldu, kaynak değil; `src/` ve `research/` ağacı md5 ile geri yüklendi (`git status` temiz, `git checkout`/`git restore` kullanılmadı).

**Kalan tek kalem — kapandı:**

| # | Senaryo | Sonuç | Rota |
|---|---------|-------|------|
| 26 | Uç, talep sahibinin yazdığı adrese doğrulama yapmadan onay e-postası gönderiyor | ❌ Kaldı → ✅ **kapandı** | TASK-2.21 (2026-09-23) |

**Ölçülen sınırlayıcılar (bulgu anında):** IP başına 10 dk / 5 istek (6. istek 429 — ölçüldü), bal küpü, onay kutusu zorunlu. Adresin sahipliğini gösteren kapı yoktu. **Bugün:** adres başına 24 saatte 3 onay e-postası (kötüye kullanım sondası: 6 denemede 3 gitti / 3 takıldı) ve onay metni ziyaretçinin yazdığı hiçbir şeyi taşımıyor. Adresin sahipliği hâlâ **doğrulanmıyor** — çift-katılım bilinçle alınmadı; kalan yüzey tavanlı ve içeriksiz.

**Üç kalem otonom kolda kapanamadı ve kullanıcıya soruldu** (kullanıcı kararı: üçü de sorulsun): gerçek telefonda form denemesi · onay e-postasının gelen kutusu/spam yerleşimi · ekran okuyucuda onay kutusunun iki kez duyurulup duyurulmadığı. Üçü de bu fazın milestone kriterlerini **değil**, doğrulama kanalını ilgilendiriyor.

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
