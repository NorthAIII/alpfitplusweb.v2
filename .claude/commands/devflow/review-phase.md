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
- Değişen kaynak kod dosyaları → task dokümanlarının "Etkilenen Dosyalar" bölümlerinden değişen dosyaları tespit et ve incele
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili `_dev/modules/MX-*.md` dosyalarını oku — Adım 6'nın ✅ işareti "kabul kriterleri karşılandı" demektir, kriterin kendisine bakmadan vurulamaz
- Önceki faz dokümanı → önceki faz varsa `_dev/phases/PHASE-(N-1).md` dosyasının "Retrospektif → Sonraki Faz İçin Öneriler" bölümünü oku ve önerilerin bu fazda uygulanıp uygulanmadığını kontrol et
- Fazda önemli bir karar çıktıysa `_dev/docs/DECISIONS.md`'yi oku — özellikle eski bir kararı `Superseded` etiketlemek gerekiyorsa mevcut girdiyi bulmak için (saf newest-on-top append okuma gerektirmez)
- `_dev/BULGULAR.md` → Adım 2'de kayıt-katmanı kriteri doğrulanacaksa ya da Adım 7'de kanvasa bulgu düşülecekse önce oku (varsa; mükerrer-kayıt kontrolü — aynı bulgu zaten kayıtlı olabilir)

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

