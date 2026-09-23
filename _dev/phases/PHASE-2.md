# Phase 2: Yayın öncesi düzeltmeler

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-2.md`) faz HÂLÂ AKTİFKEN `PHASE-2-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-2 · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder. -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). -->

---

**Bölme çocuğu** (faz hâlâ aktifken bölündü; parent bu fazın mini-index'idir):
`PHASE-2-ARASTIRMA.md` — araştırma-detayı

---

## Genel Bilgiler

**Amaç:** Alan adı geçişinden önce sitenin ziyaretçiye söylediği her şeyi ölçülmüş gerçeğe hizalamak: yetenek iddiaları, ürün görselleri, yasal metinler ve KVKK başvuru adresi. Aynı fazda huninin son metresi kapanır (mobilde onay ve hata görünür hâle gelir, talep sahibi onay e-postası alır) ve üretim imajına sızan sırlar çıkarılır. Faz, yayın anına "site doğruyu söylüyor ve talep kaybolmuyor" diyerek girilebilmesi için vardır.

**Milestone:** Site ürünün bugün yapamadığı hiçbir şeyi "var" diye anlatmıyor ve beş cümlenin dayanağı `src/content/`'te **tek bir yetenek listesi**; ana sayfada render edilen ürün görselinde gerçek kişi adı ve olmayan özellik yok, hattın denetimi bir sonraki sızıntıyı kendisi yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor (IP özeti ve saklama süresi, onay kapsamı, ölçüm sunucusunun gerçeği) ve dört beyanı bir test çiviliyor; `destek@alpfitplus.com` gerçek bir test postası alıyor; üretim imajında `.env` yok, yerel üretim provası neye bağlandığını açıkça söylüyor ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü — döndürme gerekmedi; 320-412 px'te demo formunun onayı **ve** hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.

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
- **B-058'de iki anahtar döndürülür.** `.dockerignore` düzeltilir (`.env` ve `.env.*`, `!.env.example` istisnasıyla), `web-prod`'a **bilinçli** env verilir ki yerel prova neye bağlandığını söylesin, ve iki değer yenilenir: IP tuzu (ölçüldü — v1'in değeri değil, TASK-1.18'de v2 için üretilmiş rastgele; döndürmenin v1 kayıtlarıyla süreklilik bedeli yok, tek etkisi v2'nin 15 test kaydının IP kimliği bağının kopması) ve lead deposunun **önizleme** token'ı (sunucuda bir işlem; v1'in canlı akışı üretim token'ını kullandığı için etkilenmez). Kalan üç değer **beyana göre** yerel ya da gizli-olmayan — ⚠️ bu beyan ölçülmedi: `.env`'deki `LEAD_TOKEN_PRODUCTION` gerçekten yerel depo kopyasının token'ı mı, yoksa canlı üretim token'ı mı? Canlı değer oradaysa döndürme kapsamı üçe çıkar ve v1'in canlı lead akışı da ilgilenir. Ölçüm fazın ilk işlerinden biri (`docs/DECISIONS.md` 2026-09-22 → açık kalem). **→ Ölçüldü (TASK-2.01, 2026-09-22): sunucu↔yerel parmak izi eşleşmedi, yani imaja giren hiçbir değer canlı değil — döndürme ayağı düştü, TASK-2.03 iptal edildi ve milestone o ayağı ölçümü anacak şekilde yeniden yazdı (plan revizyonu 2026-09-23).**
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

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 2.01 | TASK-2.01 | ✅ Tamamlandı | Sunucu ölçümü: nginx erişim kaydının bugünkü hâli + `.env` parmak izi karşılaştırması (B-024 ve B-058'i besleyen keşif ayağı) |
| 2.02 | TASK-2.02 | ✅ Tamamlandı | `.dockerignore` düzeltildi, `web-prod` üç kayıt yolunun baş anahtarını açıkça boş alıyor; üretim imajında `.env` yok (önce 369 B — kontrol gruplu), uç `503 no-sink`. B-058 kapandı, kalıcı kapı M6 F6.2'ye devredildi |
| 2.03 | TASK-2.03 | ❌ İptal | İki anahtarın döndürülmesi — ön koşul ölçümle düştü: sunucu↔yerel parmak izi eşleşmedi, döndürülecek canlı anahtar yok (plan revizyonu 2026-09-23). B-058'in kalan işi TASK-2.02'de, atom orada kapanıyor |
| 2.04 | TASK-2.04 | ✅ Tamamlandı | Fiyat sayfasının mobil ana çağrısı 24 px'ten 52 px'e döndü (`flex-1` → `sm:flex-1`, iki satır); 320/360/390/412 px'te 0/8 → 8/8, altı rotada 0/12 → 12/12, masaüstü değişmedi. B-034 kapandı |
| 2.05 | TASK-2.05 | ✅ Tamamlandı | Gönderim sonrası odak sonuç yüzeyine taşınıyor: onay kutusu altı genişlikte de tam 88 px'te (taban 2/6 → 6/6), odak tablosu 54/54, eşlenmeyen kodlarda kutu 18/18 görünür, (g) kapandı, kırık `aria-describedby` bitti. Araştırmanın "düz `focus()`" hâli (g)'yi kapatmadığı ölçüldü — kaydırma `scrollIntoView({block:"start"})` ile açıkça yapılıyor, yeni `scroll-margin-top` yok. **(b)'nin alana eşlenen yarısı TASK-2.06'ya kaldı**; B-055 orada kapanır |
| 2.06 | TASK-2.06 | ⬜ Bekliyor | Hatalı alan kendi üstünde görünür: `aria-invalid` işareti + alan bazlı hata metni (B-055 a) |
| 2.07 | TASK-2.07 | ⬜ Bekliyor | Talep sahibine onay e-postası; `notify_lead` kalıcı `pending` yerine gerçek sonucu taşır (B-059'un e-posta ayağı) |
| 2.08 | TASK-2.08 | ⬜ Bekliyor | Yetenek ve yol haritası tek kaynağı: `product.ts`'te üç kademeli sabit, `PRODUCT_STATUS` ondan türer (B-029, B-040) |
| 2.09 | TASK-2.09 | ⬜ Bekliyor | Ürünün karşılamadığı beş yetenek cümlesi düzeltilir (B-029) |
| 2.10 | TASK-2.10 | ⬜ Bekliyor | `/ozellikler` üç kolonu ve Kurucu Programı satırları sabitten okur (B-040) |
| 2.11 | TASK-2.11 | ⬜ Bekliyor | Chat, SSS, fiyat ve karşılaştırma sayfası sabitten okur — üç liste + beş tekil kalem cümlesi; B-040 kapanır (B-040, B-014) |
| 2.12 | TASK-2.12 | ⬜ Bekliyor | Riskli alt küme taraması: ürünün kendi "bugün yok" işaretlerinden türeyen tarama ve düzeltmeler; B-029 kapanır |
| 2.13 | TASK-2.13 | ⬜ Bekliyor | Ürün görsellerinde "Gizem Ö.", "Kampanyalar" menüsü ve "Yenileme & Churn" kartı temizlenir (B-018) |
| 2.14 | TASK-2.14 | ⬜ Bekliyor | Denetimin ad dalı regex yerine temizlik tablosundan beslenir (B-018) |
| 2.15 | TASK-2.15 | ⬜ Bekliyor | Yasaklı iddia sözlüğü `research/lib/` altında kurulur, denetime iddia dalı eklenir; B-018 kapanır (M6 F6.4'ün girdisi) |
| 2.16 | TASK-2.16 | ⬜ Bekliyor | Yasal metinde işlenen veri gerçeği (IP, `ip_hash`, tarayıcı bilgisi) ve form onayının kapsamı (B-024 k.1·3·4) |
| 2.17 | TASK-2.17 | ⬜ Bekliyor | Ölçüm ve aktarım beyanları ölçülene göre yazılır; B-024 kapanır (hukuki dayanak hukukçuda kalır) |
| 2.18 | TASK-2.18 | ⬜ Bekliyor | Yasal beyan testi: depo içindeki yedi olgu çivilenir (B-060) |
| 2.19 | TASK-2.19 | ⬜ Bekliyor | Yasal beyan testi: "12 ay" dalı komşu depodan salt-okunur bağlama + env kapısıyla okunur; B-060 kapanır |
| 2.20 | TASK-2.20 | ⬜ Bekliyor | KVKK başvuru adresi posta alır: beş MX kaydı girilir, DoH ile ölçülür, gerçek test postasıyla doğrulanır (B-011) |

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
