# TASK-3.14: 320 px'te kesilen içerik ve işlev — `Button` tabanı ve `FounderProgram` ızgarası

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri · F2.1 Ana sayfa
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.07 ✅

---

## Hedef

320 px'te ana sayfanın `FounderProgram` bölümü 19 metin düğümünü ve **CTA'nın kendi etiketini** kesiyor — yani yalnız içerik değil **işlev** kaybı var: "Kurucu Programı için konuşalım" düğmesinin yazısı okunmuyor. İki düzeltme **birlikte** yapılır; yalnız biri uygulanırsa kusur biçim değiştirir.

---

## Bağlam

B-033'ün bisect ile kanıtlanmış kök neden zinciri:

```
Button.tsx temel sınıfında `whitespace-nowrap`
  → CTA etiketinin min-content'i 314 px (kırılamaz)
  → p-7 kartı içinde 370 px taban
  → FounderProgram ızgara çocuklarında `min-w-0` yok (min-width:auto)
  → track 370'te kilitleniyor
  → bölümün `overflow-hidden`'ı sağdan 70 px kesiyor
```

Üç mekanizmanın hiçbiri tek başına hata değil — **bileşimi** hata. Deney: ızgara çocuklarına `min-width: 0` → grid 370 → 280, kalan metin kırpması 0 px. ⚠️ **Yalnız `min-w-0` uygulanırsa** kırpma biter ama etiket buton kutusundan taşar (ölçüldü) — bu yüzden `whitespace-nowrap` de ele alınır.

**Sınıfın genişliği ölçüldü:** 11 rotadaki `nowrap` buton/linklerin min-content'i tarandı; 280 px'i aşan **tek** buton bu. Ama pay ince — sıradaki beş 240-247 px ("Geçiş planını konuşalım" 247, "WhatsApp'tan sorun" 246, "Demo talebi gönder" 242). Bunlar yalnızca dolgusuz kapta durdukları için sığıyor. **Taban `Button`'dadır, bölümde değil.**

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md` — kök neden zinciri ve bisect
- `_dev/docs/STYLE-GUIDE.md` — Düzen Tuzakları #2 (`min-w-0`) ve #1 (sticky + `overflow-hidden`)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — `whitespace-nowrap`'in yeni sınırı (deyim değişiyorsa kaydı)

---

## Alt Görevler

- [ ] **1. `Button`'ın `whitespace-nowrap`'ini sınırla**
  - Çapa: `src/components/ui/Button.tsx` temel sınıfı (⚠️ `grep -n whitespace-nowrap` ile konumlan)
  - İki yol: sınıfı tamamen kaldırmak ya da `sm:` ile sınırlamak (dar telefonda etiket sarar, geniş ekranda tek satır kalır)
  - Değişiklik **her butonu** etkiler — 11 rotada gözle ve ölçümle doğrulanır

- [ ] **2. `FounderProgram` ızgara çocuklarına `min-w-0`**
  - Çapa: `src/components/sections/FounderProgram.tsx` ızgara kabı (⚠️ `grep -n "grid gap"` ile konumlan)

- [ ] **3. Sınıfın kalanını tara**
  - 240-247 px'lik beş buton dolgulu bir kaba girmiş mi — `mobile-audit.mjs` 320 px koşumu bunu zaten gösterir; kalan varsa aynı task'te kapatılır

---

## Etkilenen Dosyalar

```
src/components/ui/Button.tsx                    # temel sınıftaki whitespace-nowrap
src/components/sections/FounderProgram.tsx      # ızgara çocuklarına min-w-0
```

---

## Dikkat Noktaları

- **İkisi birlikte uygulanır.** Yalnız `min-w-0`: kırpma biter, etiket taşar. Yalnız `nowrap` kaldırma: etiket sarar ama başka dar kaplarda taban sorunu sürer.
- **`whitespace-nowrap` bir ilkelin temel sınıfında** — değişiklik sitenin her butonunu etkiler. Sarma davranışı istenmeyen yerler (tek kelimelik butonlar zaten sarmaz) gözle taranır.
- **Bölümün `overflow-hidden`'ına dokunma.** Kaldırmak kırpmayı yatay kaydırmaya çevirir; sorun yer değiştirir, çözülmez. (STYLE-GUIDE Düzen Tuzakları #1 sticky için ayrı bir kural koyuyor — bu bölüm sticky değil.)
- **Kapı zaten kurulu:** TASK-3.07 sonrası `mobile-audit.mjs` 320 px'te bu 19 düğümü sayıyor. Düzeltmenin ölçütü o sayının **0'a** inmesidir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.

---

## Test Kriterleri

- [ ] `mobile-audit.mjs` 320 px'te kırpılmış metin düğümü **0** (eski değer 19)
- [ ] 320 px'te "Kurucu Programı için konuşalım" etiketi tümüyle okunuyor ve butonun kutusundan taşmıyor (ekran görüntüsü)
- [ ] 390 · 768 · 1440 px'te düzen bozulmadı; hiçbir genişlikte yatay kaydırma yok
- [ ] `nowrap` kaldırılan butonların hiçbirinde istenmeyen sarma yok (11 rota gözle tarandı)
- [ ] %400 büyütmede (320×256) kırpılan düğüm sayısı ölçüldü ve TASK-3.02'nin tabanıyla karşılaştırıldı
- [ ] Beş ölçüm regresyon çizgisini koruyor

---

## Risk ve Geri Dönüş Planı

- **Risk:** `whitespace-nowrap` kaldırmak beklenmeyen bir yerde iki satırlık buton üretir → 11 rotada gözle tarama; sorunlu yer varsa o çağrıya yerel `whitespace-nowrap` verilir (taban değil, çağrı düzeyinde).
- **Rollback:** iki dosya, dosya bazlı geri alınır.

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
