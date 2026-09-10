# Phase 1: Önizleme yayını, lead hattı ve analitik

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Bir bölüm büyüyüp kırmızı çizgiye (~20k token) yaklaşırsa faz HÂLÂ AKTİFKEN `PHASE-N-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır, o dosya adı değildir) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-N · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Tamamlandıktan (✅) sonra bölme yasaktır; verify-phase ve review-phase fazı dondurmadan önce boyutu kontrol eder. -->

---

## Genel Bilgiler

**Amaç:** v2'yi v1'den **ayrı** bir Vercel projesinde önizleme adresine çıkarmak; demo talebini gerçek bir hedefe (Google Sheet) dayanıklı yazıp e-postayla bildirmek; üç dönüşüm olayını (demo gönderimi, WhatsApp tıklaması, telefon tıklaması) yüzey etiketiyle saymak. Bu faz ILKELER'in iki pazarlıksız maddesini ("gelen talep kaybolmaz", "ölçülebilirlik") bugün karşılanmayan hâlden çıkarır. v1 Vercel projesine ve `alpfitplus.com`'a dokunulmaz.

**Milestone:** v2 ayrı Vercel projesinde `vercel.app` önizleme adresinde ayakta ve `noindex`; önizlemeden gönderilen gerçek bir demo talebi Google Sheet'e satır olarak düşüyor **ve** `DEMO_TO`'ya e-posta geliyor; üç olay yüzey etiketiyle analitik panelinde görünüyor; güvenlik başlıkları önizleme adresinde ölçüldü; v1 projesine dokunulmadı.

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

| Feature | Modül | Açıklama |
|---------|-------|----------|
| F7.3: Vercel'de ayrı proje ve önizleme yayını | M7-Yayın ve Altyapı | Repo Vercel'e bağlanır, env tanımlanır, `main` push önizlemeyi günceller; önizleme `noindex` |
| F3.2: Dayanıklı kayıt hedefi | M3-Lead Hattı | `LEAD_WEBHOOK_URL` → Google Sheet (Apps Script web app); gerçek talep satıra düşer |
| F3.3: E-posta bildirimi | M3-Lead Hattı | Resend + `demo@alpfitplus.com`; alan adı DNS'te doğrulanır |
| F7.4: Analitik olay sayımı | M7-Yayın ve Altyapı | Çerezsiz sağlayıcı; üç olay yüzey etiketiyle; sayfa ağırlığı ölçülür |

---

## Kapsam Tartışması

> Bu bölüm `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-11).

### Alınan Kararlar

- **Faz sırası değişti:** Bu faz "Metin tonu"nun önüne geçti. Metin tonu kullanıcı örneklerine bağlıydı ve hiçbir faz ona bağımlı değil; lead hattı ve ölçüm ise ILKELER'in pazarlıksız maddeleri. Yeni sıra `docs/DECISIONS.md` (2026-09-11) ve `PHASES.md` → Sıradaki Fazlar.
- **Lead hedefi Google Sheet:** Talep bir e-tabloya satır olarak düşer; telefondan bakılır, filtrelenir, dışa aktarılır; tek kişilik ekip için en ucuz dayanıklı kayıt. Vercel'de kalıcı disk olmadığından `LEAD_FILE_PATH` yolu yayın ortamında kullanılmaz (yerel Docker'da kalabilir). Alıcı mekanizma (Apps Script web app, paylaşılan gizli anahtar, satır şeması) research-phase'de netleşir.
- **E-posta bu fazda kapanır:** Kod zaten Resend'e yazılı; `demo@alpfitplus.com` göndericisi için alan adı doğrulaması (TXT/DKIM/SPF) gerekir. Kayıtlar `alpfitplus.com` DNS'ine eklenir, v1 barındırmasına dokunmaz. Kayıtları oturum hazırlar, kullanıcı ekler.
- **Analitik sağlayıcısı research'te seçilir, ölçütler burada:** Vercel planı **Hobby**; Vercel Web Analytics bu planda özel olay saymaz. Aday: çerezsiz üçüncü taraf (Umami, Plausible benzeri) ya da kendi küçük olay ucu. Seçim ölçütleri sırayla: çerezsiz ve rıza gerektirmez (KVKK), üç özel olayı yüzey etiketiyle sayar, sayfa ağırlığı ve LCP/CLS etkisi ölçülebilir küçük, ücretsiz ya da düşük sabit ücret, bakım yükü. Reklam engelleyicinin sayıları eksiltmesi bilinerek kabul edilir.
- **Önizleme açık adres + noindex:** Şifre koruması yok (telefonda şifresiz bakılır, form testi korumaya takılmaz). Üretim dışı ortamda (`VERCEL_ENV !== "production"`) `X-Robots-Tag: noindex, nofollow` başlığı ve `robots.txt` tam `disallow` gider; üretimde bugünkü davranış korunur.
- **Test ve gerçek talep ayrımı:** Lead kaydına ortam alanı (`env`: preview/production/development) eklenir; önizlemeden gelen test satırları e-tabloda ayırt edilir, silinmesi gerekmez.
- **Yasal metin dokunuşu kapsamda:** `legal.ts` Aktarım maddesi yalnız "barındırma ve e-posta tedarikçisi" diyor; e-tablo/kayıt tutma tedarikçisi ve çerezsiz analitik ölçümü eklenir. Metin zaten hukukçu onayı bekliyor (B-008); bu değişiklik o kapsamda kalır, bulgu kapanmaz.
- **GIT-STRATEJI bu fazda değişecek:** Repo Vercel'e bağlanınca her `main` push önizlemeyi tetikler; "yayın hattı yok" beyanı "push = önizleme, üretim alan adı bağlı değil" olarak güncellenir. Güncelleme F7.3 task'ının kapanışında `lib/git-strategy-kurulum.md` tarifiyle yapılır (korumalı doküman, kullanıcıya bildirilerek).
- **Başlangıç ölçümü korunur:** F7.4 sonrası `perf.mjs` ağırlık ve LCP/CLS başlangıç çizgisiyle (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar) kıyaslanır; artış rakamıyla task dokümanına yazılır.

