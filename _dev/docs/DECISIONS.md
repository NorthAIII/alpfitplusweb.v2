# DECISIONS — Karar Günlüğü

**Amaç:** Önemli mimari ve tasarım kararlarının kaydı. "Neden X yerine Y tercih edildi?" sorusunun cevabı burada.
**Ne zaman güncellenir:** Önemli bir teknik, mimari veya tasarım kararı alındığında.

> İddia sınırı (ne söylenir, ne söylenmez) burada değil → `CLAIMS.md`. Tasarım kuralları → `STYLE-GUIDE.md`. Buradaki kayıtlar onların **üzerine** gelen tercihlerdir.

<!-- KURAL: Bu günlük append-only'dir — yazılmış bir karar silinmez, düzeltilmez. Geçersizleşen karar YENİ bir kararla geçersiz kılınır. -->

**Kapanan aralıklar (arşiv):**

- [`DECISIONS-2026-09-10..2026-09-13.md`](DECISIONS-2026-09-10..2026-09-13.md) — kuruluş dönemi, 22 kayıt: dil (yalnız Türkçe), fiyat sunumu, fotoğraf ve görsel ton, chatbot sırası, modül yapısı, rakip adsızlığı, faz sırası, Vercel ortam modeli, analitik (Umami), lead hedefinin ilk iki tur kararı, Vitest, alıcı provası, e-posta kaynağı.

<!-- KURAL: Doküman kırmızı çizgiyi (~20k token) aştığında EN ESKİ kapanan aralık `DECISIONS-<ilk>..<son>.md`'ye taşınır ve buraya tek satırlık pointer düşer; kayıt, sıra ve anlam korunur (içerik-koruyan bölme). Giriş noktası HER ZAMAN bu dosyadır — kararı arayan adım (review-phase'in `Superseded` araması, audit-product'ın bilinçli-tercih süzgeci) buradan çocuğa izler. Kanon: CLAUDE.md → Boyut ve Bölünme. -->

---

## Kararlar

<!-- Her yeni karar aşağıdaki formatta en üste eklenir (en yeni en üstte) -->

### 2026-09-23 — Onay e-postasının alıcısı doğrulanmıyor: adres başına tavan + selamlamadaki serbest metnin kaldırılması

**Bağlam:** TASK-2.07 (B-059) talep sahibine onay e-postasını açtı. Faz 2'nin kabul testi (senaryo 26, 2026-09-23) uçta şunu ölçtü: e-posta, **istek gövdesinde yazan her biçimsel geçerli adrese** gidiyor, doğrulanmış `alpfitplus.com` göndericisinden çıkıyor ve selamlamada istek sahibinin 120 karakterine kadar metnini taşıyor. Sınırlayan kapılar ölçüldü — IP başına 10 dk / 5 istek (6. istek `429`), bal küpü, onay kutusu — ama **adresin sahipliğini gösteren kapı yok**. Zarar içerik değil, gönderici itibarı ve istenmeyen posta. `isValidEmail`'i sıkılaştırmak çözüm değil: gevşekliği bilinçli (B-021/TASK-1.12) ve sorun biçim değil sahiplik.

**Seçenekler:**
1. **Adres başına tavan** — aynı alıcıya belirli bir pencerede en fazla N onay. Akışa dokunmaz; hacmi kırpar, kapatmaz.
2. **Selamlamadaki serbest metni kaldır** — istek sahibinin yazdığı metin alıcıya hiç ulaşmaz; e-posta yine gider. Kötüye kullanımı **içeriksiz** bırakır.
3. **Onayı ikinci adıma bağla** (çift katılım) — e-posta yalnız doğrulama bağlantısına tıklanınca gider. En sağlamı; yeni durum, saklanan jeton ve yasal metin revizyonu getirir, dönüşüm yoluna dokunur.

**Karar:** **1 + 2 birlikte; 3 reddedildi.** Tavan **24 saatte 3** onay e-postası, anahtar `email.trim().toLowerCase()` (`api/demo/route.ts` → `confirmCapped`). Onay metni artık **parametre almaz** (`content/mail.ts` → `text` sabit bir dizge, `Merhaba ${name},` → `Merhaba,`). Tavana takılan gönderim kayda `skipped` yazar — `notify_lead` kümesi **büyütülmez** (alan adı geçişinde v1 ile aynı koleksiyon okunacak). Ziyaretçinin gördüğü yanıt, kayıt ve ekip bildirimi **hiç değişmez**.

**Gerekçe:**
- **Tek başına hiçbiri bulguyu kapatmıyordu.** 1 tek başına saldırganın **kendi yazdığı metni** üçüncü bir adrese tavan kadar göndermesine izin verirdi; 2 tek başına gönderici itibarını yiyen hacmi hiç kırpmazdı. Bedeli üç dosya ve **sıfır akış değişikliği**, yani ikisini birden almamak için bir gerekçe yok.
- **3 ILKELER'in 1. ekseniyle (Dönüşüm) doğrudan çatışıyor.** Saklanan jeton yeni bir kişisel veri alanıdır ve M3 F3.2'nin kalıcı koruma kriterini (aynı turda yasal metin revizyonu) ateşler; pilot aşamadaki bir tanıtım sitesinin bugünkü hacmiyle orantısız. Kapanmayan artık — adres sahipliğinin **gerçekten** doğrulanması — bu seçenekte durur ve ihtiyaç doğarsa kendi bulgusuyla açılır.
- **Metnin parametresiz olması biçimsel bir kapıdır.** Parametre yoksa enjekte edilecek yer de yoktur; kişiselleştirmeyi geri isteyen her değişiklik aynı soruyu yeniden açar ve bunu kod yorumunda yazılı bulur.
- **Sayaç `HITS`'in ölçülmüş kusurlarını tekrarlamaz** (B-037 k.2): reddedilen deneme sayaca yazılmaz, harita dolduğunda `clear()` ile herkesin sayacı silinmez. **Bilinen sınırlar, bilinçle:** sayaç bellek içi ve örnek başınadır (`HITS` ile aynı tercih) ve alt-adresleme (`ad+etiket@…`) normalleştirilmez — o normalleştirme farklı iki **gerçek** adresi aynı sayaca koyup meşru bir onayı düşürebilirdi; kalan yüzey 2 sayesinde içeriksizdir.
- **Yasal metin değişmedi ve gerekçesi yazıldı** (M3 F3.2): yeni hedef, kayda yeni alan ve yeni sağlayıcı yok; adres yalnız sunucunun geçici belleğinde tutuluyor. Metnin IP paragrafının öznesi *"IP adresiniz"*dir, İşleme amaçları listesi zaten *"aynı adresten gelen talep sayısını sınırlamak"* diyor — hiçbir yaşayan cümle yanlışlaşmıyor.

**İlgili Task/Faz:** Faz 2 — TASK-2.21 (`tasks/archive/TASK-2.21.md`), UAT senaryo 26 (`phases/PHASE-2-UAT.md`)

---

### 2026-09-23 — Yasal metin aktarımı olgu olarak yazar: dört tedarikçinin ülkesi sayılır, hukuki dayanak hukukçuya bırakılır

**Bağlam:** 2026-09-22 «Ölçüm sunucusu ham IP tutuyor…» kararı metnin ne diyemeyeceğini sabitlemişti; ne **diyeceği** TASK-2.17'ye kalmıştı. Aynı turda aktarım maddesinin olgu tarafı da yazıldı. Ölçüm dört tedarikçinin dördü için de kaynağından yapıldı (döküm: `tasks/archive/TASK-2.17.md`).

**Karar:** Metin aktarımı **koşullu ihtimal olarak değil olgu olarak** anlatır (`aktarılabilir` → `aktarılır`) ve tedarikçi listesi her kalemin **rolünü ve verinin işlendiği ülkeyi** söyler; liste 3 → 4 kaleme çıkar (ekip posta kutusu eklenir). Ölçüm beyanlarında *"IP tutulmaz"* sınıfı iddia kullanılmaz ve **hiçbir saklama süresi yazılmaz** — bunun yerine dokümanın yerleşik deyimi tekrarlanır: *"bugün için otomatik bir silme süresi işletmiyoruz."* Yurt dışı aktarımın **hukuki dayanağı (KVKK m.9) yazılmaz**; o B-008'de hukukçunundur.

