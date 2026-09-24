# TASK-3.08: Dokunma hedefi kuralı kapıya girer — kritik küme kırmızı, gezinme yüzeyi raporlanır

**Durum:** ✅ Tamamlandı
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği · M2 F2.3 kabul kriteri
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`mobile-audit.mjs`'in dokunma hedefi ölçümünü **iki kulvara** ayırmak: dönüşüme dokunan hedefler (buton · form alanı · sekme · `header`/`nav` içindeki menü · `/demo`, `wa.me` ve `tel:` hedefli bağlantılar) 44 px'in altındaysa **kırmızıya düşürür**; alt bilgi ve gövde metni içi bağlantılar ölçülür, raporlanır, düşürmez. M2 F2.3 *"Dokunma hedefleri ≥ 44 px (`mobile-audit.mjs`)"* diyordu ama kapının geçme şartı yalnız yatay kaydırmaydı — bu boşluk burada kapanır.

---

## Bağlam

Kullanıcı kararı (PHASE-3 → Alınan Kararlar): *"Dokunma hedefi kuralı kademeli kurulur."* Gerekçe: 157 küçük hedefin çoğu gövde metni içi bağlantı ve hepsini 44 px'e çıkarmak satır aralıklarını açarak tipografiyi bozar; ILKELER'in 1. ekseni (dönüşüm) hangi hedefin kritik olduğunu zaten söylüyor.

Araştırma sınıflandırdı: alt bilgi ve içerik yolu dışarıda tutulduğunda **19 benzersiz kritik hedef** kalıyor (16 sayfada 61 örnek); gövde metni içi bağlantı **324**. Kritik kümenin tamamı somut: şube seçici butonları (63-66×36), "WhatsApp'tan sorun" (172×20), telefon bağlantısı (147×20), form alanı (250×24) ve **onay kutusu (18×18)**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (mekanik ölçüt)
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 6. satır (19 benzersiz kritik hedefin dökümü)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3 kabul kriteri
- `_dev/ILKELER.md` — En Yüksek Öncelikli Eksenler (dönüşüm birinci)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3 kriterinin kademeli hâli (kritik küme kırmızı, gezinme raporlanır)

---

## Alt Görevler

- [x] **1. Kritik kümeyi mekanik olarak tanımla**
  - `button`, `input`, `select`, `textarea`, `[role="tab"]`, `header`/`nav` içindeki bağlantılar
  - `a[href="/demo"]`, `a[href^="https://wa.me"]`, `a[href^="tel:"]` — nerede olurlarsa olsunlar
  - Onay kutusu dâhil (18×18 ölçüldü); etiketin tıklanabilir alanı hedefe sayılır mı — ölçütü çıktıda yaz

- [x] **2. Raporlanan kümeyi ayır**
  - `footer` içindeki bağlantılar ve gövde metni (paragraf/liste) içi bağlantılar → ölçülür, listelenir, **kırmızıya düşürmez**

- [x] **3. Eşik ve çıktı**
  - Eşik 44×44 CSS px; kritik kümede eşik altı > 0 → çıkış kodu 1
  - Çıktı iki satır: `kritik hedef: N ölçüldü · M eşik altı` ve `gezinme/içerik yolu: N ölçüldü · M eşik altı (raporlanır)`
  - Benzersiz hedef sayısı da basılır (araştırmada kritik 19 benzersiz / 61 örnek)

---

## Etkilenen Dosyalar

```
research/scripts/mobile-audit.mjs   # dokunma hedefi dalının iki kulvara ayrılması
```

---

## Dikkat Noktaları

- **Ölçüt kullanıcı kararıdır, betik ayarı değil.** Alt bilgi **ve içerik yolu** bağlantıları bilinçle dışarıda: ikisi de gezinme yüzeyi, dönüşüm yüzeyi değil. Kümeyi genişletmek/daraltmak yeni bir karardır.
- **Bu task'tan sonra kapı kırmızı dönecek** (19 kritik hedef). Düzeltmesi TASK-3.17'de.
- **Benzersizleştirme gerekir:** aynı bileşen 16 sayfada tekrarlanıyor (61 örnek / 19 benzersiz). Rapor benzersiz kümeyi göstermeli, yoksa düzeltme listesi 61 satır gibi okunur.
- **Bulamayan seçici betiği yeşil bırakır** — ölçülen hedef sayısı sıfıra düşerse kırmızı koşulu (kapsam eşiği, TASK-3.03).
- **Görünmeyen hedefler sayılmaz:** `display:none` / `visibility:hidden` / sıfır kutulu öğeler dışarıda; bugünkü betiğin `rc.width === 0` süzgeci korunur.

