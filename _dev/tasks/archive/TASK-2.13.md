# TASK-2.13: Ürün görsellerinde gerçek ad ve olmayan özellikler temizlenir (B-018)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M5 — Görsel Varlık Hattı (`modules/M5-Gorsel-Varlik-Hatti.md`)
**Feature:** F5.1: Ürün ekran görüntüsü hattı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok

---

## Hedef

Yayındaki ürün görsellerinde duran üç sızıntıyı temizlik tablosundan kapatmak: ana sayfada render edilen **"Gizem Ö."** (gerçek kişi adı), yedi görselin altısındaki **"Kampanyalar"** menü girdisi ve `raporlar.webp`'teki **"Yenileme & Churn"** kartı — ikisi de ürünün bugün taşımadığı, `/ozellikler`'in "Yolda" kolonunda duran özellikler.

Task, hat yeniden koşturulduğunda çıktı görsellerinde üç kalem de görünmediğinde tamamlanmış sayılır. **Denetimin kendisi bu task'ta güçlenmiyor** — TASK-2.14 ve TASK-2.15.

---

## Bağlam

`legal.ts:302` ziyaretçiye *"Gerçek bir kulübün veya kişinin verisi gösterilmemektedir"* diyor; `grup.webp`'teki "Box · **Gizem Ö.** · 17:00 · 60 dk" bu beyanı çürütüyor ve görsel `ProductStory.tsx:52` ile **ana sayfada** render ediliyor (audit-product 2026-09-22, gözle doğrulandı).

Temizlik tablosu adı **biliyor** — `screen-cleanup-v2.mjs:26-31` içinde `['Gizem Örge','Yasemin U.']` eşlemesi var; kaçıran şey kalıp: eşleme **tam ada** göre yazılmış, metinde çıplak ilk ad ya da kısaltılmış hâl geçiyor.

Kaynak çapalar: `../Alpfit.v1/demo/grup.html:209` ("Gizem Ö."), `raporlar.html:242` (`<h4>Yenileme &amp; Churn</h4>`), "Kampanyalar" altı kaynak HTML'de birer geçiş, **hepsi sol menüde `<a>` olarak** — `uye-telefon` çıktısı `takvim.html`'in `.phone` kökünden üretildiği için menüyü taşımaz.

`sube` ekranı hattan zaten düşürüldü (QUICK-001); o görselde duran kalemler (Simge & Gizem, ciro projeksiyonu) **kapalı**, ama tablo eşlemeleri ileride geri eklenme ihtimaline karşı yazılır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` — üç kalem, kaynak çapaları, 2026-09-22 yeniden ölçümü
- `_dev/bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md` — **tam sızıntı envanteri** (kapanış kapsamının ölçütü); bu fazda yalnız üç kalem kapsamda
- `_dev/phases/PHASE-2.md` → Dikkat Edilecekler → "Ad temizliğinde sıra tuzağı" ve "'Kampanyalar' ortak kabuktadır"
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.1 kabul kriterleri ve edge case'ler
- `research/lib/screen-cleanup-v2.mjs` · `research/lib/screen-cleanup.mjs` (v1 tablosu, **gövdesi düzenlenmez**) · `research/scripts/render-product.mjs`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/bulgular/B-018-*.md` — üç kalemin Çözüm Kaydı; atom **TASK-2.15'te kapanır** (kök neden denetimde)

---

## Alt Görevler

- [x] **1. Çıplak ilk ad ve kısaltılmış hâl eşlemeleri**
  - `screen-cleanup-v2.mjs`'e "Gizem Ö." ve "Simge & Gizem" sınıfını kapsayan eşlemeler eklenir
  - **Sıra kuralı:** `REPLACEMENTS` düz metin değişimidir — "Gizem" → "Yasemin" kuralı "Gizem Örge" kuralından **önce** koşarsa sonuç "Yasemin Örge" olur. Eşlemeler **en uzun önce** sıralanır (ya da sıralama üretim anında garanti edilir)
  - Avatar baş harfleri (`INITIALS`) eşlemeyle **senkron** kalır

