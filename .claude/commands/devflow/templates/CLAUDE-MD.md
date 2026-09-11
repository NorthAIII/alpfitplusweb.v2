# [PROJE_ADI] — Claude Code Talimatları

**Proje:** [Kısa proje açıklaması]
**Repo:** `[REPO_YOLU]`
**DevFlow Dokümanları:** `[REPO_YOLU]/_dev/`

---

## Doktrin Dosyaları

Bu dosyanın doktrin bölümleri dört alt-dokümana bölünmüştür. Dördü de aşağıda **import edilir** — içerikleri oturum başında bu dosyayla birlikte bağlama girer, yani pointer bir okuma borcu değil, dosya düzeni kararıdır. Aşağıdaki bölümlerde her birinin **self-yeten özeti** durur; tam metin çocuk dokümandadır. Satırlar `@` ile başlamalıdır — backtick içine alınan bir `@` satırı import ÇALIŞTIRMAZ ve doktrin sessizce bağlam dışında kalır.

@_dev/claude/DOKUMAN-KURALLARI.md
@_dev/claude/DOKUMAN-DISIPLINI.md
@_dev/claude/CALISMA-PRENSIPLERI.md
@_dev/claude/COMMIT.md

<!-- KURAL: Bu blok CLAUDE.md'nin (kökte ya da `.claude/` altında — yer kararı kickoff-verify Adım 3'tedir) bölme pointer listesidir (kanon: _dev/claude/DOKUMAN-DISIPLINI.md → Boyut ve Bölünme). Kesim motorda sabittir; projede çocuk eklenmez/çıkarılmaz. Motor kesimi değiştirirse bu liste, ilgili bölüm özeti ve _dev/INDEX.md hiyerarşi kaydı BİRLİKTE güncellenir — üçü ayrı düşerse doktrin ya bağlama girmez ya haritadan kaybolur. -->

---

## DevFlow Nedir?

Bu proje DevFlow sistemiyle yönetilmektedir. DevFlow, slash command tabanlı bir proje yönetim sistemidir. Tüm geliştirme dokümanları `_dev/` klasöründedir. Komutlar `.claude/commands/devflow/` klasöründedir.

**Temel Felsefe:**
- Her oturum ayrı, context temiz kalır
- Task dokümanı detaylı, iş paketi küçük
- Az context = yüksek kalite
- Her şey kayıt altında

---

## Dil

Bu projenin çalışma dili Türkçe.

- **Kullanıcıyla Türkçe konuş** — tüm yanıtlar, açıklamalar ve sorular Türkçe.
- **DevFlow dokümanlarını Türkçe doldur** — `_dev/` altındaki tüm dokümanlar Türkçe.

> Tek istisna commit mesajlarıdır: açıklama İngilizce yazılır (→ Commit Convention).

---

## Oturum Başlangıç Protokolü

Her oturum başında MUTLAKA şu dokümanları oku (okuma anı ve komutsuz oturum → aşağıda "Okuma onayı"):

1. `_dev/OVERVIEW.md` — Proje kimliği
2. `_dev/INDEX.md` — Doküman haritası
3. `_dev/DURUM.md` — Aktif durum (faz, task, ilerleme)
4. `_dev/MEMORY.md` — Proje hafızası **index'i** (birikmiş öğrenimlerin pointer'ları; detay `_dev/memory/<slug>.md` dosyalarında, gerekince lazy-load edilir)
5. `_dev/GIT-STRATEJI.md` — Bu projenin dal modeli, çalışma dalı, commit/push ve yayın kuralları (her oturum commit & push kararı verir; hangi dala yazıldığı buradan bilinir)

**Eksik okuma yasağı:** Bu listede veya sonradan okunan herhangi bir `_dev/` dokümanında Read uyarı/hata verirse kör deneme yapma — `doc-scan.sh` + `grep` ile haritalayıp hedefli parçalı okumayla tamamını kapsa; o da çalışmıyorsa dur, kullanıcıya bildir, yardım iste — yarım okuyup veya atlayarak devam etme. (Detay: Çalışma Prensipleri #10.)

**Memory Migration:** `_dev/MEMORY.md` yoksa template'ten oluştur (index formatı). Claude Code'un local memory'sinde (`~/.claude/`) projeye özgü bilgi varsa (teknik tuzaklar, tercihler, öğrenimler vb.) `_dev/memory/`'ye taşı — **konusu aynı olanlar tek atomda toplanır, gerekmedikçe yeni dosya açılmaz**; index'e atom başına bir pointer eklenir (kanca yalnız hak testini geçerse). Böylece tüm proje bilgisi repo içinde kalır. (Sistem detayı: `.claude/commands/devflow/lib/memory-sistemi.md` — lazy okunur; MEMORY.md yalnız index'tir.)

**Native memory yönlendirmesi:** Proje bilgisi native (yerleşik) memory'de değil `_dev/`'de tutulur; bunu kalıcı kılmak için projenin native memory index'ine bir yönlendirme yazılır — kurulumunu/yenilemesini `kickoff-verify`, drift kontrolünü `audit-docs` yapar. **Değişmez kural:** native'e yönlendirme yazılmadan önce orada bilgi varsa ÖNCE `_dev/memory/`'ye taşınır (taşımadan üzerine yazma yok). Bu, DevFlow'un repo dışına yazdığı **tek** şeydir (bilinçli harness entegrasyonu); native memory proje-bazlı olduğu için içeriği bu projeye aittir.

