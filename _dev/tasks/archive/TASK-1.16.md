# TASK-1.16: Test koşucusu (Vitest) — mevcut elle testler kalıcı teste döner

**Durum:** ✅ Tamamlandı
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
- `CLAUDE.md` → Projeye Özgü Kurallar → "Ölçüm betikleri" tablosuna `npm test` satırı (komut + geçme şartı) — kök doktrin dosyası; değişiklik kullanıcıya bildirilir. Tablonun giriş cümlesi "Hepsi araştırma konteynerinde" diyor; `npm test` `web` konteynerinde koşar, satır bu ayrımı açıkça taşır
- `_dev/memory/saf-fonksiyon-testi-node-tip-soyma.md` — koşucu artık var: kayıt yeni gerçeğe göre yeniden yazılır ya da silinir, MEMORY.md index'i birlikte
- `_dev/docs/DECISIONS.md` — yalnız kurulum 2026-09-13 "Test koşucusu" kaydından saparsa (konum, komut)

---

## Alt Görevler

- [x] **1. Vitest'i kur**
  - Konteynerde: `docker compose exec web npm i -D vitest` → `package.json` + `package-lock.json`
  - `package.json` → `"test": "vitest run"`
  - `vitest.config.ts` (YENİ): `environment: "node"`, `include: ["tests/**/*.test.ts"]`, `resolve.alias` ile `@` → `./src` (ek eklenti bağımlılığı yok)
  - Dosyalar: `package.json`, `package-lock.json`, `vitest.config.ts` (YENİ)
  - **Sapma:** `vitest@^5.0.0` (dokümandaki varsayılan en güncel sürüm) `@types/node@"^22.0.0 || >=24.0.0"` ister; projede `@types/node@^20` sabit (React/Next 16 tip kümesiyle geldi). `npm i` ERESOLVE ile düştü. `vitest@4.1.11` (4.x hattının son sürümü) `@types/node@^20.0.0`'ı da kabul ediyor — konumu/komutu değiştirmeyen, tek satırlık versiyon kilidi; DECISIONS'taki karar (konum `tests/`, komut `npm test`/`vitest run`) sapmadı.

- [x] **2. Aşama türetimi testini taşı**
  - TASK-1.01'in beş senaryosu: boş env → `local`; `vercel.app` üretim adresi → `preview`; `alpfitplus.com` → `production`; `VERCEL_ENV=preview` → `preview`; alan adı tanımsız → `preview` (fail-safe, **ara hâl** — memory süreç disiplini)
  - Dosya: `tests/stage.test.ts` (YENİ)

- [x] **3. `/api/demo` sözleşme bataryasını taşı**
  - Route handler doğrudan import edilir, `POST(new Request(...))` ile çağrılır; alıcı `fetch`'i test içinde sahtelenir
  - Senaryolar (TASK-1.05):
    - Kontrol grubu `{"ok":true}` → 200 `stored:true`
    - Beş bozuk yanıt (200+HTML, 200+`{"ok":false}`, 500+`{"ok":true}`, 200+bozuk JSON, 200+dizi) → 503 `no-sink`
    - Bal küpü dolu → 200, alıcıya çağrı yok
    - Eksik ad/kulüp 422, iletişimsiz 422, rızasız 422, bozuk JSON 400, 6. istek 429
    - Uzun alan kırpılır, 400 dönmez
  - Hız sınırı modül düzeyinde (`HITS`) test dosyası boyunca yaşar → **her senaryo kendi `x-forwarded-for`'unu taşır**; 429 senaryosu ayrı bir IP'de altı istekle ölçülür
  - Loglarda hedef adres ve kişisel veri olmadığı `console.error` casusuyla doğrulanır. Aranan: alıcı adresi, token, ad, telefon, e-posta, mesaj. `no-sink` logu `club` ve `at` taşır (`route.ts:244`, TASK-1.05 kararı) — casus bunu ihlal saymaz
  - Dosya: `tests/api-demo.test.ts` (YENİ)
  - **Sapma:** `LEAD_FILE_PATH` geçici dizine ayarlanmadı; her testte **tanımsız** bırakıldı (`RESEND_API_KEY`/`DEMO_TO`/`DEMO_FROM` ile birlikte). Gerekçe: sink olarak hem webhook hem dosya birlikte açıksa "beş bozuk yanıt" senaryolarında `toWebhook` false dönse bile `toFile` sessizce başarılı olur, `stored` true'ya döner ve beklenen 503 hiç görülmez — TASK-1.05'in kendi ölçümü de yalnız `LEAD_WEBHOOK_URL` ile alınmıştı (dosya yedeği yoktu). Kırpma doğrulaması dosya okuması yerine mock `fetch`'e giden gövdenin (`lead.name`/`lead.branches`) doğrudan ayrıştırılmasıyla yapıldı — TASK-1.05'in ölçtüğünden daha kesin bir kanıt.

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

