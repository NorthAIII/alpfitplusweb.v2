# B-056: Umami izleyicisi açıldığı gün — hidrasyonsuz gönderimde form verisi analitiğe gidiyor; ölçüm kriteri kayıt yazılmadan yeşil verebilir

**Önem:** 🟡 | **Tip:** hata / KVKK-iddia uyumu (latent) + test geçerliliği | **Alan:** M7 — F7.4 Analitik (`src/app/layout.tsx`) · M3 (`DemoForm.tsx`) · M1 (`legal.ts`)
**Kaynak:** audit-product (TASK-1.07 sonrası denetim) | **Tarih:** 2026-09-13
**Durum:** Açık — izleyici tarafı çözüldü (2026-09-21, TASK-1.07); kaynak tarafı (B-036 native GET) ve (b) ölçüm kriteri açık

## Gözlem

**Beklenen:**
- `QUALITY.md` → 2 Güvenlik: *"Kişisel veri (telefon, e-posta) modele veya analitiğe gitmiyor mu?"*
- `QUALITY.md` → 9 Ölçülebilirlik: *"Ölçüm KVKK ile uyumlu mu; yasal metin bunu anlatıyor mu?"*
- Yayındaki yasal metin:
  - `legal.ts:195`: *"Adınız, telefon numaranız, elektronik posta adresiniz ve forma yazdığınız mesaj ölçüme gönderilmez."*
  - `legal.ts:112`: *"Bu hizmete kişisel verileriniz aktarılmaz."*
- `ILKELER.md`: "Kanıtsız iddia yayınlanmaz".

**Bugün etkisiz, site kimliği girildiği gün canlı:** `NEXT_PUBLIC_UMAMI_WEBSITE_ID` hiçbir ortamda tanımlı değil; önizleme HTML'inde izleyici yok. Gelen Kutusu'ndaki `[TASK-1.07]` kullanıcı adımı tamamlandığı an aşağıdaki zincir kurulur.

### (a) Zincir — dört halka, her biri ayrı ölçüldü

İki bağımsız düzenekte ölçüldü, sahte veriyle; canlı Umami'ye hiçbir istek gitmedi, `/api/send` yakalanıp iptal edildi:
- sahte site kimliğiyle repo dışı yalıtılmış üretim derlemesi (3200),
- dev sunucusuna aynı öznitelik kümesiyle enjeksiyon.

1. **Native GET, kişisel veriyi URL'ye yazar.**
   - `DemoForm.tsx:103` `<form onSubmit={…} noValidate>` `method` ya da `action` taşımıyor.
   - JS çalışmadan gönderilen form şu adrese gider: `/demo?website=&name=…&club=…&phone=…&email=…&branches=…&segment=…&message=…&consent=on`.
   - Talep hiçbir yere yazılmaz. Sayfa hidrate olunca form boş, ne hata ne başarı mesajı var.
   - Bu [B-036](B-036-lead-kaybi-yollari.md) (2)'nin mekanizması; burada yeni olan analitik halkası.
2. **İzleyici sorguyu olduğu gibi gönderir.**
   - Varış sayfası JS ile yüklenirse sayfa görüntüleme olayının `url` alanı sorguyu taşır.
   - `layout.tsx:159-166` yalnız `data-website-id` ve `data-tag` veriyor.
   - Umami v3.1.0 izleyicisi sorguyu yalnız `data-exclude-search="true"` ile siliyor (`src/tracker/index.js:35,52-62`).
   - Next'in hidrasyondaki `replaceState` çağrısı sorguyu koruyor.
3. **Sonraki iç gezinmede ikinci kez gider.** Kullanıcı bir iç bağlantıya tıklarsa aynı sorgu `referrer` alanında yeniden gönderilir (`index.js:83-96`).
4. **Sunucu sorguyu saklar.**
   - v3.1.0 `src/app/api/send/route.ts:183,209-215` → `saveEvent` → `url_query` ve `referrer_query` sütunları, `VarChar(500)`. Panelde "query" görünümü var.
   - Kaynak: v3.1.0 etiketi, commit `c78ff36d`. Canlı veritabanı gözlenmedi.
   - Canlı kurulumun sürümü: TASK-1.07 kaydı 3.1.0 diyor. Sunulan `script.js` `last-modified` 2026-04-16 23:44 GMT; v3.1.0 yayını 23:42 GMT.

