# TASK-3.20: `priority`, `sizes` ve hi-dpi varyant tavanı gerçek yerleşime çekilir

**Durum:** ⬜ Bekliyor
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md) · M2 kullanımı
**Feature:** F5.1 Ürün ekran görüntüsü hattı · F2.1/F2.2 sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.18 ✅ · TASK-3.19 ✅

---

## Hedef

Görsel teslim katmanının üç ölçülmüş sapmasını kapatmak:

1. **`priority` mobilde görünmeyen bir görselde.** `ProductStory`'nin `priority={i === 0}` taşıyan `<Image>`'ı `hidden lg:block` içinde — 390 ve 768 px'te preload edilen görsel `display:none`. `/ozellikler`'de bu, mobilde **sayfadaki tek görsel preload'u**; gerçekten görünen ilk ürün ekranı `loading="lazy"`. `/segmentler`'in ilk kart görseli 768 px ve üstünde ekran üstüne giriyor ama `lazy` — Next onu LCP elemanı seçip **uyarı basıyor**.
2. **`sizes` beyanları gerçek yerleşimin üstünde:** `Frames.tsx` `62vw` ↔ gerçek 45,8vw · `ProductStory.tsx` `58vw` ↔ 52,8vw · `SegmentsGrid.tsx` `42vw` ↔ 37vw.
3. **Hi-dpi varyant tavanı:** altı kullanım yeri gereken pikselin altında (oranlar 0,56-0,79), biri ise **2,05 fazla** teslim alıyor. Bant slotlarına 3:2 kaynaklar `object-cover` ile giriyor ve dikey pikselin %40-60'ı atılıyor — oysa hattın ürettiği **2000×760 bant varyantı (`salon-genis-wide.webp`) hiç kullanılmıyor**.

---

## Bağlam

B-046 kalem (1) ve (6). Kök neden: `priority` ve `sizes` beyanları yazıldıkları anda doğruydu ama yerleşim sonradan kırılıma bağlandı (`hidden lg:block`) ve beyan güncellenmedi — kimse mobilde ne preload edildiğine bakmadı.

**Ölçüm yöntemi uyarısı:** gerçek teslim `_next/image` yanıtı `sharp` ile açılarak ölçülür. `naturalWidth` srcset altında yoğunluğa bölündüğü için **yanıltıcıdır** — o yöntem 10 örnekte doğrulanıp atıldı.

**Temiz çıkanlar korunur:** ham `<img>` yok (0/0), boyut bildirimi tam (yapısal CLS riski sıfır), AVIF devrede (48/48), kırık varlık yok (22/22).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (1) ve (6), teslim tablosu
- `_dev/bulgular/B-047-bakim-borcu-envanteri.md` — `salon-genis-wide.webp`'in öksüzlüğü
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.2 fotoğraf hattı
- `_dev/QUALITY.md` — 4 Performans

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [ ] **1. `priority`'yi gerçekten görünen görsele taşı**
  - Mobilde ürün turunun mobil kartı, masaüstünde yapışkan sütun
  - `/segmentler`'in ilk kartı 768 px ve üstünde `priority` alır
  - Çapa: `src/components/sections/ProductStory.tsx` · `src/components/sections/SegmentsGrid.tsx` (⚠️ `grep -n "priority"` ile konumlan)

- [ ] **2. `sizes` değerlerini ölçülen yerleşime çek**
  - `Frames.tsx` · `ProductStory.tsx` · `SegmentsGrid.tsx`

- [ ] **3. Bant slotlarına doğru varyantı ver**
  - `public/foto/salon-genis-wide.webp` (2000×760) bugün öksüz; bant slotları (`/gecis` `h-48` → 3:1, `HowItWorks` `h-56` → 2,43:1) onu kullanır
  - `-sm` varyantlarının kaynak genişliği kullanım boyutuna göre yeniden seçilir; gerekirse `photos-build.mjs` yeniden koşar

- [ ] **4. Fazla teslimi kıs**
  - Roller telefon çerçevesi 640 px alıyor, gereken 312 — `sizes` düzeltmesi bunu kendiliğinden çözmeli, doğrula

---

## Etkilenen Dosyalar

```
src/components/sections/ProductStory.tsx   # priority + sizes
src/components/sections/SegmentsGrid.tsx   # priority + sizes
src/components/ui/Frames.tsx               # sizes
src/components/sections/HowItWorks.tsx     # bant slotu varyantı
src/app/gecis/page.tsx                     # bant slotu varyantı
research/FOTOGRAF-KAYNAKLARI.txt           # yeni varyant üretilirse kaynak kaydı
```

---

## Dikkat Noktaları

- **Görsel elle konmaz.** Yeni bir varyant gerekiyorsa `photos-build.mjs` üretir; `public/foto/` betik çıktısıdır (CLAUDE.md → Dokunulmazlar). Önce `research/FOTOGRAF-KAYNAKLARI.txt`'ye kaynak yazılır, sonra betik koşar.
- **`naturalWidth` ile ölçme** — srcset altında yoğunluğa bölünür ve yanıltır. Teslimi `_next/image` yanıtını `sharp` ile açarak ölç.
- **`next/image` `src`'i URL-kodlar** — `img[src*="/product/"]` seçicisi hiç eşleşmez (ölçülmüş tuzak). Doğrulama betiğinde eşleşme sayısını bas.
- **Yapısal CLS riski bugün sıfır** — boyut bildirimi tam. `sizes` değişikliği bunu bozmamalı.
- **Ölçüm yayın kopyasına karşı** — `docker compose --profile prod up -d web-prod`; `perf.mjs` zaten 3100'e bakıyor.
- **Regresyon çizgisi bu fazda değişmez** (B-035 kapsam dışı): `perf.mjs`'in ağırlık muhasebesi ve yeniden ölçüm "Kalite kapıları otomatik" fazında. Burada öncesi/sonrası kıyası bu task'ın kendi ölçümüdür.

---

## Test Kriterleri

- [ ] 390 ve 768 px'te preload edilen görsel **gerçekten görünen** görsel (ölçüldü: preload listesi + `display` durumu)
- [ ] Next'in "`Image with src … was detected as the Largest Contentful Paint`" uyarısı `/segmentler`'de düşmüyor
- [ ] Üç `sizes` beyanı ölçülen yerleşimin ±%10'u içinde
- [ ] Altı kullanım yerinin teslim/gereken oranı ≥ 1,0; fazla teslim (2,05) 1,0-1,3 aralığına indi
- [ ] Bant slotları 2000×760 varyantını kullanıyor; dikey piksel kaybı ölçüldü ve düştü
- [ ] `perf.mjs` öncesi/sonrası ölçüldü; sayfa ağırlığı ve LCP rakamlarıyla task dokümanında
- [ ] `scan.mjs` konsol temiz; kırık varlık yok

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
