# DevFlow — Proje Başlatma Oturum 3: Kontrol ve Tamamlama (Kickoff Verify)

Bu komut kickoff sürecinin son adımıdır. Oluşturulan dokümanları kontrol eder, eksikleri tamamlar ve CLAUDE.md'yi oluşturur.

**Kullanım:** `/devflow:kickoff-verify`

**Ön Koşul:** `/devflow:kickoff-docs` oturumu tamamlanmış olmalı.

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
- Template placeholder'ları kalmış mı? ([PROJE_ADI], [Tarih] vb.)
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

**Önce parent'ın yerini tespit et.** Kökte `CLAUDE.md` yoksa "yok" demeden önce `.claude/CLAUDE.md`'ye bak — filoda ölçülmüş bir hâldir. Oradaki dosya `## Oturum Başlangıç Protokolü` içeriyorsa projenin **kendi parent'ıdır** (içermiyorsa global bir kural kopyasıdır, ilgisizdir): o hâlde "mevcut" say. Taşımadan yenisini yaratma: harness her iki yolu da bağlama yükler, yani iki canlı parent olur ve doktrin ikiye ayrılıp sürüklenir; üstelik audit canvas'ı yalnız köktekini izler, öteki sessizce denetim dışında kalır.

Parent'ı `git mv` ile köke taşı — **ama bu yapısal bir değişikliktir: öner ve onay al** (bölme dalının dediğiyle aynı ölçü — `lib/claude-md-bolme.md`, "sessizce yapılmaz"). **Sormadan önce projenin yazılı kararına bak:** `_dev/OVERVIEW.md`, `_dev/docs/DECISIONS.md` ve parent'ın kendisindeki `<!-- KURAL: … (bilinçli) -->` kayıtlarında konumu savunan bir karar varsa soruyu **hiç açma** — raporda tek satırla an ve parent'ı bulunduğu yerde güncelle (filoda ölçülmüş örnek: `intract-websitesi/_dev/OVERVIEW.md`, üstelik OVERVIEW Korumalı Doküman'dır).

Onay gelirse taşıma **aynı turda** eski yola bakan işaretçilerle birlikte kapanır. Süpürülmezse INDEX kendi içinde çelişir, README bağlantısı kırılır ve bir sonraki `audit-docs` turu bunları mekanik kalem olarak açar — audit kendi işini ikinci kez yapar.

