# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-24 — **TASK-3.10 ✅ kapanış çağrısı bandının iki metin satırı AA'ya çıktı.** Kapı `TOPLAM SORUN` **46 → 26**; düşen 20 kalem bu turun ölçülmüş listesinin tamamı, kapsam tabanlarının hiçbiri oynamadı. Paragraf 3,92-4,17 → **5,52-5,95** · alt satır 4,44-4,49 → **5,52-5,57** (p02, 3100 @1440). **Task "5 sayfa" diyordu, ölçülen 10 sayfa × 2 satır** — ikisi aynı dosyada, birlikte düzeltildi. Tam opaklık tercih değil zorunluluk: `/90` denendi, 390 px'te hâlâ eşik altı (4,37-4,55). **320 px'te üçüncü bir satır da eşik altıymış** ("Kredi kartı istemiyoruz" 4,45-4,49) — aynı `<p>` içinde olduğu için kapsandı. Token'a dokunulmadı.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme
**Milestone:** Site dar telefondan büyütülmüş yazıya kadar bölüm bölüm gezildi (gerçek cihaz dâhil) ve çıkanlar triyaj edildi; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; beş ölçüm yeşil. Tam metin ve kapsam kararları: `phases/PHASE-3.md`.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ · plan doğrulama ✅ · **task çalıştırma 🔄 (10/25)** — keşif ayağı kapandı (TASK-3.01 · 3.02, ikisinde de plan revizyonu gerekmedi), **kapı kümesi (3.03-3.08) tamamlandı**: zemin kuruldu (3.03), kontrast dedektörü piksele taşındı (3.04), gradyan metin kendi dalını aldı (3.05), başlık hiyerarşisi ölçülmeye başladı (3.06), mobil kapı 320 px'i ve kesilen içeriği ölçmeye başladı (3.07), dokunma hedefi iki kulvara ayrıldı (3.08). **Düzeltme kümesi ilerliyor** (3.09-3.17, arada 3.25): ürün turunun soluk kartları AA'ya çıktı ve kapı 57 → 46'ya düştü (3.09), kapanış çağrısı bandı AA'ya çıktı ve kapı 46 → 26'ya düştü (3.10). Her düzeltme kendi kalemini yeşile çeviriyor.
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

