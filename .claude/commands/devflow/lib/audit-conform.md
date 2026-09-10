# DevFlow — Audit Section 2: Uygunluk & Migration (audit-conform)

> **Bu dosya doğrudan çağrılmaz.** `audit-docs`'un Section 2'sidir. `audit-docs`, `next` çıktısındaki gerekçe `conformance:*` veya `rotation:*` olduğunda bu dosyayı **Read ile okur** (tur başına bir kez) ve aşağıdaki akışı izler. Ayrı dosyadır çünkü `audit-docs` ile birleştirilseler ikisi de tek Read çağrısına sığmazdı (kanon: CLAUDE.md → Boyut ve Bölünme); yan faydası, derin denetim talimatının yalnızca gerçekten gerektiğinde okunmasıdır.
>
> **Keşif ajanı olarak okuyorsan** (çok dokümanlı tur — `audit-docs` Adım 3): buradaki teşhis akışı sana aittir, **karar akışı değil**. Salt-okunursun: dosya düzenlemez, `audit-canvas.py`'nin durum değiştiren komutlarını (`touch`/`scan`/`reconcile`/`invalidate`/`exclude`/`include`/`accept-size`/`unaccept-size`) çalıştırmaz, kullanıcıya soru sormazsın. Çıktın kalemlerin **konumu ve dayanağıdır** (`dosya:satır` + çapa) — düzeltmenin metni değil; belirsizliği soru olarak yazarsın.

Bu, tek dokümana yönelik **derin per-doküman** denetimidir: dokümanın GÜNCEL template'e/konvansiyona yapısal uygunluğu + yargı gerektiren drift'in temizlenmesi. **Drift ile migration aynı kontroldür** — "bu doküman bugünkü yapıya uyuyor mu?"; rapor nedeni ayırır (bayatlama mı, konvansiyon evrimi mi). Her zaman **rapor → onay → düzelt**; auto-fix yok.

## Buraya ne zaman gelinir

- `conformance:never` — doküman hiç denetlenmemiş (yeni eklendi)
- `conformance:version-outdated` — konvansiyon versiyonu artmış, doküman eski versiyonda denetlenmiş (migration)
- `conformance:changed` — son denetimden bu yana doküman içeriği değişmiş
- `rotation:oldest` (`--rotate`) — uygun ama en uzun süredir denetlenmemiş; proaktif rotasyon

---

## Akış (doküman başına — pakette her doküman için ayrı ayrı)

### Adım 0 — Mekanik kontroller (S1 listesi)

Dokümanı okumadan önce `bash .claude/commands/devflow/scripts/doc-scan.sh <dosya>` çalıştır — **sahibi bu dosyayı kim okuyorsa odur:** keşif ajanıysan yalnız kendi dokümanın için, tek elden yürütüyorsan paketin tamamı için tek çağrı yeter. Boyut profili teşhise girdi olur; özellikle **6k-20k konfor bandı** canvas'ın boyut taramasında görünmez, yalnız burada görünür (Adım 3b yoğunluk yargısında kullan).

**Mekanik kontrol listesini bu doküman üzerinde de uygula** — `.claude/commands/devflow/lib/audit-mekanik.md`'yi Read ile oku (tur başına bir kez; S1 kulvarı da aynı dosyayı okur, tek kaynaktır). Ucuz — dokümanı zaten okuyorsun. Bulguları raporun 🔧 mekanik kulvarına kat (Adım 6). **Tek istisna listenin boyut maddesidir:** onun öncülü ("script'in bu dokümanı urgent yapma nedeni") burada geçerli değil — bu doküman `conformance:*` ile geldi, `urgent` ile değil. Boyut profili S2'de bir kalem değil, yukarıdaki `doc-scan` çıktısıyla birlikte **Adım 3b'nin yoğunluk yargısına girdidir**; kabul/erteleme kararı da orada verilir.

### Adım 1 — Dokümanı + ilgili template'i oku

