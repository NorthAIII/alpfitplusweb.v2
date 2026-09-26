# TASK-4.10: B-065 (2/3) — `/api/demo` form kodlamalı gönderimi kabul eder ve 303 ile sonuca yönlendirir

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (modules/M3-Lead-Hatti.md)
**Feature:** F3.1 Demo formu ve talep ucu
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.09 ✅ (303'ün hedef sayfaları)

---

## Hedef

Uç, tarayıcının native form gönderimini (`application/x-www-form-urlencoded`) de kabul eder. Gövde JSON yoluyla **aynı alan şekline** normalize edilir (rıza kutusunun `"on"` değeri → `true`) ve **aynı** zincirden geçer: hız sınırı → bal küpü → doğrulama → dayanıklı kayıt → bildirimler. Zincir tek fonksiyondur; iki yol yalnız yanıt biçiminde ayrışır.

Form yolunda: **köken denetimi** (başka bir siteden gönderilen form kayda yazılmaz); başarı ve bal küpü → `303 /demo/gonderildi`; her ret → `303 /demo/gonderilemedi?neden=<kod>`. **JSON yolu ve yanıtları değişmez** (B-037 bu fazda değişmez).

Tamam sayılır: yeni form bataryası yeşil ve kendi negatif kontrolünü taşıyor; mevcut dört JSON bataryası birebir yeşil; 3100'e karşı gerçek bir form gönderimi 303 ile sonuç sayfasına gidiyor ve yanıtların hiçbirinde kişisel veri yok.

---

## Bağlam

`docs/DECISIONS.md` 2026-09-26 md. 3 (kullanıcı, B-065): native POST, uç form kodlamasını da kabul eder ve 303 ile iki sonuç sayfasından birine yönlendirir; köken kontrolü yalnız yeni yolda. Teknik Kararlar 4: hız sınırı, bal küpü ve rıza denetimi iki yolda **aynı fonksiyondan** geçer.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `src/app/api/demo/route.ts` — `POST` (plan anında `:393-501`; kullanmadan önce yeniden konumla), `clean`/`cleanLine`, `limited`, `confirmCapped`, `toStore`/`notifyStore`
- `tests/api-demo.test.ts` — dört mevcut batarya ve düzenekleri
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — **her senaryo kendi IP'sini VE kendi e-posta adresini taşır**
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — 3100 hedefsizdir (`503 no-sink`); geliştirme sunucusu gerçek önizleme deposuna bağlıdır
- `_dev/bulgular/B-037-api-demo-sertlestirme-bosluklari.md` — JSON yoluna dokunulmamasının sınırı
- `_dev/modules/M3-Lead-Hatti.md` → F3.1–F3.3 kabul kriterleri

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M3-Lead-Hatti.md` → F3.1 — form yolunun kriterleri; F3.2'nin yasal metin gözden geçirme kriteri için tek satır (aşağıda alt görev 7)

---

## Alt Görevler

- [ ] **1. İçerik türü ayrımı** — form kodlaması → `req.formData()` ile form yolu; diğer her şey → **bugünkü yol** (bugün tür bakılmadan `req.json()` deneniyor — geriye dönük uyum korunur, bozuk gövde yine `400 bad-json`).
- [ ] **2. Ortak zincir** — doğrulama + kayıt + bildirim tek fonksiyona (girdi: normalize gövde, IP, tarayıcı kimliği; çıktı: sonuç kodu + JSON gövdesi). Hız sınırı sayacı ve onay e-postası tavanı iki yolda **paylaşılır**.
- [ ] **3. Köken denetimi (yalnız form yolu)** — `Origin` isteğin kendi kökeniyle aynı değilse ya da `Sec-Fetch-Site: cross-site` ise kayda yazılmaz → `303 …?neden=origin`. `Origin` hiç yoksa: form yolu yalnız tarayıcı içindir, öneri **ret** (fail-closed); gerekçe kayda.
- [ ] **4. Yanıt** — `303` + **göreli** `Location` (`/demo/gonderildi`, `/demo/gonderilemedi?neden=…`). Göreli adres RFC 7231'de geçerlidir; `req.url` tabanı konteynerde yanlış host üretebilir — hangisi seçilirse 3100'de ölçülür.
- [ ] **5. Mesajların tek evi** — JSON `message`'ları sonuç sayfası metinleriyle aynı cümleyse ikisi de `src/content/demo-sonuc.ts`'ten okunur (TASK-4.09).
- [ ] **6. Batarya** — `tests/api-demo.test.ts` yeni `describe`: başarı (303 → gonderildi, depoya POST gitti) · bal küpü (303 → gonderildi, depoya **gitmedi**) · dört doğrulama kodu · rıza `"on"` · 429 (sayaç paylaşımı: aynı IP'den JSON + form toplamı) · 503 `no-sink` · yabancı köken (kayıt yok) · köken yok · **hiçbir yanıtta** (gövde, `Location`) ad/telefon/e-posta. Negatif kontrol: köken denetimini devre dışı bırakan geçici bir değişiklikle "yabancı köken" senaryosu kırmızı görülür, sonra geri alınır.
- [ ] **7. Yasal metin gözden geçirmesi** (M3 F3.2 kriteri: hatta yeni bir yol girdiğinde `legal.ts` aynı işte gözden geçirilir) — yeni yol yeni alıcı, alan ya da sağlayıcı getirmiyor; metne dokunulmadığının gerekçesi task kaydına ve M3'e tek satır.
- [ ] **8. Yerel ölçüm** — 3100 taze imaj: `curl` ile form türünde POST (`Origin: http://localhost:3100`) → 303 → `/demo/gonderilemedi?neden=no-sink` (3100 hedefsiz — depoya yazılmaz); yabancı `Origin` → `?neden=origin`.

---

## Etkilenen Dosyalar

```
src/app/api/demo/route.ts     # form yolu, ortak zincir, köken denetimi, 303
tests/api-demo.test.ts        # yeni batarya
src/content/demo-sonuc.ts     # mesajlar tek evdeyse (TASK-4.09'un dosyası)
```

---

## Dikkat Noktaları

- `runtime = "nodejs"`, `dynamic = "force-dynamic"` korunur; Edge kullanılmaz.
- **Köken denetimi JSON yoluna taşınmaz** — B-037'nin kapsam kararı (bu faz dışı).
- 303 POST'u GET'e çevirir (doğru olan); 307/308 formu yeniden gönderirdi — kullanılmaz.
- `lead.env` (aşama) ve `lead.ua` iki yolda aynı üretilir; `notify_*` geri yazımı aynı.
- Onay e-postası tavanı adres başına 24 saatte 3 — bataryada her senaryo **ayrı adres** (memory).
- Elle deneme geliştirme sunucusunda (3000) **yapılmaz**: `.env` üzerinden gerçek önizleme deposuna bağlıdır. Yerel deneme 3100'e (hedefsiz) ya da bataryaya.
- `npm test` tabanı 209 geçti + 2 atlandı (TASK-4.04+ ile artmış olabilir — son task'ın kaydındaki sayı esas).

---

## Test Kriterleri

- [ ] `docker compose exec web npm test` yeşil: yeni form bataryası + dört mevcut JSON bataryası **değişmeden**
- [ ] Negatif kontrol gözlendi: köken denetimi kapatılınca yabancı-köken senaryosu kırmızı
- [ ] Hiçbir form yolu yanıtında kişisel veri yok (batarya ölçer)
- [ ] 3100: form türünde POST → `303`, `Location: /demo/gonderilemedi?neden=no-sink`; yabancı köken → `?neden=origin`; JSON POST'un yanıtı bugünküyle aynı (`503` + JSON gövde)

---

## Risk ve Geri Dönüş Planı

- **Ortak zincire taşıma JSON yolunun davranışını kaydırır:** dört mevcut batarya birebir yeşil kalmadıkça task kapanmaz.
- **Rollback:** `route.ts` ve test dosyası dosya bazlı geri alınır; form yolu yokken sonuç sayfaları zararsız durur.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-26
