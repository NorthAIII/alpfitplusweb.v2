# TASK-3.11: Gradyanla boyanmış metnin durakları koyulaştırılır

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.05 ✅

---

## Hedef

`.text-gradient-sage` ile boyanan başlık vurgularının en açık durağı açık zeminde **1,74:1** (canvas) / **1,64:1** (canvas-soft) — gereken 3,0. Gradyanın durakları AA'yı geçecek şekilde koyulaştırılır. Sınıf **11 benzersiz metinde**, 9 bölüm dosyasında kullanılıyor; düzeltme tek yerde (CSS sınıfı) yapılır.

---

## Bağlam

B-032 kalem 3. STYLE-GUIDE zaten *"açık zeminde `sage` metin olarak kontrastı geçmez"* diyor ve metin için `sage-ink` (`#2f5a2e`) emsalini kuruyor; `sage-br` ondan daha açık. Araştırma kayıtlı "5 yer" sayısını **11 benzersiz** olarak düzeltti.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 3
- `_dev/docs/STYLE-GUIDE.md` — marka tokenları, `sage-ink` emsali, "ölçümü rakamıyla yaz" geleneği
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (gradyan metin ayrı dal)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — gradyan metnin yeni durakları ve ölçülen kontrast

---

## Alt Görevler

- [x] **1. Durakları yeniden seç**
  - Çapa: `src/app/globals.css` → `.text-gradient-sage` (⚠️ `grep -n` ile yeniden konumlan)
  - Gradyanın **en açık** durağı canvas ve canvas-soft zeminlerinde ≥ 3,0 verecek şekilde koyulaştırılır; marka hissi korunur (sage ailesi içinde kalınır)

- [x] **2. On bir kullanım yerinin hepsinde ölç**
  - Sınıf 9 bölüm/sayfa dosyasında geçiyor; zeminler canvas ve canvas-soft arasında değişiyor — en kötü zemin belirleyicidir

- [x] **3. Ölçülen rakamı CSS yorumuna yaz**

---

## Etkilenen Dosyalar

```
src/app/globals.css   # .text-gradient-sage duraklarının değerleri
```

---

## Dikkat Noktaları

