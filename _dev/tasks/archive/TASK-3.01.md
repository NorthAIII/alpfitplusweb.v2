# TASK-3.01: Genişlik turu — 16 sayfa, beş genişlik, bölüm bölüm

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** Yok

---

## Hedef

Siteyi 320 / 390 / 412 / 768 / 1440 px genişliklerde, 16 sayfanın hepsinde bölüm bölüm gezip ziyaretçinin gerçekten gördüğü düzen kusurlarını toplamak. Çıkan kalemler devralınan bulgularla **tek düzeltme listesinde** birleşir. Tur bittiğinde her kalem üç kutudan birine düşmüş olur: devralınan bir bulgunun parçası · bu fazın kapsamına giren **yeni** kalem · kapsam dışı (kanvasa).

---

## Bağlam

Kapsam kararı (PHASE-3 → Alınan Kararlar): *"Keşif fazın başında, gerçek telefon fazın sonunda."* Turu başa almak düzeltme listesini eksiksiz yapar — sonraki düzeltme task'ları bu listeye göre boyutlanır. Bu bir **keşif ayağıdır**: bulduğu şey kalan task'ların doğruluğunu değiştirirse plan revizyonu rotası işler (aşağıda → Dikkat Noktaları).

Tur kendi ölçüm betiğini kurar; bu fazın kapıları (TASK-3.03 ve sonrası) henüz yazılmamıştır ve tur onları beklemez.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Kapsam Tartışması (tur eksenleri) + Araştırma Bulguları özeti
- `_dev/phases/PHASE-3-ARASTIRMA.md` — ölçülmüş tuzakların tam listesi ve kırpma dedektörünün muafiyet kuralı
- `_dev/docs/STYLE-GUIDE.md` — düzen tuzakları; bir kalemin "kusur mu tercih mi" olduğunu belirler
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — betiği nasıl koşturacağın, bind-mount ve kör-seçici tuzakları

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` — kapsam dışı çıkan kalemler (Gelen Kutusu ya da yeni atom)

---

## Alt Görevler

- [x] **1. Tur betiğini kur**
  - Betik scratchpad'e yazılır, araştırma konteynerine `-v` ile mount edilir (memory'deki desen)
  - Rota listesi ayakta olan siteden `/sitemap.xml` ile türetilir + `/olmayan-sayfa` elle eklenir → 16 rota
  - Genişlikler: 320 · 390 · 412 · 768 · 1440; sayfa `0,9 × viewport` adımlarla ekran ekran gezilir

- [x] **2. Her adımda ölç ve kaydet**
  - Yatay kaydırma (sayfa ve kap düzeyinde), kırpılan metin düğümü, ata kutusundan taşan çocuk
  - Üst üste binen / okunmaz öğe, bozulan ızgara, ekran dışına düşen kontrol
  - Her koşumda **kaç düğüm bulunduğu** basılır — bulamayan seçici betiği yeşil bırakır (ölçülmüş tuzak)

- [x] **3. Kalemleri sınıflandır**
  - Devralınan bulguya ait (B-032 · B-033 · B-022 · B-051 · B-057 · B-046) → o bulgunun altına not
  - Bu fazın kapsamına giren **yeni** kalem → düzeltme listesi
  - Kapsam dışı → `_dev/BULGULAR.md`

- [x] **4. Düzeltme listesini yaz**
  - Kalemler bu task dokümanının Sonuç Özeti'nde, sayfa/bölüm/genişlik ve ölçülen rakamla

---

## Etkilenen Dosyalar

```
(kod değişikliği yok — ölçüm turu)
scratchpad/                      # YENİ (geçici, repoya girmez)
_dev/tasks/TASK-3.01.md          # bulgu listesi
_dev/BULGULAR.md                 # kapsam dışı kalemler
```

---

## Dikkat Noktaları

- **Tur ölçer, düzeltmez.** Bulduğun bir kusuru bu oturumda çözmeye girişme — düzeltmelerin kendi task'ları var.
- **Bulamayan seçici betiği yeşil bırakır.** Üç ölçülmüş tuzak: aynı metin iki yerde · açık `role` niteliği rolü ezer · `next/image` `src`'i URL-kodlar. Her turda eşleşme sayısını yazdır.
- **Kırpma ölçümü muafiyetsiz kurulursa 59 sahte pozitif verir** (ölçüldü): kayan tanıtım şeridi ve yatay kaydırılabilir kaplar bilerek kırpılır. Kırpan ata `overflow-x: auto|scroll` ise ya da ata zincirinde çalışan bir animasyon varsa kalem muaf sayılır ve **ayrı sayılır**.
- **Roller sekme şeridi kırpma dedektörüne görünmez** — şerit kaydırılabilir olduğu için muafiyete düşer. Ayrı ölçüt: kaydırılabilir şeritte **tek bir öğe** pencereden genişse kart hiçbir zaman tümüyle görünmez.
- **Plan revizyonu rotası:** Tur, kalan task'ların doğruluğunu değiştiren bir bulgu üretirse (yeni bir düzeltme sınıfı, ya da planlanmış bir düzeltmenin dayanağını çürüten ölçüm) task'ı yazma — bu ayak ✅ kapanır, arşive gider, DURUM Adım'ı `plan`'a çekilir ve `plan-phase` revizyon modu devralır. Gerekçe bu dokümanın Oturum Kaydı'na yazılır.
- **Hedef:** geliştirme sunucusu (3000) yeterlidir; bu tur yayın kopyasına bağlı değildir (o kural kapılar için geçerli).

---

## Test Kriterleri

- [x] 16 rotanın hepsi beş genişlikte gezildi; çıktı gezilen rota ve adım sayısını yazıyor
- [x] Her ölçüm turu bulduğu düğüm sayısını basıyor (sıfır bulan seçici sessiz geçmiyor)
- [x] Kırpma ölçümü muafiyetli koşuldu; muaf sayılan kalemler ayrı sayıda raporlandı
- [x] Bulunan her kalem üç kutudan birine düştü (devralınan / yeni-kapsam-içi / kapsam dışı) ve kapsam dışı olanlar `BULGULAR.md`'ye yazıldı
- [x] B-033'ün ölçülmüş rakamları (320 px'te 19 kırpılmış düğüm, 390 px'te 0) bu turda yeniden üretildi ya da sapma gerekçesiyle kaydedildi

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Sonuç Özeti — düzeltme listesi

Tur **80 kombinde (16 rota × 5 genişlik) 881 ekran** gezdi. Hedef geliştirme sunucusu (3000), hareket azaltma altında (geometri deterministik otursun diye; yatay yerleşimi değiştirmez).

**Sayfa yatay kaydırması 80 kombinin hiçbirinde yok** — yani kapının bugünkü tek geçme şartı sağlanıyor ve aşağıdaki kalemlerin hepsi o şartın altından geçiyor. B-033'ün "kapı temiz diyor" teşhisi bu turda bütün genişliklerde doğrulandı.

### A. Devralınan bulgular — hepsi birebir yeniden üretildi

| Bulgu | Devralınan rakam | Bu turda ölçülen | Sonuç |
|---|---|---|---|
| **B-033** kırpılmış metin | 320 px'te 19, 390 px'te 0 | **320 px'te 19, 390 px'te 0** | ✅ birebir |
| **B-033** kırpma yeri | Kurucu Programı + CTA etiketi | 19'un tamamı ana sayfada: Kurucu Programı (taşma 70 px) · "Ürün bugün nerede" paneli (42 px) · üç PERK kartı (50 px) | ✅ birebir |
| **B-022** ilk ekran boş | 390 px'te 6 sayfa | **390 px'te 6** (`/fiyat` · `/segmentler` · `/demo` + üç yasal) | ✅ birebir |
| **B-022** (araştırma eki) | 320 px'te 16'nın 13'ü | **320 px'te 13/16** | ✅ birebir |
| **B-032** kalem 1 soluk kart | `lg:opacity-45`, masaüstü | opaklık 0,45 — **yalnız 1440 px'te, 24 örnek**; 320/390/412'de hiç yok | ✅ doğrulandı |
| **B-051** tırtıklı ızgara | `Modules` 5 kart / 3 sütun | satır dizilimi **[3,2]**, 1440 px | ✅ doğrulandı (⚠️ kapsamı genişledi → C) |
| **B-033** ikinci kalem | Roller şeridinde tek kart pencereden geniş | 320 px'te 4 sekme **360/360/360/358 px** (pencere 320) | ✅ doğrulandı |
| **B-022** mekanizma 2 | yüzen düğme `scrollY > 480` | kaydırma sıfırdayken opaklık 0 — 768 ve 1440'ta 16 rotada | ✅ doğrulandı |

**Kırpma muafiyeti zorunluluğu yeniden ölçüldü:** 235 ham kırpma isabetinin **216'sı muaf** (132 `overflow-x:auto` kabı + 84 çalışan animasyon), yalnız **19'u gerçek**. Muafiyetsiz kurulan bir dedektör bu turda %92 sahte pozitif verirdi.

### B. Bu fazın kapsamına giren YENİ kalemler

1. **`/yazilim-secerken` fiyat serisinde iki etiket üst üste biniyor — 320 · 390 · 412 px.** Sage dolgulu "Alpfit Plus 1.800 ₺" rozeti (x48, y1147, 126×24) ile `absolute -bottom-8 left-0` konumlu soluk "990 ₺" ölçek etiketi (x48, y1151, 32×16) **aynı noktada** başlıyor; ekranda "99Alpfit Plus 1.800 ₺" gibi okunuyor. Ekran görüntüsüyle teyit edildi. 768/1440'ta yok. → **B-064** açıldı.
2. **İlk ekran boşluğu 768 px'te de sürüyor — 5/16 sayfa** (`/fiyat` · `/segmentler` + üç yasal). B-022 yalnız 390'ı, araştırma 320'yi ölçmüştü; **412 px = 6/16**, **768 px = 5/16**, 1440 px = 0/16. TASK-3.16'nın *düzeltmesi* bunu kapsıyor (Header'ın mobil kolu `lg:` altındaki her genişlikte görünür), ama *test kriterleri* yalnız 320/390 diyor — ölçüm 412 ve 768'i de kapsamalı.

### C. Kapsam dışı — kanvasa yazıldı

3. **B-051'in kalıbı ana sayfada değil, 6 sayfada ve 3 ayrı kod yerinde.** Tırtıklı [3,2] `lg:grid-cols-3` ızgarası: `Modules.tsx:34` (ana sayfa — B-051'in kaydı) · `src/app/segmentler/[slug]/page.tsx:172` (**4 segment sayfası**, satır içi, `IconBox + başlık + blurb` — STYLE-GUIDE'ın reddettiği kalıbın birebir kendisi) · `src/app/yazilim-secerken/page.tsx:198`. TASK-3.19 yalnız `Modules.tsx`'i kapsıyor; diğer ikisi ayrı kod yeri, faz kapsamı ("ana sayfanın iki kart ızgarası") dışında. → Gelen Kutusu.

### D. Sahte pozitif olduğu ölçülen kalemler — kapı bunları elemeli (TASK-3.07 girdisi)

Bu üçü ölçümde kırmızı verdi ve **elle ayıklandı**; TASK-3.07 aynı ölçütleri kurarken muafiyetlerini de kurmazsa kapı kalıcı kırmızı koşar:

- **`/fiyat`'ın iki fiyat tablosu** (`min-w-[44rem]` = 704 px, `min-w-[38rem]` = 608 px) `overflow-x-auto` içinde, 320/390/412'de pencereden geniş. "Kaydırılabilir şeritte tek öğe pencereden geniş" ölçütü (Roller şeridi için kurulan) **tabloyu da yakalar** — tablo bu kalıbın meşru hâlidir, muafiyet gerekir.
- **`Modules` kartlarının `fark=40 px` "erişilmez içerik"i** dekoratif parıltı lekesi: `span.pointer-events-none.absolute.-right-10.-top-10.size-28` — bilerek kart dışına konup `overflow-hidden` ile kırpılıyor. İçerik kaybı yok; `pointer-events-none` dekoratif mutlak konumlular muaf olmalı.
- **Bal küpü** (`input#website`, `sol=-9912`) beş genişlikte de "ekran dışı kontrol" veriyor — verify-plan'ın TASK-3.07'ye yazdığı muafiyetin gerekçesi bu turda yeniden üretildi.

