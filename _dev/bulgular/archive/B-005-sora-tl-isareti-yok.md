# B-005: Sora fontunda ₺ yok

**Önem:** 🟡 | **Tip:** hata / tipografi | **Alan:** M5 — Font / M2 fiyat bölümleri
**Kaynak:** kickoff öncesi geliştirme oturumu (`glyph.mjs` ölçümü) | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: Fiyat rakamları ve ₺ aynı fontta.

Gözlenen: ₺ (U+20BA) sistem monospace yedeğine düşüyordu; glif genişliği ölçüldü, monospace ile birebir aynı.

## Kanıt

- `research/scripts/glyph.mjs`, `glyph2.mjs` ölçümleri

## Kök Neden Yönü

Sora'nın karakter kümesinde ₺ yok.

## Koruma Önerisi

`--font-display` yığınına Inter yedeği; `font-guard.mjs` kümede olmayan karakteri raporlar. Kural `docs/STYLE-GUIDE.md` → Tipografi.

## Çözüm Kaydı

`globals.css` `--font-display: "Sora", "Inter", …` (commit `cea41af` dönemi). Kapanış kapsamı: tüm fiyat gösterimleri; Inter yedeği kaldırılırsa sorun geri gelir.
