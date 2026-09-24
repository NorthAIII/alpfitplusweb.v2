# TASK-3.10: Kapanış çağrısı paragrafı gradyan bant üzerinde AA'ya çıkar

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

`FinalCta`'nın kapanış paragrafı (`text-ink-deep/75`) gradyan bant üzerinde eşik altında: 1440 px'te `p02` **3,97** / `min` 3,83-3,90; 390 px'te `p02` **3,59-3,62** / `min` **3,48** (gereken 4,5). **Tek değişiklik beş sayfayı birden düzeltir** — ana sayfa + dört segment sayfası.

---

## Bağlam

B-032 kalem 2. Kapı gradyan zemini atlıyordu; TASK-3.04 sonrası görünür oldu. En kötü değer **mobilde** (3,48), yani düzeltme 1440'ın yanında 390 ve 320 px'te de ölçülmeli.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 2
- `_dev/docs/STYLE-GUIDE.md` — mürekkep tokenları

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [x] **1. Paragrafın rengini opaklaştır**
  - `text-ink-deep/75` → tam opak `ink-deep` (B-032'nin önerdiği yön); çapa `src/components/sections/FinalCta.tsx` (⚠️ `grep -n` ile yeniden konumlan)
  - Opaklık kaldırılınca hiyerarşi bozuluyorsa alternatif: paragrafın altındaki gradyan bandın en açık durağını koyulaştır

- [x] **2. Beş sayfada da ölç**
  - `/` ve dört segment sayfası; 1440 · 390 · 320 px

---

## Etkilenen Dosyalar

```
src/components/sections/FinalCta.tsx   # kapanış paragrafının rengi
```

---

## Dikkat Noktaları

- **Başlık ile paragraf arasındaki görsel hiyerarşi**: paragraf tam opak olunca başlıkla aynı ağırlıkta görünebilir. Hiyerarşi punto ve ağırlıkla korunur, opaklıkla değil — STYLE-GUIDE'ın `faint` geleneği de koyulaştırma yönünde.
- **`p02` katı ölçüttür** (en kötü %2 piksel) ve desenli/gradyan zeminlerde bilinçli olarak öyle seçildi. `min` ve `med` de raporlanır; yargıyı `p02` verir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod` (yalnız `build` yetmez).

---

## Test Kriterleri

- [x] `a11y.mjs`'te kapanış paragrafı kalemi beş sayfanın hepsinde eşiğin üstünde; `p02` değeri task dokümanına yazıldı
- [x] En kötü hâl olan 390 px'te de eşik geçiliyor (eski değer 3,48)
- [x] 320 px'te ölçüldü
- [x] Başlık-paragraf hiyerarşisi gözle korunuyor (ekran görüntüsü)
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
- **Kapsam düzeltmeden önce kendi ölçümümle belirlendi ve task'ın yazdığından geniş çıktı.** Task "5 sayfa" ve tek satır diyor; `FinalCta` ölçüldüğünde **10 sayfada** koşuyor (`/` · `/ozellikler` · `/fiyat` · `/segmentler` · dört segment sayfası · `/yazilim-secerken` · `/gecis`) ve **iki satırı birden** eşik altında. Kapı sayısı bunu doğruluyor: bu sınıftan **20 eşik altı kalem** (10 sayfa × 2).
- **Devralınan rakamlar düzeltmeden önce yeniden üretildi** (kapının kendi lib'iyle, 3100'e karşı, üç genişlikte). Kapının basmadığı kalemleri de görmek için aynı `research/lib/piksel-kontrast.mjs`'i kullanan bir sonda yazıldı (scratchpad'de, repoya girmedi) — eşleşen **her** kalem basıldı, yalnız ihlaller değil.
- **Çözüm ölçülerek seçildi, tahminle değil:** kapanış paragrafı `text-ink-deep/75` → **tam opak `text-ink-deep`**, alt satır `text-ink-deep/70` → **`text-ink-deep/80`**.
- **Aday değerler kaynağa dokunmadan sınandı** — yayın kopyasının kendi sayfasına CSS enjekte edilip ölçüldü; kazanan değer sonra kaynağa yazıldı ve 3100 tazelenip gerçek derlemeye karşı yeniden ölçüldü. Enjekte ölçüm ile gerçek derleme birebir aynı rakamları verdi (390 px: 4,81 / 4,93 / 5,00 — üçü de tuttu), yani yöntem sadık.
- **Ölçülen rakamlar koda yorum olarak yazıldı** (STYLE-GUIDE geleneği): her iki satır için önce/sonra üçlüsü, denenen ara değer ve neden yetmediği.

**Sorunlar:**
- **Task dokümanının "alternatif: gradyan bandın en açık durağını koyulaştır" maddesi bu kalem için TERS yönde.** Metin koyu (`ink-deep`), zemin açık — zemin koyulaşırsa kontrast **düşer**. Ölçüldü: `ink-deep` tam opak hâlde bile `sage-deep` üstünde 3,07 · `sage` üstünde 7,67 · `sage-br` üstünde 10,63. Yani bandın en açık durağını koyulaştırmak bu satırı eşiğin daha da altına iterdi. O alternatif B-032'nin **3. kalemi** (gradyanla boyanmış metin) için yazılmış; bu kalem için tek yön metin alfasını yükseltmek.
- **Ara bir opaklık değeri yok — ölçüldü.** `/90` denendi ve 390 px'te **hâlâ eşik altı**: `/` 4,48 · `/fiyat` 4,37 (yalnız `/yazilim-secerken` 4,55 ile kıl payı geçiyor). Yani "tam opak" bir tercih değil, ölçümün zorladığı tek değer.
- **320 px'te ÜÇÜNCÜ bir kalem de eşik altındaymış** ve bunu hiçbir kayıt söylemiyordu: aynı bandın "Kredi kartı istemiyoruz" satırı 320 px'te `p02` **4,45-4,49** (390'da 4,57 · 1440'ta 4,67 ile geçiyor). Aynı `<p>` içinde olduğu için `/80` düzeltmesi onu da kapsadı (→ 5,52-5,63).

**Kararlar:**
- **İki satır birlikte düzeltildi, yalnız paragraf değil.** Gerekçe ölçüm: kapı ikisini de sayıyor, biri düzeltilip öteki bırakılsa `TOPLAM SORUN` 46 → 36'da kalır ve bu bileşen kırmızı sürerdi. İkisi aynı dosyada, aynı bölümde, yan yana duran işler (TASKS-README: "yan yana yapılması gereken işler aynı task'te olabilir").
- **Alt satır tam opak YAPILMADI, `/80` seçildi.** Tam opaklık 7,67-7,76 veriyor — gereğinden fazla, ve satırı üstteki paragrafla aynı tona düşürürdü. `/80` eşikten pay bırakıyor (5,50-5,70) ve satır hâlâ paragraftan sessiz.
- **Token'a (`--color-ink-deep`, `--color-sage-*`) dokunulmadı, iki sınıf değeri değişti.** T5'in gradyan turunda ölçtüğü ve T9'un uyguladığı risk: token'a dokunmak kapının bugün **geçen** kalemlerini de aşağı çeker. Özellikle `sage-br` TASK-3.11'in karar alanında — oraya girilmedi.
- `docs/DECISIONS.md`'ye eklendi: **Hayır** — geri dönüşü maliyetli bir sözleşme (ad/şema/API) doğmadı; iki sınıf değeri, gerekçesi kodda yorum olarak duruyor.

**Kalan İşler:** yok

**Dosya Değişiklikleri:**
- `src/components/sections/FinalCta.tsx` → kapanış paragrafı `text-ink-deep/75` → `text-ink-deep`; alt satır `text-ink-deep/70` → `text-ink-deep/80`; iki yere ölçülmüş rakamları ve gerekçeyi taşıyan yorum
- `_dev/BULGULAR.md` → Gelen Kutusu'na kapsam dışı bir kalem (alt bilgi telefonu 320 px'te 1,24)

**Test Sonuçları:**
- **`a11y.mjs` (3100, 1440×900, 16 rota — kapının tam koşumu):** `TOPLAM SORUN` **46 → 26**, çıkış kodu **1**. Düşen tam **20** kalem — bu turun ölçülmüş listesinin tamamı. Kalan 26 kapsam dışı: 17 gradyan metin + 1 başlık atlaması + 8 kontrast. **Kapsam tabanlarının hiçbiri oynamadı:** 16 rota · 105 ekran adımı · **1835 eleman** · gradyan **19 ölçüldü (taban 19) / 17 eşik altı** · başlık **316 (taban 316) / 1 atlama** · kovalar yapışkan 151 · görünmez 43 · ekran dışı 0 · **kalan 0** · 69 sn.
- **Kalem kalem, yayın kopyasına karşı (p02 · 10 sayfa):**
  - @1440 — kapanış paragrafı **3,92-4,17 → 5,52-5,95** · "15 gün ücretsiz deneme" **4,44-4,49 → 5,52-5,57** · "Kredi kartı istemiyoruz" 4,67 → **5,88-5,89**. Eşik altı **20 → 0**.
  - @390 (kapı buraya bakmıyor, ayrıca ölçüldü) — paragraf **3,55-3,65 → 4,81-5,00** · alt satır **4,44-4,48 → 5,51-5,56** · "Kredi kartı" 4,57 → **5,69-5,70**. Eşik altı **20 → 0**.
  - @320 (5 sayfa) — paragraf **3,42-3,98 → 4,57-5,59** · alt satır **4,44 → 5,50-5,51** · "Kredi kartı" **4,45-4,54 → 5,52-5,63**. Eşik altı **13 → 0**.
- **Kalibrasyon (devralınan rakamlara karşı):** T4'ün *"ailesi 5 değil 10 sayfa, iki satır birden eşik altı, 20 kalem"* iddiası kendi ölçümümde **birebir doğrulandı** (20/20). B-032'nin kalem 2 rakamları da tuttu: 1440 `p02` 3,97 (kayıt 3,97) · 390 `p02` 3,60 / `min` 3,47 (kayıt 3,59-3,62 / 3,48). **Çürüyen iddia yok;** genişleyen bir kalem var — 320 px'te üçüncü satır ("Kredi kartı istemiyoruz") da eşik altıymış, bunu hiçbir kayıt söylemiyordu.
- **Negatif kontrol (ara değer gerçekten yetmiyor mu):** `/90` enjekte edilip ölçüldü — 390 px'te `/` **4,48** · `/fiyat` **4,37** (eşik altı), `/yazilim-secerken` 4,55. Yani tam opaklık zorunlu.
- **Görsel hiyerarşi (test kriteri):** 1440 ve 390 px'te A/B kare alındı — biri bugünkü hâl, öteki aynı sayfaya CSS enjekte edilerek eski değerlere döndürülmüş hâl (kaynağa dokunulmadı). Başlık her iki karede de baskın (30/36px · 800), paragraf 17px/400, alt satır 14px/400; fark okunabilirlikte, ağırlık sırasında değil. Bandın aynı ekranda ölçülen h2'si de geçiyor (390 px'te `p02` **4,45**, gereken 3).
- **Regresyon çizgisi:** `mobile-audit.mjs` (2 genişlik × 16 rota) **285 sorun, çıkış 1** — T8/T9 çizgisiyle birebir (320 px: kırpma 19 · şerit 8 · kritik 125/19; 390 px: kırpma 0 · şerit 8 · kritik 125/19) · `font-guard.mjs` **çıkış 0** (153 karakterlik küme, 16 sayfa / 85.129 karakter, kümede olmayan karakter yok) · `scan.mjs` `/` @1440 (17 kare) ve `/gecis` @390 (10 kare) **konsol temiz**, çıkış 0 · `npm test` **210 geçti + 2 atlandı**, çıkış 0 (iki atlama env kapılı, beklenen).
- **Yayın kopyası tazelendi ve tazelik POZİTİF KONTROLLE ölçüldü** (B-019): `docker compose --profile prod up -d --build web-prod` sonrası site haritası `lastmod` **2026-09-24T15:08:10.582Z → 2026-09-24T15:41:05.341Z**, ve üç sayfada (`/` · `/fiyat` · `/gecis`) ayırt edici sınıf sayıları `text-ink-deep/75` **2 → 0** · `text-ink-deep/70` **2 → 0** · `text-ink-deep/80` **0 → 2**. "Build koştu" kanıt sayılmadı.
- **Kapsam:** ölçüm yayın kopyasına (3100) karşı, `reducedMotion: reduce`, **etkileşimsiz hâl** (açılmamış menü/sekme/akordeon dışarıda — B-015). Yargı değeri `p02`. ⚠️ Ara doğrulama için `BASE=http://localhost:3000` **hiç kullanılmadı** — T9'un ölçtüğü sahte kırmızı yüzünden bütün yargı 3100'e ait.

---

**Oluşturulma:** 2026-09-23
