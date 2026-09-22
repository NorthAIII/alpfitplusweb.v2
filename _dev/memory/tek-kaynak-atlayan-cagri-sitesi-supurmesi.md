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
