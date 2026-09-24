# TASK-3.02: Dört yeni eksen turu — büyütme, hareket azaltma, JavaScript kapalı, yatay tutuş

**Durum:** ✅ Tamamlandı
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

- [x] **1. Büyütme ayağı**
  - 1280×1024 tabanında %200 (640×512) ve %400 (320×256); 16 rota
  - Ölçülen: kırpılan metin düğümü, iki yönlü kaydırma, ekran dışına düşen kontrol
  - B-033'ün ölçümü karşılaştırma tabanıdır: %400'de 8 kırpılan düğüm, en ağır 66 px; %100/%200/%250'de 0

- [x] **2. Hareket azaltma ayağı**
  - `prefers-reduced-motion: reduce` altında 16 rota, 390 ve 1440 px
  - Ölçülen: `Reveal` sarmalayıcısında kalan **ara opaklık** var mı (araştırmada ölçülen ara değerler: 0,459 · 0,618 · 0,666 · 0,711 · 0,818), `animate-marquee` / `animate-float` / `animate-pulse-ring` duruyor mu
  - Bu ayak M2 F2.3'ün *"Reveal animasyonu `prefers-reduced-motion` ile devre dışı kalır"* kriterinin **ilk ölçümüdür** — sonuç rakamıyla kaydedilir

- [x] **3. JavaScript kapalı ayağı**
  - `javaScriptEnabled: false`, 16 rota, 390 ve 1440 px
  - Ölçülen: içerik geliyor mu, huniye çıkan yol duruyor mu, asistanın "hayalet düğme" hâli, sekmeli bölümlerin (Roller, SSS) davranışı, formun hâli

- [x] **4. Yatay tutuş ayağı**
  - 844×390 ve 915×412 (yatay), `isMobile: true`
  - Ölçülen: yapışkan katmanların ekranı yeme oranı, ilk ekranda kalan içerik, kırpma

- [x] **5. Kalemleri sınıflandır ve düzeltme listesine ekle**

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

- [x] Dört eksenin hepsi 16 rotada koşuldu; çıktı eksen başına gezilen rota sayısını yazıyor
- [x] Hareket azaltma altında kalan ara opaklık sayısı rakamıyla raporlandı (beklenen: 0)
- [x] %400 büyütmede kırpılan düğüm sayısı ölçüldü ve B-033'ün rakamıyla (8 düğüm / 66 px) karşılaştırıldı
- [x] JavaScript kapalıyken her sayfada huniye çıkan en az bir yol olup olmadığı sayıldı
- [x] Kapsam dışı kalemler `BULGULAR.md`'ye yazıldı

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Sonuç Özeti — düzeltme listesi

Tur **12 tarayıcı bağlamı × 16 rota = 192 kombin**, **240 ölçüm örneği** (yatay ayak her rotada kaydırma öncesi + sonrası iki örnek alır), **1.577 ekran adımı**. Hedef geliştirme sunucusu (3000); yayın kopyası (3100) kapıların kuralıdır, bu turun dışında.

**Dört eksenin hiçbirinde sayfa yatay kaydırması yok — 192/192 kombin temiz**, iki yönlü kaydırma da 0. WCAG 1.4.10'un *kaydırma* ayağı %400 büyütmede ve yatay tutuşta dahi geçiyor; kırılan ayak yine **içerik ve işlev kaybı** (B-033'ün teşhisi dört yeni eksende de aynı).

### A. Devralınan iddialar — ölçüm sonuçları

