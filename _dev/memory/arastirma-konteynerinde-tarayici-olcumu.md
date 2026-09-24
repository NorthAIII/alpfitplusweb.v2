# Araştırma konteynerinde tarayıcı ölçümü — betik scratchpad'de, repoya yazmadan

Playwright ve `sharp` **yalnız araştırma konteynerinde** var (`Dockerfile.research`); ana
makinede ve `web` konteynerinde yok. Konteyner `./research` klasörünü `/work` olarak mount
ediyor, yani hazır ölçüm betikleri (`research/scripts/*.mjs`) oradan koşuyor — ama **kendi**
geçici betiğini oraya yazmak repoya dosya bırakmak demektir.

Yol (audit-product 2026-09-12 turunda doğrulandı, 9 ajan + orkestratör bu tarifle koştu):

```bash
SP=<scratchpad>/audit                      # betiğini buraya yaz: import { chromium } from 'playwright'
cd "/home/kivanc/projects/Alpfitplus website.v2"
timeout 900 docker compose --profile research run --rm --name audit-<etiket> \
  -v "$SP:/audit" research node /audit/<ad>.mjs
```

- **`--name` her koşumda farklı olmalı.** `docker-compose.yml` `container_name: alpfitplus-research`
  taşıyor; eşzamanlı iki koşum aynı adı isterse ikincisi hata verir. Paralel ajan/oturum varsa
  ad çakışması ilk kırılma noktasıdır.
- Konteyner `network_mode: host` → `localhost:3000` (dev) ve `localhost:3100` (üretim imajı)
  doğrudan erişilir; ek port yayımlamak gerekmez.
- `-v` ile mount edilen scratchpad yolu **ana makine yolu** olmalı; konteyner içinde `/audit`.
- Hazır kapı betiklerini koşturmak için mount gerekmez:
  `docker compose --profile research run --rm --name <ad> research node scripts/<betik>`.
  Ama `scan.mjs`, `render-product.mjs`, `photos-build.mjs`, `brand-assets.mjs`, `font-subset.mjs`
  ve `capture.mjs`/`hero.mjs`/`demo-shots.mjs` **`research/out/` altına dosya YAZAR** — denetim
  turunda koşturulmaz, kaynakları okunur.
- Ana makinede Node 24 var (`node -v`), yani tarayıcı gerektirmeyen saf ölçümler (regex probe,
  `.ts` import ederek graf çıkarma) doğrudan ana makinede koşabilir; konteyner yalnız tarayıcı
  ve `sharp` için gerekir.

## Denetim zemini — salt okunur sınırlar

- `localhost:3000` dev sunucusu **birincil hedef** (kaynak ağacın canlı hâli).
- `localhost:3100` üretim imajı: yalnız tazeliği teyit için; bayatlık kalıcı bir bulgudur
  (`BULGULAR.md` → B-019) ve `perf.mjs`/`font-guard.mjs` varsayılan olarak onu ölçer.
- `https://alpfitplus-web-v2.vercel.app` önizleme: **yalnız GET/gözlem**, yazan istek yok.
- `alpfitplus.com` (v1) ve `../Alpfit.v1`, `../Alpfitplus-website.v1`, `../alpfit-plus-satis`:
  dokunulmaz, salt okunur.
- Vercel CLI/REST **okuma** serbest (proje ayarları, dağıtım listesi, env **adları**);
  `vercel env pull` ve `vercel link` dosya yazar, kullanılmaz. Token `auth.json`'dan okunur ve
  ekrana yazılmaz — konumu [Vercel proje kimlikleri](vercel-proje-kimlikleri.md)'nde.
- DNS: sandbox'ta UDP DNS kapalı, `dig @sunucu` sessiz boş döner. DNS-over-HTTPS kullanılır
  (`dns.google/resolve` + doğrulama için `cloudflare-dns.com/dns-query`).
- `npm run build` **koşturulmaz**: `.next` isimli hacim `web` servisiyle paylaşılır ve çalışan
  geliştirme sunucusunun derlemesini ezer (kurulumu
  [Alternatif env ile üretim derlemesi](alternatif-env-ile-uretim-derlemesi.md)).
- Saf fonksiyonlar artık `web` konteynerinde `npm test` (Vitest, `tests/`) ile sınanır —
  ayrı bir betik/kopyalama tarifi gerekmez (TASK-1.16).

## Ekran ekran DOM taraması — geometri kaydırmadan bağımsızdır (TASK-3.01, 2026-09-24)

Sayfayı `0,9 × viewport` adımlarla gezip **her adımda tüm DOM'u** taramak ölçümü
kullanılamaz hâle getirir: her adımda `getComputedStyle` ile ata zinciri yürünürse
16 rota × 5 genişlik **~2 saat** sürer (ölçüldü). Oysa `reducedMotion: 'reduce'`
altında kırpma / taşma / ızgara / ekran-dışı-kontrol geometrisi **kaydırma
konumundan bağımsızdır** — `.reveal` geçişleri `.01ms`'e indiği için yerleşim
oturur ve yatay geometri hiç değişmez (reveal yalnız `translateY` + `opacity`).

Doğru kurulum — aynı sonucu **4 dakikada** verir (`kirpilmis=19` değişmedi):

- **Geometrik ölçüm:** rota+genişlik başına **tek tam-belge geçişi**, ekran ekran değil.
- **Stil önbelleği:** `const SC = new Map()` + `st(el)` sarmalayıcı; aynı elemana
  ikinci kez `getComputedStyle` çağrılmaz.
