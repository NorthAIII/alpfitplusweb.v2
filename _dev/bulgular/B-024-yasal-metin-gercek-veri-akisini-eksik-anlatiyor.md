# B-024: Yasal metinler gerçek veri akışını eksik anlatıyor — IP, yurt dışı aktarım ve onay kapsamı

**Önem:** 🔴 | **Tip:** tutarsızlık / uyum | **Alan:** M1 — İçerik (`src/content/legal.ts`) / M3 — Lead hattı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** → Faz 2

## Gözlem

**Beklenen:** `src/content/legal.ts` dosya başlığının kendi beyanı: *"metinler sitenin GERÇEK veri akışını anlatır."* Açık bulgu [B-008](B-008-yasal-metin-hukukcu-onayi.md) bu metinlerin hukukçu onayını beklediğini kaydediyor ve koruma önerisinde şunu söylüyor: *"Lead hedefi ve analitik kararları verildiğinde `legal.ts` veri akışı bölümü **aynı task'ta** güncellenir."* Lead hedefi karara bağlandı (Google Apps Script → E-Tablo), metin güncellenmedi.

**Gözlenen:** Dört yerde metin ile gerçek akış ayrışıyor.

**1. IP adresi işleniyor, hiçbir metinde geçmiyor.** Uç, ziyaretçinin IP'sini okuyup on dakikalık pencerede bellekte tutuyor (hız sınırı için). KVKK aydınlatma metni işlenen verileri sayarken yalnız *"talebin gönderildiği tarih ve saat ile tarayıcı bilgisi"* diyor; IP yok.

**2. Aktarım maddesi gerçek hedefi kapsamıyor.** Madde yalnız *"barındırma ve elektronik posta gönderimi hizmeti aldığımız tedarikçiler"* diyor. Gerçek **birincil** hedef bir Google Apps Script web app'i üzerinden Google E-Tablo — ne barındırma ne e-posta. Üstelik hem Google hem Resend yurt dışı; metinde **yurt dışına aktarım** hiç geçmiyor, oysa aynı belge ziyaretçiye *"yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme"* hakkını sayıyor.

**3. İki metin birbiriyle tutarsız.** KVKK metni tarih/saat ve tarayıcı bilgisini sayıyor, Gizlilik Politikası'nın topladığı-veri listesi saymıyor (yalnız ad, telefon/e-posta, kulüp/şube/tip, mesaj). Uç ikisini de kaydediyor (`route.ts:214`, `:216` → `at`, `ua`).

**4. Form onayı işlenen veriden dar.** Onay metni *"**İletişim bilgilerimin** demo talebimle ilgili olarak işlenmesine…"* diyor. Form ayrıca kulüp adı, şube sayısı, kulüp tipi ve serbest metin topluyor; uç ayrıca tarayıcı bilgisini saklıyor.

Dördü de "yanlış beyan" sınıfında — biri fazlasını söylüyor, üçü eksiğini. Bu metinler ziyaretçiye verilen hukuki taahhütler ve hukukçu onayına bu hâlleriyle gidecek.

Bu bulgunun kardeşi [B-018](B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md): orada da yasal metin ("gerçek bir kişinin verisi gösterilmemektedir") gerçeklikle çelişiyor. İkisi birlikte aynı deseni gösteriyor — **yasal metin, ürün değiştikçe güncellenen bir doküman olarak ele alınmıyor.**

## Kanıt

