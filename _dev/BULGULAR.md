# BULGULAR — Proje Sorun Kanvası (Index)

> Bu dosya PRD-altı sorun ve önerilerin **tek evi** ve index'idir. Kaynağı ne olursa olsun —
> audit-product turu ya da herhangi bir oturumda göz ucuyla görülen kapsam-dışı sorun —
> icra-düzeyi kayıt buraya düşer, başka eve dağılmaz. Bulguların detayı
> `_dev/bulgular/B-NNN-<slug>.md` atomlarında yaşar; buradaki her satır o atomlara
> pointer'dır (MEMORY index↔atom deseni: ince index hep okunur, detay gerekince lazy-load).

**Son Güncelleme:** 2026-09-22 — verify-phase (2. tur): faza dokunan sekiz Gelen Kutusu notu süpürüldü, hiçbiri inceleme sonucu çözülmüş çıkmadı (mezuniyet yok); 1c faz-penceresi taraması yeni bulgu üretmedi (gözlenen iki zayıflık B-037 (2) ve B-020'de zaten kayıtlı, çift kayıt açılmadı); bağımlılık tazeliği için bir kutu notu eklendi. Açık bulgu 51 (değişmedi).

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

- [kickoff SORU] Ana sayfa mobilde ~26.000 px, referans rakip de benzer — kısaltılsın mı? Karar kullanıcıda (`modules/M2-Sayfalar-ve-Bolumler.md` F2.1)
- [TASK-1.07 / run-phase] Umami giriş ucunda hız sınırı ve kilitlenme yok, panel internete açık — evi `altyapi/vps` projesi, kayıp olmasın diye burada
- [TASK-1.11] Bunker OS'un canlı n8n `lead-intake-agent`'ı çalışmaz ama açık bir giriş kapısı — evi Bunker OS triyajı (`tasks/archive/TASK-1.11-BUNKER-KESFI.md`)
- [TASK-1.18 / run-phase] UI 🔴 bulgularını (B-032 · B-033 · B-034 · B-031) "Yayın öncesi düzeltmeler" fazına alma önerisi — kullanıcı 2026-09-14: "önce Faz 1 bitsin, arayüz sonra"; karar o fazın discuss-phase'inde. `docs/DECISIONS.md` 2026-09-13 bunları kilitleyen kümeye almamıştı, öneri o seçimi yeniden açar
- [TASK-1.06] Uçtan uca tur fiziksel telefonla değil mobil profilli tarayıcıyla koşuldu — fiziksel cihaz gözlemi "Görsel ve mobil iyileştirme" UAT'ına
- [PHASE-1] `mobile-audit.mjs` bal küpünün bilinçli `left-[-9999px]` konumunu "taşan eleman" sayıyor (`/demo`'da 3 kalem) ve TOPLAM SORUN'u şişiriyor — kapı-kalitesi kümesiyle aynı ev (B-030 · B-031 · B-035)
- [PHASE-1] `tasks/archive/TASK-1.09.md`'nin UAT kriteri "fiyat bölümündeki bir bağlantı `surface=fiyat` üretir" ölçülemez: `PricingBlock`'ta hiç `wa.me`/`tel:` bağlantısı yok. `section[id]` yedeği UAT'ta `sss` üzerinden ölçüldü; `fiyat` etiketi sözlükte tüketicisiz duruyor
- [PHASE-1] Yerel `lead-store` konteyneri iki gündür ayakta (`Up 2 days`, healthy) — kaldırma komutu `memory/yerel-lead-deposu-docker-profili.md`; içindeki test kayıtları hâlâ duruyor (üstteki `[audit-product]` satırı)

- [PHASE-1] `npm outdated` dokuz paketi geride gösteriyor (Next 16.3.4→16.3.5, React 19.2.8→19.3.0, Vitest 4→5, TS 5.9→7); `npm audit` **0 açık** — aciliyet yok ama güncelleme kararı verilmemiş, kurulu bağımlılık botu da yok

- [audit-product] Yerel `lead-store`'da bu denetim turunun **25 test kaydı** duruyor (`Ayse/Pilates`, `Deneme Kisi/Deneme Studyo`, `CSRF/K`, `Zemin/Kontrol`) — silinmedi; sonraki ölçüm bunları gerçek lead sanmasın
- [audit-docs] Kök `CLAUDE.md` → `### Oturum Kapanışı:` gövdesi motorun güncel şablonundan eski (2 satırlık blok ↔ 4 satırlık blok + Terfi kuralı · Ön-hazırlık · dört özel durum · `engel:`/`önerilir:` önek kümesi). Göç ÖLÇÜLDÜ: +7.901 token, parent'ı 15.857 → ~23,8k yapıp kırmızı çizgiyi aşırıyor ve kanonun çaresi ("önce bölme") bu projede tükenmiş — karar gerekiyor; erteleme kaydı `CLAUDE.md` → Oturum Disiplini KURAL yorumunda
- [audit-docs] Kök neden motor düzeyinde: DevFlow'un kendi `templates/CLAUDE-MD.md`'si **20.114 token** (kırmızı çizgide) ve `Oturum Disiplini`'nin doktrin çocuğu yok — proje-özgü kuralı olan hiçbir parent tam uygunlukta çizginin altında kalamıyor. Rota DevFlow'un kendi deposu, bu repo değil
- [audit-docs] `_dev/claude/DOKUMAN-DISIPLINI.md:47` tek satırda 2.141 karakter (1.500 eşiğinin üstünde) — metin motor template'inden birebir geliyor, rota yine DevFlow'un kendi deposu
- [audit-docs] `docs/DECISIONS.md`'deki task atıfları arşivlemede **sistemik** kırılıyor (`tasks/TASK-1.04/1.07/1.09.md` → gerçek yer `tasks/archive/`); dokümanın kendi KURAL'ı "yazılmış karar düzeltilmez" dediği için düzeltilmedi — kural kararı gerekiyor (her arşivleme yeni bir kırık atıf doğuruyor)
- [audit-docs] `docker-compose.yml:23` yorumu üretim imajını `localhost:3001` diye anlatıyor; gerçek eşleme `:30`'da `3100:3000` ve `CLAUDE.md` 3001'i adıyla yasaklıyor — kod olduğu için audit-docs kapsamı dışı

- [audit-product SORU] `DemoForm.tsx:113` `noValidate` ve hız sınırının doğrulamadan önce sayması bilinçli mi? İkisi birlikte M3 F3.1 kriteriyle çelişiyor ve geçerli talebi 429'a düşürüyor (B-020, B-054) — önerim: kota yalnız doğrulamayı geçen isteği saysın, istemci doğrulaması açılsın
- [audit-product SORU] Footer'daki "Giriş Yap" bilinçli mi? Bilinçli Tercihler kaydı yalnız **header**'ı kapsıyor, bağlantı bugün footer'da ve `app.alpfitplus.com` çözümlenmiyor — önerim: ürün canlıya çıkana dek gizlensin, kayıt gerçeği yansıtsın
- [audit-product SORU] `mobile-audit.mjs`'in raporladığı 157 küçük dokunma hedefi kabul mü? M2 F2.3 kriteri "≥ 44 px" diyor ama CLAUDE.md geçme şartı yalnız "yatay kaydırma: yok" (B-015) — önerim: kriter hedef kalsın, kapı kademeli sıkılsın
- [audit-product SORU] Asistan paneli bilinçli olarak **modal olmayan** bir yardımcı mı? `role="dialog"` var ama `aria-modal` yok, odak taşınmıyor (B-017) — önerim: modal olmayan yardımcı kabul edilip rol düzeltilsin
- [audit-product SORU] "İncelediğimiz 9 yerli ve 9 global üründe bu modüle rastlamadık" sitede **yayımlanır** mı? `CLAIMS.md` bu rakamı iç gerekçe olarak tutuyor — önerim: yöntem + tarihle verilsin ya da kaldırılsın
- [audit-product SORU] Ürün görsellerindeki "Aktif · Alpfit Plus konsepti", "Açılış: Şubat 2026 · 4 aylık" ve ciro grafiği bilinçli demo kurgusu mu? "Bir stüdyoda pilot" sınırıyla gerilimde (B-018) — önerim: tarih ve "aktif" rozetleri temizlik tablosuna girsin
- [audit-product SORU] `product.ts` BENEFITS başlıkları ("Kaçan randevu azalır") rakamsız yönlü iyileşme vaadi — `CLAIMS.md` yüzde iyileşmeyi yasaklıyor, rakamsız vaat sınırın içinde mi? — önerim: içinde sayılsın ve CLAIMS'e tek satır açıklık eklensin
- [audit-product SORU] 404 ve `global-error`'daki dekoratif dev rakam (1,17:1) `aria-hidden` + kapı muafiyeti mi alsın, kontrastı mı 3:1'e çıksın? Karar `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyor (B-032, B-045)
- [audit-product SORU] **`npm run lint` bir kapı mı, tavsiye mi?** Ölçüldü (2026-09-22): Next 16 ESLint entegrasyonunu tamamen kaldırmış, `npm run check` yok, `.github/workflows/` yok — yani B-028'in 30 problemine ulaşan **hiçbir otomatik yol yok**. Kapı olacaksa F6.2 tek komutuna elle girmeli; tavsiyeyse açıkça yazılmalı
- [audit-product SORU] Vercel fonksiyon bölgesi **`iad1`** (Washington DC), kenar `fra1` — Türkiye-tek-pazar sitede `/api/demo` Atlantik'i geçiyor; ölçüm: fonksiyon başına ~+105-110 ms, ilk çağrı 987 ms — önerim: F7.5 kapsam tartışmasına girsin
- [audit-product SORU] Roller bölümünde **antrenör** sekmesi masaüstü panosunu telefon çerçevesinde gösteriyor (244×129 px) ve **diyetisyen** sekmesi antrenör ekranını gösteriyor. Vekil bilinçli mi? CLAIMS'in "gerçek fark" dediği tek kalemin sitede kendi görüntüsü yok (B-046)
- [audit-product SORU] `Assistant.tsx`'te `donanim` düğümü **tek yön kapı**: dokuz düğümün hiçbirinin devam sorusunda yok. Bilinçli daraltma mı? — önerim: bir-iki düğümün `next`'ine eklensin ya da chip kümesi her zaman bir kök konusu içersin

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

- 🔴 [B-058 — `.env` üretim Docker imajına gömülü](bulgular/B-058-env-uretim-imajina-gomulu.md) — `.dockerignore` `.env`'i eşlemiyor; beş sır imaj katmanında, 3100 provası sessizce hedefe bağlı
- 🔴 [B-037 — `/api/demo` sertleştirme boşlukları](bulgular/B-037-api-demo-sertlestirme-bosluklari.md) — `content-type` kontrolsüz çapraz-site POST **artık depoya satır yazıyor**; `null` gövde 500; 5 MB gövde kabul
- 🔴 [B-024 — Yasal metinler gerçek veri akışını eksik anlatıyor](bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md) — dört kalem açık; "IP saklamaz" beyanı ölçülen nginx logu gerçeğiyle çelişiyor, `ip_hash` 12 ay saklanıyor
- 🔴 [B-029 — Site, ürünün karşılamadığı beş yeteneği "var" diye sunuyor](bulgular/B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md) — 5/5 hâlâ açık; ürün ilerledi ama hiçbirinin karşılığı doğmadı
- 🔴 [B-018 — Ürün görselinde gerçek kişi adı ve yol haritası özellikleri](bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md) — `sube` kalemi kapandı; "Gizem Ö." ana sayfada duruyor, yasal metnin beyanı çürüyor
- 🔴 [B-054 — İletişim kuralı ters eksende gevşek](bulgular/B-054-iletisim-kurali-ters-eksende-gevsek.md) — meşru yazımlar 422; `0532111223`/`0000000000` **200 `stored:true`** — ulaşılamaz numara artık kayda geçiyor
- 🔴 [B-055 — Demo formunun gönderim sonrası hâli mobilde görünmüyor](bulgular/B-055-demo-formu-hata-akisi-mobilde-gorunmuyor.md) — 320/360'ta **başarı onayı da** ekran dışında; 412'de h1 yapışkan başlığın arkasında
- 🔴 [B-011 — Apex'te MX kaydı yok, KVKK başvuru adresi posta alamıyor](bulgular/B-011-apex-mx-kaydi-yok.md) — yasal metin otuz gün taahhüt ediyor; 2026-09-21'de yeniden ölçüldü, MX hâlâ yok
- 🔴 [B-032 — Ana sayfada ve segment sayfalarında ölçülmüş AA kontrast ihlalleri](bulgular/B-032-olculmus-aa-ihlalleri.md) — ürün turu soluk kartları 2,54:1, kapanış paragrafı 3,48:1; ILKELER pazarlıksız diyor
- 🔴 [B-033 — 320 px'te Kurucu Programı bölümü içerik ve işlev kaybediyor](bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md) — 18 metin düğümü 70 px kesiliyor, CTA etiketi dâhil; kapı yatay kaydırma görmediği için temiz diyor
- 🔴 [B-034 — Mobilde fiyat sayfasının ana çağrısı 52 px yerine 24 px](bulgular/B-034-mobilde-ana-cagri-24px.md) — kırılımsız `flex-1`; 6 rotada 12 örnek, doğru deyim `DemoForm`'da zaten var
- 🔴 [B-020 — Hız sınırı doğrulamadan önce sayıyor, geçerli talep reddediliyor](bulgular/B-020-hiz-siniri-gecerli-talebi-reddediyor.md) — beş kez hata yapan kullanıcının düzeltilmiş talebi 429; 2026-09-22'de yeniden üretildi
- 🔴 [B-030 — Beş kalite kapısının dördü eşik altında bile çıkış kodu 0 döndürüyor](bulgular/B-030-kapilar-kirmiziya-donemiyor.md) — tek `exitCode` `font-guard:52`; betikler 09-13'ten beri hiç değişmedi; depo şema kapısı da varsayılanda kapalı
- 🔴 [B-031 — `a11y.mjs`'in kontrast yöntemi üç kör nokta taşıyor](bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md) — dördü de satır satır yerinde; kökte tek gradyan ölçüleni 157'den 0'a düşürüyor
- 🔴 [B-035 — `perf.mjs` ağırlığı JS ve CSS'e kör, ilan edilmiş regresyon çizgisi geçersiz](bulgular/B-035-perf-agirlik-muhasebesi-kor.md) — `content-length` muhasebesi, sabit BASE, eşiksiz; yöntem bit-bit aynı
- 🔴 [B-015 — Kalite kapıları açılan katmanları ölçmüyor](bulgular/B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) — `a11y`/`mobile-audit` 0 tıklama; desen `font-guard:28-33`'te zaten çalışıyor, kardeşlere taşınmamış
- 🔴 [B-014 — Chat ağacı pilot cümlesini tek kaynaktan değil elle yazıyor](bulgular/B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md) — `site.ts` importu hâlâ yok; `faq.ts` doğru deseni zaten taşıyor
- 🟡 [B-036 — Dört ayrı yol talebi "başarılı" gösterip sessizce kaybediyor](bulgular/B-036-lead-kaybi-yollari.md) — üçü açık; kırpılan e-posta hâlâ 200 `stored:true` alıyor, bal küpü tek log satırı taşımıyor
- 🟡 [B-056 — Umami açıldığı gün hidrasyonsuz gönderimde form verisi analitiğe gidiyor](bulgular/B-056-umami-hidrasyonsuz-gonderimde-kisisel-veri.md) — izleyici tarafı kapandı ve canlıda doğrulandı; zincir artık **aktif**, kaynak tarafı (B-036) ve (b) bot sahte yeşili açık
- 🟡 [B-060 — Yayındaki yasal beyanları koruyan test yok](bulgular/B-060-yasal-beyani-koruyan-kapi-yok.md) — "12 ay", `data-exclude-search` ve görsel beyanı tek satıra bağlı; v1'de çalışan kapı v2'ye taşınmadı
- 🟡 [B-059 — Alan adı geçişinde v1'in lead hattı ve yasal metin davranışları geriler](bulgular/B-059-alan-adi-gecisinde-v1-davranislari-geriler.md) — onay e-postası kaybolur, `notify_lead` kalıcı `pending`, metin bugünkünden az bilgi verir
- 🟡 [B-061 — Lead deposunun tek yedeği aynı sunucuda ve aynı hacimde](bulgular/B-061-lead-deposu-yedegi-ayni-sunucuda.md) — S3 kapalı, yedekler `pb_data/` içinde; geçişten sonra tek dayanıklı hedef orası
- 🟡 [B-016 — CSP yok, v1'de var: yayın güvenliğinde gerileme](bulgular/B-016-csp-yok-v1den-gerileme.md) — 15/15 rotada yok; Umami artık gerçekten yüklendiği için yazma penceresi tam şimdi açık
- 🟡 [B-025 — Çalışma zamanı için hiçbir alarm yok](bulgular/B-025-calisma-zamani-alarm-yok.md) — v1'in `⚠ KAYIT EDİLEMEDİ` e-posta öneki v2'de yok; depo düşerse ekip ayırt edilemeyen bir posta alır
- 🟡 [B-044 — Ürün görselinde avatar-ad uyumsuzluğu ve denetim körlüğü](bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md) — semt kalemi kapandı; körlük hattın dışına uzanıyor (Hero'daki elle yazılmış "%78")
- 🟡 [B-042 — Paylaşım kartı sayfa başına türemiyor, `/foto` önbelleksiz](bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md) — `canonical`/`<title>` kapandı, `FAQPage` eklendi; `og:url` hâlâ 15/15 ana sayfa
- 🟡 [B-043 — F7.5 geçiş yüzeyi tabloda yazandan geniş](bulgular/B-043-f75-gecis-yuzeyi-tablodan-genis.md) — altı varlık adresi 404'e düşecek, `www` haritada yok, 20 adreslik harita bugünkü canlıya karşı doğrulanmadı
- 🟡 [B-039 — Metin bileşende: `SectionHead`/`PageHero`'nun 103 değerinden yalnız 3'ü içerikten](bulgular/B-039-metin-bilesende.md) — "Metin tonu" fazının ön koşulu; eski kanıt komutu geçersizdi, yeni yöntem atomda
- 🟡 [B-040 — Ürün yol haritası dört evde ve zaten ayrışmış](bulgular/B-040-urun-yol-haritasi-dort-evde.md) — 5/4/3/3 ayrışması birebir duruyor; "Kurumsal üyelik" dördün birinde
- 🟡 [B-050 — Dört segment sayfasında pilot nitelemesi hiç geçmiyor](bulgular/B-050-segment-sayfalarinda-pilot-nitelemesi-yok.md) — kaynakta 0, yayındaki HTML'de 0; `PRODUCT_STATUS`'un tek tüketicisi ana sayfa
- 🟡 [B-023 — Fiyat ve iletişim değerleri tek kaynak dışında](bulgular/B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md) — 8 fiyat + 4 iletişim + yeni `Frames.tsx:10`; `CONTACT.phone.display` hâlâ hiç kullanılmıyor
- 🟡 [B-012 — Erişilebilirlik ve mobil kapıları rotaların yarısını gezmiyor](bulgular/B-012-olcum-betikleri-rota-kapsami-eksik.md) — 16 rotadan `a11y` 8, `mobile-audit` 9; üç yasal sayfa ikisinde de yok
- 🟡 [B-019 — Yerel üretim konteyneri bayat, ölçümler geçersiz](bulgular/B-019-uretim-konteyneri-bayat-olcumler-gecersiz.md) — belirtiler kapandı; mekanizma canlı: 3100 bugün TASK-1.15 öncesi yasal metni sunuyor
- 🟡 [B-048 — Asistanda yarış koşulu, mobilde okunmayan cevap, JS kapalıyken hayalet düğmeler](bulgular/B-048-asistan-durum-hatalari.md) — "Baştan" bekleyen zamanlayıcıyı iptal etmiyor, kök chip kümesi kayboluyor
- 🟡 [B-017 — Asistan panelinin erişilebilirlik katmanı eksik](bulgular/B-017-asistan-erisilebilirlik-katmani-eksik.md) — 28 px dokunma hedefi, canlı bölge yok, odak `body`'ye düşüyor; kontrast ve Esc temiz
- 🟡 [B-046 — Görsel teslim: `priority` görünmeyen görselde, Roller sekmesi yanlış ekranı gösteriyor](bulgular/B-046-gorsel-teslim-katmani.md) — Sora'da dört ok glifi yok ve `font-guard` bunu yapısal olarak göremiyor
- 🟡 [B-045 — 404 ve `global-error` markalı değil, istemci çöküşü hiçbir yere yazılmıyor](bulgular/B-045-hata-yuzeyleri.md) — `error` prop'u hiç kullanılmıyor; `globals.css` yüklenmediği için sistem fontuna düşüyor
- 🟡 [B-026 — Dönüş süresi üç farklı biçimde vaat ediliyor](bulgular/B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md) — dört ev, üç vaat; panelde soru kutusu yok ama "sorabilirsiniz" yazıyor
- 🟡 [B-022 — Mobilde ilk ekranda hiçbir dönüşüm yüzeyi yok](bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md) — fiyat sayfası 7.678 px, tepesinde tıklanacak şey yok; huninin geri kalanı sağlam
- 🟡 [B-051 — Ana sayfada üç ikon-kart ızgarası, reddedilen kalıp](bulgular/B-051-ana-sayfada-ikon-kart-izgaralari.md) — `Modules` 5 kart 3 sütunda tırtıklı + 5'li şerit + `Benefits` 8 eşit kart; DECISIONS'ta kayıt yok
- 🟡 [B-047 — Bakım borcu: ölü ilkel 43 yerde elle, tipografi token'ı yok](bulgular/B-047-bakim-borcu-envanteri.md) — `sube` kalemi kapandı; `ui/Card` 0 import, `text-[0.9375rem]` 52; iki kanıt komutu düzeltildi
- 🟡 [B-028 — `npm run lint` kırık: 25 hata + 5 uyarı](bulgular/B-028-lint-kirik.md) — rakam birebir aynı; Next 16 ESLint'i tamamen kaldırmış, lint'e ulaşan **hiçbir** otomatik yol yok
- 🟡 [B-008 — Yasal metinler hukukçu onayı bekliyor](bulgular/B-008-yasal-metin-hukukcu-onayi.md) — dış aktör; metinler gerçek veri akışına göre yazıldı, "örnek metindir" ibaresi yok
- 🟡 [B-010 — Kurucu Programı "ilk 5 kulüp" diyor, kontenjan takibi yok](bulgular/B-010-kurucu-programi-kontenjan.md) — "Kontenjan gerçektir" cümlesi kıtlığı olumlu iddia ediyor; kurucu kararı gerek
- 🟡 [B-009 — Logo geçici; favicon, app ikonu ve OG ondan türüyor](bulgular/B-009-logo-gecici.md) — dış aktör; kalıcı logo gelince `brand-assets.mjs` yeniden koşar
- 🟢 [B-057 — Segment LCP'si dekoratif fotoğraf, font takası yeniden akış](bulgular/B-057-segment-lcp-dekoratif-gorsel-ve-font-takasi.md) — Slow 4G'de 390-430 px LCP 2,6-3,3 s; LH CLS 0,15-0,17
- 🟢 [B-049 — Segment sayfasında yöntem ve tarih taşımayan rakip fiyat iddiası](bulgular/B-049-segment-rakip-fiyat-iddiasi.md) — yöntem+tarih notu yalnız şube ≥ 2 seçilince açılıyor, varsayılan `useState(1)`
- 🟢 [B-027 — Önizleme paylaşımında kart görseli kırık](bulgular/B-027-onizleme-paylasiminda-kart-gorseli-kirik.md) — `og:image` 15/15 sayfada v1 alan adını gösteriyor, hedef 404; `/favicon.ico` de 404
- 🟢 [B-052 — Ürün görseli hattı çıktı klasörünü temizlemiyor](bulgular/B-052-urun-gorseli-cikti-klasoru-temizlenmiyor.md) — düşürülen ekranın `.webp`'i kalıyor; elle aktarım sızıntılı görseli geri koyabilir
- 🟢 [B-053 — Kök `CLAUDE.md` motor şablonundan geride](bulgular/B-053-claude-md-olmayan-next-komutunu-oneriyor.md) — olmayan `next`'i öneriyor, `run-phase` hiç geçmiyor, kapanış bloğu 2 satır (şablon 4); rota `audit-docs`
- 🟢 [B-013 — README ve compose yorumu üretim portunu 3001 gösteriyor](bulgular/B-013-readme-uretim-portu-bayat.md) — gerçek port 3100 (`docker-compose.yml:30`); `README.md:26`'da `--build` da yok

## Kapsama

<!-- KURAL: Alan satırları ÜZERİNE YAZILIR (append log değil). Alanlar projenin doğal bölgeleridir
     (modül/akış düzeyi — MODULE-MAP'le uyumlu ad kullan); audit-product her turun sonunda dokunduğu
     alanların satırını tazeler. Odak seçiminin veri kaynağı budur: en eski bakış + en riskli alan önce. -->

| Alan | Son Bakış | Not |
|------|-----------|-----|
| M1 İçerik ve iddia | 2026-09-22 | audit-product: iddia sızıntısı iki katmanda tarandı (kaynak `src/`+`public/` regex · önizlemeden 5 rota) — 18 rakip adı, ROI, "sadece bizde", müşteri sayısı, "canlı/sahada/müşterilerimiz": **0 gerçek ihlal**. B-029'un beş kalemi ürün deposuna karşı yeniden sınandı (5/5 açık); B-050/B-014/B-040/B-026/B-049 birebir teyit edildi; yeni: Hero'daki elle yazılmış "%78" metriği denetim kapsamı dışında (→ B-044). **Kapsanmadı:** `segments.ts`'in ~45 iddiasının 41'i yine tek tek sınanmadı; `product.ts` BENEFITS ve 16 `pains` maddesi; chat ağacının 11 cevabının tam taraması (2026-09-12 devralındı); `karsilastirma.ts`'in 18 satırlık yöntem+tarih tablosu; taranmayan 11 rota |
| M2 Sayfalar | 2026-09-22 (dar) | audit-product: yalnız `/demo` gönderim akışı 320/360/390/412/768/1440'ta ölçüldü (B-055 dört ayak + iki yeni semptom) ve `scroll-behavior` rota-geçişi animasyonu üretimde doğrulandı. **Kapsanmadı:** 2026-09-12'nin 16 rota × 4 genişlik matrisi tekrarlanmadı; B-032/B-033/B-034/B-045/B-046 yeniden ölçülmedi; gerçek cihaz, iOS Safari, Firefox/WebKit, 1024/1920, landscape, %200 zoom, `prefers-reduced-motion`, JS kapalı |
| M3 Lead hattı | 2026-09-22 | audit-product (derin): uç **gerçek hedef bağlıyken** ilk kez sınandı — B-020/B-054/B-037/B-036/B-025/B-023 yeniden üretildi, üçü ağırlaştı (çapraz-site POST artık yazıyor, çöp numara kayda geçiyor); B-038 konusuz kapandı; yeni B-058 · B-059 · B-061. **Kapsanmadı:** tarayıcı gerektiren ayaklar (JS-kapalı native GET, gerçek pano yapıştırması); `HITS` yük/sel senaryosu (yalnız kod değişmezliği); canlı depo (kayıt sayısı, yedek dosyaları, cron) — sunucu erişimi; `lead-store` hook mantığının koşarak paritesi (sözleşme paketi env kapısıyla atlandı); `lead-store.contract.test.ts`'in 262 satırlık senaryo tablosu |
| M4 Asistan | 2026-09-12 | audit-product: ağaç graf olarak ölçüldü (10 düğüm, 0 ulaşılamaz), 10/10 düğüm iki kırılımda canlı gezildi, yarış koşulu ve JS-kapalı hâl sınandı, iddia taraması 47 parça → 0 isabet. Bulgular: B-048, B-046, B-026. **Kapsanmadı:** bu turda **hiç dokunulmadı**; ayrıca gerçek ekran okuyucu, Firefox/WebKit, gerçek dokunma girdisi, `global-error`/503'te asistan davranışı, F4.3 setinin kendisi (v2.1) |
| M5 Görsel hat | 2026-09-22 (dar) | audit-product: git ölçümü — `public/product`, `research/lib`, `render-product.mjs` 2026-09-13'ten beri **hiç değişmedi** (son dokunuş `5da5bf1`, `sube` ekranı düşürüldü, set 8 → 7). `grup.webp` gözle okundu: "Gizem Ö.", üç avatar-ad uyumsuzluğu, yüzde/ciro kalemleri aynen yerinde; `auditTexts()` iki dallı. **Kapsanmadı:** diğer 6 görsel gözle okunmadı (2026-09-12 envanteri devralındı, dosyalar bit-bazında değişmedi); B-046'nın glif ve teslim ölçümleri; B-052 |
| M6 Kalite kapıları | 2026-09-22 | audit-product: taban ölçüldü — `npm test` **61 PASS + 1 skipped**, `tsc --noEmit` 0, `npm audit` 0 açık, `lint` **30 problem (25+5, birebir aynı)**. Beş betiğin kodu satır satır okundu: B-030/B-031/B-035/B-012/B-015 dördü de yerinde, betikler 09-13'ten beri **hiç değişmedi**; B-015'in başlığı daraltıldı, B-047/B-039'un kanıt komutları düzeltildi. Yeni: lint'e ulaşan hiçbir otomatik yol yok (→ B-028). **Kapsanmadı:** ölçüm betiklerinin hiçbiri **koşturulmadı** (hükümler statik kod kanıtına dayanıyor); `npm run build`; `npm outdated`; M6 modül dokümanının başlangıç çizgisi tablosu |
| M7 Yayın | 2026-09-22 | audit-product (derin): önizlemenin 15 rotası + 404 iki genişlikte tarandı — B-041 (12/15 doğru, üç yasal sayfa `index, follow`), B-016 (CSP 15/15 yok), B-027, B-042 (canonical/title kapandı, FAQPage eklendi), B-019 (belirtiler kapandı, mekanizma canlı). Umami zinciri ilk kez **canlı yüzeyde** doğrulandı: `data-exclude-search` çalışıyor, ek betik yok, ClickTracker 8/8 yüzey doğru, olay yükünde kişisel veri yok. Konsol/network: 15 rota temiz. **Kapsanmadı:** önizlemeye POST yok (YB-2 yalnız 3100'de ölçüldü); B-056 (b) `DISABLE_BOT_CHECK` bilinçli ölçülmedi (kayıt yazardı); nginx logunun bugünkü hâli ve Resend'in güncel veri konumu — sunucu/sağlayıcı erişimi; v1 canlının başlık kıyası; CrUX/RUM; Vercel Firewall/kota/fatura; Google Search Console |

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
