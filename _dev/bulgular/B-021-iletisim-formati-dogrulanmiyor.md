# B-021: E-posta ve telefon formatı hiçbir katmanda doğrulanmıyor — ulaşılamaz lead "başarılı" sayılacak

**Önem:** 🔴 | **Tip:** hata / sessiz kayıp | **Alan:** M3 — Lead hattı (`/api/demo`, `DemoForm.tsx`)
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** → TASK-1.12

## Gözlem

**Beklenen:** `ILKELER.md` → *"Gelen talep kaybolmaz. Hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz."* Bir talebin kaydedilip **ulaşılamaz** olması da kayıptır — üstelik fark edilmeyen türden. `QUALITY.md` → 2 Güvenlik: *"Form girdileri sunucuda doğrulanıp sınırlanıyor mu?"*

**Gözlenen:** Sunucu yalnız alanların **varlığına** bakıyor: `name && club` dolu mu, `phone || email`'den biri var mı (`route.ts:219-230`). Format kontrolü yok — ne düzenli ifade, ne `@` araması. İstemci tarafında da yok, çünkü form `noValidate` taşıyor ve `type="email"` etkisiz.

Sonuç: telefonu boş bırakıp e-postasını yanlış yazan kullanıcının talebi doğrulamayı **geçiyor**.

```
$ curl -X POST /api/demo --data '{"name":"Ali","club":"X Klub","email":"bu-eposta-degil","consent":true}'
HTTP 503 {"code":"no-sink"}       ← doğrulamayı GEÇTİ, yalnız hedef tanımsız

$ curl -X POST /api/demo --data '{"name":"Ali","club":"X Klub","phone":"abcdef!!!","consent":true}'
HTTP 503 {"code":"no-sink"}       ← aynı
```

**Bugün bu görünmüyor, çünkü 503 onu maskeliyor.** `LEAD_WEBHOOK_URL` henüz tanımsız olduğu için her talep zaten "kaydedemedik" ile bitiyor. Hedef tanımlandığı gün (TASK-1.04'ün canlı turu) aynı istekler **200** dönecek, e-tabloya satır düşecek, kullanıcı *"Talebiniz bize ulaştı"* ekranını görecek — ve kimse ona ulaşamayacak.

Bu, hata sınıfının en sinsi türü: sistem talebi **başarılı** sayıyor, dolayısıyla kayıp hiçbir istatistiğe girmiyor. `BULGULAR.md` kanvasına giren diğer lead bulgularından farkı budur — [B-020](B-020-hiz-siniri-gecerli-talebi-reddediyor.md) kullanıcının gördüğü bir reddediş üretir, bu hiçbir iz bırakmaz.

Etki [B-019](B-019-uretim-konteyneri-bayat-olcumler-gecersiz.md) ve alarm eksikliğiyle birleşince tam sessizliğe dönüşüyor: ulaşılamaz lead kaydedilir, alarm yoktur, günlük lead sayısı kontrolü yoktur.

## Kanıt

```
$ grep -n "missing-contact" src/app/api/demo/route.ts
227:      { ok: false, code: "missing-contact", message: "Telefon veya e-postadan en az birini yazın." },
   → tek kontrol bu: varlık. Format için regex/`@` araması yok.

$ grep -n "noValidate" src/components/sections/DemoForm.tsx
76:    <form onSubmit={onSubmit} ... noValidate>
   → type="email" ve type="tel" tarayıcı doğrulaması devre dışı
```

Uçtan uca ölçüm yukarıdaki iki `curl` çıktısı (ayrı `X-Forwarded-For` başlıklarıyla, hız sınırı karışmasın diye).

**Doğru çalışan komşu kontroller kaydedilir:** boş gövde 422 `missing`, yalnız boşluk 422 (`clean()` trim ediyor), onay kutusu string `"on"` bile reddediliyor, tip karışıklığı (`name:12345`) 422, 50 KB girdi sessizce kırpılıyor, Unicode ve emoji bozulmadan geçiyor, bal küpü dolu ise sahte başarı gösterilip kayıt yapılmıyor. Yani doğrulama katmanı özenle yazılmış — eksik olan yalnız **format** boyutu.

## Kök Neden Yönü

Doğrulama "zorunlu alan dolu mu" sorusuna göre tasarlanmış; "bu değerle gerçekten iletişim kurulabilir mi" sorusu sorulmamış. İstemci tarafındaki tarayıcı doğrulaması bu boşluğu doğal olarak kapatırdı, ama `noValidate` onu da kapatmış (bkz. B-020) — iki katmanın ikisi de aynı anda boş kalmış.

## Koruma Önerisi

- Sunucu tarafında **"en az biri geçerli olsun"** kuralı: e-posta için basit bir biçim kontrolü, telefon için rakam sayısı eşiği (Türkiye numaraları için 10-11 hane). Katı olmasına gerek yok; amaç `abcdef!!!` ve `bu-eposta-degil` sınıfını elemek, meşru kullanıcıyı zorlamak değil — dönüşüm önceliği bunu gerektirir.
- Hata mesajı alanla ilişkilendirilir (`aria-invalid` + `aria-describedby`). Bugün hiçbir alanda `aria-invalid` set edilmiyor ve gönderim sonrası odak `body`'de kalıyor; kullanıcı hangi alanı düzelteceğini bilmiyor. Bu QUALITY 7'nin form maddesi.
- İstemci doğrulaması açılır (B-020 ile aynı düzeltme).
- Kalıcı koruma: `/api/demo` istek bataryasına "geçersiz e-posta + telefon yok → reddedilmeli" senaryosu girer. Bu senaryo **bugün yazılırsa** hedef bağlandığında regresyon olarak yakalanır; sonra yazılırsa hata çoktan üretimde olur.
- Hedef bağlandığı gün (TASK-1.06 uçtan uca tur) bu bulgu **öncelikli olarak** kapatılmalı: o an bu kusur maskeden çıkıp gerçek lead kaybına dönüşür.

## Çözüm Kaydı

—
