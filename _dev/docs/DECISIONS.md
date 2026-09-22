# DECISIONS — Karar Günlüğü

**Amaç:** Önemli mimari ve tasarım kararlarının kaydı. "Neden X yerine Y tercih edildi?" sorusunun cevabı burada.
**Ne zaman güncellenir:** Önemli bir teknik, mimari veya tasarım kararı alındığında.

> İddia sınırı (ne söylenir, ne söylenmez) burada değil → `CLAIMS.md`. Tasarım kuralları → `STYLE-GUIDE.md`. Buradaki kayıtlar onların **üzerine** gelen tercihlerdir.

<!-- KURAL: Bu günlük append-only'dir — yazılmış bir karar silinmez, düzeltilmez. Geçersizleşen karar YENİ bir kararla geçersiz kılınır. -->

**Kapanan aralıklar (arşiv):**

- [`DECISIONS-2026-09-10..2026-09-13.md`](DECISIONS-2026-09-10..2026-09-13.md) — kuruluş dönemi, 22 kayıt: dil (yalnız Türkçe), fiyat sunumu, fotoğraf ve görsel ton, chatbot sırası, modül yapısı, rakip adsızlığı, faz sırası, Vercel ortam modeli, analitik (Umami), lead hedefinin ilk iki tur kararı, Vitest, alıcı provası, e-posta kaynağı.

<!-- KURAL: Doküman kırmızı çizgiyi (~20k token) aştığında EN ESKİ kapanan aralık `DECISIONS-<ilk>..<son>.md`'ye taşınır ve buraya tek satırlık pointer düşer; kayıt, sıra ve anlam korunur (içerik-koruyan bölme). Giriş noktası HER ZAMAN bu dosyadır — kararı arayan adım (review-phase'in `Superseded` araması, audit-product'ın bilinçli-tercih süzgeci) buradan çocuğa izler. Kanon: CLAUDE.md → Boyut ve Bölünme. -->

---

## Kararlar

<!-- Her yeni karar aşağıdaki formatta en üste eklenir (en yeni en üstte) -->

### 2026-09-22 — Yetenek iddiaları tek bir yetenek listesinden türer; cümle bazlı düzeltme reddedildi

**Bağlam:** B-029 ölçtü: site ürünün bugün karşılamadığı **beş** yeteneği "var" diye anlatıyor (ölçüm grafiği + diyetisyen notu · "iptal eşiğini siz belirlersiniz" · üyelik bitişi bildirimi · yetkinin geri alınması · kampanya) ve dördünde ürünün **kendi kaydı** bunu açıkça söylüyor ("Yakında", "v1.5 adayı", "ertelendi", "W8"). Kök neden: sitedeki yetenek iddialarını ürün deposuna karşı doğrulayan hiçbir kapı yok; tek mekanizma `/ozellikler` sayfasının "Yolda" kolonu ve o kolon **elle** tutuluyor — nitekim beşinci kalemde aynı sayfanın iki kolonu birbirini kesiyor. İkinci katman B-040: ürün yol haritası bugün **dört ayrı evde** ve 5/4/3/3 ayrışmış. Aynı sayfa (`src/app/ozellikler/page.tsx:86`) ziyaretçiye *"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"* diye taahhüt veriyor.

**Seçenekler:**
1. Beş cümleyi ürün deposuna karşı tek tek doğrula ve düzelt; yapı değişmez.
2. "Bugün var / yolda" ayrımını `src/content/` içinde **tek bir yetenek listesinden** türet; beş cümle o listeye göre düzelsin.

**Karar:** 2 (kullanıcı teyidi, discuss-phase 2026-09-22). Listenin somut şekli (adı, şeması, hangi dosyada durduğu, tüketicilerin onu nasıl okuduğu) research-phase'in konusudur; burada kararlaştırılan, iddianın **tek kaynaktan türemesi**.

