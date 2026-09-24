# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-24 — **TASK-3.08 ✅ kapı kümesi tamamlandı: dokunma hedefi iki kulvarlı.** Dönüşüme dokunan hedef 44 px'in altındaysa kapı kırmızı; alt bilgi ve içerik yolu ölçülür, raporlanır, **düşürmez** (kullanıcının kademeli kuralı). Kalibrasyon tuttu: **19 benzersiz** kritik eşik-altı hedef (araştırmanın rakamı birebir) — ama **örnek sayısı 61 değil 125** (alt bilgideki telefon bağlantısı 16 rotanın hepsinde) ve devralınan *"form alanı 250×24"* kalemi **çürüdü** (bugün 302×47, eşiğin üstünde). Eşik 44×44 oldu ve iki boyut da sayılıyor; eski `h<40 && w<200` koşulu geniş-alçak hedefleri gizliyordu. Etiket sarmalı **onay kutusu (18×18) artık ölçülüyor** — ölçülen kutu kontrolün kendisidir, `<label>` değil. Kapı: `TOPLAM SORUN 585 → 285`, çıkış **1**; belirlenimlilik birebir (631 satır). Dört sonda (kırmızı 336/21 · **yeşil, çıkış 0, gezinme 96 eşik altı kaldığı hâlde** · sorun 0 olduğu hâlde kapsam eşiği) ve gerçek sitede şube butonu deneyi **10 → 5 → 10 benzersiz**.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme
**Milestone:** Site dar telefondan büyütülmüş yazıya kadar bölüm bölüm gezildi (gerçek cihaz dâhil) ve çıkanlar triyaj edildi; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; beş ölçüm yeşil. Tam metin ve kapsam kararları: `phases/PHASE-3.md`.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ · plan doğrulama ✅ · **task çalıştırma 🔄 (8/25)** — keşif ayağı kapandı (TASK-3.01 · 3.02, ikisinde de plan revizyonu gerekmedi), **kapı kümesi (3.03-3.08) tamamlandı**: zemin kuruldu (3.03), kontrast dedektörü piksele taşındı (3.04), gradyan metin kendi dalını aldı (3.05), başlık hiyerarşisi ölçülmeye başladı (3.06), mobil kapı 320 px'i ve kesilen içeriği ölçmeye başladı (3.07), dokunma hedefi iki kulvara ayrıldı (3.08). **Sırada düzeltme kümesi var** (3.09-3.17, arada 3.25); her düzeltme kendi kalemini yeşile çevirecek.
**Faz Dokümanı:** `phases/PHASE-3.md` 🔄 (çocuğu: `PHASE-3-ARASTIRMA.md`) · son kapanan: `phases/PHASE-2.md` ✅ (çocukları: `PHASE-2-KAPSAM.md` · `PHASE-2-ARASTIRMA.md` · `PHASE-2-UAT.md` · `PHASE-2-RETROSPEKTIF.md`)

---

## Aktif Versiyon

**Versiyon:** v2.0
**Hedef:** Site alan adına geçer — metin tonu, önizleme yayını + lead hattı + analitik, kalite kapıları otomatik, alan adı geçişi (20 adres 301).
**Versiyon Sonu Durumu:** içerik_fazları

<!-- Versiyon geçişlerinde güncellenir. discuss-phase versiyon sonu tespitinde bu alanı okur. -->
<!-- Değerler: içerik_fazları | teknik_borç | senaryo_testi | prd_review_bekliyor -->
<!-- - içerik_fazları: Normal faz döngüsü devam ediyor -->
<!-- - teknik_borç: Teknik borç kapatma fazı aktif -->
<!-- - senaryo_testi: Senaryo testi fazı aktif -->
<!-- - prd_review_bekliyor: Her iki sabit faz tamamlandı; prd-review bekleniyor / yarım kalmış (prd-save ile bölünmüş) / bilinçli ertelenmiş (teslim DevFlow-dışıysa go-live sonrasına) — üçünde de sıradaki komut /devflow:prd-review olarak önerilir, çalıştırılmaz -->

---

<!-- KURAL: Aşağıdaki üç bölüm (Aktif Task · Task Durumu · Son Task Özetleri) ilk kickoff'ta doldurulamaz — henüz task yoktur. O hâlde içerikleri `— yok` kalır ve **bölümler SİLİNMEZ**; ilk task'le dolarlar. Bu bir template kalıntısı DEĞİLDİR — audit'in "placeholder sızıntısı" kalemi bu üç bölüme boşken uygulanmaz (kanon: .claude/commands/devflow/lib/audit-mekanik.md → Placeholder sızıntısı, koşullu kalem). -->

