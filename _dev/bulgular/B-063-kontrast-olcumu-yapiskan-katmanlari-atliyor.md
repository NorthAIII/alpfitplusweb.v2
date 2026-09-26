# B-063: Kontrast ölçümü yapışkan ve sabit katmanları atlıyor — menü bağlantıları hiç ölçülmüyor

**Önem:** 🟡 | **Tip:** test-kapsamı / sahte yeşil | **Alan:** M6 — Kalite kapıları (M2 F2.3 ortak yerleşim yüzeyi)
**Kaynak:** research-phase (Faz 3) + verify-plan kararı | **Tarih:** 2026-09-23 · ikinci yüzü ölçüldü 2026-09-26 (TASK-3.26)
**Durum:** **Açık** — iki kez ve iki ayrı kullanıcı kararıyla ertelendi, ikisi de "Kalite kapıları otomatik" fazına: **2026-09-23** (verify-plan — ölçüm bu fazda kurulmaz) ve **2026-09-26** (TASK-3.26 — borcun ikinci yüzü `a11y`'yi sahte kırmızıya düşürdü, kapı **1 kalemle kapandı**, betiğe dokunulmadı). **Sayfa tarafı bu fazda ölçüldü ve temiz; kalan iş ölçüm betiğinin kendisi.**

## Gözlem

Faz 3 kontrast ölçümünü piksele taşıyor ve sayfayı **ekran ekran** geziyor (`0,9 × viewport` adımlarla), çünkü tek ekran ölçümü ölçülmüş ihlallerin hiçbirini görmüyor (1440 px'te ilk ekranda 0, sayfa tamamında 21).

Bu yöntemin kendi yan etkisi var: **yapışkan (`sticky`) ve sabit (`fixed`) katmanlar her adımda yeniden görünür ve koordinatları kayar.** Aynı düğüm onlarca kez, her seferinde farklı bir zeminin üstünde ölçülür. Araştırma prototipinde bu sınıf **ölçüm dışı bırakıldı** — 3 sayfada 335 örnek.

Bedeli somut: **Header'ın gezinme bağlantılarının kontrastı hiç ölçülmüyor.** Header her sayfada var, yani bu, sitenin her rotasında görünen tek yüzeyin ölçüm dışında kalması demek. Kapı bu sınıfı kırmızıya da düşürmez; yalnız "şu kadar şeyi ölçemedim" diye adıyla raporlar.

**Bu bir çözüm değil, borçtur** — araştırmanın kendi ifadesi. Doğru çözüm de orada yazılı: kapı bu sınıfı **ayrı bir turda, sayfa kaydırma sıfırdayken** ölçmeli; orada katman bir kez ve gerçek zemininin üstünde durur.

### İKİNCİ YÜZ — maske sızıntısı (TASK-3.26'da ölçüldü, 2026-09-26)

Borcun bugüne kadar adı konmamış tersi var ve **kapıyı ilk kez SAHTE KIRMIZIYA düşürdü.** Yukarıdaki yüz *"yapışkan katman ölçülmüyor"* der; bu yüz **yapışkan katmanın, altından geçen akan içeriğin ölçümünü BOZDUĞUNU** söyler.

Mekanizma: maske iki karenin piksel farkıdır ve **glifin kime ait olduğunu bilemez.** Ölçülen elemanın satır kutusunun içine düşen *yabancı* glifler de maskeye girer; zemin o yabancı elemanın zemininden okunur. Yani kapı, akan metnin mürekkebini yapışkan başlığın düğme zeminiyle eşleştirir — ekranda hiçbir yerde var olmayan bir çift.

Sonuç `/gecis`'te somut: *"Elle tutulan kayıtlar için birlikte bir öncelik…"* paragrafı `p02` **3,25** (gereken 4,5) basıyor. **Paragrafın kendi kusuru yok** — `text-muted` üstünde saf beyaz, gerçek değeri **7,05**.

**Ölçülen imza, sonraki turların tanıyabilmesi için:** `p02` düşük · `med` yüksek · ihlal veren pikseller **tek bir ekran kenarına** yığılmış · zemin renkleri o bölgede sayfaya ait değil.

## Kanıt (ikinci yüz)

Üç bağımsız ölçüm, hepsi yayın kopyasına (3100) karşı:

1. **İzolasyon A — katman kaldırıldı.** `header{display:none}` enjekte edildi → `p02` **3,25 → 7,05**, zemin `rgb(255,255,255)` ×6175, tek renk.
2. **İzolasyon B — yalnız katmanın METNİ kaldırıldı** (geometri, `backdrop-blur`, düğme zemini aynen yerinde; başlığın kendi metni **iki karede de** şeffaf): maske **2955 → 1861 px**, `p02` **3,25 → 6,98**. Düşen 1094 piksel, başlığın çağrı düğmesinin kendi etiketidir. Bu izolasyon tek değişkenlidir ve mekanizmayı adıyla gösterir.
3. **Genişlik kontrolü.** Aynı paragraf 390 px'te **7,05**, 320 px'te **6,80**. Kalem tek genişlikte, tek adımda ve yalnız adım ızgarası satırı düğmenin altına denk getirdiği için var — yani kırılgan bir sahte kırmızı.

**Devralınan okuma düzeltildi.** Gelen Kutusu'ndaki dört kayıt (`[TASK-3.10]` · `[TASK-3.11]` · `[TASK-3.12]` · `[TASK-3.13]`) aynı imzayı *"yüzen düğme metnin üstüne biniyor, kontrastı yiyor"* diye okuyordu. Opak bir katman için bu **yanlıştır**: altındaki metin hiç boyanmaz, dolayısıyla kaybedilen okunabilirlik değil **ölçümün doğruluğudur**. (Yarı saydam katmanda iki etki birlikte olabilir; ayırt eden İzolasyon B'dir.)

## Naif çarenin bedeli — ÖLÇÜLDÜ VE REDDEDİLDİ (TASK-3.26)

*"Örtülü adımda o elemanı ölçme"* yaması kurulup 16 rotada koşuldu (kaynağa dokunulmadan, scratchpad kopyasıyla):

| | taban | yama |
|---|---|---|
| TOPLAM SORUN | 6 | **5** (artefakt düştü, beş gerçek kalem rakamıyla durdu) |
| ölçülen eleman | 1834 | 1827 |
| gradyan metin | 19 (taban 19) | **18 — kapsam tabanının ALTINDA** |
| ekran dışı | 0 | **8** |
| atlanan (eleman, adım) | — | 171 |

Yani yama bir sahte kırmızıyı düşürüp **başka bir kırmızı** açıyor ve sekiz elemanı büsbütün ölçüm dışına atıyor: o sekizi hiçbir adımda başlığın altından çıkmıyor. Bu, borcun kendi Koruma Önerisi'nin neden **iki turlu** olduğunu ölçerek doğruluyor — akan turdan çıkarılan yüzeyin ikinci bir turda karşılanması gerekiyor.

## Kanıt

`_dev/phases/PHASE-3-ARASTIRMA.md` → Dikkat Edilecekler:

> **Yapışkan ve sabit katmanlar ekran ekran ölçümde her adımda yeniden görünür** ve koordinatları kayar; prototipte bu sınıf ölçüm dışı bırakıldı (3 sayfada 335 örnek) — **ama bu bir çözüm değil, bir borç:** Header'ın gezinme bağlantıları böylece hiç ölçülmüyor. Kapı bu sınıfı **ayrı bir pasta**, kaydırma sıfırdayken ölçmeli.

Fazın planı borcu **adıyla raporluyor ama ölçmüyor** (`tasks/TASK-3.04.md` → Alt Görev 4: *"sabit/yapışkan katmanlar ayrı bir sayıda tutulur ve bu bir borç olarak çıktıda adıyla görünür"*); ölçülemeyen "kalan" sınıf kırmızıya döner, yapışkan sınıf dönmez.

## Kök Neden Yönü

Ölçüm penceresi ile ölçülen katman tipi arasında uyumsuzluk: ekran ekran gezme **akan içerik** için doğru, **sabitlenmiş** içerik için yanlış. İki farklı yüzey tipi tek bir tarama modeline sıkıştırıldığında biri düşüyor.

Kardeş bulgular aynı kök nedeni gösteriyor — ölçüm sonucunun hangi kapsamda alındığını söylememesi: [B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) (açılan katmanlar hiç ölçülmüyor), [B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md) (rotaların yarısı gezilmiyor), [B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md) (kontrast yönteminin kör noktaları — bu faz onu kapatırken bu borcu açıyor).

## Koruma Önerisi

- Kapıya **ikinci bir ölçüm turu**: sayfa kaydırma sıfırdayken yalnız `position: sticky|fixed` katmanlar ölçülür, bir kez. Akan içerik turu bu sınıfı dışarıda bırakmaya devam eder; iki tur ayrı ayrı raporlanır ve ikisi de kırmızıya düşürebilir.
- **Akan turda yapışkan katmanın örttüğü piksel maskeye girmemeli** (ikinci yüz). Ölçüldü ki bunu tek başına yapmak yetmiyor — 8 eleman hiç ölçülmez oluyor ve gradyan tabanı düşüyor; yani iki madde **birlikte** kurulur, ayrı ayrı değil. Dışarıda bırakılan piksel sayısı da **adıyla raporlanmalı** ve eşiklenmeli, yoksa sessiz bir fail-open doğar.
- Ölçülemeyen sayının **sınıf adıyla** raporlanması korunur (Faz 3'te kuruluyor) — borç görünmez hâle gelmemeli.
- Kapsam eşiği bu turu da kapsasın: yapışkan katman sayısı sıfıra düşerse seçici körleşmiştir.

## Çözüm Kaydı

— **Çözülmedi ve kapanmadı.** Aşağıdaki iki erteleme kaydı birlikte okunur.

**İkinci erteleme kaydı (TASK-3.26, 2026-09-26) — borcun bedeli artık SAYISAL:** Bu turda borcun ikinci yüzü (maske sızıntısı) `a11y` kapısını **ilk kez sahte kırmızıya** düşürdü. Sayfa tarafı ölçülerek temizlendi — `/gecis`'in beş gerçek kontrast kalemi kapandı, kapı **6 → 1** — ve kalan 1 kalemin **sayfa kusuru olmadığı** üç ölçümle gösterildi (yukarı bak). Kestirme onarım koşuldu ve **yetmedi** (6→5 ama gradyan tabanı 19→18, 8 eleman ölçüm dışı), yani iki turlu çarenin zorunluluğu doğrulandı.

Karar kullanıcıya götürüldü ve **seçenek B** alındı, birebir:

> **(B) Kapı 1 kalemle kapanır.** Sayfada düzeltilecek bir şey olmadığı ölçüldüğü için kalem, ölçülmüş hâliyle açık bir kayıt olarak durur (B-063) ve faz kapanış değerlendirmesinde "beş ölçümün beşi yeşil" hedefi bu bir kalemle birlikte hükme bağlanır. Faz doğrudan UAT'a döner.

Yani `a11y` Faz 3'ü **`1 · çıkış 1`** ile kapatır ve bu bir eksik değil **kayıtlı bir karardır**; hüküm `review-phase` Adım 2'ye ait. Bu bulgu **açık kalır, arşivlenmez** — kapanmadan kapandı sayılmaz. Döküm: `tasks/archive/TASK-3.26.md` → Kapanış Gerekçesi.

**İlk erteleme kaydı (verify-plan, 2026-09-23):** Faz 3 planı gözden geçirilirken borç kullanıcıya getirildi. Karar: **bu fazda ölçüm kurulmaz**, borç kanvasta açık durur ve "Kalite kapıları otomatik" fazında kapanır. Gerekçe: fazın hedef cümlesi bu sınıf için yalnız *"ölçemediğini sayıyor"* diyor ve Faz 3 onu karşılıyor; ikinci turu eklemek fazın zaten en büyük task'ı olan TASK-3.04'ü kendi task'ına bölmeyi gerektirirdi. Bu bir "bilinçli tercih" değil **erteleme**dir — kapanmadan kapandı sayılmaz.
