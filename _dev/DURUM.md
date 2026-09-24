# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-24 — **TASK-3.06 ✅ başlık hiyerarşisi kapının dördüncü ölçülen dalı oldu:** kapı artık her rotanın görünür `h1`-`h6` **dizisini** basıyor ve ardışık iki başlıkta artı yönde 1'den büyük fark varsa atlama sayıyor; geriye dönüş (h3 → h2) ihlal değil. Ölçüm: **316 görünür başlık · 1 sayfada 1 atlama**, `TOPLAM SORUN 57`, çıkış **1** — atlama devralınan bulgunun ta kendisi (`/olmayan-sayfa` dizisi `h1 h3 h3 h3`, teşhis `"Bu sayfayı bulamadık" → "Ürün"`). Pozitif kontrol: eleman **1835**, adım **105**, süre **66 sn**, gradyan **19/17**, kovalar **151/43/0/0** — TASK-3.05 tabanından sapma yok, `57 − 1 = 56`. Dört sonda (kırmızı 1 atlama · aynı başlık `h2`ye inince **yeşil, çıkış 0** · hiç başlık yoksa **sorun 0 olduğu hâlde kırmızı** · 6 geriye dönüş + 3 gizli başlık **0 atlama**, süzgeçsiz okunsa 16 sahte ihlal). Kendi kod yorumumdaki bir gerekçeyi ölçüp çürüttüm ve düzelttim.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme
**Milestone:** Site dar telefondan büyütülmüş yazıya kadar bölüm bölüm gezildi (gerçek cihaz dâhil) ve çıkanlar triyaj edildi; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; beş ölçüm yeşil. Tam metin ve kapsam kararları: `phases/PHASE-3.md`.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ · plan doğrulama ✅ · **task çalıştırma 🔄 (6/25)** — keşif ayağı kapandı (TASK-3.01 · 3.02, ikisinde de plan revizyonu gerekmedi), **kapı kümesi ilerliyor**: zemin kuruldu (TASK-3.03), kontrast dedektörü piksele taşındı (TASK-3.04), gradyan metin kendi dalını aldı (TASK-3.05), başlık hiyerarşisi ölçülmeye başladı (TASK-3.06); sıradaki iki task kalan dedektörleri getiriyor (kırpma, dokunma hedefi).
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

