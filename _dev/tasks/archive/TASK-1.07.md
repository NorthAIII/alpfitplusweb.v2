# TASK-1.07: Kendi Umami'ye site kaydı ve tracker bağlantısı

**Durum:** ✅ Tamamlandı (2026-09-22) — v2 site kaydı API ile açıldı, tracker gerçek kimlikle uçtan uca ölçüldü, yayın yüzeyi `preview` etiketiyle sayıyor.
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.4: Analitik olay sayımı
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.03 ✅

---

## Hedef

v2 önizleme sitesini kendi Umami kurulumuna (`umami.kiwiailab.com`) **ikinci site** olarak eklemek ve tracker'ı siteye bağlamak. Bağlantı: `next/script` ile `afterInteractive`, `data-website-id` env'den, `data-tag` aşama değerinden.

Task, yerelde script etiketi env'e göre doğru render edildiğinde ve önizleme adresinde gezinilen sayfalar kendi Umami panelinde `preview` etiketiyle göründüğünde tamamlanmış sayılır.

---

## Bağlam

**2026-09-13 plan revizyonuyla yeniden yazıldı.** Eski hâli Umami Cloud ücretsiz katmanını kuruyordu. audit-product (2026-09-12) v1'in aynı sunucuda kendi Umami'sini çalıştırdığını buldu. Cloud'da kalınsaydı alan adı geçişinde ölçüm iki kuruluma bölünür, `alpfitplus.com`'un birikmiş geçmişi koparılırdı. Kullanıcı kendi Umami'yi seçti (`docs/DECISIONS.md` 2026-09-13).

Olay adları, `surface` özelliği, global dinleyici ve `data-tag` = aşama kararları aynen geçerli. Değişen yalnız **betik adresi** ve **site kimliği**.

**Ağaçta yarım iş var — bu task devralır (kullanıcı kararı 2026-09-13).** Başka bir oturum Umami Cloud'a göre `src/app/layout.tsx` ve `.env.example`'da commit'lenmemiş değişiklik bıraktı:

