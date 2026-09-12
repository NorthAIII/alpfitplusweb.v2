# TASK-1.16: Test koşucusu (Vitest) — mevcut elle testler kalıcı teste döner

**Durum:** ⬜ Bekliyor
**Modül:** M6 — Kalite Kapıları (`modules/M6-Kalite-Kapilari.md`) · dokunulan yüzey M3, M7
**Feature:** F3.2 güvencesi — test altyapısı (M6 F6.1'in genişlemesi; CI F6.3'te kalır, feature matrisi değişmez)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** Yok

---

## Hedef

Repoya bir test koşucusu (Vitest) kurmak ve bu fazda **elle, geçici betiklerle** koşturulmuş iki testi kalıcı hâle getirmek: aşama türetimi (TASK-1.01) ve `/api/demo` sözleşme bataryası (TASK-1.05).

Task, `docker compose exec web npm test` konteynerde geçtiğinde, bilerek bozulan bir beklentide **sıfırdan farklı çıkış koduyla** kırmızıya döndüğünde ve derleme ile üretim imajı etkilenmediğinde tamamlanmış sayılır.

---

## Bağlam

ILKELER → "Kümülatif test altyapısı" bugün **karşılanmıyor**. Repoda test koşucusu yok, saf fonksiyonlar scratchpad betikleriyle elle sınanıyor (memory → Saf fonksiyon testi). TASK-1.01, 1.02 ve 1.05'in testleri o oturumda koşup kayboldu; geriye dönük güven birikmiyor.

Kullanıcı kararı (2026-09-13): koşucu bu fazda, **lead task'larından önce** kurulur ve koşucu Vitest'tir. Böylece TASK-1.12 (biçim doğrulaması) ve TASK-1.14 (site bağlantısı) testlerini doğrudan buraya yazar.

