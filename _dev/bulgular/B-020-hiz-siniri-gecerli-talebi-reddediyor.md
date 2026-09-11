# B-020: Hız sınırı doğrulamadan önce sayıyor — beş kez hata yapan kullanıcının geçerli talebi reddediliyor

**Önem:** 🔴 | **Tip:** hata / dönüşüm kaybı | **Alan:** M3 — Lead hattı (`/api/demo`, `DemoForm.tsx`)
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → Pazarlık Konusu Olmayanlar: *"Gelen talep kaybolmaz."* `QUALITY.md` → 8 Dönüşüm: *"Hata anında bile talep yolu açık mı?"* `modules/M3-Lead-Hatti.md` → F3.1 kabul kriteri: *"Rıza kutusu işaretsizse **istemci göndermez**."* Hız sınırının işi botu elemektir, beceriksiz kullanıcıyı değil.

**Gözlenen:** Hız sınırı kapısı doğrulamadan **önce** çalışıyor (`route.ts:186`) ve başarısız denemeleri de kotadan sayıyor. Aynı anda formda `noValidate` var (`DemoForm.tsx:76`), yani `required`, `type="email"` ve `type="tel"` devre dışı — her hatalı deneme sunucuya gidiyor.

İkisi birleşince gerçek bir kullanıcı kaybediliyor: onay kutusunu beş kez unutan kişi, altıncı denemesinde **doğru doldurmuş olmasına rağmen** on dakika boyunca reddediliyor.

Ölçüldü — beş hatalı deneme ardından geçerli talep:
```
1..5  HTTP 422  {"ok":false,"code":"no-consent"}
6.    HTTP 429  {"ok":false,"code":"rate-limited",
                 "message":"Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin."}
```

Bu tam kayıp değil — form her hatada WhatsApp yedeğini gösteriyor ve kullanıcının yazdığı veri ekranda kalıyor. Ama huninin ana kolu, hatasını düzeltmiş bir kullanıcının yüzüne kapanıyor. `ILKELER.md` dönüşümü birinci eksen sayıyor; bu senaryo tam olarak onun karşıtı.

**İkinci kayıp yolu — askıda kalan istek.** `DemoForm.tsx:28` fetch çağrısında zaman aşımı yok (`AbortSignal.timeout` kullanılmıyor). Bağlantı **reddedilirse** davranış doğru: dürüst hata, WhatsApp yolu, veri korunuyor. Ama istek askıda kalırsa (mobil şebeke limbosu) buton süresiz "Gönderiliyor" ve `disabled` kalıyor, hiçbir uyarı çıkmıyor — kullanıcı ne gönderdiğini ne gönderemediğini biliyor. Sunucu tarafındaki sekiz saniyelik zaman aşımları (`route.ts:83`, `:172`) yalnız yanıt istemciye **ulaşırsa** işe yarar.

**Formun doğru yaptıkları kaydedilir** — bu bir "hat çalışmıyor" bulgusu değil: sıra doğru kurulmuş (dayanıklı kayıt → e-posta → dürüst hata), webhook sözleşmeye göre doğrulanıyor (HTTP durumu + JSON + `ok === true`), hiçbir koşulda sahte "gönderildi" yok, loglar sır sızdırmıyor. v1'in lead kaybettiren hata sınıfı gerçekten kapatılmış. Kırık olan, formun **çevresindeki** iki yol.

## Kanıt

```
$ API=http://localhost:3000/api/demo; IP=10.77.42.9
$ for i in 1 2 3 4 5; do curl -s -w " HTTP %{http_code}\n" -o /dev/null -X POST $API \
    -H "content-type: application/json" -H "X-Forwarded-For: $IP" \
    --data '{"name":"Ayse","club":"Pilates","phone":"05321112233","consent":false}'; done
 HTTP 422
 HTTP 422
 HTTP 422
 HTTP 422
 HTTP 422

$ curl -s -w "\nHTTP %{http_code}\n" -X POST $API -H "content-type: application/json" \
    -H "X-Forwarded-For: $IP" \
    --data '{"name":"Ayse","club":"Pilates","phone":"05321112233","consent":true}'
{"ok":false,"code":"rate-limited","message":"Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin."}
HTTP 429

$ grep -n "limited(ip)" src/app/api/demo/route.ts
186:  if (limited(ip)) {          ← JSON ayrıştırmadan ve alan doğrulamasından ÖNCE

$ grep -n "noValidate" src/components/sections/DemoForm.tsx
76:    <form onSubmit={onSubmit} ... noValidate>
```

Askıda kalan istek (Playwright ile yanıt 12 sn geciktirildi): 3 sn sonra buton `"Gönderiliyor"`, `disabled: true`, uyarı `null`.

`noValidate`'in gerekçesi hiçbir yerde yazılı değil — kod yorumunda, `docs/DECISIONS.md`'de, `BULGULAR.md` → Bilinçli Tercihler'de yok. Tercih olabilir ama kayıtsız; bu yüzden Gelen Kutusu'na soru olarak da düştü.

## Kök Neden Yönü

Hız sınırı "en ucuz noktada kes" mantığıyla en öne konmuş — bot trafiği için doğru refleks. Ama kotanın **neyi** saydığı kararlaştırılmamış: bugün geçersiz denemeler de geçerli talepler kadar pahalı. İstemci doğrulaması kapalı olduğu için geçersiz denemelerin sayısı da yapay olarak yüksek; iki tercih birbirini besliyor.

## Koruma Önerisi

- Kota yalnız **doğrulamayı geçmiş** istekleri sayar; doğrulamada düşen istek ayrı ve daha yüksek bir kotaya girer (ya da hiç sayılmaz). Bot koruması bozulmaz, çünkü bot da doğrulamayı geçmek zorunda.
- İstemci doğrulaması açılır (`noValidate` kaldırılır ya da alan bazlı kontrol eklenir) — M3 F3.1'in yazılı kriteri bunu zaten istiyor. Gerekçesiyle bilinçli tutulacaksa kriter güncellenir ve karar `DECISIONS.md`'ye yazılır; iki belge bugün çelişiyor.
- İstemci fetch'ine zaman aşımı eklenir (`AbortSignal.timeout`), sunucudaki sekiz saniyelik sınırla uyumlu bir değerle; zaman aşımında mevcut dürüst hata yolu ve WhatsApp yedeği devreye girer.
- Kalıcı koruma: `/api/demo` için istek testleri repoda zaten var (`research/lead-sheet.test.mjs` deseni). "Beş geçersiz + bir geçerli → geçerli olan kabul edilmeli" bu bataryanın bir senaryosu olur. Test yazılırken senaryo başına ayrı `X-Forwarded-For` gerekir — bu tuzak `_dev/memory/hiz-sinirli-uca-test-bataryasi.md`'de zaten kayıtlı.

## Çözüm Kaydı

—
