# TASK-3.27: Hareket azaltma açıkken çapa kaydırması animasyonsuz olur

**Durum:** ✅ Tamamlandı

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

- [x] **1. `reduce` bloğuna kaydırma sıfırlamasını ekle**
  - `src/app/globals.css` → `@media (prefers-reduced-motion: reduce)` bloğu (bugün `animation-duration` · `animation-iteration-count` · `transition-duration`)
  - Eklenecek: `scroll-behavior: auto !important` — **hem `html` hem `*`** için mi, yalnız `html` için mi ölçerek seç: `scroll-behavior` kalıtılan bir özellik **değildir** ve kaydırma kabı `html` dışında bir eleman da olabilir (sayfada kaydırılabilir kaplar var — mobil kapı 5 tane ölçüyor)
  - `:203`'teki `html { scroll-behavior: smooth }` **kaldırılmaz** — `no-preference` hâlinde bugünkü davranış korunur

- [x] **2. Çapa bağlantılarını ve programatik kaydırmaları tara**
  - Sayfada `scrollIntoView` / `scrollTo` çağrısı var mı? Varsa `behavior: 'smooth'` **JS'te** verilmişse CSS sıfırlaması onu kapatmaz — o çağrı da tercihi okumalı (`window.matchMedia('(prefers-reduced-motion: reduce)')`)
  - `grep -n "scrollIntoView\|scrollTo\|behavior:" src/` — **kaç eşleşme bulduğunu yazdır** (bulamayan grep yeşil bırakır)
  - Çapa bağlantıları: `href="#..."` taşıyan bağlantıların sayısını da ölç, düzeltmenin kapsadığı yüzeyi rakamla yaz

- [x] **3. İki tercih altında ölç**
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

