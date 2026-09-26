# TASK-4.05: İkon teslimi — `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`

**Durum:** ⬜ Bekliyor
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F5.4 Marka varlıkları
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.02 ✅ (head grubu bu task'ın ölçüm kapısıdır)

---

## Hedef

v1'in bugün 200 döndürdüğü üç ikon adresi v2'de 404 (B-043). `research/scripts/brand-assets.mjs` üçünü de teslim edilebilir hâlde üretir — `favicon.ico` (32 px PNG'nin gömülü olduğu tek girişli ICO kabı), `favicon.svg` (işaretin kendisi), `apple-touch-icon.png` (180 px, zaten üretiliyor ama teslim edilmiyor) — ve teslim adımı onları sitenin kök yolunda servis eder. Head beyanı v1 paritesine gelir: SVG ikon + `.ico`.

Tamam sayılır: TASK-4.02'nin head grubundaki üç ikon kalemi 3100'de 200 ve doğru içerik türüyle yeşil; betik ikinci koşumda aynı baytları üretiyor.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-043-f75-gecis-yuzeyi-tablodan-genis.md` — v1'de çalışan ikon adresleri; `favicon-32.png`'nin üretilip teslim edilmemesi
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → Parite ve yüzey → İkon teslimi
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.4 — bugünkü üretim hattı
- Repo kökü `README.md` → ürün görseli hattı — betik `research/product-out`'a yazar, dosyalar `public/product/`'te servis edilir; aradaki taşıma adımı README'de **adım olarak yazılı değil** (plan anında ölçüldü) — bugün nasıl yapıldığı task'ta git geçmişinden/betikten ölçülür

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.4 — teslim edilen üç dosya ve kriteri
- `CLAUDE.md` → Dokunulmazlar — **(a) seçilirse**: "betik çıktısı — elle dosya konmaz" satırı üç ikon dosyasını da kapsar (raporda tek satır)

---

## Alt Görevler

- [ ] **0. Karar** — teslim yeri (aşağıda Karar Noktaları); task başında kullanıcıya sorulur.

- [ ] **1. ICO kabı** — 6 bayt başlık + 16 bayt dizin girişi + PNG gövdesi (PNG gömülü ICO; bağımlılık eklenmez, betiğin içinde küçük bir yardımcı). `sharp` ICO yazmaz (araştırma).

- [ ] **2. SVG çıktısı** — betikteki `mark()` SVG dizesi dosyaya yazılır (`viewBox`'lı, sabit boyutsuz).

- [ ] **3. Teslim** — seçilen yere taşıma; araştırma konteyneri `public/`'i görmediği için adım host tarafındadır. Ürün görsellerinin bugünkü taşıma biçimi ölçülür ve aynısı izlenir; teslim adımı README'ye tek satırla yazılır (bir sonraki koşum elle kopyaya dönmesin).

- [ ] **4. Head beyanı** — `src/app/layout.tsx` → `metadata.icons`: SVG ikon ve `.ico`; mevcut `src/app/icon.png` ve `apple-icon.png` dosya kuralı beyanlarıyla çakışmadan. Head'deki `rel="icon"` satırlarının sırası ve sayısı ölçülür.

- [ ] **5. Ölçüm** — 3100 taze imaj → `gecis-dogrula.mjs` head grubu; `file public/favicon.ico`; `apple-touch-icon.png` ölçüsü `sharp` metadata ile.

---

## Etkilenen Dosyalar

```
research/scripts/brand-assets.mjs   # ICO kabı + SVG çıktısı + teslim adımı
public/favicon.ico                  # YENİ — betik çıktısı (a)
public/favicon.svg                  # YENİ — betik çıktısı (a)
public/apple-touch-icon.png         # YENİ — betik çıktısı (a)
src/app/layout.tsx                  # metadata.icons
README.md                           # teslim adımı (tek satır)
```

---

## Dikkat Noktaları

- `public/product/` ve `public/fonts/` dokunulmaz (CLAUDE.md → Dokunulmazlar). Yeni ikonlar onların yanına **betikle** gelir, elle konmaz (QUALITY → Bakım Maliyeti: elle konan görsel bakım borcudur).
- iOS `<link>` olmasa da `/apple-touch-icon.png`'yi **bu adla** ister — yol korunmalı. Next'in `apple-icon` dosya kuralı bu adı üretmez.
- `/favicon.ico` bugün 404 ve 57 KB'lık HTML gövdesiyle dönüyor (B-027) — hedef 200 ve ICO içerik türü (`image/x-icon` ya da `image/vnd.microsoft.icon`).
- `apple-touch-icon.png` betikte köşe yarıçapı **0** (iOS kendisi yuvarlar) — değer değişmez.
- İkonların önbellek başlığı bu task'ın işi değil (B-042'nin parite dışı kalemleriyle aynı sınıf); ölçülür ve kayda düşer.
- `layout.tsx`'e dokunan başka task'lar var (TASK-4.06, 4.08, 4.11) — bu task yalnız `icons` alanına dokunur.

---

## Karar Noktaları

- **Teslim yeri:** (a) `public/` — betik çıktısı olarak, üç dosya tek yerde ve tek betikten; `CLAUDE.md` Dokunulmazlar satırı genişler. (b) `src/app/` dosya kuralı — `favicon.ico` Next'in kendi kuralıdır, ama `/apple-touch-icon.png` adını üretmez ve SVG'yi ayrı bir yola koyar, yani üç dosya iki ayrı mekanizmaya bölünür. **Öneri (a).** Kullanıcıya sorulur.

---

## Test Kriterleri

- [ ] 3100: `/favicon.ico` → 200, ICO içerik türü, gövde < 5 KB · `/favicon.svg` → 200 `image/svg+xml` · `/apple-touch-icon.png` → 200 `image/png`, 180×180
- [ ] `gecis-dogrula.mjs` head grubunda üç ikon kalemi yeşil
- [ ] HTML head'de SVG ve ICO beyanı var; `icon.png` / `apple-icon.png` beyanları duruyor
- [ ] Betik iki kez koşulduğunda üç dosyanın md5'i aynı (belirlenimli çıktı)
- [ ] `npm test` yeşil

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