- [x] **2. "Kampanyalar" ortak kabuk kuralı**
  - Menü girdisi ekran başına tekrarlanmak yerine **ortak kabuk kuralı** olarak yazılır (altı kaynakta birer geçiş, hepsi sol menüde `<a>`)
  - `uye-telefon` çıktısı menüyü taşımıyor — kural onu gereksiz yere hedeflemez

- [x] **3. "Yenileme & Churn" kartını düşür**
  - `raporlar` için `DROP_NODES` girdisi; çapa `raporlar.html:242`
  - Düşürmenin kırpma (`clipBelow: '.repgrid'`) ile etkileşimi kontrol edilir — kart kırpma dışındaysa da düşürmek denetimin gördüğü kütleyi temizler (mevcut `takvim` girdisinin gerekçesiyle aynı desen)

- [x] **4. Hattı yeniden koştur ve çıktıyı doğrula**
  - `docker compose --profile research run --rm research node scripts/render-product.mjs`
  - 7 `.webp` üretilir, denetim sızıntı bulmaz, çıktılar gözle kontrol edilir

---

## Etkilenen Dosyalar

```
research/lib/
└── screen-cleanup-v2.mjs      # eşlemeler, ortak kabuk kuralı, DROP_NODES — zaten var
public/product/*.webp          # betik çıktısı — ELLE DÜZENLENMEZ, yeniden üretilir
```

---

## Dikkat Noktaları

- **`public/product/` elle düzenlenmez** (`CLAUDE.md` → Dokunulmazlar). Görseller yalnız betikle üretilir.
- **v1'in tablosu (`screen-cleanup.mjs`) birebir korunur** — dosyanın kendi başlığı bunu söylüyor; eklemeler v2 uzantısına yazılır ve her satırın gerekçesi yanında durur.
- **Sıra tuzağı gerçek ve ölçülmüş** (yukarıda) — düşürme (`DROP_NODES`) değişimden **önce** koşar, o yüzden düşen düğümlerdeki adlar hiç görülmez; sıra yalnız `REPLACEMENTS` içinde sorundur.
- **Düşürülecek yol haritası kalemleri `src/content/`'ten beslenemez** — araştırma konteyneri `src/`'i görmüyor (ölçüldü). Kalemler `research/lib/` içinde **elle** tutulur; kaynaktan besleme bu fazda **açılmaz** (bilinçli, kayıt `phases/PHASE-2.md`).
- **Kapsam üç kalemdir.** B-044'ün avatar-ad uyumsuzlukları ve Hero'daki elle yazılmış "%78" kalemi **kanvasta kalır** (`phases/PHASE-2.md` → Kapsam Dışı).
- **`sube` geri eklenmez** — geri eklemenin koşulu denetimin üç dalının kapanmasıdır (`modules/M5-*.md` → F5.1 edge case); bu faz iki dalını açıyor, karar o gün verilir.
- Görsel değişirse sayfa ağırlığı ve LCP yeniden ölçülür (`perf.mjs`, üretim konteyneri ayakta olmalı).

---

## Test Kriterleri

- [x] Hat yeşil koştu: **7 `.webp`** üretildi, betik sıfır kodla çıktı, denetim sızıntı bildirmedi
- [x] `grup.webp`'te "Gizem Ö." **yok** (gözle ve metin denetimiyle); yerine gelen nötr ad avatar baş harfleriyle **tutarlı**
- [x] Yedi görselin hiçbirinde "Kampanyalar" menü girdisi yok (ekran ekran sayım dokümana)
- [x] `raporlar.webp`'te "Yenileme & Churn" kartı yok
- [x] Sıra tuzağı sınandı: tabloda hem tam ad hem çıplak ilk ad varken çıktıda "Yasemin Örge" gibi melez bir ad **oluşmuyor** (negatif kontrol)
- [x] `perf.mjs` ile ana sayfa ağırlığı ve LCP ölçüldü, başlangıç çizgisine göre regresyon yok (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar)
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `scan.mjs` `/` ve `/ozellikler` konsol temiz
- [x] `git status`: `public/product/` altında beklenen dosyalar değişmiş, beklenmeyen dosya yok

---

## Risk ve Geri Dönüş Planı

