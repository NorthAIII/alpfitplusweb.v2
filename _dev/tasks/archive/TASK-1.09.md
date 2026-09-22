# TASK-1.09: Global tıklama dinleyicisi ve yüzey etiketleri

**Durum:** ✅ Tamamlandı
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

- [x] **1. Dinleyici bileşenini yaz**
  - İstemci bileşeni; `document` üzerinde tek `click` dinleyicisi (capture değil, bubble; `passive`)
  - `event.target.closest("a")` → `href` `https://wa.me` ile başlıyorsa `whatsapp`, `tel:` ile başlıyorsa `phone` (`src/lib/analytics.ts` → `EVENTS`, v1 hizası — `docs/DECISIONS.md` 2026-09-22)
  - Yüzey: en yakın `[data-surface]` atası → yoksa en yakın `section[id]` → yoksa sayfa yolundan türetilen ad
  - Sözlükte olmayan bir yüzey türerse olay yine gönderilir ama etiket bilinen bir yedeğe düşer (panelde çöp ad birikmesin)
  - Dosya: `src/components/layout/ClickTracker.tsx` (YENİ)

- [x] **2. Layout'a bağla**
  - `<ClickTracker />` gövdeye eklenir (Umami script etiketinin yanına)
  - Dosya: `src/app/layout.tsx`

- [x] **3. Yüzey çapalarını yerleştir**
  - `data-surface` eklenecek yüzeyler: `Hero`, `FinalCta`, `Footer`, `Header`, `Assistant`, `DemoForm`, `demo/page.tsx`, `destek/page.tsx`, `not-found.tsx`, `global-error.tsx`
  - Mevcut `<Section id=…>` kullananlara (`segmentler`, `sss`, `neden`, `roller`, `fiyat`, `moduller`, `fayda`) **dokunulmaz** — `section[id]` yedeği onları zaten karşılar
  - Öznitelik değerleri `src/lib/analytics.ts` sözlüğünden gelir, elle string yazılmaz

- [x] **4. Analitik yükünü ölç**
  - Üretim konteyneri ayağa kaldırılır (`docker compose --profile prod up -d --build web-prod`), yerel `.env`'de Umami website id tanımlıyken `perf.mjs` koşturulur
  - Başlangıç çizgisiyle (ana sayfa 144 KB / 133 KB) kıyaslanır; artış, TTFB/FCP/LCP/CLS rakamlarıyla birlikte task ve faz dokümanına yazılır
  - **B-035:** `perf.mjs` ağırlık muhasebesi JS ve CSS'e kör, 144 KB çizgisi geçersiz. Bu yüzden Umami betiğinin ve olay isteğinin aktarım boyutu ağ yanıtından (tarayıcı ağ kaydı) **ayrıca** ölçülür ve iki kaynak ayrı yazılır. B-035 bu task'ta düzeltilmez

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