**Task:** **TASK-3.11** — Gradyan metnin durakları koyulaştırılır · `tasks/TASK-3.11.md`
**Durum:** ⬜ Bekliyor — düzeltme kümesinin üçüncüsü
**İlerleme:** 10 / 25
**Not:**
- ✅ **Kapanış çağrısı bandı kapandı ve kapı ölçtü** (TASK-3.10): `FinalCta`'nın **iki** satırı birden — paragraf `text-ink-deep/75` → **tam opak**, alt satır `text-ink-deep/70` → **`/80`**. **Ara değer yok, ölçüldü:** `/90` 390 px'te hâlâ eşik altı (`/` 4,48 · `/fiyat` 4,37), yani tam opaklık zorunluydu. Alt satır bilinçli olarak tam opak **yapılmadı** (`/80` = 5,50-5,70, eşikten pay var ve satır paragraftan sessiz kalıyor). Token'a **dokunulmadı** — özellikle `sage-br` TASK-3.11'in karar alanı. ⚠️ **Task dokümanının önerdiği alternatif ("bandın en açık durağını koyulaştır") bu kalem için TERS yönde:** metin koyu, zemin açık — ölçüldü, `ink-deep` tam opakken `sage-deep` üstünde 3,07 · `sage` üstünde 7,67 · `sage-br` üstünde 10,63; bandı koyulaştırmak satırı daha da aşağı çekerdi. O alternatif B-032'nin 3. kalemi (gradyan metin) için yazılmış.
- ⚠️ **320 px'te ÜÇÜNCÜ bir satır da eşik altıymış ve bunu hiçbir kayıt söylemiyordu** (TASK-3.10): aynı bandın "Kredi kartı istemiyoruz" satırı 320 px'te `p02` **4,45-4,49** (390'da 4,57 · 1440'ta 4,67 ile geçiyordu). Aynı `<p>` içinde olduğu için `/80` düzeltmesi onu da kapsadı (→ 5,52-5,63). **Ders sonraki düzeltme task'ları için:** kapı yalnız 1440 px'te koşuyor, dar genişlikte kalem sayısı **artabiliyor** — düzeltmeyi 320'de de kendin ölç. **Yöntem (TASK-3.10'da kuruldu ve sadakati ölçüldü):** aday değeri kaynağa yazıp 3100'ü yeniden derlemeden önce, yayın kopyasının kendi sayfasına CSS enjekte edip ölç (`page.addStyleTag`, kaynağa dokunulmaz) — böylece her aday için 2-4 dakikalık derleme beklenmez; kazanan değer yazılıp 3100 tazelendikten sonra gerçek derlemeye karşı tekrar ölçülür. Enjekte ölçüm ile gerçek derleme bu turda **birebir** aynı rakamları verdi (390 px'te 4,81 / 4,93 / 5,00).
- ⚠️⚠️ **DÜZELTME TASK'LARININ ARA DOĞRULAMA YOLU DAR EKRANDA SAHTE KIRMIZI BASIYOR.** Task dokümanları `BASE=http://localhost:3000` ile geliştirme sunucusuna yönlendirmeyi öneriyor; 390 px'te `"05 · raporlar"` etiketi orada **1,35**, aynı kod ve aynı betikle 3100'de **9,54**. Neden ölçüldü: `next dev` sayfaya bir geliştirici göstergesi enjekte ediyor (3000'in HTML'inde `devtools` izi var, 3100'de yok) ve sabit, açık renkli o katman metnin üstüne biniyor — piksel kapısı onu zemin sanıyor. İkisi de kendi içinde belirlenimli (3000'de 3/3 · 3100'de 2/2). **1440 px'te fark yok** (iki hedef birebir aynı rakamları verdi). Yargı her zaman 3100'e ait.
- ✅ **Dokunma hedefi artık İKİ KULVARLI ve kapı kümesi tamam** (TASK-3.08). Kritik küme pozitif tanımlı ve sırayla: buton (`button`·`summary`·`role=button`) → form alanı → sekme → menü (`header`/`nav`, alt bilgi dışında) → dönüşüm bağlantısı (`/demo`·`wa.me`·`tel:`, **nerede olursa olsun**); geriye kalan her ölçülen hedef gezinme kulvarına düşer, yani **üçüncü sessiz kova yok**. Eşik **44×44 ve iki boyut da sayılır**; eski `h<40 && w<200` koşulu geniş-alçak hedefleri (telefon bağlantısı 350×39, form alanı 302×47) kapının görüş alanından çıkarıyordu. Etiket sarmalı **onay kutusu artık ölçülüyor** (eski süzgeç onu tamamen atlıyordu). Dalın kendi kapsam tabanı var (`BEKLENEN_KRITIK_HEDEF = 289`); **gezinme kulvarına bilinçli olarak taban konmadı** — çıkış kodunu etkilemediği için taban bakım borcu ekler ama fail-open kapatmaz, nüfusu yine de her koşumda basılır.
- ⚠️ **TASK-3.17 için bağlayıcı düzeltme listesi ÖLÇÜLDÜ — ve devralınan iki rakamdan biri çürüdü.** Kapı her koşumda benzersiz kümeyi basıyor: **19 benzersiz / 125 örnek**, her iki genişlikte aynı. Benzersiz sayı araştırmayla birebir; **örnek sayısı 61 değil 125** (fark büyük ölçüde alt bilgideki telefon bağlantısından — 16 rotanın hepsinde duruyor ve kural gereği kritik). Devralınan *"form alanı 250×24"* kalemi **artık yok**: form alanları 302×47, eşiğin üstünde — kritik kümeye form tarafından yalnız **onay kutusu (18×18)** giriyor. En ağır dört kalem: telefon bağlantısı `+90 535 937 59 55` (147×20 ve 350×39, 26 örnek/16 rota) · `Demo İste` (72×39, 99×40 — 17 örnek/16 rota) · `Telefonla arayın` (350×39, 16 örnek/16 rota) · breadcrumb `Ana sayfa` (66×17, 14 örnek/14 rota). Şube seçici butonları 63-66×36 ve **beş tane** (kaynakta 1·2·3·5·6 — "4 şube" hiç yok). **Yükseklik hepsinde darboğaz, genişlik değil.**
- ⚠️ **TASK-3.15 için bağlayıcı ölçüm: Roller şeridi 390 px'te DE ihlal veriyor.** TASK-3.07'nin test kriteri *"390 px'te vermiyor"* diyordu ve **çürüdü** — kriter kartı *pencereyle* kıyaslıyor (360 < 390), alt görevin kendi tanımı ise *kabın görünür genişliğiyle*, ve şeridin `clientWidth`'i 390 px penceresinde **350** (kapsayıcı dolgusu 2×20). Kartlar 360/360/360/358 olduğu için 390'da da her kart 10 px eksik görünüyor; ölçülen ihlal her iki genişlikte de **8**. Düzeltme pencereye değil **kaba** göre ölçülmeli, yoksa 320 yeşile dönse bile kapı 390'da kırmızı kalır. Kayıt `BULGULAR.md` → Gelen Kutusu.
- ⚠️ **TASK-3.13 için ölçülmüş sınır: kapının gördüğü ile sorunun kapsamı aynı değil.** `Footer.tsx`'in sahipsiz `h3` kolon başlıkları **16 sayfanın hepsinde** duruyor, ama ardışık-ikili ölçütü onları yalnız 404'te atlama sayıyor (öteki 15 sayfada footer'dan önce bir `h2` geliyor). Düzeltme **yalnız 404'te** yapılırsa kapı yeşile döner ve sahipsiz `h3` 15 sayfada kalır; `Footer` kolon başlıkları `h2`ye çıkarılırsa 16 sayfa birden düzelir. Kayıt `BULGULAR.md` → Gelen Kutusu.
- ⚠️ **TASK-3.11 için iki ölçülmüş düzeltme:** (a) küme araştırmada yazandan geniş — 11 değil **17 benzersiz metin** (16 rotada 19 eleman; "11" `/` rotasının sayısıymış), yani doğrulama 17 üzerinden yapılır; (b) kalemlerin **2'si `.text-gradient-sage` DEĞİL**, ayrı bir Tailwind yazımından geliyor (`bg-linear-to-r from-sage-br to-sage bg-clip-text`, `Solution.tsx` + `FounderProgram.tsx`) ve koyu zeminde durdukları için **bugün geçiyorlar** (`p02` 8,92 · 9,84). Düzeltme `.text-gradient-sage`'in duraklarına yapılırsa 17'si birden düzelir; **`--color-sage-br` token'ının kendisine** yapılırsa o iki geçen kalem aşağı çekilir. Kayıtlar `BULGULAR.md` → Gelen Kutusu.
- 🔴 **Kapılar hâlâ KIRMIZI koşuyor ve bu beklenen sonuçtur:** `a11y` 16 sayfada **26 sorun** (8 kontrast + 17 gradyan metin + 1 başlık atlaması; alt/h1/adsız link-buton hepsi 0 — 3.09 ve 3.10 toplam 31 kalem düşürdü), `mobile-audit` **2 genişlik × 16 sayfada 285** (250 kritik dokunma hedefi + 19 kırpılmış eleman + 16 şerit ihlali; yatay kaydırma ve taşan eleman her iki genişlikte de 0) — ikisi de çıkış kodu 1. **Gezinme kulvarı bu sayının dışındadır ve ayrı raporlanır:** her genişlikte 333 ölçüldü / **261 eşik altı** (alt bilgi 256 · içerik yolu 4 · gövde metni 1) — kullanıcının kademeli kuralı gereği kapıyı düşürmez. Her düzeltme task'ı kendi kalemini yeşile çevirir; CI olmadığı için kırmızı hiçbir şeyi bloke etmez. **Yeşil ayağın çalıştığı her iki kapıda da ayrıca ölçüldü** (temiz hedefte `✓ KAPI YEŞİL`, çıkış kodu 0), yani kapılar kilitlenmiş değil.
- ⚠️ **Kontrast rakamı artık `p02`'dir (en kötü %2 piksel), tek bir sayı değil dağılımdır** — her ihlal satırı `p02`, `min` ve `med`'i birlikte basar ve **yargı `p02`'ye bağlıdır**. Ölçü desenli zeminde belirleyici: `Chaos` paragrafında üçü **3,95 / 4,06 / 4,63**, yani `med`'e bakan bir kapı bu ihlali hiç görmezdi. Düzeltme task'ları "yeşile döndü" derken `p02`'ye bakmalı. Ölçüm sözleşmesinin tam metni `docs/DECISIONS.md` (2026-09-24).
- ⚠️ **`/gecis`'te kapsanmayan kalem üçe çıktı.** T3'ün düştüğü üç dev adım rakamının (01·02·03, `p02` 1,21) yanına bu turda üç tane daha eklendi: "Elle tutulan kayıtlar için birlikte bir öncelik…" **3,25** (15px) ve küçük adım rakamları "1" **3,49** · "2" **4,23** (14px/800). Altısını da kapsayan task yok — TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyor. Kayıtları `BULGULAR.md` → Gelen Kutusu'nda.
- ⚠️ **Kapıyı koşturmadan önce yayın kopyasının tazeliğini ÖLÇ.** Artık **dört** betik 3100'e bakıyor (`a11y` · `mobile-audit` · `font-guard` · `perf`) ve o konteyner kendiliğinden yeniden derlenmiyor (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`). TASK-3.04 turunda 3100 yine bayat çıktı ve **tazelendi**; tazelik pozitif kontrolle doğrulandı (`/kvkk`'deki ayırt edici ifade 0 → 2, site haritası `lastmod` 2026-09-23T07:41Z → 2026-09-24T12:28Z). "Build koştu" kanıt değildir — her tazelemeden sonra ayırt edici bir alanı ölç. Hedef adresi yalnız `perf.mjs`'te hâlâ sabit; diğer üçü `BASE` env'i taşır (ara doğrulama için `BASE=http://localhost:3000`) ve iki kapı ayrıca `ROTALAR` ile elle liste alır — o kaçış yolu kaynağı değiştirir, kapsam eşiğini **değiştirmez**.
- ⚠️ **Araştırmanın "gerçek küme daha geniş" listesindeki ÜÇ kalem ölçümde çıkmadı ve üçü de ikinci kez doğrulandı.** Piksel kapısı 1440 px'te ölçtü: soluk kartların **başlıkları** `p02` **4,39-4,43** (gereken 3 — geçiyordu; kayıt "1,13:1" diyordu), boks sayfasındaki "Gelmedi kolonu raporda ayrı" **7,21** (kayıt 3,65), `/ozellikler`'deki diyetisyen satırı **17,57** (kayıt 3,47). TASK-3.09 asıl işi (gövde ve etiket) **kapattı** ve başlıkları da 9,11-9,28'e çıkardı. Diğer ikisini adlandıran task zaten yoktu. Plan revizyonu **gerekmedi**.
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

