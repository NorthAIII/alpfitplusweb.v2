# TASK-3.27: Hareket azaltma açıkken çapa kaydırması animasyonsuz olur

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M2 — Sayfalar ve Bölümler (`modules/M2-Sayfalar-ve-Bolumler.md`)
**Feature:** F2.3 — Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 3 (`phases/PHASE-3.md`)
**Bağımlılıklar:** Yok

---

## Hedef

`prefers-reduced-motion: reduce` açık bir kullanıcıda çapa bağlantılarının ve programatik kaydırmaların **animasyonsuz** olmasını sağlamak. Bugün `globals.css`'in `reduce` bloğu yalnız `animation-*` ve `transition-duration`'ı sıfırlıyor; `html { scroll-behavior: smooth }` yerinde kalıyor ve yumuşak kaydırma tercihi dinlemiyor. Task, sonda `reduce` altında `scroll-behavior: auto` okuduğunda ve `no-preference` altında `smooth` okumaya devam ettiğinde tamamlanmış sayılır.

---

## Bağlam

Hareket azaltma bu fazın **ekseniydi**, keşif kalemi değil: kontrast ölçümünün ön koşulu olarak kapıya girdi (`PHASE-3-KAPSAM.md` → *"Kontrast ölçümü hareket azaltma altında koşar"*; diğer üç yeni eksen — %200/%400 büyütme, JS kapalı, yatay tutuş — bilinçle keşif turunda kaldı). `M2-Sayfalar-ve-Bolumler.md` → F2.3'ün kabul kriteri de `prefers-reduced-motion`'ı adıyla istiyor, `QUALITY.md` → 7 aynı soruyu soruyor.

Araştırma bu kriteri *"doğrulandı"* diye kaydetti — ama yalnız **ara opaklık** ayağı için: hareket azaltma açıkken `Reveal`'in geçiş ortası opaklıkları kalmıyor. Kaydırma ayağı TASK-3.04'te ayrıca ölçüldü ve **açık** çıktı: kontrast kapısı bunu bir ölçüm arızası olarak yaşadı ve kendi tarafında `scroll-behavior: auto` enjekte ederek çözdü — **sitenin kendi tarafı açık kaldı.** Kalem o gün Gelen Kutusu'na düştü, adlandıran task yazılmadı; verify-phase UAT'ı (senaryo 24) onu ❌ ile açığa çıkardı.