**Kapsam sınırı:** CI (GitHub Actions), tek komut ölçüm ve ölçüm betiklerinin kırmızıya dönememesi (B-030) "Kalite kapıları otomatik" fazının işi. Bu task yalnız koşucuyu ve iki testi getirir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.01.md` → Test Sonuçları — `deriveDeployStage`'in beş senaryosu
- `_dev/tasks/archive/TASK-1.05.md` → Test Kriterleri ve Test Sonuçları — sözleşme bataryası (beş bozuk yanıt + kontrol grubu, doğrulama regresyonları)
- `_dev/memory/saf-fonksiyon-testi-node-tip-soyma.md` — bu task'la bayatlayacak kayıt
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — senaryo başına ayrı `X-Forwarded-For`
- `_dev/bulgular/B-030-kapilar-kirmiziya-donemiyor.md` — "kırmızıya dönemeyen kapı" dersi
- `src/lib/stage.ts`, `src/app/api/demo/route.ts`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `CLAUDE.md` → Projeye Özgü Kurallar → "Ölçüm betikleri" tablosuna `npm test` satırı (komut + geçme şartı) — kök doktrin dosyası; değişiklik kullanıcıya bildirilir
- `_dev/memory/saf-fonksiyon-testi-node-tip-soyma.md` — koşucu artık var: kayıt yeni gerçeğe göre yeniden yazılır ya da silinir, MEMORY.md index'i birlikte
- `_dev/docs/DECISIONS.md` — yalnız kurulum 2026-09-13 "Test koşucusu" kaydından saparsa (konum, komut)

---

## Alt Görevler

- [ ] **1. Vitest'i kur**
  - Konteynerde: `docker compose exec web npm i -D vitest` → `package.json` + `package-lock.json`
  - `package.json` → `"test": "vitest run"`
  - `vitest.config.ts` (YENİ): `environment: "node"`, `include: ["tests/**/*.test.ts"]`, `resolve.alias` ile `@` → `./src` (ek eklenti bağımlılığı yok)
  - Dosyalar: `package.json`, `package-lock.json`, `vitest.config.ts` (YENİ)

- [ ] **2. Aşama türetimi testini taşı**
  - TASK-1.01'in beş senaryosu: boş env → `local`; `vercel.app` üretim adresi → `preview`; `alpfitplus.com` → `production`; `VERCEL_ENV=preview` → `preview`; alan adı tanımsız → `preview` (fail-safe, **ara hâl** — memory süreç disiplini)
  - Dosya: `tests/stage.test.ts` (YENİ)

- [ ] **3. `/api/demo` sözleşme bataryasını taşı**
  - Route handler doğrudan import edilir, `POST(new Request(...))` ile çağrılır; alıcı ve Resend `fetch`'i test içinde sahtelenir, `LEAD_FILE_PATH` geçici dizine
  - Senaryolar (TASK-1.05):
    - Kontrol grubu `{"ok":true}` → 200 `stored:true`
    - Beş bozuk yanıt (200+HTML, 200+`{"ok":false}`, 500+`{"ok":true}`, 200+bozuk JSON, 200+dizi) → 503 `no-sink`
    - Bal küpü dolu → 200, alıcıya çağrı yok
    - Eksik ad/kulüp 422, iletişimsiz 422, rızasız 422, bozuk JSON 400, 6. istek 429
    - Uzun alan kırpılır, 400 dönmez
  - Hız sınırı modül düzeyinde (`HITS`) test dosyası boyunca yaşar → **her senaryo kendi `x-forwarded-for`'unu taşır**; 429 senaryosu ayrı bir IP'de altı istekle ölçülür
  - Loglarda hedef adres ve kişisel veri olmadığı `console.error` casusuyla doğrulanır
  - Dosya: `tests/api-demo.test.ts` (YENİ)

---

## Etkilenen Dosyalar

```
./
├── package.json          # vitest devDependency, "test" betiği — zaten var
├── package-lock.json     # kilit — zaten var
└── vitest.config.ts      # YENİ — node ortamı, tests/ kapsamı, @ takma adı
tests/
├── stage.test.ts         # YENİ — deriveDeployStage beş senaryo
└── api-demo.test.ts      # YENİ — /api/demo sözleşme ve doğrulama bataryası
```

> Dosya sayısı üçü aşıyor ama `package-lock.json` üretilen dosyadır; iki test dosyası da koşucunun kabul ölçüsüdür, koşucudan ayrılamaz.

---

## Dikkat Noktaları

- **Konum `tests/` (kök):** `src/` yalnız ürün kodunu taşır. `tsconfig.json` `**/*.ts` kapsadığı için `next build` test dosyalarını da tip denetiminden geçirir; testler tip olarak temiz yazılır. `src/app/` altına test dosyası konmaz.
- **Kırmızıya dönebilen kapı (B-030 dersi):** koşucunun kendisi bir kapıdır. Bilerek bozulan bir beklentiyle `npm test` çıkış kodunun **sıfırdan farklı** olduğu ölçülür; ölçülmeden "kapı çalışıyor" yazılmaz.
- **Kapsam dürüstlüğü:** route handler'ı doğrudan çağıran test **serving katmanını** (Next sunucusu, başlıklar, gerçek ağ) ölçmez. TASK-1.05'in 3200 konteynerindeki ölçümünün yerine geçmez, onu **kalıcılaştırılmış mantık katmanı** olarak tamamlar. Test Sonuçları bu kapsamla yazılır.
- `DEPLOY_STAGE` modül yüklenirken `process.env.NEXT_PUBLIC_DEPLOY_STAGE`'ten okunur; testte tanımsızdır ve `local` olur. Aşama senaryoları route üzerinden değil saf fonksiyon üzerinden sınanır.
- **Üretim imajı:** `Dockerfile` `deps` aşaması `npm ci` koşar. Yeni devDependency imajı büyütebilir ama `runner` aşaması standalone çıktı kopyaladığı için çalışma zamanına girmez. `web-prod` yeniden derlenerek doğrulanır.
- `node_modules` `web` konteynerinde isimli hacimdir. Kurulum konteyner içinde yapılır, host'ta `npm i` koşulmaz.
- Yeni bağımlılık tektir (`vitest`); eklenti (`vite-tsconfig-paths` vb.) eklenmez.

---

## Test Kriterleri

- [ ] `docker compose exec web npm test` → tüm testler geçer, çıkış kodu 0; test ve senaryo sayısı Oturum Kaydı'na yazılır
- [ ] **Ürettiğim kapıyı sınadım:** `tests/stage.test.ts`'te bir beklenti bilerek ters çevrildiğinde `npm test` kırmızı ve çıkış kodu **≠ 0**; geri alınınca yeşil
- [ ] Sözleşme bataryası bugünkü `route.ts`'e karşı TASK-1.05'in sonuçlarını birebir üretir (kontrol grubu 200 · beş bozuk yanıt 503 · regresyon kodları)
- [ ] `docker compose exec web npm run build` hatasız (test dosyaları tip denetiminden geçti, 23 rota)
- [ ] `docker compose --profile prod build web-prod` hatasız
- [ ] `npx eslint vitest.config.ts tests/` temiz

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

**Oluşturulma:** 2026-09-13 (plan revizyonu)
