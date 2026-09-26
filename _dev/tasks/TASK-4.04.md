# TASK-4.04: v1 adreslerinin tek atlamalı 301 kuralları ve `.vercel.app` → apex

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.5 Alan adı geçişi ve 301 haritası
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.02 ✅ (yönlendirme dalı bu task'ın ölçüm kapısıdır)

---

## Hedef

v1'in her adresi `alpfitplus.com`'da **tek atlamada 301** ile karşılığına gider. `next.config.ts` → `skipTrailingSlashRedirect: true` ve `redirects()` (`statusCode: 301`):

- (a) **EN eşlemesi** — dokuz sayfa + `/en`, her biri eğik çizgisiz, eğik çizgili ve `/index.html` biçimiyle **doğrudan** Türkçe hedefe;
- (b) `/sitemap-index.xml` ve `/sitemap-0.xml` → `/sitemap.xml`;
- (c) `/og/alpfitplus-og.png` → `/opengraph-image.png` (paylaşılmış eski bağlantıların kartı ayakta kalır);
- (d) genel biçim kuralları — `/:path+/` → `/:path+` ve `/:path*/index.html` → `/:path*` — özel kurallardan **sonra**;
- (e) `alpfitplus-web-v2.vercel.app` hostu → `https://alpfitplus.com/:path*`, **yalnız aşama `production` iken**.

`/404` · `/en/404` · `/404.html` kuralsız kalır ve 404 döner. Kurallar saf bir fonksiyondan türer ve birim testi taşır. Tamam sayılır: TASK-4.02'nin yönlendirme dalı 3100'e karşı yeşil (host grubu hariç), host kuralı üretim benzeri bir derlemede ya da kayıtlı gerekçeyle canlıda ölçülmek üzere işaretli.

---

## Bağlam

`docs/DECISIONS.md` 2026-09-26 md. 2 (kullanıcı): Next'te `permanent: true` **308** üretir ve eğik-çizgi çevrimi derleme çıktısında (`.next/routes-manifest.json`) özel kuralların **önünde** öncelikli bir iç kuraldır — varsayılanla v1 site haritasındaki `/en/` bile 308 → 301 iki atlama alırdı. Çözüm iç kuralı kapatıp biçim normalizasyonunu kendi 301 kurallarımızla yazmaktır. Bunun yan sonucu: sitenin kendi eğik-çizgi davranışı 308'den 301'e döner — bilinçli.

`/404` ailesi için kullanıcı kararı: yönlendirilmez, 404 döner — tanım gereği karşılığı olmayan adresler; ana sayfaya yönlendirmek arama motorunda "yumuşak 404" sayılır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Değerlendirilen Yaklaşımlar (301 üretimi) · Dikkat Edilecekler → adres envanteri tablosu · `PHASE-4.md` → Teknik Kararlar 2
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 — EN eşleme tablosu (kaynak)
- `src/lib/stage.ts` — `deriveDeployStage`, aşamanın tek türetimi
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — üretim benzeri derlemenin ayrı konteynerde (3200) yapılışı ve sonrasında `docker compose restart web`
- `_dev/memory/asama-bagimli-davranis-ara-hal-sinamasi.md` — aşamaya bağlı davranışta ara hâl de sınanır

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 — kuralların evi ve ölçülen tablo

---

## Alt Görevler

- [ ] **1. Kural tablosu tek evde** — `src/lib/yonlendirmeler.ts` (YENİ): `redirectsFor(stage: DeployStage)` saf fonksiyonu Next'in `Redirect[]` biçimini döndürür. EN eşleme tablosu burada tek evde durur; sıra: EN + tarama + og (özel) → genel biçim → host (yalnız `production`).

- [ ] **2. Bağlantı** — `next.config.ts`: `skipTrailingSlashRedirect: true` ve `async redirects() { return redirectsFor(deployStage) }`; dosyanın mevcut `deployStage` sabiti kullanılır (üçüncü bir ortam kavramı doğmaz). Dosya yorumuna kararın gerekçesi tek paragrafla (308'in nedeni, tek atlama).

- [ ] **3. Birim testi** — `tests/yonlendirmeler.test.ts` (YENİ):
  - her EN kaynağının üç biçimi bir kurala eşleşir ve hedef Türkçe karşılıktır;
  - `/en/404` · `/404` · `/404.html` hiçbir kurala eşleşmez;
  - host kuralı `production`'da var, `preview` ve `local`'de yok (ara hâl — memory);
  - özel kurallar genel biçim kurallarından önce; hiçbir kural `/api/` ve `/_next/` altını hedeflemez; kök `/` genel kurala takılmaz.
  - Eşleşme Next'in kullandığı yol eşleyiciyle sınanır, elle yazılmış regex'le değil — erişim yolu task'ta doğrulanır; erişilemiyorsa birim testi yalnız **yapıyı** sınar ve eşleşmenin kanıtı 3100'deki betiktir (kayda yazılır).

- [ ] **4. Yerel ölçüm** — 3100 taze imaj → `gecis-dogrula.mjs` yönlendirme dalı.

- [ ] **5. Host kuralı** — üretim benzeri derleme (memory atomu: ayrı konteyner, 3200; `VERCEL=1`, `VERCEL_ENV=production`, `VERCEL_PROJECT_PRODUCTION_URL=alpfitplus.com` — `VERCEL=1` `output`'u standalone'dan çıkarır, çalıştırma biçimi atomda) → betik `HOST=alpfitplus-web-v2.vercel.app` kipinde 301 → `https://alpfitplus.com/…`; **negatif kontrol:** dal adresi hostu (`alpfitplus-web-v2-git-dev-north-ai.vercel.app`) yönlenmez. Ölçüm bitince 3200 kaldırılır ve `docker compose restart web` (atom). Simülasyon kurulamıyorsa kanıt birim testi + TASK-4.18'in canlı ölçümüdür — gerekçe kayda yazılır.

- [ ] **6. Kapılar** — rota davranışı değiştiği için 3100'e karşı `a11y.mjs` ve `mobile-audit.mjs`; `npm test`.

---

## Etkilenen Dosyalar

```
next.config.ts                  # skipTrailingSlashRedirect + redirects()
src/lib/yonlendirmeler.ts       # YENİ — kural tablosu, saf fonksiyon
tests/yonlendirmeler.test.ts    # YENİ
```

---

## Dikkat Noktaları

- **`/en/:path*` gibi bir toplayıcı kural YAZMA** — `/en/404` 404 kalmalı (kullanıcı kararı).
- `skipTrailingSlashRedirect` Next'in kendi 308'ini kapatır; genel biçim kuralı yazılmazsa `/fiyat/` 200 ya da 404'e düşer, yönlenmez — iki değişiklik aynı commit'te.
- `/en/` → `/`, `/en` → `/`, `/en/index.html` → `/`; `/en/pricing/` → doğrudan `/fiyat` (önce `/en/pricing`'e değil).
- Envanter (TASK-4.02) bağımsız kâhindir: bu task **envanteri kural tablosundan güncellemez**; bir kalem uyuşmazsa önce hangisinin yanlış olduğu ölçülür.
- Host kuralı aşamaya bağlıdır çünkü koşulsuz yazılırsa ilk yayında (TASK-4.18, taşımadan önce) `.vercel.app` hâlâ v1'i gösteren apex'e yönlenir.
- Site haritası etkilenmez (`sitemap.ts` eğik çizgisiz yazar; ana sayfa `<loc>`'u `/` ile biter ve kök kurala takılmaz).
- `npm test` bugünkü taban **219 geçti + 2 atlandı** (Faz 3'ün son kaydı, `tasks/archive/TASK-3.27.md`; kök `CLAUDE.md`'deki 209 bayat — Gelen Kutusu'nda kayıtlı) — yeni testlerle birlikte yeni sayı yazılır.

---

## Test Kriterleri

- [ ] `docker compose exec web npm test` yeşil; yeni dosyadaki testler sayılı
- [ ] 3100: yönlendirme dalı — EN (her biri üç biçim), tarama (2), og (1) ve biçim kalemleri **tek atlamada** 301 → 200; `/404` · `/en/404` · `/404.html` → 404; TR 9 sayfa 200
- [ ] Host kuralı: üretim benzeri derlemede `.vercel.app` hostu → 301 apex; dal hostu yönlenmiyor — ya da simülasyonun kurulamama gerekçesi kayıtta ve kalem TASK-4.18'e işaretli
- [ ] 3100: `a11y.mjs` TOPLAM SORUN **1** · çıkış 1 (B-063 kalemi hariç 0), `mobile-audit.mjs` `✓ KAPI YEŞİL — 16 sayfada 0`

---

## Risk ve Geri Dönüş Planı

- **Genel biçim kuralı bir iç yolu yakalar** (`/_next/...`, `/api/...`): birim testi bunu yakalar; 3100'de `scan.mjs` benzeri konsol kontrolü ve ürün görseli kalemleri (envanterde 200) ek güvencedir.
- **Rollback:** üç dosya dosya bazlı geri alınır; site eski eğik-çizgi davranışına (308) döner.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-26
