# Phase 3: Görsel ve mobil iyileştirme

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-3.md`) faz HÂLÂ AKTİFKEN `PHASE-3-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-3 · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder. -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). -->

---

## Genel Bilgiler

**Amaç:** Siteyi ziyaretçinin gerçekten gördüğü koşullarda — dar telefon, büyütülmüş yazı, yavaş bağlantı, gerçek cihaz — bölüm bölüm incelemek ve ölçülmüş erişilebilirlik ile mobil kusurlarını kapatmak. Aynı fazda kontrast ve mobil kapıları **ölçtüğünü gerçekten ölçen ve eşik altında kırmızıya dönebilen** hâle getirilir; yoksa bu fazın düzeltmeleri bir sonraki değişiklikte sessizce geri gelir. Faz, alan adı geçişinden önce gelir: ölçülmüş AA ihlallerinin canlıya çıkmaması `ILKELER.md`'nin pazarlıksız maddesidir.

**Milestone:** Site 320 / 390 / 412 / 768 / 1440 px'te, %200 ve %400 büyütmede, hareket azaltma açıkken, JavaScript kapalıyken ve yatay tutuşta bölüm bölüm gezildi; gerçek telefonda uçtan uca tur koşuldu ve çıkan bulgular kanvasa düşüp triyaj edildi. Ölçülmüş beş kontrast ihlali kalmadı ve 320 px'te kesilen metin ya da işlev yok. Telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef en az 44 px. Kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, **boyanan gerçek rengi** ölçüyor, ölçemediğini sayıyor ve eşik altında sıfır-olmayan çıkış kodu veriyor. Ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; Roller sekmeleri doğru ekranı gösteriyor; yazı tipi kümesindeki her karakterin dosyada gerçekten bulunduğu doğrulandı. Beş ölçüm yeşil.

**Not (verify-plan 2026-09-23):** *"Roller sekmeleri doğru ekranı gösteriyor"* iki ayaklıdır ve yalnız biri koşulsuzdur. **Eşleme düzeltmesi koşulsuz** (TASK-3.15: antrenör sekmesi bugün rezervasyon takvimini gösteriyor, doğru içerik üretilen kümede var). **Diyetisyen sekmesinin kendi ekranı ise ürün deposuna iki ekranın eklenmesine bağlıdır** (TASK-3.24, koşullu — kapsam kararı: *"faz bu adıma kilitlenmez"*). Ekranlar gelmezse sekme ödünç görselle kalır; kriterin o ayağı **açık** sayılır, B-046 kanvasta durur ve "bilinçli tercih" kaydı yazılmaz.

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

> `/devflow:research-phase` oturumunda dolduruldu (2026-09-23). Bu turun bütün rakamları bu oturumda ölçüldü; devralınan rakamlar ayrıca **yeniden** ölçüldü.
>
> **Bölme çocuğu:** `PHASE-3-ARASTIRMA.md` — değerlendirilen yaklaşımların tam karşılaştırması, devralınan dokuz iddianın ölçüm tablosu, ölçülmüş tuzakların tamamı ve tanımlayıcı kaynakları (araştırma-detayı).

### Seçilen Yaklaşımlar — özet

Tam karşılaştırma (elenenler, ölçüm çıktıları, rakamlar) → `PHASE-3-ARASTIRMA.md`. Seçilenler:

1. **Kontrast ölçümü piksele taşınır.** İki karenin (normal / metni görünmez) farkından glif maskesi; **metin rengi CSS'ten**, zemin maskenin altındaki **gerçek pikselden**; ata opaklık çarpımı renge uygulanır. Bu oturumda sıfırdan prototiplendi ve B-032'nin kayıtlı rakamlarını **birebir** yeniden üretti. Tek değişiklikle B-031'in üç kör noktasını birden kapatır.
2. **Metin rengi pikselden ALINMAZ.** Prototipin ilk turu bunu yaptı ve 100 ölçümün **95'ini** eşik altı gösterdi — okunan şey metin değil **antialias kenarıydı**. Morfolojik erozyon ince yazıda çalışmıyor. Düzeltmeden sonra eşik altı 95 → 1'e düştü.
3. **Ölçüm penceresi kaydırmalıdır.** Tek ekran ölçümü B-032'nin kalemlerinin **hiçbirini** görmüyor (1440 px'te ilk ekranda 0, sayfa tamamında 21). Sayfa `0,9 × viewport` adımlarla gezilir.
4. **Rota listesi `/sitemap.xml`'den türer.** Araştırma konteyneri yalnız `./research`'ü görüyor, `sitemap.ts` import edilemez. Ölçüldü: **15 + 1 = 16 rota** ve yeni sayfa eklendiğinde liste kendiliğinden büyür.
5. **Kırpma dedektörü muafiyetsiz kurulamaz.** Ham hâli **59 sahte pozitif** verdi (kayan şerit ve yatay kaydırılabilir kaplar bilerek kırpılır). Muafiyetle sonuç: **320 px'te 19 gerçek kırpılmış düğüm, 390 px'te 0.**
6. **Hareket azaltma bir tercih değil, ölçümün ön koşuludur.** Ata opaklık çarpımı uygulandığı anda `Reveal`'in geçiş ortası opaklıkları sahte ihlal üretiyor (beş ara değer ölçüldü). Aynı koşum M2 F2.3'ün hiç ölçülmemiş kriterini de doğruladı: hareket azaltma açıkken ara opaklık kalmıyor.

