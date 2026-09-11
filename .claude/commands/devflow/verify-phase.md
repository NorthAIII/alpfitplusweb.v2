# DevFlow — Kullanıcı Kabul Testi (Verify Phase / UAT)

Bu komut fazdaki tüm task'lar tamamlandıktan sonra, otomatik doğrulama sonuçlarını (CI, otomatik araçlar) inceler ve UAT senaryolarıyla çıktıları kullanıcıyla birlikte test eder.

**Kullanım:** `/devflow:verify-phase [N]` — N = faz numarası (belirtilmezse DURUM.md'den aktif fazı al)

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/MODULE-MAP.md` — feature-faz matrisi, versiyon bilgisi
2. Aktif faz dokümanı (`_dev/phases/PHASE-N.md`) — milestone, kapsam tartışması, feature listesi
3. `_dev/QUALITY.md` — değerlendirme eksenleri (UAT senaryolarının kapsamını belirler)

**Göreve Göre (Adım 1 kayıt süpürmesi ve test senaryoları için oku)**
- Bu fazın task dokümanları → faz dokümanındaki task listesinden task numaralarını al, `_dev/tasks/` ve `_dev/tasks/archive/` klasörlerinde `TASK-N.*` dosyalarını oku
- `_dev/BULGULAR.md` → Adım 1 süpürmesi ve Adım 6 çözüm teyidi için oku (varsa; yoksa atla): bu fazın kapsamına dokunan Gelen Kutusu notları + işaretsiz açık bulgular + bu fazla ilişkili işaretli bulgular
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili `_dev/modules/MX-*.md` dosyalarını oku (kabul kriterleri ve edge case'ler için)
- `_dev/tasks/TASKS-README.md` → **Adım 7 düzeltme task'ı açacaksa oku:** Durum Kodları'nın ve numara **biçiminin** kaynağı orasıdır (`templates/TASK.md`'nin `**Durum:**` KURAL'ı oraya işaret eder). Protokolün bu dosyayı okutan maddesi **koşulludur** (*Aktif task varsa*) — koşul tutmazsa dosya bağlamda olmaz.

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Otomatik Kontroller

Otomatik doğrulama sonuçlarını incele. 1a/1b'nin kapsamı yalnız bu fazın değişiklikleri değil, **repo'nun güncel açık alert/failure durumudur — kaynağı hangi faz veya oturum olursa olsun**. Önceki oturumlarda kayda geçirilip çözülmemiş sorun/uyarıları da süpür — CI/tool olmasa da: `_dev/BULGULAR.md`'ye bak (kayıt kuralı → CLAUDE.md → Çalışma Prensipleri "Gördüğün sorunu düşürme"): **bu fazın kapsamına dokunan** Gelen Kutusu notları + Açık Bulgular'daki işaretsiz kayıtlar (`→ Faz N`/`→ TASK-X.YY` işaretliler zaten rotada — süpürme dışıdır, çözüm teyitleri Adım 6'da). **Faza dokunmayan kutu notlarına dokunma** — onların triyajı audit-product uzlaştırmasının işidir (dar-faz korunur). Süpürdüklerini 1d'deki bulgu notlarına dahil et. Kanvas mezuniyeti: Gelen Kutusu notu inceleme sonucu zaten çözülmüşse satırı **sil**; düzeltme task'ına dönüşünce (Adım 7) yine **sil** — bilgi artık task dokümanındadır. Süpürdüğün işaretsiz atomlu bulgu inceleme sonucu zaten çözülmüş çıkarsa aynı teyitle mezun et (Çözüm Kaydı + Durum `✅ Çözüldü` + arşiv + satır silme — BULGULAR kuralı). Task'a bağlanan atomlu bulgu silinmez: index satırına ve atomun Durum'una `→ TASK-X.YY` işlenir, çözüm teyidiyle arşivlenir. Yeniden çalıştırmada (Adım 10 kuralı) süpürdüğün kaydı faz task listesindeki mevcut düzeltme task'larıyla eşleştir — zaten task'a dönüşmüş kayıt için yeni task açma.

Bazı doğrulamalar zaten çalışmıştır (CI, bot'lar), güvenlik taramasını (1c) sen çalıştırırsın; 1c bu genişlemenin dışındadır — kendi tarifindeki faz-penceresiyle sınırlı kalır. Kontroller:

**a) CI/CD workflow sonuçları:**
CI/CD workflow'larının güncel durumunu kontrol et — yalnız bu fazın commit'leri değil: hâlâ açık/başarısız olan her workflow, hangi fazdan veya oturumdan kalmış olursa olsun. Projenin kullandığı git provider ve toolchain'e göre uygun aracı (CLI, API, web UI) belirleyip sonuçlara eriş. Başarısız olanların log'larını incele, kök nedeni anla.

**b) Otomatik analiz araçları:**
Projede çalışan otomatik araçların (bağımlılık tarayıcı, security scanner, code quality bot vb.) çıktılarını gözden geçir. Uyarı, öneri veya açılmış PR varsa not al. Projede hangi araç kullanılıyorsa onu tespit et ve sonuçlarına bak.

**c) Güvenlik taraması:**
Bu fazın değişikliklerini güvenlik merceğiyle kendin tara. Önce **faz-penceresi diff'ini** çıkar — tarifi tek evdedir: **`.claude/commands/devflow/lib/faz-penceresi.md`'yi Read ile oku** (çağrı başına bir kez) ve bloğu orada yazıldığı gibi çalıştır. Ayrı dosyadır çünkü iki çağıranı vardır (bu adım + `review-phase` Adım 3) ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). Çapanın gerekçesi, kalıp guard'ları ve `Hiç faz commit'i bulunamadı` dalı orada yazılıdır.

Diff'i şu mercekle incele: injection (SQL / command / path traversal), auth/yetkilendirme atlaması, hardcoded secret, veri sızıntısı ve hassas veri loglama. Yalnız emin olduğun somut bulguları raporla — teorik/style bulgu yok. Sistem-seviyesi bak: tek başına güvenli görünen task değişiklikleri faz boyunca birikip etkileşime girince açık yaratabilir.

**d) Bulguları kaydet:**
Tespit ettiğin tüm bulguları (CI failure, bot önerisi, güvenlik taraması bulgusu) not al. Bu bulgular Adım 7'de (Düzeltme Task'ları) manuel test bulgularıyla birlikte değerlendirilecek. 1c'de bir baypas/açık yakaladıysan aynı sınıf-süpürme anlayışını diff üzerinde uygula — kardeş varyantları aynı taramada ara (anlayış → Adım 5a/5b'deki sınıf süpürmesi; UAT-tablosu mekaniği oraya aittir — 1c varyantları Adım 7'de task'ın Test Kriterleri'ne girer).