**Task:** **TASK-3.07** — Kırpılmış taşma dedektörü, 320 px, kaydırılabilir şerit ölçütü · `tasks/TASK-3.07.md`
**Durum:** ⬜ Bekliyor — kapı kümesinin beşincisi; ölçen kurulur, düzeltme TASK-3.14/3.15'in işi
**İlerleme:** 6 / 25
**Not:**
- ✅ **Başlık hiyerarşisi artık ÖLÇÜLÜYOR ve kapıyı düşürüyor** (TASK-3.06). Kapı her rotanın görünür `h1`-`h6` dizisini basıyor (`başlık dizisi: h1 h2 h2 h3 …`), ardışık ikilide artı yönde 1'den büyük fark **atlamadır** ve `[başlık]` işaretiyle `TOPLAM SORUN`'a girer; geriye dönüş ihlal değil. Gizlilik ölçütü `aria-hidden` + görünürlük — ölçüldü, muafiyet olmasa sahte hedefte 16 sahte ihlal doğuyordu. Dalın kendi kapsam tabanı var (`BEKLENEN_BASLIK = 316`; `BEKLENEN_ROTA`/`BEKLENEN_GRADYAN` ile aynı sözleşme — taban, üst sınır değil).
- ⚠️ **TASK-3.13 için ölçülmüş sınır: kapının gördüğü ile sorunun kapsamı aynı değil.** `Footer.tsx`'in sahipsiz `h3` kolon başlıkları **16 sayfanın hepsinde** duruyor, ama ardışık-ikili ölçütü onları yalnız 404'te atlama sayıyor (öteki 15 sayfada footer'dan önce bir `h2` geliyor). Düzeltme **yalnız 404'te** yapılırsa kapı yeşile döner ve sahipsiz `h3` 15 sayfada kalır; `Footer` kolon başlıkları `h2`ye çıkarılırsa 16 sayfa birden düzelir. Kayıt `BULGULAR.md` → Gelen Kutusu.
- ⚠️ **TASK-3.11 için iki ölçülmüş düzeltme:** (a) küme araştırmada yazandan geniş — 11 değil **17 benzersiz metin** (16 rotada 19 eleman; "11" `/` rotasının sayısıymış), yani doğrulama 17 üzerinden yapılır; (b) kalemlerin **2'si `.text-gradient-sage` DEĞİL**, ayrı bir Tailwind yazımından geliyor (`bg-linear-to-r from-sage-br to-sage bg-clip-text`, `Solution.tsx` + `FounderProgram.tsx`) ve koyu zeminde durdukları için **bugün geçiyorlar** (`p02` 8,92 · 9,84). Düzeltme `.text-gradient-sage`'in duraklarına yapılırsa 17'si birden düzelir; **`--color-sage-br` token'ının kendisine** yapılırsa o iki geçen kalem aşağı çekilir. Kayıtlar `BULGULAR.md` → Gelen Kutusu.
- 🔴 **Kapılar artık KIRMIZI koşuyor ve bu beklenen sonuçtur:** `a11y` 16 sayfada **57 sorun** (39 kontrast + 17 gradyan metin + 1 başlık atlaması; alt/h1/adsız link-buton hepsi 0), `mobile-audit` 16 sayfada 278 — ikisi de çıkış kodu 1. Her düzeltme task'ı kendi kalemini yeşile çevirir; CI olmadığı için kırmızı hiçbir şeyi bloke etmez. **Yeşil ayağın çalıştığı ayrıca ölçüldü** (temiz hedefte `✓ KAPI YEŞİL`, çıkış kodu 0), yani kapı kilitlenmiş değil.
- ⚠️ **Kontrast rakamı artık `p02`'dir (en kötü %2 piksel), tek bir sayı değil dağılımdır** — her ihlal satırı `p02`, `min` ve `med`'i birlikte basar ve **yargı `p02`'ye bağlıdır**. Ölçü desenli zeminde belirleyici: `Chaos` paragrafında üçü **3,95 / 4,06 / 4,63**, yani `med`'e bakan bir kapı bu ihlali hiç görmezdi. Düzeltme task'ları "yeşile döndü" derken `p02`'ye bakmalı. Ölçüm sözleşmesinin tam metni `docs/DECISIONS.md` (2026-09-24).
- ⚠️ **Kapanış çağrısı ailesi kayıtta yazandan GENİŞ: 39 ihlalin 20'si orada.** `FinalCta` tek bileşen ama **10 sayfada** koşuyor ve iki ayrı satırı birden eşiğin altında: kapanış paragrafı (`text-ink-deep/75`, 17px) `p02` **3,92-4,17** × 10 sayfa, ve hemen altındaki **"15 gün ücretsiz deneme"** satırı (`text-ink-deep/70`, 14px) `p02` **4,45-4,49** × 10 sayfa. TASK-3.10 "5 sayfa" diyor ve yalnız paragrafı adlandırıyor — düzeltme aynı dosyada (`FinalCta.tsx:31` ve `:55`) ama **ikinci satır kriterlerinde yok**; kapı ikisini de sayar, biri düzeltilirse kırmızı sürer.
- ⚠️ **`/gecis`'te kapsanmayan kalem üçe çıktı.** T3'ün düştüğü üç dev adım rakamının (01·02·03, `p02` 1,21) yanına bu turda üç tane daha eklendi: "Elle tutulan kayıtlar için birlikte bir öncelik…" **3,25** (15px) ve küçük adım rakamları "1" **3,49** · "2" **4,23** (14px/800). Altısını da kapsayan task yok — TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyor. Kayıtları `BULGULAR.md` → Gelen Kutusu'nda.
- ⚠️ **Kapıyı koşturmadan önce yayın kopyasının tazeliğini ÖLÇ.** Artık **dört** betik 3100'e bakıyor (`a11y` · `mobile-audit` · `font-guard` · `perf`) ve o konteyner kendiliğinden yeniden derlenmiyor (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`). TASK-3.04 turunda 3100 yine bayat çıktı ve **tazelendi**; tazelik pozitif kontrolle doğrulandı (`/kvkk`'deki ayırt edici ifade 0 → 2, site haritası `lastmod` 2026-09-23T07:41Z → 2026-09-24T12:28Z). "Build koştu" kanıt değildir — her tazelemeden sonra ayırt edici bir alanı ölç. Hedef adresi yalnız `perf.mjs`'te hâlâ sabit; diğer üçü `BASE` env'i taşır (ara doğrulama için `BASE=http://localhost:3000`) ve iki kapı ayrıca `ROTALAR` ile elle liste alır — o kaçış yolu kaynağı değiştirir, kapsam eşiğini **değiştirmez**.
- ⚠️ **Araştırmanın "gerçek küme daha geniş" listesindeki ÜÇ kalem ölçümde çıkmadı — ama hiçbir task'ı boşa düşürmüyor.** Piksel kapısı 1440 px'te ölçtü: soluk kartların **başlıkları** `p02` **4,43** (gereken 3 — geçiyor; kayıt "1,13:1" diyordu), boks sayfasındaki "Gelmedi kolonu raporda ayrı" **7,21** (kayıt 3,65), `/ozellikler`'deki diyetisyen satırı **17,57** (kayıt 3,47). TASK-3.09'un asıl işi duruyor — aynı kartların **gövdesi 2,52-2,54** ve **etiketi 2,98-2,99** gerçekten eşik altı; düşen yalnız "başlıklar da bozuk" alt-iddiası. Diğer ikisini adlandıran task zaten yoktu. Plan revizyonu **gerekmedi**.
- ✅ **Keşif ayağının ikisi de plan revizyonu gerektirmedi** — TASK-3.01 sekiz devralınan rakamı birebir doğruladı, TASK-3.02 kendi revizyon tetiğini ölçtü ve tetik ateşlemedi. Kalan 22 task olduğu gibi geçerli.
- ⚠️ **TASK-3.07 kapıyı kurarken DÖRT muafiyeti birlikte kurmalı — dördü de ölçüldü, yoksa kapı kalıcı kırmızı koşar.** (1) **Bal küpü** (`input#website`, sol ≈ −9912) her genişlikte "ekran dışı kontrol" verir. (2) **`/fiyat`'ın iki fiyat tablosu** (`min-w-[44rem]` = 704 px · `min-w-[38rem]` = 608 px) `overflow-x-auto` içinde 320/390/412'de pencereden geniştir; Roller şeridi için kurulan *"kaydırılabilir şeritte tek öğe pencereden geniş"* ölçütü **tabloyu da yakalar** ve tablo bu kalıbın meşru hâlidir. (3) **`Modules` kartlarının 40 px'lik "erişilmez içerik"i** dekoratif parıltı lekesidir (`span.pointer-events-none.absolute.-right-10.-top-10`) — bilerek kart dışına konup kırpılıyor. (4) **"İçeriğe atla" atlama bağlantısı** (`a.sr-only.focus:not-sr-only`, sol = −1, genişlik 1 px) **16 rotanın hepsinde, dört eksenin hepsinde** ekran dışı kontrol verir ve bal küpünden **ayrı bir elemandır** — bal küpü muafiyeti onu yakalamaz (TASK-3.02'de ölçüldü).
- ⚠️ **Kırpma/taşma muafiyeti animasyonun ADına bakmalı, SÜRESİNE değil.** Hareket azaltma altında `animation-duration` `.01ms`'e iner ama `animation-name` durur; süreye bakan bir ölçüt kayan tanıtım şeridini sahte pozitif yapar — ölçüldü, 390 px'te **18 sahte isabet**, taşma 2.638 px'e kadar. Kapı kurulurken her zaman devralınan bir rakamı yeniden üreten bir kalibrasyon kolu koşturulur; *"0 buldum"* ile *"bakmadım"* ancak böyle ayrışır (`memory/arastirma-konteynerinde-tarayici-olcumu.md`).
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
| 3.07 | TASK-3.07 | ⬜ Bekliyor | Kırpılmış taşma dedektörü, 320 px, kaydırılabilir şerit ölçütü |
| 3.08 | TASK-3.08 | ⬜ Bekliyor | Dokunma hedefi — kritik küme kırmızı, gezinme yüzeyi raporlanır |
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

