# TASK-1.14: Site bağlantısı — alıcı sözleşmesi, `.env.example` ve Apps Script kalıntısının kaldırılması

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.12 ✅ (biçim kapısı bağlantıdan önce), TASK-1.13 ✅ (yerel alıcı), TASK-1.16 ✅ (test koşucusu)

---

## Hedef

`/api/demo`'yu yeni alıcı sözleşmesine bağlamak ve **yerel prova ortamında** uçtan uca sınamak. Kapsam:

- `toWebhook`'u alıcının kimlik doğrulama biçimine göre güncellemek (gerekiyorsa).
- Kod yorumunu ve `.env.example`'ı yeni alıcıya çevirmek.
- İptal edilen Apps Script alıcısının dosyalarını repodan kaldırmak.

Task şu üç koşul sağlandığında tamamlanmış sayılır:

- Sözleşme testleri Vitest'te yeşil.
- Yerel geliştirme sunucusundan gönderilen form yerel alıcı üzerinden yerel veritabanına `env=local` kaydı olarak düştü.
- `lead-sheet` kalıntısı kalmadı.

Canlı alıcı ve Vercel env'i TASK-1.18'dedir.

---

## Bağlam

Sitenin alıcı sözleşmesi (TASK-1.05) alıcıdan bağımsız yazıldı ve korunur: JSON POST, üç kapılı doğrulama (HTTP durumu, JSON gövde, `ok === true`), teşhis logunda yalnız durum kodu, alıcı kodu ve `lead.at`.

Değişebilecek tek şey kimliğin **nasıl** taşındığıdır. Apps Script başlık okuyamadığı için token URL sorgusundaydı. Yeni alıcı için biçim TASK-1.11'de karara bağlandı:

- **Sorguda kalıyorsa** `toWebhook` kodu değişmez; yalnız yorumu değişir.
- **Başlıkla taşınıyorsa** yeni bir sır anahtarı doğar ve istek başlığına girer.

