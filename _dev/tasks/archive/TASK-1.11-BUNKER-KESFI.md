# TASK-1.11 — Bunker Keşfi

← TASK-1.11.md · keşif-detayı (2026-09-13 oturumunun 0-6. maddeleri, kullanıcıya sunulan sorular ve öneri)

> Bu dosya parent'ın 2026-09-13 Oturum Kaydı'ndan bölündü (2026-09-14, parent tek okumaya sığsın diye). Burada anlatılan Bunker yolu **seçilmedi**: 2026-09-14'te hedef v1'in lead deposu oldu (parent → Oturum — 2026-09-14; `docs/DECISIONS.md` 2026-09-14). Kayıt tarihsel kanıt olarak durur; Bunker'a ileride yazılmak istenirse zemin budur. Alt görev 3'ün dosya:satır tabloları kardeş dosyada: `TASK-1.11-ENVANTER.md`.

**0. Kaynak ve ölçüm zemini**

- **Bunker kodu artık `../bunker-dashboard` değil.** O klon bayat: HEAD `a3ae17a`, 2026-08-30. Kod 2026-09-12'de `../Bunker OS/bunker-dashboard/` altına birleşti (`NorthAIII/bunker-os` monoreposu, Bunker TASK-24.02) ve orada ilerledi; iki kopya arasında 39 dosya farkı var, `outreach-sequence.ts` dahil. Envanter kanonik kopyadan çıkarıldı (Bunker OS HEAD `99cf3ee`). Prod'da koşan commit ölçülmedi (sunucu erişimi gerekir). `../bunker-dashboard` yolu canlı dokümanlarda altı yerde geçiyor: DECISIONS, memory `kendi-sunucu-…`, PHASE-1, TASK-1.11/1.13/1.17/1.18.
- **Canlı veritabanına bağlanılmadı.** Onun yerine sunucu dışı yedek kullanıldı: `~/vps-yedekler/bunker-20260912-023004.dump` (2026-09-12 02:30 UTC, PG 15.17, sha256 `83cf0c3baabc5286…`). Ağsız, tek kullanımlık `postgres:15-alpine` konteynerine (`--network none`) geri yüklendi: 945 TOC girdisi, 0 hata, 116 base tablo. Desen kullanıcının aylık geri yükleme testi (`../altyapi/vps/scripts/yedek-test-et.sh`). Yalnız şema, sayım ve iş akışı meta verisi okundu; satır verisi basılmadı. Konteyner silindi, iş akışı JSON'unu taşıyan geçici dosyalar `shred` edildi.

**1. Giriş yolu adayları**

