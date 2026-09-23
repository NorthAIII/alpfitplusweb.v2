# TASK-2.12: Riskli alt küme taraması — ürünün kendi "bugün yok" işaretlerinden (B-029)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.09 (beş bilinen kalem düzeltilmiş olmalı — tarama kalanı arar)

---

## Hedef

B-029'un beş kalemi bir **taban**; sınıfın kendisi ~124 present-tense yetenek cümlesi. Bu task o sınıfın **riskli alt kümesini** tarar: ürün deposunun kendi "bugün yok" işaretlerinden ("Yakında", "v1.5", "W8", "ertelendi") konu sözcükleri çıkarılır, sitede o konulara değen cümleler bulunur ve karşılıksız olanlar düzeltilir.

Task, tarama koşup çıktısı kayda geçtiğinde ve bulunan karşılıksız iddialar düzeltildiğinde tamamlanmış sayılır.

---

## Bağlam

**Ölçülmüş sınıf büyüklüğü** (research 2026-09-22): `src/content/product.ts` 10 modül × ~5 madde + 11 blurb, 4 rol × 5 madde + özet, 8 fayda; `src/content/segments.ts` 32 iddia bloğu — **~124 present-tense yetenek cümlesi**. B-029 beşini yanlış buldu, dördünü doğruladı, **kalanı hiç kontrol edilmedi**. Somut örnek: B-029'un 1. kalemi `product.ts:129/133/135` olarak sayılmış; aynı yeteneği `product.ts:23-24` (üye rolü maddeleri) ve `chat.ts:97` de present-tense anlatıyor ve bunlar listede yok.

**Kapsam kararı** (kullanıcı kararı, research 2026-09-22): ~124 cümlenin tamamı bu fazda doğrulanmaz — **riskli alt küme** taranır. Gerekçe: tam doğrulama (b) seçeneğiydi ve içerik mimarisinin yeniden kurulmasını gerektiriyor; bu faz iddianın doğruluğunu düzeltir.

**Yöntem (c):** ürün deposu bugün-yok kalemlerini **adıyla aranabilir** notlarda taşıyor — B-029 dördünü tam da böyle buldu. O notlardan konu sözcükleri çıkarılır, sitede o konulara değen cümleler taranır. Sonuç beş cümleden geniş, 124'ten dar bir alt kümedir.

**Kalıcı kapı bu fazda kurulmuyor:** ürün-deposu çapraz kontrolü M6 F6.4'ün kapsamı (`modules/M6-Kalite-Kapilari.md`). Bu task'ın taraması **bir kerelik ölçümdür**; çıktısı kayda geçer, betiği kalıcılaşmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md` → Kök Neden Yönü (ikinci katman: aranabilir notlar)
- `_dev/phases/PHASE-2.md` → Dikkat Edilecekler → "Beş karşılıksız yetenek iddiası bir taban, tavan değil"
- `_dev/docs/CLAIMS.md` — düzeltmenin sınırı
- `../Alpfit.v1` (salt okunur) — tarama kaynağı
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — kademeler; bulunan kalem "yolda"ya taşınabilir

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-029-*.md` — **B-029 bu task'ta kapanır**; kapanış kaydı taranan ve **taranmayan** yüzeyi açıkça yazar (kalan yüzey kanvasta durur)
- `_dev/BULGULAR.md` → Gelen Kutusu — taramanın bulduğu ama bu fazın kapsamına girmeyen kalemler `[TASK-2.12]` işaretli satırlarla

---

## Alt Görevler

- [x] **1. Konu sözcüklerini çıkar**
  - `../Alpfit.v1` içinde "Yakında", "v1.5", "W8", "ertelendi" gibi işaretleri taşıyan notlar bulunur (kod yorumu, i18n metni, servis başlığı)
  - Her nottan bir **konu sözcüğü kümesi** türetilir (ör. "ölçüm grafiği", "kampanya", "revoke", "iptal eşiği")

- [x] **2. Sitede tara**
  - `src/content/*` ve bileşenlerde o konulara değen present-tense cümleler bulunur
  - Her vuruş üç sonuçtan birine ayrılır: **karşılıksız** (düzeltilecek) · **karşılığı var** (dokunulmaz) · **belirsiz** (kullanıcıya ya da kanvasa)

