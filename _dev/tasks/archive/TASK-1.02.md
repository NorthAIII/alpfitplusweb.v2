# TASK-1.02: Önizlemede noindex — üç katman tek kaynaktan

**Durum:** ✅ Tamamlandı
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

- [x] **1. Yanıt başlığı**
  - `headers()` içinde, aşama `production` değilse `/:path*` için `X-Robots-Tag: noindex, nofollow` eklenir; `production`'da hiç eklenmez
  - Mevcut güvenlik başlıkları ve önbellek kuralları **değişmez**
  - Dosya: `next.config.ts`

- [x] **2. robots.txt**
  - Aşama `production` değilse tek kural: `userAgent: "*"`, `disallow: "/"` — sitemap ve host satırları düşer
  - `production`'da bugünkü davranış aynen korunur (allow `/`, disallow `/api/`, sitemap, host)
  - Dosya: `src/app/robots.ts`

- [x] **3. HTML meta**
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

- [x] Yerel geliştirmede (`aşama = local`) `curl -sI http://localhost:3000/ | grep -i x-robots-tag` → `noindex, nofollow` döner
- [x] `curl -s http://localhost:3000/robots.txt` → `Disallow: /` içerir, `Sitemap:` satırı içermez
- [x] Ana sayfa HTML kaynağında `<meta name="robots" content="noindex, nofollow">` var
- [x] Üretim simülasyonu (gerçek alan adını taklit eden env ile derleme) → üç katmanın üçü de açık: başlık yok, `robots.txt` bugünkü hâli, meta `index, follow`
- [x] `docker compose exec web npm run build` hatasız geçer

---

## Risk ve Geri Dönüş Planı

- **Ters yönde hata:** Koşul yanlış yazılırsa alan adı bağlandığı gün site **indekslenmez** ve fark edilmesi haftalar alır → üretim simülasyonu testi zorunlu; ayrıca F7.5 kabul kriterlerine "üç katman açık" kontrolü eklenmeli (o fazın işi, burada not düşülür).
- **Rollback:** Üç dosya da tek commit'te değişir; dosya bazlı geri alma yeterli.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-11

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- `next.config.ts`: `deployStage !== "production"` iken `/:path*` için `X-Robots-Tag: noindex, nofollow` ekleyen `robotsHeaders` dizisi doğdu; `headers()` içine yayılarak (`...robotsHeaders`) eklendi. Güvenlik başlıkları ve iki önbellek kuralı satırına dokunulmadı.
- `src/app/robots.ts`: `DEPLOY_STAGE` okunuyor; üretim dışında tek kural (`userAgent: "*"`, `disallow: "/"`) dönüyor, `sitemap` ve `host` satırları düşüyor. Üretimde bugünkü davranış birebir korunuyor.
- `src/app/layout.tsx`: `isPublished` sabiti `DEPLOY_STAGE === "production"`'dan türüyor; `metadata.robots` bu tek değerden `{ index, follow }` alıyor.
- Üç katman da TASK-1.01'in ürettiği aynı `deployStage` değerini okuyor; ikinci bir koşul yazılmadı.

**Sorunlar:**
- Üretim simülasyonunu çalışan geliştirme sunucusunu bozmadan koşturmak: `.next` bir isimli hacim (`next_cache`) ve `web` servisiyle paylaşılıyor. Çözüm — `docker compose run --rm` ile ayrı bir konteyner 3200 portunda derleyip servis etti, ölçüm bitince silindi; geliştirme sunucusu sonradan yeniden başlatılıp `.next` tazelendi.
- `next start` `output: standalone` için uyarı basıyor ("node .next/standalone/server.js kullanın"). Uyarı zararsız kaldı: sunucu ayağa kalktı, üç katman da ölçülebildi. Ölçülen yüzey yanıt başlığı, `robots.txt` ve HTML meta — standalone paketleme bunları değiştirmiyor.

**Kararlar:**
- Kapı sınaması iki yönlü değil **dört senaryoludur**: yalnız "yerel kapalı / üretim açık" ölçülseydi, projenin asıl risk hâli (`VERCEL_ENV=production` ama alan adı hâlâ `.vercel.app`) hiç sınanmamış olurdu — araştırmada çürütülen varsayım tam orada yaşıyor. Senaryo serving katmanında ayrıca koşuldu.
- docs/DECISIONS.md'ye eklendi: Hayır — mekanizma kararı TASK-1.01'de (aşama türetimi) verilmişti; bu task onu üç tüketiciye bağladı, yeni sözleşme doğurmadı.

**Kalan İşler:**
- Yok. F7.5 kabul kriterlerine "alan adı bağlandıktan sonra üç katmanın üçü de açık" kontrolü eklenmeli — bu task'ın değil o fazın işi (task dokümanının Risk bölümünde not düşülmüştü, burada tekrarlanıyor ki o faz görsün).

