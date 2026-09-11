# B-031: `a11y.mjs`'in kontrast yöntemi üç kör nokta taşıyor — yeşili gezdiği sayfalarda bile yanlış

**Önem:** 🔴 | **Tip:** test-kapsamı / sahte yeşil | **Alan:** M6 — Kalite kapıları
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M6-Kalite-Kapilari.md` başlangıç ölçümü "Kontrast ihlali (a11y.mjs): **0**" diyor ve bunu **regresyon çizgisi** ilan ediyor. `ILKELER.md` → "Erişilebilirlik WCAG AA'nın altına düşmez" pazarlıksız.

**Gözlenen:** O sıfır, kapının **gezdiği** sayfalarda bile doğru değil. Üç ayrı yöntem kusuru var ve üçü birden ölçüldü.

**(1) Kapsam çöküşü — kökte tek `background-image` bütün sayfayı ölçüm dışına atıyor, kapı yine "0" diyor.**
`a11y.mjs:44-57` `bgOf()` ata zincirini **kökten** yürüyor; zincirdeki herhangi bir düğümde `background-image !== none` varsa elemanı `painted` işaretleyip `:81`'de atıyor. `:109` `totalIssues` hesabına `r.skipped` **girmiyor**, yani "ölçülemeyen" sayısı hiçbir eşiğe bağlı değil.
```
/fiyat, kapının kendi mantığı birebir:
ÖNCE  (dokunulmamış)                : ölçülen 157 · kontrast ihlali 0 · ölçülemeyen  10
SONRA (<body>'ye dekoratif gradyan) : ölçülen   0 · kontrast ihlali 0 · ölçülemeyen 167
→ Kapının basacağı satır yine yeşil; TOPLAM SORUN katkısı 0.
```
Bugünkü hâlde de 8 sayfada **85 eleman** hiç ölçülmüyor (gradyan 59 · foto-üstü 9 · şeffaf 17).

**(2) Ata zincirinin opaklığı renge uygulanmıyor.**
`a11y.mjs:67` yalnız elemanın **kendi** `opacity`'sine bakıyor. `ProductStory.tsx:223` etkin olmayan adım kartlarını masaüstünde kalıcı `lg:opacity-45`'te tutuyor:
```
✗ opacity 0.45 → kapı 10.63:1 sanıyor, gerçek 2.99:1 (gereken 4.5) — "02 · grup"
✗ opacity 0.45 → kapı  8.03:1 sanıyor, gerçek 2.54:1 (gereken 4.5) — "Haftalık tekrarlı program…"
… 8 eleman/sayfa, `/` ve `/ozellikler`'de toplam 16
```
Kapı 1440 px'te ölçüyor, yani **tam da başarısız hâli render edip** "kontrast ihlali: 0" yazıyor.

**(3) Gradyan zeminli ve gradyan renkli metin hiç ölçülmüyor** — ve altında gerçek ihlaller var.
Bağımsız piksel yöntemiyle (metin rengi CSS'ten, zemin o koordinattaki gerçek pikselden, sabit/yapışkan katmanlar maskeden çıkarılarak) 9 rotada kapının atladığı **25 metnin 6'sı eşik altı**. Somut kalemler [B-032](B-032-olculmus-aa-ihlalleri.md)'de.

**(4) Başlık hiyerarşisi hiç kontrol edilmiyor.** Kapı yalnız `h1` **sayısına** bakıyor. 404'te dizi `h1 h3 h3 h3` — `h1 → h3` atlaması (kaynak: `Footer.tsx:92` kolon başlıkları `h3` ve sahipsiz). Gövdesinde `h2` olan sayfalarda görünmüyor, 404'te ölçülebilir ihlale dönüşüyor.

**Kapının temiz çalıştığı yanlar ayrıca kaydedilir** (şüphe edildi, ölçüldü, elendi): `Reveal` animasyonu kapıyı kör **etmiyor** — sayfayı gezerek ve gezmeden ölçüldü, sayılar birebir aynı (`.reveal{opacity:0}` sarmalayıcıda, metin elemanının kendi opaklığı 1). Kapının seçici listesi (`p,span,a,li,h1-h4,td,th,label,button,dt,dd`) pratikte darlık üretmiyor: liste dışında metin taşıyan eleman sayfa başına 0-2 ve hiçbirinde ihlal yok.

## Kanıt

```
$ sed -n '44,57p;67p;81p;109p' research/scripts/a11y.mjs
  44-57: bgOf() — ata zinciri, background-image !== none → painted
  67:    opacity yalnız elemanın kendisinden okunuyor
  81:    painted ise skipped++ ve devam
  109:   totalIssues = contrast + h1 + alt + name   (skipped YOK)
```
Kontrollü deney ve karşı-ölçüm betikleri scratchpad'de: `painted-kirilganlik.mjs`, `karsi-olcum.mjs`, `rotalar-6-kontrast-v3.mjs`.

## Kök Neden Yönü

Kapı, kontrastı **hesaplanmış stilden** türetiyor: renk + en yakın opak zemin. Bu model üç şeyi göremez — gradyan/fotoğraf zemini (tek renk yok), ata opaklığı (kompozisyon), gradyanla boyanmış metin (renk `transparent`). Üçünün de doğru çözümü aynı: **piksel ölçümü** (metin rengi CSS'ten, zemin render edilmiş kareden).

Daha derin katman [B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md) ve [B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) ile aynı: ölçüm sonucu **hangi kapsamda** alındığını söylemiyor. Orada kapsam rota ve etkileşim düzeyindeydi, burada **eleman** düzeyinde — ve "ölçülemeyen" sayısı hiçbir eşiğe bağlı olmadığı için dar bir sıfır geniş bir sıfır gibi okunuyor.

## Koruma Önerisi

- Zemin ölçümü **piksele** taşınır: iki ekran görüntüsü (metinli / metin şeffaf), fark = glif maskesi; metin rengi CSS'ten, zemin maskenin altındaki gerçek pikselden. Bu tek değişiklik (1) ve (3)'ü birden kapatır ve foto-üstü metni de ölçer. Çalışan uygulama scratchpad'de bırakıldı (`rotalar-6-kontrast-v3.mjs`), oradan devralınabilir.
- Ata zincirinin **opaklık çarpımı** renge uygulanır — (2) bununla kapanır ve B-032'nin birinci kalemi kapıya görünür olur.
- **`skipped` bir eşiktir**: ölçülemeyen eleman sayısı raporlanır ve sıfır olmayan her değer ya gerekçe listesine girer ya kırmızıya döner. Bugün 85 eleman sessizce atlanıyor.
- Başlık hiyerarşisi kontrolü eklenir (seviye atlaması kırmızı).
- Bu iş [B-030](B-030-kapilar-kirmiziya-donemiyor.md) ile **aynı turda** yapılmalı: yöntem düzeltilip çıkış kodu eklenmezse ihlaller görünür olur ama kapı yine yeşil kalır.

## Çözüm Kaydı

—
