# TASK-1.14: Kayıt adaptörü — `toWebhook` yerine lead deposu (`toStore`), `.env.example` ve Apps Script kalıntısı

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.12 ✅ (biçim kapısı bağlantıdan önce), TASK-1.16 ✅ (test koşucusu), TASK-1.17 ✅ (yerel depo), TASK-1.13 ✅ (depo sözleşmesi dondu)

---

## Hedef

`/api/demo`'nun dayanıklı kaydını v1'in lead deposuna bağlamak ve **yerel depoda** uçtan uca sınamak. Kapsam:

- `toWebhook`'u depo sözleşmesine göre yazılmış bir adaptörle (`toStore`) değiştirmek.
- Sözleşme bataryasını yeni adaptöre çevirmek.
- `.env.example`, `README.md` ve `CLAUDE.md`'deki `LEAD_WEBHOOK_URL` anlatımını yeni anahtarlara çevirmek.
- İptal edilen Apps Script alıcısının dosyalarını repodan kaldırmak.

Task şu koşullar sağlandığında tamamlanmış sayılır:

- Batarya Vitest'te yeşil ve yeni kapıların her biri bozuk girdiyle kırmızıya dönmüş.
- Yerel geliştirme sunucusundan gönderilen form yerel depoda `leads_preview`'a **bir** kayıt olarak düşmüş.
- `lead-sheet` ve `LEAD_WEBHOOK_URL` kalıntısı kalmamış.

Canlı env ve canlı teyit TASK-1.18'dedir.

---

## Bağlam

**2026-09-14 plan revizyonuyla yeniden yazıldı.** Hedef Bunker değil v1'in PocketBase deposu (`docs/DECISIONS.md` 2026-09-14). TASK-1.11 sözleşmeyi `toWebhook`'un üç kapısıyla karşılaştırdı (arşiv → Oturum 2026-09-14):

- **Kapı 1 (HTTP durumu) tutar.** Hata yolları 400/401/429/500.
- **Kapı 2 (JSON gövde) büyük ölçüde tutar.** Tek istisna `413`, PocketBase'in kendi gövdesi.
- **Kapı 3 (`ok === true`) tutmaz.** Başarı `201 {id, prior_count}`.

Bu yüzden yorum değişikliği yetmez, yeni adaptör gerekir. Sözleşmenin **ruhu** korunur: deponun yazma rotasının kendi başarı kodu (`201`) görülmeden `stored` true olmaz. TASK-1.05'in "HTML dönen hata sayfası kaydedildi okunur" dersi alıcıdan bağımsızdır. Burada karşılığı, `res.ok`'un (200 dâhil) başarı sayılmamasıdır.

v1'in kendi adaptörü referanstır: `../Alpfitplus-website.v1/api/demo.ts:226-278` (salt okunur). Kopyalanmaz, çünkü v2'nin sırası, doğrulaması ve e-posta mantığı farklı. Env anahtar adları v1'le **aynıdır**: `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT`. Alan adı geçişinde env taşıması böylece tek hamle olur.