- **Ata yürüyüşleri memoize edilir** (opaklık zinciri, yapışkan zinciri, animasyon
  zinciri) — özyineleme + `Map`, her düğüm bir kez hesaplanır.
- **Üst üste binme taraması** yaprakları `top`'a göre sıralar ve
  `if (b.top >= a.bottom) break;` ile erken çıkar — O(n²) pratikte doğrusala iner.

Ekran ekran gezinti yine de **korunur**, ama yalnız üç iş için: tembel içeriği
uyandırmak, adım saymak, her ekranda sayfa yatay kaydırmasını ölçmek.

⚠️ **Yapışkan/sabit katman ekran ekran ölçümde her adımda yeniden görünür.**
İlk koşumda üst-üste-binme kovası 28 sahte pozitif verdi ve hepsi Header'ın
"Plus" yaprağıydı. Zincirde `position: fixed|sticky` varsa öğe ölçüm dışına
alınır **ve ayrı sayılır** — bu bir çözüm değil, kayıtlı borçtur (`BULGULAR.md`
→ B-063).

⚠️ **Sınır kutusu çakışması görsel çakışma DEĞİLDİR.** Satır-kutusu payı
(`line-height` > glif yüksekliği), döndürülmüş öğenin eksen-hizalı kutusu ve
mockup içi mikro-tablolar sahte pozitif üretir. 80 kombinde 4 aday çıktı, **1'i
gerçekti**; ayırt etmenin tek güvenilir yolu hedefe **kaydırıp kırpılmış ekran
görüntüsü** almaktır (kaydırmadan `clip` vermek "Clipped area is either empty or
outside the resulting image" ile düşer — belge koordinatını al, `scrollTo` yap,
sonra yerel koordinatla kırp).

## JS kapalı sayfada page timer'ı hiç ateşlenmez — adımlamayı Node sürer (TASK-3.02, 2026-09-24)

`javaScriptEnabled: false` bağlamında `page.evaluate` **çalışır** (ölçüldü: DOM sorguları,
`getComputedStyle`, hatta `window.scrollTo` hepsi doğru sonuç verir) — ama sayfanın
**zamanlayıcıları çalışmaz**. Yani `evaluate` içine konan

```js
await new Promise((r) => setTimeout(r, 20));   // ← JS kapaliyken ASLA cozulmez
```

sonsuza kadar asılır ve `page.evaluate`'in **varsayılan zaman aşımı yoktur**: koşum hata
vermeden donar. Ölçüldü (2026-09-24): tur betiği JS-kapalı ayağının ilk sayfasında dondu,
49 dakika boyunca %0,02 CPU'da bekledi, tek bir satır bile basmadı. Teşhisin ayırt edicisi
`docker stats` — asılı koşum CPU'suzdur, yavaş koşum değildir.

Doğrusu: **bekleme Node tarafında**, sayfa içinde değil.

```js
for (let i = 1; i <= n; i++) {
  await p.evaluate((y) => window.scrollTo(0, y), hedefY);  // senkron, JS kapaliyken de calisir
  await new Promise((r) => setTimeout(r, 45));             // Node'un kendi timer'i
}
```

⚠️ **Çıktıyı ayak ayak yaz.** Aynı koşumda tamamlanmış yedi bağlamın sonucu tek dosyaya
sonda yazılacağı için asılma anında hepsi birden kayboldu ve yeniden ölçmek gerekti.
Uzun turda her ayak kendi dosyasına yazılır.

## Hareket azaltma animasyonun ADINI bırakır, SÜRESİNİ sıfırlar (TASK-3.02, 2026-09-24)

`globals.css:232` `prefers-reduced-motion: reduce` altında `animation-duration: .01ms` ve
`animation-iteration-count: 1` dayatıyor. Sonuç: animasyonlu eleman **bitmiş** durumda
durur ve `document.getAnimations()` onu koşar göstermez — ama `animationName` **yerinde
kalır** (`marquee`, `pulse-ring`).

Bu, kırpma/taşma dedektörünün muafiyet ölçütünü belirler: muafiyet **ada** bakmalı,
**süreye değil**.

```js
const own = s.animationName && s.animationName !== 'none';          // DOGRU
const own = s.animationName !== 'none' && parseFloat(s.animationDuration) > 0.05;  // YANLIS
```

Ölçüldü: süreye bakan sürüm, hareket azaltma altında koşan turda 390 px'te **18 sahte
pozitif** verdi ve **hepsi** kayan tanıtım şeridinin (`Marquee`) etiketleriydi — taşma
2.638 px'e kadar çıkıyordu, yani "gerçek" görünecek kadar büyüktü. Ada çevrildikten sonra
aynı koşum **0** verdi.

⚠️ **Bunu yakalayan şey kalibrasyon koşumuydu, gözden geçirme değil.** Devralınan bir
rakama karşı koşulan bir tur (T1: *"390 px'te kırpılan 0"*) sahte pozitifi ilk turda
görünür yapar. Yeni bir dedektör kurarken **her zaman** kayıtlı bir rakamı yeniden üreten
bir kol koştur; "0 buldum" ile "bakmadım" ancak böyle ayrışır.

## Locator tuzağı — aynı metin iki yerde (TASK-2.11, 2026-09-23)

