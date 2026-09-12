# TASK-1.04: Google Sheet lead alıcısı — Apps Script web app

**Durum:** 🔄 Devam ediyor
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

- [x] **1. Betiği yaz**
  - `doPost(e)`: `e.parameter.token` paylaşılan token'la karşılaştırılır; eşleşmezse `{ok:false, code:"bad-token"}` döner ve **satır yazılmaz**
  - `LockService.getScriptLock()` ile kilit alınır (eşzamanlı `appendRow` satır kaybedebilir)
  - Gövde JSON parse edilir, sütun sırasına göre `appendRow`
  - Yanıt `ContentService` ile **JSON**: `{ok:true}`
  - Başlık satırı yoksa oluşturulur (ilk çalıştırmada e-tablo boş olabilir)
  - Dosya: `research/lead-sheet.gs` (YENİ)

- [x] **2. Sütun şemasını sabitle**
  - Sıra: `at · env · name · club · branches · phone · email · segment · message · consent · ua`
  - `route.ts` → `type Lead` ile bire bir, artı yeni `env` alanı (TASK-1.05 ekleyecek)
  - **IP kayda girmez** (KVKK asgarilik; bugün de girmiyor)

- [ ] **3. Kullanıcıyla birlikte dağıt**
  - E-tablo oluşturulur (ad önerisi: `Alpfit Plus — Demo Talepleri`)
  - Uzantılar → Apps Script → betik yapıştırılır; token betikte bir sabit olarak durur (tahmin edilemez, ≥32 karakter)
  - Dağıt → Web app → **"Execute as: me"**, **"Who has access: Anyone"**
  - Üretilen `/exec` URL'sine `?token=…` eklenerek `LEAD_WEBHOOK_URL` değeri oluşur; kullanıcı Vercel'e girer (ve yerel `.env`'ine)

- [x] **4. `.env.example` güncelle**
  - `LEAD_WEBHOOK_URL` açıklaması token'lı biçimi anlatır (`https://script.google.com/macros/s/…/exec?token=…`)
  - `LEAD_FILE_PATH` yorumuna "Vercel'de kalıcı disk yok — yalnız yerel Docker" notu
  - Değer yazılmaz — **bugün dolu duran `DEMO_TO` ve `DEMO_FROM` değerleri de boşaltılır**, gerçek adresler yorum satırına örnek olarak bile taşınmaz (kök talimat: `.env.example` yalnız anahtar adlarını taşır)
  - Dosya: `.env.example`

---

## Etkilenen Dosyalar

```
research/
├── lead-sheet.gs         # YENİ — Apps Script kaynağı (Google'daki kopyayla eşit tutulur)
└── lead-sheet.test.mjs   # YENİ — sahte Apps Script ortamı; dağıtımdan önce sözleşmeyi kanıtlar
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

- **Token'ın evi — karar verildi (kullanıcı, 2026-09-11): Script Properties.** Gerekçe: task hedefi "repodaki kaynak ile Google'daki kopya eşit tutulur" diyor; betikte yer tutucu sabit dursaydı iki kopya hiçbir zaman eşitlenemezdi. Token artık `PropertiesService.getScriptProperties().getProperty("LEAD_TOKEN")` ile okunur, kod yüzeyinde sır yok. Maliyeti kurulumda tek ekran (Proje ayarları → Komut dosyası özellikleri).

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

### Oturum — 2026-09-11

**Durum:** 🔄 Devam edecek — kod tarafı bitti, Google tarafındaki dağıtım kullanıcıda

**Yapılanlar:**
- **Alt görev 1 ✅** — `research/lead-sheet.gs` yazıldı. `doPost(e)` sırasıyla: Script Properties'ten `LEAD_TOKEN` okur (tanımsızsa **hiçbir şey yazmaz**, fail-open yok), `e.parameter.token` ile karşılaştırır, gövdeyi JSON parse eder, `LockService.tryLock(20 sn)` ile kilit alır, başlık satırı yoksa oluşturup dondurur, `appendRow` ile satırı yazar, kilidi `finally`'de bırakır. Her yol — beklenmeyen hata dâhil — `ContentService` ile JSON döner; dosyanın başında kurulum ve "aynı adresi koruyarak yeni sürüm dağıtma" tarifi yorum olarak durur.
- **Alt görev 2 ✅** — Sütun şeması `COLUMNS` sabitinde: `at · env · name · club · branches · phone · email · segment · message · consent · ua`. `route.ts` → `type Lead` ile bire bir, artı `env` (TASK-1.05 dolduracak). IP yok.
- **Alt görev 3 ⬜** — E-tablo + Apps Script dağıtımı **yapılmadı**; kullanıcının Google hesabında, tarayıcıdan yapılacak iş. Oturumda yapılamaz.
- **Alt görev 4 ✅** — `.env.example`: `LEAD_WEBHOOK_URL` açıklaması token'lı biçimi ve token'ın Script Properties'te durduğunu anlatıyor; `LEAD_FILE_PATH` yorumu "Vercel'de kalıcı disk YOKTUR, yalnız yerel Docker" diyor; dosyanın başına "yalnızca anahtar adları" kuralı yazıldı ve **`DEMO_TO` / `DEMO_FROM` değerleri boşaltıldı**.
- **Ek:** Dağıtım beklerken sözleşmeyi kanıtlamak için `research/lead-sheet.test.mjs` yazıldı — Apps Script global servislerini sahteleyip betiği doğrudan koşturur.

**Sorunlar:**
- **Test kriterleri canlı `/exec` adresi istiyor, adres yok.** Çözüm: kriterler sahte Apps Script ortamında koşturuldu (aşağıda). Bu, canlı curl turunun yerine geçmez — onun yerine **önüne** geçer; kullanıcı dağıttığında aynı kriterler canlı adrese karşı tekrarlanır.
- **Sheets formül enjeksiyonu** (araştırmada yoktu, icrada çıktı): lead `message`/`club` alanı dışarıdan gelir ve `=IMPORTXML(...)` ile başlarsa `appendRow` onu **formül** olarak yorumlar — e-tablo içeriğini dışarı sızdırabilir. `cell()` fonksiyonu `= + - @ TAB CR` ile başlayan değerleri tek tırnakla metne sabitliyor.

**Kararlar:**
- **Token Script Properties'te** (kullanıcı kararı) — gerekçe Karar Noktaları bölümünde.
- **Formül kaçırma betik tarafında**, route tarafında değil — kaçış e-tablonun kendi yorumlama kuralına ait; route'un gönderdiği veri ham kalmalı ki e-posta gövdesi ve ileride başka hedefler bozulmasın.
- **`doGet` eklendi** (tarifte yoktu): tarayıcıdan adrese girildiğinde HTML hata sayfası yerine `{"ok":false,"code":"use-post"}` döner — "adres ayakta mı" sorusu böyle yanıtlanır.
- docs/DECISIONS.md'ye eklendi: Hayır — yedek rotaya geçilmedi, mekanizma kararı zaten araştırmada kayıtlı.

**Kalan İşler:**
- Alt görev 3: e-tablo oluşturma, betiği yapıştırma, `LEAD_TOKEN` girme, web app dağıtımı (kullanıcı, tarayıcı).
- Canlı curl turu: altı test kriteri gerçek `/exec` adresine karşı.
- **Canlı turda ayrıca doğrulanacak:** telefon alanı `+90…` ile başladığı için formül kaçırma önekini alıyor. Beklenen, önekin e-tabloda görünmemesi. Hücrede düz `'+90…` görünüyorsa kaçış kümesi yalnız `=` ile sınırlanır (gerekçe `lead-sheet.gs` → `cell()` yorumunda).
- `LEAD_WEBHOOK_URL` Vercel'e (Production + Preview) ve yerel `.env`'e girilir.

**Son Yaklaşım:**
Kod tarafı bitti ve yerelde kanıtlandı; kalan tek şey Google hesabında yapılacak dağıtım. Betiğin Google'daki kopyası repodakiyle **birebir aynı** olacak — token kodda değil Script Properties'te durduğu için kopyalar hiç ayrışmıyor. Dağıtım sonrası kod değişirse adres korunmalı: "Dağıtımları yönet → mevcut dağıtımı düzenle → Yeni sürüm"; yeni dağıtım açmak `/exec` adresini değiştirir ve Vercel env'i güncellemek gerekir.

**Sonraki Adım Detayı:**
1. Kullanıcı `research/lead-sheet.gs` başındaki KURULUM bloğunu adım adım uygular (e-tablo → Apps Script → `LEAD_TOKEN` Script Properties → Web app dağıtımı: Farklı çalıştır = Ben, Erişimi olanlar = Herkes).
2. Üretilen adres repo kökündeki `.env` dosyasına `LEAD_WEBHOOK_URL=https://script.google.com/macros/s/<ID>/exec?token=<TOKEN>` olarak yazılır (`.env` gitignore'da; token sohbete/commit'e/task dokümanına yazılmaz).
3. Oturum `.env`'den okuyup **değeri ekrana basmadan** altı test kriterini curl ile koşar (doğru token → `{"ok":true}` + tek satır; yanlış token → satır yok; eksik alan; boş e-tabloda başlık; arka arkaya 5 istek → 5 satır; formül kaçırma görünümü).
4. Kullanıcı aynı değeri Vercel'de `alpfitplus-web-v2` projesine Production + Preview kapsamında girer.
5. Task ✅ + arşiv; sıradaki TASK-1.05 (route tarafında JSON `{ok:true}` doğrulaması ve `env` alanı).

**Dosya Değişiklikleri:**
- `research/lead-sheet.gs` → YENİ. Apps Script web app kaynağı: token kapısı, kilit, başlık satırı, formül kaçırma, her yolda JSON yanıt, başta kurulum/yeniden-dağıtım tarifi.
- `research/lead-sheet.test.mjs` → YENİ. Sahte Apps Script ortamı; `node research/lead-sheet.test.mjs`, geçme şartı `TOPLAM SORUN: 0`.
- `.env.example` → `LEAD_WEBHOOK_URL` ve `LEAD_FILE_PATH` açıklamaları yazıldı; `DEMO_TO` / `DEMO_FROM` değerleri boşaltıldı; "yalnız anahtar adları" kuralı dosyanın başına girdi.

**Test Sonuçları:**
<!-- Kapsam: betiğin KENDİ mantığı, sahte Apps Script servislerine karşı. Google'ın gerçek davranışı (302 yönlendirmesi, yetki ekranı, kota, apostrof önekinin hücrede görünüp görünmemesi) bu kapsamda DEĞİL — canlı tura kalıyor. -->
- `node research/lead-sheet.test.mjs` → **TOPLAM SORUN: 0** (12 senaryo, 40 kontrol). Kapsanan task kriterleri: doğru token → gövde tam olarak `{"ok":true}` ve tek veri satırı; yanlış token → `bad-token`, satır yok; eksik alanlı gövde → satır düşer, eksik sütunlar boş; boş e-tabloda ilk istek başlık satırını da yazar (ve yalnız bir kez); arka arkaya 5 istek → 5 satır, sıra korunur, kilit `finally`'de bırakılır.
- **Ürettiğim kapıyı sınadım — bozuk girdi:** yanlış token ve token'sız istek, ikisi de `{"ok":false,"code":"bad-token"}` döndü ve `rows` boş kaldı. Kontrol grubu (doğru token) aynı koşuda yeşil — yani kapı gerçekten token'ı ölçüyor, her şeye kırmızı basmıyor.
- **Ürettiğim kapıyı sınadım — boş kapsam:** `LEAD_TOKEN` Script Properties'te **tanımsızken** istek `no-token-configured` ile reddedildi, satır yazılmadı. İkinci ayak olarak token tanımsızken boş token gönderildi (`""` === `null` tuzağı) — yine reddedildi. Kapı kurulum eksikliğinde fail-open yapmıyor.
- Ek senaryolar (kriter listesinde yoktu, icrada eklendi): formül enjeksiyonu dört tetik karakterde kaçırıldı ve zararsız metne dokunulmadı; bozuk JSON / boş gövde / dizi gövde reddedildi, satır yazılmadı; kilit alınamazsa `busy` döndü ve satır yazılmadı; `doGet` JSON döndü; 9000 karakterlik mesaj 4000'e kırpıldı.
- `npx eslint research/lead-sheet.gs` → dosya eslint yapılandırmasının dışında (uyarı, hata değil). `src/` altında değişiklik yok, derleme yüzeyi bu oturumda değişmedi.

### Oturum — 2026-09-13 (plan revizyonu işaretlendi)

**Durum:** 🔄 Devam edecek — task'ın varsayımı değişti, plan revizyonu bekliyor

**Yapılanlar:**
- Kod yazılmadı. Kullanıcı Google hesabındaki dağıtımı (alt görev 3) daha önce **yapamadığını** bildirdi ve yerine çözüm istedi.
- Seçenekler çıkarıldı ve kullanıcıya soruldu; kararlar `docs/DECISIONS.md`'ye üç kayıt olarak yazıldı (2026-09-13): talep hedefi Bunker, analitik kendi Umami, alan adı geçişinin sırası.

**Sorunlar:**
- **Bunker'ın talep tabloları otomasyonları besliyor (ölçüldü, salt okunur).** `leads` ve `staged_leads` soğuk e-posta dizisine (`outreach-sequence-tick`), otomatik onaya (`triage-auto-approve`) ve model sınıflandırmasına (`lead-classify-tick`) giriyor — kaynak `../bunker-dashboard/docs/system-flow.md` ve `src/app/api/internal/`. Demo talebi körlemesine yazılırsa talebi yapan kulübe soğuk satış e-postası gidebilir.
- `../bunker-dashboard` → `/api/leads/intake` oturum isteyen CSV içe aktarma ucu; web sitesi alıcısı olarak kullanılamaz.

**Kararlar:**
- **Talep hedefi Bunker'da `alpfit` talebi + `kivanc@kiwiailab.com`'a anında e-posta** (kullanıcı). Google Sheet kararı geçersiz.
- **Canlı sistemlerde çalışılır, yerel n8n kopyası kurulmaz** (kullanıcı).
- **Analitik kendi Umami'ye (`umami.kiwiailab.com`) taşınır** (kullanıcı). TASK-1.07'yi etkiler.
- **Alan adı geçişi kritik içerik ve yasal bulgular kapanınca, öne alınır** (kullanıcı). Faz 1'e girmez.
- docs/DECISIONS.md'ye eklendi: Evet — üç kayıt, 2026-09-13.

**Kalan İşler:**
- Plan revizyonu (`/devflow:plan-phase`, revizyon modu) — aşağıdaki Sonraki Adım Detayı.

**Son Yaklaşım:**
Bu task'ın hedefi (Google e-tablosu) artık geçersiz; sitenin alıcı sözleşmesi ise geçerli ve korunacak: `route.ts` → `toWebhook` JSON POST atıyor ve yanıtta `ok === true` bekliyor. Yeni alıcı bu sözleşmeyi karşılarsa site tarafında kod değişikliği küçük kalır.

Sunucu erişilebilir: `n8n.kiwiailab.com/healthz` ve `umami.kiwiailab.com/api/heartbeat` 2026-09-13'te 200 döndü.

Sunucuya dokunan her iş `../altyapi/vps/CLAUDE.md` → "Değişiklik yaparken — pazarlıksız kurallar"a uyar (önce yedek, önce test, sonra ölç); Bunker kodu ayrı repodur ve kendi kuralları vardır (`../bunker-dashboard/AGENTS.md`).

**Sonraki Adım Detayı:**
Revizyon oturumu (`/devflow:plan-phase`) şunları karara bağlar ve task'lara döker:
1. **Bu task'la hesaplaş:** hedef geçersiz → ❌ İptal önerilir. `research/lead-sheet.gs` ve `research/lead-sheet.test.mjs` kalsın mı silinsin mi kararı verilir. B-038 (`lead-sheet.gs` sessizlikleri) konusuz kalıyorsa triyaja not düşülür.
2. **Keşif task'ı (ilk):** Bunker'a demo talebinin giriş yolu — n8n iş akışı mı, Bunker'da token korumalı ayrı giriş ucu mu; talep hangi tabloya, hangi `source` değeriyle girer; soğuk e-posta dizisi, otomatik onay ve sınıflandırma nasıl dışarıda tutulur; `alpfit` kiracısında Hermes duraklatılmış mı. Bunker reposu ve canlı veritabanı **salt okunur** incelenir.
3. **Form hazırlığı (bağlantıdan önce):** B-021 iletişim biçimi doğrulaması — hedef bağlandığı gün ulaşılamaz talep "başarılı" sayılır. B-020 hız sınırının doğrulamadan önce sayması aynı dosyada, birlikte ele alınabilir.
4. **Bağlantı (canlıda):** alıcı kurulur; `ok:true` sözleşmesi karşılanır; e-posta **tek kaynaktan** gider — önerilen: sunucu tarafı talebi yazdıktan sonra hemen mail atar, sitenin Resend e-postası yalnız kayıt düştüğünde devreye girer (bugün `route.ts` ikisini de her seferinde deniyor, çift e-posta olur). TASK-1.06'nın kapsamı buna göre yeniden yazılır.
5. **Uçtan uca canlı tur:** önizleme adresinden gerçek talep → Bunker'da görünür + e-posta gelir + hiçbir otomasyon tetiklenmez; Vercel env değerini kullanıcı girer.
6. **Analitik:** TASK-1.07 kendi Umami'ye göre yeniden yazılır. Ağaçta commit'lenmemiş Umami Cloud değişiklikleri duruyor (`src/app/layout.tsx`, `.env.example`) — başka bir oturumun yarım işi; 2026-09-13'te bu makinede o oturum açık görünmüyordu, bu oturum dokunmadı. Revizyon onları kullanıcıya sorarak ele alır. TASK-1.08 / 1.09 aynen geçerli.
7. **Yasal metin:** `legal.ts` Aktarım ve Çerezler/ölçüm maddelerinde Google ve Umami Cloud yerine kendi sunucu ve konumu (konum sunucu tarafında teyit edilir).
8. **Faz milestone'u ve `PHASES.md` sırası:** milestone "Google Sheet'e satır" diyor → "Bunker'da talep" olur; alan adı geçişinin öne alınması ve onu kilitleyen bulgular (B-029, B-018, B-024, B-011 adayları) Sıradaki Fazlar'a işlenir.

---

**Oluşturulma:** 2026-09-11
