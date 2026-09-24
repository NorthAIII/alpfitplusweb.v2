# TASK-3.07: Kırpılmış taşma dedektörü, 320 px genişliği ve kaydırılabilir şerit ölçütü

**Durum:** ✅ Tamamlandı
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`mobile-audit.mjs`'e **320 px** genişliğini ve **kırpılmış taşma** dedektörünü eklemek. Bugün betik yalnız 390 px'te koşuyor ve kırpılan içeriği bilerek ayıklıyor (`clippedBy()`), yani B-033'ün 19 kesik metin düğümü kapının geçme şartını (*"yatay kaydırma: yok"*) sağlayarak sessizce geçiyor. Ayrıca kaydırılabilir şeritler için ikinci bir ölçüt kurulur: şeritteki **tek bir öğe** pencereden genişse o öğe hiçbir zaman tümüyle görünmez.

---

## Bağlam

B-030 kalem (d): `mobile-audit.mjs`'in dosya başlığı *"taşan metin"* ölçtüğünü söylüyor, kod ölçmüyor. B-033: 320 px'te `FounderProgram` bölümü 18 metin düğümü ve CTA etiketini kesiyor; 390 px'te 0. Kapsam kararı (PHASE-3): 320 px destek kapsamındadır ve **kapıya girer**.

Araştırma dedektörü prototipledi ve muafiyet kuralını ölçtü: **muafiyetsiz 59 sahte pozitif**. Muafiyetle sonuç: **320 px'te 19 gerçek kırpılmış düğüm, 390 px'te 0.** ⚠️ Prototip scratchpad'de kaldı ve **devralınamaz** — bu task onu yazar.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3-ARASTIRMA.md` — 5. yaklaşım (dedektör ve muafiyet) + Dikkat Edilecekler (Roller şeridi)
- `_dev/bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md` — ölçüm tabanı ve kök neden zinciri
- `_dev/bulgular/B-030-kapilar-kirmiziya-donemiyor.md` — kalem (d)
- `_dev/docs/STYLE-GUIDE.md` — Düzen Tuzakları #2 (`min-w-0`)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — Düzen Tuzakları #2'nin *"`mobile-audit.mjs` doğrular"* cümlesi artık gerçek; kuralın yanına ölçütü yaz

---

## Alt Görevler

- [x] **1. 320 px genişliğini ekle**
  - Betik 320 ve 390 px'te koşar; her genişlik ayrı raporlanır (bugünkü tek genişlik 390)

- [x] **2. Kırpılmış taşma dedektörü**
  - Ölçüt: metin taşıyan düğümün sınır kutusu, onu **kırpan** atasının kutusunun dışına taşıyor mu
  - Taşma miktarı (px) ve düğümün metni (ilk 40 karakter) raporlanır

- [x] **3. Muafiyet kuralı**
  - Kırpan ata `overflow-x: auto|scroll` ise **muaf**
  - Düğümün ata zincirinde **çalışan bir CSS animasyonu** varsa muaf (kayan tanıtım şeridi)
  - Muaf sayılanlar **ayrı bir sayıda** raporlanır, gizlenmez
  - **Bilinçli ekran-dışı yüzey muaf sayılır ve ayrı sayılır.** Bu, yeni kırpma dalının değil betiğin **bugünkü yatay taşma dalının** kalemidir (`overflow` dizisi): demo formundaki bal küpü `absolute left-[-9999px]` + `aria-hidden` ile ekran dışında duruyor ve üç düğümü (`div` · `label` · `input`) `rc.left < -1.5` koşulunu sağlayıp `overflowCount`'a giriyor. Ölçüt kalıp değil **beyan** olsun: `aria-hidden` taşıyan ve ekranın tamamen dışında (sağ kenarı 0'ın solunda) kalan altağaç muaftır

- [x] **4. Kaydırılabilir şerit ölçütü**
  - Kaydırılabilir bir kapta **tek bir çocuk öğe** kabın görünür genişliğinden genişse ihlal
  - Çapası: `Roles.tsx` sekme şeridi — kartlar `shrink-0` ve genişlikleri sabit `[360,360,360,358]`, 320 px'te tek kart pencereden geniş (`grep -n` ile yeniden konumlan)