### Kullanıcı Tercihleri

- Lead hedefi: **Google Sheet** (Notion, Slack/WhatsApp ve Postgres seçenekleri elendi).
- DNS: kullanıcı `alpfitplus.com` DNS'ine kayıt ekleyebilir; Resend hesabı kullanıcıda.
- Vercel planı: **Hobby**.
- Önizleme: **açık adres + noindex**.
- Vercel projesi kullanıcı eylemiyle açılır (vercel.com/new → repo içe aktarma); env değerlerini Vercel'e kullanıcı girer, oturum anahtar adlarını ve değer üretim tarifini hazırlar. v1'in projesi `alpfitplus-website` ile aynı hesapta, farklı ad (öneri: `alpfitplus-web-v2`).
- Görsel ve mobil inceleme önizleme adresi çıktıktan sonra gerçek telefonda yapılır; bulgular BULGULAR'a düşer ve "Görsel ve mobil iyileştirme" fazını besler.

### Kapsam Dışı

- Alan adı bağlama, 301 haritası, canonical/sitemap alan adı değişimi (F7.5 — "Alan adı geçişi" fazı)
- CI, tek komut ölçüm, iddia sızıntı denetimi (M6 — "Kalite kapıları otomatik" fazı)
- Görsel ve mobil iyileştirme, ana sayfa mobil uzunluğu sorusu (Gelen Kutusu'nda bekler; sonraki faz)
- Metin tonu (alan adı geçişinden hemen önceki faz)
- Asistanın Claude'a bağlanması (v2.1)
- Hız sınırının paylaşımlı sayaca taşınması (BULGULAR → Bilinçli Tercihler)
- Lead takip akışı (arandı / demo yapıldı / teklif verildi) — e-tabloda elle yürür, CRM yok
- Slack/WhatsApp anlık bildirim; e-posta bildirim yeterli
- Sayfa görüntüleme dışında ek olaylar (fiyat hesaplayıcı kullanımı, segment tıklaması vb.) — üç dönüşüm olayıyla sınırlı, dar faz
- Vercel şifre/oturum koruması, önizleme için ayrı dal veya PR akışı (tek dal `main`)

---

## Araştırma Bulguları

> Bu bölüm `/devflow:research-phase` oturumunda doldurulur.

### Değerlendirilen Yaklaşımlar
- [Yaklaşım 1]: [Açıklama, artılar, eksiler]
- **Seçilen:** [Hangisi ve neden]

### Kullanılacak Araçlar/Kütüphaneler
- [Araç 1]: [Versiyon, ne için]

### Dikkat Edilecekler
- [Tuzak/Risk 1]: [Nasıl kaçınılacak]

### Teknik Kararlar
- [Karar 1]: [Gerekçe]

---

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda doldurulur.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 1.01 | TASK-1.01 | ⬜ Bekliyor | [kısa açıklama] |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## UAT Sonuçları

> Bu bölüm `/devflow:verify-phase` oturumunda doldurulur.

**Tarih:** [tarih]
**Toplam Senaryo:** X | **Geçen:** Y | **Kalan:** Z

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ✅/❌ | [not] |

---

## Retrospektif

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

### Ne İyi Gitti?
- [Tekrarlanması gereken pratikler]

### Ne Kötü Gitti?
- [Sorunlar ve darboğazlar]

### Sonraki Faz İçin Öneriler
- [Alınan dersler, tavsiyeler]

### Task-Spesifik Teknik Öğrenimler

<!-- OPSİYONEL: Bu fazdaki task'larda öğrenilen ama proje genelinde geçerli olmayan teknik nüanslar (araç davranışı, framework bug'ı, vb.). MEMORY.md'nin değil, faz retrosunun evidir. Bu fazda böyle bir nüans çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

### DevFlow'a Öneri

<!-- OPSİYONEL: Bu fazda fark edilen, DevFlow yönteminin geneline dair (proje-özel OLMAYAN) iyileştirmeler — aracın kendisinin nasıl çalışması gerektiği. Buraya yazılır + kullanıcıya bildirilir; DevFlow'a ayrı oturumda taşınır. Disiplin çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

---

## Kalite Kontrol Sonuçları

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

| Eksen | Durum | Not |
|-------|-------|-----|
| Modülerlik | ✅ / ⚠️ / ❌ | ... |
| Güvenlik | ✅ / ⚠️ / ❌ | ... |
| Bakım Maliyeti | ✅ / ⚠️ / ❌ | ... |
| Performans | ✅ / ⚠️ / ❌ | ... |
| Hata Yönetimi | ✅ / ⚠️ / ❌ | ... |
| Test Kapsamı | ✅ / ⚠️ / ❌ | ... |
| Erişilebilirlik | ✅ / N/A | ... |

---

**Oluşturulma:** 2026-09-11
