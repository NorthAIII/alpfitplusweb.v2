# TASK-4.03: Geçiş doğrulama betiği (2/2) — başlık kümesi, dizin açıklığı ve paylaşım kartı dalları

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.5 Alan adı geçişi · F7.2 Güvenlik başlıkları, sitemap, robots
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.02 ✅

---

## Hedef

Betiğe milestone'un geri kalan ölçümleri üç dal olarak eklenir:

1. **Başlık kümesi** — ölçülen her 200 yanıtında v1 paritesi: `Content-Security-Policy` (v1'in canlı politikası birebir), `X-Frame-Options: DENY`, `Permissions-Policy` v1 değeri, HSTS bugünkü değeri, `X-Content-Type-Options`, `Referrer-Policy`.
2. **Dizin açıklığı** — üç `noindex` katmanı (`X-Robots-Tag` başlığı · `robots.txt` · HTML robots meta) `BEKLENEN_ASAMA`'ya göre: `production` → üçü de açık ve `robots.txt` site haritasını beyan ediyor; diğer aşamalar → üçü de kapalı.
3. **Paylaşım kartı ve site haritası** — site haritasındaki her sayfada `canonical` sayfanın kendi yolu · `og:url` = canonical · `og:title` sayfaya özgü (sayfalar arasında benzersiz) · `og:image` ve `twitter:image` mutlak ve **200** · `og:image:alt` var; site haritası 15 `<loc>`, hepsi beklenen alan adında ve 200.

Tamam sayılır: üç dal 3100'e karşı koşar ve bugünkü kırmızıları kalem kalem basar (CSP yok · `SAMEORIGIN` · eski `Permissions-Policy` · `og:url` ana sayfa · `og:title` 15 sayfada aynı · `og:image:alt` yok); ayırt etme gücü negatif kontrolle sınanmış.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → Parite ve yüzey — v1'in CSP dizesi ve başlık farkları; Ölçüm katmanı
- `_dev/bulgular/B-016-csp-yok-v1den-gerileme.md` — başlık tablosu, v1'in `Permissions-Policy` değeri
- `_dev/bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md` — kalem 1 (kart) ölçümü
- `_dev/bulgular/B-027-onizleme-paylasiminda-kart-gorseli-kirik.md` — `metadataBase`'in aşamadan bağımsız olması; F7.2'deki "16 sayfa" rakamı
- `research/lib/rotalar.mjs` — site haritasından rota listesi ve taban (`BEKLENEN_ROTA`)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.2 kriteri: "Sitemap 16 sayfayı listeler" → **15** (sayı ölçülerek)
- `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar — betiğin üç dalı ve bugünkü çizgisi
- `_dev/GIT-STRATEJI.md` → Yayın → doğrulama kapısı — betik bu task'la tamamlanınca kapıya girer (araştırma → Ölçüm katmanı: "Yayın kapısının parçası olur"; TASK-4.17 ve 4.18 kapıyı onunla koşar, TASK-4.01 ise betik henüz yokken yazılır). Korumalı doküman — değişim tarifi `.claude/commands/devflow/lib/git-strategy-kurulum.md`, raporda tek satır
- Kök `CLAUDE.md` → Ölçüm betikleri tablosu — `gecis-dogrula.mjs` satırı ve geçme şartı (hedef ve `BEKLENEN_ASAMA` kipleriyle)

---

## Alt Görevler

- [ ] **1. Beklenen başlık değerleri tek evde** — `research/lib/gecis-envanteri.mjs`: v1'in CSP dizesi (`PHASE-4-ARASTIRMA.md` → Parite ve yüzey), `DENY`, `camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), browsing-topics=()`, HSTS `max-age=63072000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` (son ikisi v1 ile v2'de bugün birebir aynı — `../Alpfitplus-website.v1/vercel.json:11-12` ↔ `next.config.ts:37,39`). TASK-4.12 politikayı yazarken bu değerle birebir karşılaştırılır.

- [ ] **2. Başlık dalı** — her yanıt türünde (HTML, statik varlık, font, ürün görseli, görsel iyileştirici çıktısı, API, 404, `robots.txt`, site haritası) başlık kümesi; eksik ya da farklı değer kalem kalem kırmızı. Bir başlığın **sessizce düşmesi** kırmızıya döner (B-016 koruma önerisi).

- [ ] **3. Dizin dalı** — `BEKLENEN_ASAMA` env (`production` | `preview` | `local`); üç katman birlikte ölçülür ve katmanlar arası tutarsızlık ayrıca raporlanır.

- [ ] **4. Kart dalı** — rota listesi `rotalar.mjs`'ten (404 rotası kart dalından hariç); HTML'den meta etiketleri bağımlılık eklemeden çekilir. `og:title` benzersizlik ölçütü sayfalar arası; `og:image` 200 ölçümü aşağıdaki Dikkat maddesine göre.

- [ ] **5. Site haritası** — `<loc>` sayısı, alan adı, her birinin 200'ü; sayı `rotalar.mjs` tabanıyla tutarlı.

- [ ] **6. Başlangıç çizgisi** — 3100 (taze imaj) koşumu kayda: başlık dalında 3 kalem × yanıt türü kırmızı; dizin dalı `BEKLENEN_ASAMA=local` iken yeşil; kart dalında `og:url` 14 sayfada (ana sayfa hariç), `og:title` benzersizliği 15 sayfada (hepsi kök yerleşimin tek değeri — `layout.tsx:84`; alt sayfalar `openGraph` vermiyor) ve `og:image:alt` 15 sayfada kırmızı, canonical 15/15 yeşil.

---

## Etkilenen Dosyalar

```
research/
├── lib/gecis-envanteri.mjs      # beklenen başlık değerleri
└── scripts/gecis-dogrula.mjs    # üç yeni dal
_dev/modules/M7-Yayin-ve-Altyapi.md   # F7.2 kriter rakamı 16 → 15
```

---

## Dikkat Noktaları

- **Alan adı ile 200 ölçümü ayrı alt kalemdir.** `metadataBase` aşamadan bağımsız `SITE.url`'e bağlı (B-027): önizlemede ve 3100'de `og:image` `https://alpfitplus.com/...` gösterir ve geçişten önce o adres **v1'e** gider (404). Dal bunu yanlış kırmızıya çevirmemeli: `BEKLENEN_ASAMA` `production` değilken görselin **yolu** `BASE`'e karşı 200 ölçülür, alan adı ayrıca doğrulanır. Önizleme yüzeyinin kendi kartı kapsam dışıdır (PHASE-4 → Kapsam Dışı).
- Ana sayfanın canonical'ı eğik çizgisiz (`https://alpfitplus.com`), site haritası `<loc>`'u eğik çizgili — karşılaştırma kök yol için normalize edilir, başka yol için edilmez.
- 3100'de aşama `local`: üç katman kapalıdır ve bu doğrudur. Negatif kontrol: aynı hedefe `BEKLENEN_ASAMA=production` ile koşum kırmızı dönmeli — dalın gerçekten ayırt ettiğinin kanıtı.
- Başlık ölçümünde Vercel'in eklediği başlıklar (dal önizlemesinde, canlıda) fazladan gelir; dal yalnız beklenen kümenin **varlığını ve değerini** ölçer, fazlalığı raporlar ama kırmızı saymaz.
- Rota tabanı `BEKLENEN_ROTA = 16` (15 + 404 rotası) — kart dalı 15 sayfa ölçer; taban altına düşüş kırmızı.

---

## Test Kriterleri

- [ ] 3100: başlık dalı CSP · `X-Frame-Options` · `Permissions-Policy` için kırmızı, HSTS · `nosniff` · `Referrer-Policy` yeşil; kalem sayısı yanıt türü başına basılıyor
- [ ] 3100: dizin dalı `BEKLENEN_ASAMA=local` → yeşil; `BEKLENEN_ASAMA=production` → kırmızı (negatif kontrol)
- [ ] 3100: kart dalı — `og:url` 14 kırmızı, `og:title` benzersizliği 15 kırmızı, `og:image:alt` 15 kırmızı, canonical 15/15 yeşil, `og:image` yolu 200
- [ ] Site haritası 15 `<loc>`; M7 F7.2 kriteri 15'e düzeltildi
- [ ] Kapsam: ölçülen sayfa sayısı tabanın altına düştüğünde kırmızı (kontrollü denemeyle gözlendi)

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
