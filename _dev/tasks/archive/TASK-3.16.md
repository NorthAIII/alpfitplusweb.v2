# TASK-3.16: Mobilde ilk ekranda demoya çıkan bir yol

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.07 ✅ · TASK-3.08 ✅

---

## Hedef

Telefonda sayfa açıldığı anda görünen ekranda hiçbir demo/WhatsApp yüzeyi olmayan sayfaları kapatmak. **390 px'te 6 sayfa** boş (`/fiyat` · `/segmentler` · `/demo` · üç yasal sayfa); **320 px'te 16 sayfanın 13'ü** boş. Kullanıcının seçtiği iki hafif hamle uygulanır: hamburger'in yanına sade bir **"Demo" bağlantısı** ve yüzen düğmenin **görünme eşiğinin düşürülmesi**.

> B-022'nin ikincil önerisi — WhatsApp bağlantısının kullanıcının yazdıklarını taşıması — kapsamda ama **bu task'ta değil**: ayrı bir alanın (lead hattı, M3) işi, ayrı dosyaya dokunuyor ve kişisel veriyi bağlantıya koyduğu için kendi çağrı-sitesi süpürmesini gerektiriyor. Kendi task'ında: **TASK-3.25** (verify-plan bölmesi, 2026-09-23).

---

## Bağlam

B-022. İki mekanizma üst üste biniyor: Header'ın "Demo İste" + WhatsApp bloğu `hidden … lg:flex` (1024 px altında hiç render edilmiyor) ve yüzen düğme `scrollY > 480` olana kadar `opacity-0 pointer-events-none`. Sonuç: mobilde her zaman görünen tek dönüşüm affordance'ı hamburger düğmesi. Fiyatı görmeye gelen kulüp sahibi 7.678 px'lik sayfanın tepesinde tıklayacak bir şey bulamıyor.

Kullanıcı kararı (PHASE-3): *"Alt yapışkan çağrı çubuğu dönüşüme daha güçlü etki ederdi ama ekranın bir bölümünü sürekli kaplıyor ve sayfanın havasını değiştiriyor."* — **yapışkan alt çubuk istenmedi.** Seçilen iki değişiklik STYLE-GUIDE'ın reddettiği kalıpların hiçbirine girmiyor ve görünümü neredeyse değiştirmiyor.

