# TASK-1.01: Aşama türetimi ve `deployStage` tek kaynağı

**Durum:** ✅ Tamamlandı
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.3: Vercel'de ayrı proje ve önizleme yayını (temel katman)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** Yok

---

## Hedef

Dağıtımın hangi aşamada koştuğunu (`local | preview | production`) **tek yerde** hesaplayan ve tüm uygulamaya tek bir değerle taşıyan katmanı kurmak. `next.config.ts` değeri `VERCEL` / `VERCEL_ENV` / `VERCEL_PROJECT_PRODUCTION_URL`'den türetir ve `env.NEXT_PUBLIC_DEPLOY_STAGE` ile derlemeye gömer; `src/lib/stage.ts` bu değeri okuyup uygulama koduna verir. Task, üç aşama da doğru türetildiğinde ve yerel derleme `local` ürettiğinde tamamlanmış sayılır.

---

## Bağlam

Kapsam tartışmasındaki `VERCEL_ENV !== "production"` varsayımı araştırmada **çürüdü**: Git bağlantılı projede `main` varsayılan üretim dalıdır, her push `<proje>.vercel.app` adresine **production** dağıtımıdır ve `VERCEL_ENV=production` olur. Olduğu gibi yazılsaydı önizleme adresi Google'a açılır, test talepleri e-tabloya `production` etiketiyle düşerdi.

Bu yüzden aşama, üretim **alan adının** gerçek olup olmadığından türetilir: `VERCEL_PROJECT_PRODUCTION_URL` hâlâ `.vercel.app` ile bitiyorsa gerçek yayın yok demektir. F7.5'te alan adı bağlandığında değer kendiliğinden `production` olur — yayın günü elle çevrilecek bir bayrak kalmaz.