**Aktif task varsa** (DURUM.md'den öğren) — `run-phase` hariç, → Öncelik:
6. `_dev/tasks/TASKS-README.md` — Task sistemi kuralları
7. Aktif task dokümanı

**Projeye özgü sabit dokümanlar** (her oturumda oku — `run-phase` hariç, → Öncelik):
<!-- KURAL: Buraya yalnızca görevden bağımsız, gerçekten HER OTURUM yön veren dokümanlar girer (örn. stil/işleyiş kuralları). Tarihsel (DECISIONS), göreve-göre veya gerektiğinde-okunan doküman buraya değil — INDEX senaryolarına/lazy-load'a gider (az context = yüksek kalite). Liste ~2-3'ü aşarsa şişme sinyalidir (rehber eşik, mahkûmiyet değil): audit raporlar, açık onayla budanır (INDEX'teki ayna bölümüyle birlikte). -->
- [PROJEYE_ÖZGÜ — örn: _dev/STYLE-GUIDE.md, _dev/ISLEYIS-VE-KURALLAR.md]

Göreve göre ek dokümanlar gerekirse → INDEX.md'deki senaryolara bak.

### Protokol ve `/devflow:` Komutları Arasındaki İlişki

- **Öncelik:** Tüm `/devflow:` komutlarında bu protokol, komutun kendi "Okunacak Dosyalar" listesinden **önce** uygulanır. Komut listesi protokolün üstüne **ek** niteliktedir, yerine geçmez. **`run-phase` istisnası:** işi dağıttığı için TASKS-README, aktif task dokümanı ve projeye özgü sabitler kapsamı dışındadır.
- **Eksik dosya kuralı:** Protokol listesindeki bir dosya henüz yoksa (ilk kurulum senaryoları — örn. `/devflow:prd` ilk oturumu, `/devflow:kickoff`) atla; mevcut olanlar okunur. **"Hata değildir" yalnız o senaryonun hükmüdür** — kurulu projede aynı yokluk sinyaldir ve sessiz geçilmez (ayrımın tam metni: aşağıda → Okuma onayı → "Dosya **yoksa**").
- **Tekrarsızlık kuralı:** Komut dosyaları protokolün **1-5. maddelerindeki** çekirdek dosyaları kendi "Okunacak Dosyalar" listesinde tekrar etmez. Komutlar yalnızca **komuta özgü ek** dosyaları listeler.
- **Okuma onayı (görünür kapı):** Komutun "Yapılacaklar" listesindeki **ilk adıma geçmeden önce** protokolü + komutun "Okunacak Dosyalar" listesini uygula ve **tek satırlık okuma-onayı** yaz; her zorunlu dosyayı tek tek işaretle:
  `Okuma: OVERVIEW ✓ · INDEX ✓ · DURUM ✓ · MEMORY ✓ · GIT-STRATEJI ✓ (dal: <aktif dal>) | <varsa: projeye özgü sabitler + task dosyaları> ✓ | <komuta özgü ek dosyalar> ✓`
  - **Dal yankısı:** `GIT-STRATEJI` slotunda parantez içinde **aktif dalı** yaz — değeri `git status`'tan gelir; o çıktı Paralel Oturum Farkındalığı gereği zaten okunuyor, ek komut gerekmez. Aktif dal, GIT-STRATEJI'de beyan edilen **çalışma dalı değilse dur** ve kullanıcıya sor — komut adımlarına geçme, commit etme. (Beyan edilmiş bir yayın dalındaysan bu, işin o dalda bilinçli başlatıldığı anlamına gelebilir; kullanıcı söyler.)
  - Bir dosya **tek slotta** işaretlenir — çekirdek beş dosya her zaman kendi adlı slotunda; onların dışında komutun kendi "Okunacak Dosyalar" listesinde de geçen dosya komuta özgü slotta sayılır.
  - Dosya **yoksa** `—` ile işaretle (`OVERVIEW —`). İlk kurulum senaryosunda yokluk hata değildir; **kurulu projede** zorunlu dosyanın yokluğu sinyaldir — sessiz geçme: kullanıcıya tek satırla bildir ve onarım rotasını işaret et (dosyayı doğuran komut; kurulum eksiklerini `/devflow:kickoff-verify` Adım 2 tamamlar; **`_dev/DURUM.md` hiç yoksa** proje başlatılmamıştır — **komut adımlarına geçme**, rotayı söyle ve dur: `/devflow:kickoff`, PRD'li akışta `/devflow:prd`).
  - Dosya **yarım/parçalı** okunduysa (Read truncate/PARTIAL) ✓ **yazma** — Çalışma Prensipleri #10'u uygula (doc-scan + hedefli parçalı oku), tamamı kapsanmadan onaylama; çözülemiyorsa dur ve kullanıcıya bildir.
  - **Kapı iki yönlüdür:** onay satırı yazılmadan komutun ilk adımına geçilmez — ve yazıldıktan sonra da durulmaz. Bu satır **kullanıcı onayı değil kendi beyanındır**; "tamam" bekleme, aynı turda Adım 1'e geç. (Adım 1'in kendisi kullanıcıya soru soruyorsa duruş oradan gelir, kapıdan değil.) **Kapı dışı komutlar:** (a) **okunacak protokol dosyası bulunmayan** kurulum komutları — ölçüt komutun adı değil dosyaların varlığıdır (`map-codebase`; kickoff ailesi bu ölçütle kip kip ayrışır, bir kısmında parent zaten vardır); (b) oturum-sonu komutları (`pause`, `double-check`, `prd-save`) — protokol oturumda zaten uygulanmıştır (ana komutun Adım 0'ı ya da aşağıdaki komutsuz tetik), bunlar tekrar tetiklemez; hiç uygulanmadıysa komut ihtiyacı olan çekirdeği kendisi okur.
  - **Komutsuz oturum:** Kapıyı ateşleyen Adım 0'lar komut dosyalarındadır; **kapıyı ateşleyen bir komut çalışmadıysa** (hiç komut yok, ya da komutun Adım 0'ı yok — `step-by-step`/`guide-me`) ateşleyen de yoktur — ama protokol yine geçerlidir. **Tetik ilk proje sorusudur:** cevap vermek için projenin durumuna, koduna ya da dokümanına bakman gerekiyorsa, **cevaptan önce** çekirdek dosyaları oku ve onay satırını yaz (sonuna `| kapı ateşlenmedi`). Selamlaşma, DevFlow'un kendi kullanımı ve projeden bağımsız sorular hiçbir şey okutmaz; ölçüt: bakmadan cevaplayamıyorsan tetiklenmiştir. Oturum sonradan **kapılı** bir komuta dönerse onay satırını **o komut yeniden yazar** (bağlamdakiler tekrar okunmaz, komuta özgü ek dosyalar okunur) — "zaten okumuştum" atlama gerekçesi değildir.

---

## Doküman Kuralları

Tüm geliştirme dokümanları `_dev/` klasöründedir; projenin kendi dokümanlarıyla (README.md, docs/ vb.) **KARIŞMAZ** — `_dev/` izolasyonunu her zaman koru. Dokümanlar üç sınıftır: **Dokunulmaz Dokümanlar** (`tasks/TASKS-README.md` — çekirdek protokol; **+ varsa projeye özgü sabitler, tam liste çocukta**), **Korumalı Dokümanlar** (OVERVIEW, ILKELER, GIT-STRATEJI — sınıfın koruduğu anlam ve yöndür: içerik işlemi onay ister, kap işlemi yapılır ama asla sessizce değil), **Rutin Güncellenen Dokümanlar** (INDEX, DURUM, aktif task). **Tarihsel/append-only doküman kuralı** — içerik dondurulur, biçim güncellenebilir. **Bayatlama notu** — statik/korumalı doküman rutin işte değişmez, tam da bu yüzden sessizce gerçeklikten kopar; çözüm dokunmamak değil **bilinçli mutabakattır** (`audit-docs` tarar, açık onayınla günceller — ILKELER bunun dışındadır, o prd-review'da ele alınır).

**Tam metin → `_dev/claude/DOKUMAN-KURALLARI.md`** (yukarıda import edildi).

---

## Doküman Disiplini

DevFlow dokümanları yaşayan dokümanlardır ve bu bölüm altı alt-başlık taşır:

- **Çıkarma Disiplini** — ekleme kadar çıkarma da disiplinlidir: **soft delete yasak**, mezuniyet zorunlu, KURAL yorumları silinmez.
- **Tarih Koruma Gerekçesi Değildir** — bir bilginin tarih taşıması onu koruma gerekçesi değildir; geçersizse silinir.
- **Format ve Sıkıştırma** — paragrafları doğru böl; 3+ düşünceyi tek satıra sıkıştırma. **Uzun-satır bayrağından boyut kalemi doğmaz** (yapı kulvarı ayrıdır ve canlıdır); muafiyet ölçümde değil hükümdedir.
- **Boyut ve Bölünme** — her yaşayan doküman **tek Read çağrısıyla okunabilir** kalmalı (rehber eşikler çocukta); eşiği aşan doküman teşhis edilir ve **temizlenir, bölünür ya da supabına mezun edilir** — "idare eder" yoktur. **Çizginin altında boyut işi yoktur** — gereken içerik önce yazılır; önleyici sıkıştırma, erken bölme ve "pay kalsın diye" budama yapılmaz, çünkü çizgi *sığmıyor* değil **sığmama riski** demektir. **Bölünmeyen dokümanlar** vardır: snapshot/kanvas/index sınıfı (DURUM, SESSION-NOTES, INDEX, MEMORY index'i, BULGULAR index'i, OVERVIEW, VERSIONS, NOTES, MODULE-MAP) bölünmez — değerleri tek ince yüzey olmalarıdır; orada teşhis her zaman şişme ya da meşru birikimdir, çare temizlik ya da supap (üyelerin supapları çocukta). Çözüm o an uygulanamıyorsa **geçici doluluk bilinçli kabul edilir ve raporlanır — çıkmaz ilan edilmez**. Ölçüt tek yönlüdür: **doküman sayısının artması maliyet değildir**, tek maliyet tek seferde okunamayan dokümandır. **Kök `CLAUDE.md` doktrin parent'ıdır** — o da bölünür, ama tire-ekli alt-dokümanla değil `_dev/claude/` çocukları + `@import` ile; kesim motorda sabittir, projede yeniden kararlaştırılmaz. **Tarihsel doküman yaşarken bölünür** — kapanış damgası almış faz dokümanı (PHASES'te `✅` ya da `⚠️`) dokunulmazdır; bölme gerekiyorsa faz **hâlâ aktifken** yapılır.
- **Onay Ölçütü** — bir işlem için onay gerekip gerekmediğini işlemin ağırlığı değil **doğru cevabın nerede yazılı olduğu** belirler. **Kap işlemi** (bölme, atomizasyon, şişme temizliği/mezuniyet, migration, eksik bölüm/KURAL'ın geri konması, kırık bağ onarımı, kanonun adıyla yasakladığı kalıntının sökülmesi) içeriği değil kabı değiştirir ve dört koşulu birden sağlıyorsa **sorulmaz, yapılır ve raporlanır**: **tetik gösterilebilir** · kesim kurallı (kanon/template/dokümanın kendi `##` bölüm sınırları, ve **tek sonuç veriyor**) · içerik korunuyor (taşınır ya da kanonik evinde zaten duruyordur) · aksi yönde kayıt yok. **İçerik işlemi** (yaşayan iddianın düzeltilmesi, bilinçli olabilecek sapmanın template'e çekilmesi, tarihsel dokümanın anlamı) her hâlükârda sorudur; koşullardan biri düşerse kap işlemi de sorudur. **Doküman sınıfı ölçütü daraltır** — Korumalı Dokümanlar'da içerik işlemi kanıt kesin olsa da onay ister. Metin yazmak (parent özeti) karar değil icradır, kulvarı belirlemez. Ölçüt onay kapısını kaldırmaz, **daraltır**. **Kaydın evi** — iki ayrı kayıt vardır, alternatif değil: *kap kararı* (bölme ertelendi/reddedildi) KURAL yorumuna, *boyut kabulü* (kalan doluluk) `accept-size`'a; koşulları çocukta. **Bildirim onayın yerine geçer, kaydın yerine geçmez** — yapılan iş raporda tek satır olarak görünür; geri alma isteği geldiğinde üçü birden yapılır: değişiklik geri alınır · karar kayda geçirilir · denetim kuyruğu gerçekle uzlaştırılır (yoksa sıradaki tur aynı işlemi bir kez daha uygular; tarifi `.claude/commands/devflow/lib/audit-rapor.md` → kural 9).
- **Bilginin Doğru Evi** — her bilgi türünün bir **evi** vardır; yanlış eve yazılan bilgi hem orayı şişirir hem doğru yerde bulunmaz.

**Tam metin → `_dev/claude/DOKUMAN-DISIPLINI.md`** (yukarıda import edildi).

---

## Oturum Disiplini

### Planlama Oturumu:
- Faz kapsamı analiz edilir, task dokümanları oluşturulur
- **Task çalıştırılmaz** — planlama biter, oturum kapanır
- Planlama biter bitmez ilk task'i çalıştırmaya BAŞLAMA

### Task Oturumu:
- **Tek bir task'e** odaklanılır, bitirilir, oturum kapatılır
- İkinci task'e GEÇİLMEZ
- Her task sonunda sırasıyla: test → doküman güncelleme → commit & push

### Faz Planlaması:
- Bir seferde **sadece 1 faz** planlanır
- Sonraki faz ancak mevcut faz review'ı tamamlandıktan sonra planlanır

### Oturum Kapanışı:

Her oturumun **son çıktısı** şu bloktur — komutun kendi kapanış şablonunda görünmese bile yazılır. **Nihai blok oturumun son sözüdür:** altına başka satır gelmez, yeni iş başlatılmaz. Oturum `double-check` / `pause` / `prd-save` ile kapanıyorsa nihai blok **onlarındır** — ana komutun bloğu ara çıktıya iner, son söz kapatan komutundur.

```
<✅|⚠️|⏸️> [oturumun sonucu — tek cümle]
📋 Sıradaki adım: /devflow:[komut]
   → [gerekçe — tek satır]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

İlk üç satırın metnini komutun kendi kapanış şablonu belirler (özet ve gerekçe komuta özgüdür); `→` gerekçesi gerekirse birkaç satır sürer ve `yok` dalında hiç yazılmaz. **Son satır her komutta aynı kurala tabidir ve atlanmaz** — iş yoksa açıkça `yok` yazılır.

**Satırın adı zamanlama söylemez; zamanlamayı önek söyler.** «Açık kalemler» satırın *içeriğini* söyler; **yeri diyagramda sabittir — bloğun son satırı**. Kalemin ne zaman yapılacağı önekindedir: `engel:` sıradaki adımdan önce, `önerilir:` paralel ya da sonra. **Sıradaki adımı açan komut yalnız `📋` satırındadır** — bu satırda da çalıştırılabilir komutlar durur (`önerilir: /devflow:quick QUICK-NNN — …`), ama `📋`'ye terfi etmiş bir iş burada **tekrarlanmaz** (→ Terfi kuralı).

**Blok üretmeyen komutlar vardır ve bu bir eksik değil tanımdır.** Ölçüt sayı değil, komutun kendi başına bir oturum kapatıp kapatmadığıdır: `help` (bilgi ekranı — proje durumunu okumaz, türetecek sıradaki adımı yoktur), `step-by-step` ve `guide-me` (oturum-ortası kip komutları — bloğu içinde çalıştıkları komut yazar), `resume` (bloğu devraldığı komut yazar). Oturum yalnız bunlarla geçtiyse iş de üretilmemiştir; kapanış istenirse `/devflow:pause` yazar (iş üretmemiş oturum dalı). **Soru sorup duran oturum da blok yazmaz** — oturum kapanmamıştır, cevabı bekler; cevap gelmez ve oturum kapanırsa bloğu yine `/devflow:pause` yazar.

- **Terfi kuralı — iki satır tek kararın iki yüzüdür:** engelleyen iş `📋` satırına **terfi eder**. «Açık kalemler» satırındaki bir kalem sıradaki adımın çalıştırılmasını engelliyorsa `📋` satırı o adımı göstermez:
  - **İşin bir DevFlow komutu varsa `📋 Sıradaki adım` odur** (`/devflow:quick QUICK-NNN`, `/devflow:audit-docs`, `/devflow:kickoff-verify` …); faz döngüsünün komutu `→` satırında "ondan sonra" diye anılır. **Terfi eden iş iki satırda tekrarlanmaz** — «Açık kalemler» satırından düşer; başka kalem kalmadıysa satır `yok` olur.
  - **İş DevFlow-dışıysa** (kullanıcının kendi hamlesi: deploy/go-live, mağaza onayı, müşteri kabulü, üçüncü tarafın cevabı) terfi edecek komut yoktur: `📋 Sıradaki adım: yok — [bekleme koşulu]` yazılır, iş «Açık kalemler» satırında `engel:` önekiyle durur.
  - **Birden çok engelleyen iş varsa** `📋` satırı **önce yapılması gerekeni** gösterir; kalanlar satırda `engel:` önekiyle durur ve sırası gelince kendi oturumunu alır. **Adaylardan biri bekleyen bir ⬜/🔄 QUICK kaydıysa o kaydın `## Ne Yapılacak` bölümünü hedefli oku** — kaydı açan komut oraya bir öncelik hükmü yazmış olabilir ("X bundan sonra gelir"; en belirgin hâli `review-phase`'in yayın kaydıdır), ve hüküm varsa kayıt önce gelir. Hangisinin önce geldiği belli değilse bu bir sorudur — bloğu yazmadan sor.
  - **Ölçüt, kalem son satıra hiç uğramasa da uygulanır.** Bir komut bir işi doğrudan `📋`'ye yazıyorsa (kendi şablonunda öyle yazıyor diye) soru yine aynıdır: **o iş sıradaki adımı gerçekten önceliyor mu?** Önceliyorsa terfi meşrudur ve iş son satırda tekrarlanmaz; öncelemiyorsa `📋` faz komutunda kalır ve iş `önerilir:` önekiyle son satıra iner. Terfi, şablonun değil ölçütün kararıdır.
  - **Kayıt açmak terfi demek değildir.** `⬜ Bekliyor` bir kayıt açıldıysa (aşağıdaki ön-hazırlık kuralı) kulvarını yine yukarıdaki ölçüt belirler: iş sıradaki adımı **engelliyorsa** `📋` odur; engellemiyorsa `📋` faz komutunda kalır ve kayıt son satıra `önerilir:` önekiyle **kimlik argümanıyla** iner (`önerilir: /devflow:quick QUICK-NNN — <iş>`). Kaydın işi, işi *taşımaktır* — sırayı belirlemek değil. Kural döngü-dışı oturumlara özgü de değildir — faz döngüsü komutları da kayıt açar (örn. `review-phase`'in yayın kaydı, ki o **engelleyicidir** ve terfi eder).
  - **Açıldıktan sonra kaydı görünür kılan iki şey vardır:** klasörü tarayan komutların taraması (ölçüt: kendi akışında `_dev/tasks/quick/`'e bakan her komut) ve **kaydı açan oturumun kapanış bloğu**. Bu yüzden kimlik argümanı (`/devflow:quick QUICK-NNN`) satırın kendi kendine yetmesinin tek yoludur. Faz döngüsü komutlarının kendi kapanışında `quick/` taraması **yoktur ve beklenmez**.
- **Kalem öneki kulvarını söyler ve kapalı kümedir:** `engel:` (sıradaki adım bu iş bitmeden çalıştırılmaz) · `önerilir:` (sıradaki adımı engellemez — onunla paralel ya da ondan sonra yapılabilir). **Öneksiz kalem yazılmaz;** hangisi olduğuna karar veremiyorsan bu bir sorudur, bloğu yazmadan oturum içinde sor.
- **Satırın biçimi ayrıştırılabilir olmak zorundadır.** Birden çok kalem ` · ` ile ayrılır ve **kalemin kendi metni o ayracı içeremez**; kalemin içi `<önek>: <komut ya da iş> — <açıklama>` ve `—` kalem başına en çok bir kezdir. Hiç kalem yoksa satırın tamamı `yok`tur. **Satırı tanıyan şey konumu değil etiketidir** (`Açık kalemler:`) — blokta iki amblem kümesi kesişir (özet `<✅|⚠️|⏸️>`, bu satır `<⚠️|💡|✅>`), ve `→` gerekçesi birkaç satır sürebildiği için baştan sayan bir okuma bozulur.
- **Amblem satırın adı değil durumudur** ve tek girdisi kalemlerin kulvarıdır: `engel:` kalemi varsa `⚠️` · yalnız `önerilir:` kalemi varsa `💡` · satır `yok` ise `✅`. Kırmızı ışık yalnız gerçekten bekleyen bir şey varken yanar, yanlış alarm kurulmaz.
- Satırın evi kullanıcı-tarafı ve taze-oturum işleridir (onay, deploy/go-live, fresh oturumda audit önerisi). Oturum içinde laf arasında dile getirilen "şu yapılmalı" türü işler burada görünür olur — hızlı bakan kullanıcı yalnız bu bloğa bakar. **Yazım kendi kendine yetmeli** — sonraki oturum satırı okuyup başlayabilsin; ayrıntı başka dosyadaysa onu da an.
- **Kendi yapabileceğin oturum-içi işi satıra yazma — yap, sonra bloğu yaz**; onayına bağlıysa yazıp bırakma, **sor** ("şimdi yapayım mı?"). Blok ancak oturumun kendi yükümlülükleri bitince yazılabilir.
- **Ön-hazırlık — sıradaki oturumun işi netse dokümanını şimdi hazırla, tarif etmekle yetinme.** (Bir üstteki madde işin *kendisini* bu oturumda yapmayı emreder; bu madde, bu oturumda **yapılmayacak** işin — yapılamayanın da bilinçle ertelenenin de — *anlatımını* burada tamamlamayı.) Bloğa giren her iş, onu yapacak oturumun **hangi komutla açılacağını** da söylemek zorundadır. İşin kendi komutu varsa komut yeter (`audit-docs`, `audit-product`, `prd-note`, `prd-review`, `kickoff-verify` — o komut ne yapacağını kendi bilir; ayrıca doküman açılmaz). **Kendi komutu olmayan, faz döngüsü dışı bir iş ise evi `quick`'tir ve kaydı bu oturumda açılır:** `_dev/tasks/quick/QUICK-NNN-<konu>.md` (format, numaralama ve `⬜ Bekliyor` durumu: `quick` → Adım 3). **Kaydı komutun Commit & Push adımından ÖNCE yaz:** kapanış bloğu her komutta commit'ten *sonraki* adımdır, kayıt oraya bırakılırsa o commit onu kapsamaz ve dosya ağaçta izlenmeyen kalır — sonraki oturum onu Paralel Oturum Farkındalığı gereği "benim değil" sayıp dokunmaz, yani hazırlanan iş repoya hiç girmez (aynı gerekçe: `review-phase` Adım 6'nın DURUM notu). Kararı ancak commit'ten sonra doğuran bir ölçüm varsa kayıt **kendi küçük commit'ini** alır; ağaçta commit'siz bırakma. "Ne Yapılacak" bölümü sonraki oturumun **tek okumayla başlayabileceği** kadar dolu yazılır — ne, neden, nerede, ne zaman bitmiş sayılır — sonra komut **kimlik argümanıyla** verilir (`/devflow:quick QUICK-NNN`) — hangi satırda duracağını yukarıdaki ölçüt söyler. Kaydı yazmak yeni iş yapmak değildir; **anlatmayı sonraki oturuma bırakmak** bilgiyi oturumla birlikte kaybetmektir.
  - **Dört koşul birden sağlanmıyorsa kayıt açma, işi satırda tarif et** (o hâlde komut kimliksiz kalır: `önerilir: <iş> — /devflow:quick ile`; kaydı işi alan oturum açar)**:** ① iş bu oturumda kesinleşti — ne yapılacağı varsayım gerektirmiyor · ② evi gerçekten `quick` — faz döngüsünün bir adımı ya da kendi komutu olan bir iş değil · ③ bu oturumda yapılmayacak — ya yapılamıyor (oturum tipi izin vermiyor, taze oturum gerekiyor, bağlam doldu) ya da **kullanıcı bilinçle sonraya bıraktı**; teknik olarak yapılabiliyor *ve* kullanıcı ertelemediyse bir üstteki madde geçerlidir, **yap** · ④ kullanıcı işi reddetmedi. ①'de belirsizlik varsa **sor**; varsayımla açılan kayıt sonraki oturuma yanlış iş yaptırır.
  - **Sınır — kanvasla karıştırma.** Ayıran şey işin *ne olduğu* değil, **kararın verilmiş olup olmadığıdır:** ne yapılacağı belli ve yalnız zamanı sonraya bırakıldıysa ⬜ QUICK kaydıdır; **görülen ama daha ne yapılacağı kararlaşmamış** bir sorun/uyarı `_dev/BULGULAR.md` → Gelen Kutusu'na düşer ve triyajını bekler (Çalışma Prensipleri #12), PRD/vizyon düzeyi fikir `prd-note`'a gider. "Bir ara bakılsa iyi olur" kanvasın işidir; "şunu yapacağız, ama sonra" quick kaydının.
- Blok, DURUM'a az önce yazılan durumun insan-okur yankısıdır; **durum tarifinde** (hangi faz, hangi adım, hangi task) çelişirse DURUM kazanır. **Terfi etmiş komut bu çelişkinin dışındadır:** faz döngüsü dışı iş DURUM'un `Adım` alanında iz bırakmaz, yani DURUM onu ne bilir ne yalanlar — `Adım` faz döngüsünün konumunu söyler, sıradaki hamlenin tamamını değil. **Bu yüzden terfi eden işin kalıcı evi şarttır:** satırın kendisi bir kayıt yeri değildir (Duraklatma Notu, BULGULAR, QUICK kaydı, state alanları), ve iş yalnız o ev sayesinde sonraki oturumda görünür olur. Ev yoksa iş bloğun görünürlüğüyle birlikte kaybolur.
- **Komut önerisine konum argümanı yazılmaz** — faz döngüsü komutları konumu DURUM'dan alır (`/devflow:verify-phase 41` değil `/devflow:verify-phase`). **İstisna — kimlik argümanı:** sürdürülecek ya da hazırlanmış iş DURUM'da konum tutmuyorsa ve aynı anda birden çok açık kaydı olabiliyorsa, komut **hangi kaydın** çalıştırılacağını taşır: `/devflow:quick QUICK-135`. Ölçüt yasağın kendi gerekçesidir — DURUM zaten biliyorsa argüman gereksiz tekrardır, bilmiyorsa satırın kendi kendine yetmesinin tek yolu odur. (**Parantezli kip notu argüman değildir** ve yasağın dışındadır: `/devflow:quick (yayın türü)` biçimindeki bir not komuta ne yazılacağını değil hangi kipte çalışacağını söyler. **Kaydı olan iş için kip notu değil kimlik argümanı yazılır** — kip notu yalnız gösterilecek bir kayıt yokken kalır.)
- **`📋` satırının etiketi tek biçimlidir** — `Sıradaki adım:`. Duraklatma ve kayıt oturumlarında da aynı etiket kullanılır; "devam ediyorsun" nüansı üstteki özet satırının işidir. **Satır tek komut taşır** — "şunu ya da bunu" yazılmaz; hangisi olduğunu yazan komut bilir.
- **Türetmeden önce duraklatmaya bak — kapı odur:** DURUM'da Duraklatma Notu doluysa ya da Aktif Task durumu `⏸️` ise sıradaki komut `Adım`'dan değil o kayıttan gelir: `/devflow:resume`. Aşağıdaki türetme ancak duraklatma yokken koşar.
- **Faz döngüsünün sıradaki komutu DURUM'un `Adım` alanından türer** ve satıra **adıyla** yazılır: `discuss` → `discuss-phase` · `research` → `research-phase` · `plan` → `plan-phase` · `verify-plan` → `verify-plan` · `task` → `run-task` · `verify` → `verify-phase` · `review` → `review-phase`. Faz komutları kendi kapanışlarında bunu zaten yazar; türetme, faz döngüsünün **konumunu değiştirmeyen** oturumlar içindir.
- **Alan sahada saf enum değildir — önce ayıkla.** Biçimlendirme işaretlerini at (`**` · `*` · `` ` ``); sonra **değer, alanın başından ilk açıklama ayracına kadarki parçadır** (ayraçlar `—` · `(` · `→`, üçü de bu kadar; tire ayraç değildir, `verify-plan` bölünmez), gerisi açıklamadır: `**task** — sıradaki adım: …` `task`tır. Ayıklamadan sonra geriye hiçbir şey ya da yalnız bir tire kalıyorsa değer **boş**tur; **alanın kendisi hiç yoksa bu boş değil ölçülemedi'dir** — komut yazma. ⚠️ **Attığın kuyruğa bir kez bak:** kuyruk normalde açıklamadır ve hükmü doğrular, ama değerin gösterdiği komutun **sıradaki hamle olmadığını** söylüyorsa (örn. *"sıradaki hamle bir DevFlow komutu değil"*, ya da ondan önce yapılması gereken **DevFlow-dışı** bir işi adıyla sayıyorsa) o kuyruk açıklama değil **duruş sebebidir**: komut yazma, hâli ham metniyle söyle. **İşin bir DevFlow komutu varsa bu duruş değil terfidir** → Terfi kuralı.
- **Eşleme tek başına yetmez — dört özel durum:** `Adım = task` iken Task Durumu tablosunda ⬜/🔄 satır kalmadıysa komut `verify-phase`'dir (`❌ İptal` ve `⏸️` çalıştırılacak iş değildir, sayılmaz — ama geriye ⏸️ satır kaldıysa komut yazma, hâli söyle); tabloda `🔴 Bloke` satırı varsa komut yazma, durumu raporla — **ikisi birlikte tutuyorsa** (bekleyen satır yok **ve** bloke satırı var) hüküm `🔴 Bloke` kolunundur, komut yazma; **tablo tekil değilse — hiç yoksa ya da birden çoksa — bu iki okuma da yapılmaz; yokluk da çokluk da sıfır değildir**, komut yazma ve gördüğün hâli söyle (aynı ayrım, bir üstteki madde: alanın yokluğu boş değil ölçülemedi'dir) · `Adım = plan` iken tabloda ✅ ya da kesilen 🔄 task görmek **çelişki değildir** (plan revizyonu) — komut yine `plan-phase` · `Adım` boş **ve** Versiyon Sonu Durumu `prd_review_bekliyor` ise komut `/devflow:prd-review` · `Adım` boş ama Versiyon Sonu Durumu başka bir değerdeyse bu **versiyon-geçişi sınırıdır ve komut yazılmaz** — ayak izi birden çok anlama gelir (yeni versiyonun ilk `discuss-phase`'i · re-kickoff bekleniyor · harici teslim/go-live beklemede) ve hangisi olduğunu kullanıcı bilir. **Dördünün hiçbirine oturmuyorsa** — alan boş, tanımadığın bir değerde ya da tablolarla çelişiyor — **komut uydurma:** `yok — [bekleme koşulu]` yaz ve gördüğün hâli tek satırla söyle. Aynı hüküm, türetmenin **kaynağı** bu projede henüz yoksa da geçerlidir (motor yeni güncellendi, doküman göçü bekliyor): türetme, `önerilir: /devflow:audit-docs` kalemiyle birlikte `yok`a düşer.
- Net sıradaki komut yoksa: `📋 Sıradaki adım: yok — [bekleme koşulu]`. Döngü-dışı oturumlarda (quick, audit-docs, audit-product, progress, prd-note) varsayılan, faz döngüsünün **yukarıdaki türetmeden çıkan komutudur** — **ama yalnız devralınacak yarım ya da hazırlanmış iş yoksa**: varsa sıradaki komut onu çalıştıran komuttur (`/devflow:quick QUICK-NNN`), çünkü faz döngüsü dışında kalan iş `Adım` alanında iz bırakmaz ve o türetme onu göremez. **Bunu bilmenin tek yolu bakmaktır ve emrin evi burasıdır: bloğu yazmadan önce `_dev/tasks/quick/`'e tek `grep` at**, Durum'u ⬜/🔄 olan kayıt ara — tek `grep`'tir, hiçbir komutun okuma listesine girmez. **Emir bu maddede sayılan komutlarla sınırlı değildir:** kapanış bloğu yazan ve faz döngüsünün konumunu değiştirmeyen her oturum — `pause`'un iş-üretmemiş dalı dahil — aynı taramayı yapar. Komut dosyaları bunu yalnız kendi akışlarına özgü gerekçeyle tekrar edebilir, hükmü buradan alır. (Bu bir terfi değil **varsayılanın seçimidir:** döngü-dışı oturumun yerinden edeceği bir faz adımı yoktur; terfi ölçütü ancak `📋`'de tutulacak bir adım varken işler.) Duraklatma kapısı burada da geçerlidir ve türetmenin önünde durur (yukarıda).

---

## Çalışma Prensipleri

Otonom çalış ama **şüphede sor**; halüsinasyon yapma, acele etme, varsayımları sorgula. **Bilgi havuzunu güncel tut** (#6) — önemli kararlar `_dev/docs/DECISIONS.md`'ye yazılır. **Test atlanmaz** (#7), riskli komut çalıştırılmaz (#8), `_dev/` izolasyonu korunur (#9). **Hiçbir dosya yarım veya atlanarak okunmaz** (#10) — Read tam getirmezse görünür `PARTIAL:` notu yaz ve kurtarma akışını işlet; kör deneme yapma. Boşluk varsa önce araştır, sonra sor (#11). **Gördüğün sorunu düşürme** (#12) — kapsam dışı bir sorun/uyarı fark edersen işini kesme ama düşürme de: `_dev/BULGULAR.md` → Gelen Kutusu'na kaynak işaretli tek satır düş. **Kullanıcının diliyle konuş** (#13) — soru ve rapor **pratik karşılığıyla** kurulur (ne değişecek, ne kaybolacak, hangi iş nasıl görünecek); teknik terim yerine davranış, doküman iç-referansı yerine sonuç. `_dev/` dokümanları ve template'ler **Claude'un çalışma belleğidir** — kullanıcının onları okuduğunu varsayma; doküman/bölüm/alan adı, satır numarası ve motor terimi bir soruyu kuramaz, en fazla kalemin sonunda izlenebilirlik için durur. (İç-referans değildir: `TASK-X.YY` · `PHASE-N` · `QUICK-NNN` · `B-NNN` iş birimleridir, ürün gerçekliğini gösteren çapa da kanıttır.) Ölçüt: kullanıcı hiçbir dokümanı açmadan karar verebilmeli.

**Tam metin → `_dev/claude/CALISMA-PRENSIPLERI.md`** (yukarıda import edildi).

---

## Task Boyutu Felsefesi

**Task dokümanı detaylı, iş paketi küçük.** Her task tek oturumda, dar odakla, 1-3 dosya değişikliğiyle bitecek boyutta olmalı; "önce şunu sonra bunu" diye bölünebiliyorsa bölünmeli — ama yan yana yapılması gereken (birbirine bağımlı) işler aynı task'te kalabilir. Task sayısının fazlalığı sorun değil.

**Tam metin → `_dev/claude/CALISMA-PRENSIPLERI.md`** (yukarıda import edildi).

---

## Dokümantasyon İlkeleri

Doküman oluşturmaktan çekinme, ama **bir bilgi tek yerde olsun** — diğer yerlerden referans ver. **İleriye dönük düşün** — sonra lazım olacak bilgi için şimdiden doküman aç. Yeni içerik dokümanı açtığında INDEX.md'yi güncelle; INDEX'e yalnız **mevcut** dokümanları yaz. Projeye özgü her bilgi `_dev/` içinde tutulur (Claude Code'un local memory'si proje bilgisi için kullanılmaz).

**Tam metin → `_dev/claude/DOKUMAN-KURALLARI.md`** (yukarıda import edildi).

---

## Task Tamamlanma Sırası

Her task bittiğinde sabit sıra izlenir (**ATLANMAZ**): test → task dokümanı → DURUM + faz dokümanı → (gerekirse) MEMORY → archive → commit & push → oturum kapanır. **İkinci task'e geçilmez.**

**Tam metin → `_dev/claude/CALISMA-PRENSIPLERI.md`** (yukarıda import edildi).

---

## Commit Stratejisi

**Bir oturum = bir commit** (varsayılan tutum); kod ve doküman **aynı** commit'te toplanır. Hedef dal her zaman bulunduğun daldır ve `_dev/GIT-STRATEJI.md`'de beyanlıdır — **commit'ten hemen önce aktif dalı ve index'i doğrula** (`git status -sb`), beyan edilen çalışma dalı değilse commit etme, dur ve sor. **Push oturumun son işidir** — bir oturum kendi push'unun sonucunu beklemez. **Paralel Oturum Farkındalığı** — aynı repoda eşzamanlı başka bir oturum olabilir: commit kapsamı bu oturumun dokunduğu dosyalardır, stage her zaman dosya bazlıdır ve **index'e yalnız commit anında iş eklenir** (taşıma dahil: arşivleme düz `mv`'dir, `git mv` değil). **`git add -A` / `git add .` / `git commit -a` ayrıca kullanma** — onlar zamanı değil **kapsamı** ihlal eder, ağaç-geneli yıkıcı komut (`reset --hard`, `stash`, `checkout -- .`) çalıştırma.

**Tam metin → `_dev/claude/COMMIT.md`** (yukarıda import edildi).

---

## Commit Convention

Type prefix zorunlu (`feat`/`fix`/`refactor`/`docs`/`test`/`chore`). Faz task'larında scope task numarasıdır (`feat(TASK-X.YY): …`), faz oturumlarında `phase-N`, quick mode'da scope yazılmaz. Açıklama İngilizce, küçük harfle başlar, nokta ile bitmez.

**Tam metin → `_dev/claude/COMMIT.md`** (yukarıda import edildi).

---

## DevFlow Komutları

Kullanıcı `/devflow:` ile başlayan komutlar kullanabilir. Komut dosyaları `.claude/commands/devflow/` klasöründedir.

**PRD:** `prd`, `prd-refine`, `prd-save`, `prd-note`, `prd-review`
**Proje Başlatma:** `kickoff`, `kickoff-docs`, `kickoff-verify`, `map-codebase`
**Faz Döngüsü:** `discuss-phase`, `research-phase`, `plan-phase`, `verify-plan`, `run-task`, `verify-phase`, `review-phase`
**Yardımcı:** `run-phase`, `quick`, `pause`, `resume`, `progress`, `double-check`, `audit-docs`, `audit-product`, `step-by-step`, `guide-me`, `help`

---

## Dokunulmazlar

Bu dosyaları değiştirme (kullanıcı izni olmadan):
- [Projeye göre belirlenecek — .env, config dosyaları, migration'lar vb.]

---

## Projeye Özgü Kurallar

[PROJEYE_ÖZGÜ_KURALLAR — örnekler:]
[- Tailwind v4 kullanılıyor, v3 syntax'ı KULLANMA]
[- TypeScript strict mode]
[- Tailwind işi → önce _dev/docs/TAILWIND-REFERANS.md oku]

---

*Bu doküman statiktir. Dinamik bilgiler (aktif task, ilerleme) için `_dev/DURUM.md`'ye bak.*