**Kontrol grubu:** aynı enjeksiyon `data-exclude-search="true"` ile yapılınca sorgu hem `url`'den hem sonraki `referrer`'dan siliniyor.

**Olasılık (kalibre):**
- **Hızlı gönderim yarışı gerçekçi değil.**
  - Yavaş 4G + 4x CPU'da (önizleme, soğuk yükleme) formun görünür olduğu an ile React kökünün bağlandığı an arası ~0,71–0,82 sn. Yeniden ziyarette 74–144 ms.
  - Kök bağlandıktan sonraki gönderimi React yakalıyor: FCP+657 ms'den sonra 3/3 POST.
  - Elle doldurma bu pencereye sığmaz.
- **Gerçekçi tetikleyici: JS ilk yüklemede hiç çalışmaz, ikinci yüklemede çalışır.**
  - Ölçülen senaryo: ilk yüklemede 8 parçanın hepsi düştü, form hidrate olmadı, kullanıcı acele etmeden doldurup gönderdi, ikinci yükleme sağlam ağla yapıldı. Sızdı.
  - Aday ama **ölçülmedi:**
    - çok yavaş cihaz;
    - dağıtım kayması: her `main` push'u üretim dağıtımı üretiyor ve dağıtım anında açık sekmedeki eski HTML parçalarını bulamayabilir.
- **JS kalıcı olarak kapalıysa** izleyici de yüklenmez. Analitik sızıntısı olmaz; yalnız B-036'nın tarayıcı geçmişi ve sunucu günlüğü izi kalır.
- **Sonuç:** olasılık düşük, gerçekleşirse sonuç kesin. Kişisel veri analitik veritabanında kalıcı olur ve yayındaki iki yasal cümle yanlışlanır.

### (b) TASK-1.07'nin tarayıcı ölçüm kriteri kayıt yazılmadan yeşil verebilir

- **Kriterler:**
  - `TASK-1.07.md:107`: *"sayfa görüntüleme isteği gidiyor ve 2xx dönüyor"*
  - `:169`: *"araştırma konteynerinde tarayıcı ölçümü: `/api/send` **2xx** ve yükte `tag: "local"`"*