Ölçüldü (2026-09-26, yayın kopyası 3100, `/` @390): `reducedMotion=reduce` → `.reveal` **0** · ara opaklık **0** · koşan animasyon **0** · `html scroll-behavior` **smooth**; `reducedMotion=no-preference` → 39 reveal · **39 ara opaklık** · 5 animasyon · `scroll-behavior` **smooth**. Yani sonda iki hâli ayırt ediyor ve fark yalnız kaydırmada yok.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` → F2.3 — `prefers-reduced-motion` kriterinin tam metni
- `_dev/QUALITY.md` → 7. Erişilebilirlik — eksenin kendi sorusu
- `_dev/phases/PHASE-3-UAT.md` → senaryo 23 ve 24 — ölçülen iki ayak ve aralarındaki fark

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durumu güncelle **ve** UAT özetindeki kalan-kalem satırını güncelle
- `_dev/phases/PHASE-3-UAT.md` — senaryo 24'ün sonucu (yeniden koşumda)
- `_dev/BULGULAR.md` — `[TASK-3.04]` `scroll-behavior` Gelen Kutusu satırının mezuniyeti (evi artık bu task)
- `_dev/docs/STYLE-GUIDE.md` — yalnız yeni bir kural doğarsa (dokunulmaz sınıf: refleks listesine ve token değerlerine dokunulmaz)

---

## Alt Görevler

- [ ] **1. `reduce` bloğuna kaydırma sıfırlamasını ekle**
  - `src/app/globals.css` → `@media (prefers-reduced-motion: reduce)` bloğu (bugün `animation-duration` · `animation-iteration-count` · `transition-duration`)
  - Eklenecek: `scroll-behavior: auto !important` — **hem `html` hem `*`** için mi, yalnız `html` için mi ölçerek seç: `scroll-behavior` kalıtılan bir özellik **değildir** ve kaydırma kabı `html` dışında bir eleman da olabilir (sayfada kaydırılabilir kaplar var — mobil kapı 5 tane ölçüyor)
  - `:203`'teki `html { scroll-behavior: smooth }` **kaldırılmaz** — `no-preference` hâlinde bugünkü davranış korunur

- [ ] **2. Çapa bağlantılarını ve programatik kaydırmaları tara**
  - Sayfada `scrollIntoView` / `scrollTo` çağrısı var mı? Varsa `behavior: 'smooth'` **JS'te** verilmişse CSS sıfırlaması onu kapatmaz — o çağrı da tercihi okumalı (`window.matchMedia('(prefers-reduced-motion: reduce)')`)
  - `grep -n "scrollIntoView\|scrollTo\|behavior:" src/` — **kaç eşleşme bulduğunu yazdır** (bulamayan grep yeşil bırakır)
  - Çapa bağlantıları: `href="#..."` taşıyan bağlantıların sayısını da ölç, düzeltmenin kapsadığı yüzeyi rakamla yaz

- [ ] **3. İki tercih altında ölç**
  - `reduce` → `scroll-behavior: auto` **ve** ara opaklık 0 / koşan animasyon 0 (senaryo 23 gerilemedi)
  - `no-preference` → `scroll-behavior: smooth` **ve** 39 reveal / 39 ara opaklık / 5 animasyon (davranış korundu)
  - Gerçek bir çapaya tıklayıp kaydırmanın **tek karede** tamamlandığını ölç (`reduce`) — hedef konuma varış süresi

---

## Etkilenen Dosyalar

```
src/app/
└── globals.css     # reduce bloğuna scroll-behavior sıfırlaması — zaten var
src/components/     # yalnız 2. alt görev JS'te smooth kaydırma bulursa — zaten var
```

---

## Dikkat Noktaları

- **`scroll-behavior` kalıtılmaz.** `html`'e verilen değer çocuk kaydırma kaplarına geçmez; `*` seçicisiyle vermek her kabı kapsar ama `!important` ile birlikte geniş bir çekiçtir — hangisinin gerektiğini **ölçerek** seç.
- **Yargı 3100'e ait**; ama bu kalem CSS medya sorgusu olduğu için geliştirme sunucusunda da doğru okunur — yine de kapanış ölçümü yayın kopyasında koşar (3100 bayat olabilir: `build` imajı tazeler, **konteyneri yeniden yaratmaz**).
- **Bu kalem hiçbir kapının kapsamında değil** — `a11y.mjs` kontrastı hareket azaltma **altında** ölçüyor (yani tercihi kendisi açıyor) ama `scroll-behavior`'ın kendisini sınamıyor. Kalıcı kapı bu task'ın kapsamında **değil**; onun evi "Kalite kapıları otomatik" fazıdır. Task'ın kanıtı kendi sondasıdır.
- **Sondayı kör bırakma:** `reduce` ve `no-preference` **iki hâli birlikte** ölç — yalnız `reduce`'a bakan bir sonda, CSS'i hiç yüklemeyen bir sayfada da "auto" okuyup yeşil kalır.

---

## Test Kriterleri

- [ ] Sonda (`reducedMotion=reduce`, yayın kopyası) → `getComputedStyle(document.documentElement).scrollBehavior` **`auto`**
- [ ] Aynı sonda `reducedMotion=no-preference` → **`smooth`** (davranış korundu). `kontrol:` iki hâl arasındaki fark ölçüldü — sonda ayırt edebiliyor
- [ ] Senaryo 23 gerilemedi: `reduce` altında `.reveal` 0 · ara opaklık 0 · koşan animasyon 0; `no-preference` altında 39 / 39 / 5
- [ ] `reduce` altında gerçek bir çapa bağlantısına tıklandığında kaydırma **tek karede** tamamlanıyor (ölçülen varış süresi)
- [ ] `grep` ile JS tarafında smooth kaydırma çağrısı arandı ve **eşleşme sayısı yazıldı**; varsa o çağrılar da tercihi okuyor
- [ ] `docker compose --profile research run --rm research node scripts/a11y.mjs` → gerilemedi (**TASK-3.26 sonrası: TOPLAM SORUN 0 · çıkış 0**; bu task ondan önce koşarsa 6 · çıkış 1 beklenir, kalem sayısı **artmamalı**)
- [ ] `mobile-audit.mjs` yeşil kaldı (TOPLAM SORUN 0 · çıkış 0, altı kapsam tabanı oynamadı) — `scroll-behavior` kaydırılabilir kapları etkiliyor
- [ ] `docker compose exec web npm test` → **219 geçti + 2 atlandı** · `npx tsc --noEmit` → 0
- [ ] Görünüş değişmedi: `/` @390 ve @1440'ta şerit karesi ile **0 farklı piksel** (kaydırma davranışı statik karede görünmez, yani fark beklenmiyor — beklentiyi ölçerek doğrula)

---

## Risk ve Geri Dönüş Planı

- **Risk:** `*` seçicisiyle verilen `scroll-behavior: auto !important` bir bileşenin kasıtlı yumuşak kaydırmasını da kapatır → 2. alt görevin taraması bunu önceden gösterir; kapsanan yüzeyi rakamla yaz
- **Rollback:** tek dosya, tek hunk — `git revert <hash>`

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- Task çalıştırıldığında doldurulacak -->

---

**Oluşturulma:** 2026-09-26 (verify-phase Adım 7 — UAT senaryo 24'ün ❌'inden doğdu)
