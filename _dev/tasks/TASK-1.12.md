# TASK-1.12: İletişim biçimi doğrulaması (B-021)

**Durum:** ⬜ Bekliyor
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

- [ ] **1. Biçim kuralını saf fonksiyon olarak yaz**
  - E-posta: basit biçim (`yerel@alan.uzantı` sınıfı). Katı RFC denetimi yok; amaç çöpü elemek, meşru kullanıcıyı zorlamamak
  - Telefon: boşluk, tire, parantez ve baştaki `+` atıldıktan sonra rakam sayısı eşiği. Türkiye yazımları kabul: `05321112233`, `5321112233`, `+90 532 111 22 33`, `(0532) 111-22-33`. Harf içeren değer red
  - Kural: **en az biri geçerli olsun** (B-021 önerisi; dönüşüm önceliği). İkisi de boşsa mevcut `missing-contact` korunur. Dolu alanlar var ama hiçbiri geçerli değilse yeni kod `bad-contact` döner (422, alan adına göre ayrışan mesajla)
  - Dosya: `src/lib/contact.ts` (YENİ) — saf fonksiyon, Vitest'te sınanır

- [ ] **2. Uca bağla**
  - Doğrulama mevcut sıraya girer: `missing` → `missing-contact` → **biçim** → `no-consent`
  - Doğrulama `clean()` kırpmasından **sonraki** değere uygulanır. 160 karaktere kırpılıp `@alan` kısmını kaybeden e-posta böylece geçersiz sayılır
  - `toEmail` → `reply_to` yalnız e-posta **geçerliyse** set edilir. Telefon geçerli, e-posta bozuk talep kabul edilir ama bildirim bozuk adrese yanıtlanmaz
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **3. Hatayı alanla ilişkilendir**
  - Uçtan dönen `code` → alan eşlemesi tek tabloda: `missing` → ad/kulüp, `missing-contact` / `bad-contact` → telefon + e-posta, `no-consent` → onay kutusu
  - Eşleşen alana `aria-invalid="true"` ve hata metnine bağlanan `aria-describedby`; gönderim sonrası odak ilk hatalı alana taşınır
  - Mevcut genel hata kutusu (`role="alert"`, WhatsApp bağlantısı) ve kullanıcının yazdığı değerler **korunur**
  - Dosya: `src/components/sections/DemoForm.tsx`

- [ ] **4. Testleri önce yaz**
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

- [ ] `tests/contact.test.ts` (Vitest): alt görev 1'deki dört telefon yazımı kabul; `abcdef!!!`, 9 haneli rakam dizisi ve harfli değer red; `ad@kulup.com` kabul; `bu-eposta-degil`, `a@b`, `@x.com` red
- [ ] `tests/api-demo.test.ts` genişledi (senaryo başına ayrı `x-forwarded-for`; hedef sahte alıcı):
  - `{email:"bu-eposta-degil"}` ve telefon yok → 422 `bad-contact`, alıcıya çağrı **yok**
  - `{phone:"abcdef!!!"}` ve e-posta yok → 422 `bad-contact`, çağrı yok
  - Geçerli telefon + bozuk e-posta → 200; Resend'e giden gövdede `reply_to` **yok**
  - Kontrol grubu: geçerli e-posta → 200, `reply_to` var
- [ ] **Ürettiğim kapıyı sınadım:** yeni senaryolar değişiklikten önce koşuldu ve iki red senaryosu **kırmızıydı**; değişiklik sonrası yeşil. Kapı yeni bir şey ölçüyor, mevcut yeşili tekrarlamıyor
- [ ] Regresyon: TASK-1.16 bataryasının tamamı yeşil (bal küpü, 422'ler, 400, 429, beş bozuk alıcı yanıtı)
- [ ] Tarayıcıda (araştırma konteyneri, `/demo`, dev 3000): bozuk e-posta ile gönderim sonrası e-posta alanında `aria-invalid="true"`, `aria-describedby` hata metnini gösteriyor, odak o alanda; yazılan değerler yerinde
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs /demo` konsol temiz
- [ ] `docker compose exec web npm run build` hatasız; `npx eslint src/lib/contact.ts src/app/api/demo/route.ts tests/` temiz
- [ ] `DemoForm.tsx`'te **yeni** lint hatası yok: öncesi 4 kalem `react/no-unescaped-entities` (B-028; satır 60/65/169/192, 2026-09-13 ölçümü), sonrası aynı 4 kalem (satır numaraları kayabilir). B-028 bu task'ta düzeltilmez — kuralın kapatılıp kapatılmayacağı açık bir karar (verify-plan kullanıcı kararı 2026-09-13)

---

## Risk ve Geri Dönüş Planı

- **Fazla katı kural meşru talebi reddeder** (dönüşüm kaybı; ILKELER 1. eksen) → senaryo tablosu meşru yazımlarla başlar; şüphede kabul tarafı seçilir.
- **Rollback:** Ürün ve test dosyaları dosya bazlı geri alınır; `contact.ts` ve `contact.test.ts` yeni olduğu için silinmesi yeterli.

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

**Oluşturulma:** 2026-09-13 (plan revizyonu)
