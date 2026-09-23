# TASK-2.06: Hatalı alan kendi üstünde görünür — alan bazlı hata metni ve işaret (B-055 a)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.1: Demo formu ve talep ucu
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.05 (odak ve durum mekaniği önce oturur; bu task onun üstüne görsel katmanı koyar)

---

## Hedef

Gören kullanıcının **hangi alanın hatalı olduğunu alanın kendisinde** görmesini sağlamak: hatalı alan görsel işaret alır ve hata metni alanın hemen altında durur. Bugün hatanın tek görsel ifadesi formun sonundaki kutu; odakta olmayan geçersiz alanla geçerli alanın hesaplanmış stili **8 özellikte, 4 genişlikte tıpatıp aynı** (`farklar: []`).

Task, `aria-invalid="true"` taşıyan alan dört genişlikte de ölçülebilir bir görsel farkla ayrıştığında ve alan bazlı hata metni `aria-describedby` ile alanın **kendi** hata düğümünü gösterdiğinde tamamlanmış sayılır.

---

## Bağlam

B-055'in (a) ayağı: `src/` içinde `[aria-invalid]`, `:invalid`, `data-invalid` seçicisi **yok**; sunulan CSS'te bu seçicilerle kural sayısı 0. Tek eşleşme Tailwind preflight'ın Firefox'un yerel kırmızı işaretini **kapatan** `:-moz-ui-invalid { box-shadow: none }` kuralı — yani bugün varsayılan tarayıcı işareti de bilerek kapalı ve yerine bir şey konmamış.

WCAG 3.3.1'in "metinle tanımla" ayağı bugün sağlanıyor (kutu metni hangi alanın bozuk olduğunu söylüyor), eksik olan alanın kendisindeki işaret ve yakınlık.

