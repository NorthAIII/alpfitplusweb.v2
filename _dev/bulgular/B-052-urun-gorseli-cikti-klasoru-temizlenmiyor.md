# B-052: Ürün görseli hattı çıktı klasörünü temizlemiyor, düşürülen ekran "hâlâ üretiliyor" gibi kalıyor

**Önem:** 🟢 | **Tip:** bakım / tuzak | **Alan:** M5 — Görsel varlık hattı (F5.1)
**Kaynak:** audit-product (Gelen Kutusu `[QUICK-001]` notunun mezuniyeti) | **Tarih:** 2026-09-13
**Durum:** Açık

## Gözlem

**Beklenen:** Kök `CLAUDE.md` → Dokunulmazlar: *"`public/product/` betik çıktısı — elle dosya konmaz."* `docs/CLAIMS.md` → Tek Kaynaklar: ürün görselleri `render-product.mjs` + temizlik tablolarından gelir; sızıntı varsa üretim durur. Hattın çıktı klasörü, hattın o anki `SCREENS` listesini doğru yansıtmalı.

**Gözlenen:** `render-product.mjs` çıktıyı `research/product-out/`'a yazıyor ama klasörü **hiç temizlemiyor**: yalnız `mkdir(OUT, { recursive: true })` var, silme adımı yok. `SCREENS`'ten bir ekran düşürüldüğünde eski `.webp` klasörde kalıyor. Aynı koşumun `manifest.json`'u gerçeği söylüyor (yalnız üretilenleri listeler), klasörün kendisi söylemiyor.

Hat `public/product/`'a kendisi yazmıyor; oraya aktarım koşum dışında yapılıyor. Bu yüzden `product-out/*.webp`'i toptan aktaran bir sonraki oturum, düşürülmüş ve **sızıntı taşıdığı için** düşürülmüş bir görseli yayına geri koyabilir. Somut emsal: `sube.webp` üç sızıntı sınıfı yüzünden düşürüldü (QUICK-001, B-018, B-044). O oturum bayat kopyayı klasörden **elle** sildi, çünkü hat silmiyordu.

İkinci sürtünme: klasör ve dosyalar konteynerin `root` kullanıcısına ait. Ana makineden silinemiyor, temizlik için yine konteyner gerekiyor. Bu da elle temizliği unutulmaya açık bırakıyor.

## Kanıt

```
$ grep -n "product-out\|rm(\|rmSync\|unlink\|mkdir" research/scripts/render-product.mjs
13:import { mkdir, writeFile } from 'node:fs/promises';
17:const OUT = '/work/product-out';
170:await mkdir(OUT, { recursive: true });
   → silme/temizleme çağrısı yok

$ ls -ld research/product-out research/product-out/antrenor.webp | awk '{print $3, $9}'
root research/product-out
root research/product-out/antrenor.webp
```

Emsal kaydı: `_dev/tasks/quick/QUICK-001-sube-webp-yayindan-cek.md` → Yapılanlar: *"`research/product-out/`'ta kalan bayat kopya da silindi — hat çıktı klasörünü temizlemiyor"*. Bugün klasörde 7 `.webp` + `manifest.json` var, yani emsalden sonra temiz. Bulgu tuzağın kendisidir, bugünkü içerik değil.

## Kök Neden Yönü

Hat "üret ve üzerine yaz" olarak kurulmuş, "listeyi yansıt" olarak değil. Listeden çıkarma o gün öngörülmemiş; `SCREENS` ilk kez QUICK-001'de küçüldü.

## Koruma Önerisi

- Hat koşumun başında `OUT` içindeki `.webp`'leri silsin ya da koşum sonunda `manifest`'te olmayan `.webp`'leri silsin (ikincisi yarım kalan koşumda eski çıktıyı korur).
- `public/product/`'a aktarım da hattın parçası olursa (manifest'e göre eşitleme) elle kopyalama adımı ve bayat varlık riski birlikte kalkar. Bu, `CLAUDE.md`'nin "elle konmaz" kuralını mekanik hâle getirir.
- Denetim ucuzdur: `public/product/*.webp` kümesi `manifest.json` kümesine eşit mi? Kalite kapıları tek komutuna (F6.2) girebilir.

## Çözüm Kaydı

—
