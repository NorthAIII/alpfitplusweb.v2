# B-046: Görsel teslim katmanı — `priority` görünmeyen görselde, Roller sekmesi yanlış ekranı gösteriyor, Sora'da dört ok glifi yok

**Önem:** 🟡 | **Tip:** hata / performans-erişilebilirlik | **Alan:** M5 — Görsel varlık hattı (M2 kullanımı)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** → Faz 3

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

**ÖLÇÜLDÜ ve KARARA BAĞLANDI — audit-product triyajı 2026-09-23.** `src/components/sections/Roles.tsx:12-15`'teki görsel eşlemesi **bir satır kaymış**:

| Sekme | Bugün gösterdiği | Olması gereken |
|---|---|---|
| Üye | `SHOTS.uyeTelefon` | ✓ doğru |
| **Antrenör** | `SHOTS.takvim` (rezervasyon takvimi) | **`SHOTS.antrenor`** — ekran zaten üretiliyor |
| **Diyetisyen** | `SHOTS.antrenor` (antrenör ekranı) | karşılığı **yok** |
| Yönetim | `SHOTS.cockpit` | ✓ doğru |

- **Antrenör satırı bir hatadır ve düzeltilir** (tek satır): doğru ekran bugün üretilen kümede zaten var.
- **Diyetisyen satırı AÇIK kalır ve bilinçli tercih olarak KAYDEDİLMEZ.** Ölçüm: ürünün kendisinde diyetisyen ekranları **var** (`../Alpfit.v1/web/src/pages/DietitianMembersPage.tsx` · `DietitianMemberDetailPage.tsx` · `components/dietitian/`), yani iddia karşılıklı; eksik olan **demo destesi** — `../Alpfit.v1/demo/` sekiz ekran taşıyor ve diyetisyen onlardan biri değil, o yüzden hat üretemiyor. Ağırlığı: `docs/CLAIMS.md` diyetisyen modülünü ürünün **tek "gerçek fark"ı** sayıyor (18 rakip üründe görülmedi) ve sitede o farkın kendi görüntüsü yok; gösterilen görselin alt metni başka bir ekranı anlatıyor (ekran okuyucu ve arama motoru onu okur).
- **Kalıcı çözüm ürün deposunda:** demo destesine bir diyetisyen ekranı eklenmesi (kullanıcı tetikler — `../Alpfit.v1` bu oturumların dokunamadığı depo). Eklendiği gün bu hat onu olağan biçimde üretir ve temizler. Ödünç görsel bir yamadır; "bilinçli tercih" kaydı yazmak sonraki denetimlere yanlışlıkla "kapandı" sinyali verirdi.

## Çözüm Kaydı

**Kalem (2)'nin ANTRENÖR ayağı kapandı — TASK-3.15, 2026-09-24; DİYETİSYEN ayağı AÇIK.** `Roles.tsx` → `VISUAL.antrenor`: `SHOTS.takvim` → `SHOTS.antrenor`. Çerçeve artık rolün `device` alanından değil **görselin kendi oranından** türüyor (`shot.height > shot.width`): rolün `device`ini `web`e çekmek çerçeveyi düzeltirdi ama `faq.ts`, `gecis.ts` ve bölümün kendi lead cümlesi *"antrenör kendi telefonundan"* dediği için siteye yanlış bir cümle söyletirdi. Ölçüldü (elle tıklanarak, 320 · 390 · 1440 px): antrenör görselinin kutusu **244×129 telefon çerçevesinden** 280×202 / 350×253 / **562×405**'e çıktı — atomun *"okunmaz bir şeride iniyor"* tespiti kapandı.

**Diyetisyen vekili `SHOTS.antrenor` → `SHOTS.grup`'a taşındı, ama bu bir çözüm DEĞİL kusur önlemedir.** Antrenör satırı doğru ekrana bağlanınca iki sekme **aynı kareyi** gösterecekti, üstelik görüntünün kendi başlığı "Antrenör Detayı" yazdığı için "Diyetisyen" sekmesinin altında gözle de çelişerek. `grup`un başlığı başka bir rolü adlandırmaz ve alt metni (*"grup dersleri ekranı: kontenjan, katılımcı listesi ve yoklama"*) görüntüde gerçekten duranı anlatır — atomun *"alt metni sekmeyle tutarlı hâle getirilir"* koşulu böyle karşılandı, `src/content/shots.ts` hiç değişmeden. **Sitenin tek "gerçek fark"ının kendi görüntüsü hâlâ yok.**

