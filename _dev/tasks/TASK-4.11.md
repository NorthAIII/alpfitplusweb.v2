# TASK-4.11: B-065 (3/3) — form JavaScript olmadan da gönderilir; hidrasyonsuz gönderim ölçülür

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (modules/M3-Lead-Hatti.md)
**Feature:** F3.1 Demo formu ve talep ucu
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.10 ✅

---

## Hedef

`DemoForm` `<form method="post" action="/api/demo">` taşır; JavaScript'li yol (`onSubmit` → `preventDefault` + `fetch`) **birebir aynı** kalır. Hidrasyonsuz her hâlde — JavaScript kapalı, JS parçaları gecikmiş, hidrasyon hiç olmamış — basılan düğme talebi uca POST'lar, adres çubuğunda kişisel veri doğmaz ve ziyaretçi sonuç sayfasını görür.

Tamam sayılır: üç tarayıcı hâli rakamıyla ölçülmüş; B-065'in çözüm kaydı yazılmış; `/demo` üzerinde a11y ve mobil kapıları taban değerlerinde.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-065-js-kapali-demo-formu-kisisel-veriyi-urlde-tasiyor.md` — ölçüm düzeneği ve sızıntının üç sonucu
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler (B-065 — hidrasyon penceresi rakamları)
- `src/components/sections/DemoForm.tsx` — `<form>` (plan anında `:239-243`), `onSubmit` (`:130`), alan adları
- `src/app/layout.tsx` — Umami yorumu (B-056): native **GET** yolunu anlatıyor
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — enjekte ölçüm zamanlamayı ölçmez; bulamayan locator yeşil bırakır
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — arayüz ölçen tarayıcı turu ucu `page.route` ile taklit eder

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/bulgular/B-065-…` → Çözüm Kaydı (rakamlarla) + `Durum`; `_dev/BULGULAR.md` index
- `_dev/modules/M3-Lead-Hatti.md` → F3.1 kabul kriteri: "JavaScript olmadan gönderilen talep kayda gider; adres çubuğunda kişisel veri doğmaz"

---

## Alt Görevler

- [ ] **1. Form** — `method="post"` + `action="/api/demo"`; `noValidate` kalır (JS yolu kendi doğrular; JS'siz yolda doğrulama sunucudadır ve sonuç sayfası nedeni söyler).
- [ ] **2. Alan kümesi** — native gönderimde giden alanlar uçla birebir (`name`, `club`, `phone`, `email`, `branches`, `segment`, `message`, `consent`, `website`); ölçülür (bugün 9 alan).
- [ ] **3. Tarayıcı ölçümü** (araştırma konteyneri, betik scratchpad'de, hedef 3100 — hedefsiz uç `no-sink` verir, **depoya hiç yazılmaz**):
  - (a) `javaScriptEnabled: false` → istek POST ve `/api/demo`'ya; son adres `/demo/gonderilemedi?neden=no-sink`; sayfa mesajı görünür.
  - (b) JS parçaları `page.route` ile bekletilirken basılan düğme → (a) ile aynı sonuç.
  - (c) JS açık, hidrasyon tamam → tek istek `fetch`, **sayfa gezinmesi yok**, sonuç kutusu (bugünkü davranış).
  - Her hâlde adres çubuğunda `name=` / `phone=` / `email=` / `website=` **0**. Başarı yolunun tarayıcı ucu `page.route` ile 303 → `/demo/gonderildi` taklidiyle (kota ve depo yazımı yok).
- [ ] **4. Yorum hizası** — `layout.tsx`'teki Umami yorumu artık var olmayan GET yolunu anlatıyor; gerçekle hizalanır (`data-exclude-search` kalır, gerekçesi sorgu dizesinin genel koruması olarak).
- [ ] **5. Kapılar** — 3100: `a11y.mjs`, `mobile-audit.mjs`; `npm test`.
- [ ] **6. Kayıtlar** — B-065 çözüm kaydı (üç hâlin rakamları), BULGULAR index, M3 F3.1 kriteri. Kalıcı kapı önerisi (JavaScript kapalı `/demo` taraması) B-015 ile "Kalite kapıları otomatik" fazının işi — atomda not.

---

## Etkilenen Dosyalar

```
src/components/sections/DemoForm.tsx   # method + action
src/app/layout.tsx                     # Umami yorumu (davranış değişmez)
```

---

## Dikkat Noktaları

- JS yolunda davranış değişmemeli: `preventDefault` işleyicinin ilk satırında — hidrasyon sonrası native gönderim olmaz; (c) ağda tek istek görerek kanıtlar.
- Çift gönderim riski: native gönderim başlamışsa JS işleyicisi bağlanmamıştır; (b) ölçümü bu sınırı kapsar.
- Ölçüm betiği scratchpad'de kalır (repoya girmez); "locator bir şey buldu mu" sayısı her koşumda yazdırılır.
- Gerçek bir JS'siz talebin **gerçek depoya** düştüğünün kanıtı bu task'ın yerel koşucusunun dışındadır — kanal aşağıda.
- `layout.tsx`'e dokunan diğer task'lar (4.05, 4.06, 4.08) farklı alanlara dokunur.

---

## Test Kriterleri

- [ ] (a) (b) (c) üç hâl ölçüldü; her birinde istek yöntemi/adresi, son adres ve sonuç yüzeyi rakamıyla kayıtta
- [ ] Üç hâlde de adres çubuğunda kişisel veri alanı **0**
- [ ] (c) hâlinde gönderim sayısı **1** (`fetch`), sayfa gezinmesi **0**
- [ ] 3100: `a11y.mjs` TOPLAM SORUN **1** · çıkış 1 (B-063 kalemi hariç 0), `mobile-audit.mjs` `✓ KAPI YEŞİL — 16 sayfada 0`; `npm test` yeşil
- [ ] JavaScript'siz gönderilen gerçek bir talebin depoya düştüğü — **kanal: UAT** (dal önizlemesinde ya da geçiş sonrasında; gerçek hedef yerel koşucunun dışında)

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

**Oluşturulma:** 2026-09-26
