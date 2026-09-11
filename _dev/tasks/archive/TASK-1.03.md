# TASK-1.03: Vercel'de ayrı proje, env iskeleti ve başlık ölçümü

**Durum:** ✅ Tamamlandı
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.3: Vercel'de ayrı proje ve önizleme yayını
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.02 ✅ (noindex ilk dağıtımda yerinde olmalı)

---

## Hedef

v2 reposunu Vercel'de **v1'den bağımsız** yeni bir projeye bağlamak, ilk dağıtımı `<proje>.vercel.app` adresinde ayağa kaldırmak, o gün mevcut olan env değişkenlerini tanımlatmak ve güvenlik başlıklarını gerçek yayın zinciri üzerinden ölçmek. Task, önizleme adresi ayakta + noindex ölçülmüş + beş güvenlik başlığı doğrulanmış + GIT-STRATEJI yeni gerçeğe göre güncellenmiş olduğunda tamamlanmış sayılır.

---

## Bağlam

Projeyi **kullanıcı** açar (vercel.com/new → repo içe aktarma); CLI kurulamadı, gerek de yok. Oturumun işi adımları hazırlamak, ölçümü yapmak ve sonucu kayda geçirmek.

v1'in Vercel projesi `alpfitplus-website` **dokunulmazdır**; aynı hesapta farklı ad kullanılır (öneri: `alpfitplus-web-v2`). `alpfitplus.com` alan adı bu fazda bağlanmaz — o F7.5'in işi.

Bu task GIT-STRATEJI'yi de değiştirir: repo Vercel'e bağlandığı andan itibaren her `main` push bir dağıtım tetikler. Bugünkü "yayın hattı yok, otomatik deploy yok" beyanı artık doğru olmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Deployment Protection", "Vercel Hobby ticari kullanıma kapalı", "Güvenlik başlıkları önizlemede ölçülür"
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.2 ve F7.3 kabul kriterleri
- `_dev/GIT-STRATEJI.md` — değiştirilecek beyan (korumalı doküman)
- `.claude/commands/devflow/lib/git-strategy-kurulum.md` — strateji değiştirmenin tarifi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/GIT-STRATEJI.md` — **korumalı doküman**: değiştirmeden önce kullanıcıya bildir ve onay al
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle; başlık ölçümü sonucu

---

## Alt Görevler

- [x] **1. Kullanıcı adımlarını hazırla ve birlikte yürüt**
  - vercel.com/new → `NorthAIII/alpfitplusweb.v2` içe aktarılır; proje adı `alpfitplus-web-v2` (v1'in `alpfitplus-website` projesine dokunulmaz)
  - Framework: Next.js (otomatik); Root Directory kök; build komutu varsayılan
  - **"Enable access to System Environment Variables" açık olmalı** — `VERCEL`, `VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL` derlemede görünmezse aşama türetimi (TASK-1.01) yanlış çalışır
  - Alan adı **eklenmez**

- [x] **2. O gün mevcut env değişkenlerini tanımlat** — `RESEND_API_KEY` hariç, değeri yalnız kullanıcıda (→ Kalan İşler)
  - `RESEND_API_KEY`, `DEMO_TO`, `DEMO_FROM` (değerler kullanıcıda; oturum değerleri görmez, yalnız anahtar adlarını söyler)
  - `LEAD_FILE_PATH` **tanımlanmaz** (Vercel'de kalıcı disk yok)
  - `LEAD_WEBHOOK_URL` ve `NEXT_PUBLIC_UMAMI_WEBSITE_ID` bu task'ta **yok** — kendi task'larında (1.04 / 1.07) eklenir

- [x] **3. Dağıtımı ve aşama türetimini doğrula**
  - `<proje>.vercel.app` açılıyor, 23 rota erişilebilir (ana sayfa + birkaç alt sayfa gözle)
  - Aşama `preview` türemiş olmalı — kanıtı `robots.txt` ve `X-Robots-Tag` (TASK-1.02 katmanları)

- [x] **4. Güvenlik başlıklarını yayın zinciri üzerinden ölç**
  - `curl -sI https://<proje>.vercel.app/` → beş başlık + HSTS + `X-Robots-Tag`
  - Ölçüm çıktısı faz dokümanına yazılır (M7 F7.2'nin F7.3'e devredilmiş kabul kriteri)

- [x] **5. GIT-STRATEJI'yi güncelle** (kullanıcı onayıyla)
  - "Ortam / Hedef" sütunu: `main` → `alpfitplus-web-v2` Vercel projesi, her push dağıtım
  - "Yayın" bölümü: alan adı bağlı olmadığı için yayın anı hâlâ yok; site `noindex`, aşama `preview`. F7.5'te bu değişecek
  - "Bu Projeye Özgü Notlar" içindeki "Vercel bağlantısı bu stratejiyi değiştirecek" maddesi gerçekleşmiş hâline göre tazelenir

