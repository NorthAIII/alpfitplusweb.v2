# TASK-2.02: `.env` üretim imajından çıkar, yerel prova hedefini açıkça söyler (B-058)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.1: Docker çalışma ortamı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok (TASK-2.01'den bağımsız — bu ayak **koşulsuz** yapılır)

---

## Hedef

Üretim Docker imajının katmanında duran `.env` dosyasını çıkarmak ve `web-prod` konteynerinin neye bağlandığını **bilinçli** hâle getirmek. Bugün `.dockerignore:6` yalnız `.env*.local` yazıyor; bu kalıp `.env`'i eşlemiyor, `Dockerfile:27` `COPY . .` ile builder'a alıyor ve `:35` runner katmanına taşıyor.

Task, üretim imajında `/app/.env` **bulunmadığında** ve `docker-compose.yml`'de `web-prod`'un env'i açıkça yazıldığında (hedef yoksa uç dürüst `503` verdiğinde) tamamlanmış sayılır.

---

## Bağlam

Bulgu iki ayrı zarar ölçtü (`_dev/bulgular/archive/B-058-env-uretim-imajina-gomulu.md`):

1. **Sır taşınabilir hâle geliyor** — `docker save` / `docker history` / registry push beş değeri imajla birlikte taşır. Bugün CI yok, registry yok, imaj bu makineden çıkmadı; risk **potansiyel**.
2. **Yerel üretim provası (3100) sessizce bir hedefe bağlı** — compose'da `web-prod` için `environment`/`env_file` olmamasına rağmen konteyner imajdan gelen `.env`'i okuyor ve `POST /api/demo` `{"ok":true,"stored":true}` dönüyor. Bugün hedef yerel `lead-store`; ama `.env`'in hedefi bir gün canlıya çevrilirse **her prova isteği canlı depoya yazar** ve bunu söyleyen hiçbir işaret yok. Ölçüm turları 3100'ü rutin hedef alıyor (`perf.mjs`, `font-guard.mjs`).

**Anahtar döndürme ayağı düştü ve B-058'in kalan tek işi bu task oldu** (plan revizyonu, 2026-09-23). TASK-2.01 sunucudaki `/opt/alpfit-lead/.env` ile yereldeki değerleri parmak iziyle karşılaştırdı: **eşleşme yok** — imaja giren hiçbir değer canlı bir sır değil, dolayısıyla döndürme gerekmiyor ve TASK-2.03 ❌ iptal edildi (`tasks/archive/TASK-2.03.md`). Buradaki iki düzeltme zaten koşulsuzdu; artık **atomu da bu task kapatıyor**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/archive/B-058-env-uretim-imajina-gomulu.md` — kanıt ve koruma önerisi
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — **ölçüm tuzağı**: `docker compose exec … printenv` çalışan uygulamanın env'ini göstermez; hedefi tek `{}` POST'unun `503 no-sink` verip vermediğiyle ölç
- `_dev/memory/yerel-lead-deposu-docker-profili.md` — `lead-store` profili, `down` yasağı
- `Dockerfile`, `.dockerignore`, `docker-compose.yml`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.1 Edge Case'ler — `web-prod`'un env'i artık bilinçli (tek satır)
- `_dev/BULGULAR.md` + `_dev/bulgular/archive/B-058-*.md` — **atom bu task'ta kapanır**. Kapanış kaydı üç şeyi birlikte yazar: iki düzeltme yapıldı · döndürme ayağı ölçümle düştü (TASK-2.01, eşleşme yok) · kalıcı kapı (her derlemeden sonra `ls /app/.env`) **M6 F6.2 tek komutuna devredildi**, bu fazda kurulmadı

---

## Alt Görevler

- [x] **1. `.dockerignore`'u projenin sır politikasına göre düzelt**
  - `.env` ve `.env.*` eklenir, `!.env.example` istisnasıyla (örnek dosya repoda kalmalı ve imaja girmesi zararsızdır — değer taşımıyor)
  - Mevcut `.env*.local` satırı yeni kalıpların altında gereksizleşir; tekrarı bırakma
  - Dosya: `.dockerignore`

- [x] **2. `web-prod`'a bilinçli env ver**
  - `docker-compose.yml` → `web-prod` bloğuna açık `environment:` (ya da `env_file:`) eklenir; **ne verildiği yorumla gerekçelenir**
  - Varsayılan tutum: yerel prova **yerel** `lead-store`'u hedefler ya da hiç hedef almaz. Hedef verilmezse uç `503 no-sink` döner — bu **doğru** davranıştır (F3.1 kabul kriteri) ve provanın sessizce bir yere yazmasından üstündür
  - Dosya: `docker-compose.yml`