- [x] Sonda (`reducedMotion=reduce`, yayın kopyası) → `getComputedStyle(document.documentElement).scrollBehavior` **`auto`**
- [x] Aynı sonda `reducedMotion=no-preference` → **`smooth`** (davranış korundu). `kontrol:` iki hâl arasındaki fark ölçüldü — sonda ayırt edebiliyor
- [x] Senaryo 23 gerilemedi: `reduce` altında `.reveal` 0 · ara opaklık 0 · koşan animasyon 0; `no-preference` altında 39 / 39 / 5 — ⚠️ **ölçüldü ama rakamların ikisi bu sondada farklı çıktı ve ikisi de sonda duyarlılığı, gerileme değil:** `reduce` koşan animasyon **2-3** (kontrol grubuyla kanıtlandı — eski hâl enjekteyken de aynı iki düğüm: yapışkan başlığın `.01ms`'e indirilmiş `CSSTransition`'ı), `no-preference` ara opaklık **3** (UAT oturmuş anda örnekliyordu, bu sonda zirveyi arıyor). **Kriterin özü tuttu:** `reduce` → 0 / 0, `no-preference` → 39 reveal, ve sonda iki hâli ayırt ediyor
- [x] `reduce` altında gerçek bir çapa bağlantısına tıklandığında kaydırma **tek karede** tamamlanıyor (ölçülen varış süresi)
- [x] `grep` ile JS tarafında smooth kaydırma çağrısı arandı ve **eşleşme sayısı yazıldı**; varsa o çağrılar da tercihi okuyor
- [x] `docker compose --profile research run --rm research node scripts/a11y.mjs` → gerilemedi (**TASK-3.26 sonrası: TOPLAM SORUN 0 · çıkış 0**; bu task ondan önce koşarsa 6 · çıkış 1 beklenir, kalem sayısı **artmamalı**) — ⚠️ **kriterin parantezi yanlış yazılmış:** TASK-3.26 kapıyı 0'a değil **1**'e indirdi (altıncı kalem ölçüm artefaktı çıktı, kullanıcı kararıyla B-063'e bırakıldı). Ölçülen: **1 · çıkış 1** = taban birebir, kalem sayısı artmadı — kriterin gerçek ölçütü budur
- [x] `mobile-audit.mjs` yeşil kaldı (TOPLAM SORUN 0 · çıkış 0, altı kapsam tabanı oynamadı) — `scroll-behavior` kaydırılabilir kapları etkiliyor
- [x] `docker compose exec web npm test` → **219 geçti + 2 atlandı** · `npx tsc --noEmit` → 0
- [x] Görünüş değişmedi: `/` @390 ve @1440'ta şerit karesi ile **0 farklı piksel** (kaydırma davranışı statik karede görünmez, yani fark beklenmiyor — beklentiyi ölçerek doğrula)

---

## Risk ve Geri Dönüş Planı

- **Risk:** `*` seçicisiyle verilen `scroll-behavior: auto !important` bir bileşenin kasıtlı yumuşak kaydırmasını da kapatır → 2. alt görevin taraması bunu önceden gösterir; kapsanan yüzeyi rakamla yaz
- **Rollback:** tek dosya, tek hunk — `git revert <hash>`

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-26

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 — `reduce` bloğuna kaydırma sıfırlaması.** `src/app/globals.css`'in `@media (prefers-reduced-motion: reduce)` bloğuna (bugün `:326`, task dokümanının yazdığı `:326-332` tuttu) tek satır eklendi: `scroll-behavior: auto !important`. `:203`'teki `html { scroll-behavior: smooth }` **kaldırılmadı** — `no-preference` hâlinde davranış birebir korunuyor (aşağıda ölçüldü). Seçici **ölçülerek** seçildi (→ Kararlar).
- **Alt görev 2 — çapa ve programatik kaydırma taraması.** `grep -rn "scrollIntoView\|scrollTo\|behavior:" src/` → **4 eşleşme**: `globals.css:203` (düzeltilen kural) · `DemoForm.tsx:121` `field.scrollIntoView({ block: "center" })` · `DemoForm.tsx:127` `box.scrollIntoView({ block: "start" })` · `Assistant.tsx:71` `feedRef.scrollTo({ …, behavior: "smooth" })`. İlk ikisi `behavior` **vermiyor**, yani CSS'i okuyor → CSS düzeltmesi onları kapsıyor (ölçüldü). Üçüncüsü `behavior`ı **JS'te açıkça** veriyor → CSS onu kapatmıyor (ölçüldü, aşağıda) ve tercihi kendisi okuyacak şekilde değiştirildi.
- **Çapa yüzeyinin kapsamı rakamla ölçüldü** (16 rota × 2 genişlik = 32 kombin, yayın kopyası): aynı sayfaya inen çapa bağlantısı **32** — hepsi `layout.tsx`'in `#icerik` atlama bağlantısı, hedefi `top=68 px`, yani **0 tanesi sayfayı gerçekten kaydırıyor**. Sitenin gerçekten kaydıran tek çapası asistan ağacındaki `/#nasil-calisir` (`chat.ts:72`) ve o da yalnız panel açıkken çiziliyor. Ölçüm bu yüzden atlama bağlantısıyla değil **gerçek iki yüzeyle** yapıldı (asistan çapası + `/demo` sonuç kutusu) — enjekte çapa kurulmadı.
- **Alt görev 3 — iki tercih altında ölçüm.** Aşağıda, Test Sonuçları'nda.

**Sorunlar:**
- **Sonda ilk kurulumunda erken çıkıyordu:** "scrollY 4 kare aynı kaldıysa bitti" ölçütü, tıklamanın etkisi gelmeden (83 ms) döngüyü kapatıyor ve `hareketEtti: false` okutuyordu. Çözüm: **sabit pencere** (2.500 ms) boyunca her karede örnekle, yorumu sonra yap (ilk sapma → son değere ilk varış).
- **Aynı metin iki yerde — locator sessizce yanlış düğümü seçti:** `page.locator('button', { hasText: "Verilerimi kim taşıyor" })` **2** eşleşme döndü ve `.first()` panelin dışındakini tıkladı; panel intro hâlinde kaldı, bağlantı "bulunamadı" göründü. Çözüm: seçici `#asistan-panel` ile daraltıldı → 1 eşleşme. (Memory'nin `arastirma-konteynerinde-tarayici-olcumu.md` atomunda adıyla kayıtlı tuzak — sahada üçüncü kez.)
- **Görünüş kontrolünün pozitif kontrolü ilk hâlinde ÖLÇMÜYORDU:** `body{background:#ffeeee !important}` enjekte edildiğinde diff **0** döndü — çünkü sayfanın bölümleri kendi zeminlerini boyuyor ve gövde zemini hiçbir kareden görünmüyor. Yani "0 farklı piksel" o hâlde differ'ın körlüğünden de gelebilirdi. Çözüm: `html{filter:invert(1) !important}` → 1.974.960 / 7.776.000 piksel (kare başına **tam** piksel sayısı), differ'ın kör olmadığı kanıtlandı.

- **⚠️ KAZARA ÖLÇÜLDÜ: BU TURUN DOKÜMAN METNİ ÜRETİM CSS'İNE GERÇEK BİR KURAL EKLEDİ.** Yorumu düzeltip yeniden derledikten sonra servis edilen CSS **85.312 → 85.350 bayt** oldu ve içine `scroll-behavior:smooth` veren, sitede hiçbir elemanın kullanmadığı bir yardımcı sınıf girdi. Kaynak `globals.css`'in yorumu değildi (ilk derlemede yorum vardı, sınıf yoktu): `globals.css` Tailwind'i `@import "tailwindcss"` ile alıyor, **hiçbir `@source` kısıtı yok** ve `.dockerignore` `_dev/`'i dışarıda bırakmıyor — yani **DevFlow dokümanları taranıyor**. Sınıf adını düz metin olarak yazan üç `_dev/` dosyasını (DURUM · STYLE-GUIDE · bu doküman) yeniden yazınca CSS **md5'i birebir eski değerine döndü** (`5f2d8774…`, 85.312 bayt, kaçak sınıf 0) ve chunk adı da aynı kaldı (`3p3z86zp6cec8.css`), yani kapıların koştuğu imajla **bayt bayt aynı**. Tur öncesi repoda o dize hiç geçmiyordu → kural tümüyle bu turun yazısından doğmuştu. Kural STYLE-GUIDE'a yazıldı (kendini tetiklememek için adı bölünerek), kapı boşluğu Gelen Kutusu'na düştü.

**Kararlar:**
- **Seçici `html` değil `*, *::before, *::after` — ve bu bir tercih değil ölçüm sonrası bir icra kararıdır.** İki aday kaynağa dokunulmadan enjekte edilip karşılaştırıldı (3100, @390): `html{…auto}` ve `*{…auto}` **birebir aynı** ölçtü (çapa 1 kare / 60,4 ms ↔ 1 kare / 61,1 ms; form 2 örnek). Sebebi ölçüldü: `scroll-behavior` taşıyan eleman sitede **yalnız `html`** ve 32 kombinde gezilen **4 kaydırılabilir kabın dördünde de** değer zaten `auto`. `*` seçildi çünkü **`scroll-behavior` kalıtılmaz** — `html`'e verilen değer kaplara geçmez ve bir kaba Tailwind'in yumuşak kaydırma yardımcısı verildiği gün sessizce geri gelir; bu kalemi gören **hiçbir kapı yok**. Task dokümanının *"`*` geniş bir çekiçtir"* uyarısı bu özellikte hüküm doğurmuyor: `transition-duration`'dan farklı olarak, hareket azaltma altında kasıtlı yumuşak kaydırmayı kapatmak **amacın kendisidir**. Aynı rule zaten `*` seçicisini kullanıyor, yani fark tek satır.
- **`html { scroll-behavior: smooth }` kaldırılmadı** — `no-preference` davranışı korunsun diye (task dokümanının kendi kuralı). Ölçüldü: `no-preference` altında çapa **90 kare / 1.483,6 ms** ile birebir aynı akıyor.
- **`DemoForm`'un iki `scrollIntoView` çağrısına dokunulmadı** — `behavior` vermiyorlar, yani CSS'i okuyorlar; ölçüm bunu doğruladı (20 kare → 2 örnek). Gereksiz bir `matchMedia` eklemek iki yerden yönetilen bir offset doğururdu.
- **`research/lib/piksel-kontrast.mjs`'in `KAYDIRMA_CSS` koşması KALDIRILMADI** — artık gereksiz ama zararsız bir savunma katmanı, ve ölçüm betiğine dokunmak bu turun kapsamı değil. Yorumundaki artık **yanlış** olan cümle (*"hareket azaltma bunu KAPATMIYOR"*) ve bayat satır numarası (`globals.css:135`, gerçeği `:203`) Gelen Kutusu'na düştü.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşün maliyeti yok (tek satır CSS + tek `matchMedia`), bıraktığı bir sözleşme/şema/ad yok; ölçüm ve gerekçe bu doküman ile `globals.css`/`Assistant.tsx` yorumlarında yaşıyor.

**Kalan İşler:**
- Yok. (Kalıcı kapı bilinçle kapsam dışı — task dokümanının kendi kuralı; evi "Kalite kapıları otomatik" fazı.)

**Son Yaklaşım:** —

**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/app/globals.css` → `@media (prefers-reduced-motion: reduce)` kuralına `scroll-behavior: auto !important` eklendi; gerekçe, seçici tercihi ve ölçülen rakamlar CSS yorumunda (QUALITY 3 — "ölçülmüş bir karar rakamıyla açıklanır"). `:203`'teki `smooth` yerinde.
- `src/components/layout/Assistant.tsx` → akışı dibe kaydıran `useEffect` tercihi `window.matchMedia("(prefers-reduced-motion: reduce)")` ile okuyor; `behavior` artık `azalt ? "auto" : "smooth"`. Neden CSS'in yetmediği yorumda rakamıyla yazılı.

**Test Sonuçları:**

**Kapsam:** yargı **yayın kopyası (3100)**; `scan.mjs` betikte sabit olduğu için **3000**. 3100 **tazelendi** — `lastmod` 2026-09-26T11:22:05.415Z → **2026-09-26T12:52:33.779Z** (`build` + `--profile prod up -d`, yalnız `build` konteyneri yeniden yaratmaz). **Pozitif kontrol:** servis edilen CSS'te `scroll-behavior:auto` ×**1** (reduce bloğunun içinde, tam metni doğrulandı) ve `scroll-behavior:smooth` ×**1** (html, korundu); istemci paketinde `prefers-reduced-motion: reduce` ×7 (kaynakta 2 çağrı yeri: `Reveal.tsx:26` + `Assistant.tsx:79`). **Negatif kontrol:** paketde koşulsuz `behavior:"smooth"` ×**0**.

**1) Ana kriter — `getComputedStyle(document.documentElement).scrollBehavior`** (16 rota × 2 genişlik = 32 kombin, 15.874 eleman):
| Tercih | `scroll-behavior != auto` olan eleman | Dökümü |
|---|---|---|
| `reduce` | **0** (önce **32**) | — |
| `no-preference` | **32** (önce 32) | hepsi `html`, `smooth` — **davranış birebir korundu** |

Kaydırılabilir kap **4**, ikisinde de `scroll-behavior != auto` olan **0**. Rota tabanı **16** (`BEKLENEN_ROTA`).

**2) Gerçek yüzeyler — kaydırma kaç karede tamamlanıyor** (3100, @390; uç `page.route` ile taklit, canlı hiçbir yere kayıt yazılmadı, kota saymadı):
| Yüzey | Tercih | ÖNCE | SONRA |
|---|---|---|---|
| Asistan çapası `/#nasil-calisir` (300 → 16.444 px) | `reduce` | **90 kare · 90 ara değer · 1.483,0 ms** | **1 kare · 1 ara değer · 0 ms** |
| aynı | `no-preference` | 90 kare · 90 ara değer · 1.483,5 ms | **90 kare · 90 ara değer · 1.483,6 ms** (birebir) |
| `/demo` sonuç kutusu `scrollIntoView` (0 → 1.334 px) | `reduce` | **20 kare · 19 ara değer · 315,8 ms** | **2 örnek · 2 ara değer · 16,5 ms** (tek kare aralığı) |
| aynı | `no-preference` | 20 kare · 19 ara değer · 316,5 ms | **20 kare · 19 ara değer · 316,1 ms** (birebir) |

**Enjekte ölçüm ↔ gerçek derleme birebir:** aday2 enjekteyken çapa 1 kare / 60,4 ms, gerçek derlemede 1 kare / 58,4 ms; form 2 örnek / 65,0 ms ↔ 2 örnek / 63,1 ms.

**3) JS'te açıkça verilen `behavior` — iddia ölçülerek kanıtlandı.** Asistan akışı (`feedRef`, taşma 476 px), CSS kuralı **enjekteyken de**: `reduce` **39 kare · 18 ara değer · 633,3 ms** — yani CSS onu kapatmıyor ve kabın kendi hesaplanmış değeri zaten `auto`ydu. `matchMedia` düzeltmesinden sonra: `reduce` **2 ara değer** (iki ayrık sıçrama — `typing` göstergesi ve mesaj, aralarındaki 417 ms `ask()`in kendi gecikmesi, animasyon değil) · `no-preference` **39 kare · 18 ara değer · 633,4 ms** (birebir korundu).

**4) Senaryo 23 gerilemedi** (zirve örnekleme — oturmuş hâlde ölçen sonda iki tercihte de 0 okur ve kör kalır): `reduce` → `.reveal` **0** · ara opaklık **0** · `html` `auto`; `no-preference` → `.reveal` **39** (UAT rakamıyla birebir) · ara opaklık **3** · `html` `smooth`. `kontrol:` sonda iki hâli ayırt ediyor. ⚠️ **Koşan animasyon bu sondada `reduce` altında 2-3 okuyor, UAT'ta 0'dı — bu turun ürünü DEĞİL, sonda duyarlılığı.** Kontrol grubu koşuldu: eski hâl enjekteyken (`html` `smooth`) aynı sonda **aynı düğümleri** buluyor — `CSSTransition|0ms|header` ve `CSSTransition|0ms|div`, yani yapışkan başlığın `.01ms`'e indirilmiş gölge geçişi. UAT'ın sondası oturmuş anda örnekliyordu, bu sonda zirveyi arıyor.

