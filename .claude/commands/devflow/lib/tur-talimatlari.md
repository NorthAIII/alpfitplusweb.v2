# DevFlow — Tur Talimatı Presetleri

> **Bu dosya doğrudan çağrılmaz** ve **lazy okunur**: yalnız `/devflow:run-phase`'in tur talimatı
> baştaki işaret satırlarında `TUR TALİMATI: <ad>` taşıdığında, koşum başına bir kez
> (`lib/kosum-zemini.md` → 1e).
> **Tek çağıranı odur.** Talimat ad taşımıyorsa bu dosya hiç okunmaz ve hüküm 1e'nin dört gücünündür.
>
> ⚠️ **Preset KULVAR SEÇMEZ ve seçemez.** Talimat ayrıca bir `KULVAR:` işareti taşıyabilir (sözlüğü
> `lib/kosum-zemini.md` → 1a'dadır); ikisi bir arada, herhangi bir sırada yazılabilir ve biri
> ötekini geçersizleştirmez. Ayrım tercih değil
> **sıradır:** kulvar **1a**'da bilinmek zorundadır (kuyruk taraması, ön koşul ve savunmacı
> kontroller oradadır), bu dosya ise **1e**'de okunur — yani preset kulvarı taşısaydı kulvar kendi
> kapısından sonra öğrenilirdi. Aşağıdaki presetlerin Yetki blokları **koşumun kulvarından
> bağımsızdır**: yetkiyi adlandırırlar, işin nereden geldiğini değil — ama bir kulvarın kendi **dağıtım
> kısıtları** o kulvarındır ve hiçbir presetle açılmaz (aşağıdaki liste).
>
> **Ad eşleşmesi aksana ve büyük/küçük harfe duyarsızdır**; adlar bilinçle ASCII'dir. Tanımadığın bir
> ad **serbest metin değildir** — koşumu açma, adı raporla ve sor (aynı ölçüt: Kulvar'ın tanınmayan
> değer hükmü). Yarım eşleştirme yapma.
>
> **Presetin yetkisi burada YAZILIDIR, metninden türetilmez.** Kullanıcının metni değişebilir; hüküm
> aşağıdaki «Yetki» bloğudur. İkisi çelişirse metin değil **yetki bloğu** geçerlidir ve çelişkiyi
> kapanış raporunda an.

---

## Neden bu dosya var

Ölçüldü (2026-09-05, 12 senaryolu A/B — aynı fikstür, bir orkestratör çıplak komutla, öteki
kullanıcının notuyla). **İki ayrı eksen ölçüldü; sayıları toplama, aynı bölünmenin parçaları
değiller.** Ayrışma ekseninde notlu kol **8 kapıda ayrıştı** (6 tam · 2 kısmen), **4 kapıda hiç
ayrışmadı**; ayrışmanın **3'ünde motorda karşılığı olmayan bir yetki kullandı**. Hüküm ekseninde ise
**6 kapı hüküm gerektirdi, 6 kapı gerektirmedi**.

Yani sorun "talimat çok güçlü" değil, **eşlemenin yazılı olmaması**ydı: orkestratör hangi gücün
kullanıldığını her koşumda kendi icat ediyordu, ki brief'in önsözü doğaçlamayı adıyla yasaklıyor.
İkinci eksen de en az birincisi kadar bağlayıcı: **hüküm gerektirmeyen 6 kapıya kural yazmak**,
arızası ölçülmemiş bir yüzey eklemek olurdu.

Çare yeni bir mekanizma değil, **hükmü daraltmak**: sık kullanılan talimatlar adlandırıldı ve
yetkileri **yazıldı**. Serbest metin kaldırılmadı; 1e'nin dört gücü onun için ayakta.

---

## `kesintisiz-kosum` — faz döngüsünü uçtan uca yürüt

**Ne zaman:** normal faz döngüsü (task → verify → review), kullanıcı koşum boyunca başında değil.

### Yetki (hüküm budur)

| 1e'nin gücü | Bu presette |
|---|---|
| Sınır daraltma | **yok** — koşum kulvar çıkışına kadar sürer (ölçüt 1) |
| Rapor sıklığı | varsayılan: tur başına tek satır + 9(d) kalemleri |
| Kulvar-dışı önden yetki | **`audit-docs` · `audit-product` · `quick`** — üçü de **adıyla** yetkilendirilmiştir (Yetkilendirme kipi istisnası (ii)) |
| Duran yetkilendirme | **açık** — tercih kapıları önden cevaplanır, 1e'nin üç sınırıyla |

**Adıyla devredilen ek sınıf:** dokümantasyonda **ad icadı, yeni desen ve içerik yargısı** gerektiren
kesimler de devredilmiştir — yani 1e'nin *"etkisi koşumun dışına taşan kararı sınıf-düzeyi devir
kapsamaz"* sınırı bu presette **adlı devirle kalkar**. Karşılığı tek şart: ne yapıldığı ve o kesimin
neden seçildiği raporda tek satırla yazılır.

