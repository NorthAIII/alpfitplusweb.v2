# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-24 — **TASK-3.13 ✅ 404 / çöküş: dev rakam dekoratif oldu, başlık hiyerarşisi 16 sayfada düzeldi.** Kapı `TOPLAM SORUN` **8 → 6**; `/olmayan-sayfa` artık kontrast ihlali **0** ve başlık atlaması **0**, kalan 6 kalem `/gecis`'in. `Footer` kolon başlıkları `h3` → `h2` — düzeltme **genel** yapıldı, yerel değil: alt bilgi 16 rotanın hepsinde ve kapsam tabanı oynamadı (görünür başlık 316 → 316). Devralınan teşhis **doğrulandı, çürümedi**: izolasyonda desenin payı tam 0, ışık lekesininki 0,05 — suçlu katman değil token'ın kendisi (1,17), yani kontrastı yükseltmenin yolu yoktu. Görünüş ölçüldü: 6 kombinde **0 farklı piksel**.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme
**Milestone:** Site dar telefondan büyütülmüş yazıya kadar bölüm bölüm gezildi (gerçek cihaz dâhil) ve çıkanlar triyaj edildi; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; beş ölçüm yeşil. Tam metin ve kapsam kararları: `phases/PHASE-3.md`.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ · plan doğrulama ✅ · **task çalıştırma 🔄 (13/25)** — keşif ayağı kapandı (TASK-3.01 · 3.02, ikisinde de plan revizyonu gerekmedi), **kapı kümesi (3.03-3.08) tamamlandı**: zemin kuruldu (3.03), kontrast dedektörü piksele taşındı (3.04), gradyan metin kendi dalını aldı (3.05), başlık hiyerarşisi ölçülmeye başladı (3.06), mobil kapı 320 px'i ve kesilen içeriği ölçmeye başladı (3.07), dokunma hedefi iki kulvara ayrıldı (3.08). **Düzeltme kümesi ilerliyor** (3.09-3.17, arada 3.25): ürün turunun soluk kartları AA'ya çıktı ve kapı 57 → 46'ya düştü (3.09), kapanış çağrısı bandı AA'ya çıktı ve kapı 46 → 26'ya düştü (3.10), gradyan metnin durakları AA'ya çıktı ve kapı 26 → 9'a düştü (3.11), desenli zeminin alt yazısı AA'ya çıktı ve kapı 9 → 8'e düştü (3.12), 404'ün dev rakamı dekoratif oldu ve başlık hiyerarşisi 16 sayfada düzeldi, kapı 8 → 6'ya düştü (3.13). Her düzeltme kendi kalemini yeşile çeviriyor.
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