**5) Kapılar** (aynı imaj, `lastmod` 12:52:33):
- `a11y.mjs` → **1 sorun · çıkış 1** — **taban birebir, artmadı** (B-063 kullanıcı kararı). 16 rota · 105 adım · **1831 eleman** · gradyan **19 (taban 19) / 0** · başlık **316 (taban 316) / 0 atlama** · `alt`sız img 0 · adsız link/buton 0 · ölçülemeyen 151/43/0/**0** birebir.
- `mobile-audit.mjs` → **TOPLAM SORUN 0 · çıkış 0 · ✓ KAPI YEŞİL**; altı kapsam tabanının hiçbiri oynamadı: 6253 eleman · **2054** metin elemanı (taban 2054) · kritik hedef **305 / 0 / 0** (taban 305) · **5** kaydırılabilir kap (taban 5) · 638 dokunma hedefi · gezinme **333 / 261** (alt bilgi 256 · içerik yolu 4 · gövde 1) · kırpma 0 · şerit 0.
- `font-guard.mjs` → iki dal ✓. Dal 1: 16 sayfa · **85.129 karakter** (birebir) · eksik 0. Dal 2: **765 / 765 kesin ölçüm · 0 sonuçsuz** · muaf 10 · 5 muaf × 6 çift = 30 ölçüm ✓.
- `perf.mjs` → `/` **111 KB** iki profilde (LCP 96/64 ms) · `/fiyat` 95 · segment 125 · `/demo` 73 KB — birebir taban; **8 kombinin 8'inde de CLS 0**.
- `scan.mjs` (**3000**) → `/` @1440 18 kare / 15.405 px · `/` @390 20 kare / 25.872 px · `/demo` @390 6 kare / 4.451 px — üçünde de **konsol temiz**, üç rakam birebir.
- `npm test` → **219 geçti + 2 atlandı** (iki env kapısı kapalı — arıza değil) · `npx tsc --noEmit` → **0** · `npm run lint` → **30 problem (25 hata + 5 uyarı)**, B-028 kaydıyla birebir; değişen iki dosyadaki tek hata (`Assistant.tsx:269` kesme işareti) **devralınan** — aynı satır eski dosyada da var, diff bunu gösteriyor.

**6) Görünüş değişmedi — ve beklenti ölçülerek doğrulandı.** Eski prod imajı elde kalmadığı için "önceki hâl" aynı derlemeye **enjekte** ile kuruldu (kuralın tek etkisi `reduce` altında `scroll-behavior`ı `auto` yapması; enjekte onu `smooth`a çeker). `⚠️ fullPage` uzun sayfada asılıyor (STYLE-GUIDE) → şerit yöntemi, `/` üzerinde 6 görüntü-penceresi karesi × 2 genişlik. Sonuç: **12 karede 0 farklı piksel** (maks kanal farkı 0), sayfa boyu birebir (25.872 / 15.405 px). `kontrol:` enjektenin tuttuğu ayrıca ölçüldü (`auto` ↔ `smooth`) ve differ'ın **pozitif kontrolü** `html{filter:invert(1)}` ile koşuldu → **1.974.960** (@390) ve **7.776.000** (@1440) farklı piksel, yani kare başına tam piksel sayısı.

---

**Oluşturulma:** 2026-09-26 (verify-phase Adım 7 — UAT senaryo 24'ün ❌'inden doğdu)
