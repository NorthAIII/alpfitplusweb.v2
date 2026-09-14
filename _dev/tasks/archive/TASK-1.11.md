# TASK-1.11: Bunker keşfi — demo talebinin giriş yolu ve otomasyon dışı tutma

**Durum:** ✅ Tamamlandı (2026-09-14) — hedef v1'in lead deposu (PocketBase), Bunker değil; lead task zinciri plan revizyonuna gitti (Oturum — 2026-09-14, `docs/DECISIONS.md` 2026-09-14). Keşif detayı `TASK-1.11-BUNKER-KESFI.md`, envanter `TASK-1.11-ENVANTER.md`.
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

- [x] **1. Giriş yolu adaylarını çıkar**
  - (a) n8n iş akışı: webhook → Bunker veritabanına yazım. n8n'in bu veritabanına yazma kimliği var mı, var olan iş akışları arasında benzer bir desen var mı?
  - (b) Bunker'da kimlik doğrulamalı ayrı giriş ucu. Reponun kendi kuralları (`AGENTS.md`) ve dağıtım yolu bunu ne kadar pahalı kılıyor?
  - Her aday için kalıcılık (kaynak nerede versiyonlanır), bakım yükü ve arıza görünürlüğü yazılır

- [x] **2. Kayıt biçimini belirle**
  - Talep hangi tabloya, hangi kaynak/tip değeriyle girer? `leads` / `staged_leads` mı, ayrı bir tip ya da tablo mu?
  - `type Lead` alanlarının (`at · env · name · club · branches · phone · email · segment · message · consent · ua`) Bunker şemasındaki karşılıkları; eşleşmeyen alanın nereye yazılacağı
  - `env` (`local`/`preview`/`production`) nasıl taşınır? Önizleme testleri panelde ayırt edilmeli
  - Bunker'ın telefon/e-posta için beklediği biçim varsa not edilir — TASK-1.12'nin doğrulama kuralına girer

