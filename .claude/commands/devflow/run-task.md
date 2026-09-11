# DevFlow — Task Çalıştır (Run Task)

Bu komut sıradaki task'ı otonom olarak çalıştırır ve tamamlar. Her oturumda yalnızca 1 task çalıştırılır.

**Kullanım:** `/devflow:run-task` — DURUM.md'den sıradaki task'ı otomatik alır

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/tasks/TASKS-README.md` — çalışma kuralları
2. `_dev/QUALITY.md` — kod yazarken göz önünde tutulacak kalite eksenleri (Adım 2'de uygulanır)
3. Aktif task dokümanı (`_dev/tasks/TASK-X.YY.md` — DURUM.md'deki task numarasından bul)

**Göreve Göre (task dokümanından belirle)**
- Task dokümanının "Referans Dokümanlar" bölümünde listelenen `_dev/modules/` ve `_dev/docs/` dosyalarını oku

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Task'ı Oku ve Anla

Task dokümanından:
- Hedef: Ne yapılacak?
- Alt görevler: Adım adım ne yapılacak?
- Test kriterleri: Nasıl doğrulanacak?
- Referans dokümanlar: Hangi ek dokümanlar okunmalı?

### 2. Kodu Yaz

Task dokümanındaki alt görevleri sırayla uygula:
- Her alt görevi tamamla
- Kod yazarken QUALITY.md eksenlerini göz önünde bulundur (güvenlik, hata yönetimi vb.)
- Task dokümanındaki dikkat noktalarına (araştırma bulguları, edge case'ler) uy
- Memory'deki "Süreç Disiplinleri"ni gözet (varsa) — proje retrolarından çıkan icra/closure kuralları (örn. selector değişiminde e2e taraması) burada uygulanır

### 3. Testleri Çalıştır

- Mevcut testler varsa çalıştır
- Task'a özgü test gerekiyorsa yaz ve çalıştır
- Test kriterleri karşılanmalı

**Ürettiğin kapıyı sına (koşullu).** Task bir doğrulama/kabul kapısı ürettiyse — validator, guard, lint/CI kuralı, kabul script'i, "şu olmamalı" diyen bir test — yeşili tek başına kanıt değildir (aynı anlayışın faz-sonu karşılığı: verify-phase → Adım 5b). Kapının şeklini plan değil **icra** seçer, o yüzden sınama anı burasıdır. İki sınama yeter:

- **Bozuk girdi:** kapının reddetmesi gereken **gerçek** bir örnek üret ve kırmızıyı gör. Kırmızı **oturum içinde ve yerelde** aranır — kapı bir lint/CI kuralıysa kuralın kendi komutunu yerelde koş; **push edip uzak koşumu bekleme** (→ bu oturumun commit & push adımı; `run-task` Adım 8, `quick` Adım 5). Yalnız uzak koşumda görülebiliyorsa kurulamadığını yaz; kanal teyidi `verify-phase` → Otomatik Kontroller'e kalır. Bozukluğu **kusurun gerçekte oluşacağı yerde** yarat — kapı yanlış katmanı okuyorsa (kaynağı ölçerken kusur üretilen çıktıda doğuyorsa ya da tersi) kırmızı hiç gelmez; fail-open tam orada görünür.
- **Boş kapsam:** kapı kapsamını bir taramadan/aralıktan türetiyorsa, tarama **boş döndüğünde** ne olduğunu ayrıca koş — hiç bakmadan PASS basan kapı yeşil görünür ama hiçbir şey ölçmez.

Sınama geri alınabilir olmalı: kaynağı değil **girdiyi** boz; prod'a, kalıcı yan etkili noktaya (append-only kayıt, dış servis çağrısı, migration) ve serving katmanına dokunma. Kurulamıyorsa zorlama — kurulamadığını yaz. İkisini de (ne koşuldu → ne görüldü) Adım 4'ün Oturum Kaydı → **Test Sonuçları** alanına yaz; bozuk girdide yeşil kalan ayak **silinmez**, doğru ayağın neyi ölçtüğünü kanıtlayan kontrol grubu odur. Task kapı üretmiyorsa bu madde düşer.

### 4. Task Dokümanını Güncelle

Task dokümanının **Oturum Kayıtları** bölümüne `.claude/commands/devflow/templates/TASK.md` yapısına uygun bir oturum kaydı ekle — yapı template'te tanımlıdır, burada tekrarlanmaz (tek-ev). Pause/devam olasılığına karşı **"Son Yaklaşım"** ve **"Sonraki Adım Detayı"** alanlarını doldurmaya özen göster.

Task tamamlandıysa durumunu "✅ Tamamlandı" olarak güncelle.

### 5. DURUM.md ve Faz Dokümanını Güncelle

**DURUM.md:**
- "Son Güncelleme" satırını **üzerine yaz** (tek satır, max ~250 char) — "Önceki:" prefix ile yığma yasak
- Tamamlanan task'ın durumunu güncelle
- Sıradaki task'ı aktif task olarak işaretle (varsa)
- **Adım alanını ilerlet:** Fazda bekleyen (⬜/🔄) ya da duraklatılmış (⏸️) task varsa `task`'ta bırak; **geriye yalnız ✅/❌ kaldıysa `verify` yap** (sıradaki adım verify-phase). Böylece DURUM sıradaki adımın tek yetkili kaynağı olur — diğer döngü komutlarıyla tutarlı.
- Task özetlerini güncelle — DURUM'un KURAL'ındaki sınır kadar tut, eski özetler **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix yasak). ⚠️ **Tamamlanan task'ın `Detay:` yolu ARŞİV yoludur** (`tasks/archive/…`): özeti burada yazıyorsun ama dosya Adım 7'de taşınıyor, canlı yolu yazarsan referans commit anında kırık olur.

**Faz Dokümanı (`_dev/phases/PHASE-X.md`):**
- Task Listesi tablosundaki ilgili task'ın Durum sütununu güncelle (⬜ → ✅ veya 🔄)

> Doküman Disiplini tam metni: CLAUDE.md → Doküman Disiplini.

### 6. MEMORY Güncelle (Gerekirse)

Task sırasında **proje genelinde geçerli** beklenmeyen bir tuzak, workaround veya öğrenim keşfedildiyse memory'ye ekle: **gerekmedikçe yeni dosya açma** — konusu var olan bir atomun kapsamına giriyorsa oraya yaz (index'e satır eklenmez); gerçekten yeni bir konuysa `_dev/memory/<slug>.md` oluştur ve `_dev/MEMORY.md` index'ine ilgili kategori altında pointer ekle. **Kanca bir haktır, alan değil:** dosya açılmadan bilinmezse oturum yanlış hamle yapacaksa kanca yaz, yoksa satırı kancasız bırak — başlık + slug ne zaman açılacağını zaten söyler. Satırını eklerken index'e bir kez göz at: kancası gövdeye dönmüş, bir başkasıyla birleşebilecek ya da artık bir **test/lint/CI/validator/guard** kapısının yakaladığı bir kayıt varsa aynı oturumda kapat. Her task'ta güncelleme zorunlu değil — sadece kayda değer bir şey varsa. (Sistem detayı — kanca hakkı testi, sınıflar ve eşikler, kümeleme/mezuniyet supapları: `.claude/commands/devflow/lib/memory-sistemi.md`; yazmadan önce Read et.)

> **Yanlış-ev uyarısı:** Task icrasına özgü teknik nüanslar (araç davranışı, bu task'a özgü framework bug'ı vb.) memory'ye değil — bu task'ın **faz retrospektifine** (`phases/PHASE-N.md`) aittir, faz sonunda review-phase tarafından oraya yazılır. Memory yalnızca **proje genelinde geçerli** çapraz öğrenimler içindir. (Detay: `lib/memory-sistemi.md` → YASAK içerik.)

### 7. Archive (Task Tamamlandıysa)

Task tamamlandıysa `_dev/tasks/archive/` klasörüne taşı — **düz `mv` ile**; eski ve yeni yolu Adım 8'de birlikte stage et. `git mv` index'e **hemen** yazar ve Adım 8'e kadar açık kalan pencerede paralel bir oturumun commit'i o taşımayı süpürür (kanon: CLAUDE.md → Paralel Oturum Farkındalığı — ölçüt, index'e yalnız commit anında **iş eklenmesidir**; index'ten iş **çıkaran** `git restore --staged` bu ölçütün dışındadır ve aynı bölüm onu adıyla emreder).

### 8. Git Commit & Push

Bu oturumun tüm değişikliklerini (kod + doküman güncellemeleri + archive) tek commit'te gönder (dosya-bazlı stage — CLAUDE.md → Paralel Oturum Farkındalığı). ⚠️ **Commit'ten hemen önce `git status -sb` koş** — kanonun commit-anı kapısının aleti odur ve dalı ile index'i birlikte gösterir: ilk sütunu boşluk/`?` dışında bir **yabancı** satır varsa stage'ini düşür, çakışmalı yol varsa dur ve sor. Oturum açılışındaki bakış yetmez; paralel oturum asenkrondur. ⚠️ **Adım 7 arşivleme yaptıysa eski yolu da stage et** (`git add _dev/tasks/TASK-X.YY.md _dev/tasks/archive/TASK-X.YY.md`): taşıma düz `mv`'dir, silme index'e kendiliğinden yazılmaz — yalnız yeni yolu stage edersen HEAD'de **iki kopya** kalır ve silme kalıcı olarak stage'lenmemiş görünür.

**Push bu oturumun son işidir — kendi push'unun CI/workflow sonucunu bekleme;** kapanış bloğunu yaz ve oturumu kapat (kanon: CLAUDE.md → Commit Stratejisi). Uzak koşumun kapı-sahibi `verify-phase` → Otomatik Kontroller'dir ve kapsamı repo-genelidir — kırık sürüyorsa orada görülür ve düzeltme task'ına döner.

- **Task'ın konusu bir test ya da CI kırığı olsa bile bu değişmez.** Çekim en güçlü tam orada, düzeltme task'larındadır: düzeltmeyi yerelde doğrula (Adım 3), uzak teyidi bekleme.
- **Yayın kapısı istisnası bu adımda ateşlenmez** — faz task'ı her zaman çalışma dalında kalır; o kapı `quick`'in yayın türünde işler.
- **Projede push sonrası CI/kapanış teyidi isteyen beyanlı bir kural varsa** (protokolde okuduğun memory → "Süreç Disiplinleri"; kanca kapanışa dokunuyorsa atomu aç) **sessizce ezme:** push'u tamamla, sonra kapanış bloğunu yazmadan önce tek satırla bildir ve kullanıcıya sor — motor kuralı ile projenin sınanmış kuralı çatışıyorsa hakem kullanıcıdır. Orkestratörlü koşumda (`run-phase`) bu kapının cevabı koşum açılışında bir kez alınır ve brief'te gelir; **brief cevabı taşıyorsa** sorma, gelen cevapla devam et — kapı düşmez, yalnız anı değişir. Taşımıyorsa kapı olağan hâliyle ateşler: soru orkestratöre döner (`run-phase` → Durma Ölçütleri, ölçüt 3).

> Commit mesajı formatı ve kuralları: CLAUDE.md → Commit Convention. Faz task'ları için scope = `TASK-X.YY`.

### 9. Sıradaki Adımı Öner

**Sonraki task varsa:**
```
✅ TASK-X.YY tamamlandı.
📋 Sıradaki adım: /devflow:run-task
   → Sonraki task'ı (TASK-X.ZZ) çalıştırmak için yeni bir oturum başlat.
   → Kalan task sayısı: Y
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**Tüm task'lar tamamlandıysa:**
```
✅ TASK-X.YY tamamlandı. Fazdaki tüm task'lar tamamlandı!
📋 Sıradaki adım: /devflow:verify-phase
   → Kullanıcı kabul testini yapmak için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**Üçüncü hâl — ⬜/🔄 kalmadı ama ⏸️ satır kaldı:** yukarıdaki iki blok da kullanılmaz. *"Tüm task'lar tamamlandı"* yazma ve `verify-phase` önerme — Adım 5 `Adım`'ı `task`'ta bırakır; `📋 Sıradaki adım: yok — [duraklatılmış task'ın hâli]` yaz ve gördüğünü tek satırla söyle (kanon: CLAUDE.md → Oturum Kapanışı, `Adım = task` özel durumu).

Son satır her dalda yazılır; kuralı, önekleri (`engel:` / `önerilir:`) ve ambleminin hesabı **CLAUDE.md → Oturum Kapanışı**'dadır. Engelleyen bir kalem varsa `📋` satırı yukarıdaki komut değil, o işi yapan komut olur (kanonun terfi kuralı). **Task oturumunda tipik kaynak Adım 8'in beyanlı-kural fıkrasıdır** (push sonrası teyit isteyen proje kuralı) ve Çalışma Prensipleri #10'un tek-okumaya sığmayan doküman işareti — ikincisi `önerilir:` önekiyle girer.

---

## Otonom Çalışma Kuralları

Task'ı aldığında durmadan tamamla. Ancak şu durumlarda dur ve kullanıcıya sor:
- **Teknik belirsizlik:** İki veya daha fazla geçerli yaklaşım var
- **Kapsam belirsizliği:** Task'ın sınırları net değil
- **Bağımlılık sorunu:** Gerekli dosya, API veya servis hazır değil
- **Risk:** Değişiklik mevcut çalışan kodu bozabilir
- **Karar gereksinimi:** Tasarım, mimari veya iş kuralı kararı

Bunlar dışında durma, devam et. Yanlış yapmaktansa sormaktan çekinme. Riskli komutlar çalıştırmaktan kaçın.

**Plan revizyonu gerekirse** (task yanlış varsayıma dayanıyor, eksik/çelişen task var, sıralama çalışmıyor — ya da planlı bir **keşif/doğrulama ayağı** bulgu üretip kalan task'ların doğruluğunu değiştirdi; kullanıcıyla teyitleş): **yeni task dokümanı OLUŞTURMA** — task yaratmak plan-phase (revizyon dahil) ve verify-plan'ın, düzeltme task'ları verify-phase/review-phase'in işidir; run-task'ta yapılmaz. (Sorun mevcut/gelecek task'ların doğruluğunu ETKİLEMİYORSA bu rota değil — BULGULAR Gelen Kutusu'na kaydet: CLAUDE.md → "Gördüğün sorunu düşürme".) Rota:
1. Kesilen task'ın Oturum Kaydı'na revizyon gerekçesini yaz — kayıt Durum'u **🔄 Devam edecek** (⏸️ değil — bu pause değil); "Son Yaklaşım" / "Sonraki Adım Detayı" alanlarına neyin yanlış olduğunu ve planın nasıl revize edilmesi gerektiğini detaylandır.
2. Faz dokümanının Task Listesi'nde ve DURUM'un Task Durumu tablosunda kesilen task'ı 🔄 işaretle (Aktif Task o kalır, ⏸️ yazma — duraklatma kapısını yanlış ateşler, iş `resume`'a saptırılır); DURUM.md'de **Adım** alanını `plan` yap — DURUM'a uzun not yazma, zengin gerekçenin evi task Oturum Kaydı'dır (plan-phase revizyon modu onu okur). Duraklatma Notu YAZILMAZ — bu pause değil, planlı bir rota.
3. Değişiklikleri commit'le — yarım kod varsa `chore: WIP — plan revision flagged at TASK-X.YY`, yalnız doküman değiştiyse `docs(TASK-X.YY): plan revision flagged — [kısa açıklama]` — push'la ve oturumu kapat. Plan revizyonu ayrı oturumda plan-phase'te yapılır.

> **Keşif bulgusu plan hatası değildir.** Canlı/dış-ortam doğrulaması gibi planlı bir keşif ayağının bulgu üretmesi arıza değil **beklenen çıktıdır** — rota da ayrım ölçüsü de aynıdır, değişen yalnız gerekçedir: Oturum Kaydı'na "plan hatası" değil "keşif bulgusu" diye yaz. Bulgunun beklenmiş olması onu erteleme gerekçesi yapmaz; kalan task'ların doğruluğunu etkiliyorsa rota budur. **Ayak kendi işini bitirdiyse task yarım değildir:** ✅ + arşiv ile normal kapanır, 🔄 işareti atılmaz — yukarıdaki rotadan yalnız DURUM Adım'ının `plan`'a çekilmesi uygulanır; commit normal kapanışın Adım 8 commit'idir (rotanın WIP/`plan revision flagged` mesajları bu hâlde kullanılmaz).

---

## Önemli Kurallar

- Task dokümanı oluşturulmaz; kendi task'ının güncellemesi (Adım 4) dışında task dokümanı düzenlenmez — task yazımı plan-phase (revizyon dahil) ve verify-plan'ın, düzeltme task'ları verify-phase/review-phase'in işidir
- Kullanıcı versiyonu erken sonlandırmak isterse: mevcut değişiklikleri WIP commit ile kaydet (`chore: WIP — early termination at [kısa açıklama]`), oturumu kapat. Kullanıcıyı `/devflow:prd-review` komutuna yönlendir — arşivleme ve değerlendirme orada yapılacak.
