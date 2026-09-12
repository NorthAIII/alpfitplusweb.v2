# TASK-1.07: Kendi Umami'ye site kaydı ve tracker bağlantısı

**Durum:** ⬜ Bekliyor
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

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-11 · **Yeniden yazıldı:** 2026-09-13 (plan revizyonu — kendi Umami, ağaçtaki yarım işi devralır)
