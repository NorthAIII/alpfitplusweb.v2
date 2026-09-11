# B-025: Lead hattı üretimde sessizce kırılabilir — çalışma zamanı için hiçbir alarm yok

**Önem:** 🟡 | **Tip:** öneri-altyapı / gözlemlenebilirlik | **Alan:** M7 — Yayın ve altyapı / M3 — Lead hattı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `QUALITY.md` → 5 Hata Yönetimi: *"Beklenmeyen hatalar loglanıyor mu (yayın ortamında görünür mü)?"* ve 9 Ölçülebilirlik'in kontrol sorusu: *"Bunun işe yarayıp yaramadığını iki hafta sonra nereden göreceğim?"* `ILKELER.md` → *"Gelen talep kaybolmaz."*

**Gözlenen:** Denetimin klasik sorusu — *"prod'da bu kırılsaydı haberin olur muydu?"* — bugün **hayır** cevabını veriyor.

Tek sinyal `/api/demo` içindeki altı `console.error` satırı. En kritiği şu: `console.error("[demo] Talep hicbir hedefe yazilamadi.", { club, at })` (`route.ts:244`). Bu satır yalnızca Vercel çalışma zamanı loglarına düşüyor. Proje **Hobby** planında (GIT-STRATEJI'de beyanlı), log saklama süresi kısa ve **uyarı/alarm mekanizması yok**. Yani lead hedefi bir hafta düşük kalsa, biri o pencerede paneli açmadıkça kimse fark etmez.

Ne hata izleme bağımlılığı var, ne uptime kontrolü, ne `vercel.json` içinde bir yapılandırma, ne GitHub Actions.

`GIT-STRATEJI.md` bu boşluğun **yarısını** zaten beyan ediyor: *"CI yok (M6 F6.3 gelecek). Push sonrası tek otomatik sinyal Vercel derlemesidir."* Bu beyan **derleme zamanını** kapsıyor. Çalışma zamanı için karşılık gelen bir beyan yok — yani bu bir bilinçli erteleme olarak kayıtlı değil, boşluk olarak duruyor.

Zamanlaması önemli: bugün lead hattı zaten tam bağlı değil, bu yüzden risk teorik. Ama iki eşik yakında geçilecek — hedef bağlandığında (TASK-1.04 canlı turu) ve alan adı geçtiğinde (F7.5). İkincisinden sonra sessiz lead kaybı fark edilmez hâle gelir; `ILKELER`'in pazarlık konusu olmayan maddesi tam da o noktada ölçüsüz kalır.

Etkiyi büyüten iki komşu bulgu: [B-021](B-021-iletisim-formati-dogrulanmiyor.md) (ulaşılamaz lead **başarılı** sayılıyor, dolayısıyla loga bile düşmüyor) ve pratikte tek dayanıklı hedef olması — `LEAD_FILE_PATH` Vercel'de kalıcı disk olmadığı için devreye giremez, e-posta ise dayanıklı sayılmıyor.

## Kanıt

```
$ grep -rn "console\.\(error\|warn\)\|Sentry\|captureException\|logger" src/
src/app/api/demo/route.ts:87   console.error("[demo] Kayit hedefi HTTP hatasi dondurdu.", ...)
src/app/api/demo/route.ts:97   console.error("[demo] Kayit hedefi JSON yerine baska bir govde dondurdu.", ...)
src/app/api/demo/route.ts:105  console.error("[demo] Kayit hedefinin govdesi nesne degil.", ...)
src/app/api/demo/route.ts:111  console.error("[demo] Kayit hedefi ok:true dondurmedi.", ...)
src/app/api/demo/route.ts:125  console.error("[demo] Kayit hedefine ulasilamadi (ag hatasi ya da zaman asimi).", ...)
src/app/api/demo/route.ts:244  console.error("[demo] Talep hicbir hedefe yazilamadi.", ...)

$ python3 -c "import json;print(json.load(open('package.json'))['dependencies'])"
{'lucide-react': ..., 'next': ..., 'react': ..., 'react-dom': ...}
   → hata izleme bağımlılığı yok

$ ls vercel.json          → yok
$ ls .github/workflows    → yok
```

**Hattın kendisi iyi kurulmuş** ve bu kaydedilmelidir: sıra doğru (dayanıklı kayıt → e-posta → dürüst hata), webhook sözleşmeye göre doğrulanıyor (HTTP durumu + JSON + `ok === true`), hiçbir koşulda sahte "gönderildi" yok, loglar hedef adresi, token'ı ve kişisel veriyi taşımıyor. Eksik olan kod değil, **haber verme katmanı**.

## Kök Neden Yönü

Gözlemlenebilirlik bir feature olarak hiç planlanmamış. `ILKELER.md` ölçülebilirliği ikinci eksen sayıyor ama o eksen bugüne dek **ziyaretçi davranışı** (analitik) olarak anlaşılmış; **sistemin kendi sağlığı** karşılığını bulmamış. M6 kalite kapıları derleme ve ölçüm zamanına, M7 yayına odaklı; ikisinin arasında çalışma zamanı boşta kalıyor.

## Koruma Önerisi

- En ucuz ve en çok kazandıran adım: "hiçbir hedefe yazılamadı" durumunda bir bildirim kanalı (webhook ile WhatsApp/e-posta, ya da hata izleme servisinin ücretsiz kademesi). Tek bir olay türü için bile kurulsa, projenin pazarlık konusu olmayan maddesi ölçülebilir hâle gelir.
- Analitik tarafı doğal bir yedek sinyal üretir: form gönderiminin **başarısız** sonucu da olay olarak sayılırsa, "kaç kişi denedi, kaçı hata aldı" sorusunun cevabı panelde görünür. Analitik şu sıra ekleniyor; olay sözlüğü tasarlanırken hata sonucunu da kapsaması bu boşluğu ucuza kapatır.
- Basit ve etkili bir üçüncü katman: haftalık lead sayısı gözle kontrol edilir. Otomatik değil ama sıfır maliyetli ve "bir haftadır hiç lead yok" sinyalini yakalar.
- Karar kaydı gerekiyor: bu bir **bilinçli erteleme** olacaksa `GIT-STRATEJI.md`'deki derleme-zamanı beyanının yanına çalışma-zamanı karşılığı yazılır ve M6 F6.3'ün kapsayıp kapsamadığı netleşir. Beyan edilmiş bir "yok", hiç konuşulmamış bir "yok"tan farklıdır.

## Çözüm Kaydı

—
