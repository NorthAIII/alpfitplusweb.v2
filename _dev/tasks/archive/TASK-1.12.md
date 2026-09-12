# TASK-1.12: İletişim biçimi doğrulaması (B-021)

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.1: Demo formu ve talep ucu (F3.2 bağlantısının ön koşulu)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.11 ✅ (Bunker'ın beklediği alan biçimi varsa kurala girer), TASK-1.16 ✅ (testler Vitest'e yazılır)

---

## Hedef

`/api/demo` telefon ve e-postanın **biçimini** sunucuda doğrulasın. İkisinden en az biri geçerli olmayan talep açık bir 422 mesajıyla reddedilsin; form hatayı ilgili alanla ilişkilendirip odağı oraya taşısın.

Task, `bu-eposta-degil` ve `abcdef!!!` sınıfı talepler reddedildiğinde, meşru Türkiye telefon yazımları ve geçerli e-postalar kabul edildiğinde ve hata ekran okuyucuya alan üzerinden bildirildiğinde tamamlanmış sayılır.

---

## Bağlam

B-021 (🔴): sunucu bugün yalnız alanların **varlığına** bakıyor (`route.ts:219-230`), biçimine bakmıyor. İstemci doğrulaması da `noValidate` yüzünden kapalı.

Bugün her talep `no-sink` 503 ile bittiği için kusur görünmüyor. Hedef bağlandığı gün (TASK-1.14) ulaşılamaz talep **200** dönecek, Bunker'a yazılacak ve kullanıcı "Talebiniz bize ulaştı" görecek. Kimse ona dönemeyecek, kayıp hiçbir istatistiğe girmeyecek. Bu yüzden task bağlantıdan **önce** gelir (revizyon kararı 2026-09-13).

**Kapsam sınırı — kullanıcı kararı:** bu fazda lead hattı bulgularından yalnız B-021 alındı.

