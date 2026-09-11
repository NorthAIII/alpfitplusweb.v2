# B-036: Dört ayrı yol, talebi "başarılı" gösterip sessizce kaybediyor

**Önem:** 🟡 | **Tip:** hata / dönüşüm | **Alan:** M3 — Lead hattı
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → Pazarlık Konusu Olmayanlar: *"**Gelen talep kaybolmaz.** Hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz."* `QUALITY.md` → 5: *"Bir hedef düşünce kullanıcı ne görüyor — sessiz kayıp var mı?"* ve *"Beklenmeyen hatalar loglanıyor mu?"*

**Gözlenen:** Dört yol, kullanıcıya başarı gösterip ya hiçbir yere yazmıyor ya ulaşılamaz bir kayıt üretiyor. Hiçbirinde iz kalmıyor.

**(1) Bal küpü alanı parola yöneticisine açık — dolarsa lead imha ediliyor.**
Tarayıcıda ölçülen gerçek hâli:
```json
{ "name":"website", "type":"text", "autocomplete":"off", "tabindex":"-1",
  "etiket":"Web siteniz", "rect":{"x":-9912,"y":520,"w":250,"h":24},
  "display":"inline-block", "visibility":"visible", "opacity":"1", "ariaHiddenAta":true }
```
Alan yalnızca **ekran dışına konumlandırılmış**; `visibility:visible`, `opacity:1`, gerçek bir `text` girdisi, adı `website`, etiketi "Web siteniz". Parola yöneticileri `website`/`url` alanlarını `autocomplete="off"`'a rağmen doldurur. Dolarsa `route.ts:201-203` → **200 `{ok:true}`**, kullanıcı "Talebiniz bize ulaştı" ekranını görür, **kayıt yapılmaz, log yazılmaz**. İkincil bot sinyali (süre kontrolü, JS ile yerleştirilen değer) yok. Ayrıca `aria-hidden` sarmalayıcı içinde form kontrolü barındırmak WCAG 4.1.2 ihlali (`tabindex="-1"` klavye tarafını hafifletiyor).

**(2) JavaScript kapalıyken (ya da hydration kırıldığında) form kişisel veriyi URL'ye yazıp talebi kaybediyor.**
`DemoForm.tsx:76` `<form onSubmit={…} noValidate>` — **`action` ve `method` yok**. JS yoksa gönderim aynı sayfaya native GET oluyor:
```
gönderim sonrası URL:
http://localhost:3000/demo?website=&name=JS+Yok&club=K&phone=&email=&branches=1&segment=&message=
```
İki ayrı zarar: **(a) sessiz kayıp** — hiçbir sunucu talebi almıyor, hata gösterilmiyor, WhatsApp yönlendirmesi tetiklenmiyor, kullanıcı boş formla aynı sayfada kalıyor; `<noscript>` uyarısı yok. Bu yol yalnız "JS'i kapatan kullanıcı" değil, **paket/hydration hatası** durumunda da açılıyor. **(b) gizlilik** — `name`, `phone`, `email`, `message` sorgu dizesine giriyor: tarayıcı geçmişi, sonraki gezinmelerin `Referer`'ı ve **sunucu istek logları**. `referrer-policy: strict-origin-when-cross-origin` dış siteye sızmayı engelliyor, sunucu logunu engellemiyor. [B-024](B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md)'ün kapsamadığı ikinci bir veri akışı.

**(3) Sessiz `MAX` kırpması iletişim değerini ulaşılamaz hâle getirebiliyor.**
Sınırlar ölçüldü: `name` 120 · `club` 160 · `phone` 40 · `email` 160 · `message` 2000 · `segment` 60 · `branches` 10. 406 karakterlik bir e-posta 160'a kırpıldığında son 12 karakter `"eeeeeeeeeeee"` — yani `@x.com` **kayboldu**, adres ulaşılamaz hâle geldi ve uç yine başarı bildirecek. 9000 karakterlik bir mesajın 7000'i sessizce gitti. Kırpma hiçbir katmanda kullanıcıya bildirilmiyor. `M3-Lead-Hatti.md` F3.1 kırpmayı bilinçli sayıyor (*"değer sessizce kırpılır, istek reddedilmez"*) — ama kriterin kastettiği şey bir **iletişim** alanının bozulması olmasa gerek; [B-021](B-021-iletisim-formati-dogrulanmiyor.md)'in "ulaşılamaz lead başarılı sayılır" sınıfını genişletiyor.

