# B-001: Eski kulüp logosu 8 ürün ekranının 8'inde duruyordu

**Önem:** 🔴 | **Tip:** hata / iddia sızıntısı | **Alan:** M5 — Ürün ekran görüntüsü hattı
**Kaynak:** kickoff öncesi geliştirme oturumu | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: Ürün görsellerinde eski marka ("Weekend Plus") ve pilot stüdyonun logosu görünmez (`docs/CLAIMS.md`).

Gözlenen: Sekiz ekranın hepsinde eski kulüp logosu duruyordu; metin denetimi göremedi çünkü logo bir `<img>` idi.

## Kanıt

- `research/scripts/render-product.mjs` metin tabanlı denetim — `<img>` kaynağını taramıyordu
- `public/product/*.webp` — 8/8 logo

## Kök Neden Yönü

Denetim yalnız DOM metnine bakıyordu; görsel öğe sızıntısı kapsanmamıştı.

## Koruma Önerisi

Görsel denetim (img src / alt taraması + kaldırma tablosu) eklendi; sızıntıda üretim durur.

## Çözüm Kaydı

`render-product.mjs`'e görsel denetim ve logo düğümü kaldırma eklendi; 8 ekran yeniden üretildi, denetim temiz (commit `bbcce04`). Kapanış kapsamı: `../Alpfit.v1/demo` içindeki 8 ekran. `churn.html` ve `kampanya.html` kapsam dışı (Bilinçli Tercihler).
