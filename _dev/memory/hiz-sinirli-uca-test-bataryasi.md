# Hız sınırlı uca test bataryası — her senaryo kendi IP'sini taşır

`/api/demo` (ve ileride aynı kalıbı alacak `/api/chat`) **IP başına 10 dakikada
5 istek** sayar (`src/app/api/demo/route.ts` → `limited()`, `LIMIT`/`WINDOW_MS`).
Sayaç bellek içidir ve süreç boyunca yaşar; `limited()` gövde doğrulamasından
**önce** çalışır, yani 422 ile reddedilen bir istek bile kotadan düşer.

Sonucu: uca karşı yazılan her çok senaryolu batarya altıncı istekten itibaren
429 alır ve **testin kendisi sessizce çöker** — asıl ölçülmek istenen davranış
hiç görülmez, sahte bir kırmızı okunur.

Kural (TASK-1.05'te ölçüldü):

- **Her senaryo kendi `X-Forwarded-For` değerini gönderir.** Route IP'yi o
  başlıktan okur (`x-forwarded-for` → ilk değer, sonra `x-real-ip`), yani
  `-H 'x-forwarded-for: 10.0.0.7'` senaryoyu kendi kotasına taşır.
- **Hız sınırının kendisi ayrı bir IP'de ölçülür:** o IP'ye altı istek atılır,
  altıncısı 429 beklenir. Tüketici bir gövde seçmek iyidir (örn. ad'sız gövde →
  422) ki sayaç dolarken kayıt hedefine beş satır yazılmasın.
- Sunucu yeniden başlarsa sayaç sıfırlanır; bu bir çözüm değil, **teste
  girmeden önce bilinmesi gereken bir yan etkidir** — yeniden başlatmaya
  dayanan bir batarya ölçtüğünü sanıp ölçmez.

Sınır bilinçli olarak örnek başınadır (Fluid Compute'ta paylaşımlı sayaca
taşınmadı — `BULGULAR.md` → Bilinçli Tercihler), yani bu disiplin kalıcıdır.

## Arayüz ölçen tarayıcı turunda ucu taklit et

Formun **kendi arayüzünü** (odak, kaydırma, durum geçişleri) ölçen tarayıcı
turları uca gerçekten istek atmak zorunda değildir: Playwright'ta
`page.route("**/api/demo", …)` ile yanıt taklit edilir. İki sorun birden düşer —
kota hiç saymaz (senaryo sayısı serbest) ve **canlı `leads_preview` deposuna
test kaydı yazılmaz**; orada bugün Faz 1'in bilinçli test kayıtları duruyor ve
her yeni tur o sayıyı kirletir.

Taklit edilecek kodlar `src/app/api/demo/route.ts`'ten birebir kopyalanır:
`missing` / `missing-contact` / `bad-contact` / `no-consent` → **422**,
`rate-limited` → **429**, `no-sink` → **503**, ağ hatası → `route.abort("failed")`.

Ucun **sözleşmesi** ölçülecekse taklit kullanılmaz — o zaman yukarıdaki IP
kuralı geçerlidir. İkisi birlikte de kullanılabilir (TASK-2.05: arayüz taklitle
ölçüldü, senaryolar yine senaryo başına ayrı `X-Forwarded-For` taşıdı).

İlgili: [Alternatif env ile üretim derlemesi](alternatif-env-ile-uretim-derlemesi.md)
— batarya serving katmanında koşuyorsa konteyner kurulumu oradadır.
