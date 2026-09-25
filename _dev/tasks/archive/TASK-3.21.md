# TASK-3.21: Geçiş görselleri erişilebilirlik ağacından düşer, dekoratif bantların alt metni boşalır

**Durum:** ✅ Tamamlandı
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md) · M2 kullanımı
**Feature:** F5.1 Ürün ekran görüntüsü hattı · F2.1/F2.2 sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.20 ✅

---

## Hedef

İki erişilebilirlik kalemini kapatmak:

1. **`opacity-0` çapraz geçiş görselleri erişilebilirlik ağacından düşmüyor.** `ProductStory`'de masaüstü `/` sayfasında 4 görsel, `/ozellikler`'de 3 görsel `opacity:0` hâlde duruyor ve `aria-hidden`/`inert` taşımıyor. Ekran okuyucu **beş ürün ekranının alt metnini arka arkaya** okuyor; `/`'da cockpit alt metni 3×, diğer dördü 2× tekrarlanıyor.
2. **Dekoratif bantlar betimleyici alt metin taşıyor.** En az üç kullanım saf dekoratif (`/gecis` bandı, `HowItWorks` bandı, segment kahramanı — `opacity-45` + koyu gradyan altında) ama betimleyici alt metni var. Alt sayımı: 72/72 öğede alt var, **boş alt sıfır** — QUALITY 7'nin *"dekoratif olanlar boş alt"* maddesi hiç uygulanmamış.

---

## Bağlam

B-046 kalem (3). Bu sınıf bugüne dek görünmedi çünkü kapı yalnız *"alt metni var mı"* diye soruyor; *"olmalı mı"* diye sormuyor.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (3)
- `_dev/QUALITY.md` — 7 Erişilebilirlik (dekoratif görsellerde boş alt)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.1 kabul kriteri (tüm görsellerde alt metni)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.1 kriterinin "dekoratif olan boş alt alır" ayağı

---

## Alt Görevler

- [x] **1. `opacity-0` görselleri ağaçtan düşür**
  - `aria-hidden` (ya da `inert`) eklenir; çapa `src/components/sections/ProductStory.tsx` (⚠️ `grep -n "opacity-0"` ile konumlan)
  - Aktif görsel ağaçta kalır — geçiş bittiğinde doğru görselin okunduğu doğrulanır

- [x] **2. Dekoratif bantların alt metnini boşalt**
  - `/gecis` bandı · `HowItWorks` bandı · segment kahramanı → `alt=""`
  - Ölçüt: görsel bilgi taşıyor mu, yoksa doku mu? Doku ise boş alt

- [x] **3. Tekrarlayan alt metinleri say**
  - Düzeltme sonrası `/` sayfasında her ürün ekranının alt metni **bir kez** okunmalı

---

## Etkilenen Dosyalar

```
src/components/sections/ProductStory.tsx   # opacity-0 görsellere aria-hidden
src/components/sections/HowItWorks.tsx     # dekoratif bant alt=""
src/app/gecis/page.tsx                     # dekoratif bant alt=""
src/app/segmentler/[slug]/page.tsx         # dekoratif kahraman alt=""
```

---

## Dikkat Noktaları

- **`a11y.mjs`'in "alt metni yok" kontrolü boş alt'ı hata saymamalı.** `alt=""` bilinçli bir beyandır; kapı `alt` **niteliğinin yokluğunu** arar, boş değeri değil. Kapı boş alt'ı hata sayıyorsa bu bir kapı hatasıdır ve burada düzeltilir.
- **`aria-hidden` kontrast ölçümünü de etkiler** — TASK-3.04'ün ölçümü `aria-hidden` öğeleri dışarıda bırakıyor; bu değişiklik ölçülen eleman sayısını düşürebilir. Düşüş **beklenen**dir ve kapsam eşiğini kırmamalı.
- **`inert` tarayıcı desteği:** `aria-hidden` daha güvenli; `inert` ayrıca odağı da keser ve geçiş görselleri odaklanabilir değil, yani `aria-hidden` yeterli.
- **Gerçek ekran okuyucu denemesi kapsam dışı** — doğrulama erişilebilirlik ağacı üzerinden yapılır (`page.accessibility.snapshot()` ya da eşdeğeri).
- **Segment kahramanına TASK-3.22 de dokunuyor** (LCP/`sizes`) ve o **bu task'tan sonra** koşuyor. İki değişiklik aynı `<Image>`'ın ayrı nitelikleridir (`alt` ↔ `sizes`/`priority`), çakışmazlar — ama TASK-3.22 iki yolundan birini (*"görseli CSS arka planına almak"*) seçerse eleman tümüyle kalkar ve buradaki `alt=""` düşer. O yolu seçerse TASK-3.22 bu kalemi kapanışta yeniden doğrular.