### TASK-3.10 — Kapanış çağrısı bandının iki metin satırı AA'ya çıktı (20 kalem düştü · kapı 46 → 26)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.10.md`

**Özet:**
- **Task "5 sayfa" diyordu; ölçülen 10 sayfa × 2 satır = 20 kalem.** `FinalCta` tek bileşen ama 10 rotada koşuyor ve iki satırı birden eşiğin altındaydı. Kapı bunu doğruladı: `TOPLAM SORUN` 46 → **26**, düşen tam 20. Kalem kalem (p02, 3100 @1440): paragraf **3,92-4,17 → 5,52-5,95** · alt satır **4,44-4,49 → 5,52-5,57** · "Kredi kartı istemiyoruz" 4,67 → **5,88**. Kapsam tabanlarının hiçbiri oynamadı (16 rota · 105 adım · 1835 eleman · gradyan 19/17 · başlık 316/1 · kalan 0).
- **Tam opaklık bir tercih değil, ölçümün zorladığı tek değerdi.** `/90` enjekte edilip ölçüldü: 390 px'te `/` **4,48** · `/fiyat` **4,37** — hâlâ eşik altı. Alt satır ise bilinçle tam opak **yapılmadı**: tam opaklık 7,67-7,76 veriyor (gereğinden fazla) ve satırı paragrafla aynı tona düşürürdü; `/80` 5,50-5,70 ile paylı geçiyor ve sessiz kalıyor. Token'a dokunulmadı, iki sınıf değeri değişti.
- **Task dokümanının alternatifi bu kalem için ters yöndeydi ve 320 px üçüncü bir kalem gösterdi.** "Bandın en açık durağını koyulaştır" önerisi koyu metin/açık zemin ilişkisinde kontrastı **düşürür** (ölçüldü: `ink-deep` tam opakken `sage-deep` üstünde 3,07). Ayrıca 320 px'te aynı bandın "Kredi kartı istemiyoruz" satırı da eşik altıymış (4,45-4,49) — hiçbir kayıtta yoktu, aynı `<p>` içinde olduğu için kapsandı.

