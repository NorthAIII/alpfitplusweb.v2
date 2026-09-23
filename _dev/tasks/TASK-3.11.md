# TASK-3.11: Gradyanla boyanmış metnin durakları koyulaştırılır

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.05 ✅

---

## Hedef

`.text-gradient-sage` ile boyanan başlık vurgularının en açık durağı açık zeminde **1,74:1** (canvas) / **1,64:1** (canvas-soft) — gereken 3,0. Gradyanın durakları AA'yı geçecek şekilde koyulaştırılır. Sınıf **11 benzersiz metinde**, 9 bölüm dosyasında kullanılıyor; düzeltme tek yerde (CSS sınıfı) yapılır.

---

## Bağlam

B-032 kalem 3. STYLE-GUIDE zaten *"açık zeminde `sage` metin olarak kontrastı geçmez"* diyor ve metin için `sage-ink` (`#2f5a2e`) emsalini kuruyor; `sage-br` ondan daha açık. Araştırma kayıtlı "5 yer" sayısını **11 benzersiz** olarak düzeltti.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 3
- `_dev/docs/STYLE-GUIDE.md` — marka tokenları, `sage-ink` emsali, "ölçümü rakamıyla yaz" geleneği
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (gradyan metin ayrı dal)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — gradyan metnin yeni durakları ve ölçülen kontrast

---

## Alt Görevler

- [ ] **1. Durakları yeniden seç**
  - Çapa: `src/app/globals.css` → `.text-gradient-sage` (⚠️ `grep -n` ile yeniden konumlan)
  - Gradyanın **en açık** durağı canvas ve canvas-soft zeminlerinde ≥ 3,0 verecek şekilde koyulaştırılır; marka hissi korunur (sage ailesi içinde kalınır)

- [ ] **2. On bir kullanım yerinin hepsinde ölç**
  - Sınıf 9 bölüm/sayfa dosyasında geçiyor; zeminler canvas ve canvas-soft arasında değişiyor — en kötü zemin belirleyicidir

- [ ] **3. Ölçülen rakamı CSS yorumuna yaz**

---

## Etkilenen Dosyalar

```
src/app/globals.css   # .text-gradient-sage duraklarının değerleri
```

---

## Dikkat Noktaları

- **Bu bir marka rengi kararıdır.** Vurgu, başlığın geri kalanından ayrışmaya devam etmeli; koyulaştırma vurguyu düz metne dönüştürürse alternatif ayrışma (ağırlık, alt çizgi deyimi) kullanıcıya getirilir.
- **Ölçüt en açık duraktır** (TASK-3.05'in kurduğu dal) — gradyanın ortalaması değil. Kapı bunu ölçer.
- **Metin değişmez.** `src/content/` dokunulmaz; bu bir renk düzeltmesidir (iddia sınırı ve metin tonu kapsam dışı).
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [ ] `a11y.mjs`'in gradyan metin dalı **0 eşik altı** veriyor; ölçülen en kötü değer task dokümanına yazıldı
- [ ] 11 benzersiz metnin hepsi ölçüldü (dal sayıyı basıyor — sayı düşerse seçici körleşmiştir)
- [ ] Vurgu başlığın geri kalanından gözle ayrışıyor (ekran görüntüsü, canvas ve canvas-soft zeminlerde)
- [ ] `font-guard.mjs` kümede olmayan karakter bulmuyor (renk değişikliği karakter getirmemeli, ama ölçüm atlanmaz)
- [ ] Beş ölçüm regresyon çizgisini koruyor

---

## Karar Noktaları

- **Koyulaştırma vurguyu öldürürse:** gradyanı korumak (ve metni büyük-metin eşiğiyle sınırlamak) vs. düz `sage-ink` rengine geçmek → kullanıcıya sorulacak.

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