---

## Etkilenen Dosyalar

```
_dev/
├── GIT-STRATEJI.md       # dal↔ortam eşleşmesi ve yayın beyanı — zaten var (KORUMALI)
└── phases/PHASE-1.md     # başlık ölçümü sonucu — zaten var
```

> Kod değişikliği yok; bu task platform kurulumu ve ölçümdür.

---

## Dikkat Noktaları

- **v1'e dokunulmaz.** `alpfitplus-website` projesi ve `alpfitplus.com` DNS'i bu task'ta hiç açılmaz.
- `<proje>.vercel.app` bu modelde **üretim** alan adıdır ve Hobby'de herkese açıktır (Standard Protection üretim alan adlarını korumaz) — kapsam kararı bunu zaten istiyor. Dağıtım-özel `<proje>-<hash>.vercel.app` adresleri korumalı olabilir; telefon testi üretim adresinden yapılır.
- Vercel Hobby **ticari kullanıma kapalı** (adil kullanım metni: "ürün veya hizmet satışının reklamı" ticari sayılır). Kullanıcı riski bilerek kabul etti — `BULGULAR.md` → Bilinçli Tercihler; F7.5 kapsam tartışmasında yeniden konuşulur. Bu task'ta karar açılmaz.
- Vercel kendi HSTS'ini ekleyebilir; **çift HSTS değeri görülürse not edilir, çakışma sayılmaz**.
- Sır değerleri repoya, task dokümanına veya commit mesajına **yazılmaz** — yalnız anahtar adları.
- Ölçüm sonucu rakamıyla/başlık listesiyle faz dokümanına yazılır (QUALITY 6).

---

## Test Kriterleri

- [x] `https://<proje>.vercel.app/` 200 döner; ana sayfa, `/fiyat`, `/demo`, `/destek` gözle açılıyor
- [x] `curl -sI https://<proje>.vercel.app/` çıktısında `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` var
- [x] Aynı çıktıda `X-Robots-Tag: noindex, nofollow` var (aşama `preview` türedi)
- [x] `curl -s https://<proje>.vercel.app/robots.txt` → `Disallow: /`
- [x] `curl -sI https://<proje>.vercel.app/fonts/inter-400-tr.woff2` → `Cache-Control: public, max-age=31536000, immutable`
- [x] `/api/demo`'ya boş POST → 422 (uç ayakta; hedefsiz 503 davranışı TASK-1.05/1.06'da sınanır)
- [x] v1 projesi ve `alpfitplus.com` yanıtları değişmedi (v1 ana sayfası hâlâ 200)

---

## Risk ve Geri Dönüş Planı

- **Yanlış hesap/proje seçimi:** v1 projesinin ayarlarına dokunma riski → proje adı ve repo adı içe aktarma ekranında yüksek sesle teyit edilir.
- **Sistem env kutusu kapalı kalırsa:** aşama `local` türer, noindex katmanları yine kapalı kalır (güvenli yön) ama lead `env` alanı ve Umami etiketi yanlış olur → Test kriterlerindeki `X-Robots-Tag` kontrolü bunu yakalar.
- **Rollback:** Vercel projesi silinebilir; repoda değişiklik yalnız GIT-STRATEJI'dir, dosya bazlı geri alınır.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı (alt görev 2 `RESEND_API_KEY` hariç — kullanıcı-tarafı, TASK-1.06'ya taşındı)
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-11

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Rota değişti (alt görev 1):** Task "CLI kurulamadı, projeyi kullanıcı açar" varsayıyordu; oturumda Vercel CLI'ın kurulu olduğu (59.15.1) görüldü. Kullanıcı kendi terminalinde `vercel login` yaptı (hesap `northaiii`, takım `north-ai`), kurulumun tamamı CLI + REST API ile yürütüldü. Kabul kriterleri değişmedi, yalnız kimin tıkladığı değişti.
- Proje `alpfitplus-web-v2` kuruldu (`vercel project add`), repo bağlandı (`vercel link` + `vercel git connect` → `NorthAIII/alpfitplusweb.v2`, üretim dalı `main`). v1'in projesi `alpfitplus-website` hiç açılmadı.
- **İki proje ayarı elle düzeltildi.** `vercel project add` çerçeve tespiti yapmıyor: proje `framework: null` ("Other") doğdu, yani çıktı dizini `public` varsayılacaktı. REST API ile `framework: "nextjs"` yazıldı. `autoExposeSystemEnvs` zaten `true` doğdu — panelde aranan "Enable access to System Environment Variables" kutusu bu alandır, ayrıca açmak gerekmedi.
- **Env (alt görev 2):** `DEMO_TO` ve `DEMO_FROM` üç ortama da tanımlandı (Production + Preview + Development) ve değerleri `vercel env pull` ile geri okunarak doğrulandı. `LEAD_FILE_PATH` bilinçli tanımlanmadı (kalıcı disk yok). **`RESEND_API_KEY` tanımlanmadı** — değer yalnızca kullanıcıda; bu task'ın test kriterlerinde geçmiyor, ihtiyaç TASK-1.06'da doğuyor (Kalan İşler).
- **Dağıtım (alt görev 3):** ilk dağıtım kırıldı, sebep bulundu ve düzeltildi (aşağıda). İkinci dağıtım `1b1e464` commit'inden **git kaynaklı** olarak yeşile döndü (`source: git`, `ref: main`) — "`main`'e push dağıtım tetikler" kriteri gerçek bir push ile kanıtlandı, elle tetikleme ile değil.
- **Ölçüm (alt görev 4):** dokuz kalem `https://alpfitplus-web-v2.vercel.app` üzerinden ölçüldü, tablolar `phases/PHASE-1.md` → Ölçümler'de.
- **GIT-STRATEJI (alt görev 5):** tarifin iz taraması yapıldı (strateji beyanı tek evde, sızıntı yok), kullanıcı onayı alındı, dört bölüm güncellendi.

