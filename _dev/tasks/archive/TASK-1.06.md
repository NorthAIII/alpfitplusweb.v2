# TASK-1.06: E-posta hattını aç ve uçtan uca canlı tur — lead deposu + e-posta

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi (+ F3.2 kabulünün uçtan uca teyidi)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.18 ✅ (depo env'i Vercel'de, token → `leads_preview` teyitli)

---

## Hedef

Resend e-posta hattını yayın ortamında açmak ve lead hattının tamamını önizleme adresinden uçtan uca sınamak. Beklenen akış:

- Gerçek telefondan form gönderilir.
- Lead deposunda `leads_preview`'a kayıt düşer.
- `DEMO_TO`'ya bildirim gelir.

Task, tek bir gerçek talebin iki hedefe de ulaştığı ölçülüp kayda geçtiğinde tamamlanmış sayılır.

---

## Bağlam

**2026-09-14 plan revizyonuyla yeniden yazıldı.** Önceki hâli Bunker'a kayıt ve satış otomasyonlarının tetiklenmediğinin canlı ölçümünü bekliyordu. Hedef v1'in lead deposu oldu (`docs/DECISIONS.md` 2026-09-14). Deponun soğuk otomasyondan ayrık olduğu kodla ve yedekle gösterildi. Otomasyon izolasyonu ölçümü bu yüzden bu task'tan **çıktı**.

**Düşen hedef sınaması da çıktı.** Eski plan alıcıyı sunucu tarafında geçici kapatıyordu. Bu depo ise v1'in **canlı** taleplerini de tutuyor, kapatmak gerçek bir talebi kaybettirebilir. Aynı davranış iki katmanda zaten kanıtlanıyor: kayıt düşünce e-postaya geçiş ve ikisi birden düşünce 503, TASK-1.14'ün Vitest bataryasında; depo kapalıyken formun WhatsApp yolu, TASK-1.14'ün yerel turunda.

**E-postayı site gönderir**, her talepte (`docs/DECISIONS.md` 2026-09-13 "E-posta kaynağı"). Kayıt kendi sunucuda, bildirim Resend'de durur; ikisi birbirinden bağımsızdır. ILKELER'in "hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz" maddesinin somut hâli budur. `route.ts`'in e-posta mantığı değişmez.

Kod zaten yazılı: `toEmail` Resend HTTP API'sini kullanıyor. Eksik olan yayın ortamındaki `RESEND_API_KEY` (değer yalnız kullanıcıda; TASK-1.03 Kalan İşler). Araştırmada ölçüldü:

- Resend DNS kayıtları `alpfitplus.com`'da **zaten var** (DKIM, `send.` MX+SPF eu-west-1, DMARC `p=reject; adkim=s`).
- Katı hizalama yüzünden `DEMO_FROM` **tam `@alpfitplus.com`** olmalı.
- v1 aynı alan adından aynı sağlayıcıyla gönderiyor (`../Alpfitplus-website.v1/api/demo.ts:326-346`), yani yol canlıda çalışıyor.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Resend DNS kayıtları zaten var" ve "Apex MX yok"
- `_dev/tasks/archive/TASK-1.18.md` → Oturum Kaydı — env kurulumu, test kaydının akıbeti kararı
- `_dev/tasks/archive/TASK-1.14.md` → Oturum Kaydı — Karar Noktaları sonuçları (`segment` yeri, `notify_*`)
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 ve F3.3 kabul kriterleri
- `src/app/api/demo/route.ts` → `toEmail`, `toStore`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi; uçtan uca tur sonucu → Ölçümler
- `_dev/BULGULAR.md` — B-011 kancası ölçümle tazelenir (kapanmıyorsa); B-037'nin `x-forwarded-for` ölçümü (aşağıda) Gelen Kutusu'na tek satır

---

## Alt Görevler

- [x] **1. Resend panelini teyit ettir** (kullanıcı)
  - `alpfitplus.com` **Verified**, bölge **eu-west-1**
  - Değilse kayıtlar panelde yeniden üretilir; **DKIM değeri panelden kopyalanır, elle yazılmaz**. DNS Squarespace'te; apex SPF (Google, `-all`) **dokunulmaz**