**Gerekçe:** ILKELER → "Kalıcılık önceliği" ve "Kanıtsız iddia yayınlanmaz". Ürün ilerlemeye devam ediyor, iddialar ise 2026-09-09/10'da yazıldı; cümle bazlı düzeltme (seçenek 1) aynı sınıfı bir sonraki ürün sürümünde yeniden doğurur ve yine elle bulunur — bu bulgu fiilen **iki denetim turunda da elle** bulundu. Tek liste üç işi birden yapar: beş cümlenin dayanağı olur · yol haritasının dört evde ayrışmasını (B-040) kapatır · M6 F6.4'ün (iddia sızıntı denetimi) ürün deposuna karşı kontrol edeceği listeyi doğurur. Doğrulama için gereken kaynak zaten mevcut — ürün deposu bu bilgiyi adıyla aranabilir notlarda taşıyor ("Yakında", "v1.5", "W8") — eksik olan tek şey bağdı. Karşı ağırlık: faz bir task büyür; kabul edildi.

**İlgili Task/Faz:** Faz 2 — kapsam kararı (`phases/PHASE-2.md` → Kapsam Tartışması). Bulgular: B-029, B-040. İleride bağlanacağı kapı: M6 F6.4 (`modules/M6-Kalite-Kapilari.md`).

---

### 2026-09-22 — `.env`'in imaja sızması: iki canlı anahtar döndürülür (IP tuzu + önizleme depo token'ı)

**Bağlam:** B-058 ölçtü: `.dockerignore:6` yalnız `.env*.local` yazıyor ve bu kalıp `.env`'i **eşlemiyor**; üretim Docker imajı `/app/.env`'i beş anahtarın **değeriyle** taşıyor (`Dockerfile:27` `COPY . .` → standalone çıktı → `:35` runner katmanı). `docker save`, `docker history` ya da bir registry push'u bu değerleri imajla birlikte taşır. Hafifletici: bugün CI yok, registry yok, imaj bu makineden çıkmadı (ölçüldü) — risk **potansiyel**. Kullanıcı `.env`'in üretim değerleri taşıdığını teyit etti (discuss-phase 2026-09-22). Beş anahtarın **ikisi canlı**: `LEAD_STORE_TOKEN` (v1'in lead deposunun **önizleme** token'ı) ve `IP_HASH_SALT`. Kalan üçü beyana göre yerel ya da gizli değil — `LEAD_TOKEN_PREVIEW`/`LEAD_TOKEN_PRODUCTION` yerel depo kopyasının token'larıdır (`.env.example` §3 bunu adıyla beyan ediyor: *"YALNIZ YEREL: canli deger BURADA ASLA kullanilmaz"*), `LEAD_STORE_URL` bir adres.

**Seçenekler:**
1. `.dockerignore`'u düzelt, anahtarlara dokunma — imajın hiç dışarı çıkmadığı ölçümüne güvenilir.
2. Yalnız `IP_HASH_SALT` döndürülsün; depo token'ı alan adı geçişinde üretim token'ıyla birlikte yenilenir (o gece sunucuya zaten bakılacak).
3. İkisi de döndürülsün.

**Karar:** 3 (kullanıcı, discuss-phase 2026-09-22). Yanında iki yapısal düzeltme: `.dockerignore`'a `.env` ve `.env.*` (`!.env.example` istisnasıyla), ve `web-prod`'a **bilinçli** `environment:`/`env_file:` — yerel üretim provası neye bağlandığını açıkça söylesin.

**Gerekçe:** `IP_HASH_SALT`'ın döndürülmesi ölçülerek **bedelsiz** bulundu: değer v1'in değil, TASK-1.18'de v2 için `openssl rand -hex 32` ile üretildi ve hiçbir yere kaydedilmedi (`tasks/archive/TASK-1.18.md` → Karar Noktası (b)), yani v1'in lead kayıtlarıyla `ip_hash` sürekliliği bugün **zaten yok**. Tek etkisi: v2'nin `leads_preview`'daki 15 test kaydının `ip_hash`'i yeni kayıtlarla **karşılaştırılamaz** hâle gelir — o kayıtlar bilinçli test turlarıdır ve 12 aylık saklama işi siler. Depo token'ı sunucuda bir işlem gerektiriyor ama v1'in canlı lead akışı **üretim** token'ını kullandığı için etkilenmiyor; buna karşılık seçenek 2, sızmış sayılan bir token'la geçişe kadar yaşamayı gerektiriyordu ve bunun gerekçesi yoktu. **F7.5'e taşınan sınır değişmedi:** alan adı geçişinde `IP_HASH_SALT` v1'in değerine çevrilir (`modules/M7-Yayin-ve-Altyapi.md` → F7.5 Edge Case'leri); bugünkü döndürme o adımı etkilemez, yalnız aradaki değeri tazeler.

