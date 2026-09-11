# B-049: Segment sayfasında yöntem ve tarih taşımayan rakip fiyat davranışı iddiası

**Önem:** 🟢 | **Tip:** tutarsızlık / iddia | **Alan:** M1 — İçerik ve iddia kaynağı (`src/content/segments.ts`)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → Söylenebilir/Söylenemez tablosu, fiyat kıyası satırı: *"Fiyat kıyası: rakibin **yayınlanmış liste fiyatından bizim hesabımız**, **erişim tarihiyle**"* ↔ söylenemez: *"Rakip **adı**; doğrulanmamış rakip fiyatı"*. Tek Kaynaklar tablosu: *"Karşılaştırma yöntemi ve tarihi → `src/content/karsilastirma.ts`; yöntem + erişim tarihi **zorunlu**, ad yok."*

**Gözlenen:** İki yerde rakiplerin fiyat davranışı hakkında niteliksel iddia var; adsız (✓) ama **yöntem ve tarih taşımıyor**:
- `segments.ts:239` — *"büyümek sizi **ceza fiyatına** maruz bırakmaz"*
- `segments.ts:254-255` — *"Yazılım maliyeti şube başına uçuyor"* / *"Mobil uygulamalı paketlerde şube sayısı arttıkça aylık tutar **hızla büyüyor**"*

Render: `/segmentler/cok-subeli-zincir`.

**Azaltıcı, ve bu kaydedilmelidir:** aynı sayfadaki **rakamlı** kıyas yöntem + tarih taşıyor (`PriceCalculator.tsx:147` → `RIVAL_MULTI_BRANCH.note`) ve `ARASTIRMA.date` `/yazilim-secerken`'de iki yerde basılıyor — yani projenin disiplini genel olarak yerinde. Ama o rakamlı blok **yalnız şube ≥ 2 seçilince** açılıyor ve hesaplayıcının varsayılanı `useState(1)`; sayfanın varsayılan hâlinde okuyucu yalnız niteliksel iddiayı görüyor.

Dayanak tarafı da sağlam: `../alpfit-plus-satis/rekabet/` dosyaları bu davranışı kaydediyor, yani iddia **uydurma değil** — eksik olan yayınlanan hâlinin yöntemi ve tarihi.

## Kanıt

```
$ sed -n '239p;254,255p' src/content/segments.ts
239: ... "büyümek sizi ceza fiyatına maruz bırakmaz" ...
254: "Yazılım maliyeti şube başına uçuyor"
255: "Mobil uygulamalı paketlerde şube sayısı arttıkça aylık tutar hızla büyüyor"

$ grep -n "ARASTIRMA.date\|RIVAL_MULTI_BRANCH.note" src/
  src/components/sections/PriceCalculator.tsx:147   (şube ≥ 2 iken görünür)
  src/app/yazilim-secerken/page.tsx:78, :126
$ grep -n "useState(1)" src/components/sections/PriceCalculator.tsx    → varsayılan 1 şube
```

## Kök Neden Yönü

CLAIMS'in yöntem+tarih şartı **rakamlı** kıyas düşünülerek yazılmış ve orada uygulanıyor. Niteliksel iddia ("uçuyor", "hızla büyüyor", "ceza fiyatı") aynı şartın kapsamında mı, belirsiz bırakılmış — ve belirsizlik metin yazarken doğal olarak "kapsam dışı" gibi davranılmasına yol açmış. Segment metinleri satış diliyle yazılmış, karşılaştırma sayfası ise denetim diliyle; iki dil aynı sınıra farklı mesafede duruyor.

## Koruma Önerisi

- İki cümle ya `ARASTIRMA` sabitine bağlı bir yöntem/tarih kancası alır (ör. kıyas bloğuna bağlanır ya da yanına "…(N ürünün yayınlanmış fiyatlarından, <tarih>)" ibaresi konur), ya niteliksel dilden çıkarılıp rakamlı bloğa devredilir.
- `PriceCalculator`'ın varsayılanı `1` kalacaksa, çok-şube segment sayfasında varsayılanı 2-3 yapmak hem kıyası hem yöntemini ilk bakışta görünür kılar — dönüşüm açısından da o sayfanın hedef kitlesine daha yakın.
- `CLAIMS.md`'ye tek satırlık açıklık: yöntem+tarih şartı **niteliksel** rakip davranışı iddialarını da kapsıyor mu? Bu, bugün açık olan iki `[audit-product SORU]` satırıyla (rakamsız yönlü vaatler; tarama rakamının yayımlanması) aynı ailede ve birlikte cevaplanabilir.
- Kalıcı koruma M6 F6.4'ün kapsamı: rakip davranışı anlatan kalıpları (`uçuyor`, `hızla büyüyor`, `ceza`, `katlanıyor`) arayan bir dal, vuruşun yakınında yöntem/tarih kancası olup olmadığını kontrol eder.

## Çözüm Kaydı

—
