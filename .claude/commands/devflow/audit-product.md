# DevFlow — Ürün Denetimi (Audit Product)

Bu komut projenin **ürettiği ürünü** denetler: davranış, kullanıcı akışları, edge-case'ler, tutarlılık, UI/UX, altyapı. `audit-docs`'un kardeşidir — o dokümanları güncel konvansiyona karşı denetler, bu ürünü projenin kendi iddialarına (kabul kriterleri, davranış kuralları, ilkeler) karşı denetler.

Varlık nedeni: faz döngüsü odakla çalıştığı için güçlüdür — ama aynı odak, dışında kalan boşlukları görünmez kılar. verify-phase faz penceresinde çalışır; senaryo testi fazı versiyon sonunda bir kez, faz döngüsünün içinde koşar ve bulgularını düzeltme task'larına döndürür; **bu komut ise zamana ve döngüye bağlı değildir** — her an çağrılır, çıktısı kanvastır ve en uzun süredir kimsenin bakmadığı yerde biriken sessiz drift'i aramak için vardır. İşi kullanıcının gözünden kaçanı bulmaktır; kullanıcının zaten bildiğini yeniden keşfetmek değil.

**Kod değiştirmez, projeye bağımlılık eklemez.** Çıktısı bulgu ve öneridir; hepsi `_dev/BULGULAR.md` kanvasına birikir ve faz döngüsünde ele alınır (discuss-phase → bulgu fazı); sırasını bekleyemeyen bulgu için `/devflow:quick` döngü-dışı rotadır. Faz döngüsüne otomatik bağlı değildir — tamamen manuel tetiklenir, `next` kapsamı dışındadır, DURUM'un Aktif Faz/Adım alanlarına dokunmaz.

**Kullanım:** `/devflow:audit-product [tur talimatı]`

Tur talimatı serbest metindir ve **o turla sınırlıdır**: odak ("auth akışları"), derinlik, notlar ve izinler ("prod'da şu formu deneyebilirsin"). Boşsa odağı komut seçer (Adım 2). Talimatta kalıcı nitelikte bir bilgi/izin görürsen ("her zaman", "bundan sonra") MEMORY'ye (Ortam & Araç Notları) kaydetmeyi öner — kalıcı bilgi argümanda değil MEMORY'de yaşar.

**İki mod vardır; ezberlenecek kalıp yok — niyet okunur:**

- **Çıplak çağrı = derin tur (varsayılan).** Azami kalite: çok-ajanlı keşif, canlı ürün üzerinde icra, düşmanca doğrulama (Denetim Anlayışı → Derin tarama düzeni). Önceliği doğruluk belirler.
- **Hafif tur** — kullanıcı hafiflik istediğini belirtirse ("hafif tur", "hızlıca bak", "kısa tut" gibi; kalıp değil, anlam): filo kurmadan tek oturumda hızlı geçiş. Kanvas kuralları ve kanıt standardı **aynen** geçerlidir — değişen yalnız efor ölçeğidir, titizlik değil.

---

## Ne Zaman Kullanılır

