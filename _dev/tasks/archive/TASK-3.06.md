# TASK-3.06: Başlık hiyerarşisi kontrolü kapıya girer

**Durum:** ✅ Tamamlandı
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`a11y.mjs` bugün yalnız `h1` **sayısına** bakıyor. Başlık **sırasını** da kontrol eden bir dal eklenir: bir seviye atlandığında (örn. `h1 → h3`) kapı kırmızıya döner ve atlamanın geçtiği rotayı, iki başlığın metnini ve seviyelerini basar.

---

## Bağlam

B-031 kalem (4): 404 sayfasında başlık dizisi `h1 h3 h3 h3` — yani `h1 → h3` atlaması var. Kaynağı `Footer.tsx`'in kolon başlıkları: `h3` ve sahipsiz (üstlerinde `h2` yok). Gövdesinde `h2` bulunan sayfalarda görünmüyor, 404'te ölçülebilir ihlale dönüşüyor. 404 bugüne dek hiçbir kapının listesinde olmadığı için hiç sınanmamış — TASK-3.03 onu listeye aldı.

Düzeltme bu task'ın işi değil (TASK-3.13); burada yalnız **ölçen** kurulur.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md` — kalem (4)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.2 kabul kriterleri

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [x] **1. Başlık dizisini topla**
  - Belge sırasına göre `h1`-`h6`; gizli (`display:none` / `visibility:hidden` / `aria-hidden`) başlıklar dışarıda
  - Her rota için dizi çıktıya girer (örn. `h1 h2 h2 h3 h2`)

- [x] **2. Atlamayı ölç**
  - Ardışık iki başlıkta seviye farkı **artı yönde 1'den büyükse** ihlal; geriye dönüş (h3 → h2) ihlal değildir
  - Sayfada `h1` yoksa ya da birden fazlaysa mevcut kontrol korunur

- [x] **3. Raporla ve eşikle**
  - `başlık hiyerarşisi: N sayfada M atlama`; M > 0 → çıkış kodu 1
  - Teşhis satırı: rota · atlayan çift · iki başlığın metni (ilk 40 karakter)

---

## Etkilenen Dosyalar

```
research/scripts/a11y.mjs   # başlık hiyerarşisi dalı
```

---

## Dikkat Noktaları

- **Bu dal bugün kırmızı dönecek** — 404'teki `h1 → h3` gerçektir ve düzeltmesi TASK-3.13'tedir. Kırmızı, dalın çalıştığının kanıtıdır.
- **Gizli başlıkları dışarıda bırak.** Ekran okuyucu için kasıtlı gizlenmiş başlık (varsa) diziye girerse sahte atlama üretir; ölçüt `aria-hidden` + görünürlüktür.
- **Sekmeli/açılır bölümlerde başlık ilk boyada gizli olabilir** (Roller, SSS). Kapı açılan katmanları ölçmüyor (B-015, kapsam dışı) — bu dalın gördüğü de ilk boyanın dizisidir; sınır çıktıda yazılı olsun.
- **Dayanağı bozup kırmızıyı gör:** deneysel olarak bir sayfaya `h1 → h4` sokup dalın yakaladığını doğrula.

---

## Test Kriterleri

- [x] Kapı 16 rotanın başlık dizisini basıyor
- [x] 404 sayfasındaki `h1 → h3` atlaması yakalanıyor ve teşhis satırı iki başlığı gösteriyor
- [x] Deneysel `h1 → h4` sokulduğunda dal kırmızıya dönüyor; geri alındığında yeşile
- [x] Geriye dönüş (h3 → h2) ihlal sayılmıyor
- [x] Atlama varken çıkış kodu **1**

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
- **Başlık hiyerarşisi `a11y.mjs`'in dördüncü ölçülen dalı oldu.** Kapı eskiden yalnız `h1` **sayısına** bakıyordu (B-031 kalem 4); artık her rotanın görünür `h1`-`h6` dizisini belge sırasına göre topluyor, ardışık iki başlığın seviye farkı **artı yönde 1'den büyükse** atlama sayıyor ve atlamayı `TOPLAM SORUN`'a yazıyor. Geriye dönüş (h3 → h2) ihlal değil — bölüm kapanışı.
- **Çıktı üç yeni satır kazandı:** rota başına `başlık dizisi: h1 h2 h2 h3 …` ve `başlık hiyerarşisi: N atlama`, her atlama için `✗ [başlık] h1 → h3 atlaması · "<ilk 40 karakter>" → "<ilk 40 karakter>"`, ve toplamda `BAŞLIK HİYERARŞİSİ:` satırı. Toplam satırı kapsamın **sınırını da yazıyor** (etkileşimsiz hâl — açılmamış sekme/akordeon içeriği dışarıda, B-015).
- **Dalın kendi kapsam tabanı kuruldu** (`BEKLENEN_BASLIK = 316`), `BEKLENEN_ROTA`/`BEKLENEN_GRADYAN` ile aynı sözleşme: taban, üst sınır değil.
- **Gizlilik ölçütü ikili kuruldu** — `aria-hidden` (kendisinde ya da bir atasında, `closest`) + görünürlük. Görünürlük iki ayrı mekanizmayla ölçülüyor, çünkü tek bir çağrı yetmiyor: `display:none` bir **atadaysa** elemanın kendi hesaplanmış `display` değeri hâlâ kendi değerini döndürür, o yüzden render edilmişlik `getClientRects()` ile ölçülüyor; `visibility` ise kalıtıldığı için hesaplanmış değer ata zincirini zaten taşıyor.

