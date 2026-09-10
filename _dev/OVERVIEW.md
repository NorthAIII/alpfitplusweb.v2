# Alpfit Plus Web Sitesi v2 — Proje Özeti

**Proje Sahibi:** Kıvanç / Kiwi AI Lab
**Başlangıç Tarihi:** 2026-09-09 (ilk commit) · DevFlow kickoff 2026-09-11

---

## Bu Doküman Hakkında

**OVERVIEW.md** projenin genel referans dokümanıdır. Her oturum başında mutlaka okunmalıdır. **Yalnızca statik bilgi** içerir — proje kimliği, stack, amaç, kapsam. Dinamik bilgi (aktif faz/task, ilerleme, faz numarası, durum) buraya **yazılmaz**; onların evi DURUM.md'dir. OVERVIEW yalnızca daha genel değişikliklerde (vizyon, stack, kapsam) güncellenir — nadiren.

**Not:** Bu dosya projenin kendi README.md'si değildir. Bu, DevFlow geliştirme sürecine yönelik bir özettir ve `_dev/` klasöründe yaşar.

---

## Proje Özeti

### Ne Yapıyor?
`alpfitplus.com` için sıfırdan yazılan tanıtım sitesi. Alpfit Plus, Kiwi AI Lab'ın spor kulüpleri için geliştirdiği B2B yönetim yazılımıdır; site bu ürünü anlatır ve ziyaretçiyi tek bir huniye (demo talebi) götürür. Canlı sitenin (v1, Astro) yerine geçecek; v1'den **bağımsız** bir repodur.

### Hangi Problemi Çözüyor?
v1 sitesi denetimlerde gösterdi ki lead tek e-posta sağlayıcısına bağlıydı ve kayboluyordu, ürün görselleri eski markayı taşıyordu, iddialar satış dosyasıyla hizalı değildi. v2 bunları baştan çözer: dayanıklı lead kaydı, üretilen ve denetlenen ürün görselleri, tek kaynaktan gelen iddia ve fiyat.

### Hedef Kitle
Türkiye'deki butik spor kulübü sahipleri. Dört segment: reformer/pilates, boks/dövüş, CrossFit, çok şubeli zincir. Satın alma komitesi değil, salonun sahibi — metin tonu buna göre kurulur.

### Kapsam
**Dahil:** Tek dilli (Türkçe) tanıtım sitesi; ürün, fiyat, segment, geçiş ve rehber sayfaları; demo talep formu ve WhatsApp yedeği; site asistanı (hazır akış, sonra Claude); yasal metinler; ürün görseli ve fotoğraf üretim hattı; ölçüm betikleri; Vercel'de **ayrı** proje olarak yayın ve alan adı geçişi.
**Dahil değil:** İkinci dil, web sitesi hizmeti, katmanlı paket, sayı sayma animasyonlu istatistik bandı (pilot rakamı yok), self-servis kayıt/ödeme, blog/changelog (pilot sonucuna kadar). Gerekçeler `docs/DECISIONS.md`.

---

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Backend | Next.js route handler (`/api/demo`; ileride `/api/chat`), Node.js runtime |
| Veritabanı | Yok — lead kaydı webhook veya JSONL dosyası (`LEAD_WEBHOOK_URL` / `LEAD_FILE_PATH`) |
| Styling | Tailwind CSS 4 (CSS-first `@theme`), lucide-react |
| Deployment | Docker Compose (yerel), Vercel (hedef; v2 için ayrı proje) |
| Diğer | Sora + Inter self-host daraltılmış font; Playwright + sharp araştırma konteyneri |

**Detaylar:** Ayrı TECH-STACK yazılmadı — yığın ve çalıştırma komutları repo kökündeki `README.md`'de.

---

## Temel Özellikler

- 16 sayfa, 23 rota: ana sayfa, özellikler, fiyat, segmentler + 4 segment sayfası, geçiş, yazılım seçerken, demo, destek, 3 yasal metin, 404
- Şube sayısına göre canlı fiyat hesaplayıcı; fiyat tek kaynaktan (`src/content/pricing.ts`)
- Yapışkan kaydırmalı ürün turu; görseller `render-product.mjs` ile üretilir ve denetlenir
- Demo talep ucu: önce dayanıklı kayıt, sonra e-posta; hedef yoksa dürüst 503 ve WhatsApp yönlendirmesi
- Site asistanı: bugün `src/content/chat.ts` karar ağacından cevaplıyor, ileride Claude'a bağlanacak
- Beş ölçüm betiği (a11y, mobil, font, perf, tarama) — bugün elle koşuyor