**Yeni bağımlılık gerekmiyor** — playwright + sharp (ikisi de araştırma konteynerinde kurulu) yetiyor.

### Devralınan dokuz iddianın ölçümü — sonuçlar

Tam tablo (rakamlar ve gerekçeler) → `PHASE-3-ARASTIRMA.md`. Kapsamı değiştiren dört sonuç:

- ⚠️ **"Çalışan piksel-kontrast uygulaması ve kırpma dedektörü scratchpad'de, devralınabilir" — ÇÜRÜDÜ.** Adı geçen altı betiğin hiçbiri makinede yok. **İkisi de bu oturumda sıfırdan yazıldı** ve task planı *"devralınan kodu uyarla"* değil **"yaz"** olarak boyutlandı.
- ⚠️ **"Ölçülmüş beş kontrast ihlali" — EKSİK, gerçek küme daha geniş.** Soluk kartların **başlıkları** kayıttaki hiçbir rakamdan kötü (**1,13:1**); iki yeni yüzey (**3,47** ve **3,65**); gradyanla boyanmış metin 5 değil **11 benzersiz** yerde. Kullanıcı kararı: **hepsi düzelir.**
- ⚠️ **"Antrenör satırı tek satırlık hata, doğru ekran kümede zaten var" — İDDİA EKSİK.** Doğru içerik var ama görsel **1200×866, bir masaüstü ekranı**; antrenör rolü `device: "mobil"`. Ürünün demo destesinde `.phone` yüzeyi üç dosyada var, **antrenör telefonu yok** — bu yüzden istenen ekran sayısı ikiye çıktı.
- ⚠️ **"Font preload HTML'de iki kez yazılmış" — ÇÜRÜDÜ.** Yayınlanan HTML'de **2 etiket**; tekrar yok. Bu alt kalem kapsamdan düştü.

Doğrulananlar: B-032'nin dört kalemi (rakamlar birebir) · B-033 (320 px'te 19 düğüm, 390 px'te 0) · B-022 (390 px'te 6 sayfa, **320 px'te 16 sayfanın 13'ü**) · "157 küçük hedef" → **19 benzersiz kritik hedef** + 324 gövde metni bağlantısı · B-051 (karar günlüğünün üç dosyasında da kayıt yok) · B-046'nın font ayağı (küme doğru, fontlar hiç değişmemiş). B-057'nin **mekanizmaları** kodda doğrulandı ama **rakamları bayat** — düzeltme task'ı kendi öncesi/sonrası ölçümünü kendisi alır.

### Tuzaklar — kısa liste

