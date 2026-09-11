# B-027: Önizleme adresi paylaşıldığında kart görseli gelmiyor — OG görseli v1'in alan adını gösteriyor

**Önem:** 🟢 | **Tip:** hata / yayın yüzeyi | **Alan:** M7 — Yayın ve altyapı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** Faz 1'in milestone'u v2'yi önizlemede ayakta tutmak; sıradaki faz konusu *"önizleme adresi gerçek telefonda ve en az üç viewport'ta incelendi"* diyor. Yani önizleme adresi bakılacak ve paylaşılacak bir yüzey.

**Gözlenen:** `https://alpfitplus-web-v2.vercel.app` bir mesajlaşma uygulamasına yapıştırıldığında kart görseli gelmiyor. Sayfanın `og:image` değeri `https://alpfitplus.com/opengraph-image.png` — yani **v1'in canlı alan adı** — ve o adres bugün 404 dönüyor.

Sebep `metadataBase`'in `SITE.url` sabitine bağlı olması; bu sabit aşamadan bağımsız olarak gerçek alan adını gösteriyor. Aynı mekanizma `canonical` ve `sitemap.xml`'i de v1'in alan adına yazıyor.

Bunların çoğu **bugün zararsız**: site üç katmanda `noindex` ve `robots.txt` her şeyi kapatıyor (bu turda doğrulandı, üç katman tam tutarlı), dolayısıyla canonical ve sitemap arama motoru açısından sonuç doğurmuyor. Alan adı geçtiğinde (F7.5) hepsi kendiliğinden doğruya dönecek.

Kendiliğinden düzelmeyi beklemeyen tek kalem paylaşım kartı: önizleme bugün gösteriliyor ve bugün kırık görünüyor.

## Kanıt

```
$ curl -s https://alpfitplus-web-v2.vercel.app/ | grep -oE '<meta property="og:image"[^>]*>'
   → content="https://alpfitplus.com/opengraph-image.png?..."

$ curl -sI https://alpfitplus.com/opengraph-image.png | head -2
HTTP/2 404
content-disposition: inline; filename="404.html"

$ curl -s https://alpfitplus-web-v2.vercel.app/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -3
   → https://alpfitplus.com/...   (15 adres, hepsi v1 alan adı)
```
Bu adreslerin bir kısmı v1'de zaten yok (`/segmentler/crossfit` ve `/yazilim-secerken` 404 dönüyor) — v2'ye özgü rotalar oldukları için beklenen durum, ama sitemap'in bugün ne anlattığını gösteriyor.

**İlgili ölçüm, ayrı bir kalem:** `M7-Yayin-ve-Altyapi.md` → F7.2 kabul kriteri *"Sitemap 16 sayfayı listeler"* diyor; gerçek sayı **15**. Sitemap'in davranışı doğru (404 sayfası sitemap'te olmamalı ve değil); yanlış olan kriterin rakamı. Kriter düzeltilmeli.

Ayrıca `/favicon.ico` 404 dönüyor ve 57 KB'lık bir HTML gövdesi gönderiyor. `src/app/icon.png` mevcut ve HTML `<link rel="icon">` onu gösteriyor, yani modern tarayıcılar etkilenmiyor; ama `/favicon.ico`'yu geleneksel olarak isteyen istemciler (bazı önizleme ve paylaşım botları) bu yanıtı alıyor — paylaşım kartı sorununun küçük kardeşi.

## Kök Neden Yönü

`SITE.url` tek bir değer ve aşama kavramından habersiz. Proje `deployStage` türetimini zaten kurmuş (noindex, lead `env` alanı ve analitik etiketi hepsi oradan besleniyor); `metadataBase` o mekanizmanın dışında kalmış.

## Koruma Önerisi

- `metadataBase` aşamaya göre çözülür: `production` dışında Vercel'in kendi adresini (`VERCEL_URL`) kullanır. Tek koşul, mevcut `deployStage` deseninin doğal uzantısı — üçüncü bir ortam kavramı doğmaz.
- `/favicon.ico` için `src/app/` altına bir `favicon.ico` konabilir ya da yönlendirme verilebilir; küçük iş, önizleme paylaşımını tamamlar.
- F7.2 kriterindeki "16 sayfa" rakamı 15'e düzeltilir.
- Kalıcı koruma: yayın kapısı (M6 F6.2/F6.3) `og:image` adresinin gerçekten 200 döndüğünü kontrol eder. Tek istek, ve paylaşım kartının sessizce kırılmasını kalıcı olarak engeller.

## Çözüm Kaydı

—
