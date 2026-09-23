# TASK-2.07: Talep sahibine onay e-postası ve `notify_lead`'in gerçek sonucu (B-059)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.05 ✅ önerilir (ekran onayı düzeldikten sonra ikinci kanal eklenir — ikisi aynı dikişin iki yüzü)

---

## Hedef

Demo talebini gönderen ziyaretçiye **onay e-postası** göndermek (v1'de var, v2'de yok) ve depo kaydındaki `notify_lead` alanına gerçek sonucu yazmak: gönderildi / gönderilemedi / ziyaretçi e-posta vermedi.

Task, gerçek bir talepte hem ekibe hem talep sahibine e-posta gittiğinde, `notify_lead` kalıcı `pending` olmaktan çıktığında ve sözleşme bataryası üç durumu da sınadığında tamamlanmış sayılır.

---

## Bağlam

**Neden bu fazda:** Faz 1'in kapanışı ekran onayının mobilde görünmemesi (B-055) ile onay e-postasının yokluğunu **tek dikiş** olarak işaretlemişti — ikisi üst üste geldiğinde ziyaretçi talebinin ulaştığını hiçbir kanaldan öğrenemiyor. Ekran onayı bu fazda düzeldiği için e-posta ayağı da burada kapanır (kullanıcı kararı, discuss 2026-09-22). Altyapı kurulu (Resend, doğrulanmış alan adı), iş küçük.

**`notify_lead` kararı geçersiz kılındı** (kullanıcı kararı, research 2026-09-22): 2026-09-14 «Bildirim durumu» kararının dayanağı *"v2 talep sahibine e-posta göndermiyor"* idi; onay e-postası açıldığı için dayanak düştü. Alanın kalıcı `pending` kalması alan adı geçişinden sonra iki dönemin kaydını okunamaz kılardı — geçişten sonra v1 ve v2 **aynı koleksiyonu** paylaşacak. Yeni karar `docs/DECISIONS.md`'ye **yeni kayıt** olarak yazılır, eskisi geçersiz kılınır (append-only).

**v1'in karşılığı** (referans, salt okunur): `../Alpfitplus-website.v1/api/demo.ts:314-321` (`LEAD_CONFIRMATION`, `leadHtml`), `:338-341` (`to: [email]`, `reply_to: mailer.to`), `:353` (`notifyLead = !email ? 'skipped' : leadMailed ? 'sent' : 'failed'`), `:364` (PATCH gövdesi).

**B-059'un kalan iki ayağı bu fazda değil** — yasal metnin v1'den az bilgi vermesi ve depo alanlarının pariteler listesi alan adı geçişi fazında kalır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-059-alan-adi-gecisinde-v1-davranislari-geriler.md` — üç ayak, v1 satır çapaları
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 kabul kriterleri ve edge case'ler
- `_dev/docs/CLAIMS.md` — e-posta metni de bir iddia yüzeyidir (pilot cümlesi ve fiyat tek kaynaktan)
- `src/app/api/demo/route.ts:140-240` — depo yazımı, `notifyStore` (`:190`), `toEmail` (`:222`)
- `tests/api-demo.test.ts` — sözleşme bataryasının bugünkü deseni
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — senaryo başına ayrı IP

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/docs/DECISIONS.md` — **yeni kayıt:** `notify_lead` gerçek sonucu taşır; 2026-09-14 kararı geçersiz kılındı (gerekçesiyle)
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 — onay e-postası kabul kriteri olarak eklenir
- `_dev/bulgular/B-059-*.md` — (1) ve (2) ayaklarının Çözüm Kaydı; atom **açık kalır** (3. ayak geçiş fazında)

---

## Alt Görevler

