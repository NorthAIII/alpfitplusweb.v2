# DevFlow — Doküman Denetimi (Audit Docs)

Bu komut proje-genişlikli doküman drift'ini **artımlı (rolling)** olarak tarar ve düzeltir. Faz döngüsü boyunca yaşayan dokümanlarda kümülatif biriken sorunları (şişme, sıkıştırma, soft-delete kalıntısı, yanlış-ev bilgisi, tetiklenmemiş mezuniyet, statik bayatlama) ve DevFlow konvansiyonu evrildiğinde dokümanların eski yapıda kalmasını (migration) yakalar. **Drift ile migration tek ve aynı kontroldür** — "bu doküman GÜNCEL template'e/konvansiyona uyuyor mu?"; sadece tetikleyici farklıdır.

Tamamen manuel — kullanıcı tetikler. Düzeltmelerin kulvarını **CLAUDE.md → Onay Ölçütü** belirler: doğru cevabı kanon/template'in yazdığı **kap işlemleri sorulmadan uygulanır ve raporlanır**; niyet ya da yazarlık gerektiren **içerik işlemleri onaya bağlıdır**. Tek seferde tüm projeyi taramaz: bir **canvas** (kontrol kuyruğu) sıradaki dokümanları seçer, sen onları işlersin — çalıştırma başına bir **paket** (varsayılan 3 doküman; kuyrukta daha az varsa o kadar).

**Kulvarın tabanı — kanon henüz göç etmemişse.** Kurulum motoru günceller, projenin CLAUDE.md'sini değil; arada kalan pencerede motor "sorulmadan uygulanır" derken projenin canlı kanonu hâlâ "her şey onaya bağlı" diyor olabilir. Ölçüt: turun **bağlamdaki kanonunda** (parent + `@import`'lu doktrin çocukları, ikisi birden) `Onay Ölçütü` **yoksa** — ya da yerini eski bir cümle tutuyorsa (tarihsel reformat için *"açık onayla uygulanır"*, Korumalı sınıf için koşulsuz *"değiştirmeden önce … onay al"*) — hakem **yukarıdaki cümledir**.

Kullanıcıya **sorulmaz**: çatışan metin kullanıcının beyan ettiği bir kural değil, motorun kendi eski kopyasıdır. (Beyanlı bir **proje** kuralıyla çatışma ayrı hâldir ve hakemi kullanıcıdır — `run-task` Adım 8.) Ölçütün **dört koşulu** taban turunda da geçerlidir ve kaynağı motorun kendi template'idir (`templates/CLAUDE-MD.md` → Onay Ölçütü) — proje kanonu taşımıyor diye koşullar düşmez, yalnız evleri değişir.

**Kapsam — iki yarısı ayrı genişlikte, karıştırma.** *Hüküm* geneldir: `Onay Ölçütü`'ne yaslanan **hangi komut olursa olsun**, kanonu o ölçütü henüz taşımayan bir projede motorun kendi metni hakemdir (faz döngüsünün boyut kapısı — `lib/boyut-kapisi.md` — ve `double-check` dahil; onlar da aynı pencerede koşuyor). *Eylem* audit'e özgüdür: "parent paketin ilk kalemi" yalnız bu turun cümlesidir, çünkü paketi olan tur budur. Ölçütün **alt-maddelerine** atan işaretçiler (`Kaydın evi` · `tetik gösterilebilir` · `Bildirim onayın yerine geçer…`) bu tabanla ikame **edilmez** — onların kaynağı da motorun kendi template'idir, adres orada çözülür.

Taban turunda parent CLAUDE.md **paketin ilk kalemi yapılır** — ama bunu kuyruk garanti etmez, sen yaparsın. `next` yalnız *kendi (öncelik, tier) grubunun* içinde parent'ı öne alır; `urgent` satırı taşıyan bir doküman (öncelik 0) hâlâ önündedir ve bu doğrudur — o kulvarın işi mekanik/boyuttur, dokümanı parent'ın kanonuna göre uygunlamaz. Parent pakete girmediyse **iki hâl vardır ve ikisinin rotası ayrıdır:** kuyrukta *var* ama pencereye girmediyse pencereyi genişlet (`next --limit`, Adım 2); kuyrukta *yoksa* (geçen tur `conformant` damgalanmıştır) çapraz-bulgunun (b) kolu geçerlidir — `lib/audit-kurallar.md` → Çapraz bulgu, `invalidate` ile kuyruğa al. Koşul göçle **kendiliğinden düşer** (ölçüt adın kendisidir, aşağıda → Adım 1), kalıcı istisna doğurmaz; göç reddedilirse kayıt evi hedefteki `<!-- KURAL: … (bilinçli) -->` yorumudur.

**Kullanım:** `/devflow:audit-docs [tur talimatı]` — talimat serbest metindir ve **o turla sınırlıdır**: paket boyutu ("5 doküman"), rotasyon isteği ("değişmeyenlere de bak"), odak notu. Boşsa varsayılan paketi işler, sonra durur. Sürekli işlemek için `/loop` ile çağır — **soru çıkmayan tur kullanıcı beklemeden kapanır**, soru çıkan tur cevap alana dek durur.

**Not:** Faz döngüsüne otomatik bağlı değildir — ne zaman çağrılacağı aşağıda.

---

## Ne Zaman Kullanılır

- Faz veya versiyon sonu yeni oturumda (fresh perspective avantajı)
- DevFlow konvansiyonu değiştikten sonra mevcut projeyi yeni yapıya taşımak için (canvas `bump-version` ile herkesi due yapar)
- Dokümanların tutarlılığından emin olunmadığında ("DURUM.md uzamış görünüyor" hissi)
- Bir başka komutun (`double-check`, `review-phase`) drift sinyali verdiğinde
- Sürekli arka plan denetimi için `/loop` ile (kuyruk boşalınca durur → Adım 7)

---

