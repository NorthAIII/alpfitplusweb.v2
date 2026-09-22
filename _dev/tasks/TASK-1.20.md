# TASK-1.20: Üç yasal sayfa noindex'in üçüncü katmanını eziyor (B-041)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.3: Vercel'de ayrı proje ve önizleme yayını
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.02 ✅ (üç katmanı kuran task)

---

## Hedef

`/kvkk`, `/gizlilik` ve `/kullanim-kosullari` sayfalarının HTML `robots` meta etiketini, diğer 12 sayfa gibi **aşama türetiminden** beslemek. Üçü bugün `page.tsx:9`'da sabit `robots: { index: true, follow: true }` yazıyor ve canlı önizlemede `index, follow` servis ediliyor.

Task, 16 rotanın 16'sında HTML meta etiketi aşamaya göre doğru değeri gösterdiğinde ve üretim simülasyonunda üçü birden `index, follow`'a döndüğünde tamamlanmış sayılır. Kapanışta B-041 arşive alınır.

---

## Bağlam

**Bulgu B-041** (audit-product, 2026-09-12) verify-phase UAT'ında **canlı önizlemede yeniden ölçüldü** (2026-09-22, Senaryo #33): 16 rotanın 12'si `noindex, nofollow`, üç yasal sayfa `index, follow`, 404 `noindex`.

`next.config.ts`'in kendi dosya yorumu kuralı yazıyor: *"üç katman tek koşuldan okur, iki ayrı yerde iki koşul drift'tir."* Üç yasal sayfa o koşulu atlayıp sabit değer yazdığı için değişmez delinmiş durumda.

**Pratik açık bugün yok** — `X-Robots-Tag` başlığı 16/16 rotada ve `robots.txt` tam `Disallow: /` olduğu için arama motoru bu sayfaları yine almaz. Düzeltmenin değeri iki yönlü: (1) fazın kendi "üç katman tek kaynaktan" değişmezi gerçek olur, (2) alan adı geçişinde (M7 F7.5) başlık kalktığında üç sayfa kendiliğinden doğru davranır — bugün de doğru görünüyor olmaları rastlantıdır, koşuldan gelmiyorlar.

