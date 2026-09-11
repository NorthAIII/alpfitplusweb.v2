# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-11 — TASK-1.03 tamamlandı: v2 kendi Vercel projesinde (`alpfitplus-web-v2`) önizleme adresinde ayakta ve noindex; `main` push git kaynaklı dağıtım üretiyor; güvenlik başlıkları ve noindex üç katmanı yayın zincirinde ölçüldü; GIT-STRATEJI hizalandı; sıradaki task TASK-1.04.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Google Sheet'e düşüyor ve e-postayla geliyor; üç olay yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 3/10 task tamamlandı
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
**Durum:** ⬜ Bekliyor
**İlerleme:** TASK-1.03 kapandı; site `https://alpfitplus-web-v2.vercel.app` üzerinde ayakta ve noindex — lead hattının yazacağı hedef henüz yok

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 1.01 | Aşama türetimi ve `deployStage` tek kaynağı | ✅ Tamamlandı |
| 1.02 | noindex üç katman tek kaynaktan | ✅ Tamamlandı |
| 1.03 | Vercel'de ayrı proje, env iskeleti ve başlık ölçümü | ✅ Tamamlandı |
| 1.04 | Google Sheet lead alıcısı — Apps Script web app | ⬜ Bekliyor |
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

### TASK-1.02 — noindex üç katman tek kaynaktan (2026-09-11)

**Özet:**
- Üretim dışında üç katman birden kapalı: `X-Robots-Tag: noindex, nofollow` (`next.config.ts`), `robots.txt` tam `disallow`, HTML `metadata.robots` — üçü de tek `deployStage` değerinden.
- Başlık katmanı HTML-dışı yanıtları da kapsıyor (`/sitemap.xml` üzerinde ölçüldü); güvenlik başlıkları ve önbellek kuralları değişmedi.
- Alan adı bağlandığında (F7.5) üçü kendiliğinden açılır — kodda elle çevrilecek bayrak yok.

**Test:** Dört ortam senaryosu serving katmanında curl ile ölçüldü — `local` kapalı, gerçek alan adı açık, **`VERCEL_ENV=production` + `.vercel.app` kapalı** (fail-open sınavı), alan adı tanımsız kapalı; `npm run build` hatasız 23 rota; dokunulan dosyalarda eslint 0 sorun; `a11y.mjs` TOPLAM SORUN 0; `scan.mjs` konsol temiz.

### TASK-1.03 — Vercel'de ayrı proje, env iskeleti ve başlık ölçümü (2026-09-11)

**Özet:**
- v2 kendi Vercel projesinde ayakta: `alpfitplus-web-v2` (takım `north-ai`, plan `hobby`), adres `https://alpfitplus-web-v2.vercel.app`; `main` push git kaynaklı dağıtım üretiyor. v1'in projesine ve `alpfitplus.com`'a dokunulmadı, v1 ölçülerek doğrulandı.
- **Vercel `output: "standalone"` ile derlemeyi kırıyor** (iz dosyası `ENOENT`); standalone Docker imajı için gerekli olduğundan `next.config.ts`'te `VERCEL`'e bağlı koşullu hâle geldi — kayıt memory → Teknik Tuzaklar.
- GIT-STRATEJI kullanıcı onayıyla hizalandı: otomatik dağıtım var, yayın hattı yok (adres `noindex` önizleme yüzeyi, gerçek yayın F7.5'te).

**Test:** Dokuz kalem yayın zinciri üzerinden curl ile ölçüldü — beş güvenlik başlığı + tek HSTS (çift yok), `X-Powered-By` yok, `X-Robots-Tag` hem `/` hem `/sitemap.xml`'de, `robots.txt` tam `Disallow: /`, HTML `meta robots`, sekiz rota 200, font `immutable`, `/api/demo` boş POST 422, v1 hâlâ 200; başlıklar önbellek `HIT` yanıtında da tam. Yerel üretim derlemesi hatasız 23 rota ve `.next/standalone/server.js` hâlâ üretiliyor (Docker imajı kırılmadı).

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