---

## Test Kriterleri

- [x] `/` ve `/ozellikler`'de erişilebilirlik ağacında yalnız **aktif** ürün ekranının alt metni görünüyor (öncesi: 5 ekran arka arkaya)
- [ ] `/` sayfasında hiçbir ürün ekranının alt metni tekrarlanmıyor (öncesi: cockpit 3×, diğerleri 2×) — **kısmen: `opacity-0` kaynaklı tekrar bitti (cockpit 2 → 1), üye telefonu 2× kaldı çünkü iki görsel de gerçekten görünür (Hero + Roller) — ayrı sınıf, `BULGULAR.md` → Gelen Kutusu. Öncesi de bayat çıktı: ölçülen cockpit 2×, diğerleri 1×**
- [x] Üç dekoratif bant `alt=""` taşıyor ve `a11y.mjs`'in "alt metni yok" kontrolü onları hata saymıyor
- [ ] `a11y.mjs` 16 rotada eşik altı 0, çıkış kodu 0; ölçülen eleman sayısı kapsam eşiğinin üstünde — **karşılanamaz ve bu turun işi değil: kapı 6 kalemle kırmızı ve altısı da `/gecis`'in adlandıran task'ı olmayan kontrast kalemleri. Ölçülebilir ayak karşılandı: bu turun eklediği kalem 0, taban birebir (6 → 6, çıkış 1 → 1), eleman 1834 ve altı kapsam tabanı oynamadı**
- [x] Bilgi taşıyan hiçbir görselin alt metni boşaltılmadı (liste task dokümanında gerekçeli)

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Kapsamdaki tüm test kriterleri karşılandı (ikisi kapsam dışı sebeple kısmi — gerekçe yukarıda ve Oturum Kaydı'nda)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ✅ Tamamlandı

**Yapılanlar:**

- **Alt görev 1 — çapraz geçiş yığınının etkin olmayan kareleri erişilebilirlik ağacından düştü.** `ProductStory.tsx`'te tek koşullu nitelik: `aria-hidden={i === active ? undefined : true}`. Etkin kare **bilinçle ağaçta bırakıldı** — hepsine vermek ürün turunu ekran okuyucuda tümüyle sessizleştirirdi.
- **Alt görev 2 — üç dekoratif kullanım (altı sayfa) `alt=""` aldı.** `HowItWorks.tsx` bandı · `gecis/page.tsx` bandı · `segmentler/[slug]/page.tsx` kahramanı (dört segment sayfasının hepsi). `src/content/` **hiç değişmedi** (`git diff -- src/content/` boş): boşaltma **çağrı yerine** ait, çünkü `seg.photo.alt` ve aynı fotoğrafın betimlemesi `/segmentler`'deki kartta — bir `<a>`'nın içinde, tam opaklıkta — bilgi taşımaya devam ediyor. T3.20'nin `sizes`'ı prop'a çevirmesiyle aynı desen.
- **Alt görev 3 — ürün ekranı alt metinlerinin tekrarı sayıldı** (aşağıda, "Devralınan iddianın çürütülmesi").

**Sorunlar:**

- **Kendi ölçüm betiğim uydurma bir slug'a bakıyordu ve bunu sessizce yeşil bıraktı.** İlk koşumda `/segmentler/reformer-pilates` yazmışım; gerçek slug `pilates-reformer`. Sayfa **HTTP 404** döndü, betik onu "0 görsel" diye ölçtü ve hiçbir uyarı basmadı — `memory/arastirma-konteynerinde-tarayici-olcumu.md`'nin adıyla uyardığı tuzak (*"bulamayan locator betiği yeşil bırakır"*). Çözüm: betiğe **pozitif kapı** eklendi — her rota `HTTP 200` **ve** tam bir `h1` döndürmeli, yoksa çıkış kodu 2 (`✓ pozitif kapı: 8/8`).
- **İkinci kez aynı sınıf:** `aria-hidden`'ın yerine oturduğunu doğrulayan ilk `grep` deseni (`aria-hidden="true"[^>]\{0,90\}product`) **0** verdi — çünkü `product` dizgesi `srcSet` içinde 90 karakterden sonra geliyor. Ham `<img>` etiketleri basılarak doğrulandı: 13 etiketin 4'ü `aria-hidden="true"` taşıyor, tam olarak `opacity-0` olanlar.
- **Ölçtüğüm ilk "dekoratiflik" ölçütü işe yaramadı ve bu ölçülerek anlaşıldı** — aşağıda.

**Kararlar:**

- **"Dekoratif mi" sorusunun ölçüsü PİKSEL KATKISI DEĞİL.** İlk kurduğum ölçüt, görselin kutusunun karesini görsel `visibility:hidden` iken alınan kareyle kıyaslamaktı. Ölçüm ölçütü **çürüttü**: zaten `alt=""` taşıyan `Benefits` bandı kutusunun **%99,89**'unu değiştiriyor (maks kanal farkı **251**) — yani ölçütün en yükseği, ama T3.18'in ölçerek verdiği karara göre dekoratif. Bu ölçüt "görünür mü"yü ölçer, "bilgi taşıyor mu"yu değil. Kayda geçti, kullanılmadı.
- **Kullanılan ölçüt dört ayaklı ve her ayağı ölçüldü** (3100, 1440×900, altı aday + üç kontrol):
  1. **Bağlantı/buton içinde mi** — evetse `alt` erişilebilir adın parçasıdır, boşaltılamaz. Altı adayın altısı da **hayır**; kontrol grubundaki segment **kartı** ise `EVET` (link metni *"Sabit kapasite, seans paketi, no-show / Reformer ve Pilates Stüdyoları…"*) → o yüzden dokunulmadı.
  2. **Üzerinde kendi DOM metni var mı** — HowItWorks bandında 1 (*"İlk hafta yanınızdayız…"*), segment kahramanında **11** (içerik yolu, `h1`, giriş, iki CTA) → bilgi metinde, görsel zemin. `/gecis` bandında **0**; orası saf atmosfer şeridi.
  3. **`alt`ın içerik kelimeleri sayfanın kendi metninde var mı** — en keskin ayırt edici. Ürün ekranı kontrolü: **10 kelimenin 8'i** (`alpfit`, `plus`, `rezervasyon`, `takvimi`, `antrenör`, `saat`, `bekleme`, `listesi`) → `alt` ürünün kendi sözlüğünü konuşuyor, bilgi taşıyor. Altı aday: **4-7 kelimenin 1-3'ü** ve eşleşenlerin hepsi sayfanın `h1`/başlığından gelen jenerik sözcükler (`stüdyo`, `grup`, `dersi`, `reformer`, `boks`, `crossfit`); eşleşmeyenler fotoğrafın **kendi görünümünü** anlatıyor (*"sıralı yataklar"*, *"pencereden gelen doğal ışık"*, *"asılı kum torbaları"*, *"loş ışıklı"*, *"sade ve aydınlık"*).
  4. **Varlığın cinsi** — altı adayın altısı `research/FOTOGRAF-KAYNAKLARI.txt`'te kayıtlı Pexels atmosfer fotoğrafı (dördünde kayıt açıkça *"Kişi yok, marka yok"* diyor); içlerinde metin, veri ya da ürün arayüzü yok. Karşı kutup `/product/*.webp`: ürün arayüzü yakalamaları ve `docs/CLAIMS.md`'nin *"anlatmak yerine göstermek"* dediği kanıt yüzeyi — **hiçbirine dokunulmadı**.
- **`inert` değil `aria-hidden`** — görsel odaklanabilir değil, odağı kesmeye gerek yok (task dokümanının kendi tespiti, ölçümle çelişmedi).
- **CLAIMS uyumu:** tabloya dokunulmadı ve dokunulması gerekmedi. Boşaltılan altı `alt` hiçbir yetenek/ürün iddiası taşımıyordu (ölçüt 3'ün sayıları); bilgi taşıyan `alt`ların hepsi (`src/content/shots.ts` yedi kayıt, `segments.ts` dört kayıt) **birebir yerinde**. `docs/DECISIONS.md`'ye eklendi: **Hayır** — geri dönüşün maliyeti yok, tek dosyada tek nitelik; ölçüt ve gerekçeler kod yorumlarında + burada.
- **`a11y.mjs`'e dokunulmadı.** Task dokümanı *"kapı boş alt'ı hata sayıyorsa bu bir kapı hatasıdır ve burada düzeltilir"* diyordu; ölçüldü ki **kapı zaten doğru**: kontrol `!img.hasAttribute("alt")`, yani niteliğin **yokluğunu** arıyor. 16 rotanın 16'sında `alt'sız img: 0` ve negatif kontrol dedektörün kör olmadığını gösterdi (bir `alt=""` öğesinin niteliği canlı DOM'da silinince sayım **0 → 1**).

**Devralınan iddianın çürütülmesi (B-046 kalem 3'ün sayıları bayat çıktı):**

- Atom *"`/` sayfasında cockpit alt metni 3×, diğer dördü 2× tekrarlanıyor"* diyordu. **Erişilebilirlik ağacında ölçülen (3100 @1440, düzeltmeden önce):** cockpit **2×** · üye telefonu **2×** · takvim/grup/finans/raporlar **1×**. Atomun sayımı HTML'deki `<img>` sayımı olmalı — ürün turunun **mobil kart** kopyaları masaüstünde `display:none` ve ağaçta **hiç görünmüyor** (19 `<img>` → 13 ağaç düğümü; eksilen 6 = 5 gizli kart + 1 zaten `alt=""` olan Benefits bandı).
- Atom *"`/ozellikler`'de 3 görsel `opacity:0`"* diyordu; ölçülen **4** (beş adımın etkin olmayanı).
- **Kalan iki tekrarın ikisi de bu task'ın sınıfından değil:** `/`'de üye telefonu alt metni iki kez okunuyor ve **iki görsel de gerçekten görünür** (Hero'nun bindirme telefonu 156×330 + Roller'in etkin sekmesi 244×516); 390 px'te cockpit da aynı sebeple iki kez görünür (Hero + ürün turunun mobil kartı). `opacity-0` sınıfı değil, kapsam dışı → `BULGULAR.md` → Gelen Kutusu.
- Atomun *"72/72 öğede alt var, boş alt sıfır"* sayımı da bayattı: TASK-3.18'den beri **1** boş alt vardı (Benefits bandı).

**Kalan İşler:** yok.

**Dosya Değişiklikleri:**

- `src/components/sections/ProductStory.tsx` → yapışkan yığındaki `<Image>`'a koşullu `aria-hidden`; gerekçe ve ölçüm yoruma yazıldı (+20 satır, 0 silme).
- `src/components/sections/HowItWorks.tsx` → bant `alt=""`; dört ayaklı ölçütün bu yerdeki sayıları yoruma yazıldı.
- `src/app/gecis/page.tsx` → bant `alt=""`; aynı biçimde.
- `src/app/segmentler/[slug]/page.tsx` → kahraman `alt=""` (dört segment sayfası); `seg.photo.alt`'ın `/segmentler` kartında neden korunduğu yoruma yazıldı.
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` → F2.1/F2.2 kabul kriterine *"dekoratif olan boş alt alır"* ayağı, ölçütüyle.
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` → kalem (3) Çözüm Kaydı.
- `_dev/BULGULAR.md`, `_dev/DURUM.md`, `_dev/phases/PHASE-3.md`, `_dev/MEMORY.md`, `_dev/memory/urun-iddiasi-capa-dogrulamasi.md` → kayıt.

**Test Sonuçları:**

Kapsam: yargı **yayın kopyasına (3100)** ait; `hareket azaltma: reduce`; erişilebilirlik ağacı **CDP `Accessibility.getFullAXTree`** ile okundu (`page.accessibility.snapshot()` değil — tam ağaç `ignored` düğümleri de gösterir, "ignored olarak bile yok" ancak böyle ölçülür). Bu task **kapı üretmiyor**, "ürettiğin kapıyı sına" adımı düşer — yine de `a11y.mjs`'in boş-alt davranışı için bozuk-girdi kontrolü koşuldu. `scan.mjs` **3000'e (geliştirme) sabit bakar**, o satırın kapsamı budur.

- **3100 tazelendi ve pozitif + negatif kontrolle doğrulandı.** `lastmod` **2026-09-24T23:20:40Z → 2026-09-25T00:02:02Z**. Pozitif: `/` HTML'inde `alt=""` **1 → 2**, `/gecis` **0 → 1**, `/segmentler/pilates-reformer` **0 → 1**; ham `<img>` etiketleri okundu, `opacity-0` taşıyan **4** karenin **4'ü de** `aria-hidden="true"` aldı, etkin kare (`opacity-100`) **almadı**, mobil kartların 5'i de almadı. Negatif-değişim: *"Bir stüdyoda daire şeklinde yapılan grup dersi"* `/`'de **1 → 0**. Değişmemesi gerekenler: *"Sade ve aydınlık bir stüdyo iç mekânı"* `/`'de **1** (SegmentsGrid kartı) ve *"Sıralı reformer yatakları…"* **1** — ikisi de korundu.
- **ERİŞİLEBİLİRLİK AĞACI — önce/sonra (8 görsel taşıyan rota, hepsi HTTP 200 + tek h1):** AX'te `image` rolü **28 → 14**. `/` **13 → 8** · `/ozellikler` **6 → 2** · `/gecis` **1 → 0** · dört segment sayfası **1 → 0** (her biri). `<img>` sayısı **39 → 39** (hiçbir eleman kalkmadı), `alt` niteliği yok **0 → 0**, `alt=""` **1 → 7**, `aria-hidden` altağacındaki `<img>` **0 → 8**.
- **"ignored olarak bile var mı" — HAYIR.** Düşen düğümlerin hiçbiri `ignored` olarak da listelenmiyor: ölçüm `ignored 0` basıyor ve ad sayımında anahtar hiç görünmüyor (`/gecis` ve dört segment sayfasında ad sayımı tam olarak `{}`). Emsal TASK-3.13'ün 404 dev rakamıydı, aynı davranış ikinci kez ölçüldü — ve bu turda **iki mekanizma için ayrı ayrı**: `aria-hidden` (ürün turu yığını) ve `alt=""` (altı dekoratif kullanım).
- **ETKİN KARE DOĞRU OKUNUYOR — 6 kaydırma durağı × 2 rota × 2 genişlik.** @1440 `/`: `%0 → takvim · %15 → takvim · %35 → grup · %55 → finans · %75 → raporlar · %95 → raporlar`; her durakta AX'teki ürün turu düğümü **tam bir tane** ve DOM'da görünür olanla **birebir aynı**. @1440 `/ozellikler`: her durakta `[uyeTelefon, etkin adım]` = **2** düğüm (düzeltmeden önce her durakta 6 olurdu). @390: yapışkan sütun `display:none`, beş mobil kartın beşi görünür ve AX listesi DOM'un görünür listesiyle birebir — **mobil hiç etkilenmedi**.
- **HER `alt`IN ÖNCE/SONRA HÂLİ:** `HowItWorks` bandı *"Bir stüdyoda daire şeklinde yapılan grup dersi"* → `""` · `/gecis` bandı *"Sade ve aydınlık bir stüdyo iç mekânı"* → `""` · segment kahramanı ×4 *"Sıralı reformer yatakları, pencereden gelen doğal ışık"* / *"Boş bir boks salonunda asılı kum torbaları"* / *"Halter çekişi, loş ışıklı bir CrossFit salonu"* / *"Sade ve aydınlık bir stüdyo iç mekânı"* → `""`. **Dokunulmayanlar** (bilgi taşıdığı ölçüldü): `shots.ts`'in yedi ürün ekranı alt metni (Hero cockpit + Hero üye telefonu + Roller etkin sekmesi + ürün turunun etkin karesi + beş mobil kart) ve `SegmentsGrid`'in dört kart alt metni (link içinde, tam opaklıkta).
- **"DEKORATİF" İDDİASININ ÖLÇÜMÜ** (yukarıda Kararlar'da dört ayak): etkin opaklık — `/gecis` bandı **0,80**, segment kahramanı **0,45** ve üstüne `from-ink-deep/92 via-/78 to-/45` gradyan; HowItWorks bandı 1 ama üstünde `from-ink-deep/92 via-/45` gradyan + kendi `<p>`si. Reddedilen ölçüt (piksel katkısı) ve onu çürüten kontrol: Benefits bandı %99,89 / maks 251.
- ⚠️ **MOBİL KAPI YEŞİLDİ, YEŞİL KALDI:** `mobile-audit.mjs` 2 genişlik × 16 rota — `TOPLAM SORUN` **0 → 0**, çıkış **0 → 0**, `✓ KAPI YEŞİL`. kırpılmış metin **0** · şerit ihlali **0** · kritik dokunma hedefi **305 ölçüldü / 0 eşik altı / 0 benzersiz** · gezinme **333 / 261** (raporlanır) · yatay kaydırma **yok** · taşan eleman **0**.
- **`a11y.mjs` birebir:** **6 sorun · çıkış 1** — altısı da `/gecis`'in adlandıran task'ı olmayan kontrast kalemleri (`01`/`02`/`03` `p02` 1,21 · *"Elle tutulan kayıtlar…"* 3,25 · `1` 3,49 · `2` 4,23), taban ölçümünde de **tam bu altı**. `alt'sız img: 0` 16 rotanın 16'sında. `ölçülemeyen` yapışkan borcu **151** · görünmez **43** · kalan **0**.
- **ALTI KAPSAM TABANININ HİÇBİRİ OYNAMADI ve hiçbiri elle değiştirilmedi:** rota **16** · adım **105** · a11y ölçülen eleman **1834** · gradyan metin **19** (taban 19) · görünür başlık **316** (taban 316) · mobil eleman **6253** · metin elemanı **2054** (taban 2054) · kritik hedef **305** (taban 305) · kaydırılabilir kap **5** (taban 5) · dokunma hedefi **638**. Beklenen sonuç: `aria-hidden` yalnız metin taşıyan elemanı kapsamdan çıkarır (`piksel-kontrast.mjs:367`) ve görselde metin yok; `mobile-audit`'in `aria-hidden` ölçütü de yalnız `rc.right < 0` ile birlikte ateşler (`:204`, `:337`), yani `inset-0` duran kare muafiyete girmez.
- **`font-guard`: çıkış 0, 153 karakter kümesi, 16 sayfa, 85.129 karakter** — birebir. Beklenen: `alt` metni `body.innerText`'e girmez.
- **`perf` (3100):** `/` masaüstü **111 KB / TTFB 5 ms / FCP 84 / LCP 84 ms / CLS 0,005 / 35 istek / DOM 1491 / img 19**, mobil **111 KB / LCP 68 ms / CLS 0 / 24 istek / DOM 1488 / img 19** — T3.20'nin kaydıyla birebir (LCP 80 → 84 ms ölçüm gürültüsü; T3.19'da 96 ms'ti). M6 çizgisi 144 KB / 96 ms, pay **33 KB**. `/segmentler/pilates-reformer` masaüstü **182 KB / avif 87 KB / LCP 40 ms**, mobil **125 KB / avif 29 KB** — kahramanın 87 KB'ı B-046 kalem 6'nın bilinçle açık satırı, bu tur ona dokunmadı. Görsel preload tek profilde **6** (T3.20'nin 4 profilli toplamı 24 ile tutarlı: 6×4).
- **`scan.mjs` (3000, geliştirme) 5 kombinde konsol temiz:** `/` @1440 (18 kare, sayfa **15405 px**) · `/` @390 (20 kare, **25872 px**) · `/gecis` @1440 (6 kare, 5191 px) · `/segmentler/pilates-reformer` @1440 (7 kare, 5687 px) · `/ozellikler` @1440 (9 kare, 7720 px). ⚠️ 15405 ve 25872, TASK-3.19'un kaydettiği `/` sayfa boyunun **birebir aynısı** — bağımsız bir betikten gelen "hiçbir şey oynamadı" teyidi.
- **GÖRÜNÜŞ — NE DEĞİŞTİ: hiçbir şey.** A/B aynı derlemede kuruldu ve yalnız iki nitelik değişti: canlı DOM'da `alt` eski metnine geri konup `aria-hidden` söküldü (kaynağa dokunulmadı), iki kare arasındaki fark ölçüldü. **12 kombinde (6 hedef × 2 genişlik) 12'si de 0 farklı piksel, maks kanal farkı 0**; sayfa boyu 12 kombinde birebir (`/` 15405 · `/ozellikler` 7720 / 12687 · `/gecis` 5191 / 8436 · reformer 5687 / 9328 · boks 5615 / 9230) ve kutu ölçüleri birebir (bant 544×224 · 576×192 · kahraman 1440×623). ⚠️ 390 px'te iki bant `hidden lg:block` olduğu için hiç çizilmiyor — o iki satır yozlaşmış hâldir, anlamlı ölçüm @1440'takidir.
- **BELİRLENİMLİLİK:** aynı hâlin karesi iki kez alındı → 12 kombinde **0 farklı piksel**; erişilebilirlik ağacı ölçümü iki kez koşuldu → iki çıktı **konteyner adı dışında birebir aynı** (`diff` 0 satır).
- **NEGATİF KONTROL (dedektör kör mü):** `/`'de bozulmadan `alt` niteliği yok **0** · `alt=""` **2** → boş alt hata sayılmıyor. Bir `alt=""` öğesinin **niteliği** canlı DOM'da silinince sayım **0 → 1** → `a11y.mjs`'in kontrolü **kör değil**.
- **Yerel batarya:** `npm test` (web konteyneri) **219 geçti + 2 atlandı** · `tsc --noEmit` **0** · `lint` **30 problem** (25 hata / 5 uyarı) — birebir taban; yeni kalem yok, dört dosyanın hiçbiri listede değil (`ProductStory.tsx:106 'shot' kullanılmıyor` uyarısı `acdf43c`'de de vardı, benim satırım değil).
- **YEŞİLLE KAPANMAYACAK SENARYOLAR:** (1) `a11y.mjs` **çıkış 1** ve öyle kalıyor — altı kalem `/gecis`'in kontrast kalemleri, adlandıran task yok, bu task'ın kapsamı dışı. Task dokümanının *"a11y 16 rotada eşik altı 0, çıkış 0"* kriteri bu yüzden **karşılanamaz** ve karşılanması bu turun işi değildi; ölçülebilir ayak — *"bu turun eklediği kalem 0, taban birebir korundu"* — karşılandı. (2) *"`/` sayfasında hiçbir ürün ekranının alt metni tekrarlanmıyor"* kriteri **kısmen** karşılandı: `opacity-0` kaynaklı tekrarların hepsi bitti (cockpit 2 → 1), ama üye telefonu **2×** kaldı çünkü iki görsel de gerçekten görünür — bu ayrı bir sınıf ve `BULGULAR.md`'ye düştü. (3) **Gerçek ekran okuyucu denemesi yapılmadı** (task dokümanının kendi kapsam kararı); doğrulama erişilebilirlik ağacı üzerinden yapıldı.

---

**Oluşturulma:** 2026-09-23