Süpürmenin ikinci tetiği bulgu değil **artefakt**: faz birden çok çağrı sitesince kullanılması beklenen yeni bir ortak kapı/yardımcı/invaryant tanıttıysa — **ya da mevcut bir ortak kapıyı/yardımcıyı/invaryantı yeni çağrı sitelerine yaymak fazın kendi işiyse** — onu **atlayan** çağrı sitesi kaldı mı diye bak. Arama yüzeyi diff hunk'ları değil **kaynaktır** — eski çağrılar diff'te görünmez: kapının doğduğu dosyayı bütün olarak oku, sonra korunan işlemin ham çağrılarını (eski fonksiyon/desen) ara. **En sık kaçan yer kapının kendi dosyasıdır**: kardeş modüller yeni yolu kullanır, oradaki eski çağrılar ham kalır. **Kapsanacak siteleri fazın listesi değil invaryantın kendisi belirler** — korunan işlemin çağrılarını say ve fazın dokunduklarıyla karşılaştır; fazın listesi zaten eksik olabilir, bu süpürmenin varlık nedeni odur. Sayım korunan işlemin çağrılarıyla sınırlıdır — süpürme o invaryantın sınıfını aşmaz, güvenlik evreninin tümüne açılmaz. Faz ne yeni bir artefakt üretti ne de mevcut birini yaymayı iş edindiyse bu soru düşer.

**Atlanan site için gösterilen istisnanın kendisi de okunur — tercih mi, iddia mı** (research-phase Adım 2 ayrımı; Adım 2c ile aynı ölçü): "bu siteyi bilerek dışarıda bıraktık / sonraki faza kaldı" bir **tercihtir**, süzer. "Orası zaten başka bir kapıyla korunuyor / o yol bu invaryanta tabi değil" bir **iddiadır** — süzen şey istisnanın söylenmiş olması değil iddianın **doğru olması**dır; sayım siteyi zaten önüne koymuştur, geriye o sitenin gerçekten korunup korunmadığını okumak kalır. Çürürse ya da ölçüm kurulamıyorsa süzmez, site Adım 7 triyajına gider. Aynı sınıf 1c'den de geldiyse tek bulguda birleştir.

**Önemli:** Projede CI/automated tool yoksa kullanıcıya kısaca bildir ve ilgili adımı (1a/1b) atla — 1c yalnız git gerektirir, her zaman çalıştırılır. Ama araştırma yapmadan "tool yok" diye geçme — projede gerçekten yoksa atla, varsa kontrol et. Read-only kontroller için kullanıcıya tek tek onay sorma, doğrudan çalıştır.

CI ciddi düzeyde başarısız olsa bile UAT'ye devam edilir; CI fix'i Adım 7'deki düzeltme task'ı setine dahil edilir.

### 2. Test Senaryolarını Çıkar

Şu kaynaklardan test senaryoları oluştur:

**a) Milestone kriterlerinden:**
Milestone'daki her kriter = en az bir test senaryosu. Cümlenin **altındaki not satırları kriterin parçasıdır**: `mekanizma: X → Y (araştırma/kapsam kararı)` varsa senaryo Y'yi sınar, X'i değil (kaynak: `research-phase` Adım 4 / `discuss-phase` Adım 6) — 2c'deki bayat-kriter ölçüsünün milestone tarafındaki karşılığı.

**b) Kapsam tartışmasındaki kararlardan:**
Kullanıcının aldığı her karar doğrulanabilir bir senaryoya dönüşür — ama **önce kararın türüne bak**: işi bu turun dışına çıkaran bir **tercih** senaryo doğurmaz, bir **iddia** ise senaryo iddiayı sınar; ayrımın ölçüsü ve kriterle kesiştiği hâl 2c'dedir, burada tekrarlanmaz.

