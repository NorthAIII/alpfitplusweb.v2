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

> Bu bölüm `/devflow:research-phase` oturumunda doldurulur.

### Değerlendirilen Yaklaşımlar
- [Yaklaşım 1]: [Açıklama, artılar, eksiler]
- **Seçilen:** [Hangisi ve neden]

### Kullanılacak Araçlar/Kütüphaneler
- [Araç 1]: [Versiyon, ne için]

### Dikkat Edilecekler
- [Tuzak/Risk 1]: [Nasıl kaçınılacak]

### Teknik Kararlar
- [Karar 1]: [Gerekçe]

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