## Aktif Task

**Task:** **TASK-3.09** — Ürün turunun soluk adım kartları AA'ya çıkar · `tasks/TASK-3.09.md`
**Durum:** ⬜ Bekliyor — düzeltme kümesinin ilki; kapı listeyi zaten basıyor
**İlerleme:** 8 / 25
**Not:**
- ✅ **Dokunma hedefi artık İKİ KULVARLI ve kapı kümesi tamam** (TASK-3.08). Kritik küme pozitif tanımlı ve sırayla: buton (`button`·`summary`·`role=button`) → form alanı → sekme → menü (`header`/`nav`, alt bilgi dışında) → dönüşüm bağlantısı (`/demo`·`wa.me`·`tel:`, **nerede olursa olsun**); geriye kalan her ölçülen hedef gezinme kulvarına düşer, yani **üçüncü sessiz kova yok**. Eşik **44×44 ve iki boyut da sayılır**; eski `h<40 && w<200` koşulu geniş-alçak hedefleri (telefon bağlantısı 350×39, form alanı 302×47) kapının görüş alanından çıkarıyordu. Etiket sarmalı **onay kutusu artık ölçülüyor** (eski süzgeç onu tamamen atlıyordu). Dalın kendi kapsam tabanı var (`BEKLENEN_KRITIK_HEDEF = 289`); **gezinme kulvarına bilinçli olarak taban konmadı** — çıkış kodunu etkilemediği için taban bakım borcu ekler ama fail-open kapatmaz, nüfusu yine de her koşumda basılır.
- ⚠️ **TASK-3.17 için bağlayıcı düzeltme listesi ÖLÇÜLDÜ — ve devralınan iki rakamdan biri çürüdü.** Kapı her koşumda benzersiz kümeyi basıyor: **19 benzersiz / 125 örnek**, her iki genişlikte aynı. Benzersiz sayı araştırmayla birebir; **örnek sayısı 61 değil 125** (fark büyük ölçüde alt bilgideki telefon bağlantısından — 16 rotanın hepsinde duruyor ve kural gereği kritik). Devralınan *"form alanı 250×24"* kalemi **artık yok**: form alanları 302×47, eşiğin üstünde — kritik kümeye form tarafından yalnız **onay kutusu (18×18)** giriyor. En ağır dört kalem: telefon bağlantısı `+90 535 937 59 55` (147×20 ve 350×39, 26 örnek/16 rota) · `Demo İste` (72×39, 99×40 — 17 örnek/16 rota) · `Telefonla arayın` (350×39, 16 örnek/16 rota) · breadcrumb `Ana sayfa` (66×17, 14 örnek/14 rota). Şube seçici butonları 63-66×36 ve **beş tane** (kaynakta 1·2·3·5·6 — "4 şube" hiç yok). **Yükseklik hepsinde darboğaz, genişlik değil.**
- ⚠️ **TASK-3.15 için bağlayıcı ölçüm: Roller şeridi 390 px'te DE ihlal veriyor.** TASK-3.07'nin test kriteri *"390 px'te vermiyor"* diyordu ve **çürüdü** — kriter kartı *pencereyle* kıyaslıyor (360 < 390), alt görevin kendi tanımı ise *kabın görünür genişliğiyle*, ve şeridin `clientWidth`'i 390 px penceresinde **350** (kapsayıcı dolgusu 2×20). Kartlar 360/360/360/358 olduğu için 390'da da her kart 10 px eksik görünüyor; ölçülen ihlal her iki genişlikte de **8**. Düzeltme pencereye değil **kaba** göre ölçülmeli, yoksa 320 yeşile dönse bile kapı 390'da kırmızı kalır. Kayıt `BULGULAR.md` → Gelen Kutusu.
- ⚠️ **TASK-3.13 için ölçülmüş sınır: kapının gördüğü ile sorunun kapsamı aynı değil.** `Footer.tsx`'in sahipsiz `h3` kolon başlıkları **16 sayfanın hepsinde** duruyor, ama ardışık-ikili ölçütü onları yalnız 404'te atlama sayıyor (öteki 15 sayfada footer'dan önce bir `h2` geliyor). Düzeltme **yalnız 404'te** yapılırsa kapı yeşile döner ve sahipsiz `h3` 15 sayfada kalır; `Footer` kolon başlıkları `h2`ye çıkarılırsa 16 sayfa birden düzelir. Kayıt `BULGULAR.md` → Gelen Kutusu.
- ⚠️ **TASK-3.11 için iki ölçülmüş düzeltme:** (a) küme araştırmada yazandan geniş — 11 değil **17 benzersiz metin** (16 rotada 19 eleman; "11" `/` rotasının sayısıymış), yani doğrulama 17 üzerinden yapılır; (b) kalemlerin **2'si `.text-gradient-sage` DEĞİL**, ayrı bir Tailwind yazımından geliyor (`bg-linear-to-r from-sage-br to-sage bg-clip-text`, `Solution.tsx` + `FounderProgram.tsx`) ve koyu zeminde durdukları için **bugün geçiyorlar** (`p02` 8,92 · 9,84). Düzeltme `.text-gradient-sage`'in duraklarına yapılırsa 17'si birden düzelir; **`--color-sage-br` token'ının kendisine** yapılırsa o iki geçen kalem aşağı çekilir. Kayıtlar `BULGULAR.md` → Gelen Kutusu.
- 🔴 **Kapılar artık KIRMIZI koşuyor ve bu beklenen sonuçtur:** `a11y` 16 sayfada **57 sorun** (39 kontrast + 17 gradyan metin + 1 başlık atlaması; alt/h1/adsız link-buton hepsi 0), `mobile-audit` **2 genişlik × 16 sayfada 285** (250 kritik dokunma hedefi + 19 kırpılmış eleman + 16 şerit ihlali; yatay kaydırma ve taşan eleman her iki genişlikte de 0) — ikisi de çıkış kodu 1. **Gezinme kulvarı bu sayının dışındadır ve ayrı raporlanır:** her genişlikte 333 ölçüldü / **261 eşik altı** (alt bilgi 256 · içerik yolu 4 · gövde metni 1) — kullanıcının kademeli kuralı gereği kapıyı düşürmez. Her düzeltme task'ı kendi kalemini yeşile çevirir; CI olmadığı için kırmızı hiçbir şeyi bloke etmez. **Yeşil ayağın çalıştığı her iki kapıda da ayrıca ölçüldü** (temiz hedefte `✓ KAPI YEŞİL`, çıkış kodu 0), yani kapılar kilitlenmiş değil.
- ⚠️ **Kontrast rakamı artık `p02`'dir (en kötü %2 piksel), tek bir sayı değil dağılımdır** — her ihlal satırı `p02`, `min` ve `med`'i birlikte basar ve **yargı `p02`'ye bağlıdır**. Ölçü desenli zeminde belirleyici: `Chaos` paragrafında üçü **3,95 / 4,06 / 4,63**, yani `med`'e bakan bir kapı bu ihlali hiç görmezdi. Düzeltme task'ları "yeşile döndü" derken `p02`'ye bakmalı. Ölçüm sözleşmesinin tam metni `docs/DECISIONS.md` (2026-09-24).
- ⚠️ **Kapanış çağrısı ailesi kayıtta yazandan GENİŞ: 39 ihlalin 20'si orada.** `FinalCta` tek bileşen ama **10 sayfada** koşuyor ve iki ayrı satırı birden eşiğin altında: kapanış paragrafı (`text-ink-deep/75`, 17px) `p02` **3,92-4,17** × 10 sayfa, ve hemen altındaki **"15 gün ücretsiz deneme"** satırı (`text-ink-deep/70`, 14px) `p02` **4,45-4,49** × 10 sayfa. TASK-3.10 "5 sayfa" diyor ve yalnız paragrafı adlandırıyor — düzeltme aynı dosyada (`FinalCta.tsx:31` ve `:55`) ama **ikinci satır kriterlerinde yok**; kapı ikisini de sayar, biri düzeltilirse kırmızı sürer.
- ⚠️ **`/gecis`'te kapsanmayan kalem üçe çıktı.** T3'ün düştüğü üç dev adım rakamının (01·02·03, `p02` 1,21) yanına bu turda üç tane daha eklendi: "Elle tutulan kayıtlar için birlikte bir öncelik…" **3,25** (15px) ve küçük adım rakamları "1" **3,49** · "2" **4,23** (14px/800). Altısını da kapsayan task yok — TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyor. Kayıtları `BULGULAR.md` → Gelen Kutusu'nda.
- ⚠️ **Kapıyı koşturmadan önce yayın kopyasının tazeliğini ÖLÇ.** Artık **dört** betik 3100'e bakıyor (`a11y` · `mobile-audit` · `font-guard` · `perf`) ve o konteyner kendiliğinden yeniden derlenmiyor (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`). TASK-3.04 turunda 3100 yine bayat çıktı ve **tazelendi**; tazelik pozitif kontrolle doğrulandı (`/kvkk`'deki ayırt edici ifade 0 → 2, site haritası `lastmod` 2026-09-23T07:41Z → 2026-09-24T12:28Z). "Build koştu" kanıt değildir — her tazelemeden sonra ayırt edici bir alanı ölç. Hedef adresi yalnız `perf.mjs`'te hâlâ sabit; diğer üçü `BASE` env'i taşır (ara doğrulama için `BASE=http://localhost:3000`) ve iki kapı ayrıca `ROTALAR` ile elle liste alır — o kaçış yolu kaynağı değiştirir, kapsam eşiğini **değiştirmez**.
- ⚠️ **Araştırmanın "gerçek küme daha geniş" listesindeki ÜÇ kalem ölçümde çıkmadı — ama hiçbir task'ı boşa düşürmüyor.** Piksel kapısı 1440 px'te ölçtü: soluk kartların **başlıkları** `p02` **4,43** (gereken 3 — geçiyor; kayıt "1,13:1" diyordu), boks sayfasındaki "Gelmedi kolonu raporda ayrı" **7,21** (kayıt 3,65), `/ozellikler`'deki diyetisyen satırı **17,57** (kayıt 3,47). TASK-3.09'un asıl işi duruyor — aynı kartların **gövdesi 2,52-2,54** ve **etiketi 2,98-2,99** gerçekten eşik altı; düşen yalnız "başlıklar da bozuk" alt-iddiası. Diğer ikisini adlandıran task zaten yoktu. Plan revizyonu **gerekmedi**.
- ✅ **Keşif ayağının ikisi de plan revizyonu gerektirmedi** — TASK-3.01 sekiz devralınan rakamı birebir doğruladı, TASK-3.02 kendi revizyon tetiğini ölçtü ve tetik ateşlemedi. Kalan 22 task olduğu gibi geçerli.
- ⚠️ **TASK-3.16'nın ÖLÇÜM kapsamı test kriterlerinde yazandan geniş olmalı.** Kriterler yalnız 320/390 diyor; ilk ekran dönüşüm boşluğu ölçüldüğü her yerde sürüyor — 412 px 6/16 · 768 px 5/16 (T1) · **%200 büyütme 10/16 · %400 büyütme 16/16 · yatay tutuş 844×390'da 16/16, 915×412'de 15/16** (TASK-3.02). Düzeltmenin kendisi (Header'ın mobil kolu + yüzen düğmenin erken eşiği) hepsini kapsıyor, eksik olan doğrulama.
- ⚠️ **Yatay tutuş ölçüldü ve yapışkan katman orada ekranın altıda birini yiyor:** Header 68 px ve yükseklikten bağımsız → 390 px'lik yatay ekranda **%17,4** (dikte %8,1); kaydırınca yüzen düğme kümesi +%6,4 alan ekler. İlk ekranda kalan metin yatayda ortalama 251 karakter, dikte 416. TASK-3.16 ve TASK-3.17'nin dokunduğu yüzeyin tabanı budur.
- ⚠️ **Üst üste binme bu fazın hiçbir kapısının görmediği bir sınıftır** (B-064 bu sınıftan doğdu): kırpma dedektörü taşma arar, kontrast kapısı tek metnin rengini ölçer. TASK-3.01'in dedektörü 80 kombinde 4 aday üretti, **1'i gerçekti** — sahte pozitifleri (satır-kutusu payı, döndürülmüş öğe, mockup içi mikro-tablo) elemeden kapıya girmemeli.
- ⚠️ **Kullanıcıya bağlı iki iş bu fazın içinde ve ikisi de fazı kilitlemeyecek biçimde yerleştirilecek:** (1) **gerçek telefonla uçtan uca tur** — fazın sonunda, doğrulama olarak koşar (Faz 2'den devredilen form denemesi de bunun içinde); (2) **ürün deposunun demo destesine İKİ ekran eklenmesi — diyetisyen ve antrenör telefonu** (araştırmada büyüdü, 2026-09-23): deste tarandı, telefon yüzeyi yalnız üye ve patron tarafında var, yani antrenör sekmesi tek satırlık düzeltmeden sonra da telefon çerçevesinde masaüstü panosu gösterecek. Eklendikleri gün görsel hattı ikisini de olağan biçimde üretir; gelmezse iki sekme de bugünkü hâlinde kalır ve B-046 kanvasta açık durur.
- ⚠️ **Kullanıcı gözü bekleyen dört doğrulama kalemi duruyor** (hiçbiri faz kapanışını engellemedi, hepsi *doğrulama kanalı* — ürün tarafı ölçüldü): Faz 2'den (1) onay e-postasının gelen kutusunda mı spam'de mi düştüğü, (2) ekran okuyucuda onay kutusunun iki kez duyurulup duyurulmadığı (kaydı `BULGULAR.md` → Gelen Kutusu, `[TASK-2.05]`; gerçek ekran okuyucu denemesi Faz 3'ün de kapsamı dışında); Faz 1'den (3) `DEMO_TO`'ya giden e-postanın yerleşimi, (4) Umami panelinin **arayüzünde** v2 kaydının gözle görülmesi (kaydı `phases/PHASE-1.md` → Milestone kapanış notu).

---

## Task Durumu (Aktif Faz)

**Tablo sırası = çalıştırma sırasıdır.** Dört küme: keşif (01-02) → kapı (03-08) → düzeltme (09-17, arada 3.25) → tasarım ve görsel/performans (18-24). ⚠️ **TASK-3.25 numarasıyla değil tablodaki yeriyle koşar** — verify-plan TASK-3.16'yı ikiye böldü, yeni task en büyük numarayı aldı ama kaynağının hemen ardında çalışır.

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 3.01 | TASK-3.01 | ✅ Tamamlandı | Genişlik turu — 16 sayfa × 320/390/412/768/1440 px |
| 3.02 | TASK-3.02 | ✅ Tamamlandı | Dört yeni eksen turu — büyütme, hareket azaltma, JS kapalı, yatay tutuş |
| 3.03 | TASK-3.03 | ✅ Tamamlandı | Kapı zemini — 16 rota, yayın kopyası hedefi, çıkış kodu, kapsam eşiği |
| 3.04 | TASK-3.04 | ✅ Tamamlandı | Kontrast ölçümü piksele taşınır |
| 3.05 | TASK-3.05 | ✅ Tamamlandı | Gradyanla boyanmış metin kapıda kendi dalı olur |
| 3.06 | TASK-3.06 | ✅ Tamamlandı | Başlık hiyerarşisi kontrolü kapıya girer |
| 3.07 | TASK-3.07 | ✅ Tamamlandı | Kırpılmış taşma dedektörü, 320 px, kaydırılabilir şerit ölçütü |
| 3.08 | TASK-3.08 | ✅ Tamamlandı | Dokunma hedefi — kritik küme kırmızı, gezinme yüzeyi raporlanır |
| 3.09 | TASK-3.09 | ⬜ Bekliyor | Ürün turunun soluk adım kartları AA'ya çıkar |
| 3.10 | TASK-3.10 | ⬜ Bekliyor | Kapanış çağrısı paragrafı AA'ya çıkar (5 sayfa) |
| 3.11 | TASK-3.11 | ⬜ Bekliyor | Gradyan metnin durakları koyulaştırılır |
| 3.12 | TASK-3.12 | ⬜ Bekliyor | Desenli zemin ve kalan iki kontrast yüzeyi |
| 3.13 | TASK-3.13 | ⬜ Bekliyor | 404 / çöküş — dev rakam dekoratif, başlık hiyerarşisi düzelir |
| 3.14 | TASK-3.14 | ⬜ Bekliyor | 320 px'te kesilen içerik — `Button` tabanı + `FounderProgram` |
| 3.15 | TASK-3.15 | ⬜ Bekliyor | Roller — sekme şeridi sığar, görsel eşlemesi düzelir |
| 3.16 | TASK-3.16 | ⬜ Bekliyor | Mobilde ilk ekranda demoya çıkan bir yol |
| 3.25 | TASK-3.25 | ⬜ Bekliyor | Form 503 verdiğinde WhatsApp bağlantısı yazılanları taşır |
| 3.17 | TASK-3.17 | ⬜ Bekliyor | Dönüşüme dokunan 19 hedef 44 px'e çıkar |
| 3.18 | TASK-3.18 | ⬜ Bekliyor | Faydalar'ın 8 eşit kartı reddedilen kalıptan çıkar |
| 3.19 | TASK-3.19 | ⬜ Bekliyor | Modüller'in tırtıklı 5'li ızgarası yeniden kurulur |
| 3.20 | TASK-3.20 | ⬜ Bekliyor | `priority`, `sizes` ve hi-dpi varyant tavanı |
| 3.21 | TASK-3.21 | ⬜ Bekliyor | Geçiş görselleri ağaçtan düşer, dekoratif alt metinler boşalır |
| 3.22 | TASK-3.22 | ⬜ Bekliyor | Segment LCP görseli ve font metrik eşlemesi |
| 3.23 | TASK-3.23 | ⬜ Bekliyor | `font-guard` ikinci dal — küme ⊆ woff2 |
| 3.24 | TASK-3.24 | ⬜ Bekliyor | **(koşullu)** Diyetisyen ve antrenör telefon ekranları üretilir |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 2'nin 21 task'ı `phases/PHASE-2.md` → Task Listesi'nde, dokümanları `tasks/archive/`te. Faz 1'inkiler `phases/PHASE-1.md`'de.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-3.08 — Dokunma hedefi iki kulvara ayrıldı (kritik küme kırmızı · gezinme raporlanır · 19 benzersiz)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.08.md`

**Özet:**
- **Kapı artık dönüşüme dokunan hedefi ölçüyor ve gezinme yüzeyini ayrı raporluyor.** M2 F2.3 "≥ 44 px" diyordu ama kapının geçme şartı yalnız yatay kaydırmaydı; boşluk kapandı. Kritik küme pozitif tanımlı (buton → form alanı → sekme → menü → dönüşüm bağlantısı) ve kalan her ölçülen hedef gezinme kulvarına düşer — üçüncü sessiz kova yok. Dönüşüm bağlantısı **alt bilgide de kritik**: ölçüldü, aksi okumayla benzersiz küme 19 değil **18** çıkıyor.
- **Eşik 44×44 oldu ve iki boyut da sayılıyor.** Eski `h<40 && w<200` koşulunun iki ucu da yanlıştı: 40 px WCAG'in rakamı değil, ve genişlik koşulu **geniş ama alçak** hedefleri (telefon bağlantısı 350×39, form alanı 302×47) kapının görüş alanından çıkarıyordu. Etiket sarmalı **onay kutusu (18×18) artık ölçülüyor** — eski `label` süzgeci onu tamamen atlıyordu; ölçülen kutu kontrolün kendisidir, sarmalayan `<label>` değil ve bu ölçüt çıktıya yazılıyor.
- **Benzersizleştirme anahtarı ölçülerek seçildi** — `tag|ad` **19** ← seçilen (araştırmanın rakamını birebir üretiyor) · `tag|ad|en×boy` 22 · `tag|ad|href` 20 · `sınıf|ad` 20. Bilgi kaybı yok: her satır kendi ölçü varyantlarını ve rota sayısını basıyor, yani TASK-3.17'nin düzeltme listesi eksiksiz. Dalın kendi kapsam tabanı var (`BEKLENEN_KRITIK_HEDEF = 289`); gezinme kulvarına **bilinçle** taban konmadı (çıkış kodunu etkilemiyor, nüfusu yine basılıyor).

**Test:** 3100'e karşı **2 genişlik × 16 rota** · 53 sn · `TOPLAM SORUN` **585 → 285**, çıkış **1** · **kalibrasyon:** kritik eşik-altı **19 benzersiz** (araştırma: 19, birebir) / **125 örnek** (araştırma: 61 — **çürüdü**, alt bilgideki telefon bağlantısı 16 rotanın hepsinde) ve devralınan *"form alanı 250×24"* kalemi **çürüdü** (bugün 302×47) · **kapsam:** her genişlikte 16 rota · 6290 eleman · 2038 metin elemanı · **622 dokunma hedefi = 289 kritik (taban 289) + 333 gezinme** · 5 kaydırılabilir kap; gezinme **261 eşik altı** (alt bilgi 256 · içerik yolu 4 · gövde metni 1) ve çıkış kodunun dışında · **dört sonda** (sahte hedef, port 3408, üç ayrı ağaç): 20 buton 40×40 + etiket sarmalı onay kutusu → **336/21 benzersiz, çıkış 1** (onay kutusu listede `#onay` 18×18) → hepsi 48×48 olunca kritik 0 ama gezinme **96 eşik altı kaldığı hâlde `✓ KAPI YEŞİL`, çıkış 0** → kritik nüfus 176 < 289 iken `TOPLAM SORUN` **0 olduğu hâlde kapsam eşiği, çıkış 1**; sunucu kapanışı her seferinde pozitif kontrolle BOŞ→200→BOŞ · **kırmızı→yeşil (gerçek site, dev 3000, `/fiyat`):** şube butonlarına geçici `h-11` → benzersiz **10 → 5**, örnek 11 → 6, `TOPLAM SORUN` 22 → 12; geri alınınca **10/11/22** döndü (`git status src/` boş) · **belirlenimlilik:** iki ardışık tam koşum birebir aynı (631 satır, `diff` boş) · `a11y` değişmedi (16 rota · **57** · çıkış 1 · 66 sn; gradyan 19/17 · başlık 316/1) · `npm test` **210 geçti + 2 atlandı**. Kapsam: yayın kopyası (3100), 320 ve 390 px, `isMobile` bağlamı, **etkileşimsiz hâl** (açılmamış menü/sekme/akordeon dışarıda — B-015). 3100 tazelenmedi ve gerekmedi (`lastmod` 2026-09-24T12:28:32Z).

---

### TASK-3.07 — Kırpılmış taşma ve kaydırılabilir şerit kapıya girdi (320 px · dört muafiyet · iki kapsam tabanı)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.07.md`

**Özet:**
- **Kapı artık KESİLEN içeriği ölçüyor ve 320 px'i de geziyor.** B-030 kalem (d) kapandı: dosya başlığı "taşan metin" sayıyordu, kod ölçmüyordu — kırpılan içerik `clippedBy()` ile ayıklanıp yerine bir şey konmamıştı, ve B-033'ün 19 kesik düğümü sayfa yatay kaydırması olmadığı için geçme şartını **sağlayarak** sessizce geçiyordu. Ölçüt: doğrudan metin taşıyan elemanın kutusu, onu **kesen** atasının kutusunun dışına taşıyor mu; kesen kutu dıştan içe ilk daraltan atadır ve sınıfı o belirler.
- **Tanım üç aday yan yana koşularak seçildi** — metin menzili (`Range`) 9 kalem/66 px · **doğrudan metin taşıyan elemanın kutusu 19/70** · tüm elemanlar 47/2595. İkincisi devralınan rakamı birebir üretiyor. B-033 gövdesinde iki ayrı tanım birden yazılıydı; hangisinin 19/70 verdiği ölçülerek bulundu.
- **Dört muafiyet de beyana bağlı kuruldu ve ayrı sayılıyor**, artı kaydırılabilir kovası: ekran dışı beyanlı (`aria-hidden` + sağ kenar < 0 — bal küpü, 3) · görsel gizli (`clip-path: inset(50%)` ya da 1×1 kutu — bugün 0) · hareketli şerit (animasyonun **adı**, süresi değil — 19/18) · iki boyutlu içerik (WCAG 1.4.10'un kendi istisnası, `<table>` — 2) · kaydırılabilir (40/38). Sınıflandırma **sırası** bilinçle seçildi: alana bakan naif bir gizlilik ölçütü 83 kalem yakalıyor ve 66'sını kaydırılabilir kovasından **çalıyordu** (ölçüldü).

**Test:** 3100'e karşı **2 genişlik × 16 rota** · 53 sn · `TOPLAM SORUN` **278 → 585**, çıkış **1** · **kalibrasyon:** 320 px'te **19 gerçek kırpılmış eleman / en ağır 70 px** (devralınan B-033 rakamı birebir), 390 px'te **0**; muafiyet aritmetiği de tuttu — ham 78 = 19 gerçek + **59 muaf**, araştırmanın "muafiyetsiz 59 sahte pozitif" rakamıyla aynı · **kapsam:** her iki genişlikte 16 rota · 6290 eleman · **2038 metin elemanı (taban 2038)** · 621 dokunma hedefi · **5 kaydırılabilir kap (taban 5)** · **kırmızı→yeşil (gerçek site, dev 3000, `/` · 320 px):** `FounderProgram` ızgara çocuklarına geçici `min-w-0` → kırpma **19 → 0** (`TOPLAM SORUN` 69 → 50), geri alınınca **19** döndü (`git status src/` boş) · **beş sonda** (sahte hedef, port 3407, kapının birebir kopyası — fark `diff` ile 3 satır): kırmızı 2+2/çıkış 1 → daralınca **`✓ KAPI YEŞİL`, çıkış 0** → boş sayfada `TOPLAM SORUN` **0** olduğu hâlde **dört kapsam eşiği** ve çıkış 1 → şeritte 704 px `<table>` **muaf, çıkış 0** (aynı geometride `<button>` 2 ihlal) → bal küpünden `aria-hidden` kalkınca **üç düğüm geri sayıldı**; sunucu kapanışı pozitif kontrolle BOŞ→200→BOŞ · **belirlenimlilik:** iki ardışık tam koşum birebir aynı (433 satır, `diff` boş) · `npm test` **210 geçti + 2 atlandı**. Kapsam: yayın kopyası (3100), **320 ve 390 px**, `isMobile` bağlamı, **etkileşimsiz hâl** (açılmamış sekme/akordeon dışarıda — B-015); dal **yatay** kaybı ölçer, dikey kırpma ayrı sayılır ve kapıyı düşürmez (bugün 0). 3100 tazelenmedi ve gerekmedi — yalnız ölçüm betiği değişti (`lastmod` 2026-09-24T12:28:32Z).

---

<!-- KURAL: **Detay:** yolu task'ın DURUMUNA bağlıdır. ✅ Tamamlandı ise task arşive taşınmıştır (run-task Adım 7) ve yol `tasks/archive/…`'dır; task hâlâ `_dev/tasks/` altındaysa (🔄 / ⏸️ / 🔴) canlı yol yazılır. Özet Adım 5'te yazılır, taşıma Adım 7'de yapılır — sırayı izleyip tamamlanan task'a canlı yol yazmak, commit anında kırık bir referans bırakır ve bir sonraki audit turu onu "kırık dosya referansı" kalemi olarak açar. -->

---

<!-- KURAL: Sadece son 2 task özeti tutulur, daha eskileri silinir (gerçek silme — HTML comment yasak). -->
<!-- KURAL: Sadece aktif fazın task'leri gösterilir. Geçmiş fazların bilgileri phases/ klasöründedir. -->
<!-- KURAL: "Son Tamamlanan Faz", "Son Tamamlanan Sprint" gibi ek özet bölümleri EKLEME — faz durum özeti PHASES.md'de, faz detayları PHASE-N.md'de. DURUM yalnızca aktif durum + son 2 task özeti. -->
<!-- KURAL: Faz alt-fazlarının (verify-plan/plan/research/discuss) ayrı oturum özetlerini DURUM'a yazma — onlar faz dokümanına ait. -->
<!-- KURAL: Üç proje-özgü yerleşim (bilinçli, audit-docs 2026-09-22 — template'e çekilmez): (1) task ADI `###` başlığında durur, ayrı `**Konu:**` alanı AÇILMAZ — alan eklemek adı iki yerde tutar ve drift doğurur; (2) `**Test:**` alanı ilk task'ten beri (TASK-1.01, 011b8ac) her özette var ve yerleşik proje desenidir — ölçüm rakamı kapanışın kanıtıdır, silinmez; (3) Hızlı Erişim dört satırdır, dördüncüsü `BULGULAR.md`'dir (template üç satır tanımlar). -->

## Duraklatma Notu

<!-- Bu bölüm sadece /devflow:pause kullanıldığında doldurulur. Devam edildiğinde veya iş iptal edildiğinde silinir. -->

<!-- Duraklatma durumunda format:
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** [task çalıştırma / planlama / review / quick / vb.]
> **Detay:** [Nerede kalındı, ne yapılacak]
> **Handoff:** [Task dokümanında mı, QUICK dosyasında mı, burada mı?]
-->

## Hızlı Erişim

**Aktif Task:** `tasks/TASK-3.09.md` ⬜ (düzeltme kümesinin ilki — soluk adım kartları); son kapanan `tasks/archive/TASK-3.08.md` ✅
**Aktif Faz:** `phases/PHASE-3.md` 🔄 (araştırma detayı: `PHASE-3-ARASTIRMA.md`) · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
