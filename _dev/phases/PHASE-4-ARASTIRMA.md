# Phase 4 — Araştırma Bulguları

← PHASE-4 · araştırma-detayı

> `_dev/phases/PHASE-4.md` → Araştırma Bulguları'nın bölme çocuğudur (plan-phase boyut ölçümü, 2026-09-26; faz **hâlâ aktifken** bölündü — task listesi yazıldığında parent 21.568 token ile kırmızı çizgiyi aştı, kesim noktası kullanıcıyla seçildi). Parent'ta seçilen yaklaşımların, devralınan daralmaların, sıra şartlarının **self-yeten özeti** ve **Teknik Kararlar**'ın tam metni durur; **research-phase'in tam kaydı — değerlendirilen yaklaşımların karşılaştırması, kullanılacak araçlar, adres envanteri tablosu, parite ve yüzey ölçümleri, sıra şartlarının gerekçeleri ve ölçüm katmanı — buradadır.**
>
> Task dokümanları rakamları, tabloları ve tuzakları buradan okur; faz review'ı (`review-phase`) araştırma ↔ sonuç karşılaştırmasını buradan yapar.

---

> `/devflow:research-phase` oturumunda dolduruldu (2026-09-26). Ölçümler v1 canlısına (`alpfitplus.com`), v2 önizlemesine (`alpfitplus-web-v2.vercel.app`), yayın kopyasına (3100), Umami'ye ve Vercel API'sine (yalnız okuma) karşı yapıldı. Yedi karar noktası kullanıcıyla alındı; `(kullanıcı)` işaretliler onlardır.

### Değerlendirilen Yaklaşımlar

- **Alan adı taşıma.** (a) Panelden sök-tak: iki adım arasında alan adı hiçbir projede değildir. (b) **Vercel'in "proje alan adını taşı" ucu** — `POST /v1/projects/{kaynak}/domains/{alan}/move`, gövde `projectId` (+ isteğe bağlı `redirect`, `redirectStatusCode` ∈ 301/302/307/308); belgeye göre apex'e yönlenen kayıtlar (`www`) aynı çağrıyla taşınabilir, geri dönüş aynı çağrının tersidir. `vercel api` komutuyla erişildi (kimlikli; v1 `alpfitplus-website` ve v2 **aynı takımda**, `north-ai`). **Seçilen: (b).**
- **301 üretimi.** Next'te `permanent: true` → **308** (belge; v1'in `/404.html`'i canlıda da 308), 301 için ayrı `statusCode: 301` alanı gerekir. Next'in eğik-çizgi çevrimi derleme çıktısında (`.next/routes-manifest.json`, 3100) `priority: true` bir **iç kural** (308) ve özel kuralların **önünde** — ölçüldü. (a) Varsayılan + v1'e özgü 301 kuralları → eğik çizgili her biçim iki atlama (308 → 301); v1 site haritasındaki `/en/` dahil. (b) **`skipTrailingSlashRedirect: true` + kendi 301 kurallarımız** — önce `/en/*` ve varlık kuralları, sonra genel `/:path+/` → `/:path+` ve `/:path*/index.html` → `/:path*` → her biçim tek atlama. **Seçilen: (b)** (kullanıcı).
- **CSP.** (a) nonce + proxy — belge: *"all pages must be dynamically rendered … Static optimization and ISR are disabled … cannot be cached by CDNs"*; (b) deneysel SRI — Next'in satır içi RSC betiklerini kapsamaz; (c) **başlıkta sabit politika + `'unsafe-inline'`** — v1'in canlıdaki politikasının birebir paritesi, statik üretimi korur. **Seçilen: (c).**
- **B-065 (hidrasyonsuz form).** (a) Düğme hidrasyonla etkinleşir + `<noscript>` çağrısı — küçük, ama hidrasyon hiç olmazsa düğme ölü kalır. (b) **Native POST:** `<form method="post" action="/api/demo">`, uç form kodlamasını da kabul eder ve 303 ile sonuç sayfasına yönlendirir; JS varken bugünkü `onSubmit` + `fetch` yolu değişmez. **Seçilen: (b)** (kullanıcı) — hidrasyonsuz her hâlde (JS kapalı, eklenti, hata, yanlış bir CSP kuralı) talep yine kayda düşer.
- **Fonksiyon bölgesi.** Proje ayarı (`resourceConfig.functionDefaultRegions`, bugün `["iad1"]`) · rota başına `preferredRegion` · **depoda `vercel.json` → `regions: ["fra1"]`**. **Seçilen: depo** — yasal metnin bölge cümlesini çivileyen test (dal 8) yalnız depoyu görebilir; panel ayarı değişip metin eskide kalsa test yeşil kalırdı.
- **Dal önizlemesinin koruması.** (a) **Girişli kalır** (bugünkü `ssoProtection: all_except_custom_domains`), (b) kapatılır ve bugünkü gibi herkese açık + üç katman `noindex`. **Seçilen: (a)** (kullanıcı) — paylaşılacak yüzey artık canlı site; çalışan formu olan açık bir önizleme spam yüzeyidir.
- **Geçişin ölçüm kanalı.** (a) Elle `curl`; (b) **geçiş doğrulama betiği** (↓ Dikkat Edilecekler → Ölçüm katmanı). **Seçilen: (b)** (kullanıcı).