- Belirli aralıklarla proje sağlık fotoğrafı istendiğinde (rapor bunu verir)
- Fazların odağı dışında kalan bir alanda şüphe doğduğunda (tur talimatına odak yazılır)
- Versiyon sonunda (prd-review Adım 1b hatırlatır) — taze oturumda, cold-start avantajıyla
- İlk çalıştırma kanvası kurar; sonraki turlar kaldığı yerden ilerler (kapsama rotasyonu)

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz. MEMORY'nin "Ortam & Araç Notları" kategorisi bu komutun çalışma zeminidir (ürün nasıl ayağa kalkar, hangi ortam var, neye izin var).

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/BULGULAR.md` — bulgu kanvası (yoksa Adım 1 template'ten oluşturur; okuma-onayında `—` işaretle)
2. `_dev/MODULE-MAP.md` — modül/feature haritası, feature durumları (✅ olanların iddiası test edilebilir)
3. `_dev/QUALITY.md` — kalite eksenleri (denetim boyutlarına harita verir)
4. `_dev/ILKELER.md` — proje ilkeleri (öneri süzgeci: ilkeyle çelişen öneri yapılmaz)

**Göreve Göre (tur odağına göre oku)**
- Odaktaki modül dokümanları (`_dev/modules/MX-*.md`) → kabul kriterleri ve edge-case'ler = "olması gereken"in kaynağı
- PRD varsa `_dev/PRD/VERSIONS.md` + odakla ilgili `PRD/features/*.md` → davranış kuralları, kullanıcı akışları
- `_dev/docs/DECISIONS.md` → bilinçli-tercih süzgeci (bulgu sanılan şey karar olabilir)
- `_dev/PHASES.md` + son fazların retrospektifleri → bilinen sorunlar, "Ne Kötü Gitti"
- Odaktaki feature'ın faz dokümanı → MODULE-MAP'in Faz sütunundan fazını bul, `_dev/phases/PHASE-N.md`'nin "Kapsam Dışı" kaydını oku (bilinçli-tercih süzgecinin dördüncü dayanağı — Denetim Anlayışı → "Eleştirel ama bağlam-farkında"). Seçim **odakla** yapılır, "son N faz" ile değil; odak bir faza bağlanmıyorsa bu kaynak beslenmez — eksikliği rapora yaz, tahmin etme.
- Açık bulgu atomları (`_dev/bulgular/B-*.md`) → uzlaştırma ve dedup için gerekince
- `_dev/bulgular/archive/` → nüksetme şüphesinde ("bunu daha önce bulup çözmüş müydük?")

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Kanvası Uzlaştır

`_dev/BULGULAR.md` **yoksa** (ilk tur): `.claude/commands/devflow/templates/BULGULAR.md`'den oluştur (KURAL yorumları aynen aktarılır), INDEX.md'nin "Planlama Dokümanları" listesine tek satırla kaydet (INDEX KURAL'ı; `bulgular/` atomları enumere edilmez), Adım 2'ye geç.

**Varsa** kanvası gerçekle uzlaştır — uzlaştırma da denetimdir, kanıtsız "çözülmüş sayma" yok:

- **Gelen Kutusu triyajı:** her ham notu değerlendir → doğrulanabilen gerçek sorun ise bulgu atomuna dönüştür; kullanıcının bilinçli tercihi ise (sor/DECISIONS'a bak) Bilinçli Tercihler'e tek satır indir; geçersiz/bayatsa sil. **`✅ CEVAPLANDI` işaretli SORU satırı yeniden SORULMAZ** — kararı satırında yazılıdır (kancayı cevabı alan oturum yazar; BULGULAR kuralı); onu doğrudan sonuca bağla ve satırı sil.
- **İşaretli bulgular** (`→ Faz N` / `→ TASK-X.YY`): çözüm gerçekleşmiş mi bak (task arşivi, commit, gerekirse ürünü çalıştır). Teyit edilen → atomun Çözüm Kaydı doldurulur, Durum'u `✅ Çözüldü` yapılır, atom `bulgular/archive/`e taşınır, index satırı silinir (mezuniyet; olağan akışta bunu verify-phase Adım 6 zaten yapmıştır — burası güvenlik ağı). **Rotası ölmüşse** (hedef faz/task çözüm olmadan kapanmış/arşivlenmiş — PHASES.md ve task arşivine bak) → işareti kaldır, atomun Durum'unu Açık'a döndür: bulgu normal havuza geri döner. Rotası canlı ama teyit edilemeyen → olduğu gibi bekler.
- **İşaretsiz açık bulgular:** çözülmüş görünenleri hızla yeniden doğrula — teyit edilirse aynı mezuniyet işlemi (Çözüm Kaydı + Durum `✅ Çözüldü` + arşiv + satır silme); hâlâ geçerliyse dokunma.
- **Bilinçli Tercihler:** ilgili özellik projeden kalktıysa satırı sil.
- **Yarım tur notu** doluysa: önceki tur kesilmiş. Bu çalıştırmada tur talimatı da verilmişse **talimat kazanır** — yarım turu kullanıcıya tek satırla bildir, notu koru. Talimat yoksa yarım turu devral: o turun odağını ve kalan işini sürdür (bkz. Denetim Anlayışı → Kesinti ve süreklilik).

### 2. Turu Çerçevele

- **Zemin — koşullu kapı: eksik varsa sormadan başlama, tamsa oku ve geç.** Ürünün nasıl ayağa kalktığı, hangi ortamların (dev/test/prod) var olduğu, **hangi araçların kullanılabildiği** (test suite, tarayıcı otomasyonu, API/CLI), nerede neye izin olduğu MEMORY "Ortam & Araç Notları"nda yaşar. **Eksikliğin ölçütü bu dört kalemdir: biri MEMORY'den cevaplanamıyorsa zemin eksiktir** — kategori dolu görünse bile. Ayağa-kaldırma ve araçlar repodan türetilebilir (türetimi MEMORY'ye yaz); ortam envanteri ve izinler türetilemez, yalnız kullanıcıdan öğrenilir. **Eksikse denetime başlama — önce kullanıcıya sor, cevapları oraya yaz** (kısa ve tek seferlik; sonraki turlar sormaz). Bu kapı atlanırsa ürün ya hiç ayağa kaldırılamaz ya yalnız bilinen dar dilimde gezilir — denetim sessizce koda/dokümana düşer, oysa canlı gözlem kanıtın birincil kaynağıdır (→ Kanıt anlayışı).
- **Odak:** tur talimatı varsa odur. Yoksa önce **ucuz ve geniş** bir keşifle "duman nerede" haritasını çıkar (kapsama tablosunda en eski bakış + git geçmişinde en uzun süredir dokunulmamış alanlar + eldeki otomatik sinyaller), sonra riski en yüksek yere (para, veri, auth, kritik kullanıcı akışları) **dar ve derin** odaklan. **Genişlik hedefleme içindir, derinlik iş için** — bir turda her şeyi denetlemeye çalışma; genişlik turlar-arası rotasyonla sağlanır.
- **Yürütme modu:** varsayılan **derin turdur** (→ Denetim Anlayışı → Derin tarama düzeni). Yalnız kullanıcı hafiflik istediyse filo kurmadan tek oturumda geç.
- Turu tek paragrafla **bildir ve başla** — onay bekleme. Duyuru bilgilendirici olsun: odak + neden + iş paketleri/mercekler + zemin durumu (tam / eksikti-soruldu) + canlı icra yapılacak mı + derinlik. Hedef yanlışsa kullanıcı zaten keser; bulgular ayrıca doğrulama süzgecinden ve tüketim anındaki kullanıcı kararından geçer.

### 3. Denetimi Yürüt

Aşağıdaki **Denetim Anlayışı** bu adımın tarifidir — sıralı bir prosedür değil, uygulanacak bakış açısı. Doğrulanan her bulgu kanvasa **o anda** yazılır (Adım 4 formatı) — oturum sonu beklenmez; kesinti anında o ana kadarki her şey kayıtlı olur.

### 4. Bulguyu Kaydet

Atom formatı, numaralama ve yaşam döngüsü kuralları BULGULAR.md'nin kendisinde tanımlıdır ("Bulgu Sistemi — Nasıl Çalışır?" + KURAL yorumları) — orayı ground-truth al. Özet: doğrulanmış bulgu = `_dev/bulgular/B-NNN-<slug>.md` atomu + index'e öncelik-sıralı tek satır. Doğrulanamayan/niyeti belirsiz gözlem atom olmaz — rapora "soru" olarak girer **ve Gelen Kutusu'na `[audit-product SORU]` işaretli tek satır düşer** (satırın sonuna kısa kancayla kendi önerini de yaz — `— önerim: X`; yoksa öneri oturumla birlikte buharlaşır); yoksa cevaplanmayan soru oturumla birlikte buharlaşır. Kapatma yolu mevcut triyajdır: kullanıcı cevabına göre ya bulgu atomu olur, ya Bilinçli Tercihler'e iner, ya silinir — kullanıcı aynı oturumda cevaplarsa sonucu **hemen** işle, sonraki tura bırakma. PRD/vizyon düzeyine dokunan tespit için kanvas ev değildir → raporda `/devflow:prd-note` öner.

### 5. Raporla

Oturum sonunda kompakt sağlık fotoğrafı sun:

```
🔍 Denetim Turu: [odak] ([derinlik] · yürütme: [filo N ajan | sıralı])

🐞 Hatalar/Tutarsızlıklar: [n yeni bulgu — 🔴x 🟡y 🟢z, tek satır özetlerle]
💡 Öneriler (UI/UX, altyapı): [n öneri, tek satır özetlerle]
❓ Sorular: [bilinçli mi / gözden mi kaçmış — kullanıcı kararı bekleyenler; her biri kendi önerisiyle:
   "önerim X, çünkü Y" — desen: step-by-step]
📊 Kanvas durumu: [açık toplamı, bu tur mezun edilenler, kapsama güncellemesi, en eski açık: B-NNN]
📋 Rota: faz kapsamına dokunanlar → o fazın verify-phase süpürmesi · kalanlar → discuss-phase bulgu fazı
   ("bu fazı bulgulardan doldur") · bekleyemeyen → /devflow:quick
   [PRD düzeyi tespit varsa: → /devflow:prd-note önerisi]
```

### 6. Git Commit & Push

Değişiklik yaptıysan (kanvas + atomlar + INDEX/MEMORY kayıtları) commit & push yap:
```
docs: audit-product — [odak; kısa özet]
```
Değişiklik yapmadıysan commit atma.

---

## Denetim Anlayışı

**Pusula, liste değil.** Ne test edileceğini bu doküman söylemez — projenin kendisi söyler: MODULE dokümanlarının kabul kriterleri ve PRD davranış kuralları "olması gereken"i, QUALITY eksenleri denetim boyutlarını, ILKELER öncelikleri verir. Tarama açıları bunlardan türetilir; şunlar **örnektir, sınır değil**: uçtan uca kullanıcı akışları, edge-case'ler (boş/aşırı/geçersiz girdi), tüm giriş noktaları ve roller, tekrar eden sayfa/metin/kod, doküman-iddiası-vs-gerçeklik, adversarial denemeler, erişilebilirlik, performans. Proje SaaS da olsa CLI da olsa aynı anlayış uyar — çünkü harita hep projenin kendi dokümanlarından çıkar.

**Önce ucuz sinyaller.** Pahalı keşiften önce eldeki otomatik sinyalleri topla: projenin kendi test suite'i, lint, CI durumu, güvenlik/bağımlılık taramaları; uygunsa standart denetim araçları — projede kurulu olmaları gerekmez (ör. web projesinde Lighthouse). Dakikalar içinde "nerede duman var" haritası verir; derin keşif o haritayla kalibre edilir. Bu geniş tarama **hedefleme** içindir, işin kendisi değil — dumanı bulunca filoyu oraya dar ve derin yığ; geniş ve sığ bir geçiş tamamlanmış tur sayılmaz.

**Kanıt anlayışı.** Çalışan üründe gözlem, koddan çıkarsamadan üstündür — kodda fark edilmeyen sorun frontend'de kolayca yakalanır. Akışları gerçekten yürüt (Playwright/tarayıcı otomasyonu, API çağrısı, CLI); gözlem yüzeyle bitmez: **konsol hataları, network başarısızlıkları ve yavaşlıkları da bulgunun parçasıdır.** Boş grep tek başına kanıt değildir; doğrulayamadığın iddia "doğrulanamadı" olarak işaretlenir, bulgu gibi sunulmaz. Kanıt metinseldir (repro adımları, file:line, komut/konsol çıktısı) — ekran görüntüsü oturumda gösterilir, repoya binary gömülmez.

**İki tip bulgu, iki standart.** *Hata/tutarsızlık* yeniden üretilebilir kanıt ister. *Öneri* (UI/UX, altyapı/deployment, gözlemlenebilirlik) repro edilemez ama dayanaksız da olamaz: gerekçe + somut gözlem + ILKELER uyumu ister — bilinçli-minimal bir tasarıma "şunu da ekle" önerisi gürültüdür.

**Eleştirel ama bağlam-farkında.** Yanlış görünen şey bilinçli bir tercih olabilir. Bulgulaştırmadan önce süz: DECISIONS, ILKELER, faz dokümanlarının "Kapsam Dışı" kayıtları, kanvasın Bilinçli Tercihler bölümü. **Ama süzen kaydın kendisi de okunur — tercih mi, iddia mı?** (research-phase Adım 2'deki ayrımın denetim tarafı.) Tercih süzer; "zaten doğru / zaten var / etkilenmiyor" bir **iddiadır** ve canlı gözlem onu çürütüyorsa süzmez — bulgu yazılır, kayıt bulgunun bağlamına girer ("PHASE-N kapsam-dışı kaydı X diyordu, ölçüm Y"). Kapalı faz dokümanı **dondurulmuştur**: oradaki bir iddiayı tazeleyecek başka kapı yoktur (DECISIONS'ın `Superseded` notu, ILKELER'in prd-review'ı, kanvasın kendi temizliği var — bunun yok), yani ölçüm anı yalnız budur. **Kayıt bir FAZIN penceresine yazıldı, bu komutun penceresi yok:** hedef gösteren bir erteleme ("sonraki fazlara bırakıldı → Faz N") o faz gelip geçtiği hâlde iş yapılmamışsa **süzmez** — karar değil **karşılanmamış yazılı taahhüttür**, bulgunun kanıtıdır ve kaydın kendisi bulgunun bağlamına girer. Hedefi henüz gelmemiş erteleme ve kalıcı daralmalar ("bu fazda kesinlikle yapılmayacak", "bilerek basit tutuldu") süzer — rotaları bellidir. Süzgeçten sonra hâlâ emin değilsen **bulgu değil soru** yaz — varsayımla ne bulgu üret ne ele.

**Kalıcılık perspektifi.** Bulgu yalnız semptomu değil, mümkünse kök neden yönünü ve **onu gelecekte otomatik yakalayacak korumayı** da işaret eder: eksik test, eksik kontrol, eksik gözlemlenebilirlik. "Şu alanda test yok/zayıf" başlı başına meşru bir bulgudur; en değerli sorulardan biri de şudur: *"prod'da bu kırılsaydı haberin olur muydu?"* — cevap hayırsa loglama/hata-bildirimi/uptime boşluğu bulgudur.

**Sinyal/gürültü.** Kanvasa giren her satır kullanıcının dikkatinden harcar. Düşük değerli nit'i eleme cesareti, bulgu bulmak kadar önemlidir — sayı hedefi yoktur, az ama vurucu bulgu çok ama sığ bulgudan iyidir.

**Derin tarama düzeni — varsayılan budur.** Bu komut çok-ajanlı orkestrasyonu **açıkça yetkilendirir ve derin turda bunu ister**: harness'ta hangi mekanizma varsa (workflow / alt-ajan filosu) onu kur; tek oturumluk dar bir okumayla yetinme, sıralı okumaya kendiliğinden düşme. **Birden fazla mekanizma varsa doktrine uyanı seç** — orkestratörün döngüde kalıp her ham gözlemi kendi yargısından geçirmesine izin vereni; izin kapısı en az sürtünmeli olanı değil. Yürütme kipini raporun ilk satırına yaz (`filo N ajan` | `sıralı`) — **sessiz geri düşüş yoktur**.

**Filo doktrini: ajanlar keşfeder, orkestratör yargılar ve tek yazar odur** — ham gözlemi bulguya çevirme kararı ve kanvas yazımı alt ajana devredilmez (script=beyin/Claude=yargı ayrımının ajan dünyasındaki izdüşümü). İşi alan-bazlı, kendi başına tamamlanabilir paketlere böl — kesintide kaybolan en fazla uçuştaki paket olur. Bulgular bağımsız/düşmanca doğrulanır (refüte etmeye çalış; hayatta kalan yazılır). **Filoyu işin yüzeyine göre ölçekle** — "derin", "her zaman azami filo" demek değildir: küçük bir alan küçük filo alır, ölçüt kapsama ve kalitedir, gösteriş değil. **Canlı ürün üzerinde paralel çalışırken paketleri alana göre ayır** ki ajanlar birbirinin ortamını bozmasın (paylaşılan oturum/veri/port çakışması); veri değiştiren akışlar zaten yalnız dev/test'te. Model/effort seçiminde öncelik her zaman kalite/doğruluktur: mekanik geniş tarama hafif kademeye inebilir, yargı-sentez-doğrulama güçlü kademede kalır, şüphede güçlüden yana. Paralellik ve toplam ajan sınırları harness'e göre değişir — sayı ezberleme, o oturumda geçerli sınırları gözeterek paketle.

**Ajan brief'i görevi kadar dönüş kontratını da içerir.** Ajan senin bağlamını miras almaz — görev tarafına odak paketi + **zemin özeti** girer (ürün nasıl ayağa kalkar, hangi ortam, neye izin var; secret DEĞERİ asla, yalnız konumu). Dönüş tarafında ise, orkestratör yalnız kendi doğrulayabildiğini yazabildiğine göre ajanda kalan sinyal kayıp sinyaldir: **(a)** canlı sürüldüyse konsol ve network **ham** döner (JS error/warning + başarısız, 4xx/5xx ve belirgin yavaş istekler, kırpılmadan); temizse "konsol temiz / network temiz" diye **açıkça yazılır** — boş bırakılan alan "bakılmadı"yı "temiz" gibi gösterir, bu "boş grep tek başına kanıt değildir" ilkesinin ikizidir. **(b) "Kapsanmadı" alanı zorunludur** (zaman/kapsam nedeniyle dokunulmayan köşeler) — nezaket değil: Kapsama tablosu "bu alana şu tarihte bakıldı" der ve sonraki turun odağı ona dayanır; sessizce atlanan köşe tabloyu yalancı yapar — orkestratör bunu Kapsama satırının **Not** sütununa yansıtır, kısmi kapsama görünür kalır. **(c)** yalnız ajanda yaşayan kanıt ham döner — saf canlı davranış (tam URL/redirect zinciri, ham yanıt) ve **birebir yeniden çalıştırılabilir** komut; orkestratörün koddan yeniden türetebileceği özetlenebilir, türetemeyeceği özetlenemez. Orkestrasyon imkânı yoksa (ya da hafif tur istenmişse) yukarıdaki disiplinlerin tümü — paketleme, düşmanca doğrulama, kapsama dürüstlüğü — sıralı olarak aynen uygulanır.

**Kesinti ve süreklilik.** Kademeli kanvas yazımı sayesinde hiçbir kesinti turu sıfırlamaz. *Limit/bağlantı kesintisi:* oturum sürüyorsa kullanıcı "devam et" der — kesintiyi fark et, kanvastan tamamlananı ayırt et, **tamamlananı tekrarlama**, eksik paketleri sürdür. *Bağlam dolması:* orkestratör kendi bağlam kalitesini izler; olumsuz etkilenecek kadar dolduysa o ana kadarki her şeyi kanvasa işle, Kapsama bölümündeki **Yarım tur** satırına tek satır devam notu yaz ve taze oturumda devam etmeyi öner — karar kullanıcının. Turu tamamlayan oturum notu "[yok]"a döndürür. pause/resume mekanizması gerekmez — kanvas kaldığı yeri bilir (`/devflow:pause` çağrılırsa da yalnız Yarım tur satırı doldurulur, DURUM'a dokunulmaz — pause.md denetim dalı).

---

## Önemli Kurallar

- **Kod değiştirilmez, projeye bağımlılık eklenmez.** Yıkıcı olmayan çalıştırma serbesttir (test koşma, lokal ayağa kaldırma, API çağrısı, tarayıcı otomasyonu). Bağımlılık eklemek manifest/lock dosyalarına iz bırakmaktır; kurulu olmayan bir denetim aracını iz bırakmadan geçici çalıştırmak (`npx`/`uvx` tarzı) bu serbestliğin içindedir. **Neden:** denetçi dokunmaz — düzeltme faz döngüsünün işidir; denetimin değeri tarafsız gözlemde.
- **Prod ortamında salt-okunur — keskin çizgi.** Gezinme, GET, görsel/konsol gözlemi serbest; veri yazan/değiştiren her şey yalnız dev/test ortamında. İstisna yalnız kullanıcının **o turun talimatında açıkça verdiği** izindir ve o turla sınırlıdır. **Neden:** denetim güven üzerine kurulur; prod'a yazan bir denetçi kendisi bulgu olur.
- **Yazım alanı kanvastır.** Komut yalnız `_dev/BULGULAR.md` + `_dev/bulgular/` içine yazar (+ ilk oluşturmada INDEX kaydı, zemin bilgisi MEMORY'ye). Task/faz/PRD/modül dokümanlarına dokunmaz — bulguların oraya akışı faz döngüsünün işidir.
- **Varsayımda bulunma.** Bilinçli-mi-gözden-mi-kaçmış ayrımında emin değilsen soru olarak raporla; zeminle ilgili belirsizlikte (hangi ortam, hangi komut) kullanıcıya sor.
- **Bir tur = dar-derin.** Odak dışına taşan önemli bir şey görürsen Gelen Kutusu'na tek satır düş, turu dağıtma — sonraki turun odağı olur.
- **Değişiklik yapmadıysan commit atma.**