**Test:** `a11y.mjs` 3100'e karşı 16 rota @1440×900 · 69 sn · `TOPLAM SORUN` **46 → 26**, çıkış **1** (kalan 26 kapsam dışı: 17 gradyan + 1 başlık + 8 kontrast) · **kalibrasyon:** T4'ün *"10 sayfa, iki satır, 20 kalem"* iddiası kendi ölçümümde **birebir doğrulandı** (20/20), B-032 kalem 2'nin rakamları da tuttu (1440 3,97 · 390 p02 3,60 / min 3,47); **çürüyen iddia yok**, genişleyen bir kalem var (320 px'teki üçüncü satır) · **negatif kontrol:** `/90` 390 px'te 4,37-4,55 ile eşik altı, yani ara değer yok · **dar genişlikler (kapı görmüyor):** @390 eşik altı **20 → 0** (paragraf 4,81-5,00) · @320 5 sayfada **13 → 0** (paragraf 4,57-5,59) · **görsel:** 1440 ve 390'da A/B kare, hiyerarşi punto/ağırlıkla korunuyor; bandın h2'si 390'da p02 4,45 (gereken 3) · **regresyon:** `mobile-audit` **285**, çıkış 1 (çizgiyle birebir) · `font-guard` çıkış **0** (16 sayfa / 85.129 karakter) · `scan` `/` @1440 ve `/gecis` @390 **konsol temiz** · `npm test` **210 geçti + 2 atlandı** · **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` 15:08:10Z → **15:41:05Z**, üç sayfada `text-ink-deep/75` 2 → **0** · `/70` 2 → **0** · `/80` 0 → **2**. Kapsam: yayın kopyası (3100), `reducedMotion: reduce`, **etkileşimsiz hâl** (B-015); yargı değeri `p02`.

---

### TASK-3.09 — Ürün turunun soluk adım kartları AA'ya çıktı (11 kalem düştü · kapı 57 → 46)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.09.md`