### Kullanılacak Araçlar/Kütüphaneler

- **Yeni npm bağımlılığı yok.**
- `vercel api` (Vercel CLI 59.26.0, beta) — alan adı taşıma, env hedeflerini ayırma, proje ayarı okuma. Kimlik yolu: `memory/vercel-proje-kimlikleri.md`.
- `vercel.json` (yeni, yalnız `regions`). `vercel.ts` önerilen biçim ama `@vercel/config` bağımlılığı ister; tek alan için gereksiz.
- **Geçiş doğrulama betiği** (yeni, `research/scripts/`) — araştırma konteynerinde, hedef `BASE` ile.
- Playwright `securitypolicyviolation` dinleyicisi — CSP ihlalini 16 rota + etkileşim (asistan, form gönderimi, WhatsApp) üzerinde saymak için.

### Dikkat Edilecekler

**Devralınan daralmaların ölçümü**

- **"v1'in canlı adres kümesi bugün 27" → ÇÜRÜDÜ; küme 45 ayrık kalem + her sayfanın iki biçimi.** Canlıdan çıkarıldı (robots → site haritası → 20 sayfanın `href`/`src`/`content` beyanları → manifest; 2026-09-26). B-043'ün saymadıkları: manifest ve üç ikonu, ürün görselleri, yazı tipleri, `/404.html`, eğik çizgili ve `/index.html` biçimleri. Umami (v1 kaydı, 2026-07-01 → bugün) gerçek ziyaretçilerin eğik çizgili biçimleri kullandığını gösteriyor (`/demo/`, `/fiyat/`, `/en/privacy/`, `/kvkk/`…).

  | Grup | Adresler | v1 | v2 bugün | Hedef |
  |---|---|---|---|---|
  | TR sayfa (9) | `/` `/demo` `/destek` `/fiyat` `/gizlilik` `/kullanim-kosullari` `/kvkk` `/ozellikler` `/segmentler` | 200 | 200 | aynı yol, 200 |
  | EN sayfa (9) | `/en/` (+ `/en`) + M7 F7.5 eşlemesinin sekizi | 200 | 404 | 301 → TR karşılığı |
  | Bulunamadı (3) | `/404` · `/en/404` · `/404.html` | 404 · **200** · 308 | 404 | **404** (kullanıcı) |
  | Tarama (3) | `/robots.txt` · `/sitemap-index.xml` · `/sitemap-0.xml` | 200 | 200 · 404 · 404 | robots 200 · ikisi 301 → `/sitemap.xml` |
  | Head (4) | `/favicon.ico` · `/favicon.svg` · `/apple-touch-icon.png` · `/og/alpfitplus-og.png` | 200 | 404 | ilk üçü teslim · 301 → `/opengraph-image.png` |
  | Manifest (4) | `/site.webmanifest` · `/icon-192.png` · `/icon-512.png` · `/icon-512-maskable.png` | 200 | 200 | değişmez |
  | Ürün görseli (6) | `/product/*.webp` | 200 | 200 | değişmez |
  | v1 yazı tipi (4) | `/fonts/*-latin-*.woff2` (4 referanslı; dizinde 14) | 200 | 404 | **bilinçle düşer** — yalnız v1'in kendi HTML'i referans veriyor |
  | Host (3) | `www.alpfitplus.com` (v1: **307**) · `alpfitplus-web-v2.vercel.app` · `alpfitplus-website.vercel.app` | — | — | 301 → apex; üçüncüsü v1 projesinde kalır, kuralı apex'e gönderir |
  | Biçim | her sayfanın `/x/` ve `/x/index.html` hâli | 200 | 308 / 404 | tek atlama 301 |

