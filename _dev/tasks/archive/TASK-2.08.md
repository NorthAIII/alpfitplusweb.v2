# TASK-2.08: Yetenek ve yol haritası tek kaynağı — `product.ts`'te üç kademeli sabit (B-029, B-040)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok — B-029/B-040 kümesinin ilk task'ı

---

## Hedef

"Bugün var / yolda / yol haritasında" ayrımını `src/content/product.ts` içinde **tek bir sabite** taşımak ve `PRODUCT_STATUS`'ı o sabitten türetmek. Bugün ayrım **beş evde elle** yazılı ve üçü birbirinden farklı.

Task, sabit kurulduğunda, `PRODUCT_STATUS.modules` ondan türediğinde ve `short`/`version` alanlarının akıbeti karara bağlandığında tamamlanmış sayılır. **Tüketicileri bağlamak bu task'ta değil** (TASK-2.10, TASK-2.11); yanlış cümlelerin düzeltilmesi de değil (TASK-2.09).

---

## Bağlam

**Ölçülmüş dağılım** (research 2026-09-22, B-040):

| Ev | Kalemler |
|---|---|
| `src/app/ozellikler/page.tsx:96-124` | 10 / 3 / 5 (üç kolon) |
| `src/components/sections/FounderProgram.tsx:81-95` | 4 kalem, düzyazı |
| `src/content/chat.ts:126-127` | 3 kalem, düzyazı |
| `src/content/faq.ts:48` | 3 kalem, düzyazı |
| `src/app/fiyat/page.tsx:29-34` | 2 kalem, "(yol haritasında)" ekiyle |
| `src/content/site.ts:38-44` (kısmî) | `PRODUCT_STATUS.modules` — sekiz modülü düzyazı sayıyor |

"Kurumsal üyelik" dört kopyanın **yalnız birinde**; "Apple Health ve Google Fit" ikisinde. Hiçbiri `src/content/` sabiti değil. `legal.ts:271` ziyaretçiye *"Yolda olan ve yol haritasında bulunan özellikler ayrı ayrı belirtilir"* taahhüdünü veriyor.

**Seçilen yaklaşım (a) + (c)** (kullanıcı kararı, research 2026-09-22): liste kurulur ve beş ev ondan okur; ayrıca ürünün kendi "bugün yok" işaretlerinden türeyen bir tarama yapılır (TASK-2.12). **(b) reddedildi** — 124 içerik maddesinin tamamını yetenek kimliğine bağlamak bu fazın sınırını aşar; bu faz iddianın **doğruluğunu** düzeltir, içerik mimarisini yeniden kurmaz.

Ölçülmüş bir kolaylık: tüketicilerin dördü de kalemleri düzyazıda **virgülle bağlıyor**, yani liste → düzyazı türetmesi kayıpsız.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-040-urun-yol-haritasi-dort-evde.md` — dağılım tablosu, `PRODUCT_STATUS` kalemleri
- `_dev/bulgular/B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md` — beş karşılıksız iddianın ürün kodundaki karşılığı (sabitin kademeleri buna göre kurulur)
- `_dev/docs/CLAIMS.md` — tek kaynak disiplini ve söylenebilir/söylenemez sınırı
- `src/content/product.ts` (277 satır), `src/content/site.ts:36-44`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/docs/DECISIONS.md` — sabitin adı, kademeleri ve `short`/`version` kararı
- `_dev/modules/M1-Icerik-ve-Iddia-Kaynagi.md` → F1.1 — yeni tek kaynak kabul kriteri olarak eklenir
- `_dev/docs/CLAIMS.md` → Tek Kaynaklar tablosu — yeni satır (yetenek/yol haritası)

---

## Alt Görevler

- [x] **1. Üç kademeli sabiti kur**
  - `src/content/product.ts` → üç kademe: bugün var · yolda · yol haritasında
  - Kalemlerin birleşik kümesi bugünkü beş evin **birleşimidir** ("Kurumsal üyelik" dâhil); çelişkiler B-029'un ürün-kodu ölçümüne göre çözülür — karşılığı olmayan kalem "bugün var" kademesine yazılmaz
  - Her kademe düzyazıya çevrilebilir olmalı (tüketiciler kalemleri virgülle bağlıyor); türetme yardımcı fonksiyonu sabitle aynı dosyada durur
  - Sabitin başına, `PRODUCT_STATUS`'ınki gibi **tek kaynak** olduğunu söyleyen bir başlık yorumu yazılır

