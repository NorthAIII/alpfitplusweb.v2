# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — **Faz 2 ✅ kapandı** (review-phase): milestone'un yedi ayağı da ölçülerek karşılandı, kapanış notu gerekmedi; kalite kontrolü on eksende 9 ✅ + 1 ⚠️ (güvenlik — işaret kapsam dışı açık bulgulardan). Faz dokümanı dondurulmadan önce `PHASE-2-RETROSPEKTIF.md`'ye bölündü (24.073 → 16.612 token) ve `docs/DECISIONS.md`'nin 2026-09-14..09-22 aralığı arşiv çocuğuna mezun edildi. Sırada Faz 3'ün kapsam tartışması.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme *(geçici ad ve numara; promosyonu `discuss-phase` yapar — `PHASES.md` → Sıradaki Fazlar)*
**Milestone:** — henüz yazılmadı; kapsam tartışmasında belirlenir. Konunun bugünkü tanımı ve devredilen küme (B-032 · B-033 · B-031) `PHASES.md` → Sıradaki Fazlar'da.
**Adım:** discuss
**İlerleme:** Faz henüz başlamadı. Faz 2 ✅ kapandı (21 task: 19 ✅ · 2 iptal · UAT 2 tur, 31/31).
**Faz Dokümanı:** — henüz yok (`discuss-phase` oluşturur) · son kapanan: `phases/PHASE-2.md` ✅ (çocukları: `PHASE-2-KAPSAM.md` · `PHASE-2-ARASTIRMA.md` · `PHASE-2-UAT.md` · `PHASE-2-RETROSPEKTIF.md`)

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

**Task:** — yok · Faz 3'ün task listesi henüz yazılmadı
**Durum:** ✅ Bekleyen, devam eden ya da duraklatılmış task yok — sıradaki adım yeni fazın kapsam tartışması (`discuss-phase`)
**İlerleme:** —
**Not:**
- ⚠️ **Kullanıcı gözü bekleyen beş doğrulama kalemi duruyor** (hiçbiri faz kapanışını engellemedi, hepsi *doğrulama kanalı* — ürün tarafı ölçüldü): Faz 2'den (1) gerçek telefonda form denemesi, (2) onay e-postasının gelen kutusunda mı spam'de mi düştüğü, (3) ekran okuyucuda onay kutusunun iki kez duyurulup duyurulmadığı (kaydı `BULGULAR.md` → Gelen Kutusu, `[TASK-2.05]`); Faz 1'den (4) `DEMO_TO`'ya giden e-postanın yerleşimi, (5) Umami panelinin **arayüzünde** v2 kaydının gözle görülmesi (kaydı `phases/PHASE-1.md` → Milestone kapanış notu).
- ⚠️ **Sıradaki faz ölçüm betiklerini yoğun koşacak ve 3100 bayat olabilir** (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir. `perf.mjs` ve `font-guard.mjs` 3100'e çivili ve env ile yönlendirilemiyor; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`).
- **Kapsam tartışmasının ilk sorusu hazır:** B-031'in (a11y kontrast yönteminin kör noktaları) düzeltmesi **B-030 ile aynı turda** mı yürüsün? Atom öyle istiyor — yöntem düzeltilip çıkış kodu eklenmezse ihlaller görünür olur ama kapı yine yeşil kalır; B-030'un bugünkü evi "Kalite kapıları otomatik" fazı. Faz 2 bunu bilinçle karara bağlamadı (`phases/PHASE-2-KAPSAM.md` → Kapsam Dışı).

---

## Task Durumu (Aktif Faz)

— yok · Faz 3'e henüz girilmedi; task listesi `plan-phase` oturumunda doğar.

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 2'nin 21 task'ı `phases/PHASE-2.md` → Task Listesi'nde, dokümanları `tasks/archive/`te. Faz 1'inkiler `phases/PHASE-1.md`'de.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

— yok · yeni faza geçildi, özetler sıfırlandı. Faz 2'nin task kayıtları `tasks/archive/TASK-2.*.md`, özetleri git geçmişinde.

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

**Aktif Task:** — yok · yeni faz henüz başlamadı; son kapanan `tasks/archive/TASK-2.21.md` ✅
**Aktif Faz:** — henüz yok (Faz 3 kapsam tartışmasında doğar) · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
