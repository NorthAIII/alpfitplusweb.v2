# TASK-1.02: Önizlemede noindex — üç katman tek kaynaktan

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.3: Vercel'de ayrı proje ve önizleme yayını
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.01

---

## Hedef

Aşama `production` olmadığı sürece sitenin arama motorlarına kapalı olmasını sağlamak: `X-Robots-Tag: noindex, nofollow` yanıt başlığı, `robots.txt` tam `disallow` ve HTML `metadata.robots`. Üçü de TASK-1.01'in ürettiği tek `deployStage` değerinden beslenir. Task, üç katman da yerelde ölçülerek doğrulandığında ve `production` simülasyonunda üçü birden açıldığında tamamlanmış sayılır.

---

## Bağlam

Önizleme adresi **açık** olacak (şifre koruması yok — telefondan şifresiz bakılacak, form testi korumaya takılmayacak; kapsam kararı). Açık adresin arama motoruna düşmemesinin tek güvencesi bu üç katman.

Tek katman yetmez: yalnız başlık konsa `robots.txt` "allow" kalır ve tarayıcı yine gezinir; yalnız meta konsa HTML dışı yanıtlar (görsel, sitemap) açık kalır. Vercel'in kendi otomatik `noindex`'i de bizi kurtarmaz — o yalnız üretim-dışı dallara ve eskimiş dağıtımlara gider, `main`'in güncel dağıtımı indekslenir.

Bu task **TASK-1.03'ten önce** bitmelidir: Vercel'deki ilk dağıtım anında noindex yerinde olmalı.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "noindex mekanizması" ve "`VERCEL_ENV` iddiası çürüdü"
- `src/lib/stage.ts` — TASK-1.01'de yazılan okuma yüzeyi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [ ] **1. Yanıt başlığı**
  - `headers()` içinde, aşama `production` değilse `/:path*` için `X-Robots-Tag: noindex, nofollow` eklenir; `production`'da hiç eklenmez
  - Mevcut güvenlik başlıkları ve önbellek kuralları **değişmez**
  - Dosya: `next.config.ts`

- [ ] **2. robots.txt**
  - Aşama `production` değilse tek kural: `userAgent: "*"`, `disallow: "/"` — sitemap ve host satırları düşer
  - `production`'da bugünkü davranış aynen korunur (allow `/`, disallow `/api/`, sitemap, host)
  - Dosya: `src/app/robots.ts`

- [ ] **3. HTML meta**
  - `metadata.robots` aşamaya göre `{ index: false, follow: false }` ya da bugünkü `{ index: true, follow: true }`
  - Dosya: `src/app/layout.tsx`

---

## Etkilenen Dosyalar

```
./
├── next.config.ts        # X-Robots-Tag başlığı (aşamaya bağlı) — zaten var
src/app/
├── robots.ts             # aşamaya bağlı disallow — zaten var
└── layout.tsx            # metadata.robots aşamaya bağlı — zaten var
```

---

## Dikkat Noktaları

- Üç katman da **aynı** `deployStage` değerinden beslenir; ikinci bir koşul yazma — iki ayrı koşul drift'tir (araştırma kararı).
- `robots.ts` ve `layout.tsx` `src/lib/stage.ts`'i okur; `next.config.ts` kendi hesapladığı sabiti kullanır (TASK-1.01'de aynı sabit).
- F7.5'te alan adı bağlandığında üç katman **kendiliğinden** açılır; yayın günü elle adım kalmamalı — kodda "F7.5'te aç" gibi bir TODO bırakma.
- `metadata.robots` yalnız HTML sayfaları kapsar; `sitemap.xml` hâlâ üretilir ama `robots.txt` ona yol vermez — beklenen davranış.
- Güvenlik başlıklarına dokunma; `next.config.ts` başlık dizisi v1 denetimi D-14'ün karşılığıdır (M7 F7.2).

---

## Test Kriterleri

- [ ] Yerel geliştirmede (`aşama = local`) `curl -sI http://localhost:3000/ | grep -i x-robots-tag` → `noindex, nofollow` döner
- [ ] `curl -s http://localhost:3000/robots.txt` → `Disallow: /` içerir, `Sitemap:` satırı içermez
- [ ] Ana sayfa HTML kaynağında `<meta name="robots" content="noindex, nofollow">` var
- [ ] Üretim simülasyonu (gerçek alan adını taklit eden env ile derleme) → üç katmanın üçü de açık: başlık yok, `robots.txt` bugünkü hâli, meta `index, follow`
- [ ] `docker compose exec web npm run build` hatasız geçer

---

## Risk ve Geri Dönüş Planı

- **Ters yönde hata:** Koşul yanlış yazılırsa alan adı bağlandığı gün site **indekslenmez** ve fark edilmesi haftalar alır → üretim simülasyonu testi zorunlu; ayrıca F7.5 kabul kriterlerine "üç katman açık" kontrolü eklenmeli (o fazın işi, burada not düşülür).
- **Rollback:** Üç dosya da tek commit'te değişir; dosya bazlı geri alma yeterli.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-11