Sitenin **asistan paneli ve SSS akordiyonu aynı soruları taşıyor** ("Ürün hangi aşamada?",
"Turnike…"). `page.getByRole('button', { name: soru })` bu yüzden **iki** düğme buluyor;
`.first()` sayfadaki SSS düğmesine gidiyor, asistan hiç açılmıyor ve betik **hatasız**
"konsol temiz" basıyor — yani ölçüm sessizce hiçbir şey ölçmüyor. İki koşum bu yüzden boş
döndü. Locator panele daraltılır:

```js
const panel = p.getByRole('dialog');
await panel.getByRole('button', { name: soru, exact: true }).click();
const metin = await panel.evaluate((el) => el.innerText);
```

Ayrıca **asistan tek soru-cevap gösteriyor**: ikinci soruyu tıklamak birincinin cevabını
değiştiriyor. Her düğümün metnini ayrı sayfa/bağlamda ölç.

⚠️ **Asistan metni HTML'de ve paket dosyasında ARANMAZ.** Cevaplar `product.ts`'ten şablonla
türediği için (TASK-2.11) hem sunucu HTML'inde hem de JS chunk'ında yalnız `${...}` çağrıları
duruyor; render edilmiş cümle **yalnız tarayıcıda** oluşur. `grep` ile "yeni cümle var mı"
diye bakmak boş döner ve yanlışlıkla "değişmemiş" diye okunur.

## Gezinme ölçümü `load` ile YAPILMAZ — `waitForURL` gerekir (TASK-3.16, 2026-09-24)

Bir bağlantının gerçekten doğru sayfaya gidip gitmediğini ölçerken refleks şudur:

```js
await el.click();
await p.waitForLoadState("load");        // ← YUMUSAK GEZINMEDE HIC ATESLENMEZ
console.log(new URL(p.url()).pathname);  // hala ESKI sayfayi basar
```

Site Next.js App Router kullanıyor: iç bağlantılar **istemci-taraflı** gezinir, belge
yeniden yüklenmez ve `load` olayı bir daha ateşlenmez. `waitForLoadState("load")` zaten
tamamlanmış eski yüklemeyi görüp **anında döner**; ardından okunan `p.url()` henüz
güncellenmemiş olabilir. Ölçüldü (TASK-3.16): başlıktaki "Demo" bağlantısı `/fiyat`'ta
tıklandı, ölçüm `/fiyat` yazdı — bağlantı **doğru çalışıyordu**, yanlış olan ölçümdü.
Doğrusu hedefi adıyla beklemektir:

```js
await el.click();
await p.waitForURL("**/demo", { timeout: 15000 });
const h1 = await p.locator("h1").first().textContent();   // varista IKINCI bir capa
```

⚠️ Aynı turda ikinci tuzak: `header a[href="/demo"]` **iki** eleman eşliyor — masaüstü
"Demo İste" düğmesi (`lg:` altında `display:none`) DOM'da önce geliyor, Playwright onu
seçiyor ve tıklama "element is not visible" ile **zaman aşımına** düşüyor. Bu, yukarıdaki
"aynı metin iki yerde" tuzağının **aynı href / farklı kırılım** hâlidir; çare aynı:
`p.locator('header a[href="/demo"]:visible').first()`.

## İzleyici ve hidrasyon sınamaları (audit-product 2026-09-13'te doğrulandı)

- **Umami izleyicisi canlı kuruluma veri göndermeden sınanır.** `umami.kiwiailab.com` kullanıcının
  canlı sunucusudur. `script.js` bir kez GET ile indirilir, tarayıcı
  `--host-resolver-rules=MAP umami.kiwiailab.com ~NOTFOUND` ile açılır, betik `page.route` ile yerel
  kopyadan verilir, `**/api/send**` yakalanıp `abort` edilir. Yakalanan gövde incelenir.
- **Başsız Chromium'un UA'sı (`HeadlessChrome`) Umami'de bot sayılır:** `/api/send` kayıt yazmadan
  `200 {"beep":"boop"}` döner. "2xx aldım" kaydın yazıldığını kanıtlamaz; gövdeye bak ya da UA değiştir
  (bkz. `BULGULAR.md` → B-056).
- **Hidrasyon öncesi davranış sınanırken yalnız `.js` geciktirilir.** `**/_next/static/chunks/**`
  deseni dev'de CSS'i de tutar, boyama ve DCL bekler. "Görünür ama hidrate değil" hâli yerine
  boyanmamış sayfa ölçülür, tıklama hidrasyondan sonraya düşer.
- **Çapraz-kökenli isteğin gerçek boyutu `Resource Timing API`'den ÇIKMAZ.** `umami.kiwiailab.com`
  gibi başka bir kökene giden istekte `performance.getEntriesByType("resource")`'ın `transferSize`/
  `encodedBodySize` alanları, yanıt `Timing-Allow-Origin` başlığı taşımadığı sürece **sessizce 0**
  döner (hata yok, sadece yanlış rakam). Gerçek tel-üzeri bayt için CDP `Network` alanına geçilir:
  `ctx.newCDPSession(page)` + `Network.enable`, `Network.loadingFinished` olayının
  `encodedDataLength`'i (TASK-1.09, Umami betiği + olay isteği ağırlığı ölçümü).

## Locator tuzağı — açık `role` niteliği rolü ezer (TASK-2.12, 2026-09-23)

