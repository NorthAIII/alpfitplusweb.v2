# M2: Sayfalar ve Bölümler

**Sorumluluk:** Rotaları (`src/app/*`), sayfa bölümlerini (`src/components/sections/*`, 22 bölüm), yerleşim (`layout/*`) ve UI ilkellerini (`ui/*`) sunmak; içeriği M1'den, görselleri M5'ten alıp çizmek.
**Bağımlılık:** M1 (metin/fiyat), M5 (ürün görseli, fotoğraf, font)
**Sınır:** Görünen sayfa ve bileşenler. Demo formunun sunucu tarafı M3, asistan M4, sitemap/robots/güvenlik başlıkları M7. Tasarım kuralları `docs/STYLE-GUIDE.md`'de — burada tekrarlanmaz.

---

## Feature'lar

### F2.1: Ana sayfa → Phase —

**Açıklama:** 15 bölüm sırayla: hero · marquee · kaos (sorun) · çözüm · roller · modüller · ürün turu (yapışkan) · faydalar · neden biz · segmentler · nasıl çalışır · fiyat + hesaplayıcı · kurucu programı · SSS · kapanış CTA. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- 390 px genişlikte yatay kaydırma yok (`mobile-audit.mjs`)
- Kontrast ihlali 0, tek h1, tüm görsellerde **alt niteliği** (`a11y.mjs` — kontrol `!img.hasAttribute("alt")`, yani niteliğin yokluğunu arar; `alt=""` bilinçli bir beyandır ve hata sayılmaz, ölçüldü TASK-3.21)
- **Dekoratif görsel boş alt alır, bilgi taşıyan görsel almaz — ve ayrım ÖLÇÜLÜR** (TASK-3.21, QUALITY 7). Dört ayak, sırayla: (1) görsel bir `<a>`/`<button>` **içinde mi** — evetse `alt` erişilebilir adın parçasıdır, boşaltılmaz; (2) görselin **üzerinde kendi DOM metni** var mı — varsa bilgi metindedir, görsel zemindir; (3) `alt`ın **içerik kelimelerinden kaçı sayfanın kendi metninde** geçiyor — ürün ekranlarında 10'da 8 (`alt` ürünün sözlüğünü konuşur, bilgi taşır), atmosfer fotoğraflarında 4-7'de 1-3 ve eşleşenler sayfanın başlığından gelen jenerik sözcükler; (4) varlığın **cinsi** — `public/product/*` ürün arayüzü yakalamasıdır ve `docs/CLAIMS.md`'nin *"anlatmak yerine göstermek"* kanıt yüzeyidir, `public/foto/*` Pexels atmosfer fotoğrafıdır (kaynak kaydı `research/FOTOGRAF-KAYNAKLARI.txt`) ve içinde metin/veri yoktur. ⚠️ **Piksel katkısı bu ayrımı ÖLÇMEZ** — zaten boş alt taşıyan `Benefits` bandı kutusunun %99,89'unu değiştiriyor (maks kanal 251, ölçüldü); o ölçüt "görünür mü"yü ölçer, "bilgi taşıyor mu"yu değil. Bugünkü hâl: 16 rotada 39 görsel, **7'si boş alt** (Benefits bandı, HowItWorks bandı, `/gecis` bandı, dört segment kahramanı), alt niteliği olmayan **0**
- Yapışkan ürün turu 1440 px ve 390 px'te çalışıyor (üst katmanda `overflow-hidden` yok)
- Sayfa ağırlığı masaüstü ≤ 150 KB, LCP yerel üretimde < 1 s (`perf.mjs`)

**Bağımlılık:** M1 F1.1, M5 F5.1–F5.3

**Edge Case'ler:**
- **Mobil uzunluk kararı VERİLDİ: kısaltma yok, ritim düzeltilir** (kullanıcı, discuss-phase 2026-09-23 — uzunluğun kendisi ölçülmüş bir sorun değil, referans rakip de benzer). Faz 3 bunu iki bölümün yeniden tasarımıyla uyguladı ve boy yan kazanç olarak düştü: @390 **26.723 → 25.872 px**, @320 28.930 → 28.062 (TASK-3.18 + TASK-3.19). Bölüm silinmedi
- Hesaplayıcıda şube sayısı 0 veya negatif girilirse `monthlyFor()` 1'e sabitler

