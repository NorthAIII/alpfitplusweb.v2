# DevFlow — Faz Review, Retrospektif ve Kalite Kontrol (Review Phase)

Bu komut faz tamamlandıktan sonra bütüncül değerlendirme, retrospektif ve kalite kontrol yapmak için kullanılır.

**Kullanım:** `/devflow:review-phase [N]` — N = faz numarası (belirtilmezse DURUM.md'den aktif fazı al)

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/MODULE-MAP.md`
2. `_dev/QUALITY.md`
3. Aktif faz dokümanı (`_dev/phases/PHASE-N.md`) — tüm bölümler (kapsam, araştırma, task listesi, UAT)
4. `_dev/PHASES.md` — faz durum tablosu ve Sıradaki Fazlar (Adım 6 fazı ✅ işaretler ve geçiş notu yazar; promosyon-yapma guard'ı mevcut tabloyu görmeyi gerektirir)

**Göreve Göre (review sırasında oku)**
- Bu fazın task dokümanları → faz dokümanındaki task listesinden task numaralarını al, `_dev/tasks/archive/` klasöründe `TASK-N.*` dosyalarını oku
- `_dev/tasks/TASKS-README.md` → **Adım 7 düzeltme task'ı açacaksa oku:** Durum Kodları'nın ve numara **biçiminin** kaynağı orasıdır (`templates/TASK.md`'nin `**Durum:**` KURAL'ı oraya işaret eder; Adım 7 DURUM tablosuna da ⬜ yazdırır). Protokolün bu dosyayı okutan maddesi **koşulludur** (*Aktif task varsa*) — koşul tutmazsa dosya bağlamda olmaz.
- Değişen kaynak kod dosyaları → task dokümanlarının "Etkilenen Dosyalar" bölümlerinden değişen dosyaları tespit et ve incele
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili `_dev/modules/MX-*.md` dosyalarını oku — Adım 6'nın ✅ işareti "kabul kriterleri karşılandı" demektir, kriterin kendisine bakmadan vurulamaz
- Önceki faz dokümanı → önceki faz varsa `_dev/phases/PHASE-(N-1).md` dosyasının "Retrospektif → Sonraki Faz İçin Öneriler" bölümünü oku ve önerilerin bu fazda uygulanıp uygulanmadığını kontrol et
- Fazda önemli bir karar çıktıysa `_dev/docs/DECISIONS.md`'yi oku — özellikle eski bir kararı `Superseded` etiketlemek gerekiyorsa mevcut girdiyi bulmak için (saf newest-on-top append okuma gerektirmez)
- `_dev/BULGULAR.md` → Adım 2'de kayıt-katmanı kriteri doğrulanacaksa ya da Adım 7'de kanvasa bulgu düşülecekse önce oku (varsa; mükerrer-kayıt kontrolü — aynı bulgu zaten kayıtlı olabilir)
- Adım 5c'nin arama isabetleri → yalnız isabet veren dokümanları hedefli oku; sabit liste yok

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Bütüncül Değerlendirme

Fazdaki tüm çıktıları birlikte değerlendir:
- Task'lar toplamda tutarlı bir bütün oluşturuyor mu?
- Feature'lar birbirleriyle uyumlu mu?
- Kapsam tartışmasındaki kararlar uygulanmış mı?
- Araştırma bulgularındaki dikkat noktalarına uyulmuş mu?

### 2. Milestone Kontrolü

Faz milestone'unu tekrar kontrol et:
- Tüm kriterler karşılanıyor mu?
- UAT'ta geçen senaryolar milestone'u karşılıyor mu?
- Eksik kalan bir şey var mı?

**Kayıt-katmanı kriterinden UAT senaryosu doğmaz** (örn. bulgu fazında "faza alınan bulguların hepsi kapandı") — senaryo yokluğu eksiklik değildir: teyit kanalı verify-phase Adım 1 süpürmesi ve Adım 6 çözüm teyididir. Ölçüt kanvasın boş olması değil, **bu faza alınmış (`→ Faz N` işaretli) bulguların hepsinin teyitle mezun olmasıdır** (`_dev/BULGULAR.md`); kanvasta bekleyen işaretsiz kayıtlar dar-faz gereğidir, kriteri düşürmez. Teyit tamsa kriter karşılanmıştır, kapanış notu gerekmez.

**Boyut tipi bir kriterin hükmü burada verilmez** (örn. "PHASE-N eşiğin altına iner") — faz dokümanı son hâlini Adım 5'te alır, ondan önceki ölçüm yanıltır: hükmü **Adım 5b'nin doc-scan'inden sonra** ver. Olumsuzsa aşağıdaki kapanış notu rotası geçerlidir (son meşru an Adım 6'nın ✅ damgasıdır). Kriteri burada gördüğün için düşürme — yalnız hükmü erteliyorsun.

**Milestone cümlesi yeniden yazılmaz — yanına kapanış notu düşülür.** Karşılanmayanı teslim edilene göre yeniden yazmak kale direğini kaydırmaktır; ayrıca aynı metin PHASES Faz Durumu tablosunda ve DURUM'da da yaşar, tek taraflı düzeltme drift üretir. Milestone tam karşılanmadıysa cümle olduğu gibi kalır ve **altına tek satırlık kapanış notu** yazılır: hangi ayak açık kaldı, kusur mu bilinçli daralma mı, kalanın evi ne (düzeltme task'ı / BULGULAR kaydı / sonraki faz). Orada bir `mekanizma: X → Y` satırı varsa (araştırma ya da kapsam kararı) o kalır — ad kayması daralma değildir; kapanış notu ayrı satır olarak altına girer. Yazım anı Adım 5, son meşru an Adım 6'nın ✅ damgasıdır — not cümlenin yanında durur ki sonraki okuyucu güçlü hâli ölçüt sanmasın. Eksikliğin kendisi ayrıca Adım 7'nin kapsam triyajına gider (milestone'u etkileyen bulgu ertelenemez). Not yazıldıysa Adım 6'daki PHASES **Faz Geçiş Notları** satırına da "milestone kısmen — bkz. PHASE-N" ibaresi girer — böylece PHASES'in Milestone hücresi güçlü hâliyle ✅ yanında yalnız kalmaz; hücrenin kendisi yeniden yazılmaz.

### 3. Kalite Kontrol

QUALITY.md'deki her kalite eksenini sistematik olarak kontrol et:

| Eksen | Sorular |
|-------|---------|
| Modülerlik | Kod mantıksal modüllere ayrılmış mı? Tek sorumluluk? |
| Güvenlik | Input validation? Yetkilendirme? XSS/CSRF? |
| Bakım Maliyeti | Okunabilir mi? Konfigürasyon esnek mi? |
| Performans | N+1? Pagination? Cache? |
| Hata Yönetimi | Try/catch? Anlamlı hata mesajları? |
| Test Kapsamı | Kritik mantık test edilmiş mi? Edge case'ler? |
| Erişilebilirlik | Semantik HTML? Keyboard nav? (UI projeleri) |
| [Projeye Özgü] | Projeye eklenen ek eksenler |

**Güvenlik ekseni — malzeme ve akış:** Güvenlik satırı **faz-penceresi diff'i** üzerinde değerlendirilir. Diff tarifi **`.claude/commands/devflow/lib/faz-penceresi.md`**'dedir — dosyayı Read ile oku (çağrı başına bir kez) ve bloğu **aynen çalıştır** (çapa sabittir: önceki fazın review commit'i → HEAD; verify'ın 1c koşumundan sonra pencereye giren düzeltme-commit'leri kendiliğinden kapsanır). Working-tree/pending-diff üzerinde çalışan harici bir güvenlik taraması burada kullanılmaz — bu fazın işi faz sonunda zaten commit&push'ludur, pending diff'te bu faza ait bir şey yoktur; ağaçta kir varsa paralel oturuma aittir ve taranmaz (CLAUDE.md → Paralel Oturum Farkındalığı). Bu kontrol 1c'nin mekanik tekrarı değildir: pencere 1c'den sonra giren düzeltme-commit'leriyle büyümüştür ve bulgu burada review bağlamında — QUALITY eksen tablosu ve Adım 7 kapsam triyajıyla birlikte — değerlendirilir. Ve bu bir **ara-rapor durağı değildir**: sonucu Adım 5'in Kalite Kontrol tablosuna yaz, bulguyu Adım 7'nin kapsam triyajına taşı (faz-penceresi bulgusu tanım gereği kapsam-içidir) ve kullanıcıdan "devam" onayı beklemeden akışa devam et.

**Aynı diff'in ikinci merceği — UAT tazeliği:** Adım 2'nin "UAT'ta geçen senaryolar milestone'u karşılıyor mu?" sorusunun cevabı **son verify koşumuna** aittir. Az önce çıkardığın pencerede verify'ın **son** `docs(phase-N): UAT` commit'inden sonra **ürün kodu** değiştiyse — araya giren meşru bir quick oturumu ya da paralel oturum; çapa sabit olduğu için onlar pencerede zaten duruyor — tablodaki ✅'ler o kodu sınamamıştır. Yeniden koşumlar pencerede birden çok UAT commit'i bırakır; ölçüt **en sonuncusudur**, ilki değil — ilki alınırsa her tur "UAT'tan sonra ürün kodu var" bulur ve faz hiç kapanmaz. Etkilenen senaryoları belirle ve Adım 7 triyajına taşı; kapsam-içiyse faz kapanmaz, Adım 9 rotasıyla verify yeniden koşar. Yalnız doküman değiştiyse bu soru düşer. *(Bu, "kaç koşum yeter" sayacı değildir — sonlanma ölçütü verify-phase'in kendi kapısıdır: bir koşum hiçbir kontrol kalmadan bitince çıkılır. Buradaki tek soru, o koşumun **hangi kodun üstünde** koştuğudur.)*

### 3b. Kullanıcı Yolculuğu Perspektifi ve Boşluk Tespiti

Kalite eksenlerinin ötesinde, bir adım geriye çekilip bütünsel bak:

**Kullanıcı yolculuğu:** Bu fazdan sonra kullanıcı deneyimi tutarlı mı? Kullanıcı olarak uygulamayı baştan sona kullanmaya çalışsan akış doğal mı, kopukluk var mı?

**Boşluk tespiti:** Uçtan uca baktığında feature'lar arasında sahipsiz kalan yer var mı? Hiçbir feature'ın veya task'ın sorumluluğunda olmayan ama kullanıcının karşılaşacağı durumlar tespit edildiyse raporla.

Bu QUALITY.md'ye eksen olarak eklenmez — review-phase'in doğal akışında düşünülür. Checklist değil, anlayış. (Yasak **eksen eklemeye** dairdir: mevcut bir eksenin notu fazın bir kararıyla bayatladıysa onu hizalamak Adım 5c'nin işidir.)

### 4. Retrospektif

Kullanıcıyla birlikte (veya kaynak koddan çıkararak) değerlendir:

**Ne iyi gitti?**
- Tekrarlanması gereken pratikler
- İyi çalışan yaklaşımlar

**Ne kötü gitti?**
- Sorunlar ve darboğazlar
- Beklenmedik zorluklar
- Uzayan veya tekrar edilen task'lar

**Sonraki faz için öneriler:**
- Bu fazdan çıkan dersler
- Sonraki fazda dikkat edilmesi gerekenler
- İyileştirme önerileri

**Süreç disiplini çıktı mı? (triyaj)**

"Ne kötü gitti"den bazen tekrar edilebilir bir iş-akışı kuralı doğar — "şunu yaparken şu kontrolü her zaman yap" tipinde (örn. "shared component eklerken mount-point'leri grep'le", "task closure'da e2e selector taraması yap", "bu projede metric/uid/secret-slot adları modül X'te — verify-plan'da oradan doğrula"). Böyle bir disiplin belirdiğinde evini **bir an düşün:**

- **Bu projeye mi özgü** (projenin teknolojisi/yapısı/kod tabanıyla bağlı)? → memory'nin "Süreç Disiplinleri" kategorisi (Adım 6). Kanca'yı uygulama anını (plan/icra) belli edecek şekilde yaz.
- **DevFlow yönteminin geneline mi dair** (her projede geçerli; aracın kendisinin nasıl çalışması gerektiği)? → bu projenin işi değil. Faz retrosuna "DevFlow'a Öneri" olarak yaz (Adım 5) ve **kullanıcıya bildir** — DevFlow'a ayrı bir oturumda taşınır.

Bu bir checklist değil — çoğu retroda hiç disiplin çıkmaz. Sadece tekrar eden bir kalıp gördüğünde evini doğru seç. Disiplinleri TASKS-README'ye **yazma** — o dokunulmaz çekirdek protokoldür (CLAUDE.md → Dokunulmaz Dokümanlar).

### 5. Faz Dokümanını Güncelle

Faz dokümanına (`_dev/phases/PHASE-N.md`) şu bölümleri yaz — **ayrıca Adım 2 gerektirdiyse Genel Bilgiler'deki milestone cümlesinin altına tek satırlık kapanış notunu şimdi düş**:

```markdown
## Retrospektif

### Ne İyi Gitti?
- [...]

### Ne Kötü Gitti?
- [...]

### Sonraki Faz İçin Öneriler
- [...]

### Task-Spesifik Teknik Öğrenimler
<!-- Bu fazdaki task'larda öğrenilen ama proje genelinde geçerli olmayan teknik nüanslar (araç davranışı, framework bug'ı, vb.). MEMORY.md'nin değil, faz retrosunun evidir. Bu fazda böyle bir nüans çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

