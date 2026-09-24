# TASK-3.12: Desenli zemin ve kalan iki kontrast yüzeyi

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

Kontrast ihlallerinin kalan üç yüzeyini kapatmak:

1. **`faint` desenli zemin üzerinde** — `bg-dotgrid` noktaları (`line-2`) glifin altına denk geldiğinde `p02` **4,06** / `min` 3,95 (gereken 4,5); `Chaos` bölümü. `globals.css` ve STYLE-GUIDE *"`faint` dört zeminde ≥ 4,71"* diyor — bu **beşinci** zemin.
2. **"Kulübünüzün diyetisyeni aynı platformda…"** — **3,47**
3. **Boks sayfasında "Gelmedi kolonu raporda ayrı"** — **3,65**

---

## Bağlam

B-032 kalem 4 + araştırmanın bulduğu iki yeni yüzey (`PHASE-3-ARASTIRMA.md` → devralınan iddiaların ölçüm tablosu, 3. satır (b) maddesi). Kullanıcı kararı: **ölçümün bulduğu kümenin tamamı düzelir**, kayıtlı beş kalem değil. Gerekçe: yeni kapı hepsini kırmızıya çevirecek; düzeltilmeyen kalem için kapıya adıyla muafiyet yazmak gerekirdi ve muafiyet listesi zamanla unutulur.

Kalem 2 ve 3'ün metinleri `src/content/` altında (`product.ts` ve `segments.ts`) ama **düzeltme metinde değil, onları çizen bölümün renginde**dir — metin taşınmaz, yeniden yazılmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 4 ve ölçüm yöntemi notu
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 3. satır
- `_dev/docs/STYLE-GUIDE.md` — `faint` tokenının "dört zeminde ≥ 4,71" beyanı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — `faint`'in desenli zemin üzerindeki kuralı (beyan bugün eksik)

---

## Alt Görevler

- [x] **1. Desenli zemin kalemi**
  - Çözüm yönü: `faint` desenli zemin üzerinde kullanılmaz (bir tık koyu tokena geçilir) **ya da** desenin opaklığı düşürülür
  - Çapa: `Chaos` bölümü + `bg-dotgrid` yardımcı sınıfı (`grep -n` ile konumlan)

- [x] **2. İki yeni yüzeyi kapıdan konumla**
  - Kapının teşhis satırı rotayı, metni ve renk değerlerini basıyor (TASK-3.03) — düzeltilecek sınıfı oradan bul, metinden değil
  - Metin çapaları yalnız tanıma içindir: `src/content/product.ts` diyetisyen gövdesi · `src/content/segments.ts` boks kalemi

- [x] **3. Üçünü de ölç ve rakamı koda yaz**

---

## Etkilenen Dosyalar

```
src/app/globals.css                      # faint / desen opaklığı (gerekirse)
src/components/sections/Chaos.tsx        # desenli zemin üzerindeki metnin rengi
src/components/sections/<iki yüzey>      # kapı teşhisinden belirlenir
```

---

## Dikkat Noktaları

