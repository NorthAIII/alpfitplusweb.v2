# TASK-3.15: Roller bölümü — sekme şeridi 320 px'te sığar, görsel eşlemesi düzelir

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler · M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F2.1 Ana sayfa · F5.1 Ürün ekran görüntüsü hattı
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.07 ✅

---

## Hedef

`Roles` bölümünün iki kusurunu kapatmak:

1. **320 px'te tek kart pencereden geniş.** Sekme şeridi `flex gap-2 overflow-x-auto`, kartlar `shrink-0` ve genişlikleri sabit `[360, 360, 360, 358]`. 320 px'te bir rol kartı **hiçbir zaman tümüyle görünmüyor**.
2. **Görsel eşlemesi bir satır kaymış.** Antrenör sekmesi rezervasyon takvimini (`SHOTS.takvim`), diyetisyen sekmesi antrenör ekranını (`SHOTS.antrenor`) gösteriyor. Antrenör satırı **bir hatadır ve düzeltilir** — doğru içerik üretilen kümede zaten var.

---

## Bağlam

B-033'ün ikinci kalemi + B-046'nın ölçülmüş eşleme tablosu:

| Sekme | Bugün gösterdiği | Olması gereken |
|---|---|---|
| Üye | `SHOTS.uyeTelefon` | ✓ doğru |
| **Antrenör** | `SHOTS.takvim` (masaüstü takvimi) | **`SHOTS.antrenor`** |
| **Diyetisyen** | `SHOTS.antrenor` | karşılığı **yok** |
| Yönetim | `SHOTS.cockpit` | ✓ doğru |

⚠️ **Araştırma bu iddiayı genişletti:** "antrenör satırı tek satırlık bir hatadır ve doğru ekran kümede var" **eksik** çıktı. `SHOTS.antrenor` görseli **1200×866 — bir masaüstü ekranı**, antrenör rolü ise `device: "mobil"`. Yani tek satırlık düzeltmeden sonra da telefon çerçevesinde masaüstü panosu durur. Ürünün demo destesi tarandı: `.phone` yüzeyi üç dosyada var (üye ×2, patron ×1) — **antrenör telefonu yok.**

Kullanıcı kararı: antrenör ve diyetisyen telefon ekranları ürün deposuna eklenecek (TASK-3.24, koşullu). **Bu task onları beklemez** — eşleme hatasını ve şerit genişliğini şimdi kapatır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (2) ve triyaj kaydı
- `_dev/bulgular/B-033-320px-kurucu-programi-icerik-kaybi.md` — şerit kalemi
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (antrenör ve diyetisyen ekranları)
- `_dev/docs/CLAIMS.md` — diyetisyen modülü ürünün tek "gerçek fark"ı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/BULGULAR.md` — B-046'nın diyetisyen ayağı **açık kalır** (kapandı işaretlenmez)

---

## Alt Görevler

- [ ] **1. Şerit genişliği**
  - Kart genişlikleri 320 px pencereye sığacak biçimde esnetilir (sabit `[360,360,360,358]` yerine pencereye bağlı bir tavan)
  - Ölçüt: kaydırılabilir kapta **tek bir çocuk** kabın görünür genişliğinden geniş olmamalı (TASK-3.07'nin kurduğu kapı bunu ölçüyor)

- [ ] **2. Antrenör satırını düzelt**
  - Çapa: `src/components/sections/Roles.tsx` → `VISUAL` eşlemesi (⚠️ `grep -n "VISUAL"` ile konumlan)
  - `antrenor: SHOTS.antrenor`

- [ ] **3. Çerçeve ↔ görsel uyumsuzluğunu dürüstçe çöz**
  - `SHOTS.antrenor` masaüstü ekranı olduğu için `PhoneFrame`'e sığmıyor. İki yol: (a) rolün `device` değerini görselin gerçeğine çekmek (geçici, TASK-3.24 gelince geri alınır), (b) telefon ekranı gelene kadar `BrowserFrame` kullanmak
  - Seçilen yol koda yorum olarak yazılır ve **geçici olduğu** belirtilir

- [ ] **4. Diyetisyen sekmesinin alt metnini sekmeyle tutarlı yap**
  - Bugün `shots.ts` alt metni *"Alpfit Plus antrenör detay ekranı…"* diyor; ekran okuyucu "Diyetisyen" sekmesinde "antrenör ekranı" duyuyor
  - Vekil kullanılmaya devam edeceği için gerekçe koda yazılır ve alt metin sekmeyle çelişmez hâle getirilir

---

## Etkilenen Dosyalar

```
src/components/sections/Roles.tsx   # şerit genişliği, VISUAL eşlemesi, çerçeve seçimi
src/content/shots.ts                # diyetisyen vekilinin alt metni
```

---

## Dikkat Noktaları

- **Diyetisyen ayağı "bilinçli tercih" olarak KAYDEDİLMEZ.** Karar açık: kayıt yazmak sonraki denetimlere yanlışlıkla "kapandı" sinyali verir. Bulgu kanvasta açık durur.
- **İddia sınırı:** alt metin ürünün gerçekten gösterdiğini anlatmalı — gösterilmeyen bir ekranı anlatan alt metin `docs/CLAIMS.md`'nin "kanıtsız iddia" sınırına girer.
- **Kapı açılan katmanları ölçmüyor** (B-015, kapsam dışı): ilk boyada yalnız aktif sekmenin görseli render ediliyor, bu yüzden eşleme hatası bugüne dek görünmedi. Doğrulama **elle sekme tıklanarak** yapılır.
- **`next/image` `src`'i URL-kodlar** — `img[src*="/product/"]` seçicisi hiç eşleşmez (ölçülmüş tuzak). Doğrulama betiği yazarsan eşleşme sayısını bas.
- **Metin `src/content/`'te kalır** — alt metin düzeltmesi de orada yapılır, bileşende değil.

---

## Test Kriterleri

- [ ] `mobile-audit.mjs` 320 px'te Roller şeridi ihlali vermiyor; 320 px'te bir rol kartı tümüyle görünüyor (ekran görüntüsü)
- [ ] Antrenör sekmesi antrenör ekranını gösteriyor (elle tıklanarak doğrulandı)
- [ ] Antrenör sekmesindeki görsel okunabilir ölçekte — telefon çerçevesinde 244×129 px'lik masaüstü panosu kalmadı
- [ ] Diyetisyen sekmesinin alt metni sekmeyle çelişmiyor
- [ ] Dört sekmenin hepsi 320 · 390 · 1440 px'te tıklanıp görselleri gözlendi
- [ ] Beş ölçüm regresyon çizgisini koruyor

---

## Karar Noktaları

- **Antrenör sekmesinin çerçevesi:** rolün `device` değerini geçici olarak `web`e çekmek vs. `BrowserFrame` kullanmak → ikisi de geçici; TASK-3.24 gelirse geri alınır. Seçim task oturumunda yapılır, gerekçe koda yazılır.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-23
