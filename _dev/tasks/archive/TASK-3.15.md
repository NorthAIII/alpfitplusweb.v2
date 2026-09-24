# TASK-3.15: Roller bölümü — sekme şeridi 320 px'te sığar, görsel eşlemesi düzelir

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler · M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F2.1 Ana sayfa · F5.1 Ürün ekran görüntüsü hattı
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.07 ✅

---

## Hedef

`Roles` bölümünün iki kusurunu kapatmak:

1. **320 px'te tek kart pencereden geniş.** Sekme şeridi `flex gap-2 overflow-x-auto`, kartlar `shrink-0` ve genişlikleri sabit `[360, 360, 360, 358]`. 320 px'te bir rol kartı **hiçbir zaman tümüyle görünmüyor**.
2. **Görsel eşlemesi bir satır kaymış.** Antrenör sekmesi rezervasyon takvimini (`SHOTS.takvim`), diyetisyen sekmesi antrenör ekranını (`SHOTS.antrenor`) gösteriyor. Antrenör satırı **bir hatadır ve düzeltilir** — doğru içerik üretilen kümede zaten var.

---

## Bağlam

B-033'ün ikinci kalemi + B-046'nın ölçülmüş eşleme tablosu:

| Sekme | Bugün gösterdiği | Olması gereken |
|---|---|---|
| Üye | `SHOTS.uyeTelefon` | ✓ doğru |
| **Antrenör** | `SHOTS.takvim` (masaüstü takvimi) | **`SHOTS.antrenor`** |
| **Diyetisyen** | `SHOTS.antrenor` | karşılığı **yok** |
| Yönetim | `SHOTS.cockpit` | ✓ doğru |

⚠️ **Araştırma bu iddiayı genişletti:** "antrenör satırı tek satırlık bir hatadır ve doğru ekran kümede var" **eksik** çıktı. `SHOTS.antrenor` görseli **1200×866 — bir masaüstü ekranı**, antrenör rolü ise `device: "mobil"`. Yani tek satırlık düzeltmeden sonra da telefon çerçevesinde masaüstü panosu durur. Ürünün demo destesi tarandı: `.phone` yüzeyi üç dosyada var (üye ×2, patron ×1) — **antrenör telefonu yok.**

