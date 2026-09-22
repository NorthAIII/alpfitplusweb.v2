# BULGULAR — Proje Sorun Kanvası (Index)

> Bu dosya PRD-altı sorun ve önerilerin **tek evi** ve index'idir. Kaynağı ne olursa olsun —
> audit-product turu ya da herhangi bir oturumda göz ucuyla görülen kapsam-dışı sorun —
> icra-düzeyi kayıt buraya düşer, başka eve dağılmaz. Bulguların detayı
> `_dev/bulgular/B-NNN-<slug>.md` atomlarında yaşar; buradaki her satır o atomlara
> pointer'dır (MEMORY index↔atom deseni: ince index hep okunur, detay gerekince lazy-load).

**Son Güncelleme:** 2026-09-21 — TASK-1.06 (run-phase): B-037(1) yayın yüzeyinde ölçülerek 🟢'ye indi, B-011'in `DEMO_TO` kalemi kapandı (apex MX bugün yeniden ölçüldü, hâlâ yok); Gelen Kutusu'na dört satır. Açık bulgu 49 — rehber eşik (~30) aşıldı, triyaj çağrısı sürüyor.

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->

---

## Gelen Kutusu

<!-- KURAL: Herhangi bir oturumda görülen kapsam-dışı sorun/uyarı — ve denetim turundan çıkan
     CEVAPLANMAMIŞ SORU — buraya KAYNAK İŞARETLİ tek satır düşer:
     `- [TASK-3.02] Ödeme sayfası konsolda 404 üretiyor (bkz. /api/coupons)`. Kaynak işareti: [TASK-X.YY] /
     [PHASE-N] / [QUICK-NNN] / [oturum türü] / [audit-product SORU]. Secret/credential DEĞERİ asla yazılmaz — yalnız konumu.
     Satır bir POINTER'dır: kanıtın tamamını değil YERİNİ yazar. Satır kanıtın GÖVDESİNİ taşımaya başladıysa
     (yeniden üretme adımları, ölçüm dökümü, kod alıntısı) bu bir disiplin ihlali değil TEŞHİSTİR: elinde not
     değil bulgu var; kanıtın evi atomdur (aşağıda "Bulgu Sistemi"), kutuya yalnız kancası düşer.
     Kardeş biçim: Açık Bulgular satırı da bir kancadır.
     PRD/vizyon düzeyi fikir buraya değil → prd-note (NOTES.md).
     Triyaj: audit-product uzlaştırması her notu sonuca bağlar (bulgu atomu / Bilinçli Tercihler / sil);
     verify-phase Adım 1 bu faza dokunanları süpürür; versiyon sonunda prd-review kutunun boş olup olmadığını
     HÜKME BAĞLAR (boş değilse ya uzlaştırma turu önerilir ya bilinçli erteleme gerekçesi yazılır) — kutunun
     TAMAMINI kapsayan tek zamanlı adım odur — tam dosyayı okumaz; sayar, SORU satırlarını listeler ve alınan
     cevabı satıra işler — çünkü audit-product tasarımı gereği zamana/döngüye bağlı değildir.
     `[audit-product SORU]` satırları KARAR bekler — incelemeyle kapanmaz; kullanıcı cevabı alınmadan düzeltme
     task'ına dönüştürülmez, cevap gelene dek kalır. Cevap alındığında satır SİLİNMEZ: **cevabı alan oturum** kancayı yazar —
     kaynak işaretinden hemen sonra `✅ **CEVAPLANDI** (<kim>, <oturum/tarih>) — <karar>` — ki triyaj aynı soruyu
     yeniden sormasın; silme yine triyajın işidir.
     Not task'a dönüştüğünde veya atomlaştığında satır
     SİLİNİR — bilgi yeni evine taşınmıştır (mezuniyet). Olgun hal: boş kutu. -->

- [kickoff SORU] Ana sayfa mobilde ~26.000 px; referans alınan rakip de benzer uzunlukta. Kısaltılsın mı? Karar kullanıcıda — tek başına içerik atılmadı (bkz. `modules/M2-Sayfalar-ve-Bolumler.md` F2.1)
- [TASK-1.07] **Kullanıcı adımı — 1.07'nin kapanışı buna bağlı, 1.08 · 1.09 · 1.15 de:** Umami'de v2 site kaydı. Kimlik biçimi ölçüldü (2026-09-21): 3.1.0'da API anahtarı yok, **kullanıcı adı + parola** gerekiyor — kasaya girerse oturum kendi açar, yoksa kullanıcı panelden açıp Website ID'yi verir. İki yolun komutları/adımları: `tasks/TASK-1.07.md` → 2026-09-21 kaydı → Sonraki Adım Detayı. ✅ B-056 kapısı kapandı, kimlik girişi güvenli
- [TASK-1.07 / run-phase] Umami giriş ucunda hız sınırı ve kilitlenme yok (3.1.0 kaynağı okundu), panel internete açık — evi büyük olasılıkla `altyapi/vps` projesi, buraya kayıp olmasın diye düşüldü
- [TASK-1.07] TASK-1.15 için: `umami.kiwiailab.com` önündeki nginx'in erişim loglarında IP tutulup tutulmadığı ve ne kadar saklandığı ölçülmedi (sunucu erişimi gerekiyor). "IP saklamaz" cümlesi yalnız Umami veritabanı için doğrulandı: 3.1.0 şemasında IP sütunu yok (`tasks/TASK-1.07.md` → Oturum Kayıtları)
- [TASK-1.07] TASK-1.15 için: Umami 3.1.0'da oturum kaydı (session replay) özelliği var. Sunulan `script.js` kaydedici kod taşımıyor, site ek betik yüklemiyor. Yasal metin "ölçüme ne gider" derken bu sınıra dayanıyor; kaydedici eklenirse metin değişmeli
- [PHASE-1 plan revizyonu] v1 paritesi: v1'in ucu talep sahibine de onay e-postası gönderiyor ("1 iş günü içinde dönüş") ve bildirim sonucunu depo kaydına geri yazıyor (`notify_team`/`notify_lead`; `../Alpfitplus-website.v1/api/demo.ts:314-371`). v2 yalnız ekibe gönderiyor. Alan adı geçişinde v2 v1'in yerini alınca bu davranış sessizce kaybolur ve `notify_lead` alanı `pending` kalır. TASK-1.14 yalnız `notify_team`'i ele alıyor (Karar Noktası); onay e-postası "Alan adı geçişi" kapsam tartışmasına
- [TASK-1.11] Bunker OS'a ait: canlı n8n `lead-intake-agent` (aktif, `/webhook/lead-intake`) canlı şemayla uyumsuz INSERT taşıyor (`tenant_id` yok, `ON CONFLICT (email)` karşılıksız) ve Outreach Agent'a (GHL+Instantly) zincirli — çalışmaz görünen ama açık bir giriş kapısı; kapatılması Bunker OS triyajı (bkz. `tasks/archive/TASK-1.11-BUNKER-KESFI.md` → 1. madde tablosu)
- [TASK-1.18 / run-phase] UI 🔴 bulgularını (B-032 kontrast, B-033 320 px Kurucu Programı, B-034 mobil fiyat CTA 24 px, B-031 a11y.mjs kontrast kör noktası) "Yayın öncesi düzeltmeler" fazına alma önerisi — kullanıcı 2026-09-14: "önce Faz 1 bitsin, arayüz sonra"; faz kapsamı kararı o fazın discuss-phase'inde. Not: `docs/DECISIONS.md` 2026-09-13 «Faz sırası (yeniden)» B-032/033/034'ü aday küme olarak tartıp kilitleyen kümeye almamıştı — öneri o seçimi yeniden açar