- **"Sayfa başına paylaşım kartı parite dışı" (Kapsam Dışı → B-042 kalem 1) → ÇÜRÜDÜ.** v1 canlısı her sayfaya kendi `og:url`/`og:title`/`og:description`'ını veriyor (`/fiyat` → `og:title` "Fiyat — Alpfit Plus", `og:url …/fiyat`); v2'de 15/15 sayfa ana sayfanın kartı. Kullanıcı kararıyla faza alındı.
- **B-059 kalem 3 ("v2 tedarikçilerin ülkelerini kurmuyor") → BAYAT.** Atom 2026-09-22 tarihli; TASK-2.17 (2026-09-23) Aktarım bölümünü rol + ülke dökümüyle yeniden yazdı. v1'in `RECIPIENTS` (5 kalem, `../Alpfitplus-website.v1/src/i18n/legal.ts:97`) ↔ v2 Aktarım (4 kalem + Umami paragrafı, `src/content/legal.ts:172-199`) kalem kalem karşılaştırıldı: v1'in Umami satırı v2'de Hetzner satırında ve ayrı ölçüm paragrafında, `TRANSFER_FACT` ↔ "Bu listenin pratik karşılığı" paragrafı. **Eksik kalem yok.** v1 dökümü Gizlilik sayfasında tekrar ediyor, v2 orada Aktarım'a yönlendiriyor — tek ev, bilgi kaybı yok. Yasal işte kalan gerçek iş: **WhatsApp ayağı + Frankfurt'un bayatlatacağı bölge cümlesi.**
- **B-065 "JS kapalıyken" → sınıf daha geniş: hidrasyonsuz gönderim.** Ölçüldü (3100, 390 px): JS parçaları bekletilirken basılan düğme adresi `…/demo?website=&name=Zemin+Kontrol&club=…&phone=…` yaptı, `/api/demo` çağrılmadı — JS kapalıyla birebir. Doğal pencere (ilk boyama → hidrasyon, üçer koşum): hızlı 3G **~880 ms** · yavaş 4G **~340 ms** · kısıtsız **~40 ms**. İnsan için dar; asıl yüzey hidrasyonun **hiç olmadığı** hâllerdir.

**Sıra şartları — ters sıra sessizce yanlış sonuç üretir**