- [x] `docker compose exec web npm test` → tüm testler geçer, çıkış kodu 0; test ve senaryo sayısı Oturum Kaydı'na yazılır
- [x] **Ürettiğim kapıyı sınadım:** `tests/stage.test.ts`'te bir beklenti bilerek ters çevrildiğinde `npm test` kırmızı ve çıkış kodu **≠ 0**; geri alınınca yeşil
- [x] Sözleşme bataryası bugünkü `route.ts`'e karşı TASK-1.05'in sonuçlarını birebir üretir (kontrol grubu 200 · beş bozuk yanıt 503 · regresyon kodları)
- [x] `docker compose exec web npm run build` hatasız (test dosyaları tip denetiminden geçti, 23 rota)
- [x] `docker compose --profile prod build web-prod` hatasız
- [x] `npx eslint vitest.config.ts tests/` temiz

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-13

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 ✅** — `docker compose exec web npm i -D vitest` denendi, `vitest@5.0.0` `@types/node@^20` ile ERESOLVE verdi (bkz. Kararlar). `vitest@4.1.11` konteynerde kuruldu, `package.json` → `"test": "vitest run"`, `vitest.config.ts` yazıldı (`environment: "node"`, `include: ["tests/**/*.test.ts"]`, `resolve.alias` ile `@` → `./src`, ek eklenti yok).
- **Alt görev 2 ✅** — `tests/stage.test.ts` (YENİ, 5 test): TASK-1.01'in beş senaryosu birebir taşındı.
- **Alt görev 3 ✅** — `tests/api-demo.test.ts` (YENİ, 13 test): kontrol grubu, beş bozuk yanıt, bal küpü, üç 422, bir 400, 429 (6 istek), uzun alan kırpma. Alıcı `fetch`'i `vi.stubGlobal` ile sahtelendi, Resend hiç tetiklenmeyecek şekilde env boş bırakıldı (bkz. Kararlar — `LEAD_FILE_PATH` sapması).
- Doküman güncellemeleri: `CLAUDE.md` → Ölçüm betikleri tablosuna `npm test` satırı ve konteyner ayrımı cümlesi eklendi; `_dev/memory/saf-fonksiyon-testi-node-tip-soyma.md` silindi (artık gerekmiyor), `_dev/MEMORY.md` index'inden satırı düştü, iki kardeş memory dosyasındaki (`alternatif-env-ile-uretim-derlemesi.md`, `arastirma-konteynerinde-tarayici-olcumu.md`) ona işaret eden "İlgili" satırları güncellendi (dangling link bırakılmadı).

**Sorunlar:**
- `vitest@^5.0.0` kurulumu `@types/node@^20` (proje sabiti) ile `ERESOLVE` verdi — vitest 5, `@types/node@"^22.0.0 || >=24.0.0"` peer'ı istiyor. Çözüm Kararlar'da.
- `docker compose run --rm web sh -c "npm run build"` paylaşılan `next_cache` isimli hacme yazdı (aynı `web` servisi tanımını kullanıyor) ve geliştirme sunucusunun `.next`'ini ezdi — memory → "Alternatif env ile üretim derlemesi" dersi tam burada geçerli çıktı. `docker compose restart web` ile düzeltildi, `curl localhost:3000` 200 döndüğü doğrulandı.