- [x] **3. İmajı yeniden derle ve ölç**
  - `docker compose --profile prod up -d --build web-prod`
  - `docker run --rm --entrypoint sh <imaj> -c 'ls -la /app/.env'` → **bulunamadı** dönmeli
  - 3100 ayakta ve sağlıklı; hedef davranışı `{}` POST'uyla ölçülür (yukarıdaki memory tuzağı)

---

## Etkilenen Dosyalar

```
.dockerignore                  # .env ve .env.* + !.env.example — zaten var
docker-compose.yml             # web-prod'a bilinçli environment/env_file — zaten var
_dev/modules/M7-Yayin-ve-Altyapi.md   # F7.1 edge case tek satır — zaten var
```

---

## Dikkat Noktaları

- **`.env` dosyasının kendisine dokunma** — `CLAUDE.md` → Dokunulmazlar. Bu task dosyanın **imaja girmesini** engeller, içeriğini değiştirmez.
- **`printenv` yanıltır.** `docker compose exec web-prod printenv LEAD_STORE_URL` boş dönse de uç `stored:true` verebilir — Next `.env`'i `/app`'ten kendi dotenv'iyle okur. Ölçümü **uç davranışıyla** yap (`memory/alternatif-env-ile-uretim-derlemesi.md`).
- **3100 bayat olabilir.** Aynı memory notu: `perf.mjs`/`font-guard.mjs` oraya bakar; bu task zaten yeniden derliyor, ama ölçmeden güvenme.
- **`lead-store` profili ayrı kalkar** (`--profile lead`) ve host portu yayınlamaz; `web-prod`'a hedef verilecekse adres compose ağı içinden (`http://lead-store:8090`) yazılır.
- **Kalıcı kapı bu fazda kurulmuyor.** Atomun koruma önerisindeki *"derleme sonrası tek komut"* kapısı M6 F6.2'nin (tek komut) işidir; burada aynı komut **bir kerelik** ölçüm olarak koşar ve sonucu dokümana yazılır. Kapanış kaydı bu devri açıkça söyler, yoksa atom kapanırken kapı sessizce kaybolur.
- **Dev tarafı (`web`, 3000) bu task'ın konusu değil** — bind-mount üzerinden `.env`'i okuması beklenen davranıştır.

---

## Test Kriterleri

- [x] `docker run --rm --entrypoint sh <üretim imajı> -c 'ls -la /app/.env'` → dosya **yok** (çıkış kodu sıfır-olmayan ya da "No such file")
- [x] Aynı imajda `.env.example` varlığı sorun değil; başka hiçbir `.env*` dosyası yok (`ls -la /app/.env*` çıktısı dokümana yazılır)
- [x] `docker compose --profile prod up -d --build web-prod` sonrası 3100 ayakta; ana sayfa 200 dönüyor
- [x] `POST http://localhost:3100/api/demo` ile hedef davranışı ölçüldü ve **compose'da yazana eşit**: hedef verildiyse `stored:true`, verilmediyse `503 no-sink` (rakamıyla dokümana yazılır)
- [x] `docker compose exec web npm test` yeşil (taban: 6 dosya, Faz 1 kapanışındaki sayı); `npm run build` hatasız
- [x] `git status` çıktısında `.env` yok — dosya hâlâ izlenmiyor

---

## Risk ve Geri Dönüş Planı

- **`web-prod` env'siz kalırsa ölçüm betikleri kırılabilir:** `perf.mjs` ve `font-guard.mjs` yalnız sayfa render'ına bakıyor, lead hedefine değil — beklenen etki yok; yine de ikisi bu task'ta koşulup teyit edilir.
- **Rollback:** iki satırlık değişiklik, dosya bazlı geri alma yeterli; imaj yeniden derlenir.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **`.dockerignore` projenin sır politikasına çekildi.** `.env*.local` (create-next-app varsayılanı) çıkarıldı, yerine `.env` + `.env.*` + `!.env.example` kondu; neden gerektiği dört satırlık yorumla yazıldı. Eski kalıbın kapsadığı her şeyi (`.env.local`, `.env.production.local`) yeni iki kalıp zaten eşliyor — tekrar bırakılmadı.
- **`web-prod`'a bilinçli env verildi.** Üç anahtar açıkça **boş** tanımlandı: `LEAD_STORE_URL`, `LEAD_FILE_PATH`, `RESEND_API_KEY`. Üçü `/api/demo`'daki üç kayıt yolunun (`toStore` / `toFile` / `toEmail`) **başıdır** ve boşken o yol hiç denenmez (fail-closed), dolayısıyla üçü birlikte "hedefsiz prova"yı tam olarak ifade eder. Blok 20 satırlık yorumla gerekçelendirildi; gerçek depoya karşı prova gerekirse izlenecek yol (`--profile lead` + `http://lead-store:8090`) yorumda yazılı, canlı adres yazılmaması kuralıyla.
- **İmaj yeniden derlendi ve `/app/.env`'in gittiği ölçüldü** (aşağıda, kontrol gruplu).
- Blok başlığındaki **yanlış port düzeltildi**: yorum `http://localhost:3001` diyordu, gerçek eşleme `3100:3000`. 3001 bu makinede başka bir projede ve `CLAUDE.md` onu açıkça yasaklıyor — düzeltilen blok zaten yeniden yazılıyordu.

