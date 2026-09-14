# TASK-1.18: Canlı depo bağlantısı — Vercel env ve token → koleksiyon teyidi

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`) · altyapı M7
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.14 ✅ (site depo adaptörüyle yerelde kanıtlı)

---

## Hedef

Sitenin depo adaptörünü canlı depoya (`https://lead.alpfitplus.com`) bağlayacak env değerlerini Vercel'e girdirmek. Girilen token'ın gerçekten **önizleme koleksiyonuna** (`leads_preview`) yazdığını tek bir test isteğiyle kanıtlamak. Kapsam:

- `LEAD_STORE_URL`, `LEAD_STORE_TOKEN` (önizleme token'ı) ve `IP_HASH_SALT` → `alpfitplus-web-v2`, Production + Preview.
- Canlı depoya kayıt yazmayan kimliksiz teyit.
- Yerel geliştirme sunucusundan canlı depoya **tek** test talebi. Kaydın `leads_preview`'da, `leads`'te olmadığı panelde görülür.

Task şu koşullar sağlandığında tamamlanmış sayılır:

- Üç anahtar Vercel'de iki ortamda da tanımlı (adla doğrulandı).
- Test talebi `stored:true` döndü ve panelde önizleme koleksiyonunda görüldü.
- Gerçek talep koleksiyonuna (`leads`) hiçbir şey yazılmadı.

---

## Bağlam

**2026-09-14 plan revizyonuyla yeniden yazıldı.** Eski hâli alıcıyı canlı sunucuya taşıyor, otomasyon izolasyonunu çalışma zamanında ölçüyordu. Yeni hedefte ikisi de yok. Depo iki aydır canlıda (2026-07-27). Soğuk otomasyondan ayrık olduğu kodla ve yedekle gösterildi (`docs/DECISIONS.md` 2026-09-14 → Gerekçe (a)). **Bu task sunucuya yazmaz.** v1'in reposuna, deposunun kodlarına ve Vercel projesine de dokunmaz.

Tek gerçek risk token'dır. v2'nin `main` push'u Vercel **production** ortamında koşar ama aşaması `preview`'dır (TASK-1.01). Production env'ine üretim token'ı girilirse önizlemedeki her test talebi v1'in gerçek taleplerinin durduğu `leads`'e düşer. Kural bu yüzden: alan adı geçişine (M7 F7.5) kadar **iki ortama da önizleme token'ı** (TASK-1.11 → Oturum 2026-09-14 → Kararlar).

Token koleksiyonu gövdeden değil kendisinden seçer. API bu yüzden hangi koleksiyona yazıldığını söylemez: `201` iki koleksiyonda da aynıdır. Ayrımın tek kanıtı panel ya da superuser okumasıdır. Kriterin kanalı bu yüzden UAT.

**Devralınan kriter:** TASK-1.05'in canlı alıcıya bağlı kriteri ("gerçek alıcıya giden talep kayda düşer ve `env` alanı `local` yazar") bu task'ındır. Yeni depoda karşılığı "kayıt `leads_preview`'da, `env=preview`"dir. Gerekçe TASK-1.14 → Dikkat Noktaları.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.14.md` → Oturum Kaydı — adaptörün env anahtarları ve Karar Noktaları sonuçları
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` → Lead deposu, Sırlar
- `_dev/memory/vercel-proje-kimlikleri.md` — CLI erişimi, proje ve takım
- `../Alpfitplus-website.v1/pocketbase/README.md` → Sırlar, Uç nokta sözleşmesi (salt okunur)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi; canlı teyit sonucu → Ölçümler
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — v2 env'inin kurulu olduğu, token değerinin kaynağı (değer değil konum), `IP_HASH_SALT` kararı

---

## Alt Görevler

- [x] **1. Değerlerin kaynağını kullanıcıyla netleştir**
  - `LEAD_STORE_URL` sır değil: `https://lead.alpfitplus.com`
  - `LEAD_STORE_TOKEN`: canlı depodaki `LEAD_TOKEN_PREVIEW`. Değer kullanıcıda: parola yöneticisi, sunucuda `/opt/alpfit-lead/.env` ya da v1 Vercel projesinin Preview env'i. Oturum değeri görmez
  - `IP_HASH_SALT`: Karar Noktası

- [x] **2. Vercel env'i girilir**
  - Kullanıcı girer, ya da açık izniyle oturum `vercel env add` ile değeri ekrana basmadan ekler (TASK-1.07 emsali). Kapsam: `alpfitplus-web-v2`, Production + Preview. Development gerekmez
  - Oturum `vercel env ls` ile adları doğrular
  - Ayrıca redeploy tetiklenmez; ama projede Ignored Build Step yok ve her push dağıtır (ölçüldü 2026-09-14). Bu task'ın kapanış push'u env'li ilk dağıtımdır, bu yüzden giriş panel teyidinden sonra yapılır. Önizleme adresindeki ilk e-postalı gerçek tur TASK-1.06'nın

- [x] **3. Canlı depoyu kayıt yazmadan yokla**
  - `GET https://lead.alpfitplus.com/api/health` → 200
  - Token'sız `POST /lead` (sahte gövde) → `401 {"error":"unauthorized"}`. Rota yüklü, token kapısı açık, kayıt yok (v1 README → "Dağıtım sonrası hızlı kontrol")

- [x] **4. Tek test talebi: token → koleksiyon**
  - Yerel `.env` geçici olarak canlı `LEAD_STORE_URL` + önizleme token'ı + `IP_HASH_SALT`, sonra `docker compose restart web`. Değerler basılmaz
  - `/demo` formundan (araştırma konteyneri) **bir** talep: ad `TASK-1.18 test`, kulüp `Test Kulüp`, e-posta `test@example.com`, gerçek kişi verisi yok → başarı ekranı, uç `stored:true`
  - Kullanıcı `https://lead.alpfitplus.com/_/` panelinde kaydı `leads_preview`'da görür ve `leads`'te **olmadığını** teyit eder. Kanal UAT
  - Yerel `.env` sonra yerel depo değerlerine geri döner (`LEAD_STORE_URL=http://lead-store:8090`), `docker compose restart web`. **Geri dönüş teyidi zorunlu**: unutulursa yerel geliştirme her denemede canlı depoya yazar

- [x] **5. Test kaydının akıbeti**
  - Kayıt önizleme koleksiyonunda ve 12 ay sonra saklama cron'uyla silinir. Kalsın mı panelden silinsin mi **kullanıcıya sorulur**; silme superuser işidir, oturum yapmaz

---

## Etkilenen Dosyalar

```
_dev/
├── phases/PHASE-1.md                          # canlı teyit sonucu → Ölçümler — zaten var
└── memory/kendi-sunucu-n8n-bunker-umami.md    # v2 env kurulumu, token kaynağı, tuz kararı — zaten var
```

> Kod değişikliği yok. Yerel `.env` gitignore'ludur ve task sonunda yerel depo değerlerine döner.

---

## Dikkat Noktaları

- **Üretim token'ı bu fazda hiçbir yere girilmez.** Production env'i dâhil. Yanlış token hatası sessizdir: `201` iki koleksiyonda aynı. Ayrımın tek kanıtı panel (alt görev 4).
- **Canlı deponun hız sınırı `ip_hash` başına saatte 5.** Bu task tek istek atar. Tekrar gerekirse aynı saatte beşi geçilmez, v1'in gerçek ziyaretçileri etkilenmez (ayrı `ip_hash`).
- **Sır hijyeni:** token ve tuz task dokümanına, commit'e, sohbete ya da loga yazılmaz. `vercel env ls` değer basmaz; `vercel env pull` **kullanılmaz** (değerleri diske döker).
- **v1 dokunulmaz:** v1'in Vercel projesi `alpfitplus-website` açılmaz, env'i değiştirilmez. Değer oradan okunacaksa bunu kullanıcı yapar.
- **Canlı depo v1'in üretim talebini de tutuyor.** Beklenmeyen bir yanıt (`500`, `413`, HTML) görülürse tekrar denenmez, dur ve sor.
- Kanal notu: alt görev 3 ve 4'ün kriterleri canlı serving zinciri ve canlı panel katmanındadır. Yerel koşucu ve CI göremez.

---

## Test Kriterleri

- [x] `vercel env ls`: `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` Production **ve** Preview'de var, değer basılmadan — kanal: UAT
- [x] Canlı `GET /api/health` → 200 ve token'sız `POST /lead` → `401 {"error":"unauthorized"}` — kanal: UAT
- [x] Yerelden (dev, 3000) canlı depoya gönderilen tek test talebi → uç `200 stored:true`; kayıt panelde `leads_preview`'da, `env=preview`, alanlar doğru eşlenmiş; `leads`'te aynı kayıt yok (TASK-1.05'ten devralınan) — kanal: UAT
- [x] Yerel `.env` task sonunda yerel depoya dönmüş: `docker compose exec web` içinden bir test talebi yerel `lead-store` kaydı üretiyor; canlı panelde ikinci kayıt yok — kanal (panel ayağı): UAT
- [x] Task dokümanı, commit ve `_dev/` altında token ya da tuz değeri yok (`git diff` + `grep` ile)

---

## Karar Noktaları

- **`IP_HASH_SALT` değeri:** (a) v1'in canlı değeriyle aynı, (b) v2 için yeni rastgele (`openssl rand -hex 32`). **Önerilen: (b) bugün, (a) alan adı geçişinde.** v2 bugün yalnız önizleme koleksiyonuna yazıyor, v1'le ortak sayaç ya da `prior_count` sürekliliği gerekmiyor. v1'in sırrı yeni bir projeye kopyalanmamış olur. Alan adı geçişinde v2 v1'in yerini alınca aynı tuz, `ip_hash` sürekliliğini korur; o fazın env taşıma listesine not düşülür. Kullanıcıya teyit ettirilir.

---

## Risk ve Geri Dönüş Planı

- **Yanlış token (üretim) girilirse** → alt görev 4'te test kaydı `leads`'te görülür. Env hemen önizleme token'ıyla değiştirilir, kayıt kullanıcıya bildirilir (silme superuser işi). Önizleme dağıtımı henüz yeni env'i almadığı için gerçek talep akmamıştır.
- **Rollback:** Vercel'de üç anahtar kaldırılır. Uç bugünkü "kayıt yok → e-posta ya da 503" davranışına döner. Yerel `.env` yerel depoya döner.

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
- **Alt görev 1 ✅ — değerlerin kaynağı:**
  - `LEAD_STORE_URL` = `https://lead.alpfitplus.com`.
  - Token yerel `.env`'de `T118_LIVE_PREVIEW_TOKEN` adıyla duruyordu. Kullanıcı canlı `LEAD_TOKEN_PREVIEW` olduğunu teyit etti.
  - Oturum değeri basmadan ölçtü: tek satır, 64 küçük hex, CR/tırnak yok; yerel `LEAD_TOKEN_PREVIEW`, `LEAD_TOKEN_PRODUCTION`, `LEAD_STORE_TOKEN` ve `IP_HASH_SALT` değerlerinin hiçbirine eşit değil.
  - `IP_HASH_SALT` → Karar Noktası (b).
- **Alt görev 2 ✅ — Vercel girişi (oturum, yol B):**
  - `LEAD_STORE_URL` `--no-sensitive`; `LEAD_STORE_TOKEN` (`.env` satırından `awk` borusuyla) ve `IP_HASH_SALT` (`openssl rand -hex 32` borusuyla) `--sensitive`. Üçü de `production,preview`, çıkış kodları 0.
  - `vercel env ls`: `IP_HASH_SALT` Secret · `LEAD_STORE_TOKEN` Secret · `LEAD_STORE_URL` Config, üçü Production + Preview.
  - Giriş canlı DB teyidinden **sonra** yapıldı.
- **Alt görev 3 ✅ — kayıt yazmadan yoklama (2026-09-14T19:16Z):** `GET /api/health` → `200 {"message":"API is healthy."}`; token'sız `POST /lead` → `401 {"error":"unauthorized"}`. `web` konteynerinden canlıya `GET /api/health` → 200, 170 ms.
- **Alt görev 4 ✅ — token → koleksiyon:**
  - **Canlıya çevirme:** `.env`'de `LEAD_STORE_URL` canlı, `LEAD_STORE_TOKEN` ≡ `T118_LIVE_PREVIEW_TOKEN` (eşitlik ölçüldü); `restart web`.
  - **Talep (2026-09-14T20:09:01Z):** `/demo` formundan (Playwright, araştırma konteyneri) ad `TASK-1.18 test`, kulüp `Test Kulüp`, e-posta `test@example.com`. Sonuç `200 {"ok":true,"stored":true,"mailed":false}`, 358 ms, başarı ekranı, tek API çağrısı, konsol hatası 0.
  - **Canlıya gittiğinin kanıtı:** yerel `leads_preview` sayımı önce 57, sonra 57; yerelde `TASK-1.18 test` 0.
  - **Yerele geri dönüş:** URL satırı `http://lead-store:8090` (tam eşleşme), token ≡ yerel `LEAD_TOKEN_PREVIEW`; `restart web`. `docker compose exec web` içinden `TASK-1.18 geri donus` talebi → `200 stored:true`, yerel sayım 58 (`env=preview`). Geçici yerel superuser `t118@local.test` silindi.
  - **Panel teyidi — canlı DB salt-okunur okuma (~20:25Z):** kullanıcı panele bakamadı ve oturumdan istedi; orkestratörün sınırı sunucuda yazma yok, PII yalnız test kaydı.
    - Hostta `sqlite3` CLI yok; `python3 -B -` (stdlib sqlite 3.45.1) kullanıldı.
    - `data.db` WAL modunda (başlık 2/2), `-wal`/`-shm` yok. `immutable=1` + `query_only` ile açıldı; önce/sonra `-wal`/`-shm` yok, `mtime`/boyut aynı.
    - `leads_preview`'da `dlylws34jfamhxc`: `env=preview`, `club=Test Kulüp`, `email=test@example.com`, `phone` boş, `branches=1`, `locale=tr`, `notify_team=failed`, `notify_lead=pending`, `ip_hash` 64 hex, `created 20:09:03.357Z`.
    - `leads`: bugün 0, `TASK-1.18%` 0, `test@example.com` 0 (toplam 2, yalnız sayım). Canlıda `geri donus`/`prova` 0.
  - **İki canlı talep:** "tek istek" kriteri toplamda **iki** canlı talep oldu. Önceki oturum `abd5f352` (TASK-1.14'ü yapan oturum) aynı testi 16:48:16Z'de kayıt ve commit bırakmadan koşmuş: `2ojox2q25en90y9`, `leads_preview`, alanlar birebir aynı.
    - Kaynağın kanıtı: `alpfitplus-web-dev` logunda 16:48:05Z restart → 16:48:16Z `POST /api/demo 200` (292 ms) → 16:48:29Z restart → 16:48:31Z yerel talep. Aynı oturumun scratchpad'inde `t118/demo-submit.mjs`, `env-switch.py`, `local-count.sh`; transkripti 16:48:33Z'de bitiyor.
    - O oturumun Vercel'de izi yok: giriş öncesi `vercel env ls` boştu.
    - İki bağımsız talep de önizleme koleksiyonuna düştü, bu token → koleksiyon eşlemesini güçlendiriyor.
- **Alt görev 5 ✅ — test kayıtlarının akıbeti:** iki kayıt da kalıyor. Orkestratör kararı (a), kullanıcıya bildirildi: silme canlıya superuser yazması olur, 12 aylık cron siler.
- **Geçici token satırı:** `T118_LIVE_PREVIEW_TOKEN` yerel `.env`'den silindi. Kalan beş anahtar ve yerel değerler doğrulandı; ardından `restart web` ile dev sürecinin env'inde anahtar kalmadığı ölçüldü.
- **Kapanış yazımları:**
  - `memory/kendi-sunucu-n8n-bunker-umami.md`: Vercel env kurulumu, token kaynağının konumu, tuz; panel yerine salt-okunur DB teyit yolu. `MEMORY.md` kancası güncellendi.
  - `modules/M7-Yayin-ve-Altyapi.md` → F7.5 env taşıma listesi.
  - `PHASE-1.md` → Ölçümler.
- **Tur kayıtları (orkestratör brief'i):**
  - `BULGULAR.md` Gelen Kutusu'na UI 🔴 bulgularını faza alma önerisi satırı düştü; satır DECISIONS 2026-09-13 seçimine işaret ediyor.
  - `docs/DECISIONS.md`'ye «Umami site kaydı» kararı yazıldı; `PHASES.md` → Alan adı geçişi satırı ona bağlandı.
  - Önerilen ikinci satır (F7.5 "M6 F6.3 yeşil" bağımlılığı) yazılmadı: DECISIONS 2026-09-13 ve `PHASES.md` bu bağımlılığın "faza girerken güncellenir" olduğunu zaten yazıyor.

**Sorunlar:**
- **Önceki oturumun kayıtsız canlı testi:** kaynağı ölçüldü (yukarıda). Canlıdaki etkisi tek önizleme kaydı. Kalıcı kayıt bu task kaydı ve `PHASE-1.md` → Ölçümler; ayrıca Gelen Kutusu satırı açılmadı, çünkü triyaj bekleyen iş kalmadı.
- **İlk turdaki ölçüm kör noktası:** anahtar listesi regex'i (`^[A-Za-z_]+=`) rakam içeren `T118_…` adını gösteremedi. Düzeltilmiş desenle (`^[A-Za-z_][A-Za-z0-9_]*=`) yeniden ölçüldü.

**Kararlar:**
- **`IP_HASH_SALT` → (b) v2'ye özel yeni rastgele** (duran yetki, task önerisi): v1'le ortak sayaç gerekmiyor ve v1'in sırrı kopyalanmıyor. Değer boru içinde kaldı, hiçbir yerde saklanmadı. Alan adı geçişinde v1'in değeri girer (M7 F7.5 listesi).
- **Sıra: yerel test → canlı teyit → Vercel → push.** Task Vercel'i testten önce koyuyordu; bu sırayla yanlış token Vercel'e ve dağıtıma hiç ulaşmaz.
- **"Push/redeploy yapılmaz" cümlesi ölçümle hizalandı:** projede Ignored Build Step yok, her push dağıtıyor. Kapanış push'u env'li ilk dağıtım; önizleme formu `leads_preview`'a yazar, e-posta 1.06'ya kadar yok. Orkestratör kararı (a), kullanıcı itiraz etmedi.
- **Canlı DB'de `immutable=1`:** `mode=ro`, `-wal`/`-shm` yokken bu dosyaları yaratabilir, bu da yazma olur. WAL dosyası olmadığı için `immutable` veri kaçırmadı; önce/sonra `stat` ile doğrulandı.
- **`T118_LIVE_PREVIEW_TOKEN` satırı silindi** (duran yetki): değerin okunabilir kopyası sunucuda ve parola yöneticisinde duruyor; 1.06 önizleme adresinden Vercel env'iyle koşuyor. Satırın kalması yerel dev'in yanlışlıkla canlıya çevrilmesini kolaylaştırırdı.
- docs/DECISIONS.md'ye eklendi: **Evet** — «Umami site kaydı» (kullanıcı yönü, orkestratör brief'i). Tuz kararı sözleşme bırakmadığı için memory ve M7'de.

**Kalan İşler:** Yok. Önizleme adresinden ilk gerçek tur (depo + e-posta) ve Vercel'deki token değerinin serving zincirindeki kanıtı TASK-1.06'nın kapsamı.

**Son Yaklaşım:** N/A — task tamamlandı.

**Sonraki Adım Detayı:** N/A — sıradaki task TASK-1.06. Kriterindeki "kullanıcı panelde görür" kanalı yerine salt-okunur DB yolu `memory/kendi-sunucu-n8n-bunker-umami.md`'de.

**Dosya Değişiklikleri:**
- `_dev/tasks/TASK-1.18.md` → oturum kaydı; alt görev 2'deki push cümlesi ölçümle hizalandı (arşive taşındı)
- `_dev/DURUM.md`, `_dev/phases/PHASE-1.md` → 1.18 ✅, aktif task 1.06, Ölçümler tablosu
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md`, `_dev/MEMORY.md` → Vercel env kurulumu, salt-okunur DB teyit yolu, kanca
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 env taşıma listesi
- `_dev/docs/DECISIONS.md` → «Umami site kaydı»; `_dev/PHASES.md` → Alan adı geçişi satırı; `_dev/BULGULAR.md` → Gelen Kutusu satırı
- `.env` (yerel, gitignore'lu) → `T118_LIVE_PREVIEW_TOKEN` satırı silindi, `LEAD_STORE_*` yerel değerlerde
- Vercel `alpfitplus-web-v2` → `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` (Production + Preview)

**Test Sonuçları:**
- **Canlı yoklama:** `health` 200 · token'sız `POST /lead` 401 JSON. Kapsam yalnız kayıt yazmayan uçlar.
- **Canlı talep:** yerel dev → canlı URL + önizleme token'ı → `200 stored:true`. Canlıya gidişin kanıtı yerel sayımın 57/57 kalması.
- **Token → koleksiyon:** canlı `data.db` okuması; kayıt `leads_preview`'da, `leads`'te 0. Kapsam: yerelden gönderilen talep. Vercel'e girilen değerin serving zincirinde doğru okunması **ölçülmedi** (sensitive değer geri okunamaz, dağıtım bu commit'le başlar) → TASK-1.06.
- **Geri dönüş:** `web` içinden talep → yerel sayım 58; canlıda `geri donus` 0 ve 20:09:03Z sonrası kayıt yok.
- **Vercel:** `vercel env ls` → üç anahtar × Production + Preview; değer basılmadı.
- **Regresyon:** `docker compose exec web npm test` → 3 dosya/53 PASS + 1 skipped (sözleşme paketi env'siz atlandı), çıkış 0. Kod değişikliği yok.
- **Sır taraması:** commit öncesi `git diff --cached` + çalışma ağacı değişen dosyalarda 32+ hex eşleşme 0; yerel token/tuz değerlerinin diff'te geçmediği eşitlikle (değer basmadan) ölçüldü.
- **Kapı sınaması:** bu task yeni bir kapı üretmedi, madde düşer. `envswap.sh`'ın ön koşul kapısı yardımcı bir betik; sahte değerli kopyada bozuk girdiyle (token yok, yerel token'la aynı, geçersiz mod) kırmızısı görüldü.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-14

**Ne Yapıldı:**
- v2'nin Vercel projesine canlı lead deposu env'i (URL, önizleme token'ı, v2'ye özel tuz) Production + Preview olarak girildi; değerler hiçbir çıktıya düşmedi.
- Token'ın önizleme koleksiyonuna yazdığı canlı DB'nin salt-okunur okumasıyla kanıtlandı: iki bağımsız talep de `leads_preview`'da, `leads` temiz. Yerel ortam geri döndü.
- Alan adı geçişinin env taşıma listesi (üretim token'ı, v1 tuzu, v1 Umami kaydı) M7 F7.5'e yazıldı.

**Öğrenilenler:**
- Kullanıcı panel adımını yapamayınca canlı teyit, sunucuya yazmadan SSH + `immutable=1` okumasıyla alınabildi. WAL dosyası yokken `mode=ro` yazma riski taşıdığı için bu ayrım önemli.
- Kayıt bırakmadan biten bir oturum canlıda iz bırakabilir. Dış sisteme yazan task başında hedefte önceki izleri saymak, sonradan şaşırmayı önler.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — alıcıyı canlıya taşıma yerine hazır deponun env bağlantısı ve token teyidi)