`Roles` bölümünün sekmeleri `<button role="tab">`. Playwright'ın rol
çözümlemesi **açık `role` niteliğini** esas alır, etiket adını değil: bu
yüzden `getByRole('button', { name: /Diyetisyen/i })` **0 eşleşme** döner ve
betik hata vermeden "sayfada 2 buton var" basar — ölçüm sessizce hiçbir şey
ölçmez. Doğrusu `getByRole('tab', …)`. Kardeş tuzak yukarıdaki asistan/SSS
maddesidir; ortak ders: **locator boş dönünce betik yeşil kalır**, o yüzden
önce "kaç eşleşme buldum" yazdırılır.

Ayrıca **sekmeli bölümlerde yalnız aktif sekmenin içeriği render edilir**
(`Roles` bir istemci bileşeni, `useState(0)`). `SHOTS.antrenor`'un `alt`
metni ilk HTML'de **hiç yok** — `curl | grep` ile bakan bir ölçüm onu
"değişmemiş" sanır. Sekme tıklanıp DOM'dan okunur.

## `next/image` src'i yeniden yazar — dosya adına bakan seçici boş döner (TASK-2.13, 2026-09-23)

Ürün görsellerini DOM'dan ararken **`img[src*="/product/"]` hiçbir şey bulmaz.**
`next/image` `src`'i optimize ediciye çevirir ve yolu URL-kodlar:

```
/_next/image?url=%2Fproduct%2Fantrenor.webp&w=3840&q=75
```

Yani dosya adı `src` içinde **var ama kodlanmış** — `%2F` yüzünden `/product/`
alt dizgesi hiç geçmez. Seçici sessizce 0 eşleşme döndürür, betik hatasız
"görsel bulunamadı" basar ve bu kolayca *"görsel sayfada yok"* diye okunur.
Doğrusu tüm `img`'leri alıp `src`'i çözmektir:

```js
const imgs = await p.$$eval('img', (els) => els.map((e) => ({
  src: decodeURIComponent(e.getAttribute('src') || ''),
  alt: e.getAttribute('alt'),
})));
const hedef = imgs.find((i) => i.src.includes('/product/antrenor.webp'));
```

Yukarıdaki iki locator tuzağıyla **aynı aile**: ortak ders yine *bulamayan
ölçüm yeşil kalır*. Bulunan sayıyı (`imgs.filter(...).length` ya da eşleşen
dosya adları) her koşumda yazdır; "0 buldum" ile "yok" aynı şey değildir.

**Hangi sekme hangi görseli gösteriyor, varsayılmaz — `Roles.tsx` okunur.**
Eşleme birebir değil: `diyetisyen: SHOTS.antrenor`, `antrenor: SHOTS.takvim`
(`Roles.tsx:12-15`). "Antrenör sekmesine tıklayıp antrenör görselini ölçmek"
boş döner.

## `-v` ile mount noktası `/work`'ün İÇİNE düşerse repoya boş dosya bırakır (TASK-2.14, 2026-09-23)

Yukarıdaki tarif betiği `/audit` gibi **ayrı** bir yola bağlıyor ve gerekçesi
tam olarak budur. Betiği `/work`'ün altına bağlamak — `-v "$SP/probe.mjs:/work/probe.mjs:ro"`
— sessizce **ana makinenin `research/` klasörüne 0 baytlık bir yer-tutucu yaratır**
(sahibi `root`). Docker bind-mount hedefi yoksa onu oluşturur ve `/work` zaten
`./research`'e bağlı olduğu için o dosya repoda doğar. Konteyner çıkınca mount
kalkar, **yer-tutucu kalır** ve `git status`'ta izlenmeyen dosya olarak görünür;
fark edilmezse bir sonraki commit'e girer.

Ölçüldü (2026-09-23): iki sonda betiği `/work/probe*.mjs` olarak bağlandı,
koşumlar doğru çalıştı, ardından `research/probe-derive.mjs` ve
`research/probe2.mjs` **0 bayt, root sahipli** olarak ağaçta kaldı.

Doğrusu iki hâlden biri:

```bash
# (a) mount noktasi /work'un DISINDA  → repoya hicbir sey dusmez
docker run --rm -v "$PWD/research:/work" -v "$SP:/probe:ro" -w /work \
  alpfitplus-web-research node /probe/probe.mjs        # import: '/work/lib/…'

# (b) hattin CIKTI dizinini scratchpad'e cevir — ayni mekanizmanin mesru kullanimi
docker run --rm -v "$PWD/research:/work" -v "$SP/out:/work/product-out" …
```

(b) meşrudur çünkü `product-out` **zaten var**: mevcut bir dizinin üzerine
bağlanmak yer-tutucu yaratmaz, yalnız içeriğini gölgeler. Kural dosya/dizin
ayrımı değil, **hedefin var olup olmadığıdır** — yoksa yaratılır.

Aynı yöntem sonda için de doğrudur: `research/lib`'in **kopyasını** bozup
`-v "$SP/libP1:/work/lib:ro"` ile bağlamak repoya dokunmaz (dizin var), ve
kaynak yerine **girdiyi** bozma disiplinini korur.

### Aynı kural `web` konteynerinde de geçerli — ve KAYNAK tarafında bir ikizi var (TASK-2.19, 2026-09-23)

Yukarıdaki tuzak araştırma konteynerine özgü değil: **`web` servisi de deponun
kendisini bind-mount ediyor** (`.:/app`), yani `/app`'in içine açılan her mount
noktası aynı şekilde **repoda root sahipli boş bir dizin bırakır**. Ölçüldü
(2026-09-23): `-v <kaynak>:/app/ic-baglama:ro` koşumdan sonra host tarafında
`ic-baglama/` (root, boş) kaldı; aynı kaynak `/opt/dis-baglama` olarak
bağlandığında **hiçbir iz kalmadı**. Komşu depo bağlaması bu yüzden
`/opt/v1-pb-hooks`'ta durur, `/app/...` altında değil.