**Huninin geri kalanı sağlam** ve bu kaydedilmiştir: 16 sayfanın hepsinde huniye çıkış var, 15 benzersiz iç bağlantının hepsi 200 dönüyor. Sorun yolun varlığı değil, mobilde **ilk anda görünürlüğü**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md` — ölçüm tablosu ve mekanizmalar
- `_dev/ILKELER.md` — En Yüksek Öncelikli Eksenler (dönüşüm birinci)
- `_dev/docs/STYLE-GUIDE.md` — kullanıcının reddettiği kalıplar

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3'e mobil ilk ekran kriteri

---

## Alt Görevler

- [x] **1. Menünün yanına "Demo" bağlantısı**
  - Çapa: `src/components/layout/Header.tsx` — `hidden … lg:flex` bloğu (⚠️ `grep -n "lg:flex"` ile konumlan)
  - Mobilde hamburger'in yanında sade, metin tabanlı bir "Demo" bağlantısı; dokunma hedefi ≥ 44 px (TASK-3.08'in kritik kümesine giriyor)

- [x] **2. Yüzen düğmenin eşiğini düşür**
  - Çapa: `src/components/layout/Assistant.tsx` — `scrollY > 480` (⚠️ `grep -n "scrollY"` ile konumlan)
  - Eşik ~120 px'e indirilir ya da mobilde eşiksiz gösterilir; karar ölçütü sayfanın tepesindeki görsel gürültü

- [x] **3. Ölç**
  - 390 ve 320 px'te 16 sayfada ilk ekrandaki dönüşüm yüzeyi sayısı; hedef: hepsinde ≥ 1

---

## Etkilenen Dosyalar

```
src/components/layout/Header.tsx      # mobilde "Demo" bağlantısı
src/components/layout/Assistant.tsx   # yüzen düğmenin görünme eşiği
```

---

## Dikkat Noktaları

- **Yapışkan alt çubuk yapma.** Kullanıcı bilinçle reddetti.
- **Görünümü neredeyse değiştirmemek kararın parçası.** "Demo" bağlantısı rozet, parıltı ya da dolgu almaz — STYLE-GUIDE'ın reddettiği kalıplar.
- **Ölçüm ölçütü:** 390×844 bağlamında her sayfada `a[href='/demo'], a[href^='https://wa.me']` düğümlerinden `getBoundingClientRect().top < innerHeight` olanlar sayılır (B-022'nin yöntemi) — aynı yöntemle öncesi/sonrası ölçülür.
- **Bu kontrol kapıya GİRMİYOR.** Kapsam kararı fazın kapı işini kontrast + kırpma + dokunma hedefiyle sınırladı; ilk ekran kontrolü bu fazda **tek seferlik ölçümdür**. Kalıcı kapı isteniyorsa ayrı karardır (→ faz kapanışında kullanıcıya getirilir).
- **Gerçek telefonda doğrulama** faz sonundaki tura kalır — `kanal: UAT`.

---

## Test Kriterleri

- [x] 390 px'te 16 sayfanın hepsinde ilk ekranda en az bir dönüşüm yüzeyi var (öncesi: 10/16)
- [x] 320 px'te 16 sayfanın hepsinde en az bir dönüşüm yüzeyi var (öncesi: 3/16)
- [x] "Demo" bağlantısının dokunma hedefi ≥ 44 px (`mobile-audit.mjs` kritik kümesinde temiz)
- [x] Yüzen düğme sayfanın tepesinde görsel gürültü yaratmıyor (ekran görüntüsü, 390 px)
- [ ] Gerçek telefonda ilk ekran görünümü — `kanal: UAT`
- [x] Beş ölçüm regresyon çizgisini koruyor

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (biri hariç → `kanal: UAT`)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 — başlıkta mobil "Demo" bağlantısı.** `Header.tsx`'te hamburger, yeni bir `div.flex.items-center.gap-1.5.lg:hidden` kabına alındı ve yanına `<Link href="/demo">Demo</Link>` kondu (`inline-flex h-11 items-center rounded-xl px-3.5 text-[0.9375rem] font-medium text-sage-ink`). `lg:hidden` düğmeden kaba taşındı — net `lg:hidden` sayısı `/` HTML'inde **6 → 6**, yani kapsam oynamadı.
- **Alt görev 2 — yüzen düğmenin eşiği.** `Assistant.tsx`: `scrollY > 480` → `scrollY > 120`. Üretim paketinde doğrulandı: `scrollY>120` **1** eşleşme, `scrollY>480` **0**.
- **Alt görev 3 — ölçüm.** İlk ekran dönüşüm yüzeyi dokuz eksende önce/sonra ölçüldü; ayrıca kontrast, yapışkan katman çakışması, görünüş pikseli, klavye sırası ve mobil menü etkileşimi ölçüldü (aşağıda).
- **Kapsam tabanı bakımı.** `mobile-audit.mjs`'te iki taban bilinçle yükseltildi (aşağıda "Kararlar").
- **Kapsam dışı bulgu kaydedildi.** `BULGULAR.md` → Gelen Kutusu, `[TASK-3.16]`.
- **M2 F2.3'e iki kabul kriteri yazıldı** (ilk ekran dönüşüm yüzeyi · yüzen düğme eşiği).

**Sorunlar:**
- **Etiket "Demo İste" olamadı — yer ölçüldü:** 320 px'te başlık kabı 280 px ve logo **132,41** + hamburger **44** alıyor. "Demo İste" 72 px metin + 28 px dolgu = **100 px** → grup 152 > kullanılabilir 131,59, satır taşardı. "Demo" 42 + 28 = **70 px** → grup 120, toplam 268,41 ≤ 280, **11,6 px pay**. Görünen metin = erişilebilir ad tutuldu (`aria-label` ile genişletmek WCAG 2.5.3 açısından geçerli olurdu ama kapının benzersizleştirme anahtarı `etiket|ad` olduğu için düzeltme listesini bulanıklaştırırdı).
- **Kapının sınıflandırması beklediğimden farklı çıktı:** yeni bağlantıyı "dönüşüm bağlantısı" sanıp yorumu öyle yazmıştım; ölçtüm, **"menü"** çıktı — `mobile-audit.mjs`'te `header, nav` içindeki `<a>` dalı dönüşüm dalından **önce** eşleşiyor. Yorum ölçülen değere düzeltildi (menü **45 → 61**, dönüşüm bağlantısı **125 → 125**). İki kova da kritik kümede olduğu için 44 px kuralı yine geçerli ve sağlanıyor.
- **Locator tuzağı (memory'nin kaydı doğrulandı):** `header a[href="/demo"]` **iki** eleman eşliyor — masaüstü "Demo İste" düğmesi (`display:none`) önce geliyor ve tıklama zaman aşımına düşüyor. `:visible` + `.first()` ile çözüldü.
- **`waitForLoadState("load")` yumuşak gezinmeyi ölçmüyor:** tıklamadan sonra URL hâlâ eski sayfayı gösterdi ("`/fiyat`"). Next.js istemci-taraflı gezinmede `load` yeniden ateşlenmiyor; `waitForURL("**/demo")` ile ölçülünce üç rota × iki genişlikte **altı tıklamanın altısı `/demo`'ya gitti**. Bu ölçüm artefaktıydı, kusur değil.

**Kararlar:**
- **Eşik 0 değil 120 seçildi.** Gerekçe üç katlı ve ölçülü: (a) ilk ekran ölçütü zaten başlıktaki bağlantıyla kapanıyor — eşik sıfır olmadan dokuz eksende de 0/16 boş sayfa kaldı; (b) eşiğin var olma gerekçesi kayıtlı bir tasarım tercihi ("sayfanın tepesinde görsel gürültü olmasın", B-022 → Kök Neden Yönü) ve 120 px onu koruyor — ölçüldü: scrollY 0 ve 119'da yüzen düğme `opacity 0 / pointer-events none`, 200'de görünür; (c) sıfır eşik yüzen katmanı **her sayfanın ilk ekranındaki** metnin üstüne koyardı ve bu projede o, hiçbir kapının görmediği ölçülmüş bir sınıftır (B-063/B-064). 120 rakamı B-022'nin kendi önerisidir ("480 → ~120 px").
- **İki kapsam tabanı bilinçle yükseltildi** (`mobile-audit.mjs`): `BEKLENEN_METIN_ELEMANI` **2038 → 2054**, `BEKLENEN_KRITIK_HEDEF` **289 → 305**. İkisi de TABAN'dır (alt sınır), yani yükseltmeden de kapı geçerdi — ama eski değer bırakılsaydı ileride 16 elemanın sessizce kaybolması kapıda görünmezdi (fail-open penceresi). Yükseltilmiş tabanların gerçekten koruduğu **ayrıca sınandı**: dar kapsamla (`ROTALAR=/,/demo`) koşulduğunda dördü de kırmızı bastı (`metin taşıyan eleman 541 < 2054`, `kritik dokunma hedefi 59 < 305`).
- **Yeni olay adı AÇILMADI.** `/demo` tıklaması için bugün olay yok (`EVENTS` = `demo-submit` · `whatsapp` · `phone`) ve masaüstündeki "Demo İste" düğmesi de sayılmıyor — yani yeni bağlantı mevcut desenle aynı hizada. `demo-click` gibi bir ad icat etmek v1 hizası kararını (docs/DECISIONS.md, 2026-09-14) bozardı ve `analytics.ts`'in kendi kuralına aykırı olurdu ("kullanilmayan sabit acilmaz"). Bağlantı `data-surface="header"` atası altında olduğu için, olay bir gün açılırsa `ClickTracker` onu **kod değişmeden** doğru yüzeyle sayar.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü maliyetli bir sözleşme (ad/şema/API) doğmadı; iki dosyalık, izsiz geri alınabilir bir yerleşim değişikliği.

**Kalan İşler:**
- Gerçek telefonda ilk ekran görünümü — `kanal: UAT` (faz sonundaki tura bırakıldı, task dokümanının kendi kriteri böyle diyor).

**Dosya Değişiklikleri:**
- `src/components/layout/Header.tsx` → hamburger `lg:hidden` bir kaba alındı, yanına `/demo`'ya giden sade "Demo" bağlantısı eklendi; gerekçe ve ölçülen yer hesabı kod yorumunda
- `src/components/layout/Assistant.tsx` → yüzen düğme eşiği `480` → `120`; sıfırın neden seçilmediği kod yorumunda
- `research/scripts/mobile-audit.mjs` → iki kapsam tabanı ölçülen değere yükseltildi (2038→2054, 289→305), gerekçeler yorumlara yazıldı
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` → F2.3'e iki kabul kriteri
- `_dev/BULGULAR.md` → Gelen Kutusu'na bir kalem

