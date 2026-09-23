# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — TASK-2.20 ⏸️: KVKK başvuru adresinin DNS yönergesi yazıldı ve kaynağından doğrulandı (Squarespace **Add preset → Google Workspace MX** kararlaştırılan beş kayıtla birebir), ama **kayıtlar henüz girilmedi** — apex MX iki çözümleyicide de NODATA. Ölçülen taban alındı (TXT/NS/SOA + apex A `76.76.21.21`); bugün posta **örtük MX** ile web IP'sine düşüyor, temiz red değil. Batarya **211 geçti + 1 atlandı**, kod değişmedi. Sıra kullanıcıda.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; `destek@alpfitplus.com` test postası alıyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ (2026-09-23: bir task iptal, üç hedefli düzeltme) · task çalıştırma 18/19 (TASK-2.01 → 2.19 tamamlandı; TASK-2.03 ❌ iptal). **TASK-2.20 ⏸️ duraklatıldı** — ölçülebilir yarısı bitti (yönerge + taban ölçümü), kalan iki ayak kullanıcının Squarespace adımına bağlı. Fazın repo tarafında yapılacak işi kalmadı.
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

**Task:** TASK-2.20 — KVKK başvuru adresi: MX kayıtları ve test postası (B-011)
**Durum:** ⏸️ Duraklatıldı — kullanıcının DNS adımı bekleniyor (planlı el değişimi, engel değil)
**İlerleme:** TASK-2.20'nin **ölçülebilir yarısı bitti**: Squarespace yönergesi kaynağından doğrulanarak yazıldı (task dokümanında), bugünkü hâl ve bozulmama tabanı ölçüldü. **Kayıtlar henüz girilmedi** — apex MX iki bağımsız çözümleyicide de `Answer` yok (NODATA), yani öngörülen ⏸️ hâli gerçekleşti. Kalan iki ayak (beş kaydın ölçümü + gerçek test postası) **tek bir dış girdiye** bağlı. Sıradaki adım kullanıcı kaydı girdikten sonra `/devflow:resume`; fazın repo tarafında iş kalmadı. Açık bulgu **42** (B-011 açık).
**Not:**
- ⚠️ **Yasal beyan kapısı TAMAMLANDI (TASK-2.18 + 2.19) — 9 dal / 31 test.** Sekiz dal depo içinden ölçüyor, dokuzuncusu komşu depodan: `web` servisi `../Alpfitplus-website.v1/pocketbase/pb_hooks`'u `/opt/v1-pb-hooks`'a **salt okunur** bağlıyor ve dal `RETENTION_MONTHS`'ı metin olarak okuyor. **Kapı `LEGAL_CONTRACT_HOOKS_DIR` env'i ile açılır; tanımsızken atlanır** — yani düz `docker compose exec web npm test` bundan sonra **204 geçti + 2 atlandı** gösterir (ikinci atlanan bu daldır, arıza değil). Tam koşum: `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **211**. ⚠️ Bağlama `restart` ile **gelmez**, `docker compose up -d web` gerekir. TASK-2.17'de ölçülen **depo dışı** olgular (Hetzner/DE · Resend ABD + `eu-west-1` · Google MX · Umami şemasında IP sütunu yokluğu · erişim kaydında rotasyon yokluğu) **bilerek çivilenmedi** — kaynakları canlı sistemler; çapaları `legal.ts`'in Aktarım yorumunda. Kapının kendi `ÖLÇÜLEMEYEN` blokları iki yüzeyi daha adıyla dışarıda bırakıyor: depo anahtarının **yetki yüzeyi** (komşu depo sözleşmesi) ve başvuru adresinin gerçekten **posta alması** (DNS → 2.20).
- ⚠️ **Kapı yazarken ölçülen üç fail-open — sonraki kapılar için geçerli:** (1) bir deseni **dosya genelinde** aramak yorum satırlarını da sayar (`data-exclude-search` `layout.tsx`'te 1 öznitelik + 1 yorum); (2) **iki jetonlu** desen araya giren bir cast'le kör kalır (`window.umami` ↔ `(window as unknown as {…}).umami`); (3) bir **önek süzgeci** aynı çağrının başka biçimini kaçırır (mutlak URL süzülüyor, göreli URL geçiyor). Üçü de negatif kontrolle bulundu, tahminle değil. Ayrıntı: `memory/urun-iddiasi-capa-dogrulamasi.md` → 7. kural.
- **Yasal metinde yerine yazılan cümle de bir iddiadır — ve devralınan bir ÖZET de öyle.** TASK-2.16'da iki yeni beyan ilk hâlinde fazlasını söylemişti; TASK-2.17'de bu sınıf bir kez daha ateşledi ama farklı yerden: TASK-2.01'in *"`session` yalnız ülke/bölge/şehir tutuyor"* özeti **eksikti** (tablo ayrıca `browser/os/device/screen/language` tutuyor) ve olduğu gibi metne geçseydi yeni bir eksik beyan doğardı. Kapsam cümlenin öznesinde saklı; ölçümün özetine değil **ölçümün kendisine** dön.
- **Bir sağlayıcı için iki ayrı ülke sorusu var:** *nerede işliyor* (Vercel → ABD, ölçüldü) ile *şirket nerede* (Google → ABD merkezli, ama Workspace veri bölgesi **ölçülmedi**, o yüzden metin yalnız "merkezli" diyor). v1 bu tuzağa bir kez düştü (Resend "İrlanda bölgesi" → "veri AB'de kalıyor" yanlış çıktı); metin gönderim bölgesiyle saklama yerini bilerek ayrı cümlelerde tutuyor.
- **Rotasyon tanımlı ama konteynere inmiyor:** `daemon.json` `50m × 3` diyor, `bunker-nginx` ondan önce oluşturulduğu için kural uygulanmıyor. Düzeltme **bu reponun işi değil** (evi `altyapi/vps`) — `BULGULAR.md` → Gelen Kutusu'nda. Yapılırsa ≈ 30 günlük bir pencere doğar ve metin o gün bir süre yazabilir hâle gelir.
- **Yasal beyan sayısı taban, tavan değil:** `legal.ts` satır satır okundu, koda/konfige bağlı **en az sekiz** olgu iddiası var; faz sekizinin tamamını bağlar (kullanıcı kararı). Milestone'un "dört beyan" ifadesi **alt sınırdır** (`phases/PHASE-2-ARASTIRMA.md`).
- ⚠️ **Yeni yayın kapısı var (TASK-2.11):** bir kalemi `yolda`/`sonra`'dan `simdi`'ye taşımak, o kalemi anan cümleler `upcomingCapability`/`stageNote` çağırdığı için **derlemeyi durdurur** — bilinçli fail-closed. Ters yön (yeni kalem `yolda`'ya eklemek) serbesttir.
- ⚠️ **Görsel hattın iki mekanik kapısı metin tarafına da dokunuyor:** (1) `tests/iddia-metinleri.test.ts` `research/lib/screen-cleanup-v2.mjs`'i import ediyor ve "alt metin, hattın o ekrandan düşürdüğü kartı anamaz" kuralını koşuyor; (2) aynı dosya yasaklı iddia sözlüğünün yol-haritası terimlerini `CAPABILITIES.simdi`'ye karşı doğruluyor — bir kalem yayınlanırsa test kırmızı döner ve sözlük satırı çıkarılmalıdır.
- **Görsel hattın bugünkü hâli (TASK-2.15 sonrası):** denetim **dört dallı**; yasaklı iddia sözlüğü `research/lib/claim-leak.mjs` (20 kalıp, beş sınıf), izin listesi `CLAIM_ALLOW` **tam değere** bakıyor ve bugün tek cümle içeriyor. Ad tablosu (`REPLACEMENTS`) ile iddia tablosu (`CLAIM_REPLACEMENTS`) **ayrıdır** — birleştirmek yasaklı ad kümesini "ciro"/"doluluk" gibi sıradan sözcüklerle doldurur (ölçüldü). Düşürme sözleşmesi artık "tam N eşleşme" (üçüncü alan). `sube.webp` hâlâ hattın dışında.
- **B-044 açık kalan kalemler:** avatar baş harfleri (semt + `.av` sınıfının 25 düğümü) ve **tarih/makullük sınıfı** (`Açılış: Şubat 2026 · 4 aylık`, `Ekipte: Mar 2023`) — ikincisi sözlüğe **bilinçle alınmadı** (kalıp alınsaydı finans ekranının "son 6 ay" ekseni ve "Haziran 2026" başlığı kırmızıya düşerdi) ve Gelen Kutusu'nda kullanıcı kararı bekliyor. Hero'daki elle yazılmış "%78" kartı hattın çıktısı olmadığı için yapısal olarak görülemiyor → M6 F6.4.
- ⚠️ **TASK-2.20 ⏸️ DURAKLADI — kullanıcıda iki adım var, ikisi de Squarespace/Google tarafında.** (1) `alpfitplus.com` DNS ekranında **Add preset → Google Workspace MX** (hazır seçenek kararlaştırılan beş kaydı birebir yazıyor — Squarespace'in kendi belgesinden doğrulandı; elle giriş yedeği task dokümanında). (2) Google yönetiminde `destek@alpfitplus.com`'un kullanıcı/takma ad/grup olarak **var olduğunun** teyidi — MX postayı yönlendirir ama kutuyu açmaz, bu adım atlanırsa test postası yine düşer ve sebebi DNS olmaz. Tam yönerge + ölçülen taban tablosu: `tasks/TASK-2.20.md` → Oturum Kayıtları.
- **MX yokluğunun bugünkü biçimi ölçüldü ve devralınan özetten farklı:** apex'in `A` kaydı var (`76.76.21.21`, Vercel), o yüzden posta temiz bir "bu alan posta kabul etmiyor" reddi almıyor — **örtük MX** kuralıyla web sunucusunun IP'sine 25. porttan bağlanmaya çalışıyor. Bölgenin SOA serisi hâlâ `1` ve hostmaster `cloud-dns-hostmaster.google.com`: bölge Google Domains'ten taşındığından beri hiç düzenlenmemiş — B-011'in "MX hiç girilmedi" kök neden yönünü bağımsız destekliyor.
- **Yasal metnin otuz gün taahhüdü İKİ yerde duruyor,** bir yerde değil: `legal.ts:230` (KVKK başvurusu) ve `:316` (silme talebi). Adres dört yerde geçiyor (`:48, 230, 316, 391`) ve **dördü de** `CONTACT.support` üzerinden — `src/` altında elle yazılmış tek adres yok (ölçüldü 2026-09-23). Devralınan satır çapaları (`site.ts:22`, `legal.ts:157/234/309`) TASK-2.16/2.17 sonrası çürümüştü, task dokümanında düzeltildi.
- **Tarayıcı katmanlı kriterler `kanal: UAT` işaretli** (TASK-2.04 · 2.05 · 2.06 · 2.20; ilk üçü ölçülerek kapandı): projenin otomatik katmanı gerçek tarayıcı yerleşimini ve odağını ölçmüyor; kalıcı tarayıcı betiği bilinçli olarak "Kalite kapıları otomatik" fazına bırakıldı.
- **Faz 2 kapsamı dokuz bulgu:** B-029 ✅ · B-018 ✅ · B-024 ✅ · B-011 · B-058 ✅ · B-034 ✅ · B-055 ✅ · B-060 ✅ · B-059'un onay-e-postası ayağı ✅ (yan kazanç B-040 ✅). **Kalan tek bulgu B-011** (2.20). ⚠️ B-024 kapandı ama **hukuki dayanak (KVKK m.9) ayağı B-008'de devam ediyor** — o hukukçunun işi, fazı kilitlemiyor.
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
| 2.18 | TASK-2.18 — Yasal beyan testi — depo içi sekiz olgu (B-060) | ✅ Tamamlandı |
| 2.19 | TASK-2.19 — Yasal beyan testi — çapraz depo "12 ay" dalı (B-060 kapandı) | ✅ Tamamlandı |
| 2.20 | TASK-2.20 — KVKK başvuru adresi: MX kayıtları ve test postası (B-011) | ⏸️ Duraklatıldı |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 1'in 19 task'ı `phases/PHASE-1.md` → Task Listesi'nde, dokümanları `tasks/archive/`te.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-2.20 — KVKK başvuru adresi: yönerge yazıldı ve ölçüldü, DNS adımı kullanıcıda

**Durum:** ⏸️ Duraklatıldı — 2026-09-23

**Detay:** `tasks/TASK-2.20.md`

**Özet:**
- **Yönerge hafızadan değil kaynağından yazıldı.** Squarespace'in kendi belgesi doğruladı: `account.squarespace.com/domains` → alan adı → **DNS** → **Add preset** → **Google Workspace MX** seçeneği tam olarak kararlaştırılan beş kaydı yazıyor (`1 aspmx` · `5 alt1` · `5 alt2` · `10 alt3` · `10 alt4`), yani kullanıcının beş satırı elle girmesi gerekmiyor; elle giriş yolu (`Type`/`Name`=`@`/`Priority`/`Mail Server`) yedeğe alındı. Yönergeye **ikinci bir kullanıcı adımı** eklendi: MX postayı Google'a yönlendirir ama kutuyu açmaz — `destek@alpfitplus.com`'un kullanıcı/takma ad/grup olarak var olduğu ayrıca teyit edilmeli, yoksa test postası DNS doğruyken bile düşer.
- **Dört ölçüm, hepsi bu turda.** (1) Apex MX **hâlâ NODATA** — `dns.google` ve `cloudflare-dns.com` ikisi de `Answer` yok + yalnız SOA, yani kayıt girilmemiş ve öngörülen ⏸️ hâli gerçekleşti. (2) Hedef küme tahmin değil kopya: `kiwiailab.com` bugün 5/5 kaydı aynı önceliklerle taşıyor. (3) **Bozulmama tabanı** alındı (SPF · site doğrulaması · Google DKIM · Resend DKIM · DMARC · 4 NS · SOA, TTL'leriyle) — Test Kriteri 2 kayıt girildikten sonra bu tabloya karşı doğrulanacak. (4) Apex `A` = `76.76.21.21`, `AAAA` yok: bugün posta **örtük MX** kuralıyla web sunucusunun IP'sine deneniyor, temiz red değil — devralınan "posta alamıyor" özeti doğru ama biçimi eksikmiş.
- **İki devralınan çapa çürütüldü.** Task dokümanının satır çapaları (`site.ts:22`, `legal.ts:48/157/234/309`) TASK-2.16/2.17 sonrası kaymış; ölçülen hâl `site.ts:24` ve `legal.ts:48/230/316/391` ve otuz gün taahhüdü **iki** yerde duruyor (başvuru + silme), bir yerde değil. Dört geçişin dördü de `CONTACT.support` üzerinden — elle yazılmış adres yok. **Gerçek gönderim sınaması bilinçle koşturulmadı:** kanıtlayacağı olgu iki çözümleyiciyle zaten ölçülü ve başarısızlık sınıfı A kaydıyla ücretsiz belirlendi; karşılığında yeni olgu vermeyen bir dış servis çağrısı yapılmadı.

**Test:** `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **211 geçti + 1 atlandı** (8 dosya geçti, 1 atlandı; 213 ms) — tur 19'un anahtarlı tabanıyla **birebir**, bu tur kod değiştirmediği için beklenen sonuç ve tabanı bağımsız doğruluyor. **Kaynak kodda değişiklik yok** (`src/` ve `research/` altında tek satır yok — task zaten "repo dosyası değişmez" diyor). **Kapsam uyarısı:** batarya adresin posta aldığını **ölçmez ve ölçemez** — `legal-consistency` dal 7 yalnız adresin `CONTACT.support`'tan geldiğini çiviliyor, `contact.test.ts`'in 20 testi telefon/e-posta **biçim** doğrulamasıdır ve alan adına hiç bakmaz; MX olgusunun kalıcı kapısı bilerek yok, evi M6 F6.3/F6.4. **Beş ölçüm betiği koşturulmadı** — render edilen yüzey bu turda hiç değişmedi.

