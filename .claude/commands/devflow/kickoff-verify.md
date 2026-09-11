# DevFlow — Proje Başlatma Oturum 3: Kontrol ve Tamamlama (Kickoff Verify)

Bu komut kickoff sürecinin son adımıdır. Oluşturulan dokümanları kontrol eder, eksikleri tamamlar ve CLAUDE.md'yi oluşturur.

**Kullanım:** `/devflow:kickoff-verify`

**Ön Koşul:** `/devflow:kickoff-docs` oturumu tamamlanmış olmalı.

**Çağrı kipi — kurulum kapanışı mı, hedefli onarım mı? (her şeyden önce belirle.)** Bu komutun tek adımı da çağrılabilir: `audit-docs`, parent `CLAUDE.md`'nin **yerini** denetlemek için rotayı **Adım 3**'e verir — bölmesi o turun kendi işidir, buraya gelmez (`audit-docs` Adım 1), ve kurulum eksikleri her an **Adım 2**'den tamamlanabilir. **Ölçüt iki dokümanın kesişimidir — `_dev/DURUM.md`'nin Aktif Faz alanı ve `_dev/PHASES.md`'nin Faz Durumu tablosu; ikisi de aşağıdaki Zorunlu listededir, kipi onları okuduktan sonra belirle.** ⚠️ **İki ölçümden biri okunamıyorsa** (dosya yok · alan yok · bölüm bulunamıyor) bu "boş" değil **ÖLÇÜLEMEDİ**'dir ve kollar hiç koşmaz — dur ve sor (aynı ayrım: CLAUDE.md → Oturum Kapanışı, ayıklama maddesi). İkisi de okunduysa kollar **sıralıdır**, ilk tutan kazanır:

1. **Aktif Faz boşsa → kurulum kapanışı.** Alanı boşaltan yol re-kickoff'a hazırlıktır (ölçüt: DURUM'un Aktif Faz alanını boşaltan her rota — bugün `review-phase`'in senaryo-testi dalı ve `prd-review` 2c); tablo bu kolda dolu kalır.
2. **Faz Durumu tablosu hiç girilmiş faz içermiyorsa → kurulum kapanışı.** İlk kickoff ve brownfield bu koldan geçer.
3. **Aksi hâlde → hedefli onarım** — tabloda girilmiş faz var, proje faz döngüsünün ortasındadır.

> **Ölçüt neden tablo, DURUM'un dolu olması değil:** `kickoff-docs` Adım 3 Aktif Fazı **ve** `Adım`'ı doldurarak biter (Phase 1 / `discuss`), yani "iki alan da dolu" olağan kurulum yolunun kendi çıktısıdır — onu onarım kipine düşüren bir ölçüt, ilk kurulumun kapanışını kendi kendine iptal eder. Tabloya **yalnız `discuss-phase` promote eder** ve `kickoff-docs` tabloyu **boş bırakır**; bu yüzden 2. kol ilk kurulumu yakalar. **Faz-arası pencere 3. kola düşer ve bu bilinçlidir:** `review-phase` Adım 6 sonraki faza geçerken `Aktif Faz = N+1 / Adım = discuss` bırakır ama fazı tabloya **eklemez** — orada Aktif Faz da tabloda yoktur, ama tablo dolu olduğu için kip onarım kalır ve yürüyen faz Adım 4 tarafından yeniden hesaplanmaz.

Hedefli onarım kipinde: **Yalnız çağrılan adımı çalıştır** — çağıran hangi adımı işaret ettiyse o. **Çağrı bir adım işaret etmiyorsa** (çıplak `/devflow:kickoff-verify`) çalıştıracak adım yoktur: ne aradığını sor, hepsini koşturma.

⚠️ **Sorunun cevaplarından biri bu kipte tanımlıdır: re-kickoff kapanışı.** Faz ortasında koşan re-kickoff (PRD ekleme — `help` → *"Mevcut Projeye PRD Ekleme"*) Aktif Fazı **boşaltmaz** ve tabloya faz eklemez, yani kol 1 de kol 2 de tutmaz: `kickoff-docs`'un adıyla gönderdiği oturum bu kipe, üstelik çıplak düşer. Ayırt edici, o komutun kapanış bloğunun **parantezli kip notudur** (`/devflow:kickoff-verify (re-kickoff kapanışı)`); not gelmediyse kullanıcı aynı şeyi cevabında söyleyebilir. **İki kol da yazılıdır:** cevap re-kickoff kapanışıysa **akışın tamamı koşar (Adım 1 · 2 · 2b · 3 · 4 · 5 · 6 · 7)**; Adım 4'ü listeden düşürme — o adımın DURUM maddesi kip kapısını **kendi içinde** taşır (*"yalnız kurulum kapanışı kipinde"*), oysa aynı adımın INDEX işini Adım 2b ona adıyla devreder ve adım düşerse o devir boşa çıkar. Cevap gelmez ya da başka bir adımı işaret ederse fıkra aynen geçerlidir. **Adım 4'ün DURUM yazımını YAPMA** ve kapanış bloğunda "proje başlatma tamamlandı" deme (ikisinin de doğru hâli aşağıda kendi yerlerinde yazılı). Gerekçe: Adım 4 Aktif Fazı `max+1`/`discuss` diye **yeniden** hesaplar; faz ortasında bu, yürüyen fazı var olmayan bir sonrakiyle değiştirir ve sıradaki oturum oradan yanlış komuta gider. Hangi kipte olduğun belirsizse **dur ve sor** — DURUM'u yeniden yazmak geri alınması pahalı bir hamledir.

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (istisna)
Bu komut CLAUDE.md'yi **oluşturan** komuttur — çalıştığı anda CLAUDE.md henüz yoktur. Bu yüzden Oturum Başlangıç Protokolü referansı yerine protokol dosyaları burada doğrudan listelenir ve komut tarafından doğrulanır. (Re-kickoff modunda CLAUDE.md varsa bile, bu komut onu güncellediğinden dosyalar yine doğrudan okunur.)