- [x] **2. `PRODUCT_STATUS.modules`'ü sabitten türet**
  - Bugün sekiz modülü düzyazı sayıyor ve `chat.ts:126`'da elle kopyalanmış (B-014)
  - Yeni hâl listeden türer; hangi modüllerin sayılacağı "bugün var" kademesinden gelir

- [x] **3. `short` ve `version` alanlarının akıbeti**
  - İkisinin de bugün **hiç tüketicisi yok**; "v1 hazır" metni `FounderProgram.tsx:83`'te elle yazılı
  - Ya TASK-2.10'da tüketiciye bağlanır ya silinir — karar bu task'ta verilir ve `DECISIONS.md`'ye yazılır (B-047)

---

## Etkilenen Dosyalar

```
src/content/
├── product.ts     # üç kademeli yetenek/yol haritası sabiti + türetme — zaten var
└── site.ts        # PRODUCT_STATUS.modules artık türetilir; short/version kararı — zaten var
```

---

## Dikkat Noktaları

- **Bu task tüketicilere dokunmaz.** Beş ev hâlâ kendi metnini yazıyor olacak — bağlama işi TASK-2.10 ve TASK-2.11'de. Derleme ve testler bu ara hâlde de yeşil kalmalı.
- **"Bugün var" kademesi ürün koduna karşı doğrulanmış kalemleri taşır.** B-029'un beş kalemi (Üye 360 tek ekran, iptal eşiği ayarı, üyelik bitişi push'u, yetki geri alma, kampanya) bu kademeye **girmez**. Doğrulananlar (üç yetki şablonu, bekleme listesi + bildirim, yoklama düzeltme pencereleri, aktiflik serisi) girer.
- **Granülerlik tuzağı:** "Diyetisyen modülü" bugün **var**; "ölçüm grafiği ve diyetisyen notu tek ekranda" (Üye 360, W8) **yok**. Kademe kalemleri bu ayrımı taşıyacak kadar ince yazılmalı, yoksa TASK-2.09 düzeltmeyi listeye dayandıramaz.
- **Pilot cümlesi ve fiyat bu sabite girmez** — onların evi `PRODUCT_STATUS.sentence` ve `PRICING` (`docs/CLAIMS.md` → Tek Kaynaklar). İkinci bir ev açma.
- **Araştırma konteyneri `src/`'i görmüyor** — bu sabit görsel temizliğe (TASK-2.13) besleme yapamaz; o liste `research/lib/` içinde elle tutulur (bilinçli, `phases/PHASE-2.md` → Dikkat Edilecekler).
- **Kalemler tek tek adreslenebilir olmalı** (verify-plan 2026-09-22, TASK-2.11'in genişleyen kapsamı): beş düzyazı cümle yol haritasındaki **tek bir kalemi** adıyla anıyor ("QR ve turnike", "Online ödeme") ve o adı sabitten okuyacak. Kademe düz bir dizi olursa çağrı yeri kalemi indeksle aramak zorunda kalır — kalemin kendi anahtarı olsun (ör. `{ id: "qr-turnike", label: "QR ve turnike ile giriş" }`), liste türetmesi yine aynı yapıdan çıksın.
- **Rakip adı ve pilot sınırı** sabitin içinde de geçerli (`docs/CLAIMS.md`).

---

## Test Kriterleri

- [x] `src/content/product.ts`'te üç kademeli tek sabit var; her kademe kalemleri liste olarak tutuyor ve düzyazıya çevirme türetmeyle yapılıyor
- [x] `PRODUCT_STATUS.modules` artık elle yazılmış düzyazı değil, sabitten türüyor; ürettiği cümle bugünküyle **anlamca aynı ya da düzeltilmiş** (fark dokümana yazılır)
- [x] `short` / `version` kararı uygulandı (bağlandı ya da silindi) ve `DECISIONS.md`'ye yazıldı
- [x] B-029'un beş karşılıksız kaleminin hiçbiri "bugün var" kademesinde **değil** (kalem kalem gösterilir)
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız (23 rota)
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok (yeni metin girdiyse) · `scan.mjs` `/` ve `/ozellikler` konsol temiz
- [x] `grep` ile teyit: sabit dışında yeni bir yol-haritası listesi doğmadı

---

## Karar Noktaları

- **`short` ve `version`:** tüketiciye bağlanacak mı, silinecek mi → tercih **bağlama** (TASK-2.10'da `FounderProgram`'ın elle yazdığı "v1 hazır" oradan okur); tüketici doğmazsa silinir. Kullanıcıya sorulmaz, `DECISIONS.md`'ye yazılır.

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
- **Üç kademeli sabit kuruldu** — `src/content/product.ts` → `CAPABILITIES` (`simdi` 12 · `yolda` 7 · `sonra` 5 kalem). Her kalem `{ id, label, modul? }`; başlık yorumu sabitin tek kaynak olduğunu ve "bugün var"a yalnız ürün koduna karşı doğrulanmış kalemin girdiğini söylüyor. Yardımcılar aynı dosyada: `capabilityTitle` · `capabilityProse` · `moduleProse` · `capability(id)` + `STAGE_LABEL`.
- **Kalemlerin birleşik kümesi beş evin birleşimi** ("Kurumsal üyelik" dâhil). `simdi`'ye B-029'un doğruladığı iki kalem ayrıca eklendi (yoklama düzeltme pencereleri, haftalık aktiflik serisi); diğer iki doğrulanan (üç yetki şablonu, bekleme listesinden yer açıldı bildirimi) kardeş kalemin etiketine işlendi — ayrı satır açmak aynı bilgiyi iki yerde tutardı.
- **B-029'un beş karşılıksız kalemi `yolda` kademesine yerleştirildi**, kademe böylece 3 → 7 kaleme çıktı. Yerleştirme icat değil: dördünün de ürünün kendi kaydındaki gerekçesi var (Üye 360 tam fazı W8 · iptal eşiği v1.5 adayı · üyelik bitişi bildirimi churn panelinin ardında · revoke ucu v1.5'e ertelendi), beşincisi (kampanya) zaten "Yolda" kolonundaydı.
- **`PRODUCT_STATUS.modules` türetildi** (`moduleProse()`), `short` silindi, `version` kaldı — gerekçeler `docs/DECISIONS.md` 2026-09-23.
- **Sabitin kendi kapısı yazıldı** — `tests/capabilities.test.ts`, 23 test.