**Gerekçe:**
- **Ölçülen yazılır, ölçülmeyen yazılmaz — ve ikisi aynı cümlede karışmaz.** Vercel için *nerede işlediği* ölçüldü (`x-vercel-id` üç koşumda `iad1`, repoda `vercel.json`/`preferredRegion` yok), Google için yalnız *şirketin nerede olduğu* biliniyor (MX Google'da; Workspace veri bölgesi ölçülmedi) — metin birincisini bölge adıyla, ikincisini yalnız "ABD merkezli" diye yazar.
- **Gönderim bölgesi ile saklama yeri ayrı cümlelerde durur.** Resend `eu-west-1`'den gönderiyor ama kendi DPA'sında *"primary processing operations take place in the United States"* diyor. v1 bu ikisini bir kez birleştirip yanlış sonuca varmıştı (`bunker-ortami.md`); tekrarlanmaması için ayrım metne yerleştirildi.
- **Süre vaadi vermemek, uydurma süre yazmaktan dürüsttür** (2026-09-22 kararının devamı). Rotasyon `altyapi/vps` tarafında düzeltilirse ≈ 30 günlük pencere doğar ve metin o gün bir süre yazabilir; bu yüzden metne *"Bir silme süresi işletmeye başladığımızda bu metne yazılacaktır"* çapası kondu.
- **v1'den gerileme yok** (B-059 k.3): v1'in `RECIPIENTS` listesindeki beş kalemin beşi de karşılandı, `TRANSFER_FACT` karşılığı yazıldı; v2 iki yerde daha ileride (fonksiyon bölgesi adıyla; erişim kaydının kendisi v1'in metninde yok).

**Bedel, bilerek kabul:** Metin yurt dışı aktarımı olgu olarak duyurur ama dayanağını kurmaz — bu boşluk **görünür** kalır ve hukukçu incelemesinde kapanır (B-008). Uydurma bir madde numarası yazmak bu boşluğu gizlerdi.

**İlgili Task/Faz:** Faz 2 — TASK-2.17 (`tasks/archive/TASK-2.17.md`), B-024 kapanışı

---

### 2026-09-23 — Devralınan ölçüm ÖZETİ, devralınan iddia kadar risklidir: yasal cümle özetten değil ölçümün kendisinden yazılır

**Bağlam:** TASK-2.17, Umami'nin veritabanı hakkında bir cümle yazacaktı. Elde TASK-2.01'in bir gün önceki özeti vardı: *"`session` yalnız türetilmiş ülke/bölge/şehir tutuyor."* Özet kullanılmadı, `information_schema` yeniden sorgulandı.

**Karar:** Yasal metne giren her olgu, ondan üretilmiş bir **özetten değil ölçümün kendisinden** yazılır — özet aynı projenin bir gün önceki task'ından gelse bile. Ölçüm tekrarı pahalıysa cümle o kalemde yazılmaz.

**Gerekçe:** Yeniden ölçüm özetin **eksik** olduğunu gösterdi: IP sütunu gerçekten yok, ama `session` ayrıca `browser, os, device, screen, language` tutuyor. Özet **yanlış değil, tam değildi** — ve yasal metin tam olmayan bir listeyle yazılsaydı tam olarak B-024'ün kapattığı sınıfta yeni bir eksik beyan doğardı. Maliyet tek bir `SELECT`'ti; bedeli yayındaki bir taahhütte eksik kalem olurdu. Bu, memory'deki *"yerine yazdığın cümle de bir iddiadır"* disiplininin bir basamak yukarısıdır: iddia kadar **iddianın kaynağı da** doğrulanır.

**İlgili Task/Faz:** Faz 2 — TASK-2.17 (`tasks/archive/TASK-2.17.md`)

---

### 2026-09-23 — Yasaklı iddia sözlüğünde rakip adı tutulmaz: ne düz metin ne hash; slot beyan edilir, mekanizma F6.4'e bırakılır

**Bağlam:** TASK-2.15 görsel denetime iddia dalı ekledi ve sözlüğü `research/lib/claim-leak.mjs`'te tek kaynak olarak kurdu. Sözlüğün dayanağı `CLAIMS.md`'nin "Söylenemez" sütunu; o sütunun bir satırı **rakip adı**. Ama aynı sınır depoya da uzanıyor: M6 F6.4'ün edge case'i *"rakip adı repoda geçerse kendisi sızıntıdır"* diyor. Task dokümanı bu yüzden bir karar noktası bırakmıştı: düz metin mi, kalıp/hash mı.

**Ölçüm (2026-09-23):** satış dosyasının (`../alpfit-plus-satis/rekabet/`, salt okunur) başlıklarından çıkan **18 gerçek rakip ürün adının 0 tanesi** demo kaynağında (`../Alpfit.v1/demo/*.html`) geçiyor — bu hattın girdisi kendi ürünümüzün demosu, yani sınıfın bu hatta **hiç girdisi yok**. Aynı tarama v2 `src/` içinde bir "rakip adı" bildirdi; bakıldı ve sıradan bir Türkçe sözcük çıktı (kaba ad listesinin yanlış alarmı).

**Seçenekler:**
1. Adları düz metin olarak sözlüğe yaz — F6.4'ün edge case'inin adıyla yasakladığı şey; deponun kendisi sızıntı olur.
2. Adların SHA-256 özetlerini tut, jetonları hash'leyerek karşılaştır — düz metin sızdırmaz ama bugün **girdisi olmayan** bir sınıf için mekanizma kurar; ayrıca jeton sınırı (ad kaç sözcük?) ölçülmeden seçilemez.
3. Slotu sözlükte **adıyla ve gerekçesiyle** beyan et, kalıp/hash mekanizmasını girdinin gerçekten olduğu yere (F6.4 → `src/` metin denetimi) bırak.

**Karar:** 3. `claim-leak.mjs` başlığı slotu ve ölçümü yazılı tutar; dosyada ne ad ne hash durur.

**Gerekçe:**
- **Bugün koruduğu bir şey yok.** Görsel hattın girdisi kendi demomuz; ölçülen vuruş 0. Girdisi olmayan bir dal, kapının kapsamını büyütmeden bakım borcu üretir.
- **Yanlış alarm ölçüldü.** Kaba ad eşlemesi bir Türkçe sözcüğü rakip adı sandı. Doğru jeton sınırını seçmek, sınıfın gerçek girdisine (site metni) bakmayı gerektirir — o da F6.4'ün işi.
- **Tek kaynak korunur.** Sözlük zaten F6.4'ün devralacağı dosya; mekanizma oraya eklendiğinde aynı dosyaya girer, ikinci bir ev açılmaz.
- **Bedel, bilerek kabul:** görsel hat bugün bir rakip adını göremez. Kaynak salt okunur bir demo olduğu için bu ancak ürün demosuna rakip adı girerse anlam kazanır; o gün F6.4 mekanizması zaten kurulmuş olur.

**İlgili Task/Faz:** Faz 2 — TASK-2.15 (`tasks/archive/TASK-2.15.md`), M6 F6.4'ün girdisi

---

### 2026-09-23 — Yayınlanan yetenek kalemi, onu "henüz yok" diye anan cümleyi derleme hatasına çevirir

**Bağlam:** TASK-2.11 yol haritasının son dört evini `CAPABILITIES`'e bağlarken şu sınıf ortaya çıktı: yedi düzyazı cümle kalemi **adıyla** anıyor ve o adın **henüz olmadığını** söylüyor ("QR ve turnike ile giriş **yol haritamızda**", "kartla online ödeme **bugünkü sürümde yok**"). Adı sabitten almak **adı** hizalar; kalem yayınlandığı gün ad doğru kalır, **cümle sessizce yanlış olur** — B-040'ın ölçtüğü ayrışmanın ters yönü.

**Seçenekler:**
1. Yalnız adı türet, sınırı kod yorumuna yaz (task dokümanının önerisi).
2. Adı türet + kademeyi de türet, ama `simdi` kademesinde sessizce "bugün var" bas.
3. Adı türet + kalem `simdi`'ye geçtiğinde **hata fırlat** (fail-closed).

**Karar:** 3. `product.ts` → `upcomingCapability(id)` kalemi döndürür, `stageNote(id)` cümle-içi kademe ekini (`yolda` · `yol haritasında`) `STAGE_LABEL`'dan türetir; ikisi de kalem `simdi` kademesindeyse `Error` atar.

**Gerekçe:**
- **Kod yorumu bir kapı değildir** — bu projede tam olarak bu ölçüldü: ürünün kendi "v1.5 / ertelendi" yorumları bayatlamıştı (2026-09-23 sürüm etiketi kararı). Sınırı yorumda bırakmak onu bayatlamaya açık bırakırdı.
- **Sessiz "bugün var" en kötü hâl:** 2. seçenek "pakete dâhil değil" listesinde *"Online kart ile tahsilat (bugün var)"* gibi anlamsız ve yanlış bir satır üretirdi.
- **Fail-closed ucuz ve gürültülü:** fonksiyonlar modül düzeyinde çağrıldığı için hata **import anında** doğuyor. Sondada ölçüldü: `qr-turnike` `simdi`'ye taşındığında test suite yüklenemedi ve dev sunucusunda `/`, `/fiyat`, `/yazilim-secerken` **500** döndü. Bir kalemi yayına almanın bedeli, onu anan cümleleri elden geçirmektir — bu bilinçli bir maliyettir.

**Bedel, bilerek kabul:** `CAPABILITIES`'te bir kalemi `yolda`/`sonra` → `simdi` taşımak **tek satırlık bir iş değildir**; derleme durur ve ilgili cümleler düzeltilene kadar site ayağa kalkmaz. Ters yön (yeni kalem eklemek, `sonra` → `yolda` taşımak) etkilenmez — `stageNote` kendiliğinden hizalanır. Bu sınır DURUM'un aktif task notunda da duruyor ki sıradaki tur şaşırmasın.

**Kapsam notu:** SSS'nin *"Online ödeme alabiliyor muyum?"* **sorusu** bu kapıyı taşımaz (`capability()` kullanır) — kalem yayınlandığında soru geçerli kalır, değişen yalnız cevaptır. Kapı cevabın son cümlesindedir.

**İlgili Task/Faz:** Faz 2 — TASK-2.11 (`tasks/archive/TASK-2.11.md`)

---

### 2026-09-23 — Site sürüm etiketi ürünün sürüm haritasına çapalanır; `nextVersion` açılmaz (aynı günün 7. kararı geçersiz)

**Bağlam:** TASK-2.10 `FounderProgram`'ın üç durum satırını sabite bağlarken orta satırın başlığını (`"v1.5 yolda"`) `PRODUCT_STATUS.nextVersion`'a taşıyacaktı — aynı günün bir önceki kararının 7. maddesi bunu açıkça devrediyordu. Bağlamadan önce ölçüldü.

**Ölçüm** (`../Alpfit.v1/_dev/PRD/VERSIONS.md`, dosyanın kendi beyanı *"Bu dosya source of truth"*):

| Ürünün sürüm haritası | Sitedeki karşılığı |
|---|---|
| **v1.5** = kampanya derinleşmesi · gelişmiş raporlama/Excel · bekleme listesi otomasyonu · churn paneli olgunlaşması | `CAPABILITIES.yolda`'nın **ilk üçü** |
| **v2** = online ödeme · QR/turnike · Apple Health/Google Fit · AI gelişim/beslenme analizi · kurumsal üyelik | `CAPABILITIES.sonra`'nın **beşi de, birebir** |
| — (haritada **hiç geçmiyor**) | `yolda`'ya TASK-2.08'in taşıdığı **dört B-029 kalemi**: Üye 360 tam fazı · iptal eşiği ayarı · üyelik bitişi bildirimi · tek-yetki revoke |

**Karar:** `"yolda"` kademesi bir **sürümün kapsamı değildir** — yedisine birden "v1.5" demek, B-029'un tam olarak ölçtüğü çapasız iddia sınıfına girer. Bu yüzden:

1. **`nextVersion` açılmadı.** Aynı günün 7. kararı (*"alanı tüketicisini bağlayan task açar — TASK-2.10"*) bu ölçümle **geçersizdir**: alanın tüketicisi doğmadı, çünkü doğru cümle sürüm numarası taşımıyor. Alan ancak **kalem düzeyinde** sürüm bilgisi doğarsa anlamlı olur.
2. **Alt iki satırın başlığı `STAGE_LABEL`'dan okunur** ("Yolda" · "Yol haritasında") — `/ozellikler`'in kolon başlıklarıyla artık birebir aynı sözlük.
3. **`version` ("v1") bağlandı** ve çapası ölçüldü: aynı dosya v1 içeriğini tamamlanmış sayıyor (*"v1 içerik tamamlandı, Faz 8–22 ✅"*). 6. karar yerinde duruyor.
4. **Yeni kural:** sitede bir **sürüm numarası** iddiası yazılacaksa çapası ürünün kod yorumu değil `VERSIONS.md`'dir. Kod yorumundaki *"v1.5 adayı / ertelendi"* bir **kapsam taahhüdü değildir** ve bayatlar — ürünün kendi deposunda bunu kovalayan bir test bile var (`web/src/groups/GroupSessionsPanel.test.tsx:817`, *"bileşen kaynağında 'v1.5' ibaresi kalmadı"*).

**İlgili Task/Faz:** Faz 2 — TASK-2.10 (`tasks/archive/TASK-2.10.md`)

---

### 2026-09-23 — Yetenek/yol haritası tek kaynağı `CAPABILITIES`; `PRODUCT_STATUS.short` silinir, `version` kalır

**Bağlam:** "Bugün var / yolda / yol haritasında" ayrımı beş evde elle yazılıydı ve üçü birbirinden farklıydı (B-040); ayrıca beş yetenek cümlesinin ürün kodunda karşılığı yoktu (B-029). `PRODUCT_STATUS.short` ve `.version` alanlarının ise hiç tüketicisi yoktu (B-047).

**Kararlar ve gerekçeleri:**

1. **Sabitin adı `CAPABILITIES`, kademeler `simdi` / `yolda` / `sonra`.** B-040 `ROADMAP = { simdi, yolda, sonra }` önermişti; "roadmap" adı ilk kademeyi ("bugün var") yanlış çatı altına alıyor — bugün var olan şey yol haritası değil. Kademe anahtarları önerildiği gibi bırakıldı.

2. **Kalem `{ id, label, modul? }` — düz dizi değil.** Beş düzyazı cümle yol haritasındaki tek bir kalemi adıyla anıyor ("QR ve turnike", "Online ödeme"); düz dizide çağrı yeri kalemi indeksle aramak zorunda kalırdı. `capability(id)` bilinmeyen id'de sessizce boş dönmek yerine hata veriyor.

3. **Etiketler cümle-içi biçimde saklanır, başlık türetilir.** Ters yön (başlıktan küçültme) "QR" ve "Apple Health"i bozardı — yalnız büyütme kayıpsızdır. Büyütme Türkçe locale ile yapılır: `iptal` → `İptal` (locale verilmezse `Iptal` olurdu).

4. **`capabilityProse` "simdi" kademesini tip düzeyinde kabul etmez.** Ölçüldü: o kademenin etiketleri kendi içlerinde virgül taşıyor ("takvim, rezervasyon ve bekleme listesi") ve virgülle bağlandıklarında cümle okunamaz hale geliyor. O kademenin düzyazı evi `moduleProse()`; kademeyi liste olarak gösteren `CAPABILITIES.simdi` + `capabilityTitle()` kullanır.

5. **`PRODUCT_STATUS.modules` artık türetiliyor** — "simdi" kademesinin modül düzeyli kalemlerinden. Üretilen cümle bugünkünden **bir kalem farklı**: "antrenör performansı" eklendi (eskisi ürünün on modülünün sekizini sayıyordu). Karşılığı ölçüldü: `../Alpfit.v1` → `backend/src/routes/finance-trainer-performance.ts` (server.ts:427'de kayıtlı), `services/trainer-performance.service.ts`, `web/src/pages/TrainerPerformancePage.tsx`. **"Üye 360" bilinçle dışarıda:** ekran var ama ölçüm grafiği ve diyetisyen notu ürünün kendi "Yakında" kutusunda (B-029, W8) — o kalem "yolda" kademesinde.

6. **`PRODUCT_STATUS.short` ("Pilot aşamada") silindi.** Sıfır tüketici, sıfır planlı tüketici; sitede hiçbir yer bu ifadeyi elle de yazmıyor (ölçüldü). Pilot iddiasını `sentence` taşıyor, yani CLAIMS'in tek-kaynak disiplini zayıflamıyor. **`version` ("v1") kaldı** — "v1 hazır" bugün üç yerde elle yazılı (`chat.ts:126`, `faq.ts:48`, `FounderProgram.tsx:83`) ve TASK-2.10/2.11 onları buraya bağlayacak. Ölçüt alanın büyüklüğü değil tüketicisinin var olup olmadığıydı.

7. **`nextVersion` ("v1.5") AÇILMADI.** `FounderProgram.tsx:88` "v1.5 yolda" başlığını elle yazıyor ve kardeşi bağlanırken o da bağlanmalı — ama tüketicisi doğmadan alan açmak `short`'u ölü borç yapan hatanın ta kendisi. Alanı **tüketicisini bağlayan task açar** (TASK-2.10).

**Kapsam dışı (bilinçle):** Tüketicilerin bağlanması TASK-2.10/2.11'de, karşılıksız cümlelerin düzeltilmesi TASK-2.09'da. Bu task'tan sonra beş ev hâlâ kendi metnini yazıyor — ölçüldü: sabiti atlayan **17 çağrı satırı / 6 dosya** (`ozellikler/page.tsx` 6 · `faq.ts` 3 · `karsilastirma.ts` 2 · `chat.ts` 2 · `FounderProgram.tsx` 2 · `fiyat/page.tsx` 2). Bu sayı TASK-2.10 + 2.11'in kapanış ölçütüdür.

**İlgili Task/Faz:** Faz 2 — TASK-2.08 (`tasks/archive/TASK-2.08.md`)

---

### 2026-09-22 — Parmak izi eşleşmedi: iki anahtarın döndürülmesi düşer, milestone ayağı yeniden yazılır

**Bağlam:** Aynı gün alınan «`.env` sızıntısının kapsamı ölçüldü» kararı döndürmeyi tek bir koşula bağlamıştı: *"sunucudaki `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PREVIEW` / `LEAD_TOKEN_PRODUCTION` değerlerinin parmak izi yerel değerlerle karşılaştırılır; sonuca göre döndürülür ya da iptal edilir."* Karşılaştırma TASK-2.01'de koşuldu (salt okuma, hiçbir değer basılmadan — SHA-256'nın ilk 12 karakteri):

| Anahtar | Sunucu | Yerel | Sonuç |
|---|---|---|---|
| `LEAD_TOKEN_PREVIEW` | `0dc073b889b4` | `1a5c428e4b47` | ✗ eşleşmiyor |
| `LEAD_TOKEN_PRODUCTION` | `257900c72d3d` | `ace3e073f68a` | ✗ eşleşmiyor |

Ölçülen dosyanın **canlı kaynak** olduğu ayrıca doğrulandı: çalışan `alpfit-pocketbase` konteynerinin env'i dosyayla birebir aynı parmak izini veriyor, yani dosya bayat değil. Yöntemin eşleşmeyi yakalayabildiği iki kontrol grubuyla gösterildi (bilinen ortak girdi iki makinede de aynı özeti verdi; yereldeki iki eş değer aynı özeti verdi).

**Seçenekler:**
1. Ölçüme uy: döndürme iptal edilir, yalnız yapısal düzeltme (TASK-2.02) kalır.
2. Yine de döndür: ölçüm dolaylı bir kaçağı gözden kaçırmış olabilir.

**Karar:** 1 — koşul sonucuna uyuldu (TASK-2.01, ölçüm belirledi; tercih kullanılmadı).

**Gerekçe:** Önceki kararın hükmü zaten bu koşula bağlıydı; koşul olumsuz çıktı. Sızmamış bir anahtarı döndürmek koruma üretmez, buna karşılık canlı lead akışına dokunan bir işlemdir. Ölçüm iki yönden çapalı: hem sunucunun ayar dosyası hem o dosyayı okuyan çalışan konteyner aynı parmak izini veriyor, ve karşılaştırmanın kendisi pozitif kontrolle sınandı.

**Milestone etkisi:** Faz 2 milestone'unun *"iki anahtar döndürülmüş"* ayağı **düşer**. Önceki karar bunu açıkça yazmıştı: *"Eşleşme çıkmazsa ayak düşer ve milestone o gün yeniden yazılır — sessizce daraltılmaz."* Ayağın yeni hâli kullanıcıyla yazılır; TASK-2.03 iptal edilir. İkisi de plan revizyonu oturumunun işidir (`/devflow:plan-phase`), bu yüzden DURUM'un `Adım` alanı `plan`'a çekildi.

**İlgili Task/Faz:** TASK-2.01 · Faz 2. Bulgu: B-058.

---

### 2026-09-22 — Ölçüm sunucusu ham IP tutuyor ve saklama sınırı yok: yasal metin "IP tutulmaz" diyemez, süre de vaat edemez

**Bağlam:** B-024'ün 🔴 gerekçesi `legal.ts:199` (*"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"*) ve `:116` (*"bu ölçüme kişisel verileriniz aktarılmaz"*) cümlelerini v1'in **2026-07-28** tarihli ölçümüne dayandırıyordu ve bugünkü hâlin ölçülmediğini açıkça yazıyordu. TASK-2.01 bugünkü hâli salt-okuma ile ölçtü:

- **Ham IP tutuluyor.** `umami.kiwiailab.com`'un önündeki `bunker-nginx`'in bağlı `nginx.conf`'unda **0** adet `access_log`/`log_format` direktifi var → nginx'in gömülü `combined` biçimi işliyor, `/var/log/nginx/access.log` → `/dev/stdout` → Docker `json-file`. **592.375** stdout satırının **592.183**'ü ham IPv4 ile başlıyor; **5.580 benzersiz IP**; **490.980** satır ayrıca user-agent taşıyor. Umami sunucu bloğunun kendi `access_log`'u yok, http varsayılanını miras alıyor.
- **Saklama sınırı yok.** Dosya 155 MB / 603.025 satır, penceresi 2026-08-22T22:29:38Z → 2026-09-22T21:53:39Z (31 gün) ve büyüyor. Pencerenin başlangıcı rotasyon değil, 2026-08-23'teki elle disk temizliği.
- **Üçüncü tarafa gitmiyor.** Log gönderici ajan yok, hiçbir konteyner log dizinini mount etmiyor, Umami şemasında IP sütunu yok (`session` yalnız türetilmiş `country/region/city` tutuyor), Next telemetrisi kapalı.

**Ölçümün düzelttiği devralınan gerekçe:** v1'in kaydı *"`/etc/docker/daemon.json` yok, yani rotasyon yok"* diyordu. **Bugün `daemon.json` var** (`max-size 50m`, `max-file 3`) ama `bunker-nginx`'e inmiyor: konteyner 2026-04-15'te, daemon.json'dan (2026-08-28 20:57) **önce** oluşturulmuş ve `HostConfig.LogConfig.Config` değeri boş. Kesim ölçüldü — daemon.json'dan sonra oluşturulan 5 konteynerin hepsinde rotasyon var, öncekilerin 11'inde yok; sınır örneği `alpfit-garage` (5 dk 42 sn önce oluşturulmuş, rotasyonsuz). **Sonuç aynı, gerekçe farklı.**

**Seçenekler:**
1. Metin bugünkü gerçeği yazar: ölçüm isteği sunucumuzun web sunucusuna düşer, erişim kaydında IP bulunur, bugün tanımlı bir saklama süresi yoktur.
2. Metin eski hâlinde kalır ("IP tutulmaz").
3. Metin bir süre vaat eder (örn. "30 gün").

**Karar:** 1 — ölçüm belirledi (TASK-2.01). Cümlenin son hâli TASK-2.17'nin işidir; bu kayıt yalnız dayanağı sabitler.

**Gerekçe:** 2 ölçümle çürüdü — ham IP ölçülerek bulundu. 3 ise bugün **karşılığı olmayan** bir vaat olurdu: rotasyon konteynere inmiyor, logrotate kuralı yok, kesen bir zamanlanmış iş yok. `ILKELER.md` → *"Kanıtsız iddia yayınlanmaz"* ve `CLAIMS.md` → *"Bilinmeyen uydurulmaz"* burada doğrudan uygulanır; üstelik bunlar ziyaretçiye verilen hukuki taahhütler.

**Not — süre vaadi altyapı düzeltmesine bağlı, metne değil:** `bunker-nginx` yeniden oluşturulursa (`up -d --force-recreate` + ardından nginx reload) daemon.json'un kuralı iner ve tavan 50m × 3 = 150 MB olur; bugünkü hıza göre (155 MB / 31 gün) bu ≈ 30 günlük bir pencere demektir. O düzeltme **bu fazın ve bu reponun kapsamı dışıdır** (evi `altyapi/vps`), `BULGULAR.md` → Gelen Kutusu'na düştü. Düzeltme yapılırsa metin bir süre yazabilir hâle gelir — ama TASK-2.17 bugünkü gerçeği yazar, gelecekteki hâli değil.

**İlgili Task/Faz:** TASK-2.01 (ölçüm) → TASK-2.16 / TASK-2.17 (metin) · Faz 2. Bulgu: B-024.

---

### 2026-09-22 — `.env` sızıntısının kapsamı ölçüldü: imajdaki beş değerin hiçbiri canlı değil; döndürme bir karşılaştırmaya bağlandı

**Bağlam:** Aynı gün alınan «`.env`'in imaja sızması» kararı iki anahtarın döndürülmesine hükmetti ve dayanağı şu cümleydi: *"Beş anahtarın ikisi canlı: `LEAD_STORE_TOKEN` (v1'in lead deposunun önizleme token'ı) ve `IP_HASH_SALT`."* O cümle ölçülmemişti; kaydın kendisi de bunu *"açık kalem (fazın ilk işlerinden biri)"* diye işaretliyordu. Research oturumunda ölçüldü (2026-09-22, değer basılmadan — SHA-256 önekleriyle):

- `LEAD_STORE_URL` **yerel konteyneri** gösteriyor (`http://lead-store:8090`), canlı depoyu (`lead.alpfitplus.com`) değil.
- `LEAD_STORE_TOKEN` ile `LEAD_TOKEN_PREVIEW` **bayt bayt aynı** — yani sitenin kullandığı token, yerel depo kopyasının önizleme token'ı.
- `tasks/archive/TASK-1.17.md:146`: bu iki token bu makinede `openssl rand -hex 32` ile üretildi, canlı değer değil.
- `tasks/archive/TASK-1.18.md:150,184`: canlı `IP_HASH_SALT` Vercel'e bir **boru içinden** girildi ve *"değer hiçbir yerde saklanmadı"* — yerel `.env`'deki tuz o değer değil.
- Tek üretim imajı bugün 15:30'da, TASK-1.18'den sonra derlendi; makineden çıkmadı (`docker images`, kayıt deposu izi yok).

Üçü birlikte şunu söylüyor: **imaj katmanına giren beş değerin hiçbiri canlı bir sır değil.** Sızıntı gerçek ve yapısal hata gerçek, ama döndürmeyi gerektiren "canlı anahtar taşındı" olgusu ölçümle desteklenmiyor.

**Seçenekler:**
1. Önce kesinleştir: sunucudaki `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PREVIEW` / `LEAD_TOKEN_PRODUCTION` değerlerinin parmak izi yerel değerlerle karşılaştırılır (tek satır, hiçbir değer görünmez); sonuca göre döndürülür ya da iptal edilir.
2. Kararı koru: ölçümden bağımsız, ikisi de döndürülsün.
3. Döndürmeyi tamamen iptal et; yalnız yapısal düzeltme kalsın.

**Karar:** 1 (kullanıcı, research-phase 2026-09-22). Yapısal düzeltmeler **koşulsuz** yapılır: `.dockerignore`'a `.env` ve `.env.*` (`!.env.example` istisnasıyla) ve `web-prod`'a bilinçli `environment:`/`env_file:`. Döndürme yalnız karşılaştırma canlı değer gösterirse yapılır.

**Gerekçe:** Sızmamış bir anahtarı döndürmek koruma değil, sunucuda bedeli olan bir işlemdir; buna karşılık ölçüm dolaylı kanıtlara (task kayıtları + yerel parmak izleri) dayanıyor ve tek doğrudan kaynak sunucunun kendi ayar dosyası. Karşılaştırmanın bedeli tek bir salt-okuma bağlantısıdır (sunucu kuralları `../altyapi/vps/CLAUDE.md`), kazancı ise kararın tahmine değil olguya dayanması — `ILKELER.md` → *"Kanıtsız iddia yayınlanmaz"* disiplininin kendi kararlarımıza uygulanmış hâli. Bu kayıt 2026-09-22 «`.env`'in imaja sızması» kararının **döndürme hükmünü** koşula bağlar; aynı kararın yapısal düzeltme hükmü ve `IP_HASH_SALT`'ın F7.5'te v1'in değerine çevrilmesi sınırı **aynen geçerlidir**.

**Milestone etkisi:** Faz 2 milestone'unun *"iki anahtar döndürülmüş"* ayağı bu karşılaştırmaya bağlıdır. Eşleşme çıkmazsa ayak düşer ve milestone o gün yeniden yazılır — sessizce daraltılmaz.

**İlgili Task/Faz:** Faz 2 (`phases/PHASE-2.md` → Araştırma Bulguları). Bulgu: B-058.

---

### 2026-09-22 — Onay e-postası açılınca `notify_lead` gerçek sonucu taşır; 2026-09-14 kararı geçersiz kılındı

**Bağlam:** 2026-09-14 «Bildirim durumu (`notify_*`)» kararı `notify_lead` alanına **hiç dokunulmamasını** hükmetti. Gerekçesi tek bir olguydu: *"v2 bugün o e-postayı hiç göndermediği için alanı erken `skipped` yazmak, alan adı geçişinde v1'in yerini alınca gerçek anlamla çakışırdı."* Faz 2, B-059'un e-posta ayağını kapsama aldı — talep sahibine onay e-postası bu fazda açılıyor. Kararın dayandığı olgu böylece düşüyor. Kodun kendi yorumu da bu dayanağı yazıyor (`src/app/api/demo/route.ts` → `notifyStore` başlığı).

**Seçenekler:**
1. Alan bugünkü gibi hiç yazılmasın; depo varsayılanı `pending` kalsın.
2. Gerçek sonuç yazılsın: gönderildiyse `sent`, gönderilemediyse `failed`, ziyaretçi e-posta vermediyse `skipped` — v1'in bugünkü davranışının aynısı (`../Alpfitplus-website.v1/api/demo.ts:358-360`).

**Karar:** 2 (kullanıcı, research-phase 2026-09-22).

**Gerekçe:** 2026-09-14 kararının koruduğu şey alanın **anlamının karışmamasıydı**; onay e-postası açıldıktan sonra o anlam artık v1'inkiyle aynıdır, yani karışma riski tersine döndü: alanı `pending` bırakmak, geçişten sonra aynı koleksiyonda v2 kayıtlarını kalıcı olarak "bildirim beklemede" gösterir ve alanın kendisini okunamaz kılar. Biriken verinin yorumu geri alınamaz olduğu için karar burada yazılıdır. v1 ile aynı davranışı yazmak ayrıca B-059'un gerileme listesinin ikinci kalemini de kapatır.

**Sınır:** Değer yazımı ziyaretçinin yanıtını **değiştirmez** ve başarısızlığı yalnız loglanır — `notifyStore`'un bugünkü sözleşmesi (en fazla 3 sn, sonuç yanıta yansımaz) aynen korunur.

**İlgili Task/Faz:** Faz 2 (`phases/PHASE-2.md`). Bulgular: B-059 (e-posta ayağı), B-060 ile aynı fazda. Geçersiz kılınan: 2026-09-14 «Bildirim durumu (`notify_*`)».

---

### 2026-09-22 — Yetenek iddiaları tek bir yetenek listesinden türer; cümle bazlı düzeltme reddedildi

**Bağlam:** B-029 ölçtü: site ürünün bugün karşılamadığı **beş** yeteneği "var" diye anlatıyor (ölçüm grafiği + diyetisyen notu · "iptal eşiğini siz belirlersiniz" · üyelik bitişi bildirimi · yetkinin geri alınması · kampanya) ve dördünde ürünün **kendi kaydı** bunu açıkça söylüyor ("Yakında", "v1.5 adayı", "ertelendi", "W8"). Kök neden: sitedeki yetenek iddialarını ürün deposuna karşı doğrulayan hiçbir kapı yok; tek mekanizma `/ozellikler` sayfasının "Yolda" kolonu ve o kolon **elle** tutuluyor — nitekim beşinci kalemde aynı sayfanın iki kolonu birbirini kesiyor. İkinci katman B-040: ürün yol haritası bugün **dört ayrı evde** ve 5/4/3/3 ayrışmış. Aynı sayfa (`src/app/ozellikler/page.tsx:86`) ziyaretçiye *"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"* diye taahhüt veriyor.

**Seçenekler:**
1. Beş cümleyi ürün deposuna karşı tek tek doğrula ve düzelt; yapı değişmez.
2. "Bugün var / yolda" ayrımını `src/content/` içinde **tek bir yetenek listesinden** türet; beş cümle o listeye göre düzelsin.

**Karar:** 2 (kullanıcı teyidi, discuss-phase 2026-09-22). Listenin somut şekli (adı, şeması, hangi dosyada durduğu, tüketicilerin onu nasıl okuduğu) research-phase'in konusudur; burada kararlaştırılan, iddianın **tek kaynaktan türemesi**.

**Gerekçe:** ILKELER → "Kalıcılık önceliği" ve "Kanıtsız iddia yayınlanmaz". Ürün ilerlemeye devam ediyor, iddialar ise 2026-09-09/10'da yazıldı; cümle bazlı düzeltme (seçenek 1) aynı sınıfı bir sonraki ürün sürümünde yeniden doğurur ve yine elle bulunur — bu bulgu fiilen **iki denetim turunda da elle** bulundu. Tek liste üç işi birden yapar: beş cümlenin dayanağı olur · yol haritasının dört evde ayrışmasını (B-040) kapatır · M6 F6.4'ün (iddia sızıntı denetimi) ürün deposuna karşı kontrol edeceği listeyi doğurur. Doğrulama için gereken kaynak zaten mevcut — ürün deposu bu bilgiyi adıyla aranabilir notlarda taşıyor ("Yakında", "v1.5", "W8") — eksik olan tek şey bağdı. Karşı ağırlık: faz bir task büyür; kabul edildi.

**İlgili Task/Faz:** Faz 2 — kapsam kararı (`phases/PHASE-2.md` → Kapsam Tartışması). Bulgular: B-029, B-040. İleride bağlanacağı kapı: M6 F6.4 (`modules/M6-Kalite-Kapilari.md`).

---

### 2026-09-22 — `.env`'in imaja sızması: iki canlı anahtar döndürülür (IP tuzu + önizleme depo token'ı)

**Bağlam:** B-058 ölçtü: `.dockerignore:6` yalnız `.env*.local` yazıyor ve bu kalıp `.env`'i **eşlemiyor**; üretim Docker imajı `/app/.env`'i beş anahtarın **değeriyle** taşıyor (`Dockerfile:27` `COPY . .` → standalone çıktı → `:35` runner katmanı). `docker save`, `docker history` ya da bir registry push'u bu değerleri imajla birlikte taşır. Hafifletici: bugün CI yok, registry yok, imaj bu makineden çıkmadı (ölçüldü) — risk **potansiyel**. Kullanıcı `.env`'in üretim değerleri taşıdığını teyit etti (discuss-phase 2026-09-22). Beş anahtarın **ikisi canlı**: `LEAD_STORE_TOKEN` (v1'in lead deposunun **önizleme** token'ı) ve `IP_HASH_SALT`. Kalan üçü beyana göre yerel ya da gizli değil — `LEAD_TOKEN_PREVIEW`/`LEAD_TOKEN_PRODUCTION` yerel depo kopyasının token'larıdır (`.env.example` §3 bunu adıyla beyan ediyor: *"YALNIZ YEREL: canli deger BURADA ASLA kullanilmaz"*), `LEAD_STORE_URL` bir adres.

**Seçenekler:**
1. `.dockerignore`'u düzelt, anahtarlara dokunma — imajın hiç dışarı çıkmadığı ölçümüne güvenilir.
2. Yalnız `IP_HASH_SALT` döndürülsün; depo token'ı alan adı geçişinde üretim token'ıyla birlikte yenilenir (o gece sunucuya zaten bakılacak).
3. İkisi de döndürülsün.

**Karar:** 3 (kullanıcı, discuss-phase 2026-09-22). Yanında iki yapısal düzeltme: `.dockerignore`'a `.env` ve `.env.*` (`!.env.example` istisnasıyla), ve `web-prod`'a **bilinçli** `environment:`/`env_file:` — yerel üretim provası neye bağlandığını açıkça söylesin.

**Gerekçe:** `IP_HASH_SALT`'ın döndürülmesi ölçülerek **bedelsiz** bulundu: değer v1'in değil, TASK-1.18'de v2 için `openssl rand -hex 32` ile üretildi ve hiçbir yere kaydedilmedi (`tasks/archive/TASK-1.18.md` → Karar Noktası (b)), yani v1'in lead kayıtlarıyla `ip_hash` sürekliliği bugün **zaten yok**. Tek etkisi: v2'nin `leads_preview`'daki 15 test kaydının `ip_hash`'i yeni kayıtlarla **karşılaştırılamaz** hâle gelir — o kayıtlar bilinçli test turlarıdır ve 12 aylık saklama işi siler. Depo token'ı sunucuda bir işlem gerektiriyor ama v1'in canlı lead akışı **üretim** token'ını kullandığı için etkilenmiyor; buna karşılık seçenek 2, sızmış sayılan bir token'la geçişe kadar yaşamayı gerektiriyordu ve bunun gerekçesi yoktu. **F7.5'e taşınan sınır değişmedi:** alan adı geçişinde `IP_HASH_SALT` v1'in değerine çevrilir (`modules/M7-Yayin-ve-Altyapi.md` → F7.5 Edge Case'leri); bugünkü döndürme o adımı etkilemez, yalnız aradaki değeri tazeler.

**Açık kalem (fazın ilk işlerinden biri):** `.env`'deki `LEAD_TOKEN_PRODUCTION` gerçekten yerel depo kopyasının token'ı mı, yoksa canlı üretim token'ı mı? `.env.example` §3 "yalnız yerel" diye beyan ediyor ama bu beyan **ölçülmedi**. Canlı değer oradaysa döndürme kapsamı üçe çıkar ve v1'in canlı lead akışı da ilgilenir.

**İlgili Task/Faz:** Faz 2 — kapsam kararı (`phases/PHASE-2.md`). Bulgu: B-058. Env taşıma listesi: M7 F7.5.

---

### 2026-09-22 — Analitik olay adları v1 ile hizalandı: `whatsapp-click`/`phone-click` yerine `whatsapp`/`phone`

**Bağlam:** TASK-1.08 `src/lib/analytics.ts`'i (olay sözlüğü + `track()`) yazarken 2026-09-13 «Analitik (yeniden)» kararı olay adlarını `demo-submit` / `whatsapp-click` / `phone-click` olarak sabitlemişti. 2026-09-14 «Umami site kaydı» kararı v2'nin alan adı geçişinde **v1'in Umami kaydına** devralınacağını netleştirdi — bu, geçmiş ve yeni verinin panelde **aynı seride** kalması gerektiği anlamına gelir. v1'in olay adları (salt-okunur, `../Alpfitplus-website.v1/src/config/analytics.ts:20-42`, doğrulandı 2026-09-22): `demo-submit`, `whatsapp`, `phone`, `email`, `instagram`, `cta` — `-click` eki yok. Aynı kayıtta iki farklı adlandırma birikirse geçiş günü seri ikiye böler, geçmiş veri geri toparlanamaz.

**Seçenekler:**
1. 2026-09-13 kararını aynen uygula: `whatsapp-click` / `phone-click`.
2. v1 ile hizala: `whatsapp` / `phone` (`-click` eki düşer), `demo-submit` zaten aynı.

**Karar:** 2. `EVENTS` sözlüğü (`src/lib/analytics.ts`) `demo-submit` / `whatsapp` / `phone` olarak yazıldı — v2'de bugün tüketicisi olmayan v1 olayları (`email`, `instagram`, `cta`) açılmadı (kullanılmayan sabit yok, YAGNI).

**Gerekçe:** 2026-09-13 kararının gerekçesi (ölçülebilirlik: yeni bağlantı otomatik sayılır; bakım: tek sarmalayıcı, sağlayıcı değişse yalnız `analytics.ts` değişir) **mimari** tercihi (global tıklama dinleyicisi + tek `surface` alanı) savunuyordu, üç ad dizesinin `-click` eki taşımasına özgü bir gerekçe içermiyordu — 2026-09-14'ün v1-hizası hedefiyle çelişmeyen güçlü bir gerekçe bulunamadı. Mimari tercih (dinleyici, `surface` alanı, `data-tag`, sessiz geçiş) aynen geçerli kalır; değişen yalnız üç ad dizesi. `surface` (yüzey) v1'de serbest dizeydi, v2'de tip düzeyinde daraltıldı (TASK-1.08 Alt Görev 1) — bu event adı hizasını bozmaz, `surface` event adından bağımsız ayrı bir veri alanı.

**İlgili Task/Faz:** Faz 1 — TASK-1.08 (bu kayıt, `src/lib/analytics.ts` yazıldı). **Açık kalem:** `tasks/TASK-1.09.md`'nin kendi Alt Görevler/Test Kriterleri metni hâlâ `whatsapp-click`/`phone-click` yazıyor — o task henüz çalıştırılmadı, plan metni run-task'ın değil plan-phase/verify-plan'ın konusu; BULGULAR.md → Gelen Kutusu'na düşüldü.

---

### 2026-09-21 — Anahtar kasası: yönetim düzeyi anahtarlar repo dışında dosyada, panel adımları API'ye taşınır

**Bağlam:** Faz 1'in son üç task'ı (1.06 Resend, 1.07 Umami, 1.18 depo) kullanıcının bir web paneline girip değer üretmesini bekliyordu. Kullanıcı panel adımlarında zorlanıyor (2026-09-14 ve 2026-09-21) ve her adım koşumu durduruyordu: TASK-1.06 bir tam tur boyunca `RESEND_API_KEY` bekledi.

**Seçenekler:**
1. Her serviste kullanıcı panele girer, değeri üretir, oturuma verir (bugüne kadarki hâl).
2. Yönetim düzeyinde bir anahtar bir kez alınır, repo dışında dosyada tutulur; oturumlar panel işini o servisin API'siyle yapar.
3. Anahtarlar repo içinde şifreli bir kasada tutulur (`sops`, `git-crypt` vb.).

**Karar:** 2 (kullanıcı, 2026-09-21). Kasa `~/.config/alpfit/secrets.env`, izin `600`, repo dışında — git görmez. Bugünkü içeriği: `RESEND_ADMIN_KEY` (Resend Full access). Oturumlar bu anahtarla servis API'sini çağırır ve **dar yetkili** iş anahtarlarını kendileri üretip Vercel'e `--sensitive` girer (TASK-1.06: `alpfitplus-web-v2`, `sending_access`, tek alan adına bağlı).

**Gerekçe:** Panel adımı tek kişilik ekipte gerçek bir darboğaz; API yolu hem kullanıcıyı serbest bırakıyor hem **ölçülebilir** oluyor (alan adı doğrulaması artık ekran görüntüsü değil `GET /domains` → `verified`). Yönetim anahtarı siteye hiç girmiyor, üretim yüzeyinde yalnız dar yetkili anahtar duruyor — sızıntı yüzeyi büyümüyor, küçülüyor. Seçenek 3 reddedildi: şifreli kasa da bir parola/anahtar ister ve onu yine repo dışında tutmak gerekir, yani bir katman ekler ama sorunu taşımaz.

**Sınır:** Kasa **yönetim** anahtarı tutar, çalışma zamanı sırrı değil — sitenin sırları Vercel env'inde ve `.env`'de kalır. Değer hiçbir dokümana, commit'e, log'a yazılmaz; yalnız anahtar adı ve konum yazılır (`CLAIMS`/`CLAUDE.md` sır disiplini değişmedi). İleride Umami ve başka servislerin yönetim anahtarları da aynı dosyaya girer.

**İlgili Task/Faz:** Faz 1 — TASK-1.06 (ilk kullanım), TASK-1.07 (Umami adımı aynı yolu bekliyor)

---

### 2026-09-14 — Umami site kaydı: önizlemede yeni v2 kaydı, alan adı geçişinde v1'in `alpfitplus.com` kaydına geçilir

**Bağlam:** TASK-1.07 v2 için kendi Umami'de yeni bir site kaydı açıyor (`Alpfit Plus v2 (önizleme)`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`). Alan adı geçişinde hangi kaydın kullanılacağını geçiş fazına bırakmıştı (`tasks/TASK-1.07.md` → Dikkat Noktaları; `PHASES.md` → Alan adı geçişi). Kullanıcı yönü verdi (2026-09-14, run-phase turu, orkestratör aracılığıyla).

**Seçenekler:**
1. Önizleme boyunca ayrı v2 kaydı; alan adı geçişinde v2, v1'in `alpfitplus.com` kaydına geçer.
2. Geçişten sonra da v2'nin yeni kaydı sürer; `alpfitplus.com`'un geçmişi v1 kaydında ayrı kalır.
3. Bugünden v1'in kaydı kullanılır.

**Karar:** 1 (kullanıcı). TASK-1.07 planlandığı gibi yeni önizleme kaydını açar. v1'in kaydı v1 canlıyken v2'de kullanılmaz. Alan adı geçişi fazında Production `NEXT_PUBLIC_UMAMI_WEBSITE_ID` v1 kaydının kimliğine çevrilir.

**Gerekçe:** `alpfitplus.com`'un geçmiş trafiği tek kayıtta kesintisiz görünür — 2026-09-13 «Analitik (yeniden)» kararının "birikmiş geçmiş kopmasın" gerekçesiyle aynı. Seçenek 3 önizleme ve test trafiğini v1'in canlı sayılarına karıştırırdı. Seçenek 2 geçmişi iki kayda bölerdi ve geri alınamazdı: geçişten sonra biriken veri yanlış kayıtta kalırdı.

**İlgili Task/Faz:** Faz 1 — TASK-1.07; Alan adı geçişi fazı (M7 F7.5)

---

### 2026-09-14 — Bildirim durumu (notify_*): yalnız notify_team geri yazılır, notify_lead'e dokunulmaz

**Bağlam:** TASK-1.14'ün depo adaptörü kayıt sonrası bildirim durumunu (`notify_team`/`notify_lead`) depoya `PATCH /lead/{id}` ile geri yazabilir (v1'in kendi ucu ikisini de yazıyor — ekip bildirimi + talep sahibine onay e-postası). v2'nin bugünkü tasarımı yalnız ekibe (`DEMO_TO`) tek e-posta gönderiyor (2026-09-13 "E-posta kaynağı"); talep sahibine ayrı bir onay e-postası bu fazın kapsamında değil (Gelen Kutusu'nda, "Alan adı geçişi" kapsam tartışmasına bırakıldı).

