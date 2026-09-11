# B-030: Beş kalite kapısının dördü eşik altında bile çıkış kodu 0 döndürüyor — hiçbiri kırmızıya dönemiyor

**Önem:** 🔴 | **Tip:** test-kapsamı / kapı bütünlüğü | **Alan:** M6 — Kalite kapıları
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M6-Kalite-Kapilari.md` → F6.1 kabul kriteri #2, birebir: *"Eşik altı durumda **sıfır-olmayan çıkış kodu** döner."* F6.2 kriteri: *"`npm run check` tüm betikleri koşar; **biri kırmızıysa komut kırmızı**."*

**Gözlenen:** Beş betikten yalnız `font-guard.mjs` çıkış kodu veriyor (`:52 process.exitCode = 1`). Diğer dördü ihlal raporlasa bile **0** dönüyor.

```
a11y.mjs          exitCode:0    mobile-audit.mjs  exitCode:0
font-guard.mjs    exitCode:1    perf.mjs          exitCode:0
scan.mjs          exitCode:0
```

Deneysel kanıt — betiklerin **birebir kopyası**, yalnız hedef/rota satırı değiştirildi (`diff` ile doğrulandı):

```
a11y.mjs (boş sayfa sunan hedefe)  → TOPLAM SORUN: 8    ▶ ÇIKIŞ KODU = 0
mobile-audit.mjs (/silinmis-sayfa) → TOPLAM SORUN: 13   ▶ ÇIKIŞ KODU = 0
```

Sonuç: F6.2 bugünkü betiklerle **kurulamaz**. "Biri kırmızıysa komut kırmızı" kriteri mekanik olarak karşılanamaz, çünkü dördü kırmızıya dönemiyor. F6.3 (CI) aynı nedenle anlamsız kalır — workflow yeşil koşar.

Üç ek sessiz-geçiş yolu aynı sınıftan:

**(a) `font-guard.mjs` sıfır karakter taradığında "tam" diyor.** Hedef ayakta ama boş sayfa sunuyorsa:
```
Kümede 153 karakter · 16 sayfa · 0 karakter tarandı
✓ Kümede olmayan karakter YOK. Font kapsaması tam.        ▶ ÇIKIŞ KODU = 0
```
İfşa edecek rakam (`0 karakter tarandı`) aynı satırda basılıyor ama **hiçbir eşiğe bağlı değil**.

**(b) Hedef tamamen ölüyken "söyleyerek durma" yok.** Port kapalıysa `page.goto: net::ERR_CONNECTION_REFUSED` → yakalanmamış istisna, çıkış kodu 1. M6 F6.1 edge-case'i (*"betik bunu **söyleyerek** durmalı"*) yarım karşılanıyor: durma var, cümle yok — operatöre ham Node yığın izi gidiyor.

**(c) Hiçbir kapı HTTP durumunu kontrol etmiyor.** Yedi betikte `response.ok()`/`.status()` kullanımı **0**. Silinmiş bir rota mobil kapısının ilan edilmiş geçme şartını sağlıyor:
```
── /silinmis-sayfa (2476px)  [HTTP 404]
   yatay kaydırma:yok · taşan eleman:0 · küçük dokunma hedefi:13   ▶ ÇIKIŞ KODU = 0
```
CLAUDE.md'deki geçme şartı ("yatay kaydırma: yok") sağlanıyor → 404 sayfası sessizce "geçti" sayılıyor.

**(d) `mobile-audit.mjs` dosya başlığı ölçmediği bir şeyi iddia ediyor.** `:1` dört şey sayıyor: *"yatay tasma, kucuk dokunma hedefi, **tasan metin**, bolum boylari"*. Kod üçünü ölçüyor; taşan/kırpılan metin ölçümü **hiç yok** — kırpılmış taşma `clippedBy()` (`:19-26`) tarafından bilinçle ayıklanıyor ve yerine bir şey konmamış. Gelen Kutusu'ndaki `[TASK-1.07]` "sessiz kırpmayı görmüyor" notunun kaynağı budur; somut bedeli [B-033](B-033-320px-kurucu-programi-icerik-kaybi.md).

**(e) `a11y.mjs:112` teşhis satırında rengi `undefined` basıyor.** `:90-95` nesneye `fg`/`bg` yazıyor, `:112` `${x.color}` okuyor. Canlı: `✗ 1.17:1 (gereken 3) 112px undefined — "404"`. Kontrast hatasını düzeltmek için gereken iki değer tam da teşhis satırında kayboluyor.

## Kanıt

```
$ grep -n "process.exitCode\|process.exit" research/scripts/*.mjs
research/scripts/font-guard.mjs:52:  process.exitCode = 1;
  → başka vuruş yok

$ grep -c "response.ok()\|\.status()" research/scripts/*.mjs
  → hepsi 0

$ grep -n "clippedBy" research/scripts/mobile-audit.mjs
19: function clippedBy(el) { ... hidden|clip|auto|scroll ... }
$ sed -n '1p' research/scripts/mobile-audit.mjs
// Mobil denetim: yatay tasma, kucuk dokunma hedefi, tasan metin, bolum boylari
```
Kontrollü koşumlar scratchpad'de: `a11y-kopya-bos.mjs`, `mobile-kopya-404.mjs`, `bos-sunucu.mjs`.

## Kök Neden Yönü

Betikler **rapor aracı** olarak yazılmış, kapı olarak değil: ölçüyor, okunaklı basıyor, ama sonucu bir karara bağlamıyor. `font-guard.mjs` bir noktada çıkış kodu kazanmış, diğer dördü kalmış — aynı senkron kaybı deseni [B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md)'deki rota listelerinde de var (`font-guard` tam, diğerleri eksik). Yani bir betik güncellenmiş, kardeşleri hizalanmamış.

İkinci katman: kabul kriteri betiğin **adını** ve geçme **cümlesini** yazıyor, çıkış kodunu kimse doğrulamamış. Kriterin kendisi doğru; ölçülmemiş.

## Koruma Önerisi

- Dört betik `process.exitCode = 1` kazanır. Bu tek satırlık bir iş ama F6.2/F6.3'ün **ön koşulu** — tek komut ve CI bundan önce kurulursa doğduğu gün anlamsız olur.
- Her betik **kendi kapsamını da eşikler**: taradığı sayfa sayısı, ölçtüğü eleman sayısı ve ölçemediği eleman sayısı çıktıya girer ve beklenenin altına düşerse kırmızıya döner ([B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md) bunun a11y tarafındaki bedelini ölçüyor). "0 karakter tarandı" ve "0 eleman ölçüldü" birer kırmızı koşuludur.
- Hedef erişilemezse betik **cümleyle** durur (`Üretim konteyneri 3100'de ayakta değil — ölçüm yapılmadı`), yığın izi değil.
- Her betik gezdiği her rotanın HTTP durumunu doğrular; 404/5xx kırmızıdır.
- `mobile-audit.mjs`'in dosya başlığı ya ölçtüğüne indirilir ya taşan-metin ölçümü eklenir (ikincisi tercih edilir, B-033 onu gerektiriyor).
- `a11y.mjs:112` `fg`/`bg` değerlerini basar.

## Çözüm Kaydı

—
