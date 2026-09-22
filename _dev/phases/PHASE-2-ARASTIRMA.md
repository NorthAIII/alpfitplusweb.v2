# Phase 2 — Araştırma Detayı

← PHASE-2 · araştırma-detayı

> `_dev/phases/PHASE-2.md` → Araştırma Bulguları'nın bölme çocuğudur (plan-phase, 2026-09-22 — parent kırmızı çizgiyi aştı, faz hâlâ aktifken bölündü). Parent'ta seçilen yaklaşımların özeti, ölçümün genişlettiği sınırlar, teknik kararlar ve tanımlayıcı kaynakları tablosu durur; **yaklaşım karşılaştırmasının tam metni (elenenler dâhil) ve ölçülmüş tuzakların tamamı buradadır.**
>
> Task yazarken ve plan doğrulanırken "Dikkat Edilecekler" ve "Değerlendirilen Yaklaşımlar" buradan okunur.

---

> `/devflow:research-phase` oturumunda dolduruldu (2026-09-22). Ölçümler bu makinede, çalışan konteynerlere ve komşu depolara karşı yapıldı.

### Değerlendirilen Yaklaşımlar

**1. Yetenek iddialarının tek kaynağı (B-029 · B-040)**

Bugünkü hâl ölçüldü: "bugün var / yolda / yol haritasında" ayrımı **beş evde** elle yazılı — `src/app/ozellikler/page.tsx` (Yol haritası bölümü, üç kolon: 10/3/5 kalem), `src/components/sections/FounderProgram.tsx:81-95` (üç `StatusRow`, düzyazı), `src/content/chat.ts:126-127` (düzyazı), `src/content/faq.ts:48` (düzyazı), `src/app/fiyat/page.tsx:29-34` (`NOT_INCLUDED`, "(yol haritasında)" ekiyle iki kalem). Altıncı bir kısmî ev `src/content/site.ts:38-44` → `PRODUCT_STATUS.modules` (sekiz modülü düzyazı sayar).

- **(a) Yalnız yol haritası sabiti.** `src/content/product.ts`'e üç kademeli bir sabit konur; beş ev oradan okur. Artı: küçük, tüketicilerin hepsi düzyazıyı listeden türetebiliyor (ölçüldü — dördü de kalemleri virgülle bağlıyor). Eksi: beş yanlış cümlenin kendisi listeye **bağlı değil**, elle düzeltilir ve aynı sınıf yeniden doğabilir.
- **(b) İddiaya bağlı yetenek envanteri.** Her modül maddesi / segment iddiası bir yetenek kimliğine bağlanır, kimlik durumunu listeden alır. Artı: en sağlamı. Eksi: 124 içerik maddesinin tamamının yeniden yapılandırılması — dar bir düzeltme fazının sınırını aşar.
- **(c) Liste + ürünün kendi işaretlerinden türeyen tarama.** (a)'nın üstüne: ürün deposu bugün-yok kalemlerini **adıyla aranabilir** notlarda taşıyor ("Yakında", "v1.5", "W8", "ertelendi" — B-029 dördünü böyle buldu). O notlardan konu sözcükleri çıkarılır, sitede o konulara değen cümleler taranır.

**Seçilen: (a) + (c)** (kullanıcı kararı, research 2026-09-22). Liste kurulur ve beş ev ondan okur; ayrıca ürünün kendi "bugün yok" işaretlerinden türeyen bir tarama, beş cümleden geniş ama 124'ten dar bir alt küme verir. (b) reddedildi: bu faz iddianın **doğruluğunu** düzeltir, içerik mimarisini yeniden kurmaz.

**2. Görsel denetimin temizlikten bağımsızlaşması (B-018)**