- [x] Yerelde Umami tanımsızken tüm WhatsApp/telefon bağlantıları normal çalışır, konsol temiz (`scan.mjs` ana sayfa + `/demo` + `/destek`)
- [ ] Önizlemede hero'daki WhatsApp tıklaması panelde `whatsapp` / `surface=hero` üretir — kanal: UAT
- [ ] Footer'daki telefon tıklaması `phone` / `surface=footer` üretir — kanal: UAT (panel gözlemi ister, `scan.mjs`/`a11y.mjs` kapsamayan bir katman)
- [ ] Fiyat bölümündeki (id'li `<Section>`) bir bağlantı `surface=fiyat` üretir — `section[id]` yedeği çalışıyor — kanal: UAT (aynı gerekçe)
- [ ] Üç olayın üçü de (`demo-submit` dâhil) panelde `preview` etiketiyle görünüyor — kanal: UAT
- [x] `perf.mjs` üretim konteynerine karşı koşuyor; ana sayfa ağırlığı başlangıç çizgisiyle kıyaslanmış ve rakam yazılmış — B-035 kapsam notuyla (Test Sonuçları'nda rakamlar)
- [x] Umami betiği (`umami.kiwiailab.com/script.js`) ve bir olay isteğinin aktarım boyutu tarayıcı ağ kaydından ayrıca ölçülmüş ve yazılmış (Test Sonuçları'nda rakamlar)
- [x] `a11y.mjs` TOPLAM SORUN: 0 ve `mobile-audit.mjs` yatay kaydırma: yok (öznitelik eklemeleri düzeni bozmadı)
- [x] `docker compose exec web npm run build` hatasız geçer

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı — **dördü hariç**: panelde yüzey etiketlerinin (`hero`/`footer`/`fiyat`) ve üçüncü olayın görünmesi UAT'a kaldı (kod tarafı ölçüldü: gerçek website id'li izole konteynerde uçtan uca `whatsapp` olayı `/api/send` `200` ile gönderildi, panel gözü UAT'ın işi)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-22

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Ön-düzeltme (koşum devri):** `tasks/TASK-1.09.md` ve `phases/PHASE-1-ARASTIRMA.md` kod yazımından önce v1 hizasına (`whatsapp`/`phone`, `docs/DECISIONS.md` 2026-09-22) çekildi; `BULGULAR.md` Gelen Kutusu'ndaki ilgili satır mezun edildi, yerine `PHASE-1.md:123`'ün kendi özetinin (run-task yetkisi dışında kaldığı için) kapsam dışı bırakıldığını işaretleyen yeni bir satır düşüldü.
- `src/components/layout/ClickTracker.tsx` (YENİ): tek `document` `click` dinleyicisi (bubble + `passive`), `closest("a")` ile `wa.me`/`tel:` desenini yakalıyor; yüzeyi `[data-surface]` → `section[id]` → sayfa yolu sırasıyla türetip sözlükte yoksa `SURFACES.other`'a düşürüyor (test edildi). `resolveSurface` test edilebilir olsun diye export edildi.
- `src/lib/analytics.ts`: `SURFACES` sözlüğüne `other` (ClickTracker'ın bilinmeyen türetimler için yedeği) eklendi.
- `src/app/layout.tsx`: `<ClickTracker />` gövdeye, Umami `<Script>` etiketinin hemen üstüne bağlandı.
- `data-surface` çapaları on dosyaya yerleştirildi (Alt Görev 3 listesindeki hepsi): `Header.tsx` (`header`), `Footer.tsx` (`footer`), `Assistant.tsx` (`assistant`, iki üst-seviye döndürülen `div`'in ikisine de — bileşen bir Fragment döndürüyor, tek kök yok), `Hero.tsx` (`hero`), `FinalCta.tsx` (`final-cta`), `DemoForm.tsx` (`demo-form`, hem başarı ekranına hem `<form>`'a — iki farklı döndürülen kök var), `demo/page.tsx` ve `destek/page.tsx` (`demo`/`destek`, paylaşılan `ui/Section` bileşeni rastgele prop taşımadığı için doğrudan Section'a değil onun içindeki iç `div`'e kondu — `Section.tsx`'e dokunulmadı, kapsam dışıydı), `not-found.tsx` (`404`), `global-error.tsx` (`404`, ama Dikkat Noktaları'nın söylediği gibi `ClickTracker` kök layout'un parçası olduğu için orada hiç çalışmıyor — bilinçli boşluk, sadece ileriye hazırlık).
- `tests/click-tracker.test.ts` (YENİ): `resolveSurface`'i sahte `Element`/`window` ile 5 senaryoda sınıyor (data-surface önceliği, section[id] yedeği, yol yedeği, iki ayrı kaynaktan gelen bilinmeyen değerin `other`'a düşmesi).

**Sorunlar:**
- Perf ölçümü için `.env`'e gerçek Umami website id yazmak MEMORY'nin ("Umami bağlı" notu) yasakladığı bir şeydi (dev sunucusunu sürekli panele saydırır). Çözüm: `_dev/memory/alternatif-env-ile-uretim-derlemesi.md`'nin "dev sunucusuna ve repoya hiç dokunmayan yol"unu izleyip scratchpad'e rsync edilmiş bir kopyada, tek seferlik `-e NEXT_PUBLIC_UMAMI_WEBSITE_ID=…` ile izole bir konteyner (port 3200) açtım; ölçüm bitince `docker rm -f` ile silindi, port boşluğu pozitif kontrolle doğrulandı.
- `performance.getEntriesByType("resource")`'ın `transferSize`'ı `umami.kiwiailab.com` çapraz-kökenli olduğu (`Timing-Allow-Origin` yok) için 0 döndü. CDP `Network.loadingFinished` → `encodedDataLength`'e geçtim, gerçek tel-üzeri bayt oradan geldi.

**Kararlar:**
- İzole konteynerdeki tek tıklama, 1440 px masaüstü görünümünde DOM sırasında **Header**'ın WhatsApp bağlantısına denk geldi (`a[href^="https://wa.me"]` seçicisinin ilk eşleşmesi) — `hero` değil. Bu, uçtan uca ileti + bayt ölçümü için yeterliydi (asıl amaç); hangi yüzeyin paneli doğru etiketlediğinin görsel teyidi hâlâ UAT'ın işi, bu ölçüm onun yerine geçmez.
- `docs/DECISIONS.md`'ye yeni kayıt düşülmedi — bu turda mimari bir karar yok, TASK-1.08'in 2026-09-22 kaydının açık kalemi kapatıldı.

**Test Sonuçları:**
- `docker compose exec web npx tsc --noEmit` — 0 hata.
- `docker compose exec web npm test` — **5 dosya / 61 PASS + 1 skipped** (TASK-1.08 tabanı 4 dosya/56+1 idi; yeni `tests/click-tracker.test.ts` 5/5).
- `docker compose exec web npm run build` — 23 rota, hatasız; ardından ihtiyaten `docker compose restart web` (memory: `alternatif-env-ile-uretim-derlemesi.md`), dev `/` 200 ile geri geldi.
- `docker compose --profile prod up -d --build web-prod` — 23 rota, hatasız; `/`, `/demo`, `/destek` 200.
- `a11y.mjs` (8 sayfa) — **TOPLAM SORUN: 0**.
- `mobile-audit.mjs` (10 sayfa) — **yatay kaydırma: yok** (hepsinde); küçük dokunma hedefi **157** — TASK-1.09 öncesi de bilinen bir sayı (`audit-product SORU`, `BULGULAR.md`), bu turda regresyon yaratmadı, değişmedi.
- `scan.mjs` — ana sayfa (26.399 px, 20 kare), `/demo` (4.412 px, 6 kare), `/destek` (3.562 px, 5 kare) — üçü de **konsol temiz**.
- `font-guard.mjs` — 153 karakterlik küme, 16 sayfa, 79.685 karakter tarandı — **kümede olmayan karakter yok**.
- `perf.mjs` (üretim konteyneri 3100, Umami tanımsız — bu haliyle baseline'ın devamı): ana sayfa masaüstü **144 KB** / mobil **133 KB** (başlangıç çizgisiyle **birebir aynı** — B-035'in "144 KB rakamı JS/CSS'e kör" uyarısı geçerliliğini korur, kıyas yalnız `perf.mjs`'in ölçtüğü aynı-yöntemli rakamlar arasında anlamlı). LCP masaüstü 96 ms (baseline: 96 ms), CLS 0,005 (baseline: 0–0,005) — **regresyon yok**.
- Umami betiği + olay isteği ağırlığı (B-035 kapsam notu — CDP `encodedDataLength`, gerçek website id'li izole konteyner, port 3200, gerçek Chrome UA — B-056 (b) sahte-yeşilini önlemek için): `script.js` **2,56 KB** (gzip, tel üzerinde) — araştırma turunun 2,3 KB'ına ve TASK-1.07'nin ~2,2 KB'ına yakın (sürüm farkı olağan). Bir olay isteği (`/api/send`, POST) **0,74 KB** (gzip, tel üzerinde); bir OPTIONS ön-uçuşu (CORS preflight, yalnız ilk istekte) 0 B. İki `/api/send` isteği görüldü — biri Umami'nin otomatik sayfa görüntüleme olayı, biri `track()`'in gönderdiği `whatsapp` olayı; ikisi de aynı boyutta (gövde küçük ve sabit alan sayısı aynı).

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-22

**Ne Yapıldı:**
- Global tıklama dinleyicisi (`ClickTracker.tsx`) yazıldı ve layout'a bağlandı; 12 dosyadaki 20 WhatsApp/telefon bağlantısını tek noktadan, `data-surface` çapalarından türeyen yüzey etiketiyle sayıyor.
- On dosyaya `data-surface` çapası kondu (Alt Görev 3'ün tam listesi); `SURFACES` sözlüğüne bilinmeyen türetimler için `other` yedeği eklendi.
- Analitik yükü hem `perf.mjs` (regresyon yok, baseline'la birebir) hem CDP ağ kaydı (Umami betiği 2,56 KB gzip, bir olay isteği 0,74 KB gzip) ile ayrıca ölçüldü (B-035 kapsam notuyla).
- F7.4'ün üç kabul kriterinden ikisi (yük ölçümü, çerezsiz model) bu task ile kapandı; üçüncüsü (panelde görünürlük) daima UAT'ın işiydi ve öyle kaldı.

**Öğrenilenler:**
- `Resource Timing API`'nin `transferSize`'ı çapraz-kökenli kaynaklarda (`Timing-Allow-Origin` yoksa) sessizce 0 döner — gerçek bayt için CDP `Network.loadingFinished` → `encodedDataLength` gerekiyor. Proje-geneli bir tuzak olarak MEMORY'ye yazılmadı çünkü tek seferlik bir ölçüm betiğine özgü (faz retrosuna aday).
- Paylaşılan `ui/Section` bileşeni ek prop'ları forward etmiyor; `data-surface` gibi bir özniteliği geçirmek gerektiğinde bileşene değil onun döndürdüğü içeriğin en dış öğesine konmalı — `closest()` tabanlı çözümleme için eşdeğer, dosya sayısını artırmadan yeterli.

---

**Oluşturulma:** 2026-09-11
