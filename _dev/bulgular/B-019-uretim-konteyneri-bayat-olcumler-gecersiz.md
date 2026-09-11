# B-019: Yerel üretim konteyneri bayat kalıyor ve ölçüm betikleri bunu fark etmeden yeşil veriyor

**Önem:** 🟡 | **Tip:** hata / ölçüm geçerliliği | **Alan:** M6 — Kalite kapıları / M7 — Çalışma ortamı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `localhost:3100` üretim imajı, Vercel'e en yakın yerel yüzeydir. İki ölçüm betiği hedef olarak doğrudan onu alıyor: `perf.mjs:7` (`BASE = 'http://localhost:3100'`) ve `font-guard.mjs:13` (aynı varsayılan). `M6-Kalite-Kapilari.md` başlangıç çizgisindeki ağırlık, LCP, CLS ve font kapsaması rakamları bu konteynerden geliyor ve F7.4'ün (analitik) kabul kriteri de "sayfa ağırlığı artışı `perf.mjs` ile ölçülür" diyor.

**Gözlenen:** Konteynerdeki imaj yaklaşık 19 saat önce derlenmiş ve o günden bu yana en az üç görünür değişikliği **taşımıyor**. Bugün ölçülen hâli:

| Kontrol | 3100 (üretim imajı) | Beklenen / gerçek kod |
|---|---|---|
| `<meta name="robots">` | `index, follow` | `noindex, nofollow` (TASK-1.02) |
| `/robots.txt` | `Allow: /` + `Host: alpfitplus.com` | `Disallow: /` |
| `X-Robots-Tag` başlığı | yok | `noindex, nofollow` |
| Fiyat sayfasında rakip adı | **"OxyFitClub"** + `oxyfitclub.com/paketler` + liste fiyatı | kaldırıldı (`cacea4c`) |

Dev sunucusu (3000), önizleme ve kaynak ağacı üçü de temiz — rakip adı hiçbirinde yok. Kirli olan yalnız bu konteyner.

İki ayrı zarar doğuruyor:

**1. Ölçümler geçersiz.** `perf.mjs` bugün 19 saatlik bir artefaktı ölçüyor; "regresyon yok" sonucu ölçülen şeyin zaten regresyonu içermemesinden geliyor, kodun sağlamlığından değil. Aynı şey `font-guard.mjs` için de geçerli: bugünkü metinlerde yeni bir karakter varsa kapı onu göremez.

**2. Yanlış cevap veriyor.** Biri "noindex yerelde de kapalı mı" diye 3100'e bakarsa **açık** görür ve yanlış sonuca varır. Daha kötüsü, rakip adının kaldırıldığını doğrulamak isteyen biri burada **hâlâ duruyor** görür. `CLAIMS.md` rakip adsızlığını pazarlık konusu olmayan bir sınır sayıyor; bugün o sınırı ihlal eden tek yüzey bir ölçüm hedefi.

Konteynerin kendisi kalıcı bir sorun değil, tek komutla tazelenir. Kalıcı olan şu: **hiçbir betik ölçtüğü artefaktın tazeliğini doğrulamıyor**, dolayısıyla bayatlık sessizce yeşile dönüşüyor.

## Kanıt

```
$ docker compose ps
alpfitplus-web-prod   alpfitplus-web-web-prod   ...   19 hours ago   Up 4 hours   3100->3000

$ curl -s http://localhost:3100/ | grep -o '<meta name="robots"[^>]*>'
<meta name="robots" content="index, follow"/>
$ curl -s http://localhost:3000/ | grep -o '<meta name="robots"[^>]*>'
<meta name="robots" content="noindex, nofollow"/>          ← dev doğru

$ curl -s http://localhost:3100/robots.txt
User-Agent: *
Allow: /
Host: https://alpfitplus.com

$ curl -s http://localhost:3100/fiyat | grep -oiE "oxyfitclub[^<\"]{0,40}"
OxyFitClub App Start / ay
OxyFitClub&#x27;ın kendi paketler sayfasında yayın
oxyfitclub.com/paketler

$ curl -s http://localhost:3000/fiyat | grep -oi "oxyfitclub"      → (vuruş yok)
$ curl -s https://alpfitplus-web-v2.vercel.app/fiyat | grep -oi "oxyfitclub"  → (vuruş yok)
$ grep -rni "oxyfitclub" src/ public/                              → (vuruş yok)
```
İlgili commit'ler: noindex `e3537ff` (bugün 03:04), rakip adı kaldırma `cacea4c` — ikisi de imajın doğumundan sonra.

Tazeleme: `docker compose --profile prod up -d --build web-prod`.

## Kök Neden Yönü

Üretim imajı elle derleniyor ve yeniden derlenmesini hatırlatan bir şey yok. `docker compose --profile prod up -d` (bayraksız) mevcut imajı yeniden başlatır, yeniden **derlemez** — ve repo kökündeki `README.md:26` komutu tam olarak bu bayraksız hâliyle yazılı (bkz. [B-013](B-013-readme-uretim-portu-bayat.md)). Yani doküman bu tuzağı üretmeye katkı yapıyor.

İkinci katman B-012 ve B-015 ile aynı: ölçüm sonucu **neyi** ölçtüğünü söylemiyor. Kapsam gibi tazelik de rapor edilmiyor.

## Koruma Önerisi

- `perf.mjs` ve `font-guard.mjs` ilk iş olarak hedefin tazeliğini kontrol eder ve çıktısına yazar. En ucuz imza `deployStage`'dir: yerel üretim imajı `local` beklenirken `production` davranışı gösteriyorsa (bugünkü durum) betik **durur**, ölçüm yapmaz. Bayat tabana karşı alınan yeşil, alınmamış yeşilden daha zararlıdır.
- M6 F6.2 tek komut kurulurken üretim imajını `--build` ile tazelemek akışın ilk adımı olur; ölçüm kendi zeminini kurar, kullanıcının hatırlamasına bağlı kalmaz.
- `README.md` komutuna `--build` eklenir (B-013 ile aynı düzeltme turunda).

## Çözüm Kaydı

—