**Açık kalem (fazın ilk işlerinden biri):** `.env`'deki `LEAD_TOKEN_PRODUCTION` gerçekten yerel depo kopyasının token'ı mı, yoksa canlı üretim token'ı mı? `.env.example` §3 "yalnız yerel" diye beyan ediyor ama bu beyan **ölçülmedi**. Canlı değer oradaysa döndürme kapsamı üçe çıkar ve v1'in canlı lead akışı da ilgilenir.

**İlgili Task/Faz:** Faz 2 — kapsam kararı (`phases/PHASE-2.md`). Bulgu: B-058. Env taşıma listesi: M7 F7.5.

---

### 2026-09-22 — Analitik olay adları v1 ile hizalandı: `whatsapp-click`/`phone-click` yerine `whatsapp`/`phone`

**Bağlam:** TASK-1.08 `src/lib/analytics.ts`'i (olay sözlüğü + `track()`) yazarken 2026-09-13 «Analitik (yeniden)» kararı olay adlarını `demo-submit` / `whatsapp-click` / `phone-click` olarak sabitlemişti. 2026-09-14 «Umami site kaydı» kararı v2'nin alan adı geçişinde **v1'in Umami kaydına** devralınacağını netleştirdi — bu, geçmiş ve yeni verinin panelde **aynı seride** kalması gerektiği anlamına gelir. v1'in olay adları (salt-okunur, `../Alpfitplus-website.v1/src/config/analytics.ts:20-42`, doğrulandı 2026-09-22): `demo-submit`, `whatsapp`, `phone`, `email`, `instagram`, `cta` — `-click` eki yok. Aynı kayıtta iki farklı adlandırma birikirse geçiş günü seri ikiye böler, geçmiş veri geri toparlanamaz.

**Seçenekler:**
1. 2026-09-13 kararını aynen uygula: `whatsapp-click` / `phone-click`.
2. v1 ile hizala: `whatsapp` / `phone` (`-click` eki düşer), `demo-submit` zaten aynı.

**Karar:** 2. `EVENTS` sözlüğü (`src/lib/analytics.ts`) `demo-submit` / `whatsapp` / `phone` olarak yazıldı — v2'de bugün tüketicisi olmayan v1 olayları (`email`, `instagram`, `cta`) açılmadı (kullanılmayan sabit yok, YAGNI).

**Gerekçe:** 2026-09-13 kararının gerekçesi (ölçülebilirlik: yeni bağlantı otomatik sayılır; bakım: tek sarmalayıcı, sağlayıcı değişse yalnız `analytics.ts` değişir) **mimari** tercihi (global tıklama dinleyicisi + tek `surface` alanı) savunuyordu, üç ad dizesinin `-click` eki taşımasına özgü bir gerekçe içermiyordu — 2026-09-14'ün v1-hizası hedefiyle çelişmeyen güçlü bir gerekçe bulunamadı. Mimari tercih (dinleyici, `surface` alanı, `data-tag`, sessiz geçiş) aynen geçerli kalır; değişen yalnız üç ad dizesi. `surface` (yüzey) v1'de serbest dizeydi, v2'de tip düzeyinde daraltıldı (TASK-1.08 Alt Görev 1) — bu event adı hizasını bozmaz, `surface` event adından bağımsız ayrı bir veri alanı.

