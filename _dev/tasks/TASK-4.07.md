# TASK-4.07: Sayfa başına paylaşım kartı (2/2) — kalan sayfalar ve süpürme kapısı

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.06 ✅

---

## Hedef

Kalan 13 sayfa `pageMeta`'ya geçer: `/ozellikler`, `/segmentler`, dört segment sayfası (tek dinamik `generateMetadata`), `/yazilim-secerken`, `/gecis`, `/demo`, `/destek`, `/kvkk`, `/gizlilik`, `/kullanim-kosullari`. Bir Vitest kapısı `src/app/**/page.tsx` altında metadata beyan eden **her** sayfanın yardımcıdan geçtiğini ve yardımcı dışında `openGraph` / `alternates` yazılmadığını çiviler.

Tamam sayılır: betiğin kart dalı 15/15 yeşil ve kapı, yardımcıyı atlayan bir sayfada kırmızı döndüğü gözlenmiş.

**Neden 1-3 dosya kuralını aşan tek task:** her sayfadaki değişim aynı üç satırlık yer değiştirmedir; bölmek siteyi karma bir kart hâlinde bırakır ve süpürme kapısı bütün sayfaları aynı anda görmelidir (TASKS-README: yan yana yapılması gereken işler aynı task'te olabilir).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-4.06.md` — yardımcının imzası ve pilotun ölçümü
- `_dev/memory/tek-kaynak-atlayan-cagri-sitesi-supurmesi.md` — tek kaynak tanıtan task kapanışta atlayan çağrı sitelerini sayar
- `_dev/memory/urun-iddiasi-capa-dogrulamasi.md` → "Yazdığın KAPI da ölçülür" — yorum satırlarını sayan desen, tek örnekli sonda

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md` → Çözüm Kaydı — kalem 1 (`og:url` / `og:title` / `og:image:alt`) ölçümüyle; kalan kalemler açık kalır
- `_dev/BULGULAR.md` — B-042 index satırı

---

## Alt Görevler

- [ ] **1. Süpürme** — 13 sayfanın `metadata`'sı yardımcıdan; `title` ve `description` kaynağı değişmez (yasal sayfalar `PRIVACY` / `TERMS` / `KVKK` sabitlerinden, segment sayfası `seg.name` ve `seg.intro.slice(0, 180)`'den).
- [ ] **2. Kapı** — `tests/sayfa-meta.test.ts`'e dal: `src/app/**/page.tsx` yürünür; `metadata` ya da `generateMetadata` beyan eden her dosya `pageMeta` çağırır; yardımcı dışında `openGraph:` ya da `alternates:` yazan sayfa yok. Yorum satırları ayıklanır. Kapsam tabanı: bulunan sayfa sayısı ≥ 11 (bugün metadata beyan eden `page.tsx` sayısı — plan anında sayıldı; ana sayfanın kartı kök yerleşimden gelir), altına düşerse kırmızı.
- [ ] **3. Kapının kendisini ölç** — bir sayfada yardımcı geçici olarak kaldırılınca dal kırmızı; geri konunca yeşil (girdi düzeyinde, oturum içinde).
- [ ] **4. Çağrı sitesi sayımı** — `grep` ile `openGraph` / `alternates` geçen her yer: yalnız yardımcı ve kök yerleşim.
- [ ] **5. Ölçüm** — 3100 taze imaj → kart dalı 15/15.

---

## Etkilenen Dosyalar

```
src/app/
├── ozellikler/page.tsx · segmentler/page.tsx · segmentler/[slug]/page.tsx
├── yazilim-secerken/page.tsx · gecis/page.tsx · demo/page.tsx · destek/page.tsx
└── kvkk/page.tsx · gizlilik/page.tsx · kullanim-kosullari/page.tsx
tests/sayfa-meta.test.ts            # süpürme kapısı
```

---

## Dikkat Noktaları

- 404 sayfası (`not-found.tsx`) metadata beyan etmiyor ve kart dalından hariç — kapı `page.tsx` dosyalarını yürür, `not-found.tsx`'i değil.
- Segment `generateMetadata` bulunamayan slug'da bugün ne döndürüyorsa aynısını döndürür (davranış değişmez).
- TASK-4.09'un iki sonuç sayfası bu kapının varlığında doğar — onlar da yardımcıdan geçer (`robots` ile).
- `og:title` benzersizlik ölçütü: segment sayfalarının başlıkları farklı (`seg.name`).

---

## Test Kriterleri

- [ ] `npm test` yeşil; süpürme kapısı bulduğu sayfa sayısını yazıyor
- [ ] Kapı, yardımcıyı atlayan bir sayfada kırmızı (gözlendi) ve geri alındığında yeşil
- [ ] 3100 kart dalı: 15/15 sayfada `og:url` = canonical, `og:title` benzersiz, `og:image` yolu 200, `og:image:alt` var
- [ ] `grep` sayımı: `openGraph` yalnız yardımcıda (ve varsa kök yerleşimde)

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
