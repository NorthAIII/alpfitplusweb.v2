# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-13 — TASK-1.12 tamamlandı: iletişim biçimi doğrulaması (B-021) sunucuda ve formda; sıradaki TASK-1.11 kullanıcı kararı bekliyor.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Bunker'a otomasyon tetiklemeden düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 7/17 task tamamlandı (1 iptal: TASK-1.04)
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

**Task:** TASK-1.11 — Bunker keşfi — giriş yolu ve otomasyon dışı tutma
**Durum:** ⬜ Bekliyor — kısmi ilerleme (keşif alt görev 1-6 tamam, commit'li)
**İlerleme:** Alt görev 7 (kullanıcı onayı) bekliyor. Sorular `tasks/TASK-1.11.md` → Kullanıcıya Sorular, Gelen Kutusu satırı `[TASK-1.11]`. Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:**
- **TASK-1.12** tamamlandı (B-021 çözüldü); bu karardan bağımsızdı.
- **TASK-1.11** kapanışı kullanıcı kararına bağlı; cevap gelene kadar 1.17 · 1.13 · 1.14 · 1.18 · 1.06 bekler.
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
| 1.11 | Bunker keşfi — giriş yolu ve otomasyon dışı tutma | ⬜ Bekliyor |
| 1.17 | Yerel prova ortamı — n8n + Postgres (Bunker şeması) | ⬜ Bekliyor |
| 1.13 | Alıcıyı yerel prova ortamında kur | ⬜ Bekliyor |
| 1.14 | Site bağlantısı — alıcı sözleşmesi ve Apps Script kalıntısı | ⬜ Bekliyor |
| 1.18 | Alıcıyı canlıya taşı ve Vercel env | ⬜ Bekliyor |
| 1.06 | E-posta hattını aç ve uçtan uca canlı tur | ⬜ Bekliyor |
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ⬜ Bekliyor |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — kendi sunucu ve kendi Umami | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.16 — Test koşucusu (Vitest) — mevcut elle testler kalıcı olur (2026-09-13)

**Özet:**
- Vitest kuruldu (`vitest@4.1.11` — 5.x, projenin `@types/node@^20` sabitiyle ERESOLVE veriyordu), `npm test` (`vitest run`) kalıcı koşucu oldu; `tests/` kökte, `@` takma adı `resolve.alias` ile çözülüyor.
- TASK-1.01'in 5 aşama-türetimi senaryosu ve TASK-1.05'in 13 `/api/demo` sözleşme/doğrulama senaryosu artık her oturumda tekrar koşuyor; Node tip-soyma workaround'u (memory) gereksiz kaldı, silindi.
- Kapı bilerek bozulan bir beklentiyle kırmızıya döndü (çıkış kodu 1), geri alınca yeşile döndü (B-030 dersi karşılandı).

**Test:** `docker compose exec web npm test` → **2 dosya, 18 test, TÜMÜ PASS, çıkış kodu 0**. Sözleşme bataryası TASK-1.05'in sonuçlarını birebir üretti (kontrol grubu 200 · beş bozuk yanıt 503 `no-sink` · 3× 422 · 1× 400 · 429 · kırpma 400 dönmedi). Log casusu hedef adres/ad/telefon/e-posta/mesaj sızıntısı bulmadı. Build (23 rota) ve `web-prod` imajı hatasız; eslint temiz. Kapsam dürüstlüğü: route handler doğrudan çağrıldı, gerçek Next sunucusu/başlıklar TASK-1.05'in 3200 ölçümünde kaldı. Detay: `tasks/archive/TASK-1.16.md`

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

**Aktif Task:** `tasks/TASK-1.11.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
