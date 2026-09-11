# BULGULAR — Proje Sorun Kanvası (Index)

> Bu dosya PRD-altı sorun ve önerilerin **tek evi** ve index'idir. Kaynağı ne olursa olsun —
> audit-product turu ya da herhangi bir oturumda göz ucuyla görülen kapsam-dışı sorun —
> icra-düzeyi kayıt buraya düşer, başka eve dağılmaz. Bulguların detayı
> `_dev/bulgular/B-NNN-<slug>.md` atomlarında yaşar; buradaki her satır o atomlara
> pointer'dır (MEMORY index↔atom deseni: ince index hep okunur, detay gerekince lazy-load).

**Son Güncelleme:** 2026-09-11 — audit-product derin turu (M4 asistan · M1 iddia sızıntısı · M7 yayın yüzeyi · dönüşüm hunisi): 18 yeni bulgu atomlaştı (6 🔴), Gelen Kutusu'nun üç doğrulanabilir notu mezun oldu, yedi karar sorusu kutuya düştü; TASK-1.07 satırlarına dokunulmadı (paralel oturum).

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
- [TASK-1.07] `FounderProgram.tsx:37` ızgara çocuklarında `min-w-0` yok — mobilde (390px) iki track 350 yerine 370px oluyor, bölümün `overflow-hidden`'ı sağ boşluğu sessizce kırpıyor; tarayıcıda `min-width:0` ile 370→350 doğrulandı
- [TASK-1.07] `mobile-audit.mjs` **sessiz kırpmayı görmüyor** — `overflow-hidden` ile kırpılan taşma sayfa yatay kaydırması üretmediği için kapı "taşan eleman: 0" diyor; yukarıdaki bulgu bu kör noktadan geçti (kapı işi → M6)
- [TASK-1.07] Ürün turu ekran görüntüleri mobilde 302px'e iniyor (masaüstünde 760px, aynı kaynak) — masaüstü panosu bu ölçekte okunmuyor; mobil için kırpma ya da ayrı görsel gerekebilir (M5/M2)
- [TASK-1.07] Ana sayfada iki ardışık ikon kartı ızgarası (`Modules` 3 sütun + `Benefits` 4 sütun, ikon kümesi tekrar ediyor) — STYLE-GUIDE "jenerik ikonlu kart ızgarası" maddesiyle çelişiyor; Modules'ta 5 kart 3 sütuna dizildiği için ikinci satır tırtıklı bitiyor

- [audit-product SORU] `DemoForm.tsx:76` `noValidate` ve hız sınırının doğrulamadan önce sayması bilinçli mi? İkisi birlikte M3 F3.1 kriteriyle çelişiyor ve geçerli talebi 429'a düşürüyor (bkz. B-020) — önerim: kota yalnız doğrulamayı geçen isteği saysın, istemci doğrulaması açılsın
- [audit-product SORU] Footer'daki "Giriş Yap" bilinçli mi? Bilinçli Tercihler kaydı yalnız **header**'ın yokluğunu kapsıyor ("footer'a, ürün canlıya çıkınca"), ama bağlantı bugün footer'da ve `app.alpfitplus.com` çözümlenmiyor — önerim: ürün canlıya çıkana dek gizlensin, kayıt gerçeği yansıtsın
- [audit-product SORU] `mobile-audit.mjs`'in raporladığı 157 küçük dokunma hedefi kabul mü? M2 F2.3 kriteri "≥ 44 px" diyor ama CLAUDE.md geçme şartı yalnız "yatay kaydırma: yok" — kriter mi bayat, kapı mı dar? (bkz. B-015) — önerim: kriter hedef olarak kalsın, kapı kademeli sıkılsın
- [audit-product SORU] Asistan paneli bilinçli olarak **modal olmayan** bir yardımcı mı? `role="dialog"` var ama `aria-modal` yok, odak taşınmıyor, arka plan `inert` değil; M4 F4.1 "odak tuzağı yok" diyor. Cevap B-017'nin düzeltme yönünü belirliyor — önerim: modal olmayan yardımcı kabul edilip rol düzeltilsin
- [audit-product SORU] "İncelediğimiz 9 yerli ve 9 global üründe bu modüle rastlamadık" sitede **yayımlanır** mı? `CLAIMS.md` bu rakamı tablonun "Neden" sütununda, yani iç gerekçe olarak tutuyor; yayımlanan hâli ziyaretçinin doğrulayamayacağı bir tarama iddiası — önerim: yöntem + tarihle birlikte verilsin ya da kaldırılsın
- [audit-product SORU] Ürün görsellerindeki "Aktif · Alpfit Plus konsepti", "Açılış: Şubat 2026 · 4 aylık" ve aylık ciro grafiği bilinçli demo kurgusu mu? Üç şubeli bir zincirin aylardır ürünü kullandığını ima ediyor, "bir stüdyoda pilot" sınırıyla gerilimde (bkz. B-018) — önerim: tarih ve "aktif" rozetleri temizlik tablosuna girsin
- [audit-product SORU] `product.ts` BENEFITS başlıkları ("Kaçan randevu azalır", "Riskteki üye fark edilir") rakamsız yönlü iyileşme vaatleri — `CLAIMS.md` yüzde iyileşmeyi yasaklıyor, rakamsız vaat sınırın içinde mi sayılıyor? — önerim: içinde sayılsın ve CLAIMS'e tek satır açıklık eklensin

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