**Seçenekler:**
1. Yalnız `notify_team` PATCH edilir (e-posta sonucuyla `sent`/`failed`); `notify_lead` hiç yazılmaz, depo varsayılanı `pending` kalır.
2. İkisi de `pending` bırakılır, hiç PATCH yapılmaz.
3. `notify_lead` da `skipped` olarak yazılır (site talep sahibine e-posta göndermediği için).

**Karar:** 1 (task dokümanının önerisiyle, run-task oturumunda). `notify_lead` alanı depo şemasında **rezerve** kalır: v1'de anlamı "ziyaretçi e-posta vermedi" (`skipped`) ya da onay e-postası sonucu (`sent`/`failed`); v2 bugün o e-postayı hiç göndermediği için alanı erken `skipped` yazmak, alan adı geçişinde v1'in yerini alınca gerçek anlamla çakışırdı.

**Gerekçe:** Panelde "ekibe bildirim gitti mi" sorusu cevaplanır (asıl ihtiyaç). `notify_lead`'in anlamı ileride (onay e-postası özelliği eklenirse) tek elden, geriye dönük tutarlı biçimde doldurulabilsin diye bugün dokunulmaz — erken ve yanlış bir değerle doldurmak iki farklı anlamın aynı koleksiyonda karışmasına yol açardı.