- **Metin dosyalarına dokunma.** `src/content/` tek kaynaktır; bu task renk düzeltir, cümle değiştirmez (metin tonu F1.2 kendi fazında).
- **`p02` katı ölçüttür**; `min` ve `med` de raporlanır ama yargıyı `p02` verir (desenli zeminde bilinçli seçim).
- **İki yeni yüzeyin dosyası plan anında bilinmiyor** — kapının teşhis satırından konumlanır. Tahminle düzeltme yapma (Çalışma Prensibi #11).
- **STYLE-GUIDE'ın `faint` beyanı bu task'la eksik kalıyor:** "dört zeminde ≥ 4,71" cümlesi beşinci zemini saymıyor. Beyan gerçeğe çekilir — bu bir doküman düzeltmesidir, kullanıcıya bildirilir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [x] Üç kalemin üçü de `a11y.mjs`'te eşiğin üstünde; ölçülen `p02` değerleri task dokümanına yazıldı
- [x] `Chaos` bölümünün görsel dokusu korunuyor (ekran görüntüsü karşılaştırması)
- [x] 1440 · 390 · 320 px'te ölçüldü
- [x] STYLE-GUIDE'ın `faint` beyanı ölçülen gerçeğe çekildi
- [x] Beş ölçüm regresyon çizgisini koruyor

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
- **Önce kendi kapsamım ölçüldü, task'ın sayısına güvenilmedi.** Taban koşumu (3100 @1440, düzeltme öncesi) `TOPLAM SORUN` **9** bastı ve `/` rotasındaki tek kontrast ihlali desenli zemin kalemiydi. Task'ın saydığı öteki iki yüzey bağımsız ölçümde **geçiyor**: "Kulübünüzün diyetisyeni aynı platformda…" `p02` **7,05** (kayıt 3,47) ve boks sayfasındaki "Gelmedi kolonu raporda ayrı" `p02` **7,21** (kayıt 3,65). Yani **gerçek kapsam üç değil bir kalem**.
- **`Chaos` alt yazısı `text-faint` → `text-muted` oldu** (`Chaos.tsx`), ölçülen dört rakam kodun yanına yorum olarak yazıldı. Kapı: `TOPLAM SORUN` **9 → 8**, `/` rotasında kontrast ihlali **kalmadı**.
- **STYLE-GUIDE'ın `faint` beyanı tamamlandı** — "dört zeminde ≥ 4.71" cümlesi yanlış değilmiş, **eksikmiş**: payı yazılmamış.
- **`_dev/BULGULAR.md` → Gelen Kutusu'na bir satır düştü** (Çalışma Prensibi #12): `/` rotasında dar genişlikte eşik altı beş kalem daha var, hepsi üst üste binme sınıfı, adlandıran task yok.

**Sorunlar:**
- **Devralınan teşhis kısmen yanlıştı ve bu ancak izolasyonla görüldü.** B-032 kalem 4 ve task dokümanı ihlali **desene** bağlıyor ("`bg-dotgrid` noktaları glifin altına denk geldiğinde"). Deseni kapatıp ölçtüm: değer 4,06 → **4,47**, yani **hâlâ AA altı**. Desen **ve** gölgeler birlikte kapatıldığında **4,71** çıktı — tokenin beyan ettiği rakamın kendisi. Yani ihlali üreten iki katman var (kartların `shadow-lg`'si + desen) ve **gölge tek başına bile** `faint`in 0,21'lik payını yiyor. Çözüm: alt yazının rengi değişti, desen ve gölge olduğu gibi kaldı.
- **Task dokümanının ikinci çözüm yönü ("desenin opaklığı düşürülür") hiçbir değerde çözmüyor** — ölçüldü: opaklık 0,50 → 0,30 → 0,20 → 0,12 sırasıyla **4,30 · 4,43 · 4,47**; 0,12'de doku pratikte yok ve değer hâlâ eşiğin altında. Tavanı desen değil gölge belirliyor. Bu yön bu yüzden reddedildi.

**Kararlar:**
- **Token'a değil KULLANIMA dokunuldu (T11'in kuralının aynı ailesi).** `--color-faint` 38 yerde kullanılıyor ve düz zeminlerde doğru — `Hero`'nun `canvas` üstündeki üç `faint` kalemi bugün **4,94 · 5,16 · 5,16** ile geçiyor. Token koyulaştırılsaydı bugün geçen bu küme gereksizce koyulaşırdı. Düzeltme tek bir `<p>`'nin sınıfına indi.
- **Yeni token AÇILMADI, yerleşik `muted` kullanıldı.** Gerekçe: `text-sm text-muted` bu kod tabanında zaten yerleşik alt-yazı/ikincil metin deyimi (`PriceCalculator`, `PricingBlock`, `Modules`, `Roles`, `Faq`) — ad icadı gerekmedi ve T11'in "yeni durakları token olarak eklemedim" tutumuyla aynı hizada kalındı.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşün maliyeti yok (tek sınıf takası, sözleşme/şema/ad bırakmıyor); kalıcı kural zaten STYLE-GUIDE'a yazıldı.

**Kalan İşler:**
- Yok. B-032'nin **Çözüm Kaydı bilinçle doldurulmadı** — kalem 5 (404'ün dev rakamı) hâlâ açık, TASK-3.13'ün işi; çözüm teyidinin evi `verify-phase`.