**c) Feature kabul kriterlerinden:**
MODULE-MAP veya modül dokümanlarındaki kabul kriterleri. Bu fazın **kayıtlı bir kararı** (kapsam tartışması kararı, onaylı düzeltme task'ı) bir kriteri geçersizleştirdiyse senaryo karara göre yazılır — modül gövdesi bu anda henüz bayattır, hizalaması review-phase Adım 6'nın işidir; bayat kriterden ❌ üretme. Kararın kaydı yoksa sapma bulgudur, Adım 7 triyajına gider (review Adım 6 ile aynı ölçü). **Kaydın kendisi de okunur — tercih mi, iddia mı** (research-phase Adım 2 ayrımı): tercihin **erteleme** hâli ("yapmıyoruz / sonraya bıraktık") bu turda senaryo doğurmaz ama kriter de düşmez — review Adım 6'da 🟡 kalır; **kalıcı daralma** hâli ("bundan böyle böyle çalışacak / bilerek basit tutuyoruz") ertelenmiş değil **yürürlükte** bir davranıştır — yukarıdaki genel kural işler, senaryo karara göre yazılır ve gövdeyi review Adım 6 hizalar (aynı iki kol orada da ayrı ayrı yazılı: "Erteleme hizalama değildir"). "O kriter zaten başka yerde karşılanıyor" ise bir **iddiadır**: kriteri geçersizleştiren şey kaydın varlığı değil iddianın **doğru olması**dır — senaryo iddiayı sınar, kriteri sessizce düşürmez. Kayıt research'ten **sonra** doğduysa (onaylı düzeltme task'ı) hiç ölçülmemiştir; ürün zaten elinin altında olduğu için ölçümün en ucuz olduğu yer burasıdır

**d) Edge case'lerden:**
Task dokümanlarında belirtilen edge case'ler

**e) Adversarial senaryolardan:**
Bu fazda yaptıklarımızı kırmaya çalışan senaryolar. Faz bazlı bakış: "Bu fazda yaptıklarımızı kırmaya çalışsam ne olur?" Beklenmeyen girdiler, yetki dışı erişim denemeleri, hata durumları ve kurtarma, sınır değerleri. Checklist değil — fazın doğasına göre hangi adversarial senaryolar öne çıkıyorsa onları düşün.

