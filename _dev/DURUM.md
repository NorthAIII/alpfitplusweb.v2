# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-22 — TASK-1.07 hâlâ açık: B-056 koruma kapısı kapatıldı (ölçüldü, commit `5dfa017`); Umami kimliği kasaya girdi ama **parola geçersiz** (401) ve 3.1.0'da **parola sıfırlama aracı yok** — kullanıcı kararı bekleniyor.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 13/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.07 — Kendi Umami'ye site kaydı ve tracker bağlantısı
**Durum:** ⬜ Bekliyor — kısmi ilerleme var (kod, B-056 koruması ve yerel ölçüm commit'li); kapanışı Umami'de v2 site kaydına ve `NEXT_PUBLIC_UMAMI_WEBSITE_ID`'ye bağlı (`tasks/TASK-1.07.md` → 2026-09-21 kaydı → Sonraki Adım Detayı).
**İlerleme:** Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:**
- **Lead hattı uçtan uca yeşil (TASK-1.06):** önizlemeden gelen gerçek talep `leads_preview`'a düştü (`notify_team=sent`) ve e-posta Resend'de `delivered`. Faz milestone'unun lead ayağı kapandı.
- **🔴 1.07 BLOKE — Umami paneline giriş yok:** kasadaki `admin` parolası `401` veriyor (taşıma temiz olduğu ölçüldü) ve Umami 3.1.0 **parola sıfırlama aracı taşımıyor** (`scripts/change-password.js` hem kaynakta hem konteynerde yok; `POST /api/me/password` mevcut parolayı istiyor; konteynerde `bcryptjs` yok). Kalan tek yol DB'ye doğrudan yazma → **kullanıcı kararı**. Detay: `tasks/TASK-1.07.md` → 2026-09-22 kaydı.
- **Anahtar kasası açıldı** (`docs/DECISIONS.md` 2026-09-21): yönetim anahtarları `~/.config/alpfit/secrets.env` (600, repo dışı), oturum panel işini API ile yapıyor — detay `memory/anahtar-kasasi-config-alpfit.md`. **1.07'nin Umami adımı aynı yolu bekliyor ve biçimi artık ölçüldü** (2026-09-21): self-hosted Umami 3.1.0'da **API anahtarı yok** — `checkAuth` yalnız `Authorization: Bearer` kabul ediyor, token `POST /api/auth/login` ile **kullanıcı adı + paroladan** çıkıyor. Kasaya `UMAMI_USERNAME` + `UMAMI_PASSWORD` girerse site kaydı kullanıcısız açılabilir.
- **B-056 kapısı KAPANDI** (2026-09-21): `data-exclude-search="true"` izleyici etiketine eklendi ve ölçüldü; kimlik girildiği an kişisel veri sızdıran zincir artık kurulmuyor. Kalan: B-036'nın native GET yolu (kaynak tarafı) ve 1.07'nin 3. kriterinin bot-kontrolü sahte yeşili (B-056 (b)).
- **Yerel lead deposu hâlâ ayakta** (`docker compose --profile lead up -d lead-store`; komutlar/tuzaklar `_dev/memory/yerel-lead-deposu-docker-profili.md`).
- **BULGULAR ~19,8k token** — rehber kırmızı çizgiye (20k) dayandı ve açık bulgu 49 (eşik ~30). Yapısal sorun değil, **triyaj borcu**: supap `audit-product` uzlaştırmasıdır (CLAUDE.md → Boyut ve Bölünme, kanvas dokümanı bölünmez).

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 1.01 | Aşama türetimi ve `deployStage` tek kaynağı | ✅ Tamamlandı |
| 1.02 | noindex üç katman tek kaynaktan | ✅ Tamamlandı |
| 1.03 | Vercel'de ayrı proje, env iskeleti ve başlık ölçümü | ✅ Tamamlandı |
| 1.04 | Google Sheet lead alıcısı — Apps Script web app | ❌ İptal |
| 1.05 | Demo ucunu sertleştir — JSON doğrulaması ve `env` alanı | ✅ Tamamlandı |
| 1.16 | Test koşucusu (Vitest) — mevcut elle testler kalıcı olur | ✅ Tamamlandı |
| 1.12 | İletişim biçimi doğrulaması (B-021) | ✅ Tamamlandı |
| 1.11 | Bunker keşfi — giriş yolu ve otomasyon dışı tutma | ✅ Tamamlandı |
| 1.17 | Yerel lead deposu — v1'in PocketBase'i salt okunur bağlı compose profili | ✅ Tamamlandı |
| 1.13 | Depo sözleşme paketi — yerel depoya karşı kalıcı test | ✅ Tamamlandı |
| 1.14 | Kayıt adaptörü — `toStore`, `.env.example`, Apps Script kalıntısı | ✅ Tamamlandı |
| 1.18 | Canlı depo bağlantısı — Vercel env ve token → koleksiyon teyidi | ✅ Tamamlandı |
| 1.06 | E-posta hattını aç ve uçtan uca canlı tur (depo + e-posta) | ✅ Tamamlandı |
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ⬜ Bekliyor |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — lead deposu (12 ay) ve kendi Umami | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.06 — E-posta hattı açıldı, lead hattı önizlemeden uçtan uca kanıtlandı (2026-09-21)

**Özet:**
- v2'ye özel Resend anahtarı **oturum tarafından API ile üretildi** (`alpfitplus-web-v2`, `sending_access`, `alpfitplus.com`'a bağlı) ve `RESEND_API_KEY` olarak Vercel Production + Preview'e `--sensitive` girildi; yeniden dağıtım `alpfitplus-web-v2-hz8zkhm2t`. Kullanıcı panel adımı gerekmedi — anahtar kasası kararı (`docs/DECISIONS.md` 2026-09-21).
- Önizleme `/demo` gerçek tarayıcıdan (mobil profil) gönderildi: uç `200 {stored:true, mailed:true}`; canlı depo `leads_preview` 12 → **13** (`env=preview`, `notify_team=sent`, `Segment:` öneki, `branches=2`), `leads` 2'de kaldı.
- Resend kaydı **`last_event: delivered`**; gövde dokuz alan + `KVKK onayı` + **`Ortam: preview`**, `reply_to` lead'in adresi. Alan adı `verified`/`eu-west-1` API'den ölçüldü.