**Task:** **TASK-3.14** — 320 px'te kesilen içerik: `Button` tabanı + `FounderProgram` · `tasks/TASK-3.14.md`
**Durum:** ⬜ Bekliyor — düzeltme kümesinin altıncısı
**İlerleme:** 13 / 25
**Not:**
- ✅ **404 / çöküş kapandı ve devralınan teşhis DOĞRULANDI** (TASK-3.13). Kapı `TOPLAM SORUN` **8 → 6**; `/olmayan-sayfa`'da hem kontrast ihlali hem başlık atlaması **0**, dizi `h1 h2 h2 h2`. ⚠️ **Suçlu bir katman değil, token'ın kendisiydi:** izolasyonda desen (`bg-dotgrid`) kapalıyken kalem **1,12** — payı **tam 0**; ışık lekesi (`bg-glow-soft`) kapalıyken **1,17**; ikisi de kapalıyken **1,17**, yani `sage-wash-2`'nin canvas üstündeki kendi değeri. Hiçbir katman düzeltmesi 3:1'e ulaştıramazdı — kullanıcının "görünüşü koruma" kararıyla tek uyumlu yol `aria-hidden`'dı ve **kapının kalemi gerçekten attığı ölçüldü** (üç genişlikte ihlal 1 → 0, ölçülen 40 → 39, kovalar birebir aynı — kalem sessizce başka kovaya taşınmadı). ⚠️ **`Footer` düzeltmesi GENEL yapıldı** (`h3` → `h2`, 16 rota birden): yerel düzeltme kapıyı yeşile çevirir, sahipsiz `h3` 15 sayfada kalırdı. Bedeli **yok** — görünür başlık **316 → 316** (taban oynamadı), görünüş farkı **0 piksel** (6 kombinde ölçüldü), yeni atlama yok. `sr-only` bir `h2` sahibi eklemek alternatifi ölçümle elendi: bileşene yeni metin sokar ve tabanı 316 → 332'ye taşırdı.
- ✅ **Desenli zemin kapandı — ve devralınan TEŞHİS kısmen çürüdü** (TASK-3.12). Kapı `TOPLAM SORUN` **9 → 8**, `/` rotasında kontrast ihlali kalmadı. Kalem üç genişlikte **4,06 / 4,63 / 4,51 → 5,54 / 6,32 / 6,16**. ⚠️ **İhlali üreten tek katman desen değildi:** B-032 kalem 4 de task dokümanı da ihlali `bg-dotgrid`'e bağlıyordu; izolasyon ölçümünde desen kapalıyken kalem **4,47** (hâlâ AA altı), desen **ve** gölgeler kapalıyken **4,71** çıktı — yani `faint`in payı yalnız **0,21** ve kartların `shadow-lg`'si tek başına onu yiyor. **Task dokümanının ikinci çözüm yönü ölçümle reddedildi:** desen opaklığı 0,50 → 0,30 / 0,20 / 0,12'de **4,30 / 4,43 / 4,47** — dokuyu yok eden değerde bile eşiği geçmiyor. Düzeltme tek `<p>`'nin sınıfına indi (`text-faint` → `text-muted`), desen ve gölge **hiç değişmedi**: önce/sonra karesinin piksel farkında değişen alan yalnız **319×14 px** (alt yazının glif kutusu), kalan 1.108.800 pikselin tamamı birebir. Kural STYLE-GUIDE'a yazıldı. ⚠️ **Task'ın saydığı öteki iki yüzey bağımsız ölçümde GEÇİYORDU** — diyetisyen kalemi **7,05** (kayıt 3,47), boks kalemi **7,21** (kayıt 3,65); gerçek kapsam üç değil **bir** kalemdi.
- ✅ **Gradyan metin kapandı** (TASK-3.11): `.text-gradient-sage`'in 55% ve 100% durakları **`#41813d` / `#44943d`** oldu, 17 kalem üç genişlikte **1,57-1,74 → 3,30-3,65**. ⚠️ **Düzeltme TOKEN'a değil SINIFA yapıldı ve öyle kalmalı** — `sage-br` otuzu aşkın **koyu** zeminde doğru; regresyon ölçüldü, hiçbir komşu kalem oynamadı. Kuralın tam metni ve TASK-3.12'nin eşi artık `docs/STYLE-GUIDE.md`'de (her oturum okunur).
- ⚠️ **320 px'te ÜÇÜNCÜ bir satır da eşik altıymış ve bunu hiçbir kayıt söylemiyordu** (TASK-3.10): aynı bandın "Kredi kartı istemiyoruz" satırı 320 px'te `p02` **4,45-4,49** (390'da 4,57 · 1440'ta 4,67 ile geçiyordu). Aynı `<p>` içinde olduğu için `/80` düzeltmesi onu da kapsadı (→ 5,52-5,63). **Ders sonraki düzeltme task'ları için:** kapı yalnız 1440 px'te koşuyor, dar genişlikte kalem sayısı **artabiliyor** — düzeltmeyi 320'de de kendin ölç. **Yöntem (TASK-3.10'da kuruldu ve sadakati ölçüldü):** aday değeri kaynağa yazıp 3100'ü yeniden derlemeden önce, yayın kopyasının kendi sayfasına CSS enjekte edip ölç (`page.addStyleTag`, kaynağa dokunulmaz) — böylece her aday için 2-4 dakikalık derleme beklenmez; kazanan değer yazılıp 3100 tazelendikten sonra gerçek derlemeye karşı tekrar ölçülür. Enjekte ölçüm ile gerçek derleme bu turda **birebir** aynı rakamları verdi (390 px'te 4,81 / 4,93 / 5,00).
- ⚠️⚠️ **DÜZELTME TASK'LARININ ARA DOĞRULAMA YOLU DAR EKRANDA SAHTE KIRMIZI BASIYOR.** Task dokümanları `BASE=http://localhost:3000` ile geliştirme sunucusuna yönlendirmeyi öneriyor; 390 px'te `"05 · raporlar"` etiketi orada **1,35**, aynı kod ve aynı betikle 3100'de **9,54**. Neden ölçüldü: `next dev` sayfaya bir geliştirici göstergesi enjekte ediyor (3000'in HTML'inde `devtools` izi var, 3100'de yok) ve sabit, açık renkli o katman metnin üstüne biniyor — piksel kapısı onu zemin sanıyor. İkisi de kendi içinde belirlenimli (3000'de 3/3 · 3100'de 2/2). **1440 px'te fark yok** (iki hedef birebir aynı rakamları verdi). Yargı her zaman 3100'e ait.
- ✅ **Dokunma hedefi artık İKİ KULVARLI ve kapı kümesi tamam** (TASK-3.08). Kritik küme pozitif tanımlı ve sırayla: buton (`button`·`summary`·`role=button`) → form alanı → sekme → menü (`header`/`nav`, alt bilgi dışında) → dönüşüm bağlantısı (`/demo`·`wa.me`·`tel:`, **nerede olursa olsun**); geriye kalan her ölçülen hedef gezinme kulvarına düşer, yani **üçüncü sessiz kova yok**. Eşik **44×44 ve iki boyut da sayılır**; eski `h<40 && w<200` koşulu geniş-alçak hedefleri (telefon bağlantısı 350×39, form alanı 302×47) kapının görüş alanından çıkarıyordu. Etiket sarmalı **onay kutusu artık ölçülüyor** (eski süzgeç onu tamamen atlıyordu). Dalın kendi kapsam tabanı var (`BEKLENEN_KRITIK_HEDEF = 289`); **gezinme kulvarına bilinçli olarak taban konmadı** — çıkış kodunu etkilemediği için taban bakım borcu ekler ama fail-open kapatmaz, nüfusu yine de her koşumda basılır.
- ⚠️ **TASK-3.17 için bağlayıcı düzeltme listesi ÖLÇÜLDÜ — ve devralınan iki rakamdan biri çürüdü.** Kapı her koşumda benzersiz kümeyi basıyor: **19 benzersiz / 125 örnek**, her iki genişlikte aynı. Benzersiz sayı araştırmayla birebir; **örnek sayısı 61 değil 125** (fark büyük ölçüde alt bilgideki telefon bağlantısından — 16 rotanın hepsinde duruyor ve kural gereği kritik). Devralınan *"form alanı 250×24"* kalemi **artık yok**: form alanları 302×47, eşiğin üstünde — kritik kümeye form tarafından yalnız **onay kutusu (18×18)** giriyor. En ağır dört kalem: telefon bağlantısı `+90 535 937 59 55` (147×20 ve 350×39, 26 örnek/16 rota) · `Demo İste` (72×39, 99×40 — 17 örnek/16 rota) · `Telefonla arayın` (350×39, 16 örnek/16 rota) · breadcrumb `Ana sayfa` (66×17, 14 örnek/14 rota). Şube seçici butonları 63-66×36 ve **beş tane** (kaynakta 1·2·3·5·6 — "4 şube" hiç yok). **Yükseklik hepsinde darboğaz, genişlik değil.**
- ⚠️ **TASK-3.15 için bağlayıcı ölçüm: Roller şeridi 390 px'te DE ihlal veriyor.** TASK-3.07'nin test kriteri *"390 px'te vermiyor"* diyordu ve **çürüdü** — kriter kartı *pencereyle* kıyaslıyor (360 < 390), alt görevin kendi tanımı ise *kabın görünür genişliğiyle*, ve şeridin `clientWidth`'i 390 px penceresinde **350** (kapsayıcı dolgusu 2×20). Kartlar 360/360/360/358 olduğu için 390'da da her kart 10 px eksik görünüyor; ölçülen ihlal her iki genişlikte de **8**. Düzeltme pencereye değil **kaba** göre ölçülmeli, yoksa 320 yeşile dönse bile kapı 390'da kırmızı kalır. Kayıt `BULGULAR.md` → Gelen Kutusu.
- 🔴 **Kapılar hâlâ KIRMIZI koşuyor ve bu beklenen sonuçtur:** `a11y` 16 sayfada **6 sorun** (hepsi kontrast, hepsi `/gecis`'in adlandıran task'ı olmayan kalemleri; başlık atlaması **kalmadı**, `/` ve `/olmayan-sayfa` rotaları **temiz**), `mobile-audit` **2 genişlik × 16 sayfada 285** (250 kritik dokunma hedefi + 19 kırpılmış eleman + 16 şerit ihlali; yatay kaydırma ve taşan eleman her iki genişlikte de 0) — ikisi de çıkış kodu 1. **Gezinme kulvarı bu sayının dışındadır ve ayrı raporlanır:** her genişlikte 333 ölçüldü / **261 eşik altı** (alt bilgi 256 · içerik yolu 4 · gövde metni 1) — kullanıcının kademeli kuralı gereği kapıyı düşürmez. Her düzeltme task'ı kendi kalemini yeşile çevirir; CI olmadığı için kırmızı hiçbir şeyi bloke etmez. **Yeşil ayağın çalıştığı her iki kapıda da ayrıca ölçüldü** (temiz hedefte `✓ KAPI YEŞİL`, çıkış kodu 0), yani kapılar kilitlenmiş değil.
- ⚠️ **Kontrast rakamı artık `p02`'dir (en kötü %2 piksel), tek bir sayı değil dağılımdır** — her ihlal satırı `p02`, `min` ve `med`'i birlikte basar ve **yargı `p02`'ye bağlıdır**. Ölçü desenli zeminde belirleyici: `Chaos` paragrafında üçü **3,95 / 4,06 / 4,63**, yani `med`'e bakan bir kapı bu ihlali hiç görmezdi. Düzeltme task'ları "yeşile döndü" derken `p02`'ye bakmalı. Ölçüm sözleşmesinin tam metni `docs/DECISIONS.md` (2026-09-24).
- ⚠️ **`/gecis`'te kapsanmayan kalem üçe çıktı.** T3'ün düştüğü üç dev adım rakamının (01·02·03, `p02` 1,21) yanına bu turda üç tane daha eklendi: "Elle tutulan kayıtlar için birlikte bir öncelik…" **3,25** (15px) ve küçük adım rakamları "1" **3,49** · "2" **4,23** (14px/800). Altısını da kapsayan task yok — TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyor. Kayıtları `BULGULAR.md` → Gelen Kutusu'nda.
- ⚠️ **Kapıyı koşturmadan önce yayın kopyasının tazeliğini ÖLÇ.** Artık **dört** betik 3100'e bakıyor (`a11y` · `mobile-audit` · `font-guard` · `perf`) ve o konteyner kendiliğinden yeniden derlenmiyor (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`). TASK-3.04 turunda 3100 yine bayat çıktı ve **tazelendi**; tazelik pozitif kontrolle doğrulandı (`/kvkk`'deki ayırt edici ifade 0 → 2, site haritası `lastmod` 2026-09-23T07:41Z → 2026-09-24T12:28Z). "Build koştu" kanıt değildir — her tazelemeden sonra ayırt edici bir alanı ölç. Hedef adresi yalnız `perf.mjs`'te hâlâ sabit; diğer üçü `BASE` env'i taşır (ara doğrulama için `BASE=http://localhost:3000`) ve iki kapı ayrıca `ROTALAR` ile elle liste alır — o kaçış yolu kaynağı değiştirir, kapsam eşiğini **değiştirmez**.
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
| 3.09 | TASK-3.09 | ✅ Tamamlandı | Ürün turunun soluk adım kartları AA'ya çıkar |
| 3.10 | TASK-3.10 | ✅ Tamamlandı | Kapanış çağrısı paragrafı AA'ya çıkar (5 sayfa) |
| 3.11 | TASK-3.11 | ✅ Tamamlandı | Gradyan metnin durakları koyulaştırılır |
| 3.12 | TASK-3.12 | ✅ Tamamlandı | Desenli zemin ve kalan iki kontrast yüzeyi |
| 3.13 | TASK-3.13 | ✅ Tamamlandı | 404 / çöküş — dev rakam dekoratif, başlık hiyerarşisi düzelir |
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

