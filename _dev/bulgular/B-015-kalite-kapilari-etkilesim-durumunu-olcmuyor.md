# B-015: Erişilebilirlik ve mobil kapıları hiçbir şeye tıklamıyor — açılan hiçbir katman ölçülmüyor

**Önem:** 🔴 | **Tip:** test-kapsamı / sahte yeşil | **Alan:** M6 — Kalite kapıları (M4 asistan ve M2 mobil menü yüzeyleri)
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M4-Site-Asistani.md` → F4.1 kabul kriterleri iki ölçümü **adıyla** gösteriyor: *"Klavyeyle açılır, kapanır, gezilir; odak tuzağı yok (`a11y.mjs`)"* ve *"Mobilde panel ekranı taşırmaz (`mobile-audit.mjs`)"*. `M6-Kalite-Kapilari.md` başlangıç ölçümü bu iki betik için **0 sorun** kaydediyor ve bunu regresyon çizgisi ilan ediyor.

**Gözlenen:** Her iki betikte de **tek bir tıklama yok**. Sayfaları kapalı hâlde tarıyorlar. Asistan paneli hiç açılmıyor, mobil menü hiç açılmıyor, SSS akordeonları hiç genişletilmiyor. Yani F4.1'in iki kriteri de **adı geçen betik tarafından hiç ölçülmüyor**, ve başlangıç çizgisindeki "0 sorun" bu yüzeylere ait değil.

Bu sahte yeşilin arkasında gerçek ihlaller duruyor. Asistan paneli bu turda elle açılıp ölçüldüğünde bulunanlar:

| Gözlem | Ölçüm |
|---|---|
| Konu seçme yüzeyi (chip) dokunma hedefi | **28 px** (QUALITY 7 eşiği 44 px) — beş chip'in hepsi |
| "Baştan" düğmesi | 25 px |
| Mesaj akışı ekran okuyucuya duyurulmuyor | canlı bölge sayısı **0** |
| Kaydırılabilir mesaj akışı klavyeyle erişilemiyor | `tabIndex: -1`, içerik 597 px / görünen 298 px |
| Seçeneğe Enter'la basınca odak `body`'ye düşüyor | düğme 420 ms için kaldırılıyor, odak hedefi yok |
| Sayfa başında gizli ama odaklanabilir iki yüzen düğme | `opacity: 0` + `pointer-events: none`, `inert` yok |

Aynı kör nokta ikinci bir katmanda da ölçüldü: **mobil menü açıkken odak tuzağı yok**. Menü açıkken Tab altıncı öğeden sonra paneli terk edip arkadaki sayfada geziniyor; `body.overflow` kilitli ve Esc doğru çalışıyor ama arka plan `inert`/`aria-hidden` değil. Klavye kullanıcısı görünmeyen içeriğin içinde dolaşıyor. Hiçbir betik bunu ölçmüyor, çünkü menüyü de kimse açmıyor.

İkinci katman: eşik de gevşek. `mobile-audit.mjs` dokunma hedefini **40 px**'te kesiyor, QUALITY 7 ise **44 px** diyor — ve `rc.width < 200` koşulu yüzünden 200 px'den geniş ama kısa hedefler tamamen muaf. Betik paneli açsaydı bile 201×28 px'lik chip'i kaçıracaktı.

Üçüncü katman — **kriter ile kapı ayrışmış**: betik bugün kapalı sayfalarda bile **157 küçük dokunma hedefi** raporluyor (footer menüsü 39 px, breadcrumb 17 px, hesaplayıcı çipleri 36 px, footer'daki "Demo İste" 72×39 px). `M2-Sayfalar-ve-Bolumler.md` → F2.3 kriteri "≥ 44 px" diyor, ama `CLAUDE.md`'deki geçme şartı yalnız *"yatay kaydırma: yok"*. Yani betik ihlali görüyor, yazıyor, ve kapı yine yeşil yanıyor. Bu sayı her ölçümde sessizce büyür.

## Kanıt

```
$ grep -c "click" research/scripts/a11y.mjs
0
$ grep -c "click" research/scripts/mobile-audit.mjs
0

