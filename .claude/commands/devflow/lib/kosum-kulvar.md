# DevFlow — Koşumun Kulvarı ve Hükmü

> `/devflow:run-phase`'in **Adım 4**'ü (turun dönüşünde verilen hüküm) ve **Kulvar** bölümü (hangi
> işin dağıtılabileceği). **Tek çağıranı odur**; ayrı dosya olmasının nedeni çağıranın tek-Read
> sınırıdır (kanon: Doküman Disiplini → Boyut ve Bölünme; ölçüt: taşınan birimin ve her çağıranın
> tek-Read'e sığması). **İkisi aynı dosyadadır çünkü aynı nesneyi yönetirler:** Adım 4 hükmünü
> Kulvar tablosundan verir, Kulvar'ın Yetkilendirme kipi ile Yer kısıtı Adım 4'ün terfisine bakar
> — ayrı dosyalara konsalardı aralarındaki her atıf dosya sınırını geçerdi.
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
> doğrula. **Koşum ailesinin dışından tek atıf `resume.md`'dedir** ve çağıranın `## Kulvar` başlığı
> üzerinden çözülür — o başlık kaldırılırsa aynı turda düzeltilir.
>
> **Ters yön dar değildir:** bu dosyanın gövdesi çağıranının adım ve ölçüt numaralarına bağlıdır
> (`1a…1e` · `Adım 2/5/6/7` · `ölçüt N`). O numaralar değişirse bu dosya **aynı turda** düzeltilir;
> reçeteleri kardeş dosyaların önsözlerindedir (`kosum-zemini.md` → `1[a-e]` · `kosum-kapanisi.md`
> → `ölçüt N`) ve kapsamları bu dosyayı da içerir.

## Adım 4 — Hüküm Ver ve Sıradaki İşi Belirle

Önce durma ölçütlerine bak (→ Durma Ölçütleri); biri ateşlediyse **önce bu adımın son paragrafındaki tur-sonu iletisini yaz** (tek satır + 9(d) kalemleri), **sonra Adım 7'ye geç**. Ölçüt ateşledi diye o paragrafı atlamak, tek evi orası olan kalemleri sessizce düşürür — ve koşumu bitiren tur (ölçüt 1) tam da onları üreten turdur. **Beyan ile ölçüm çelişirse kendi başına düzeltme** — çelişkiyi ölç, kullanıcıya raporla, kararı ona bırak (`review-phase` Adım 6 ile aynı ilke: dokümanı gözlenene uydurmak kusuru spesifikasyona çevirir).

Hiçbiri ateşlemediyse sıradaki işi **iki kaynaktan** belirle; ikisi de gereklidir, çünkü hiçbiri tek başına tam değildir:

- **Kapanış bloğunun `📋 Sıradaki adım:` satırı** — **terfiyi yalnız o taşır.** Faz döngüsü dışı iş DURUM'un `Adım` alanında iz bırakmaz (kanon: CLAUDE.md → Oturum Kapanışı), yani engelleyen bir denetim ya da quick işi yalnız burada görünür.
- **DURUM'un `Adım` alanı** — faz döngüsündeki konumun tek yetkili kaynağı, ve ilk turda tek kaynak (henüz blok yoktur).

**Hüküm listesinden ÖNCE bir bakış — bu kalem `📋`'ye değil son satıra bakar, yani aşağıdaki dallarla aynı anda tutabilir ve onlardan önce ölçülür:** son satırda `önerilir: /devflow:audit-docs` kalemi varsa o kalem `📋`'ye terfi etmemiştir ve ölçüt 2 onu görmez (ölçüt yalnız `engel:` önekini ve `📋`'yi okur) — **ama görünmez sayma.** **Tek okumaya sığmayan** bir doküman koşum içinde **yalnız bu satırda** görünür: motor işareti adıyla ve `önerilir:` önekiyle emrediyor (`templates/claude/CALISMA-PRENSIPLERI.md` #10.4 · `run-task` Adım 9), ve `lib/boyut-kapisi.md`'nin dört çağıranı arasında `run-task` **yoktur** — yani bir task turunda doğan doküman kendi turunda hiçbir boyut kapısına uğramaz. Turu **kulvara dönmeden önce** aç (Adım 2); yetki için ayrıca sorma — Yetkilendirme kipinin (i) istisnası aynı komut için zaten verilmiştir (kullanıcı kararı, 2026-08-29). Tur kapanınca aşağıdaki hükme dön. ⚠️ **Aynı işaret bir sonraki turda yine gelirse turu İKİNCİ kez açma ve koşumu da DURDURMA** — kalem `önerilir:` kulvarındadır, tanımı gereği engellemez: kulvara devam et ve kalemi Adım 7'nin kapanış raporuna taşı (`lib/kosum-kapanisi.md`: son satır, koşumun dağıtmadığı kulvar-dışı işin de birleşimidir). Denetim turu kalemi kapatamamıştır; kararı kullanıcı kapanışta verir.
⚠️ **Bu bakışın kapsamı dardır ve sınırı ölçülmüştür:** işaretin tetiği Read'in truncate/PARTIAL uyarısıdır, kırmızı çizgi değil (`templates/claude/CALISMA-PRENSIPLERI.md` #10). Çizgiyi aşmış ama hâlâ tek Read'e sığan bir doküman bu satırda **hiç görünmez**, **ama bu, koşumun o hâli hiç görmediği anlamına gelmez:** faz dokümanı yolunda kulvarın kendi turları ölçer — `verify-phase` 6b ve `review-phase` 5b `lib/boyut-kapisi.md`'yi çağırır ve `TOKEN-SERT` bandı orada teşhise girer; kalem dönüş sözleşmesinin **boyut ertelemesi** alanıyla geri gelir (brief madde 9d) ve kapanış raporunda anılır. Görülemeyen tek nüfus **faz dokümanı dışındaki** (`_dev/docs/`, modül, PRD) dokümanlardır; onların evi koşumun dışıdır — kanvas onları bir sonraki `audit-docs` turunda `urgent:token-hard` olarak yakalar (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi). O boşluğu koşum içinde kapatmaya çalışma.


Hüküm:
- **Blok kulvar içi bir faz komutu gösteriyor ve DURUM'un Adım'ı onu doğruluyorsa** → dağıt (Adım 2).
- **Blok kulvar dışı bir komut gösteriyorsa** (terfi) → kararı Kulvar → Yetkilendirme kipi verir; **kip dağıt derse Kulvar → Yer kısıtını da ölç** (tek evi orasıdır). **Turun KENDİ komutunu gösteren `📋` ve koşum açılışında zaten bekleyen bir quick kaydı — terfi sayılmaz** (ölçüt 2'nin iki uyarısı; oradaki tur-talimatı istisnası ve engelleyicilik ölçütüyle birlikte) — o blok terfisiz sayılır, hüküm DURUM + Kulvar tablosundan verilir.
- **Blok `yok — <bekleme koşulu>` diyorsa** → dur (ölçüt 2).
- **İkisi çelişiyorsa** → **dur ve sor.** Kanon durum tarifi çelişkisini DURUM lehine çözer, ama burada iki ayrı arıza olabilir — alt ajan DURUM'u yanlış yazmış ya da bloğu yanlış kurmuş; ikisi de araştırma ister, otomatik düzeltilmez.
- **Blok yoksa ya da `📋` okunamıyorsa** → DURUM'un Adım'ı + Kulvar tablosu esastır; o da net değilse dur ve sor. ⚠️ **Bu dalda ölçüt 2 sıfır değil ÖLÇÜLEMEDİ'dir:** terfiyi de `engel:` beyanını da yalnız blok taşır, blok yoksa ikisi de görünmez — dağıtmadan önce engeli **raporun nesrinden** ara (Adım 3'ün içerik bakışı orada yalnız *soru* arar), engel görünüyorsa dağıtma. **Adım 6'dan gelen ölü-ajan dalında rapor da yoktur** — orada engel beyanı hiç ölçülemez: hüküm yine DURUM + Kulvar'dır, ama ölçülemediğini kapanış raporunda adıyla yaz.

Dağıtmadan önce iki savunmacı kontrol daha — **bunlar artık bu oturumun işidir:**
- **Task Durumu tablosunda `🔴 Bloke` satırı varsa dağıtma** — durumu raporla ve sor.
- **`Adım = task` ama tabloda ⬜/🔄 satır kalmadıysa** sıradaki iş `verify-phase`'dir (`❌ İptal` çalıştırılacak iş değildir, sayılmaz). `run-task` bu hâlde Adım'ı zaten `verify`'a çeker; bu, çökmüş ya da bayat state için emniyet ağıdır. ⚠️ **`⏸️` de çalıştırılacak iş değildir ama yokluk da değildir:** ⬜/🔄 kalmamış ve geriye ⏸️ satır kalmışsa `verify-phase` **türetme** — dur ve sor (hüküm ölçüt 14'te). 1b duraklatmayı Duraklatma Notu'ndan ya da *Aktif Task*'ın ⏸️'sinden yakalar; tablodaki başka bir satırın ⏸️'si ikisine de girmez ve faz yarım işle verify'a girer. ⚠️ **Tablo tekil değilse — hiç yoksa ya da birden çok *Task Durumu* tablosu varsa — bu sıfır değil ölçülemedi'dir ve bu, yukarıdaki İKİ kontrol için de kulvardan bağımsız geçerlidir** — dağıtma, dur ve sor (hüküm ölçüt 14'te, burada tekrarlanmaz): bağlam disiplini faz dokümanını okumayı yasakladığı için orkestratör tabloyu başka yerden doğrulayamaz.

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
- `quick`'in **yayın** ve **acil düzeltme** türleri. Faz task'ı her zaman çalışma dalında kalır (`run-task` Adım 8: *"Yayın kapısı istisnası bu adımda ateşlenmez"*); yayın dalına geçiş ve doğrulama kapısı kullanıcının kararıdır. Türü ölçmek için kaydın `**Tür:**` alanına bakılır. **Alan yoksa** — sahada olağan hâl budur — hüküm Adım 1c'de zaten okunmuş GIT-STRATEJI'nindir: **beyanlı yayın hattı yoksa** yayın/acil düzeltme türü de yoktur, bu madde boştur ve tur açılabilir; **varsa** tür gerçekten bilinmiyordur — dur ve sor.
- `prd-review` · `kickoff` · `kickoff-docs` · `kickoff-verify` · `map-codebase` — faz döngüsünün dışındaki sınırlar.
- `pause` · `double-check` · `prd-save` — oturum-sonu komutlarıdır, bağlam-bağımlıdır, ayrı tur olarak **dağıtılamaz**. (`pause`, Adım 5'in relay çaresi içinde alt ajanın *kendi* oturumunda koşar — bu ayrı tur açmak değildir.)

**Yetkilendirme kipi.** Kulvar-dışı bir iş alt ajanın kapanış bloğunda `📋`'ye terfi ettiyse varsayılan **dur ve sor** — ve sorunun **iki kolu da yazılıdır** (aynı biçim: 1c'nin kirli-ağaç kapısı): kullanıcı **onaylarsa** turu aç (Adım 2), yetki **yalnız o tura** verilmiştir ve daimî istisnaya dönüşmez; **onaylamazsa ya da cevap gelmezse** ölçüt 2 ateşler ve koşum Adım 7 ile kapanır (`📋` terfi eden komut). İki istisna vardır: **(i)** `audit-docs` — sorulmadan koşulur (kullanıcı kararı, 2026-08-29); **(ii)** tur talimatının önden yetkilendirdiği komut (Adım 1e). **Kara liste kipin ÜÇÜ ile de açılamaz** — onay da dahil: kullanıcı bir terfiyi onaylarsa kara liste ölçümü yine koşar (yayın/acil düzeltme türü quick, kickoff ailesi, oturum-sonu komutları).
> ⚠️ **Bu kipin bedeli yazılıdır:** audit-docs'un kurallı kalemleri kullanıcı paket raporunu görmeden uygulanır ve commit'lenir; veto penceresi kapanır ve geri alma üç hamledir (değişikliği geri al · kararı kayda geçir · denetim kuyruğunu gerçekle uzlaştır — `lib/audit-rapor.md` → kural 9). Azaltıcı: turun paket raporu dönüş sözleşmesinin **zorunlu alanıdır** ve tur biter bitmez kullanıcıya birebir iletilir.

**Yer kısıtı — ölçüsü turun AÇILMASIDIR, hangi adımdan geldiği değil:** kulvar-dışı bir tur hangi yoldan gelirse gelsin (Adım 4'ün terfisi — 1e'nin önden yetkisi o terfinin sorusuna verilmiş cevaptır, ayrı bir yol değil · Adım 1b'nin duraklatma yoluyla açtığı quick turu) açmadan önce bu kısıt ölçülür. Ürün koduna dokunabilecek kulvar-dışı bir tur `verify` ile `review` arasında açılmaz — pencerenin DURUM karşılığı **`Adım = review`**'dür (`verify-phase` kapanışta Adım'ı `review`'a çeker), çünkü `review-phase` Adım 3'ün UAT-tazeliği merceği verify'ın son UAT commit'inden sonraki ürün kodu değişikliğini görür ve fazı fazladan bir verify turuna sokar. **Hüküm durmak değil ertelemektir:** turu açma, kulvar komutunu dağıt, ertelenen işi kapanış raporunda an. (`audit-docs` yalnız dokümana dokunduğu için bu kısıtın dışındadır.)
