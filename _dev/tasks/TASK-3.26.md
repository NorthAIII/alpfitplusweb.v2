# TASK-3.26: `/gecis`'in altı kontrast kalemi — kontrast kapısı yeşile döner

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M2 — Sayfalar ve Bölümler (`modules/M2-Sayfalar-ve-Bolumler.md`)
**Feature:** F2.2 — Alt sayfalar
**Faz:** Phase 3 (`phases/PHASE-3.md`)
**Bağımlılıklar:** TASK-3.04 ✅ (piksel kontrast ölçümü) · TASK-3.13 ✅ (dekoratif rakam emsali)

---

## Hedef

`/gecis` rotasındaki **altı** ölçülmüş AA kontrast ihlalini kapatmak; bunlar `a11y.mjs`'i bugün kırmızı tutan tek kalemlerdir. Üçü dekoratif dev adım rakamı (`01`/`02`/`03`), üçü gerçekten okunması gereken metin. Task, kapı 16 rotada **TOPLAM SORUN 0 · çıkış 0** verdiğinde tamamlanmış sayılır — ve düzeltmeler 1440 px'in yanında **320 ve 390 px'te de** ölçülür.

---

## Bağlam

Faz 3'ün kayıtlı kullanıcı kararı şudur: *"Kontrast ihlallerinin tamamı bu fazda düzelir — kayıtlı beş kalem değil, **ölçümün bulduğu küme**"* (`PHASE-3-KAPSAM.md` / Teknik Kararlar, 2026-09-23). Bu altı kalem tam o kümenin içindedir: kapı 16 rotaya çıktığında ilk kez göründüler (`/gecis` daha önce a11y listesinde hiç yoktu) ve fazın 25 task'ının hiçbiri onları adlandırmadı — **TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyordu.** Yani eksik olan bir kapsam kararı değil, bir plan halkasıydı; verify-phase UAT'ı (senaryo 3) bunu ❌ ile açığa çıkardı.

