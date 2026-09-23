# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — TASK-2.17 ✅: Yasal metnin **ölçüm ve aktarım** beyanları ölçülene hizalandı ve **B-024 kapandı** (dört kalemin dördü de bitti; hukuki dayanak ayağı B-008'de devam eder). İki yanlış iddia silindi (*"kayıtlarında IP adresinizi tutmaz"*, *"bu ölçüme kişisel verileriniz aktarılmaz"*); yerine erişim kaydının IP ve tarayıcı bilgisi tuttuğu **hiçbir süre vaat edilmeden** yazıldı, Gizlilik'teki ikiz cümle de düzeltildi. Tedarikçi listesi 3 → **4 kalem** (ekip posta kutusu eklendi) ve dördünün de ülkesi **bu turda kaynağından ölçüldü**: Vercel fonksiyonu `iad1`/Washington D.C. (3/3 koşum) · Hetzner `CLOUD-NBG1`/DE · Resend'in kendi DPA'sı/ABD + gönderim `eu-west-1`/İrlanda (ayrı cümlelerde) · ekip kutusu Google MX. **Devralınan bir özet çürütüldü:** `session` tablosu ülke/bölge/şehrin yanında `browser/os/device/screen/language` de tutuyor. Sunucu rakamları yeniden alındı (615.853 satır, rotasyon 0, pencere hiç kaymamış). v1 paritesi 5/5. Batarya 180 sabit — kapı TASK-2.18'in işi.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; `destek@alpfitplus.com` test postası alıyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ (2026-09-23: bir task iptal, üç hedefli düzeltme) · task çalıştırma 16/19 (TASK-2.01 → 2.17 tamamlandı; TASK-2.03 ❌ iptal). Sıra TASK-2.18'de — kalan üç task yasal beyan kapısı (2.18-2.19) ve MX kaydı (2.20). Yasal **metin** tarafı bitti.
**Faz Dokümanı:** `phases/PHASE-2.md` 🔄 (bölme çocuğu: `phases/PHASE-2-ARASTIRMA.md`) · önceki faz: `phases/PHASE-1.md` ✅

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

