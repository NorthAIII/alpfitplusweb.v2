# TASK-1.08: Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit`

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · dokunulan yüzey M3
**Feature:** F7.4: Analitik olay sayımı
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.07 ✅, TASK-1.06 ✅ (önizlemedeki `demo-submit` kriteri başarılı gönderim ister — canlı alıcı olmadan uç 503 döner ve olay gönderilmez; 2026-09-13 plan revizyonu)

---

## Hedef

Olay göndermenin tek yüzeyini kurmak (`src/lib/analytics.ts`): olay adları ve yüzey etiketleri sabitlenir, `track()` sarmalayıcısı Umami yoksa sessiz geçer. İlk tüketici demo formudur — başarı anında `demo-submit` olayı gönderilir. Task, panelde `demo-submit` olayı `surface=demo-form` özelliğiyle göründüğünde tamamlanmış sayılır.

---

## Bağlam

Araştırma kararı: olay adları `demo-submit` / `whatsapp-click` / `phone-click`, tek özellik `surface`. Etiket kümesi **tek dosyada** sabitlenir ki panelde dağınık ad çıkmasın — bir kez dağıldıktan sonra geçmiş veriyi toparlamak mümkün değil.

Sarmalayıcı ayrı bir dosya olarak burada doğar çünkü iki tüketicisi var: bu task'taki form gönderimi ve TASK-1.09'daki global tıklama dinleyicisi. Dinleyiciden önce yazılması sırayı doğru kurar.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Yüzey etiketleri (`data-surface`) için hazır çapalar" ve "Umami yoksa sessiz geç"
- `src/components/sections/DemoForm.tsx` → `state === "ok"` geçişi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [ ] **1. Olay sözlüğünü yaz**
  - Olay adları sabit: `demo-submit`, `whatsapp-click`, `phone-click` (Umami olay adı sınırı 50 karakter — üçü de rahat)
  - Yüzey etiketleri sabit listesi: `hero`, `final-cta`, `footer`, `header`, `assistant`, `demo-form`, `demo`, `destek`, `404`, artı mevcut bölüm id'leri — `<Section id=…>` verenler (`segmentler`, `sss`, `neden`, `roller`, `fiyat`, `moduller`, `fayda`) **ve ham `<section id=…>` verenler** (`sorun` → `Chaos.tsx`, `nasil-calisir` → `HowItWorks.tsx`, `cozum` → `Solution.tsx`); dinleyicinin `section[id]` yedeği ikisini de yakalar, bugün bu üçünde bağlantı yok ama ileride eklenirse etiket sözlükte hazır olur
  - Tip düzeyinde daraltma (yüzey adı serbest string olmasın) — panelde dağınık ad çıkmasını kod engellesin
  - Dosya: `src/lib/analytics.ts` (YENİ)

- [ ] **2. `track()` sarmalayıcısını yaz**
  - `window.umami?.track(ad, { surface })` — Umami yoksa **hata fırlatmaz, sessiz geçer**
  - Sunucu tarafında çağrılırsa (window yok) sessiz döner
  - **Kişisel veri parametre olarak alınmaz** — imza yalnız olay adı + yüzey kabul eder, serbest veri alanı yok
  - Dosya: `src/lib/analytics.ts` (YENİ)

- [ ] **3. Demo gönderimini bağla**
  - `DemoForm` başarı durumuna geçtiğinde (`setState("ok")` yolu) `track("demo-submit", "demo-form")`
  - Hata ve 503 yollarında olay **gönderilmez** (dönüşüm sayılmaz)
  - Dosya: `src/components/sections/DemoForm.tsx`

---

## Etkilenen Dosyalar

```
src/lib/
└── analytics.ts          # YENİ — olay adları, yüzey sözlüğü, track() sarmalayıcısı
src/components/sections/
└── DemoForm.tsx          # başarı anında demo-submit — zaten var
```

---

## Dikkat Noktaları

- **Kişisel veri olaya girmez** (telefon, e-posta, kulüp adı, mesaj) — QUALITY 2 ve KVKK asgarilik. Sarmalayıcının imzası bunu yapısal olarak imkânsız kılmalı.
- Olay yalnız **gerçek başarıda** gönderilir; bal küpü dolu istek de 200 döner ama form zaten `json.ok`'a bakıyor — bot gönderimi başarı sayılırsa sayım şişer. Mevcut `res.ok && json.ok` koşulu korunur, olay o dalın içine konur.
- Umami tanımsızken sayfa **hatasız** çalışmalı — dönüşüm akışı analitiğe bağımlı olmamalı.
- Yüzey listesi bu dosyada büyür; TASK-1.09 yeni ad **icat etmez**, buradan seçer.
- **Betik adresinin evi bu task'ta karara bağlanır** (TASK-1.07 Dikkat Noktaları devretti): `https://umami.kiwiailab.com/script.js` `layout.tsx`'te sabit olarak mı kalır, `analytics.ts`'e mi taşınır. Taşınırsa `src/app/layout.tsx` de değişir; karar ve gerekçe Oturum Kaydı'na.

---

## Test Kriterleri

- [ ] Yerelde Umami env'i tanımsızken demo formu gönderimi hatasız tamamlanır, konsol temiz (`scan.mjs /demo`)
- [ ] Yerelde Umami tanımlıyken başarılı gönderimde ağ sekmesinde Umami olay isteği görünür
- [ ] Başarısız gönderimde (hedefler kapalı, 503) olay **gönderilmez**
- [ ] Önizlemede gönderilen talep panelde `demo-submit` / `surface=demo-form` olarak görünür — kanal: UAT
- [ ] TypeScript: yüzey sözlüğünde olmayan bir etiket derleme hatası verir
- [ ] `docker compose exec web npm run build` hatasız geçer

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-11
