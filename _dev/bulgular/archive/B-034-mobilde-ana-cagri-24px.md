# B-034: Mobilde fiyat sayfasının ana çağrısı 52 px yerine 24 px yükseklikte

**Önem:** 🔴 | **Tip:** hata / dönüşüm-erişilebilirlik | **Alan:** M2 — Sayfalar ve bölümler (`PriceCalculator`)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** ✅ Kapandı (TASK-2.04, 2026-09-23)

## Gözlem

**Beklenen:** `Button size="lg"` → `h-13` = **52 px**. `QUALITY.md` → 7: *"Dokunma hedefleri ≥ 44 px."* `ILKELER.md` → En Yüksek Öncelikli Eksenler, **1: Dönüşüm** — *"İki seçenek arasında kalındığında dönüşümü artıran kazanır."*

**Gözlenen:** `PriceCalculator`'ın CTA çifti ("Demo İste" + "Fiyat ayrıntısı") her mobil genişlikte **24 px**. Bağımsız ölçüm:

```
 320px  parent flex-direction:column   ölçülen 232x24   cssH 24px   flex-basis 0%   sınıflar [h-13 flex-1]
 390px  parent flex-direction:column   ölçülen 302x24   cssH 24px   flex-basis 0%
 639px  parent flex-direction:column   ölçülen 551x24   cssH 24px   flex-basis 0%
 640px  parent flex-direction:row      ölçülen 255x52   cssH 52px              ← sm: kırılımında düzeliyor
1440px  parent flex-direction:row      ölçülen 303x52   cssH 52px
```

Mekanizma: `PriceCalculator.tsx:163` kap `flex flex-col … sm:flex-row`; `:164` ve `:167` butonlarda **kırılım-kapsamsız `flex-1`**. Kolon modunda `flex: 1 1 0%`'ın basis'i **ana eksen = yükseklik** olduğu için `h-13`'ü eziyor. `sm` kırılımında satıra dönünce basis genişliğe geçiyor ve yükseklik geri geliyor.

**Doğru deyim kod tabanında zaten var:** `DemoForm.tsx:177` ve `:190` aynı deseni **`sm:flex-1`** ile yazıyor. Düzeltme tek kelime.

**Etki:** 390 px'te **12 örnek** (6 rota × 2 buton) — `/`, `/fiyat` ve dört segment sayfası. Bu, sitenin ana dönüşüm yüzeyi ve bugünkü ölçüsü tasarlananın **%46'sı**; aynı zamanda sitedeki en ağır dokunma-hedefi ihlali (24 px, eşik 44). Fiyatı görmeye gelen kulüp sahibi mobilde bu iki düğmeyi görüyor ama her ikisi de parmak ucuna göre çok kısa.

## Kanıt

```
$ sed -n '163,168p' src/components/sections/PriceCalculator.tsx
  163: <div className="... flex flex-col ... sm:flex-row ...">
  164:   <Button ... className="... h-13 ... flex-1">        ← kırılım yok
  167:   <Button ... className="... h-13 ... flex-1">        ← kırılım yok

$ sed -n '177p;190p' src/components/sections/DemoForm.tsx
  → aynı desen, "sm:flex-1"  (doğru deyim, aynı repoda)
```
Bağımsız ölçüm: `scratchpad/audit/verify-g1g2.mjs` (5 genişlik) · ilk ölçüm `vp-flex1.mjs` (639/640 kırılım nokta testi).

## Kök Neden Yönü

`flex-1` bir **genişlik** deyimi olarak yazılmış ama kabın yönü kırılıma bağlı; kırılımsız yazıldığı için kolon modunda yükseklik eziyor. Kardeş dosyada doğru hâli mevcut, yani bilgi projede var — kopyalanırken kırılım öneki düşmüş.

Bugüne dek görünmemesinin sebebi ölçüm kapsamı: `mobile-audit.mjs` dokunma hedefini `h < 40 && w < 200` kuralıyla arıyor, bu buton **302 px geniş** olduğu için `rc.width < 200` muafiyetine takılıyor ve hiç raporlanmıyor ([B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md)).

## Koruma Önerisi

- `flex-1` → `sm:flex-1` (iki satır). Düzeltme sonrası 390 ve 320 px'te yükseklik yeniden ölçülür.
- Kapı tarafı: `mobile-audit.mjs`'in `rc.width < 200` muafiyeti kaldırılır ve eşik QUALITY'nin yazdığı **44 px**'e çekilir — bu buton o an görünür hâle gelir. Muafiyet korunacaksa gerekçesi koda yazılır (bugün yazılı değil).
- Aynı sınıfı mekanik aramak mümkün: kırılım öneki taşımayan `flex-1` sınıfının `flex-col` kabındaki kullanımları. Bugün başka örnek bulunmadı; kural olarak eklenirse tekrar edemez.

