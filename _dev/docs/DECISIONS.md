# DECISIONS — Karar Günlüğü

**Amaç:** Önemli mimari ve tasarım kararlarının kaydı. "Neden X yerine Y tercih edildi?" sorusunun cevabı burada.
**Ne zaman güncellenir:** Önemli bir teknik, mimari veya tasarım kararı alındığında.

> İddia sınırı (ne söylenir, ne söylenmez) burada değil → `CLAIMS.md`. Tasarım kuralları → `STYLE-GUIDE.md`. Buradaki kayıtlar onların **üzerine** gelen tercihlerdir.

<!-- KURAL: Bu günlük append-only'dir — yazılmış bir karar silinmez, düzeltilmez. Geçersizleşen karar YENİ bir kararla geçersiz kılınır. -->

---

## Kararlar

<!-- Her yeni karar aşağıdaki formatta en üste eklenir (en yeni en üstte) -->

### 2026-09-13 — Test koşucusu: Vitest, Faz 1'de ve lead task'larından önce

**Bağlam:** ILKELER "Kümülatif test altyapısı" karşılanmıyordu. Repoda test koşucusu yoktu; TASK-1.01/1.02/1.05'in testleri scratchpad betikleriyle koşup kayboldu. Plan revizyonunda kullanıcı "container içinde ücretsiz kütüphanelerle çalışalım" dedi.

**Seçenekler:**
1. Vitest — MIT, TypeScript ve `@/` takma adını yapılandırmayla çözer, route handler doğrudan import edilip çağrılır
2. `node:test` — sıfır bağımlılık ama `@/` takma adını çözmez
3. Koşucuyu "Kalite kapıları otomatik" fazına bırakmak

**Karar:** 1, bu fazda ve lead task'larından önce (kullanıcı). Konum kök `tests/`, komut `npm test` (`vitest run`), konteynerde koşar (TASK-1.16). TASK-1.12 ve TASK-1.14 testlerini oraya yazar. CI ve ölçüm betiklerinin kırmızıya dönememesi (B-030) "Kalite kapıları otomatik" fazında kalır.

**Gerekçe:** Lead hattı canlıya bağlanırken sözleşme testleri kalıcı olmalı. Aksi hâlde alıcı ya da uç değiştiğinde geriye dönük güven sıfırdan kurulur. Tek devDependency, çalışma zamanına girmez.

**İlgili Task/Faz:** Faz 1 — TASK-1.16

---

### 2026-09-13 — Alıcı provası: yerel kopyada kurulur, sonra canlıya taşınır

**Bağlam:** Aynı gün "Lead hedefi (yeniden)" kaydı "kurulum doğrudan canlı sistemlerde yapılır; yerel n8n kopyası kurulmaz" dedi. Plan revizyonunda kullanıcı alıcının önce container'da kurulup sınanmasını istedi. Bunker'ın talep tabloları satış otomasyonlarını besliyor; canlıda deneme-yanılma bir kulübe soğuk e-posta gönderebilir.

**Seçenekler:**
1. Yalnız canlı — yerel bakım yükü yok, ama her deneme canlı veritabanında
2. Yerel prova (compose profili: n8n + Postgres, Bunker şeması, canlıyla aynı sürümler) → sözleşme testi yerelde yeşil → canlıya taşıma

**Karar:** 2 seçildi (kullanıcı). Sıra: TASK-1.17 yerel ortam, TASK-1.13 yerel alıcı, TASK-1.14 site bağlantısı (yerel), TASK-1.18 canlıya taşıma. Aynı sözleşme test paketi iki ortamda koşar. Umami'nin yerel kopyası kurulmaz (`data-tag=local` yeterli). Bu kayıt "Lead hedefi (yeniden)" kararının "yerel n8n kopyası kurulmaz" cümlesini geçersiz kılar; hedef ve kısıt aynen geçerli.

**Gerekçe:** Sunucu kuralı "önce test" sunucuya dokunmadan karşılanır. Canlıya ilk yazan task alıcıyı kanıtlanmış hâliyle taşır. Yerel prova canlı otomasyonların çalışma zamanını kanıtlayamaz; o kanıt TASK-1.18'de canlıda alınır.

