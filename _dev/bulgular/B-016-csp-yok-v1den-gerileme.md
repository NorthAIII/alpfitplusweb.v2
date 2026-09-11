# B-016: v2'de Content-Security-Policy yok — v1'de var, yani yayın güvenliğinde gerileme

**Önem:** 🟡 | **Tip:** güvenlik / gerileme | **Alan:** M7 — Yayın ve altyapı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `OVERVIEW.md` v2'nin varlık gerekçesini net koyuyor: v1 denetimlerinin bulgularını **baştan çözmek**. `M7-Yayin-ve-Altyapi.md` → F7.2'nin gerekçesi doğrudan v1 denetiminin D-14 bulgusudur ("platform dışında hiçbir başlık gitmiyordu"). `QUALITY.md` → 2 Güvenlik güvenlik başlıklarını yayın zinciri üzerinden sorguluyor.

**Gözlenen:** v2'de **hiç `Content-Security-Policy` yok**. v1'de — bugün canlıda duran sitede — var ve ayrıntılı. Üç kalemde v2, v1'in gerisinde:

| Kalem | v1 (canlı) | v2 (önizleme) |
|---|---|---|
| CSP | tam politika: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'` | **yok** |
| `X-Frame-Options` | `DENY` | `SAMEORIGIN` — ve CSP `frame-ancestors` yedeği de yok |
| `Permissions-Policy` | `payment`, `usb`, `bluetooth`, `browsing-topics` da kapalı | `interest-cohort` — **terk edilmiş token**; güncel karşılığı `browsing-topics`, v1 zaten onu kullanıyor |

Diğer beş başlık v2'de sağlam ve bu tur ayrıca doğrulandı: HTML, statik varlık, font, webp, görsel optimizer çıktısı, API ucu, 404 ve `robots.txt`/`sitemap.xml` yanıtlarının hepsinde tam; Vercel zinciri hiçbirini soymuyor. Yani başlık altyapısı çalışıyor, eksik olan **politikanın kendisi**.

**Zamanlama — bu bulgunun bugün raporlanmasının sebebi:** v1'in CSP'si analitik alan adını beyaz listeye almış (`script-src ... https://umami.kiwiailab.com`). v2'ye analitik şu sıra ekleniyor. CSP olmadığı için yeni betik hiçbir engele takılmayacak, dolayısıyla **eksiklik fark edilmeyecek**. Analitik, CSP yazmak için doğal tetiktir; bu pencere kapanırsa bir daha kolay açılmaz.

## Kanıt

```
$ curl -sD - -o /dev/null https://alpfitplus-web-v2.vercel.app/ | grep -iE "content-security|x-frame|permissions-policy"
permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
x-frame-options: SAMEORIGIN
   → content-security-policy satırı YOK

$ curl -sD - -o /dev/null -L https://alpfitplus.com/ | grep -iE "content-security|x-frame|permissions-policy"
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'
  https://umami.kiwiailab.com; connect-src 'self' https://umami.kiwiailab.com;
  style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
  object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
permissions-policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(),
  bluetooth=(), browsing-topics=()
x-frame-options: DENY

$ grep -n "securityHeaders" -A 12 next.config.ts
36:const securityHeaders = [
37-  { key: "X-Content-Type-Options", value: "nosniff" },
38-  { key: "X-Frame-Options", value: "SAMEORIGIN" },
39-  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
41-    key: "Permissions-Policy",
42-    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
45-    key: "Strict-Transport-Security",
46-    value: "max-age=63072000; includeSubDomains; preload",
   → CSP girdisi hiç yok
```

Etki yüzeyi bugün dar — site büyük ölçüde statik ve üçüncü taraf betiği yok (önizlemede ölçüldü: hiç dış betik yüklenmiyor). Ama `/api/demo` form POST'u var, `/api/chat` yol haritasında, ve analitik betiği giriyor. `frame-ancestors` boşluğu clickjacking yüzeyini v1'in kapattığı yerde açık bırakıyor.

## Kök Neden Yönü

`next.config.ts` başlık listesi v1'den taşınırken beş başlık alınmış, CSP alınmamış. CSP'nin taşınması diğerlerinden zordur (politika siteye özgüdür, yanlış yazılırsa sayfayı kırar), muhtemelen "sonra" denmiş ve kayda geçmemiş — `DECISIONS.md`, `BULGULAR.md` → Bilinçli Tercihler, PHASE-1 ve arşiv task'larının hiçbirinde "CSP yazmıyoruz, çünkü…" kaydı yok. Kayıt olmadığı için bu bir tercih değil, **boşluk** olarak okunmalı.

`interest-cohort` ve `SAMEORIGIN` aynı taşımanın izleri gibi görünüyor: v1 daha güncel değerleri taşıyor, v2 daha eskisini.

## Koruma Önerisi

- CSP `next.config.ts` → `securityHeaders` içine yazılır; başlangıç noktası v1'in politikasıdır, analitik alan adı beyaz listeye alınır. Yayına çıkmadan önce `Content-Security-Policy-Report-Only` ile bir tur koşturmak kırılma riskini sıfırlar.
- Kapı tarafı: M6 F6.2/F6.3 kurulurken yayın zincirine karşı **beklenen başlık kümesi** kontrol edilir. Bugünkü beş başlık zaten doğrulanabilir durumda; liste kapıya bağlanırsa bir başlığın sessizce düşmesi ya da hiç eklenmemesi kırmızıya döner.
- `interest-cohort` → `browsing-topics` değişimi ve `X-Frame-Options: DENY` aynı düzeltmenin parçasıdır; `DENY`'nin siteyi kırmadığı v1'de zaten kanıtlı.

## Çözüm Kaydı

—