- [x] **5. Eşikle ve dosya başlığını gerçeğe çek**
  - Gerçek kırpılmış düğüm > 0 → çıkış kodu 1
  - `mobile-audit.mjs:1` başlığı artık ölçtüğünü söylüyor; yazımı gerçekle hizala

---

## Etkilenen Dosyalar

```
research/scripts/mobile-audit.mjs   # 320 px, kırpma dedektörü, muafiyet, şerit ölçütü, eşik
```

---

## Dikkat Noktaları

- **Muafiyetsiz dedektör kurma.** Ölçüldü: 59 sahte pozitif. Muafiyet gizleme değil, **ayrı sayma**dır.
- **Roller şeridi kırpma dedektörüne görünmez** — kaydırılabilir olduğu için muafiyete düşer. Şerit ölçütü tam da bu boşluğu kapatır; ikisi ayrı sayılır.
- **Bu task'tan sonra kapı kırmızı dönecek** (320 px'te 19 düğüm + Roller şeridi). Düzeltmeler TASK-3.14 ve TASK-3.15'te.
- ⚠️ **Bal küpü muafiyeti olmadan kapı KALICI kırmızı kalır.** TASK-3.03 betiğe çıkış kodu verdi; bal küpünün üç düğümü `/demo`'da `TOPLAM SORUN`'a giriyor ve **hiçbir düzeltme task'ı onları kaldırmayacak** — kaldırmamalı da, tuzağın ekran dışında olması doğru tasarım. Muafiyet yazılmazsa fazın *"beş ölçüm yeşil"* hedefi ulaşılamaz hâle gelir (kaynak: `BULGULAR.md` → Gelen Kutusu, `[PHASE-1]` satırı; kod: `DemoForm.tsx:222-225`).
- **Dayanağı bozup kırmızıyı gör:** `FounderProgram`'ın ızgara çocuklarına geçici `min-w-0` verildiğinde 320 px'teki kırpılan düğüm sayısı **0'a** düşmeli (araştırmada ölçüldü: grid 370 → 280, kalan kırpma 0 px). Geri al, kırmızı geri gelsin.
- **Sayfayı gezmeden ölçme** — betik bugün sayfayı kaydırarak geziyor (tembel yüklenen içerik için); bu davranış korunur.
- **3100 bayat olabilir** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [x] Betik 320 ve 390 px'te koşuyor; her genişlik ayrı raporlanıyor
- [x] 320 px'te **19** gerçek kırpılmış metin düğümü, 390 px'te **0** ölçülüyor (araştırmanın rakamı yeniden üretildi; sapma varsa gerekçesiyle)
- [x] Muaf sayılan kalemler ayrı sayıda görünüyor (muafiyetsiz hâlin ≈ 59 sahte pozitif ürettiği kontrollü koşumda gözlendi)
- [x] Roller şeridi ölçütü 320 px'te ihlal veriyor — **390 px'te DE veriyor (kriterin bu yarısı ölçümle çürüdü):** şeridin görünür genişliği 390 px penceresinde 350 px, kartlar 360/360/360/358; ölçülen ihlal her iki genişlikte de 8
- [x] Geçici `min-w-0` deneyi kırmızıyı yeşile çeviriyor; geri alınınca kırmızı dönüyor
- [x] Gerçek kırpılmış düğüm varken çıkış kodu **1**
- [x] `/demo`'da bal küpünün üç düğümü taşma sayısından düştü ve muaf sayıda göründü; **bu sayfada başka taşma kalemi yoksa `/demo` temiz** (eski hâlde `overflowCount` 3'tü)
- [x] Muafiyet beyana bağlı, kalıba değil: deneysel olarak `aria-hidden` kaldırıldığında üç düğüm **geri sayılıyor**

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
- **320 px genişliği eklendi.** Betik artık `GENISLIKLER = [320, 390]` üzerinden koşuyor; her genişlik ayrı raporlanıyor **ve kendi kapsam eşiğini taşıyor** — birinin çökmesi ötekinin arkasına saklanamıyor.
- **Kırpılmış taşma dedektörü kuruldu.** Ölçüt: doğrudan metin taşıyan elemanın sınır kutusu, onu **kesen** atasının kutusunun dışına taşıyor mu. "Kesen kutu" dıştan içe ilk daraltan atadır — sınıfı o belirler, çünkü kesimi gerçekte yapan odur. Taşma px'i ve metnin ilk 40 karakteri raporlanıyor.
- **Dört muafiyet kuruldu, hepsi ayrı sayılıyor:** (1) bilinçli ekran-dışı yüzey — `aria-hidden` **beyanı** + sağ kenarı 0'ın solunda (bal küpü); (2) görsel olarak gizli — kesen kutunun `clip-path: inset(50%)`i ya da 1×1 kutusu (`sr-only` deyimi); (3) hareketli şerit — ata zincirinde **adı** duran animasyon; (4) iki boyutlu içerik — kaydırılabilir şeritte `<table>` çocuk (WCAG 1.4.10'un kendi istisnası). Beşinci sınıf olan kaydırılabilir kap da ayrı sayılıyor.
- **Kaydırılabilir şerit ölçütü kuruldu.** Kaydırılabilir kapta **tek bir çocuk** kabın `clientWidth`'inden genişse ihlal — o öğe hiçbir zaman tümüyle görünmez.
- **Eşik ve dosya başlığı gerçeğe çekildi.** Gerçek kırpma ya da şerit ihlali `TOPLAM SORUN`'a giriyor, çıkış kodu 1. Başlık artık ölçülene eşit ve tanım seçiminin gerekçesini taşıyor.

