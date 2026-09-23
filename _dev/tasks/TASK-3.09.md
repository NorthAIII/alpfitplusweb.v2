# TASK-3.09: Ürün turunun soluk adım kartları AA'ya çıkar

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

Ürün turunun (`ProductStory`) etkin olmayan adım kartları masaüstünde kalıcı `lg:opacity-45` taşıyor ve içindeki üç metin katmanı da eşik altında kalıyor: **etiket 2,98-3,00**, **gövde 2,52-2,54**, ve araştırmanın bulduğu **başlıklar 1,13:1** (gereken 3). Üç katman da AA'ya çıkarılır. Kalem `/` ve `/ozellikler` sayfalarını, 16 elemanı etkiler.

---

## Bağlam

B-032 kalem 1. Kapı bu kartları bugüne dek **8,03-10,63:1** sanıyordu — ata opaklığını renge uygulamadığı için. TASK-3.04 o kör noktayı kapattı; bu task kapının artık gösterdiği ihlali kapatır.

Araştırma, kayıtlı beş kalemin **eksik** olduğunu ölçtü: soluk kartların **başlıkları** kayıttaki hiçbir rakamdan kötü — **1,13:1** ("Gün, tek ekranda" · "Şubeler yan yana"). Kullanıcı kararı: **hepsi düzelir.**

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 1 ve düzeltme seçenekleri
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 3. satır (küme neden daha geniş)
- `_dev/docs/STYLE-GUIDE.md` — token değerleri, "ölçümü rakamıyla CSS yorumuna yaz" geleneği

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — seçilen çözüm bir deyim kuruyorsa (soluk hâlin metin rengi) kaydı

---

## Alt Görevler

- [ ] **1. Üç katmanı ölç**
  - Etkin olmayan kartın etiketi (`text-sage-br`), başlığı ve gövdesi (`text-canvas/65`) — düzeltme öncesi değerleri yaz
  - Çapa: `src/components/sections/ProductStory.tsx` — `lg:opacity-45` ve içindeki metin sınıfları (⚠️ satır numaraları kaydı, `grep -n` ile yeniden konumlan)

- [ ] **2. Çözümü seç ve uygula**
  - Seçenek A: soluk hâlin opaklığı ≥ 0,7'ye çıkar (tek değişiklik, üç katmanı birden etkiler)
  - Seçenek B: soluk hâl için metin renkleri ayrıca seçilir (opaklık korunur, görsel ayrım daha belirgin kalır)
  - Karar ölçütü: etkin/etkin-olmayan ayrımı gözle korunmalı **ve** üç katman da eşiği geçmeli

- [ ] **3. Ölçülen rakamı koda yaz**
  - Seçilen değerin yanına kontrast rakamı yorum olarak (mevcut token yorumlarının kurduğu gelenek)

---

## Etkilenen Dosyalar

```
src/components/sections/ProductStory.tsx   # soluk adım kartlarının opaklığı / metin renkleri
```

---

## Dikkat Noktaları

- **Görsel ayrım kaybolmamalı.** Ürün turunun anlatısı etkin adımın öne çıkmasına dayanıyor; opaklığı yükseltmek ayrımı zayıflatırsa Seçenek B'ye geç.
- **Ölçüm masaüstünde (≥ lg) yapılır** — kalem yalnız orada doğuyor; mobilde kartlar `bg-white/5 ring-white/10` ile ayrı bir deyim kullanıyor ve o hâl ayrıca ölçülmeli.
- **Kapı yayın kopyasını ölçüyor:** düzeltmeyi gördükten sonra `docker compose build web-prod` **ve** `docker compose --profile prod up -d web-prod` — yalnız `build` konteyneri tazelemez. Ara doğrulama için `BASE=http://localhost:3000` ile geliştirme sunucusuna yönlendirebilirsin.
- **Bu bölüm `priority` ve `opacity-0` kalemlerini de taşıyor** (TASK-3.20 ve TASK-3.21) — onlara bu task'ta dokunma, aynı dosyada olsalar bile.

---

## Test Kriterleri

- [ ] `a11y.mjs` koşumunda ürün turunun soluk kart kalemleri (etiket · başlık · gövde) **eşiğin üstünde**; ölçülen rakamlar task dokümanına yazıldı
- [ ] `/` ve `/ozellikler`'de bu sınıftan eşik altı eleman **0**
- [ ] Etkin / etkin olmayan adım ayrımı 1440 px'te gözle korunuyor (ekran görüntüsü ile karşılaştırıldı)
- [ ] Mobil (390 px) hâlinde de eşik altı yok
- [ ] Beş ölçümün geri kalanı regresyon çizgisini koruyor (a11y, mobil, font, tarama)

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
