# M5: Görsel Varlık Hattı

**Sorumluluk:** Ürün ekran görüntülerini, fotoğrafları, fontları ve marka varlıklarını **betikle üretmek** ve denetlemek; elle konan görsel yok.
**Bağımlılık:** Yok (kaynak `../Alpfit.v1/demo` salt okunur bağlanır; v1 temizlik tablosu devralındı)
**Sınır:** `research/scripts/` (render-product, photos-build, font-subset, brand-assets) ve çıktıları `public/product`, `public/foto`, `public/fonts`, `src/app/*.png`. Görsellerin sayfada nasıl kullanıldığı M2.

---

## Feature'lar

### F5.1: Ürün ekran görüntüsü hattı → Phase —

**Açıklama:** `render-product.mjs` demo ekranlarını Playwright ile render eder; marka düzeltmesi (eski ad), kişi/yer temizliği (nötr adlar, avatar baş harfleri senkron), düğüm düşürme (karşılanmayan iddia kartları), denetim (sızıntı varsa **üretim durur**). `churn.html` ve `kampanya.html` bilinçle kapsam dışı. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Çıktı 8 `.webp`; hiçbirinde eski marka, gerçek sporcu/semt adı yok (metin denetimi + görsel denetim)
- Bir sızıntı tespit edilince betik sıfır-olmayan kodla çıkar, dosya yazmaz
- Betik `../Alpfit.v1` dizinine yazmaz (salt okunur mount)

**Bağımlılık:** Yok

**Edge Case'ler:**
- Kaynak demoda `<img>` olarak gömülü logo metin denetimini atlatmıştı — görsel denetim bu yüzden var (`BULGULAR.md` arşiv B-001)
- Ürün yeni kart eklerse (örn. SMS) sitedeki iddiayla çelişebilir; temizlik tablosu güncellenir (arşiv B-002)

---

### F5.2: Fotoğraf hattı → Phase —

**Açıklama:** `photos-build.mjs` Pexels lisanslı kaynakları kırpar, boyutlandırır, `webp/avif` üretir. Kaynaklar `research/FOTOGRAF-KAYNAKLARI.txt`. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Her fotoğrafın kaynağı ve lisansı listede
- Çıktılar `next/image` ile kullanılır, boyutlar bildirilmiş (CLS 0–0,005)

**Bağımlılık:** Yok

**Edge Case'ler:**
- Yeni fotoğraf eklerken önce listeye kaynak yazılır, sonra betik koşar

---

### F5.3: Font daraltma → Phase —

**Açıklama:** `font-subset.mjs` sitede geçen karakterler + tam Türkçe alfabe ile Sora/Inter'i daraltır: 153 karakter, 5 dosya, 95 KB (219 KB'dan). `font-guard.mjs` üretim konteynerine karşı kapsamayı ölçer. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- `font-guard.mjs`: 16 sayfada kümede olmayan karakter yok
- Küme dosyası `research/FONT-KARAKTER-KUMESI.txt` ile üretilen fontlar tutarlı

**Bağımlılık:** Yok

**Edge Case'ler:**
- Sora'da ₺ yok; Inter yedeği `STYLE-GUIDE.md`
- Metin tonu (M1 F1.2) yeni karakter getirirse küme genişletilir ve betik yeniden koşar

---

### F5.4: Marka varlıkları → Phase —

**Açıklama:** `brand-assets.mjs` `Logo.tsx`'teki işaretten favicon, app ikonu, OG ve Twitter görselini üretir. Logo **geçici**. Kickoff öncesi tamamlandı; kalıcı logo dış aktöre bağlı.

**Kabul Kriterleri:**
- Logo değişince tek betikle dört varlık yeniden üretilir
- OG görseli 1200×630, metin kontrastı ölçülmüş

**Bağımlılık:** Yok

**Edge Case'ler:**
- Kalıcı logo geldiğinde `Logo.tsx` + betik; `BULGULAR.md` B-009

---

## Teknik Notlar

- Tüm betikler araştırma konteynerinde koşar: `docker compose --profile research run --rm research node scripts/<betik>`. `render-product.mjs` için ürün deposu ayrıca `:ro` mount edilir (komut `README.md`).
- Hat v1'in `scripts/lib/screen-cleanup.mjs` tablosundan devralındı.
