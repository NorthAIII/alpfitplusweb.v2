# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-22 — review-phase: Faz 1 ✅ tamamlandı (retrospektif + 10 kalite ekseni PHASE-1'e yazıldı, UAT detayı `PHASE-1-UAT.md`'ye bölündü, düzeltme task'ı doğmadı); milestone'un iki doğrulama ayağı kullanıcı gözünde. Sıradaki adım: Faz 2 kapsam tartışması.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler *(geçici ad; faz PHASES'e discuss-phase'de girer)*
**Milestone:** — henüz yok (kapsam tartışmasında yazılacak)
**Adım:** discuss
**İlerleme:** Faz 1 ✅ kapandı (19/19 task, UAT 32/34). Faz 2 henüz başlamadı.
**Faz Dokümanı:** — (discuss-phase oluşturacak) · önceki faz: `phases/PHASE-1.md` ✅

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

**Task:** — yok (Faz 1 kapandı; Faz 2 henüz planlanmadı)
**Durum:** ✅ Faz 1 review tamamlandı
**İlerleme:** Sıradaki adım `/devflow:discuss-phase` — Faz 2 kapsam tartışması.
**Not:**
- **Kullanıcı gözü bekleyen iki kalem (Faz 1 milestone'unun iki doğrulama ayağı, iki UAT turunda da otonom kolda kapanmadı):** (1) `DEMO_TO`'ya giden e-postanın **gelen kutusunda mı spam'de mi** olduğu — gönderim tarafı üç turda da Resend `delivered`, DKIM hizalı, yerleşim API'den ölçülemez; (2) **Umami panelinin arayüzünde** v2 kaydının gözle görülmesi — verinin kendisi panelin kendi okuma API'siyle teyitli (sayfa görüntülemesi 13, `whatsapp` 7, `phone` 2, `demo-submit` 3; yüzeyler `hero`/`sss`/`footer`/`demo-form`). İkisi de faz kapanışını engellemedi; kayıt `phases/PHASE-1.md` → Milestone kapanış notu.
- **Karar bekleyen 🔴 B-058:** `.dockerignore` `.env`'i dışlamıyor, beş sır üretim imajı katmanında. Soru kullanıcıda: bu makinedeki `.env` üretim değerlerini mi taşıyor, imaj dışarı çıktıysa anahtarlar döndürülmeli mi? Faz 1 retrospektifi bunu **alan adı geçişinden önce** kapanacak kalem olarak işaretledi.
- **Faz 2 kapsamına önerilen küme (karar o fazın discuss-phase'inde):** UI 🔴'leri B-032 · B-033 · B-034 · B-031 **+ B-055** (demo formunun gönderim sonrası hâli mobilde görünmüyor). Gerekçe `phases/PHASE-1.md` → Sonraki Faz İçin Öneriler.
- **Canlı depodaki test kayıtları:** `leads_preview` 15 kayıt (Faz 1'in bilinçli test turları; `leads` 2 → değişmedi). 12 aylık saklama işi siler.
- **Yerel `lead-store` konteyneri hâlâ ayakta** (25 test kaydıyla) — kaldırma/erişim komutları `memory/yerel-lead-deposu-docker-profili.md`.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| — | Aktif faz henüz planlanmadı (Faz 2 kapsam tartışması bekliyor) | — |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 1'in 19 task'ı `phases/PHASE-1.md` → Task Listesi'nde, dokümanları `tasks/archive/`te.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

— yok (yeni faza geçildi; Faz 1'in task özetleri `tasks/archive/` ve `phases/PHASE-1.md`'de)

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

**Aktif Task:** — yok (Faz 1 ✅ kapandı — sıradaki adım `/devflow:discuss-phase`)
**Aktif Faz:** — henüz yok (Faz 2 kapsam tartışması bekliyor) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