- **Ortak kabuk kuralı fazla düşürürse** (menü dışında aynı metin geçen bir yer) çıktı görselde eksik bölüm doğar → gözle kontrol bunu yakalar; kural ekran bazlı daraltılır.
- **Rollback:** tablo dosyası tek dosya; hat yeniden koşturularak önceki çıktı geri üretilir (görseller betikten doğar, git'ten geri almak yeterli değildir — **yeniden üret**).

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
- **Alt görev 1 — çıplak/kısaltılmış ad eşlemeleri.** `screen-cleanup-v2.mjs`'e üç satır: `['Gizem Ö.','Yasemin U.']` (grup.html:209,564 — ana sayfada render edilen kare) ve çıplak `['Gizem','Yasemin']` + `['Simge','Cüneyt']` (sube.html:481'deki "Simge & Gizem" sınıfı; ekran bugün üretilmiyor ama tablo geri eklenmeye hazır). Hedef adlar tam-ad eşlemeleriyle **aynı** seçildi, yoksa aynı kişi iki karede iki nötr ad alırdı. `INITIALS`'e satır **gerekmedi** — ölçüldü: `GÖ→YU` ve `SA→CV` zaten tabloda, grup.html:209'daki kartta ada bitişik avatar yok.
- **Alt görev 2 — "Kampanyalar" ortak kabuk kuralı.** Yeni export `SHELL_DROP_NODES = [['a.nav','Kampanyalar']]`; çağıran (`render-product.mjs`) onu her ekranın kendi listesinin **önüne** ekliyor. Ekran başına altı kez yazmak yerine tek kural — birini unutma sınıfı kapandı. `uye-telefon` de kapsanıyor (aynı `takvim.html` belgesinden üretiliyor; menü `.phone` kökünün dışında kaldığı için çıktı görüntü değişmiyor ama denetimin gördüğü kütle temizleniyor — v2'nin SMS kartı için kurduğu emsalin aynısı).
- **Alt görev 3 — "Yenileme & Churn" düşürüldü.** `raporlar: [['.repgrid .rep','Yenileme & Churn']]`. Seçici yapısal (`nth-child` değil). Kırpma etkileşimi kontrol edildi: `clipBelow: '.repgrid'` ve ızgara 6 → 5 karta indi, iki satır düzeni korundu, çıktı yüksekliği **değişmedi** (1200×519).
- **Dördüncü kalem — "Öğrenci Tutma" kartı düşürüldü (kapsam genişletildi, gerekçe aşağıda).** `antrenor: [...V1_DROP_NODES.antrenor, ['.detgrid .card','Öğrenci Tutma']]`. Ölü kalan izin satırı `AUDIT_ALLOW.antrenor`'dan v1'den **türetilerek** çıkarıldı (`.filter(...)` — kopya yazılmadı, v1'in gövdesine dokunulmadı).
- **Alt görev 4 — hat yeniden koşturuldu**, 7 `.webp` üretildi, çıkış kodu 0, denetim sızıntı bildirmedi; çıktılar `public/product/`e aktarıldı ve **yedisi de gözle okundu**.
- **Kapsam dışı ama zorunlu düzeltme — `shots.ts` alt metni** (ayrıntı → Sorunlar).

**Sorunlar:**
- **Devralınan alt metin ölçümle çürütüldü (asıl bulgu).** TASK-2.12 antrenör görselinin alt metnini *"aylık performans, **haftalık doluluk** ve **ciro kırılımı**"* diye yeniden yazmış ve o iki ifadeyi `tests/iddia-metinleri.test.ts`'te `toContain` ile **çivilemişti**. Ölçüldü: o iki kart bu görüntüde **zaten yok** — aynı hat onları **TASK-14.06'dan beri** düşürüyor (`DROP_NODES.antrenor`) ve gerekçesi ürünün kendi kodu (`trainer-performance.service.ts:7` "FİNANSAL CİRO DEĞİL", `attendance-count.ts:11` doluluk % kapsam dışı). Yani düzeltme bir karşılıksız iddiayı **ikisiyle** değiştirmiş, üstüne bir kapı ile sabitlemişti. Çözüm: alt metin görüntüde gerçekten duran iki yüzeye çekildi (*"aylık PT ders performansı ve öğrenci listesi"* — ikisinin de karşılığı `CAPABILITIES` → `simdi`/`antrenor-performansi`), ve kapı **elle yazılan listeden** hattın **kendi düşürme tablosundan türeyen** bir kurala çevrildi.
- **`SHOTS.antrenor`'ı Roller'in hangi sekmesi gösteriyor?** İlk tarayıcı ölçümü "Antrenör" sekmesini tıkladı ve görseli bulamadı; `Roles.tsx:14` → `diyetisyen: SHOTS.antrenor`. (Bu eşlemenin kendisi zaten `BULGULAR.md`'de bir `[audit-product SORU]` satırı — bu turda dokunulmadı.)
- **`next/image` src'i yeniden yazıyor.** `img[src*="/product/"]` seçicisi hiç eşleşmedi; gerçek src `/_next/image?url=%2Fproduct%2F…`. Sonda `decodeURIComponent` ile düzeltildi — aksi hâlde ölçüm **sessizce boş dönüp** "bulunamadı" diye okunacaktı (tur 9-10'un fail-open dersinin aynısı).

**Kararlar:**
- **Dördüncü kalem (Öğrenci Tutma kartı) bu task'a alındı.** Task dokümanı "kapsam üç kalemdir" diyor; kalem TASK-2.12'nin ölçümüyle sonradan doğdu ve üç yerden bu task'a işaret ediliyordu (DURUM Aktif Task notu, `shots.ts`'in kendi kod yorumu, `BULGULAR.md` Gelen Kutusu). Gerekçe: **aynı dosya, aynı mekanizma, aynı ızgara** — kart `Haftalık Doluluk`/`Ciro Kırılımı` ile tam aynı `.detgrid` içinde ve aynı sınıftan (ürünün karşılamadığı iddia); ayrı bir tura bırakmak hattı ikinci kez koşturmak demekti. B-044'ün kalemleri (avatar-ad uyumsuzluğu, "★ Şubede 1.", "Ekipte: Mar 2023", Hero'nun "%78"i) **alınmadı** — kapsam dışı kaydı `PHASE-2.md`'de.
- **Kapı elle listeden türetilene çevrildi.** `toContain("haftalık doluluk")` gibi bir iddia, korumaya çalıştığı şeyin ta kendisini bozabiliyor. Yeni kural: *alt metin, hattın o ekrandan düşürdüğü hiçbir kartı anamaz* — çapalar `research/lib/`ten okunuyor (`web` konteyneri deponun tamamını görüyor; araştırma konteyneri yalnız `research/`ü — bu yüzden bağ tek yönlü). Bu, fazın görsel denetim için seçtiği ilkenin ("tablo kaynağın gerçeğidir, regex bir tahmindir") metin tarafına uygulanmış hâli.
- docs/DECISIONS.md'ye eklendi: **Hayır** — ikisi de mevcut kararın içinde kalan icra tercihi; yeni sözleşme/şema/ad doğurmuyor ve geri dönüşü tablo satırı silmekten ibaret.