Dokümanı rolüne göre `.claude/commands/devflow/templates/` altındaki template'le eşle ve **referans** olarak oku. Bu okuma **koşulsuzdur** — şüphe/bayrak beklenmez; lazy kural yalnızca *eşleşmeyen* template'lerin okunmamasıdır (audit-docs → Önemli Kurallar):

- `CLAUDE.md` → `CLAUDE-MD.md` · `claude/<AD>.md` → `claude/<AD>.md` · `OVERVIEW.md` → `OVERVIEW.md` · `DURUM.md` → `DURUM.md` · `INDEX.md` → `INDEX.md` · `GIT-STRATEJI.md` → `GIT-STRATEJI.md`
- `MODULE-MAP.md` → `MODULE-MAP.md` · `PHASES.md` → `PHASES.md` · `QUALITY.md` → `QUALITY.md` · `ILKELER.md` → `ILKELER.md` · `MEMORY.md` → `MEMORY.md` · `BULGULAR.md` → `BULGULAR.md`
- `modules/*.md` → `MODULE.md` · `phases/PHASE-N.md` → `PHASE.md`
- `tasks/TASK-*.md` → `TASK.md` · `tasks/TASKS-README.md` → `TASKS-README.md` · `docs/DECISIONS.md` → `DECISIONS.md` · `PRD/features/*.md` → `PRD-FEATURE.md`

**1:1 template'i olmayanlar** — `memory/<slug>.md` atomları · `bulgular/B-*.md` bulgu atomları (format kanonu `templates/BULGULAR.md` → "Bulgu Sistemi") · `PRD/{VERSIONS,SESSION-NOTES,NOTES}.md` üst-düzey PRD dokümanları · `tasks/quick/*.md` ad-hoc kayıtları · projeye-özgü sabit dokümanlar · **bölme çocukları** (`←` geri-linkiyle **kanıtlanmış** olanlar: `phases/PHASE-23-RETROSPEKTIF.md`, `modules/M1-AUTH-FLOWS.md`; ad deseni yalnız adaydır, ölçütün tek evi: `lib/audit-mekanik.md` → "Kırık dosya referansı"). Bunlarda uygunluk = **rolün kuralları + dokümanın kendi `<!-- KURAL -->` yorumları**.

Bölme çocuğunda buna iki kalem eklenir (kanon: CLAUDE.md → Boyut ve Bölünme): `← <parent> · <tip>` geri-linki duruyor mu, parent'ın pointer listesinde kaydı var mı.

`_dev/claude/*.md` doktrin çocuklarında bu iki kalem aynen geçerlidir, yalnız pointer listesi başka: parent'ın **"Doktrin Dosyaları" bloğu**, kayıt ise bir `@` import satırı. Satır eksikse ya da backtick içine alınmışsa **hüküm vermeden önce parent'ın hâline bak** (aynı ayrım: Adım 2 → Doktrin Dosyaları istisnası). Dört çocuk da diskteyse ve parent'ta özet + `**Tam metin → …**` pointer'ı duruyorsa doktrin gerçekten hiçbir oturumda bağlama girmiyordur — **mekanik kalem, en yüksek öncelik**. Çocuklardan biri eksikse ya da parent'ta hâlâ **gövdeler** duruyorsa öncül tersine döner (gövde parent'tayken doktrin zaten bağlamdadır) ve kalem **❓ yapısaldır**; `@` satırı tek başına yazılmaz. Doktrin çocuğu ayrıca kendi template'iyle karşılaştırılır (aşağıdaki istisna); parent'ı tarihselse çocuğu da tarihseldir (Adım 5).

**Üçüncü kalem — parent özeti ↔ çocuk tam metni, iki yönlü.** Doktrin çocuğu denetlenirken parent'ın ilgili **özet(ler)i** de okunur — bir çocuk birden çok parent bölümüne dağılabilir (o çocuğa işaret eden **her** `**Tam metin → …**` satırının bölümü); parent zaten bağlamdadır, ek maliyet yok:

1. Özete alınmış bir sabit çocuktakiyle **çelişiyor mu** — ya da özet, çocuktaki **adlandırılmış bir ilkeyi hiç taşımayarak** self-yeterliğini yitirmiş mi? (Kanon: çocukta genişleyen ayrıntı listeleri özete kopyalanmaz ve ölçü tam-sayım değildir; ama tam-sayımdan muaf olan **listelerin satırlarıdır**, ilkenin kendisi değil — düşen ilke eksikliktir, sıkıştırma değil. Özette kalanlar çocukla **birlikte** güncellenir.)
2. **Çapalanan adlar parent'ta ve doğru seviyede yaşıyor mu?** Korunması gereken küme başlıklar değil, motorun `CLAUDE.md → <ad>` diye **çapa attığı** adlardır; liste mekanik çıkarılır:
   ```bash
   grep -rh 'CLAUDE\.md' .claude/commands/devflow/ | sed 's/[*`]//g' \
     | grep -ohE 'CLAUDE\.md ?(→|:)? ?"[^"]+"|CLAUDE\.md → [^)|;·]+' \
     | sed -E 's/^CLAUDE\.md ?[→:]? ?/CLAUDE\.md → /' \
     | sed -E 's/\.[[:space:]].*$//; s/\.$//; s/[[:space:]]*$//' | sort -u
   ```
   **Markup her iki süzgeçten de önce silinir.** `*` ve backtick adın *parçasıdır*, sonlandırıcısı değil: markup'lı bir yakalama `→ *"…"*` biçimindeki derin çapayı ya ortadan keser ya adını tümüyle düşürür — ve düşen ad denetçiye görünmez, yani **sessiz yanlış-negatif** olur (kontrol edilecek ad listede yoksa çözülmüş sayılır). Bu yüzden **ön süzgeç de dar yazılmaz**: oku arayan bir ön süzgeç, dosya adının kapanış backtick'i ile okun arasına düştüğü çapaları (bugün `templates/GIT-STRATEJI.md`'de var) hiç göstermez — `sed` sırası gelmeden satır düşmüş olur.
   **Ayırıcı da tek biçimli değildir.** Ok'un yanı sıra **iki nokta + tırnak** biçimi de kullanılır ve bugün **18 komut dosyasının Adım 0 kapısı** odur — yani motorun en çok çapalanan adı, yalnız ok arayan bir yakalamada listeye hiç girmez. Boru hattı iki biçimi de alır ve tek biçime normalize eder; tırnaklı dalın sonlandırıcısı kapanış tırnağıdır.
   **Sonlandırıcı ölçütü yapısaldır, noktalama değil:** karakter sınıfı yalnız yapısal ayırıcıları keser (`)` `|` `;` `·`); adın içinde geçebilen noktalama sınıfa girmez — virgül `→ Boyut ve Bölünme, *"…"*` biçimindeki derin çapayı bölüm adında durdurup alıntılanan sabiti düşürür, nokta ise ancak cümle sonunda keser çünkü adın içinde geçebilir (`"Kök CLAUDE.md doktrin parent'ıdır"`). Çıktı üç gürültü sınıfı taşır, üçü de atlanır: cümle kuyrukları · Adım 1'in eşleme tablosundan sızan `→ <DOSYA>.md` satırları (çapa değil, template eşlemesi) · **yer-tutucu başlı yakalamalar** (`→ <ad> …`, `→ <bölüm> …`) — bunlar motorun çapa konvansiyonunu *anlatan* cümlelerdir, çapanın kendisi değil. **Gürültü elenebilir, kayıp elenemez.**
   **Karşılaştırmanın parent tarafında normalizasyon uygulanır:** adı parent'ta ararken `*`, backtick **ve çift tırnak** yok sayılır, ayrıca **Türkçe aksan katlaması iki tarafa birden** uygulanır — `sed 'y/ıİşŞğĞüÜöÖçÇ/iIsSgGuUoOcC/'` (`İ`→`I` eşlemesi kritiktir; atlanırsa en çok çapalanan ad kaçar). Böylece `**Kök \`CLAUDE.md\` doktrin parent'ıdır**` ≡ düz yazımı, `"Gördüğün sorunu düşürme"` ≡ tırnaksızı, `## Dokuman Kurallari` ≡ aksanlı yazımı. Tırnak **yakalamanın sonlandırıcısıdır**, adın parçası değil: kaynak tarafındaki markup ön süzgecine EKLENMEZ — eklenirse yakalamanın tırnaklı dalı hiçbir şey yakalamaz ve motorun en çok çapalanan adı listeden düşer; yalnız karşılaştırma anında yok sayılır. **Bileşik çapa tek ad değildir:** ayırıcı ne olursa olsun (ok · virgül · eğik çizgi) bileşenlerine ayrılır ve her biri ayrı aranır — tam dizeyi aramak her zaman "düşmüş" verir. Tek yanlı silme duran bir çapayı "düşmüş" gösterir, ve kalem 🔧 olduğu için toplu onayla Tier-1 doktrin parent'ına gereksiz yazma yapılır. Parent'ın backtick'ini/aksanını silerek ya da parent'a tırnaklı bir ikiz başlık yazarak çözme — backtick'li biçim motorda konvansiyondur (`templates/claude/DOKUMAN-DISIPLINI.md` ve `lib/audit-mekanik.md` aynı adı aynı biçimde taşır), aksan ise dokümanın kendi yazım tercihidir ve tek tek adlarla değil tek soruyla ele alınır (Adım 2).
   Seviye ayrımı önemlidir, karıştırılırsa yanlış-pozitif üretir: çocuğun `##` bölüm adı parent'ta **aynı adlı `##` başlık** olarak yaşar (kalın etiket aranmaz); çocuğun `###` alt-bölüm adları **ve çapası olan adlandırılmış ilkeler** o başlığın altındaki özetin içinde **kalın etiket** olarak yaşar. İkincisi başlık olmak zorunda değildir — `Gördüğün sorunu düşürme` bir `###` değil, `CALISMA-PRENSIPLERI.md`'nin 12 numaralı prensibidir ve motorda beş çapası vardır. Harness block-level HTML yorumlarını bağlama hiç sokmadığı için adı yalnız bir yoruma bırakmak da eksik sayılır (kanon: Boyut ve Bölünme → kök `CLAUDE.md` maddesi).

