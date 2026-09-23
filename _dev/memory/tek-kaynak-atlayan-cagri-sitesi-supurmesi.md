# Tek kaynağı atlayan çağrı siteleri kapanışta sayılır

Bu proje bir dizi davranışı **tek kaynaktan** türetir: `PRODUCT_STATUS` (pilot
cümlesi), `PRICING`/`monthlyFor()` (fiyat), `CONTACT` (WhatsApp/telefon),
`deployStage` (noindex + lead `env` + Umami etiketi), `EVENTS`/`SURFACES`
(analitik sözlüğü), `lib/contact.ts` (iletişim doğrulaması), kök
`layout.tsx` → `metadata.robots`.

**Kural:** böyle bir kaynağı **tanıtan ya da değiştiren** her task, kapanışta
kaynağı **atlayan** çağrı sitelerini grep'le sayar ve sayıyı test/kapanış
notuna yazar. Sıfır değilse ya kapsama alınır ya kanvasa düşer — "biz doğru
yazdık" yeterli değildir.

## Neden: saf fonksiyon testi bu sınıfı göremez

TASK-1.20 (UAT #33, B-041) bunun kanıtıdır. `tests/stage.test.ts`'in **beş
senaryosu da yeşildi** — çünkü hepsi `deriveDeployStage()` saf fonksiyonunu
ölçüyordu. Kusur ise üç yasal sayfanın (`kvkk`, `gizlilik`,
`kullanim-kosullari`) o türevi **hiç çağırmaması**, sabit
`robots: { index: true }` yazmasıydı: canlı önizlemede üç sayfa `index, follow`
sunuyordu. Kapanış bir düzeltme task'ı ve ikinci bir UAT turu maliyetindeydi.

[Aşamaya bağlı davranışta ara hâl sınaması](asama-bagimli-davranis-ara-hal-sinamasi.md)
bu atomun kardeşidir ve zaten "ölçüm **serving katmanında** yapılır, saf
fonksiyon düzeyinde değil" diyordu — TASK-1.20 o uyarıyı doğruladı. Buradaki
ek, **hangi yüzeylerin sayılacağıdır**: kaynağı çağıranlar değil, **atlayanlar**.

## Sınıfın açık örnekleri (kanvasta)

- B-023 — 8 fiyat + 4 iletişim değeri tek kaynak dışında
- B-014 — chat ağacı pilot cümlesini `site.ts`'ten okumuyor, elle yazıyor
- `global-error.tsx` WhatsApp adresini elle yazıyor (Gelen Kutusu)

## Uygulama anı ve komut biçimi

Task closure'ında (`run-task` test adımı) ve `verify-phase` sınıf
süpürmesinde. Biçim: kaynağın **adını** değil, onu **atlayan yazımı** ara —
örn. `grep -rn "robots:" src/ | grep -v "app/layout.tsx"`,
`grep -rn "window.umami" src/ | grep -v "lib/analytics.ts"`,
`grep -rn "wa.me\|tel:+" src/ | grep -v "content/site.ts"`.

## Süpürmenin kendisi sessizce kör olabilir — çapa sondası şart

Grep/tarama bir **kapıdır** ve yeşili tek başına kanıt değildir: kapsamı
kaçıran bir kalıp hata vermez, yalnız **az sayı** basar ve "temiz" diye
okunur. Bu projede iki kör etme biçimi ölçüldü:

- **Harf ve aksan duyarlılığı** (TASK-2.11). B-040'ın kanıt komutu harfe
  duyarlıydı ve `karsilastirma.ts`'in küçük harfli *"online ödeme"*'sini hiç
  görmedi — altıncı bir cümle kapanış ölçümünden sonra ortaya çıktı.
  ⚠️ **Çaresi "duyarsız yap" DEĞİL — Türkçe'de naif duyarsızlık da kaçırır**
  (TASK-2.15'te ölçüldü). `I`/`ı` ve `İ`/`i` çiftleri Unicode'un varsayılan
  kıvrımında eşleşmez; ölçüm, `"EN HIZLI BÜYÜYEN ŞUBE"` üzerinde:

  | yöntem | sonuç |
  |---|---|
  | `/en hızlı/i` | **KAÇIRDI** |
  | `.toLowerCase().includes("en hızlı")` | **KAÇIRDI** (`"en hizli"` üretir) |
  | `.toLocaleLowerCase("tr").includes("en hızlı")` | **EŞLEŞTİ** |

  **Kural:** Türkçe metinde kalıp eşlemesi önce `toLocaleLowerCase("tr")` ile
  normalize edilir ve kalıplar küçük harfle yazılır; `/i` bayrağına güvenmek
  sessiz bir fail-open'dır. Tersi de doğru: aranan şey **kaynağın özel adı**
  ise harfe duyarlı kalınır (küçültme kümeye sıradan sözcük sokar — TASK-2.14,
  `research/lib/screen-cleanup-v2.mjs` → "Neden harfe DUYARLI"). Ölçüt aranan
  şeyin **ne olduğudur**: bizim yazdığımız düzyazı kavram → duyarsız (Türkçe
  yerelle); kaynağın kendi özel adı → duyarlı.
- **Kalıp granülerliği** (TASK-2.12). Konu kalıpları iki kavramın **aynı
  satırda** bulunmasını istiyordu (`diyetisyen` ∧ `ölçüm`); dizi elemanları
  ayrı satırlarda durduğu için tarama, B-029'un adıyla saydığı iki çapayı
  (`product.ts` üye rolü maddeleri, `chat.ts`'in "ölçüm grafiğini görür"
  cümlesi) **hiç görmedi**: 21 vuruş basıp tamam gibi göründü. Kalıplar tek
  kavrama indirilince aynı yüzeyde **121** vuruş çıktı.

**Kural:** bir tarama/süpürme yazdığında kalıbı **bilinen pozitif çapalara**
karşı sına ve sondayı taramanın içine koy ("şu üç satırı görüyor mu?"). Çapa
bulunamıyorsa sayı değil **yöntem** yanlıştır. Sondasız bir süpürmenin sayısı
kapanış notuna yazılmaz.