Kullanıcı kararı: antrenör ve diyetisyen telefon ekranları ürün deposuna eklenecek (TASK-3.24, koşullu). **Bu task onları beklemez** — eşleme hatasını ve şerit genişliğini şimdi kapatır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (2) ve triyaj kaydı
- `_dev/bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md` — şerit kalemi
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (antrenör ve diyetisyen ekranları)
- `_dev/docs/CLAIMS.md` — diyetisyen modülü ürünün tek "gerçek fark"ı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/BULGULAR.md` — B-046'nın diyetisyen ayağı **açık kalır** (kapandı işaretlenmez)

---

## Alt Görevler

- [x] **1. Şerit genişliği**
  - Kart genişlikleri 320 px pencereye sığacak biçimde esnetilir (sabit `[360,360,360,358]` yerine pencereye bağlı bir tavan)
  - Ölçüt: kaydırılabilir kapta **tek bir çocuk** kabın görünür genişliğinden geniş olmamalı (TASK-3.07'nin kurduğu kapı bunu ölçüyor)

- [x] **2. Antrenör satırını düzelt**
  - Çapa: `src/components/sections/Roles.tsx` → `VISUAL` eşlemesi (⚠️ `grep -n "VISUAL"` ile konumlan)
  - `antrenor: SHOTS.antrenor`

- [x] **3. Çerçeve ↔ görsel uyumsuzluğunu dürüstçe çöz**
  - `SHOTS.antrenor` masaüstü ekranı olduğu için `PhoneFrame`'e sığmıyor. İki yol: (a) rolün `device` değerini görselin gerçeğine çekmek (geçici, TASK-3.24 gelince geri alınır), (b) telefon ekranı gelene kadar `BrowserFrame` kullanmak
  - Seçilen yol koda yorum olarak yazılır ve **geçici olduğu** belirtilir

- [x] **4. Diyetisyen sekmesinin alt metnini sekmeyle tutarlı yap**
  - Bugün `shots.ts` alt metni *"Alpfit Plus antrenör detay ekranı…"* diyor; ekran okuyucu "Diyetisyen" sekmesinde "antrenör ekranı" duyuyor
  - Vekil kullanılmaya devam edeceği için gerekçe koda yazılır ve alt metin sekmeyle çelişmez hâle getirilir

---

## Etkilenen Dosyalar

```
src/components/sections/Roles.tsx   # şerit genişliği, VISUAL eşlemesi, çerçeve seçimi
src/content/shots.ts                # diyetisyen vekilinin alt metni
```

---

## Dikkat Noktaları

- **Diyetisyen ayağı "bilinçli tercih" olarak KAYDEDİLMEZ.** Karar açık: kayıt yazmak sonraki denetimlere yanlışlıkla "kapandı" sinyali verir. Bulgu kanvasta açık durur.
- **İddia sınırı:** alt metin ürünün gerçekten gösterdiğini anlatmalı — gösterilmeyen bir ekranı anlatan alt metin `docs/CLAIMS.md`'nin "kanıtsız iddia" sınırına girer.
- **Kapı açılan katmanları ölçmüyor** (B-015, kapsam dışı): ilk boyada yalnız aktif sekmenin görseli render ediliyor, bu yüzden eşleme hatası bugüne dek görünmedi. Doğrulama **elle sekme tıklanarak** yapılır.
- **`next/image` `src`'i URL-kodlar** — `img[src*="/product/"]` seçicisi hiç eşleşmez (ölçülmüş tuzak). Doğrulama betiği yazarsan eşleşme sayısını bas.
- **Metin `src/content/`'te kalır** — alt metin düzeltmesi de orada yapılır, bileşende değil.

---

## Test Kriterleri

- [x] `mobile-audit.mjs` 320 px'te Roller şeridi ihlali vermiyor; 320 px'te bir rol kartı tümüyle görünüyor (ekran görüntüsü)
- [x] Antrenör sekmesi antrenör ekranını gösteriyor (elle tıklanarak doğrulandı)
- [x] Antrenör sekmesindeki görsel okunabilir ölçekte — telefon çerçevesinde 244×129 px'lik masaüstü panosu kalmadı
- [x] Diyetisyen sekmesinin alt metni sekmeyle çelişmiyor
- [x] Dört sekmenin hepsi 320 · 390 · 1440 px'te tıklanıp görselleri gözlendi
- [x] `docker compose exec web npm test` geçiyor (210 + 2 atlandı) — ⚠️ kriterin ikinci yarısı **düştü**: alt metin `src/content/shots.ts`'te değişmedi, çünkü çelişki alt metni yeniden yazarak değil **vekil görseli değiştirerek** kapandı (aşağıda, Kararlar)
- [x] Beş ölçüm regresyon çizgisini koruyor

---

## Karar Noktaları

- **Antrenör sekmesinin çerçevesi:** rolün `device` değerini geçici olarak `web`e çekmek vs. `BrowserFrame` kullanmak → ikisi de geçici; TASK-3.24 gelirse geri alınır. Seçim task oturumunda yapılır, gerekçe koda yazılır.

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
- **Şerit genişliği (alt görev 1).** `Roles.tsx`'teki sekme butonuna kap-bağımlı bir tavan kondu: `max-w-[calc(100%_-_3rem)] lg:max-w-none`. Yüzde, esnek kabın **içerik kutusuna** göre çözülür — yani kapının kendi ölçütüyle (`çocuk genişliği ≤ kabın clientWidth'i`) **aynı referans**. Şerit `overflow-x-auto` kaldı, yani `BEKLENEN_SERIT = 5` tabanı **oynamadı** (koşumda `5 kaydırılabilir kap (taban 5)` basıldı).
- **Eşleme (alt görev 2).** `VISUAL.antrenor`: `SHOTS.takvim` → **`SHOTS.antrenor`**.
- **Çerçeve (alt görev 3).** `isPhone` artık `role.device`'tan değil **görselin kendi oranından** türüyor (`shot.height > shot.width`). Dört satırın üçünde sonuç birebir aynı; değişen tek satır zaten uyumsuz olan antrenördür.
- **Diyetisyen alt metni (alt görev 4).** Çelişki, alt metni yeniden yazarak değil **vekil görseli değiştirerek** kapandı: `VISUAL.diyetisyen` `SHOTS.antrenor` → **`SHOTS.grup`**. `src/content/shots.ts` hiç değişmedi.

**Sorunlar:**
- **Devralınan test kriteri çürüktü (T7 ölçmüştü, bu tur doğrulandı):** *"390 px'te ihlal vermiyor"* yanlış — şeridin `clientWidth`'i 390 px penceresinde **350**, kartlar 360/360/360/358, yani her iki genişlikte de **4'er kart** eksik görünüyordu. Ölçülen ihlal 320'de 4 + 390'da 4 = **8**, iki rotada (`/` ve `/ozellikler`) = **16**. Düzeltme pencereye değil kaba bağlandı.
- **Antrenör satırını düzeltmek yeni bir kusur doğuruyordu:** `antrenor` ve `diyetisyen` aynı kareyi gösterecekti — hem de görüntünün kendi başlığı **"Antrenör Detayı"** yazdığı için "Diyetisyen" sekmesinin altında gözle de çelişerek. Vekil `SHOTS.grup`'a taşındı.

