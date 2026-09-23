# TASK-3.04: Kontrast ölçümü piksele taşınır — glif maskesi, ata opaklığı, ekran ekran gezme

**Durum:** ⬜ Bekliyor
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.03 ✅

---

## Hedef

`a11y.mjs`'in kontrast ölçümünü hesaplanmış stilden **piksele** taşımak: iki karenin (normal / metni görünmez) farkından glif maskesi çıkarılır, **metin rengi CSS'ten** alınır (ata opaklık çarpımı uygulanarak), **zemin maskenin altındaki gerçek pikselden** okunur. Bu tek değişiklik B-031'in (1), (2) ve (3) numaralı kör noktalarını birden kapatır: gradyan/fotoğraf zemini ölçülebilir olur, ata opaklığı renge girer, ve ölçülemeyen (`skipped`) sayısı bir eşiğe bağlanır.

---

## Bağlam

Bugünkü model üç şeyi yapısal olarak göremiyor: gradyan/fotoğraf zemini (tek renk yok), ata opaklığı (kompozisyon), gradyanla boyanmış metin (renk `transparent`). Ölçülmüş bedeli: 8 sayfada **85 eleman** hiç ölçülmüyor ve `<body>`'ye tek bir dekoratif gradyan konduğunda `/fiyat`'ta ölçülen eleman **157 → 0**'a düşerken kapı yine "TOPLAM SORUN: 0" diyor.

