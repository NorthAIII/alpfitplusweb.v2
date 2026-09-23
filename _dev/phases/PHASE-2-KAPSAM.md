# Phase 2 — Kapsam Tartışması

← PHASE-2 · kapsam-tartışması

> `_dev/phases/PHASE-2.md` → Kapsam Tartışması'nın bölme çocuğudur (verify-phase boyut kapısı, 2026-09-23 · 2. tur; faz **hâlâ aktifken** bölündü — UAT kaydı yazıldığında parent 20.107 token ile kırmızı çizgiyi aştı). Parent'ta kararların **self-yeten özeti** ve bu dosyanın pointer'ı durur; **discuss-phase'in tam kaydı — alınan kararların gerekçeleriyle tam metni, kullanıcı tercihleri ve kapsam dışı listesi — buradadır.**
>
> Faz review'ı (`review-phase`) milestone ve kapsam kontrolünü buradan okur.

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
