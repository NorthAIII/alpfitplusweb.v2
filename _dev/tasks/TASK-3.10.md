# TASK-3.10: Kapanış çağrısı paragrafı gradyan bant üzerinde AA'ya çıkar

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

`FinalCta`'nın kapanış paragrafı (`text-ink-deep/75`) gradyan bant üzerinde eşik altında: 1440 px'te `p02` **3,97** / `min` 3,83-3,90; 390 px'te `p02` **3,59-3,62** / `min` **3,48** (gereken 4,5). **Tek değişiklik beş sayfayı birden düzeltir** — ana sayfa + dört segment sayfası.

---

## Bağlam

B-032 kalem 2. Kapı gradyan zemini atlıyordu; TASK-3.04 sonrası görünür oldu. En kötü değer **mobilde** (3,48), yani düzeltme 1440'ın yanında 390 ve 320 px'te de ölçülmeli.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 2
- `_dev/docs/STYLE-GUIDE.md` — mürekkep tokenları

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [ ] **1. Paragrafın rengini opaklaştır**
  - `text-ink-deep/75` → tam opak `ink-deep` (B-032'nin önerdiği yön); çapa `src/components/sections/FinalCta.tsx` (⚠️ `grep -n` ile yeniden konumlan)
  - Opaklık kaldırılınca hiyerarşi bozuluyorsa alternatif: paragrafın altındaki gradyan bandın en açık durağını koyulaştır

- [ ] **2. Beş sayfada da ölç**
  - `/` ve dört segment sayfası; 1440 · 390 · 320 px

---

## Etkilenen Dosyalar

```
src/components/sections/FinalCta.tsx   # kapanış paragrafının rengi
```

---

## Dikkat Noktaları

- **Başlık ile paragraf arasındaki görsel hiyerarşi**: paragraf tam opak olunca başlıkla aynı ağırlıkta görünebilir. Hiyerarşi punto ve ağırlıkla korunur, opaklıkla değil — STYLE-GUIDE'ın `faint` geleneği de koyulaştırma yönünde.
- **`p02` katı ölçüttür** (en kötü %2 piksel) ve desenli/gradyan zeminlerde bilinçli olarak öyle seçildi. `min` ve `med` de raporlanır; yargıyı `p02` verir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod` (yalnız `build` yetmez).

---

## Test Kriterleri

- [ ] `a11y.mjs`'te kapanış paragrafı kalemi beş sayfanın hepsinde eşiğin üstünde; `p02` değeri task dokümanına yazıldı
- [ ] En kötü hâl olan 390 px'te de eşik geçiliyor (eski değer 3,48)
- [ ] 320 px'te ölçüldü
- [ ] Başlık-paragraf hiyerarşisi gözle korunuyor (ekran görüntüsü)
- [ ] Beş ölçüm regresyon çizgisini koruyor

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