### Zorunlu (hepsini oku)
1. `_dev/OVERVIEW.md`
2. `_dev/ILKELER.md`
3. `_dev/INDEX.md`
4. `_dev/DURUM.md`
5. `_dev/MEMORY.md`
6. `_dev/MODULE-MAP.md`
7. `_dev/PHASES.md`
8. `_dev/QUALITY.md`
9. `_dev/tasks/TASKS-README.md`

### Göreve Göre (ilgili adımlarda okunacak)
- `_dev/modules/` klasöründeki tüm modül dokümanları → Adım 1'de MODULE-MAP'ten dosya adlarını tespit et ve oku
- INDEX.md'de listelenen projeye özgü dokümanlar (STYLE-GUIDE vb.) → Adım 1'de oku
- `_dev/PRD/VERSIONS.md` → **Adım 1'de** PRD referans kontrolü için oku (PRD varsa)
- `_dev/PRD/features/` altındaki feature dokümanları → **Adım 1'de** PRD→MODULE aktarımı kontrolü için oku (PRD varsa)
- Git stratejisi → **Adım 2b'de** oku: `_dev/GIT-STRATEJI.md` (varsa — gerçeklikle uyum teyidi bu dosyayı okumayı gerektirir; ilk kurulumda yoktur) + template `.claude/commands/devflow/templates/GIT-STRATEJI.md` + kurma/değiştirme tarifi `.claude/commands/devflow/lib/git-strategy-kurulum.md`
- CLAUDE-MD template → **Adım 3'te** oku: `.claude/commands/devflow/templates/CLAUDE-MD.md` (parent) + `.claude/commands/devflow/templates/claude/*.md` (dört doktrin çocuğu) + bölme dalına girilirse tarif `.claude/commands/devflow/lib/claude-md-bolme.md`
- NATIVE-MEMORY-REDIRECT template → **Adım 5'te** oku: `.claude/commands/devflow/templates/NATIVE-MEMORY-REDIRECT.md`

---

## Yapılacaklar

**Adım 0 — Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"da doğrudan listelenen protokol dosyalarını oku/doğrula (bu komutta CLAUDE.md henüz yok — protokol referansı yerine dosyalar doğrudan listelidir), sonra tek satırlık okuma-onayını yaz (format → CLAUDE.md template: Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### Adım 1: Doküman Tutarlılık Kontrolü

Tüm dokümanları okuyarak şu kontrolleri yap:

**a) Bilgi Tutarlılığı:**
- OVERVIEW'daki bilgiler MODULE-MAP ile uyumlu mu?
- MODULE-MAP'teki feature'lar modül dokümanlarıyla örtüşüyor mu?
- PHASES.md'deki **Sıradaki Fazlar** konuları MODULE-MAP'teki feature'lar/versiyonlarla tutarlı mı (kapsam boşluğu yok mu)? (Faz Durumu tablosu kickoff sonrası **boştur** ve MODULE-MAP Faz sütunu tümüyle `—`'dir — bu normaldir; numara faza girince atanır.)
- Bilgi tekrarı var mı? (aynı bilgi birden fazla yerde)

**b) Doküman Bütünlüğü:**
- INDEX.md'de listelenen tüm dokümanlar gerçekten mevcut mu?
- Oluşturulmuş ama INDEX.md'de listelenmemiş **içerik dokümanı** var mı? (modül, docs, PRD içerik, projeye özgü sabit) — task/faz dokümanları INDEX'te enumere edilmez, bu kontrol onları kapsamaz.
- Template placeholder'ları kalmış mı? ([PROJE_ADI], [Tarih] vb.) — **üretilen dokümanların tamamında**, tek bir dosyaya daraltmadan.
- **`_dev/KICKOFF-NOTES.md` hâlâ duruyor mu?** Duruyorsa aktarım bitmemiştir — `kickoff-docs` Adım 6 o dosyayı ancak *"aktarılmamış karar varken silme"* kontrolünü geçince siler. Bu bir **içerik dokümanı değildir**, yani üstteki iki kalem onu görmez. Duruyorsa kapanış bloğuna *"proje başlatma tamamlandı"* yazma: kalemi rotasıyla bildir (`/devflow:kickoff-docs`) ve `📋`'yi ona ver — aynı ölçüt `run-phase`'in koşum açılışında da var (`lib/kosum-zemini.md` 1a) ve orada hiçbir tur açtırmaz.
- Boş veya eksik bırakılmış bölümler var mı?
- **ILKELER.md var mı ve [PROJE_ADI]/[Tarih] gibi taban placeholder'ları temizlenmiş mi?** "Bu Projeye Özgü" alanları boş olabilir (henüz konuşulmadıysa normal — varsayım yapma); ama o alanlardaki bracket'li **prompt metni** ham bırakılmamalı: ya doldur ya "henüz tanımlanmadı" yaz.

**c) Kalite Kontrolü:**
- Modül dokümanlarında kabul kriterleri somut ve test edilebilir mi?
- Edge case'ler yeterli mi?
- QUALITY.md projeye uygun şekilde düzenlenmiş mi?

**d) PRD Referans Kontrolü (PRD varsa):**
- PRD'deki tüm feature'lar modüllere atanmış mı?
- VERSIONS.md'deki feature-versiyon eşleştirmesi MODULE-MAP'e doğru aktarılmış mı? (Versiyon sütunu)
- Versiyonlar fazlarla uyumlu mu?
- PRD'deki davranış kuralları MODULE dokümanlarına kabul kriterleri olarak yansımış mı?
- DURUM.md'de Aktif Versiyon alanı doğru doldurulmuş mu?

### Adım 2: Eksikleri Tamamla