---

## Test Kriterleri

- [x] Çıktı iki kulvarı ayrı ayrı basıyor; kritik kümede **19 benzersiz** hedef sayılıyor (sapma varsa gerekçesiyle)
- [x] Gövde metni içi bağlantılar (≈ 324) raporlanıyor ama çıkış kodunu etkilemiyor
- [x] Kritik kümede eşik altı varken çıkış kodu **1**; kritik küme temizken gövde metni kalemleri kalsa bile **0**
- [x] Onay kutusu (18×18) kritik kümede görünüyor
- [x] Deneysel olarak bir kritik hedef 44 px'e çıkarıldığında o kalem listeden düşüyor

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
- **Dokunma hedefi dalı iki kulvara ayrıldı.** Kritik küme **pozitif tanımlı**: buton (`button` · `summary` · `role=button`) → form alanı (`input`/`select`/`textarea`) → sekme (`role=tab`) → menü (`header`/`nav` içindeki bağlantı, alt bilgi dışında) → dönüşüm bağlantısı (`/demo` · `wa.me` · `tel:`, **nerede olursa olsun**). Ölçülen her hedeften geriye kalanı gezinme kulvarına düşer — **üçüncü, sessiz bir kova yok**. Gezinme kulvarı raporda üç alt kovaya ayrılır (alt bilgi · gövde metni · içerik yolu) ama çıkış kodunu etkilemez.
- **Eşik 44×44 CSS px oldu ve iki boyut da sayılıyor** (`h < 44 || w < 44`). Eski dal `h < 40 && w < 200` diyordu; iki ucu da yanlıştı — 40 px WCAG'in rakamı değil, ve `w < 200` koşulu **geniş ama alçak** hedefleri (telefon bağlantısı 350×39, form alanı 302×47) kapının görüş alanından çıkarıyordu.
- **Onay kutusu artık ölçülüyor.** Eski dalda `el.closest("label") && INPUT` süzgeci vardı ve etiket sarmalı onay kutusunu (18×18) tamamen atlıyordu. Süzgeç kaldırıldı, yerine ölçüt **çıktıya yazıldı**: *"ölçülen kutu kontrolün kendisidir, sarmalayan `<label>` değil"*.
- **Kritik dal kendi kapsam tabanını aldı** (`BEKLENEN_KRITIK_HEDEF = 289`) ve çıktı **benzersiz düzeltme listesini** basıyor (ölçü varyantları + örnek/rota sayısıyla) — TASK-3.17'nin girdisi budur.

**Sorunlar:**
- *Devralınan "form alanı (250×24)" kalemi ölçümde çıkmadı*: form alanları bugün **302×47**, yani eşiğin üstünde — kritik kümeye yalnız onay kutusu (18×18) giriyor. Araştırmanın rakamı Faz 2'nin form işlerinden (TASK-2.06) önceye ait. Düzeltme gerekmedi; kalem raporlandı.
- *İsimsiz kontrol düzeltme listesinde `""` diye görünüyordu* (onay kutusu): erişilebilir ad boşsa anahtar `#<id|name|type>`'a düşüyor → `#consent`. Benzersiz sayısı değişmedi (19).
- *Araştırmanın "61 örnek" rakamı tutmadı, ölçülen **125**.* Benzersiz sayı (19) birebir tuttu; sapma örnek sayısında. Nedeni ölçülebildi → Kararlar.