- [x] **3. Tüketici envanterini çıkar ve izolasyonu kanıtla**
  - Kaydın yazılacağı tabloyu okuyan kod yolları sayılır. verify-plan sayımı (2026-09-13, `grep`): `leads` ~55 dosya, `staged_leads` 17 dosya. Ayrı tablo seçilirse sayım o tablo için yapılır; (c) sınıfı yine sorulur. Her yol üç sınıftan birine yazılır:
    - **(a) Gönderen / eylem yapan:** zamanlanmış işler (`outreach-sequence-tick`, `triage-auto-approve`, `lead-classify-tick`, `lead-pull-tick` ve `src/app/api/internal/` altındaki diğer tick'ler) **ve** zamanlanmamış yollar (`alfred-tool`, `brain/executors` onay akışı, `hermes-send`, `outreach/batch`). Her birinin kaydı hangi koşulla seçtiği okunur, dosya:satır yazılır; önerilen kayıt biçiminin **hiçbirine** girmediği gösterilir
    - **(b) Rapor / metrik:** `reports`, `leads/funnel`, `tenant-performance`, `cross-tenant-overview`, `daily/briefing` gibi. Demo talebi ve `env=local`/`preview` test kayıtları bu sayılara karışıyor mu? Karışıyorsa kabul mü filtre mi, kullanıcıya getirilir
    - **(c) KVKK hakları:** `leads/gdpr-delete` ve `leads/export`. Demo talebi silme ve dışa aktarma başvurusunda kapsanıyor mu? Kapsanmıyorsa not düşülür (TASK-1.15 girdisi)
  - Liste verify-plan'ın `grep` örneklemidir, eksiksiz değildir — envanterin kendisi bu task'ın çıktısıdır
  - `alpfit` kiracısında Hermes'in durumu (duraklatılmış mı) okunur
  - Bunker yeni talep için **kendiliğinden bildirim** üretiyor mu? Üretiyorsa site e-postasıyla çift bildirim olur, kullanıcıya getirilir

- [x] **4. Sözleşmeyi yaz**
  - Adres biçimi, kimlik doğrulama (sorgu token'ı mı, başlık mı), istek gövdesi, yanıt gövdesi
  - Yanıt sözleşmesi: yazım başarılıysa `{ok:true}`; **her hata yolunda JSON** `{ok:false, code}`. HTML hata sayfası, boş gövde ya da yazmadan dönen `ok:true` yok
  - Sitede kod değişikliği gerekip gerekmediği (TASK-1.14'ün kapsamı buradan çıkar)
  - Alıcı tanımının versiyonlanacağı yer: Bunker reposu, altyapı reposu ya da bu repo

- [x] **5. KVKK ve yedek gerçeğini oku**
  - Sunucunun konumu (ülke) — TASK-1.15 yasal metni buna dayanır
  - Talep kaydına Bunker'da kimler erişebiliyor (kiracı kullanıcıları)
  - Yeni kayıtlar sunucunun veritabanı yedeğine giriyor mu, ve sunucu dışı kopya **bugün** var mı — ölçülür. Kaynak `../altyapi/vps/CLAUDE.md` → yedek tablosu; 2026-09-10 durum notu "sunucu dışında hiç yedek kopyası yok" diyor, `docs/DECISIONS.md` 2026-09-13 ise kurulu diyor (çelişki Gelen Kutusu'nda). `../altyapi/README.md` masaüstü makinenin yedeğini anlatır, sunucuyu değil

- [x] **6. Yerel prova ortamının girdilerini çıkar** (TASK-1.17 bunlarla kurar)
  - Canlıdaki n8n ve Postgres **sürümleri** (imaj etiketleri)
  - Bunker şemasının yerelde kurulabileceği kaynak: migration dosyaları mı, salt okunur şema dökümü mü? Canlı şema migration'larla birebir mi (elle yapılmış fark var mı)?
  - Asgari tohum: `alpfit` kiracısı ve envanterdeki (a) sınıfı seçim sorgularını koşturmaya yeten kayıtlar — gerçek kişi verisi olmadan
  - Yol Bunker giriş ucuysa Bunker uygulamasının yerelde nasıl koşacağı (reponun kendi komutu, bağımlılıklar)

- [x] **7. Kullanıcı onayı**
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

- [x] Seçilen giriş yolunun her ayağı (adres, kimlik, yazılan tablo/değer, yanıt) kaynağıyla (dosya:satır ya da sorgu çıktısı) Oturum Kaydı'nda yazılı
- [x] Tüketici envanteri üç sınıfıyla (gönderen/eylem yapan · rapor/metrik · KVKK silme/dışa aktarma) Oturum Kaydı'nda; (a) sınıfındaki her yolun seçim koşulu dosya:satır ile okunmuş ve önerilen kayıt biçiminin hiçbirine girmediği satır satır gösterilmiş; (b) ve (c) için karar ya da not yazılı
- [x] Yanıt sözleşmesi, `toWebhook`'un üç kapısıyla (HTTP durumu, JSON gövde, `ok === true`) karşılaştırılmış; site tarafında değişiklik gerekip gerekmediği yazılı
- [x] Yazma yapılmadığı kanıtlanmış: veritabanı oturumu salt okunur, n8n iş akışı listesi ve Bunker reposunun `git status`'u keşif öncesi ve sonrası aynı
- [x] Sunucu konumu, talep kaydına erişen hesaplar ve yedek durumu (sunucu içi yedek + sunucu dışı kopya, bugünkü ölçümle) yazılı (TASK-1.15 girdisi)
- [x] Yerel prova girdileri yazılı: canlı sürümler, şema kaynağı ve canlıyla farkı, asgari tohum tanımı (TASK-1.17 girdisi)
- [x] Kullanıcı seçilen yolu onayladı; karar `docs/DECISIONS.md`'de

---

## Karar Noktaları

- **Giriş yolu:** n8n iş akışı vs Bunker giriş ucu. Keşifte ölçülen kalıcılık, bakım ve arıza görünürlüğüne göre öneri yapılır; **karar kullanıcıya sorulur**.
- **Kimlik doğrulama biçimi:** Token URL sorgusunda kalırsa site kodu değişmez. Başlıkla taşınması daha doğruysa TASK-1.14'te `toWebhook` değişir ve yeni bir sır anahtarı doğar. Öneri sözleşmeyle birlikte kullanıcıya sunulur.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-13

**Durum:** 🔄 Devam edecek — alt görev 1-6 bitti, 7 (kullanıcı onayı) bekliyor. Kod değişikliği yok; keşif ilerlemesi commit'lendi. Task tabloda ⬜ kaldı ve orkestratör kararıyla 1.12'nin arkasına alındı.

**Yapılanlar:**

**0-6. Bunker keşfi** — tam kayıt → `tasks/archive/TASK-1.11-BUNKER-KESFI.md` (dosya:satır tabloları → `tasks/archive/TASK-1.11-ENVANTER.md`). Özü:
- Kanonik Bunker kodu `../Bunker OS/bunker-dashboard`; ölçüm canlıya bağlanmadan sunucu dışı yedekten (`~/vps-yedekler/bunker-20260912-023004.dump`, ağsız konteyner) alındı.
- `alpfit` canlı soğuk kampanyanın kiracısı. "Ayrı `source` yeter" varsayımı kodla çürüdü. Üç kayıt biçimi (A `leads` · B `staged_leads` · C ayrı tablo) ve iki alıcı yolu (n8n · Bunker ucu) ölçüldü; öneri C + Bunker ucu + başlıkta token idi.
- Sunucu konumu DE (`178.104.140.36`, RDAP `CLOUD-NBG1`); sunucu içi günlük yedek + masaüstünde sunucu dışı kopya (90 gün). Yerel prova girdileri: PG 15.17, n8n 2.14.2, şema kaynağı döküm.

**7. Kullanıcı onayı** — bekliyordu; sorular ve öneri → `tasks/archive/TASK-1.11-BUNKER-KESFI.md` → Kullanıcıya Sorular. Cevap ↓ Oturum — 2026-09-14.

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

### Oturum — 2026-09-14

**Durum:** ✅ Tamamlandı — keşif ayağı işini bitirdi; bulgu kalan lead task'larının doğruluğunu değiştirdiği için DURUM Adım'ı `plan`'a çekildi (run-task → "Keşif bulgusu plan hatası değildir").

**Yapılanlar:**
- **Kullanıcı cevabı (2026-09-14, orkestratör aracılığıyla, birebir):** *"şu an mevcut canlı sitede nereye yazılıyor demo talebi basit bir şekilde yazılsın zaten mail de gelecek bu yeterli sonra değiştiririz gerekirse"*. Soru 1 ve 2'nin seçimi yön verilerek devredildi. Orkestratörün ölçüt sırası: (a) soğuk otomasyonu beslemesin · (b) en az hareketli parça ve dış proje/canlı sistem işi · (c) sonradan değiştirmesi ucuz.
- **v1'in yolu ölçüldü** (`../Alpfitplus-website.v1`, HEAD `da8bb71` = `origin/main`, `api/demo.ts` ve `pocketbase/` temiz; salt okunur):
  - Uç `api/demo.ts` (Vercel Edge).
  - Önce kalıcı kayıt: `POST ${LEAD_STORE_URL}/lead`, başlık `X-Lead-Token`, gövde `name club phone email locale branches message ip_hash`, başarı `201 {id, prior_count}` (`:233-256`). Store 429'u istemciye taşınır (`:276-278`).
  - Sonra Resend ile paralel iki e-posta: ekip (`DEMO_TO`) ve talep sahibi onayı (`:324-346`). Bildirim durumu `PATCH /lead/{id}` ile kayda geri yazılır (`:359-371`). Kayıt ya da ekip e-postasından biri tuttuysa `200 {ok:true}` (`:375`).
  - Depo: PocketBase v0.39.9, `lead.alpfitplus.com`, aynı Hetzner sunucusunda (`178.104.140.36`) ayrı compose projesi `alpfit-lead`, Bunker DB'sinden bağımsız SQLite (`pocketbase/README.md:23-42`).
  - Token koleksiyonu belirler: `leads` production · `leads_preview` preview (`:175-183`). Yedek günlük 03:00, 7 kopya; saklama 12 ay (cron 03:30 UTC).
  - v1 Vercel'de env Production + Preview tanımlı (v1 `tasks/archive/TASK-1.06.md:140`, devralındı). `https://lead.alpfitplus.com/api/health` → 200 (2026-09-14, kimliksiz GET).
- **İzolasyon (seçilen yolun tüketici envanteri):**
  - (a) gönderen/eylem yapan: yok. Koleksiyon kuralları beşi de `null`, yalnız superuser (`pb_migrations/1785184594_created_leads_and_leads_preview.js:105-109`). Hook'lar yalnız `routerAdd` ×2 (`lead.pb.js:20,111`), `onRecordCreate` varsayılanı (`leads_defaults.pb.js:17`) ve saklama cron'u (`retention.pb.js:30`).
  - Bunker OS `bunker-dashboard/src` + `bunker-v2` içinde `pocketbase|lead.alpfitplus` → 0 dosya (HEAD `9aa4205`, `72a99e8`'de tekrarlandı).
  - Canlı n8n: `bunker-20260914-023004.dump` → `workflow_entity` (ağsız `postgres:15-alpine`, yalnız sayım). `lead.alpfitplus` 0 · `pocketbase` 0 · `alpfitplus` 0 · `leads_preview` 0 · `X-Lead-Token` 0. İki `demo` geçişi soğuk hat model istemlerinin metni, bir adres değil.
  - (b) rapor/metrik: PocketBase'i sayan bir Bunker raporu yok (aynı grep). Önizleme test talepleri `leads_preview`'da ayrışır.
  - (c) KVKK: silme/dışa aktarma superuser panelinden elle yapılır; 12 ay saklama cron'la silinir (TASK-1.15 girdisi).
- **Sözleşme `toWebhook`'un üç kapısıyla karşılaştırıldı:** Kapı 1 (HTTP durumu) tutar: hata yolları 400/401/429/500. Kapı 2 (JSON gövde): hata gövdeleri JSON, yalnız 413 PocketBase'in kendi gövdesi. Kapı 3 (`ok === true`) **tutmaz**: başarı `201 {id, prior_count}`, `ok` alanı yok. Sonuç: site tarafında yeni bir kayıt adaptörü gerekir.
  - `ip_hash` zorunlu (HMAC-SHA256, `IP_HASH_SALT`).
  - `locale` sabit `tr`.
  - 429 ayrıca ele alınmalı.
  - v2 `MAX` sınırları (`route.ts:43`: ad 120 · kulüp 160 · telefon 40 · şube 10 · mesaj 2000) depo sınırlarının (255 · 255 · 64 · 100 · 5000) altında.
- **Karar yazıldı:** `docs/DECISIONS.md` 2026-09-14 "Lead hedefi (yeniden, 2)" (seçenekler, gerekçe, bedel, milestone değişikliği).

**Sorunlar:**
- `TASK-1.11.md` kapanışta 20k token çizgisini aşacaktı (19.4k): 2026-09-13 kaydının 0-6. maddeleri ve soru paketi `TASK-1.11-BUNKER-KESFI.md`'ye bölündü, parent'ta özet + pointer kaldı.

**Kararlar:**
- **Soru 1 + 2 → v1'in PocketBase deposu + site e-postası; Bunker'a yazılmaz.** Kullanıcının yönü "canlı sitenin yazdığı yere, basitçe". Ölçüt (a): depo soğuk hattan kodla ve yedekle kanıtlı ayrık; A/B'nin riski kabul edilmedi. (b): sunucu, Bunker OS, n8n ya da migration işi yok; yerel prova ortamı düşer. (c): hedef tek adaptörün arkasında; alan adı geçişinde talepler aynı depoda süreklilik kazanır.
- **Soru 3 (token yeri) güncellendi:** başlık kararı aynen geçerli, ama başlık v1 sözleşmesinin `X-Lead-Token`'ı. Sır anahtarları v1 adlarıyla: `LEAD_STORE_URL` · `LEAD_STORE_TOKEN` · `IP_HASH_SALT`. `LEAD_WEBHOOK_TOKEN` doğmaz. Ad gerekçesi: alan adı geçişinde v2 v1'in yerini alacak, aynı anahtar adları env taşımasını tek hamle yapar.
- **Soru 4 düştü:** Bunker'a yazılmadığı için canlı Bunker/n8n teyidi gerekmez. Soru 5 de düştü (A/B seçilmedi).
- **Token/aşama eşlemesi (plan girdisi):** v2'nin `main` push'u Vercel **production** env'inde koşar ama aşama `preview`. Alan adı geçişine kadar v2'nin Production env'ine **önizleme** token'ı girer, aksi hâlde test talepleri gerçek `leads`'e düşer.
- Test kriterleri Bunker yolu için yazılmıştı. Seçilen yolda aynı eksenlerle karşılandı: ayaklar kaynağıyla, envanter üç sınıfıyla, üç kapı karşılaştırması, yazma yok, konum/erişim/yedek. Yerel prova girdileri Bunker yolunda yazılıydı; seçilen yolda gereksiz, plan revizyonuna bırakıldı.
- docs/DECISIONS.md'ye eklendi: Evet.

**Son Yaklaşım:** Keşif kapandı. Hedef v1 deposu. Kalan lead task'ları plan revizyonunda yeniden yazılacak.

**Sonraki Adım Detayı:** `/devflow:plan-phase` (revizyon modu) bu kaydı ve DECISIONS 2026-09-14'ü okur. Bakılacaklar:
- TASK-1.17 (yerel n8n + Postgres) düşer ya da "v1 `pocketbase/` salt okunur mount'lu yerel sözleşme ortamı"na döner.
- TASK-1.13 (yerel alıcı kurulumu) alıcı hazır olduğu için düşer.
- TASK-1.14 kayıt adaptörüne döner: `POST /lead`, `X-Lead-Token`, `ip_hash`, 201 okuması, 429 eşlemesi, `segment` yerleşimi, `toWebhook`/Apps Script kalıntısı.
- TASK-1.18 "canlıya taşıma" değil, Vercel env girişine döner (`LEAD_STORE_URL` · önizleme `LEAD_STORE_TOKEN` · `IP_HASH_SALT`). Token değeri kullanıcıdan gelir; v1 Vercel env'i sensitive, sunucuda `/opt/alpfit-lead/`.
- TASK-1.06: uçtan uca turda kayıt `leads_preview`'da görülür.
- TASK-1.15: aktarım/saklama maddesi PocketBase gerçeğiyle hizalanır (DE, 12 ay).
- Milestone cümlesi PHASE-1, DURUM ve PHASES'te değişir.
- `../bunker-dashboard` referansları kalan task'larda anlamsızlaşır.

**Dosya Değişiklikleri:**
- `_dev/tasks/TASK-1.11.md` → bu kayıt, durum ✅, kriter işaretleri, bölme; arşive taşındı
- `_dev/tasks/TASK-1.11-BUNKER-KESFI.md` → yeni; 2026-09-13 keşif detayı ve soru paketi (bölme çocuğu; arşive parent'la taşındı)
- `_dev/tasks/TASK-1.11-ENVANTER.md` → ölçüm zemini pointer'ı yeni kardeşe çevrildi; arşive taşındı
- `_dev/docs/DECISIONS.md` → 2026-09-14 "Lead hedefi (yeniden, 2)"
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` + `_dev/MEMORY.md` → lead deposu adresi ve sözleşme özü, Bunker kanonik yolu, dökümden salt okunur ölçüm yöntemi
- `_dev/BULGULAR.md` → `[TASK-1.11]` kullanıcı kararı satırı cevaplandığı için silindi (karar DECISIONS'a mezun)
- `_dev/DURUM.md`, `_dev/phases/PHASE-1.md` → 1.11 ✅, Adım `plan`

**Test Sonuçları:**
- **Yazma yapılmadığı (kapsam: bu oturumun dokunduğu dış yüzeyler):**
  - v1 reposuna yazılmadı. `git status --porcelain` oturum başında ve sonunda 24 satır; hepsi başka oturumun `.claude/`, `_dev/` ve `.gitignore` değişiklikleri, `api/` ve `pocketbase/` temiz.
  - Bunker OS'a yazılmadı (yalnız grep). Oturum sırasında başka bir oturum commit attı (`9aa4205` → `72a99e8`, yabancı kirli satır 1 → 0). Yeni commit `src`, `migrations` ve `bunker-v2`'ye dokunmadı; `pocketbase|lead.alpfitplus` araması yeni HEAD'de de 0.
  - Canlı sistemlere tek istek kimliksiz `GET lead.alpfitplus.com/api/health` (200).
  - Döküm salt okunur (`:ro`) bağlandı, ağsız konteyner `--rm`; çıktı yalnız sayım.
- **Regresyon:** kod değişikliği yok; `docker compose exec web npm test` → 3 dosya, 43 test, TÜMÜ PASS (2026-09-14).
- **Test kriterleri (seçilen yol):**
  - Ayaklar kaynağıyla: ✅
  - Envanter üç sınıf: ✅
  - Üç kapı karşılaştırması: ✅, site adaptörü gerekir
  - Yazma yok: ✅
  - Konum/erişim/yedek: ✅; depo erişimi superuser paneli, yedek 7 gün + sunucu DB yedeğinden bağımsız
  - Yerel prova girdileri: Bunker yolu için ✅, seçilen yolda plan revizyonuna
  - Kullanıcı onayı: ✅, yön verilerek devredildi; karar DECISIONS'ta

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-14

**Ne Yapıldı:**
- Bunker'a giriş yolları ölçüldü (`TASK-1.11-BUNKER-KESFI.md`, `TASK-1.11-ENVANTER.md`). Kullanıcı "canlı sitenin yazdığı yere, basitçe" dedi.
- Hedef v1'in PocketBase deposu (`lead.alpfitplus.com`) oldu: soğuk otomasyondan kodla ve yedekle ayrık, sunucu işi yok. Karar DECISIONS 2026-09-14.
- Site tarafında yeni kayıt adaptörü gerekir (`ok:true` kapısı tutmuyor). Lead task zinciri plan revizyonuna gitti.

**Öğrenilenler:**
- Seçenek listesi yazılmadan önce "canlı sistem bugün bunu nasıl yapıyor" sorusu ölçülmeliydi. v1'in iki aydır çalışan deposu hiçbir v2 dokümanında geçmiyordu.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu)