### TASK-3.13 — 404 / çöküş: dev rakam dekoratif oldu, başlık hiyerarşisi 16 sayfada düzeldi (kapı 8 → 6)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.13.md`

**Özet:**
- **İki kalem birden kapandı ve `/olmayan-sayfa` tamamen temizlendi.** `TOPLAM SORUN` 8 → **6**; kalan 6'nın hepsi `/gecis`'in adlandıran task'ı olmayan kalemleri. Dev "404" `aria-hidden` aldı (eşi `global-error.tsx`'teki "Hata"), `Footer`'ın üç kolon başlığı `h3` → `h2`. Başlık dalı: **1 atlama → 0**, görünür başlık **316 → 316** (taban oynamadı), ölçülen eleman 1835 → **1834** (tam olarak dekoratif ilan edilen bir eleman), kovalar (yapışkan 151 · görünmez 43 · ekran dışı 0 · kalan 0) ve gradyan 19/0 **birebir aynı**.
- **Devralınan teşhis ÇÜRÜMEDİ — ölçümle doğrulandı, ama suçlu sanılan yerde değildi.** T12'nin dersi gereği katmanlar enjekte CSS ile tek tek kapatıldı: desen (`bg-dotgrid`) kapalı **1,12** (payı **tam 0**) · ışık lekesi (`bg-glow-soft`) kapalı **1,17** · ikisi de kapalı **1,17**. Yani kalemi eşiğin altında tutan şey bir kompozisyon katmanı değil `sage-wash-2`'nin canvas üstündeki **kendi değeri**; hiçbir katman düzeltmesi 3:1'e çıkaramazdı ve kullanıcının "görünüşü koruma" kararıyla tek uyumlu yol `aria-hidden`'dı. Kapının kalemi gerçekten attığı ayrıca ölçüldü — üç genişlikte ihlal 1 → 0, ölçülen 40 → 39, **kovalar değişmeden**, yani kalem sessizce başka bir kovaya taşınmadı.
- **`Footer` düzeltmesi bilinçle GENEL yapıldı ve bedelinin sıfır olduğu ölçüldü.** Yerel düzeltme kapıyı yeşile çevirir, sahipsiz `h3` 15 sayfada kalırdı (TASK-3.06'nın ölçümü). Genel düzeltmede görünüş farkı **0 piksel** — yayın kopyasında kare alınıp DOM'daki değişiklik geri alınarak ikinci kare alındı, 2 rota × 3 genişlik = 6 kombinde toplam 10,5 milyon piksel birebir; kare boyları da aynı, yani yerleşim kayması yok. Alternatif (`sr-only` bir `h2` sahibi) elendi: bileşene yeni metin sokar ve `BEKLENEN_BASLIK` tabanını 316 → 332'ye taşıyıp bayatlatırdı.

**Test:** `a11y.mjs` 3100'e karşı 16 rota @1440×900 · 69 sn · `TOPLAM SORUN` **8 → 6**, çıkış **1** (kalan 6 kapsam dışı: `/gecis`) · **negatif kontrol:** düzeltme öncesi aynı kapı aynı hedefte **8** basıyor ve `/olmayan-sayfa`'da hem `✗ p02 1.12 "404"` hem `✗ [başlık] h1 → h3` satırını veriyordu · **kalibrasyon:** B-032 kalem 5'in kayıtlı 1,12'si birebir yeniden üretildi · **izolasyon:** desen kapalı 1,12 · ışık lekesi kapalı 1,17 · ikisi kapalı 1,17 · **`aria-hidden` sondası (enjekte, üç genişlik):** ihlal 1 → 0 · ölçülen 40 → 39 · kovalar aynı · **enjekte ↔ gerçek derleme birebir** (üç genişlikte de ihlal 0 / ölçülen 39) · **erişilebilirlik ağacı (CDP):** `"404"` adlı AX düğümü **0 adet**, `main`'de ilk duyurulan öğe `heading (seviye 1) "Bu sayfayı bulamadık"` · **görünüş:** 6 kombinde **0 farklı piksel** (10,5 M piksel) · **dar genişlikler (kapı görmüyor):** `/olmayan-sayfa` @390 **1 → 0**, @320 **1 → 0**; `/` @390 **1**, @320 **4** (T12'nin sayılarıyla birebir — değişmedi); `/demo` @390 **1**, @320 **2** (üst üste binme sınıfı, ilk kez ölçüldü, Gelen Kutusu'na düştü) · **regresyon:** `mobile-audit` **285**, çıkış 1 (çizgiyle birebir; tabanlar 2038 / 289 / 5 yerinde) · `font-guard` çıkış **0** (16 sayfa / 85.129 karakter) · `scan` `/` @1440 ve `/demo` @390 **konsol temiz** · `npm test` **210 geçti + 2 atlandı** · `tsc --noEmit` **0** · `lint` 30 problem, **yeni yok** · **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` 16:45:34Z → **17:09:29Z**, `/olmayan-sayfa` `<h3` **3 → 0** / `<h2` **0 → 3**, `/demo` `<h3` **3 → 0** / `<h2` **2 → 5**; **negatif taraf** stil parçası adı **aynı** (`3akz_pa--pbiq.css` — CSS'e dokunulmadı), `/ozellikler` `text-faint` **13 → 13** ve `<h1` **1 → 1**, `/olmayan-sayfa` `text-sage-wash-2` **3 → 3**. Kapsam: yayın kopyası (3100), `reducedMotion: reduce`, **etkileşimsiz hâl** (B-015); yargı değeri `p02`.

