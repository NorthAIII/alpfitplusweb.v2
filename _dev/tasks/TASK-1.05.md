# TASK-1.05: Demo ucunu sertleştir — JSON yanıt doğrulaması ve `env` alanı

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.01 ✅, TASK-1.04 ✅

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

- [ ] **1. `toWebhook`'u sözleşmeye bağla**
  - `res.ok` **değilse** false
  - Gövde metin olarak okunur ve JSON parse edilir; parse başarısızsa (HTML geldi) false
  - `parsed.ok === true` değilse false
  - Başarısız her yolda `console.error` ile teşhis edilebilir bir satır loglanır — **hedef URL, token ve kişisel veri loglanmaz** (yalnız durum kodu ve `lead.at`)
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **2. `env` alanını ekle**
  - `type Lead`'e `env: string`; değer `DEPLOY_STAGE` (`src/lib/stage.ts`)
  - Alan hem webhook gövdesine hem JSONL dosyasına gider (aynı `lead` nesnesi)
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **3. E-posta gövdesine aşamayı yaz**
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

- [ ] Yerel Docker'da `LEAD_WEBHOOK_URL` **200 + HTML** dönen sahte bir uca ayarlandığında (e-posta anahtarı da tanımsızken) uç **503** ve `code: "no-sink"` döner
- [ ] Aynı kurulumda uç **200 + `{"ok":true}`** dönen sahte uca ayarlandığında uç 200 ve `stored: true` döner
- [ ] `200 + {"ok":false}` dönen uçta `stored` false olur (sözleşme ihlali kayıt sayılmaz)
- [ ] Gerçek Apps Script URL'siyle gönderilen talep e-tabloya düşer ve `env` sütunu `local` yazar
- [ ] Bal küpü dolu istek hâlâ 200 döner ve **hiçbir yere yazmaz**
- [ ] Alan uzunluğu aşımında uç **400 dönmez**, değeri `MAX` sınırına sessizce kırpar (bugünkü `clean()` davranışı); eksik ad/kulüp 422, iletişimsiz istek 422, rızasız istek 422, bozuk JSON 400, 6. istek 429 — regresyon yok
- [ ] `docker compose exec web npm run build` hatasız geçer

---

## Risk ve Geri Dönüş Planı

- **Fazla katı doğrulama:** Alıcı ileride farklı bir gövde dönerse (yedek rota Sheets API) `stored` hep false olur ve her talep 503'e düşer → sözleşme `research/lead-sheet.gs` yorumunda ve bu task'ta yazılı; alıcı değişirse doğrulama da değişir.
- **Rollback:** Tek dosya, dosya bazlı geri alma.

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

**Oluşturulma:** 2026-09-11