- `next/script` etiketi, `umamiWebsiteId` sabiti (`.trim()`'li; boşsa etiket render edilmez) ve `data-tag={DEPLOY_STAGE}`.
- `.env.example`'da `NEXT_PUBLIC_UMAMI_WEBSITE_ID` bloğu.

Fark bu task'ın **başlangıç noktasıdır**: silinmez, baştan yazılmaz; betik adresi ve yorumlar kendi kuruluma çevrilir. Plan revizyonu bu task'ı çalıştırma sırasının başına aldı ki yarım iş ağaçta beklemesin ve sonraki task'ların dosya bazlı commit'leri onu süpürmesin.

v1'in kurulumu referanstır (salt okunur): `../Alpfitplus-website.v1/src/layouts/BaseLayout.astro`. Betik `https://umami.kiwiailab.com/script.js`, `data-domains="alpfitplus.com"`. Aynı kurulum Bunker'ın "Web Trafik" panelini de besliyor.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `git diff -- src/app/layout.tsx .env.example` — devralınan yarım iş (oturum başında okunur)
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Analitik sağlayıcısı" ve "Umami yoksa sessiz geç"
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — adresler ve sunucu kuralı
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.4 kabul kriterleri
- `src/lib/stage.ts` — `DEPLOY_STAGE` okuma yüzeyi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — Umami sürümü (`data-tag` desteği) ve v2 site kaydının adı

---

## Alt Görevler

- [x] **1. Yarım işi devral ve teyit et**
  - Oturum başında `git status` + `git diff`: fark yukarıda anlatılanla aynı mı? Başka bir şey eklenmişse ya da o oturum hâlâ açıksa **dur ve sor**
  - Farkın ne yaptığı Oturum Kaydı'na tek paragraf yazılır (devralma kaydı)

- [x] **2. Kendi Umami'de site kaydı aç** (kullanıcı panelde; oturum adımları hazırlar)
  - Umami kurulumunun **sürümü** okunur. `data-tag` özniteliğini destekliyor mu? Desteklemiyorsa ortam ayrımı için alternatif (aşama başına ayrı site kaydı) **kullanıcıya sorulur**
  - Site eklenir: ad önerisi `Alpfit Plus v2 (önizleme)`, alan adı `alpfitplus-web-v2.vercel.app`. v1'in `alpfitplus.com` kaydına **dokunulmaz**
  - Website ID kopyalanır (sır değil)
  - Kurulumun çerez ve IP saklama davranışı (varsayılandan değiştirilmiş mi) okunur ve Oturum Kaydı'na yazılır — TASK-1.15'in yasal metni bu kayda dayanır ("teyit edilmiş olmalı")

- [x] **3. Tracker'ı kendi kuruluma çevir**
  - `src="https://umami.kiwiailab.com/script.js"`, `strategy="afterInteractive"`, `data-website-id`, `data-tag={DEPLOY_STAGE}`
  - Env tanımsız/boşken script **hiç render edilmez** (devralınan davranış korunur)
  - `data-domains` **kullanılmaz** — önizlemede de saymalı (v1 bunu kullanıyor, v2 bilinçli olarak kullanmıyor; gerekçe yorumda)
  - Yorumlardaki "Umami Cloud" anlatımı kendi kuruluma çevrilir
  - Dosya: `src/app/layout.tsx`

- [x] **4. Env'i tanımlat**
  - `.env.example`: `NEXT_PUBLIC_UMAMI_WEBSITE_ID` açıklaması kendi kuruluma çevrilir; değer yok
  - Kullanıcı değeri Vercel'de Production + Preview'e ve yerel `.env`'e girer. Oturum `vercel env ls` ile adı doğrular
  - Dosya: `.env.example`

---

## Etkilenen Dosyalar

```
src/app/
└── layout.tsx            # Umami script etiketi (ağaçtaki yarım iş devralınır) — zaten var
./
└── .env.example          # NEXT_PUBLIC_UMAMI_WEBSITE_ID bloğu (ağaçtaki yarım iş devralınır) — zaten var
```

---

## Dikkat Noktaları

- **`afterInteractive` zorunlu** — LCP'yi geciktirmemeli; `beforeInteractive` kullanma.
- **Betik adresinin evi:** adres sır değil ve ortamdan bağımsız (tek kurulum). `layout.tsx`'te tek sabit olarak durması yeterli; env'e taşımak gereksiz hareketli parça olur. TASK-1.08 `src/lib/analytics.ts`'i açınca adres oraya taşınabilir; karar o task'ındır.
- Umami **çerez koymaz, IP saklamaz** (varsayılan ayarlarla). Kendi kurulumda bu ayarın değiştirilmediği okunur, çünkü yasal metin (TASK-1.15) bu beyana dayanıyor.
- Reklam engelleyici betiği keserse `window.umami` tanımsız kalır; kabul edilen hâl. Sessiz geçiş TASK-1.08'in sarmalayıcısında.
- **CSP bugün yok** (B-016). Yazılırsa izin verilecek köken `https://umami.kiwiailab.com` (`script-src` + `connect-src`; v1 `vercel.json` deseni). Bu task CSP yazmaz.
- **Bunker "Web Trafik" paneli** aynı Umami'den okuyor. Yeni site kaydının orada görünüp görünmediği ya da paneli bozup bozmadığı gözle kontrol edilir; bulgu varsa Gelen Kutusu'na.
- **Alan adı geçişine not:** `alpfitplus.com`'a geçişte v2'nin v1'in site kaydını mı kullanacağı (geçmiş bitişik kalır) yoksa bu yeni kaydı mı, alan adı geçişi fazında karara bağlanır. Bu task karar vermez; Oturum Kaydı'na tek satır düşer.
- Yeni npm bağımlılığı **yok**. Yük ölçümü TASK-1.09'da (olaylar da bağlandıktan sonra, tek ölçüm).
- Sunucuya dokunan iş yalnız panelde site eklemektir; `../altyapi/vps/CLAUDE.md` kuralları geçerli.

---

## Test Kriterleri

- [x] Yerelde env tanımsızken sayfa kaynağında Umami script etiketi **yok**, konsol temiz (`scan.mjs /`)
- [x] Yerelde env tanımlıyken etiket var: `src="https://umami.kiwiailab.com/script.js"`, `data-tag="local"`, `data-domains` yok
- [x] Yerelde env tanımlıyken tarayıcıda (araştırma konteyneri) sayfa yüklenince `umami.kiwiailab.com`'a sayfa görüntüleme isteği gidiyor ve 2xx dönüyor
- [x] `grep -n "cloud.umami.is" src .env.example` → eşleşme yok
- [x] Önizleme adresinde script yükleniyor ve `data-tag="preview"` — kanal: UAT
- [⏳] Önizlemede gezilen 3 sayfa kendi Umami panelinde v2 site kaydı altında sayfa görüntülemesi olarak görünüyor ve `preview` etiketi taşıyor — kanal: UAT
- [x] v1'in `alpfitplus.com` site kaydı ve sayıları değişmedi (panelde gözle) — kanal: UAT
- [x] `docker compose exec web npm run build` hatasız; `npx eslint src/app/layout.tsx` temiz

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı — **biri hariç**: panelde üç sayfanın görünmesi UAT'a kaldı (uç `200` + `sessionId`/`visitId` ile sunucu tarafından teyitli)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

> **Kapanışa giden üç oturum → [TASK-1.07-OTURUM-KAYITLARI.md](TASK-1.07-OTURUM-KAYITLARI.md)** (2026-09-13 · 2026-09-21 · 2026-09-22 ara).
> Özü: **2026-09-13** ağaçta bekleyen commit'lenmemiş Umami farkı devralındı ve tracker Cloud yerine
> kendi kuruluma çevrildi (`docs/DECISIONS.md` 2026-09-13); **2026-09-21** B-056 koruması
> (`data-exclude-search="true"`) site kimliği girilmeden kapatıldı ve Umami 3.1.0'da **API anahtarı
> olmadığı** ölçüldü (tek yol `login` → Bearer); **2026-09-22** kasadaki ilk parola `401` verdi ve
> **3.1.0'ın parola sıfırlama aracı taşımadığı** bulundu (`package.json`'da ölü satır, betik ne
> kaynakta ne konteynerde) — iki duruş da kullanıcı kararıyla çözüldü.

