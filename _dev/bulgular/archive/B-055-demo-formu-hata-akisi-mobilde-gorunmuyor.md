# B-055: Demo formunun gönderim sonrası hâli mobilde görünmüyor — hata da, onay da ekran dışında kalıyor

**Önem:** 🔴 | **Tip:** hata / erişilebilirlik + dönüşüm | **Alan:** M3 — Lead hattı (`src/components/sections/DemoForm.tsx`, F3.1)
**Kaynak:** audit-product (TASK-1.12 sonrası denetim) | **Tarih:** 2026-09-13
**Durum:** → Faz 2

## Gözlem

**Beklenen:**
- `QUALITY.md` → 7 Erişilebilirlik: *"Form elemanlarında label, hata mesajları alanla ilişkili mi?"*
- `QUALITY.md` → 8 Dönüşüm: *"Hata anında bile talep yolu açık mı?"*
- TASK-1.12 hedefi: *"form hatayı ilgili alanla ilişkilendirip odağı oraya taşısın"*; alt görev 3: *"gönderim sonrası odak ilk hatalı alana taşınır"*.
- `ILKELER.md`: erişilebilirlik pazarlıksız. 320 px kapsamda (B-033 kapsam kararı, 2026-09-12).

**Gözlenen:** Formun hata durumu masaüstünde çalışıyor, mobilde kullanıcıya görünmüyor. Ölçümler dev 3000'de, Chromium'da; denetim ajanı ve düşmanca doğrulama birbirinden bağımsız ölçtü.

### (a) Hatalı alanda görsel işaret yok

- `src/` içinde `[aria-invalid]`, `:invalid`, `data-invalid` ya da `scrollIntoView` yok.
- Sunulan CSS'te (dev ve Vercel önizlemesi) bu seçicilerle kural sayısı 0. Tek eşleşme Tailwind preflight'ın Firefox'un yerel kırmızı işaretini **kapatan** `:-moz-ui-invalid { box-shadow: none }` kuralı.
- Odakta olmayan geçersiz alanla geçerli alanın hesaplanmış stili (box-shadow, border, background, color, outline) **18/18 karşılaştırmada aynı**.
- Hatanın tek görsel ifadesi formun sonundaki kutu. WCAG 3.3.1'in "metinle tanımla" ayağı sağlanıyor; ama gören kullanıcı hangi alanın hatalı olduğunu alanın kendisinde göremiyor.

### (b) Mobilde hata metni ekran dışında kalıyor

`focus()` ve `scroll-behavior: smooth` (`globals.css`) alanı görünür alana getiriyor. `role="alert"` kutusu ise rıza kutusundan sonra (`DemoForm.tsx:205`), alanın 494–824 px altında duruyor. Kaydırma tamamen durduktan sonra ölçüldü (≥1500 ms, `scrollY` üç okumada sabit):

| Görünüm | Sonuç |
|---|---|
| 320×568 | **6/6** hata vakasında kutu ekran dışında (alt kenarın 274–561 px altında), düğme konumundan bağımsız |
| 375×667 | Düğmenin üç konumunda da ekran dışında |
| 390×844 | Düğme ekranın ortasında ya da üstündeyken, ya da alanda Enter ile gönderimde ekran dışında (0/3 satır okunur). **Yalnız** düğme ekranın altındayken kutu okunuyor (3/3 satır) |
| 1440×900 | Kontrol grubu, 8/8 vakada kutu tamamen görünür |

**Mobil kullanıcının gördüğü:** yalnız odağın yeşil halkası olan bir alan. Neden oraya götürüldüğünü göremiyor, alanda da işaret yok (a).

### (c) `missing` hatasında odak eksik alana değil dolu alana gidiyor

- Sebep: `DemoForm.tsx:61-62`'deki kural `bad-contact` için yazılmış ("kullanıcının doldurup bozduğu alana odaklan"), ama `FIELD_ERRORS` tablosundaki bütün kodlara uygulanıyor.
- Ölçüm, fare ve klavyede aynı sonuç (4/4 vaka):

  | Durum | Odak |
  |---|---|
  | Ad dolu, kulüp boş | `name` (dolu alan) |
  | Ad boş, kulüp dolu | `club` (dolu alan) |
  | İkisi de boş | `name` (doğru) |