**Kalan İşler:** yok (bu task kapsamında).

**Son Yaklaşım:** Tamamlandı.

**Sonraki Adım Detayı:** TASK-2.14 — denetimin ad dalı regex yerine temizlik tablosundan beslenir.

**Dosya Değişiklikleri:**
- `research/lib/screen-cleanup-v2.mjs` → üç ad eşlemesi; yeni `SHELL_DROP_NODES` export'u; `DROP_NODES.antrenor` (v1'den türetilip dördüncü kart eklendi) ve yeni `DROP_NODES.raporlar`; `AUDIT_ALLOW.antrenor` ölü izin satırından arındırıldı (türetme)
- `research/scripts/render-product.mjs` → `SHELL_DROP_NODES` import'u; `dropList` artık kabuk + ekran-özel listelerin birleşimi
- `public/product/*.webp` → altı görsel yeniden üretildi (`uye-telefon.webp` **bayt bayt aynı** — menü `.phone` kökünün dışında). Toplam 275.172 → 264.962 B (**−10.210 B, %3,7**); boyutların hiçbiri değişmedi, yani `shots.ts` genişlik/yükseklik alanları aynen geçerli
- `src/content/shots.ts` → `antrenor.alt` düzeltildi (çürütülen iki ifade düştü); kod yorumu ölçümle yeniden yazıldı
- `tests/iddia-metinleri.test.ts` → TASK-2.12'nin elle yazılmış üç `toContain` iddiası kaldırıldı, yerine düşürme tablosundan **türeyen** dört senaryolu blok