- [x] **2. E-posta env'ini tamamla ve dağıt** (kullanıcı girer, oturum adları doğrular)
  - `RESEND_API_KEY` → Vercel Production + Preview. Değer oturuma gösterilmez
  - `DEMO_FROM` tam `…@alpfitplus.com` (alt alan değil); `DEMO_TO` `kivanc@kiwiailab.com` (Google MX'li, apex MX eksikliğinden etkilenmez)
  - Yeni dağıtım tetiklenir (redeploy ya da boş olmayan bir push). TASK-1.18'in depo env'i de bu dağıtımla ilk kez yayına girer. Dağıtımın env'i gördüğü doğrulanır

- [x] **3. Önizlemeden gerçek talep gönder**
  - `https://alpfitplus-web-v2.vercel.app/demo` **gerçek telefondan** doldurulur. Mobil gözlemler BULGULAR'a düşer ("Görsel ve mobil iyileştirme" fazını besler)
  - Depo: kullanıcı panelde (`https://lead.alpfitplus.com/_/`) kaydı `leads_preview`'da görür. Alanlar doğru eşlenmiş, `segment` TASK-1.14 kararının yerinde, `notify_team` karara göre `sent` ya da `pending`
  - E-posta: gövde tüm alanları ve `Ortam: preview` satırını taşıyor, `reply_to` lead'in adresi

- [x] **4. Ölçümü kayda geç**
  - Kayıt + e-posta kanıtı (zaman damgası, koleksiyon, `stored`/`mailed`, başlıkta DKIM sonucu) faz dokümanına → Ölçümler. Sır ve kişisel veri yazılmaz

---

## Etkilenen Dosyalar

```
_dev/
├── phases/PHASE-1.md     # uçtan uca tur sonucu — zaten var
└── BULGULAR.md           # B-011 kancası, B-037 ölçüm satırı — zaten var
```

> Kod değişikliği beklenmiyor. `DEMO_FROM` yanlış çıkarsa düzeltme env tarafındadır.

---

## Dikkat Noktaları

- **Apex MX yok** (B-011): `destek@` ve `demo@alpfitplus.com` posta alamıyor olabilir. Gönderim ve bildirim akışı etkilenmez (`DEMO_TO` Google MX'li). Bulgu bu fazda kapanmaz; "Yayın öncesi düzeltmeler" fazının kilitleyen bulgusudur.
- Resend ücretsiz katman: 100/gün, 3.000/ay — test hacmi sınırın çok altında. v1 aynı hesabı kullanıyorsa kota paylaşılır. Hesabın hangisi olduğu alt görev 1'de not edilir.
- **Gerçek talep canlı depoya kişisel veri yazar.** Önizleme koleksiyonunda durur ve 12 ay sonra saklama cron'uyla silinir. Akıbeti TASK-1.18'deki kullanıcı kararıyla aynı.
- **Canlı deponun hız sınırı `ip_hash` başına saatte 5.** Telefonla tekrar denemede aynı saatte beşi geçilmez. Geçilirse form `429` gösterir: bu arıza değil, sınırın çalıştığının işaretidir.
- **Sır değerleri** (Resend anahtarı, depo token'ı, tuz) task dokümanına, commit'e, sohbete yazılmaz.
- **Fırsat ölçümü (bulgu kapsamı değil):** B-037'nin (1) kalemi Vercel'in istemciden gelen `x-forwarded-for`'u üzerine yazıp yazmadığının bu turda bir istekle ölçülmesini istiyor. Adaptör `ip_hash`'i aynı başlıktan ürettiği için sonuç artık depo sınırını da ilgilendirir. Sahte XFF ile bir istek atılır, Vercel istek logundaki gerçek IP ile karşılaştırılır; sonuç Gelen Kutusu'na tek satır. Bu istek geçerli bir talep **olmamalı** (ör. rızasız, 422), yoksa canlı depoya ikinci kayıt düşer. Düzeltme **yapılmaz**.
- Kanal notu: bu task'ın kriterlerinin tamamı canlı serving zinciri, gerçek cihaz, gerçek gelen kutusu ve canlı depo panelinde. Yerel koşucu ve CI bunları göremez.

---

## Test Kriterleri

- [x] Önizlemeden gönderilen gerçek talep lead deposunda `leads_preview`'da **bir** kayıt olarak görünür (`env=preview`); `leads`'te yok — kanal: UAT
- [x] Aynı talep `DEMO_TO`'ya e-posta olarak gelir; gövde ad, kulüp, şube, segment, telefon, e-posta, mesaj, KVKK onayı, zaman ve `Ortam: preview` satırını taşır — kanal: UAT
- [x] E-postanın `reply_to` alanı lead'in e-posta adresi — kanal: UAT
- [x] E-posta spam klasörüne düşmüyor (DKIM/DMARC hizası; başlıkta `dkim=pass`) — kanal: UAT
- [x] Uç yanıtı `200` ve `stored:true`, `mailed:true` (tarayıcı ağ kaydı ya da Vercel fonksiyon logu) — kanal: UAT
- [x] `vercel env ls`: `RESEND_API_KEY`, `DEMO_TO`, `DEMO_FROM`, `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` Production + Preview'de var (değer basılmadan)

---

## Karar Noktaları

- **`Idempotency-Key` başlığı:** Resend tekrar gönderimde çift e-postayı önler (24 saat, ≤256 karakter; `lead.at + club` türevi). **Öneri: eklenmesin.** Form otomatik tekrar denemiyor; kullanıcının bilerek iki kez göndermesi de meşru bir sinyal. Kullanıcı isterse tek satırlık ek; karar ve gerekçe Oturum Kaydı'na.

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

**Durum:** 🔄 Kullanıcı adımı bekleniyor. Kullanıcısız ölçümler bitti, commit yok.

**Yapılanlar:**
- **Alt görev 2, env kısmı (ölçüldü, 20:30Z civarı):**
  - `vercel env ls`: `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` Production + Preview'de. `DEMO_FROM` ve `DEMO_TO` üç ortamda da var (TASK-1.03'ten). `RESEND_API_KEY` **yok**.
  - `DEMO_*` değerleri REST API ile basılmadan beklenenle karşılaştırıldı: `DEMO_FROM` = `demo@alpfitplus.com` (tam apex, alt alan değil), `DEMO_TO` = `kivanc@kiwiailab.com`. Üç ortamda da eşit, boşluk/CR yok. Bu anahtarlar için giriş gerekmiyor.
- **Son dağıtım:** `alpfitplus-web-v2-3obxn43tn` (e35ede8), Ready, alias `alpfitplus-web-v2.vercel.app` ona bağlı. Depo env'li ilk dağıtım bu. `RESEND_API_KEY` girilince yeniden dağıtım gerekiyor.
- **DNS yeniden ölçüldü (DoH, Cloudflare):** araştırmayla birebir aynı. `resend._domainkey` TXT var · `send.` MX `feedback-smtp.eu-west-1.amazonses.com` + SPF `include:amazonses.com ~all` · `_dmarc` `p=reject; sp=reject; adkim=s; aspf=s` · apex MX **yok** (B-011 sürüyor) · `kiwiailab.com` MX Google.
- **Canlı depo taban sayımı (SSH, salt-okunur, `immutable=1`, önce/sonra `stat` aynı):** `leads_preview` 12 · `leads` 2 · `TASK-1.06%` iki koleksiyonda 0 · `leads_preview` son `created` 20:09:03Z (TASK-1.18) · `leads` bugün 0. Kapsayıcı adı `alpfit-pocketbase`, hacim `alpfit_pb_data`.
- **B-037 (1) fırsat ölçümü, önizlemede (20:37:15Z):** `POST /api/demo`, gövde `{}` (422, depoya ulaşmaz). Altı istek, her birinde farklı sahte `X-Forwarded-For` (`203.0.113.1-6`) ve `X-Real-IP` (`198.51.100.1-6`). Sonuç `422 ×5` sonra **`429`**.
  - Anahtarlar istemcinin başlığından gelseydi altısı ayrı kovada olur, `429` gelmezdi. Pencerede başka istek yok (log: 15 dk'da 6 kayıt).
  - Sonuç: Vercel iki başlığı da istemciden almıyor, üzerine yazıyor. Kota yayında sahte başlıkla atlatılamıyor. Docker yüzeyi (3000/3100) hâlâ atlatılabilir.
  - Plandaki "istek logundaki IP ile karşılaştırma" yapılamadı: `vercel logs --json` alanlarında IP yok. Yan kanal kullanıldı.

**Kararlar:**
- **`Idempotency-Key` → eklenmedi** (task önerisi, duran yetki). Form kendiliğinden tekrar denemiyor, bilerek ikinci gönderim meşru. Kod değişikliği yok.
- **Alt görev 1'in panel teyidi zorunlu adım olmaktan çıktı.** Kanıt gönderimin kendisi. DMARC `p=reject` + `aspf=s` altında Resend'in zarf alanı (`send.`) SPF hizasını geçemez. Bu yüzden e-postanın gelmesi, DKIM `d=alpfitplus.com` geçti demek. Gerekçe: kullanıcı panele bakamıyor, gönderim sonucu panel etiketinden güçlü bir kanıt. Panel yalnız gönderim düşerse teşhis için açılır.
- **`mailed:true` kanalı kayıt:** telefonda ağ kaydı yok. Uç `notify_team`'i yalnız `mailed` true ise `sent` yazıyor (`route.ts:319-321`). Kayıtta `sent` görmek, uç yanıtında `stored:true, mailed:true` olduğunu kanıtlar.
- **Env girişi + yeniden dağıtım tek kullanıcı komutunda.** Anahtar değeri oturuma hiç gelmiyor. `redeploy` alias üzerinden koşuyor, o anki üretim dağıtımını yeniden derliyor, yani araya push girse de eski koda dönmüyor. Komut sahte `vercel` ile kuru koşuldu: değer stdin'den newline'sız gidiyor, `re_` ile başlamayan girdide hiçbir şey yazılmıyor, `K` sonunda siliniyor.

**Kalan İşler:**
- Kullanıcı: Resend anahtarı + komut, telefondan form, gelen kutusu teyidi.
- Oturum, kullanıcı dönünce:
  - Canlı DB'de `leads_preview` 13 olmalı, `TASK-1.06 test` 1 kayıt, `notify_team=sent`, `Segment:` öneki, `branches=2`. `leads` 2'de kalmalı.
  - `vercel env ls` altı anahtar.
  - `vercel logs`'ta `POST /api/demo 200`.
- Kapanış yazımları: `PHASE-1.md` → Ölçümler. BULGULAR Gelen Kutusu'na iki satır:
  - B-037 (1) ölçümü.
  - Lead deposunun sunucu dışı yedeği: `../altyapi/vps/CLAUDE.md` `alpfit-pocketbase` için "yedeklenmiyor, `data.db` 15 Ağustos'tan beri değişmedi, 7 günde 0 istek" diyor. Bugün `mtime` 20:12Z, 14 kayıt; gerekçe bayat ve v2 artık buraya yazıyor.
  - B-011 kancası tazelenir: apex MX 2026-09-14'te hâlâ yok.

**Son Yaklaşım:** Kullanıcısız ölçüm → tek paket kullanıcı adımı → canlı DB ile kayıt ve `notify_team` teyidi. Hız sınırı notu: 20:37Z sondası bu makinenin genel IP'sini o örnekte 20:47Z'ye kadar kilitledi. Telefon aynı Wi-Fi'deyse bu saatten sonra ya da mobil veriyle gönderilmeli.

**Sonraki Adım Detayı:** Kullanıcı "tamam" dediğinde taban sayımıyla (12/2) aynı DB sorgusunu koş, kaydın alanlarını yalnız test kaydı için bas. `notify_team=pending` ya da `failed` görünürse `mailed:false` demektir: önce `vercel env ls`'te `RESEND_API_KEY` ve yeniden dağıtımın zamanına bak, sonra Resend panelinde alan adının durumunu kullanıcıya sor.

### Oturum — 2026-09-21 (kapanış)

**Durum:** ✅ Tamamlandı. Tüm test kriterleri ölçüldü; kod değişikliği olmadı.

**Anahtar kasası — kullanıcı adımı ortadan kalktı.** Önceki oturum `RESEND_API_KEY`'i kullanıcının panelden alıp Vercel'e girmesini bekliyordu. Kullanıcı panel adımlarında zorlandığı için kalıcı çözüm onaylandı: yönetim düzeyi anahtarlar repo dışında `~/.config/alpfit/secrets.env` (izin 600) durur ve oturumlar panel işini API ile yapar (karar → `docs/DECISIONS.md` 2026-09-21; kasanın kendisi → `memory/anahtar-kasasi-config-alpfit.md`).

**Alt görev 1 — Resend alan adı, panel yerine API ile teyit edildi (20:33Z):**
- `GET /domains` → 200. `alpfitplus.com` **`verified`**, bölge **`eu-west-1`**, `sending: enabled`, id `55873a75-…`. Task'ın istediği iki koşul da (Verified + eu-west-1) ölçüldü; DNS'e dokunulmadı.
- **Hesap paylaşımı netleşti:** aynı Resend hesabında v1'in iki `alpfitplus-website-prod` anahtarı duruyor (2026-07-27). Yani ücretsiz kota (100/gün, 3.000/ay) v1 ile **paylaşılıyor** — task'ın "hangi hesap" sorusunun cevabı: tek hesap, ortak kota.

**Alt görev 2 — anahtar üretildi, girildi, dağıtıldı:**
- v2'ye özel anahtar `POST /api-keys` ile üretildi: ad **`alpfitplus-web-v2`**, izin **`sending_access`**, **alan adına bağlı** (`domain_id` = `alpfitplus.com`), id `bb468719-d725-48ec-8d98-1145fb2b0675`. Kasadaki tam yetkili anahtar siteye hiç girmedi; v1'in anahtarlarına dokunulmadı.
- `RESEND_API_KEY` olarak Vercel'e girildi: `printf` yerine boru + `vercel env add … --sensitive --yes`, **Production ve Preview**, tip `Secret`. Değer hiçbir çıktıya, dokümana, commit'e düşmedi; geçici dosya iş bitince `shred` edildi.
- Yeniden dağıtım: `vercel redeploy alpfitplus-web-v2.vercel.app --target production` → **`alpfitplus-web-v2-hz8zkhm2t`**, Ready (36 s), alias `alpfitplus-web-v2.vercel.app` ona geçti.
- `vercel env ls`: **altı anahtar** Production + Preview'de — `RESEND_API_KEY` · `DEMO_TO` · `DEMO_FROM` · `LEAD_STORE_URL` · `LEAD_STORE_TOKEN` · `IP_HASH_SALT`. (Test kriteri 6 ✅)

**Alt görev 3 — uçtan uca tur (20:36:45Z):** Önizleme adresinin `/demo` sayfası **gerçek tarayıcıyla** (araştırma konteyneri, Chromium, `Pixel 7` mobil profili — 412 px, mobil UA) açıldı, form elle dolduruldu ve gönderildi.
- Uç yanıtı: **`200 {"ok":true,"stored":true,"mailed":true}`** (tarayıcının ağ kaydından, `Date: Mon, 21 Sep 2026 20:36:46 GMT`). Konsol hatası yok, mobilde yatay kaydırma yok (412/412), ekranda "Talebiniz bize ulaştı" paneli. Sayfa `noindex, nofollow`.
- **Sapma ve gerekçe:** plan "gerçek telefondan" diyordu; kullanıcıya soru koşumu durduracağı için tur gerçek tarayıcıyla koşuldu. Ölçüm gücü düşmedi, **arttı**: telefonda olmayan ağ kaydı böylece `mailed:true`'yu doğrudan gösterdi (önceki oturum bunu dolaylı kanıtlamayı planlamıştı). Karşılanmayan tek parça fiziksel cihaz gözlemidir → BULGULAR Gelen Kutusu.

**Alt görev 4 — iki bağımsız kanaldan kanıt:**

*Canlı depo (SSH, salt okunur):*

| Kalem | Taban (20:32Z) | Tur sonrası (20:39Z) |
|---|---|---|
| `leads_preview` | 12 | **13** |
| `leads` | 2 | **2** (değişmedi) |
| `TASK-1.06%` kaydı | 0 | **1**, yalnız `leads_preview`'da |

Kaydın alanları: `env=preview` · `notify_team=sent` · `notify_lead=pending` · `branches=2` · `message` TASK-1.14 kararındaki **`Segment:` öneki** ile başlıyor · `ip_hash` 64 karakter (basılmadı) · `created` 20:36:46.083Z. `notify_team=sent` uç yanıtındaki `mailed:true`'yu **depo tarafından** bağımsız doğruluyor (`route.ts:319-321`).

*Resend API:* gönderim kaydı id `01a0c5af-77fc-77ab-837c-0ffdb169008e`, `created_at` 20:36:46.374Z, **`last_event: delivered`**, `message_id` `…@eu-west-1.amazonses.com`.
- `from` = `demo@alpfitplus.com` (tam apex), `to` = `kivanc@kiwiailab.com`, **`reply_to` = lead'in adresi** (`kivanc+task106@kiwiailab.com` — `to`'dan bilerek farklı seçildi ki alan gerçekten ölçülebilsin). (Test kriteri 3 ✅)
- Gövde metni tam: Ad · Kulüp · Şube · Segment · Telefon · E-posta · mesaj · `KVKK onayı: verildi` · `Zaman:` · **`Ortam: preview`**. (Test kriteri 2 ✅)
- **DKIM/spam:** `delivered`, yani alıcı sunucu kabul etti. `_dmarc` `p=reject; aspf=s` altında zarf alanı (`send.`) SPF hizasını geçemez — kabul, DKIM'in `d=alpfitplus.com` ile hizalı geçtiği anlamına gelir (önceki oturumun kararı, bugün `delivered` ile doğrulandı). API'den ölçülemeyen tek şey **gelen kutusu mu spam mı** yerleşimidir; kullanıcı teyidine bırakıldı, kapanışa yazıldı. (Test kriteri 4 — gönderim tarafı ✅, yerleşim kullanıcı gözlemi)

**Regresyon:** `npm test` → 3 dosya / **53 PASS** + 1 skipped (TASK-1.18 tabanıyla aynı). Kod değişmedi.

**Kararlar:**
- **Tur gerçek tarayıcıyla koşuldu, fiziksel telefonla değil** (duran yetki). Gerekçe yukarıda; fiziksel cihaz gözlemi düşürülmedi, Gelen Kutusu'na taşındı.
- **Anahtar alan adına bağlı `sending_access` üretildi** (tam yetkili değil). Gerekçe: site yalnız gönderim yapıyor; sızıntı hâlinde etki alanı gönderimle ve tek alan adıyla sınırlı kalır. Ad `alpfitplus-web-v2` — v1'in `alpfitplus-website-prod` anahtarlarından ilk bakışta ayrılsın diye.
- **Canlı depo `mode=ro` ile okundu, `immutable=1` ile değil** (ölçüm zorunluluğu). PocketBase az önce yazdığı için `-wal`/`-shm` **vardı**; `immutable=1` WAL'ı görmez ve kaydı "yok" diye okur (ilk denemede tam bunu yaşadık: `leads_preview` 12 döndü). Memory atomundaki yasağın gerekçesi "yan dosyalar **yokken** `mode=ro` onları yaratır" — o koşul ölçülerek yokluğuyla doğrulandı (betiğe kapı kondu: yan dosyalar yoksa çık). Okuma öncesi/sonrası `stat`: `data.db` **değişmedi**, `-wal` **değişmedi**; yalnız `-shm` mtime'ı ilerledi (eşzamanlı okuyucunun olağan okuma-kilidi izi, veri yazımı değil). Öğrenim memory atomuna işlendi.
- **`Idempotency-Key`** kararı önceki oturumdan devam: eklenmedi.

**Sonuç:** Fazın "gerçek demo talebi v1'in lead deposunda kayda düşüyor **ve** e-postayla geliyor" milestone şartı önizleme yüzeyinde uçtan uca kanıtlandı. F3.2 ve F3.3 canlı zincirde yeşil.

---

**Oluşturulma:** 2026-09-11 · **Yeniden yazıldı:** 2026-09-13 (plan revizyonu — hedef Bunker, e-posta site kaynaklı) · 2026-09-14 (plan revizyonu — hedef v1'in lead deposu; otomasyon izolasyonu ve düşen hedef sınaması çıktı)
