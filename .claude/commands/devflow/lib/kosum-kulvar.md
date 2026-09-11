# DevFlow — Koşumun Kulvarı ve Hükmü

> `/devflow:run-phase`'in **Adım 4**'ü (turun dönüşünde verilen hüküm) ve **Kulvar** bölümleri (hangi
> işin dağıtılabileceği). **Tek çağıranı odur**; ayrı dosya olmasının nedeni çağıranın tek-Read
> sınırıdır (kanon: Doküman Disiplini → Boyut ve Bölünme; ölçüt: taşınan birimin ve her çağıranın
> tek-Read'e sığması). **İkisi aynı dosyadadır çünkü aynı nesneyi yönetirler:** Adım 4 hükmünü
> Kulvar tablosundan verir, Kulvar'ın Yetkilendirme kipi ile Yer kısıtı Adım 4'ün terfisine bakar
> — ayrı dosyalara konsalardı aralarındaki her atıf dosya sınırını geçerdi.
>
> ⚠️ **İKİ AYRI EKSEN, AYNI SÖZCÜK — karıştırma.** *Koşum kulvarı* (**FAZ** | **QUICK** |
> **BULGULAR**) işin hangi kuyruktan geldiğini söyler ve 1a'da **işaretle** seçilir; sayılan
> değil, 1a'nın işaret sözlüğüdür — oraya bir değer eklenirse bu dosyaya da o turda bir bölüm
> eklenir. *Kulvar içi / kulvar dışı* ise **aktif koşum kulvarının dağıtılabilir kümesine** göre
> okunur — sözcük değişmedi, tablosu değişti. Motorun başka yerlerinde (`audit` ailesi) `kulvar`
> üçüncü bir anlamda kullanılır ve buraya hiç atıf yapmaz.
>
> **Okunma anı `kosum-zemini.md` ile aynıdır — ilk turu açmadan önce**, koşum başına bir kez: 1a'nın
> kulvar bakışı ve savunmacı kontrolleri bu dosyanın tablosuna ve Adım 4'üne bakar, yani ilk tur
> açılmadan gerekir.
>
> Bu dosyaya `Adım 4` · `Kulvar` · `Yetkilendirme kipi` · `kara liste` · `Yer kısıtı` diye atıf
> yapan evleri sayma, ölç:
> `grep -rnE 'Adım 4|Kulvar|Yetkilendirme kipi|kara liste|Yer kısıtı' commands/devflow/run-phase.md commands/devflow/lib/`
> — reçete bilinçle **dar**: `Adım 4` motor genelinde başka komutların kendi 4. adımıdır ve
> **`kulvar` bir eşadlıdır** — `audit` ailesi onu S1/S2 ve Onay Ölçütü kulvarı anlamında kullanır ve
> bu dosyaya hiç atıf yapmaz; genişletme. Kapsam içinde de gürültü vardır: `Kulvar içi` / `kulvar
> dışı` gibi **sözlük kullanımları** atıf değildir, dönen her satırın gerçekten bu dosyaya baktığını
> doğrula. **Koşum ailesinin dışından da atıf yapılır** — sayma, ölç: aynı reçeteyi
> `commands/devflow/*.md` üzerinde koştur — ve **bölüm başlıklarını ayrıca ölç**, çünkü dışarıdan
> gelen atıfların bir kısmı adıma değil başlığa bakar:
> `grep -rnE 'Kulvar — QUICK|Kulvar — BULGULAR|kosum-kulvar' commands/devflow/*.md`.
> Bu dosyanın `## Kulvar…` başlıkları o atıfların adresidir; **başlık adı değişirse dönen her ev
> aynı turda düzeltilir.** Kaç ev olduğunu buraya yazma — sayı her kulvarla değişti ve iki kez
> bayatladı.
>
> **Ters yön dar değildir:** bu dosyanın gövdesi çağıranının adım ve ölçüt numaralarına bağlıdır
> (`1a…1e` · `Adım 2/5/6/7` · `ölçüt N`). O numaralar değişirse bu dosya **aynı turda** düzeltilir;
> reçeteleri kardeş dosyaların önsözlerindedir (`kosum-zemini.md` → `1[a-e]` · `kosum-kapanisi.md`
> → `ölçüt N`) ve kapsamları bu dosyayı da içerir.

## Adım 4 — Hüküm Ver ve Sıradaki İşi Belirle

Önce durma ölçütlerine bak (→ Durma Ölçütleri); biri ateşlediyse **önce bu adımın son paragrafındaki tur-sonu iletisini yaz** (tek satır + 9(d) kalemleri), **sonra Adım 7'ye geç**. Ölçüt ateşledi diye o paragrafı atlamak, tek evi orası olan kalemleri sessizce düşürür — ve koşumu bitiren tur (ölçüt 1) tam da onları üreten turdur. **Beyan ile ölçüm çelişirse kendi başına düzeltme** — çelişkiyi ölç, kullanıcıya raporla, kararı ona bırak (`review-phase` Adım 6 ile aynı ilke: dokümanı gözlenene uydurmak kusuru spesifikasyona çevirir).

Hiçbiri ateşlemediyse sıradaki işi **iki kaynaktan** belirle; ikisi de gereklidir, çünkü hiçbiri tek başına tam değildir:

- **Kapanış bloğunun `📋 Sıradaki adım:` satırı** — **terfiyi yalnız o taşır.** Faz döngüsü dışı iş DURUM'un `Adım` alanında iz bırakmaz (kanon: CLAUDE.md → Oturum Kapanışı), yani engelleyen bir denetim ya da quick işi yalnız burada görünür.
- **Kulvarın kendi konum kaynağı** — ve ilk turda tek kaynak (henüz blok yoktur). ⚠️ **Bu kaynak kulvara göre değişir, çünkü kulvarın nesnesi değişir:** FAZ kulvarında DURUM'un `Adım` alanıdır — *faz döngüsündeki* konumun tek yetkili kaynağı; QUICK kulvarında dağıtılan **kaydın kendi `**Durum:**` alanıdır** (→ `## Kulvar — QUICK`); BULGULAR kulvarında dağıtılan **bulgunun index satırıdır** (→ `## Kulvar — BULGULAR`). *"Konum `Adım`'da okunur"* faz döngüsünün hükmüdür, koşumun geneli değil: quick ve bulgu işleri o alana **tanım gereği dokunmaz** (`quick.md` Adım 4), yani orada aranan konum hiçbir zaman görünmez. Aynı ayrım koşumun **ilerlemesi, sonu ve sırası** için de geçerlidir — dördünün kulvar karşılığı, o kulvarın kendi bölümündeki ilk tablodadır. ⚠️ **`**Durum:**` üç ayrı nesneye işaret eder ve enum'ları ayrıktır** — quick kaydınınki (⬜/🔄/⏸️/✅/❌), bulgu atomununki (`Açık` / `→ Faz N` / `→ TASK-X.YY` / `✅ Çözüldü`) ve index satırının **hiç taşımadığı** alan; birini ötekinin yerine okuma.

**Hüküm listesinden ÖNCE bir bakış — bu kalem `📋`'ye değil son satıra bakar, yani aşağıdaki dallarla aynı anda tutabilir ve onlardan önce ölçülür:** son satırda `önerilir: /devflow:audit-docs` kalemi varsa o kalem `📋`'ye terfi etmemiştir ve ölçüt 2 onu görmez (ölçüt yalnız `engel:` önekini ve `📋`'yi okur) — **ama görünmez sayma.** **Tek okumaya sığmayan** bir doküman koşum içinde **yalnız bu satırda** görünür: motor işareti adıyla ve `önerilir:` önekiyle emrediyor (`templates/claude/CALISMA-PRENSIPLERI.md` #10.4 · `run-task` Adım 9), ve `lib/boyut-kapisi.md`'nin dört çağıranı arasında `run-task` **yoktur** — yani bir task turunda doğan doküman kendi turunda hiçbir boyut kapısına uğramaz. Turu **kulvara dönmeden önce** aç (Adım 2); yetki için ayrıca sorma — Yetkilendirme kipinin (i) istisnası aynı komut için zaten verilmiştir (kullanıcı kararı, 2026-08-29). Tur kapanınca aşağıdaki hükme dön. ⚠️ **Aynı işaret bir sonraki turda yine gelirse turu İKİNCİ kez açma ve koşumu da DURDURMA** — kalem `önerilir:` kulvarındadır, tanımı gereği engellemez: kulvara devam et ve kalemi Adım 7'nin kapanış raporuna taşı (`lib/kosum-kapanisi.md`: son satır, koşumun dağıtmadığı kulvar-dışı işin de birleşimidir). Denetim turu kalemi kapatamamıştır; kararı kullanıcı kapanışta verir.
⚠️ **Bu bakışın kapsamı dardır ve sınırı ölçülmüştür:** işaretin tetiği Read'in truncate/PARTIAL uyarısıdır, kırmızı çizgi değil (`templates/claude/CALISMA-PRENSIPLERI.md` #10). Çizgiyi aşmış ama hâlâ tek Read'e sığan bir doküman bu satırda **hiç görünmez**, **ama bu, koşumun o hâli hiç görmediği anlamına gelmez:** faz dokümanı yolunda kulvarın kendi turları ölçer — `verify-phase` 6b ve `review-phase` 5b `lib/boyut-kapisi.md`'yi çağırır ve `TOKEN-SERT` bandı orada teşhise girer; kalem dönüş sözleşmesinin **boyut ertelemesi** alanıyla geri gelir (brief madde 9d) ve kapanış raporunda anılır. Görülemeyen tek nüfus **faz dokümanı dışındaki** (`_dev/docs/`, modül, PRD) dokümanlardır; onların evi koşumun dışıdır — kanvas onları bir sonraki `audit-docs` turunda `urgent:token-hard` olarak yakalar (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi). O boşluğu koşum içinde kapatmaya çalışma.


⚠️ **Aşağıdaki hükümde "kulvar" AKTİF koşum kulvarıdır** (1a'nın işareti); doğrulayan kaynak da
onunkidir: FAZ'da DURUM'un `Adım` alanı, QUICK'te kaydın `**Durum:**` alanı (→ `## Kulvar — QUICK`),
BULGULAR'da bulgunun index satırı (→ `## Kulvar — BULGULAR`). Aşağıda `Adım` yazan her yer FAZ dışı
bir kulvarda **o kulvarın kendi kaynağı** diye okunur; kulvarlar aynı koşumda birlikte koşmaz.
⚠️ **FAZ dışı kulvarlarda birinci madde (blok) konum kaynağı DEĞİLDİR** (QUICK'te `→` bir işi
ertelediğinde `📋`'nin komutu terfi eden komuttur) — gerekçe ve hüküm her kulvarın kendi bölümündedir
(`## Kulvar — QUICK` · `## Kulvar — BULGULAR` → *Adım 4'ün iki kaynağı bu kulvarda tek kaynağa iner*).

Hüküm:
- **Blok kulvar içi bir komut gösteriyor ve kulvarın kendi kaynağı onu doğruluyorsa** → dağıt (Adım 2).
- **Blok kulvar dışı bir komut gösteriyorsa** (terfi) → kararı Kulvar → Yetkilendirme kipi verir; **kip dağıt derse Kulvar → Yer kısıtını da ölç** (tek evi orasıdır). **Turun KENDİ komutunu gösteren `📋` ve koşum açılışında zaten bekleyen bir quick kaydı — terfi sayılmaz** (ölçüt 2'nin iki uyarısı; oradaki tur-talimatı istisnası ve engelleyicilik ölçütüyle birlikte) — o blok terfisiz sayılır, hüküm DURUM + Kulvar tablosundan verilir.
- **Blok `yok — <bekleme koşulu>` diyorsa** → dur (ölçüt 2).
- **İkisi çelişiyorsa** → **dur ve sor.** Kanon durum tarifi çelişkisini DURUM lehine çözer, ama burada iki ayrı arıza olabilir — alt ajan DURUM'u yanlış yazmış ya da bloğu yanlış kurmuş; ikisi de araştırma ister, otomatik düzeltilmez.
- **Blok yoksa ya da `📋` okunamıyorsa** → DURUM'un Adım'ı + Kulvar tablosu esastır; o da net değilse dur ve sor. ⚠️ **Bu dalda ölçüt 2 sıfır değil ÖLÇÜLEMEDİ'dir:** terfiyi de `engel:` beyanını da yalnız blok taşır, blok yoksa ikisi de görünmez — dağıtmadan önce engeli **raporun nesrinden** ara (Adım 3'ün içerik bakışı orada yalnız *soru* arar), engel görünüyorsa dağıtma. **Adım 6'dan gelen ölü-ajan dalında rapor da yoktur** — orada engel beyanı hiç ölçülemez: hüküm yine DURUM + Kulvar'dır, ama ölçülemediğini kapanış raporunda adıyla yaz.

Dağıtmadan önce iki savunmacı kontrol daha — **bunlar artık bu oturumun işidir**, ve ikisi de
**yalnız FAZ kulvarında** koşar: nesneleri faz döngüsünündür (Task Durumu tablosu · `Adım = task`),
FAZ dışı kulvarlarda ölçülecek bir karşılıkları yoktur ve orada koşturulurlarsa tablosu olmayan ya da
faz döngüsü dışındaki bir projede koşumu **kuyruğuyla ilgisiz bir gerekçeyle** durdururlar:
- **Task Durumu tablosunda `🔴 Bloke` satırı varsa dağıtma** — durumu raporla ve sor. ⚠️ **Ölçü TABLO SATIRIDIR, dosyada geçen dize değil:** yalnız `|` ile başlayan satırlarda ara. `templates/DURUM.md` aynı bölüme bir **`**Durum Kodları:**` legend'i** yazar ve o legend `🔴 Bloke` dizesini sağlıklı projelerin **çoğunda** taşır — yani dize araması (`grep`) bu kontrolü sağlıklı bir DURUM'da ateşletir (fail-closed). Tuzak **alete bağlıdır**: DURUM'u Read ile okuyup tabloya bakan okuma ona düşmez.
- **`Adım = task` ama tabloda ⬜/🔄 satır kalmadıysa** (ölçü yine TABLO SATIRIDIR — legend ⬜/🔄/⏸️'yi de taşır) sıradaki iş `verify-phase`'dir (`❌ İptal` çalıştırılacak iş değildir, sayılmaz). `run-task` bu hâlde Adım'ı zaten `verify`'a çeker; bu, çökmüş ya da bayat state için emniyet ağıdır. ⚠️ **`⏸️` de çalıştırılacak iş değildir ama yokluk da değildir:** ⬜/🔄 kalmamış ve geriye ⏸️ satır kalmışsa `verify-phase` **türetme** — dur ve sor (hüküm ölçüt 14'te). 1b duraklatmayı Duraklatma Notu'ndan ya da *Aktif Task*'ın ⏸️'sinden yakalar; tablodaki başka bir satırın ⏸️'si ikisine de girmez ve faz yarım işle verify'a girer. ⚠️ **Tablo tekil değilse — hiç yoksa, birden çok *Task Durumu* tablosu varsa ya da satır durumu taşımıyorsa (başlığında durum sütunu yok: özet tablo) — bu sıfır değil ölçülemedi'dir ve bu, yukarıdaki İKİ kontrol için de `Adım`'ın değerinden bağımsız geçerlidir** — dağıtma, dur ve sor (hüküm ölçüt 14'te, burada tekrarlanmaz): bağlam disiplini faz dokümanını okumayı yasakladığı için orkestratör tabloyu başka yerden doğrulayamaz.

Her tur sonunda kullanıcıya **tek satır** yaz: hangi adım koştu, ne oldu, ölçüm ne dedi. Uzun anlatı yazma; ayrıntı alt ajanın kendi raporundadır ve gerekirse istenir. **Dönüş sözleşmesi 9(d)'de sayılan kalemler bu tek-satır kuralının dışındadır ve tur biter bitmez birebir iletilir** — listeyi burada tekrarlama, tek evi orasıdır. Gerekçesi en açık olan **boyut kabulü/ertelemesidir:** onun penceresi faz ✅ damgasıyla kalıcı kapanır ve motor kullanıcının onu son kez görmesini adıyla emreder (`review-phase` 5b).

---

## Kulvar

| DURUM → Adım | Hüküm | Dağıtılacak komut |
|---|---|---|
| `task` | Kulvar içi | `run-task` |
| `verify` | Kulvar içi | `verify-phase` |
| `review` | Kulvar içi | `review-phase` |
| `discuss` · `research` · `plan` · `verify-plan` · boş | Kulvar dışı — **dur ve raporla** (fazın normal kapanışı da budur) | — |
| tanımadığın herhangi bir değer | **dur ve raporla** | — |

**Eşleşen şey, ayıklanmış değerdir** — tarifi kanondadır (CLAUDE.md → Oturum Kapanışı: süsü at, değeri ilk açıklama ayracına kadar al; boş ≠ alan yok). Burada iki eki vardır: **alanın kendisi hiç yoksa dur ve sor** (ölçüt 14'ün tablo kalemiyle aynı hüküm), ve **aynı ayıklama Duraklatma Notu'nun `Adım:` alanı için de geçerlidir** — ama oranın sözlüğü çok sözcüklü değer taşır (`task çalıştırma`), bölme. Tanınmayan değer, ayıklamadan sonra tanınmayan değerdir.

⚠️ **Kuyruğun değeri çürütmesi kanonda duruş sebebidir; burada bir karar kapısıdır.** Kanon *"komut yazma, hâli söyle"* der — koşum ise dağıtıp dağıtmayacağına karar verir: **dağıtma, hâli ham metniyle raporla ve sor** (ölçüt 13). **İki kol da yazılıdır:** kullanıcı kuyruğun **bayat olduğunu** söylerse ayıklanmış değerle dağıt ve kuyruğun düzeltilmesini kapanış raporunda an; **doğrularsa ya da cevap gelmezse** koşum durur. Yanlış ateşleme bir soruya mal olur; ateşlememe, hazırlıksız bir tura.

**Kulvar kapalı bir kümedir ve bu, drift'e karşı emniyettir:** motor faz döngüsüne yeni bir adım tanıttığında bu tablo onu tanımaz, koşum durur ve kullanıcı görür — sessizce yanlış komut dağıtılmaz. Tablonun tam hâli (yedi adımın hepsi) kanondadır — CLAUDE.md → Oturum Kapanışı, *"Faz döngüsünün sıradaki komutu"*; buradaki üç satır bilinçli olarak dardır.

**Duraklatma Notu doluysa** hüküm notun `Adım:` alanına göre verilir; değerler DURUM template'inin yazdığı biçimdedir, kendi kısaltmanı uydurma:
- **`task çalıştırma` / `review` → kulvar içi.** Dağıtım `resume`'dur (Adım 2).
- **`quick` → dur.** `resume` orada faz döngüsünü değil quick akışını sürdürür; kaydın türü kulvarın tanımadığı bir yola (yayın dalı) sapabilir. Tur talimatı bu işi yetkilendirdiyse bile kaydın `**Tür:**` alanı okunmadan tur açılmaz — **ölçüt kara listededir, alanın yokluğu dahil.**
- **Başka herhangi bir değer** (`planlama`, `verify`, tanımadığın bir yazım) **→ dur ve raporla.** `planlama` zaten DURUM'un Adım'ını kulvar dışına koyar, yani tur Adım 1a'da durmuştur; `verify` bugün sözlükte tanımlı değildir ve varsayım yapılmaz.

**Kara liste — hiçbir tur talimatıyla açılamaz:**
- `quick`'in **yayın** ve **acil düzeltme** türleri. Faz task'ı her zaman çalışma dalında kalır (`run-task` Adım 8: *"Yayın kapısı istisnası bu adımda ateşlenmez"*); yayın dalına geçiş ve doğrulama kapısı kullanıcının kararıdır. Türü ölçmek için kaydın `**Tür:**` alanına bakılır ve **ayıklanmış değer** eşleşir (yukarıdaki kural `Tür:` alanı için de geçerlidir: süsü at, değeri **ilk açıklama ayracına kadar** al). ⚠️ **Ayıklama şart, çünkü tuzak iki yönlüdür ve ikisi de sahada var:** `çalışma quick'i (yayın/acil düzeltme DEĞİL)` naif okumada `yayın` verir (**yanlış yasak**), `devir kaydı (çalışma quick'i değil — …)` naif okumada `çalışma quick'i` verir (**yanlış izin**).
  **ÖNCE PROJEYİ ÖLÇ, SONRA KAYDI — sıra bu ve tersi pahalıdır:** hüküm Adım 1c'de zaten okunmuş GIT-STRATEJI'nindir. **GIT-STRATEJI ayrı bir yayın hattı BEYAN ETMİYORSA yayın/acil düzeltme türü de YOKTUR** — beyanın *"yayın hattı: yok"* dediği hâl de bu koldur (kanon: *"beyan edilmiş 'yok' ile hiç sorulmamış aynı şey değildir"* — ikisi de bu maddeyi boşaltır, ayrım başka yerde iş görür) — bu madde tümüyle boştur, kaydın alanı ne derse desin (yok · enum içi · enum dışı) tur açılabilir ve tür hiç okunmaz. Bu öncül **üç hâlin üçünü de** kapsar; yalnız *alan yok* koluna yazılırsa enum-dışı kayıtlar tek dallı bir projede bile gereksizce durdurulur. **Yayın hattı varsa** üç hâl ayrışır:
  - **Alan yok** — tür gerçekten bilinmiyordur: dur ve sor.
  - **Ayıklanmış değer üç türden biri** (`çalışma quick'i` · `yayın` · `acil düzeltme`) — hüküm doğrudan okunur.
  - **Ayıklanmış değer üç türden biri DEĞİL** — sahada olağan hâl budur: alan projeye özgü bir sınıflandırma taşır (`devir kaydı`, `doküman hijyeni`, `bakım quick'i` gibi). **Sıfır değil ÖLÇÜLEMEDİ'dir** — *"enum dışı ⇒ yayın değildir"* okuması fail-open'dır ve motorun her yüzeyinde yasaklıdır: dur ve sor. ⚠️ **Enum'u kendi başına genişletme;** üç değer yukarıda adıyla yazılıdır, tanımlı evi `quick.md` Adım 1b'dir ve orayı bu oturum okumaz.
- `prd-review` · `kickoff` · `kickoff-docs` · `kickoff-verify` · `map-codebase` — faz döngüsünün dışındaki sınırlar.
- `pause` · `double-check` · `prd-save` — oturum-sonu komutlarıdır, bağlam-bağımlıdır, ayrı tur olarak **dağıtılamaz**. (`pause`, Adım 5'in relay çaresi içinde alt ajanın *kendi* oturumunda koşar — bu ayrı tur açmak değildir.)

**Yetkilendirme kipi.** Kulvar-dışı bir iş alt ajanın kapanış bloğunda `📋`'ye terfi ettiyse varsayılan **dur ve sor** — ve sorunun **iki kolu da yazılıdır** (aynı biçim: 1c'nin kirli-ağaç kapısı): kullanıcı **onaylarsa** turu aç (Adım 2), yetki **yalnız o tura** verilmiştir ve daimî istisnaya dönüşmez; **onaylamazsa ya da cevap gelmezse** ölçüt 2 ateşler ve koşum Adım 7 ile kapanır (`📋` terfi eden komut). İki istisna vardır: **(i)** `audit-docs` — sorulmadan koşulur (kullanıcı kararı, 2026-08-29); **(ii)** tur talimatının önden yetkilendirdiği komut (Adım 1e). **Kara liste kipin ÜÇÜ ile de açılamaz** — onay da dahil: kullanıcı bir terfiyi onaylarsa kara liste ölçümü yine koşar (yayın/acil düzeltme türü quick, kickoff ailesi, oturum-sonu komutları).
> ⚠️ **Bu kipin bedeli yazılıdır:** audit-docs'un kurallı kalemleri kullanıcı paket raporunu görmeden uygulanır ve commit'lenir; veto penceresi kapanır ve geri alma üç hamledir (değişikliği geri al · kararı kayda geçir · denetim kuyruğunu gerçekle uzlaştır — `lib/audit-rapor.md` → kural 9). Azaltıcı: turun paket raporu dönüş sözleşmesinin **zorunlu alanıdır** ve tur biter bitmez kullanıcıya birebir iletilir.

**Yer kısıtı — ölçüsü turun AÇILMASIDIR, hangi adımdan geldiği değil:** kulvar-dışı bir tur hangi yoldan gelirse gelsin (Adım 4'ün terfisi — 1e'nin önden yetkisi o terfinin sorusuna verilmiş cevaptır, ayrı bir yol değil · Adım 1b'nin duraklatma yoluyla açtığı quick turu) açmadan önce bu kısıt ölçülür. Ürün koduna dokunabilecek kulvar-dışı bir tur `verify` ile `review` arasında açılmaz — pencerenin DURUM karşılığı **`Adım = review`**'dür (`verify-phase` kapanışta Adım'ı `review`'a çeker), çünkü `review-phase` Adım 3'ün UAT-tazeliği merceği verify'ın son UAT commit'inden sonraki ürün kodu değişikliğini görür ve fazı fazladan bir verify turuna sokar. **Hüküm durmak değil ertelemektir:** turu açma, kulvar komutunu dağıt, ertelenen işi kapanış raporunda an. (`audit-docs` yalnız dokümana dokunduğu için bu kısıtın dışındadır.)

---

## Kulvar — QUICK

> **Hükümleri yalnız koşum kulvarı QUICK iken uygulanır** (işaret `KULVAR: quick`, 1a). FAZ
> kulvarında hüküm yukarıdaki `## Kulvar` bölümünündür; kulvarlar aynı koşumda birlikte koşmaz.
> Yukarıdaki bölümün **kulvar-nötr** kalemleri burada da geçerlidir ve tekrarlanmaz: ayıklanmış
> değer · Yetkilendirme kipi · kara listenin **yasağı** (aşağıda yalnız ölçümün anı değişir).
> ⚠️ **Tek istisna okumadadır, uygulamada değil:** `## Kulvar — BULGULAR` bu bölümün *Yer kısıtı*
> paragrafını **adıyla ödünç alır** — ölçütü birebir aynı olan hüküm ikinci kez yazılmaz. O
> paragrafın metni değişirse iki kulvarı birden değiştirir; ödünç alan ev aynı turda okunur.

**Kulvarın nesnesi kayıttır, `DURUM`'un `Adım` alanı değil.** Faz döngüsü dışı iş `Adım`'da iz
bırakmaz (`quick.md` Adım 4: *"DURUM.md'de aktif faz bilgisini bozmadan… quick task bir faz task'ı
değildir"*), yani koşumun **konumu · ilerlemesi · sonu · sırası** bu kulvarda kaydın kendi
alanlarından okunur:

| | FAZ kulvarı | **QUICK kulvarı** |
|---|---|---|
| **konum** | `Adım` + `Aktif Task` + Task Durumu tablosu | dağıtılan kaydın kimliği + kaydın `**Durum:**` alanı |
| **ilerleme** | o üç alandan biri değişti | **commit üretildi** ya da **kaydın `**Durum:**` alanı değişti** |
| **son** | `Adım` kulvar dışına geçti | 1a'nın sabit listesinde dağıtılabilir kayıt kalmadı |
| **sıra** | DURUM + kapanış bloğu | aşağıdaki **Sıra** hükmü |

⚠️ **Atıf niteleyicisi iki sütunda da aynıdır:** değişim **bu koşumun turlarına atfedilebilir**
olmalı (Adım 3'ün atıf ayrımı); *"önce"* değeri `git show <tur çapası>:<kaydın yolu>` ile alınır
(aynı disiplin: brief madde 9). ⚠️ **DURUM'un *Son Güncelleme* satırı bu ölçüye GİRMEZ** — o,
kaydın insan-okur yankısıdır (`quick.md` Adım 4) ve **sahibi yoktur — birden çok komut onu
üzerine yazar** (sayma, ölç: `grep -rl 'Son Güncelleme' commands/devflow/*.md`, sonra her isabetin
DURUM'un o satırını mı yazdığını doğrula), yani bayat kaldığında ilerleme sanılır. Bu satır ilerleme sayılırsa yalnız ölçüt 7 değil, **Adım 6'nın
üç-koşullu kapısının orta koşulu** da (dolayısıyla ölçüt 9) körleşir — o kapıda orta koşul bu
tablonun **Durum** ayağıdır; commit ayağı birinci koşulun kendisidir, yani BULGULAR'daki çakışma burada yoktur.

### Kulvar tablosu — QUICK

| Kaydın `**Durum:**` alanı | Hüküm | Dağıtılacak komut |
|---|---|---|
| `⬜ Bekliyor` · `🔄 Devam edecek` | Kulvar içi | `quick QUICK-NNN` |
| `⏸️ Duraklatıldı` | **yalnız** DURUM'un Duraklatma Notu **o kaydı adıyla taşıyorsa** kulvar içi — ad, notun `**Detay:**` alanının **başındaki** `QUICK-NNN`'dir (yazıcısı `pause.md` Adım 2'nin quick dalı); gövdede geçen başka kimlik adlandırma değildir | `resume` |
| `⏸️` ama not onu adlandırmıyor | **kayıt-düzeyi duruş** — dağıtılmaz, koşum durmaz | — |
| `✅ Tamamlandı` · `❌ İptal` | Kulvar dışı — kuyruktan düşer, tur açılmaz | — |
| tanımadığın herhangi bir değer | **kayıt-düzeyi duruş** — dağıtılmaz, koşum durmaz | — |

⚠️ **Beşinci satır `## Kulvar`'ın aynı adlı satırından AYRILIR ve ayrım bilinçlidir:** orada tanınmayan değer koşumu durdurur, çünkü nesnesi tekil bir alandır (`Adım`) ve yanlış okunması yanlış komut dağıttırır. Burada nesne **çok üyeli bir kuyruktur**: tek bir kaydın sözlük driftli değeri (`🔄 Devam ediyor` gibi — sahada ölçüldü) koşumu öldürürse, tertemiz kayıtlar beklerken proje hiç eritilemez. ⏸️ satırının niteleyicisi aynen geçerlidir: kayıt dağıtılmaz, **ölçüt 1'i tek başına ateşletmez**, kapanış raporunda adıyla anılır.

⚠️ **SABİTLİK İKİ KATMANLIDIR — BULGULAR'la aynı biçim:** **üyelik** 1a'da donar (yeniden tarama yapılmaz; koşum ortasında doğan kayıt bu koşumda dağıtılmaz), **canlılık** ise yalnız **dağıtılacak** kayıt için, dağıtımdan **önce**, tur başına tek `grep` ile yeniden ölçülür (`grep -m1 '^\*\*Durum:\*\*' <kaydın yolu>`; yol artık yoksa — `test -f` tutmuyor — kayıt ✅/❌ ile aynı hükümle düşer, ÖLÇÜLEMEDİ yalnız dosya var ama okunamıyorsa). Gerekçe ölçüldü: paralel bir quick oturumu kaydı ✅'ya çekmiş olabilir ve bayat listeyle açılan tur, brief madde 4'ün drift çapasında **doğru** durur — ama commit'siz ve kaydın alanı değişmeden kapandığı için **ölçüt 7 ateşler**, ki o bir ölçüm duvarıdır ve onayla geçilemez: koşum sağlıklı bir kuyrukta ölür. Değer kulvar-dışı bir satıra düşmüşse (✅/❌) kayıt **kuyruktan düşer, tur açılmaz, koşum durmaz** ve kapanış raporunda anılır. ⚠️ **Canlılık dağıtım ANINI ölçer, uçuşu değil:** kayıt tur uçuştayken kapanırsa tur commit'siz döner ve koşum kapanır — kapatan commit turun çapa penceresindeyse ölçüt 4 ve 7 birlikte (Durum değişimi atfedilemez), değilse ölçüt 7 (kayıt raporda adıyla anılır); nüfus dardır ve muafiyet yazılmadı.

⚠️ **DAĞITILABİLİR KAYIT — tanım TEKTİR ve kulvarın her yerinde aynıdır** (ön koşul · sıra ·
ölçüt 1). Bir kayıt dağıtılabilirdir ⇔ **1a'nın sabit listesindedir** ve tablodaki hükmü **kulvar
içi**dir, yani: tablonun ilk satırının **ayıklanmış değerleri** (`⬜ Bekliyor` · `🔄 Devam edecek` — simge tek başına yetmez, bkz. beşinci satır) **ya da** Duraklatma Notu'nun adıyla taşıdığı bir `⏸️`. ⚠️ **`⏸️`'nin
koşulu gevşetilemez: `resume` argüman almaz** ve devralacağı işi DURUM'un **tek** Duraklatma Notu
yuvasından okur — notun adlandırmadığı bir ⏸️ kayda `resume` dağıtmak, ajanı başka bir işin
üstüne yollar. ⚠️ **Ama o duruş KAYIT DÜZEYİNDEDİR, koşumu durdurmaz:** kayıt dağıtılabilir
kümenin dışında kalır, kapanış raporunda **adıyla** anılır (hangi işin duraklatıldığı kararı
kullanıcınındır) ve **ölçüt 1'i tek başına ateşletmez** — kuyrukta dağıtılabilir kayıt varsa koşum
sürer. Koşum-düzeyi okunursa tek bir bayat ⏸️ kayıt, tertemiz kayıtlar beklerken o projedeki her
QUICK koşumunu kalıcı olarak öldürür; üstelik ön koşul kuyruğu **koşulabilir** ilan etmişken.
Kara liste ölçümü ayrı bir süzgeçtir ve **sonra**
gelir: sınıflandırılamayan kayıt dağıtılmaz ama **kuyruktan da düşmez** — 1d'nin cevabıyla geri
gelir, o yüzden ölçüt 1'i tek başına ateşletmez. İki farklı *"dağıtılabilir"* tanımı tutma; ön
koşulda ⏸️'yi sayıp ölçüt 1'de saymamak kuyruğun tükendiğini yanlış ilan eder.

**Aynı kaydın ardışık turları olağandır ve terfi değildir** — çok-oturumlu bir quick zinciri bu
kulvarın normal biçimidir (ölçüt 2'nin *"turun KENDİ komutunu gösteren `📋`"* uyarısı bunu zaten
kapsar). Sınırı ölçüt 8'in QUICK kolu çizer.

⚠️ **Adım 4'ün iki kaynağı bu kulvarda da TEK kaynağa iner — `📋` yalnız bir iz için okunur.**
Sıradaki iş **yalnız `### Sıra`'dan** gelir: kapanan turun `📋`'si kanonun döngü-dışı varsayılanıdır
(faz komutu · duraklatma kapısının `resume`'u · `yok — …`; `quick.md` Adım 6) ve kuyruk hakkında bir
şey söylemez — konum kaynağı sayılırsa çok kayıtlı sağlıklı bir kuyruk, ilk kapanan kayıttan sonra ya
terfi sorusuna ya sorusuz kapanışa düşer (ölçüldü). **Terfinin izi `→`'nın erteleme beyanıdır** (ölçüt
2 → *"Sınırı elinde tutan iz"*): `→` bir işi *"ondan sonra"* diye erteliyorsa `📋`'nin komutu terfi
eden komuttur ve hükmünü ölçüt 2 ile Yetkilendirme kipi verir; ertelemiyorsa ya da `→` yoksa terfi
yoktur, kulvara dön — ölçüt 2'nin *"`→` ikisini de söylemiyorsa … dur ve sor"* kolu açılış
muafiyetinindir. Son satırdaki `engel:` ölçüt 2'nin taban kuralıdır.

### Sıra — DETERMİNİSTİKTİR, her kayıtta sorulmaz

⚠️ `lib/kosum-kapanisi.md`'nin ①–④ engelleyicilik kuralı **`📋` seçimi** içindir ve ②'si *"hüküm
yoksa **sor**"* der; her dağıtımda uygulanırsa koşum her turda bir soruya düşer — kulvarın amacının
tersi. Bu kulvarın sırası:
1. **Önce notun adlandırdığı `⏸️`, sonra `🔄`, sonra `⬜`.** Yarım işin öne geçmesi kanonun hükmünün
   genellemesidir (CLAUDE.md → Oturum Kapanışı: döngü-dışı varsayılan *"yalnız devralınacak yarım ya da
   hazırlanmış iş yoksa"* geçerlidir); adlandırılmış `⏸️`'nin en öne geçmesi ölçüldü: devam noktası
   DURUM'un tek Not yuvasındadır ve koşumun kendi emrettiği her `pause` rotası (Adım 5 · ölçüt 10/11'in
   uçuşta ⚠️'si) o yuvayı yazar — ondan önce koşan bir tur `⏸️`'nin adını düşürür, kayıt dağıtılabilir
   kümeden çıkar.
2. Her grup içinde **kayıt numarası sırası** (eski önce).
3. Bir kaydın `## Ne Yapılacak`'ı **açık bir öncelik hükmü** taşıyorsa (kanon: Terfi kuralı — kaydı
   açan komut *"X bundan sonra gelir"* yazdıysa) o hüküm üsttedir; **iki hüküm çelişirse sor.**
   Bu hedefli okuma Bağlam disiplini'nin ölçütüne girer (lib'in orkestratöre **adıyla** emrettiği okuma).

Orkestratör *"kolay"*ı yargılamaz — o eksen motorda tanımlı değildir ve ölçülemez.

### Duraklatma Notu — bu kulvarda dal TERSİNE döner
- **`quick` → kulvar içi.** Dağıtım `resume`'dur (Adım 2); kaydın türü yine kara listeden geçer.
- **`task çalıştırma` / `review` → kulvar dışı.** Faz işidir ve bu koşum onu dağıtmaz: dur ve raporla.
- **Başka herhangi bir değer → dur ve raporla** (yukarıdaki hükmün aynısı; varsayım yapılmaz).

### Kara liste — yasağı aynı, ÖLÇÜMÜN ANI değişir
Yasak değişmez (yayın/acil düzeltme türleri · kickoff ailesi · oturum-sonu komutları). Ama bu
kulvarın **her turu** bir quick kaydı dağıtır, yani tür ölçümü tur başına bir duruş üretirdi.
⇒ Ölçüm **1a'da, taranan her kayıt için bir kez** koşar; sınıflandırılamayan kayıtlar **1d'nin
tablosuna** girer ve kullanıcıya **tek soruda** sorulur — cevap koşum boyunca geçerlidir ve her
brief'e girer. Sınıflandırılamayan kayıt dağıtılmaz.

### Yer kısıtı — ölçüm TUR BAŞINADIR, koşum başına değil
Kısıtın kendi ölçüsü zaten *"turun AÇILMASI"*dır ve bu kulvarda **korunur**: `Adım` değeri Adım
3'te her tur zaten okunuyor, ek maliyet yoktur. ⚠️ **Koşum başına tek ölçüm YETMEZ** — bu kulvar
tanımı gereği arkada bir faz koşumu koşarken açılır ve o koşumun `verify-phase` turu `Adım`'ı
koşum ortasında `review`'a çeker; açılışta ölçen bir kapı tam da korumaya çalıştığı pencereyi
kaçırır. **`Adım = review` görülen turda yeni kulvar turu açılmaz.** Yalnız dokümana dokunan bir
kayıt da ayrılmaz: orkestratör bir kaydın ürün koduna dokunup dokunmayacağını **ölçemez** (kaydın
gövdesi Bağlam disiplini'nin dışındadır), ve ölçemediğini varsaymaz.

⚠️ **Hüküm bu kulvarda ERTELEMEK DEĞİL DURMAKTIR — FAZ'ın çaresi burada döngüseldir.** Orada
*"turu açma, kulvar komutunu dağıt"* denir; QUICK'te dağıtılacak başka bir kulvar komutu **yoktur**
ve kısıt kayda değil **koşumun tamamına** bakar ⇒ *"ertele"* okunursa koşum ne ilerler ne biter,
sonsuza dek boş tur döndürür. Doğru hüküm: kalan kuyruğu ve ertelenen kayıtları raporla ve
**koşumu kapat** (ölçüt 13; bekleme koşulu: *faz döngüsünün `review` penceresi*). Pencere
koşum **açılışında** kapalıysa hiç tur açılmaz; **koşum ortasında** kapanırsa — arkadaki faz
koşumu `Adım`'ı çektiği için olağan hâl budur — o turdan sonra kapanılır.

---

## Kulvar — BULGULAR

> **Hükümleri yalnız koşum kulvarı BULGULAR iken uygulanır** (işaret `KULVAR: bulgular`, 1a).
> `## Kulvar`'ın **kulvar-nötr** kalemleri burada da geçerlidir ve tekrarlanmaz: ayıklanmış değer ·
> Yetkilendirme kipi · kara listenin **yasağı**. `## Kulvar — QUICK`'in *Yer kısıtı* paragrafı
> **adıyla ödünç alınır** (aşağıda).

**Kulvarın nesnesi BULGUDUR — ne `DURUM`'un `Adım` alanı ne bir quick kaydı.** İki ayrım da
mekaniktir: bulgu işleri faz döngüsünün alanlarına tanım gereği dokunmaz (`quick.md` Adım 4), ve
**dağıtılacak kaydın kendisi turun İÇİNDE doğar** (`quick.md` Adım 3) — yani QUICK'in kayda bakan
ölçüleri burada ölçülecek bir nesne bulamaz. Koşumun **konumu · ilerlemesi · sonu · sırası** bu
kulvarda şuradan okunur:

| | **BULGULAR kulvarı** |
|---|---|
| **konum** | dağıtılan bulgunun kimliği (`B-NNN`) + o bulgunun **index satırının hâli** (`_dev/BULGULAR.md` → `## Açık Bulgular`) |
| **ilerleme** | **commit üretildi** — tek ayaklı; gerekçe aşağıda |
| **son** | 1a'nın **sabit** listesinde dağıtılabilir bulgu kalmadı |
| **sıra** | aşağıdaki **Sıra** hükmü |

🔴 **İLERLEME TEK AYAKLIDIR ve QUICK'in ikinci ayağı buraya KOPYALANAMAZ.** QUICK'te ikinci ayak
*"kaydın `**Durum:**` alanı değişti"*tir ve atıf niteleyicisi *"önce"* değerini
`git show <tur çapası>:<kaydın yolu>` ile almayı emreder. Bu kulvarda o kayıt turun içinde doğar,
yani çapada **yoktur**: komut `fatal` verir, Adım 3 bunu *"değişmedi"* değil **ÖLÇÜLEMEDİ** sayar
ve **ölçüt 5 ilk turun dönüşünde ateşler** (ampirik olarak üretildi). Bulgunun **kapanması** da
ilerleme ölçüsü değil **kuyruk ölçüsüdür** — ölçüt 1'in girdisi odur, ilerlemenin değil: sahada bir
tur bulgunun yalnız bir ayağını kapatabilir, hatta hiçbirini kapatmayabilir, ve commit üretmişse
o tur **ilerlemiş** turdur.

⚠️ **Atıf niteleyicisi burada da geçerlidir ve nesnesi index dosyasıdır:** değişim bu koşumun
turlarına **atfedilebilir** olmalı; *"önce"* değeri `git show <tur çapası>:_dev/BULGULAR.md` ile
alınır. O dosya çapada **vardır**, yani bu ölçüm — kaydınkinin aksine — koşar.

### Kulvar tablosu — BULGULAR

Anahtar bir alan değil **satırın kendisidir**; index satırı `**Durum:**` alanı taşımaz.

| Bulgunun `## Açık Bulgular` satırı | Hüküm | Dağıtılacak komut |
|---|---|---|
| var, **rota işareti yok** | Kulvar içi | `quick B-NNN` |
| var, **rota işareti var** (`→ Faz N` / `→ TASK-X.YY`) | Kulvar dışı — rotası canlıdır, kuyruktan düşer, tur açılmaz | — |
| **satır yok** | atıf ölçüsüne bak (aşağıdaki dal) | — |

⚠️ **Rota işareti KALIN yazılmış olabilir** (`→ **Faz 8**`) ve çıplak desen onu kaçırır — ölçüldü:
aynı kuyrukta toleranslı desen çıplak desenin bulduğunun **birkaç katını** buluyor ve fark tek bir
projede yoğunlaşabiliyor. Kaçırılan satır dağıtılırsa alt ajan `quick.md`'nin *"İşaretli bulguya uzanma"* kuralıyla
soruyla döner — yani bedeli yanlış iş değil, **her seferinde bir boşa tur ve bir relay sorusudur**,
ki `### Sıra`'nın adıyla yasakladığı hâl budur. Toleransı buraya yazılmış hâliyle uygula.

⚠️ **Önem işareti (🔴/🟡/🟢) hükme GİRMEZ ve kapalı bir küme DEĞİLDİR** — sahada kanonun üçlüsü
dışında değerler ölçüldü (`🟠`, `✅`, ve önem işaretinden **önce** gelen `🆕` gibi önekler; ölçüt:
1a'nın (1) listesinde `B-NNN`'in sağında kalan alan). Bu yüzden ne dağıtılabilirlik ne sıra ona
bağlanır; satırın kimliği
**pointer'ındaki `B-NNN`**'dir. İşaret yalnız kapanış raporunda anılır. **Tanınmayan bir işaret
duruş sebebi değildir** — bu, `## Kulvar`'ın *"tanımadığın değer → dur ve raporla"* hükmünün
istisnası değil, **başka bir nesnedir**: orada tanınması gereken bir kapalı değer kümesi vardır,
burada yoktur.

⚠️ **`✅` ile başlayan bir satır kuyruktan düşmez.** Sahada ölçüldü: index'in kapandığını söylediği
bir bulgunun atomu *"kapanış beyanı canlıda tutmuyor"* diyebiliyor, tersi de. Kuyruğun **yetkili
kaynağı index satırıdır** (tek okunabilir olan odur), ve o satır duruyorsa iş vardır — işin ne
olduğunu turun kendisi ölçer: gerçekten çözülmüşse turun işi **mezuniyettir** (`quick.md` → Adım 1'in
`B-NNN` dalı), ve mezuniyet de bir ilerleme turudur.

### "Satır yok" dalı — bu kulvarda doğan, QUICK'te hiç olmayan hâl

Mezuniyet index satırını **siler** (`templates/BULGULAR.md` → Yaşam döngüsü), yani bu kulvarda
üyeliğin ve canlılığın taşıyıcısı **aynı nesnedir**. Sabitlik bu yüzden iki katmanlıdır:
- **Üyelik** 1a'da `B-NNN` kimlikleriyle **donar** — yeniden tarama yapılmaz. Gerekçe bu kulvarda
  ölçüt 2 DEĞİLDİR (o burada bloğu hiç okumaz): donmuş liste **ölçüt 1'in girdisi** ve `### Sıra`'nın
  kaynağıdır; yeniden taranırsa koşum ortasında doğan bir bulgu kuyruğa girer ve koşumun sonu kayar.
- **Canlılık** yalnız **dağıtılacak** bulgu için, tur başına tek `grep` ile yeniden ölçülür — reçetesi 1a'nın (1) projeksiyonunun iki çapasını taşımak **zorundadır**, bölüm ve satırın **İLK** köşeli ayracı: `awk '/^## Açık Bulgular/,/^## Kapsama/' _dev/BULGULAR.md | grep -E '^- [^[]*\[B-NNN([^0-9]|$)'` (varlığın hükmü `grep`'in çıkış kodudur ve dönen satır tablodan geçer — 1a'nın (2) desenini tutuyorsa ve 1a onu not etmediyse ikinci satır; `grep` boş döndüyse `awk`'ın çıktısına bak: hiç satır yoksa — dosya ya da başlık yok — sonuç ÖLÇÜLEMEDİ'dir). ⚠️ **Bölüm sınırsız ya da kimlik çapasız desen YASAK** — ölçüldü: bulguya başka bir satırdan (Gelen Kutusu · Bilinçli Tercihler · başka bir bulgunun kancası) ya da kanonun `**Son Güncelleme:**` satırından (`templates/BULGULAR.md`: *"… **mezuniyetin** tek cümle özeti"*) atıf yapılıyorsa mezun edilmiş bulgu **canlı** görünür ve aynı bulguya ikinci tur açılır.

Satır yoksa hüküm **atıftan** gelir ve ölçü Adım 3'ünkiyle aynıdır, **beyandır:** turların 9a hash'lerinden — ya da
emrettiğin `pause`'un WIP commit'inden — biri için canlılık reçetesi `git show <h>^:_dev/BULGULAR.md` çıktısında
tutuyor, `git show <h>:_dev/BULGULAR.md` çıktısında tutmuyorsa **atfedilebilir** (bu koşumun turu mezun etti): kuyruktan düşer ve bu bir ilerlemedir.
**Atfedilemiyorsa** (paralel bir oturum sildi — kanon bunu olağan sayar, `verify-phase` Adım 6 da
UAT-teyitli arşiv yapar) bu bir **kayıt-düzeyi duruştur:** bulgu dağıtılabilir kümenin dışında
kalır, **koşum durmaz**, kapanış raporunda adıyla anılır. ⚠️ ***"Satır yok ⇒ kuyruk bitti"* okuması
yasaktır** — ölçüt 1 yalnız 1a'nın sabit listesinin **tükenmesiyle** ateşler, tek bir satırın
yokluğuyla değil.

### Sıra — DETERMİNİSTİKTİR ve tek anahtarlıdır

1. **Index sırası — en üstteki önce.** Kaynağı kanonun kendi cümlesidir (`templates/BULGULAR.md` →
   `## Açık Bulgular` KURAL'ı: *"Sıralama = ele alınma önceliği (en üst en öncelikli)"*). Sıra
   projenin **beyanıdır**; orkestratör onu yeniden üretmez.
2. **Önem işareti ikinci bir anahtar DEĞİLDİR.** Ölçüldü: filonun çoğunda index zaten önem-sıralıdır
   ve ikisi ayrışan azınlıkta satırlar bilinçle sıralanmış olabilir (tematik küme başlıkları sahada var).
   İki ölçüyü hakemlemek orkestratörün ölçebileceği bir şey değildir; işaret **rapora** girer,
   sıraya değil — `lib/kosum-kapanisi.md`'nin ④'ü `📋` son satırı için aynı hükmü söyler.
3. **Orkestratör *"kolay"*ı yargılamaz** — o eksen motorda tanımlı değildir ve index'te efor alanı
   yoktur. Kullanıcı daha dar bir küme eritmek istiyorsa yolu **1e'nin sınır daraltma gücüdür**
   (tur talimatı: *"yalnız 🟢 işaretlileri erit"*); kulvar bunun için ayrı bir ölçüt yazmaz.

### Adım 4'ün iki kaynağı bu kulvarda TEK kaynağa iner

**Sıradaki iş yalnız 1a'nın sabit bulgu listesinden okunur.** Gerekçe mekaniktir: bu kulvarın her
turu bir `quick` oturumudur ve `quick.md` Adım 6 orkestratör altında `📋`'yi **iki koldan** yazar —
iş sürüyorsa (🔄) **turun kendi kaydını** sürdüren komut, kapandıysa (✅/❌) kanonun döngü-dışı
varsayılanı (duraklatma kapısı açıksa `resume`, değilse `Adım`'dan türeyen faz komutu, türetme vermezse `yok — <bekleme koşulu>`) —
**ikisi de bu kulvarın dağıtılabilir kümesinin dışındadır**
ve `quick.md`'nin bulgu kuyruğundan haberi yoktur. Blok konum kaynağı sayılırsa **her başarılı tur**
bir terfi üretir ve ölçüt 2 ateşler; ölçüldü: sahada **hiç açık quick kaydı olmayan ama kuyruğu dolu**
projeler olağandır (ölçüt: 1a'nın iki taraması), yani koşum **ilk bulgudan sonra** dururdu.

Blok yine okunur, ama **sıradaki işin kaynağı olarak** yalnız **iki iz** için: son satırdaki `engel:` önekli kalem (ölçüt 2'nin taban
kuralı) ve **`→` satırının erteleme beyanı** — `→` bir işi *"ondan sonra"* diye erteliyorsa tur
engelleyici bulmuştur. İkincisi şart: kanon terfi eden kalemi son satırdan düşürür, yani `engel:`
öneki tek başına iz değildir (ölçüt 2'nin *"Sınırı elinde tutan iz `engel:` öneki DEĞİLDİR"* ⚠️'si) —
yalnız önekle okunursa bu kulvarda engel **hiç görünmez.**

⚠️ **`📋` SATIRININ TAMAMI OKUNMAZ — ne komutu ne `yok —` beyanı** (sıradaki işin kaynağı olarak;
kapanışta Adım 7 kalem 2 terfi edeni buradan okur). Yukarıdaki iki koldan hiçbiri
bu kulvarın kuyruğu hakkında bir şey söylemez, ve ikinci kolun `yok —` yazımı (`Adım` alanı yok ·
tanınmayan değer · versiyon-geçişi sınırı) **işini eksiksiz
bitirmiş** bir turda da gelir — üstelik tam da 1a'nın koşuma adıyla davet ettiği nüfusta
(*"`Adım`'ın boş olması ya da alanın hiç bulunmaması duruş sebebi değildir"*). O beyanı engel sayan
bir okuma, kuyruğu dolu bir projede koşumu **ilk turda** kapatır.

### Duraklatma Notu — bu kulvarda TEK KOL vardır

**Not doluysa, değeri ne olursa olsun: dur ve raporla.** Gerekçe kuyruk değil **devir yoludur:**
`resume` argüman almaz ve DURUM'un **tek** yuvasındaki işi devralır; bu kulvar `resume` dağıtmaz,
yani not durdukça o iş sahipsiz kalır — ve iş bir bulgu-quick'iyse aynı bulguya taze bir ajan
yollanabilir. Değeri raporla; devralma ya da iptal kararı kullanıcınındır.

⚠️ **Notu BU KOŞUMUN KENDİSİ de yazmış olabilir** (aşağıdaki kara listenin relay kolu `pause`
koşturur ve bu kolda **not yazar**) — yani *"notun işi bu kulvarın kuyruğundan gelmez"*
öncülü genel değildir, kurma. O hâlde kapanış raporu sonucu **adıyla** söyler: bu koşum bir
Duraklatma Notu bıraktı, o not durdukça bu kulvar açılmaz, ve notu çözecek olan kullanıcıdır.
Sessizce bırakılırsa kullanıcı kuyruğu dolu bir projede kilitlenmiş bir kulvarla kalır ve sebebini
hiçbir yerde göremez.

### Kara liste — yasak aynı, ama ÖLÇEN DEĞİŞİR

Yasak değişmez (yayın/acil düzeltme türleri · kickoff ailesi · oturum-sonu komutları). Ama bu
kulvarda **tür dağıtım anında ölçülemez:** onu taşıyan `**Tür:**` alanı kaydın içindedir ve kayıt
turun sonunda doğar (`quick.md` Adım 3). Sıfır değil **ÖLÇÜLEMEDİ**'dir — ve çare durup sormak
değil, yasağı **taşımaktır**, çünkü sorulacak şey kayıt başına değil kuyruk başına aynıdır:
- Yasak **brief'te sınır olarak** yazılır: *"bu turda yayın ya da acil düzeltme rotasına girme;
  devraldığın kayıt öyle bir tür taşıyorsa da girme — dur ve bildir."* Alt ajan tarafındaki hükmü
  `quick.md` Adım 1b'nin orkestratör fıkrasıdır ve orada yazılıdır.
- Dönüş sözleşmesinde **geri istenir** (9b'nin icra kararları kalemi): tür ölçümü o rotayı
  gösterdiyse turun bunu adıyla bildirmesi gerekir.
- ⚠️ **Relay kolu kapalıdır:** alt ajan o rotanın gerektiğini ölçüp soru döndürürse cevap **aynı
  ajana geri gönderilmez** — kara liste hiçbir onay koluyla açılmaz ve burada terfi yoktur, yani
  Yetkilendirme kipinin *"kip üçü ile de açılamaz"* güvencesi bu yolu kendiliğinden kapatmaz.
  **Ateşleyen ölçüt 13'tür** (kapı duruşu; bekleme koşulu: *kara liste rotası gerekiyor — kullanıcı
  kararı*) — kapanış bloğunun `📋`'si onun kuralıyla yazılır, uydurulmaz. ⚠️ **Kapatmadan ÖNCE
  askıdaki ajana Adım 5'in `pause` rotasını koştur:** ölçüt 11'in ⚠️ fıkrası burada aynen geçerlidir
  — canlı ajanın işi henüz diskte değildir, ve Duraklatma Notu **bilinçle yazılır** (Adım 5'in
  BULGULAR istisnası bu kolu hariç tutar). Handoff'u kapanış raporuna al, sonra kalan kuyruğu
  raporla ve koşumu kapat.

`prd-review` · kickoff ailesi · oturum-sonu komutları bu kulvarda zaten dağıtılmaz. ⚠️ **Ama
*"dağıtılan tek komut `quick`tir"* demek YANLIŞ olurdu** — Yetkilendirme kipi kulvar-nötrdür ve
kulvar-dışı bir tur açılabilir. **Bu kulvarda `_dev/BULGULAR.md` ile `_dev/bulgular/` yazım alanı
DEĞİL, kuyruğun kendisidir:** 1a'nın donmuş listesi koşum ortasında altından çekilirse ölçüt 1'in
girdisi ve `### Sıra`'nın kaynağı bozulur, silinen satır da *"satır yok"* dalında yanlışlıkla
**mezuniyet** sayılır. ⚠️ **Kısıt komuta değil DOKUNULAN DOSYAYA bağlanır** — komut adına bağlanan ölçüt fail-open çıktı (ölçüldü: *"dosya komutun metninde geçmiyor"* okuması, komutun Adım 0'da koşulsuz okuduğu lib'lerini görmez). İki muhatabın **hükmü ayrıdır**, çünkü yazım kümeleri farklı:
- **`audit-product` dağıtılmaz** — yazım alanı **yalnızca** bu kuyruktur (`audit-product` → Önemli Kurallar), yani sınır ona hiç iş bırakmaz. Bugün zaten ulaşılamaz (`📋` okunmaz), ama hüküm dosyaya bağlı olduğu için ileride açılacak yolu da kapsar. Kalemi *"bu kulvarda dağıtılamaz — kuyruğun kendisini yazar"* diye kapanış raporuna taşı; **koşumu kapatma** (fail-closed olurdu).
- **`audit-docs` dağıtılır — ama SINIRLA.** Kullanıcı kararı (2026-08-29) onu sorulmadan koşturur ve canlı yolu vardır (Adım 4'ün son-satır `önerilir:` bakışı); kuyruk dosyası onun kanvasının **üyesidir**, uygunluk düzeltmesi index satırlarını yeniden yazabilir. Çare yasak değil, bu kulvarın kara listede zaten kullandığı biçim: yasağı **brief'te sınır olarak** yaz (*"`_dev/BULGULAR.md` ve `_dev/bulgular/` bu turun dokunma kapsamı dışındadır"*) ve dönüş sözleşmesinde geri iste (9b). Sınır brief'e girmezse tur dağıtılmaz. **Tetikleyen `önerilir:` kalemi sınırın içindeki bir dosyayı adlandırıyorsa tur açılmaz** — tetikleyicisine dokunamazdı; kalem kapanış raporuna gider (Adım 4'ün boyut bakışının ikinci-işaret koluyla aynı ev). Sınırın içine yazacak bir madde 10 kalemi de bu turun değil sıradaki kulvar turunun brief'ine girer.

⚠️ Bu bir **kara liste maddesi değildir**: kara liste TÜR yasaklar ve üç kiple de açılmaz; bu, tek-kulvarlık ve **dosyaya bağlı** bir dağıtım kısıtıdır — yeni bir komut aynı dosyaya yazmaya başlarsa ölçüt onu kendiliğinden kapsar.

### Yer kısıtı — ÖLÇÜT AYNI, gövde tekrarlanmaz

Bu kulvar da tanımı gereği **arkada bir faz koşumu koşarken** açılır ve dağıtılacak başka bir kulvar
komutu **yoktur** ⇒ hüküm QUICK'inkiyle birebir aynıdır: `Adım = review` görülen turda yeni tur
açılmaz, kalan kuyruk raporlanır ve **koşum kapanır** (ölçüt 13; bekleme koşulu: *faz döngüsünün
`review` penceresi*). Ölçüm **tur başınadır**, koşum başına değil. Gövde ve gerekçe
`## Kulvar — QUICK` → *Yer kısıtı*'ndadır — **ölçütü aynı olan hüküm ikinci kez yazılmaz.**
Bir bulgunun ürün koduna dokunup dokunmayacağı burada da **ölçülemez** (atomun gövdesi Bağlam
disiplini'nin dışındadır) ve ölçülemeyen varsayılmaz.