**Dosya Değişiklikleri:**
- `next.config.ts` → `robotsHeaders` dizisi + `headers()` içine yayma; aşama yorumu üç katmanı anlatacak şekilde tazelendi
- `src/app/robots.ts` → `DEPLOY_STAGE` bağımlılığı ve üretim-dışı tek kural dalı
- `src/app/layout.tsx` → `DEPLOY_STAGE` importu, `isPublished` sabiti, `metadata.robots` aşamaya bağlandı

**Test Sonuçları:**

Dört ortam senaryosu, hepsi **serving katmanında** (curl ile gerçek yanıt) ölçüldü — saf fonksiyon düzeyinde değil, çünkü kusurun oluşacağı yer yanıtın kendisi:

| Senaryo (env) | Beklenen | X-Robots-Tag | robots.txt | HTML meta |
|---|---|---|---|---|
| Yerel geliştirme (`VERCEL` yok) → `local` | kapalı | `noindex, nofollow` ✅ | `Disallow: /`, `Sitemap:` yok ✅ | `noindex, nofollow` ✅ |
| `VERCEL=1`, `VERCEL_ENV=production`, alan adı `alpfitplus.com` → `production` | **açık** | başlık yok ✅ | `Allow: /`, `Disallow: /api/`, `Sitemap:` + `Host:` var ✅ | `index, follow` ✅ |
| **Bozuk girdi:** `VERCEL=1`, `VERCEL_ENV=production`, alan adı `alpfitplusweb-v2.vercel.app` → `preview` | kapalı | `noindex, nofollow` ✅ | `Disallow: /` ✅ | `noindex, nofollow` ✅ |
| **Boş kapsam:** `VERCEL=1`, `VERCEL_ENV=production`, alan adı env'i **hiç tanımsız** → `preview` (fail-safe) | kapalı | `noindex, nofollow` ✅ | `Disallow: /` ✅ | `noindex, nofollow` ✅ |

Üçüncü satır kapının asıl sınavıdır: koşul `VERCEL_ENV`'e bakacak şekilde yazılsaydı fail-open olur, önizleme adresi indekslenirdi. Dördüncü satır bilgi eksikliğinde kapının kapalı kaldığını gösterir. İlk iki satır kontrol grubudur — kapı yalnızca "hep kapalı" basmıyor, gerçekten ayırt ediyor.

Ek ölçümler:
- **Başlık katmanının kapsamı:** `curl -sI /sitemap.xml` → `X-Robots-Tag: noindex, nofollow`. Meta etiketin yetişemediği HTML-dışı yanıt gerçekten kapsanıyor; üç katmanlı tasarımın gerekçesi ölçüldü.
- **Regresyon — güvenlik başlıkları:** beş başlık (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) hem yerelde hem üretim simülasyonunda 5/5 yerinde.
- `docker compose exec web npm run build` → hatasız, 23 rota (hata/failed satırı: 0).
- `npx eslint` **yalnız dokunulan dört dosyada** → 0 sorun. Repo genelindeki 25 hata + 5 uyarı bu değişiklikten önce vardı ve `src/components/sections/*` içinde; kaydı Gelen Kutusu'nda (TASK-1.01).
- `a11y.mjs` (dokuz rota) → TOPLAM SORUN: 0.
- `scan.mjs / anasayfa 1280 900` → 18 kare, konsol temiz.
- `font-guard.mjs` **koşulmadı, gerekçesiyle:** bu task tek bir kullanıcı-görünür karakter eklemedi — yeni dizeler yanıt başlığı ve bir meta özniteliği, ikisi de metin olarak render edilmiyor. Font kümesi değişmedi.
- `mobile-audit.mjs` / `perf.mjs` koşulmadı: düzen ve varlık yükü değişmedi.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-11

**Ne Yapıldı:**
- Site üretim dışında üç katmanda birden arama motorlarına kapatıldı: yanıt başlığı, `robots.txt`, HTML meta — üçü de tek `deployStage` değerinden.
- Alan adı bağlandığı gün (M7 F7.5) üçü kendiliğinden açılır; kodda elle çevrilecek bayrak ya da TODO bırakılmadı.

**Öğrenilenler:**
- Bir kapıyı yalnız "doğru hâlde yeşil, yanlış hâlde kırmızı" diye iki uçtan sınamak yetmiyor; kusurun gerçekte doğacağı **ara hâl** ayrıca kurulmalı. Burada o hâl `VERCEL_ENV=production` + `.vercel.app` alan adıydı ve iki uçlu testte tamamen görünmez kalırdı.
- `.next` isimli hacim üzerinden paylaşıldığı için, çalışan geliştirme sunucusunu bozmadan alternatif env ile derleme yapmanın yolu `docker compose run --rm --publish` ile ayrı bir konteynerdir; iş bitince geliştirme sunucusu yeniden başlatılıp `.next` tazelenir.

---

**Oluşturulma:** 2026-09-11
