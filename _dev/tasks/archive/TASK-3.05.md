# TASK-3.05: Gradyanla boyanmış metin kapıda kendi dalı olur

**Durum:** ✅ Tamamlandı
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

`background-clip: text` ile boyanan metni (`.text-gradient-sage`) kapıya görünür kılmak. Bu sınıf piksel yöntemiyle de ölçülemez — metnin CSS rengi `transparent`'tır. Ölçüt: gradyanın **kaynağındaki en açık durak** okunur ve zemine karşı sınanır. Sonuç kapıda `skipped` değil, **kendi dalı** olarak sayılır; yoksa düzeltildikten sonra da eşikte görünmez kalır.

---

## Bağlam

Araştırma ölçtü: gradyanla boyanmış metin kayıtlı **5 değil, 11 benzersiz** yerde. Ölçülen değer: en açık durak (`sage-br`) canvas üstünde **1,74:1**, canvas-soft üstünde **1,64:1** — gereken 3,0. STYLE-GUIDE zaten *"açık zeminde `sage` metin olarak kontrastı geçmez"* diyor ve `sage-br` ondan daha açık.

Teknik karar (PHASE-3): *"Gradyanla boyanmış metin piksel yöntemiyle de ölçülemez ve ayrı ele alınır."*

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (gradyan metin dalı)
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 3. satır (11 benzersiz metin)
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 3
- `_dev/docs/STYLE-GUIDE.md` — `sage` / `sage-ink` kontrast geleneği

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [x] **1. Sınıfı tespit et**
  - Hesaplanmış stilde `-webkit-background-clip: text` (ya da `background-clip: text`) **ve** `color: transparent` olan metin düğümleri
  - Çapası: `src/app/globals.css` → `.text-gradient-sage` (kullanmadan önce `grep -n` ile yeniden konumlan)

