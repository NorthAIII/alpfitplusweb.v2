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
>
> **Bölme çocuğu:** `PHASE-3-KAPSAM.md` — on bir kararın gerekçeleriyle tam metni, kullanıcı tercihleri ve kapsam dışı listesi (kapsam-tartışması).

**Faz teması iki katmanlı:** ziyaretçinin gördüğü kusurları düzeltmek **ve** o kusurları bulan kapıyı gerçek bir kapı hâline getirmek. Kapsam **dokuz bulgu** + bir keşif turudur: devralınan üçlü (B-032 · B-033 · B-031), kullanıcının kapsama aldığı dört kalem (B-022 · B-051 · B-057 · B-046) ve kapı tarafında iki bulgunun a11y/mobil ayağı (B-030 · B-012).

**Kararların özü — sonraki her oturumun bilmesi gerekenler:**

- **Kapı işi a11y ve mobil ayağıyla sınırlı.** Bu faza giren: kontrast ölçümünün piksele taşınması, ata opaklığının renge uygulanması, `skipped`'ın eşik hâline gelmesi, başlık hiyerarşisi, `a11y.mjs` + `mobile-audit.mjs` için sıfır-olmayan çıkış kodu, kırpılmış taşma dedektörü, 320 px. **Girmeyen:** `perf` / `scan` / `font-guard`'ın çıkış kodu ve kapsam eşikleri, HTTP durumu, hedef ölüyken cümleyle durma, tek komut, CI → hepsi "Kalite kapıları otomatik" fazı.
- **Ölçüm kapsamı 16 sayfanın hepsi.** B-012'nin kalan ayakları (`perf`, `scan` rota listeleri) kapsam dışı.
- **Keşif fazın başında, gerçek telefon fazın sonunda** — kullanıcının gerçek telefon turu `verify-phase` UAT'ının konusudur, task değil (ILKELER: kullanıcı-tarafı iş fazın bitişini kilitlemez).
- **Turun dört yeni ekseni girdi:** %200/%400 büyütme, hareket azaltma, JS kapalı, yatay tutuş. Bunlardan **yalnız hareket azaltma kapıya girdi** (kontrast ölçümünün ön koşulu); diğer üçü keşif turunda kaldı.
- **Dekoratif dev rakam `aria-hidden` alır, kontrastı yükseltilmez** (kullanıcı kararı) — bu karar aynı zamanda `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirledi.
- **Dokunma hedefi kuralı kademeli:** dönüşüme dokunan her hedef ≥ 44 px **ve kapıya girer**; gövde metni ve alt bilgi bağlantıları ölçülür, raporlanır, **kırmızıya düşürmez**.
- **Mobilde ilk ekran en hafif iki hamleyle çözülür** (hamburger yanına "Demo" + yüzen düğmenin eşiği); yapışkan alt çubuk **istenmedi**. B-022'nin ikincil önerisi (503'te WhatsApp'ın yazılanları taşıması) kapsamda kaldı.
- **Ana sayfa kısaltılmaz, ritim düzeltilir**; **iki kart ızgarası** yeniden tasarlanır (Faydalar + Modüller'in tırtıklı 5'lisi), **5'li ikon şeridi olduğu gibi kalır**. Yeniden tasarım **metin taşımaz** — cümle yazılmaz, mevcut içerik yeniden düzenlenir.
- **Diyetisyen ekranı kullanıcıya bağlıydı ve fazı kilitlemeyecek biçimde ayrı bir işe kondu**; gelmezse sekme ödünç görselle kalır, bulgu kanvasta açık durur ve *"bilinçli tercih"* kaydı **yazılmaz** (sonraki denetimlere yanlışlıkla "kapandı" sinyali verirdi). Gerçekleşen: TASK-3.24 ❌ İptal (2026-09-25).
- **Performans kalemleri kapsamda, regresyon çizgisi bu fazda değişmez** (B-035 → sonraki faz).

**Çapraz konular:** *Güvenlik* — fazın yüzeyi yok (sunum katmanı). *Hata yönetimi* — 404 ve çöküş sayfaları ilk kez kapı kapsamına giriyor, markalanmaları (B-045) kapsam dışı. *Ekran okuyucu* — faz birkaç kaleme dokunuyor ve hepsi **kod tarafından** doğrulanabilir; projede gerçek ekran okuyucu ölçüm kanalı **yok** ve bu fazda açılmadı. *İddia sınırı* — yeniden tasarlanan iki bölüm yeni iddia yazmaz.

**Kapsam dışı bırakılanların tam listesi çocuktadır** — başlıkları: B-030 ve B-012'nin kalan ayakları · tek komut (F6.2) ve CI (F6.3) · B-035 · B-015 · demo formunun kalıcı tarayıcı betiği · B-045 · B-051'in üçüncü ızgarası (5'li şerit) · B-047 · B-017/B-048 · gerçek ekran okuyucu denemesi · metin tonu (F1.2) · alan adı geçişi (F7.5) ve B-011 · kanvastaki diğer 19 açık bulgu.

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
| 3.05 | TASK-3.05 | ✅ Tamamlandı | Gradyanla boyanmış metin kapıda kendi dalı olur |
| 3.06 | TASK-3.06 | ✅ Tamamlandı | Başlık hiyerarşisi kontrolü kapıya girer |
| 3.07 | TASK-3.07 | ✅ Tamamlandı | Kırpılmış taşma dedektörü, 320 px ve kaydırılabilir şerit ölçütü |
| 3.08 | TASK-3.08 | ✅ Tamamlandı | Dokunma hedefi — kritik küme kırmızı, gezinme yüzeyi raporlanır |
| 3.09 | TASK-3.09 | ✅ Tamamlandı | Ürün turunun soluk adım kartları AA'ya çıkar (etiket · başlık · gövde) |
| 3.10 | TASK-3.10 | ✅ Tamamlandı | Kapanış çağrısı paragrafı gradyan bant üzerinde AA'ya çıkar (5 sayfa) |
| 3.11 | TASK-3.11 | ✅ Tamamlandı | Gradyanla boyanmış metnin durakları koyulaştırılır |
| 3.12 | TASK-3.12 | ✅ Tamamlandı | Desenli zemin ve kalan iki kontrast yüzeyi |
| 3.13 | TASK-3.13 | ✅ Tamamlandı | 404 / çöküş — dev rakam dekoratif olur, başlık hiyerarşisi düzelir |
| 3.14 | TASK-3.14 | ✅ Tamamlandı | 320 px'te kesilen içerik ve işlev — `Button` tabanı + `FounderProgram` ızgarası |
| 3.15 | TASK-3.15 | ✅ Tamamlandı | Roller — sekme şeridi 320 px'te sığar, görsel eşlemesi düzelir |
| 3.16 | TASK-3.16 | ✅ Tamamlandı | Mobilde ilk ekranda demoya çıkan bir yol — menüye "Demo", yüzen düğme erken |
| 3.25 | TASK-3.25 | ✅ Tamamlandı | Form 503 verdiğinde WhatsApp bağlantısı yazılanları taşır |
| 3.17 | TASK-3.17 | ✅ Tamamlandı | Dönüşüme dokunan 19 hedef 44 px'e çıkar |
| 3.18 | TASK-3.18 | ✅ Tamamlandı | Faydalar bölümünün 8 eşit kartı reddedilen kalıptan çıkar |
| 3.19 | TASK-3.19 | ✅ Tamamlandı | Modüller bölümünün tırtıklı 5'li ızgarası yeniden kurulur |
| 3.20 | TASK-3.20 | ✅ Tamamlandı | `priority`, `sizes` ve hi-dpi varyant tavanı gerçek yerleşime çekilir |
| 3.21 | TASK-3.21 | ✅ Tamamlandı | Geçiş görselleri ağaçtan düşer, dekoratif bantların alt metni boşalır |
| 3.22 | TASK-3.22 | ✅ Tamamlandı | Segment LCP görseli ve yedek yazı tipinin metrik eşlemesi |
| 3.23 | TASK-3.23 | ✅ Tamamlandı | `font-guard` ikinci dal — küme ⊆ woff2 |
| 3.24 | TASK-3.24 | ❌ İptal | **(koşullu)** Diyetisyen ve antrenör telefon ekranları — ön koşul sağlanmadı, kullanıcı iptal etti |
| 3.26 | TASK-3.26 | ✅ Tamamlandı | **(UAT'tan doğdu)** `/gecis`'in altı kontrast kalemi — **beşi kapandı, kapı 6 → 1**; altıncısı ölçümün kusuru çıktı ve kullanıcı kararıyla B-063'e bırakıldı |
| 3.27 | TASK-3.27 | ✅ Tamamlandı | **(UAT'tan doğdu)** Hareket azaltma açıkken çapa kaydırması animasyonsuz olur — `reduce` altında `scroll-behavior` **32 → 0**; asistan çapası **90 kare → 1**, `/demo` sonuç kutusu **20 kare → 2 örnek**; `no-preference` birebir korundu |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

**UAT'tan doğan iki düzeltme task'ı (verify-phase 2026-09-26).** İkisi de kapsam-içi çıktı çünkü **fazın kendi kayıtlı kararları onları kapsıyor**, dışarıda bırakmıyor: (a) *"Kontrast ihlallerinin tamamı bu fazda düzelir — kayıtlı beş kalem değil, ölçümün bulduğu küme"* (Teknik Kararlar, kullanıcı kararı 2026-09-23) — `/gecis`'in altı kalemi tam o ölçümün bulduğu kümededir ve kapıyı bugün kırmızı tutan tek şeydir; onları adlandıran task'ın yokluğu bir kapsam kararı değil **plan boşluğudur** (TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyordu). Üçünün çaresi zaten kararlı (kullanıcının 404 için verdiği *"dekoratif ilan edilir, `aria-hidden` konur"* kararı; aynı sınıf, aynı renk), kalan üçü kontrast düzeltmesi.

> ⚠️ **TASK-3.26 koşuldu (2026-09-26) ve "altı kalem" varsayımı ölçülerek BEŞE indi.** Beşi kapandı — üç dev rakam `aria-hidden` aldı (zemin üç genişlikte de saf beyaz, AX ağacında 0 düğüm, görünüş 0 piksel), iki küçük rakam ise **renkle değil rozetin zemini opaklaştırılarak** AA'ya çıktı (beş rakam birden 8,81). **Altıncı kalem sayfanın kusuru değilmiş:** `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafının kendi kontrastı **7,05** ve zemini saf beyaz; kapıyı kırmızı tutan şey yapışkan başlığın **kendi gliflerinin** o paragrafın ölçüm maskesine sızması — **B-063'ün adı konmamış ikinci yüzü**, iki izolasyonla gösterildi. Naif yama ölçüldü ve yetmedi (6→5 ama gradyan tabanı 19→18, 8 eleman ölçüm dışı). B-063 **bilinçle ertelenmiş** bir borç (verify-plan 2026-09-23), yani kapının 0'a inmesi bu fazın kapsam kararını yeniden açacaktı — **karar kullanıcıya götürüldü ve seçenek B alındı (2026-09-26): kapı `1 · çıkış 1` ile kapanır, kalem B-063'ün açık kaydında durur, betiğe dokunulmaz ve 23 Eylül'deki erteleme bozulmaz;** *"beş ölçüm yeşil"* kriteri bu kalemle birlikte `review-phase` Adım 2'de hükme bağlanacak. Döküm: `tasks/archive/TASK-3.26.md` → **Kapanış Gerekçesi** (kararın tam metni orada) · mekanizma `bulgular/B-063-*.md` + `modules/M6-Kalite-Kapilari.md` → Maske sızıntısı.

