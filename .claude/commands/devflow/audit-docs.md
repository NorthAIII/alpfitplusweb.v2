# DevFlow — Doküman Denetimi (Audit Docs)

Bu komut proje-genişlikli doküman drift'ini **artımlı (rolling)** olarak tarar ve düzeltir. Faz döngüsü boyunca yaşayan dokümanlarda kümülatif biriken sorunları (şişme, sıkıştırma, soft-delete kalıntısı, yanlış-ev bilgisi, tetiklenmemiş mezuniyet, statik bayatlama) ve DevFlow konvansiyonu evrildiğinde dokümanların eski yapıda kalmasını (migration) yakalar. **Drift ile migration tek ve aynı kontroldür** — "bu doküman GÜNCEL template'e/konvansiyona uyuyor mu?"; sadece tetikleyici farklıdır.

Tamamen manuel — kullanıcı tetikler; değişiklikleri de ancak **rapor + onaydan** sonra yapar. Tek seferde tüm projeyi taramaz: bir **canvas** (kontrol kuyruğu) sıradaki dokümanları seçer, sen onları işlersin — çalıştırma başına bir **paket** (varsayılan 3 doküman; kuyrukta daha az varsa o kadar).

**Kullanım:** `/devflow:audit-docs [tur talimatı]` — talimat serbest metindir ve **o turla sınırlıdır**: paket boyutu ("5 doküman"), rotasyon isteği ("değişmeyenlere de bak"), odak notu. Boşsa varsayılan paketi işler, sonra durur. Sürekli işlemek için `/loop` ile çağır (onay kapısı `/loop`'ta da geçerlidir — kullanıcı onaylamadan tur kapanmaz).

**Not:** Faz döngüsüne otomatik bağlı değildir. Faz sonu, versiyon sonu, kickoff sonrası, konvansiyon değişimi sonrası veya doküman karmaşası hissedildiği herhangi bir anda çağrılabilir.

---

## Ne Zaman Kullanılır

- Faz veya versiyon sonu yeni oturumda (fresh perspective avantajı)
- DevFlow konvansiyonu değiştikten sonra mevcut projeyi yeni yapıya taşımak için (canvas `bump-version` ile herkesi due yapar)
- Birkaç oturum sonrası "DURUM.md uzamış görünüyor" hissi geldiğinde
- Yeni bir Claude oturumu açıldığında ve dokümanların tutarlılığından emin olunmadığında
- Bir başka komutun (`double-check`, `review-phase`) drift sinyali verdiğinde
- Sürekli arka plan denetimi için `/loop` ile (kuyruk boşalınca kendiliğinden temiz raporla durur)

---

## Nasıl Çalışır — Rolling Audit (canvas + script)

İş bölümü nettir:

- **Script = beyin (READ-ONLY).** `audit-canvas.py` hangi dokümanların sırada olduğunu **seçer** ve mekanik kırmızı-çizgileri (şu an: boyut) **tespit eder**. Dokümanları asla değiştirmez; sadece `_dev/.audit/` altındaki canvas'ı yönetir. Sen 1000+ doküman olsa bile script'in **birkaç satırlık** çıktısını alırsın; tüm listeyi okumazsın.
- **Claude = yargı + düzeltme (onaylı).** Seçilen dokümanları sen okur, teşhis eder, **raporlar, onay alır, düzeltirsin.** Auto-fix yoktur. Çok dokümanlı turda keşif ajanlara dağıtılır (Adım 3) — ama yargı, onay, düzeltme ve yazma tek eldedir.

Canvas yalnızca bir **cursor**'dır ("hangi doküman ne zaman / hangi konvansiyon versiyonuna göre kontrol edildi"). Asıl kaynak `_dev/`'in kendisidir; canvas silinse aynasından (`canvas.tsv`) yeniden üretilir. Detay: script başlığı.

İki **iş-modu** vardır ve dağıtım (dispatch) `next` çıktısındaki gerekçeye göre yapılır:

- **Section 1 — Acil İşleme** (akışı bu dosyada, ölçütleri `lib/audit-mekanik.md`'de): mekanik kırmızı-çizgiler. Hızlı, template gerektirmez — **tek istisna** kök `CLAUDE.md`'nin bölmesidir: soru template istemez, onaylanan **uygulama** ister ve okuma listesini `lib/claude-md-bolme.md` bildirir.
- **Section 2 — Uygunluk/Migration** (`lib/audit-conform.md`, ayrı dosya): derin per-doküman yapı + yargı denetimi. **Yalnızca uygunluk dokümanı dağıtıldığında** Read ile yüklenir — ayrı dosya olmasının nedeni tek-Read okunabilirliğidir: birleştirilseler bu dosya tek Read çağrısına sığmazdı (kanon: CLAUDE.md → Boyut ve Bölünme). İkisinin ortak mekanik listesi üçüncü bir dosyadadır: `lib/audit-mekanik.md`.

---

## Oturum Başlangıç Protokolü (önce)

CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu çekirdek dokümanlar bağlamda olduğu için, herhangi bir dokümanı denetlerken **çapraz çelişki** (örn. modülde yazan stack ile OVERVIEW'ın çeliştiği) kontrolüne de zemin sağlar — **hata karşı taraftaysa** sessiz geçme (Önemli Kurallar → Çapraz bulgu).

---

## Akış

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki Oturum Başlangıç Protokolü'nü uygula ve tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### Adım 1 — Canvas'ı gerçekle uzlaştır + mekanik tara

```bash
python3 .claude/commands/devflow/scripts/audit-canvas.py reconcile
python3 .claude/commands/devflow/scripts/audit-canvas.py scan
python3 .claude/commands/devflow/scripts/audit-canvas.py status
```

- `reconcile` — kök CLAUDE.md + `_dev/**/*.md`'yi tarar; yeni dokümanı kuyruğa ekler, silineni çıkarır, aynayı (`canvas.tsv`) üretir.
  **Kök `CLAUDE.md` yoksa `reconcile` onu sessizce atlar** (`scripts/audit-canvas.py` → `iter_doc_paths`) — kuyruğa hiç girmez, kanvas "temiz" der ve projenin Tier-1 dokümanı denetim dışında kalır. Tur başında **bir kez** bak: kökte yoksa `.claude/CLAUDE.md`'ye bak — filoda ölçülmüş bir hâldir; harness onu bağlama yükler ama canvas görmez. Dosya `## Oturum Başlangıç Protokolü` içeriyorsa projenin kendi parent'ıdır; içermiyorsa global bir kural kopyasıdır ve kalem doğmaz (aynı ayırt edici: `kickoff-verify` Adım 3). Parent'ıysa **önce kaydı ara**: parent'ın kendisinde tek satırlık bir `<!-- KURAL: parent .claude/CLAUDE.md'de kalır (bilinçli) -->` yorumu ya da OVERVIEW/DECISIONS'ta konumu savunan bir kayıt varsa karar zaten verilmiştir — kalemi yeniden açma, raporda tek satır olarak an. Kayıt yoksa kalemi `🔗 Kapsam Dışı Borç`a yaz, rota `/devflow:kickoff-verify` Adım 3 (parent'ın yerini o tespit eder; **taşımayı önerir — onaya bağlıdır, reddedilebilir**, ret hâlinde kayıt evi yukarıdaki KURAL yorumudur). Kendin taşıma — bu turun kapsamı değil. (**Taşıma ≠ bölme:** parent'ın *yeri* bu turun kapsamı değildir; parent'ın *bölünmesi* S1 kulvarında bu turun işidir — `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi.)
- `scan` — mekanik acil tespit (şu an yalnızca boyut kırmızı-çizgisi → `status=urgent`). Eşik altına düşen eski urgent'leri temizler.
- `status` — kuyruk sayaçları + **`excluded N`** + **`accepted N`**. İkisi de **borç kalemidir, iş listesi değil**; farkları borcun ne kadar sessiz olduğudur. `exclude`'lı doküman tüm sorguların dışındadır (`WHERE exclude=0`) — bir daha hiçbir turda görünmez, drift'i tamamen sessizdir, `📁 Tarihsel` raporu bile ona ulaşmaz. `accept-size`'lı doküman yalnız **boyut kulvarından** çıkmıştır: uygunluk kuyruğunda kalır, S2'den geçer, `touch` alır. Kabul verildiği andaki içerik hash'ine bağlıdır — doküman değişince düşer (`scan` `kabul DÜŞTÜ` basar) ve yeniden `urgent` olur. **Ömür sınırı bilinçlidir:** her oturum yazılan bir dokümanda (DURUM) kabul bir sonraki düzenlemede düşer — kalıcı muafiyet değil, **ertelemenin kaydıdır**; tekrar tekrar düşüyorsa erteleme artık taşımıyor demektir.

  Her ikisini de rapor manifestine tek sayı olarak yaz (`excluded N · accepted N`); **manifest düşen turda da** (tek dokümanlı tur — Adım 4 → kural 1) ve **kuyruk boş çıktığında da** (Adım 3 → "temiz, dur") bu satırlar basılır: susturulmuş borcun tek görünme anı odur.
  **`excluded N > 0`** ise kimlerin susturulduğuna **bir kez** bak (git-tracked aynadan; yeni makine yok — `accepted` listesini `status` zaten adıyla ve gerekçesiyle basar, ek komut gerekmez):
  ```bash
  awk -F'\t' '$8=="1" {print $2}' _dev/.audit/canvas.tsv
  ```
  Listede **yaşayan** bir doküman varsa (dondurulmuş faz/arşiv değil — örn. `docs/DECISIONS*.md`, kök `CLAUDE.md`) yeri orası değildir: bölme yolu açıktır, bölme istenmiyorsa da doğru kayıt `accept-size`'dır (doküman denetimde kalır). Ama **sessizce geri alma:** o `exclude` eski kural altında verilmiş bilinçli bir kullanıcı kararı olabilir. Kalemi **`🔗 Kapsam Dışı Borç` bloğuna** yaz (pakete bağlı olmayan tek üst-seviye slot; ❓ kulvarı paket dokümanının altına yuvalanır, exclude'lı doküman ise tanımı gereği pakette değildir): *"bu `exclude` hâlâ geçerli mi, kuyruğa döndürelim mi?"*. Onay gelirse `python3 .claude/commands/devflow/scripts/audit-canvas.py include <path>` ile geri al; sırası gelince bölme sorusu açılır (→ Önemli Kurallar → Tarihsel/sistem dokümanları). Ölçüt listenin **içeriğidir**, sayının artıp artmaması değil — audit cold-start çalışır, önceki turun sayısını bilmez.

### Adım 2 — Turun paketini al

```bash
python3 .claude/commands/devflow/scripts/audit-canvas.py next --limit 3
# değişmediği için kuyruğa hiç girmeyen dokümanları da katmak için:   ... next --limit 3 --rotate
```

Çıktı her satırda `<path>\t<reason>`. Öncelik: `urgent` → `conformance` (`never` | `version-outdated` | `changed`) → (`--rotate` ile) `rotation:oldest`. Kuyrukta hazır doküman yoksa `#` ile başlayan tek satır döner.

**Paket = bir tur.** Varsayılan 3; kuyrukta daha az varsa dönen kadarıyla çalışılır — eksik satır sorun değil, kuyruk o kadar dolu değil demektir. Tur talimatında sayı verilmişse o kullanılır. **Sayı bir başlangıç noktasıdır, kimlik değil:** paket boyutu turun maliyetini doğrusal belirler — filo yalnız keşfi paralelleştirir; teyit, düzelteceğin dokümanın tam okuması, düzeltme ve commit doküman başına sende ve sıralıdır. Ağır/çok kalemli dokümanlarda daralt, kuyruk birikmişse tur talimatıyla genişlet.

**Pencere neden bu genişlikte:** açlığın ölçüsü penceredeki kirli çekirdek sayısı değil, **turlar arası yeniden kirlenme hızıdır** — denetlenen doküman `touch` ile kuyruktan düşer, kalıcı açlık ancak pencere bu hızın altına inerse doğar. Çekirdek (Tier-1) kümesinin tamamı her oturum kirlenmez: oturumdan oturuma düzenli kirlenen tek doküman DURUM'dur (KURAL'ı gereği her oturum üzerine yazılır), gerisi faz/versiyon sınırında ya da daha seyrek değişir (kümenin evi: `audit-canvas.py` → `TIER1_DOCS` **+ `TIER1_PREFIXES`**; bölünmüş projede küme 14'tür — 4'ü doktrin çocuğudur: projede değişmezler ama `bump-version` hepsini birden kirletir, bu yüzden versiyon sonrası ilk turlar bir tur daha çekirdeğe gidebilir). **İstisna, `touch` almayan dokümandır** (Adım 5: S1 kulvarı + cevapsız sorusu kalan doküman); en kalıcısı S1'dir: kırmızı çizgiyi aşan doküman `touch` almaz ve `next` boyutu uçuş-anında ölçer — küçülene, bölünene, **boyutu kayıtla kabul edilene** (`accept-size`) ya da `exclude` edilene dek **her turda bir slot tutar**. **Karar ertelendiyse kabulü kaydet** (`accept-size`) — yoksa doküman hem her turda slot yer hem de S2'ye hiç akmaz, yani ertelenen boyut kararı dokümanın **tüm** denetimini sessizce durdurur. Faz sonu turunda — ya da `bump-version` sonrası ilk turlarda — pencere tümüyle çekirdeğe gidebilir; bu açlık değil, **en taze ve etki alanı en geniş drift'in önce gelmesidir**: o dokümanlar `touch` ile düştükçe pencere alt-tier'a döner.

**`--rotate` açlığın çaresi değildir** — rotasyon adayları en sona sıralanır, kuyruk pencereyi doldurdukça slot bulamazlar; işlevi hiç değişmediği için kuyruğa hiç girmeyen dokümanı arada bir gözden geçirmektir (aynı gün denetlenenleri atlar — günlük döngü). **Tur talimatında rotasyon istendiyse** `--rotate` eklemek yetmez: dönen satırlarda `rotation:*` yoksa bunu rapor başlığında söyle ve nedenini ayır — kuyruk pencereyi doldurduysa çare pencereyi büyütmek/kuyruk boşalınca tekrar denemek; adaylar bugün denetlendiyse `--limit` çözmez, ertesi güne kalır.

### Adım 3 — Dağıtım (dispatch) + keşif

Paket **karışık gelir** — aynı çıktıda `urgent` ve `conformance` satırları olabilir. Dağıtım satır bazlıdır: her satır kendi gerekçesine göre kendi kulvarına gider, kulvarlar aynı turda paralel yürür.

| Gerekçe | Nereye |
|---|---|
| `urgent:*` | **Section 1 — Acil İşleme** (akış aşağıda; ölçütler için **`.claude/commands/devflow/lib/audit-mekanik.md`'yi Read ile oku**) |
| `conformance:*` / `rotation:*` | **`.claude/commands/devflow/lib/audit-conform.md`'yi Read ile oku** (tur başına bir kez), Section 2 akışını izle |
| çıktı boş veya `#` ile başlıyor | Kuyrukta hazır doküman yok → **temiz, dur** (düzeltme yok; yalnız canvas deltası varsa Adım 6). Adım 1'in `excluded N · accepted N` satırları burada da basılır — kuyruk boş olabilir, susturulmuş borç durur. |

**Çok dokümanlı tur = filo turu.** `next` **birden fazla satır** döndürdüyse keşfi ajanlara dağıt — doküman başına bir **salt-okunur keşif ajanı**; harness'ta hangi orkestrasyon mekanizması varsa (workflow / alt-ajan) onu kur, sıralı okumaya kendiliğinden düşme. Bu komut çok-ajanlı keşfi **açıkça yetkilendirir ve çok dokümanlı turda bunu ister**. **Birden fazla mekanizma varsa doktrine uyanı seç** — yargıyı ve tek-yazarlığı sende bırakanı; izin kapısı en az sürtünmeli olanı değil. Tek satır döndüyse filo kurma — dokümanı doğrudan sen oku. Yürütme kipini raporun ilk satırına yaz (`filo: 3 ajan` / `sıralı`); sessiz geri düşüş yoktur.

**Doktrin: ajanlar keşfeder; yargı, kullanıcıya soru, düzeltme, `touch` ve commit yalnız sende.** Ajan brief'i: doküman yolu + `next` gerekçesi + talimat işareti — **her iki kulvarda da tam dosya yolu ver**, ajan senin bağlamını miras almaz ve "bu dosya" onun için çözülmez: `urgent:*` → `.claude/commands/devflow/lib/audit-mekanik.md`; aksi halde `.claude/commands/devflow/lib/audit-conform.md` (o da Adım 0'da aynı mekanik listeyi okur) + (conformance kulvarında) eşleşen template yolu — eşleme tablosu: `lib/audit-conform.md` Adım 1 — + protokol okumandan çıkan **tek paragraflık gerçeklik özeti** (stack, aktif faz/task, bilinen bilinçli tercihler, **Adım 1'in `accepted` listesi** — ajan `status` çalıştıramaz, boyut kabullerini ondan öğrenemez) — ajan senin bağlamını miras almaz, çapraz çelişki yargısı bu özetle mümkün olur. Ajan dosya düzenlemez, canvas'ın durum değiştiren komutlarını (`touch`/`scan`/`reconcile`/`invalidate`/`exclude`/`include`/`accept-size`/`unaccept-size`) çalıştırmaz, kullanıcıya soru sormaz — belirsizliği soru olarak rapora yazar.

- **Ajan raporu bir düzeltmenin konumu ve dayanağıdır, metni değil** — eklenecek/geri konacak kanonik metin (template bölümü, `<!-- KURAL -->` yorumu) her zaman template dosyasından okunup birebir kopyalanır.
- **Teyit onaydan öncedir:** ajan kaleminin çapasını (`dosya:satır`) kendin doğrulamadan onu rapora **mekanik kalem olarak yazma**; doğrulanamayan kalem düşer ya da soruya iner. (Düzelteceğin dokümanı Adım 5'te zaten baştan sona okuyacaksın — teyit o okumanın öne alınmış parçasıdır.)

### Adım 4 — Paket raporu & onay

Tüm paket için **tek rapor**, değişiklik yapmadan. İskelet + örnek (tek kaynak — Section 2 de bunu kullanır):

```
📦 Denetim Turu: 3 doküman (filo: 3 ajan) — 5 mekanik · 2 soru · 1 tarihsel-rapor · 2 kapsam-dışı · excluded 12 · accepted 1
   D1  _dev/DURUM.md                   urgent:token-hard  (~21.4k token)
   D2  _dev/modules/M2-ODEME.md        conformance:version-outdated → migration
   D3  _dev/tasks/archive/TASK-2.03.md conformance:never  (tarihsel)

📄 D2 · _dev/modules/M2-ODEME.md   (conformance:version-outdated → migration)
  🔧 Mekanik (toplu onay)
     D2-1 · F2.1 bloğunda `**Kabul Kriterleri:**` alanı yok
        Sorun  : 4 kriter `**Açıklama:**` paragrafına gömülü (satır 12-19).
        Öneri  : Alan başlığı eklenir, 4 kriter altına madde listesi olarak TAŞINIR
                 (kopya değil), metin birebir korunur.
        Dayanak: Template — templates/MODULE.md:15, feature bloğunun zorunlu alanı
     D2-2 · 3 placeholder kalıntısı (satır 24, 31 `[Henüz yok]`; satır 40 `[Tarih]` → 2026-07-14)
        Dayanak: Template — production dokümanda template kalıntısı kalmaz   ← tek satırlık kalem
  ❓ Karar (sırayla açacağım)
     ?1 · Doküman "Iyzico" diyor (satır 9); src/payments/ altında yalnız Stripe var.   nokta
          Dayanak: Gerçeklik — çapraz çelişki (doküman ↔ kod)
     ?2 · "## Test Notları" bölümü template'te yok — bilinçli eklenti mi, drift mi?    yapısal
          Dayanak: Proje-özgü — templates/MODULE.md'de karşılığı yok
  ⇒ D2 kapanınca touch.   (D1 bloğu aynı kalıpta — 2 mekanik kalem, yer için kısaltıldı;
    ⇒ "S1 kulvarı → touch yok")

📄 D3 · _dev/tasks/archive/TASK-2.03.md   (conformance:never — tarihsel)
  🔧 Mekanik (toplu onay)
     D3-1 · Başlık eski formatta (`### Task 2.03`) → yeni yapıya hizalanır.  tarihsel reformat
        Dayanak: Template — templates/TASK.md:1, başlık formatı (`# TASK-X.YY: …`)
  📁 Tarihsel (yalnız rapor): "Süre: 2sa" alanı commit geçmişiyle uyuşmuyor — arşiv kaydı,
     düzeltilmez; bilgi olarak bildiriyorum.
  ⇒ D3 kapanınca touch (tarihsel de S2'den geçer).

🔗 Kapsam Dışı Borç
   K1 · _dev/OVERVIEW.md:18 "SQLite" ↔ docker-compose.yml:11 PostgreSQL 16 (DECISIONS.md:22)
        Öneri: satır 18 → "PostgreSQL 16" (tek hamle)
        (a) şimdi düzelt / (b) kuyruğa al / (c) bilinçli → önerim (a): kanıt kesin, tek satır
   K2 · _dev/docs/DECISIONS.md `exclude`'lı ama yaşayan doküman — bölme yolu açık (Adım 1)
        bu `exclude` hâlâ geçerli mi, kuyruğa döndürelim mi? → onayda `include`
        (bölme yine istenmiyorsa doğru kayıt `accept-size`: denetimde kalır, yalnız boyut susar)

▶ 5 mekanik kalem toplu onaya hazır — "tamam" yeterli; istisna numarayla ("D2-1 hariç").
  Sonra ?1 → ?2'yi sırayla açacağım.
```

Format kuralları:

1. **Orantılılık.** Anatomi şablon değil, kalemin ağırlığına göre daralıp genişleyen bir çerçevedir — sorunu ve düzeltmesi tek cümlede anlaşılan kalem **tek satır** kalır, üç alanı zorlama. Zarf da orantılıdır: tek dokümanlı turda manifest düşer, `📄 <yol> (<gerekçe>) — <kip>` başlığı yeter, ID'ler `1, 2, …` olur — tek istisna `excluded N · accepted N`: manifest düşse de tek satır olarak basılır (gerekçe: Adım 1).
2. **Dayanak zorunlu ve kapalı kümedir:** `Template` (eşleşen template dosyası) · `KURAL` (dokümanın kendi `<!-- KURAL -->` yorumu ya da kaynağı olan CLAUDE.md disiplin bölümü — çapa: `CLAUDE.md:satır`; **bölünmüş projede doktrinin tam metni çocuktadır, çapa `_dev/claude/<AD>.md:satır` olur** — parent'taki özet çapa değildir) · `Gerçeklik` (kod / dosya sistemi / git / çekirdek doküman çapraz teyidi) · `Proje-özgü` (template'te karşılığı yok ya da template'ten bilinçli sapma öneriliyor). Her dayanak **çapasıyla** yazılır: `dosya:satır`, template bölüm adı, komut çıktısı veya commit hash'i. Çapa gösterilemiyorsa kalem bulgu değil **sorudur**.
3. **`Proje-özgü` dayanaklı kalem 🔧 kulvarına giremez** — tanımı gereği (kural 2) doğru cevabı ne template ne KURAL söylüyor; seçenekleriyle soruya iner. Kullanıcı "bu öneri template'ten mi geliyor, projeye özel bir yargı mı" sorusunu rapora bakarak cevaplar; formatın kendi kendini denetleyen kenarı budur.
4. **Tarihsel/sistem dokümanında rapor kulvarı (🔧/❓/📁) ayrımı biçim/içerik eksenindedir** — yalnız **içerik-koruyan reformat / protokol-migration** (ve **dondurulmuş** dokümanda `exclude` önerisi) 🔧 kulvarına girebilir, kalem `tarihsel reformat` etiketi taşır. Dondurulmamışta `exclude` kalemi ancak ❓ bölme sorusu reddedildikten sonra doğar — toplu onaya girmez. İçerik hatası, eksik bölüm, bayat bilgi **yalnız-rapordur** → `📁 Tarihsel` slotu. ❓ kulvarı tarihsel dokümana da açıktır ama yalnız **yapısal** kalem için: dondurulmamış bir tarihsel dokümanın (`DECISIONS`) boyut bölmesi buraya girer — biçim kalemi değil, onay gerektiren bir yapı kararıdır. (Kural: Önemli Kurallar → Tarihsel/sistem dokümanları.)
5. **Kalem birimi konum değil nedendir** — aynı kökten doğan üç dokunuş tek kalemin alt maddeleridir; seçici ret onları bölmemeli.
6. **❓ kalemler raporda yalnız başlıktır** (+ `nokta` / `yapısal` ağırlık işareti). Gövdeleri onaydan sonra **sırayla** açılır: bağlam → seçenekler+tradeoff → "önerim X, çünkü Y" → karar bekle (desen: `step-by-step`). Böylece sorulacakların listesi bir arada, soruların kendisi sırayla olur. Kullanıcı bir kalemi "bilinçli böyle" diye kapatırsa cevabı **kalıcılaştırmayı öner** — hedefe tek satırlık `<!-- KURAL: … (bilinçli) -->` yorumu; yoksa cold-start audit aynı soruyu sonraki turda yeniden sorar.
7. **ID'ler efemerdir** — rapor-yereldir, onayda ölür, diske yazılmaz (BULGULAR'ın `B-NNN` numaralarıyla karıştırılmaz).

**Onay:** mekanik kalemler tek turda toplu onaylanır ("tamam" yeterli; istisna numarayla: "D2-1 hariç" / "yalnız D1-1, D3-1"). Bir kalemi açmanı isterse aç, sonra kaldığın yerden devam et. Onaylanmayan kalem uygulanmaz. Ardından soruları sırayla aç.

### Adım 5 — Uygulama (doküman doküman)

Paketi tek blokta değil, **doküman doküman** kapat: düzelteceğin dokümanı baştan sona oku (bu okuma aynı zamanda ajan bulgusunun teyididir — yerinde bulunmayan bulgu düşer), yalnız onaylananı uygula, canvas'ı senkronla, commit'le (Adım 6), sonrakine geç. Kesinti olursa kapanmış dokümanlar kayıtlıdır.

Yapısal işlerde (bölme, atomizasyon, migration) referans bütünlüğünü koru — zincirin kanalları tek evde tanımlı: CLAUDE.md → Boyut ve Bölünme.

Canvas senkronu kulvara göre:

```bash
# S2 (uygunluk) kapandıysa — "tam denetlendi":
python3 .claude/commands/devflow/scripts/audit-canvas.py touch <path>
# S1 boyut kararı ERTELENDİ/REDDEDİLDİ ise (❓ sorusu sorulduktan SONRA), scan'den önce:
python3 .claude/commands/devflow/scripts/audit-canvas.py accept-size <path> --reason "<kullanıcının kararı>"
# S1 (acil) kapandıysa — touch ATMA:
python3 .claude/commands/devflow/scripts/audit-canvas.py reconcile   # bölmeden doğan çocukları kuyruğa al
python3 .claude/commands/devflow/scripts/audit-canvas.py scan        # çözülen urgent'i temizle
```

`touch` = "tam denetlendi", **yalnız S2'de**: S1 kulvarı acil/mekanik işi yaptı, doküman (ve yeni çocukları) uygunluk için kuyrukta kalmalı → sonraki tur(lar)da S2'ye akar. **Cevapsız sorusu kalan dokümana da `touch` atma.**

### Adım 6 — Git Commit & Push

Her doküman **kendi izole commit'ini** alır (denetim düzeltmeleri tek tek geri alınabilsin diye); commit'e yalnız o dokümanın yolları ve **o düzeltmenin zorunlu kıldığı hedefler** — bölmeden doğan çocuklar, kayıt satırları (INDEX/MODULE-MAP, parent pointer'ı), yanlış-ev düzeltmesinin varış dokümanı — + turun kendi canvas artefaktları (`_dev/.audit/canvas.tsv`; script'in kök `.gitignore`'a eklediği canvas satırları (eksik satır varsa her koşuda eklenebilir)) girer. `git add <path>` ile ayır, `git add -A` ile tur dışı kirli dosyaları süpürme. Çapraz düzeltme **hedef dokümanın kendi commit'ini** alır (mesajda tetikleyen tur anılır).

```
docs: audit-docs — [hangi doküman / ne düzeltildi]
```

Turdaki dokümanlar bittiğinde **tek `git push`**. Tetik "düzeltme yaptım" değil, **turun kendi dosyalarında delta olması**dır (denetlenen dokümanlar + canvas artefaktları): düzeltme çıkmasa bile `reconcile`/`scan`/`touch` canvas aynasını yeniden yazabilir, o delta da commit'lenip push'lanır. Turun dosyaları temizse ne commit ne push — ağaçta başka kir varsa paralel oturuma aittir, dokunma (CLAUDE.md → Paralel Oturum Farkındalığı). (Push branch seviyesindedir — önceki turdan push'suz commit kalmışsa bir sonraki push onları da götürür.)

Sonra **dur** — çalıştırma başına bir paket. Sürekli ilerleme `/loop` iledir.

---

## Section 1 — Acil İşleme (urgent dokümanlar)

Buraya `next` gerekçesi `urgent:*` olduğunda gelinir. Acil dokümanlar **kırmızı çizgi** ihlalleridir (örn. ~20k token'ı aşan, tek-okumayı riske atan doküman) — önceliklidir, hemen çözülür. Section 2 (derin uygunluk) **bu doküman için** yapılmaz (`touch` yok → doküman kuyrukta uygunluk-borçlu kalır; Adım 5); paketin `conformance:*` satırları kendi kulvarında **aynı turda** yürür.

> **Bu kulvar kalıcı olmamalı.** Boyut kalemi bu turda çözülmezse doküman burada çakılı kalır — her turda slot yer, `touch` alamadığı için bir daha uygunluk denetimi görmez. Çıkış `exclude` değil `accept-size`'dır (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi).

### Mekanik kontrol listesi

> **Tek kaynak: `.claude/commands/devflow/lib/audit-mekanik.md`.** Bu listeyi **Read ile oku** — S1 kulvarına gelen her doküman için geçerlidir, Section 2 de (`lib/audit-conform.md` Adım 0) aynı dosyayı okur. Ayrı dosyadır çünkü iki çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). Burada tekrarlanmaz.

İçindekiler (yönelme için; ölçütler dosyada): boyut kırmızı-çizgisi + `accept-size` kaydı · placeholder sızıntısı · kırık dosya referansı (bölme çocuğunun iki yönü + `_dev/claude/` doktrin çocukları) · soft-delete kalıntısı · INDEX kapsamı · kümülatif tek-değer alanları · index↔atom bütünlüğü.

### Akış

1. **Oku + teşhis et** (`lib/audit-mekanik.md`). Doğru-cevabı-belli olanlar 🔧 mekanik kalem; yapısal olan bölme ❓ sorudur — bölme sorusunda alt-doküman adlarını öner ve içeriğin taşınacağını (kopya değil; parent özet+pointer tutar, çocuk `←` geri-linki alır, kayıt role göre yapılır) söyle. **Kök `CLAUDE.md` bunun dışındadır:** kesim ve dört çocuğun adları motorda sabittir, **ad önerilmez** — soru "bölelim mi" sorusudur; hâl ayrımı ve tarif `.claude/commands/devflow/lib/claude-md-bolme.md`'dedir — **önce `_dev/claude/` klasörüne bak**: klasör yoksa proje hiç bölünmemiştir, soru "bölelim mi"dir ve dosyayı onaydan sonra Adım 5'te Read et; klasör varsa bölme yarıda kalmıştır ve dosyayı **rapordan önce** Read et — kalemin ağırlığını ve kesildiği adımı oradaki Hâl ayrımı belirler.
2. **Bulguları Adım 4'ün paket raporuna kat** → onay → **Adım 5** (uygulama; S1 kulvarında `touch` ATILMAZ) → **Adım 6** (commit & push).

---

## Önemli Kurallar

- **Önce raporla, onay al, sonra uygula.** audit tarar ve **önerir**; kullanıcı onaylamadan hiçbir dosyayı değiştirmez. **Neden:** double-check oturum sonunda, o oturumun bağlamıyla çalışır — neyin yeni/yanlış olduğunu bildiği için mekanik düzeltme güvenlidir. audit ise **sıfır oturum-hafızasıyla, baştan** tarar; "drift gibi görünen" bir şey bilinçli bir tercih olabilir. Cold-start + geniş kapsam = "emin olamam, sormalıyım".
- **Proje-genişlikli kapsam, artımlı yürütme** — double-check yalnızca o oturumun değişikliklerini kontrol eder; audit **tüm yaşayan dokümanları** kapsar ama canvas sayesinde **bir oturumda hepsini taramak zorunda değildir** — kuyruk kaldığı yerden devam eder, hiçbir doküman atlanmaz, hiçbiri gereksiz yere iki kez taranmaz.
- **Auto-fix yok** — script seçer ve mekanik tespit eder (READ-ONLY); her düzeltme senin yargın + kullanıcı onayıyla yapılır.
- **Tarihsel/sistem dokümanları** (`tasks/archive/`, `bulgular/archive/`, PHASES.md'de ✅ işaretli `PHASE-N.md` (+ bölme çocukları), `DECISIONS.md`, `TASKS-README.md`): bunlar Section 2'de ele alınır — **içerik-koruyan reformat** dışında düzenlenmez (detay: `lib/audit-conform.md`). **Rapor kulvarı ayrımı S1/S2'den bağımsızdır** (Adım 4 → kural 4): S1'e düşen tarihsel dokümanda da içerik denetimi yapılmaz — 🔧'e yalnız biçim kalemi (içerik-koruyan reformat / protokol-migration) ve **dondurulmuş** dokümanda `exclude` önerisi girer, içerik bulgusu `📁 Tarihsel`'de yalnız-rapordur. **Tarihsel doküman `urgent:token-hard` olursa iki ayrı sınıf vardır ve ayıran şey bölmenin kapanıp kapanmadığıdır** (kanon: CLAUDE.md → Boyut ve Bölünme → *"Tarihsel doküman **yaşarken** bölünür"* — bölme yasağı orada tanımlı ve **kapsamı tamamlanmış faz dokümanıdır**, tüm tarihsel sınıf değil). Bölmeyi kapatan iki hâl vardır: **faz-dondurma** (PHASES.md'de ✅) ya da dokümanın **kapanmış-kayıt** niteliği (`archive/*` — birikmez, bölünecek gövdesi yoktur). CLAUDE.md → Tarihsel/append-only kuralının **içerik-dondurması** bunlardan ayrıdır ve tek başına kabı değiştirmeyi engellemez:
  - **Dondurulmuş** (PHASES.md'de ✅ işaretli `PHASE-N.md` + bölme çocukları, `tasks/archive/*`, `bulgular/archive/*`): bölme **yasak** — faz ✅ olduktan sonra bölmek "tarihsel dokümana dokunma" kuralıyla çelişir. İçerik-koruyan reformat eşiğin altına indirmediyse çözüm **`exclude` ile kalıcı kapatma**: `python3 .claude/commands/devflow/scripts/audit-canvas.py exclude <path>` (geri almak gerekirse: aynı script `include <path>`). Aksi halde doküman her audit turunda tekrar S1'e dispatch edilir — kuyrukta çakılı kalır. (Bu durum yalnızca önleyici tetikten önce büyümüş eski fazlar için kalır: artık `verify-phase`/`review-phase` faz dondurulmadan ÖNCE bölme/temizliği tetikler — `exclude` bu eski-borç için güvenlik ağıdır, varsayılan yol değil.)
  - **Hiç dondurulmayan** (`docs/DECISIONS.md` — hiçbir zaman ✅ olmaz, append-only olarak büyümeye devam eder): **bölme yasak değildir, `exclude` de varsayılan değildir.**
    - **Bölme burada içerik-koruyandır** — kayıt, sıra ve anlam korunur, değişen yalnız kaptır (taşı→sil + parent'ta kendi kendine yeten özet/index + çocukta `←` geri-linki; kanal: CLAUDE.md → Boyut ve Bölünme). Yapısal olduğu için **❓ soru kulvarına** girer, açık onayla uygulanır.
    - **Kesim ölçüsü boyuttur** — aralık/dönem yalnız etikettir: her çocuk kırmızı çizginin **altında** doğmalı, aksi halde aynı turda yeniden bölünecek bir borç olarak doğar.
    - **Bölme tek seferlik bir işlem değildir** — parent aktif seriyi tutar ve yeni kararlarla yeniden dolar. Ayrı bir tetik gerekmez: parent da her turda `scan`'den geçer, eşiği yeniden aşınca aynı kural işler ve kapanmış aralık yeni bir arşive mezun edilir.
    - **Giriş noktası parent'ta kalır** (pointer index'i) — DECISIONS'ı okuyan adımlar (`review-phase`'in `Superseded` araması, `audit-product`'ın bilinçli-tercih süzgeci) aranan kaydı oradan çocuğa izler.
    - Kullanıcı bölmeyi **reddeder ya da ertelerse** kayıt `exclude` değil **`accept-size`**'dır: doküman yaşamaya devam ediyorsa uygunluk denetiminden düşmemelidir (`exclude` onu tüm kuyruklardan çıkarır ve konvansiyon göçünü de durdurur). İkisi de borç kaydıdır, çözüm değil — ama `accept-size` yalnız boyut borcunu susturur, `exclude` dokümanın tamamını.
  - `tasks/TASKS-README.md` bu ayrımın dışındadır: birikimli bir kayıt değil **çekirdek protokolün kopyasıdır**, boyutu motor template'inden gelir (projede büyümez, proje-özel ekleme de yasaktır → CLAUDE.md → Dokunulmaz Dokümanlar). Projede bölünmez; ele alınışı protokol-migration/içerik-koruyan reformat kulvarındadır.
- **Çapraz bulgu — tur dışındaki dokümanda görülen hata.** Denetlenen dokümanı doğrularken **zaten bağlamda olan** bir dokümanda (protokol çekirdeği, eşleşen template, iddiayı sınamak için açtığın referans) **kanıtlanabilir** bir yanlış görürsen sessiz geçme: rapora `🔗 Kapsam Dışı Borç` kalemi olarak yaz (format: Adım 4). **Aramaya çıkma:** o doküman üzerinde mekanik liste/template karşılaştırması çalıştırılmaz, `doc-scan.sh` koşulmaz — o, onun kendi turudur; kanıtsız izlenim ("şu da elden geçse iyi olur") kalem olmaz. Kullanıcı **kalem başına** karar verir: **(a) şimdi düzelt** — yalnız **tek hamlelik** düzeltme (tek satır/alan/link; yeni dosya, bölme, bölüm taşıma veya üçüncü bir dokümana dokunma gerekiyorsa tek hamle değildir), hedefin **kendi izole commit'inde**, **`touch` ATMA** (düzeltme hash'i değiştirir → doküman kendiliğinden `conformance:changed` olarak kuyruğa döner, sırası gelince tam denetlenir); **(b) kuyruğa al** — `python3 .claude/commands/devflow/scripts/audit-canvas.py invalidate --filter '<path>'`; **(c) bilinçliyse dokunma**. Aynı dokümandan ikiden fazla kalem birikiyorsa doğru cevap (b)'dir — o dokümanın kendi turu gerekiyor demektir. **Yasak bölge:** tarihsel/sistem dokümanları, `exclude`'lı dokümanlar ve DECISIONS/ILKELER **içeriği** çapraz düzeltme almaz — yalnız rapor + rota (`review-phase` / `prd-review`); `exclude`'lıda (b) de işe yaramaz (kuyruğa dönmez), tek yol rapordur.
  - **Ayrım — `exclude`'ın kendisi:** yasak olan `exclude`'lı dokümanın *içeriğine* dokunmaktır. `exclude`'ın hâlâ geçerli olup olmadığı ayrı bir kalemdir; rotası Adım 1'dir (`include` ile kuyruğa dönüş) ve bu blok ona yalnız **slot** verir — çapraz-bulgu kuralları (aramaya çıkma yasağı, tek-hamle sınırı) onu bağlamaz.
- **Lazy template/Section 2 okuma** — Section 2 talimatını (`lib/audit-conform.md`) yalnızca uygunluk dokümanı dağıtıldığında ve **tur başına bir kez** Read et. Template'lerde lazy = *toplu değil, tek*: S2'ye dağıtılan dokümanın **eşleşen template'i her zaman okunur** (S2 Adım 1 — koşulsuz); okunmayan yalnız eşleşmeyen diğer template'lerdir.
- **Mekanik metrikler kesin kural değildir** — boyut bayrağı işaret fişeğidir, mahkûmiyet değil; gerçekten şişmiş mi, meşru birikim mi, yoksa gerçek içerik büyümesi mi diye eleştirel oku (üçlü teşhis: `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi).
- **Varsayımda bulunma** — kafanın karıştığı her şey soru olur; şüpheli durumda kullanıcıya sor.
- **Doküman başına commit, tur başına tek push** — mesaj formatı ve staging disiplini Adım 6'da. Turun kendi dosyaları temizse ikisi de yok.
- **Kod kalitesi ve ürün davranışı audit-docs'un kapsamı dışı** — faz penceresinde onlar için `verify-phase`, `review-phase` ve `simplify`, proje-geneli ürün denetimi için `audit-product` var (ikiz ayrım: audit-docs dokümanları denetler, audit-product ürünü — bulgularını `_dev/BULGULAR.md` kanvasına yazar). Bu kural kodu **okumayı** yasaklamaz: doküman-iddiasını gerçekle sınamak için salt-okunur kod incelemesi (Read/grep) her kategoride serbesttir — kod asla değiştirilmez, kalitesi yargılanmaz.
