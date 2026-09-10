# B-003: Ana sayfa mobilde yatay kayıyordu (635 px / 390 px)

**Önem:** 🔴 | **Tip:** hata | **Alan:** M2 — Ana sayfa
**Kaynak:** kickoff öncesi geliştirme oturumu (`mobile-audit.mjs`) | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: 390 px'te yatay kaydırma yok (M2 F2.1 kabul kriteri).

Gözlenen: Belge genişliği 635 px; bir ızgara öğesi içerik sütununu şişiriyordu.

## Kanıt

- `mobile-audit.mjs` çıktısı: yatay kaydırma var, 635/390

## Kök Neden Yönü

Grid çocuğunun `min-width: auto` varsayılanı; uzun içerik sütunu daraltmıyor.

## Koruma Önerisi

Izgara çocuğuna `min-w-0`; `mobile-audit.mjs` her değişiklikte koşar (M6). Kural `docs/STYLE-GUIDE.md` → Düzen Tuzakları.

## Çözüm Kaydı

`min-w-0` eklendi, ölçüldü: yatay kaydırma 0 (commit `22a9a9a`). Kapanış kapsamı: ana sayfa 390 px; diğer 15 sayfa başlangıç ölçümünde de temiz.
