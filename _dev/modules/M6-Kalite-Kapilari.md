# M6: Kalite Kapıları

**Sorumluluk:** Erişilebilirlik, mobil, font kapsaması, performans, konsol temizliği ve iddia sızıntısını **ölçmek** ve eşik altı değişikliği durdurmak.
**Bağımlılık:** M7 (CI yayın hattına bağlanır; perf üretim konteynerine karşı koşar)
**Sınır:** `research/scripts/` ölçüm betikleri (a11y, mobile-audit, font-guard, perf, scan), ileride tek komut + GitHub Actions + metin sızıntı denetimi. Görsel üretim betikleri M5'tir (render-product'ın kendi denetimi M5'te kalır).

---

## Feature'lar

### F6.1: Beş ölçüm betiği → Phase —

**Açıklama:** `a11y.mjs` (kontrast, h1, alt, adsız link/buton), `mobile-audit.mjs` (yatay kaydırma, dokunma hedefi), `font-guard.mjs` (kapsama, üretim konteynerine karşı), `perf.mjs` (TTFB, FCP, LCP, CLS, ağırlık), `scan.mjs` (ekran ekran gezme, konsol hatası). Hepsi elle koşuyor. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Her betik geçme şartını çıktıda açıkça yazar (TOPLAM SORUN: 0 / yatay kaydırma: yok / eksik karakter yok / konsol temiz)
- Eşik altı durumda sıfır-olmayan çıkış kodu döner
- Her betik **kendi kapsamını da eşikler**: gezdiği rota sayısı ve ölçtüğü eleman sayısı çıktıya girer, beklenenin altına düşerse kırmızıya döner ("0 eleman ölçüldü" bir kırmızı koşuludur)

