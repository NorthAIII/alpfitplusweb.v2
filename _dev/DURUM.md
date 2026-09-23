# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — **Faz 3 "Görsel ve mobil iyileştirme" açıldı** (discuss-phase): kapsam devralınan üç bulgudan **dokuza** çıktı — kullanıcı B-022 · B-046 · B-051 · B-057'yi ekledi, B-031'in "aynı turda" uyarısı gereği B-030 ve B-012'nin a11y/mobil ayakları da alındı. Üç bekleyen soru karara bağlandı (ana sayfa kısaltılmıyor · dokunma hedefi kuralı kademeli · 404'teki dev rakam dekoratif ilan ediliyor); keşif turu fazın içinde ve dört yeni eksen kazandı (%200/%400 büyütme, hareket azaltma, JS kapalı, yatay tutuş).

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 3 — Görsel ve mobil iyileştirme
**Milestone:** Site dar telefondan büyütülmüş yazıya kadar bölüm bölüm gezildi (gerçek cihaz dâhil) ve çıkanlar triyaj edildi; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı; beş ölçüm yeşil. Tam metin ve kapsam kararları: `phases/PHASE-3.md`.
**Adım:** research
**İlerleme:** Kapsam tartışması ✅ tamamlandı — dokuz bulgu + keşif turu kapsama alındı. Task listesi henüz yazılmadı (`plan-phase`).
**Faz Dokümanı:** `phases/PHASE-3.md` 🔄 · son kapanan: `phases/PHASE-2.md` ✅ (çocukları: `PHASE-2-KAPSAM.md` · `PHASE-2-ARASTIRMA.md` · `PHASE-2-UAT.md` · `PHASE-2-RETROSPEKTIF.md`)

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

**Task:** — yok · Faz 3'ün task listesi `plan-phase` oturumunda yazılacak
**Durum:** ✅ Bekleyen, devam eden ya da duraklatılmış task yok — sıradaki adım fazın teknik araştırması (`research-phase`)
**İlerleme:** —
**Not:**
- ⚠️ **Kullanıcıya bağlı iki iş bu fazın içinde ve ikisi de fazı kilitlemeyecek biçimde yerleştirilecek:** (1) **gerçek telefonla uçtan uca tur** — fazın sonunda, doğrulama olarak koşar (Faz 2'den devredilen form denemesi de bunun içinde); (2) **ürün deposunun demo destesine bir diyetisyen ekranı eklenmesi** — eklendiği gün görsel hattı onu olağan biçimde üretir; gelmezse Roller sekmesi ödünç görselle kalır ve B-046 kanvasta açık durur.
- ⚠️ **Kullanıcı gözü bekleyen dört doğrulama kalemi duruyor** (hiçbiri faz kapanışını engellemedi, hepsi *doğrulama kanalı* — ürün tarafı ölçüldü): Faz 2'den (1) onay e-postasının gelen kutusunda mı spam'de mi düştüğü, (2) ekran okuyucuda onay kutusunun iki kez duyurulup duyurulmadığı (kaydı `BULGULAR.md` → Gelen Kutusu, `[TASK-2.05]`; gerçek ekran okuyucu denemesi Faz 3'ün de kapsamı dışında); Faz 1'den (3) `DEMO_TO`'ya giden e-postanın yerleşimi, (4) Umami panelinin **arayüzünde** v2 kaydının gözle görülmesi (kaydı `phases/PHASE-1.md` → Milestone kapanış notu).
- ⚠️ **Bu faz ölçüm betiklerini yoğun koşacak ve 3100 bayat olabilir** (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir. `perf.mjs` ve `font-guard.mjs` 3100'e çivili ve env ile yönlendirilemiyor; ölçmeden güvenme (`memory/alternatif-env-ile-uretim-derlemesi.md`).

---

## Task Durumu (Aktif Faz)

— yok · Faz 3 açıldı ama task listesi henüz yazılmadı; `plan-phase` oturumunda doğar.

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
**Aktif Faz:** `phases/PHASE-3.md` 🔄 · son kapanan: `phases/PHASE-2.md` ✅ (kapsam: `PHASE-2-KAPSAM.md` · araştırma: `PHASE-2-ARASTIRMA.md` · UAT: `PHASE-2-UAT.md` · retrospektif ve kalite: `PHASE-2-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
