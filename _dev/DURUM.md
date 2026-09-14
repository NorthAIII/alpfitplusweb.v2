# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-14 — TASK-1.14 tamamlandı: kayıt adaptörü `toStore`'a bağlandı (v1'in lead deposu), yerel uçtan uca 3 yöntemle (curl, gerçek tarayıcı, depo-durdur/geri-getir) doğrulandı; sırada TASK-1.18.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 11/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.18 — Canlı depo bağlantısı: Vercel env (önizleme token'ı) ve token → koleksiyon teyidi
**Durum:** ⬜ Bekliyor — TASK-1.14 tamamlandı, kayıt adaptörü (`toStore`) yerel depoya karşı üç yöntemle (curl, gerçek tarayıcı, depo-durdur/geri-getir) uçtan uca kanıtlandı; task sayısı ve sırası değişmedi.
**İlerleme:** Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:**
- **Kullanıcı adımı gerekiyor — TASK-1.18'in kendisi:** önizleme depo token'ı (değer kullanıcıda: parola yöneticisi ya da sunucuda `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PREVIEW`) olmadan bu task ilerleyemez.
- **Yerel lead deposu hâlâ ayakta** (`docker compose --profile lead up -d lead-store`; komutlar/tuzaklar `_dev/memory/yerel-lead-deposu-docker-profili.md`); site adaptörü ve sözleşme paketi (TASK-1.13) buna karşı yeşil.
- **Diğer kullanıcı adımları:** TASK-1.06 `RESEND_API_KEY` ister ve Resend panel teyidini bekler; sırası gelmeden hazırlanabilir. TASK-1.07 kısmi ilerlemeyle 1.06'nın arkasında; kapanışı Umami'de v2 site kaydı ve `NEXT_PUBLIC_UMAMI_WEBSITE_ID`'ye bağlı (Gelen Kutusu `[TASK-1.07]`, `tasks/TASK-1.07.md` → Sonraki Adım Detayı).

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
| 1.18 | Canlı depo bağlantısı — Vercel env ve token → koleksiyon teyidi | ⬜ Bekliyor |
| 1.06 | E-posta hattını aç ve uçtan uca canlı tur (depo + e-posta) | ⬜ Bekliyor |
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ⬜ Bekliyor |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — lead deposu (12 ay) ve kendi Umami | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.14 — Kayıt adaptörü `toStore`, yerel uçtan uca doğrulama (2026-09-14)

**Özet:**
- `src/app/api/demo/route.ts`: `toWebhook`/`LEAD_WEBHOOK_URL` kaldırıldı; `toStore` (yalnız `201` kayıt sayar, `ip_hash` HMAC-SHA256, beyaz liste gövde, depo `429`'u uca taşır) ve `notifyStore` (`PATCH` ile bildirim durumu) eklendi. Dört Karar Noktası task'ın kendi önerileriyle, kod yazılmadan karara bağlandı.
- `tests/api-demo.test.ts` tamamen yeniden yazıldı (28 test, sahte depo); `.env.example`/`README.md`/kök `CLAUDE.md` yeni anahtarlara (`LEAD_STORE_URL`/`_TOKEN`/`IP_HASH_SALT`) çevrildi; `research/lead-sheet.gs` + `.test.mjs` silindi.
- Yerel uçtan uca 3 yöntemle doğrulandı: curl, gerçek tarayıcı (Playwright), depo-durdur/geri-getir — kayıt `leads_preview`'a düşüyor, depo düşünce dürüst 503+WhatsApp.

**Test:** Kırmızı→yeşil: eski kod 8/28 kırmızı, yeni kod 28/28 yeşil. Tam suite (gerçek depoya karşı, geçici superuser): 4 dosya/**63 PASS** (TASK-1.13'ün 10 sözleşme testi dahil). Kapı sınaması: boş kapsam (`it.each` ile URL/token/tuz ayrı ayrı silinip depoya istek gitmediği doğrulandı) ve bozuk girdi (8 senaryo kod değişmeden kırmızı). `eslint` temiz, `npm run build` hatasız (23 rota). Detay: `tasks/archive/TASK-1.14.md`

### TASK-1.13 — Depo sözleşme paketi, yerel depoya karşı kalıcı test (2026-09-14)

**Özet:**
- `tests/lead-store.contract.test.ts` (YENİ, 10 test): sitenin kayıt adaptörünün (TASK-1.14) dayanacağı depo sözleşmesini (durum kodları, gövde biçimleri, token→koleksiyon, `ip_hash` hız sınırı, beyaz liste) yerel `lead-store`'a karşı donduruyor. Env kapısı sitenin canlı anahtarlarından ayrı (`LEAD_CONTRACT_*`): URL tanımsızken atlanır, yerel olmayan host'a karşı **istek atmadan** hata verir (canlı koruma kapısı).
- Kayıt-okuyan kriterler (env, notify_*, mesaj kırpma, ip_hash başına sayım) için koşumdan hemen önce açılan geçici superuser + PocketBase REST auth (`Authorization: <token>`, yeni bağımlılık yok).
- `.env.example` ve `CLAUDE.md` (Ölçüm betikleri) sözleşme paketinin env adları ve koşum komutuyla güncellendi.

**Test:** Boş kapsam: env yokken paket görünür `↓ skipped`, diğer 3 dosya/43 test PASS, çıkış 0. Gerçek depoya karşı: **10/10 PASS** (toplam 4 dosya/53 test). Kapı sınaması: depoda önizleme token'ı boşaltılıp `--force-recreate` ile gerçekten yeniden yaratıldığında 8/10 kırmızı (önizleme token'ına dayananlar), kontrol grubu (üretim token'ı + 401 senaryosu) iki koşuda da yeşil; token geri yüklenince 10/10 yeniden yeşil. `eslint` temiz, `npm run build` hatasız (23 rota). Detay: `tasks/archive/TASK-1.13.md`

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

**Aktif Task:** `tasks/TASK-1.18.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