Kontrol sırasında bulunan eksikleri düzelt:
- Eksik bilgileri doldur
- **ILKELER.md hiç yoksa** (eski kurulum) template'ten (`.claude/commands/devflow/templates/ILKELER.md`) oluştur — "Bu Projeye Özgü" alanlarını kullanıcıya sorarak doldur, cevaplanmayan alan boş kalır
- Tutarsızlıkları gider
- Placeholder'ları temizle
- INDEX.md'yi güncelle

Eğer kullanıcıdan bilgi gerekiyorsa, sor ve al.

### Adım 2b: Git Stratejisi Dokümanı

`_dev/GIT-STRATEJI.md` her projede bulunur — **beyan edilmiş "yok" ile hiç sorulmamış aynı şey değildir.** Dosya yoksa (ilk kurulum ya da eski kurulum) template'ten (`.claude/commands/devflow/templates/GIT-STRATEJI.md`) oluştur; varsa gerçeklikle uyumunu teyit et (dallar hâlâ beyandaki gibi mi, remote değişmiş mi).

**Doldurma tarifi `.claude/commands/devflow/lib/git-strategy-kurulum.md`'dedir — burada tekrarlanmaz.** Özü: önce probe (`git remote -v`, `git branch -a`, workflow ve deploy konfigürasyonu), sonra doldurulmuş bir öneri, sonra teyit. Boş soru sorma.

**Ölçü:** basit projede bu adım **tek cümlelik bir teyittir**, tören değil:

```
Git durumu: tek dal `main`, remote `github.com/<...>`, canlı yayın veya deploy bağı görmedim.
Böyle kaydediyorum — itirazın var mı?
```

Yalnız probe {canlı kullanıcı} ya da {bir dalı izleyen otomatik deploy} işareti verirse ayrı çalışma/yayın dalı, yayın anı, acil düzeltme rotası ve doğrulama kapısı tek tek konuşulur (tarif md. 3).

Dal oluşturulması gerekiyorsa (kullanıcı ayrım istiyor ama dal yok) komutları **kullanıcı onayıyla sen çalıştır**, adım adım ve çıktı görünür olacak şekilde; eksik altyapıyı sessizce varsayma.

> Bu doküman INDEX'in "Temel Dokümanlar" listesinde 5. sıradadır (template'te hazır gelir) — Adım 4'te INDEX'i güncellerken bunu doğrula.

### Adım 3: CLAUDE.md Oluştur veya Güncelle

**Önce oku:** `.claude/commands/devflow/templates/CLAUDE-MD.md` **ve** `.claude/commands/devflow/templates/claude/*.md` (dört doktrin çocuğu).

> **CLAUDE.md parçalı bir dokümandır.** Parent repo kökünde durur (istisna: Adım 3'ün ret kolu); doktrin bölümlerinin tam metni `_dev/claude/` altındaki dört çocuktadır ve parent'ın "Doktrin Dosyaları" bloğundaki `@` satırlarıyla **import edilir** — yani içerikleri her oturumda bağlamdadır, ayrıca okunmaları gerekmez. Kesim motorda sabittir, projede yeniden kararlaştırılmaz (kanon: CLAUDE.md → Doküman Disiplini → Boyut ve Bölünme).

**Önce parent'ın yerini tespit et.** Kökte `CLAUDE.md` yoksa "yok" demeden önce `.claude/CLAUDE.md`'ye bak — filoda ölçülmüş bir hâldir. Oradaki dosya `## Oturum Başlangıç Protokolü` başlığını içeriyorsa projenin **kendi parent'ıdır** (içermiyorsa global bir kural kopyasıdır, ilgisizdir): o hâlde "mevcut" say. **Başlığı aksana duyarsız ara** — filoda başlığını tümüyle aksansız yazan canlı bir proje vardır (`## Oturum Baslangic Protokolu`); onun parent'ı kökte olduğu için bugün bu bakışa girmiyor, ama aynı biçimde yazılmış bir `.claude/` parent'ını duyarlı arama "global kural kopyası" sayıp yok sayardı. Katlamanın evi `audit-canvas.py` → `fold`.

**Taşımadan yenisini yaratma.** Harness her iki yolu da bağlama yükler: ikinci bir parent doğurmak doktrini ikiye ayırır ve sürükler. Kanvas ikisini de izlediği için hâl **gizli kalmaz** — ama çözülmüş de olmaz: iki parent **iki ayrı uygunluk kalemi** üretir ve doktrin, hangisinde yaşayacağı kararlaşana dek bölünmüş kalır.

**Kökte `CLAUDE.md` VARSA da `.claude/CLAUDE.md`'ye bak.** İkisi de protokol başlığı taşıyorsa proje zaten o hâle düşmüştür ve bu dal yine işler — ama kalem taşıma değil **birleştirmedir** ve kardeşi gibi **onaya bağlıdır** (`audit-docs` Adım 1 bu hâli buraya yönlendirir). **Sormadan önce kaydı ara** (kardeş dallarla aynı ölçü): parent'lardan birinde `<!-- KURAL: iki parent bilinçli tutuluyor -->` yorumu varsa soru daha önce sorulmuş ve cevaplanmıştır — **hiç açma**, raporda tek satırla an. Kayıt yoksa: hangisinin kalacağını sor, ötekinin doktrinini ona taşı, boşalanı **ancak onay aldıktan sonra** sil — dosya silmek geri alınamaz, sormadan yapma. Kaybolan yol için **aşağıdaki süpürme listesinin tamamı** işler (işaretçiler · `@` import satırları · karar cümleleri · kanvas), yönü kaybolan yola göre okunur. **Onay gelmezse** birleştirme yapılmaz: hâli raporda tek satırla an ve kararı **kalan** parent'a tek satırlık `<!-- KURAL: iki parent bilinçli tutuluyor -->` ile kaydet — kayıt düşmezse sıradaki tur aynı kalemi yeniden açar.

Parent'ı düz `mv` ile köke taşı ve eski+yeni yolu Adım 6'nın commit'inde birlikte stage et (`git mv` **kullanma** — index'e hemen yazar, kanon: CLAUDE.md → Paralel Oturum Farkındalığı) — **ama önce öner ve onay al.** Bu, aşağıdaki bölme dalından **ayrı bir karardır** ve ölçütü de ayrıdır: bölmenin kesimi motorda sabittir, dosyanın *yeri* ise değildir — parent'ı `.claude/` altına koymak kullanıcının kayıtsız ama bilinçli bir tercihi olabilir ve taşıma harness'ın yüklediği dosyayı hareket ettirir. Onay Ölçütü'nün "aksi yönde kayıt yok" koşulu burada yazılı bir kayda indirgenemez. **Sormadan önce projenin yazılı kararına bak:** `_dev/OVERVIEW.md`, `_dev/docs/DECISIONS.md` ve parent'ın kendisindeki `<!-- KURAL: … (bilinçli) -->` kayıtlarında konumu savunan bir karar varsa soruyu **hiç açma** — raporda tek satırla an ve parent'ı bulunduğu yerde güncelle (filoda ölçülmüş örnek: `intract-websitesi/_dev/OVERVIEW.md`, üstelik OVERVIEW Korumalı Doküman'dır).

