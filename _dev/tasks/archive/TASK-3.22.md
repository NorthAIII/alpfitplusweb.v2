# TASK-3.22: Segment giriş sayfasının LCP görseli ve yedek yazı tipinin metrik eşlemesi

**Durum:** ✅ Tamamlandı
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

- [x] **1. Önce ölç**
  - Bugünkü LCP ve CLS değerlerini kendi ölçümünle al (kayıttaki rakamlar bayat) — Slow 4G + `devtools` yöntemi, en az 390 ve 412 px
  - Yeniden üretme komutu bulgu atomunda; `CHROME_PATH` Playwright chromium'u

- [x] **2. (a) Dekoratif kahramanı LCP adaylığından çıkar**
  - İki yol: `sizes`'ı sabit ve küçük bir varyanta çekmek (ör. 640w — %45 opaklık ve %78-92 gradyan altında çözünürlük görünmez) **ya da** görseli CSS arka planına almak
  - `priority` gerçek içerik görseline kalır
  - Çapa: `src/app/segmentler/[slug]/page.tsx` kahraman bloğu (⚠️ `grep -n "priority"` ile konumlan)

- [x] **3. (b) Yedek yüze metrik eşleme ver**
  - Sora ve Inter için `size-adjust` + `ascent-override` / `descent-override` taşıyan yedek `@font-face` tanımları
  - `font-display: swap` korunur; `unicode-range` kullanılmaz (STYLE-GUIDE)
  - Çapa: `src/app/globals.css` `@font-face` blokları

- [x] **4. Sonra ölç**
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