**Sorunlar:**
- **`capabilityProse("simdi")` okunamaz cümle üretiyordu** (ölçüldü, türetme çıktısı yazdırılarak): o kademenin etiketleri kendi içlerinde virgül taşıyor ("takvim, rezervasyon ve bekleme listesi") ve virgülle bağlanınca kalem sınırları kayboluyor. Çözüm: fonksiyon "simdi"yi **tip düzeyinde** kabul etmiyor (`Exclude<CapabilityStage, "simdi">`) ve doğru evi (`moduleProse()` / liste + `capabilityTitle()`) yorumda yazılı. Derleme zamanında yakalanır, çalışma zamanı bedeli yok. Kardeş kapı: `yolda`/`sonra` etiketlerinin virgül taşımadığını sınayan test — o kademeler düzyazıya açık kaldığı sürece temiz kalmalı.
- **Türkçe büyütme tuzağı:** `iptal` → locale verilmezse `Iptal` olur. `toLocaleUpperCase("tr")` kullanıldı, testle çivilendi.

**Kararlar:**
- Sabitin adı `ROADMAP` değil `CAPABILITIES`: "roadmap" ilk kademeyi ("bugün var") yanlış çatı altına alıyor. Kademe anahtarları B-040'ın önerdiği gibi (`simdi`/`yolda`/`sonra`).
- Etiketler cümle-içi biçimde saklanır, başlık türetilir — yalnız büyütme yönü kayıpsız.
- `nextVersion` ("v1.5") **açılmadı**: tüketicisi doğmadan alan açmak `short`'u ölü borç yapan hatanın aynısı. Alanı TASK-2.10 açar.
- docs/DECISIONS.md'ye eklendi: **Evet** (2026-09-23, yedi başlık).