```
$ grep -n "x-forwarded-for\|x-real-ip" src/app/api/demo/route.ts
181-184:  const ip = ... "x-forwarded-for" ... "x-real-ip" ...
186:      if (limited(ip))          → HITS Map, WINDOW_MS = 10*60*1000 (:46-56)

$ sed -n '58,64p' src/content/legal.ts       # KVKK "İşlenen kişisel veriler"
   → "İşlem güvenliği verisi: talebin gönderildiği tarih ve saat ile tarayıcı bilgisi"
   → IP yok

$ sed -n '98,101p' src/content/legal.ts      # KVKK "Aktarım"
   → "barındırma ve elektronik posta gönderimi hizmeti aldığımız tedarikçiler"
   → Google E-Tablo yok, yurt dışı yok

$ sed -n '123p' src/content/legal.ts         # aynı belgenin hak listesi
   → "yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme"

$ sed -n '156,163p' src/content/legal.ts     # Gizlilik "topladığımız veriler"
   → tarih/saat ve tarayıcı bilgisi YOK (KVKK'da var)

$ sed -n '149,150p' src/components/sections/DemoForm.tsx
   → "İletişim bilgilerimin demo talebimle ilgili olarak işlenmesine…"
```
Gerçek akış: `route.ts:75-128` (`toWebhook` → `LEAD_WEBHOOK_URL`), `research/lead-sheet.gs:1-5` (*"POST ettiği JSON lead'i bağlı e-tabloya bir satır olarak yazar"*), `route.ts:148` (`api.resend.com`).

**Doğru olan kısım kaydedilir:** form alanları ile KVKK'nın saydığı veri kategorileri **birebir örtüşüyor** (ad, telefon, e-posta, kulüp, şube sayısı, kulüp tipi, mesaj, onay). Çerez iddiası da bugün doğru — `localStorage`, `sessionStorage`, `document.cookie` ve `cookies()` için tarama yapıldı, `src/` içinde vuruş yok. Metinler baştan savma yazılmamış; eksikler ürünün metinden **sonra** değişen kısımlarında.

## Kök Neden Yönü

Metinler yazıldığında lead hedefi henüz seçilmemişti ve hız sınırı sonradan eklendi. Yasal metni ürüne bağlayan bir kontrol noktası yok: bir env değişkeni, bir hedef ya da bir başlık eklendiğinde `legal.ts`'in güncellenmesi gerektiğini hatırlatan hiçbir şey bulunmuyor.

## Koruma Önerisi

- Dört kalem tek düzenlemede kapanır: KVKK'ya IP ve hız sınırı amacı eklenir; Aktarım maddesi Google (E-Tablo) ve e-posta sağlayıcısını **yurt dışı aktarım** olarak adlandırır; Gizlilik listesi KVKK ile hizalanır; onay metni toplanan tüm veri kategorilerini kapsayacak şekilde genişletilir.
- Zamanlaması bellidir ve yakındır: TASK-1.10 (Aktarım ve Çerezler maddeleri) zaten planlanmış durumda. Bu bulgu o task'ın kapsamına **doğrudan** giriyor; task yazılırken kabul kriterleri buradan beslenebilir.
- Kalıcı koruma: lead hattına yeni bir hedef, yeni bir alan ya da yeni bir sağlayıcı eklendiğinde `legal.ts`'in gözden geçirilmesi bir kontrol maddesi hâline gelir. En doğal evi task tamamlama sırası değil, M3'ün kendi kabul kriterleridir — "yeni hedef → yasal metin güncellendi" bir feature kriteri olarak yazılabilir.
- [B-008](B-008-yasal-metin-hukukcu-onayi.md) hukukçuya gönderim bekliyor; bu düzeltme **gönderimden önce** yapılmalı, aksi halde onay eksik bir metne verilir.

## Çözüm Kaydı

**Kısmen kapandı — TASK-1.10, 2026-09-11.** Task'ın planlanmış kapsamı iki maddeydi (Aktarım ve Çerezler), bu bulgu dört madde istiyor; task planı bu bulgudan **önce** yazıldı. Kapananlar ve kalanlar:

- **2. madde — yarı kapandı.** KVKK Aktarım maddesi artık kayıt tutma tedarikçisini (Google, elektronik tablo) ve ölçüm sağlayıcısını (Umami) adıyla sayıyor; Gizlilik'e de aynı akışı anlatan bir paragraf girdi. **Yurt dışına aktarım hâlâ hiçbir metinde geçmiyor** — aynı belge bu hakkı saymaya devam ediyor. Adlandırma bilinçle yapılmadı: hangi sağlayıcının verisini hangi ülkede işlediğinin beyanı ve aktarımın hukuki dayanağı hukukçu kararıdır (v1'in metni bu ayrımı açıkça yapıyor), bu oturum uydurmadı.
- **1. madde — açık.** IP ve hız sınırı amacı KVKK'nın işlenen-veri listesine girmedi.
- **3. madde — kısmen.** Gizlilik'e aktarım paragrafı eklendi, ama topladığı-veri listesi hâlâ tarih/saat ve tarayıcı bilgisini saymıyor; KVKK ile ayrışma sürüyor.
- **4. madde — açık.** Form onay metni (`DemoForm.tsx`) genişletilmedi.

Bulgu **açık kalır**. Üç kalem tek düzenlemede kapanacak boyutta ve aynı dosyaya dokunuyor; doğal evi ya bir düzeltme task'ı ya da [B-008](B-008-yasal-metin-hukukcu-onayi.md) gönderiminden önceki son geçiştir.

**Hedef anlatımı bayatladı — TASK-1.15, 2026-09-22.** Yukarıdaki Gözlem ve Kanıt bölümleri kayıt hedefini "Google Apps Script → Google E-Tablo" diye anlatıyor. O hedef 2026-09-14'te düştü (`docs/DECISIONS.md` → *Lead hedefi (yeniden, 2)*): kayıt artık kendi sunucumuzdaki PocketBase deposuna gidiyor ve `legal.ts` bu oturumda o gerçeğe hizalandı — Google adı veri akışı bağlamında metinde **kalmadı**, Aktarım/Saklama maddeleri konumu (Almanya, Nürnberg), erişimi (yalnız yetkili yönetici hesabı) ve saklama süresini (12 ay, günlük temizlik işi) yazıyor. Bulgunun **kalemleri değişmedi**, yalnız 2. maddenin yarısı olan yurt dışı kaleminin zemini değişti: metin artık ülkeyi **olgu olarak** söylüyor ama aktarımın hukuki dayanağını hâlâ kurmuyor — o kalem hukukçunundur ve açık kalır.

Bugün açık olan kalemler: **1** (IP ve hız sınırı amacı KVKK listesinde yok — ayrıca kayda giren `ip_hash` de anılmıyor), **2'nin yurt dışı yarısı** (dayanak yok), **3** (Gizlilik'in topladığı-veri listesi KVKK ile ayrışık; üstelik KVKK'nın saydığı "tarayıcı bilgisi" artık hiçbir kalıcı kayda girmiyor — `route.ts` `ua`'yı depo gövdesine ve e-posta metnine koymuyor, yani liste bu kalemde *fazlasını* söylüyor), **4** (form onay metninin kapsamı).

**Yeniden ölçüm (audit-product 2026-09-22) — dört kalem de açık; 1. kalem 🔴'ye yükseltti.**

Bugünkü `legal.ts` kalem kalem okundu (315 satır):