**Sorunlar:**
- **Boş env'in gerçekten koruma olup olmadığı belirsizdi.** `LEAD_STORE_URL: ""` yazmak, `.env` bir gün imaja geri sızarsa işe yarar mı, yoksa dotenv onu ezer mi? Ölçüldü (kod okuması, `@next/env` → `processEnv`): yükleyici bir anahtarı **yalnız `process.env`'de hiç tanımlı değilse** doldurur (`typeof p[t]==="undefined"` kapısı) — boş string **tanımlıdır**, yani ezilmez. Boş değerler dekoratif değil, gerçek bir ikinci katman. Bulgu hem compose yorumuna hem memory atomuna yazıldı.
- **Ölçümün "önce" ayağı kayıt yazmadan kuruldu.** Eski konteynerde geçerli gövdeli POST ile `stored:true` üretmek yerel depoya bir satır daha yazardı (kalıcı yan etki). Onun yerine "önce" kanıtı eski **imajın** `/app/.env`'i olarak alındı; uçtaki eski davranışın `{"ok":true,"stored":true}` olduğu ölçümü B-058 atomundan **devralındı**, bu oturumda yeniden üretilmedi.

**Kararlar:**
- **Yerel prova hedefsiz bırakıldı** (task'ın sunduğu iki meşru seçenekten ikincisi). Gerekçe: ölçüm turları (`perf.mjs`, `font-guard.mjs`) 3100'ü rutin hedef alıyor; hedefli bir prova her ölçüm turunda depoya satır yazardı. Hedefsizken uç `503 no-sink` veriyor — bu M3 F3.1'in kabul kriteri, yani doğru davranış, arıza değil. Gerçek depo provası gerektiğinde nasıl açılacağı yorumda yazılı.
- **Üç anahtar yazıldı, yedi değil.** `LEAD_STORE_TOKEN`/`IP_HASH_SALT`/`DEMO_TO`/`DEMO_FROM` de boşaltılabilirdi ama gereksiz: her yolun başı tek başına fail-closed, ve ikinci katman da baş anahtar üzerinden çalışıyor. Az satır, aynı garanti.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü maliyetli bir sözleşme doğmadı (iki satırlık yapılandırma, dosya bazlı geri alınır); atomun kapanış kaydı ve compose yorumu gerekçeyi taşıyor.

**Kalan İşler:**
- Yok. **Kalıcı kapı bilinçli olarak devredildi:** her derlemeden sonra `ls /app/.env` kontrolü M6 F6.2'nin tek komutuna girecek; bu oturumda aynı komut **bir kerelik ölçüm** olarak koşuldu. Devir atomun kapanış kaydında adıyla yazılı.

**Dosya Değişiklikleri:**
- `.dockerignore` → `.env*.local` çıktı; `.env`, `.env.*`, `!.env.example` girdi + gerekçe yorumu
- `docker-compose.yml` → `web-prod` bloğuna boş üç anahtarlı `environment:` + 20 satır gerekçe yorumu; blok başlığındaki port `3001` → `3100`

**Test Sonuçları:**
<!-- Ölçüm kimliğiyle: ne çalıştı, hangi kapsamda. -->
- **İmaj katmanı — kontrol gruplu.** *Önce* (değişiklikten önce, aynı komut): `docker run --rm --entrypoint sh alpfitplus-web-web-prod -c 'ls -la /app/.env*'` → `-rw------- 1 nextjs nodejs 369 Sep 22 12:30 /app/.env`, çıkış 0. *Sonra* (yeniden derlenmiş imaj): aynı komut → `No such file or directory`, çıkış 2. Kontrol grubu şunu kanıtlıyor: komut dosyayı **görebiliyordu**, yani "yok" sahte yeşil değil. Ek tarama: imaj genelinde `find / -name ".env"` (node_modules hariç) **hiçbir şey** döndürmedi. `/app` kökünde yalnız `.next`, `node_modules`, `package.json`, `public`, `server.js` var — başka `.env*` yok.
- **Konteyner env'i — anahtar bazında.** `printenv` çıkış kodu ile: `LEAD_STORE_URL`, `LEAD_FILE_PATH`, `RESEND_API_KEY` → çıkış 0 (**tanımlı ve boş**, compose'dan); `LEAD_STORE_TOKEN`, `IP_HASH_SALT` → çıkış 1 (**hiç yok**, çünkü artık `.env` yok). Yani compose'da yazan ile konteynerde duran birebir aynı.
- **Uç davranışı — iki ayaklı, hiçbir yere yazmadan.** (a) *Kontrol grubu:* `{}` gövdeli POST → **HTTP 422** `{"code":"missing"}` — istek yolu ve doğrulama sağlam, yani aşağıdaki 503 çökmeden değil. (b) *Asıl ölçüm:* geçerli gövdeli POST (ayrı `X-Forwarded-For`, hız sınırı senaryo başına sayıyor) → **HTTP 503** `{"code":"no-sink"}` — compose'da yazan "hedef yok" ile birebir eşleşiyor. 503 kendi kendini kanıtlıyor: koda göre oraya yalnız depo **ve** dosya **ve** e-posta üçü birden düşünce gelinir, yani bu ölçüm hiçbir yere kayıt yazmadı. Konteyner logu gerekçeyi doğruluyor: `[demo] Depo yapılandırması eksik, kayıt denenmedi.`
- **Sayfa:** `GET http://localhost:3100/` → **HTTP 200**, 345 531 B.
- **`npm test`** (`docker compose exec web npm test`, Vitest): **6 dosya / 66 geçti + 1 atlandı** — taban birebir (atlanan, env kapısı kapalı olan depo sözleşme paketi). Bu değişiklik saf fonksiyon testleriyle kapsanmıyor; kapsayan ölçüm yukarıdaki uç davranışıdır.
- **`npm run build`:** imajın kendi builder katmanında hatasız koştu. Bilinçli olarak `docker compose exec web npm run build` tercih **edilmedi** — o komut dev sunucusuyla paylaşılan `next_cache` hacminin üstüne yazıyor (`memory/alternatif-env-ile-uretim-derlemesi.md`) ve `web` bu oturumun servisi değil; builder katmanı aynı derlemeyi yalıtılmış yapıyor.
- **Regresyon kapıları (3100'e karşı).** `font-guard.mjs`: 153 karakterlik küme, 16 sayfa, 80 487 karakter tarandı → **kümede olmayan karakter yok**. `perf.mjs` iki kez koşuldu (ilk koşum taze konteynerde soğuk — mobil `/segmentler/pilates-reformer` LCP 296 ms'ti, ısınınca 44 ms; memory'deki soğuk-koşum uyarısı aynen doğrulandı). Isınmış koşum M6 başlangıç çizgisiyle karşılaştırıldı: ana sayfa ağırlığı **masaüstü 144 KB · mobil 133 KB** → çizginin **birebir aynısı**; ana sayfa LCP **80 ms** (masaüstü) / 68 ms (mobil) → çizgi 96 ms, altında. Regresyon yok.
- **`git status`:** `.env` çıktıda yok — dosya hâlâ izlenmiyor.
- **Kapsanmayan:** kalıcı derleme-sonrası kapı kurulmadı (bilinçli devir → M6 F6.2). `a11y.mjs` / `mobile-audit.mjs` / `scan.mjs` koşulmadı — bu task hiçbir işaretlemeye, stile ya da metne dokunmuyor; koşulan iki betik zaten üretim imajını hedefleyenler.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

Üretim Docker imajı artık `.env` taşımıyor ve yerel üretim provası neye bağlandığını **yazılı** söylüyor — ikisi de ölçüldü, B-058 kapandı.

- **İmaj temiz:** yeniden derlenen imajda `/app/.env` yok (önce 369 B vardı — kontrol gruplu ölçüm), imaj genelinde hiçbir `.env` izi yok.
- **Prova bilinçli ve hedefsiz:** `web-prod` üç kayıt yolunun baş anahtarını açıkça boş alıyor; uç geçerli talebe `503 no-sink` veriyor (M3 F3.1'in doğru davranışı), yani ölçüm turları artık hiçbir depoya satır yazamıyor.
- **İkinci katman ölçülerek kondu:** boş env değeri Next'in dotenv yükleyicisi tarafından ezilmiyor (`@next/env` yalnız hiç tanımlı olmayanı doldurur) — `.env` bir gün imaja geri sızsa bile prova hedefsiz kalır.
- **Regresyon yok:** `npm test` 6 dosya / 66 geçti + 1 atlandı (taban birebir), `font-guard` temiz, `perf` ağırlıkları başlangıç çizgisiyle aynı, ana sayfa 200.
- **Bilinçli devir:** derleme-sonrası kalıcı `ls /app/.env` kapısı bu fazda kurulmadı, M6 F6.2'nin tek komutuna geçti.

---

**Oluşturulma:** 2026-09-22
