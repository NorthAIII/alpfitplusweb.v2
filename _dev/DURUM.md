# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-22 — TASK-1.07 tamamlandı: v2'nin Umami site kaydı API ile açıldı (`640b05f1-…`), tracker gerçek kimlikle uçtan uca ölçüldü ve yayın yüzeyi `data-tag="preview"` ile sayıyor; B-056 koruması da kapandı. Sırada TASK-1.08.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 14/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.08 — Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit`
**Durum:** ⬜ Bekliyor
**İlerleme:** Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:**
- **Analitik hattı ayakta (TASK-1.07):** v2'nin kendi Umami kaydı açıldı — `Alpfit Plus v2 (önizleme)` / `alpfitplus-web-v2.vercel.app`, kimlik `640b05f1-41aa-4ba0-985b-f30145e49983` (sır değil). `NEXT_PUBLIC_UMAMI_WEBSITE_ID` Vercel Production + Preview'de; yayın yüzeyi `data-tag="preview"` ile sayıyor. v1'in `alpfitplus.com` kaydı bayt bayt değişmedi.
- **⚠️ TASK-1.08'i bağlayan kullanıcı yönü (2026-09-14):** alan adı geçişinde v2 v1'in kaydına geçeceği için **olay adları v1 ile hizalanacak** — v1: `demo-submit`, `whatsapp`, `phone`, `email`, `instagram`, `cta`; v2'nin eski planındaki `-click` eki **kullanılmayacak**.
- **B-056 (b) uyarısı 1.08/1.09 ölçümlerinde de geçerli:** araştırma konteynerinin varsayılan UA'sı `HeadlessChrome` ve Umami bot kontrolü **200 `{"beep":"boop"}`** dönüp kaydı yazmaz. Olay ölçerken bot olmayan UA ver, yoksa sahte yeşil okursun.
- **Umami paneline giriş kasada** (`UMAMI_USERNAME`/`UMAMI_PASSWORD`). ⚠️ Bu parola kaybedilirse giriş kalıcı kaybolur — 3.1.0 sıfırlama aracı taşımıyor (`memory/kendi-sunucu-n8n-bunker-umami.md`).
- **Yerel lead deposu hâlâ ayakta** (`docker compose --profile lead up -d lead-store`; komutlar/tuzaklar `_dev/memory/yerel-lead-deposu-docker-profili.md`).
- **BULGULAR ~19,9k token** — rehber kırmızı çizgiye (20k) dayandı. Yapısal sorun değil, **triyaj borcu**: supap `audit-product` uzlaştırmasıdır.

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
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ✅ Tamamlandı |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — lead deposu (12 ay) ve kendi Umami | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.07 — Kendi Umami'ye site kaydı ve tracker bağlantısı (2026-09-22)

**Özet:**
- v2'nin **kendi** Umami site kaydı oturum tarafından **API ile** açıldı (`POST /api/websites`): `Alpfit Plus v2 (önizleme)` / `alpfitplus-web-v2.vercel.app`, kimlik `640b05f1-41aa-4ba0-985b-f30145e49983`, `teamId` null. Kurulum 2 → 3 kayıt; v1'in `alpfitplus.com` ve `kiwiailab.com` kayıtları **bayt bayt değişmedi** (önce/sonra diff boş). Kullanıcıya panel adımı kalmadı.
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` Vercel Production + Preview'e Config olarak girildi, yeniden dağıtıldı (Ready 40 s). Yayın yüzeyi: `data-tag="preview"`, `data-exclude-search="true"`, `data-domains` yok, noindex bozulmadı.
- Tur iki kez kullanıcı kararında durdu (parola geçersiz → 3.1.0'da sıfırlama aracı yok); ikisi de kayda geçti. Task dokümanı 21,0k token'a çıktığı için **faz hâlâ aktifken** bölündü → `TASK-1.07-OTURUM-KAYITLARI.md` (parent 8,7k).

**Test:** Yerel: `/api/send` **200** ve gövde `sessionId`/`visitId` — `{"beep":"boop"}` değil (bot kontrolü bot-olmayan UA ile aşıldı, B-056 (b) sahte yeşili engellendi); `data-tag="local"`, çerez **0**. **B-056 canlıda kanıtlandı:** `/demo?name=…&phone=…` açıldı, yükte `url` sorgusuz. `npm test` 3 dosya/**53 PASS** + 1 skipped (taban aynı), eslint 0, `cloud.umami.is` 0. Bunker "Web Trafik" paneli **koddan** elendi (share-URL/env deseni, API'den saymıyor). Detay: `tasks/archive/TASK-1.07.md`

### TASK-1.06 — E-posta hattı açıldı, lead hattı önizlemeden uçtan uca kanıtlandı (2026-09-21)

**Özet:**
- v2'ye özel Resend anahtarı **oturum tarafından API ile üretildi** (`alpfitplus-web-v2`, `sending_access`, `alpfitplus.com`'a bağlı) ve `RESEND_API_KEY` olarak Vercel Production + Preview'e `--sensitive` girildi; yeniden dağıtım `alpfitplus-web-v2-hz8zkhm2t`. Kullanıcı panel adımı gerekmedi — anahtar kasası kararı (`docs/DECISIONS.md` 2026-09-21).
- Önizleme `/demo` gerçek tarayıcıdan (mobil profil) gönderildi: uç `200 {stored:true, mailed:true}`; canlı depo `leads_preview` 12 → **13** (`env=preview`, `notify_team=sent`, `Segment:` öneki, `branches=2`), `leads` 2'de kaldı.
- Resend kaydı **`last_event: delivered`**; gövde dokuz alan + `KVKK onayı` + **`Ortam: preview`**, `reply_to` lead'in adresi. Alan adı `verified`/`eu-west-1` API'den ölçüldü.

**Test:** `npm test` 3 dosya/**53 PASS** + 1 skipped (taban aynı). `vercel env ls` altı anahtar × iki ortam. Depo okuması salt-okunur (`data.db` ve `-wal` bayt bayt değişmedi). B-037(1) yayın yüzeyinde ölçülüp 🟢'ye indi; B-011 bugün yeniden ölçüldü (apex MX hâlâ yok), `DEMO_TO` kalemi kapandı. Detay: `tasks/archive/TASK-1.06.md`

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

**Aktif Task:** `tasks/TASK-1.08.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
