# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-24 — **TASK-3.03 ✅ kapı zemini kuruldu:** iki kapı artık gerçekten kırmızıya dönebiliyor. `a11y` **8 → 16 rota**, çıkış kodu **0 → 1**; `mobile-audit` **9 → 16 rota**, çıkış kodu **0 → 1**. Rota listesi tek kaynaktan türüyor (`research/lib/rotalar.mjs`, sitemap üzerinden 15 + 1), hedef **yayın kopyası** (3100, `BASE` ile 3000'e yönlenir), kapsam da eşikli (gezilen rota < 16 ya da 0 eleman → kırmızı). **Kapının kendisi dört sondayla sınandı** — hedef ölü · rota listesi çöktü · 0 eleman ölçüldü (sorun sayısı 0 olduğu hâlde kırmızı) · temiz hedefte **yeşil, çıkış kodu 0**. Kalibrasyon: 404'ün dev rakamı **1,17:1** ölçüldü, devralınan kayıtla birebir. 3100 bayat çıktı (ölçüldü, `a17ca7a` yok) ama aynı kapı 3000'e karşı **birebir aynı** rakamı verdi. Gelen Kutusu'na iki kalem: `/gecis`'in üç dekoratif rakamı (1,21:1, task'ı yok) ve `CLAUDE.md`'nin bir eksik test sayısı.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme
**Milestone:** Site dar telefondan büyütülmüş yazıya kadar bölüm bölüm gezildi (gerçek cihaz dâhil) ve çıkanlar triyaj edildi; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; beş ölçüm yeşil. Tam metin ve kapsam kararları: `phases/PHASE-3.md`.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ · plan doğrulama ✅ · **task çalıştırma 🔄 (3/25)** — keşif ayağı kapandı (TASK-3.01 · 3.02, ikisinde de plan revizyonu gerekmedi), **kapı kümesi başladı**: zemin kuruldu (TASK-3.03), sıradaki beş task dedektörleri getiriyor.
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

**Task:** **TASK-3.04** — Kontrast ölçümü piksele taşınır (glif maskesi, ata opaklığı, ekran ekran gezme) · `tasks/TASK-3.04.md`
**Durum:** ⬜ Bekliyor — kapı zemini ✅ kuruldu, dedektörler başlıyor
**İlerleme:** 3 / 25
**Not:**
- 🔴 **Kapılar artık KIRMIZI koşuyor ve bu beklenen sonuçtur** (TASK-3.03'te oldu): `a11y` 16 sayfada 4 sorun, `mobile-audit` 16 sayfada 278 — ikisi de çıkış kodu 1. Her düzeltme task'ı kendi kalemini yeşile çevirir; CI olmadığı için kırmızı hiçbir şeyi bloke etmez. **Yeşil ayağın çalıştığı ayrıca ölçüldü** (temiz hedefte `✓ KAPI YEŞİL`, çıkış kodu 0), yani kapı kilitlenmiş değil.
- ⚠️ **Kapıyı koşturmadan önce yayın kopyasının tazeliğini ÖLÇ.** Artık **dört** betik 3100'e bakıyor (`a11y` · `mobile-audit` · `font-guard` · `perf`) ve o konteyner kendiliğinden yeniden derlenmiyor (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`). TASK-3.03 turunda 3100 bir commit geride çıktı (`a17ca7a` yoktu, `/kvkk`'deki ayırt edici cümleyle ölçüldü) — o turda etkisi sıfırdı, düzeltme task'larında olmaz. Hedef adresi yalnız `perf.mjs`'te hâlâ sabit; diğer üçü `BASE` env'i taşır (ara doğrulama için `BASE=http://localhost:3000`) ve iki kapı ayrıca `ROTALAR` ile elle liste alır — o kaçış yolu kaynağı değiştirir, kapsam eşiğini **değiştirmez**.
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
| 3.04 | TASK-3.04 | ⬜ Bekliyor | Kontrast ölçümü piksele taşınır |
| 3.05 | TASK-3.05 | ⬜ Bekliyor | Gradyanla boyanmış metin kapıda kendi dalı olur |
| 3.06 | TASK-3.06 | ⬜ Bekliyor | Başlık hiyerarşisi kontrolü kapıya girer |
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

### TASK-3.03 — Kapı zemini (16 rota tek kaynaktan · yayın kopyası hedefi · çıkış kodu · kapsam eşiği)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.03.md`