### DevFlow'a Öneri
<!-- Bu fazda fark edilen, DevFlow yönteminin geneline dair (proje-özel OLMAYAN) iyileştirmeler — aracın kendisinin nasıl çalışması gerektiği. Buraya yazılır + kullanıcıya bildirilir; DevFlow'a ayrı oturumda taşınır. Disiplin çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

## Kalite Kontrol Sonuçları

| Eksen | Durum | Not |
|-------|-------|-----|
| Modülerlik | ✅ | ... |
| Güvenlik | ⚠️ | [dikkat noktası] |
| Bakım Maliyeti | ✅ | ... |
| Performans | ✅ | ... |
| Hata Yönetimi | ✅ | ... |
| Test Kapsamı | ✅ | ... |
| Erişilebilirlik | N/A | [bu fazda UI yok] |
```

### 5b. Faz Dokümanını Dondurmadan Önce Boyut Kontrolü (fazı dondurma penceresi)

Adım 6 fazı PHASES.md'de **✅ (tarihsel/dokunulmaz)** işaretleyebilir — faz gerçekten tamamlandıysa. Damgalarsa bu, faz dokümanını bölmenin **son meşru anıdır** (tamamlandıktan sonra bölme "tarihsel dokümana dokunma" kuralıyla çelişir, CLAUDE.md → Boyut ve Bölünme). Retrospektif + Kalite Kontrol bu oturumda en hacimli içeriği ekledi.

- **Tarif tek evdedir — `.claude/commands/devflow/lib/boyut-kapisi.md`'yi Read ile oku ve izle** (çağrı başına bir kez): ölçüm komutu, üçlü teşhis, kulvar (Onay Ölçütü — kurallı kesim sorulmaz, uygulanır ve raporlanır), ikili kayıt (KURAL yorumu + `accept-size`) ve iki özel hâl (eşik altı · canvas yok) orada tanımlıdır, burada tekrarlanmaz.
- **Bu adıma özgü olan:** bu oturumda büyüten şey Retrospektif + Kalite Kontrol'dür; şişme hâlinde tipik kaynak, icra detayının Task Listesi'nde kalması ya da task-spesifik nüansın Retrospektif dışına taşmasıdır. **`accept-size` bu adımda çağrılmaz** — Adım 8'in ilk işidir; Adım 6 bu dokümana `**Durum:** ✅` damgasını ve varsa mezuniyet satırını daha yazacaktır. Bu bir doküman-hijyen adımıdır, kaynak kodu değiştirmez ve "review sırasında kod değiştirme" kuralıyla çelişmez.
- **Pencere burada kapanabilir:** Adım 6 ✅ damgalarsa doküman donar ve bir erteleme kalıcılaşır — kaydı raporda tek satırla an ki kullanıcı son kez görsün. **Damgalamazsa** (Adım 7 kapsam-içi düzeltme task'ı ürettiyse `Durum` `🔄` kalır) pencere kapanmaz: bölme meşru kalır ve ölçüm bir sonraki faz kapısında tekrarlanır (Adım 8'in dallanması) — **faz o aralıkta erken sonlandırılmadıysa** (`prd-review` 2c de dondurur; o yolun ağları `lib/boyut-kapisi.md` giriş paragrafındadır).
- **Adım 2'den ertelenmiş boyut kriteri varsa hükmü burada verilir.** Milestone'da boyut tipi bir kriter varsa (örn. "PHASE-N eşiğin altına iner") Adım 2 hükmü bilerek buraya ertelemiştir — ölçüm ancak doküman son hâlini aldıktan sonra anlamlıdır. **Ölçüm son hâle bakar:** yukarıdaki adımda bölme/temizlik uyguladıysan `doc-scan`'i **yeniden çalıştır** — ilk çıktı müdahale öncesidir ve ona bakmak, sorunu az önce çözmüş bir fazı "karşılanmadı" diye kapatır. Son ölçüme göre kriteri **karşılandı / karşılanmadı** diye kapat; olumsuzsa Adım 2'nin kapanış-notu rotası işler (milestone cümlesi yeniden yazılmaz, altına tek satırlık not düşülür) ve not Adım 6'nın PHASES **Faz Geçiş Notları** satırına da girer. Burada kapatılmazsa kriter hükümsüz kalır — Adım 6 `✅` damgalarsa doküman donar ve kriter bir daha kapatılamaz.

### 5c. Kapanan Kararın Başka Nerede Anlatıldığı (dondurmadan önce)

Bu fazın **yürürlüğe girmiş kalıcı** kararları (kapsam tartışması kararı, araştırma teknik kararı, onaylı düzeltme task'ı) aynı konuyu anlatan başka dokümanlarda bir **önceki hâli** bırakmış olabilir; orada yazan artık yanlıştır ve sonraki fazın UAT senaryolarıyla audit-product'ın "olması gereken" kaynağıdır. Adım 6'nın hizalaması yalnız modül gövdesini görür — bu adım yüzeyi genişletir. Yeri burasıdır: Adım 6'nın ✅ damgası faz dokümanlarını dondurur.

- **Yüzey aramadır, beyan değil:** kararın **ayırt edici terimini** (eski ve yeni ad) `CLAUDE.md` + `_dev/**` içinde ara — kaydın saydığı yerle yetinme, sınıfın kendisine bak (aynı ölçü: `research-phase` Adım 2). `tasks/archive/`, `bulgular/archive/` ve **tamamlanmış** faz dokümanları tarihseldir; isabetleri hizalanmaz.
- **Ölçü Adım 6'nın MODULE-MAP maddesindekiyle aynıdır** (erteleme hizalama değildir · dayanağı iddiaysa önce ölçülür · dayanaksız sapma hizalanmaz), burada tekrarlanmaz. MODULE-MAP ve modül gövdesi isabetlerinin evi de orasıdır — burada yalnız listelenir.
- **Yazma alanının dışına düşen isabet hizalanmaz** — ama her üye bir rotaya bağlanır, hiçbiri düşmez:
  - **Korumalı OVERVIEW/GIT-STRATEJI**, PHASES'in **Sıradaki Fazlar** listesi (hükümsüz kalan konu bile buradan silinmez — tek promosyon noktası discuss-phase'dir, Adım 6) ve **`_dev/` dışındaki ürün dokümanı** (o bir ürün kusurudur) → **Adım 7 triyajına** gider. **Yeni onay kapısı doğmaz**, kalem Adım 7'nin mevcut kapısından geçer.
  - **Dokunulmaz Dokümanlar** (→ CLAUDE.md → Dokunulmaz Dokümanlar; sınıfın "rutin işte değiştirme" kuralı burada da geçerlidir) — rota üyeye göredir: **projeye özgü sabitlerde** gerçeklik mutabakatı `audit-docs`'un açık-onay kanalıdır (CLAUDE.md → Bayatlama notu); **`tasks/TASKS-README.md`** ise çekirdek protokolün kopyasıdır — bir faz kararı onu bayatlatmaz, orada isabet çıkarsa bu bir motor kalemidir: raporda tek satırla an **ve retrospektifin "DevFlow'a Öneri" bölümüne yaz** (Adım 5 ile aynı ev) — yoksa kalemin tek izi bu turun sohbeti olur.
  - **PRD ve ILKELER'e dokunma:** PRD versiyon ortasında donuktur, ILKELER'in içeriği deneyimle prd-review'da ele alınır — rota `prd-note` (Adım 6 ile aynı).

- **Milestone cümlesi ve onun PHASES/DURUM kopyaları isabet verse de hizalanmaz** — özgün taahhüdü bilerek taşırlar (Adım 2); mekanizma kaymasının evi milestone'un altındaki tek satırdır, kopyalar değil.
- **Faz dokümanına yazılmaz** — o bu kararların kaydıdır, yankısı değil; 5b'nin ölçümü de son hâle bakar.
- Kalıcı karar çıkmadıysa bu adım düşer. Çıktıysa raporda tek satır: kaç yankı hizalandı, kaç kalem Adım 7'ye gitti — parent `CLAUDE.md`'ye dokunulduysa ayrıca adıyla an.

### 6. Diğer Dokümanları Güncelle

- **`_dev/phases/PHASE-N.md` → `**Durum:**` alanı:** PHASES ✅ yazılıyorsa faz dokümanının **ilk satırındaki** Durum alanını da `✅ Tamamlandı` yap (template `PHASE.md:3`; menü `🔄 Devam ediyor / ✅ Tamamlandı / ⚠️ Erken sonlandırıldı`). **Son meşru an burasıdır** — aynı adımda PHASES ✅ damgası dokümanı tarihsel/dondurulmuş yapar ve alan bir daha düzeltilemez. Faz tamamlanmadıysa (aşağıdaki koşul) alan `🔄` kalır.
- **PHASES.md:** Faz durumunu "✅ Tamamlandı" olarak güncelle — **yalnız faz gerçekten tamamlandıysa**: Adım 7 triyajı kapsam-içi düzeltme task'ı ürettiyse faz tamamlanmamıştır (Adım 9 da böyle der), satır 🔄 kalır ve geçiş kaydı yazılmaz. Aksi halde PHASES ✅ derken faz sürüyor olur ve ✅ damgası PHASE-N.md'yi dondurduğu için Adım 7 dondurulmuş dokümana task ekler. Faz Geçiş Notları tablosuna geçiş kaydı ekle (tarih + kısa not, tek satır max ~120 char). PHASES.md'ye faz detayı/retrospektif özeti yazma — detay zaten PHASE-N.md'dedir. "Son Güncelleme" satırını üzerine yaz.
- **DURUM.md:** "Son Güncelleme" satırını **üzerine yaz** (tek satır, ~250 char). Faz durumunu güncelle, eski fazın task'lerini tablodan **gerçekten temizle** (HTML comment'e sarma, "Önceki:" prefix yasak). Yeni faza geçildiyse Son Task Özetleri sıfırlanır. Aktif Faz ve Adım alanlarını sıradaki adıma göre güncelle:
  - Düzeltme task'ları oluşturulduysa (Adım 7 triyajı kapsam-içi task ürettiyse) → Aktif Faz aynı kalır, Adım = `task`. Bulguların tümü kanvasa düştüyse task açılmaz — alttaki dallara göre güncelle
  - Sonraki faza geçiliyorsa (normal faz veya teknik borç → senaryo testi) → Aktif Faz = N+1 (= mevcut max + 1; adı Sıradaki Fazlar'ın ilk maddesinden, geçici), Adım = `discuss`. **Yeni fazı PHASES.md Faz Durumu tablosuna EKLEME ve Sıradaki Fazlar'dan çıkarma — bunu discuss-phase yapar (tek promosyon noktası).**
  - Bu faz senaryo testi fazıysa → Aktif Faz ve Adım alanlarını boşalt (faz döngüsü dışına çıkılıyor)
  - Proje tamamlandıysa → Aktif Faz ve Adım alanlarını boşalt
- **DURUM.md → Versiyon Sonu Durumu (yalnız faz gerçekten tamamlandıysa — düzeltme task'ı açıldıysa dokunma):** review-phase bu alanın birincil otoritesidir; geçişi **burada** yaz ki Adım 8'in commit'i onu kapsasın. **Bu adıma girerken okunan** değere göre: `teknik_borç` ise (yani bu faz teknik borç fazıdır) → `senaryo_testi` yaz; `senaryo_testi` ise (bu faz senaryo testi fazıdır) → `prd_review_bekliyor` yaz. Hangi geçişi yazdığını Adım 9 için aklında tut — orası artık DURUM'a yazmaz, yalnız yazılmışa göre sıradaki komutu **önerir**. *(Aksi halde alan commit'ten sonra değişir ve ağaçta commit'siz kalır; sonraki oturum onu Paralel Oturum Farkındalığı gereği "benim değil" sayıp dokunmaz.)*
- **MODULE-MAP.md:** Bu fazda tamamlanan feature'ların Durum sütununu ✅ olarak güncelle. Bir feature'ın tüm kabul kriterleri karşılanmış ve UAT'tan geçmişse ✅ yapılır; kısmen tamamlandıysa (bazı task'ları sonraki fazlara kaldıysa) 🟡. **Bu fazda tamamlanan feature yoksa** Durum sütununda iş yoktur — sessizce geç; aşağıdaki gövde hizalaması ise faz türünden bağımsız geçerlidir. Adım 5c'nin listelediği MODULE-MAP/modül isabetleri de burada hizalanır.
  - **Kriterin kendisi bayatsa işaret yalan olur** — bu yüzden modül gövdesine de bak: fazın **kayıtlı bir kararı** (kapsam tartışması kararı, onaylı düzeltme task'ı) feature'ın davranışını modül dokümanında yazandan farklı bıraktıysa kabul kriterini/edge case'i — ve modülün **Sınır** / **Teknik Notlar** kayıtlarını — gerçekle hizala. Bu Adım 6'nın rutin doküman güncellemesidir, yeni bir onay kapısı değil.
  - **Erteleme hizalama değildir** — karar feature'ı sonraki faza/versiyona bırakıyorsa kriter olduğu gibi kalır ve işaret 🟡 olur; hizalama yalnız davranışın **kalıcı olarak yeniden tanımlandığı** (feature bundan böyle başka türlü çalışacak) durumdadır.
  - **Kararın dayanağı iddiaysa önce ölçülür** — karar bir tercihse ("bundan böyle böyle çalışacak") gövde hizalanır; dayanağı bir iddiaysa ("o kriter zaten başka yerde karşılanıyor") hizalamadan önce iddia ölçülür: doğruysa hizala ve **nerede karşılandığını** gövdeye yaz (iz kaybolmasın); çürükse ya da ölçüm kurulamıyorsa hizalama — aşağıdaki dayanaksız-sapma hükmü işler. (Ayrımın evi: `research-phase` Adım 2 → "Devraldığın daralmayı ölç"; verify Adım 2c ile aynı ayrım.)
  - **Dayanağı olmayan sapma hizalanmaz** — o bir bulgudur, Adım 7 triyajına gider (dokümanı gözlenene uydurmak kusuru spesifikasyona çevirir; o gövde sonraki fazın UAT senaryolarının ve audit-product'ın "olması gereken" kaynağıdır).
  - Sapma feature'ın PRD davranış kuralına iniyorsa modül dokümanını hizala ama **PRD'ye dokunma** — PRD versiyon ortasında donuktur, kullanıcıya `/devflow:prd-note` öner.
- **docs/DECISIONS.md:** Fazda alınan önemli kararları ekle (append-only — eski kararlar silinmez; bir karar geçersizleştiyse yenisi eklenir ve eski "Superseded by ..." notuyla işaretlenir).
- **MEMORY:** Retrospektiften çıkan çapraz öğrenimleri memory'ye ekle — **gerekmedikçe yeni dosya açma** (konusu var olan bir atoma giriyorsa oraya yaz), gerçekten yeniyse `_dev/memory/<slug>.md` oluştur ve `_dev/MEMORY.md` index'ine pointer ekle. **Kanca bir haktır, alan değil** — kanca hakkı testi, sınıflar/eşikler ve supaplar `.claude/commands/devflow/lib/memory-sistemi.md`'dedir; **yazmadan önce Read et** (faz kapanışı hem ekleme hem çıkarma yapar, ikisinin de ölçütü orada). Faz kapanışı index'in tek düzenli bakım anıdır: eklerken bir de **çıkarmaya bak** — kancası gövdeye dönmüş, bir başkasıyla birleşebilecek ya da artık bir **test/lint/CI/validator/guard** kapısının yakaladığı kayıt varsa burada kapat. **Mezuniyet yapıyorsan kaydı ✅ damgasından ÖNCE yaz:** çapalı tek satır (*"<öğrenim> artık <kapı> tarafından yakalanıyor — memory'den mezun edildi"*) **Adım 5'te yazdığın** Retrospektif → Sonraki Faz İçin Öneriler bloğuna girer. Bu maddenin sırası aldatıcıdır — yukarıdaki PHASES ✅ damgası faz dokümanını dondurur; kaydı sonraya bırakırsan ya dondurulmuş dokümana yazarsın ya hiç yazmazsın (sessiz mezuniyet: hangi kapının devraldığı hiçbir yerde kalmaz). Her review'da güncelleme zorunlu değil.
  - **Yazılır:** Tek faza/tek task'a ait olmayan, proje genelinde geçerli öğrenimler (kullanıcı tercihleri, ortam kuralları, kalıcı tuzak özetleri vb.)
  - **Yazılır (süreç disiplini):** Triyajda "bu projeye özgü" çıkan tekrar eden iş-akışı kuralları → memory'nin "Süreç Disiplinleri" kategorisi (kanca uygulama anını belli etsin). DevFlow-genel olanlar buraya değil, faz retrosunun "DevFlow'a Öneri" bölümüne gider.
  - **Yazılmaz:** Task icrasına özgü teknik nüanslar (araç davranışı, framework bug'ı vb.) — bu fazın retrospektifindeki "Task-Spesifik Teknik Öğrenimler" alt bölümüne yazılır.
  - Detay: CLAUDE.md → Doküman Disiplini → Bilginin Doğru Evi.
- **Archive kontrolü:** Tüm tamamlanan task'lar archive'da mı?

> Doküman Disiplini tam metni: CLAUDE.md → Doküman Disiplini (bölünmüş projede `_dev/claude/DOKUMAN-DISIPLINI.md`'dedir ve parent'a import edilir — ayrıca okumak gerekmez).

### 7. Eksik/Sorun Tespiti

Review geniş bakar (Adım 3b bunu ister) — ama her bulgu bu fazın işi değildir. Eksik veya sorunlu bir şey tespit edildiyse önce **kapsam triyajı** yap; ölçüt kapsamdır, çaba değil:

- **Kapsam-içi** (fazın milestone kriterlerine, kapsam tartışması kararlarına, bu fazda değişen koda veya faz-penceresi diff'ine dokunuyor):
  - Sorunu açıkla
  - Düzeltme task'ı öner (kullanıcı onaylarsa oluştur)
  - Ciddi sorunlarda faz tamamlanmamış sayılabilir — milestone'u etkileyen bulgu ertelenemez
  - Kullanıcı task açmayı reddederse bulguyu düşürme: kararı ve bulguyu Gelen Kutusu'na kullanıcı-kararı işaretli tek satırla kaydet; bulgu milestone'u etkiliyorsa fazın eksik kapandığını açıkça söyle
- **Kapsam-dışı** (faza dokunmuyor — bütünsel bakışta görülen komşu/sistem-geneli gözlem) → task AÇMA, fazı bekletme: `_dev/BULGULAR.md` Gelen Kutusu'na kaynak işaretli tek satır düş (`- [PHASE-N] ...`; kural → CLAUDE.md "Gördüğün sorunu düşürme") ve kullanıcıya raporla. Düşürmeden önce kanvasa bak: aynı bulgu zaten kayıtlıysa (kutu satırı ya da mevcut bulgu atomu) yeni satır düşme. Bulgu kanvasta sırasını bekler — kutu notunu audit-product uzlaştırması triyaj eder (atomlaşırsa bulgu fazına girebilir), kapsamına dokunan sonraki fazın verify süpürmesi devralır; faz temiz kapanır.

**Düzeltme task'ı oluşturulacaksa** (verify-phase Adım 7-8 ile simetrik — state-handoff'u eksiksiz kur):
- **Önce oku:** `.claude/commands/devflow/templates/TASK.md`; task'ı template'e uygun yaz
- **Numara = faz içindeki en büyük YY + 1, `_dev/tasks/archive/` dahil sayılır** (kural evi `plan-phase`; numara bu adımda doğuyor ve arşiv sayılmazsa çakışan iki `TASK-X.YY` geri alınamaz — TASKS-README yalnız biçimi taşır)
- PHASE-N.md **Task Listesi** tablosuna ⬜ olarak ekle
- DURUM **Task Durumu (Aktif Faz)** tablosuna ⬜ olarak ekle ve **Aktif Task** alanını yeni düzeltme task'ına yönlendir (Adım = `task` zaten Adım 6'da set edilir; tabloya ekleme yapılmazsa `run-task` "hepsi ✅" sanıp düzeltme task'ını atlar)

### 8. Git Commit & Push

**Önce boyut kabulü — ve bu ölçüm KOŞULSUZDUR, 5b bir kalem devretmiş olsa da olmasa da koşar.** Faz dokümanına yapılacak bütün yazımlar bitti (Adım 6'nın `Durum: ✅` damgası ve varsa mezuniyet satırı; düzeltme task'ı çıktıysa Adım 7'nin Task Listesi'ne eklediği ⬜ satırı), yani doküman **ilk kez son hâlindedir** — `doc-scan` ile ölç. **`TOKEN-SERT` ise kayıt fazın DONUP donmadığına bakar:** Adım 6 bu turda `✅` damgaladıysa doküman dondu, bölme artık yasak, kabulü **şimdi** yaz. Damgalamadıysa (Adım 7 kapsam-içi düzeltme task'ı ürettiyse `Durum` `🔄` kalır) doküman **donmadı** — orada kabul değil kanonun çaresi geçerlidir: bölme hâlâ meşrudur ve ölçüm bir sonraki faz kapısında (`verify-phase` 6b) tekrarlanır. Ölçüm ve kabul komutları, canvas koşulu ve gerekçe metni tek evdedir: `lib/boyut-kapisi.md` → "`accept-size`'ın zamanı" (5b'de zaten okundu, burada tekrarlanmaz). Bayrak yoksa iş yoktur.

⚠️ **Ölçüm neden koşulsuz:** 5b dokümanı çizginin **altında** bulup hiçbir kalem devretmemiş olabilir — ve tam o hâlde Adım 6'nın damgası onu çizginin üstüne taşıyabilir (kanon: çizginin altında boyut işi yoktur, yani 5b önden kısaltma yapmaz). Devir koşuluna bağlanan bir ölçüm o dokümanı hiç görmez: doküman dondurulur, bölme yasaklanır ve kayıtsız kalır — sonraki her audit turunda bir S1 slotu tutar (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi). Yazıldıysa `_dev/.audit/canvas.tsv` aşağıdaki commit'e girer; ayrı commit atma.

Tüm doküman değişikliklerini commit & push yap:
```
docs(phase-N): review — retrospective and quality control completed
```

### 9. Sıradaki Adımı Öner

**Düzeltme task'ları oluşturulduysa (faz tamamlanmadı):**
```
⚠️ Review'da sorun tespit edildi. X düzeltme task'ı oluşturuldu.
   Faz henüz tamamlanmadı.
📋 Sıradaki adım: /devflow:run-task
   → Düzeltme task'larını tamamla, sonra /devflow:verify-phase ve /devflow:review-phase tekrar çalıştır.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**Düzeltme task'ı açılmadıysa (bulgular kapsam-dışı ya da kullanıcı kararıyla kanvasa düşüldü):** faz tamamlanır — bulgular BULGULAR kanvasında sırasını bekler; aşağıdaki normal kapanış dallarından uygun olanla devam et.

**Versiyon sonu kontrolü (Aktif Versiyon varsa):**
Adım 6'ya girerken okuduğun Versiyon Sonu Durumu'na göre ilerle — alanı yeniden okuma (Adım 6 onu zaten ilerletti).

> **Otorite notu:** review-phase, Versiyon Sonu Durumu geçişlerinin birincil otoritesidir (`teknik_borç` → `senaryo_testi`, `senaryo_testi` → `prd_review_bekliyor`) — ama **geçişi Adım 6'da yazar**, burada değil; bu adım yalnız yazılmış duruma göre sıradaki komutu önerir. discuss-phase aynı geçişleri güvenlik ağı olarak tekrar kontrol eder (crash/atlanma durumunu yakalar).

> **Not:** **Adım 6'ya girerken** Versiyon Sonu Durumu `teknik_borç` ise review edilen faz, tanım gereği teknik borç fazıdır; `senaryo_testi` ise senaryo testi fazıdır. Bu ilişki state machine'in doğal sonucudur — ayrı bir etiket gerekmez. Aşağıdaki dallar bu kimliğe bakar, alanın **şu anki** değerine değil (Adım 6 onu zaten ilerletti).

Eğer bu faz teknik borç fazıysa (Adım 6 alanı `senaryo_testi`'ye çekti):
- discuss-phase öner (senaryo testi fazına otomatik geçiş orada yapılacak):
```
✅ Faz N (Teknik Borç) review tamamlandı. Senaryo testi fazına geçiliyor.
📋 Sıradaki adım: /devflow:discuss-phase
   → Senaryo testi fazının kapsam tartışması için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

Eğer bu faz senaryo testi fazıysa (Adım 6 alanı `prd_review_bekliyor`'a çekti):
- **Önce yayın boşluğunu ölç** (aşağıdaki alt başlık), sonra ölçüme göre öner:
```
✅ Faz N (Senaryo Testi) review tamamlandı. Versiyon sonu fazları tamamlandı!
📋 Sıradaki adım: [ölçüm > 0 ise: /devflow:quick QUICK-NNN | ölçülemediyse: yok — yayın durumu doğrulanamadı (<neden>) | ölçüm = 0 ise: /devflow:prd-review]
   → [ölçüm > 0: <sayı> commit henüz yayınlanmadı; prd-review yayından sonra
      | ölçüm = 0: versiyon değerlendirmesi için yeni bir oturum başlat]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

#### Yayın boşluğu ölçümü

> **Tarifi tek evdedir — `.claude/commands/devflow/lib/yayin-boslugu.md`'yi Read ile oku** (ölçüm anı geldiğinde, çağrı başına bir kez) ve orada yazılanı uygula. Ayrı dosyadır çünkü üç çağıranı vardır (bu adımın iki dalı + `quick` Adım 1b) ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme).

İçindekiler (yönelme için; ölçütler dosyada): koşul (yalnız beyanlı yayın hattında) · ölçüm bloğu ve ref sırası · sonucun dört yorumu · ölçüm > 0 ise QUICK kaydının bu adımda açılması · teslim DevFlow-dışıysa prd-review'u erteleme hatırlatması.

**Sonraki faz varsa (faz tamamlandı):**
```
✅ Faz N review tamamlandı. Retrospektif ve kalite kontrol faz dokümanına yazıldı.
📋 Sıradaki adım: /devflow:discuss-phase
   → Sonraki fazın kapsam tartışması için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**Son fazsa (proje tamamlandıysa):** önce yayın boşluğunu ölç (yukarıdaki alt başlık) — proje tamamlanıyorsa yayınlanmamış iş kalması en pahalı hâldir.
```
✅ Faz N review tamamlandı. Tüm fazlar başarıyla tamamlandı!
🎉 Proje tamamlandı. Tebrikler!
📋 Sıradaki adım: [ölçüm > 0 ise: /devflow:quick QUICK-NNN — <sayı> commit henüz yayınlanmadı | ölçülemediyse: yok — yayın durumu doğrulanamadı (<neden>) | ölçüm = 0 ise: yok — proje tamamlandı]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

Son satır beş dalın hepsinde yazılır; kuralı ve amblemi: **CLAUDE.md → Oturum Kapanışı**.

**Üçüncü slot ihmal edilemez: `ÖLÇÜLEMEDİ` sıfır değildir.** Ölçüm dört sonuç verir (`lib/yayin-boslugu.md` → Sonucun yorumu) ama iki dallı bir şablon `ÖLÇÜLEMEDİ` ve `fatal` hâllerini "0" kovasına düşürür — o hâlde blok, yayınlanmamış iş varken kullanıcıyı doğrudan prd-review'a ya da "proje tamamlandı"ya yollar ve QUICK kaydı da açılmaz (kayıt yalnız `> 0` hâlinde açılır). Ölçülemeyen hâlde `📋` bir komut **taşımaz** ve o dalda **`→` satırı hiç yazılmaz** (kanon: Oturum Kapanışı, `yok` dalı; aynı biçim aşağıdaki "proje tamamlandı" dalında zaten kullanılıyor): neden `📋`'nin kendi bekleme koşulunun parantezine girer ve **GIT-STRATEJI'deki dal adlarının doğrulanması gerektiğini de orada söyle** — ölçüm bir sonraki oturumda tekrarlanır. "Proje tamamlandı" dalında bu daha da ağırdır: orada kapanış "bitti" der ve yanılıyorsa düzeltecek bir sonraki kapı yoktur.

---

## Önemli Kurallar

- Review sırasında kod değiştirme — sadece değerlendir ve raporla
- Retrospektif dürüst olmalı — sadece olumlu değil, sorunları da yaz
- **Kalite kontrolleri ara durak değildir** — sonuç tabloya yazılır, bulgu Adım 7'ye akar, akış kullanıcıdan "devam" beklemeden sürer. Onay kapıları yalnız bilinçli karar noktalarıdır: **Adım 7 task onayı** ve **Adım 5b'nin yalnız kurallı-olmayan kesimi** (ölçülü tetikle kurallı kesim sorulmaz — CLAUDE.md → Onay Ölçütü)