---

### F2.2: Alt sayfalar → Phase —

**Açıklama:** Özellikler, fiyat, segmentler + 4 segment (`[slug]`), geçiş, yazılım seçerken, demo, destek, gizlilik, KVKK, kullanım koşulları, 404. `PageHero` ve `LegalPage` ortak bölümler. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- 16 sayfanın hepsinde `a11y.mjs` 0 sorun, `font-guard.mjs` eksik karakter yok
- Her sayfanın `metadata` (title, description, canonical) tanımlı; `sitemap.ts` hepsini listeler
- Geçersiz segment slug'ı 404'e düşer
- **`opacity: 0` bir elemanı erişilebilirlik ağacından ÇIKARMAZ** (TASK-3.21): ürün turunun çapraz geçiş yığınında beş karenin beşi de ağaçtaydı ve dördü görünmezdi, yani ekran okuyucu beş ürün ekranının alt metnini arka arkaya okuyordu (`/` 13 görsel düğümün 4'ü, `/ozellikler` 6'nın 4'ü). Çare etkin olmayan kareye `aria-hidden` (odak kesilmesi gerekmiyor, görsel odaklanabilir değil — `inert` gereksiz); **etkin kare ağaçta kalır**, yoksa bölüm ekran okuyucuda tümüyle sessizleşir. Ölçüm CDP `Accessibility.getFullAXTree` iledir, `page.accessibility.snapshot()` değil — düşen düğümün *"ignored olarak bile yok"* olduğu ancak tam ağaçta görülür (aynı davranış TASK-3.13'ün 404 dev rakamında da ölçüldü). Doğrulama ölçütü **kaydırma duraklarıyla**dır: 6 durak × 2 rota × 2 genişlikte ağaçtaki ürün turu düğümü **tam bir tane** ve DOM'da görünür olanla birebir
- **404 ve çöküş yüzeyi** (`not-found.tsx` · `global-error.tsx`) kapı kapsamındadır (TASK-3.03'ün 16 rota kararı) ve iki kalemi sabittir (TASK-3.13): dev rakam **dekoratif**tir — `aria-hidden` taşır, kontrastı **ölçülmez ve yükseltilmez** (kullanıcı kararı, `phases/PHASE-3.md` → Alınan Kararlar; ölçüldü: `sage-wash-2` canvas üstünde 1,17 ve hiçbir kompozisyon katmanı bu payı açıklamıyor, yani rengi değiştirmeden 3:1 mümkün değil); ekran okuyucuda `main`'de ilk duyurulan öğe sayfanın `h1`'idir. Markalama ve istemci çöküşünün bir yere yazılması **kapsam dışı** (B-045)

**Bağımlılık:** M1

**Edge Case'ler:**
- Yeni rota klasörü eklendiğinde bind-mount'ta Turbopack yakalamaz — `docker compose restart web`
- Yasal sayfalar M1 `legal.ts`'ten okur; hukukçu onayı geldiğinde yalnız içerik değişir

---

### F2.3: Ortak yerleşim ve UI ilkelleri → Phase —

**Açıklama:** Header (nav + CTA), Footer (Kiwi AI Lab bandı dâhil), Logo (geçici işaret), Button/Card/Container/Section/Reveal/Frames/Icon. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Tüm link ve butonlar erişilebilir adla (`a11y.mjs` "adsız link/buton" 0)
- **Dönüşüme dokunan** dokunma hedefleri ≥ 44 px — `mobile-audit.mjs` bunu 320 ve 390 px'te ölçer ve eşik altında kırmızıya döner (TASK-3.08). Kritik küme: buton · form alanı · sekme · `header`/`nav` menüsü · `/demo`, `wa.me`, `tel:` bağlantıları (nerede olursa olsun). **Alt bilgi ve içerik yolu bağlantıları ölçülür ve raporlanır ama kapıyı düşürmez** (kullanıcı kararı, PHASE-3 → Alınan Kararlar: kural kademeli kurulur). Ölçülen kutu kontrolün kendisidir, sarmalayan `<label>` değil
- **Alt bilgi kolon başlıkları `h2`dir, `h3` değil** (TASK-3.13): `Footer` 16 rotanın hepsinde çizildiği için başlık dizisinin doğruluğu sayfa gövdesinde `h2` bulunmasına **bağımlı olamaz** — `h3` iken gövdesinde `h2` olmayan tek sayfada (404) dizi `h1 → h3` atlamasına dönüyordu. Görünüş etkisi yok: `globals.css` `h1,h2,h3,h4`'ü aynı kurala bağlar, ölçü/ağırlık/harf aralığı yardımcı sınıflardan gelir (ölçüldü: 6 kombinde 0 farklı piksel)
- **Her sayfanın ilk ekranında en az bir dönüşüm yüzeyi vardır** (TASK-3.16, B-022): sayfa açıldığı anda — yani kaydırma sıfırken — görünen alanda `/demo` ya da `wa.me` hedefli, **gerçekten kullanılabilir** (render edilmiş · `visibility:visible` · etkin opaklık > 0 · `pointer-events` açık) en az bir bağlantı bulunur. Taşıyıcısı `Header`'ın `lg:` altında görünen "Demo" bağlantısıdır; 1024 px ve üstünde aynı işi masaüstü "Demo İste" düğmesi yapar. **Kriter kapıya girmedi** — fazın kapı işi kontrast + kırpma + dokunma hedefiyle sınırlı tutuldu (kapsam kararı, PHASE-3), bu ölçüm tek seferliktir; kalıcı kapı ayrı bir karardır. Ölçülen kapsam 320×568 · 390×844 · 412×915 · 768×1024 · %200 büyütme (640×512) · %400 büyütme (320×256) · yatay 844×390 ve 915×412 — **dokuzunda da 16/16**
- **Yüzen düğme kümesi 120 px kaydırmadan sonra görünür** (TASK-3.16): eşik sıfır değildir, çünkü sayfanın tepesinin temiz kalması bilinçli bir tercihtir (B-022 → Kök Neden Yönü) ve sıfır eşik yüzen katmanı her sayfanın **ilk ekranındaki** metnin üstüne koyardı; ilk ekranın dönüşüm yolunu başlıktaki bağlantı taşır, yüzen düğme değil
- **`prefers-reduced-motion: reduce` iki ayağı birden kapsar ve ikisi de ölçüldü** (TASK-3.02 ilk ayağı, TASK-3.27 ikincisini): (a) **Reveal animasyonu devre dışı kalır** — `reduce` altında `.reveal` 0 · geçiş-ortası opaklık 0 · koşan animasyon 0, kontrol grubunda (`no-preference`) 39 reveal / 41 oynayan; (b) **çapa ve programatik kaydırma animasyonsuz olur** — `reduce` bağlamında `scroll-behavior != auto` eleman 16 rota × 2 genişlikte (15.874 eleman) **0**, `no-preference`ta 32 (birebir korundu). ⚠️ İkinci ayağın iki mekanik kuralı vardır: seçici `html` değil `*`, çünkü `scroll-behavior` **kalıtılmaz**; ve **`behavior`ı JS'te açıkça veren çağrıyı CSS kapatmaz** — böyle her çağrı tercihi `matchMedia` ile kendisi okur (bugün tek örnek `Assistant.tsx`, ölçüldü: kural enjekteyken de 39 kare / 633 ms kayıyordu). Kalıcı kapı **yok** ve bilinçle kapsam dışı (evi "Kalite kapıları otomatik" fazı); kurallar `docs/STYLE-GUIDE.md` → Hareket azaltma

**Bağımlılık:** Yok

**Edge Case'ler:**
- Logo geçici; favicon, app ikonu ve OG görseli ondan türetiliyor — logo değişince `brand-assets.mjs` yeniden koşar (`BULGULAR.md` B-009)

---

## Teknik Notlar

- Bileşenler metin **taşımaz**, `src/content/`'ten okur. Metin değişikliği bileşene dokunmaz (M1 F1.2).
- Başlangıç ölçümü (2026-09-11) `modules/M6-Kalite-Kapilari.md` → Teknik Notlar'da.
