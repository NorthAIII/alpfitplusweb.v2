# Phase 1: Önizleme yayını, lead hattı ve analitik

**Durum:** ✅ Tamamlandı

<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Bir bölüm büyüyüp kırmızı çizgiye (~20k token) yaklaşırsa faz HÂLÂ AKTİFKEN `PHASE-N-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır, o dosya adı değildir) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-N · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Tamamlandıktan (✅) sonra bölme yasaktır; verify-phase ve review-phase fazı dondurmadan önce boyutu kontrol eder. -->

---

**Bölme çocukları** (faz hâlâ aktifken bölündü; parent bu fazın mini-index'idir):
`PHASE-1-KAPSAM.md` — kapsam-tartışması · `PHASE-1-ARASTIRMA.md` — araştırma-detayı · `PHASE-1-OLCUMLER.md` — ölçüm-detayı · `PHASE-1-UAT.md` — uat

---

## Genel Bilgiler

**Amaç:** v2'yi v1'den **ayrı** bir Vercel projesinde önizleme adresine çıkarmak; demo talebini gerçek bir hedefe (kendi sunucudaki v1 lead deposu, `lead.alpfitplus.com`) dayanıklı yazıp e-postayla bildirmek ve bu hattın sözleşmesini kalıcı testle korumak; üç dönüşüm olayını (demo gönderimi, WhatsApp tıklaması, telefon tıklaması) yüzey etiketiyle saymak. Bu faz ILKELER'in iki pazarlıksız maddesini ("gelen talep kaybolmaz", "ölçülebilirlik") bugün karşılanmayan hâlden çıkarır. v1 Vercel projesine ve `alpfitplus.com`'a dokunulmaz.

**Milestone:** v2 ayrı Vercel projesinde `vercel.app` önizleme adresinde ayakta ve `noindex`; önizlemeden gönderilen gerçek bir demo talebi v1'in lead deposunda (`lead.alpfitplus.com`, önizleme koleksiyonu) kayıt olarak düşüyor **ve** `DEMO_TO`'ya e-posta geliyor; üç olay yüzey etiketiyle kendi Umami panelinde görünüyor; güvenlik başlıkları önizleme adresinde ölçüldü; v1 projesine dokunulmadı.

> **Kapanış notu (review-phase, 2026-09-22):** Milestone'un iki doğrulama ayağı otonom kolda kapanmadı ve **kullanıcı gözünde kalmıştır** — (1) e-postanın `DEMO_TO`'da **gelen kutusuna mı spam'e mi** düştüğü (UAT #10), (2) Umami **panelinin arayüzünde** kaydın gözle görülmesi (UAT #16). İkisi de **kusur değil ölçüm-kanalı sınırıdır**: ürün tarafı ölçüldü (Resend `delivered` + DKIM hizası kanıtlı; olay/yüzey/etiket kırılımı panelin kendi okuma API'siyle teyitli — UAT #11-15). Kalanın evi kullanıcı gözlemidir; faz bunun için bekletilmedi (`verify-phase` Adım 7: o katmanı ölçen araç projede yok → kapsam-dışı). Milestone cümlesi olduğu gibi durur.

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

| Feature | Modül | Açıklama |
|---------|-------|----------|
| F7.3: Vercel'de ayrı proje ve önizleme yayını | M7-Yayın ve Altyapı | Repo Vercel'e bağlanır, env tanımlanır, `main` push önizlemeyi günceller; önizleme `noindex` |
| F3.2: Dayanıklı kayıt hedefi | M3-Lead Hattı | `LEAD_STORE_URL` + `LEAD_STORE_TOKEN` → v1'in lead deposu (PocketBase, `leads_preview`); site adaptörü yerel depo kopyasında kanıtlanır, canlıda tek istekle teyit edilir |
| F3.3: E-posta bildirimi | M3-Lead Hattı | Resend + `demo@alpfitplus.com`; site her talepte gönderir, alıcı göndermez; alan adı DNS'te doğrulanır |
| F7.4: Analitik olay sayımı | M7-Yayın ve Altyapı | Kendi Umami (`umami.kiwiailab.com`), çerezsiz; üç olay yüzey etiketiyle; sayfa ağırlığı ölçülür |

**Destek işleri (feature matrisi değişmez):** test koşucusu Vitest (M6 F6.1'in genişlemesi, TASK-1.16) ve yerel lead deposu kopyası (M7 F7.1'in genişlemesi, TASK-1.17) F3.2'ye hizmet eder.

---

## Kapsam Tartışması

> `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-11), iki kez revize edildi (2026-09-13, 2026-09-14).
>
> **Bölme çocuğu:** `PHASE-1-KAPSAM.md` — alınan kararların tam metni, kullanıcı tercihleri ve kapsam dışı listesi (kapsam-tartışması).

**Fazı belirleyen beş karar:**

- **Lead hedefi v1'in lead deposu** (PocketBase, `lead.alpfitplus.com`; önizleme `leads_preview`, geçişten sonra `leads`). Önce Google Sheet, sonra Bunker seçilmiş, ikisi de elenmişti — gerekçeler `docs/DECISIONS.md` 2026-09-13 ve 2026-09-14. Site adaptörü deponun **yerel kopyasına** karşı sınanır; v1'in depo kodu bu fazda değişmez.
- **E-postayı site gönderir**, alıcı göndermez — kayıt ve bildirim birbirinden bağımsız kalır (`docs/DECISIONS.md` 2026-09-13).
- **Analitik kendi Umami'de** (`umami.kiwiailab.com`), çerezsiz; ortam ayrımı `data-tag`, dar kapsam: yalnız üç dönüşüm olayı.
- **Önizleme açık adres + noindex** — şifre koruması yok (telefondan şifresiz bakılacak, form testi korumaya takılmayacak).
- **Test ve gerçek talep ayrımını token yapar:** kayıt `leads_preview`'a `env=preview` ile düşer; gövdedeki `env` depoya girmez, e-postadaki `Ortam:` satırında yaşar.