**Test Sonuçları:**
<!-- Ölçüm kimliğiyle yazıldı: hedef, kapsam ve ölçütü birlikte. -->
- **İlk ekran dönüşüm yüzeyi — ölçüt B-022'nin ölçütü** (`a[href='/demo'], a[href^='https://wa.me']` düğümlerinden ilk ekranı kesenler), hedef **3100**, `reducedMotion: reduce`, kaydırma 0'a oturtuldu ve doğrulandı. **Süzgeç ayrıca ölçüldü (kontrol grubu):** görünürlük/tıklanabilirlik süzgeci olmadan **144/144 kombin** "yüzey var" derdi — opaklığı 0 olan yüzen düğme her sayfada sayılırdı; süzgeç gerçek iş görüyor.

  | eksen | önce (boş) | sonra (boş) | devralınan kayıt |
  |---|---|---|---|
  | dik 320×568 | **13/16** | **0/16** | T1: 13/16 ✓ birebir |
  | dik 390×844 | **6/16** | **0/16** | B-022 · T1 · T2: 6/16 ✓ birebir |
  | dik 412×915 | **6/16** | **0/16** | T1: 6/16 ✓ birebir |
  | dik 768×1024 | **5/16** | **0/16** | T1: 5/16 ✓ birebir |
  | %100 büyütme 1280×1024 | 0/16 | 0/16 | T2: 0/16 ✓ birebir |
  | %200 büyütme 640×512 | **10/16** | **0/16** | T2: 10/16 ✓ birebir |
  | %400 büyütme 320×256 | **16/16** | **0/16** | T2: 16/16 ✓ birebir |
  | yatay 844×390 (isMobile) | **16/16** | **0/16** | T2: 16/16 ✓ birebir |
  | yatay 915×412 (isMobile) | **15/16** | **0/16** | T2: 15/16 ✓ birebir (tek istisna `/ozellikler`) |

  **Dokuz devralınan rakamın dokuzu da birebir yeniden üretildi** — yani ölçüm aleti T1/T2/B-022'ninkiyle aynı şeyi ölçüyor. Sonrası dokuz eksende de **0 boş sayfa**.
