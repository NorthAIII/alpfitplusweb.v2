# B-046: Görsel teslim katmanı — `priority` görünmeyen görselde, Roller sekmesi yanlış ekranı gösteriyor, Sora'da dört ok glifi yok

**Önem:** 🟡 | **Tip:** hata / performans-erişilebilirlik | **Alan:** M5 — Görsel varlık hattı (M2 kullanımı)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `QUALITY.md` → 4: *"Görseller `next/image`, doğru boyut ve format ile mi geliyor?"* → 7: *"Tüm görsellerde alt metni; **dekoratif olanlar boş alt** mı?"* `M5-Gorsel-Varlik-Hatti.md` → F5.3: *"`font-guard.mjs`: 16 sayfada kümede olmayan karakter yok"*. `modules/M4`/`faq.ts:16`/`gecis.ts:22`: *"antrenörün kullandığı yüzey **kendi telefonundaki uygulamadır**"*.

**Gözlenen — dört kalem.**

**(1) `priority` mobilde görünmeyen bir görselde.** `ProductStory.tsx:156` `priority={i === 0}`, ama o `<Image>` `:132`'deki `<div className="hidden lg:block">` içinde:
```
390×844   preload edilen: takvim.webp&w=750   13.108 B   görünür mü: HAYIR (display:none)
768×1024  preload edilen: takvim.webp&w=1080  21.625 B   görünür mü: HAYIR (display:none)
```
`/ozellikler`'de bu, mobilde **sayfadaki tek görsel preload'u**; gerçekten görünen ilk ürün ekranı ise `loading="lazy"`. Yani öncelik ters yerde.
Ayrıca `/segmentler`'in ilk kart görseli 768 px ve üstünde ekran üstüne giriyor ama `loading="lazy"`; Next 768'de LCP elemanı olarak seçip **uyarı basıyor** (`Image with src "/foto/pilates-reformer-sm.webp" was detected as the Largest Contentful Paint`).

**(2) Roller sekmelerinde yanlış ekran ve okunmaz ölçek — ve sitenin tek gerçek farkının görseli hiç yok.**
`Roles.tsx:12-15` eşlemesi:
```
uye        → SHOTS.uyeTelefon   ✓
antrenor   → SHOTS.takvim       ← 1440×760 MASAÜSTÜ panosu, telefon çerçevesinde
diyetisyen → SHOTS.antrenor     ← ANTRENÖR detay ekranı
yonetim    → SHOTS.cockpit      ✓
```
`antrenor` rolü `device: "mobil"`, `deviceLabel: "Telefon"` (`product.ts:28-31`) olduğu için `PhoneFrame`'e giriyor; ölçülen kutu **244×129 px** — 1440×760'lık bir masaüstü panosu telefon çerçevesinde okunmaz bir şeride iniyor. Sitenin kendi anlatısıyla da çelişiyor (antrenörün yüzeyi kendi telefonu).
`diyetisyen` sekmesi antrenör ekranını gösteriyor ve `shots.ts:43` alt metni bunu **açıkça söylüyor**: *"Alpfit Plus **antrenör detay ekranı**: aylık performans ve öğrenci tutma"* — ekran okuyucu kullanıcısı "Diyetisyen · Web paneli" sekmesinde "antrenör detay ekranı" duyuyor. Ürünün gerçek diyetisyen ekranları **var** (`../Alpfit.v1/web/src/pages/DietitianMembersPage.tsx`, `DietitianMemberDetailPage.tsx`) ama `demo/` altında karşılık gelen HTML olmadığı için görseli hiç üretilmemiş. Sonuç: `docs/CLAIMS.md`'nin *"gerçek fark"* dediği **tek** kalemin sitede kendi görüntüsü yok.
Bu bugüne dek görünmedi çünkü ilk boyada yalnız aktif sekmenin (`uye`) görseli render ediliyor — tıklamayan kapı göremez ([B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md)).

**(3) `opacity-0` çapraz geçiş görselleri erişilebilirlik ağacından düşmüyor.** `ProductStory.tsx:159`'da `aria-hidden`/`inert` yok; masaüstü `/`'da 4 görsel, `/ozellikler`'de 3 görsel `opacity:0` hâlde duruyor. Ekran okuyucu **beş ürün ekranının alt metnini arka arkaya** okuyor. Ayrıca `/` sayfasında cockpit alt metni 3×, diğer dördü 2× tekrarlanıyor. Bununla birlikte en az üç kullanım saf **dekoratif** olmasına rağmen betimleyici alt taşıyor (`gecis/page.tsx:171` bandı, `HowItWorks.tsx:72` bandı, segment kahramanı — `opacity-45` + koyu gradyan altında) — QUALITY 7'nin "dekoratif olanlar boş alt" maddesi uygulanmamış. Alt sayımı: 72/72 öğede alt var, **boş alt sıfır**.

