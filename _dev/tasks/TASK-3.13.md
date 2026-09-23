# TASK-3.13: 404 ve çöküş sayfası — dev rakam dekoratif olur, başlık hiyerarşisi düzelir

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.06 ✅

---

## Hedef

Hata yüzeylerinin iki erişilebilirlik kalemini kapatmak:

1. **Dev rakam dekoratif ilan edilir** (`aria-hidden`), kontrastı yükseltilmez. `not-found.tsx`'teki "404" (`text-sage-wash-2`, 112 px) canvas üstünde **1,12-1,17:1**; `global-error.tsx`'teki "Hata" eşi **1,17:1**. Görünüş korunur, ekran okuyucu artık okumaz, kontrast kuralının dışına çıkar — sayfanın `h1`'i hatayı zaten söylüyor, yani bilgi kaybı yok.
2. **Başlık hiyerarşisi atlaması düzelir.** 404'te dizi `h1 h3 h3 h3`; kaynağı `Footer.tsx`'in kolon başlıkları — `h3` ve sahipsiz. Gövdesinde `h2` olan sayfalarda görünmüyor, 404'te ölçülebilir ihlale dönüşüyor.

---

## Bağlam

Kullanıcı kararı (PHASE-3 → Alınan Kararlar): *"404 ve çöküş sayfasındaki dev rakam dekoratif ilan edilir, kontrastı yükseltilmez."* Bu karar aynı zamanda `TOPLAM SORUN: 0` regresyon çizgisinin geçerliliğini belirliyordu — B-032'nin beşinci kalemi böyle kapanır.

**Sahipsiz alan notu:** 404 ve çöküş sayfası bugüne dek hiçbir feature'ın kabul kriterinde yoktu ve kapı da onları gezmiyordu; TASK-3.03'ün 16 rota kararıyla ikisi de kapı listesine girdi.

**Kapsam sınırı:** bu sayfaların markalanması ve istemci çöküşünün bir yere yazılması **kapsam dışıdır** (B-045 → teknik borç). Burada yalnız kontrast ve başlık kalemlerine dokunulur.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — kalem 5
- `_dev/bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md` — kalem (4), başlık hiyerarşisi
- `_dev/phases/PHASE-3.md` — Alınan Kararlar (404 kararı ve sahipsiz alan notu)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.2'ye 404/çöküş yüzeyinin kabul kriteri (bugün hiçbir feature'a ait değil)

---

## Alt Görevler

- [ ] **1. Dev rakamı dekoratif ilan et**
  - `src/app/not-found.tsx` → "404" paragrafına `aria-hidden`; `src/app/global-error.tsx` → "Hata" eşine aynısı (⚠️ `grep -n` ile konumlan)
  - Görünüş değişmez — renk, punto, yerleşim korunur

- [ ] **2. Başlık hiyerarşisini düzelt**
  - `src/components/layout/Footer.tsx` kolon başlıkları `h3` ve sahipsiz; iki yol var: başlıkları `h2`'ye çekmek ya da alt bilgiye bir üst başlık vermek (ekran okuyucuya görünür, gözle gizli)
  - Ölçüt: 16 rotanın hiçbirinde seviye atlaması kalmamalı — alt bilgi her sayfada olduğu için çözüm sayfa gövdesindeki `h2` varlığına bağlı olmamalı

- [ ] **3. Ekran okuyucu sırasını gözden geçir**
  - `aria-hidden` sonrası 404'ün ilk duyurulan öğesi `h1` olmalı

---

## Etkilenen Dosyalar

```
src/app/not-found.tsx               # dev rakam → aria-hidden
src/app/global-error.tsx            # "Hata" eşi → aria-hidden
src/components/layout/Footer.tsx    # kolon başlıklarının seviyesi / sahiplenmesi
```

---

## Dikkat Noktaları

- **Kontrastı yükseltme.** Karar açıkça görünüşü koruma yönünde — rengi koyulaştırmak bu kararı bozar.
- **`aria-hidden` kapının kuralını da değiştirir:** dekoratif ilan edilen metin kontrast ölçümünün dışına çıkar. TASK-3.04'ün ölçümü `aria-hidden` öğeleri dışarıda bırakmalı — bırakmıyorsa bu bir kapı hatasıdır, çözümü orada.
- **Alt bilgi her sayfada.** `Footer` değişikliği 16 rotanın hepsini etkiler; düzeltme sonrası tüm rotalarda başlık dizisi yeniden ölçülür.
- **Gözle gizli başlık eklenecekse** ekran okuyucuya görünür kalmalı (`sr-only` deyimi) — `display:none` ekran okuyucudan da düşürür ve atlamayı çözmez.
- **Gerçek ekran okuyucu denemesi bu fazın kapsamı dışında** (projede ölçüm kanalı yok); doğrulama erişilebilirlik ağacı üzerinden koda dayalı yapılır.

---

## Test Kriterleri

- [ ] `a11y.mjs`'te 404 ve çöküş sayfasının dev rakam kalemi **artık ölçüme girmiyor** (dekoratif) ve eşik altı kalemi bırakmıyor
- [ ] Başlık hiyerarşisi dalı 16 rotanın hiçbirinde atlama bulmuyor
- [ ] 404'ün erişilebilirlik ağacında ilk duyurulan öğe `h1` ("Bu sayfayı bulamadık")
- [ ] Görünüş değişmedi — 404 sayfasının ekran görüntüsü öncesi/sonrası aynı
- [ ] `a11y.mjs` 16 rotada **TOPLAM SORUN** satırı bu kalemler için 0; çıkış kodu bu sınıftan 1 dönmüyor

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