**İlgili Task/Faz:** Faz 1 — TASK-1.14

---

### 2026-09-14 — Depo sözleşmesinin sınanması: v1'in PocketBase'inin yerel kopyası, canlıya tek teyit isteği

**Bağlam:** "Lead hedefi (yeniden, 2)" kaydı sitenin yeni kayıt adaptörünün nerede sınanacağını plan revizyonuna bıraktı. Seçenekler yerel konteyner ya da canlı önizleme koleksiyonuydu. Depo kodu (`pb_hooks`, `pb_migrations`, Dockerfile) v1 reposunda, yani bu projenin dokunulmazında duruyor. Canlı depo v1'in üretim taleplerini de tutuyor ve `ip_hash` başına saatte 5 kayıtla sınırlı.

**Seçenekler:**
1. Yerel kopya: compose profili, imaj v1'in Dockerfile'ından, `pb_hooks` ve `pb_migrations` v1'den salt okunur bağlı. Sözleşme paketi ve sitenin uçtan uca turu yerelde; canlı depoya tek teyit isteği.
2. Yerel ortam yok: adaptör Vitest'te sahte yanıtlarla sınanır, gerçek depo ilk kez canlı `leads_preview`'da görülür.

**Karar:** 1 (kullanıcı, plan revizyonu). Profil `lead` (TASK-1.17). Sözleşme paketi yalnız yerel adrese karşı koşar, canlı adres verilirse istek atmadan reddeder (TASK-1.13). Sitenin adaptörü yerel depoda uçtan uca sınanır (TASK-1.14). Canlıda tek istek, token'ın önizleme koleksiyonuna yazdığını panelde gösterir (TASK-1.18). 2026-09-13 "Alıcı provası" kararının "aynı sözleşme paketi iki ortamda koşar" cümlesi bu hedefte geçersizdir; paket tek ortamda (yerel) koşar.