**İlgili Task/Faz:** Faz 1 — TASK-1.17, 1.13, 1.18

---

### 2026-09-13 — Faz sırası (yeniden): yayın öncesi düzeltmeler → alan adı geçişi → görsel/mobil → kalite kapıları → metin tonu

**Bağlam:** Aynı günün "alan adı geçişi öne alınır" kararı, geçişi kilitleyen bulguların ve yeni sıranın plan revizyonunda netleşmesini istedi. 2026-09-11 sırasında kalite kapıları ve metin tonu geçişten önceydi; M7 F7.5 "M6 F6.3 yeşil" bağımlılığı taşıyor.

**Seçenekler:**
1. Yayın öncesi düzeltmeler → Alan adı geçişi → Görsel ve mobil → Kalite kapıları → Metin tonu
2. Yayın öncesi düzeltmeler → Kalite kapıları → Alan adı geçişi → Görsel ve mobil → Metin tonu

Kilitleyen bulgu kümesi için üç aday: kararın dördü (B-029, B-018, B-024, B-011); dördüne ek iddia kuzenleri (B-044, B-050); dördüne ek ölçülmüş AA ihlalleri (B-032, B-033, B-034).

**Karar:** 1 ve kararın dördü (kullanıcı). Yeni faz konusu "Yayın öncesi düzeltmeler" B-029, B-018, B-024 ve B-011'i kapatır; alan adı geçişini kilitleyen tek faz odur. Hukukçu onayına bağlı kalem (B-008, B-024'ün yurt dışı aktarım dayanağı) fazı kilitlemez.

**Gerekçe:** Kullanıcı canlıya almak istiyor; v2'nin v1'den farkı tam bu dört bulgudur. Bedel bilinerek kabul: geçişten sonra CI yokken her push canlıya gider. Yayın kapısı (çalışma/yayın ayrımı, doğrulama) alan adı geçişi fazının kapsam tartışmasında `GIT-STRATEJI.md`'ye yazılır. M7 F7.5'in "M6 F6.3 yeşil" bağımlılığı o faza girerken güncellenir. Metin tonu canlıdan sonraya kalır. Bu kayıt 2026-09-11 "Faz sırası (yeniden)" kararının sırasını geçersiz kılar.

**İlgili Task/Faz:** `PHASES.md` → Sıradaki Fazlar

---

### 2026-09-13 — E-posta kaynağı: site her talepte gönderir, alıcı göndermez

**Bağlam:** "Lead hedefi (yeniden)" kaydı e-postanın tek kaynağını plan revizyonuna bıraktı. `route.ts` bugün kayıt ve e-postayı her talepte ayrı ayrı deniyor; alıcı da e-posta atarsa çift bildirim olur.

**Seçenekler:**
1. Site her talepte Resend'le gönderir, alıcı yalnız kaydeder — `route.ts` değişmez
2. Alıcı kaydedip e-posta atar, site Resend'i yalnız kayıt düşünce dener — `route.ts` değişir, iki e-posta düzeneği bakımda kalır

**Karar:** 1 seçildi (kullanıcı). `RESEND_API_KEY` Vercel'e girilir (TASK-1.06). Bunker kendiliğinden bildirim üretiyorsa çift bildirim TASK-1.11'de kullanıcıya getirilir.

**Gerekçe:** ILKELER "hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz": kayıt kendi sunucuda, bildirim Resend'de — sunucu düşerse e-posta yine gelir, Resend düşerse kayıt yine kalır. Bakım kolaylığı: tek e-posta düzeneği, kod değişikliği yok.

**İlgili Task/Faz:** Faz 1 — TASK-1.06, TASK-1.11

---

### 2026-09-13 — Faz sırası: alan adı geçişi kritik içerik ve yasal bulgular kapanınca, öne alınır