- 🔴 [B-011 — Apex'te MX kaydı yok, KVKK başvuru adresi posta alamıyor](bulgular/B-011-apex-mx-kaydi-yok.md) — yasal metin otuz gün taahhüt ediyor; `DEMO_TO` de aynı alan adına kurulursa lead sessizce kaybolur
- 🔴 [B-018 — Ürün görselinde gerçek kişi adı, ciro projeksiyonu ve yol haritası özellikleri](bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md) — "sızıntı varsa üretim durur" kuralı işlemedi; yasal metnin "gerçek kişi verisi yok" beyanı çürüyor
- 🔴 [B-021 — İletişim formatı hiçbir katmanda doğrulanmıyor](bulgular/B-021-iletisim-formati-dogrulanmiyor.md) — hedef bağlandığı gün ulaşılamaz lead "başarılı" sayılacak; bugün 503 maskeliyor
- 🔴 [B-020 — Hız sınırı doğrulamadan önce sayıyor, geçerli talep reddediliyor](bulgular/B-020-hiz-siniri-gecerli-talebi-reddediyor.md) — beş kez hata yapan kullanıcının düzeltilmiş talebi 429; ölçüldü
- 🔴 [B-014 — Chat ağacı pilot cümlesini tek kaynaktan değil elle yazıyor](bulgular/B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md) — `PRODUCT_STATUS` değişince asistan eski iddiada kalır; `faq.ts` doğru deseni zaten taşıyor
- 🔴 [B-015 — Kalite kapıları hiçbir şeye tıklamıyor, açılan katmanlar ölçülmüyor](bulgular/B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) — M4 F4.1'in "a11y.mjs ile ölçülür" kriteri sahte yeşil; asistan ve mobil menü hiç açılmıyor
- 🟡 [B-016 — CSP yok, v1'de var: yayın güvenliğinde gerileme](bulgular/B-016-csp-yok-v1den-gerileme.md) — analitik eklenirken yazmak için doğal an; pencere kapanırsa bir daha zor açılır
- 🟡 [B-025 — Çalışma zamanı için hiçbir alarm yok](bulgular/B-025-calisma-zamani-alarm-yok.md) — "hiçbir hedefe yazılamadı" satırı yalnız Hobby loglarına düşüyor; kimse haber almaz
- 🟡 [B-024 — Yasal metinler gerçek veri akışını eksik anlatıyor](bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md) — IP, yurt dışı aktarım, onay kapsamı; hukukçuya gönderimden (B-008) önce düzeltilmeli
- 🟡 [B-019 — Üretim konteyneri bayat, ölçümler geçersiz](bulgular/B-019-uretim-konteyneri-bayat-olcumler-gecersiz.md) — 3100 bugün noindex'i açık ve rakip adını yayında gösteriyor; perf ve font-guard onu ölçüyor
- 🟡 [B-012 — Erişilebilirlik ve mobil kapıları rotaların yarısını gezmiyor](bulgular/B-012-olcum-betikleri-rota-kapsami-eksik.md) — üç yasal sayfa mobil kapısından hiç geçmiyor; font-guard tam listeyi zaten taşıyor
- 🟡 [B-017 — Asistan panelinin erişilebilirlik katmanı eksik](bulgular/B-017-asistan-erisilebilirlik-katmani-eksik.md) — 28 px dokunma hedefi, canlı bölge yok, odak `body`'ye düşüyor; kontrast ve Esc temiz
- 🟡 [B-023 — Fiyat ve iletişim değerleri tek kaynak dışında, on iki yer](bulgular/B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md) — biri JSON-LD'de, biri bileşende; `CONTACT.phone.display` hiç kullanılmıyor
- 🟡 [B-022 — Mobilde ilk ekranda hiçbir dönüşüm yüzeyi yok](bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md) — fiyat sayfası 7.678 px, tepesinde tıklanacak şey yok; huninin geri kalanı sağlam
- 🟡 [B-026 — Dönüş süresi üç farklı biçimde vaat ediliyor](bulgular/B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md) — asistan "birkaç dakika" + yeşil nokta diyor, site "aynı gün"; panelde soru kutusu yok ama "sorabilirsiniz" yazıyor
- 🟡 [B-028 — `npm run lint` kırık: 25 hata + 5 uyarı](bulgular/B-028-lint-kirik.md) — CI'dan önce temizlenmeli ya da kural bilinçle kapatılmalı; kapı ilk günden kırmızı doğmasın
- 🟡 [B-008 — Yasal metinler hukukçu onayı bekliyor](bulgular/B-008-yasal-metin-hukukcu-onayi.md) — dış aktör; metinler gerçek veri akışına göre yazıldı, "örnek metindir" ibaresi yok
- 🟡 [B-010 — Kurucu Programı "ilk 5 kulüp" diyor, kontenjan takibi yok](bulgular/B-010-kurucu-programi-kontenjan.md) — kanıtsız kıtlık iddiasına dönüşme riski; kurucu kararı gerek
- 🟡 [B-009 — Logo geçici; favicon, app ikonu ve OG ondan türüyor](bulgular/B-009-logo-gecici.md) — dış aktör; kalıcı logo gelince `brand-assets.mjs` yeniden koşar
- 🟢 [B-027 — Önizleme paylaşımında kart görseli kırık](bulgular/B-027-onizleme-paylasiminda-kart-gorseli-kirik.md) — `og:image` v1'in alan adını gösteriyor, o adres 404; F7.2 kriterindeki "16 sayfa" da 15 olmalı
- 🟢 [B-013 — README ve compose yorumu üretim portunu 3001 gösteriyor](bulgular/B-013-readme-uretim-portu-bayat.md) — gerçek port 3100; 3001'e giden başka projenin sitesini görebilir

## Kapsama

<!-- KURAL: Alan satırları ÜZERİNE YAZILIR (append log değil). Alanlar projenin doğal bölgeleridir
     (modül/akış düzeyi — MODULE-MAP'le uyumlu ad kullan); audit-product her turun sonunda dokunduğu
     alanların satırını tazeler. Odak seçiminin veri kaynağı budur: en eski bakış + en riskli alan önce. -->

| Alan | Son Bakış | Not |
|------|-----------|-----|
| M1 İçerik ve iddia | 2026-09-11 | audit-product: rakip adı ve üstünlük dili taraması temiz (23 ad, 13 render sayfa); tek-kaynak ve yasal-metin uyumu bulgu verdi (B-014, B-023, B-024, B-026). **Kapsanmadı:** `segments.ts` orta bölümü cümle cümle okunmadı; ~45 özellik iddiası ürün koduna karşı sınanmadı |
| M2 Sayfalar | 2026-09-11 | audit-product: 16 sayfa CTA haritası çıkarıldı, 15 iç bağlantı 200, ölü çapa yok; mobil ilk ekran bulgu verdi (B-022). **Kapsanmadı:** zoom %200/%400, 320 px genişlik, gerçek cihaz |
| M3 Lead hattı | 2026-09-11 | audit-product: 21 senaryoluk form bataryası koştu; 503 yolu dürüst, sahte "gönderildi" yok. Doğrulama ve kota bulgu verdi (B-020, B-021). **Kapsanmadı:** başarılı (200 + gerçek satır) yolu ve Resend hattı hiç denenmedi — TASK-1.06'ya kaldı |
| M4 Asistan | 2026-09-11 | audit-product **ilk turu**: ağaç iddia sınırına sadık, çıkmaz dal yok, kontrast ve Esc temiz; erişilebilirlik ve vaat metni bulgu verdi (B-014, B-017, B-026). **Kapsanmadı:** yalnız dev (3000) ve Chromium; gerçek ekran okuyucu yok; ana sayfa dışındaki rotalarda ölçülmedi |
| M5 Görsel hat | 2026-09-11 | audit-product: sızıntı denetiminin kör noktası bulundu (B-018). **Kapsanmadı:** sekiz görselden ikisi satır satır okundu, kaynak HTML gövdeleri taranmadı — düzeltmede sekizi birden denetlenmeli |
| M6 Kalite kapıları | 2026-09-11 | audit-product: kapıların kendisi denetlendi — rota kapsamı, etkileşim durumu, eşik ve artefakt tazeliği bulgu verdi (B-012, B-015, B-019, B-028) |
| M7 Yayın | 2026-09-11 | audit-product **ilk turu**: noindex üç katmanı ve beş güvenlik başlığı 25 adreste doğrulandı, Vercel soymuyor; CSP, alarm ve OG bulgu verdi (B-016, B-025, B-027). **Kapsanmadı:** Vercel proje ayarları (MCP kimlik doğrulaması gerekti), dağıtım-özel adresler, `www.` ve 301 haritası (F7.5) |

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