- Kod yorumu (`:56-60`) yalnız `missing-contact` ve `bad-contact`'ı gerekçelendiriyor. Bilinçli olduğuna dair kayıt yok.
- `missing`'de suçlu **boş** alan olduğu için kural ters çalışıyor.

### (d) Alana eşlenmeyen hatalarda odak kayboluyor

- **Ne oluyor:** Gönderim düğmeden başladığında düğme `disabled` oluyor (`:229`) ve odak `body`'ye düşüyor. Bu kodlarda odak geri verilmiyor:
  - 503 (`no-sink`),
  - 429 (`rate-limited`),
  - ağ hatası (`catch` dalı, `:67-71`).
- **Kapsam:** fare ve klavye (düğmede Enter), 1440 ve 390 genişlikte ölçüldü.
- **Hafifleten iki gözlem:**
  - Chromium Tab sırasını koruyor: sonraki Tab formun "WhatsApp'tan yazın" düğmesine gidiyor.
  - Alanda Enter ile gönderimde odak alanda kalıyor.
- **Açık kalan kısım:** B-021'in koruma önerisi *"gönderim sonrası odak `body`'de kalıyor"* demişti. TASK-1.12 bunu yalnız alana eşlenen kodlarda çözdü.
- **Hedef bağlandığında:** hedef düştüğünde görülecek 503 hatası tam olarak bu dalda.

### (e) Küçük: gönderim sırasında var olmayan öğeye işaret

- Yeniden gönderim sürerken hata kutusu DOM'dan kalkıyor.
- Alanlar ise `aria-invalid="true"` ve `aria-describedby="… demo-form-error"` taşımaya devam ediyor; gösterdikleri kimlik artık DOM'da yok.
- Sebep: `invalidFields` gönderim başında sıfırlanmıyor.
- Düzeltilen alanda `aria-invalid`'in yeniden gönderime kadar sürmesi yaygın bir desen (ARIA 1.2, GOV.UK); kusur sayılmadı.

## Kanıt

Yeniden üretme (Playwright, araştırma konteyneri, `localhost:3000/demo`):
```
# (b) 320×568: ad+kulüp+rıza dolu, telefon "0532.111.22.33", gönder → 1500 ms bekle
320x568 telefon-bozuk dugmeye-dokun | odak #phone | alan tam | kutu YOK | 384 px | stil ayni: true
320x568 kulup-bos    dugmeye-dokun | odak #name  | alan tam | kutu YOK | 561 px | stil ayni: true
390x844 dugme-ekran-ortasinda [883,485,384,353,351] kutu 1048/1145 EKRAN DISI 0/3
390x844 dugme-ekran-altinda   [635]                 kutu 764/861   kismen     3/3
1440x900 (6 hata + 2 kontrol) | kutu TAM
STIL (gecersiz #email ile gecerli #name): boxShadow "... rgb(211, 215, 202) 0px 0px 0px 1px ..." aynı

# (c)
{"case":"A ad dolu, kulup BOS","http":422,"code":"missing","odak":"input#name","nameInvalid":"true","clubInvalid":"true"}
{"case":"B ad BOS, kulup dolu","http":422,"code":"missing","odak":"input#club"}

# (d)
503 no-sink · fare [1440x900]      | sirasinda={"odak":"body","dugmeDisabled":true} | sonuc odak=body | Tab->a "WhatsApp'tan yazın"
429 · klavye / ag hatasi · fare     | sonuc odak=body
KONTROL bad-contact · klavye        | sonuc odak=input#phone

# (e)
4 yeniden gonderim SIRASINDA | phone aria-invalid=true describedby='phone-hint demo-form-error' | kutu DOM'da=False
```
```
$ grep -rn "aria-invalid\]\|:invalid\|data-invalid\|scrollIntoView" src/   → (boş)
$ sed -n '61,62p' src/components/sections/DemoForm.tsx
        const focusTarget =
          fields.find((name) => String(data[name] ?? "").trim().length > 0) ?? fields[0];
```

**Otomatik güvence yok:**
- `DemoForm` hiçbir testte sınanmıyor: `vitest.config.ts` `environment: "node"`, `package.json`'da jsdom ya da testing-library yok.
- TASK-1.12'nin tarayıcı doğrulaması betik olarak saklanmamış (`research/scripts/` altında `aria-invalid`/`demo-form-error` grep: 0).
- `mobile-audit.mjs` hata durumunu ölçmüyor.

