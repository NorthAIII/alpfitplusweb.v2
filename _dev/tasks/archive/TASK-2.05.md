# TASK-2.05: Demo formunda odak ve durum mekaniği — onay ve hata her telefonda görünür (B-055)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.1: Demo formu ve talep ucu
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok

---

## Hedef

Demo formunun **gönderim sonrası hâlini** her telefon genişliğinde görünür kılmak ve odağı hata türüne göre doğru yere taşımak. Bugün 320-360 px'te başarılı gönderimde ziyaretçi **hiçbir onay görmüyor** (kutu ekranın üstünde, yapışkan başlığın arkasında), hata kutusu ekranın 168-561 px altında kalıyor, `missing` hatasında odak **dolu** alana gidiyor ve eşlenmeyen kodlarda odak `body`'ye düşüyor.

Task, B-055'in altı mekanik ayağı (b, c, d, e, f, g) 320/360/390/412 px'te ölçülerek kapandığında tamamlanmış sayılır. **Görsel işaret ayağı (a) bu task'ta değil** — TASK-2.06.

---

## Bağlam

Sitenin birincil dönüşümü tamamlandığında 320-360 px'te kullanıcı hiçbir şey görmüyor: `role="status"` kutusu ("Talebiniz bize ulaştı") ekranın **üstünde** kalıyor (`top: −424 / bottom: 14` @ 320×568), kaydırma 6/6 örnekte sabit (`scrollY=1021`) — yani animasyon artığı değil, hiç kaydırma yok. `ILKELER.md`'nin 1. öncelik ekseni **Dönüşüm**'e doğrudan dokunuyor.

