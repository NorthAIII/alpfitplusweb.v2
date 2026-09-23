# Phase 3: Görsel ve mobil iyileştirme

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-3.md`) faz HÂLÂ AKTİFKEN `PHASE-3-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-3 · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder. -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). -->

---

## Genel Bilgiler

**Amaç:** Siteyi ziyaretçinin gerçekten gördüğü koşullarda — dar telefon, büyütülmüş yazı, yavaş bağlantı, gerçek cihaz — bölüm bölüm incelemek ve ölçülmüş erişilebilirlik ile mobil kusurlarını kapatmak. Aynı fazda kontrast ve mobil kapıları **ölçtüğünü gerçekten ölçen ve eşik altında kırmızıya dönebilen** hâle getirilir; yoksa bu fazın düzeltmeleri bir sonraki değişiklikte sessizce geri gelir. Faz, alan adı geçişinden önce gelir: ölçülmüş AA ihlallerinin canlıya çıkmaması `ILKELER.md`'nin pazarlıksız maddesidir.

**Milestone:** Site 320 / 390 / 412 / 768 / 1440 px'te, %200 ve %400 büyütmede, hareket azaltma açıkken, JavaScript kapalıyken ve yatay tutuşta bölüm bölüm gezildi; gerçek telefonda uçtan uca tur koşuldu ve çıkan bulgular kanvasa düşüp triyaj edildi. Ölçülmüş beş kontrast ihlali kalmadı ve 320 px'te kesilen metin ya da işlev yok. Telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef en az 44 px. Kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, **boyanan gerçek rengi** ölçüyor, ölçemediğini sayıyor ve eşik altında sıfır-olmayan çıkış kodu veriyor. Ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; Roller sekmeleri doğru ekranı gösteriyor; yazı tipi kümesindeki her karakterin dosyada gerçekten bulunduğu doğrulandı. Beş ölçüm yeşil.

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

Bu faz bir **bulgu fazıdır**: yeni yetenek getirmez, tamamlanmış feature'ların ziyaretçiye yanlış görünen ya da hiç görünmeyen yerlerini düzeltir. Bu yüzden **feature matrisi değişmez** — yeni satır açılmaz, mevcut atamalar ve ✅ durumları olduğu gibi kalır (Faz 1 ve Faz 2'nin deseninin aynısı). Aşağıdaki tablo hangi feature'a hangi bulguyla dokunulduğunu gösterir.

| Dokunulan feature | Modül | Bulgu ve iş |
|---|---|---|
| F2.1: Ana sayfa | M2-Sayfalar ve Bölümler | **B-032** — ürün turunun soluk adım kartları (2,54:1), kapanış paragrafı, gradyan metin, desenli zemin üstündeki `faint` · **B-033** — 320 px'te Kurucu Programı bölümünde 18 metin düğümü ve CTA etiketi kesiliyor; Roller sekme şeridinde tek kart pencereden geniş · **B-051** — Faydalar'ın 8 eşit kartı ve Modüller'in tırtıklı 5 kartı |
| F2.2: Alt sayfalar | M2-Sayfalar ve Bölümler | **B-032** — dört segment sayfasının kapanış paragrafı, 404 ve çöküş sayfasındaki dev rakam · **B-057** — segment giriş sayfasının LCP'si dekoratif fotoğraf (Slow 4G'de 2,6-3,3 s) ve font takasının yeniden akışı · **B-022** — fiyat, segmentler ve demo sayfalarında ilk ekranda dönüşüm yüzeyi yok |
| F2.3: Ortak yerleşim ve UI ilkelleri | M2-Sayfalar ve Bölümler | **B-033**'ün tabanı — `Button`'ın temel sınıfındaki `whitespace-nowrap` her uzun etiketli çağrıya 280+ px min-content dayatıyor · **B-022** — Header'ın mobil çağrısı (`lg:flex`) ve yüzen düğmenin 480 px eşiği · dokunma hedefi kararı (dönüşüme dokunanlar ≥ 44 px, kapıya girer) |
| F6.1: Beş ölçüm betiği | M6-Kalite Kapıları | **B-031** — kontrast yönteminin üç kör noktası (kökteki tek gradyan bütün sayfayı ölçüm dışına atıyor, ata opaklığı renge uygulanmıyor, gradyanla boyanmış metin hiç ölçülmüyor) + başlık hiyerarşisi · **B-030'un a11y/mobil ayağı** — çıkış kodu, kapsam eşiği, kırpılmış taşma dedektörü · **B-012'nin a11y/mobil ayağı** — 8 ve 9 rota → 16 rota |
| F5.1 / F5.3: Ürün görseli ve font hattı | M5-Görsel Varlık Hattı | **B-046** — Roller eşlemesinin kaymış satırı, `priority` görünmeyen görselde, `opacity-0` görsellerin ekran okuyucuda okunması, dekoratif bantların betimleyici alt metni, `font-guard`'ın "küme ⊆ woff2" dalının yokluğu (Sora'da dört ok glifi yok), hi-dpi varyant tavanı ve `sizes` sapmaları |

