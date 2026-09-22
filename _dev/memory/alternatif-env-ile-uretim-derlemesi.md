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
