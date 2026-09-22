# Phase 1 — Kapsam Tartışması

← PHASE-1 · kapsam-tartışması

> `_dev/phases/PHASE-1.md` → Kapsam Tartışması'nın bölme çocuğudur (verify-phase boyut kapısı, 2026-09-22; faz hâlâ aktifken bölündü — parent UAT tablosu ve iki düzeltme task'ı satırıyla 20.043 token'a, kırmızı çizginin üstüne çıkmıştı). Parent'ta fazın ne karara bağlandığı **özet** olarak durur; **kararların tam metni, kullanıcı tercihleri ve kapsam dışı listesi buradadır.**

---

## Kapsam Tartışması

> `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-11); plan revizyonlarıyla iki kez güncellendi (2026-09-13, 2026-09-14).

### Alınan Kararlar

- **Faz sırası değişti:** Bu faz "Metin tonu"nun önüne geçti. Metin tonu kullanıcı örneklerine bağlıydı ve hiçbir faz ona bağımlı değil; lead hattı ve ölçüm ise ILKELER'in pazarlıksız maddeleri. Yeni sıra `docs/DECISIONS.md` (2026-09-11) ve `PHASES.md` → Sıradaki Fazlar.
- **Lead hedefi v1'in lead deposu (2026-09-14 plan revizyonu):** Talep, v1 sitesinin iki aydır yazdığı PocketBase deposuna (`lead.alpfitplus.com`) yazılır; önizleme `leads_preview`'a, alan adı geçişinden sonra `leads`'e. Önce Google Sheet seçildi, dağıtım yapılamadı (2026-09-13). Sonra Bunker seçildi; TASK-1.11 keşfi `alpfit`'in canlı soğuk kampanya kiracısı olduğunu ölçtü ve kullanıcı "canlı sitenin yazdığı yere, basitçe" dedi (`docs/DECISIONS.md` 2026-09-14). Vercel'de kalıcı disk olmadığından `LEAD_FILE_PATH` yolu yayın ortamında kullanılmaz (yerel Docker'da kalabilir). Site adaptörü v1'in deposunun yerel kopyasına karşı sınanır (kullanıcı kararı 2026-09-14); depo kodu v1'de kalır, bu fazda değişmez.
- **E-posta bu fazda kapanır:** Site her talepte gönderir, alıcı göndermez — kayıt ve bildirim birbirinden bağımsız kalır (revizyon kararı 2026-09-13). Kod zaten Resend'e yazılı; `demo@alpfitplus.com` göndericisi için alan adı doğrulaması (TXT/DKIM/SPF) gerekir. Kayıtlar `alpfitplus.com` DNS'ine eklenir, v1 barındırmasına dokunmaz. Kayıtları oturum hazırlar, kullanıcı ekler.
- **Analitik sağlayıcısı research'te seçilir, ölçütler burada:** Vercel planı **Hobby**; Vercel Web Analytics bu planda özel olay saymaz. Aday: çerezsiz üçüncü taraf (Umami, Plausible benzeri) ya da kendi küçük olay ucu. Seçim ölçütleri sırayla: çerezsiz ve rıza gerektirmez (KVKK), üç özel olayı yüzey etiketiyle sayar, sayfa ağırlığı ve LCP/CLS etkisi ölçülebilir küçük, ücretsiz ya da düşük sabit ücret, bakım yükü. Reklam engelleyicinin sayıları eksiltmesi bilinerek kabul edilir.
- **Önizleme açık adres + noindex:** Şifre koruması yok (telefonda şifresiz bakılır, form testi korumaya takılmaz). Üretim dışı ortamda (`VERCEL_ENV !== "production"`) `X-Robots-Tag: noindex, nofollow` başlığı ve `robots.txt` tam `disallow` gider; üretimde bugünkü davranış korunur.
- **Test ve gerçek talep ayrımı:** Önizlemeden gelen test talepleri gerçeklerden ayrılır, silinmesi gerekmez. Lead deposunda (2026-09-14 revizyonu) ayrımı token yapar: kayıt `leads_preview` koleksiyonuna `env=preview` ile düşer; gövdedeki `env` alanı depoya girmez, e-posta gövdesindeki `Ortam:` satırında kalır (TASK-1.14).
- **Yasal metin dokunuşu kapsamda:** `legal.ts` Aktarım maddesi yalnız "barındırma ve e-posta tedarikçisi" diyordu; kayıt tutma yeri ve çerezsiz analitik ölçümü eklenir (TASK-1.10 Google/Umami Cloud'a göre yazdı, revizyon sonrası kendi sunucuya TASK-1.15 hizalar). Metin zaten hukukçu onayı bekliyor (B-008); bu değişiklik o kapsamda kalır, bulgu kapanmaz.
- **GIT-STRATEJI bu fazda değişecek:** Repo Vercel'e bağlanınca her `main` push önizlemeyi tetikler; "yayın hattı yok" beyanı "push = önizleme, üretim alan adı bağlı değil" olarak güncellenir. Güncelleme F7.3 task'ının kapanışında `lib/git-strategy-kurulum.md` tarifiyle yapılır (korumalı doküman, kullanıcıya bildirilerek).
- **Başlangıç ölçümü korunur:** F7.4 sonrası `perf.mjs` ağırlık ve LCP/CLS başlangıç çizgisiyle (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar) kıyaslanır; artış rakamıyla task dokümanına yazılır.

### Kullanıcı Tercihleri

- Lead hedefi: **v1'in lead deposu** (2026-09-14; önce Google Sheet, sonra Bunker). Notion, Slack/WhatsApp, yönetilen Postgres, yalnız e-posta, Sheets API ve Bunker seçenekleri elendi.
- Site adaptörü **yerel depo kopyasında** (compose profili; v1'in `pocketbase/` klasörü salt okunur) sınanır, canlı depoya tek test isteği gider (2026-09-14); test koşucusu **Vitest** bu fazda kurulur (2026-09-13).
- Analitik: **kendi Umami** (2026-09-13; Umami Cloud yerine).
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
- Lead takip akışı (arandı / demo yapıldı / teklif verildi) — elle yürür, CRM yok
- Slack/WhatsApp anlık bildirim; e-posta bildirim yeterli
- Sayfa görüntüleme dışında ek olaylar (fiyat hesaplayıcı kullanımı, segment tıklaması vb.) — üç dönüşüm olayıyla sınırlı, dar faz
- Vercel şifre/oturum koruması, önizleme için ayrı dal veya PR akışı (tek dal `main`)
- Lead hattı bulgularından B-020 (kota + `noValidate`; Gelen Kutusu sorusu açık), B-036 ve B-037 — bu faza yalnız B-021 alındı (revizyon kararı 2026-09-13)
- Umami'nin yerel kopyası (analitik canlı kurulumda `data-tag` ile ayrılır)
- v1'in lead deposunda kod, şema ya da ayar değişikliği (dokunulmaz repo); talep sahibine onay e-postası (v1'de var, v2'de yok — Gelen Kutusu)
