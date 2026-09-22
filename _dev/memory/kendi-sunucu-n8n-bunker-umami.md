# Kendi sunucu: lead deposu, n8n, Bunker ve Umami

Talep kaydı ve analitik kullanıcının kendi Hetzner sunucusunda (`178.104.140.36`, Almanya) duruyor (`docs/DECISIONS.md` 2026-09-13 Umami, 2026-09-14 lead hedefi).
Sunucunun kendisi bu projenin değil — ayrıntı, erişim ve değişiklik kuralları `../altyapi/vps/CLAUDE.md`'de
(salt okunur kaynak). Sunucuya dokunan her iş oradaki "pazarlıksız kurallar"a uyar: önce yedek, önce test, sonra ölç.

## Adresler (dışarıdan ölçüldü)

| Adres | Ne | Ölçüm |
|---|---|---|
| `lead.alpfitplus.com` | **Demo talebinin deposu** (v1'in PocketBase'i; v2 de buraya yazar) | `/api/health` → 200 (2026-09-14) |
| `n8n.kiwiailab.com` | İş akışları | `/healthz` → 200 (2026-09-13) |
| `ops.kiwiailab.com` | Bunker satış paneli (çok kiracılı) | — |
| `alpfit.kiwiailab.com` | Bunker'ın `alpfit` kiracısının panel adresi | — |
| `umami.kiwiailab.com` | Kendi Umami (v1'in analitiği) | `/api/heartbeat` → 200 (2026-09-13) |

## Lead deposu — PocketBase

- Kod, şema, hook ve sözleşmenin tek evi `../Alpfitplus-website.v1/pocketbase/` (**salt okunur**, bu projenin dokunulmazı) → `README.md` → "Uç nokta sözleşmesi". Sunucuda ayrı compose projesi `alpfit-lead` (`/opt/alpfit-lead/`), Bunker DB'sinden bağımsız SQLite.
- Sözleşme özü: `POST /lead` + `X-Lead-Token` başlığı; **token koleksiyonu seçer** (`leads` production · `leads_preview` preview); `ip_hash` zorunlu; başarı `201 {id, prior_count}` — `ok:true` **yok**; IP başına saatte 5 → `429`.
- Koleksiyon kuralları beşi de `null` (yalnız superuser) → Bunker ve n8n bu depoyu okumuyor (2026-09-14: kodda ve n8n yedeğinde referans 0). Yedek günlük 03:00 / 7 kopya; saklama 12 ay (cron).
- v2 env adları v1'le aynı ve **Vercel'de kurulu** (TASK-1.18, 2026-09-14; `alpfitplus-web-v2`, Production + Preview):
  - `LEAD_STORE_URL` (Config).
  - `LEAD_STORE_TOKEN` (Secret) — **önizleme token'ı**. Vercel'den geri okunamaz; okunabilir kaynağı sunucuda `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PREVIEW` ve parola yöneticisi.
  - `IP_HASH_SALT` (Secret) — v2'ye özel rastgele; hiçbir yerde saklanmadı.
  - `RESEND_API_KEY` (Secret, TASK-1.06 2026-09-21) — v2'ye özel Resend **sending_access** anahtarı (`alpfitplus-web-v2`, `alpfitplus.com`'a bağlı), oturum tarafından API ile üretildi; üreten yönetim anahtarı [anahtar kasasında](anahtar-kasasi-config-alpfit.md).
  - v2'nin `main`'i Vercel production env'inde ama aşaması `preview`, bu yüzden alan adı geçişine kadar önizleme token'ı kalır. Geçişte (M7 F7.5) Production'a üretim token'ı ve v1'in tuzu girer.

## Umami — sürüm ve kimlik biçimi (ölçüldü 2026-09-21)