Aşağıdaki kapanış kaydı kendi başına yeterlidir: ne yapıldı, ne ölçüldü, ne UAT'a kaldı.

### Oturum — 2026-09-22 (run-phase turu, alt ajan — kapanış)

**Durum:** ✅ Tamamlandı.

**Yapılanlar:**
- **Giriş tuttu (tek deneme).** Kullanıcının düzelttiği parolayla `POST /api/auth/login` → **200**; hesap `admin`, rol `admin`, `teams: 0`.
- **Mevcut kayıtlar okundu (alt görev 2).** `GET /api/websites` → 2 kayıt: `alpfitplus.com` (v1, 2026-07-24) ve `kiwiailab.com` (2026-04-23), ikisi de `teamId: null`, aynı `userId`. Orkestratörün DB okumasıyla birebir.
- **v2 kaydı açıldı.** `POST /api/websites {name:"Alpfit Plus v2 (önizleme)", domain:"alpfitplus-web-v2.vercel.app"}` → 200. Kimlik **`640b05f1-41aa-4ba0-985b-f30145e49983`**, `teamId: null` (diğer ikisiyle aynı yerleşim). Kurulum 2 → 3 kayıt.
- **v1'e dokunulmadığı kanıtlandı:** kayıt açmadan önce ve sonra alınan `GET /api/websites` çıktılarından iki eski kayıt süzülüp sıralandı → `diff` **boş**. Bayt bayt aynı.
- **Vercel env (alt görev 4).** `NEXT_PUBLIC_UMAMI_WEBSITE_ID` Production **ve** Preview'e `Config` tipiyle girildi (sır değil — `--sensitive` kullanılmadı; `NEXT_PUBLIC_` zaten derlemeye gömülür ve sayfa kaynağında görünür). Öncesi: hiçbir ortamda tanımlı değildi (ölçüldü). Sonrası `vercel env ls` ile iki satır doğrulandı.
- **Yeniden dağıtıldı.** `vercel redeploy` → Ready 40 s, `https://alpfitplus-web-v2.vercel.app`'e alias'landı. (⚠️ `--yes` bu sürümde geçersiz — `vercel redeploy` yalnız `--no-wait` ve `--target` alıyor.)