**Gerekçe:** Adaptör belgeden kopyalanmış sahte yanıtlara değil depo **kodunun kendisine** karşı sınanır. v1'de hook değişirse paket kırmızıya döner (kümülatif test). Canlı `leads_preview`'a test yığılmaz ve v1 ziyaretçileriyle paylaşılan sınıra takılınmaz. Bedeli tek bir küçük ortam task'ı; v1 reposunda dosya değişmez. Aynı ortam alan adı geçişinde yeniden kullanılır.

**İlgili Task/Faz:** Faz 1 — plan revizyonu 2026-09-14; TASK-1.17, 1.13, 1.14, 1.18

---

### 2026-09-14 — Lead hedefi (yeniden, 2): v1'in lead deposu (PocketBase, `lead.alpfitplus.com`), Bunker değil

**Bağlam:** TASK-1.11 keşfi Bunker'a giriş için üç kayıt biçimi ve iki alıcı yolu ölçtü. `alpfit` canlı soğuk e-posta kampanyasının kiracısı; `leads`/`staged_leads`'e yazılan talep soğuk hatta düşebilir. Güvenli yol (ayrı tablo + Bunker ucu) Bunker OS reposunda iş, bir migration ve yerel prova ortamı istiyordu. Kullanıcı sorulara şöyle cevap verdi (2026-09-14): *"şu an mevcut canlı sitede nereye yazılıyor demo talebi basit bir şekilde yazılsın zaten mail de gelecek bu yeterli sonra değiştiririz gerekirse"*. Yönü verdi, seçimi devretti.

