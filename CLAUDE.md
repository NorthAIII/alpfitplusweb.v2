# Alpfit Plus Web Sitesi v2 — Claude Code Talimatları

**Proje:** `alpfitplus.com` için sıfırdan yazılan tanıtım sitesi (Next.js 16 + Tailwind 4); canlı v1 sitesinden **bağımsız** repo, Vercel'de ayrı proje olacak
**Repo:** `/home/kivanc/projects/Alpfitplus website.v2` → github.com/NorthAIII/alpfitplusweb.v2 (özel)
**DevFlow Dokümanları:** `/home/kivanc/projects/Alpfitplus website.v2/_dev/`

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
- **Commit mesajları da Türkçe** — bu projede istisna yok; kullanıcının kuralı (→ Commit Convention).

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
- `_dev/docs/CLAIMS.md` — İddia sınırı: ne söylenir, ne söylenmez; rakip adsızlığı; tek kaynak sabitleri
- `_dev/docs/STYLE-GUIDE.md` — Tokenlar, tipografi ve düzen tuzakları, kullanıcının tasarım refleksleri

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

<!-- KURAL: `### Oturum Kapanışı:` gövdesi motorun güncel şablonundan ESKİDİR ve göçü 2026-09-22 audit-docs turunda ÖLÇÜLEREK ertelendi (bilinçli). Ölçüm: dolgu +13.353 karakter ≈ +7.901 token; parent 12.928 → ~22,9k token, yani kırmızı çizginin (20k) ÜSTÜNE çıkıyor. Kanonun bu hâl için adıyla verdiği çare "önce bölme"dir (lib/claude-md-bolme.md → Dolgu sırası — önce bölme) ama bu projede bölme kanalı TÜKENMİŞTİR: proje tam bölünmüş (dört çocuk + @import), kesim motorda sabit ve `Oturum Disiplini`'nin doktrin çocuğu yok — motorun kendi parent template'i de 20.114 token, yani kök neden motor düzeyindedir ve rotası DevFlow'un kendi deposudur. Aynı gerekçeyle ertelenen iki bağımlı kalem: _dev/claude/CALISMA-PRENSIPLERI.md #10 adım 4 («Açık kalemler» satırına atıf) ve #12'nin «Ön-hazırlık» atfı. Açık kayıt: _dev/BULGULAR.md → Gelen Kutusu. -->

Her oturumun **son çıktısı** şu bloktur — komutun kendi kapanış şablonunda görünmese bile yazılır:

```
📋 Sıradaki adım: /devflow:[komut]
<⚠️|✅> Sıradaki oturumdan önce: [iş — kim yapacak — nasıl: komut/hamle] | yok
```

- **«Sıradaki oturumdan önce» satırı atlanmaz** — iş yoksa açıkça `yok` yazılır. **Amblem satırın adı değil durumudur:** satırda bir iş varsa `⚠️`, yalnız `yok` yazıyorsa `✅` — iş yokken yeşil ışık yanar, yanlış alarm kurulmaz. Evi kullanıcı-tarafı ve taze-oturum işleridir (onay, deploy/go-live, fresh oturumda audit önerisi); zorunlu olmayan hatırlatma `önerilir:` önekiyle girer. Oturum içinde laf arasında dile getirilen "şu yapılmalı" türü işler burada görünür olur — hızlı bakan kullanıcı yalnız bu bloğa bakar. **Yazım kendi kendine yetmeli** — sonraki oturum satırı okuyup başlayabilsin; ayrıntı başka dosyadaysa onu da an.
- **Kendi yapabileceğin oturum-içi işi satıra yazma — yap, sonra bloğu yaz**; onayına bağlıysa yazıp bırakma, **sor** ("şimdi yapayım mı?"). Blok ancak oturumun kendi yükümlülükleri bitince yazılabilir.
- Blok, DURUM'a az önce yazılan durumun insan-okur yankısıdır; çelişirse DURUM kazanır. Satırın kendisi bir kayıt yeri değildir — bloklayan iş kalıcı evine de yazılır (Duraklatma Notu, BULGULAR, state alanları); bu satır yalnız son-görünür özettir.
- **Komut önerisine argüman/faz numarası yazılmaz** — komutlar konumu DURUM'dan alır (`/devflow:verify-phase 41` değil `/devflow:verify-phase`).
- Net sıradaki komut yoksa: `📋 Sıradaki adım: yok — [bekleme koşulu]`. Döngü-dışı oturumlarda (quick, audit-docs, audit-product, progress, prd-note) varsayılan öneri, faz döngüsünün **DURUM'un `Adım` alanından türeyen** komutudur (`discuss` → `discuss-phase` · `research` → `research-phase` · `plan` → `plan-phase` · `verify-plan` → `verify-plan` · `task` → `run-task` · `verify` → `verify-phase` · `review` → `review-phase`); alan boş ya da tanımadığın bir değerdeyse komut uydurma, `yok — [bekleme koşulu]` yaz.

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