**Durum (TASK-3.03 → TASK-3.23, 2026-09-25):** İkinci ve üçüncü kriter `a11y.mjs` + `mobile-audit.mjs` için **kuruldu ve sınandı** (dört sonda: hedef kapalı · rota listesi çöktü · 0 eleman ölçüldü · temiz hedefte yeşil). `font-guard.mjs` **ikiye ayrıldı ve yalnız yeni dalı eşikli** (TASK-3.23): dal 2'nin üç tabanı var (yüz ≥ 5 · kesin ölçüm ≥ 765 · kullanılan yığın çifti ≥ 6) ve beş sondayla sınandı; **dal 1'in tabanı hâlâ yok ve bedeli ölçüldü** — hiçbir şey servis etmeyen bir hedefe karşı dal 1 *"16 sayfa · 48 karakter tarandı · ✓"* diyerek yeşil kaldı (yalnız dal 2'nin tabanları kırmızı bastı). Dal 1'in eşiklenmesi bilinçle "Kalite kapıları otomatik" fazına bırakıldı. `perf.mjs` ve `scan.mjs`'te ikisi de **hâlâ yok** (B-030).

**Bağımlılık:** Yok

**Edge Case'ler:**
- Yayın kopyası (3100) ayakta değilse **dört betik** de anlamlı ölçmez — `a11y.mjs`, `mobile-audit.mjs`, `font-guard.mjs`, `perf.mjs`. İlk ikisi bunu TASK-3.03'ten beri **cümleyle** söyleyip sıfır-olmayan çıkış kodu döndürüyor (yığın izi basmıyor); `font-guard` ve `perf` bu satırı hâlâ karşılamıyor

---

### F6.2: Tek komut → Phase —

**Açıklama:** Beş ölçüm (ileride chat test seti ve sızıntı denetimi) tek komutla sırayla koşar, tek özet tablo basar. "Kalite kapıları otomatik" faz konusu.

**Kabul Kriterleri:**
- `npm run check` (veya eşdeğer) tüm betikleri koşar; biri kırmızıysa komut kırmızı
- Özet tablo her betiğin geçme şartını ve ölçülen değeri gösterir
- Yerelde üretim konteynerini kendisi ayağa kaldırır ya da yoksa net hata verir

**Bağımlılık:** F6.1

**Edge Case'ler:**
- Betikler Docker araştırma konteynerinde; tek komut compose profilini çağırır, ana makinede Playwright gerektirmez

---

### F6.3: CI — GitHub Actions → Phase —

**Açıklama:** Her push'ta tek komut koşar; kırmızıysa commit kırmızı. Repo özel, Actions dakikası sınırlı — süre bütçesi ölçülür. Aynı faz konusu.

**Kabul Kriterleri:**
- `main`'e push → workflow koşar → sonuç GitHub'da görünür
- Kontrast ihlali, yatay kaydırma, kümede olmayan karakter, iddia sızıntısı içeren test commit'i kırmızı
- Workflow süresi ölçüldü ve faz dokümanına yazıldı

**Bağımlılık:** F6.2, M7 (Vercel önizleme URL'si varsa ona karşı da koşabilir — discuss'ta karar)

**Edge Case'ler:**
- Playwright + Chromium imajı CI'da ağır; önbellekleme gerekir
- Tek dal `main`, PR yok — koruma push sonrası uyarıdır, push öncesi kapı istenirse husky/pre-push discuss'ta konuşulur

---

### F6.4: İddia sızıntı denetimi (metin) → Phase —

**Açıklama:** `src/content/`, bileşenler ve render edilmiş sayfalarda yasaklı kalıpları tarar: "canlı", "sahada", "müşterilerimiz", yüzde iyileşme, "sadece bizde", ROI/projeksiyon, üstünlük. `docs/CLAIMS.md`'nin otomatik hali. Aynı faz konusu. **Sözlük artık var ve devralınır** (Faz 2, TASK-2.15): `research/lib/claim-leak.mjs` — 20 kalıp, beş sınıf; bugünkü tek tüketicisi görsel üretim hattı, ikincisi bu feature olacak. Dosya `research/` altındadır çünkü ölçülmüş kısıt odur: iki konteynerin ortak gördüğü tek dizin orasıdır (araştırma konteyneri yalnız `research/`, `web` tüm depoyu görür).

**Kabul Kriterleri:**
- Yasaklı kalıp geçen bir test cümlesi eklendiğinde denetim kırmızı, dosya ve satır gösterir
- **Kalıp listesi `research/lib/claim-leak.mjs`'ten okunur — ikinci bir liste açılmaz** (`docs/CLAIMS.md` → Sızıntı Denetimi; `modules/M5-Gorsel-Varlik-Hatti.md` → F5.1). Ayraç aynen devralınır: projeksiyon/üstünlük/büyüme kıyası yasak, nötr gösterge değeri (ciro tutarı, doluluk yüzdesi) serbest
- Karşılaştırma Türkçe yerelde normalleştirilir (`trLower()`); regex'e `/i` bayrağı **eklenmez** — "EN HIZLI" örneğinde `/i` de `.toLowerCase()` de kaçırıyor (ölçüldü)
- Pilot cümlesinin `PRODUCT_STATUS` dışında tekrarını yakalar
- **Rakip adı mekanizması bu feature'ın işidir** (Faz 2 kararı, aşağı bak): doğru jeton sınırını seçmek sınıfın gerçek girdisine — site metnine — bakmayı gerektiriyor

**Bağımlılık:** F6.2

**Edge Case'ler:**
- Yasal metinler ve karşılaştırma yöntemi açıklaması meşru istisna olabilir — izin listesi dosya bazlı tutulur. ⚠️ Görsel taraftaki izin listesi (`CLAIM_ALLOW`) **tam değere** bakar, eşleşen parçaya değil: parçaya izin vermek terimi o yüzeyde tamamen körleştirir
- **Rakip adı sözlükte tutulmaz — ne düz metin ne hash** (`docs/DECISIONS.md` 2026-09-23; ölçüm: 18 gerçek rakip adının 0'ı görsel hattın girdisinde geçiyor, kaba ad eşlemesi ise sıradan bir Türkçe sözcüğü rakip sandı). Sözlük bugün yalnız **slotu beyan eder**; adların nasıl tutulacağı (hash, ayrı gizli dosya ya da jeton sınırlı kalıp) bu feature'ın kendi kararıdır ve kaynağı `../alpfit-plus-satis/rekabet/`tir. Bilinçle kabul edilen bedel: görsel hat bugün bir rakip adını göremez

---

## Teknik Notlar

**Regresyon çizgisi.** F6.2 tek komut eşiklerini **doğrudan bu tablodan** alır. Sonraki ölçümler faz dokümanlarına yazılır, buraya yığılmaz.

⚠️ **Rakam tek başına eşik değildir — kapsamıyla birlikte okunur.** Faz 3, a11y ve mobil betiklerini yeniden yazdı: aynı *"0"* artık çok daha geniş bir şeyi anlatıyor (16 rota · piksel kontrastı · gradyan metin dalı · başlık hiyerarşisi · kırpılmış taşma · iki kulvarlı dokunma hedefi). Bu yüzden dört satır **yeniden ölçüldü** (TASK-3.23, 2026-09-25, yayın kopyası 3100) ve kapsamıyla yazıldı; kalan dört satırın yöntemi bu fazda değişmedi, **kickoff değerinde bırakıldı** (B-035 kapsam dışı).

| Kontrol | Eşik | Kapsam |
|---|---|---|
| Erişilebilirlik (`a11y.mjs`) | TOPLAM SORUN **1** · çıkış 1 — ⚠️ **bu 1 bir eksik değil KAYITLI BİR KARAR** (kullanıcı, 2026-09-26, TASK-3.26 seçenek B): kalan tek kalem `/gecis`'in bir paragrafı ve **sayfanın değil ölçümün kusuru** (B-063'ün maske sızıntısı yüzü; gerçek değeri 7,05 ölçüldü). Eşiği düşüren bir regresyon arandığında bu kalem **hariç** okunur; başlık atlaması **0** | 16 rota × **1440 px** · 105 ekran adımı · **1831 eleman** (TASK-3.26 üç dev rakamı `aria-hidden` ile kapsamdan çıkardı: 1834 → 1831) · kontrast **piksel** yöntemiyle (`p02` = en kötü %2) · gradyan metin dalı 19 durak · görünür başlık 316 (`aria-hidden` bir başlık DÜŞÜRMEDİ, ölçüldü) · `alt`sız img 0. Ölçemediği: yapışkan katman 151 kalem (B-063) · görünmez 43. `lg:` altında çizilen metin **kapsam dışı** |
| Mobil kırpma ve şerit (`mobile-audit.mjs`) | TOPLAM SORUN **0** · çıkış 0 (`✓ KAPI YEŞİL`) — kırpılmış taşma 0, şerit ihlali 0, yatay kaydırma 0 | **2 genişlik (320 / 390 px)** × 16 rota · 6253 eleman · 2054 metin elemanı · 5 kaydırılabilir kap. Kesim ölçütü: metin taşıyan elemanın kutusu, onu kesen **atasının** kutusuna karşı. Kaydırılabilir kap · hareketli şerit · `sr-only` muaf ve ayrı sayılır |
| Dokunma hedefi (`mobile-audit.mjs`) | kritik küme **305 ölçüldü / 0 eşik altı** · gezinme kulvarı 333 / **261 eşik altı** (raporlanır, kapıyı düşürmez — kullanıcının kademeli kuralı) | Eşik **44×44 px, iki boyut da sayılır**; ölçülen kutu **kontrolün kendisi** (sarmalayan `<label>` değil). Kritik küme sırayla: buton → form alanı → sekme → menü → dönüşüm bağlantısı. Yapışkan katman içindeki hedefler hariç. **Çakışma ölçülmüyor** |
| Font kapsaması (`font-guard.mjs`) | **iki dal, ikisi de geçmeli** · çıkış 0 — dal 1: eksik karakter **0** · dal 2: muaf olmayan eksik glif **0** (muaf 10) | Dal 1: 16 rota × 1440 px, `body.innerText`, 85.129 karakter; `display:none` içeriği ve hata kutusu **kapsam dışı**, kapsam tabanı **yok**. Dal 2: **5 woff2 × 153 karakter = 765 kesin ölçüm, 0 sonuçsuz** (rota bağımsız, dosya ölçümü) + muafiyet 5 karakter × 6 (yığın, ağırlık) çifti = 30 ölçüm. Muaf 10 kalem = `₺` + `←↑→↓`, Sora'nın iki yüzünde |
| Konsol hatası (`scan.mjs`) | 0 | ⚠️ Hedef **geliştirme sunucusu (3000), kodda sabit** — yayın kopyası hiç ölçülmüyor (B-030'un yanında duran ayrı bir boşluk, TASK-3.22'de ölçüldü). 2026-09-25'te `/` @1440 18 kare / 15.405 px · @390 20 kare / 25.872 px, ikisinde de temiz |
| Üretim derlemesi | 23 rota, geçiyor | 2026-09-11 (kickoff) — bu fazda yeniden ölçülmedi |
| Ana sayfa ağırlığı | masaüstü 144 KB · mobil 133 KB | 2026-09-11 (kickoff) — bu fazda yeniden ölçülmedi; bugünkü değer faz dokümanında |
| Ana sayfa LCP | 96 ms (üretim konteyneri, yerel) | 2026-09-11 (kickoff) — bu fazda yeniden ölçülmedi |
| CLS | 0 – 0,005 | 2026-09-11 (kickoff) — bu fazda yeniden ölçülmedi |

**Font ağırlığı** ayrıca `perf.mjs` ile izlenir: `font/woff2` **95 KB** (5 dosya) — kickoff'tan beri değişmedi, TASK-3.23'te birebir doğrulandı. `/demo` 73 KB gösterir çünkü orada üç yüz çizilir.

- Çalıştırma: `docker compose --profile research run --rm research node scripts/<betik>`; üretim konteyneri `docker compose --profile prod up -d --build web-prod` (3100).
- `ILKELER.md` → Kümülatif test ilkesi bugün karşılanmıyor; bu modülün F6.2–F6.4'ü onu kapatır.

**Maske sızıntısı — kapının ölçülmüş üçüncü kör noktası (TASK-3.26, 2026-09-26):**

Kontrast ölçümü iki kare alır (normal · glif dolgusu şeffaf) ve farkı **glif maskesi** sayar. Maske testi saf piksel farkıdır, **glifin kime ait olduğunu bilemez**: ölçülen elemanın satır kutusunun içine düşen *başka* bir elemanın glifleri de maskeye girer, ve zemin o yabancı elemanın zemininden okunur. Yapışkan başlık bunu **her adımda** üretir — ekran ekran gezme, akan içeriği başlığın altından geçirir.

Ölçülen örnek: `/gecis`'in *"Elle tutulan kayıtlar…"* paragrafı. Kapı `p02` **3,25** / `med` 7,05 / glif 2955 px basıyor; iki bağımsız izolasyon sonucu çürütüyor — (a) `header{display:none}` → **7,05** (zemin %100 beyaz), (b) başlığın yalnız **kendi metni** iki karede de şeffaf yapıldığında (geometri, bulanıklık, düğme zemini aynen yerinde) maske 2955 → **1861 px** ve `p02` → **6,98**. Düşen 1094 piksel başlığın kendi çağrı düğmesinin etiketidir; kapı paragrafın mürekkebini o düğmenin sage zeminiyle eşleştiriyordu. 390 ve 320 px'te aynı paragraf **7,05** ve **6,80** — yani kalem tek genişlikte, tek adımda ve yalnız adım ızgarası satırı düğmenin altına denk getirdiği için var.

⚠️ **Naif çare ÖLÇÜLDÜ ve YETMEDİ:** "örtülü adımda o elemanı ölçme" yaması 16 rotada koşuldu — `TOPLAM SORUN` 6 → 5 (artefakt düştü, beş gerçek kalem rakamıyla durdu) ama **gradyan metin 19 → 18** (kendi kapsam tabanının altına düşüyor, yani kapı başka bir sebeple kırmızı) ve **"ekran dışı" 0 → 8** (bu sekiz eleman hiçbir adımda başlığın altından çıkmıyor, yani hiç ölçülmez oluyor). 171 (eleman, adım) çifti atlandı. Doğru çare B-063'ün kayıtlı önerisidir — **yapışkan katmanlar için kaydırma sıfırdayken ayrı bir tur, akan turda örtülü pikselin maskeye girmemesiyle BİRLİKTE** — ve o tur bilinçle "Kalite kapıları otomatik" fazına ertelendi: **iki ayrı kullanıcı kararıyla**, verify-plan 2026-09-23 ve TASK-3.26 2026-09-26 (ikincisinde kapının Faz 3'ü **1 kalemle** kapatması kabul edildi).