(b) Hareket azaltma **bu fazın ekseniydi** (kontrast ölçümünün ön koşulu) ve M2 F2.3'ün kriteri onu adıyla istiyor; ara opaklık ayağı doğrulandı, **çapa kaydırması ayağı açık** ve tek satırlık düzeltme. Kapsam dışı bırakan hiçbir kayıt yok.

**Planlamanın iki yapısal kararı:**

- **Kapı düzeltmelerden önce gelir.** Kullanıcı kararı *"kontrast ihlallerinin tamamı düzelir — kayıtlı beş kalem değil, ölçümün bulduğu küme"* demişti; o kümeyi **tanımlayan** şey yeni kapının kendisidir. Kapı önce kurulunca her düzeltme task'ı hem listesini oradan alır hem kırmızıyı yeşile çevirerek kendini doğrular. Bedeli: TASK-3.03'ten itibaren kapılar faz boyunca kırmızı koşar — CI olmadığı için bu hiçbir şeyi bloke etmez ve kapının çalıştığının kanıtıdır.
- **İki keşif turu kapıdan da önce.** Turlar kapıların kapsamadığı eksenleri (büyütme, JS kapalı, yatay tutuş) tarar ve düzeltme listesini eksiksiz yapar. İkisi de **keşif ayağıdır**: kalan task'ların doğruluğunu değiştiren bir bulgu çıkarsa ayak ✅ kapanır, DURUM Adım'ı `plan`'a çekilir ve `plan-phase` revizyon modu devralır.