- B-020 (kota doğrulamadan önce sayıyor + `noValidate`) açık bir `[audit-product SORU]`; cevabı alınmadı. Bu yüzden `noValidate` **kaldırılmaz**, kota sırası **değişmez**.
- B-036 ve B-037 bu fazın dışında.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-021-iletisim-formati-dogrulanmiyor.md` — gözlem, kanıt ve koruma önerisi
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — Bunker'ın beklediği alan biçimi (varsa)
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — her senaryo kendi `X-Forwarded-For`'unu taşır
- `tests/api-demo.test.ts` (TASK-1.16'da doğdu) — route bataryası; bu task genişletir
- `src/app/api/demo/route.ts` → `clean()`, doğrulama sırası, `toEmail` → `reply_to`
- `src/components/sections/DemoForm.tsx` → hata durumu, `Field` bileşeni

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/bulgular/B-021-iletisim-formati-dogrulanmiyor.md` — Çözüm Kaydı taslağı (arşivleme verify-phase'in işi; atom `→ TASK-1.12` işaretinde bekler)

---

## Alt Görevler

- [x] **1. Biçim kuralını saf fonksiyon olarak yaz**
  - E-posta: basit biçim (`yerel@alan.uzantı` sınıfı). Katı RFC denetimi yok; amaç çöpü elemek, meşru kullanıcıyı zorlamamak
  - Telefon: boşluk, tire, parantez ve baştaki `+` atıldıktan sonra rakam sayısı eşiği. Türkiye yazımları kabul: `05321112233`, `5321112233`, `+90 532 111 22 33`, `(0532) 111-22-33`. Harf içeren değer red
  - Kural: **en az biri geçerli olsun** (B-021 önerisi; dönüşüm önceliği). İkisi de boşsa mevcut `missing-contact` korunur. Dolu alanlar var ama hiçbiri geçerli değilse yeni kod `bad-contact` döner (422, alan adına göre ayrışan mesajla)
  - Dosya: `src/lib/contact.ts` (YENİ) — saf fonksiyon, Vitest'te sınanır

- [x] **2. Uca bağla**
  - Doğrulama mevcut sıraya girer: `missing` → `missing-contact` → **biçim** → `no-consent`
  - Doğrulama `clean()` kırpmasından **sonraki** değere uygulanır. 160 karaktere kırpılıp `@alan` kısmını kaybeden e-posta böylece geçersiz sayılır
  - `toEmail` → `reply_to` yalnız e-posta **geçerliyse** set edilir. Telefon geçerli, e-posta bozuk talep kabul edilir ama bildirim bozuk adrese yanıtlanmaz
  - Dosya: `src/app/api/demo/route.ts`

- [x] **3. Hatayı alanla ilişkilendir**
  - Uçtan dönen `code` → alan eşlemesi tek tabloda: `missing` → ad/kulüp, `missing-contact` / `bad-contact` → telefon + e-posta, `no-consent` → onay kutusu
  - Eşleşen alana `aria-invalid="true"` ve hata metnine bağlanan `aria-describedby`; gönderim sonrası odak ilk hatalı alana taşınır
  - Mevcut genel hata kutusu (`role="alert"`, WhatsApp bağlantısı) ve kullanıcının yazdığı değerler **korunur**
  - Dosya: `src/components/sections/DemoForm.tsx`

- [x] **4. Testleri önce yaz**
  - Saf fonksiyon senaryo tablosu ve route senaryoları, kod değişmeden **önce** yazılır ve kırmızı görülür (kapı yeni bir şey ölçüyor mu sorusunun cevabı budur)
  - Dosyalar: `tests/contact.test.ts` (YENİ), `tests/api-demo.test.ts` (TASK-1.16'da YENİ; genişler)

---

## Etkilenen Dosyalar

```
src/lib/
└── contact.ts            # YENİ — e-posta/telefon biçim kuralı (saf fonksiyon)
src/app/api/demo/
└── route.ts              # biçim kapısı, reply_to koşulu — zaten var
src/components/sections/
└── DemoForm.tsx          # code → alan eşlemesi, aria-invalid, odak — zaten var
tests/
├── contact.test.ts       # YENİ — biçim kuralı senaryo tablosu
└── api-demo.test.ts      # bad-contact ve reply_to senaryoları — TASK-1.16'da YENİ
```

> Üç ürün dosyası + iki test dosyası: testler kuralın kabul ölçüsüdür, ondan ayrılamaz.

---

## Dikkat Noktaları

- **B-020 kapsam dışı:** `noValidate`, kota sırası ve istemci zaman aşımına dokunma. Kota doğrulamadan önce saydığı için test bataryası senaryo başına ayrı `X-Forwarded-For` göndermezse 6. istekten sonra sahte kırmızı okur (memory).
- **Mevcut davranış korunur:** bal küpü sessiz 200, `MAX` kırpması, 400 `bad-json`, 429, hedefsizken 503, üç kapılı webhook sözleşmesi (TASK-1.05). Doğrulama katmanı yalnız **genişler**.
- **Kişisel veri loga girmez.** Reddedilen değer loglanmaz, yalnız kod.
- **Metin `src/content/`'te mi?** Uç mesajları bugün `route.ts` içinde duruyor; bu task deseni değiştirmez, yeni mesaj aynı yere yazılır. Hata metnine yeni karakter girerse `font-guard.mjs` yakalar (STYLE-GUIDE).
- Tek kişilik ekip ve dönüşüm önceliği: kural gevşek tarafta hata yapsın. Meşru bir yazımı reddetmek, çöp bir yazımı kabul etmekten pahalıdır. Sınır vakaları Oturum Kaydı'na tabloyla yazılır.
- B-036'nın kırpma kalemi (3) bu değişiklikle **kısmen** etkilenir: e-posta kırpılıp geçersizleşirse artık reddedilir. B-036 bu task'ta kapanmaz; etki Oturum Kaydı'na not düşülür.

---

## Test Kriterleri

- [x] `tests/contact.test.ts` (Vitest): alt görev 1'deki dört telefon yazımı kabul; `abcdef!!!`, 9 haneli rakam dizisi ve harfli değer red; `ad@kulup.com` kabul; `bu-eposta-degil`, `a@b`, `@x.com` red
- [x] `tests/api-demo.test.ts` genişledi (senaryo başına ayrı `x-forwarded-for`; hedef sahte alıcı):
  - `{email:"bu-eposta-degil"}` ve telefon yok → 422 `bad-contact`, alıcıya çağrı **yok**
  - `{phone:"abcdef!!!"}` ve e-posta yok → 422 `bad-contact`, çağrı yok
  - Geçerli telefon + bozuk e-posta → 200; Resend'e giden gövdede `reply_to` **yok**
  - Kontrol grubu: geçerli e-posta → 200, `reply_to` var
- [x] **Ürettiğim kapıyı sınadım:** yeni senaryolar değişiklikten önce koşuldu ve iki red senaryosu **kırmızıydı**; değişiklik sonrası yeşil. Kapı yeni bir şey ölçüyor, mevcut yeşili tekrarlamıyor
- [x] Regresyon: TASK-1.16 bataryasının tamamı yeşil (bal küpü, 422'ler, 400, 429, beş bozuk alıcı yanıtı)
- [x] Tarayıcıda (araştırma konteyneri, `/demo`, dev 3000): bozuk e-posta ile gönderim sonrası e-posta alanında `aria-invalid="true"`, `aria-describedby` hata metnini gösteriyor, odak o alanda; yazılan değerler yerinde
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs /demo` konsol temiz
- [x] `docker compose exec web npm run build` hatasız; `npx eslint src/lib/contact.ts src/app/api/demo/route.ts tests/` temiz
- [x] `DemoForm.tsx`'te **yeni** lint hatası yok: öncesi 4 kalem `react/no-unescaped-entities` (B-028; satır 60/65/169/192, 2026-09-13 ölçümü), sonrası aynı 4 kalem (satır numaraları kaydı: 87/92/221/244 — içerik değişmedi, önceki satırların üstüne eklenen satır sayısı kadar kaydı). B-028 bu task'ta düzeltilmedi — kuralın kapatılıp kapatılmayacağı açık bir karar (verify-plan kullanıcı kararı 2026-09-13)

---

## Risk ve Geri Dönüş Planı

- **Fazla katı kural meşru talebi reddeder** (dönüşüm kaybı; ILKELER 1. eksen) → senaryo tablosu meşru yazımlarla başlar; şüphede kabul tarafı seçilir.
- **Rollback:** Ürün ve test dosyaları dosya bazlı geri alınır; `contact.ts` ve `contact.test.ts` yeni olduğu için silinmesi yeterli.

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

**Durum:** ✅ Tamamlandı

**Yapılanlar:**

- **1. Saf fonksiyon** (`src/lib/contact.ts`, YENİ): `isValidEmail` (basit `yerel@alan.uzantı` regex'i), `isValidPhone` (boşluk/tire/parantez/baştaki `+` atılır, kalan rakam 10/11 hane ya da `90` önekiyle 12 hane olmalı — dört meşru Türkiye yazımını (`05321112233`, `5321112233`, `+90 532 111 22 33`, `(0532) 111-22-33`) kabul eder, harfli/9 haneli değeri reddeder), `checkContact(phone, email)` — en az biri geçerliyse `ok:true`; ikisi de geçersizse alan adına göre ayrışan Türkçe mesajla `ok:false`.
- **2. Uca bağlama** (`route.ts`): doğrulama sırasına `missing-contact` ile `no-consent` arasına `checkContact` girdi (yeni kod `bad-contact`, 422). `toEmail`'de `reply_to` artık yalnız `isValidEmail(lead.email)` doğruysa set ediliyor — telefon geçerli + e-posta bozuk talep kabul ediliyor ama Resend gövdesine `reply_to` girmiyor.
- **3. Alan ilişkilendirme** (`DemoForm.tsx`): `FIELD_ERRORS` tablosu (`missing`→ad/kulüp, `missing-contact`/`bad-contact`→telefon+e-posta, `no-consent`→onay). `Field` bileşeni `invalid` prop'u aldı, `aria-invalid` ve (hint'le birleşen) `aria-describedby` üretiyor; genel hata kutusuna (`role="alert"`) `id="demo-form-error"` eklendi, tüm işaretli alanlar oraya bağlanıyor. Odak yönetimi ilk denemede **statik ilk alana** gidiyordu (phone) — tarayıcı testinde yalnız e-posta doluyken bozuksa odağın telefon'a gittiği görüldü (kabul kriteri "odak o alanda" ile çelişiyordu); düzeltme: odak, eşlenen alanlar arasında **gerçekten dolu olana** gidiyor (`data[name]` doluluk kontrolü), ikisi de boşsa (missing/missing-contact) ilk alana düşüyor.
- **4. Testler önce yazıldı:** `tests/contact.test.ts` (YENİ, 20 senaryo) ve `tests/api-demo.test.ts`'e 5 yeni senaryo (bad-contact × 2 yön, kabul × 1, Resend `reply_to` kontrol grubu + bozuk e-posta) — kod değişmeden önce koşuldu, iki red senaryosu (`bad-contact` × 2) ve `reply_to` senaryosu kırmızıydı (bkz. Test Sonuçları).

**Sorunlar:**
- **Odak hedefi ilk taslakta yanlış alana gidiyordu:** `FIELD_ERRORS["bad-contact"] = ["phone","email"]` sabit sırasıyla her zaman `phone`'a focus veriyordu; yalnız e-posta doldurulup bozulduğunda telefon boş olduğu hâlde odağı alıyordu. Tarayıcı testinde (Playwright, araştırma konteyneri) yakalandı → çözüm: odak, aynı koda giren alanlar arasında **kullanıcının gerçekten doldurduğu** alana gider (`data[name]` boş değilse).

**Kararlar:**
- **`bad-contact` her iki alanı da `aria-invalid` işaretler** (task dokümanının tek-tablo eşlemesi), ama **odak** yalnız dolu-ama-bozuk alana gider — ikisi ayrı kaygı: işaretleme "hangi alan grubu bu hataya karışıyor"yu, odak "kullanıcının gerçekte düzeltmesi gereken alanı" gösterir. Gerekçe: task'ın kendi kabul kriteri ("bozuk e-posta → e-posta alanında... odak o alanda") statik ilk-alan seçimiyle çelişiyordu.
- Telefon uzunluk eşiği 10/11/12(+90 önekli) hane olarak seçildi (dönüşüm önceliği — meşru yazımı reddetmemek); E.164 tam doğrulaması yapılmadı (TASK-1.11'in ölçtüğü gibi Bunker da biçim dayatmıyor, bu kısıt yok).
- docs/DECISIONS.md'ye eklendi: Hayır — bu task'ın kapsamı ölçüde bir mimari/geri dönüşü zor karar değil, B-021'in önerdiği somut bir doğrulama kuralı.

**Dosya Değişiklikleri:**
- `src/lib/contact.ts` → YENİ; `isValidEmail`, `isValidPhone`, `checkContact`
- `src/app/api/demo/route.ts` → `checkContact` import ve `bad-contact` kapısı (missing-contact ile no-consent arası); `reply_to` artık `isValidEmail` koşullu
- `src/components/sections/DemoForm.tsx` → `FIELD_ERRORS` tablosu, `invalidFields` state, `Field`'e `invalid` prop + `aria-invalid`/`aria-describedby`, consent checkbox'a `id`+aria, hata kutusuna `id="demo-form-error"`, odak yönetimi (dolu-ama-bozuk alana git)
- `tests/contact.test.ts` → YENİ; 20 senaryo (`isValidPhone` 8, `isValidEmail` 5, `checkContact` 7)
- `tests/api-demo.test.ts` → 5 yeni senaryo + `RESEND_URL` fetch mock dalı (yalnız iki yeni testte RESEND_* env set edilip Resend gövdesi doğrudan okunuyor)
- `_dev/bulgular/B-021-iletisim-formati-dogrulanmiyor.md` → Çözüm Kaydı dolduruldu (bu commit'te; arşivleme verify-phase'in işi)

**Test Sonuçları:**
- **Kapı sınaması (kod değişmeden önce, yerelde):** `tests/contact.test.ts` yoktu → `Cannot find package '@/lib/contact'` ile tüm dosya kırmızı. `tests/api-demo.test.ts`'teki 5 yeni senaryodan 3'ü kırmızıydı: iki `bad-contact` senaryosu `expected 200 to be 422`, `reply_to` yok senaryosu `expected 'bu-eposta-degil' to be undefined` (o an hâlâ set ediliyordu). Kontrol grubu (`reply_to` var) ve "geçerli telefon + bozuk e-posta → 200" senaryosu zaten yeşildi (kapının mevcut yeşili tekrarlamadığının kanıtı: yalnız yeni davranış kırmızıydı).
- **`docker compose exec web npm test`** (değişiklik sonrası): **3 dosya, 43 test, TÜMÜ PASS**, çıkış kodu 0. `tests/contact.test.ts` 20/20, `tests/api-demo.test.ts` 18/18 (TASK-1.16'nın 13 senaryosu + bu task'ın 5'i), `tests/stage.test.ts` 5/5 (regresyon, dokunulmadı).
- **`npx eslint src/lib/contact.ts src/app/api/demo/route.ts tests/`**: temiz, 0 hata.
- **`DemoForm.tsx` lint regresyonu:** öncesi 4× `react/no-unescaped-entities` satır 60/65/169/192 (2026-09-13 ölçümü, B-028) → sonrası aynı 4 kalem satır 87/92/221/244 (içerik aynı, eklenen satır sayısı kadar kaymış). Yeni lint hatası yok.
- **`docker compose exec web npm run build`**: 23 rota, hatasız, TypeScript hatasız.
- **`a11y.mjs`** (8 sayfa, dev 3000): TOPLAM SORUN 0 (`/demo` dahil).
- **`font-guard.mjs`** (16 sayfa): kümede olmayan karakter yok — yeni Türkçe hata mesajlarındaki ı/ö/ü/ç zaten kümede.
- **`scan.mjs /demo`**: konsol temiz.
- **Tarayıcı doğrulaması** (Playwright, araştırma konteyneri, dev 3000, `/demo`):
  - Yalnız e-posta dolu + bozuk (`bu-eposta-degil`), telefon boş → sunucu `422 bad-contact`; `email` alanı `aria-invalid="true"`, `aria-describedby="demo-form-error"`; **odak `email`'de**; `name`/`club`/`email` girilen değerler formda kaldı (form reset olmadı).
  - Yalnız telefon dolu + bozuk (`abcdef!!!`), e-posta boş → `phone` alanı `aria-invalid="true"`; **odak `phone`'da** (simetrik doğrulama, ilk taslaktaki hatanın düzeltildiğinin kanıtı).
  - Not: sayfada `role="alert"` sayısı 2 ölçüldü (DemoForm'da yalnız 1 kaynak var — `grep` doğrulandı); ikinci kaynak bu task'ın dokunmadığı bir bileşende (muhtemelen site asistanı) olmalı, a11y.mjs kapısı bunu sorun olarak işaretlemedi. Kapsam dışı, düşürülmedi çünkü görünürde bir hata değil yalnızca bir gözlem; ilerleyen bir oturumda ilgisi çıkarsa hatırlanabilir.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu)