**İlgili Task/Faz:** Faz 1 — TASK-1.08 (bu kayıt, `src/lib/analytics.ts` yazıldı). **Açık kalem:** `tasks/TASK-1.09.md`'nin kendi Alt Görevler/Test Kriterleri metni hâlâ `whatsapp-click`/`phone-click` yazıyor — o task henüz çalıştırılmadı, plan metni run-task'ın değil plan-phase/verify-plan'ın konusu; BULGULAR.md → Gelen Kutusu'na düşüldü.

---

### 2026-09-21 — Anahtar kasası: yönetim düzeyi anahtarlar repo dışında dosyada, panel adımları API'ye taşınır

**Bağlam:** Faz 1'in son üç task'ı (1.06 Resend, 1.07 Umami, 1.18 depo) kullanıcının bir web paneline girip değer üretmesini bekliyordu. Kullanıcı panel adımlarında zorlanıyor (2026-09-14 ve 2026-09-21) ve her adım koşumu durduruyordu: TASK-1.06 bir tam tur boyunca `RESEND_API_KEY` bekledi.

**Seçenekler:**
1. Her serviste kullanıcı panele girer, değeri üretir, oturuma verir (bugüne kadarki hâl).
2. Yönetim düzeyinde bir anahtar bir kez alınır, repo dışında dosyada tutulur; oturumlar panel işini o servisin API'siyle yapar.
3. Anahtarlar repo içinde şifreli bir kasada tutulur (`sops`, `git-crypt` vb.).

**Karar:** 2 (kullanıcı, 2026-09-21). Kasa `~/.config/alpfit/secrets.env`, izin `600`, repo dışında — git görmez. Bugünkü içeriği: `RESEND_ADMIN_KEY` (Resend Full access). Oturumlar bu anahtarla servis API'sini çağırır ve **dar yetkili** iş anahtarlarını kendileri üretip Vercel'e `--sensitive` girer (TASK-1.06: `alpfitplus-web-v2`, `sending_access`, tek alan adına bağlı).

**Gerekçe:** Panel adımı tek kişilik ekipte gerçek bir darboğaz; API yolu hem kullanıcıyı serbest bırakıyor hem **ölçülebilir** oluyor (alan adı doğrulaması artık ekran görüntüsü değil `GET /domains` → `verified`). Yönetim anahtarı siteye hiç girmiyor, üretim yüzeyinde yalnız dar yetkili anahtar duruyor — sızıntı yüzeyi büyümüyor, küçülüyor. Seçenek 3 reddedildi: şifreli kasa da bir parola/anahtar ister ve onu yine repo dışında tutmak gerekir, yani bir katman ekler ama sorunu taşımaz.

**Sınır:** Kasa **yönetim** anahtarı tutar, çalışma zamanı sırrı değil — sitenin sırları Vercel env'inde ve `.env`'de kalır. Değer hiçbir dokümana, commit'e, log'a yazılmaz; yalnız anahtar adı ve konum yazılır (`CLAIMS`/`CLAUDE.md` sır disiplini değişmedi). İleride Umami ve başka servislerin yönetim anahtarları da aynı dosyaya girer.

**İlgili Task/Faz:** Faz 1 — TASK-1.06 (ilk kullanım), TASK-1.07 (Umami adımı aynı yolu bekliyor)

---

### 2026-09-14 — Umami site kaydı: önizlemede yeni v2 kaydı, alan adı geçişinde v1'in `alpfitplus.com` kaydına geçilir

**Bağlam:** TASK-1.07 v2 için kendi Umami'de yeni bir site kaydı açıyor (`Alpfit Plus v2 (önizleme)`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`). Alan adı geçişinde hangi kaydın kullanılacağını geçiş fazına bırakmıştı (`tasks/TASK-1.07.md` → Dikkat Noktaları; `PHASES.md` → Alan adı geçişi). Kullanıcı yönü verdi (2026-09-14, run-phase turu, orkestratör aracılığıyla).

