# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-22 — audit-docs turu: doktrin kanonu (kök CLAUDE.md + dört çocuk) motorun güncel sürümüne hizalandı ve DECISIONS'ın kapanan 2026-09-10..2026-09-13 aralığı arşive bölündü.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** verify
**İlerleme:** 17/17 task tamamlandı (1 iptal: TASK-1.04)
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
<!-- - prd_review_bekliyor: Her iki sabit faz tamamlandı; prd-review bekleniyor / yarım kalmış (prd-save ile bölünmüş) / bilinçli ertelenmiş (teslim DevFlow-dışıysa go-live sonrasına) — üçünde de sıradaki komut /devflow:prd-review olarak önerilir, çalıştırılmaz -->

---

<!-- KURAL: Aşağıdaki üç bölüm (Aktif Task · Task Durumu · Son Task Özetleri) ilk kickoff'ta doldurulamaz — henüz task yoktur. O hâlde içerikleri `— yok` kalır ve **bölümler SİLİNMEZ**; ilk task'le dolarlar. Bu bir template kalıntısı DEĞİLDİR — audit'in "placeholder sızıntısı" kalemi bu üç bölüme boşken uygulanmaz (kanon: .claude/commands/devflow/lib/audit-mekanik.md → Placeholder sızıntısı, koşullu kalem). -->

## Aktif Task

**Task:** Yok — fazın tüm task'ları tamamlandı (son: TASK-1.15)
**Durum:** — (Adım `verify`)
**İlerleme:** Faz koddan ve metinden tamamdır. Sıradaki adım `/devflow:verify-phase`.
**Not:**
- **UAT'a devredilen iki kalem:** (1) Umami panelinde v2 kaydı altında sayfaların, yüzey etiketlerinin (`hero`/`footer`/`fiyat`) ve üç olayın gözle teyidi — kod tarafı uçtan uca ölçüldü (TASK-1.07/1.08/1.09); (2) TASK-1.06 e-postasının gelen kutusu/spam yerleşimi — gönderim tarafı `delivered` ölçüldü.
- **Yerel `lead-store` konteyneri hâlâ ayakta** (ölçüldü 2026-09-22: `Up`, healthy) — kaldırma/erişim komutları `memory/yerel-lead-deposu-docker-profili.md`.

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
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ✅ Tamamlandı |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ✅ Tamamlandı |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ✅ Tamamlandı |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — lead deposu (12 ay) ve kendi Umami | ✅ Tamamlandı |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.15 — Yasal metin hizası: lead deposu ve kendi Umami (2026-09-22)