## Nasıl Çalışır — Rolling Audit (canvas + script)

İş bölümü nettir:

- **Script = beyin (READ-ONLY).** `audit-canvas.py` hangi dokümanların sırada olduğunu **seçer** ve mekanik kırmızı-çizgileri (şu an: boyut) **tespit eder**. Dokümanları asla değiştirmez; sadece `_dev/.audit/` altındaki canvas'ı yönetir. Sen 1000+ doküman olsa bile script'in **birkaç satırlık** çıktısını alırsın; tüm listeyi okumazsın.
- **Claude = yargı + düzeltme.** Seçilen dokümanları sen okur, teşhis eder, **kulvara ayırır, uygular ve raporlarsın** (Onay Ölçütü). Script hiçbir dokümanı değiştirmez; düzeltmenin tamamı senin yargınla ve **çapasıyla** yapılır — çapası gösterilemeyen kalem düzeltme değil sorudur. Çok dokümanlı turda keşif ajanlara dağıtılır (Adım 3) — ama yargı, kullanıcıya soru, düzeltme ve yazma tek eldedir.

Canvas yalnızca bir **cursor**'dır ("hangi doküman ne zaman / hangi konvansiyon versiyonuna göre kontrol edildi"). Asıl kaynak `_dev/`'in kendisidir; canvas silinse aynasından (`canvas.tsv`) yeniden üretilir. Kuyruk kaldığı yerden devam ettiği için **hiçbir doküman atlanmaz, hiçbiri gereksiz yere iki kez taranmaz**. Detay: script başlığı.

İki **iş-modu** vardır ve dağıtım (dispatch) `next` çıktısındaki gerekçeye göre yapılır:

- **Section 1 — Acil İşleme** (akışı bu dosyada, ölçütleri `lib/audit-mekanik.md`'de): mekanik kırmızı-çizgiler. Hızlı; **template okuması kalem bazlıdır** — hangi kalemin istediği `lib/audit-mekanik.md`'de kalemin yanında yazılıdır (bugünkü isteyenler: parent `CLAUDE.md`'nin bölmesi → okuma listesi `lib/claude-md-bolme.md` · MEMORY'nin yöntem göçü → `templates/MEMORY.md` · native memory yönlendirmesi → `templates/NATIVE-MEMORY-REDIRECT.md`). Sayıyı buradan okuma, listeyi oradan al.
- **Section 2 — Uygunluk/Migration** (`lib/audit-conform.md`, ayrı dosya): derin per-doküman yapı + yargı denetimi. **Yalnızca uygunluk dokümanı dağıtıldığında** Read ile yüklenir — ayrı dosya olmasının nedeni tek-Read okunabilirliğidir: birleştirilseler bu dosya tek Read çağrısına sığmazdı (kanon: CLAUDE.md → Boyut ve Bölünme). İkisinin ortak mekanik listesi ayrı bir dosyadadır: `lib/audit-mekanik.md`; turun kapsam ve dokunma sınırları da öyle: `lib/audit-kurallar.md` — o, aşağıdaki Adım 0'da koşulsuz okunur.

---

## Oturum Başlangıç Protokolü (önce)

CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu çekirdek dokümanlar bağlamda olduğu için, herhangi bir dokümanı denetlerken **çapraz çelişki** (örn. modülde yazan stack ile OVERVIEW'ın çeliştiği) kontrolüne de zemin sağlar — **hata karşı taraftaysa** sessiz geçme (`lib/audit-kurallar.md` → Çapraz bulgu).

---

## Akış

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki Oturum Başlangıç Protokolü'nü uygula ve tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Sonra **`.claude/commands/devflow/lib/audit-kurallar.md`'yi Read ile oku** — tur başına bir kez, **koşulsuz**: turun kapsamı, tarihsel/sistem dokümanlarının kulvarı ve tur dışındaki dokümana dokunma sınırları oradadır; hangisinin bağlayacağı turun gidişatına bağlıdır ve üçü yasaktır — bilmeyen okuyucu aramaz (özet: aşağıda → Önemli Kurallar). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### Adım 1 — Canvas'ı gerçekle uzlaştır + mekanik tara

```bash
python3 .claude/commands/devflow/scripts/audit-canvas.py reconcile
python3 .claude/commands/devflow/scripts/audit-canvas.py scan
python3 .claude/commands/devflow/scripts/audit-canvas.py status
```

- `reconcile` — parent CLAUDE.md (kökte ve/veya `.claude/` altında) + `_dev/**/*.md`'yi tarar; yeni dokümanı kuyruğa ekler, silineni çıkarır, aynayı (`canvas.tsv`) üretir. **Kümeden düşen bir yolu dosyası diskte duruyorsa SİLMEZ:** satırı ve geçmişini korur, stderr'e uyarı yazar (her turda yineler) — ama kuyrukta da göstermez. Üyeliği `next`/`scan`/`status` **sorgu anında** yeniden ölçer; kapsam için DB'ye işaret yazılmaz, dolayısıyla yol yeniden üye olunca kendiliğinden döner ve kullanıcının `exclude` kararına hiç dokunulmaz. Tek yazılan şey **bayat `urgent` yargısının temizlenmesidir** (koşulları ortadan kalkmış bir ölçüm; yoksa yol döndüğünde `next` uçuş-anı ölçümüne hiç gelmeden o etiketten dispatch ederdi). Üye olmayan satır `status`'ta **`üye değil`** borç satırında görünür.
  **Tur başında bir kez parent'ın YERİNE bak** — tek soru, iki bakış: kökte `CLAUDE.md` var mı, `.claude/CLAUDE.md` var mı? `reconcile` parent'ı **kuyruğa** kendisi alır ama **yer kalemini doğurmaz**, onu yalnız bu bakış doğurur; kuyruk çıktısına güvenme — `next` yalnız o turun penceresini basar, `status` ise yol olarak yalnız borç satırlarını (`accepted`, `üye değil`) basar, sıradan bir parent'ı değil. Aşağıdaki üç hâlin tetiği budur. **Parent'ı `reconcile` kendisi bulur** (`scripts/audit-canvas.py` → `iter_doc_paths`): kök `CLAUDE.md` **ve** — projenin kendi parent'ıysa — `.claude/CLAUDE.md`. Ayırt edici `## Oturum Başlangıç Protokolü` başlığıdır ve **aksana duyarsız** aranır (filoda başlığını tümüyle aksansız yazan canlı bir proje var — parent'ı kökte olduğu için bugün bu testten geçmiyor, ama aynı biçimde yazılmış bir `.claude/` parent'ı duyarlı aramayla sessizce kaçardı; aynı ölçüt: `kickoff-verify` Adım 3); başlığı taşımayan `.claude/CLAUDE.md` kullanıcının global kural kopyasıdır — kuyruğa girmez, kalem doğurmaz.
  **Aynı bakışta kanonun HÂLİNE de bak** — parent'ta (bölünmüşse doktrin çocuklarında da) `Onay Ölçütü` **adı** duruyor mu? Aynı ölçü: **aksana duyarsız** ara (yukarıdaki gerekçe burada da geçerli). Durmuyorsa turun kulvarı **tabana** düşer (yukarıda → Kulvarın tabanı) ve parent'ı paketin ilk kalemi yap; bunu raporda tek satırla an. Bakış ücretsizdir: parent zaten protokolle bağlamdadır. **Ölçüt adın kendisidir, işaretçi değil** — motor bu kurala `CLAUDE.md → Doküman Disiplini` adresiyle de atıyor ve o bölüm göç etmemiş projede **canlı olabilir**: işaretçi çözülür ama ölçüt orada yoktur, yani "bölüm var" yanıltıcıdır. Ölç, sayma: `sed 's/ı/i/g;s/İ/I/g;s/ş/s/g;s/Ş/S/g;s/ğ/g/g;s/Ğ/G/g;s/ü/u/g;s/Ü/U/g;s/ö/o/g;s/Ö/O/g;s/ç/c/g;s/Ç/C/g' <parent> | grep -ci 'Onay Olcutu'`. **Katlamayı `y///` ile yazma:** bare POSIX locale'de (`LC_ALL=C`) çok baytlı kaynağı tek baytlı hedefle farklı uzunlukta sayar, `sed` hata verip çıkar ve boru hattı **`0`** basar — "ad yok" ile ayırt edilemez (sahada ısırdı, 2026-08-29 ölçüldü). Bu yüzden **`0` tek başına hüküm değildir:** sıfır görürsen komut stderr'e hata yazdı mı diye bak; yazdıysa ölçüm kurulamamıştır ve kulvar tabana **düşürülmez**.
  **İkisi de yoksa** kurulum yarımdır ve projenin Tier-1 dokümanı hiç yoktur: kalemi `🔗 Kapsam Dışı Borç`a yaz, rota `/devflow:kickoff-verify` Adım 3. **İkisi birden varsa** doktrin iki canlı parent'a bölünmüştür — ikisi de kuyruktadır. **Önce kaydı ara** (kardeş dalla aynı ölçü, aşağıdaki madde): parent'lardan herhangi birinde tek satırlık `<!-- KURAL: iki parent bilinçli tutuluyor -->` yorumu varsa karar zaten verilmiştir — rota önerme, raporda tek satır olarak an. Kayıt yoksa raporda an ve rota Adım 3'tür (`kickoff-verify` orada **birleştirmeyi** önerir; onaya bağlıdır, reddedilirse kaydı o yazar).
  **Parent `.claude/` altındaysa** (yukarıdaki bakış bunu söyler) yer kalemi doğabilir. O hâlde **önce kaydı ara**: parent'ın kendisinde tek satırlık bir `<!-- KURAL: parent .claude/CLAUDE.md'de kalır (bilinçli) -->` yorumu ya da OVERVIEW/DECISIONS'ta konumu savunan bir kayıt varsa karar zaten verilmiştir — kalemi yeniden açma, raporda tek satır olarak an. Kayıt yoksa kalemi `🔗 Kapsam Dışı Borç`a yaz, rota `/devflow:kickoff-verify` Adım 3 (parent'ın yerini o tespit eder; **taşımayı önerir — onaya bağlıdır, reddedilebilir**, ret hâlinde kayıt evi yukarıdaki KURAL yorumudur). Kendin taşıma — bu turun kapsamı değil. **Taşıma ≠ bölme: `.claude/` altındaki parent için yalnız YER kararı bu turun dışındadır.** Kanvas o yolu artık izlediği için dosya S1/S2'ye normal dispatch edilir — bölmesi ve uygunluğu bu turun işidir, parent kökteymiş gibi (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi; reçete `lib/claude-md-bolme.md`, import satırları parent kökte değilken `@../_dev/claude/…` olur — tarifin (4). adımı). Taşımanın rotası `/devflow:kickoff-verify` Adım 3'tür ve gerekçesi "kanvas görmez" değil **yer kararının onaya bağlı olmasıdır** (bilinçli ve kayıtsız bir kullanıcı tercihi olabilir; bölmenin kesimi ise motorda sabittir).
- `scan` — mekanik acil tespit (şu an yalnızca boyut kırmızı-çizgisi → `status=urgent`). Eşik altına düşen eski urgent'leri temizler.
- `status` — kuyruk sayaçları + **`excluded N`** + **`accepted N`** + (yalnız sıfırdan büyükse) **`üye değil N`**. Üçü de **borç kalemidir, iş listesi değil**; farkları borcun ne kadar sessiz olduğudur. Üçüncüsü yukarıda anlatıldı (`reconcile` — kümeden düşen ama diskte duran yol); aşağıdaki iki paragraf ilk ikisini ayırır. `exclude`'lı doküman tüm sorguların dışındadır (`WHERE exclude=0`) — bir daha hiçbir turda görünmez, drift'i tamamen sessizdir, `📁 Tarihsel` raporu bile ona ulaşmaz. `accept-size`'lı doküman yalnız **boyut kulvarından** çıkmıştır: uygunluk kuyruğunda kalır, S2'den geçer, `touch` alır. Kabul verildiği andaki içerik hash'ine bağlıdır — doküman değişince düşer (`scan` `kabul DÜŞTÜ` basar) ve yeniden `urgent` olur. **Ömür sınırı bilinçlidir:** her oturum yazılan bir dokümanda (DURUM) kabul bir sonraki düzenlemede düşer — kalıcı muafiyet değil, **ertelemenin kaydıdır**; tekrar tekrar düşüyorsa erteleme artık taşımıyor demektir.

  Üçünü de rapor manifestine tek sayı olarak yaz (`excluded N · accepted N · üye değil N` — sonuncusu yalnız `status` bastıysa, yani sıfırdan büyükse; script sıfırı gürültü saymaz, manifest de saymaz); **manifest düşen turda da** (tek dokümanlı tur — `lib/audit-rapor.md` → kural 1) ve **kuyruk boş çıktığında da** (Adım 3 → "temiz, dur") bu satırlar basılır: susturulmuş borcun tek görünme anı odur.
  **`excluded N > 0`** ise kimlerin susturulduğuna **bir kez** bak (git-tracked aynadan; yeni makine yok — `accepted` listesini `status` zaten adıyla ve gerekçesiyle basar, ek komut gerekmez):
  ```bash
  awk -F'\t' '$8=="1" {print $2}' _dev/.audit/canvas.tsv
  ```
  Listede **boyut yüzünden** susturulmuş bir doküman varsa yeri orası değildir — sınıfı ne olursa olsun: boyut aşımı `exclude` doğurmaz (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi), doğru kayıt `accept-size`'dır ve doküman denetimde kalır; bölme de yaşayan dokümanda hâlâ açıktır. Ama **sessizce geri alma** — o `exclude` eski kural altında verilmiş bilinçli bir karar olabilir.

  **Önce kaydı ara** (aynı desen: yukarıdaki parent yer kalemi · Adım 3'ün `TASKS-README` grep'i): `grep -n '<dosya adı>' _dev/docs/DECISIONS*.md`. Kayıt **varsa** kalemi yeniden açma, raporda tek satırla an (`= <yol> — <gerekçe>`). Kayıt **yoksa** kalemi `🔗 Kapsam Dışı Borç`a yaz (pakete bağlı olmayan tek üst-seviye slot — exclude'lı doküman tanımı gereği pakette değildir): *"bu `exclude` hâlâ geçerli mi, kuyruğa döndürelim mi?"* — ve **cevap ne olursa olsun kayıt düşer** (kural 9): geri alınacaksa `audit-canvas.py include <path>`, kalacaksa DECISIONS'a tek satır, **dosyanın adı cümlenin içinde** (grep onu o adla arar; emsal: `lib/audit-rapor.md` → kural 9'un Dokunulmaz Doküman dalı). Kayıt yazılmazsa cold-start aynı soruyu her turda yeniden doğurur. Ölçüt listenin **içeriğidir**, sayının artıp artmaması değil.

### Adım 2 — Turun paketini al

```bash
python3 .claude/commands/devflow/scripts/audit-canvas.py next --limit 3
# değişmediği için kuyruğa hiç girmeyen dokümanları da katmak için:   ... next --limit 3 --rotate
```

Çıktı her satırda `<path>\t<reason>`. Öncelik: `urgent` → `conformance` (`never` | `version-outdated` | `changed`) → (`--rotate` ile) `rotation:oldest`. Kuyrukta hazır doküman yoksa `#` ile başlayan tek satır döner.

**Paket = bir tur.** Varsayılan 3; kuyrukta daha az varsa dönen kadarıyla çalışılır — eksik satır sorun değil, kuyruk o kadar dolu değil demektir. Tur talimatında sayı verilmişse o kullanılır. **Sayı bir başlangıç noktasıdır, kimlik değil:** paket boyutu turun maliyetini doğrusal belirler — filo yalnız keşfi paralelleştirir; teyit, düzelteceğin dokümanın tam okuması, düzeltme ve commit doküman başına sende ve sıralıdır. Ağır/çok kalemli dokümanlarda daralt, kuyruk birikmişse tur talimatıyla genişlet.

**Pencere neden bu genişlikte:** açlığın ölçüsü penceredeki kirli çekirdek sayısı değil, **turlar arası yeniden kirlenme hızıdır** — denetlenen doküman `touch` ile kuyruktan düşer, kalıcı açlık ancak pencere bu hızın altına inerse doğar. Çekirdek (Tier-1) kümesinin tamamı her oturum kirlenmez: oturumdan oturuma düzenli kirlenen tek doküman DURUM'dur (KURAL'ı gereği her oturum üzerine yazılır), gerisi faz/versiyon sınırında ya da daha seyrek değişir (kümenin evi: `audit-canvas.py` → `TIER1_DOCS` **+ `TIER1_PREFIXES`**; bölünmüş projede parent iki yolundan biriyle bir kez sayılır ve doktrin çocukları kümeye girer — sayıyı buradan okuma, küme script'in kendisindedir: projede değişmezler ama `bump-version` hepsini birden kirletir, bu yüzden versiyon sonrası ilk turlar bir tur daha çekirdeğe gidebilir). 

**İstisna, `touch` almayan dokümandır** (Adım 5: S1 kulvarı + cevapsız sorusu kalan doküman); en kalıcısı S1'dir: kırmızı çizgiyi aşan doküman `touch` almaz ve `next` boyutu uçuş-anında ölçer — küçülene, bölünene, **boyutu kayıtla kabul edilene** (`accept-size`) ya da `exclude` edilene dek **her turda bir slot tutar**. **Boyut kalemi kapanmadıysa kabulü kaydet** (`accept-size`; altı giriş yolu ve gerekçe metni tek evdedir: `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi — yolların hepsi kullanıcı kararına bağlı değildir) — yoksa doküman hem her turda slot yer hem de S2'ye hiç akmaz, yani ertelenen boyut kararı dokümanın **tüm** denetimini sessizce durdurur. Faz sonu turunda — ya da `bump-version` sonrası ilk turlarda — pencere tümüyle çekirdeğe gidebilir; bu açlık değil, **en taze ve etki alanı en geniş drift'in önce gelmesidir**: o dokümanlar `touch` ile düştükçe pencere alt-tier'a döner.

⚠️ **Gerçek açlığın eşiği burada ve adı yoktu — ölçüldü:** yukarıdaki "yeniden kirlenme hızı" ölçütü `touch` ile kuyruktan düşen dokümanlar için geçerlidir, **S1 kalemi `touch` almaz**. Bu yüzden açık boyut kalemi sayısı `--limit`'e eşit ya da büyükse **pencerenin tamamı S1 kulvarına gider** ve o turda hiçbir doküman uygunluk (S2) denetimi almaz — kalem kapanana dek her turda. Kuyruk kendiliğinden boşalmaz. **Kalıcı çare kalemi kapatmaktır** (yolları tek evde: `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi). Pencereyi genişletmek meşru bir **geçici** çaredir — uygunluk akışını her turda geri verir — ama kalemi kapatmaz ve turun maliyetini doğrusal büyütür (yukarıdaki paket kuralı). Penceredeki payı ölç: `next` çıktısındaki `urgent:` satırlarını say — uygunluk (S2) kulvarına kalan `--limit` eksi o sayıdır (`status`'un `urgent` sayacı son `scan`'in anlık görüntüsüdür, uçuş-anı ölçüm `next`'tedir).

**`--rotate` açlığın çaresi değildir** — rotasyon adayları en sona sıralanır, kuyruk pencereyi doldurdukça slot bulamazlar; işlevi hiç değişmediği için kuyruğa hiç girmeyen dokümanı arada bir gözden geçirmektir (aynı gün denetlenenleri atlar — günlük döngü). **Tur talimatında rotasyon istendiyse** `--rotate` eklemek yetmez: dönen satırlarda `rotation:*` yoksa bunu rapor başlığında söyle ve nedenini ayır — kuyruk pencereyi doldurduysa çare pencereyi büyütmek/kuyruk boşalınca tekrar denemek; adaylar bugün denetlendiyse `--limit` çözmez, ertesi güne kalır.

### Adım 3 — Dağıtım (dispatch) + keşif

Paket **karışık gelir** — aynı çıktıda `urgent` ve `conformance` satırları olabilir. Dağıtım satır bazlıdır: her satır kendi gerekçesine göre kendi kulvarına gider, kulvarlar aynı turda paralel yürür.

| Gerekçe | Nereye |
|---|---|
| `urgent:*` | **Section 1 — Acil İşleme** (akış aşağıda; ölçütler için **`.claude/commands/devflow/lib/audit-mekanik.md`'yi Read ile oku**) |
| `conformance:*` / `rotation:*` | **`.claude/commands/devflow/lib/audit-conform.md`'yi Read ile oku** (tur başına bir kez), Section 2 akışını izle |
| çıktı boş veya `#` ile başlıyor | Kuyrukta hazır doküman yok → **temiz, dur** (düzeltme yok; yalnız canvas deltası varsa Adım 6). Adım 1'in borç satırları (`excluded N · accepted N` + varsa `üye değil N`) burada da basılır — kuyruk boş olabilir, susturulmuş borç durur. |

**Çok dokümanlı tur = filo turu.** `next` **birden fazla satır** döndürdüyse keşfi ajanlara dağıt — doküman başına bir **salt-okunur keşif ajanı**; harness'ta hangi orkestrasyon mekanizması varsa (workflow / alt-ajan) onu kur, sıralı okumaya kendiliğinden düşme. Bu komut çok-ajanlı keşfi **açıkça yetkilendirir ve çok dokümanlı turda bunu ister**. **Birden fazla mekanizma varsa doktrine uyanı seç** — yargıyı ve tek-yazarlığı sende bırakanı; izin kapısı en az sürtünmeli olanı değil. Tek satır döndüyse filo kurma — dokümanı doğrudan sen oku. Yürütme kipini raporun ilk satırına yaz (`filo: 3 ajan` / `sıralı`); sessiz geri düşüş yoktur.

**Doktrin: ajanlar keşfeder; yargı, kullanıcıya soru, düzeltme, `touch` ve commit yalnız sende.** Ajan brief'i: doküman yolu + `next` gerekçesi + talimat işareti — **her iki kulvarda da tam dosya yolu ver**, ajan senin bağlamını miras almaz ve "bu dosya" onun için çözülmez: `urgent:*` → `.claude/commands/devflow/lib/audit-mekanik.md`; aksi halde `.claude/commands/devflow/lib/audit-conform.md` (o da Adım 0'da aynı mekanik listeyi okur) + (conformance kulvarında) eşleşen template yolu — eşleme tablosu: `lib/audit-conform.md` Adım 1 — + protokol okumandan çıkan **tek paragraflık gerçeklik özeti** (stack, aktif faz/task, bilinen bilinçli tercihler, **Adım 1'in `accepted` listesi** — ajan `status` çalıştıramaz, boyut kabullerini ondan öğrenemez): çapraz çelişki yargısı ancak bu özetle mümkün olur. Ajan dosya düzenlemez, canvas komutlarının **hiçbirini** çalıştırmaz — durum değiştirenleri (`touch`/`scan`/`reconcile`/`invalidate`/`exclude`/`include`/`accept-size`/`unaccept-size`) de, salt-okunur `status`'u da: boyut kabulleri brief'te gelir (`audit-docs` Adım 3), kullanıcıya soru sormaz — belirsizliği soru olarak rapora yazar.

- **Ajan raporu bir düzeltmenin konumu ve dayanağıdır, metni değil** — eklenecek/geri konacak kanonik metin (template bölümü, `<!-- KURAL -->` yorumu) her zaman template dosyasından okunup birebir kopyalanır.
- **Teyit uygulamadan öncedir:** ajan kaleminin çapasını (`dosya:satır`) kendin doğrulamadan onu rapora **uygulanacak kalem olarak yazma**; doğrulanamayan kalem düşer ya da soruya iner. (Düzelteceğin dokümanı Adım 5'te zaten baştan sona okuyacaksın — teyit o okumanın öne alınmış parçasıdır; kuralın tam gerekçesi orada.)
- **Dokunulmaz Doküman pakete girdiyse önce bilinçli-ret kaydını ara.** Her dokümanın kendi bilinçli-ret kaydı kendi içinde durur (`<!-- KURAL: … (bilinçli) -->`) — **tek istisna Dokunulmaz Doküman'dır**: oraya proje-özel satır eklenemediği için kayıt `_dev/docs/DECISIONS.md`'ye düşer (gerekçe ve yazım anı: `lib/audit-rapor.md` → kural 9). Yani o kaydın **tek okuyucusu burasıdır**; aranmazsa kullanıcının "bunu yapma" dediği kalem sıradaki turda yeniden uygulanır. Paket `tasks/TASKS-README.md`'yi (ya da projenin kendi Dokunulmaz dokümanını → CLAUDE.md → Dokunulmaz Dokümanlar) içeriyorsa raporu yazmadan önce tek grep at:
  ```bash
  grep -n 'TASKS-README' _dev/docs/DECISIONS*.md
  ```
  Kayıt varsa kalem yeniden açılmaz — raporda tek satırla anılır. `*` glob'u bölünmüş DECISIONS içindir (giriş noktası parent'ta kalır → `lib/audit-kurallar.md` → Tarihsel/sistem dokümanları → Hiç dondurulmayan). **Grep doküman okuması değildir**: DECISIONS'ın içeriği bu turun kapsamı dışındadır (`lib/audit-kurallar.md` → Çapraz bulgu → Yasak bölge) — burada yalnız kaydın **varlığına** bakılır.

### Adım 4 — Paket raporu & sorular

Tüm paket için **tek rapor**. İki iş yapar: doğru cevabı kanonun/template'in yazdığı kurallı kalemleri **bildirir** (onaya sunmaz — CLAUDE.md → Onay Ölçütü; kanon o ölçütü henüz taşımıyorsa yukarıda → Kulvarın tabanı) ve gerçekten belirsiz olanları **sırayla sorar**. Dört kulvarı vardır: `🔧 Uygulanacak` · `❓ Karar` · `📁 Tarihsel` (yalnız rapor) · `🔗 Kapsam Dışı Borç`.

> **İskelet, örnek ve dokuz format kuralı tek evdedir — `.claude/commands/devflow/lib/audit-rapor.md`'yi Read ile oku** (tur başına bir kez, raporu yazmadan önce). Section 2 de (`lib/audit-conform.md` Adım 6) aynı dosyayı okur; burada tekrarlanmaz. Ayrı dosyadır çünkü iki çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme).

Yönelme için — kuralların özü (ölçütler dosyada): manifest + orantılılık · **çapa zorunlu** (gösterilemiyorsa kalem soru olur) · **`Proje-özgü` dayanaklı kalem uygulama kulvarına giremez** · tarihsel dokümanda 🔧'ün ölçütü içerik-koruyanlıktır (kalemleri kural 4 sayar) · kalem birimi neden'dir · ❓ gövdeleri sırayla açılır · ID'ler efemerdir · **kalem kullanıcının diliyle yazılır** · **geri alma üç hamledir** (geri al + kararı kaydet + canvas'ı gerçekle uzlaştır; üçüncüsü atlanamaz — commit'i revert etmek yerel `canvas.db`'yi geri almaz).

**Akış:** rapor yazılır, soru varsa sırayla açılır, sonra Adım 5. Soru yoksa rapordan sonra durmadan Adım 5'e geç — kurallı kalem için "tamam" bekleme.

### Adım 5 — Uygulama (doküman doküman)

Paketi tek blokta değil, **doküman doküman** kapat: düzelteceğin dokümanı baştan sona oku (bu okuma aynı zamanda ajan bulgusunun teyididir — yerinde bulunmayan bulgu düşer), raporda bildirdiğin kurallı kalemleri + cevabı gelmiş soruların gerektirdiğini uygula, canvas'ı senkronla, commit'le (Adım 6), sonrakine geç. Kesinti olursa kapanmış dokümanlar kayıtlıdır.

**Teyit uygulamadan öncedir.** Sormayı bıraktığımız için tek güvenlik ağı budur: bir kalem yerinde doğrulanamıyorsa uygulanmaz — düşer ya da soruya iner (Adım 3). Raporda bildirilmiş olması onu doğrulanmış yapmaz.

**Rapor "uygulanacak" demişti — düşen kalemi kapat.** Teyitte düşen ya da soruya inen bir kalem için, o dokümanın commit'inden **önce** tek satır yaz (`D1-2 · teyitte doğrulanamadı, uygulanmadı`) ve manifest sayısını düzelt. Soruya indiyse soruyu **burada** aç: cevaplanmadan o dokümana `touch` atılmaz ve commit'i beklemez — kalan kalemler commit'lenir, soru bir sonraki turun kalemi olur (kalem ertelendiği için kayıt kuralı da işler: `lib/audit-rapor.md` → kural 9).

Yapısal işlerde (bölme, atomizasyon, migration) referans bütünlüğünü koru — zincirin kanalları tek evde tanımlı: CLAUDE.md → Boyut ve Bölünme.

Canvas senkronu kulvara göre:

```bash
# S2 (uygunluk) kapandıysa — "tam denetlendi":
python3 .claude/commands/devflow/scripts/audit-canvas.py touch <path>
# S1 boyut kalemi KAPANMADIYSA — küçültme hiç yapılmadı YA DA yapıldı ama doküman hâlâ eşiğin
# üstünde. Altı giriş yolu ve gerekçe metni: `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi.
# Kap kararı da varsa (bölme ertelendi/reddedildi) o AYRI bir kayıttır ve hedefteki
# `<!-- KURAL: … (bilinçli) -->` yorumuna yazılır — ikisi alternatif değil (CLAUDE.md → Onay
# Ölçütü → Kaydın evi). Geri alma yolunda ÖNCE bölmeyi geri al. Her hâlde `scan`'den ÖNCE:
# ⚠️ Bölmeden doğan ÇOCUK için kabul gerekiyorsa önce `reconcile` (aşağıdaki satır) — çocuk
# kanvasta yoktur ve komut onu *canvas'ta yok* diye reddeder (ölçüldü, exit=1; `lib/boyut-kapisi.md` §3).
python3 .claude/commands/devflow/scripts/audit-canvas.py accept-size <path> --reason "<kullanıcının kararı | teşhisin sonucu>"
# S1 (acil) kapandıysa — touch ATMA:
python3 .claude/commands/devflow/scripts/audit-canvas.py reconcile   # bölmeden doğan çocukları kuyruğa al
python3 .claude/commands/devflow/scripts/audit-canvas.py scan        # çözülen urgent'i temizle
```

`touch` = "tam denetlendi", **yalnız S2'de**: S1 kulvarı acil/mekanik işi yaptı, doküman (ve yeni çocukları) uygunluk için kuyrukta kalmalı → sonraki tur(lar)da S2'ye akar. **Cevapsız sorusu kalan dokümana da `touch` atma.**

### Adım 6 — Git Commit & Push

Her doküman **kendi izole commit'ini** alır — sormadan uygulanan bir kalemin geri alınabilirliği buna dayanır (`lib/audit-rapor.md` → kural 9), yani izolasyon artık bir kolaylık değil **kapının kendisidir**. Commit'e yalnız o dokümanın yolları ve **o düzeltmenin zorunlu kıldığı hedefler** — bölmeden doğan çocuklar, kayıt satırları (INDEX/MODULE-MAP, parent pointer'ı), yanlış-ev düzeltmesinin varış dokümanı — + turun kendi canvas artefaktları (`_dev/.audit/canvas.tsv`; script'in kök `.gitignore`'a eklediği canvas satırları ve — prettier'lı projede — `.prettierignore`'a eklenen motor muafiyeti; ikisi de eksikse **her** koşuda eklenebilir) girer. `git add <path>` ile ayır, `git add -A` ile tur dışı kirli dosyaları süpürme. Çapraz düzeltme **hedef dokümanın kendi commit'ini** alır (mesajda tetikleyen tur anılır).

**Muafiyet satırının yazarı script de KURULUM da olabilir** — ikisi birebir aynı metni yazar, yani ayırt edilemez (`.gitignore` satırlarında bu ikilik yoktur; onları yalnız script yazar). Kurulumdan sonra sahipsiz görünen bir `.prettierignore` deltası bu yüzden Paralel Oturum Farkındalığı'nın *"tanımadığın değişikliği sessizce dışarıda bırak"* dalına değil yukarıdaki kapsama düşer; aksi hâlde kurulumun yazdığı satır hiçbir turun commit'ine giremez ve ağaçta kalıcı kir kalır. Delta **yalnız** o muafiyetten ibaret değilse fazlası yabancıdır — dokunma.

```
docs: audit-docs — [hangi doküman / ne düzeltildi]
```

Turdaki dokümanlar bittiğinde **tek `git push`**. Tetik "düzeltme yaptım" değil, **turun kendi dosyalarında delta olması**dır (denetlenen dokümanlar + canvas artefaktları): düzeltme çıkmasa bile `reconcile`/`scan`/`touch` canvas aynasını yeniden yazabilir, o delta da commit'lenip push'lanır. Turun dosyaları temizse ne commit ne push — ağaçta başka kir varsa paralel oturuma aittir, dokunma (CLAUDE.md → Paralel Oturum Farkındalığı). (Push branch seviyesindedir — önceki turdan push'suz commit kalmışsa bir sonraki push onları da götürür.)

### Adım 7 — Oturum Kapanışı

Sonra **dur** — çalıştırma başına bir paket. Blok **oturumu kapatan turda** yazılır: `/loop` altında yalnız son turda; araya `pause` girerse blok onundur. Kanon: **CLAUDE.md → Oturum Kapanışı**.

Kuyruğun **turdan sonraki** hâlini `next --limit 1` ile ölç (`#` satırı = temiz). Adım 1'in `status` çıktısına bakma: tur başınındır ve kuyruk uzunluğu basmaz.

```
✅ Denetim turu tamamlandı — [N doküman işlendi | kuyruk temiz].
📋 Sıradaki adım: [kuyrukta iş varsa: /devflow:audit-docs | kalmadıysa: /devflow:<DURUM → Adım'dan türeyen komut>]
   → [kuyrukta iş sürüyor | kuyruk temiz, türetme faz komutu verdi — faz döngüsü sürer | kuyruk temiz, türetme `prd-review` verdi — versiyon sonu değerlendirmesi sırada]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

Üç audit dalı: **faz-komutu dalı koşulludur** — komutu DURUM'un `Adım` alanından türet (kanon: CLAUDE.md → Oturum Kapanışı; `_dev/tasks/quick/`'te devralınacak ⬜/🔄 bir kayıt varsa sıradaki adım odur, türetme komut vermiyorsa `yok — [bekleme koşulu]`). **Taramayı kanon emrediyor** (aynı madde) ve bu komutta atlanamaz: akış `_dev/.audit/` kuyruğu üzerinden yürür, kuyruğun penceresi ise klasörün tamamını göstermez ve kayıtları Durum'a göre sıralamaz — bekleyen bir kaydın o turda pencereye düşmesi tesadüftür · satıra yalnız **turun dışına taşan** iş girer (kuyruğa alınan ve cevapsız kalan kalem girmez — evi canvas) · **kulvarı peşinen sabitleme:** kalem `engel:` mi `önerilir:` mi kanonun ölçüsüyle yargılanır, engelse `📋`'ye terfi eder; karar veremiyorsan sor.

---

## Section 1 — Acil İşleme (urgent dokümanlar)

Buraya `next` gerekçesi `urgent:*` olduğunda gelinir. Acil dokümanlar **kırmızı çizgi** ihlalleridir (örn. ~20k token'ı aşan, tek-okumayı riske atan doküman) — önceliklidir, hemen çözülür. Section 2 (derin uygunluk) **bu doküman için** yapılmaz (`touch` yok → doküman kuyrukta uygunluk-borçlu kalır; Adım 5); paketin `conformance:*` satırları kendi kulvarında **aynı turda** yürür.

> **Bu kulvar kalıcı olmamalı.** Boyut kalemi bu turda çözülmezse doküman burada çakılı kalır — her turda slot yer, `touch` alamadığı için bir daha uygunluk denetimi görmez. Çıkış her doküman sınıfında `accept-size`'dır — dondurulmuşta da koşar; `exclude` bu kulvarın yedeği değil, ayrı bir karardır (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi).

### Mekanik kontrol listesi

> **Tek kaynak: `.claude/commands/devflow/lib/audit-mekanik.md`.** Bu listeyi **Read ile oku** — S1 kulvarına gelen her doküman için geçerlidir, Section 2 de (`lib/audit-conform.md` Adım 0) aynı dosyayı okur. Ayrı dosyadır çünkü iki çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). Burada tekrarlanmaz.

İçindekiler (yönelme için; ölçütler dosyada): boyut kırmızı-çizgisi + `accept-size` kaydı · placeholder sızıntısı · kırık dosya referansı (bölme çocuğunun iki yönü + `_dev/claude/` doktrin çocukları) · soft-delete kalıntısı · INDEX kapsamı · kümülatif tek-değer alanları · index↔atom bütünlüğü.

### Akış

1. **Oku + teşhis et** — üçlü teşhis (şişme / meşru birikim / gerçek büyüme), her ayağın kap-mı-içerik-mi kulvarı ve kesim kuralı **`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi**'ndedir; yukarıda Read ile okundu, burada tekrarlanmaz. Parent `CLAUDE.md`'nin (kökte ya da `.claude/` altında) kendi kesim kuralı (motorda sabit → kalem uygulanır, sorulmaz) ve `lib/claude-md-bolme.md`'yi **rapordan önce** Read etme yükümlülüğü de orada yazılıdır.

   **Bu dosyanın eklediği tek istisna `docs/DECISIONS.md`'dir:** dondurulmamış tarihsel dokümandır ve kesimi `##` değil **kayıt sınırıdır** — kural `lib/audit-kurallar.md` → Tarihsel/sistem dokümanları → Hiç dondurulmayan'dadır (Adım 0'da okundu). `lib/audit-mekanik.md`'nin `##` ölçüsünü oraya uygulama.
2. **Bulguları Adım 4'ün paket raporuna kat** → (soru varsa sırayla aç) → **Adım 5** (uygulama; S1 kulvarında `touch` ATILMAZ) → **Adım 6** (commit & push).

---

## Önemli Kurallar

> **Kuralların tamamı tek evdedir — `.claude/commands/devflow/lib/audit-kurallar.md`'yi Read ile oku.** Okuma **Adım 0'da, tur başına bir kez** yapılır ve **koşulsuzdur**: hangi kuralın bağlayacağı turun gidişatına bağlıdır (pakete ne düştüğü, `excluded` sayısı, çapraz bulgu doğup doğmadığı) ve üçü **yasaktır** — bilmeyen okuyucu aramaz. Burada tekrarlanmaz. Ayrı dosyadır çünkü bu dosyanın **payı** tükenmişti — bölme kararında kırmızı çizgiye 32 token kalmıştı (`87415de`), sığmadığı için değil; bölme payı geri verdi ve **o pay bugün yeniden tükendi** — dosya rehber eşiğin üstündedir ve bu **bilinçle kabul edilmiştir**: bağlayıcı ölçüt tek-Read'dir, o sağlanıyor (kanon: Doküman Disiplini → Boyut ve Bölünme, "geçici doluluk bilinçli kabul edilir ve raporlanır"). Ölçümün evi motorun kanvasıdır, bu dosya değil. Kesim kurallı çıkmadı, kullanıcı kararıyla alındı (gerekçe tek evde: `lib/audit-kurallar.md` üst bloğu).

İçindekiler (yönelme için; ölçütler dosyada): **cold-start** neyi bağlar neyi bağlamaz — niyet yargısı sorudur, kanonun yazdığı kap işlemi değil · script auto-fix yapmaz ("sorulmadan uygulanır" ≠ "otomatik uygulanır") · **tarihsel/sistem dokümanları** ve rapor kulvarı — *dondurulmuş* (bölme yasak; boyut çıkışı yine `accept-size`) · *hiç dondurulmayan* `DECISIONS` (kesim `##` değil **kayıt sınırı**) · `TASKS-README` · **çapraz bulgu**, tur dışındaki dokümanda görülen hata — tek-hamle sınırı, aramaya çıkma yasağı, **yasak bölge** · kod kalitesi ve ürün davranışı kapsam dışı, salt-okunur kod incelemesi serbest.