**Sorunlar:**
- **Kendi kod yorumumdaki bir iddiayı ölçüp çürüttüm.** Diziyi ekran turundan **sonra** okuyorum ve yorumda gerekçe olarak *"tembel içerik gezerken yükleniyor, baştan okunan dizi altta mount olan bölümleri kaçırırdı"* yazmıştım. Karşı-ölçüm bunu doğrulamadı: 16 rotada **tur öncesi 316 = tur sonrası 316**, hiçbir rotada sapma yok. Konum korundu (geç okumanın maliyeti sıfır, tembel mount'a karşı emniyet) ama yorum **ölçülen gerçekle** yeniden yazıldı — ölçülmemiş bir gerekçe kodda kalmadı.
- **Kapının gördüğü ile sitedeki sorunun kapsamı aynı değil.** `Footer.tsx`'in sahipsiz `h3` kolon başlıkları **16 sayfanın hepsinde** duruyor, ama ardışık-ikili ölçütü (task'ın kendi tanımı) onları yalnız 404'te atlama sayıyor: öteki 15 sayfada footer'dan önce bir `h2` geliyor ve fark +1'e düşüyor. Yani TASK-3.13 düzeltmeyi **yalnız 404'te** yaparsa kapı yeşile döner ama sahipsiz `h3` 15 sayfada kalır. Kayıt `BULGULAR.md` → Gelen Kutusu.

**Kararlar:**
- **Atlama `TOPLAM SORUN`'a girer, ayrı bir çıkış yolu açılmaz.** Gerekçe: TASK-3.05'in gradyan dalıyla aynı desen — aynı kapı, aynı çıkış kodu; ayrışma raporda (`[başlık]` işareti + kendi satırı), çıkış kodunda değil. Kapsam eşiği ise `kapsamSorunlari`'na gider, çünkü o bir ihlal değil **körleşme** sinyalidir.
- **Dalın kapsam tabanı kuruldu ve gerekçesi dalın kendi şekline bağlı.** Bu dal "ihlalin **yokluğunu**" raporluyor — sessiz kalmak onun başarı hâli. Seçici körleşirse dizi boşalır, atlama 0 çıkar ve kapı yeşil kalırdı; "bakmadım" ile "sıra doğru" aynı çıktıyı verirdi. Ölçüldü: başlıksız sahte hedefte kapı **TOPLAM SORUN 0 olduğu hâlde** kırmızıya döndü.
- **Sıralama tartışması bu dalda düşüyor.** TASK-3.05'in dersi (sınıflandırma sırası sonucu değiştirir) burada uygulanmadı çünkü **kesişme yok**: yapışkan/gradyan/görünmez kovaları piksel ölçümünün sınıflarıdır, başlık dalı yalnız belge yapısına bakar ve kovalara hiç dokunmaz. Gerekçe kod yorumunda yazılı.
- **`sr-only` başlıklar dışarıda bırakılmadı.** 1×1 px kırpılmış olsalar da ekran okuyucu onları görür ve hiyerarşinin parçasıdırlar; bugün sitede başlık sınıfında `sr-only` yok (tek `sr-only` eleman "İçeriğe atla" bağlantısı), yani kural ileriye dönük.
- docs/DECISIONS.md'ye eklendi: **Hayır.** Ölçütlerin tamamı task'ın kendi tanımından (ardışık ikili, geriye dönüş muaf, `aria-hidden` + görünürlük) ve TASK-3.03/3.04/3.05'te zaten kayda geçmiş kapı sözleşmesinden (taban deseni, tek çıkış kodu) türedi; hiçbir kayıtlı karar geçersiz kılınmadı, yeni bir ad/şema sözleşmesi doğmadı.

**Kalan İşler:** yok

**Dosya Değişiklikleri:**
- `research/scripts/a11y.mjs` → `BASLIK_SECICI` + `BEKLENEN_BASLIK` sabitleri, sayfa bağlamında koşan `baslikDizisiniTopla()`, rota döngüsünde dizi + atlama hesabı, `baslikToplam` sayaçları, üç yeni çıktı satırı, `totalIssues`'a atlama katkısı ve `kapsamSorunlari`'na taban eşiği. **Tek dosya, 96 satır eklendi 1 satır değişti** — `research/lib/` altına dokunulmadı: dal piksel ölçümüyle paylaşılan hiçbir veriyi kullanmıyor.

