# B-065: JavaScript kapalıyken demo formu talebi sessizce kaybediyor ve ad/telefon/e-postayı adres çubuğuna yazıyor

**Önem:** 🔴 | **Tip:** hata / lead kaybı + kişisel veri | **Alan:** M3 — Lead hattı (`src/components/sections/DemoForm.tsx`)
**Kaynak:** TASK-3.02 (JavaScript kapalı ekseni) | **Tarih:** 2026-09-24
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M3-Lead-Hatti.md` → F3.2 demo talebi dayanıklı kayıtla başlar; `ILKELER.md` → lead kaybolmaz. `docs/CLAIMS.md`'nin dayandığı yasal metin *"talebinizin kaydına yazılmaz"* sınırını çiziyor ve `BULGULAR.md` → B-036 lead kaybı yollarını sayıyor. Ayrıca `modules/M4-Site-Asistani.md` → F4.1'in edge-case'i sitenin JavaScript kapalıyken **çalışmasını** bekliyor.

**Gözlenen:** `DemoForm.tsx:215-219` formu `onSubmit` ile kuruluyor ve **`action` da `method` de taşımıyor** (ölçüldü: `action=null`, `method=null`, 9 alan). JavaScript kapalıyken tarayıcı varsayılanına düşüyor — **GET, aynı adrese**. "Demo talebi gönder" düğmesine basmanın ölçülen sonucu:

```
ONCE  url = http://localhost:3000/demo
SONRA url = http://localhost:3000/demo?website=&name=Zemin+Kontrol&club=
            &phone=0555+000+00+00&email=zemin.kontrol%40ornek-test.invalid
            &branches=1&segment=&message=
GET-disi / api istegi = (yok)          ← /api/demo hic cagrilmadi
ad alani gonderim sonrasi = ""          ← form bosaldi
sonuc/hata kutusu = 0                   ← ekranda hicbir mesaj yok
```

Üç ayrı sonuç doğuyor:

1. **Talep hiçbir yere gitmiyor.** `/api/demo` çağrılmıyor, depoya satır yazılmıyor, e-posta çıkmıyor. B-036'nın saydığı dört kayıp yolunun **beşincisi**, ve tek fark eden yanı: diğerleri "başarılı" gösterip kaybediyor, bu hiçbir şey göstermiyor.
2. **Ziyaretçi bunu anlayamıyor.** Sayfa yeniden yükleniyor, form boşalıyor, `role="status"` / `role="alert"` kutusu **hiç yok** (0). Ekranda "gönderildi" de yazmıyor "gönderilemedi" de — gönderim ile sayfanın yenilenmesi ayırt edilemiyor.
3. **Ad, telefon ve e-posta adres çubuğuna düşüyor.** Oradan tarayıcı geçmişine, `Referer` başlığına ve sunucu erişim kaydına gider. Aynı kanvasta kayıtlı ölçüm (`Gelen Kutusu` → `[TASK-2.01 · TASK-2.17]`) ölçüm sunucusunun nginx erişim kaydının **ham IP tutup rotasyonsuz büyüdüğünü** söylüyor; bu hattın üzerine kişisel veri de binmiş olur. Bal küpü alanının adı (`website`) da sorgu dizesinde açığa çıkıyor.

Umami tarafı bu sızıntıyı almıyor: izleyici `data-exclude-search` taşıyor (ölçüldü, `BULGULAR.md` → Kapsama → M7).

## Kanıt

Playwright, `javaScriptEnabled: false`, 390×844, dev sunucusu (3000). Betik: `form-jskapali.mjs` (scratchpad — repoya girmedi). Gönderim gerçek bir POST üretmediği için depoya test kaydı **yazılmadı** (`GET-disi / api istegi = (yok)` ile doğrulandı).

```
$ sed -n '215,219p' src/components/sections/DemoForm.tsx
  <form onSubmit={onSubmit} data-surface={...} className="..." noValidate>
  → action YOK · method YOK  (tarayici varsayilani: GET, ayni adres)
```

16 rota × 390/1440 taramasında `/demo` JavaScript kapalıyken **1 form · 1 gönder düğmesi** taşıyor, yani düğme gerçek bir kullanıcı için basılabilir durumda.

## Kök Neden Yönü

Form yalnızca **JavaScript'li yol** düşünülerek kurulmuş: `onSubmit` bütün işi yapıyor (`preventDefault` + `fetch`), HTML'in kendi gönderim yolu hiç tanımlanmamış. `noValidate` da aynı varsayımın parçası — tarayıcının yerleşik doğrulaması kapatılmış ve yerine JS doğrulaması konmuş, JS yoksa ikisi birden yok. Sitenin geri kalanı bilinçli olarak progressive (ölçüldü: 16 rotada metin uzunluğu JavaScript açık/kapalı **birebir aynı**, `Reveal.tsx`'in kendi yorumu bunu adıyla söylüyor); dönüşümün tek uç noktası bu disiplinin dışında kalmış.

## Koruma Önerisi

- En ucuz kapatma: forma `method="post"` + gerçek bir `action` vermek ya da JavaScript kapalıyken gönderimi hiç mümkün kılmamak (`<noscript>` ile düğmeyi WhatsApp/telefon yoluna çevirmek). İkincisi kişisel veri sızıntısını da bitirir, çünkü GET hiç doğmaz.
- Kalıcı koruma bir kapı: `/demo`'yu JavaScript kapalıyken gezen ve "gönder düğmesi var ama hedefi yok" hâlini yakalayan tek bir kontrol. Bugünkü beş ölçüm betiğinin hiçbiri JavaScript kapalı ekseni gezmiyor (bu bulgu o eksenin ilk turunda doğdu) — [B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) ile aynı kökten.
- Yasal metin tarafı: sızıntı kapanana kadar *"talebinizin kaydına yazılmaz"* sınırının bu yolu kapsamadığı unutulmamalı ([B-059](B-059-alan-adi-gecisinde-v1-davranislari-geriler.md) ve `docs/DECISIONS.md`'deki kapsam disiplininin aynı ailesi).

## Çözüm Kaydı

—
