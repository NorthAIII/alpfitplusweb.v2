# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-26 — **plan-phase: Faz 4'ün task listesi yazıldı — 19 task, yedi küme** (yayın düzeni → geçiş betiği → parite → B-065 → CSP → yasal metin + Frankfurt → kullanıcı adımları, prova, geçiş); kapı düzeltmelerin önünde, kullanıcıya bağlı iki task geçişin hemen önünde. Faz dokümanı task tablosuyla kırmızı çizgiyi aştı (21.568 token) ve faz hâlâ aktifken bölündü: araştırma detayı `PHASE-4-ARASTIRMA.md`'ye taşındı (kesim kullanıcıyla seçildi), parent 14.569 token. **Sıradaki adım `verify-plan`.**

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 4 — Alan adı geçişi
**Milestone:** `alpfitplus.com` + `www` v2'ye bakıyor ve site dizine açık; v1'in canlı adres kümesi (bugün 27) ölçülerek 301 → 200; canlı kayıt işaretli tek testle kanıtlandı, ölçüm v1'in Umami kaydında; v1 paritesi kapandı ve yasal metin WhatsApp aktarımını söylüyor; `destek@` posta alıyor; JS kapalı form veri sızdırmıyor; yayın iki dallı ve kapılı; ücretli plan + Frankfurt; v1 projesi duruyor. Tam cümle `PHASES.md` → Faz Durumu ve `phases/PHASE-4.md`.
**Adım:** verify-plan
**İlerleme:** Kapsam tartışması ✅ · araştırma ✅ · **task yazımı ✅** — 19 task dokümanı yazıldı, hiçbiri çalıştırılmadı; sıradaki adım plan doğrulama (`verify-plan`). Araştırma detayı ve adres envanteri tablosu `phases/PHASE-4-ARASTIRMA.md`'de; kararların gerekçesi `docs/DECISIONS.md` 2026-09-26. ⚠️ **Sıra şartları task sırasına işlendi:** iki dal ayrımı ilk task (4.01), B-011 ve ücretli plan geçişten önce (4.15 · 4.16), B-065 CSP'den önce (4.09-4.11 → 4.12), Frankfurt + yasal metin + dal 8 aynı commit'te (4.14), üç canlı env değeri taşımayla aynı yeniden derlemede (4.18).
**Faz Dokümanı:** `phases/PHASE-4.md` (çocuğu: `PHASE-4-ARASTIRMA.md`) · son kapanan: `phases/PHASE-3.md` ✅ (çocukları: `PHASE-3-KAPSAM.md` · `PHASE-3-ARASTIRMA.md` · `PHASE-3-UAT.md` · `PHASE-3-RETROSPEKTIF.md`)

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

