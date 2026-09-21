# TASK-1.07: Kendi Umami'ye site kaydı ve tracker bağlantısı

**Durum:** ⬜ Bekliyor — kısmi ilerleme (kod, B-056 koruması ve yerel ölçüm commit'li); kullanıcı adımı bekleniyor: Umami **kullanıcı adı + parolası** kasaya (self-hosted 3.1.0'da API anahtarı yok — ölçüldü 2026-09-21) ya da Website ID doğrudan. Devam: Oturum Kayıtları → **2026-09-21** kaydının Sonraki Adım Detayı. Çalıştırma sırasında 1.06'nın arkasına taşındı (2026-09-13).
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

- [ ] **1. Yarım işi devral ve teyit et**
  - Oturum başında `git status` + `git diff`: fark yukarıda anlatılanla aynı mı? Başka bir şey eklenmişse ya da o oturum hâlâ açıksa **dur ve sor**
  - Farkın ne yaptığı Oturum Kaydı'na tek paragraf yazılır (devralma kaydı)

- [ ] **2. Kendi Umami'de site kaydı aç** (kullanıcı panelde; oturum adımları hazırlar)
  - Umami kurulumunun **sürümü** okunur. `data-tag` özniteliğini destekliyor mu? Desteklemiyorsa ortam ayrımı için alternatif (aşama başına ayrı site kaydı) **kullanıcıya sorulur**
  - Site eklenir: ad önerisi `Alpfit Plus v2 (önizleme)`, alan adı `alpfitplus-web-v2.vercel.app`. v1'in `alpfitplus.com` kaydına **dokunulmaz**
  - Website ID kopyalanır (sır değil)
  - Kurulumun çerez ve IP saklama davranışı (varsayılandan değiştirilmiş mi) okunur ve Oturum Kaydı'na yazılır — TASK-1.15'in yasal metni bu kayda dayanır ("teyit edilmiş olmalı")

- [ ] **3. Tracker'ı kendi kuruluma çevir**
  - `src="https://umami.kiwiailab.com/script.js"`, `strategy="afterInteractive"`, `data-website-id`, `data-tag={DEPLOY_STAGE}`
  - Env tanımsız/boşken script **hiç render edilmez** (devralınan davranış korunur)
  - `data-domains` **kullanılmaz** — önizlemede de saymalı (v1 bunu kullanıyor, v2 bilinçli olarak kullanmıyor; gerekçe yorumda)
  - Yorumlardaki "Umami Cloud" anlatımı kendi kuruluma çevrilir
  - Dosya: `src/app/layout.tsx`

- [ ] **4. Env'i tanımlat**
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

- [ ] Yerelde env tanımsızken sayfa kaynağında Umami script etiketi **yok**, konsol temiz (`scan.mjs /`)
- [ ] Yerelde env tanımlıyken etiket var: `src="https://umami.kiwiailab.com/script.js"`, `data-tag="local"`, `data-domains` yok
- [ ] Yerelde env tanımlıyken tarayıcıda (araştırma konteyneri) sayfa yüklenince `umami.kiwiailab.com`'a sayfa görüntüleme isteği gidiyor ve 2xx dönüyor
- [ ] `grep -n "cloud.umami.is" src .env.example` → eşleşme yok
- [ ] Önizleme adresinde script yükleniyor ve `data-tag="preview"` — kanal: UAT
- [ ] Önizlemede gezilen 3 sayfa kendi Umami panelinde v2 site kaydı altında sayfa görüntülemesi olarak görünüyor ve `preview` etiketi taşıyor — kanal: UAT
- [ ] v1'in `alpfitplus.com` site kaydı ve sayıları değişmedi (panelde gözle) — kanal: UAT
- [ ] `docker compose exec web npm run build` hatasız; `npx eslint src/app/layout.tsx` temiz

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-13 (run-phase turu, alt ajan)