- **Bu bir marka rengi kararıdır.** Vurgu, başlığın geri kalanından ayrışmaya devam etmeli; koyulaştırma vurguyu düz metne dönüştürürse alternatif ayrışma (ağırlık, alt çizgi deyimi) kullanıcıya getirilir.
- **Ölçüt en açık duraktır** (TASK-3.05'in kurduğu dal) — gradyanın ortalaması değil. Kapı bunu ölçer.
- **Metin değişmez.** `src/content/` dokunulmaz; bu bir renk düzeltmesidir (iddia sınırı ve metin tonu kapsam dışı).
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [x] `a11y.mjs`'in gradyan metin dalı **0 eşik altı** veriyor; ölçülen en kötü değer task dokümanına yazıldı
- [x] 11 benzersiz metnin hepsi ölçüldü (dal sayıyı basıyor — sayı düşerse seçici körleşmiştir)
- [x] Vurgu başlığın geri kalanından gözle ayrışıyor (ekran görüntüsü, canvas ve canvas-soft zeminlerde)
- [x] `font-guard.mjs` kümede olmayan karakter bulmuyor (renk değişikliği karakter getirmemeli, ama ölçüm atlanmaz)
- [x] Beş ölçüm regresyon çizgisini koruyor

---

## Karar Noktaları

- **Koyulaştırma vurguyu öldürürse:** gradyanı korumak (ve metni büyük-metin eşiğiyle sınırlamak) vs. düz `sage-ink` rengine geçmek → kullanıcıya sorulacak.

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
- **Kendi kapsamımı kendim ölçtüm — task dokümanının "11 benzersiz metin / 9 dosya" sayısı bu turda da çürük çıktı.** Kaynakta `.text-gradient-sage` **15 benzersiz metinde, 15 dosyada**; kapı 16 rotada **19 eleman** ölçüyor ve **17'si** bu sınıftan (bazı bölümler birden çok rotada koşuyor: `kendi ekranından` `/` + `/ozellikler`, `aynı üründe` `/` + `/segmentler`). Kalan 2 eleman ayrı bir Tailwind yazımından geliyor (`bg-linear-to-r from-sage-br to-sage bg-clip-text`) ve **koyu zeminde durdukları için bugün geçiyorlar**. Yani doğrulama sayısı 11 de değil, 17'dir — DURUM'un TASK-3.05'ten devraldığı rakam doğruydu, task dokümanınınki değil.
- **Alt görev 1 — duraklar yeniden seçildi.** `.text-gradient-sage`'in gradyanı `sage-deep 0% → sage 55% → sage-br 100%` iken `sage-deep 0% → #41813d 55% → #44943d 100%` oldu. En açık durak `#94d08e` (canvas-soft 1,64) → `#44943d` (canvas-soft 3,46).
- **Alt görev 2 — on yedi kullanım yerinin hepsi üç genişlikte ölçüldü** (1440 / 390 / 320, yayın kopyası). Ayrıntı aşağıda Test Sonuçları'nda.
- **Alt görev 3 — ölçülen rakam CSS yorumuna yazıldı** (eski/yeni duraklar, üç genişliğin aralığı, token yasağının gerekçesi, rampanın ton/doygunluk/açıklık izi).
- **Görsel doğrulama:** altı vurgunun A/B karesi 1440 px'te alındı (`/`'de dekoratif Hero zemini, Chaos, canvas ve canvas-soft bölümler + `/gecis`). Vurgu hâlâ gradyan bir rampa ve siyah başlıktan net ayrışıyor; karar noktası ("koyulaştırma vurguyu öldürürse kullanıcıya sor") **ateşlemedi**.

**Sorunlar:**
- **Kapsam tabanı `BEKLENEN_GRADYAN = 19` düşmedi**: hiçbir gradyan span'i kaldırılmadı, yalnız renkleri değişti. Altı tabanın hiçbirine dokunulmadı.
- **Yayın kopyasının tazelik kontrolü ilk denemede boş döndü.** `grep '/_next/static/css/'` hiçbir şey bulmadı — Next 16 stil parçasını `static/chunks/` altına koyuyor ve kural yayınlanan HTML'e hiç girmiyor. Doğru ayırt edici parça adı + derlenmiş kuralın metni; hafızaya yazıldı.

**Kararlar:**
- **Düzeltme TOKEN'a değil SINIFA yapıldı.** Gerekçe ölçüldü: `--color-sage-br` otuzu aşkın yerde **koyu** zeminde kullanılıyor (`Button`, `Icon`, `Footer`, `FinalCta` bandı, `Solution`, `FounderProgram`) ve orada parlaklığı doğru; iki inline gradyan vurgusu ondan besleniyor ve `p02` **8,92** / **9,84** ile geçiyor. Token koyulaştırılsaydı o iki kalem aşağı çekilirdi ve bugün geçen yüzeyler bozulurdu. Ölçümle teyit edildi: derlenmiş CSS'te `#94d08e` sayısı **6 → 6**.
- **0% durağı (`sage-deep`) değiştirilmedi** — zaten geçiyor (canvas 6,01 · canvas-soft 5,69) ve rampanın koyu ucu kısılırsa gradyan düzleşirdi.
- **Orta ve üst durak `@theme`'e token olarak EKLENMEDİ**, sınıfın içinde düz değer olarak duruyor. Gerekçe: bu iki değer yalnız bu gradyanın açık-zemin kısıtını karşılamak için var; token olsalardı koyu zeminde de kullanılmaya açılırlardı — bu task'ın ta kendisi o sınıfın bedeli.
- **Rampanın yönü korundu, yalnız açıklık aralığı sıkıştırıldı:** ton 117→116→115 (eski 117→116→114,5), doygunluk 28→36→42 (eski 28→31→41), açıklık 33→37→41 (eski 33→57→69). Yani vurgu "sage ailesi içinde kalır" kısıtı ölçülebilir biçimde sağlandı.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşün maliyeti yok; bıraktığı bir sözleşme/ad/şema yok, iki CSS değeri ve gerekçesi kendi yorumunda duruyor.

