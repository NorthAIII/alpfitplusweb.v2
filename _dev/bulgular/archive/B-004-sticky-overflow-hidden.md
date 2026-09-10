# B-004: `position: sticky` iki bölümde de ölüydü

**Önem:** 🟡 | **Tip:** hata | **Alan:** M2 — Ürün turu ve bir bölüm daha
**Kaynak:** kickoff öncesi geliştirme oturumu | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: Yapışkan ürün turu kaydırırken sabit kalır.

Gözlenen: Sticky hiç yapışmıyordu, konsolda hata yok.

## Kanıt

- Üst katmandaki `overflow-hidden` sınıfı

## Kök Neden Yönü

Bir atada `overflow` `visible` dışı olunca sticky sessizce devre dışı kalır (CSS spesifikasyonu).

## Koruma Önerisi

Sticky bölümün atalarında `overflow-hidden` yok — `docs/STYLE-GUIDE.md` → Düzen Tuzakları. Otomatik kontrol yok; `scan.mjs` ekran gezisi görsel doğrulama sağlar.

## Çözüm Kaydı

`overflow-hidden` üst katmandan kaldırıldı, taşma bölüm içinde çözüldü (commit `252c668`). Kapanış kapsamı: iki bölüm.