**Araç (`phases/PHASE-2.md` → Kullanılacak Araçlar):** Tailwind CSS 4'ün `aria-invalid:` varyantı — yeni seçici ya da eklenti gerekmez; renk `neg` / `neg-wash` tokenlarından gelir ve **kontrastı `a11y.mjs` ile ölçülüp rakamıyla CSS yorumuna yazılır** (STYLE-GUIDE geleneği).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-055-demo-formu-hata-akisi-mobilde-gorunmuyor.md` → (a) ayağı ve koruma önerisi
- `_dev/docs/STYLE-GUIDE.md` — `neg` / `neg-wash` tokenları, "yeni renk eklerken kontrastı ölç, rakamı yoruma yaz"
- `src/components/sections/DemoForm.tsx:14` (`field` sınıf dizgesi), `:266-311` (alan bileşeni, `describedBy` kurulumu), `:197-214` (rıza kutusu)
- `src/app/globals.css` → `@theme` (token değerleri; çelişkide CSS kazanır)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-055-*.md` — **atom bu task'ta kapanır** (altı mekanik ayak TASK-2.05'te, görsel ayak burada); Çözüm Kaydı iki task'ı birlikte anar
- `_dev/docs/STYLE-GUIDE.md` — yeni hata durumu deyimi tek satır (ölçülen kontrast rakamıyla)

---

## Alt Görevler

- [x] **1. `aria-invalid` alanına görsel işaret ver**
  - Alan bileşeninin `field` sınıf dizgesine `aria-invalid:` varyantıyla `neg` tabanlı halka/kenar eklenir
  - **Odakta olmayan** geçersiz alan da ayrışmalı — bugünkü körlük tam olarak orada (ölçüm odakta olmayan alanla yapıldı)
  - Rıza kutusu (`consent`) da kapsanır — o da `aria-invalid` taşıyor
  - Kontrast ölçülür, rakam sınıfın yanındaki yoruma yazılır

- [x] **2. Alan bazlı hata metni**
  - Her alanın kendi hata düğümü (`<alan>-error`) olur; `aria-describedby` genel kutu kimliği yerine **kendi** düğümünü gösterir (ipucu düğümü korunur)
  - Metin uçtan gelen mesajdan türer; **uç mesajını bileşende yeniden yazma** (bugünkü kural: "mesaj metni uçtan gelir, burada tekrarlanmaz")
  - Genel kutu **özet olarak kalır** (koruma önerisi böyle diyor) ve WhatsApp yolunu taşımaya devam eder

- [x] **3. Dört genişlikte ölç**
  - Geçersiz ve geçerli alanın 8 özelliği karşılaştırılır (`boxShadow, borderColor, borderWidth, backgroundColor, color, outlineColor, outlineWidth, outlineStyle`) — bulgunun kendi yöntemiyle, farkın **var** olduğu gösterilir

---

## Etkilenen Dosyalar

```
src/components/sections/
└── DemoForm.tsx            # aria-invalid stili + alan bazlı hata düğümü — zaten var
src/app/
└── globals.css             # yalnız gerekirse (token/varyant tanımı) — zaten var
```

---

## Dikkat Noktaları

- **Renk tek işaret olamaz.** WCAG 1.4.1: hata yalnız kırmızı kenarla anlatılmaz — metin zaten var (alan bazlı düğüm), ikisi birlikte çalışır.
- **`neg` açık zeminde ölçülmeli.** `STYLE-GUIDE` `neg` için `neg-wash` zemininde ≥ 4.96 ölçmüş; alan zemini `surface` (beyaz) — **yeniden ölç**, kopyalama.
- **Preflight'ın `:-moz-ui-invalid` kapatması yerinde kalır** — yerel tarayıcı işaretini geri açmak temayla çelişir; işaret bizim tokenımızdan gelir.
- **`aria-describedby` zinciri bozulmasın:** alanın ipucu (`<alan>-hint`) ve hata düğümü birlikte listelenir; boşken öznitelik hiç yazılmaz (bugünkü desen).
- TASK-2.05'in sıfırlama ayağı (e) bu düğümleri de kapsar — gönderim başında hata düğümleri DOM'dan kalkarken `aria-describedby` de temizlenmeli.

---

## Test Kriterleri

- [x] Odakta **olmayan** geçersiz alan ile geçerli alan 8 özellikte karşılaştırıldığında 320/360/390/412 px'te **fark var** (bugünkü `farklar: []` sonucunun tersi; çıktı dokümana) — kanal: UAT
- [x] Her hata türünde (`missing`, `missing-contact`, `bad-contact`, `no-consent`) hatalı alanın hemen altında metin görünüyor ve `aria-describedby` **DOM'da var olan** kendi düğümünü gösteriyor — kanal: UAT
- [x] Genel hata kutusu hâlâ duruyor ve WhatsApp bağlantısı çalışıyor (dönüşüm yolu kapanmadı) — kanal: UAT
- [x] `a11y.mjs` TOPLAM SORUN: 0; hata durumundaki metin ve kenar renginin kontrastı **rakamıyla** ölçüldü ve CSS yorumuna yazıldı (≥ 4.5 metin)
- [x] `mobile-audit.mjs` yatay kaydırma: yok · `scan.mjs` `/demo` konsol temiz
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [x] TASK-2.05'in altı ayağında regresyon yok (odak tablosu ve görünürlük yeniden ölçüldü) — kanal: UAT

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 — görsel işaret.** `DemoForm.tsx` → `field` sınıf dizgesine `aria-invalid:bg-neg-wash aria-invalid:ring-2 aria-invalid:ring-neg aria-invalid:focus:ring-sage-deep` eklendi. Rıza kutusu da kapsandı (`aria-invalid:ring-2 aria-invalid:ring-neg`). Ölçülen kontrastlar sınıfın yanındaki yoruma yazıldı.
- **Alt görev 2 — alan bazlı hata metni.** `Field` bileşeninin `invalid?: boolean` girdisi `error?: string` oldu; her işaretli alan kendi `<alan>-error` düğümünü doğuruyor ve `aria-describedby` genel kutu (`demo-form-error`) yerine **kendi** düğümünü + varsa ipucunu gösteriyor. Rıza kutusunun düğümü `<label>`ın dışında (`consent-error`). Metin uçtan gelen `json.message`; bileşende yeniden yazılmadı. Genel kutu özet olarak ve WhatsApp yolunu taşıyarak yerinde kaldı.
- **Alt görev 3 — dört genişlikte ölçüm.** Kontrol gruplu, iki yönlü (aşağıda).
- **Planlanmamış ama gerekli olan üçüncü değişiklik — işaretlenen kümenin daraltılması.** `FIELD_ERRORS` bir kodun dokunabileceği **tüm** alanları sayıyordu; ad doluyken kulüp boşsa `missing` ikisini birden işaretliyordu. İşaret yalnız ekran okuyucuya görünürken bu sessiz bir yanlışlıktı, ama görsel işaretin eklendiği an **doğru doldurulmuş alanı kırmızıya boyayan bir yanlış alarma** dönüşüyordu — task'ın kendi hedefiyle (“hangi alanın hatalı olduğunu görsün”) doğrudan çelişirdi. `focusFieldFor` → `markedFieldsFor` olarak yeniden yazıldı: aynı `filled` yüklemi hem işareti hem odağı üretiyor (odak listenin ilki).

**Sorunlar:**
- **`aria-invalid:` varyantı Tailwind 4.3.3'te yerleşik DEĞİL** (task dokümanı “yeni seçici ya da eklenti gerekmez” diyordu — araştırma varsayımı ölçümle düştü). Paketin kendi aria listesi dokuz değer taşıyor (`busy, checked, disabled, expanded, hidden, pressed, readonly, required, selected`) ve `invalid` aralarında yok. Kritik olan: tanımsız varyant Tailwind'de **sessizce hiçbir kural üretmez, hata da vermez** — işaret görünmez olur ve derleme yeşil kalır. Çözüm: `globals.css`'te `@custom-variant aria-invalid (&[aria-invalid="true"]);`. Sunulan CSS'te dört kuralın da doğduğu hem dev'de hem üretim imajında doğrulandı.
- **Odak halkası kırmızının altında kalabilirdi.** `focus:ring-sage-deep` (0,1,0) ile `aria-invalid:ring-neg` (0,1,0) eşit özgüllükte; sıra Tailwind'in kendi utility sıralamasından gelir, sınıf dizgesinden değil. Geçersiz alanda odak işaretinin kaybolmaması için `aria-invalid:focus:ring-sage-deep` (0,2,0) yazıldı; üretilen seçici `[aria-invalid="true"]:focus` olarak doğrulandı ve ölçümde odaklı alanın halkası 24/24 örnekte `rgb(62, 107, 60)` (sage-deep) okundu.
- **İlk koşumda 3 düğüm ekran dışındaydı (25/28).** Üçü de 390×844'te ve üçü de **odaklanan** alana aitti: düz `focus()` alanı ekranın kenarına hizalıyor, metin alanın 6-77 px altında durduğu için dışarıda kalıyor. `focus({preventScroll:true})` + `scrollIntoView({block:"center"})` ile ayrıldı → ikinci koşum **28/28**. Aynı ders TASK-2.05'te sonuç kutusunda ölçülmüştü; mekanizma ortak, bu turda alan tarafında tekrarlandı.

**Kararlar:**
- **İşaretlenen küme daraltıldı** (yukarıda): gerekçe yanlış alarm. `docs/DECISIONS.md`'ye eklendi: **Hayır** — geri dönüşün maliyeti yok (sözleşme/şema/veri yorumu bırakmıyor), gerekçe koddaki yorumda ve bu kayıtta duruyor.
- **İpucu düğümü hata düğümüyle birlikte listelenmeye devam ediyor** (task dikkat notu). Bedeli: `missing-contact` hâlinde telefon alanında gri ipucu ile kırmızı hata **aynı cümleyi** taşıyor (“Telefon veya e-postadan en az birini yazın.”), çünkü uç mesajı ipucu metniyle birebir aynı. İpucunu geçersizken gizlemek bu tekrarı bitirirdi ama task dokümanının açık talimatına aykırı; pekiştirici bir tekrar sayıldı ve dokunulmadı. `docs/DECISIONS.md`'ye eklendi: **Hayır**.
- **Alan zemini de değişiyor** (`neg-wash`), yalnız halka değil: mobilde bakışta ayırt ediciliği belirgin biçimde artırıyor ve `a11y.mjs` bu durumu zaten hiç görmüyor (hata hâline girmiyor), yani kapı tarafında risk doğurmuyor. Yer tutucu metnin (`text-faint/70`) zemini beyazdan #fceeec'e kaydı — iki zemin arasındaki fark ihmal edilebilir.

**Kalan İşler:** yok — B-055 atomu kapandı ve arşive taşındı.

**Dosya Değişiklikleri:**
- `src/components/sections/DemoForm.tsx` → `field` sınıf dizgesi (`aria-invalid:` dörtlüsü + ölçülen kontrast yorumu); `focusFieldFor` → `markedFieldsFor` (işaret + odak tek yüklemden); odak efektinde `focus({preventScroll:true})` + `scrollIntoView({block:"center"})`; `Field` bileşeni `invalid?: boolean` → `error?: string` ve `<alan>-error` düğümü; rıza kutusunun `consent-error` düğümü ve halkası; `CONSENT_ERROR_ID` sabiti
- `src/app/globals.css` → `@custom-variant aria-invalid` kaydı (gerekçesiyle)
- `_dev/docs/STYLE-GUIDE.md` → form hatası deyimi, ölçülen kontrast rakamlarıyla
- `_dev/bulgular/B-055-*.md` → Çözüm Kaydı (iki task birlikte anıldı), `bulgular/archive/`e taşındı; `_dev/BULGULAR.md` → satır silindi, açık bulgu 49 → 48

**Test Sonuçları:**
- **Tarayıcı ölçümü (kanal: UAT ayakları dâhil), kontrol gruplu ve iki yönlü.** Araştırma konteynerinde geçici Playwright betiği; **önce** = 3100'deki üretim imajı (TASK-2.05'in ağacı — CSS'inde `aria-invalid` kural sayısı **0** olduğu ölçülerek doğrulandı), **sonra** = dev 3000. Aynı betik ikisine de koştu. 4 genişlik (320/360/390/412) × 6 senaryo (`missing` iki hâl · `missing-contact` · `bad-contact` · `no-consent` · eşlenmeyen `no-sink` 503). `/api/demo` `page.route` ile taklit edildi: canlı `leads_preview` deposuna **hiçbir kayıt yazılmadı** ve hız sınırı hiç tetiklenmedi (senaryo başına ayrı `X-Forwarded-For`).

  | Ölçüt | ÖNCE (3100) | SONRA (3000) |
  |---|---|---|
  | Geçersiz+odaksız ↔ geçerli+odaksız alanda fark | **0/16** (`farklar: []`) | **8/8** (`boxShadow` + `backgroundColor`) |
  | Alan bazlı hata düğümü görünür | 0/36 | **28/28** |
  | `aria-describedby` kendi düğümünü gösteriyor, hepsi DOM'da | 0/36 | **28/28** |
  | İşaret doğru alanlarda (yanlış alarm yok) | 16/24 | **24/24** |
  | Odak doğru (TASK-2.05 tablosu) | 24/24 | **24/24** |
  | Özet kutusu + WhatsApp bağlantısı duruyor | 24/24 | **24/24** |
  | *Kontrol grubu:* geçerli ↔ geçerli alanda fark **yok** | 24/24 | 24/24 |

  İşaretli alan toplamının 36 → 28'e düşmesi sekiz yanlış alarm işaretinin kalkmasıdır. Düzeneğin kırmızıyı gösterebildiği kanıtlı (taban dört ölçütte sıfır verdi); kontrol grubu iki koşumda da `farklar: []` verdiği için “fark var” sonucu düzeneğin gürültüsü değil.
- **TASK-2.05 regresyon kontrolü (başarı yolu).** Onay kutusu 320/360/390/412'de **tam görünür 4/4**, dört genişlikte de `top = 88 px` (= `scroll-padding-top: 5.5rem`), odak `role="status"` — TASK-2.05'in kaydettiği rakamla birebir. Odak tablosu hata yolunda 24/24 korundu.
- **Ölçülen kontrastlar** (hesaplandı, sonra sunulan renkler tarayıcıda okunarak doğrulandı): hata metni #b34236 / form zemini #f7f8f4 → **5,25**; / alan zemini #fceeec → **4,96**; geçersiz alanın metni #171a15 / #fceeec → **15,55**; kırmızı halka form zeminine karşı **5,25** (mevcut gri halka 1,46). Eşik: metin 4,5 · grafik 3.
- **Kapılar:** `a11y.mjs` 8 rota **TOPLAM SORUN: 0**. `mobile-audit.mjs` **9/9 rotada yatay kaydırma: yok**, dokunma hedefi toplamı **157** (TASK-2.04, TASK-2.05 ve PHASE-1 UAT ile birebir). ⚠️ Bu iki kapı hata durumunu **hiç ölçmüyor** — yeşilleri bu task'ın kriterleri için kanıt değil, yalnız regresyon yokluğunun kanıtı. `scan.mjs` 390×844 `/demo`: 6 kare / 4.412 px **konsol temiz** (TASK-2.05 ile birebir). `font-guard.mjs`: kümede olmayan karakter yok (16 sayfa / 80.487 karakter).
- **`docker compose exec web npm test`:** 6 dosya / **66 geçti + 1 atlandı** (taban birebir). ⚠️ Saf fonksiyon testleri bu katmanı **kapsamıyor** — `DemoForm` hiçbir testte sınanmıyor (jsdom/testing-library yok, B-055'in kendi tespiti); bu task'ın güvencesi tarayıcı ölçümüdür.
- **`npx tsc --noEmit`:** çıkış 0. **Üretim derlemesi** imajın builder katmanında hatasız (paylaşılan `next_cache` hacmine dokunulmadı — `docker compose build web-prod`). 3100 yeni imaja alındı: HTTP 200 / 74.747 B (önce 73.998 B) ve dört `aria-invalid` seçicisinin dördünü de sunuyor (önce 0).

---

## Sonuç Özeti

Hatalı alan artık kendi üstünde görünüyor: `aria-invalid` alan 2 px `neg` halka + `neg-wash` zemin alıyor ve hata metni alanın hemen altında duruyor. Ölçülen taban (3100'deki bir önceki imaj) dört ölçütte de sıfır veriyordu — geçersiz ile geçerli alan 8 özellikte tıpatıp aynıydı (0/16), alan bazlı düğüm hiç yoktu (0/36). Sonrası: fark 8/8, düğüm görünür 28/28, `aria-describedby` kendi düğümünü gösteriyor 28/28, yanlış alarm işareti 16/24 → 24/24. TASK-2.05'in odak tablosu (24/24) ve onay kutusu görünürlüğü (4/4, 88 px) korundu. **B-055 atomu kapandı ve arşive taşındı.**

Yol boyunca iki şey ölçümle düzeldi: `aria-invalid:` varyantının Tailwind 4.3.3'te yerleşik olmadığı (tanımsızken sessizce hiçbir kural üretmiyor — `@custom-variant` ile kaydedildi) ve düz `focus()`'un alanı ekran kenarına hizalayıp altındaki metni dışarıda bıraktığı (açık, ortalanmış kaydırmayla 25/28 → 28/28).

---

**Oluşturulma:** 2026-09-22
