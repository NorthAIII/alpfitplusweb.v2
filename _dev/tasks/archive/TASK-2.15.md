# TASK-2.15: Yasaklı iddia sözlüğü ve denetimin iddia dalı (B-018 → M6 F6.4 devri)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M5 — Görsel Varlık Hattı (`modules/M5-Gorsel-Varlik-Hatti.md`) · M6 F6.4'ün girdisi
**Feature:** F5.1: Ürün ekran görüntüsü hattı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.13 (temizlik) · TASK-2.14 (ad dalı)

---

## Hedef

Görsel denetime **iddia sızıntısı dalı** eklemek ve yasaklı iddia kalıplarını `research/lib/` altında **tek dosyada** toplamak. Bugün `auditTexts` yalnız iki dal taşıyor (ad kalıbı + eski marka); iddia sızıntısı için **hiç dal yok** — 21 gerçek sızıntı dizgesi kalıba verildi, **20'si kör**.

Task, sözlük kurulduğunda, denetim ondan beslendiğinde ve enjekte edilen bir iddia dizgesini yakaladığı gösterildiğinde tamamlanmış sayılır.

---

## Bağlam

**Sözlüğün evi ölçülmüş bir kısıttan çıktı** (research 2026-09-22): araştırma konteyneri **yalnız `research/`'ü görüyor** (`docker-compose.yml` → `research` servisi, tek bağlama `./research:/work`); `web` konteyneri deponun tamamını görüyor (`.:/app`). İki konteynerin **ortak gördüğü tek dizin `research/`**.

- **Seçilen (a):** `research/lib/` altında tek dosya — render hattı doğrudan import eder, ileride `tests/` ve M6 F6.4 metin denetimi aynı dosyayı `web` konteynerinden okur.
- **(b) `src/lib/`** reddedildi: render hattı erişemez. **(c) iki kopya** reddedildi: tanım gereği drift.

**Ayraç kuralı (ölçülmüş tuzak):** `₺…B/ay`, `+%NN`, "en hızlı", "rekor" kalıpları ürün ekranlarının **meşru** gösterge verisine de değer — finans ekranı ciro gösterir, bu ürünün işlevidir. **Yasak olan: projeksiyon / üstünlük / büyüme kıyası. Serbest olan: nötr gösterge değeri.** Ekran bazlı izin listesi (`AUDIT_ALLOW` deseni) bu ayrımı taşır.