⚠️ **Atomun kendi iddiası bu turda GENİŞLEDİ (ikinci kez).** Triyaj *"doğru ekran bugün üretilen kümede zaten var"* diyordu; araştırma bunu *"var ama masaüstü"* diye düzeltmişti. Bu tur görselin kendisi okundu: `antrenor.webp` (kaynağı `../Alpfit.v1/demo/antrenor.html`, `<title>` *"Antrenör Performansı"*, `<h1>` *"Antrenör Detayı"*) **yönetim panelinin** bir ekranıdır — üst solda "YÖNETİM", altta "Zehra G. · Şube Müdürü", kenar çubuğunda "Diyetisyenler" menü kalemi. Destedeki **bütün** masaüstü yakalamaları aynı paneldir (`takvim`, `grup`, `raporlar`, `finans`, `cockpit` gözle doğrulandı). Yani TASK-3.24'ün kapsamı "dikey bir yakalama" değil **rolün kendi yüzeyi** olmalı.

**Kalem (1) KAPANDI ve kalem (6) KISMEN kapandı — TASK-3.20, 2026-09-25.** Ölçüm 4 profil (390/2 · 768/2 · 1440/2 · 1440/1) × 16 rota = **156 `<img>`** üzerinden yeniden kuruldu; teslim yine `_next/image` yanıtı `sharp` ile açılarak okundu. **Atomun altı satırının altısı da birebir doğrulandı** (0,79 · 0,75 · 0,74 · 0,69 · 0,56 · 2,05) — tablo bayat değil.

**Kalem (1):** `priority` mobil karta *taşınmadı*, ProductStory'nin **ikisinden de kaldırıldı**. Gerekçe ölçüm: ürün turunun görseli 16 rotanın hiçbirinde, üç profilin hiçbirinde **LCP elemanı değil** (`/ozellikler`'de LCP 390/768/1440'ta da bir `<p>`), ve `loading="lazy"` + `display:none` eleman **hiç istek üretmiyor**. Taşımak sorunu simetrik olarak masaüstüne geçirirdi. Ölçülen kazanç: görünmez görsele giden istek **390'da 17 KB → 0**, **768'de 39 KB → 0**; görsel preload **28 → 24**; `/ozellikler`'de mobil preload **1 → 0**. `/segmentler`'in ilk kartı `priority` değil **`loading="eager"`** aldı ve sayfa-kapsamlı (`eagerFirst` prop'u) — Next 16.3.4'ün uyarı koşulu tam olarak `lcpImage.loading === 'lazy'` ve uyarının kendi önerdiği çare bu; bileşen `/`'da da kullanıldığı için bayrak sayfaya bağlandı. Negatif kontrol: bayrak kapatılınca uyarı geri geldi.

**`sizes`:** atomun saydığı **üç** yanlış beyan **dokuz**a çıktı. `Frames.tsx`'in iki bileşeninin de **ikişer çağrı yeri** var ve gerçek genişlikleri birbirinin iki katı (@1440 `BrowserFrame` Hero'da 659,7 ↔ Roller'de 561,6; `PhoneFrame` Hero'da 156 ↔ Roller'de 244), yani beyan bileşende sabitlenemiyordu → `sizes` prop'a çevrildi. En kötü sapma atomda hiç yazmıyordu: `(max-width: 1024px) 100vw, 62vw` @1024'te Roller çerçevesi için 1024 px söylüyor, gerçeği **492,5 px** — tarayıcı **2048 px'lik** varyantı çekiyordu (sitedeki en büyük fazla teslim). Bugün dokuz beyanın sapması **≤ %3**.

**Kalem (6) — altı satırın hâli:**

