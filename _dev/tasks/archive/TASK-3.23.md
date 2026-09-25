# TASK-3.23: `font-guard` ikinci dal kazanır — küme dosyasındaki her karakter woff2'de gerçekten var mı

**Durum:** ✅ Tamamlandı
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F5.3 Font daraltma
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.22 ✅

---

## Hedef

`font-guard.mjs` bugün yalnız *"site metni ⊆ küme dosyası"* doğruluyor. *"Küme ⊆ woff2 glifleri"* hiç doğrulanmıyor — yani üretim (`font-subset.mjs`) ile tüketim arasındaki **sözleşme** ölçülmüyor. İkinci dal eklenir: küme dosyasındaki her karakterin üretilen woff2'lerde gerçekten bulunduğu doğrulanır.

Ölçüldü: **Sora 700 ve Sora 800'de `₺` (U+20BA) ve dört ok (`←↑→↓`, U+2190-2193) yok** — ilki Unifont'a, okları Liberation Serif'e düşüyor. `₺`'nin yokluğu STYLE-GUIDE'da kayıtlı ve Inter yedeği bilinçli; **okların yokluğu hiçbir yerde kayıtlı değil.**

---

## Bağlam

B-046 kalem (4). Milestone bu dalı adıyla istiyor: *"yazı tipi kümesindeki her karakterin dosyada gerçekten bulunduğu doğrulandı."*

**Bugün vekil doğru ve bu kaydedilir:** dev sunucusuna karşı koşturulan eşdeğer ölçüm (16 sayfa, asistan paneli açık, 79.685 karakter) kümede olmayan karakter bulmadı — yani F5.3'ün mevcut kriteri karşılanıyor. Eksik olan, kümenin kendisinin fonta karşı doğrulanması.

**Küme tarafı doğrulandı** (araştırma): `₺` ve dört ok kümede **var** (153 karakter) ve font dosyaları daraltma commit'inden beri **hiç değişmedi** — yani beyan ↔ font sözleşmesindeki boşluk aynen duruyor.

**Kapsam notu:** `font-guard.mjs`'in çıkış kodu ve kapsam eşikleri bu fazın dışında ("Kalite kapıları otomatik") — betik zaten çıkış kodu veren tek kapı (`:52 process.exitCode = 1`), yeni dal aynı mekanizmayı kullanır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (4), ölçüm yöntemi (CDP `CSS.getPlatformFontsForNode`)
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.3 kabul kriterleri
- `_dev/docs/STYLE-GUIDE.md` — Sora'da ₺ yok, Inter yedeği kaldırılmaz

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.3'e ikinci dal kriteri
- `_dev/modules/M6-Kalite-Kapilari.md` — **regresyon çizgisi tablosu yenilenir** (aşağıda → Alt Görev 5)
- `_dev/docs/STYLE-GUIDE.md` — okların Sora'da bulunmadığı (bugün hiçbir yerde kayıtlı değil)

---

## Alt Görevler

- [x] **1. İkinci dalı yaz**
  - Küme dosyasındaki her karakter için üretilen woff2'lerde glif var mı: `document.fonts.check()` ya da CDP `CSS.getPlatformFontsForNode` (yeni bağımlılık gerekmez)
  - Ölçüm **yedeksiz** `font-family` ile yapılır, yoksa yedek gerçeği örter (araştırmanın yöntemi: karakter başına bir `<span>`)
  - Her font dosyası ve ağırlığı ayrı ayrı sınanır (Sora 700 · Sora 800 · Inter 400/500/600)

