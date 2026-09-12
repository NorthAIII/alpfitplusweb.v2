# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-13 — verify-plan tamamlandı: 8 mekanik düzeltme ve 3 onaylı yapısal değişiklik yapıldı (TASK-1.11'e Bunker tüketici envanteri, yedek referansı düzeltildi, TASK-1.12 lint kriteri B-028'e göre); sıra değişmedi, sıradaki adım TASK-1.07.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Bunker'a otomasyon tetiklemeden düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** task
**İlerleme:** 5/17 task tamamlandı (1 iptal: TASK-1.04)
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
**Durum:** ⬜ Bekliyor — plan review tamamlandı, çalıştırılmaya hazır
**İlerleme:** Henüz başlanmadı. Çalıştırma sırası Task Durumu tablosundaki satır sırasıdır, numara sırası değil.
**Not:** Ağaçtaki commit'lenmemiş Umami Cloud farkını (`src/app/layout.tsx`, `.env.example`) bu task devralır (kullanıcı kararı 2026-09-13); bu yüzden sıranın başına alındı. Plan revizyonu ve verify-plan oturumları bu iki dosyaya dokunmadı ve commit'lerine almadı (verify-plan farkı okudu: task dokümanının anlattığıyla aynı).

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 1.01 | Aşama türetimi ve `deployStage` tek kaynağı | ✅ Tamamlandı |
| 1.02 | noindex üç katman tek kaynaktan | ✅ Tamamlandı |
| 1.03 | Vercel'de ayrı proje, env iskeleti ve başlık ölçümü | ✅ Tamamlandı |
| 1.04 | Google Sheet lead alıcısı — Apps Script web app | ❌ İptal |
| 1.05 | Demo ucunu sertleştir — JSON doğrulaması ve `env` alanı | ✅ Tamamlandı |
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ⬜ Bekliyor |
| 1.16 | Test koşucusu (Vitest) — mevcut elle testler kalıcı olur | ⬜ Bekliyor |
| 1.11 | Bunker keşfi — giriş yolu ve otomasyon dışı tutma | ⬜ Bekliyor |
| 1.12 | İletişim biçimi doğrulaması (B-021) | ⬜ Bekliyor |
| 1.17 | Yerel prova ortamı — n8n + Postgres (Bunker şeması) | ⬜ Bekliyor |
| 1.13 | Alıcıyı yerel prova ortamında kur | ⬜ Bekliyor |
| 1.14 | Site bağlantısı — alıcı sözleşmesi ve Apps Script kalıntısı | ⬜ Bekliyor |
| 1.18 | Alıcıyı canlıya taşı ve Vercel env | ⬜ Bekliyor |
| 1.06 | E-posta hattını aç ve uçtan uca canlı tur | ⬜ Bekliyor |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ⬜ Bekliyor |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ⬜ Bekliyor |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — kendi sunucu ve kendi Umami | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.05 — Demo ucunu sertleştir: JSON doğrulaması ve `env` alanı (2026-09-11)

**Özet:**
- `toWebhook` artık üç kapılı: HTTP durumu, gövdenin JSON olması, `ok === true`. Apps Script hata verdiğinde dönen **200 + HTML** artık "kaydedildi" sayılmıyor — v1'de lead kaybettiren hata sınıfı kapandı.
- Lead'e `env` alanı (`DEPLOY_STAGE`) eklendi; e-posta gövdesine `Ortam:` satırı girdi — önizleme testleri e-tabloda ve gelen kutusunda ayrılıyor.
- Teşhis logları hedef adresi, token'ı ve kişisel veriyi taşımıyor; yalnız durum kodu, alıcının hata kodu ve zaman damgası.

**Test:** Yerel üretim derlemesine karşı serving katmanında (ayrı konteyner, 3200) **32 kontrol, TOPLAM SORUN 0**. Sözleşmeyi bozan beş gerçek yanıt (HTML, `ok:false`, HTTP 500, bozuk JSON, dizi gövde) beşi de 503 + `no-sink` verdi; kontrol grubu aynı koşuda yeşil — beşi de eski kodda `stored:true` sayılacaktı. Aşama senaryoları ayrıca koştu (3 senaryo, sorun 0): gerçek alan adı → `production`, **ara hâl** `vercel.app` → `preview`, alan adı env'i tanımsız → `preview`; yerel → `local`. Build ve eslint temiz. Devredilen tek kriter (canlı alıcıya giden talebin `env=local` yazması) 2026-09-13 revizyonuyla TASK-1.04'ten TASK-1.18'e geçti.

### TASK-1.10 — Yasal metin: Aktarım ve Çerezler maddeleri (2026-09-11)

**Özet:**
- KVKK Aktarım maddesi artık kayıt tutma tedarikçisini (Google elektronik tablo) adıyla sayıyor ve erişim kontrolünün gerçeğini yazıyor; ölçüm sağlayıcısı (Umami) **ayrı paragrafta**, çünkü ona kişisel veri gitmiyor — listeye konsaydı metin yanlış beyan olurdu.
- Gizlilik'te "Çerezler" başlığı "Çerezler ve ölçüm" oldu: çerez konmadığı, IP saklanmadığı ve ölçüme hangi bilginin gidip gitmediği açıkça yazıldı. Korunan takip-pikseli cümlesi çelişik okunmasın diye "siteler arasında izleyen" ile keskinleştirildi.
- **Yurt dışına aktarım bilinçle yazılmadı** — sağlayıcı ülkesi ve aktarımın hukuki dayanağı hukukçu kararı; B-024'ün üç kalemi (IP, Gizlilik veri listesi, form onay metni) açık kaldı ve gerekçesiyle bulgu atomuna işlendi. Detay: `tasks/archive/TASK-1.10.md`

**Test:** `a11y.mjs` TOPLAM SORUN 0 (8 sayfa; yasal metinlerden yalnız `/kvkk` kapsamda — `/gizlilik` ve `/kullanim-kosullari` bu kapıdan geçmiyor, B-012), `font-guard.mjs` kümede olmayan karakter yok (16 sayfa), `scan.mjs` üç yasal sayfada konsol temiz, build ve eslint hatasız. Kapılar geliştirme sunucusuna (3000) karşı koştu; üretim konteyneri bayat (B-019) ve paralel oturum yüzünden yeniden derlenmedi.

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