**Numara sırası tablo sırasından sapıyor (bilinçli):** `verify-plan` TASK-3.16'yı ikiye böldü — lead hattına ait olan ayak (form düşünce WhatsApp'ın yazılanları taşıması) ayrı bir modülün işi, ayrı dosyaya dokunuyor ve kişisel veriyi bağlantı adresine koyduğu için kendi çağrı-sitesi süpürmesini gerektiriyor. Yeni task en büyük numarayı alır (TASK-3.25) ama **tabloda kaynağının hemen ardında** koşar; ölçüt tablo sırasıdır (TASKS-README → Lineer Çalıştırma).

**Fazı kilitlemeyen iki kalem — biri GERÇEKLEŞTİ:** TASK-3.24 ürün deposuna iki ekranın eklenmesine bağlıydı ve gelmedi, **❌ İptal edildi** (2026-09-25); kullanıcının gerçek telefon turu ise task değil, `verify-phase` UAT'ının konusudur.

**TASK-3.24'ün iptal kaydı (2026-09-25) — kapsam kararının ölçülmüş sonucu.** Ön koşul ölçüldü, varsayılmadı: `../Alpfit.v1/demo/` salt okunur tarandı ve **iki ekranın ikisi de yok** — `diyetisyen.html` diye bir dosya yok ("Diyetisyen" destede yalnız kenar çubuğu menüsü, `uye.html`'in veri alanı, baş sayısı satırları ve sunum slaytları olarak geçiyor), `.phone` yüzeyi **tam üç** dosyada (`takvim` · `grup` · `patron-mobil`) ve `antrenor.html`'de **0**. Deste **2026-06-21**'den beri hiç değişmemiş (`git log -1 -- demo/` → `1fdeac3`; izlenmeyen dosya yok), yani ön koşul geçici değil **kalıcı olarak** sağlanmadı. Ekranları ekleyecek olan kullanıcıydı (`../Alpfit.v1` bu oturumların **salt okunur** deposu) ve *"iptal et, faza devam"* dedi.