---

### TASK-2.19 — Yasal beyan kapısının çapraz depo dalı: "12 ay" mekanizmanın evinden okunuyor

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.19.md`

**Özet:**
- **Sabit kopyalanmadı, bağlandı.** `web` servisi komşu deponun `pb_hooks` klasörünü `/opt/v1-pb-hooks`'a **salt okunur** bağlıyor; dal 9 `RETENTION_MONTHS`'ı metin olarak okuyor ve **beyan parçasını ölçülen sayıdan türetiyor** (`oluşturulmasından ${ay} ay sonra…`) — yön olgu → metin, ters yön kapıyı dairesel yapardı. *"Günlük çalışan"* ifadesi cron'un kendisine (`'30 3 * * *'` → her gün), sabitin ölü olmadığı kesim hesabına (`getUTCMonth() - RETENTION_MONTHS`) ve temizliğin **iki koleksiyonu da** kapsadığına ayrı ayrı bağlandı. Hedefin `/app` **dışında** olması bir tercih değil ölçüm sonucu: `/app` deponun kendi bind-mount'u ve içine açılan mount noktası repoda root sahipli boş dizin bırakıyor.
- **Kapı env'le açılıyor, sessizce geçmiyor.** `LEGAL_CONTRACT_HOOKS_DIR` tanımsızken dal atlanıyor ve bataryanın **geçen sayısı birebir korunuyor** (204 → 204; atlanan 1 → 2), tanımlıyken **211 geçti + 1 atlandı**, dosya 24 → **31 test**. CI'da komşu depo bulunmayacağı için atlama şart (sözleşme paketinin deseni). Tanımlıyken dosya yoksa/boşsa ya da bağlama **yazılabilirse** dal kırılıyor; salt okunurluk `access(W_OK)` ile ölçülüyor (`:ro` → `EROFS`) — yazma **denenmiyor**, çünkü başarılı bir deneme dokunulmazlık kuralını çiğnerdi.
- **On dört negatif kontrolün on dördü kırmızı — ve biri kapıyı büyüttü.** Kaynak dokunulmaz olduğu için mutasyonlar `pb_hooks`'un scratchpad **kopyasına** uygulandı, test kopyaya `:ro` bağlanarak ayrı bir konteynerde koşturuldu; tur sonunda kaynağın md5'i tur başıyla birebir. Düzeneğin kendi pozitif çapası önce koşturuldu (bozulmamış kopya → çıkış 0 / 31 geçti) ve her mutasyon `cmp` ile doğrulandı. Üç paragraftan **yalnız biri** güncellendiğinde fragman kontrolü yeşil kaldı → **bölüm geneli ay kontrolü** eklendi ve tek o yakaladı. **B-060 kapandı ve arşive gitti** (43 → 42 açık bulgu).

**Test:** Anahtarsız `npm test` **204 geçti + 2 atlandı** (taban 204 geçti + 1 atlandı — *geçen* birebir), anahtarlı **211 geçti + 1 atlandı**. `docker compose exec web npx tsc --noEmit` çıkış 0. Üretim derlemesi `docker compose build web-prod` çıkış 0. **Kaynak dosyalarda kalıcı değişiklik yok** — `src/`/`research/` altında tek satır değişmedi; iki negatif kontrol `legal.ts`'i geçici bozdu, ikisi de scratchpad yedeğinden `cp` ile geri alındı ve **md5 ile doğrulandı** (`git checkout`/`git restore` kullanılmadı). **Komşu depo dokunulmadı:** `lead_lib.js`/`retention.pb.js` md5'leri tur başıyla birebir. **Beş ölçüm** (render edilen yüzey bu turda hiç değişmedi, rakamlar tabanı bağımsız doğruluyor): `a11y` 8 rota **TOPLAM SORUN 0** · `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir) · `font-guard` 16 sayfa / **85.015** karakter (taban birebir), eksik karakter yok · `scan` 390×844 `/kvkk` **9 kare / 7.373 px, konsol temiz** (taban birebir) · `perf` (3100) CLS ≤ 0,001, LCP 28-60 ms. **3100 bayatlık sondası:** üretim konteyneri saklama bölümünün üç cümlesini de döndürüyor (2/2/2 vuruş), yani ölçülen yüzey güncel.

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

