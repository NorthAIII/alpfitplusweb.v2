# TASK-3.24: (koşullu) Diyetisyen ve antrenör telefon ekranları üretilir

**Durum:** ⬜ Bekliyor
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F5.1 Ürün ekran görüntüsü hattı · F2.1 Ana sayfa (Roller)
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.15 ✅ · **ürün deposuna iki ekranın eklenmiş olması (kullanıcıya bağlı)**

---

## Hedef

Ürünün demo destesine **diyetisyen** ve **antrenör telefonu** ekranları eklendiyse, görsel hattı ikisini de olağan biçimde üretir ve temizler; `Roles` eşlemesi ve rol `device` değerleri gerçeğe çekilir. Diyetisyen sekmesi ödünç görselden kurtulur, antrenör sekmesi telefon çerçevesinde gerçek bir telefon ekranı gösterir.

**⚠️ Bu task koşulludur ve fazı kilitlemez.** Ekranlar gelmediyse task **❌ İptal** işaretlenir, faz kapanır, ve B-046'nın iki ayağı kanvasta **açık** durur — "bilinçli tercih" kaydı yazılmaz.

---

## Bağlam

Kullanıcı kararı (PHASE-3 → Teknik Kararlar): *"Antrenör ve diyetisyen ekranları birlikte istenir: ürünün demo destesine iki ekran eklenecek, görsel hattı ikisini de olağan biçimde üretecek. Faz bu adıma kilitlenmez."*

**Neden iki ekran, bir değil** (araştırmada büyüdü): ürünün demo destesi tarandı — `.phone` yüzeyi **üç** dosyada var (`takvim.html` → üye, `grup.html` → üye, `patron-mobil.html` → patron). **Antrenör telefonu yok.** Antrenör rolü `device: "mobil"` olduğu için tek satırlık eşleme düzeltmesinden sonra da telefon çerçevesinde masaüstü panosu durur.

**Neden diyetisyen ayrıca ağır:** `docs/CLAIMS.md` diyetisyen modülünü ürünün **tek "gerçek fark"ı** sayıyor (18 rakip üründe görülmedi) ve sitede o farkın kendi görüntüsü yok. Ürünün kendisinde diyetisyen ekranları var (`../Alpfit.v1/web/src/pages/DietitianMembersPage.tsx` vb.) — eksik olan demo destesi.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (2) ve triyaj kaydı
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.1 kabul kriterleri ve sızıntı denetiminin dört dalı
- `_dev/docs/CLAIMS.md` — sızıntı denetimi, yasaklı ad/iddia sözlükleri
- `_dev/tasks/archive/TASK-3.15.md` — geçici çerçeve çözümü (geri alınacak)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/BULGULAR.md` — B-046'nın iki ayağı (kapanırsa çözüm kaydıyla)

---

## Alt Görevler

- [ ] **0. Ön koşulu doğrula**
  - `../Alpfit.v1/demo/` altında diyetisyen ve antrenör telefonu ekranları var mı — yoksa task ❌ İptal edilir, gerekçe Oturum Kaydı'na yazılır, faz kapanışı engellenmez

- [ ] **1. Hattı koştur**
  - `docker compose --profile research run --rm research node scripts/render-product.mjs` (ürün deposu `:ro` mount ile)
  - Temizlik tablosu yeni ekranların ad/semt/marka/iddia kalemlerini kapsıyor mu — kapsamıyorsa tablo genişletilir

- [ ] **2. `shots.ts`'e yeni anahtarlar ve alt metinler**
  - Alt metin ekranın gerçekten gösterdiğini anlatır (iddia sınırı)

- [ ] **3. `Roles` eşlemesini ve `device` değerlerini gerçeğe çek**
  - TASK-3.15'in geçici çerçeve çözümü geri alınır; antrenör `device: "mobil"` ve gerçek telefon ekranı, diyetisyen kendi ekranı

- [ ] **4. Kabul kriterini güncelle**
  - F5.1 çıktı sayısı 7'den artar — `modules/M5-Gorsel-Varlik-Hatti.md` kriteri yeni sayıya çekilir

---

## Etkilenen Dosyalar

```
research/lib/screen-cleanup*.mjs          # temizlik tablosu genişlerse
public/product/*.webp                     # YENİ — betik çıktısı, elle konmaz
src/content/shots.ts                      # yeni anahtarlar ve alt metinler
src/components/sections/Roles.tsx         # eşleme + geçici çözümün geri alınması
src/content/product.ts                    # rol device değerleri
```

---

## Dikkat Noktaları

- **`../Alpfit.v1` dokunulmazdır** — salt okunur; ekranları kullanıcı ekler, bu oturum o depoya yazmaz.
- **Ürün görselleri elle konmaz.** `render-product.mjs` üretir; sızıntı kalırsa **üretim durur** (dört dallı denetim: ad, avatar baş harfi, eski marka, iddia).
- **Yeni ekran yeni sızıntı sınıfı getirebilir** — temizlik tablosuna satır girdiğinde yasaklı ad kümesi kendiliğinden büyür (TASK-2.14'ün deseni). `AUDIT_ALLOW` yalnız ikincil dalı kapatır.
- **Ad tablosu ile iddia tablosu ayrıdır** (`REPLACEMENTS` ↔ `CLAIM_REPLACEMENTS`) — iddia cümlesini ad tablosuna koyma; ölçüldü, yedi ekranı kırmızıya düşürüyor.
- **İddia sınırı:** yeni ekranlar ürünün bugün taşımadığı bir yeteneği göstermemeli; `CAPABILITIES.simdi` kapısı (`tests/capabilities.test.ts`) ve iddia sözlüğü (`research/lib/claim-leak.mjs`) bunu ölçer.
- **Gelmezse "bilinçli tercih" kaydı YAZILMAZ** — sonraki denetimlere yanlışlıkla "kapandı" sinyali verirdi.

---

## Test Kriterleri

- [ ] `render-product.mjs` sızıntı bulmadan tamamlandı; çıktı sayısı ve dosya adları task dokümanında
- [ ] Yeni ekranlarda eski marka, gerçek sporcu/semt adı ve karşılanmayan iddia yok (denetimin dört dalı da geçti)
- [ ] Antrenör sekmesi telefon çerçevesinde gerçek bir telefon ekranı gösteriyor (elle tıklanarak doğrulandı)
- [ ] Diyetisyen sekmesi kendi ekranını gösteriyor ve alt metni onu anlatıyor
- [ ] `docker compose exec web npm test` geçiyor (yetenek/iddia kapıları)
- [ ] `a11y.mjs` · `mobile-audit.mjs` · `font-guard.mjs` · `scan.mjs` temiz
- [ ] Sayfa ağırlığı ölçüldü (`perf.mjs`) — iki yeni görsel eklendi

---

## Risk ve Geri Dönüş Planı

- **Ekranlar gelmezse:** task ❌ İptal; TASK-3.15'in geçici çözümü yerinde kalır; B-046'nın iki ayağı kanvasta açık durur. Faz kapanışı etkilenmez.
- **Rollback:** üretilen görseller betik çıktısıdır; eşleme değişiklikleri dosya bazlı geri alınır.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı (ya da ön koşul sağlanmadığı için ❌ İptal edildi ve gerekçe yazıldı)
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-23