### TASK-3.06 — Başlık hiyerarşisi kapının dördüncü ölçülen dalı oldu (belge sırası · geriye dönüş muaf · kapsam tabanı)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.06.md`

**Özet:**
- **Kapı artık başlıkların SIRASINI ölçüyor, yalnız `h1` sayısını değil.** Her rotanın görünür `h1`-`h6` dizisi belge sırasına göre basılıyor; ardışık iki başlıkta artı yönde 1'den büyük fark **atlamadır**, `[başlık]` işaretiyle `TOPLAM SORUN`'a girer ve teşhis satırı iki başlığın metnini de gösterir. Geriye dönüş (h3 → h2) ihlal sayılmıyor — bölüm kapanışıdır.
- **Gizlilik ölçütü ikili ve ikisi de gerekli:** `aria-hidden` (kendisinde ya da bir atasında) + görünürlük. Görünürlük tek çağrıyla ölçülemiyor — `display:none` bir **atadaysa** elemanın kendi hesaplanmış `display` değeri hâlâ kendi değerini döndürür, o yüzden render edilmişlik `getClientRects()` ile, `visibility` ise kalıtıldığı için doğrudan okunuyor.
- **Dalın kendi kapsam tabanı kuruldu** (`BEKLENEN_BASLIK = 316`). Gerekçe dalın şekline bağlı: bu dal ihlalin **yokluğunu** raporlar, yani körleşen bir seçici "0 atlama" deyip kapıyı yeşil bırakırdı — ölçüldü, başlıksız hedefte kapı `TOPLAM SORUN 0` olduğu hâlde kırmızıya döndü.

