# TASK-1.05: Demo ucunu sertleştir — JSON yanıt doğrulaması ve `env` alanı

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.01 ✅, TASK-1.04 🔄 (kod tarafı bitti; Google dağıtımı kullanıcıda — sıra kullanıcı kararıyla atlandı, gerekçe Oturum Kayıtları'nda)

---

## Hedef

`/api/demo` ucunun webhook yazımını gerçekten doğrulanmış hâle getirmek: `res.ok` yetmez, yanıt gövdesi JSON olarak okunup `ok === true` doğrulanır. Ayrıca lead kaydına `env` alanı eklenir; değeri `deployStage`'den gelir, böylece önizlemeden gelen test satırları e-tabloda ayırt edilir. Task, HTML dönen sahte bir uçla 503 alındığında ve JSON dönen uçla satır yazıldığında tamamlanmış sayılır.

---

## Bağlam

Bugün `toWebhook` yalnız `res.ok`'a bakıyor. Apps Script betiği hata verdiğinde **200 + HTML** döner — yani uç talebi kaydedilmiş sanar, kullanıcıya "gönderildi" der ve **lead sessizce kaybolur**. Bu tam olarak ILKELER'in "gelen talep kaybolmaz" maddesinin ihlalidir ve v2'nin var oluş sebeplerinden biri v1'de aynı sınıf hatanın yaşanmasıdır.

`env` alanı kapsam tartışmasının kararı: test ve gerçek talep e-tabloda ayrılsın, önizleme satırları silinmek zorunda kalmasın. Değer `VERCEL_ENV`'den **değil** `deployStage`'den yazılır (TASK-1.01 gerekçesi).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Apps Script tuzakları" (2. madde) ve "Satır şeması"
- `research/lead-sheet.gs` — TASK-1.04'te yazılan yanıt sözleşmesi
- `src/lib/stage.ts` — TASK-1.01'de yazılan okuma yüzeyi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [x] **1. `toWebhook`'u sözleşmeye bağla**
  - `res.ok` **değilse** false
  - Gövde metin olarak okunur ve JSON parse edilir; parse başarısızsa (HTML geldi) false
  - `parsed.ok === true` değilse false
  - Başarısız her yolda `console.error` ile teşhis edilebilir bir satır loglanır — **hedef URL, token ve kişisel veri loglanmaz** (yalnız durum kodu ve `lead.at`)
  - Dosya: `src/app/api/demo/route.ts`

- [x] **2. `env` alanını ekle**
  - `type Lead`'e `env: string`; değer `DEPLOY_STAGE` (`src/lib/stage.ts`)
  - Alan hem webhook gövdesine hem JSONL dosyasına gider (aynı `lead` nesnesi)
  - Dosya: `src/app/api/demo/route.ts`

- [x] **3. E-posta gövdesine aşamayı yaz**
  - Bildirim metnine tek satır: `Ortam: <env>` — önizleme testi gelen kutusunda ilk bakışta ayrılsın
  - Dosya: `src/app/api/demo/route.ts`

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts              # toWebhook doğrulaması, Lead.env, e-posta gövdesi — zaten var
```

---

## Dikkat Noktaları

- **Mevcut davranış korunur:** bal küpü sessiz 200, uzunluk sınırları, 429, 422 doğrulamaları, "önce dayanıklı kayıt sonra e-posta" sırası ve hedefsizken 503 — hiçbiri değişmez. Bu task yalnız webhook yolunu sertleştirir ve bir alan ekler.
- **Sıra önemli:** `stored` false olduğunda `mailed` true ise uç yine 200 döner (M3 F3.3 kabul kriteri). Yani JSON doğrulaması eklemek, e-posta çalışırken talebi hataya çevirmemeli.
- Hata mesajları hedef adresi, dosya yolunu veya anahtarı **sızdırmamalı** (QUALITY 2).
- `AbortSignal.timeout(8000)` korunur; Apps Script yönlendirmesi bu süreye dâhil.
- Kişisel veri loga girmez — bugünkü `console.error` yalnız `club` ve `at` yazıyor, aynı çizgi sürdürülür.

---

## Test Kriterleri

- [x] Yerel Docker'da `LEAD_WEBHOOK_URL` **200 + HTML** dönen sahte bir uca ayarlandığında (e-posta anahtarı da tanımsızken) uç **503** ve `code: "no-sink"` döner
- [x] Aynı kurulumda uç **200 + `{"ok":true}`** dönen sahte uca ayarlandığında uç 200 ve `stored: true` döner
- [x] `200 + {"ok":false}` dönen uçta `stored` false olur (sözleşme ihlali kayıt sayılmaz)
- [ ] Gerçek Apps Script URL'siyle gönderilen talep e-tabloya düşer ve `env` sütunu `local` yazar — **TASK-1.04'ün canlı turuna devredildi**, canlı `/exec` adresi henüz yok. Bu oturumda karşılığı sahte alıcıyla ölçüldü: uca giden gövdede `"env":"local"` alanı vardı.
- [x] Bal küpü dolu istek hâlâ 200 döner ve **hiçbir yere yazmaz**
- [x] Alan uzunluğu aşımında uç **400 dönmez**, değeri `MAX` sınırına sessizce kırpar (bugünkü `clean()` davranışı); eksik ad/kulüp 422, iletişimsiz istek 422, rızasız istek 422, bozuk JSON 400, 6. istek 429 — regresyon yok
- [x] `docker compose exec web npm run build` hatasız geçer

---

## Risk ve Geri Dönüş Planı

- **Fazla katı doğrulama:** Alıcı ileride farklı bir gövde dönerse (yedek rota Sheets API) `stored` hep false olur ve her talep 503'e düşer → sözleşme `research/lead-sheet.gs` yorumunda ve bu task'ta yazılı; alıcı değişirse doğrulama da değişir.
- **Rollback:** Tek dosya, dosya bazlı geri alma.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (biri TASK-1.04 canlı turuna devredildi — yukarıda işaretli)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-11

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 ✅** — `toWebhook` artık üç kapılı: HTTP durumu (`res.ok`), gövdenin JSON olarak ayrıştırılabilmesi ve `ok === true`. Her başarısız yol ayrı bir `console.error` satırı bırakır; loga yalnız durum kodu, alıcının kendi teşhis kodu (40 karaktere kırpılı) ve `lead.at` girer. Hedef adres, token, gövde metni ve kişisel veri **loglanmaz** — ağ hatası dalında `catch` hata nesnesini bilerek yutar, çünkü `fetch` hatası hedef URL'yi taşıyabilir (QUALITY 2).
- **Alt görev 2 ✅** — `type Lead`'e `env: string` eklendi, değeri `DEPLOY_STAGE` (`src/lib/stage.ts`). Alan tek `lead` nesnesinde durduğu için hem webhook gövdesine hem JSONL dosyasına kendiliğinden gidiyor.
- **Alt görev 3 ✅** — E-posta gövdesine `Ortam: <env>` satırı girdi; önizleme testi gelen kutusunda ilk bakışta ayrılıyor.

**Sorunlar:**
- **Sıra atlandı — kullanıcı kararı.** Oturum TASK-1.04 ile açıldı ama onun kalan alt görevi (Google e-tablosu + Apps Script web app dağıtımı) kullanıcının tarayıcısında yapılacak iş. Ölçüldü: repo kökünde `.env` yok ve Vercel'de `LEAD_WEBHOOK_URL` tanımlı değil (`vercel env ls` — yalnız `DEMO_TO` / `DEMO_FROM` var). Kullanıcı "şimdi olmaz, TASK-1.05'e geç" dedi. TASK-1.04 🔄 kaldı; bu task ona kod olarak bağımlı değil, yalnız canlı adrese bağımlı olan **tek test kriterini** devretti.
- **Hız sınırı test bataryasını kesiyordu.** `limited()` IP başına 10 dakikada 5 istek sayıyor, batarya ise 20+ istek atıyor. Çözüm: her senaryo kendi `X-Forwarded-For` değeriyle koştu (route IP'yi o başlıktan okuyor); sınırın kendisi ayrı bir IP'de 6 istekle ölçüldü.

**Kararlar:**
- **Ayrıştırma `res.text()` + `JSON.parse` ile yapılıyor, `res.json()` ile değil.** `res.json()` HTML gövdede de fırlatır ama hangi kapının kırıldığını ayırt ettirmez; iki adım ayrı loglanabiliyor, teşhis canlı turda buna bakacak.
- **Dizi gövde de reddedilir.** `typeof [] === "object"` olduğu için tip kapısı diziyi geçirir; `ok !== true` kapısı yakalar. Senaryo teste eklendi, varsayım olarak bırakılmadı.
- **Alıcının `code` alanı loglanır** (`bad-token`, `busy`, `no-token-configured`). Sır değil, teşhis değeri yüksek: canlı turda yanlış token ile yanlış adresi ayırt eden tek sinyal bu. Yine de 40 karaktere kırpılıyor.

**Son Yaklaşım:**
Task tek dosyada bitti (`src/app/api/demo/route.ts`). Sözleşme kapısı `research/lead-sheet.gs` yanıt sözleşmesine bire bir bağlı — alıcı değişirse (yedek rota Sheets API) kapı da değişmeli; gerekçe `toWebhook` fonksiyon yorumunda yazılı.

**Sonraki Adım Detayı:**
TASK-1.04'ün canlı turu, kullanıcı Apps Script dağıtımını yaptığında koşar. O turda bu task'ın devredilen kriteri de kapanır: gerçek `/exec` adresine giden talep e-tabloya düşmeli ve `env` sütunu `local` yazmalı.

**Dosya Değişiklikleri:**
- `src/app/api/demo/route.ts` → `toWebhook` sözleşme doğrulaması (HTTP + JSON + `ok===true`) ve teşhis logları; `type Lead`'e `env` alanı; e-posta gövdesine `Ortam:` satırı; `@/lib/stage` importu.

**Test Sonuçları:**
<!-- Kapsam: uç, YEREL ÜRETİM DERLEMESİNE karşı serving katmanında ölçüldü (ayrı konteyner, 3200). Gerçek Apps Script davranışı (302 yönlendirmesi, yetki ekranı, kota) kapsamda DEĞİL — TASK-1.04 canlı turuna kalıyor. -->

Düzenek: `docker compose run --rm -d --name t105 --publish 3200:3000 -e LEAD_WEBHOOK_URL=http://127.0.0.1:4545/lead web sh -c "npm run build && npm start"`; aynı konteynerde sahte alıcı (mod dosyadan okunur, Next yeniden başlatılmadan senaryo değişir). Geliştirme sunucusu önce durduruldu — `.next` isimli hacim paylaşımlı (memory → Alternatif env ile üretim derlemesi).

- **Ana batarya → TOPLAM SORUN: 0** (32 kontrol). Kapsanan kriterler: HTML dönen uçta 503 + `no-sink`; `{"ok":true}` dönen uçta 200 + `stored:true` + `mailed:false`; `{"ok":false}` dönen uçta `stored` false; bal küpü 200 ve alıcıya hiçbir şey gitmedi; eksik ad/kulüp 422, iletişimsiz 422, rızasız 422, bozuk JSON 400, 6. istek 429; aşırı uzun alan 400 **dönmedi**, `name` 120 ve `branches` 10 karaktere sessizce kırpıldı.
- **Ürettiğim kapıyı sınadım — bozuk girdi:** sözleşmeyi bozan **beş** gerçek yanıt üretildi ve beşi de kırmızıya düştü (503 + `no-sink`): 200+HTML, 200+`{"ok":false}`, 500+`{"ok":true}` (HTTP kapısı), 200+bozuk JSON, 200+`[{"ok":true}]` (dizi gövde). Kontrol grubu aynı koşuda yeşil — yani kapı sözleşmeyi ölçüyor, her yanıta kırmızı basmıyor. Bozukluk **kusurun gerçekte doğduğu yerde** üretildi: kaynakta değil, alıcının döndürdüğü gövdede.
- **Ürettiğim kapıyı sınadım — eski davranışla kontrol:** bu beş yanıtın hepsi `res.ok === true` olan üçü dâhil eski kodda `stored:true` sayılacaktı; yani kapı gerçekten yeni bir şey ölçüyor, mevcut yeşili tekrarlamıyor.
- **Aşama senaryoları (memory → "ara hâl" süreç disiplini) → TOPLAM SORUN: 0** (3 senaryo, her biri kendi derlemesiyle; değer `next.config.ts`'te derlemeye gömülüyor). Kayıt hedefi `LEAD_FILE_PATH`, satır doğrudan okundu:

| # | Senaryo | Env değişkenleri | `env` alanı |
|---|---|---|---|
| S1 | Gerçek alan adı | `VERCEL=1`, `VERCEL_ENV=production`, `…PRODUCTION_URL=alpfitplus.com` | `production` ✅ |
| S2 | **Ara hâl** — projenin bugünkü gerçek hâli | `VERCEL=1`, `VERCEL_ENV=production`, `…PRODUCTION_URL=alpfitplus-web-v2.vercel.app` | `preview` ✅ |
| S3 | Fail-safe — alan adı env'i tanımsız | `VERCEL=1`, `VERCEL_ENV=production` | `preview` ✅ |
| S0 | Yerel (ana bataryada) | yok | `local` ✅ |

- `docker compose exec web npm run build` → hatasız (23 rota). `npx eslint src/app/api/demo/route.ts` → temiz, çıkış 0.
- **Kapsam dışı bırakıldı:** beş UI ölçüm betiği (a11y, mobil, font, perf, tarama) koşmadı — bu task hiçbir render yüzeyine dokunmadı, değişiklik tek bir sunucu rota işleyicisinde. Sayfa çıktısı, metin ve font kümesi bu oturumda değişmedi.

---

**Oluşturulma:** 2026-09-11
