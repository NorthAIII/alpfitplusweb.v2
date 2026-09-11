# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-11 — TASK-1.05 ✅: `/api/demo` webhook yazımı artık sözleşmeye bağlı (HTTP + JSON + `ok===true`) ve lead'e `env` alanı girdi; 32 kontrol + 3 aşama senaryosu yeşil. TASK-1.04 🔄 kaldı — Google dağıtımı kullanıcıda, sıra kullanıcı kararıyla atlandı.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Google Sheet'e düşüyor ve e-postayla geliyor; üç olay yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 4/10 task tamamlandı (TASK-1.04 🔄 devam ediyor — kullanıcı dağıtımı bekliyor)
**Faz Dokümanı:** `phases/PHASE-1.md`

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
<!-- - prd_review_bekliyor: Her iki sabit faz tamamlandı; prd-review bekleniyor / yarım kalmış (prd-save ile bölünmüş) / bilinçli ertelenmiş (teslim DevFlow-dışıysa go-live sonrasına) — üçünde de next prd-review'u önerir, çalıştırmaz -->

---

## Aktif Task

**Task:** TASK-1.04 — Google Sheet lead alıcısı — Apps Script web app
**Durum:** 🔄 Devam ediyor — **kullanıcıya bağlı**
**İlerleme:** 4 alt görevin 3'ü bitti (betik, sütun şeması, `.env.example`); kalan alt görev 3 **kullanıcının Google hesabında** yapılacak — e-tablo, betiğin yapıştırılması, `LEAD_TOKEN` Script Properties'e girilmesi, web app dağıtımı. Tarif `research/lead-sheet.gs` başındaki KURULUM bloğunda; devam adımları task dokümanının "Sonraki Adım Detayı" alanında.
**Not:** Dağıtım hâlâ yapılmadıysa sıradaki çalıştırılabilir task **TASK-1.07**'dir (Umami kurulumu); TASK-1.06 da canlı `/exec` adresine bağlıdır.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 1.01 | Aşama türetimi ve `deployStage` tek kaynağı | ✅ Tamamlandı |
| 1.02 | noindex üç katman tek kaynaktan | ✅ Tamamlandı |
| 1.03 | Vercel'de ayrı proje, env iskeleti ve başlık ölçümü | ✅ Tamamlandı |
| 1.04 | Google Sheet lead alıcısı — Apps Script web app | 🔄 Devam ediyor |
| 1.05 | Demo ucunu sertleştir — JSON doğrulaması ve `env` alanı | ✅ Tamamlandı |
| 1.06 | E-posta hattı doğrulaması ve uçtan uca lead testi | ⬜ Bekliyor |
| 1.07 | Umami kurulumu ve tracker bağlantısı | ⬜ Bekliyor |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.04 — Google Sheet lead alıcısı — Apps Script web app (2026-09-11, 🔄 devam ediyor)

**Özet:**
- `research/lead-sheet.gs` yazıldı: token Script Properties'te, `LockService` ile kilit, başlık satırı kendiliğinden doğar, her yolda JSON yanıt.
- **Sheets formül enjeksiyonu** icrada çıktı ve kapatıldı: dışarıdan gelen `= + - @` ile başlayan alan tek tırnakla metne sabitleniyor.
- Kalan alt görev kullanıcıda: e-tablo, betiğin yapıştırılması, `LEAD_TOKEN`, web app dağıtımı.

**Test:** Canlı `/exec` adresi yok; sözleşme `research/lead-sheet.test.mjs` ile sahte Apps Script servislerine karşı kanıtlandı — 12 senaryo, 40 kontrol, TOPLAM SORUN 0. Token kapısı iki yönden sınandı (yanlış token reddedildi; `LEAD_TOKEN` tanımsızken de reddedildi, fail-open yok). Kapsam dışı: Google'ın gerçek davranışı — canlı tura kaldı.

### TASK-1.05 — Demo ucunu sertleştir: JSON doğrulaması ve `env` alanı (2026-09-11)

**Özet:**
- `toWebhook` artık üç kapılı: HTTP durumu, gövdenin JSON olması, `ok === true`. Apps Script hata verdiğinde dönen **200 + HTML** artık "kaydedildi" sayılmıyor — v1'de lead kaybettiren hata sınıfı kapandı.
- Lead'e `env` alanı (`DEPLOY_STAGE`) eklendi; e-posta gövdesine `Ortam:` satırı girdi — önizleme testleri e-tabloda ve gelen kutusunda ayrılıyor.
- Teşhis logları hedef adresi, token'ı ve kişisel veriyi taşımıyor; yalnız durum kodu, alıcının hata kodu ve zaman damgası.

**Test:** Yerel üretim derlemesine karşı serving katmanında (ayrı konteyner, 3200) **32 kontrol, TOPLAM SORUN 0**. Sözleşmeyi bozan beş gerçek yanıt (HTML, `ok:false`, HTTP 500, bozuk JSON, dizi gövde) beşi de 503 + `no-sink` verdi; kontrol grubu aynı koşuda yeşil — beşi de eski kodda `stored:true` sayılacaktı. Aşama senaryoları ayrıca koştu (3 senaryo, sorun 0): gerçek alan adı → `production`, **ara hâl** `vercel.app` → `preview`, alan adı env'i tanımsız → `preview`; yerel → `local`. Build ve eslint temiz. Devredilen tek kriter: gerçek `/exec` adresiyle uçtan uca tur → TASK-1.04 canlı turu.

---

<!-- KURAL: Sadece son 2 task özeti tutulur, daha eskileri silinir (gerçek silme — HTML comment yasak). -->
<!-- KURAL: Sadece aktif fazın task'leri gösterilir. Geçmiş fazların bilgileri phases/ klasöründedir. -->
<!-- KURAL: "Son Tamamlanan Faz", "Son Tamamlanan Sprint" gibi ek özet bölümleri EKLEME — faz durum özeti PHASES.md'de, faz detayları PHASE-N.md'de. DURUM yalnızca aktif durum + son 2 task özeti. -->
<!-- KURAL: Faz alt-fazlarının (verify-plan/plan/research/discuss) ayrı oturum özetlerini DURUM'a yazma — onlar faz dokümanına ait. -->

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

**Aktif Task:** `tasks/TASK-1.04.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
