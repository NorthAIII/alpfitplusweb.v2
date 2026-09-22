# TASK-2.04: Fiyat sayfasının mobil ana çağrısı 52 px'e döner (B-034)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M2 — Sayfalar ve Bölümler (`modules/M2-Sayfalar-ve-Bolumler.md`)
**Feature:** F2.1: Ana sayfa · F2.2: Alt sayfalar (`PriceCalculator` altı rotada render ediliyor)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok

---

## Hedef

`PriceCalculator`'ın CTA çiftini ("Demo İste" + "Fiyat ayrıntısı") her mobil genişlikte tasarlanan **52 px** yüksekliğe döndürmek. Bugün ikisi de **24 px** — `h-13` sınıfı var ama kolon modunda `flex-1`'in `flex-basis: 0%`'ı ana eksen olan yüksekliği eziyor.

Task, 320/360/390/412 px'te iki butonun da ≥ 52 px ölçüldüğünde ve 640 px üstünde regresyon olmadığında tamamlanmış sayılır.

---

## Bağlam

Ölçüm (B-034, 2026-09-12): 320/390/639 px'te `cssH 24px`, 640 px'te `52px` — `sm:` kırılımında kap satıra dönünce basis genişliğe geçiyor ve yükseklik geri geliyor. Etki **6 rota × 2 buton = 12 örnek** (`/`, `/fiyat`, dört segment sayfası); bu sitenin ana dönüşüm yüzeyi ve ölçüsü tasarlananın **%46'sı**, aynı zamanda sitedeki en ağır dokunma-hedefi ihlali (eşik 44 px).

**Doğru deyim kod tabanında zaten var:** `DemoForm.tsx:240` ve `:253` aynı deseni `sm:flex-1` ile yazıyor.

