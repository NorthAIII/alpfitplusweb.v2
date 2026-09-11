# B-038: `lead-sheet.gs` üç operasyonel sessizlik taşıyor; testi sözleşmenin dayandığı dalı hiç koşturmuyor

**Önem:** 🟡 | **Tip:** hata / test-kapsamı | **Alan:** M3 — Lead hattı (`research/lead-sheet.gs`)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `TASK-1.04` hedefi: *"sertleştirilmiş"* alıcı — token, JSON sözleşmesi, kilit, sürüm korunması. `M3-Lead-Hatti.md` → F3.2: *"Webhook düşerse … uç e-postaya geçmeden önce hatayı **loglar**."* `ILKELER.md` → "Gelen talep kaybolmaz".

**Gözlenen:** Alıcı özenle yazılmış — ama üç yerde **`{ok:true}` dönerken beklenmeyen bir şey yapıyor**, ve test o yolları görmüyor.

**(1) Boş olmayan sayfada başlık satırı hiç yazılmıyor.** `lead-sheet.gs:105` kapısı `getLastRow() === 0`. Sayfada operatörün elle yazdığı tek bir not varsa: `{"ok":true}`, başlık yok, sütun adı olmadan veri düşüyor, `setFrozenRows` çağrılmıyor. Operatör başlıkları **farklı sırada** elle yazdıysa her satır kalıcı olarak kayar ve hiçbir yerde uyarı çıkmaz.

**(2) `targetSheet()` sessiz yedek.** `:135` `ss.getSheetByName("Talepler") || ss.getSheets()[0]` — "Talepler" yoksa (yazım hatası, yerelleştirilmiş `Sayfa1`, sonradan yeniden adlandırma) lead **ilk sayfaya** yazılıyor ve `{ok:true}` dönüyor. Operatör sonradan "Talepler"i oluşturursa hedef sessizce değişir ve eski satırlar öksüz kalır.

**(3) `catch` dalı e-tablo kimliğini yanıt gövdesinde taşıyor.** `:121` `message: String(err)`. Sahte istisna ile ölçüldü:
```
{"ok":false,"code":"error","message":"Error: Exception: Sayfa 'Talepler' bulunamadi (dosya ID 1AbCdEf_…)"}
mime = application/json · kilit bırakıldı: EVET
```
**Bugün sızıntı yok**, çünkü `route.ts:111-117` yalnız `code`'u (40 karaktere kırpılmış) logluyor, `message`'ı atıyor. Ama bu, alıcının değil **çağıranın** disiplinine dayanan bir bağımlılık: gövdeyi loglayan tek bir debug satırı e-tablo kimliğini yayın loglarına taşır.

**(4) Token asgari uzunluğu zorlanmıyor.** `!expected` boş/`null`/tanımsızı kapatıyor ✓ (fail-open yok, ölçüldü); sondaki boşluk ve büyük/küçük harf reddediliyor ✓. Ama `LEAD_TOKEN=" "` ve `LEAD_TOKEN="0"` **geçerli token** oluyor — kurulum notu ">= 32 karakter" diyor, kod doğrulamıyor. Yanlış yapıştırılan bir token sessizce tahmin edilebilir bir sırra dönüşür. (Sabit-zamanlı karşılaştırma yok; Apps Script'in ağ jitter'ı karşısında pratikte sömürülemez, şişirilmiyor.)

**(5) `MAX_CELL` kırpması kaçış önekinden ÖNCE çalışıyor** → `=` + 9000 `x` sonucu hücre **4001** karakter, ilk üçü `'=x`. Kozmetik; ama repo testinin `length === 4000` değişmezi kaçırılan değerlerde yanlış.

**Testin mantık kapsamındaki boşluklar** (`research/lead-sheet.test.mjs`, bugün TOPLAM SORUN: 0 / 12 senaryo / 40 kontrol — koşturuldu, geçti):