**Sorunlar:**
- **Devralınan rakam iki ayrı tanımdan geliyordu; hangisinin 19/70 verdiği ölçülerek bulundu.** Üç aday 320 px'te yan yana koşuldu: metin **menzili** (Range) → 9 kalem / 66 px (B-033'ün dar alt kümesi); **doğrudan metin taşıyan elemanın kutusu** → **19 kalem / 70 px**; tüm elemanlar → 47 kalem / 2595 px. İkincisi seçildi — devralınan rakamı birebir üretiyor.
- **Naif "görünür alanı sıfıra yakın" gizlilik ölçütü sınıf çalıyordu.** Ölçüldü: 320 px'te 83 kalem yakalıyor ve bunların **66'sı aslında kaydırılabilir kovasına ait** (Roller şeridinde görüş alanı dışına kaymış kartlar). Ölçüt alana değil **beyana** çevrildi.
- **Sahte hedefin ilk tablo varyantı sonuçsuz kaldı** — esnek kapta `<table>` daralıp eşiğin altına düştüğü için dal hiç ateşlenmedi. `flex:0 0 auto` ile düzeltilip yeniden koşuldu.

**Kararlar:**
- **Dal yalnız YATAY kaybı sayar; dikey kırpma ayrı sayılır ama kapıyı düşürmez.** Gerekçe: dikey kırpma (`line-clamp`, sabit yükseklikli kutu) çoğu yerde bilinçli kısaltmadır ve ayrı bir ölçüt ister. Kapsam daralması sessiz kalmasın diye sayı yine basılıyor (bugün her iki genişlikte de 0).
- **Sınıflandırma sırası bilinçle seçildi:** gizli → hareketli → kaydırılabilir → gerçek. Gerekçe ölçülü (yukarıda): alana bakan bir gizlilik ölçütü kaydırılabilir nüfusu yutuyordu.
- **Hareket muafiyeti animasyonun ADına bakar, süresine değil** — hareket azaltma altında `animation-duration` `.01ms`'e iner ama `animation-name` durur. Sahte hedefte tam bu hâl kuruldu ve muafiyet çalıştı.
- **İki yeni dalın da kendi kapsam tabanı var** (`BEKLENEN_METIN_ELEMANI = 2038` · `BEKLENEN_SERIT = 5`) — `BEKLENEN_ROTA`/`BEKLENEN_GRADYAN`/`BEKLENEN_BASLIK` ile aynı sözleşme: taban, üst sınır değil. Gerekçe dalların şeklinde: ikisi de ihlalin **yokluğunu** raporluyor, yani körleşen seçici "0 buldum" deyip kapıyı yeşil bırakırdı.
- docs/DECISIONS.md'ye eklendi: **Hayır** — kararların hiçbiri geri dönüşü pahalı bir sözleşme bırakmıyor; ölçüt ve muafiyetler betiğin kendi başlığında ve yorumlarında yaşıyor, tabanlar elle bakımlı sabitler.

**Dosya Değişiklikleri:**
- `research/scripts/mobile-audit.mjs` → İki genişlik, kırpılmış taşma dedektörü, dört muafiyet + kaydırılabilir kova, şerit ölçütü, genişlik başına kapsam eşiği, gerçeğe çekilmiş dosya başlığı

