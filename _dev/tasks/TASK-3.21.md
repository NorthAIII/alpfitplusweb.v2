# TASK-3.21: Geçiş görselleri erişilebilirlik ağacından düşer, dekoratif bantların alt metni boşalır

**Durum:** ⬜ Bekliyor
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

- [ ] **1. `opacity-0` görselleri ağaçtan düşür**
  - `aria-hidden` (ya da `inert`) eklenir; çapa `src/components/sections/ProductStory.tsx` (⚠️ `grep -n "opacity-0"` ile konumlan)
  - Aktif görsel ağaçta kalır — geçiş bittiğinde doğru görselin okunduğu doğrulanır

- [ ] **2. Dekoratif bantların alt metnini boşalt**
  - `/gecis` bandı · `HowItWorks` bandı · segment kahramanı → `alt=""`
  - Ölçüt: görsel bilgi taşıyor mu, yoksa doku mu? Doku ise boş alt

- [ ] **3. Tekrarlayan alt metinleri say**
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

- [ ] `/` ve `/ozellikler`'de erişilebilirlik ağacında yalnız **aktif** ürün ekranının alt metni görünüyor (öncesi: 5 ekran arka arkaya)
- [ ] `/` sayfasında hiçbir ürün ekranının alt metni tekrarlanmıyor (öncesi: cockpit 3×, diğerleri 2×)
- [ ] Üç dekoratif bant `alt=""` taşıyor ve `a11y.mjs`'in "alt metni yok" kontrolü onları hata saymıyor
- [ ] `a11y.mjs` 16 rotada eşik altı 0, çıkış kodu 0; ölçülen eleman sayısı kapsam eşiğinin üstünde
- [ ] Bilgi taşıyan hiçbir görselin alt metni boşaltılmadı (liste task dokümanında gerekçeli)

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-23