**Durum:** 🔄 Devam edecek — kullanıcı eylemi bekleniyor (panel girişi gerektiren site kaydı; alt ajan kullanıcıya ulaşamıyor). Task tabloda ⬜ kaldı ve sırası değişti (Son Yaklaşım).

**Yapılanlar:**
- **Devralma kaydı (alt görev 1):** `git diff` task dokümanının anlattığıyla aynı çıktı: `layout.tsx`'e `next/script` importu, `.trim()`'li `umamiWebsiteId` sabiti (boşsa etiket render edilmez), `afterInteractive` + `data-website-id` + `data-tag={DEPLOY_STAGE}` taşıyan etiket (adres `cloud.umami.is`); `.env.example`'a `NEXT_PUBLIC_UMAMI_WEBSITE_ID` bloğu. Başka ekleme yok. Dosyaların son değişikliği 2026-09-11 04:10–04:11, o tarihten beri dokunan yok — bırakan oturum açık değil.
- **Tracker kendi kuruluma çevrildi (alt görev 3):** adres `UMAMI_SCRIPT_SRC` sabiti (`https://umami.kiwiailab.com/script.js`); Cloud anlatımı kendi kuruluma çevrildi; `data-domains`'in neden kullanılmadığı v1 farkıyla yoruma yazıldı; v1 site kimliğinin kullanılmayacağı yoruma girdi. Devralınan davranış (boşken render yok, `.trim()`, `afterInteractive`) korundu.
- **`.env.example` (alt görev 4, dosya kısmı):** açıklama kendi kuruluma çevrildi, v1 kimliği yasağı ve "Vercel'de Production + Preview" eklendi; değer yok.
- **Kurulum dışarıdan okundu (alt görev 2, oturum kısmı):**
  - **Sürüm: Umami 3.1.0** — uygulama paketindeki `CURRENT_VERSION` sabiti (`/login` sayfasının JS parçaları). Resmi imaj digest'e sabitli (`../altyapi/vps/CLAUDE.md`).
  - **`data-tag` destekleniyor:** sunulan `script.js` `data-tag`'i okuyup yükte `tag` alanıyla gönderiyor; 3.1.0 şemasında `website_event.tag` sütunu var. Alternatif (aşama başına ayrı site kaydı) gerekmedi, soru doğmadı.
  - **Çerez: yok (ölçüldü).** Betik çerez yazmıyor, isteği `credentials: omit` ile atıyor; tarayıcı ölçümünde `script.js` ve `/api/send` yanıtlarında `Set-Cookie` yok, iki sayfa gezildikten sonra bağlamda çerez sayısı 0.
  - **IP: veritabanında tutulmuyor (kaynaktan okundu, sunucuya girilmedi).** 3.1.0 şemasının `session` tablosunda IP sütunu yok (tarayıcı, işletim sistemi, cihaz, ekran, dil, ülke/bölge/şehir). IP istek anında oturum özeti (`uuid(site, ip, userAgent, tuz)`, tuz varsayılan aylık döner) ve konum için kullanılıp atılıyor. Sunucudaki Umami env'inin varsayılandan değişip değişmediği (ör. `SALT_ROTATION`) sunucu erişimi gerektirdiği için **okunmadı**; hiçbir env ayarı şemaya IP sütunu eklemez.
  - **TASK-1.15 için iki not:** (a) `umami.kiwiailab.com` önündeki nginx'in erişim loglarının IP tutup tutmadığı ve saklama süresi ölçülmedi — "IP saklamaz" cümlesi Umami veritabanı için doğru, sunucu logları için doğrulanmadı; (b) 3.1.0'da oturum kaydı (session replay) özelliği var, ama sunulan `script.js` kaydedici kod taşımıyor ve biz ek betik yüklemiyoruz.
- **Vercel env (alt görev 4, doğrulama kısmı):** `vercel env ls` → `NEXT_PUBLIC_UMAMI_WEBSITE_ID` hiçbir ortamda **tanımlı değil** (yalnız `DEMO_TO`, `DEMO_FROM` × 3 ortam). Önceki Cloud denemesinden kalmış bir kimlik yok; push sonrası önizlemede tracker render edilmez, yanlış kuruluma istek gitmez. Yerel `.env` dosyası da yok.

