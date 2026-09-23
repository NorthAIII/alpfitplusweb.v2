# TASK-3.05: Gradyanla boyanmış metin kapıda kendi dalı olur

**Durum:** ⬜ Bekliyor
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

- [ ] **1. Sınıfı tespit et**
  - Hesaplanmış stilde `-webkit-background-clip: text` (ya da `background-clip: text`) **ve** `color: transparent` olan metin düğümleri
  - Çapası: `src/app/globals.css` → `.text-gradient-sage` (kullanmadan önce `grep -n` ile yeniden konumlan)

- [ ] **2. En açık durağı çıkar**
  - `background-image` değerinden gradyan duraklarını ayrıştır, her durağı RGB'ye çevir, **görece parlaklığı en yüksek** olanı seç
  - Ata opaklık çarpımı burada da uygulanır (TASK-3.04'ün kuralı)

- [ ] **3. Zemine karşı sın**
  - Zemin, glif maskesinin altındaki gerçek pikselden okunur (TASK-3.04'ün çekirdeği yeniden kullanılır)
  - Eşik: büyük metin ≥ 3,0 (bu sınıfın tamamı 41,6-44 px / 700)

- [ ] **4. Kendi dalı olarak raporla**
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

- [ ] Kapı gradyanla boyanmış metni buluyor ve sayısını basıyor (beklenen ≈ 11 benzersiz)
- [ ] Ölçülen en kötü değer araştırmanın rakamıyla uyuşuyor: canvas üstünde ≈ **1,74:1**, canvas-soft üstünde ≈ **1,64:1**
- [ ] Eşik altı kalem varken çıkış kodu **1**
- [ ] Deneysel olarak `.text-gradient-sage`'in durakları koyulaştırıldığında dal yeşile dönüyor (dayanak bozulup kırmızı/yeşil geçişi gözlendi)
- [ ] Bu dal `skipped` sayısına karışmıyor — çıktıda ayrı satır

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