> ⏸️ **Duraklatıldı:** 2026-09-23
> **Adım:** task çalıştırma — TASK-2.20 (KVKK başvuru adresi, B-011)
> **Detay:** Task'ın repo tarafı bitti: Squarespace yönergesi kaynağından doğrulanarak yazıldı, bugünkü hâl ve bozulmama tabanı ölçüldü (apex MX hâlâ NODATA, iki çözümleyici). Kalan iki ayak — beş kaydın ölçümü ve gerçek test postası — **kullanıcının iki adımına** bağlı: (1) Squarespace DNS ekranında **Add preset → Google Workspace MX**, (2) Google yönetiminde `destek@alpfitplus.com` kutusunun/takma adının var olduğunun teyidi. İkisi bitince `/devflow:resume`.
> **Handoff:** Task dokümanında — `tasks/TASK-2.20.md` → Oturum Kayıtları (kullanıcı yönergesi, ölçülen taban tablosu, "Sonraki Adım Detayı" beş maddelik sıra).

<!-- Duraklatma durumunda format:
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** [task çalıştırma / planlama / review / quick / vb.]
> **Detay:** [Nerede kalındı, ne yapılacak]
> **Handoff:** [Task dokümanında mı, QUICK dosyasında mı, burada mı?]
-->

## Hızlı Erişim

**Aktif Task:** `tasks/TASK-2.20.md` ⏸️ — KVKK başvuru adresi: MX kayıtları ve test postası (B-011) · kullanıcının DNS adımı bekleniyor
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (araştırma detayı: `phases/PHASE-2-ARASTIRMA.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
