# M2: Sayfalar ve Bölümler

**Sorumluluk:** Rotaları (`src/app/*`), sayfa bölümlerini (`src/components/sections/*`, 22 bölüm), yerleşim (`layout/*`) ve UI ilkellerini (`ui/*`) sunmak; içeriği M1'den, görselleri M5'ten alıp çizmek.
**Bağımlılık:** M1 (metin/fiyat), M5 (ürün görseli, fotoğraf, font)
**Sınır:** Görünen sayfa ve bileşenler. Demo formunun sunucu tarafı M3, asistan M4, sitemap/robots/güvenlik başlıkları M7. Tasarım kuralları `docs/STYLE-GUIDE.md`'de — burada tekrarlanmaz.

---

## Feature'lar

### F2.1: Ana sayfa → Phase —

**Açıklama:** 15 bölüm sırayla: hero · marquee · kaos (sorun) · çözüm · roller · modüller · ürün turu (yapışkan) · faydalar · neden biz · segmentler · nasıl çalışır · fiyat + hesaplayıcı · kurucu programı · SSS · kapanış CTA. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- 390 px genişlikte yatay kaydırma yok (`mobile-audit.mjs`)
- Kontrast ihlali 0, tek h1, tüm görsellerde alt metni (`a11y.mjs`)
- Yapışkan ürün turu 1440 px ve 390 px'te çalışıyor (üst katmanda `overflow-hidden` yok)
- Sayfa ağırlığı masaüstü ≤ 150 KB, LCP yerel üretimde < 1 s (`perf.mjs`)

**Bağımlılık:** M1 F1.1, M5 F5.1–F5.3

**Edge Case'ler:**
- Mobilde sayfa ~26.000 px; kısaltma kararı kullanıcıda — `BULGULAR.md` Gelen Kutusu
- Hesaplayıcıda şube sayısı 0 veya negatif girilirse `monthlyFor()` 1'e sabitler

---

### F2.2: Alt sayfalar → Phase —

**Açıklama:** Özellikler, fiyat, segmentler + 4 segment (`[slug]`), geçiş, yazılım seçerken, demo, destek, gizlilik, KVKK, kullanım koşulları, 404. `PageHero` ve `LegalPage` ortak bölümler. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- 16 sayfanın hepsinde `a11y.mjs` 0 sorun, `font-guard.mjs` eksik karakter yok
- Her sayfanın `metadata` (title, description, canonical) tanımlı; `sitemap.ts` hepsini listeler
- Geçersiz segment slug'ı 404'e düşer

**Bağımlılık:** M1

**Edge Case'ler:**
- Yeni rota klasörü eklendiğinde bind-mount'ta Turbopack yakalamaz — `docker compose restart web`
- Yasal sayfalar M1 `legal.ts`'ten okur; hukukçu onayı geldiğinde yalnız içerik değişir

---

### F2.3: Ortak yerleşim ve UI ilkelleri → Phase —

**Açıklama:** Header (nav + CTA), Footer (Kiwi AI Lab bandı dâhil), Logo (geçici işaret), Button/Card/Container/Section/Reveal/Frames/Icon. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Tüm link ve butonlar erişilebilir adla (`a11y.mjs` "adsız link/buton" 0)
- Dokunma hedefleri ≥ 44 px (`mobile-audit.mjs`)
- Reveal animasyonu `prefers-reduced-motion` ile devre dışı kalır

**Bağımlılık:** Yok

**Edge Case'ler:**
- Logo geçici; favicon, app ikonu ve OG görseli ondan türetiliyor — logo değişince `brand-assets.mjs` yeniden koşar (`BULGULAR.md` B-009)

---

## Teknik Notlar

- Bileşenler metin **taşımaz**, `src/content/`'ten okur. Metin değişikliği bileşene dokunmaz (M1 F1.2).
- Başlangıç ölçümü (2026-09-11) `modules/M6-Kalite-Kapilari.md` → Teknik Notlar'da.