**Test:** 3100'de 16 rota · 105 ekran adımı · **1835 eleman** · 66 sn · **316 görünür başlık (taban 316) · 1 sayfada 1 atlama** · `TOPLAM SORUN 57`, çıkış **1** · **kalibrasyon:** devralınan bulgu birebir çıktı — `/olmayan-sayfa` dizisi `h1 h3 h3 h3`, teşhis `"Bu sayfayı bulamadık" → "Ürün"` (B-031 kalem 4) · **pozitif kontrol:** eleman/adım/süre/gradyan(19-17)/kovalar(151·43·0·0) TASK-3.05 tabanıyla **birebir aynı**, `57 − 1 = 56` · **belirlenimlilik:** iki ardışık tam koşum birebir aynı (`diff` boş) · **dört sonda** (sahte hedef, port 3461, her biri kendi ağacında): `h1 → h4` sokulunca **1 atlama, TOPLAM SORUN 1, çıkış 1** → aynı başlık `h2`ye inince **0 atlama, `✓ KAPI YEŞİL`, çıkış 0** → hiç görünür başlık yok: **sorun 0 olduğu hâlde kapsam eşiği, çıkış 1** → 6 geriye dönüş + 3 gizli başlık: **0 atlama, çıkış 0** (aynı hedefte süzgeçsiz okuma 368 başlık/16 atlama verirdi; sunucu kapanışı pozitif kontrolle BOŞ→200→BOŞ) · `npm test` **210 geçti + 2 atlandı**. Kapsam: yalnız 1440×900, yayın kopyası (3100) ve **etkileşimsiz hâl** — açılmamış sekme/akordeon içindeki başlıklar kapsamda değil (B-015); 3100 bu turda tazelenmedi, site kodu değişmedi (`lastmod` 2026-09-24T12:28:32Z).

