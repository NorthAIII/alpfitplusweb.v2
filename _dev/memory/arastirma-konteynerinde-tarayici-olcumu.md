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

İlgili: [Saf fonksiyon testi — repoda koşucu yok](saf-fonksiyon-testi-node-tip-soyma.md)
— saf fonksiyon `web` konteynerinde, tarayıcı ölçümü bu tarifle koşar.