**Test Sonuçları:**
- **Taban (önce), `df5724a`'nın betiğiyle kendi koşumumdan:** 3100'e karşı 16 rota · 6290 eleman · 621 dokunma hedefi · `TOPLAM SORUN 278` · çıkış **1**.
- **Sonra:** 3100'e karşı **2 genişlik × 16 rota** · 53 sn · `TOPLAM SORUN 585` · çıkış **1**. Kırılım — **320 px:** kırpma **19 gerçek / en ağır 70 px**, şerit **8**, muaf → görsel gizli 0 · hareketli 19 · kaydırılabilir 40 · dikey 0 · iki boyutlu içerik 2 · ekran dışı beyanlı 3. **390 px:** kırpma **0**, şerit **8**, muaf → 0 · 18 · 38 · 0 · 2 · 3. Kapsam her iki genişlikte 16 rota · 6290 eleman · **2038 metin elemanı (taban 2038)** · 621 dokunma hedefi · **5 kaydırılabilir kap (taban 5)**.
- **Kalibrasyon (devralınan rakama karşı):** B-033'ün 320 px değeri **birebir** yeniden üretildi — **19 kırpılmış / 70 px**, hepsi `/` rotasında `FounderProgram`'da, kesen kutu `<section>` (`overflow:hidden`); 390 px'te **0**. Muafiyet aritmetiği de tuttu: 320 px'te ham isabet **78** = 19 gerçek + **59 muaf**, araştırmanın "muafiyetsiz 59 sahte pozitif" rakamıyla birebir.
- **Kırmızı→yeşil deneyi (gerçek site, geliştirme sunucusu 3000, `/` · 320 px):** kırpma **19** → `FounderProgram`'ın ızgara çocuklarına geçici `[&>*]:min-w-0` → **0** (`TOPLAM SORUN` 69 → 50, tam 19 fark) → geri alındı → **19** geri geldi. Geri alma `git status --short src/` boş çıktısıyla doğrulandı. Dev ve yayın kopyası aynı rakamı veriyor.
- **Beş sonda (sahte hedef, port 3407, kapının birebir kopyası — gerçek kapıdan yalnız 3 satır farkı `diff` ile gösterildi: rota kaynağı + iki kapsam tabanı):** (1) kesen geometri → kırpma 2 · şerit 2 · **çıkış 1**; (2) kart daralınca + şerit çocuğu sığınca → **`✓ KAPI YEŞİL`, çıkış 0**; (3) boş sayfa → `TOPLAM SORUN` **0** olduğu hâlde **dört kapsam eşiği birden** (iki genişlik × iki yeni dal) ve **çıkış 1**; (4) şeritte 704 px `<table>` → **iki boyutlu içerik muafiyeti 1, şerit ihlali 0, çıkış 0** (aynı geometride `<button>` → 2 ihlal, çıkış 1); (5) bal küpünden `aria-hidden` kaldırılınca üç düğüm **geri sayıldı** (`taşan eleman: 3`, muaf 0, çıkış 1). Sunucu kapanışı pozitif kontrolle: **BOŞ → 200 → BOŞ**, 3407'de dinleyen yok.
- **`/demo` temizlendi:** eski hâlde `overflowCount` 3'tü, şimdi `taşan eleman: 0` · `ekran dışı beyanlı muaf: 3` — sayfada başka taşma kalemi yok.
- **Belirlenimlilik:** iki ardışık tam koşum birebir aynı (433 satır, `diff` boş; yalnız docker konteyner adı satırları hariç tutuldu).
- **`npm test`: 210 geçti + 2 atlandı** (`docker compose exec web npm test`).
- **Kapsam:** ölçüm yayın kopyasına (3100) karşı, **320 ve 390 px**, `isMobile` bağlamında ve **etkileşimsiz hâlde** — açılmamış sekme/akordeon içeriği kapsam dışı (B-015). Dal **yatay** kaybı ölçer. 3100 bu turda tazelenmedi ve tazelenmesi gerekmedi: site kodu değişmedi, yalnız ölçüm betiği değişti (`lastmod` 2026-09-24T12:28:32Z, devralınan damgayla aynı). `a11y.mjs` bu turda hiç değişmedi ve ortak bir dosyaya dokunulmadı.

---

**Oluşturulma:** 2026-09-23