- **Neden sahte yeşil:**
  - Araştırma konteynerinin varsayılan UA'sı `HeadlessChrome/153…`.
  - Umami v3.1.0 `route.ts:131-133`: `if (!process.env.DISABLE_BOT_CHECK && isbot(userAgent)) return json({ beep: 'boop' })`. Yanıt **200**, kayıt yazılmıyor (`saveEvent`'e varılmıyor).
  - isbot 5.1.37 deseni `headless`'la eşleşiyor. Ölçüm: `isbot=true, eslesen "Headless"`; UA'da `HeadlessChrome` → `Chrome` değişince `false`.
- **Neden fark edilmedi:** Site kontrolü bot kontrolünden önce geliyor. Bu yüzden TASK-1.07'nin sahte kimlikle aldığı 400 (`:181`) bunu göstermedi.
- **Sınırı:** `:110` UAT panel kriteri kayıt yoksa kırmızı verir. Ama `:107`/`:169` kapanışta harfiyen okunursa sahte yeşil üretir.
- **Ölçülemeyen:** Canlı sunucuda `DISABLE_BOT_CHECK` tanımlı mı, bilinmiyor. Tanımlıysa bu kalem o sunucu için geçersiz.

**Bilinçli-tercih süzgeci:**
- `data-domains`'in yokluğu bilinçli (`layout.tsx` yorumu), bu bulguyla ilgisi yok.
- `data-exclude-search` hakkında karar yok: TASK-1.07 kaydında sorgu dizesi ya da bot kontrolünden söz edilmiyor (grep: 0).
- Projede UTM/kampanya bağlantısı planı yok (DECISIONS, M7, PHASE-1, TASK-1.08/1.09 grep: 0). Yani `data-exclude-search` bugün hiçbir ölçümü kaybettirmiyor.

## Kanıt

```
# (a) yakalanan /api/send gövdeleri — yalıtılmış üretim derlemesi, sahte site kimliği, hidrasyonsuz gönderim
{"type":"event","payload":{"website":"00000000-0000-4000-8000-000000000000","screen":"390x844","language":"tr-TR","title":"Demo İste · Alpfit Plus","hostname":"localhost","url":"http://localhost:3200/demo?website=&name=Test+Kisi&club=Deneme+Studyo&phone=05550000000&email=test%40example.com&branches=1&segment=&message=gizli+mesaj+metni&consent=on","referrer":"","tag":"preview"}}
{"type":"event","payload":{"website":"00000000-0000-4000-8000-000000000000","screen":"390x844","language":"tr-TR","title":"Fiyat · Alpfit Plus","hostname":"localhost","url":"http://localhost:3200/fiyat","referrer":"http://localhost:3200/demo?website=&name=Test+Kisi&club=Deneme+Studyo&phone=05550000000&email=test%40example.com&branches=1&segment=&message=gizli+mesaj+metni&consent=on","tag":"preview"}}

# kontrol grubu — data-exclude-search="true" (dev, bağımsız düzenek)
{"type":"event","payload":{…,"title":"Demo İste · Alpfit Plus","hostname":"localhost","url":"http://localhost:3000/demo","referrer":"","tag":"preview"}}
{"type":"event","payload":{…,"title":"Fiyat · Alpfit Plus","hostname":"localhost","url":"http://localhost:3000/fiyat","referrer":"http://localhost:3000/demo","tag":"preview"}}

# (b) isbot sınaması
{"senaryo":"arastirma-konteyneri (Playwright chromium 153 varsayilan UA)","isbot":true,"eslesen":"Headless"}
{"senaryo":"ayni UA, HeadlessChrome -> Chrome (kontrol)","isbot":false}
```

**Yeniden üretme (canlıya istek atmadan):**
1. Araştırma konteynerinde Chromium'u `--host-resolver-rules=MAP umami.kiwiailab.com ~NOTFOUND` ile başlat. `script.js`'i önceden indirilmiş yerel kopyadan `page.route` ile ver, `**/api/send**` isteklerini yakalayıp `abort` et.
2. `/demo?name=Test+Kisi&phone=05550000000` adresini aç ve `<script src=".../script.js" data-website-id="00000000-…" data-tag="preview">` etiketini enjekte et.
3. Yakalanan gövdeyi oku.
4. `data-exclude-search="true"` ekleyip tekrarla.

Denetim betikleri repo dışında, oturum scratchpad'inde kaldı.

## Kök Neden Yönü

İki ayrı varsayılan birleşince sızıntı doğuyor, ikisi tek başına zararsız görünüyor:
- izleyicinin "URL'yi olduğu gibi say" varsayılanı,
- formun native yolunun kişisel veriyi URL'ye yazması (B-036).

Yasal metin (TASK-1.10) izleyicinin **tasarlanan** davranışını anlatıyor, arıza yolunu değil.

## Koruma Önerisi

- **Site kimliği girilmeden önce** izleyici etiketine `data-exclude-search="true"` eklenmeli.
  - Tek öznitelik; etkisi ölçüldü, sorgu iki alandan da siliniyor. Bugün UTM planı olmadığı için ölçülebilirlik kaybı yok.
  - İleride UTM gerekirse `data-before-send` kancasıyla yalnız formun alan adları (`website, name, club, phone, email, branches, segment, message, consent`) ayıklanabilir. Bu yol ölçülmedi.
- **Kaynakta:** formun native GET yolu kapatılmalı ([B-036](B-036-lead-kaybi-yollari.md) (2) koruma önerisi). Böylece tarayıcı geçmişi ve sunucu/Vercel günlüğü izleri de kapanır.
- **TASK-1.07 ölçüm kriteri:**
  - `/api/send` yanıt gövdesi `{"beep":"boop"}` olmamalı, ya da tarayıcıya bot olmayan bir UA verilmeli.
  - Asıl kanıt panelde kaydın görünmesi (`:110`).
- **Kalıcı koruma:** site kimliği tanımlı bir derlemede `/demo?name=…&phone=…` ile açılan sayfanın `/api/send` gövdesinde `name=`, `phone=`, `email=` geçmediğini sınayan tarayıcı testi (yakala + iptal et, canlıya istek yok). F6.2 tek komutuna aday.

## Çözüm Kaydı

**2026-09-21 (TASK-1.07) — izleyici tarafı kapandı, bulgu açık kalıyor.**

- `src/app/layout.tsx` izleyici etiketine `data-exclude-search="true"` eklendi; gerekçe dosyanın kendi yorumunda (hangi zincir, hangi yasal cümle, UTM alternatifi).
- Ölçüm: yalıtılmış üretim derlemesi (repo kopyası, scratchpad, 3200; `VERCEL_ENV=production` + `…vercel.app` ara hâli) → `/` ve `/demo` RSC yükünde `data-exclude-search":"true"` ve `data-tag":"preview"`, `data-domains` 0. Kontrol grubu: env tanımsız dev sunucusu (3000) → HTML'de `umami` 0. Canlı `script.js` (200, 4595 bayt) gövdesinde `exclude-search` geçiyor, yani sunulan sürüm özniteliği hâlâ okuyor.
- **Kimlikten önce yapıldı:** `NEXT_PUBLIC_UMAMI_WEBSITE_ID` hâlâ hiçbir ortamda tanımlı değil, yani zincir hiç kurulmadan kesildi.

**Açık kalan iki ayak:**
1. **Kaynak tarafı** — formun native GET yolu hâlâ kişisel veriyi adrese yazıyor ([B-036](B-036-lead-kaybi-yollari.md) (2)). Tarayıcı geçmişi ve sunucu/Vercel günlüğü izleri bu bulguyla kapanmadı.
2. **(b) ölçüm kriteri** — bot kontrolünün sahte yeşili. Not TASK-1.07'nin 2026-09-21 kaydı → Sonraki Adım Detayı md. 4'e işlendi; kapanış turu orada uyarılıyor.

---

**Yeniden ölçüm (audit-product 2026-09-22) — "bugün etkisiz" gerekçesi DÜŞTÜ, zincir canlı.**

`NEXT_PUBLIC_UMAMI_WEBSITE_ID` artık **önizlemede tanımlı** (`640b05f1-…`, halka açık HTML'de servis ediliyor — sır değil) ve izleyici gerçekten yükleniyor. Bulgunun *"hiçbir ortamda tanımlı değil, bugün etkisiz"* çerçevesi geçersiz.

**(a) izleyici tarafı — KAPANDI, canlı yüzeyde doğrulandı.** Servis edilen etiket:
`script src=https://umami.kiwiailab.com/script.js data-website-id=640b05f1-… data-tag="preview" data-exclude-search="true"`
Kanıt: `/demo?name=Test+Kisi&phone=05550000000&email=…&message=gizli+mesaj+metni` ile açıldığında gönderilen olay yükündeki `url` alanı **`https://alpfitplus-web-v2.vercel.app/demo`** — sorgu tamamen silinmiş. Kişisel veri yok. (İstek abort edildi, sunucuya ulaşmadı.)
Ek betik yok: sayfadaki tek harici betik `script.js` (4.595 bayt); içinde `rrweb`/`replay`/`record*`/`MediaRecorder`/dinamik `createElement('script')` **0 eşleşme**, tek uç `/api/send`.

**Açık kalan iki ayak:**
- **(1) kaynak tarafı** — JS'siz native GET gönderimi kişisel veriyi URL'ye yazıyor ([B-036](B-036-lead-kaybi-yollari.md) (2)). `data-exclude-search` yalnız **Umami'yi** korur; tarayıcı geçmişini ve sunucu istek logunu korumaz. Bu ayak artık **canlı bir zincirin üstünde** duruyor.
- **(b) bot-kontrolü sahte yeşili** — `DISABLE_BOT_CHECK` canlıda tanımlı mı, bu turda **bilinçli olarak ölçülmedi**: ölçmek `/api/send`'e gerçek bir isteğin varması demekti ve bot kontrolü kapalıysa bu bir kayıt yazardı (canlı analitiği kirletme sınırı).
