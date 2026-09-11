# B-033: 320 px'te Kurucu Programı bölümü içerik **ve işlev** kaybediyor; kapı 320'yi hiç ölçmüyor

**Önem:** 🔴 | **Tip:** hata / erişilebilirlik-düzen | **Alan:** M2 — Sayfalar ve bölümler (`ui/Button` tabanlı)
**Kaynak:** audit-product (Gelen Kutusu `[TASK-1.07]` notunun mezuniyeti) | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → "Erişilebilirlik WCAG AA'nın altına düşmez" (pazarlıksız). WCAG 1.4.10 reflow: **320 CSS px** genişlikte içerik ve işlev kaybolmadan akmalı. `docs/STYLE-GUIDE.md` → Düzen Tuzakları #2: *"Grid/flex çocuğuna `min-w-0` ver; `mobile-audit.mjs` doğrular."*

**Gözlenen:** 320 px'te ana sayfadaki `FounderProgram` bölümünün ızgara track'i **370 px**, bölümün içerik kutusu **320 px** → bölümün `overflow-hidden`'ı sağdan **70 px** kesiyor. Bağımsız ölçüm:

```
320px  sayfaYatayKaydirma: false   bolumIcGenislik: 320   tasanEnGenis: 370
       kesilenMetinDugumu: 18      enAgir: 70px
       → "Kurucu Programı" (CTA etiketi) · "Ürünümüz yeni ve bunu saklamıyoruz…" · "Kontenjan gerçektir…"
390px  sayfaYatayKaydirma: false   tasanEnGenis: null     kesilenMetinDugumu: 0
```

Kesilenler arasında gövde metni **ve CTA'nın kendi etiketi** var — yani yalnız içerik değil **işlev** kaybı: "Kurucu Programı için konuşalım" düğmesinin yazısı okunmuyor. Kesilen kalemler (bağımsız ikinci ölçümde 8 gövde düğümü, en ağırları): `FounderProgram.tsx:67-70` kontenjan paragrafı 66 px · `:48` lead 65 px · `:13/:18/:23` üç PERK gövdesi 48/40/38 px · `:84/:94` iki StatusRow 32/22 px · `:104-106` **CTA etiketi 16 px**. `h2` ve üç PERK kartının kutusu da 70 px kırpılıyor.

**Kök neden zinciri — bisect ile kanıtlandı:**
```
kid1 <div.reveal>  rect=370  minContent=370  minWidth=auto
  ↳ mc=370 <div.rounded-lg.bg-white/6.p-7>          ← 314 + 2×28 (p-7) = 370
  ↳ mc=314 <a.inline-flex… ws:nowrap> "Kurucu Programı için konuşalım"
DENEY: ızgara çocuklarına min-width:0 → grid 370 → 280; kalan metin kırpması 0px
```
`src/components/ui/Button.tsx:8` temel sınıfında **`whitespace-nowrap`** → CTA etiketinin min-content'i **314 px** (kırılamaz) → `p-7` kartı içinde **370 px** taban → `FounderProgram.tsx:37` ızgara çocuklarında `min-w-0` yok (`min-width:auto`) → track 370'te kilitleniyor → `:29` `overflow-hidden` sessizce kesiyor.

**Neden bugüne dek görünmedi — iki katman:** (a) `mobile-audit.mjs` **320 px'i hiç ölçmüyor**; 390 px'te taşma 20 px ve metin 370 içinde sarıyor, yani kırpılan metin sıfır. 768 ve 1440'ta `lg:` iki sütuna geçtiği için hata hiç doğmuyor. (b) Sayfa yatay kaydırması **hiçbir genişlikte yok** (64 ölçümün tamamında), yani kapının geçme şartı ("yatay kaydırma: yok") sağlanıyor — bu, `mobile-audit.mjs`'in kırpılmış taşmayı ölçmemesinin somut bedeli ([B-030](B-030-kapilar-kirmiziya-donemiyor.md) kalem d).

**Sınıfın genişliği ölçüldü:** 11 rotadaki tüm `nowrap` buton/link'lerin min-content'i tarandı; 280 px'i aşan **tek** buton bu. Ama pay ince — sıradaki beş 240-247 px ("Geçiş planını konuşalım" 247, "WhatsApp'tan sorun" 246, "Demo talebi gönder" 242). Bunlar yalnızca dolgusuz kapta durdukları için sığıyor; herhangi biri `p-7` benzeri bir karta girerse aynı kırpma doğar. **Taban `Button.tsx:8`'de, bölümde değil.**

**320 px'te ikinci, daha küçük kalem:** `Roles.tsx:47` sekme şeridi `flex gap-2 overflow-x-auto`, kartlar `:58` `shrink-0` ve genişlikleri sabit `[360,360,360,358]`. 320 px'te tek kart (360) pencereden geniş → bir rol kartı hiçbir zaman tümüyle görünmüyor. Kaydırılabilir olduğu için sessiz kırpma değil, ayrı sınıf.

## Kanıt

```
$ sed -n '8p' src/components/ui/Button.tsx        → ... whitespace-nowrap ...
$ sed -n '29p;37p' src/components/sections/FounderProgram.tsx
  29: ... overflow-hidden ...
  37: <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-..."> ← min-w-0 YOK
```
Bağımsız doğrulama betiği: `scratchpad/audit/verify-g1g2.mjs`; bisect: `vp-founder.mjs`; matris: `vp-matrix.mjs` (16 rota × 320/390/768/1440).
Zoom ayağı: 1280×1024 tabanında %400 (320×256) → **kırpılanMetin 8, en ağır 66 px**; %100/%200/%250'de 0. Hiçbir zoom seviyesinde iki yönlü kaydırma yok, yani WCAG 1.4.10'un kaydırma ayağı geçiyor; kırılan ayak **içerik ve işlev kaybı**.

## Kök Neden Yönü

`whitespace-nowrap` bir ilkelin **temel** sınıfında duruyor, yani her buton onu miras alıyor ve uzun etiketli her CTA bir min-content tabanı dayatıyor. Izgara çocuğunun `min-width:auto` varsayılanı bu tabanı track'e geçiriyor; `overflow-hidden` sonucu görünmez kılıyor. Üç mekanizmanın hiçbiri tek başına hata değil — bileşimi hata, ve bileşimi gören bir kapı yok.

STYLE-GUIDE bu tuzağı **zaten kayıtlı** tutuyor (Düzen Tuzakları #2) ve "mobile-audit doğrular" diyor; doğrulamıyor.

## Koruma Önerisi

- İki düzeltme birlikte: `FounderProgram.tsx:37` ızgara çocuklarına `min-w-0` (kırpmayı bitirir) **ve** `Button.tsx:8` `whitespace-nowrap`'ın kaldırılması ya da `sm:` ile sınırlanması (görsel taşmayı bitirir). Yalnız ilki uygulanırsa kırpma biter ama etiket buton kutusundan taşar (ölçüldü).
- `mobile-audit.mjs` rota listesine **320 px** genişliği girer ve betik **kırpılmış taşmayı** ölçer: `scrollWidth > clientWidth` olan ve atasında `overflow:hidden|clip` bulunan elemanlar + ata sınır kutusunun sağından taşan çocuklar. Bu dedektör bu turda yazıldı ve çalışıyor (`scratchpad/audit/vp-matrix.mjs`), devralınabilir.
- Izgara/flex çocuklarında `min-w-0` yokluğunu arayan mekanik bir kontrol aynı kapıya girebilir — STYLE-GUIDE'ın kuralı bugün yalnız insan hafızasına bağlı.

## Çözüm Kaydı

—