**Araştırmanın ölçtüğü mekanizma (`phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #5):** `globals.css:124` zaten `scroll-padding-top: 5.5rem` (88 px) taşıyor ve yapışkan başlık `h-17` (68 px) — **offset altyapısı kurulu**. Eksik olan kaydırmanın kendisi: `state === "ok"` dalında form tamamen değişiyor, sayfa kısalıyor, tarayıcı `scrollY`'yi olduğu yerde bırakıyor ve `scroll-padding-top` hiç devreye girmiyor.

**Seçilen çözüm (b):** durum değişiminde sonuç öğesine **açık odak taşıma** (`tabIndex={-1}` + `focus()`); odak kaydırması `scroll-padding-top`'u zaten onurlandırır. `scroll-margin-top` **eklenmez** — mevcut genel ayarı yerelde ikizler ve iki yerden yönetilen bir offset doğurur (reddedilen (a) seçeneği). (g) ayağı — 412 px'te h1'in üst 40 px'inin başlığın arkasında kalması — aynı hamlede kapanır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-055-demo-formu-hata-akisi-mobilde-gorunmuyor.md` — altı ayak, ölçüm tabloları, koruma önerisindeki odak tablosu
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #5 ve Dikkat Edilecekler → "Tarayıcı katmanı bu fazda otomatik ölçülmüyor"
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — **çok senaryolu ölçümde her senaryo kendi IP'sini taşımalı**; `/api/demo` IP başına 10 dk / 5 istek sayar ve doğrulamadan önce çalışır
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — Playwright ölçümü
- `src/components/sections/DemoForm.tsx:20-28, 55-75, 195-235` · `src/app/globals.css:124`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/bulgular/B-055-*.md` — hangi ayakların kapandığı (a ayağı TASK-2.06'da; atom o task'ta kapanır)

---

## Alt Görevler

- [x] **1. Sonuç öğelerine odak taşı (ayaklar b, f, g)**
  - Başarı kutusuna (`state === "ok"` dalı) ve hata kutusuna (`ERROR_ID`) `tabIndex={-1}` verilir; durum değiştiğinde `focus()` çağrılır
  - Odak taşıma **durum değişimine** bağlanır (render sonrası), gönderim fonksiyonunun içinde senkron değil
  - Yeni `scroll-margin-top` **eklenmez** — mevcut `scroll-padding-top: 5.5rem` yeterli (araştırma kararı)

- [x] **2. Odak kuralını koda göre ayır (ayak c)**
  - Bugünkü kural (`DemoForm.tsx:61-62`) `bad-contact` için yazılmış ama tüm kodlara uygulanıyor. Hedef tablo:

    | Kod | Odak |
    |---|---|
    | `missing`, `missing-contact` | İlk **boş** alan |
    | `bad-contact` | İlk **dolu-ama-bozuk** alan |
    | Eşlenmeyen kodlar ve ağ hatası | Hata kutusu (`tabIndex={-1}` + `focus()`) |

  - Var olan kod yorumu güncellenir; yeni kuralın gerekçesi yanında durur

- [x] **3. Eşlenmeyen kodlarda odağı kutuya taşı (ayak d)**
  - `no-sink` (503), `rate-limited` (429) ve `catch` dalı (ağ hatası): odak hata kutusuna
  - Bugün düğme `disabled` olunca odak `body`'ye düşüyor ve geri verilmiyor

- [x] **4. Gönderim başında eski işaretleri sıfırla (ayak e)**
  - `setState("sending")` anında `invalidFields` sıfırlanır — bugün hata kutusu DOM'dan kalkarken alanlar hâlâ `aria-describedby="… demo-form-error"` gösteriyor ve o kimlik DOM'da yok

---

## Etkilenen Dosyalar

```
src/components/sections/
└── DemoForm.tsx      # odak taşıma, odak kuralı, sıfırlama — zaten var
```

`globals.css`'e dokunulmaz (mevcut `scroll-padding-top` kullanılır).

---

## Dikkat Noktaları

- **Hız sınırı bataryayı yanıltır.** `/api/demo` IP başına 10 dk / 5 istek sayar ve **doğrulamadan önce** çalışır; senaryo başına ayrı `X-Forwarded-For` gönderilmezse 6. istekten sonra sahte kırmızı okunur (`memory/hiz-sinirli-uca-test-bataryasi.md`).
- **Kaydırma ölçümü beklemeli.** Bulgunun kendi yöntemi: kaydırma tamamen durduktan sonra ölç (≥1500 ms, `scrollY` üç okumada sabit). `scroll-behavior: smooth` yüzünden erken okuma yanıltır.
- **`aria-invalid`'in yeniden gönderime kadar sürmesi kusur değil** (ARIA 1.2, GOV.UK deseni) — sıfırlama **gönderim başında** yapılır, kullanıcı yazarken değil.
- **Alan bazlı hata metni ve görsel işaret bu task'ta yok** (ayak a → TASK-2.06). Genel kutu özet olarak kalır.
- **Kalıcı tarayıcı betiği bu fazda yazılmıyor** — bilinçli kapsam kararı ("Kalite kapıları otomatik" fazı, M6 F6.2). Bu task'ın ölçümü scratchpad'e yazılan geçici betikle yapılır; rakamlar dokümana girer.
- 390/412'de onay zaten görünüyordu — düzeltme oraya **regresyon sokmamalı** (kontrol grubu).

---

## Test Kriterleri

- [x] **Başarı yolu:** 320 / 360 / 390 / 412 px'te gönderim sonrası onay kutusu tamamen görünür ve yapışkan başlığın arkasında değil — dördünde de kutu **88 px**'te, kontrol gruplu 0/4 → 4/4 — kanal: UAT
- [x] **Hata yolu — alana eşlenmeyen kodlar** (`no-sink`, `rate-limited`, ağ hatası): kutu dört genişlikte de tam görünür, hepsi 88 px'te (6 genişlik × 3 kod = 18/18) — kanal: UAT
- [ ] **Hata yolu — alana eşlenen dört kod** (`missing`, `missing-contact`, `bad-contact`, `no-consent`): **karşılanmadı, ölçüldü.** Odak doğru alana gidiyor ama özet kutusu 320/360/412'de ekranın altında kalıyor (320 `missing`: kutu 1.040..1.114, ekran 568); form 320 px'te ~1.100 px, alan ile formun sonundaki kutu aynı ekrana sığmıyor. Bu ayak bu task'ın mekanizmasıyla kapanamaz — B-055'in koruma önerisi onu **alan bazlı hata metnine** bağlıyor → **TASK-2.06 (ayak a)** — kanal: UAT
- [x] **Odak tablosu (54/54):** `missing`'de **boş** alana, `bad-contact`'ta dolu-ama-bozuk alana, `no-sink`/`rate-limited`/ağ hatasında hata kutusuna odaklanıyor (senaryo başına ayrı IP ile) — kanal: UAT
- [x] **(g):** 412 ve 390 px'te gönderim sonrası `<h1>` yapışkan başlığın arkasında değil — bulgunun koşulu kurularak ölçüldü (önce 34..168 kesik → sonra −295..−161) — kanal: UAT
- [x] **(e):** yeniden gönderim sırasında hiçbir alan DOM'da olmayan bir kimliği `aria-describedby` ile göstermiyor (kırık referans: 0) — kanal: UAT
- [x] **Kontrol grubu:** 768 ve 1440 px'te onay ve hata görünür, odak doğru. Kaydırma konumu **bilinçli değişti** (mekanizma genişlikten bağımsız): 1440'ta taban onay kutusunu başlığın arkasında bırakıyordu (20..331), şimdi 88..399 — gerileme değil, aynı kusurun masaüstü hâlinin de kapanması — kanal: UAT
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `mobile-audit.mjs` 9/9 rotada yatay kaydırma yok (toplam 157, taban birebir) · `scan.mjs` `/demo` konsol temiz
- [x] `docker compose exec web npm test` yeşil (66 geçti + 1 atlandı) · üretim derlemesi imajın builder katmanında hatasız · `tsc --noEmit` çıkış 0

---

## Risk ve Geri Dönüş Planı

- **Odak taşıma ekran okuyucuda gürültü yapabilir:** `role="status"` / `role="alert"` zaten duyuruyor; odak taşıma ikinci bir duyuru üretirse duyuru kipi gözden geçirilir (kutunun `aria-live` değeri, odak hedefi).
- **Rollback:** tek dosya, dosya bazlı geri alma yeterli.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Test kriterleri karşılandı — **tek adlandırılmış istisnayla:** alana eşlenen dört kodda hata kutusunun görünürlüğü (ölçüldü, mekanizma sınırı; ayak (a) ile TASK-2.06'da kapanır)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Odak render sonrasına alındı** (`useEffect`, `[state]`): sonuç kutusu gönderim anında DOM'da olmadığı için odak senkron taşınamıyordu. Başarı kutusu (`role="status"`) ve hata kutusu (`role="alert"`) `tabIndex={-1}` aldı, tek `resultRef` ikisine de yetiyor (aynı anda ikisi birden DOM'da olmuyor).
- **Kutuya odaklanırken kaydırma açıkça yapılıyor:** `focus({ preventScroll: true })` + `scrollIntoView({ block: "start" })`. Alan odağında düz `focus()` kaldı — alanı zorla tepeye çekmek gereksiz.
- **Odak kuralı koda göre ayrıştı** (`focusFieldFor`): `bad-contact` → ilk **dolu** alan, `missing`/`missing-contact`/`no-consent` → ilk **boş** alan, alana eşlenmeyen kod ve ağ hatası → hata kutusu. Eski kural yalnız `bad-contact` için yazılmıştı ama tablonun tamamına uygulanıyordu.
- **`invalidFields` gönderim başında sıfırlanıyor** — kutu DOM'dan kalkarken alanların `aria-describedby` ile artık var olmayan bir kimliği göstermesi bitti. Başarı ve `catch` dallarındaki tekrar eden sıfırlama çağrıları kaldırıldı (tek sıfırlama noktası).
- `globals.css`'e dokunulmadı; yeni `scroll-margin-top` eklenmedi (araştırma kararı korundu).

**Sorunlar:**
- **Test kriterlerinden biri bu task'ın mekanizmasıyla karşılanamıyor (ölçüldü):** "hata kutusu görünür alanda" kriteri alana eşlenen dört kod (`missing` · `missing-contact` · `bad-contact` · `no-consent`) için sağlanmıyor. Odak doğru alana gidiyor, ama form 320 px'te ~1.100 px boyunda ve özet kutusu formun sonunda — alan ile kutu aynı ekrana sığmıyor (320'de kutu 1.040..1.203, ekran 568). B-055'in **kendi koruma önerisi** bu ayağı alan bazlı hata metnine bağlıyor ("metin alanın hemen altında dursun") = ayak (a) = **TASK-2.06**. Plan revizyonu rotası açılmadı: eksik/çelişen task yok, ayak zaten sıradaki task'ın sahipliğinde.
- **Araştırmanın seçtiği "düz `focus()`" (g) ayağını kapatmıyor** — ölçüldü, aşağıda.

**Kararlar:**
- **Kutu odağında kaydırma koşulsuz `block: "start"` ile yapılır** (araştırmanın "odak kaydırması `scroll-padding-top`'u zaten onurlandırır" hâli yerine). Gerekçe ölçüm: `focus()`'un kendi "gerekirse görünür yap" davranışı kutu **zaten ekrandayken hiç kaydırmıyor**; bulgunun (g) koşulunda (gönderim öncesi h1 34..168, yapışkan başlık bandı 0..68) düz `focus()` sondası scrollY'yi 151'de bıraktı ve h1 390 ve 412 px'te kesik kalmaya devam etti. `block: "start"` mevcut `scroll-padding-top: 5.5rem` offsetini **birebir** onurlandırıyor (kutu tam **88 px**'e oturuyor), yani "yeni `scroll-margin-top` eklenmez" kararı korunuyor — offset hâlâ tek yerden yönetiliyor.
- **Masaüstünde de kaydırma artık deterministik.** Taban 1440 px'te onay kutusunu yapışkan başlığın arkasında bırakıyordu (20..331, üst 48 px kesik); şimdi 88..399. Kontrol grubu kriterinin özü (onay/hata görünür, odak doğru) korundu ve iyileşti; değişen tek şey kaydırma konumunun kullanıcının gönderim öncesi nerede durduğuna bağlı olmaktan çıkması.
- **Ekran okuyucu duyuru kipine dokunulmadı.** `role="status"`/`role="alert"` canlı bölgesi yerinde; odak taşıma ikinci bir duyuru üretiyor mu ölçülemedi (projede ekran okuyucu kanalı yok) — `BULGULAR.md` → Gelen Kutusu'na düştü.
- docs/DECISIONS.md'ye eklendi: **Hayır** — mekanizma geri alınabilir, dışarıya ad/şema/API sözleşmesi bırakmıyor, biriken verinin yorumunu değiştirmiyor.

**Kalan İşler:**
- Alana eşlenen dört kodda hata metninin görünürlüğü → **TASK-2.06** (ayak a). B-055 atomu orada kapanır.

**Son Yaklaşım:** —
**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/components/sections/DemoForm.tsx` → `useEffect`/`useRef` eklendi; modül düzeyinde `focusFieldFor()`; `resultRef` + `fieldToFocus` refleri; başarı ve hata kutularına `tabIndex={-1}`; gönderim başında `invalidFields` sıfırlama. **+70 / −14 satır**, tek dosya.

**Test Sonuçları:**

Ölçüm düzeneği: araştırma konteynerinde Playwright, hedef **dev sunucusu (3000)**; betikler scratchpad'de, `research/`'e kalıcı dosya bırakılmadı. `/api/demo` `page.route` ile **taklit edildi** — canlı `leads_preview` deposuna hiçbir kayıt yazılmadı ve IP başına 10 dk / 5 istek kotası hiç tetiklenmedi (senaryolar ayrıca senaryo başına ayrı `X-Forwarded-For` taşıyor). Her ölçüm kaydırma tamamen durduktan sonra alındı (≥1.300 ms + `scrollY` iki okumada sabit).

- **Başarı yolu — kontrol gruplu (aynı betik düzeltmeden önce de koştu).** Kutu **tam görünür ve başlığın altında** (top ≥ 68, bottom ≤ ekran): **2/6 → 6/6**; mobilde **0/4 → 4/4**. Kutunun üst kenarı altı genişlikte de tam **88 px** (= `scroll-padding-top`).

  | Genişlik | Taban (kutu top..bottom) | Taban odak | Sonra | Sonra odak |
  |---|---|---|---|---|
  | 320×568 | −424..14 (ekran dışı) | `body` | **88..526** | `div[role=status]` |
  | 360×640 | −387..27 (ekran dışı) | `body` | **88..502** | `div[role=status]` |
  | 390×844 | −395..−6 (ekran dışı) | `body` | **88..477** | `div[role=status]` |
  | 412×915 | 281..670 (görünür) | `body` | **88..477** | `div[role=status]` |
  | 768×1024 | 440..751 (görünür) | `body` | **88..399** | `div[role=status]` |
  | 1440×900 | 20..331 (**başlığın arkasında**) | `body` | **88..399** | `div[role=status]` |

- **(g) — bulgunun koşulu birebir kuruldu** (gönderim öncesi `h1` 34..168, başlık bandı 0..68 → kesik) ve **iki mekanizma yan yana sınandı**: düz `focus()` scrollY'yi 151'de bıraktı, h1 34..168'de **kesik kaldı** (390 ve 412 px, 2/2); `focus(preventScroll)+scrollIntoView(start)` scrollY'yi 480 yaptı, kutu 88..477, h1 −295..−161 → **kesik değil** (2/2). Gerçek kodla tekrar: aynı sonuç. Doğal akışta da h1 altı genişlikte de kesik değil.
- **Odak tablosu — 6 genişlik × 9 senaryo = 54/54 beklenen hedefte.** Taban kırmızıyı gösterebiliyordu: `missing`'de odak **dolu** alana gidiyordu (ad boş → `#club`, kulüp boş → `#name`) ve `no-sink`/`rate-limited`/ağ hatasında `body`'ye düşüyordu. Sonra: `missing` → boş alan (`#name` / `#club`), `bad-contact` → dolu-ama-bozuk alan (`#phone` / `#email`), `missing-contact` → `#phone`, `no-consent` → `#consent`, eşlenmeyen üç kod → `p#demo-form-error`.
- **Eşlenmeyen kodlarda hata kutusu: 6 genişlik × 3 kod = 18/18 tam görünür**, hepsi 88 px'te. Taban: 320 px'te ağ hatası 450..569 (ekran 568 — alttan taşıyordu) ve odak `body`.
- **Alana eşlenen dört kodda kutu görünürlüğü — KARŞILANMADI** (yukarıda "Sorunlar"): 320/360/412'de kutu ekranın altında (örn. 320 `missing` 1.040..1.114), 390'da beş senaryonun dördünde görünür. Taban da aynıydı; bu task odağı düzeltti, metnin görünürlüğü ayak (a) ile gelecek.
- **(e):** ikinci gönderim **sırasında** hiçbir alan `aria-invalid` taşımıyor ve DOM'da olmayan kimliğe işaret eden `aria-describedby` yok (kırık referans: **0**); kutu o an DOM'da değil, düğme `disabled`. Taban: B-055'in kanıtı `phone aria-invalid=true describedby='phone-hint demo-form-error' | kutu DOM'da=False`; çapa commit'te (`git show 39eb1d4`) gönderim başında sıfırlama çağrısı yok — üç `setInvalidFields` çağrısının üçü de yanıt geldikten sonra.
- **Kapılar:** `a11y.mjs` 8 rota **TOPLAM SORUN: 0** · `mobile-audit.mjs` **9/9 rotada yatay kaydırma yok**, dokunma hedefi toplamı **157** (TASK-2.04 ve PHASE-1 UAT'takiyle birebir — değişiklik bu kapının görebildiği bir sınıfta değil) · `scan.mjs /demo 390×844` 6 kare / 4.412 px **konsol temiz** · `npm test` (web konteyneri) 6 dosya, **66 geçti + 1 atlandı** (taban birebir; saf fonksiyon testleri bu bileşeni kapsamıyor) · `npx tsc --noEmit` **çıkış 0** · ESLint deposu 30 kalem (25 hata + 5 uyarı) — DemoForm'daki 4 kalem önceden var olan `WhatsApp'tan` metin satırları, eklenen satırların hiçbiri JSX metninde kesme işareti taşımıyor.
- **Üretim derlemesi** imajın builder katmanında hatasız (`docker compose build web-prod`; paylaşılan `next_cache` hacmine dokunulmadı). 3100 yeni imaja alındı ve **tazelik kontrol gruplu**: üretim paketi yeni mekanizmanın izini (`preventScroll`) taşıyor, `/demo` HTTP 200 / 73.998 B.

---

## Sonuç Özeti

B-055'in altı mekanik ayağından **beşi kapandı** (c · d · e · f · g) ve (b) **kısmen** kapandı: gönderim sonrası odak artık sonuç yüzeyine ya da doğru alana taşınıyor, onay kutusu altı genişlikte de tam 88 px'te görünüyor (taban 2/6), odak tablosu 54/54 tutuyor, eşlenmeyen kodlarda kutu 18/18 görünür, yeniden gönderimde kırık `aria-describedby` kalmıyor. (b)'nin alana eşlenen yarısı — özet kutusunun mobilde görünürlüğü — bu mekanizmayla kapanamıyor ve B-055'in kendi koruma önerisi uyarınca alan bazlı hata metnine (ayak a, **TASK-2.06**) bağlı; **B-055 atomu orada kapanır.** Tek dosya değişti (`DemoForm.tsx`, +70/−14).

---

**Oluşturulma:** 2026-09-22
