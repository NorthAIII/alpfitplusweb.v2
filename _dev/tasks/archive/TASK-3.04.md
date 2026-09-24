# TASK-3.04: Kontrast ölçümü piksele taşınır — glif maskesi, ata opaklığı, ekran ekran gezme

**Durum:** ✅ Tamamlandı
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`a11y.mjs`'in kontrast ölçümünü hesaplanmış stilden **piksele** taşımak: iki karenin (normal / metni görünmez) farkından glif maskesi çıkarılır, **metin rengi CSS'ten** alınır (ata opaklık çarpımı uygulanarak), **zemin maskenin altındaki gerçek pikselden** okunur. Bu tek değişiklik B-031'in (1), (2) ve (3) numaralı kör noktalarını birden kapatır: gradyan/fotoğraf zemini ölçülebilir olur, ata opaklığı renge girer, ve ölçülemeyen (`skipped`) sayısı bir eşiğe bağlanır.

---

## Bağlam

Bugünkü model üç şeyi yapısal olarak göremiyor: gradyan/fotoğraf zemini (tek renk yok), ata opaklığı (kompozisyon), gradyanla boyanmış metin (renk `transparent`). Ölçülmüş bedeli: 8 sayfada **85 eleman** hiç ölçülmüyor ve `<body>`'ye tek bir dekoratif gradyan konduğunda `/fiyat`'ta ölçülen eleman **157 → 0**'a düşerken kapı yine "TOPLAM SORUN: 0" diyor.