Bugüne dek görünmemesinin sebebi ölçüm kapsamı: `mobile-audit.mjs` dokunma hedefini `h < 40 && w < 200` kuralıyla arıyor, buton **302 px geniş** olduğu için muafiyete takılıyor. **Kapı tarafının düzeltilmesi bu fazın kapsamı dışında** — `mobile-audit.mjs`'in muafiyeti ve eşiği B-015/B-031 ile birlikte "Kalite kapıları otomatik" fazına ait (`phases/PHASE-2.md` → Kapsam Dışı).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-034-mobilde-ana-cagri-24px.md` — ölçüm tablosu ve mekanizma
- `_dev/docs/STYLE-GUIDE.md` → Düzen Tuzakları — aynı sınıfın kardeşleri
- `src/components/sections/DemoForm.tsx:240,253` — doğru deyimin kod tabanındaki örneği
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — Playwright ölçümü nasıl koşturulur

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-034-*.md` — Çözüm Kaydı ve durum (kapanış ölçümüyle)

---

## Alt Görevler

- [x] **1. İki satırı düzelt**
  - `src/components/sections/PriceCalculator.tsx:164` ve `:167` → `flex-1` yerine `sm:flex-1`
  - Kap satırına (`:163`) dokunulmaz — `flex-col … sm:flex-row` doğru

- [x] **2. Dört mobil genişlikte ölç**
  - 320 / 360 / 390 / 412 px: iki butonun da ölçülen yüksekliği ≥ 52 px
  - 640 ve 1440 px kontrol grubu: yükseklik ve genişlik davranışı **değişmemiş** olmalı (satır modunda `flex-1` hâlâ eşit genişlik veriyor)
  - Betik scratchpad'e yazılır, `research/`'e kalıcı dosya bırakılmaz (`memory/arastirma-konteynerinde-tarayici-olcumu.md`)

- [x] **3. Altı rotanın tamamında teyit**
  - `/`, `/fiyat` ve dört segment sayfası — 12 örneğin 12'si 390 px'te ölçülür

---

## Etkilenen Dosyalar

```
src/components/sections/
└── PriceCalculator.tsx     # iki satırda flex-1 → sm:flex-1 — zaten var
```

---

## Dikkat Noktaları

- **Yalnız iki satır.** `h-13`'e, kap sınıflarına, buton bileşenine dokunma — B-033 (320 px'te `ui/Button` temel sınıfı) bilinçli olarak **başka bir faza** ait ve o dosyaya dokunmak kapsamı genişletir.
- **Mekanik kural bu task'ta eklenmiyor.** Research ölçtü: depoda dokuz `flex-1` kullanımı var, yedisi kırılımsız ve **beşi meşru** (`SegmentsGrid.tsx:50,54`, `Assistant.tsx:167,150`, `ProductStory.tsx:200`). Ayırt edici imza dar — sabit yükseklik (`h-*`) + `flex-1` + kolon kabı; imzasız yazılan bir kural beş yanlış alarm verir.
- **`mobile-audit.mjs` bu düzeltmeyi göremez** (genişlik muafiyeti). "Kapı yeşil" bir kanıt değildir; ölçümü doğrudan yükseklik okuyarak yap.
- Değişiklik CSS sınıfı düzeyinde; `a11y.mjs` ve `scan.mjs` yine koşturulur ama beklenen etki yok.

---

## Test Kriterleri

- [x] 320 / 360 / 390 / 412 px'te `/fiyat` sayfasındaki iki CTA'nın ölçülen yüksekliği **≥ 52 px** (rakamlar dokümana yazılır) — kanal: UAT (gerçek tarayıcı yerleşimi; yerel koşucu bu katmanı ölçmüyor)
- [x] 640 ve 1440 px'te yükseklik 52 px ve genişlik davranışı değişmemiş (kontrol grubu) — kanal: UAT
- [x] Altı rotanın 12 örneğinin 12'si 390 px'te ≥ 52 px — kanal: UAT
- [x] `mobile-audit.mjs` → yatay kaydırma: yok (regresyon yok)
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `scan.mjs` `/fiyat` ve bir segment sayfasında konsol temiz
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız

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
- **Taban önce ölçüldü.** Düzeltmeden *önce* koşan ölçüm B-034'ü birebir üretti: `/fiyat`'ta 320/360/390/412 px'te iki CTA da **24 px** (`cssH 24px`, `flex-basis 0%`, kap `flex-direction: column`), 640/1440 px'te 52 px. Altı rotanın 12 örneğinde **0/12** geçti. Bu, "sonra yeşil"in kanıt sayılabilmesinin ön koşuluydu — ölçüm düzeneğinin kırmızıyı gösterebildiği böylece görüldü.
- **İki satır değişti.** `PriceCalculator.tsx:164` ve `:167` → `className="flex-1"` yerine `className="sm:flex-1"`. Kap satırı `:163` (`flex flex-col … sm:flex-row`), `h-13`, buton bileşeni ve kardeş sınıflar **değişmedi**.
- **Aynı betikle sonra ölçüldü.** Dört mobil genişlikte ikisi de **52 px** (`flex-basis` kolon modunda `0%` → `auto`), altı rotada **12/12**; masaüstü kontrol grubu **rakamı rakamına aynı** kaldı.
- **Üretim provası (3100) tazelendi.** İmaj yeniden derlendikten sonra çalışan konteyner hâlâ eski sınıfı sunuyordu; bu ayrışma bu turda doğduğu için konteyner yeni imaja alındı.

**Sorunlar:**
- **`npm run build`'i nerede koşturmalı:** `docker compose exec web npm run build`, `next_cache` isimli hacmi `web` ile paylaştığı için **bu oturumun başlatmadığı** geliştirme sunucusunun derlemesini ezecekti (`memory/arastirma-konteynerinde-tarayici-olcumu.md`). Çözüm: TASK-2.02'nin kurduğu izole yol — derleme üretim imajının builder katmanında koşturuldu (`docker compose --profile prod build web-prod`), paylaşılan hacme dokunulmadı.
- **İmaj tazelendi ama konteyner eskide kaldı:** derlemeden sonra 3100 hâlâ `flex-1` sunuyordu (3000 `sm:flex-1`). Ayrışma ölçülerek gösterildi ve `docker compose --profile prod up -d web-prod` ile kapatıldı; 3100 yeniden `sm:flex-1` sunuyor, HTTP 200.

**Kararlar:**
- **Mekanik kural eklenmedi** — araştırmanın kararı uygulandı (`phases/PHASE-2.md`): depodaki dokuz `flex-1` kullanımının **beşi meşru**, ayırt edici imza dar (sabit `h-*` + `flex-1` + kolon kabı) ve imzasız bir kural beş yanlış alarm verir.
- **`mobile-audit.mjs`'in muafiyeti bu task'ta düzeltilmedi** — kapı tarafı bilinçli olarak "Kalite kapıları otomatik" fazına ait (B-015/B-031).
- **`DemoForm.tsx:95` kardeş kabı denetlendi, temiz** — aynı `flex-col … sm:flex-row` deseni ama çocukları `size="md"` ve `flex-1` taşımıyor; ikinci bir örnek yok.
- **B-034 atomunun tarihsel "Kanıt" bloğundaki satır numaraları (`DemoForm.tsx:177,190`) değiştirilmedi** — o blok 2026-09-12 ölçümünün kaydıdır; bugünkü çapa (`:240,253`) Çözüm Kaydı'na yazıldı.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü maliyetli bir sözleşme (ad/şema/API) doğmadı; bilinen bir hatanın zaten var olan deyime çekilmesi.

**Kalan İşler:**
- Yok. B-034'ün düzeltme ayağı kapandı; kapı tarafı (muafiyet + 44 px eşiği) başka fazda.

**Son Yaklaşım:**
Tamamlandı — devam gerektiren bir yaklaşım yok.

**Sonraki Adım Detayı:**
Yok; sıradaki task TASK-2.05.

**Dosya Değişiklikleri:**
- `src/components/sections/PriceCalculator.tsx` → `:164` ve `:167`, `className="flex-1"` → `className="sm:flex-1"` (iki satır; başka değişiklik yok)

**Test Sonuçları:**

**1) CTA yüksekliği — geçici Playwright betiği, dev sunucusuna (3000) karşı, düzeltmeden önce ve sonra aynı betik.** Betik scratchpad'de tutuldu, `research/`'e dosya bırakılmadı; kapsam yalnız `PriceCalculator`'ın CTA çifti (`mt-6 flex flex-col gap-2.5 sm:flex-row` tam sınıf dizisiyle seçildi — depoda tekil).

| `/fiyat` genişlik | ÖNCE (ölçülen) | SONRA (ölçülen) | kap yönü |
|---|---|---|---|
| 320 px | 232×**24** · basis `0%` | 232×**52** · basis `auto` | column |
| 360 px | 272×**24** · basis `0%` | 272×**52** · basis `auto` | column |
| 390 px | 302×**24** · basis `0%` | 302×**52** · basis `auto` | column |
| 412 px | 324×**24** · basis `0%` | 324×**52** · basis `auto` | column |
| 640 px *(kontrol)* | 255×52 · basis `0%` | 255×52 · basis `0%` | row |
| 1440 px *(kontrol)* | 303×52 · basis `0%` | 303×52 · basis `0%` | row |

Mobil dörtlüde iki buton da ölçüldü: **0/8 → 8/8** örnek ≥ 52 px. Masaüstü kontrol grubu **birebir değişmedi** — genişlik davranışı da (satır modunda eşit genişlik) korundu.

**2) Altı rota × 2 buton @ 390 px:** `/`, `/fiyat`, `/segmentler/pilates-reformer`, `/segmentler/boks-dovus`, `/segmentler/crossfit`, `/segmentler/cok-subeli-zincir` — hepsinde 302×24 → 302×52. **0/12 → 12/12** örnek ≥ 52 px.

**3) `mobile-audit.mjs`** (9 rota): **yatay kaydırma: yok** — dokuz rotanın dokuzunda da; M6 başlangıç çizgisi ("yatay kaydırma 0") karşılandı. TOPLAM SORUN **157** = küçük dokunma hedefi sayımı; bu **kayıtlı ve değişmemiş** sayıdır (`tasks/archive/TASK-1.09.md`, `phases/PHASE-1-UAT.md` satır 29). ⚠️ **Kapı bu düzeltmeyi önce de sonra da göremedi** — buton 302 px geniş olduğu için `rc.width < 200` muafiyetine takılıyor; 157'nin sabit kalması bu körlüğün kanıtıdır, düzeltmenin değil. Bu task'ın kanıtı yukarıdaki doğrudan yükseklik ölçümüdür.

**4) `a11y.mjs`** (8 rota, `/fiyat` ve `/segmentler/pilates-reformer` dâhil): **TOPLAM SORUN: 0**.

**5) `scan.mjs`** 390×844'te iki sayfada: `/fiyat` → 10 kare / 7 734 px / **konsol temiz**; `/segmentler/crossfit` → 11 kare / 9 190 px / **konsol temiz**.

**6) `docker compose exec web npm test`** (Vitest): 6 dosya — **66 geçti + 1 atlandı**, taban birebir (`lead-store.contract` env kapısı yok, atlandı). Kapsam notu: bu değişikliği saf fonksiyon testleri **kapsamıyor**; kapsayan ölçüm (1) ve (2)'dir.

**7) Üretim derlemesi:** üretim imajının builder katmanında **hatasız** (çıkış 0, rota ağacı tam basıldı, standalone çıktı üretildi). Paylaşılan `next_cache` hacmine dokunulmadı.

**8) Tazelik kontrol grubu (3100):** derleme sonrası çalışan konteyner hâlâ `… text-base flex-1` sunuyordu, dev (3000) ise `… text-base sm:flex-1`. Konteyner yeni imaja alındıktan sonra 3100 da `sm:flex-1` sunuyor — HTTP 200, 119 921 B. Üç servis (`web`, `web-prod`, `lead-store`) tur başındaki hâliyle ayakta.

**Ölçülmeyenler (bilinçli):** `font-guard.mjs` ve `perf.mjs` koşturulmadı — değişiklik tek bir CSS sınıfı önekidir, metin/karakter kümesine ve varlık ağırlığına dokunmaz; task test kriterleri de ikisini istemiyor. Gerçek cihaz, iOS Safari ve WebKit kapsanmadı — o kol UAT'a ait (`kanal: UAT`).

---

## Sonuç Özeti

**B-034 kapandı.** Fiyat hesaplayıcısının CTA çifti artık her mobil genişlikte tasarlanan **52 px**: `320/360/390/412 px`'te ölçülen yükseklik 24 → 52 px, altı rotadaki 12 örneğin **12'si** eşiği geçiyor (önce 0'ı geçiyordu). Masaüstü davranışı rakamı rakamına değişmedi (640 px 255×52, 1440 px 303×52).

**Mekanizma:** kolon modunda `flex: 1 1 0%`'ın basis'i ana eksen olan **yüksekliği** hedefliyor ve `h-13`'ü eziyordu; `sm:` öneki basis'i yalnız satır moduna bıraktı — ölçümde `flex-basis` kolon modunda `0%` → `auto` olarak görüldü. Düzeltme kod tabanında zaten var olan deyimdir (`DemoForm.tsx:240,253`), yeni bir desen getirilmedi.

**Değişen:** tek dosya, iki satır (`src/components/sections/PriceCalculator.tsx:164,167`).

**Kurulmayan (bilinçli):** mekanik kural eklenmedi (beş meşru `flex-1` kullanımı yanlış alarm verirdi) ve `mobile-audit.mjs`'in genişlik muafiyeti düzeltilmedi — ikisi de "Kalite kapıları otomatik" fazına ait (B-015/B-031). Bugün bu sınıfı yakalayacak otomatik kapı **yok**; bu turun kanıtı doğrudan yükseklik ölçümüdür.

---

**Oluşturulma:** 2026-09-22
