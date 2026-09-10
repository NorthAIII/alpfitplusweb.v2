# B-009: Logo geçici; favicon, app ikonu ve OG görseli ondan türüyor

**Önem:** 🟡 | **Tip:** dış-aktör | **Alan:** M5 — Görsel varlık hattı / M2 yerleşim
**Kaynak:** kickoff (DURUM.md açık işler) | **Tarih:** 2026-09-11
**Durum:** Açık — **hiçbir fazı kilitlemez**

## Gözlem

Beklenen: Kalıcı marka işareti.

Gözlenen: `src/components/layout/Logo.tsx` içinde üretilmiş geçici bir işaret var; `research/scripts/brand-assets.mjs` favicon, `apple-icon.png`, `opengraph-image.png` ve `twitter-image.png`'yi ondan türetiyor.

## Kanıt

- `src/components/layout/Logo.tsx`
- `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png`, `twitter-image.png` — üretilmiş

## Kök Neden Yönü

Tüzel kimlik ve logo çalışması proje dışında; kurucu kararı bekliyor.

## Koruma Önerisi

Kalıcı logo geldiğinde tek iş: `Logo.tsx` güncelle + `brand-assets.mjs` koştur + OG kontrastını `a11y.mjs` benzeri ölçümle doğrula. Elle png konmaz (M5 kuralı).

## Çözüm Kaydı

—
