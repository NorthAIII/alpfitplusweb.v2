# B-018: Yayındaki ürün görsellerinde gerçek kişi adı, ciro projeksiyonu ve yol haritası özellikleri duruyor

**Önem:** 🔴 | **Tip:** hata / iddia sızıntısı | **Alan:** M5 — Görsel varlık hattı / M1 — İddia sınırı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** → Faz 2

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → Tek Kaynaklar, ürün ekran görüntüleri satırı: *"Eski marka, gerçek sporcu/semt adı, karşılanmayan iddia kartı temizlenir; **sızıntı varsa üretim durur**."* `CLAUDE.md` aynı kuralı tekrarlıyor. `src/content/legal.ts:266` ziyaretçiye şunu söylüyor: *"Sitede kullanılan ürün ekran görüntüleri örnek verilerle üretilmiştir. **Gerçek bir kulübün veya kişinin verisi gösterilmemektedir.**"*

**Gözlenen:** Denetim "temiz" diyerek geçti, üretim durmadı, ama yayındaki görsellerde üç ayrı sınıftan sızıntı duruyor. `public/product/sube.webp` gözle okundu ve üçü de aynı karede görülüyor:

**1. Gerçek kişi adı (çıplak ilk ad).** Sağ alttaki "Şube özeti" kartı: *"…**Simge & Gizem** hocaların doluluğu düşük — yeni üye yönlendirmesi buraya."* Aynı sınıfın ikinci örneği `public/product/grup.webp`'te: "Box" ders kartında *"**Gizem Ö.** · 17:00 · 60 dk"*.

Temizlik tablosu bu iki adı **biliyor** — `research/lib/screen-cleanup-v2.mjs:26-31` içinde `['Simge Aköz','Cüneyt V.']` ve `['Gizem Örge','Yasemin U.']` eşlemeleri var. Kaçıran şey tablo değil, **kalıp**: eşleme tam ada göre yazılmış, metinde ise çıplak ilk ad geçiyor. Aynı ekranın antrenör tablosunda temizlik doğru çalışmış (Ege K., Nihan T., Tuğçe A., Berk S., Yasemin U., Cüneyt V.) — yani hat çalışıyor, yalnız bu iki geçiş kalıbın dışında kalmış.

**2. Ciro artışı projeksiyonu.** Aynı kart: *"Akşam slotları ve grup dersleri doldurulursa ciro tek başına **~₺110B/ay artabilir**."* Kart ayrıca *"Vadi 4 ayda **227 üyeye** ulaştı — grubun en hızlısı"*, üstteki şeritte *"+%34 geçen aya göre"* ve *"en hızlı büyüyen şube"* rozeti var. CLAIMS bunları açıkça yasaklıyor: *"Herhangi bir ROI, müşteri sayısı, yüzde iyileşme, 'X kulüp kullanıyor'."*

Sitenin kendi metni tam tersini taahhüt ediyor — `FounderProgram.tsx:99-101`: *"size yüzde kaç ciro artışı sağlayacağımıza dair bir rakam söylemiyoruz."* Yani yazılı sınır görselde çiğneniyor.

**3. Bugün olmayan özellikler.** Sol menüde **"Kampanyalar"** girdisi duruyor (sekiz görselin yedisinde), `public/product/raporlar.webp`'te **"Yenileme & Churn"** kartı var. `BULGULAR.md` → Bilinçli Tercihler bu ikisini *"karşılıkları ürünün v1.5'inde, bugünkü ürünün parçası değil"* diye kayıt altına almış ve `/ozellikler` sayfası bunları "Yolda" kolonunda gösteriyor. Temizlik sayfaların kendisini düşürmüş ama **nav girdisini ve rapor kartını** düşürmemiş.

Birinci kalem en ağırı: yasal metinde ziyaretçiye verilen bir taahhüdü çürütüyor ve gerçek kişilere ait ad taşıyor.

## Kanıt

Görsel gözle okundu: `public/product/sube.webp` — sağ alt "Şube özeti" kartı, sol menü, üst KPI şeridi. `public/product/grup.webp` — "Box" ders kartı.