- **(a) Ad kalıbını genişlet** (`auditTexts`'teki iki-tam-sözcük regex'ine `&`, tek harfli soyad, vb. eklenir). Reddedildi: denetim temizliğin varsayımını paylaşmaya devam eder — kalıbı büyütmek körlüğü taşır, kaldırmaz.
- **(b) Denetim tablodan beslenir + ayrı iddia dalı.** `REPLACEMENTS`/`INITIALS` tablosundaki **her adın her parçası** yasaklı sözcük olur (tablo adları zaten biliyor); iddia sızıntısı için ayrı bir sözlük dalı açılır.

**Seçilen: (b).** Tablo kaynağın gerçeğidir, regex bir tahmindir.

**3. Yasaklı iddia sözlüğünün evi (B-018 → M6 F6.4 devri)**

Ölçülmüş kısıt: araştırma konteyneri **yalnız `research/`'ü görüyor** (`docker-compose.yml` → `research` servisi, tek bağlama `./research:/work`); `web` konteyneri ise deponun tamamını görüyor (`.:/app`). Yani iki konteynerin **ortak gördüğü tek dizin `research/`**.

- **(a) `research/lib/` altında tek dosya** — render hattı doğrudan import eder, ileride `tests/` ve F6.4 metin denetimi aynı dosyayı `web` konteynerinden okur.
- **(b) `src/lib/` altında** — render hattı erişemez (mount yok).
- **(c) İki kopya** — tanım gereği drift kaynağı.

**Seçilen: (a).** Tek dosya, iki tüketici, bağlama değişikliği gerekmez.

**4. Yasal beyan testinin çapraz-depo dalı (B-060)**

"12 ay" saklama süresinin mekanizması komşu depoda (`../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` → `RETENTION_MONTHS = 12`) ve **`web` konteyneri o yolu görmüyor** (ölçüldü: `/app/../Alpfitplus-website.v1` yok). v1'in kendi testi bu dosyayı göreli yolla okuyabiliyordu çünkü orada aynı depodaydı; v2'de değil.

- **(a) Sabiti v2'ye kopyala** — bulgunun şikâyet ettiği tekrarın ta kendisi.
- **(b) Salt-okunur bağlama + env kapısı.** `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:ro` bağlanır; test dalı bir env anahtarıyla açılır, anahtar tanımsızsa **atlanır**. Depo sözleşme paketinin (`tests/lead-store.contract.test.ts`) zaten kurduğu desen.
- **(c) Yerel depo konteynerinin API'sinden oku** — `lead-store` profili ayakta olmalı; `npm test`'i ayakta bir servise bağlar.

**Seçilen: (b).** Projenin kendi kurduğu desen; komşu depo yokken `npm test`'in geri kalanı etkilenmez.

**5. Mobil onay ve hata görünürlüğü (B-055 f/g ayakları)**

`src/app/globals.css:124` zaten `scroll-padding-top: 5.5rem` (88 px) taşıyor ve yapışkan başlık `h-17` (68 px) — yani **offset altyapısı kurulu**. Eksik olan kaydırmanın kendisi: gönderim başarılı olunca form (`state === "ok"` dalında) tamamen değişiyor, sayfa kısalıyor ve tarayıcı `scrollY`'yi olduğu yerde bırakıyor; hiç kaydırma olmadığı için `scroll-padding-top` hiç devreye girmiyor.

- **(a) Her sonuç öğesine `scroll-margin-top`** — mevcut genel ayarı yerelde ikizler; iki yerden yönetilen bir offset doğar.
- **(b) Durum değişiminde açık odak taşıma** (`tabIndex={-1}` + `focus()`); odak kaydırması `scroll-padding-top`'u zaten onurlandırır.