**(4) Sora daraltılmış kümedeki beş karakteri taşımıyor — `font-guard` bunu yapısal olarak göremiyor.**
Ölçüm (Chromium CDP `CSS.getPlatformFontsForNode`, karakter başına bir `<span>`, yedeksiz `font-family`): **Sora 700 ve Sora 800'de `₺` (U+20BA) ve dört ok `←↑→↓` (U+2190–2193) yok** — ilki Unifont'a, okları Liberation Serif'e düşüyor. `₺`'nin yokluğu STYLE-GUIDE'da kayıtlı ve Inter yedeği bilinçli; **okların yokluğu hiçbir yerde kayıtlı değil**. Inter üç ağırlıkta 150/152 doğrulandı (iki karakterde CDP boş liste döndürdü, sonuçsuz).
`font-guard.mjs` yalnız *"site metni ⊆ küme dosyası"* doğruluyor (`:12` `readFile('FONT-KARAKTER-KUMESI.txt')`); *"küme ⊆ woff2 glifleri"* hiç doğrulanmıyor, dolayısıyla bu beş glif hiçbir koşumda görünmüyor. **Bugün vekil doğru** ve bu kaydedilir — dev sunucusuna karşı koşturulan eşdeğer ölçüm (16 sayfa, asistan paneli açık, 79.685 karakter) kümede olmayan karakter bulmadı, yani F5.3'ün kabul kriteri bayat 3100'e bağlı kalmadan da karşılanıyor.
`₺`'nin fiilî hâli ölçüldü: `--font-display` + `font-weight:800` bağlamında `₺` **Inter SemiBold (600)**, yanındaki rakamlar Sora ExtraBold (800) — yedek çalışıyor (sistem fontuna düşmüyor ✓) ama aynı satırda hem aile hem **ağırlık** değişiyor.

**(5) Preload beyanı ölçümle çelişiyor.** `layout.tsx:129` yorumu: *"Ilk ekranda gorunen iki yuz: govde (Inter 400) ve baslik (Sora 800)"*. Ölçüm (ana sayfa ilk ekran, kendi metni olan öğeler): **Inter 500 → 28 öğe** (en yaygın), Inter 400 → 8, Sora 800 → 5, **Sora 700 → 5**, Inter 600 → 1. Preload edilen yalnız `inter-400` + `sora-800`.

**(6) Kaynak dosya tavanı — hi-dpi'de altı kullanım yeri gereken pikselin altında.** Gerçek teslim `_next/image` yanıtı `sharp` ile açılarak ölçüldü (`naturalWidth` srcset altında yoğunluğa bölündüğü için yanıltıcıdır; o yöntem 10 örnekte doğrulanıp atıldı):

| Kullanım | kaynak | vp/dpr | CSS genişlik | gereken | teslim | oran |
|---|---|---|---|---|---|---|
| Ürün turu `raporlar` | 1200 | 1440/2 | 760 | 1520 | 1200 | **0,79** |
| Segment kartı (`-sm`) | 800 | 1440/2 | 534 | 1068 | 800 | **0,75** |
| HowItWorks bandı (`-sm`) | 800 | 1440/2 | 544 | 1088 | 800 | **0,74** |
| `/gecis` bandı (`-sm`) | 800 | 1440/2 | 576 | 1152 | 800 | **0,69** |
| Segment kahramanı | 1600 | 1440/2 | 1440 | 2880 | 1600 | **0,56** |
| Roller telefon çerçevesi | 720 | 1440/2 | 156 | 312 | 640 | **2,05 fazla** |

Ters yönde şekil uyumsuzluğu: 3:2 kaynaklar bant slotlarına `object-cover` ile giriyor ve dikey pikselin %40–60'ı atılıyor (`/gecis` `h-48` → 3:1, HowItWorks `h-56` → 2,43:1, segment kahramanı 2,31:1) — oysa hattın ürettiği **2000×760 bant varyantı (`salon-genis-wide.webp`) hiç kullanılmıyor**. Segment kahramanı 89.185 B ve `opacity-45` + `from-ink-deep/92` gradyan altında, yani neredeyse görünmez bir doku için en pahalı tek istek.
`sizes` beyanları da gerçek yerleşimin üstünde: `Frames.tsx:45` `62vw` ↔ gerçek 45,8vw · `ProductStory.tsx:154` `58vw` ↔ 52,8vw · `SegmentsGrid.tsx:35` `42vw` ↔ 37vw.