**Kapsam dışı bırakılanlardan bu fazı doğrudan ilgilendirenler:** alan adı geçişi ve 301 haritası (F7.5) · CI, tek komut ölçüm, iddia sızıntı denetimi (M6) · görsel ve mobil iyileştirme · metin tonu · lead hattı bulgularından **B-020, B-036 ve B-037** (bu faza yalnız B-021 alındı — revizyon kararı 2026-09-13) · üç dönüşüm olayı dışındaki olaylar. Tam liste çocukta.

---

## Araştırma Bulguları

> Bu bölüm `/devflow:research-phase` oturumunda dolduruldu (2026-09-11). Dört karar noktası kullanıcıya sunuldu ve seçildi; gerekçeler "Teknik Kararlar"da.
>
> **Bölme çocukları:** `PHASE-1-ARASTIRMA.md` — yaklaşım karşılaştırması (elenenler dâhil) ve ölçülmüş tuzakların tam listesi (araştırma-detayı).
>
> **Plan revizyonu (2026-09-13):** lead alıcısı (Apps Script → Bunker) ve analitik sağlayıcısı (Umami Cloud → kendi Umami) değişti. Gerekçeler `docs/DECISIONS.md` 2026-09-13, Apps Script'e özgü ayrıntılar iptal edilen `tasks/archive/TASK-1.04.md`'de.
>
> **Plan revizyonu (2026-09-14):** lead hedefi Bunker → v1'in lead deposu (PocketBase). Aşağıdaki seçimler güncel hâlleridir. Gerekçe `docs/DECISIONS.md` 2026-09-14, Bunker ölçümleri `tasks/archive/TASK-1.11-BUNKER-KESFI.md`'de.

### Değerlendirilen Yaklaşımlar (özet)

Tam karşılaştırma (elenen seçenekler, artı/eksi) → `PHASE-1-ARASTIRMA.md`. Seçilenler:

