# TASK-2.13: Ürün görsellerinde gerçek ad ve olmayan özellikler temizlenir (B-018)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M5 — Görsel Varlık Hattı (`modules/M5-Gorsel-Varlik-Hatti.md`)
**Feature:** F5.1: Ürün ekran görüntüsü hattı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok

---

## Hedef

Yayındaki ürün görsellerinde duran üç sızıntıyı temizlik tablosundan kapatmak: ana sayfada render edilen **"Gizem Ö."** (gerçek kişi adı), yedi görselin altısındaki **"Kampanyalar"** menü girdisi ve `raporlar.webp`'teki **"Yenileme & Churn"** kartı — ikisi de ürünün bugün taşımadığı, `/ozellikler`'in "Yolda" kolonunda duran özellikler.

Task, hat yeniden koşturulduğunda çıktı görsellerinde üç kalem de görünmediğinde tamamlanmış sayılır. **Denetimin kendisi bu task'ta güçlenmiyor** — TASK-2.14 ve TASK-2.15.

---

## Bağlam

`legal.ts:302` ziyaretçiye *"Gerçek bir kulübün veya kişinin verisi gösterilmemektedir"* diyor; `grup.webp`'teki "Box · **Gizem Ö.** · 17:00 · 60 dk" bu beyanı çürütüyor ve görsel `ProductStory.tsx:52` ile **ana sayfada** render ediliyor (audit-product 2026-09-22, gözle doğrulandı).

Temizlik tablosu adı **biliyor** — `screen-cleanup-v2.mjs:26-31` içinde `['Gizem Örge','Yasemin U.']` eşlemesi var; kaçıran şey kalıp: eşleme **tam ada** göre yazılmış, metinde çıplak ilk ad ya da kısaltılmış hâl geçiyor.

Kaynak çapalar: `../Alpfit.v1/demo/grup.html:209` ("Gizem Ö."), `raporlar.html:242` (`<h4>Yenileme &amp; Churn</h4>`), "Kampanyalar" altı kaynak HTML'de birer geçiş, **hepsi sol menüde `<a>` olarak** — `uye-telefon` çıktısı `takvim.html`'in `.phone` kökünden üretildiği için menüyü taşımaz.

`sube` ekranı hattan zaten düşürüldü (QUICK-001); o görselde duran kalemler (Simge & Gizem, ciro projeksiyonu) **kapalı**, ama tablo eşlemeleri ileride geri eklenme ihtimaline karşı yazılır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` — üç kalem, kaynak çapaları, 2026-09-22 yeniden ölçümü
- `_dev/bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md` — **tam sızıntı envanteri** (kapanış kapsamının ölçütü); bu fazda yalnız üç kalem kapsamda
- `_dev/phases/PHASE-2.md` → Dikkat Edilecekler → "Ad temizliğinde sıra tuzağı" ve "'Kampanyalar' ortak kabuktadır"
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.1 kabul kriterleri ve edge case'ler
- `research/lib/screen-cleanup-v2.mjs` · `research/lib/screen-cleanup.mjs` (v1 tablosu, **gövdesi düzenlenmez**) · `research/scripts/render-product.mjs`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/bulgular/B-018-*.md` — üç kalemin Çözüm Kaydı; atom **TASK-2.15'te kapanır** (kök neden denetimde)

---

## Alt Görevler

- [ ] **1. Çıplak ilk ad ve kısaltılmış hâl eşlemeleri**
  - `screen-cleanup-v2.mjs`'e "Gizem Ö." ve "Simge & Gizem" sınıfını kapsayan eşlemeler eklenir
  - **Sıra kuralı:** `REPLACEMENTS` düz metin değişimidir — "Gizem" → "Yasemin" kuralı "Gizem Örge" kuralından **önce** koşarsa sonuç "Yasemin Örge" olur. Eşlemeler **en uzun önce** sıralanır (ya da sıralama üretim anında garanti edilir)
  - Avatar baş harfleri (`INITIALS`) eşlemeyle **senkron** kalır

- [ ] **2. "Kampanyalar" ortak kabuk kuralı**
  - Menü girdisi ekran başına tekrarlanmak yerine **ortak kabuk kuralı** olarak yazılır (altı kaynakta birer geçiş, hepsi sol menüde `<a>`)
  - `uye-telefon` çıktısı menüyü taşımıyor — kural onu gereksiz yere hedeflemez