**Kararlar:**
- **Tavan `calc(100% - 3rem)`, `100%` değil.** İki aday 2 rota × 7 genişlikte yan yana koşuldu. `max-w-full` yalnız ~400 px'in altında ısırır ve 412 px'i hiç değiştirmez — **ama ilk kart görünür genişliği tam doldurur, kalan üç rol için hiçbir ipucu kalmaz** (sw=952, cw=280: sonraki kart ekranın tamamen dışında). `calc(100% - 3rem)` her dar genişlikte **40 px'lik bir sonraki-kart payı** bırakır; bedeli 412 px'te kartın 360 → 324'e inmesidir (orada ihlal yoktu). Bedel ölçüldü: 412 px'te de şerit ve bölüm yüksekliği **birebir aynı**, fark yalnız şeridin kendi bandında ve yalnız x ≥ 317'de.
- **Çerçeve rolün `device`'ından değil görselin oranından türer.** Karar Noktaları iki yol sunuyordu; (a) rolün `device`'ını `web`e çekmek **reddedildi**: `faq.ts`, `gecis.ts` ve bu bölümün kendi lead cümlesi *"üye ve antrenör kendi telefonundan"* diyor ve `docs/CLAIMS.md` *"antrenör mobil uygulaması var"*ı söylenebilir sayıyor — `device`i değiştirmek çerçeveyi düzeltirken **siteye yanlış bir cümle söyletirdi** (ve planın saymadığı `src/content/product.ts`'e dokunurdu). (b) seçildi, ama tek satırlık `BrowserFrame` sabitlemesi yerine **orana bağlandı**: TASK-3.24 dikey bir antrenör yakalaması eklediği gün koşul kendiliğinden `PhoneFrame`e döner, geri alınacak geçici kod kalmaz.
- **Diyetisyen vekili `SHOTS.grup`.** Destedeki masaüstü yakalamalarının **hepsi aynı YÖNETİM panelidir** (ölçüldü — üst solda "YÖNETİM", altta "Zehra G. · Şube Müdürü"); hiçbiri diyetisyen ekranı değil, yani hangi vekil seçilirse seçilsin B-046'nın diyetisyen ayağı açık kalır. Ölçüt "hangisi daha az çelişir" oldu: `antrenor` **başka bir rolü adıyla** gösterir (ve komşu sekmeyle aynı kare), `takvim`in sütunları antrenör adlarıyla doludur, `raporlar`ın kartlarından biri "Antrenör Performansı"dır, `finans`/`cockpit` salt yönetim. `grup`un başlığı başka bir rolü adlandırmaz ve alt metni görüntüde gerçekten duranı anlatır — vekil, olmadığı bir şey olduğunu iddia etmez.
- **`src/content/shots.ts`'e dokunulmadı.** Plan alt metni orada değiştirmeyi öngörüyordu; alt metin **paylaşılan** bir künyedir ve artık antrenör sekmesi de onu kullanıyor, yani oradaki tek metni "diyetisyene uygun" hâle getirmek antrenör sekmesini bozardı. Vekili değiştirmek aynı sonucu tek satırda ve **iki sekmeyi de doğru tutarak** verdi.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü maliyetli bir sözleşme doğmadı (sınıf değişimi ve eşleme satırı izsiz geri alınabilir); kural STYLE-GUIDE'a, vekil gerekçesi koda yazıldı.

**Kalan İşler:**
- B-046'nın **diyetisyen ayağı açık** — kapanışı ürün deposuna diyetisyen ekranının eklenmesine bağlı (TASK-3.24, koşullu). Bu tur onu kapandı işaretlemedi.
- Antrenör sekmesi bugün bir **yönetim paneli** ekranı gösteriyor (görüntünün kendi kromu "YÖNETİM" der) — TASK-3.24'ün kapsamı bu yüzden "dikey bir yakalama" değil **antrenörün kendi yüzeyi** olmalı. Kayıt `BULGULAR.md` → Gelen Kutusu.

**Dosya Değişiklikleri:**
- `src/components/sections/Roles.tsx` → sekme butonuna kap-bağımlı `max-w` tavanı + `lg:max-w-none`; `VISUAL.antrenor` → `SHOTS.antrenor`; `VISUAL.diyetisyen` → `SHOTS.grup`; `isPhone` görselin oranından türüyor. Üç karar da gerekçesiyle koda yazıldı.

**Test Sonuçları:**
- **`mobile-audit.mjs`** (3100, 2 genişlik × 16 rota, 55 sn): `TOPLAM SORUN` **266 → 250**, çıkış **1**. Şerit ihlali **@320 8 → 0 · @390 8 → 0**. Kalan 250'nin tamamı kritik dokunma hedefi (125/19 benzersiz, her iki genişlikte) → **TASK-3.17**; kapsam dışı.
- **Negatif kontrol:** düzeltmeden **önce** aynı kapı aynı hedefte **266** bastı ve sekiz `✗ [şerit]` satırının hepsini adıyla listeledi (`<button> 360px > kabın görünür genişliği 280px`).
- **Şeridin bağımsız haritası** (kapının ölçütü birebir tekrarlandı, 16 rota × 2 genişlik): ihlalin **tamamı** `Roles` şeridinde ve **iki rotada** — `/` ve `/ozellikler`, her birinde 4 kart. Diğer üç kaydırılabilir kap temiz: `/fiyat`'ın iki fiyat tablosu (704 > 280 ve 608 > 224) **iki boyutlu içerik muafiyetine** düşüyor, `/demo`'nun `<textarea>`'sı zaten sığıyor.
- **Kapsam tabanları oynamadı:** 16 rota · 6290 eleman · **2038 metin elemanı (taban 2038)** · 622 dokunma hedefi · **5 kaydırılabilir kap (taban 5)** · 289 kritik hedef. `BEKLENEN_SERIT` **değişmedi** — şerit `overflow-x-auto` olarak kaldığı için kap sayısı sabit.
- **Kova sızıntısı:** @390 muafiyet kovaları **birebir** (görsel gizli 0 · hareketli şerit 18 · kaydırılabilir 38 · dikey 0). @320'de `kaydırılabilir` **40 → 38** — beklenen yön: şeritte artık kırpılmayan iki düğüm kovadan çıktı; toplam tam olarak **−16** düştü, yani başka kovaya kalem taşınmadı.
- **Aday karşılaştırması (enjekte, 2 rota × 7 genişlik):** taban kart `[360,360,360,358]` her genişlikte · `max-w-full` → 320:280 · 390:350 · **412: değişmez** · 640+: değişmez · `calc(100%-3rem)` → 320:232 · 390:302 · 412:324 · 640+: değişmez. **Üç adayda da şerit yüksekliği 118, bölüm yüksekliği ve sayfa yüksekliği birebir aynı** — hiçbir aday dikey yerleşimi kaydırmıyor.
- **Enjekte ↔ gerçek derleme birebir:** derlemeden sonra ölçülen kart genişlikleri 320:232 · 390:302 · 412:324 · 640/768:360,360,360,358 · 1024:419,52 · 1440:478,39 — enjekte turuyla aynı.
- **Görünüş (T13'ün yöntemi — "önce" DOM'da geri alınarak):** `[aria-label="Roller"] > button{max-width:none}` enjekte edilip ikinci tam-sayfa karesi alındı; geri alma **pozitif kontrolle** doğrulandı (kart genişlikleri `[360,360,360,358]`e döndü). Sonuç: **≥ 640 px'te 6 kombinde 0 farklı piksel** (`/` @640 · @768 · @1024 · @1440, `/ozellikler` @768 · @1440 — toplam **88,97 M piksel**), sayfa boyları birebir. **< 640 px'te fark tek bir 118 px'lik banda kapalı** (şeridin kendi yüksekliği): `/` @320 7.359 px (y 5123-5240), @390 6.501 px (y 4926-5043), @412 5.726 px (y **4841-4958, x 317-391** — yani kartın yalnız sağ ucu), `/ozellikler` @320 ve @390 aynı rakamlar. Altında hiçbir satır kaymadı.
- **Dört sekme TIKLANARAK doğrulandı** (B-015: kapı açılan katmanı ölçmez) — 320 · 390 · 1440 px'te, `next/image`'in URL-kodladığı `src` çözülerek ve eşleşme sayısı basılarak (her turda 4 sekme / 1 figure / 1 img):
  - Üye → `PhoneFrame` · `/product/uye-telefon.webp` · kutu 212×448 / 212×448 / 244×515
  - **Antrenör → `BrowserFrame` · `/product/antrenor.webp` · kutu 280×202 / 350×253 / 562×405** (B-046'nın ölçtüğü **244×129 telefon çerçevesi kalmadı**; 1440 px'te alan **7,2×** büyüdü)
  - **Diyetisyen → `BrowserFrame` · `/product/grup.webp`** · alt metni *"grup dersleri ekranı: kontenjan, katılımcı listesi ve yoklama"* — "antrenör" kelimesi **geçmiyor**, sekmeyle çelişmiyor
  - Yönetim → `BrowserFrame` · `/product/cockpit.webp` (değişmedi)
- **320 px'te bir rol kartı tümüyle görünüyor** (ekran görüntüsüyle doğrulandı): ilk kart 232 ≤ cw 280, **sonraki karttan 40 px görünür**; 390'da 302 ≤ 350, yine 40 px.
- **Regresyon:** `a11y.mjs` **6 sorun**, çıkış 1 (değişmedi — 16 rota / 105 adım / **1834 eleman**, gradyan **19/0 (taban 19)**, başlık **316 (taban 316)** / 0 atlama) · `font-guard.mjs` çıkış **0** (16 sayfa / **85.129 karakter**, çizgiyle birebir) · `perf.mjs` `/` masaüstü **141 KB / LCP 84 ms / CLS 0,005**, mobil **132 KB / LCP 60 ms / CLS 0** (M6 çizgisi 144 KB / 96 ms — altında) · `scan.mjs` `/` @320 (20 kare) ve `/ozellikler` @390 (16 kare) **konsol temiz** · `npm test` **210 geçti + 2 atlandı** · `tsc --noEmit` **0** · `lint` **30 problem, yeni yok**.
- **3100 tazelendi ve pozitif + negatif kontrolle doğrulandı:** `lastmod` 17:52:09Z → **18:33:19Z**; stil parçası `13wm7yb1fyspy.css` → **`1c4v579qv3_6_.css`** (bu turda **beklenen** — yeni yardımcı sınıf doğdu), derlenmiş CSS'te `max-width:calc(100% - 3rem)` ve `@media (min-width:64rem)` içinde `lg\:max-w-none{max-width:none}` var; sınıf `/` ve `/ozellikler` HTML'inde **4'er kez** (dört sekme). **Negatif taraf:** dokunulmayan T14 izi `sm:whitespace-nowrap` `/`'de **17 → 17**.
- **Kapsam:** yargı yayın kopyasına (3100) ait; `reducedMotion: reduce`; kapı yalnız 320/390 ölçer — 412 · 640 · 768 · 1024 · 1440 bu turda **elle** ölçüldü. Sekme eşlemesi hiçbir otomatik kapının kapsamında değil, **elle tıklanarak** doğrulandı.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-24

**Ne Yapıldı:**
- Roller şeridinin kart tavanı **kaba** bağlandı; mobil kapının son şerit ihlali kapandı (266 → 250, şerit 8+8 → 0+0) ve 320/390 px'te bir rol kartı artık tümüyle görünüyor, ardından 40 px'lik kaydırma ipucuyla.
- Bir satır kaymış görsel eşlemesi düzeldi: antrenör sekmesi antrenör ekranını gösteriyor ve çerçeve artık görselin oranından türüyor — telefon çerçevesindeki 244×129'luk masaüstü panosu bitti.
- Diyetisyen vekili, sekmesiyle çelişmeyen bir ekrana taşındı; B-046'nın diyetisyen ayağı bilinçle **açık** bırakıldı.

**Öğrenilenler:**
- **Kaydırılabilir bir şeritte "sığıyor" ölçüsü penceredir sanılıyor; değil — kabın `clientWidth`'idir.** 390 px'lik pencerede kabın görünür genişliği 350; 360 px'lik kart orada da eksik görünüyordu ve devralınan test kriteri bunu "390'da sorun yok" diye yazmıştı.
- **Tavanı `100%` yapmak kapıyı yeşile çevirir ama işlevi bozar:** ilk kart görünür alanı tam doldurunca kalan üç sekmenin varlığına dair hiçbir ipucu kalmıyor. Kapı geçmek tasarımı doğrulamaz.
- **Bir kusuru düzeltmek komşusunu bozabilir:** antrenör satırı doğru ekrana bağlanınca diyetisyen vekili komşusuyla aynı kareye düşüyordu — hem de başlığı "Antrenör Detayı" yazan bir kareye.
- **Demo destesindeki masaüstü yakalamalarının hepsi yönetim panelidir.** "Doğru ekran kümede zaten var" iddiası bu yüzden yalnız yarı doğru: içerik var, ama rolün kendi yüzeyi yok.

---

**Oluşturulma:** 2026-09-23