- [x] **3. Karşılıksızları düzelt**
  - Düzeltme TASK-2.09'un deseniyle aynı: ya ifade daraltılır ya "yolda" işaretiyle ayrışır
  - **Kapsam kapısı:** bulgu sayısı task sınırını (1-3 dosya, tek oturum) aşarsa iş bölünür — `run-task` → plan revizyonu rotası işletilir, burada zorlanmaz

- [x] **4. Kapsamı dürüstçe kaydet**
  - Taranan yüzey ve **taranmayan** yüzey rakamıyla yazılır (ör. "32 segment bloğunun N'si konu sözcüğüne değdi, kalanı taranmadı")
  - B-029'un kapanış kaydı bu ayrımı taşır — "hepsi doğrulandı" denmez

---

## Etkilenen Dosyalar

```
src/content/
├── product.ts      # taramanın bulduğu kalemler — zaten var
├── segments.ts     # taramanın bulduğu kalemler — zaten var
└── chat.ts         # taramanın bulduğu kalemler (ör. chat.ts:97) — zaten var
```

Tarama betiği scratchpad'de kalır; `research/`'e kalıcı dosya konmaz.

---

## Dikkat Noktaları

- **Bu bir keşif ayağıdır.** Çıktısı kalan task'ların doğruluğunu değiştirebilir; o hâlde `run-task`'ın plan revizyonu rotası işletilir (TASKS-README → Sorun Giderme). Kapsamı sessizce büyütme.
- **"Belirsiz" kalem uydurulmaz.** Ürün kodunda karşılığı bulunamayan ama yanlış olduğu da gösterilemeyen cümle kanvasa düşer, sessizce silinmez (`ILKELER.md` → "Kanıtsız iddia yayınlanmaz" tersine de çalışır: kanıtsız **silme** de yapılmaz).
- **Ürün kodu salt okunurdur.**
- **Tarama kalıcılaşmıyor** — kalıcı kapı M6 F6.4. Betiği `research/scripts/`'e koyma; o iş "Kalite kapıları otomatik" fazının.
- **Ton değişmez** (F1.2 başka faz).
- Taramanın **kaçırdıkları** da kayda değer: yöntem konu sözcüğüne dayanıyor, ürünün not tutmadığı bir eksik bu yolla bulunamaz — sınır kapanış kaydında yazılır.

---

## Test Kriterleri