| İddia | Devralınan | Bu turda ölçülen | Sonuç |
|---|---|---|---|
| **B-033 zoom ayağı** — %100/%200/%250'de kırpılan 0 | 0 | %100 (1280×1024) **0** · %200 (640×512) **0** | ✅ doğrulandı |
| **B-033 zoom ayağı** — %400'de kırpılan düğüm | 8 düğüm / 66 px | **19 düğüm / 70 px** | ⚠️ aynı küme, **farklı tanım** → aşağıda |
| **M2 F2.3** — Reveal `prefers-reduced-motion` ile devre dışı kalır | hiç ölçülmemiş | `.reveal` sınıfı **0** (kontrol: 134) · Reveal kaynaklı ara opaklık **0** · koşan animasyon **0** (kontrol: 33-36) | ✅ **ilk ölçüm, geçti** |
| **M4 F4.1 edge-case** — JS kapalıyken sayfa çalışır | beyan | 16 rotada metin uzunluğu JS açık/kapalı **birebir aynı** (ör. ana sayfa 15.284/15.284) | ✅ doğrulandı |
| **B-048 kalem 3** — JS kapalıyken asistanın hayalet düğmeleri | `inert`/`aria-hidden` yok | `op=0 · pointer-events:none · inert=false · aria-hidden=null` — **JS açıkken de birebir aynı** | ✅ yeniden üretildi |
| **B-022 ilk-ekran ölçütü** (kalibrasyon) | 390 px'te 6/16 | dik tutuş 390×844'te **6/16** | ✅ birebir — ölçütüm T1'inkiyle aynı |
| **B-033 ikinci kalem** — Roller şeridinde sığmayan sekme | 320 px'te tek kart pencereden geniş | %400'de **3 sekme tamamen ekran dışında** (sol = 388 · 756 · 1124); yatay tutuşta (844 px) hâlâ **1** | ✅ doğrulandı, genişliği ölçüldü |

**%400 rakamının ayrıştırılması — iddia çürümedi, tanım ayrıştı.** B-033 kendi gövdesinde 320 px için **iki** rakam taşıyor: ana ölçümde *"kesilenMetinDugumu: 18, enAgir: 70px"*, bisect ekinde *"8 gövde düğümü, en ağır 66 px"* — ikincisi yalnız gövde metnini sayan dar bir alt küme (h2, PERK kutuları ve CTA etiketi dışarıda). Bu tur TASK-3.01'in tanımını kullandı ve **19 / 70 px** ölçtü; bu sayı T1'in 320 px genişlik rakamıyla **birebir aynıdır** ve kırpılan düğümlerin kimliği de aynı (Kurucu Programı 70 px · "Ürün bugün nerede" paneli 42 px · üç PERK kartı 50 px, hepsi ana sayfada). Yani: **%400 büyütme, reflow açısından 320 px genişliğin tam eşidir ve büyütme ekseni yeni bir kırpma sınıfı üretmiyor.** Kök font üç seviyede de **16 px** kaldı — viewport'u bölerek kurma yöntemi geçerli.

### B. Bu fazın kapsamına giren YENİ kalemler

1. **İlk ekran dönüşüm boşluğu büyütmede ve yatay tutuşta çok daha geniş.** Ölçülen: %100 **0/16** · %200 **10/16** · %400 **16/16** · yatay 844×390 **16/16** · yatay 915×412 **15/16** (tek istisna `/ozellikler` → "Demo İste") · dik 390 **6/16**. %200'de ayakta kalan altı sayfa: `/` · `/ozellikler` · `/yazilim-secerken` · `/gecis` · `/destek` · `/olmayan-sayfa`. TASK-3.16'nın *düzeltmesi* bunları da kapsıyor (Header'ın mobil kolu `lg:` altındaki her genişlikte görünür, yüzen düğmenin eşiği düşüyor) ama *test kriterleri* yalnız 320/390 diyor — **ölçüm %200/%400 büyütmeyi ve iki yatay tutuşu da kapsamalı.** (T1 aynı satıra 412 ve 768 px'i eklemişti; bu onun üstüne gelir.)

2. **Yapışkan katman yatay tutuşta ekranın altıda birini yiyor.** Header 68 px ve yükseklikten bağımsız, yani 390 px'lik yatay ekranda **%17,4**, dik ekranda **%8,1**. Kaydırma başlayınca yüzen düğme kümesi (186×114) ekleniyor: alan olarak **+%6,4**, dikey bant olarak toplam **%46,7** (dik tutuşta %21,6). İlk ekranda kalan metin yatayda ortalama **251 karakter**, dikte **416** — %40 daha az. TASK-3.16 ve TASK-3.17'nin dokunduğu yüzeyin ölçülmüş tabanı.

