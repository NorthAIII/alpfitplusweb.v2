# B-043: F7.5 geçiş yüzeyi tabloda yazandan geniş — altı varlık adresi ve `www` haritada yok

**Önem:** 🟡 | **Tip:** eksik / altyapı | **Alan:** M7 — Yayın ve altyapı (F7.5)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M7-Yayin-ve-Altyapi.md` → F7.5 kabul kriteri: *"**20 adresin hepsi** ölçülerek 301 döner ve hedefi 200'dür"* ve eşleme tablosu (10 TR + 10 `/en/*`).

**Gözlenen:** Tablonun 20 adresi **doğru ve tam** — v1'in `src/pages/` ağacı birebir o 20 sayfa, v1'in `sitemap-0.xml`'i 18 adres listeliyor ve hepsi tablonun içinde; tabloda olmayan indekslenmiş sayfa yok. Ama geçiş gününde 200'den 404'e düşecek **yedi adres daha** var ve hiçbiri tabloda yok.

| Adres | v1 | v2 | Neden önemli |
|---|---|---|---|
| `/sitemap-index.xml` | **200** | **404** | v1'in `robots.txt`'sinde **beyanlı** (`Sitemap: https://alpfitplus.com/sitemap-index.xml`); Search Console'a kayıtlı sitemap adresi. v2 yeni adı (`/sitemap.xml`) kullanıyor, beyanı taşımıyor |
| `/sitemap-0.xml` | **200** | **404** | sitemap index'in gösterdiği dosya |
| `/og/alpfitplus-og.png` | **200** | **404** | **v1'in OG görseli** — bugüne dek WhatsApp/Twitter/LinkedIn'de paylaşılmış her bağlantının kart görseli bu adres. v2'de `public/og/` **boş** |
| `/favicon.ico` | **200** (1.816 B `.ico`) | **404** (+ 57 KB HTML gövde) | [B-027](B-027-onizleme-paylasiminda-kart-gorseli-kirik.md) kaydetti; buradaki yeni bilgi v1'de **çalışıyor** olması, yani geçiş bir gerileme getiriyor |
| `/favicon.svg` | **200** | **404** | v1'in `<link rel="icon" type="image/svg+xml">` hedefi |
| `/apple-touch-icon.png` | **200** | **404** | v1'in iOS ana ekran ikonu |
| **`www.alpfitplus.com`** | **canlı** (CNAME → Vercel, `307 → apex`) | haritada **yok** | aşağıda |

**`www` iki ayrı kalem taşıyor.** v1 projesinin bağlı alan adları (salt okuma): `alpfitplus.com` (redirect: null) · `www.alpfitplus.com` (**redirect: apex, status 307**) · `alpfitplus-website.vercel.app`. Yani (a) geçiş gününde **iki** alan-adı nesnesi taşınıyor, apex ve `www`; `www`'nin yönlendirme yapılandırması v2'de **yeniden kurulmalı**, yoksa `www.alpfitplus.com` kırılır. (b) Mevcut yönlendirme **307 (geçici)**; F7.5 kriteri "ölçülerek **301** döner" diyor — `www` haritaya girerse kalıcı olmalı.

**v2'nin ikon beyanı v1'den dar:** head yalnız `icon.png` (192×192) ve `apple-icon.png` (180×180) beyan ediyor; `.ico` ve SVG yok. `research/brand-out/favicon-32.png` (1.095 B) **üretiliyor ama hiçbir yere yerleştirilmiyor** — `/favicon.ico` 404'ünün mekanizması bu: `brand-assets.mjs:30` favicon'u üretiyor, teslim adımı yok.

**İyi haber ayrıca kaydedilir — geçiş bir DNS işi değil, Vercel panosu işi.** `alpfitplus.com` **zaten Vercel'e delege** (`A 76.76.21.21`, NS `nsd1-4.squarespacedns.com`); yönlendirme Host başlığıyla projeye yapılıyor. Yani geçiş = v1 projesinden detach + v2 projesine attach; Squarespace'te kayıt değişmiyor, propagasyon beklenmiyor, geri dönüş de tek panel işlemi. **CAA kaydı yok** → sertifika üretimini engelleyecek kısıt yok. Bu, `GIT-STRATEJI.md`'nin "alan adı v1'in Vercel projesine geri bağlanır" beyanıyla tutarlı ve pratikte dakikalar mertebesinde.

**v1'in `vercel.json`'undaki iki redirect kuralı geçişte kayboluyor** (küçük): `alpfitplus-website.vercel.app/(.*)` → apex (permanent) ve `/404.html` → `/404` (permanent). İkisi de v1 projesine ait; v1 arşivlendiğinde eski `.vercel.app` zaten canlı kalmaz, ama `/404.html` gibi eski bir indeksli adres varsa düşer.

## Kanıt

```
$ curl -s https://alpfitplus.com/robots.txt
User-agent: *
Allow: /
Sitemap: https://alpfitplus.com/sitemap-index.xml        ← v2'de 404 olacak adres

$ for u in /sitemap-index.xml /sitemap-0.xml /og/alpfitplus-og.png /favicon.ico /favicon.svg /apple-touch-icon.png; do
    printf "%s v1=%s v2=%s\n" "$u" \
      "$(curl -so /dev/null -w %{http_code} https://alpfitplus.com$u)" \
      "$(curl -so /dev/null -w %{http_code} https://alpfitplus-web-v2.vercel.app$u)"; done
/sitemap-index.xml      v1=200 v2=404        /favicon.ico        v1=200 v2=404
/sitemap-0.xml          v1=200 v2=404        /favicon.svg        v1=200 v2=404
/og/alpfitplus-og.png   v1=200 v2=404        /apple-touch-icon.png v1=200 v2=404

$ curl -s 'https://dns.google/resolve?name=www.alpfitplus.com&type=CNAME'   → cname.vercel-dns.com.
$ curl -sD - -o /dev/null https://www.alpfitplus.com/fiyat
HTTP/2 307 · location: https://alpfitplus.com/fiyat · server: Vercel
$ ls public/og                                                              → (boş)
```

## Kök Neden Yönü

F7.5 tablosu **v1'in sayfa ağacından** türetilmiş (`src/pages/` → 10 TR + 10 EN) ve o iş doğru yapılmış. Ama bir geçiş yüzeyi sayfalardan geniştir: alan adının bugüne dek 200 döndürdüğü **her** adres taşınır ya da bilinçle düşürülür. Varlık adresleri (`/og/*`, ikonlar, sitemap) sayfa ağacında görünmüyor, `robots.txt` ve `<link>` beyanlarında görünüyor — o iki kaynak taranmamış. `www` ise Vercel proje ayarında yaşıyor, repoda hiçbir izi yok; dolayısıyla repodan türetilen bir tablo onu yapısal olarak kaçırıyor.

## Koruma Önerisi

- F7.5 kabul kriterine **varlık adresleri ve `www` satırı** eklenir. `/og/alpfitplus-og.png` için en ucuz çözüm: v2'nin OG görselini o yola da yerleştirmek ya da 301 ile yeni adrese yönlendirmek — paylaşılmış eski bağlantıların kartı böyle ayakta kalır.
- `/sitemap-index.xml` → `/sitemap.xml` 301 yazılır (Search Console'un kayıtlı adresi kırılmasın).
- `brand-assets.mjs`'in ürettiği favicon **teslim edilir** (`/favicon.ico` + SVG); v1'de çalışan bir yüzeyin gerilemesi böyle kapanır.
- `www` v2 projesine apex'e **301/308 kalıcı** yönlendirmeyle eklenir; geçiş akışının adım listesine girer.
- Geçiş gününün doğrulaması **yalnız 20 adres değil**, v1'in `robots.txt` + `sitemap` + head `<link>` beyanlarından türetilen tam küme üzerinde koşar. Bu küme bugün 27 adres; tablo o sayıyla yeniden yazılabilir.
- **Kalan tek bilinmeyen ve kapsanmadı:** Google'ın gerçekten indekslediği adres kümesi yalnız Search Console kapsama raporundan çıkar — erişim kullanıcıda. `sitemap` (18) ve dosya ağacı (20) dışında eski/parametreli/yanlış-yazım bir adres varsa bu tur onu göremedi.

## Çözüm Kaydı

—