**Seçenekler:**
1. Önizleme boyunca ayrı v2 kaydı; alan adı geçişinde v2, v1'in `alpfitplus.com` kaydına geçer.
2. Geçişten sonra da v2'nin yeni kaydı sürer; `alpfitplus.com`'un geçmişi v1 kaydında ayrı kalır.
3. Bugünden v1'in kaydı kullanılır.

**Karar:** 1 (kullanıcı). TASK-1.07 planlandığı gibi yeni önizleme kaydını açar. v1'in kaydı v1 canlıyken v2'de kullanılmaz. Alan adı geçişi fazında Production `NEXT_PUBLIC_UMAMI_WEBSITE_ID` v1 kaydının kimliğine çevrilir.

**Gerekçe:** `alpfitplus.com`'un geçmiş trafiği tek kayıtta kesintisiz görünür — 2026-09-13 «Analitik (yeniden)» kararının "birikmiş geçmiş kopmasın" gerekçesiyle aynı. Seçenek 3 önizleme ve test trafiğini v1'in canlı sayılarına karıştırırdı. Seçenek 2 geçmişi iki kayda bölerdi ve geri alınamazdı: geçişten sonra biriken veri yanlış kayıtta kalırdı.

**İlgili Task/Faz:** Faz 1 — TASK-1.07; Alan adı geçişi fazı (M7 F7.5)

---

### 2026-09-14 — Bildirim durumu (notify_*): yalnız notify_team geri yazılır, notify_lead'e dokunulmaz

**Bağlam:** TASK-1.14'ün depo adaptörü kayıt sonrası bildirim durumunu (`notify_team`/`notify_lead`) depoya `PATCH /lead/{id}` ile geri yazabilir (v1'in kendi ucu ikisini de yazıyor — ekip bildirimi + talep sahibine onay e-postası). v2'nin bugünkü tasarımı yalnız ekibe (`DEMO_TO`) tek e-posta gönderiyor (2026-09-13 "E-posta kaynağı"); talep sahibine ayrı bir onay e-postası bu fazın kapsamında değil (Gelen Kutusu'nda, "Alan adı geçişi" kapsam tartışmasına bırakıldı).

**Seçenekler:**
1. Yalnız `notify_team` PATCH edilir (e-posta sonucuyla `sent`/`failed`); `notify_lead` hiç yazılmaz, depo varsayılanı `pending` kalır.
2. İkisi de `pending` bırakılır, hiç PATCH yapılmaz.
3. `notify_lead` da `skipped` olarak yazılır (site talep sahibine e-posta göndermediği için).

**Karar:** 1 (task dokümanının önerisiyle, run-task oturumunda). `notify_lead` alanı depo şemasında **rezerve** kalır: v1'de anlamı "ziyaretçi e-posta vermedi" (`skipped`) ya da onay e-postası sonucu (`sent`/`failed`); v2 bugün o e-postayı hiç göndermediği için alanı erken `skipped` yazmak, alan adı geçişinde v1'in yerini alınca gerçek anlamla çakışırdı.

**Gerekçe:** Panelde "ekibe bildirim gitti mi" sorusu cevaplanır (asıl ihtiyaç). `notify_lead`'in anlamı ileride (onay e-postası özelliği eklenirse) tek elden, geriye dönük tutarlı biçimde doldurulabilsin diye bugün dokunulmaz — erken ve yanlış bir değerle doldurmak iki farklı anlamın aynı koleksiyonda karışmasına yol açardı.

**İlgili Task/Faz:** Faz 1 — TASK-1.14

---

### 2026-09-14 — Depo sözleşmesinin sınanması: v1'in PocketBase'inin yerel kopyası, canlıya tek teyit isteği

**Bağlam:** "Lead hedefi (yeniden, 2)" kaydı sitenin yeni kayıt adaptörünün nerede sınanacağını plan revizyonuna bıraktı. Seçenekler yerel konteyner ya da canlı önizleme koleksiyonuydu. Depo kodu (`pb_hooks`, `pb_migrations`, Dockerfile) v1 reposunda, yani bu projenin dokunulmazında duruyor. Canlı depo v1'in üretim taleplerini de tutuyor ve `ip_hash` başına saatte 5 kayıtla sınırlı.