**Seçilen: (b).** Tek mekanizma, hem onay hem hata kutusu için aynı; (g) ayağı (başlığın h1'i örtmesi) aynı hamlede kapanır.

**6. KVKK başvuru adresinin posta alması (B-011)**

İki geçerli Google Workspace kaydı var: klasik beş kayıtlı küme ve tek kayıtlı modern küme (`smtp.google.com`, öncelik 1). **Seçilen: klasik beş kayıtlı küme** — bu hesapta bugün çalıştığı ölçüldü (`kiwiailab.com` → `1 aspmx.l.google.com` + `5 alt1/alt2` + `10 alt3/alt4`), yani hedef kayıt kümesi tahmin değil kopya.

---

### Kullanılacak Araçlar/Kütüphaneler

**Yeni bağımlılık yok.** Fazın tamamı kurulu araçlarla yapılır:

- **Vitest 4** (`package.json`, `vitest.config.ts` → `environment: "node"`) — yasal beyan testi (B-060) ve onay e-postasının sözleşme sınaması. `npm test` `web` konteynerinde koşar.
- **Playwright** (araştırma konteyneri, `Dockerfile.research`) — B-055 ve B-034 düzeltmelerinin ölçümü ve `render-product.mjs`. Betik scratchpad'e yazılıp `-v` ile bağlanır, `research/`'e kalıcı dosya bırakılmaz (`memory/arastirma-konteynerinde-tarayici-olcumu.md`).
- **Tailwind CSS 4'ün `aria-invalid:` varyantı** — hatalı alanın görsel işareti için (B-055 (a) ayağı). Yeni seçici ya da eklenti gerekmez; renk `neg` / `neg-wash` tokenlarından gelir ve kontrastı `a11y.mjs` ile ölçülüp CSS yorumuna rakamıyla yazılır (STYLE-GUIDE geleneği).
- **DNS over HTTPS** (`curl` + `dns.google` / `cloudflare-dns.com`) — MX doğrulaması. Sandbox'ta doğrudan UDP DNS kapalı, `dig` sessiz boş döner (B-011 atomunda ölçülmüş yöntem).
- **`openssl rand -hex 32`** — anahtar döndürme gerekirse (bkz. Teknik Kararlar → anahtar kapsamı).
- **Resend API** — onay e-postası aynı uçtan gider (`src/app/api/demo/route.ts` → `toEmail`), ek kütüphane yok.

---

### Dikkat Edilecekler

**Devralınan daralmaların ölçümü** — üç iddia sınandı, üçü de kapsamı genişletti:

- **"Beş karşılıksız yetenek iddiası" bir taban, tavan değil.** Sınıfın kendisi ölçüldü: `src/content/product.ts` 10 modül × ~5 madde + 11 blurb, 4 rol × 5 madde + özet, 8 fayda; `src/content/segments.ts` 32 iddia bloğu — **~124 present-tense yetenek cümlesi**. B-029 beşini yanlış buldu, dördünü doğruladı, kalanı hiç kontrol edilmedi. Somut örnek: B-029'un 1. kalemi ("ölçüm grafiği + diyetisyen notu tek ekranda") `product.ts:129/133/135` olarak sayılmış; aynı yeteneği `product.ts:23-24` (üye rolü maddeleri) ve `chat.ts:97` de **present-tense** anlatıyor ve bunlar listede yok. Kapsam kararı: risk alt kümesi taranır (→ Teknik Kararlar).
- **"Üç yasal beyan" da taban.** `src/content/legal.ts` satır satır okundu: koda/konfige bağlı **en az sekiz** olgu iddiası var. B-060'ın saydığı üçü (`:129` 12 ay · `:203` soru işareti · `:302` gerçek kişi verisi) + beş tane daha: `:100` "sitenin anahtarı yalnız yeni kayıt oluşturabilir, var olan kayıtları okuyamaz" ve "dışarıya açık okuma kuralları kapalı" · `:116` "ölçüm için üçüncü bir tarafa veri göndermiyoruz" · `:195` "çalışması için gerekli olmayan hiçbir çerez yerleştirmez" · `:203` "adınız, telefonunuz, e-postanız ve mesajınız ölçüme gönderilmez" · `:157`/`:234` "otuz gün içinde sonuçlandırılır" (dayanağı B-011'in kendisi — adres posta almıyorsa taahhüt boştur). Faz sekizinin tamamını bağlar (kullanıcı kararı). **Milestone'un "dört beyan" ifadesi bu yüzden alt sınırdır**, hedef küçülmüyor büyüyor.
- **B-034 sınıfı gerçekten tek örnek, ama mekanik kural yanlış kurulursa dört yanlış alarm verir.** Bulgunun koruma önerisi "kırılım öneki taşımayan `flex-1`'i `flex-col` kabında ara" diyor; ölçüldü: depoda yedi `flex-1` var, beşi kırılımsız ve **dördü meşru** (`SegmentsGrid.tsx:50,54` kart gövdesi yüksekliği · `Assistant.tsx:167` akış alanı · `ProductStory.tsx:200` satır kabında genişlik · `Assistant.tsx:150` satır kabında genişlik). Ayırt edici imza dar: **sabit yükseklik sınıfı (`h-*`) + `flex-1` + kolon kabı**. Kural bu imzayla yazılmazsa gürültü üretir.

