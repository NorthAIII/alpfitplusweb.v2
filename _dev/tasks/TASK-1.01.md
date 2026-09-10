# TASK-1.01: Aşama türetimi ve `deployStage` tek kaynağı

**Durum:** ⬜ Bekliyor
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

- [ ] **1. Aşama türetimini yaz**
  - Saf fonksiyon: girdi bir env sözlüğü, çıktı `"local" | "preview" | "production"`
  - Kural: `VERCEL` tanımsız → `local`; `VERCEL_ENV === "production"` **ve** `VERCEL_PROJECT_PRODUCTION_URL` `.vercel.app` ile bitmiyor → `production`; diğer tüm Vercel hâlleri → `preview`
  - Dosya: `src/lib/stage.ts` (YENİ)

- [ ] **2. Değeri derlemeye göm**
  - `next.config.ts` fonksiyonu `process.env` ile çağırır ve `env: { NEXT_PUBLIC_DEPLOY_STAGE: <değer> }` olarak yazar
  - Aynı hesaplanmış değer dosya içinde bir sabitte tutulur — `headers()` (TASK-1.02) aynı sabiti okuyacak
  - Dosya: `next.config.ts`

- [ ] **3. Okuma yüzeyini ver**
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

- [ ] Saf fonksiyon üç senaryoda doğru değeri döner (node ile doğrudan çağrılarak): boş env → `local`; `{VERCEL:"1", VERCEL_ENV:"production", VERCEL_PROJECT_PRODUCTION_URL:"alpfitplus-web-v2.vercel.app"}` → `preview`; aynısı `VERCEL_PROJECT_PRODUCTION_URL:"alpfitplus.com"` ile → `production`
- [ ] `{VERCEL:"1", VERCEL_ENV:"preview"}` → `preview` (dal önizlemesi)
- [ ] `docker compose exec web npm run build` hatasız geçer, 23 rota üretir
- [ ] Yerel geliştirmede sayfa kaynağında gömülü değer `local`

---

## Karar Noktaları

- **Saf fonksiyonun evi:** `src/lib/stage.ts` (önerilen — node ile sınanabilir, tek dosya) vs. `next.config.ts` içinde satır içi (araştırma metnine harfi harfine yakın ama sınanması üç ayrı derleme ister). Göreli import config'te çalışmazsa satır içi hâle dön ve iki derleme ölçümüyle sına; sapmayı Oturum Kaydı'na yaz.

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