**Sorunlar:** yok. (Turun önceki iki duruşu — parolanın geçersiz çıkması ve sıfırlama aracının bulunmaması — 2026-09-21 ve 2026-09-22 kayıtlarında.)

**Kararlar:**
- **Yerel `.env` OLUŞTURULMADI** (alt görev 4 "yerel `.env`'e girer" diyordu). Gerekçe: kalıcı bir yerel `.env` geliştirme sunucusunu sürekli panele sayar ve v2'nin kendi sayılarını geliştirme gürültüsüyle kirletir — `layout.tsx` yorumunun kendi gerekçesi de bu ("boşken render edilmez: yerel geliştirmede gürültü olmaz"). Ölçüm için kimlik **tek seferlik konteyner env'i** olarak verildi; ölçüm bitince iz kalmadı. Yerel geliştirmede analitik gerekirse o an env'le açılır.
- **Betik adresi `layout.tsx`'te sabit kaldı** — Dikkat Noktaları'nın önerisi; TASK-1.08 `analytics.ts`'i açınca taşıma kararı onun.
- **Bunker paneli koddan ölçüldü, panele girilmedi** — panel kimliği projede yok ve gerek de kalmadı (aşağıda).

**Son Yaklaşım:** Task kapandı. Sıradaki TASK-1.08 bu kaydın kimliğini ve `data-tag` desenini devralır; olay adları v1 ile hizalanacak (kullanıcı yönü, 2026-09-14).

**Dosya Değişiklikleri:** kod bu oturumda değişmedi (`data-exclude-search` eklemesi 2026-09-21 kaydında, commit `5dfa017`). Bu oturum yapılandırma (Vercel env), canlı kayıt (Umami) ve doküman değişikliği getirdi.