| Kullanım | gereken | teslim önce | teslim sonra | oran | |
|---|---|---|---|---|---|
| Ürün turu `raporlar` | 1520 | 1200 | 1200 | 0,79 | **açık** — kaynak 1200 px, `render-product.mjs` işi |
| Segment kartı (`-sm`) | 1068 | 800 | 800 | 0,75 | **açık** — kaynak 800 px, yeni varyant gerekir |
| HowItWorks bandı | 1088 | 800 | **1200** | **1,10** | ✅ `-band` |
| `/gecis` bandı | 1152 | 800 | **1200** | **1,04** | ✅ `-band` |
| Segment kahramanı | 2880 | 1600 | 1600 | 0,56 | **bilinçle açık** — `opacity-45` + `from-ink-deep/92` altında dekoratif doku; atomun kendi deyimiyle *"neredeyse görünmez bir doku için en pahalı tek istek"*, oraya 2880 px teslim etmek yanlış yön olurdu |
| ~~Roller~~ **Hero** telefon çerçevesi | 312 | 640 | **384** | **1,23** | ✅ |

⚠️ **Atomun *"Roller telefon çerçevesi"* satırının ADI YANLIŞ, rakamı doğru** (ölçüldü): 2,05 fazla teslim **Hero'nun bindirme telefonuna** ait (@1440/2 **156 px**); Roller'inki **244 px** ve oranı 1,31'di.

**Bant slotları `salon-genis-wide`'ı KULLANMADI — Koruma Önerisi'nin o cümlesi iki kere çürüdü.** (a) Dosya artık öksüz değil: TASK-3.18 onu `Benefits`'e koydu, `/` HTML'inde 10 kez geçiyor. (b) İki bandın fotoğrafını onunla değiştirmek `alt` metinlerini (*"daire şeklinde yapılan grup dersi"*, *"sade ve aydınlık bir stüdyo iç mekânı"*) yalan yapardı ve aynı fotoğraf sitede üç yerde görünürdü. Onun yerine önerinin **ikinci** cümlesi izlendi: `photos-build.mjs`'e **`-band` varyantı** (1600×608, 2,63:1 — `-wide` ile aynı oran) eklendi ve **aynı fotoğrafların** bant kırpımı üretildi. Dikey piksel kaybı `/gecis`'te **%50,1 → %12,3**, HowItWorks'te **%38,3 → %0** (orada kalan kayıp yatay, %7,7). `Benefits` bandının kaybı **%53,6'da değişmedi** — slotu 5,67:1, kaynak 2,63:1; kendi varyantı yok ve bu tur kapsamına alınmadı.

**Toplam etki:** 27 slot düzeldi, 0 slot bozuldu. Fazla teslim @1440/1 **14 → 1**, @390/2 **13 → 2**. `/` sayfa ağırlığı masaüstünde **141 → 111 KB**, mobilde **132 → 111 KB** (avif 46 → 16 ve 37 → 16 KB; font 95 KB birebir). Beş kapının beşi de önceki hâlini korudu.

**Kalem (3) KAPANDI — TASK-3.21, 2026-09-25.** İki ayağı da erişilebilirlik ağacında (CDP `Accessibility.getFullAXTree`, 3100 @1440×900) ölçüldü; AX'te `image` rolü taşıyan düğüm 8 rotada **28 → 14** düştü.

**Ayak bir — `opacity-0` çapraz geçiş kareleri.** Etkin olmayan kare `aria-hidden` aldı (`ProductStory.tsx`, koşullu: `i === active ? undefined : true`). Etkin kare **bilinçle ağaçta bırakıldı** — hepsine vermek ürün turunu ekran okuyucuda tümüyle sessizleştirirdi. Ölçülen: `/` **13 → 8** görsel düğüm, `/ozellikler` **6 → 2**. Düşen düğümler *"ignored"* olarak **bile yok** (ad sayımında anahtar hiç görünmüyor) — aynı davranış TASK-3.13'ün 404 dev rakamında ölçülmüştü, bu turda ikinci kez ve iki ayrı mekanizma için doğrulandı. Etkin karenin doğru okunduğu 6 kaydırma durağı × 2 rota × 2 genişlikte ölçüldü: her durakta ağaçta **tam bir** ürün turu düğümü var ve DOM'da görünür olanla birebir aynı.

**Ayak iki — dekoratif alt metinleri.** Üç kullanım (altı sayfa) `alt=""` aldı: `HowItWorks` bandı · `/gecis` bandı · segment kahramanı (dört segment sayfası). `src/content/` **değişmedi** — boşaltma **çağrı yerine** ait, çünkü `seg.photo.alt` `/segmentler`'deki kartta (bir `<a>` içinde, tam opaklıkta) bilgi taşımaya devam ediyor.