**Anahtar sızıntısının kapsamı ölçüldü — döndürme bir ölçüme bağlandı.** `.env`'in beş değeri değer basılmadan parmak izlendi (SHA-256 önekleri): `LEAD_STORE_URL` yerel konteyneri gösteriyor (`lead-store:8090`, canlı depo değil), `LEAD_STORE_TOKEN` ile `LEAD_TOKEN_PREVIEW` **bayt bayt aynı**, `LEAD_TOKEN_PRODUCTION` ayrı bir 64-hex. `tasks/archive/TASK-1.17.md:146` bu iki token'ın bu makinede `openssl rand -hex 32` ile üretildiğini yazıyor; `tasks/archive/TASK-1.18.md:150,184` canlı `IP_HASH_SALT`'ın Vercel'e **boru içinden** girildiğini ve hiçbir yere kaydedilmediğini yazıyor. Üçü birlikte şunu söylüyor: **imaja giren beş değerin hiçbiri canlı değil.** Tek üretim imajı bugün 15:30'da derlendi (TASK-1.18'den sonra) ve makineden çıkmadı. ⚠️ Kesin teyit, sunucudaki `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PREVIEW` / `LEAD_TOKEN_PRODUCTION` değerlerinin **parmak iziyle** karşılaştırılmasıdır (tek satır, hiçbir değer görünmez; sunucu kuralları `../altyapi/vps/CLAUDE.md`). Milestone'un "iki anahtar döndürülmüş" ayağı bu karşılaştırmaya bağlıdır: eşleşmezse döndürme düşer ve ayak o gün yeniden yazılır (kullanıcı kararı, research 2026-09-22).

**Ad temizliğinde sıra tuzağı.** B-018'in "Gizem Ö." ve "Simge & Gizem" kalemleri için tabloya çıplak ilk ad eşlemeleri girecek. `REPLACEMENTS` düz metin değişimidir: "Gizem" → "Yasemin" kuralı "Gizem Örge" kuralından **önce** koşarsa sonuç "Yasemin Örge" olur. Eşlemeler **en uzun önce** sıralanmalı, ve düşürme (`DROP_NODES`) zaten değişimden önce koştuğu için düşen düğümlerdeki adlar hiç görülmez (`render-product.mjs` içi yorum).

**İddia sözlüğü demo verisini de vuracak.** `₺…B/ay`, `+%NN`, "en hızlı", "rekor" kalıpları ürün ekranlarının **meşru** gösterge verisine de değebilir (finans ekranı ciro gösterir — bu ürünün işlevidir, iddia değil). Ayraç: **projeksiyon / üstünlük / büyüme kıyası** yasak, nötr gösterge değeri serbest. Ekran bazlı izin listesi (`AUDIT_ALLOW` deseni) bu ayrımı taşır; kapı önce boş izin listesiyle koşulup raporladığı her kalem kaynakta aranır (v2 tablosunun `grup`/`sube` için kurduğu yöntem, `screen-cleanup-v2.mjs:63-88`).