**Test:** `npm test` 3 dosya/**53 PASS** + 1 skipped (taban aynı). `vercel env ls` altı anahtar × iki ortam. Depo okuması salt-okunur (`data.db` ve `-wal` bayt bayt değişmedi). B-037(1) yayın yüzeyinde ölçülüp 🟢'ye indi; B-011 bugün yeniden ölçüldü (apex MX hâlâ yok), `DEMO_TO` kalemi kapandı. Detay: `tasks/archive/TASK-1.06.md`

### TASK-1.18 — Canlı depo bağlantısı: Vercel env ve token → koleksiyon teyidi (2026-09-14)

**Özet:**
- Vercel `alpfitplus-web-v2` Production + Preview'e `LEAD_STORE_URL` (Config), `LEAD_STORE_TOKEN` (Secret, önizleme token'ı) ve `IP_HASH_SALT` (Secret, v2'ye özel rastgele) girildi; değerler hiçbir çıktıya düşmedi. Kapanış push'u env'li ilk dağıtım.
- Yerel dev'den canlı depoya tek talep (`200 stored:true`). Canlı `data.db` SSH ile salt-okunur okundu: kayıt `leads_preview`'da, `env=preview`; `leads`'te 0. Önceki bir oturumun kayıtsız aynı testi de (16:48Z) önizlemede; iki kayıt kalıyor.
- Umami site kaydı kararı DECISIONS'a, F7.5 env taşıma listesi M7'ye, canlı teyit yolu memory'ye yazıldı.

**Test:** Canlı `health` 200, token'sız `POST /lead` 401. Canlıya gidiş kanıtı: yerel sayım 57/57; geri dönüş kanıtı: yerel 58, canlıda `geri donus` 0. `vercel env ls` üç anahtar × iki ortam. `npm test` 3 dosya/53 PASS + 1 skipped. Diff'te 64-hex 0. Detay: `tasks/archive/TASK-1.18.md`

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

**Aktif Task:** `tasks/TASK-1.07.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