**Özet:**
- **Üç katman da eşiğin üstüne çıktı ve kapı bunu ölçtü.** `/` ve `/ozellikler`'de bu sınıftan eşik altı eleman **0**; `TOPLAM SORUN` 57 → **46** ve düşen 11 kalem tam olarak bu task'ın listesi. Kalem kalem (p02, 3100 @1440): etiket **2,98-2,99 → 5,34-5,43** · gövde **2,52-2,54 → 5,82-5,96** · başlık **4,39-4,43 → 9,11-9,28**. Kapsam tabanlarının hiçbiri oynamadı (16 rota · 105 adım · 1835 eleman · gradyan 19/17 · başlık 316/1 · kalan 0).
- **Çözüm ölçülerek iki ayaklı seçildi: `lg:opacity-45` → `lg:opacity-70` VE `text-canvas/65` → `text-canvas/78`.** Gövde iki kez soluyordu (`0,65 × 0,45 = 0,29` etkin alfa) ve eşiği zorlayan katman oydu; araştırmanın *"opaklık korunur, renk değişir"* seçeneği **uygulanamaz** çıktı — 0,45'te gövdeye **tam beyaz** verilse bile `ink-deep` üzerinde ~4,5, yani pay yok. Tek başına opaklıkla aynı payı tutturmak 0,80 isterdi; iki ayakla 0,70 yetti ve görsel ayrım korundu (etkin kart hâlâ ~2 katı: başlık 9,28 ↔ 18,46, gövde 5,82 ↔ 11,3; 1440 px'te A/B kareyle de bakıldı). Token'a dokunulmadı.
- **Ara doğrulama yolunun bir tuzağı ölçüldü:** `BASE=http://localhost:3000` 390 px'te sahte kırmızı basıyor (`"05 · raporlar"` 1,35 ↔ 3100'de 9,54) — `next dev`'in geliştirici göstergesi sabit ve açık renkli bir katman olarak metnin üstüne biniyor, piksel kapısı onu zemin sanıyor. İkisi de belirlenimli, 1440 px'te fark yok. Hafızaya yazıldı; **yargı her zaman 3100'e ait.**

