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
dosyalarıdır. Sitede tutulan sınırlar:

- Diyetisyen modülü **söylenebilir** — 18 rakip üründe görülmedi.
- Antrenör uygulaması "sadece bizde" **denmez** — iki rakipte de var.
- Türkçe arayüz ve KVKK **fark sayılmaz** — yerli rakiplerin hepsinde var.
- Ürün durumu: **bir stüdyoda pilot olarak test ediliyor.** "Sahada/canlı" denmez.
- ROI, müşteri sayısı ve yüzde iyileşme iddiası **yok** — pilot sonucu çıkmadı.
- Rakip fiyat karşılaştırmaları rakibin **yayınlanmış liste fiyatından bizim
  hesabımızdır**, erişim tarihiyle birlikte yazılır.

Fiyat tek kaynaktan gelir: `src/content/pricing.ts`.

## Demo talep ucu

`src/app/api/demo/route.ts`. Önce dayanıklı kayıt (`LEAD_WEBHOOK_URL` veya
`LEAD_FILE_PATH`), sonra e-posta (`RESEND_API_KEY`). Hiçbir hedef yapılandırılmamışsa
uç **başarılı dönmez**; form kullanıcıyı WhatsApp'a yönlendirir. Bal küpü alanı ve
IP başına 10 dakikada 5 istek sınırı vardır. Ayarlar için `.env.example`.

## Klasörler

```
src/app/         rotalar
src/components/  ui/ · layout/ · sections/
src/content/     tüm metin, fiyat, segment, SSS ve yasal içerik
public/product/  üretilen ürün ekran görüntüleri
research/        Playwright betikleri + temizlik tabloları
```
