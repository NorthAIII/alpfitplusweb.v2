# TASK-3.17: Dönüşüme dokunan 19 hedef 44 px'e çıkar

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.08 ✅ · TASK-3.16 ✅

---

## Hedef

TASK-3.08'in kurduğu kapının kritik kümesini yeşile çevirmek: **19 benzersiz dokunma hedefi** (16 sayfada 61 örnek) 44×44 CSS px'e çıkar. Gövde metni içi bağlantılar (≈ 324) ve alt bilgi linkleri **değişmez** — ölçülür, raporlanır, kırmızıya düşürmez.

---

## Bağlam

Kullanıcı kararı (PHASE-3): dokunma hedefi kuralı kademeli kurulur; 157 küçük hedefin çoğu gövde metni içi bağlantı ve hepsini 44 px'e çıkarmak satır aralıklarını açarak tipografiyi bozar.

Araştırmanın somutlaştırdığı kritik küme:

| Hedef | Ölçülen |
|---|---|
| Şube seçici butonları | 63-66 × **36** |
| "WhatsApp'tan sorun" | 172 × **20** |
| Telefon bağlantısı | 147 × **20** |
| Form alanı | 250 × **24** |
| **Onay kutusu** | **18 × 18** |

M2 F2.3 zaten *"Dokunma hedefleri ≥ 44 px"* diyordu; ölçülmemişti.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (mekanik ölçüt)
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 6. satır (kritik hedeflerin ölçülen kutuları)
- `_dev/docs/STYLE-GUIDE.md` — form hatası deyimi (TASK-2.06); onay kutusuna dokunurken o deyim korunur
- `_dev/modules/M3-Lead-Hatti.md` — form davranışı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — dokunma hedefi deyimi (44 px'in nasıl sağlandığı: dolgu mu, `::before` genişletme mi)

---

## Alt Görevler

- [ ] **1. Listeyi kapıdan al**
  - `mobile-audit.mjs` kritik kümesini benzersiz olarak basıyor (TASK-3.08); düzeltme listesi **o çıktıdır**, bu dokümandaki tablo yalnız tanıma içindir

- [ ] **2. Hedefleri büyüt**
  - Tercih sırası: görünür kutuyu büyütmek (dolgu) → görünmez tıklama alanı genişletmek (`::before` / mutlak kaplama) → yerleşimi değiştirmek
  - Görsel ağırlık değişmemeli: gövde metni içindeki "WhatsApp'tan sorun" ve telefon bağlantısı dolguyla büyürse satır aralığı bozulur — bu ikisi için genişletilmiş tıklama alanı uygundur

- [ ] **3. Onay kutusu**
  - 18×18 → ≥ 44 px tıklama alanı; TASK-2.06'nın form hatası deyimi (`neg` halka + `neg-wash` zemin + alan altında hata metni) **korunur**
  - Etiketin tıklanabilirliği hedefe sayılıyorsa ölçütü kapının çıktısıyla uyumlu olsun

- [ ] **4. Form alanları ve şube seçici**
  - Form alanı 250×24 → yükseklik ≥ 44; şube seçici butonları 36 → 44

---

## Etkilenen Dosyalar

```
src/components/ui/Button.tsx                     # buton boyut ölçekleri (gerekirse)
src/components/sections/DemoForm.tsx             # form alanları, onay kutusu
src/components/sections/PriceCalculator.tsx      # şube seçici butonları
src/components/sections/<gövde metni bağlantıları>  # kapı çıktısından belirlenir
```

---

## Dikkat Noktaları

- **Gövde metni içi bağlantılara dokunma.** Kullanıcı kararı açık: ölçülür, raporlanır, düşürmez. Onları 44 px'e çıkarmak tipografiyi bozar.
- **"WhatsApp'tan sorun" ve telefon bağlantısı kritik kümededir** (`wa.me` / `tel:` hedefli) — gövde metninin *içinde* dursalar bile. Çözüm dolgu değil, genişletilmiş tıklama alanı.
- **Form hatası deyimi korunur** — onay kutusunun görünümü değişirken `aria-invalid` varyantı ve odak halkası sırası bozulmamalı (STYLE-GUIDE'da ölçülmüş: kırmızının üstünde kalan odak halkası).
- **44 px CSS px'tir**, cihaz pikseli değil — `deviceScaleFactor: 2` ölçümü yanıltmaz ama betiğin hangi birimi bastığı kontrol edilir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.
- **TASK-3.16'nın "Demo" bağlantısı da bu kümededir** — bu yüzden bağımlılık.

---

## Test Kriterleri

- [ ] `mobile-audit.mjs` kritik kümesinde eşik altı **0**; çıkış kodu bu sınıftan 1 dönmüyor
- [ ] Gövde metni içi bağlantılar hâlâ raporlanıyor (küme boşalmadı — seçici körleşmesi yok)
- [ ] Onay kutusu ≥ 44 px tıklama alanına sahip ve form hatası deyimi bozulmadı (geçersiz alan denemesiyle gözlendi)
- [ ] Şube seçici ve form alanları 390 · 320 px'te ≥ 44 px
- [ ] Düzen hiçbir genişlikte bozulmadı; satır aralıkları değişmedi (ekran görüntüsü karşılaştırması)
- [ ] Gerçek telefonda dokunma denemesi — `kanal: UAT`
- [ ] Beş ölçüm regresyon çizgisini koruyor

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