- [ ] **3. "Yenileme & Churn" kartını düşür**
  - `raporlar` için `DROP_NODES` girdisi; çapa `raporlar.html:242`
  - Düşürmenin kırpma (`clipBelow: '.repgrid'`) ile etkileşimi kontrol edilir — kart kırpma dışındaysa da düşürmek denetimin gördüğü kütleyi temizler (mevcut `takvim` girdisinin gerekçesiyle aynı desen)

- [ ] **4. Hattı yeniden koştur ve çıktıyı doğrula**
  - `docker compose --profile research run --rm research node scripts/render-product.mjs`
  - 7 `.webp` üretilir, denetim sızıntı bulmaz, çıktılar gözle kontrol edilir

---

## Etkilenen Dosyalar

```
research/lib/
└── screen-cleanup-v2.mjs      # eşlemeler, ortak kabuk kuralı, DROP_NODES — zaten var
public/product/*.webp          # betik çıktısı — ELLE DÜZENLENMEZ, yeniden üretilir
```

---

## Dikkat Noktaları

- **`public/product/` elle düzenlenmez** (`CLAUDE.md` → Dokunulmazlar). Görseller yalnız betikle üretilir.
- **v1'in tablosu (`screen-cleanup.mjs`) birebir korunur** — dosyanın kendi başlığı bunu söylüyor; eklemeler v2 uzantısına yazılır ve her satırın gerekçesi yanında durur.
- **Sıra tuzağı gerçek ve ölçülmüş** (yukarıda) — düşürme (`DROP_NODES`) değişimden **önce** koşar, o yüzden düşen düğümlerdeki adlar hiç görülmez; sıra yalnız `REPLACEMENTS` içinde sorundur.
- **Düşürülecek yol haritası kalemleri `src/content/`'ten beslenemez** — araştırma konteyneri `src/`'i görmüyor (ölçüldü). Kalemler `research/lib/` içinde **elle** tutulur; kaynaktan besleme bu fazda **açılmaz** (bilinçli, kayıt `phases/PHASE-2.md`).
- **Kapsam üç kalemdir.** B-044'ün avatar-ad uyumsuzlukları ve Hero'daki elle yazılmış "%78" kalemi **kanvasta kalır** (`phases/PHASE-2.md` → Kapsam Dışı).
- **`sube` geri eklenmez** — geri eklemenin koşulu denetimin üç dalının kapanmasıdır (`modules/M5-*.md` → F5.1 edge case); bu faz iki dalını açıyor, karar o gün verilir.
- Görsel değişirse sayfa ağırlığı ve LCP yeniden ölçülür (`perf.mjs`, üretim konteyneri ayakta olmalı).

---

## Test Kriterleri

- [ ] Hat yeşil koştu: **7 `.webp`** üretildi, betik sıfır kodla çıktı, denetim sızıntı bildirmedi
- [ ] `grup.webp`'te "Gizem Ö." **yok** (gözle ve metin denetimiyle); yerine gelen nötr ad avatar baş harfleriyle **tutarlı**
- [ ] Yedi görselin hiçbirinde "Kampanyalar" menü girdisi yok (ekran ekran sayım dokümana)
- [ ] `raporlar.webp`'te "Yenileme & Churn" kartı yok
- [ ] Sıra tuzağı sınandı: tabloda hem tam ad hem çıplak ilk ad varken çıktıda "Yasemin Örge" gibi melez bir ad **oluşmuyor** (negatif kontrol)
- [ ] `perf.mjs` ile ana sayfa ağırlığı ve LCP ölçüldü, başlangıç çizgisine göre regresyon yok (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar)
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `scan.mjs` `/` ve `/ozellikler` konsol temiz
- [ ] `git status`: `public/product/` altında beklenen dosyalar değişmiş, beklenmeyen dosya yok

---

## Risk ve Geri Dönüş Planı

- **Ortak kabuk kuralı fazla düşürürse** (menü dışında aynı metin geçen bir yer) çıktı görselde eksik bölüm doğar → gözle kontrol bunu yakalar; kural ekran bazlı daraltılır.
- **Rollback:** tablo dosyası tek dosya; hat yeniden koşturularak önceki çıktı geri üretilir (görseller betikten doğar, git'ten geri almak yeterli değildir — **yeniden üret**).

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
