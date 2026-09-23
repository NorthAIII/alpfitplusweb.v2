# TASK-2.14: Denetimin ad dalı temizlik tablosundan beslenir (B-018)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M5 — Görsel Varlık Hattı (`modules/M5-Gorsel-Varlik-Hatti.md`)
**Feature:** F5.1: Ürün ekran görüntüsü hattı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.13 (temizlik önce oturur; güçlenen denetim yeşil koşabilmeli)

---

## Hedef

Görsel denetimin ad dalını **temizliğin kalıbından bağımsızlaştırmak**: `auditTexts` artık iki-tam-sözcük regex'iyle ad aramaz; `REPLACEMENTS`/`INITIALS` tablosundaki **her adın her parçasını** (ad, soyadı, kısaltılmış hâlleri) yasaklı sözcük olarak arar.

Task, denetim tablodan beslenip hat yeşil koştuğunda ve kasıtlı olarak enjekte edilen bir ad sızıntısını **yakaladığı** gösterildiğinde tamamlanmış sayılır.

---

## Bağlam

Kök neden ölçüldü: denetim, temizliğin kendi kalıbıyla **aynı varsayımı** paylaşıyor (ad = iki tam sözcük), dolayısıyla temizliğin kaçırdığını yapısal olarak göremiyor. *"Bağımsız olmayan bir denetim, denetim değil teyittir."*

- `screen-cleanup-v2.mjs:97` → `const full = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g`
- "Gizem Ö." ikinci sözcük tek harf olduğu için uymuyor; "Simge & Gizem" araya `&` girdiği için uymuyor.

**Seçilen yaklaşım (b)** (research 2026-09-22): denetim tablodan beslenir. Reddedilen (a) — ad kalıbını genişletmek: *"kalıbı büyütmek körlüğü taşır, kaldırmaz; tablo kaynağın gerçeğidir, regex bir tahmindir."*

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` → Kök Neden Yönü + Koruma Önerisi
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #2
- `research/lib/screen-cleanup-v2.mjs` → `auditTexts`, `AUDIT_ALLOW`, `SHELL`
- `research/lib/screen-cleanup.mjs` → `AUDIT_ALLOW`, `BRAND_LEAK` (v1 tablosu, gövdesi düzenlenmez)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.1 — denetimin yeni dalı kabul kriterine yansır

---

## Alt Görevler

- [x] **1. Yasaklı ad sözcüklerini tablodan türet**
  - `REPLACEMENTS`'ın **kaynak** tarafındaki her adın her parçası (ad, soyadı) ve kısaltılmış hâlleri (`Gizem Ö.`, `G. Örge`) yasaklı küme olur
  - `INITIALS`'ın kaynak tarafı da kapsanır (avatar baş harfleri)
  - Küme **türetilir**, elle yazılmaz — tabloya yeni satır girdiğinde denetim kendiliğinden büyür

- [x] **2. İki-tam-sözcük kalıbını kaldır (ya da ikincil dala indir)** — ikincil dala indirildi (gerekçe aşağıda)
  - Ad dalı artık tablodan besleniyorsa regex'in asıl işi biter; korunacaksa **neden** korunduğu yorumla yazılır (ör. tabloya hiç girmemiş bir ad için kaba ağ)
  - `AUDIT_ALLOW`'un rolü korunur: kalıp dalı kalırsa izin listesi de kalır

- [x] **3. Negatif kontrolle sına**
  - Kaynağa geçici olarak bir ad sızıntısı enjekte edilir (ör. `Gizem Ö.` dizgesi) ve denetimin **kırmızı** döndüğü, betiğin sıfır-olmayan kodla çıktığı ve dosya yazmadığı gösterilir
  - Enjeksiyon geri alınır; `../Alpfit.v1` **salt okunurdur** — enjeksiyon kaynak depoya değil, geçici bir kopyaya ya da değerler dizisine yapılır

---

## Etkilenen Dosyalar

```
research/lib/
└── screen-cleanup-v2.mjs      # auditTexts ad dalı tablodan türer — zaten var
research/scripts/
└── render-product.mjs         # icrada eklendi: denetim girdisi mutasyonlardan
                               # SONRA toplanır (bayat kütle ölçüldü) + boş-kapsam kapısı