**Bağlam:** Kullanıcı canlıya almak istedi. Alan adı hemen v2'ye geçerse ürün denetiminin kritik bulguları yayına çıkar: site ürünün karşılamadığı beş yeteneği "var" diyor (B-029), ürün görselinde gerçek kişi adı var (B-018), yasal metin veri akışını eksik anlatıyor (B-024), KVKK başvuru adresi posta alamıyor (B-011).

**Seçenekler:**
1. Alan adı bu fazda v2'ye geçer — kritik bulgular yayına çıkar, her `main` push'u gerçek siteyi değiştirir
2. Canlı sistemlerde çalışılır; alan adı kritik içerik ve yasal bulgular kapanınca geçer ve sıradaki fazlarda öne alınır
3. Mevcut sıra korunur

**Karar:** 2 seçildi (kullanıcı). Çalışma canlı sistemlerde yürür (önizleme adresi, Bunker, n8n, Umami); `alpfitplus.com` şimdilik v1'de kalır. Geçişi hangi bulguların kilitlediği ve `PHASES.md` → Sıradaki Fazlar'daki yeni sıra plan revizyonunda netleşir.

**Gerekçe:** ILKELER "Kanıtsız iddia yayınlanmaz"; v2'nin v1'den farkı tam bu bulgulardır. Geçişten sonra her push canlıyı etkiler, yani `GIT-STRATEJI.md` yayın kapısı o gün yeniden yazılır. Bu kayıt 2026-09-11 "Faz sırası (yeniden)" kararındaki alan adı geçişinin yerini değiştirir.

**İlgili Task/Faz:** Faz 1 — plan revizyonu (`tasks/TASK-1.04.md` → 2026-09-13 Oturum Kaydı)

---

### 2026-09-13 — Analitik (yeniden): kendi Umami (`umami.kiwiailab.com`), Umami Cloud değil

**Bağlam:** 2026-09-11'de Umami Cloud seçildi. audit-product (2026-09-12) v1'in kendi sunucusunda Umami çalıştırdığını buldu; araştırma ve karar günlüğü bundan söz etmiyordu. Cloud'da kalınırsa alan adı geçişinde ölçüm iki kuruluma bölünür ve `alpfitplus.com`'un birikmiş geçmişi kopar.

**Seçenekler:**
1. Kendi Umami'ye ikinci site olarak eklenir
2. Umami Cloud ücretsiz katman kalır

**Karar:** 1 seçildi (kullanıcı). Olay adları (`demo-submit` / `whatsapp-click` / `phone-click`), `surface` özelliği, global tıklama dinleyicisi ve `data-tag` = aşama kararları aynen geçerli; değişen yalnız betik adresi ve site kimliği.

**Gerekçe:** Ölçüm geçmişi tek yerde kalır; ücretsiz katman sınırı yok; talep hattıyla aynı sunucu olduğu için yasal metin tek konum söyler (v1 metni: "Kendi sunucumuzdaki analitik (Umami) — Almanya (aynı sunucu)"). Reklam engelleyici kaybı aynen kabul. CSP yazılırsa (B-016) izin verilecek alan adı `umami.kiwiailab.com`. Bu kayıt 2026-09-11 "Analitik: Umami Cloud" kararının sağlayıcı kısmını geçersiz kılar.

**İlgili Task/Faz:** Faz 1 — TASK-1.07 plan revizyonunda yeniden yazılır

---

### 2026-09-13 — Lead hedefi (yeniden): Bunker'da `alpfit` talebi + anında e-posta, Google Sheet değil

**Bağlam:** 2026-09-11'de Google Sheet (Apps Script web app) seçildi. Kod ve sözleşme testi bitti (TASK-1.04) ama Google hesabındaki dağıtım yapılamadı. Kullanıcının Hetzner sunucusunda n8n (`n8n.kiwiailab.com`) ve çok kiracılı satış paneli Bunker (`ops.kiwiailab.com`, `alpfit` kiracısı, Postgres) zaten çalışıyor; ikisi de dışarıdan erişilebilir (2026-09-13 ölçüldü: n8n `/healthz` 200).

