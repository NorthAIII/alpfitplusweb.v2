# TASK-3.13: 404 ve çöküş sayfası — dev rakam dekoratif olur, başlık hiyerarşisi düzelir

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.06 ✅

---

## Hedef

Hata yüzeylerinin iki erişilebilirlik kalemini kapatmak:

1. **Dev rakam dekoratif ilan edilir** (`aria-hidden`), kontrastı yükseltilmez. `not-found.tsx`'teki "404" (`text-sage-wash-2`, 112 px) canvas üstünde **1,12-1,17:1**; `global-error.tsx`'teki "Hata" eşi **1,17:1**. Görünüş korunur, ekran okuyucu artık okumaz, kontrast kuralının dışına çıkar — sayfanın `h1`'i hatayı zaten söylüyor, yani bilgi kaybı yok.
2. **Başlık hiyerarşisi atlaması düzelir.** 404'te dizi `h1 h3 h3 h3`; kaynağı `Footer.tsx`'in kolon başlıkları — `h3` ve sahipsiz. Gövdesinde `h2` olan sayfalarda görünmüyor, 404'te ölçülebilir ihlale dönüşüyor.

---

## Bağlam

Kullanıcı kararı (PHASE-3 → Alınan Kararlar): *"404 ve çöküş sayfasındaki dev rakam dekoratif ilan edilir, kontrastı yükseltilmez."* Bu karar aynı zamanda `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyordu — B-032'nin beşinci kalemi böyle kapanır.

**Sahipsiz alan notu:** 404 ve çöküş sayfası bugüne dek hiçbir feature'ın kabul kriterinde yoktu ve kapı da onları gezmiyordu; TASK-3.03'ün 16 rota kararıyla ikisi de kapı listesine girdi.

**Kapsam sınırı:** bu sayfaların markalanması ve istemci çöküşünün bir yere yazılması **kapsam dışıdır** (B-045 → teknik borç). Burada yalnız kontrast ve başlık kalemlerine dokunulur.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 5
- `_dev/bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md` — kalem (4), başlık hiyerarşisi
- `_dev/phases/PHASE-3.md` — Alınan Kararlar (404 kararı ve sahipsiz alan notu)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.2'ye 404/çöküş yüzeyinin kabul kriteri (bugün hiçbir feature'a ait değil)

---

## Alt Görevler

- [x] **1. Dev rakamı dekoratif ilan et**
  - `src/app/not-found.tsx` → "404" paragrafına `aria-hidden`; `src/app/global-error.tsx` → "Hata" eşine aynısı (⚠️ `grep -n` ile konumlan)
  - Görünüş değişmez — renk, punto, yerleşim korunur

- [x] **2. Başlık hiyerarşisini düzelt**
  - `src/components/layout/Footer.tsx` kolon başlıkları `h3` ve sahipsiz; iki yol var: başlıkları `h2`'ye çekmek ya da alt bilgiye bir üst başlık vermek (ekran okuyucuya görünür, gözle gizli)
  - Ölçüt: 16 rotanın hiçbirinde seviye atlaması kalmamalı — alt bilgi her sayfada olduğu için çözüm sayfa gövdesindeki `h2` varlığına bağlı olmamalı

- [x] **3. Ekran okuyucu sırasını gözden geçir**
  - `aria-hidden` sonrası 404'ün ilk duyurulan öğesi `h1` olmalı

---

## Etkilenen Dosyalar

```
src/app/not-found.tsx               # dev rakam → aria-hidden
src/app/global-error.tsx            # "Hata" eşi → aria-hidden
src/components/layout/Footer.tsx    # kolon başlıklarının seviyesi / sahiplenmesi
```

---

## Dikkat Noktaları

- **Kontrastı yükseltme.** Karar açıkça görünüşü koruma yönünde — rengi koyulaştırmak bu kararı bozar.
- **`aria-hidden` kapının kuralını da değiştirir:** dekoratif ilan edilen metin kontrast ölçümünün dışına çıkar. TASK-3.04'ün ölçümü `aria-hidden` öğeleri dışarıda bırakmalı — bırakmıyorsa bu bir kapı hatasıdır, çözümü orada.
- **Alt bilgi her sayfada.** `Footer` değişikliği 16 rotanın hepsini etkiler; düzeltme sonrası tüm rotalarda başlık dizisi yeniden ölçülür.
- **Gözle gizli başlık eklenecekse** ekran okuyucuya görünür kalmalı (`sr-only` deyimi) — `display:none` ekran okuyucudan da düşürür ve atlamayı çözmez.
- **Gerçek ekran okuyucu denemesi bu fazın kapsamı dışında** (projede ölçüm kanalı yok); doğrulama erişilebilirlik ağacı üzerinden koda dayalı yapılır.

---

## Test Kriterleri

- [x] `a11y.mjs`'te 404 ve çöküş sayfasının dev rakam kalemi **artık ölçüme girmiyor** (dekoratif) ve eşik altı kalemi bırakmıyor
- [x] Başlık hiyerarşisi dalı 16 rotanın hiçbirinde atlama bulmuyor
- [x] 404'ün erişilebilirlik ağacında ilk duyurulan öğe `h1` ("Bu sayfayı bulamadık")
- [x] Görünüş değişmedi — 404 sayfasının ekran görüntüsü öncesi/sonrası aynı
- [x] `a11y.mjs` 16 rotada **TOPLAM SORUN** satırı bu kalemler için 0; çıkış kodu bu sınıftan 1 dönmüyor

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Dev rakam dekoratif ilan edildi.** `not-found.tsx`'teki "404" ve `global-error.tsx`'teki "Hata" eşi `aria-hidden` aldı; renk, punto ve yerleşim **hiç değişmedi**.
- **Başlık hiyerarşisi GENEL düzeltmeyle kapandı.** `Footer.tsx`'in üç kolon başlığı `h3` → `h2`. Alt bilgi 16 sayfanın hepsinde durduğu için düzeltme 16 rotayı birden kapsar ve sayfa gövdesinde `h2` bulunup bulunmamasına **bağımlı değildir** (alt görev 2'nin ölçütü buydu).
- **Ekran okuyucu sırası ölçüldü.** 404'ün `main` bölgesinde belge sırasındaki ilk duyurulan öğe `heading (seviye 1) "Bu sayfayı bulamadık"`; "404" erişilebilirlik ağacında **hiç düğüm üretmiyor**.

**Sorunlar:**
- **Devralınan teşhis doğrulanmalıydı (T12 dersi):** kayıttaki 1,12 sayısı bir kompozisyon katmanına (desen / ışık lekesi) mi bağlıydı? İzolasyonla ölçüldü — desen kapalı **1,12** (hiç değişmiyor), ışık lekesi kapalı **1,17**, ikisi de kapalı **1,17**. Yani suçlu bir katman değil **token'ın kendisi** (`sage-wash-2` `#dfeddd`, canvas üstünde 1,17). Kontrastı 3:1'e çıkarmak rengi tanınmaz hâle getirirdi; kullanıcının "görünüşü koruma" kararıyla tek uyumlu yol `aria-hidden`. B-032 kalem 5'in teşhisi **çürümedi, doğrulandı**.
- **`aria-hidden` kapıyı gerçekten atlatıyor mu?** Ölçüldü (kaynağa dokunmadan, DOM'a enjekte ederek, üç genişlikte): ihlal 1 → **0**, ölçülen eleman 40 → **39**, kovalar (`yapışkan` · `görünmez` · `ekran dışı` · `kalan`) **birebir aynı** — yani kalem sessizce başka bir kovaya taşınmadı, kapsamdan tamamen çıktı.
- **Playwright'ın `page.accessibility` API'si kaldırılmış** (`TypeError: Cannot read properties of undefined`). Ağaç CDP ile alındı: `ctx.newCDPSession(page)` + `Accessibility.enable` + `Accessibility.getFullAXTree`. Not memory'ye yazıldı.
- **`scan.mjs` `/olmayan-sayfa`'da konsol hatası basıyor** — rota bilinçli olarak HTTP 404 döndüğü için tarayıcı belge yüklemesini hata sayıyor. Benim değişikliğimden doğmuyor (ARIA özniteliği ve etiket adı ağ isteği üretmez); Gelen Kutusu'na düştü.

**Kararlar:**
- **`Footer` kapsam kararı: GENEL (h3 → h2), yerel değil.** Beş gerekçe, dördü ölçülü: (1) alt görev 2'nin ölçütü zaten "sayfa gövdesindeki `h2` varlığına bağlı olmamalı" diyor — yerel düzeltme kapıyı yeşile çevirir, sahipsiz `h3` 15 sayfada kalırdı (T6'nın ölçümü, Gelen Kutusu `[TASK-3.06]`); (2) **görünüş değişmiyor** — `globals.css:147` `h1,h2,h3,h4`'ü aynı kurala bağlıyor, ölçü/ağırlık/harf aralığı buradaki yardımcı sınıflardan geliyor; piksel farkı **0** ölçüldü; (3) **kapsam tabanı oynamıyor** — görünür başlık 316 → **316**; (4) alternatif (`sr-only` bir `h2` sahibi eklemek) bileşene **yeni metin** sokardı (CLAUDE.md → Kod kuralları: metin `src/content/`'te) ve tabanı 316 → 332'ye taşıyıp bayatlatırdı; (5) yeni atlama üretmiyor — 16 rotanın dizisi tek tek ölçüldü, hepsi `… h2 h2 h2` ile bitiyor ve geriye dönüş (h3 → h2) kapının tanımında ihlal değil.
- **Kontrast yükseltilmedi** (kullanıcı kararı, PHASE-3 → Alınan Kararlar). İzolasyon ölçümü bu kararı destekliyor: düzeltilecek bir katman yok, tek yol rengi değiştirmekti.
- docs/DECISIONS.md'ye eklendi: **Hayır** — yeni bir mimari/sözleşme kararı doğmadı; 404 kararı PHASE-3 → Alınan Kararlar'da zaten kayıtlı, `Footer` seviyesi onun icrası. Tekrar eden **tasarım** kuralı (dekoratif rakam → `aria-hidden`) `docs/STYLE-GUIDE.md`'ye yazıldı.