Ayrıca **üst üste binme dedektörü 4 benzersiz aday üretti, 1'i gerçek** (B-064): kalan üçü satır-kutusu payından doğan sahte pozitif (Kaos bölümünün döndürülmüş açıklama etiketi ×2, ürün mockup'ındaki 9 px'lik mikro-tablo ×1) — ekran görüntüsüyle elendi. **Yapışkan/sabit katmanlar ölçüm dışı** tutuldu (B-063'ün borcu; turda 2-25 öğe/rota atlandı).

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- Tur betiği scratchpad'de yazıldı ve araştırma konteynerinde `-v` ile mount edilerek koşturuldu (repoya dosya düşmedi — `/audit`, `/work` dışında).
- Rota listesi ayakta olan siteden `/sitemap.xml` ile türetildi: **15 + `/olmayan-sayfa` = 16**, araştırmanın rakamıyla aynı.
- 80 kombin × ortalama 11 ekran = **881 adım** gezildi; her koşum taranan/görünür/metin düğümü/kırpan-atalı/kaydırılabilir kap/ızgara/yaprak/etkileşimli/yapışkan-atlandı sayılarını bastı.
- Sekiz ölçüm kovası: sayfa ve kap yatay kaydırması · kırpılmış metin (+muaf) · ekran dışı kontrol · şeritte pencereden geniş öğe · üst üste binme · tırtıklı ızgara · düşük opaklık · ilk ekran dönüşüm yüzeyi.
- Belirsiz çıkan dört kalem ayrı sondayla ayırt edildi; ikisi ekran görüntüsüyle karara bağlandı.

