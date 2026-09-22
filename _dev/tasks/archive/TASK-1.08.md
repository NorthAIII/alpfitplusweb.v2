# TASK-1.08: Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit`

**Durum:** ✅ Tamamlandı
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · dokunulan yüzey M3
**Feature:** F7.4: Analitik olay sayımı
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.07 ✅, TASK-1.06 ✅ (önizlemedeki `demo-submit` kriteri başarılı gönderim ister — canlı kayıt ve e-posta hattı açılmadan uç 503 döner ve olay gönderilmez; 2026-09-13 plan revizyonu)

---

## Hedef

Olay göndermenin tek yüzeyini kurmak (`src/lib/analytics.ts`): olay adları ve yüzey etiketleri sabitlenir, `track()` sarmalayıcısı Umami yoksa sessiz geçer. İlk tüketici demo formudur — başarı anında `demo-submit` olayı gönderilir. Task, panelde `demo-submit` olayı `surface=demo-form` özelliğiyle göründüğünde tamamlanmış sayılır.

---

## Bağlam

Araştırma kararı: olay adları `demo-submit` / `whatsapp-click` / `phone-click`, tek özellik `surface`. Etiket kümesi **tek dosyada** sabitlenir ki panelde dağınık ad çıkmasın — bir kez dağıldıktan sonra geçmiş veriyi toparlamak mümkün değil.

Sarmalayıcı ayrı bir dosya olarak burada doğar çünkü iki tüketicisi var: bu task'taki form gönderimi ve TASK-1.09'daki global tıklama dinleyicisi. Dinleyiciden önce yazılması sırayı doğru kurar.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Yüzey etiketleri (`data-surface`) için hazır çapalar" ve "Umami yoksa sessiz geç"
- `src/components/sections/DemoForm.tsx` → `state === "ok"` geçişi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [x] **1. Olay sözlüğünü yaz**
  - Olay adları sabit: `demo-submit`, `whatsapp`, `phone` — **v1 ile hizalandı** (plandaki `whatsapp-click`/`phone-click` yerine; karar `docs/DECISIONS.md` 2026-09-22, bkz. Oturum Kaydı) — Umami olay adı sınırı 50 karakter, üçü de rahat
  - Yüzey etiketleri sabit listesi: `hero`, `final-cta`, `footer`, `header`, `assistant`, `demo-form`, `demo`, `destek`, `404`, artı mevcut bölüm id'leri — `<Section id=…>` verenler (`segmentler`, `sss`, `neden`, `roller`, `fiyat`, `moduller`, `fayda`) **ve ham `<section id=…>` verenler** (`sorun` → `Chaos.tsx`, `nasil-calisir` → `HowItWorks.tsx`, `cozum` → `Solution.tsx`); dinleyicinin `section[id]` yedeği ikisini de yakalar, bugün bu üçünde bağlantı yok ama ileride eklenirse etiket sözlükte hazır olur
  - Tip düzeyinde daraltma (yüzey adı serbest string olmasın) — panelde dağınık ad çıkmasını kod engellesin
  - Dosya: `src/lib/analytics.ts` (YENİ)

- [x] **2. `track()` sarmalayıcısını yaz**
  - `window.umami?.track(ad, { surface })` — Umami yoksa **hata fırlatmaz, sessiz geçer**
  - Sunucu tarafında çağrılırsa (window yok) sessiz döner
  - **Kişisel veri parametre olarak alınmaz** — imza yalnız olay adı + yüzey kabul eder, serbest veri alanı yok
  - Dosya: `src/lib/analytics.ts` (YENİ)

- [x] **3. Demo gönderimini bağla**
  - `DemoForm` başarı durumuna geçtiğinde (`setState("ok")` yolu) `track("demo-submit", "demo-form")`
  - Hata ve 503 yollarında olay **gönderilmez** (dönüşüm sayılmaz)
  - Dosya: `src/components/sections/DemoForm.tsx`

---

## Etkilenen Dosyalar

```
src/lib/
└── analytics.ts          # YENİ — olay adları, yüzey sözlüğü, track() sarmalayıcısı
src/components/sections/
└── DemoForm.tsx          # başarı anında demo-submit — zaten var
```

---

## Dikkat Noktaları