## Çözüm Kaydı

**Tarih:** 2026-09-23 (TASK-2.04) — atomun düzeltme ayağı kapandı; kapı ayağı bilinçli olarak başka faza ait.

**Düzeltme tek dosyada, iki satır.** `PriceCalculator.tsx:164` ve `:167` → `className="flex-1"` yerine `className="sm:flex-1"`. Kap satırı (`:163`, `flex flex-col … sm:flex-row`), `h-13` ve buton bileşeni değişmedi. Deyim icat edilmedi: kod tabanında zaten vardı — bugünkü çapası `DemoForm.tsx:240,253` (yukarıdaki "Kanıt" bloğundaki `:177,190` 2026-09-12 ölçümünün kaydıdır, o dosya o tarihten sonra büyüdü).

**Ölçüm kontrol gruplu — aynı betik düzeltmeden önce de koştu.** Bu şarttı: taban kırmızı vermeseydi "sonra yeşil" hiçbir şey kanıtlamazdı.

| `/fiyat` genişlik | ÖNCE | SONRA | kap yönü |
|---|---|---|---|
| 320 px | 232×**24** · basis `0%` | 232×**52** · basis `auto` | column |
| 360 px | 272×**24** · basis `0%` | 272×**52** · basis `auto` | column |
| 390 px | 302×**24** · basis `0%` | 302×**52** · basis `auto` | column |
| 412 px | 324×**24** · basis `0%` | 324×**52** · basis `auto` | column |
| 640 px *(kontrol)* | 255×52 · basis `0%` | 255×52 · basis `0%` | row |
| 1440 px *(kontrol)* | 303×52 · basis `0%` | 303×52 · basis `0%` | row |

Mobil dörtlüde **0/8 → 8/8** örnek ≥ 52 px. Atomun saydığı **12 örnek** (6 rota × 2 buton) 390 px'te tek tek ölçüldü: **0/12 → 12/12**. Masaüstü kontrol grubu rakamı rakamına değişmedi — satır modunda `flex-1` hâlâ eşit genişlik veriyor, yani düzeltme yalnız kolon modunu hedefledi.

**Mekanizma doğrulandı:** ölçülen `flex-basis` kolon modunda `0%` → `auto` oldu, satır modunda `0%` kaldı. Yani basis artık yalnız kabın yönü satır olduğunda devrede — `h-13` kolon modunda ezilmiyor.

**Koruma önerisinin diğer iki ayağı bilinçle kurulmadı:**
- **Kapı tarafı** (`mobile-audit.mjs`'in `rc.width < 200` muafiyeti + eşiğin 44 px'e çekilmesi) bu fazın kapsamı dışında; evi B-015/B-031 ve "Kalite kapıları otomatik" fazı. ⚠️ Bu turda kanıtlandı: kapının toplamı düzeltmeden **önce de sonra da 157**'de sabit kaldı — buton 302 px geniş olduğu için muafiyete takılıyor ve kapı bu sınıfı hiç görmüyor. Sabit kalan sayı körlüğün kanıtıdır, düzeltmenin değil.
- **Mekanik kural** eklenmedi: araştırma depodaki dokuz `flex-1` kullanımını saydı, **beşi meşru** (`SegmentsGrid.tsx:50,54`, `Assistant.tsx:150,167`, `ProductStory.tsx:200`) ve ayırt edici imza dar (sabit `h-*` + `flex-1` + kolon kabı); imzasız bir kural beş yanlış alarm verirdi (`phases/PHASE-2.md`).

**Bugün bu sınıfı yakalayacak otomatik kapı yok** — regresyonu görecek şey doğrudan yükseklik ölçümüdür, `mobile-audit.mjs` değil.

**İkinci örnek aranıp bulunamadı:** `DemoForm.tsx:95` aynı `flex-col … sm:flex-row` desenini taşıyor ama çocukları `size="md"` ve `flex-1` kullanmıyor — temiz.

**Regresyon kapsamı:** `mobile-audit.mjs` 9/9 rotada **yatay kaydırma: yok** (M6 başlangıç çizgisi). `a11y.mjs` 8 rota **TOPLAM SORUN: 0**. `scan.mjs` 390×844'te `/fiyat` (10 kare / 7 734 px) ve `/segmentler/crossfit` (11 kare / 9 190 px) konsol temiz. `npm test` 6 dosya / 66 geçti + 1 atlandı (taban birebir; saf fonksiyon testleri bu katmanı kapsamıyor). Üretim derlemesi imajın builder katmanında hatasız.

Detay: `tasks/archive/TASK-2.04.md` → Oturum Kaydı.