Bu task fazın üç tüketicisini birden besler: noindex (TASK-1.02), lead kaydının `env` alanı (TASK-1.05) ve Umami etiketi (TASK-1.07).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1.md` → Araştırma Bulguları / Teknik Kararlar — aşama türetiminin gerekçesi
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Önizleme ve ortam modeli" ve "`VERCEL_ENV` iddiası çürüdü" — ölçümün kendisi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [x] **1. Aşama türetimini yaz**
  - Saf fonksiyon: girdi bir env sözlüğü, çıktı `"local" | "preview" | "production"`
  - Kural: `VERCEL` tanımsız → `local`; `VERCEL_ENV === "production"` **ve** `VERCEL_PROJECT_PRODUCTION_URL` `.vercel.app` ile bitmiyor → `production`; diğer tüm Vercel hâlleri → `preview`
  - Dosya: `src/lib/stage.ts` (YENİ)

- [x] **2. Değeri derlemeye göm**
  - `next.config.ts` fonksiyonu `process.env` ile çağırır ve `env: { NEXT_PUBLIC_DEPLOY_STAGE: <değer> }` olarak yazar
  - Aynı hesaplanmış değer dosya içinde bir sabitte tutulur — `headers()` (TASK-1.02) aynı sabiti okuyacak
  - Dosya: `next.config.ts`

- [x] **3. Okuma yüzeyini ver**
  - `src/lib/stage.ts` `DEPLOY_STAGE` sabitini (`process.env.NEXT_PUBLIC_DEPLOY_STAGE`, tanımsızsa `"local"`) dışa verir; uygulama kodu **yalnız bunu** okur
  - Dosya yorumuna türetim kuralının bir cümlelik gerekçesi yazılır (ölçülmüş karar → kod yorumu geleneği, QUALITY 3)

---

## Etkilenen Dosyalar

```
./
├── next.config.ts        # aşama hesaplanır ve env'e gömülür — zaten var
src/lib/
└── stage.ts              # YENİ — saf türetim fonksiyonu + DEPLOY_STAGE okuması
```

---

## Dikkat Noktaları

- **Türetim tek yerde kalmalı.** Araştırma kararı "aşama `next.config.ts`'de hesaplanır, `src/lib/stage.ts` yalnız okur" der. Saf fonksiyonun `stage.ts`'te durup config tarafından çağrılması bu kararı **bozmaz**: türetim yeri hâlâ tek (config'in çağırdığı an), `stage.ts` uygulama tarafında yalnız okuyucudur. Amaç fonksiyonu node ile doğrudan sınanabilir kılmak.
- `next.config.ts` içinden `src/` altına import ederken `@/` takma adı **çalışmayabilir** (config TS derleyicisi tsconfig yollarını uygulamaz) — göreli yol kullan (`./src/lib/stage`).
- `NEXT_PUBLIC_` öneki zorunlu: değer istemci paketine gömülür. Sır değildir, gömülmesi beklenen davranıştır.
- Vercel'de sistem env değişkenlerinin derlemede görünmesi projede bir ayara bağlı ("Enable access to System Environment Variables") — teyidi TASK-1.03'te yapılır; bu task yerelde çalışır.
- **İlk dağıtım her zaman production'dır** (Vercel kuralı); model buna dayanıyor, sürpriz yok.

---

## Test Kriterleri

- [x] Saf fonksiyon üç senaryoda doğru değeri döner (node ile doğrudan çağrılarak): boş env → `local`; `{VERCEL:"1", VERCEL_ENV:"production", VERCEL_PROJECT_PRODUCTION_URL:"alpfitplus-web-v2.vercel.app"}` → `preview`; aynısı `VERCEL_PROJECT_PRODUCTION_URL:"alpfitplus.com"` ile → `production`
- [x] `{VERCEL:"1", VERCEL_ENV:"preview"}` → `preview` (dal önizlemesi)
- [x] `docker compose exec web npm run build` hatasız geçer, 23 rota üretir
- [x] Yerel geliştirmede sayfa kaynağında gömülü değer `local`

---

## Karar Noktaları

- **Saf fonksiyonun evi:** `src/lib/stage.ts` (önerilen — node ile sınanabilir, tek dosya) vs. `next.config.ts` içinde satır içi (araştırma metnine harfi harfine yakın ama sınanması üç ayrı derleme ister). Göreli import config'te çalışmazsa satır içi hâle dön ve iki derleme ölçümüyle sına; sapmayı Oturum Kaydı'na yaz.

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
- `src/lib/stage.ts` yazıldı (YENİ): `DeployStage` tipi, saf `deriveDeployStage(env)` fonksiyonu ve `DEPLOY_STAGE` okuma sabiti. Dosya başındaki yorum türetim kuralının gerekçesini taşıyor (neden `VERCEL_ENV` tek başına yetmiyor, alan adı bağlanınca değerin kendiliğinden dönmesi).
- `next.config.ts` fonksiyonu `process.env` ile çağırıyor, sonucu `deployStage` sabitinde tutuyor ve `env.NEXT_PUBLIC_DEPLOY_STAGE` olarak derlemeye gömüyor. Sabit dosya kapsamında duruyor; TASK-1.02'nin `headers()` içinden aynı değeri okuması için ek iş gerekmez.
- Karar noktası çözüldü: saf fonksiyon `src/lib/stage.ts`'te kaldı, göreli import (`./src/lib/stage`) config'te sorunsuz çalıştı — satır içi hâle dönmek gerekmedi.

**Sorunlar:**
- Saf fonksiyonun node ile çağrılması: repoda test koşucusu ve `tsx` yok. Node 24 yerleşik tip soyma ile `.ts` dosyası doğrudan import edilebildi; test betiği konteynere kopyalanıp koşturuldu, repoya dosya eklenmedi.
- Gömülü değerin sayfa kaynağında görülmesi: `DEPLOY_STAGE`'i okuyan uygulama kodu henüz yok, dolayısıyla değer hiçbir çıktıya girmiyordu. Geçici `src/app/stage-probe/page.tsx` sondası açıldı, ölçüm alındı, sonda silindi ve 404 döndüğü doğrulandı.

**Kararlar:**
- **Üretim alan adı tanımsızsa `preview` dönülür.** Task metnindeki kural harfi harfine okunsaydı `VERCEL_PROJECT_PRODUCTION_URL` boş/tanımsızken koşul "`.vercel.app` ile bitmiyor" olarak sağlanır ve aşama `production` olurdu — noindex kapanırdı. Eksik bilgide fail-safe tercih edildi: bilinmeyen alan adı önizleme sayılır. Gerekçe kod yorumunda.
- docs/DECISIONS.md'ye eklendi: Hayır — aşama türetimi kararı zaten `docs/DECISIONS.md` (2026-09-11) ve `PHASE-1.md` → Teknik Kararlar'da kayıtlı; bu oturum onu uyguladı, yeni sözleşme doğurmadı. Fail-safe dalı kararın icra ayrıntısıdır, evi kod yorumu.

**Kalan İşler:**
- Yok. Vercel'de sistem env değişkenlerinin derlemede görünmesi ("Enable access to System Environment Variables") TASK-1.03'ün teyit kalemidir; bu task yerelde kapandı.

**Son Yaklaşım:**
Task tamamlandı, devam durumu yok.

**Sonraki Adım Detayı:**
TASK-1.02 `headers()` içinde aynı `deployStage` sabitini okuyup `X-Robots-Tag` verecek; `robots.ts` ve `metadata.robots` `DEPLOY_STAGE` üzerinden aynı kaynağa bağlanacak.

**Dosya Değişiklikleri:**
- `src/lib/stage.ts` → YENİ. `DeployStage` tipi, saf `deriveDeployStage(env)`, `DEPLOY_STAGE` sabiti, türetim gerekçesi yorumu.
- `next.config.ts` → `deriveDeployStage` göreli import edildi; `deployStage` sabiti eklendi; `env.NEXT_PUBLIC_DEPLOY_STAGE` config'e girdi. Güvenlik başlıkları ve cache kuralları değişmedi.

**Test Sonuçları:**
- **Saf fonksiyon, beş senaryo (konteynerde `node`, doğrudan çağrı):** hepsi PASS. Boş env → `local`; `{VERCEL, VERCEL_ENV:"production", …vercel.app}` → `preview`; aynısı `alpfitplus.com` ile → `production`; `{VERCEL, VERCEL_ENV:"preview"}` → `preview`; `{VERCEL, VERCEL_ENV:"production"}` (alan adı yok) → `preview` (fail-safe dalı; task kriterlerine ek).
- **Üretim derlemesi:** `docker compose exec web npm run build` hatasız; TypeScript geçti; 23 rota üretildi (rota listesi task hedefiyle birebir).
- **Config bağlantısı, derleme kapsamında ölçüldü:** geçici sonda rotasıyla üç derleme koşuldu ve gömülü değer sayfa çıktısından okundu — env'siz → `local`; `VERCEL=1 VERCEL_ENV=production VERCEL_PROJECT_PRODUCTION_URL=alpfitplus-web-v2.vercel.app` → `preview`; aynısı `alpfitplus.com` ile → `production`. Yani türetim yalnız fonksiyonda değil, derlemenin gerçekten gömdüğü değerde de doğru. Sonda silindikten sonra `/stage-probe` 404, ana sayfa 200.
- **Kapsam dışı kalan:** beş ölçüm betiği (a11y, mobil, font, perf, tarama) koşturulmadı — bu değişiklik hiçbir render çıktısı, metin, karakter ya da düzen üretmiyor; başlıklar ve cache kuralları da elle sınanmadı çünkü `headers()` gövdesine dokunulmadı. `npm run lint` koşturuldu: dokunulan iki dosya temiz; repoda önceden var olan 25 hata + 5 uyarı bölüm bileşenlerinde (Gelen Kutusu'na düştü).

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-11

**Ne Yapıldı:**
- Dağıtım aşaması (`local | preview | production`) tek yerde türetilir hâle geldi ve `NEXT_PUBLIC_DEPLOY_STAGE` olarak derlemeye gömüldü; uygulama tarafının tek okuma yüzeyi `DEPLOY_STAGE`.
- Türetim üretim **alan adının** gerçekliğinden okunuyor, `VERCEL_ENV`'den değil — fazın üç tüketicisi (noindex, lead `env` alanı, Umami etiketi) aynı kaynaktan beslenecek.

**Öğrenilenler:**
- `next.config.ts` içinden `./src/lib/...` göreli importu Next 16'da çalışıyor; `@/` takma adı denenmedi, gerek kalmadı.
- Node 24'ün yerleşik tip soyması `.ts` dosyasını test koşucusu olmadan doğrudan çağırmaya yetiyor — bu projede saf fonksiyonları sınamanın en ucuz yolu.
- `next.config.ts` → `env` değeri yalnız onu **okuyan** kod varsa çıktıya girer; gömülmenin doğrulanması bir tüketici gerektirir.

---

**Oluşturulma:** 2026-09-11