**Seçenekler:**
1. Sunucudaki n8n üzerinden Bunker'a Alpfit talebi + anında e-posta
2. Vercel'e bağlı yönetilen Postgres — yeni hesap, yeni kod, telefona uygun görüntüleme yok
3. Yalnız e-posta (Resend) — kalıcı kayıt yok
4. Google Sheets API + servis hesabı (araştırmadaki yedek rota) — kurulumu Apps Script'ten zahmetli

**Karar:** 1 seçildi (kullanıcı). Talep Bunker'da `alpfit` kiracısına Alpfit talebi olarak düşer ve `kivanc@kiwiailab.com`'a hemen e-posta gider. Kurulum doğrudan canlı sistemlerde yapılır; yerel n8n kopyası kurulmaz (kullanıcı). Sitenin alıcı sözleşmesi korunur: JSON POST, yanıtta `ok === true` doğrulaması. Giriş yolu (n8n iş akışı ya da Bunker'da ayrı giriş ucu) ve e-postanın tek kaynağı plan revizyonunda netleşir.

**Gerekçe:** ILKELER "gelen talep kaybolmaz": kayıt sunucudaki Postgres'e düşer; günlük yedek, sunucu dışı kopya ve aylık geri yükleme testi zaten kurulu (`../altyapi/README.md`). Satış takibi zaten Bunker'da yürüyor, talep ayrı bir e-tabloda kaybolmaz. Yeni tedarikçi yok.

**Kısıt (ölçüldü):** Bunker'ın `leads` ve `staged_leads` tabloları soğuk e-posta dizisini, otomatik onayı ve model sınıflandırmasını besliyor (`../bunker-dashboard/docs/system-flow.md`; `src/app/api/internal/` → `outreach-sequence-tick`, `triage-auto-approve`, `lead-classify-tick`). Demo talebi bu akışları tetiklememeli — talebi yapan kulübe soğuk satış e-postası gitmemeli. `/api/leads/intake` oturum isteyen CSV içe aktarma ucudur, web sitesi alıcısı olarak kullanılamaz.

KVKK: Aktarım maddesi Google yerine kendi sunucuyu söyler (`legal.ts`). Bu kayıt 2026-09-11 "Lead hedefi: Google Sheet" kararını geçersiz kılar; e-postanın ikincil olması ilkesi korunur.

**İlgili Task/Faz:** Faz 1 — TASK-1.04 plan revizyonu

---

### 2026-09-11 — Vercel ortam modeli: `main` = production, aşama `VERCEL_PROJECT_PRODUCTION_URL`'den türetilir

**Bağlam:** Kapsam tartışması önizlemede noindex'i `VERCEL_ENV !== "production"` koşuluna bağlamıştı. Araştırmada ölçüldü: Git bağlantılı projede `main` push'u `<proje>.vercel.app` adresine **production** dağıtımıdır (`VERCEL_ENV=production`) ve Vercel bu adrese otomatik noindex eklemez. Koşul olduğu gibi yazılsaydı önizleme indekslenir, test talepleri "production" etiketi alırdı.

**Seçenekler:**
1. `main` üretim dalı kalır; aşama türetilir: `VERCEL_ENV === "production"` ve üretim adresi `.vercel.app` ile bitmiyorsa `production`, Vercel'de ama değilse `preview`, dışarıda `local`
2. Vercel'de üretim dalı henüz olmayan bir ada çekilir; `main` push'ları preview olur, Vercel noindex'i kendisi ekler; Vercel Authentication elle kapatılır, F7.5'te üretim dalı elle `main` yapılır

**Karar:** 1 seçildi (kullanıcı). Aşama `next.config.ts`'te tek kez hesaplanır, `NEXT_PUBLIC_DEPLOY_STAGE` ile gömülür; noindex (başlık + robots + metadata), lead kaydındaki `env` alanı ve analitik etiketi bu tek değerden beslenir.

**Gerekçe:** Bakım kolaylığı ve kalıcılık: F7.5'te alan adı eklenince aşama kendiliğinden `production` olur, unutulabilecek yayın günü adımı yok; ek Vercel ayarı ve koruma toggle'ı gerekmez; adres herkese açık (telefon testi). Vercel'in "ilk dağıtım her zaman production" kuralıyla uyumlu.

**İlgili Task/Faz:** Faz 1 (`phases/PHASE-1.md` → Araştırma Bulguları)

---

### 2026-09-11 — Analitik: Umami Cloud (çerezsiz), olaylar tek global dinleyiciyle bağlanır

**Bağlam:** Üç dönüşüm olayı (demo gönderimi, WhatsApp, telefon) yüzey etiketiyle sayılacak; Vercel planı Hobby; KVKK gereği çerezsiz.

**Seçenekler:**
1. Vercel Web Analytics — Hobby'de özel olay yok (elendi)
2. Umami Cloud ücretsiz katman — çerezsiz, script 4,7 KB (2,3 KB gzip), `data-tag` ile ortam ayrımı
3. Plausible Cloud — çerezsiz, ücretsiz plan yok ($9/ay)
4. Kendi olay ucu → Google Sheet — panel yok, bakım bizde

Bağlama yöntemi: (a) 20 bağlantının her birine `data-umami-event` özniteliği, (b) layout'ta tek tıklama dinleyicisi (`wa.me` / `tel:` hedefli) + bölümlere `data-surface`.

**Karar:** 2 + (b) seçildi (kullanıcı). Olay adları `demo-submit` / `whatsapp-click` / `phone-click`, tek özellik `surface`; etiket `data-tag` = aşama; kişisel veri olaya girmez; `window.umami` yoksa sessiz geçilir.

**Gerekçe:** Ölçülebilirlik ilkesi: yeni eklenen her WhatsApp/telefon bağlantısı otomatik sayılır, işaretlemeyi unutmak sessiz sayım kaybı üretmez. Bakım kolaylığı: ücretsiz, bağımlılıksız, tek script. Sağlayıcı değişirse yalnız sarmalayıcı (`src/lib/analytics.ts`) değişir. Reklam engelleyici kaybı bilinerek kabul (discuss).

**İlgili Task/Faz:** Faz 1 (`phases/PHASE-1.md` → Araştırma Bulguları)

---

### 2026-09-11 — Lead hedefi: Google Sheet; e-posta ikincil (Resend)

**Bağlam:** `/api/demo` webhook veya dosya hedefine yazıyor ama ikisi de tanımsız; Vercel'de kalıcı disk yok, dosya yolu yayında çalışmaz.

**Seçenekler:**
1. Google Sheet (Apps Script web app'e JSON POST) — ucuz, telefondan bakılır
2. Notion veritabanı — takip akışı orada yürür, kurulum daha fazla
3. Slack/WhatsApp mesajı — anlık ama kalıcı kayıt zayıf
4. Vercel Marketplace Postgres — en sağlam, tek kişilik ekibe fazla

**Karar:** 1 seçildi (kullanıcı). E-posta Resend ile ikincil kalır; `demo@alpfitplus.com` alan adı doğrulaması aynı fazda yapılır. Lead kaydına ortam alanı eklenir (test/gerçek ayrımı).

**Gerekçe:** ILKELER "gelen talep kaybolmaz": önce dayanıklı kayıt, sonra e-posta. Bakım kolaylığı: e-tablo kurulumu ve bakımı en düşük. KVKK: aktarım maddesine e-tablo tedarikçisi eklenir (B-008 kapsamında).

**İlgili Task/Faz:** Faz 1 (`phases/PHASE-1.md`)

---

### 2026-09-11 — Faz sırası (yeniden): yayın+lead+analitik → görsel/mobil → kalite kapıları → metin tonu → alan adı geçişi → asistan

**Bağlam:** Aynı gün alınan önceki sıra kararı metin tonunu ilk faz yapıyordu. discuss-phase'de metin tonunun ön koşulu (kullanıcının örnek cümleleri) hazır değildi; kullanıcı görsel ve mobil tarafı da geliştirmek istedi.

**Seçenekler:**
1. Metin tonuyla başla, örnekler gelene kadar bekle
2. Önce önizleme + lead + analitik; görsel/mobil incelemeyi önizleme adresi üzerinden gerçek telefonda yap; metin tonunu canlıya almadan hemen önceye al

**Karar:** 2 seçildi (kullanıcı). Önceki faz sırası kararı (2026-09-11, "metin tonu → yayın…") bu kararla geçersizdir. Yeni faz konusu "Görsel ve mobil iyileştirme" eklendi.

**Gerekçe:** Metin tonuna bağımlı faz yok; lead hattı ve ölçüm ILKELER'in pazarlıksız maddeleri ve bugün karşılanmıyor. Önizleme adresi telefonda incelemeyi mümkün kılar; görsel faz somut bulgularla açılır. Metin tonu yalnız `src/content/` (ve oraya taşınacak gömülü metin) değiştirir; kalite kapıları o zaman otomatik koşuyor olur.

**İlgili Task/Faz:** Faz 1 (`phases/PHASE-1.md`), `PHASES.md` → Sıradaki Fazlar

---

### 2026-09-11 — Rakip adı sitede geçmez

**Bağlam:** Fiyat sayfasındaki karşılaştırma bloğu bir rakibin adını yazıyordu.

**Seçenekler:**
1. Adı tut, kaynağı ve tarihi ekle — şeffaf ama karşılaştırmalı reklam riski
2. Adı kaldır, yöntem + erişim tarihi ile adsız kıyas — daha az somut ama güvenli

**Karar:** 2 seçildi; ad kaldırıldı (commit `cacea4c`).

**Gerekçe:** Türkiye'de karşılaştırmalı reklam mevzuatı sıkı; rekabet dosyasının kendi kuralı da "rakip iddialarını kendi davranışımıza çevir". Sınır `CLAIMS.md`'de.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-11 — Faz sırası: metin tonu → yayın+lead+analitik → kalite kapıları → alan adı geçişi → asistan

**Bağlam:** Kickoff'ta beş faz konusu çıktı; sıra belirlenmeliydi.

**Seçenekler:**
1. Önce yayın ve lead (dönüşüm ilkesi) — ama metin tonu değişecekse önizlemeye eski ton çıkar
2. Önce metin tonu (kısa, tek sayfada örnekle başlar), sonra yayın hattı

**Karar:** 2 seçildi. v2.0 alan adı geçişiyle biter (konu 1–4); asistanın Claude'a bağlanması v2.1.

**Gerekçe:** Metin tonu küçük ve kullanıcı onayına bağlı; önizleme yayını sonrasında içerik değişimi daha pahalı. Kalite kapıları alan adı geçişinden önce gelir ki geçiş kırmızıya düşmesin. Asistan modeli anahtar ve maliyet kararı gerektirir, v2.0'ı kilitlemez.

**İlgili Task/Faz:** Kickoff (PHASES.md → Sıradaki Fazlar)

---

### 2026-09-11 — Modül yapısı: 7 modül, M6 hepsini kapılar, M7 en sonda

**Bağlam:** DevFlow kickoff'ta kod tabanı modüllere bölündü.

**Karar:** M1 İçerik ve iddia kaynağı · M2 Sayfalar ve bölümler · M3 Lead hattı · M4 Site asistanı · M5 Görsel varlık hattı · M6 Kalite kapıları · M7 Yayın ve altyapı. Bağımlılık: M1→M2, M1→M4, M5→M2; M6 hepsini kapılar; M3 hedefi ve analitik M7'de tanımlanır.

**Gerekçe:** İçerik tek kaynak olduğundan M1 ayrıştı; görsel üretim ayrı bir hat (betikler + salt okunur ürün reposu) olduğundan M5 ayrıştı; kalite ve yayın kesişen kaygılar olduğundan modül olarak adlandırıldı ki faz konuları onlara bağlansın.

**İlgili Task/Faz:** Kickoff (MODULE-MAP.md)

---

### 2026-09-10 — Kiwi AI Lab imzası büyütüldü, footer'da kendi bandı

**Bağlam:** Üreticinin markası footer'da küçük bir satırdı.

**Karar:** Ayrı bant (`KiwiBand.tsx`), büyütüldü.

**Gerekçe:** Kullanıcı kararı; üretici kimliği güven unsuru, saklanmıyor.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Web sitesi hizmeti eklenmeyecek

**Bağlam:** Kulüplere web sitesi yapma hizmeti ürün paketine eklenebilir miydi?

**Karar:** Hayır, şimdilik eklenmiyor.

**Gerekçe:** Kullanıcı kararı; tek huni ve tek ürün mesajı korunuyor. Denetim süzgeci için `BULGULAR.md` → Bilinçli Tercihler.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Chatbot: önce hazır akış, sonra AI

**Bağlam:** Site asistanı için model bağlantısı mı, sabit karar ağacı mı?

**Seçenekler:**
1. Doğrudan Claude'a bağla — anahtar, maliyet tavanı ve iddia sınırı testi gerekir
2. Önce `src/content/chat.ts` karar ağacı; arayüz `/api/chat` ucuna bağlanacak şekilde kurulur

**Karar:** 2 seçildi. Ağaç ileride modelin sistem talimatının bilgi tabanı olur; tek kaynak korunur.

**Gerekçe:** Bugün model olmadan da faydalı; iddia sınırı sabit metinde garanti. Model faz konusu v2.1'de.

**İlgili Task/Faz:** Kickoff öncesi (commit `19cc44a`)

---

### 2026-09-10 — Fotoğraf: seçici ve atmosferik, gerçek salon görselleri

**Bağlam:** Stok fotoğraf mı, illüstrasyon mu, sahne fotoğrafı mı?

**Karar:** Pexels lisanslı gerçek salon fotoğrafları, az ve seçici; segment sayfalarında foto kahramanlar.

**Gerekçe:** Kullanıcı gerçek fotoğraf istiyor, klişe istemiyor (`STYLE-GUIDE.md`). Kaynaklar `research/FOTOGRAF-KAYNAKLARI.txt`.

**İlgili Task/Faz:** Kickoff öncesi (commit `e994a4a`)

---

### 2026-09-10 — Görsel ton: açık ve ferah, sage vurgulu

**Bağlam:** v1 farklı bir paletteydi; v2 sıfırdan.

**Karar:** Açık tema, `#74B36F` sage aksan, Sora + Inter. Karanlık tema yok.

**Gerekçe:** Kullanıcı kararı; butik kulüp sahibine ferah ve güvenilir görünüm. Tokenlar `STYLE-GUIDE.md`.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Büyüme sayfaları: önce segment sayfaları

**Bağlam:** Blog mu, segment sayfaları mı, geçiş rehberi mi?

**Karar:** Önce 4 segment sayfası; geçiş sayfası ve yazılım seçim rehberi 2026-09-11'de eklendi. Blog/changelog pilot sonucuna kadar yok.

**Gerekçe:** Segment sayfaları saha satışını doğrudan destekler; blog organik trafik varsayımı ister (`ILKELER.md` → Proje Ufku).

**İlgili Task/Faz:** Kickoff öncesi (commit `5977a99`)

---

### 2026-09-10 — Dil: yalnız Türkçe

**Bağlam:** v1'de dokuz `/en/*` sayfası vardı.

**Karar:** v2 tek dil. v1'in İngilizce adresleri alan adı geçişinde 301 ile Türkçe karşılığına yönlenir (M7 → F7.5).

**Gerekçe:** Hedef kitle Türkiye; ikinci dil bakım maliyeti tek kişilik ekibe ağır, dönüşüme katkısı kanıtsız.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Fiyat sunumu: tek düz fiyat, katmanlı paket yok

**Bağlam:** Rakiplerin çoğu katmanlı paket sunuyor.

**Karar:** Şube başı tek fiyat, mobil uygulama dâhil, KDV hariç; şube sayısına göre hesaplayıcı. Kaynak `src/content/pricing.ts` (dayanak `../alpfit-plus-satis/fiyat/model.md`, kurucu kararı 2026-07-10).

**Gerekçe:** "Paket yok, kademe yok, sürpriz yok" satış mesajının kendisi; tek kaynak fiyatı bileşen ve chat ağacında tutarlı kılar.

**İlgili Task/Faz:** Kickoff öncesi

---
