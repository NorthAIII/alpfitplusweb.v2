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

**Tarih:** 2026-09-23 (TASK-2.02) — atomun iki zararı da kapandı, üçüncü ayak (anahtar döndürme) ölçümle düştü.

**(1) Sır imaj katmanından çıktı.** `.dockerignore`'daki `.env*.local` satırı — Next'in `create-next-app` varsayılanı, `.env`'i eşlemiyordu — yerini `.env` + `.env.*` + `!.env.example` üçlüsüne bıraktı, kalıbın neden değiştiği dosyada yorumla duruyor. Ölçüm **kontrol gruplu**: aynı komut değişiklikten önce `-rw------- 1 nextjs nodejs 369 Sep 22 12:30 /app/.env` (çıkış 0), yeniden derlenen imajda `No such file or directory` (çıkış 2). Yani "yok" sahte yeşil değil — komut dosyayı görebiliyordu. Ek olarak imaj genelinde `find / -name ".env"` (node_modules hariç) hiçbir şey döndürmedi; `/app` kökünde yalnız `.next`, `node_modules`, `package.json`, `public`, `server.js` var.

**(2) Yerel prova (3100) artık neye bağlandığını söylüyor — ve hiçbir şeye bağlı değil.** `web-prod` bloğuna açık `environment:` girdi ve üç anahtar **boş** tanımlandı: `LEAD_STORE_URL`, `LEAD_FILE_PATH`, `RESEND_API_KEY`. Üçü `/api/demo`'daki üç kayıt yolunun (`toStore` / `toFile` / `toEmail`) başıdır ve boşken o yol hiç denenmez (fail-closed), dolayısıyla hedefsizliği tam olarak ifade ederler. Ölçüm iki ayaklı ve **hiçbir yere kayıt yazmadan** yapıldı:
- *Kontrol grubu:* `{}` gövdeli POST → **422** `{"code":"missing"}` — istek yolu ve doğrulama sağlam, yani aşağıdaki 503 bir çökmenin sonucu değil.
- *Asıl ölçüm:* geçerli gövdeli POST → **503** `{"code":"no-sink"}`. Bu yanıt kendi kendini kanıtlar: koda göre oraya yalnız depo **ve** dosya **ve** e-posta üçü birden düşünce gelinir. Konteyner logu gerekçeyi yazıyor: `[demo] Depo yapılandırması eksik, kayıt denenmedi.`
- `printenv` çıkış koduyla doğrulandı: üç anahtar **tanımlı ve boş** (compose'dan), `LEAD_STORE_TOKEN` ve `IP_HASH_SALT` **hiç yok** (çünkü artık `.env` yok) — compose'da yazan ile konteynerde duran birebir aynı.

**Boş değer dekoratif değil, ölçülmüş ikinci katman.** Next'in dotenv yükleyicisi bir anahtarı yalnız `process.env`'de **hiç tanımlı değilse** doldurur (`@next/env` → `processEnv`, `typeof p[t]==="undefined"` kapısı; kod okunarak ölçüldü). Boş string tanımlıdır, yani ezilmez — `.env` bir gün imaja geri sızsa bile bu üç anahtar boş kalır ve prova hedefsiz kalmaya devam eder. Kalıcı not: `_dev/memory/alternatif-env-ile-uretim-derlemesi.md`.

**(3) Anahtar döndürme ayağı ölçümle düştü.** Atomun *"`.env` üretim değeri taşıyor mu?"* sorusu TASK-2.01'de sunucudaki `/opt/alpfit-lead/.env` ile parmak izi karşılaştırmasıyla cevaplandı: **eşleşme yok** — imaja giren hiçbir değer canlı bir sır değil. Döndürme gerekmedi, TASK-2.03 iptal edildi (`tasks/archive/TASK-2.03.md`).

**Kalıcı kapı kurulmadı — bilinçli devir.** Koruma önerisindeki *"derleme sonrası tek komut: `ls /app/.env` boş dönmeli"* kapısı bu fazda **kurulmadı**; M6 F6.2'nin tek komutuna girecek. Bu turda aynı komut yalnız **bir kerelik ölçüm** olarak koşuldu. Yani bugün imajı temiz tutan şey bir kapı değil, `.dockerignore`'un kendisidir; regresyonu yakalayacak otomatik kontrol F6.2 ile gelir.

**Regresyon kapsamı:** `npm test` 6 dosya / 66 geçti + 1 atlandı (taban birebir; bu değişikliği saf fonksiyon testleri kapsamıyor, kapsayan ölçüm yukarıdaki uç davranışıdır). `npm run build` imajın builder katmanında hatasız. `font-guard.mjs` temiz (153 karakter / 16 sayfa / 80 487 karakter). `perf.mjs` ısınmış koşumda ana sayfa masaüstü 144 KB · mobil 133 KB — M6 başlangıç çizgisiyle birebir aynı; LCP 80 ms (çizgi 96 ms). Ana sayfa 200.

Detay: `tasks/archive/TASK-2.02.md` → Oturum Kaydı.
