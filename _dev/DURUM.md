# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-14 — TASK-1.13 tamamlandı: depo sözleşme paketi (10 test) yerel lead-store'a karşı yeşil; sırada TASK-1.14.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 10/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.14 — Kayıt adaptörü: `toWebhook` yerine lead deposu (`toStore`), `.env.example` ve Apps Script kalıntısı
**Durum:** ⬜ Bekliyor — TASK-1.13 tamamlandı, depo sözleşme paketi (`tests/lead-store.contract.test.ts`, 10 test) yerel lead-store'a karşı dondu; task sayısı ve sırası değişmedi.
**İlerleme:** Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:**
- **Yerel lead deposu hazır ve sözleşmesi dondu:** `docker compose --profile lead up -d lead-store` (bu oturum sonunda çalışır bırakıldı); komutlar, token üretimi ve tuzaklar `_dev/memory/yerel-lead-deposu-docker-profili.md`. Adaptörün dayanacağı davranış artık `tests/lead-store.contract.test.ts`'te donuk.
- **Lead hattı kullanıcı adımları:** TASK-1.18 önizleme depo token'ını ister (değer kullanıcıda: parola yöneticisi ya da sunucuda `/opt/alpfit-lead/.env`); TASK-1.06 `RESEND_API_KEY` ister ve Resend panel teyidini bekler. İkisinin de sırası gelmeden hazırlanabilir.
- **TASK-1.07:** kısmi ilerlemeyle 1.06'nın arkasında. Kapanışı kullanıcı adımına bağlı: Umami'de v2 site kaydı ve `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (Gelen Kutusu `[TASK-1.07]`, `tasks/TASK-1.07.md` → Sonraki Adım Detayı).

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
| 1.14 | Kayıt adaptörü — `toStore`, `.env.example`, Apps Script kalıntısı | ⬜ Bekliyor |
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

### TASK-1.13 — Depo sözleşme paketi, yerel depoya karşı kalıcı test (2026-09-14)

**Özet:**
- `tests/lead-store.contract.test.ts` (YENİ, 10 test): sitenin kayıt adaptörünün (TASK-1.14) dayanacağı depo sözleşmesini (durum kodları, gövde biçimleri, token→koleksiyon, `ip_hash` hız sınırı, beyaz liste) yerel `lead-store`'a karşı donduruyor. Env kapısı sitenin canlı anahtarlarından ayrı (`LEAD_CONTRACT_*`): URL tanımsızken atlanır, yerel olmayan host'a karşı **istek atmadan** hata verir (canlı koruma kapısı).
- Kayıt-okuyan kriterler (env, notify_*, mesaj kırpma, ip_hash başına sayım) için koşumdan hemen önce açılan geçici superuser + PocketBase REST auth (`Authorization: <token>`, yeni bağımlılık yok).
- `.env.example` ve `CLAUDE.md` (Ölçüm betikleri) sözleşme paketinin env adları ve koşum komutuyla güncellendi.

**Test:** Boş kapsam: env yokken paket görünür `↓ skipped`, diğer 3 dosya/43 test PASS, çıkış 0. Gerçek depoya karşı: **10/10 PASS** (toplam 4 dosya/53 test). Kapı sınaması: depoda önizleme token'ı boşaltılıp `--force-recreate` ile gerçekten yeniden yaratıldığında 8/10 kırmızı (önizleme token'ına dayananlar), kontrol grubu (üretim token'ı + 401 senaryosu) iki koşuda da yeşil; token geri yüklenince 10/10 yeniden yeşil. `eslint` temiz, `npm run build` hatasız (23 rota). Detay: `tasks/archive/TASK-1.13.md`

### TASK-1.17 — Yerel lead deposu, compose profili `lead` (2026-09-14)

**Özet:**
- `docker-compose.yml`'e `lead-store` servisi eklendi: imaj `../Alpfitplus-website.v1/pocketbase` bağlamından derlenir (`PB_VERSION=0.39.9`), `pb_hooks`+`pb_migrations` v1'den `:ro`, veri `lead_store_data` isimli hacimde; profil `lead`, varsayılan `up`'ta kalkmaz, host portu yayınlanmaz.
- Token'lar `${LEAD_TOKEN_PREVIEW:-}` / `${LEAD_TOKEN_PRODUCTION:-}` — v1'in sunucudaki `${…:?}` deseni bilerek kullanılmadı (yoksa `.env`'siz `up -d web` bile durur); boş/tanımsız slot `resolveTarget`'ta eşleşmiyor, fail-closed ölçüldü.
- `.env.example` güncellendi; `_dev/memory/yerel-lead-deposu-docker-profili.md` yeni kayıt (kaldırma/silme/token-yenileme komutları + 3 tuzak), `CLAUDE.md` Docker bloğuna profil komutu eklendi.

**Test:** `web` içinden `/api/health` → `200`; koleksiyonlar migration'la doğdu (`leads`/`leads_preview` → `403`, olmayan → `404`); geçerli önizleme token'ıyla `POST /lead` → `201 {"id":…,"prior_count":0}`, yanlış/eksik token → `401`; boş kapsam kapısı (token env tanımsızken) → `401`. `docker compose config --services` → yalnız `web` (lead-store varsayılanda yok); `rm -sf lead-store` sonrası `web` kesintisiz, `node_modules`/`next_cache`/`lead_store_data` hacimleri yerinde. v1: `git status --porcelain` 24 → 24 (yabancı, değişmedi), `pocketbase/` temiz. Token değeri sızıntısı yok (`grep`). Detay: `tasks/archive/TASK-1.17.md`

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

**Aktif Task:** `tasks/TASK-1.14.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
