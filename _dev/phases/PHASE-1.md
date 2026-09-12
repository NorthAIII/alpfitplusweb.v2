# Phase 1: Önizleme yayını, lead hattı ve analitik

**Durum:** 🔄 Devam ediyor

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Bir bölüm büyüyüp kırmızı çizgiye (~20k token) yaklaşırsa faz HÂLÂ AKTİFKEN `PHASE-N-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır, o dosya adı değildir) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-N · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Tamamlandıktan (✅) sonra bölme yasaktır; verify-phase ve review-phase fazı dondurmadan önce boyutu kontrol eder. -->

---

## Genel Bilgiler

**Amaç:** v2'yi v1'den **ayrı** bir Vercel projesinde önizleme adresine çıkarmak; demo talebini gerçek bir hedefe (kendi sunucudaki satış paneli Bunker, `alpfit` kiracısı) satış otomasyonlarına sokmadan dayanıklı yazıp e-postayla bildirmek ve bu hattın sözleşmesini kalıcı testle korumak; üç dönüşüm olayını (demo gönderimi, WhatsApp tıklaması, telefon tıklaması) yüzey etiketiyle saymak. Bu faz ILKELER'in iki pazarlıksız maddesini ("gelen talep kaybolmaz", "ölçülebilirlik") bugün karşılanmayan hâlden çıkarır. v1 Vercel projesine ve `alpfitplus.com`'a dokunulmaz.

**Milestone:** v2 ayrı Vercel projesinde `vercel.app` önizleme adresinde ayakta ve `noindex`; önizlemeden gönderilen gerçek bir demo talebi Bunker'da `alpfit` kiracısına kayıt olarak düşüyor, hiçbir satış otomasyonunu tetiklemiyor **ve** `DEMO_TO`'ya e-posta geliyor; üç olay yüzey etiketiyle kendi Umami panelinde görünüyor; güvenlik başlıkları önizleme adresinde ölçüldü; v1 projesine dokunulmadı.

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

| Feature | Modül | Açıklama |
|---------|-------|----------|
| F7.3: Vercel'de ayrı proje ve önizleme yayını | M7-Yayın ve Altyapı | Repo Vercel'e bağlanır, env tanımlanır, `main` push önizlemeyi günceller; önizleme `noindex` |
| F3.2: Dayanıklı kayıt hedefi | M3-Lead Hattı | `LEAD_WEBHOOK_URL` → Bunker `alpfit` kiracısı (giriş yolu TASK-1.11); alıcı önce yerel provada, sonra canlıda; talep otomasyonlara girmez |
| F3.3: E-posta bildirimi | M3-Lead Hattı | Resend + `demo@alpfitplus.com`; site her talepte gönderir, alıcı göndermez; alan adı DNS'te doğrulanır |
| F7.4: Analitik olay sayımı | M7-Yayın ve Altyapı | Kendi Umami (`umami.kiwiailab.com`), çerezsiz; üç olay yüzey etiketiyle; sayfa ağırlığı ölçülür |

**Destek işleri (feature matrisi değişmez):** test koşucusu Vitest (M6 F6.1'in genişlemesi, TASK-1.16) ve alıcının yerel prova ortamı (M7 F7.1'in genişlemesi, TASK-1.17) F3.2'ye hizmet eder.

---

## Kapsam Tartışması

> Bu bölüm `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-11).

### Alınan Kararlar

