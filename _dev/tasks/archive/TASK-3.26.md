# TASK-3.26: `/gecis`'in altı kontrast kalemi — kontrast kapısı yeşile döner

**Durum:** ✅ Tamamlandı — **beş kalem ölçülerek kapandı; altıncısı sayfa kusuru değil ÖLÇÜM BETİĞİNİN kör noktası olarak ölçüldü ve kullanıcı kararıyla B-063'ün açık kaydına bırakıldı** (karar 2026-09-26, seçenek B; tam metin → Kapanış Gerekçesi)

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

- [x] **1. Üç dev adım rakamını dekoratif ilan et**
  - `src/app/gecis/page.tsx:69` — `<span className="font-display text-4xl font-extrabold text-sage-wash-2">` → `aria-hidden` ekle
  - Renge **dokunma**: `sage-wash-2` canvas üstünde 1,17 ve kompozisyon payı ihmal edilebilir; yükseltmek görünüşü bozar (STYLE-GUIDE'da ölçülü)
  - Bilgi kaybı olmadığını doğrula: adımın kendi başlığı (`f.q`, `h3`) sırayı zaten söylüyor mu?

- [x] **2. "Elle tutulan kayıtlar için birlikte bir öncelik…" paragrafını AA'ya çıkar** ⚠️ **KONUSUZ ÇIKTI — bu alt görevin ÖNCÜLÜ ÖLÇÜLEREK ÇÜRÜTÜLDÜ:** paragraf kompozisyonlu bir zeminde durmuyor, zemini saf beyaz ve gerçek değeri **7,05** (yani AA'nın zaten çok üstünde). Yapılacak bir mürekkep düzeltmesi **yoktu**; kalan kırmızı `a11y.mjs`'in maske sızıntısıdır (B-063) ve **kullanıcı kararıyla** o borcun açık kaydına bırakıldı (2026-09-26, seçenek B). Sayfada **hiçbir şey değiştirilmedi** — yanlış şeyi düzeltmemek bu alt görevin sonucudur
  - Ölçülen: `p02` **3,25** · min 3,21 · **med 7,05** · 15px/400 · glif 2955px. `med`in yüksekliği metnin **kompozisyonlu** bir zeminde (desen ya da gradyan) durduğunu söylüyor
  - Önce zemini teşhis et, sonra STYLE-GUIDE'ın kuralını uygula: kompozisyonlu zeminde `faint` kullanılmaz, bir tık koyu `muted` kullanılır
  - `grep -n` ile yeniden konumla — satır numaraları faz boyunca kaydı

- [x] **3. Küçük adım rakamlarını (`1`, `2`) AA'ya çıkar**
  - Ölçülen: `1` **p02 3,49** (min 3,49 · med 8,73) · `2` **p02 4,23** (min 4,23 · med 8,91) · ikisi de **14px/800**
  - ⚠️ 14px/800 **büyük metin değildir** (eşik 4,5, 3,0 değil — büyük metin ölçütü ≥ 24px ya da ≥ 18,66px bold)
  - Bunlar bilgi taşıyor mu taşımıyor mu ayır: taşıyorsa kontrast yükselir, dekoratifse (1. alt görevle aynı sınıf) `aria-hidden` alır. Karar Noktaları'na bak

- [x] **4. Düzeltmeleri üç genişlikte ölç ve kapıyı koştur**
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

- [x] `docker compose --profile research run --rm research node scripts/a11y.mjs` → 16 rotada **TOPLAM SORUN: 0 · çıkış 0** — **ÖLÇÜT KULLANICI KARARIYLA YENİDEN TANIMLANDI (2026-09-26, seçenek B): sayfa tarafında ölçülmüş kontrast ihlali kalmadı; kapı 6 → 1 ve kalan 1 kalem ölçüm betiğinin kendi kör noktası (B-063), açık kayıt olarak duruyor.** Ölçülen: **1 · çıkış 1** (yani kapı hâlâ kırmızı ve bu **bilinçli**; gerekçe → Kapanış Gerekçesi)
- [x] Aynı koşumda **kapsam tabanlarının hiçbiri oynamadı**: 16 rota ✓ · 105 ekran adımı ✓ · **1834 → 1831 eleman** (bilinçli: üç dev rakam `aria-hidden` ile kapsamdan çıktı, taban değil ölçüm sayısıdır) · gradyan metin **19 (taban 19) / 0** ✓ · başlık **316 (taban 316) / 0 atlama** ✓ — **`aria-hidden` hiçbir başlığı düşürmedi** · `alt`sız img 0 ✓ · ölçülemeyen **kalan: 0** ✓ · yapışkan 151 ✓ · görünmez 43 ✓
- [x] Altı kalemin her biri **320 · 390 · 1440 px**'te ayrıca ölçüldü (eşik 14px/800 için **4,5**, 3,0 değil — uygulandı)
- [x] `mobile-audit.mjs` yeşil kaldı: **TOPLAM SORUN 0 · çıkış 0 · ✓ KAPI YEŞİL**, altı kapsam tabanının hiçbiri oynamadı
- [x] `/gecis`'in görünüşü kasıtsız değişmedi — üç genişlikte tam sayfa kapsayan **28 görüntü-penceresi karesi** (şerit yöntemi; `fullPage` kullanılmadı): 22 karede **0 farklı piksel**, kalan 6 karede fark yalnız rozet sütununda ve %93'ü 1-2 kanal birimi; sayfa boyu üç genişlikte de **birebir**
- [x] `docker compose exec web npm test` → **219 geçti + 2 atlandı** · `npx tsc --noEmit` → **0** · `lint` 30 (değişen dosyada **0** kalem)
- [x] `a11y.mjs`'in kırmızı dalı hâlâ çalışıyor — ölü hedefte (`BASE=http://localhost:3457`) cümle + **çıkış 1** (yığın izi yok)