**Düşürülecek yol haritası kalemleri `src/content/`'ten beslenemez.** B-018'in koruma önerisi temizliğin "Yolda" listesinden beslenmesini istiyor; araştırma konteyneri `src/`'i görmüyor (yukarıda ölçüldü) ve `src/content/*.ts` TypeScript. Bu fazda kalemler `research/lib/` içinde elle tutulur; listeyi kaynaktan beslemek bağlama değişikliği ya da üretilmiş bir JSON ara katmanı ister — o iş bu fazda **açılmaz**, kaydı burada durur.

**"Kampanyalar" ortak kabuktadır, ekran başına değil.** Kaynak HTML'lerde altı dosyada birer geçiş (`cockpit`, `takvim`, `grup`, `finans`, `antrenor`, `raporlar`, `uye`), hepsi sol menüde `<a>` olarak; `uye-telefon` çıktısı `takvim.html`'in `.phone` kökünden üretildiği için menüyü taşımaz. Düşürme kuralı ekran başına tekrarlanmak yerine ortak kabuk kuralı olarak yazılmalı. `"Yenileme & Churn"` tek yerde: `../Alpfit.v1/demo/raporlar.html:242`.

**Tarayıcı katmanı bu fazda otomatik ölçülmüyor — bilinçli.** Fazın çekirdek teslimlerinden ikisi (B-055 mobil onay/hata, B-034 dokunma hedefi) gerçek tarayıcı yerleşimi ve odağıyla belirlenir; projenin otomatik katmanı (`vitest`, `environment: "node"`) bu katmanı **ölçmüyor** ve `mobile-audit.mjs` etkileşim durumuna hiç bakmıyor. Kalıcı tarayıcı betiği kapsam kararıyla "Kalite kapıları otomatik" fazına bırakıldı (→ Kapsam Dışı). Bu fazda doğrulama kanalı: düzeltme sırasında scratchpad'e yazılan geçici Playwright betiğiyle **rakamlı ölçüm** (320/360/390/412 genişlik × hata türleri × onay yolu), UAT'ta ise manuel kol. Task test kriterleri bu kanala göre yazılır.

**Tanımlayıcı kaynakları** (plan ve verify-plan bunu buradan okur):

| Tanımlayıcı | Kaynak |
|---|---|
| Yetenek/yol haritası sabiti | **yeni** — `src/content/product.ts` |
| Yasaklı iddia sözlüğü dosyası | **yeni** — `research/lib/` altında |
| `RETENTION_MONTHS` | **dış** — `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` |
| Yasal beyan testinin env kapısı | **yeni** — `.env.example`'a slot adı eklenir, değer yazılmaz |
| `data-exclude-search` | tanımlı — `src/app/layout.tsx:181` |
| `scroll-padding-top: 5.5rem` | tanımlı — `src/app/globals.css:124` |
| `ERROR_ID` (`demo-form-error`), `FIELD_ERRORS`, `aria-invalid` | tanımlı — `src/components/sections/DemoForm.tsx:20-28, 203-204, 286-301` |
| `SURFACES.demoForm`, `track()` | tanımlı — `src/lib/analytics.ts` |
| `REPLACEMENTS` · `INITIALS` · `DROP_NODES` · `AUDIT_ALLOW` · `auditTexts` | tanımlı — `research/lib/screen-cleanup-v2.mjs` |
| `SCREENS` (7 çıktı, 6 kaynak HTML) | tanımlı — `research/scripts/render-product.mjs:23-43` |
| `notify_lead` / `notify_team` | **dış** — depo şeması, v1 `pocketbase/pb_hooks/` |
| `LEAD_STORE_URL` · `LEAD_STORE_TOKEN` · `IP_HASH_SALT` · `LEAD_TOKEN_PREVIEW` · `LEAD_TOKEN_PRODUCTION` | tanımlı slot adları — `.env.example` §1, §3 (değer yok) |
| Sunucudaki karşılaştırma kaynağı | **dış** — `/opt/alpfit-lead/.env` (salt okuma) |
| Hedef MX kayıtları | **dış** — Squarespace DNS bölgesi; referans küme `kiwiailab.com` |