Type prefix zorunlu (`feat`/`fix`/`refactor`/`docs`/`test`/`chore`). Faz task'larında scope task numarasıdır (`feat(TASK-X.YY): …`), faz oturumlarında `phase-N`, quick mode'da scope yazılmaz. Açıklama **Türkçe** (proje-özgü sapma, kaydı çocukta): ne yapıldığını ve **neden** yapıldığını söyler, ölçüm varsa rakamı yazar; küçük harfle başlar, nokta ile bitmez.

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

| Yol | Neden |
|-----|-------|
| `../Alpfitplus-website.v1` | **Canlı site** (v1, Astro). Yalnızca okunur; Vercel projesi `alpfitplus-website` de dokunulmazdır — alan adı geçişinde arşivlenir, silinmez. |
| `../Alpfit.v1` | Ürünün kod tabanı. Yalnızca okunur; demo ekranları buradan `:ro` mount ile render edilir. |
| `../alpfit-plus-satis` | Satış ve rekabet dosyaları. Yalnızca okunur; iddia ve fiyat sınırlarının kaynağı. |
| `.env*` | Sırlar. Repoda yalnız `.env.example` (anahtar adları, değer yok). |
| `public/product/`, `public/fonts/` | Betik çıktısı — elle dosya konmaz, düzenlenmez (`render-product.mjs`, `font-subset.mjs`). |
| `.claude/commands/devflow/**` | Vendored DevFlow motoru; her kurulumda yeniden iner, düzenlenmez. |

---

## Projeye Özgü Kurallar

### İddia sınırı — pazarlık konusu değil

Tablo **tek evde**: `_dev/docs/CLAIMS.md` (her oturumda okunur). Özü: ürün **pilot aşamada**; rakip adı sitede geçmez; ROI, müşteri sayısı, yüzde iyileşme yok; "sadece bizde" yok. Pilot iddiası yalnız `src/content/site.ts` → `PRODUCT_STATUS`, fiyat yalnız `src/content/pricing.ts` — başka yerde yeniden yazılmaz.

### Çalışma ortamı — Docker

Her şey Docker içinde koşar.

```bash
docker compose up -d web                               # geliştirme → localhost:3000
docker compose exec web npm run build                  # üretim derlemesi
docker compose --profile prod up -d --build web-prod   # üretim imajı → localhost:3100
docker compose --profile lead up -d lead-store          # yerel lead deposu provası (TASK-1.17)
```

- **Yeni bir rota klasörü eklediğinde `docker compose restart web` gerekir.** Bind-mount üzerinde Turbopack yeni dizinleri sıcak yakalamıyor; 404 görüyorsan önce bunu dene.
- **Port 3001 kullanılmaz** — makinede başka bir proje tutuyor. Üretim 3100'de.
- **`lead-store` yalnız profille kalkar** ve host portu yayınlamaz — erişim compose ağı içinden (`http://lead-store:8090`). Kaldırma/silme, token üretimi ve tuzaklar: `_dev/memory/yerel-lead-deposu-docker-profili.md`.

### Ölçüm betikleri — iş bitmeden koştur

Altısı araştırma konteynerinde, `npm test` **`web` konteynerinde** koşar:

```bash
docker compose --profile research run --rm research node scripts/<betik>
docker compose exec web npm test                       # Vitest — web konteynerinde
```

