# TASK-3.06: Başlık hiyerarşisi kontrolü kapıya girer

**Durum:** ⬜ Bekliyor
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`a11y.mjs` bugün yalnız `h1` **sayısına** bakıyor. Başlık **sırasını** da kontrol eden bir dal eklenir: bir seviye atlandığında (örn. `h1 → h3`) kapı kırmızıya döner ve atlamanın geçtiği rotayı, iki başlığın metnini ve seviyelerini basar.

---

## Bağlam

B-031 kalem (4): 404 sayfasında başlık dizisi `h1 h3 h3 h3` — yani `h1 → h3` atlaması var. Kaynağı `Footer.tsx`'in kolon başlıkları: `h3` ve sahipsiz (üstlerinde `h2` yok). Gövdesinde `h2` bulunan sayfalarda görünmüyor, 404'te ölçülebilir ihlale dönüşüyor. 404 bugüne dek hiçbir kapının listesinde olmadığı için hiç sınanmamış — TASK-3.03 onu listeye aldı.

Düzeltme bu task'ın işi değil (TASK-3.13); burada yalnız **ölçen** kurulur.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md` — kalem (4)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.2 kabul kriterleri

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet

---

## Alt Görevler

- [ ] **1. Başlık dizisini topla**
  - Belge sırasına göre `h1`-`h6`; gizli (`display:none` / `visibility:hidden` / `aria-hidden`) başlıklar dışarıda
  - Her rota için dizi çıktıya girer (örn. `h1 h2 h2 h3 h2`)

- [ ] **2. Atlamayı ölç**
  - Ardışık iki başlıkta seviye farkı **artı yönde 1'den büyükse** ihlal; geriye dönüş (h3 → h2) ihlal değildir
  - Sayfada `h1` yoksa ya da birden fazlaysa mevcut kontrol korunur

- [ ] **3. Raporla ve eşikle**
  - `başlık hiyerarşisi: N sayfada M atlama`; M > 0 → çıkış kodu 1
  - Teşhis satırı: rota · atlayan çift · iki başlığın metni (ilk 40 karakter)

---

## Etkilenen Dosyalar

```
research/scripts/a11y.mjs   # başlık hiyerarşisi dalı
```

---

## Dikkat Noktaları

- **Bu dal bugün kırmızı dönecek** — 404'teki `h1 → h3` gerçektir ve düzeltmesi TASK-3.13'tedir. Kırmızı, dalın çalıştığının kanıtıdır.
- **Gizli başlıkları dışarıda bırak.** Ekran okuyucu için kasıtlı gizlenmiş başlık (varsa) diziye girerse sahte atlama üretir; ölçüt `aria-hidden` + görünürlüktür.
- **Sekmeli/açılır bölümlerde başlık ilk boyada gizli olabilir** (Roller, SSS). Kapı açılan katmanları ölçmüyor (B-015, kapsam dışı) — bu dalın gördüğü de ilk boyanın dizisidir; sınır çıktıda yazılı olsun.
- **Dayanağı bozup kırmızıyı gör:** deneysel olarak bir sayfaya `h1 → h4` sokup dalın yakaladığını doğrula.

---

## Test Kriterleri

- [ ] Kapı 16 rotanın başlık dizisini basıyor
- [ ] 404 sayfasındaki `h1 → h3` atlaması yakalanıyor ve teşhis satırı iki başlığı gösteriyor
- [ ] Deneysel `h1 → h4` sokulduğunda dal kırmızıya dönüyor; geri alındığında yeşile
- [ ] Geriye dönüş (h3 → h2) ihlal sayılmıyor
- [ ] Atlama varken çıkış kodu **1**

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
