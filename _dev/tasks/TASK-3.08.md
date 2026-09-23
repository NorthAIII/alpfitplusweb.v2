# TASK-3.08: Dokunma hedefi kuralı kapıya girer — kritik küme kırmızı, gezinme yüzeyi raporlanır

**Durum:** ⬜ Bekliyor
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği · M2 F2.3 kabul kriteri
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`mobile-audit.mjs`'in dokunma hedefi ölçümünü **iki kulvara** ayırmak: dönüşüme dokunan hedefler (buton · form alanı · sekme · `header`/`nav` içindeki menü · `/demo`, `wa.me` ve `tel:` hedefli bağlantılar) 44 px'in altındaysa **kırmızıya düşürür**; alt bilgi ve gövde metni içi bağlantılar ölçülür, raporlanır, düşürmez. M2 F2.3 *"Dokunma hedefleri ≥ 44 px (`mobile-audit.mjs`)"* diyordu ama kapının geçme şartı yalnız yatay kaydırmaydı — bu boşluk burada kapanır.

---

## Bağlam

Kullanıcı kararı (PHASE-3 → Alınan Kararlar): *"Dokunma hedefi kuralı kademeli kurulur."* Gerekçe: 157 küçük hedefin çoğu gövde metni içi bağlantı ve hepsini 44 px'e çıkarmak satır aralıklarını açarak tipografiyi bozar; ILKELER'in 1. ekseni (dönüşüm) hangi hedefin kritik olduğunu zaten söylüyor.

Araştırma sınıflandırdı: alt bilgi ve içerik yolu dışarıda tutulduğunda **19 benzersiz kritik hedef** kalıyor (16 sayfada 61 örnek); gövde metni içi bağlantı **324**. Kritik kümenin tamamı somut: şube seçici butonları (63-66×36), "WhatsApp'tan sorun" (172×20), telefon bağlantısı (147×20), form alanı (250×24) ve **onay kutusu (18×18)**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (mekanik ölçüt)
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 6. satır (19 benzersiz kritik hedefin dökümü)
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3 kabul kriteri
- `_dev/ILKELER.md` — En Yüksek Öncelikli Eksenler (dönüşüm birinci)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3 kriterinin kademeli hâli (kritik küme kırmızı, gezinme raporlanır)

---

## Alt Görevler

- [ ] **1. Kritik kümeyi mekanik olarak tanımla**
  - `button`, `input`, `select`, `textarea`, `[role="tab"]`, `header`/`nav` içindeki bağlantılar
  - `a[href="/demo"]`, `a[href^="https://wa.me"]`, `a[href^="tel:"]` — nerede olurlarsa olsunlar
  - Onay kutusu dâhil (18×18 ölçüldü); etiketin tıklanabilir alanı hedefe sayılır mı — ölçütü çıktıda yaz

- [ ] **2. Raporlanan kümeyi ayır**
  - `footer` içindeki bağlantılar ve gövde metni (paragraf/liste) içi bağlantılar → ölçülür, listelenir, **kırmızıya düşürmez**

- [ ] **3. Eşik ve çıktı**
  - Eşik 44×44 CSS px; kritik kümede eşik altı > 0 → çıkış kodu 1
  - Çıktı iki satır: `kritik hedef: N ölçüldü · M eşik altı` ve `gezinme/içerik yolu: N ölçüldü · M eşik altı (raporlanır)`
  - Benzersiz hedef sayısı da basılır (araştırmada kritik 19 benzersiz / 61 örnek)

---

## Etkilenen Dosyalar

```
research/scripts/mobile-audit.mjs   # dokunma hedefi dalının iki kulvara ayrılması
```

---

## Dikkat Noktaları

- **Ölçüt kullanıcı kararıdır, betik ayarı değil.** Alt bilgi **ve içerik yolu** bağlantıları bilinçle dışarıda: ikisi de gezinme yüzeyi, dönüşüm yüzeyi değil. Kümeyi genişletmek/daraltmak yeni bir karardır.
- **Bu task'tan sonra kapı kırmızı dönecek** (19 kritik hedef). Düzeltmesi TASK-3.17'de.
- **Benzersizleştirme gerekir:** aynı bileşen 16 sayfada tekrarlanıyor (61 örnek / 19 benzersiz). Rapor benzersiz kümeyi göstermeli, yoksa düzeltme listesi 61 satır gibi okunur.
- **Bulamayan seçici betiği yeşil bırakır** — ölçülen hedef sayısı sıfıra düşerse kırmızı koşulu (kapsam eşiği, TASK-3.03).
- **Görünmeyen hedefler sayılmaz:** `display:none` / `visibility:hidden` / sıfır kutulu öğeler dışarıda; bugünkü betiğin `rc.width === 0` süzgeci korunur.

---

## Test Kriterleri

- [ ] Çıktı iki kulvarı ayrı ayrı basıyor; kritik kümede **19 benzersiz** hedef sayılıyor (sapma varsa gerekçesiyle)
- [ ] Gövde metni içi bağlantılar (≈ 324) raporlanıyor ama çıkış kodunu etkilemiyor
- [ ] Kritik kümede eşik altı varken çıkış kodu **1**; kritik küme temizken gövde metni kalemleri kalsa bile **0**
- [ ] Onay kutusu (18×18) kritik kümede görünüyor
- [ ] Deneysel olarak bir kritik hedef 44 px'e çıkarıldığında o kalem listeden düşüyor

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