**Kaynak tarafı — compose eksik bind kaynağını sessizce YARATIR.** Hedefin
yokluğu gibi, kaynağın yokluğu da hata değildir: `docker compose up` host'ta o
yolu **root sahipli boş dizin** olarak açar ve konteyner **yine kalkar**
(ölçüldü 2026-09-23, tek fark dizinin boş olmasıdır). Sonuç iki yönlü:

- Komşu deposu olmayan bir makinede `up -d web` repo dışında iskelet bir dizin
  ağacı doğurabilir — bağlamayı **var olan** bir kaynağa yaz.
- Bağlamadan **okuyan** her kapı bu yüzden fail-closed kurulur: boş dizin
  "dosya yok" demektir, "sorun yok" değil. `tests/legal-consistency.test.ts`
  dal 9 tam bunu yapar (anahtar tanımlıyken dosya yoksa kırılır, atlamaz).

**Salt okunurluk yazma DENENMEDEN ölçülür:** `fs.accessSync(yol, W_OK)` `:ro`
bağlamada `EROFS` fırlatır, `rw` bağlamada geçer (ölçüldü, uid 0). Dokunulmaz
bir depoya karşı "yazabiliyor muyum?" sorusunun tek güvenli sorulma biçimi
budur — gerçek bir yazma denemesi, başarılı olduğu anda yasağı çiğnemiş olurdu.

## Kapıyı sınamak için sahte hedef — statik site + `network_mode: host` (TASK-3.03, 2026-09-24)

Bir ölçüm kapısının kendisini sınamak (bozuk girdi · boş kapsam · yeşil ayak)
**kaynağa değil girdiye** dokunmayı ister. Bu projede bunun düzeneği hazır:
`research` servisi `network_mode: host` taşıyor, yani araştırma konteyneri
host'taki **her** portu `localhost` üzerinden görür. Sahte hedef bu yüzden
konteyner gerektirmez:

```bash
SP=<scratchpad>/sinama/<varyant>
# 16 rotanin dizin agaci + istenen govde
for r in / /ozellikler ... /olmayan-sayfa; do mkdir -p "$SP$r"; printf '%s' "$GOVDE" > "$SP$r/index.html"; done
# sitemap.xml: <loc> MUTLAK adres olmali (gercegin aynisi) — kapi yolu kendisi cikarir
python3 -m http.server 3457 --bind 127.0.0.1 --directory "$SP" &
docker compose --profile research run --rm -e BASE=http://localhost:3457 research node scripts/<kapi>.mjs
```

- **Port:** 3000 (dev) · 3100 (üretim provası) · 3200 (alternatif derleme) ·
  8090 (lead deposu) dolu, **3001 makinede başka bir projede**. 3457 kullanıldı.
- **`<loc>` mutlak yazılır** (`https://alpfitplus.com/...`) — gerçek sitemap
  öyle; sahte hedef gerçeğin yolunu taklit etmezse kapının ayrıştırıcısı sınanmaz.
- **Sondaların ayrı ağaçları olur, tek ağaç değiştirilmez.** Her varyant kendi
  dizininde durur ve sunucu `--directory` ile ona bakar; böylece bir sondanın
  gövdesi ötekine sızmaz.
- **Sunucu her sondadan sonra kapatılır ve kapanma POZİTİF KONTROLLE ölçülür:**
  durdurmadan önce port dolu görülür, durdurulduktan sonra aynı `curl` ile boş
  görülür. `kill` sessizce başarısız olabilir; "kapattım" bir ölçüm değildir.
- ⚠️ **Boş gövde ile "ölçülemez gövde" farklı sondalardır.** a11y'nin kapsam
  eşiğini yalıtmak için `<h1 aria-hidden="true">` kullanıldı: `h1` sayımı 1
  kalır (yani `TOPLAM SORUN` sıfır çıkar) ama ölçülebilir metin sıfırdır —
  fail-open tam orada görünür. Tamamen boş gövde iki eşiği birden ateşler ve
  hangisinin çalıştığını söylemez.

## Kaydırma ve kare alma iki sessiz yarış taşır — ikisi de SAHTE KIRMIZI üretir (TASK-3.04, 2026-09-24)

Ekran ekran gezen her ölçüm (kontrast, kırpma, ilk-ekran turu) DOM okumasıyla ekran
karesinin **aynı anı** gösterdiğini varsayar. Bu varsayım bu projede iki ayrı yerden
kırıldı ve ikisi de sessizce "ölçülemedi" üretti, hata vermedi.

**1. `scroll-behavior: smooth` hareket azaltmayla KAPANMAZ.** `globals.css:135`
`html{scroll-behavior:smooth}` taşıyor; `prefers-reduced-motion: reduce` bloğu
(`:232`) yalnız `animation-duration`, `animation-iteration-count` ve
`transition-duration`'ı sıfırlıyor — kaydırmaya dokunmuyor. Yani `reducedMotion:
'reduce'` bağlamında bile `window.scrollTo(0, y)` bir **animasyon** başlatır;
kısa bir beklemeden sonra okunan `getBoundingClientRect` ile alınan kare farklı
konumu gösterir. Ölçüldü: sayfaların altındaki **25 eleman** tek piksel bile
üretmedi ve "ölçülemedi" diye kırmızıya düştü (`/kullanim-kosullari`'nda 04·05·06
bölümlerinin tamamı).

```js
await p.addStyleTag({ content: "html{scroll-behavior:auto !important}" });  // kosma
// ve KOSMA TEK BASINA KANIT DEGILDIR — her adimda oturmayi ayrica olc:
await p.evaluate((y) => window.scrollTo(0, y), hedefY);
const d = await p.evaluate(() => ({ y: Math.round(window.scrollY),
  enBuyuk: Math.round(document.documentElement.scrollHeight - window.innerHeight) }));