**Kararlar:**
- **Dönüşüm bağlantısı alt bilgide de kritiktir**: task'ın alt görev 1'i *"nerede olurlarsa olsunlar"* diyor, alt bilgi kuralı gezinme bağlantıları içindir. Ölçüldü: kural *"footer'daki dönüşüm bağlantısı da gezinmedir"* diye kurulsaydı benzersiz kritik küme **19 değil 18** olurdu — yani devralınan rakam ancak bu okumayla yeniden üretiliyor. Alt bilgideki telefon bağlantısı 16 rotanın hepsinde duruyor ve örnek sayısının 61 → 125 farkının büyük kısmı buradan geliyor.
- **Benzersizleştirme anahtarı `<etiket>|<erişilebilir ad>`** — dört aday yan yana ölçüldü (390 px, 16 rota): `tag|ad` **19** ← seçilen · `tag|ad|genişlik×yükseklik` 22 · `tag|ad|href` 20 · `sınıf|ad` 20. Seçilen anahtar araştırmanın 19'unu birebir üretiyor. Bilgi kaybı yok: her benzersiz satır kendi **ölçü varyantlarını** ve kaç rotada göründüğünü basıyor.
- **Tek kapsam tabanı, iki değil**: gezinme kulvarı çıkış kodunu etkilemediği için ona ayrı bir taban koymak bakım borcu ekler ama hiçbir fail-open kapatmaz; kritik küme tüm hedef nüfusunun alt kümesi olduğu için seçicinin tümden körleşmesi de kritik tabanında görünür. Gezinme nüfusu yine de her koşumda **basılır**.
- **`[role=button]` ve `<summary>` taranan kümeye alındı** (bugün ikisi de 0 eşliyor — ölçüldü); ileriye dönük güvence, bugünkü hiçbir rakamı değiştirmiyor.
- **Görünürlük ölçütü `visibility` üzerinden kuruldu** (kalıtılır, tek çağrı doğru cevabı verir) ve **ayrıca ölçüldü**: süzgeçli/süzgeçsiz sayım aynı (622) — bugün kutusu olan ama görünmeyen hedef yok.
- docs/DECISIONS.md'ye eklendi: **Hayır** — kararların hepsi ölçütün kendi evinde (betik başlığı) ve bu task dokümanında; sözleşme değiştiren yeni bir ad/şema doğmadı. Kullanıcı kararının kendisi (kademeli kural) zaten PHASE-3 → Alınan Kararlar'da.

**Dosya Değişiklikleri:**
- `research/scripts/mobile-audit.mjs` → dokunma hedefi dalı iki kulvara ayrıldı; eşik 44×44; etiket sarmalı kontrol süzgeci kaldırıldı; bal küpü muafiyeti bu dala da taşındı; `BEKLENEN_KRITIK_HEDEF = 289` kapsam tabanı; benzersiz düzeltme listesi çıktısı; başlık bloğuna gerekçeler yazıldı
- `src/components/sections/PriceCalculator.tsx` → **yalnız sonda sırasında geçici** `h-11` eklendi ve aynı oturumda **girdi düzeyinde geri alındı** (`git status src/` boş; `git checkout`/`restore` kullanılmadı)

