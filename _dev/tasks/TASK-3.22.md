# TASK-3.22: Segment giriş sayfasının LCP görseli ve yedek yazı tipinin metrik eşlemesi

**Durum:** ⬜ Bekliyor
**Modül:** M2 — segment sayfası · M5 — font teslimi (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F2.2 Alt sayfalar · F5.3 Font daraltma
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.20 ✅

---

## Hedef

B-057'nin iki somut ayağını kapatmak:

**(a) Segment sayfasında LCP dekoratif fotoğraf.** Kahraman görseli `fill priority sizes="100vw" opacity-45`, üstünde `from-ink-deep/92 via-ink-deep/78 to-ink-deep/45` gradyan — yani %45 opaklıkta ve büyük ölçüde örtülü. Yine de LCP'yi **+240-264 ms** itiyor (5 koşum, sapma ≤ ±40 ms). `sizes="100vw"` yüzünden yaygın telefon genişliklerinde 1200w · 52 KB iniyor ve Slow 4G'de LCP **2,61-2,68 s** — eşik 2,5 s.

**(b) Yedek yazı tipinin metrikleri eşlenmemiş.** Hiçbir `@font-face`'te `size-adjust` / `ascent-override` / `descent-override` yok. Slow 4G'de `/demo`'da h1 3 satırdan 4 satıra çıkıyor ve form bölümü 34 px iniyor; segment sayfasında hero bloğu 24 px itiliyor ve breadcrumb'ın son öğesi alt satıra kırılıyor. Lighthouse CLS: `/demo` 0,152-0,160 · segment 0,170-0,173 (eşik 0,1).

---

## Bağlam

**Rakamlar doğrulanmadı, mekanizmalar doğrulandı.** Araştırma ölçtü: kayıttaki performans ölçümü `147c5e8` dağıtımına ait ve Faz 2 o günden beri çok sayıda commit gönderdi. Kod tarafı yerinde (`priority` + `sizes="100vw"` dekoratif kahraman görselinde; hiçbir `@font-face`'te metrik eşleme yok). **Bu task kendi öncesi/sonrası ölçümünü kendisi alır.**

⚠️ **Çift preload iddiası çürüdü:** yayınlanan HTML'de font preload'u **2 etiket** (`inter-400`, `sora-800`); tekrar yok. Bu alt kalem kapsamdan düştü.

**Alan metriği nüansı** (kaydedilir, karar değiştirmez): Chrome'un kendi CLS'i bu kaymaları saymıyor (`hadRecentInput=true`), Lighthouse bilerek sayıyor. Yani PageSpeed'te eşik aşılıyor, alanda çoğunlukla görünmüyor. İstisna: Slow 3G'de segment kayması alan tanımıyla da **0,148**.

**Kapsam dışı:** M6 başlangıç çizgisinin yeniden ölçümü ve `perf.mjs`'in ağırlık muhasebesi (B-035) → "Kalite kapıları otomatik" fazı.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-057-segment-lcp-dekoratif-gorsel-ve-font-takasi.md` — ölçüm dökümü ve yeniden üretme komutu
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 10. satır (rakamların doğrulanmadığı)
- `_dev/docs/STYLE-GUIDE.md` — tipografi, `unicode-range` kullanılmaz kuralı
- `_dev/QUALITY.md` — 4 Performans

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — yedek yüz tanımları ve ölçülen kayma rakamları

---

## Alt Görevler

- [ ] **1. Önce ölç**
  - Bugünkü LCP ve CLS değerlerini kendi ölçümünle al (kayıttaki rakamlar bayat) — Slow 4G + `devtools` yöntemi, en az 390 ve 412 px
  - Yeniden üretme komutu bulgu atomunda; `CHROME_PATH` Playwright chromium'u

- [ ] **2. (a) Dekoratif kahramanı LCP adaylığından çıkar**
  - İki yol: `sizes`'ı sabit ve küçük bir varyanta çekmek (ör. 640w — %45 opaklık ve %78-92 gradyan altında çözünürlük görünmez) **ya da** görseli CSS arka planına almak
  - `priority` gerçek içerik görseline kalır
  - Çapa: `src/app/segmentler/[slug]/page.tsx` kahraman bloğu (⚠️ `grep -n "priority"` ile konumlan)

- [ ] **3. (b) Yedek yüze metrik eşleme ver**
  - Sora ve Inter için `size-adjust` + `ascent-override` / `descent-override` taşıyan yedek `@font-face` tanımları
  - `font-display: swap` korunur; `unicode-range` kullanılmaz (STYLE-GUIDE)
  - Çapa: `src/app/globals.css` `@font-face` blokları

- [ ] **4. Sonra ölç**
  - Aynı koşulda LCP ve CLS; öncesi/sonrası rakamlarıyla task dokümanına

---

## Etkilenen Dosyalar

```
src/app/segmentler/[slug]/page.tsx   # kahraman görselinin sizes/priority'si
src/app/globals.css                  # yedek yüz metrik eşlemeleri
```

---

## Dikkat Noktaları

- **Kayıttaki rakamlara güvenme.** `147c5e8`'ten beri çok commit geçti; ölçüm bu task'ın kendi işidir.
- **`₺` Sora'da yok ve Inter yedeği bilinçlidir** — yedek yüz tanımları `--font-display` yığınındaki Inter yedeğini **bozmamalı**.
- **`font-guard.mjs` yeni tanımlardan sonra koşar** — küme dışı karakter girmediği doğrulanır.
- **Lighthouse CLS ≠ alan CLS.** Ölçümü hangi yöntemle aldığını yaz (`simulate` bu iki noktaya kör: (b)'yi 0,0006 gösteriyor).
- **Görsel elle konmaz** — yeni varyant gerekiyorsa `photos-build.mjs`.
- **3100 bayat olabilir** — `docker compose --profile prod up -d web-prod`.
- **Gerçek cihazda doğrulama** faz sonu turuna kalır — `kanal: UAT`.

---

## Test Kriterleri

- [ ] Düzeltme öncesi ve sonrası LCP/CLS aynı yöntemle ölçüldü (Slow 4G + `devtools`, 390 ve 412 px) ve rakamlar task dokümanında
- [ ] Segment sayfasında LCP elemanı artık dekoratif kahraman değil (ya da görsel LCP'yi ölçülebilir biçimde itmiyor)
- [ ] Slow 4G'de segment LCP eşiğin (2,5 s) altında
- [ ] `/demo` ve segment sayfasında font takasından doğan kayma ölçülebilir biçimde düştü; Lighthouse CLS < 0,1
- [ ] `font-guard.mjs` kümede olmayan karakter bulmuyor
- [ ] `perf.mjs` regresyon çizgisini kırmıyor (masaüstü ≤ 150 KB, LCP yerel üretimde < 1 s)
- [ ] Gerçek cihazda ilk yük gözlemi — `kanal: UAT`

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

**Oluşturulma:** 2026-09-23