Onay gelirse taşıma **aynı turda** eski yola bakan işaretçilerle birlikte kapanır. Süpürülmezse INDEX kendi içinde çelişir, README bağlantısı kırılır ve bir sonraki `audit-docs` turu bunları mekanik kalem olarak açar — audit kendi işini ikinci kez yapar.

- **Tarama kapsamı:** `grep -rn '\.claude/CLAUDE\.md' _dev/ README.md CLAUDE.md` — iki isabet sınıfı **elle düzeltilmez**: **vendored motor kopyası** (`.claude/commands/devflow/**`; kanon: Doküman Disiplini → Boyut ve Bölünme, "projedeki kopya vendored'dır, her kurulumda silinip yeniden iner") ve **üretilen ayna** (`_dev/.audit/canvas.tsv` — kanvas artık parent'ı bu yolla izlediği için grep orada da isabet verir; ayna `canvas.db`'den üretilir, elle düzeltilen satır sıradaki yazımda kaybolur → aşağıdaki kanvas maddesi).
- **Saf yol işaretçileri** (INDEX giriş notu + hiyerarşi ağacı, README bağlantısı) → yeni yola çevrilir.
- **Parent'ın kendi `@` import satırları** (proje bölünmüşse) → **yeni tabana göre yeniden yazılır.** Göreli import, import'u içeren dosyaya göre çözülür: parent `.claude/` altındayken satırlar `@../_dev/claude/…` olur, köke taşınınca `@_dev/claude/…`. Çevrilmezse dört doktrin birden repo dışını gösterir ve sessizce bağlam dışında kalır — üstelik yukarıdaki grep bu satırları **yakalamaz** (içlerinde `.claude/CLAUDE.md` geçmez). Taşımadan sonra dördünü de parent'ın yeni dizininden izleyerek doğrula (tarif: `lib/claude-md-bolme.md` → (4). adım).
- **Karar cümleleri** (OVERVIEW/ILKELER/DECISIONS'ta "kökte tutulmaz / tek talimat kaynağı şudur" gibi) → **mekanik çevrilmez**: yolu değiştirmek cümleyi kendi kendisiyle çelişir hâle getirir. Kararın tersine döndüğünü kullanıcıya söyle, cümleyi onunla birlikte yeniden yaz ve tersine dönüşü `_dev/docs/DECISIONS.md`'ye düş (OVERVIEW ve ILKELER **Korumalı Doküman**'dır — taşıma onayı onları değiştirme onayı değildir; ayrıca bildir ve onay al).
- **Audit kanvası — yalnız projede ZATEN varsa** (`_dev/.audit/canvas.tsv` duruyorsa). **Yoksa bu madde atlanır: bu komut kanvas kurmaz** (aynı hüküm `lib/claude-md-bolme.md` → bu reçetenin işi olmayan iki şey: `kickoff-verify`'da kanvas adımı yoktur) — `reconcile` çağırmak boş bir `_dev/.audit/` ağacı, `.gitignore` satırları ve — prettier'lı projede — bir `.prettierignore` satırı doğurur; hepsi kullanıcının istemediği kurulum artığıdır. **Varsa:** kanvas parent'ı `.claude/CLAUDE.md` yolundan izliyordu, taşıma sonrası o yol gerçekten yok olur — sıradaki `reconcile` eski satırı düşürür, yeni yolu `conformance:never` ile kuyruğa alır ve parent'ın denetim geçmişi sıfırlanır. Bu, yeniden adlandırılan her dokümanda olan bilinçli davranıştır (doküman yeni adıyla bir kez tam denetimden geçer); geçmişi taşımak gerekiyorsa tek yol `canvas.db`'ye elle `UPDATE docs SET path=…`'tır. Raporda tek satırla an — yoksa sıradaki tur bunu kusur sanar.
- **Donmuş kayıtlar** → hiç dokunulmaz. Sınıfı örnekle değil **adıyla** al: tek evi `CLAUDE.md` → Doküman Kuralları → Tarihsel/append-only doküman kuralıdır (`tasks/archive/*`, `bulgular/archive/*`, PHASES'te kapanış damgası almış `PHASE-N.md` ve bölme çocukları, `docs/DECISIONS.md`, `tasks/TASKS-README.md`). **`_dev/PRD/**` de versiyon ortasında donuktur** — orada isabet varsa çevirme, `/devflow:prd-note` öner. Ölçüm/kanıt taşıyan canlı kayıtlarda (BULGULAR girdisi, retrospektif ölçümü) yol o ölçümün parçasıdır: çevirme, dipnotla eski yolu koru.

**Onay gelmezse** taşıma yapılmaz: hâli raporda tek satırla an, parent'ı bulunduğu yerde güncelle **ve kararı kayda geçir** (aynı ölçü: geri alınan bir kap işleminin kaydı — `lib/claude-md-bolme.md` → "Kullanıcı uygulanan bölmeyi geri isterse") — kaydın evi **parent'ın kendisidir**, tek satırlık `<!-- KURAL: parent .claude/CLAUDE.md'de kalır (bilinçli) -->`; `accept-size` DEĞİL (`lib/claude-md-bolme.md` → Hâl ayrımı: tanımı gereği yalnız boyut aşımını kabul eder). Kayıt düşmezse sıradaki `audit-docs` turu aynı kalemi bir kez daha açar. **Taşıma sonradan onaylanırsa bu KURAL kaydı SİLİNİR** (konusuz kaldı; `lib/claude-md-bolme.md` tarifinin (6). adımının yaptığının aynısı) — kök CLAUDE.md'ye taşınıp yanlış hâliyle yaşamasına izin verme.

**CLAUDE.md zaten mevcutsa:** Değişen bilgileri güncelle (yeni modüller, yeni projeye özgü kurallar, değişen faz bilgileri vb.). Mevcut özelleştirmeleri koru. Template'te olup dosyada eksik olan `<!-- KURAL: … -->` yorumlarını aktar; aktarım gerekçesiyle mevcut içeriği budama — budama audit'in rapor→onay işidir.

**Mevcut CLAUDE.md tam bölünmüş değilse** — hiç bölünmemiş proje (`_dev/claude/` yok) da, bölmesi yarıda kalmış proje (klasör var ama tarif bitmemiş) da bu dala düşer. Hâl ayrımı (hangi adımda kesildi) ve altı adımlık bölme tarifi **tek evdedir** ve burada tekrarlanmaz: `.claude/commands/devflow/lib/claude-md-bolme.md` — **Read ile oku ve izle**; yukarıdaki "Önce oku" template'leri o tarifin girdisidir. Bölmeyi **uygula ve raporda bildir** — sorma: kesim, dört çocuğun adları ve parent özetlerinin metni motorda sabittir, yani ortada kullanıcının vereceği bir karar yoktur (kanon: CLAUDE.md → Onay Ölçütü). **İki istisna:** (1) çocuğa taşınacağından emin olmadığın proje-özgü bir sapma varsa taşıma, **o metni** sor; (2) kök dosyada bölmeyi erteleyen bir `<!-- KURAL: … (bilinçli) -->` kaydı varsa bölme daha önce reddedilmiştir — uygulama, raporda tek satırla an. (Kaydın evi her hâlde bu yorumdur; canvas'taki boyut kabulü ayrı bir borcun kaydıdır, bölmenin reddi anlamına gelmez — `lib/claude-md-bolme.md` → Hâl ayrımı.) **Bu, parent'ın *yerinden* ayrı bir karardır:** taşıma (yukarıdaki dal) onaya bağlı kalır, bölme değil. **Ama iki karar tek yerde kesişir:** taşıma reddedildiyse parent `.claude/` altında kalır ve `@` import satırlarının göreli tabanı da orası olur — template'ten olduğu gibi kopyalanan `@_dev/claude/…` hiçbir dosyaya varmaz. Tarifin (4). adımı bu hâli adıyla ele alır; sırası geldiğinde oradan oku.

**CLAUDE.md yoksa:** Repo kökünde (`/CLAUDE.md`) parent'ı, `_dev/claude/` altında dört çocuğu oluştur. Template'i kullan ama projeye göre düzenle:

- Proje bilgilerini doldur
- Template'teki `<!-- KURAL: … -->` yorumlarını üretilen dosyalara olduğu gibi aktar (→ kickoff-docs: "KURAL yorumlarını koru")
- Dört doktrin çocuğunu `templates/claude/` altından `_dev/claude/` altına birebir kopyala (proje-özgü uyarlama gerekmiyorsa metin aynen kalır) — **tek istisna** `DOKUMAN-KURALLARI.md`'deki `[PROJEYE_ÖZGÜ_SABİT_DOKÜMANLAR]`: proje sabiti varsa doldur, yoksa satırı sil (aynı karar Protokol'ün sabit listesi ve INDEX aynasıyla hizalanır); ham placeholder bırakma ve parent'ın "Doktrin Dosyaları" bloğundaki `@` satırlarının bu dosyalara çözüldüğünü doğrula
- Projeye özgü sabit dokümanları "Oturum Başlangıç Protokolü"ne ekle — yalnız oradaki KURAL kriterini karşılayanları (görevden bağımsız, gerçekten her oturum yön veren); göreve-göre olanlar INDEX senaryolarında kalır. INDEX'teki "Projeye Özgü Sabitler" aynasını aynı karara göre hizala
- Dokunulmazları belirle (config dosyaları, migration'lar vb.)
- Projeye özgü kuralları yaz (framework kuralları, convention'lar vb.)
- Commit convention'ı projeye uyarla

**Kritik:** Yeni kurulumda CLAUDE.md repo kökünde oluşturulur, `_dev/` içinde değil (mevcut projede parent `.claude/CLAUDE.md`'de kalmışsa Adım 3'ün ret kolu geçerlidir). Doktrin çocukları ise **`_dev/claude/` altında** olmalı — repo köküne ya da `.claude/` altına konursa audit canvas'ı onları hiç görmez ve doktrin sessizce denetim dışına düşer. (Kanvasın `.claude/` altında izlediği **tek** dosya parent'ın kendisidir — `.claude/**` ağacına inilmez, çünkü motorun projeye kurulmuş kopyası oradadır.)

### Adım 4: Son Güncellemeler

- INDEX.md'ye CLAUDE.md'yi **gerçek yoluyla** ekle: kökteyse repo kökünde olduğunu belirt; Adım 3'te taşıma reddedildiyse `.claude/CLAUDE.md` yazılır ve ret kararı tek satırla anılır — INDEX'in ağacı ile giriş notu **aynı yolu** söylemeli; INDEX'te duran doğru yolun üstüne yazma. Doküman Hiyerarşisi ağacına `claude/` çocuklarını **yalnız `_dev/claude/` gerçekten diskteyse ve kayıt henüz yoksa** yaz (bölme bu turda uygulandıysa kaydı `lib/claude-md-bolme.md` tarifinin (5). adımı zaten düşmüştür) — Adım 3'te bölme ertelendiyse ya da reddedildiyse bu satırları **yazma**: Adım 1'in kendi kontrolü ("INDEX.md'de listelenen tüm dokümanlar gerçekten mevcut mu?") bir sonraki turda onları eksik doküman olarak açar, ve INDEX erteleme kaydıyla çelişerek bölmenin yapıldığını söyler. (Yazıldığı hâlde de okuma listelerine EKLEME — import edildikleri için zaten bağlamdalar; INDEX KURAL 4)
- DURUM.md'yi güncelle — **yalnız kurulum kapanışı kipinde** (hedefli onarımda bu madde atlanır; kip ayrımı dosyanın başında). **Aktif Faz:** girilecek sıradaki faz = **Faz Durumu tablosundaki en büyük faz no + 1** (tablo boşsa 1); adı Sıradaki Fazlar listesinin ilk maddesinden alınır (geçici — discuss-phase kesinleştirir), **Adım:** discuss. İlk kickoff'ta bu Phase 1'dir; re-kickoff'ta global sayaç devam eder (versiyon değişse de sıfırlanmaz). "Phase 1" varsayma — max+1 ile hesapla ([PHASES.md → Faz Numaralandırma Kuralı](templates/PHASES.md)).
  - ⚠️ **Kipin içinde ikinci bir kapı vardır:** DURUM'un **Versiyon Sonu Durumu** alanı `prd_review_bekliyor` ise alanları **YAZMA** — dur ve kullanıcıyla teyit et. Gerekçe: o ayak izinde (Aktif Faz boş **ve** `prd_review_bekliyor`) kanonun sıradaki komutu `/devflow:prd-review`'dur (CLAUDE.md → Oturum Kapanışı, dört özel durum); buraya `max+1`/`discuss` yazmak ayak izini yok eder ve **zorunlu adım sessizce düşer**. Aynı ölçü kardeş komutta da yazılı (`kickoff-docs` → Re-Kickoff → DURUM maddesi).
  - **Cevabın üç kolu da yazılıdır:** kullanıcı durumun **doğru** olduğunu söylerse (prd-review gerçekten bekliyor — bilinçle ertelenmiş de olabilir) alanlar **yine yazılmaz**; ayak izi korunur, akış Adım 5·6·7 ile normal sürer (commit atılır — Adım 1-3'ün yazdıkları ağaçta commit'siz kalmasın) ve kapanış bloğunun `📋`'sini kanon verir (→ Adım 7). Durumun **bayat** olduğunu söylerse (prd-review yapılmış, alan güncellenmemiş) alanları yaz **ve aynı turda Versiyon Sonu Durumu'nu `içerik_fazları`'na çek** — yoksa `Adım` dolu + `prd_review_bekliyor` diye kendi içinde çelişen bir DURUM bırakırsın (kardeş komut aynı hâlde aynı sıfırlamayı yapar). **Cevap gelmezse yazma — ama akışı durdurma:** yazılmayan yalnız bu maddenin DURUM alanlarıdır; Adım 5·6·7 olağan hâlleriyle koşar, yoksa Adım 1-3'ün diske yazdıkları commit'siz kalır (Adım 6). Yazmamak geri alınabilir, yazmak değil (gerekçe: Çağrı kipi bloğunun *"DURUM'u yeniden yazmak geri alınması pahalı bir hamledir"* cümlesi).

**Not:** Faz dokümanı (PHASE-1.md) bu oturumda oluşturulmaz — discuss-phase oturumunda oluşturulacak.

### Adım 5: Native Memory Yönlendirmesi (Harness Entegrasyonu)

DevFlow proje hafızasını repo içinde (`_dev/memory/`) tutar; Claude'un native (yerleşik) memory'si proje bilgisi için kullanılmaz (CLAUDE.md → Native memory yönlendirmesi). Bunu kalıcı kılmak için projenin native memory index'ine — `~/.claude/projects/<bu-proje>/memory/MEMORY.md`, yani harness'ın sana bu oturumda bildirdiği native memory konumu — bir yönlendirme yazılır. Bu adım ilk kickoff'ta yönlendirmeyi kurar, re-kickoff'ta bozulmuşsa geri getirir.

**Değişmez kural (önce taşı, sonra yaz):** Native MEMORY.md'de yönlendirme template'i DIŞINDA herhangi bir içerik (eski native öğrenimler, sızmış proje bilgisi) varsa, o içerik ÖNCE `_dev/memory/`'ye taşınır (her biri `_dev/memory/<slug>.md` + `_dev/MEMORY.md` index pointer'ı). **Toplu göç index'i bir kerede şişirebilir — önce `.claude/commands/devflow/lib/memory-sistemi.md`'yi Read et:** konusu aynı olanlar tek atomda toplanır (gerekmedikçe yeni dosya açma) ve pointer satırı **kancasız** doğar; kanca ancak "dosya açılmadan bilinmezse oturum yanlış hamle yapar" testini geçen kayıt için yazılır. **Taşımadan asla üzerine yazma.**

Sırayla:
1. Native memory index'ini (MEMORY.md) oku.
2. Yönlendirme dışında içerik varsa → `_dev/memory/`'ye taşı (yukarıdaki kural).
3. `.claude/commands/devflow/templates/NATIVE-MEMORY-REDIRECT.md` içeriğini native MEMORY.md'ye **yaz** (dosyanın tüm içeriği bu olur; zaten birebir doğruysa dokunma).
4. Taşıdığın bilgi varsa kontrol raporunda belirt.

> Bu, DevFlow'un repo DIŞINA yazdığı **tek** şeydir; bilinçli bir harness entegrasyonudur. Native memory proje-bazlıdır (`~/.claude/projects/<bu-proje>/`), içeriği yalnızca bu projeye aittir — `_dev/`'ye taşımak doğru hedeftir. Harness native memory konumunu bildirmiyorsa bu adımı atla ve raporda not düş.

### Adım 6: Git Commit & Push

Tüm doküman değişikliklerini ve CLAUDE.md'yi commit & push yap. ⚠️ **Adım 3 bir parent'ı diskten kaldırdıysa — taşımanın `mv`'si de birleştirmenin silmesi de — eski yolu da stage et** (`git add CLAUDE.md` ve **ayrıca** `git add .claude/CLAUDE.md`; iki yolu tek çağrıda verme — eski yol git'çe bilinmiyorsa `git add` çağrının **tamamını** reddeder ve yeni yol da stage'siz kalır): silme index'e kendiliğinden yazılmaz, yalnız kalan parent'ı stage edersen commit'ten sonra ağaçta **iki parent** durur ve silme kalıcı olarak stage'lenmemiş görünür.
```
docs: kickoff-verify — [verification complete | targeted repair]: [CLAUDE.md created | parent moved to repo root | parents merged | CLAUDE.md updated]
```
⚠️ **Mesajın iki köşeli parantezi de koşan işe göre doldurulur, sabit metin değildir.** Rapor uçucudur, commit mesajı kalıcıdır: hedefli onarım kipinde Adım 1 (verification) hiç koşmaz, ve Adım 3'ün taşıma kolunda git kaydı bir **rename**'dir — sıfır dosya oluşur. Aynı yasağı Adım 7 rapor yüzeyinde adıyla taşıyor; commit yüzeyinde de geçerlidir.

### Adım 7: Kontrol Raporu ve Sıradaki Adım

Kullanıcıya kontrol sonuçlarını sun:

```
📋 Kickoff Kontrol Raporu:
✅ Doküman tutarlılığı: X doküman kontrol edildi
✅ Bilgi bütünlüğü: Eksik/tutarsızlık yok (veya düzeltildi)
✅ Git stratejisi: [tek dal / çalışma+yayın ayrımı] — GIT-STRATEJI.md
✅ Talimat dosyası (CLAUDE.md): oluşturuldu — ana dosya + 4 kural dosyası | bölündü: kural metinleri kendi dosyalarına taşındı, ana dosyada özet + otomatik yükleme satırı kaldı | zaten bölünmüştü, güncellendi | daha önce geri alınmış, dokunulmadı (kayıt duruyor)
   [yalnız olağandışı hâlde tek satır daha: kökte değil, `.claude/` klasöründe duruyor — oraya taşımak ayrı bir karar, bu turda dokunulmadı | **kökte değildi, onayınla köke taşındı** (eski yola bakan işaretçiler ve `@` import satırları aynı turda çevrildi) | iki kopyası vardı, onayınla [kalan yol]'da birleştirildi | iki kopyası duruyor, ikisini birden tutmak sizin kararınızdı — dokunulmadı (kayıt duruyor)]
✅ Native memory yönlendirmesi kuruldu/doğrulandı (taşınan bilgi varsa belirt)
✅ INDEX.md güncel

Oluşturulan dokümanlar:
- /CLAUDE.md   ← parent'ın gerçek yolu; taşıma reddedildiyse `.claude/CLAUDE.md` yazılır (Adım 3'ün ret kolu)
- _dev/claude/{DOKUMAN-KURALLARI,DOKUMAN-DISIPLINI,CALISMA-PRENSIPLERI,COMMIT}.md   ← yalnız _dev/claude/ diskteyse
- _dev/OVERVIEW.md
- _dev/ILKELER.md
- _dev/INDEX.md
- _dev/DURUM.md
- _dev/MEMORY.md
- _dev/GIT-STRATEJI.md
- _dev/MODULE-MAP.md
- _dev/PHASES.md
- _dev/QUALITY.md
- _dev/modules/M1-[Ad].md
- ...
- _dev/tasks/TASKS-README.md
- _dev/docs/DECISIONS.md
- [projeye özgü dokümanlar]

✅ Proje başlatma tamamlandı!
📋 Sıradaki adım: /devflow:discuss-phase
   → Bu fazın kapsam tartışmasını ve faz dokümanı oluşturulmasını yapmak için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

⚠️ **Bloğun üstteki üç satırı — özet · `📋` · `→` — kurulum kapanışının hangi kolundan gelindiğine ve Adım 4'ün alanları yazıp yazmadığına göre değişir** (kollar dosyanın başında; sayı değil ölçüt: **şablonun her satırını, koşan işe göre yeniden yargıla**). **2. kol** — Faz Durumu tablosunda girilmiş faz yok (ilk kickoff · brownfield): yukarıdaki metin aynen yazılır. **1. kol** — Aktif Faz boş ama tablo dolu: proje N fazdır yürüyor, yani doküman *oluşturulmaz güncellenir* ve liste başlığı **`Güncellenen dokümanlar:`** olur; "proje başlatma tamamlandı" demek olguya aykırıdır. Özet ile `📋`/`→`'yi bu kolda **Adım 4** ayırır:
- **Adım 4 alanları yazdıysa:** `📋` `/devflow:discuss-phase`, `→` yukarıdaki gerekçe. Özet satırı **koşan işi** söyler ve ayırt edici **dosyanın başındaki Çağrı kipi fıkrasıyla aynıdır: çağrının parantezli kip notu, yoksa kullanıcının kendi beyanı** (`/devflow:kickoff-verify (re-kickoff kapanışı)` — tek üreticisi `kickoff-docs`'un Re-Kickoff kapanış bloğudur, yani zincir koştuğunda not çağrıda ELDEDİR). Not varsa `✅ Re-kickoff kapanışı tamamlandı — [Aktif Faz'ın yeni değeri].`; yoksa zincir koşmamıştır (çıplak çağrı · `audit-docs` rotası) ve özet `✅ Doküman denetimi tamamlandı — [Aktif Faz'ın yeni değeri] yazıldı.` olur — koşmamış bir zinciri tamamlandı ilan etme. ⚠️ **Adım 4'ün cevap kolu bu testin girdisi DEĞİLDİR:** *bayat* cevabı DURUM'un tazeliğini söyler, zincirin koşup koşmadığını değil; ikisi aynı koşumda birlikte de bulunabilir.
- **Adım 4'ün ikinci kapısı yazmayı durdurduysa** (`prd_review_bekliyor`; kullanıcı durumu doğruladı **ya da cevap gelmedi** — bu kolda re-kickoff KOŞMAMIŞ olabilir, çağrı doğrudan bu komuta gelmiş olabilir): özet **koşan işi** söyler (`✅ Doküman denetimi tamamlandı — alanlar korundu, prd-review bekliyor.`), `📋`'yi **kanon** verir (`Adım` boş + `prd_review_bekliyor` → `/devflow:prd-review`; CLAUDE.md → Oturum Kapanışı, dört özel durum) — **ama bu da koşulludur:** `_dev/tasks/quick/`'te bekleyen bir ⬜/🔄 kayıt varsa kanonun Terfi kuralı öncelik hükmü taşıyan kaydı öne alır ve *"hangisinin önce geldiği belli değilse bu bir sorudur"* der, yani **bloğu yazmadan sor** (kardeş ev aynı hükmü taşır: `lib/kosum-kapanisi.md` → `📋` listesi, kalem 1'in `prd_review_bekliyor` kolu) — ve `→` satırı o komutun gerekçesini yazar (`Versiyon sonu değerlendirmesi için yeni bir oturum başlat.`) — **`📋` ile `→` iki ayrı iş söylemez.**

**Hedefli onarım kipinde bu blok kullanılmaz** (kip ayrımı dosyanın başında) — bu kipte kapanan kurulum değildir. O hâlde blok şöyle olur: özet satırı **bu turda ne yapıldığını** söyler ve ölçüt **koşan adımlardır**, sayılan bir kol listesi değil — Adım 2'den gelen bir kurulum eksiği · re-kickoff kapanışının tam denetimi · Adım 3'ün kolları (`✅ Talimat dosyasının yeri denetlendi — [sonuç].` · `✅ İki talimat dosyası birleştirildi — [kalan yol].` · `✅ İki talimat dosyası hâli denetlendi — [sonuç].` · `✅ Talimat dosyası bölündü — [sonuç].`) hepsi buraya yazılır. `📋 Sıradaki adım` ise **DURUM'un bıraktığı yere** döner — faz döngüsünün konumu değişmedi; komutu `Adım` alanından türet (kaynak: kanonun *"Faz döngüsünün sıradaki komutu"* maddesi ve dört özel durumu → CLAUDE.md → Oturum Kapanışı), türetme komut vermiyorsa `yok — [bekleme koşulu]`. **Yasak türetmenin çıktısına değil şablona bakar:** yukarıdaki bloğun `discuss-phase` satırı bu kipte **kopyalanmaz** (kurulum kapanışının şablonudur, yürüyen faz zaten vardır) — ama türetme onu **veriyorsa yazılır**. Bunun tek hâli faz-arası penceredir (`Adım = discuss`, faz henüz tabloda yok — Çağrı kipi bloğunun 3. kolu, orada adıyla anılıyor); orada `discuss-phase` gerçekten sıradaki adımdır ve gizlenmesi sonraki oturumu konumsuz bırakır.

**Ama o türetme koşulludur ve koşulu tam da bu kipte tutar:** konum değişmediği için kanonun tarama emri burada da geçerlidir (aynı bölümün *"Net sıradaki komut yoksa…"* maddesi) — `_dev/tasks/quick/`'te devralınacak ⬜/🔄 bir kayıt varsa sıradaki adım **odur** (`/devflow:quick QUICK-NNN`), `Adım` türetmesi ancak öyle bir iş yokken yazılır — ve kayıt `📋`'ye çıktığında **türetmenin verdiği komut `→` satırında *"ondan sonra"* diye anılır** (kanon: Terfi kuralı; kardeş ev `lib/kosum-kapanisi.md` → `📋` listesinin giriş kapısı). Kip tanımı gereği kurulu bir projede koşar, yani bekleyen kayıt burada olağandır.

Son satır her kapanışta yazılır; kuralı, önekleri (`engel:` / `önerilir:`) ve ambleminin hesabı **CLAUDE.md → Oturum Kapanışı**'dadır. Bu komutta tipik kaynak, kontrol raporunda kapanmadan kalan bir eksiktir: kapatılamayan eksik faz döngüsünü engelliyorsa kanonun **terfi kuralı** işler — `📋` satırı `discuss-phase` değil o eksiği kapatan komut olur.

---

## Önemli Kurallar

- Bu oturumda task çalıştırma — sadece kontrol ve doküman tamamlama
- Placeholder bırakma — her şey doldurulmuş olmalı
- CLAUDE.md repo kökünde olmalı — istisnası Adım 3'ün ret koludur
- Faz dokümanı bu oturumda oluşturulmaz — discuss-phase'de oluşturulacak
- Kontrol sonuçlarını kullanıcıya raporla