- **Tarama kapsamı:** `grep -rn '\.claude/CLAUDE\.md' _dev/ README.md CLAUDE.md` — **vendored motor kopyası (`.claude/commands/devflow/**`) hiç düzenlenmez** (kanon: Doküman Disiplini → Boyut ve Bölünme, "projedeki kopya vendored'dır, her kurulumda silinip yeniden iner").
- **Saf yol işaretçileri** (INDEX giriş notu + hiyerarşi ağacı, README bağlantısı) → yeni yola çevrilir.
- **Karar cümleleri** (OVERVIEW/ILKELER/DECISIONS'ta "kökte tutulmaz / tek talimat kaynağı şudur" gibi) → **mekanik çevrilmez**: yolu değiştirmek cümleyi kendi kendisiyle çelişir hâle getirir. Kararın tersine döndüğünü kullanıcıya söyle, cümleyi onunla birlikte yeniden yaz ve tersine dönüşü `_dev/docs/DECISIONS.md`'ye düş (OVERVIEW ve ILKELER **Korumalı Doküman**'dır — taşıma onayı onları değiştirme onayı değildir; ayrıca bildir ve onay al).
- **Donmuş kayıtlar** → hiç dokunulmaz. Sınıfı örnekle değil **adıyla** al: tek evi `CLAUDE.md` → Doküman Kuralları → Tarihsel/append-only doküman kuralıdır (`tasks/archive/*`, `bulgular/archive/*`, PHASES'te ✅ `PHASE-N.md` ve bölme çocukları, `docs/DECISIONS.md`, `tasks/TASKS-README.md`). **`_dev/PRD/**` de versiyon ortasında donuktur** — orada isabet varsa çevirme, `/devflow:prd-note` öner. Ölçüm/kanıt taşıyan canlı kayıtlarda (BULGULAR girdisi, retrospektif ölçümü) yol o ölçümün parçasıdır: çevirme, dipnotla eski yolu koru.

**Onay gelmezse** taşıma yapılmaz: hâli raporda tek satırla an, parent'ı bulunduğu yerde güncelle **ve kararı kayda geçirmeyi öner** (bölme dalının ret kolu için dediğiyle aynı ölçü — `lib/claude-md-bolme.md`) — kaydın evi **parent'ın kendisidir**, tek satırlık `<!-- KURAL: parent .claude/CLAUDE.md'de kalır (bilinçli) -->`; `accept-size` DEĞİL (`lib/claude-md-bolme.md` → Hâl ayrımı: tanımı gereği yalnız boyut aşımını kabul eder). Kayıt düşmezse sıradaki `audit-docs` turu aynı kalemi bir kez daha açar. **Taşıma sonradan onaylanırsa bu KURAL kaydı SİLİNİR** (konusuz kaldı; `lib/claude-md-bolme.md` tarifinin (6). adımının yaptığının aynısı) — kök CLAUDE.md'ye taşınıp yanlış hâliyle yaşamasına izin verme.

**CLAUDE.md zaten mevcutsa:** Değişen bilgileri güncelle (yeni modüller, yeni projeye özgü kurallar, değişen faz bilgileri vb.). Mevcut özelleştirmeleri koru. Template'te olup dosyada eksik olan `<!-- KURAL: … -->` yorumlarını aktar; aktarım gerekçesiyle mevcut içeriği budama — budama audit'in rapor→onay işidir.

**Mevcut CLAUDE.md tam bölünmüş değilse** — hiç bölünmemiş proje (`_dev/claude/` yok) da, bölmesi yarıda kalmış proje (klasör var ama tarif bitmemiş) da bu dala düşer. Hâl ayrımı (hangi adımda kesildi) ve altı adımlık bölme tarifi **tek evdedir** ve burada tekrarlanmaz: `.claude/commands/devflow/lib/claude-md-bolme.md` — **Read ile oku ve izle**; yukarıdaki "Önce oku" template'leri o tarifin girdisidir. Bölmeyi **öner ve onay al**, sonra uygula — yapısal değişikliktir, sessizce yapılmaz. Emin olmadığın sapma varsa taşıma, kullanıcıya sor.

**CLAUDE.md yoksa:** Repo kökünde (`/CLAUDE.md`) parent'ı, `_dev/claude/` altında dört çocuğu oluştur. Template'i kullan ama projeye göre düzenle:

- Proje bilgilerini doldur
- Template'teki `<!-- KURAL: … -->` yorumlarını üretilen dosyalara olduğu gibi aktar (→ kickoff-docs: "KURAL yorumlarını koru")
- Dört doktrin çocuğunu `templates/claude/` altından `_dev/claude/` altına birebir kopyala (proje-özgü uyarlama gerekmiyorsa metin aynen kalır) — **tek istisna** `DOKUMAN-KURALLARI.md`'deki `[PROJEYE_ÖZGÜ_SABİT_DOKÜMANLAR]`: proje sabiti varsa doldur, yoksa satırı sil (aynı karar Protokol'ün sabit listesi ve INDEX aynasıyla hizalanır); ham placeholder bırakma ve parent'ın "Doktrin Dosyaları" bloğundaki `@` satırlarının bu dosyalara çözüldüğünü doğrula
- Projeye özgü sabit dokümanları "Oturum Başlangıç Protokolü"ne ekle — yalnız oradaki KURAL kriterini karşılayanları (görevden bağımsız, gerçekten her oturum yön veren); göreve-göre olanlar INDEX senaryolarında kalır. INDEX'teki "Projeye Özgü Sabitler" aynasını aynı karara göre hizala
- Dokunulmazları belirle (config dosyaları, migration'lar vb.)
- Projeye özgü kuralları yaz (framework kuralları, convention'lar vb.)
- Commit convention'ı projeye uyarla

**Kritik:** Yeni kurulumda CLAUDE.md repo kökünde oluşturulur, `_dev/` içinde değil (mevcut projede parent `.claude/CLAUDE.md`'de kalmışsa Adım 3'ün ret kolu geçerlidir). Doktrin çocukları ise **`_dev/claude/` altında** olmalı — repo köküne ya da `.claude/` altına konursa audit canvas'ı onları hiç görmez (yalnız kök `CLAUDE.md` + `_dev/**` izlenir) ve doktrin sessizce denetim dışına düşer.

### Adım 4: Son Güncellemeler

- INDEX.md'ye CLAUDE.md'yi **gerçek yoluyla** ekle: kökteyse repo kökünde olduğunu belirt; Adım 3'te taşıma reddedildiyse `.claude/CLAUDE.md` yazılır ve ret kararı tek satırla anılır — INDEX'in ağacı ile giriş notu **aynı yolu** söylemeli; INDEX'te duran doğru yolun üstüne yazma. Doküman Hiyerarşisi ağacına `claude/` çocuklarını **yalnız `_dev/claude/` gerçekten diskteyse ve kayıt henüz yoksa** yaz (bölme bu turda uygulandıysa kaydı `lib/claude-md-bolme.md` tarifinin (5). adımı zaten düşmüştür) — Adım 3'te bölme ertelendiyse ya da reddedildiyse bu satırları **yazma**: Adım 1'in kendi kontrolü ("INDEX.md'de listelenen tüm dokümanlar gerçekten mevcut mu?") bir sonraki turda onları eksik doküman olarak açar, ve INDEX erteleme kaydıyla çelişerek bölmenin yapıldığını söyler. (Yazıldığı hâlde de okuma listelerine EKLEME — import edildikleri için zaten bağlamdalar; INDEX KURAL 4)
- DURUM.md'yi güncelle — **Aktif Faz:** girilecek sıradaki faz = **Faz Durumu tablosundaki en büyük faz no + 1** (tablo boşsa 1); adı Sıradaki Fazlar listesinin ilk maddesinden alınır (geçici — discuss-phase kesinleştirir), **Adım:** discuss. İlk kickoff'ta bu Phase 1'dir; re-kickoff'ta global sayaç devam eder (versiyon değişse de sıfırlanmaz). "Phase 1" varsayma — max+1 ile hesapla ([PHASES.md → Faz Numaralandırma Kuralı](templates/PHASES.md)).

**Not:** Faz dokümanı (PHASE-1.md) bu oturumda oluşturulmaz — discuss-phase oturumunda oluşturulacak.

### Adım 5: Native Memory Yönlendirmesi (Harness Entegrasyonu)

DevFlow proje hafızasını repo içinde (`_dev/memory/`) tutar; Claude'un native (yerleşik) memory'si proje bilgisi için kullanılmaz (CLAUDE.md → Native memory yönlendirmesi). Bunu kalıcı kılmak için projenin native memory index'ine — `~/.claude/projects/<bu-proje>/memory/MEMORY.md`, yani harness'ın sana bu oturumda bildirdiği native memory konumu — bir yönlendirme yazılır. Bu adım ilk kickoff'ta yönlendirmeyi kurar, re-kickoff'ta bozulmuşsa geri getirir.

**Değişmez kural (önce taşı, sonra yaz):** Native MEMORY.md'de yönlendirme template'i DIŞINDA herhangi bir içerik (eski native öğrenimler, sızmış proje bilgisi) varsa, o içerik ÖNCE `_dev/memory/`'ye taşınır (her biri `_dev/memory/<slug>.md` + `_dev/MEMORY.md` index pointer'ı). **Taşımadan asla üzerine yazma.**

Sırayla:
1. Native memory index'ini (MEMORY.md) oku.
2. Yönlendirme dışında içerik varsa → `_dev/memory/`'ye taşı (yukarıdaki kural).
3. `.claude/commands/devflow/templates/NATIVE-MEMORY-REDIRECT.md` içeriğini native MEMORY.md'ye **yaz** (dosyanın tüm içeriği bu olur; zaten birebir doğruysa dokunma).
4. Taşıdığın bilgi varsa kontrol raporunda belirt.

> Bu, DevFlow'un repo DIŞINA yazdığı **tek** şeydir; bilinçli bir harness entegrasyonudur. Native memory proje-bazlıdır (`~/.claude/projects/<bu-proje>/`), içeriği yalnızca bu projeye aittir — `_dev/`'ye taşımak doğru hedeftir. Harness native memory konumunu bildirmiyorsa bu adımı atla ve raporda not düş.

### Adım 6: Git Commit & Push

Tüm doküman değişikliklerini ve CLAUDE.md'yi commit & push yap:
```
docs: kickoff-verify — verification complete, CLAUDE.md created
```

### Adım 7: Kontrol Raporu ve Sıradaki Adım

Kullanıcıya kontrol sonuçlarını sun:

```
📋 Kickoff Kontrol Raporu:
✅ Doküman tutarlılığı: X doküman kontrol edildi
✅ Bilgi bütünlüğü: Eksik/tutarsızlık yok (veya düzeltildi)
✅ Git stratejisi: [tek dal / çalışma+yayın ayrımı] — GIT-STRATEJI.md
✅ CLAUDE.md: oluşturuldu (parent + 4 doktrin çocuğu) | bölündü (gövdeler _dev/claude/ çocuklarına taşındı) | zaten bölünmüştü — güncellendi | bölme önerildi, ertelendi/reddedildi (`_dev/claude/` yoksa hiç bölünmemiş, varsa yarım-bölünmüş — hangisi olduğunu yaz; parent `.claude/` altında kaldıysa onu da an; kayıt önerildi)
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
```

---

## Önemli Kurallar

- Bu oturumda task çalıştırma — sadece kontrol ve doküman tamamlama
- Placeholder bırakma — her şey doldurulmuş olmalı
- CLAUDE.md repo kökünde olmalı — istisnası Adım 3'ün ret koludur
- Faz dokümanı bu oturumda oluşturulmaz — discuss-phase'de oluşturulacak
- Kontrol sonuçlarını kullanıcıya raporla