---

## Kapsam Tartışması

> `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-23).

**Faz teması iki katmanlı:** ziyaretçinin gördüğü kusurları düzeltmek **ve** o kusurları bulan kapıyı gerçek bir kapı hâline getirmek. Kapsam **dokuz bulgu** + bir keşif turudur: devralınan üçlü (B-032 · B-033 · B-031), kullanıcının kapsama aldığı dört kalem (B-022 · B-051 · B-057 · B-046) ve kapı tarafında iki bulgunun a11y/mobil ayağı (B-030 · B-012).

### Alınan Kararlar

- **Ölçüm yöntemi ve kapı aynı turda düzelir — ama yalnız a11y ve mobil ayağı.** Gerekçe: B-031 düzeltilip çıkış kodu eklenmezse ihlaller görünür olur, kapı yine yeşil kalır (atomun kendi uyarısı) ve bu fazın düzeltmeleri korunmasız kalır. Bu faza giren: kontrast ölçümünün piksele taşınması, ata opaklığının renge uygulanması, `skipped`'ın bir eşik hâline gelmesi, başlık hiyerarşisi kontrolü, `a11y.mjs` + `mobile-audit.mjs` için sıfır-olmayan çıkış kodu, kırpılmış taşma dedektörü ve 320 px genişliği. **Bu faza girmeyen:** `perf.mjs` / `scan.mjs` / `font-guard.mjs`'in çıkış kodu ve kapsam eşikleri, HTTP durumu kontrolü, hedef ölüyken cümleyle durma, tek komut ve CI — hepsi "Kalite kapıları otomatik" fazında kalır.

- **Ölçüm kapsamı 16 sayfanın hepsi olur.** Gerekçe: bu faz "yeşil" kelimesini bir kapıya bağlıyor; 8 ve 9 rotalık bir yeşil dar anlamını korur ve üç yasal sayfa hiç ölçülmemiş kalır. Betikler konteynerde koşuyor, maliyet süredir, elle bekleme değil. B-012'nin kalan ayakları (`perf`, `scan` rota listeleri) kapsam dışı.

- **Keşif fazın başında, gerçek telefon fazın sonunda.** Ekran turunu (320 / 390 / 412 / 768 / 1440 px, bölüm bölüm) fazın ilk işi olarak Claude yürütür; çıkanlar devralınan bulgularla **tek düzeltme listesinde** birleşir. Kullanıcının gerçek telefon turu fazın sonunda, doğrulama olarak koşar. Gerekçe: turu başa almak düzeltme listesini eksiksiz yapar; kullanıcıya bağlı adımı sona almak fazın kilitlenmesini önler (ILKELER — proje-dışı/kullanıcı-tarafı iş fazın bitişini kilitlemez).

- **Turun eksenleri genişletildi — dördü de girdi:** %200 ve %400 büyütme, hareket azaltma tercihi açıkken, JavaScript kapalıyken, telefonu yan çevirince. Gerekçe: dördü de bugüne dek hiçbir kapının ve hiçbir turun kapsamında değildi (`BULGULAR.md` → Kapsama, M2 satırı); ilki 320 px işiyle aynı WCAG kuralından geliyor ve aynı turda ölçülüyor, ikincisinin ölçütü M2 F2.3'te yazılı ama hiç ölçülmemiş.

- **404 ve çöküş sayfasındaki dev rakam dekoratif ilan edilir** (`aria-hidden`), kontrastı yükseltilmez. Gerekçe: görünüş korunur, ekran okuyucu artık okumaz ve kontrast kuralının dışına çıkar; sayfanın asıl başlığı hatayı zaten söylüyor, yani bilgi kaybı yok. Bu karar aynı zamanda `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyordu — B-032'nin beşinci kalemi böyle kapanır. **Sahipsiz alan notu:** 404 ve çöküş sayfası bugüne dek hiçbir feature'ın kabul kriterinde yoktu ve kapı da onları gezmiyordu; 16 rota kararıyla ikisi de kapı listesine girer.