**Seçenekler:**
1. Yerel kopya: compose profili, imaj v1'in Dockerfile'ından, `pb_hooks` ve `pb_migrations` v1'den salt okunur bağlı. Sözleşme paketi ve sitenin uçtan uca turu yerelde; canlı depoya tek teyit isteği.
2. Yerel ortam yok: adaptör Vitest'te sahte yanıtlarla sınanır, gerçek depo ilk kez canlı `leads_preview`'da görülür.

**Karar:** 1 (kullanıcı, plan revizyonu). Profil `lead` (TASK-1.17). Sözleşme paketi yalnız yerel adrese karşı koşar, canlı adres verilirse istek atmadan reddeder (TASK-1.13). Sitenin adaptörü yerel depoda uçtan uca sınanır (TASK-1.14). Canlıda tek istek, token'ın önizleme koleksiyonuna yazdığını panelde gösterir (TASK-1.18). 2026-09-13 "Alıcı provası" kararının "aynı sözleşme paketi iki ortamda koşar" cümlesi bu hedefte geçersizdir; paket tek ortamda (yerel) koşar.

**Gerekçe:** Adaptör belgeden kopyalanmış sahte yanıtlara değil depo **kodunun kendisine** karşı sınanır. v1'de hook değişirse paket kırmızıya döner (kümülatif test). Canlı `leads_preview`'a test yığılmaz ve v1 ziyaretçileriyle paylaşılan sınıra takılınmaz. Bedeli tek bir küçük ortam task'ı; v1 reposunda dosya değişmez. Aynı ortam alan adı geçişinde yeniden kullanılır.

**İlgili Task/Faz:** Faz 1 — plan revizyonu 2026-09-14; TASK-1.17, 1.13, 1.14, 1.18

---

### 2026-09-14 — Lead hedefi (yeniden, 2): v1'in lead deposu (PocketBase, `lead.alpfitplus.com`), Bunker değil

**Bağlam:** TASK-1.11 keşfi Bunker'a giriş için üç kayıt biçimi ve iki alıcı yolu ölçtü. `alpfit` canlı soğuk e-posta kampanyasının kiracısı; `leads`/`staged_leads`'e yazılan talep soğuk hatta düşebilir. Güvenli yol (ayrı tablo + Bunker ucu) Bunker OS reposunda iş, bir migration ve yerel prova ortamı istiyordu. Kullanıcı sorulara şöyle cevap verdi (2026-09-14): *"şu an mevcut canlı sitede nereye yazılıyor demo talebi basit bir şekilde yazılsın zaten mail de gelecek bu yeterli sonra değiştiririz gerekirse"*. Yönü verdi, seçimi devretti.

Ölçüldü: v1 talebi Bunker'a değil, aynı sunucuda ayrı compose projesi olarak koşan PocketBase deposuna yazıyor. Kaynak: `../Alpfitplus-website.v1/api/demo.ts:233-256` (`POST ${LEAD_STORE_URL}/lead`, `X-Lead-Token`), e-posta `:324-346` (Resend, ekip + talep sahibi). Depo: `pocketbase/README.md:23-42,170-222`; `lead.alpfitplus.com/api/health` 200 (2026-09-14).

**Seçenekler:**
1. Bunker'da ayrı tablo + Bunker ucu (TASK-1.11 önerisi): izolasyon kodla kanıtlı. Bedeli Bunker OS'ta iş, canlı migration, yerel n8n/Postgres/Bunker ortamı.
2. Bunker `leads` ya da `staged_leads`: panelde görünür. Talep soğuk otomasyona düşebilir, kullanıcı bu riski kabul ettiğini söylemedi.
3. v1'in PocketBase deposu (`leads_preview` / `leads`) + site e-postası.
4. Yalnız e-posta: kalıcı kayıt yok, ILKELER "gelen talep kaybolmaz" ile çelişir.