**Yöntem:** kapı önce **boş izin listesiyle** koşulur, raporladığı her kalem kaynakta aranır — v2 tablosunun `grup`/`sube` için kurduğu yöntem (`screen-cleanup-v2.mjs:63-88`).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` → 2026-09-12 ölçümü (21 dizge / 20 kör) ve koruma önerisi
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #3 ve Dikkat Edilecekler → "İddia sözlüğü demo verisini de vuracak"
- `_dev/docs/CLAIMS.md` — sözlüğün içeriğinin dayanağı (ROI, müşteri sayısı, yüzde iyileşme, "sadece bizde", rakip adı)
- `_dev/modules/M6-Kalite-Kapilari.md` → F6.4 — sözlüğün gelecekteki ikinci tüketicisi; **kalıp listesi tek dosyada, CLAIMS ile hizalı** kabul kriteri
- `research/lib/screen-cleanup-v2.mjs` · `docker-compose.yml` (bağlama kısıtı)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-018-*.md` — **B-018 bu task'ta kapanır** (üç kalem + iki denetim dalı); kapanış kaydı B-044'ün açık kalan envanterini işaret eder
- `_dev/docs/CLAIMS.md` → Sızıntı Denetimi bölümü — görsel tarafın artık iddia dalı var (metin tarafı hâlâ F6.4'te)
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.1 kabul kriterleri

---

## Alt Görevler

- [x] **1. Yasaklı iddia sözlüğü dosyası**
  - `research/lib/` altında **tek dosya**; kalıplar `docs/CLAIMS.md`'nin "söylenemez" sütunundan türer: ROI/ciro projeksiyonu, yüzde iyileşme, müşteri/üye sayısı övgüsü, üstünlük ("en hızlı", "rekor", "sadece bizde"), rakip adı kalıbı
  - Dosya başlığı **tek kaynak** olduğunu ve ikinci tüketicisinin (M6 F6.4 metin denetimi) geleceğini yazar
  - **Rakip adları repoda düz metin olarak durmaz** — kalıp/hash yaklaşımı (M6 F6.4 edge case'i); bu dosyada ad listesi tutulacaksa karar `DECISIONS.md`'ye yazılır

- [x] **2. Denetime iddia dalını ekle**
  - `auditTexts` üçüncü dal olarak sözlüğü uygular; çıktı ad/marka dallarıyla aynı biçimde raporlanır
  - Sızıntı bulunursa **üretim durur** (mevcut davranış korunur: sıfır-olmayan çıkış, dosya yazılmaz)

- [x] **3. Ekran bazlı izin listesini ölçerek kur**
  - Kapı **önce boş izin listesiyle** koşulur; raporlanan her kalem kaynak HTML'de aranır
  - Meşru gösterge değerleri (nötr ciro/sayı) izin listesine **gerekçesiyle** girer; projeksiyon/üstünlük kalemleri izin listesine girmez, `DROP_NODES` ya da `REPLACEMENTS` ile kapatılır
  - Ölçüm çıktısı (kaç kalem raporlandı, kaçı izin listesine girdi, kaçı düşürüldü) dokümana rakamıyla yazılır

- [x] **4. Negatif kontrol**
  - Enjekte edilen bir iddia dizgesi (ör. `~₺110B/ay artabilir`, `+%34 geçen aya göre`, `en hızlı büyüyen şube`) denetimi kırmızıya çekiyor

---

## Etkilenen Dosyalar

```
research/lib/
├── claim-leak.mjs             # YENİ — yasaklı iddia sözlüğü (ad task içinde kesinleşir)
└── screen-cleanup-v2.mjs      # auditTexts'e iddia dalı + AUDIT_ALLOW — zaten var
```

---

## Dikkat Noktaları

- **Ayraç kuralı sözlüğün kendisinde yazılı olmalı:** projeksiyon/üstünlük/büyüme kıyası yasak, nötr gösterge serbest. Yoksa bir sonraki bakımcı finans ekranının ciro rakamını "sızıntı" sanıp meşru veriyi siler.
- **İzin listesi ölçülmeden büyütülmez.** Boş listeyle koşup her kalemi kaynakta aramak bu projenin kurduğu yöntemdir; atlanırsa denetim kendi kör noktasını izin listesine yazar.
- **Sözlük `research/` dışına konmaz** — bağlama kısıtı ölçüldü; `src/lib/` altına konursa render hattı erişemez.
- **Rakip adı repoda geçerse kendisi sızıntıdır** (`modules/M6-Kalite-Kapilari.md` → F6.4 edge case). Ad listesi gerekiyorsa kalıp ya da ayrı gizli kaynak; karar kayda geçer.
- **Metin tarafı (F6.4) bu fazda açılmıyor** — bu task yalnız **görsel** denetimi besler ve sözlüğü ortak eve koyar.
- 21 dizgelik ölçüm B-018'de duruyor; yeni sözlüğün **kaçını yakaladığı** rakamla yazılır — "artık görüyor" yeterli değil.

---

## Test Kriterleri

- [x] Sözlük `research/lib/` altında tek dosyada; başlığı tek kaynak olduğunu ve `docs/CLAIMS.md` dayanağını yazıyor
- [x] `auditTexts` üç dallı (ad · marka · iddia); iddia dalı sözlükten besleniyor
- [x] **B-018'in 21 dizgesi sözlüğe verildi; kaçının yakalandığı rakamıyla yazıldı** (bugünkü taban: 21'de 1)
- [x] Hat yeşil koşuyor: 7 `.webp`, denetim sızıntı bildirmiyor
- [x] **Negatif kontrol:** en az üç iddia dizgesi (ciro projeksiyonu, yüzde kıyası, üstünlük rozeti) denetimi kırmızıya çekiyor, betik dosya yazmıyor
- [x] İzin listesi ölçümle kuruldu: boş listeyle koşulan turun raporu ve her kalemin akıbeti dokümanda
- [x] Meşru gösterge verisi (finans ekranının nötr ciro değeri) yanlış alarm üretmiyor
- [x] Çıktı görseller değişmediyse teyit edildi; değiştiyse gerekçesi yazılı

---

## Karar Noktaları

- **Rakip adları sözlükte nasıl durur:** düz metin (repoda sızıntı) vs kalıp/hash → tercih **kalıp**; karar `DECISIONS.md`'ye yazılır, kullanıcıya sorulmaz.

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
- **Sözlük kuruldu:** `research/lib/claim-leak.mjs` — 20 kalıp, beş sınıf (büyüme kıyası · üstünlük · ROI/projeksiyon · müşteri sayısı · yol haritası kalemi). Her satır `{id, sinif, neden, re}`; başlık `docs/CLAIMS.md` dayanağını, ayraç kuralını ve F6.4 devrini yazıyor. Alt sınır `MIN_CLAIM_PATTERNS = 16` (import anında fırlatır).
- **Denetim dört dallı oldu:** `auditTexts` artık `{names, brands, claims}` döndürüyor; `render-product.mjs` iddia bulgusunda da üretimi durduruyor.
- **İzin listesi ölçülerek kuruldu** (`CLAIM_ALLOW`), **tam değere** bakıyor — eşleşen parçaya değil.
- **25 vuruş kapatıldı:** `DROP_NODES.cockpit` (9 kural / 11 düğüm), `DROP_NODES.finans` (1), `DROP_NODES.antrenor` (+2) ve bir `CLAIM_REPLACEMENTS` satırı.
- **Düşürme sözleşmesi genişletildi:** `[seçici, çapa, beklenen]` — üçüncü alan verilmezse 1. Üç şube kartının aynı "geçen aya göre" satırını tek kuralla düşürmek için; fail-fast korunuyor (3 beklenip 2 ya da 4 bulunursa üretim durur).
- **Yedi görsel yeniden üretildi**, dördü değişti; `src/content/shots.ts` cockpit yüksekliği 655 → 629.
- **Test bataryası:** `tests/iddia-metinleri.test.ts`'e 9 senaryo (yeni dosya açılmadı).

**Sorunlar:**
- **İddia eşlemesi ad tablosunu zehirledi (kapı kendi yakaladı).** İlk deneme `raporlar` metin düzeltmesini doğrudan `REPLACEMENTS`e koydu; hat anında kırmızı döndü: `[cockpit] ad sızıntısı: ["«ciro» ⊂ \"Aylık ciro\""]`. Sebep yapısal — `deriveForbidden()` yasaklı **ad** kümesini `REPLACEMENTS`in kaynak tarafından türetir ve `nameParts()` iddia cümlesinin her sözcüğünü ad sayar ("ciro", "doluluk", "öğrenci", "sayısı", "şube"). Çözüm: **ayrı tablo** (`CLAIM_REPLACEMENTS`); hat ikisini `TEXT_FIXES` ile birlikte uygular, ad türetmesi yalnız `REPLACEMENTS`i okur. Bu zaten v1 tablosunun kendi yazılı kuralıydı ("REPLACEMENTS'ın sözleşmesi gerçek ad/semt/eski marka temizliğidir … iki sözleşmeyi tek tabloda toplamak ikisini de bulanıklaştırırdı"). Kontrol grubu testle çivilendi.
- **Türkçe kıvrım tuzağı.** Düzyazı kavram rozette BÜYÜK harfle geçebilir; ölçüldü ki `"EN HIZLI"` dizgesini `/en hızlı/i` de `.toLowerCase()` de **kaçırıyor** (`I`/`ı` kıvrılmıyor), yalnız `.toLocaleLowerCase("tr")` yakalıyor. Tüm karşılaştırma `trLower()` üzerinden yapılıyor; iki kontrol grubu testte duruyor. Memory'ye mezun edildi.

**Kararlar:**
- **Rakip adı sözlükte durmaz** (ne düz metin ne hash): ölçüldü — satış dosyasındaki 18 gerçek rakip ürün adının **0'ı** demo kaynağında geçiyor, yani sınıfın bu hatta girdisi yok; ayrıca kaba ad listesi yanlış alarm üretti (v2 `src/`inde bildirdiği "rakip adı" sıradan bir Türkçe sözcük çıktı). Slot dosyada gerekçesiyle beyan edildi, mekanizma F6.4'e bırakıldı. **docs/DECISIONS.md'ye eklendi: Evet.**
- **Ayraç: projeksiyon/üstünlük/büyüme kıyası yasak, nötr gösterge serbest.** Gerekçe ölçüm: 859 değerde "ciro" 22, "doluluk" 15 kez geçiyor ve neredeyse hepsi ürünün işlevi. `₺` ya da `%` görmek tek başına sızıntı değil; sızıntıyı yanındaki kıyas/üstünlük/projeksiyon işareti yapıyor.
- **B-044'ün önerdiği tarih/makullük kalıpları (`son N ay` · `Açılış: …` · `Ekipte: …`) ALINMADI.** CLAIMS'in "Söylenemez" sütununda karşılıkları yok ve ölçüldü ki alınsalardı finans ekranının "Ciro Trendi · son 6 ay" ekseni ile üç ekrandaki "Haziran 2026" başlığı kırmızıya düşerdi. Sınıf B-044'te açık; Gelen Kutusu'nda kullanıcı kararı bekleyen `[audit-product SORU]` satırı var.
- **İzin listesi tam değere bakar, parçaya değil.** Bir iddianın meşruluğu cümlesinden gelir: "salonun en büyük günlük yükü" meşru, "en büyük ciro artışı" değil. Parçaya izin verilseydi terim o ekranda tamamen körelirdi.
- **Yol haritası terimleri elle tutuluyor, düşürme tablosundan TÜRETİLMİYOR** — türetme dairesel olurdu: kural tablodan çıktığı gün bekçisi de kaybolurdu, yani koruması gereken tek senaryoda çalışmazdı. Bayatlamayı test katmanı önlüyor (`CAPABILITIES.simdi` çapası).
- **Cockpit'in iddia kalemleri kapatıldı, izin listesine yazılmadı.** Task'ın kendi kuralı ("projeksiyon/üstünlük kalemleri izin listesine girmez, `DROP_NODES` ya da `REPLACEMENTS` ile kapatılır") + fail-closed duruş. Görsel değişimi bilinçli ve aşağıda ölçülü.

**Dosya Değişiklikleri:**
- `research/lib/claim-leak.mjs` → **YENİ**. Yasaklı iddia sözlüğü (tek kaynak), `trLower()`, `claimLeaks()`, `MIN_CLAIM_PATTERNS`.
- `research/lib/screen-cleanup-v2.mjs` → `CLAIM_REPLACEMENTS` + `TEXT_FIXES` (ad tablosundan ayrı), `CLAIM_ALLOW`, `DROP_NODES.cockpit` (yeni) ve `.finans` (yeni), `.antrenor` (+2 kural), `auditTexts`'e dördüncü dal.
- `research/scripts/render-product.mjs` → "tam N eşleşme" düşürme sözleşmesi, iddia dalının üretimi durdurması, `TEXT_FIXES` kullanımı, düğüm sayacı.
- `src/content/shots.ts` → cockpit yüksekliği 655 → 629 (gerekçe yorumda).
- `public/product/*.webp` → dört görsel yeniden üretildi (betik çıktısı, elle konmadı).
- `tests/iddia-metinleri.test.ts` → 9 yeni senaryo + iki sayaç güncellendi (antrenör 6 → 8, cockpit 10 eklendi).

**Test Sonuçları:**
- `npm test` (`web` konteyneri): **180 geçti + 1 atlandı** — taban 171+1, net **+9 senaryo**, yeni dosya açılmadı. `npx tsc --noEmit` çıkış **0**.
- **Hat yeşil:** 7 `.webp`, çıkış 0, "ad, marka, İDDİA ve GÖRSEL sızıntısı için tarandı, sızıntı yok". Koşum **iki kez** tekrarlandı, çıktı 7/7 `md5sum` ile birebir aynı (üretilebilirlik).
- **Taban hatırlanmadı, ölçüldü:** değişiklikten önce aynı hat ayrı bir dizine koşuldu ve çıktısı `public/product/` ile **7/7 birebir** çıktı; kıyaslar o tabana karşı yapıldı.
- **Boş izin listesi ölçümü (task'ın istediği yöntem):** 7 ekran / **859** metin değeri / **27 vuruş** → cockpit 20 · finans 2 · antrenor 2 · takvim 1 · uye-telefon 1 · raporlar 1 · grup 0. Her vuruş kaynakta arandı: **25'i** yasak sınıf (kapatıldı), **2'si** meşru (tek cümle, iki ekranda → `CLAIM_ALLOW`). Kapatma sonrası aynı ölçüm **0 vuruş**.
- **Dizge ölçümü (kriterin istediği rakam):** B-018 + B-044'ün adıyla saydığı **20** dizge iki denetime karşı koşuldu — eski **3/20** görüyor, yeni **10/20**. ⚠️ Kriter "21'de 1" diyor; ölçüldü ki B-044'ün kod bloğunda **20** dizge yazılı (19 kör + "Alpfit Plus") ve 21'incisi hiçbir yerde yok. Ayrıca "tek GÖRÜR: Alpfit Plus" bugün tarihsel — TASK-2.14 hedef tarafını çıkardığı için o dizge artık bulgu değil, buna karşılık üç ad dizgesi görülüyor. Yeni denetimin görmedikleri: 7 avatar baş harfi (B-044 k.1/k.2, kapsam dışı), 2 tarih dizgesi (bilinçle alınmadı), "Alpfit Plus" (doğru — temizliğin kendi hedefi).
- **Ürettiğim kapı DÖRT sondayla sınandı; dördünde de kaynak değil GİRDİ bozuldu** (`../Alpfit.v1` hiç değiştirilmedi; `research/lib`'in kopyası `-v` ile bağlandı, çıktı ayrı dizine yazıldı; test sondasında dosya `md5sum -c` + `diff -q` ile birebir geri yüklendi):
  1. **Bozuk girdi** — cockpit düşürme kuralları söküldü: hat **20 iddia bulgusu** raporladı, çıkış **1**, **0 dosya** yazıldı.
  2. **Kontrol grubu** — aynı bozuk girdi, iddia dalı kapalı (yani `abfa2b7`'deki denetim): çıkış **0**, **8 dosya** yazıldı ve sızıntılı `cockpit.webp` üretildi (`4c876b3d…` ≠ temiz `a598e3c4…`). B-018'in anlattığı arıza birebir yeniden üretildi — yeşilin yeni dalın eseri olduğu böyle kanıtlandı.
  3. **Boş kapsam** — sözlük 20 → 4 kalıba budandı: `[claim-leak] sözlük çöktü — 4/16 kalıp` **import anında**, çıkış **1**, **0 dosya**.
  4. **Test bloğu** — `claimLeaks()` boş döndürüldü: batarya **5 kırmızı**. ⚠️ Ayraç testinin "nötr serbest" yarısı yeşil kaldı (doğru: o yarı dalın *yokluğunda* da geçmeli) ve kontrol grubu olarak **silinmedi**. Dosya geri yüklendi (`md5sum -c` OK, `diff -q` temiz), batarya yeniden 180+1.
- **Çıktı değişimi ölçüldü ve gözle doğrulandı.** Dört görsel değişti (cockpit · finans · antrenor · raporlar), üçü bayt bayt aynı (takvim · grup · uye-telefon). Toplam **264.962 → 258.782 B**. Tek boyut değişimi cockpit **1440×655 → 1440×629**. Dördü de PNG'ye çevrilip **gözle okundu**: KPI şeridi dört kartta da üç satırlı kaldı (chip düşürüldü, alt yazı korundu), şube kartları rozetsiz ve simetrik, raporlar şablon metni yerine oturdu.
- **Beş ölçüm betiği koşuldu** (görseller ve `shots.ts` değişti): `a11y` 8 rota **TOPLAM SORUN 0**; `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir); `font-guard` 16 sayfa / 81.118 karakter, **kümede olmayan karakter yok**; `scan` 390×844 **konsol temiz** (`/` 20 kare · `/ozellikler` 16 kare); `perf` — ana sayfa masaüstü **141 KB** / LCP **80 ms** / CLS **0,005**, mobil **132 KB** / LCP **60 ms** / CLS **0**. M6 çizgisi 144/133 KB · LCP 96 ms · CLS 0–0,005 → **regresyon yok, ağırlık düştü**.
- **Üretim imajı HEAD'ten yeniden derlendi** (`docker compose build web-prod`; `exec web npm run build` kullanılmadı — `next_cache` paylaşımı) ve tazeliği ölçüldü: 3100'ün HTML'i `height="629"`, `/product/cockpit.webp` **200 / 40.088 B**.

---



---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-23

**Ne Yapıldı:**
- Görsel üretim hattının denetimine **iddia dalı** eklendi ve yasaklı iddia sözlüğü `research/lib/claim-leak.mjs`'te **tek eve** kondu — M6 F6.4'ün metin denetimi aynı dosyayı devralacak. Denetim artık dört dallı (ad · avatar baş harfi · marka · iddia) ve iddia bulgusunda üretim duruyor.
- Boş izin listesiyle ölçülen **27 vuruşun 25'i** kapatıldı, 2'si gerekçesiyle izinli. En ağırı ana sayfanın **hero** görselindeydi: `cockpit.webp`, `sube.webp`'i yayından düşürten "Şube özeti" kartıyla aynı sınıftan bir "Patron özeti" kartı ve üç büyüme satırı taşıyordu.
- **B-018 kapandı ve arşive gitti** — kök nedenin iki yarısı da bitti (ad dalı TASK-2.14, iddia dalı bu task).

**Öğrenilenler:**
- **İki sözleşmeyi tek tabloda toplamak ikisini de bulanıklaştırır — ve bu sefer kapı kendi yakaladı.** İddia cümlesi ad tablosuna konduğunda yasaklı ad kümesi "ciro"/"doluluk" gibi sıradan sözcüklerle doldu ve yedi ekran kırmızıya düştü. v1 tablosunun başlığı bu kuralı zaten yazıyordu; düşürme için ayrı tablo açtıran gerekçe iddia eşlemesi için de bir tablo açtırdı.
- **Türkçe'de "harfe duyarsız yap" tek başına çare değil.** `/i` ve `.toLowerCase()` ikisi de `"EN HIZLI"`yi kaçırıyor; yalnız `.toLocaleLowerCase("tr")` yakalıyor. Ölçüt aranan şeyin ne olduğu: bizim yazdığımız düzyazı kavram → Türkçe yerelle duyarsız, kaynağın özel adı → duyarlı (TASK-2.14'ün tersi yön). Memory'ye mezun edildi.
- **Türetme her zaman daha sağlam değildir — dairesel olabilir.** Yol haritası terimleri düşürme tablosundan türetilseydi, bir kural tablodan çıktığı gün bekçisi de kaybolurdu. Bağımsız elle liste + test katmanında `CAPABILITIES` çapası, türetmeden daha güçlü çıktı.
- **Devralınan rakam ölçülmeden yazılmaz.** Kriterin "21'de 1" tabanı yerinde tutmadı: B-044'ün kod bloğunda 20 dizge yazılı, 21'incisi yok; ve "tek görülen Alpfit Plus" ifadesi TASK-2.14'ten sonra tarihsel kalmış.


---

**Oluşturulma:** 2026-09-22