---

## Karar Noktaları

- **Küçük adım rakamları (`1`, `2`) dekoratif mi, bilgi mi?** `aria-hidden` (1. alt görevle aynı sınıf, renk korunur) vs kontrastı 4,5'e çıkarmak (renk değişir, görünüş değişir) → **ölçüp karar ver:** rakamın taşıdığı bilgi komşu metinde zaten yazılıysa dekoratiftir; yazılı değilse kontrast yükselir. Belirsizse kullanıcıya sor — 404 emsali yalnız *bilgi taşımayan* jest için verildi.

---

## Risk ve Geri Dönüş Planı

- **Risk:** kompozisyonlu zemindeki paragrafın mürekkebi koyulaşınca bölümün görsel tonu değişir → şerit karesiyle ölç, fark 0 piksel değilse kullanıcıya göster
- **Rollback:** tek dosya, tek commit — `git revert <hash>`; commit'lenmemiş hâlde `git checkout -- <dosya>` **kullanma** (o dosyadaki commit'lenmemiş işi iz bırakmadan siler)

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı (2. alt görev **konusuz** çıktı — öncülü ölçülerek çürütüldü, sayfada yapılacak iş yoktu)
- [x] Tüm test kriterleri karşılandı — ilki **kullanıcının kendi tanımıyla** (2026-09-26, seçenek B): sayfa tarafında ölçülmüş kontrast ihlali kalmadı, kapı `1 · çıkış 1` ile kapandı ve kalan kalem B-063'ün açık kaydında
- [x] Git commit & push yapıldı (iki commit: kod+doküman, sonra karar kapanışı)
- [x] Bu doküman güncellendi (iki oturum kaydı + Kapanış Gerekçesi + Sonuç Özeti)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-26

**Durum:** 🔄 Devam edecek — **6 kalemin 5'i kapandı; 6.'sı sayfanın kusuru değilmiş, kullanıcı kararı bekliyor**

**Yapılanlar:**
- **Alt görev 1 — üç dev adım rakamı (`01`/`02`/`03`) dekoratif ilan edildi.** `gecis/page.tsx` kart rakamına `aria-hidden` kondu, **renge dokunulmadı**. Sınıf varsayılmadı, ölçüldü: `p02` = `min` = `med` = **1,21** ve zemin **320/390/1440 px'in üçünde de `rgb(255,255,255)` — 652/804/798 pikselin tamamı**, yani kompozisyon payı **tam 0** ve tek çarpan rengin kendi değeri (T13'ün 404 ölçümüyle aynı sonuç). Bilgi kaybı kontrolü: kartın kendi `h3`'ü sorunun **tam metnini** taşıyor, bölüm başlığı zaten *"Üç soru"* diyor, ve kart bir `<ol>` öğesi değil **grid hücresi** — yani düşürülen bir liste semantiği de yok.
- **Alt görev 3 — küçük adım rakamları (`1`, `2`) AA'ya çıkarıldı, ama RENKLE DEĞİL.** Teşhis izolasyonla yapıldı: ihlal veren pikseller **tek bir sütunda** (x=711 @1440) ve zeminleri `rgb(76,103,73)` / `rgb(72,88,69)` iken rozetin geri kalanı `rgb(33,35,31)` — suçlu, yarı saydam (`bg-white/8`) rozetin **altından geçen 1 px'lik dikey bağlantı çizgisi** (`from-sage/45`). Rozet zemini aynı bileşke değerle **opaklaştırıldı** (`bg-[color-mix(in_srgb,#fff_8%,var(--color-ink-deep))]`); rakamın rengi (`sage-br`) korundu.
- **Alt görev 4 — üç genişlikte ölçüm + iki kapı + görünüş + belirlenimlilik + kırmızı dal kontrolü** (aşağıda Test Sonuçları).
- **Alt görev 2 — YAPILMADI, çünkü öncülü çürütüldü** (aşağıda Sorunlar).
- **Doküman:** `docs/STYLE-GUIDE.md` (üç ölçülmüş kalem) · `modules/M6-Kalite-Kapilari.md` (regresyon satırı + kapının üçüncü kör noktası) · `bulgular/B-063-*.md` (borcun ikinci yüzü + naif yamanın ölçülmüş bedeli) + `BULGULAR.md` kancası.