**Test:** `a11y.mjs` 3100'e karşı 16 rota @1440×900 · 69 sn · `TOPLAM SORUN` **57 → 46**, çıkış **1** (kalan 46 kapsam dışı: 17 gradyan + 1 başlık + 28 kontrast) · **kalibrasyon:** devralınan üç rakamın ikisi birebir doğrulandı (gövde 2,52-2,54 · etiket 2,98-2,99), üçüncüsü (*"başlıklar 1,13:1"*) kendi ölçümümde de **çürüdü** — 4,39-4,43 ve gereken 3, yani zaten geçiyordu · **dar genişlik (390 px, kapı görmüyor):** 15 kalemin hepsi geçiyor — etiket 8,39-9,54 · gövde 9,70-9,79 · başlık 15,06-16,57 · **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` 2026-09-24T12:28:32Z → **15:08:10Z**, `lg:opacity-45` 4 → **0**, `lg:opacity-70` 0 → **4**, `text-canvas/65` 13 → **8**, `text-canvas/78` 0 → **5** · **regresyon:** `mobile-audit` **285**, çıkış 1 (çizgiyle birebir) · `font-guard` çıkış **0** (16 sayfa / 85.129 karakter, kümede olmayan karakter yok) · `scan` `/` @1440 ve `/ozellikler` @390 **konsol temiz** · `npm test` **210 geçti + 2 atlandı**. Kapsam: yayın kopyası (3100), `reducedMotion: reduce`, **etkileşimsiz hâl** (B-015); yargı değeri `p02`.

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

**Aktif Task:** `tasks/TASK-3.11.md` ⬜ (düzeltme kümesinin üçüncüsü — gradyan metnin durakları); son kapanan `tasks/archive/TASK-3.10.md` ✅
**Aktif Faz:** `phases/PHASE-3.md` 🔄 (araştırma detayı: `PHASE-3-ARASTIRMA.md`) · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
