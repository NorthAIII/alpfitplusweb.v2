# TASK-3.19: Modüller bölümünün tırtıklı 5'li ızgarası yeniden kurulur

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.1 Ana sayfa
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.18 ✅

---

## Hedef

`Modules` bölümünün öne çıkan modülleri `lg:grid-cols-3` ızgarada **5 kart** olarak diziliyor — masaüstünde 3 + 2, ikinci satır tırtıklı bitiyor. Izgara içeriğe göre yeniden kurulur: öne çıkanların sayısı ızgaraya göre değil **içeriğe göre** seçilir (5 kart → ya 2+3 kurgusu ya farklı düzen).

**Kapsam dışı:** aynı bölümün 5'li ikon şeridi (`lg:grid-cols-5`) — kullanıcı kararıyla olduğu gibi kalır ve kanvasta açık durur.

---

## Bağlam

B-051'in ikinci ızgarası. `Benefits`'ten farkı yalnız madde listesi; kalıp aynı. Kullanıcı ikisini de kapsama aldı, üçüncüsünü (ikon şeridi) bilinçle dışarıda bıraktı — *"üçünü birden yeniden kurmak ana sayfanın orta bölümünü baştan tasarlamak demekti ve fazı birkaç beğeni turuna bağlardı."*

**Kısıt:** metin taşımaz, yeni cümle yazılmaz (TASK-3.18 ile aynı kural).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-051-ana-sayfada-ikon-kart-izgaralari.md` — ızgaraların ölçümü
- `_dev/docs/STYLE-GUIDE.md` — reddedilen ve istenen kalıplar
- `_dev/tasks/archive/TASK-3.18.md` — seçilen ritim; iki bölüm birbirini tekrar etmemeli
- `_dev/docs/CLAIMS.md` — modül anlatımının iddia sınırı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/DECISIONS.md` — seçilen düzen

---

## Alt Görevler

- [ ] **1. Öne çıkan sayısını içeriğe göre seç**
  - Bugün 5 (`featured: true`); ızgaraya göre değil, anlatıya göre belirlenir
  - Çapa: `src/content/product.ts` → `featured` alanları · `src/components/sections/Modules.tsx` (⚠️ `grep -n` ile konumlan)

- [ ] **2. Düzeni kur**
  - TASK-3.18'in seçtiği ritimden **farklı** olmalı — ardışık iki bölüm aynı kalıbı kullanmaz
  - Tırtıklı satır bırakmayan bir yerleşim

- [ ] **3. İkon şeridine dokunma**
  - `lg:grid-cols-5` şerit kapsam dışıdır; yerinde kalır

---

## Etkilenen Dosyalar

```
src/components/sections/Modules.tsx   # öne çıkanların düzeni (ikon şeridi hariç)
src/content/product.ts                # featured seçimi (cümle değişmez)
```

---

## Dikkat Noktaları

- **İkon şeridi kapsam dışı** — kullanıcı kararı; kanvasta açık kalır, "kapandı" işaretlenmez.
- **Tasarım kararı kullanıcıya getirilir** (TASK-3.18 ile aynı disiplin).
- **Yeni cümle yazılmaz**; `featured` seçimi değişse bile metinler `src/content/`'te olduğu gibi kalır.
- **İddia sınırı:** modül anlatımı `CAPABILITIES` kademelerine bağlı — "bugün var / yolda" ayrımı `src/content/product.ts`'ten türer ve `tests/capabilities.test.ts` bunu doğrular. Öne çıkan seçimi bu ayrımı bozmamalı.
- **Kapılar koşulur** — yeni düzen kontrast, kırpma ve dokunma hedefi riski getirir.

---

## Test Kriterleri

- [ ] Kullanıcı düzeni onayladı — `kanal: UAT`
- [ ] Masaüstünde tırtıklı biten satır kalmadı (ekran görüntüsü, 1440 px)
- [ ] Bölüm TASK-3.18'in ritmini tekrar etmiyor
- [ ] `npm test` geçiyor — özellikle yetenek/iddia kapıları (`docker compose exec web npm test`)
- [ ] `a11y.mjs` eşik altı 0 · `mobile-audit.mjs` 320/390 px temiz · `font-guard.mjs` eksik karakter yok · `scan.mjs` konsol temiz
- [ ] `src/content/` cümleleri değişmedi (`git diff`)

---

## Karar Noktaları

- **Öne çıkan modül sayısı ve düzen:** kullanıcıya sorulacak.

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
