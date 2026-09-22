# TASK-2.04: Fiyat sayfasının mobil ana çağrısı 52 px'e döner (B-034)

**Durum:** ⬜ Bekliyor

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

- [ ] **1. İki satırı düzelt**
  - `src/components/sections/PriceCalculator.tsx:164` ve `:167` → `flex-1` yerine `sm:flex-1`
  - Kap satırına (`:163`) dokunulmaz — `flex-col … sm:flex-row` doğru

- [ ] **2. Dört mobil genişlikte ölç**
  - 320 / 360 / 390 / 412 px: iki butonun da ölçülen yüksekliği ≥ 52 px
  - 640 ve 1440 px kontrol grubu: yükseklik ve genişlik davranışı **değişmemiş** olmalı (satır modunda `flex-1` hâlâ eşit genişlik veriyor)
  - Betik scratchpad'e yazılır, `research/`'e kalıcı dosya bırakılmaz (`memory/arastirma-konteynerinde-tarayici-olcumu.md`)

- [ ] **3. Altı rotanın tamamında teyit**
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

- [ ] 320 / 360 / 390 / 412 px'te `/fiyat` sayfasındaki iki CTA'nın ölçülen yüksekliği **≥ 52 px** (rakamlar dokümana yazılır) — kanal: UAT (gerçek tarayıcı yerleşimi; yerel koşucu bu katmanı ölçmüyor)
- [ ] 640 ve 1440 px'te yükseklik 52 px ve genişlik davranışı değişmemiş (kontrol grubu) — kanal: UAT
- [ ] Altı rotanın 12 örneğinin 12'si 390 px'te ≥ 52 px — kanal: UAT
- [ ] `mobile-audit.mjs` → yatay kaydırma: yok (regresyon yok)
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `scan.mjs` `/fiyat` ve bir segment sayfasında konsol temiz
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız

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