**Sorunlar:**
- **İlk dağıtım `onBuildComplete` adımında ENOENT ile kırıldı:** Vercel'in derleyicisi `.next/next-server.js.nft.json` iz dosyasını arıyor, `output: "standalone"` bu dosyayı beklediği yere koymuyor. Standalone Docker üretim imajı için gerekli (M7 F7.1, 3100), yani kaldırılamaz → `next.config.ts`'te `VERCEL` sistem değişkenine bağlı koşullu hâle getirildi. M7 Teknik Notlar'ın "Vercel kendi derlemesini yapar" cümlesi doğru ama eksikti: platform standalone çıktısıyla çalışmıyor.
- **Yerel derleme teşhisi yalanlamadı ama kanıtlamadı da:** konteynerde standalone modunda `.nft.json` dosyaları *var*. Yani teşhis yerel gözlemle doğrulanamadı, dağıtımla sınandı — düzeltmeden sonra aynı commit zinciri yeşile döndü, sebep böyle kesinleşti.
- **`vercel deploy` (yerel kaynak yükleme) iki denemede de ilerlemedi** (500 s ve arka planda, hiç dağıtım yaratmadan). Düzeltmeyi sınamak için commit + push rotası kullanıldı; projenin gerçek akışı da bu olduğu için kayıp yok.
- **`vercel link` bir `.env.local` dosyası yarattı** (yalnız `VERCEL_OIDC_TOKEN`). Önceden böyle bir dosya yoktu (doğrulandı: yalnız `.env.example` vardı, compose `env_file` kullanmıyor), yani kullanıcının yerel ortamı ezilmedi. Kullanılmadığı için silindi; `.vercel/` proje bağlantısı için duruyor (ikisi de gitignore'lu).

**Kararlar:**
- **`output` koşullu:** Vercel'de varsayılan çıktı, dışında `standalone`. Koşul `process.env.VERCEL`. Gerekçe ve ölçüm `next.config.ts` yorumunda rakamıyla duruyor.
- **İki commit:** düzeltme ayrı commit'le push edildi çünkü sınanacak artefaktın git'te olması gerekiyordu (dağıtım git kaynaklı); doküman commit'i oturum kapanışında. Tek-commit varsayılanından bilinçli sapma.
- docs/DECISIONS.md'ye eklendi: **Hayır.** Mekanizma geri alınabilir, ad/şema/API sözleşmesi bırakmıyor, biriken veriyi yorumlamıyor — DECISIONS ölçütünü geçmiyor. Kalıcı değeri "bir daha aynı tuzağa düşme" olduğu için evi memory → Teknik Tuzaklar.

**Kalan İşler:**
- `RESEND_API_KEY` Vercel'de tanımlı değil — değeri yalnız kullanıcıda. TASK-1.06 (e-posta hattı) bunu ilk işi olarak ister; o task'a kadar `/api/demo` e-posta ayağı yayın ortamında sessiz kalır (dayanıklı kayıt da henüz yok, TASK-1.04).

**Dosya Değişiklikleri:**
- `next.config.ts` → `output` sabiti koşullu hâle geldi (`VERCEL` varsa varsayılan, yoksa `standalone`); gerekçe ve kırılma ölçümü dosya yorumunda.
- `_dev/GIT-STRATEJI.md` → dal tablosu "Ortam / Hedef", "Commit ve Push" (push artık dağıtım tetikler), "Yayın" (otomatik dağıtım var / yayın yok ayrımı), "Bu Projeye Özgü Notlar" (bağlantı kuruldu + push sonrası tek sinyal Vercel derlemesi).
- `_dev/phases/PHASE-1.md` → yeni "Ölçümler" bölümü (üç tablo), Task Listesi'nde 1.03 ✅.
- `_dev/MEMORY.md` + `_dev/memory/vercel-standalone-cikti-catismasi.md`, `_dev/memory/vercel-proje-kimlikleri.md` → iki yeni kayıt.

**Test Sonuçları:**
- **Yerel üretim derlemesi** (`docker compose exec web npm run build`, konteynerde): hatasız, 23 rota. Değişikliğin yerel ayağı ayrıca doğrulandı: `.next/standalone/server.js` hâlâ üretiliyor, yani Docker üretim imajı kırılmadı.
- **Yayın zinciri ölçümü** (9 kalem, `https://alpfitplus-web-v2.vercel.app` üzerinden curl ile): beş güvenlik başlığı + tek HSTS ✓, `X-Powered-By` yok ✓, `X-Robots-Tag: noindex, nofollow` hem `/` hem `/sitemap.xml`'de ✓, `robots.txt` tam `Disallow: /` ✓, HTML `meta robots` ✓, sekiz rota 200 ✓, font `immutable` ✓, `/api/demo` boş POST 422 ✓, `alpfitplus.com` (v1) hâlâ 200 ve başlıkları değişmemiş ✓. Kapsam: **yalnız üretim (önizleme) adresi**; dağıtım-özel `<proje>-<hash>` adresleri ve `/api/demo`'nun başarılı yolu ölçülmedi (hedef yok, TASK-1.04/1.06).
- **Kapı sınaması (ürettiğim kapı: koşullu `output`).** Bozuk girdi: kapının reddetmesi gereken hâl `VERCEL` tanımlıyken standalone üretmekti — bu hâl zaten **ölçüldü ve kırmızı görüldü** (ilk dağıtım, ENOENT), düzeltmeden sonra aynı kaynak yeşile döndü. Yani kırmızı ayak gerçek bir dağıtımda, kontrol grubu olarak duruyor. Boş kapsam ayağı bu kapıda yok: koşul bir taramadan değil tek bir env değişkeninden türüyor, boş küme hâli oluşmuyor.
- **Ölçüm betikleri koşulmadı** (a11y/mobile/font/scan/perf): bu task'ın değişikliği yalnız derleme çıktısı hedefini etkiliyor, işaretleme, metin, stil ve font kümesine dokunmadı; yerel derleme rota sayısıyla (23) doğrulandı. `perf.mjs` F7.4'ün kapanışına ait (analitik yükü ölçümü orada).

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-11

**Ne Yapıldı:**
- v2 kendi Vercel projesinde (`alpfitplus-web-v2`, takım `north-ai`, plan `hobby`) `https://alpfitplus-web-v2.vercel.app` adresinde ayakta; `main`'e push git kaynaklı dağıtım üretiyor. v1'in projesine ve `alpfitplus.com`'a dokunulmadı, v1 ölçülerek doğrulandı.
- Güvenlik başlıkları, noindex üç katmanı, font önbelleği ve `/api/demo`'nun ayakta olduğu yayın zinciri üzerinden ölçüldü; sonuçlar faz dokümanında.
- Vercel'in standalone çıktısıyla çalışmadığı keşfedildi ve `next.config.ts`'te koşullu hâle getirildi; Docker üretim imajı kırılmadı.
- GIT-STRATEJI kullanıcı onayıyla yeni gerçeğe hizalandı: otomatik dağıtım var, yayın hattı yok.

**Öğrenilenler:**
- CLI ile kurulan Vercel projesi panel akışının iki kolaylığını **vermiyor**: çerçeve tespiti yapılmıyor (`framework: null`) ve bu sessizce yanlış çıktı dizinine yol açıyor. Sistem env görünürlüğü ise varsayılan açık.
- "noindex açık" ile "aşama doğru türedi" aynı şey değil: `local` ve `preview` aşamalarının ikisinde de noindex kapalıdır, yani noindex ölçümü sistem env kutusunu **doğrulamaz**. Task dokümanının risk maddesi bu yönden eksikti; ayrımın kanıtı derlemenin kendisi oldu.

---

**Oluşturulma:** 2026-09-11