**Task:** TASK-2.18 — Yasal beyan testi, depo içi yedi olgu (B-060)
**Durum:** ⬜ Bekliyor
**İlerleme:** TASK-2.17 kapandı ve arşive gitti; **B-024 kapandı ve arşive gitti** (dört kalemin dördü de bitti). Yasal metnin hem talep yolu hem **ölçüm hattı** artık ölçülmüş gerçeği anlatıyor ve aktarım dökümü dört tedarikçinin ülkesini söylüyor. Metin **son hâlini aldı** — sıra onu çivileyen kapıda: 2.18 (depo içi yedi olgu) ve 2.19 (çapraz depo "12 ay" dalı), sonra MX kaydı (2.20). Sıradaki adım `/devflow:run-task`.
**Not:**
- ⚠️ **TASK-2.18/2.19 bu sekiz olguyu çivileyecek — hepsi TASK-2.17'de ölçüldü ve çapaları `legal.ts`'te Aktarım bölümünün üstündeki yorum bloğunda kalem kalem duruyor:** (1) Vercel fonksiyon bölgesi `iad1` (repoda `vercel.json`/`preferredRegion` yok — kapı bu yokluğu ölçebilir), (2) sunucu Hetzner/Nürnberg/DE, (3) Resend'in ABD beyanı, (4) Resend gönderim bölgesi `eu-west-1`, (5) ekip kutusu `kiwiailab.com` → Google MX, (6) erişim kaydında rotasyon yok, (7) Umami şemasında IP sütunu yok, (8) "12 ay" (bu sonuncusu **çapraz depo**, 2.19'un dalı). ⚠️ İlk beşi **depo dışı** olgulardır — kapı yazılırken hangisinin repodan ölçülebildiğine dikkat: yalnız (1)'in yokluk yarısı ve (8) repo içinden görülür.
- **Yasal metinde yerine yazılan cümle de bir iddiadır — ve devralınan bir ÖZET de öyle.** TASK-2.16'da iki yeni beyan ilk hâlinde fazlasını söylemişti; TASK-2.17'de bu sınıf bir kez daha ateşledi ama farklı yerden: TASK-2.01'in *"`session` yalnız ülke/bölge/şehir tutuyor"* özeti **eksikti** (tablo ayrıca `browser/os/device/screen/language` tutuyor) ve olduğu gibi metne geçseydi yeni bir eksik beyan doğardı. Kapsam cümlenin öznesinde saklı; ölçümün özetine değil **ölçümün kendisine** dön.
- **Bir sağlayıcı için iki ayrı ülke sorusu var:** *nerede işliyor* (Vercel → ABD, ölçüldü) ile *şirket nerede* (Google → ABD merkezli, ama Workspace veri bölgesi **ölçülmedi**, o yüzden metin yalnız "merkezli" diyor). v1 bu tuzağa bir kez düştü (Resend "İrlanda bölgesi" → "veri AB'de kalıyor" yanlış çıktı); metin gönderim bölgesiyle saklama yerini bilerek ayrı cümlelerde tutuyor.
- **Rotasyon tanımlı ama konteynere inmiyor:** `daemon.json` `50m × 3` diyor, `bunker-nginx` ondan önce oluşturulduğu için kural uygulanmıyor. Düzeltme **bu reponun işi değil** (evi `altyapi/vps`) — `BULGULAR.md` → Gelen Kutusu'nda. Yapılırsa ≈ 30 günlük bir pencere doğar ve metin o gün bir süre yazabilir hâle gelir.
- **Yasal beyan sayısı taban, tavan değil:** `legal.ts` satır satır okundu, koda/konfige bağlı **en az sekiz** olgu iddiası var; faz sekizinin tamamını bağlar (kullanıcı kararı). Milestone'un "dört beyan" ifadesi **alt sınırdır** (`phases/PHASE-2-ARASTIRMA.md`).
- ⚠️ **Yeni yayın kapısı var (TASK-2.11):** bir kalemi `yolda`/`sonra`'dan `simdi`'ye taşımak, o kalemi anan cümleler `upcomingCapability`/`stageNote` çağırdığı için **derlemeyi durdurur** — bilinçli fail-closed. Ters yön (yeni kalem `yolda`'ya eklemek) serbesttir.
- ⚠️ **Görsel hattın iki mekanik kapısı metin tarafına da dokunuyor:** (1) `tests/iddia-metinleri.test.ts` `research/lib/screen-cleanup-v2.mjs`'i import ediyor ve "alt metin, hattın o ekrandan düşürdüğü kartı anamaz" kuralını koşuyor; (2) aynı dosya yasaklı iddia sözlüğünün yol-haritası terimlerini `CAPABILITIES.simdi`'ye karşı doğruluyor — bir kalem yayınlanırsa test kırmızı döner ve sözlük satırı çıkarılmalıdır.
- **Görsel hattın bugünkü hâli (TASK-2.15 sonrası):** denetim **dört dallı**; yasaklı iddia sözlüğü `research/lib/claim-leak.mjs` (20 kalıp, beş sınıf), izin listesi `CLAIM_ALLOW` **tam değere** bakıyor ve bugün tek cümle içeriyor. Ad tablosu (`REPLACEMENTS`) ile iddia tablosu (`CLAIM_REPLACEMENTS`) **ayrıdır** — birleştirmek yasaklı ad kümesini "ciro"/"doluluk" gibi sıradan sözcüklerle doldurur (ölçüldü). Düşürme sözleşmesi artık "tam N eşleşme" (üçüncü alan). `sube.webp` hâlâ hattın dışında.
- **B-044 açık kalan kalemler:** avatar baş harfleri (semt + `.av` sınıfının 25 düğümü) ve **tarih/makullük sınıfı** (`Açılış: Şubat 2026 · 4 aylık`, `Ekipte: Mar 2023`) — ikincisi sözlüğe **bilinçle alınmadı** (kalıp alınsaydı finans ekranının "son 6 ay" ekseni ve "Haziran 2026" başlığı kırmızıya düşerdi) ve Gelen Kutusu'nda kullanıcı kararı bekliyor. Hero'daki elle yazılmış "%78" kartı hattın çıktısı olmadığı için yapısal olarak görülemiyor → M6 F6.4.
- **TASK-2.20 (MX kayıtları) kullanıcı eliyle ilerler** — DNS adımı Squarespace'te kullanıcıdadır; faz yönergeyi yazar, ölçer ve gerçek test postasıyla doğrular. Kullanıcı kaydı girmezse task ⏸️ duraklar, faz kilitlenmez.
- **Tarayıcı katmanlı kriterler `kanal: UAT` işaretli** (TASK-2.04 · 2.05 · 2.06 · 2.20; ilk üçü ölçülerek kapandı): projenin otomatik katmanı gerçek tarayıcı yerleşimini ve odağını ölçmüyor; kalıcı tarayıcı betiği bilinçli olarak "Kalite kapıları otomatik" fazına bırakıldı.
- **Faz 2 kapsamı dokuz bulgu:** B-029 ✅ · B-018 ✅ · B-024 ✅ · B-011 · B-058 ✅ · B-034 ✅ · B-055 ✅ · B-060 · B-059'un onay-e-postası ayağı ✅ (yan kazanç B-040 ✅). Kalan: B-060 (2.18-2.19), B-011 (2.20). ⚠️ B-024 kapandı ama **hukuki dayanak (KVKK m.9) ayağı B-008'de devam ediyor** — o hukukçunun işi, fazı kilitlemiyor.
- **Sıra değişti:** "Görsel ve mobil iyileştirme" fazı alan adı geçişinin **önüne** alındı (kullanıcı kararı) — ölçülmüş AA kontrast ihlalleri (B-032) canlıya çıkmasın. B-032 · B-033 · B-031 o faza atandı.
- **Kullanıcı gözü bekleyen iki kalem (Faz 1 milestone'unun doğrulama ayakları, kapanışı engellemedi):** (1) `DEMO_TO`'ya giden e-postanın **gelen kutusunda mı spam'de mi** olduğu; (2) **Umami panelinin arayüzünde** v2 kaydının gözle görülmesi. İkisinin de ürün tarafı ölçüldü; kayıt `phases/PHASE-1.md` → Milestone kapanış notu.
- **Yerel üretim provası (3100) hedefsizdir** (TASK-2.02): `web-prod`'a `LEAD_STORE_URL` / `LEAD_FILE_PATH` / `RESEND_API_KEY` açıkça **boş** veriliyor ve uç geçerli talebe `503 no-sink` dönüyor — **doğru** davranış (M3 F3.1). İmaj TASK-2.15'te HEAD'ten yeniden derlendi (yeni ürün görselleri için).
- **Canlı depodaki test kayıtları:** `leads_preview` 15 kayıt (Faz 1'in bilinçli test turları; `leads` 2 → değişmedi). 12 aylık saklama işi siler. ⚠️ IP tuzu döndürülünce bu kayıtların `ip_hash`'i yeni kayıtlarla karşılaştırılamaz olur (bilinçli, `docs/DECISIONS.md`).
- **Yerel `lead-store` konteyneri hâlâ ayakta** (ölçüldü 2026-09-23: **88** test kaydı) — kaldırma/erişim komutları `memory/yerel-lead-deposu-docker-profili.md`.
- **Onay e-postası kodda açık ama yerelde anahtarsız:** `.env` yalnız beş depo anahtarı taşıyor, `RESEND_API_KEY` Vercel'de ve `--sensitive` (geri okunamaz). Gerçek gönderim gerektiren bir iş, kasa yordamıyla (`memory/anahtar-kasasi-config-alpfit.md`) dar yetkili geçici anahtar üretip iş bitince siler — TASK-2.07 böyle ölçtü.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 2.01 | TASK-2.01 — Sunucu ölçümü: nginx erişim kaydı + `.env` parmak izi (B-024, B-058) | ✅ Tamamlandı |
| 2.02 | TASK-2.02 — `.dockerignore` + `web-prod` bilinçli env (B-058) | ✅ Tamamlandı |
| 2.03 | TASK-2.03 — İki anahtarın döndürülmesi (B-058) | ❌ İptal — ön koşul ölçümle düştü (2026-09-23) |
| 2.04 | TASK-2.04 — Fiyat sayfasının mobil ana çağrısı 52 px'e döner (B-034) | ✅ Tamamlandı |
| 2.05 | TASK-2.05 — Demo formunda odak ve durum mekaniği (B-055 b·c·d·e·f·g) | ✅ Tamamlandı |
| 2.06 | TASK-2.06 — Alan bazlı hata metni ve `aria-invalid` işareti (B-055 a) | ✅ Tamamlandı |
| 2.07 | TASK-2.07 — Talep sahibine onay e-postası + `notify_lead` (B-059) | ✅ Tamamlandı |
| 2.08 | TASK-2.08 — Yetenek ve yol haritası tek kaynağı (B-029, B-040) | ✅ Tamamlandı |
| 2.09 | TASK-2.09 — Beş karşılıksız yetenek cümlesi düzeltilir (B-029) | ✅ Tamamlandı |
| 2.10 | TASK-2.10 — `/ozellikler` ve Kurucu Programı sabitten okur (B-040) | ✅ Tamamlandı |
| 2.11 | TASK-2.11 — Chat, SSS, fiyat ve karşılaştırma sayfası sabitten okur (B-040, B-014) | ✅ Tamamlandı |
| 2.12 | TASK-2.12 — Riskli alt küme taraması (B-029 kapanır) | ✅ Tamamlandı |
| 2.13 | TASK-2.13 — Ürün görseli temizliği: ad, Kampanyalar, Churn kartı (B-018) | ✅ Tamamlandı |
| 2.14 | TASK-2.14 — Denetimin ad dalı tablodan beslenir (B-018) | ✅ Tamamlandı |
| 2.15 | TASK-2.15 — Yasaklı iddia sözlüğü + denetimin iddia dalı (B-018 kapandı) | ✅ Tamamlandı |
| 2.16 | TASK-2.16 — Yasal metinde işlenen veri gerçeği + onay kapsamı (B-024) | ✅ Tamamlandı |
| 2.17 | TASK-2.17 — Ölçüm ve aktarım beyanları (B-024 kapandı) | ✅ Tamamlandı |
| 2.18 | TASK-2.18 — Yasal beyan testi — depo içi yedi olgu (B-060) | ⬜ Bekliyor |
| 2.19 | TASK-2.19 — Yasal beyan testi — çapraz depo "12 ay" dalı (B-060 kapanır) | ⬜ Bekliyor |
| 2.20 | TASK-2.20 — KVKK başvuru adresi: MX kayıtları ve test postası (B-011) | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 1'in 19 task'ı `phases/PHASE-1.md` → Task Listesi'nde, dokümanları `tasks/archive/`te.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-2.17 — Ölçüm ve aktarım beyanları ölçülene hizalandı, B-024 kapandı

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.17.md`

**Özet:**
- **İki yanlış ölçüm iddiası silindi, yerlerine ölçülen kondu — süre vaadi verilmeden.** *"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"* ve *"bu ölçüme kişisel verileriniz aktarılmaz"* gitti; metin artık ölçüm yazılımının **kendi sunucumuzdan yüklendiğini**, bu yüzden her ziyarette o sunucunun erişim kaydına IP ve tarayıcı bilgisi taşıyan bir satır düştüğünü, kaydın sunucuda kalıp bir başkasına gitmediğini ve **bugün otomatik bir silme süresi işletilmediğini** söylüyor. Umami'nin kendi veritabanı hakkındaki doğru olgu korundu ama öznesi daraltıldı ("bu ölçüm" → "bu **yazılımın kendi veritabanında**"). Task üç cümle sayıyordu; Gizlilik'teki **ikizi** de düzeltildi, yoksa yayında düzeltilmiş bir metnin yanında düzeltilmemiş kopyası kalacaktı.
- **Aktarım artık olgu: dört tedarikçinin dördünün de ülkesi bu turda kaynağından ölçüldü.** Liste 3 → **4 kalem** (bildirimin düştüğü **ekip posta kutusu** hiç yoktu), giriş `aktarılabilir` → `aktarılır`, altına *"yurt dışına aktarım koşullu bir ihtimal değil, her demo talebinde olan şey"* paragrafı. Ölçümler: Vercel fonksiyonu `x-vercel-id`'de üç koşumda da **`iad1` = Washington, D.C.** (repoda `vercel.json`/`preferredRegion` yok, platform varsayılanı; Vercel'in kendi belgesi doğruluyor) · RDAP'ta **Hetzner / CLOUD-NBG1 / DE** · Resend **kendi DPA'sında** ABD, gönderim bölgesi ayrıca ölçülüp (`eu-west-1`) **ayrı cümlede** yazıldı · ekip kutusu `kiwiailab.com` MX = Google. **Hukuki sebep bölümüne dokunulmadı** — m.9 hukukçuda (B-008).
- **Devralınan bir özet ölçümle çürütüldü ve sunucu rakamları yeniden alındı.** TASK-2.01'in *"`session` yalnız ülke/bölge/şehir tutuyor"* özeti eksikti: tablo ayrıca `browser/os/device/screen/language` tutuyor (IP sütunu gerçekten yok). Erişim kaydı da bugün yeniden ölçüldü — **615.853 satır / 604.452 ham IPv4 / 5.647 benzersiz IP**, rotasyon dosyası **0** ve **pencere başlangıcı hiç kaymamış**, yani rotasyon hiç olmadı. **v1 paritesi:** `RECIPIENTS`'ın beş kaleminin **beşi de** karşılandı + `TRANSFER_FACT`; iki yerde v2 daha ileride. **B-024 kapandı ve arşive gitti** (44 → 43 açık bulgu).

**Test:** `npm test` **180 geçti + 1 atlandı** (taban birebir; bu task test eklemedi — kapı bilinçle 2.18'in işi). `docker compose exec web npx tsc --noEmit` çıkış 0 (⚠️ `npx tsc` **host'ta çalışmaz**, TypeScript yalnız konteynerde). Üretim derlemesi `docker compose build web-prod` başarılı ve imaj **tazeliği ölçülerek** iki kez yeniden kaldırıldı. **Beş ölçüm:** `a11y` 8 rota **TOPLAM SORUN 0** · `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir) · `font-guard` 16 sayfa / **85.015** karakter (taban 82.502; metin büyüdü), eksik karakter yok · `scan` 390×844 `/kvkk` 9 kare, `/gizlilik` 6, `/kullanim-kosullari` 5 — üçünde de konsol temiz. ⚠️ **`/kvkk` ve `/gizlilik` `mobile-audit`'in rota listesinde yok** (B-012): üç yasal sayfa ayrı sondayla **320/360/390/412** px'te ölçüldü → **12/12 yatay kaydırma yok**; sonda `/work` dışına bağlandı ve repoda dosya kalmadığı doğrulandı. **Sunucu ölçümlerinin tamamı salt okuma** — hiçbir dosya, servis ya da konfigürasyon değişmedi; hiçbir sır değeri hiçbir yere yazılmadı.

---

### TASK-2.16 — Yasal metnin işlenen-veri anlatımı ölçülene hizalandı, onay kapsamı genişledi

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.16.md`

**Özet:**
- **IP artık metinde ve iki kullanımı ayrı.** KVKK'nın işlenen-veri listesi "tarih ve saat ile **IP adresinizden üretilen özet**" diyor; altındaki paragraf (a) on dakikalık pencerede talep sayan, **yalnız geçici bellekte duran** ve hiçbir kayda yazılmayan sayacı, (b) kayda giren, **gizli anahtarla** üretilen özeti ve onun kayıtla birlikte 12 ay sonra silinmesini anlatıyor. Özetin depodaki amacı da yazılı (aynı adresten gelen talepleri saymak — deponun `ip_hash` indeksi hız sınırı sorgusu için).
- **Karşılıksız kalan "tarayıcı bilgisi" kalemi düşürüldü.** `ua` depo gövdesinin beyaz listesinde yok, iki e-posta metninde de yok; tek kalıcılaşma yolu `LEAD_FILE_PATH` ve **ölçüldü** ki Vercel'de Production/Preview/Development'ın hiçbirinde tanımlı değil (`vercel env ls`, yedi anahtar adı). Yerine kapsamı dar bir cümle kondu. Gizlilik'in topladığı-veri listesi KVKK'nınkiyle aynı kategorileri sayar hâle geldi; amaç listesi onay e-postasını ve hız sınırını kapsadı.
- **Onay artık işlenen veriden dar değil — bedeli ölçüldü.** Yeni metin formda verilen bilgileri, talebin tarih-saatini ve IP özetini sayıyor: 138 → **171 karakter**, 320 px'te 5 → **6 satır**, 412 px'te satır sayısı hiç değişmedi. "İşlem güvenliği verileri (tarih, saat, IP özeti)" kalıbı 217 karakter / **7 satır** ölçülüp elendi — terim 46 karakter götürüyor, kategori adı zaten bağlantının ucundaki KVKK metninde.

**Test:** `npm test` **180 geçti + 1 atlandı** (taban birebir; bu task test eklemedi — metin son hâlini almadan kapı yazılmaz, sıra bilinçli, B-060 → TASK-2.18). `npx tsc --noEmit` çıkış 0. Üretim derlemesi `docker compose build web-prod` başarılı ve imaj **tazeliği ölçülerek** yeniden kaldırıldı (3100 üç sayfada da yeni metni döndürüyor). **Beş ölçüm:** `a11y` 8 rota **TOPLAM SORUN 0** · `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir) · `font-guard` 16 sayfa / **82.502** karakter (taban 81.118), eksik karakter yok · `scan` 390×844 `/kvkk` 8 kare, `/gizlilik` 6, `/demo` 6 — üçünde de konsol temiz. ⚠️ **`/kvkk` ve `/gizlilik` `mobile-audit`'in rota listesinde yok** (B-012): değişen üç sayfa ayrı sondayla **320/360/390/412** px'te ölçüldü, dördünde de yatay kaydırma yok. Onay bloğunun büyümesi **hatırlanmadı, ölçüldü** — eski metin DOM'da geri konup yeniden ölçüldü (kaynağa dokunulmadı, geri yükleme doğrulandı). **Yazdığım iki yeni beyan ilk hâlinde fazlasını söylüyordu ve koda dönülünce yakalandı:** onay e-postasının kopyası ekip kutusunda **değil** (`toLeadEmail` yalnız ziyaretçiye gider, `reply_to` ekip) ve "tarayıcı bilgisini kaydetmiyoruz" kapsamsızdı (platform logları bu turda ölçülmedi) → cümle talebin kaydına daraltıldı. **Uydurma denetimi:** metne giren tek yeni süre "on dakika" (`WINDOW_MS`), sağlayıcı adı eklenmedi, Hukuki sebep bölümüne dokunulmadı (B-008).

---

---

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

> ⏸️ **Duraklatma yok** — Aktif çalışma devam ediyor.

<!-- Duraklatma durumunda format:
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** [task çalıştırma / planlama / review / quick / vb.]
> **Detay:** [Nerede kalındı, ne yapılacak]
> **Handoff:** [Task dokümanında mı, QUICK dosyasında mı, burada mı?]
-->

## Hızlı Erişim

**Aktif Task:** `tasks/TASK-2.18.md` ⬜ — Yasal beyan testi, depo içi yedi olgu (B-060)
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (araştırma detayı: `phases/PHASE-2-ARASTIRMA.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
