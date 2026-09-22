# TASK-1.20: Üç yasal sayfa noindex'in üçüncü katmanını eziyor (B-041)

**Durum:** ✅ Tamamlandı

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

- [x] **1. Üç sayfada sabit değeri aşama türetimine bağla**
  - `robots: { index: true, follow: true }` → kök `layout.tsx`'teki `isPublished` desenine eşdeğer bir değer
  - **Tercih edilen yol:** sayfa metadata'sından `robots` anahtarını **tamamen kaldır** — Next.js kök layout'un `metadata.robots` değerini zaten devralır, yani ikinci bir koşul hiç doğmaz (drift kaynağını kaldırmak, ikinci bir kopya yazmaktan üstün). Devralmanın gerçekten çalıştığı ölçülerek doğrulanır; çalışmıyorsa `DEPLOY_STAGE`'den türeyen açık değer yazılır
  - Dosyalar: `src/app/kvkk/page.tsx`, `src/app/gizlilik/page.tsx`, `src/app/kullanim-kosullari/page.tsx`
  - **Sonuç:** üç dosyada da `robots:` satırı silindi (tek satır fark, `alternates`'ten sonra); devralma ölçüldü — çalıştı, `DEPLOY_STAGE` açık değeri hiç gerekmedi

- [x] **2. Kapıyı dört ortam senaryosunda sına** (TASK-1.02 düzeneği)
  - Yerel (`local`) · üretim simülasyonu (gerçek alan adı) · **ara hâl** (`VERCEL_ENV=production` + `.vercel.app`) · alan adı env'i tanımsız
  - Ölçüm **serving katmanında** (gerçek HTML yanıtı), saf fonksiyon düzeyinde değil
  - **Sonuç:** dördü de beklenen değeri verdi (aşağıda Test Sonuçları) — dev sunucusuna ve repoya dokunmayan izole derleme yoluyla (`memory/alternatif-env-ile-uretim-derlemesi.md` → "Dev sunucusuna ve repoya hiç dokunmayan yol")

- [x] **3. Bulgu kapanışını hazırla**
  - B-041 atomuna Çözüm Kaydı yazılır (kapanış kapsamıyla: hangi rotalar, hangi katman), Durum `✅ Çözüldü`, atom `bulgular/archive/`e taşınır (düz `mv`), index satırı silinir
  - **Sonuç:** yapıldı — `bulgular/archive/B-041-yasal-sayfalar-noindex-eziyor.md`, `BULGULAR.md` Açık Bulgular 52 → 51

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

- [x] Yerel geliştirmede 16 rotanın 16'sında HTML meta `noindex, nofollow` (404'te `noindex`) — üç yasal sayfa dâhil
- [x] **Ürettiğim kapıyı sınadım — ara hâl:** `VERCEL=1`, `VERCEL_ENV=production`, `VERCEL_PROJECT_PRODUCTION_URL=alpfitplus-web-v2.vercel.app` ile derlenen yanıtta üç yasal sayfa **kapalı**; koşul `VERCEL_ENV`'e bakacak şekilde yazılsaydı burada fail-open olurdu
- [x] **Kontrol grubu:** üretim simülasyonunda (gerçek alan adı) üç yasal sayfa **`index, follow`** — kapı her hâlde "kapalı" basmıyor
- [x] `X-Robots-Tag` ve `robots.txt` katmanlarında regresyon yok (16/16 rota başlık, `robots.txt` `Disallow: /`)
- [x] `docker compose exec web npm test` yeşil (taban 5 dosya / 61 PASS + 1 skipped); `npm run build` hatasız
- [x] `a11y.mjs` TOPLAM SORUN 0 · `scan.mjs` üç yasal sayfada konsol temiz
- [ ] Canlı önizlemede dağıtım sonrası 16/16 rota `noindex, nofollow` — kanal: UAT (bu oturumun işi değil; sıradaki `/devflow:verify-phase` turunda ölçülecek — push bu oturumun son işi, sonucunu bekleme)

---

## Risk ve Geri Dönüş Planı

- **Devralma beklendiği gibi çalışmazsa** (Next sürüm davranışı) üç sayfa metasız kalabilir → ölçüm bunu Alt Görev 2'de yakalar; o hâlde açık `DEPLOY_STAGE` değeri yazılır.
- **Rollback:** üç dosya, tek satırlık değişiklik; dosya bazlı geri alma yeterli.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (UAT-kanallı son madde hariç — bilinçli, gerekçesi yukarıda)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-22

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- Üç yasal sayfada (`src/app/kvkk/page.tsx`, `src/app/gizlilik/page.tsx`, `src/app/kullanim-kosullari/page.tsx`) sabit `robots: { index: true, follow: true }` satırı silindi — sayfa artık kök `layout.tsx`'teki `isPublished` (`deployStage`) türevini miras alıyor, ikinci bir koşul yazılmadı (tercih edilen yol, task dokümanının kendi önerisi).
- Devralma dört ortam senaryosunda **serving katmanında** ölçüldü — dev sunucusuna ve repoya dokunmayan izole `docker run` yoluyla (rsync ile scratchpad'e kopya, ayrı port 3200, `node_modules` hacmi salt okunur): yerel, üretim simülasyonu (kontrol grubu), ara hâl (`VERCEL_ENV=production` + `.vercel.app`, kapının asıl sınavı), boş kapsam (alan adı env'i tanımsız). Dördü de beklenen sonucu verdi.
- Yerelde 16/16 rotada (404 dâhil) HTML meta + `X-Robots-Tag` + `robots.txt` regresyon taraması yapıldı, güvenlik başlıkları 5/5 spot-check edildi.
- B-041 kapatıldı: Çözüm Kaydı yazıldı, atom `bulgular/archive/`e taşındı (düz `mv`), `BULGULAR.md` index satırı silindi (Açık Bulgular 52 → 51).

