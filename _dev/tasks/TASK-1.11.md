# TASK-1.11: Bunker keşfi — demo talebinin giriş yolu ve otomasyon dışı tutma

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** Yok (planlı keşif ayağı; lead zincirinin ilki)

---

## Hedef

Web sitesinden gelen demo talebinin Bunker'a (`alpfit` kiracısı) **nereden, nasıl ve hangi kayıtla** gireceğini salt okunur incelemeyle belirlemek. Kalan lead task'larının (1.17 yerel prova ortamı, 1.13 yerel alıcı, 1.14 site bağlantısı, 1.18 canlıya taşıma, 1.06 uçtan uca tur, 1.15 yasal metin) dayanacağı sözleşmeyi de yazılı hâle getirmek.

Task, seçilen giriş yolu tüm ayaklarıyla kaynağa bağlanıp yazıldığında, talebin üç satış otomasyonuna girmeyeceği kodla gösterildiğinde ve kullanıcı yolu onayladığında tamamlanmış sayılır.

---

## Bağlam

Lead hedefi 2026-09-13'te Google Sheet'ten Bunker'a değişti. Google hesabındaki Apps Script dağıtımı yapılamamıştı (`docs/DECISIONS.md` 2026-09-13; iptal edilen `tasks/archive/TASK-1.04.md`).

Aynı kararın **ölçülmüş kısıtı** bu task'ın varlık sebebidir. Bunker'ın `leads` ve `staged_leads` tabloları soğuk e-posta dizisini (`outreach-sequence-tick`), otomatik onayı (`triage-auto-approve`) ve model sınıflandırmasını (`lead-classify-tick`) besliyor. Demo talebi körlemesine yazılırsa talebi yapan kulübe soğuk satış e-postası gidebilir. `/api/leads/intake` oturum isteyen CSV içe aktarma ucu olduğu için web sitesi alıcısı olamaz.

Bu bir **keşif ayağıdır**: bulgusu kalan task'ların doğruluğunu değiştirebilir. Değiştirirse bu bir arıza değil beklenen çıktıdır. Rota run-task → "Plan revizyonu gerekirse"dir: ayak ✅ + arşivle kapanır, DURUM Adım'ı `plan`'a çekilir.

Revizyonda verilen iki karar keşfin sınırını çizer:

- **E-postayı site gönderir** (Resend, her talepte), sunucu göndermez. Kayıt ve bildirim birbirinden bağımsız kalır.
- Alıcı **önce yerel prova ortamında** (compose; n8n + Postgres) kurulup sınanır, sonra canlıya taşınır (kullanıcı kararı; aynı gün verilen "yalnız canlıda çalışılır" kararını değiştirir — `docs/DECISIONS.md` 2026-09-13 "Alıcı provası"). Keşif bu ortamın girdilerini de çıkarır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — adresler, Bunker tuzağı, sır kuralı
- `_dev/docs/DECISIONS.md` → 2026-09-13 "Lead hedefi (yeniden)" ve "E-posta kaynağı" kayıtları
- `src/app/api/demo/route.ts` → `type Lead` (11 alan) ve `toWebhook` (üç kapılı sözleşme: HTTP durumu, JSON gövde, `ok === true`)
- `../altyapi/vps/CLAUDE.md` → "Değişiklik yaparken — pazarlıksız kurallar" (salt okunur kaynak)
- `../bunker-dashboard/AGENTS.md` ve `../bunker-dashboard/docs/system-flow.md` (salt okunur kaynak)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/docs/DECISIONS.md` — seçilen giriş yolu ve kimlik doğrulama biçimi (sözleşme bırakır)
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — giriş yolu ve izolasyon yöntemi (sır değeri değil, yalnız ad ve konum)

---

## Alt Görevler

- [ ] **1. Giriş yolu adaylarını çıkar**
  - (a) n8n iş akışı: webhook → Bunker veritabanına yazım. n8n'in bu veritabanına yazma kimliği var mı, var olan iş akışları arasında benzer bir desen var mı?
  - (b) Bunker'da kimlik doğrulamalı ayrı giriş ucu. Reponun kendi kuralları (`AGENTS.md`) ve dağıtım yolu bunu ne kadar pahalı kılıyor?
  - Her aday için kalıcılık (kaynak nerede versiyonlanır), bakım yükü ve arıza görünürlüğü yazılır

- [ ] **2. Kayıt biçimini belirle**
  - Talep hangi tabloya, hangi kaynak/tip değeriyle girer? `leads` / `staged_leads` mı, ayrı bir tip ya da tablo mu?
  - `type Lead` alanlarının (`at · env · name · club · branches · phone · email · segment · message · consent · ua`) Bunker şemasındaki karşılıkları; eşleşmeyen alanın nereye yazılacağı
  - `env` (`local`/`preview`/`production`) nasıl taşınır? Önizleme testleri panelde ayırt edilmeli
  - Bunker'ın telefon/e-posta için beklediği biçim varsa not edilir — TASK-1.12'nin doğrulama kuralına girer

- [ ] **3. Otomasyon izolasyonunu kanıtla**
  - `outreach-sequence-tick`, `triage-auto-approve`, `lead-classify-tick` kaydı hangi koşulla seçiyor? Kod okunur, dosya:satır yazılır
  - Önerilen kayıt biçiminin üç seçim koşulunun **hiçbirine** girmediği gösterilir
  - `alpfit` kiracısında Hermes'in durumu (duraklatılmış mı) okunur; demo talebine dokunabilecek başka zamanlanmış iş varsa listelenir
  - Bunker yeni talep için **kendiliğinden bildirim** üretiyor mu? Üretiyorsa site e-postasıyla çift bildirim olur, kullanıcıya getirilir

- [ ] **4. Sözleşmeyi yaz**
  - Adres biçimi, kimlik doğrulama (sorgu token'ı mı, başlık mı), istek gövdesi, yanıt gövdesi
  - Yanıt sözleşmesi: yazım başarılıysa `{ok:true}`; **her hata yolunda JSON** `{ok:false, code}`. HTML hata sayfası, boş gövde ya da yazmadan dönen `ok:true` yok
  - Sitede kod değişikliği gerekip gerekmediği (TASK-1.14'ün kapsamı buradan çıkar)
  - Alıcı tanımının versiyonlanacağı yer: Bunker reposu, altyapı reposu ya da bu repo

- [ ] **5. KVKK ve yedek gerçeğini oku**
  - Sunucunun konumu (ülke) — TASK-1.15 yasal metni buna dayanır
  - Talep kaydına Bunker'da kimler erişebiliyor (kiracı kullanıcıları)
  - Yeni kayıtlar Postgres yedeğine ve sunucu dışı kopyaya giriyor mu (`../altyapi/README.md`)

- [ ] **6. Yerel prova ortamının girdilerini çıkar** (TASK-1.17 bunlarla kurar)
  - Canlıdaki n8n ve Postgres **sürümleri** (imaj etiketleri)
  - Bunker şemasının yerelde kurulabileceği kaynak: migration dosyaları mı, salt okunur şema dökümü mü? Canlı şema migration'larla birebir mi (elle yapılmış fark var mı)?
  - Asgari tohum: `alpfit` kiracısı ve üç seçim sorgusunu koşturmaya yeten kayıtlar — gerçek kişi verisi olmadan
  - Yol Bunker giriş ucuysa Bunker uygulamasının yerelde nasıl koşacağı (reponun kendi komutu, bağımlılıklar)

- [ ] **7. Kullanıcı onayı**
  - Aday(lar), öneri ve gerekçe kullanıcıya sunulur; seçilen yol Oturum Kaydı'na ve `docs/DECISIONS.md`'ye yazılır

---

## Etkilenen Dosyalar

```
_dev/
├── docs/DECISIONS.md                              # giriş yolu kararı — zaten var
└── memory/kendi-sunucu-n8n-bunker-umami.md        # giriş yolu ve izolasyon notu — zaten var
```

> Kod değişikliği yok. Bunker reposu, canlı veritabanı ve n8n **salt okunur** incelenir.

---

## Dikkat Noktaları

- **Hiçbir yazma işlemi yok.** Veritabanında yalnız `SELECT`, mümkünse salt okunur işlem içinde. n8n'de iş akışı açılır, düzenlenmez ya da çalıştırılmaz. Bunker reposunda dosya değişmez.
- **Kişisel veri dökülmez.** Mevcut `leads` satırları ekrana basılmaz; şema, sayım ve seçim koşulları yeterli.
- **Sır değeri ekrana basılmaz**, dokümana ya da commit'e yazılmaz. Yalnız anahtar adı ve konumu yazılır (`/opt/bunker/.env` ve benzeri; memory).
- Sunucuya bağlanmanın kuralları `../altyapi/vps/CLAUDE.md`'dedir. Keşif salt okunur olsa da oradaki erişim yolu izlenir.
- **Varsayılan tuzak:** "Ayrı `source` değeri yeterli" varsayımı kodla sınanmadan yazılmaz. Otomasyon `source`'a bakmıyorsa ayrı değer izolasyon sağlamaz.
- Keşif alıcıyı **kurmaz** — yerel kurulum TASK-1.13, canlı kurulum TASK-1.18'dir. Bu task yalnız yolu, sözleşmeyi, izolasyonu ve yerel prova girdilerini belirler.
- Umami, Bunker'ın "Web Trafik" paneline de besliyor (v1 `BaseLayout.astro` yorumu). Bu task'ın konusu değil, TASK-1.07'nin dikkat noktası.

---

## Test Kriterleri

- [ ] Seçilen giriş yolunun her ayağı (adres, kimlik, yazılan tablo/değer, yanıt) kaynağıyla (dosya:satır ya da sorgu çıktısı) Oturum Kaydı'nda yazılı
- [ ] Üç otomasyonun seçim koşulu kodda okunmuş; önerilen kayıt biçiminin üçüne de girmediği satır satır gösterilmiş
- [ ] Yanıt sözleşmesi, `toWebhook`'un üç kapısıyla (HTTP durumu, JSON gövde, `ok === true`) karşılaştırılmış; site tarafında değişiklik gerekip gerekmediği yazılı
- [ ] Yazma yapılmadığı kanıtlanmış: veritabanı oturumu salt okunur, n8n iş akışı listesi ve Bunker reposunun `git status`'u keşif öncesi ve sonrası aynı
- [ ] Sunucu konumu ve talep kaydına erişen hesaplar yazılı (TASK-1.15 girdisi)
- [ ] Yerel prova girdileri yazılı: canlı sürümler, şema kaynağı ve canlıyla farkı, asgari tohum tanımı (TASK-1.17 girdisi)
- [ ] Kullanıcı seçilen yolu onayladı; karar `docs/DECISIONS.md`'de

---

## Karar Noktaları

- **Giriş yolu:** n8n iş akışı vs Bunker giriş ucu. Keşifte ölçülen kalıcılık, bakım ve arıza görünürlüğüne göre öneri yapılır; **karar kullanıcıya sorulur**.
- **Kimlik doğrulama biçimi:** Token URL sorgusunda kalırsa site kodu değişmez. Başlıkla taşınması daha doğruysa TASK-1.14'te `toWebhook` değişir ve yeni bir sır anahtarı doğar. Öneri sözleşmeyle birlikte kullanıcıya sunulur.

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