$ sed -n '41p;51p' research/scripts/mobile-audit.mjs
    // dokunma hedefi < 40px
      if (rc.height < 40 && rc.width < 200) {
```

Panel açıkken ölçülen dokunma hedefleri (Playwright, 1440×900 ve 390×844 — ikisinde de aynı):
```
✗   52x 25px  "Baştan"
✗  124x 28px  "Fiyat nasıl işliyor?"
✗  151x 28px  "Verilerimi kim taşıyor?"
✗  194x 28px  "Turnike almam gerekiyor mu?"
✗  201x 28px  "Mobil uygulama ayrı ücretli mi?"
✗  147x 28px  "Ürün hangi aşamada?"
```
ARIA anlık görüntüsü (panel açık):
```
{"role":"dialog","ariaModal":null,"ariaLabelledby":null,"liveRegions":0,"headings":[]}
{"mainInert":false,"mainAriaHidden":null,"bodyOverflow":"visible"}
{"scrollHeight":597,"clientHeight":298,"tabIndex":-1,"role":null,"label":null}
```
Kaynak: `src/components/layout/Assistant.tsx:157` (chip `px-2 py-1 text-[0.6875rem]`), `:164` (akış kutusu), `:86-90` (gizli FAB), `:64-76` (chip'leri kaldıran `ask()`).

**Kapının temiz çalıştığı yanı da kaydedilir:** panelin kendi kontrast ölçümü bu turda ayrıca yapıldı ve 14 metin öğesinin hepsi WCAG AA'yı geçti (en düşük 6,04:1). Esc kapatıyor, odağı launcher'a iade ediyor, odak tuzağı yok. `prefers-reduced-motion` saygı görüyor. Yani panel baştan savma yazılmamış — ölçülmediği için **bir katmanı** eksik kalmış.

## Kök Neden Yönü

Betikler sayfa-tarayıcı olarak tasarlanmış: rota listesini gez, statik DOM'u ölç. Açılır katmanlar (asistan, mobil menü, akordeon) bu modelin dışında kalıyor ve kimse farkı görmüyor, çünkü kabul kriteri betiğin **adını** yazıyor, kapsamını değil.

Kardeş bulgu [B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md) aynı kapıların **rota** kapsamındaki boşluğunu anlatıyor. İkisi birlikte aynı kök nedeni gösteriyor: ölçüm sonucu hangi kapsamda alındığını söylemiyor, bu yüzden dar bir sıfır geniş bir sıfır gibi okunuyor.

## Koruma Önerisi

- Kapılar bir **etkileşim durumları listesi** gezer: asistan paneli açık, mobil menü açık, SSS genişletilmiş. Her durum kendi ölçümünü alır. Liste `src/content/`'e değil betiğe ait — ama açık ve adlandırılmış olmalı ki yeni bir katman eklendiğinde nereye yazılacağı belli olsun.
- `mobile-audit.mjs` eşiği **44 px**'e çekilir ve `rc.width < 200` muafiyeti kaldırılır ya da gerekçesi koda yazılır. QUALITY 7 ile betik arasındaki sayı farkı bugün sessiz.
- Kabul kriterine betiğin adı yazılırken **neyi ölçtüğü** de yazılır ("`a11y.mjs`, panel açık durumda"). Bir kriterin ölçüm aracını adlandırması, o aracın o şeyi gerçekten ölçtüğünü kanıtlamaz — bu bulgunun asıl dersi budur.
- Aynı disiplinin üçüncü ayağı zaten Gelen Kutusu'nda kayıtlı: `mobile-audit.mjs` `overflow-hidden` ile sessizce kırpılan taşmayı da görmüyor (TASK-1.07 kaydı). Üçü tek bir "kapı kör noktaları" işine girer.

## Çözüm Kaydı

—