**Kullanıcı kararı (2026-09-13):** `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` silinir; git geçmişinde kalır. B-038 bu dosyaların sessizliklerini anlatıyordu, dosyalar kalkınca konusuz kalır (atom `→ TASK-1.14` işaretinde bekler; arşivleme verify-phase'in işi).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — sözleşme ve kimlik doğrulama biçimi
- `_dev/tasks/archive/TASK-1.13.md` → Oturum Kaydı — yerel alıcının adresi ve env adları
- `_dev/tasks/archive/TASK-1.17.md` → Oturum Kaydı — yerel prova ortamının komutları
- `tests/api-demo.test.ts` (TASK-1.16'da doğdu) — sözleşme bataryası
- `src/app/api/demo/route.ts` → `toWebhook` ve fonksiyon yorumu

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/bulgular/B-038-lead-sheet-operasyonel-sessizlikleri.md` — Çözüm Kaydı taslağı: "konusuz — dosyalar kaldırıldı" (arşivleme verify-phase'de)
- `_dev/docs/DECISIONS.md` — yalnız kimlik biçimi TASK-1.11 kaydından saparsa

---

## Alt Görevler

- [ ] **1. `toWebhook`'u alıcıya bağla**
  - Kimlik biçimi TASK-1.11 kararına göre. Başlıksa sır yeni env anahtarından okunur ve istek başlığına yazılır. Anahtar tanımsızsa istek **gönderilmez** (fail-closed), durum teşhis loguna düşer
  - Üç kapılı doğrulama, 8 sn zaman aşımı ve log disiplini **değişmez**; alıcının `code` alanı 40 karaktere kırpılı loglanmaya devam eder
  - Fonksiyon yorumundaki Apps Script / `lead-sheet.gs` anlatımı yeni alıcıya çevrilir; "HTML dönen hata sayfası" dersi alıcıdan bağımsız hâliyle korunur
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **2. Testleri genişlet**
  - Kimlik başlıkla taşınıyorsa: başlık sahte alıcıya ulaşıyor; anahtar tanımsızken `fetch` çağrılmıyor ve uç 503 dönüyor; `console.error` çağrılarında sır değeri yok
  - Kimlik sorgudaysa: mevcut batarya yeşil, yeni senaryo gerekmez (gerekçe Oturum Kaydı'na)
  - Dosya: `tests/api-demo.test.ts` (TASK-1.16'da YENİ)

- [ ] **3. `.env.example`'ı güncelle**
  - `LEAD_WEBHOOK_URL` açıklaması yeni alıcıyı ve kimlik biçimini anlatır; (varsa) yeni sır anahtarı eklenir
  - Değer yazılmaz — örnek olarak yorumda bile (dosyanın kendi kuralı)
  - Dosya: `.env.example`

- [ ] **4. Apps Script kalıntısını kaldır**
  - `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` silinir
  - `grep -rn "lead-sheet\|Apps Script" src research tests .env.example` → eşleşme kalmaz (`_dev/` tarihsel kayıtları hariç)

- [ ] **5. Yerel uçtan uca tur**
  - Yerel `.env`: `LEAD_WEBHOOK_URL` (ve varsa kimlik) yerel prova alıcısına (compose ağı adresi). Değer oturumda basılmaz
  - `docker compose --profile lead up -d` + geliştirme sunucusu; `/demo` formu tarayıcıda (araştırma konteyneri) gönderilir → başarı ekranı, yerel veritabanında **bir** kayıt `env=local`

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts              # toWebhook kimlik biçimi (gerekirse) ve yorumu — zaten var
tests/
└── api-demo.test.ts      # kimlik başlığı senaryoları (gerekirse) — TASK-1.16'da YENİ
./
└── .env.example          # LEAD_WEBHOOK_URL açıklaması, (varsa) yeni anahtar — zaten var
research/
├── lead-sheet.gs         # SİLİNİR — zaten var
└── lead-sheet.test.mjs   # SİLİNİR — zaten var
```

---

## Dikkat Noktaları

- **Ağaç temiz olmalı:** `.env.example`'daki Umami bloğu TASK-1.07'de commit'lenmiş olmalı. Değilse dosya bazlı commit yabancı işi süpürür — dur ve sor (CLAUDE.md → Paralel Oturum Farkındalığı).
- **Canlıya dokunulmaz:** Vercel env'i ve canlı alıcı TASK-1.18'de. Bu task'ın push'u yayın ortamında hattı değiştirmez; `LEAD_WEBHOOK_URL` Vercel'de henüz tanımsız olduğu için önizleme bugünkü 503 davranışında kalır.
- **Sır hijyeni:** sır değeri log, hata yanıtı, commit ya da dokümana girmez. `fetch` hata nesnesi hedef adresi taşıyabildiği için `catch` onu loglamaz (TASK-1.05 kararı; korunur).
- **`LEAD_FILE_PATH` Vercel'de tanımlanmaz** (kalıcı disk yok). Yerelde ikisi birden tanımlıysa `stored = toWebhook || toFile` sırası korunur; yerel turda dosya hedefi **boş** bırakılır ki kayıt gerçekten alıcıdan geldiği ölçülsün.
- **E-posta bu task'ta açılmaz:** yerel turda e-posta ayağı sessiz kalabilir (`mailed:false`), bu beklenen durum. Uç yine 200 döner çünkü kayıt yazıldı.

---

## Test Kriterleri

- [ ] `docker compose exec web npm test` yeşil; sözleşme bataryası (kontrol grubu 200 · beş bozuk yanıt 503) ve varsa kimlik başlığı senaryoları dâhil
- [ ] Kimlik başlıkla taşınıyorsa **ürettiğim kapıyı sınadım:** anahtar tanımsızken istek gönderilmedi (fail-closed); kontrol grubu anahtar tanımlıyken başlığı taşıdı
- [ ] Kimlik sorgudaysa `git diff src/app/api/demo/route.ts` yalnız yorum farkı gösteriyor
- [ ] Yerel uçtan uca: tarayıcıdan gönderilen form → başarı ekranı → yerel veritabanında `alpfit` kiracısında bir kayıt, `env=local`, alanlar doğru eşlenmiş (`LEAD_FILE_PATH` boş)
- [ ] `grep` taraması: `src/`, `research/`, `tests/`, `.env.example` içinde `lead-sheet` ve `Apps Script` eşleşmesi yok
- [ ] `.env.example` yalnız anahtar adı ve açıklama içeriyor, hiçbir değer yok
- [ ] `docker compose exec web npm run build` hatasız; `npx eslint src/app/api/demo/route.ts tests/` temiz

---

## Risk ve Geri Dönüş Planı

- **Kimlik başlığı yanlış adla gönderilirse** yerel alıcı reddeder → yerel uçtan uca kriteri yakalar, canlıya taşınmaz.
- **Rollback:** `route.ts`, `tests/api-demo.test.ts` ve `.env.example` dosya bazlı geri alınır. Silinen iki dosya `git checkout <commit>^ -- research/lead-sheet.gs research/lead-sheet.test.mjs` ile geri gelir.

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