**Task:** — yok · 19 task yazıldı ama hiçbiri başlamadı; sıradaki adım plan doğrulama (`verify-plan`), ondan sonra sırayla `run-task`
**Durum:** ⬜ Tablo sırasındaki ilk task **TASK-4.01** (iki dallı yayın düzeni)
**İlerleme:** 0 / 19
**Not:**
- ⚠️⚠️ **`a11y` kapısı bugün `1 · çıkış 1` veriyor ve bu bir eksik DEĞİL, kayıtlı bir kullanıcı kararıdır** (2026-09-26, seçenek B). Kalan tek kalem `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafı ve **sayfanın değil ölçüm betiğinin kusuru** — paragrafın gerçek kontrastı **7,05**, kırmızıyı yapışkan başlığın kendi düğme etiketinin ölçüm maskesine sızması üretiyor (B-063'ün maske sızıntısı yüzü, iki izolasyonla gösterildi). **Sonraki turlar bunu "kapı kırmızı, düzeltilmeli" diye okumasın** ve bir regresyon aranırken bu kalem **hariç** okunsun. Eşik ve kapsam tablosu: `modules/M6-Kalite-Kapilari.md` → Teknik Notlar; mekanizma `bulgular/B-063-*.md`; kararın tam metni `tasks/archive/TASK-3.26.md` → Kapanış Gerekçesi.
- ⚠️ **Yasal metnin WhatsApp aktarımı TASK-4.13'te yazılır** (kullanıcı kararı 2026-09-26, seçenek a) ve Frankfurt'un bölge cümlesiyle (TASK-4.14) aynı yayına biner. Metin değişene dek site **alan adına bağlanmaz** — geçiş (TASK-4.18) ikisinin arkasında durur.
- ⚠️ **`_dev/` dokümanları Tailwind taramasına dahil — doküman metnine yazılan bir sınıf adı üretim CSS'ine gerçek kural ekliyor** (TASK-3.27'de kazara ölçüldü: 85.312 → 85.350 bayt; dize çıkarılınca md5 birebir döndü). Bugünkü çözüm yalnız bir yazım kuralı (`docs/STYLE-GUIDE.md` → sınıf adını bölerek yaz); kalıcı çare üç seçenekli bir karar ve Gelen Kutusu'nda. ⚠️ `perf.mjs` KB cinsinden ölçtüğü için bu sızıntıyı yuvarlayıp gizler — `_dev/` yazan tur CSS'i bayt + md5 ile sınamalı.
- ⚠️ **TASK-4.01'den sonra oturumlar `dev` dalında çalışır;** `main`'de açılan oturum dal yankısında durur (kasıt budur). `main`'e yalnız kullanıcının "yayınla" tetiğiyle birleştirme girer (TASK-4.18).
- ⚠️ **TASK-4.02'den itibaren geçiş betiği yerelde KIRMIZI koşar ve bu beklenen sonuçtur** — kapı önce kurulur, 4.04-4.12 kırmızıları kalem kalem yeşile çevirir (Faz 3 deseni).
- ⚠️ **Kullanıcıya bağlı üç adım faz başında yapılabilir, geçişi bekletmesin:** Squarespace'te "Google Workspace MX" + Google'da `destek@` kutusu (TASK-4.15; yönerge `bulgular/B-011-*.md` → Çözüm Yolu) · Vercel ücretli plan ödemesi (TASK-4.16) · Search Console'dan dizindeki adres listesi (TASK-4.17).

> Açık bulgular ve kullanıcıya bağlı işler `BULGULAR.md`'de; Faz 3'ün kapanış hâli `phases/PHASE-3.md` + `phases/PHASE-3-RETROSPEKTIF.md`'de. Bu blok yalnız **sıradaki oturumların bilmesi gereken** kalemleri taşır.

---

## Task Durumu (Aktif Faz)

**Tablo sırası = çalıştırma sırasıdır.** Yedi küme: yayın düzeni (01) → kapı (02-03) → parite (04-08) → B-065 (09-11) → CSP (12) → yasal metin + bölge (13-14) → kullanıcı adımları, prova, geçiş (15-19).

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 4.01 | TASK-4.01 | ⬜ Bekliyor | İki dallı yayın düzeni + dal önizlemesi atlatma anahtarı |
| 4.02 | TASK-4.02 | ⬜ Bekliyor | Geçiş betiği (1/2) — adres envanteri, tek atlama, kapsam eşiği |
| 4.03 | TASK-4.03 | ⬜ Bekliyor | Geçiş betiği (2/2) — başlık, `noindex` katmanları, paylaşım kartı |
| 4.04 | TASK-4.04 | ⬜ Bekliyor | Tek atlamalı 301 kuralları + aşamaya bağlı `.vercel.app` → apex |
| 4.05 | TASK-4.05 | ⬜ Bekliyor | İkon teslimi — `.ico`, SVG, `apple-touch-icon` |
| 4.06 | TASK-4.06 | ⬜ Bekliyor | Sayfa başına paylaşım kartı (1/2) — yardımcı + iki pilot sayfa |
| 4.07 | TASK-4.07 | ⬜ Bekliyor | Sayfa başına paylaşım kartı (2/2) — 13 sayfa + süpürme kapısı |
| 4.08 | TASK-4.08 | ⬜ Bekliyor | JSON-LD paritesi |
| 4.09 | TASK-4.09 | ⬜ Bekliyor | B-065 (1/3) — iki sonuç sayfası |
| 4.10 | TASK-4.10 | ⬜ Bekliyor | B-065 (2/3) — uç form kodlamasını kabul eder, 303 |
| 4.11 | TASK-4.11 | ⬜ Bekliyor | B-065 (3/3) — form `method`/`action`, hidrasyonsuz ölçüm |
| 4.12 | TASK-4.12 | ⬜ Bekliyor | CSP + `DENY` + `Permissions-Policy` v1 paritesi |
| 4.13 | TASK-4.13 | ⬜ Bekliyor | Yasal metin — WhatsApp aktarımı; B-059 kalem 3 |
| 4.14 | TASK-4.14 | ⬜ Bekliyor | Frankfurt — `vercel.json` + bölge cümlesi + dal 8 |
| 4.15 | TASK-4.15 | ⬜ Bekliyor | B-011 — `destek@` posta alır (kullanıcı adımı) |
| 4.16 | TASK-4.16 | ⬜ Bekliyor | Vercel ücretli plan (kullanıcı adımı) |
| 4.17 | TASK-4.17 | ⬜ Bekliyor | Geçiş provası — dal önizlemesi, envanter kesişimi |
| 4.18 | TASK-4.18 | ⬜ Bekliyor | Geçiş anı |
| 4.19 | TASK-4.19 | ⬜ Bekliyor | Geçiş sonrası — Umami, site haritası bildirimi, bulgu kapanışları |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Önceki fazların task'ları kendi faz dokümanlarının Task Listesi'nde (`phases/PHASE-1.md` … `PHASE-3.md`), dokümanları `tasks/archive/`te.

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

**Aktif Task:** — yok · 19 task yazıldı, sıradaki adım `/devflow:verify-plan`; ilk task TASK-4.01
**Aktif Faz:** `phases/PHASE-4.md` 🔄 (Alan adı geçişi; araştırma: `PHASE-4-ARASTIRMA.md`) · son kapanan: `phases/PHASE-3.md` ✅ (kapsam: `PHASE-3-KAPSAM.md` · araştırma: `PHASE-3-ARASTIRMA.md` · UAT: `PHASE-3-UAT.md` · retrospektif ve kalite: `PHASE-3-RETROSPEKTIF.md`)
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
