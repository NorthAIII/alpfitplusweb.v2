# TASK-3.02: Dört yeni eksen turu — büyütme, hareket azaltma, JavaScript kapalı, yatay tutuş

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.01 ✅

---

## Hedef

Siteyi bugüne dek hiçbir kapının ve hiçbir turun kapsamadığı dört eksende gezmek: **%200 ve %400 büyütme**, **hareket azaltma tercihi açıkken**, **JavaScript kapalıyken**, **telefon yan çevrilmişken**. Çıkanlar TASK-3.01'in düzeltme listesine eklenir ve aynı üç kutuya sınıflandırılır.

---

## Bağlam

Kapsam kararı (PHASE-3 → Alınan Kararlar): *"Turun eksenleri genişletildi — dördü de girdi."* Gerekçe: dördü de bugüne dek ölçülmemişti; büyütme ayağı 320 px işiyle **aynı WCAG kuralından** (1.4.10 reflow) geliyor, hareket azaltmanın ölçütü M2 F2.3'ün kabul kriterinde yazılı ama hiç ölçülmemiş.

Bu eksenler **kapıya girmez** (kapsam kararı fazın kapı işini a11y/mobil ayağıyla sınırladı) — tek istisna hareket azaltmadır ve o da kapıya bir eksen olarak değil, kontrast ölçümünün **ön koşulu** olarak girer (TASK-3.04).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Kapsam Tartışması (tur eksenleri)
- `_dev/phases/PHASE-3-ARASTIRMA.md` — 6. yaklaşım (hareket azaltma) ve ölçülen ara opaklık değerleri
- `_dev/tasks/archive/TASK-3.01.md` — genişlik turunun düzeltme listesi ve betik deseni
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — koşum deseni ve tuzaklar

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` — kapsam dışı çıkan kalemler

---

## Alt Görevler

- [ ] **1. Büyütme ayağı**
  - 1280×1024 tabanında %200 (640×512) ve %400 (320×256); 16 rota
  - Ölçülen: kırpılan metin düğümü, iki yönlü kaydırma, ekran dışına düşen kontrol
  - B-033'ün ölçümü karşılaştırma tabanıdır: %400'de 8 kırpılan düğüm, en ağır 66 px; %100/%200/%250'de 0

- [ ] **2. Hareket azaltma ayağı**
  - `prefers-reduced-motion: reduce` altında 16 rota, 390 ve 1440 px
  - Ölçülen: `Reveal` sarmalayıcısında kalan **ara opaklık** var mı (araştırmada ölçülen ara değerler: 0,459 · 0,618 · 0,666 · 0,711 · 0,818), `animate-marquee` / `animate-float` / `animate-pulse-ring` duruyor mu
  - Bu ayak M2 F2.3'ün *"Reveal animasyonu `prefers-reduced-motion` ile devre dışı kalır"* kriterinin **ilk ölçümüdür** — sonuç rakamıyla kaydedilir

- [ ] **3. JavaScript kapalı ayağı**
  - `javaScriptEnabled: false`, 16 rota, 390 ve 1440 px
  - Ölçülen: içerik geliyor mu, huniye çıkan yol duruyor mu, asistanın "hayalet düğme" hâli, sekmeli bölümlerin (Roller, SSS) davranışı, formun hâli

- [ ] **4. Yatay tutuş ayağı**
  - 844×390 ve 915×412 (yatay), `isMobile: true`
  - Ölçülen: yapışkan katmanların ekranı yeme oranı, ilk ekranda kalan içerik, kırpma

- [ ] **5. Kalemleri sınıflandır ve düzeltme listesine ekle**

---

## Etkilenen Dosyalar

```
(kod değişikliği yok — ölçüm turu)
scratchpad/                      # YENİ (geçici, repoya girmez)
_dev/tasks/TASK-3.02.md          # bulgu listesi
_dev/BULGULAR.md                 # kapsam dışı kalemler
```

---

## Dikkat Noktaları

- **Asistanın JS kapalı hâli kapsam dışıdır** (B-017 / B-048): gözlenir ve kaydedilir, düzeltilmez.
- **Hareket azaltma ayağının sonucu TASK-3.04'ün dayanağıdır.** Ara opaklık kalıyorsa kontrast ölçümünün ön koşulu bozulur ve bu bir plan revizyonu tetiğidir.
- **Büyütme, viewport daraltmakla aynı şey değildir.** Playwright'ta `deviceScaleFactor` büyütmeyi taklit etmez; taban viewport'u bölerek kur (1280×1024 → %400 = 320×256) ve kök font boyutunun değişmediğini doğrula.
- **Plan revizyonu rotası** TASK-3.01'deki gibidir: kalan task'ların doğruluğunu değiştiren bulgu → ayak ✅ kapanır, DURUM Adım'ı `plan`'a çekilir.
- **Her ölçüm turu bulduğu düğüm sayısını basar.**

---

## Test Kriterleri

- [ ] Dört eksenin hepsi 16 rotada koşuldu; çıktı eksen başına gezilen rota sayısını yazıyor
- [ ] Hareket azaltma altında kalan ara opaklık sayısı rakamıyla raporlandı (beklenen: 0)
- [ ] %400 büyütmede kırpılan düğüm sayısı ölçüldü ve B-033'ün rakamıyla (8 düğüm / 66 px) karşılaştırıldı
- [ ] JavaScript kapalıyken her sayfada huniye çıkan en az bir yol olup olmadığı sayıldı
- [ ] Kapsam dışı kalemler `BULGULAR.md`'ye yazıldı

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