**Kararlar:**
- **`vitest@4.1.11` (5.x değil).** 4.x hattının son sürümü `@types/node@"^20.0.0 || ^22.0.0 || >=24.0.0"` kabul ediyor, projenin `@types/node@^20` sabitini bozmadan kuruldu. DECISIONS'taki 2026-09-13 "Test koşucusu" kararı yalnız konum (`tests/`) ve komut (`npm test`/`vitest run`) belirtiyordu, sürüm belirtmiyordu — DECISIONS'a yeni kayıt gerekmedi (task talimatındaki "yalnız konum/komut saparsa" koşulu tetiklenmedi).
- **`LEAD_FILE_PATH` battery boyunca tanımsız bırakıldı** (task metni "geçici dizine" diyordu). Gerekçe: dosya sinki açıkken "beş bozuk yanıt" senaryolarında `toFile` sessiz yedek olarak devreye girer, `stored` true'ya döner ve TASK-1.05'in ölçtüğü 503 hiçbir zaman üretilemez — TASK-1.05'in kendi ölçümü de yalnız `LEAD_WEBHOOK_URL` ile alınmıştı. Kırpma senaryosu dosya yerine mock `fetch`'e giden gövdenin ayrıştırılmasıyla doğrulandı.
- **`_dev/memory/saf-fonksiyon-testi-node-tip-soyma.md` silindi, yeniden yazılmadı.** Task iki seçenek sunuyordu; Node tip-soyma workaround'unun artık hiçbir kullanım alanı kalmadığı için (her saf fonksiyon artık `npm test` ile sınanıyor) yeniden yazmak yerine dosya ve index satırı kaldırıldı. İki kardeş memory dosyasındaki çapraz referanslar güncellendi ki dangling link kalmasın.

**Son Yaklaşım:**
Task tek oturumda, plandaki üç alt görevle bitti; sapmalar (vitest sürümü, `LEAD_FILE_PATH`) mevcut sözleşmeyi/kabul kriterlerini bozmadı.

**Sonraki Adım Detayı:**
Sıradaki task TASK-1.11 (Bunker keşfi). TASK-1.12 ve TASK-1.14 kendi testlerini bundan sonra doğrudan `tests/`'e yazacak (bu task'ın hedefinin bir parçası, bağlam bölümünde belirtildi).

