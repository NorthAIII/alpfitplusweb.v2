# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-26 — **review-phase: FAZ 3 ✅ KAPANDI, milestone KISMEN.** Retrospektif + on eksenlik kalite kontrol yazıldı ve doküman boyut kapısında bölündü (`PHASE-3-RETROSPEKTIF.md`; bölünmemiş parent ~42,9k token olurdu, ikisi de çizginin altında). Dokuz eksen ✅, biri ⚠️ (Erişilebilirlik — kapı kayıtlı kararla `1` ile kapanıyor, kör noktaları kapsam kararıyla açık). Faz penceresi `6f4eca9..HEAD` = 37 commit / **103 dosya / +9.786−429**, güvenlik merceğinde **somut bulgu yok**. Araştırma ↔ sonuç kıyası **27 kalem** düzeltti (19 rakam · 4 nesne tarifi · 4 teşhis). **Milestone'un üç ayağı açık ve hiçbiri ürün kusuru değil:** *"beş ölçüm yeşil"* (kayıtlı kullanıcı kararı) · Roller'in diyetisyen ayağı (TASK-3.24 ❌ İptal) · gerçek telefon turu (`kanal: UAT`). **Düzeltme task'ı doğmadı; sıradaki faz `discuss`.**

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 4 — Alan adı geçişi *(geçici ad, Sıradaki Fazlar'ın ilk maddesinden; numarayı ve satırı `discuss-phase` damgalar)*
**Milestone:** Henüz yazılmadı — kapsam tartışmasında belirlenir. Konu özeti ve devralınan kalemler: `PHASES.md` → Sıradaki Fazlar.
**Adım:** discuss
**İlerleme:** Faz henüz açılmadı. **Devralınan dört kalem** (Faz 2 retrosunun kaydı): Faz 1'in üç env değeri (`LEAD_STORE_TOKEN` · `IP_HASH_SALT` · `NEXT_PUBLIC_UMAMI_WEBSITE_ID`) + **B-011** (apex'te MX kaydı yok, yasal metnin otuz gün taahhüdü tam o gün gerçek olur) — dördü de o fazın UAT senaryosu olmalı; B-059'un kalan parite ayağı ve B-043'ün geçiş yüzeyi de orada. ⚠️ **Faz 3'ten devreden ve alan adı geçişinden ÖNCE kapanması gereken tek kalem:** ön-doldurulan kişisel verinin yasal metinde karşılığı yok (`BULGULAR.md` → Gelen Kutusu `[TASK-3.25 SORU]`, üç seçenek hazır) — site `noindex` olduğu için bugün yayını bloke etmiyor.
**Faz Dokümanı:** — yok (discuss-phase doğurur) · son kapanan: `phases/PHASE-3.md` ✅ (çocukları: `PHASE-3-KAPSAM.md` · `PHASE-3-ARASTIRMA.md` · `PHASE-3-UAT.md` · `PHASE-3-RETROSPEKTIF.md`)

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

**Task:** — yok (Faz 3 ✅ kapandı; sıradaki faz henüz açılmadı)
**Durum:** Faz 3'ün 27 task'ı sonuçlandı (26 ✅ · 1 ❌ İptal) ve review tamamlandı. Sıradaki adım **`/devflow:discuss-phase`**
**İlerleme:** — yok (yeni fazın task'ları kapsam tartışmasından sonra yazılır)
**Not:**
- ⚠️⚠️ **`a11y` kapısı bugün `1 · çıkış 1` veriyor ve bu bir eksik DEĞİL, kayıtlı bir kullanıcı kararıdır** (2026-09-26, seçenek B). Kalan tek kalem `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafı ve **sayfanın değil ölçüm betiğinin kusuru** — paragrafın gerçek kontrastı **7,05**, kırmızıyı yapışkan başlığın kendi düğme etiketinin ölçüm maskesine sızması üretiyor (B-063'ün maske sızıntısı yüzü, iki izolasyonla gösterildi). **Sonraki turlar bunu "kapı kırmızı, düzeltilmeli" diye okumasın** ve bir regresyon aranırken bu kalem **hariç** okunsun. Eşik ve kapsam tablosu: `modules/M6-Kalite-Kapilari.md` → Teknik Notlar; mekanizma `bulgular/B-063-*.md`; kararın tam metni `tasks/archive/TASK-3.26.md` → Kapanış Gerekçesi.
- ⚠️ **Yayın öncesi kapanması gereken tek kalem kullanıcı kararı bekliyor:** 503 kurtarma bağlantısı kişisel veriyi (ad · kulüp · telefon) WhatsApp'a taşıyor ama yasal metnin aktarım listesinde WhatsApp yok (`legal.ts`'te dize **0 kez**, KVKK → Aktarım dört tedarikçi sayıyor). Site `noindex` önizlemede olduğu için **bugün yayını bloke etmiyor**; üç seçenek ve ölçüm `BULGULAR.md` → Gelen Kutusu `[TASK-3.25 SORU]`.
- ⚠️ **`_dev/` dokümanları Tailwind taramasına dahil — doküman metnine yazılan bir sınıf adı üretim CSS'ine gerçek kural ekliyor** (TASK-3.27'de kazara ölçüldü: 85.312 → 85.350 bayt; dize çıkarılınca md5 birebir döndü). Bugünkü çözüm yalnız bir yazım kuralı (`docs/STYLE-GUIDE.md` → sınıf adını bölerek yaz); kalıcı çare üç seçenekli bir karar ve Gelen Kutusu'nda. ⚠️ `perf.mjs` KB cinsinden ölçtüğü için bu sızıntıyı yuvarlayıp gizler — `_dev/` yazan tur CSS'i bayt + md5 ile sınamalı.

> Faz 3'ün kapanış hâli, kapı rakamları, 27 task'ın izi ve on eksenlik kalite kontrolü `phases/PHASE-3.md` + `phases/PHASE-3-RETROSPEKTIF.md`'dedir; açık bulgular ve kullanıcıya bağlı işler `BULGULAR.md`'de. Bu blok yalnız **sıradaki oturumun bilmesi gereken** üç kalemi taşır.

---

## Task Durumu (Aktif Faz)

**Task:** — yok. Yeni fazın task listesi `plan-phase`'de yazılır; tablo o zaman dolar.

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

**Aktif Task:** — yok · Faz 3 ✅ kapandı (27 task sonuçlandı, review tamamlandı), sıradaki adım `/devflow:discuss-phase`
**Aktif Faz:** — yok (Phase 4 "Alan adı geçişi" henüz açılmadı; `discuss-phase` doğurur) · son kapanan: `phases/PHASE-3.md` ✅ (kapsam: `PHASE-3-KAPSAM.md` · araştırma: `PHASE-3-ARASTIRMA.md` · UAT: `PHASE-3-UAT.md` · retrospektif ve kalite: `PHASE-3-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