3. **TASK-3.07 için DÖRDÜNCÜ kapı muafiyeti — "İçeriğe atla" atlama bağlantısı.** `a.sr-only.focus:not-sr-only.focus:fixed.focus:left-4` her rotada `sol = −1`, genişlik 1 px ile duruyor ve **16 rotanın hepsinde, dört eksenin hepsinde** "ekran dışı kontrol" veriyor. T1 üç muafiyet ölçmüştü (bal küpü `input#website` @ −9912 · `/fiyat`'ın iki fiyat tablosu · `Modules`'ün dekoratif parıltı lekesi); bu dördüncüsüdür ve bal küpünden **ayrı bir elemandır** — bal küpü muafiyeti onu yakalamaz. Kurulmazsa kapı 16 rotada kalıcı kırmızı koşar.

### C. Kapsam dışı — kanvasa yazıldı

4. **JS kapalıyken demo formu talebi sessizce kaybediyor ve kişisel veriyi adres çubuğuna yazıyor.** `DemoForm.tsx:215` formu `action`/`method` taşımıyor; JS kapalıyken tarayıcı varsayılanına (GET, aynı adres) düşüyor. Ölçüldü: gönderimden sonra adres `/demo?website=&name=Zemin+Kontrol&phone=0555+000+00+00&email=…`, `/api/demo` **hiç çağrılmadı**, form boşaldı, ekranda `role="status"`/`role="alert"` kutusu **0**. M3 alanı, fazın kapı işi a11y/mobil ayağıyla sınırlı. → **B-065** açıldı (🔴).

