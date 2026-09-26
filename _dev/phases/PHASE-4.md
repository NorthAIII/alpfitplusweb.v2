# Phase 4: Alan adı geçişi

**Durum:** 🔄 Devam ediyor

<!-- Bu doküman faza girince (discuss-phase) oluşur; durum 🔄 ile başlar. Henüz girilmemiş fazların dokümanı/numarası olmaz — PHASES.md → Sıradaki Fazlar'da numarasız konu olarak durur. -->
<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-N.md` — tek bir bölümün değil, dokümanın tamamının tek Read'e sığması esastır) faz HÂLÂ AKTİFKEN `PHASE-N-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır, o dosya adı değildir) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-N · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından (`✅` ya da `⚠️`) sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder (kanon: CLAUDE.md → Boyut ve Bölünme). Kesim dokümanın kendi `##` bölüm sınırından geçiyor ve tek sonuç veriyorsa (en az iki `##` sınırı, parent'ta gövde kalır) kalem kurallıdır — sorulmaz, uygulanır ve raporlanır; bölümleri gruplamak ya da ad icat etmek gerekiyorsa sorulur (CLAUDE.md → Onay Ölçütü). -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). Doküman eşiğin ALTINDAYSA (uygulanan bölme yerinde kaldı ya da temizlik onu altına indirdi — geri ALINAN bölme dokümanı çizginin ÜSTÜNE döndürür ve orada kayıt `accept-size`'dır) `accept-size` çağrılamaz: script boyut aşımı olmayan dokümanı reddeder. O hâlde verilmiş bir kap kararı varsa tek kayıt tek satırlık `<!-- KURAL: … (bilinçli) -->` yorumudur; kap kararı doğmadıysa kayıt da gerekmez. -->

---

## Genel Bilgiler

**Amaç:** `alpfitplus.com` v1'den alınıp v2'ye bağlanır ve v2.0'ın içerik tarafı bununla kapanır. Geçiş günü v2 v1'in yerini aldığı için v1'in bugün yapıp v2'nin yapmadığı her davranış o gün kaybolur; faz geçişin kendisiyle birlikte bu **paritenin** kapanmasını, canlıya çıkışın kapılı bir düzene girmesini ve yasal metnin yayından önce gerçek veri akışını anlatmasını kapsar.

**Milestone:** `alpfitplus.com` ve `www.alpfitplus.com` v2'ye bakıyor, site canlı alan adında dizine açık (üç `noindex` katmanı kalktı; `canonical`, site haritası ve paylaşım görseli canlı alan adını gösteriyor ve 200 dönüyor) ve `alpfitplus-web-v2.vercel.app` apex'e yönleniyor; v1'in canlı adres kümesinin her kalemi (bugün 27: 20 sayfa + 6 varlık adresi + `www`, Search Console'un dizin listesiyle kesiştirilmiş) ölçülerek 301 ile karşılığına gidiyor ve hedefi 200; işaretli tek test talebi canlı koleksiyona düştü ve silindi, ölçüm v1'in Umami kaydında sayılıyor; v1'in yapıp v2'nin yapmadığı her kalem (güvenlik başlıkları, yasal metnin alıcı/ülke dökümü, şirket bilgileri, ikon ve paylaşım görseli adresleri) taşındı ya da gerekçesiyle düşürüldü ve yasal metin WhatsApp aktarımını söylüyor; `destek@alpfitplus.com` posta alıyor; JavaScript kapalıyken form veriyi adres çubuğuna yazmıyor ve talebi sessizce kaybetmiyor; canlıya çıkış iki dallı ve elle koşulan tam kontrol setine bağlı (`GIT-STRATEJI.md`); proje ücretli planda, fonksiyonlar Frankfurt'ta; v1 Vercel projesi alan adından ayrıldı ama duruyor.

mekanizma: v1 adres kümesi "bugün 27" → canlıdan ölçülen 45 ayrık kalem + her sayfanın eğik çizgili ve `/index.html` biçimi, hepsi tek atlamada 301; `/404` · `/en/404` · `/404.html` hedefi 404 (araştırma kararı — tablo ↓ Araştırma Bulguları → Dikkat Edilecekler)

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