- [x] **2. En açık durağı çıkar**
  - `background-image` değerinden gradyan duraklarını ayrıştır, her durağı RGB'ye çevir, **görece parlaklığı en yüksek** olanı seç
  - Ata opaklık çarpımı burada da uygulanır (TASK-3.04'ün kuralı)

- [x] **3. Zemine karşı sın**
  - Zemin, glif maskesinin altındaki gerçek pikselden okunur (TASK-3.04'ün çekirdeği yeniden kullanılır)
  - Eşik: büyük metin ≥ 3,0 (bu sınıfın tamamı 41,6-44 px / 700)

- [x] **4. Kendi dalı olarak raporla**
  - Çıktıda `gradyan metin: N ölçüldü · M eşik altı` satırı; eşik altı varsa çıkış kodu 1
  - Ölçülen benzersiz metin sayısı basılır (araştırmada 11) — sayı düşerse seçici körleşmiştir

---

## Etkilenen Dosyalar

```
research/scripts/a11y.mjs   # gradyan metin dalı
```

---

## Dikkat Noktaları

- **"En açık durak" bilinçli olarak katı ölçüttür:** gradyan boyunca metnin bir kısmı daha koyu boyanır, ama okunabilirliği en kötü nokta belirler. Ölçütü yumuşatma isteği doğarsa bu bir **karardır**, betik ayarı değil.
- **Bu dal `skipped`'a düşmez.** Ölçülemeyenler kutusuna atılırsa TASK-3.11'in düzeltmesi kapıda hiç görünmez.
- **Benzersiz metin sayısı seçicinin sağlığıdır.** Aynı metin iki yerde geçebilir (ölçülmüş tuzak) — benzersizleştirme metin + rota çiftine göre yapılır.
- **Düzeltme bu task'ın işi değil** (TASK-3.11). Burada kapı kırmızıya dönerse doğru çalışıyor demektir.

---

## Test Kriterleri

- [x] Kapı gradyanla boyanmış metni buluyor ve sayısını basıyor (beklenen ≈ 11 benzersiz)
- [x] Ölçülen en kötü değer araştırmanın rakamıyla uyuşuyor: canvas üstünde ≈ **1,74:1**, canvas-soft üstünde ≈ **1,64:1**
- [x] Eşik altı kalem varken çıkış kodu **1**
- [x] Deneysel olarak `.text-gradient-sage`'in durakları koyulaştırıldığında dal yeşile dönüyor (dayanak bozulup kırmızı/yeşil geçişi gözlendi)
- [x] Bu dal `skipped` sayısına karışmıyor — çıktıda ayrı satır

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
- **Gradyan metin "ölçülemeyen" kovasından çıktı, kendi ölçülen dalı oldu.** Sınıf artık `background-clip: text` **ve** şeffaf glif dolgusu ölçütüyle ayrılıyor; rengi gradyanın **kaynağındaki en açık duraktan** okunuyor, zemin yine glif maskesinin altındaki gerçek pikselden geliyor ve eşik ötekilerle aynı (`esikFor` — bu sınıfın tamamı 36-56 px/700-800, yani ≥ 3,0).
- **Maske sorunu ikinci bir kareyle değil, var olan karenin kuralı genişletilerek çözüldü.** Gradyan metnin glif dolgusu **zaten** şeffaf olduğu için TASK-3.04'ün gizleme kuralı (`-webkit-text-fill-color: transparent`) onu hiç değiştirmiyor — iki kare birebir aynı çıkıyor ve maske boş kalıyordu. Boyayan şey elemanın gliflere kırpılmış **arka planı**; `GIZLE_CSS` artık işaretli elemanlarda `background-image` ve `background-color`'ı da siliyor, maske böyle doğuyor. Üçüncü bir ekran görüntüsü alınmadı: koşum süresi **66 sn**'de kaldı (taban ile aynı).
- **Durak ayrıştırıcısı renk uzayından bağımsız.** Katmanlar ve duraklar parantez derinliğine bakan bir bölücüyle ayrılıyor, her durak adayı tuvale çizilip RGBA'sı okunuyor; yön/enterpolasyon argümanı (`135deg`, `to right in oklab`) hiçbir önekte renk olarak çözülmediği için kendiliğinden eleniyor. Ata opaklık çarpımı durak alfasıyla birlikte uygulanıyor.
- **Geçerlilik ölçümü eklendi:** geçersiz bir CSS rengi `fillStyle`'ı **değiştirmeden** bırakır, yani önceki renk okunur ve `135deg` siyah bir durak gibi görünürdü. İki farklı sentinel (`#000000` / `#ffffff`) ile geçerlilik ayrıca ölçülüyor.
- **Dalın kendi kapsam eşiği kuruldu** (`BEKLENEN_GRADYAN = 19`, `BEKLENEN_ROTA` ile aynı sözleşme: taban, üst sınır değil). Gerekçe: dal kümesini bir taramadan türetiyor — seçici körleşirse "0 buldum" der ve kapı yeşil kalırdı.
- **Çıktı ayrıştı:** rota başına `gradyan metin: N ölçüldü · M eşik altı` satırı, ihlaller `[gradyan]` işaretiyle, toplamda ayrı `GRADYAN METİN:` satırı. `ÖLÇÜLEMEYEN` satırı beş kovadan **dörde** indi.

**Sorunlar:**
- **Araştırmanın "11 benzersiz yer" sayısı site geneli değil, `/` rotasının sayısıymış.** Ölçüm: 16 rotada **19 eleman / 17 benzersiz metin**, `/` rotasında **11**. Kümenin de tek kaynağı yok: **17'si `.text-gradient-sage`**, **2'si ayrı bir Tailwind yazımı** (`bg-linear-to-r from-sage-br to-sage bg-clip-text text-transparent` — `Solution.tsx` ve `FounderProgram.tsx`). TASK-3.11'in işi değişmiyor (tek CSS kuralı 17'sini birden düzeltir) ama **doğrulama sayısı 11 değil 17** olmalı; kayıt `BULGULAR.md` → Gelen Kutusu'nda.
- **O iki ayrı yazım kapıdan GEÇİYOR** (`p02` **8,92** ve **9,84**) çünkü koyu zeminlerde duruyorlar — yani `sage-br` başlı başına kötü değil, **açık zeminde** kötü. Bu, TASK-3.11 için ileriye dönük bir tuzak: düzeltme `.text-gradient-sage`'in duraklarına değil **`--color-sage-br` token'ının kendisine** uygulanırsa bu iki yeri (bugün geçen) aşağı çeker.
- **Gradyan metinlerden biri yapışkan zincirinde** (`HowItWorks` → `lg:sticky`, "biz yapıyoruz"). Sınıflandırma sırası bilinçli olarak korundu — gradyan, yapışkandan **önce** bakılıyor; aksi hâlde TASK-3.11'in düzelteceği bir kalem ölçülmeyen yapışkan borcuna (B-063) düşer ve kapıda hiç görünmezdi. Ölçüm belirlenimli çıktı (iki ardışık tam koşum birebir aynı, `p02` 1,74).

**Kararlar:**
- **Şeffaf glif dolgusu tek başına "gradyan" sayılmaz; ayırt eden `background-clip: text`tir.** Gerekçe: clip'siz şeffaf metin hiçbir şey boyamaz — "ölçülür" sayılırsa etkin alfa 0 olur, boyanan renk zeminin aynısı çıkar ve kapı **1,0:1 diye sahte bir ihlal** basar. Bugün 16 rotada böyle bir eleman yok (19'un hepsi `clip:text`), yani ölçüt sıkı tutulabildi; o sınıf artık `görünmez` kovasına gidiyor.
- **Eşik altı gradyan kalemi `TOPLAM SORUN`'a girer ve kapıyı olağan yoldan düşürür.** Ayrı bir çıkış yolu açılmadı: aynı WCAG kuralı, aynı eşik, yalnız rengin kaynağı farklı. Ayrışma raporda (`[gradyan]` işareti + kendi satırı), çıkış kodunda değil.
- **Durağı okunamayan gradyan `kalan` kovasına düşer** (sessizce geçmez, eleman adıyla basılır). Gerekçe: bu kör noktadır, adı konmuş muafiyet değil.
- **Üçüncü kare alınmadı.** İkinci karenin kuralını genişletmek ölçüm maliyetini sıfır tuttu; bedeli, gizleme kuralının artık iki iş yapması — kalibrasyon bunu kapıyor (ölçülen eleman ve ihlal sayıları tabandan sapmadı).
- docs/DECISIONS.md'ye eklendi: **Evet** (2026-09-24 — gradyan metin kendi dalı olur; TASK-3.04 kararının "gradyan metin muafiyet kovasıdır" fıkrası geçersiz kılındı).

