# TASK-1.14: Kayıt adaptörü — `toWebhook` yerine lead deposu (`toStore`), `.env.example` ve Apps Script kalıntısı

**Durum:** ⬜ Bekliyor
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

- [ ] **1. Testleri önce çevir ve kırmızı gör**
  - Sahte alıcı sahte **depoya** döner: `201 {id, prior_count}` kontrol grubu; `400`/`401`/`500` JSON; `413` + JSON olmayan gövde (PocketBase'in kendi yanıtı, TASK-1.13 → Dikkat Noktaları); `429`; `200 {"ok":true}` (yanlış durum); `200` + HTML (vekil/hata sayfası); `201` + okunamayan gövde; bağlantı hatası/zaman aşımı
  - Yeni senaryolar kod değişmeden koşulur ve kırmızı görülür
  - Dosya: `tests/api-demo.test.ts`

- [ ] **2. `toStore` adaptörünü yaz**
  - Yapılandırma: `LEAD_STORE_URL` + `LEAD_STORE_TOKEN` + `IP_HASH_SALT`. Eksik olan her durumda istek **gönderilmez**, teşhis loguna yalnız "yapılandırma eksik" düşer (Karar Noktası: tuz)
  - İstek: `POST ${LEAD_STORE_URL}/lead`, başlıklar `content-type: application/json` + `X-Lead-Token`. Gövde yalnız depo beyaz listesi: `name club phone email branches message locale ip_hash`. `locale` sabit `tr`. `env`, `ua`, `consent`, `at` gövdeye **girmez**; koleksiyonu ve ortamı token belirler
  - `ip_hash` = `HMAC-SHA256(ip, IP_HASH_SALT)` hex (`node:crypto`). `ip`, hız sınırının kullandığı değişkenle aynı. Ham IP gövdeye ve loga girmez
  - `stored` yalnız **`201`** ile true; başka her durum kodu, gövdesi ne olursa olsun kayıt değildir. `201`'i yalnız deponun yazma rotası üretir. Gövde okunamazsa kayıt yine geçerli sayılır (v1 davranışı), yalnız `id` boş kalır ve `PATCH` yapılmaz
  - Depo `429` → uç `429 rate-limited` döner (Karar Noktası)
  - Log disiplini değişmez: durum kodu, deponun `error` kodu (40 karaktere kırpılı) ve `lead.at`. URL, token, `ip_hash`, kişisel veri yok. `catch` hata nesnesini loglamaz
  - `toWebhook` ve `LEAD_WEBHOOK_URL` okuması kaldırılır. `toFile` (yerel JSONL) ve e-posta mantığı değişmez; sıra `toStore || toFile`
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **3. Bildirim durumunu geri yaz** (Karar Noktası sonucuna göre)
  - Kabul edilirse: e-posta denemesinden sonra `PATCH ${LEAD_STORE_URL}/lead/{id}`, en fazla 3 sn, sonucu ziyaretçinin yanıtını **değiştirmez**, başarısızlık yalnız loglanır
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **4. Env ve anlatım kalıntılarını çevir**
  - `.env.example`: `LEAD_WEBHOOK_URL` bloğu silinir; `LEAD_STORE_URL`, `LEAD_STORE_TOKEN` ("token koleksiyonu seçer — alan adı geçişine kadar **önizleme** token'ı"), `IP_HASH_SALT` açıklamalı ve değersiz
  - `README.md:81` ve `CLAUDE.md` → Kod kuralları → "Sırlar yalnız env'de" satırındaki anahtar listesi. `CLAUDE.md` kök doktrin dosyasıdır, değişiklik kullanıcıya bildirilir
  - Dosyalar: `.env.example`, `README.md`, `CLAUDE.md`

- [ ] **5. Apps Script kalıntısını kaldır**
  - `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` silinir
  - `grep -rn "lead-sheet\|Apps Script\|LEAD_WEBHOOK" src research tests .env.example README.md CLAUDE.md` → eşleşme yok (`_dev/` tarihsel kayıtları hariç)

- [ ] **6. Yerel uçtan uca tur**
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

- [ ] `docker compose exec web npm test` yeşil; `tests/api-demo.test.ts` yeni sözleşmeyle:
  - Kontrol grubu: sahte depo `201 {id, prior_count}` → uç 200 `stored:true`; depoya giden istekte `X-Lead-Token` var, gövde yalnız beyaz liste alanlarını taşıyor, `ip_hash` 64 hex, ham IP gövdede yok
  - Bozuk yanıtlar (`400`, `401`, `500` JSON · `413` + JSON olmayan gövde · `200 {"ok":true}` · `200` + HTML · ağ hatası) → e-posta kapalıyken 503 `no-sink`
  - `201` + okunamayan gövde → 200 `stored:true` (kayıt geçerli), `PATCH` denenmedi
  - Depo `429` → uç `429 rate-limited`, e-posta denenmedi
  - Yapılandırma eksik (URL, token ya da tuz yok) → `fetch` depoya **çağrılmadı**
  - Mevcut regresyonlar yeşil: bal küpü, `missing`, `missing-contact`, `bad-contact`, `no-consent`, `bad-json`, uç 429, kırpma, `reply_to`
  - Log casusu hiçbir senaryoda URL, token, tuz, `ip_hash` ya da kişisel veri görmüyor
- [ ] **Ürettiğim kapıyı sınadım — bozuk girdi:** yeni senaryolar kod değişmeden koşuldu ve kırmızıydı; özellikle `200 {"ok":true}`'nun ve `200` + HTML'in artık başarı sayılmadığı senaryolar. Değişiklik sonrası yeşil
- [ ] **Ürettiğim kapıyı sınadım — boş kapsam:** tuz tanımsızken depoya istek gitmiyor (fail-closed) ve kontrol grubu tuz tanımlıyken gidiyor
- [ ] TASK-1.13 sözleşme paketi aynı oturumda yerel depoya karşı hâlâ yeşil (adaptör ve paket aynı sözleşmeyi okuyor)
- [ ] Yerel uçtan uca: tarayıcıdan gönderilen form → başarı ekranı → yerel `leads_preview`'da **bir** yeni kayıt; `name`/`club`/`phone`/`email`/`branches` doğru, `ip_hash` dolu, `LEAD_FILE_PATH` boş
- [ ] Yerel depo durdurulmuşken form `503` + WhatsApp yolunu gösteriyor, "gönderildi" demiyor; depo geri gelince yeniden başarı
- [ ] `grep` taraması: `src/`, `research/`, `tests/`, `.env.example`, `README.md`, `CLAUDE.md` içinde `lead-sheet`, `Apps Script` ve `LEAD_WEBHOOK` eşleşmesi yok
- [ ] `.env.example` yalnız anahtar adı ve açıklama içeriyor
- [ ] `docker compose exec web npm run build` hatasız; `npx eslint src/app/api/demo/route.ts tests/` temiz

---

## Karar Noktaları

Dördü de run-task oturumunda, kod yazılmadan kullanıcıya sorulur; seçim ve gerekçe Oturum Kaydı'na.

- **`segment`'in yeri:** (a) mesajın başına tek satır etiket (`Segment: CrossFit`), (b) yalnız e-postada kalır, (c) v1 reposunda şemaya kolon eklenir (dokunulmaz repo, kullanıcı kararı + o repoda iş). **Önerilen: (a).** Depo tek başına okunduğunda talebin segmenti görünür kalır ve dokunulmaz repoda iş doğmaz. Boş segmentte satır eklenmez.
- **Depo `429`'u:** (a) uç `429` döner, e-posta denenmez (v1 davranışı, `api/demo.ts:274-278`), (b) kayıt yok sayılır, e-postaya düşülür. **Önerilen: (a).** Aynı IP'den saatte altıncı talep ya bot ya tekrar deneme; (b) sınırı e-posta seline çevirir. Ziyaretçi tekrar deneme mesajı görür, kayıp değil gecikmedir.
- **`notify_*` alanları:** (a) `notify_team` e-posta sonucuyla `PATCH` edilir, `notify_lead` `pending` kalır, (b) ikisi de `pending` kalır, `PATCH` yazılmaz, (c) v1 gibi talep sahibine onay e-postası da gönderilir. **Önerilen: (a).** Panelde "bildirim gitti mi" sorusu cevaplanır. `notify_lead` için `skipped` yazılmaz, çünkü v1'de anlamı "ziyaretçi e-posta vermedi"; alan adı geçişinde iki anlam aynı koleksiyonda karışır. (c) bu fazın kapsamı değil, v1 paritesi olarak Gelen Kutusu'nda bekliyor.
- **`IP_HASH_SALT` eksikse:** (a) depo denenmez, log düşer (fail-closed), (b) v1 gibi tuzsuz SHA-256'ya düşülür. **Önerilen: (a).** Tuzsuz IPv4 özeti kaba kuvvetle geri çevrilebilir, yani ham IP'yi saklamakla eşdeğerdir (12 ay saklanır). Yanlış yapılandırma TASK-1.18'in env kontrolünde ve TASK-1.06'nın `stored:true` kriterinde görünür; e-posta yolu açık kalır.

---

## Risk ve Geri Dönüş Planı

- **Adaptör canlı depoda yerelden farklı davranırsa** (nginx 413/502 HTML, canlı `trustedProxy`) → Kapı 2'nin eşi (`201` dışı her yanıt kayıt değil) yakalar, talep e-postaya düşer; TASK-1.18 tek canlı istekle ölçer.
- **Rollback:** `route.ts`, `tests/api-demo.test.ts`, `.env.example`, `README.md`, `CLAUDE.md` dosya bazlı geri alınır. Silinen iki dosya `git checkout <commit>^ -- research/lead-sheet.gs research/lead-sheet.test.mjs` ile geri gelir.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — Bunker alıcısı yerine v1'in lead deposu adaptörü)
