# B-058: `.env` üretim Docker imajına gömülüyor — sırlar imaj katmanında, yerel prova sessizce gerçek hedefe bağlı

**Önem:** 🔴 | **Tip:** güvenlik / hata | **Alan:** M7 — Yayın ve altyapı (`.dockerignore`, `Dockerfile`, `docker-compose.yml`)
**Kaynak:** audit-product | **Tarih:** 2026-09-22
**Durum:** → Faz 2

## Gözlem

**Beklenen:** `CLAUDE.md` → Dokunulmazlar: *"`.env*` — Sırlar. Repoda yalnız `.env.example` (anahtar adları, değer yok)."* `ILKELER.md` → *"Secret'lar ve ortama bağlı değerler koda gömülmez."* `QUALITY.md` → 2 Güvenlik: *"Sırlar … yalnız env'de mi; istemci paketine sızmıyor mu?"* Bir sır, dağıtılabilir bir artefaktın (Docker imajı) katmanına girmemelidir.

**Gözlenen:** `.dockerignore:6` yalnız **`.env*.local`** yazıyor. Bu kalıp `.env`'i **eşlemiyor**. `Dockerfile:27` `COPY . .` ile builder'a alıyor, Next standalone çıktısı taşıyor, `Dockerfile:35` runner katmanına kopyalıyor. Sonuç: üretim imajı `/app/.env`'i `0600` izinle taşıyor ve içinde `LEAD_TOKEN_PREVIEW`, `LEAD_TOKEN_PRODUCTION`, `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` **değerleriyle** duruyor.

İki ayrı zarar doğuyor:

**(1) Sır taşınabilir hâle geliyor.** `docker save`, `docker history` ya da bir registry push'u bu beş değeri imajla birlikte taşır. Proje env-parite kararı gereği bu anahtarlar canlı depoyla **aynı ad ve aynı roldedir**; `LEAD_TOKEN_PRODUCTION` ve `IP_HASH_SALT` bugün üretim değerleriyse sızıntı doğrudan canlıyı ilgilendirir. Hafifletici: bugün CI yok, registry yok, imaj bu makineden çıkmıyor (ölçüldü) — yani risk **potansiyel**, gerçekleşmiş değil.

**(2) Yerel üretim provası (3100) sessizce bir hedefe bağlı.** `docker-compose.yml`'de `web-prod` için `environment`/`env_file` **yok**; buna rağmen konteyner imajdan gelen `.env`'i okuyor:
```
POST http://localhost:3100/api/demo  →  {"ok":true,"stored":true}
```
Bugün `LEAD_STORE_URL` yerel `lead-store`'u gösteriyor, yani zarar yok. Ama bu bir **tesadüf**: `.env`'in hedefi bir gün canlıya çevrilirse (canlı turu, hata ayıklama, `.env.production` kopyası) yerel prova kapsamında atılan her istek **canlı lead deposuna yazar** — ve bunu söyleyen hiçbir işaret yok. Denetim ve ölçüm turları 3100'ü rutin olarak hedef alıyor (`perf.mjs:7`, `font-guard.mjs:13`).

## Kanıt

```
$ sed -n '6p' .dockerignore
.env*.local                                   ← `.env` bu kalıpla EŞLEŞMEZ

$ docker run --rm --entrypoint sh alpfitplus-web-web-prod -c 'ls -la /app/.env'
-rw------- 1 nodejs 369 Sep 22 12:30 /app/.env

$ docker compose exec -T web-prod sh -c 'grep -oE "^[A-Z_]+=" /app/.env'
LEAD_TOKEN_PREVIEW=  LEAD_TOKEN_PRODUCTION=  LEAD_STORE_URL=  LEAD_STORE_TOKEN=  IP_HASH_SALT=

$ curl -s -X POST http://localhost:3100/api/demo -H 'content-type: application/json' \
    -H 'x-forwarded-for: 10.98.1.1' --data '{"name":"Zemin","club":"Kontrol","phone":"0532 111 22 33","consent":true}'
{"ok":true,"stored":true,"mailed":false}       ← compose'da env verilmemesine rağmen hedef bağlı

$ grep -n "env_file\|environment" docker-compose.yml     → web-prod bloğunda yok
```
Aynı mekanizma dev tarafında da çalışıyor ve bir **ölçüm tuzağı** üretiyor: `docker compose exec web printenv LEAD_STORE_URL` **boş** döner (yeni kabuk, Next süreci değil) ama uç `stored:true` verir — Next `.env`'i bind-mount'lu `/app`'ten kendi dotenv'iyle okur. Bu turda zemin tam olarak bu yüzden yanlış kuruldu; kalıcı not `_dev/memory/alternatif-env-ile-uretim-derlemesi.md`'ye düştü.

## Kök Neden Yönü

`.dockerignore` Next'in kendi şablonundan gelmiş (`.env*.local` Next'in `create-next-app` varsayılanıdır) ve projenin kendi sır politikasına göre **gözden geçirilmemiş**. `web-prod`'un env'i hiç konuşulmadığı için imajdan gelen dosya sessiz varsayılan olmuş.

## Koruma Önerisi

- `.dockerignore`'a `.env` ve `.env.*` eklenir, `!.env.example` istisnasıyla. Tek satırlık değişiklik.
- `web-prod`'a **bilinçli** `environment:`/`env_file:` verilir — yerel prova neye bağlandığını açıkça söylesin; hedef yoksa uç dürüst 503 versin.
- Kalıcı kapı, derleme sonrası tek komut: `docker run --rm --entrypoint sh <imaj> -c 'ls /app/.env'` **boş** dönmeli. F6.2 tek komutuna girer.
- Ayrıca gözden geçirilir: `.env` bu makinede üretim değerlerini mi taşıyor? Taşıyorsa imaj bir kez bile dışarı çıktıysa anahtarlar döndürülmelidir (karar kullanıcıda).

## Çözüm Kaydı

—