- **Sürüm 3.1.0**, `data-tag` destekli (yükte `tag` alanı, şemada `website_event.tag`).
- **API anahtarı YOK.** `x-umami-api-key` Umami **Cloud** özelliğidir; self-hosted 3.1.0'ın `src/lib/auth.ts` → `checkAuth` fonksiyonu yalnız `Authorization: Bearer <token>` ve paylaşım token'ını (`x-umami-share-token`) tanır. Canlı teyit: `GET /api/me` + sahte api-key başlığı → **401**.
- **Tek kimlik yolu:** `POST /api/auth/login` gövde `{username, password}` → `{token}`; sonra `Authorization: Bearer <token>`. Canlı sunucu boş gövdeye 400 + iki alanın "expected string" hatasıyla cevap veriyor, yani şema bu.
- **Site kaydı açma:** `POST /api/websites`, gövde `{name, domain}` (ops. `id`, `teamId`, `shareId`); yanıt website nesnesi, içindeki `id` = Website ID (sır değil, sayfa kaynağında görünür). Kayıt açmadan önce `GET /api/websites` ile mevcutlar listelenir — **v1'in `alpfitplus.com` kaydına dokunulmaz** ve takım (`teamId`) yerleşimi oradan görülür.
- ⚠️ **Parola sıfırlama yolu YOK (ölçüldü 2026-09-22).** `package.json:40` `change-password: node scripts/change-password.js` diyor ama **betik yok** — ne v3.1.0 kaynak ağacında (`scripts/` 13 dosya, aralarında değil) ne de çalışan konteynerde (`test -f` → yok). Tek parola-değiştirme ucu `POST /api/me/password` ve **`currentPassword` istiyor** (yani parolayı bilmeyen kullanamaz); `users/[userId]/password` rotası yok. Konteynerde `bcryptjs` de yok (`MODULE_NOT_FOUND`, `node_modules`'te iz yok — standalone derlemeye gömülü), yani hash'i konteyner içinde üretmek de mümkün değil. Geriye yalnız **veritabanına doğrudan yazma** kalıyor ve o ayrı bir kullanıcı kararıdır. Parolayı kaybetme = panele giriş kaybı; kasadaki değeri güncel tut.
- Girişte **hız sınırı ve kilitlenme yok** (`api/auth/login/route.ts`: düz `checkPassword`, sayaç yok) — başarısız deneme hesabı kilitlemez, ama panel de kaba kuvvete açıktır.
- Umami DB yedeği günlük: `/opt/bunker/backups/umami-YYYYMMDD-*.dump` (02:30 UTC, seri kesintisiz — 2026-09-22 dahil).
- **v2'nin site kaydı açıldı** (TASK-1.07, 2026-09-22): ad `Alpfit Plus v2 (önizleme)`, alan adı `alpfitplus-web-v2.vercel.app`, kimlik `640b05f1-41aa-4ba0-985b-f30145e49983` (sır değil — sayfa kaynağında görünür), `teamId` **null** (kurulumdaki diğer iki kayıtla aynı yerleşim; hesabın takımı yok). Kurulumda artık 3 kayıt var; v1'in `alpfitplus.com` ve `kiwiailab.com` kayıtları kayıt açılırken **bayt bayt değişmedi** (önce/sonra `GET /api/websites` diff'i boş).
- **Bunker "Web Trafik" paneli yeni kayıttan etkilenmez** (koddan ölçüldü, panele girilmedi): `bunker-dashboard/src/app/web-traffic/page.tsx` Umami'nin **paylaşım (share) URL'lerini** `UMAMI_SITES` env'inden okuyup iframe'liyor — API'den site **saymıyor**, sekme listesi env'de sabit. Yani yeni kayıt ne görünür ne bozar. v2'yi oraya eklemek istenirse: Umami'de kayda share URL üret + Bunker'ın `UMAMI_SITES` env'ine bir satır (kod değişmez) — Bunker OS tarafının işi.
- Tracker `data-exclude-search="true"` özniteliğini okuyor (sunulan `script.js` gövdesinde geçiyor) — v2 bunu **zorunlu** kullanır, gerekçe `BULGULAR.md` B-056.

### Panel yerine okuma API'si — "panelde görünüyor mu" sorusunun ölçülebilir hâli (verify-phase, 2026-09-22)

Kullanıcı panele bakamadığı için "olay panelde görünüyor mu" sorusu uzun süre UAT'a devredilen bir kalem oldu. Umami'nin kendi **okuma API'si panelin render ettiği veriyi aynen döndürür**, yani soru kullanıcı gözü olmadan da cevaplanır. Giriş yolu yukarıdaki `login` → Bearer; hepsi `GET`, hiçbiri yazmaz:

| Uç | Ne verir |
|---|---|
| `/api/websites` | kayıtlar (id, ad, alan adı) |
| `/api/websites/{id}/stats?startAt=&endAt=` | sayfa görüntülemesi, ziyaretçi, ziyaret |
| `/api/websites/{id}/metrics?type=event\|tag\|path\|browser` | olay adı, ortam etiketi, sayfa yolu kırılımı |
| `/api/websites/{id}/event-data/fields` | **özellik kırılımı** — `surface=hero` gibi yüzey etiketleri sayılarıyla |
| `/api/websites/{id}/events?pageSize=` | ham kayıtlar: `hostname`, `urlPath`, **`urlQuery`**, `referrerQuery`, `eventName` |
| yukarıdakilere `&tag=preview` | ortama göre süzme (`local` / `preview` ayrımı burada görülür) |

- `startAt`/`endAt` **milisaniye** epoch ister; aralık verilmezse `400 bad-request` döner.
- `type=url` geçersizdir, doğru değer **`type=path`**.
- `event-data/fields` yüzey teyidinin en doğrudan kanıtıdır; `events` çıktısındaki `urlQuery` boşluğu `data-exclude-search`'ün çalıştığını gösterir (B-056).
- `tag` metriği **ziyaret** düzeyinde sayar, olay düzeyinde değil — "üç olay `preview` etiketiyle sayıldı" iddiası için `metrics?type=event&tag=preview` kullan, çıplak `type=tag` sayısını yorumlama.
- Geriye kalan tek kullanıcı-gözü kalemi panel **arayüzünün** görülmesidir; verinin varlığı bu uçlarla kapanır.

### "Sorgu dizesi analitiğe gitmiyor" iddiası kayıt yazmadan ters çevrilir (verify-phase, 2026-09-22)

`data-exclude-search` çalışıyor mu sorusu yeşil bir yükü görmekle kapanmaz — probe o katmanı hiç görmüyor da olabilir.
Kayıt yazmadan kurulan ters-çevirme:

1. `ctx.route('**://umami.kiwiailab.com/api/send**')` ile yükü **yakala ve `abort` et** — hiçbir olay Umami'ye düşmez.
2. Aynı sayfayı ikinci kez, bu kez HTML'i `route` ile yakalayıp `data-exclude-search\":\"true\"` → `false` çevirerek sun.
3. Yük karşılaştır: yayındaki hâlde `url=…/demo`, ters çevrilmiş hâlde `url=…/demo?name=…&phone=…&email=…`.

Öznitelik ilk HTML'de RSC flight payload'ında **kaçışlı** durur (yukarıdaki not), o yüzden `replace` kalıbı da kaçışlı
yazılır. Aynı desen `window.umami`'yi `addInitScript` ile sahte bir `track` sayacına bağlayıp "olay gönderilmiyor"
iddialarının kontrol grubunu kurmak için de kullanılır.

### Tracker etiketi HTML'de düz öznitelik olarak aranmaz

`next/script` + `strategy="afterInteractive"` betiği ilk HTML'e `<script data-tag="preview">` olarak **yazmaz**; öznitelikler RSC flight payload'ında kaçışlı durur. Yayın yüzeyinde ölçerken `grep -o 'data-tag[^,}]*'` gibi bir kalıp kullan (`data-tag\":\"preview\"` döner); `data-tag="..."` araması sessizce boş döner ve "tracker yok" yanılgısı üretir.

## Bunker — tuzak

- Kanonik kod `../Bunker OS/bunker-dashboard` (`NorthAIII/bunker-os` monoreposu). `../bunker-dashboard` klonu bayat ve GitHub'da arşivli.
- **`leads` ve `staged_leads` soğuk e-posta otomasyonunu besler** (dizi, otomatik onay, sınıflandırma; `alpfit` canlı kampanyanın kiracısı). Demo talebi bu tablolara yazılmaz; "ayrı `source` değeri" izolasyon sağlamaz (kodla çürüdü). Kanıt: `tasks/archive/TASK-1.11-BUNKER-KESFI.md`.

## Canlıya dokunmadan ölçüm

Canlı Bunker DB/n8n okumak sandbox dışı SSH ister. Onun yerine masaüstündeki sunucu dışı yedek kullanılır: `~/vps-yedekler/bunker-YYYYMMDD-*.dump` (günlük, 90 gün). Dosya ağsız, tek kullanımlık `postgres:15-alpine` konteynerine `:ro` bağlanır; `pg_restore -l` / `--data-only --table=…` ile sayım yapılır. Satır verisi basılmaz, n8n iş akışları `workflow_entity` tablosundadır.

**Lead deposunda kayıt teyidi — panel yerine salt-okunur DB okuması.** Kullanıcı panele bakamıyor (2026-09-14) ve superuser kimliği projede yok. TASK-1.18'de koşulan yol:
- **Araç:** `ssh root@178.104.140.36 'python3 -B -'` ve betik stdin'den. Hostta `sqlite3` CLI yok; stdlib sqlite var.
- **Dosya:** DB `/var/lib/docker/volumes/alpfit_pb_data/_data/data.db`, WAL modunda. Bağlantı boşta kapanınca `-wal`/`-shm` dosyaları silinir.
- **Açma yöntemi yan dosyalara bakılarak SEÇİLİR** — tek bir doğru mod yok, betik önce `-wal`/`-shm` var mı diye bakar:
  - **`-wal` YOKKA:** `file:…?mode=ro&immutable=1`. Burada `mode=ro`'yu tek başına kullanma — yan dosyalar yokken SQLite onları **yaratır**, bu sunucuda yazmadır.
  - **`-wal` VARKEN:** `immutable=1` WAL'ı **görmez** ve son yazıları "yok" diye okur (TASK-1.06'da ölçüldü: yeni kayıt sonrası sayım eski değerde kaldı, iki ayrı denemede). Doğru mod `file:…?mode=ro` (immutable'sız) — yan dosyalar zaten var olduğu için yaratma riski yok; bu, PocketBase'in kendi okuyucularıyla aynı eşzamanlı-okuyucu yoludur.
- **Her iki modda `PRAGMA query_only=ON` + önce/sonra `stat`.** TASK-1.06 ölçümü: `data.db` ve `-wal` **bayt bayt değişmedi**, yalnız `-shm` mtime'ı ilerledi — okuma-kilidi izi, veri yazımı değil. Betiğe kapı koy: yan dosyalar beklenen hâlde değilse çık, kör deneme yapma.
- **Yeni yazıdan hemen sonra okuyacaksan** WAL'ın checkpoint'lenmesini bekleme — PocketBase bağlantısını açık tutar, `-wal` dakikalarca durur.
- **PII:** gerçek talepler için yalnız `count(*)`; alanlar yalnız test kaydı için basılır.
- **Sınır:** DB'yi kopyalamak ya da superuser açmak yazmadır ve kullanıcı kararı gerektirir.

## Sırlar

Sunucudaki kimlik bilgileri `/opt/bunker/.env`, `/opt/alpfit-lead/` ve benzeri yerlerde durur. Değer ekrana basılmaz, repoya
ve dokümana yazılmaz; yalnız anahtar adı ve konumu yazılır.