---

### TASK-3.12 — Desenli zeminin alt yazısı AA'ya çıktı (kapı 9 → 8 · `/` rotası temiz)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.12.md`

**Özet:**
- **Kapsam task dokümanında yazandan DAR çıktı ve bu bağımsız ölçümle belirlendi.** Task üç yüzey sayıyordu; taban koşumunda kapının bastığı tek `/` ihlali desenli zemin kalemiydi, öteki ikisi **geçiyordu** — diyetisyen kalemi `p02` **7,05** (kayıt 3,47), boks kalemi **7,21** (kayıt 3,65). `TOPLAM SORUN` **9 → 8** ve `/` rotasında kontrast ihlali kalmadı. Kalem üç genişlikte **4,06 / 4,63 / 4,51 → 5,54 / 6,32 / 6,16** (p02 @1440/390/320). Kapsam tabanlarının hiçbiri oynamadı (16 rota · 105 adım · 1835 eleman · gradyan 19/0 · başlık 316/1 · kalan 0).
- **Devralınan TEŞHİS çürüdü: ihlali üreten tek katman desen değilmiş.** B-032 kalem 4 de task dokümanı da ihlali `bg-dotgrid`'e bağlıyordu. İzolasyon ölçümü: desen kapalıyken kalem **4,47** (hâlâ AA altı) · desen **ve** gölgeler kapalıyken **4,71** — yani tokenin beyan ettiği rakamın kendisi. Eşik 4,5 olduğu için `faint`in payı **0,21** ve kartların `shadow-lg`'si tek başına onu yiyor. **Task'ın ikinci çözüm yönü ölçümle reddedildi:** desen opaklığı 0,50 → 0,30 / 0,20 / 0,12'de **4,30 / 4,43 / 4,47** — dokuyu yok eden değerde bile eşiği geçmiyor.
- **Düzeltme yine token'a değil KULLANIMA indi ve dokunun korunduğu ölçüldü.** `--color-faint` 38 yerde kullanılıyor ve düz zeminlerde doğru (`Hero`'nun üç kalemi 4,94-5,16 ile geçiyor); değişen tek şey bir `<p>`'nin sınıfı (`text-faint` → `text-muted`). Yeni token **açılmadı** — `text-sm text-muted` bu kod tabanında zaten yerleşik ikincil-metin deyimi. Görsel kanıt izlenim değil ölçüm: bölümün önce/sonra karesinde (1.108.800 piksel) değişen alan yalnız **319×14 px**, yani alt yazının glif kutusu; desen, kartlar ve gölgeler **bit bazında aynı**.