**Rota kaynağı ve ölçüm hedefi (TASK-3.03, 2026-09-24):**

- **Rota listesi artık tek kaynaktan türer:** `research/lib/rotalar.mjs`, ayakta olan hedefin `/sitemap.xml`'ini HTTP ile okur, `<loc>`'ların **yol** kısmını alır ve `/olmayan-sayfa`'yı ekler → bugün **15 + 1 = 16**. Import edilmiyor çünkü araştırma konteyneri depoyu değil yalnız `./research` dizinini görüyor (`docker-compose.yml` → `research.volumes`), yani `src/app/sitemap.ts` oradan okunamaz. Yeni sayfa eklendiğinde liste kendiliğinden büyür; **taban** `BEKLENEN_ROTA = 16` ve altına düşerse betik hata verip durur (B-012'nin senkron kaybı bir daha doğamaz).
- **`ROTALAR` kaçış yolu kaynağı değiştirir, eşiği değiştirmez:** elle verilen dar bir liste kapıyı yeşil bırakmaz — gezilen rota sayısı ayrıca eşiklenir (ölçüldü: 2 rota → `KAPSAM EŞİĞİ` + çıkış kodu 1).
- **Varsayılan ölçüm hedefi yayın kopyasıdır** (3100) — `a11y.mjs` ve `mobile-audit.mjs` artık `font-guard.mjs`'in `BASE` desenini taşıyor; `BASE=http://localhost:3000` ile geliştirme sunucusuna yönlendirmek bilinçli olarak açık. ⚠️ Bedeli 3100'ün bayatlığıdır (B-019) ve **ölçüldü:** bu task koşarken 3100, `a17ca7a` (2026-09-23 19:11) commit'ini taşımıyordu — `docker compose build web-prod` imajı tazeler ama konteyneri yeniden yaratmaz, `--profile prod up -d` gerekir.