- **Yeni bağlantının kutusu:** **70×44 px**, ölçülen 8 eksen × 16 rota = **128 örnekte birebir aynı**. Eşiğin (44) iki boyutta da üstünde.
- **`mobile-audit.mjs`** (3100, 2 genişlik × 16 rota, 54 sn): `TOPLAM SORUN` **250 → 250**, çıkış **1**. Kalan 250 kapsam dışı (kritik dokunma hedefi → TASK-3.17). **Negatif kontrol:** düzeltmeden önce aynı kapı aynı hedefte **250** bastı ve **iki ardışık koşum birebir aynı çıktıyı verdi** (belirlenimlilik teyidi). **Kova sızıntısı yok, her kova eklenen elemanın açıkladığı kadar oynadı:** eleman 6290 → **6322** (+32 = kap + bağlantı, 16 rota) · metin elemanı 2038 → **2054** (+16) · dokunma hedefi 622 → **638** (+16) · kritik hedef 289 → **305** (+16) · **kritik eşik altı 125 → 125 (değişmedi)** · benzersiz kritik küme **19 → 19 ve kalem kalem birebir aynı** (TASK-3.17'nin düzeltme listesi oynamadı) · gezinme 333/261 → **333/261** · kaydırılabilir kap **5 → 5** · kırpma **0 → 0** ve muafiyet kovaları birebir (görsel gizli 0 · hareketli şerit 19/18 · kaydırılabilir 38 · dikey 0) · şerit ihlali **0 → 0**.
- **Sınıf dağılımı ayrıca ölçüldü** (kapının kendi sınıflandırıcısı birebir yeniden koşturuldu, 2 genişlik × 16 rota): menü **45 → 61** · buton **111 → 111** · dönüşüm bağlantısı **125 → 125** · form alanı **8 → 8**; yeni bağlantı 16 rotanın hepsinde `menü · 70×44 · eşikAltı=false`.
- **Yükseltilen tabanların sınanması (boş/dar kapsam ayağı):** `ROTALAR=/,/demo` ile koşuldu → `✗ KAPSAM EŞİĞİ: gezilen rota 2 < 16` · `metin taşıyan eleman 541 < 2054` · `kaydırılabilir kap 2 < 5` · `kritik dokunma hedefi 59 < 305`, çıkış **1**. Yani yükseltilmiş taban gerçekten kapıyor.
- **Kontrast — kapının GÖRÜŞ ALANI DIŞINDA, elle ölçüldü.** `a11y.mjs` penceresi `1440×900` sabit ve yeni bağlantı orada `lg:hidden`; piksel yöntemiyle (glif maskesi + ata opaklığı, `research/lib/piksel-kontrast.mjs`) **2 genişlik × 3 rota × 2 başlık hâli = 12 kombin** ölçüldü: `p02` **7,21 – 7,73** (gereken 4,5), en kötü hâl `/` @320 **kaydırılmış** başlıkta (`bg-canvas/88` + `backdrop-blur`) **7,21**. Renk `rgb(47,90,46)` = `sage-ink`, 15px/500, ölçülen glif pikseli 246-247.
- **Yapışkan katman çakışması — iki ayrı soru, ikisi de ölçüldü** (16 rota × 2 genişlik × 7 kaydırma konumu): (a) **yeni "Demo" bağlantısı ↔ her `fixed`/`sticky` katman: 0 çakışma** (320 ve 390'da, tüm rota ve konumlarda). (b) Eşik düştüğü için **artık örtülen** banda ([120,480)) giren metin: **@320 59 · @390 57** çakışma; **zaten örtülen** referans bantta ([480,960]) **@320 110 · @390 115**. Yani yeni bant, kabul edilmiş bandın **aynı sınıfı ve yaklaşık yarısı kadar yoğun** — yeni bir çakışma sınıfı doğmadı (sınıfın kendi kaydı B-063/B-064).
- **Görünüş — DOM'da geri alınarak, 7 genişlik × 2 rota = 14 kombin / 10.141.200 piksel:** **≥1024 px'te (1024 · 1280 · 1440) 0 farklı piksel** (6 kombin / 6.739.200 piksel) — bu aynı zamanda ölçüm düzeneğinin kendi negatif kontrolüdür (bağlantı orada zaten gizli, düzenek sahte fark üretmiyor). **<1024 px'te fark tam 264 piksel** ve tek bir **12 px yüksek × 41 px geniş** banda kapalı (320: y 28-39 / x 195-235 · 390: x 265-305 · 412: x 287-327 · 768: x 631-671) — yani değişen tek şey "Demo" kelimesinin glifleri; sayı bağımsız olarak kontrast ölçümündeki glif piksel sayısıyla (246-247 + kenar) tutarlı. **Hiçbir genişlikte hiçbir şey kaymadı:** sayfa boyu 14 kombinde birebir aynı, `main` bölümlerinin konumları birebir, ve hamburger'in x'i **hiç oynamadı** (320:256 · 390:326 · 412:348 · 768:692 — `justify-between` son öğeyi sağ kenara çiviliyor, bağlantı sola doğru büyüyor).
- **Kapıların görmediği hâl — etkileşim (B-015):** mobil menü **hâlâ çalışıyor** (2 genişlikte): tıkla → panel açıldı (7 bağlantı, `aria-expanded=true`, odak panelin ilk bağlantısına geçti) → `Esc` → kapandı (`aria-expanded=false`, odak tetikleyiciye **döndü**). Yeni sarmalayıcı kap odak yönetimini bozmadı. **Klavye sırası** (`/fiyat`): "İçeriğe geç" → logo → **"Demo"** → "Menüyü aç" → içerik yolu → sayfa kontrolleri; gizli masaüstü bloğu odak almıyor. **Gezinme:** 3 rota × 2 genişlik = 6 tıklamanın altısı da `/demo`'ya gitti (`h1` doğrulandı).
- **Eşiğin dönme noktası ölçüldü:** scrollY **0 → gizli** · **119 → gizli** · **120 → gizli** · 121 → `pointer-events` açılıyor (opaklık bir sonraki karede) · **200 · 479 · 481 → görünür**. Yani sayfanın tepesi temiz kalıyor.
- **Ekran görüntüsü (test kriteri):** `/fiyat` @390×844 ilk ekran ve `/kvkk` @320×568 başlık — "Demo" sade metin olarak hamburger'in solunda, rozet/parıltı/dolgu yok, yüzen düğme görünmüyor, 320'de başlık sıkışmıyor.
- **Regresyon (hepsi 3100'e karşı):** `a11y.mjs` **6 sorun**, çıkış 1 — **değişmedi** (16 rota / 105 adım / **1834 eleman** / gradyan 19 ölçüldü-0 eşik altı / başlık 316-0 atlama; altı kalem de `/gecis`'in adlandıran task'ı olmayan kalemleri) · `font-guard.mjs` çıkış **0** (16 sayfa / **85.129** karakter — değişmedi, gerekçesi Gelen Kutusu'ndaki kalem) · `perf.mjs` `/` masaüstü **141 KB / LCP 84 ms / CLS 0,005**, mobil **132 KB / LCP 60 ms / CLS 0** (M6 çizgisi 144 KB / 96 ms — altında, T15 ile birebir) · `scan.mjs` `/fiyat` @320 (15 kare) · `/` @390 (20 kare) · `/kvkk` @320 (16 kare) → **üçü de konsol temiz** · `npm test` **210 geçti + 2 atlandı** · `tsc --noEmit` çıkış **0** · `lint` **30 problem, yeni yok** (dokunduğum iki dosyadaki iki kalem de değişiklikten önce vardı).
- **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` **18:33:19.272Z → 19:03:11.483Z**; `/` HTML'inde `>Demo<` **0 → 1** ve 16 rotanın hepsinde **1** (`/demo` kendi sayfasında 2 — ikincisi sayfa içeriği); üretim paketinde `scrollY>120` **1** / `scrollY>480` **0**; stil parçası `1c4v579qv3_6_.css` → **`0vbd5fjxayeye.css`** (bu turda beklenen — yeni yardımcı sınıflar doğdu, CSS'te `hover\:bg-sage-wash` kuralı var). **Negatif taraf (dokunmadıklarım):** `sm:whitespace-nowrap` `/`'de **17 → 17** (T14) · `max-w-[calc(100%_-_3rem)]` **4** (T15 yerinde) · `lg:hidden` **6 → 6**.

**Kapsam notu:** yargı her yerde **yayın kopyasına (3100)** ait; `BASE=http://localhost:3000` hiç kullanılmadı (B-063 sınıfı sahte kırmızı). Ölçümler `reducedMotion: reduce` ve **etkileşimsiz hâl** kapsamında (B-015); mobil menü ve tıklama ayrı bir etkileşim ayağında ölçüldü. Gerçek cihaz kapsam dışıdır → `kanal: UAT`.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-24

**Ne Yapıldı:**
- Başlığa `lg:` altında görünen sade bir "Demo" bağlantısı (70×44) kondu ve yüzen düğmenin eşiği 480 → 120 px'e indi. İlk ekranda dönüşüm yüzeyi olmayan sayfa sayısı **dokuz ölçüm ekseninde de 0/16**'ya indi (önce: 320 px 13 · 390 px 6 · 412 px 6 · 768 px 5 · %200 10 · %400 16 · yatay 16 ve 15).
- Mobil kapı **250'de kaldı ve eşik altı kalem sayısı da 125'te kaldı** — yeni bir dönüşüm yüzeyi, kapıya tek bir kalem eklemeden geldi. İki kapsam tabanı ölçülen yeni nüfusa yükseltildi (2038→2054, 289→305) ve yükseltmenin gerçekten koruduğu dar-kapsam koşumuyla sınandı.

**Öğrenilenler:**
- **`mobile-audit.mjs`'in kritik kümesinde sıra sonucu belirler:** `header, nav` içindeki bir `<a>`, hedefi `/demo` olsa bile "dönüşüm bağlantısı" değil **"menü"** sayılır — menü dalı önce eşleşiyor. İkisi de kritik kümede olduğu için 44 px kuralı değişmiyor, ama kova raporu okunurken bu bilinmeli.
- **İki kapı da yalnız 1440 px'te koşuyor** (`a11y.mjs` `PENCERE = 1440×900`, `font-guard.mjs` `viewport 1440×900` + `body.innerText`), yani **yalnız `lg:` altında çizilen metin ikisinin de kapsamı dışında**: bu turda eklenen bağlantı font tarayıcısında taranan karakter sayısını **hiç değiştirmedi** (85.129 → 85.129) ve a11y'nin ölçtüğü eleman sayısını da değiştirmedi (1834 → 1834). Kayıt: `BULGULAR.md` → Gelen Kutusu.
- **Sağa çivilenmiş bir gruba soldan öğe eklemek hiçbir şeyi kaydırmıyor:** `justify-between` son öğeyi sağ kenarda tutuyor, yeni bağlantı sola doğru büyüyor — hamburger'in x'i 7 genişlikte de oynamadı, değişen tek şey 264 pikselle "Demo" kelimesinin glifleri oldu.

---

**Oluşturulma:** 2026-09-23