| | (a) n8n iş akışı | (b) Bunker'da ayrı uç |
|---|---|---|
| Biçim | `POST n8n.kiwiailab.com/webhook/<yol>` → Code guard (başlık token) → parametreli INSERT → Respond `{ok:true}` | `POST <tenant-host>/api/public/<ad>` → route token doğrular → `pg` INSERT … RETURNING → JSON |
| DB yazma kimliği | Var: n8n aynı `bunker` DB'sinde yaşıyor; kasada 2 `postgres` credential ("Postgres account", "Postgres account 2") — dökümden ölçüldü | Var: dashboard `DATABASE_URL` |
| Kalıcılık | Tek otoriter kopya prod n8n DB'si; repo JSON'u prod'un aynası değil, ~20 iş akışı yalnız prod'da (`Bunker OS/docs/bunker-os-operasyon-referansi.md`). Deploy: scp → import → **publish** → activate → restart (Bunker memory `n8n-prod-deploy`). DDL yine bir yerde versiyonlanmalı | Route + migration + smoke tek repoda, versiyonlu; CI `typecheck` · `guards:check` · `npm test` |
| Bakım | Token `$env` ister → `/opt/bunker/.env` + compose whitelist (main **ve** worker) + recreate + nginx reload (Bunker memory `dashboard-env-iki-kaynak`, `n8n-lokal-bootstrap`). Mevcut iş akışlarında string birleştirmeli SQL yaygın. n8n'in varsayılan hata gövdesi `{ok,code}` taşımaz; her hata dalına Respond node gerekir | Token yalnız `.env.production` + recreate (compose'a dokunulmaz). Bunker OS ayrı bir DevFlow projesi ve Faz 24 açık (11/13; prod deploy kaynağı monorepoya geçiyor) — iş oranın sırasına girer |
| Arıza görünürlüğü | `error-sweeper` → Slack. Yutulan node hatası `status='error'` üretmez | `app_errors` tablosu var. Her yol smoke'la sınanabilir |
| Emsal | `lead-intake-agent` (aktif, `/webhook/lead-intake`): guard `x-internal-token` = `BUNKER_INTERNAL_TOKEN`. **Yeniden kullanılamaz:** INSERT'te `tenant_id` yok (canlıda NOT NULL), `ON CONFLICT (email)` canlıda karşılıksız (yalnız `(tenant_id,email)` kısmi tekil var), ve Outreach Agent'a (GHL+Instantly) zincirli | `/api/reverb/demo-request` (public, yalnız mail atıyor, DB'ye yazmıyor) ve `/api/public/frida-image` (imzalı token) — `middleware.ts:25-57` PUBLIC_PREFIXES "bu derinlikte listelenir" kuralı |

`BUNKER_INTERNAL_TOKEN` iki yol için de aday değil. Tüm `/api/internal/*` uçlarını (Alfred araçları dahil) açan ana anahtar; Vercel'e verilmemeli. Her iki yolda da yeni, yalnız bu alıcıya ait bir token gerekir.

**2. Kayıt biçimi**

- **"Ayrı `source` değeri yeterli" varsayımı kodla çürüdü.** Dashboard'da `leads.source`'a bakan tek bir seçim koşulu yok (yalnız yazılıyor: `staged_leads.ts:342`, `chats/[sessionId]/convert/route.ts:61`; gösteriliyor: `feed.ts:45`). Canlı n8n'deki Researcher, Email Writer ve Enrichment sorguları da bakmıyor. `/leads` listesi `source`'u seçmiyor bile (`leads/page.tsx:112-113`).
- **Canlı `leads` şeması** (dökümden): 37 kolon. `tenant_id` NOT NULL. `source varchar(100)` CHECK'siz. `status` varsayılanı `'new'`, `sequence_status` `'pending'`, `sequence_step` 0. Tekil `idx_leads_tenant_email_unique (tenant_id, email) WHERE email dolu`; global e-posta tekili yok. Tek trigger `update_leads_updated_at` (BEFORE UPDATE). Arşiv kolonu yok, arşiv `pipeline_stage='archived'`.
- **`alpfit` bugün canlı soğuk kampanyanın kiracısı** (döküm): 184 lead (183'ü `target_segment='alpfit_pending_tr'`). `hermes_settings`: `paused=false`, `daily_cap=5`, `active_segments={alpfit_pending_tr}`. `outreach_sequence`: step1 sent 9 · step2 `awaiting_review` 7 / cancelled 2 · step3 pending 7 / cancelled 2. `hermes_emails` 10 (son 2026-08-18). `staged_leads` bekleyen 96 (google-maps). `lead_pull_settings.auto_enabled=false`. Talep eden kulüp bu soğuk listede zaten olabilir: aynı e-posta `leads`'e ikinci kez yazılamaz.
- **Seçeneklerin kanıtı** (artı/eksi ve öneri ↓ Kullanıcıya Sorular, Soru 1):
  - **A — `leads`:** yakalayan yollar `outreach/batch.ts:118-136` (e-postalı satır batch kuyruğunda), next-5 (`outreach/next.ts:26-78`), `sequence_status='active'` olursa canlı Researcher→Writer (tenant filtresiz), website dolu + e-posta boşsa Enrichment. Raporlar ↓ 3, (b) maddesi.
  - **B — `staged_leads`:** otomatik onay yok (`staged_leads.ts:286-300` yalnız operatör/Alfred çağırıyor). Onay varsayılanı `enroll_in_hermes=true` (`api/leads/staged/approve/route.ts:42`, `staged_leads.ts:305,319`). `gdpr-delete` leads satırı yoksa erken döner (`:51-53`).
  - **C — ayrı tablo:** okuyucu sayısı 0 (dashboard `src`+`migrations` 0, `bunker-v2` 0, canlı n8n 47 iş akışında 0, aynı adda canlı tablo yok). Panel görünürlüğü için emsal `chats/[sessionId]/convert`. KVKK uçları ↓ 3, (c) maddesi.
- **Alan eşlemesi (C):** `type Lead`'in 11 alanı birebir kolon olur: `at→requested_at` · `env` (CHECK local/preview/production) · `name` · `club` · `branches` · `phone` · `email` · `segment` · `message` · `consent` · `ua→user_agent`. Artı `id`, `tenant_id` (FK tenants), `received_at`, isteğe bağlı `matched_lead_id` (aynı kiracıda aynı e-postalı soğuk lead varsa operatör görsün). Eşleşmeyen alan yok.
- **Alan eşlemesi (A seçilirse):** `name→contact_name`/`first_name` · `club→company` · `phone` · `email`. Kalan yedisi (`branches`, `segment`, `message`, `consent`, `ua`, `env`, `at`) `raw_data` jsonb'ye. Site segmenti `target_segment`'e yazılmamalı: o kolon kampanya anahtarı, yeni çip doğurur (`segments.ts:221-227`).
- **Biçim beklentisi (TASK-1.12 girdisi):** Bunker'ın telefon/e-posta için dayattığı biçim yok. CHECK yok, normalizasyon yok. Yalnız uzunluk sınırı var: `leads.phone varchar(50)`, `email varchar(255)`; site `MAX` 40/160 zaten altında. `staged_leads` text.

**3. Tüketici envanteri** — tam kayıt (dosya:satır tabloları) → `tasks/archive/TASK-1.11-ENVANTER.md`

- **Sayım:** dashboard'da `leads`'i SQL ile okuyan/yazan 56 dosya, `staged_leads` 17. Prod n8n'de `leads` geçen aktif iş akışı 23, pasif 1; `staged_leads` 1 (Alfred). crew-os yalnız sayım yapıyor.
- **(a) gönderen/eylem yapan:** hiçbir yol C tablosunu okumuyor.
  - Dashboard: sequence tick, reply-poll, classify, triage, lead-pull, brain, Alfred, composer/batch/next, onay ve toplu uçlar.
  - Canlı n8n: Autonomous Loop → Researcher → Writer → Approval Callback, Enrichment, `lead-intake-agent` → Outreach Agent, Cal.com, Smart Email Monitor, Reply Handler; Sequence Sender pasif.
  - A seçilirse yakalayanlar: batch kuyruğu (`outreach/batch.ts:118-136`), next-5, `sequence_status='active'` olursa tenant filtresiz Researcher→Writer, website dolu/e-posta boşsa Enrichment, soğuk listeyle e-posta tekil çakışması.
  - Otomatik mail için vadesi gelmiş `outreach_sequence` step=2 satırı şart; o satırı yalnız composer gönderimi yaratır.
- **(b) rapor/metrik:** hiçbir sayaçta `source` filtresi yok. A seçilirse funnel, today, reports, feed, kanban, readiness ve ops sayılarının hepsine karışır; C hiçbirine karışmaz.
- **(c) KVKK:** `gdpr-delete` (kiwi admin, e-postayla, leads satırı yoksa erken döner) ve `export` (yalnız leads) C tablosunu kapsamaz. Bunker'da uzatma ya da elle prosedür gerekir (TASK-1.15 girdisi).
- **Çift bildirim doğmaz:** dashboard INSERT'lerinde Slack/mail yok, yalnız `audit_log`.
- **Hermes:** `alpfit` gate'i açık (`paused=false`). Yönlendirme garantisi `mailer.ts:147-151,350-361`; prod env'deki değer devralındı, ölçülmedi.

**4. Sözleşme taslağı (öneri C + (b); ayrıntı TASK-1.13'te kesinleşir)**

- **İstek:** `POST https://alpfit.kiwiailab.com/api/public/demo-request`. Kiracı Host'tan gelir (emsal `reverb/demo-request` → `getCurrentTenant`). Başlıkta alıcıya özel token. Gövde sitenin `Lead` JSON'u, değişmeden.
- **Yanıt:**
  - Başarı: `{ok:true, id}`, yalnız INSERT … RETURNING sonrası.
  - Hata: 401 `{ok:false,code:"bad-token"}` · 400 `bad-json` · 422 `invalid` · 500 `db-error` · 503 `no-token-configured`.
- **`toWebhook`'un üç kapısıyla karşılaştırma:**
  - Kapı 1 (HTTP durumu): ele alınan her hata 2xx dışı.
  - Kapı 2 (JSON gövde): ele alınmayanları yakalar. Next'in HTML 500'ü, nginx 502 HTML, PUBLIC_PREFIXES kaydı unutulursa middleware'in `/login`'e 307'si (fetch izler, 200 HTML döner) — üçü de JSON değil.
  - Kapı 3 (`ok === true`): yalnız yazımdan sonra döner.
- **Site tarafı:** `toWebhook` bugün yalnız `content-type` gönderiyor. Başlıkla token için TASK-1.14'te bir başlık ve yeni sır anahtarı (öneri `LEAD_WEBHOOK_TOKEN`) eklenir. Gövde değişmez. URL sorgusunda token: site kodu değişmez, ama token istek satırıyla günlüklere düşer (Bunker nginx log biçimi ölçülmedi).
- **Versiyon yeri:** (b) → `bunker-os` monoreposu, `bunker-dashboard/migrations/0082_…` + route + smoke. (a) → iş akışının otoritesi prod n8n DB'si; repo kopyası geleneksel olarak `bunker-v2/workflows/`, DDL yine migration.

**5. KVKK ve yedek gerçeği (TASK-1.15 girdisi)**

- **Konum:** `178.104.140.36` RDAP → `CLOUD-NBG1`, ülke **DE** (ölçüldü 2026-09-13). Hetzner Cloud nbg1-dc3 (devralındı, `../altyapi/vps/CLAUDE.md`).
- **Talep kaydına erişebilenler:**
  - `alpfit` panel parolası: kiracı başına tek parola, `tenants.dashboard_password_hash_b64` dolu (ölçüldü).
  - `kiwi` ana parolası tüm kiracılara girer (devralındı, Bunker memory `prod-db-parolasi-ve-kimlik`).
  - Sunucu root SSH (tek anahtar, devralındı), Postgres `bunker_user` ve Adminer.
  - n8n: aynı DB, 1 hesap, MFA açık (dökümden ölçüldü).
  - Aşağıdaki yedek kopyaları.
- **Yedek:**
  - Sunucu içi günlük döküm 02:30 UTC: dosya adları 2026-08-29 → 09-12 kesintisiz (ölçüldü). Sunucu içi saklama 14 gün (devralındı).
  - Sunucu dışı kopya **bu masaüstünde**: `~/vps-yedekler/`, 90 gün, 15 bunker dökümü. Son indirme 2026-09-12 10:08 TAMAM; `vps-yedek-indir.timer` etkin, sonraki koşu 2026-09-13 10:06. Geri yükleme testi 2026-09-11 TAMAM (124 tablo).
  - Döküm dosyaları şifresiz (0644, dizin 0700). Google Drive ev yedeğine girmiyor (`/usr/local/bin/yedek` DAHIL listesi).
  - Yeni talep kayıtları hem sunucu yedeğine (DE) hem masaüstü kopyasına (TR) girer.
- **Gelen Kutusu'ndaki yedek çelişkisi çözüldü:** indirme 2026-09-11'de kuruldu (`../altyapi/README.md` "Kurulum tarihi 11 Eylül 2026"). `../altyapi/vps/CLAUDE.md`'nin 2026-09-10 "sunucu dışında hiç yedek yok" notu bayat.

**6. Yerel prova ortamının girdileri (TASK-1.17)**

- **Sürümler:**
  - Postgres 15.17 (döküm başlığı, ölçüldü). Yereldeki `postgres:15-alpine` 15.19.
  - n8n 2.14.2, digest'e sabit (devralındı: `../altyapi/vps/CLAUDE.md` + Bunker memory `n8n-prod-deploy`). Dökümdeki son n8n migration `CreateCredentialDependencyTable1773000000000`. Public `/rest/settings` sürüm vermiyor.
  - Bunker dashboard: Next 16.2.3, Node `24-alpine` (Dockerfile), `npm run dev` = `next dev --webpack`. Env anahtar adları `.env.example`'da.
- **Şema kaynağı: migration dosyaları değil, şema dökümü.**
  - Canlıdaki `leads.contact_name`, `contact_title`, `linkedin_url` hiçbir repo şema dosyasında yok (0 dosya).
  - `leads.meeting_id` canlıda uuid, `schema-v2-additions.sql:16`'da INTEGER. Bu dosya temiz DB'de düşüyor (Bunker B-066).
  - `hubspot_contact_id` canlıda varchar(50), v4 dosyasında 200.
  - Migration kayıt tablosu yok.
  - Kaynak `pg_restore --schema-only` (dökümden, sunucusuz) ya da canlıdan `pg_dump --schema-only`. Dökümde n8n'in kendi tabloları da var (aynı DB).
- **Asgari tohum** (gerçek kişi verisi yok, `example.com`):
  - `tenants`: `alpfit`, `kiwi` (tick'lerin varsayılanı).
  - `hermes_settings`: alpfit'in canlı değerleri.
  - Her (a) seçimini tetikleyecek birer sahte lead: `sequence_status='active'`+`status='new'`+email (Researcher) · website dolu + email boş (Enrichment) · `sequence_step=0`+email (batch) · `updated_at` 15 gün önce + email (classify) · alpfit için vadesi gelmiş `outreach_sequence` step=2 pending.
  - `staged_leads` pending.
  - C seçilirse tohum tenants + yeni tablodur. İzolasyon testi iki parçalı: "hiçbir tüketici tabloyu okumuyor" (grep + `workflow_entity`) ve yukarıdaki seçimlerin demo kaydını döndürmediği.
- **(b) seçilirse:** yerel ortam "n8n + Postgres" değil "Postgres + Bunker dashboard" olur; n8n gerekmez.


---

**Kullanıcıya Sorular** (kendi kendine yeter; kanıt ve dosya:satır yukarıdaki 1-6. maddelerde):

*Zemin.*
- `alpfit` bugün canlı soğuk e-posta kampanyasının kiracısı. 2026-09-12 yedeğinden ölçülenler:
  - 184 aday var.
  - Otomatik gönderim kapısı açık: `paused=false`, günde 5 mail.
  - 9 ilk mail gitmiş, 7 ikinci mail onay bekliyor.
- Talep eden kulüp bu listede zaten olabilir; aynı e-posta aynı kiracıya ikinci kez yazılamıyor.
- "Ayrı `source` değeri yeterli" varsayımı kodla çürüdü: ne panel kodu ne canlı n8n sorguları `source`'a bakıyor.

**Soru 1 — Demo talebi Bunker'da nereye yazılsın?**
- **A — `leads` tablosu.**
  - Artısı: talep panelin aday listesinde görünür.
  - Eksileri:
    - E-postası olan kayıt toplu outreach ekranına "ilk temas bekliyor" diye düşer.
    - Bir gün `sequence_status='active'` olursa, kiracı ayırmayan n8n araştırma ve taslak zincirine girer.
    - Bütün raporlara karışır.
    - Yalıtmak için iki motorda beş altı yere dışlama işareti gerekir ve her yeni yol bunu hatırlamak zorunda kalır.
- **B — `staged_leads` (onay kuyruğu).**
  - Artıları: panelde görünür, kaydı otomatik onaylayan bir yol yok.
  - Eksileri:
    - 96 bekleyen soğuk adayla aynı kuyrukta durur.
    - Onay tıklaması kaydı varsayılan olarak soğuk hatta taşır.
    - KVKK silme ucu kaydı bulamaz.
- **C — ayrı tablo (önerim; ad önerisi `demo_requests`).**
  - Artıları:
    - Bugün bu tabloyu okuyan hiçbir kod yok: panel kodunda 0, canlı n8n'in 47 iş akışında 0. Otomasyon dışı kalması kodla kanıtlı.
    - Talep her zaman yazılır, raporlar kirlenmez, önizleme testleri `env` kolonunda ayrışır.
  - Eksileri:
    - Panelde görünmesi için Bunker'da küçük bir liste sayfası gerekir (isteğe bağlı "adaya çevir" düğmesiyle).
    - Bunker'ın KVKK silme ve dışa aktarma uçları tabloyu kapsamaz; uzatma ya da elle prosedür gerekir.
  - Bildirim zaten site e-postasıyla gelir, çift bildirim doğmaz.

**Soru 2 — Alıcı nerede kurulsun?**
- **(a) n8n iş akışı.**
  - Artısı: Bunker koduna dokunulmaz.
  - Eksileri:
    - İş akışının tek gerçek kopyası canlı n8n veritabanında durur; repo kopyası canlının aynası değil.
    - Token için sunucuda env + compose ayarı ve n8n'in yeniden oluşturulması gerekir.
    - Testi yok.
  - Mevcut benzer akış `lead-intake-agent` canlı şemayla uyumsuz ve soğuk outreach akışına bağlı; yeniden kullanılamaz.
- **(b) Bunker'da ayrı uç (önerim, C ile).**
  - Artısı: kod, migration ve smoke testi tek repoda versiyonlu; CI'da koşar.
  - Eksileri:
    - Bunker OS ayrı bir DevFlow projesi (`NorthAIII/bunker-os`); iş oranın sırasına girer. Faz 24 icrası 13/13 bitti, sırada verify var (Bunker OS `9aa4205`, 2026-09-13).
    - TASK-1.17'nin yerel ortamı "n8n + Postgres" yerine "Postgres + Bunker" olur, yani plan revizyonu gerekir.

**Soru 3 — Token nerede taşınsın? → KARAR (run-task turu, 2026-09-13, duran yetkilendirmeyle): başlıkta.**
- Gerekçe: URL'deki token istek satırıyla sunucu günlüklerine düşer (QUALITY → Güvenlik: sır yalnız env'de). Başlık iki alıcı yolunda da çalışır (n8n emsali `x-internal-token` başlığı okuyor). Site maliyeti küçük: TASK-1.14 zaten `toWebhook`'a dokunuyor.
- Sonuç: TASK-1.14'te `toWebhook`'a bir başlık ve yeni sır anahtarı `LEAD_WEBHOOK_TOKEN` eklenir. Başlık adı TASK-1.13 sözleşmesinde kesinleşir. Bunker'ın ana `BUNKER_INTERNAL_TOKEN`'ı kullanılmaz; yalnız bu alıcıya ait yeni token üretilir.

**Soru 4 — Canlı sunucuda salt-okunur teyit? → KARAR (aynı tur): bu task'ta yapılmaz, 2026-09-12 yedeği yeterli — Soru 1'e C cevabı gelirse.**
- Gerekçe: ölçülemeyen üç kalem (prod'da koşan commit ve `OUTREACH_REDIRECT_TO`, yedek sonrası n8n değişiklikleri, sunucu içi yedek saklaması) C'nin izolasyon kanıtını değiştirmez. O kanıt kaynak koddaki ve dökümdeki okuyucu sayısına dayanır. Yapmamak geri alınabilir. Canlıya zaten dokunulacak an TASK-1.18'dir; koşan commit orada ölçülür.
- A ya da B seçilirse karar düşer: izolasyon koşan koda ve yönlendirmeye bağlanır, canlı teyit gerekir. Bu teyit sandbox dışı SSH ister, yani kullanıcı izni gerekir.
- Tur notu (2026-09-13): Bunker OS HEAD `99cf3ee` → `9aa4205`. Aradaki 2 commit `bunker-dashboard/src`, `migrations` ve `bunker-v2`'de dosya değiştirmedi. `demo_request` araması (büyük/küçük harf duyarsız) hâlâ 0; C'nin "okuyucu 0" kanıtı bu HEAD'de de tutuyor.

**Soru 5 — (yalnız A ya da B seçilirse)** Demo talepleri ve önizleme test kayıtları panel raporlarına karışsın mı, yoksa Bunker'da filtre mi eklensin?

**Önerim:** C + (b) + başlık. Gerekçe ↓ Son Yaklaşım.

**Son Yaklaşım:** Öneri **C (ayrı tablo) + (b) Bunker ucu + başlıkta alıcıya özel token**. Gerekçe:

- C'nin izolasyonu bugün mekanik olarak kanıtlı (okuyucu 0). A'nınki iki motorda beş-altı dışlama noktasına ve gelecekteki her yolun disiplinine bağlı.
- `alpfit` canlı soğuk kampanyanın kiracısı ve hedef kitlesi talep sahipleriyle aynı.
- (b) alıcıyı test edilebilir ve versiyonlu tek yerde tutar (ILKELER: kalıcılık, bakım kolaylığı, kümülatif test).
- Yedek öneri C + (a): Bunker koduna dokunmadan kurulur ama iş akışı prod DB'de yaşar.

**Sonraki Adım Detayı:** Kullanıcı ↑ Kullanıcıya Sorular 1, 2 ve 5'i cevaplayacak. 3 ve 4 karara bağlandı; 4, Soru 1'e A/B gelirse yeniden kullanıcıya döner. Task sırası geldiğinde cevap hâlâ yoksa yeniden sor, varsayılan seçme.

Cevaplar gelince:
- Kararı `docs/DECISIONS.md`'ye yaz, memory'yi güncelle, bu kaydı ✅ yap ve arşivle.
- DURUM Adım'ı `plan`'a çek (keşif bulgusu rotası, run-task → "Keşif bulgusu plan hatası değildir"). Plan revizyonunda bakılacaklar:
  - (b) seçilirse TASK-1.17'nin "n8n + Postgres" öncülü değişir.
  - Şema kaynağı dökümdür.
  - `../bunker-dashboard` referansları kanonik yola çevrilir.
  - C seçilirse TASK-1.13'ün "seçim sorgusu izolasyonu" kapsamı daralır.
- TASK-1.12 bu karardan bağımsız (biçim beklentisi yok, ↑ 2).
