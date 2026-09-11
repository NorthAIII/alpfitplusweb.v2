# DevFlow — Hızlı İş (Quick Mode)

Bu komut faz döngüsü dışında tüm ad-hoc task'lar için kullanılır. Bug fix, küçük feature, config değişikliği, acil düzeltme gibi işleri DevFlow garantileriyle (commit, izleme) ama faz ağırlığı olmadan yapar. Task dışı her iş bu komutla yapılır.

**Kullanım:** `/devflow:quick [QUICK-NNN | B-NNN | ne yapılacağı]` — argüman **iki kimlikten biri** ya da **serbest metin** olabilir: `QUICK-NNN` biçimindeyse o yarım kaydı devralır (Adım 1'in devam/yeni sorusu atlanır), `B-NNN` biçimindeyse kanvasta bekleyen o **bulgunun** işini alır (aynı soru yine atlanır — iş bellidir), serbest metinse yeni işin tanımı sayılır — **bu hâlde de Adım 1 önce yarım kayıtları tarar ve devam/yeni diye sorar**, yalnız "ne yapalım?" sorusu tekrarlanmaz. Boşsa tarama ile iş tanımı sorusu birlikte gelir.

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Quick mode için protokol dışında ek zorunlu dosya yoktur — istenen işe göre göreve-göre dosyalar okunur. **Göreve göre:** iş kanvasta kayıtlı bir bulguysa `_dev/BULGULAR.md` index'i + ilgili `_dev/bulgular/B-NNN-*.md` atomu okunur (kapanışta mezuniyet gerekir — Önemli Kurallar); **argüman `B-NNN` biçimindeyse bu hâl kesindir** ve rotası Adım 1'dedir.

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Kullanıcıdan İşi Al

**Argüman `QUICK-NNN` biçimindeyse** taramayı ve devam/yeni sorusunu atla: o kaydı oku ve **Durum'una göre başla** — 🔄/⏸️ ise kaldığı yerden sürdür (aynı kalıp: `resume` Adım 4), **⬜ ise "Ne Yapılacak"tan baştan başla** (hazırlanmış kayıt; sürdürülecek bir yer yoktur). Kayıt yoksa ya da Durum'u ✅/❌ ise durma — kullanıcıya tek satırla bildir ve olağan akışa (aşağıdaki tarama) düş. ⚠️ **Bir orkestratörün alt ajanıysan olağan akışa DÜŞME** (aynı fıkra `B-NNN` dalında da yazılıdır): orada tarama ve devam/yeni sorusu var, sen soramazsın — ve düşersen **dağıtılmayan başka bir kaydın işini** yaparsın, ki o koşumun donmuş listesini, sırasını ve ölçüt 8'in atıf ölçüsünü birden bozar. Brief bir önceki ajanın kirini devrettiyse (brief madde 6 — ölen tur ya da kopan relay) önce onu Adım 3–5'le commit'le — kaydı kapatan turun commit'e varamamış işidir; sonra hâli dönüş mesajında adıyla bildir ve turu kapat; hükmü koşumun kendisi verir (`run-phase` → `Kulvar — QUICK`).

**Argüman `B-NNN` biçimindeyse** iş, kanvasta bekleyen o **bulgunun** işidir: taramayı ve devam/yeni sorusunu yine atla — hangi işin yapılacağı argümanda yazılıdır. Rotası şudur:
1. `_dev/BULGULAR.md` → `## Açık Bulgular`'da o numaranın satırını bul ve pointer'ının gösterdiği `_dev/bulgular/B-NNN-*.md` atomunu oku — **iş tanımının tek kaynağı odur** ("Gözlem" + "Kanıt"). Satır yoksa ya da atom bulunamıyorsa durma: hâli tek satırla bildir ve olağan akışa (aşağıdaki tarama) düş. ⚠️ **Bir orkestratörün alt ajanıysan olağan akışa DÜŞME** — orada tarama ve devam/yeni sorusu var, sen soramazsın: brief bir önceki ajanın kirini devrettiyse (brief madde 6 — ölen tur ya da kopan relay) önce onu Adım 3–5'le commit'le — satırı silen mezuniyet commit'e varamamış olabilir; sonra hâli dönüş mesajında adıyla bildir ve turu kapat. Hükmü koşumun kendisi verir (`run-phase` → `Kulvar — BULGULAR` → *"Satır yok" dalı*); satırın kaybolması orada tanımlı bir dal, senin çözeceğin bir belirsizlik değil.
2. ⚠️ **Bu bulguya ait ZATEN açık bir kayıt varsa onu devral, ikincisini açma** — `**1 iş = 1 QUICK dosya**` (→ Önemli Kurallar). Ölçüsü tek `grep`'tir: `_dev/tasks/quick/`'te Durum'u ⬜/🔄/⏸️ olan ve gövdesinde o `B-NNN`'i anan kayıt. **İsabet hüküm değildir** — atıf bir bağlam cümlesi de olabilir; kaydın "Ne Yapılacak"ı gerçekten bu bulgunun işini tarif ediyorsa devral (Adım 3'te o dosyayı güncelle), etmiyorsa yeni kayıt aç. Ayırt edemiyorsan seçme, sor.
3. Kaydı yazarken (Adım 3) "Ne Yapılacak" bölümü bulgunun numarasını **`B-NNN` olarak anar** — bulgu ile kaydı birbirine bağlayan tek iz odur — ve kapanışta **mezuniyet zorunludur** (→ Önemli Kurallar).
⚠️ **Rotası canlı bir bulguya kendiliğinden uzanma** (`→ Faz N` / `→ TASK-X.YY` işaretli satır): hüküm Önemli Kurallar'daki *"İşaretli bulguya uzanma"* maddesinindir ve burada tekrarlanmaz. **İşaret kalın yazılmış olabilir** (`→ **Faz 8**`); çıplak desen onu kaçırır.
⚠️ **Bulgu zaten çözülmüş çıkarsa iş boşa değildir — MEZUNİYETTİR:** index satırı açıkken atomu kapalı olan (ya da tersi) hâl sahada olağandır. O hâlde çözümü yeniden yazma; kanıtı doğrula ("çözüm teyidi kanıt ister" → Bulgu Sistemi), sonra kanvas kuralını uygula ve bunu dönüş mesajında adıyla bildir.

**Kimlik ölçütü** (belirsizlik bırakmaz): argüman **baştan sona** `QUICK-<sayı>` kalıbına uyuyorsa **kayıt kimliği**, **baştan sona** `B-<sayı>` kalıbına uyuyorsa **bulgu kimliğidir** — ikisi de büyük/küçük harf ayrımsız, dosya adının konu eki yazılmışsa o da kabul (`QUICK-007-login-yonlendirme` · `B-014-mobil-lcp`). Başka her şey serbest metindir; **tek başına sayı kimlik değildir** (`135` bir iş tanımı da olabilir, ayırt edilemez).

**Kaydı bulma — üç kademe, sırayla:** (1) argüman **tam dosya adıysa** (konu eki dahil) önce onu birebir dene; tek dosya verirse o kayıttır. (2) Vermezse `_dev/tasks/quick/QUICK-<sayı>-*.md` ile ara — **sıfır dolgusu ayrımsızdır** (`QUICK-7` → `QUICK-007-*.md`). (3) Bu arama **birden çok dosya döndürürse** aralarından `**Durum:**` satırı taşıyanı seç — kayıt odur; ötekiler aynı numarayı paylaşan **yardımcı dosyalardır** ve kayıt değildir. Hâlâ birden çok kayıt kalıyorsa seçme, kullanıcıya sor.
⚠️ **"Olmamalı" deme, ölç — sahada olağan iki hâl var:** aynı numaradan onlarca yardımcı dosya (`QUICK-164-KALEMLER` gibi) ve **tarihle adlandırılmış kayıtlar** (`QUICK-2026-06-30-…`, ki `<sayı>` olarak `2026` okunur ve o projenin bütün kayıtlarıyla eşleşir). Birinci hâli kademe (3), ikinciyi kademe (1) çözer; ikisi de çözemezse hüküm yine sormaktır.

Argüman yoksa (ya da serbest metinse) önce `_dev/tasks/quick/` klasöründe Durum'u ⬜/🔄/⏸️ olan kayıt var mı bak (grep yeterli). Varsa (birden çoksa hepsini kısaca listele) kullanıcıya sor — **soru kaydın durumuna göre kurulur**:

- **🔄/⏸️ (yarım iş):** "QUICK-NNN ([konu]) yarım duruyor — ona mı devam edelim, yeni iş mi?" Devam seçilirse o kaydı oku ("Son Yaklaşım" / "Sonraki Adım Detayı") ve kaldığı yerden sürdür.
- **⬜ (hazırlanmış iş):** "QUICK-NNN ([konu]) önceki oturumda hazırlandı, henüz başlanmadı — onu mu yapalım, yeni iş mi?" Seçilirse "Ne Yapılacak" bölümünü oku ve işe **baştan** başla — o kayıtta sürdürülecek bir yer yoktur (Adım 3 → ⬜ kuralı).

İki hâlde de yeni QUICK dosyası açılmaz; kayıt ⏸️ ise DURUM'daki Duraklatma Notu'nu da "Duraklatma yok" haline döndür (template kuralı: devam edildiğinde silinir). Kullanıcı o kaydı artık yapmayacağını söylerse Durum'unu ❌ İptal yap — soru bir daha tekrarlanmaz; kayıt ⏸️ idiyse DURUM'daki Duraklatma Notu'nu da "Duraklatma yok" haline döndür (iptal de duraklatmayı kapatır).

Yeni işse — **ve argümanda serbest metin gelmediyse** — kullanıcıya ne yapmak istediğini sor; kısa ve net bir açıklama yeterli. Argüman zaten iş tanımıysa onu al, aynı soruyu ikinci kez sorma; yalnız gerçekten belirsiz bir nokta varsa tek netleştirici soru sor.

### 1b. İşin Türü (yalnız `_dev/GIT-STRATEJI.md`'de bir yayın hattı beyanlıysa)

Tek dallı projede **bu adım atlanır** — her iş çalışma dalında yapılır, tür diye bir şey yoktur.

⚠️ **Bir orkestratörün alt ajanı olarak koşuyorsan bu teyit SANA sorulmaz** (brief madde 1: *"kullanıcıyla doğrudan konuşamazsın"*) ve türetme de yapılmaz: aşağıdaki iki türün tanımı *"**kullanıcı tetiklemesiyle** başlar; kendiliğinden başlatma"* olduğu için, orkestratörün açtığı bir iş tanım gereği **çalışma quick'i**dir — ölç, kayda öyle yaz, devam et. **Ama ölçümün gerçekten yayın ya da acil düzeltme rotası gerektirdiğini gösteriyorsa o rotayı AÇMA:** ne başlat ne varsay — işi olduğu yerde bırak ve dönüş mesajında **adıyla** bildir (ne ölçtün, hangi rota gerekiyor). Kararı kullanıcı verir; o iki tür orkestratörün kara listesindedir ve **hiçbir onay kolu onu açmaz** (`lib/kosum-kulvar.md` → Kulvar → kara liste). Bu fıkra yasağın alt ajan tarafındaki yarısıdır: orkestratör türü dağıtım anında ölçemez, çünkü ölçecek kayıt henüz yoktur (Adım 3).

**Devam oturumunda önce kayda bak:** Yarım bir `QUICK-NNN` devralındıysa — Adım 1'in taraması, kimlik argümanı **ya da `resume` Adım 4** üzerinden — türü o kayıt taşır (**Tür:** alanı, Adım 3) — oku ve geç, ölçme ve sorma. Tür işin kimliğidir, oturumun değil: yeniden türetmek hem kullanıcıya aynı soruyu ikinci kez sordurur hem de ölçüm o arada değiştiyse akışı **başka bir dala** çevirebilir. Alan kayıtta yoksa aşağıdaki ölçüm+teyit akışını işlet ve cevabı bu kez kayda düş — iki hâlde yoktur: eski kayıt, ve **hazırlanmış (⬜) kayıt** (türü ölçmek işi *başlatan* oturumun işidir, hazırlayanın değil).

Çalışma ve yayın dalı ayrıysa quick üç türden biridir; türü **iş başlamadan** belirle:

| Tür | Nerede | Akışın tarifi |
|-----|--------|----------------|
| **Çalışma quick'i** (varsayılan) | çalışma dalı | Bu dosyanın olağan akışı (Adım 2'den devam) |
| **Yayın** | çalışma dalı → yayın dalı | GIT-STRATEJI → Yayın |
| **Acil düzeltme** | GIT-STRATEJI'nin tarif ettiği rota | GIT-STRATEJI → Acil Düzeltme |

**Soruyu boş sorma — doldurup teyit ettir.** Protokol gereği DURUM'u zaten okudun; Versiyon Sonu Durumu `prd_review_bekliyor` ise ve yayın boşluğu varsa muhtemel tür **yayın**dır. Ölç, sonra sor.

Ölçüm tarifi **`.claude/commands/devflow/lib/yayin-boslugu.md`**'dedir — dosyayı Read ile oku (çağrı başına bir kez), bash bloğunu **aynen çalıştır** ve sonucun yorumunu oradan al (tek ev; iki kopya zamanla ayrışır). Sayı çıkmazsa "ölçemedim" de, sayı uydurma. Dosyanın "Ölçümden sonra" bölümü **bu çağrıda işlemez** — o `review-phase`'e aittir (orada da yazılı).

```
Bu versiyonun kapanış işleri bitmiş görünüyor ve <çalışma> dalında <ölçülen sayı> commit
henüz <yayın>'a çıkmamış — bu bir **yayın** oturumu mu? (değilse: çalışma quick'i / acil düzeltme)
```
Versiyon Sonu Durumu `prd_review_bekliyor` **değilse** (döngü ortası ya da eski, `Tür:` alanı olmayan bir kayıt devralındı) doldurulacak bir sinyal yoktur — kalıp durum-nötr olur:
```
<çalışma> dalında <ölçülen sayı> commit henüz <yayın>'a çıkmamış, ama ortada bir versiyon
kapanışı da yok — varsayılan **çalışma quick'i**; onaylıyor musun? (değilse: yayın / acil düzeltme)
```

**Yayın ve acil düzeltme türlerinde:**
- Akışın adımları **GIT-STRATEJI'de yazılıdır** — buraya kopyalanmaz (tek ev). Oradaki sırayı **adım adım, her adımda kullanıcı onayı alarak** uygula.
- Bu iki tür **kullanıcı tetiklemesiyle** başlar; kendiliğinden başlatma.
- Doğrulama kapısı beyanlıysa (yayın öncesi bir şeyin yeşil olması gerekiyorsa) **atlanmaz**; ajan bekleyemiyorsa kullanıcının doğrulamasını bekle.
- Çakışma çıkarsa kendin çözme — hangi dosya, hangi satır, hangi taraf ne demek: kullanıcıya taşı.
- İş yine bir QUICK kaydı alır (Adım 3) — "ne zaman, hangi versiyon yayınlandı" sorusunun cevabı orada durur.

Tür belirlenince (üç türün hangisi olursa olsun) **kayda yaz** — Adım 3'teki `**Tür:**` alanı. İş oturuma sarkarsa bu adımın tek kalıcı izi odur.

> **Git stratejisinin kendisini kurmak/değiştirmek** de meşru bir quick işidir (örn. tek daldan çalışma+yayın ayrımına geçiş). Tarifi `.claude/commands/devflow/lib/git-strategy-kurulum.md`'dedir — probe, teyit, **doküman yeni doğduysa protokole bağlama** ve değiştirme durumunda üç ek adım (iz taraması, dış varsayımlar, ilk yayın penceresi) orada yazılıdır.

### 2. İşi Yap

- Kodu yaz
- Gerekirse test et
- İş bir doğrulama/kabul kapısı ürettiyse yeşilini sına — kural tek evde: `run-task` → Adım 3. Kaydı (ne koşuldu → ne görüldü) QUICK dosyasının **## Not** alanına yaz; quick'te "Test Sonuçları" alanı yoktur
- Kullanıcı oturum içinde ek iş eklerse aynı akışta devam et — yeni QUICK dosyası açma, mevcut iş kapsamını genişlet. **Ayrım "sonra" sözcüğündedir:** iş bu oturumda yapılacaksa kapsam genişler; kullanıcı bilinçle sonraya bıraktıysa bu oturumun işi değildir — Önemli Kurallar'daki İstisna işler (yeni `⬜` kayıt)

### 3. Quick Task Kaydını Oluştur/Güncelle (Oturum Sonunda)

Kullanıcı oturum sonu sinyali verince (örn. "tamam", "kapat", "commit at"; veya `/devflow:pause` / `/devflow:double-check` çağrısı), `_dev/tasks/quick/` klasöründe işin QUICK dosyasını yaz.

⚠️ **Kullanıcıyla konuşamayan bir oturumda o sinyal HİÇ GELMEZ — bekleme.** Bir orkestratörün alt ajanı olarak koşuyorsan (brief madde 1: *"kullanıcıyla doğrudan konuşamazsın"*) bu adımın tetiği **işin bitmesi ya da turun sınırına gelinmesidir**; kaydı orada yaz ve akışa devam et. Motorda oturum-sonu sinyaline bağlı tek adım budur — beklenirse tur, işi yapmış ama **kaydını yazmamış** olarak kapanır ve orkestratörün ilerleme ölçüsü kaydın `**Durum:**` alanına baktığı için tur *"ilerleme yok"* sayılır. Devam oturumundaysan mevcut `QUICK-NNN` dosyasını güncelle — Yapılanlar/Değişen Dosyalar'a ekle, Durum'u ve Tarih'i tazele, yeni dosya açma:

**Dosya adı:** `QUICK-NNN-[konu].md` (NNN = sıralı numara, klasördeki son numaradan devam eder — **numarayı yalnız quick oturumu tahsis etmez:** `⬜` kayıt açan her oturum aynı kuralı uygular ve aynı anda yazan iki oturum aynı numarayı seçebilir; dosya adı çakışırsa var olanı ezme, bir sonraki numarayı al (CLAUDE.md → Paralel Oturum Farkındalığı); [konu] = işin kısa, dosya sistemi-güvenli özeti — kebab-case, ASCII karakterli. Örnek: `QUICK-007-login-yonlendirme-hatasi.md`) Yeni numara yalnız **yeni iş** için açılır; devam oturumu mevcut dosyayı günceller.

```markdown
# QUICK-NNN: [Kısa açıklama]

**Tarih:** [tarih]
**Durum:** [⬜ Bekliyor | ✅ Tamamlandı | 🔄 Devam edecek | ⏸️ Duraklatıldı | ❌ İptal — birini yaz]
**Tür:** [yalnız yayın hattı beyanlıysa — çalışma quick'i | yayın | acil düzeltme; tek dallı projede bu satır hiç bulunmaz]

## Ne Yapılacak
[Kullanıcının açıklaması — oturumda eklenen ek iş varsa onu da kapsa. **İş kanvastaki bir bulgudan geldiyse numarası `B-NNN` olarak burada anılır** (Adım 1'in `B-NNN` dalı) — bulgu ile kaydı birbirine bağlayan tek iz odur ve kapanışta mezuniyetin tetiğidir]

## Yapılanlar
- [yapılan 1]
- [yapılan 2]

## Değişen Dosyalar
- [dosya 1]
- [dosya 2]

## Not
[varsa ek not]

## Son Yaklaşım
[Yalnız iş bitmediyse (🔄/⏸️) — son düşünülen yaklaşım, nerede kalındı]

## Sonraki Adım Detayı
[Yalnız iş bitmediyse (🔄/⏸️) — devam oturumu tam olarak ne yapacak]
```

**`Tür:` satırı koşulludur** — yalnız Adım 1b çalıştıysa (yani `_dev/GIT-STRATEJI.md`'de bir yayın hattı beyanlıysa) yazılır ve üç değerden **birini** taşır; tek dallı projede tür diye bir şey yoktur, satır dosyada hiç bulunmaz. Proje sonradan yayın hattına geçerse satır o quick'in bir sonraki oturumunda doğar (Adım 1b).

İş bitmediyse (🔄/⏸️) son iki bölüm **zorunludur**; iş bittiyse (✅) ya da henüz başlamadıysa (⬜) bu iki bölüm dosyada bulunmaz — devam oturumunda ✅'a çekerken varsa sil. Durum ayrımı: **⬜ Bekliyor** = iş hiç başlamadı, kaydı **başka bir oturum hazırladı** (aşağıdaki fıkra); **🔄 Devam edecek** = iş bitmedi, oturum normal kapandı — sonraki quick oturumu Adım 1'de devam etmeyi sorar; **⏸️ Duraklatıldı** = `/devflow:pause` ile duraklatıldı — DURUM'a Duraklatma Notu yazılır (not eksik kalsa bile Adım 1 taraması ⏸️'yi yakalar); **❌ İptal** = yapılmayacak (Adım 1 taraması dışına çıkar).

**⬜ Bekliyor, işi *yapacak* oturumdan önce açılan kayıttır — bir oturum kendi yaptığı işin kaydını asla ⬜ yazmaz.** Yani bu adımda yazdığın kayıt hiçbir zaman ⬜ olmaz; ⬜ kaydı **başka bir iş için, başka bir oturum** hazırlar. Hazırlayan, faz döngüsünün ya da bir denetimin oturumu olabileceği gibi **bir quick oturumu da olabilir** — kullanıcının karara bağlayıp sonraya bıraktığı iş (Adım 2 → "Ayrım 'sonra' sözcüğündedir"; Önemli Kurallar → İstisna). Kim olursa olsun kaydı **kendi kapanışında** açar (kanon ve dört koşulu: CLAUDE.md → Oturum Kapanışı). O kayıtta "Yapılanlar" / "Değişen Dosyalar" **başlıkları durur, gövdeleri boştur** (işi alan oturum onları doldurur — boşluk placeholder kalıntısı değildir, `⬜` durumunun beklenen hâlidir), "Son Yaklaşım" / "Sonraki Adım Detayı" **bulunmaz** (yarım iş değil, hiç başlamamış iş) ve `**Tür:**` satırı **yoktur** — türü işi başlatan oturum ölçer (Adım 1b). Tek dolu bölüm **"Ne Yapılacak"tır** ve işin tek kaynağıdır: sonraki oturum onu okuyup başlayabilmeli — ne, neden, nerede, ne zaman bitmiş sayılır. **Kaydı açan komut bir öncelik hükmü verdiyse** ("X bundan sonra gelir") o cümle de buraya yazılır: sırayı okuyan tek yer burasıdır (kanon: CLAUDE.md → Oturum Kapanışı → Terfi kuralı). İşi devralan ilk quick oturumu Durum'u 🔄/✅'ya çeker (yapmayacaksa ❌).

### 4. DURUM.md Güncelle

DURUM.md'de aktif faz bilgisini bozmadan, quick task'ı yalnızca **"Son Güncelleme"** satırına kısaca not et — **numarasıyla ve durumuyla** (`QUICK-135 (login yönlendirme) 🔄 devam edecek`). Kapanış bloğu (Adım 6) bu satırın insan-okur yankısıdır; numara burada yoksa blok kayıtsız konuşur. İstisna (Duraklatma Notu): duraklatılmış (⏸️) bir quick'i devralan ya da kapatan (❌ İptal / faza taşıma) oturum DURUM'daki **Duraklatma Notu**'nu "Duraklatma yok" haline döndürür (template kuralı: devam edildiğinde veya iş iptal edildiğinde silinir). **Hazırlanan ⬜ kayıt bu satıra girmez** — Son Güncelleme bu oturumun tek cümlelik özetidir, iş listesi değil; ⬜ kaydın evi kendi dosyasıdır ve klasörü tarayan komutlar onu oradan bulur (kanon: CLAUDE.md → Oturum Kapanışı). **"Son Task Özetleri" bölümüne YAZMA** — orası DURUM KURAL'ına göre yalnız aktif fazın TASK-X.YY task'larına ayrılmıştır; quick task bir faz task'ı değildir ve tam kaydı zaten `quick/QUICK-NNN` dosyasındadır.

### 5. Git Commit & Push

Bu oturumun tüm değişikliklerini (kod + doküman) tek commit'te gönder (dosya-bazlı stage — CLAUDE.md → Paralel Oturum Farkındalığı). ⚠️ **Commit'ten hemen önce `git status -sb` koş** — kanonun commit-anı kapısının aleti odur ve dalı ile index'i birlikte gösterir: ilk sütunu boşluk/`?` dışında bir **yabancı** satır varsa stage'ini düşür, çakışmalı yol varsa dur ve sor. Oturum açılışındaki bakış yetmez; paralel oturum asenkrondur. ⚠️ **Adım 3 bir bulgu atomunu `bulgular/archive/`'e mezun ettiyse: taşıma düz `mv`'dir (`git mv` değil) ve commit'e ESKİ yolu da stage et** — silme index'e kendiliğinden yazılmaz; yalnız yeni yolu stage edersen HEAD'de iki kopya kalır ve silme kalıcı olarak stage'siz görünür.

**Push bu oturumun son işidir — kendi push'unun CI/workflow sonucunu bekleme;** kapanış bloğunu yaz (Adım 6) ve oturumu kapat (kanon: CLAUDE.md → Commit Stratejisi). Uzak koşumun kapı-sahibi faz döngüsündeki bir sonraki `verify-phase` → Otomatik Kontroller'dir ve kapsamı repo-genelidir — kırık sürüyorsa orada görülür. **İstisna:** `_dev/GIT-STRATEJI.md`'de beyanlı yayın kapısı — yayın türünde o kapı Adım 1b'nin akışındadır. Projede push sonrası CI/kapanış teyidi isteyen **beyanlı bir kural** varsa (protokolde okuduğun memory → "Süreç Disiplinleri") ne sessizce uy ne sessizce ez: **kullanıcıya sor** — motor kuralı ile projenin sınanmış kuralı çatışıyorsa hakem odur. Gerekçe ve tam akış: `run-task` → Adım 8.

**Commit formatı (scope'suz — quick mode):**
```
fix: kısa açıklama
feat: kısa açıklama
chore: kısa açıklama
refactor: kısa açıklama
docs: kısa açıklama      ← yalnız doküman değiştiyse (örn. GIT-STRATEJI kurulumu)
```
Prefix seçimi baskın değişikliğe göredir — kanon: CLAUDE.md → Commit Convention. Quick'in tek farkı **scope yazılmamasıdır**.

> **Yayın / acil düzeltme türünde** dal hareketleri Adım 1b'deki akışın parçasıdır ve orada tamamlanmıştır; burada yalnız bu oturumun QUICK kaydı ve DURUM güncellemesi **çalışma dalına** commit'lenir.

### 6. Sıradaki Adımı Öner

Kapanış bloğunun kanonu **CLAUDE.md → Oturum Kapanışı**'dır; burada yalnız quick'e özgü dallar tanımlanır. **Önce yükümlülükler:** blok ancak QUICK kaydı yazıldıktan (Adım 3 — iş bitmediyse "Son Yaklaşım" / "Sonraki Adım Detayı" dolu), DURUM güncellendikten (Adım 4), varsa bulgu mezuniyeti yapıldıktan ve Gelen Kutusu satırı düşüldükten (Önemli Kurallar) sonra yazılır.

**Bu oturumun kendi işi varsayılan olarak önce gelir.** `📋` satırının varsayılanı budur: iş bitmediyse (🔄) sıradaki adım **onu sürdüren** komuttur — başka bir kayıt, bu oturumun hazırladığı ⬜ kayıt dahil, `önerilir:` önekiyle ve kimlik argümanıyla son satıra girer. **İstisna kanonun terfi ölçütüdür** (CLAUDE.md → Oturum Kapanışı → Terfi kuralı): hazırlanan kayıt bu işin sürdürülmesini **engelliyorsa** — ya da kayda bir öncelik hükmü yazdıysan (Adım 3) — `📋` o kayıttır (`/devflow:quick QUICK-NNN`), sürdürme komutu `→` satırında "ondan sonra" diye anılır ve kalem son satırda tekrarlanmaz. Terfi, şablonun değil ölçütün kararıdır; hangisinin önce geldiğine karar veremiyorsan bloğu yazmadan sor.

**Aşağıdaki faz-döngüsü dalları koşulludur** — yani yalnız bu oturumun işi kapandığında (✅/❌). Kanonun döngü-dışı varsayılanı *devralınacak başka bir iş yokken* geçerlidir: `_dev/tasks/quick/` klasöründe başka bir ⬜/🔄 kayıt varsa ya da bu oturum bir ⬜ kayıt hazırladıysa sıradaki adım odur: `/devflow:quick QUICK-NNN`. **Klasörü bilmenin iki yolu var, ikisini karıştırma:** oturum argümansız ya da serbest metinle açıldıysa Adım 1'in taraması onu zaten gördü — yeniden taramaya gerek yok. Ama oturum **kimlik argümanıyla** (`/devflow:quick QUICK-NNN`) ya da **`resume` üzerinden** açıldıysa Adım 1'in taraması bilerek atlanmıştır (Adım 1'in ilk fıkrası · `resume` Adım 4) — o hâlde elinde veri yoktur: bloğu yazmadan önce klasöre tek `grep` at. Bu iki yol, hazırlanmış bir kaydın devralınmasının **birincil** yoludur; taramayı yapılmış saymak, ön-hazırlık zincirinin en sık kullanılan dalında sessizce kopmasıdır. Birden çok aday varsa hangisinin önce geldiğine karar veremiyorsan bloğu yazmadan sor (kanon).
⚠️ **Bir orkestratörün alt ajanı olarak koşuyorsan bu soru SANA ait değildir** (brief madde 1: *"kullanıcıyla doğrudan konuşamazsın"*): kuyruğun sırası koşumun **aktif kulvarındadır** (`run-phase` → `lib/kosum-kulvar.md`'nin o kulvara ait `Sıra` bölümü) ve orkestratör onu kendi sabit listesinden verir — **o listenin ne olduğu kulvarındır ve senin gördüğün bekleyen kayıt orada bulunmayabilir** (bulgu kuyruğunu eriten bir koşumda liste açık bulgulardır, quick kayıtları değil); sıralama yine senin işin değildir. `📋` **yalnız bu turun kendi kaydını** bildirir — iş sürüyorsa onu sürdüren komut, kapandıysa kanonun döngü-dışı varsayılanı; kalan kuyruğu sıralamaya kalkma ve sırayı sormak için turu durdurma (brief'in terfi cümlesi bu kuralın dışındadır). Aksi hâlde kuyruğun her turu bir soru üretir.

Dal, QUICK kaydının **Durum** alanına göre seçilir:

**🔄 Devam edecek** — iş bitmedi, oturum normal kapandı:
```
✅ QUICK-NNN üzerinde çalışıldı — iş devam edecek.
📋 Sıradaki adım: /devflow:quick QUICK-NNN
   → [konu] — kaldığı yerden sürer; handoff kayıtta (Son Yaklaşım / Sonraki Adım Detayı).
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```
Bu dalda **faz döngüsünün komutu önerilmez**: 🔄 quick faz döngüsünün konumunu bilinçli olarak bozmaz (Adım 4) — numarası DURUM'un Son Güncelleme satırında durur ama **Adım** alanında durmaz, yani `Adım`'dan türeyen komut onu göremez ve yarım iş görünmez olur. (**⏸️ farklıdır** — bloğunu ve devam yolunu `pause` yazar, aşağıya bak.) Numara komut satırında durur — Adım 1'in devam/yeni sorusunu atlatan tek şey odur (kanon: CLAUDE.md → Oturum Kapanışı → **kimlik argümanı**).

**✅ Tamamlandı** — iş bitti:
```
✅ QUICK-NNN tamamlandı — [tek cümle ne yapıldı].
📋 Sıradaki adım: /devflow:[DURUM → Adım'dan türeyen komut]
   → [faz komutuysa: Faz döngüsü kaldığı yerden sürer | `prd-review` ise: versiyon sonu değerlendirmesi sırada]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```
`📋` satırındaki komutu **DURUM'un Adım alanından** türet — kaynak kanonun *"Faz döngüsünün sıradaki komutu"* maddesidir ve **eşleme tablosu tek başına yanıltır**, dört özel durumu da orada okunur (CLAUDE.md → Oturum Kapanışı). Quick bu alanların hiçbirine dokunmadığı için değerleri oturuma girerkenki hâliyle durur — okuman yeter, ölçmen gerekmez. Türetme komut vermiyorsa (`Adım` **alanı yok** · tanınmayan değer · tablolarla çelişki · versiyon-geçişi sınırı, yani `Adım` boş **ve** Versiyon Sonu Durumu `prd_review_bekliyor` **değil**) **komut uydurma**: `📋 Sıradaki adım: yok — [bekleme koşulu]` yaz ve gördüğün hâli tek cümleyle söyle — **`→` satırına değil**, onu kanon `yok` dalında yasaklar (*"`yok` dalında hiç yazılmaz"*); hâl özet satırına ya da bekleme koşulunun kendisine girer.

**❌ İptal / faza taşındı:**
```
✅ QUICK-NNN kapatıldı — [iptal gerekçesi | PHASE-N'e taşındı].
📋 Sıradaki adım: /devflow:[DURUM → Adım'dan türeyen komut]
   → [faza taşındıysa: Faz N'in akışı devralıyor | faz komutuysa: Faz döngüsü kaldığı yerden sürer | `prd-review` ise: versiyon sonu değerlendirmesi sırada]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**⏸️ Duraklatıldı** — bloğu **quick yazmaz**: oturum `/devflow:pause` ile kapanıyordur ve nihai blok onundur (`pause` Adım 4 — `📋`'si orada yazılıdır, notu yazdırılmayan BULGULAR turu dahil). Araya `double-check` girerse o da yenisini uydurmaz: yukarıdaki dalların bloğunu **yineler**, ardından `pause` çalışacaksa nihai bloğu yine `pause` yazar (`double-check` Adım 6). **`prd-save` bu devrin parçası değildir** — o yalnız PRD oturumlarında (`prd` · `prd-refine` · `prd-review`) çağrılır, quick oturumu onunla kapanmaz (`prd-save.md`:7).

---

## Önemli Kurallar

- **1 iş = 1 QUICK dosya** (oturum sayısından bağımsız). Aynı oturumda ek iş gelirse mevcut iş kapsamını genişlet — yeni QUICK dosyası açma; iş sonraki oturuma sarkarsa aynı `QUICK-NNN` dosyası güncellenerek devam edilir, yeni numara yalnız yeni iş için
- Quick mode'da faz dokümanları oluşturulmaz/güncellenmez — **tek istisna** aşağıdaki "Tersi de meşrudur" kalemidir (koşulları orada)
- Quick task'lar archive'a taşınmaz — `_dev/tasks/quick/` içinde kalır
- İş **planlama/koordinasyon** gerektirmeye başladıysa (kapsam tartışması, çok-modüllü tasarım) → kullanıcıyı uyar, faz döngüsüne taşımayı öner. "Sadece uzun sürüyor" faz sebebi değildir — iş bitmediyse detaylı handoff yazıp (Son Yaklaşım / Sonraki Adım Detayı) sonraki oturumda devam et; pratik sinyal: ~3 oturumu geçiyorsa faz düşün (sayısal kural değil, turnusol). Faza taşınırsa QUICK kaydını kapat (Durum: ❌ İptal, Not'a "faza taşındı → PHASE-N" düş; kayıt ⏸️ idiyse Duraklatma Notu'nu da "Duraklatma yok" haline döndür)
- Eğer quick task bir feature'ın davranışını değiştiriyorsa (yeni davranış kuralı, kapsam değişikliği), kullanıcıyı uyar: "Bu değişiklik feature davranışını etkiliyor. `/devflow:prd-note` ile kaydetmeni öneririm, böylece PRD ve MODULE dokümanları versiyon sonunda güncellenebilir."
- İş sırasında kapsam dışı bir sorun/uyarı görürsen kullanıcıya bildir — quick zaten ad-hoc işin evidir: kullanıcı isterse çözümü aynı quick kapsamına almak meşrudur; almazsa oturum sonunda — Adım 3'te QUICK kaydını yazarken, NNN belli olduğunda — `_dev/BULGULAR.md` → Gelen Kutusu'na `[QUICK-NNN]` işaretli tek satır düş (kural → CLAUDE.md "Gördüğün sorunu düşürme"). **İstisna, kullanıcının karara bağladığı iştir:** "bunu da yapalım ama sonra" dendiyse ortada triyaj bekleyen bir gözlem değil ertelenmiş bir iş vardır — evi kanvas değil **yeni bir ⬜ QUICK kaydıdır** (kanon: CLAUDE.md → Oturum Kapanışı → ön-hazırlık; ayırt edici ölçüt kararın verilmiş olmasıdır)
- **Tersi de meşrudur:** kanvasta bekleyen bir bulguyu (`B-NNN`) faz döngüsünü beklemeden quick ile çözmek — ister oturum baştan onun için açılmış olsun (kimlik biçimi `/devflow:quick B-NNN`, rotası Adım 1) ister iş sırasında kapsama alınsın. **İşaretli bulguya uzanma** (`→ Faz N` / `→ TASK-X.YY`): rotası canlıdır, quick'le kapatmak faz/task dokümanında ölü atıf bırakır — gerçekten gerekiyorsa önce kullanıcıya sor, onaylanırsa hedef faz/task dokümanındaki kaydı da kapat ("QUICK-NNN ile çözüldü"); faz ✅ ile donmuşsa ya da hedef task arşivlenmişse dokunma (tarihsel doküman), yalnız kullanıcıya bildir
- Quick kapsamına alınan bir bulguda (iki hâlde de: oturum baştan onun için açılmış olsun ya da iş sırasında kapsama alınmış olsun) **kapanışı kanvas kuralına göre yap** (`_dev/BULGULAR.md` → Bulgu Sistemi) — **Adım 3'te**, QUICK kaydını yazarken: atom mezun edilmezse çözülen bulgu index'te açık görünmeye devam eder. Zamanlama zorunludur — Adım 5'in tek commit'i BULGULAR index'ini ve mezun edilen atomu da kapsamalı; sonraya bırakılırsa mezuniyet diskte kalır, repoya girmez
