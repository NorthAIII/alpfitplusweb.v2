# TASK-1.13: Depo sözleşme paketi — adaptörün dayandığı davranış yerel depoya karşı kalıcı testte

**Durum:** ⬜ Bekliyor
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

- [ ] **1. Paketin koşma kapısını yaz**
  - Env adları sitenin canlı anahtarlarından **ayrı** (öneri `LEAD_CONTRACT_URL`, `LEAD_CONTRACT_TOKEN_PREVIEW`, `LEAD_CONTRACT_TOKEN_PRODUCTION`). Gerekçe: yanlışlıkla canlı `LEAD_STORE_*` değerleriyle koşulamasın
  - URL tanımsızsa `describe.skip` + görünür rapor satırı, çıkış 0
  - Host yerel servis değilse (`lead-store`, `localhost`, `127.0.0.1`) paket **koşmaz**, açık hata verir
  - Dosya: `tests/lead-store.contract.test.ts` (YENİ)

- [ ] **2. Senaryoları yaz** (test kriterleriyle birebir)
  - Her senaryo kendi rastgele `ip_hash`'ini taşır. Hız sınırı senaryosu ayrı bir `ip_hash`'te altı istekle ölçülür
  - Gövdeler gerçek kişi verisi taşımaz (`example.com`, `Test Kulüp`)
  - Kayıt sayımı ve koleksiyon teyidi için yöntem seçilir: yerel geçici superuser (`pocketbase superuser upsert`, rastgele parola yalnız o komutta) ya da `PATCH /lead/{id}`'nin koleksiyon kapsamı. Karar ve gerekçe Oturum Kaydı'na. Yeni bağımlılık eklenmez
  - Dosya: `tests/lead-store.contract.test.ts` (YENİ)

- [ ] **3. Koşum komutunu belgele**
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

- [ ] Paket yerel depoya karşı (`docker compose --profile lead up -d lead-store` + env) `npm test` içinde yeşil:
  - Önizleme token'ı + geçerli gövde → `201`, gövde `id` (15 karakter) ve `prior_count: 0` taşıyor; kayıt `leads_preview`'da, `env=preview`, `notify_team`/`notify_lead` `pending`
  - Üretim token'ı → kayıt `leads`'te, `env=production`; önizleme koleksiyonunda değil (token koleksiyonu seçiyor)
  - Gövdede `env: "production"` gönderen önizleme isteği yine `leads_preview`'a düşüyor (gövdedeki env yok sayılıyor)
  - Token'sız ve yanlış token → `401 {"error":"unauthorized"}`, kayıt sayısı değişmedi
  - `name`, `club` ya da `ip_hash` eksik → `400 {"error":"invalid-payload"}`, kayıt yok
  - Aynı `ip_hash` ile altı istek → `[201,201,201,201,201,429]`, o `ip_hash` için tam 5 kayıt
  - Aynı e-postayla ikinci istek → `prior_count: 1`
  - 5000'i aşan `message` → `201` ve kayıtta 5000 karakter (kırpıldı, reddedilmedi)
  - `PATCH /lead/{id}` `{"notify_team":"sent"}` → `200 {"ok":true}`; önizleme token'ıyla üretim kaydına `PATCH` → `404`
- [ ] Env tanımsızken `docker compose exec web npm test` sözleşme paketini atladığını raporluyor, diğer 43 test yeşil, çıkış 0
- [ ] `LEAD_CONTRACT_URL=https://lead.alpfitplus.com` verildiğinde paket **istek atmadan** hata veriyor (canlı koruma kapısı)
- [ ] **Ürettiğim kapıyı sınadım — bozuk girdi:** depo önizleme token'ı boş bırakılarak yeniden kaldırıldığında `201` senaryoları kırmızı; token geri gelince yeşil. Kontrol grubu `401` senaryosu iki koşuda da yeşil (kapı her şeye kırmızı basmıyor)
- [ ] `npx eslint tests/lead-store.contract.test.ts` temiz; `docker compose exec web npm run build` hatasız (test dosyası tip denetiminden geçti)

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

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — alıcı kurulumu yerine hazır deponun sözleşme paketi)
