# TASK-3.01: Genişlik turu — 16 sayfa, beş genişlik, bölüm bölüm

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa · F2.2 Alt sayfalar · F2.3 Ortak yerleşim
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** Yok

---

## Hedef

Siteyi 320 / 390 / 412 / 768 / 1440 px genişliklerde, 16 sayfanın hepsinde bölüm bölüm gezip ziyaretçinin gerçekten gördüğü düzen kusurlarını toplamak. Çıkan kalemler devralınan bulgularla **tek düzeltme listesinde** birleşir. Tur bittiğinde her kalem üç kutudan birine düşmüş olur: devralınan bir bulgunun parçası · bu fazın kapsamına giren **yeni** kalem · kapsam dışı (kanvasa).

---

## Bağlam

Kapsam kararı (PHASE-3 → Alınan Kararlar): *"Keşif fazın başında, gerçek telefon fazın sonunda."* Turu başa almak düzeltme listesini eksiksiz yapar — sonraki düzeltme task'ları bu listeye göre boyutlanır. Bu bir **keşif ayağıdır**: bulduğu şey kalan task'ların doğruluğunu değiştirirse plan revizyonu rotası işler (aşağıda → Dikkat Noktaları).

Tur kendi ölçüm betiğini kurar; bu fazın kapıları (TASK-3.03 ve sonrası) henüz yazılmamıştır ve tur onları beklemez.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Kapsam Tartışması (tur eksenleri) + Araştırma Bulguları özeti
- `_dev/phases/PHASE-3-ARASTIRMA.md` — ölçülmüş tuzakların tam listesi ve kırpma dedektörünün muafiyet kuralı
- `_dev/docs/STYLE-GUIDE.md` — düzen tuzakları; bir kalemin "kusur mu tercih mi" olduğunu belirler
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — betiği nasıl koşturacağın, bind-mount ve kör-seçici tuzakları

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` — kapsam dışı çıkan kalemler (Gelen Kutusu ya da yeni atom)

---

## Alt Görevler

- [ ] **1. Tur betiğini kur**
  - Betik scratchpad'e yazılır, araştırma konteynerine `-v` ile mount edilir (memory'deki desen)
  - Rota listesi ayakta olan siteden `/sitemap.xml` ile türetilir + `/olmayan-sayfa` elle eklenir → 16 rota
  - Genişlikler: 320 · 390 · 412 · 768 · 1440; sayfa `0,9 × viewport` adımlarla ekran ekran gezilir

- [ ] **2. Her adımda ölç ve kaydet**
  - Yatay kaydırma (sayfa ve kap düzeyinde), kırpılan metin düğümü, ata kutusundan taşan çocuk
  - Üst üste binen / okunmaz öğe, bozulan ızgara, ekran dışına düşen kontrol
  - Her koşumda **kaç düğüm bulunduğu** basılır — bulamayan seçici betiği yeşil bırakır (ölçülmüş tuzak)

- [ ] **3. Kalemleri sınıflandır**
  - Devralınan bulguya ait (B-032 · B-033 · B-022 · B-051 · B-057 · B-046) → o bulgunun altına not
  - Bu fazın kapsamına giren **yeni** kalem → düzeltme listesi
  - Kapsam dışı → `_dev/BULGULAR.md`

- [ ] **4. Düzeltme listesini yaz**
  - Kalemler bu task dokümanının Sonuç Özeti'nde, sayfa/bölüm/genişlik ve ölçülen rakamla

---

## Etkilenen Dosyalar

```
(kod değişikliği yok — ölçüm turu)
scratchpad/                      # YENİ (geçici, repoya girmez)
_dev/tasks/TASK-3.01.md          # bulgu listesi
_dev/BULGULAR.md                 # kapsam dışı kalemler
```

---

## Dikkat Noktaları

- **Tur ölçer, düzeltmez.** Bulduğun bir kusuru bu oturumda çözmeye girişme — düzeltmelerin kendi task'ları var.
- **Bulamayan seçici betiği yeşil bırakır.** Üç ölçülmüş tuzak: aynı metin iki yerde · açık `role` niteliği rolü ezer · `next/image` `src`'i URL-kodlar. Her turda eşleşme sayısını yazdır.
- **Kırpma ölçümü muafiyetsiz kurulursa 59 sahte pozitif verir** (ölçüldü): kayan tanıtım şeridi ve yatay kaydırılabilir kaplar bilerek kırpılır. Kırpan ata `overflow-x: auto|scroll` ise ya da ata zincirinde çalışan bir animasyon varsa kalem muaf sayılır ve **ayrı sayılır**.
- **Roller sekme şeridi kırpma dedektörüne görünmez** — şerit kaydırılabilir olduğu için muafiyete düşer. Ayrı ölçüt: kaydırılabilir şeritte **tek bir öğe** pencereden genişse kart hiçbir zaman tümüyle görünmez.
- **Plan revizyonu rotası:** Tur, kalan task'ların doğruluğunu değiştiren bir bulgu üretirse (yeni bir düzeltme sınıfı, ya da planlanmış bir düzeltmenin dayanağını çürüten ölçüm) task'ı yazma — bu ayak ✅ kapanır, arşive gider, DURUM Adım'ı `plan`'a çekilir ve `plan-phase` revizyon modu devralır. Gerekçe bu dokümanın Oturum Kaydı'na yazılır.
- **Hedef:** geliştirme sunucusu (3000) yeterlidir; bu tur yayın kopyasına bağlı değildir (o kural kapılar için geçerli).

---

## Test Kriterleri

- [ ] 16 rotanın hepsi beş genişlikte gezildi; çıktı gezilen rota ve adım sayısını yazıyor
- [ ] Her ölçüm turu bulduğu düğüm sayısını basıyor (sıfır bulan seçici sessiz geçmiyor)
- [ ] Kırpma ölçümü muafiyetli koşuldu; muaf sayılan kalemler ayrı sayıda raporlandı
- [ ] Bulunan her kalem üç kutudan birine düştü (devralınan / yeni-kapsam-içi / kapsam dışı) ve kapsam dışı olanlar `BULGULAR.md`'ye yazıldı
- [ ] B-033'ün ölçülmüş rakamları (320 px'te 19 kırpılmış düğüm, 390 px'te 0) bu turda yeniden üretildi ya da sapma gerekçesiyle kaydedildi

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