**Kalan İşler:** yok.

**Dosya Değişiklikleri:**
- `src/app/globals.css` → `.text-gradient-sage`'in 55% ve 100% durakları düz değere çekildi (`#41813d`, `#44943d`); üstüne ölçülmüş gerekçe yorumu. `@theme` bloğuna **dokunulmadı**.
- `_dev/docs/STYLE-GUIDE.md` → "Gradyan metin vurgusu" kuralı + "marka rengi iki zeminde farklı hüküm taşıyorsa düzeltme kullanım sınıfına iner" genel kuralı.
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` → yalnız CSS değişen turda 3100 tazeliğinin nasıl ölçüldüğü (yeni dosya açılmadı, index'e satır eklenmedi).
- `_dev/BULGULAR.md` → Gelen Kutusu'na bir satır (320 px'te üst üste binen katman).

**Test Sonuçları:**
- **Kapı — `a11y.mjs`, 3100'e karşı 16 rota @1440×900, 69 sn:** `TOPLAM SORUN` **26 → 9**, çıkış **1**. `GRADYAN METİN: 19 ölçüldü (taban 19) · 17 eşik altı → 0 eşik altı`. Düşen tam **17** ve bu turun ölçülmüş listesinin tamamı. Kapsam tabanlarının hiçbiri oynamadı: 16 rota · 105 ekran adımı · 1835 eleman · gradyan taban 19 · başlık **316/1** · kovalar yapışkan 151 · görünmez 43 · ekran dışı 0 · **kalan 0**. Kalan 9 kapsam dışı: `/gecis`'in 6 kalemi (TASK-3.13 kapsamıyor, Gelen Kutusu'nda) · `/`'deki desenli zemin 4,06 (B-032 kalem 4 → TASK-3.12) · 404'ün dev rakamı ve başlık atlaması (TASK-3.13).
- **Kalem kalem (p02, yayın kopyası) — 17 kalemin hepsi:**
  - **@1440: 1,63-1,74 → 3,43-3,65.** `tek platformda` 1,63→**3,43** · `dağınıklık`/`abartısız`/`aynı üründe` (×2)/`kendi ekranından` (×2) 1,64→**3,46** · `tek ürün` 1,71→**3,60** · `nasıl yönetileceğini`/`Kademe yok.`/`taşınma`/`ürün aynı`/`neyi sormalı` 1,74→**3,65** · `biz yapıyoruz`/`işletme değişir`/`sürpriz yok`/`tamamı` 1,74→**3,65**.
  - **@390: 1,57-1,74 → 3,30-3,65** (eşik altı 17 → **0**).
  - **@320: 1,57-1,74 → 3,30-3,65** (eşik altı 17 → **0**).
  - En kötü değer üç genişlikte de Hero'daki `tek platformda` (dekoratif zemin): **3,43 @1440 · 3,30 @390 · 3,30 @320**; eşikten payı %10.
- **Negatif/kontrol grubu:** aynı kapı, aynı hedef, yalnız duraklar eski hâlindeyken **17 eşik altı** basıyordu (üç genişlikte de ölçüldü) — yani dalın bu sınıfı gerçekten gördüğü, yeşili bakmamaktan değil düzelmekten aldığı ayrıca kanıtlandı. Kapının kendi yeşil/kırmızı ayakları TASK-3.03'te sınanmıştı; bu task kapı üretmiyor.
- **Enjekte ölçüm ↔ gerçek derleme:** aday duraklar önce `page.addStyleTag` ile enjekte edilip ölçüldü, sonra kaynağa yazılıp 3100 tazelendi ve yeniden ölçüldü — **birebir aynı** (`tek platformda` 3,43 / 3,43; kümenin tamamı 3,43-3,65). TASK-3.10'un kurduğu yöntemin sadakati ikinci kez doğrulandı.
- **Regresyon — kaynağına dokunulmayan komşu yüzeyler, gerçek derlemeye karşı, önce/sonra BİREBİR AYNI:** `FinalCta` h2 **4,62 · 4,62 · 4,68** · paragraf ("Demoyu biz planlıyoruz…", T10'un tam opak yaptığı satır) **5,59** · alt satır ("15 gün ücretsiz deneme", T10'un `/80`'i) **5,52-5,57** · ("Kredi kartı istemiyoruz") **5,88-5,89** · inline gradyan `Solution` **8,92** · inline gradyan `FounderProgram` **9,84**. T10'un uyardığı regresyon **doğmadı** çünkü token'a dokunulmadı.
- **Beş ölçüm:** `mobile-audit.mjs` 2 genişlik × 16 rota **285**, çıkış 1 — çizgiyle birebir (320: kırpma 19 · şerit 8 · kritik hedef 125/19; 390: kırpma 0 · şerit 8 · kritik hedef 125/19) · `font-guard.mjs` çıkış **0** (kümede 153 karakter, 16 sayfa, 85.129 karakter, kümede olmayan karakter yok) · `scan.mjs` `/` @1440 (17 kare, 15.139 px) ve `/gecis` @390 (10 kare, 8.420 px) **konsol temiz** · `npm test` **210 geçti + 2 atlandı** (iki env kapısı varsayılanda kapalı).
- **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` 2026-09-24T15:41:05.341Z → **16:13:21.594Z** · stil parçası `01cjvk5fnifi7.css` → **`3akz_pa--pbiq.css`** · derlenmiş kural `var(--color-sage) 55%, var(--color-sage-br) 100%` → **`#41813d 55%, #44943d 100%`** · parçada `#44943d` 0 → **1**, `#41813d` 0 → **1**, `#94d08e` **6 → 6** (token'a dokunulmadığının negatif tarafı).
- **Kapsam:** yayın kopyası (3100), `reducedMotion: reduce`, **etkileşimsiz hâl** (açılmamış sekme/akordeon dışarıda — B-015); yargı değeri `p02`. Gerçek ekran okuyucu ve gerçek cihaz bu kapsamın dışında.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-24

**Ne Yapıldı:**
- Açık zemindeki başlık vurgularının gradyanı AA'ya çekildi: en açık durak `#94d08e` (canvas-soft 1,64) → `#44943d` (3,46), orta durak `sage` → `#41813d`, koyu durak `sage-deep` olduğu gibi kaldı. Kapının gradyan dalı **17 eşik altı → 0**, `TOPLAM SORUN` **26 → 9**.

**Öğrenilenler:**
- **Bir marka renginin açık ve koyu zeminde farklı hükmü olabilir; o hâlde düzeltme token'a değil kullanım sınıfına iner.** `sage-br` açık zeminde 1,64 ile eşiği deliyor, koyu zeminde 8,92-9,84 ile rahat geçiyor — token koyulaştırılsaydı ikinci küme bozulurdu. Kural STYLE-GUIDE'a yazıldı.
- **Kısıt tek yönlü olunca "ne kadar parlak kalabilirim" bir tercih değil hesaptır:** eşiğin gerektirdiği en yüksek göreli parlaklık zeminden geri hesaplandı (en kötü ölçülen zeminde 0,267), gradyanın parlak ucu oraya oturtuldu ve aradaki durak rampanın ton/doygunluk izini koruyacak şekilde türetildi. Ramp aralığı daraldı ama yönü bozulmadı.
- **Yalnız CSS değişen turda tazelik ayırt edicisi HTML'de değil içerik-hash'li stil parçasındadır** — ve derleme 11 saniyede bitebilir, süre kanıt değildir. Hafızaya yazıldı.

---

**Oluşturulma:** 2026-09-23