## Kök Neden Yönü

- **Yerleşim:** Hata sunumu masaüstü yerleşimine göre kurulmuş. Kutu formun sonunda duruyor ve 1440 px'te alanla aynı ekrana sığıyor; mobilde formun boyu bu varsayımı bozuyor.
- **Odak kuralı:** Tek bir hata kodu için yazılmış kural tabloya genellenmiş.
- **Neden fark edilmedi:** Kapılar etkileşim durumunu ölçmediği için bunların hiçbiri görünmedi ([B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) sınıfının form dilimi).

## Koruma Önerisi

- **Alan bazlı hata metni:** metin alanın hemen altında dursun, `aria-describedby` alanın kendi hata düğümünü göstersin.
  - `[aria-invalid="true"]` için görsel stil eklensin (`neg` token'ı; kontrastı `a11y.mjs` ile ölçülür, rakam CSS yorumuna yazılır — STYLE-GUIDE geleneği).
  - Genel kutu özet olarak kalabilir.
- **Odak kuralı koda göre ayrışsın:**

  | Kod | Odak |
  |---|---|
  | `missing`, `missing-contact` | İlk **boş** alan |
  | `bad-contact` | İlk dolu-ama-bozuk alan |
  | Eşlenmeyen kodlar ve ağ hatası | Hata kutusu (`tabIndex=-1` + `focus()`) |

- **Gönderim başında `invalidFields` sıfırlansın**, ya da kutu gönderim sırasında DOM'da kalsın.
- **Kalıcı koruma:** TASK-1.12'nin tarayıcı doğrulaması `research/scripts/` altında kalıcı bir betik olsun ve kapı tek komutuna (F6.2) girsin. Ölçtükleri:
  - 320/390/1440 genişlik × hata türleri,
  - kutu ya da alan hata metni görünür mü,
  - odak doğru alanda mı,
  - `aria-describedby` hedefi DOM'da var mı.

## Çözüm Kaydı

**Tarih:** 2026-09-23 — atom **kapandı**. Yedi ayak iki task'a bölündü: mekanik beşi + görünürlüğün bir yarısı **TASK-2.05**'te (c · d · e · f · g ve (b)'nin eşlenmeyen kodlar yarısı), görsel ayak + (b)'nin kalan yarısı **TASK-2.06**'da.

### TASK-2.05 — odak ve durum mekaniği (c · d · e · f · g)

Odak hata koduna göre ayrıştı (`missing`/`missing-contact`/`no-consent` → ilk **boş** alan, `bad-contact` → ilk **dolu** alan, eşlenmeyen kod ve ağ hatası → sonuç kutusu), `invalidFields` gönderim başında sıfırlanıyor, sonuç yüzeyine odak + **açık** `scrollIntoView({block:"start"})` taşınıyor. Ölçüm: onay kutusu altı genişlikte tam görünür **2/6 → 6/6** (mobilde 0/4 → 4/4), odak tablosu 54/54. Araştırmanın önerdiği düz `focus()`'un (g)'yi kapatmadığı ölçülerek görüldü — kutu zaten ekrandayken `focus()` hiç kaydırmıyor.

**(b) yarım kaldı:** alana eşlenen dört kodda (`missing` · `missing-contact` · `bad-contact` · `no-consent`) odak doğru alana gidiyordu ama formun **sonundaki** özet kutusu 320/360/412 px'te hâlâ ekranın altındaydı (320'de +384..+561 px) — form 320 px'te ~1.100 px, alan ile kutu aynı ekrana sığmıyor. Kutuyu yukarı taşımak değil, **metni alana getirmek** gerekiyordu.

### TASK-2.06 — alan bazlı işaret ve metin (a + (b)'nin kalanı)

Üç değişiklik, iki dosya:

1. **Görsel işaret.** `aria-invalid="true"` alan 2 px `neg` halka + `neg-wash` zemin alıyor (`DemoForm.tsx` → `field` sınıf dizgesi). ⚠️ `aria-invalid:` varyantı Tailwind 4.3.3'te **yerleşik değil** — paketin kendi aria listesi dokuz değer taşıyor ve `invalid` aralarında yok (ölçüldü); tanımsız varyant **sessizce** hiçbir kural üretir, hata da vermez. Varyant `globals.css`'te `@custom-variant aria-invalid (&[aria-invalid="true"]);` ile açıkça kaydedildi. `aria-invalid:focus:` ikilisi (özgüllük 0,2,0) odak halkasını kırmızının üstünde tutuyor, yoksa geçersiz alanda odak işareti görünmez olurdu.
2. **Alan bazlı hata metni.** Her işaretli alanın kendi `<alan>-error` düğümü var, metin **uçtan** geliyor (bileşende yeniden yazılmıyor) ve `aria-describedby` genel kutu yerine kendi düğümünü + varsa ipucunu gösteriyor. Rıza kutusunun düğümü `<label>`ın **dışında** duruyor (label'ın içerik modeli phrasing content, `<p>` oraya giremez). Genel kutu **özet olarak yerinde kaldı** ve WhatsApp yolunu taşımaya devam ediyor.
3. **İşaretlenen küme daraltıldı.** `FIELD_ERRORS` bir kodun dokunabileceği **tüm** alanları sayıyordu: ad doluyken kulüp boşsa `missing` ikisini birden işaretliyordu. İşaret yalnız ekran okuyucuya görünürken bu sessiz bir yanlışlıktı; görsel işaretin eklendiği an doğru doldurulmuş alanı da kırmızıya boyayan bir **yanlış alarma** dönüşecekti. Yeni kural odak kuralının yüklemini paylaşıyor (`bad-contact` → dolu alanlar, diğerleri → boş alanlar), odak da bu listenin ilkine gidiyor — tek yüklem, iki sonuç.

**Ölçüm kontrol gruplu ve iki yönlü.** Aynı betik önce **3100'deki üretim imajına** (TASK-2.05'in ağacı, CSS'inde `aria-invalid` kuralı sayısı **0**) sonra 3000'e koştu; `/api/demo` `page.route` ile taklit edildi, canlı depoya kayıt yazılmadı ve hız sınırı tetiklenmedi. 4 genişlik × 6 senaryo.

| Ölçüt | ÖNCE (3100) | SONRA (3000) |
|---|---|---|
| Geçersiz+odaksız ↔ geçerli+odaksız alanda **fark var** | **0/16** (`farklar: []`) | **8/8** (`boxShadow` + `backgroundColor`) |
| Alan bazlı hata düğümü **görünür** | 0/36 | **28/28** |
| `aria-describedby` kendi düğümünü gösteriyor ve hepsi DOM'da | 0/36 | **28/28** |
| İşaret doğru alanlarda (yanlış alarm yok) | 16/24 | **24/24** |
| Odak doğru (TASK-2.05 tablosu) | 24/24 | **24/24** |
| Özet kutusu + WhatsApp bağlantısı duruyor | 24/24 | 24/24 |
| *Kontrol grubu:* geçerli ↔ geçerli alanda fark **yok** | 24/24 | 24/24 |

İşaretli alan toplamının 36 → 28'e düşmesi kaybı değil **düzeltmeyi** gösterir: sekiz yanlış alarm işareti kalktı. Kontrol grubu (geçerli ↔ geçerli) her iki koşumda da `farklar: []` verdi — yani düzenek "fark yok"u da doğru okuyor, "fark var" sonucu düzeneğin gürültüsü değil.

**İkinci tur ölçüm bir ayağı daha kapattı.** İlk koşumda alan düğümü **25/28** çıktı: 390×844'te üç düğüm ekran dışındaydı ve üçü de **odaklanan** alana aitti — düz `focus()` alanı ekranın kenarına hizalıyor, metin alanın 6-77 px altında durduğu için dışarıda kalıyordu. Kaydırma `focus({preventScroll:true})` + `scrollIntoView({block:"center"})` ile ayrıldı; ikinci koşumda **28/28**. Ders TASK-2.05'in sonuç kutusunda öğrendiğiyle aynı: `focus()`'un kendi kaydırması yeterli değil.

**Ölçülen kontrastlar** (`neg` #b34236): hata metni form zemininde (#f7f8f4) **5,25**, alan zemininde (#fceeec) **4,96**; geçersiz alanın kendi metni (#171a15 / #fceeec) **15,55**; kırmızı halka form zeminine karşı **5,25** (mevcut gri halka 1,46). Renk tek işaret değil — metin WCAG 1.4.1'i karşılıyor.

**Koruma önerisinin kalıcı-betik ayağı kurulmadı.** Öneri "TASK-1.12'nin tarayıcı doğrulaması `research/scripts/` altında kalıcı bir betik olsun ve F6.2'nin tek komutuna girsin" diyordu; bu faz betiği kurmadı, ölçüm yine geçici betikle yapıldı. Evi **B-015 / M6 F6.2** ("Kalite kapıları otomatik" fazı) — bugün bu sınıfı yakalayan otomatik kapı **yok**: `mobile-audit.mjs` etkileşim durumunu hiç ölçmüyor ve toplamı bu turda da 157'de sabit kaldı.

Detay: `tasks/archive/TASK-2.05.md` ve `tasks/archive/TASK-2.06.md` → Oturum Kayıtları.

---

**Yeniden ölçüm ve kapsam genişlemesi (audit-product 2026-09-22) — 🔴'ye yükseltildi.**

Dört ayağın dördü de yerinde; ayrıca **aynı kökten iki yeni semptom** ölçüldü ve bu atoma katıldı (kalem birimi konum değil nedendir: sonuç yüzeyi sayfa akışında sabit duruyor, gönderimden sonra ne kaydırma ne odak taşınıyor).

**(f) YENİ — 320-360 px'te başarılı gönderim hiçbir onay göstermiyor.** Sitenin birincil dönüşümü tamamlandığında kullanıcı hiçbir şey görmüyor: `role="status"` kutusu ("Talebiniz bize ulaştı") **ekranın üstünde** kalıyor ve 68 px'lik yapışkan başlığın arkasına düşüyor. Kaydırma 6/6 örnekte sabit (`scrollY=1021`), yani animasyon artığı değil.

| Görünüm | Kutu top/bottom | vh | Kullanıcının gördüğü |
|---|---|---|---|
| **320×568** | −424 / **14** | 568 | 14 px'lik şerit, o da başlığın arkasında → **hiçbir şey** |
| **360×640** | −387 / **27** | 640 | **hiçbir şey** |
| 390×844 | 376 / 765 | 844 | tam görünür ✓ |
| 412×915 | 411 / 800 | 915 | tam görünür ✓ |
| 768 / 1440 | — | — | ✓ |

Ekran görüntüsüyle doğrulandı: 320'de kullanıcı gönderdikten sonra form kaybolmuş, yerinde "Doğrudan ulaşın" iletişim bloğunu görüyor, onay yok. Bu, `ILKELER.md`'nin **1. öncelik ekseni** olan Dönüşüm'e doğrudan dokunuyor.

**(g) YENİ — 412 px'te gönderim sonrası sayfa başlığı yapışkan başlığın arkasında.** `/demo`, 412×915, geçerli gönderim sonrası (`scrollY=157`, 6/6 örnekte sabit): sticky başlık 0-**68 px** (`z-index: 50`), `<h1>` kutusu top **28** / bottom 162 → h1'in **üst 40 px'i başlığın arkasında**. Ekran görüntüsü: başlığın ilk satırı ("20 dakikada") tamamen okunmuyor. 390×844'te de aynı (`h1.top = -7`); 320/360'ta h1 ekranın tamamen dışında; 768/1440'ta sorun yok. Yatay kaydırma yok, konsol temiz.

**(a)-(d) teyidi (bağımsız yöntem).** (a) kontrollü kıyasla kesinleşti — **odakta olmayan geçersiz** alan (`#email`) ile **odakta olmayan geçerli** alan (`#name`) 8 özellikte karşılaştırıldı (`boxShadow, borderColor, borderWidth, backgroundColor, color, outlineColor, outlineWidth, outlineStyle`): **4/4 genişlikte `farklar: []`**, sıfır ayırt edici işaret. (b) 412 px de eklendi: hata kutusu **+168 px ekran altında** (320'de +384, 390'da +204); `missing` vakalarında 320'de +561 px — B-055'in özgün rakamı birebir yeniden üretildi. (c) 2/2 vakada odak dolu alana gidiyor (`DemoForm.tsx:66-67` kuralı değişmemiş). (d) başarı (7/7 genişlik) ve 429 (8/8 senaryo) → odak `body`.

**Koruma önerisine eklenen:** onay kutusuna da `tabIndex={-1}` + `focus()` ve `scroll-margin-top` ≥ yapışkan başlık yüksekliği; kalıcı betiğin ölçtüklerine **başarı yolu** ve **320/360** genişlikleri girer.