**Milestone'un o ayağı bu yüzden AÇIK sayılır** (yukarıdaki verify-plan notu bu hâli zaten tarif ediyordu): *"Roller sekmeleri doğru ekranı gösteriyor"* kriterinin **eşleme ayağı kapandı** (TASK-3.15, koşulsuz), **diyetisyen ayağı açık kaldı** — sekme `SHOTS.grup` ödünç görselini göstermeye devam ediyor (alt metni görüntüde gerçekten duranı anlatıyor, sekmeyle çelişmiyor) ve **B-046 kanvasta durur**. "Bilinçli tercih" kaydı **bilinçle yazılmadı** — sonraki denetimlere yanlışlıkla "kapandı" sinyali verirdi. Hiçbir kod dosyasına dokunulmadı; F5.1'in çıktı sayısı **7'de** doğru olduğu gibi kaldı. Ekranlar sonradan gelirse iş **ayrı bir quick turudur**. Döküm `tasks/archive/TASK-3.24.md`.

---

## UAT Sonuçları

> `/devflow:verify-phase` oturumunda dolduruldu (2026-09-26). **İKİNCİ TUR** — TASK-3.26 ve TASK-3.27 kapandıktan sonra bütün kontroller **baştan** koşuldu. **Kol: otonom** (orkestratörlü koşum — alt ajan kullanıcıyla konuşamaz).
>
> **Bölme çocuğu:** `PHASE-3-UAT.md` — 40 senaryonun tam tablosu, otomatik kontrol dökümü (CI/bot/güvenlik taraması, faz penceresi `6f4eca9..HEAD`), sondanın kendi kusurları ve kapıların kör noktaları (uat).

