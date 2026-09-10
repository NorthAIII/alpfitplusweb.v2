# M6: Kalite Kapıları

**Sorumluluk:** Erişilebilirlik, mobil, font kapsaması, performans, konsol temizliği ve iddia sızıntısını **ölçmek** ve eşik altı değişikliği durdurmak.
**Bağımlılık:** M7 (CI yayın hattına bağlanır; perf üretim konteynerine karşı koşar)
**Sınır:** `research/scripts/` ölçüm betikleri (a11y, mobile-audit, font-guard, perf, scan), ileride tek komut + GitHub Actions + metin sızıntı denetimi. Görsel üretim betikleri M5'tir (render-product'ın kendi denetimi M5'te kalır).

---

## Feature'lar

### F6.1: Beş ölçüm betiği → Phase —

**Açıklama:** `a11y.mjs` (kontrast, h1, alt, adsız link/buton), `mobile-audit.mjs` (yatay kaydırma, dokunma hedefi), `font-guard.mjs` (kapsama, üretim konteynerine karşı), `perf.mjs` (TTFB, FCP, LCP, CLS, ağırlık), `scan.mjs` (ekran ekran gezme, konsol hatası). Hepsi elle koşuyor. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Her betik geçme şartını çıktıda açıkça yazar (TOPLAM SORUN: 0 / yatay kaydırma: yok / eksik karakter yok / konsol temiz)
- Eşik altı durumda sıfır-olmayan çıkış kodu döner

**Bağımlılık:** Yok

**Edge Case'ler:**
- `perf.mjs` ve `font-guard.mjs` üretim konteyneri (3100) ayakta değilse anlamlı ölçmez — betik bunu söyleyerek durmalı

---

### F6.2: Tek komut → Phase —

**Açıklama:** Beş ölçüm (ileride chat test seti ve sızıntı denetimi) tek komutla sırayla koşar, tek özet tablo basar. "Kalite kapıları otomatik" faz konusu.

**Kabul Kriterleri:**
- `npm run check` (veya eşdeğer) tüm betikleri koşar; biri kırmızıysa komut kırmızı
- Özet tablo her betiğin geçme şartını ve ölçülen değeri gösterir
- Yerelde üretim konteynerini kendisi ayağa kaldırır ya da yoksa net hata verir

**Bağımlılık:** F6.1

**Edge Case'ler:**
- Betikler Docker araştırma konteynerinde; tek komut compose profilini çağırır, ana makinede Playwright gerektirmez

---

### F6.3: CI — GitHub Actions → Phase —

**Açıklama:** Her push'ta tek komut koşar; kırmızıysa commit kırmızı. Repo özel, Actions dakikası sınırlı — süre bütçesi ölçülür. Aynı faz konusu.

**Kabul Kriterleri:**
- `main`'e push → workflow koşar → sonuç GitHub'da görünür
- Kontrast ihlali, yatay kaydırma, kümede olmayan karakter, iddia sızıntısı içeren test commit'i kırmızı
- Workflow süresi ölçüldü ve faz dokümanına yazıldı

**Bağımlılık:** F6.2, M7 (Vercel önizleme URL'si varsa ona karşı da koşabilir — discuss'ta karar)

**Edge Case'ler:**
- Playwright + Chromium imajı CI'da ağır; önbellekleme gerekir
- Tek dal `main`, PR yok — koruma push sonrası uyarıdır, push öncesi kapı istenirse husky/pre-push discuss'ta konuşulur

---

### F6.4: İddia sızıntı denetimi (metin) → Phase —

**Açıklama:** `src/content/`, bileşenler ve render edilmiş sayfalarda yasaklı kalıpları tarar: rakip adları (liste `../alpfit-plus-satis/rekabet/` kaynaklı, repoda yalnız kalıp), "canlı", "sahada", "müşterilerimiz", yüzde iyileşme, "sadece bizde". `docs/CLAIMS.md`'nin otomatik hali. Aynı faz konusu.

**Kabul Kriterleri:**
- Yasaklı kalıp geçen bir test cümlesi eklendiğinde denetim kırmızı, dosya ve satır gösterir
- Kalıp listesi tek dosyada, `CLAIMS.md` ile hizalı
- Pilot cümlesinin `PRODUCT_STATUS` dışında tekrarını yakalar

**Bağımlılık:** F6.2

**Edge Case'ler:**
- Yasal metinler ve karşılaştırma yöntemi açıklaması meşru istisna olabilir — izin listesi dosya bazlı tutulur
- Rakip adı listesi repoda geçerse kendisi sızıntıdır; kalıp dosyası `.gitignore` dışı ama adlar hash veya ayrı gizli dosyadan gelir — discuss'ta karar

---

## Teknik Notlar

**Başlangıç ölçümü (2026-09-11, kickoff — DURUM'dan taşındı, yeniden ölçülmedi):**

| Kontrol | Sonuç |
|---|---|
| Kontrast ihlali (a11y.mjs) | 0 |
| Yatay kaydırma, mobil (mobile-audit.mjs) | 0 |
| Font kapsaması (font-guard.mjs) | 16 sayfa, eksik karakter yok |
| Konsol hatası (scan.mjs) | 0 |
| Üretim derlemesi | 23 rota, geçiyor |
| Ana sayfa ağırlığı | masaüstü 144 KB · mobil 133 KB |
| Ana sayfa LCP | 96 ms (üretim konteyneri, yerel) |
| CLS | 0 – 0,005 |

Bu tablo **regresyon çizgisidir**: F6.2 tek komut bunları geçme eşiği olarak kullanır. Sonraki ölçümler faz dokümanlarına yazılır, buraya yığılmaz.

- Çalıştırma: `docker compose --profile research run --rm research node scripts/<betik>`; üretim konteyneri `docker compose --profile prod up -d --build web-prod` (3100).
- `ILKELER.md` → Kümülatif test ilkesi bugün karşılanmıyor; bu modülün F6.2–F6.4'ü onu kapatır.