**Sorunlar:**
- *Ölçüm 80 kombinde ~2 saat sürüyordu*: her ekran adımında tüm DOM taranıyor ve `getComputedStyle` ile ata zinciri yürünüyordu. Hareket azaltma altında kırpma/taşma/ızgara geometrisi kaydırmadan bağımsız olduğu için **rota+genişlik başına tek tam-belge geçişine** alındı; stil sonuçları `Map`'te önbelleklendi, ata yürüyüşleri memoize edildi, üst üste binme taraması dikey sıralama + erken çıkışla O(n²)'den kurtarıldı. Ölçüldü: **~2 saat → 4 dakika**, `kirpilmis=19` sonucu değişmeden. Ekran ekran gezinti korundu (tembel içeriği uyandırır, adım sayar, her ekranda yatay kaydırmayı ölçer).
- *İlk koşumda üst üste binme 28 sahte pozitif verdi*: hepsi yapışkan Header'ın "Plus" yaprağıydı — ekran ekran ölçümde her adımda yeniden görünüyor. Yapışkan/sabit zincir ölçüm dışına alındı ve **ayrı sayıldı** (B-063'ün borcu; çözüm değil, kayıt).
- *Tırtıklı ızgara dedektörü ürün mockup'ındaki takvim hücrelerini yakaladı*: çocuk yüksekliği medyanı **≥ 48 px** eşiği kondu, mikro-ızgaralar elendi.