**Test Sonuçları:**
- **`npm test` (web konteyneri): 163 geçti + 1 atlandı** (taban 160+1; net **+3** — bir yanlış senaryo silindi, dört yeni eklendi, yeni dosya açılmadı). `npx tsc --noEmit` **çıkış 0**.
- **Ürettiğim kapı dört sondayla sınandı** (dördünde de kaynak değil **girdi** bozuldu). Hat sondaları kopya tabloyu `-v` ile bağlayarak koştu ve çıktıyı ayrı bir dizine yazdı, yani depo dosyalarına hiç dokunulmadı; test sondaları için iki dosya yedeklendi ve `md5sum -c` + `diff -q` ile birebir geri yüklendi (9 dosya OK).
  - *bozuk girdi — düşürme kuralı kalkarsa:* `Öğrenci Tutma` düşürmesi kaldırıldı → hat `[antrenor] DENETİM BAŞARISIZ — ad sızıntısı: ["Öğrenci Tutma"]`, **çıkış 1**. Düşürmenin kendi kendini doğrulayan kapıya dönüştüğünün kanıtı.
  - *bozuk girdi — kabuk çapası körelirse:* çapa `Kampanyalarr` yapıldı → **ilk ekranda** `düğüm düşürme çapası tam eşleşmedi: a.nav ~ "Kampanyalarr" → 0 eşleşme`, **çıkış 1**. Kabuk kuralı fail-closed.
  - *bozuk girdi — alt metin kapısı:* TASK-2.12'nin tam alt metni geri yazıldı → **2 kırmızı**; yakalayan çapa `Doluluk` (mini-KPI düşürmesi), yani kapı tasarladığımdan bir kalem daha sıkı.
  - *boş kapsam:* düşürme tablosu boşaltıldı → **2 kırmızı**, yakalayan bekçiler `düşürme tablosu okunuyor (boş kapsam bekçisi)` ve `pozitif çapa: tablo bugün düşürdüğü üç kalemi adıyla taşıyor`. ⚠️ Asıl döngü (`yedi görselin alt metni…`) boş kapsamda **yeşil kaldı** — bakacak çapası olmadığı için; kontrol grubu olarak **silinmedi**, bekçinin neden gerekli olduğunun kanıtı odur.
  - Sonda sonrası batarya yeniden **163+1**, `tsc` 0.