Araştırma bu yöntemi bu projede **sıfırdan prototipledi ve çalıştı**: B-032'nin kayıtlı rakamlarını birebir yeniden üretti (kapanış paragrafı `p02=3,97 / min=3,83`; desenli zemin `p02=4,06 / min=3,95 / med=4,63`). ⚠️ *"Çalışan uygulama scratchpad'de bırakıldı, devralınabilir"* iddiası **çürüdü** — adı geçen betiklerin hiçbiri makinede yok. Bu task "devralınan kodu uyarla" değil **"yaz"** olarak boyutlanmıştır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3-ARASTIRMA.md` — 1., 2., 3. ve 6. yaklaşımlar (yöntem, glif çekirdeği, ölçüm penceresi, hareket azaltma) ve tuzakların tam metni
- `_dev/bulgular/B-031-a11y-kontrast-yontemi-kor-noktalari.md` — üç kör noktanın ölçümü
- `_dev/bulgular/B-032-olculmus-aa-ihlalleri.md` — doğrulama tabanı: bu rakamlar yeniden üretilmeli
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — `sharp` ile ham piksel erişimi ve kör-seçici tuzağı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/DECISIONS.md` — kontrast ölçümünün piksel yöntemine geçmesi (ölçüm sözleşmesi değişiyor, geri dönüşü olan yorum değil)

---

## Alt Görevler

- [ ] **1. Ölçüm çekirdeğini yaz**
  - `research/lib/piksel-kontrast.mjs` (YENİ): iki kare al (normal / metin `color: transparent`), farktan glif maskesi çıkar, maskenin altındaki zemin piksellerini `sharp` ile oku
  - Metin rengi **CSS'ten** gelir; ata zincirindeki her `opacity` değeri çarpılarak renge uygulanır
  - Raporlanan değerler: `p02` (en kötü %2 piksel), `min`, `med` — desenli zeminlerde yargı yumuşatılabilsin

- [ ] **2. Ekran ekran gezme**
  - Sayfa `0,9 × viewport` adımlarla gezilir, her adımda iki kare alınır (tek ekran ölçümü B-032'nin kalemlerinin **hiçbirini** görmüyor: 1440 px'te ilk ekranda ihlal 0, sayfa tamamında 21)
  - Adım sayısı çıktıya girer (ana sayfa 1440 px'te 13 adım, `/ozellikler` 10 adım)

- [ ] **3. Hareket azaltma altında koş**
  - Bağlam `reducedMotion: 'reduce'` ile açılır — ata opaklık çarpımı uygulandığı anda `Reveal`'in geçiş ortası opaklıkları sahte ihlal üretiyor (ölçülen ara değerler: 0,459 · 0,618 · 0,666 · 0,711 · 0,818)

- [ ] **4. `skipped` bir eşik olsun**
  - Ölçülemeyen eleman sayısı raporlanır; sabit/yapışkan katmanlar **ayrı bir sayıda** tutulur (bugün ölçüm dışı — 3 sayfada 335 örnek) ve bu bir **borç** olarak çıktıda adıyla görünür
  - Ölçülemeyen kalan sınıf sıfır değilse kırmızıya döner

- [ ] **5. Eşikler**
  - Normal metin ≥ 4,5 · büyük metin (≥ 24 px, ya da ≥ 18,66 px bold) ≥ 3,0 (QUALITY 7)

---

## Etkilenen Dosyalar

```
research/
├── lib/piksel-kontrast.mjs   # YENİ — glif maskesi + zemin okuma
└── scripts/a11y.mjs          # kontrast dalı çekirdeği çağırır; eski hesaplanmış-stil yolu çıkar
```

---

## Dikkat Noktaları

- **Metin rengini boyanan pikselden alma.** Prototipin ilk turu bunu yaptı ve 100 ölçümün **95'ini** eşik altı gösterdi — okunan şey metin değil **antialias kenarıydı** (`med` 17'ye çıkarken `p02` 1,1'de kalıyordu). Morfolojik erozyonla glif çekirdeğini ayıklamak ince yazıda işe yaramıyor: 11-15 px gövde metninin inmesi çoğu yerde tek piksel. **fg CSS'ten, piksel yalnız zemini verir** — bu düzeltmeden sonra eşik altı 95 → 1'e düştü.
- **Sabit/yapışkan katmanlar her adımda yeniden görünür** ve koordinatları kayar. Prototipte bu sınıf ölçüm dışı bırakıldı — **ama bu bir çözüm değil, borçtur**: Header'ın gezinme bağlantıları böylece hiç ölçülmüyor. Kapı bu sınıfı **ayrı bir pasta**, kaydırma sıfırdayken ölçmeli.
- **Gradyanla boyanmış metin piksel yöntemiyle de ölçülemez** (rengi CSS'te yok) — o kendi dalıdır ve TASK-3.05'te gelir. Bu task onu `skipped`'a atmaz, **"gradyan metin" adlı ayrı sayıya** koyar ki sonraki task onu devralabilsin.
- **3100 bayat olabilir** — ölçüm yayın kopyasına karşı koşuyor; `docker compose --profile prod up -d web-prod` (yalnız `build` yetmez).
- **Doğrulama tabanı B-032'dir:** yöntem doğruysa kapanış paragrafı `p02≈3,97` ve desenli zemin `p02≈4,06` yeniden üretilir. Üretmiyorsa yöntem yanlıştır, site değil.
- **Bulamayan seçici betiği yeşil bırakır** — her koşumda ölçülen eleman sayısını bas.

---

## Test Kriterleri

- [ ] `a11y.mjs` 16 sayfada koşuyor; çıktı sayfa başına adım sayısını ve ölçülen eleman sayısını yazıyor
- [ ] B-032'nin iki referans rakamı yeniden üretildi: kapanış paragrafı `p02` ≈ 3,97 · desenli zemin `p02` ≈ 4,06 (sapma varsa gerekçesiyle kaydedildi)
- [ ] Ata opaklığı renge uygulanıyor: ürün turu soluk adım kartları artık **2,5-3,0** aralığında görünüyor (kapının eski değeri 8,03-10,63'tü)
- [ ] Hareket azaltma altında koşuluyor; geçiş ortası opaklıktan doğan sahte ihlal **0**
- [ ] `<body>`'ye deneysel bir dekoratif gradyan konduğunda ölçülen eleman sayısı **düşmüyor** (eski modelde 157 → 0 oluyordu)
- [ ] Ölçülemeyen sınıflar ayrı ayrı raporlanıyor (yapışkan katman borcu · gradyan metin · kalan) ve kalan sınıf sıfır değilse çıkış kodu 1

---

## Risk ve Geri Dönüş Planı

- **Piksel ölçümü yavaştır** (16 rota × ekran adımı × iki kare). Süre ölçülür ve task dokümanına yazılır; kabul edilemez uzunsa kare alma çözünürlüğü düşürülür, **yöntem değil**.
- **Rollback:** `a11y.mjs` tek dosya + yeni lib; dosya bazlı geri alınır.

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
