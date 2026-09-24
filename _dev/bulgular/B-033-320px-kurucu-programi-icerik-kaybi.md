# B-033: 320 px'te Kurucu Programı bölümü içerik **ve işlev** kaybediyor; kapı 320'yi hiç ölçmüyor

**Önem:** 🔴 | **Tip:** hata / erişilebilirlik-düzen | **Alan:** M2 — Sayfalar ve bölümler (`ui/Button` tabanlı)
**Kaynak:** audit-product (Gelen Kutusu `[TASK-1.07]` notunun mezuniyeti) | **Tarih:** 2026-09-12
**Durum:** → Faz 3

## Gözlem

**Beklenen:** `ILKELER.md` → "Erişilebilirlik WCAG AA'nın altına düşmez" (pazarlıksız). WCAG 1.4.10 reflow: **320 CSS px** genişlikte içerik ve işlev kaybolmadan akmalı. `docs/STYLE-GUIDE.md` → Düzen Tuzakları #2: *"Grid/flex çocuğuna `min-w-0` ver; `mobile-audit.mjs` doğrular."*

**Kapsam kararı (Kıvanç, audit-product 2026-09-12):** 320 px **destek kapsamında** ve kapıya girer. Bu bulgu bir Bilinçli Tercih'e dönüşmez, düzeltme kapsamı `mobile-audit.mjs`'in ölçtüğü genişliklere 320'nin eklenmesini de içerir. Pazarlıksız erişilebilirlik maddesi 390 px tabanına daralmaz. (Gelen Kutusu'ndaki `[audit-product SORU]` satırının mezuniyeti, 2026-09-13.)

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

**Birinci kalem (FounderProgram) kapandı — TASK-3.14, 2026-09-24.** İki düzeltme birlikte uygulandı: `Button.tsx` temel sınıfında `whitespace-nowrap` → **`sm:whitespace-nowrap`**, `FounderProgram.tsx` ızgara kabının iki çocuğuna **`min-w-0`**. Kapı (`mobile-audit.mjs`) `TOPLAM SORUN` **285 → 266**; @320 kırpılmış metin **19 → 0**, en ağır **70 px → 0**; @390 zaten 0 idi ve 0 kaldı. Kapsam tabanlarının hiçbiri oynamadı (16 rota · 2038 metin elemanı · 289 kritik hedef · 5 kaydırılabilir kap).

⚠️ **Bu atomun iki farklı sayım tanımı var, ikisi de bu turda yeniden ölçüldü.** Yukarıdaki Gözlem *"18 metin düğümü"*, bisect ise *"8 gövde düğümü / 66 px"* diyor. Kapının seçtiği tanım (**doğrudan metin taşıyan elemanın kutusu**, TASK-3.07'de üç aday yan yana koşularak seçildi) bugün **19 / 70 px** veriyor; **metin menzili** tanımı **9 / 66 px**. Zoom ayağı da aynı çiftle ölçüldü (320×256, %400): kapı tanımı **19 → 0**, menzil tanımı **9 → 0**. Yani atomun *"8"* rakamı bugün **9**'dur (66 px değişmedi) — kayıttan bu yana bir düğüm daha kapsama girmiş.

⚠️ **Kök neden zincirinin sıralaması düzeltildi.** Atom da task dokümanı da kırpmayı bitirenin `min-w-0` olduğunu söylüyordu. İzolasyon ölçümü (enjekte, `/` @320) tersini gösterdi:

```
taban          → 19 kırpma · track 370 · kart min-content 370 · buton 314 (nowrap)
min-w-0 yalnız →  0 kırpma · track 280 · kart min-content 370 · buton kutusu 224 ama içerik 243  ← ETİKET TAŞIYOR
nowrap  yalnız →  0 kırpma · track 280 · kart min-content 222 · buton 224/224, iki satır
ikisi birden   →  nowrap ile BİREBİR aynı
```

Yani `min-w-0` tabanın *geçişini* kesiyor, `nowrap`'in kalkması *tabanın kendisini* düşürüyor (370 → 222). Atomun *"yalnız ilki uygulanırsa etiket buton kutusundan taşar"* uyarısı **doğrulandı** (taşma 19 px).

**Sınıfın kalanı tarandı:** 16 rota × 8 genişlik (320 · 390 · 412 · 640 · 768 · 844 · 1024 · 1440). Düzeltmeden sonra dikey taşma **0**, yatay taşma **0**; sarma 320 px'te 13, 390 px'te 1, kalan altı genişlikte **0**. Atomun saydığı 240-247 px'lik beş butonun hiçbiri dolgulu bir kaba girmiş değil — tek kalem bu CTA idi.

**Yan bulgu:** aynı butonun WhatsApp ikonu 320 px'te **1,00 px**'e eziliyordu (`shrink-0` yok); düzeltmeden sonra **16,31 px** (doğal boy 18). Kalan sıkışma `BULGULAR.md` → Gelen Kutusu, `[TASK-3.14]`.

**İkinci kalem (Roller şeridi) de kapandı — TASK-3.15, 2026-09-24.** Sekme butonuna kap-bağımlı bir tavan kondu: `max-w-[calc(100%_-_3rem)] lg:max-w-none`. Kapı (`mobile-audit.mjs`) şerit ihlali **@320 8 → 0 · @390 8 → 0**, `TOPLAM SORUN` **266 → 250**. Kapsam tabanları oynamadı (16 rota · 2038 metin elemanı · 289 kritik hedef · **5 kaydırılabilir kap** — şerit `overflow-x-auto` kaldığı için `BEKLENEN_SERIT` sabit).

⚠️ **Bu atomun "320 px'te ikinci, daha küçük kalem" başlığı EKSİKTİ ve düzeltmenin yönünü değiştiriyordu.** Atom da TASK-3.07'nin test kriteri de kalemi *320 px'e* bağlıyordu; ölçüt ise **pencere değil kabın görünür genişliğidir**. Şeridin `clientWidth`'i 390 px penceresinde **350** (kapsayıcı dolgusu 2×20), kartlar 360/360/360/358 — yani **390 px'te de** her kart eksik görünüyordu. Ölçülen ihlal iki genişlikte de 4'er kart, ve şerit **iki rotada** var (`/` ve `/ozellikler`), toplam **16**. Pencereye göre yazılmış bir düzeltme 320'yi yeşile çevirse bile kapıyı 390'da kırmızı bırakırdı.

**Tavan `100%` değil `100% - 3rem` seçildi** (iki aday 2 rota × 7 genişlikte yan yana koşuldu): tam tavan kapıyı yeşile çevirir ama ilk kart görünür alanı tamamen doldurur ve kalan üç sekmenin varlığına dair hiçbir ipucu kalmaz. Seçilen pay her dar genişlikte **40 px'lik bir sonraki-kart payı** bırakır; bedeli 412 px'te kartın 360 → 324'e inmesidir (orada ihlal yoktu). Dikey yerleşim hiçbir genişlikte kaymadı (şerit yüksekliği 118, bölüm ve sayfa yüksekliği üç adayda da birebir) ve görünüş farkı **≥ 640 px'te 6 kombinde 0 piksel**, < 640 px'te tek bir 118 px'lik banda kapalı.

**Atom hâlâ arşive taşınmadı:** iki kalemin de düzeltmesi ölçüldü ama çözüm teyidinin evi `verify-phase` Adım 6'dır.
