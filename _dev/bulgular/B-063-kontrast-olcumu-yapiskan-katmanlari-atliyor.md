# B-063: Kontrast ölçümü yapışkan ve sabit katmanları atlıyor — menü bağlantıları hiç ölçülmüyor

**Önem:** 🟡 | **Tip:** test-kapsamı / sahte yeşil | **Alan:** M6 — Kalite kapıları (M2 F2.3 ortak yerleşim yüzeyi)
**Kaynak:** research-phase (Faz 3) + verify-plan kararı | **Tarih:** 2026-09-23
**Durum:** Açık — **bilinçle ertelendi** (kullanıcı kararı, verify-plan 2026-09-23) → "Kalite kapıları otomatik" fazı

## Gözlem

Faz 3 kontrast ölçümünü piksele taşıyor ve sayfayı **ekran ekran** geziyor (`0,9 × viewport` adımlarla), çünkü tek ekran ölçümü ölçülmüş ihlallerin hiçbirini görmüyor (1440 px'te ilk ekranda 0, sayfa tamamında 21).

Bu yöntemin kendi yan etkisi var: **yapışkan (`sticky`) ve sabit (`fixed`) katmanlar her adımda yeniden görünür ve koordinatları kayar.** Aynı düğüm onlarca kez, her seferinde farklı bir zeminin üstünde ölçülür. Araştırma prototipinde bu sınıf **ölçüm dışı bırakıldı** — 3 sayfada 335 örnek.

Bedeli somut: **Header'ın gezinme bağlantılarının kontrastı hiç ölçülmüyor.** Header her sayfada var, yani bu, sitenin her rotasında görünen tek yüzeyin ölçüm dışında kalması demek. Kapı bu sınıfı kırmızıya da düşürmez; yalnız "şu kadar şeyi ölçemedim" diye adıyla raporlar.

**Bu bir çözüm değil, borçtur** — araştırmanın kendi ifadesi. Doğru çözüm de orada yazılı: kapı bu sınıfı **ayrı bir turda, sayfa kaydırma sıfırdayken** ölçmeli; orada katman bir kez ve gerçek zemininin üstünde durur.

## Kanıt

`_dev/phases/PHASE-3-ARASTIRMA.md` → Dikkat Edilecekler:

> **Yapışkan ve sabit katmanlar ekran ekran ölçümde her adımda yeniden görünür** ve koordinatları kayar; prototipte bu sınıf ölçüm dışı bırakıldı (3 sayfada 335 örnek) — **ama bu bir çözüm değil, bir borç:** Header'ın gezinme bağlantıları böylece hiç ölçülmüyor. Kapı bu sınıfı **ayrı bir pasta**, kaydırma sıfırdayken ölçmeli.

Fazın planı borcu **adıyla raporluyor ama ölçmüyor** (`tasks/TASK-3.04.md` → Alt Görev 4: *"sabit/yapışkan katmanlar ayrı bir sayıda tutulur ve bu bir borç olarak çıktıda adıyla görünür"*); ölçülemeyen "kalan" sınıf kırmızıya döner, yapışkan sınıf dönmez.

## Kök Neden Yönü

Ölçüm penceresi ile ölçülen katman tipi arasında uyumsuzluk: ekran ekran gezme **akan içerik** için doğru, **sabitlenmiş** içerik için yanlış. İki farklı yüzey tipi tek bir tarama modeline sıkıştırıldığında biri düşüyor.

Kardeş bulgular aynı kök nedeni gösteriyor — ölçüm sonucunun hangi kapsamda alındığını söylememesi: [B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md) (açılan katmanlar hiç ölçülmüyor), [B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md) (rotaların yarısı gezilmiyor), [B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md) (kontrast yönteminin kör noktaları — bu faz onu kapatırken bu borcu açıyor).

## Koruma Önerisi

- Kapıya **ikinci bir ölçüm turu**: sayfa kaydırma sıfırdayken yalnız `position: sticky|fixed` katmanlar ölçülür, bir kez. Akan içerik turu bu sınıfı dışarıda bırakmaya devam eder; iki tur ayrı ayrı raporlanır ve ikisi de kırmızıya düşürebilir.
- Ölçülemeyen sayının **sınıf adıyla** raporlanması korunur (Faz 3'te kuruluyor) — borç görünmez hâle gelmemeli.
- Kapsam eşiği bu turu da kapsasın: yapışkan katman sayısı sıfıra düşerse seçici körleşmiştir.

## Çözüm Kaydı

—

**Erteleme kaydı (verify-plan, 2026-09-23):** Faz 3 planı gözden geçirilirken borç kullanıcıya getirildi. Karar: **bu fazda ölçüm kurulmaz**, borç kanvasta açık durur ve "Kalite kapıları otomatik" fazında kapanır. Gerekçe: fazın hedef cümlesi bu sınıf için yalnız *"ölçemediğini sayıyor"* diyor ve Faz 3 onu karşılıyor; ikinci turu eklemek fazın zaten en büyük task'ı olan TASK-3.04'ü kendi task'ına bölmeyi gerektirirdi. Bu bir "bilinçli tercih" değil **erteleme**dir — kapanmadan kapandı sayılmaz.
