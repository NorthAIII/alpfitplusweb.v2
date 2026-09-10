# TASK-1.04: Google Sheet lead alıcısı — Apps Script web app

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.03 ✅ (URL Vercel env'ine girilecek)

---

## Hedef

Demo talebini bir Google e-tablosuna satır olarak yazan, sertleştirilmiş bir Apps Script web app'i kurmak. Betiğin kaynağı repoda versiyonlanır (`research/lead-sheet.gs`), Google tarafındaki kopya onunla eşit tutulur. Task, token'lı bir POST isteği e-tabloya satır düşürdüğünde, tokensız istek reddedildiğinde ve URL Vercel env'inde tanımlandığında tamamlanmış sayılır.

---

## Bağlam

Lead hedefi kapsam tartışmasında **Google Sheet** olarak seçildi (Notion, Slack/WhatsApp ve Postgres elendi): telefondan bakılır, filtrelenir, dışa aktarılır; tek kişilik ekip için en ucuz dayanıklı kayıt. Vercel'de kalıcı disk olmadığından `LEAD_FILE_PATH` yayın ortamında kullanılamaz.

Mekanizma araştırmada seçildi: Apps Script web app, **sertleştirilmiş**. Sertleştirme dört ayağı kapatır — token doğrulaması, JSON yanıt sözleşmesi, eşzamanlı yazımda satır kaybı, betiğin sürüm kaybı.

Yedek rota (web app pratikte güvenilmez çıkarsa): Sheets API + servis hesabı.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Apps Script tuzakları" ve "Satır şeması (Sheet)"
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 kabul kriterleri ve edge case'ler
- `src/app/api/demo/route.ts` → `type Lead` (şema bire bir eşleşmeli)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/docs/DECISIONS.md` — yedek rotaya geçilirse (aksi hâlde karar zaten research'te kayıtlı)

---

## Alt Görevler

- [ ] **1. Betiği yaz**
  - `doPost(e)`: `e.parameter.token` paylaşılan token'la karşılaştırılır; eşleşmezse `{ok:false, code:"bad-token"}` döner ve **satır yazılmaz**
  - `LockService.getScriptLock()` ile kilit alınır (eşzamanlı `appendRow` satır kaybedebilir)
  - Gövde JSON parse edilir, sütun sırasına göre `appendRow`
  - Yanıt `ContentService` ile **JSON**: `{ok:true}`
  - Başlık satırı yoksa oluşturulur (ilk çalıştırmada e-tablo boş olabilir)
  - Dosya: `research/lead-sheet.gs` (YENİ)

- [ ] **2. Sütun şemasını sabitle**
  - Sıra: `at · env · name · club · branches · phone · email · segment · message · consent · ua`
  - `route.ts` → `type Lead` ile bire bir, artı yeni `env` alanı (TASK-1.05 ekleyecek)
  - **IP kayda girmez** (KVKK asgarilik; bugün de girmiyor)

- [ ] **3. Kullanıcıyla birlikte dağıt**
  - E-tablo oluşturulur (ad önerisi: `Alpfit Plus — Demo Talepleri`)
  - Uzantılar → Apps Script → betik yapıştırılır; token betikte bir sabit olarak durur (tahmin edilemez, ≥32 karakter)
  - Dağıt → Web app → **"Execute as: me"**, **"Who has access: Anyone"**
  - Üretilen `/exec` URL'sine `?token=…` eklenerek `LEAD_WEBHOOK_URL` değeri oluşur; kullanıcı Vercel'e girer (ve yerel `.env`'ine)

- [ ] **4. `.env.example` güncelle**
  - `LEAD_WEBHOOK_URL` açıklaması token'lı biçimi anlatır (`https://script.google.com/macros/s/…/exec?token=…`)
  - `LEAD_FILE_PATH` yorumuna "Vercel'de kalıcı disk yok — yalnız yerel Docker" notu
  - Değer yazılmaz — **bugün dolu duran `DEMO_TO` ve `DEMO_FROM` değerleri de boşaltılır**, gerçek adresler yorum satırına örnek olarak bile taşınmaz (kök talimat: `.env.example` yalnız anahtar adlarını taşır)
  - Dosya: `.env.example`

---

## Etkilenen Dosyalar

```
research/
└── lead-sheet.gs         # YENİ — Apps Script kaynağı (Google'daki kopyayla eşit tutulur)
./
└── .env.example          # LEAD_WEBHOOK_URL / LEAD_FILE_PATH açıklamaları — zaten var
```

---

## Dikkat Noktaları

- **`doPost(e)` istek başlıklarını göremez** — bu yüzden token gövdede değil **URL sorgusunda** taşınır. URL zaten sırdır ve tek env değişkenidir.
- **Betik hatası 200 + HTML döner**, `res.ok` yanıltır. Bu yüzden yanıt sözleşmesi JSON `{ok:true}`; doğrulaması TASK-1.05'te route tarafında yapılır. Betik tarafındaki iş: her yolda JSON dönmek.
- Yanıt 302 ile `script.googleusercontent.com`'a yönlenir; Node `fetch` yönlendirmeyi izler, sorun değil.
- **Kod değişince URL korunmalı:** "Manage deployments → mevcut dağıtımı düzenle → New version". Yeni dağıtım açmak URL'yi değiştirir ve env güncellemesi gerektirir. Bu tarif betiğin başına yorum olarak yazılır.
- Betik **sahibinin** hesabında koşar; e-tabloya yalnız o hesap erişir — KVKK erişim kontrolü (`legal.ts`: "yalnızca demo süreciyle ilgilenen ekip üyeleri").
- Kota: 30 eşzamanlı çalıştırma/kullanıcı, 6 dk/çalıştırma — bu trafik için sınır uzak.
- Token değeri task dokümanına, commit mesajına veya repoya **yazılmaz**; `research/lead-sheet.gs` içindeki sabit dağıtım anında kullanıcı tarafından doldurulur, repoda yer tutucu kalır.

---

## Test Kriterleri

- [ ] Token'lı `curl -X POST "<exec-url>?token=…" -H 'content-type: application/json' -d '{"at":"…","env":"local","name":"Test","club":"Test Kulüp",…}'` → gövde tam olarak `{"ok":true}` ve e-tabloya **bir** satır düşer
- [ ] Aynı istek **yanlış token** ile → `{"ok":false,...}` ve e-tabloda yeni satır **yok**
- [ ] Eksik alanlı gövde → satır düşer, eksik sütunlar boş (uç doğrulaması route'un işi, betik veri kaybetmez)
- [ ] Boş e-tabloda ilk istek başlık satırını da oluşturur
- [ ] Arka arkaya 5 istek → 5 satır (kilit satır kaybettirmiyor)
- [ ] `.env.example` yalnız anahtar adları ve açıklama içeriyor, hiçbir değer yok

---

## Karar Noktaları

- **Token'ın evi:** betikte sabit (önerilen — tek yer, kullanıcı dağıtım anında yazar) vs. Apps Script "Script Properties" (panelden yönetilir, kod temiz kalır). İkincisi daha temiz ama kurulumda bir ekran daha ekler; kullanıcıya sor.

---

## Risk ve Geri Dönüş Planı

- **Web app güvenilmez çıkarsa** (sessiz hata, kota, yönlendirme sorunu) → yedek rota Sheets API + servis hesabı; karar `docs/DECISIONS.md`'ye yazılır ve bu task yeniden açılır.
- **Rollback:** Betik dağıtımı Google tarafında kaldırılır; repoda yalnız iki dosya değişir.

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