**Son Yaklaşım:**
Tamamlandı — devam gerekmiyor.

**Sonraki Adım Detayı:**
Yok; sıradaki task TASK-3.13.

**Dosya Değişiklikleri:**
- `src/components/sections/Chaos.tsx` → alt yazının rengi `text-faint` → `text-muted`; üstüne dört ölçülmüş rakamı ve reddedilen alternatifi taşıyan yorum bloğu eklendi
- `_dev/docs/STYLE-GUIDE.md` → "`faint`in AA payı ve kompozisyon kuralı" paragrafı eklendi; token tablosunun `faint` hücresine "düz" niteleyicisi girdi (token **değerlerine** dokunulmadı)
- `_dev/BULGULAR.md` → Gelen Kutusu'na dar-genişlik kalemleri satırı; Son Güncelleme üzerine yazıldı

**Test Sonuçları:**
<!-- Ölçümler yayın kopyasına (3100) karşı, `reducedMotion: reduce`, etkileşimsiz hâl (B-015); yargı değeri `p02`. -->
- **`a11y.mjs`** 3100'e karşı 16 rota @1440×900 · 69 sn · `TOPLAM SORUN` **9 → 8**, çıkış **1**. Kalan 8 kapsam dışı: `/gecis`'in 6 kalemi (adlandıran task yok, Gelen Kutusu'nda) + 404'ün dev rakamı 1,12 ve h1→h3 atlaması (→ TASK-3.13). `/` rotasında ihlal **kalmadı**.
- **Kapsam tabanlarının hiçbiri oynamadı** (fail-open kapıları açık kaldı): 16 rota · 105 ekran adımı · 1835 eleman · gradyan **19 ölçüldü (taban 19) / 0 eşik altı** · başlık **316 (taban 316) / 1 atlama** · kovalar yapışkan **151** · görünmez **43** · ekran dışı **0** · kalan **0** — taban koşumuyla **birebir aynı**.
- **Düzelttiğim kalemin önce/sonra `p02`'si:** @1440 **4,06 → 5,54** · @390 **4,63 → 6,32** · @320 **4,51 → 6,16**. (`min`: 3,95 → 5,39 @1440 · 4,41 → 6,02 @390 · 1,05 → 1,13 @320 — son değer üst üste binmeden geliyor, aşağıda.)
- **Negatif kontrol:** aynı kapı, aynı hedef, düzeltme **öncesi** hâlde `TOPLAM SORUN` **9** ve `/`'de ihlal **1** basıyordu — yeşil bakmamaktan değil düzelmekten geldi.
- **İzolasyon ölçümü (teşhisi ayıran kontrol):** aynı kalem, `faint` yerinde — desen kapalı **4,47** · desen **ve** gölge kapalı **4,71** · desen 0,30/0,20/0,12'de **4,30 / 4,43 / 4,47**. Yani tavan gölgeden geliyor, desen ikinci katman.
- **Kalibrasyon:** B-032 kalem 4'ün kayıtlı rakamları (`p02` 4,06 · `min` 3,95 · `med` 4,63) kendi taban ölçümümde **birebir** doğrulandı. **Çüren iki devralınan rakam:** diyetisyen kalemi 3,47 → ölçülen **7,05**, boks kalemi 3,65 → ölçülen **7,21**.
- **Enjekte ↔ gerçek derleme birebir:** aday `muted` enjekte CSS ile **5,54**, kaynağa yazılıp 3100 tazelendikten sonra gerçek derlemede de **5,54**.
- **Görsel doku (test kriteri) göz kararıyla değil piksel farkıyla:** bölümün önce/sonra karesi (1440×770 = 1.108.800 piksel) karşılaştırıldı — farklı piksel **1.778 (%0,16)** ve değişen bölge **x 1073-1391 · y 630-643**, yani **319×14 px**: alt yazının glif kutusunun kendisi. Desen, kartlar ve gölgeler **bit bazında aynı**. 390'da da A/B kare alındı.
- **Regresyon:** `mobile-audit.mjs` 2 genişlik × 16 rota **285**, çıkış 1 (çizgiyle birebir; 320: kırpma 19 · şerit 8 · kritik 125/19 · 390: kırpma 0 · şerit 8 · kritik 125/19) · `font-guard.mjs` çıkış **0** (16 sayfa / 85.129 karakter, 153 karakterlik küme) · `scan.mjs` `/` @1440 (17 kare) ve `/gecis` @390 (10 kare) **konsol temiz** · `npm test` **210 geçti + 2 atlandı** (iki env kapısı kapalı — beklenen).
- **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` **16:13:21.594Z → 16:45:34.132Z** · hedef satır `text-center text-sm text-faint lg:text-right` **1 → 0**, `…text-muted lg:text-right` **0 → 1** · `/` HTML'inde `text-faint` **41 → 39**, `text-muted` **221 → 223** (Next gövdeyi HTML + RSC yükünde iki kez basıyor). **Negatif taraf:** dokunmadığım `/ozellikler` rotasında `text-faint` **13 → 13** değişmedi, ve stil parçasının adı **`3akz_pa--pbiq.css` olarak aynı kaldı** — beklenen, çünkü değişen bir CSS yardımcısı değil işaretlemedeki sınıf.
- **Kapının bakmadığı dar genişlikler:** `/` rotasında eşik altı kalem sayısı @390 **1 → 1**, @320 **4 → 4** — düzeltmem bu sayıları ne artırdı ne azalttı (benim kalemim ikisinde de zaten `p02` ile geçiyordu). Beş kalemin hepsi Gelen Kutusu'na yazıldı.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-24

**Ne Yapıldı:**
- `Chaos` bölümünün alt yazısı (`Bir kulübün bugün gerçekten kullandığı dört araç`) `faint` yerine `muted` ile boyandı; kapının bastığı tek `/` ihlali kapandı. `TOPLAM SORUN` **9 → 8**, kalem `p02` üç genişlikte **4,06 / 4,63 / 4,51 → 5,54 / 6,32 / 6,16**. Desen ve gölgeler değişmedi — piksel farkı bunu kanıtladı (değişen alan yalnız 319×14 px'lik glif kutusu).
- Task'ın saydığı öteki iki yüzey bağımsız ölçümde geçiyordu (**7,05** ve **7,21**); gerçek kapsam üç değil **bir** kalemdi.

**Öğrenilenler:**
- **Bir tokenin beyanı doğru olabilir ve yine de yetmeyebilir — ölçülmesi gereken beyan değil PAY.** `faint` gerçekten 4,71 veriyor (ölçüldü), ama eşik 4,5 olduğu için marjı 0,21 ve kompozisyonla oluşan her katman onu yiyor. Kural STYLE-GUIDE'a yazıldı.
- **Devralınan teşhis, devralınan rakam kadar riskli.** Hem B-032 hem task dokümanı ihlali **desene** bağlıyordu; deseni kapatınca kalem hâlâ eşik altıydı (4,47) ve asıl tavanı kartların `shadow-lg` gölgesi koyuyordu. Teşhisi ayıran şey "düzelttim, geçti" değil, katmanları tek tek kapatan **izolasyon ölçümüydü**.
- **Bir alternatifi reddetmek için de ölçüm gerekiyor.** "Desenin opaklığını düşür" yönü makul görünüyordu; dört değerde ölçüldü ve hiçbirinde eşiği geçmedi — dokuyu yok eden 0,12'de bile 4,47'de kaldı.
- **"Görsel doku korunuyor" bir izlenim değil ölçüm olabilir.** Önce/sonra karesinin piksel farkı, değişen alanın yalnızca metnin glif kutusu olduğunu gösterdi; kalan 1.108.800 pikselin tamamı birebir aynı.

---

**Oluşturulma:** 2026-09-23
