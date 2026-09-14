# TASK-1.13: Depo sözleşme paketi — adaptörün dayandığı davranış yerel depoya karşı kalıcı testte

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.17 ✅ (yerel depo), TASK-1.16 ✅ (test koşucusu)

---

## Hedef

Sitenin kayıt adaptörünün (TASK-1.14) dayanacağı depo davranışını, yerel depo kopyasına karşı koşan kalıcı bir Vitest paketiyle dondurmak. Paket depoyu değil **sözleşmeyi** ölçer. Depo kodu bu reponun dışında, v1'de yaşıyor. Hook'lar orada değişirse sitenin varsayımı sessizce çürümemeli, bu paket kırmızıya dönmeli.

Task şu koşullar sağlandığında tamamlanmış sayılır:

- Paket yerel depoya karşı yeşil.
- Env tanımsızken atlandığını açıkça raporluyor ve varsayılan `npm test`'i kırmıyor.
- Yerel olmayan bir adrese karşı koşmayı reddediyor.
- Bilerek bozulan depo kurulumunda kırmızıya dönüyor.

---

## Bağlam

Depo sözleşmesinin tek evi `../Alpfitplus-website.v1/pocketbase/README.md` → "Uç nokta sözleşmesi". Kod: `pb_hooks/lead.pb.js` + `lead_lib.js`. v2'nin eski `toWebhook` sözleşmesiyle üç farkı var (TASK-1.11 → Oturum 2026-09-14):

- Başarı `201 {id, prior_count}`; `ok` alanı yok.
- Kimlik `X-Lead-Token` başlığı. Token koleksiyonu da seçer: önizleme → `leads_preview`, üretim → `leads`. Gövdedeki `env` yok sayılır.
- `ip_hash` zorunlu. Aynı `ip_hash` saatte 5 kayda ulaşınca `429`.

2026-09-13'ün "sözleşme paketi iki ortamda koşar" tasarımı bu hedefte **tek ortama** iner: paket yalnız yerelde koşar. Canlı depo gerçek talepleri tutuyor ve saatlik sınırı paylaşıyor. Oraya test yığılmaz; canlı teyit TASK-1.18'in tek isteğidir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `../Alpfitplus-website.v1/pocketbase/README.md` → Koleksiyon şeması, Uç nokta sözleşmesi (`POST /lead`, `PATCH /lead/{id}`) — **salt okunur**
- `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js` — `readLead` beyaz listesi, `MAX_LEN`, `resolveTarget`, `countPrior`
- `_dev/tasks/archive/TASK-1.17.md` → Oturum Kaydı — yerel depo komutları, servis adı, token env adları
- `_dev/tasks/archive/TASK-1.16.md` → test konumu ve komutu
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — senaryo başına ayrı IP deseni. Burada karşılığı senaryo başına ayrı `ip_hash`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `CLAUDE.md` → Ölçüm betikleri tablosundaki `npm test` satırı — sözleşme paketinin env'le koştuğu komut. Kök doktrin dosyasıdır, değişiklik kullanıcıya bildirilir

---

## Alt Görevler

- [x] **1. Paketin koşma kapısını yaz**
  - Env adları sitenin canlı anahtarlarından **ayrı** (öneri `LEAD_CONTRACT_URL`, `LEAD_CONTRACT_TOKEN_PREVIEW`, `LEAD_CONTRACT_TOKEN_PRODUCTION`). Gerekçe: yanlışlıkla canlı `LEAD_STORE_*` değerleriyle koşulamasın
  - URL tanımsızsa `describe.skip` + görünür rapor satırı, çıkış 0
  - Host yerel servis değilse (`lead-store`, `localhost`, `127.0.0.1`) paket **koşmaz**, açık hata verir
  - Dosya: `tests/lead-store.contract.test.ts` (YENİ)