- [x] **1. Onay e-postası**
  - Ziyaretçi e-posta verdiyse `toEmail` akışına ikinci bir gönderim eklenir: alıcı talep sahibi, `reply_to` ekip adresi
  - Metin `src/content/` tonuyla ve **iddia sınırıyla** uyumlu; dönüş süresi vaadi sitedeki mevcut vaatle **aynı** olmalı (üç farklı süre sorunu B-026'da kayıtlı — yeni bir süre icat etme)
  - Ekip bildirimi başarısız olsa bile talep sahibine gönderim denenir ve tersi; ikisi birbirini **bloke etmez**

- [x] **2. `notify_lead`'i gerçek sonuçla yaz**
  - PATCH gövdesi `{notify_team, notify_lead}` olur; `notify_lead` ∈ `sent` / `failed` / `skipped` (ziyaretçi e-posta vermediyse)
  - `route.ts:182-189`'daki bugünkü gerekçe yorumu **silinmez, güncellenir** — neden değiştiğini (dayanağın düşmesini) yanında taşır

- [x] **3. Sözleşme bataryasını genişlet**
  - `tests/api-demo.test.ts`: e-postalı talep → `notify_lead: "sent"` (gönderim başarılıysa), e-postasız talep → `"skipped"`, sağlayıcı reddederse → `"failed"`
  - Ziyaretçinin yanıtı (HTTP durumu) bu üç dalda da **değişmez** — onay e-postası dönüşü geciktirmez, `200`'ü `503` yapmaz

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts                # onay e-postası + notify_lead — zaten var
tests/
└── api-demo.test.ts        # üç dal için sözleşme senaryoları — zaten var
_dev/docs/DECISIONS.md      # notify_lead kararının yenisi — zaten var
```

---

## Dikkat Noktaları

- **Sıra değişmez:** dayanıklı kayıt → ekip bildirimi → talep sahibi onayı. Onay e-postası **hiçbir koşulda** kaydın önüne geçmez (`modules/M3-Lead-Hatti.md` → Teknik Notlar; v1 denetiminin dersi).
- **Ziyaretçinin yanıtını geciktirme.** Onay gönderimi ucun dönüş süresini uzatmamalı; zaman aşımı `toEmail`'in bugünkü deseniyle aynı sınırda kalır.
- **`DEMO_FROM` alan adı doğrulanmış olmalı** — değilse sağlayıcı reddeder (`modules/M3-Lead-Hatti.md` → F3.3 edge case). Reddin `notify_lead: "failed"` olarak kaydedilmesi beklenen davranıştır, hata değil.
- **Bal küpü dolu istek onay e-postası tetiklemez** — bugünkü kural: bal küpü 200 döner ama kayıt yazmaz; aynı dal e-posta da göndermemeli (bot doğrulaması sağlanmaz).
- **Kişisel veri:** e-posta gövdesi ölçüme ya da modele gitmez (`QUALITY.md` → 2 Güvenlik).
- **Yasal metin etkisi:** talep sahibine gönderim yeni bir işleme amacı değildir (iletişim zaten onaylanmış) ama TASK-2.16'nın onay metni kapsamı bu davranışla **tutarlı** olmalı — iki task birbirini kontrol eder.

---

## Test Kriterleri

- [x] `docker compose exec web npm test` yeşil; `tests/api-demo.test.ts` üç yeni dalı (`sent` / `skipped` / `failed`) kapsıyor
- [x] E-postalı gerçek talepte **iki** e-posta gidiyor: ekip adresine bildirim, talep sahibine onay (sağlayıcı yanıtı rakamıyla dokümana)
- [x] E-postasız talepte tek e-posta gidiyor ve `notify_lead: "skipped"` yazılıyor
- [x] Onay gönderimi başarısız olsa bile uç `200` dönüyor ve kayıt yazılmış durumda (fail-open yalnız **bildirim** katmanında)
- [x] Bal küpü dolu istek: kayıt yok, onay e-postası yok, HTTP `200` (bot yanıltma korunuyor)
- [x] Yerel depoya karşı uçtan uca tur: kayıtta `notify_lead` alanı `pending` **değil** (kayıt kimliğiyle dokümana)
- [x] `npm run build` hatasız

---

## Risk ve Geri Dönüş Planı

- **İkinci gönderim ucun süresini uzatırsa** ziyaretçi bekler → gönderim ekip bildirimiyle paralel yapılır ya da yanıt sonrası tetiklenir; ölçüm (uç süresi) dokümana yazılır.
- **Rollback:** `route.ts` tek dosya; `notify_lead` alanı geri `pending`'e döner (depo şeması değişmiyor, veri kaybı yok).

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Onay e-postası açıldı.** `toLeadEmail()` eklendi: alıcı talep sahibi, `reply_to` **ekibin kutusu** (`DEMO_TO`) — metnin "bu e-postayı yanıtlamanız yeterli" vaadi ancak böyle gerçekten çalışır. Ekip bildirimiyle **paralel** gider (`Promise.all`), zaman aşımı `toEmail` ile aynı (8 sn).
- **Metin `src/content/mail.ts`'e kondu** (yeni dosya, `LEAD_CONFIRMATION`): konu + düz metin gövde. Dönüş süresi vaadi formun onay kutusundaki cümlenin **aynısı** ("En kısa sürede size dönüp demo için uygun bir saat belirleyeceğiz"); v1'in "(genelde 1 iş günü içinde)" parantezi **taşınmadı**. WhatsApp numarası `CONTACT`'tan okunuyor.
- **`notify_lead` gerçek sonucu taşıyor.** PATCH gövdesi `{notify_team, notify_lead}` oldu; `notifyStore` üçüncü bir argüman alıyor ve 2026-09-14 gerekçe yorumu **silinmedi, güncellendi** (dayanağın neden düştüğü ve yeni kararın çapası yanında duruyor).
- **Sözleşme bataryası altı senaryo büyüdü** ve sahte sağlayıcı artık **alıcıya göre** cevap veriyor (`resendRejectFor`) — "biri düşse öteki gider" dalı ancak böyle ölçülebiliyor.

**Sorunlar:**
- **Yerel ortamda gönderim anahtarı yok.** `.env` yalnız beş depo anahtarı taşıyor; `RESEND_API_KEY` Vercel'de ve `--sensitive`, `vercel env pull` onu **maskeli** döndürüyor. Çözüm: kasa yordamı — `RESEND_ADMIN_KEY` ile alan adına bağlı **dar yetkili** geçici anahtar üretildi, prova sonrası **silindi** (anahtar listesi 4 → 5 → 4).
- **`vercel` komutu oturum açmamış görünüyor.** Kimlik dosyası snap sürümüyle taşınmış: `XDG_DATA_HOME` bugün `snap/code/264`'ü gösteriyor, `auth.json` ise `snap/code/263`'te. Düzeltmesiz her `vercel` çağrısı **cihaz-giriş akışı başlatıp asılıyor** (bir kez yaşandı, komut durduruldu). Geçici çözüm: çağrıya `XDG_DATA_HOME=/home/kivanc/snap/code/263/.local/share` verilir. Memory'deki Vercel atomu bu ölçümle güncellendi.
- **Canlı depoyu kirletmeme.** Dev sunucusu (3000) `.env`'den canlı `leads_preview`'a bağlı; uçtan uca tur bu yüzden **kendi geçici konteynerimde** (üretim imajı, compose ağında, `lead-store`'a yönlendirilmiş) koşuldu. İki prova konteyneri de dönüşten önce pozitif kontrolle kaldırıldı.

**Kararlar:**
- **Onay metni bileşen/uç içinde değil `src/content/mail.ts`'te.** Gerekçe: ziyaretçiye görünen her cümle bir iddia yüzeyidir (`docs/CLAIMS.md`) ve `QUALITY` 1 "metin `src/content/`'te" kuralı burada da geçerli. Ekip bildiriminin metni yerinde bırakıldı — o ziyaretçiye görünmeyen bir iç bildirimdir ve alan dökümü gönderim koduyla birlikte yaşar. docs/DECISIONS.md'ye eklendi: Hayır (yerleşik kuralın uygulanması, yeni karar değil).
- **Düz metin, HTML değil** (v1 HTML gönderiyordu). Gerekçe: uç zaten ekip bildirimini düz metin gönderiyor (tek biçim) ve ziyaretçinin yazdığı ad doğrudan gövdeye giriyor — düz metinde kaçış/enjeksiyon yüzeyi hiç açılmıyor. docs/DECISIONS.md'ye eklendi: Hayır.
- **İki gönderim paralel.** "Sıra değişmez" kuralı kaydın bildirimlerin **önüne** geçmesini emrediyor; iki bildirimi sıraya dizmek ziyaretçiyi iki zaman aşımı boyunca (8+8 sn) bekletir ve biri düştüğünde öteki denenmemiş olurdu. v1 de `allSettled` ile paralel gönderiyor. docs/DECISIONS.md'ye eklendi: Hayır (task kriterinin icrası).
- **`skipped` = gönderilecek *geçerli* adres yoktu** (yalnız "hiç e-posta vermedi" değil). Bozuk adrese gönderim denemek garanti bir sağlayıcı reddidir ve kayda **eyleme geçirilemez** bir `failed` yazdırırdı; `failed` panelde "sağlayıcı reddetti" diye okunur (v1'in kendi gerekçe notu). Kanal hiç yapılandırılmamışken ziyaretçi adres **verdiyse** değer yine `failed` — v1 ile aynı. docs/DECISIONS.md'ye eklendi: Hayır — yöneten karar zaten yazılı (2026-09-22 «Onay e-postası açılınca `notify_lead` gerçek sonucu taşır»); bu onun uygulama okuması ve gerekçesi `route.ts` → `NotifyLead` tipinin yanında duruyor.

**Kalan İşler:**
- Yok. B-059'un kalan **üçüncü** ayağı (yasal metnin v1'den az bilgi vermesi) tasarım gereği alan adı geçişi fazında; atom açık kalıyor.

**Son Yaklaşım:** —

**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/content/mail.ts` → **yeni.** `LEAD_CONFIRMATION` (konu + düz metin gövde); `CONTACT`'tan WhatsApp numarasını okuyor.
- `src/app/api/demo/route.ts` → `toLeadEmail()` eklendi; `NotifyLead` tipi ve `notify_lead` hesabı; `notifyStore` üçüncü argüman alıyor ve PATCH gövdesi iki alanlı; iki gönderim `Promise.all` ile paralel; 2026-09-14 gerekçe yorumu güncellendi.
- `tests/api-demo.test.ts` → sahte sağlayıcı alıcıya göre cevap veriyor (`resendRejectFor` + `recipientOf`); iki mevcut PATCH testi yeni sözleşmeye çekildi; bal küpü testi artık e-posta kanalı **açıkken** koşuyor; TASK-2.07 bloğu (6 senaryo).

**Test Sonuçları:**
- **Kontrol grubu — batarya kırmızıyı gösterebiliyor:** testler **kod değişmeden önce** koşuldu → **7 kırmızı / 65 yeşil / 1 atlandı**. Kırmızılar tam da yeni sözleşmenin dallarıydı (PATCH gövdesi, ikinci gönderim); "üç dalda da yanıt aynı" senaryosu tabanda da yeşildi, çünkü yanıt gövdesi bilerek değişmiyor.
- `docker compose exec web npm test` (uygulamadan sonra): **6 dosya, 72 geçti + 1 atlandı** (taban 66+1 → +6 senaryo). Atlanan: depo sözleşme paketi (`LEAD_CONTRACT_URL` tanımsız, olağan).
- `npx tsc --noEmit` → çıkış 0.
- Üretim derlemesi: `docker compose build web-prod` hatasız (imajın builder katmanında; paylaşılan `next_cache`'e dokunulmadı). 3100 yeni imaja alındı: `/demo` HTTP **200 / 74.747 B** — TASK-2.06'nın rakamıyla birebir, arayüzün değişmediğinin yan kanıtı.
- **Uçtan uca tur — yerel `lead-store`'a karşı** (geçici konteyner: üretim imajı, `LEAD_STORE_URL=http://lead-store:8090`, önizleme token'ı; canlı `leads_preview` deposuna **hiçbir kayıt yazılmadı**):
  - Gerçek talep → HTTP **200** `{ok:true,stored:true,mailed:true}`, uç süresi **575 ms** (iki gönderim paralel).
  - Kayıt `2f0kswpek4ivyyd` → `notify_team: sent` · **`notify_lead: sent`**. Aynı sorgunun bir önceki kaydı (2026-09-22, değişiklikten önce) `notify_lead: pending` — kontrol grubu.
  - **İki e-posta da `delivered`:** onay `01a0cbda-b7b1-75da-b657-e9723fcdac8e` ("Talebiniz bize ulaştı — Alpfit Plus"), ekip bildirimi `01a0cbda-b734-7755-a3e0-1f6d71a77e47`; sağlayıcı damgaları **214 ms** arayla (paralelliğin kanıtı). Onayın gövdesi sağlayıcıdan geri okundu: `from` `demo@alpfitplus.com`, `reply_to` **ekibin kutusu**, `html` alanı **boş** (düz metin), metin `mail.ts`'teki cümlelerin aynısı.
  - **Üç değerin üçü de gerçek depo hook'una yazıldı:** ikinci prova turu geçersiz bir sağlayıcı anahtarıyla koşuldu (hiç e-posta gitmedi, sağlayıcı listesi değişmedi) → `4ih3pu3sd4m85kr` e-postasız talep **`notify_lead: skipped`**, `g1jxcb84qmyvlyr` e-postalı talep **`notify_lead: failed`**. Depo hiçbirini reddetmedi; v2 artık `pending` kayıt bırakmıyor.
- **Koşulmayan ölçümler ve gerekçesi:** `a11y` · `mobile-audit` · `scan` · `font-guard` koşulmadı — değişiklik render edilen hiçbir yüzeye dokunmuyor (`src/components/**` ve `src/app/**/page.tsx` altında tek satır değişmedi; `mail.ts` yalnız uçtan okunur). 3100'ün `/demo` bayt sayısının birebir aynı kalması bu kapsamın dışında kalındığını ayrıca gösteriyor.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-23

**Ne Yapıldı:**
- Talep sahibi artık talebini gönderdiğinde **ikinci bir kanaldan** da onay alıyor: ekran kutusu (TASK-2.05/2.06) yanında bir e-posta. Gerçek turda iki e-posta da `delivered`.
- Depo kaydındaki `notify_lead` kalıcı `pending` olmaktan çıktı; üç değerin üçü de (`sent` / `skipped` / `failed`) gerçek depoya yazılarak ölçüldü. Alan adı geçişinde v1 ile aynı koleksiyonu paylaştığında iki dönemin kaydı okunabilir kalıyor.
- B-059'un **iki ayağı kapandı** (onay e-postası + `notify_lead`); üçüncü ayak (yasal metin paritesi) tasarım gereği alan adı geçişi fazında, atom **açık** kalıyor.

---

**Oluşturulma:** 2026-09-22