- **Denetimin bugünkü kapsamı ölçüldü (`AUDIT_DRY=1`, üç düşürme birden kaldırılmış hâl): 3 kalemden 1'i görülüyor.** `Öğrenci Tutma` kırmızı; `Kampanyalar` (tek sözcük) ve `Yenileme & Churn` (`&` iki-tam-sözcük kalıbını bozuyor) **görünmez**. Yani bugün kapatılan iki kalemin arkasında kapı yok → TASK-2.15'in ölçülmüş gerekçesi. Kayıt B-018 + Gelen Kutusu.
- **Sıra tuzağı negatif kontrolü** (`order-probe`, üretimdeki sıralama algoritmasıyla): 7 gerçek kaynak dizgesinin 7'si doğru, melez ad (`Yasemin Örge` / `Cüneyt Aköz`) **0**. ⚠️ Sondanın kendisi kör olmasın diye **çapa sondası** kondu: `Gizem Örge` eşlemesi tablodan çıkarılınca sonda melezi görüyor (`"Yasemin Örge"`) — yani yeşil, bakmadığı için değil.
- **Hat:** 7 `.webp`, çıkış 0, "sızıntı yok". Düşürme sayımı **15** (kabuk 7 + ekran-özel 8): cockpit 1 · takvim 2 · finans 1 · antrenör 6 · raporlar 2 · grup 1 · üye-telefon 2 — yani kabuk kuralı **7/7** ekranda tam 1 düğüm buldu ve düşürdü (mekanik "Kampanyalar" sayımı budur; tam-bir-eşleşme sözleşmesi 0 ya da 2'de üretimi durdururdu).
- **Gözle doğrulama, yedi çıktının yedisi:** `grup` → "Box · **Yasemin U.** · 17:00 · 60 dk", nav temiz · `raporlar` → churn kartı yok, ızgara 5 kart · `antrenor` → Öğrenci Tutma kartı yok, kalan Aylık Performans + Öğrenciler · `cockpit`/`takvim`/`finans` → nav temiz, başka kayıp yok · `uye-telefon` → değişmemiş. "Gizem" hiçbir karede yok.
- **Serviste doğrulandı (3100, imaj HEAD'ten yeniden derlendi):** üç rota 200; `antrenor/raporlar/grup.webp` 200 ve bayt boyutları yeni dosyalarla birebir; çürütülen alt metin üç rotada **0**.
- **Tarayıcıda ölçüldü (3100, 1440×900 **ve** 390×844):** Roller → Diyetisyen sekmesi, `/product/antrenor.webp` alt metni birebir yeni metin, *"haftalık doluluk"* ve *"ciro kırılımı"* **false**, **iki yüzeyde de konsol temiz**. Bu ölçüm şarttı — `Roles` istemci bileşeni, alt metni ilk HTML'de hiç yok.
- **Ölçüm betikleri:** `a11y` 8 rota **TOPLAM SORUN 0** · `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir) · `font-guard` 16 sayfa / **81.118** karakter (taban birebir), kümede olmayan karakter yok · `scan` 390×844 konsol temiz (`/` 20 kare / 26.637 px · `/ozellikler` 16 kare / 12.676 px).
- **`perf` koşuldu** (görseller değiştiği için şarttı). Ana sayfa: masaüstü **143 KB** · LCP **84 ms** · CLS **0,004** · 35 istek · 18 görsel; mobil **133 KB** · LCP **60 ms** · CLS **0**. M6 başlangıç çizgisi masaüstü 144 KB / mobil 133 KB, LCP 96 ms, CLS 0–0,005 → **regresyon yok** (masaüstü 1 KB hafifledi, LCP 12 ms iyileşti).
- **`git status`:** yalnız beklenen dosyalar — `public/product/` altında **6** görsel (7.'si bayt bayt aynı olduğu için değişmedi), iki betik/tablo, `shots.ts`, test dosyası. Beklenmeyen dosya yok.

---

## Sonuç Özeti

B-018'in adıyla sayılan üç kalemi (ana sayfada render edilen **"Gizem Ö."**, yedi görselin altısındaki **"Kampanyalar"** menü girdisi, `raporlar.webp`'teki **"Yenileme & Churn"** kartı) ve TASK-2.12'nin ölçümüyle sonradan doğan dördüncü kalem (**"Öğrenci Tutma"** kartı) hattın temizlik tablosundan kapatıldı; yedi görsel yeniden üretildi, denetim sızıntı bulmadı, yedisi de gözle okundu. "Kampanyalar" ekran başına değil **ortak kabuk kuralı** olarak yazıldı ve 7/7 ekranda tam bir düğüm düşürdü.

İki yan kazanç ölçümden çıktı. Birincisi: TASK-2.12'nin yerine yazdığı alt metin (*"haftalık doluluk ve ciro kırılımı"*) **çürütüldü** — o iki kart bu görüntüde TASK-14.06'dan beri yok ve ikisi de ürünün kendi kodunda reddedilmiş kalemler; alt metin bir karşılıksız iddiayı ikisiyle değiştirip üstüne bir test ile sabitlemişti. Metin gerçekte duran iki yüzeye çekildi ve kapı elle yazılan listeden **hattın kendi düşürme tablosundan türeyen** bir kurala çevrildi. İkincisi: `AUDIT_ALLOW`'daki ölü izin satırının çıkarılması düşürmeyi **kendi kendini doğrulayan** bir kapıya dönüştürdü — kural kalkarsa üretim duruyor (sondayla kanıtlandı).

**Atom kapanmadı ve kapanmamalı:** kök neden denetimde. Boş-kapsam sondası rakamı verdi — bugün temizlenen üç kalemden denetim **yalnız 1'ini** görebiliyor; "Kampanyalar" ve "Yenileme & Churn" yapısal olarak görünmez. Ad dalı TASK-2.14'ün, iddia sözlüğü TASK-2.15'in işi; B-018 orada kapanır.

---

**Oluşturulma:** 2026-09-22