- [TASK-1.06 / run-phase] Alan adı geçişinden önce v1'in gerçek adres envanteri ve Umami'deki en çok gezilen sayfaları 301 haritasıyla (20 adres) karşılaştırılmalı — liste daha önce çıkarıldı, bugünkü canlıya karşı doğrulanmadı
- [TASK-1.06] Lead deposunun sunucu dışı yedeği yok; `../altyapi/vps/CLAUDE.md`'nin `alpfit-pocketbase` gerekçesi ("0 istek, dosya değişmiyor") bayat — depo 15 kayıt taşıyor ve v2 buraya yazıyor
- [TASK-1.06] Uçtan uca tur fiziksel telefonla değil mobil profilli tarayıcıyla koşuldu (gerekçe: `tasks/archive/TASK-1.06.md`) — fiziksel cihaz gözlemi "Görsel ve mobil iyileştirme" UAT'ına
- [TASK-1.06] 412 px'te gönderim sonrası sayfa başlığı yapışkan başlığın arkasından okunuyor gibi görünüyor (ölçülmedi, doğrulanmalı); yatay kaydırma yok, konsol temiz

- [audit-product SORU] `DemoForm.tsx:103` `noValidate` ve hız sınırının doğrulamadan önce sayması bilinçli mi? İkisi birlikte M3 F3.1 kriteriyle çelişiyor ve geçerli talebi 429'a düşürüyor (bkz. B-020; TASK-1.12 sonrası yeni tetikleyici B-054) — önerim: kota yalnız doğrulamayı geçen isteği saysın, istemci doğrulaması açılsın
- [audit-product SORU] Footer'daki "Giriş Yap" bilinçli mi? Bilinçli Tercihler kaydı yalnız **header**'ın yokluğunu kapsıyor ("footer'a, ürün canlıya çıkınca"), ama bağlantı bugün footer'da ve `app.alpfitplus.com` çözümlenmiyor — önerim: ürün canlıya çıkana dek gizlensin, kayıt gerçeği yansıtsın
- [audit-product SORU] `mobile-audit.mjs`'in raporladığı 157 küçük dokunma hedefi kabul mü? M2 F2.3 kriteri "≥ 44 px" diyor ama CLAUDE.md geçme şartı yalnız "yatay kaydırma: yok" — kriter mi bayat, kapı mı dar? (bkz. B-015) — önerim: kriter hedef olarak kalsın, kapı kademeli sıkılsın
- [audit-product SORU] Asistan paneli bilinçli olarak **modal olmayan** bir yardımcı mı? `role="dialog"` var ama `aria-modal` yok, odak taşınmıyor, arka plan `inert` değil; M4 F4.1 "odak tuzağı yok" diyor. Cevap B-017'nin düzeltme yönünü belirliyor — önerim: modal olmayan yardımcı kabul edilip rol düzeltilsin
- [audit-product SORU] "İncelediğimiz 9 yerli ve 9 global üründe bu modüle rastlamadık" sitede **yayımlanır** mı? `CLAIMS.md` bu rakamı tablonun "Neden" sütununda, yani iç gerekçe olarak tutuyor; yayımlanan hâli ziyaretçinin doğrulayamayacağı bir tarama iddiası — önerim: yöntem + tarihle birlikte verilsin ya da kaldırılsın
- [audit-product SORU] Ürün görsellerindeki "Aktif · Alpfit Plus konsepti", "Açılış: Şubat 2026 · 4 aylık" ve aylık ciro grafiği bilinçli demo kurgusu mu? Üç şubeli bir zincirin aylardır ürünü kullandığını ima ediyor, "bir stüdyoda pilot" sınırıyla gerilimde (bkz. B-018) — önerim: tarih ve "aktif" rozetleri temizlik tablosuna girsin
- [audit-product SORU] `product.ts` BENEFITS başlıkları ("Kaçan randevu azalır", "Riskteki üye fark edilir") rakamsız yönlü iyileşme vaatleri — `CLAIMS.md` yüzde iyileşmeyi yasaklıyor, rakamsız vaat sınırın içinde mi sayılıyor? — önerim: içinde sayılsın ve CLAIMS'e tek satır açıklık eklensin
- [audit-product SORU] 404 ve `global-error`'daki dekoratif dev rakam ("404" ve "Hata", ikisi de 1,17:1) `aria-hidden` + kapı muafiyeti mi alsın, kontrastı mı 3:1'e çıksın? Karar `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyor (bkz. B-032, B-045)
- [audit-product SORU] **`npm run lint` bir kapı mı, tavsiye mi?** Next 16 derleme sırasında ESLint koşturmuyor (doğrulandı), CLAUDE.md ölçüm tablosunda lint yok, `--max-warnings` yok — yani B-028'in 25 hatası hiçbir şeyi kırmızıya çekmiyor. Kapı olacaksa ölçüm tablosuna girmeli ve `research/scripts/` uyarıları da temizlenmeli; tavsiyeyse bu açıkça yazılmalı
- [audit-product SORU] Vercel fonksiyon bölgesi **`iad1`** (Washington DC), kenar `fra1` — Türkiye-tek-pazar bir sitede `/api/demo` Atlantik'i geçiyor (`x-vercel-id: fra1::iad1::`). Bilinçli mi? Değişim tek ayar; ölçüm (audit-product 2026-09-13, Türkiye genişbant, n=10 GET): `/api/demo` TTFB medyanı 259 ms, statik HTML 150–159 ms → fonksiyon başına **~+105–110 ms**, ilk çağrı 987 ms (soğuk başlatma olası); gerçek POST süresi ölçülmedi — önerim: F7.5 kapsam tartışmasına girsin
- [audit-product SORU] Roller bölümünde **antrenör** sekmesi masaüstü panosunu telefon çerçevesinde gösteriyor (244×129 px, okunmaz) ve **diyetisyen** sekmesi antrenör ekranını gösteriyor (alt metni bunu açıkça söylüyor). Vekil bilinçli mi? `demo/` altında diyetisyen ekranı yok, yani görseli üretmek M5 kapsam kararı — CLAIMS'in "gerçek fark" dediği tek kalemin sitede kendi görüntüsü yok (bkz. B-046)
- [audit-product SORU] ✅ **CEVAPLANDI** (run-phase alt ajanı, koşum yetkilendirmesi; 2026-09-21) — TASK-1.07 içinde yapıldı, ayrı quick açılmadı: kimlik de o task'ta girilecek, sıra korundu. (b) notu 1.07'nin Sonraki Adım Detayı'nda. Özgün soru: B-056'nın izleyici koruması (`data-exclude-search="true"`, tek öznitelik, etkisi ölçüldü) **nerede** yapılsın: Umami site kimliği girilmeden hemen `/devflow:quick` ile mi, TASK-1.07'nin devamında mı? TASK-1.07'nin devamı kimliğin girilmesine bağlı; koruma kimlikten sonra gelirse arada zincir canlıdır — önerim: quick ile kimlikten önce; B-056 (b)'deki ölçüm kriteri notu TASK-1.07'nin devamında ele alınsın
- [audit-product] `globals.css:122` `html { scroll-behavior: smooth }` taşıyor ama `<html>`'de `data-scroll-behavior="smooth"` yok. Next 16 dev sunucusu uyarı basıyor: rota geçişinde yumuşak kaydırmayı kapatma artık bu özniteliğe bağlı. Uzun sayfalardan iç gezinmenin görünür bir kaydırma animasyonu üretip üretmediği ölçülmedi (odak dışı, M2 turuna)
- [audit-product SORU] `Assistant.tsx`'te `donanim` düğümü **tek yön kapı**: dokuz düğümün hiçbirinin devam sorusunda yok, yani kök ekranından ayrılan ziyaretçi turnike/donanım itirazına bir daha ulaşamıyor (dönüş yalnız 25 px "Baştan" düğmesiyle). Bilinçli daraltma mı? — önerim: bir-iki düğümün `next`'ine eklensin ya da chip kümesi her zaman bir kök konusu içersin

## Açık Bulgular

<!-- KURAL: Satır formatı: `- 🔴 [B-NNN — başlık](bulgular/B-NNN-<slug>.md) — tek satırlık kanca`
     (+ faza/task'a alındıysa satır sonuna ` → Faz N` veya ` → TASK-X.YY`).
     Sıralama = ele alınma önceliği (en üst en öncelikli). Önem işareti zorunlu: 🔴 kritik / 🟡 önemli / 🟢 iyileştirme.
     Kanca ~100 karakteri aşmaz — detay atomdadır, index ince kalır.
     YALNIZ açık bulgular listelenir: çözümü teyit edilen bulgunun atomu `bulgular/archive/`e taşınır ve
     satırı SİLİNİR (mezuniyet — iz bırakma); arşiv burada ASLA listelenmez (`ls _dev/bulgular/archive/` zaten görür).
     Faza/task'a alınan bulgu işaretini alır ve çözüm teyidine dek burada bekler (faz erken sonlansa bile kaybolmaz).
     Bu index bir kanvas dokümandır: BÖLÜNMEZ. Liste yönetilemeyecek kadar uzadıysa (rehber eşik ~30 açık bulgu —
     işaret fişeği, mahkûmiyet değil) bu bir triyaj çağrısıdır: stok eritilir/elenir, yapı değiştirilmez. -->

- 🔴 [B-029 — Site, ürünün karşılamadığı beş yeteneği "var" diye sunuyor](bulgular/B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md) — ürünün kendi paneli "Yakında" diyor; dördünde ürün kaydı v1.5/W8 yazıyor
- 🔴 [B-018 — Ürün görselinde gerçek kişi adı, ciro projeksiyonu ve yol haritası özellikleri](bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md) — "Gizem Ö." ana sayfada gösteriliyor; yasal metnin "gerçek kişi verisi yok" beyanı çürüyor
- 🔴 [B-054 — İletişim kuralı ters eksende gevşek](bulgular/B-054-iletisim-kurali-ters-eksende-gevsek.md) — `+90 0532…`, Mac Rehber yapıştırması 422 (5 denemede 429); tek hane hatalı numara hedefe 200
- 🔴 [B-011 — Apex'te MX kaydı yok, KVKK başvuru adresi posta alamıyor](bulgular/B-011-apex-mx-kaydi-yok.md) — yasal metin otuz gün taahhüt ediyor; 2026-09-21'de yeniden ölçüldü, MX hâlâ yok. `DEMO_TO` kalemi kapandı (`kiwiailab.com`, teslim kanıtlı)
- 🔴 [B-032 — Ana sayfada ve segment sayfalarında ölçülmüş AA kontrast ihlalleri](bulgular/B-032-olculmus-aa-ihlalleri.md) — ürün turu soluk kartları 2,54:1, kapanış paragrafı 3,48:1; ILKELER pazarlıksız diyor
- 🔴 [B-033 — 320 px'te Kurucu Programı bölümü içerik ve işlev kaybediyor](bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md) — 18 metin düğümü 70 px kesiliyor, CTA etiketi dâhil; sayfa yatay kaydırma üretmediği için kapı temiz diyor
- 🔴 [B-034 — Mobilde fiyat sayfasının ana çağrısı 52 px yerine 24 px](bulgular/B-034-mobilde-ana-cagri-24px.md) — kırılımsız `flex-1`; 6 rotada 12 örnek, doğru deyim `DemoForm`'da zaten var
- 🔴 [B-020 — Hız sınırı doğrulamadan önce sayıyor, geçerli talep reddediliyor](bulgular/B-020-hiz-siniri-gecerli-talebi-reddediyor.md) — beş kez hata yapan kullanıcının düzeltilmiş talebi 429; ölçüldü
- 🔴 [B-030 — Beş kalite kapısının dördü eşik altında bile çıkış kodu 0 döndürüyor](bulgular/B-030-kapilar-kirmiziya-donemiyor.md) — hiçbiri kırmızıya dönemiyor; F6.2/F6.3 bugünkü betiklerle kurulamaz
- 🔴 [B-031 — `a11y.mjs`'in kontrast yöntemi üç kör nokta taşıyor](bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md) — kökte tek gradyan ölçüleni 157'den 0'a düşürüyor ve kapı yine "0 sorun" diyor
- 🔴 [B-035 — `perf.mjs` ağırlığı JS ve CSS'e kör, ilan edilmiş regresyon çizgisi geçersiz](bulgular/B-035-perf-agirlik-muhasebesi-kor.md) — 36 yanıtın 28'i 0 bayt sayılıyor; gerçek 1456 KB, raporlanan 144 KB
- 🔴 [B-015 — Kalite kapıları hiçbir şeye tıklamıyor, açılan katmanlar ölçülmüyor](bulgular/B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) — M4 F4.1'in "a11y.mjs ile ölçülür" kriteri sahte yeşil; asistan ve mobil menü hiç açılmıyor
- 🔴 [B-014 — Chat ağacı pilot cümlesini tek kaynaktan değil elle yazıyor](bulgular/B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md) — `PRODUCT_STATUS` değişince asistan eski iddiada kalır; `faq.ts` doğru deseni zaten taşıyor
- 🟡 [B-036 — Dört ayrı yol talebi "başarılı" gösterip sessizce kaybediyor](bulgular/B-036-lead-kaybi-yollari.md) — bal küpü parola yöneticisine açık, JS'siz gönderim kişisel veriyi URL'ye yazıyor
- 🟡 [B-056 — Umami açıldığı gün hidrasyonsuz gönderimde form verisi analitiğe gidiyor](bulgular/B-056-umami-hidrasyonsuz-gonderimde-kisisel-veri.md) — **izleyici tarafı kapandı** (`data-exclude-search="true"`, TASK-1.07 2026-09-21); açık kalan: kaynak tarafı (B-036 native GET) ve (b) bot-kontrolü sahte yeşili
- 🟡 [B-037 — `/api/demo` sertleştirme boşlukları](bulgular/B-037-api-demo-sertlestirme-bosluklari.md) — `null` gövde 500, `content-type` hiç bakılmıyor; kota bypass'ı **yayında kapalı** (Vercel başlıkları eziyor — TASK-1.06'da ölçüldü), yalnız Docker yüzeyinde açık
- 🟡 [B-055 — Demo formunun hata akışı mobilde görünmüyor](bulgular/B-055-demo-formu-hata-akisi-mobilde-gorunmuyor.md) — 320'de 6/6 hata metni ekran dışında, alanda işaret yok; `missing` odağı dolu alana
- 🟡 [B-038 — `lead-sheet.gs` üç operasyonel sessizlik, testi `catch` dalını hiç koşturmuyor](bulgular/B-038-lead-sheet-operasyonel-sessizlikleri.md) — Google Sheet hedefi düştü; dosya siliniyor, bulgu konusuz kapanacak → TASK-1.14
- 🟡 [B-041 — Üç yasal sayfa noindex'in üçüncü katmanını eziyor](bulgular/B-041-yasal-sayfalar-noindex-eziyor.md) — canlı önizlemede `index, follow` servis ediliyor; faz ölçüm tablosu bunu yeşil gösteriyor
- 🟡 [B-024 — Yasal metinler gerçek veri akışını eksik anlatıyor](bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md) — IP, yurt dışı aktarım, onay kapsamı; hukukçuya gönderimden (B-008) önce düzeltilmeli
- 🟡 [B-016 — CSP yok, v1'de var: yayın güvenliğinde gerileme](bulgular/B-016-csp-yok-v1den-gerileme.md) — analitik eklenirken yazmak için doğal an; pencere kapanırsa bir daha zor açılır
- 🟡 [B-025 — Çalışma zamanı için hiçbir alarm yok](bulgular/B-025-calisma-zamani-alarm-yok.md) — "hiçbir hedefe yazılamadı" satırı yalnız Hobby loglarına düşüyor; kimse haber almaz
- 🟡 [B-044 — Ürün görselinde semt baş harfi sızıntısı ve avatar-ad uyumsuzluğu](bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md) — yayınlanan uyumsuzluk `grup`/`takvim`'de sürüyor ("Burak Ş."+DK); semt baş harfi sınıfı açık, denetim 20/21 kör
- 🟡 [B-042 — Paylaşım kartı sayfa başına türemiyor, `/foto` önbelleksiz, JSON-LD geriledi](bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md) — 15 sayfanın `og:url`'ü ana sayfa; WhatsApp birincil kanal
- 🟡 [B-043 — F7.5 geçiş yüzeyi tabloda yazandan geniş](bulgular/B-043-f75-gecis-yuzeyi-tablodan-genis.md) — altı varlık adresi 200'den 404'e düşecek, `www` haritada yok; geçişin DNS işi olmadığı da ölçüldü
- 🟡 [B-039 — Metin bileşende: 402 gömülü prose, 70 bölüm başlığının 67'si literal](bulgular/B-039-metin-bilesende.md) — "Metin tonu" fazının ön koşulu; kriteri bugünkü envanterle sağlanamaz
- 🟡 [B-040 — Ürün yol haritası dört evde ve zaten ayrışmış](bulgular/B-040-urun-yol-haritasi-dort-evde.md) — "Kurumsal üyelik" dördün birinde; kullanım koşullarının "ayrı ayrı belirtilir" taahhüdü tutmuyor
- 🟡 [B-050 — Dört segment sayfasında pilot nitelemesi hiç geçmiyor](bulgular/B-050-segment-sayfalarinda-pilot-nitelemesi-yok.md) — giriş sayfaları; yasaklı kelime yok ama izin verilen niteleme de yok, B-029'un ağırlığını artırıyor
- 🟡 [B-023 — Fiyat ve iletişim değerleri tek kaynak dışında, on iki yer](bulgular/B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md) — biri JSON-LD'de, biri bileşende; `CONTACT.phone.display` hiç kullanılmıyor
- 🟡 [B-012 — Erişilebilirlik ve mobil kapıları rotaların yarısını gezmiyor](bulgular/B-012-olcum-betikleri-rota-kapsami-eksik.md) — hipotezi ölçülüp çürütüldü; bedeli tek yerde: 404'ün kontrastı ve başlık atlaması
- 🟡 [B-019 — Üretim konteyneri bayat, ölçümler geçersiz](bulgular/B-019-uretim-konteyneri-bayat-olcumler-gecersiz.md) — 3100 hâlâ 09-11 imajında (noindex açık, rakip adı var); imaj 09-13'te derlendi ama konteyner yenilenmedi
- 🟡 [B-048 — Asistanda yarış koşulu, mobilde okunmayan cevap, JS kapalıyken hayalet düğmeler](bulgular/B-048-asistan-durum-hatalari.md) — "Baştan" bekleyen zamanlayıcıyı iptal etmiyor, kök chip kümesi kayboluyor
- 🟡 [B-017 — Asistan panelinin erişilebilirlik katmanı eksik](bulgular/B-017-asistan-erisilebilirlik-katmani-eksik.md) — 28 px dokunma hedefi, canlı bölge yok, odak `body`'ye düşüyor; kontrast ve Esc temiz
- 🟡 [B-046 — Görsel teslim: `priority` görünmeyen görselde, Roller sekmesi yanlış ekranı gösteriyor](bulgular/B-046-gorsel-teslim-katmani.md) — Sora'da dört ok glifi yok ve `font-guard` bunu yapısal olarak göremiyor
- 🟡 [B-045 — 404 ve `global-error` markalı değil, istemci çöküşü hiçbir yere yazılmıyor](bulgular/B-045-hata-yuzeyleri.md) — `error` prop'u hiç kullanılmıyor; `globals.css` yüklenmediği için sistem fontuna düşüyor
- 🟡 [B-026 — Dönüş süresi üç farklı biçimde vaat ediliyor](bulgular/B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md) — asistan "birkaç dakika" + yeşil nokta diyor, site "aynı gün"; panelde soru kutusu yok ama "sorabilirsiniz" yazıyor
- 🟡 [B-022 — Mobilde ilk ekranda hiçbir dönüşüm yüzeyi yok](bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md) — fiyat sayfası 7.678 px, tepesinde tıklanacak şey yok; huninin geri kalanı sağlam
- 🟡 [B-051 — Ana sayfada üç ikon-kart ızgarası, reddedilen kalıp](bulgular/B-051-ana-sayfada-ikon-kart-izgaralari.md) — `Modules` 5 kart 3 sütunda tırtıklı + 5'li şerit + `Benefits` 8 eşit kart; DECISIONS'ta kayıt yok
- 🟡 [B-047 — Bakım borcu: ölü ilkel 43 yerde elle, tipografi token'ı yok, ilkel garantisi yok](bulgular/B-047-bakim-borcu-envanteri.md) — `ui/Card` 0 import; `text-[0.9375rem]` 52 yerde; içerik düzenlemesi `Roles`'ı çökertebiliyor
- 🟡 [B-028 — `npm run lint` kırık: 25 hata + 5 uyarı](bulgular/B-028-lint-kirik.md) — rakam birebir aynı; Next 16 derlemede ESLint koşturmuyor, yani hiçbir otomatikte yok
- 🟡 [B-008 — Yasal metinler hukukçu onayı bekliyor](bulgular/B-008-yasal-metin-hukukcu-onayi.md) — dış aktör; metinler gerçek veri akışına göre yazıldı, "örnek metindir" ibaresi yok
- 🟡 [B-010 — Kurucu Programı "ilk 5 kulüp" diyor, kontenjan takibi yok](bulgular/B-010-kurucu-programi-kontenjan.md) — "Kontenjan gerçektir" cümlesi kıtlığı olumlu iddia ediyor; kurucu kararı gerek
- 🟡 [B-009 — Logo geçici; favicon, app ikonu ve OG ondan türüyor](bulgular/B-009-logo-gecici.md) — dış aktör; kalıcı logo gelince `brand-assets.mjs` yeniden koşar
- 🟢 [B-057 — Segment LCP'si dekoratif fotoğraf, font takası yeniden akış](bulgular/B-057-segment-lcp-dekoratif-gorsel-ve-font-takasi.md) — Slow 4G'de 390–430 px LCP 2,6–3,3 s; LH CLS 0,15–0,17 (alan CLS'i büyük olasılıkla saymıyor)
- 🟢 [B-049 — Segment sayfasında yöntem ve tarih taşımayan rakip fiyat iddiası](bulgular/B-049-segment-rakip-fiyat-iddiasi.md) — rakamlı kıyas yöntem+tarih taşıyor ama yalnız şube ≥ 2 seçilince açılıyor
- 🟢 [B-027 — Önizleme paylaşımında kart görseli kırık](bulgular/B-027-onizleme-paylasiminda-kart-gorseli-kirik.md) — `og:image` v1'in alan adını gösteriyor, o adres 404; F7.2 kriterindeki "16 sayfa" da 15 olmalı
- 🟢 [B-052 — Ürün görseli hattı çıktı klasörünü temizlemiyor](bulgular/B-052-urun-gorseli-cikti-klasoru-temizlenmiyor.md) — düşürülen ekranın `.webp`'i kalıyor; elle aktarım sızıntılı görseli geri koyabilir
- 🟢 [B-053 — Kök `CLAUDE.md` motor şablonundan geride](bulgular/B-053-claude-md-olmayan-next-komutunu-oneriyor.md) — olmayan `/devflow:next`'i öneriyor, `run-phase` yok, kapanış bloğu eski biçim; rota `audit-docs`
- 🟢 [B-013 — README ve compose yorumu üretim portunu 3001 gösteriyor](bulgular/B-013-readme-uretim-portu-bayat.md) — gerçek port 3100; komutta `--build` da yok

## Kapsama

<!-- KURAL: Alan satırları ÜZERİNE YAZILIR (append log değil). Alanlar projenin doğal bölgeleridir
     (modül/akış düzeyi — MODULE-MAP'le uyumlu ad kullan); audit-product her turun sonunda dokunduğu
     alanların satırını tazeler. Odak seçiminin veri kaynağı budur: en eski bakış + en riskli alan önce. -->

| Alan | Son Bakış | Not |
|------|-----------|-----|
| M1 İçerik ve iddia | 2026-09-12 | audit-product: 10 içerik dosyası tamamen okundu; ~45 yetenek iddiası **ürün deposuna karşı sınandı** ve beşi karşılıksız çıktı (B-029); rakip adı `src/`+`public/`'te ve 15 render rotada temiz; yol haritası/metin evi/tarama rakamı bulgu verdi (B-039, B-040, B-049). **Kapsanmadı:** `segments.ts`'in ~45 iddiasından 41'i tek tek doğrulanmadı (4'ü sınandı, geçti); BENEFITS 8 maddesi ve 16 `pains` maddesi durum betimlemesi olarak bırakıldı; `legal.ts` iddia açısından taranmadı (B-008/B-024 alanı) |
| M2 Sayfalar | 2026-09-12 | audit-product: 16 rota × 320/390/768/1440 matrisi + zoom %200/%250/%400; sessiz kırpma dedektörü yazıldı; 4 segment + 3 yasal + 404 **ilk kez ölçüldü**; etkileşimli katmanlar (mobil menü, 10 SSS, hesaplayıcı 1→30, yapışkan tur, Roller sekmeleri) açılarak ölçüldü. Bulgular: B-032, B-033, B-034, B-045, B-046. **Kapsanmadı:** gerçek cihaz ve iOS Safari (yazı tipi büyütmesi ekseni hiç sınanmadı); Firefox/WebKit; 360/414/430/1024/1920 genişlikleri; `100dvh`, landscape, klavye açıkken form; hover/focus durum kontrastı |
| M3 Lead hattı | 2026-09-13 | audit-product (dar-derin, TASK-1.12 sonrası): iletişim kuralı ~90 girdilik Türkiye korpusuyla saf fonksiyonda ve canlı uçta sınandı; hedef tanımlı hâl yalıtılmış Vitest + sahte webhook ile ölçüldü (200 `stored:true`); **gerçek pano yapıştırması** (Mac Rehber U+202D/U+202C) ve 5×422→429 kilitlenmesi; formun hata akışı 320/360/375/390/412/1440 × hata türleri, kaydırma bittikten sonra ölçüldü; `tests/contact.test.ts` 8 mutanta karşı sınandı (4'ü hayatta); native GET gönderimin URL'si ve sessiz kaybı yeniden ölçüldü; B-021 kapanış teyidi. Bulgular: B-054, B-055, B-056 (a) — B-021 arşivlendi, B-020'ye yeni tetikleyici. **Kapsanmadı:** başarılı yolun gerçek hedefi (Bunker alıcısı yok — TASK-1.13/1.14) ve Resend teli (TASK-1.06); Resend'in CRLF temizliği ve önekli `reply_to` (`mailto:`, sonda U+200E) kabulü; gerçek cihaz, iOS Safari, Firefox/WebKit, sanal klavye, Chrome otomatik doldurmanın biçimleri; gerçek ekran okuyucu; Vercel'de hız sınırı ve `x-forwarded-for` davranışı (yazan istek atılmadı) |
| M4 Asistan | 2026-09-12 | audit-product: ağaç graf olarak ölçüldü (10 düğüm, 0 ulaşılamaz, 0 çıkışsız, en uzun yol 3 tık), **10/10 düğüm iki kırılımda canlı gezildi**, 14 rotada kaydırma kapısı ölçüldü, yarış koşulu ve JS-kapalı hâl sınandı, iddia sınırı taraması 47 parça → 0 isabet. Bulgular: B-048, B-046 (Roller), B-026 teyidi. **Kapsanmadı:** gerçek ekran okuyucu; Firefox/WebKit; gerçek dokunma girdisi; `global-error` ve 503 durumunda asistan davranışı; F4.3 setinin kendisi (v2.1) |
| M5 Görsel hat | 2026-09-12 | audit-product: **sekiz görselin tamamı gözle okundu** ve tam sızıntı envanteri çıkarıldı (B-018'in kapsam notu kapandı); temizlik tablosu kaynak HTML'e karşı kalem kalem karşılaştırıldı; teslim katmanı `_next/image` yanıtları `sharp` ile açılarak ölçüldü; glif kapsaması CDP ile ölçüldü; fotoğraf kayıt bütünlüğü `diff` ile doğrulandı (tam). Bulgular: B-044, B-046. **Kapsanmadı:** woff2 tablolarının doğrudan ayrıştırılması (bağımlılık yasak, tarayıcı üzerinden ölçüldü); `churn/kampanya/patron-mobil/uye/index/sunum` HTML'leri (hat listesinde yok); Pexels sayfa URL'lerinin çözülmesi |
| M6 Kalite kapıları | 2026-09-13 | audit-product (dar): `npm test` (Vitest, 3 dosya 43 test) koşturuldu ve iletişim testleri mutant sınamasından geçirildi — meşru aileler ve çöp sınıfları sabit değil (B-054); `DemoForm` için bileşen testi altyapısı yok (B-055); `tsc --noEmit` 0, `eslint` 25 hata + 5 uyarı (B-028 ile birebir), `npm audit` 0; çalışan üretim konteynerinin imaj kimliği ölçüldü (B-019 tazelendi); Lighthouse `simulate` ile `devtools` yöntemlerinin ve Lighthouse CLS ile alan CLS'inin ayrıştığı gösterildi (B-057 (c)). Vitest her koşuda gelecekteki Vite ana sürümünde kırılacağını söyleyen uyarı basıyor (`package.json`'da `type` yok) — düşük, kanvasa girmedi. **Kapsanmadı:** `a11y`/`mobile-audit`/`font-guard`/`scan`/`perf` betikleri bu turda koşturulmadı (mantıkları 09-12 denetiminden beri değişmedi; B-030/B-031/B-035 açık); `next build` ile `.env`'in standalone çıktısına girip girmediği hâlâ doğrulanmadı |
| M7 Yayın | 2026-09-13 | audit-product (dar-derin): **performans ilk kez ölçüldü** — önizleme `147c5e8`, 5 rota × Lighthouse 12.8.2 mobil (simulate n=5, devtools n=3) + CDP (CPU 4x/8x) + ~270 doğrulama koşumu; gerçek aktarım muhasebesi, önbellek başlıkları, hidrasyon penceresi, ağ profili (Slow 3G→kısıtsız) ve genişlik (360–430) duyarlılığı. Genel tablo iyi: perf 0,89–1,00, TBT ≤ 51 ms, üçüncü taraf 0, hızlı 4G'de LCP ~0,64 s. **F7.4 Umami izleyicisi** sahte kimlikli yalıtılmış üretim derlemesinde canlıya tek istek atmadan uçtan uca sınandı (yük envanteri, sayım, arıza, tarayıcı izi yok, maliyet ~2,2 KB gzip). `/api/demo` iad1 gecikmesi ~+105–110 ms (SORU satırına işlendi). Bulgular: B-056, B-057. Vercel REST bu turda `forbidden` döndü, CLI çalıştı. **Kapsanmadı:** gerçek cihaz, iOS Safari, gerçek mobil ağ, CrUX/RUM (önizleme noindex); GPU/compositor maliyeti (`backdrop-blur`, `mask-image`); ölçülmeyen rotalar (`/segmentler`, 3 segment, `/gecis`, `/yazilim-secerken`, `/destek`, yasal, 404); `POST /api/demo` süresi; canlı Umami sunucusu (`DISABLE_BOT_CHECK`, nginx logları) ve paneli; Google Search Console (F7.5'in tek bilinmeyeni, erişim kullanıcıda); Vercel Firewall/kota/fatura |

**Yarım tur:** [yok]

<!-- KURAL: Kesilen audit-product turu buraya TEK satır devam notu yazar (odak + nerede kalındı);
     turu tamamlayan/devralan oturum "[yok]"a döndürür. Kümülatif yığma yok. -->

## Bilinçli Tercihler

<!-- KURAL: Kullanıcının "bu bilinçli böyle / düzeltilmeyecek" dediği konuların tek satırlık kayıtları —
     sonraki turların aynı şeyi yeniden bulgulaştırmasını önler: `- [konu] — neden bilinçli (tarih)`.
     İlgili özellik projeden kalkınca satır silinir (uzlaştırma temizler). Mimari kararların evi burası
     değil → docs/DECISIONS.md; buradaki kayıt yalnız denetim süzgecidir. -->

- Sayı sayma animasyonlu istatistik bandı yok — pilot sonucu çıkmadı, yayınlanacak gerçek rakam yok; ayrıca klişe (2026-09-10)
- Web sitesi hizmeti sitede yok — kullanıcı kararı, tek ürün mesajı (2026-09-10; `docs/DECISIONS.md`)
- Ürün görsellerinde `churn.html` ve `kampanya.html` yok — karşılıkları ürünün v1.5'inde, bugünkü ürünün parçası değil (2026-09-10)
- Hız sınırı bellek içi, örnek başına — tek süreç için yeterli, ölçek büyürse taşınır (2026-09-10)
- Header'da "Giriş Yap" yok — `app.alpfitplus.com` yayında değil; v1 kararı (footer'a, ürün canlıya çıkınca) devralındı (2026-09-11)
- Vercel Hobby planı ticari kullanıma kapalı (adil kullanım: ürün/hizmet satışı reklamı ticari sayılır) — risk bilinerek kabul edildi, önizleme Hobby'de kalır; plan kararı alan adı geçişi (F7.5) kapsam tartışmasında yeniden konuşulur (2026-09-11, research-phase)

---

## Bulgu Sistemi — Nasıl Çalışır?

- **Atom dosyası** (`_dev/bulgular/B-NNN-<slug>.md`): numara küresel ve append-only'dir — sıradaki numara = açık **ve arşiv** genelindeki en büyük NNN + 1 (numara asla yeniden kullanılmaz); slug kebab-case ve ASCII. Format:

  ```markdown
  # B-NNN: [Başlık]

  **Önem:** 🔴/🟡/🟢 | **Tip:** [hata / tutarsızlık / tekrar / öneri-ui-ux / öneri-altyapı / ...] | **Alan:** [modül/akış]
  **Kaynak:** [audit-product / TASK-X.YY / PHASE-N / QUICK-NNN / oturum türü] | **Tarih:** [tarih]
  **Durum:** Açık / → Faz N / → TASK-X.YY / ✅ Çözüldü

  ## Gözlem
  [Beklenen vs gözlenen — beklentinin dayanağıyla (kabul kriteri, davranış kuralı, ilke)]

  ## Kanıt
  [Hata: yeniden üretme adımları + file:line / komut çıktısı / konsol-network gözlemi.
   Öneri: gerekçe + somut gözlem + ILKELER uyumu.]

  ## Kök Neden Yönü
  [Biliniyorsa; tahminse "tahmin:" diye işaretle — semptomun kaynağına işaret eder]

  ## Koruma Önerisi
  [Bunu gelecekte ne otomatik yakalardı — test, kontrol, gözlemlenebilirlik; yoksa "—"]

  ## Çözüm Kaydı
  [Arşivlenirken doldurulur: ne yapıldı, hangi task/commit ile — kapanış kapsamıyla; kapsanmayan yüzey kaldıysa o da yazılır]
  ```

- **Yaşam döngüsü:** Gelen Kutusu satırı veya denetim bulgusu → atom + index'e öncelik-sıralı satır → faza/task'a alınınca index satırına işaret (`→ Faz N` / `→ TASK-X.YY`) ve atomun **Durum**'u aynı anda güncellenir (ikisi birlikte — tek taraflı güncelleme drift'tir) → çözüm teyidinde Çözüm Kaydı doldurulur, atomun **Durum**'u `✅ Çözüldü` yapılır, atom `bulgular/archive/`e taşınır, index satırı silinir. Çözüm teyidinin olağan evi **verify-phase Adım 6**'dır (düzeltmesi o fazda yapılıp UAT'den geçen bulgu); faz döngüsünü beklemeden quick ile çözülen bulguda mezuniyeti quick yapar (quick.md → Önemli Kurallar); audit-product uzlaştırması güvenlik ağıdır. Rotası ölen işaret (hedef faz/task çözümsüz kapanmış) uzlaştırmada kaldırılır — bulgu Açık'a döner. Arşivdeki atom **tarihsel dokümandır** — içeriği dondurulur (tarihsel doküman kuralı → CLAUDE.md).
- **Çözüm teyidi kanıt ister:** "muhtemelen çözüldü" arşivletmez — task arşivine/commit'e bak, gerekirse ürünü çalıştırıp doğrula.
- **Kapanış kapsamıyla yazılır:** bulgu çoğu zaman bir sınıfın ilk örneğidir ve düzeltme sınıfın bir bölümünü kapatır; çıplak "kapandı" cümlesi ölçülmemiş yüzeyleri de kapsıyormuş gibi okunur — "X, Y kapsamında kapandı" yaz (task dokümanlarının "Test Sonuçları" KURAL'ının kardeşi). Tam kapanış da bir iddiadır: ölçülmeden yazılmaz. **Kapsanmayan yüzey kaldıysa** Çözüm Kaydı bunu söyler ve kalan, yaşayan bir eve taşınır — arşiv tarihsel kayıttır, oraya bırakılan kalan iş kimseye görünmez; evini kapanışı yapan oturumun kendi kapsam triyajı seçer (verify-phase'te Adım 7).
- **Tip serbest, önem zorunlu:** tip raporlamayı netleştirir; önceliği önem işareti + index sırası belirler.
- **Sınırlar (yanlış-ev koruması):** PRD/vizyon düzeyi fikir → `prd-note` (NOTES.md). Proje-geneli öğrenim/tuzak → MEMORY. Mimari karar → docs/DECISIONS.md. Faz retrosuna ait ders → PHASE-N. Bu kanvas **icra-düzeyi sorun ve öneri** içindir.
- **Kim yazar:** Gelen Kutusu'na her oturum tek satır düşebilir. Kanvas işlemleri bulgularla çalışan oturumlarındır: audit-product (uzlaştırma + yeni bulgular + güvenlik-ağı arşiv/işaret temizliği), discuss-phase (faza alma işareti), verify-phase (faz-kapsamı süpürmesi ve kutu mezuniyetleri — Adım 1, task'a alma işareti — Adım 7, UAT-teyitli arşiv — Adım 6), quick (yalnız kapsamına aldığı bulgunun mezuniyeti), cevabı alan oturum (yalnız SORU satırına `✅ CEVAPLANDI` kancası; versiyon sonunda garantili olarak prd-review). Çok-ajanlı denetimde tek yazar orkestratördür.