**Kararlar:**
- **Plan revizyonu rotası işletilmedi** — gerekçe: turun ölçtüğü **sekiz devralınan rakamın sekizi de birebir doğrulandı**, hiçbir planlanmış düzeltmenin dayanağı çürümedi. Yeni kalemlerin ikisi (B-064 ve 412/768 px ilk ekran) mevcut task'ların *doğruluğunu* değil *kapsamını/ölçüm eşiğini* etkiliyor; B-051'in genişlemesi ise fazın bilinçle çizdiği sınırın (ana sayfa) dışında. Kalan 24 task olduğu gibi geçerli.
- **Tur hareket azaltma altında koşuldu**: `.reveal` geçiş ortası değerleri geometriyi oynatmasın diye. Yatay yerleşim değişmiyor (reveal yalnız `translateY` + `opacity`), dört yeni eksen zaten TASK-3.02'nin konusu.
- **B-051'in genişlemesi kapsama alınmadı, kanvasa yazıldı**: kullanıcı üçüncü ızgarayı (ikon şeridi) bilinçle dışarıda bırakmıştı; aynı disiplinle segment sayfalarının satır-içi ızgaraları da faz sınırının dışında kalır. Kapsama alınması kullanıcı kararıdır.
- docs/DECISIONS.md'ye eklendi: Hayır (ölçüm turu; mimari/sözleşme kararı doğmadı).

**Dosya Değişiklikleri:**
- Kod değişikliği **yok** — tur ölçer, düzeltmez.
- `_dev/bulgular/B-064-yazilim-secerken-fiyat-etiketi-cakismasi.md` → YENİ (ölçülmüş çakışma, ekran görüntüsü çapalı)
- `_dev/BULGULAR.md` → Gelen Kutusu'na iki satır (B-051 genişlemesi, 412/768 px ilk ekran) + açık bulgu satırı (B-064)
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` → ekran-ekran DOM taramasının maliyeti ve doğru kurulumu (mevcut atomun kapsamında; index'e satır eklenmedi)

**Test Sonuçları:**
- **Tur turunun kendisi bu task'ın testidir** — 16 rota × 5 genişlik, 881 ekran, tamamlandı, çıkış kodu 0.
- **B-033 yeniden üretimi:** 320 px'te **19** kırpılmış düğüm, 390 px'te **0** — kayıtla birebir aynı.
- **B-022 yeniden üretimi:** 390 px'te ilk ekranı boş **6** sayfa, 320 px'te **13/16** — ikisi de kayıtla birebir aynı.
- **Sayfa yatay kaydırması:** 80/80 kombinde yok.
- **Kırpma muafiyeti:** 216 muaf (132 `overflow-x:auto` + 84 animasyon) / 19 gerçek — ayrı sayıldı ve raporlandı.
- **Kapsam:** ölçüm **geliştirme sunucusuna (3000)** karşı ve **hareket azaltma altında** koşuldu; yayın kopyası (3100), %200/%400 büyütme, JS kapalı ve yatay tutuş bu turun **dışındadır** (yayın kopyası kapıların kuralı — TASK-3.03; diğer üç eksen TASK-3.02).
- Ölçüm betikleri (`a11y`, `mobile-audit`, `font-guard`, `perf`, `scan`, `npm test`) **koşturulmadı** — bu tur kod değiştirmedi, regresyon yüzeyi yok.

---

**Oluşturulma:** 2026-09-23