- **B-065 CSP'den önce.** (b) seçeneğiyle yanlış bir CSP kuralı hidrasyonu durdursa bile form çalışır; ters sırada CSP'nin tek bir hatası her ziyaretçide B-065 sızıntısını üretirdi.
- **Production env değişimi alan adı taşımasıyla AYNI yeniden derlemeye biner.** `LEAD_STORE_TOKEN` ve `IP_HASH_SALT` bugün **tek kayıt, hedef `['production','preview']`** (ölçüldü, v2 proje API'si). Önce kayıt `preview`'a daraltılır (değer korunur), sonra `production` için yeni kayıt açılır. Canlı token taşımadan **önce** bir derlemeye girerse `.vercel.app`'teki (aşama `preview`) her derleme canlı `leads` koleksiyonuna yazar. Env değişikliği yalnız sonraki derlemede etkili olduğundan akış: env yaz → taşı → yeniden derle; arada `main`'e push olmaz (iki dal ayrımı bunu sağlar). Preview hedefinin diğer değerleri (Umami kimliği, Resend, `DEMO_*`) bugün zaten ayrı kayıtlarda.
- **Taşıma → yeniden derleme penceresi ~20-30 sn.** Taşınan alan adı v2'nin mevcut üretim dağıtımına bağlanır; o dağıtım `VERCEL_PROJECT_PRODUCTION_URL = alpfitplus-web-v2.vercel.app` ile derlendiği için aşaması `preview` → üç `noindex` katmanı + `robots.txt` `Disallow: /`. Son 10 dağıtımın süresi **19-32 sn** (kuyruk 1-3 sn). Yeniden derleme **redeploy** ile yapılır (taze sistem değişkenleri); eski bir dağıtımı **promote** etmek aşamayı değiştirmez. Google `robots.txt`'yi ~24 saat önbellekleyebildiği için pencereye denk gelen bir tarama taramayı bir gün geciktirebilir — trafik küçük (v1: 2026-07-01'den bu yana 99 ziyaretçi), risk kabul edilebilir; geçişten sonra Search Console'da yeni site haritası bildirilir.
- **Frankfurt + yasal metin + test dal 8 aynı yayında.** `legal.ts:185` ve `:193` form ucunu Washington/ABD'de söylüyor (dayanağı `legal.ts:125-129`: `x-vercel-id` `fra1::iad1::…`, bugün de aynı — ölçüldü); `tests/legal-consistency.test.ts:724-756` (dal 8) `vercel.json` **yokluğunu** ve "Washington, D.C." parçasını çiviliyor. Bölge değişince dal 8 **tasarımı gereği** kırmızı döner; `vercel.json` → `regions` ile metnin bölge cümlesini **iki yönlü** eşleyecek biçimde yeniden yazılır. Bölge Hobby'de de değiştirilebilir (belge: Hobby "single region") — ücretli plana bağlı değildir.
- **İki dal ayrımı alan adından önce** (Kapsam Tartışması). Ölçüldü: dal adresleri (`alpfitplus-web-v2-git-<dal>-north-ai.vercel.app`) ve dağıtıma özgü adresler bugün **302 → Vercel girişi**; açık tek adres üretim `.vercel.app`'i ve o da apex'e yönlenecek. Otomatik ölçümün dal önizlemesine erişmesi için **Protection Bypass for Automation** anahtarı üretilir — dış (Vercel proje ayarı), değer sırdır, `x-vercel-protection-bypass` başlığıyla verilir ve hiçbir dosyaya yazılmaz.

**Parite ve yüzey**

- **Başlık paritesi (v1 canlı ↔ v2 önizleme, `/`):** CSP v1'de var, v2'de yok · `X-Frame-Options` `DENY` ↔ `SAMEORIGIN` · `Permissions-Policy` v1 `payment/usb/bluetooth/browsing-topics` ↔ v2 `interest-cohort` (terk edilmiş). **Ters yönde yeni bir davranış:** v2'nin HSTS'i `includeSubDomains; preload` taşıyor, v1'inki yalnız `max-age=63072000` — apex'e bağlandığı gün alt alan adları da tarayıcıda HTTPS'e zorlanır. Bugünkü alt alan adları `www` (Vercel) ve `lead` (depo), ikisi de HTTPS (ölçüldü); `app.` NXDOMAIN. Korunur; tarayıcıların önyükleme listesine başvuru **yapılmaz** (ayrı karar).
- **CSP politikası — v1 paritesi** (`../Alpfitplus-website.v1/vercel.json`): `default-src 'self'; script-src 'self' 'unsafe-inline' https://umami.kiwiailab.com; connect-src 'self' https://umami.kiwiailab.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`. v2'ye özgü sınanacaklar: B-065'in native POST'u `form-action 'self'` içinde · JSON-LD veri bloğu yürütülmez, CSP'ye takılmaz · geliştirme sunucusu `'unsafe-eval'` ister (belge; koşul `NODE_ENV`) · **dal önizlemesinde Vercel araç çubuğu (`vercel.live`) politikaya takılır** — yalnız önizlemede konsol gürültüsü; önizlemeye özgü izin ya da araç çubuğunu kapatmak task kararıdır. Yerel 3100'de Umami etiketi render edilmez (kimlik boş), yani Umami izni yerelde ancak `NEXT_PUBLIC_UMAMI_WEBSITE_ID` önizleme kimliğiyle derlenmiş bir kopyada ölçülür (sır değil; olaylar `data-tag=local` ile ayrışır).
- **JSON-LD paritesi (B-042 kalem 3), v1 canlıdan:** `Organization` → `email` (v1: `info@kiwiailab.com` — v2'nin `CONTACT`'ında yok ve posta alıp almadığı ölçülmedi; **kopyalanmaz**, var olan bir sabitten seçilir), `telephone` E.164 `+905359375955` (v2 `layout.tsx:73` elle `+90-535-937-59-55` — `CONTACT.phone.href`'ten türetilir), `sameAs` → `CONTACT.instagram.href`; `SoftwareApplication` → `url` ve `offers.priceSpecification` (`UnitPriceSpecification`, `valueAddedTaxIncluded: false`). v1'in `hreflang` alternatifleri tek dil kararıyla düşer.
- **İkon teslimi:** `research/scripts/brand-assets.mjs:26-30` `favicon-32.png` ve `apple-touch-icon.png` üretiyor ama teslim etmiyor (B-043). `sharp` ICO yazmaz — `favicon.ico` için PNG gömülü tek girişli ICO kabı gerekir. `public/` yalnız `product/` ve `fonts/` altında betik çıktısıdır (CLAUDE.md → Dokunulmazlar); ikonun yeri task'ta seçilir (`public/` ya da `src/app/` dosya kuralı). iOS, `<link>` olmasa da `/apple-touch-icon.png`'yi **bu adla** ister — yol korunmalı.
- **Umami:** Production kimliği v1'in `alpfitplus.com` kaydı `66838f35-2adf-4da0-a21e-086f5f050dde` (sır değil — v1 sayfa kaynağında görünür). v1 `data-domains="alpfitplus.com"` kullanıyor, v2 bilinçle kullanmıyor (`layout.tsx` yorumu); geçişte değişmez.
- **Env değerlerinin kaynağı** (değerler hiçbir dokümana yazılmaz): canlı `LEAD_STORE_TOKEN` → **dış**: sunucu `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PRODUCTION` (v1'in Vercel kaydı `sensitive`, geri okunamaz; token → koleksiyon eşlemesi `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:61-62`) · v1'in `IP_HASH_SALT`'ı → **dış**: v1 projesinin Production kaydı, türü `encrypted` → okunabilir · `NEXT_PUBLIC_UMAMI_WEBSITE_ID` → yukarıdaki kimlik.
- **Ücretli plan:** $20/ay/geliştirici koltuğu, $20 kullanım kredisi dahil (vercel.com/pricing, 2026-09-26); takım `north-ai` tek üyeli → **$20/ay**. Plan **takım bazındadır**: takımdaki 12 projenin tamamı (aralarında `kiwiailab.com`, `afrodia.com.tr`) ücretli plana geçer. Ödeme adımı kullanıcıdadır.
- **B-011 bugün hâlâ açık:** apex MX NODATA (2026-09-26, DoH). **`DEMO_FROM` kriteri karşılanmış:** Resend'de `alpfitplus.com` `verified`, bölge `eu-west-1` (API, 2026-09-26).
- **Alt bilgideki "Giriş Yap"** (`Footer.tsx:163` → `SITE.appUrl`, `app.alpfitplus.com` NXDOMAIN) bu faza **alınmadı** (kullanıcı) — geçişle birlikte canlı sitede görünür olur; kaydı `BULGULAR.md` → Gelen Kutusu `[audit-product SORU]` (cevaplı, uygulanmamış).
- **v1'in `alpfitplus-website.vercel.app` → apex kuralı v1 projesinde yaşar** ve geçişten sonra da çalışır (apex v2'yi gösterir) — v1 projesinin silinmemesinin ikinci gerekçesi.
- **B-065'in sonuç sayfaları site haritasına girmez**, dolayısıyla a11y/mobil kapılarının rota listesi (`research/lib/rotalar.mjs` → site haritası) onları görmez; task'ta `ROTALAR` ile ayrıca ölçülür.

**Ölçüm katmanı — çekirdek etkileşim**

- Vitest (`web` konteyneri) Vercel kenarını, gerçek alan adını, alan-adı düzeyi yönlendirmeyi ve derleme anındaki aşamayı **ölçemez**. Kanal (kullanıcı kararı): **geçiş doğrulama betiği** — adres envanteri (yukarıdaki tablo + iki biçim) · beklenen kod ve `Location` · **tek atlama** · hedefin 200'ü · başlık kümesi (CSP dahil) · üç `noindex` katmanının hâli · `canonical`/`og:image`/site haritasının alan adı ve 200'ü. Kendi kapsamını da eşikler (M6 F6.1 sözleşmesi: "0 kalem ölçüldü" kırmızıdır). Aynı betik üç hedefe koşar: yerel 3100 (`.vercel.app` kuralı `Host` başlığıyla) → dal önizlemesi (atlatma başlığıyla) → canlı (geçiş anında, öncesi ve sonrası). Yayın kapısının parçası olur ve "Kalite kapıları otomatik" fazına devreder.
- Manuel kolda kalan: `destek@` posta alımı (B-011, kullanıcı gözü) · Search Console'un dizin listesi (betiğin envanterine girdi) ve yeni site haritasının bildirimi · canlı test talebinin sunucuda salt-okunur teyidi ve silinmesi.

---

**Oluşturulma:** 2026-09-26 (plan-phase — parent'tan taşındı)
