# TASK-3.18: Faydalar bölümünün 8 eşit kartı reddedilen kalıptan çıkar

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.04 ✅ · TASK-3.07 ✅

---

## Hedef

`Benefits` bölümü STYLE-GUIDE'ın reddettiği kalıbın **birebir tarifi**: `lg:grid-cols-4`, 8 eşit kart, her biri `IconBox` + başlık + iki satır gövde. Bölüm farklı bir ritimde yeniden kurulur. Yan kazanç: ana sayfanın uzunluğu düşer (kullanıcı "kısaltma yok, ritim düzelt" dedi — bu bölüm o kararın somut karşılığı).

---

## Bağlam

B-051. STYLE-GUIDE → Kullanıcının Refleksleri → **Kullanma:** *"Jenerik ikonlu kart ızgarası (3×N eşit kart, ikon + başlık + iki satır). Bölüm tasarlarken düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma."* Aynı bölümün **İstiyor** maddesi: *"Düzen çeşitliliği: her bölüm bir öncekinden farklı ritimde."*

Bilinçli tercih süzgeci uygulandı: karar günlüğünün **üç** dosyasının hepsinde arandı (aktif seri + iki arşiv aralığı) — `Benefits` hakkında kayıt yok. Bölüm kickoff öncesi yazıldı; STYLE-GUIDE'ın reddi 2026-09-11'de kayda geçti ve mevcut bölümlere geri uygulanmadı.

**Kısıt (kullanıcı kararı):** yeniden tasarım **metin taşımaz** — bütün metin `src/content/`'te kalır ve `docs/CLAIMS.md`'nin iddia sınırı aynen geçerlidir; **yeni cümle yazılmaz**, mevcut içerik yeniden düzenlenir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-051-ana-sayfada-ikon-kart-izgaralari.md` — kalıbın ölçümü ve süzgeç
- `_dev/docs/STYLE-GUIDE.md` — kullanıcının reddettikleri ve istedikleri; tokenlar
- `_dev/memory/kivanc-tasarim-tercihleri.md` — AI klişesi reddi
- `_dev/docs/CLAIMS.md` — iddia sınırı (yeni cümle yazılmayacak ama yeniden düzenleme de sınıra tabi)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/DECISIONS.md` — seçilen düzen (bu bölümün kalıbı bir daha sorgulanmasın diye)

---

## Alt Görevler

- [ ] **1. Düzen önerisi hazırla ve kullanıcıya getir**
  - En az iki aday: liste ritmi (numaralı ya da iki sütunlu akış) · sahne/ürün görseline bağlı anlatım · fotoğraf kırpmalı karma düzen
  - Her aday için: 8 kalemin nasıl yerleşeceği, mobil ve masaüstü ritmi, sayfa uzunluğuna etkisi

- [ ] **2. Seçilen düzeni uygula**
  - `IconBox` kullanımı tümüyle bırakılmak zorunda değil — **eşit kart ızgarası** kalıbı bırakılır
  - Bir önceki (`ProductStory`) ve bir sonraki bölümden farklı ritim

- [ ] **3. Metin tek kaynakta kalsın**
  - `src/content/product.ts`'teki 8 kalem yerinde kalır; sıra/gruplama değişebilir, cümle değişmez

---

## Etkilenen Dosyalar

```
src/components/sections/Benefits.tsx   # bölümün düzeni
src/content/product.ts                 # yalnız sıra/gruplama gerekirse (cümle değişmez)
```

---

## Dikkat Noktaları

- **Bu bir tasarım kararıdır ve kullanıcıya getirilir.** Seçimi yapmadan uygulamaya geçme.
- **Reddedilen kalıplara girme:** parıltı ikonlu kapsül rozet, Sparkles/Zap dekoratif ikon, sahte logo şeridi, "Trusted by…", mor-mavi gradyan kart, gereksiz glassmorphism, sayı sayma animasyonlu istatistik bandı (rakam da yok).
- **Yeni cümle yazılmaz.** Metin tonu (F1.2) kendi fazında; burada yalnız mevcut içerik yeniden düzenlenir.
- **Yeni düzen yeni kontrast ve kırpma riski getirir** — kapılar kurulu, koş: `a11y.mjs` (piksel kontrast + gradyan dalı) ve `mobile-audit.mjs` (320 px + kırpma + dokunma hedefi).
- **Yeni karakter girerse `font-guard.mjs` yakalar** — küme 153 karakter, genişletmek `research/FONT-KARAKTER-KUMESI.txt` + `font-subset.mjs` gerektirir.
- **`ui/Card` bugün hiç import edilmiyor** (B-047, teknik borç) — yeni düzen onu kullanacaksa bu bir kazanç, ama envanterin kendisi kapsam dışı.

---

## Test Kriterleri

- [ ] Kullanıcı düzeni onayladı — `kanal: UAT` (beğeni yargısı yerel koşucunun ölçtüğü katmanın dışında)
- [ ] Bölüm artık eşit kart ızgarası değil; bir önceki ve bir sonraki bölümden farklı ritimde (ekran görüntüsü)
- [ ] `src/content/` cümleleri değişmedi (`git diff` ile doğrulandı)
- [ ] `a11y.mjs` 16 rotada eşik altı 0, çıkış kodu 0
- [ ] `mobile-audit.mjs` 320 ve 390 px'te kırpma 0, kritik dokunma hedefi temiz
- [ ] `font-guard.mjs` kümede olmayan karakter bulmuyor
- [ ] `scan.mjs` konsol temiz
- [ ] Ana sayfanın mobil uzunluğu ölçüldü ve öncesiyle karşılaştırıldı (taban: 26.399 px)

---

## Karar Noktaları

- **Düzen seçimi:** liste ritmi vs. sahne/ürün görseli vs. fotoğraf kırpmalı karma → kullanıcıya sorulacak.

---

## Risk ve Geri Dönüş Planı

- **Risk:** yeniden tasarım birkaç beğeni turuna yayılabilir. Kapsam kararı bunu bilerek **iki bölümle** sınırladı; üçüncü ızgara (5'li ikon şeridi) kapsam dışı.
- **Rollback:** bölüm tek dosya; eski hâli git'te.

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