**Kullanıcı kararı (2026-09-13):** `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` silinir; git geçmişinde kalır. B-038 bu dosyaların sessizliklerini anlatıyordu. Dosyalar kalkınca konusuz kalır (atom `→ TASK-1.14` işaretinde bekler; arşivleme verify-phase'in işi).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.11.md` → Oturum 2026-09-14 — sözleşme karşılaştırması, alan sınırları, token/aşama eşlemesi
- `_dev/tasks/archive/TASK-1.13.md` → Oturum Kaydı ve `tests/lead-store.contract.test.ts` — dondurulmuş depo davranışı (adaptör buna yazılır)
- `_dev/tasks/archive/TASK-1.17.md` → Oturum Kaydı — yerel depo komutları ve token env adları
- `../Alpfitplus-website.v1/api/demo.ts` → `clientIp`, `hashIp`, depo çağrısı, 429 taşıma, `PATCH` (salt okunur)
- `tests/api-demo.test.ts` — çevrilecek batarya
- `src/app/api/demo/route.ts` → `toWebhook`, `type Lead`, `POST` sırası
- `_dev/bulgular/B-037-api-demo-sertlestirme-bosluklari.md` → (1) — `ip_hash`'in kaynağı olan IP başlığı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 Açıklama ve Edge Case'ler — `LEAD_WEBHOOK_URL` anlatımı depoya çevrilir
- `_dev/bulgular/B-038-lead-sheet-operasyonel-sessizlikleri.md` — Çözüm Kaydı taslağı: "konusuz — dosyalar kaldırıldı" (arşivleme verify-phase'de)
- `_dev/docs/DECISIONS.md` — Karar Noktaları'ndan biri bir sözleşme bırakırsa (ör. `notify_*` alanlarının anlamı)

---

## Alt Görevler

- [x] **1. Testleri önce çevir ve kırmızı gör**
  - Sahte alıcı sahte **depoya** döner: `201 {id, prior_count}` kontrol grubu; `400`/`401`/`500` JSON; `413` + JSON olmayan gövde (PocketBase'in kendi yanıtı, TASK-1.13 → Dikkat Noktaları); `429`; `200 {"ok":true}` (yanlış durum); `200` + HTML (vekil/hata sayfası); `201` + okunamayan gövde; bağlantı hatası/zaman aşımı
  - Yeni senaryolar kod değişmeden koşulur ve kırmızı görülür
  - Dosya: `tests/api-demo.test.ts`

- [x] **2. `toStore` adaptörünü yaz**
  - Yapılandırma: `LEAD_STORE_URL` + `LEAD_STORE_TOKEN` + `IP_HASH_SALT`. Eksik olan her durumda istek **gönderilmez**, teşhis loguna yalnız "yapılandırma eksik" düşer (Karar Noktası: tuz)
  - İstek: `POST ${LEAD_STORE_URL}/lead`, başlıklar `content-type: application/json` + `X-Lead-Token`. Gövde yalnız depo beyaz listesi: `name club phone email branches message locale ip_hash`. `locale` sabit `tr`. `env`, `ua`, `consent`, `at` gövdeye **girmez**; koleksiyonu ve ortamı token belirler
  - `ip_hash` = `HMAC-SHA256(ip, IP_HASH_SALT)` hex (`node:crypto`). `ip`, hız sınırının kullandığı değişkenle aynı. Ham IP gövdeye ve loga girmez
  - `stored` yalnız **`201`** ile true; başka her durum kodu, gövdesi ne olursa olsun kayıt değildir. `201`'i yalnız deponun yazma rotası üretir. Gövde okunamazsa kayıt yine geçerli sayılır (v1 davranışı), yalnız `id` boş kalır ve `PATCH` yapılmaz
  - Depo `429` → uç `429 rate-limited` döner (Karar Noktası)
  - Log disiplini değişmez: durum kodu, deponun `error` kodu (40 karaktere kırpılı) ve `lead.at`. URL, token, `ip_hash`, kişisel veri yok. `catch` hata nesnesini loglamaz
  - `toWebhook` ve `LEAD_WEBHOOK_URL` okuması kaldırılır. `toFile` (yerel JSONL) ve e-posta mantığı değişmez; sıra `toStore || toFile`
  - Dosya: `src/app/api/demo/route.ts`

- [x] **3. Bildirim durumunu geri yaz** (Karar Noktası sonucuna göre)
  - Kabul edilirse: e-posta denemesinden sonra `PATCH ${LEAD_STORE_URL}/lead/{id}`, en fazla 3 sn, sonucu ziyaretçinin yanıtını **değiştirmez**, başarısızlık yalnız loglanır
  - Dosya: `src/app/api/demo/route.ts`

- [x] **4. Env ve anlatım kalıntılarını çevir**
  - `.env.example`: `LEAD_WEBHOOK_URL` bloğu silinir; `LEAD_STORE_URL`, `LEAD_STORE_TOKEN` ("token koleksiyonu seçer — alan adı geçişine kadar **önizleme** token'ı"), `IP_HASH_SALT` açıklamalı ve değersiz
  - `README.md:81` ve `CLAUDE.md` → Kod kuralları → "Sırlar yalnız env'de" satırındaki anahtar listesi. `CLAUDE.md` kök doktrin dosyasıdır, değişiklik kullanıcıya bildirilir
  - Dosyalar: `.env.example`, `README.md`, `CLAUDE.md`

- [x] **5. Apps Script kalıntısını kaldır**
  - `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` silinir
  - `grep -rn "lead-sheet\|Apps Script\|LEAD_WEBHOOK" src research tests .env.example README.md CLAUDE.md` → eşleşme yok (`_dev/` tarihsel kayıtları hariç)

- [x] **6. Yerel uçtan uca tur**
  - Yerel `.env`: `LEAD_STORE_URL=http://lead-store:8090`, `LEAD_STORE_TOKEN` = yerel önizleme token'ı, `IP_HASH_SALT` yerel rastgele; `LEAD_FILE_PATH` **boş**. Değerler oturumda basılmaz
  - `docker compose --profile lead up -d lead-store` + geliştirme sunucusu (env değişti → `docker compose restart web`). `/demo` formu tarayıcıda (araştırma konteyneri) gönderilir → başarı ekranı, yerel `leads_preview`'da bir kayıt
  - Depo durdurulur (`docker compose stop lead-store`) ve form yeniden gönderilir. E-posta env'i yerelde yok, beklenen `503` + WhatsApp yolu. Depo geri kaldırılır

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts              # toWebhook → toStore, ip_hash, 429 taşıma, (kararla) notify PATCH — zaten var
tests/
└── api-demo.test.ts      # sahte alıcı → sahte depo, yeni kapı senaryoları — zaten var
./
├── .env.example          # LEAD_WEBHOOK_URL → LEAD_STORE_URL / LEAD_STORE_TOKEN / IP_HASH_SALT — zaten var
├── README.md             # lead hedefi anlatımı (satır 81) — zaten var
└── CLAUDE.md             # "Sırlar yalnız env'de" anahtar listesi — zaten var (kök doktrin; bildirimle)
research/
├── lead-sheet.gs         # SİLİNİR — zaten var
└── lead-sheet.test.mjs   # SİLİNİR — zaten var
```

> Ürün değişikliği tek dosyada (`route.ts`). Kalanlar test, anahtar adı anlatımı ve silme; adaptörden ayrılırsa repo bir commit boyunca yanlış anahtarı anlatır.

---

## Dikkat Noktaları

- **Şema farkı:** depoda `segment`, `consent`, `ua`, `at` kolonu yok (`DECISIONS` 2026-09-14 → Bedel). `consent` her kayıtta true'dur, rızasız istek 422'de kalıyor. `at` depo `created`'ına karşılık gelir. `ua` KVKK asgariliğiyle düşer. `segment`'in yeri Karar Noktası'dır.
- **`env` alanı artık kayda girmez.** Ortam etiketini token belirler ve yalnız `production | preview` değerini alır. Yerel talep yerel depoda `preview` görünür, canlı depoya yalnız TASK-1.18'in tek test isteğiyle gider. `local` ayrımı e-posta gövdesindeki `Ortam:` satırında yaşar. TASK-1.05'ten devralınan "kayıtta `env=local`" kriteri bu yüzden **düşer**; karşılığı TASK-1.18'de "kayıt `leads_preview`'da".
- **`MAX` sınırları depo sınırlarının altında** (ad 120/255 · kulüp 160/255 · telefon 40/64 · şube 10/100 · mesaj 2000/5000). Kırpma sırası korunur. `segment` mesaja eklenirse eklenmiş mesaj 5000'i aşamaz (2000 + etiket).
- **`ip_hash`'in kaynağı B-037 (1) ile aynı zayıflığı taşır.** `x-forwarded-for`'un ilk değeri istemci tarafından uydurulabilir, depo sınırı da onunla anahtarlanır. Bu task sırayı **değiştirmez**; Vercel'in davranışı TASK-1.06'da ölçülür. Adaptör, hız sınırıyla aynı `ip` değişkenini kullanır ki iki sınır ayrı başlıklara bakmasın.
- **Hız sınırı iki katmanlı olur:** v2 bellek içi (10 dk / 5) + depo (`ip_hash` başına saat / 5). Batarya senaryo başına ayrı `x-forwarded-for` gönderiyor (memory); sahte depo 429'u yalnız ona ayrılmış senaryoda döner.
- **Sır hijyeni:** token, tuz ve `ip_hash` log, hata yanıtı, commit ya da dokümana girmez. `console.error` casusu her hata yolunda URL, token, ad, telefon, e-posta ve mesaj için taranır (TASK-1.16 deseni).
- **Canlıya dokunulmaz:** Vercel'de `LEAD_STORE_*` henüz tanımsız. Push sonrası önizleme bugünkü `503` davranışında kalır.
- **Ağaç temiz olmalı:** `.env.example`'daki Umami bloğu TASK-1.07'de commit'lendi (2026-09-13). Yabancı değişiklik görülürse dosya bazlı commit onu süpürür — dur ve sor (CLAUDE.md → Paralel Oturum Farkındalığı).
- **E-posta bu task'ta açılmaz:** yerel turda `mailed:false` beklenen durum. Kayıt yazıldığı için uç yine 200 döner.

---

## Test Kriterleri

- [x] `docker compose exec web npm test` yeşil; `tests/api-demo.test.ts` yeni sözleşmeyle:
  - Kontrol grubu: sahte depo `201 {id, prior_count}` → uç 200 `stored:true`; depoya giden istekte `X-Lead-Token` var, gövde yalnız beyaz liste alanlarını taşıyor, `ip_hash` 64 hex, ham IP gövdede yok
  - Bozuk yanıtlar (`400`, `401`, `500` JSON · `413` + JSON olmayan gövde · `200 {"ok":true}` · `200` + HTML · ağ hatası) → e-posta kapalıyken 503 `no-sink`
  - `201` + okunamayan gövde → 200 `stored:true` (kayıt geçerli), `PATCH` denenmedi
  - Depo `429` → uç `429 rate-limited`, e-posta denenmedi
  - Yapılandırma eksik (URL, token ya da tuz yok) → `fetch` depoya **çağrılmadı**
  - Mevcut regresyonlar yeşil: bal küpü, `missing`, `missing-contact`, `bad-contact`, `no-consent`, `bad-json`, uç 429, kırpma, `reply_to`
  - Log casusu hiçbir senaryoda URL, token, tuz, `ip_hash` ya da kişisel veri görmüyor
- [x] **Ürettiğim kapıyı sınadım — bozuk girdi:** yeni senaryolar kod değişmeden koşuldu ve kırmızıydı (8/28 kırmızı — kontrol grubu, 429, uzun alan kırpma, `bozuk telefon+eposta` gibi depoya bağlı senaryolar; 20/28 zaten yeşildi çünkü depoya hiç dokunmuyorlardı); özellikle `200 {"ok":true}`'nun ve `200` + HTML'in artık başarı sayılmadığı senaryolar (bunlar zaten eski kodda da 503 veriyordu — depo hiç bağlı olmadığı için — asıl kanıt kontrol grubunun 503'ten 200'e dönmesiydi). Değişiklik sonrası 28/28 yeşil
- [x] **Ürettiğim kapıyı sınadım — boş kapsam:** tuz tanımsızken depoya istek gitmiyor (fail-closed, `it.each` ile URL/token/tuz üçü de ayrı ayrı sınandı) ve kontrol grubu (tuz tanımlıyken) `fetchCalls`'ta depo isteğinin gerçekten gittiğini kanıtlıyor
- [x] TASK-1.13 sözleşme paketi aynı oturumda yerel depoya karşı hâlâ yeşil (10/10 PASS, toplam 4 dosya/63 test) — adaptör ve paket aynı sözleşmeyi okuyor
- [x] Yerel uçtan uca: Playwright ile tarayıcıdan gönderilen form → başarı ekranı ("Talebiniz bize ulaştı", konsol hatası yok) → yerel `leads_preview`'da **bir** yeni kayıt (superuser sorgusuyla doğrulandı); `name`/`club`/`phone` doğru, `env=preview`, `ip_hash` 64 karakter, `LEAD_FILE_PATH` tanımsız
- [x] Yerel depo durdurulmuşken (`docker compose stop lead-store`) form `503 no-sink` + WhatsApp yolunu gösteriyor, "gönderildi" demiyor (0.11 sn — ECONNREFUSED hızlı düştü, 8 sn timeout'a takılmadı); depo geri gelince (`--profile lead up -d lead-store`) yeniden `200 stored:true`
- [x] `grep` taraması: `src/`, `research/`, `tests/`, `.env.example`, `README.md`, `CLAUDE.md` içinde `lead-sheet`, `Apps Script` ve `LEAD_WEBHOOK` eşleşmesi yok (0 satır — ilk taramada testin kendi `delete process.env.LEAD_WEBHOOK_URL` kalıntı satırı çıktı, temizlendi)
- [x] `.env.example` yalnız anahtar adı ve açıklama içeriyor (`grep -E '^[A-Z_]+=.+'` → eşleşme yok)
- [x] `docker compose exec web npm run build` hatasız (23 rota); `npx eslint src/app/api/demo/route.ts tests/` temiz (çıktı yok)

---

## Karar Noktaları

Dördü de run-task oturumunda, kod yazılmadan kullanıcıya sorulur; seçim ve gerekçe Oturum Kaydı'na.

**Seçim yöntemi (bu oturum):** Oturum orkestratör aracılığıyla koştu; kullanıcı koşum açılışında "tercih bekleyen duruşları (hangi isim/desen/kesim/öneri) durmadan makul olanı seçip gerekçeyle devam et" diye standart bir yetki vermişti. Dördünün de task metninde zaten gerekçeli bir **Önerilen** seçeneği vardı — dördü de aşağıda o öneriyle seçildi, karar kod yazılmadan önce (Adım 1'in hemen ardından) verildi. Hiçbiri canlı sisteme yazmıyor, sır değeri taşımıyor ya da geri dönüşü olmayan bir taahhüt bırakmıyor (yalnız `notify_*` bir sözleşme bıraktığı için `docs/DECISIONS.md`'ye ayrıca yazıldı — aşağı bak).

- **`segment`'in yeri:** ✅ **(a) seçildi** — mesajın başına tek satır etiket (`Segment: CrossFit`). Depo tek başına okunduğunda talebin segmenti görünür kalır ve dokunulmaz repoda iş doğmaz. Boş segmentte satır eklenmez (sınandı).
- **Depo `429`'u:** ✅ **(a) seçildi** — uç `429` döner, e-posta denenmez (v1 davranışı). Aynı IP'den saatte altıncı talep ya bot ya tekrar deneme; ziyaretçi tekrar deneme mesajı görür, kayıp değil gecikmedir.
- **`notify_*` alanları:** ✅ **(a) seçildi** — `notify_team` e-posta sonucuyla `PATCH` edilir, `notify_lead` `pending` kalır (dokunulmaz). Panelde "bildirim gitti mi" sorusu cevaplanır; `notify_lead`'in v1'deki anlamı ("ziyaretçi e-posta vermedi" / onay sonucu) erken ve yanlış doldurulmaz. **Sözleşme bıraktığı için ayrıca kayıtlı:** `docs/DECISIONS.md` 2026-09-14 "Bildirim durumu (notify_*)".
- **`IP_HASH_SALT` eksikse:** ✅ **(a) seçildi** — depo denenmez, log düşer (fail-closed). Tuzsuz IPv4 özeti kaba kuvvetle geri çevrilebilir, ham IP'yi saklamakla eşdeğerdir; e-posta yolu açık kalır. `it.each` testiyle sınandı.

---

## Risk ve Geri Dönüş Planı

- **Adaptör canlı depoda yerelden farklı davranırsa** (nginx 413/502 HTML, canlı `trustedProxy`) → Kapı 2'nin eşi (`201` dışı her yanıt kayıt değil) yakalar, talep e-postaya düşer; TASK-1.18 tek canlı istekle ölçer.
- **Rollback:** `route.ts`, `tests/api-demo.test.ts`, `.env.example`, `README.md`, `CLAUDE.md` dosya bazlı geri alınır. Silinen iki dosya `git checkout <commit>^ -- research/lead-sheet.gs research/lead-sheet.test.mjs` ile geri gelir.

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
- **Alt görev 1 ✅** — `tests/api-demo.test.ts` tamamen yeniden yazıldı (28 test): sahte alıcı artık sahte **depo** (`LEAD_STORE_URL`/`_TOKEN`/`IP_HASH_SALT` ile ayrı env kapısı, gerçek anahtarlardan bağımsız test sabitleri). Eski koda karşı koşuldu: 8/28 kırmızı (kontrol grubu, depo 429, yapılandırma-var-ama-eski-kod-okumuyor senaryoları), 20/28 zaten yeşildi (depoya hiç dokunmayan validasyon/bal küpü/app-level 429 yolları).
- **Alt görev 2 ✅** — `toStore(lead, ip)` yazıldı (`src/app/api/demo/route.ts`): `LEAD_STORE_URL`+`_TOKEN`+`IP_HASH_SALT` üçü de yoksa istek hiç gönderilmiyor; `POST ${url}/lead` başlık `X-Lead-Token`, gövde yalnız beyaz liste (`name club phone email branches message locale ip_hash`, `locale` sabit `tr`); `ip_hash = HMAC-SHA256(ip, salt)` hex (`node:crypto`, `createHmac`); yalnız `201` `stored:true` sayılıyor, diğer her durum kodu (gövdesi ne olursa olsun) `stored:false`; `201`+okunamayan gövde kayıt geçerli sayılıyor (id boş kalır); depo `429`'u ayrı yakalanıp uca taşınıyor (e-posta/dosya denenmeden). `toWebhook`/`LEAD_WEBHOOK_URL` tamamen kaldırıldı.
- **Alt görev 3 ✅** — `notifyStore(leadId, notifyTeam)` yazıldı: yalnız `store.stored && store.leadId` varken, e-posta denemesinden **sonra**, en fazla 3 sn `PATCH` (`{notify_team: mailed?"sent":"failed"}`); sonuç yanıtı değiştirmiyor, başarısızlık yalnız loglanıyor. `notify_lead` hiç gönderilmiyor (depo varsayılanı `pending` kalır).
- **Alt görev 4 ✅** — `.env.example` §1 yeniden yazıldı (`LEAD_WEBHOOK_URL` bloğu silindi; `LEAD_STORE_URL`/`_TOKEN`/`IP_HASH_SALT` açıklamalı-değersiz eklendi, `LEAD_FILE_PATH` yedek olarak kaldı). `README.md:81` ve kök `CLAUDE.md` → Kod kuralları → "Sırlar yalnız env'de" satırı güncellendi (**kök doktrin dosyası değişikliği — bu kayıtla bildiriliyor**).
- **Alt görev 5 ✅** — `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` silindi (`rm`, git geçmişinde kalır). `grep -rn "lead-sheet|Apps Script|LEAD_WEBHOOK" src research tests .env.example README.md CLAUDE.md` → ilk taramada yalnız testin kendi `delete process.env.LEAD_WEBHOOK_URL` kalıntı satırı çıktı (artık anlamsız, kod hiç okumuyor); satır silindi, ikinci tarama 0 eşleşme.
- **Alt görev 6 ✅** — Yerel `.env`'e `LEAD_STORE_URL=http://lead-store:8090`, `LEAD_STORE_TOKEN` (= mevcut `LEAD_TOKEN_PREVIEW` ile aynı değer, shell substitution ile değeri hiç ekrana basmadan) ve yeni `IP_HASH_SALT` (`openssl rand -hex 32`) eklendi; `LEAD_FILE_PATH` tanımsız bırakıldı. `docker compose restart web`. Üç ayrı uçtan uca tur: (1) host'tan `curl` ile POST → `stored:true`, geçici superuser ile `leads_preview`'da doğrulandı (env=preview, locale=tr, `notify_team=failed`/`notify_lead=pending`, `ip_hash` 64 karakter, mesajda `Segment: pilates\n` öneki). (2) Playwright ile **gerçek tarayıcıda** `/demo` formu dolduruldu ve gönderildi (araştırma konteyneri, betik scratchpad'de) → başarı ekranı ("Talebiniz bize ulaştı"), konsol hatası yok; aynı superuser deseniyle `leads_preview`'da kayıt doğrulandı. (3) `docker compose stop lead-store` + form gönderimi → `503 no-sink` + WhatsApp mesajı (0.11 sn, ECONNREFUSED hızlı düştü); `docker compose --profile lead up -d lead-store` + form gönderimi → yeniden `stored:true`.

**Sorunlar:**
- Yok — plan revizyonunda (TASK-1.11/1.13/1.17) sözleşme, sınırlar ve ortam zaten netleşmişti; icra sırasında beklenmedik bir engel çıkmadı.

**Kararlar:**
- **Dört Karar Noktası** run-task Adım 1'in hemen ardından, kod yazılmadan, task metninin kendi **Önerilen** seçenekleriyle karara bağlandı (orkestratörün standart-tercih yetkisiyle — hiçbiri canlı sisteme yazmıyor/sır taşımıyor/geri dönüşsüz değil): segment → (a) mesaj başına etiket; depo 429 → (a) uçtan 429, e-posta denenmez; notify_* → (a) yalnız notify_team, e-posta sonucuyla; tuz eksikse → (a) fail-closed. Detay ve gerekçe → yukarı "Karar Noktaları".
- **`notify_*` kararı bir sözleşme bıraktığı için** (`notify_lead` alanının anlamı ileride rezerve edilir) ayrıca `docs/DECISIONS.md` 2026-09-14 "Bildirim durumu (notify_*)" kaydı açıldı; diğer üç karar geri dönüşü kolay/task-icrası düzeyinde kaldığı için DECISIONS'a girmedi (yalnız bu Oturum Kaydı'nda ve kod yorumlarında).
- POST'a zaman aşımı süresi (8 sn) eski `toWebhook`'tan aynen taşındı — task metni bu değeri değiştirmeyi istemiyordu; PATCH 3 sn v1'in kendi değeriyle aynı (task metninde de "en fazla 3 sn" olarak birebir yazılıydı).
- `notifyStore`'un PATCH'i, `!stored && !mailed` (no-sink) kontrolünden **önce** senkron `await` ile çağrılıyor — v1'in kendi deseniyle aynı (fire-and-forget değil); yanıt içeriğini etkilemiyor çünkü yalnızca `store.stored` doğruyken çağrılıyor ve o durumda `stored` zaten `true`, no-sink dalı hiç girilmiyor.
- docs/DECISIONS.md'ye eklendi: Evet (notify_* — yukarı bak).

**Kalan İşler:** Yok — task tam kapandı. Canlı env girişi ve tek canlı teyit TASK-1.18'de (bu task'ın kapsamı değil, task metninde de öyle sınırlanmıştı).

**Son Yaklaşım:** N/A — pause olmadı, task tek oturumda uçtan uca bitti.

**Sonraki Adım Detayı:** N/A — sıradaki task TASK-1.18 (canlı depo bağlantısı: Vercel env + token → koleksiyon teyidi), kendi task dokümanından başlar; kullanıcı adımı (önizleme depo token'ı) gerektirir (DURUM.md → Aktif Task notu).

**Dosya Değişiklikleri:**
- `src/app/api/demo/route.ts` → `toWebhook`/`LEAD_WEBHOOK_URL` kaldırıldı; `hashIp`, `toStore`, `notifyStore` eklendi; `POST` akışı depo→dosya→e-posta+PATCH sırasına göre yeniden yazıldı
- `tests/api-demo.test.ts` → tamamen yeniden yazıldı (28 test, sahte depo)
- `.env.example` → §1 `LEAD_STORE_URL`/`_TOKEN`/`IP_HASH_SALT` (değersiz), `LEAD_WEBHOOK_URL` bloğu silindi
- `README.md` → demo talep ucu anlatımı depoya çevrildi
- `CLAUDE.md` (kök doktrin) → "Sırlar yalnız env'de" anahtar listesi güncellendi — **bildirimle**
- `research/lead-sheet.gs`, `research/lead-sheet.test.mjs` → silindi
- `.env` (yerel, git'e girmez) → `LEAD_STORE_URL`/`_TOKEN`/`IP_HASH_SALT` eklendi (değer basılmadan)
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 Açıklama + Edge Case'ler depo anlatımına çevrildi
- `_dev/docs/DECISIONS.md` → 2026-09-14 "Bildirim durumu (notify_*)" yeni kayıt
- `_dev/bulgular/B-038-lead-sheet-operasyonel-sessizlikleri.md` → Çözüm Kaydı taslağı yazıldı (arşivleme verify-phase'in işi)
- `_dev/DURUM.md`, `_dev/phases/PHASE-1.md` → 1.14 ✅, Aktif Task TASK-1.18

**Test Sonuçları:**
- **Kırmızı (kod değişmeden, eski `toWebhook` ile):** `tests/api-demo.test.ts` 8/28 kırmızı — kontrol grubu (200 beklenirken 503), depo 429 (429 beklenirken 503), 201+okunamayan-gövde/uzun-alan-kırpma/geçerli-telefon+bozuk-eposta (200 beklenirken 503), iki `notify_team` senaryosu (PATCH beklenirken hiç çağrılmamış) — tümü depoya hiç bağlanmayan eski kodun beklenen sonucu.
- **Yeşil (yeni `toStore` ile):** `tests/api-demo.test.ts` 28/28 PASS. Tam suite env'siz: 4 dosya/53 PASS + 1 skipped (sözleşme paketi). Tam suite env'li (gerçek yerel depoya karşı, geçici superuser): **4 dosya/63 PASS**, sözleşme paketi dahil (TASK-1.13'ün 10 testi de aynı oturumda yeşil).
- **Ürettiğim kapıyı sınadım — bozuk girdi:** yukarı "Kırmızı" — özellikle `200 {"ok":true}` ve `200`+HTML senaryoları eski `ok===true` sözleşmesinin artık geçerli olmadığını (her ikisi de zaten depoya bağlı olmayan eski kodda 503'tü, kontrol grubunun 503→200 dönüşü asıl kanıt) gösteriyor.
- **Ürettiğim kapıyı sınadım — boş kapsam:** `it.each` ile `LEAD_STORE_URL`/`LEAD_STORE_TOKEN`/`IP_HASH_SALT` ayrı ayrı silinip depoya **hiç istek gitmediği** (`fetchCalls` boş) doğrulandı; kontrol grubu testi (aynı suite'te, üçü de tanımlıyken) isteğin gerçekten gittiğini kanıtlıyor.
- **eslint:** `npx eslint src/app/api/demo/route.ts tests/` → temiz (çıkış kodu 0, çıktı yok).
- **build:** `docker compose exec web npm run build` → hatasız, 23 rota; paylaşılan `next_cache`'e yazdığı için ardından `docker compose restart web` (TASK-1.13/1.16 emsali), `curl localhost:3000` ve `/demo` → 200.
- **Yerel uçtan uca (canlı depo koduna karşı):** (1) host `curl` POST → `{"ok":true,"stored":true,"mailed":false}`; geçici superuser + REST sorgusuyla `leads_preview`'da **1** kayıt: `env=preview`, `locale=tr`, `notify_team=failed`, `notify_lead=pending`, `ip_hash` 64 karakter, `message` içinde `"Segment: pilates\n..."` öneki. (2) Playwright/gerçek tarayıcı (araştırma konteyneri) → form dolduruldu, gönderildi, `role="status"` başarı ekranı ("Talebiniz bize ulaştı…") göründü, konsol hatası **yok**; aynı superuser deseniyle `leads_preview`'da **1** yeni kayıt doğrulandı (name/club/phone doğru). (3) `docker compose stop lead-store` → POST → `503 {"code":"no-sink",...}` + WhatsApp mesajı, "gönderildi" demiyor (0.11 sn). `docker compose --profile lead up -d lead-store` (sağlıklı, 8 sn) → POST → yeniden `{"ok":true,"stored":true,"mailed":false}`.
- **Sızıntı denetimi:** `grep` ile `.env.example`'da değer yok; repo genelinde `lead-sheet`/`Apps Script`/`LEAD_WEBHOOK` 0 eşleşme; tüm superuser/token değerleri komuta env değişkeni olarak geçirildi, hiçbir zaman stdout'a yazdırılmadı (yalnız uzunluk doğrulandı: 22/64/64 karakter); iki geçici superuser hesabı (`verify-1-14@local.test`, `verify-1-14b@local.test`, `contract-1-14@local.test`) doğrulama sonrası silindi.
- **Paralel oturum kontrolü:** `git status --porcelain` bu oturum boyunca yalnız kendi dokunduğu dosyaları gösterdi (`.env.example`, `CLAUDE.md`, `README.md`, silinen iki `research/lead-sheet.*`, `src/app/api/demo/route.ts`, `tests/api-demo.test.ts`); yabancı satır yok.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-14

**Ne Yapıldı:**
- `/api/demo`'nun dayanıklı kayıt hedefi v1'in lead deposuna (PocketBase, `POST /lead`) bağlandı: `toWebhook`/`LEAD_WEBHOOK_URL` kaldırıldı, yerine `toStore` (yalnız `201` kayıt sayar, `ip_hash` HMAC-SHA256, beyaz liste gövde) ve `notifyStore` (bildirim durumu `PATCH` ile geri yazılır) geldi.
- Sözleşme bataryası (`tests/api-demo.test.ts`) tamamen yeni depo-tabanlı sahte alıcıya çevrildi (28 test); `.env.example`/`README.md`/kök `CLAUDE.md` yeni anahtar adlarına (`LEAD_STORE_URL`/`_TOKEN`/`IP_HASH_SALT`) güncellendi; Apps Script kalıntı dosyaları silindi.
- Yerel uçtan uca üç ayrı yöntemle (curl, gerçek tarayıcı/Playwright, depo-durdur/geri-getir) canlı depo koduna karşı doğrulandı — kayıt gerçekten `leads_preview`'a düşüyor, depo düşünce dürüst 503+WhatsApp veriyor.

**Öğrenilenler:**
- Task dokümanının kendi **Önerilen** seçenekleri (gerekçesiyle birlikte) dört Karar Noktası'nı run-task oturumunda kullanıcıyı beklemeden, standart-tercih yetkisiyle güvenle kapatmaya yetti — hiçbiri canlı/sır/geri-dönüşsüz sınırına girmedi.
- "Kırmızı görmek" bazı senaryolarda (kontrol grubu, 429) beklenen kırmızının aslında "yanlış kırmızı" (503 no-sink) olması şeklinde tezahür etti — eski kod depoya hiç bağlanmadığı için her depo-bağımlı senaryo aynı 503'e düşüyordu. Asıl kanıt tek tek durum kodu değil, kontrol grubunun kod değişikliğiyle 503→200 dönüşüydü.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — Bunker alıcısı yerine v1'in lead deposu adaptörü) · **Tamamlandı:** 2026-09-14