**Kalan İşler:** yok

**Dosya Değişiklikleri:**
- `research/lib/piksel-kontrast.mjs` → `BEKLENEN_GRADYAN` eklendi; `GIZLE_CSS` işaretli elemanların arka planını da siliyor; `adaylariTopla()` içine durak ayrıştırıcısı (`bolTopSeviye` · `renkGecerli` · `duraktanRenk` · `enAcikDurak`) ve `background-clip: text` ayrımı girdi, gradyan kalemler geometri üretiyor ve `data-pk-grad` ile işaretleniyor; `adimiIsle()` gradyan sınıfını da ölçüyor; `rotaSonucu()` gradyan dalını (`{olculen, esikAlti}`) ayrı döndürüyor, `gradyan` kovası kaldırıldı, durağı okunamayan kalem `kalan`a yazılıyor.
- `research/scripts/a11y.mjs` → dalın rota ve toplam satırları, `[gradyan]` işaretli ihlal basımı, `BEKLENEN_GRADYAN` kapsam eşiği; ihlal listesi tavanı 14 → 20 (bir rotada artık 18 ihlal var, liste kesiliyordu).

**Test Sonuçları:**
<!-- KURAL: Ölçüm kimliğiyle yazılır — ne çalıştırıldı ve hangi kapsamda. -->
- **Tam koşum (16 rota, hedef 3100 yayın kopyası, 1440×900, hareket azaltma açık):** 16 rota · **105 ekran adımı** · **1835 eleman** · **66 sn** · **GRADYAN METİN: 19 ölçüldü (taban 19) · 17 eşik altı** · **TOPLAM SORUN 56** · çıkış kodu **1**. Ölçülemeyen: yapışkan borcu **151** · görünmez **43** · ekran dışı **0** · **kalan 0**.
- **Regresyon kontrolü (pozitif kontrol): dalın açılması ötekini bozmadı.** TASK-3.04 tabanı 1835 eleman / 105 adım / 66 sn / 39 ihlal / yapışkan 151 / görünmez 43 / kalan 0 idi — hepsi **birebir aynı**; 56 − 17 = **39**, yani kontrast ihlallerinin tamamı korundu. Gizleme kuralının genişletilmesi ölçülen metinlerin karesine dokunmuyor.
- **Belirlenimlilik:** iki ardışık tam koşum, konteyner adı ve süre satırı dışında **birebir aynı** (`diff` boş).
- **Kalibrasyon — devralınan rakamlar birebir yeniden üretildi:** en açık durak (`sage-br`) canvas üstünde **1,74:1**, canvas-soft üstünde **1,64:1** (B-032 kalem 3: 1,74 / 1,64). `/` rotasında 11 gradyan kalem — araştırmanın "11 benzersiz yer" sayımıyla birebir.
- **Kapı dört sondayla sınandı** — dördü de yerelde, kaynağa değil **girdiye** dokunarak (sahte statik hedef, 16 rota + mutlak `<loc>`'lu site haritası, port 3458, `BASE` ile yönlendirildi; her varyant kendi ağacında):
  1. **Bozuk girdi** — rota başına iki gradyan metin, en açık durak `#94d08e` (beyaz üstünde ~1,7): **32 ölçüldü · 32 eşik altı**, TOPLAM SORUN 32, çıkış **1**.
  2. **Yeşil ayak** — **aynı düzenek, yalnız duraklar koyulaştırıldı** (`#2f5a2e`, ~8:1): **32 ölçüldü · 0 eşik altı**, `✓ KAPI YEŞİL`, çıkış **0**. Test kriterindeki "durakları koyulaştırınca yeşile döner" ayağı budur — kaynak değil girdi değiştirildi.
  3. **Boş kapsam / fail-open yalıtımı** — hiç gradyan metin yok: **TOPLAM SORUN 0 olduğu hâlde** `✗ KAPSAM EŞİĞİ: gradyanla boyanmış metin 0 ölçüldü < beklenen taban 19`, çıkış **1**. Körleşen seçici artık yeşil basamıyor.
  4. **Durağı okunamayan gradyan** — `background-image: url(...)` + `bg-clip:text`: 32 gradyan geçiyor ve TOPLAM SORUN 0, ama `kalan:1` ve eleman **adıyla** basılıyor (`? ölçülemedi (kalan) — 44px "Durağı okunamayan" — gradyan durağı okunamadı`), çıkış **1**.
  - Sunucu her sondadan sonra kapatıldı ve kapanma **pozitif kontrolle** ölçüldü (port BOŞ → 200 → BOŞ, dört kez).
- **`npm test` (Vitest, `web` konteynerinde): 210 geçti + 2 atlandı** — iki env kapısı kapalı, arıza değil.
- **Kapsam:** yalnız **1440×900** ve yalnız **yayın kopyası** (3100). 390/320 px'te gradyan metnin kendi ölçümü bu turun dışında; yayın kopyası bu turda **tazelenmedi** — site kodu değişmedi (yalnız `research/` altı) ve 3100 TASK-3.04'ün tazelediği sürümde (site haritası `lastmod` 2026-09-24T12:28Z, HEAD ile aynı).

---

**Oluşturulma:** 2026-09-23