tests/
└── iddia-metinleri.test.ts    # icrada eklendi: kapı npm test bataryasına bağlandı
```

---

## Dikkat Noktaları

- **Denetim yeşil olmalı ama körlük kapanmalı** — ikisi birlikte. "Yeşil" tek başına kanıt değil; negatif kontrol şart (Alt Görev 3).
- **`../Alpfit.v1` salt okunurdur.** Enjeksiyon oraya yapılmaz.
- **Yanlış alarm riski:** tablodaki nötr **hedef** adlar (`Yasemin U.`, `Cüneyt V.`) çıktıda meşru olarak bulunur — yasaklı küme yalnız **kaynak** taraftan türetilir, hedef taraftan değil. Bu ayrım karıştırılırsa hat hiç yeşile dönmez.
- **`AUDIT_ALLOW` genişletilirken ölçülür:** kapı önce boş izin listesiyle koşulur, raporladığı her kalem kaynakta aranır (v2 tablosunun `grup`/`sube` için kurduğu yöntem, `screen-cleanup-v2.mjs:63-88`). İzin listesine ölçmeden satır eklenmez.
- **İddia dalı bu task'ta değil** — TASK-2.15.
- `auditTexts` saf bir fonksiyondur; saflığı korunur (yan etki, dosya okuma yok).

---

## Test Kriterleri

- [x] `auditTexts`'in ad dalı `REPLACEMENTS`/`INITIALS`'tan türüyor; elle yazılmış ad listesi yok
- [x] Hat yeşil koşuyor: 7 `.webp`, denetim sızıntı bildirmiyor
- [x] **Negatif kontrol:** enjekte edilen "Gizem Ö." dizgesi denetimi kırmızıya çekiyor, betik sıfır-olmayan kodla çıkıyor ve **dosya yazmıyor** (bugünkü kalıp bu dizgeyi kaçırıyordu — kanıt dokümana)
- [x] İkinci negatif kontrol: "Simge & Gizem" biçimi de yakalanıyor
- [x] Nötr hedef adlar (`Yasemin U.`, `Cüneyt V.`) yanlış alarm üretmiyor
- [x] `AUDIT_ALLOW`'a eklenen her satırın gerekçesi yanında yazılı (eklenmişse)
- [x] Çıktı görseller TASK-2.13'ün sonucuna göre **değişmedi** (denetim değişti, temizlik değil)

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Yasaklı ad kümesi tablodan türetildi** (`deriveForbidden`, saf fonksiyon). `REPLACEMENTS`'ın **kaynak** tarafı boşluk/`&`/virgül ile parçalanır, kenar noktalama soyulur, ≥ 3 harfli parçalar alınır; `INITIALS`'ın kaynak tarafı (yalnız `from !== to`) tam jeton olarak eklenir. Elle yazılmış hiçbir ad listesi yok — tabloya satır girdiği gün küme kendiliğinden büyür (sentetik tabloyla test edildi).
- **Hedef tarafı çıkarılır.** Tablonun hedef tarafı temizliğin bilerek yazdığı şeydir; denetim kendi çıktısını sızıntı sayamaz. Ölçüldü: beş parça düşüyor — `Plus`/`PLUS`/`plus` (kaynak "Weekend Plus", hedef "Alpfit Plus"), `Zehra` (ilk ad bilinçle korunmuş), `Cansu` (hedef "Cansu E."). Çıkarma olmasaydı **yedi ekran birden** kırmızı olurdu.
- **İki-tam-sözcük kalıbı kaldırılmadı, ikincil dala indirildi** ve gerekçesi yorumla yazıldı: (i) tabloya **hiç girmemiş** bir adı yalnız o dal görebilir; (ii) TASK-2.13'ün kendi kendini doğrulayan kapısı ona dayanıyor — `'Öğrenci Tutma'` izin satırı tablodan türetilerek çıkarıldığı için düşürme sessizce başarısız olursa o dal onu ad sızıntısı sayıyor. Kaldırmak o kapıyı sessizce sökerdi. `AUDIT_ALLOW` bu yüzden rolünü koruyor ve **yalnız** o dalı kapatıyor.
- **Denetimin gördüğü kütlenin toplanma anı düzeltildi** (`render-product.mjs`). `values` 2. adımın içinde toplanıyordu, yani **avatar senkronundan önceki** hâli taşıyordu; denetim iki harfli jetonu zaten göremediği için fark görünmüyordu. Baş harfleri tabloya bağlayınca bayat kütle ölçüldü: antrenör senkron **öncesi 6** baş harfi raporluyor (EK·AG·KY·AŞ·CO·HÇ), **sonrası 0**. Toplama tüm mutasyonların sonuna alındı.
- **İki boş-kapsam tabanı kondu.** Tablo tarafı: `MIN_FORBIDDEN_PARTS = 40` · `MIN_FORBIDDEN_INITIALS = 10` (bugünkü değerler 52 ve 13) — tablo çökerse `deriveForbidden` **import anında** hata verir. Girdi tarafı: `MIN_AUDIT_VALUES = 40` (ölçülen en düşük ekran 77) — metin yürüyüşü çökerse denetim kapsamsız koşmaz.
- **Kapı `npm test`'e bağlandı** — `tests/iddia-metinleri.test.ts`'e 8 senaryoluk blok (yeni dosya açılmadı). `auditTexts` saf olduğu için sentetik girdiyle sınanıyor; blokta kontrol grubu da var (eski kalıbın aynı iki dizgeyi göremediği birebir gösteriliyor).

**Sorunlar:**
- **Devralınan emrin bir ayağı ölçümle çürüdü — `INITIALS` kaynağı olduğu gibi yasaklanamıyordu.** Task "INITIALS'ın kaynak tarafı da kapsanır" diyor; olduğu gibi uygulansa `EK` yasaklı olur ve `takvim`/`uye-telefon` kırmızıya düşerdi. Ölçüldü: `takvim.html:166` `<span class="av">EK</span>` tam da `<span class="nm">Melissa V.</span>` (→ "Ege K.") yanında duruyor — yani oradaki `EK` **sızıntı değil, hedefin kendi baş harfi**. `EK` iki yerde birden: kaynakta Ebrar Karakurt, hedefte `['MV','EK']`. Çözüm ad parçalarıyla **aynı** kural oldu (hedef tarafı kazanır); iki harfli jetonun tanım gereği belirsizliği B-044 kalem 3'ün kendi tespiti.
- **Sonda betikleri repoya boş dosya bıraktı.** `-v "$SP/probe.mjs:/work/probe.mjs"` mount hedefini yaratıyor ve `/work` = `./research` olduğu için ana makinede **0 baytlık root sahipli** iki dosya kaldı. Fark edildi, silindi; tuzak `memory/arastirma-konteynerinde-tarayici-olcumu.md`'ye ölçümüyle yazıldı. Sonraki sondalar var olan dizinlerin (`lib`, `product-out`) üzerine bağlandı — mevcut hedefe bağlamak yer-tutucu yaratmıyor.

**Kararlar:**
- **Eşleşme harfe DUYARLI, alt dize.** Küçük harfe indirgeme ölçüldü: 45 parçalık küme, yedi ekranda **0 ek vuruş** — yani kazanç yok, bedel var: kümeye `ilkin` · `aydın` · `arda` · `hande` · `salih` gibi sıradan Türkçe sözcükler girer. Tablo zaten gereken büyük/küçük varyantları **satır olarak** taşıyor (marka 6, semt 6), yani case bilgisi tablonun kendi gerçeği. Küçük harfli bir sızıntı gözlenirse çare satırı tabloya eklemektir. (Ters yöndeki B-040 dersi — "grep harfe duyarlıdır" — orada aranan bizim yazdığımız **düzyazı** bir kavramdı; burada aranan kaynağın özel adları.) Gerekçe kodda.
- **Ad parçası alt dize, baş harfi tam jeton.** Sızıntı çoğu zaman bir tamlamanın içinde geçer ("… Simge & Gizem hocaların …"), ama iki harfli bir dizi her yerde geçer: `SA` ⊂ `SAHİL` (hedef semt adı) alt dize aranırsa kapı kullanılamaz olur. Avatar metni kendi düğümünde tek başına durduğu için tam jeton doğru ölçüdür.
- **`AUDIT_ALLOW` tablo dallarını kapatmıyor** (bilinçli, fail-closed). İzin listesi elle yazılmış **masum tamlama** listesidir; tablo ise kaynağın gerçeği. Tablodan gelen bir vuruş yanlış alarmsa çare izin satırı eklemek değil **tabloyu düzeltmektir**. Bugünkü ölçüm bu riski sınırlıyor: 7 ekran, 859 metin değeri, tablo dallarından **0 vuruş**.
- **`AVATAR_SELECTOR`'a `.av` EKLENMEDİ.** B-044 kalem 2'nin işi (`grup.html` 17 + `takvim.html` 8 = 25 düğüm haritanın dışında) ve bu fazın kapsam dışı listesinde. Eklemek çıktı görselleri değiştirirdi; task kriteri tam tersini istiyor ("denetim değişti, temizlik değil").
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşün maliyeti yok: dört karar da denetimin iç mekaniği, bıraktıkları bir ad/şema/API sözleşmesi ya da birikmiş veri yorumu yok; gerekçeler kodun yanında ve bu kayıtta duruyor.

**Kalan İşler:**
- Yok. İddia dalı ve yasaklı iddia sözlüğü TASK-2.15'in kapsamı; B-018 orada kapanır.

**Son Yaklaşım:**
Tamamlandı — devam gerekmiyor.

**Sonraki Adım Detayı:**
Yok; sıradaki iş TASK-2.15 (yasaklı iddia sözlüğü + denetimin iddia dalı). O task bu turda kurulan deseni devralır: sözlük `research/lib/` altında tek dosyada, alt sınırlı (`MIN_*` emsali) ve `tests/iddia-metinleri.test.ts`'e bağlanır.

**Dosya Değişiklikleri:**
- `research/lib/screen-cleanup-v2.mjs` → `nameParts()` + `deriveForbidden()` + `FORBIDDEN` + iki alt sınır sabiti eklendi; `auditTexts` iki daldan **üç dala** çıktı (tablo-parça · tablo-baş harfi · ikincil kalıp), izin listesinin kapsamı yorumla daraltıldı
- `research/scripts/render-product.mjs` → denetim girdisi (`values`) artık **tüm mutasyonlardan sonra** toplanıyor; `MIN_AUDIT_VALUES` boş-kapsam kapısı eklendi
- `tests/iddia-metinleri.test.ts` → TASK-2.14 bloğu (8 senaryo): türetme, boş kapsam, iki geçiş sınıfı, kontrol grubu, nötr hedef adlar, tam jeton, ikincil dal + izin listesi + marka dalı

**Test Sonuçları:**
- **`npm test` (Vitest, `web` konteyneri): 171 geçti + 1 atlandı** — taban 163+1 (TASK-2.13), net **+8 senaryo**, yeni dosya açılmadı. Atlanan, env kapılı depo sözleşme paketi (değişmedi). `npx tsc --noEmit` çıkış 0.
- **Hat yeşil ve çıktı değişmedi:** 7 `.webp`, çıkış 0, "sızıntı yok". Çıktı **7/7 `md5sum` ile `public/product/` ile birebir aynı** — taban koşumu da (değişiklikten önce, aynı scratchpad dizinine) 7/7 aynıydı, yani kıyas hatırlanan değil ölçülen. Denetim değişti, temizlik değişmedi.
- **Ürettiğim kapı beş sondayla sınandı; beşinde de kaynak değil GİRDİ bozuldu.** `../Alpfit.v1` hiç değiştirilmedi: hat sondaları `research/lib`'in **kopyasını** bozup `-v` ile bağladı ve çıktıyı ayrı dizine yazdı; test sondasında dosya yedeklenip `md5sum -c` + `diff -q` ile birebir geri yüklendi.
  1. **Bozuk girdi — B-018'in tarihsel hâli, kontrol gruplu.** TASK-2.13'ün eklediği üç çıplak-ad satırı (`Gizem Ö.` · `Gizem` · `Simge`) tablodan çıkarıldı. **Kontrol grubu (çapadaki eski denetim + eski toplama):** çıkış **0**, "sızıntı yok", 7 görsel + manifest yazıldı ve üretilen `grup.webp` temiz sürümden farklı (`fe0ba19…` ≠ `3a4caac…`) — yani bugünkü hâliyle sızıntılı görsel **yayına hazır çıkıyordu**. **Tedavi (yeni denetim, aynı bozuk tablo):** çıkış **1**, `[grup] DENETİM BAŞARISIZ — ad sızıntısı: ["«Gizem» ⊂ \"Gizem Ö. · 17:00 · 60 dk\"", "«Gizem» ⊂ \"17:00 · Gizem Ö.\""]`, `grup.webp` **yazılmadı**, `manifest.json` **yazılmadı** (grup 6. ekran; önceki 5 dosya yazılmıştı).
  2. **Avatar dalı canlı mı.** `AVATAR_SELECTOR` kopyada `.av-sm`'i kaybetti → `[antrenor] … ["«AG»","«KY»","«AŞ»","«CO»","«HÇ»" (avatar baş harfi)]`, çıkış **1**. Baş harfi dalı gerçekten koşuyor **ve** toplama anı düzeltmesi olmasaydı bu dal hiç anlam taşımayacaktı.
  3. **Boş kapsam — tablo tarafı.** v1'in `REPLACEMENTS`'ı boşaltıldı → `deriveForbidden` **import anında** `parça 16/40` diyerek durdu, **0 dosya** yazıldı, çıkış **1**.
  4. **Boş kapsam — girdi tarafı.** Betik kopyasında metin yürüyüşü kırıldı → `[cockpit] DENETİM KAPSAMSIZ — yalnız 0 metin değeri toplandı`, **ilk ekranda**, **0 dosya**, çıkış **1**.
  5. **Test bloğu gerileme görüyor mu.** `auditTexts`'ten iki tablo dalı söküldü → batarya **2 kırmızı** (`bugün kaçan iki geçiş sınıfını yakalıyor`, `avatar baş harfi TAM JETON aranıyor`). ⚠️ Türetme ve boş-kapsam ayakları **yeşil kaldı** — doğru davranış: onlar `deriveForbidden`'ı ölçüyor, bağlantıyı değil; kontrol grubu olarak **silinmediler**. Sonda sonrası dosya `md5sum -c` + `diff -q` ile birebir geri yüklendi, batarya yeniden 171+1, hat yeniden yeşil ve çıktı yine 7/7 birebir.
- **Nötr hedef adlarda yanlış alarm yok** — `Yasemin U.` · `Cüneyt V.` · `Zehra G.` · `Cansu E.` · `Alpfit Plus` sentetik girdiyle sınandı, `names` boş. Kaynağa karşı ölçüm de aynı: 7 ekran, **859** metin değeri, tablo dallarından **0 vuruş**.
- **Beş ölçüm betiği koşulmadı ve gerekçesi ölçüldü:** bu turda `src/` ve `public/` altında **tek bayt** değişmedi (`git status --short -- src public` boş) ve üretilen yedi görsel md5 düzeyinde aynı — a11y/mobil/font/perf/tarama ölçümleri değişmemiş bir siteyi ölçerdi. Değişen üç dosya `research/` ve `tests/` altında.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Ne yapıldı:** Görsel denetimin ad dalı, temizliğin kalıbını paylaşmayı bıraktı ve `REPLACEMENTS`/`INITIALS` tablosunun kaynak tarafından türemeye başladı (52 ad parçası + 13 avatar baş harfi, elle yazılmış liste yok). Tablonun hedef tarafı çıkarılıyor, yani denetim kendi çıktısını sızıntı saymıyor. İki-tam-sözcük kalıbı kaldırılmadı, **ikincil kaba ağ** olarak korundu — TASK-2.13'ün kendi kendini doğrulayan kapısı ona dayanıyor. Denetimin gördüğü kütlenin bayat olduğu ölçülüp düzeltildi (`values` artık tüm mutasyonlardan sonra toplanıyor) ve iki boş-kapsam tabanı kondu.

**Körlük kapandı mı:** Evet, kontrol gruplu ölçümle. B-018'in tarihsel tablosu geri konduğunda eski denetim çıkış 0 verip sızıntılı `grup.webp`'i üretiyor; yeni denetim aynı girdide çıkış 1 veriyor ve dosyayı yazmıyor.

**Kapsam dışı bırakılan:** `AVATAR_SELECTOR`'a `.av` eklenmesi (B-044 kalem 2, 25 düğüm) — bu fazın kapsam dışı listesinde ve çıktı görsellerini değiştirirdi. İddia dalı ve yasaklı iddia sözlüğü TASK-2.15'te; **B-018 orada kapanır**.

---

**Oluşturulma:** 2026-09-22
