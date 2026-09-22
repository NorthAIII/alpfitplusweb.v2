# TASK-2.15: Yasaklı iddia sözlüğü ve denetimin iddia dalı (B-018 → M6 F6.4 devri)

**Durum:** ⬜ Bekliyor

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

- [ ] **1. Yasaklı iddia sözlüğü dosyası**
  - `research/lib/` altında **tek dosya**; kalıplar `docs/CLAIMS.md`'nin "söylenemez" sütunundan türer: ROI/ciro projeksiyonu, yüzde iyileşme, müşteri/üye sayısı övgüsü, üstünlük ("en hızlı", "rekor", "sadece bizde"), rakip adı kalıbı
  - Dosya başlığı **tek kaynak** olduğunu ve ikinci tüketicisinin (M6 F6.4 metin denetimi) geleceğini yazar
  - **Rakip adları repoda düz metin olarak durmaz** — kalıp/hash yaklaşımı (M6 F6.4 edge case'i); bu dosyada ad listesi tutulacaksa karar `DECISIONS.md`'ye yazılır

- [ ] **2. Denetime iddia dalını ekle**
  - `auditTexts` üçüncü dal olarak sözlüğü uygular; çıktı ad/marka dallarıyla aynı biçimde raporlanır
  - Sızıntı bulunursa **üretim durur** (mevcut davranış korunur: sıfır-olmayan çıkış, dosya yazılmaz)

- [ ] **3. Ekran bazlı izin listesini ölçerek kur**
  - Kapı **önce boş izin listesiyle** koşulur; raporlanan her kalem kaynak HTML'de aranır
  - Meşru gösterge değerleri (nötr ciro/sayı) izin listesine **gerekçesiyle** girer; projeksiyon/üstünlük kalemleri izin listesine girmez, `DROP_NODES` ya da `REPLACEMENTS` ile kapatılır
  - Ölçüm çıktısı (kaç kalem raporlandı, kaçı izin listesine girdi, kaçı düşürüldü) dokümana rakamıyla yazılır

- [ ] **4. Negatif kontrol**
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

- [ ] Sözlük `research/lib/` altında tek dosyada; başlığı tek kaynak olduğunu ve `docs/CLAIMS.md` dayanağını yazıyor
- [ ] `auditTexts` üç dallı (ad · marka · iddia); iddia dalı sözlükten besleniyor
- [ ] **B-018'in 21 dizgesi sözlüğe verildi; kaçının yakalandığı rakamıyla yazıldı** (bugünkü taban: 21'de 1)
- [ ] Hat yeşil koşuyor: 7 `.webp`, denetim sızıntı bildirmiyor
- [ ] **Negatif kontrol:** en az üç iddia dizgesi (ciro projeksiyonu, yüzde kıyası, üstünlük rozeti) denetimi kırmızıya çekiyor, betik dosya yazmıyor
- [ ] İzin listesi ölçümle kuruldu: boş listeyle koşulan turun raporu ve her kalemin akıbeti dokümanda
- [ ] Meşru gösterge verisi (finans ekranının nötr ciro değeri) yanlış alarm üretmiyor
- [ ] Çıktı görseller değişmediyse teyit edildi; değiştiyse gerekçesi yazılı

---

## Karar Noktaları

- **Rakip adları sözlükte nasıl durur:** düz metin (repoda sızıntı) vs kalıp/hash → tercih **kalıp**; karar `DECISIONS.md`'ye yazılır, kullanıcıya sorulmaz.

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