| Boşluk | Neden önemli |
|---|---|
| **`catch(err)` dalı (`:119-122`) hiç koşmuyor** | `toWebhook`'un üç-kapılı tasarımının dayandığı "her yolda JSON" sözleşmesini ayakta tutan **tek dal** bu. Bu turda elle ölçüldü (JSON dönüyor, kilit bırakılıyor ✓) ama repoda güvence yok. **En önemli boşluk.** |
| Şema paritesi (`COLUMNS` ↔ `route.ts` `type Lead`) | Bugün 11 ↔ 11 tutuyor (mekanik doğrulandı), ama `route.ts`'e bir alan eklenirse `COLUMNS.map()` onu **sessizce düşürür** ve hiçbir test uyarmaz. Test `route.ts`'i hiç okumuyor |
| Boş olmayan sayfa / `getSheets()[0]` yedeği | (1) ve (2) testin kör noktasından geçiyor |
| `consent:false` → `"hayir"` | Yalnız `true` sınanıyor (elle doğrulandı: `"hayir"` ✓) |
| Tam sütun sırası | Test yalnız 0, 1, 9 indislerini kontrol ediyor (11'i elle doğrulandı ✓) |
| `postData.contents === ""` | Yalnız `undefined` sınanıyor (elle: `no-body` ✓) |
| `{}` boş nesne | `{ok:true}` + tamamen boş satır yazıyor — doğrudan POST'ta e-tablo kirlenmesi |
| Kaçış kümesindeki `\t` ve `\r` | Regex'te var, testte hiç doğrulanmıyor (elle: ikisi de kaçıyor ✓) |

**Formül kaçırma kümesi TAM — bypass bulunamadı** ve bu kaydedilir: `:159` `/^[=+\-@\t\r]/` OWASP'ın kanonik CSV-injection tetik kümesiyle **birebir aynı**. 21 aday haritalandı; kaçırılmayanların hiçbiri Sheets/Excel'de formül başlatmıyor (`| % \ NUL NBSP U+FF1D U+2212`). İki katman birbirini tamamlıyor: baştaki `\n` ve `" ="` gibi boşluk-önekli bypass'lar `route.ts` `clean()`'in `.trim()`'iyle kapanıyor (ölçüldü).

## Kanıt

```
$ sed -n '105p;121p;135p;159p' research/lead-sheet.gs
105: if (sheet.getLastRow() === 0) { ...başlık... }
121:   message: String(err)
135: var sheet = ss.getSheetByName("Talepler") || ss.getSheets()[0];
159: if (/^[=+\-@\t\r]/.test(s)) return "'" + s;

$ node research/lead-sheet.test.mjs      → TOPLAM SORUN: 0  (12 senaryo, 40 kontrol)
$ grep -c "catch" research/lead-sheet.test.mjs   → catch dalını tetikleyen senaryo yok
```

## Kök Neden Yönü

Betik **veri kaybetmemek** için tasarlanmış ve bu doğru önceliktir: kuşkulu her durumda yazmayı deniyor, `{ok:true}` dönüyor. Ama aynı refleks üç yerde **yanlış yere yazmayı** da başarı sayıyor. Kurulum varsayımları (sayfa adı, sayfanın boş olması, token uzunluğu) kodda **doğrulanmıyor**, yalnız `research/lead-sheet.gs` başındaki KURULUM yorumunda insana söyleniyor.

Test ise betiğin **mutlu yolunu** ve token kapısını kapsıyor; sözleşmenin dayandığı hata yolu kapsam dışında. Bu, ["ürettiğim kapıyı sınadım"](../memory/hiz-sinirli-uca-test-bataryasi.md) disiplininin bir adım ötesi: kapı sınanmış, **kapının arkasındaki sözleşme** sınanmamış.

## Koruma Önerisi

- `targetSheet()` sayfa adını bulamazsa `{ok:false, code:"no-sheet"}` döner — route zaten e-postaya düşer, yani sessiz kayıp olmaz, dürüst bir arıza olur.
- Başlık kontrolü `getLastRow() === 0` yerine **ilk satırın `COLUMNS`'a eşitliğine** bakar; eşit değilse `{ok:false, code:"bad-header"}`.
- `catch` dalı `message`'ı **dışarı vermez** (yalnız `code`); istisna metni Apps Script'in kendi yürütme kaydında kalır.
- Token için asgari uzunluk kontrolü (`< 32` → `no-token-configured` ile aynı dal).
- `MAX_CELL` kırpması kaçış **önekinden sonra** uygulanır.
- Teste iki güvence eklenir ve dosya kendi kendine yeter hâle gelir: **(a)** `catch` dalı (sözleşmenin tek dayanağı), **(b)** `COLUMNS` ↔ `route.ts` `type Lead` parite kontrolü (mekanik, `route.ts` okunarak yapılabilir — bu turda öyle ölçüldü). Bu iş TASK-1.04 hâlâ açıkken yapılabilir.
- **Canlı tura kalan, burada ölçülemeyen:** Sheets'in değer yorumlaması — `cell()` yalnız metin döndürüyor ama `appendRow` kullanıcı girdisi gibi yorumluyor; `05551112233` gibi başında sıfır olan telefon kaçış kümesine takılmıyor (`0` tetik değil) ve hücrede sayıya dönüp **baştaki sıfırı kaybedebilir**; `3/4`, `1-2` ve ISO damgası tarih olarak yorumlanabilir. Dağıtılmış betik olmadan doğrulanamaz.

## Çözüm Kaydı

—
