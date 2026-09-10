# B-006: Fontlar sayfa ağırlığının %82'siydi (219 KB)

**Önem:** 🟡 | **Tip:** performans | **Alan:** M5 — Font daraltma
**Kaynak:** kickoff öncesi geliştirme oturumu (`perf.mjs`) | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: Font yükü sayfa ağırlığında makul pay.

Gözlenen: Her ağırlık için latin + latin-ext ayrı iniyordu, latin-ext Latin Extended-A/B'nin tamamını taşıyordu: 10 dosya / 219 KB, ağırlığın %82'si.

## Kanıt

- `perf.mjs` çıktısı, ağ kaydı

## Kök Neden Yönü

Hazır Google Fonts alt kümeleri site için fazla geniş.

## Koruma Önerisi

Siteye özel daraltma (`font-subset.mjs`) + kapsama denetimi (`font-guard.mjs`); `perf.mjs` ağırlık eşiği.

## Çözüm Kaydı

153 karakter, 5 dosya, 95 KB; ana sayfa masaüstü 144 KB (commit `cea41af`). Kapanış kapsamı: 16 sayfa, `font-guard` eksik karakter yok.
