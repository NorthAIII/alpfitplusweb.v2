# TASK-4.06: Sayfa başına paylaşım kartı (1/2) — yardımcı, ana sayfa ve `/fiyat`

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.03 ✅ (kart dalı bu task'ın ölçüm kapısıdır)

---

## Hedef

Bugün 15 sayfanın hepsi ana sayfanın paylaşım kartını taşıyor: `og:url` her zaman ana sayfa, `og:title`/`og:description` her yerde aynı (B-042 kalem 1). v1 her sayfaya kendi kartını veriyor — bu bir parite kalemi (araştırma; kullanıcı kararıyla faza alındı).

Tek bir yardımcı kurulur: `src/lib/sayfa-meta.ts` (YENİ) → `pageMeta({ title, description, path })`. Çıktısı sayfanın bütün başlık/kart alanlarıdır: `title`, `description`, `alternates.canonical`, `openGraph` (`url` = sayfanın yolu, `title` = "<başlık> — Alpfit Plus", `description`, kök yerleşimin `type` / `locale` / `siteName`'i) ve `twitter` (`card`, `title`, `description`). Görselin alt metni Next'in dosya kuralıyla gelir (`opengraph-image.alt.txt`, `twitter-image.alt.txt`). Ana sayfa ve `/fiyat` yardımcıya geçer (pilot).

Tamam sayılır: betiğin kart dalı bu iki sayfada yeşil; diğer 13 sayfa bugünkü hâlinde ve canonical 15/15 yeşil kalıyor (TASK-4.07 süpürür).

---

## Bağlam

Kök neden (B-042): Next'in `metadata` birleştirmesi `title`/`description`'ı sayfaya taşır ama **`openGraph` alt alanlarını taşımaz**; alt sayfalar yalnız `title`/`description` veriyor, kart kök yerleşimden sabit geliyor. Teknik Kararlar 7: kart tek yardımcıdan türer — yeni sayfa kartı kendiliğinden doğru getirir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md` — kalem 1 ve kök neden; 2026-09-22 yeniden ölçümü
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → "Sayfa başına paylaşım kartı parite dışı → ÇÜRÜDÜ" (v1'in `/fiyat` kartı) · `PHASE-4.md` → Teknik Kararlar 7
- `src/app/layout.tsx` — bugünkü `metadata` (canonical, `openGraph`, `twitter`, `metadataBase`)
- `_dev/docs/CLAIMS.md` — alt metin de bir cümledir

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` → F2.3 — kriter: her sayfanın kartı kendi yolunu ve başlığını taşır, tek yardımcıdan

---

## Alt Görevler

- [ ] **1. Yardımcı** — `src/lib/sayfa-meta.ts` (YENİ). Metin taşımaz: sayfanın verdiği `title`/`description`'ı biçimler, `SITE` sabitini okur. `robots` alanını dışarıdan alabilir (TASK-4.09'un `noindex` sonuç sayfaları için).
- [ ] **2. Ana sayfa** — kök yerleşimdeki sabit `openGraph`/`twitter` yardımcıya devredilir; `metadataBase`, `title.template`, `robots`, `manifest` yerinde kalır.
- [ ] **3. `/fiyat`** — `metadata` yardımcıdan (description `PRICING`'ten türemeye devam eder).
- [ ] **4. Alt metin** — `src/app/opengraph-image.alt.txt` ve `twitter-image.alt.txt` (YENİ): ürün adı + ne olduğu; iddia yok (CLAIMS).
- [ ] **5. Test** — `tests/sayfa-meta.test.ts` (YENİ): `openGraph.url` = yol, canonical = yol, `siteName`/`locale`/`type` mevcut, `og:title` biçimi.
- [ ] **6. Ölçüm** — 3100 taze imaj → kart dalı.

---

## Etkilenen Dosyalar

```
src/lib/sayfa-meta.ts               # YENİ
src/app/layout.tsx                  # sabit kart yardımcıya devredilir
src/app/fiyat/page.tsx              # pilot
src/app/opengraph-image.alt.txt     # YENİ
src/app/twitter-image.alt.txt       # YENİ
tests/sayfa-meta.test.ts            # YENİ
```

---

## Dikkat Noktaları

- **Next'in metadata birleştirmesi sığdır:** alt sayfa `openGraph` verdiğinde kök yerleşimin `openGraph`'ı **tümüyle** ezilir — `siteName`, `locale`, `type` düşer. Yardımcı onları kendisi taşır. `title.template` `openGraph.title`'a uygulanmaz.
- Dosya kuralıyla gelen `opengraph-image.png` belgeye göre metadata nesnesinden önceliklidir — alt sayfa `openGraph` verdiğinde görselin **hâlâ geldiği ölçülür**, varsayılmaz (kart dalı `og:image` 200).
- `og:title` biçimi v1 paritesi: v1 `/fiyat` → "Fiyat — Alpfit Plus". Sekme başlığı (`<title>`, bugün "Fiyat · Alpfit Plus") bu task'ta **değişmez**.
- Ana sayfanın canonical'ı eğik çizgisiz `https://alpfitplus.com`; `og:url` aynı değer.
- `layout.tsx`'e dokunan diğer task'lar (4.05 `icons`, 4.08 JSON-LD, 4.11 yorum) ayrı alanlara dokunur.

---

## Test Kriterleri

- [ ] `tests/sayfa-meta.test.ts` yeşil; `npm test` toplamı yeni sayıyla kayıtta
- [ ] 3100 kart dalı: `/` ve `/fiyat` → `og:url` = canonical, `og:title` sayfaya özgü, `og:image` yolu 200, `og:image:alt` var
- [ ] 3100: canonical 15/15 yeşil kalıyor (regresyon yok); diğer 13 sayfanın kart kırmızıları başlangıç çizgisindeki sayıda
- [ ] `og:site_name` ve `og:locale` iki pilot sayfada da mevcut

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-26