- [x] **2. Senaryoları yaz** (test kriterleriyle birebir)
  - Her senaryo kendi rastgele `ip_hash`'ini **ve** kendi benzersiz e-postasını taşır, telefon yalnız gerektiğinde ve yine benzersiz. Gerekçe: `countPrior` koleksiyon genelinde aynı e-posta **veya** telefonu sayar (`lead_lib.js:211-220`) ve hacim koşudan koşuya birikir; sabit adresle `prior_count` beklentileri ikinci koşuda kırılır. Hız sınırı senaryosu ayrı bir `ip_hash`'te altı istekle ölçülür
  - Gövdeler gerçek kişi verisi taşımaz (`example.com`, `Test Kulüp`)
  - Kayıt okuma yöntemi: kriterlerin bir kısmı kaydın **alanlarını ve sayısını** okur (`env`, `notify_*`, 5000 karakter, "tam 5 kayıt", "kayıt sayısı değişmedi"). Koleksiyon kuralları `null` olduğu için bunlar yalnız superuser okumasıyla ölçülür: yerel geçici superuser (`pocketbase superuser upsert`, rastgele parola yalnız o komutta ve env'de, çıktıya basılmaz). `PATCH /lead/{id}`'nin koleksiyon kapsamı yalnız "hangi koleksiyonda" sorusuna yeter, sayıma değil. Uygulama ayrıntısı ve gerekçe Oturum Kaydı'na. Yeni bağımlılık eklenmez
  - Dosya: `tests/lead-store.contract.test.ts` (YENİ)

- [x] **3. Koşum komutunu belgele**
  - `docker compose exec -e LEAD_CONTRACT_URL=http://lead-store:8090 -e … web npm test` — token değeri komut geçmişine basılmadan (`.env`'den okuyan kabuk değişkeniyle)
  - `.env.example`'a sözleşme paketinin env adları **değersiz** girer
  - Dosyalar: `.env.example`, `CLAUDE.md` (bildirimle)

---

## Etkilenen Dosyalar

```
tests/
└── lead-store.contract.test.ts   # YENİ — yerel depoya karşı sözleşme paketi
./
├── .env.example                  # LEAD_CONTRACT_* adları — zaten var
└── CLAUDE.md                     # npm test satırına sözleşme paketi komutu — zaten var (kök doktrin; bildirimle)
```

---

## Dikkat Noktaları

- **Paket depoyu yeniden test etmez, adaptörün varsayımını dondurur.** v1'in TASK-1.04'ü 62 kontrolü canlıda koştu. Burada yalnız TASK-1.14'ün okuduğu yüzey var: durum kodları, gövde biçimleri, token → koleksiyon, `ip_hash` zorunluluğu, `429`, beyaz liste, `PATCH` kapsamı.
- **`413` gövdesi JSON değil** (PocketBase'in kendi yanıtı; v1 README → Uç nokta sözleşmesi). Paket bunu olduğu gibi kaydeder. TASK-1.14 bu yüzden durum koduna bakar, gövdeye değil.
- **Hız sınırı transaction'la sayılır ve reddedilen istek kayıt yazmaz.** Altı istekten sonra koleksiyonda o `ip_hash` için **tam 5** kayıt olmalı.
- **`prior_count` dedup değildir.** Aynı e-postayla ikinci istek `prior_count: 1` döner ve yine ayrı kayıt olur.
- **Paket her koşuda kayıt yazar** ve yerel hacim birikir. Temizlik gerekmez: hacim atılabilir (TASK-1.17). Sayım senaryoları mutlak sayıya değil **fark**a bakar.
- Sır hijyeni: token değeri test çıktısına, assertion mesajına ya da loga basılmaz.
- `npm test` bugün 3 dosya / 43 test. Env'siz koşuda sayı değişmemeli, yalnız "atlandı" satırı eklenmeli.

---

## Test Kriterleri

- [x] Paket yerel depoya karşı (`docker compose --profile lead up -d lead-store` + env) `npm test` içinde yeşil:
  - Önizleme token'ı + geçerli gövde → `201`, gövde `id` (15 karakter) ve `prior_count: 0` taşıyor; kayıt `leads_preview`'da, `env=preview`, `notify_team`/`notify_lead` `pending`
  - Üretim token'ı → kayıt `leads`'te, `env=production`; önizleme koleksiyonunda değil (token koleksiyonu seçiyor)
  - Gövdede `env: "production"` gönderen önizleme isteği yine `leads_preview`'a düşüyor (gövdedeki env yok sayılıyor)
  - Token'sız ve yanlış token → `401 {"error":"unauthorized"}`, kayıt sayısı değişmedi
  - `name`, `club` ya da `ip_hash` eksik → `400 {"error":"invalid-payload"}`, kayıt yok
  - Aynı `ip_hash` ile altı istek → `[201,201,201,201,201,429]`, o `ip_hash` için tam 5 kayıt
  - O senaryoya özgü yeni bir e-postayla ilk istek `prior_count: 0`, aynı e-postayla ikinci istek → `prior_count: 1`
  - 5000'i aşan `message` → `201` ve kayıtta 5000 karakter (kırpıldı, reddedilmedi)
  - `PATCH /lead/{id}` `{"notify_team":"sent"}` → `200 {"ok":true}`; önizleme token'ıyla üretim kaydına `PATCH` → `404`
- [x] Env tanımsızken `docker compose exec web npm test` sözleşme paketini atladığını raporluyor, diğer 43 test yeşil, çıkış 0
- [x] `LEAD_CONTRACT_URL=https://lead.alpfitplus.com` verildiğinde paket **istek atmadan** hata veriyor (canlı koruma kapısı)
- [x] **Ürettiğim kapıyı sınadım — bozuk girdi:** depo önizleme token'ı boş bırakılarak yeniden kaldırıldığında `201` senaryoları kırmızı; token geri gelince yeşil. Kontrol grubu `401` senaryosu iki koşuda da yeşil (kapı her şeye kırmızı basmıyor)
- [x] `npx eslint tests/lead-store.contract.test.ts` temiz; `docker compose exec web npm run build` hatasız (test dosyası tip denetiminden geçti)

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-14

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 ✅** — `tests/lead-store.contract.test.ts` (YENİ): env kapısı `LEAD_CONTRACT_URL` tanımsızken `describe.skip` + görünür "atlandı" satırı; tanımlıyken host `lead-store`/`localhost`/`127.0.0.1` dışındaysa `assertLocalHost` modül kapsamında senkron `throw` ile **istek atmadan** hata veriyor (canlı koruma kapısı).
- **Alt görev 2 ✅** — Test Kriterleri'ndeki 9 madde birebir 10 `it()`'e taşındı (PATCH ikiye bölündü: 9a/9b). Her senaryo kendi `uniqueIpHash`/`uniqueEmail`'ini üretiyor. Kayıt-okuyan kriterler (env, notify_*, mesaj uzunluğu, ip_hash başına tam sayım) geçici superuser'la okunuyor: `POST /api/collections/_superusers/auth-with-password` → `Authorization: <token>` (Bearer önekisiz — PocketBase kendi konvansiyonu, ilk denemede çalıştı) ile `GET /api/collections/{col}/records/{id}` ve filtreli sayım (`?filter=...`). PATCH senaryoları (9a/9b) bilerek superuser okuması istemiyor, yalnız durum kodu.
- **Alt görev 3 ✅** — `.env.example` §4 yeni blok (`LEAD_CONTRACT_URL`/`_TOKEN_PREVIEW`/`_TOKEN_PRODUCTION`/`_SUPERUSER_EMAIL`/`_SUPERUSER_PASSWORD`, değersiz, Analitik bloğu §5'e kaydı); `CLAUDE.md` → Ölçüm betikleri `npm test` satırı + yeni bullet (env kapısı özeti, tam koşum komutu test dosyasının başlık yorumunda) — kök doktrin dosyası, bu kayıtla bildiriliyor.

**Sorunlar:**
- İlk yazımda başlık yorumundaki `notify_*/mesaj` ifadesi `*/` alt-dizisini içerdiği için JS blok yorumunu erken kapattı, `npm test` parse hatası verdi. `notify_* alanları, mesaj uzunluğu` şeklinde ayrılarak düzeltildi.
- Kendi kendine sınamanın (bozuk girdi) ilk denemesi yanıltıcı yeşil döndü: `.env`'i `set -a; source .env; set +a` ile aynı shell'e export edip SONRA `docker compose up -d lead-store` çağırınca Compose, dosyadaki (boşaltılmış) değeri değil shell'den miras kalan eski değeri kullandı — konteyner sessizce yeniden yaratılmadı (`docker inspect` `Created` zaman damgası değişmemiş, konteyner içi `env` hâlâ 64 karakter gösteriyordu). `unset` + `--force-recreate` ile düzeltildi; teşhis deseni (`docker inspect Created` + konteyner içi `env | awk` ile **uzunluk**, değer değil) `_dev/memory/yerel-lead-deposu-docker-profili.md` Tuzak 6'ya yazıldı.

**Kararlar:**
- Superuser kimlik env adları (`LEAD_CONTRACT_SUPERUSER_EMAIL`/`_PASSWORD`) eklendi — task metni Alt Görev 2'de uygulama ayrıntısını serbest bırakmıştı. Gerekçe: koleksiyon kuralları `null` (yalnız superuser), kayıt-okuyan kriterler HTTP üzerinden ancak superuser auth token'ıyla okunabiliyor; `pocketbase superuser upsert` `web` konteynerinden erişilemeyen bir CLI komutu olduğu için koşumun ayrı bir adımı (lead-store'da `docker compose exec`) oldu.
- "Kayıt sayısı değişmedi" kriterleri mutlak sayı yerine **senaryoya özgü benzersiz `ip_hash`/`email` filtresiyle 0 bekleniyor** olarak uygulandı (Dikkat Noktaları'nın "fark'a bakar" ilkesini izler) — global sayaca bağlı kırılganlığı önler.
- PATCH senaryoları (9a/9b) ayrı fixture açmak yerine (1) ve (2)'nin oluşturduğu kayıtları yeniden kullanıyor; dosya içi sıralı yürütmeye dayanır (Vitest varsayılanı, concurrent yok) — boş id'ye karşı açık `expect(...).not.toBe("")` koruması eklendi.
- `lead-store` konteyneri oturum sonunda **çalışır bırakıldı** (varsayılan `up`'ı etkilemiyor) — TASK-1.14 aynı depoya karşı çalışacağı için kapatılmadı.
- docs/DECISIONS.md'ye eklendi: Hayır (planı değiştiren bir mimari/iş kuralı kararı yok; superuser env adları task metninin bıraktığı uygulama ayrıntısı).

**Kalan İşler:** Yok — task tam kapandı.

**Son Yaklaşım:** N/A — pause olmadı, task tek oturumda uçtan uca bitti.

**Sonraki Adım Detayı:** N/A — sıradaki task TASK-1.14 (kayıt adaptörü), kendi task dokümanından başlar; bu paket onun dayanacağı sözleşmeyi donduruyor.

**Dosya Değişiklikleri:**
- `tests/lead-store.contract.test.ts` → YENİ (10 test)
- `.env.example` → §4 yeni blok eklendi (LEAD_CONTRACT_* adları, değersiz), Analitik bloğu §5'e kaydı
- `CLAUDE.md` → Ölçüm betikleri `npm test` satırı güncellendi + yeni bullet (kök doktrin dosyası, bildirimle)
- `_dev/memory/yerel-lead-deposu-docker-profili.md` → Tuzak 6 eklendi (shell export'un `.env`'i gölgelemesi)

**Test Sonuçları:**
- **Boş kapsam sınaması:** `docker compose exec web npm test` (LEAD_CONTRACT_* hiç tanımsız) → `tests/lead-store.contract.test.ts` görünür `↓ (1 test | 1 skipped)`, diğer 3 dosya / 43 test PASS, **çıkış kodu 0** (43 passed, 1 skipped, 4 dosya) — env yokken paket sessizce "yeşil" değil, açıkça "atlandı" raporluyor.
- **Gerçek depoya karşı** (`docker compose --profile lead up -d lead-store` sağlıklı + geçici superuser + `.env`'deki gerçek token'lar) → **10/10 test PASS**, `--reporter=verbose` ile ad ad doğrulandı: (1) önizleme 201/id-15/prior_count-0/env=preview/notify_* pending · (2) üretim → `leads`'te env=production + `leads_preview`'da 404 · (3) gövde `env` spoofing yok sayılıyor · (4) tokensiz/yanlış token → 401 + kayıt yok · (5) name/club/ip_hash eksik (üçü de) → 400 + kayıt yok · (6) 6. istekte 429 + o ip_hash için tam 5 kayıt · (7) prior_count 0→1 · (8) 5000 karaktere kırpma · (9a) PATCH sent→200 · (9b) yanlış koleksiyona PATCH→404. Toplam paket: 4 dosya / **53 test PASS**, çıkış kodu 0.
- **Ürettiğim kapıyı sınadım — bozuk girdi:** depoda `LEAD_TOKEN_PREVIEW` boşaltılıp `--force-recreate` ile gerçekten yeniden yaratıldığında (test'e hâlâ gerçek/orijinal önizleme token'ı verilerek) **8/10 test kırmızı** — (1)(3)(5)(6)(7)(8)(9a)(9b), hepsi önizleme token'ına dayanıyor. **Kontrol grubu (2) üretim token'ı ve (4) tokensiz/yanlış-token 401 senaryosu iki koşuda da (kırık ve düzeltilmiş) yeşil kaldı** — kapı her şeye kırmızı basmıyor, yalnız gerçekten bozulanı yakalıyor. Token `.env`'e geri yüklenip (`diff` ile byte-bire-bir doğrulandı) yeniden yaratıldığında 10/10 yeniden yeşil (53/53 toplam) — **boş kapsam ve bozuk girdi sınamalarının ikisi de bu oturumda koşuldu ve raporlanıyor.**
- **Sızıntı denetimi:** çalışma günlüklerinde iki token değerinin de `grep -cF` ile **0** eşleşmesi doğrulandı (test kendi hata mesajlarında yalnız env adı/hostname yazıyor, değer yazmıyor); `.env` hiçbir adımda ekrana basılmadı, geçici superuser parolası yalnız komut argümanı olarak geçti ve çıktı `<REDACTED>` ile sansürlendi.
- `npx eslint tests/lead-store.contract.test.ts` → temiz, çıkış kodu 0.
- `docker compose exec web npm run build` → hatasız, 23 rota (test dosyası tip denetiminden geçti); paylaşılan `next_cache`'e yazdığı için ardından `docker compose restart web` koşuldu (memory → "Alternatif env ile üretim derlemesi" / TASK-1.16 emsali), `curl localhost:3000` → 200.
- Kapsam dışı bırakıldı: beş UI ölçüm betiği (a11y, mobil, font, perf, tarama) — bu task hiçbir render yüzeyine dokunmadı.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-14

**Ne Yapıldı:**
- `tests/lead-store.contract.test.ts` kalıcı Vitest paketi eklendi: sitenin kayıt adaptörünün (TASK-1.14) dayanacağı depo sözleşmesini (durum kodları, gövde biçimleri, token→koleksiyon eşlemesi, `ip_hash` hız sınırı, beyaz liste) yerel `lead-store` kopyasına karşı donduruyor — depoyu değil sözleşmeyi ölçüyor.
- Env kapısı sitenin canlı anahtarlarından bilerek izole: `LEAD_CONTRACT_URL` yoksa atlanır, tanımlıyken yerel olmayan host'a karşı istek atmadan hata verir.
- Kayıt-okuyan kriterler için geçici superuser + PocketBase REST auth deseni kuruldu, yeni bağımlılık eklenmedi.

**Öğrenilenler:**
- Docker Compose değişken önceliği (gerçek shell/OS env > `.env` dosyası) `.env`-değiştir-sonra-yeniden-yarat akışlarını sessizce bozabilir — `_dev/memory/yerel-lead-deposu-docker-profili.md` Tuzak 6'ya yazıldı.
- JS/TS blok yorumu içinde `*/` alt-dizisi (örn. `notify_*/mesaj` gibi bir kısaltma) yorumu erken kapatıp parse hatası üretebilir.
- PocketBase v0.39.9 REST auth başlığı `Authorization: <token>` (Bearer önekisiz) ilk denemede beklendiği gibi çalıştı.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — alıcı kurulumu yerine hazır deponun sözleşme paketi)
