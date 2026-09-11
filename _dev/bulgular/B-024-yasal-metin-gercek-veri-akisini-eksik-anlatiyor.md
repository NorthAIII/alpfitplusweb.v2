# B-024: Yasal metinler gerçek veri akışını eksik anlatıyor — IP, yurt dışı aktarım ve onay kapsamı

**Önem:** 🟡 | **Tip:** tutarsızlık / uyum | **Alan:** M1 — İçerik (`src/content/legal.ts`) / M3 — Lead hattı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

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
