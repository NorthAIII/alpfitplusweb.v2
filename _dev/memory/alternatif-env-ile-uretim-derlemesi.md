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

İlgili: saf fonksiyon `npm test` (Vitest, `tests/`) ile ölçülür (TASK-1.16) — ama
`next.config.ts` → `env` ile gömülen bir değerin **gerçekten gömüldüğü** bu yolla
kanıtlanmaz, gömme yalnız değeri okuyan kod varsa çıktıya girer; doğrulaması bu
alternatif derlemeyi ister.
