# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — plan revizyonu (Faz 2): TASK-2.03 ❌ iptal edilip arşive taşındı (sunucu↔yerel parmak izi eşleşmedi, döndürülecek canlı anahtar yok), B-058'in kalan işi ve atom kapanışı TASK-2.02'ye geçti, TASK-2.17'nin zemini ölçülmüş rakamlarla sabitlendi ve milestone'un anahtar ayağı ölçümü anacak şekilde yeniden yazıldı (kullanıcı kararı). `Adım` → `task`; sıradaki adım `/devflow:run-task` (TASK-2.02).

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; `destek@alpfitplus.com` test postası alıyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ (2026-09-23: bir task iptal, üç hedefli düzeltme) · task çalıştırma 1/19 (TASK-2.01 ✅, TASK-2.03 ❌ iptal). Sıra TASK-2.02'de.
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

**Task:** TASK-2.02 — `.env` üretim imajından çıkar, yerel prova hedefini açıkça söyler (B-058 kapanır)
**Durum:** ⬜ Bekliyor
**İlerleme:** Plan revizyonu bitti; sıradaki adım `/devflow:run-task`. TASK-2.02'nin kendi içeriği TASK-2.01'in ölçümünden **etkilenmedi** (koşulsuz yapısal düzeltme) — değişen tek şey B-058'in atom kapanışının artık bu task'a ait olması.
**Not:**
- **Plan revizyonu (2026-09-23) üç şey yaptı:** TASK-2.03 ❌ iptal edilip arşive taşındı (döndürülecek canlı anahtar yok) · B-058'in kalan işi ve atom kapanışı TASK-2.02'ye geçti, kalıcı kapı M6 F6.2'ye devredildi · TASK-2.17'nin zemini ölçülmüş rakamlarla sabitlendi. Milestone'un anahtar ayağı ölçümü anacak şekilde yeniden yazıldı (kullanıcı kararı).
- **Yasal metin için bağlayıcı ölçüm (TASK-2.01, 2026-09-22):** ölçüm sunucusunun erişim kaydı **ham IP tutuyor** (592.183/592.375 satır, 5.580 benzersiz IP) ve **bugün hiçbir saklama sınırı yok** (155 MB / 603.025 satır / 31 gün, rotasyon dosyası 0); üçüncü tarafa gitmiyor. Yani metin *"IP tutulmaz"* diyemez ve **hiçbir süre yazamaz** — cümlenin son hâli TASK-2.17'nin işi.
- **Rotasyon tanımlı ama konteynere inmiyor:** `daemon.json` `50m × 3` diyor, `bunker-nginx` ondan önce oluşturulduğu için kural uygulanmıyor. Düzeltme **bu reponun işi değil** (evi `altyapi/vps`) — `BULGULAR.md` → Gelen Kutusu'nda. Yapılırsa ≈ 30 günlük bir pencere doğar ve metin o gün bir süre yazabilir hâle gelir.
- **TASK-2.20 (MX kayıtları) kullanıcı eliyle ilerler** — DNS adımı Squarespace'te kullanıcıdadır; faz yönergeyi yazar, ölçer ve gerçek test postasıyla doğrular. Kullanıcı kaydı girmezse task ⏸️ duraklar, faz kilitlenmez.
- **Tarayıcı katmanlı kriterler `kanal: UAT` işaretli** (TASK-2.04 · 2.05 · 2.06 · 2.20): projenin otomatik katmanı gerçek tarayıcı yerleşimini ve odağını ölçmüyor; kalıcı tarayıcı betiği bilinçli olarak "Kalite kapıları otomatik" fazına bırakıldı.
- **Faz 2 kapsamı dokuz bulgu:** B-029 · B-018 · B-024 · B-011 · B-058 · B-034 · B-055 · B-060 · B-059'un onay-e-postası ayağı (yan kazanç B-040). Tam gerekçe ve kapsam dışı listesi `phases/PHASE-2.md` → Kapsam Tartışması.
- **Sıra değişti:** "Görsel ve mobil iyileştirme" fazı alan adı geçişinin **önüne** alındı (kullanıcı kararı) — ölçülmüş AA kontrast ihlalleri (B-032) canlıya çıkmasın. B-032 · B-033 · B-031 o faza atandı.
- **Kullanıcı gözü bekleyen iki kalem (Faz 1 milestone'unun doğrulama ayakları, kapanışı engellemedi):** (1) `DEMO_TO`'ya giden e-postanın **gelen kutusunda mı spam'de mi** olduğu; (2) **Umami panelinin arayüzünde** v2 kaydının gözle görülmesi. İkisinin de ürün tarafı ölçüldü; kayıt `phases/PHASE-1.md` → Milestone kapanış notu.
- **Canlı depodaki test kayıtları:** `leads_preview` 15 kayıt (Faz 1'in bilinçli test turları; `leads` 2 → değişmedi). 12 aylık saklama işi siler. ⚠️ IP tuzu döndürülünce bu kayıtların `ip_hash`'i yeni kayıtlarla karşılaştırılamaz olur (bilinçli, `docs/DECISIONS.md`).
- **Yerel `lead-store` konteyneri hâlâ ayakta** (25 test kaydıyla) — kaldırma/erişim komutları `memory/yerel-lead-deposu-docker-profili.md`.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 2.01 | TASK-2.01 — Sunucu ölçümü: nginx erişim kaydı + `.env` parmak izi (B-024, B-058) | ✅ Tamamlandı |
| 2.02 | TASK-2.02 — `.dockerignore` + `web-prod` bilinçli env (B-058) | ⬜ Bekliyor |
| 2.03 | TASK-2.03 — İki anahtarın döndürülmesi (B-058) | ❌ İptal — ön koşul ölçümle düştü (2026-09-23) |
| 2.04 | TASK-2.04 — Fiyat sayfasının mobil ana çağrısı 52 px'e döner (B-034) | ⬜ Bekliyor |
| 2.05 | TASK-2.05 — Demo formunda odak ve durum mekaniği (B-055 b·c·d·e·f·g) | ⬜ Bekliyor |
| 2.06 | TASK-2.06 — Alan bazlı hata metni ve `aria-invalid` işareti (B-055 a) | ⬜ Bekliyor |
| 2.07 | TASK-2.07 — Talep sahibine onay e-postası + `notify_lead` (B-059) | ⬜ Bekliyor |
| 2.08 | TASK-2.08 — Yetenek ve yol haritası tek kaynağı (B-029, B-040) | ⬜ Bekliyor |
| 2.09 | TASK-2.09 — Beş karşılıksız yetenek cümlesi düzeltilir (B-029) | ⬜ Bekliyor |
| 2.10 | TASK-2.10 — `/ozellikler` ve Kurucu Programı sabitten okur (B-040) | ⬜ Bekliyor |
| 2.11 | TASK-2.11 — Chat, SSS, fiyat ve karşılaştırma sayfası sabitten okur (B-040, B-014) | ⬜ Bekliyor |
| 2.12 | TASK-2.12 — Riskli alt küme taraması (B-029 kapanır) | ⬜ Bekliyor |
| 2.13 | TASK-2.13 — Ürün görseli temizliği: ad, Kampanyalar, Churn kartı (B-018) | ⬜ Bekliyor |
| 2.14 | TASK-2.14 — Denetimin ad dalı tablodan beslenir (B-018) | ⬜ Bekliyor |
| 2.15 | TASK-2.15 — Yasaklı iddia sözlüğü + denetimin iddia dalı (B-018 kapanır) | ⬜ Bekliyor |
| 2.16 | TASK-2.16 — Yasal metinde işlenen veri gerçeği + onay kapsamı (B-024) | ⬜ Bekliyor |
| 2.17 | TASK-2.17 — Ölçüm ve aktarım beyanları (B-024 kapanır) | ⬜ Bekliyor |
| 2.18 | TASK-2.18 — Yasal beyan testi — depo içi yedi olgu (B-060) | ⬜ Bekliyor |
| 2.19 | TASK-2.19 — Yasal beyan testi — çapraz depo "12 ay" dalı (B-060 kapanır) | ⬜ Bekliyor |
| 2.20 | TASK-2.20 — KVKK başvuru adresi: MX kayıtları ve test postası (B-011) | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 1'in 19 task'ı `phases/PHASE-1.md` → Task Listesi'nde, dokümanları `tasks/archive/`te.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-2.01 — Sunucu ölçümü: nginx erişim kaydı + `.env` parmak izi (B-024, B-058)

**Durum:** ✅ Tamamlandı — 2026-09-22
**Detay:** `tasks/archive/TASK-2.01.md`

**Özet:**
- Erişim kaydı ölçüldü: **ham IP tutuluyor** (592.183/592.375 satır, 5.580 benzersiz IP, 490.980 satır user-agent'lı), **saklama sınırı yok** (155 MB / 603.025 satır / 31 gün, rotasyon dosyası 0, logrotate ve kesen cron yok), **üçüncü tarafa gitmiyor** (gönderici ajan yok, Umami şemasında IP sütunu yok).
- `daemon.json` rotasyonu (`50m × 3`) tanımlı ama `bunker-nginx` ondan önce oluşturulduğu için konteynere **inmiyor** — kesim 11 eski / 5 yeni konteynerde ve 5 dakikalık sınır örneğiyle kanıtlandı; düzeltme `altyapi/vps` işi, Gelen Kutusu'na düştü.
- İki token'ın sunucu↔yerel parmak izi **eşleşmedi** → döndürme düşer; TASK-2.03'ün iptali ve milestone ayağının yeniden yazımı plan revizyonuna gitti. Hiçbir sır değeri hiçbir yere yazılmadı.

**Test:** Kod değişmediği için regresyon koşumu yok (keşif ayağı). Ölçümün kendisi iki kontrol grubuyla sınandı: bilinen ortak girdi iki makinede de aynı özeti verdi (`5bff3c05b9bd`) ve yereldeki iki eş değer aynı özeti verdi (`1a5c428e4b47`) — yani "eşleşmedi" sahte kırmızı değil. Salt-okuma doğrulandı: üç dosyanın mtime'ı değişmedi, 20 konteyner ayakta, `RestartCount=0`.

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

**Aktif Task:** `tasks/TASK-2.02.md` ⬜ — `.env` üretim imajından çıkar, yerel prova hedefi açık söylenir (B-058 kapanır)
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (araştırma detayı: `phases/PHASE-2-ARASTIRMA.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
