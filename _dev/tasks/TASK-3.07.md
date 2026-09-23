# TASK-3.07: Kırpılmış taşma dedektörü, 320 px genişliği ve kaydırılabilir şerit ölçütü

**Durum:** ⬜ Bekliyor
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

- [ ] **1. 320 px genişliğini ekle**
  - Betik 320 ve 390 px'te koşar; her genişlik ayrı raporlanır (bugünkü tek genişlik 390)

- [ ] **2. Kırpılmış taşma dedektörü**
  - Ölçüt: metin taşıyan düğümün sınır kutusu, onu **kırpan** atasının kutusunun dışına taşıyor mu
  - Taşma miktarı (px) ve düğümün metni (ilk 40 karakter) raporlanır

- [ ] **3. Muafiyet kuralı**
  - Kırpan ata `overflow-x: auto|scroll` ise **muaf**
  - Düğümün ata zincirinde **çalışan bir CSS animasyonu** varsa muaf (kayan tanıtım şeridi)
  - Muaf sayılanlar **ayrı bir sayıda** raporlanır, gizlenmez
  - **Bilinçli ekran-dışı yüzey muaf sayılır ve ayrı sayılır.** Bu, yeni kırpma dalının değil betiğin **bugünkü yatay taşma dalının** kalemidir (`overflow` dizisi): demo formundaki bal küpü `absolute left-[-9999px]` + `aria-hidden` ile ekran dışında duruyor ve üç düğümü (`div` · `label` · `input`) `rc.left < -1.5` koşulunu sağlayıp `overflowCount`'a giriyor. Ölçüt kalıp değil **beyan** olsun: `aria-hidden` taşıyan ve ekranın tamamen dışında (sağ kenarı 0'ın solunda) kalan altağaç muaftır

- [ ] **4. Kaydırılabilir şerit ölçütü**
  - Kaydırılabilir bir kapta **tek bir çocuk öğe** kabın görünür genişliğinden genişse ihlal
  - Çapası: `Roles.tsx` sekme şeridi — kartlar `shrink-0` ve genişlikleri sabit `[360,360,360,358]`, 320 px'te tek kart pencereden geniş (`grep -n` ile yeniden konumlan)

- [ ] **5. Eşikle ve dosya başlığını gerçeğe çek**
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

- [ ] Betik 320 ve 390 px'te koşuyor; her genişlik ayrı raporlanıyor
- [ ] 320 px'te **19** gerçek kırpılmış metin düğümü, 390 px'te **0** ölçülüyor (araştırmanın rakamı yeniden üretildi; sapma varsa gerekçesiyle)
- [ ] Muaf sayılan kalemler ayrı sayıda görünüyor (muafiyetsiz hâlin ≈ 59 sahte pozitif ürettiği kontrollü koşumda gözlendi)
- [ ] Roller şeridi ölçütü 320 px'te ihlal veriyor, 390 px'te vermiyor
- [ ] Geçici `min-w-0` deneyi kırmızıyı yeşile çeviriyor; geri alınınca kırmızı dönüyor
- [ ] Gerçek kırpılmış düğüm varken çıkış kodu **1**
- [ ] `/demo`'da bal küpünün üç düğümü taşma sayısından düştü ve muaf sayıda göründü; **bu sayfada başka taşma kalemi yoksa `/demo` temiz** (eski hâlde `overflowCount` 3'tü)
- [ ] Muafiyet beyana bağlı, kalıba değil: deneysel olarak `aria-hidden` kaldırıldığında üç düğüm **geri sayılıyor**

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