- **Lead hedefi:** v1'in lead deposu (revizyon 2026-09-14). `POST /lead` + `X-Lead-Token`; token koleksiyonu seçer; başarı `201 {id, prior_count}`. Sitenin `ok === true` kapısı tutmadığı için `toWebhook` yerine depo adaptörü yazılır (TASK-1.14); "`res.ok` başarı değildir" ilkesi korunur. Sözleşme yerel depo kopyasında paketle dondurulur (TASK-1.17, 1.13).
- **Analitik:** kendi Umami (`umami.kiwiailab.com`, revizyon) — çerezsiz, `data-tag` ile ortam ayrımı (kurulum sürümünün desteği TASK-1.07'de teyit). Vercel Web Analytics Hobby'de özel olay saymadığı için elendi; Plausible ücretsiz plan yok.
- **Olay bağlama:** layout'ta tek global tıklama dinleyicisi (`wa.me` / `tel:`) + bölümlere `data-surface`; demo gönderimi `DemoForm` başarı anında `track`. Kodda 15 WhatsApp + 5 telefon bağlantısı (12 dosya) olduğu için tek tek öznitelik elendi.
- **Ortam modeli:** `main` = production kalır; aşama (`local | preview | production`) `VERCEL_ENV` + `VERCEL_PROJECT_PRODUCTION_URL`'den türetilir — discuss'taki `VERCEL_ENV !== "production"` varsayımı ölçümde çürüdü (detay çocukta).
- **noindex:** üç katman aynı aşama değerinden — `X-Robots-Tag` başlığı, `robots.ts` disallow, `metadata.robots`.

### Kullanılacak Araçlar/Kütüphaneler (özet)

**Yeni npm bağımlılığı yalnız Vitest** (devDependency, kök `tests/`). Umami tracker kendi kurulumdan `next/script` ile (`afterInteractive`, `data-tag={deployStage}`, `data-domains` **kullanılmaz**); PocketBase lead deposu ve Resend düz `fetch` ile (SDK yok); `ip_hash` `node:crypto` HMAC. Aşama `next.config.ts` → `env` ile derlemeye gömülür, `src/lib/stage.ts` yalnız okur. **Tam liste (sürüm, öznitelik, env adı, sözleşme yolu, Vercel sistem env'leri) → `PHASE-1-ARASTIRMA.md` → Kullanılacak Araçlar/Kütüphaneler.**

### Dikkat Edilecekler (özet)

Tam liste ölçümleriyle → `PHASE-1-ARASTIRMA.md` → Dikkat Edilecekler. Plan-phase'i doğrudan etkileyenler:

- `VERCEL_ENV` tek başına önizlemeyi ayırmaz (main push = production); `env` alanı ve etiket `deployStage`'den yazılır.
- Resend DNS kayıtları (DKIM, `send` MX+SPF eu-west-1, DMARC katı) alan adında **zaten var**; kullanıcı yalnız panelde "Verified" teyit eder. `DEMO_FROM` tam `@alpfitplus.com` olmalı.
- Apex MX yok → `destek@`/`demo@alpfitplus.com` posta alamayabilir (Gelen Kutusu; faz dışı). `DEMO_TO` Google MX'li, etkilenmez.
- Demo talebi Bunker'a yazılmaz: `leads`/`staged_leads` soğuk e-posta otomasyonunu besler (TASK-1.11 ölçümü). Seçilen depo soğuk hattan kodla ve yedekle ayrık (koleksiyon kuralları `null`, Bunker ve n8n'de referans 0), çalışma zamanı izolasyon ölçümü gerekmez.
- Depoda `segment`, `consent`, `ua`, `at` kolonu yok; `env`'i token belirler (`production | preview`). v2'nin `main`'i Vercel production env'inde ama aşaması `preview` → alan adı geçişine kadar **iki ortama da önizleme token'ı** (TASK-1.18). `201` iki koleksiyonda aynı; hangi koleksiyona yazıldığı yalnız panelde görülür.
- Adaptör `stored`'ı yalnız `201` ile true yapar (`res.ok` ve `200 {ok:true}` başarı değildir). Depo `429` ve `413` (JSON olmayan gövde) ayrıca ele alınır; `ip_hash` hız sınırıyla aynı IP kaynağından türer (B-037 (1)).
- Umami yoksa `window.umami?.track` sessiz geçer; kişisel veri olaya girmez; yük `perf.mjs` ile ölçülür (başlangıç 144/133 KB).
- `legal.ts` Aktarım + Çerezler maddeleri: TASK-1.10 Google e-tablo ve Umami'ye göre yazdı; revizyon sonrası kayıt yeri kendi sunucu, ölçüm kendi Umami → TASK-1.15. B-008 açık kalır.
- Vercel Hobby ticari kullanıma kapalı — bilinçli tercih (BULGULAR), F7.5'te yeniden.

### Teknik Kararlar (özet)

Beş karar; **kalıcı kayıtları `docs/DECISIONS.md`'de** (tarihleriyle): **aşama türetimi tek yerde** — `next.config.ts` hesaplar, noindex/`env`/`data-tag` aynı değerden okur (2026-09-11) · **lead hedefi v1'in lead deposu**, sözleşme yerel kopyada dondurulur, canlıya tek teyit isteği (2026-09-14 revizyonu) · **analitik kendi Umami + global tıklama dinleyicisi**, olay adları v1 hizalı `demo-submit`/`whatsapp`/`phone`, tek özellik `surface` (2026-09-11 · 09-13 · 09-22) · **noindex üç katman aynı kaynaktan**, F7.5'te üçü birden açılır, elle adım yok · **`.env.example` anahtar seti** (`LEAD_STORE_URL`/`_TOKEN`, `IP_HASH_SALT`, `LEAD_FILE_PATH`, `RESEND_API_KEY`, `DEMO_TO`/`_FROM`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; **değer yok**). Milestone cümlesi iki revizyonda değişti (2026-09-13, 2026-09-14). **Gerekçelerin tam metni → `PHASE-1-ARASTIRMA.md` → Teknik Kararlar.**

## Task Listesi

> `/devflow:plan-phase` (2026-09-11) yazdı; **iki plan revizyonu** (2026-09-13 lead hedefi Bunker'a + analitik kendi Umami'ye; 2026-09-14 lead hedefi v1'in PocketBase deposuna) ve **iki verify-plan turu** (her birinde sekiz mekanik düzeltme) geçirdi. Net etki: TASK-1.04 iptal, sekiz task eklendi, altı task yeniden yazıldı; task sayısı ve sırası revizyonlarda değişmedi. Ayrıca iki **sıra değişikliği** orkestratör kararıyla yapıldı (1.07 ve 1.11, ikisi de kullanıcı adımına bağlı kaldığı için arkaya alındı — tanımları ve kriterleri değişmedi).
>
> **Gerekçelerin evi:** `docs/DECISIONS.md` (2026-09-13 · 2026-09-14 kayıtları) · icra ve oturum detayı arşivlenmiş task dokümanlarında (`tasks/archive/`) · Apps Script'e özgü ayrıntılar iptal edilen `tasks/archive/TASK-1.04.md`'de.
>
> **Satır sırası çalıştırma sırasıdır**, numara sırası değil (TASKS-README → Lineer Çalıştırma).


<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 1.01 | TASK-1.01 | ✅ Tamamlandı | Aşama türetimi (`local/preview/production`) ve `deployStage` tek kaynağı |
| 1.02 | TASK-1.02 | ✅ Tamamlandı | noindex üç katman (başlık + robots.txt + metadata), aynı aşama değerinden |
| 1.03 | TASK-1.03 | ✅ Tamamlandı | Vercel'de ayrı proje, env iskeleti, başlık ölçümü, GIT-STRATEJI güncellemesi |
| 1.04 | TASK-1.04 | ❌ İptal | Google Sheet lead alıcısı — hedef Bunker'a değişti (2026-09-13) |
| 1.05 | TASK-1.05 | ✅ Tamamlandı | Demo ucunu sertleştir: JSON `ok` doğrulaması + lead `env` alanı |
| 1.16 | TASK-1.16 | ✅ Tamamlandı | Test koşucusu Vitest; aşama ve `/api/demo` testleri kalıcı olur |
| 1.12 | TASK-1.12 | ✅ Tamamlandı | İletişim biçimi doğrulaması (B-021) |
| 1.11 | TASK-1.11 | ✅ Tamamlandı | Bunker keşfi: giriş yolu, sözleşme, tüketici envanteri ve izolasyon, yedek gerçeği, yerel prova girdileri (keşif ayağı) — kapandı (2026-09-14): hedef v1'in lead deposu (PocketBase), Bunker değil; kalan lead task'ları plan revizyonunda (`docs/DECISIONS.md` 2026-09-14) |
| 1.17 | TASK-1.17 | ✅ Tamamlandı | Yerel lead deposu: compose profili `lead`, v1'in PocketBase'i salt okunur bağlı |
| 1.13 | TASK-1.13 | ✅ Tamamlandı | Depo sözleşme paketi: adaptörün dayandığı davranış yerel depoya karşı kalıcı testte |
| 1.14 | TASK-1.14 | ✅ Tamamlandı | Kayıt adaptörü: `toWebhook` → `toStore`, `ip_hash`, yerel uçtan uca tur, `lead-sheet` kalıntısı silinir |
| 1.18 | TASK-1.18 | ✅ Tamamlandı | Canlı depo bağlantısı: Vercel env (önizleme token'ı) ve token → `leads_preview` teyidi |
| 1.06 | TASK-1.06 | ✅ Tamamlandı | E-posta hattını aç ve önizlemeden uçtan uca canlı tur — `RESEND_API_KEY` üretildi ve girildi, tek talep depoya + gelen kutusuna ulaştı |
| 1.07 | TASK-1.07 | ✅ Tamamlandı | Kendi Umami'ye site kaydı ve tracker — v2 kaydı API ile açıldı (`640b05f1-…`), yayın yüzeyi `data-tag="preview"` ile sayıyor; panel görünümü UAT'a |
| 1.08 | TASK-1.08 | ✅ Tamamlandı | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` olayı |
| 1.09 | TASK-1.09 | ✅ Tamamlandı | Global tıklama dinleyicisi, `data-surface` çapaları — panelde yüzey görünürlüğü UAT'a |
| 1.10 | TASK-1.10 | ✅ Tamamlandı | Yasal metin: Aktarım ve Çerezler maddeleri (e-tablo tedarikçisi + çerezsiz ölçüm) |
| 1.15 | TASK-1.15 | ✅ Tamamlandı | Yasal metin hizası: kayıt yeri kendi sunucudaki lead deposu (Almanya/Nürnberg, 12 ay, yalnız yetkili yönetici okur), ölçüm aynı sunucudaki kendi Umami; Google adı veri akışından çıktı |
| 1.19 | TASK-1.19 | ✅ Tamamlandı | **UAT düzeltmesi (Senaryo #26):** satır sonu ayıklama — kulüp adındaki `\n` e-posta konusuna geçiyor, mesaja sahte `Segment:` satırı yazılabiliyor |
| 1.20 | TASK-1.20 | ✅ Tamamlandı | **UAT düzeltmesi (Senaryo #33, B-041):** üç yasal sayfanın HTML meta katmanı aşama türetimini atlıyor, canlı önizlemede `index, follow` — sabit değer kaldırıldı, kök layout'tan miras alınıyor |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Ölçümler

> Fazın yayın zinciri üzerinden alınmış ölçümleri (QUALITY 6). **Tam tablolar ve gerekçeler → `PHASE-1-OLCUMLER.md`** (ölçüm-detayı); icra detayı task dokümanlarında. Yeni ölçüm çocuğa yazılır, aşağıdaki satır birlikte güncellenir.

| Ölçüm | Ne zaman | Sonuç (özet) |
|---|---|---|
| Güvenlik başlıkları — Vercel yayın zinciri | TASK-1.03, 2026-09-11 | ✅ altı başlık uygulamadan çıkıyor, platform soymuyor; çift HSTS yok; önbellekten de geçiyor |
| noindex üç katman | TASK-1.03, 2026-09-11 | ✅ başlık + `robots.txt` + meta; aşama `preview` türedi |
| Diğer kalemler (rota, font önbelleği, uç, TTFB, v1) | TASK-1.03, 2026-09-11 | ✅ 8/8 rota 200; TTFB 0,619 s (soğuk); v1'e dokunulmadı |
| Canlı lead deposu bağlantısı | TASK-1.18, 2026-09-14 | ✅ token → `leads_preview`; `leads` temiz; env üç anahtar × iki ortam |
| **Uçtan uca lead hattı — önizleme yüzeyinden** | **TASK-1.06, 2026-09-21** | ✅ tek talep: uç `200 stored:true mailed:true` · depo `leads_preview` 12→**13** (`notify_team=sent`) · Resend **`delivered`** · `Ortam: preview` |
| Analitik yükü — ClickTracker + Umami betiği | TASK-1.09, 2026-09-22 | ✅ `perf.mjs` ana sayfa 144/133 KB, LCP 96 ms, CLS 0,005 — baseline'la birebir, regresyon yok; Umami betiği 2,56 KB gzip + bir olay isteği 0,74 KB gzip (CDP ağ kaydı, izole konteyner) |

---

## UAT Sonuçları

> `/devflow:verify-phase` oturumlarında dolduruldu (iki tur).
>
> **Bölme çocuğu:** `PHASE-1-UAT.md` — 34 senaryonun tam tablosu ve otomatik kontrol dökümü (uat).

**Tarih:** 2026-09-22 (2. tur — TASK-1.19 ve TASK-1.20 sonrası yeniden koşum; tüm kontroller baştan)
**Toplam Senaryo:** 34 | **Geçen:** 32 | **Kalan:** 2 — ikisi de `❌ doğrulanamadı`, **düzeltme task'ı doğurmadı**

**1. tur (aynı gün):** 33 senaryo / 29 geçti → iki düzeltme task'ı (TASK-1.19 satır sonu enjeksiyonu, TASK-1.20 yasal sayfaların noindex meta'sı). 2. turda küme 34'e çıktı (sınıf varyantı #34 eklendi) ve ikisi de kapandı.

**Ölçüm yüzeyi:** canlı önizleme (`alpfitplus-web-v2.vercel.app`, dağıtım `m36cv17lv` = `af579d3`), canlı lead deposu (SSH, salt okunur sqlite), Resend API, kendi Umami'nin okuma API'si, `web` konteynerinde Vitest, araştırma konteynerinde Playwright + CDP, HEAD'ten derlenen izole üretim imajı (3200, ölçüm sonrası silindi) ve beş kapı betiği.

**Açık kalan iki senaryo — ikisi de otonom kolda ölçülemez, kullanıcı gözü bekler:**

| # | Senaryo | Neden kapanmadı |
|---|---------|-----------------|
| 10 | E-posta gelen kutusuna düşüyor (spam değil) | Yerleşim API'den ölçülemez; gönderim tarafı Resend **`delivered`** + DKIM hizası kanıtlı |
| 16 | Umami **panelinde gözle**: sayfalar, üç olay ve yüzey kırılımı | Veri katmanı panelin kendi okuma API'siyle teyitli (#11-15); **arayüzün** gözle görülmesi kullanıcıya ait |

**Otomatik kontroller (Adım 1) — özet:** CI/CD projede yok (`.github/` yok); Vercel'de son dağıtım `m36cv17lv` **Ready** ve listedeki 14 dağıtımın hepsi Ready, kırmızı yok. `npm audit` → **0 açık**; `npm outdated` → 9 paket geride (kapsam dışı, kanvasta). Faz penceresi güvenlik taraması (`85c0353^..HEAD`, 205 dosya) **yeni doğrulanmış bulgu üretmedi** — gözlenen iki zayıflık faz-öncesi koddan gelir ve kanvasta kayıtlıdır (B-037 (2) · B-020). Sınıf süpürmesi (1d): fazın tanıttığı dört kapının dördünde de **atlayan çağrı sitesi yok**. Kanvas süpürmesi (1d): faza dokunan sekiz Gelen Kutusu notu incelendi, mezuniyet çıkmadı. Tam döküm → `PHASE-1-UAT.md`.

---

## Retrospektif

### Ne İyi Gitti?

- **Varsayım dört kez ölçümle çürütüldü ve dördü de yazıya geçti.** `VERCEL_ENV !== "production"` (kapsam kararıydı; olduğu gibi kodlansaydı önizleme Google'a açılırdı) · `performance…transferSize`'ın çapraz-kökende sessizce 0 dönmesi · `docker compose exec … printenv`'in çalışan uygulamanın env'ini göstermemesi · Umami'nin bot kontrolünün sahte yeşili. Her biri bir task'ın kabul kriterini ya da ölçüm yöntemini değiştirdi.
- **"Yeşil kırmızıya dönebiliyor mu?" kontrolü UAT'ın yerleşik ayağı oldu.** 34 senaryonun çoğu kendi ters-kontrolünü taşıyor: çereze elle yazılınca API'nin 1 döndüğü (#17), `data-exclude-search` `false`'a çevrilince yükün sorgu dizesini gerçekten taşıdığı (#18), sahte `window.umami` enjekte edilince `track`'in çağrıldığı (#19), v1'in sayıları sabitken v2'ninkilerin hareket ettiği (#32). Kör probun sahte yeşili bu fazda hiç kabul edilmedi.
- **Tek kavram dört tüketiciyi besledi.** `deployStage` noindex'in üç katmanını, lead kaydının `env` alanını ve Umami'nin `data-tag`'ini aynı değerden türetiyor — alan adı bağlanınca üçü birden kendiliğinden açılır, yayın günü elle çevrilecek bayrak kalmadı.
- **Keşif task'ı yanlış hedefe kod yazılmadan önce durdurdu.** TASK-1.11 Bunker'ı ölçtü, `alpfit` kiracısının canlı soğuk kampanyayı taşıdığını gördü ve hedef değişti; adaptörün kendisi o noktada henüz yazılmamıştı.
- **Faz dokümanı dört kez yaşarken bölündü** (`PHASE-1-OLCUMLER` · `PHASE-1-ARASTIRMA` · `PHASE-1-KAPSAM` · bu turda `PHASE-1-UAT`) — "tarihsel doküman yaşarken bölünür" kuralı bu fazda dört kez fiilen çalıştı, hiçbiri dondurulmuş dokümana dokunmadı.
- **ILKELER'in iki pazarlıksız maddesi karşılanmayan hâlden çıktı.** "Gelen talep kaybolmaz": önce dayanıklı kayıt, sonra e-posta, hedefsizse dürüst `503` + WhatsApp yolu — canlı önizlemeden uçtan uca kanıtlandı. "Ölçülebilirlik": üç olay yüzey etiketiyle canlıda sayılıyor. Kümülatif test altyapısı da sıfırdan doğdu (Vitest, 5 dosya / 66 PASS).

### Ne Kötü Gitti?

- **Lead hedefi üç kez değişti** (Google Sheet → Bunker → v1'in PocketBase deposu): bir task tamamen iptal (1.04), beş task yeniden yazıldı, iki plan revizyonu + iki ek verify-plan turu. Kök neden: hedef, **mekanizması ve erişilebilirliği ölçülmeden** kapsam tartışmasında seçildi; ölçen keşif (TASK-1.11) planın ortasına düştü. Belge-düzeyi araştırma iki gerçeği göremedi — Apps Script'in o Google hesabında dağıtılamadığını ve Bunker `alpfit` kiracısının canlı soğuk kampanya sahibi olduğunu.
- **Kullanıcının panel adımları koşumu üç kez durdurdu.** TASK-1.06 `RESEND_API_KEY` için bir tam tur bekledi; TASK-1.07 önce Umami site kaydı için sıradan çıkarıldı, sonra aynı task geçersiz parolayla ikinci kez durdu. Çözüm (anahtar kasası + panel adımlarının servis API'sine çevrilmesi) faz **ortasında** doğdu — bedeli ondan önce ödendi.
- **UAT iki tur koştu ve iki düzeltme task'ı doğurdu** (1.19, 1.20). İkisi de tekil bug değil **sınıf hatasıydı**: "tek satırlık alanlarda kontrol karakteri ayıklanmıyor" ve "aşama türetimini atlayan sabit değer". İkisini de task'ın kendi testi değil, verify'ın sınıf süpürmesi yakaladı. TASK-1.20 özellikle öğretici: `tests/stage.test.ts`'in beş yeşil senaryosu saf fonksiyonu ölçüyordu, kusur ise üç sayfanın o fonksiyonu **hiç çağırmamasıydı**.
- **Bayat üretim konteyneri ölçümleri iki kez geçersiz kıldı** (3100, B-019). `perf.mjs` ve `font-guard.mjs` oraya bakıyor ve imaj son dört task'ın kodunu taşımıyordu; her ölçüm için HEAD'ten taze imaj derlemek gerekti. Kapı betiklerinin hedefi "yerel üretim konteyneri" kaldığı sürece bu her fazda tekrarlanacak.
- **Kapıların kendisi kırmızıya dönemiyor** (B-030): beş kapının dördü eşik altında bile çıkış kodu 0 veriyor. Bu fazın bütün "yeşil" ölçümleri **elle okunan** çıktılara dayandı; sessiz bir regresyon geçebilirdi.

### Sonraki Faz İçin Öneriler

- **UI 🔴 kümesi mobil onay ekranıyla birlikte ele alınsın.** B-032 (ölçülmüş AA ihlalleri) · B-033 (320 px'te içerik kaybı) · B-034 (mobilde 24 px ana çağrı) · B-031 (a11y kör noktaları) · **B-055** (demo formunun gönderim sonrası hâli 320/360'ta ekran dışında). Sonuncusu bu fazın kendi yüzeyine dokunuyor: uç `200 {stored:true}` dönse bile ziyaretçi onayı görmeyebiliyor. Küme "Yayın öncesi düzeltmeler" fazının **kapsam tartışmasına** girsin — karar o fazındır (kullanıcı yönü: "önce işleri bitirelim, sonra arayüzü geliştiririz").
- **Uçtan uca dikiş: ekran onayı + onay e-postası birlikte değerlendirilsin.** v2 talep sahibine e-posta göndermiyor (v1 gönderiyor — B-059) ve mobilde ekran onayı da görünmeyebiliyor (B-055). İkisi üst üste gelirse ziyaretçi talebinin ulaşıp ulaşmadığını **hiçbir kanaldan** öğrenemez. Bugün risk önizlemeyle sınırlı (canlıyı hâlâ v1 sunuyor); alan adı geçişinde gerçek olur.
- **Alan adı geçişinde üç env değeri tek kontrol listesinde tutulsun** — `LEAD_STORE_TOKEN` (üretim token'ı; unutulursa gerçek talepler `leads_preview`'a düşer ve API bunu **söylemez**, `201` iki koleksiyonda aynı), `IP_HASH_SALT` (v1'in değeri, `ip_hash` sürekliliği), `NEXT_PUBLIC_UMAMI_WEBSITE_ID` (v1'in `alpfitplus.com` kaydı). Üçü de `modules/M7-Yayin-ve-Altyapi.md` F7.5 Edge Case'lerinde yazılı; o fazın UAT'ında **senaryo** olsunlar.
- **🔴 B-058 geçişten önce kapansın** — `.dockerignore` `.env`'i dışlamıyor, beş sır üretim imajı katmanında; kullanıcı kararı bekliyor (imaj dışarı çıktıysa anahtar döndürme sorusu).
- **Kapılar kırmızıya dönebilir hâle gelene kadar "yeşil" bir iddiadır** (B-030). "Kalite kapıları otomatik" fazı bunu kapatana dek her faz kapanışı ölçüm çıktısını elle okumak zorunda — bunu faz planlamasında süre olarak hesaba kat.

### Task-Spesifik Teknik Öğrenimler

- **Umami'nin bot kontrolü sahte yeşil verir.** `HeadlessChrome` UA'lı istemcide `POST /api/send` **200** döner ama kayıt yazılmaz; gerçek ölçüm gerçek bir UA + `sessionId`/`visitId` ister. Üç ölçüm turu bu yüzden "gönderildi ama panelde yok" okudu.
- **`performance.getEntriesByType("resource").transferSize` çapraz-kökende sessizce 0 döner** — `umami.kiwiailab.com` `Timing-Allow-Origin` taşımıyor. Gerçek tel-üzeri bayt ancak CDP `Network.loadingFinished` → `encodedDataLength` ile okunur (ölçüm: Umami betiği 2,56 KB gzip, bir olay isteği 0,74 KB).
- **`perf.mjs`'in 144 KB'ı toplam sayfa ağırlığı değil.** Aynı sayfa CDP teliyle **447 KB** ölçüldü (UAT 2. tur). Rakam regresyon kıyası için tutarlı ama **mutlak ağırlık olarak okunamaz** — B-035'in taze doğrulaması.
- **Umami 3.1.0 parola sıfırlama aracı taşımıyor.** `package.json` `change-password` betiğine işaret ediyor ama betik ne kaynak ağacında ne çalışan konteynerde var; tek uç `POST /api/me/password` ve `currentPassword` istiyor (döngüsel), yönetici rotası yok. Parola kaybı = panele kalıcı giriş kaybı. (Parola bu fazda kurtarıldı ve kasada güncel.)
- **`vercel redeploy --yes` bu CLI sürümünde geçersiz** (`redeploy` alt komutu yok); ayrıca CLI kimliği `$XDG_DATA_HOME/com.vercel.cli` altında durduğu için değişken tanımsızken oturum "giriş yapılmamış" görür.

### DevFlow'a Öneri

- **Dış hedef/sağlayıcı seçimine "erişim ve sahiplik probu" eklensin** (`research-phase`, Dikkat Edilecekler'in bir kalemi olarak). Bu fazda lead hedefi üç kez değişti ve her iki iptal de **belge-düzeyi araştırmanın göremeyeceği** bir gerçekten doğdu: seçilen hedefe bu projenin **gerçek hesabında bugün yazılabiliyor mu** (Apps Script dağıtılamadı) ve **o hedefe başka kim dokunuyor** (Bunker `alpfit` kiracısı canlı soğuk kampanya sahibiydi). `research-phase` bugün yaklaşımları belgeye göre karşılaştırıyor ve ölçüm **katmanını** karar noktası yapıyor (Adım 2'nin "çekirdek etkileşimi hangi katman ölçüyor" maddesi) — ama hedefin **erişilebilirliğini ve sahipliğini** sormuyor. İki satırlık bir prob, bu fazda iki plan revizyonu + bir iptal task'ı maliyetindeydi. *(Ters-çevirme kontrolü için öneri yazılmadı — motor bunu `verify-phase` Adım 5b'de zaten tanımlıyor, ölçüldü.)*

---

## Kalite Kontrol Sonuçları

> `QUALITY.md`'nin **on ekseni** (sekiz standart + iki projeye özgü: 8 Dönüşüm, 9 Ölçülebilirlik, 10 İddia Uyumu). Güvenlik ekseni faz-penceresi diff'i üzerinde değerlendirildi (`85c0353^..HEAD`, 205 dosya / 50 commit; ürün kodu 33 dosya, +1.932/−68 satır).

| # | Eksen | Durum | Not |
|---|-------|-------|-----|
| 1 | Modülerlik | ✅ | Fazın tanıttığı dört kapının dördü de tek evde ve **atlayan çağrı sitesi yok** (ölçüldü, 1d): `robots:` anahtarı kök `layout.tsx` dışında 0 · `window.umami` doğrudan çağrısı `analytics.ts` dışında 0 · iletişim doğrulaması `lib/contact.ts` dışında 0 · `cleanLine()` altı tek satırlık alanın altısında (`message` bilinçli dışarıda). `deployStage` saf fonksiyon + tek okuma sabiti. ⚠ Faz-öncesi kalıntı: `global-error.tsx` WhatsApp adresini elle yazıyor (kanvasta) |
| 2 | Güvenlik | ⚠️ | **Ölçülen olumlular:** yapılandırma eksikse depoya istek hiç gitmiyor (fail-closed, #21) · ham IP hiçbir yere yazılmıyor, yalnız tuzlu HMAC · bal küpü (#22) · hız sınırı + sahte `X-Forwarded-For` atlatılamıyor (#23, #25) · sırlar istemci paketinde 0 (676.572 bayt JS tarandı, #27) · başlık enjeksiyonu kapandı (#26, #34) · log'a URL/token/`ip_hash`/kişisel veri girmiyor · 8 sn/3 sn zaman aşımları · altı güvenlik başlığı önbellekten de geçiyor (#4). **Açık kalan 🔴'ler kanvasta ve bu fazın kapsam kararıyla dışarıda:** B-058 (`.env` üretim imajında, kullanıcı kararı bekliyor) · B-037 (`content-type` kontrolsüz — depo gerçek hedef olunca çapraz-site POST **artık satır yazıyor**; ağırlaşma kanvasta kayıtlı) · B-020. Faz penceresinde **yeni** doğrulanmış bulgu yok |
| 3 | Bakım Maliyeti | ✅ | Konfigürasyon env'de, `.env.example` 15 anahtar / 0 değer. Kod yorumları karar çapası taşıyor (DECISIONS tarihi + task no + "Karar Noktası" etiketi) — altı ay sonra "neden böyle" sorusu dokümana gitmeden cevaplanıyor. Depo sözleşmesi 342 satırlık testte donduruldu (v1'de hook değişirse kırmızıya döner). ⚠ Karşı ağırlık: `npm run lint` kırık ve ona ulaşan otomatik yol yok (B-028), 9 paket geride (ikisi de kanvasta) |
| 4 | Performans | ✅ | `perf.mjs` **HEAD'ten derlenen taze** üretim imajına karşı: ana sayfa 144 KB / 133 KB — başlangıç çizgisiyle **birebir**; LCP 100 ms / 64 ms (çizgi 96 ms), CLS 0,004 / 0. Umami betiği 2,56 KB gzip + bir olay 0,74 KB (CDP, gerçek tel). `afterInteractive`, analitik LCP'yi geciktirmiyor. ⚠ Çizginin kendisi tartışmalı (B-035 — `perf.mjs` JS/CSS'e kör); bu yüzden betik yükü ayrıca CDP ile ölçüldü |
| 5 | Hata Yönetimi | ⚠️ | Kod tarafı dürüst: hedefsiz/düşmüş zincirde `503 no-sink` + WhatsApp/telefon yolu, "ulaştı" denmiyor, `track` çağrılmıyor, `role=alert` (#20); deponun `429`'u uca taşınıyor; `notify_team` PATCH'i başarısız olsa ziyaretçinin yanıtı değişmiyor; ağ hatası/zaman aşımı ele alınıyor. ⚠ **Görünürlük tarafı açık:** B-055 (mobilde 320/360'ta başarı **ve** hata ekranı görünmüyor) · B-025 (çalışma zamanı alarmı yok — depo düşerse ekip ayırt edilemeyen bir posta alır) · B-036 (üç sessiz kayıp yolu) |
| 6 | Test Kapsamı | ✅ | Faz test altyapısını **sıfırdan** kurdu: Vitest + 5 dosya / **66 PASS** + 1 skipped (aşama türetimi · `/api/demo` sözleşmesi · iletişim · analitik · ClickTracker), artı yerel depoya karşı 342 satırlık sözleşme paketi. Beş kapı betiği yeşil. ⚠ Boşluklar: CI yok (F6.3), sözleşme paketi env kapılı ve varsayılan koşumda **atlanıyor**, yasal beyanları koruyan test yok (B-060). Ayrıca saf-fonksiyon testi sınıf hatasını göremiyor — TASK-1.20 bunun kanıtı |
| 7 | Erişilebilirlik | ⚠️ | Fazın tanıttığı yüzeyler temiz: `a11y.mjs` 8 rotada **TOPLAM SORUN 0**, `mobile-audit` 9/9 rotada yatay kaydırma yok, ClickTracker görünmez bir dinleyici (yeni odak/rol yüzeyi açmıyor), form hata mesajları `role=alert`. ⚠ Eksen **faz-öncesi 🔴'ler taşıyor**: B-032 (ölçülmüş AA ihlalleri 2,54:1 / 3,48:1 — ILKELER "pazarlıksız" diyor) · B-033 · B-034 · B-031 (kapının kendi kör noktaları) · B-012 (16 rotanın 8'i taranıyor) |
| 8 | Dönüşüm | ⚠️ | Huninin **sunucu tarafı** bu fazda sağlamlaştı: talep artık dayanıklı bir yere yazılıyor, e-posta ikincil, hedefsizse dürüst hata + WhatsApp. Uçtan uca canlı tur `200 {stored:true, mailed:true}` ile kanıtlandı. ⚠ **Ziyaretçi tarafı açık:** B-055 (onay ekranı mobilde görünmüyor) · B-020 (beş kez hata yapanın düzeltilmiş talebi `429`) · B-054 (ulaşılamaz numara `stored:true` alıyor) · B-022 (mobilde ilk ekranda dönüşüm yüzeyi yok) |
| 9 | Ölçülebilirlik | ✅ | Fazın ikinci amacı: hiç izleme yokken üç dönüşüm olayı yüzey etiketiyle **canlıda** sayılıyor (`demo-submit`/`whatsapp`/`phone` × `surface`, `data-tag=preview`). Yeni eklenen her `wa.me`/`tel:` bağlantısı global dinleyiciyle otomatik sayılır — QUALITY 9'un "yeni yüzey ölçümüyle gelir" maddesi yapısal olarak karşılandı. Çerez 0, kişisel veri 0 (#17, #18). ⚠ `fiyat` yüzeyi sözlükte tüketicisiz (kanvasta); reklam engelleyici kaybı bilinçli kabul |
| 10 | İddia Uyumu | ✅ | Faz yeni iddia üretmedi; yasal metin **gerçekle** hizalandı (canlı önizlemede `/kvkk`: Nürnberg 2 · "12 ay" 4 · Umami 2 · Almanya 2; üç sayfada `Google`/"elektronik tablo"/"e-tablo"/"en fazla iki yıl" → **0**). Pilot cümlesi ve fiyat tek kaynaktan; yasaklı iddia kalıbı 0. ⚠ Faz-öncesi açıklar kanvasta ve "Yayın öncesi düzeltmeler" fazının konusu (B-029, B-018, B-050, B-014) |

**Kullanıcı yolculuğu ve boşluk tespiti (Adım 3b):** Önizleme yüzeyinde akış uçtan uca tutarlı — ziyaretçi siteyi açıyor, formu dolduruyor, uç `200` dönüyor, kayıt depoda, bildirim ekipte, olay panelde. **Tespit edilen tek gerçek dikiş** yukarıda "Sonraki Faz İçin Öneriler"in ikinci maddesidir: ekran onayı (B-055) ve onay e-postası (B-059) **ikisi birden** ziyaretçiye kapalı olabiliyor; iki ayak ayrı ayrı kanvasta ama birleşimi hiçbir atomda yazılı değil — `BULGULAR.md` Gelen Kutusu'na `[PHASE-1]` işaretli tek satır düşüldü.

---

**Oluşturulma:** 2026-09-11