**Sorunlar:**
- Yok — devralma beklenen gibi çalıştı, `DEPLOY_STAGE` açık değeri yazmaya hiç gerek kalmadı.

**Kararlar:**
- Task dokümanının "tercih edilen yol"u (anahtarı tamamen kaldırıp miras almak) doğrulanarak uygulandı; yedek plan (açık `DEPLOY_STAGE` değeri) kullanılmadı.
- docs/DECISIONS.md'ye eklendi: Hayır — bu, mevcut üç-katman değişmezinin (TASK-1.01/1.02'de zaten karar altına alınmış) bir uygulama düzeltmesi, yeni bir mimari karar değil.

**Dosya Değişiklikleri:**
- `src/app/kvkk/page.tsx` → `robots:` satırı silindi
- `src/app/gizlilik/page.tsx` → `robots:` satırı silindi
- `src/app/kullanim-kosullari/page.tsx` → `robots:` satırı silindi
- `_dev/bulgular/B-041-yasal-sayfalar-noindex-eziyor.md` → Çözüm Kaydı yazıldı, Durum `✅ Çözüldü`, `bulgular/archive/`e taşındı
- `_dev/BULGULAR.md` → B-041 satırı silindi, Son Güncelleme satırı üzerine yazıldı

**Test Sonuçları:**
- **Dört ortam senaryosu (serving katmanında, izole derleme):**
  | Senaryo (env) | Beklenen | `/kvkk`·`/gizlilik`·`/kullanim-kosullari` meta | Kontrol (`/fiyat`) |
  |---|---|---|---|
  | Yerel (`VERCEL` yok) | kapalı | 3/3 `noindex, nofollow` | `noindex, nofollow` |
  | Üretim simülasyonu (`VERCEL_ENV=production`, `alpfitplus.com`) | açık | 3/3 `index, follow` | `index, follow` |
  | **Ara hâl** (`VERCEL_ENV=production` + `…vercel.app`) | kapalı | 3/3 `noindex, nofollow` — fail-open yok | `noindex, nofollow` |
  | **Boş kapsam** (alan adı env'i tanımsız) | kapalı | 3/3 `noindex, nofollow` — fail-safe | `noindex, nofollow` |
- **Yerel regresyon, 16/16 rota** (dev sunucusu, `localhost:3000`): HTML meta + `X-Robots-Tag` her rotada eşleşiyor; `robots.txt` `Disallow: /`; 404 `noindex`. Güvenlik başlıkları (5) `/kvkk`'de spot-check 5/5.
- `docker compose exec web npx tsc --noEmit` → 0 hata.
- `docker compose exec web npx eslint` (dokunulan 3 dosya) → 0 sorun.
- `docker compose exec web npm test` → 5 dosya / **66 PASS** + 1 skipped (taban birebir — bu değişiklik saf fonksiyon testleriyle kapsanmıyor, ölçüm serving-katmanı senaryolarıyla yapıldı).
- `docker compose exec web npm run build` → hatasız, 23 rota; ardından `docker compose restart web` ile dev sunucusunun `.next` hacmi tazelendi (ihtiyaten, `memory/alternatif-env-ile-uretim-derlemesi.md`).
- `a11y.mjs` (8 rota, `/kvkk` dâhil) → TOPLAM SORUN: 0.
- `scan.mjs` üç yasal sayfada ayrı ayrı → konsol temiz (kvkk 5 kare, gizlilik 3 kare, kullanim-kosullari 3 kare).
- **Kapsanmadı, bilinçli:** canlı önizlemede (`alpfitplus-web-v2.vercel.app`) dağıtım-sonrası 16/16 doğrulaması — kanal UAT, sıradaki `/devflow:verify-phase` turunda ölçülecek.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-22

**Ne Yapıldı:**
- Üç yasal sayfanın sabit `robots: { index: true, follow: true }` değeri kaldırıldı; sayfa artık kök layout'un `isPublished`/`deployStage` türevini devralıyor — noindex'in üç katmanı (başlık, `robots.txt`, HTML meta) artık gerçekten **tek** koşuldan okuyor, `next.config.ts`'in kendi değişmezi (drift yok) yeniden doğru.
- Kapı, kusurun gerçekte oluşacağı ara hâl dâhil dört ortam senaryosunda serving katmanında sınandı; B-041 çözüldü ve arşivlendi.

**Öğrenilenler:**
- Next.js'te sayfa-düzeyi `metadata` alanı **anahtar bazında** ezer: `robots` anahtarını hiç yazmamak, kök layout'un değerini miras almak için yeterli ve tek-koşul değişmezini bozmayan tek yol — ikinci bir `DEPLOY_STAGE` kopyası hiç gerekmedi.
- Bu sınıftaki hata (aşamaya bağlı davranışı sayfa-düzeyinde sessizce ezme) kickoff-öncesi yazılmış sayfalarda beklenmeli; `grep -rn "robots" src/app/*/page.tsx` benzeri bir tarama gelecekte yeni bir sayfa eklenirken de ucuz bir kontrol.

---

**Oluşturulma:** 2026-09-22 (verify-phase UAT bulgusu — Senaryo #33; B-041'in canlı teyidi)
