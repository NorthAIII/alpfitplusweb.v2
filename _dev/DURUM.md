# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — Kabul testi **2. turu** koştu (TASK-2.21 sonrası zorunlu yeniden koşum): 31 senaryonun **31'i geçti**, düzeltme task'ı doğmadı. Dokuz ters çevirmenin dokuzu kırmızı; faz dokümanı kırmızı çizgiyi aştığı için `PHASE-2-KAPSAM.md`'ye bölündü (20.107 → 15.657 token). **Faz review'a hazır.**

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** review
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ · kapsam revizyonu ✅ · task çalıştırma **19/19** ✅ (TASK-2.03 ve TASK-2.20 ❌ iptal) · **kabul testi ✅ iki tur**: 1. tur 30 senaryo / 29 geçti → kalan kalem TASK-2.21 ile kapandı; **2. tur 31 senaryo / 31 geçti, düzeltme task'ı doğmadı**. Fazda bekleyen task yok.
**Faz Dokümanı:** `phases/PHASE-2.md` 🔄 (bölme çocukları: `phases/PHASE-2-KAPSAM.md` · `phases/PHASE-2-ARASTIRMA.md` · `phases/PHASE-2-UAT.md`) · önceki faz: `phases/PHASE-1.md` ✅

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

**Task:** — yok · Faz 2'nin task listesi tamamlandı (21 satır: 19 ✅ · 2 ❌ iptal)
**Durum:** ✅ Bekleyen, devam eden ya da duraklatılmış task yok — kabul testi de geçildi, sıradaki adım faz review'ı (`review-phase`)
**İlerleme:** Kabul testinin 2. turu 31 senaryonun 31'ini kapattı ve **hiçbir kapsam-içi bulgu çıkmadı**. Dokuz ters çevirmenin dokuzu kırmızı verdi (yayın kapısı · tüketici kapısı · yasal beyan kapısının iki yanı · görsel denetimin ad ve iddia dalları · sözlüğün alt sınırı · `notify_lead` · bal küpü · onay tavanı · tavanın kanal-kapalı invaryantı); tur sonunda `src`/`research`/`tests` ağacının 99 dosyasının 99'u tur başı md5'iyle birebir. Ölçüm iki kez kendi kusurunu buldu ve düzeltti: bir `sed` sahte yeşil verdi, bir sonda uydurma hata koduyla kurulmuştu — ikisi de kontrolle yakalandı.
**Not:**
- ⚠️ **Çalışan `web-prod` konteyneri (3100) BAYAT ve ölçüm yaparken buna güvenilmemeli.** Ölçüldü 2026-09-23: konteyner 07:41'deki imajdan koşuyor, en yeni imaj 17:40'ta derlendi; konteynerde TASK-2.21'in kodu **yok** (`confirmCapped` 0 eşleşme, onay metni hâlâ `Merhaba ${r},`). `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — bunun için `docker compose --profile prod up -d web-prod` gerekir. Bu, açık bulgu **B-019**'un mekanizması; kabul testi bu yüzden üretim senaryolarını taze imajdan koşan geçici bir konteynere karşı ölçtü. ⚠️ `perf.mjs` 3100'e çivili ve env ile yönlendirilemiyor — bu turda iki yüzeyin **birebir aynı HTML** ürettiği önce kanıtlandı (tek fark Next `buildId`'si), yoksa perf rakamı bayat yüzeyi ölçerdi.
- ⚠️ **Onay e-postasının iki yeni kapısı var (TASK-2.21) ve ikisi de `/api/demo`'yu tekrar açan her işi ilgilendiriyor:** (1) `confirmCapped` **adres başına 24 saatte 3** sayar — sayaç `HITS` gibi bellek içi ve örnek başınadır, ve **yalnız `RESEND_*` tanımlıyken** işler (kanal kapalıyken hiç danışılmaz, yoksa gönderilmeyen e-postalar kotayı yakardı). (2) `content/mail.ts` → `text` **parametre almaz**; kişiselleştirmeyi geri getiren her değişiklik sahiplik sorusunu yeniden açar. ⚠️ **Test tarafına yansıması:** sayaç modül kapsamında ve dosya boyunca yaşıyor, o yüzden uca yazılan her senaryo kendi IP'sinin yanında **kendi e-posta adresini** de taşır (`validPayload()` varsayılanı artık her çağrıda tekil). Alt-adresleme (`ad+etiket@…`) bilinçle normalleştirilmedi.
- ⚠️ **Yasal beyan kapısı TAMAMLANDI (TASK-2.18 + 2.19) — 9 dal / 31 test.** Sekiz dal depo içinden ölçüyor, dokuzuncusu komşu depodan: `web` servisi `../Alpfitplus-website.v1/pocketbase/pb_hooks`'u `/opt/v1-pb-hooks`'a **salt okunur** bağlıyor ve dal `RETENTION_MONTHS`'ı metin olarak okuyor. **Kapı `LEGAL_CONTRACT_HOOKS_DIR` env'i ile açılır; tanımsızken atlanır** — yani düz `docker compose exec web npm test` **209 geçti + 2 atlandı** gösterir (ikinci atlanan bu daldır, arıza değil — rakam TASK-2.21 ile 204'ten yükseldi). Tam koşum: `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **216 geçti + 1 atlandı**. ⚠️ Bağlama `restart` ile **gelmez**, `docker compose up -d web` gerekir. TASK-2.17'de ölçülen **depo dışı** olgular (Hetzner/DE · Resend ABD + `eu-west-1` · Google MX · Umami şemasında IP sütunu yokluğu · erişim kaydında rotasyon yokluğu) **bilerek çivilenmedi** — kaynakları canlı sistemler; çapaları `legal.ts`'in Aktarım yorumunda. Kapının kendi `ÖLÇÜLEMEYEN` blokları iki yüzeyi daha adıyla dışarıda bırakıyor: depo anahtarının **yetki yüzeyi** (komşu depo sözleşmesi) ve başvuru adresinin gerçekten **posta alması** (DNS → 2.20).
- ⚠️ **Kapı yazarken ölçülen üç fail-open — sonraki kapılar için geçerli:** (1) bir deseni **dosya genelinde** aramak yorum satırlarını da sayar (`data-exclude-search` `layout.tsx`'te 1 öznitelik + 1 yorum); (2) **iki jetonlu** desen araya giren bir cast'le kör kalır (`window.umami` ↔ `(window as unknown as {…}).umami`); (3) bir **önek süzgeci** aynı çağrının başka biçimini kaçırır (mutlak URL süzülüyor, göreli URL geçiyor). Üçü de negatif kontrolle bulundu, tahminle değil. Ayrıntı: `memory/urun-iddiasi-capa-dogrulamasi.md` → 7. kural.
- **Yasal metinde yerine yazılan cümle de bir iddiadır — ve devralınan bir ÖZET de öyle.** TASK-2.16'da iki yeni beyan ilk hâlinde fazlasını söylemişti; TASK-2.17'de bu sınıf bir kez daha ateşledi ama farklı yerden: TASK-2.01'in *"`session` yalnız ülke/bölge/şehir tutuyor"* özeti **eksikti** (tablo ayrıca `browser/os/device/screen/language` tutuyor) ve olduğu gibi metne geçseydi yeni bir eksik beyan doğardı. Kapsam cümlenin öznesinde saklı; ölçümün özetine değil **ölçümün kendisine** dön.
- **Bir sağlayıcı için iki ayrı ülke sorusu var:** *nerede işliyor* (Vercel → ABD, ölçüldü) ile *şirket nerede* (Google → ABD merkezli, ama Workspace veri bölgesi **ölçülmedi**, o yüzden metin yalnız "merkezli" diyor). v1 bu tuzağa bir kez düştü (Resend "İrlanda bölgesi" → "veri AB'de kalıyor" yanlış çıktı); metin gönderim bölgesiyle saklama yerini bilerek ayrı cümlelerde tutuyor.
- **Rotasyon tanımlı ama konteynere inmiyor:** `daemon.json` `50m × 3` diyor, `bunker-nginx` ondan önce oluşturulduğu için kural uygulanmıyor. Düzeltme **bu reponun işi değil** (evi `altyapi/vps`) — `BULGULAR.md` → Gelen Kutusu'nda. Yapılırsa ≈ 30 günlük bir pencere doğar ve metin o gün bir süre yazabilir hâle gelir.
- **Yasal beyan sayısı taban, tavan değil:** `legal.ts` satır satır okundu, koda/konfige bağlı **en az sekiz** olgu iddiası var; faz sekizinin tamamını bağlar (kullanıcı kararı). Milestone'un "dört beyan" ifadesi **alt sınırdır** (`phases/PHASE-2-ARASTIRMA.md`).
- ⚠️ **Yeni yayın kapısı var (TASK-2.11):** bir kalemi `yolda`/`sonra`'dan `simdi`'ye taşımak, o kalemi anan cümleler `upcomingCapability`/`stageNote` çağırdığı için **derlemeyi durdurur** — bilinçli fail-closed. Ters yön (yeni kalem `yolda`'ya eklemek) serbesttir.
- ⚠️ **Görsel hattın iki mekanik kapısı metin tarafına da dokunuyor:** (1) `tests/iddia-metinleri.test.ts` `research/lib/screen-cleanup-v2.mjs`'i import ediyor ve "alt metin, hattın o ekrandan düşürdüğü kartı anamaz" kuralını koşuyor; (2) aynı dosya yasaklı iddia sözlüğünün yol-haritası terimlerini `CAPABILITIES.simdi`'ye karşı doğruluyor — bir kalem yayınlanırsa test kırmızı döner ve sözlük satırı çıkarılmalıdır.
- **Görsel hattın bugünkü hâli (TASK-2.15 sonrası):** denetim **dört dallı**; yasaklı iddia sözlüğü `research/lib/claim-leak.mjs` (20 kalıp, beş sınıf), izin listesi `CLAIM_ALLOW` **tam değere** bakıyor ve bugün tek cümle içeriyor. Ad tablosu (`REPLACEMENTS`) ile iddia tablosu (`CLAIM_REPLACEMENTS`) **ayrıdır** — birleştirmek yasaklı ad kümesini "ciro"/"doluluk" gibi sıradan sözcüklerle doldurur (ölçüldü). Düşürme sözleşmesi artık "tam N eşleşme" (üçüncü alan). `sube.webp` hâlâ hattın dışında.
- **B-044 açık kalan kalemler:** avatar baş harfleri (semt + `.av` sınıfının 25 düğümü) ve **tarih/makullük sınıfı** (`Açılış: Şubat 2026 · 4 aylık`, `Ekipte: Mar 2023`) — ikincisi sözlüğe **bilinçle alınmadı** (kalıp alınsaydı finans ekranının "son 6 ay" ekseni ve "Haziran 2026" başlığı kırmızıya düşerdi) ve Gelen Kutusu'nda kullanıcı kararı bekliyor. Hero'daki elle yazılmış "%78" kartı hattın çıktısı olmadığı için yapısal olarak görülemiyor → M6 F6.4.
- ⚠️ **B-011 fazdan çıktı — iki kullanıcı adımı hâlâ duruyor ama artık Faz 2'yi beklemiyor.** (1) `alpfitplus.com` DNS ekranında **Add preset → Google Workspace MX**; (2) Google yönetiminde `destek@alpfitplus.com`'un kullanıcı/takma ad/grup olarak **var olduğunun** teyidi — MX postayı yönlendirir ama kutuyu açmaz, bu adım atlanırsa test postası DNS doğruyken bile düşer. **Tam yönerge, bozulmama tabanı ve kapanış ölçümünün sırası artık bulgunun kendi evinde:** `bulgular/B-011-apex-mx-kaydi-yok.md` → Çözüm Yolu. Kullanıcı kayıtları istediği gün girebilir; ölçüm ve test postası "Alan adı geçişi" fazında koşar.
- **Yasal metnin otuz gün taahhüdü İKİ yerde duruyor,** bir yerde değil: `legal.ts:230` (KVKK başvurusu) ve `:316` (silme talebi). Adres dört yerde geçiyor (`:48, 230, 316, 391`) ve **dördü de** `CONTACT.support` üzerinden — `src/` altında elle yazılmış tek adres yok (ölçüldü 2026-09-23). Devralınan çapalar (`site.ts:22`, `legal.ts:157/234/309`) TASK-2.16/2.17 sonrası çürümüştü; düzeltilmiş hâlleri B-011 atomuna işlendi ki sonraki faz aynı yanlış satırlara bakmasın.
- **Tarayıcı katmanlı kriterler `kanal: UAT` işaretli** (TASK-2.04 · 2.05 · 2.06 · 2.20; ilk üçü ölçülerek kapandı): projenin otomatik katmanı gerçek tarayıcı yerleşimini ve odağını ölçmüyor; kalıcı tarayıcı betiği bilinçli olarak "Kalite kapıları otomatik" fazına bırakıldı.
- **Faz 2 kapsamı dokuz bulgu:** B-029 ✅ · B-018 ✅ · B-024 ✅ · B-011 · B-058 ✅ · B-034 ✅ · B-055 ✅ · B-060 ✅ · B-059'un onay-e-postası ayağı ✅ (yan kazanç B-040 ✅). **B-011 kapsam kararıyla fazdan çıktı** (2026-09-23) — fazın bulgu bilançosu böylece **sekizde sekiz**. ⚠️ B-024 kapandı ama **hukuki dayanak (KVKK m.9) ayağı B-008'de devam ediyor** — o hukukçunun işi, fazı kilitlemiyor.
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
| 2.20 | TASK-2.20 — KVKK başvuru adresi: MX kayıtları ve test postası (B-011) | ❌ İptal — konusu kapsam kararıyla alan adı geçişi fazına taşındı (2026-09-23) |
| 2.21 | TASK-2.21 — Onay e-postası yalnızca doğrulanabilir bir alıcıya gider (UAT senaryo 26) | ✅ Tamamlandı |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 1'in 19 task'ı `phases/PHASE-1.md` → Task Listesi'nde, dokümanları `tasks/archive/`te.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-2.21 — Onay e-postasının alıcısı doğrulanmıyordu: tavan kondu, metinden serbest yazı çıkarıldı

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.21.md`

**Özet:**
- **Üç seçenekten ikisi birlikte alındı, en sağlamı bilinçle reddedildi.** Tek başına hiçbiri bulguyu kapatmıyordu: yalnız **tavan** saldırganın kendi yazdığı metni üçüncü bir adrese tavan kadar göndermesine izin verirdi, yalnız **metin temizliği** gönderici itibarını yiyen hacmi hiç kırpmazdı. İkisi birden alındı çünkü bedeli üç dosya ve **sıfır akış değişikliği**. Çift-katılım (doğrulama bağlantısı) reddedildi: ILKELER'in 1. ekseniyle (Dönüşüm) çatışıyor, saklanan jeton yeni bir kişisel veri alanı ve aynı turda yasal metin revizyonu demek, pilot hacmiyle orantısız. Kapanmayan artık açıkça yazıldı — **adresin sahipliği hâlâ doğrulanmıyor**, kalan yüzey tavanlı ve içeriksiz (`docs/DECISIONS.md`).
- **Sayaç, kardeşinin ölçülmüş kusurlarını tekrarlamıyor.** `confirmCapped` adres başına 24 saatte 3 sayar ve `HITS`'in B-037'de ölçülen iki arızasını bilinçle almaz: reddedilen deneme sayaca yazılmaz, harita dolduğunda `clear()` ile herkesin sayacı silinmez (`pruneConfirmHits` yalnız süresi geçmişi budar). Sayaç **yalnız kanal açıkken** işler — aksi hâlde hiç gönderilmeyen e-postalar kotayı yakardı (3100 provası tam bu hâlde). `toLeadEmail` artık boolean değil `NotifyLead` döndürüyor: "gönderilmedi"nin iki anlamı (`skipped` = denenmedi / `failed` = sağlayıcı reddetti) boolean'a sığmıyordu ve çağrı yerinde yeniden türetilseydi tavan dalı sessizce `failed` okunurdu. `notify_lead` kümesi **büyütülmedi**.
- **Yeni sayaç bataryayı kırdı ve teşhis düzeltmeden değerliydi.** `validPayload()` varsayılan adresi sabitti ve mail kanalını açan yedi senaryo aynı adresi kullanıyordu — tavan dosyanın ortasında doluyor, sonraki senaryo sahte kırmızı okuyordu. Çözüm senaryoları tek tek düzenlemek değil, varsayılanı **her çağrıda tekilleştirmek** oldu; bu, memory'deki "her senaryo kendi IP'sini taşır" disiplininin ikinci sayaç için eşidir ve dosya başlığına yazıldı. **Yasal metin gözden geçirildi ve DEĞİŞMEDİ**: M3 F3.2'nin tetiği ateşlemiyor (yeni hedef/alan/sağlayıcı yok) ve metnin hiçbir yaşayan cümlesi yanlışlaşmıyor — gerekçe task dokümanında yazılı.

**Test:** `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **216 geçti + 1 atlandı** (taban 211+1); anahtarsız **209 geçti + 2 atlandı** (taban 204+2) — *geçen* sayısı iki modda da tam **+5**. `tsc --noEmit` çıkış 0 · `docker compose build web-prod` çıkış 0. **Kötüye kullanım sondası:** aynı üçüncü adrese altı istek (her biri ayrı `X-Forwarded-For`) → **3 gitti / 3 tavana takıldı**, takılanlar `notify_lead: skipped`, altısında da ziyaretçi `200` + aynı gövde alanlarını gördü ve ekip bildirimi altı kez gitti. **Dört ters çevirme, dördü kırmızı:** tavan söküldü (2 kırmızı) · onay hiç gönderilmiyor — boş kapsam bekçisi (9 kırmızı) · serbest metin geri kondu (2 kırmızı) · anahtar küçük harfe indirgenmiyor (1 kırmızı); hepsi scratchpad kopyasından `cp` ile geri alındı, **md5 her seferinde tur başıyla birebir** (`git checkout`/`git restore` kullanılmadı). **Beş ölçüm betiği koşturulmadı, kapsamı bu turda boş:** değişen üç dosyanın hiçbiri render edilen yüzeye girmiyor — `content/mail.ts`'i yalnız `api/demo/route.ts` import ediyor (ölçüldü) ve `route.ts` bir API ucu; geçerli taban TASK-2.19'un koşumudur. **ÖLÇÜLEMEYEN:** canlı gönderim sondası yapılamadı (tavan yalnız `RESEND_*` tanımlıyken işler, yerelde anahtar yok ve gerçek sonda üçüncü bir adrese gerçek e-posta göndermek demekti); sayacın istekler arası yaşadığı olgusu aynı modüldeki kardeşi `HITS` için canlı ölçülmüştü (TASK-1.06 / B-037).

---

### TASK-2.20 — KVKK başvuru adresi: konusu fazdan çıktı, ölçülen zemin bulguya mezun edildi

**Durum:** ❌ İptal — 2026-09-23

**Detay:** `tasks/archive/TASK-2.20.md`

**Özet:**
- **İptal edilen task, iptal edilen iş değil.** Faz 2'nin yeniden kapsam tartışmasında kullanıcı B-011'i **"Alan adı geçişi" fazına taşıdı**: task'ın kalan iki ayağı (beş MX kaydının girilmesi + gerçek test postası) **kullanıcının Squarespace DNS adımına** bağlıydı ve ILKELER'in pazarlıksız maddesi böyle bir işin fazı kilitlemesini yasaklıyor. Hedef faz keyfi değil — task'ın kendi Feature alanı zaten *"F7.5'in ön koşulu"* diyordu ve otuz gün taahhüdü ancak site `alpfitplus.com`'a bağlanınca birine görünür olur; bugün site noindex önizlemede, alan adını hâlâ v1 sunuyor. Milestone'un *"test postası alıyor"* ayağı bu kararla düştü (üç kopyada da: faz dokümanı · PHASES · DURUM).
- **Ölçülen zemin arşive gömülmedi, atoma taşındı.** `bulgular/B-011-*.md` artık dört şeyi taşıyor: kaynağından doğrulanmış Squarespace yönergesi (**Add preset → Google Workspace MX** + elle giriş yedeği + "duran kaydı silme" uyarısı), **ikinci** kullanıcı adımı (Google'da kutu/takma ad — MX postayı yönlendirir, kutuyu açmaz), TXT/NS/SOA bozulmama tabanı ve bugünkü başarısızlık biçimi (apex A `76.76.21.21` → **örtük MX**, temiz red değil). Kapanış ölçümünün beş adımlık sırası da orada — o faz sıfırdan başlamaz. Atomun **Durum**'u Açık'a döndü, index satırından `→ Faz 2` işareti kalktı.
- **Çürük çapalar bulgunun evinde düzeltildi.** Atomun devraldığı satır numaraları TASK-2.16/2.17'den sonra kaymıştı: `site.ts:22` → **`:24`**, `legal.ts:133/198/273` → **`:230/316/391`**; ayrıca otuz gün taahhüdünün **iki** yerde durduğu (başvuru + silme) yazıldı. Düzeltilmeseydi sonraki faz yanlış satırlara bakarak başlayacaktı.

**Test:** **Koşturulmadı ve koşturulması gerekmedi** — bu tur doküman turudur, `src/` ve `research/` altında tek satır değişmedi (ölçüldü). Geçerli taban tur 19'un anahtarlı koşumudur: `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **211 geçti + 1 atlandı**. **Kapsam uyarısı değişmedi:** batarya adresin posta aldığını ölçmez ve ölçemez — `legal-consistency` dal 7 yalnız adresin `CONTACT.support`'tan geldiğini çiviliyor; MX olgusunun kalıcı kapısı bilerek yok, evi M6 F6.3/F6.4 (B-011 atomunda Koruma Önerisi olarak kayıtlı).

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

**Aktif Task:** — yok · fazın task listesi bitti; son kapanan `tasks/archive/TASK-2.21.md` ✅
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (kapsam: `phases/PHASE-2-KAPSAM.md` · araştırma detayı: `phases/PHASE-2-ARASTIRMA.md` · UAT detayı: `phases/PHASE-2-UAT.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