**Detaylar:** `MODULE-MAP.md` (modül ve feature haritası), `modules/` (modül detayları)

---

## Kaynak Kod Yapısı

```
src/
├── app/            # rotalar (App Router), globals.css (@theme tokenları), api/demo
├── components/
│   ├── ui/         # Button, Card, Container, Section, Reveal, Frames, Icon
│   ├── layout/     # Header, Footer, Logo, KiwiBand, Assistant
│   └── sections/   # 22 sayfa bölümü (Hero, Chaos, ProductStory, PricingBlock, DemoForm...)
├── content/        # tüm metin, fiyat, segment, SSS, yasal, chat ağacı — tek kaynak
└── lib/            # cn()
public/
├── product/        # üretilen ürün ekran görüntüleri (elle konmaz)
├── foto/           # Pexels lisanslı fotoğraflar (photos-build.mjs)
└── fonts/          # daraltılmış Sora + Inter (5 dosya, 95 KB)
research/
├── scripts/        # ölçüm ve üretim betikleri (a11y, mobile-audit, font-guard, perf, scan, render-product...)
├── lib/            # temizlik tabloları
└── *.txt           # font karakter kümesi, fotoğraf kaynakları
```

---

## Proje Konumları

| Açıklama | Yol |
|----------|-----|
| Repo Kökü | `/home/kivanc/projects/Alpfitplus website.v2` |
| Uzak repo | github.com/NorthAIII/alpfitplusweb.v2 (özel) |
| DevFlow Dokümanları | `/home/kivanc/projects/Alpfitplus website.v2/_dev/` |
| Kaynak Kod | `/home/kivanc/projects/Alpfitplus website.v2/src/` |
| Çalışan Uygulama | Geliştirme `http://localhost:3000` · üretim imajı `http://localhost:3100` (3001 başka projede) |
| Canlı site (v1, **salt okunur**) | `../Alpfitplus-website.v1` — Vercel projesi `alpfitplus-website` |
| Ürün kodu (**salt okunur**) | `../Alpfit.v1` — demo ekranları buradan render edilir |
| Satış ve rekabet dosyaları (**salt okunur**) | `../alpfit-plus-satis` — iddia ve fiyat sınırlarının kaynağı |

---

## Doküman Yapısı

```
_dev/
├── claude/            # Kök CLAUDE.md doktrin çocukları (bölünmüşse; parent'a @import edilir)
├── OVERVIEW.md        # Bu dosya
├── ILKELER.md         # Proje ilkeleri (yön/öncelik — karar fazlarında okunur)
├── INDEX.md           # Navigasyon haritası
├── DURUM.md           # Canlı dashboard
├── GIT-STRATEJI.md    # Dal modeli, çalışma/yayın dalı, yayın rotası (kickoff-verify'da doğar)
├── MEMORY.md          # Proje hafızası index'i
├── memory/            # Öğrenim dosyaları (ilk öğrenimde oluşur, lazy-load)
├── BULGULAR.md        # Proje sorun kanvası index'i
├── bulgular/          # Bulgu atomları + archive/
├── MODULE-MAP.md      # Modül/feature haritası (özet)
├── PHASES.md          # Faz durum özeti + sıradaki fazlar
├── QUALITY.md         # Kalite eksenleri
│
├── modules/           # Modül detay dokümanları (M1–M7)
├── phases/            # Faz dokümanları (her faz ayrı)
├── docs/              # STYLE-GUIDE, CLAIMS, DECISIONS
└── tasks/             # Task dokümanları ve arşiv
```

CLAUDE.md repo kökündedir (`/CLAUDE.md`).

---

> Operasyonel talimatlar (oturum başlangıç protokolü, task tamamlama sırası, numaralama) burada tekrarlanmaz — onların evi CLAUDE.md'dir. OVERVIEW yalnızca proje kimliğini taşır; tekrar = drift kaynağı.
