# TASK-2.10: `/ozellikler` ve Kurucu Programı tek kaynaktan okur (B-040)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M2 render yüzeyi
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.08 (sabit) · TASK-2.09 (düzeltilmiş kalemler)

---

## Hedef

Yol haritasının **iki bileşen-içi kopyasını** kaldırmak: `/ozellikler` sayfasının üç kolonu ve `FounderProgram`'ın üç `StatusRow`'u artık `product.ts`'teki sabitten okur.

Task, iki dosyada da elle yazılmış kalem listesi kalmadığında ve render edilen metin sabitle birebir uyuştuğunda tamamlanmış sayılır.

---

## Bağlam

İki kopya **bileşende** yaşıyor — yani `src/content/` düzenleyen biri onları hiç görmüyor (B-039'un doğrudan sonucu). Ayrışma birebir ölçülü: `/ozellikler` 5 yol-haritası kalemi sayıyor, `FounderProgram` 4 ("Kurumsal üyelik" yok).

`FounderProgram.tsx:83`'te ayrıca elle yazılmış bir **"v1 hazır"** başlığı var; `PRODUCT_STATUS.version` ve `.short` alanlarının bugün hiç tüketicisi yok. TASK-2.08'in kararı bu task'ta uygulanır (bağlanır ya da silinmiş olur).

**Kurucu Programı bölümünün altındaki "yüzde kaç ciro artışı söylemiyoruz" paragrafı korunur** — o, iddia sınırının kendi beyanıdır (`FounderProgram.tsx:99-101`).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-040-urun-yol-haritasi-dort-evde.md` — ayrışma tablosu
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — sabitin adı, kademeleri ve türetme fonksiyonu
- `_dev/docs/STYLE-GUIDE.md` — kullanıcının reddettiği kalıplar (kolon kartlarının görünümü **değişmez**)
- `src/app/ozellikler/page.tsx:80-140` · `src/components/sections/FounderProgram.tsx:78-100`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum

---

## Alt Görevler

- [x] **1. `/ozellikler` üç kolonunu sabitten besle**
  - `page.tsx:96-124` içindeki elle yazılmış `items` dizileri kalkar; kolonlar sabitin üç kademesinden okur
  - Kolon etiketleri ("Bugün var" / "Yolda" / "Yol haritasında") ve görünüm **değişmez**
  - Bölüm başlığındaki taahhüt (*"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"*) yerinde kalır ve artık yapısal olarak karşılanır

- [x] **2. `FounderProgram`'ın üç satırını sabitten besle**
  - `StatusRow` gövdeleri düzyazı; sabitin kalemleri türetme fonksiyonuyla virgülle bağlanır
  - "v1 hazır" başlığı TASK-2.08'in kararına göre `PRODUCT_STATUS`'tan okur ya da elle kalır (karar oradaysa uygulanır)

- [x] **3. Render teyidi**
  - İki yüzeyde de kalem sayısı ve sırası sabitle aynı; "Kurumsal üyelik" artık **iki yüzeyde de** görünüyor (ya da sabitte yoksa hiçbirinde)

---

## Etkilenen Dosyalar

```
src/app/ozellikler/
└── page.tsx                            # üç kolon sabitten okur — zaten var
src/components/sections/
└── FounderProgram.tsx                  # üç StatusRow sabitten okur — zaten var
```

---

## Dikkat Noktaları

- **Görünüm değişmez.** Bu bir içerik-kaynağı işidir; kart düzeni, renkler ve `Reveal` animasyonu aynı kalır. Kullanıcının reddettiği kalıplara kayma (jenerik ikon kartı, rozet) olmaz — `docs/STYLE-GUIDE.md`.
- **Metin uzunluğu değişirse mobil satır kırılması yeniden ölçülür** (`min-w-0` tuzağı, `mobile-audit.mjs`).
- **Sabitte olmayan bir kalemi bileşende ekleme.** Ayrışmanın kaynağı tam olarak buydu.
- `FounderProgram` koyu zeminde çalışıyor — metin uzunluğu artarsa kontrastı değil **yerleşimi** kontrol et (`a11y.mjs` kontrastı zaten ölçüyor).

---

## Test Kriterleri

- [x] `grep` ile teyit: `ozellikler/page.tsx` ve `FounderProgram.tsx` içinde elle yazılmış yol-haritası kalemi **kalmadı** (B-040'ın kanıt komutu yeniden koşulur, iki ev düşmüş olmalı)
- [x] İki yüzeyde render edilen kalemler sabitle birebir aynı (sayı ve sıra dokümana yazılır)
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız (23 rota)
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` `/` ve `/ozellikler` konsol temiz
- [x] `mobile-audit.mjs` yatay kaydırma: yok (390 px'te iki yüzey de kontrol edildi)

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
- **`/ozellikler`'in üç kolonu sabitten okuyor.** Elle yazılmış 18 kalemlik dizi (10/3/5) kalktı; kolonlar `CAPABILITY_STAGES` üzerinde dönüyor, başlık `STAGE_LABEL`'dan, kalemler `CAPABILITIES[stage]` + `capabilityTitle()`'dan geliyor. Sayfada kalan tek karar **görünüm**: `STAGE_TONE` kademeye bir ton atıyor (sage/amber/neutral), kart düzeni ve `Reveal` animasyonu birebir aynı.
- **`FounderProgram`'ın üç durum satırı sabitten okuyor.** İlk satırın başlığı `PRODUCT_STATUS.version` ("v1 hazır"), gövdesi zaten türetilmişti; alt iki satırın gövdesi `capabilityProse("yolda")` / `capabilityProse("sonra")`, başlıkları `STAGE_LABEL`.
- **Yeni ortak sabit: `CAPABILITY_STAGES`** (`product.ts`). Üç kademeyi birlikte gösteren yüzeyler bunun üzerinde döner; `Object.keys(CAPABILITIES)` sırası **örtülüdür** ve sabitin içinde kademeler yer değiştirse sayfanın kolon sırası sessizce değişirdi.
- **Kapanış kapısı `tests/capabilities.test.ts`'e eklendi** (+6 senaryo): iki tüketici dosyası diskten okunuyor, sabite bağlı oldukları (import + sembol) çivileniyor ve `yolda`+`sonra` etiketlerinden **hiçbirinin** kaynakta elle geçmediği sınanıyor.

**Sorunlar:**
- **Devralınan `nextVersion` devri ölçümle çürüdü — açılmadı.** TASK-2.08'in kararı ve DURUM'un ⚠️ notu bu task'ın `PRODUCT_STATUS.nextVersion`'ı açıp orta satıra `"v1.5 yolda"` yazmasını devrediyordu. Bağlamadan önce ürünün sürüm haritası okundu (`../Alpfit.v1/_dev/PRD/VERSIONS.md`, kendi beyanıyla *"source of truth"*): ürünün **v1.5**'i sitenin `yolda` kademesinin yalnız **ilk üçünü** içeriyor, **v2**'si `sonra` kademesinin **beşini de birebir** içeriyor, ama `yolda`'ya TASK-2.08'in taşıdığı **dört B-029 kalemi haritanın hiçbir satırında yok**. Yedisine birden "v1.5" demek B-029'un ta kendisi olan çapasız iddiayı yeniden üretirdi. Alt iki satır bu yüzden sürüm numarası değil **kademe adı** taşıyor ve `nextVersion` **hiç açılmadı** (ölü borç da doğmadı). Karar `docs/DECISIONS.md` 2026-09-23'te, aynı günün 7. kararını geçersiz kılarak yazıldı; gerekçe ayrıca `site.ts` başlık yorumunda.
- **Yan kazanç:** iki yüzey artık aynı sözlüğü kullanıyor — kartın alt iki başlığı `/ozellikler`'in kolon başlıklarıyla birebir aynı ("Yolda" · "Yol haritasında").

**Kararlar:**
- **Kolon tonu bileşende kaldı, sabite girmedi.** `STAGE_TONE` bir sunum kararıdır; `src/content/` metin ve iddia taşır, Tailwind sınıfı değil (M1 sınırı).
- **Kapı `capabilities.test.ts`'e eklendi, yeni dosya açılmadı.** Soru aynı sabitin disiplinine dair ("kim bu sabiti atlıyor"); TASK-2.11 kendi iki dosyasını aynı listeye ekleyecek. Üçüncü bir iddia-testi dosyası açmak aynı konuyu üçe bölerdi.
- **Kapının kapsamı `yolda` + `sonra`, `simdi` bilinçle dışarıda** (ölçüldü): `simdi`'nin modül düzeyli etiketleri ("antrenör performansı", "diyetisyen modülü") sayfanın **meta açıklamasında** ve modül başlıklarında meşru olarak geçiyor, yani o kademeyi taramak yanlış alarm üretirdi. O sınıfın taraması TASK-2.12'nin işi.
- **Render testi yazılmadı.** Vitest `environment: "node"` ve `include` yalnız `*.test.ts`; bir bileşeni render etmek harness'ı değiştirmeyi (JSX + `.tsx` + Next bileşen çözümü) gerektirirdi. Render teyidi bunun yerine **gerçek üretim yüzeyinde** ölçüldü (3100) — sentetik render'dan daha güçlü kanıt.

**Kalan İşler:** yok (bu task'ın kapsamında). Devredilen: `chat.ts` · `faq.ts` · `karsilastirma.ts` · `fiyat/page.tsx` TASK-2.11'de bağlanır.

**Dosya Değişiklikleri:**
- `src/content/product.ts` → `CAPABILITY_STAGES` eklendi (+11 satır, gerekçeli yorumla)
- `src/content/site.ts` → `version`'ın tüketicisi doğdu; `nextVersion` **açılmadı** ve başlık yorumu ölçümü + gerekçeyi taşıyor
- `src/app/ozellikler/page.tsx` → üç kolon sabitten okuyor; 18 elle yazılı kalem silindi, `STAGE_TONE` eklendi
- `src/components/sections/FounderProgram.tsx` → üç `StatusRow` sabitten okuyor
- `tests/capabilities.test.ts` → tüketici kapısı (+6 senaryo)
- `_dev/docs/DECISIONS.md` · `_dev/memory/urun-iddiasi-capa-dogrulamasi.md` · `_dev/modules/M1-...md` → karar, süreç kuralı, bayat ölçüm

**Test Sonuçları:**
- `npm test` (web konteyneri): **121 geçti + 1 atlandı** (taban 115+1; +6 senaryo). `npx tsc --noEmit` çıkış **0**.
- **Ürettiğim kapı iki sondayla sınandı** (ikisinde de **girdi** bozuldu, kaynak değil; üç dosya scratchpad'e yedeklendi, sonra `diff -q` ile birebir geri yüklendi):
  - **Bozuk girdi:** `/ozellikler`'in kolonuna sabiti atlayan elle bir `<li>Kurumsal üyelik</li>` yazıldı — kusurun gerçekte oluşacağı yerde. **1 kırmızı**, doğru testte (`'src/app/ozellikler/page.tsx' sabiti atlayan kalem taşımıyor`). Kardeş dosyanın ayağı ve TASK-2.08'in 23 testi bu sondada **yeşil kaldı**: sabit doğru olduğu hâlde tüketici ayrışabiliyor, yani yeni kapının neden ayrı gerektiğinin kanıtı budur.
  - **Boş kapsam:** `yolda` + `sonra` kademeleri boşaltıldı → **12 kırmızı**. Kritik gözlem: bu sondada **iki "sabiti atlayan kalem taşımıyor" ayağı da YEŞİL kaldı** — aranacak etiket kalmayınca kapı hiçbir şeye bakmadan PASS basıyor. Fail-open tam orada ve onu yakalayan `yasaklı etiket listesi dolu` kırmızı verdi.
  - Sonda sonrası ağaç birebir geri yüklendi, batarya yeniden **121 + 1**.
- **B-040'ın kanıt komutu yeniden koşuldu** (atomdaki hâliyle): **15 → 10 satır**, **6 → 4 dosya**. İki hedef ev **tamamen düştü** (`ozellikler/page.tsx` 4 → **0**, `FounderProgram.tsx` 1 → **0**). Kalan 10'un **3'ü `product.ts`'in kendisi** (meşru tek kaynak: 2 etiket + 1 yorum), **7'si TASK-2.11'in kapsamı** (`faq.ts` 3 · `chat.ts` 2 · `karsilastirma.ts` 2).
- Üretim derlemesi imajın builder katmanında hatasız, **23 rota** (prerender manifest sayıldı — taban birebir).
- **Render teyidi 3100'de, gerçek servis çıktısından:** `/ozellikler` yol haritası bölümünde **24 kalem = 12 + 7 + 5**, sabitle **sayı ve sıra birebir**; kolon başlıkları "Bugün var · Yolda · Yol haritasında". *"Kurumsal üyelik"* artık **iki yüzeyde de** var. Kurucu Programı kartı **3 durum satırı**: `[v1 hazır]` · `[Yolda]` (7 kalem düzyazı) · `[Yol haritasında]` (5 kalem düzyazı). Eski elle yazılmış iki cümle serviste **0** kez geçiyor; `"v1.5"` ifadesi serviste **0**. `/` 200 / 345.525 B (taban 345.042) · `/ozellikler` 200 / 175.014 B (taban 173.449).
- `a11y.mjs` 8 rota **TOPLAM SORUN: 0**. `font-guard.mjs` 16 sayfa / **81.119 karakter** (taban 80.486), kümede olmayan karakter **yok**. `mobile-audit.mjs` **9/9 rotada yatay kaydırma yok**, iki hedef yüzeyde **taşan eleman 0**, dokunma hedefi **157** (taban birebir); sayfa boyu `/` 26.637 px · `/ozellikler` 12.676 px. `scan.mjs` 390×844 **konsol temiz**: `/` 20 kare · `/ozellikler` 16 kare.
- ⚠️ `perf.mjs` **koşulmadı**: değişiklik metin içeriği ve liste uzunluğu; ağırlık farkı ölçüldü ve ihmal edilebilir (`/` +483 B, `/ozellikler` +1.565 B), yeni varlık/istek yok.

---

## Sonuç Özeti

Yol haritasının **iki bileşen-içi kopyası kalktı**: `/ozellikler`'in üç kolonu ve `FounderProgram`'ın üç durum satırı artık `product.ts` → `CAPABILITIES`'ten okuyor. B-040'ın kanıt komutu iki evde de **0** dönüyor; ayrışmanın kendisi de kapandı — *"Kurumsal üyelik"* dört kopyanın yalnız birindeyken artık iki yüzeyde de görünüyor ve kartın 4 kalemi ile sayfanın 5 kalemi tek listede birleşti.

**Bağlamanın ikinci etkisi görünürlüktür:** `yolda` kademesi TASK-2.08/2.09'da 3 → 7 kaleme çıkmıştı ama site hâlâ 3'ünü gösteriyordu. Artık B-029'un dört karşılıksız iddiası ziyaretçiye **"yolda" olarak** görünüyor — yeşil ✓'li modül listesinde değil, kendi etiketli kolonunda. Sayfanın *"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"* taahhüdü böylece yapısal olarak karşılanıyor.

**Devralınan bir devir ölçümle çürütüldü:** `nextVersion` açılmadı, çünkü `yolda` kademesi ürünün sürüm haritasında bir sürümün kapsamı değil. Sürüm etiketinin çapası artık kayıtlı (`VERSIONS.md`) ve kural memory'de.

Kalan tüketiciler (`chat.ts` · `faq.ts` · `karsilastirma.ts` · `fiyat/page.tsx`) TASK-2.11'in işidir — kapanış ölçütü B-040 kanıt komutunun **7 → 0** düşmesidir.

---

**Oluşturulma:** 2026-09-22
