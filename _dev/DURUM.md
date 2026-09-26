# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-26 — **discuss-phase: FAZ 4 "Alan adı geçişi" 🔄 AÇILDI.** Kapsam geçiş + v1 paritesi + B-065 (JS kapalı form); yayın iki dala ayrılıyor ve yayın kapısı elle koşulan tam kontrol seti; Vercel ücretli plana ve Frankfurt'a geçiyor; geçişi Claude kullanıcının tetiğiyle yürütüyor; yedi bulgu faza alındı ve `[TASK-3.25 SORU]` cevaplandı. **Sıradaki adım `research`.**

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 4 — Alan adı geçişi
**Milestone:** `alpfitplus.com` + `www` v2'ye bakıyor ve site dizine açık; v1'in canlı adres kümesi (bugün 27) ölçülerek 301 → 200; canlı kayıt işaretli tek testle kanıtlandı, ölçüm v1'in Umami kaydında; v1 paritesi kapandı ve yasal metin WhatsApp aktarımını söylüyor; `destek@` posta alıyor; JS kapalı form veri sızdırmıyor; yayın iki dallı ve kapılı; ücretli plan + Frankfurt; v1 projesi duruyor. Tam cümle `PHASES.md` → Faz Durumu ve `phases/PHASE-4.md`.
**Adım:** research
**İlerleme:** Kapsam tartışması tamamlandı (2026-09-26) — kararlar `phases/PHASE-4.md` → Kapsam Tartışması. Araştırmanın ilk işleri kararlarda adıyla yazılı: v1 paritesinin **canlıya karşı** yeniden çıkarılması (liste tamlığı iddia edilmedi), v1 projesine komut satırı erişimi, ücretli planın güncel bedeli, dal önizlemesinin koruma durumu. ⚠️ **Sıra şartı:** iki dal ayrımı alan adı bağlanmadan **önce** kurulur; B-011'in iki kullanıcı adımı da geçişten önce.
**Faz Dokümanı:** `phases/PHASE-4.md` · son kapanan: `phases/PHASE-3.md` ✅ (çocukları: `PHASE-3-KAPSAM.md` · `PHASE-3-ARASTIRMA.md` · `PHASE-3-UAT.md` · `PHASE-3-RETROSPEKTIF.md`)

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

**Task:** — yok (Faz 4 açıldı; task'lar `plan-phase`'de yazılır)
**Durum:** Faz 4'ün kapsam tartışması tamamlandı. Sıradaki adım **`/devflow:research-phase`**
**İlerleme:** — yok
**Not:**
- ⚠️⚠️ **`a11y` kapısı bugün `1 · çıkış 1` veriyor ve bu bir eksik DEĞİL, kayıtlı bir kullanıcı kararıdır** (2026-09-26, seçenek B). Kalan tek kalem `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafı ve **sayfanın değil ölçüm betiğinin kusuru** — paragrafın gerçek kontrastı **7,05**, kırmızıyı yapışkan başlığın kendi düğme etiketinin ölçüm maskesine sızması üretiyor (B-063'ün maske sızıntısı yüzü, iki izolasyonla gösterildi). **Sonraki turlar bunu "kapı kırmızı, düzeltilmeli" diye okumasın** ve bir regresyon aranırken bu kalem **hariç** okunsun. Eşik ve kapsam tablosu: `modules/M6-Kalite-Kapilari.md` → Teknik Notlar; mekanizma `bulgular/B-063-*.md`; kararın tam metni `tasks/archive/TASK-3.26.md` → Kapanış Gerekçesi.
- ⚠️ **Yayın öncesi kalemin kararı verildi, uygulaması Faz 4'te:** 503 kurtarma bağlantısının WhatsApp'a taşıdığı kişisel veri yasal metne yazılacak (kullanıcı, 2026-09-26, seçenek a; v1'in alıcı/ülke dökümü aynı işte). Metin değişene dek site **alan adına bağlanmaz** — geçiş task'ı bunun arkasında durur.
- ⚠️ **`_dev/` dokümanları Tailwind taramasına dahil — doküman metnine yazılan bir sınıf adı üretim CSS'ine gerçek kural ekliyor** (TASK-3.27'de kazara ölçüldü: 85.312 → 85.350 bayt; dize çıkarılınca md5 birebir döndü). Bugünkü çözüm yalnız bir yazım kuralı (`docs/STYLE-GUIDE.md` → sınıf adını bölerek yaz); kalıcı çare üç seçenekli bir karar ve Gelen Kutusu'nda. ⚠️ `perf.mjs` KB cinsinden ölçtüğü için bu sızıntıyı yuvarlayıp gizler — `_dev/` yazan tur CSS'i bayt + md5 ile sınamalı.

> Faz 3'ün kapanış hâli, kapı rakamları, 27 task'ın izi ve on eksenlik kalite kontrolü `phases/PHASE-3.md` + `phases/PHASE-3-RETROSPEKTIF.md`'dedir; açık bulgular ve kullanıcıya bağlı işler `BULGULAR.md`'de. Bu blok yalnız **sıradaki oturumun bilmesi gereken** üç kalemi taşır.

---

## Task Durumu (Aktif Faz)

**Task:** — yok. Faz 4'ün task listesi `plan-phase`'de yazılır; tablo o zaman dolar.

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 3'ün 27 task'ı `phases/PHASE-3.md` → Task Listesi'nde, dokümanları `tasks/archive/`te. Faz 2'ninkiler `phases/PHASE-2.md`'de, Faz 1'inkiler `phases/PHASE-1.md`'de.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

— yok (yeni faza geçildi; Faz 3'ün son iki task'ının özeti `tasks/archive/TASK-3.26.md` ve `tasks/archive/TASK-3.27.md`'de)

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

**Aktif Task:** — yok · Faz 4 kapsam tartışması tamamlandı, sıradaki adım `/devflow:research-phase`
**Aktif Faz:** `phases/PHASE-4.md` 🔄 (Alan adı geçişi) · son kapanan: `phases/PHASE-3.md` ✅ (kapsam: `PHASE-3-KAPSAM.md` · araştırma: `PHASE-3-ARASTIRMA.md` · UAT: `PHASE-3-UAT.md` · retrospektif ve kalite: `PHASE-3-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