⚠️ **Atomun kalem (3) SAYILARI BAYAT ÇIKTI (rakamlar, tespit değil).** Atom *"`/`da cockpit alt metni 3×, diğer dördü 2×"* diyordu; erişilebilirlik ağacında düzeltmeden önce ölçülen **cockpit 2× · üye telefonu 2× · takvim/grup/finans/raporlar 1×**. Atomun sayımı HTML'deki `<img>` sayımı olmalı: ürün turunun **mobil kart** kopyaları masaüstünde `display:none` ve ağaçta hiç görünmüyor (19 `<img>` → 13 düğüm; eksilen 6 = 5 gizli kart + 1 zaten boş alt). Atom *"`/ozellikler`'de 3 görsel `opacity:0`"* diyordu, ölçülen **4**. *"72/72 öğede alt var, boş alt sıfır"* da bayattı — TASK-3.18'den beri **1** boş alt vardı (Benefits bandı); bugün **7**.

⚠️ **Kalan iki alt-metni tekrarı bu kalemin sınıfından DEĞİL ve açık kalıyor:** `/`'de üye telefonu alt metni iki kez okunuyor ve iki görsel de **gerçekten görünür** (Hero'nun bindirme telefonu 156×330 + Roller'in etkin sekmesi 244×516); 390 px'te cockpit aynı sebeple iki kez görünür (Hero + ürün turunun mobil kartı). Kayıt `BULGULAR.md` → Gelen Kutusu.

**"Dekoratif" iddiası ölçüldü — ve ilk kurulan ölçüt çürütüldü.** Bir `alt`i boşaltmak *"bu görsel bilgi taşımıyor"* iddiasıdır. Piksel katkısı (görselin kutusunun karesi ↔ görsel gizliyken aynı kare) bu iddiayı **ölçmüyor**: zaten `alt=""` taşıyan `Benefits` bandı kutusunun **%99,89**'unu değiştiriyor (maks kanal **251**) — ölçütün en yükseği, ama T3.18'in ölçerek verdiği karara göre dekoratif. Kullanılan dört ayak: (1) bağlantı/buton içinde mi — altı adayın altısı hayır, kontrol grubundaki segment **kartı** evet; (2) üzerinde kendi DOM metni var mı — HowItWorks 1, segment kahramanı **11**, `/gecis` bandı 0; (3) `alt`ın içerik kelimelerinden kaçı sayfa metninde — ürün ekranı kontrolü **10'da 8**, altı aday **4-7'de 1-3** ve eşleşenler sayfanın başlığından gelen jenerik sözcükler; (4) varlığın cinsi — altısı da `FOTOGRAF-KAYNAKLARI.txt`'te kayıtlı Pexels atmosfer fotoğrafı, içinde metin/veri/ürün arayüzü yok. Etkin opaklıklar ayrıca ölçüldü: `/gecis` bandı **0,80**, segment kahramanı **0,45** (+ `from-ink-deep/92 via-/78 to-/45` gradyan).

**Kapılar:** `a11y` **6 / çıkış 1** birebir (altısı `/gecis` kontrastı) ve `alt'sız img: 0` 16 rotanın 16'sında — kapı boş alt'ı hata saymıyor, dedektör de kör değil (bir `alt=""` öğesinin niteliği silinince sayım 0 → 1). `mobile-audit` **0 / çıkış 0, KAPI YEŞİL**. Altı kapsam tabanı oynamadı (eleman 6253 · metin elemanı 2054 · kritik hedef 305 · şerit 5 · gradyan 19 · başlık 316 · a11y eleman 1834). `font-guard` 85.129 / çıkış 0. `perf` `/` 111 KB iki profilde. **Görünüş: 12 kombinde 0 farklı piksel** (A/B aynı derlemede, yalnız `alt` + `aria-hidden` değişti).

Kalem (4), (5) açık → TASK-3.23; kalem (6)'nın üç satırı yukarıdaki gerekçelerle açık (segment kahramanının 87 KB'ı bu turda da dokunulmadı). Atom arşive taşınmadı; çözüm teyidinin evi `verify-phase` Adım 6'dır.
