# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-13 — TASK-1.16 tamamlandı: Vitest kuruldu, aşama türetimi (5) + `/api/demo` sözleşmesi (13) kalıcı test oldu, kapı kırmızıya dönebiliyor ölçüldü; sıradaki TASK-1.11.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Bunker'a otomasyon tetiklemeden düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 6/17 task tamamlandı (1 iptal: TASK-1.04)
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
**Durum:** ⬜ Bekliyor
**İlerleme:** Henüz başlanmadı. Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:** TASK-1.07 kısmi ilerlemeyle 1.06'nın arkasına, bağımlıları 1.08 · 1.09 · 1.15'in önüne taşındı (orkestratör kararı 2026-09-13). Umami farkı ve tracker çevirisi commit'li; ağaçta Umami kiri kalmadı, 1.14 ve 1.17'nin "`.env.example` Umami bloğu commit'li olmalı" koşulu sağlandı. 1.07'nin kapanışı kullanıcı adımına bağlı: Umami'de v2 site kaydı ve `NEXT_PUBLIC_UMAMI_WEBSITE_ID` girişi (`BULGULAR.md` → Gelen Kutusu `[TASK-1.07]`; devam: `tasks/TASK-1.07.md` → Sonraki Adım Detayı).

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
| 1.11 | Bunker keşfi — giriş yolu ve otomasyon dışı tutma | ⬜ Bekliyor |
| 1.12 | İletişim biçimi doğrulaması (B-021) | ⬜ Bekliyor |
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

### TASK-1.10 — Yasal metin: Aktarım ve Çerezler maddeleri (2026-09-11)

**Özet:**
- KVKK Aktarım maddesi artık kayıt tutma tedarikçisini (Google elektronik tablo) adıyla sayıyor ve erişim kontrolünün gerçeğini yazıyor; ölçüm sağlayıcısı (Umami) **ayrı paragrafta**, çünkü ona kişisel veri gitmiyor — listeye konsaydı metin yanlış beyan olurdu.
- Gizlilik'te "Çerezler" başlığı "Çerezler ve ölçüm" oldu: çerez konmadığı, IP saklanmadığı ve ölçüme hangi bilginin gidip gitmediği açıkça yazıldı. Korunan takip-pikseli cümlesi çelişik okunmasın diye "siteler arasında izleyen" ile keskinleştirildi.
- **Yurt dışına aktarım bilinçle yazılmadı** — sağlayıcı ülkesi ve aktarımın hukuki dayanağı hukukçu kararı; B-024'ün üç kalemi (IP, Gizlilik veri listesi, form onay metni) açık kaldı ve gerekçesiyle bulgu atomuna işlendi. Detay: `tasks/archive/TASK-1.10.md`

**Test:** `a11y.mjs` TOPLAM SORUN 0 (8 sayfa; yasal metinlerden yalnız `/kvkk` kapsamda — `/gizlilik` ve `/kullanim-kosullari` bu kapıdan geçmiyor, B-012), `font-guard.mjs` kümede olmayan karakter yok (16 sayfa), `scan.mjs` üç yasal sayfada konsol temiz, build ve eslint hatasız. Kapılar geliştirme sunucusuna (3000) karşı koştu; üretim konteyneri bayat (B-019) ve paralel oturum yüzünden yeniden derlenmedi.

### TASK-1.16 — Test koşucusu (Vitest) — mevcut elle testler kalıcı olur (2026-09-13)

**Özet:**
- Vitest kuruldu (`vitest@4.1.11` — 5.x, projenin `@types/node@^20` sabitiyle ERESOLVE veriyordu), `npm test` (`vitest run`) kalıcı koşucu oldu; `tests/` kökte, `@` takma adı `resolve.alias` ile çözülüyor.
- TASK-1.01'in 5 aşama-türetimi senaryosu ve TASK-1.05'in 13 `/api/demo` sözleşme/doğrulama senaryosu artık her oturumda tekrar koşuyor; Node tip-soyma workaround'u (memory) gereksiz kaldı, silindi.
- Kapı bilerek bozulan bir beklentiyle kırmızıya döndü (çıkış kodu 1), geri alınca yeşile döndü (B-030 dersi karşılandı).

**Test:** `docker compose exec web npm test` → **2 dosya, 18 test, TÜMÜ PASS, çıkış kodu 0**. Sözleşme bataryası TASK-1.05'in sonuçlarını birebir üretti (kontrol grubu 200 · beş bozuk yanıt 503 `no-sink` · 3× 422 · 1× 400 · 429 · kırpma 400 dönmedi). Log casusu hedef adres/ad/telefon/e-posta/mesaj sızıntısı bulmadı. Build (23 rota) ve `web-prod` imajı hatasız; eslint temiz. Kapsam dürüstlüğü: route handler doğrudan çağrıldı, gerçek Next sunucusu/başlıklar TASK-1.05'in 3200 ölçümünde kaldı. Detay: `tasks/archive/TASK-1.16.md`

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