**Sorunlar:**
- **Site kaydı açılamadı:** Umami paneline giriş kullanıcının kimlik bilgisini istiyor; bu tur kullanıcıyla konuşamayan bir alt ajan. Site kaydı, website ID ve env değerinin girilmesi kullanıcıya döndü. Bu yüzden 3. test kriterinin 2xx ayağı ve UAT kriterleri henüz sınanamadı.

**Kararlar:**
- **Adres sabit, `layout.tsx`'te:** Dikkat Noktaları'nın önerisi — tek kurulum, sır değil; TASK-1.08 `analytics.ts`'e taşıyıp taşımamaya karar verir.
- **Yerel ölçüm placeholder kimlikle yapıldı** (`00000000-0000-4000-8000-000000000107`): etiketi ve isteğin gidişini sınamak için gerçek kimlik gerekmiyor. Canlı Umami'ye giden iki istek `400 Website not found` aldı, hiçbir kayıt yazılmadı. v1'in sayfa kaynağında görünen kimliği bilinçli olarak **kullanılmadı** — v1'in sayılarını kirletirdi.
- **Derleme çalışan `web` konteynerinde değil aynı servisten ayrı konteynerde** (`docker compose run web npm run build`, sonra 3200'de `npm start`) yapıldı; sonunda `docker compose restart web`. Gerekçe: memory → Alternatif env ile üretim derlemesi.
- docs/DECISIONS.md'ye eklendi: **Hayır** — sağlayıcı kararı 2026-09-13'te zaten yazılı; bu oturum yeni sözleşme bırakmadı.
- **Alan adı geçişine not:** v2'nin `alpfitplus.com`'a geçişte v1'in site kaydını mı (geçmiş bitişik kalır) yoksa bu yeni kaydı mı kullanacağı alan adı geçişi fazının kararıdır; bu task karar vermedi.

**Kalan İşler:**
- Kullanıcı: Umami'de v2 site kaydı → website ID → Vercel (Production + Preview) ve yerel `.env`.
- Oturum (ID geldikten sonra): 3. test kriteri gerçek kimlikle, `vercel env ls` teyidi, memory güncellemesi, kapanış.

**Son Yaklaşım:**
Kod tarafı bitti, ölçüldü ve commit'lendi: `src/app/layout.tsx` ve `.env.example` (devralınan fark + bu oturumun çevirisi) ile bu kayıt. Push güvenli: env hiçbir Vercel ortamında tanımlı değil, tanımsızken tracker render edilmiyor (yukarıda ölçüldü).

Kapanış kullanıcı adımına bağlı kaldığı için orkestratör kararıyla (2026-09-13) task **çalıştırma sırasında 1.06'nın arkasına, 1.08'in önüne taşındı**. Aktif Task TASK-1.16 oldu. Task tanımı ve kabul kriterleri değişmedi.

Tabloda ⬜ duruyor. ⏸️ ve 🔴 koşumu durdurur; 🔄 ise etkin olmayan bir satırda "yarım iş öne geçer" diye okunabilir. Kullanıcı adımı `BULGULAR.md` → Gelen Kutusu'nda `[TASK-1.07]` işaretli. Sıra 1.07'ye geldiğinde adım yapılmamışsa oturum yine burada durur.

**Sonraki Adım Detayı:**
1. **Kullanıcı** `https://umami.kiwiailab.com`'da Settings → Websites → Add website: ad `Alpfit Plus v2 (önizleme)`, alan adı `alpfitplus-web-v2.vercel.app`. v1'in `alpfitplus.com` kaydına dokunulmaz. Oluşan Website ID kopyalanır. Bunker "Web Trafik" panelinde yeni kaydın görünüp görünmediğine ve panelin bozulmadığına göz atılır.
2. **Değer girişi:** `NEXT_PUBLIC_UMAMI_WEBSITE_ID` Vercel'de Production + Preview'e, yerelde repo kökündeki `.env`'e girilir. Bunu kullanıcı yapar, ya da açık izin verirse oturum `vercel env add` ile yapar. `NEXT_PUBLIC_` derlemeye gömülür, değer bir sonraki dağıtımda etkili olur.
3. **Oturum** `vercel env ls` ile adın Production + Preview'de olduğunu doğrular.
4. **Oturum** 3. kriteri gerçek kimlikle koşar: `docker compose run --rm --name t107-build -e NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id> web npm run build`, sonra `docker compose run --rm -d --name t107-serve --publish 3200:3000 -e … web npm start`. Ardından araştırma konteynerinde tarayıcı ölçümü: `/api/send` **2xx** ve yükte `tag: "local"`. Sonra `docker rm -f t107-serve` ve `docker compose restart web`. Betik şablonu bu oturumda scratchpad'deydi (`umami-probe.mjs`): sayfayı açar, `umami` içeren yanıtları, POST yükünü, `Set-Cookie`'yi ve bağlam çerezlerini döker.
5. Memory `kendi-sunucu-n8n-bunker-umami.md`'ye sürüm (3.1.0, `data-tag` destekli) ve v2 site kaydının adı yazılır. Ardından Adım 4-8 kapanışı yapılır: task ✅, DURUM, PHASE-1, arşiv, tek commit.
6. Push'tan sonra önizlemede `data-tag="preview"` ve panel kriterleri UAT kanalında sınanır (verify-phase).

**Dosya Değişiklikleri:**
- `src/app/layout.tsx` → Umami tracker kendi kuruluma çevrildi: `UMAMI_SCRIPT_SRC` sabiti, yorum (kendi kurulum gerekçesi, v1 kimliği yasağı, `data-domains` farkı). Devralınan `next/script` etiketi ve boşken render etmeme davranışı korundu.
- `.env.example` → `NEXT_PUBLIC_UMAMI_WEBSITE_ID` açıklaması kendi kuruluma çevrildi; değer yok.

**Test Sonuçları:**
- `grep -rn "cloud.umami.is" src .env.example` → eşleşme yok (çıkış 1).
- `npx eslint src/app/layout.tsx` (`web` konteyneri) → çıkış 0, çıktı yok.
- **Env tanımsız (kriter 1):** geliştirme sunucusu (3000, `.env` yok, compose env vermiyor). `/` HTML'inde `umami` geçmiyor. `scan.mjs / t107-dev-home 1440 900` → 17 kare, sayfa 15139 px, **konsol temiz**.
- **Env tanımlı, placeholder kimlik (kriter 2 ve 3'ün gidiş ayağı):** üretim derlemesi hatasız (23 rota), sunum 3200'de. HTML'de `https://umami.kiwiailab.com/script.js` için preload var; RSC yükünde `strategy: afterInteractive`, `data-website-id`, `data-tag: "local"` var; `data-domains` 0, `cloud.umami` 0. `/fiyat`, `/demo`, `/segmentler/crossfit` sayfalarının hepsi adresi taşıyor. Tarayıcıda (araştırma konteyneri; `/` ve `/fiyat`) DOM'da tek `script` var: `src` kendi kurulum, `data-tag="local"`, `data-domains` yok, `window.umami` tanımlı. `GET script.js` → 200 (iki sayfada). `POST /api/send` → yük `{website, hostname: "localhost", url, tag: "local"}` → **400 `Website not found.`**; gerçek kimlik olmadan beklenen yanıt bu. **2xx ayağı sınanmadı**, site kaydını bekliyor. Çerez 0. Konsoldaki iki hata yalnız bu 400'ler.
- **Env yalnız boşluk (`"   "`, `.trim()` davranışı):** üretim derlemesi hatasız, 3200. HTML'de `umami` 0 ve placeholder 0; DOM'da script yok, `window.umami` tanımsız, Umami isteği 0, çerez 0, konsol temiz. Placeholder derlemesi aynı koşuda etiketi gösterdi, yani negatif sonuç kör değil: kontrol grubu o derleme.
- `docker compose exec web npm run build` birebir koşmadı; aynı imaj ve hacimle ayrı konteynerde iki kez koştu, ikisi de hatasız (gerekçe Kararlar'da). Ardından `docker compose restart web` → 3000 yine 200.
- UAT kriterleri (önizlemede `preview` etiketi, panelde 3 sayfa, v1 kaydı değişmedi) sınanmadı; kanalları UAT ve önkoşulları site kaydı ile Vercel env.

### Oturum — 2026-09-21 (run-phase turu, alt ajan)

**Durum:** ⬜ Bekliyor (değişmedi) — kapanış hâlâ kullanıcı adımına bağlı. Bu oturum kapanışı **açamadı** ama iki şey yaptı: B-056 koruma kapısını kapattı ve kullanıcıdan istenecek kimliğin **hangi biçimde** gerektiğini ölçtü. Soru artık "panelde şunu yap" değil, tek satırlık kasa girişi.

**Yapılanlar:**
- **Kimlik biçimi ÖLÇÜLDÜ — self-hosted Umami 3.1.0'da API anahtarı YOK.** Önceki tur kasaya "Umami erişimi" eklenmesini önermişti ama biçimini ölçmemişti. Ölçüm:
  - `src/lib/auth.ts` (v3.1.0 etiketi) → `checkAuth` yalnız iki yol tanıyor: `Authorization: Bearer <token>` ve paylaşım token'ı (`x-umami-share-token`). `api-key` / `x-umami-api-key` geçmiyor (grep: 0). API anahtarı Umami **Cloud** özelliği; bu kurulumda yok.
  - Canlı teyit: `GET /api/me` + `x-umami-api-key: <sahte>` → **401**. `GET /api/websites` (kimliksiz) → **401** (uç var, yetki istiyor).
  - `POST /api/auth/login` canlı sunucuda boş gövdeyle sınandı → **400**, `{"username": "expected string, received undefined", "password": "..."}`. Yani gereken kimlik **kullanıcı adı + parola**.
  - Site kaydı ucu: `POST /api/websites`, gövde `{name, domain}` (opsiyonel `id`, `teamId`, `shareId`), Bearer token ile; yanıt website nesnesi ve içinde `id` — aradığımız Website ID. Kaynak: v3.1.0 `src/app/api/websites/route.ts`.
  - **Hiçbir giriş denemesi yapılmadı** (parola tahmini yok); yalnız şekil probu. Canlıya yazan istek atılmadı.
- **B-056 koruma kapısı kapatıldı** (`data-exclude-search="true"`, `src/app/layout.tsx`). Gerekçe Kararlar'da. Yorumda neden zorunlu olduğu, hangi zincirin kapandığı ve UTM gerekirse alternatifin (`data-before-send`) ne olduğu yazılı.

**Sorunlar:**
- **Site kaydı yine açılamadı.** Kasada (`~/.config/alpfit/secrets.env`) yalnız `RESEND_ADMIN_KEY` var (ad sayıldı, değer okunmadı); Umami kimliği yok. Kimlik olmadan `POST /api/websites` çağrılamaz. Sunucunun veritabanına yazarak kayıt açmak bu turun yetkisi dışında (canlı sisteme yazma).

**Kararlar:**
- **B-056 koruması bu task'ta yapıldı, ayrı `/devflow:quick` oturumunda değil.** Gelen Kutusu'ndaki `[audit-product SORU]` "nerede yapılsın" diye soruyordu; denetimin önerisi "kimlikten önce"ydi. Esas olan sıra, oturumun adı değil: kimlik **bu task'ta** girilecek ve bu turda girilmedi, dolayısıyla korumayı buraya koymak aynı sıra garantisini veriyor ve fazladan bir oturum açmıyor. Dosya zaten bu task'ın dosyası. Karar koşum yetkilendirmesi kapsamında verildi (kullanıcının "hangi kesim/öneri → sen seç" talimatı); BULGULAR satırına kanca yazıldı ki triyaj yeniden sormasın.
- **Yeni npm bağımlılığı yok, davranış değişmedi:** tek statik öznitelik. Ölçülebilirlik kaybı yok — projede UTM/kampanya planı yok (B-056 grep: 0).

**Kalan İşler:**
- Kullanıcı: Umami kullanıcı adı + parolasını kasaya eklesin (tek satırlık komut BULGULAR'daki `[TASK-1.07]` satırında ve dönüş mesajında), **ya da** paneli kendisi kullanıp Website ID'yi versin.
- Oturum (kimlik geldikten sonra): site kaydını API ile açar, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`'yi Vercel'e girer, 3. kriteri gerçek kimlikle koşar, memory'yi günceller, kapanışı yapar.

**Son Yaklaşım:**
Kapanış hâlâ kimliğe bağlı, ama iki engel kalktı: (1) izleyici artık sorgu dizesini göndermiyor, yani kimlik girildiği an kişisel veri sızdıran zincir **kurulmuyor** — önceki turda bu açık bir pencereydi; (2) kullanıcıdan ne isteneceği tam olarak belli.

Değişiklik commit'lendi; ağaçta bu turun yarım işi bırakılmadı. Gerekçe: bu task'ın kendisi 2026-09-13'te ağaçta bekleyen commit'lenmemiş bir işi devralmak zorunda kalmıştı — aynı durumu tekrar üretmemek için tamamlanmış ve ölçülmüş koruma kayda geçti. Task tabloda ⬜ kaldı (⏸️/🔴 koşumu durdurur).

**Sonraki Adım Detayı:**
1. **Kimlik kasaya girerse** (tercih edilen yol) oturum şunu koşar — parola hiçbir çıktıya düşmez:
   ```bash
   set -a; . ~/.config/alpfit/secrets.env; set +a
   TOKEN=$(curl -s -X POST https://umami.kiwiailab.com/api/auth/login \
     -H 'Content-Type: application/json' \
     -d "{\"username\":\"$UMAMI_USERNAME\",\"password\":\"$UMAMI_PASSWORD\"}" | jq -r .token)
   # once MEVCUT kayitlari listele — v1'in kaydina dokunmadigini ve takim (teamId) yerlesimini gor
   curl -s https://umami.kiwiailab.com/api/websites -H "Authorization: Bearer $TOKEN" | jq '.data[] | {id, name, domain, teamId}'
   # sonra v2 kaydini ac
   curl -s -X POST https://umami.kiwiailab.com/api/websites -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' \
     -d '{"name":"Alpfit Plus v2 (önizleme)","domain":"alpfitplus-web-v2.vercel.app"}' | jq '{id, name, domain}'
   ```
   Dönen `id` → Website ID (sır değil, sayfa kaynağında görünür).
2. **Kullanıcı paneli kendi kullanırsa:** `umami.kiwiailab.com` → Settings → Websites → **Add website** → Name `Alpfit Plus v2 (önizleme)`, Domain `alpfitplus-web-v2.vercel.app` → Save. Listede yeni satıra tıklayıp **Website ID**'yi kopyalar. v1'in `alpfitplus.com` kaydına dokunulmaz.
3. **Env girişi:** `NEXT_PUBLIC_UMAMI_WEBSITE_ID` Vercel Production + Preview'e (`vercel env add`, değer sır değil) ve yerel `.env`'e. `NEXT_PUBLIC_` derlemeye gömülür — değer **sonraki dağıtımda** etkili olur.
4. **3. kriter gerçek kimlikle** — ⚠️ **B-056 (b): bu kriter sahte yeşil verebilir.** Araştırma konteynerinin varsayılan UA'sı `HeadlessChrome…` ve Umami 3.1.0 bot kontrolü **200** döndürüp kaydı yazmaz (`{"beep":"boop"}`). Kapanışta yalnız "2xx gördüm" yetmez: yanıt gövdesi `{"beep":"boop"}` **olmamalı**, ya da tarayıcıya bot olmayan bir UA verilmeli. Asıl kanıt panelde kaydın görünmesidir.
5. Memory `kendi-sunucu-n8n-bunker-umami.md`'ye yazılır: sürüm 3.1.0, `data-tag` destekli, **API anahtarı yok — Bearer/login tek yol**, v2 site kaydının adı.
6. Bunker "Web Trafik" paneli yeni kayıttan sonra gözle kontrol edilir (bozulmadı mı).
7. Ardından kapanış: task ✅, DURUM, PHASE-1, arşiv, tek commit. UAT kriterleri (önizlemede `preview` etiketi, panelde 3 sayfa, v1 kaydı değişmedi) verify-phase'e kalır.

**Dosya Değişiklikleri:**
- `src/app/layout.tsx` → izleyici etiketine `data-exclude-search="true"` eklendi + 9 satırlık gerekçe yorumu (hangi zincir, hangi yasal cümle, UTM alternatifi). Başka davranış değişmedi.

**Test Sonuçları:**
- `npx eslint src/app/layout.tsx` (`web` konteyneri) → çıkış 0, çıktı yok.
- `npm test` (`web` konteyneri, Vitest) → **3 dosya / 53 PASS + 1 skipped** — taban birebir aynı (TASK-1.06 ölçümü 53 PASS + 1 skipped).
- **Pozitif ayak — env tanımlı, yalıtılmış üretim derlemesi:** repo **kopyasında** derlendi (scratchpad + `node_modules` hacmi `:ro`; memory → "Dev sunucusuna ve repoya hiç dokunmayan yol"), 3200'de sunuldu. Env: `VERCEL=1`, `VERCEL_ENV=production`, `VERCEL_PROJECT_PRODUCTION_URL=alpfitplus-web-v2.vercel.app` — yani projenin **bugünkü ara hâli** (memory → "Aşamaya bağlı davranışta ara hâl ayrıca sınanır"). Derleme hatasız. `/` ve `/demo` RSC yükünde: `data-exclude-search":"true"`, `data-tag":"preview"` (ara hâl doğru türedi), `data-website-id` placeholder; **`data-domains` sayısı 0**. Betik adresi tek: `umami.kiwiailab.com/script.js`.
- **Negatif ayak (kontrol grubu) — env tanımsız:** çalışan geliştirme sunucusu (3000, `.env` yok) → `/` HTML'inde `umami` geçiş sayısı **0**, HTTP 200. Yani pozitif ayak kör değil.
- **İzleyici özniteliği gerçekten okuyor:** canlı `script.js` indirildi (200, 4595 bayt) → gövdede `exclude-search` **geçiyor** (1 eşleşme). Önceki denetim (B-056) özniteliğin etkisini kontrol gruplu ölçmüştü; bu tur yalnız sunulan betiğin onu hâlâ okuduğunu teyit etti.
- **Ağaç ve servisler:** ölçüm konteyneri (`t107b-serve`) silindi — `docker ps -a` sayım **0**, port 3200 **boş**. `web` · `web-prod` · `lead-store` (bu oturumun başlatmadıkları) dokunulmadan ayakta, 3000 → 200. Canlı Umami'ye **yazan** istek atılmadı; atılan istekler `GET /api/heartbeat`, `GET script.js` ve üç yetkisiz şekil probu (401/400).
- UAT kriterleri ve 3. kriterin 2xx ayağı hâlâ sınanmadı — site kaydını bekliyor.

---

**Oluşturulma:** 2026-09-11 · **Yeniden yazıldı:** 2026-09-13 (plan revizyonu — kendi Umami, ağaçtaki yarım işi devralır)