- **Kişisel veri olaya girmez** (telefon, e-posta, kulüp adı, mesaj) — QUALITY 2 ve KVKK asgarilik. Sarmalayıcının imzası bunu yapısal olarak imkânsız kılmalı.
- Olay yalnız **gerçek başarıda** gönderilir; bal küpü dolu istek de 200 döner ama form zaten `json.ok`'a bakıyor — bot gönderimi başarı sayılırsa sayım şişer. Mevcut `res.ok && json.ok` koşulu korunur, olay o dalın içine konur.
- Umami tanımsızken sayfa **hatasız** çalışmalı — dönüşüm akışı analitiğe bağımlı olmamalı.
- Yüzey listesi bu dosyada büyür; TASK-1.09 yeni ad **icat etmez**, buradan seçer.
- **Betik adresinin evi bu task'ta karara bağlanır** (TASK-1.07 Dikkat Noktaları devretti): `https://umami.kiwiailab.com/script.js` `layout.tsx`'te sabit olarak mı kalır, `analytics.ts`'e mi taşınır. Taşınırsa `src/app/layout.tsx` de değişir; karar ve gerekçe Oturum Kaydı'na.

---

## Test Kriterleri

- [x] Yerelde Umami env'i tanımsızken demo formu gönderimi hatasız tamamlanır, konsol temiz (`scan.mjs /demo`)
- [x] Yerelde Umami tanımlıyken başarılı gönderimde ağ sekmesinde Umami olay isteği görünür
- [x] Başarısız gönderimde (hedefler kapalı, 503) olay **gönderilmez**
- [ ] Önizlemede gönderilen talep panelde `demo-submit` / `surface=demo-form` olarak görünür — kanal: UAT
- [x] TypeScript: yüzey sözlüğünde olmayan bir etiket derleme hatası verir
- [x] `docker compose exec web npm run build` hatasız geçer

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (UAT'a devreden bir kalem hariç — bkz. Test Kriterleri)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-22

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- `src/lib/analytics.ts` (YENİ) yazıldı: `EVENTS` (`demo-submit`/`whatsapp`/`phone`), `SURFACES` (19 etiket — 9 sabit yüzey + 10 bölüm id'si), tip düzeyinde daraltılmış `EventName`/`Surface`, `track()` sarmalayıcısı (`window.umami?.track(event, { surface })`, window/umami yoksa sessiz döner, imza yalnız 2 parametre)
- `src/components/sections/DemoForm.tsx`: `track("demo-submit", "demo-form")` yalnız `res.ok && json.ok` dalına bağlandı (bal küpü/hata dallarında çağrılmaz)
- `src/app/layout.tsx`: davranış değişmedi, yalnız `UMAMI_SCRIPT_SRC`'nin neden `analytics.ts`'e taşınmadığını açıklayan kısa bir pointer yorumu eklendi (Dikkat Noktaları #5 kararı)
- `tests/analytics.test.ts` (YENİ): `track()` için 3 birim testi (window yok / umami yok / umami var+doğru çağrı)

**Sorunlar:**
- `docker compose exec web npm run build` çalıştırıldıktan sonra `.next` içine üretim derleme çıktısı yazıldı (`web`'in kendi `next_cache` hacmi, çalışan `next dev` süreciyle aynı) — ölçülen bir kırılma yoktu (build sonrası `/`, `/demo`, `/api/demo` hemen doğru koda döndü, dev log temizdi) ama `_dev/memory/alternatif-env-ile-uretim-derlemesi.md`'nin "ezer" uyarısıyla örtüştüğü için ihtiyaten `docker compose restart web` uygulandı ve sonrası da temiz ölçüldü. Not memory atomuna eklendi (aşağıda).

**Kararlar:**
- **Olay adları v1 ile hizalandı** (`whatsapp-click`/`phone-click` → `whatsapp`/`phone`): alan adı geçişinde v2'nin v1'in Umami kaydına devralınacağı (2026-09-14 kararı) göz önüne alınınca adların birebir eşleşmesi gerekiyordu, yoksa geçiş günü seri ikiye bölünür. `docs/DECISIONS.md`'ye eklendi: **Evet** (2026-09-22 girişi).
- **Betik adresi (`UMAMI_SCRIPT_SRC`) `layout.tsx`'te kaldı, `analytics.ts`'e taşınmadı** (Dikkat Noktaları #5): script YÜKLEME kaygısı (strateji, `data-tag`, `data-exclude-search`) JSX'e özgü; `analytics.ts`'in işi olay GÖNDERMEK. İki tüketicisi (DemoForm, TASK-1.09) de yalnız `track()`'i okuyor, betik adresini değil — taşımanın somut faydası yoktu.
- **v1'in `email`/`instagram`/`cta` olayları açılmadı** — v2'de bugün hiçbir tüketicisi yok (TASK-1.09 de yalnız whatsapp/phone ele alıyor); kullanılmayan sabit yazılmadı (YAGNI, Bakım Maliyeti ekseni).

**Kalan İşler:** (varsa)
- `tasks/TASK-1.09.md` ve `phases/PHASE-1-ARASTIRMA.md` hâlâ eski olay adlarını (`whatsapp-click`/`phone-click`) yazıyor — bu task'ın kapsamı dışı (başka task'ın plan metni), `BULGULAR.md` → Gelen Kutusu'na düşüldü; TASK-1.09 çalıştırılmadan önce hizalanmalı.
- Panelde `demo-submit`/`surface=demo-form` görünürlüğü — kanal: UAT (verify-phase).

**Dosya Değişiklikleri:**
- `src/lib/analytics.ts` → YENİ (olay sözlüğü, yüzey sözlüğü, `track()`)
- `src/components/sections/DemoForm.tsx` → `track()` içe aktarıldı, başarı dalına 1 satır eklendi
- `src/app/layout.tsx` → yalnız açıklayıcı yorum eklendi, davranış değişmedi
- `tests/analytics.test.ts` → YENİ (3 test)
- `docs/DECISIONS.md` → 2026-09-22 kararı eklendi (append)
- `BULGULAR.md` → Gelen Kutusu'na 1 satır, Son Güncelleme satırı güncellendi
- `memory/alternatif-env-ile-uretim-derlemesi.md` → `exec` özelinde bir gözlem paragrafı eklendi

**Test Sonuçları:**
- `docker compose exec web npm test` (Vitest, `tests/`): **56 geçti, 1 atlandı** (lead-store contract, env kapısı tanımsız) — `tests/analytics.test.ts` 3/3 dahil
- TS kapı sınaması (`npx tsc --noEmit -p tsconfig.json`, scratch dosya): geçersiz `surface` literali (`"yanlis-yuzey"`) **TS2345** ile reddedildi (pozitif kontrol); `@ts-expect-error` ile aynı satır hatasız geçti (negatif kontrol) — tip daraltması gerçek, dosya sonra silindi
- `docker compose exec web npm run build`: **hatasız geçti** (23 rota, `/demo` dahil statik üretildi)
- `scan.mjs /demo` (research konteyneri, 500×900): `5 kare · sayfa 4234px · konsol temiz`
- Playwright scratch (research konteyneri, dev sunucusu 3000, gerçek Chrome UA): gerçek `/api/demo` gönderimi başarı ekranına geçti, konsol temiz, `window.umami.track` **tam olarak** `["demo-submit", {"surface":"demo-form"}]` ile çağrıldı (1 kez); `/api/demo` 503'e zorlanınca (`page.route` ile) `track` **hiç** çağrılmadı
- Gerçek ağ doğrulaması (izole konteyner, port 3200, gerçek v2 Umami website id `640b05f1-…`, `web`'in `.next`'ine dokunmadan — rsync kopya + salt-okunur `node_modules`, `alpfitplus-web_default` ağına bağlanarak yerel `lead-store`'a erişti): gerçek gönderimde `umami.kiwiailab.com/api/send`'e **2 istek** (otomatik pageview + `demo-submit`), ikisi de `200` ve gövdede gerçek `sessionId`/`visitId` döndü (B-056 bot-reddi `{"beep":"boop"}` DEĞİL — gerçek kayıt kanıtı). İzole konteyner ve rsync kopyası iş bitince silindi, port 3200 boşaltıldı, `web`'e dokunulmadı.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-22

**Ne Yapıldı:**
- Olay gönderme sarmalayıcısı (`src/lib/analytics.ts`) tek yüzey olarak kuruldu: olay adları v1 ile hizalı (`demo-submit`/`whatsapp`/`phone`), yüzey etiketleri tip düzeyinde daraltıldı, `track()` Umami yoksa/sunucu tarafında sessiz kalıyor
- Demo formunun başarılı gönderimi `demo-submit`/`surface=demo-form` olayını gönderiyor; hata/bal küpü dallarında olay gitmiyor
- Gerçek Umami sunucusuna karşı uçtan uca doğrulandı (izole konteyner, gerçek website id): istek `sessionId`/`visitId` ile 200 döndü

**Öğrenilenler:**
- `docker compose exec web npm run build` — CLAUDE.md'nin kendi kanonik komutu — de `web`'in çalışan `next dev`'iyle aynı `next_cache` hacmini paylaşıyor; bu turda görünür bir kırılma ölçülmedi ama ihtiyaten `restart` uygulandı, not memory'ye düştü (bkz. Sorunlar)
- v1-hizası hedefi (2026-09-14 kararı) ile 2026-09-13'ün `-click` ekli olay adı kararı arasında bir çelişki vardı; eski kararın gerekçesi mimariyi savunuyordu, ad seçimini değil — çelişmeyen güçlü bir gerekçe yoktu, yeni kayıt (append-only) eklendi

---

**Oluşturulma:** 2026-09-11