// beklenen = min(hedefY, max(0, enBuyuk)); sapma > 1 px ise YENIDEN DENE, oturmazsa DUR
```

**2. Stil değişikliği bir sonraki BOYAMAYA kadar kareye girmez — ve kısmen girer.**
`page.addStyleTag()` hemen döner; arkasından alınan kare yalnız **kendi bileşke
katmanı olan** kısmı güncellenmiş gösterebilir. Ölçüldü: glif gizleme stili
eklenip kare hemen alındığında yalnız **yapışkan başlığın** metni silinmişti,
gövde metni kareye görünür girdi — kare çiftinin toplam farkı `/kvkk` adım 1'de
**1.839 piksel**, komşu adımlarda **69.016**. Yani ölçüm "kısmen" yanlış, bu
yüzden de gözle fark edilmez.

```js
const bekleBoyama = (p) => p.evaluate(() => new Promise((r) =>
  requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 0)))));
// her karenin ONUNDE cagrilir (stil eklemeden once de, ekledikten sonra da, kaldirdiktan sonra da)
```

Düzeltmeden sonra aynı adım **45.742** verdi ve **iki ardışık tam koşum birebir aynı**
çıktıyı üretti — belirlenimlilik bu sınıfın tek güvenilir teyididir: bir tur ile
öteki arasında oynayan rakam, ölçülen şeyin değil ölçümün oynadığını söyler.

⚠️ **Her iki arıza da "kapı kırmızı" diye göründü, "kapı bozuk" diye değil.** Teşhis
ancak kapı ölçemediği elemanı **adıyla** bastığı için mümkün oldu; sayı basan bir
kapıda aynı arıza "site bozuk" diye okunup düzeltilmeye çalışılırdı.

## "Bu eleman görünür mü" tek çağrıyla ölçülmez — `display` ile `visibility` ZIT davranır (TASK-3.06, 2026-09-24)

Ekran ölçen her kapı er geç "bu elemanı sayayım mı" sorusuna gelir (başlık dizisi,
kırpma dedektörü, dokunma hedefi…). Refleks `getComputedStyle(el)` okumaktır ve
**yarısı sessizce yanlış cevap verir**:

- **`display:none` bir ATADAYSA elemanın kendi hesaplanmış `display`'i yine kendi
  değerini döndürür** (`"block"`, `"flex"`…). Kalıtılan bir özellik değildir; alt
  ağaçtaki her eleman kendi değerini bildirir. Yani `getComputedStyle(el).display
  !== "none"` kontrolü, gizli bir kabın içindeki elemanı **görünür** sayar.
- **`visibility` ise KALITILIR**, yani hesaplanmış değer ata zincirini zaten taşır —
  `getComputedStyle(el).visibility === "visible"` tek başına doğru cevaptır.

Doğru ölçüt ikilidir ve render edilmişlik **geometriyle** alınır:

```js
if (el.closest('[aria-hidden="true"]')) return false;   // erisilebilirlik agacindan cikmis
if (!el.getClientRects().length) return false;          // display:none (kendisi YA DA atasi)
return getComputedStyle(el).visibility === "visible";   // visibility KALITILIR
```

⚠️ **`sr-only` bu süzgeçten GEÇER ve geçmelidir** — 1×1 px kırpılmış olsa da
`visibility: visible` ve kutusu vardır; ekran okuyucu onu görür. Erişilebilirlik
ölçen bir dalda (başlık sırası, adlandırma) `sr-only` **sayılır**; görsel ölçen bir
dalda (kontrast) sayılmaz — a11y kapısı bunu `minAlan: 16` ile ayırır, `visibility`
ile değil.

⚠️ **Muafiyetin iş gördüğünü AYRICA ölç.** Süzgeç yazmak yetmez: aynı hedefte
süzgeçli ve süzgeçsiz okumayı yan yana koy. TASK-3.06'da ölçüldü — sahte hedefte
süzgeçsiz **368 başlık / 16 atlama**, süzgeçli **320 başlık / 0 atlama**; süzgeç
olmasa 16 sahte ihlal doğuyordu. Süzgecin hiçbir şeyi elemediği hâl de ancak böyle
görülür.

## "Görünür alanı sıfır" gizliliğin kanıtı DEĞİLDİR — kaydırılabilir kapta kayan içerik de sıfır verir (TASK-3.07, 2026-09-24)

Kırpılmış/gizli içeriği sınıflandıran her dal şu kestirmeye uzanır: *"kesildikten
sonra görünür alanı ~0 kaldıysa zaten gizlidir, muaf sayayım."* **Yanlış** — ve
yanlışlığı sessizdir, çünkü sonuç yine "muaf" olur, yalnız **hangi kovaya** düştüğü
değişir.

Ölçüldü (320 px, 16 rota): alana bakan ölçüt **83** kalem yakalıyor; bunların
**66'sı** aslında *kaydırılabilir* kovasına ait — yatay kaydırılabilir bir şeritte
görüş alanının dışına kaymış kartların kesişim alanı da tam tamına 0'dır. Sonuç:
kaydırılabilir nüfus raporda **görünmez** olur ve o dalın kapsam tabanı anlamsızlaşır.

Doğru ölçüt **beyandır**: kesen kutunun kendisi görsel-gizleme deyimini ilan ediyor
mu?

```js
const srOnlyBeyani = (cs, kb) =>
  /inset\(\s*50%/.test(cs.clipPath || "") || (kb.width <= 2 && kb.height <= 2);
```

⚠️ **Tailwind v4'te `sr-only` `clip-path: inset(50%)` yazar, `clip` değil** —
`getComputedStyle(el).clip` bu deyimde `"auto"` döner ve `clip`'e bakan bir ölçüt
hiçbir şey yakalamaz (ölçüldü).

⚠️ **Sınıflandırma SIRASI ölçümün sonucunu değiştirir**, o yüzden bilinçle seçilir
ve gerekçesi yazılır. TASK-3.07'nin sırası: gizli → hareketli şerit →
kaydırılabilir → gerçek. Hareket muafiyeti kaydırılabilirden **önce** gelmeli:
kayan şeridin kesen kutusu `overflow:hidden`'dır, yani kaydırma testi önce koşarsa
şerit "gerçek ihlal"e düşer.

⚠️ **Ölçüm birimini de bilinçle seç — sonucu değiştirir.** Aynı kırpma üç tanımla
ölçüldü: metin **menzili** (`Range`) 9 kalem/66 px · **doğrudan metin taşıyan
elemanın kutusu** 19/70 · **tüm elemanlar** 47/2595. Devralınan bir rakama kalibre
ediyorsan önce o rakamın hangi tanımdan geldiğini bul; bulgu gövdesinde iki tanım
birden yazılı olabilir (B-033'te öyleydi).

⚠️ **"Benzersiz" bir rakam, ölçümün değil GRUPLAMA ANAHTARININ sonucudur — ve bu
tuzak bu projede iki kez ısırdı.** Ölçüm birimi doğru seçilse bile, sonucu
"N benzersiz kalem" diye raporlarken kullandığın anahtar sayıyı değiştirir.
Ölçüldü (TASK-3.08, dokunma hedefi, 390 px × 16 rota): aynı 125 kalem
`etiket|ad` ile **19**, `etiket|ad|en×boy` ile **22**, `etiket|ad|href` ile
**20**, `sınıf|ad` ile **20** benzersiz çıkıyor. Devralınan rakam 19'du ve
yalnız bir anahtar onu üretti.

İki sonucu var:

- **Devralınan bir "N benzersiz" rakamına kalibre ederken anahtarı da ara**,
  ölçüm birimini bulmakla yetinme. Aynı fazda TASK-3.04 bunun öteki yüzünü
  yaşadı: araştırmanın "11 benzersiz gradyan metin" rakamı aslında **tek bir
  rotanın** sayısıydı, 16 rotada 17 benzersiz / 19 eleman çıktı — orada
  saklı değişken anahtar değil **kapsamdı**. Ölçüt ortak: *benzersiz sayı, üç
  seçimin (birim · anahtar · kapsam) bileşkesidir ve üçü de yazılmadan rakam
  taşınamaz.*
- **Anahtar bilgi kaybettirir; kaybı raporda geri ver.** `etiket|ad` iki farklı
  bileşeni aynı satıra toplayabilir (telefon bağlantısı hem 147×20 hem 350×39
  olarak duruyor). Çare anahtarı şişirmek değil — her benzersiz satırın kendi
  **ölçü varyantlarını** ve kaç rotada göründüğünü basması; düzeltme listesi
  böyle eksiksiz kalır.

## `BASE=http://localhost:3000` ile ara doğrulama dar ekranda SAHTE KIRMIZI basar (TASK-3.09, 2026-09-24)

Ölçüm betikleri varsayılan olarak yayın kopyasına (3100) bakar, ama `BASE` ile
geliştirme sunucusuna yönlendirmek bilinçli olarak açık — düzeltme task'larının
ara doğrulaması için. **O kaçış yolunun ölçülmüş bir bedeli var:** `next dev`
sayfaya kendi geliştirici göstergesini enjekte ediyor ve o **sabit, açık renkli**
katman dar ekranda içeriğin üstüne biniyor; piksel kontrast kapısı onu metnin
**zemini** sanıyor.

Ölçüldü (`/`, 390×844, ürün turunun son adım etiketi `"05 · raporlar"`):

| Hedef | p02 | glif | yargı |
|---|---|---|---|
| `BASE=http://localhost:3000` | **1,35** | 577 px | ✗ sahte ihlal |
| `BASE=http://localhost:3100` (varsayılan) | **9,54** | 489 px | ✓ |

Ayırt etmenin en ucuz yolu — göstergenin izi sayfanın HTML'inde:

```bash
curl -s http://localhost:3000/ | grep -c devtools   # 2
curl -s http://localhost:3100/ | grep -c devtools   # 0
```

Üç şey bu tuzağı sinsi yapıyor:

- **Belirlenimli.** Rakam iki hedefte de oynamıyor (3000'de 3/3, 3100'de 2/2
  birebir), yani "ölçüm gürültüsü" diye elenmiyor — TASK-3.04'ün yarış
  tuzaklarının aksine burada tekrar teyidi hiçbir şey söylemez.
- **Genişliğe bağlı.** 1440 px'te iki hedef **birebir aynı** rakamları veriyor
  (aynı 15 kalem, aynı p02'ler); fark yalnız gösterge içeriğin üstüne bindiği
  dar ekranda doğuyor. Yani "dev ile prod aynı çıkıyor" diye bir kez bakmak
  yanıltır.
- **Kovaya düşmüyor.** Kapının "yapışkan katman borcu" kovası sitenin KENDİ
  sabit katmanlarından türer; dışarıdan enjekte edilen bu katman o muafiyete
  girmez, ihlal olarak sayılır.

**Kural: ara doğrulama 3000'de yapılabilir, ama YARGI her zaman 3100'e aittir**
— ve dar genişlikte çıkan bir ihlal 3100'de tekrarlanmadan gerçek sayılmaz.
Aynı bölümün başındaki B-019 uyarısıyla birlikte okunur: 3100 bayat olabilir,
o yüzden yargıdan önce tazeliği pozitif kontrolle ölç.

## Erişilebilirlik ağacı Playwright'tan DEĞİL, CDP'den alınır (TASK-3.13, 2026-09-24)

"Ekran okuyucu bunu görüyor mu / ilk ne duyuruluyor" sorusunun refleks cevabı
`page.accessibility.snapshot()`tur ve bu kurulumda **yoktur** — API kaldırılmış,
çağrı `TypeError: Cannot read properties of undefined (reading 'snapshot')` ile
düşer. Ağaç CDP'den alınır:

```js
const cdp = await ctx.newCDPSession(p);
await cdp.send("Accessibility.enable");
const { nodes } = await cdp.send("Accessibility.getFullAXTree");
```

⚠️ **Dönen dizi BELGE SIRASINDA değildir** — landmark'lar (`banner`, `main`,
`contentinfo`) kendi alt ağaçlarından önce, kardeş olarak listelenir. Düz dizide
`find(n => n.role === "heading")` bu yüzden alt bilgideki başlığı verebilir
(ölçüldü: 404'te "ÜRÜN" çıktı, oysa gövdenin `h1`'i aranıyordu). Doğrusu
`childIds` ile kökten özyinelemeli yürümek ve ilgilenilen landmark'ın alt
ağacıyla sınırlamaktır.

⚠️ **`aria-hidden` alt ağacı BUDAR, "ignored" işaretlemez.** Dekoratif ilan
edilen bir metin ağaçta `ignored: true` bir düğüm olarak da **durmaz**, hiç
düğüm üretmez — "gizlendi mi" sorusu `nodes.filter(ad === "404").length === 0`
ile ölçülür, `ignored` bayrağıyla değil.

## Kare farkının hakemi DOM geometrisidir — kesirli öteleme her metin satırını "değişmiş" gösterir (TASK-3.14, 2026-09-24)

"Görünüş bozulmadı" iddiası önce/sonra kare farkıyla ölçülür (T12, T13). Ama
**değişen bir bölümün ALTINDAKİ içerik kare farkında da değişmiş görünür** ve
bunun iki ayrı nedeni vardır; ikisi de ölçüldü:

1. **Öteleme.** Bölüm uzayınca altındaki her şey aşağı kayar. Çare kaydırmalı
   kıyastır: `once[y]` ile `sonra[y + Δ]` karşılaştırılır.
2. **Ötelemenin KESİRLİ olması.** Bölüm 65,5 px uzadıysa alttaki metin yarım
   piksel kayar ve **her glif satırı farklı rasterize olur**. Kaydırmalı kıyas
   bile temizlenmez: 17-25 satırlık bantlar hâlinde ~1000-1700 farklı piksel
   çıkar (satır yüksekliği kadar = imza budur). Arka planlar aynı kalır, yalnız
   yazı satırları farklıdır.

⚠️ **Tam sayı sanılan boy farkı kesirli olabilir** — `Math.round`'lu bir ölçüm
"66" der, gerçek değer **65,5**'tir. Δ'yı `getBoundingClientRect().height` ile
**ondalıklı** oku, yoksa yukarıdaki tuzağı hiç göremezsin.

**Hakem karedir değil, DOM geometrisidir.** Her elemanın `left/width/height` ve
satır kutusu sayısı iki hâlde toplanıp indeks indeks karşılaştırılırsa soru
kesin cevaplanır: *"ne değişti"* ile *"ne kaydı"* ayrışır (ölçüldü: 1396
elemanın 46'sı değişmiş, 45'i tek bir bölümün içinde, 46'ncısı `<main>`'in
boyu). Kare farkı bu ayrımı yapamaz.

⚠️ **`locator.screenshot()` ile alınan ELEMAN karesi de kirlenir.** Eleman
görünüre kaydırılarak rasterize edilir; sayfa boyu iki hâlde farklıysa eleman
farklı yarım-piksel konumuna düşer ve **geometrisi birebir aynı olan** bir
buton %21 farklı piksel verir (ölçüldü). Eleman karesi ancak geometri eşitliği
ayrıca gösterildikten sonra delil sayılır.

**Değişmemesi gereken yüzeyde ölçüt yine de karedir ve kesindir:** dokunulmamış
genişliklerde tam sayfa farkı **0** çıkmalıdır (bu turda 4 sayfa / 40 M piksel,
sayfa boyları da birebir). Sıfır olmayan bir rakam orada mazeret kabul etmez.