| Betik | Ne ölçer | Geçme şartı |
|---|---|---|
| `a11y.mjs` | Kontrast, h1, alt metni, adsız link/buton (16 rota, yayın kopyasına karşı) | `✓ KAPI YEŞİL — 16 sayfada 0` **ve çıkış kodu 0** |
| `mobile-audit.mjs` | Yatay kaydırma, taşan eleman, dokunma hedefi (16 rota, yayın kopyasına karşı) | `✓ KAPI YEŞİL — 16 sayfada 0` **ve çıkış kodu 0** |
| `font-guard.mjs` | Font kapsaması (üretim konteynerine karşı) | kümede olmayan karakter yok |
| `perf.mjs` | TTFB, FCP, LCP, CLS, sayfa ağırlığı | üretim konteyneri (3100) ayakta olmalı |
| `scan.mjs <yol> <etiket> <en> <boy>` | Sayfayı ekran ekran gezer, konsol hatası toplar | konsol temiz |
| `render-product.mjs` | Ürün ekran görüntülerini üretir | denetim: sızıntı yok |
| `npm test` (Vitest, `tests/`) | Aşama türetimi + `/api/demo` sözleşme bataryası + yetenek/iddia kapıları + yasal beyan kapısı + depo sözleşme paketi (ikisi env'le, aşağı bak) | çıkış kodu 0 |

Başlangıç çizgisi (regresyon eşiği) `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar'da; ölçüm sonucu rakamıyla task/faz dokümanına yazılır.

- **Dört betik yayın kopyasına (3100) bakar** — `a11y.mjs`, `mobile-audit.mjs`, `font-guard.mjs`, `perf.mjs`. Konteyner uzun ömürlüdür ve kendiliğinden yeniden derlenmez: `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz**, `docker compose --profile prod up -d web-prod` gerekir. İlk üçü `BASE` env'i taşır (`BASE=http://localhost:3000` ile geliştirme sunucusuna yönlenir); `a11y` ve `mobile-audit` ayrıca `ROTALAR` ile elle liste alır — o kaçış yolu kaynağı değiştirir, kapsam eşiğini değiştirmez.
- **Ürün görselleri elle konmaz.** `render-product.mjs` üretir; eski marka, gerçek sporcu adı ve karşılanmayan iddiayı temizler, sızıntı kalırsa **üretim durur**.
- **Fotoğraflar** Pexels lisanslı; kaynak listesi `research/FOTOGRAF-KAYNAKLARI.txt` — önce listeye yaz, sonra `photos-build.mjs`.
- **Fontlar** siteye özel daraltıldı (153 karakter, 5 dosya, 95 KB). Yeni karakter girerse `font-guard.mjs` yakalar; küme `research/FONT-KARAKTER-KUMESI.txt` + `font-subset.mjs` ile genişletilir.
- **Bataryada env kapılı İKİ dal var ve ikisi de varsayılan koşumda atlanır** — `docker compose exec web npm test` bu yüzden **209 geçti + 2 atlandı** gösterir; bu arıza değil, iki kapının kapalı olmasıdır.
  - **Depo sözleşme paketi** (`tests/lead-store.contract.test.ts`, TASK-1.13) sitenin canlı `LEAD_STORE_*` anahtarlarından ayrı bir env kapısı taşır — `LEAD_CONTRACT_URL` tanımsızken atlanır. Tanımlıyken host yerel değilse (`lead-store`/`localhost`/`127.0.0.1` dışı) istek atmadan hata verir. Yerel `lead-store`'a karşı tam koşum komutu (geçici superuser dahil) dosyanın başlık yorumunda.
  - **Yasal beyan kapısının çapraz-depo dalı** (`tests/legal-consistency.test.ts` → dal 9, TASK-2.19) `LEGAL_CONTRACT_HOOKS_DIR` ile açılır; değer bir dizin yoludur, sır değil. Tam koşum: `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **216 geçti + 1 atlandı**. ⚠️ Bağlama `docker compose restart web` ile **gelmez**, `up -d web` gerekir.

### Kod kuralları

- **Metin bileşende değil `src/content/`'te.** Bileşenler içeriği okur, taşımaz; ton değişimi bileşene dokunmaz.
- **Tailwind CSS 4, CSS-first** — tokenlar `src/app/globals.css` → `@theme`; v3 `tailwind.config` sözdizimi kullanılmaz.
- **Tasarım kuralları ve tuzaklar** (Sora'da ₺ yok, sticky + `overflow-hidden`, `min-w-0`, kullanıcının reddettiği kalıplar) tek evde: `_dev/docs/STYLE-GUIDE.md`.
- **Sırlar yalnız env'de** (`LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT`, `LEAD_FILE_PATH`, `RESEND_API_KEY`, `DEMO_TO`…); istemci paketine sızmaz.
- **Vercel'de Node.js runtime** (Fluid Compute); Edge runtime kullanılmaz.

---

*Bu doküman statiktir. Dinamik bilgiler (aktif task, ilerleme) için `_dev/DURUM.md`'ye bak.*