**(4) `toFile` ve `toEmail` hiçbir arızayı loglamıyor.**
`toWebhook` beş ayrı arıza kipini özenle logluyor (`route.ts:87, 97, 105, 111, 125`). `toFile` (`:130-140`) ve `toEmail` (`:142-178`) `catch { return false }` ile sessiz; `res.ok === false` de sessiz. Sonuç: **süresiz bozuk bir Resend anahtarı + çalışan e-tablo** = `200 {ok:true, stored:true, mailed:false}` ve hiçbir yerde tek satır iz yok. [B-025](B-025-calisma-zamani-alarm-yok.md)'ten bir katman daha aşağıda: orada alarm yok, burada **log bile yok**.

**Hattın doğru kurulduğu kaydedilir:** sıra doğru (dayanıklı kayıt → e-posta → dürüst hata); webhook sözleşmesi üç kapılı; hiçbir koşulda sahte "gönderildi" yok; 503 yolu dürüst, `role="alert"` + `aria-live="assertive"` taşıyor, hata metninin içinde WhatsApp bağlantısı var ve **kullanıcının yazdığı her alan yerinde duruyor**; çift gönderim koruması gerçek jestlerin hepsini yakalıyor (0/30/80/150/300 ms ve `dblclick` → tek istek); rıza kutusu sunucuda katı (yalnız boolean `true` geçiyor); loglar hedef adresi, token'ı ve kişisel veriyi taşımıyor.

## Kanıt

```
# (1) bal küpü tek başına
$ curl -s -X POST /api/demo -H 'content-type: application/json' \
    -H 'x-forwarded-for: 10.90.5.1' --data '{"website":"x"}'
{"ok":true,...}                              ← kayıt yok, log yok

# (2) JS kapalı
javaScriptEnabled:false → {"formVarMi":true,"action":null,"method":null,"noValidate":true,
                           "alanSayisi":9,"whatsappBaglantisi":true}
→ gönderim sonrası URL sorgu dizesinde name/phone/email/message

# (3) kırpma
email 406 karakter → hücrede 160 karakter, son 12: "eeeeeeeeeeee"   (@x.com kayıp)

# (4) log yokluğu
$ grep -n 'console\.' src/app/api/demo/route.ts   → 87, 97, 105, 111, 125 (hepsi toWebhook) + 244
$ awk 'NR>=130 && NR<=178' src/app/api/demo/route.ts | grep -c console   → 0
```

## Kök Neden Yönü

Dördü aynı kökten: **başarı ölçütü "hedefe yazdım" değil, "hata almadım"**. Bal küpü dalı bilinçli olarak sahte başarı döndürüyor ve bu doğru bir bot taktiği — ama gerçek bir kullanıcının o dala düşebileceği hesaplanmamış. JS'siz yol hiç düşünülmemiş (`action` yokluğu bir tercih değil, bir boşluk). Kırpma "veri kaybetmemek" için seçilmiş ama iletişim alanında tam tersini yapıyor. Ve iki hedefin log disiplini üçüncüsüyle hizalanmamış.

## Koruma Önerisi

- **Bal küpü:** alan adı otomatik-doldurmanın tanımadığı bir şeye çevrilir (ör. `x-onay-2`); `visibility:hidden` **eklenmez** (bot da anlar), yerine ikincil bir JS-yerleştirmeli değer kapısı konur; bal küpü dalı en azından **loglanır** (bugün tamamen sessiz). `aria-hidden` içindeki form kontrolü WCAG 4.1.2 için gözden geçirilir.
- **JS'siz yol:** `<noscript>` içinde WhatsApp/telefon yolu gösterilir **ve** native gönderim engellenir (bugünkü hâl ikisinin arası: gönderiyor ama hiçbir yere). Kişisel verinin URL'ye yazılması bu düzeltmeyle birlikte biter.
- **Kırpma:** `email` ve `phone` için kırpma yerine 422 dönülür (ulaşılamaz lead, kayıp lead'dir); diğer alanlarda bugünkü davranış korunur ve kriter aynen geçerli kalır.
- **Log:** `toFile` ve `toEmail` `toWebhook` ile aynı disipline getirilir. Bu, B-025'in alarm işini beklemeden bugün yapılabilir ve alarm kurulduğunda besleyeceği sinyal zaten hazır olur.
- Kalıcı koruma: `/api/demo` istek bataryasına dört senaryo girer (bal küpü dolu → kayıt yok **ve log var**; JS'siz gönderim; 406 karakterlik e-posta; bozuk anahtarla e-posta yolu). Senaryo başına ayrı `X-Forwarded-For` gerekir — tuzak `_dev/memory/hiz-sinirli-uca-test-bataryasi.md`'de kayıtlı.

## Çözüm Kaydı

—