Fazın **tek içerik feature'ı F7.5**'tir (MODULE-MAP'te Faz 4, 🔄). Parite ve yayın hazırlığı kalemleri tamamlanmış (✅) feature'lara dokunur; Faz 2/3 emsaliyle onların matris durumu değişmez, dokunuşun kaydı bu tablodur.

| Feature | Modül | Açıklama |
|---------|-------|----------|
| F7.5: Alan adı geçişi ve 301 haritası | M7-Yayin-ve-Altyapi | Apex + `www` taşıma; v1'in canlı adres kümesinin kalıcı yönlendirme haritası; Production'ın üç canlı değeri; v1 projesinin alan adından ayrılması (silinmez); geri dönüş kuralı. Bulgular: **B-043** (geçiş yüzeyi tablodan geniş) · **B-011** (apex'te posta kaydı yok) |
| F7.3: Vercel'de ayrı proje (✅, dokunulur) | M7-Yayin-ve-Altyapi | Ücretli plan · fonksiyon bölgesi Frankfurt (`[audit-product SORU]` 2026-09-23) · Preview ↔ Production ortam ayrımı · `.vercel.app` → apex yönlendirmesi · alan adı bağlandıktan sonra yeniden derleme |
| F7.2: Güvenlik başlıkları (✅, dokunulur) | M7-Yayin-ve-Altyapi | v1 paritesi: CSP, `X-Frame-Options: DENY`, güncel `Permissions-Policy` (**B-016**) |
| F7.4: Analitik olay sayımı (✅, dokunulur) | M7-Yayin-ve-Altyapi | Production'da v1'in `alpfitplus.com` Umami kaydı (`docs/DECISIONS-2026-09-14..2026-09-22.md` → 2026-09-14 «Umami site kaydı») |
| F3.2 / F3.3: Dayanıklı kayıt ve e-posta (✅, dokunulur) | M3-Lead-Hatti | Canlı depo token'ı + v1'in IP tuzu; canlı koleksiyonun işaretli tek test talebiyle kanıtı; `DEMO_FROM` alan adı doğrulaması |
| F3.1: Demo formu ve talep ucu (✅, dokunulur) | M3-Lead-Hatti | **B-065**: JavaScript kapalıyken form veri sızdırmaz ve talebi sessizce kaybetmez |
| F1.1: Tek kaynak içerik (✅, dokunulur) | M1-Icerik-ve-Iddia-Kaynagi | Yasal metin: ön-doldurulmuş WhatsApp bağlantısının aktarımı (`[TASK-3.25 SORU]` → seçenek a) + v1'in alıcı/ülke dökümü paritesi (**B-059** kalem 3) |
| F2.3: Ortak yerleşim (✅, dokunulur) | M2-Sayfalar-ve-Bolumler | JSON-LD'de v1'de olup v2'de düşen şirket ve teklif alanları (**B-042** kalem 3) + sayfa başına paylaşım kartı (**B-042** kalem 1 — araştırmada v1 paritesi olduğu ölçüldü, kullanıcı kararıyla alındı; ↓ Araştırma Bulguları) |
| F5.4: Marka varlıkları (✅, dokunulur) | M5-Gorsel-Varlik-Hatti | `favicon.ico` / SVG / `apple-touch-icon` teslimi ve v1'in paylaşım görseli adresi (B-043'ün varlık satırları) |

**Geçişle ölçülerek teyit edilecek bulgu:** **B-027** — kart görseli, `canonical` ve site haritası bugün `alpfitplus.com`'u gösteriyor ve adres v2'ye geçtiği anda doğruya dönmesi beklenir; kanıt canlı alan adında ölçülür. Önizleme yüzeyinin kendi kartı kapsam dışıdır (↓).

---

## Kapsam Tartışması

> `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-26). Kararların hepsi kullanıcıyla alındı; "varsayılan" olarak işaretlenenler kullanıcıya liste hâlinde sunulup onaylandı.

### Alınan Kararlar

- **Kapsam: geçiş + v1 paritesi.** Ölçüt: v1'in bugün canlıda yaptığı ve v2'nin yapmadığı her kalem ya **taşınır** ya **gerekçesiyle bilinçle düşürülür** (düşen kalem `BULGULAR.md` → Bilinçli Tercihler'e iner). Bugün bilinen liste: güvenlik başlıkları (B-016) · yasal metnin alıcı/ülke dökümü (B-059 kalem 3) · JSON-LD'nin düşen alanları (B-042 kalem 3) · varlık adresleri ve `www` (B-043) · v1'in kendi `.vercel.app` adresini apex'e yönlendirmesi ve `/404.html` kuralı (B-043). ⚠️ **Liste tamlığı iddia edilmez** — B-059'un kök nedeni paritenin hiçbir yerde kriter olmamasıydı; araştırma listeyi v1'in **canlısına** karşı yeniden çıkarır.
- **Lead hattından yalnız B-065 girer.** JavaScript kapalıyken form ad/telefon/e-postayı adres çubuğuna yazıyor ve talebi hiçbir yere göndermiyor; geçişten sonra gerçek ziyaretçi buna çarpar. B-037 · B-054 · B-020 kanvasta kalır (↓ Kapsam Dışı).
- **Yayın düzeni: iki dal.** Çalışma ayrı bir dalda sürer ve önizleme adresi orada yaşar; canlıya çıkış **yalnız kullanıcının "yayınla" tetiğiyle** çalışma dalının `main`'e birleştirilmesidir. `GIT-STRATEJI.md` korumalı dokümandır: değişim bir task içinde `.claude/commands/devflow/lib/git-strategy-kurulum.md` prosedürüyle (probe → teşhis → teyit) yapılır, dal adı orada teyit edilir (öneri `dev`) ve gerekçe o task'ta `docs/DECISIONS.md`'ye yazılır. ⚠️ **Sıra şartı:** dal ayrımı alan adı bağlanmadan **önce** kurulur — yoksa geçişten sonraki ilk faz commit'i doğrudan canlıya çıkar.
- **Yayın kapısı: tam set, elle.** Birleştirmeden önce beş ölçüm + test paketi + tip kontrolü yayın kopyasına karşı yeşil olmalı; `a11y`'nin kayıtlı tek kalemi (B-063, `/gecis` paragrafı — ölçümün kusuru) hariç okunur. Bu kapı F7.5'in *"M6 F6.3 yeşil"* bağımlılığının **yerine** geçer: CI sonraki fazda ("Kalite kapıları otomatik"), sıra Faz 2'de değişmişti.
- **Ortam ayrımı.** Vercel'de Preview ortamı bugünkü önizleme değerlerini taşır (önizleme koleksiyonunun token'ı, v2'nin kendi Umami kaydı); Production üç canlı değeri alır — `LEAD_STORE_TOKEN` canlı token · `IP_HASH_SALT` v1'in değeri · `NEXT_PUBLIC_UMAMI_WEBSITE_ID` v1'in `alpfitplus.com` kaydı. Test talepleri böylece canlı kayda hiç karışmaz. Üç değerin kendisi önceden kararlıydı (`modules/M7-Yayin-ve-Altyapi.md` → F7.5 Edge Case'ler); Faz 2 retrosunun kaydıyla **üçü de bu fazın UAT senaryosudur**. ⚠️ Önizleme adresinin korumasız kalması kararı (F7.3 Edge Case) dal önizlemesine taşınırken yeniden ölçülür.
- **Vercel planı: ücretli plana geçilir.** Ücretsiz plan ticari kullanıma kapalı ve canlı satış sitesinde askıya alma demo hunisini durdurur (ILKELER → Kalıcılık önceliği, Dönüşüm). Güncel ücreti araştırma ölçer, geçişi kullanıcı onaylar. `BULGULAR.md` → Bilinçli Tercihler'deki "Hobby'de kalır" satırı bu kararla güncellendi; geçiş yapılınca silinir.
- **Fonksiyon bölgesi Frankfurt** (kullanıcı kararı 2026-09-23, `BULGULAR.md` → Gelen Kutusu `[audit-product SORU]`) bu fazda uygulanır; `/api/demo` gecikmesi taşımadan önce ve sonra ölçülür.
- **Geçiş anını Claude yürütür, kullanıcının "şimdi" tetiğiyle.** Komut satırından adım adım, her adım öncesi/sonrası ölçülerek. v1 projesinden **yalnız alan adları** ayrılır; proje silinmez (CLAUDE.md → Dokunulmazlar). v1 projesine komut satırı erişimi yoksa o adım kullanıcının panel adımına düşer — araştırma ölçer.
- **Alan adı bağlandıktan sonra yeniden derleme zorunlu adımdır** (kodda doğrulandı): aşama derleme anında `VERCEL_PROJECT_PRODUCTION_URL`'den türüyor (`src/lib/stage.ts:26-30`, `NEXT_PUBLIC_DEPLOY_STAGE` olarak gömülür). Bağlanmadan önce derlenmiş dağıtım canlı alan adında da `preview` aşamasında ve üç katmanda `noindex` kalır.
- **Canlı kaydın kanıtı: işaretli tek test talebi, sonra silinir.** "TEST — silinecek" etiketli tek talep canlıdan gönderilir, sunucuda salt-okunur teyit edilir (okuma modu: `memory/kendi-sunucu-n8n-bunker-umami.md`), sonra kullanıcının onayıyla silinir; ekibe bir bildirim e-postası düşmesi beklenir. Gerekçe: iki koleksiyon da `201` döner ve yanlış token gerçek talepleri **sessizce** önizlemeye gönderir.
- **Yasal metin: WhatsApp aktarımı yazılır** (`[TASK-3.25 SORU]` → seçenek a). Aktarım bölümüne ön-doldurulmuş bağlantının tıklama anında Meta'ya ad/kulüp/telefon taşıdığı ayağı eklenir; v1'in alıcı/ülke dökümü (B-059 kalem 3) aynı işte taşınır. Olgu yazılır, hukuki nitelendirme yazılmaz (`docs/DECISIONS.md` 2026-09-23 «Yasal metin aktarımı olgu olarak yazar»); yazılan cümle de ölçülür (`memory/urun-iddiasi-capa-dogrulamasi.md`).
- **`www` ve `.vercel.app` kalıcı yönlendirmeyle apex'e** (varsayılan, onaylandı). `www` bugün v1'de **307** (geçici) veriyor; kalıcıya çevrilir. `alpfitplus-web-v2.vercel.app` → `alpfitplus.com`, v1'in kendi Vercel adresine yaptığının paritesi — aynı site iki adreste yayında kalmaz.
- **Geri dönüş kuralı.** Talep hattı ya da sitenin açılması bozuksa alan adı **hemen** v1 projesine geri bağlanır; kısmi kırmızıda (tek adres, tek başlık) 30 dakika ileri düzeltme denenir, olmazsa geri. `GIT-STRATEJI.md` → Acil Düzeltme'nin geri dönüş beyanı bu kuralla yazılır.
- **Harita doğrulaması tablodan geniştir.** 20 adreslik tablo tek başına ölçüt değildir: v1'in canlı adres kümesi (bugün 27 — B-043) + Umami'nin en çok gezilen sayfaları + Search Console'un dizin listesi kesiştirilir ve **her kalem** 301 → 200 olarak ölçülür.
- **B-011 (gelen posta) geçişten önce kapanır.** İki kullanıcı adımı (Squarespace'te "Google Workspace MX" hazır seçeneği + Google'da `destek@` kutusu ya da takma adı) alan adı taşımasından bağımsızdır; yasal metnin otuz gün taahhüdü site alan adına bağlandığı anda görünür olduğu için sıra budur. Doğrulanmış yönerge, bozulmama tabanı ve kapanış ölçümü atomda hazır (`bulgular/B-011-apex-mx-kaydi-yok.md` → Çözüm Yolu); UAT senaryosudur.

### Kullanıcı Tercihleri

- **Search Console erişimi kullanıcıda.** Geçişten önce dizindeki adres listesini kullanıcı çeker, geçişten sonra yeni site haritasını kullanıcı bildirir; Claude neye bakılacağını ve neyin bildirileceğini yazar.
- **Yayın kontrolleri hız için kısılmaz** — tam set (yayın başına ~15-20 dk) kabul edildi.
- **Geçişin ve yayının tetiği kullanıcıdadır**, icra Claude'dadır; plan değişikliği ve test kaydının silinmesi ayrıca kullanıcı onayı ister.

### Kapsam Dışı

- **CI (F6.3) ve tek komut (F6.2)** — "Kalite kapıları otomatik" fazı. Bu fazda kontroller elle koşar.
- **Lead hattının diğer kırmızıları** — B-037 (başka siteden gelen istek depoya yazıyor) · B-054 (çöp numara kayda geçiyor) · B-020 (hız sınırı geçerli talebi reddediyor); B-036'nın sessiz kayıp yolları da. Kanvasta kalır.
- **B-042'nin parite dışı kalemleri** — alt sayfaların kendi paylaşım kartı (`og:url`/`og:title`), `/foto` önbelleği, site haritası tarihleri, iki tema rengi.
- **Önizleme yüzeyinin kendi paylaşım kartı** (B-027'nin aşamaya göre `metadataBase` ayağı) — canlı alan adındaki kart geçişle ölçülür, önizlemedeki değil.
- **B-061 (depo yedeğinin sunucu dışı kopyası)** — icra sunucu projesinde (`altyapi/vps`); depo bugün de v1'in canlı kayıtlarını taşıyor, yani geçiş yeni bir risk doğurmuyor.
- **B-008 (hukukçu onayı)** — dış aktör, fazı kilitlemez (ILKELER).
- **Metin tonu** — ayrı faz, geçişten sonra. **B-025** (çalışma zamanı alarmı) da dışarıda.

---

## Araştırma Bulguları

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

### Teknik Kararlar

1. **Taşıma tek API çağrısıdır** (`…/domains/alpfitplus.com/move`, hedef v2 proje kimliği); `www` yönlendirmesi 301'e çevrilir. Geri dönüş aynı uç, hedef v1 — Kapsam Tartışması'nın geri dönüş kuralı bu çağrıyla icra edilir.
2. **301'ler tek atlamadır:** `skipTrailingSlashRedirect` + `statusCode: 301` kuralları `next.config.ts`'te; `.vercel.app` → apex kuralı da orada (`has: host`). Kurallar yerelde 3100'e karşı ölçülebilir — aynı routes-manifest.
3. **CSP başlıkta sabit, v1 politikası; `X-Frame-Options: DENY`, `Permissions-Policy` v1 değeri, HSTS korunur.** Rapor-modu (`Report-Only`) turu canlıda koşmaz: iki dal düzeni prova yüzeyini zaten sağlıyor (3100 + dal önizlemesi, ihlal sayımı 0).
4. **B-065: native POST + form kodlaması + 303 → iki sonuç sayfası** (`noindex`, site haritası dışı). Köken kontrolü yalnız form kodlamalı yolda — JSON yolu (B-037) bu fazda değişmez. Hız sınırı, bal küpü ve rıza denetimi iki yolda aynı fonksiyondan geçer.
5. **Bölge depoda:** `vercel.json` → `regions: ["fra1"]`; yasal metin + dal 8 aynı yayında. Gecikme öncesi/sonrası `422` yoluyla ölçülür (kayıt yazmaz) — bugün buradan `x-vercel-id: fra1::iad1::…`, TTFB **0,27-0,40 sn** (3 istek).
6. **Dal önizlemesi girişli kalır**; otomatik ölçüm için otomasyon atlatma anahtarı.
7. **Sayfa başına paylaşım kartı** tek yardımcıdan türer (her sayfa `title`/`description`/yol verir; `og:url`, `og:title`, `og:description` sayfaya özgü, `og:image:alt` eklenir) — yeni sayfa kartı kendiliğinden doğru getirir.
8. **Env ayrımı:** paylaşılan iki kayıt `preview`'a daraltılır, `production` için yeni kayıt açılır; üç canlı değer taşımayla aynı derlemeye biner.

---

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda doldurulur.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 4.01 | TASK-4.01 | ⬜ Bekliyor | [kısa açıklama] |

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

<!-- Alınan dersler ve tavsiyeler. Memory'den MEZUN EDİLEN öğrenimlerin çapalı tek satırlık kaydı da buraya düşer ("<öğrenim> artık <test/lint/CI/validator/guard> tarafından yakalanıyor — memory'den mezun edildi") — kanon: .claude/commands/devflow/lib/memory-sistemi.md → Supaplar. Kayıt faz ✅ damgalanmadan ÖNCE yazılır. -->
- [Alınan dersler, tavsiyeler]

### Task-Spesifik Teknik Öğrenimler

<!-- OPSİYONEL: Bu fazdaki task'larda öğrenilen ama proje genelinde geçerli olmayan teknik nüanslar (araç davranışı, framework bug'ı, vb.). MEMORY.md'nin değil, faz retrosunun evidir. Bu fazda böyle bir nüans çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

### DevFlow'a Öneri

<!-- OPSİYONEL: Bu fazda fark edilen, DevFlow yönteminin geneline dair (proje-özel OLMAYAN) iyileştirmeler — aracın kendisinin nasıl çalışması gerektiği. Buraya yazılır + kullanıcıya bildirilir; DevFlow'a ayrı oturumda taşınır. Disiplin çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

---

## Kalite Kontrol Sonuçları

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur (`QUALITY.md`'nin on ekseni).

| Eksen | Durum | Not |
|-------|-------|-----|
| Modülerlik | ✅ / ⚠️ / ❌ | ... |
| Güvenlik | ✅ / ⚠️ / ❌ | ... |
| Bakım Maliyeti | ✅ / ⚠️ / ❌ | ... |
| Performans | ✅ / ⚠️ / ❌ | ... |
| Hata Yönetimi | ✅ / ⚠️ / ❌ | ... |
| Test Kapsamı | ✅ / ⚠️ / ❌ | ... |
| Erişilebilirlik | ✅ / N/A | ... |
| Dönüşüm | ✅ / ⚠️ / ❌ | ... |
| Ölçülebilirlik | ✅ / ⚠️ / ❌ | ... |
| İddia Uyumu | ✅ / ⚠️ / ❌ | ... |

---

**Oluşturulma:** 2026-09-26 (discuss-phase)
