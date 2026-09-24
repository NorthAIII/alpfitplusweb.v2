# TASK-3.14: 320 px'te kesilen içerik ve işlev — `Button` tabanı ve `FounderProgram` ızgarası

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri · F2.1 Ana sayfa
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.07 ✅

---

## Hedef

320 px'te ana sayfanın `FounderProgram` bölümü 19 metin düğümünü ve **CTA'nın kendi etiketini** kesiyor — yani yalnız içerik değil **işlev** kaybı var: "Kurucu Programı için konuşalım" düğmesinin yazısı okunmuyor. İki düzeltme **birlikte** yapılır; yalnız biri uygulanırsa kusur biçim değiştirir.

---

## Bağlam

B-033'ün bisect ile kanıtlanmış kök neden zinciri:

```
Button.tsx temel sınıfında `whitespace-nowrap`
  → CTA etiketinin min-content'i 314 px (kırılamaz)
  → p-7 kartı içinde 370 px taban
  → FounderProgram ızgara çocuklarında `min-w-0` yok (min-width:auto)
  → track 370'te kilitleniyor
  → bölümün `overflow-hidden`'ı sağdan 70 px kesiyor
```

Üç mekanizmanın hiçbiri tek başına hata değil — **bileşimi** hata. Deney: ızgara çocuklarına `min-width: 0` → grid 370 → 280, kalan metin kırpması 0 px. ⚠️ **Yalnız `min-w-0` uygulanırsa** kırpma biter ama etiket buton kutusundan taşar (ölçüldü) — bu yüzden `whitespace-nowrap` de ele alınır.