**Preset yetkiyi GENİŞLETMEZ, yalnız adlandırır — aşağıdakiler hiçbir presetle açılmaz:**
- **Kara liste** (→ Kulvar): `quick`'in yayın/acil düzeltme türleri · kickoff ailesi · oturum-sonu komutları.
- **Yer kısıtı** (→ `lib/kosum-kulvar.md`, **aktif kulvarın kendi bölümü**): `verify` ile `review` arasındaki pencere hiçbir presetle açılmaz. **Hükmü buraya kopyalama, eve yolla** — kulvara göre değişir (FAZ'da ertelemek, **FAZ dışı kulvarlarda koşumu kapatmak**) ve hem kopya hem sayılan kulvar listesi bayatlar.
- **Kulvarın kendi dağıtım kısıtları** (→ `lib/kosum-kulvar.md`, **aktif kulvarın kendi bölümü**): preset bir komutu adıyla yetkilendirse bile o kulvarın kısıtı onu dağıtmaz ya da yalnız sınırla dağıtır. **Hükmü buraya kopyalama, eve yolla.**
- **Ölçüm duvarları** (→ `run-phase.md` → Önemli Kurallar → DEĞİŞMEZ): onlarda soru raporlamadır, izin isteme değil; preset onları cevaplamaz.

### Metin (kullanıcı bunu yapıştırır)

```
TUR TALİMATI: kesintisiz-kosum

Bu koşumu faz sonuna kadar kesintisiz yürütmeni istiyorum. Bana soru sormak koşumu durdurur; o yüzden cevabı kendin verebileceğin her şeyi kendin ver, kararını gerekçesiyle not al ve fazı ilerlet. Tabi yine de durup bana sormak gereken kritik bir blok varsa da durabilirsin, sorun değil.

DURMA / DEVAM AYRIMI. İki tür duruş var, ikisini karıştırma:
- Benim tercihimi bekleyen duruşlar (hangi isim, hangi desen, hangi kesim, hangi öneri) → DURMA. Makul olanı seç, gerekçeni yaz, devam et.
- Ölçümün kendisi bozulduğunda → DUR. git ölçümü hata verdi, alt ajan öldü ve kurtarma turu da düştü, ağaçta sahibi belirsiz iş kaldı, iki tur üst üste aynı işi kapatamadı, DURUM ile kapanış bloğu çelişiyor. Bunlarda devam etmek körken devam etmektir; dur, ölçtüğünü yaz ve beni bekle. Durman sorun değil.

DOKÜMANTASYON. Bölme, temizlik, taşıma, yeniden adlandırma — hepsine onay veriyorum. Kesimi kurallı olanları zaten sormuyorsun; ben ayrıca ad icadı, yeni desen ve içerik yargısı gerektirenleri de sana devrediyorum. Tek şart: ne yaptığını ve neden o kesimi seçtiğini raporda tek satırla yaz.

KULVAR DIŞI TURLAR. Gerekirse audit-docs, audit-product ve quick turları aç — operasyonu mantıklı yürütmeni istiyorum. Ürün koduna dokunacak kulvar-dışı bir işi verify ile review arasına sokma, faz sonuna ertele.

MODEL. [koşum anında geçerli model adlarıyla yaz — aşağıdaki nota bak]

NOTLAR. Benim kararımı gerektiren ama fazı bloke etmeyen her şeyi kayda geçir ve devam et: kararı verilmiş, yalnız zamanı sonraya kalmış iş → ⬜ QUICK kaydı; görülmüş ama ne yapılacağı belli değilse → BULGULAR Gelen Kutusu satırı. Koşum bitince onlara bakacağım.

Durmak zorunda kalırsan kapanış raporunu dolu yaz — nerede kaldığını, ne ölçtüğünü ve neyi beklediğini görebileyim.
```

⚠️ **MODEL bloğu bilinçle boş bırakıldı.** Kullanıcının kalıcı tercihi *"talimatı önden belirlenmiş dar
turlar küçük modelle, doğrulama/review/denetim ve serbest kapsamlı turlar büyük modelle; emin
değilsen büyük model"*tir — ama **model adları harness'a ve zamana bağlıdır ve motora yazılırsa
bayatlar.** Kademe hiçbir durma ölçütünün girdisi değildir, yani motor onu **ölçmez**; hüküm
kullanıcınındır ve talimatın kendi metnine yazılır.

---

## `guvenli-durus` — uçuştaki işi bitir, yenisini açma, kapat

**Ne zaman:** koşum sürerken kullanıcı ortamı kapatacak. Bu bir kulvar değildir.

### Yetki (hüküm budur)

⚠️ **Bu preset ölçüt 10 DEĞİLDİR — ayrım davranışsaldır ve ters kurulursa iş kaybettirir.** Ölçüt 10
(*kullanıcı canlı müdahale etti*) bir **iptaldir** ve uçuştaki tur için ölçüt 11'in ⚠️ fıkrasını
çağırır: ajana `pause` rotasını koştur. Bu preset ise iptal değil **sınır çizer** — 1e'nin **birinci**
gücü. Ölçüt 10 gibi okunursa koşan tur boşuna duraklatılır; doğru okunuşu **ölçüt 12**'dir
(*tur talimatının sınırı doldu*) ve sınır şudur: **uçuştaki tur, sonra kapan.**

- **Uçuştaki tur BİTİRİLİR, yenisi açılmaz.** Dönüşü olağan biçimde ölç (Adım 3), hükmü ver, sonra
  Adım 4'ün ölçüt bakışında **12** ateşler ve Adım 7'ye geçilir. Tur ortasında `pause` koşturma.
- ⚠️ **Kullanıcı beklemeden durmak isterse bu preset DEĞİL, ölçüt 10'dur** — ve orada çağıranın
  fıkrası **koşulsuzdur**: *"tur uçuştayken ateşlerse ölçüt 11'in ⚠️ fıkrası aynen geçerlidir"*, yani
  ajana Adım 5'in `pause` rotası koşturulur ve handoff kapanış raporuna alınır. Bu presetin daralttığı
  şey o fıkra değil, **hangi ölçütün ateşlediğidir**: sınır çizen talimat 12'yi, iptal eden 10'u
  ateşler. İkisini karıştırma — 12 sanıp beklemek iptali geciktirir, 10 sanıp `pause` koşturmak
  bitmek üzere olan turu boşuna duraklatır.
- **`📋` seçimi ölçüt 12'nin kuralıyla yapılır** (`lib/kosum-kapanisi.md`) — kural orada **koşulludur
  ve buraya kopyalanmaz**; presetin kendine özgü tek eki şudur: `/devflow:run-phase` **yazılmaz**.
  Kullanıcı sonraki oturumu yine `run-phase` ile açabilir; blok onun yerine o kuralın verdiği noktayı
  gösterir.
- **Kalan iş kayda geçer.** Ev ayrımı `lib/kosum-kapanisi.md`'nindir ve değişmez: kararı verilmiş,
  yalnız zamanı sonraya kalmış iş → ⬜ QUICK kaydı · görülmüş ama ne yapılacağı kararlaşmamış sorun →
  BULGULAR Gelen Kutusu satırı. **Bu oturum repoya yazmaz** — kaydı yazacak ajan kalmadıysa iş son
  satırda kimliksiz komutla tarif edilir (aynı dosyanın son paragrafı).
- **Duran yetkilendirme:** açık, ama yalnız **kalan işin nereye kaydedileceği** için; yeni tur
  açtıracak hiçbir karar bu presetle verilmez.

### Metin (kullanıcı bunu yapıştırır)

```
TUR TALİMATI: guvenli-durus

Devam eden işler/turlar bitsin, sonrasında yenisini açma ve oturumu kapat. Oturumu kapatmadan önce yapılması gereken işleri quick dokümanı olarak kaydet veya bulgular'a kaydet. daha sonra tekrar bakarız. sen oturumu bitirdikten sonra pc'yi kapatacağım ve sonra devam edeceğiz. Sorman gereken bir şey olursa sorabilirsin.
```

---

## Burada OLMAYAN iki talimat — ve neden

Kullanıcı sahada iki talimat daha kullanıyor: **açık quick kayıtlarını** ve **BULGULAR kuyruğunu**
orkestratörle erittirenler. **İkisinin de kulvarı ARTIK VAR** (`KULVAR: quick` · `KULVAR: bulgular`;
hükümleri `lib/kosum-kulvar.md`'nin kendi bölümlerindedir — değerlerini buraya kopyalama, bayatlar).

Yine de ikisinin de **preseti yazılmadı ve yazılmamalı**, iki ayrı gerekçeyle. **Birincisi
yapısaldır:** preset yalnız yetkiyi adlandırır, **kulvar seçmez** (gerekçe önsözdeki sıra kısıtıdır)
— işin nereden geldiği, hangi komutun dağıtıldığı, koşumun ne zaman bittiği ve **sırayı kimin
seçtiği** bir preset'in değil kulvarın hükmüdür; ikisi zaten oraya yazılmıştır. **İkincisi
ölçüttür:** bugün o iki koşumda adlandıracak bir **yetki farkı** yok — serbest metin 1e'nin dört
gücüyle çalışıyor — ve tüketicisiz bir preset motorun sahip olmadığı bir yeteneği vaat eder. Bir
yetki farkı doğarsa (örn. bir kulvarda kalıcı olarak farklı bir duran-yetkilendirme sınırı) preset o
zaman yazılır.