**Kalan İşler:** yok (bu task'ın kapsamında). Devredilen: tüketicilerin bağlanması TASK-2.10/2.11, karşılıksız cümlelerin düzeltilmesi TASK-2.09.

**Dosya Değişiklikleri:**
- `src/content/product.ts` → `CAPABILITIES` + tip + beş yardımcı eklendi (+137 satır); başlık yorumu "yetenek/yol haritası"nı kapsayacak şekilde güncellendi
- `src/content/site.ts` → `PRODUCT_STATUS.modules` türetilir oldu, `short` silindi, `moduleProse` import edildi, başlık yorumu gerekçeleri taşıyor
- `tests/capabilities.test.ts` → yeni; sabitin iddia kapısı (23 test)

**Test Sonuçları:**
- `npm test` (web konteyneri): **95 geçti + 1 atlandı** (taban 72+1 — TASK-2.07 kapanışı; +23 senaryo). Atlanan, env kapısı kapalı depo sözleşme paketi.
- **Ürettiğim kapı sınandı (iki sonda, ikisi de girdiyi bozdu, kaynağı değil; dosya sondadan önce scratchpad'e yedeklendi, sonra birebir geri yüklendi — `diff -q` ile doğrulandı):**
  - **Bozuk girdi:** B-029'un 5. iddiası ("toplu duyuru ve kampanya") `simdi` kademesine **yeni bir kalem olarak** yazıldı — yani id hiç taşınmadan, gerçek kusurun oluşacağı yerde. **1 kırmızı**, doğru testte ("'Toplu duyuru ve kampanya' → metni 'bugün var' kalemlerinde geçmiyor"). Kimlik ayağı bu sondada **yeşil kaldı** ve bu bilinçlidir: iki ayak farklı şeyi ölçüyor, yeşil kalan ayak kontrol grubudur.
  - **Boş kapsam:** `simdi` kademesi komple boşaltıldı → **3 kırmızı** (boş-kademe · modül sayısı · türetilen cümle). Bu sondada B-029'un beş metin kontrolü **yeşil kaldı** — hiçbir şeye bakmadan PASS basan kapı tam olarak budur; "boş kapsam" bloğu o fail-open için var.
  - Sonda sonrası ağaç geri yüklendi, batarya yeniden **95 geçti + 1 atlandı**.
- `npx tsc --noEmit` çıkış **0**.
- Üretim derlemesi imajın builder katmanında hatasız; **23 rota** (prerender manifest sayıldı). 3100 yeni imaja alındı: `/` HTTP 200 / 345.042 B, `/ozellikler` HTTP 200 / 173.503 B.
- **Değişen metin serviste doğrulandı:** 3100'ün `/` çıktısında "antrenör performansı" **1** kez geçiyor, eski sıralama ("cockpit, raporlar, diyetisyen") **0** — yani cümle gerçekten türetilmiş hâliyle sunuluyor. (FounderProgram yalnız `/`'de render ediliyor; `/ozellikler` bu task'ta değişmedi.)
- `a11y.mjs` 8 rota **TOPLAM SORUN: 0** · `font-guard.mjs` 16 sayfa / 80.509 karakter, kümede olmayan karakter **yok** · `scan.mjs` 390×844: `/` 20 kare / 26.477 px **konsol temiz**, `/ozellikler` 15 kare / 12.417 px **konsol temiz**.
- ⚠️ `mobile-audit.mjs` ve `perf.mjs` **koşulmadı**: değişiklik tek bir cümlenin içeriğine dokunuyor, yerleşim/ağırlık ekseni kapsam dışı.
- **Kapanış grep'i (tek kaynağı atlayan çağrı siteleri):** sabit **dışında yeni bir yol-haritası listesi doğmadı**; bulunan 17 satırın hepsi önceden vardı ve TASK-2.10/2.11'e atanmış — `ozellikler/page.tsx` 6 · `faq.ts` 3 · `karsilastirma.ts` 2 · `chat.ts` 2 · `FounderProgram.tsx` 2 · `fiyat/page.tsx` 2. `src/content/mail.ts` (TASK-2.07'nin yeni metin dosyası) tarandı: yetenek iddiası **taşımıyor**.

---

## Sonuç Özeti

"Bugün var / yolda / yol haritasında" ayrımı artık `src/content/product.ts` → `CAPABILITIES` içinde tek bir sabitte. Kalemlerin birleşik kümesi bugünkü beş evin birleşimidir; **"bugün var" kademesine yalnız ürün koduna karşı doğrulanmış kalem girer** ve B-029'un beş karşılıksız iddiasının hiçbiri orada değil — beşi de "yolda" kademesinde, her biri ürünün kendi erteleme kaydına dayanarak.

`PRODUCT_STATUS.modules` elle yazılmış düzyazı olmaktan çıktı, kademeden türüyor; ürettiği cümle bugünküyle anlamca aynı, **bir kalem düzeltilmiş** (ürün koduna karşı ölçülen "antrenör performansı" eklendi, "Üye 360" bilinçle dışarıda). `short` silindi (sıfır tüketici), `version` tüketicisi TASK-2.10'da doğacağı için kaldı.

Sabit kendi kapısını da getirdi: `tests/capabilities.test.ts` karşılıksız iddianın "bugün var"a sızmasını iki bağımsız ayakla (kimlik + metin) engelliyor, boş kademe fail-open'ı ayrıca sınanıyor. İki sondayla kırmızı görüldü.

**Bu task tüketicilere dokunmadı** — beş ev hâlâ kendi metnini yazıyor (ölçüldü: 17 çağrı satırı / 6 dosya). O sayı TASK-2.10 + TASK-2.11'in kapanış ölçütüdür.

---

**Oluşturulma:** 2026-09-22
**Tamamlanma:** 2026-09-23