- **Dokunma hedefi kuralı kademeli kurulur.** Dönüşüme dokunan her hedef (butonlar, ana çağrılar, form alanları, menü, asistan) ≥ 44 px'e çıkar **ve kapıya girer**; gövde metni içindeki bağlantılar ve alt bilgi linkleri ölçülür, raporlanır, ama kırmızıya düşürmez. Gerekçe: 157 küçük hedefin çoğu gövde metni içi bağlantı ve hepsini 44 px'e çıkarmak satır aralıklarını açarak tipografiyi bozar; ILKELER'in 1. ekseni (dönüşüm) hangi hedefin kritik olduğunu zaten söylüyor. **Kapı ile kriter arasındaki boşluk** böyle kapanır: M2 F2.3 "≥ 44 px" diyordu, kapının geçme şartı yalnız yatay kaydırmaydı.

- **Mobilde ilk ekran en hafif iki hamleyle çözülür:** hamburger'in yanına sade bir "Demo" bağlantısı ve yüzen düğmenin görünme eşiğinin düşürülmesi. Gerekçe: alt yapışkan çağrı çubuğu dönüşüme daha güçlü etki ederdi ama ekranın bir bölümünü sürekli kaplıyor ve sayfanın havasını değiştiriyor; seçilen iki değişiklik STYLE-GUIDE'ın reddettiği kalıpların hiçbirine girmiyor ve görünümü neredeyse değiştirmiyor. B-022'nin ikincil önerisi (hata anındaki WhatsApp bağlantısının kullanıcının yazdıklarını taşıması) aynı işte ucuz olduğu için kapsamda kalır.

- **Ana sayfa kısaltılmaz; ritim düzeltilir.** 26.399 px'lik uzunluk ölçülmüş bir sorun değil (referans rakip de benzer) ve bölüm silmek ana sayfanın anlatısını değiştirir. Bunun yerine çağrıların sayfaya dağılımı ve yoğun kart bölümü ele alınır — Faydalar'ın 8 kartı zaten yeniden tasarlanıyor, yani uzunluk yan kazanç olarak düşer. Bu, kickoff'tan beri Gelen Kutusu'nda bekleyen sorunun cevabıdır.

- **Kart ızgaralarından ikisi yeniden tasarlanır:** Faydalar'ın 8 eşit kartı (STYLE-GUIDE'ın reddettiği kalıbın birebir tarifi) ve Modüller'in masaüstünde 3+2 dizilip tırtıklı biten 5 kartı. 5'li ikon şeridi olduğu gibi kalır. Gerekçe: üçünü birden yeniden kurmak ana sayfanın orta bölümünü baştan tasarlamak demekti ve fazı birkaç beğeni turuna bağlardı; seçilen ikisi kalıbın en belirgin örnekleri. **Kısıt:** yeniden tasarım metin taşımaz — bütün metin `src/content/`'te kalır (CLAUDE.md → Kod kuralları) ve `docs/CLAIMS.md`'nin iddia sınırı aynen geçerlidir; yeni cümle yazılmaz, mevcut içerik yeniden düzenlenir.

- **Diyetisyen ekranı ürün tarafına eklenir, sonra hat onu üretir.** Roller sekmesindeki kaymış satır (Antrenör yanlış ekranı gösteriyor) tek satırlık bir hatadır ve her hâlde düzeltilir — doğru ekran bugün üretilen kümede zaten var. Diyetisyen sekmesi ise ödünç görsel gösteriyor çünkü ürünün demo destesinde diyetisyen ekranı yok; `docs/CLAIMS.md` diyetisyen modülünü ürünün **tek "gerçek fark"ı** sayıyor ve o farkın sitede kendi görüntüsü yok. Karar: kullanıcı ürün deposunun demo destesine bir diyetisyen ekranı ekler, hat onu olağan biçimde üretir ve temizler. **Bu adım kullanıcıya bağlı olduğu için fazı kilitlemeyecek biçimde ayrı bir işe konur** (ILKELER); gelmezse sekme ödünç görselle kalır ve bulgu kanvasta açık durur — "bilinçli tercih" kaydı yazılmaz, çünkü sonraki denetimlere yanlışlıkla "kapandı" sinyali verirdi.

