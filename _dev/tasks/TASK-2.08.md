# TASK-2.08: Yetenek ve yol haritası tek kaynağı — `product.ts`'te üç kademeli sabit (B-029, B-040)

**Durum:** ⬜ Bekliyor

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

"Kurumsal üyelik" dört kopyanın **yalnız birinde**; "Apple Health ve Google Fit" ikisinde. Hiçbiri `src/content/` sabiti değil. `legal.ts:263` ziyaretçiye *"Yolda olan ve yol haritasında bulunan özellikler ayrı ayrı belirtilir"* taahhüdünü veriyor.

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

- [ ] **1. Üç kademeli sabiti kur**
  - `src/content/product.ts` → üç kademe: bugün var · yolda · yol haritasında
  - Kalemlerin birleşik kümesi bugünkü beş evin **birleşimidir** ("Kurumsal üyelik" dâhil); çelişkiler B-029'un ürün-kodu ölçümüne göre çözülür — karşılığı olmayan kalem "bugün var" kademesine yazılmaz
  - Her kademe düzyazıya çevrilebilir olmalı (tüketiciler kalemleri virgülle bağlıyor); türetme yardımcı fonksiyonu sabitle aynı dosyada durur
  - Sabitin başına, `PRODUCT_STATUS`'ınki gibi **tek kaynak** olduğunu söyleyen bir başlık yorumu yazılır

- [ ] **2. `PRODUCT_STATUS.modules`'ü sabitten türet**
  - Bugün sekiz modülü düzyazı sayıyor ve `chat.ts:126`'da elle kopyalanmış (B-014)
  - Yeni hâl listeden türer; hangi modüllerin sayılacağı "bugün var" kademesinden gelir

- [ ] **3. `short` ve `version` alanlarının akıbeti**
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
- **Rakip adı ve pilot sınırı** sabitin içinde de geçerli (`docs/CLAIMS.md`).

---

## Test Kriterleri

- [ ] `src/content/product.ts`'te üç kademeli tek sabit var; her kademe kalemleri liste olarak tutuyor ve düzyazıya çevirme türetmeyle yapılıyor
- [ ] `PRODUCT_STATUS.modules` artık elle yazılmış düzyazı değil, sabitten türüyor; ürettiği cümle bugünküyle **anlamca aynı ya da düzeltilmiş** (fark dokümana yazılır)
- [ ] `short` / `version` kararı uygulandı (bağlandı ya da silindi) ve `DECISIONS.md`'ye yazıldı
- [ ] B-029'un beş karşılıksız kaleminin hiçbiri "bugün var" kademesinde **değil** (kalem kalem gösterilir)
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız (23 rota)
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok (yeni metin girdiyse) · `scan.mjs` `/` ve `/ozellikler` konsol temiz
- [ ] `grep` ile teyit: sabit dışında yeni bir yol-haritası listesi doğmadı

---

## Karar Noktaları

- **`short` ve `version`:** tüketiciye bağlanacak mı, silinecek mi → tercih **bağlama** (TASK-2.10'da `FounderProgram`'ın elle yazdığı "v1 hazır" oradan okur); tüketici doğmazsa silinir. Kullanıcıya sorulmaz, `DECISIONS.md`'ye yazılır.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- run-task dolduracak -->

---

## Sonuç Özeti

<!-- Task tamamlanınca doldurulacak -->

---

**Oluşturulma:** 2026-09-22