Ölçüldü: v1 talebi Bunker'a değil, aynı sunucuda ayrı compose projesi olarak koşan PocketBase deposuna yazıyor. Kaynak: `../Alpfitplus-website.v1/api/demo.ts:233-256` (`POST ${LEAD_STORE_URL}/lead`, `X-Lead-Token`), e-posta `:324-346` (Resend, ekip + talep sahibi). Depo: `pocketbase/README.md:23-42,170-222`; `lead.alpfitplus.com/api/health` 200 (2026-09-14).

**Seçenekler:**
1. Bunker'da ayrı tablo + Bunker ucu (TASK-1.11 önerisi): izolasyon kodla kanıtlı. Bedeli Bunker OS'ta iş, canlı migration, yerel n8n/Postgres/Bunker ortamı.
2. Bunker `leads` ya da `staged_leads`: panelde görünür. Talep soğuk otomasyona düşebilir, kullanıcı bu riski kabul ettiğini söylemedi.
3. v1'in PocketBase deposu (`leads_preview` / `leads`) + site e-postası.
4. Yalnız e-posta: kalıcı kayıt yok, ILKELER "gelen talep kaybolmaz" ile çelişir.

**Karar:** 3 (kullanıcının yönüyle, run-task turu, orkestratör çerçevesi). Talep `lead.alpfitplus.com`'a `POST /lead` ile yazılır. Kimlik v1'in `X-Lead-Token` başlığı; token koleksiyonu da belirler. E-posta 2026-09-13 "E-posta kaynağı" kararındaki gibi siteden gider. Env anahtar adları v1'inkiyle aynı: `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT`. 2026-09-13'te önerilen `LEAD_WEBHOOK_TOKEN` doğmaz. v2 önizleme aşamasında önizleme token'ını kullanır; üretim token'ına alan adı geçişinde (M7 F7.5) geçer.