- **(1) IP / `ip_hash` — AÇIK ve ağırlaştı.** KVKK'nın işlenen-veri listesi (`legal.ts:59-63`) hâlâ IP'yi saymıyor. Ama artık yalnız bellekte on dakika tutulan bir değer değil: `route.ts:128` `ip_hash: hashIp(ip, salt)` **depo gövdesine yazılıyor** ve kayıt **12 ay** saklanıyor — kodun kendi yorumu bunu söylüyor (`route.ts:71-74`). IP'den türetilmiş kalıcı bir tanımlayıcı, metinde hiç anılmadan bir yıl saklanıyor.
- **Ters yön de kırık:** `legal.ts:63` "tarayıcı bilgisi"ni işlenen veri sayıyor, ama `route.ts:118` yorumu *"env/ua/consent/at gövdeye GİRMEZ"* diyor ve e-posta gövdesi de `ua` taşımıyor (`route.ts:215-228`). `ua` yalnız `LEAD_FILE_PATH` yolunda kalıcılaşıyor, o da yayında tanımlı değil. Liste bu kalemde *fazlasını* söylüyor.
- **(2) Yurt dışı — yarısı açık.** TASK-1.15 ülkeyi **olgu** olarak yazdı (`legal.ts:100`: *"Sunucu bize aittir ve Almanya'da (Nürnberg) bir veri merkezinde durur"*). Ama hukuki sebep bölümü (`legal.ts:91`) yalnız KVKK m.5/2(c) ve (f) + açık rızaya dayanıyor; **yurt dışına aktarımın kendi dayanağı (m.9) hiç anılmıyor** ve tedarikçi listesi (`legal.ts:104-112`) hiçbirinin ülkesini söylemiyor — oysa e-posta sağlayıcısı bir aktarım hedefidir (v1'in ölçümü: `../Alpfitplus-website.v1/_dev/memory/bunker-ortami.md:99-104` → Resend müşteri verisini **ABD'de** saklıyor, İrlanda yalnız gönderim bölgesi). `legal.ts:147` ziyaretçiye hâlâ *"aktarıldığı üçüncü kişileri bilme"* hakkını sayıyor.
- **(3) İki metnin listesi — AÇIK.** TASK-1.15 Gizlilik'e bir *aktarım* paragrafı ekledi (`legal.ts:216`) ama **topladığı-veri listesine** (`legal.ts:182-185`) dokunmadı; "işlem güvenliği verisi" satırı orada hâlâ yok.
- **(4) Onay kapsamı — AÇIK, hiç dokunulmamış.** `DemoForm.tsx:211-212` hâlâ yalnız *"İletişim bilgilerimin…"* diyor; uç ayrıca `club`, `branches`, `segment`, `message`, `at`, `env`, `ua` ve `ip_hash` işliyor (`route.ts:265-275`).

**🔴 gerekçesi — "IP saklamaz" beyanının altındaki olgu ölçülmüş ve olumsuz.** Kanvasın Gelen Kutusu'ndaki `[TASK-1.07]` satırı bunu *"ölçülmedi, sunucu erişimi gerekiyor"* diye taşıyordu. **Ölçüm mevcut ve komşu repoda duruyor:** `../Alpfitplus-website.v1/_dev/memory/bunker-ortami.md:84-93` (2026-07-28) — `bunker-nginx` erişim kaydı `/dev/stdout` → Docker `json-file`, `/etc/docker/daemon.json` **yok**, yani rotasyon yok ve log sınırsız büyüyor (o tarihte 188 MB); içinde **her isteğin ham IP'si ve user-agent'ı** duruyor. Site izleyici betiğini `umami.kiwiailab.com`'dan çektiği için **her ziyaretçinin IP'si bu loga düşüyor**; Umami veritabanında IP sütunu olmaması bunu değiştirmiyor. Kaydın kendi cümlesi: *"Yasal metinde 'IP saklanmaz' cümlesi bu yüzden olduğu gibi yazılamaz; süre de yazılamaz, çünkü bugün sınırlı değil."*

Bugünkü metin bu belirsizliği kaldıracak kadar dar **değil**: `legal.ts:199` *"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"* — "bu ölçüm" ziyaretçi için ölçüm sisteminin tamamıdır ve nginx onun ön kapısıdır; `legal.ts:116` daha da ileri gidiyor: *"bu ölçüme kişisel verileriniz aktarılmaz"* (ham IP KVKK'da kişisel veridir). Ayrıca `legal.ts:68` *"Formu doldurmadan siteyi yalnızca gezdiğinizde, sizden kimlik veya iletişim verisi toplanmaz"* diyor — sadece gezen ziyaretçinin IP'si de o loga düşüyor.

**Ölçülemeyen (tahmin edilmedi):** nginx logunun **bugünkü** hâli — 2026-07-28'den bu yana `daemon.json` eklenmiş olabilir; ve Resend'in güncel veri konumu beyanı. Sunucu erişimi gerekiyor.

**Koruma kalemi ayrı eve taşındı:** metnin dayandığı olguları bağlayan bir test yok → [B-060](B-060-yasal-beyani-koruyan-kapi-yok.md).
