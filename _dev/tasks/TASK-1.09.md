# TASK-1.09: Global tıklama dinleyicisi ve yüzey etiketleri

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.4: Analitik olay sayımı
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.08 ✅

---

## Hedef

WhatsApp ve telefon tıklamalarını **tek** bir global dinleyiciyle saymak ve tıklamanın hangi yüzeyden geldiğini `data-surface` çapalarıyla belirlemek. Task, üç olayın üçü de panelde doğru yüzey etiketleriyle göründüğünde ve analitik yükü başlangıç çizgisine karşı ölçüldüğünde tamamlanmış sayılır.

---

## Bağlam

Ölçüldü: WhatsApp bağlantısı **15** yerde, telefon bağlantısı **5** yerde, toplam **12 dosya**. Her bağlantıya tek tek `data-umami-event` koymak bu yüzden elendi: ileride eklenen bir bağlantı işaretlenmezse sessizce sayılmaz ve fark edilmez.

Seçilen yol: layout'ta tek istemci bileşeni, `a[href^="https://wa.me"]` ve `a[href^="tel:"]` tıklamalarını yakalar; yüzeyi en yakın `[data-surface]` atasından, yoksa en yakın `section[id]`'den, o da yoksa sayfa yolundan türetir. Yeni eklenen her bağlantı otomatik sayılır — QUALITY 9'un "yeni yüzey ölçümüyle gelir" maddesi böyle yapısal olarak karşılanır.

Bu task fazın son analitik parçasıdır; F7.4'ün yük ölçümü kabul kriteri de burada kapanır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Yüzey sayımı — üç olay üç yüzey değil" (dosya listesi) ve "Analitik yükü ölçülür"
- `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar (başlangıç çizgisi)
- `src/lib/analytics.ts` — TASK-1.08'de yazılan sözlük

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle; `perf.mjs` ölçüm rakamları

---

## Alt Görevler

- [ ] **1. Dinleyici bileşenini yaz**
  - İstemci bileşeni; `document` üzerinde tek `click` dinleyicisi (capture değil, bubble; `passive`)
  - `event.target.closest("a")` → `href` `https://wa.me` ile başlıyorsa `whatsapp-click`, `tel:` ile başlıyorsa `phone-click`
  - Yüzey: en yakın `[data-surface]` atası → yoksa en yakın `section[id]` → yoksa sayfa yolundan türetilen ad
  - Sözlükte olmayan bir yüzey türerse olay yine gönderilir ama etiket bilinen bir yedeğe düşer (panelde çöp ad birikmesin)
  - Dosya: `src/components/layout/ClickTracker.tsx` (YENİ)

- [ ] **2. Layout'a bağla**
  - `<ClickTracker />` gövdeye eklenir (Umami script etiketinin yanına)
  - Dosya: `src/app/layout.tsx`

- [ ] **3. Yüzey çapalarını yerleştir**
  - `data-surface` eklenecek yüzeyler: `Hero`, `FinalCta`, `Footer`, `Header`, `Assistant`, `DemoForm`, `demo/page.tsx`, `destek/page.tsx`, `not-found.tsx`, `global-error.tsx`
  - Mevcut `<Section id=…>` kullananlara (`segmentler`, `sss`, `neden`, `roller`, `fiyat`, `moduller`, `fayda`) **dokunulmaz** — `section[id]` yedeği onları zaten karşılar
  - Öznitelik değerleri `src/lib/analytics.ts` sözlüğünden gelir, elle string yazılmaz

- [ ] **4. Analitik yükünü ölç**
  - Üretim konteyneri ayağa kaldırılır (`docker compose --profile prod up -d --build web-prod`), yerel `.env`'de Umami website id tanımlıyken `perf.mjs` koşturulur
  - Başlangıç çizgisiyle (ana sayfa 144 KB / 133 KB) kıyaslanır; artış, TTFB/FCP/LCP/CLS rakamlarıyla birlikte task ve faz dokümanına yazılır

---

## Etkilenen Dosyalar

```
src/components/layout/
├── ClickTracker.tsx      # YENİ — global tıklama dinleyicisi
├── Header.tsx            # data-surface="header" — zaten var
├── Footer.tsx            # data-surface="footer" — zaten var
└── Assistant.tsx         # data-surface="assistant" — zaten var
src/components/sections/
├── Hero.tsx              # data-surface="hero" — zaten var
├── FinalCta.tsx          # data-surface="final-cta" — zaten var
└── DemoForm.tsx          # data-surface="demo-form" — zaten var
src/app/
├── layout.tsx            # ClickTracker bağlanır — zaten var
├── demo/page.tsx         # data-surface="demo" — zaten var
├── destek/page.tsx       # data-surface="destek" — zaten var
├── not-found.tsx         # data-surface="404" — zaten var
└── global-error.tsx      # data-surface="404" — zaten var
```

> Dosya sayısı fazla ama 3. alt görevdeki değişiklikler tek satırlık öznitelik ekleridir ve dinleyiciden ayrılamaz: çapalar olmadan dinleyici yanlış yüzey etiketi üretir.

---

## Dikkat Noktaları

- **`global-error.tsx:72` WhatsApp adresini elle yazıyor** (`CONTACT.whatsapp.href` yerine) — tek-kaynak ihlali, Gelen Kutusu'nda kayıtlı, **bu fazda düzeltilmez**. Dinleyici href desenine baktığı için o bağlantı yine sayılır; ihlali bu task'ta çözmeye girişme.
- `global-error.tsx` kendi `<html>`/`<body>`'sini render eder — layout'taki `ClickTracker` orada **çalışmaz**. Bu bilinçli bir boşluktur: hata ekranındaki tıklama sayılmayabilir, olay kaybı ihmal edilebilir. `data-surface` yine de konur ki ileride kapsanırsa hazır olsun; kararı Oturum Kaydı'na yaz.
- WhatsApp bağlantılarının hepsi yeni sekmede açılıyor (`Button` `http` için `target="_blank"` veriyor), telefon `tel:` sayfayı terk etmez — **olay isteği kesilmez**, `sendBeacon` gerekmez.
- Bağlantıların tümü `CONTACT.whatsapp.href` / `CONTACT.phone.href` okuyor (`src/content/site.ts`) — tek istisna yukarıdaki `global-error.tsx`.
- Kişisel veri olaya girmez; yalnız yüzey adı gönderilir.
- Analitik yükü **CLS/LCP'yi bozmamalı** (M7 F7.4 edge case). Ölçüm rakamları kayda geçer, eşik aşılırsa kullanıcıya bildirilir.

---

## Test Kriterleri

- [ ] Yerelde Umami tanımsızken tüm WhatsApp/telefon bağlantıları normal çalışır, konsol temiz (`scan.mjs` ana sayfa + `/demo` + `/destek`)
- [ ] Önizlemede hero'daki WhatsApp tıklaması panelde `whatsapp-click` / `surface=hero` üretir
- [ ] Footer'daki telefon tıklaması `phone-click` / `surface=footer` üretir
- [ ] Fiyat bölümündeki (id'li `<Section>`) bir bağlantı `surface=fiyat` üretir — `section[id]` yedeği çalışıyor
- [ ] Üç olayın üçü de (`demo-submit` dâhil) panelde `preview` etiketiyle görünüyor
- [ ] `perf.mjs` üretim konteynerine karşı koşuyor; ana sayfa ağırlığı başlangıç çizgisiyle kıyaslanmış ve rakam yazılmış
- [ ] `a11y.mjs` TOPLAM SORUN: 0 ve `mobile-audit.mjs` yatay kaydırma: yok (öznitelik eklemeleri düzeni bozmadı)
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