**Sorunlar:**
- **Altı kalemden biri SAYFANIN DEĞİL ÖLÇÜMÜN kusuru çıktı — task dokümanının kendi teşhisi ölçülerek çürütüldü.** Task *"`med`in yüksekliği metnin kompozisyonlu bir zeminde durduğunu söylüyor → `faint` yerine `muted`"* diyordu. Ölçüm: paragraf **zaten `muted`**, `med` **7,05** = `muted`'ın saf beyaz üstündeki tam değeri, ve zemin dağılımı 2955 pikselin 1744'ünde `rgb(255,255,255)`. Yani kompozisyonlu zemin **yok**. Gerçek mekanizma: kontrast maskesi iki karenin piksel farkıdır ve **glifin kime ait olduğunu bilemez**; yapışkan başlık (`bg-canvas/88 backdrop-blur-xl`, 68 px) adım ızgarasının bir adımında paragrafın ilk satırını örtüyor ve **başlığın kendi çağrı düğmesinin etiketi** paragrafın maskesine giriyor — kapı da paragrafın mürekkebini o düğmenin sage zeminiyle eşleştiriyor. **İki bağımsız izolasyon:** (a) `header{display:none}` → `p02` 3,25 → **7,05**, zemin tek renk beyaz; (b) başlığın **yalnız kendi metni** iki karede de şeffaf (geometri, bulanıklık, düğme zemini aynen yerinde) → maske **2955 → 1861 px**, `p02` → **6,98**; düşen 1094 piksel düğmenin etiketi. **Üçüncü kontrol:** aynı paragraf 390 px'te **7,05**, 320 px'te **6,80** — kalem tek genişlikte, tek adımda var.
- **Naif çare ölçüldü ve reddedildi.** *"Örtülü adımda o elemanı ölçme"* yaması 16 rotada koşuldu (kaynağa dokunulmadan, scratchpad kopyasıyla): `TOPLAM SORUN` 6 → **5** (artefakt düşüyor, beş gerçek kalem rakamıyla duruyor) **ama gradyan metin 19 → 18** (kendi kapsam tabanının altına düşüyor → kapı başka sebeple kırmızı) ve **"ekran dışı" 0 → 8** (bu sekiz eleman hiçbir adımda başlığın altından çıkmıyor, yani hiç ölçülmez oluyor); 171 (eleman, adım) çifti atlandı. Doğru çare B-063'ün kendi kayıtlı önerisidir — yapışkan katmanlar için **kaydırma sıfırdayken ikinci bir tur** — ve o tur **bilinçle ertelendi** (kullanıcı kararı, verify-plan 2026-09-23 → "Kalite kapıları otomatik" fazı).

**Kararlar:**
- **Küçük rakamlar `aria-hidden` ALMADI — bilgi taşıyorlar:** komşu `h3` gün **adını** söylüyor ("Sözleşme günü", "Hazırlık", "Kontrol", "Geçiş günü", "İlk hafta"), sırayı yalnız rakam yazıyor. `<ol>`'un sıra semantiğine dayanmak da reddedildi: Tailwind preflight `list-style: none` veriyor ve bazı ekran okuyucuları o hâlde liste rolünü düşürüyor — **bu projede ekran okuyucu ölçüm kanalı yok**, yani ölçülemeyen bir şey tercihin dayanağı yapılmadı.
- **Rakamın rengi yerine rozetin zemini düzeltildi:** `sage-br`'yi `rgb(76,103,73)` zeminine karşı 4,5'e taşımak için gereken metin ışığı **0,70** (bugünkü `sage-br` 0,53) — yani rakam neredeyse beyaz olurdu. Zemini opaklaştırmak aynı sonucu **rengi hiç değiştirmeden** verdi ve beş rakamı birden `8,81`'e çıkardı.
- **`a11y.mjs`'e DOKUNULMADI.** Kapıyı onarmak B-063'ün bilinçle ertelenmiş alanına girer ve aksi yönde **tarihli bir kullanıcı kaydı** var; üstelik naif yaması ölçülerek yetersiz çıktı. Kapıyı "kalemi görmesin" diye değiştirmek de ölçümü kılavuzlamak olurdu.
- docs/DECISIONS.md'ye eklendi: **Hayır** — bu turda geri alınamaz bir sözleşme/ad/şema kararı doğmadı; doğacak karar (kapının ikinci turu bu faza girsin mi) kullanıcıya ait ve henüz verilmedi.

