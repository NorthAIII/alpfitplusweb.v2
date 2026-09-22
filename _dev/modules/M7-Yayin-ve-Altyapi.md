# M7: Yayın ve Altyapı

**Sorumluluk:** Siteyi çalıştırmak ve yayınlamak: Docker, Vercel (v2 için **ayrı** proje), env/sır yönetimi, güvenlik başlıkları, sitemap/robots, alan adı geçişi ve 301 haritası, analitik.
**Bağımlılık:** M6 (yayın öncesi kapılar yeşil olmalı)
**Sınır:** Ortam ve yayın. Uygulama kodu M2–M4. **v1'in Vercel projesi `alpfitplus-website` dokunulmazdır**; alan adı geçişinde arşivlenir, silinmez.

---

## Feature'lar

### F7.1: Docker çalışma ortamı → Phase —

**Açıklama:** `web` (dev, 3000), `web-prod` (standalone imaj, 3100), `research` (Playwright + Chromium + sharp, host ağı). Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- `docker compose up -d web` → 3000'de site; `--profile prod` → 3100'de üretim imajı
- `npm run build` konteynerde geçer, 23 rota

**Bağımlılık:** Yok

**Edge Case'ler:**
- Yeni rota klasörü → `docker compose restart web` (Turbopack bind-mount'ta yeni dizini yakalamaz)
- Port 3001 makinede başka projede — kullanılmaz
- `web-prod`'un env'i **bilinçlidir ve hedefsizdir** (TASK-2.02, B-058): üç kayıt yolunun baş anahtarı compose'da açıkça boş, uç geçerli talebe `503 no-sink` veriyor — 3100'e bakan ölçüm turları hiçbir depoya yazmaz. `.env` imaja girmez (`.dockerignore`); gerçek depo provası `--profile lead` + `http://lead-store:8090` ile açılır

---

### F7.2: Güvenlik başlıkları, sitemap, robots → Phase —

**Açıklama:** `next.config.ts` başlıkları uygulamadan gönderir (v1 denetimi D-14: platform dışında hiçbir başlık gitmiyordu); `/fonts` immutable, `/product` uzun max-age + revalidate; `sitemap.ts`, `robots.ts`. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Her yanıtta `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS
- Sitemap 16 sayfayı listeler, 404 ve API dışarıda
- Başlıklar Vercel üzerinden de gidiyor (serving zinciri soymuyor) — F7.3'te doğrulanır

**Bağımlılık:** Yok

**Edge Case'ler:**
- `poweredByHeader: false`; Vercel kendi başlıklarını ekler, çakışma F7.3'te ölçülür

---

### F7.3: Vercel'de ayrı proje ve önizleme yayını → Phase 1

**Açıklama:** vercel.com/new → repoyu içe aktar (kullanıcı eylemi; CLI kurulamadı, gerek de yok). Env değişkenleri (lead hedefi, e-posta, ileride model anahtarı) Vercel'de tanımlanır. "Önizleme yayını, lead hattı ve analitik" faz konusu.

**Kabul Kriterleri:**
- v2 önizleme adresinde ayakta; v1 projesine ve `alpfitplus.com`'a **dokunulmadı**
- Güvenlik başlıkları önizleme adresinde ölçüldü
- Env değerleri repoda yok; `.env.example` güncel
- `main`'e push önizlemeyi günceller (üretim alan adı F7.5'e kadar bağlanmaz)

**Bağımlılık:** M6 F6.1 yeşil

**Edge Case'ler:**
- Vercel'de kalıcı disk yok → `LEAD_FILE_PATH` çalışmaz; M3 F3.2 birincil hedef olarak **depoyu** (`LEAD_STORE_URL`) ister
- Önizleme adresi arama motoruna açılmamalı — **karar: açık adres + üç katmanlı `noindex`** (başlık + `robots.txt` + meta, hepsi `deployStage`'den), Vercel koruması kullanılmaz (`phases/PHASE-1-KAPSAM.md`)

---

### F7.4: Analitik olay sayımı → Phase 1

**Açıklama:** v1'de olay sayımı vardı; v2'de hiçbir izleme yok (kickoff boşluğu). Demo gönderimi, WhatsApp ve telefon tıklaması **yüzey etiketiyle** (hero, fiyat, footer, asistan…) sayılır. Sağlayıcı **kendi Umami kurulumumuz** (`umami.kiwiailab.com`), çerezsiz — seçim ve KVKK değerlendirmesi `docs/DECISIONS.md` 2026-09-13; olay adları v1 hizalı (`demo-submit`/`whatsapp`/`phone`), ortam ayrımı `data-tag={deployStage}`. Faz 1'de kapandı.

**Kabul Kriterleri:**
- Üç olay (demo gönderimi, WhatsApp tıklama, telefon tıklama) yüzey etiketiyle sağlayıcı panelinde görünür — **karşılandı:** olay/yüzey/ortam-etiketi kırılımı panelin kendi okuma API'siyle canlıda ölçüldü (`phases/PHASE-1-UAT.md` #11-15); panel **arayüzünün** gözle görülmesi kullanıcı gözüne kaldı (#16)
- Çerezsiz ya da rıza gerektirmeyen model tercih edilir; gerekiyorsa yasal metin güncellenir (M1)
- Sayfa ağırlığı artışı ölçüldü, eşik `perf.mjs`'te

**Bağımlılık:** F7.3

**Edge Case'ler:**
- Reklam engelleyici izlemeyi keser — sayılar eksik olabilir, bilinerek kabul edilir
- Analitik yükü CLS/LCP'yi bozmamalı

---

### F7.5: Alan adı geçişi ve 301 haritası → Phase —

**Açıklama:** `alpfitplus.com` v2'ye bağlanır; v1'in 20 adresi (10 TR + 10 `/en/*`) 301 ile karşılığına gider; v1 projesi arşivde, silinmez; sitemap ve canonical tutarlı. "Alan adı geçişi" faz konusu, v2.0'ın sonu.

**Kabul Kriterleri:**
- 20 adresin hepsi ölçülerek 301 döner ve hedefi 200'dür (tablo faz dokümanına)
- `/en/*` → Türkçe karşılığı: `/en/`→`/`, `/en/features`→`/ozellikler`, `/en/pricing`→`/fiyat`, `/en/segments`→`/segmentler`, `/en/demo`→`/demo`, `/en/support`→`/destek`, `/en/kvkk`→`/kvkk`, `/en/privacy`→`/gizlilik`, `/en/terms`→`/kullanim-kosullari`, `/en/404`→404
- Canonical `https://alpfitplus.com/...`, sitemap aynı alan adı
- `DEMO_FROM` alan adı e-posta sağlayıcısında doğrulanmış
- v1 Vercel projesi alan adından ayrıldı ama proje duruyor

**Bağımlılık:** F7.3, F7.4, M6 F6.3 yeşil, M3 F3.2–F3.3 çalışıyor

**Edge Case'ler:**
- TR adresler v2'de aynı yolda (`/demo`, `/fiyat`…) — 301 gerekmez ama ölçülür
- Geri dönüş: DNS'i v1 projesine geri çevirmek; `GIT-STRATEJI.md` (kickoff-verify'da doğar) geri dönüş yönünü yazar
- **Env taşıma — Production'da üç değer değişir** (bugün önizlemeye göre kurulu):
  - `LEAD_STORE_TOKEN` → canlı depodaki üretim token'ı. Unutulursa geçişten sonra gerçek talepler `leads_preview`'a düşer ve API bunu söylemez (`201` iki koleksiyonda aynı).
  - `IP_HASH_SALT` → v1'in değeri, `ip_hash` sürekliliği için (TASK-1.18 Karar Noktası).
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` → v1'in `alpfitplus.com` kaydı (`docs/DECISIONS.md` 2026-09-14 «Umami site kaydı»).

---

## Teknik Notlar

- Vercel varsayılanları: Node.js runtime (Fluid Compute), Edge kullanılmaz; `output: "standalone"` Docker için, Vercel kendi derlemesini yapar.
- Analitik ve lead hedefi kararları `docs/DECISIONS.md`'ye yazılır.