**Tarih:** 2026-09-26 (2. tur)
**Toplam Senaryo:** 40 | **Geçen:** 32 | **Kalan:** 8

**Küme 38 → 40 büyüdü.** İki yeni senaryo onaylı düzeltme task'larının hiç UAT'lanmamış çıktısını ölçer (Adım 2c): **39** TASK-3.26'nın beş kontrast kalemini üç genişlikte, **40** TASK-3.27'nin ikinci yüzeyini (JS'te açıkça verilen kaydırma davranışı) sınar. **Senaryo 3'ün metni kayıtlı kullanıcı kararına göre yeniden yazıldı** (seçenek B): ölçüt artık `TOPLAM SORUN 0` değil, *sayfa kaynaklı ihlalin kalmaması ve kalem sayısının artmaması* — ve o hâliyle **geçti**.

**Ölçüm yüzeyi:** dört kapı + bu turun UAT sondaları **yayın kopyası (3100)**; `scan.mjs` **geliştirme sunucusu (3000)** — betikte sabit, yani *"konsol temiz"* satırı yayın kopyası için hiç ölçülmedi. Bütün ölçümler TASK-3.27'nin imajına karşı koşuldu (`lastmod` 13:17:16.895Z), dört pozitif çapa ✓ ve dört negatif kontrol 0. ⚠️ **Ölçümlerden sonra imaj bir kez bilerek yeniden derlendi** — tazeleme için değil, TASK-3.27'nin kazara bulduğu tuzağı (`_dev/` dokümanları Tailwind taramasına dahil; doküman metni üretim CSS'ine kural ekliyor) **bu turun kendi yazısına karşı** sınamak için. Sonuç: CSS **85.312 bayt · md5 `5f2d8774…`**, tabanla birebir, kaçak sınıf **0** — bu turun yazısı üretim çıktısını hiç değiştirmedi.

**Beş ölçümün sonucu:** `mobile-audit` ✅ **TOPLAM SORUN 0 · çıkış 0 · ✓ KAPI YEŞİL** (altı kapsam tabanı birebir) · `font-guard` ✅ **iki dal · çıkış 0** (85.129 karakter · 765/765 kesin · 0 sonuçsuz · muaf 10) · `perf` ✅ ağırlık iki koşumda birebir (`/` **111 KB**, çizgi 144 KB; 16 ölçümün 16'sında **CLS 0**) · `scan` ✅ konsol temiz **ama 3000'e karşı** · `a11y` **1 sorun · çıkış 1 — kayıtlı karar** (aşağı bak). Batarya **219 geçti + 2 atlandı**, `tsc` 0, `lint` 30 (yeni yok), `npm audit` 0 açık, Vercel 20/20 `● Ready`.

**`a11y`nin tek kırmızısı bu fazın kabul edilmiş kapanış durumudur.** Kalan kalem `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafı ve bu turda **iki bağımsız yolla** ölçüldü: kapı `p02` **3,25** / med **7,05** / glif **2955px** basıyor (dört rakam TASK-3.26 ile birebir, yani belirlenimli), ama aynı paragraf yapışkan başlığın altından çıkarıldığında **`p02` = `min` = `med` = 7,05** ve zemini saf beyaz — üç genişlikte de. Yani sayfada düzeltilecek bir şey yok; kırmızıyı üreten şey **maske sızıntısıdır** (B-063) ve kalem kullanıcı kararıyla (2026-09-26, seçenek B) açık kayıt olarak durur.

**Kalan sekiz senaryo — üç sınıf, hiçbiri ürün kusuru değil ve hiçbiri düzeltme task'ı doğurmadı:**

- **İki kullanıcı kararı** (kullanıcının kapattığı ya da henüz karar vermediği iş yeniden açılmaz): Roller'in **diyetisyen ayağı** ödünç görselde kaldı — sekme → `grup.webp` 562×281 (TASK-3.24 ❌ İptal, 2026-09-25) · **ön-doldurulan kişisel verinin yasal metinde karşılığı yok** — ölçüldü: `legal.ts`te "WhatsApp" dizesi **0 kez**, KVKK → Aktarım hâlâ **dört tedarikçi**; üç seçenek Gelen Kutusu `[TASK-3.25 SORU]`'da, site `noindex` önizlemede (**yayını bloke etmez, yayından önce kapanmalı**).
- **Altı kalem `kanal: UAT`** — kullanıcının cihazı ya da gözü gerekiyor, alt ajan koşamaz: gerçek telefonla uçtan uca tur (Faz 2'den devredilen form denemesi dâhil) · iki yeniden tasarımın (Faydalar, Modüller) **görünüşünün beğenilmesi** (geri dönüş çapaları `ae80fb0:src/components/sections/Benefits.tsx` ve `git revert c279aa1`) · onay e-postası gelen kutusu/spam · ekran okuyucuda onay kutusunun iki kez duyurulması · `DEMO_TO` e-postasının yerleşimi · Umami panelinin **arayüzünde** v2 kaydı.
- **Önceki turun iki gerçek kusuru kapandı ve ölçülerek doğrulandı:** senaryo **3** artık geçiyor (TASK-3.26 — beş kalem, kapı 6 → 1) ve senaryo **24** yeşile döndü (TASK-3.27 — `reduce` altında `scroll-behavior != auto` eleman **15.874 elemanda 0**, `no-preference`ta **32** birebir; gerçek yüzey `/demo` sonuç kutusu **2 kare / ~16 ms** ↔ **20 kare / ~313 ms**). Yeni senaryo **40** ikinci yüzeyi de kapattı: asistan akışı `reduce`ta **1 karede**, `no-preference`ta **15 karede** kayıyor ve ters çevirme kırmızı üretti — yani ölçüm kör değil.

**Milestone hükmü — "kısmen".** Dokuz kriterin **sekizi** ölçülerek karşılandı: 320 px'te içerik/işlev kaybı yok · ilk ekranda dönüşüm yolu **9 eksende 16/16** · dönüşüm hedefleri ≥ 44 px · kapılar 16 sayfayı geziyor, gerçek rengi ölçüyor, ölçemediğini sayıyor ve eşik altında kırmızıya dönüyor · iki kart ızgarası reddedilen kalıptan çıktı · Roller **eşlemesi** düzeldi · yazı tipi kümesinin her karakteri dosyada bulundu · **ölçülmüş kontrast ihlali kalmadı** (ürün tarafında; kapının tek kalemi ölçüm artefaktı, bağımsız olarak yeniden üretildi). **Biri bilinçli olarak karşılanmıyor:** *"beş ölçüm yeşil"* — `a11y` `1 · çıkış 1` ile kapanır (kullanıcı kararı, seçenek B; betiğe dokunulmaz, B-063'ün ertelemesi bozulmaz) ve `scan`in yeşili yayın kopyasını hiç ölçmüyor. *"Roller sekmeleri doğru ekranı gösteriyor"* kriterinin **diyetisyen ayağı** verify-plan notunun öngördüğü gibi **açık** sayıldı. Hükmün nihai evi `review-phase` Adım 2'dir; emsal: Faz 1 *"milestone kısmen"*, Faz 2 *"milestone tam"*.


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
