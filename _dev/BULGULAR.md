# BULGULAR — Proje Sorun Kanvası (Index)

> Bu dosya PRD-altı sorun ve önerilerin **tek evi** ve index'idir. Kaynağı ne olursa olsun —
> audit-product turu ya da herhangi bir oturumda göz ucuyla görülen kapsam-dışı sorun —
> icra-düzeyi kayıt buraya düşer, başka eve dağılmaz. Bulguların detayı
> `_dev/bulgular/B-NNN-<slug>.md` atomlarında yaşar; buradaki her satır o atomlara
> pointer'dır (MEMORY index↔atom deseni: ince index hep okunur, detay gerekince lazy-load).

**Son Güncelleme:** 2026-09-12 — audit-product derin turu, bütün proje (filo 9 ajan + doğrulama dalgası): 22 yeni bulgu atomlaştı (7 🔴), Gelen Kutusu'nun üç `[TASK-1.07]` notu mezun oldu, dokuz karar sorusu kutuya düştü ve **dördü aynı oturumda cevaplandı** (ikisi kanca aldı, ikisi B-050 ve QUICK-001'e mezun oldu); B-012'nin hipotezi ölçülüp çürütüldü, B-018'in kapsam notu kapandı. Açık bulgu 43 — rehber eşik (~30) aşıldı, triyaj çağrısı.

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
- [TASK-1.07] Ana sayfada iki ardışık ikon kartı ızgarası (`Modules` 3 sütun + `Benefits` 4 sütun, ikon kümesi tekrar ediyor) — STYLE-GUIDE "jenerik ikonlu kart ızgarası" maddesiyle çelişiyor; Modules'ta 5 kart 3 sütuna dizildiği için ikinci satır tırtıklı bitiyor
- [oturum triyajı] `/devflow:next` motorda yok (rev 4e55308) ama kök `CLAUDE.md` hâlâ listeliyor ve oturum kapanışının varsayılan önerisi olarak gösteriyor; motorun yeni `run-phase` komutu da listede yok — DevFlow Komutları bölümü motorla hizalanmalı (audit-docs)