**Kalan İşler:**
- **Tek kalem:** `a11y` kapısının son 1 kırmızısı. İki yol var ve seçim **kullanıcınındır**: (A) B-063'ün iki turlu çaresi bu faza alınır → yeni bir task gerekir (`run-task` task yazamaz; evi `plan-phase` revizyon modu); (B) kapı **1 ile** kapanır, kalem B-063'te ölçülmüş hâliyle durur ve fazın *"beş ölçüm yeşil"* kriteri bu kalemle birlikte `review-phase`'de hükme bağlanır.
- **TASK-3.27 bu kararı BEKLEMİYOR** — konusu ayrı (hareket azaltmada çapa kaydırması) ve bu turdan etkilenmedi.

**Son Yaklaşım:**
Beş kalem kapandı ve kapı 6 → 1'e indi. Kalan 1, `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafı; sayfada düzeltilecek bir şey **yok** (gerçek değeri 7,05, iki izolasyonla). Kapıyı 0'a indirmenin tek yolu ölçüm betiğini onarmaktır ve o iş B-063'ün ertelenmiş alanıdır.

**Sonraki Adım Detayı:**
Kullanıcı (A) derse: `plan-phase` revizyon modunda B-063'ün iki turlu çaresi için task yazılır — **iki madde birlikte** kurulmalı (akan turda örtülü piksel maskeye girmez **+** yapışkan katmanlar kaydırma sıfırdayken ayrı turda ölçülür), yoksa gradyan tabanı 18'e düşer ve 8 eleman ölçüm dışına çıkar (ölçüldü). Dışarıda bırakılan piksel ayrıca raporlanmalı ve eşiklenmeli. (B) derse: bu task ✅ ile kapanır (beş kalem kapandı), `PHASE-3.md` → Milestone hükmünde *"ölçülmüş kontrast ihlali kalmadı"* kriteri **kalan 1'in artefakt olduğu** kaydıyla değerlendirilir ve `verify-phase` baştan koşar. İki hâlde de bu turun kod değişikliği yerinde kalır.

**Dosya Değişiklikleri:**
- `src/app/gecis/page.tsx` → iki değişiklik: (1) `:69` dev adım rakamına `aria-hidden` + ölçümlü gerekçe yorumu; (2) `:206` rozet zemini `bg-white/8` → `bg-[color-mix(in_srgb,#fff_8%,var(--color-ink-deep))]` + ölçümlü gerekçe yorumu. **`globals.css`'e dokunulmadı** (token değişimi gerekmedi — düzeltme kullanım sınıfına indi, T11/T12'nin ailesi).
- `_dev/docs/STYLE-GUIDE.md` → dekoratif jest kuralının **sınırı** (sıra numarası her zaman dekoratif değil) · `faint` bloğuna **teşhis uyarısı** (`p02` düşük + `med` yüksek ≠ kompozisyonlu zemin) · Düzen Tuzakları'na **yarı saydam rozet** kalemi. Refleks listesine ve token değerlerine dokunulmadı.
- `_dev/modules/M6-Kalite-Kapilari.md` → `a11y.mjs` regresyon satırı (6 → 1, 1834 → 1831) + **Maske sızıntısı** başlığı (mekanizma, üç ölçüm, naif yamanın tablosu).
- `_dev/bulgular/B-063-*.md` → *İkinci yüz* bölümü + kanıt + reddedilen yamanın tablosu + Koruma Önerisi'ne ikinci madde. `BULGULAR.md` → kanca satırı ve Son Güncelleme.