İkisi de ad/değer karşılaştırması olduğu için kalem 🔧 mekaniktir — **tek istisna, dokümanın BÜTÜN başlıklarının yalnız aksanla ayrılmasıdır**: o bir doküman eksiği değil kodlama tercihidir, kalem 🔧 değil **❓'dir** ve tek soruyla sorulur ("proje kopyası ASCII-katlanmış; aksanlı biçime çevirelim mi?").

Yanlış template'le karşılaştırma kuralı: **bölme-çocuğu tespiti eşleme tablosundan önce gelir** — yukarıdaki glob'lar (`modules/*.md`, `tasks/TASK-*.md`, `PRD/features/*.md` …) yalnız *parent* dokümanları içindir, çocuk tanım gereği kısmi olduğu için template'le karşılaştırılmaz. **Bunun tek istisnası `_dev/claude/*.md` doktrin çocuklarıdır:** onlar da `←` geri-linkli birer bölme çocuğudur, ama kesimleri projede değil **motorda** yapıldığı için her birinin kendi 1:1 template'i vardır (`templates/claude/<aynı-ad>.md`) — normal yapı/KURAL karşılaştırmasına girerler. Ayırt edici: eşleme tablosunda **adı geçen** bir çocuk template'le karşılaştırılır; geçmeyen çocuk karşılaştırılmaz. Ad deseni tutuyor ama `←` yoksa doküman **çocuk sayılmaz**: `lib/audit-mekanik.md` → "Kırık dosya referansı" → "Çocukta `←` yoksa mekanik kalem üretme" gereği ❓ soru açılır, **cevaplanana dek** parent'ın template'iyle karşılaştırma; cevap "bağımsız" ise doküman kendi glob template'iyle normal denetlenir. Çocuk değilse ve pattern listede yoksa bu maddeye düşer; başka template'i zorla uygulama.

### Adım 2 — Yapı/KURAL conformance

Dokümanı template'le karşılaştır:

- **Template'de olup canlıda olmayan bölüm/KURAL var mı?** → ekle (**merge-preserve**: mevcut içeriği silmeden, doğru yere). Örn. CLAUDE.md'de `## Dil` bölümü yoksa template'ten ekle. Silinmiş `<!-- KURAL -->` yorumunu geri koy (KURAL = tek kaynak, korunur). Eklenen/geri konan KURAL'ı **aynı turda** dokümanın mevcut içeriğine karşı da değerlendir — ihlal varsa aynı raporda bildir (`touch` sonrası kör nokta kalmasın).
  - **İstisna — `## Doktrin Dosyaları` ve doktrin özetleri.** Kök `CLAUDE.md`'de bu blok eksikse ya da doktrin bölümlerinde gövde↔özet farkı varsa kalem merge-preserve ile kapatılmaz: **önce `_dev/claude/` klasörüne bak** — teşhisi belirleyen odur (aynı koşul: `lib/audit-mekanik.md` → Kırık dosya referansı). Üç hâl vardır — **bölünmemiş** (`_dev/claude/` yok), **yarım-bölünmüş** (klasör var, tarif bitmemiş) ve **üçüncü hâl** (bölünmemiş projede bir doktrin bölümü, ya da çocuk template'indeki bir `###` alt-başlığı / çapası olan adlandırılmış ilkesi canlıda hiç yok) — ve **ayrımı, erteleme kaydının evi, `@` satırı yazma yasağı ve altı adımlık bölme tarifi tek evdedir:** `.claude/commands/devflow/lib/claude-md-bolme.md` — **Read ile oku ve izle**; burada tekrarlanmaz. Onay gelirse bölme **bu turda** uygulanır (`audit-docs` Adım 5).
- **Canlıda olup template'de olmayan bölüm var mı?** → drift mi, bilinçli proje-özgü ekleme mi belirsiz → **soru olarak raporla**, varsayımla silme.
- **Yapısal kuralın kaynağı dokümanın kendi KURAL yorumudur** — audit literal'i yeniden yazmaz; KURAL'ı ground-truth alır, ona karşı kontrol eder.

### Adım 3 — Yargı-drift kategorileri

Dokümanı fresh-read zihniyetiyle oku. Herhangi bir kategoride bir iddianın hâlâ doğru olduğundan emin değilsen **gerçekle sına**: koda salt-okunur bak (Read/grep) — kod değiştirilmez, kod kalitesi yargılanmaz (kapsam kuralı: audit-docs → Önemli Kurallar). Rolüne uyan kategorileri tara:

- **a) Bayat-tarih bilgisi** — tarih yazılı bir bilgi hâlâ geçerli mi (tarih, koruma gerekçesi değil)? DURUM'da eski faz/task hâlâ "Aktif" mi? Memory'de sonradan yanlış çıkmış öğrenim var mı?
- **b) Yoğunluk / bölme yargısı** — boyut bayraklıysa eleştirel oku ve üçlü teşhisi uygula (kanon: CLAUDE.md → Boyut ve Bölünme): snapshot/index doküman uzunsa **şişme** (temizle/mezun et) ya da **meşru birikim** (kendi supabına mezuniyet/arşiv öner; uygulanamıyorsa bilinçli-geçici kabul raporla); içerik dokümanı gerçekten büyümüşse **modüler bölme** (yapısal → soru: hangi alt-dokümanlar/isimler; zincirin kanalları CLAUDE.md → Boyut ve Bölünme'de). Tek satır gerçekten tek mantıksal birim mi, yoksa 3+ düşünce sıkışmış mı?
  **Önce kabul kaydına bak:** boyut bayrağını yargılamadan `status` çıktısının `accepted` listesini kontrol et — doküman orada geçiyorsa bölme/küçültme sorusu **zaten sorulmuş ve kullanıcı ertelemiştir**; yeniden açma, raporda tek satır olarak an (`= <yol> — <gerekçe>`). Kabul, dokümanı küçültmediği için `doc-scan` bayrağı yine yanar; bayrak burada teşhis girdisidir, soru tetiği değil. **Kök `CLAUDE.md` bu üçünün de dışındadır** — doktrin parent'ıdır; bölme yolu `_dev/claude/` çocukları + `@import`'tur, kesim motorda sabittir ve **ad önerilmez** (rota: Adım 2 → Doktrin Dosyaları istisnası → `lib/claude-md-bolme.md`). Karar bu turda yeniden ertelenir/reddedilirse kaydı tazele (`accept-size`; giriş koşulu ve `exclude` ayrımı: `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi).
- **c) Yanlış-ev bilgisi** — Memory'de task-icrasına özgü teknik nüans (araç davranışı, framework bug'ı) → PHASE-N retrospektifine ait. DURUM'a KURAL'ının yasakladığı ek bölüm (örn. "Son Tamamlanan Faz") eklenmiş mi → PHASES/PHASE-N'e ait. PHASES'te faz detayı/retro özeti → PHASE-N'e ait. DECISIONS'da karar olmayan oturum notu → kullanıcıya bildir (DECISIONS'a dokunma; düzeltme `review-phase` işi).
- **d) Mezuniyet tetiklenmemiş** — Faz ✅ Tamamlandı halde DURUM'da eski faz task tablosu/özeti duruyor mu? PHASES → Sıradaki Fazlar'da Faz Durumu tablosuna girmiş (numara almış) konu hâlâ duruyor mu (girişte silinmeliydi)? SESSION-NOTES'ta "X'e aktarıldı / ✓ tamamlandı / şuraya taşındı" breadcrumb'ı kalmış mı (izsiz mezuniyet ihlali — bilgi silinince iz de silinmeli)? Hedef: SESSION-NOTES boş/yakın-boş kanvas. PRD/NOTES'ta prd-review'da işlenmiş ama silinmemiş not?
- **e) Memory dedup / atomizasyon migrasyonu** — MEMORY.md hâlâ **monolitik** mi (öğrenim doğrudan index'te, `memory/<slug>.md`'ye atomize edilmemiş)? → eski sürümden kalma, **migrasyon** (yapısal → soru). Aynı öğrenim birden çok memory dosyasında tekrar ediyor mu → dedup, tek dosyada topla. (Pointer kırık/yetim = Adım 0 mekanik.)
- **f) Statik doküman gerçeklik mutabakatı** — OVERVIEW ve projeye-özgü sabitler **bugünü** anlatır, her oturum dokunulmadığı için sessizce gerçeklikten kopar: stack/pratik değişti mi (gerçeklik = kod + bağlamdaki çekirdek dokümanlar; **çapraz çelişki** örn. OVERVIEW "SQLite" derken kod PostgreSQL)? OVERVIEW'da **dinamik bilgi kaçağı** (aktif faz/task, ilerleme, durum) var mı → DURUM'a ait, temizle. Bulguyu raporla, **açık onayla** reconcile et. **ILKELER bu maddenin dışındadır:** değer/yön-temellidir — içerik bayatlaması gerçeklik-mutabakatıyla değil prd-review'da deneyimle ele alınır (CLAUDE.md → Doküman Kuralları → Bayatlama notu); diğer denetimler (Adım 0-2 yapı/mekanik + rolüne uyan öbür kategoriler) ILKELER'de aynen sürer.

### Adım 4 — Migration (eski → yeni eşle)

Konvansiyon evrildiyse (`version-outdated`): eski yapıyı yeniye **eşle ve taşı**. Eşi/evi olmayan içeriği **RAPORLA, sessizce atma** — git geçmişi backstop'tur ama kasıtlı kayıp olmamalı. Yeni dosya/bölme yaratan migration sonrası `reconcile` ile çocukları kuyruğa al.

### Adım 5 — Tarihsel doküman ise

Doküman tarihsel/sistem dokümanıysa (`tasks/archive/*`, `bulgular/archive/*`, PHASES'te ✅ işaretli `PHASE-N.md` (+ bölme çocukları), `docs/DECISIONS.md`, `tasks/TASKS-README.md`):

- Yalnızca **içerik-koruyan reformat** yapılır (yeni yapıya hizalama); anlam, kayıt ve sıra korunur. Raporda **"tarihsel reformat"** olarak işaretle.
- **DECISIONS.md**: kayıt sırası korunur (append-only mantığı); yeni karar ekleme/`Superseded` işaretleme audit'in işi değildir (`review-phase`/`prd-review`). **Boyut:** DECISIONS hiçbir zaman ✅ ile faz-dondurulmaz, dolayısıyla bölme yasağının kapsamı dışındadır. Kırmızı çizgi vakası buraya değil **S1'e** dispatch edilir (`urgent:token-hard`, öncelik 0) — kural, kulvar ve kesim ölçüsü tek evde: `audit-docs` → Önemli Kurallar → Tarihsel/sistem dokümanları.
- **TASKS-README.md**: çekirdek protokol kopyasıdır; yeni protokole hizalayan **protokol-migration meşrudur** (içerik-koruyan).
- Bunların dışında düzenleme yok — yanlış bilgi görürsen yalnızca raporla.

### Adım 6 — Raporla → onay → düzelt → kapat

Bulgularını `audit-docs` → **"Paket raporu & onay"** adımının iskeletine ve format kurallarına göre yaz — rapor iskeleti tek yerde tanımlıdır, burada tekrarlanmaz. Bu dokümana özgü iki not:

- Migration turunda `<Dk>` satırının gerekçesi nedeni de söyler: `conformance:version-outdated → migration`.
- Tarihsel/sistem dokümanında (Adım 5) yalnız **içerik-koruyan reformat / protokol-migration** kalemi 🔧 kulvarına girer (`tarihsel reformat` etiketiyle); içerik hatası ve bayat bilgi `📁 Tarihsel` slotunda **yalnız-rapordur**. Faz-dondurulmamış tarihsel dokümanın (DECISIONS) boyut bölmesi ❓ kulvarına girer (Adım 5 → Boyut).

Onay sonrası **yalnızca onaylananı** uygula; yapısal işlerde (bölme, atomizasyon, migration) referans bütünlüğünü koru — zincirin kanalları tek evde: CLAUDE.md → Boyut ve Bölünme. Sonra:

```bash
python3 .claude/commands/devflow/scripts/audit-canvas.py touch <path>   # "tam denetlendi": conformant, v=current, hash güncel
python3 .claude/commands/devflow/scripts/audit-canvas.py reconcile      # migration/bölme yeni dosya yarattıysa
python3 .claude/commands/devflow/scripts/audit-canvas.py scan           # bölme/küçültme uygulandıysa: çözülen urgent'i ve konusuz kalan boyut kabulünü temizle
```

`touch` **yalnızca burada** atılır (tam uygunluk denetimi tamamlandığında; cevapsız sorusu kalan dokümana atılmaz). Sonra `audit-docs` → **"Git Commit & Push"** adımına dön: doküman kendi izole commit'ini alır, paketteki sıradaki dokümana geçilir, tur bitince tek push.

---

## Önemli

- **Rapor → onay → düzelt; auto-fix yok; varsayma → sor.** Kafanın karıştığı her şey ❓ Karar kalemi olur; dayanağı `Proje-özgü` olan kalem de zaten mekanik kulvara giremez (format kuralı 3).
- **Yapısal işler yalnızca açık onayla** (modüler bölme, MEMORY atomizasyonu, migration); uygularken referans bütünlüğünü koru.
- **Tarihsel dokümanlar:** içerik-koruyan reformat dışında dokunma.
- **`touch` yalnızca S2'de** — S1 (acil) `touch` atmaz; doküman tam denetlenince conformant işaretlenir.
- **Çapraz çelişki** için Oturum Başlangıç Protokolü'nde okunan çekirdek dokümanları (OVERVIEW/DURUM/MEMORY/INDEX) referans al. **Hata karşı taraftaysa** kalem `🔗 Kapsam Dışı Borç`a girer — kural ve sınırlar: `audit-docs` → Önemli Kurallar → Çapraz bulgu.