**Karar:** 3 (kullanıcının yönüyle, run-task turu, orkestratör çerçevesi). Talep `lead.alpfitplus.com`'a `POST /lead` ile yazılır. Kimlik v1'in `X-Lead-Token` başlığı; token koleksiyonu da belirler. E-posta 2026-09-13 "E-posta kaynağı" kararındaki gibi siteden gider. Env anahtar adları v1'inkiyle aynı: `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT`. 2026-09-13'te önerilen `LEAD_WEBHOOK_TOKEN` doğmaz. v2 önizleme aşamasında önizleme token'ını kullanır; üretim token'ına alan adı geçişinde (M7 F7.5) geçer.

**Gerekçe:**
- **(a) Soğuk otomasyona girmez.** Koleksiyonların beş API kuralı `null`, yani yalnız superuser (`pocketbase/pb_migrations/1785184594_…js:105-109`). Tek yazma kapısı `pb_hooks/lead.pb.js`, okuyan tek zamanlanmış iş 12 aylık saklama cron'u (`retention.pb.js:30`). Bunker kodunda (`bunker-dashboard/src`, `bunker-v2`) PocketBase ya da `lead.alpfitplus` referansı 0. Canlı n8n'in 2026-09-14 02:30 UTC yedeğindeki iş akışlarında `pocketbase` / `lead.alpfitplus` / `alpfitplus` / `X-Lead-Token` geçişi 0.
- **(b) En az hareketli parça.** Depo iki aydır canlıda (2026-07-27), yedeği ve saklama politikası kurulu. Sunucuda, Bunker OS'ta, n8n'de iş yok; yerel prova ortamı gerekmez. Değişen yalnız sitenin kayıt adaptörü ve env'dir.
- **(c) Sonradan değiştirmesi ucuz.** Hedef tek adaptör fonksiyonunun arkasında. Alan adı geçişinde v2, v1'in yerini alırken talepler aynı depoda kesintisiz kalır (Umami kararıyla aynı gerekçe). Yasal metin v1'deki "aynı sunucu, Almanya" beyanını korur.
- **Bedel, bilerek kabul:**
  - Talep Bunker panelinde görünmez; panel `lead.alpfitplus.com/_/` ve bildirim e-postasıdır.
  - Depo kodu `../Alpfitplus-website.v1/pocketbase/` altında, yani bu projenin dokunulmazında. Şema ya da hook değişikliği gerekirse o repoda iş olur ve kullanıcı kararı gerekir.
  - Şemada `segment`, `consent`, `ua`, `at` kolonu yok. Nereye düşeceği plan revizyonunda netleşir (öneri: `segment` mesajın başına etiket, gerisi e-postada).

**Milestone değişikliği:** Faz 1 milestone'undaki "gerçek demo talebi Bunker'da `alpfit` kiracısına kayıt olarak düşüyor, hiçbir satış otomasyonunu tetiklemiyor" ifadesi "v1'in lead deposunda (`lead.alpfitplus.com`, önizleme koleksiyonu) kayıt olarak düşüyor" olur. E-posta, Umami, başlıklar ve "v1 projesine dokunulmadı" aynen kalır. Depo kullanılır ama v1 reposu ve Vercel projesi değişmez. Cümle metni ve task zinciri (TASK-1.17 · 1.13 · 1.14 · 1.18 · 1.06 · 1.15) plan revizyonunda yeniden yazılır.

Bu kayıt 2026-09-13 "Lead hedefi (yeniden)" kararının hedef kısmını ve "Alıcı provası" kararının n8n + Postgres yerel ortamını geçersiz kılar. Sözleşme testinin nerede koşacağı plan revizyonunda netleşir: v1'in `pocketbase/` klasörünü salt okunur bağlayan yerel konteyner ya da canlı önizleme koleksiyonu. "E-posta kaynağı" kararı aynen geçerli.

**İlgili Task/Faz:** Faz 1 — TASK-1.11 kapanışı (`tasks/archive/TASK-1.11.md` → Oturum — 2026-09-14), plan revizyonu

---