**Temiz çıkanlar kaydedilir:** ham `<img>` **yok** (0), tüm görseller `next/image`; boyut bildirimi tam (4 yer `width`/`height`, 2 yer `fill` + `aspect-16/9` ya da yükseklik veren kap) → **yapısal CLS riski sıfır**; AVIF devrede (48/48 `_next/image` yanıtı `image/avif`); kırık varlık yok (22/22 referans diskte, 5/5 font URL'i 200); fotoğraf hattının kayıt bütünlüğü **tam** (11/11 dosya `FOTOGRAF-KAYNAKLARI.txt`'de, lisans ve tarih yazılı, `diff` ile `KAYNAK.txt` ile aynı → F5.2 karşılanıyor); OG 1200×630 ✓ ve OG metin kontrastı 6,51–17,86 arası, **hepsi AA geçiyor** (ölçüldü — F5.4 fiilen karşılanıyor, ama rakam hiçbir yerde kayıtlı değil); 510 istekte konsol ve ağ tamamen temiz.

## Kanıt

```
$ sed -n '132p;154,159p' src/components/sections/ProductStory.tsx
132: <div className="hidden lg:block ...">          ← priority bunun içinde
156:   priority={i === 0}          159:   className="... opacity-0 ..."   ← aria-hidden yok

$ sed -n '12,15p' src/components/sections/Roles.tsx
  antrenor: SHOTS.takvim,      diyetisyen: SHOTS.antrenor,
$ sed -n '28,31p;42,45p' src/content/product.ts
  antrenor: device "mobil", deviceLabel "Telefon"   ·   diyetisyen: device "web"
$ sed -n '43p' src/content/shots.ts
  alt: "Alpfit Plus antrenör detay ekranı: aylık performans ve öğrenci tutma"

$ sed -n '12p' research/scripts/font-guard.mjs
  → readFile('/work/FONT-KARAKTER-KUMESI.txt')     ← küme ⊆ woff2 doğrulaması yok
```
Glif ölçümü, teslim ölçümü ve preload sayımı scratchpad'de.

## Kök Neden Yönü

Üç ayrı desen: **(a)** `priority` ve `sizes` beyanları yazıldıkları anda doğruydu ama yerleşim sonradan kırılıma bağlandı (`hidden lg:block`) ve beyan güncellenmedi — kimse mobilde ne preload edildiğine bakmadı. **(b)** Roller eşlemesi bir **vekil** kullanıyor (diyetisyen ekranı yok, antrenör ekranı kondu) ve vekil olduğu kodda yazılı değil; aynı satırda ikinci bir hata (masaüstü panosunun telefon çerçevesine girmesi) kimsenin sekmeyi tıklamamış olmasıyla saklandı. **(c)** `font-guard` "kapsama" adını taşıyor ama ölçtüğü şey **beyan ↔ metin** uyumu; fontun kendisi hiç sorgulanmıyor — yani üretim (`font-subset.mjs`) ile tüketim arasındaki sözleşme doğrulanmıyor.

## Koruma Önerisi

- `priority` gerçekten ilk ekranda görünen görsele taşınır (mobilde ürün turunun mobil kartı, masaüstünde yapışkan sütun); `/segmentler`'in ilk kartı 768 px ve üstünde `priority` alır. `sizes` değerleri ölçülen yerleşime çekilir.
- `Roles.tsx` eşlemesi düzeltilir: `antrenor` için gerçek bir mobil ekran (ürünün antrenör mobil uygulaması) ya da rolün `device` değeri gerçeğe çekilir; `diyetisyen` için `demo/` altına bir diyetisyen ekranı eklenir ve hat onu üretir — bu, CLAIMS'in "gerçek fark" dediği kalemin görselsiz kalmasını da bitirir. Vekil kullanılmaya devam edecekse gerekçe koda yazılır ve **alt metni sekmeyle tutarlı** hâle getirilir.
- `opacity-0` çapraz geçiş görsellerine `aria-hidden` (ya da `inert`) eklenir; dekoratif üç bandın alt metni boşaltılır.
- **`font-guard.mjs`'e ikinci dal eklenir:** küme dosyasındaki her karakterin üretilen woff2'lerde gerçekten bulunduğu doğrulanır. `document.fonts.check()` ya da CDP yeterli, yeni bağımlılık gerekmez. Sora'nın dört ok glifi ya kümeden düşürülür ya font yeniden üretilir; `₺` gibi bilinçli yedeklenenler bir muafiyet listesinde adıyla durur.
- Preload listesi ölçülen ilk-ekran yüzlerine göre güncellenir (Inter 500 ve Sora 700 dâhil) ya da yorum ölçüme göre düzeltilir.
- Hi-dpi tavanı için: bant slotları hattın ürettiği **2000×760 varyantını** kullanır (`salon-genis-wide.webp` bugün öksüz — [B-047](B-047-bakim-borcu-envanteri.md)); `-sm` varyantlarının kaynak genişliği kullanım boyutuna göre yeniden seçilir. OG kontrast rakamları `brand-assets.mjs` yorumuna yazılır (STYLE-GUIDE'ın "ölçümü rakamıyla yaz" geleneği bu dosyaya erişmiyor).

## Çözüm Kaydı

—