**Test Sonuçları:**
- **Kapı (mobile-audit), yayın kopyasına karşı (3100) · 2 genişlik × 16 rota · 53 sn:** `TOPLAM SORUN` **585 → 285**, çıkış kodu **1**. Ayrışma: 550 ham küçük hedef → **250 kritik ihlal** (genişlik başına 125) + 19 kırpma + 16 şerit. Gezinme kulvarı her genişlikte **333 ölçüldü / 261 eşik altı** (alt bilgi 256 · içerik yolu 4 · gövde metni 1) ve **çıkış kodunun dışında**.
- **Kalibrasyon — devralınan rakama karşı koşuldu:** kritik eşik-altı **19 benzersiz** (araştırma: 19) / **125 örnek** (araştırma: 61 — çürüdü, gerekçesi Kararlar'da). Küme araştırmanın adlandırdığı kalemleri taşıyor: şube seçici butonları 63-66×36 (5 kalem; kaynakta 1·2·3·5·6, "4 şube" hiç yok) · "WhatsApp'tan sorun" 172×20 · telefon bağlantısı 147×20 ve 350×39 · onay kutusu 18×18. **Tek eksik "form alanı 250×24"** — bugün 302×47, eşiğin üstünde.
- **Kapsam:** her genişlikte 16 rota · 6290 eleman · 2038 metin elemanı (taban 2038) · **622 dokunma hedefi = 289 kritik (taban 289) + 333 gezinme** · 5 kaydırılabilir kap (taban 5). Muaf: ekran dışı beyanlı 4 (3 kırpma + **1 bal küpü**, `input#website`) · görünmez 0.
- **Dört sonda, sahte hedefe karşı** (port 3408, üç ayrı ağaç; sunucu kapanışı her seferinde pozitif kontrolle **BOŞ→200→BOŞ**):
  1. *bozuk girdi:* 20 buton 40×40 + etiket sarmalı onay kutusu 18×18 → **336 kritik eşik altı / 21 benzersiz**, `TOPLAM SORUN 672`, çıkış **1**. Onay kutusu listede `#onay` 18×18 olarak göründü — kaldırılan `label` süzgecinin kanıtı.
  2. *yeşil ayak + kulvar ayrımı (aynı sonda):* kritik hedefler 48×48'e çıkarıldı, alt bilgi bağlantıları 30×20 bırakıldı → kritik **0 eşik altı**, gezinme **96 eşik altı**, `TOPLAM SORUN 0`, **`✓ KAPI YEŞİL`, çıkış 0**. Test kriteri *"kritik küme temizken gövde metni kalemleri kalsa bile 0"* burada ölçüldü.
  3. *boş kapsam (fail-open):* kritik hedefler temiz ama nüfus 176 < 289 → `TOPLAM SORUN` **0 olduğu hâlde** kapsam eşiği ateşledi, çıkış **1**.
- **Gerçek sitede kırmızı → yeşil → kırmızı** (dev 3000, `ROTALAR=/fiyat`): şube seçici butonlarına geçici `h-11` → benzersiz kritik **10 → 5**, örnek **11 → 6**, `TOPLAM SORUN` **22 → 12**; geri alınınca **10 / 11 / 22** döndü ve `git status src/` boş.
- **Belirlenimlilik:** iki ardışık tam koşum **birebir aynı** (631 satır betik çıktısı, `diff` boş).
- **Kapının öteki yarısı değişmedi:** `a11y.mjs` 16 rota · 105 ekran adımı · 1835 eleman · 66 sn · `TOPLAM SORUN` **57**, çıkış **1**; gradyan 19/17 · başlık 316/1 · kovalar 151·43·0·0 — T6/T7 tabanıyla birebir (ortak dosyaya dokunulmadı, yalnız `mobile-audit.mjs` değişti).
- `npm test` (web konteyneri): **210 geçti + 2 atlandı** (iki env kapısı varsayılanda kapalı).
- **Kapsam sınırı:** ölçüm **etkileşimsiz hâlde** yapılır — açılmamış mobil menü, sekme ve akordeon içindeki hedefler kapsamda değil (B-015). 320 ve 390 px'te `isMobile` bağlamı; 3100 tazelenmedi ve gerekmedi (yalnız ölçüm betiği değişti, `lastmod` 2026-09-24T12:28:32.356Z).

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-24

**Ne Yapıldı:**
- Kapının dokunma hedefi dalı iki kulvara ayrıldı: dönüşüme dokunan hedef 44 px'in altındaysa kapı kırmızı, gezinme yüzeyi ölçülüp raporlanıyor ama düşürmüyor. M2 F2.3'ün "≥ 44 px" kriteri ile kapının geçme şartı arasındaki boşluk kapandı.
- Kritik kümede **19 benzersiz / 125 örnek** hedef ölçülüyor (her iki genişlikte aynı); rapor düzeltme listesini benzersiz kümeyle, ölçü varyantlarıyla ve rota sayısıyla basıyor.
- Kapı kümesi tamamlandı: `TOPLAM SORUN` 585 → **285**, çıkış 1.

**Öğrenilenler:**
- **Bir hedefin "küçük" sayılması iki boyuta birden bakmayı ister.** Eski `w < 200` koşulu geniş-alçak hedefleri (350×39 telefon bağlantısı, 302×47 form alanı) kapının görüş alanından çıkarıyordu ve bu, sayının **küçük görünmesine** değil, yanlış kalemlerin sayılmasına yol açıyordu.
- **Etiket sarmalı kontrolü atlamak bir muafiyet değil, körlüktür.** 18×18'lik onay kutusu tam da kritik kümenin en küçük kalemiydi ve eski süzgeç onu hiç ölçmüyordu.
- **Benzersizleştirme anahtarı bir rapor süsü değil, kalibrasyon aracıdır** — dört aday 19/20/20/22 veriyor ve yalnız biri devralınan rakamı üretiyor.

---

**Oluşturulma:** 2026-09-23