5. **JS kapalıyken telefon genişliğinde ana menü tamamen erişilemez** — 7 header bağlantısının 1'i görünür, `#mobil-menu` DOM'da hiç yok (16/16 rota, 390 px; 1440'ta 7/7). → Gelen Kutusu.

6. **JS kapalıyken `useState`'e bağlı içerik açılamıyor** — Roller'in 4 sekmesinden 3'ü ölü; ana sayfada SSS'in 11 kapalı düğümü bir daha açılmıyor ve cevaplar `hidden` olduğu için erişilebilirlik ağacında da yok. → Gelen Kutusu.

7. **Roller `role="tablist"` + 4 `role="tab"` taşıyor ama `role="tabpanel"` hiç yok** — JS açıkken de 0. → Gelen Kutusu.

### D. Kapıya girmeyen ama ölçülen hareket davranışları

Hareket azaltma altında `animation-duration` `.01ms`'e, `iteration-count` 1'e iniyor (`globals.css:232`), yani `animate-marquee` ve `animate-pulse-ring` **bitmiş** durumda duruyor: `document.getAnimations()` koşan animasyon **0** döndürüyor. Marquee'nin bitiş hâli `translateX(-50%)` ve şerit içeriği `[...ITEMS, ...ITEMS]` ile ikizlendiği için görüntü aynı kalıyor — içerik kaybı yok. `pulse-ring` bitişte `opacity: 0`'a gidiyor, dekoratif (`aria-hidden`) olduğu için kayıp yok. Form gönderim göstergesindeki `animate-spin` dönmüyor ama yanında "Gönderiliyor" metni duruyor, yani bilgi yalnız harekete bağlı değil.

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- Tur betiği scratchpad'de yazıldı (`olc.mjs` ölçüm modülü + `tur.mjs` koşum sürücüsü) ve araştırma konteynerine `-v` ile `/audit` olarak mount edilerek koşturuldu — repoya dosya düşmedi.
- Rota listesi ayakta olan siteden `/sitemap.xml` ile türetildi: **15 + `/olmayan-sayfa` = 16**, T1 ve araştırmanın rakamıyla aynı.
- Dört eksen 12 tarayıcı bağlamına açıldı: büyütme (1280×1024 / 640×512 / 320×256) · hareket azaltma (390 + 1440, her biri `reduce` **ve** `no-preference` kontrol grubuyla) · JS kapalı (390 + 1440) · yatay tutuş (844×390 + 915×412, `isMobile`) + dik tutuş kalibrasyonu (390×844).
- Sekiz ölçüm kovası: yatay/iki yönlü kaydırma · kırpılmış metin (+üç muafiyet ayrı sayılır) · ekran dışı kontrol · ara opaklık ve `.reveal` sınıfı · animasyon durumu · yapışkan katman kaplaması (kaydırma öncesi ve sonrası) · ilk ekran dönüşüm yüzeyi · JS-kapalı yapısal sayımlar.
- Her koşum taranan/metinli/görünür/kırpan-atalı/kontrol sayılarını bastı — bulamayan seçicinin betiği yeşil bırakması engellendi (ölçülmüş tuzak).
- Formun JS-kapalı davranışı ayrı bir sonda ile **ölçüldü**, varsayılmadı: alanlar dolduruldu, gönder tıklandı, sonuç adresi ve ağ istekleri okundu.

**Sorunlar:**
- *İlk koşum JS-kapalı ayağının ilk sayfasında dondu ve 49 dakika 0,02% CPU'da bekledi.* Sebep ölçüldü: `page.evaluate` içindeki `await new Promise(r => setTimeout(r, 20))` — **JavaScript kapalı sayfada page timer'ları hiç ateşlenmiyor**, söz hiç çözülmüyor ve `evaluate`'in varsayılan zaman aşımı yok. Adımlama Node tarafına taşındı (`page.evaluate(scrollTo)` + Node'un kendi `setTimeout`'u); `window.scrollTo` JS kapalıyken de çalışıyor (doğrulandı: 16/16 rotada kaydırma başa döndü, ortalama 8,7 adım). Ayrıca çıktı **ayak başına** yazılır hâle getirildi — ilk koşumda tamamlanmış yedi bağlamın sonucu tek dosya sona bırakıldığı için birlikte kaybolmuştu.
- *Kırpma dedektörü ilk sürümde 390 px'te 18 sahte pozitif verdi ve hepsi kayan tanıtım şeridiydi.* Muafiyet ölçütümü animasyonun **süresine** bağlamıştım (`animationDuration > 0.05`); hareket azaltma altında süre `.01ms`'e indiği için muafiyet hiç ateşlenmedi. Ölçüt **ada** çevrildi (`animationName !== 'none'`) — T1'in kuralı zaten buydu. Düzeltmeden sonra 390 px **0** verdi, yani T1/B-033'ün rakamıyla birebir. **Yakalayan şey kalibrasyon koşumuydu:** devralınan bir rakama karşı koşmasaydım 18 sahte pozitifi gerçek sanacaktım.
- *Tur iki konteynerde paralel koşturuldu* (`t302-a2` = büyütme + hareket, `t302-b2` = JS kapalı + yatay + kalibrasyon), `--name` çakışmasını önlemek için ayrı adlarla (memory'nin kuralı). Toplam duvar süresi ~13 dakika.

**Kararlar:**
- **Plan revizyonu rotası işletilmedi.** Gerekçe: bu ayağın tek plan-revizyonu tetiği task dokümanında adıyla yazılıydı — *"Ara opaklık kalıyorsa kontrast ölçümünün ön koşulu bozulur"*. Ölçüm tersini söyledi: `.reveal` sınıfı 16 rota × 2 genişlikte **0**, Reveal kaynaklı ara opaklık **0**, koşan animasyon **0**. TASK-3.04'ün dayanağı sağlam. Kalan yeni kalemler mevcut task'ların *doğruluğunu* değil *kapsamını/eşiğini* etkiliyor (TASK-3.16'nın ölçüm genişlikleri, TASK-3.07'nin muafiyet listesi) — T1'in aynı ayrımı. Kalan 23 task olduğu gibi geçerli.
- **B-033'ün %400 rakamı "çürüdü" diye işaretlenmedi.** Ölçtüğüm 19/70 ile kayıttaki 8/66 aynı kümenin iki farklı sayımıdır; B-033 zaten her iki tanımı da kendi gövdesinde taşıyor. Doğru hüküm *"tanım ayrıştı"*, *"iddia yanlıştı"* değil — ve asıl bulgu, %400'ün 320 px'in tam eşi çıkmasıdır.
- **Üç JS-kapalı kalemi kanvasa yazıldı, biri atom oldu.** Ayrım kanıtın gövdesine göre: formunki yeniden üretme adımı, ölçüm dökümü ve kişisel veri boyutu taşıyor → atom (B-065); diğer üçü tek satırlık kanca → Gelen Kutusu. Asistanın JS-kapalı hâli task dokümanının adıyla kapsam dışı bıraktığı kalem (B-017/B-048) — yalnız yeniden üretildiği kaydedildi, yeni satır açılmadı.
- **Hareket azaltmanın "kontrol grubu" koşumu tutuldu, silinmedi.** `no-preference` kolunda `.reveal` 134 çıkıyor; `reduce` kolundaki 0 ancak bu sayının yanında bir ölçüm olduğunu kanıtlıyor — tek başına "0 buldum" bulamayan seçiciden ayırt edilemezdi.
- `docs/DECISIONS.md`'ye eklendi: Hayır (ölçüm turu; mimari/sözleşme kararı doğmadı).

**Dosya Değişiklikleri:**
- Kod değişikliği **yok** — tur ölçer, düzeltmez.
- `_dev/bulgular/B-065-js-kapali-demo-formu-kisisel-veriyi-urlde-tasiyor.md` → YENİ (ölçülmüş gönderim çıktısı çapalı)
- `_dev/BULGULAR.md` → açık bulgu satırı (B-065) + Gelen Kutusu'na üç satır
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` → iki yeni tuzak (JS-kapalı page timer'ı, hareket azaltmada animasyon muafiyetinin ölçütü) — mevcut atomun kapsamında, index'e satır eklenmedi

**Test Sonuçları:**
- **Turun kendisi bu task'ın testidir** — 12 bağlam × 16 rota = **192 kombin**, **240 ölçüm örneği**, **1.577 ekran adımı**, iki koşum da çıkış kodu 0.
- **Hareket azaltma (beklenen 0):** `.reveal` sınıfı **0/0** (390 ve 1440), Reveal kaynaklı ara opaklık **0**, `document.getAnimations()` koşan animasyon **0**. Kontrol grubu (`no-preference`): `.reveal` **134**, koşan animasyon **33** (390) / **36** (1440) — ölçüm gerçekten ölçüyor.
- **%400 büyütme kırpma:** **19 düğüm / en ağır 70 px**, hepsi ana sayfada; %200 ve %100'de **0**. B-033'ün dar bisect sayımıyla (8/66) değil, TASK-3.01'in tanımıyla ve onun 320 px rakamıyla **birebir**.
- **JS kapalı huni:** 16 rotanın **16'sında** huniye çıkan en az bir yol var (ana sayfa 12 · yasal sayfalar 3 · en az 3). İlk ekranda boş sayfa sayısı JS açıkla **aynı** (6/16) — JS kapalı olmak ilk-ekran rakamını kötüleştirmiyor.
- **Yatay tutuş:** ilk ekran dönüşüm yüzeyi boş **16/16** (844×390) ve **15/16** (915×412); yapışkan kaplama **%17,4** (kaydırma sonrası dikey bant %46,7); kırpma **0**.
- **Yatay kaydırma:** 192/192 kombinde **yok**; iki yönlü kaydırma da 0.
- **Kalibrasyon:** dik 390×844'te ilk ekran boş **6/16** — T1'in rakamıyla birebir, yani ilk-ekran ölçütüm onunkiyle aynı.
- **Kapsam:** ölçüm **geliştirme sunucusuna (3000)** karşı koşuldu. Yayın kopyası (3100) kapıların kuralıdır ve TASK-3.03'ün konusudur; gerçek cihaz turu fazın sonunda kullanıcıdadır.
- Ölçüm betikleri (`a11y`, `mobile-audit`, `font-guard`, `perf`, `scan`, `npm test`) **koşturulmadı** — bu tur kod değiştirmedi, regresyon yüzeyi yok (T1'in aynı gerekçesi).

---

**Oluşturulma:** 2026-09-23