Kaynak ve denetim körlüğünün mekanizması:
```
$ grep -rn "Simge\|Gizem" ../Alpfit.v1/demo/
  sube.html:481   "...Simge & Gizem hocaların doluluğu düşük..."
  grup.html:209   "Gizem Ö. · 17:00 · 60 dk"

$ grep -n "Simge\|Gizem" research/lib/screen-cleanup*.mjs
  screen-cleanup-v2.mjs:26-31   ['Simge Aköz','Cüneyt V.'] , ['Gizem Örge','Yasemin U.']
  screen-cleanup.mjs:87         ['Simge A.','Cüneyt V.']        ← 'Gizem Ö.' eşlemesi YOK

$ grep -n "const full" research/lib/screen-cleanup-v2.mjs
97: const full = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g
```
Denetim kalıbı **iki tam sözcük** arıyor. "Gizem Ö." ikinci sözcüğü tek harf olduğu için uymuyor; "Simge & Gizem" araya `&` girdiği için uymuyor. Marka dalı yalnız eski markayı arıyor. Üretim bu yüzden yeşil verdi.

Ciro kartı ve nav girdisi kaynakta: `../Alpfit.v1/demo/sube.html:475-482`, `cockpit.html:100`, `raporlar.html:242`. `DROP_NODES` (`screen-cleanup-v2.mjs:41-53`) `.card` düşürmeyi yalnız `takvim` ve `uye-telefon` için yapıyor.

## Kök Neden Yönü

Temizlik iki listeye dayanıyor: **ne değiştirilecek** (ad eşlemeleri) ve **ne düşürülecek** (DOM düğümleri). İkisi de elle yazılmış ve kaynak HTML'in gerçek metin çeşitliliğini kapsamıyor. Asıl kırılma denetimde: denetim, temizliğin kendi kalıplarıyla aynı varsayımı paylaşıyor (ad = iki tam sözcük), dolayısıyla temizliğin kaçırdığını **yapısal olarak** göremiyor. Bağımsız olmayan bir denetim, denetim değil teyittir.

## Koruma Önerisi

- Denetim, temizliğin kalıbından bağımsızlaşır: eşleme tablosundaki **her adın her parçasını** (ad ve soyadı ayrı ayrı, kısaltılmış hâlleriyle birlikte) yasaklı sözcük listesi olarak arar. Tablo zaten adları biliyor; denetimin onları regex'ten değil tablodan okuması hem daha basit hem daha sağlam.
- Yasaklı iddia sözlüğü görsellere de uygulanır: `₺…B/ay artabilir`, `+%NN geçen aya göre`, `en hızlı`, `rekor` gibi kalıplar. Bu, M6 F6.4'ün (iddia sızıntı denetimi) metin tarafıyla **aynı sözlüğü** paylaşabilir — sızıntı denetimi metin ve görsel için tek listeden beslenmeli.
- Yol haritası kalemleri için: "bugün yok" listesi `src/content/`'te zaten var (`/ozellikler` "Yolda" kolonu). Temizlik o listeden beslenirse nav girdisi ve rapor kartı elle sayılmak zorunda kalmaz.
- Kapanış kapsamı ölçülerek yazılmalı: bu bulgu iki görselde üç kalem gösteriyor, ama sekiz görselin tamamı kalem kalem taranmadı (aşağıdaki kapsam notu).

**Kapsam notu:** Bu turda sekiz görselden ikisi gözle satır satır okundu (`sube`, `grup`), diğerleri nav girdisi ve bilinen kalıplar için tarandı. Kaynak HTML belgelerinin kırpma dışında kalan gövdesi okunmadı — başka karşılanmamış iddia veya ad bulunması mümkün. Düzeltme yapılırken sekiz görselin tamamı yeniden denetlenmeli.

**2026-09-12 ölçümü — kapsam notu KAPANDI ve etki kalibrasyonu düzeltildi.**

Yukarıdaki kapsam notu ("sekiz görselden ikisi gözle satır satır okundu … düzeltme yapılırken sekizin tamamı yeniden denetlenmeli") yerine getirildi: **sekiz görselin tamamı gözle okundu** ve tam sızıntı envanteri [B-044](B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md)'te tablo hâlinde duruyor. Kapanış kapsamının ölçütü artık o tablodur.

İki düzeltme bu atomun kendi ifadelerine:

1. **Başlık "yayındaki" diyor; en ağır sızıntının görünür yüzeyi yok.** `public/product/sube.webp` — "Simge & Gizem" ve `~₺110B/ay` kalemlerini taşıyan görsel — **hiçbir sayfada render edilmiyor**: `SHOTS.sube` tanımlı ama tüketicisi yok ve 15 rotanın hiçbirinin HTML'inde geçmiyor (ölçüldü). Dosya yalnız `/product/sube.webp` adresinden **200 dönüyor** (62.494 B, canlı önizlemede doğrulandı). Yani bu iki kalem bugün yalnız doğrudan adresle erişilebilir; yasal metnin ("gerçek bir kişinin verisi gösterilmemektedir") çürüdüğü iddiası **kamuya açık bir varlık** için geçerli, **gösterilen bir sayfa** için değil. `grup.webp`'teki "Gizem Ö." ise gerçekten gösteriliyor (ProductStory adım 2 → `/` ve `/ozellikler`).
2. **Kök neden bu atomun yazdığından keskin.** Buradaki teşhis "denetim, temizliğin kalıbıyla aynı varsayımı paylaşıyor" idi ve doğrudur; ölçüm bir adım ötesini gösterdi: `auditTexts()` yalnız **iki dal** taşıyor (iki-tam-sözcük ad kalıbı + eski marka regex'i), yani **iddia sızıntısı için hiç dal yok** — yüzde, ciro, üstünlük, tarih ve yol-haritası kalemleri "kalıp kaçırdı" değil, **hiç kontrol edilmiyor**. 21 gerçek sızıntı dizgesi kalıba verildi, 20'si kör. Ayrıca `DROP_NODES` sekiz ekranın yalnız **üçünü** kapsıyor.

Bugün yapılabilecek en ucuz iş de ölçümden çıktı: `sube.webp` `render-product.mjs`'in `SCREENS` listesinden düşürülürse bu atomun iki ağır kaleminin kamuya açık yüzeyi kapanır (`public/` elle düzenlenmez).

**2026-09-12 kapsam daralması (QUICK-001) — atom AÇIK kalır.**

`sube` ekranı `render-product.mjs`'in `SCREENS` listesinden düşürüldü, hat yeniden koşturuldu (7 görsel, denetim sızıntı bulmadı) ve `public/product/sube.webp` yayınlanan kümeden çıktı: `/product/sube.webp` artık **404** (önce 200, 62.494 B). Bu, yukarıdaki kalemlerden **yalnız** `sube.webp`'te duranların kamuya açık yüzeyini kapatır — *"Simge & Gizem"*, *"~₺110B/ay artabilir"*, *"+%34 geçen aya göre"*, *"227 üye · +30 bu ay (rekor)"*, *"★ en hızlı büyüyen şube"*.

**Kapanmayan — bu yüzden atom açık:**
- **`grup.webp`'teki "Gizem Ö." gösterilmeye devam ediyor** (ProductStory adım 2 → `/` ve `/ozellikler`). Yasal metnin *"gerçek bir kişinin verisi gösterilmemektedir"* beyanı hâlâ çürük.
- **Kök neden duruyor:** `auditTexts()` hâlâ iki dallı, iddia sızıntısı için hiç dal yok — bir ekranı listeden düşürmek denetimi görür hâle getirmez. `DROP_NODES` hâlâ sekiz ekranın üçünü kapsıyor.
- **"Kampanyalar" nav girdisi** kalan yedi görselin altısında, *"Yenileme & Churn"* kartı `raporlar.webp`'te duruyor.

Kapanış kapsamının ölçütü hâlâ [B-044](B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md)'teki envanter tablosudur; o tablonun `sube.webp` satırı bugün **tarihsel** okunur (ekran artık üretilmiyor).

## Çözüm Kaydı

**TASK-2.13 (2026-09-23) — adıyla sayılan ÜÇ kalemin üçü de kapandı, dördüncüsü de; atom AÇIK kalır (kök neden).**

Hat yeniden koşturuldu (7 `.webp`, çıkış kodu 0, denetim sızıntı bildirmedi) ve çıktıların **yedisi de gözle okundu**.

| Kalem | Hüküm |
|---|---|
| "Gizem Ö." (`grup.webp`) | ✅ **kapandı** — kare artık "Box · **Yasemin U.** · 17:00 · 60 dk". Kaçıran şey tablo değil kalıptı: eşleme **tam ada** yazılmıştı, metinde kısaltılmış hâl geçiyor. `['Gizem Ö.','Yasemin U.']` + çıplak ilk ad eşlemeleri eklendi; hedef ad tam-ad eşlemesiyle **aynı** seçildi ki aynı kişi iki karede iki ad almasın |
| "Kampanyalar" nav | ✅ **kapandı — 7/7 görselde.** Ekran başına değil **ortak kabuk kuralı** olarak yazıldı (`SHELL_DROP_NODES`), çağıran her ekrana uyguluyor. Mekanik sayım: kabuk kuralı yedi ekranın her birinde tam 1 düğüm düşürdü (cockpit 1 · takvim 2 · finans 1 · antrenör 6 · raporlar 2 · grup 1 · üye-telefon 2 = 15 düşürme, 7'si kabuk) |
| "Yenileme & Churn" (`raporlar.webp`) | ✅ **kapandı** — `.repgrid .rep` çapasıyla düşürüldü; şablon ızgarası 6 → 5 kart |
| **"Öğrenci Tutma" (`antrenor.webp`)** | ✅ **kapandı** — bu atomda adıyla sayılmayan **dördüncü** kalem. TASK-2.12 metin tarafını kapatmış, görüntü tarafını buraya devretmişti. Kart `%91` + "3 aylık tutma" + "Şubede en yüksek öğrenci tutma oranı" gösteriyordu; kelime tüm ürün kod tabanında **0** ve kalem `VERSIONS.md`'de v1.5'te. Yanındaki iki kardeşiyle (Haftalık Doluluk · Ciro Kırılımı, TASK-14.06'da düşmüştü) tam aynı sınıf |

**Düşürme kendi kendini doğrulayan bir kapıya dönüştü.** `AUDIT_ALLOW.antrenor`'daki artık ölü `'Öğrenci Tutma'` izin satırı v1'den **türetilerek** çıkarıldı (kopyalanmadı). Yan etki bilinçli: tamlama ad kalıbına uyuyor, yani düşürme sessizce başarısız olursa denetim onu ad sızıntısı sayar ve **üretim durur**. Sondayla ölçüldü: düşürme kuralı kaldırılınca hat `[antrenor] DENETİM BAŞARISIZ — ad sızıntısı: ["Öğrenci Tutma"]` verip **çıkış kodu 1** döndü.

**Kapanmayan — bu yüzden atom AÇIK:**
- **Kök neden duruyor.** `auditTexts()` hâlâ iki dallı; iddia sızıntısı için hiç dal yok. Bugün kapatılan kalemler denetimi görür hâle **getirmez** — bunu boş-kapsam sondası rakamla gösterdi: üç düşürme birden kaldırıldığında denetim **yalnız 1/3'ünü** yakalıyor ("Öğrenci Tutma" kırmızı), "Kampanyalar" tek sözcük olduğu için ve "Yenileme & Churn" `&` kalıbı bozduğu için **görünmez** — "Simge & Gizem"i kör eden mekanizmanın aynısı. Yani bugün düzeltilen iki kalemin arkasında kapı **yok**.
- Denetimin ad dalının tablodan beslenmesi → **TASK-2.14**; yasaklı iddia sözlüğü ve iddia dalı → **TASK-2.15** (atom orada kapanır).
- `DROP_NODES` artık yedi ekranın **dördünü** kapsıyor (önce üç): antrenör · raporlar · takvim · üye-telefon; kabuk kuralı ayrıca yedisine birden biniyor.

**TASK-2.14 (2026-09-23) — kök nedenin AD yarısı kapandı; atom AÇIK kalır (iddia dalı).**

Bu atomun "Koruma Önerisi"nin birinci maddesi uygulandı: *"denetim … eşleme tablosundaki her adın her parçasını … yasaklı sözcük listesi olarak arar. Tablo zaten adları biliyor; denetimin onları regex'ten değil tablodan okuması hem daha basit hem daha sağlam."*

- **Yasaklı küme türetiliyor, yazılmıyor:** `REPLACEMENTS`/`INITIALS`'ın **kaynak** tarafından 52 ad parçası + 13 avatar baş harfi. Tablonun **hedef** tarafı çıkarılır — denetim kendi çıktısını sızıntı sayamaz; çıkarma olmasaydı `Plus` (⊂ "Alpfit Plus") yedi ekranı birden kırmızıya çekerdi. Ad parçası **alt dize**, baş harfi **tam jeton** aranır.
- **Kalıp kaldırılmadı, ikincil dala indi.** Tabloya **hiç girmemiş** bir adı yalnız o dal görebilir ve TASK-2.13'ün kendi kendini doğrulayan kapısı ona dayanıyor. `AUDIT_ALLOW` **yalnız** o dalı kapatır; tablo dallarında izin yok (fail-closed — yanlış alarmın çaresi tabloyu düzeltmek).
- **Körlük kontrol gruplu ölçümle kapatıldı.** Bu atomun tarihsel tablosu geri kondu (TASK-2.13'ün eklediği üç çıplak-ad satırı çıkarıldı): **eski** denetim çıkış **0** verip *"sızıntı yok"* diyor ve `grup.webp`'i sızıntıyla üretiyor (`fe0ba19…` ≠ temiz `3a4caac…`) — yani atomun anlattığı arıza birebir yeniden üretildi; **yeni** denetim aynı girdide `«Gizem» ⊂ "Gizem Ö. · 17:00 · 60 dk"` deyip çıkış **1** veriyor, görsel ve `manifest.json` yazılmıyor. `"Simge & Gizem"` biçimi saf fonksiyon düzeyinde ayrıca çivilendi (`tests/iddia-metinleri.test.ts`).
- **Atomun bir teşhisi keskinleştirildi:** kök neden yalnız "kalıp paylaşımı" değildi — denetimin gördüğü **kütle de bayattı**. `values` avatar senkronundan **önce** toplanıyordu (ölçüldü: antrenör senkron öncesi 6 baş harfi, sonrası 0), yani baş harfi dalı bağlanınca hattın kendi düzeltmesi sızıntı sayılırdı. Toplama tüm mutasyonların sonuna alındı.
- **Ölçüm bir kalemi çürüttü:** `takvim.html:166`'daki `EK` avatarı **sızıntı değil** — tam da `<span class="nm">Melissa V.</span>` (→ **"Ege K."**) yanında duruyor, yani hedefin kendi baş harfi. `EK` kaynakta Ebrar Karakurt, hedefte `['MV','EK']`; iki harfli jetonun tanım gereği belirsizliği [B-044](B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md) kalem 3'ün kendi tespiti ve hedef tarafı kazanıyor.

**Kapanmayan — bu yüzden atom AÇIK:**
- **İddia dalı hâlâ YOK.** Yüzde, ciro, üstünlük, tarih ve yol-haritası kalemleri "kalıp kaçırdı" değil **hiç kontrol edilmiyor** (B-044 k.3: 21 dizge, 20'si kör). Yasaklı iddia sözlüğü ve iddia dalı → **TASK-2.15**; atom orada kapanır.
- **`AVATAR_SELECTOR`'a `.av` eklenmedi** — B-044 kalem 2'nin 25 düğümü haritanın dışında kalmaya devam ediyor; bu fazın kapsam dışı listesinde (eklemek çıktı görsellerini değiştirirdi).

**Yeniden ölçüm (audit-product 2026-09-22) — bir kalem KAPANDI, ikisi aynen açık.**

`public/product`, `research/lib` ve `render-product.mjs` 2026-09-13'ten beri **hiç değişmedi** (`git log --since=2026-09-13` → boş; ağaç temiz).

| Kalem | Hüküm |
|---|---|
| "Simge & Gizem" + ciro kartı (`sube.webp`) | ✅ **kapandı** — ekran `5da5bf1` (2026-09-12) ile hattan düşürüldü; `render-product.mjs:30` gerekçesi yazılı (QUICK-001) |
| **"Gizem Ö." (`grup.webp`)** | **AÇIK, gözle doğrulandı** — "Box · **Gizem Ö.** · 17:00 · 60 dk"; görsel `ProductStory.tsx:52` ile **ana sayfada** render ediliyor. Yasal metnin *"gerçek bir kişinin verisi gösterilmemektedir"* beyanı (`legal.ts:302`) çürümeye devam ediyor |
| "Kampanyalar" nav (yol haritası özelliği) | **AÇIK — 6/7 görselde** (`cockpit/takvim/grup/finans/antrenor/raporlar/uye.html` kaynaklarının her birinde 1 geçiş) |
| "Yenileme & Churn" | **AÇIK** — `../Alpfit.v1/demo/raporlar.html:242` `<h4>Yenileme &amp; Churn</h4>`; `raporlar.webp` bu kaynaktan üretiliyor |
