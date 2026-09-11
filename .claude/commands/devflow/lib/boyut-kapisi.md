# DevFlow — Faz Dokümanı Boyut Kapısı (boyut-kapisi)

> **Bu dosya doğrudan çağrılmaz** ve **lazy okunur** — boyut kapısına gelindiğinde, çağrı başına bir kez. **Dört çağıranı vardır** — kanonun saydığı iki önleyici kulvar (kanon: CLAUDE.md → Boyut ve Bölünme): **faz döngüsü** (`research-phase` Adım 4b · `verify-phase` Adım 6b · `review-phase` Adım 5b, hedef `_dev/phases/PHASE-N.md`) ve **PRD döngüsü** (`prd-refine` Adım 2, hedef o oturumda dokunulan PRD dokümanı). Ayrı dosyadır çünkü dört çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). Teşhis, kulvar, kayıt ve zamanlama **tek yerde** tanımlıdır — çağıran dosyalarda tekrarlanmaz.

**Neden önleyici:** faz dokümanı `review-phase` Adım 6'da ✅ ile **dondurulur**; ondan sonra bölme "tarihsel dokümanına dokunma" kuralıyla çelişir. Bu yüzden üç faz kapısı da fazı **hâlâ aktifken** ölçer ve son pencere review'dadır — **ama bu hüküm bu kapının kendi dört çağıranı içindir.** ⚠️ **Fazı donduran ikinci bir yol daha var ve bu kapı onu BİLİNÇLE kapsamaz:** `prd-review`'ın erken-sonlandırma arşivlemesi de dondurur (`⚠️ Erken sonlandırıldı`; yazıcıları `templates/PHASE.md` → Durum KURAL'ı sayar). Orada beşinci bir çağıran **yoktur ve gerekmez** — o yol iki ağla kapalıdır: dokümanı tek okumada getiremeyen oturum kalemi kapanış bloğuna düşürür (`templates/claude/CALISMA-PRENSIPLERI.md` #10.4, rota `audit-docs` — `prd-review` o satırı zaten koşulsuz yazar), denetim tarafında da kaydın evi `lib/audit-kurallar.md` → Dondurulmuş'tur (`accept-size`, ilk `audit-docs` turunda). PRD kulvarında böyle bir dondurma yoktur — oradaki gerekçe farklı: **PRD versiyon ortasında donuktur**, yani dokümanı büyüten oturum onu küçültebilecek son oturumdur (`prd-refine` yalnız kickoff öncesi ve yeni versiyon tanımında yaşar).

---

## 1. Ölç

```bash
bash .claude/commands/devflow/scripts/doc-scan.sh <doküman>
```

`<doküman>` çağırana göredir: faz kapılarında `_dev/phases/PHASE-N.md`, `prd-refine`'da o oturumda dokunulan PRD dokümanı. Tetik, script'in kendi **BAYRAK** sütunudur — göz kararı değil: **yalnız `TOKEN-SERT`** (kırmızı çizgiyi **aştı**) → teşhise geç. Sütunun geri kalanı bu kapının girdisi **değildir**: `token-rahat` bandı (aşağıdaki kural) da, `satır` ve `uzun-satır(L…)` bayrakları da. **Çizgi aşılmadıysa bu adımda iş yoktur**; ölçüm bir sonraki kapıda tekrarlanır (§6).

⚠️ **ÇİZGİNİN ALTINDA BOYUT İŞİ YOKTUR — ve "altında kalmak için kısalt" bir çare değildir** (kullanıcı kararı, 2026-09-03; kanon: CLAUDE.md → Boyut ve Bölünme). Doküman çizginin hemen altında dursa bile gereken içerik **önce yazılır**; çizgiyi aşarsa çare **§2'nin teşhisine göre** belirlenir — üç teşhisten yalnız biri bölmedir. Önleyici sıkıştırma, erken bölme ve "pay kalsın diye" budama bu kapının çıktısı değildir — motorun bölme kuralları tam da bunların yerine vardır. Bu, ölçümü değil **hükmü** daraltır: `doc-scan` bantlarını basmaya devam eder, bu kapı yalnız `TOKEN-SERT`'i okur.

**Ölçüm yine her kapıda tekrarlanır, çünkü doküman bu kapıdan sonra da büyür:** `verify`'dan sonra UAT tablosu ve düzeltme task'ı satırları, `review`'dan sonra retrospektif · kalite kontrol · `✅` damgası ve varsa mezuniyet satırı gelir (§5 bunların commit-anına düşen kısmını adıyla sayar). Tekrar eden ölçüm aşımı **aştıktan sonraki ilk kapıda** yakalar ve o an bölme hâlâ meşrudur — erken davranmanın kazancı yoktur. **Tek pencere farkı `review`'dadır:** aşım Adım 6'nın `✅` damgasından **sonra** doğarsa bölme yasaklanmıştır ve kayıt `accept-size`'dır (§5) — bu bir kayıp değil, çizginin hemen üstünde donmuş bir dokümanın olağan kaydıdır.
⚠️ **Erteleme meşrudur ve çıkmaz DEĞİLDİR — bir pencere hariç.** `research` ve `verify` kapılarında ertelenen bölme kayda geçer (§3 → erteleme kaydı; kaydın evi §4'ün ikili kaydıdır) ve **ölçüm bir sonraki kapıda tekrarlanır** (§6). Bu kapıya gelinmişse doküman zaten çizginin üstündedir — "eşik altında ertelenen kalem" hâli bu kapıdan doğmaz. Ama **`review` son pencere OLABİLİR:** Adım 6 `✅` damgalarsa doküman donar ve orada ertelenen **bölme** bir daha yapılamaz; damgalamazsa (Adım 7 kapsam-içi düzeltme task'ı ürettiyse `Durum` `🔄` kalır) pencere kapanmaz ve ölçüm bir sonraki faz kapısında tekrarlanır — **faz o aralıkta erken sonlandırılmadıysa** (giriş paragrafı). Kalem çıkışsız kalmaz — kalan doluluğun kaydı `accept-size`'dır ve zamanı çağıranın Commit & Push adımıdır (§5); kapıda erken çağrılırsa düşer ve **o kayıt boşa gider**, yeniden verilmesi gerekir (kilit değil, tekrar — §5). Uyarı **yalnız o pencereye** ve yalnız **bölme** seçeneğine aittir. **PRD kulvarında** (`prd-refine`) bu fıkra hiç işlemez: orada faz dondurması yoktur ve dokümanı büyüten oturum onu küçültebilecek son oturumdur (yukarıdaki gerekçe).

## 2. Teşhis — üçlü (kanon: CLAUDE.md → Boyut ve Bölünme)

| Teşhis | Ne demek | Çözüm |
|---|---|---|
| **Gerçek büyüme** | içerik gerçekten arttı | `<PARENT>-<EK>.md`'ye **böl** (aşağıdaki kesim kuralı) |
| **Şişme** | yanlış-ev bilgisi sızmış | **temizle** — doğru evine taşı |
| **Meşru birikim** | disiplin ihlali yok, içerik gerçekten bu kadar | supap yoksa **geçici doluluk bilinçle kabul edilir** ve raporlanır — çıkmaz ilan edilmez |

**Şişmenin çağırana göre tipik hâli** (örnektir, kapalı liste değil): research'te araştırma çalışma notu ya da kod dökümü Araştırma Bulguları'na sızmışsa → doğru ev `_dev/docs/`; verify'da icra detayı ya da çalışma notu Task Listesi'ne sızmışsa → `tasks/TASK-N.md`; review'da icra detayı Task Listesi'nde kalmışsa ya da task-spesifik nüans Retrospektif dışına taşmışsa → retrospektifin kendi alt bölümü; `prd-refine`'da oturum notu ya da versiyon tartışması feature dokümanına sızmışsa → `PRD/SESSION-NOTES.md` / `PRD/VERSIONS.md`. **`VERSIONS` · `SESSION-NOTES` · `NOTES` bölünmez** (kanon: Bölünmeyen dokümanlar) — orada teşhis her zaman şişme ya da meşru birikimdir.

## 3. Kulvar — sorulur mu, uygulanır mı?

Kulvarı **CLAUDE.md → Onay Ölçütü** belirler, "yapısal" etiketi değil (proje kanonu o ölçütü henüz taşımıyorsa hükmü `audit-docs` → Kulvarın tabanı verir; o kuralın *hüküm* yarısı komuttan bağımsızdır, *eylem* yarısı audit'e özgüdür):

- **Şişme temizliği/mezuniyet** ve **kesimi kurallı bölme** kap işlemidir — **sorulmaz, yapılır ve raporlanır** (tek satır: ne, nereye, hangi çapa).
- **Kesim kurallıdır ancak** dokümanın kendi `##` bölüm sınırlarından geçiyor **ve tek sonuç veriyorsa**: en az iki `##` sınırı gerekir ve parent'ta gövde kalmalıdır. Bölümleri kendin gruplaman, alt-başlıkları (`###`) gruplaman, dokümanda geçmeyen bir ad icat etmen ya da eşit derecede geçerli birkaç kesim arasından seçmen gerekiyorsa kesim kurallı **değildir** → kalem **sorudur**.
- **Kesimden sonra parent'ı VE çocuğu birlikte ölç** (`bash .claude/commands/devflow/scripts/doc-scan.sh <parent> <çocuk>`): tek kesim aşımı kapatmayabilir — çocuk hâlâ `TOKEN-SERT` ise kalem kapanmamıştır. Çocuğun kendi `##` anatomisi kurallı ikinci bir kesime izin veriyorsa aynı turda uygula; vermiyorsa kalem **sorudur** (yukarıdaki dal). Bu, kapanışı ilan eden ölçütün kendisini sınamaktır; yazılmazsa bölme "yapıldı" sayılır ve çocuk sessizce kalıcı bir S1 kalemi olarak doğar. ⚠️ **Çocuk için kabul gerekiyorsa önce `reconcile`** — bölmeden doğan yol kanvasta yoktur ve `accept-size` onu *canvas'ta yok* diye reddeder (ölçüldü, `exit=1`). Kanvas koşulu burada da ŞART (gerekçe §6'nın ikinci maddesi): `[ -f _dev/.audit/canvas.tsv ] && python3 .claude/commands/devflow/scripts/audit-canvas.py reconcile`
- Bölmenin biçimi kulvara göre farklı **evde** yazılıdır, kuralı aynıdır: **ad eki parent'ın casing'ini izler** (yapısal dokümanlarda BÜYÜK), parent'ta self-yeten özet + pointer kalır, çocuk `← <parent> · <tip>` geri-linkiyle başlar. Faz kulvarında ev `templates/PHASE.md`'nin KURAL yorumudur; PRD kulvarında kanonun kendisi (CLAUDE.md → Boyut ve Bölünme).

**Önce erteleme kaydına bak:** hedef dokümanda bölmeyi erteleyen bir `<!-- KURAL: … (bilinçli) -->` kaydı varsa kalemi yeniden açma — ne soru olarak ne uygulama olarak; raporda tek satırla an. **Kayıt YOKSA ve ölçüm kırmızı çizgiyi aştıysa şimdi çöz** — tetik eşiği §1'dekiyle aynıdır, kaydın yokluğu onu ne daraltır ne genişletir.

## 4. Kayıt — kaydı yazan bu adımdır

Soru reddedilirse, ya da uygulanan bölme geri istenirse, kararı **aynı hamlede** kaydet. **İki ayrı kayıt vardır ve birbirinin alternatifi değildir** (tam metin: CLAUDE.md → Onay Ölçütü → **Kaydın evi**):

- **Kap kararı** — "bölme ertelendi / reddedildi / geri alındı" → **hedef dokümana** tek satırlık `<!-- KURAL: … (bilinçli) -->`. Hash'e bağlı **değildir**; ilk düzenlemede düşmez. **Kap kararı hiç doğmadıysa bu yorum YAZILMAZ** — ortada reddedilmiş bir bölme yokken yazmak verilmemiş bir kararı kaydeder ve dokümana kalıcı bölme bağışıklığı verir (meşru-birikim hâlinin tek kaydı boyut kabulüdür).
- **Boyut kabulü** — "kalan doluluk kabul edildi" → `accept-size`. Yalnız doküman **kırmızı çizginin üstündeyse** yazılır; yazılmazsa doküman her audit turunda S1'e düşer, `touch` alamaz ve bir daha uygunluk denetimi görmez (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi).

Yazan olmazsa bu kontrol **ölü harf kalır**: aynı faz dokümanı research/verify/review'da üç kez ölçülür ve kayıt olmadan aynı soru üç kez sorulur.

(Aynı ikili kayıt parent `CLAUDE.md`'nin bölmesinde de geçerlidir — `lib/claude-md-bolme.md` → Hâl ayrımı. Boyut kabulünün **altı giriş yolu** ve gerekçe metninin kaynağı: `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi; **bu dosyanın dört kapısı da o listenin altıncı yoludur** — "önleyici kapı", faz döngüsü ve PRD döngüsü.)

## 5. `accept-size`'ın zamanı — bu adımda DEĞİL, çağıranın commit adımında

Kabul **verildiği andaki içerik hash'ine** bağlıdır, ve bu kapıdan sonra hedef dokümana daha yazılır: verify'da Adım 7 düzeltme task'ı çıkarsa UAT tablosunun ❌ satırına `→ TASK-X.YY` **ve** Task Listesi'ne ⬜ satırı (yalnız CI'dan doğan task'ta ❌ satırı olmayabilir — o hâlde tek yazım ⬜ satırıdır), review'da Adım 6 `**Durum:** ✅` damgası ve varsa mezuniyet satırı — düzeltme task'ı çıktıysa review'ın Adım 7'si de Task Listesi'ne ⬜ satırı —, `prd-refine`'da Adım 3'ün versiyon tartışması ve Adım 4'ün "güncellenen dokümanları yaz" adımı. Burada çağrılan kabul o yazımla **düşer** (`scan`: *kabul DÜŞTÜ*) ve doküman commit'e `urgent` olarak girer. Review'da bu ayrıca **geri alınamaz** bir pencere kapanışıdır: ✅ damgası dokümanı dondurmuştur, yani bölme de artık yasaktır. **Ama çıkmaz DEĞİLDİR** — ölçüldü ve yeniden üretildi: damgadan **sonra** çağrılan `accept-size` başarıyla koşar (`exit=0`) ve dokümanı prio-0'dan çıkarır. Çıkış `exclude` değil `accept-size`'dır; kaybedilen tek şey bölme seçeneğidir, denetim kulvarı değil. **Ayrımın tek evi `lib/audit-mekanik.md` → Boyut kırmızı-çizgisi'dir:** boyut kulvarının çıkışı her sınıfta `accept-size`'dır; `exclude` bu kulvarın yedeği değil, kullanıcının dokümanı denetim dışına alma kararıdır. Kapıda erken çağrılan kabulün bedeli **bir kabul kaydının boşa gitmesidir**, dokümanın kilitlenmesi değil.

Bu yüzden **bu adımda yalnız kabulün gerekli olduğunu ve gerekçesini tespit et**; komutu çağıranın **Commit & Push adımının ilk işi** olarak çalıştır — o an doküman son hâlini almıştır ve kabul ona bağlanır. ⚠️ **`review-phase`'de o ölçüm KOŞULSUZDUR** — bu kapı dokümanı çizginin altında bulup hiçbir kalem devretmemiş olsa bile Adım 8 yeniden ölçer: aşımı Adım 6'nın damgası doğurmuş olabilir ve o hâlde kaydı yazacak başka bir yer yoktur (devir koşuluna bağlanan bir ölçüm o dokümanı hiç görmez). Faz kulvarının diğer iki kapısında (`research` · `verify`) ölçüm bu kapının devrettiği kaleme bağlıdır — orada doküman dondurulmaz ve aşım bir sonraki **faz** kapısında yakalanır; bu kulvarın son kapısı `review`'dır ve orası koşulsuzdur — **erken sonlandırma bu vaadi keser** (faz `review`'a hiç gelmeden donar; ağları giriş paragrafındadır). **PRD kulvarında sonraki kapı yoktur** (bu dosyanın giriş paragrafı: dokümanı büyüten oturum onu küçültebilecek son oturumdur): `prd-refine` Adım 3/4'te doğan aşımı bu koşum yakalayamaz, kalemi bir sonraki `audit-docs` turu S1'de görür. ⚠️ **Orada bölme her hedefte serbest değildir:** `VERSIONS` · `SESSION-NOTES` · `NOTES` bölünmez (§2), yani teşhis oralarda şişme ya da meşru birikimdir ve kayıt `accept-size`'dır; bölünebilen tek hedef feature/esnek içerik dokümanıdır. Kayıp yoktur, gecikme vardır.

```bash
bash .claude/commands/devflow/scripts/doc-scan.sh <doküman>   # son hâli ölç
# Kanvas koşulu ŞART — gerekçe §6'nın ikinci maddesinde:
[ -f _dev/.audit/canvas.tsv ] && python3 .claude/commands/devflow/scripts/audit-canvas.py accept-size <doküman> --reason "<kullanıcının kararı | teşhisin sonucu>"
```

`<doküman>` §1'dekiyle aynıdır. Oturumda birden çok doküman eşiği aştıysa her biri için ayrı ölçüm + ayrı kayıt — kabul doküman başınadır.

Adım numaraları: `research-phase` → Adım 7 · `verify-phase` → Adım 9 · `review-phase` → Adım 8 · `prd-refine` → Adım 5. Kabul yazıldıysa `_dev/.audit/canvas.tsv` de değişir ve **o commit'e girer**; ayrı commit atma.

## 6. İki özel hâl — ikisinde de kayıt gerekmez

- **Doküman eşiğin altındaysa** `accept-size` çağrılamaz: script boyut aşımı olmayan dokümanı reddeder. Kabul edilecek bir aşım yoktur; ölçüm bir sonraki kapıda tekrarlanır. Bir kap kararı verildiyse tek kayıt KURAL yorumudur.
- **Canvas bu projede hiç kurulmamışsa** (`audit-docs` hiç koşmamış) **komutu hiç çağırma** — yukarıdaki `[ -f _dev/.audit/canvas.tsv ]` koşulu bunun içindir. Kayıt zaten gerekmez (ortada tutulacak bir denetim slotu yoktur; ilk `audit-docs` turu dokümanı `reconcile` ile kuyruğa alır ve boyutu orada yeniden ölçülür), ama **çağrının kendisi zararsız değildir:** komut "canvas'ta yok" deyip hata verse bile `_dev/.audit/canvas.db`'yi, kök `.gitignore`'a canvas satırlarını ve — prettier'lı projede — `.prettierignore`'a motor muafiyetini yazar (`audit-canvas.py` → `connect` + `ensure_gitignore` + `ensure_prettierignore`, komut gövdesinden önce koşar; ölçüldü). Hepsi kullanıcının istemediği kurulum artığıdır — aynı hüküm: `kickoff-verify` Adım 3 → kanvas maddesi · README → Güncelleme — ve kap deltaları bu turun faz commit'ine sessizce girer. Raporda tek satırla an.

---

Bu bir **doküman-hijyen** adımıdır: kaynak kodu ve test davranışını değiştirmez, "review/UAT sırasında kod değiştirme" kurallarıyla çelişmez.