**Özet:**
- **İki kapı gerçekten kırmızıya dönebiliyor artık** — B-030'un kök nedeni kapandı: geçme satırı ile çıkış kodu tek bir değişkenden türüyor. `a11y` 8 → **16 rota** / çıkış 0 → **1**; `mobile-audit` 9 → **16 rota** / çıkış 0 → **1**.
- **Rota listesi tek kaynağa bağlandı** (`research/lib/rotalar.mjs` — sitemap üzerinden 15 + `/olmayan-sayfa`), hedef **yayın kopyası** oldu, kapsam da eşiklendi (gezilen rota < 16 ya da 0 eleman → kırmızı). B-012'nin senkron kaybı kapandı; `a11y.mjs`'in `undefined` basan teşhis satırı (B-030 kalem e) düzeldi.
- **Kapının kendisi dört sondayla sınandı** (hedef ölü · rota listesi çöktü · 0 eleman ölçüldü · temiz hedefte yeşil) — hepsi yerelde ve girdiye dokunarak; kaynağa dokunulmadı.

**Test:** 3100'de `a11y` → **16 rota · 1906 eleman · 142 ölçülemeyen · 4 sorun**, çıkış kodu **1** · `mobile-audit` → **16 rota · 6290 eleman · 621 dokunma hedefi · 278 sorun**, çıkış kodu **1**, yatay kaydırma 16/16'da **yok** · `BASE=3000` ile a11y **birebir aynı** (16/1906/142/4), yani 3100'ün bayatlığının bu turun rakamlarına etkisi sıfır · kalibrasyon: 404 dev rakamı **1,17:1**, devralınan kayıtla (1,12–1,17) birebir · sondalar: ölü hedef → cümle + çıkış **1**; 3 rotalı site haritası → hata + çıkış **1**; 0 eleman ölçülen hedef → sorun sayısı **0 olduğu hâlde** çıkış **1**; temiz hedef → `✓ KAPI YEŞİL — 16 sayfada 0`, çıkış **0**; `ROTALAR` dar listesi kapıyı açmıyor (2 rota → çıkış 1) · `npm test` **210 geçti + 2 atlandı**. Kapsam: zemin ölçüldü, dedektör davranışı (kontrast yöntemi, kırpma, dokunma hedefi kademesi) TASK-3.04–3.08'de.

---

### TASK-3.02 — Dört yeni eksen turu (büyütme · hareket azaltma · JS kapalı · yatay tutuş)

**Durum:** ✅ Tamamlandı · 2026-09-24 · **Detay:** `tasks/archive/TASK-3.02.md`

**Özet:**
- 12 tarayıcı bağlamı × 16 rota = **192 kombin**, 240 ölçüm örneği, 1.577 ekran adımı; kod değişikliği yok — tur ölçer, düzeltmez.
- **M2 F2.3'ün hiç ölçülmemiş kriteri ilk kez ölçüldü ve geçti** (hareket azaltmada `.reveal` 0 / kontrolde 134) → TASK-3.04'ün ön koşulu sağlam, **plan revizyonu gerekmedi**; %400 büyütme reflow açısından 320 px'in **tam eşi** çıktı, yeni kırpma sınıfı yok.
- Bir yeni bulgu (**B-065** — JS kapalıyken demo formu talebi kaybediyor, kişisel veriyi adres çubuğuna yazıyor) + kanvasa üç JS-kapalı kalemi + TASK-3.07 için **dördüncü** kapı muafiyeti + TASK-3.16 için genişlemiş ölçüm kapsamı.

**Test:** Hareket azaltma: `.reveal` **0**, koşan animasyon **0** (kontrol grubu: 134 ve 33-36) · %400 büyütme kırpma **19 düğüm / 70 px**, %200 ve %100'de **0**, kök font üç seviyede de 16 px · iki yönlü kaydırma **192/192 kombinde yok** · JS kapalı: 16 rotanın 16'sında huniye çıkan yol var, metin uzunluğu JS açıkla **birebir aynı** · yatay tutuş: ilk ekran boş **16/16** (844×390) ve 15/16 (915×412), yapışkan kaplama %17,4 · kalibrasyon: dik 390'da ilk ekran boş **6/16** (T1 ile birebir). Kapsam: geliştirme sunucusu (3000); yayın kopyası ve gerçek cihaz bu turun dışında.

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

**Aktif Task:** `tasks/TASK-3.04.md` ⬜ (kapı kümesinin ikincisi — dedektörler başlıyor); son kapanan `tasks/archive/TASK-3.03.md` ✅
**Aktif Faz:** `phases/PHASE-3.md` 🔄 (araştırma detayı: `PHASE-3-ARASTIRMA.md`) · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