**Durum:** ✅ Tamamlandı
**Özet:**
- KVKK **Aktarım** maddesi gerçeğe hizalandı: "Kayıt tutma — Google elektronik tablo" kalemi düştü; yeni giriş paragrafı kaydın **kendi sunucumuzda** olduğunu, Almanya'da (Nürnberg) bir veri merkezinde durduğunu ve yalnız yetkili yönetici hesabının okuyabildiğini yazıyor (sitenin anahtarı yalnız kayıt oluşturur). Listeye `Sunucu barındırma` kalemi girdi — kayıt aktarılmıyor, veri merkezi bir tedarikçi.
- KVKK **Saklama süresi** "en fazla iki yıl"dan v1 desenine geçti: depo kaydı **12 ay** (günlük temizlik işi, `RETENTION_MONTHS=12` ile ölçüldü) + "talebiniz üzerine daha erken" korundu; ekip posta kutusu ve gönderim sağlayıcısındaki kopyalar **süre iddiası kurulmadan** sayıldı.
- **Gizlilik** iki başlıkta hizalandı: ölçüm yazılımı kendi sunucumuzda (Umami; `umami.kiwiailab.com` deponun IP'siyle aynı — ölçüldü), "IP saklamaz" ölçülen kapsama **daraltıldı** ("kayıtlarında IP adresinizi tutmaz"), sorgu dizesi olgusu eklendi; "elektronik tablo hizmetinde (Google)" → kendi sunucudaki kayıt veritabanı.

**Test:** `npm test` 5 dosya/**61 PASS** + 1 skipped (taban birebir). `tsc --noEmit` 0, eslint 0. `npm run build` temiz (23 rota). Üç yasal sayfa 200 + yeni metin; `Google`/"elektronik tablo"/"en fazla iki yıl" **0** eşleşme. `a11y.mjs` TOPLAM SORUN: 0 (kapsam `/kvkk`, B-012), `font-guard.mjs` eksik karakter yok (16 sayfa/80.487 krk), `scan.mjs` üç yasal sayfada konsol temiz, `mobile-audit.mjs` yatay kaydırma yok. İddia taraması eşleşmesiz.
**Detay:** `tasks/archive/TASK-1.15.md`

<!-- KURAL: **Detay:** yolu task'ın DURUMUNA bağlıdır. ✅ Tamamlandı ise task arşive taşınmıştır (run-task Adım 7) ve yol `tasks/archive/…`'dır; task hâlâ `_dev/tasks/` altındaysa (🔄 / ⏸️ / 🔴) canlı yol yazılır. Özet Adım 5'te yazılır, taşıma Adım 7'de yapılır — sırayı izleyip tamamlanan task'a canlı yol yazmak, commit anında kırık bir referans bırakır ve bir sonraki audit turu onu "kırık dosya referansı" kalemi olarak açar. -->

---

### TASK-1.09 — Global tıklama dinleyicisi ve yüzey etiketleri (2026-09-22)

**Durum:** ✅ Tamamlandı
**Özet:**
- `src/components/layout/ClickTracker.tsx` (YENİ): tek `document` `click` dinleyicisi (bubble+`passive`), `wa.me`/`tel:` desenini yakalayıp yüzeyi `[data-surface]` → `section[id]` → sayfa yolu sırasıyla türetir, sözlükte yoksa `SURFACES.other`'a düşer.
- On dosyaya `data-surface` çapası kondu (Header, Footer, Assistant, Hero, FinalCta, DemoForm, demo/destek sayfaları, not-found, global-error); `Section` bileşeni prop forward etmediği için sayfa çapaları onun içindeki `div`'e kondu.
- Analitik yükü iki kaynaktan ölçüldü (B-035 kapsam notuyla): `perf.mjs` baseline'la **birebir aynı** (144/133 KB, LCP 96 ms); Umami betiği **2,56 KB** + bir olay isteği **0,74 KB** (CDP ağ kaydı, izole konteyner, gerçek website id).

**Test:** `npm test` 5 dosya/**61 PASS** + 1 skipped (yeni: `tests/click-tracker.test.ts` 5/5). `tsc --noEmit` 0. `docker compose exec web npm run build` + `--build web-prod` ikisi de temiz (23 rota). `a11y.mjs` TOPLAM SORUN: 0, `mobile-audit.mjs` yatay kaydırma: yok, `scan.mjs` (ana sayfa/`/demo`/`/destek`) konsol temiz, `font-guard.mjs` eksik karakter yok.
**Detay:** `tasks/archive/TASK-1.09.md`

---

<!-- KURAL: Sadece son 2 task özeti tutulur, daha eskileri silinir (gerçek silme — HTML comment yasak). -->
<!-- KURAL: Sadece aktif fazın task'leri gösterilir. Geçmiş fazların bilgileri phases/ klasöründedir. -->
<!-- KURAL: "Son Tamamlanan Faz", "Son Tamamlanan Sprint" gibi ek özet bölümleri EKLEME — faz durum özeti PHASES.md'de, faz detayları PHASE-N.md'de. DURUM yalnızca aktif durum + son 2 task özeti. -->
<!-- KURAL: Faz alt-fazlarının (verify-plan/plan/research/discuss) ayrı oturum özetlerini DURUM'a yazma — onlar faz dokümanına ait. -->
<!-- KURAL: Üç proje-özgü yerleşim (bilinçli, audit-docs 2026-09-22 — template'e çekilmez): (1) task ADI `###` başlığında durur, ayrı `**Konu:**` alanı AÇILMAZ — alan eklemek adı iki yerde tutar ve drift doğurur; (2) `**Test:**` alanı ilk task'ten beri (TASK-1.01, 011b8ac) her özette var ve yerleşik proje desenidir — ölçüm rakamı kapanışın kanıtıdır, silinmez; (3) Hızlı Erişim dört satırdır, dördüncüsü `BULGULAR.md`'dir (template üç satır tanımlar). -->

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

**Aktif Task:** yok — son tamamlanan `tasks/archive/TASK-1.15.md`
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