- [x] **2. Muafiyet listesi**
  - Bilinçli yedeklenen karakterler adıyla durur (bugün `₺` — Inter yedeği bilinçli, STYLE-GUIDE'da kayıtlı)
  - Muafiyet **adıyla** yazılır, sınıf olarak değil

- [x] **3. Dört oku karara bağla**
  - İki yol: kümeden düşürmek (sitede kullanılmıyorsa) ya da fontu yeniden üretmek
  - Önce ölç: oklar site metninde gerçekten geçiyor mu? Geçmiyorsa kümeden düşürmek doğru yol
  - Küme değişirse `font-subset.mjs` yeniden koşar

- [x] **4. Raporla**
  - Çıktı: `küme: N karakter · woff2'de eksik: M (muaf: K)`; muaf olmayan eksik > 0 → çıkış kodu 1

- [x] **5. Regresyon çizgisini yeni yöntemle yeniden yaz**
  - `modules/M6-Kalite-Kapilari.md` → Teknik Notlar'daki başlangıç tablosu 2026-09-11'de, **8 rotada ve eski yöntemle** ölçüldü; "Kontrast ihlali: 0" ve "Yatay kaydırma: 0" satırları bu fazdan sonra çok daha geniş bir şeyi anlatıyor (16 rota · piksel kontrastı · gradyan metin dalı · başlık hiyerarşisi · kırpılmış taşma · iki kulvarlı dokunma hedefi)
  - Bu task fazın **son kapı task'ıdır** ve bütün düzeltmelerden sonra koşar — satırları dürüstçe yeniden ölçebilecek tek yer burası
  - Üç a11y/mobil satırı yeniden ölçülüp **kapsamıyla birlikte** yazılır ("16 rotada, piksel yöntemiyle"); font satırı bu task'ın kendi ölçümünden gelir. Dokunulmayan satırlar (perf, ağırlık, CLS, üretim derlemesi) **olduğu gibi kalır** — onların yöntemi bu fazda değişmedi (B-035 kapsam dışı)
  - Gerekçe: bir sonraki faz (F6.2 tek komut) eşiklerini doğrudan bu tablodan alacak

---

## Etkilenen Dosyalar

```
research/scripts/font-guard.mjs        # ikinci dal + muafiyet listesi
research/FONT-KARAKTER-KUMESI.txt      # oklar düşürülürse
public/fonts/                          # font-subset.mjs yeniden koşarsa (betik çıktısı, elle düzenlenmez)
```

---

## Dikkat Noktaları

- **`public/fonts/` elle düzenlenmez** — `font-subset.mjs` üretir (CLAUDE.md → Dokunulmazlar).
- **Yedeksiz ölçüm şart.** Yedekli `font-family` ile ölçersen `₺` Inter'den gelir ve Sora'da varmış gibi görünür.
- **CDP bazı karakterlerde boş liste döndürebilir** (araştırmada iki karakterde oldu, sonuçsuz) — sonuçsuz kalemler **ayrı** raporlanır, "var" sayılmaz.
- **`₺`'nin fiilî hâli:** `--font-display` + `font-weight:800` bağlamında `₺` Inter SemiBold (600), yanındaki rakamlar Sora ExtraBold (800). Yedek çalışıyor (sistem fontuna düşmüyor) ama aynı satırda hem aile hem **ağırlık** değişiyor. Bu bir gözlemdir; düzeltmesi bu task'ın kapsamı değil — kayda geçer.
- **Küme küçülürse font yeniden üretilir ve ağırlık değişir** — `perf.mjs` ile ölçülür (bugün 5 dosya, 95 KB).
- **`font-guard` yayın kopyasını ölçüyor** (zaten öyle) — `docker compose --profile prod up -d web-prod`; `BASE` env'i ile yönlendirilebilir.

---

## Test Kriterleri

- [x] İkinci dal koşuyor ve küme dosyasındaki 153 karakterin hepsini font dosyalarına karşı sınıyor
- [x] Sora 700/800'de dört okun eksikliği yakalanıyor (dal kurulduğunda kırmızı dönüyor)
- [x] `₺` muafiyet listesinde adıyla duruyor ve kırmızıya düşürmüyor
- [x] Oklar karara bağlandı; kümeden düşürüldüyse `font-subset.mjs` koştu ve font dosyaları yeniden üretildi
- [x] Muaf olmayan eksik kalmadığında çıkış kodu **0**; deneysel olarak kümeye olmayan bir karakter eklendiğinde **1**
- [x] Birinci dal (site metni ⊆ küme) hâlâ çalışıyor ve 16 sayfada eksik karakter bulmuyor
- [x] Font ağırlığı ölçüldü (`perf.mjs`); 95 KB tabanına göre değişim rakamıyla kaydedildi
- [x] M6'daki regresyon çizgisinin a11y/mobil/font satırları yeni yöntemle yeniden ölçülüp **kapsam ibaresiyle** yazıldı; dokunulmayan satırlar değişmedi

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **İkinci dal yazıldı** (`research/scripts/font-guard.mjs`, +~250 satır). Birinci dal (site metni ⊆ küme) satır satır korundu ve aynı rakamı verdi (85.129 karakter / eksik 0).
- **Yüzler elle listelenmiyor, servis edilen CSS'ten keşfediliyor:** `link[rel=stylesheet]` → `@font-face` blokları → `url(...woff2)` taşıyanlar. Bugün **1 stil dosyası → 5 yüz** (Inter 400/500/600 · Sora 700/800), her birinin HTTP durumu da basılıyor (5/5 → 200). `local()` taşıyan iki yedek yüz (`Sora Yedek` · `Inter Yedek`) woff2 url'i olmadığı için kendiliğinden dışarıda kalıyor — ayrı bir dışlama kuralı yazılmadı.
- **Her woff2 TEKİL bir aile adına izole edildi** (`GUARD0..GUARD4`, `font-weight: 100 900`, `font-display: block`). Gerekçe ölçülmüş bir tuzak: aynı ailede iki ağırlık varsa (Sora 700 + Sora 800) tarayıcı eksik glif için önce **öbür ağırlığı** dener, yani "aile" üzerinden ölçüm dosya başına cevap vermez.
- **SENTINEL yöntemi kuruldu ve araştırmanın "sonuçsuz" sınıfını kapattı.** Her span'a `SENTINEL + karakter` yazılıyor (`SENTINEL = "A"`, kümede olduğu ayrıca doğrulanıyor). Sentinel her zaman o dosyada olduğu için CDP listesi asla boş dönmez: **765 ölçümün 765'i kesin, 0 sonuçsuz** — B-046'nın kendi ölçümünde iki karakter boş liste döndürüp sonuçsuz kalmıştı.
- **Beklenen ad kalibrasyondan geliyor, elle yazılmıyor.** Yalnız sentinel taşıyan bir span ile her dosyanın kendini nasıl bildirdiği ölçülüyor: Inter 400 → `Inter`, Inter 500 → **`Inter Medium`**, Inter 600 → **`Inter SemiBold`**, Sora 700 → `Sora`, Sora 800 → **`Sora ExtraBold`**. Elle yazılmış bir ad listesi burada yanılırdı. Kalibrasyon span'ı tam 1 font bildirmezse düzenek kırılmış sayılır ve kapı kırmızıya döner (pozitif kontrol).
- **Üç kapsam tabanı kondu:** `BEKLENEN_YUZ = 5` · `BEKLENEN_SINAMA = 765` (5 yüz × 153 karakter, **kesin** ölçüm) · `BEKLENEN_YIGIN = 6` (16 rotada kullanılan farklı (yığın, ağırlık) çifti). Gerekçe: bu dal ihlalin **yokluğunu** raporluyor, yani sessiz kalmak başarı hâli — tabansız hâlde körleşmiş bir ölçüm de başarı görünür. Sonda 3 ve 4 bunu ölçerek gösterdi.
- **Dört ok ÖLÇÜLEREK karara bağlandı ve kümede BIRAKILDI** (aşağı → Kararlar). `→` sitede gerçekten geçiyor.
- **Muafiyet listesi adıyla yazıldı ve kendi fail-open'ı iki yandan kapatıldı** (`aile` + `tasiyan` alanları, + gerçek yığın ölçümü).
- **M6'nın regresyon çizgisi yeniden yazıldı** — dört satır bugün yeniden ölçüldü ve **kapsam sütunu** eklendi; dokunulmayan dört satır değerini korudu ve "bu fazda yeniden ölçülmedi" ibaresi aldı.

**Sorunlar:**
- **`document.fonts.check()` kullanılmadı:** aileyi sorar, glifi sormaz — eksik glif hâlinde de `true` döner. Çözüm CDP `CSS.getPlatformFontsForNode` (araştırmanın yöntemi), üstüne sentinel çapası.
- **Sonda 3'te bir yanlış sinyal görüldü ve düzeltildi:** kapsam eşiği düştüğünde muafiyet satırı için basılan `ℹ … glif artık var, satır düşürülebilir` bilgisi yanıltıcıydı (hiçbir şey ölçülmediği için "kullanılmadı" görünüyordu). Satır artık `kesin >= BEKLENEN_SINAMA` koşuluna bağlı.
- **`isCustomFont` ayırt edici olarak kullanılmadı** (dal 2'de): `local()` kaynaklı bir `@font-face` de `custom` sayılabilir. Dal 2 **kalibre edilmiş ad** karşılaştırmasına dayanıyor. Muafiyetin yığın dalında (2c) `isCustomFont` yerine, indirilmiş yüzlerin kalibrasyondan gelen ad kümesi kullanılıyor.

**Kararlar:**
- **Dört ok (`←↑→↓`, U+2190-2193) kümeden DÜŞÜRÜLMEDİ; ₺ ile aynı sınıfa alınıp muafiyet listesine yazıldı.** Task dokümanı *"sitede kullanılmıyorsa kümeden düşürmek doğru yol"* diyordu; ölçüm o koşulu **çürüttü**: `→` (U+2192) sitede gerçekten çiziliyor — `/`'da Chaos defterinin `"bel 74 → 71"` satırı (1 kez, `<li italic>`, Inter 500'den miras 400) ve `/destek`'te üç yasal metin bağlantısının çevriyazı oku (3 kez, `<span aria-hidden>`, Inter 500). `←↑↓` 16 rotanın hiçbirinde geçmiyor. Düşürmenin üç bedeli ölçüldü: (1) `→` sistem fontuna düşerdi (4 çizim yeri), (2) küme değişimi **beş dosyayı yeniden ürettirir** ve TASK-3.22'nin metrik eşlemesi (`size-adjust` 115 / 105,88) Google'ın o günkü sürümüne bağlı — ölçülmemiş bir CLS riski, (3) `font-subset.mjs`'in taban kümesi bilinçle ileriye dönük (*"ileride yazılacak metinler de karşılansın"*), okları çıkarmak o tasarımla çelişir. Muafiyet yolu üç bedeli de ödemiyor ve sözleşmeyi **yazılı** hâle getiriyor.
- **Muafiyet YALNIZ `aile` alanındaki yüzler için geçerli ve `tasiyan` ailenin o karakteri gerçekten taşıdığı ayrıca ölçülüyor.** Gerekçe: muafiyetin dayanağı *"Sora'da yok ama Inter'de var ve yığında Inter hemen sonra geliyor"*. Inter'den de düşerse yedek kalmaz — o hâlde kapı kırmızı döner (sonda 5).
- **Muafiyet sitenin GERÇEK yığınlarına karşı ayrıca ölçülüyor (2c).** Gerekçe: yukarıdaki iki ayak `--font-display`'den Inter çıkarılsa da yeşil kalırdı — beş karakter başlıklarda sistem fontuna düşer ve kapı bunu görmezdi. Yığın listesi elle yazılmıyor, **16 rotada gerçekten kullanılan** (yığın, ağırlık) çiftlerinden türüyor (bugün 6 çift, 2 farklı yığın) ve her muaf karakter **indirilmiş** bir yüzden gelmek zorunda.
- **Birinci dala kapsam tabanı KONMADI** — task dokümanının kapsam notu (`font-guard.mjs`'in çıkış kodu ve kapsam eşikleri bu fazın dışında, "Kalite kapıları otomatik") bilinçle korundu. Bedeli sonda 4'te ölçüldü ve yazılı: hiçbir şey servis etmeyen bir hedefe karşı dal 1 **48 karakter tarayıp yeşil kaldı**.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşün maliyeti düşük: muafiyet listesi tek dosyada beş satır, kaldırılması iz bırakmaz ve biriken veri/sözleşme üretmiyor. Kararın kalıcı evi betiğin başlık yorumu + `STYLE-GUIDE.md` → Tipografi (okların Sora'da bulunmadığı ilk kez oraya yazıldı).

**Kalan İşler:**
- Yok (bu task'ın kapsamında).

**Dosya Değişiklikleri:**
- `research/scripts/font-guard.mjs` → ikinci dal (yüz keşfi + izolasyon + sentinel ölçümü + üç kapsam tabanı + iki yanlı muafiyet doğrulaması), başlık yorumu ölçülmüş gerekçelerle yeniden yazıldı. Birinci dal **davranış olarak dokunulmadı**; yalnız (yığın, ağırlık) çifti toplayan bir `evaluate` eklendi (2c'nin girdisi) ve çıkış kodu tek bir `kirmizi` bayrağına bağlandı.
- `research/FONT-KARAKTER-KUMESI.txt` → **değişmedi** (153 karakter, 226 bayt — sonda 2 ve 3'ten sonra `cmp` ile birebir doğrulandı).
- `public/fonts/` → **dokunulmadı**, `font-subset.mjs` koşturulmadı (yukarı → Kararlar). 5 dosya / 95 KB birebir.
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.3'e ikinci dal kriteri + muafiyet kuralı.
- `_dev/modules/M6-Kalite-Kapilari.md` → regresyon çizgisi tablosu yeniden yazıldı (kapsam sütunu); F6.1 Durum'a font-guard'ın ölçülmüş hâli.
- `_dev/docs/STYLE-GUIDE.md` → Tipografi'ye okların Sora'da bulunmadığı (bugüne kadar hiçbir yerde kayıtlı değildi) ve sözleşmenin iki dalla ölçüldüğü.
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` → Çözüm Kaydı'na kalem (4)'ün kapanışı; kapanış satırı düzeltildi (kalem 5'in adlandıran task'ı yok).
- `_dev/BULGULAR.md` → Gelen Kutusu'na iki satır (kalem 5'in sahipsizliği · `--font-sans` yığınında karşılıksız 700 isteği).

**Test Sonuçları:**

**Kapsam:** yargı **yayın kopyası (3100)**; dal 1 16 rota × 1440 px `body.innerText`; dal 2 tek sayfa (`/`) üzerinden **dosya** ölçümü (rota bağımsız); 2c'nin yığın listesi 16 rotadan türüyor. **3100 tazelenmedi — gerekmedi:** bu tur `src/` ve `public/` altında hiçbir şeye dokunmadı. Tazelik pozitif kontrolle doğrulandı (`sitemap.xml` `lastmod` **2026-09-25T01:05:55.970Z** = TASK-3.22'nin damgası · servis edilen CSS'te `Sora Yedek`/`Inter Yedek` ve TASK-3.22'nin **birebir** override değerleri · `/` HTML'inde `-sm.webp` **68** kez) ve negatif tarafla (eski tam kaynak `salon-genis.webp` **0**).

**Ürettiğin kapıyı sına — BEŞ SONDA, hepsi yerelde, hepsi geri alındı:**
- **Sonda 1 — bozuk girdi, kusurun GERÇEKTE doğduğu katman (woff2).** Dört ok muafiyet listesinden çıkarıldı; gerçek servis edilen Sora dosyalarındaki gerçek eksiklik ortaya çıktı: `eksik: 8 (muaf: 2)` · `✗ DAL 2` · **çıkış 1**. Sahte bir font üretilmedi — gerçeklik zaten kusuru taşıyordu, muafiyet onu bastırıyordu.
- **Sonda 2 — bozuk girdi, küme tarafı.** `research/FONT-KARAKTER-KUMESI.txt`'e hiçbir yüzde olmayan bir karakter eklendi (`Ω` U+03A9, 226 → 228 bayt): beş yüzün beşi de yakaladı (`Ω → Liberation Serif`), `küme: 154` · `eksik: 5` · **çıkış 1**. Kesin ölçüm 770'e çıktı, taban geçti — yani kırmızı taban değil **ihlal** dalından geldi.
- **Sonda 3 — boş kapsam, KARAKTER ekseni.** Küme dosyası boşaltıldı. Dalın kendi hüküm satırı **YEŞİL kaldı** (`küme: 0 karakter · woff2'de eksik: 0` · `✓ DAL 2`); kırmızıyı basan **yalnız taban** oldu: `✗ KAPSAM EŞİĞİ — 0 kesin ölçüm, beklenen ≥ 765`. **Çıkış 1.** Dal 1 de aynı koşumda kırmızıya döndü (sitedeki her karakter kümede yok).
- **Sonda 4 — boş kapsam, YÜZ ekseni.** Hedef, hiç `@font-face` içermeyen bir sayfa servis eden sahte bir sunucuya çevrildi (konteyner içinde `127.0.0.1:8123`, koşum sonunda kapandı; repoda iz yok). `0 stil dosyası · 0 yüz` → `✗ KAPSAM EŞİĞİ — 0 yüz bulundu, beklenen ≥ 5`; ayrıca ölçüm tabanı, taşıyan denetimi ve yığın tabanı (`1 çift / beklenen ≥ 6`) da ateşledi, ve **2c ayırt etti**: beş muaf karakterin beşi de `Liberation Serif`/`Unifont`'a düştü. Hüküm satırı burada da yeşildi. **Çıkış 1.** ⚠️ Aynı koşum **dal 1'in tabansızlığını ölçtü**: `16 sayfa · 48 karakter tarandı · ✓ DAL 1` — hiçbir şey servis etmeyen hedefte yeşil.
- **Sonda 5 — muafiyetin (a) ayağı.** `₺`'nin `tasiyan` alanı yanlış beyan edildi (`Inter` → `Sora`, ki Sora'da gerçekten yok): `✗ ₺ U+20BA muaf ama TAŞIYAN aile (Sora) de taşımıyor — yedek kalmadı` · **çıkış 1**. Muaf/eksik sayıları değişmedi, yani kırmızı doğru dalın kırmızısı.
- **Kontrol grubu:** temiz hâlde **çıkış 0**, iki dal da yeşil. **Geri alma `diff` ile teyit edildi** — küme dosyası `cmp` ile birebir (`git diff` boş), betik temiz kopyasıyla birebir (tek fark sonda 3'ten doğan `ℹ` koşulu, bilinçli).

**Dal 2 — önce/sonra:** dal yoktu → **var**. `küme: 153 karakter · woff2'de eksik: 0 (muaf: 10)` · kesin ölçüm **765/765**, sonuçsuz **0** · 5 yüz, 5/5 HTTP 200 · muafiyet **5 karakter × 6 (yığın, ağırlık) çifti = 30 ölçüm**, hepsi indirilmiş bir yüzle çiziliyor. **Eksik glif tablosu:** Inter 400/500/600 **tam**; Sora 700 ve Sora 800 → `₺` U+20BA → **Unifont**, `←↑→↓` U+2190-2193 → **Liberation Serif** (onu Sora 700 hem 700 hem 800'de birebir tekrarlıyor, yani 5 karakter × 2 yüz = 10 muaf kalem).

**Dalın KAPSAMADIĞI:** (a) dal 1'in kör noktaları aynen duruyor — **yalnız 1440 px**, `body.innerText`, `display:none` içeriği saymıyor, hata kutusu hiç çizilmiyor; dal 2 bu kör noktadan **etkilenmiyor** çünkü dosyayı ölçüyor, çizileni değil. (b) Dal 2 **kümenin doğruluğunu** sorgulamıyor: `font-subset.mjs`'in ürettiği `research/fonts-out/charset.txt` ile `research/FONT-KARAKTER-KUMESI.txt`'in aynı olduğu doğrulanmıyor (bugün birebir, ölçüldü — 226 bayt, `cmp`). (c) 2c yalnız **16 rotada kullanılan** yığınları görür; hiç çizilmeyen bir yığına Inter'siz bir yığın yazılırsa görmez. (d) Kapı **glif varlığını** ölçer, glifin **doğru çizildiğini** ölçmez.

**Kapıların önce/sonra hâli (hepsi bugün koşuldu):**
- `mobile-audit` (3100, 2 genişlik × 16 rota): **TOPLAM SORUN 0 → 0** · çıkış **0 → 0** · `✓ KAPI YEŞİL` — **mobil kapı hâlâ yeşil**. Altı taban birebir ve hiçbiri elle değiştirilmedi: eleman **6253** · metin elemanı **2054** · kritik hedef **305 / 0 eşik altı** · kaydırılabilir kap **5** · dokunma hedefi **638** · gezinme **333 / 261** · kırpma **0** · şerit **0**.
- `a11y` (3100, 16 rota): **6 / çıkış 1** birebir — altısı `/gecis`'in kontrast kalemi; 16 rota / **105** ekran adımı / **1834** eleman / gradyan metin **19-0** / görünür başlık **316-0** / `alt'sız img: 0` / yapışkan borcu **151** (B-063).
- `font-guard`: **dal 1** 85.129 karakter / eksik 0 → **birebir**; **dal 2** yeni. Çıkış kodu **0 → 0**.
- `perf` (3100): `/` **111 KB** iki profilde (LCP 80 / 68 ms, **CLS 0 / 0**, DOM 1491 / 1488), `/fiyat` 95 KB, segment 125 KB, `/demo` 73 KB. **`font/woff2` 95 KB** — 95 KB tabanına göre **değişim 0** (fontlar yeniden üretilmedi); `/demo` 73 KB çünkü orada üç yüz çiziliyor. M6 çizgisi 144 KB / 96 ms.
- `scan` (**3000, geliştirme** — kodda sabit, yayın kopyasını hiç ölçmüyor): `/` @1440 18 kare / **15.405 px** · @390 20 kare / **25.872 px**, ikisinde de **konsol temiz** — TASK-3.19 · 3.21 · 3.22 ile birebir, yani bağımsız bir betikten gelen "hiçbir şey oynamadı" teyidi.
- `npm test` **219 geçti + 2 atlandı** · `tsc` **0** · `lint` **30 problem** (25 hata, 5 uyarı) — üçü de birebir.

**Belirlenimlilik:** temiz hâlde **üç** koşum (ilk yazım, kontrol, son kayıt) — 85.129 / 5 yüz / 765 kesin / 0 sonuçsuz / 6 çift / 30 ölçüm / eksik 0 muaf 10 / çıkış 0 **birebir**. Kalibrasyon adları üç koşumda da aynı. Yığın envanteri bağımsız bir betikle önceden de ölçülmüştü (6 çift, 2 yığın) ve kapı aynı sayıyı buldu.

**Negatif kontroller:** (1) sonda 1-5, yukarıda. (2) Yedeksiz `"Sora"` yığınında beş muaf karakterin beşi de sistem fontuna düşüyor (`Liberation Serif` / `Unifont`, `isCustomFont=false`) — 2c'nin ayırt ediciliğinin bağımsız ölçümü; gerçek yığınlarda (`--font-display` 700/800 · `--font-sans` 400/500/600) aynı beş karakter **her hâlde Inter'den** geliyor. (3) Sonda 2'de eklenen karakteri **beş yüzün beşi de** yakaladı, yani dal tek bir yüze bakmıyor.

---

**Oluşturulma:** 2026-09-23