**Gerekçe:**
- **(a) Soğuk otomasyona girmez.** Koleksiyonların beş API kuralı `null`, yani yalnız superuser (`pocketbase/pb_migrations/1785184594_…js:105-109`). Tek yazma kapısı `pb_hooks/lead.pb.js`, okuyan tek zamanlanmış iş 12 aylık saklama cron'u (`retention.pb.js:30`). Bunker kodunda (`bunker-dashboard/src`, `bunker-v2`) PocketBase ya da `lead.alpfitplus` referansı 0. Canlı n8n'in 2026-09-14 02:30 UTC yedeğindeki iş akışlarında `pocketbase` / `lead.alpfitplus` / `alpfitplus` / `X-Lead-Token` geçişi 0.
- **(b) En az hareketli parça.** Depo iki aydır canlıda (2026-07-27), yedeği ve saklama politikası kurulu. Sunucuda, Bunker OS'ta, n8n'de iş yok; yerel prova ortamı gerekmez. Değişen yalnız sitenin kayıt adaptörü ve env'dir.
- **(c) Sonradan değiştirmesi ucuz.** Hedef tek adaptör fonksiyonunun arkasında. Alan adı geçişinde v2, v1'in yerini alırken talepler aynı depoda kesintisiz kalır (Umami kararıyla aynı gerekçe). Yasal metin v1'deki "aynı sunucu, Almanya" beyanını korur.
- **Bedel, bilerek kabul:**
  - Talep Bunker panelinde görünmez; panel `lead.alpfitplus.com/_/` ve bildirim e-postasıdır.
  - Depo kodu `../Alpfitplus-website.v1/pocketbase/` altında, yani bu projenin dokunulmazında. Şema ya da hook değişikliği gerekirse o repoda iş olur ve kullanıcı kararı gerekir.
  - Şemada `segment`, `consent`, `ua`, `at` kolonu yok. Nereye düşeceği plan revizyonunda netleşir (öneri: `segment` mesajın başına etiket, gerisi e-postada).

