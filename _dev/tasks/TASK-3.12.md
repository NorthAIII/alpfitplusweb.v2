# TASK-3.12: Desenli zemin ve kalan iki kontrast yüzeyi

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅

---

## Hedef

Kontrast ihlallerinin kalan üç yüzeyini kapatmak:

1. **`faint` desenli zemin üzerinde** — `bg-dotgrid` noktaları (`line-2`) glifin altına denk geldiğinde `p02` **4,06** / `min` 3,95 (gereken 4,5); `Chaos` bölümü. `globals.css` ve STYLE-GUIDE *"`faint` dört zeminde ≥ 4,71"* diyor — bu **beşinci** zemin.
2. **"Kulübünüzün diyetisyeni aynı platformda…"** — **3,47**
3. **Boks sayfasında "Gelmedi kolonu raporda ayrı"** — **3,65**

---

## Bağlam

B-032 kalem 4 + araştırmanın bulduğu iki yeni yüzey (`PHASE-3-ARASTIRMA.md` → devralınan iddiaların ölçüm tablosu, 3. satır (b) maddesi). Kullanıcı kararı: **ölçümün bulduğu kümenin tamamı düzelir**, kayıtlı beş kalem değil. Gerekçe: yeni kapı hepsini kırmızıya çevirecek; düzeltilmeyen kalem için kapıya adıyla muafiyet yazmak gerekirdi ve muafiyet listesi zamanla unutulur.

Kalem 2 ve 3'ün metinleri `src/content/` altında (`product.ts` ve `segments.ts`) ama **düzeltme metinde değil, onları çizen bölümün renginde**dir — metin taşınmaz, yeniden yazılmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 4 ve ölçüm yöntemi notu
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 3. satır
- `_dev/docs/STYLE-GUIDE.md` — `faint` tokenının "dört zeminde ≥ 4,71" beyanı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — `faint`'in desenli zemin üzerindeki kuralı (beyan bugün eksik)

---

## Alt Görevler

- [ ] **1. Desenli zemin kalemi**
  - Çözüm yönü: `faint` desenli zemin üzerinde kullanılmaz (bir tık koyu tokena geçilir) **ya da** desenin opaklığı düşürülür
  - Çapa: `Chaos` bölümü + `bg-dotgrid` yardımcı sınıfı (`grep -n` ile konumlan)

- [ ] **2. İki yeni yüzeyi kapıdan konumla**
  - Kapının teşhis satırı rotayı, metni ve renk değerlerini basıyor (TASK-3.03) — düzeltilecek sınıfı oradan bul, metinden değil
  - Metin çapaları yalnız tanıma içindir: `src/content/product.ts` diyetisyen gövdesi · `src/content/segments.ts` boks kalemi

- [ ] **3. Üçünü de ölç ve rakamı koda yaz**

---

## Etkilenen Dosyalar

```
src/app/globals.css                      # faint / desen opaklığı (gerekirse)
src/components/sections/Chaos.tsx        # desenli zemin üzerindeki metnin rengi
src/components/sections/<iki yüzey>      # kapı teşhisinden belirlenir
```

---

## Dikkat Noktaları

- **Metin dosyalarına dokunma.** `src/content/` tek kaynaktır; bu task renk düzeltir, cümle değiştirmez (metin tonu F1.2 kendi fazında).
- **`p02` katı ölçüttür**; `min` ve `med` de raporlanır ama yargıyı `p02` verir (desenli zeminde bilinçli seçim).
- **İki yeni yüzeyin dosyası plan anında bilinmiyor** — kapının teşhis satırından konumlanır. Tahminle düzeltme yapma (Çalışma Prensibi #11).
- **STYLE-GUIDE'ın `faint` beyanı bu task'la eksik kalıyor:** "dört zeminde ≥ 4,71" cümlesi beşinci zemini saymıyor. Beyan gerçeğe çekilir — bu bir doküman düzeltmesidir, kullanıcıya bildirilir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [ ] Üç kalemin üçü de `a11y.mjs`'te eşiğin üstünde; ölçülen `p02` değerleri task dokümanına yazıldı
- [ ] `Chaos` bölümünün görsel dokusu korunuyor (ekran görüntüsü karşılaştırması)
- [ ] 1440 · 390 · 320 px'te ölçüldü
- [ ] STYLE-GUIDE'ın `faint` beyanı ölçülen gerçeğe çekildi
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
