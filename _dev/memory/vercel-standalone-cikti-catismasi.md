# Vercel `output: "standalone"` ile derleme kırar

Bu projenin iki dağıtım hedefi var ve ikisi **zıt** çıktı istiyor:

- **Docker üretim imajı** (`web-prod`, 3100) `.next/standalone/server.js` klasörünü kopyalar → `output: "standalone"` **zorunlu**.
- **Vercel** paketlemeyi kendisi yapar ve iz dosyalarını (`.next/next-server.js.nft.json`) bekler; standalone modunda bunları beklediği yerde bulamaz → derleme `onBuildComplete` adımında `ENOENT` ile kırılır.

Çözüm `next.config.ts` içinde koşullu çıktı:

```ts
const output = process.env.VERCEL ? undefined : ("standalone" as const);
```

**Dikkat:** Yerel gözlem bu tuzağı **göstermez** — konteynerde standalone modunda `.nft.json` dosyaları *var*. Teşhis yalnız gerçek bir Vercel dağıtımıyla doğrulanabildi (ölçüm: TASK-1.03, ilk dağıtım kırmızı, koşul eklenince aynı kaynak yeşil). `next.config.ts`'te çıktıya dokunan bir değişiklik yaparsan iki hedefi ayrı ayrı sına: konteynerde `.next/standalone/server.js` üretiliyor mu, Vercel dağıtımı yeşil mi.

İlgili: [Vercel proje kimlikleri ve CLI erişimi](vercel-proje-kimlikleri.md)
