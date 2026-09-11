# B-045: 404 ve `global-error` yüzeyleri markalı değil, istemci çöküşü hiçbir yere yazılmıyor

**Önem:** 🟡 | **Tip:** hata / gözlemlenebilirlik | **Alan:** M2 — Sayfalar (`not-found.tsx`, `global-error.tsx`)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `QUALITY.md` → 5 Hata Yönetimi: *"`global-error.tsx` ve 404 **markalı ve erişilebilir** mi?"* ve *"Beklenmeyen hatalar loglanıyor mu (yayın ortamında görünür mü)?"* `M2-Sayfalar-ve-Bolumler.md` → F2.2: *"Her sayfanın `metadata` (title, description, canonical) tanımlı."*

**Gözlenen — dört kalem, iki dosyada.**

**(1) `global-error.tsx` markasız.** Dosya kök layout'un yerine geçtiği için `globals.css` **import edilmiyor** → `@font-face` hiç yüklenmez ve `fontFamily: "Inter, …"` sistem fontuna düşer; `<title>` de yok, favicon de. Yani sitenin en kritik hata ekranı marka yüzü olmadan çiziliyor. Dosyanın bütün renkleri satır-içi literal ve bu **gerekçeli** (kök layout devre dışı, `globals.css` yüklenmiyor) — ama dosya yorumu (`:3-7`) yalnız `<html>/<body>` sebebini yazıyor, **ham hex sebebini yazmıyor**; altı ay sonra biri "token kullan" diye düzeltip hata sayfasını sessizce bozabilir.

**(2) İstemci çöküşü hiçbir yere yazılmıyor.** İmza `{ error: Error; reset }` ama yalnız `reset` destructure ediliyor; `error` prop'u **hiç kullanılmıyor** ve `console.error` yok. [B-025](B-025-calisma-zamani-alarm-yok.md)'in daha kötü hâli: orada sunucu tarafı loglar var ama alarm yok; burada **log bile yok**.

**(3) İki hata yüzeyinde de dev dekoratif rakam eşik altı kontrast.** `not-found.tsx:13` "404" → `text-sage-wash-2` (#dfeddd) canvas (#fbfbf9) üzerinde **1.12–1.17:1** (gereken 3.0, 112px / 390px'te 80px); `aria-hidden` **yok**, yani ekran okuyucu "404" okur ve kapının kuralı onu metin sayar. `global-error.tsx`'te "Hata" (40px/800) aynı renk çiftiyle **1.17:1** (statik hesap; dosya dev'de render ettirilemedi — Next'in hata katmanı devralıyor, `npm run build` bu turda yasaktı). Aynı dosyadaki diğer altı ölçüm **geçiyor**: `h1` 16.96, açıklama 6.80, "Tekrar dene" 7.67, "Ana sayfa" 17.57, "WhatsApp" 7.08. Kalem [B-032](B-032-olculmus-aa-ihlalleri.md)'nin beşinci satırıyla aynı; buraya dosya bağlamı için yazıldı.

**(4) 404'ün kendi `title`'ı yok ve başlık hiyerarşisi atlıyor.** Gözlenen `<title>` = `"Alpfit Plus — Spor Kulübü Yönetim Yazılımı"` (layout varsayılanı); `not-found.tsx` metadata export etmiyor. Başlık dizisi `h1 h3 h3 h3` → **h1 → h3 atlaması**; kaynak `Footer.tsx:92` kolon başlıklarının `h3` ve sahipsiz olması. Gövdesinde `h2` olan her sayfada sayısal atlama görünmüyor, yalnız 404'te ölçülebilir ihlale dönüşüyor. (Next.js'in `not-found.tsx` metadata desteği bu turda doğrulanmadı — düzeltme yolu iddia edilmiyor.)

**Ek: `global-error.tsx:72` elle `https://wa.me/905359375955`** yazıyor — [B-023](B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md) teyidi. Bu dosyada `src/content/` import etmemek **gerekçeli olabilir** (kök layout devre dışı) ama gerekçe yazılı değil.

**404'ün doğru yaptıkları kaydedilir:** markalı ve dolu bir sayfa (1044 karakter görünür metin, 37 bağlantı, header ve footer dâhil); `/segmentler/<geçersiz-slug>` ve kök 404'ü **kullanıcı gözünde birebir aynı** ve üçü de HTTP 404 dönüyor; `nav` etiketleri adlı; alt'sız görsel, adsız link/buton yok; 390 ve 320 px'te yatay kaydırma ve kırpma yok.

## Kanıt

```
$ grep -n "globals.css\|error\|title" src/app/global-error.tsx | head
  (globals.css importu YOK · export default function GlobalError({ reset }) — error kullanılmıyor)
$ grep -c "console\." src/app/global-error.tsx        → 0
$ sed -n '13p' src/app/not-found.tsx
  → className="font-display text-[5rem] ... text-sage-wash-2 sm:text-[7rem]"
$ grep -c "export const metadata" src/app/not-found.tsx   → 0

# a11y.mjs birebir kopyası, PAGES satırı 404'e çevrildi:
── /olmayan-sayfa   h1:1 · kontrast ihlali:1 · ölçülemeyen:2
   ✗ 1.17:1 (gereken 3) 112px undefined — "404"
   başlık dizisi: h1 h3 h3 h3      ← h1 → h3
```

## Kök Neden Yönü

İki dosya da **hiçbir kapının gezmediği** yüzeyler: 404 a11y ve mobil kapılarının rota listesinde yok ([B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md)), `global-error` ise ancak üretim derlemesinde render oluyor ve hiçbir betik onu tetiklemiyor. Yani kusurlar bir özensizlikten değil, **ölçülmemiş olmaktan** birikmiş — nitekim ikisinin de gövdesi özenle yazılmış ve ölçülen diğer altı kontrast değeri geçiyor.

`error` prop'unun kullanılmaması ayrı bir desen: hata yüzeyi **kullanıcıya** düşünülmüş, **operatöre** düşünülmemiş.

## Koruma Önerisi

- `global-error.tsx` `error`'ı loglar (`console.error`) — B-025'in alarmı kurulduğunda besleyeceği sinyal böyle doğar; bugün tek satır.
- Dosya başına ham hex gerekçesi yazılır (`globals.css` yüklenmiyor, token kullanılamaz).
- Marka yüzü için iki yol: kritik `@font-face` bildirimini bu dosyaya satır-içi almak ya da bilinçle sistem fontunda bırakıp gerekçeyi yazmak. `<title>` eklenir.
- Dev dekoratif rakamlar ya `aria-hidden` + dekoratif ilan edilir (o zaman kapı da atlamalı) ya kontrastı 3:1'e çıkarılır. Karar `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyor — rota listesi düzeltildiği gün ([B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md)) bu kalem kapıyı kırmızıya çeker.
- `Footer.tsx:92` kolon başlıkları `h3` yerine sahipsiz kalmayacak bir seviyeye (`h2`) ya da `div` + görsel stil'e çekilir; başlık hiyerarşisi kontrolü kapıya eklenir ([B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md)).
- 404 kapı rota listesine girer; `global-error` için tetiklenebilir bir ölçüm yolu tanımlanır (üretim derlemesinde bilinçli hata atan geçici bir rota, ya da bileşeni doğrudan render eden bir birim ölçümü).

## Çözüm Kaydı

—