**Milestone değişikliği:** Faz 1 milestone'undaki "gerçek demo talebi Bunker'da `alpfit` kiracısına kayıt olarak düşüyor, hiçbir satış otomasyonunu tetiklemiyor" ifadesi "v1'in lead deposunda (`lead.alpfitplus.com`, önizleme koleksiyonu) kayıt olarak düşüyor" olur. E-posta, Umami, başlıklar ve "v1 projesine dokunulmadı" aynen kalır. Depo kullanılır ama v1 reposu ve Vercel projesi değişmez. Cümle metni ve task zinciri (TASK-1.17 · 1.13 · 1.14 · 1.18 · 1.06 · 1.15) plan revizyonunda yeniden yazılır.

Bu kayıt 2026-09-13 "Lead hedefi (yeniden)" kararının hedef kısmını ve "Alıcı provası" kararının n8n + Postgres yerel ortamını geçersiz kılar. Sözleşme testinin nerede koşacağı plan revizyonunda netleşir: v1'in `pocketbase/` klasörünü salt okunur bağlayan yerel konteyner ya da canlı önizleme koleksiyonu. "E-posta kaynağı" kararı aynen geçerli.

**İlgili Task/Faz:** Faz 1 — TASK-1.11 kapanışı (`tasks/archive/TASK-1.11.md` → Oturum — 2026-09-14), plan revizyonu

---
