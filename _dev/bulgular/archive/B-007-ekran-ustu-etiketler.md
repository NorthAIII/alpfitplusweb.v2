# B-007: Ekran üstü açıklama etiketleri gösterdikleri sayıları örtüyordu

**Önem:** 🟢 | **Tip:** öneri-ui-ux | **Alan:** M2 — Ürün turu
**Kaynak:** kickoff öncesi geliştirme oturumu | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: Açıklama, gösterdiği ekran öğesini görünür bırakır.

Gözlenen: Ekran görüntüsünün üstüne bindirilen etiketler tam da anlattıkları rakamları kapatıyordu. Hero'da telefon etiketi de telefonun üstüne biniyordu (ayrı düzeltme, commit `c68fd32`).

## Kanıt

- `ProductStory.tsx` etiket konumları, `Hero.tsx`

## Kök Neden Yönü

Etiketler görsel üstünde mutlak konumlanmıştı; içerik değişince çakıştı.

## Koruma Önerisi

Numaralı nokta + kenarda açıklama deseni (`docs/STYLE-GUIDE.md` → Düzen Tuzakları); `scan.mjs` görsel gezi.

## Çözüm Kaydı

Etiketler numaralı noktaya çevrildi (commit `252c668`), hero etiketi ayrı grid alanına alındı (`c68fd32`). Kapanış kapsamı: ürün turu ve hero.
