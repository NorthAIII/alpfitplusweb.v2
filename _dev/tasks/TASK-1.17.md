# TASK-1.17: Yerel lead deposu — v1'in PocketBase'i salt okunur bağlı compose profili

**Durum:** ⬜ Bekliyor
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

- [ ] **1. Compose profilini ekle**
  - Profil `lead`, servis önerisi `lead-store`. Varsayılan `up`'ta **kalkmaz**
  - İmaj: `build.context` → `../Alpfitplus-website.v1/pocketbase`, `PB_VERSION` v1'in pinlediği değer (`0.39.9`). `latest` yok
  - Bağlamalar: `pb_hooks` ve `pb_migrations` v1'den `:ro`; veri dizini isimli, atılabilir bir hacim (öneri `lead_store_data`). v1'in `alpfit_pb_data` adı **kullanılmaz**
  - `serve` bayrakları v1 Dockerfile'ıyla aynı. `:ro` migration dizini açılışı engellerse `--automigrate=false` eklenir, gerekçe Oturum Kaydı'na
  - Port host'a yayınlanmaz, erişim compose ağı içinden (`http://lead-store:8090`). Panel gerekirse yalnız `127.0.0.1`'e ve 3000/3001/3100/3200 dışı bir porta
  - Token'lar env'den: `LEAD_TOKEN_PREVIEW`, `LEAD_TOKEN_PRODUCTION` (hook'un beklediği adlar). Yalnız yerel, rastgele değerler; canlı değer **asla** kullanılmaz
  - Dosya: `docker-compose.yml`

- [ ] **2. Env anahtar adlarını belgele**
  - `.env.example`'a yerel depo bloğu: iki token adı, açıklama "yalnız yerel, canlı değer değil, `openssl rand -hex 32` ile üretilir". Değer yazılmaz
  - Dosya: `.env.example`

- [ ] **3. Ayağa kaldır ve dokunarak doğrula**
  - Sağlık ucu, koleksiyonların varlığı (kimliksiz `GET /api/collections/leads/records` → `403`, olmayan koleksiyon → `404`), token'lı ve token'sız birer `POST /lead`
  - `web` konteynerinden aynı istek (compose ağı). TASK-1.13 ve TASK-1.14 buna dayanır
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
- **Hook değişikliği kendiliğinden yeniden başlatır** (`--hooksWatch` varsayılan açık; v1 README → Tuzaklar 9). Bağlama `:ro` olduğu için yerelde tetiklenmez. v1'de hook değişirse konteyner yeniden başlatılır; not memory kaydına.
- **Superuser yok, gerekmez.** Kimliksiz ilk açılış log'a installer bağlantısı basar (v1 README → Adım 7); bu beklenen davranıştır. Kayıt sayımı gerekirse (TASK-1.13) yöntem orada seçilir.
- Resmî PocketBase imajı yok; Dockerfile binary'yi GitHub release'inden çeker. İlk derleme ağ ister.
- Umami'nin yerel kopyası **kurulmaz** (analitik `data-tag=local` ile ayrılıyor, TASK-1.07).

---

## Test Kriterleri

- [ ] `docker compose --profile lead up -d lead-store` → konteyner sağlıklı; `web` içinden `wget -qO- http://lead-store:8090/api/health` → `{"code":200,…}`
- [ ] Koleksiyonlar migration'la doğdu: kimliksiz `GET /api/collections/leads/records` ve `…/leads_preview/records` → `403`, `…/olmayan/records` → `404`
- [ ] Yerel önizleme token'ıyla `POST /lead` (geçerli gövde, sahte `ip_hash`, `example.com`) → `201 {"id":…,"prior_count":0}`; token'sız → `401 {"error":"unauthorized"}`
- [ ] **Ürettiğim kapıyı sınadım — boş kapsam:** token env'leri tanımsızken kalkan depoda doğru olması gereken token'lı istek bile `401`. Kapı boş slotu açık saymıyor
- [ ] Varsayılan `docker compose up -d web` `lead-store`'u **başlatmıyor**; `.env` yokken de hatasız koşuyor; geliştirme sunucusu 3000'de 200
- [ ] Depo adıyla indirildikten sonra (`docker compose rm -sf lead-store`) `web` ayakta, `node_modules` / `next_cache` hacimleri yerinde (`docker volume ls`)
- [ ] v1 reposu değişmedi: `git -C ../Alpfitplus-website.v1 status --porcelain -- pocketbase/` boş, toplam satır sayısı oturum başıyla aynı
- [ ] `docker-compose.yml` ve `.env.example`'da token değeri yok (`grep` ile)

---

## Risk ve Geri Dönüş Planı

- **`:ro` migration dizini `serve`'ü düşürürse** → `--automigrate=false` (migration'lar yine uygulanır, yalnız panel değişikliği dosyaya yazılmaz). O da olmazsa dur ve sor; v1'in klasörü yazılabilir bağlanmaz.
- **Rollback:** `docker compose rm -sf lead-store`, `docker volume rm <proje>_lead_store_data`; iki dosya dosya bazlı geri alınır.

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

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — n8n + Postgres yerine v1'in PocketBase deposu)