- [x] Tarama koştu; konu sözcüğü kümesi ve her kümenin site vuruşları **rakamıyla** dokümanda
- [x] Her vuruş üç sonuçtan birine ayrıldı (karşılıksız / karşılığı var / belirsiz) ve karşılıksızların tamamı düzeltildi
- [x] Bilinen çapa yeniden sınandı: `product.ts:23-24` ve `chat.ts:97` (B-029 kalem 1'in listede olmayan kardeşleri) tarama tarafından **bulundu** ve ele alındı
- [x] Taranmayan yüzey açıkça yazıldı; B-029'un kapanış kaydı "hepsi doğrulandı" demiyor
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` dokunulan rotalarda konsol temiz
- [x] Belirsiz kalanlar `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.12]` işaretiyle düştü

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
- **Konu sözcükleri İKİ kaynaktan türetildi.** 1. geçiş ürünün dağıtık erteleme notlarından ("Yakında" · "v1.5" · "W8" · "ertelendi" · "kapsam dışı") 14 konu kümesi çıkardı. 2. geçiş ürünün **kanonik sürüm haritasından** (`../Alpfit.v1/_dev/PRD/VERSIONS.md` → v1.5/v2 Feature Adayları) 13 konu kümesi daha çıkardı — dağıtık yorumların kaçırdığı kalemler (üyelik dondurma/paket devri, Patron mobil özet, churn derinleşmesi, öğrenci tutma göstergesi, cockpit büyüme kolonu, zamanlanmış rapor…) ancak burada göründü. Toplam **27 konu kümesi**.
- **Yapısal bulgu — `navConfig.ts` ürünün makine-okunur "henüz yok" listesi.** Ürünün yönetim panelinde ekranlar `status: 'live' | 'soon'` taşıyor; bugün `soon` kalan **tek** öğe `/ayarlar/yetki` (Yetki Yönetimi). Bu, `CAPABILITIES.yolda` → `yetki-geri-alma` kaleminin yerleşimini bağımsız olarak doğruladı.
- **Tarama koştu: 66 kaynak dosya, 129 benzersiz vuruş satırı** (29'u kod yorumu, **98'i ziyaretçiye görünen metin**) — hepsi üç sonuçtan birine ayrıldı.
- **İki karşılıksız iddia bulundu ve düzeltildi** (aşağıda Kararlar'da gerekçeleriyle).
- **B-029'un devralınan 2. ayağı ölçümle kapatıldı.** "`segments.ts`'te yol haritası işareti 0" bir eksiklik sanılıyordu; `segments.ts`'in **36 iddia parçası** 12 yol-haritası kalem anahtarına karşı tarandı → **0 gerçek vuruş** (tek vuruş yanlış pozitif: *"Karar için tek ekran yok"* kulübün bugünkü **derdini** anlatıyor, Üye 360 iddiası değil). Yani işaretin yokluğu **doğru sonuçtur**, boşluk değil — TASK-2.09 iki segment cümlesini işaret ekleyerek değil **ifadeyi daraltarak** düzeltmişti.

**Sorunlar:**
- **Taramanın ilk sürümü fail-open'dı ve bunu sonda yakaladı.** İlk konu kalıpları iki kavramın **aynı satırda** bulunmasını istiyordu (`diyetisyen` ∧ `ölçüm`); dizi elemanları ayrı satırlarda olduğu için task'ın adıyla istediği iki çapayı (`product.ts:23-24` üye rolü maddeleri ve `chat.ts`'in "ölçüm grafiğini görür" cümlesi) **hiç görmedi** — 21 vuruş bastı ve "temiz" gibi okundu. Kalıplar **tek kavrama** indirildi ve taramanın içine bir **çapa sondası** kondu (bilinen üç pozitifi görüyor mu diye kendini sınıyor): vuruş 21 → **121**, sonda 3/3 BULUNDU. Tur 9'un dersinin (harf/aksan duyarlılığı) kardeşi: kalıbın **granülerliği** de sessizce kör edebiliyor.
- **`chat.ts:97` çapası yer değiştirmiş.** B-029 onu 2026-09-22'de ölçmüştü; TASK-2.11 dosyayı yeniden kablolayınca cümle **101. satıra** kaydı. Satır numarasına değil cümleye bakıldı.
- **Tarayıcı sondası boş döndü çünkü sekmeler `role="tab"`.** `getByRole('button')` Roller sekmelerini görmüyor (açık `role` niteliği rolü ezer) ve betik hatasız "0 buton" basıyordu. `getByRole('tab')` ile ölçüldü. Memory'deki locator tuzağı notunun kardeşi — oraya eklendi.

**Kararlar:**
- **`product.ts` raporlar modülü: "Şube ve tarih aralığı filtresi" → "Şube ve ay filtresi".** Gerekçe: ürün **tek ay** seçtiriyor, aralık değil — üç katmanda ölçüldü (katalog yorumu · backend tek `month` parametresi · `<input type="month">`). **Şube ayağı doğru** olduğu için korundu (kanıtsız silme yapılmaz).
- **Yeni yol haritası kalemi AÇILMADI.** Tarih aralığı zaten `CAPABILITIES.yolda` → `gelismis-raporlama` kapsamında ve ürünün sürüm haritası da onu "gelişmiş/zamanlanmış raporlar" altında sayıyor; ayrı kalem aynı işi iki evde tutar ve B-040'ın kapattığı ayrışmayı yeniden açardı. Aynı yargı TASK-2.09'un iptal eşiğinde verdiği karardır (ifade daraltılır, kalem çoğaltılmaz).
- **`shots.ts` antrenör görseli alt metni daraltıldı.** "aylık performans **ve öğrenci tutma**" → "aylık performans, haftalık doluluk ve ciro kırılımı". Gerekçe: "öğrenci tutma" **tüm ürün kod tabanında 0 kez** geçiyor ve sürüm haritası kalemi adıyla v1.5'e taşımış. Yeni metin görüntüde **gerçekten duran** ve üründe **karşılığı olan** üç kartı sayıyor.
- **Görüntünün kendisi düzeltilmedi — bilinçli kapsam kararı.** `antrenor.webp` hâlâ bir "Öğrenci Tutma" kartı render ediyor (kaynağı `demo/antrenor.html`). Bu bir **görsel sızıntısıdır** ve evi B-018'dir (TASK-2.13 temizlik, TASK-2.15 denetimin iddia dalı); metin task'ı görseli yeniden üretmez. Gelen Kutusu'na `[TASK-2.12]` işaretiyle düştü.
- **Düzeltilen iki cümle testle çivilendi, yeni dosya açılmadı.** `tests/iddia-metinleri.test.ts` genişletildi (+6 senaryo) — B-060'ın gerekçesi: çivilenmeyen düzeltme bir sonraki metin düzenlemesinde sessizce çürür. Kalıcı **ürün-deposu çapraz kontrolü** hâlâ M6 F6.4'ün işi; tarama betiği `research/`'e **konmadı**, scratchpad'de kaldı (task'ın kendi kuralı).
- docs/DECISIONS.md'ye eklendi: **Hayır** — iki cümle düzeltmesi ve bir alt metin daraltması sözleşme/şema/ad bırakmıyor; geri dönüşün maliyeti yok (ölçüt: CLAUDE.md → Bilginin Doğru Evi). Ölçüm çapaları düzeltilen satırların yanındaki yorumlarda ve bu kayıtta.

**Kalan İşler:** yok (bu task'ın kapsamında). Kanvasa devredilen üç kalem aşağıda Test Sonuçları'nın altında ve `BULGULAR.md` → Gelen Kutusu'nda.

**Dosya Değişiklikleri:**
- `src/content/product.ts` → raporlar modülünün 5. maddesi daraltıldı + 11 satırlık ölçüm çapası yorumu (üç katmanın dosya:satır kanıtı)
- `src/content/shots.ts` → antrenör görselinin `alt` metni daraltıldı + 11 satırlık ölçüm çapası yorumu (görüntü tarafının B-018'e ait olduğu adıyla yazılı)
- `tests/iddia-metinleri.test.ts` → `SHOTS` import'u + iki yeni describe bloğu (6 senaryo; biri boş-kapsam bekçisi)

**Test Sonuçları:**
- `npm test` (web konteyneri): **160 geçti + 1 atlandı** (taban 154+1 — TASK-2.11 kapanışı; **+6 senaryo**, `iddia-metinleri.test.ts` 20 → 26). Atlanan, env kapısı kapalı depo sözleşme paketi.
- **Ürettiğim kapı iki sondayla sınandı** (ikisinde de kaynak değil **girdi** bozuldu; iki dosya scratchpad'e yedeklendi ve `md5sum -c` + `diff -q` ile birebir geri yüklendi):
  - **Bozuk girdi** — iki karşılıksız iddia metne geri yazıldı → **4 kırmızı**, dördü de doğru testlerde. ⚠️ `şube filtresi korundu (doğru olan silinmedi)` ayağı bu sondada **yeşil kaldı**: kontrol grubudur, "yasaklı ifade yok" ile "doğru ifade duruyor" farklı şeyleri ölçer.
  - **Boş kapsam** — `MODULES` ve `SHOTS` boşaltıldı → **10 kırmızı**; yakalayan bekçiler `modül metni hasat ediliyor` ve yeni eklenen `alt metinleri hasat ediliyor (boş kapsam)`. ⚠️ Kritik gözlem: bu sondada `hiçbir modül 'tarih aralığı' … iddia etmiyor` ve `hiçbir ürün görseli alt metni 'öğrenci tutma' demiyor` ayakları **yeşil kaldı** — hasat boşalınca `not.toContain` hiçbir şeye bakmadan PASS basıyor. Fail-open tam olarak budur; iki ayak **silinmedi**, bekçilerin neyi satın aldığını kanıtlayan kontrol grubudur.
  - Sonda sonrası ağaç birebir geri yüklendi, batarya yeniden **160 + 1**.
- `npx tsc --noEmit` çıkış **0**.
- **Üretim derlemesi** imajın builder katmanında hatasız (`docker compose build web-prod`; `exec web npm run build` bilinçle kullanılmadı — paylaşılan `.next` hacmi dev derlemesini ezer). 3100 yeni imaja alındı, üç rota **200**.
- **Serviste doğrulandı (3100):** eski ifadeler `/`, `/ozellikler` ve `/segmentler/cok-subeli-zincir`'de **0/0**; yeni "Şube ve ay filtresi" `/ozellikler`'de **3** kez. (`/`'de 0 — `Modules` yalnız öne çıkan modüllerin maddelerini basıyor, `raporlar` öne çıkan değil.)
- **Alt metni tarayıcıda ölçüldü** (araştırma konteyneri, 1440×900, **hem 3000 hem 3100**): Roller bölümünde `Diyetisyen` sekmesi `SHOTS.antrenor` görselini taşıyor; tıklandığında `alt` = *"… aylık performans, haftalık doluluk ve ciro kırılımı"*, `öğrenci tutma` **false**, üç ölçülen kart **true**, **iki yüzeyde de konsol hatası 0**. Bu ölçüm şarttı: `Roles` bir istemci bileşeni, yalnız aktif sekmenin görseli render ediliyor — alt metni ilk HTML'de **hiç yok**, grep ile "değişmemiş" diye okunurdu.
- `a11y.mjs` 8 rota **TOPLAM SORUN: 0**.
- `font-guard.mjs` 16 sayfa / **81.118 karakter** (taban 81.129 — daralan madde tam **11** karakter düşürdü), kümede olmayan karakter **yok**.
- `scan.mjs` 390×844 **konsol temiz**: `/` 20 kare · `/ozellikler` 16 kare · `/segmentler/cok-subeli-zincir` 11 kare.
- `mobile-audit.mjs` **9/9 yatay kaydırma yok**, taşan eleman `/demo`'da bilinen 3 (bal küpü), küçük dokunma hedefi **157** (taban birebir).
- ⚠️ `perf.mjs` **koşulmadı**: değişiklik iki metin dizesi; yeni varlık, yeni istek ve yeni düğüm yok.
- ⚠️ **Taranmayan yüzey** (kapanış kaydının parçası): yöntem **konu sözcüğü** temellidir — ürünün kendi notlarında/sürüm haritasında **kaydı olmayan** bir eksik bu yolla bulunamaz. Sınıfın tamamı (~124 present-tense yetenek cümlesi) tek tek doğrulanmadı; `product.ts` BENEFITS başlıkları, 16 `pains` maddesi ve `karsilastirma.ts`'in 18 satırlık yöntem tablosu yalnız konu sözcüğüne değdikleri ölçüde tarandı. Kalıcı çapraz kontrol M6 F6.4.

---

## Sonuç Özeti

B-029'un sınıfı ("site ürünün karşılamadığı bir şeyi 'var' diyor") **riskli alt küme** yöntemiyle tarandı: konu sözcükleri ürünün kendi erteleme notlarından **ve kanonik sürüm haritasından** türetildi (27 küme), 66 kaynak dosyada **129 benzersiz vuruş satırı** (98'i ziyaretçiye görünen metin) üç sonuca ayrıldı.

**İki karşılıksız iddia bulundu ve düzeltildi:** rapor filtresinin "tarih aralığı" vaadi (ürün **tek ay** seçtiriyor — üç katmanda ölçüldü) ve antrenör görselinin alt metnindeki "öğrenci tutma" (kelime **tüm ürün kod tabanında 0**, kalem v1.5'e taşınmış). Her ikisi de daraltıldı, doğru olan yarımları korundu. **Bir belirsiz kalem** ve **bir görsel sızıntısı** kanvasa düştü — uydurulmadı, sessizce de silinmedi.

**Yöntemin kendisi sondayla düzeltildi:** taramanın ilk sürümü iki kavramın aynı satırda olmasını istediği için task'ın adıyla istediği iki çapayı hiç görmemişti (21 vuruş). Kalıplar tek kavrama indirildi ve taramaya bir çapa sondası kondu → **121 vuruş, 3/3 çapa bulundu**. Betik kalıcılaşmadı (scratchpad'de kaldı); kalıcı ürün-deposu çapraz kontrolü M6 F6.4'ün işi.

**B-029'un devralınan ikinci ayağı ölçümle kapandı:** `segments.ts`'te yol haritası işaretinin 0 olması bir boşluk değil **doğru sonuçtur** — 36 iddia parçası 12 kalem anahtarına karşı tarandı, gerçek vuruş yok. Atom bu task'ta kapanıyor; kapanış kaydı **taranan ve taranmayan** yüzeyi birlikte yazıyor ve "hepsi doğrulandı" demiyor.

---

**Oluşturulma:** 2026-09-22
**Tamamlanma:** 2026-09-23