**Üçünün çaresi zaten kararlı ve emsali aynı depoda.** Kullanıcının 404 için verdiği karar: *"dekoratif ilan edilir, `aria-hidden` konur, görünüş korunur, kontrastı yükseltilmez."* `/gecis`'in üç dev adım rakamı **aynı sınıf ve aynı renk** (`text-sage-wash-2`) ve `WhyUs.tsx:64` ile `not-found.tsx:20` bu deseni zaten taşıyor — ölçüldü (2026-09-26, yayın kopyası): o ikisi `aria-hidden=true`, `/gecis`'inki **false**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/docs/STYLE-GUIDE.md` → *Dekoratif tipografi jesti `aria-hidden` alır* — kuralın tam metni, emsalleri ve `sage-wash-2`'nin neden yükseltilemediğinin ölçümü
- `_dev/docs/STYLE-GUIDE.md` → *`faint`in AA payı ve kompozisyon kuralı* — kompozisyonlu zeminde hangi mürekkebin kullanılacağı (`faint` değil `muted`)
- `_dev/phases/PHASE-3-UAT.md` → senaryo 3 — altı kalemin ölçülen değerleri
- `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar — `a11y.mjs`'in eşiği, kapsamı ve kapsam tabanları

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durumu güncelle **ve** UAT özetindeki kalan-kalem satırını güncelle
- `_dev/phases/PHASE-3-UAT.md` — senaryo 3'ün sonucu (yeniden koşumda)
- `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar — `a11y.mjs` satırının eşiği (**6 → 0**) ve kapsamı
- `_dev/docs/STYLE-GUIDE.md` — yalnız yeni bir kural/ölçüm doğarsa (dokunulmaz sınıf: refleks listesine ve token değerlerine dokunulmaz)
- `_dev/BULGULAR.md` — `[TASK-3.03]` ve `[TASK-3.04]` Gelen Kutusu satırlarının mezuniyeti (altı kalem artık task'ın kapsamında) · `bulgular/archive/B-032-*.md` → Çözüm Kaydı'nın *"kapsanmayan yüzey"* satırı kapanır

---

## Alt Görevler

- [ ] **1. Üç dev adım rakamını dekoratif ilan et**
  - `src/app/gecis/page.tsx:69` — `<span className="font-display text-4xl font-extrabold text-sage-wash-2">` → `aria-hidden` ekle
  - Renge **dokunma**: `sage-wash-2` canvas üstünde 1,17 ve kompozisyon payı ihmal edilebilir; yükseltmek görünüşü bozar (STYLE-GUIDE'da ölçülü)
  - Bilgi kaybı olmadığını doğrula: adımın kendi başlığı (`f.q`, `h3`) sırayı zaten söylüyor mu?

- [ ] **2. "Elle tutulan kayıtlar için birlikte bir öncelik…" paragrafını AA'ya çıkar**
  - Ölçülen: `p02` **3,25** · min 3,21 · **med 7,05** · 15px/400 · glif 2955px. `med`in yüksekliği metnin **kompozisyonlu** bir zeminde (desen ya da gradyan) durduğunu söylüyor
  - Önce zemini teşhis et, sonra STYLE-GUIDE'ın kuralını uygula: kompozisyonlu zeminde `faint` kullanılmaz, bir tık koyu `muted` kullanılır
  - `grep -n` ile yeniden konumla — satır numaraları faz boyunca kaydı

- [ ] **3. Küçük adım rakamlarını (`1`, `2`) AA'ya çıkar**
  - Ölçülen: `1` **p02 3,49** (min 3,49 · med 8,73) · `2` **p02 4,23** (min 4,23 · med 8,91) · ikisi de **14px/800**
  - ⚠️ 14px/800 **büyük metin değildir** (eşik 4,5, 3,0 değil — büyük metin ölçütü ≥ 24px ya da ≥ 18,66px bold)
  - Bunlar bilgi taşıyor mu taşımıyor mu ayır: taşıyorsa kontrast yükselir, dekoratifse (1. alt görevle aynı sınıf) `aria-hidden` alır. Karar Noktaları'na bak

- [ ] **4. Düzeltmeleri üç genişlikte ölç ve kapıyı koştur**
  - Aday değerleri kaynağa yazmadan önce `page.addStyleTag` ile yayın kopyasına enjekte ederek ölç (TASK-3.10'un yöntemi; sadakati birebir ölçüldü) — her aday için 2-4 dakikalık derleme beklenmez
  - Kazanan değer yazıldıktan sonra 3100 tazelenir (`docker compose --profile prod up -d --build web-prod`; `build` tek başına konteyneri yeniden yaratmaz) ve tazelik **pozitif kontrolle** doğrulanır
  - `a11y.mjs` + `mobile-audit.mjs` yeniden koşar

---

## Etkilenen Dosyalar

```
src/app/
└── gecis/page.tsx      # üç dev rakam aria-hidden; paragraf ve iki küçük rakam mürekkebi — zaten var
src/app/
└── globals.css         # yalnız kompozisyon kuralı bir token/sınıf değişimi gerektirirse — zaten var
```

---

## Dikkat Noktaları

- **Yargı `p02`'dir (en kötü %2 piksel), tek sayı değil dağılım.** `med`'e bakan bir kapı bu ihlallerin yarısını hiç görmez — "yeşile döndü" derken `p02`'ye bak (`docs/DECISIONS.md` 2026-09-24).
- **Kapı yalnız 1440 px'te koşuyor ve dar genişlikte kalem sayısı ARTABİLİYOR** (TASK-3.10'da üçüncü bir satır 320'de eşik altı çıktı, hiçbir kayıt söylemiyordu). Düzeltmeyi 320 ve 390'da kendin ölç.
- **Yargı her zaman 3100'e ait.** `BASE=http://localhost:3000` ile kontrast ölçme: `next dev` bir geliştirici göstergesi enjekte ediyor ve metnin üstüne biniyor — aynı etiket 3000'de **1,35**, 3100'de **9,54** (TASK-3.09'da ölçüldü).
- **Düzeltme token'a değil kullanım sınıfına iner.** `sage-wash-2` ve `faint` başka yerlerde **geçiyor**; token'ı koyulaştırmak onları da değiştirir (T11 ve T12'nin aynı ailesi).
- **`a11y.mjs`'in altı kapsam tabanına dokunma** (`BEKLENEN_ROTA=16` · `BEKLENEN_GRADYAN=19` · `BEKLENEN_BASLIK=316` vb.) — fail-open'ı kapatan onlardır; bir düzeltme tabanı oynatıyorsa gerekçesini yaz.
- **`/gecis`'te `aria-hidden` sayısı bugün 5.** Yeni bir `aria-hidden` eklerken ekran okuyucudan bilgi düşürmediğini kontrol et.

---

## Test Kriterleri

- [ ] `docker compose --profile research run --rm research node scripts/a11y.mjs` → 16 rotada **TOPLAM SORUN: 0 · çıkış 0**
- [ ] Aynı koşumda **kapsam tabanlarının hiçbiri oynamadı**: 16 rota · 105 ekran adımı (±) · 1834 eleman (±) · gradyan metin **19 (taban 19) / 0 eşik altı** · başlık **316 (taban 316) / 0 atlama** · `alt`sız img 0 · ölçülemeyen **kalan: 0**
- [ ] Altı kalemin her biri **320 · 390 · 1440 px**'te ayrıca ölçüldü ve `p02` eşiğin üstünde (14px/800 için eşik **4,5**, 3,0 değil)
- [ ] `mobile-audit.mjs` yeşil kaldı: **TOPLAM SORUN 0 · çıkış 0**, altı kapsam tabanı oynamadı
- [ ] `/gecis`'in görünüşü kasıtsız değişmedi — şerit karesi yöntemiyle ölçüldü (bölümün üstünden ve altından 900 px'lik görüntü-penceresi kareleri; **tam sayfa `fullPage` karesi çok uzun sayfada ASILIYOR**)
- [ ] `docker compose exec web npm test` → **219 geçti + 2 atlandı** (iki env kapısı kapalı) · `npx tsc --noEmit` → 0
- [ ] `a11y.mjs`'in kırmızı dalı hâlâ çalışıyor — `kontrol:` ölü hedefte (`BASE=http://localhost:3457`) cümle + **çıkış 1**

---

## Karar Noktaları

- **Küçük adım rakamları (`1`, `2`) dekoratif mi, bilgi mi?** `aria-hidden` (1. alt görevle aynı sınıf, renk korunur) vs kontrastı 4,5'e çıkarmak (renk değişir, görünüş değişir) → **ölçüp karar ver:** rakamın taşıdığı bilgi komşu metinde zaten yazılıysa dekoratiftir; yazılı değilse kontrast yükselir. Belirsizse kullanıcıya sor — 404 emsali yalnız *bilgi taşımayan* jest için verildi.

---

## Risk ve Geri Dönüş Planı

- **Risk:** kompozisyonlu zemindeki paragrafın mürekkebi koyulaşınca bölümün görsel tonu değişir → şerit karesiyle ölç, fark 0 piksel değilse kullanıcıya göster
- **Rollback:** tek dosya, tek commit — `git revert <hash>`; commit'lenmemiş hâlde `git checkout -- <dosya>` **kullanma** (o dosyadaki commit'lenmemiş işi iz bırakmadan siler)

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- Task çalıştırıldığında doldurulacak -->

---

**Oluşturulma:** 2026-09-26 (verify-phase Adım 7 — UAT senaryo 3'ün ❌'inden doğdu)
