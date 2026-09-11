# B-042: Paylaşım kartı sayfa başına türemiyor; `/foto` tek önbelleksiz varlık dizini; JSON-LD v1'e göre geriledi

**Önem:** 🟡 | **Tip:** hata / dönüşüm-altyapı | **Alan:** M7 — Yayın ve altyapı (M2 metadata)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `QUALITY.md` → 8 Dönüşüm: *"Her sayfa ve bölümden tek huniye net bir yol var mı?"* — WhatsApp bu projenin birincil kanalı (kodda 15 WhatsApp bağlantısı). `M7-Yayin-ve-Altyapi.md` → F7.2: `/fonts` immutable, `/product` uzun max-age. `OVERVIEW.md` → v2'nin varlık gerekçesi *"v1 denetimlerinin bulgularını baştan çözmek"*.

**Gözlenen — üç ayrı kalem, hepsi canlı önizlemede ölçüldü.**

**(1) `og:url` / `og:title` / `og:description` 15 sayfanın hepsinde AYNI — ve `og:url` her zaman ana sayfa.**
```
og:url          https://alpfitplus.com                        ← sayfanın kendi adresi DEĞİL
og:title        Alpfit Plus — Kulübünüzün tüm işi tek platformda
og:description  Randevu, grup dersleri, üyelik ve paket, …
twitter:title   (aynı)          og:image:alt   YOK
```
Oysa `<title>` ve `description` sayfa başına **doğru** (`Fiyat · Alpfit Plus`, `Demo İste · Alpfit Plus`…). Sebep `layout.tsx:37-49`'un `openGraph.url/title/description`'ı sabitlemesi; Next `metadata.title`'ı `openGraph.title`'a **taşımaz** ve alt sayfalar yalnız `title`/`description` set ediyor. Sonuç: WhatsApp'ta `/fiyat` paylaşıldığında kart "Kulübünüzün tüm işi tek platformda" yazıyor ve **ana sayfaya** bağlanıyor. [B-027](B-027-onizleme-paylasiminda-kart-gorseli-kirik.md) yalnız `og:image`'ın **alan adını** kapsıyor; bu ayrı kalem.
**`canonical` bu hatadan muaf ve bu kaydedilir:** 15/15 doğru, `generateMetadata` dâhil — F7.5'in canonical kriteri bugünden karşılanıyor. (Tek incelik: ana sayfa canonical'ı eğik çizgisiz `https://alpfitplus.com`, sitemap `<loc>` ise eğik çizgili.)

**(2) `/foto` tek kuralsız varlık dizini — ve görsel optimizer çıktısını da onunla birlikte önbelleksiz bırakıyor.**
`next.config.ts:76-83` yalnız `/fonts/:path*` (immutable) ve `/product/:path*` (604800 + swr) veriyor; `public/foto/` Next'in `public/` varsayılanına düşüyor. Nedensellik tek komut çiftiyle kanıtlandı — aynı optimizer, aynı parametreler, tek fark kaynak yol:
```
/_next/image?url=%2Ffoto%2Fcrossfit.webp&w=640&q=75
  → cache-control: public, max-age=0, must-revalidate            ← /foto
/_next/image?url=%2Fproduct%2Fcockpit.webp&w=640&q=75
  → cache-control: public, max-age=604800, stale-while-revalidate=86400   ← /product
```
Optimizer üst-kaynağın `Cache-Control`'ünü yansıtıyor. Ölçü: `/foto` **908 KB / 11 dosya** (en büyük dizin), `/product` 344 KB, `/fonts` 108 KB. Yani segment sayfalarının kahraman fotoğrafları **ve onlardan türeyen her avif/webp varyantı** her ziyarette yeniden doğrulanıyor ve yeniden dönüştürülüyor. v1 karşılaştırması aynı yönde: v1'in `vercel.json`'u `/og/*` ve ikon kümesine de `max-age=2592000` veriyordu.
Yan gözlem: `/product/:path*` kuralı pratikte **ölü** — hiçbir tarayıcı `/product/*`'ı doğrudan istemiyor, hepsi `_next/image`'ten geçiyor; kural yalnız optimizer'ın yansıttığı değer olarak iş görüyor (ki bu da yeterli, ama niyet farklı).

**(3) JSON-LD v1'e göre geriledi.** `layout.tsx:61-107`'den geliyor, 15 sayfanın hepsinde birebir aynı tek blok (sayfaya özgü düğüm yok). Yapı geçerli, `@id` referansları tutarlı. v1 ile yan yana:

| Alan | v1 (canlı) | v2 |
|---|---|---|
| `Organization.sameAs` | `["https://www.instagram.com/alpfitplus"]` | **yok** (`CONTACT.instagram` sabitte var) |
| `Organization.email` / `.telephone` | var (E.164) | yok (yalnız `contactPoint` içinde) |
| `Offer.priceSpecification` | `UnitPriceSpecification` + `valueAddedTaxIncluded: false` | **yok** — KDV hariç bilgisi yalnız serbest metinde |
| `SoftwareApplication.url` | var | **yok** |
| `Organization.logo` | yok | yok (ikisinde de eksik; Google Organization zengin sonucu logo ister) |

[B-023](B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md) teyidi ve **üçüncü biçim**: `layout.tsx:73` `telephone: "+90-535-937-59-55"` elle yazılı; v1 aynı numarayı `+905359375955` (E.164) yazıyordu, `CONTACT.phone.display` ise hiç kullanılmıyor. `price` ise doğru şekilde `PRICING.firstBranch`'ten geliyor ✓.

**(4) `sitemap.xml`'in `lastmod`'u bilgi taşımıyor.** `sitemap.ts:6` `const now = new Date()` render anında hesaplanıyor; 15 adresin **hepsi aynı damga** (dağıtım `16:33:59`, damga `16:34:10`). Yani aylardır dokunulmamış yasal sayfalar dâhil her sayfa "son dağıtımda değişti" diyor. Google `lastmod`'u yalnız güvenilir göründüğünde kullanır; tümü-aynı damga onu işlevsiz kılar. (`changefreq`/`priority` var ve tutarlı; Google ikisini de yok sayar, zararsız.)

**(5) İki farklı tema rengi beyan ediliyor:** HTML `<meta name="theme-color" content="#fbfbf9">` (`layout.tsx:55`) ↔ `public/site.webmanifest` `"theme_color": "#74b36f"`. Kurulu PWA çerçevesi yeşil, tarayıcı sekmesi kırık-beyaz olur.

## Kanıt

```
$ for f in m7-html/*.html; do grep -o '<meta property="og:url" content="[^"]*"' $f; done | sort -u
  → tek satır: content="https://alpfitplus.com"        (15 sayfanın hepsi)

$ du -sh public/foto public/product public/fonts
  908K  public/foto      344K  public/product      108K  public/fonts

$ curl -s .../sitemap.xml | grep -o '<lastmod>[^<]*' | sort -u | wc -l
  1        → 15 adresin hepsi aynı damga

$ grep -n "telephone" src/app/layout.tsx        → 73:  telephone: "+90-535-937-59-55",
```

## Kök Neden Yönü

Üç kalem de aynı desenden: **kök layout'ta bir kez yazılıp sayfa başına türememe**. `openGraph` sabitlenmiş, JSON-LD sabitlenmiş, `lastmod` render anından alınmış. Next'in `metadata` birleştirme kuralları (title/description miras alınır ve ezilir, `openGraph` alt alanları ezilmez) bilinmeden yazılmış olması en olası açıklama — ve kimse paylaşım kartını gerçekten bir mesajlaşma uygulamasına yapıştırıp bakmamış.

`/foto` kuralı ise bir **atlanmış satır**: iki dizin için kural yazılmış, üçüncüsü (ve en büyüğü) yazılmamış. Optimizer'ın üst-kaynağı yansıtması bu atlamayı görünür bir maliyete çeviriyor.

## Koruma Önerisi

- Alt sayfalar `openGraph.title/description/url`'ü kendi `metadata`'larında set eder; en temizi kök layout'ta bir yardımcı (`pageMeta(title, description, path)`) ve 15 sayfanın onu çağırması — böylece yeni sayfa eklemek kartı otomatik doğru getirir. `og:image:alt` eklenir.
- `next.config.ts` `headers()`'a `/foto/:path*` kuralı eklenir (fotoğraflar da içerik-adresli değil ama nadiren değişiyor; `/product` ile aynı değer makul).
- JSON-LD'ye v1'de olup v2'de düşen alanlar geri konur; `telephone` `CONTACT`'tan okunur ve biçim tek kaynağa bağlanır (B-023 kapsamı).
- `sitemap.ts` `lastmod`'u ya gerçek bir değişiklik damgasına bağlanır (içerik dosyasının git tarihi ya da elle tutulan sabit) ya **tamamen kaldırılır** — yanlış `lastmod` yoklukten kötüdür.
- İki tema rengi tek değere indirilir.
- Kalıcı koruma: yayın kapısına **rota başına metadata** kontrolü girer — `canonical`, `og:url` ve `<title>` üçünün de sayfaya özgü olduğu mekanik olarak doğrulanabilir. Bu, [B-041](B-041-yasal-sayfalar-noindex-eziyor.md)'in önerdiği meta/başlık kapısıyla **aynı kontrol**.

## Çözüm Kaydı

—
