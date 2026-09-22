# Alternatif env ile üretim derlemesi — ayrı konteyner, geliştirme sunucusu bozulmadan

Aşamaya (`deployStage`) bağlı davranışı **serving katmanında** doğrulamak için
üretim env'ini taklit eden bir derleme gerekir. Ama `.next` bir isimli hacimdir
(`docker-compose.yml` → `next_cache`) ve `web` servisiyle paylaşılır: çalışan
geliştirme sunucusunun üstüne derleme yapmak onun `.next`'ini ezer.

Yol (TASK-1.02'de ölçüldü):

```bash
docker compose run --rm -d --name <ad> --publish 3200:3000 \
  -e VERCEL=1 -e VERCEL_ENV=production \
  -e VERCEL_PROJECT_PRODUCTION_URL=alpfitplus.com \
  web sh -c "npm run build && npm start"
# ... curl ile ölç ...
docker rm -f <ad>
docker compose restart web      # geliştirme sunucusunun .next'ini tazele
```

- **Port:** 3200 kullanıldı. 3000 (dev) ve 3100 (üretim imajı) doludur,
  **3001 makinede başka bir projede** — kullanılmaz.
- `next start` `output: standalone` için uyarı basar ("node
  .next/standalone/server.js kullanın"); sunucu yine ayağa kalkar. Yanıt
  başlığı, `robots.txt` ve HTML meta ölçmek için yeterlidir — standalone
  paketleme bu üç yüzeyi değiştirmez. Statik varlık/performans ölçecekseniz
  uyarıyı ciddiye alın, gerçek üretim konteynerini (3100) kullanın.
- Konteyner ölçüm biter bitmez **silinir**; unutulursa 3200 portu ve `.next`
  hacmi üzerinde asılı kalır.

## Dev sunucusuna ve repoya hiç dokunmayan yol (audit-product 2026-09-13'te doğrulandı)

Dev sunucusu başka bir oturum ya da ajan tarafından kullanılıyorsa derleme repo **kopyasında** yapılır. Bu yolda `restart` gerekmez, `.next` hacmi paylaşılmaz, repoya iz kalmaz:

```bash
SP=<scratchpad>/build
rsync -a --exclude node_modules --exclude .next --exclude .git "/home/kivanc/projects/Alpfitplus website.v2/" "$SP/src/"
docker run -d --name <ad> -p 3200:3000 -v "$SP/src:/app" \
  -v alpfitplus-web_node_modules:/app/node_modules:ro -w /app \
  -e NEXT_TELEMETRY_DISABLED=1 -e VERCEL=1 -e VERCEL_ENV=production \
  -e VERCEL_PROJECT_PRODUCTION_URL=alpfitplus-web-v2.vercel.app \
  alpfitplus-web-web sh -c "npm run build && npm start"
# ... ölç ...
docker rm -f <ad>
```

`node_modules` hacmi salt okunur bağlanır. İstemci paketine gömülen `NEXT_PUBLIC_*` değerleri (ör. sahte bir Umami site kimliği) bu yolla derlemeye verilir.

İlgili: saf fonksiyon `npm test` (Vitest, `tests/`) ile ölçülür (TASK-1.16) — ama
`next.config.ts` → `env` ile gömülen bir değerin **gerçekten gömüldüğü** bu yolla
kanıtlanmaz, gömme yalnız değeri okuyan kod varsa çıktıya girer; doğrulaması bu
alternatif derlemeyi ister.

## `docker compose exec web npm run build` de aynı riski taşır (TASK-1.08, 2026-09-22)

CLAUDE.md → "Ölçüm betikleri" bu komutu **kanonik üretim derleme kontrolü** olarak
listeler ve `restart` adımı yazmaz — ama `exec` de aynı çalışan konteynerin (`web`),
dolayısıyla aynı `next_cache` hacminin üstüne yazar; yukarıdaki "ezer" riski `docker
compose run` ile açılan **ayrı** bir konteynerle sınırlı değil. Ölçüldü: build sonrası
`curl` ile `/`, `/demo`, `/api/demo` hemen 200/405 döndü ve dev log'u temiz kaldı
(görünür bir kırılma yoktu) — yine de temkinli olarak `docker compose restart web`
uygulandı ve sonrası da temiz ölçüldü. Yani gözlemlenen risk bu Next 16/Turbopack
sürümünde **düşük** olabilir (dev artefaktları `.next/dev/` alt dizininde ayrı
duruyor) ama kanıtlanmış değil — `docker compose exec web npm run build` çalıştıran
her oturum ihtiyatlı olarak ardından `docker compose restart web` yapmalı.

## `.env`'i kim okuyor — `printenv` yalan söyler (audit-product 2026-09-22)

`docker-compose.yml` hiçbir servise `env_file` vermiyor, ama **her iki konteyner de
`.env`'i görüyor** — iki ayrı yoldan:

- **`web` (dev, 3000):** repo kökü `/app`'e bind-mount'lu ve **Next.js `/app/.env`'i
  kendi dotenv'iyle çalışma anında okuyor**. `docker compose exec web printenv
  LEAD_STORE_URL` **boş döner** — `exec` yeni bir kabuk açar, Next sürecinin ortamı
  değildir. Yani dev'deki `/api/demo` POST'u **hedefsiz 503'e düşmez**, gerçekten
  `LEAD_STORE_URL`'in gösterdiği yere yazar.
- **`web-prod` (3100):** `.env` **üretim imajının içinde** (`.dockerignore:6` yalnız
  `.env*.local` yazıyor, `.env`'i eşlemiyor) — compose'da env verilmemesine rağmen uç
  bağlı. Bu aynı zamanda bir güvenlik bulgusudur → `_dev/bulgular/B-058-env-uretim-imajina-gomulu.md`.

**Kural — yerel bir uca POST atmadan önce hedefi `printenv` ile değil, ucun kendi
davranışıyla ölç:** tek bir `{}` POST'u at; `503 no-sink` geliyorsa hedef yok, `422`
geliyorsa doğrulamaya geçmiş demektir ve geçerli bir gövde **kayıt oluşturur**. Bu
kontrol atlanırsa "zararsız test" sanılan istekler gerçek bir depoya satır yazar
(bu turda yerel `lead-store`'a 25 test kaydı böyle düştü — hedef yereldi, canlıya
gitmedi, ama şans eseri).

## 3100 bayat olabilir — ölçmeden güvenme, ayırt edici bir alan seç (verify-phase, 2026-09-22)

`perf.mjs` (sabit `BASE`) ve `font-guard.mjs` (`BASE` env'li) varsayılan olarak **3100'ü** ölçer, ama `web-prod`
konteyneri uzun ömürlüdür ve kendiliğinden yeniden derlenmez — B-019'un mekanizması budur. UAT'ta ölçüldü: imaj
15:30'da derlenmişti, yani o günün TASK-1.09/1.15/1.19/1.20 commit'lerinin hiçbirini taşımıyordu; `perf.mjs` o hâlde
ölçülseydi **ClickTracker'ı hiç görmeyen** bir yeşil üretirdi.

- **Yaşı tek istekle ölç:** aşamaya ya da içeriğe bağlı, son değişiklikte dokunulmuş bir alan seç ve 3000/3200 ile
  kıyasla. O turda iki ayırt edici kullanıldı: `curl -s localhost:3100/kvkk | grep '<meta name="robots"'`
  (TASK-1.20 öncesi `index, follow`, sonrası `noindex, nofollow`) ve `/kvkk`'de `Nürnberg` geçişi (TASK-1.15).
- **Taze ölçüm gerekiyorsa `web-prod`'a dokunma** (başkasının servisi olabilir): `docker build --target runner -t
  <etiket> .` + `docker run -d -p 3200:3000 <etiket>`; betiği scratchpad'e kopyalayıp `BASE`'ini 3200'e çevir
  (`sed`), araştırma konteynerine `-v` ile mount et. Konteyner **ve imaj** ölçüm biter bitmez silinir — imaj `.env`'i
  içerir (B-058), ortalıkta bırakılmaz. Port boşluğu pozitif kontrolle teyit edilir (200 → bağlantı reddedildi).
- **İlk koşum soğuktur:** taze konteynerde rota başına ilk render LCP'yi şişirir (ölçüldü: ana sayfa 308 ms → ısınınca
  100 ms). Çizgiyle kıyaslamadan önce `perf.mjs`'i **iki kez** koştur, ikincisini raporla.
