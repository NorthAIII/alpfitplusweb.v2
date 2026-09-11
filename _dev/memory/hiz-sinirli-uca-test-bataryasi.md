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

İlgili: [Alternatif env ile üretim derlemesi](alternatif-env-ile-uretim-derlemesi.md)
— batarya serving katmanında koşuyorsa konteyner kurulumu oradadır.