**Test:** `a11y.mjs` 3100'e karşı 16 rota @1440×900 · 69 sn · `TOPLAM SORUN` **9 → 8**, çıkış **1** (kalan 8 kapsam dışı: `/gecis`'in 6 kalemi + 404'ün rakamı ve başlık atlaması → TASK-3.13) · **negatif kontrol:** düzeltme öncesi aynı kapı aynı hedefte **9** ve `/`'de ihlal **1** basıyordu · **izolasyon:** desen kapalı 4,47 · desen+gölge kapalı 4,71 · desen 0,30/0,20/0,12 → 4,30/4,43/4,47 · **kalibrasyon:** B-032 kalem 4'ün rakamları (4,06 / 3,95 / 4,63) birebir doğrulandı; **çüren iki rakam** yukarıda · **enjekte ↔ gerçek derleme birebir** (`muted` 5,54 / 5,54) · **dar genişlikler (kapı görmüyor):** `/` rotasında eşik altı @390 **1 → 1**, @320 **4 → 4** (beşi de üst üste binme sınıfı, benim değişikliğimden doğmadı, Gelen Kutusu'na yazıldı) · **regresyon:** `mobile-audit` **285**, çıkış 1 (çizgiyle birebir) · `font-guard` çıkış **0** (16 sayfa / 85.129 karakter) · `scan` `/` @1440 ve `/gecis` @390 **konsol temiz** · `npm test` **210 geçti + 2 atlandı** · **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` 16:13:21Z → **16:45:34Z**, hedef satır `text-faint` **1 → 0** / `text-muted` **0 → 1**, `/` HTML'inde `text-faint` **41 → 39** · `text-muted` **221 → 223**; **negatif taraf** dokunmadığım `/ozellikler`'de `text-faint` **13 → 13** ve stil parçası adı **aynı** (`3akz_pa--pbiq.css` — beklenen: CSS yardımcısı değil işaretlemedeki sınıf değişti). Kapsam: yayın kopyası (3100), `reducedMotion: reduce`, **etkileşimsiz hâl** (B-015); yargı değeri `p02`.

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

**Aktif Task:** `tasks/TASK-3.14.md` ⬜ (düzeltme kümesinin altıncısı — 320 px'te kesilen içerik); son kapanan `tasks/archive/TASK-3.13.md` ✅
**Aktif Faz:** `phases/PHASE-3.md` 🔄 (araştırma detayı: `PHASE-3-ARASTIRMA.md`) · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
