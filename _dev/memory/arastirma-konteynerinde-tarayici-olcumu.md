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