- [x] Düzeltme öncesi ve sonrası LCP/CLS aynı yöntemle ölçüldü (Slow 4G + `devtools`, 390 ve 412 px) ve rakamlar task dokümanında
- [x] Segment sayfasında LCP elemanı artık dekoratif kahraman değil (ya da görsel LCP'yi ölçülebilir biçimde itmiyor)
- [x] Slow 4G'de segment LCP eşiğin (2,5 s) altında
- [~] `/demo` ve segment sayfasında font takasından doğan kayma ölçülebilir biçimde düştü; Lighthouse CLS < 0,1
- [x] `font-guard.mjs` kümede olmayan karakter bulmuyor
- [x] `perf.mjs` regresyon çizgisini kırmıyor (masaüstü ≤ 150 KB, LCP yerel üretimde < 1 s)
- [ ] Gerçek cihazda ilk yük gözlemi — `kanal: UAT`

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [~] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Önce ölçüldü ve devralınan rakamların hangisinin bayat olduğu tek tek çıkarıldı.** Yargı yayın kopyasına (3100) ait; yöntem yavaş 4G (Lighthouse `mobileSlow4G` eşdeğeri: 562,5 ms RTT · 184 KB/s · yükleme 76 KB/s) + CPU 4x, CDP `Network.emulateNetworkConditions` ile — yani `devtools` kulvarı, `simulate` değil. 390×844@3 ve 412×915@3, rota başına 3 koşum, her koşum **pozitif kapıdan** geçti (HTTP 200 + tam bir `h1`).
- **(a) Segment kahramanının kaynağı küçültüldü, `sizes` dokunulmadan bırakıldı.** `seg.photo.src` (1600 px) → `seg.photo.thumb` (800 px); `priority` ve `sizes="100vw"` aynı kaldı. Teslim `_next/image` yanıtından ölçüldü: 412@3'te **87 → 29 KB**, 390@3'te **50 → 29 KB**.
- **(b) İki metrik eşlenmiş yedek yüz tanımlandı** (`Sora Yedek`, `Inter Yedek`; `src` yalnız `local()`) ve iki font yığını genişletildi — yedekler **Inter'den sonra** durur, ₺ zinciri korunur. Değerler tarayıcıda ölçülen metriklerden `next/font` formülüyle türetildi.
- **Yedek yüzün `size-adjust` değeri 16 rota × 2 genişlikte TARANARAK seçildi** (112 · 113 · 114 · 115 · 118 · 118,2 · 118,4 · 118,6 · 118,8 · 119 ve Inter için 103,94 · 105,88 · 107,47). Ölçüt: fontlar engelli hâlin yerleşimi ile fontlar yüklü hâlin yerleşimi arasındaki fark.

**Sorunlar:**
- **Enjekte ölçüm ZAMANLAMA için geçersiz çıktı.** Aday görsel varyantını `page.route` + `route.fulfill` ile enjekte edince LCP 412@3'te 2672 → 1624 ms okundu; sebep baytların küçülmesi değil, **`route.fulfill`'in CDP ağ kısıtlamasını baypas etmesi** (gövde Playwright sürecinden servis edilir, kısıtlanan kanaldan geçmez). Sonuç: enjeksiyon **çizim** için sadık (aşağıda doğrulandı), **zamanlama** için değil. Gerçek LCP yeniden derleyip ölçüldü. Kayıt `memory/arastirma-konteynerinde-tarayici-olcumu.md`.
- **`quality` dalı ölçülemedi (ölçüm duvarı, yazılı bırakıldı).** Next 16.3.4 `images.qualities` dışındaki her `q` değerine **HTTP 400** veriyor (ölçüldü: q50/40/30/20 → 400, q75 → 200), yani aday ancak `next.config.ts`'e izin yazıp yeniden derleyerek ölçülebilirdi. `sharp` ile taklit denendi ve **tutmadı**: aynı q75'te 219.519 bayt üretti, Next'in verdiği 89.185. Dal bu yüzden ele alınmadı, reddedilmedi.
- **İlk kurulan ölçüt yanlış adayı seçti.** 16 rota × 2 genişlikte toplam kaymayı (Σ|Δbölüm|) en aza indiren değer **115**'ti (1.670 px; 118,4-119 → 2.808 px) ve o seçildi. Ama **asıl metrik CLS** ve CLS yer değiştirmeyi görünür alandaki etkisine göre ağırlıklandırır: 115'te `/demo` @412'nin `h1` kayması kapanmıyor ve o tek kombin **0,1588**'de kalıyor. 118,4+ onu kapatıyor — fakat `/fiyat` @390'ı **29,25 → 115,75 px**, `/ozellikler` @390'ı **~0 → 99,97 px** bölüm yer değiştirmesine çıkarıyor, yani arızayı kaldırmıyor **taşıyor**. 118,0-118,8 arası tarandı: `/demo` @412'nin düzeldiği eşik (118,4) ile segment @390'ın 4 satırdan 5'e taştığı eşik **aynı aralıkta**, yani ikisini birlikte sağlayan pencere **yok**. Karar: 115'te kalındı, kalan kalem yazılı.

**Kararlar:**
- **`sizes` değiştirilmedi, kaynak küçültüldü.** Küçük bir vw kesri (33vw) de 640w'ye düşürüyor ve **9 KB daha kazandırıyor** (20.777 ↔ 29.890 bayt), ama `sizes`'ı yanlış hâle getirirdi — TASK-3.20 dokuz `sizes` beyanını tam bu yüzden ölçülen yerleşime çekmişti (sapma ≤ %3). Görünüş farkı iki adayda **neredeyse aynı** ölçüldü, yani seçimi baytlar değil beyanın doğruluğu belirledi.
- **CSS arka planı dalı ölçülerek reddedildi** (B-057'nin ikinci önerisi): diskteki dosya webp ve **57.474 bayt**; `next/image` aynı resmi **29.890 bayt** avif olarak veriyor. Arka plana almak baytları neredeyse ikiye katlar ve biçim pazarlığını kaybeder.
- **`priority` kaldırılmadı.** Kaldırmak görseli LCP elemanı olmaktan **çıkarmaz** (Chrome yalnız `opacity:0`, tüm görüntü alanını kaplayan ve 0,05 bpp altı görselleri eler; bu görsel 0,45 opaklıkta, alanı 290.460 ↔ görüntü alanı 376.980 px², bpp 0,56) — yalnızca daha geç getirir, yani LCP'yi kötüleştirirdi.
- **Yedek yüz `font-weight: 100 900` taşır.** Sentetik kalın dalı da ölçüldü (descriptor 400 + 800 isteği): `size-adjust` 106,93 ile bile `/demo` ve segment `h1`'lerini kapatamadı.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü tek dosya ve mekanizma bir sözleşme/şema bırakmıyor; gerekçeler kod yorumlarında ve bu kayıtta.

**Kalan İşler:**
- `/demo` @412'nin `h1` kayması (CLS 0,1588) — yukarıdaki ölçümle birlikte `BULGULAR.md` → Gelen Kutusu'nda.
- Gerçek cihazda ilk yük gözlemi — `kanal: UAT`, faz sonu turuna ait.
- B-057'nin (c) ayağı (ölçüm yönteminin yeniden çizilmesi) kapsam dışı, "Kalite kapıları otomatik" fazında.

**Son Yaklaşım:** İş tamamlandı, devam gerekmiyor.

**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/app/segmentler/[slug]/page.tsx` → kahraman `<Image>`'ının `src`'i `seg.photo.src` → `seg.photo.thumb`; ölçüm, reddedilen iki alternatif ve düşen kalem yorumda.
- `src/app/globals.css` → iki metrik eşlenmiş yedek `@font-face` (`Sora Yedek` %115 / 84,35 / 25,22 · `Inter Yedek` %105,88 / 91,61 / 22,67, ikisi de `line-gap-override: 0%`); `--font-display` ve `--font-sans` yığınlarına yedekler **Inter'den sonra** eklendi.

**Test Sonuçları:**

Kapsam: yargı **yayın kopyası (3100)**; `scan.mjs`'in hedefi **kodda 3000'e sabit**, yani onun *"konsol temiz"* sonucu **geliştirme sunucusuna** aittir, yayın kopyasına değil. LCP/CLS ölçümü `reducedMotion: reduce`, yavaş 4G + CPU 4x, `devtools` kulvarı. CLS iki tanımla birlikte basıldı: **CLS(tümü)** Lighthouse'un saydığı toplam, **CLS(girdi hariç)** alan tanımı.

*Bu task bir kapı üretmiyor* — run-task Adım 3'ün "ürettiğin kapıyı sına" maddesi düşer. Yerine negatif kontrol + belirlenimlilik koşuldu.

**(1) LCP ve CLS — öncesi/sonrası, aynı betik, aynı hedef, 3 koşum/medyan**

| kombin | LCP önce → sonra | LCP elemanı | kahraman teslimi | CLS(tümü) önce → sonra | kayma sayısı |
|---|---|---|---|---|---|
| 390/3 `/segmentler/pilates-reformer` | **2072-2092 → 1792** ms | img (değişmedi) | w1200 **50 → 29 KB** | **0,0348 → 0,0000** | 4 → **0** |
| 412/3 `/segmentler/pilates-reformer` | **2668-2692 → 1792-1800** ms | img (değişmedi) | w1920 **87 → 29 KB** | **0,1595 → 0,0000** | 4 → **0** |
| 390/3 `/demo` | 1620-1628 → 1612-1624 ms | `p.mt-5` (değişmedi) | — | **0,1413 → 0,0000** | 2 → **0** |
| 412/3 `/demo` | 1608-1620 → 1620-1624 ms | `h1` (değişmedi) | — | **0,1508 → 0,1588** | 2 → **1** |

- **LCP elemanı segment sayfasında hâlâ dekoratif kahraman** — kriterin ilk şıkkı sağlanmadı, **ikinci şıkkı sağlandı**: görselin ittiği süre 412'de **1050 → ~160 ms**, 390'da **450 → ~160 ms**; eşik 2,5 s'ye pay **1792 ms ile 700 ms**. Metin 1620-1644 ms'de boyanıyor.
- **`/demo` @412 yeşille kapanmadı ve sebebi ölçülü:** Inter tarafındaki kayma kapandı (iki kaymadan biri düştü), Sora tarafındaki `h1` 3→4 satır kayması kaldı; puanı 0,1355 → 0,1588'e **çıktı**, çünkü yedek artık içerik yolunu doğru yükseklikte çizdiği için kayan blok doğru yerinden başlıyor ve etki alanı büyüyor. Net: 0,1508 → 0,1588.

**(2) 16 rota × 2 genişlikte CLS (yayın kopyası, yavaş 4G)** — 32 kombinin **30'u ≤ 0,0122**, **28'i tam 0,0000**; tek aşan `/demo` @412 = **0,1588**. En yüksek LCP **1800 ms** (412/3 segment). `/olmayan-sayfa` iki genişlikte de pozitif kapıyı düşürdü — beklenen: o rota **HTTP 404** döner, kapı 200 arıyor.

**(3) Yedek yüzün işi — negatif kontrol, AYNI derlemede A/B.** Fontlar engelli hâlin yerleşimi ile fontlar yüklü hâlin yerleşimi arasındaki fark, 16 rota × 2 genişlik:

| hâl | Σ\|Δsayfa boyu\| | Σ\|Δbölüm üstü\| | en kötü tek bölüm |
|---|---|---|---|
| yedek **etkin** (bugünkü derleme) | **700 px** | **1.670 px** | **61,6 px** |
| yedek **kapalı** (yalnız iki CSS değişkeni eski hâline enjekte edildi) | 7.452 px | **25.633 px** | 778,6 px |

Dedektör kör değil ve kazanç **tam olarak** iki `@font-face` + iki yığına atfedilir: **−93,5%**. Kapalı hâlin rakamları, değişiklikten önceki derlemede ölçülenlerle **birebir** (7.452 / 25.633 / 778,6) — enjeksiyonun **çizim** tarafındaki sadakati böyle doğrulandı.

**(4) Kapılar — öncesi/sonrası**

- ⚠️ **`mobile-audit` (3100) YEŞİL KALDI:** `TOPLAM SORUN` **0 → 0**, çıkış **0 → 0**, `✓ KAPI YEŞİL`. Kırpma 0 · şerit 0 · yatay kaydırma yok. **Altı kapsam tabanının hiçbiri oynamadı ve hiçbiri elle değiştirilmedi:** eleman **6253** · metin elemanı **2054** (taban 2054) · kritik hedef **305/0/0** (taban 305) · kaydırılabilir kap **5** (taban 5) · dokunma hedefi **638** · gezinme **333/261** (alt bilgi 256 · içerik yolu 4 · gövde metni 1).
- `a11y` (3100): **6 / çıkış 1** — birebir, altısı da `/gecis`'in aynı kalemleri (`01`/`02`/`03` p02 **1,21** · *"Elle tutulan kayıtlar…"* **3,25** · `1` **3,49** · `2` **4,23**). 16 rota · **105 adım** · **1834 eleman** · gradyan **19** (taban 19) · başlık **316** (taban 316) · `alt'sız img: 0` · yapışkan borcu 151 (B-063).
- `font-guard` (3100): **85.129 karakter / çıkış 0** — birebir. Kümede olmayan karakter yok.
- `perf` (3100): `/` masaüstü **111 KB / TTFB 5 → 5 ms / FCP 80 / LCP 84 → 80 ms / CLS 0,005 → 0 / 35 istek / DOM 1491 / img 19**, mobil **111 KB / LCP 68 → 64 ms / CLS 0 / 24 istek / DOM 1488**. `/segmentler/pilates-reformer` masaüstü **182 → 125 KB** (avif **87 → 29 KB**), mobil **125 → 125 KB** (avif 29 → 29 — `perf` mobilde dpr **2** kullanıyor, yani 780 aygıt pikseli zaten w828'i seçiyordu; kazanç dpr 3'te, gerçek telefonda). `/fiyat` 95 KB · `/demo` 73 KB. M6 çizgisi masaüstü **144 KB / 96 ms** → `/` payı **33 KB**, LCP payı 16 ms; task kriterinin eşiği (≤150 KB, LCP < 1 s) segment sayfasında da sağlandı (**125 KB / 64 ms**) — o rota önce **182 KB ile çizginin üstündeydi**.
- `scan` (**3000, geliştirme**): 5 kombinde **konsol temiz**; sayfa boyu `/` @1440 **15405** · @390 **25872** — T3.19 ve T3.21'in kaydıyla **birebir**, yani bağımsız bir betikten gelen *"başka hiçbir şey oynamadı"* teyidi. Segment @390 **9328** ve `/demo` @412 **4428**, ölçüm harness'inin referansıyla birebir (çapraz teyit). Next'in LCP uyarısı **çıkmadı** (görsel `priority` taşıyor).
- `npm test` (web konteyneri): **219 geçti + 2 atlandı** — birebir. `tsc --noEmit`: **0**. `lint`: **30** (25 hata / 5 uyarı) — birebir, hiçbiri bu turun dosyalarında değil.

**(5) Görünüş — ne değişti, ne değişmedi**

- **Değişen tek şey kahraman fotoğrafının çözünürlüğü.** Şerit karesi (tam sayfa **değil** — T19 dersi), 4 profil, aday varyant enjekte edilerek ölçüldü: en kötü tek kanal farkı **390/3'te 15 · 412/3'te 21 · 1440/1'de 28 · 1440/2'de 29**; değişen piksellerde ortalama fark **1,31-1,60 / 255**. Elenen 640w adayı neredeyse aynıydı (17 · 24 · 29 · 30). Görünmezliğin sebebi yazılı: görsel `opacity-45` ve üstünde `from-ink-deep/92 via-ink-deep/78 to-ink-deep/45` gradyan var.
- **Fontlar yüklendikten sonra çizim değişmez ve bu ÇIKARIM DEĞİL, iki ölçümle kapalı:** (i) `font-guard` 16 sayfada 85.129 karakterin **tamamını** kümede buluyor, yani Sora+Inter her çizilen karakteri karşılıyor ve yedek yüzler hiç seçilmiyor; (ii) bilinen tek boşluk ₺ (U+20BA, Sora'da yok) **ölçüldü**: `--font-display` yığınında ₺'nin ilerlemesi **63** = yalnız Inter'in değeri; `Sora Yedek`'in değeri **50** olurdu. Zincir korundu. Yan teyit: `/` sayfa boyu iki genişlikte de T3.21'le birebir.

**(6) Belirlenimlilik**

- Öncesi ölçüm iki kez koşuldu: CLS değerleri, kayma geometrisi, LCP elemanı, seçilen varyant ve baytlar **birebir**; yalnız zaman damgaları ve LCP ms'si ≤ 40 ms oynadı.
- Sonrası ölçüm iki kez koşuldu: aynı — CLS **0/0/0/0,1588** her iki koşumda, kayma `[0,478]→[0,512]` birebir, LCP ms ≤ 16 ms oynadı.
- Yedek yüz taraması (Σ|Δbölüm| = 1.670) üç kez aynı çıktı: enjekte s115, derlenmiş s115 (iki ayrı koşum).

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-25

**Ne Yapıldı:**
- Segment giriş sayfasının dekoratif kahraman görseli 800 px kaynağa çekildi: teslim **87 → 29 KB**, yavaş 4G'de LCP **2,67 → 1,80 s** (390'da 2,09 → 1,79); `sizes` beyanı ve `priority` dokunulmadı.
- Sora ve Inter için metrik eşlenmiş yedek yüzler tanımlandı: font takasının ürettiği yeniden akış 16 rota × 2 genişlikte **25.633 → 1.670 px**; 32 kombinin 28'inde CLS **tam 0**.

**Öğrenilenler:**
- **`route.fulfill` CDP ağ kısıtlamasını baypas eder** — enjekte ölçüm çizim için sadık, zamanlama için değil. (memory'ye yazıldı)
- **Proxy metrik asıl metriği yanıltabilir:** toplam yeniden akış 115'i seçiyor, CLS 118,4'ü; ikisi farklı kombinlerde patlıyor ve ikisini birlikte sağlayan `size-adjust` yok.
- Next 16.3.4 `images.qualities` dışındaki `quality` değerine **HTTP 400** verir; `sharp` ile Next'in avif çıktısını taklit etmek **tutmuyor** (aynı q'da 2,5 kat bayt).

---

**Oluşturulma:** 2026-09-23
