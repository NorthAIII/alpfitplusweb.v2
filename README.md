# Alpfit Plus — Web Sitesi (v2)

`alpfitplus.com` tanıtım sitesi. Ürün kod tabanından (`../Alpfit.v1`) ve eski
siteden (`../Alpfitplus-website.v1`) **bağımsız** bir projedir. Bu repo canlı
siteye dokunmaz.

## Yığın

| Katman | Seçim |
|---|---|
| Çatı | Next.js 16 (App Router, Turbopack) |
| Dil | TypeScript |
| Stil | Tailwind CSS 4 (CSS-first `@theme`) |
| İkon | lucide-react (çizgi set) |
| Font | Sora + Inter, self-host, TR latin-ext subset |
| Çalışma ortamı | Docker Compose |

Site tek dillidir (Türkçe). Hedef kitle Türkiye'deki butik spor kulüpleri.

## Çalıştırma

```bash
docker compose up -d web          # http://localhost:3000
docker compose logs -f web
docker compose exec web npm run build
docker compose --profile prod up -d web-prod   # http://localhost:3001
```

> **Yeni bir rota klasörü eklediğinizde** `docker compose restart web` gerekir.
> Bind-mount üzerinde Turbopack yeni dizinleri sıcak yakalamıyor.

## Araştırma ve görsel üretim konteyneri

Playwright + Chromium + sharp taşıyan ayrı bir imaj. Rakip analizi, kendi
sitemizin görsel denetimi ve ürün ekran görüntüsü üretimi burada koşar.

```bash
# rakip siteleri yakala
docker compose --profile research run --rm research node scripts/capture.mjs

# kendi sitemizi ekran ekran gez (konsol hatası da raporlar)
docker compose --profile research run --rm research node scripts/scan.mjs / home 1440 900
docker compose --profile research run --rm research node scripts/scan.mjs / home-mobil 390 844

# ürün ekran görüntülerini yeniden üret
docker run --rm \
  -v "$PWD/research:/work" \
  -v "/home/kivanc/projects/Alpfit.v1/demo:/demo:ro" \
  -w /work alpfitplus-web-research node scripts/render-product.mjs
```

### Ürün görselleri neden bir hattan geçiyor

`public/product/*.webp` elle konmaz, `research/scripts/render-product.mjs`
üretir. Hat `../Alpfitplus-website.v1/scripts/lib/screen-cleanup.mjs`
tablosundan devralındı ve dört iş yapar:

1. **Marka düzeltmesi** — kaynak demoda eski ad "Weekend Plus" geçiyor.
2. **Kişi ve yer temizliği** — kaynakta gerçek sporcu ve semt adları var; nötr
   adlarla değiştirilir, avatar baş harfleri senkron tutulur.
3. **Düğüm düşürme** — ürünün bugün karşılamadığı iddiaları taşıyan kartlar
   DOM'dan kaldırılır (örneğin antrenör ekranındaki finansal ciro kalemleri).
4. **Denetim** — gerçek bir ad veya eski marka sızarsa **üretim durur**.
   Sessiz "temiz" yoktur.

`churn.html` ve `kampanya.html` bilinçle kapsam dışıdır: karşılıkları v1.5'te,
bugünkü ürünün parçası değiller.

## İçerik ve iddia sınırı

Metinlerin kaynağı `../alpfit-plus-satis/` altındaki satış ve rekabet
dosyalarıdır. Ne söylenip söylenemeyeceğinin **tek evi** `_dev/docs/CLAIMS.md`;
tablo burada tekrarlanmaz. Kısaca: ürün pilot aşamada, rakip adı geçmez,
ROI/müşteri sayısı yok.

Pilot iddiası tek kaynaktan gelir: `src/content/site.ts` → `PRODUCT_STATUS`.
Fiyat tek kaynaktan gelir: `src/content/pricing.ts`.

## Demo talep ucu

`src/app/api/demo/route.ts`. Önce dayanıklı kayıt (v1'in lead deposu —
`LEAD_STORE_URL` + `LEAD_STORE_TOKEN` + `IP_HASH_SALT`, ya da yerel yedek
`LEAD_FILE_PATH`), sonra e-posta (`RESEND_API_KEY`). Hiçbir hedef yapılandırılmamışsa
uç **başarılı dönmez**; form kullanıcıyı WhatsApp'a yönlendirir. Bal küpü alanı ve
IP başına 10 dakikada 5 istek sınırı vardır. Ayarlar için `.env.example`.

## Testler

```bash
docker compose exec web npm test        # Vitest — konteyner içinde koşar
```

Batarya varsayılan olarak yalnız bu repoyu ölçer. **İki paket ayrı bir env
kapısının arkasındadır** ve anahtarları tanımsızken *atlanır* — `npm test`'in
geri kalanı ve çıkış kodu etkilenmez. Sebep aynı: ikisi de bu reponun dışındaki
bir şeye bakar ve CI'da o şey bulunmayacaktır.

| Paket | Anahtar | Neye bakar |
|---|---|---|
| `tests/lead-store.contract.test.ts` | `LEAD_CONTRACT_URL` | Yerelde ayağa kalkmış lead deposu kopyası (`--profile lead`) |
| `tests/legal-consistency.test.ts` → dal 9 | `LEGAL_CONTRACT_HOOKS_DIR` | Komşu depodaki saklama mekanizması (`RETENTION_MONTHS`) |

Tam koşum komutları paketlerin baş yorumlarındadır. Yasal beyan kapısının
çapraz depo dalı için:

```bash
docker compose up -d web   # bağlama `restart` ile GELMEZ, `up -d` ile gelir
docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test
```

Yayındaki "12 ay saklıyoruz" cümlesinin dayanağı bu repoda değil, v1'in
PocketBase hook'larında yaşar (`pb_hooks/lead_lib.js` → `RETENTION_MONTHS`).
Sabit v2'ye **kopyalanmaz** — iki ev sessizce ayrışır. Bunun yerine `web`
servisi o klasörü **salt okunur** (`:ro`) bağlar ve dal metni oradan okur;
komşu depo canlı sitedir, yazılamaz. Anahtar tanımlıyken bağlama eksikse ya da
yazılabilir gelirse dal sessizce geçmez, kırılır.

## Klasörler

```
src/app/         rotalar
src/components/  ui/ · layout/ · sections/
src/content/     tüm metin, fiyat, segment, SSS ve yasal içerik
public/product/  üretilen ürün ekran görüntüleri
research/        Playwright betikleri + temizlik tabloları
```