**Kalan İşler:** yok.

**Son Yaklaşım:** —

**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/app/not-found.tsx` → dev "404" paragrafı `aria-hidden` aldı + ölçülmüş gerekçe yorumu
- `src/app/global-error.tsx` → "Hata" eşi `aria-hidden` aldı + yorum
- `src/components/layout/Footer.tsx` → kolon başlıkları `h3` → `h2` + kapsam gerekçesi yorumu

**Test Sonuçları:**
- **`a11y.mjs`** (3100'e karşı, 16 rota @1440×900, 69 sn, `reducedMotion: reduce`, etkileşimsiz hâl — B-015): `TOPLAM SORUN` **8 → 6**, çıkış kodu **1**. Kalan 6'nın hepsi `/gecis`'in adlandıran task'ı olmayan kalemleri; `/olmayan-sayfa` artık **kontrast ihlali 0 · başlık atlaması 0**, dizi `h1 h2 h2 h2`. Kapsam tabanları: rota 16 · gradyan **19/0** · görünür başlık **316 (taban 316)** · ölçülen eleman 1835 → **1834** (tam olarak `aria-hidden` verilen bir eleman) · kovalar yapışkan **151** · görünmez **43** · ekran dışı **0** · kalan **0** — hiçbiri oynamadı.
- **Negatif kontrol (aynı kapı, aynı hedef, düzeltme öncesi):** `TOPLAM SORUN` **8**, `/olmayan-sayfa`'da `✗ p02 1.12:1 (gereken 3) 112px "404"` **ve** `✗ [başlık] h1 → h3 atlaması · "Bu sayfayı bulamadık" → "Ürün"`. Yeşil bakmamaktan değil düzelmekten geldi.
- **Kalibrasyon:** B-032 kalem 5'in kayıtlı rakamı (1,12) taban koşumunda **birebir** yeniden üretildi.
- **İzolasyon (suçlu kim?):** `/olmayan-sayfa` @1440, enjekte CSS ile katman katman — olduğu gibi **1,12** · desen (`bg-dotgrid`) kapalı **1,12** (payı **tam 0**) · ışık lekesi (`bg-glow-soft`) kapalı **1,17** · ikisi de kapalı **1,17**. Yani `sage-wash-2`'nin canvas üstündeki kendi değeri 1,17 ve hiçbir katman düzeltmesi 3:1'e ulaştıramaz.
- **`aria-hidden` kapıyı atlatıyor mu (üç genişlikte, enjekte):** @1440 ihlal 1 → 0 / ölçülen 40 → 39 · @390 1 → 0 / 40 → 39 (p02 1,10) · @320 1 → 0 / 40 → 39 (p02 1,10). Kovalar üç genişlikte de **değişmedi**.
- **Enjekte ↔ gerçek derleme:** gerçek derlemede `/olmayan-sayfa` üç genişlikte de **ihlal 0 · ölçülen 39** — enjekte ölçümle birebir.
- **Dar genişlikler (kapı oraya bakmıyor), gerçek derleme:** `/olmayan-sayfa` @390 **0**, @320 **0** (öncesi her ikisinde 1). `/` @390 **1**, @320 **4** — T12'nin kaydettiği sayılarla **birebir**, yani değişmedi. `/demo` @390 **1** (4,47), @320 **2** (1,18 · 1,20) — üst üste binme sınıfı, bu turda ilk kez ölçüldü, Gelen Kutusu'na düştü.
- **Görünüş (izlenim değil ölçüm):** yayın kopyasının sonraki hâlinde kare alındı, sonra DOM'da değişiklik **geri alındı** (`aria-hidden` söküldü, `footer h2` → aynı öznitelikli `h3`) ve ikinci kare alındı. **6 kombinde (2 rota × 3 genişlik) FARKLI PİKSEL 0**, kare boyları birebir: `/olmayan-sayfa` 1440×1524 · 390×2476 · 320×2606, `/demo` 1440×2315 · 390×4435 · 320×4660 — toplam 10,5 milyon piksel.
- **Erişilebilirlik ağacı (CDP `Accessibility.getFullAXTree`):** `/olmayan-sayfa`'da `"404"` adlı AX düğümü **0 adet** (yok sayılan olarak bile yok — `aria-hidden` alt ağacı budar); `main` bölgesinde belge sırasındaki ilk anlamlı düğüm `heading (seviye 1): "Bu sayfayı bulamadık"`.
- **Başlık dizisi, 16 rotanın hepsi:** öncesi her rota `… h3 h3 h3` ile bitiyordu (alt bilgi), sonrası `… h2 h2 h2`. Toplam görünür başlık **316 → 316**, atlamalı rota **1 → 0**, atlama **1 → 0**.
- **Regresyon:** `mobile-audit.mjs` **285**, çıkış 1 (çizgiyle birebir; tabanlar 2038 metin elemanı / 289 kritik hedef / 5 şerit, üçü de yerinde) · `font-guard.mjs` çıkış **0** (16 sayfa / 85.129 karakter) · `scan.mjs` `/` @1440 ve `/demo` @390 **konsol temiz**, `/olmayan-sayfa` @1440'ta rotanın kendi HTTP 404'ü konsol hatası sayılıyor (aşağıda) · `npm test` **210 geçti + 2 atlandı** (çıkış 0) · `tsc --noEmit` çıkış **0** · `npm run lint` 30 problem — **hiçbiri yeni değil**, üç dosyadaki üç bulgunun üçü de satır kayması hesabıyla önceden vardı (`not-found` 30→38, `global-error` 34→37 ve 61→64), `Footer.tsx`'te bulgu yok.
- **3100 tazelendi ve pozitif kontrolle doğrulandı:** `lastmod` 16:45:34.132Z → **17:09:29.725Z**; `/olmayan-sayfa` `<h3` **3 → 0** · `<h2` **0 → 3**, 404 paragrafı `aria-hidden="true"` taşıyor; `/demo` `<h3` **3 → 0** · `<h2` **2 → 5**. **Negatif taraf:** stil parçası adı **aynı** (`3akz_pa--pbiq.css` — beklenen: CSS'e dokunulmadı), `/ozellikler` `text-faint` **13 → 13** · `<h1` **1 → 1**, `/olmayan-sayfa` `text-sage-wash-2` **3 → 3** (renk değişmedi).

---

**Oluşturulma:** 2026-09-23