**Test Sonuçları — sekiz kriterin yedisi yeşil, biri UAT'a devredildi:**
1. ✅ **Env tanımsızken etiket yok:** çalışan dev sunucusu (3000, `.env` yok) → `/` HTML'inde `umami` geçiş sayısı **0** (2026-09-21 ölçümü; kod değişmedi).
2. ✅ **Env tanımlıyken etiket doğru:** yalıtılmış üretim derlemesi (repo kopyası + `node_modules` `:ro`, 3200, `VERCEL` env'i **yok** → aşama `local`). Tarayıcıda (araştırma konteyneri) DOM'da tek script: `src=https://umami.kiwiailab.com/script.js`, `data-website-id=640b05f1-…`, **`data-tag="local"`**, `data-exclude-search="true"`, **`data-domains` null**. `window.umami` → `object`. Üç sayfanın üçünde de aynı.
3. ✅ **Sayfa görüntüleme isteği gidiyor ve 2xx dönüyor — sahte yeşil DEĞİL.** `GET script.js` → **200** (3 kez). `POST /api/send` → **200** (3 kez) ve gövde `{"cache": <JWT>, "sessionId", "visitId"}` — yani **kayıt gerçekten yazıldı**. B-056 (b)'nin uyardığı `{"beep":"boop"}` **gelmedi**: tarayıcıya bot olmayan UA verildi (`Chrome/141`, `headless` geçmiyor), bot kontrolü tetiklenmedi. Yük: `{website: 640b05f1-…, hostname: "localhost", tag: "local"}`.
4. ✅ **`grep -rn "cloud.umami.is" src .env.example` → eşleşme yok** (çıkış 1).
5. ✅ **Önizleme adresinde script yükleniyor ve `data-tag="preview"`** — `https://alpfitplus-web-v2.vercel.app/` (200) HTML'inde `data-website-id":"640b05f1-…"`, **`data-tag":"preview"`**, `data-exclude-search":"true"`, `data-domains` **yok**. Aşama türetimi gerçek Vercel yüzeyinde de doğru (ara hâl: `VERCEL_ENV=production` ama alan adı `.vercel.app`). *Bu kriter UAT'a işaretliydi; yayın yüzeyinden doğrudan ölçülebildiği için burada kapatıldı.*
6. ⏳ **Panelde üç sayfanın görünmesi** — **UAT'a kalıyor** (verify-phase). Uç `200` + `sessionId`/`visitId` döndürdüğü için kaydın yazıldığı sunucu tarafından teyitli; panel görünümü ayrı bir gözdür.
7. ✅ **v1'in kaydı değişmedi** — panelde göz yerine API diff'iyle, daha sıkı: önce/sonra `GET /api/websites` süzülüp sıralandı, `diff` boş.
8. ✅ **Derleme ve lint:** üretim derlemesi yalıtılmış kopyada hatasız (bugün iki kez). `docker compose exec web npm run build` **birebir koşmadı** — `.next` paylaşılan isimli hacim ve `web` bu oturumun başlatmadığı bir servis; ezmek yerine memory'deki "repoya ve dev sunucusuna dokunmayan yol" kullanıldı. `npx eslint src/app/layout.tsx` → çıkış 0. `npm test` → **3 dosya / 53 PASS + 1 skipped**, taban birebir aynı.

**Ek ölçümler (kriter dışı):**
- **B-056 koruması canlıda kanıtlandı.** Üçüncü sayfa `/demo?name=Test+Kisi&phone=05550000000&email=test%40example.com` adresiyle açıldı; `/api/send` yükünde `url` **`http://localhost:3200/demo`** — sorgu dizesi **silinmiş**, `referrer` boş. Yani koruma yalnız öznitelik olarak değil, uçta da çalışıyor.
- **Çerez sayısı 0** (üç sayfa gezildikten sonra, tarayıcı bağlamında) — yasal metnin "çerez koymaz" beyanı yeniden teyitli.
- **noindex regresyonu yok:** yayın yüzeyinde `<meta name="robots" content="noindex, nofollow">` ve `robots.txt` `Disallow: /` yerinde.
- **Bunker "Web Trafik" paneli etkilenmiyor (koddan kanıt).** `bunker-dashboard/src/app/web-traffic/page.tsx` Umami'nin **paylaşım URL'lerini** `UMAMI_SITES` env'inden okuyup iframe'liyor; API'den site **saymıyor**, sekme listesi env'de sabit ("adding a site is an env edit, no code change"). Yeni kayıt orada ne görünür ne bozar — panele hiç girilmeden kesin cevap. v2 oraya istenirse: share URL + `UMAMI_SITES` satırı (Bunker OS'un işi).
- **Ölçüm hijyeni:** `t107d-serve` ve `t107d-probe` konteynerleri silindi (`docker ps -a` sayım 0), port 3200 boş. `web`/`web-prod`/`lead-store` dokunulmadı.

---

**Oluşturulma:** 2026-09-11 · **Yeniden yazıldı:** 2026-09-13 (plan revizyonu — kendi Umami, ağaçtaki yarım işi devralır)
