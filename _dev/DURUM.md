# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-14 — TASK-1.17 tamamlandı: yerel lead deposu (compose profili `lead`) ayakta ve doğrulandı; sırada TASK-1.13.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 9/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.13 — Depo sözleşme paketi (yerel depoya karşı kalıcı test)
**Durum:** ⬜ Bekliyor — TASK-1.17 tamamlandı, yerel lead deposu (compose profili `lead`) ayakta ve doğrulandı; task sayısı ve sırası değişmedi.
**İlerleme:** Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:**
- **Yerel lead deposu hazır:** `docker compose --profile lead up -d lead-store`; komutlar, token üretimi ve tuzaklar `_dev/memory/yerel-lead-deposu-docker-profili.md`. TASK-1.13 ve TASK-1.14 buna karşı çalışır.
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
| 1.13 | Depo sözleşme paketi — yerel depoya karşı kalıcı test | ⬜ Bekliyor |
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

### TASK-1.17 — Yerel lead deposu, compose profili `lead` (2026-09-14)

**Özet:**
- `docker-compose.yml`'e `lead-store` servisi eklendi: imaj `../Alpfitplus-website.v1/pocketbase` bağlamından derlenir (`PB_VERSION=0.39.9`), `pb_hooks`+`pb_migrations` v1'den `:ro`, veri `lead_store_data` isimli hacimde; profil `lead`, varsayılan `up`'ta kalkmaz, host portu yayınlanmaz.
- Token'lar `${LEAD_TOKEN_PREVIEW:-}` / `${LEAD_TOKEN_PRODUCTION:-}` — v1'in sunucudaki `${…:?}` deseni bilerek kullanılmadı (yoksa `.env`'siz `up -d web` bile durur); boş/tanımsız slot `resolveTarget`'ta eşleşmiyor, fail-closed ölçüldü.
- `.env.example` güncellendi; `_dev/memory/yerel-lead-deposu-docker-profili.md` yeni kayıt (kaldırma/silme/token-yenileme komutları + 3 tuzak), `CLAUDE.md` Docker bloğuna profil komutu eklendi.

**Test:** `web` içinden `/api/health` → `200`; koleksiyonlar migration'la doğdu (`leads`/`leads_preview` → `403`, olmayan → `404`); geçerli önizleme token'ıyla `POST /lead` → `201 {"id":…,"prior_count":0}`, yanlış/eksik token → `401`; boş kapsam kapısı (token env tanımsızken) → `401`. `docker compose config --services` → yalnız `web` (lead-store varsayılanda yok); `rm -sf lead-store` sonrası `web` kesintisiz, `node_modules`/`next_cache`/`lead_store_data` hacimleri yerinde. v1: `git status --porcelain` 24 → 24 (yabancı, değişmedi), `pocketbase/` temiz. Token değeri sızıntısı yok (`grep`). Detay: `tasks/archive/TASK-1.17.md`

### TASK-1.12 — İletişim biçimi doğrulaması (B-021) (2026-09-13)

**Özet:**
- Yeni saf fonksiyon `src/lib/contact.ts`: e-posta basit biçim, telefon Türkiye yazımları (10/11 hane ya da `90` önekiyle 12); kural "en az biri geçerli olsun" — `route.ts`'e `bad-contact` (422) kapısı olarak girdi, `missing-contact` ile `no-consent` arasında. `reply_to` artık yalnız e-posta geçerliyse Resend gövdesine giriyor.
- `DemoForm.tsx` uçtan dönen `code`'u alanla eşliyor (`aria-invalid`/`aria-describedby`), odak dolu-ama-bozuk alana taşınıyor. İlk taslakta odak sabit ilk alana (`phone`) gidiyordu; tarayıcı testinde yakalanıp gerçekten dolu alana yönlendirildi (Test Kriterleri'nin "odak o alanda" şartı).
- B-021 çözüldü (kapanış teyidi verify-phase'te); B-020 ve B-036 kapsam dışı bırakıldı.

**Test:** `docker compose exec web npm test` → **3 dosya, 43 test, TÜMÜ PASS** (20 yeni + TASK-1.16'nın 18'i + `stage.test.ts` 5'i, kırılma yok). Kapı sınaması: kod öncesi 3 senaryo kırmızıydı (2× bad-contact + reply_to), sonrası yeşil. `a11y.mjs` TOPLAM SORUN 0, `font-guard.mjs` temiz, `scan.mjs /demo` konsol temiz, build hatasız, eslint temiz (yeni dosyalarda 0 hata; `DemoForm.tsx`'te B-028'in 4 kalemi aynen kaldı). Tarayıcı doğrulaması (Playwright): iki yönde de (yalnız e-posta bozuk / yalnız telefon bozuk) doğru alan işaretlendi ve odaklandı. Detay: `tasks/archive/TASK-1.12.md`

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

**Aktif Task:** `tasks/TASK-1.13.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
