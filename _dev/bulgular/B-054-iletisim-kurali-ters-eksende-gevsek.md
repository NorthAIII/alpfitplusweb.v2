# B-054: İletişim kuralı hatayı ters eksende yapıyor — meşru yazımı reddediyor, tek hanesi hatalı numarayı kabul ediyor

**Önem:** 🔴 | **Tip:** hata / dönüşüm kaybı + sessiz kayıp | **Alan:** M3 — Lead hattı (`src/lib/contact.ts`, F3.1)
**Kaynak:** audit-product (TASK-1.12 sonrası denetim; B-021'in kapanmayan kısmının evi) | **Tarih:** 2026-09-13
**Durum:** Açık

## Gözlem

**Beklenen:**
- TASK-1.12 Dikkat Noktaları: *"Kural gevşek tarafta hata yapsın. Meşru bir yazımı reddetmek, çöp bir yazımı kabul etmekten pahalıdır."*
- B-021'in amacı: ulaşılamaz talep "başarılı" sayılmasın.
- `ILKELER.md`: **Dönüşüm** birinci eksen; **"Gelen talep kaybolmaz"** pazarlıksız.

**Gözlenen:** Kural ayraç karakterinde katı, hane sayısında gevşek. Yani iki yönde de TASK-1.12'nin koyduğu ölçütün tersine hata yapıyor. İki bağımsız ölçüm (denetim ajanı + düşmanca doğrulama), dev 3000, senaryo başına ayrı `X-Forwarded-For`.

### (1) Yalnız telefon yazan kullanıcıyı 422'ye düşüren gerçekçi yazımlar

`isValidPhone` yalnız `[\s\-()]` atıyor (`contact.ts:24`), kalan her rakam dışı karakteri ret sebebi sayıyor (`:26`):

| Yazım | Sonuç | Değerlendirme |
|---|---|---|
| `+90 0532 111 22 33` · `+90 (0532) 111 22 33` | 422 | Numara planına göre yanlış (+90'dan sonra 0 yazılmaz), ama anlamı tek ve yaygın |
| `0212/123 45 67` · `0532 / 111 22 33` | 422 | Eğik çizgili alan kodu, gerçekçi |
| `0090 532 111 22 33` | 422 | Türkiye'nin kendi uluslararası öneki; yurt içinde seyrek |
| `0532.111.22.33` | 422 | Noktalı gruplama, seyrek |
| `444 12 34` | 422 | Planca meşru (7 hane), ama bu hunide olasılığı düşük |

Kontrol grubu geçiyor (503 `no-sink`): `0532 111 22 33` · `+90 532 111 22 33` · `(0532) 111-22-33` · `0 532 111 22 33` · `0212 123 45 67` · `0850 123 45 67`.

### (2) Mac Rehber'den yapıştırılan numara görünmez karakter taşıyor

- **Kaynak:** macOS Rehber, telefon numarasını U+202D (LEFT-TO-RIGHT OVERRIDE) ile U+202C (POP DIRECTIONAL FORMATTING) arasına alarak kopyalıyor.
  - TidBITS, 2022-12-16. Aynı yazı iPhone/iPad kopyasında bu karakterleri görmediğini söylüyor.
  - Apple Community 255909026, 2024-12: bir web formu bu yüzden reddetmiş.
  - iOS için tek kaynak 2019 tarihli (iOS 12).
- **Gerçek pano yapıştırması ölçüldü** (Chromium, `Control+V`, `paste` olayı `isTrusted: true`):
  - Karakterler hem `type="tel"` hem `type="text"` alanında kalıyor.
  - Metin genişliği karakterlerle ve karaktersiz aynı: 154 px. Kullanıcı hiçbir şey görmüyor.
- **Neden reddediliyor:** JS `\s` ve `trim()` U+200B, U+200E ve U+202A–U+202E'yi kapsamıyor. U+00A0, U+202F ve U+FEFF kapsanıyor, bunlar sorun çıkarmıyor.
- **Sonuç: 422.** Mesaj *"Telefon numarası geçerli görünmüyor. Kontrol edip tekrar deneyin."* (`contact.ts:52-58`). Kontrol edilecek görünür bir şey yok ve beklenen biçim söylenmiyor.
- **Kısmi düzeltme işe yaramıyor:**
  - Sondaki ilk Backspace yalnız görünmez U+202C'yi siliyor; ekranda bir şey değişmiyor.
  - Son hane silinip yeniden yazılınca baştaki U+202D kalıyor ve yine 422 geliyor.
  - Yalnız alanın tamamı seçilip numara elle yazılınca geçiyor.
- **B-020 ile birleşince kilitleniyor:** aynı yapıştırmayla 5 gönderim 422, 6. gönderim **429**. Formda 429 sonrası `aria-invalid` temizleniyor, odak `body`'ye düşüyor, görünmez karakterler alanda kalıyor.

### (3) Tek hanesi eksik ya da fazla numara kabul ediliyor ve hedefe "başarılı" yazılıyor

Uzunluk kontrolü öneke bakmıyor (`contact.ts:27-28`). Canlıda 503 `no-sink` alanlar, yani doğrulamayı geçenler:
- `0532111223`: `0` ile 10 hane, bir hane eksik.
- `53211122334`: `0`'sız 11 hane, bir hane fazla.
- `+90 532 111 22 3`
- `0000000000`, `1234567890`

**Hedef tanımlı hâl ölçüldü.** Route handler repo dışında, sahte bir webhook (`ok:true`) ile yalıtılmış bir Vitest yapılandırmasından çağrıldı. Dört değerin dördü `HTTP 200 {"ok":true,"stored":true}` aldı ve alıcıya olduğu gibi gitti. Kontrol grubu: `0532.111.22.33` → 422, alıcıya çağrı yok.

`route.ts`'te bu değerleri sonradan yakalayan katman yok: `toWebhook`/`toFile` lead'i olduğu gibi yazıyor, `toEmail` `Telefon: ${lead.phone}` basıyor.

E-posta boşsa talep **ulaşılamaz** ama kullanıcı *"Talebiniz bize ulaştı"* görüyor. Bu B-021'in sessiz kayıp sınıfı; rakam tarafında açık kaldı.

**Bilinçli tercih süzgeci:**
- TASK-1.12 Kararlar uzunluk eşiğini (10/11/`90`+12) bilinçli seçti; kod bu karara uyuyor.
- Yorumdaki *"10 (5xx...), 11 (05xx...)"* örnekleri kodun uygulamadığı bir önek ayrımını ima ediyor.
- Bulgu kararın kendisi değil, **kararın bıraktığı boşluk**. Önek-duyarlı bir kontrol (0'lı 11, 0'sız 10, `90`/`+90` ile 12, `0090` ile 14) Türkiye planındaki hiçbir yazımı reddetmeden (3)'ün ilk üç örneğini yakalar.
- Ölçülen bedeli: bugün tesadüfen geçen bazı yabancı numaralar da reddedilir (`+1 415 555 2671`, `+49 30 1234567`). Hedef kitle Türkiye.

## Kanıt

```
# (1) ve (3) — canlı uç (dev 3000)
$ for P in "+90 0532 111 22 33" "0212/123 45 67" "0090 532 111 22 33" "0532111223" "53211122334"; do
    curl -s -o /dev/null -w "%{http_code} $P\n" -X POST localhost:3000/api/demo \
      -H 'content-type: application/json' -H "X-Forwarded-For: 10.93.$RANDOM.1" \
      --data "{\"name\":\"Ayse\",\"club\":\"Pilates\",\"phone\":\"$P\",\"consent\":true}"; done
422 +90 0532 111 22 33
422 0212/123 45 67
422 0090 532 111 22 33
503 0532111223          ← doğrulamayı geçti (dev'de hedef yok)
503 53211122334         ← doğrulamayı geçti

# (3) — hedef tanımlı hâl (yalıtılmış vitest, sahte webhook)
C3 phone="0532111223"       -> HTTP 200 {"ok":true,"stored":true,"mailed":false} | aliciya giden phone="0532111223"
C3 phone="+90 532 111 22 3" -> HTTP 200 {"ok":true,"stored":true,"mailed":false}
C3 phone="0532.111.22.33"   -> HTTP 422 {"ok":false,"code":"bad-contact"} | aliciya giden phone=null

# (2) — gerçek pano yapıştırması (Playwright, clipboard izni + Control+V)
P1 => {"panoCps":"U+202D+90 (532) 111 22 33U+202C","pasteEvent":[{"isTrusted":true}],"inputType":"tel",
       "valueCps":"U+202D+90 (532) 111 22 33U+202C","metinGenisligi_px":{"karakterlerle":154,"karaktersiz":154}}
  gonderim 1-5: HTTP 422 code=bad-contact
  gonderim 6:   HTTP 429 code=rate-limited odak=body
F1 End+Backspace x1 -> "U+202D+90 (532) 111 22 33"  (görünür değişiklik yok) ... '3' -> HTTP 422
F2 tumunu sec + elle yaz -> HTTP 503 (geçti)

$ node -e 'console.log(/\s/.test("‭"), /\s/.test("‬"), "‭1‬".trim().length)'
false false 3
```

**Test bataryası bu kusurları sabitlemiyor.** `npm test` → 3 dosya, 43 test yeşil. `tests/contact.test.ts` beklentileri mutantlara karşı koşuldu:
- Bataryayı geçen, yani **hayatta kalan** mutantlar:
  - M4 "tüm rakam dışı karakterler atılır": belgelenen "harf içeren değer reddedilir" kuralı sabit değil.
  - M6 "Türkiye planına göre sıkılaştır": çöp sınıfları testte yok.
  - M7 "nokta/eğik çizgi kabul" ve M8 "`0090` kabul": meşru aileler testte yok.
- Ölen mutantlar: M1, M2, M3, M5.

Denetim betikleri repo dışında, oturum scratchpad'inde kaldı. Yukarıdaki komutlar birebir yeniden çalıştırılabilir.

## Kök Neden Yönü

Sunucu "önce temizle, sonra doğrula" yerine "olduğu gibi doğrula" yapıyor. Ayraç kümesi elle sayılmış ve dar; Unicode biçim karakterleri (Cf kategorisi) hiç düşünülmemiş. Doğruluk ölçütü de tek boyutlu (uzunluk). B-021'in koruma önerisi *"rakam sayısı eşiği (10-11 hane)"* diyordu. Uygulama öneriye birebir uydu, boşluk önerinin kendisinde.

## Koruma Önerisi

- **Normalize et, sonra doğrula:**
  - Rakam dışı her karakteri at (Cf dahil).
  - `+` ya da `00` önekini çöz.
  - Öneğe duyarlı uzunluğu kontrol et.
  - Alıcıya **normalize edilmiş tek biçim** yaz. TASK-1.13/1.14 alıcı sözleşmesi de tek biçimden yararlanır.
- **Hata mesajı beklenen biçimi göstersin** ("Örnek: 0532 111 22 33"). Görünmez karakter vakasında kullanıcıya yapabileceği bir şey kalır.
- **`tests/contact.test.ts`'e iki tablo:**
  - meşru aileler (kabul), U+202D/U+202C'li Mac yapıştırması dahil,
  - çöp sınıfları ve tek hane hataları (red).

  Başarı ölçütü: bugün hayatta kalan M4, M6, M7 ve M8 bu tablolarla ölmeli.
- **M3 F3.1 kabul kriterine biçim kuralı yazılsın.** Bugün kriterde yok; `147c5e8` M3'e dokunmadı.
- **B-020 ile birlikte ele alınmalı.** Kural gevşekleşse de "doğrulamadan önce sayan kota" sınıfı B-020 kapanmadan sürer.

## Çözüm Kaydı

—
