# TASK-1.17: Yerel lead deposu — v1'in PocketBase'i salt okunur bağlı compose profili

**Durum:** ✅ Tamamlandı
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · hizmet ettiği yüzey M3
**Feature:** F3.2 provası — yerel ortam (M7 F7.1 Docker ortamının genişlemesi; feature matrisi değişmez)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.11 ✅ (hedef: v1'in lead deposu)

---

## Hedef

Canlıdaki lead deposunun (PocketBase, `lead.alpfitplus.com`) birebir yerel kopyasını compose profili olarak kurmak. Kopya v1'in kendi kodundan kalkar: imaj v1'in `pocketbase/Dockerfile`'ından derlenir, `pb_hooks` ve `pb_migrations` v1 reposundan **salt okunur** bağlanır. Koleksiyonları (`leads`, `leads_preview`) migration'lar kendisi kurar, tohum gerekmez.

Task şu koşullar sağlandığında tamamlanmış sayılır:

- Profil tek komutla ayağa kalkıyor ve sağlıklı.
- Yerel token'la `POST /lead` → `201`, token'sız → `401`.
- `web` konteyneri depoya compose ağı üzerinden ulaşıyor.
- Varsayılan `web` servisi etkilenmiyor ve v1 reposu değişmiyor.

---

## Bağlam

2026-09-14'te hedef Bunker'dan v1'in lead deposuna döndü (`docs/DECISIONS.md` 2026-09-14 "Lead hedefi (yeniden, 2)"). O kayıt 2026-09-13'ün n8n + Postgres yerel prova ortamını geçersiz kıldı. Sözleşme testinin nerede koşacağını plan revizyonuna bıraktı. Kullanıcı yerel kopyayı seçti (`docs/DECISIONS.md` 2026-09-14 "Depo sözleşmesinin sınanması").

Gerekçe: sitenin yeni kayıt adaptörü (TASK-1.14) belgeden kopyalanmış sahte yanıtlara değil, depo **kodunun kendisine** karşı sınanır. Canlı `leads_preview`'a test kaydı yığılmaz ve canlı deponun IP başına saatte 5 sınırına takılınmaz. Aynı ortam alan adı geçişinde ve v1'in hook'ları değiştiğinde yeniden kullanılır.

Bu task ortamı kurar. Sözleşme paketi TASK-1.13'tür, sitenin bağlantısı TASK-1.14'tür.

**Yerel kopya neyi kanıtlamaz:** canlı nginx, TLS, `trustedProxy` ayarı, yerleşik hız sınırı ayarları (`PATCH /api/settings` ile canlıda uygulanmış, migration'da yok) ve canlı token'ların hangi koleksiyona eşlendiği. Canlı teyit TASK-1.18'dedir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `../Alpfitplus-website.v1/pocketbase/README.md` → Özet, Koleksiyon şeması, Uç nokta sözleşmesi, Tuzaklar (**salt okunur**, dokunulmaz repo)
- `../Alpfitplus-website.v1/pocketbase/Dockerfile` ve `docker-compose.yml` — imaj sürümü (`0.39.9`), `serve` bayrakları, token env adları
- `docker-compose.yml` — mevcut servisler ve profil deseni (`prod`, `research`)
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` → Lead deposu, Sırlar

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/memory/` — yerel depo profilinin kaldırma/indirme komutları ve tuzakları (yeni kayıt + MEMORY.md index'i)
- `CLAUDE.md` → Projeye Özgü Kurallar → "Çalışma ortamı — Docker" bloğuna profil komutu. Kök doktrin dosyasıdır, değişiklik kullanıcıya bildirilir

---

## Alt Görevler

- [x] **1. Compose profilini ekle**
  - Profil `lead`, servis önerisi `lead-store`. Varsayılan `up`'ta **kalkmaz**
  - İmaj: `build.context` → `../Alpfitplus-website.v1/pocketbase`, `PB_VERSION` v1'in pinlediği değer (`0.39.9`). `latest` yok
  - Bağlamalar: `pb_hooks` ve `pb_migrations` v1'den `:ro`; veri dizini isimli, atılabilir bir hacim (öneri `lead_store_data`). v1'in `alpfit_pb_data` adı **kullanılmaz**
  - `serve` bayrakları v1 Dockerfile'ıyla aynı. `:ro` migration dizini açılışı engellerse `--automigrate=false` eklenir, gerekçe Oturum Kaydı'na
  - Port host'a yayınlanmaz, erişim compose ağı içinden (`http://lead-store:8090`). Panel gerekirse yalnız `127.0.0.1`'e ve 3000/3001/3100/3200 dışı bir porta
  - Token'lar env'den: `LEAD_TOKEN_PREVIEW`, `LEAD_TOKEN_PRODUCTION` (hook'un beklediği adlar). Yalnız yerel, rastgele değerler; canlı değer **asla** kullanılmaz
  - Dosya: `docker-compose.yml`

- [x] **2. Env anahtar adlarını belgele**
  - `.env.example`'a yerel depo bloğu: iki token adı, açıklama "yalnız yerel, canlı değer değil, `openssl rand -hex 32` ile üretilir". Değer yazılmaz
  - Dosya: `.env.example`

- [x] **3. Ayağa kaldır ve dokunarak doğrula**
  - Sağlık ucu, koleksiyonların varlığı (kimliksiz `GET /api/collections/leads/records` → `403`, olmayan koleksiyon → `404`), token'lı ve token'sız birer `POST /lead`
  - `web` konteynerinden aynı istek (compose ağı). TASK-1.13 ve TASK-1.14 buna dayanır. `web` imajında (`node:24-bookworm-slim`) `wget` ve `curl` **yok** (verify-plan ölçümü 2026-09-14); istek `node -e "fetch(…)"` ile atılır
  - Depoyu kaldırma, durdurma ve silme komutları memory kaydına yazılır

---

## Etkilenen Dosyalar

```
./
├── docker-compose.yml    # lead profili: lead-store servisi + lead_store_data hacmi — zaten var
└── .env.example          # yerel depo token adları — zaten var
```

> `../Alpfitplus-website.v1/pocketbase/` yalnız okunur: derleme bağlamı ve `:ro` bağlama. O repoda hiçbir dosya değişmez.

---

## Dikkat Noktaları

- **v1 dokunulmaz** (CLAUDE.md → Dokunulmazlar). Derleme bağlamı dosya yazmaz, bağlamalar `:ro`. v1'de `git status --porcelain` oturum başında ve sonunda sayılır. Bugün başka bir oturumun 24 yabancı satırı var, `pocketbase/` temiz (TASK-1.11 ölçümü). `pocketbase/` altında fark çıkmamalı.
- **Compose interpolasyonu tüm dosyayı okur:** v1'in `${LEAD_TOKEN_PREVIEW:?…}` deseni burada **kullanılmaz**. Yoksa `.env`'i olmayan biri `docker compose up -d web` bile koşamaz. Boş token'la kalkan depo zaten kapalıdır: `resolveTarget` boş slotu eşleştirmez, her istek `401` alır (`lead_lib.js:99-108`). Bu fail-closed davranış ölçülerek yazılır.
- **`down` kullanılmaz:** `docker compose down` profil verilse de projenin **tüm** servislerini (`web` dâhil) kaldırır. `-v` ise `node_modules` ve `next_cache` hacimlerini de siler. Depo servis adıyla indirilir (`docker compose rm -sf lead-store`), hacmi adıyla silinir (`docker volume rm <proje>_lead_store_data`).
- **Token değişikliği `restart` ile gelmez** (v1 README → Tuzaklar 11): `.env`'deki token değişince depo `docker compose --profile lead up -d lead-store` ile yeniden yaratılır. TASK-1.13'ün "token boş bırakılarak yeniden kaldırma" sınaması bu komutla yapılır.
- **Hook değişikliği kendiliğinden yeniden başlatır** (`--hooksWatch` varsayılan açık; v1 README → Tuzaklar 9). Bağlama `:ro` olduğu için yerelde tetiklenmez. v1'de hook değişirse konteyner yeniden başlatılır; not memory kaydına.
- **Superuser yok, gerekmez.** Kimliksiz ilk açılış log'a installer bağlantısı basar (v1 README → Adım 7); bu beklenen davranıştır. Kayıt sayımı gerekirse (TASK-1.13) yöntem orada seçilir.
- Resmî PocketBase imajı yok; Dockerfile binary'yi GitHub release'inden çeker. İlk derleme ağ ister.
- Umami'nin yerel kopyası **kurulmaz** (analitik `data-tag=local` ile ayrılıyor, TASK-1.07).

---

## Test Kriterleri

- [x] `docker compose --profile lead up -d lead-store` → konteyner sağlıklı; `web` içinden `node -e "fetch('http://lead-store:8090/api/health').then(r=>r.text()).then(console.log)"` → `{"code":200,…}`
- [x] Koleksiyonlar migration'la doğdu: kimliksiz `GET /api/collections/leads/records` ve `…/leads_preview/records` → `403`, `…/olmayan/records` → `404`
- [x] Yerel önizleme token'ıyla `POST /lead` (geçerli gövde, sahte `ip_hash`, her koşuda benzersiz `…@example.com` ve telefonsuz — `prior_count` koleksiyon genelinde aynı e-posta/telefonu saydığı için hacim biriktikçe sabit adres `0` vermez) → `201 {"id":…,"prior_count":0}`; token'sız → `401 {"error":"unauthorized"}`
- [x] **Ürettiğim kapıyı sınadım — boş kapsam:** token env'leri tanımsızken kalkan depoda doğru olması gereken token'lı istek bile `401`. Kapı boş slotu açık saymıyor
- [x] Varsayılan `docker compose up -d web` `lead-store`'u **başlatmıyor**; `.env` yokken de hatasız koşuyor; geliştirme sunucusu 3000'de 200
- [x] Depo adıyla indirildikten sonra (`docker compose rm -sf lead-store`) `web` ayakta, `node_modules` / `next_cache` hacimleri yerinde (`docker volume ls`)
- [x] v1 reposu değişmedi: `git -C ../Alpfitplus-website.v1 status --porcelain -- pocketbase/` boş, toplam satır sayısı oturum başıyla aynı
- [x] `docker-compose.yml` ve `.env.example`'da token değeri yok (`grep` ile)

---

## Risk ve Geri Dönüş Planı

- **`:ro` migration dizini `serve`'ü düşürürse** → `--automigrate=false` (migration'lar yine uygulanır, yalnız panel değişikliği dosyaya yazılmaz). O da olmazsa dur ve sor; v1'in klasörü yazılabilir bağlanmaz.
- **Rollback:** `docker compose rm -sf lead-store`, `docker volume rm <proje>_lead_store_data`; iki dosya dosya bazlı geri alınır.

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
- `docker-compose.yml`'e `lead-store` servisi eklendi (profil `lead`, varsayılan `up`'ta kalkmaz). İmaj `../Alpfitplus-website.v1/pocketbase` bağlamından derlenir (`PB_VERSION=0.39.9`, `latest` yok); `pb_hooks` ve `pb_migrations` v1'den `:ro` bağlanır; veri `lead_store_data` adlı isimli hacimde (`alpfit_pb_data` değil). Port host'a yayınlanmadı — erişim yalnız compose ağı üzerinden (`http://lead-store:8090`).
- Token'lar `${LEAD_TOKEN_PREVIEW:-}` / `${LEAD_TOKEN_PRODUCTION:-}` ile bilerek `:?` değil `:-` (boş varsayılan) kalıbında: v1'in `${…:?}` deseni `.env`'i olmayan birinin `docker compose up -d web`'ini bile durdururdu. Healthcheck v1'inkiyle aynı (`wget` → `/api/health`).
- `.env.example`'a yerel depo token bloku eklendi (yalnız anahtar adı + `openssl rand -hex 32` talimatı, değer yok).
- `_dev/memory/yerel-lead-deposu-docker-profili.md` yeni kayıt: kaldırma/indirme/token-yenileme komutları + üç tuzak (token `restart` ile gelmez, `:ro` migrasyon dizini otomigrasyonu engellemedi, `down`/`-v` kullanılmaz). `_dev/MEMORY.md` index'ine "Ortam & Araç Notları" altında pointer eklendi.
- Kök `CLAUDE.md` → Projeye Özgü Kurallar → "Çalışma ortamı — Docker" bloğuna `lead` profili komutu eklendi (kullanıcıya bu oturum kaydıyla bildiriliyor — doktrin dosyası).

**Sorunlar:**
- Yok — `:ro` bağlı `pb_migrations` ile `serve` ilk denemede sağlıklı açıldı, `--automigrate=false` gerekmedi (Risk planındaki birinci ihtimal gerçekleşmedi).

**Kararlar:**
- `.env` dosyası bu makinede yerel test için oluşturuldu (iki adet `openssl rand -hex 32` değeri, `chmod 600`) — `.gitignore`'da `.env*` zaten kapsıyor, repoya girmedi. Değer hiçbir kayda yazılmadı, yalnız uzunluk (`64`) doğrulandı. Gerekçe: TASK-1.13/1.14 aynı depoya karşı çalışacak, sıfırdan kurulum tekrarı gerektirmesin.
- docs/DECISIONS.md'ye eklendi: Hayır (task icrası kapsamında bir mimari/iş kuralı kararı değil, plan zaten donmuş sözleşmeyi uyguluyor)

**Kalan İşler:** Yok — task tam kapandı.

**Son Yaklaşım:** N/A — pause olmadı, task tek oturumda uçtan uca bitti.

**Sonraki Adım Detayı:** N/A — sıradaki task TASK-1.13 (depo sözleşme paketi), kendi task dokümanından başlar.

**Dosya Değişiklikleri:**
- `docker-compose.yml` → `lead-store` servisi + `lead_store_data` hacmi eklendi
- `.env.example` → yerel depo token bloku eklendi (§3, mevcut bölümler kaydırıldı)
- `CLAUDE.md` → "Çalışma ortamı — Docker" bloğuna `lead` profili komut satırı eklendi
- `_dev/memory/yerel-lead-deposu-docker-profili.md` → YENİ
- `_dev/MEMORY.md` → Ortam & Araç Notları'na pointer eklendi

**Test Sonuçları:**
- `docker compose --profile lead up -d --build lead-store` → build 10.5 sn (binary GitHub release'ten çekildi), konteyner `healthy` (healthcheck 3 deneme içinde geçti).
- `web` konteynerinden `node -e "fetch(...)"` ile `/api/health` → `{"message":"API is healthy.","code":200,"data":{}}`.
- Koleksiyon varlığı: kimliksiz `GET .../leads/records` → `403`, `.../leads_preview/records` → `403`, `.../olmayan_koleksiyon/records` → `404` — migration'lar `:ro` dizinden sorunsuz uygulandı.
- Boş kapsam kapısı: `.env` yokken (token env'leri tanımsız) hem header'sız hem rastgele tahmin edilmiş token'lı `POST /lead` → ikisi de `401 {"error":"unauthorized"}` — boş slot açık sayılmadı.
- `.env` oluşturulup (`chmod 600`, iki 64-karakter hex token) `docker compose --profile lead up -d lead-store` ile yeniden yaratıldıktan sonra: geçerli önizleme token'ıyla benzersiz e-posta + `ip_hash` → `201 {"id":"fewrvuck7xgd311","prior_count":0}`; yanlış token → `401 {"error":"unauthorized"}` (token değişikliğinin `up -d` ile geldiği, `restart`'a gerek kalmadığı da bu adımda doğrulandı).
- `docker compose config --services` → yalnız `web` (varsayılan `up`'ta `lead-store` yok); bare `docker compose up -d` sonrası `docker compose ps` → `lead-store` dokunulmamış durumda kaldı. `curl localhost:3000` → `200`.
- `docker compose rm -sf lead-store` → `web` kesintisiz `Up 40 hours`; `docker volume ls` → `alpfitplus-web_node_modules`, `alpfitplus-web_next_cache`, `alpfitplus-web_lead_store_data` üçü de yerinde.
- v1 kontrolü: `git -C ../Alpfitplus-website.v1 status --porcelain | wc -l` oturum başı ve sonu **24** (değişmedi); `-- pocketbase/` boş (temiz).
- Sızıntı taraması: `grep -nE "LEAD_TOKEN_(PREVIEW|PRODUCTION)\s*[:=]\s*['\"a-fA-F0-9]{16,}" docker-compose.yml .env.example` → eşleşme yok.
- `docker compose config --profile lead` ile tam servis şeması derlendi (imaj bağlamı, `:ro` bağlamalar, hacim adı `alpfitplus-web_lead_store_data`) — söz dizimi/yol hatası yok.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — n8n + Postgres yerine v1'in PocketBase deposu)