---

### Teknik Kararlar

- **Yetenek listesi `src/content/product.ts`'te üç kademeli tek sabit olur; beş ev oradan okur.** Gerekçe: tüketicilerin dördü kalemleri düzyazıda virgülle bağlıyor (ölçüldü), yani liste → düzyazı türetmesi kayıpsız. `PRODUCT_STATUS.modules` de aynı listeden türer — B-040'ın "dört evde ayrışmış" ve "8/10 modül" kalemleri böylece aynı hamlede kapanır. `fiyat` sayfasının "(yol haritasında)" ekli iki kalemi listenin alt kümesidir, kendi metnini yeniden yazmaz.
- **Kapsam: liste + riskli alt küme taraması** (kullanıcı kararı, research 2026-09-22). Ürün deposunun kendi "Yakında / v1.5 / W8 / ertelendi" notlarından konu sözcükleri çıkarılır ve sitede o konulara değen cümleler taranır. ~124 cümlenin tamamının doğrulanması **bu fazda yapılmaz**; ölçüm ve gerekçesi yukarıda, kalan yüzey kanvasta durur.
- **Görsel denetimin ad dalı temizlik tablosundan beslenir, kalıptan değil**; ikinci bir dal olarak yasaklı iddia sözlüğü eklenir ve sözlük `research/lib/` altında **tek dosyada** yaşar. Gerekçe: `research/` iki konteynerin ortak gördüğü tek dizin (ölçüldü), yani M6 F6.4'ün metin denetimi aynı dosyayı devralabilir.
- **Yasal beyan testi sekiz olgunun tamamını bağlar** (kullanıcı kararı). Yedisi depo içinden doğrulanır; "12 ay" dalı komşu depoya salt-okunur bağlamayla ve **env kapısıyla** gelir — anahtar tanımsızken dal atlanır, `npm test`'in geri kalanı etkilenmez (`tests/lead-store.contract.test.ts`'in kurduğu desen).
- **`notify_lead` artık gerçek sonucu taşır** (kullanıcı kararı): gönderildi / gönderilemedi / ziyaretçi e-posta vermedi. Gerekçe: 2026-09-14 «Bildirim durumu» kararının dayanağı *"v2 talep sahibine e-posta göndermiyor"* idi; onay e-postası bu fazda açıldığı için dayanak düştü ve alanın kalıcı `pending` kalması alan adı geçişinden sonra iki dönemin kaydını okunamaz kılardı. Karar `docs/DECISIONS.md`'ye yeni kayıt olarak yazılır, eskisi geçersiz kılınır.
- **Anahtar döndürme sunucudaki parmak izi karşılaştırmasına bağlandı** (kullanıcı kararı). `.dockerignore` düzeltmesi ve `web-prod`'a bilinçli env verilmesi **koşulsuz** yapılır; döndürme yalnız karşılaştırma canlı değer gösterirse yapılır. Gerekçe ve ölçüm → Dikkat Edilecekler.
- **Mobil onay/hata görünürlüğü tek mekanizmayla çözülür:** durum değişiminde sonuç öğesine odak taşınır (`tabIndex={-1}` + `focus()`); mevcut genel `scroll-padding-top` offseti zaten uygular, yeni bir `scroll-margin-top` **eklenmez**.
- **MX kaydı olarak klasik beş kayıtlı Google kümesi girilir** (`kiwiailab.com`'da bugün çalıştığı ölçüldü). DNS adımı kullanıcıdadır; faz yönergeyi yazar, kaydı DoH ile ölçer ve **gerçek bir test postasıyla** doğrular.
- **B-034 düzeltmesi iki satırdır** (`flex-1` → `sm:flex-1`, `PriceCalculator.tsx:164,167`); mekanik kural eklenecekse imza "sabit yükseklik + `flex-1` + kolon kabı" olur, yalnız "kırılımsız `flex-1`" değil (dört yanlış alarm ölçüldü).

---