**Test Sonuçları:**
<!-- Ölçüm kimliğiyle: ne çalıştırıldı, hangi kapsamda. -->
- **Hedef ve tazelik.** Yargı **yayın kopyası (3100)**; `scan.mjs` betikte sabit olduğu için **geliştirme sunucusu (3000)**. 3100 **iki kez tazelendi** (`--profile prod up -d --build web-prod`): `lastmod` **2026-09-25T01:05:55.970Z → 2026-09-26T10:57:52.747Z** (kod değişikliği) **→ 2026-09-26T11:22:05.415Z** (yalnız bir kod yorumu düzeltildi; kapı bu son imaja karşı **üçüncü kez** koştu ve yedi rakam birebir çıktı). **Pozitif kontrol (her iki derlemede):** `/gecis`'te `aria-hidden="true">01` ×1 · üretilen CSS'te `color-mix(in srgb,#fff 8%,var(--color-ink-deep))` ×1 · `/` hâlâ `-sm.webp` ×**68** (taban). **Negatif kontrol:** eski `rounded-2xl bg-white/8` ×**0** · olmayan varlık `salon-genis.webp` ×**0**.
- **`a11y` (3100, 16 rota × 1440 px): 6 → 1 · çıkış 1.** 105 ekran adımı (birebir) · **1831 eleman** (1834 − 3, `aria-hidden`) · gradyan **19 (taban 19) / 0** · başlık **316 (taban 316) / 0 atlama** · `alt`sız img 0 · ölçülemeyen yapışkan **151** · görünmez **43** · ekran dışı **0** · **kalan 0**. `/gecis`: kontrast ihlali **6 → 1**, ölçülen 104 → 101, başlık dizisi **birebir aynı** (24 başlık). **Belirlenimlilik:** iki koşum, kalan kalemin dört rakamı da birebir (3,25 / 3,21 / 7,05 / 2955 px).
- **Üç genişlikte kalem kalem (3100, gerçek derleme):** `01`/`02`/`03` → kapsam dışı (AX'te yok, aşağı bak). `1`·`2`·`3`·`4`·`5` → **min = p02 = med = 8,81** ve tek zemin `rgb(33,35,31)`, **1440/390/320'nin üçünde de** (önce: `1` 3,49/3,49/**3,44**, `2` 4,23/4,23/**4,12**, `3` 5,28/5,27/5,21, `4` 6,68/6,58/6,48, `5` 8,59/8,05/8,02). ⚠️ 320'de `1` ve `2` kapının gördüğünden **daha kötüydü** — kapı yalnız 1440'ta koşuyor. *"Elle tutulan kayıtlar…"* → 1440 **3,25** (artefakt) · 390 **7,05** · 320 **6,80**.
- **Enjekte ↔ gerçek derleme sadakati:** rozet adayı önce `page.addStyleTag` ile ölçüldü (**8,81**, üç genişlik), sonra kaynağa yazılıp 3100 tazelendikten sonra yeniden ölçüldü (**8,81**, üç genişlik) — **birebir**.
- **`aria-hidden` kapıyı gerçekten atlatıyor mu (T13'ün üç ayaklı kanıt ölçüsü):** (i) kapının ölçtüğü eleman 1834 → **1831**, tam üç eksik; (ii) **CDP `Accessibility.getFullAXTree`** → "01"/"02"/"03" **0 düğüm, "ignored" olarak bile yok**, 1440/390/320'nin üçünde de. **Negatif kontrol aynı ağaçta:** gizlemediğim adım rakamları ("1", "2", "5") her genişlikte **2'şer düğüm, 0 ignored** ve liste yapısı duruyor (`list` 7 · `listitem` 31); (iii) kovalar: yapışkan 151 · görünmez 43 · ekran dışı 0 · kalan 0 — **hiçbiri oynamadı**, yani kalem başka kovaya taşınmadı, **kapsamdan çıktı**. Başlık tabanı **316 → 316**: `aria-hidden` hiçbir başlığı düşürmedi (brief'in adıyla uyardığı risk ölçülerek kapatıldı).
- **`mobile-audit` (3100, 2 genişlik × 16 rota): TOPLAM SORUN 0 · çıkış 0 · ✓ KAPI YEŞİL — YEŞİL KALDI.** Altı kapsam tabanının hiçbiri oynamadı: eleman **6253** · metin elemanı **2054** (taban 2054) · kritik hedef **305 / 0 / 0 benzersiz** (taban 305) · kaydırılabilir kap **5** (taban 5) · dokunma hedefi **638** · gezinme **333 / 261** (raporlanır, düşürmez) · kırpma **0** · şerit **0**.
- **Görünüş (şerit yöntemi — `fullPage` KULLANILMADI):** 3 genişlik × tam sayfayı kapsayan görüntü-penceresi kareleri, **28 kare / 14,3 M piksel**. Sayfa boyu üç genişlikte de **birebir** (1440: 5191 · 390: 8436 · 320: 9489). **22 karede 0 farklı piksel** — dev rakamların bulunduğu kare dâhil, yani `aria-hidden` ekranda **hiçbir şey değiştirmedi**. Kalan 6 karede fark yalnız **rozet sütununda** (x 688-735 @1440 · x 20-67 @390/320): toplam **13.486 piksel (%0,094)**, dağılımı **1-2 birim: 12.564** (bölümün ışık lekesi artık rozetin içinden sızmıyor — gözle görünmez) · 3-8: 468 · 9-30: 179 · **31+: 275** (asıl kastedilen değişim: 1 px'lik bağlantı çizgisi artık rozetlerin **arkasından** geçiyor).
- **Kova sızıntısı kontrolü:** `a11y`'nin dört kovasının toplamı ve dağılımı değişmedi (151/43/0/0); yani ne `aria-hidden` ne rozet değişikliği bir kalemi "ölçüldü"den "ölçülemedi"ye kaydırmadı.
- **Kırmızı dal kontrolü:** `BASE=http://localhost:3457` (ölü hedef) → cümleyle durdu, yığın izi yok, **çıkış 1**. Yani bugünkü "1" gerçek bir ölçümdür, ölü koşum değil.
- **Diğer kapılar (regresyon):** `font-guard` **iki dal ✓ / çıkış 0** — dal 1 **85.129 karakter** (birebir), dal 2 **765/765 kesin · 0 sonuçsuz · muaf 10**. `perf` (3100) `/` **111 KB** iki profilde · LCP 84/64 ms · **8 kombinde CLS 0** · `font/woff2` **95 KB** — hepsi taban. `scan` (**3000**, geliştirme) `/gecis` @1440 6 kare / 5191 px ve @390 10 kare / 8436 px, ikisinde de **konsol temiz**. `npm test` (`web` konteyneri) **219 geçti + 2 atlandı** · `npx tsc --noEmit` **0** · `lint` **30** (taban; değişen dosyada **0** kalem).
- **Koşulmayan:** `/gecis` `perf.mjs`'in dört rotasında değil, yani bu sayfanın kendi ağırlığı ölçülmedi (değişiklik tek CSS kuralı + bir nitelik, bayt etkisi yok). Ekran okuyucu ile **gerçek** duyurum ölçülmedi — projede o kanal yok (`kanal: UAT`).

---

### Oturum — 2026-09-26 (ikinci kol: kullanıcı kararı ve kapanış)

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- Açık bırakılan tek karar kullanıcıya soruldu ve **seçenek B** alındı (aşağıda tam metin). Karar gereği **ölçüm betiğine dokunulmadı, yeni task yazılmadı, `plan-phase`'e dönülmedi.**
- **Kod değişmedi** → 3100 tazelenmedi; *"gerekmedi"* ölçüldü: `git diff HEAD -- src/ public/` **boş**, `lastmod` **2026-09-26T11:22:05.415Z** (ilk kolun ikinci derlemesi), pozitif kontrol gizlenmiş dev rakam ×1 + `/` `-sm.webp` ×**68**, negatif kontrol eski rozet sınıfı ×**0** + olmayan varlık ×**0**.
- **Mobil kapı aynı imaja karşı yeniden koşuldu** — ilk kolda yorum-öncesi imaja koşmuştu; iki kapının rakamı artık **tek imajdan** geliyor.
- Doküman: bu task kapatıldı ve arşive taşındı · `bulgular/B-063-*.md` + `BULGULAR.md` kancası kararla tazelendi (atom **açık kaldı**, arşivlenmedi) · `DURUM.md` ve `phases/PHASE-3.md` güncellendi.

**Kararlar:**
- **Kapanış ölçütü kullanıcının kendi tanımıyla karşılandı** (aşağıda Kapanış Gerekçesi). Kapı sayısal olarak 0 değil **1**; bu bir eksik değil **kayıtlı bir karardır**.
- docs/DECISIONS.md'ye eklendi: **Hayır.** Ölçü işin büyüklüğü değil geri dönüşün maliyeti: burada ne bir ad/şema/API sözleşmesi doğdu ne de biriken verinin yorumu değişti; karar bir **erteleme teyididir** ve evi zaten B-063'ün Erteleme Kaydı + bu task dokümanı. (Kapının ikinci turu gerçekten kurulduğunda doğacak yöntem kararı DECISIONS'a aittir — o iş "Kalite kapıları otomatik" fazında.)

**Kalan İşler:** yok. Sıradaki iş **TASK-3.27** (⬜, konusu ayrı: hareket azaltma açıkken çapa kaydırması) — bu karardan etkilenmedi.

**Dosya Değişiklikleri:** (bu kolda kod değişmedi)
- `_dev/bulgular/B-063-*.md` → Durum satırı ve Çözüm Kaydı kararla tazelendi (iki tarih birlikte: 2026-09-23 erteleme + 2026-09-26 karar) · `_dev/BULGULAR.md` → kanca + Son Güncelleme · `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` · bu dosya → `tasks/archive/`.

**Test Sonuçları:**
- **İki kapı da AYNI imaja karşı (3100, `lastmod` 11:22:05.415Z):** `a11y` **1 sorun · çıkış 1** — 16 rota · 105 ekran adımı · **1831 eleman** · gradyan **19 (taban 19) / 0** · başlık **316 (taban 316) / 0 atlama** · `alt`sız img 0 · kovalar yapışkan **151** / görünmez **43** / ekran dışı **0** / **kalan 0**. `mobile-audit` **TOPLAM SORUN 0 · çıkış 0 · ✓ KAPI YEŞİL** — 2 genişlik × 16 rota; altı kapsam tabanı birebir: eleman **6253** · metin elemanı **2054** (taban 2054) · kritik hedef **305 / 0 / 0 benzersiz** (taban 305) · kaydırılabilir kap **5** (taban 5) · dokunma hedefi **638** · gezinme **333 / 261** (raporlanır, düşürmez) · kırpma **0** · şerit **0**.
- **Kapı belirlenimli:** `a11y` bu tur dâhil üç koşumda aynı yedi rakamı verdi; kalan kalemin dört rakamı (3,25 / 3,21 / 7,05 / 2955 px) her koşumda birebir.
- Bu kolda yeni kod olmadığı için batarya/`tsc`/`lint` yeniden koşulmadı — ilk kolun değerleri geçerli (**219 + 2** · **0** · **30**, değişen dosyada 0 kalem).

---

## Kapanış Gerekçesi — kapı neden 1'de kaldı

<!-- Bu bölüm bilerek burada: kaydı okuyanın sonradan "kapı neden 0 değil" diye sormasına gerek kalmasın. -->

**Sayfa tarafı temiz, kalan iş ölçüm betiğinin kendisi.** UAT'ın `/gecis` için saydığı altı kalemin **beşi gerçek sayfa kusuruydu ve kapandı**; altıncısı ölçülerek **sayfa kusuru olmadığı** gösterildi.

**Altıncı kalem — ne olduğu:** `/gecis`'in *"Elle tutulan kayıtlar için birlikte bir öncelik…"* paragrafı. Kapı `p02` **3,25** (gereken 4,5) basıyor. Paragrafın kendi kontrastı **7,05**: `text-muted` ve zemini saf beyaz. Kırmızıyı üreten şey, kontrast maskesinin **glifin kime ait olduğunu bilememesi**: yapışkan başlık (`bg-canvas/88 backdrop-blur-xl`, 68 px) ekran-ekran gezmenin bir adımında paragrafın ilk satırını örtüyor ve **başlığın kendi çağrı düğmesinin etiketi** paragrafın maskesine giriyor; kapı da paragrafın mürekkebini o düğmenin sage zeminiyle eşleştiriyor. Ekranda var olmayan bir çift.

**Üç ölçüm, hepsi yayın kopyasına (3100) karşı:**
1. **İzolasyon A:** `header{display:none}` → `p02` 3,25 → **7,05**, zemin `rgb(255,255,255)` ×6175 (tek renk).
2. **İzolasyon B (tek değişkenli):** başlığın geometrisi, bulanıklığı ve düğme zemini **aynen yerinde**, yalnız başlığın **kendi metni** iki karede de şeffaf → maske **2955 → 1861 px**, `p02` → **6,98**. Düşen 1094 piksel düğmenin etiketi.
3. **Genişlik kontrolü:** aynı paragraf 390 px'te **7,05**, 320 px'te **6,80** — kalem tek genişlikte, tek kaydırma adımında ve yalnız adım ızgarası satırı düğmenin altına denk getirdiği için var.

**Kestirme yol denendi ve ÖLÇÜLEREK reddedildi.** *"Örtülü adımda o elemanı ölçme"* yaması kaynağa dokunulmadan (scratchpad kopyasıyla) 16 rotada koşuldu: `TOPLAM SORUN` 6 → **5** (artefakt düşüyor, beş gerçek kalem rakamıyla duruyor) **ama** gradyanla boyanmış metin **19 → 18** (kendi kapsam tabanının altı → kapı *başka* bir sebeple kırmızı) ve *"ekran dışı"* **0 → 8** (o sekiz eleman hiçbir adımda başlığın altından çıkmıyor, yani hiç ölçülmez oluyor); 171 (eleman, adım) çifti atlandı. Yani tek parçalı onarım bir yanlış alarmı kapatıp iki yeni boşluk açıyor — B-063'ün kendi Koruma Önerisi'nin neden **iki turlu** olduğu böylece ölçülerek doğrulandı.

**Neden bu task onarmadı:** bu kör nokta **B-063**'tür ve **2026-09-23'te kullanıcı kararıyla bilinçle ertelenmiştir** (verify-plan: *"bu fazda ölçüm kurulmaz, borç kanvasta açık durur ve 'Kalite kapıları otomatik' fazında kapanır"*). Kayıtlı bir kullanıcı kararının üstüne otonom yazılmadı; karar, ölçümler ve reddedilen kestirme yol birlikte kullanıcıya götürüldü.

**Kullanıcı kararı (2026-09-26) — birebir:**

> **(B) Kapı 1 kalemle kapanır.** Sayfada düzeltilecek bir şey olmadığı ölçüldüğü için kalem, ölçülmüş hâliyle açık bir kayıt olarak durur (B-063) ve faz kapanış değerlendirmesinde "beş ölçümün beşi yeşil" hedefi bu bir kalemle birlikte hükme bağlanır. Faz doğrudan UAT'a döner.

**Sonuç:** 23 Eylül'deki erteleme **bozulmadı**; ölçüm betiğine dokunulmadı; yeni task yazılmadı. Kapı `1 · çıkış 1` ile kapandı ve bu **bir eksik değil kayıtlı bir karardır**. Hüküm `review-phase` Adım 2'ye ait; orada *"beş ölçüm yeşil"* kriteri bu kalemle birlikte değerlendirilecek.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-26

**Ne Yapıldı:**
- `/gecis`'in **beş** ölçülmüş kontrast kalemi kapandı ve `a11y` kapısı **6 → 1**'e indi: üç dev adım rakamı dekoratif ilan edildi (`aria-hidden`, renge dokunulmadı), iki küçük adım rakamı ise **renkle değil rozetin zemini opaklaştırılarak** `p02` 3,49/4,23 → **8,81**'e çıktı (beş rakam birden, üç genişlikte tek zemin).
- Altıncı kalem **sayfa kusuru değil ölçüm betiğinin kör noktası** olarak ölçüldü (üç ölçüm + reddedilen kestirme yol) ve kullanıcı kararıyla **B-063'ün açık kaydına** bırakıldı. Sayfada o kalem için hiçbir şey değiştirilmedi.
- Değişen tek kod dosyası `src/app/gecis/page.tsx`; `globals.css`'e dokunulmadı (token değişimi gerekmedi — düzeltme kullanım sınıfına indi).

**Öğrenilenler:**
- **Sıra numarası her zaman dekoratif değildir.** Ayırt eden şey rakamın iriliği değil, **sıranın başka bir yerde yazılı olup olmadığı.** Kartlarda başlık sorunun tam metnini taşıyordu (dekoratif); geçiş haftası şeridinde başlık günün *adını* söylüyordu ve sırayı yalnız rakam yazıyordu (bilgi). `<ol>`'un kendi sıra semantiğine dayanmak da reddedildi: `list-style: none` altında bazı ekran okuyucuları liste rolünü düşürüyor ve **bu projede o kanal ölçülemiyor** — ölçemediğin bir şey tercihin dayanağı olamaz.
- **Kontrast düzeltmesi metnin renginde olmak zorunda değil.** Yarı saydam bir kap metin taşıyorsa, arkasından geçen her dekoratif katman o metnin kontrast **tavanını** belirler; düzeltme kapta yapılır. Burada rakamı eşiğe taşımak onu neredeyse beyaz yapardı (gereken metin ışığı 0,70, bugünkü 0,53), kabı opaklaştırmak ise rengi hiç değiştirmeden beş rakamı birden kurtardı.
- **`p02` düşük + `med` yüksek tek başına "kompozisyonlu zemin" demez.** Aynı imza, ölçüme yabancı bir katmanın gliflerinin sızmasından da doğar; mürekkebi koyulaştırmadan önce ihlal veren pikselin **zemin rengini ve konumunu** yazdır. Bu tur, projenin dört ayrı kaydındaki *"katman kontrastı yiyor"* okumasını da düzeltti — opak bir katman altındaki metin hiç boyanmaz, kaybedilen okunabilirlik değil **ölçümün doğruluğu**.
- **Bir kapıyı onarmanın bedeli de ölçülür.** Tek parçalı onarım bir yanlış alarmı kapatıp kapının başka bir kapsam eşiğini deliyordu; "kapı kırmızı" ile "kapı yanlış yerden kırmızı" arasındaki farkı ancak yamayı koşturup rakamlarını okumak gösterdi.

---

**Oluşturulma:** 2026-09-26 (verify-phase Adım 7 — UAT senaryo 3'ün ❌'inden doğdu)
