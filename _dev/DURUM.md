# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-11 — TASK-1.04 kod tarafı bitti: Apps Script alıcısı (`research/lead-sheet.gs`) token kapısı, kilit ve formül kaçırmayla yazıldı, sahte Apps Script ortamında 40 kontrol yeşil; `.env.example` temizlendi. Task 🔄 — e-tablo ve web app dağıtımı kullanıcının Google hesabında yapılacak.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Google Sheet'e düşüyor ve e-postayla geliyor; üç olay yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 3/10 task tamamlandı (TASK-1.04 🔄 devam ediyor)
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
**Durum:** 🔄 Devam ediyor
**İlerleme:** 4 alt görevin 3'ü bitti (betik, sütun şeması, `.env.example`); kalan alt görev 3 **kullanıcının Google hesabında** yapılacak — e-tablo, betiğin yapıştırılması, `LEAD_TOKEN` Script Properties'e girilmesi, web app dağıtımı. Tarif `research/lead-sheet.gs` başındaki KURULUM bloğunda; devam adımları task dokümanının "Sonraki Adım Detayı" alanında.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 1.01 | Aşama türetimi ve `deployStage` tek kaynağı | ✅ Tamamlandı |
| 1.02 | noindex üç katman tek kaynaktan | ✅ Tamamlandı |
| 1.03 | Vercel'de ayrı proje, env iskeleti ve başlık ölçümü | ✅ Tamamlandı |
| 1.04 | Google Sheet lead alıcısı — Apps Script web app | 🔄 Devam ediyor |
| 1.05 | Demo ucunu sertleştir — JSON doğrulaması ve `env` alanı | ⬜ Bekliyor |
| 1.06 | E-posta hattı doğrulaması ve uçtan uca lead testi | ⬜ Bekliyor |
| 1.07 | Umami kurulumu ve tracker bağlantısı | ⬜ Bekliyor |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.03 — Vercel'de ayrı proje, env iskeleti ve başlık ölçümü (2026-09-11)

**Özet:**
- v2 kendi Vercel projesinde ayakta: `alpfitplus-web-v2` (takım `north-ai`, plan `hobby`), adres `https://alpfitplus-web-v2.vercel.app`; `main` push git kaynaklı dağıtım üretiyor. v1'in projesine ve `alpfitplus.com`'a dokunulmadı, v1 ölçülerek doğrulandı.
- **Vercel `output: "standalone"` ile derlemeyi kırıyor** (iz dosyası `ENOENT`); standalone Docker imajı için gerekli olduğundan `next.config.ts`'te `VERCEL`'e bağlı koşullu hâle geldi — kayıt memory → Teknik Tuzaklar.
- GIT-STRATEJI kullanıcı onayıyla hizalandı: otomatik dağıtım var, yayın hattı yok (adres `noindex` önizleme yüzeyi, gerçek yayın F7.5'te).

**Test:** Dokuz kalem yayın zinciri üzerinden curl ile ölçüldü — beş güvenlik başlığı + tek HSTS (çift yok), `X-Powered-By` yok, `X-Robots-Tag` hem `/` hem `/sitemap.xml`'de, `robots.txt` tam `Disallow: /`, HTML `meta robots`, sekiz rota 200, font `immutable`, `/api/demo` boş POST 422, v1 hâlâ 200; başlıklar önbellek `HIT` yanıtında da tam. Yerel üretim derlemesi hatasız 23 rota ve `.next/standalone/server.js` hâlâ üretiliyor (Docker imajı kırılmadı).

### TASK-1.04 — Google Sheet lead alıcısı — Apps Script web app (2026-09-11, 🔄 devam ediyor)

**Özet:**
- `research/lead-sheet.gs` yazıldı: token Script Properties'te (kullanıcı kararı — repo ve Google kopyaları böylece birebir eşit kalıyor), `LockService` ile kilit, başlık satırı kendiliğinden doğar, her yolda JSON yanıt.
- **Sheets formül enjeksiyonu** icrada çıktı ve kapatıldı: dışarıdan gelen `= + - @` ile başlayan alan tek tırnakla metne sabitleniyor (`=IMPORTXML` ile e-tablo içeriğini sızdırma yüzeyi).
- `.env.example` yalnız anahtar adlarına indi — `DEMO_TO` / `DEMO_FROM` değerleri boşaltıldı.

**Test:** Canlı `/exec` adresi henüz yok; sözleşme `research/lead-sheet.test.mjs` ile sahte Apps Script servislerine karşı kanıtlandı — 12 senaryo, 40 kontrol, TOPLAM SORUN 0. Token kapısı iki yönden sınandı: yanlış/eksik token reddedildi (kontrol grubu aynı koşuda yeşil) ve `LEAD_TOKEN` **tanımsızken** istek `no-token-configured` ile reddedildi, yani kurulum eksikliğinde fail-open yok. Kapsam dışı: Google'ın gerçek davranışı (302, yetki, kota, apostrof önekinin hücrede görünürlüğü) — canlı tura kaldı.

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