- **Faz sırası değişti:** Bu faz "Metin tonu"nun önüne geçti. Metin tonu kullanıcı örneklerine bağlıydı ve hiçbir faz ona bağımlı değil; lead hattı ve ölçüm ise ILKELER'in pazarlıksız maddeleri. Yeni sıra `docs/DECISIONS.md` (2026-09-11) ve `PHASES.md` → Sıradaki Fazlar.
- **Lead hedefi Bunker (2026-09-13 plan revizyonu):** Talep kendi sunucudaki satış panelinde `alpfit` kiracısına düşer; satış takibi zaten orada yürür. İlk karar Google Sheet'ti, Google hesabındaki dağıtım yapılamadığı için değişti (`docs/DECISIONS.md` 2026-09-13). Vercel'de kalıcı disk olmadığından `LEAD_FILE_PATH` yolu yayın ortamında kullanılmaz (yerel Docker'da kalabilir). Giriş yolu ve otomasyon dışı tutma TASK-1.11 keşfinde netleşir; alıcı önce yerel prova ortamında kurulur, sonra canlıya taşınır.
- **E-posta bu fazda kapanır:** Site her talepte gönderir, alıcı göndermez — kayıt ve bildirim birbirinden bağımsız kalır (revizyon kararı 2026-09-13). Kod zaten Resend'e yazılı; `demo@alpfitplus.com` göndericisi için alan adı doğrulaması (TXT/DKIM/SPF) gerekir. Kayıtlar `alpfitplus.com` DNS'ine eklenir, v1 barındırmasına dokunmaz. Kayıtları oturum hazırlar, kullanıcı ekler.
- **Analitik sağlayıcısı research'te seçilir, ölçütler burada:** Vercel planı **Hobby**; Vercel Web Analytics bu planda özel olay saymaz. Aday: çerezsiz üçüncü taraf (Umami, Plausible benzeri) ya da kendi küçük olay ucu. Seçim ölçütleri sırayla: çerezsiz ve rıza gerektirmez (KVKK), üç özel olayı yüzey etiketiyle sayar, sayfa ağırlığı ve LCP/CLS etkisi ölçülebilir küçük, ücretsiz ya da düşük sabit ücret, bakım yükü. Reklam engelleyicinin sayıları eksiltmesi bilinerek kabul edilir.
- **Önizleme açık adres + noindex:** Şifre koruması yok (telefonda şifresiz bakılır, form testi korumaya takılmaz). Üretim dışı ortamda (`VERCEL_ENV !== "production"`) `X-Robots-Tag: noindex, nofollow` başlığı ve `robots.txt` tam `disallow` gider; üretimde bugünkü davranış korunur.
- **Test ve gerçek talep ayrımı:** Lead kaydına ortam alanı (`env`: preview/production/development) eklenir; önizlemeden gelen test satırları e-tabloda ayırt edilir, silinmesi gerekmez.
- **Yasal metin dokunuşu kapsamda:** `legal.ts` Aktarım maddesi yalnız "barındırma ve e-posta tedarikçisi" diyordu; kayıt tutma yeri ve çerezsiz analitik ölçümü eklenir (TASK-1.10 Google/Umami Cloud'a göre yazdı, revizyon sonrası kendi sunucuya TASK-1.15 hizalar). Metin zaten hukukçu onayı bekliyor (B-008); bu değişiklik o kapsamda kalır, bulgu kapanmaz.
- **GIT-STRATEJI bu fazda değişecek:** Repo Vercel'e bağlanınca her `main` push önizlemeyi tetikler; "yayın hattı yok" beyanı "push = önizleme, üretim alan adı bağlı değil" olarak güncellenir. Güncelleme F7.3 task'ının kapanışında `lib/git-strategy-kurulum.md` tarifiyle yapılır (korumalı doküman, kullanıcıya bildirilerek).
- **Başlangıç ölçümü korunur:** F7.4 sonrası `perf.mjs` ağırlık ve LCP/CLS başlangıç çizgisiyle (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar) kıyaslanır; artış rakamıyla task dokümanına yazılır.

### Kullanıcı Tercihleri

- Lead hedefi: **Bunker** (2026-09-13; Google Sheet dağıtımı yapılamadı). Notion, Slack/WhatsApp, yönetilen Postgres, yalnız e-posta ve Sheets API seçenekleri elendi.
- Alıcı önce **yerel prova ortamında** (compose; n8n + Postgres) kurulup sınanır, sonra canlıya taşınır; test koşucusu **Vitest** bu fazda kurulur (2026-09-13).
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
- Lead takip akışı (arandı / demo yapıldı / teklif verildi) — e-tabloda elle yürür, CRM yok
- Slack/WhatsApp anlık bildirim; e-posta bildirim yeterli
- Sayfa görüntüleme dışında ek olaylar (fiyat hesaplayıcı kullanımı, segment tıklaması vb.) — üç dönüşüm olayıyla sınırlı, dar faz
- Vercel şifre/oturum koruması, önizleme için ayrı dal veya PR akışı (tek dal `main`)
- Lead hattı bulgularından B-020 (kota + `noValidate`; Gelen Kutusu sorusu açık), B-036 ve B-037 — bu faza yalnız B-021 alındı (revizyon kararı 2026-09-13)
- Umami'nin yerel kopyası (analitik canlı kurulumda `data-tag` ile ayrılır)

---

## Araştırma Bulguları

> Bu bölüm `/devflow:research-phase` oturumunda dolduruldu (2026-09-11). Dört karar noktası kullanıcıya sunuldu ve seçildi; gerekçeler "Teknik Kararlar"da.
>
> **Bölme çocukları:** `PHASE-1-ARASTIRMA.md` — yaklaşım karşılaştırması (elenenler dâhil) ve ölçülmüş tuzakların tam listesi (araştırma-detayı).
>
> **Plan revizyonu (2026-09-13):** lead alıcısı (Apps Script → Bunker) ve analitik sağlayıcısı (Umami Cloud → kendi Umami) değişti; aşağıdaki seçimler güncel hâlleridir. Gerekçeler `docs/DECISIONS.md` 2026-09-13, Apps Script'e özgü ayrıntılar iptal edilen `tasks/archive/TASK-1.04.md`'de.

### Değerlendirilen Yaklaşımlar (özet)

Tam karşılaştırma (elenen seçenekler, artı/eksi) → `PHASE-1-ARASTIRMA.md`. Seçilenler:

- **Lead alıcısı:** Bunker `alpfit` kiracısı (revizyon). Giriş yolu (n8n iş akışı ya da Bunker giriş ucu) TASK-1.11'de; sitenin üç kapılı sözleşmesi (HTTP durumu, JSON gövde, `ok === true`) korunur. Alıcı yerel prova ortamında kanıtlanıp canlıya taşınır.
- **Analitik:** kendi Umami (`umami.kiwiailab.com`, revizyon) — çerezsiz, `data-tag` ile ortam ayrımı (kurulum sürümünün desteği TASK-1.07'de teyit). Vercel Web Analytics Hobby'de özel olay saymadığı için elendi; Plausible ücretsiz plan yok.
- **Olay bağlama:** layout'ta tek global tıklama dinleyicisi (`wa.me` / `tel:`) + bölümlere `data-surface`; demo gönderimi `DemoForm` başarı anında `track`. Kodda 15 WhatsApp + 5 telefon bağlantısı (12 dosya) olduğu için tek tek öznitelik elendi.
- **Ortam modeli:** `main` = production kalır; aşama (`local | preview | production`) `VERCEL_ENV` + `VERCEL_PROJECT_PRODUCTION_URL`'den türetilir — discuss'taki `VERCEL_ENV !== "production"` varsayımı ölçümde çürüdü (detay çocukta).
- **noindex:** üç katman aynı aşama değerinden — `X-Robots-Tag` başlığı, `robots.ts` disallow, `metadata.robots`.

### Kullanılacak Araçlar/Kütüphaneler

- **Umami tracker (kendi kurulum)** — `https://umami.kiwiailab.com/script.js` (v1 aynı adresi kullanıyor), `next/script` ile `strategy="afterInteractive"`; öznitelikler `data-website-id` (yeni env `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, sır değil), `data-tag={deployStage}`. `data-domains` **kullanılmaz** (önizlemede saymalı). Yeni npm bağımlılığı yok.
- **Bunker / n8n (kendi sunucu)** — giriş yolu, kimlik doğrulama ve yanıt sözleşmesi TASK-1.11'de; kurallar `../altyapi/vps/CLAUDE.md` ve `../bunker-dashboard/AGENTS.md`, adresler ve tuzak memory → Kendi sunucu. Yerel prova: compose profili, n8n + Postgres (TASK-1.17).
- **Vitest** — tek devDependency, kök `tests/`, `npm test` konteynerde (TASK-1.16).
- **Resend HTTP API** — mevcut `fetch` kullanımı korunur, SDK yok; alan `reply_to` doğru (API böyle). `Idempotency-Key` başlığı isteğe bağlı (tekrar gönderimde çift e-posta önler; 24 saat, ≤256 karakter) — `lead.at + club` türevi kullanılabilir.
- **Vercel sistem env'leri** — `VERCEL`, `VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL` (üçü de derleme ve çalışma anında; projede "Enable access to System Environment Variables" kutusu açık olmalı — F7.3'te teyit).
- **Next.js 16 `next.config.ts` → `env`** — aşama tek yerde hesaplanır ve `NEXT_PUBLIC_DEPLOY_STAGE` olarak koda gömülür; `src/lib/stage.ts` (yeni) yalnız okur. Aynı değer `headers()` içinde noindex'i belirler.

### Dikkat Edilecekler (özet)

Tam liste ölçümleriyle → `PHASE-1-ARASTIRMA.md` → Dikkat Edilecekler. Plan-phase'i doğrudan etkileyenler:

- `VERCEL_ENV` tek başına önizlemeyi ayırmaz (main push = production); `env` alanı ve etiket `deployStage`'den yazılır.
- Resend DNS kayıtları (DKIM, `send` MX+SPF eu-west-1, DMARC katı) alan adında **zaten var**; kullanıcı yalnız panelde "Verified" teyit eder. `DEMO_FROM` tam `@alpfitplus.com` olmalı.
- Apex MX yok → `destek@`/`demo@alpfitplus.com` posta alamayabilir (Gelen Kutusu; faz dışı). `DEMO_TO` Google MX'li, etkilenmez.
- Bunker'ın `leads`/`staged_leads` tabloları soğuk e-posta dizisini, otomatik onayı ve model sınıflandırmasını besler — demo talebi körlemesine yazılmaz; izolasyon kodla (TASK-1.11), yerelde sorguyla (TASK-1.13), canlıda çalışma zamanında (TASK-1.18) kanıtlanır. Alıcı her hata yolunda JSON dönmeli (HTML hata sayfası "kaydedildi" okunur).
- Umami yoksa `window.umami?.track` sessiz geçer; kişisel veri olaya girmez; yük `perf.mjs` ile ölçülür (başlangıç 144/133 KB).
- `legal.ts` Aktarım + Çerezler maddeleri: TASK-1.10 Google e-tablo ve Umami'ye göre yazdı; revizyon sonrası kayıt yeri kendi sunucu, ölçüm kendi Umami → TASK-1.15. B-008 açık kalır.
- Vercel Hobby ticari kullanıma kapalı — bilinçli tercih (BULGULAR), F7.5'te yeniden.

### Teknik Kararlar

- **Aşama türetimi tek yerde:** `next.config.ts` `deployStage`'i hesaplar (`local | preview | production`), `env.NEXT_PUBLIC_DEPLOY_STAGE` ile gömer ve aynı değerle `headers()`'da noindex'i verir; `src/lib/stage.ts` yalnız okur. Gerekçe: iki ayrı yerde iki koşul drift'tir; `VERCEL_ENV` tek başına yanlış (yukarıda ölçüldü). Kayıt `docs/DECISIONS.md` (2026-09-11).
- **Lead alıcısı Bunker (revizyon 2026-09-13):** sitenin sözleşmesi korunur, e-posta site kaynaklı, alıcı yerel provadan canlıya taşınır, sözleşme paketi iki ortamda koşar. Gerekçe: gelen talep kaybolmaz (yedekli Postgres), satış takibi zaten orada, yeni tedarikçi yok. Kayıtlar `docs/DECISIONS.md` 2026-09-13.
- **Analitik kendi Umami + global dinleyici:** olay adları `demo-submit` / `whatsapp-click` / `phone-click`, tek özellik `surface`, etiket `data-tag=deployStage`; kişisel veri girmez. Kayıtlar `docs/DECISIONS.md` (2026-09-11 dinleyici, 2026-09-13 sağlayıcı).
- **noindex üç katman aynı kaynaktan:** başlık + robots.txt + metadata; F7.5'te alan adı bağlanınca üçü birden açılır, elle adım yok.
- **`.env.example` anahtar seti:** `LEAD_WEBHOOK_URL` (kimlik biçimi TASK-1.11; başlıkla taşınırsa yeni sır anahtarı), `LEAD_FILE_PATH` (yalnız yerel), `RESEND_API_KEY`, `DEMO_TO`, `DEMO_FROM`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, yerel prova anahtarları (TASK-1.17). Değer yok.
- **Milestone cümlesi 2026-09-13 plan revizyonunda değişti:** "Google Sheet'e satır" → "Bunker'da kayıt, otomasyon tetiklenmeden"; "analitik paneli" → "kendi Umami paneli".

---

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda dolduruldu (2026-09-11) ve **2026-09-13'te revize edildi**: TASK-1.04 iptal edildi (lead hedefi Bunker'a değişti). Sekiz task eklendi (keşif, test koşucusu, biçim doğrulaması, yerel prova, yerel alıcı, site bağlantısı, canlıya taşıma, yasal metin hizası); TASK-1.06 ve TASK-1.07 yeniden yazıldı, TASK-1.08/1.09 hizalandı. Gerekçeler `docs/DECISIONS.md` 2026-09-13. **Satır sırası çalıştırma sırasıdır**, numara sırası değil (TASKS-README → Lineer Çalıştırma). **verify-plan (2026-09-13):** sekiz mekanik düzeltme yapıldı. Kullanıcı onayıyla üç yapısal değişiklik girdi: TASK-1.11 izolasyonu Bunker'daki tüketici envanterine genişledi (gönderen/eylem yapan · rapor · KVKK silme; 1.13/1.17/1.18/1.06 buna bağlandı), yedek referansı `../altyapi/vps/CLAUDE.md`'ye düzeltildi ve TASK-1.12'nin lint kriteri B-028'e göre "yeni hata yok" oldu. Task sayısı ve sırası değişmedi.
>
> **Sıra değişikliği (2026-09-13, run-phase turu):** TASK-1.07 revizyonda başa alınmıştı, ağaçtaki commit'lenmemiş Umami farkını devralsın diye. Fark bu turda commit'lendi. Kapanış kullanıcı adımına (Umami'de site kaydı) bağlı kaldığı için task, orkestratör kararıyla 1.06'nın arkasına, bağımlıları 1.08 · 1.09 · 1.15'in önüne taşındı. Tanımı ve kriterleri değişmedi.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 1.01 | TASK-1.01 | ✅ Tamamlandı | Aşama türetimi (`local/preview/production`) ve `deployStage` tek kaynağı |
| 1.02 | TASK-1.02 | ✅ Tamamlandı | noindex üç katman (başlık + robots.txt + metadata), aynı aşama değerinden |
| 1.03 | TASK-1.03 | ✅ Tamamlandı | Vercel'de ayrı proje, env iskeleti, başlık ölçümü, GIT-STRATEJI güncellemesi |
| 1.04 | TASK-1.04 | ❌ İptal | Google Sheet lead alıcısı — hedef Bunker'a değişti (2026-09-13) |
| 1.05 | TASK-1.05 | ✅ Tamamlandı | Demo ucunu sertleştir: JSON `ok` doğrulaması + lead `env` alanı |
| 1.16 | TASK-1.16 | ⬜ Bekliyor | Test koşucusu Vitest; aşama ve `/api/demo` testleri kalıcı olur |
| 1.11 | TASK-1.11 | ⬜ Bekliyor | Bunker keşfi: giriş yolu, sözleşme, tüketici envanteri ve izolasyon, yedek gerçeği, yerel prova girdileri (keşif ayağı) |
| 1.12 | TASK-1.12 | ⬜ Bekliyor | İletişim biçimi doğrulaması (B-021) |
| 1.17 | TASK-1.17 | ⬜ Bekliyor | Yerel prova ortamı: compose profili, n8n + Postgres (Bunker şeması) |
| 1.13 | TASK-1.13 | ⬜ Bekliyor | Alıcıyı yerelde kur; sözleşme paketi ve seçim sorgusu izolasyonu |
| 1.14 | TASK-1.14 | ⬜ Bekliyor | Site bağlantısı (yerel): `toWebhook` kimlik biçimi, `.env.example`, `lead-sheet` kalıntısı silinir |
| 1.18 | TASK-1.18 | ⬜ Bekliyor | Alıcıyı canlıya taşı: yedek, canlı sözleşme, çalışma zamanı izolasyonu, Vercel env |
| 1.06 | TASK-1.06 | ⬜ Bekliyor | E-posta hattını aç ve önizlemeden uçtan uca canlı tur (Bunker + e-posta, otomasyon yok) |
| 1.07 | TASK-1.07 | ⬜ Bekliyor | Kendi Umami'ye site kaydı ve tracker — kod commit'li, kapanış kullanıcının site kaydına bağlı |
| 1.08 | TASK-1.08 | ⬜ Bekliyor | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` olayı |
| 1.09 | TASK-1.09 | ⬜ Bekliyor | Global tıklama dinleyicisi, `data-surface` çapaları, analitik yükü ölçümü |
| 1.10 | TASK-1.10 | ✅ Tamamlandı | Yasal metin: Aktarım ve Çerezler maddeleri (e-tablo tedarikçisi + çerezsiz ölçüm) |
| 1.15 | TASK-1.15 | ⬜ Bekliyor | Yasal metin hizası: kayıt yeri kendi sunucu, ölçüm kendi Umami |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Ölçümler

> Fazın yayın zinciri üzerinden alınmış ölçümleri. Rakam ve başlık listesi burada durur (QUALITY 6); icra detayı task dokümanlarında.

### Güvenlik başlıkları — Vercel yayın zinciri (TASK-1.03, 2026-09-11)

Adres `https://alpfitplus-web-v2.vercel.app`, dağıtım `1b1e464` (git kaynaklı, dal `main`). F7.2'nin F7.3'e devredilmiş kabul kriteri: başlıklar uygulamadan çıkıyor ve platform onları soymuyor.

| Başlık | Değer | Sonuç |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `SAMEORIGIN` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | ✅ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ tek değer |
| `X-Powered-By` | yok | ✅ (`poweredByHeader: false`) |

**Çift HSTS yok** — araştırmada beklenen çakışma gerçekleşmedi, Vercel kendi değerini eklemedi.

**Başlıklar önbellekten de geçiyor:** aynı beş başlık hem `x-vercel-cache: PRERENDER` (ilk istek) hem `HIT` (ikinci istek) yanıtında tam. QUALITY 2'nin "platform başlığı soyuyor, cache'ten baypas ettiriyor mu" sorusu ölçülerek kapandı.

### noindex üç katman — yayın zincirinde (TASK-1.03)

| Katman | Ölçüm | Sonuç |
|---|---|---|
| Başlık | `X-Robots-Tag: noindex, nofollow` — `/` ve `/sitemap.xml` | ✅ HTML-dışı yanıtta da var |
| `robots.txt` | `User-Agent: *` + `Disallow: /` | ✅ tam kapalı |
| HTML meta | `<meta name="robots" content="noindex, nofollow"/>` | ✅ |

Aşama `preview` türedi (üretim alan adı `.vercel.app` ile bitiyor). **Aşamanın `local` değil `preview` olduğunun kanıtı dağıtımın kendisidir:** `output` koşulu `VERCEL` sistem değişkenine bakıyor, o değişken tanımsız olsaydı standalone çıktı üretilir ve derleme yine ENOENT ile kırılırdı. Derlemenin geçmesi sistem env'lerinin derleme anında görünür olduğunu kanıtlıyor; proje ayarı da doğrudan okundu (`autoExposeSystemEnvs: true`). noindex'in açık olması bu ayrımı **tek başına gösteremez** — iki aşamada da kapalı olurdu (task dokümanının risk maddesindeki varsayım bu yönden eksikti).

### Diğer kalemler (TASK-1.03)

| Kalem | Ölçüm | Sonuç |
|---|---|---|
| Rota erişimi | `/`, `/ozellikler`, `/fiyat`, `/segmentler`, `/demo`, `/destek`, `/kvkk`, `/sitemap.xml` | 8/8 → 200 |
| Font önbelleği | `/fonts/inter-400-tr.woff2` → `public, max-age=31536000, immutable` | ✅ |
| `/api/demo` boş POST | 422 · `{"ok":false,"code":"missing",…}` | ✅ uç ayakta |
| TTFB (soğuk, ana sayfa) | 0,619 s | kayıt — eşik F7.4'te `perf.mjs` ile |
| v1 dokunulmadı | `https://alpfitplus.com/` → 200, `X-Robots-Tag` yok | ✅ |

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