---

### TASK-3.05 — Gradyanla boyanmış metin kapıda kendi dalı oldu (en açık durak · maske ikinci kareden · kapsam tabanı)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.05.md`

**Özet:**
- **"Ölçülemeyen"in beşinci kovası kapandı.** Gradyan metin artık ölçülüyor ve eşik altındaysa kapıyı olağan yoldan düşürüyor: renk gradyanın **en açık durağından** (renk uzayından bağımsız ayrıştırıcı — `135deg` / `to right in oklab` kendiliğinden eleniyor), zemin yine glif maskesinin altındaki gerçek pikselden, ata opaklığı durak alfasıyla çarpılarak. Sınıfın ölçütü `background-clip: text`tir — clip'siz şeffaf metin `görünmez`e gidiyor, yoksa etkin alfa 0 olup **sahte 1,0:1** basardı.
- **Maske üçüncü kareyle değil, ikinci karenin kuralı genişletilerek doğdu.** Gradyan metnin glif dolgusu zaten şeffaf olduğu için TASK-3.04'ün gizleme kuralı onu değiştirmiyordu; kural artık işaretli elemanların `background-image`/`background-color`'ını da siliyor. Koşum süresi **66 sn**'de kaldı (taban ile aynı).
- **Dalın kendi kapsam tabanı kuruldu** (`BEKLENEN_GRADYAN = 19`). Gerekçe ölçüldü: hiç gradyan metin içermeyen bir hedefte kapı **TOPLAM SORUN 0 olduğu hâlde** kırmızıya dönüyor — körleşen seçici artık yeşil basamıyor.

**Test:** 3100'de 16 rota · 105 ekran adımı · **1835 eleman** · 66 sn · **gradyan metin 19 ölçüldü / 17 eşik altı** · `TOPLAM SORUN 56`, çıkış **1** · **pozitif kontrol:** eleman/adım/süre/kontrast-ihlali (39) sayılarının hepsi TASK-3.04 tabanıyla **birebir aynı**, yani dal ötekini bozmadı · **belirlenimlilik:** iki ardışık tam koşum birebir aynı (`diff` boş) · **kalibrasyon:** `sage-br` canvas üstünde **1,74** · canvas-soft üstünde **1,64** (B-032 kalem 3 ile birebir), `/` rotasında 11 kalem · **dört sonda** (sahte hedef, port 3458, her biri kendi ağacında): kırmızı **32/32 eşik altı, çıkış 1** → duraklar koyulaşınca **0 eşik altı, `✓ KAPI YEŞİL`, çıkış 0** → hiç gradyan yok: **sorun 0 olduğu hâlde kapsam eşiği, çıkış 1** → durağı okunamayan kalem `kalan:1` olup **adıyla** basılıyor, çıkış 1 (sunucu kapanışı pozitif kontrolle, dört kez BOŞ→200→BOŞ) · `npm test` **210 geçti + 2 atlandı**. Kapsam: yalnız 1440×900 ve yayın kopyası (3100); 3100 bu turda tazelenmedi — site kodu değişmedi ve konteyner HEAD'in sürümünde (`lastmod` 2026-09-24T12:28Z).

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

**Aktif Task:** `tasks/TASK-3.07.md` ⬜ (kapı kümesinin beşincisi — kırpılmış taşma dedektörü); son kapanan `tasks/archive/TASK-3.06.md` ✅
**Aktif Faz:** `phases/PHASE-3.md` 🔄 (araştırma detayı: `PHASE-3-ARASTIRMA.md`) · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
