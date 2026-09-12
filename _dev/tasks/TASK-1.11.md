# TASK-1.11: Bunker keşfi — demo talebinin giriş yolu ve otomasyon dışı tutma

**Durum:** ⬜ Bekliyor — kısmi ilerleme (keşif alt görev 1-6 commit'li); kullanıcı kararı bekleniyor (Oturum Kayıtları → Kullanıcıya Sorular + Sonraki Adım Detayı geçerli). Çalıştırma sırasında 1.12'nin arkasına taşındı (2026-09-13).
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** Yok (planlı keşif ayağı; lead zincirinin ilki)

---

## Hedef

Web sitesinden gelen demo talebinin Bunker'a (`alpfit` kiracısı) **nereden, nasıl ve hangi kayıtla** gireceğini salt okunur incelemeyle belirlemek. Kalan lead task'larının (1.17 yerel prova ortamı, 1.13 yerel alıcı, 1.14 site bağlantısı, 1.18 canlıya taşıma, 1.06 uçtan uca tur, 1.15 yasal metin) dayanacağı sözleşmeyi de yazılı hâle getirmek.

Task, seçilen giriş yolu tüm ayaklarıyla kaynağa bağlanıp yazıldığında, kaydın yazılacağı tabloyu okuyan kod yollarının envanteri çıkarılıp talebin gönderen/eylem yapan yolların hiçbirine girmeyeceği kodla gösterildiğinde ve kullanıcı yolu onayladığında tamamlanmış sayılır.

---

## Bağlam

Lead hedefi 2026-09-13'te Google Sheet'ten Bunker'a değişti. Google hesabındaki Apps Script dağıtımı yapılamamıştı (`docs/DECISIONS.md` 2026-09-13; iptal edilen `tasks/archive/TASK-1.04.md`).

Aynı kararın **ölçülmüş kısıtı** bu task'ın varlık sebebidir. Bunker'ın `leads` ve `staged_leads` tabloları soğuk e-posta dizisini (`outreach-sequence-tick`), otomatik onayı (`triage-auto-approve`) ve model sınıflandırmasını (`lead-classify-tick`) besliyor. Demo talebi körlemesine yazılırsa talebi yapan kulübe soğuk satış e-postası gidebilir. `/api/leads/intake` oturum isteyen CSV içe aktarma ucu olduğu için web sitesi alıcısı olamaz.

Bu bir **keşif ayağıdır**: bulgusu kalan task'ların doğruluğunu değiştirebilir. Değiştirirse bu bir arıza değil beklenen çıktıdır. Rota run-task → "Plan revizyonu gerekirse"dir: ayak ✅ + arşivle kapanır, DURUM Adım'ı `plan`'a çekilir.

Revizyonda verilen iki karar keşfin sınırını çizer:

- **E-postayı site gönderir** (Resend, her talepte), sunucu göndermez. Kayıt ve bildirim birbirinden bağımsız kalır.
- Alıcı **önce yerel prova ortamında** (compose; n8n + Postgres) kurulup sınanır, sonra canlıya taşınır (kullanıcı kararı; aynı gün verilen "yalnız canlıda çalışılır" kararını değiştirir — `docs/DECISIONS.md` 2026-09-13 "Alıcı provası"). Keşif bu ortamın girdilerini de çıkarır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — adresler, Bunker tuzağı, sır kuralı
- `_dev/docs/DECISIONS.md` → 2026-09-13 "Lead hedefi (yeniden)" ve "E-posta kaynağı" kayıtları
- `src/app/api/demo/route.ts` → `type Lead` (11 alan) ve `toWebhook` (üç kapılı sözleşme: HTTP durumu, JSON gövde, `ok === true`)
- `../altyapi/vps/CLAUDE.md` → "Değişiklik yaparken — pazarlıksız kurallar" (salt okunur kaynak)
- `../bunker-dashboard/AGENTS.md` ve `../bunker-dashboard/docs/system-flow.md` (salt okunur kaynak)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/docs/DECISIONS.md` — seçilen giriş yolu ve kimlik doğrulama biçimi (sözleşme bırakır)
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — giriş yolu ve izolasyon yöntemi (sır değeri değil, yalnız ad ve konum)

---

## Alt Görevler

- [ ] **1. Giriş yolu adaylarını çıkar**
  - (a) n8n iş akışı: webhook → Bunker veritabanına yazım. n8n'in bu veritabanına yazma kimliği var mı, var olan iş akışları arasında benzer bir desen var mı?
  - (b) Bunker'da kimlik doğrulamalı ayrı giriş ucu. Reponun kendi kuralları (`AGENTS.md`) ve dağıtım yolu bunu ne kadar pahalı kılıyor?
  - Her aday için kalıcılık (kaynak nerede versiyonlanır), bakım yükü ve arıza görünürlüğü yazılır

- [ ] **2. Kayıt biçimini belirle**
  - Talep hangi tabloya, hangi kaynak/tip değeriyle girer? `leads` / `staged_leads` mı, ayrı bir tip ya da tablo mu?
  - `type Lead` alanlarının (`at · env · name · club · branches · phone · email · segment · message · consent · ua`) Bunker şemasındaki karşılıkları; eşleşmeyen alanın nereye yazılacağı
  - `env` (`local`/`preview`/`production`) nasıl taşınır? Önizleme testleri panelde ayırt edilmeli
  - Bunker'ın telefon/e-posta için beklediği biçim varsa not edilir — TASK-1.12'nin doğrulama kuralına girer

- [ ] **3. Tüketici envanterini çıkar ve izolasyonu kanıtla**
  - Kaydın yazılacağı tabloyu okuyan kod yolları sayılır. verify-plan sayımı (2026-09-13, `grep`): `leads` ~55 dosya, `staged_leads` 17 dosya. Ayrı tablo seçilirse sayım o tablo için yapılır; (c) sınıfı yine sorulur. Her yol üç sınıftan birine yazılır:
    - **(a) Gönderen / eylem yapan:** zamanlanmış işler (`outreach-sequence-tick`, `triage-auto-approve`, `lead-classify-tick`, `lead-pull-tick` ve `src/app/api/internal/` altındaki diğer tick'ler) **ve** zamanlanmamış yollar (`alfred-tool`, `brain/executors` onay akışı, `hermes-send`, `outreach/batch`). Her birinin kaydı hangi koşulla seçtiği okunur, dosya:satır yazılır; önerilen kayıt biçiminin **hiçbirine** girmediği gösterilir
    - **(b) Rapor / metrik:** `reports`, `leads/funnel`, `tenant-performance`, `cross-tenant-overview`, `daily/briefing` gibi. Demo talebi ve `env=local`/`preview` test kayıtları bu sayılara karışıyor mu? Karışıyorsa kabul mü filtre mi, kullanıcıya getirilir
    - **(c) KVKK hakları:** `leads/gdpr-delete` ve `leads/export`. Demo talebi silme ve dışa aktarma başvurusunda kapsanıyor mu? Kapsanmıyorsa not düşülür (TASK-1.15 girdisi)
  - Liste verify-plan'ın `grep` örneklemidir, eksiksiz değildir — envanterin kendisi bu task'ın çıktısıdır
  - `alpfit` kiracısında Hermes'in durumu (duraklatılmış mı) okunur
  - Bunker yeni talep için **kendiliğinden bildirim** üretiyor mu? Üretiyorsa site e-postasıyla çift bildirim olur, kullanıcıya getirilir

- [ ] **4. Sözleşmeyi yaz**
  - Adres biçimi, kimlik doğrulama (sorgu token'ı mı, başlık mı), istek gövdesi, yanıt gövdesi
  - Yanıt sözleşmesi: yazım başarılıysa `{ok:true}`; **her hata yolunda JSON** `{ok:false, code}`. HTML hata sayfası, boş gövde ya da yazmadan dönen `ok:true` yok
  - Sitede kod değişikliği gerekip gerekmediği (TASK-1.14'ün kapsamı buradan çıkar)
  - Alıcı tanımının versiyonlanacağı yer: Bunker reposu, altyapı reposu ya da bu repo

- [ ] **5. KVKK ve yedek gerçeğini oku**
  - Sunucunun konumu (ülke) — TASK-1.15 yasal metni buna dayanır
  - Talep kaydına Bunker'da kimler erişebiliyor (kiracı kullanıcıları)
  - Yeni kayıtlar sunucunun veritabanı yedeğine giriyor mu, ve sunucu dışı kopya **bugün** var mı — ölçülür. Kaynak `../altyapi/vps/CLAUDE.md` → yedek tablosu; 2026-09-10 durum notu "sunucu dışında hiç yedek kopyası yok" diyor, `docs/DECISIONS.md` 2026-09-13 ise kurulu diyor (çelişki Gelen Kutusu'nda). `../altyapi/README.md` masaüstü makinenin yedeğini anlatır, sunucuyu değil

- [ ] **6. Yerel prova ortamının girdilerini çıkar** (TASK-1.17 bunlarla kurar)
  - Canlıdaki n8n ve Postgres **sürümleri** (imaj etiketleri)
  - Bunker şemasının yerelde kurulabileceği kaynak: migration dosyaları mı, salt okunur şema dökümü mü? Canlı şema migration'larla birebir mi (elle yapılmış fark var mı)?
  - Asgari tohum: `alpfit` kiracısı ve envanterdeki (a) sınıfı seçim sorgularını koşturmaya yeten kayıtlar — gerçek kişi verisi olmadan
  - Yol Bunker giriş ucuysa Bunker uygulamasının yerelde nasıl koşacağı (reponun kendi komutu, bağımlılıklar)

- [ ] **7. Kullanıcı onayı**
  - Aday(lar), öneri ve gerekçe kullanıcıya sunulur; seçilen yol Oturum Kaydı'na ve `docs/DECISIONS.md`'ye yazılır

---

## Etkilenen Dosyalar

```
_dev/
├── docs/DECISIONS.md                              # giriş yolu kararı — zaten var
└── memory/kendi-sunucu-n8n-bunker-umami.md        # giriş yolu ve izolasyon notu — zaten var
```

> Kod değişikliği yok. Bunker reposu, canlı veritabanı ve n8n **salt okunur** incelenir.

---

## Dikkat Noktaları

- **Hiçbir yazma işlemi yok.** Veritabanında yalnız `SELECT`, mümkünse salt okunur işlem içinde. n8n'de iş akışı açılır, düzenlenmez ya da çalıştırılmaz. Bunker reposunda dosya değişmez.
- **Kişisel veri dökülmez.** Mevcut `leads` satırları ekrana basılmaz; şema, sayım ve seçim koşulları yeterli.
- **Sır değeri ekrana basılmaz**, dokümana ya da commit'e yazılmaz. Yalnız anahtar adı ve konumu yazılır (`/opt/bunker/.env` ve benzeri; memory).
- Sunucuya bağlanmanın kuralları `../altyapi/vps/CLAUDE.md`'dedir. Keşif salt okunur olsa da oradaki erişim yolu izlenir.
- **Varsayılan tuzak:** "Ayrı `source` değeri yeterli" varsayımı kodla sınanmadan yazılmaz. Otomasyon `source`'a bakmıyorsa ayrı değer izolasyon sağlamaz.
- Keşif alıcıyı **kurmaz** — yerel kurulum TASK-1.13, canlı kurulum TASK-1.18'dir. Bu task yalnız yolu, sözleşmeyi, izolasyonu ve yerel prova girdilerini belirler.
- Umami, Bunker'ın "Web Trafik" paneline de besliyor (v1 `BaseLayout.astro` yorumu). Bu task'ın konusu değil, TASK-1.07'nin dikkat noktası.

---

## Test Kriterleri

- [ ] Seçilen giriş yolunun her ayağı (adres, kimlik, yazılan tablo/değer, yanıt) kaynağıyla (dosya:satır ya da sorgu çıktısı) Oturum Kaydı'nda yazılı
- [ ] Tüketici envanteri üç sınıfıyla (gönderen/eylem yapan · rapor/metrik · KVKK silme/dışa aktarma) Oturum Kaydı'nda; (a) sınıfındaki her yolun seçim koşulu dosya:satır ile okunmuş ve önerilen kayıt biçiminin hiçbirine girmediği satır satır gösterilmiş; (b) ve (c) için karar ya da not yazılı
- [ ] Yanıt sözleşmesi, `toWebhook`'un üç kapısıyla (HTTP durumu, JSON gövde, `ok === true`) karşılaştırılmış; site tarafında değişiklik gerekip gerekmediği yazılı
- [ ] Yazma yapılmadığı kanıtlanmış: veritabanı oturumu salt okunur, n8n iş akışı listesi ve Bunker reposunun `git status`'u keşif öncesi ve sonrası aynı
- [ ] Sunucu konumu, talep kaydına erişen hesaplar ve yedek durumu (sunucu içi yedek + sunucu dışı kopya, bugünkü ölçümle) yazılı (TASK-1.15 girdisi)
- [ ] Yerel prova girdileri yazılı: canlı sürümler, şema kaynağı ve canlıyla farkı, asgari tohum tanımı (TASK-1.17 girdisi)
- [ ] Kullanıcı seçilen yolu onayladı; karar `docs/DECISIONS.md`'de

---

## Karar Noktaları

- **Giriş yolu:** n8n iş akışı vs Bunker giriş ucu. Keşifte ölçülen kalıcılık, bakım ve arıza görünürlüğüne göre öneri yapılır; **karar kullanıcıya sorulur**.
- **Kimlik doğrulama biçimi:** Token URL sorgusunda kalırsa site kodu değişmez. Başlıkla taşınması daha doğruysa TASK-1.14'te `toWebhook` değişir ve yeni bir sır anahtarı doğar. Öneri sözleşmeyle birlikte kullanıcıya sunulur.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-13

**Durum:** 🔄 Devam edecek — alt görev 1-6 bitti, 7 (kullanıcı onayı) bekliyor. Kod değişikliği yok; keşif ilerlemesi commit'lendi. Task tabloda ⬜ kaldı ve orkestratör kararıyla 1.12'nin arkasına alındı.

**Yapılanlar:**

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

**3. Tüketici envanteri** — tam kayıt (dosya:satır tabloları) → `tasks/TASK-1.11-ENVANTER.md`

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

**7. Kullanıcı onayı** — bekliyor (↓ Kullanıcıya Sorular).

**Sorunlar:**
- Task dokümanı bayat Bunker klonunu gösteriyordu: kanonik kopyaya geçildi, iki kopyanın farkı ölçüldü.
- Canlı DB/n8n okuması sunucu girişi ister ve bu makineden SSH `dangerouslyDisableSandbox` gerektiriyor (Bunker memory `prod-ssh-ve-komut-sekli`). Girilmedi; sunucu dışı yedekten okundu. Ölçülemeyenler: prod dashboard'un koşan commit'i ve env'i (`OUTREACH_REDIRECT_TO`), 2026-09-12 02:30 sonrası n8n değişiklikleri, sunucu içi yedek saklaması.

**Kararlar:**
- İcra kararları (tercih değil, yöntem): kanonik kod `../Bunker OS/bunker-dashboard`; canlı sistemlere oturum açılmadı; ölçüm kullanıcının geri yükleme testi deseniyle sunucu dışı dökümden alındı.
- Giriş yolu, kayıt biçimi ve kimlik doğrulama biçimi **kullanıcı kararı**; öneri C + (b) + başlık.
- Sıra (orkestratör kararı, 2026-09-13): kullanıcı kararı TASK-1.12'yi engellemediği için 1.11 tabloda ⬜ kaldı ve 1.12'nin arkasına alındı. ⏸️/🔴 ve `Adım=plan` rotası kullanılmadı; TASK-1.07 emsali.
- docs/DECISIONS.md'ye eklendi: Hayır (onaydan sonra).

**Kalan İşler:**
- Kullanıcı onayı (alt görev 7).
- Onaydan sonra: DECISIONS kaydı; memory `kendi-sunucu-n8n-bunker-umami` güncellemesi (kanonik Bunker yolu, sunucu dışı yedek konumu ve dökümden salt-okunur keşif yöntemi, giriş yolu, izolasyon yöntemi).
- İzin verilirse salt-okunur sunucu teyidi.

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
    - Bunker OS ayrı bir DevFlow projesi (`NorthAIII/bunker-os`) ve Faz 24'ü açık (11/13); iş oranın sırasına girer.
    - TASK-1.17'nin yerel ortamı "n8n + Postgres" yerine "Postgres + Bunker" olur, yani plan revizyonu gerekir.

**Soru 3 — Token nerede taşınsın?**
- **Başlıkta (önerim):** TASK-1.14'te `toWebhook`'a bir başlık ve yeni sır anahtarı eklenir (öneri `LEAD_WEBHOOK_TOKEN`).
- **URL'de:** site kodu değişmez, ama token istek satırıyla sunucu günlüklerine düşer.
- İki durumda da Bunker'ın ana `BUNKER_INTERNAL_TOKEN`'ı kullanılmaz, yalnız bu alıcıya ait yeni bir token üretilir.

**Soru 4 — Canlı sunucuda salt-okunur teyit yapılsın mı, yoksa 2026-09-12 yedeği yeterli mi?**
- Ölçülemeyenler:
  - Prod'da koşan Bunker commit'i ve env'i (`OUTREACH_REDIRECT_TO` yönlendirmesi).
  - Yedekten sonraki n8n değişiklikleri.
  - Sunucudaki yedeklerin saklama süresi.
- Bu makineden SSH `dangerouslyDisableSandbox` istiyor, yani kullanıcı izni gerekir.
- C seçilirse izolasyon kanıtı koşan koda bağlı değil; teyit isteğe bağlı kalır.

**Soru 5 — (yalnız A ya da B seçilirse)** Demo talepleri ve önizleme test kayıtları panel raporlarına karışsın mı, yoksa Bunker'da filtre mi eklensin?

**Önerim:** C + (b) + başlık. Gerekçe ↓ Son Yaklaşım.

**Son Yaklaşım:** Öneri **C (ayrı tablo) + (b) Bunker ucu + başlıkta alıcıya özel token**. Gerekçe:

- C'nin izolasyonu bugün mekanik olarak kanıtlı (okuyucu 0). A'nınki iki motorda beş-altı dışlama noktasına ve gelecekteki her yolun disiplinine bağlı.
- `alpfit` canlı soğuk kampanyanın kiracısı ve hedef kitlesi talep sahipleriyle aynı.
- (b) alıcıyı test edilebilir ve versiyonlu tek yerde tutar (ILKELER: kalıcılık, bakım kolaylığı, kümülatif test).
- Yedek öneri C + (a): Bunker koduna dokunmadan kurulur ama iş akışı prod DB'de yaşar.

**Sonraki Adım Detayı:** Kullanıcı ↑ Kullanıcıya Sorular 1-5'i cevaplayacak. Task sırası geldiğinde cevap hâlâ yoksa yeniden sor, varsayılan seçme.

Cevaplar gelince:
- Kararı `docs/DECISIONS.md`'ye yaz, memory'yi güncelle, bu kaydı ✅ yap ve arşivle.
- DURUM Adım'ı `plan`'a çek (keşif bulgusu rotası, run-task → "Keşif bulgusu plan hatası değildir"). Plan revizyonunda bakılacaklar:
  - (b) seçilirse TASK-1.17'nin "n8n + Postgres" öncülü değişir.
  - Şema kaynağı dökümdür.
  - `../bunker-dashboard` referansları kanonik yola çevrilir.
  - C seçilirse TASK-1.13'ün "seçim sorgusu izolasyonu" kapsamı daralır.
- TASK-1.12 bu karardan bağımsız (biçim beklentisi yok, ↑ 2).

**Dosya Değişiklikleri:**
- `_dev/tasks/TASK-1.11.md` → durum ve bu oturum kaydı
- `_dev/tasks/TASK-1.11-ENVANTER.md` → yeni; alt görev 3'ün tam envanteri (parent tek okumaya sığsın diye bölündü — arşive parent'la birlikte taşınır)
- `_dev/BULGULAR.md` → Gelen Kutusu'na üç `[TASK-1.11]` satırı: kullanıcı kararı + Bunker OS'a ait iki gözlem. `[verify-plan]` yedek çelişkisi satırı ölçümle çözüldüğü için silindi (bilgi ↑ 5. maddeye mezun)
- `_dev/DURUM.md`, `_dev/phases/PHASE-1.md` → TASK-1.11 satırı 1.12'nin arkasına taşındı, Aktif Task TASK-1.12 (orkestratör kararı; tanım ve kriterler değişmedi)

**Test Sonuçları:**
- **Yazma yapılmadığı (kapsam: bu oturumun dokunduğu yüzeyler):**
  - Canlı DB'ye ve n8n'e oturum açılmadı. Dışarıya giden istekler yalnız kimliksiz GET: n8n `/healthz` 200 · `/rest/settings` 200 · `ops /api/healthz` 200 · RIPE RDAP.
  - Bunker OS HEAD `99cf3ee`, `git status --porcelain` 0 satır → 0 satır. Eski klon `a3ae17a`, 0 → 0.
  - `~/vps-yedekler` dizin mtime'ı 2026-09-12 10:08, değişmedi.
  - Geri yükleme konteyneri ağsızdı ve silindi.
- **Test kriterleri:**
  - Giriş yolu ayakları kaynağıyla: ✅ iki aday için, seçim bekliyor.
  - Envanter üç sınıfıyla: ✅ dashboard + canlı n8n + crew-os. "Önerilen biçime girmez" C için satır satır gösterildi; A için yakalayan yollar ayrıca yazıldı.
  - Yanıt sözleşmesi üç kapıyla karşılaştırıldı: ✅ öneri için.
  - Yazma yok: ✅ yukarıdaki kapsamla.
  - Konum / erişim / yedek: ✅; sunucu içi saklama devralındı.
  - Yerel prova girdileri: ✅.
  - Kullanıcı onayı: ⬜.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu)