- **Performans kalemleri kapsamda, ama regresyon çizgisi bu fazda değişmez.** B-057'nin iki ayağı (segment giriş sayfasının dekoratif LCP görseli ve yedek yazı tipinin metrik eşlemesi) ve B-046'nın `priority` / `sizes` / hi-dpi kalemleri düzeltilir. Ama `modules/M6-Kalite-Kapilari.md`'deki başlangıç çizgisinin kendisi (ağırlık muhasebesinin JS ve CSS'e kör olması — B-035, ve Slow 4G + `devtools` yöntemiyle yeniden ölçüm) kapsam dışıdır ve "Kalite kapıları otomatik" fazında kalır. Gerekçe: çizgiyi değiştirmek ölçüm yönteminin kendisini değiştirmektir ve bu fazın kapı işi a11y/mobil ayağıyla sınırlandı.

**Çapraz konular:** *Güvenlik* — bu fazın yüzeyi yok (sunum katmanı, ürün kodu değil); faz penceresinde yeni yüzey açılmıyor. *Hata yönetimi* — 404 ve çöküş sayfaları ilk kez kapı kapsamına giriyor, ama markalanmaları ve istemci çöküşünün kayda yazılması (B-045) kapsam dışı. *Ekran okuyucu* — faz birkaç ekran-okuyucu kalemine dokunuyor (`aria-hidden` kararları, dekoratif alt metinler, başlık hiyerarşisi) ve hepsi **kod tarafından** doğrulanabilir; projede gerçek ekran okuyucu ölçüm kanalı yok ve bu fazda açılmıyor. *İddia sınırı* — yeniden tasarlanan iki bölüm mevcut içeriği yeniden düzenler, yeni iddia yazmaz.

### Kullanıcı Tercihleri

- **Kapı kararı:** ölçüm yöntemi + a11y/mobil kapısı bu fazda; perf/scan/tek komut sonraki fazda.
- **Faz sırası:** Claude'un ekran turu başta, kullanıcının gerçek telefon turu sonda.
- **Ek kapsam:** B-022, B-051, B-057, B-046 — dördü de kapsama alındı.
- **404 rakamı:** dekoratif say, ekran okuyucudan gizle; görünüşü değiştirme.
- **Dokunma hedefi:** önce dönüşüme dokunanlar; gövde metni içi bağlantılar kırmızıya düşürmez.
- **Mobil çağrı:** menüye küçük "Demo" + yüzen düğmeyi erken göster; yapışkan alt çubuk istenmedi.
- **Sayfa uzunluğu:** kısaltma yok, ritim düzelt.
- **Kart ızgaraları:** Faydalar bölümü + Modüller'in tırtıklı ızgarası; 5'li ikon şeridi kalsın.
- **Diyetisyen ekranı:** ürün tarafına eklenecek, bu fazda üretilecek.
- **Tur kapsamı:** %200/%400 büyütme, hareket azaltma, JS kapalı, yatay tutuş — dördü de.
- **Ölçüm kapsamı:** 16 sayfanın hepsi.

### Kapsam Dışı