Araştırma bu yöntemi bu projede **sıfırdan prototipledi ve çalıştı**: B-032'nin kayıtlı rakamlarını birebir yeniden üretti (kapanış paragrafı `p02=3,97 / min=3,83`; desenli zemin `p02=4,06 / min=3,95 / med=4,63`). ⚠️ *"Çalışan uygulama scratchpad'de bırakıldı, devralınabilir"* iddiası **çürüdü** — adı geçen betiklerin hiçbiri makinede yok. Bu task "devralınan kodu uyarla" değil **"yaz"** olarak boyutlanmıştır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3-ARASTIRMA.md` — 1., 2., 3. ve 6. yaklaşımlar (yöntem, glif çekirdeği, ölçüm penceresi, hareket azaltma) ve tuzakların tam metni
- `_dev/bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md` — üç kör noktanın ölçümü
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — doğrulama tabanı: bu rakamlar yeniden üretilmeli
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — `sharp` ile ham piksel erişimi ve kör-seçici tuzağı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/DECISIONS.md` — kontrast ölçümünün piksel yöntemine geçmesi (ölçüm sözleşmesi değişiyor, geri dönüşü olan yorum değil)

---

## Alt Görevler

- [x] **1. Ölçüm çekirdeğini yaz**
  - `research/lib/piksel-kontrast.mjs` (YENİ): iki kare al (normal / metin `color: transparent`), farktan glif maskesi çıkar, maskenin altındaki zemin piksellerini `sharp` ile oku
  - Metin rengi **CSS'ten** gelir; ata zincirindeki her `opacity` değeri çarpılarak renge uygulanır
  - Raporlanan değerler: `p02` (en kötü %2 piksel), `min`, `med` — desenli zeminlerde yargı yumuşatılabilsin

- [x] **2. Ekran ekran gezme**
  - Sayfa `0,9 × viewport` adımlarla gezilir, her adımda iki kare alınır (tek ekran ölçümü B-032'nin kalemlerinin **hiçbirini** görmüyor: 1440 px'te ilk ekranda ihlal 0, sayfa tamamında 21)
  - Adım sayısı çıktıya girer (ana sayfa 1440 px'te 13 adım, `/ozellikler` 10 adım)

- [x] **3. Hareket azaltma altında koş**
  - Bağlam `reducedMotion: 'reduce'` ile açılır — ata opaklık çarpımı uygulandığı anda `Reveal`'in geçiş ortası opaklıkları sahte ihlal üretiyor (ölçülen ara değerler: 0,459 · 0,618 · 0,666 · 0,711 · 0,818)

- [x] **4. `skipped` bir eşik olsun**
  - Ölçülemeyen eleman sayısı raporlanır; sabit/yapışkan katmanlar **ayrı bir sayıda** tutulur (bugün ölçüm dışı — 3 sayfada 335 örnek) ve bu bir **borç** olarak çıktıda adıyla görünür
  - Ölçülemeyen kalan sınıf sıfır değilse kırmızıya döner

- [x] **5. Eşikler**
  - Normal metin ≥ 4,5 · büyük metin (≥ 24 px, ya da ≥ 18,66 px bold) ≥ 3,0 (QUALITY 7)

---

## Etkilenen Dosyalar

```
research/
├── lib/piksel-kontrast.mjs   # YENİ — glif maskesi + zemin okuma
└── scripts/a11y.mjs          # kontrast dalı çekirdeği çağırır; eski hesaplanmış-stil yolu çıkar
```

---

## Dikkat Noktaları

- **Metin rengini boyanan pikselden alma.** Prototipin ilk turu bunu yaptı ve 100 ölçümün **95'ini** eşik altı gösterdi — okunan şey metin değil **antialias kenarıydı** (`med` 17'ye çıkarken `p02` 1,1'de kalıyordu). Morfolojik erozyonla glif çekirdeğini ayıklamak ince yazıda işe yaramıyor: 11-15 px gövde metninin inmesi çoğu yerde tek piksel. **fg CSS'ten, piksel yalnız zemini verir** — bu düzeltmeden sonra eşik altı 95 → 1'e düştü.
- **Sabit/yapışkan katmanlar her adımda yeniden görünür** ve koordinatları kayar. Bu sınıf ölçüm dışı bırakılır ve bu bir borçtur: Header'ın gezinme bağlantıları böylece hiç ölçülmüyor. ⚠️ **Borcun bu fazda kapatılmayacağı karara bağlandı** (kullanıcı, verify-plan 2026-09-23): ikinci ölçüm turu ("kaydırma sıfırdayken yalnız yapışkan katmanlar") **bu task'ın kapsamı değildir** ve "Kalite kapıları otomatik" fazına kalır. Buradaki yükümlülük yalnızca borcu **görünür kılmaktır** — alt görev 4'teki ayrı sayı. Kanvas kaydı: `_dev/bulgular/B-063-kontrast-olcumu-yapiskan-katmanlari-atliyor.md`.
- **Gradyanla boyanmış metin piksel yöntemiyle de ölçülemez** (rengi CSS'te yok) — o kendi dalıdır ve TASK-3.05'te gelir. Bu task onu `skipped`'a atmaz, **"gradyan metin" adlı ayrı sayıya** koyar ki sonraki task onu devralabilsin.
- **3100 bayat olabilir** — ölçüm yayın kopyasına karşı koşuyor; `docker compose --profile prod up -d web-prod` (yalnız `build` yetmez).
- **Doğrulama tabanı B-032'dir:** yöntem doğruysa kapanış paragrafı `p02≈3,97` ve desenli zemin `p02≈4,06` yeniden üretilir. Üretmiyorsa yöntem yanlıştır, site değil.
- **Bulamayan seçici betiği yeşil bırakır** — her koşumda ölçülen eleman sayısını bas.

---

## Test Kriterleri

- [x] `a11y.mjs` 16 sayfada koşuyor; çıktı sayfa başına adım sayısını ve ölçülen eleman sayısını yazıyor
- [x] B-032'nin iki referans rakamı yeniden üretildi: kapanış paragrafı `p02` ≈ 3,97 · desenli zemin `p02` ≈ 4,06 (sapma varsa gerekçesiyle kaydedildi)
- [x] Ata opaklığı renge uygulanıyor: ürün turu soluk adım kartları artık **2,5-3,0** aralığında görünüyor (kapının eski değeri 8,03-10,63'tü)
- [x] Hareket azaltma altında koşuluyor; geçiş ortası opaklıktan doğan sahte ihlal **0**
- [x] `<body>`'ye deneysel bir dekoratif gradyan konduğunda ölçülen eleman sayısı **düşmüyor** (eski modelde 157 → 0 oluyordu)
- [x] Ölçülemeyen sınıflar ayrı ayrı raporlanıyor (yapışkan katman borcu · gradyan metin · kalan) ve kalan sınıf sıfır değilse çıkış kodu 1

---

## Risk ve Geri Dönüş Planı

- **Piksel ölçümü yavaştır** (16 rota × ekran adımı × iki kare). Süre ölçülür ve task dokümanına yazılır; kabul edilemez uzunsa kare alma çözünürlüğü düşürülür, **yöntem değil**.
- **Rollback:** `a11y.mjs` tek dosya + yeni lib; dosya bazlı geri alınır.

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
- **Ölçüm çekirdeği yazıldı** (`research/lib/piksel-kontrast.mjs`, YENİ). Aynı kaydırma konumunda iki kare alınır — normal, ve glif dolgusu şeffaf; farkı glif maskesidir. Metin rengi CSS'ten gelir, zemin maskenin altındaki gerçek pikselden okunur, ata zincirindeki her `opacity` çarpılarak renge uygulanır. Her eleman için `p02` (en kötü %2 piksel), `min` ve `med` raporlanır; **yargı değeri `p02`'dir**.
- **Glif dolgusu `color` ile değil `-webkit-text-fill-color` ile şeffaflaştırılıyor.** `color` aynı zamanda `currentColor`un kaynağı ve Tailwind 4 preflight'ı kenarlıkları `border: 0 solid` (currentColor) kuruyor — `color`u oynatmak kenarlık, SVG dolgusu ve alt çizgi renklerini de değiştirip maskeye metin olmayan piksel sızdırırdı. `text-decoration-color` currentColor'da kaldığı için alt çizgiler iki karede de aynı kalıyor ve maskeye hiç girmiyor.
- **Elemanın kendi metni, çocuklarının metninden ayrıldı.** Maske `Range.getClientRects()` ile **yalnız doğrudan metin düğümlerinin** satır kutularına sınırlanıyor; yoksa bir `<p>`'nin maskesine içindeki `<span>`'in başka renkteki glifleri de girer ve `p02` yanlış elemana yazılırdı.
- **Ekran ekran gezme kuruldu** — pencerenin %90'ı adımlarla, her adımda iki kare. Belge yüksekliği **her adımda yeniden okunuyor** (tembel içerik gezerken yükleniyor; baştan hesaplanan adım sayısı sayfanın altını kaçırır).
- **Bağlam `reducedMotion: 'reduce'` ile açılıyor** — ata opaklık çarpımı uygulanır uygulanmaz `Reveal`'in geçiş ortası opaklıkları sahte ihlal üretiyor.
- **Ölçülemeyen tek bir `skipped` sayısı olmaktan çıktı, beş kovaya ayrıldı:** `yapışkan borcu` (B-063, bu fazın kapsamı dışı) · `gradyan metin` (TASK-3.05 devralsın diye ayrı) · `görünmez` (sr-only, etkin opaklık ~0) · `ekran dışı` · **`kalan`**. Yalnız `kalan` kapıyı düşürür ve sıfır olmayan değerde elemanlar **adıyla** basılır.
- **Eski hesaplanmış-stil yolu kaldırıldı** (`bgOf()`, `painted` atlama, `[data-over-image]` muafiyeti): piksel yöntemi fotoğraf ve gradyan üstü metni zaten ölçüyor.

**Sorunlar:**
- **`kalan` kovası ilk koşumda 25 eleman gösterdi ve hepsi sayfaların altındaydı — kök neden sitedeydi, kapıda değil:** `globals.css:135` `html { scroll-behavior: smooth }` taşıyor ve `prefers-reduced-motion: reduce` bloğu bunu **kapatmıyor** (yalnız animasyon/geçiş süresini sıfırlıyor). `window.scrollTo` bir animasyon başlatıyor, DOM ölçümü ile ekran karesi **farklı konumda** alınıyordu. Çözüm iki katlı: ölçüm koşması olarak `html{scroll-behavior:auto}` enjekte edildi **ve** her adımda kaydırmanın hedefe oturduğu `kaydirVeDogrula` ile ölçülüyor — oturmazsa cümleyle duruluyor (fail-closed). Sitenin kendi `scroll-behavior` boşluğu kapsam dışı olduğu için `BULGULAR.md` → Gelen Kutusu'na düştü.
- **Düzeltmeden sonra `kalan` 25 → 55'e ÇIKTI ve bu ikinci, daha sinsi bir arızayı açığa çıkardı.** `/kvkk` adım 1'de kare çiftinin toplam farkı **1.839 piksel** (komşu adımlarda 69.016). Kareler kaydedilip gözle bakıldı: B karesinde **yalnızca yapışkan başlığın** metni silinmiş, gövde metni duruyordu — yani stil eklendikten hemen sonra alınan kare, sayfanın yalnız kendi bileşke katmanı olan kısmını yeniden boyanmış gösteriyordu. Çözüm: her kare öncesi bir sonraki boyama bekleniyor (iki `requestAnimationFrame` + bir görev kuyruğu turu). Ölçüm: adım 1'in farkı **1.839 → 45.742**, ve iki ardışık tur **birebir aynı** oldu (önce 5-6. adımlar da turdan tura oynuyordu).
- **Yapışkan başlığın örttüğü eleman sahte kırmızı üretiyordu.** İlk tasarım "pencereye tam sığdığı İLK adımda ölç ve kapan" diyordu; örtülü bir adımda eleman sıfır piksel üretip "ölçüldü" diye kapanıyor ve `kalan`a düşüyordu. Ölçüm artık **en çok piksel veren tam adımı** kazandırıyor.
- **`sr-only` atlama bağlantısı ("İçeriğe geç") `kalan`a düşüyordu:** elemanın **kendi** `overflow: hidden`'ı kendi metnini kırpıyor, ama kırpma kutusu yalnız atalardan hesaplanıyordu. Kırpma kutusu artık elemanın kendisini de kapsıyor ve alan eşiği **kırpılmış** alana uygulanıyor — 1×1 px'lik kutu `görünmez` kovasına gidiyor.

**Kararlar:**
- **Yargı değeri `p02`, `min` değil.** Gerekçe: desenli zeminde (nokta ızgarası glifin altına denk geldiğinde) `min` tek bir talihsiz pikseli cezalandırır, `med` ise sorunu tamamen gizler; B-032'nin kendi yöntemi de `p02` kullanıyordu ve kayıtlı rakamlar ancak bu ölçütle yeniden üretilebiliyor. `min` ve `med` her ihlal satırında **birlikte** basılıyor ki yargı gerektiğinde yumuşatılabilsin.
- **Üç muafiyet kovasından yalnız `kalan` kırmızıya döndürür.** `yapışkan borcu` ve `gradyan metin` adı konmuş, sahibi belli, kaydı olan muafiyetlerdir (B-063 · TASK-3.05); `kalan` ise sınıfı bilinmeyen kör noktadır ve tam da "hiçbir şey ölçmedim"i "sorun yok"tan ayıran şeydir.
- **Ölçüm koşması olarak sayfaya `scroll-behavior:auto` enjekte edilmesi dekoratif değil geçerlilik koşuludur** ve tek başına kanıt sayılmaz — her adım ayrıca ölçülerek doğrulanıyor.
- docs/DECISIONS.md'ye eklendi: **Evet** (2026-09-24 — ölçüm sözleşmesinin yargı değeri, kova politikası ve iki geçerlilik koşulu).

**Kalan İşler:** yok

**Dosya Değişiklikleri:**
- `research/lib/piksel-kontrast.mjs` → **YENİ.** Eşikler ve `esikFor()`, glif gizleme ve kaydırma koşması stilleri, `kaydirVeDogrula()`, `kareCifti()` (boyama beklemeli), `hamPiksel()`, sayfa içinde koşan `adaylariTopla()` (sınıflandırma + kırpma kutusu + ata opaklık/yapışkan memoizasyonu), `adimiIsle()` (maske + oran birikimi), `ozet()` (p02/min/med), `rotaSonucu()` (kovalar + ihlaller).
- `research/scripts/a11y.mjs` → Kontrast dalı tümüyle çekirdeğe devredildi; eski `bgOf()`/`painted`/`[data-over-image]` yolu çıktı. Bağlam `reducedMotion: 'reduce'`, ekran ekran döngü, ölçüm arızasında rotayı gezilmemiş sayan fail-closed yakalama, kova raporu ve `kalan` eşiği eklendi. Çıktıya adım sayısı ve süre girdi.

**Test Sonuçları:**
<!-- KURAL: Ölçüm kimliğiyle yazılır — ne çalıştırıldı ve hangi kapsamda. -->
- **Tam koşum (16 rota, hedef 3100 yayın kopyası, 1440×900, hareket azaltma açık):** 16 rota · **105 ekran adımı** · **1835 eleman ölçüldü** · **66 sn** · **TOPLAM SORUN 39** (hepsi kontrast; `h1`/alt/adsız link/adsız buton hepsi 0) · çıkış kodu **1**. Ölçülemeyen: yapışkan borcu **151** · gradyan metin **19** · görünmez **43** · ekran dışı **0** · **kalan 0**. **İki ardışık tam koşum konteyner adı dışında birebir aynı çıktı verdi** (belirlenimli).
- **Kalibrasyon — B-032'nin dört kalemi birebir yeniden üretildi:** kapanış paragrafı `p02` **3,97-3,98** / min 3,84-3,88 / med 4,71 (kayıt: 3,97 / 3,83-3,90 / 4,71) · desenli zemin `p02` **4,06** / min **3,95** / med **4,63** (kayıt birebir aynı) · ürün turu soluk kartları gövde **2,52-2,54** ve etiket **2,98-2,99** (kayıt 2,54-2,99; **eski kapı 8,03-10,63 sanıyordu**) · 404 dev rakamı **1,12** (kayıt 1,12-1,17). Gradyan metin kovası `/` rotasında **11** — araştırmanın "11 benzersiz yer" sayımıyla birebir.
- **Kriter: `<body>`'ye dekoratif gradyan (B-031'in birebir deneyi, `/fiyat`):** ÖNCE ölçülen **156** / ihlal 2 / kalan 0 → SONRA ölçülen **156** / ihlal 2 / kalan 0. Eski modelde aynı deney 157 → **0** yapıyordu; kapsam çöküşü kapandı.
- **Kriter: hareket azaltma kalibrasyon kolu** (aynı rota, `reduce` ile `no-preference` karşılaştırıldı): `/` → açık 9 ihlal / kapalı 14 ihlal, **8 sahte**; `/ozellikler` → açık 7 / kapalı 14, **8 sahte**. Sahteler `Reveal`'in geçiş ortası opaklığından doğuyor (`p02` 1,14-3,26 — "Demo İste", "WhatsApp'tan yazın", adım kartı gövdeleri). Hareket azaltma altında bu sınıftan ihlal **0**.
- **Kapının kendisi üç sondayla sınandı** — üçü de yerelde, kaynağa değil **girdiye** dokunarak (sahte statik hedef, 16 rota + mutlak `<loc>`'lu site haritası, port 3457; `BASE` ile yönlendirildi):
  1. **Bozuk girdi** — metin zemine ~1,2:1 yakınlıkta: **48 sorun**, çıkış kodu **1**; satırlar `p02 1.12:1 (gereken 4.5)`.
  2. **Yeşil ayak** — aynı yapı yüksek kontrastla: **TOPLAM SORUN 0**, `✓ KAPI YEŞİL`, çıkış kodu **0**. Kırmızı kilitlenmiş değil.
  3. **Boş kapsam / fail-open yalıtımı** — metin DOM'da, pencerede, ama opak bir örtünün altında (hiç boyanmıyor): **kontrast ihlali 0 olduğu hâlde** `kalan 64` ve `0 eleman ölçüldü`, çıkış kodu **1**. Bu sonda kritik: eski model burada "TOPLAM SORUN: 0" derdi.
  - Sunucu her sondadan sonra kapatıldı ve kapanma **pozitif kontrolle** ölçüldü (port BOŞ → 200 → BOŞ, üç kez).
- **`npm test` (Vitest, `web` konteynerinde): 210 geçti + 2 atlandı** — iki env kapısı kapalı, arıza değil. (Kök `CLAUDE.md` hâlâ 209 diyor; kayıt Gelen Kutusu'nda açık.)
- **Kapsam:** ölçüm yalnız **1440×900**'de ve yalnız **yayın kopyasına** (3100) karşı koşuldu; 390/320 px ve gerçek cihaz bu turun dışında. Yapışkan katmanların kendi turu (kaydırma sıfırdayken) bilinçli olarak kapsam dışı (B-063).
- **Yayın kopyası tazelendi ve tazelik pozitif kontrolle doğrulandı:** `/kvkk`'deki ayırt edici ifade 3100'de **0 → 2** (3000 ile eşit), site haritası `lastmod` **2026-09-23T07:41Z → 2026-09-24T12:28Z**.

---

**Oluşturulma:** 2026-09-23
