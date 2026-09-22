# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-22 — TASK-1.09 tamamlandı: `ClickTracker.tsx` (global tıklama dinleyicisi) yazıldı, 10 dosyaya `data-surface` çapası kondu; analitik yükü baseline'la birebir (`perf.mjs`), Umami betiği 2,56 KB + olay isteği 0,74 KB (CDP ağ kaydı, B-035 kapsam notuyla). Sırada TASK-1.15.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 16/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.15 — Yasal metin hizası (lead deposu + kendi Umami)
**Durum:** ⬜ Bekliyor
**İlerleme:** Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil. TASK-1.09 fazın son KOD task'ıydı — 1.15 kapanınca faz koddan tamamdır, Adım `verify` olur.
**Not:**
- **Global dinleyici ayakta (TASK-1.09):** `src/components/layout/ClickTracker.tsx` yazıldı, `src/app/layout.tsx`'e bağlandı; 10 dosyaya `data-surface` çapası kondu. Panelde yüzey etiketlerinin (`hero`/`footer`/`fiyat`) ve üçüncü olayın görünürlüğü **UAT'a kaldı** — kod tarafı izole konteynerde uçtan uca doğrulandı (`whatsapp` olayı `/api/send` `200`).
- **Umami paneline giriş kasada** (`UMAMI_USERNAME`/`UMAMI_PASSWORD`). ⚠️ Bu parola kaybedilirse giriş kalıcı kaybolur — 3.1.0 sıfırlama aracı taşımıyor (`memory/kendi-sunucu-n8n-bunker-umami.md`).
- **B-056 (b) uyarısı gelecekte Umami ölçen her tura geçerli:** araştırma konteynerinin varsayılan UA'sı `HeadlessChrome` ve Umami bot kontrolü **200 `{"beep":"boop"}`** dönüp kaydı yazmaz. Olay ölçerken bot olmayan UA ver, yoksa sahte yeşil okursun.
- **Yerel lead deposu hâlâ ayakta** (`docker compose --profile lead up -d lead-store`; komutlar/tuzaklar `_dev/memory/yerel-lead-deposu-docker-profili.md`).
- **⚠️ BULGULAR kırmızı çizgiyi (20k token) geçmiş durumda** (~20,1k). Yapısal sorun değil, **triyaj borcu**: supap `audit-product` uzlaştırmasıdır — TASK-1.15 sonrası planlı, ertelenemez sinyal.
- **`docker compose exec web npm run build` sonrası ihtiyaten `docker compose restart web` yap** (TASK-1.08/1.09'da gözlemlendi, gerekçe `memory/alternatif-env-ile-uretim-derlemesi.md`).

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
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ✅ Tamamlandı |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ✅ Tamamlandı |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — lead deposu (12 ay) ve kendi Umami | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.09 — Global tıklama dinleyicisi ve yüzey etiketleri (2026-09-22)

**Özet:**
- `src/components/layout/ClickTracker.tsx` (YENİ): tek `document` `click` dinleyicisi (bubble+`passive`), `wa.me`/`tel:` desenini yakalayıp yüzeyi `[data-surface]` → `section[id]` → sayfa yolu sırasıyla türetir, sözlükte yoksa `SURFACES.other`'a düşer.
- On dosyaya `data-surface` çapası kondu (Header, Footer, Assistant, Hero, FinalCta, DemoForm, demo/destek sayfaları, not-found, global-error); `Section` bileşeni prop forward etmediği için sayfa çapaları onun içindeki `div`'e kondu.
- Analitik yükü iki kaynaktan ölçüldü (B-035 kapsam notuyla): `perf.mjs` baseline'la **birebir aynı** (144/133 KB, LCP 96 ms); Umami betiği **2,56 KB** + bir olay isteği **0,74 KB** (CDP ağ kaydı, izole konteyner, gerçek website id).

**Test:** `npm test` 5 dosya/**61 PASS** + 1 skipped (yeni: `tests/click-tracker.test.ts` 5/5). `tsc --noEmit` 0. `docker compose exec web npm run build` + `--build web-prod` ikisi de temiz (23 rota). `a11y.mjs` TOPLAM SORUN: 0, `mobile-audit.mjs` yatay kaydırma: yok, `scan.mjs` (ana sayfa/`/demo`/`/destek`) konsol temiz, `font-guard.mjs` eksik karakter yok. Detay: `tasks/archive/TASK-1.09.md`

### TASK-1.08 — Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` (2026-09-22)

**Özet:**
- `src/lib/analytics.ts` (YENİ) tek yüzey olarak yazıldı: `EVENTS` (`demo-submit`/`whatsapp`/`phone`), `SURFACES` (19 etiket, tip düzeyinde daraltılmış), `track()` sarmalayıcısı (window/umami yoksa sessiz).
- **Olay adları v1 ile hizalandı** (`whatsapp-click`/`phone-click` → `whatsapp`/`phone`) — alan adı geçişinde v2'nin v1'in Umami kaydına devralınacağı gözetilerek; karar `docs/DECISIONS.md` 2026-09-22.
- `DemoForm.tsx` başarı dalına `track("demo-submit", "demo-form")` bağlandı; gerçek Umami'ye (izole konteyner, gerçek website id) uçtan uca doğrulandı — `/api/send` **200** + gerçek `sessionId`/`visitId`.

**Test:** `npm test` 4 dosya/**56 PASS** + 1 skipped (yeni: `tests/analytics.test.ts` 3/3). TS kapı sınaması pozitif+negatif kontrolle doğrulandı. `docker compose exec web npm run build` temiz (23 rota). `scan.mjs /demo` konsol temiz. Detay: `tasks/archive/TASK-1.08.md`

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

**Aktif Task:** `tasks/TASK-1.15.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