**Sınıfın genişliği ölçüldü:** 11 rotadaki `nowrap` buton/linklerin min-content'i tarandı; 280 px'i aşan **tek** buton bu. Ama pay ince — sıradaki beş 240-247 px ("Geçiş planını konuşalım" 247, "WhatsApp'tan sorun" 246, "Demo talebi gönder" 242). Bunlar yalnızca dolgusuz kapta durdukları için sığıyor. **Taban `Button`'dadır, bölümde değil.**

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md` — kök neden zinciri ve bisect
- `_dev/docs/STYLE-GUIDE.md` — Düzen Tuzakları #2 (`min-w-0`) ve #1 (sticky + `overflow-hidden`)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — `whitespace-nowrap`'in yeni sınırı (deyim değişiyorsa kaydı)

---

## Alt Görevler

- [x] **1. `Button`'ın `whitespace-nowrap`'ini sınırla**
  - Çapa: `src/components/ui/Button.tsx` temel sınıfı (⚠️ `grep -n whitespace-nowrap` ile konumlan)
  - İki yol: sınıfı tamamen kaldırmak ya da `sm:` ile sınırlamak (dar telefonda etiket sarar, geniş ekranda tek satır kalır)
  - Değişiklik **her butonu** etkiler — 11 rotada gözle ve ölçümle doğrulanır

- [x] **2. `FounderProgram` ızgara çocuklarına `min-w-0`**
  - Çapa: `src/components/sections/FounderProgram.tsx` ızgara kabı (⚠️ `grep -n "grid gap"` ile konumlan)

- [x] **3. Sınıfın kalanını tara**
  - 240-247 px'lik beş buton dolgulu bir kaba girmiş mi — `mobile-audit.mjs` 320 px koşumu bunu zaten gösterir; kalan varsa aynı task'te kapatılır

---

## Etkilenen Dosyalar

```
src/components/ui/Button.tsx                    # temel sınıftaki whitespace-nowrap
src/components/sections/FounderProgram.tsx      # ızgara çocuklarına min-w-0
```

---

## Dikkat Noktaları

- **İkisi birlikte uygulanır.** Yalnız `min-w-0`: kırpma biter, etiket taşar. Yalnız `nowrap` kaldırma: etiket sarar ama başka dar kaplarda taban sorunu sürer.
- **`whitespace-nowrap` bir ilkelin temel sınıfında** — değişiklik sitenin her butonunu etkiler. Sarma davranışı istenmeyen yerler (tek kelimelik butonlar zaten sarmaz) gözle taranır.
- **Bölümün `overflow-hidden`'ına dokunma.** Kaldırmak kırpmayı yatay kaydırmaya çevirir; sorun yer değiştirir, çözülmez. (STYLE-GUIDE Düzen Tuzakları #1 sticky için ayrı bir kural koyuyor — bu bölüm sticky değil.)
- **Kapı zaten kurulu:** TASK-3.07 sonrası `mobile-audit.mjs` 320 px'te bu 19 düğümü sayıyor. Düzeltmenin ölçütü o sayının **0'a** inmesidir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [x] `mobile-audit.mjs` 320 px'te kırpılmış metin düğümü **0** (eski değer 19) — ölçüldü, `TOPLAM SORUN` 285 → 266
- [x] 320 px'te "Kurucu Programı için konuşalım" etiketi tümüyle okunuyor ve butonun kutusundan taşmıyor — kutu 224×52, içerik 224×52, 2 satır, dikey/yatay taşma 0
- [x] 390 · 768 · 1440 px'te düzen bozulmadı; hiçbir genişlikte yatay kaydırma yok — ≥ 640 px'te **0 farklı piksel** (4 tam sayfa / 40 M piksel)
- [x] `nowrap` kaldırılan butonların hiçbirinde istenmeyen sarma yok — **gözle değil ölçümle**: 16 rota × 8 genişlik, dikey taşma 0 · yatay taşma 0
- [x] %400 büyütmede (320×256) kırpılan düğüm sayısı ölçüldü — kapı tanımı 19 → **0**, B-033 bisect tanımı 9 → **0**
- [x] Beş ölçüm regresyon çizgisini koruyor

---

## Risk ve Geri Dönüş Planı

- **Risk:** `whitespace-nowrap` kaldırmak beklenmeyen bir yerde iki satırlık buton üretir → 11 rotada gözle tarama; sorunlu yer varsa o çağrıya yerel `whitespace-nowrap` verilir (taban değil, çağrı düzeyinde).
- **Rollback:** iki dosya, dosya bazlı geri alınır.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Kapının kalemi kapandı:** `mobile-audit.mjs` `TOPLAM SORUN` **285 → 266**, @320 kırpılmış metin **19 → 0**, @390 **0 → 0**. Kalan 266'nın hepsi başka task'ların kalemi (250 kritik dokunma hedefi → TASK-3.17 · 16 şerit ihlali → TASK-3.15).
- **Alt görev 1** — `Button.tsx` temel sınıfı: `whitespace-nowrap` → **`sm:whitespace-nowrap`**. İki aday (tamamen kaldırma / `sm:` ile sınırlama) yayın kopyasına CSS/DOM enjekte edilerek **yan yana ölçüldü**, seçim ölçümden çıktı (→ Kararlar).
- **Alt görev 2** — `FounderProgram.tsx`: ızgara kabının iki çocuğuna `min-w-0` (ikincisi `Reveal`'in `className`'i üzerinden; bileşen zaten `className` alıyor). Kod tabanının yerleşik deyimi izlendi (`Roles.tsx:43`/`:108` — `[&>*]:` deyimi bu projede hiç kullanılmıyor).
- **Alt görev 3** — sınıfın kalanı tarandı: 16 rota × 8 genişlik (320 · 390 · 412 · 640 · 768 · 844 · 1024 · 1440), her genişlikte 55–71 buton. Düzeltmeden **sonra** sarma dışında hiçbir kalem yok: dikey taşma **0**, yatay taşma **0**. Düzeltmeden **önce** (`min-w-0` tek başına uygulanmış hâlde) tek kalem vardı ve o da bu task'ın kalemiydi: "Kurucu Programı için konuşalım" kutusu 224, içeriği **243** — B-033'ün *"yalnız `min-w-0` uygulanırsa etiket buton kutusundan taşar"* iddiası **doğrulandı** (taşma 19 px).

**Sorunlar:**
- **Devralınan teşhis eksikti (çürümedi, ama tamamlanmadı):** task dokümanı da B-033 da kırpmayı bitiren şeyin `min-w-0` olduğunu söylüyordu. İzolasyon ölçümünde **`nowrap`'in kaldırılması TEK BAŞINA da kırpmayı 19 → 0 yapıyor** — kartın min-content'i 370 → 222'ye düşünce ızgara çocuğunun `min-width:auto` varsayılanı track'i artık şişiremiyor. İkisi de uygulandı (task öyle diyor, bedeli ölçüldü: ikisi birlikte = yalnız `nowrap` ile **birebir** aynı sonuç), ama sıralama tersine dönüyor: **asıl çözen `nowrap`, `min-w-0` savunma derinliği.**
- **Kayıtsız ikinci kusur bulundu ve düzeldi:** 320 px'te kapanış çağrısı bandındaki "WhatsApp'tan yazın" butonunun **WhatsApp ikonu 1,00 px genişliğe eziliyordu** (`shrink-0` yok; `nowrap` metin tüm satırı yiyordu). Düzeltmeden sonra **16,31 px**. Hiçbir kapı bunu görmüyordu — dokunma hedefi dalı butonun kendi kutusunu (224×52) ölçer, ikonu değil. Kalan 1,69 px'lik sıkışma (doğal boy 18) `BULGULAR.md` → Gelen Kutusu'na düştü.
- **Eleman ekran görüntüsü kıyası sahte fark bastı:** kapanış CTA'sının @390 kare farkı %21,29 çıktı ama **geometri ölçümü ikisini birebir aynı gösterdi** (kutu 294×52, ikon sol 52,50 gen 18,00, tek metin satırı 78,50/15,00 163×21). Neden: bölüm **65,5 px** (kesirli) uzuyor, dolayısıyla altındaki her şey yarım piksel kayıyor ve `locator.screenshot()` elemanı farklı yarım-piksel konumunda rasterize ediyor. **Hakem geometridir, kare değil** — aynı tuzak tam sayfa kıyasında da 17-25 satırlık glif bantları üretti.

**Kararlar:**
- **`sm:whitespace-nowrap` seçildi, tamamen kaldırma reddedildi.** Gerekçe ölçüm: iki aday 320/390 px'te **birebir aynı** (kırpma 19 → 0, sarma 13/1, dikey ve yatay taşma 0). Tek fark **1024 px'te**: tamamen kaldırmak `/demo`'daki iki butonu iki satıra düşürüyordu; `sm:` sınırlı hâl 640 · 768 · 844 · 1024 · 1440 px'te bugünkü hâli **birebir** koruyor (sarma 0 · taşma 0 · **0 farklı piksel**). WCAG 1.4.10 reflow'un ölçüm genişliği ve bu projenin kapısı zaten 320/390'dır, yani düzeltmenin gerekli olduğu aralık `sm:`in aktif aralığıyla örtüşüyor. Bedeli yazılı: ≥ 640 px'te tuzak yaşıyor ve onu ölçen kapı yok — bir çağrı orada sıkışırsa çözüm tabana değil **o çağrıya** yerel `whitespace-nowrap` vermektir (gerekçe `Button.tsx` başlık yorumunda).
- **`min-w-0` `[&>*]:` yerine çocuk çocuk verildi.** Gerekçe: kod tabanında `[&>` deyimi **hiç** kullanılmıyor, `min-w-0` ise `Roles.tsx`'te tam bu tuzağın çözümü olarak çocuk üzerinde duruyor (yorumuyla birlikte). Yeni deyim açmak bakım maliyetidir.
- **Sarmanın maliyeti kabul edildi:** 320 px'te 13 buton iki satıra düşüyor (10'u alt bilgi üstündeki "WhatsApp'tan yazın", 2'si `/demo`, 1'i bu task'ın CTA'sı), 390 px'te 1. Sabit yükseklikler (`h-9`/`h-11`/`h-13`) iki satırı **taşıyor** — ölçüldü, 8 genişlikte dikey taşma 0; `lg` butonunda iki satır 48 px, kutu 52 px.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü maliyetsiz bir sınıf değişikliği; bıraktığı kural `docs/STYLE-GUIDE.md`'de (Düzen Tuzakları tablosu + `whitespace-nowrap` sınırı) ve `Button.tsx` başlık yorumunda yaşıyor.

**Kalan İşler:**
- Yok. B-033'ün ikinci kalemi (Roller şeridi 320 px'te sığmıyor) bu task'ın kapsamında değil → TASK-3.15.

**Son Yaklaşım:** —

**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/components/ui/Button.tsx` → temel sınıf `whitespace-nowrap` → `sm:whitespace-nowrap`; üstüne ölçüm gerekçeli başlık yorumu (neden `sm:`, iki adayın rakamları, sabit yüksekliklerin iki satırı taşıdığı, çağrı düzeyinde kaçış yolu)
- `src/components/sections/FounderProgram.tsx` → ızgara kabının iki çocuğuna `min-w-0` (`<div>` + `Reveal className`), üstüne gerekçe yorumu
- `_dev/docs/STYLE-GUIDE.md` → Düzen Tuzakları tablosuna `whitespace-nowrap` satırı + `min-w-0` satırının güncel hâli
- `_dev/BULGULAR.md` → Gelen Kutusu: ikonun kalan 1,69 px sıkışması
- `_dev/bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md` → Çözüm Kaydı (birinci kalem kapandı, ikincisi TASK-3.15'te)
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` → kesirli öteleme + eleman karesi tuzağı

**Test Sonuçları:**
- **`mobile-audit.mjs`** — 3100'e karşı, 2 genişlik × 16 rota, 55 sn. `TOPLAM SORUN` **285 → 266**, çıkış **1** (kalan kalemler kapsam dışı: 250 kritik dokunma hedefi → TASK-3.17, 16 şerit ihlali → TASK-3.15). Kırpma: @320 **19 → 0** (en ağır 70 px → 0), @390 **0 → 0**.
- **Negatif kontrol (kalibrasyon):** düzeltmeden önce aynı kapı aynı hedefte **285** bastı ve @320'de 19 kalemin hepsini `/` rotasında, `kesen <section>` diyerek listeledi — devralınan rakam birebir yeniden üretildi.
- **Kova sızıntısı yok:** iki koşum satır satır karşılaştırıldı — muafiyet kovaları (@320 görsel gizli 0 · hareketli şerit 19 · kaydırılabilir 40 · dikey 0; @390 0/18/38/0) **birebir aynı**, yani hiçbir kalem sessizce başka kovaya taşınmadı.
- **Kapsam tabanlarının hiçbiri oynamadı:** 16 rota · 6290 eleman · **2038 metin elemanı** (taban 2038) · 622 dokunma hedefi · 5 kaydırılabilir kap (taban 5) · 289 kritik hedef (taban 289) — iki genişlikte de, önce ve sonra aynı.
- **İzolasyon (enjekte, / @320):** `taban` 19 kırpma / ızgara track 370 / kart min-content 370 / buton 314 nowrap · `min-w-0` tek başına **0 kırpma** ama buton içeriği 243 > kutu 224 (**etiket taşıyor**) · `nowrap` tek başına **0 kırpma**, kart min-content 370 → **222**, buton 224/224 iki satır · `ikisi` = `nowrap` ile birebir.
- **Aday karşılaştırması (enjekte, 16 rota × 6 genişlik):** A (tamamen kaldırma) ve B (`sm:`) 320/390'da birebir; 1024 px'te A `/demo`'da 2 buton sarıyor, B **0**. B seçildi.
- **Enjekte ↔ gerçek derleme birebir:** gerçek derlemede 8 genişlikte sarma 13/1/0/0/0/0/0/0 — enjekte tahminiyle rota rota aynı.
- **%400 büyütme (320×256, `/`):** kapı tanımı (eleman kutusu) **19 kalem / 70 px → 0**, B-033'ün bisect tanımı (metin menzili) **9 / 66 px → 0**; iki hâlde de yatay kaydırma yok. ⚠️ B-033'ün zoom ayağı *"8 düğüm / 66 px"* diyor; **aynı tanım bugün 9 veriyor** (66 px değişmedi) — rakam kaydedildiğinden beri bir düğüm daha kapsama girmiş.
- **Görünüş — ≥ 640 px'te sıfır değişiklik:** `/` @1440 (21.800.160 px) · `/gecis` @1440 (7.452.000 px) · `/ozellikler` @768 (8.428.032 px) · `/demo` @1024 (2.418.688 px) → dördünde de **0 farklı piksel** ve sayfa boyları birebir aynı (15139 · 5175 · 10974 · 2362).
- **Görünüş — < 640 px'te değişim kaynağında:** `/` @390 kaydırmasız üst bölge (y 0–21032, 8.202.480 px) **0 farklı piksel**; DOM geometri kıyasında değişen 46 elemanın **45'i Kurucu Programı bölümünde**, 46'ncısı `<main>` (boy artışı). `/` @320'de değişen 49 elemanın 45'i bölümde, kalan 3'ü kapanış CTA'sının ikonu/metni + `<main>`.
- **Kesirli öteleme ölçüldü:** bölüm @390 **1823,250 → 1888,750** (+65,5), @320 **1823,250 → 2197,500** (+374,25) — yarım piksel kayma, bölümün altındaki her metin satırını kare kıyasında "farklı" gösteriyor; geometri ölçümü bu satırların **aynı** olduğunu söylüyor.
- **Regresyon:** `a11y.mjs` **6 sorun**, çıkış 1 (değişmedi; hepsi `/gecis`'in adlandıran task'ı olmayan kalemleri) · kapsam 16 rota / 105 ekran adımı / **1834 eleman** (T13 ile birebir) · `font-guard.mjs` çıkış **0** (153 karakterlik küme, 16 sayfa, 85.129 karakter) · `perf.mjs` `/` masaüstü **141 KB / LCP 80 ms / CLS 0,005**, mobil **132 KB / LCP 60 ms / CLS 0** (M6 çizgisi: 144 KB · 96 ms · 0–0,005 — altında) · `scan.mjs` `/` @320, `/` @1440, `/demo` @320 **konsol temiz** · `npm test` **210 geçti + 2 atlandı** · `tsc --noEmit` **0** · `lint` **30 problem, yeni yok**.
- **3100 tazelendi ve pozitif kontrolle doğrulandı:** site haritası `lastmod` **17:09:29Z → 17:52:09Z**; `/` HTML'inde `sm:whitespace-nowrap` **17**, koşulsuz `font-display font-bold whitespace-nowrap` **0**, `min-w-0` 4 işaretleme + 2 RSC yükü; stil parçası adı `3akz_pa--pbiq.css` → **`13wm7yb1fyspy.css`** (bu turda **beklenen** — yeni bir yardımcı sınıf doğdu; T13'te tersi beklenmişti çünkü orada CSS'e dokunulmamıştı) ve `.sm\:whitespace-nowrap{white-space:nowrap}` kuralı `@media (min-width:40rem)` bloğunun içinde. **Negatif taraf:** dokunmadığım `/ozellikler`'de `min-w-0` **2 → 2** ve @768 karesi **0 farklı piksel**.
- **Kapsam:** ölçümlerin tamamı yayın kopyasına (3100) karşı, `reducedMotion: reduce`, etkileşimsiz hâl (B-015). Kapı yalnız 320 ve 390 px ölçer; 412–1440 px kalemleri bu turda **elle** ölçüldü ve kapıya girmedi.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-24

**Ne Yapıldı:**
- `Button` temel sınıfındaki koşulsuz `whitespace-nowrap` `sm:` ile sınırlandı ve `FounderProgram` ızgara çocukları `min-w-0` aldı; 320 px'te kesilen 19 metin düğümü ve okunamayan CTA etiketi kapandı, kapı 285 → 266.
- Bonus olarak 320 px'te 1 px'e ezilmiş WhatsApp ikonu 16,31 px'e döndü — hiçbir kapının görmediği, kaydı da olmayan bir kusurdu.

**Öğrenilenler:**
- **Bir ilkelin temel sınıfındaki `whitespace-nowrap` bir "görsel tercih" değil, ağaç boyunca yukarı yayılan bir min-content tabanıdır.** Kırpmayı bitiren şey `min-w-0` değil `nowrap`'in kalkmasıydı; `min-w-0` tabanın *geçişini* kesiyor, `nowrap`'in kalkması *tabanın kendisini* düşürüyor (370 → 222).
- **Kare kıyası kesirli ötelemede yalan söyler.** Bölüm 65,5 px uzayınca altındaki her metin satırı yarım piksel kayıyor ve "farklı" görünüyor; hakem DOM geometrisidir. Aynı tuzak `locator.screenshot()` ile alınan eleman karesinde de var.

---

**Oluşturulma:** 2026-09-23
