# TASK-1.07: Umami kurulumu ve tracker bağlantısı

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.4: Analitik olay sayımı
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.03 ✅

---

## Hedef

Umami Cloud hesabını kurmak ve tracker scriptini siteye bağlamak: `next/script` ile `afterInteractive`, `data-website-id` env'den, `data-tag` aşama değerinden. Task, önizleme adresinde gezinilen sayfalar Umami panelinde `preview` etiketiyle göründüğünde tamamlanmış sayılır.

---

## Bağlam

v1'de olay sayımı vardı; v2'de hiçbir izleme yok (kickoff boşluğu). Sağlayıcı araştırmada seçildi: **Umami Cloud ücretsiz katman** — çerezsiz, script 4,7 KB (2,3 KB gzip, ölçüldü), `data-tag` ile ortam ayrımı, özel olay + özellik desteği.

Elenenler: Vercel Web Analytics (Hobby'de özel olay yok), Cloudflare (özel olay yok), PostHog (ağır + varsayılan çerezli), Plausible (ücretsiz plan yok — ikinci sırada, geçiş maliyeti düşük).

Çerezsiz ve kimlik tanımlamayan model rıza gerektirmez (KVKK) — bu, kapsam tartışmasının ölçütlerinden biriydi.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Analitik sağlayıcısı" ve "Umami yoksa sessiz geç"
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.4 kabul kriterleri
- `src/lib/stage.ts` — TASK-1.01'de yazılan okuma yüzeyi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [ ] **1. Umami hesabını kur** (kullanıcı)
  - cloud.umami.is → hesap → site eklenir (alan adı: `<proje>.vercel.app`; F7.5'te `alpfitplus.com` eklenir)
  - Website ID kopyalanır
  - Ücretsiz katman sınırları panelde teyit edilir (dış kaynaklarda 100k olay/ay, 3 site, 6 ay veri; resmi sayfa yalnız "Hobby ücretsiz" diyor) ve rakam Oturum Kaydı'na yazılır

- [ ] **2. Env değişkenini tanımlat**
  - `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — Vercel'de ve yerel `.env`'de; sır değil, istemciye gömülür
  - `.env.example`'a anahtar + açıklama eklenir, değer yazılmaz
  - Dosya: `.env.example`

- [ ] **3. Tracker'ı bağla**
  - `next/script`, `strategy="afterInteractive"`, `src="https://cloud.umami.is/script.js"`
  - `data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}`, `data-tag={DEPLOY_STAGE}`
  - Env tanımsızsa script **hiç render edilmez** (yerel geliştirmede gürültü yok)
  - `data-domains` **kullanılmaz** — önizlemede de saymalı
  - Dosya: `src/app/layout.tsx`

---

## Etkilenen Dosyalar

```
src/app/
└── layout.tsx            # Umami script etiketi — zaten var
./
└── .env.example          # NEXT_PUBLIC_UMAMI_WEBSITE_ID — zaten var
```

---

## Dikkat Noktaları

- **`afterInteractive` zorunlu** — LCP'yi geciktirmemeli. `beforeInteractive` kullanma.
- Umami **çerez koymaz, IP saklamaz**; rıza bandı gerekmez. Yasal metnin güncellenmesi ayrı task (TASK-1.10).
- Reklam engelleyici scripti keserse `window.umami` tanımsız kalır — bu beklenen ve kabul edilen hâl (kapsam kararı: eksik sayım kabul). Kod tarafında sessiz geçme TASK-1.08'de sarmalayıcıyla kurulur.
- CSP başlığı bugün yok; ek izin gerekmiyor. Ad blocker için rewrite-proxy kapsam dışı.
- Yeni npm bağımlılığı **yok**.
- Yük ölçümü bu task'ta değil TASK-1.09'da yapılır (olaylar da bağlandıktan sonra, tek ölçüm).

---

## Test Kriterleri

- [ ] Yerelde env tanımsızken sayfa kaynağında Umami script etiketi **yok**, konsol temiz (`scan.mjs` ile)
- [ ] Yerelde env tanımlıyken script etiketi var; `data-tag="local"`
- [ ] Önizleme adresinde script yükleniyor ve `data-tag="preview"`
- [ ] Önizlemede gezilen 3 sayfa Umami panelinde sayfa görüntülemesi olarak görünüyor ve `preview` etiketi taşıyor
- [ ] `docker compose exec web npm run build` hatasız geçer

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

**Oluşturulma:** 2026-09-11