- **B-030'un kalan ayakları** — `perf.mjs` / `scan.mjs` / `font-guard.mjs`'in çıkış kodu ve kapsam eşikleri, HTTP durumu kontrolü (404/5xx bugün sessizce "geçiyor"), hedef erişilemezken cümleyle durma, depo şema kapısının varsayılanda kapalı olması → **"Kalite kapıları otomatik" fazı**.
- **B-012'nin kalan ayakları** — `perf.mjs` ve `scan.mjs`'in rota listeleri → aynı faz.
- **Tek komut (M6 F6.2) ve CI (M6 F6.3)** → aynı faz. Bu fazda kapılar elle koşturulur; kazanılan şey "koştuğunda kırmızı verebilmesi".
- **B-035 — performans ölçümünün ağırlık muhasebesi ve regresyon çizgisinin yeniden ölçümü** → aynı faz. Bu fazda B-057'nin iki somut kalemi düzelir, ölçüm yöntemi değişmez.
- **B-015 — kapıların açılan katmanları (asistan paneli, sekmeler, menü) ölçmemesi** → aynı faz. Bu fazın Roller sekmesi düzeltmesi bu körlüğün bir bedeliydi, ama dedektörün kendisi orada kurulur.
- **Demo formunun kalıcı tarayıcı ölçüm betiği** (Faz 2'den devredildi) → aynı faz.
- **B-045 — 404 ve çöküş sayfasının markalanması, istemci çöküşünün hiçbir yere yazılmaması.** Bu fazda o sayfalara yalnız kontrast ve kapı kapsamı açısından dokunulur; görsel kimlik ve hata kaydı ayrı iştir.
- **B-051'in üçüncü ızgarası** (Modüller'in 5'li ikon şeridi) — kullanıcı kararıyla olduğu gibi kalır; kanvasta açık durur.
- **B-047 — bakım borcu envanteri** (`ui/Card` hiç import edilmiyor, tipografi token'ı yok, `text-[0.9375rem]` 52 yerde elle). Yeniden tasarlanan iki bölüme dokunurken karşılaşılabilir ama envanterin kendisi → teknik borç fazı.
- **B-017 / B-048 — asistan panelinin erişilebilirlik katmanı ve durum hataları.** JS kapalı turunda asistanın "hayalet düğme" hâli gözlenecek ve bulgusu kaydedilecek, ama asistanın kendi düzeltmeleri bu fazda yapılmaz.
- **Gerçek ekran okuyucuyla deneme** — projede ölçüm kanalı yok; Gelen Kutusu'ndaki `[TASK-2.05]` kalemi (onay kutusunun iki kez duyurulması) kanvasta bekler.
- **Metin tonu (F1.2)** → kendi fazı, alan adı geçişinden sonra. Yeniden tasarlanan bölümlerde cümleler **yeniden yazılmaz**, yalnız yeniden düzenlenir.
- **Alan adı geçişi (F7.5), 301 haritası ve B-011** → sonraki faz.
- **Diğer açık bulgular** (B-037, B-054, B-020, B-036, B-056, B-016, B-025, B-026, B-023, B-028, B-039, B-042, B-043, B-044, B-049, B-050, B-052, B-059, B-061) — bu fazın konusu dışında, kanvasta önceliğiyle bekler.

---

## Araştırma Bulguları

> Bu bölüm `/devflow:research-phase` oturumunda doldurulur.

---

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda doldurulur.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## UAT Sonuçları

> Bu bölüm `/devflow:verify-phase` oturumunda doldurulur.

---

## Retrospektif

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

### Ne İyi Gitti?

### Ne Kötü Gitti?

### Sonraki Faz İçin Öneriler

<!-- Alınan dersler ve tavsiyeler. Memory'den MEZUN EDİLEN öğrenimlerin çapalı tek satırlık kaydı da buraya düşer ("<öğrenim> artık <test/lint/CI/validator/guard> tarafından yakalanıyor — memory'den mezun edildi") — kanon: .claude/commands/devflow/lib/memory-sistemi.md → Supaplar. Kayıt faz ✅ damgalanmadan ÖNCE yazılır. -->

### Task-Spesifik Teknik Öğrenimler

<!-- OPSİYONEL: Bu fazdaki task'larda öğrenilen ama proje genelinde geçerli olmayan teknik nüanslar (araç davranışı, framework bug'ı, vb.). MEMORY.md'nin değil, faz retrosunun evidir. Bu fazda böyle bir nüans çıkmadıysa bu alt bölümü tamamen sil. -->

### DevFlow'a Öneri

<!-- OPSİYONEL: Bu fazda fark edilen, DevFlow yönteminin geneline dair (proje-özel OLMAYAN) iyileştirmeler — aracın kendisinin nasıl çalışması gerektiği. Buraya yazılır + kullanıcıya bildirilir; DevFlow'a ayrı oturumda taşınır. Disiplin çıkmadıysa bu alt bölümü tamamen sil. -->

---

## Kalite Kontrol Sonuçları

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

---

**Oluşturulma:** 2026-09-23