**Test Sonuçları:**
<!-- KURAL: Ölçüm kimliğiyle yazılır — ne çalıştırıldı ve hangi kapsamda. -->
- **Tam koşum (16 rota, hedef 3100 yayın kopyası, 1440×900, hareket azaltma açık):** 16 rota · **105 ekran adımı** · **1835 eleman** · **66 sn** · **BAŞLIK HİYERARŞİSİ: 316 görünür başlık (taban 316) · 1 sayfada 1 atlama** · **TOPLAM SORUN 57** · çıkış kodu **1**.
- **Devralınan bulgu birebir yeniden üretildi (kalibrasyon kolu):** `/olmayan-sayfa` dizisi **`h1 h3 h3 h3`**, teşhis satırı `✗ [başlık] h1 → h3 atlaması · "Bu sayfayı bulamadık" → "Ürün"`. B-031 kalem (4) hem diziyi hem kaynağı (Footer kolon başlıkları) birebir söylüyordu.
- **Regresyon kontrolü (pozitif kontrol): dalın açılması ötekini bozmadı.** TASK-3.05 tabanı 1835 eleman / 105 adım / 66 sn / gradyan 19-17 / yapışkan 151 / görünmez 43 / ekran dışı 0 / kalan 0 idi — **hepsi birebir aynı**; kontrast+gradyan ihlali **56**, yani `57 − 1 = 56` ve tek artış başlık atlamasından geliyor.
- **Belirlenimlilik:** iki ardışık tam koşum, süre satırı ve konteyner adı dışında **birebir aynı** (`diff` boş).
- **Kapı dört sondayla sınandı** — dördü de yerelde, kaynağa değil **girdiye** dokunarak (sahte statik hedef, 16 rota + mutlak `<loc>`'lu site haritası, port 3461, `BASE` ile yönlendirildi; her varyant kendi ağacında, 20 başlık + 2 gradyan metin/sayfa):
  1. **Bozuk girdi** — bir rotada `h1 → h4` sokuldu: **1 atlama**, teşhis satırı iki başlığı da bastı, **TOPLAM SORUN 1** (öteki eksenlerin hepsi 0 — ihlal yalıtıldı), çıkış **1**.
  2. **Yeşil ayak** — **aynı düzenek, yalnız o başlık `h2`ye indirildi**: 320 başlık · **0 atlama**, `✓ KAPI YEŞİL`, çıkış **0**. Kaynak değil girdi değiştirildi.
  3. **Boş kapsam / fail-open yalıtımı** — hiç görünür başlık yok (`h1` `aria-hidden`, yani `h1` sayımı 1 kalıyor): **TOPLAM SORUN 0 olduğu hâlde** `✗ KAPSAM EŞİĞİ: görünür başlık 0 ölçüldü < beklenen taban 316`, çıkış **1**.
  4. **Geriye dönüş + gizli başlık** — sayfa başına 6 geriye dönüş (h3 → h2) ve 3 gizli başlık (`display:none` · `aria-hidden` · `visibility:hidden`) `h3` ile `h2` arasına sokuldu: **0 atlama**, çıkış **0**. Muafiyetin iş gördüğü **karşı-ölçümle** kanıtlandı: aynı hedefte süzgeçsiz okuma **368 başlık · 16 atlama** veriyor, süzgeçli okuma **320 başlık · 0 atlama** — yani muafiyet olmasaydı 16 sahte ihlal doğardı.
  - Sunucu sondalardan sonra kapatıldı, kapanma **pozitif kontrolle** ölçüldü (port BOŞ → 200 → BOŞ).
- **Karşı-ölçüm — dizi ne zaman okunmalı:** gerçek hedefte (3100, 16 rota) tur **öncesi 316** = tur **sonrası 316**, farklı rota **yok**. Konum korundu ama gerekçe kod yorumunda ölçülen gerçeğe çekildi.
- **`npm test` (Vitest, `web` konteynerinde): 210 geçti + 2 atlandı** — iki env kapısı kapalı, arıza değil.
- **Kapsam:** yalnız **1440×900** ve yalnız **yayın kopyası** (3100); dizi **etkileşimsiz hâlde** okunuyor — açılmamış sekme/akordeon içindeki başlıklar kapsamda değil (B-015). Yayın kopyası bu turda **tazelenmedi**: site kodu değişmedi (yalnız `research/scripts/a11y.mjs`) ve 3100 HEAD'in sürümünde (site haritası `lastmod` **2026-09-24T12:28:32Z**, ölçüldü).

---

**Oluşturulma:** 2026-09-23