**f) QUALITY.md eksenlerinden:**
QUALITY.md'deki değerlendirme eksenlerini sistematik gözden geçir; fazın doğasına göre hangileri bu faza dokunuyorsa kapsayan senaryolar üret — özellikle güvenlik dışı eksenler (performans, test kapsamı, bakım/sürdürülebilirlik, erişilebilirlik vb.). Bu (e)'deki adversarial bakışı ve Adım 1c'deki güvenlik taramasını **tekrarlamaz, tamamlar**: onların kapsamadığı kalite eksenlerinin UAT'de sistematik karşılığını verir. **Bir eksenin notunu fazın kayıtlı bir kararı geçersizleştirdiyse senaryo karara göre yazılır** — bayat eksen notundan ❌ üretme (ölçü 2c'dedir, burada tekrarlanmaz). Bu eksen özellikle risklidir: QUALITY'nin hizalaması **faz kapanışına** ertelenmiştir (`review-phase` Adım 5c) — yani verify anında eksen notu, fazın kararı onu geçersizleştirdiyse tanımı gereği henüz eskidir. (Modül gövdesi de aynı fazda hizalanır, Adım 6'da; ayrım eve dairdir, sıraya değil.)

**Ölçüm nesnesi üründür.** Yukarıdaki kaynaklar ürünün davranışını sınayan senaryolar üretir; fazın **kendi kayıt katmanı** (task/faz dokümanları, DURUM, BULGULAR ve önceki koşumların çıktıları) senaryo konusu değildir — ikiz sınırın öbür yarısı audit tarafında zaten yazılı (`lib/audit-kurallar.md` → Kod kalitesi ve ürün davranışı: kapsam dışı, faz penceresinde onlar için verify-phase). Bu, kod-satırı-sıfır bir düzeltmeyi körleştirmez: kriter ürünün **davranışına** bakıyorsa senaryo olur, düzeltmenin kendi **kaydına** bakıyorsa olmaz. Kayıtta gördüğün kusuru da düşürme — evi Adım 7 triyajıdır (kapsam-dışı → BULGULAR Gelen Kutusu); Adım 1 süpürmesi ve Adım 6 çözüm teyidi bu cümleden etkilenmez, onlar kanvas rotasının kendisidir.

**Milestone'u cümle cümle tara** — senaryo doğurmayan bir kriteri "test edilecek bir şey gibi durmuyor" diye sessizce atlama. Kriter fazın kendi kayıt katmanına bakıyorsa (pratik ayraç `_dev/`: oradaki doküman fazın kaydıdır, ürün ağacındaki doküman üründür — örn. bulgu fazında "faza alınan bulguların hepsi kapandı", "PHASE-N eşiğin altına iner") ondan senaryo doğmaması eksiklik değildir. Ama **kriter düşmez, evi değişir**: kapanışta ölçülür — review-phase Adım 2'nin milestone kontrolü, kuralın review tarafındaki evi. Fazın bulgu kayıtları ayrıca Adım 1 + Adım 6 rotasında yürür; boyut tipi bir kriterin **ölçüm anı** ise review-phase Adım 5b'dir, Adım 2 değil (faz dokümanı son hâlini Adım 5'te alır).

### 3. Senaryoları Faz Dokümanına Yaz

Test senaryolarını hemen faz dokümanına (`_dev/phases/PHASE-N.md`) yaz — sonuçlar henüz boş (⬜), metadata (Geçen/Kalan) Adım 6'da dolar. PHASE template'inin **kanonik `## UAT Sonuçları` başlığını** kullan (ayrı bir "UAT Senaryoları" ara başlığı yaratma — oturum Adım 3-6 arası kesilse bile doküman template'e uygun kalır):

```markdown
## UAT Sonuçları

**Tarih:** [test sırasında]
**Toplam Senaryo:** X | **Geçen:** — | **Kalan:** —

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ⬜ | — |
| 2 | [Senaryo 2] | ⬜ | — |
| ... | ... | ... | ... |
```

> Not sütunundaki `→ TASK-X.YY` işaretini bu adımda **sen yazmazsın** — task numarası Adım 7'de doğar ve oraya geri işlenir.

Bu erken yazım, context dolması gibi olağan dışı durumlarda senaryoların kaybolmasını önler.

**Dolu bir tablo bulursan sıfırdan kurma — devral.** İki hâl vardır; hangisinde olduğunu **aradaki turda düzeltme task'ı koşup koşmadığı** söyler:

- **Kesilen koşumun sürdürülmesi** (context doldu, oturum çöktü, kurtarma turu): satırlar **ve sonuçları** olduğu gibi kalır, boş (⬜) satırlardan sürdürülür — yeniden kurmak ölçülmüş sonuçları sessizce siler, erken yazımın koruduğu şey budur.
- **Düzeltme task'larından sonraki yeniden koşum** (Adım 10): kontroller **baştan** yapılır. **Sonuç** ⬜'ye döner · **Geçen/Kalan** `—` olur, **Toplam korunur** (küme değiştiyse yeniden sayılır) · **Not**'ta yalnız `→ TASK-X.YY` kalır (Adım 7'nin evi); önceki turun sorun açıklaması ve 5b'nin `kontrol:`/`ters-çevirme:` kanıt notları **silinir** — kanıt o turun ölçümüne bağlıdır, bayatını taşımak 5b'nin "kanıt notu olmayan yokluk-iddialı satır ✅ sayılmaz" hükmünü deler. Yenileri Adım 6'da yazılır.

Her iki hâlde de küme değiştiyse eksik senaryoyu **ekle**, mevcut satırları yeniden numaralandırma.

### 4. Test Modunu Sor

Senaryoları kullanıcıya göster ve test modunu sor:

```
📋 Bu faz için X test senaryosu hazırladım ve faz dokümanına yazdım.

Nasıl ilerleyelim?
  a) Manuel test — ben tek tek yönlendiririm, sen test edersin
  b) Otonom test — ben yapabildiğim testleri otonom çalıştırırım (kod, Playwright, API vb.),
     yapamadıklarım için sana sorarım
```

**Mod önceden verilmiş olabilir.** Orkestratörlü koşumda (`run-phase`) mod **`otonom`** varsayılanıyla gelir — o koşumun tanımı gereği; kullanıcı tur talimatında aksini demedikçe menü basılmaz. Araç/ortam envanteri MEMORY'den okunur, eksikse koşum açılışında bir kez sorulmuş olarak brief'te gelir. Envanterde **kapı düşmez, anı değişir**; modda **seçim sorulmaz, varsayılana bağlanır** — aşağıdaki "Kolu yine kullanıcı seçer" hükmü bu koşumda da doğrudur, seçim yalnız daha erken yapılmıştır. İki teşhis atlanmaz: envanter yine MEMORY'ye yazılır, ve otonom kolda **yeşille kapanmayacak** senaryolar adıyla bildirilir — kanalları yok sayılmaz, o turun raporuyla kullanıcıya ulaşır.

**Menüyü envanterle kur, örnekle değil.** (b)'de sayacağın araçlar **projede gerçekten kurulu** olanlardır — envanter MEMORY → "Ortam & Araç Notları"ndadır (`audit-product` Adım 2 ile aynı ev); orada yoksa kullanıcıya sor, var saymayla araç adı yazma — **ve cevabı oraya yaz**, yoksa aynı soru her fazın verify'ında yeniden sorulur ve o evin "tek seferlik" vaadi bu kulvarda geçersiz kalır. Yazarken kanca disiplinini gözet (zemin bilgisi sınıf A: değerin kendisi, kısa; gövde gerekiyorsa `_dev/memory/<slug>.md` atomuna iner, index'te tek pointer kalır) — **yazmadan önce `.claude/commands/devflow/lib/memory-sistemi.md`'yi Read et**; supap turu bu komutun işi değildir (aynı muafiyet: `audit-product` Adım 2). Aynı yerde senaryoların **sorumlu katmanına** bak: bir senaryonun sonucunu belirleyen katman (gerçek tarayıcı yerleşimi/odağı/girdisi, canlı serving zinciri, gerçek cihaz/saat/ağ) o araçların ölçtüğü katmanın **dışında** kalıyorsa — research'in "Dikkat Edilecekler"inde kayıtlıysa oradan okunur, task kriterinde `kanal: UAT` işareti varsa oradan — bunu (b)'nin yanında **adıyla** söyle: o sınıf otonom kolda **yeşille kapanmaz**, kanıtını Adım 5b'nin merdiveni kurar. Kullanıcıya söylerken **davranışı** anlat, katman terimini değil — "sürükleme sonrası odak gerçek tarayıcı ister, onu sana soracağım" (Prensip #13). **Ölçüt "mock var mı" değildir:** ikame katman senaryonun sonucunu belirleyen katmanı **içeriyorsa** ölçüm geçerlidir — in-process bir sunucuyla route mantığı ölçülür, aynı kurulumla önündeki proxy'nin kuralı ölçülmez. Kolu yine kullanıcı seçer; senin işin hangi senaryonun hangi kolda kapanabileceğini söylemektir.

*(Turların sayısını belirleyen şey fazın konusu değil bu ölçüdür: sorumlu katmanı dışarıda kalan senaryolar ilk turda otonom kapatılırsa tablo yeşil çıkar, kusurlar bir sonraki turda görünür ve faz düzeltme task'ı + ikinci tura düşer. Ölçünün kendisi fazın işiyse yeri burası değil `research-phase` Adım 3'tür — "o katmanı ölçen araç bu fazda kurulsun mu" sorusu orada karara bağlanır.)*

Kullanıcının tercihine — orkestratörlü koşumda brief'te verilen kola — göre Adım 5a veya 5b ile devam et.

### 5a. Manuel Test

Her senaryo için:

1. Kullanıcıya ne test edeceğini açıkla:
   ```
   🧪 Test 1/X: [Senaryo adı]
   Şunu dene: [Kullanıcının yapması gereken somut adımlar]
   Beklenen sonuç: [Ne olması gerekiyor]
   ```

2. Kullanıcıdan sonuç bekle:
   - **Geçti** → bir sonraki senaryoya geç
   - **Kaldı** → sorunu detaylı sor, analiz et
   - **Kısmen** → çalışan ve çalışmayan kısımları ayır ve tabloda **iki ayrı satıra** böl (çalışan ✅, çalışmayan ❌ + Adım 7 rotası). UAT tablosunda "Kısmen" diye bir sonuç yoktur — tek satırda bırakmak hem Geçen/Kalan sayımını bozar hem de sonraki okuyucuya senaryo karşılanmış gibi görünür

3. Başarısız senaryolar için:
   - Sorunu analiz et (kullanıcıdan detay al)
   - Kök nedeni tespit etmeye çalış
   - **Adversarial/güvenlik senaryosu kaldıysa sınıfı süpür:** bulgu tek varyant değil, bir sınıfın ilk örneğidir. Sınıfı türet ve varyasyon eksenlerini **aynı turda** test et — eksen örnekleri: encoding türevleri, HTTP-metot yüzeyi, üretim-vs-serve tarafı (örnektir, sınır değil; kapsam fazın penceresidir, güvenlik evreninin tümü değil). Süpürülebilen varyantı otonom koş (kod/araç), gerekeni kullanıcıya yönlendir; türetilen varyantları UAT tablosuna satır olarak ekle (Adım 3'ün erken yazımı tur ortasında da geçerli) — yeniden koşumda sınıfın regresyon ağı olurlar.
   - Başarısız senaryoyu ve analizi not al (düzeltme task'ı Adım 7'de oluşturulacak)

### 5b. Otonom Test

Her senaryoyu otonom olarak çalıştırmaya çalış:

**Yapılabilecek testler (doğrudan çalıştır):**
- Kod çalıştırma (unit test, integration test, script)
- Playwright / browser otomasyon testleri
- API çağrıları (curl, fetch)
- CLI komutları ve çıktı doğrulama
- Dosya/veritabanı durumu kontrolü

**Yapılamayan testler (kullanıcıya sor):**
- Görsel doğrulama gerektiren (UI'ın "doğru görünüyor mu?")
- Fiziksel cihaz gerektiren
- Üçüncü parti servis/hesap gerektiren (kullanıcı credential'ları)
- Subjektif değerlendirme gerektiren (UX, kullanılabilirlik)

**Akış:**
1. Her senaryoyu sırayla al
2. Otonom çalıştırılabiliyorsa çalıştır, sonucu kaydet. **Otonom kolda probe'u yazan da yargılayan da sensin** (5a'da hakem kullanıcıdır): bir şeyin *olmadığını/engellendiğini* iddia eden senaryo — kapı, yetki, "sızıntı yok", "erişilemiyor" — yalnız yeşil olduğu için kanıtlanmış sayılmaz. **İkinci hâl sorumlu katmandır:** senaryonun sonucunu belirleyen katman probe'un koştuğu katmanın **dışındaysa** (Adım 4'te işaretlediysen o sınıf; işaretlemediysen burada görürsün) oradaki yeşil o katman hakkında hiçbir bilgi taşımaz — bu hâlde iddianın olumlu ya da olumsuz olması fark etmez. Ölçü `run-task` Adım 3'ünkiyle aynıdır: bozukluk **kusurun gerçekte oluşacağı yerde** yaratılır, yanlış katmanı okuyan kapıya kırmızı hiç gelmez. ✅ yazmadan önce yeşili sına:
   - **Kontrol koş.** Aynı yolla **başarması gereken** bir çağrı yap ve başardığını gör (denetimdeki "boş grep tek başına kanıt değildir" ilkesinin UAT karşılığı). Kontrolü UAT tablosunun `Not` sütununa yaz — `kontrol: <ne koşuldu> → <görülen sonuç>` (örn. `kontrol: geçerli token'la aynı uç → 200`); **kanıt notu olmayan yokluk-iddialı satır ✅ sayılmaz** — bu hüküm aşağıdaki dallar için de geçerlidir. **Kontrol koşumu ikinci hâli delmez** — kontrol de aynı katmanda koşar, yani sorumlu katman dışarıdaysa yeşili de kırmızısı da bilgi taşımaz; o hâlde doğrudan bir alt basamağa geç.
   - **Kontrol başarması gerekirken o da engelleniyor/boş dönüyorsa** probe sistemi hiç sürmüyordur: sonuç ✅ değil **❌ (doğrulanamadı: test sürmüyor)** — bulgu üründe değil testtedir, olağan Adım 7 rotasına girer.
   - **Kontrol kurulamıyorsa — ya da kurulup geçtiği hâlde senaryonun sorumlu katmanına hiç dokunmuyorsa** — bir üst basamak, korunan kararı — ikinci hâlde senaryonun dayandığı davranışı — **saf karar noktasında** geçici ters çevirip kırmızıyı görmektir — yalnız **geri alınabilir ve iz bırakmayan** yerde: kalıcı yan etkili hiçbir noktaya (append-only kayıt/tablo, dış servis çağrısı, migration), **ortam/serving katmanına** (geri alma git'le yapılamaz) ve **prod'a** dokunulmaz. Ters çevirme ile geri alma **aynı adımda kapanır**; 5b'den çıkmadan `git status` ile ağacın sınama öncesi hâline döndüğünü teyit et. İzi `Not` sütununa yaz (`ters-çevirme: <ne kapatıldı> → <görülen kırmızı> → geri alındı`). Bu geçici sınama düzeltme değil **kanıttır**, "bu oturumda kod düzeltme yapılmaz" kuralını delmez. **Ters çevirmede kırmızı gelmiyorsa** probe o katmanı hiç görmüyordur: ✅ yazma, senaryoyu 3. maddeye düşür (manuel kol); kullanıcı da doğrulayamıyorsa sonuç **❌ (doğrulanamadı: probe kör)**. Kör probe'un kendisi ayrıca **bulgudur** — hiç kırmızı üretemeyen test yeşil görünür ama hiçbir şey ölçmez (`run-task` Adım 3 → boş kapsam); senaryo manuel kolda geçse bile onu Adım 7 triyajına taşı.
   - **İkisi de kurulamıyorsa** senaryo otonom kolda kapanmaz: ✅ yazma, 3. maddeye düşür (kullanıcıya manuel doğrulat). Kullanıcı da doğrulayamıyorsa sonuç **❌ (doğrulanamadı: kanıt kurulamadı)**
3. Otonom çalıştırılamıyorsa kullanıcıya sor: ne yapması gerektiğini açıkla, sonucu al. Sonuç kısmiyse (otonom koşum da dahil) 5a'daki kural aynen geçerlidir: tabloda **iki ayrı satır**, "Kısmen" diye bir sonuç yoktur
4. Başarısız senaryolar için kök neden analizi yap ve not al (düzeltme task'ı Adım 7'de oluşturulacak). **`doğrulanamadı` sonuçları bu maddeyi tetiklemez** — süpürülecek ürün sınıfı yoktur, önce kanıt/probe kurulur; sınıf sorusu onarım sonrası turda sorulur. **Adversarial/güvenlik senaryosu kaldıysa sınıfı süpür** — bulgu bir sınıfın ilk örneğidir: sınıfı türet, varyasyon eksenlerini (encoding türevleri, HTTP-metot yüzeyi, üretim-vs-serve tarafı — örnektir, sınır değil) aynı turda koş, türetilen varyantları UAT tablosuna satır olarak ekle (kapsam fazın penceresi; Adım 3'ün erken yazımı tur ortasında da geçerli)

Her test sonucunu kullanıcıya bildir:
```
🧪 Test 1/X: [Senaryo adı] — ✅ Geçti (otonom)
🧪 Test 2/X: [Senaryo adı] — ❌ Kaldı (otonom) — [kısa hata açıklaması]
🧪 Test 3/X: [Senaryo adı] — 🔍 Manuel gerekli: [kullanıcıya ne yapacağını söyle]
```

### 6. Sonuçları Faz Dokümanına Güncelle

Adım 3'te aynı `## UAT Sonuçları` başlığı altına yazılan tabloyu sonuçlar ve metadata (Toplam/Geçen/Kalan) ile doldur — başlık yeniden adlandırılmaz:

```markdown
## UAT Sonuçları

**Tarih:** [tarih]
**Toplam Senaryo:** X | **Geçen:** Y | **Kalan:** Z

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ✅ Geçti | — |
| 2 | [Senaryo 2] | ❌ Kaldı | [Sorun açıklaması] |
| 3 | [Senaryo 3] | ✅ Geçti | — |
| ... | ... | ... | ... |
```

Ayrıca Adım 1'de bulunan otomatik kontrol bulgularını da kayda al (kısa özetle; hangi düzeltme task'ına gittiğine ya da kapsam-dışı olarak BULGULAR Gelen Kutusu'na düştüğüne işaret et — ev seçimi Adım 7 triyajında). **Not sütununu bu adımda boş bırakman normaldir:** task numarası henüz yoktur, işareti Adım 7 tablo satırına geri yazar (orada adıyla emredilmiştir) — sen yalnız satırı ❌ olarak ve sorun açıklamasıyla kur.

**Bulgu çözüm teyidi (BULGULAR varsa):** Bu fazla ilişkili işaretli bulguların (`→ Faz N` / `→ TASK-X.YY`) düzeltmesi bu fazda yapılmış ve ilgili senaryo/kontrol ✅ geçtiyse çözüm teyit edilmiştir — senaryo/kontrol doğmayan (kod-satırı-sıfır) düzeltmede teyit kanıtı task arşivi/commit'tir (BULGULAR kuralı: "Çözüm teyidi kanıt ister"). Teyitliyse: atomun Çözüm Kaydı'nı doldur, Durum'unu `✅ Çözüldü` yap, atomu `bulgular/archive/`e taşı, index satırını sil (BULGULAR kuralı). Teyit edilemeyen işaretli bulgu olduğu gibi bekler. Çözüm Kaydı **kapanış kapsamıyla** yazılır (BULGULAR kuralı): bulgunun sınıfından sayılmamış bir yüzey kaldıysa onu kayda yaz ve **Adım 7 triyajına taşı** — arşiv donuktur, orada bırakılan kalan iş kimseye görünmez.

### 6b. Faz Dokümanı Boyut Kontrolü (kırmızı çizgi kapısı)

UAT senaryoları + sonuçları eklendiği için faz dokümanı bu oturumda büyüdü. Faz **hâlâ aktifken** tek-okuma sınırını koru (detay: CLAUDE.md → Doküman Disiplini → Boyut ve Bölünme):

- **Tarif tek evdedir — `.claude/commands/devflow/lib/boyut-kapisi.md`'yi Read ile oku ve izle** (çağrı başına bir kez): ölçüm komutu, üçlü teşhis, kulvar (Onay Ölçütü — kurallı kesim sorulmaz, uygulanır ve raporlanır), ikili kayıt (KURAL yorumu + `accept-size`) ve iki özel hâl (eşik altı · canvas yok) orada tanımlıdır, burada tekrarlanmaz.
- **Bu adıma özgü olan:** bu oturumda büyüten şey UAT senaryoları + sonuçlarıdır; şişme hâlinde tipik kaynak, icra detayının ya da çalışma notunun Task Listesi'ne sızmasıdır (doğru ev `tasks/TASK-N.md`). **`accept-size` bu adımda çağrılmaz** — Adım 9'un ilk işidir; Adım 7 düzeltme task'ı çıkarırsa bu dokümana hem `→ TASK-X.YY` işaretini hem Task Listesi satırını daha yazacaktır. Bu bir doküman-hijyen adımıdır — kaynak kodu/test davranışını değiştirmez, "bu oturumda kod düzeltme yapılmaz" kuralıyla çelişmez.

### 7. Düzeltme Task'ları (Varsa)

Şu kaynaklardan gelen bulgular değerlendirilir:
- **Adım 1**'de tespit edilen otomatik kontrol bulguları (CI failure'ları, bot önerileri, güvenlik taraması bulguları vb.)
- **Adım 6**'daki başarısız UAT senaryoları
- **Adım 1 ve 6**'daki bulgu çözüm teyidinde görülen **kapsanmayan yüzeyler** — kapanan bulgunun sınıfından sayılmamış kalan (BULGULAR kuralı: "Kapanış kapsamıyla yazılır"); fazın az önce kapattığı sınıfın devamı oldukları için tipik ev düzeltme task'ıdır, ölçüt yine aşağıdaki triyaj
- Fazın **kayıt katmanında** görülen kusurlar (Adım 2 glossu) — senaryo doğurmazlar; ürün davranışına dokunmadıkları için tipik ev Gelen Kutusu'dur

**Önce kapsam triyajı — her bulgu için evini seç.** Ölçüt kapsamdır, çaba değil: "küçük/kolay" bir kapsam-içi bulgu ertelenemez, "büyük/zor" bir kapsam-dışı bulgu task'laştırılmaz.
- **Kapsam-içi** → düzeltme task'ı (aşağıda). Başarısız UAT senaryoları ve 1c faz-penceresi bulguları tanım gereği kapsam-içidir; **CI failure da her zaman kapsam-içidir** — kırmızı CI repo sağlığıdır, kaynağı hangi faz olursa olsun ertelenmez.
- **Kapsam-dışı** (fazın milestone kriterlerine, UAT senaryolarına veya faz-penceresi diff'ine dokunmuyor — örn. başka fazdan kalma bot önerisi/uyarısı) → task AÇMA, fazı bekletme: `_dev/BULGULAR.md` Gelen Kutusu'na kaynak işaretli tek satır düş (`- [PHASE-N] ...`; kural → CLAUDE.md "Gördüğün sorunu düşürme") ve Adım 10 raporunda belirt. Düşürmeden önce kanvasa bak: aynı bulgu zaten kayıtlıysa (önceki koşumun kutu satırı ya da mevcut bulgu atomu) yeni satır düşme — yeniden-koşumlar çift kayıt üretmesin, mevcut kaydı raporda an. Bulgu kaybolmaz — kutu notunu audit-product uzlaştırması triyaj eder (atomlaşırsa bulgu fazına girebilir), kapsamına dokunan sonraki fazın verify süpürmesi devralır; faz temiz kapanır.

**`doğrulanamadı` kaleminde triyaj kanıtın nerede eksik olduğuna bakar.** Eksik olan bu fazın kendi probe'uysa (yanlış katmanda kurulmuş, kör kalmış) kapsam-içidir → düzeltme task'ı. O katmanı ölçen araç projede **hiç yoksa** ve kullanıcı da doğrulayamıyorsa eksik fazın değil projenin altyapısındadır → kapsam-dışıdır, Gelen Kutusu'na düşer ve faz onun için bekletilmez. Senaryo yine de düşmez: etkilediği milestone kriteri review-phase Adım 2'nin kapanış-notu rotasına girer. Aynı ayrım 5b'den gelen **kör probe** kalemi için de geçerlidir — senaryo manuel kolda geçmiş olsa bile.

**Task oluştururken — önce oku:** `.claude/commands/devflow/templates/TASK.md`

**Numara = faz içindeki en büyük YY + 1, `_dev/tasks/archive/` dahil sayılır** (kural evi `plan-phase`; burada tekrarlanmasının nedeni numaranın **bu adımda doğması** ve arşiv sayılmazsa çakışan iki `TASK-X.YY`'nin geri alınamaz olmasıdır — TASKS-README yalnız numaranın **biçimini** taşır, tahsisi değil).

- **Evini geriye işle (Adım 6'nın açık bıraktığı halka):** task numarası burada doğduğu için Adım 6 onu yazamamıştı. Task'ı oluşturur oluşturmaz (a) UAT Sonuçları tablosunda ilgili ❌ satırının **Not sütununa** `→ TASK-X.YY` yaz; (b) **Adım 1 ya da 6'nın** bulgu çözüm teyidinde **kapsanmayan yüzey** olarak kayda geçip arşive taşınan bir kalem bu task'a bağlandıysa, **task'ın kendi Test Kriterleri'ne** işle ve kaynak bulguyu orada **numarasıyla** an (`B-0NN`) — arşiv donuktur, **index satırı ise mezuniyeti yapan adımda silinmiştir** (BULGULAR kuralı: arşiv index'te ASLA listelenmez), yani geriye yazılacak tek ev task'ın kendisidir. Bu iki işaret yazılmadan Adım 8'e geçme — aksi halde faz ❌ satırı evsiz kapanır.
- Task dokümanını template'e uygun yaz
- Sorunun detaylı açıklamasını ekle (otomatik bulgu mu, UAT failure mı belirt)
- Beklenen davranışı yaz
- Sınıf süpürmesinden gelen bulguda task tek varyantı değil **sınıfı** kapatır — süpürülen varyantlar task'ın Test Kriterleri'ne girer
- Faz dokümanındaki task listesine ekle
- Bulgu Adım 1 süpürmesinden geldiyse BULGULAR'ı güncelle (Adım 1 kuralı): Gelen Kutusu notuysa satırı sil (evi artık bu task), atomlu açık bulguysa index satırına ve atomun Durum'una `→ TASK-X.YY` işle

### 8. DURUM.md Güncelle

- UAT ve otomatik kontrol sonuçlarını kısa özetle
- Düzeltme task'ları varsa: **Task Durumu (Aktif Faz)** tablosuna ⬜ olarak ekle, ilkini **Aktif Task** yap, **Adım** alanını `task` olarak güncelle (`run-task`'ın "hepsi ✅" savunma kontrolü düzeltme task'ını görebilsin diye tabloya ekleme şart)
- Tüm kontroller geçtiyse **Adım** alanını `review` olarak güncelle — Adım 7'nin **kapsam-dışı** ilan ettiği kalemler (Gelen Kutusu'na düşen bulgular ve ölçülemeyen senaryolar) BULGULAR'da sırasını bekler, faz kapanışını etkilemez

### 9. Git Commit & Push

**Önce 6b'nin devrettiği boyut kabulü (varsa)** — komut ve gerekçesi `lib/boyut-kapisi.md` → "`accept-size`'ın zamanı"ndadır (6b'de zaten okundu). Yazıldıysa `_dev/.audit/canvas.tsv` aşağıdaki commit'e girer; ayrı commit atma.

⚠️ **Adım 1 ya da 6 bir bulgu atomunu `bulgular/archive/`'e taşıdıysa: taşıma düz `mv`'dir (`git mv` değil) ve commit'e ESKİ yolu da stage et** — silme index'e kendiliğinden yazılmaz; yalnız yeni yolu stage edersen HEAD'de iki kopya kalır ve silme kalıcı olarak stage'siz görünür (kanon: CLAUDE.md → Paralel Oturum Farkındalığı).

Tüm doküman değişikliklerini commit & push yap:
```
docs(phase-N): UAT — user acceptance testing completed
```

### 10. Sıradaki Adımı Öner

**Tüm kontroller geçtiyse:**
```
✅ Verify-phase tamamlandı. Otomatik kontroller ve UAT'den geçildi.
(varsa) 🔍 X senaryo ölçülemedi ([hangileri]) — o katmanı ölçen araç projede yok; faz kapanışını etkilemez.
(varsa) 📥 X kapsam-dışı sorun kaydedildi ([tek satırla ne oldukları]) — faz kapanışını etkilemez, sıraları geldiğinde ele alınır.
📋 Sıradaki adım: /devflow:review-phase
   → Faz review ve retrospektif için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**Düzeltme task'ları varsa:**
```
⚠️ Verify-phase tamamlandı. Otomatik kontroller ve UAT'den X bulgu — Y düzeltme task'ı oluşturuldu.
(varsa) 📥 Z kapsam-dışı sorun kaydedildi ([tek satırla ne oldukları]) — faz kapanışını etkilemez, sıraları geldiğinde ele alınır.
📋 Sıradaki adım: /devflow:run-task
   → Düzeltme task'larını çalıştırmak için yeni bir oturum başlat.
   → Düzeltmeler tamamlandıktan sonra **/devflow:verify-phase yeniden çalıştırılır** — bütün kontroller (otomatik + UAT) baştan yapılır, sadece daha önce başarısız olanlar değil.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

Son satır iki dalda da yazılır; kuralı, önekleri (`engel:` / `önerilir:`) ve ambleminin hesabı **CLAUDE.md → Oturum Kapanışı**'dadır. Engelleyen bir kalem varsa `📋` satırı yukarıdaki komut değil, o işi yapan komut olur (kanonun terfi kuralı).

**`🔍` satırı atlanamaz — "geçildi" tek başına yalan söyler.** Adım 7 bir `doğrulanamadı` kalemini kapsam-dışı ilan ettiğinde (o katmanı ölçen araç projede hiç yok) senaryo UAT tablosunda **`❌ doğrulanamadı` olarak durur** ve düzeltme task'ı doğurmaz — yani ilk dal seçilir. Ama o dalın açılış cümlesi "Otomatik kontroller ve UAT'den geçildi" der; ölçülememiş bir senaryo varken bu cümle tek başına kalırsa faz, sınanmamış bir yüzeyi sınanmış gibi kapanır. Sayı ve hangileri oldukları `🔍` satırında görünür kalır; ölçüm boşluğunun kendisi kanvasa `📥` ile ayrıca düşmüştür (Adım 7) ve kriteri etkiliyorsa review-phase Adım 2'nin kapanış-notu rotasına girer.

**Adım 7'nin kapsam-dışı bulguları bu satıra girmez** — evleri BULGULAR'dır, sayıları da `📥` satırında zaten duruyor; satıra ikinci kez yazmak aynı işi iki yerde gösterir. Satırın kaynağı **kanvasın devralmadığı** işlerdir: kullanıcı-tarafı bir hamle, taze oturum isteyen bir denetim önerisi, ya da bu oturumda dile getirilmiş ama yapılamamış bir iş.

---

## Önemli Kurallar

- Bu oturumda kod düzeltme yapılmaz — sadece test ve düzeltme task'ı oluşturma