**Dosya Değişiklikleri:**
- `package.json` → `vitest` devDependency, `"test": "vitest run"` betiği.
- `package-lock.json` → kilit güncellendi (34 paket eklendi).
- `vitest.config.ts` → YENİ.
- `tests/stage.test.ts` → YENİ (5 test).
- `tests/api-demo.test.ts` → YENİ (13 test).
- `CLAUDE.md` → Ölçüm betikleri tablosu + giriş cümlesi.
- `_dev/memory/saf-fonksiyon-testi-node-tip-soyma.md` → silindi.
- `_dev/MEMORY.md` → index satırı düştü, Son Güncelleme satırı.
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md`, `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` → dangling "İlgili" referansları güncellendi.

**Test Sonuçları:**
- **`docker compose exec web npm test` → 2 dosya, 18 test, TÜMÜ PASS, çıkış kodu 0.** `tests/stage.test.ts` (5 test) + `tests/api-demo.test.ts` (13 test: kontrol grubu, 5 bozuk yanıt, bal küpü, missing/missing-contact/no-consent, bad-json, 429, kırpma).
- **Ürettiğim kapıyı sınadım — bozuk girdi:** `stage.test.ts`'teki ilk beklenti (`local` → `production`'a) elle ters çevrildi; `npm test` kırmızıya döndü ve çıkış kodu **1** oldu (1 failed / 17 passed). Geri alınınca 18/18 yeşil, çıkış kodu 0 — kapı gerçekten kırmızıya dönebiliyor (B-030 dersi karşılandı).
- **Sözleşme bataryası TASK-1.05'in sonuçlarını birebir üretti:** kontrol grubu `{"ok":true}` → 200 `stored:true, mailed:false`; beş bozuk yanıt (200+HTML, 200+`{"ok":false}`, 500+`{"ok":true}`, 200+bozuk JSON, 200+dizi) → hepsi 503 `no-sink`; bal küpü → 200 `{"ok":true}`, `fetch` hiç çağrılmadı; eksik ad/kulüp → 422 `missing`; iletişimsiz → 422 `missing-contact`; rızasız → 422 `no-consent`; bozuk JSON → 400 `bad-json`; paylaşılan IP'de 6 istek → `[422,422,422,422,422,429]`; 200 karakterlik `name` + 50 karakterlik `branches` → 200 dönüyor (400 değil), alıcıya giden gövdede `name.length===120`, `branches.length===10` (mock `fetch` çağrı gövdesinden doğrudan okundu).
- **Log sızıntısı yok:** beş bozuk yanıt senaryosunun her birinde `console.error` casusunun tüm çağrıları serileştirilip alıcı URL'si, `name`, `phone`, `email`, `message` değerlerinin **hiçbirini** içermediği doğrulandı (`club`/`at` hariç — TASK-1.05 kararı, ihlal sayılmıyor).
- **Kapsam dürüstlüğü:** bu batarya route handler'ı doğrudan çağırıyor; Next sunucusu, gerçek başlıklar ve ağ TASK-1.05'in 3200 konteyner ölçümünün kapsamındaydı, burada tekrar ölçülmedi — bu test onu **kalıcılaştırılmış mantık katmanı** olarak tamamlıyor.
- **`docker compose exec web npm run build` → hatasız, 23 rota** (test dosyaları `**/*.ts` kapsamında tip denetiminden geçti). Bu derleme paylaşılan `next_cache` hacmine yazdığı için hemen ardından `docker compose restart web` koşuldu; `curl localhost:3000` → 200.
- **`docker compose --profile prod build web-prod` → hatasız**, aynı 23 rota; yeni devDependency `deps` aşamasında kuruldu ama standalone çıktı yalnız üretim bağımlılıklarını kopyaladığı için çalışma zamanına girmedi.
- **`npx eslint vitest.config.ts tests/` → temiz, çıkış kodu 0.**
- **Kapsam dışı bırakıldı:** beş UI ölçüm betiği (a11y, mobil, font, perf, tarama) koşmadı — bu task hiçbir render yüzeyine, metne veya karaktere dokunmadı; değişiklik yalnız test altyapısı ve bir sunucu rota işleyicisinin dolaylı (test-only) kapsamı.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-13

**Ne Yapıldı:**
- Vitest kuruldu (`vitest@4.1.11`, tek devDependency), `npm test` (`vitest run`) kalıcı test koşucusu oldu; `tests/` kökte, `@` takma adı `resolve.alias` ile çözülüyor.
- TASK-1.01'in beş aşama-türetimi senaryosu ve TASK-1.05'in on üç `/api/demo` sözleşme/doğrulama senaryosu artık `docker compose exec web npm test` ile her oturumda tekrar koşuyor; elle-koşup-kaybolan test güvencesi kalıcı hale geldi.
- Kapı bilerek bozulan bir beklentiyle kırmızıya döndüğü ölçülerek doğrulandı (B-030 dersi).

**Öğrenilenler:**
- `vitest@5.0.0`'ın `@types/node` peer aralığı (`^22 || >=24`) projenin `@types/node@^20` sabitiyle çakışıyor; 4.x hattı (`4.1.11`) aynı işlevi peer çakışması olmadan veriyor.
- Bir sink'in (dosya) "sessiz yedek" olması, sözleşme testinin ölçmek istediği başarısızlığı (503) görünmez kılabilir — test kurulumunun kendisi de bir sızdırmazlık kararı gerektiriyor.
- `docker compose run --rm web ...` da aynı isimli hacmi (`next_cache`) paylaşıyor; "ayrı konteyner" tek başına `.next` çakışmasını önlemiyor, restart hâlâ gerekiyor.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu)