**Milestone cümlesi yeniden yazılmaz — yanına kapanış notu düşülür.** Karşılanmayanı teslim edilene göre yeniden yazmak kale direğini kaydırmaktır; ayrıca aynı metin PHASES Faz Durumu tablosunda ve DURUM'da da yaşar, tek taraflı düzeltme drift üretir. Milestone tam karşılanmadıysa cümle olduğu gibi kalır ve **altına tek satırlık kapanış notu** yazılır: hangi ayak açık kaldı, kusur mu bilinçli daralma mı, kalanın evi ne (düzeltme task'ı / BULGULAR kaydı / sonraki faz). Orada araştırmadan gelmiş bir `mekanizma: X → Y` satırı varsa o kalır — ad kayması daralma değildir; kapanış notu ayrı satır olarak altına girer. Yazım anı Adım 5, son meşru an Adım 6'nın ✅ damgasıdır — not cümlenin yanında durur ki sonraki okuyucu güçlü hâli ölçüt sanmasın. Eksikliğin kendisi ayrıca Adım 7'nin kapsam triyajına gider (milestone'u etkileyen bulgu ertelenemez). Not yazıldıysa Adım 6'daki PHASES **Faz Geçiş Notları** satırına da "milestone kısmen — bkz. PHASE-N" ibaresi girer — böylece PHASES'in Milestone hücresi güçlü hâliyle ✅ yanında yalnız kalmaz; hücrenin kendisi yeniden yazılmaz.

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

**Güvenlik ekseni — malzeme ve akış:** Güvenlik satırı **faz-penceresi diff'i** üzerinde değerlendirilir. Diff tarifi verify-phase Adım 1c'deki bash bloğudur — bloğu oradan oku ve **aynen çalıştır** (çapa sabittir: önceki fazın review commit'i → HEAD; 1c'den sonra pencereye giren düzeltme-commit'leri kendiliğinden kapsanır). Working-tree/pending-diff üzerinde çalışan harici bir güvenlik taraması burada kullanılmaz — bu fazın işi faz sonunda zaten commit&push'ludur, pending diff'te bu faza ait bir şey yoktur; ağaçta kir varsa paralel oturuma aittir ve taranmaz (CLAUDE.md → Paralel Oturum Farkındalığı). Bu kontrol 1c'nin mekanik tekrarı değildir: pencere 1c'den sonra giren düzeltme-commit'leriyle büyümüştür ve bulgu burada review bağlamında — QUALITY eksen tablosu ve Adım 7 kapsam triyajıyla birlikte — değerlendirilir. Ve bu bir **ara-rapor durağı değildir**: sonucu Adım 5'in Kalite Kontrol tablosuna yaz, bulguyu Adım 7'nin kapsam triyajına taşı (faz-penceresi bulgusu tanım gereği kapsam-içidir) ve kullanıcıdan "devam" onayı beklemeden akışa devam et.

**Aynı diff'in ikinci merceği — UAT tazeliği:** Adım 2'nin "UAT'ta geçen senaryolar milestone'u karşılıyor mu?" sorusunun cevabı **son verify koşumuna** aittir. Az önce çıkardığın pencerede verify'ın **son** `docs(phase-N): UAT` commit'inden sonra **ürün kodu** değiştiyse — araya giren meşru bir quick oturumu ya da paralel oturum; çapa sabit olduğu için onlar pencerede zaten duruyor — tablodaki ✅'ler o kodu sınamamıştır. Yeniden koşumlar pencerede birden çok UAT commit'i bırakır; ölçüt **en sonuncusudur**, ilki değil — ilki alınırsa her tur "UAT'tan sonra ürün kodu var" bulur ve faz hiç kapanmaz. Etkilenen senaryoları belirle ve Adım 7 triyajına taşı; kapsam-içiyse faz kapanmaz, Adım 9 rotasıyla verify yeniden koşar. Yalnız doküman değiştiyse bu soru düşer. *(Bu, "kaç koşum yeter" sayacı değildir — sonlanma ölçütü verify-phase'in kendi kapısıdır: bir koşum hiçbir kontrol kalmadan bitince çıkılır. Buradaki tek soru, o koşumun **hangi kodun üstünde** koştuğudur.)*

### 3b. Kullanıcı Yolculuğu Perspektifi ve Boşluk Tespiti

Kalite eksenlerinin ötesinde, bir adım geriye çekilip bütünsel bak:

**Kullanıcı yolculuğu:** Bu fazdan sonra kullanıcı deneyimi tutarlı mı? Kullanıcı olarak uygulamayı baştan sona kullanmaya çalışsan akış doğal mı, kopukluk var mı?

**Boşluk tespiti:** Uçtan uca baktığında feature'lar arasında sahipsiz kalan yer var mı? Hiçbir feature'ın veya task'ın sorumluluğunda olmayan ama kullanıcının karşılaşacağı durumlar tespit edildiyse raporla.

Bu QUALITY.md'ye eksen olarak eklenmez — review-phase'in doğal akışında düşünülür. Checklist değil, anlayış.

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

### 5b. Faz Dokümanını Dondurmadan Önce Boyut Kontrolü (son pencere)

Adım 6 fazı PHASES.md'de **✅ (tarihsel/dokunulmaz)** işaretleyecek — bu, faz dokümanını bölmenin **son meşru anıdır** (tamamlandıktan sonra bölme "tarihsel dokümana dokunma" kuralıyla çelişir, CLAUDE.md → Boyut ve Bölünme). Retrospektif + Kalite Kontrol bu oturumda en hacimli içeriği ekledi.

- `bash .claude/commands/devflow/scripts/doc-scan.sh _dev/phases/PHASE-N.md` çalıştır. Kırmızı çizgiye (~20k token) yaklaştıysa/aştıysa CLAUDE.md → Boyut ve Bölünme'ye göre teşhis + çöz: **gerçek büyüme** (Retrospektif + Kalite Kontrol) → `PHASE-N-<EK>.md`'ye böl; **şişme** (yanlış-ev) → temizle.
- Bu bir **doküman-hijyen** adımıdır — kaynak kodu değiştirmez, "review sırasında kod değiştirme" kuralıyla çelişmez. **Kullanıcıya öner, onayla uygula.**

### 6. Diğer Dokümanları Güncelle

- **`_dev/phases/PHASE-N.md` → `**Durum:**` alanı:** PHASES ✅ yazılıyorsa faz dokümanının **ilk satırındaki** Durum alanını da `✅ Tamamlandı` yap (template `PHASE.md:3`; menü `🔄 Devam ediyor / ✅ Tamamlandı / ⚠️ Erken sonlandırıldı`). **Son meşru an burasıdır** — aynı adımda PHASES ✅ damgası dokümanı tarihsel/dondurulmuş yapar ve alan bir daha düzeltilemez. Faz tamamlanmadıysa (aşağıdaki koşul) alan `🔄` kalır.
- **PHASES.md:** Faz durumunu "✅ Tamamlandı" olarak güncelle — **yalnız faz gerçekten tamamlandıysa**: Adım 7 triyajı kapsam-içi düzeltme task'ı ürettiyse faz tamamlanmamıştır (Adım 9 da böyle der), satır 🔄 kalır ve geçiş kaydı yazılmaz. Aksi halde PHASES ✅ derken faz sürüyor olur ve ✅ damgası PHASE-N.md'yi dondurduğu için Adım 7 dondurulmuş dokümana task ekler. Faz Geçiş Notları tablosuna geçiş kaydı ekle (tarih + kısa not, tek satır max ~120 char). PHASES.md'ye faz detayı/retrospektif özeti yazma — detay zaten PHASE-N.md'dedir. "Son Güncelleme" satırını üzerine yaz.
- **DURUM.md:** "Son Güncelleme" satırını **üzerine yaz** (tek satır, ~250 char). Faz durumunu güncelle, eski fazın task'lerini tablodan **gerçekten temizle** (HTML comment'e sarma, "Önceki:" prefix yasak). Yeni faza geçildiyse Son Task Özetleri sıfırlanır. Aktif Faz ve Adım alanlarını sıradaki adıma göre güncelle:
  - Düzeltme task'ları oluşturulduysa (Adım 7 triyajı kapsam-içi task ürettiyse) → Aktif Faz aynı kalır, Adım = `task`. Bulguların tümü kanvasa düştüyse task açılmaz — alttaki dallara göre güncelle
  - Sonraki faza geçiliyorsa (normal faz veya teknik borç → senaryo testi) → Aktif Faz = N+1 (= mevcut max + 1; adı Sıradaki Fazlar'ın ilk maddesinden, geçici), Adım = `discuss`. **Yeni fazı PHASES.md Faz Durumu tablosuna EKLEME ve Sıradaki Fazlar'dan çıkarma — bunu discuss-phase yapar (tek promosyon noktası).**
  - Bu faz senaryo testi fazıysa → Aktif Faz ve Adım alanlarını boşalt (faz döngüsü dışına çıkılıyor)
  - Proje tamamlandıysa → Aktif Faz ve Adım alanlarını boşalt
- **DURUM.md → Versiyon Sonu Durumu (yalnız faz gerçekten tamamlandıysa — düzeltme task'ı açıldıysa dokunma):** review-phase bu alanın birincil otoritesidir; geçişi **burada** yaz ki Adım 8'in commit'i onu kapsasın. **Bu adıma girerken okunan** değere göre: `teknik_borç` ise (yani bu faz teknik borç fazıdır) → `senaryo_testi` yaz; `senaryo_testi` ise (bu faz senaryo testi fazıdır) → `prd_review_bekliyor` yaz. Hangi geçişi yazdığını Adım 9 için aklında tut — orası artık DURUM'a yazmaz, yalnız yazılmışa göre sıradaki komutu **önerir**. *(Aksi halde alan commit'ten sonra değişir ve ağaçta commit'siz kalır; sonraki oturum onu Paralel Oturum Farkındalığı gereği "benim değil" sayıp dokunmaz.)*
- **MODULE-MAP.md:** Bu fazda tamamlanan feature'ların Durum sütununu ✅ olarak güncelle. Bir feature'ın tüm kabul kriterleri karşılanmış ve UAT'tan geçmişse ✅ yapılır; kısmen tamamlandıysa (bazı task'ları sonraki fazlara kaldıysa) 🟡. **Bu fazda tamamlanan feature yoksa** Durum sütununda iş yoktur — sessizce geç; aşağıdaki gövde hizalaması ise faz türünden bağımsız geçerlidir.
  - **Kriterin kendisi bayatsa işaret yalan olur** — bu yüzden modül gövdesine de bak: fazın **kayıtlı bir kararı** (kapsam tartışması kararı, onaylı düzeltme task'ı) feature'ın davranışını modül dokümanında yazandan farklı bıraktıysa kabul kriterini/edge case'i — ve modülün **Sınır** / **Teknik Notlar** kayıtlarını — gerçekle hizala. Bu Adım 6'nın rutin doküman güncellemesidir, yeni bir onay kapısı değil.
  - **Erteleme hizalama değildir** — karar feature'ı sonraki faza/versiyona bırakıyorsa kriter olduğu gibi kalır ve işaret 🟡 olur; hizalama yalnız davranışın **kalıcı olarak yeniden tanımlandığı** (feature bundan böyle başka türlü çalışacak) durumdadır.
  - **Kararın dayanağı iddiaysa önce ölçülür** — karar bir tercihse ("bundan böyle böyle çalışacak") gövde hizalanır; dayanağı bir iddiaysa ("o kriter zaten başka yerde karşılanıyor") hizalamadan önce iddia ölçülür: doğruysa hizala ve **nerede karşılandığını** gövdeye yaz (iz kaybolmasın); çürükse ya da ölçüm kurulamıyorsa hizalama — aşağıdaki dayanaksız-sapma hükmü işler. (Ayrımın evi: `research-phase` Adım 2 → "Devraldığın daralmayı ölç"; verify Adım 2c ile aynı ayrım.)
  - **Dayanağı olmayan sapma hizalanmaz** — o bir bulgudur, Adım 7 triyajına gider (dokümanı gözlenene uydurmak kusuru spesifikasyona çevirir; o gövde sonraki fazın UAT senaryolarının ve audit-product'ın "olması gereken" kaynağıdır).
  - Sapma feature'ın PRD davranış kuralına iniyorsa modül dokümanını hizala ama **PRD'ye dokunma** — PRD versiyon ortasında donuktur, kullanıcıya `/devflow:prd-note` öner.
- **docs/DECISIONS.md:** Fazda alınan önemli kararları ekle (append-only — eski kararlar silinmez; bir karar geçersizleştiyse yenisi eklenir ve eski "Superseded by ..." notuyla işaretlenir).
- **MEMORY:** Retrospektiften çıkan çapraz öğrenimleri memory'ye ekle — her biri için `_dev/memory/<slug>.md` oluştur/güncelle ve `_dev/MEMORY.md` index'ine pointer ekle. Her review'da güncelleme zorunlu değil.
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
- PHASE-N.md **Task Listesi** tablosuna ⬜ olarak ekle
- DURUM **Task Durumu (Aktif Faz)** tablosuna ⬜ olarak ekle ve **Aktif Task** alanını yeni düzeltme task'ına yönlendir (Adım = `task` zaten Adım 6'da set edilir; tabloya ekleme yapılmazsa next/run-task "hepsi ✅" sanıp düzeltme task'ını atlar)

### 8. Git Commit & Push

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
```

Eğer bu faz senaryo testi fazıysa (Adım 6 alanı `prd_review_bekliyor`'a çekti):
- **Önce yayın boşluğunu ölç** (aşağıdaki alt başlık), sonra ölçüme göre öner:
```
✅ Faz N (Senaryo Testi) review tamamlandı. Versiyon sonu fazları tamamlandı!
📋 Sıradaki adım: [ölçüm > 0 ise: /devflow:quick (yayın türü) | değilse: /devflow:prd-review]
   → [ölçüm > 0: <N> commit henüz yayınlanmadı; prd-review yayından sonra
      | değilse: versiyon değerlendirmesi için yeni bir oturum başlat]
```

#### Yayın boşluğu ölçümü

**Ne zaman:** versiyon kapanışının iki çıkışında — yukarıdaki senaryo-testi dalında ve aşağıdaki "proje tamamlandı" dalında. **Yalnız `_dev/GIT-STRATEJI.md`'de bir yayın hattı beyanlıysa** (çalışma ve yayın dalı ayrıysa); tek dallı projede bu ölçüm atlanır.

Versiyon kapanıyor — bu, çalışma dalında birikenlerin yayına çıkma anıdır. Beyan edilen dal adlarıyla ölç:

```bash
YAYIN=<GIT-STRATEJI'deki yayın dalı>; CALISMA=<GIT-STRATEJI'deki çalışma dalı>
REF=""
git rev-parse --verify --quiet "refs/heads/$YAYIN" >/dev/null 2>&1 && REF="refs/heads/$YAYIN"
[ -z "$REF" ] && git rev-parse --verify --quiet "refs/remotes/origin/$YAYIN" >/dev/null 2>&1 && REF="refs/remotes/origin/$YAYIN"
if [ -z "$REF" ]; then
  echo "ÖLÇÜLEMEDİ: yayın dalı ('$YAYIN') ne yerelde ne uzakta bulunamadı"
elif ! git rev-parse --verify --quiet "refs/heads/$CALISMA" >/dev/null 2>&1; then
  echo "ÖLÇÜLEMEDİ: çalışma dalı ('$CALISMA') yerelde bulunamadı"
else
  git log --oneline "$REF..refs/heads/$CALISMA" | wc -l   # yayınlanmamış commit sayısı
fi
```

Tam ref yolları (`refs/heads/…`) bilinçlidir: çıplak ad, yayın dalıyla aynı adı taşıyan bir **tag**'e çözülüp yanlış sayı üretir; `origin/` dalı ise yayın başka bir kopyadan yapıldığında tek doğru kaynaktır.

- **Sonuç > 0** → yayın henüz yapılmamış. Kullanıcıya sayıyı söyle ve sıradaki adım olarak **yayını** öner (`/devflow:quick`, yayın türü); prd-review ondan **sonra** gelir. Gerekçe: yayın kod donmasına aittir, PRD defterinin kapanmasına değil — ve teslim DevFlow-dışıysa prd-review zaten bilinçli ertelenebilir, o bekleme yayını da bekletmemeli.
- **Sonuç = 0** → yayın zaten yapılmış; doğrudan prd-review öner.
- **Çıktı `ÖLÇÜLEMEDİ:` ile başlıyorsa** bu **0 değildir** — dal adı yanlış ya da dal yok demektir; "ölçemedim" de, nedenini kullanıcıya bildir, sayı uydurma. Aynısı boş çıktı için de geçerlidir.
- **Çıktıda `fatal` görürsen basılan sayı bir ölçüm değildir.** `| wc -l` **her zaman** bir sayı basar — `git log` hata verdiğinde bile `0` yazar. Yani "sayı basmadı mı" diye bakmak yetmez; `fatal` satırı varsa sonucu at ve yukarıdaki gibi bildir. (İki `rev-parse --verify` kapısı bu hâli normalde önler; kontrol, kapıların kaçırdığı vakalar içindir.)

**Akışı kesme** — ölçüm bir kapı değil, hatırlatmadır: çıktıyı üret, hatırlatmayı oturum kapanış bloğunun «Sıradaki oturumdan önce» satırına da yaz (CLAUDE.md → Oturum Kapanışı). Komut zinciri yazma; yayın akışının kendisi GIT-STRATEJI'de yaşar ve tetiği kullanıcı çeker.

*(Bu ölçüm olmadığında görülen saha davranışı: versiyon kapanışları arka arkaya birikip yayın dalına hiç taşınmıyor ve bu ancak aylar sonra fark ediliyor.)*

> **Teslim DevFlow-dışıysa (go-live/mağaza onayı/müşteri kabulü beklemede):** prd-review'u teslim sonrasına bilinçli erteleme seçeneğini kullanıcıya hatırlat — teslim deneyimi (ilk kullanıcı tepkisi, mağaza reddi) değerlendirmeye girdi olur. State `prd_review_bekliyor`'da güvenle bekler (`next` önerir, çalıştırmaz); erteleme atlama değildir, zorunluluk kalkmaz.

**Sonraki faz varsa (faz tamamlandı):**
```
✅ Faz N review tamamlandı. Retrospektif ve kalite kontrol faz dokümanına yazıldı.
📋 Sıradaki adım: /devflow:discuss-phase
   → Sonraki fazın kapsam tartışması için yeni bir oturum başlat.
```

**Son fazsa (proje tamamlandıysa):** önce yayın boşluğunu ölç (yukarıdaki alt başlık) — proje tamamlanıyorsa yayınlanmamış iş kalması en pahalı hâldir.
```
✅ Faz N review tamamlandı. Tüm fazlar başarıyla tamamlandı!
🎉 Proje tamamlandı. Tebrikler!
📋 Sıradaki adım: [ölçüm > 0 ise: /devflow:quick (yayın türü) — <N> commit henüz yayınlanmadı | değilse: yok — proje tamamlandı]
```

---

## Önemli Kurallar

- Review sırasında kod değiştirme — sadece değerlendir ve raporla
- Retrospektif dürüst olmalı — sadece olumlu değil, sorunları da yaz
- **Kalite kontrolleri ara durak değildir** — sonuç tabloya yazılır, bulgu Adım 7'ye akar, akış kullanıcıdan "devam" beklemeden sürer. Onay kapıları yalnız bilinçli karar noktalarıdır (Adım 5b boyut önerisi, Adım 7 task onayı)