Tam metin ve ölçümleri → `PHASE-3-ARASTIRMA.md`. Başlıklar: metin rengini pikselden alma · kırpma dedektörünü muafiyetsiz kurma · kontrastı hareket azaltma olmadan ölçme · **yapışkan katmanlar ölçüm dışı bırakıldı ve bu bir borçtur** (Header'ın gezinme bağlantıları hiç ölçülmüyor; kapı onları ayrı bir pasta, kaydırma sıfırdayken ölçmeli) · Roller şeridinin 320 px kalemi kırpma dedektörüne **görünmez** (ayrı ölçüt gerekir) · **3100 bayat olabilir** (`build` konteyneri yeniden yaratmaz, `up -d` gerekir) · **bulamayan seçici betiği yeşil bırakır** (her tur eşleşme sayısını basar).

**Tanımlayıcıların kaynağı** (dosya yolları, hangi çapanın repoda var / yeni / dış olduğu) → `PHASE-3-ARASTIRMA.md`. ⚠️ Satır numaraları faz ilerledikçe kayar; kullanmadan önce `grep -n` ile yeniden konumlandır.

### Teknik Kararlar

- **Kontrast ihlallerinin tamamı bu fazda düzelir** (kullanıcı kararı, 2026-09-23) — kayıtlı beş kalem değil, ölçümün bulduğu küme. Gerekçe: yeni kapı hepsini kırmızıya çevirecek; düzeltilmeyen kalem için kapıya adıyla muafiyet yazmak gerekirdi ve muafiyet listesi zamanla unutulur. **Milestone'un "beş" sayısı ölçümle eskidi; cümle yeniden yazılmaz**, gerçek küme çocuk dokümandaki tablodadır.
- **Kontrast ve mobil kapıları yayın kopyasını ölçer** (kullanıcı kararı) — geliştirme sunucusu yerine üretim konteyneri; bedeli her koşumdan önce imaj tazeliği.
- **Dokunma hedefi kuralının mekanik ölçütü:** buton · form alanı · sekme · menü (`header`/`nav`) · `/demo`, `wa.me` ve `tel:` hedefli bağlantılar **kırmızıya düşürür** (19 hedef); alt bilgi **ve içerik yolu** bağlantıları ölçülür ve raporlanır ama düşürmez.
- **Antrenör ve diyetisyen ekranları birlikte istenir** (kullanıcı kararı); **faz bu adıma kilitlenmez** — gelmezse antrenör sekmesi tek satırlık düzeltmeyi alır ve iki kalem de kanvasta açık durur.
- **Kontrast ölçümü hareket azaltma altında koşar.** Turun diğer üç yeni ekseni (%200/%400 büyütme, JavaScript kapalı, yatay tutuş) keşif turunda kalır ve **kapıya girmez**.
- **Gradyanla boyanmış metin piksel yöntemiyle de ölçülemez** (rengi CSS'te yok) ve ayrı ele alınır: 11 benzersiz metnin rengi kaynağındaki **en açık duraktan** okunur ve zemine karşı sınanır. Bu sınıf kapıda **"ölçülemeyen" değil, kendi dalı** olarak sayılır — yoksa düzeltildikten sonra da eşikte görünmez kalır.

---

## Task Listesi

> `/devflow:plan-phase` oturumunda yazıldı (2026-09-23). **Tablo sırası = çalıştırma sırasıdır** (TASKS-README → Lineer Çalıştırma).

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

Dört küme, sırayla: **keşif** (tur önce koşar, düzeltme listesini eksiksiz yapar) → **kapı** (ölçen kurulur; düzeltmeler ondan sonra hem tanımlanır hem doğrulanır) → **düzeltme** → **görsel/performans**.

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 3.01 | TASK-3.01 | ✅ Tamamlandı | Genişlik turu — 16 sayfa × 320/390/412/768/1440 px, bölüm bölüm |
| 3.02 | TASK-3.02 | ✅ Tamamlandı | Dört yeni eksen turu — %200/%400 büyütme, hareket azaltma, JS kapalı, yatay tutuş |
| 3.03 | TASK-3.03 | ✅ Tamamlandı | Kapı zemini — 16 rota tek kaynaktan, yayın kopyası hedefi, çıkış kodu, kapsam eşiği |
| 3.04 | TASK-3.04 | ✅ Tamamlandı | Kontrast ölçümü piksele taşınır — glif maskesi, ata opaklığı, ekran ekran, hareket azaltma |
| 3.05 | TASK-3.05 | ⬜ Bekliyor | Gradyanla boyanmış metin kapıda kendi dalı olur |
| 3.06 | TASK-3.06 | ⬜ Bekliyor | Başlık hiyerarşisi kontrolü kapıya girer |
| 3.07 | TASK-3.07 | ⬜ Bekliyor | Kırpılmış taşma dedektörü, 320 px ve kaydırılabilir şerit ölçütü |
| 3.08 | TASK-3.08 | ⬜ Bekliyor | Dokunma hedefi — kritik küme kırmızı, gezinme yüzeyi raporlanır |
| 3.09 | TASK-3.09 | ⬜ Bekliyor | Ürün turunun soluk adım kartları AA'ya çıkar (etiket · başlık · gövde) |
| 3.10 | TASK-3.10 | ⬜ Bekliyor | Kapanış çağrısı paragrafı gradyan bant üzerinde AA'ya çıkar (5 sayfa) |
| 3.11 | TASK-3.11 | ⬜ Bekliyor | Gradyanla boyanmış metnin durakları koyulaştırılır |
| 3.12 | TASK-3.12 | ⬜ Bekliyor | Desenli zemin ve kalan iki kontrast yüzeyi |
| 3.13 | TASK-3.13 | ⬜ Bekliyor | 404 / çöküş — dev rakam dekoratif olur, başlık hiyerarşisi düzelir |
| 3.14 | TASK-3.14 | ⬜ Bekliyor | 320 px'te kesilen içerik ve işlev — `Button` tabanı + `FounderProgram` ızgarası |
| 3.15 | TASK-3.15 | ⬜ Bekliyor | Roller — sekme şeridi 320 px'te sığar, görsel eşlemesi düzelir |
| 3.16 | TASK-3.16 | ⬜ Bekliyor | Mobilde ilk ekranda demoya çıkan bir yol — menüye "Demo", yüzen düğme erken |
| 3.25 | TASK-3.25 | ⬜ Bekliyor | Form 503 verdiğinde WhatsApp bağlantısı yazılanları taşır |
| 3.17 | TASK-3.17 | ⬜ Bekliyor | Dönüşüme dokunan 19 hedef 44 px'e çıkar |
| 3.18 | TASK-3.18 | ⬜ Bekliyor | Faydalar bölümünün 8 eşit kartı reddedilen kalıptan çıkar |
| 3.19 | TASK-3.19 | ⬜ Bekliyor | Modüller bölümünün tırtıklı 5'li ızgarası yeniden kurulur |
| 3.20 | TASK-3.20 | ⬜ Bekliyor | `priority`, `sizes` ve hi-dpi varyant tavanı gerçek yerleşime çekilir |
| 3.21 | TASK-3.21 | ⬜ Bekliyor | Geçiş görselleri ağaçtan düşer, dekoratif bantların alt metni boşalır |
| 3.22 | TASK-3.22 | ⬜ Bekliyor | Segment LCP görseli ve yedek yazı tipinin metrik eşlemesi |
| 3.23 | TASK-3.23 | ⬜ Bekliyor | `font-guard` ikinci dal — küme ⊆ woff2 |
| 3.24 | TASK-3.24 | ⬜ Bekliyor | **(koşullu)** Diyetisyen ve antrenör telefon ekranları üretilir |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

**Planlamanın iki yapısal kararı:**

- **Kapı düzeltmelerden önce gelir.** Kullanıcı kararı *"kontrast ihlallerinin tamamı düzelir — kayıtlı beş kalem değil, ölçümün bulduğu küme"* demişti; o kümeyi **tanımlayan** şey yeni kapının kendisidir. Kapı önce kurulunca her düzeltme task'ı hem listesini oradan alır hem kırmızıyı yeşile çevirerek kendini doğrular. Bedeli: TASK-3.03'ten itibaren kapılar faz boyunca kırmızı koşar — CI olmadığı için bu hiçbir şeyi bloke etmez ve kapının çalıştığının kanıtıdır.
- **İki keşif turu kapıdan da önce.** Turlar kapıların kapsamadığı eksenleri (büyütme, JS kapalı, yatay tutuş) tarar ve düzeltme listesini eksiksiz yapar. İkisi de **keşif ayağıdır**: kalan task'ların doğruluğunu değiştiren bir bulgu çıkarsa ayak ✅ kapanır, DURUM Adım'ı `plan`'a çekilir ve `plan-phase` revizyon modu devralır.

**Numara sırası tablo sırasından sapıyor (bilinçli):** `verify-plan` TASK-3.16'yı ikiye böldü — lead hattına ait olan ayak (form düşünce WhatsApp'ın yazılanları taşıması) ayrı bir modülün işi, ayrı dosyaya dokunuyor ve kişisel veriyi bağlantı adresine koyduğu için kendi çağrı-sitesi süpürmesini gerektiriyor. Yeni task en büyük numarayı alır (TASK-3.25) ama **tabloda kaynağının hemen ardında** koşar; ölçüt tablo sırasıdır (TASKS-README → Lineer Çalıştırma).

**Fazı kilitlemeyen iki kalem:** TASK-3.24 ürün deposuna iki ekranın eklenmesine bağlıdır ve gelmezse ❌ İptal edilir (B-046 kanvasta açık kalır); kullanıcının gerçek telefon turu ise task değil, `verify-phase` UAT'ının konusudur.

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