- [audit-product SORU] `DemoForm.tsx:76` `noValidate` ve hız sınırının doğrulamadan önce sayması bilinçli mi? İkisi birlikte M3 F3.1 kriteriyle çelişiyor ve geçerli talebi 429'a düşürüyor (bkz. B-020) — önerim: kota yalnız doğrulamayı geçen isteği saysın, istemci doğrulaması açılsın
- [audit-product SORU] Footer'daki "Giriş Yap" bilinçli mi? Bilinçli Tercihler kaydı yalnız **header**'ın yokluğunu kapsıyor ("footer'a, ürün canlıya çıkınca"), ama bağlantı bugün footer'da ve `app.alpfitplus.com` çözümlenmiyor — önerim: ürün canlıya çıkana dek gizlensin, kayıt gerçeği yansıtsın
- [audit-product SORU] `mobile-audit.mjs`'in raporladığı 157 küçük dokunma hedefi kabul mü? M2 F2.3 kriteri "≥ 44 px" diyor ama CLAUDE.md geçme şartı yalnız "yatay kaydırma: yok" — kriter mi bayat, kapı mı dar? (bkz. B-015) — önerim: kriter hedef olarak kalsın, kapı kademeli sıkılsın
- [audit-product SORU] Asistan paneli bilinçli olarak **modal olmayan** bir yardımcı mı? `role="dialog"` var ama `aria-modal` yok, odak taşınmıyor, arka plan `inert` değil; M4 F4.1 "odak tuzağı yok" diyor. Cevap B-017'nin düzeltme yönünü belirliyor — önerim: modal olmayan yardımcı kabul edilip rol düzeltilsin
- [audit-product SORU] "İncelediğimiz 9 yerli ve 9 global üründe bu modüle rastlamadık" sitede **yayımlanır** mı? `CLAIMS.md` bu rakamı tablonun "Neden" sütununda, yani iç gerekçe olarak tutuyor; yayımlanan hâli ziyaretçinin doğrulayamayacağı bir tarama iddiası — önerim: yöntem + tarihle birlikte verilsin ya da kaldırılsın
- [audit-product SORU] Ürün görsellerindeki "Aktif · Alpfit Plus konsepti", "Açılış: Şubat 2026 · 4 aylık" ve aylık ciro grafiği bilinçli demo kurgusu mu? Üç şubeli bir zincirin aylardır ürünü kullandığını ima ediyor, "bir stüdyoda pilot" sınırıyla gerilimde (bkz. B-018) — önerim: tarih ve "aktif" rozetleri temizlik tablosuna girsin
- [audit-product SORU] `product.ts` BENEFITS başlıkları ("Kaçan randevu azalır", "Riskteki üye fark edilir") rakamsız yönlü iyileşme vaatleri — `CLAIMS.md` yüzde iyileşmeyi yasaklıyor, rakamsız vaat sınırın içinde mi sayılıyor? — önerim: içinde sayılsın ve CLAIMS'e tek satır açıklık eklensin
- [audit-product SORU] **320 px destekleniyor mu?** ✅ **CEVAPLANDI** (Kıvanç, audit-product 2026-09-12) — **320 px kapsamda, kapıya girsin.** B-033 gerçek bir bulgu olarak kalır; `mobile-audit.mjs`'in ölçtüğü genişlikler listesine 320 eklenir. Pazarlıksız erişilebilirlik maddesi 390 px tabanına daralmaz. WCAG 1.4.10 onu şart koşuyor ve ILKELER erişilebilirliği pazarlıksız sayıyor, ama `mobile-audit.mjs` 320'yi hiç ölçmüyor; B-033'ün içerik+işlev kaybı yalnız orada doğuyor (390'da latent) — önerim: 320 kapıya girsin, çünkü aksi hâlde B-033 bir Bilinçli Tercih'e dönüşür ve pazarlıksız madde daralır
- [audit-product SORU] **v1 canlı sitede kendi kendine barındırılan Umami var** ✅ **CEVAPLANDI** (Kıvanç, audit-product 2026-09-12) — **mevcut kurulum değerlendirilsin.** Umami Cloud kararı yeniden açıldı; kararın evi `docs/DECISIONS.md` ve TASK-1.07 sağlayıcıyı kilitlemeden önce bu değerlendirme yapılmalı. (`umami.kiwiailab.com`, site id yayında, v1'in CSP'si alan adını beyaz listeye almış, betik 200 dönüyor) ve `PHASE-1-ARASTIRMA.md` ile `DECISIONS.md` bundan **hiç söz etmiyor** (grep: 0). Umami **Cloud** kararı bu bilgiyle yeniden mi konuşulmalı? Alan adı geçtiğinde ölçüm iki ayrı kuruluma bölünür ve `alpfitplus.com`'un birikmiş geçmişi kopar — önerim: mevcut örneğe ikinci site olarak eklenmesi değerlendirilsin (ücretsiz katman limiti yok, CSP deseni hazır, geçmiş bitişik kalır). **Zamana duyarlı: TASK-1.07 paralel oturumda açık.**
- [audit-product SORU] 404 ve `global-error`'daki dekoratif dev rakam ("404" ve "Hata", ikisi de 1,17:1) `aria-hidden` + kapı muafiyeti mi alsın, kontrastı mı 3:1'e çıksın? Karar `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyor (bkz. B-032, B-045)
- [audit-product SORU] **`npm run lint` bir kapı mı, tavsiye mi?** Next 16 derleme sırasında ESLint koşturmuyor (doğrulandı), CLAUDE.md ölçüm tablosunda lint yok, `--max-warnings` yok — yani B-028'in 25 hatası hiçbir şeyi kırmızıya çekmiyor. Kapı olacaksa ölçüm tablosuna girmeli ve `research/scripts/` uyarıları da temizlenmeli; tavsiyeyse bu açıkça yazılmalı
- [audit-product SORU] Vercel fonksiyon bölgesi **`iad1`** (Washington DC), kenar `fra1` — Türkiye-tek-pazar bir sitede `/api/demo` Atlantik'i geçiyor (`x-vercel-id: fra1::iad1::`). Bilinçli mi? Değişim tek ayar; süre ölçümü bu turda yapılmadı, kazanç rakamı yok — önerim: F7.5 kapsam tartışmasına girsin
- [audit-product SORU] Roller bölümünde **antrenör** sekmesi masaüstü panosunu telefon çerçevesinde gösteriyor (244×129 px, okunmaz) ve **diyetisyen** sekmesi antrenör ekranını gösteriyor (alt metni bunu açıkça söylüyor). Vekil bilinçli mi? `demo/` altında diyetisyen ekranı yok, yani görseli üretmek M5 kapsam kararı — CLAIMS'in "gerçek fark" dediği tek kalemin sitede kendi görüntüsü yok (bkz. B-046)
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
- 🔴 [B-021 — İletişim formatı hiçbir katmanda doğrulanmıyor](bulgular/B-021-iletisim-formati-dogrulanmiyor.md) — hedef bağlandığı gün ulaşılamaz lead "başarılı" sayılacak; bugün 503 maskeliyor
- 🔴 [B-011 — Apex'te MX kaydı yok, KVKK başvuru adresi posta alamıyor](bulgular/B-011-apex-mx-kaydi-yok.md) — yasal metin otuz gün taahhüt ediyor; `DEMO_TO` de aynı alan adına kurulursa lead sessizce kaybolur
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
- 🟡 [B-037 — `/api/demo` sertleştirme boşlukları](bulgular/B-037-api-demo-sertlestirme-bosluklari.md) — kota istemcinin başlığıyla anahtarlanıyor (yerelde bypass ölçüldü), `null` gövde 500, `content-type` hiç bakılmıyor
- 🟡 [B-038 — `lead-sheet.gs` üç operasyonel sessizlik, testi `catch` dalını hiç koşturmuyor](bulgular/B-038-lead-sheet-operasyonel-sessizlikleri.md) — sözleşmenin dayandığı tek dal güvencesiz; TASK-1.04 hâlâ açıkken düzeltilebilir
- 🟡 [B-041 — Üç yasal sayfa noindex'in üçüncü katmanını eziyor](bulgular/B-041-yasal-sayfalar-noindex-eziyor.md) — canlı önizlemede `index, follow` servis ediliyor; faz ölçüm tablosu bunu yeşil gösteriyor
- 🟡 [B-024 — Yasal metinler gerçek veri akışını eksik anlatıyor](bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md) — IP, yurt dışı aktarım, onay kapsamı; hukukçuya gönderimden (B-008) önce düzeltilmeli
- 🟡 [B-016 — CSP yok, v1'de var: yayın güvenliğinde gerileme](bulgular/B-016-csp-yok-v1den-gerileme.md) — analitik eklenirken yazmak için doğal an; pencere kapanırsa bir daha zor açılır
- 🟡 [B-025 — Çalışma zamanı için hiçbir alarm yok](bulgular/B-025-calisma-zamani-alarm-yok.md) — "hiçbir hedefe yazılamadı" satırı yalnız Hobby loglarına düşüyor; kimse haber almaz
- 🟡 [B-044 — Ürün görselinde semt baş harfi sızıntısı ve avatar-ad uyumsuzluğu](bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md) — "Vadi" yazan karede "BŞ" duruyor; denetim 21 sızıntı dizgesinin 20'sine kör
- 🟡 [B-042 — Paylaşım kartı sayfa başına türemiyor, `/foto` önbelleksiz, JSON-LD geriledi](bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md) — 15 sayfanın `og:url`'ü ana sayfa; WhatsApp birincil kanal
- 🟡 [B-043 — F7.5 geçiş yüzeyi tabloda yazandan geniş](bulgular/B-043-f75-gecis-yuzeyi-tablodan-genis.md) — altı varlık adresi 200'den 404'e düşecek, `www` haritada yok; geçişin DNS işi olmadığı da ölçüldü
- 🟡 [B-039 — Metin bileşende: 402 gömülü prose, 70 bölüm başlığının 67'si literal](bulgular/B-039-metin-bilesende.md) — "Metin tonu" fazının ön koşulu; kriteri bugünkü envanterle sağlanamaz
- 🟡 [B-040 — Ürün yol haritası dört evde ve zaten ayrışmış](bulgular/B-040-urun-yol-haritasi-dort-evde.md) — "Kurumsal üyelik" dördün birinde; kullanım koşullarının "ayrı ayrı belirtilir" taahhüdü tutmuyor
- 🟡 [B-050 — Dört segment sayfasında pilot nitelemesi hiç geçmiyor](bulgular/B-050-segment-sayfalarinda-pilot-nitelemesi-yok.md) — giriş sayfaları; yasaklı kelime yok ama izin verilen niteleme de yok, B-029'un ağırlığını artırıyor
- 🟡 [B-023 — Fiyat ve iletişim değerleri tek kaynak dışında, on iki yer](bulgular/B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md) — biri JSON-LD'de, biri bileşende; `CONTACT.phone.display` hiç kullanılmıyor
- 🟡 [B-012 — Erişilebilirlik ve mobil kapıları rotaların yarısını gezmiyor](bulgular/B-012-olcum-betikleri-rota-kapsami-eksik.md) — hipotezi ölçülüp çürütüldü; bedeli tek yerde: 404'ün kontrastı ve başlık atlaması
- 🟡 [B-019 — Üretim konteyneri bayat, ölçümler geçersiz](bulgular/B-019-uretim-konteyneri-bayat-olcumler-gecersiz.md) — 24 saat oldu; 3100 noindex'i açık ve rakip adını yayında gösteriyor
- 🟡 [B-048 — Asistanda yarış koşulu, mobilde okunmayan cevap, JS kapalıyken hayalet düğmeler](bulgular/B-048-asistan-durum-hatalari.md) — "Baştan" bekleyen zamanlayıcıyı iptal etmiyor, kök chip kümesi kayboluyor
- 🟡 [B-017 — Asistan panelinin erişilebilirlik katmanı eksik](bulgular/B-017-asistan-erisilebilirlik-katmani-eksik.md) — 28 px dokunma hedefi, canlı bölge yok, odak `body`'ye düşüyor; kontrast ve Esc temiz
- 🟡 [B-046 — Görsel teslim: `priority` görünmeyen görselde, Roller sekmesi yanlış ekranı gösteriyor](bulgular/B-046-gorsel-teslim-katmani.md) — Sora'da dört ok glifi yok ve `font-guard` bunu yapısal olarak göremiyor
- 🟡 [B-045 — 404 ve `global-error` markalı değil, istemci çöküşü hiçbir yere yazılmıyor](bulgular/B-045-hata-yuzeyleri.md) — `error` prop'u hiç kullanılmıyor; `globals.css` yüklenmediği için sistem fontuna düşüyor
- 🟡 [B-026 — Dönüş süresi üç farklı biçimde vaat ediliyor](bulgular/B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md) — asistan "birkaç dakika" + yeşil nokta diyor, site "aynı gün"; panelde soru kutusu yok ama "sorabilirsiniz" yazıyor
- 🟡 [B-022 — Mobilde ilk ekranda hiçbir dönüşüm yüzeyi yok](bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md) — fiyat sayfası 7.678 px, tepesinde tıklanacak şey yok; huninin geri kalanı sağlam
- 🟡 [B-047 — Bakım borcu: ölü ilkel 43 yerde elle, tipografi token'ı yok, ilkel garantisi yok](bulgular/B-047-bakim-borcu-envanteri.md) — `ui/Card` 0 import; `text-[0.9375rem]` 52 yerde; içerik düzenlemesi `Roles`'ı çökertebiliyor
- 🟡 [B-028 — `npm run lint` kırık: 25 hata + 5 uyarı](bulgular/B-028-lint-kirik.md) — rakam birebir aynı; Next 16 derlemede ESLint koşturmuyor, yani hiçbir otomatikte yok
- 🟡 [B-008 — Yasal metinler hukukçu onayı bekliyor](bulgular/B-008-yasal-metin-hukukcu-onayi.md) — dış aktör; metinler gerçek veri akışına göre yazıldı, "örnek metindir" ibaresi yok
- 🟡 [B-010 — Kurucu Programı "ilk 5 kulüp" diyor, kontenjan takibi yok](bulgular/B-010-kurucu-programi-kontenjan.md) — "Kontenjan gerçektir" cümlesi kıtlığı olumlu iddia ediyor; kurucu kararı gerek
- 🟡 [B-009 — Logo geçici; favicon, app ikonu ve OG ondan türüyor](bulgular/B-009-logo-gecici.md) — dış aktör; kalıcı logo gelince `brand-assets.mjs` yeniden koşar
- 🟢 [B-049 — Segment sayfasında yöntem ve tarih taşımayan rakip fiyat iddiası](bulgular/B-049-segment-rakip-fiyat-iddiasi.md) — rakamlı kıyas yöntem+tarih taşıyor ama yalnız şube ≥ 2 seçilince açılıyor
- 🟢 [B-027 — Önizleme paylaşımında kart görseli kırık](bulgular/B-027-onizleme-paylasiminda-kart-gorseli-kirik.md) — `og:image` v1'in alan adını gösteriyor, o adres 404; F7.2 kriterindeki "16 sayfa" da 15 olmalı
- 🟢 [B-013 — README ve compose yorumu üretim portunu 3001 gösteriyor](bulgular/B-013-readme-uretim-portu-bayat.md) — gerçek port 3100; komutta `--build` da yok

## Kapsama

<!-- KURAL: Alan satırları ÜZERİNE YAZILIR (append log değil). Alanlar projenin doğal bölgeleridir
     (modül/akış düzeyi — MODULE-MAP'le uyumlu ad kullan); audit-product her turun sonunda dokunduğu
     alanların satırını tazeler. Odak seçiminin veri kaynağı budur: en eski bakış + en riskli alan önce. -->

| Alan | Son Bakış | Not |
|------|-----------|-----|
| M1 İçerik ve iddia | 2026-09-12 | audit-product: 10 içerik dosyası tamamen okundu; ~45 yetenek iddiası **ürün deposuna karşı sınandı** ve beşi karşılıksız çıktı (B-029); rakip adı `src/`+`public/`'te ve 15 render rotada temiz; yol haritası/metin evi/tarama rakamı bulgu verdi (B-039, B-040, B-049). **Kapsanmadı:** `segments.ts`'in ~45 iddiasından 41'i tek tek doğrulanmadı (4'ü sınandı, geçti); BENEFITS 8 maddesi ve 16 `pains` maddesi durum betimlemesi olarak bırakıldı; `legal.ts` iddia açısından taranmadı (B-008/B-024 alanı) |
| M2 Sayfalar | 2026-09-12 | audit-product: 16 rota × 320/390/768/1440 matrisi + zoom %200/%250/%400; sessiz kırpma dedektörü yazıldı; 4 segment + 3 yasal + 404 **ilk kez ölçüldü**; etkileşimli katmanlar (mobil menü, 10 SSS, hesaplayıcı 1→30, yapışkan tur, Roller sekmeleri) açılarak ölçüldü. Bulgular: B-032, B-033, B-034, B-045, B-046. **Kapsanmadı:** gerçek cihaz ve iOS Safari (yazı tipi büyütmesi ekseni hiç sınanmadı); Firefox/WebKit; 360/414/430/1024/1920 genişlikleri; `100dvh`, landscape, klavye açıkken form; hover/focus durum kontrastı |
| M3 Lead hattı | 2026-09-12 | audit-product: protokol yüzeyi (6 yöntem, 5 content-type, 20 MB gövde), e-posta yükü izole edilip basıldı, `LEAD_FILE_PATH` 200 eşzamanlı yazımla sınandı, `lead-sheet.gs` güvenlik incelemesi + 21 formül-kaçış adayı, tarayıcıda 5 gönderim ve JS-kapalı tur. Bulgular: B-036, B-037, B-038. **Kapsanmadı:** başarılı yol (200 + gerçek satır) ve Resend telinin kendisi — env yok, **TASK-1.06'da kalıyor**; Resend'in CRLF temizliği; Sheets'in değer yorumlaması (baştaki sıfır, tarih); Vercel'in `x-forwarded-for` davranışı (yazan istek atılmadı) |
| M4 Asistan | 2026-09-12 | audit-product: ağaç graf olarak ölçüldü (10 düğüm, 0 ulaşılamaz, 0 çıkışsız, en uzun yol 3 tık), **10/10 düğüm iki kırılımda canlı gezildi**, 14 rotada kaydırma kapısı ölçüldü, yarış koşulu ve JS-kapalı hâl sınandı, iddia sınırı taraması 47 parça → 0 isabet. Bulgular: B-048, B-046 (Roller), B-026 teyidi. **Kapsanmadı:** gerçek ekran okuyucu; Firefox/WebKit; gerçek dokunma girdisi; `global-error` ve 503 durumunda asistan davranışı; F4.3 setinin kendisi (v2.1) |
| M5 Görsel hat | 2026-09-12 | audit-product: **sekiz görselin tamamı gözle okundu** ve tam sızıntı envanteri çıkarıldı (B-018'in kapsam notu kapandı); temizlik tablosu kaynak HTML'e karşı kalem kalem karşılaştırıldı; teslim katmanı `_next/image` yanıtları `sharp` ile açılarak ölçüldü; glif kapsaması CDP ile ölçüldü; fotoğraf kayıt bütünlüğü `diff` ile doğrulandı (tam). Bulgular: B-044, B-046. **Kapsanmadı:** woff2 tablolarının doğrudan ayrıştırılması (bağımlılık yasak, tarayıcı üzerinden ölçüldü); `churn/kampanya/patron-mobil/uye/index/sunum` HTML'leri (hat listesinde yok); Pexels sayfa URL'lerinin çözülmesi |
| M6 Kalite kapıları | 2026-09-12 | audit-product: beş betiğin **mantığı denetlendi ve çıkış kodları deneysel olarak sınandı** (birebir kopyalarla, boş sunucu ve ölü hedefe karşı); kapsam çöküşü kontrollü deneyle kanıtlandı; bağımsız karşı-ölçüm yazıldı; `tsc --noEmit` temiz, `npm audit` 0 açık; altıncı otomatik kontrol (`lead-sheet.test.mjs`) envanterde olmadığı tespit edildi. Bulgular: B-030, B-031, B-035. **Kapsanmadı:** `perf.mjs`, `scan.mjs`, `chat-test.mjs` koşturulmadı (süre ölçümü kapsam dışı / `research/out/` yazıyorlar); `next build` koşturulmadı, `.env`'in standalone çıktısına girip girmediği doğrulanamadı; a11y karşı-ölçümü yalnız 1440×900 |
| M7 Yayın | 2026-09-12 | audit-product: **Vercel proje ayarları REST ile okundu** (`framework`, `autoExposeSystemEnvs`, bölge, SSO, env ad kümesi, 7 dağıtım); 31 adreslik yanıt matrisi + 14 kenar durum; dağıtım-özel ve git-dal adreslerinin korumalı olduğu doğrulandı; **F7.5'in 20 adresi v1'e karşı tek tek ölçüldü** ve geçişin DNS işi olmadığı kanıtlandı; DNS 14 sorgu iki çözümleyiciyle; 21 güvenlik yoklaması. Bulgular: B-041, B-042, B-043. **Kapsanmadı:** Google Search Console (v1'in gerçekten indekslenmiş kümesi — F7.5'in tek kalan bilinmeyeni, erişim kullanıcıda); Resend ve Umami panoları; Vercel Firewall/kota/fatura; **performans, TTFB, LCP, sayfa ağırlığı hiç ölçülmedi** (üretim imajı bayat, B-019) |

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