Değişmezin **tüm çağrı siteleri sayıldı**: `robots:` anahtarını kök `layout.tsx` dışında yazan yalnız bu üç dosya var (`grep -rn "robots" src/app/*/page.tsx src/lib/*.ts`). Sınıf kapalı, dördüncü bir site yok.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-041-yasal-sayfalar-noindex-eziyor.md` — bulgunun kanıtı ve kök neden yönü
- `_dev/tasks/archive/TASK-1.02.md` → Test Sonuçları — dört ortam senaryosu tablosu (aynı düzenek burada tekrarlanır)
- `src/app/layout.tsx` → `isPublished` ve `metadata.robots` — doğru desen burada
- `src/lib/stage.ts` → `DEPLOY_STAGE`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle; UAT satır 2 ve 33 yeniden koşulur
- `_dev/BULGULAR.md` + `_dev/bulgular/B-041-*.md` — çözüm teyidinde Çözüm Kaydı, `✅ Çözüldü`, arşive taşıma, index satırının silinmesi

---

## Alt Görevler

- [ ] **1. Üç sayfada sabit değeri aşama türetimine bağla**
  - `robots: { index: true, follow: true }` → kök `layout.tsx`'teki `isPublished` desenine eşdeğer bir değer
  - **Tercih edilen yol:** sayfa metadata'sından `robots` anahtarını **tamamen kaldır** — Next.js kök layout'un `metadata.robots` değerini zaten devralır, yani ikinci bir koşul hiç doğmaz (drift kaynağını kaldırmak, ikinci bir kopya yazmaktan üstün). Devralmanın gerçekten çalıştığı ölçülerek doğrulanır; çalışmıyorsa `DEPLOY_STAGE`'den türeyen açık değer yazılır
  - Dosyalar: `src/app/kvkk/page.tsx`, `src/app/gizlilik/page.tsx`, `src/app/kullanim-kosullari/page.tsx`

- [ ] **2. Kapıyı dört ortam senaryosunda sına** (TASK-1.02 düzeneği)
  - Yerel (`local`) · üretim simülasyonu (gerçek alan adı) · **ara hâl** (`VERCEL_ENV=production` + `.vercel.app`) · alan adı env'i tanımsız
  - Ölçüm **serving katmanında** (gerçek HTML yanıtı), saf fonksiyon düzeyinde değil

- [ ] **3. Bulgu kapanışını hazırla**
  - B-041 atomuna Çözüm Kaydı yazılır (kapanış kapsamıyla: hangi rotalar, hangi katman), Durum `✅ Çözüldü`, atom `bulgular/archive/`e taşınır (düz `mv`), index satırı silinir

---

## Etkilenen Dosyalar

```
src/app/
├── kvkk/page.tsx                  # sabit robots kalkar — zaten var
├── gizlilik/page.tsx              # sabit robots kalkar — zaten var
└── kullanim-kosullari/page.tsx    # sabit robots kalkar — zaten var
```

---

## Dikkat Noktaları

- **Ters yönde hata pahalıdır:** koşul yanlış yazılırsa alan adı bağlandığı gün bu üç sayfa indekslenmez ve fark edilmesi haftalar alır. Üretim senaryosu ölçülmeden kapatma.
- **İkinci bir koşul yazma.** Üç dosyaya `DEPLOY_STAGE === "production"` kopyalamak bugünkü drift'i üçe katlar; tercih devralmadır (Alt Görev 1).
- **Başlık ve `robots.txt` katmanlarına dokunma** — ikisi de doğru çalışıyor, ölçüldü (16/16 rota).
- `/bu-sayfa-yok` (404) `noindex` döndürüyor; Next'in kendi davranışıdır, kapsam dışı.
- Yasal metinlerin **içeriği** bu task'ın konusu değil (B-008 hukukçu onayı, B-024 ayrı bulgular).

---

## Test Kriterleri

- [ ] Yerel geliştirmede 16 rotanın 16'sında HTML meta `noindex, nofollow` (404'te `noindex`) — üç yasal sayfa dâhil
- [ ] **Ürettiğim kapıyı sınadım — ara hâl:** `VERCEL=1`, `VERCEL_ENV=production`, `VERCEL_PROJECT_PRODUCTION_URL=alpfitplus-web-v2.vercel.app` ile derlenen yanıtta üç yasal sayfa **kapalı**; koşul `VERCEL_ENV`'e bakacak şekilde yazılsaydı burada fail-open olurdu
- [ ] **Kontrol grubu:** üretim simülasyonunda (gerçek alan adı) üç yasal sayfa **`index, follow`** — kapı her hâlde "kapalı" basmıyor
- [ ] `X-Robots-Tag` ve `robots.txt` katmanlarında regresyon yok (16/16 rota başlık, `robots.txt` `Disallow: /`)
- [ ] `docker compose exec web npm test` yeşil (taban 5 dosya / 61 PASS + 1 skipped); `npm run build` hatasız
- [ ] `a11y.mjs` TOPLAM SORUN 0 · `scan.mjs` üç yasal sayfada konsol temiz
- [ ] Canlı önizlemede dağıtım sonrası 16/16 rota `noindex, nofollow` — kanal: UAT

---

## Risk ve Geri Dönüş Planı

- **Devralma beklendiği gibi çalışmazsa** (Next sürüm davranışı) üç sayfa metasız kalabilir → ölçüm bunu Alt Görev 2'de yakalar; o hâlde açık `DEPLOY_STAGE` değeri yazılır.
- **Rollback:** üç dosya, tek satırlık değişiklik; dosya bazlı geri alma yeterli.

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

**Durum:** 🔄 Devam edecek

**Yapılanlar:**
- [Tamamlanan alt görevler ve detaylar]

---

**Oluşturulma:** 2026-09-22 (verify-phase UAT bulgusu — Senaryo #33; B-041'in canlı teyidi)
