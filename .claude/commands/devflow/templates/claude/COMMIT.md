# Commit

← CLAUDE.md · doktrin: commit

> Bu dosya parent `CLAUDE.md`'nin bölme çocuğudur ve oraya **import edilir** (parent kökteyse `@_dev/claude/COMMIT.md`, `.claude/` altındaysa `@../_dev/claude/COMMIT.md` — göreli yolun tabanı parent'ın kendi klasörüdür) — içeriği her oturumda bağlamdadır. Parent'taki aynı adlı bölüm özet + pointer tutar; **tam metin burasıdır**. Doktrin dört kardeş dosyaya bölünmüştür (`DOKUMAN-KURALLARI` · `DOKUMAN-DISIPLINI` · `CALISMA-PRENSIPLERI` · `COMMIT`) ve **dördü de aynı anda bağlamdadır**; burada bulamadığın bir bölüm adı kardeş dosyadadır — tam listeyi parent'ın "Doktrin Dosyaları" bloğu tutar.

---

## Commit Stratejisi

**Bir oturum = bir commit** (varsayılan tutum). Her DevFlow oturumunu tek commit ile sonuçlandırmayı hedefle. Kod ve doküman değişikliklerini **aynı commit'te topla** — ayrı "docs: update" commit'i açma. Type prefix baskın değişikliğe göre seçilir (kod varsa `feat`/`fix`/`refactor`, sadece doküman değiştiyse `docs`).

Sıkı bir kural değil; gerçekten gerektiren durumlarda ek commit meşrudur. Ama "bir parça iş bittikçe hemen commit'leyeyim" refleksiyle fragment yaratma — varsayılan tutum tek commit.

**Nereye commit'lenir, push edilir mi:** Komut adımları "commit & push" der ama **dal adı yazmaz** — hedef her zaman bulunduğun daldır ve o dalın ne olduğu `_dev/GIT-STRATEJI.md`'de beyanlıdır (push'un yapılıp yapılmayacağı da orada). Çalışma dalına commit & push **rutindir, otonomdur** — her seferinde onay sorulmaz. Yayın dalına dokunan hiçbir iş otonom başlamaz; tetiği kullanıcı çeker (→ GIT-STRATEJI → Otonomi Sınırı).

**Push oturumun son işidir — bir oturum kendi push'unun sonucunu beklemez.** CI/workflow yeşile dönsün diye bekleme; kapanış bloğunu yaz ve oturumu kapat. Otomatik sonuçların kapı-sahibi bir sonraki doğrulama adımıdır (faz döngüsünde `verify-phase` → Otomatik Kontroller; kapsamı repo-geneli, kaynağı hangi oturum olursa olsun). Doğrulama düşmez, **yeri değişir**: task'ın kendi testleri yerelde koşar (Çalışma Prensipleri #7); ertelenen yalnız CI kanalının teyididir. Geçerken kırmızı görürsen çözmeye girişme → Çalışma Prensipleri #12. **İstisna:** beyanlı yayın kapısı (→ GIT-STRATEJI → Yayın).

**Commit'ten hemen önce aktif dalı ve index'i doğrula** — tek çağrı yeter: `git status -sb` (ilk satır dalı, kalanı index'i verir; upstream yokken de çalışır). Beyan edilen çalışma dalı değilse **commit etme**, dur ve kullanıcıya sor. Oturum başındaki dal yankısı dalı çoğu zaman yakalar ama her komut o kapıdan geçmez (oturum-sonu komutları — `pause`, `double-check`, `prd-save` — protokolü tekrar tetiklemez); commit anı, yayın dalına yanlışlıkla yazmanın son durağıdır. **Index'in bu anda okunması ayrıca şarttır:** aşağıdaki yabancı-stage ölçütünün tetiği budur — paralel oturum asenkrondur ve oturum açılışındaki tek bakış, açılıştan sonra stage'lenen satırı göremez.

### Paralel Oturum Farkındalığı

Aynı repoda eşzamanlı başka bir Claude oturumu çalışıyor olabilir — her oturum bunu varsayarak çalışır:

- **Commit kapsamı working tree değil, BU OTURUMUN dokunduğu dosyalardır.** Oturum başında `git status`'a bak: o anda kirli olan dosyalar senin değildir — dokunma, commit'e dahil etme.
- **Stage her zaman dosya bazlıdır:** `git add <path>` + hemen ardından commit (tek nefeste). **Ölçüt komut adı değil ANdır: index'e yalnız commit anında iş eklenir** — `git add` neyi *eklediğini* seçer, `git commit` index'in *tamamını* commit'ler, ve aradaki her an paralel bir oturumun commit'ine açıktır. **O çiftin dışında** index'e iş ekleyen hiçbir şey yapma, **taşıma dahil**: arşivleme/yeniden adlandırma düz `mv`'dir, `git mv` değil — eski ve yeni yolu commit anında birlikte ver. `git add -A`, `git add .`, `git commit -a` ayrıca **kullanma** — onlar zamanı değil **kapsamı** ihlal eder: yabancı oturumun yarım işini süpürür.
- **Commit öncesi tanımadığın değişiklik görmek normaldir** — sessizce dışarıda bırak ve devam et; bunun için kullanıcıya sorma. **Ama kendiliğinden dışarıda kalan yalnız ağaçtaki kirdir:** `git status --short`'un **ilk** sütunu boşluk ve `?` **dışında bir şeyse** o yabancı satır zaten index'tedir (harf ne olursa olsun — `M`/`A`/`D`/`R`/`T`; ölçüt harf listesi değil sütunun kendisidir), düz commit onu da alır ve o iş sessizce senin commit'ine girer — ağaç temize döner, sahibi *"working tree clean"* görür ve yaptığını bir daha bulamaz. Öyle bir satır görürsen commit'ten önce yalnız stage'ini düşür: `git restore --staged <path>` (**`--staged` şart**; dosyanın içeriğine dokunmaz, yabancı oturumun işi ağaçta olduğu gibi kalır — bu yüzden **stage'i düşürmek işi geri almak değildir**). `R eski -> yeni` satırında **yol ikidir, ikisini birlikte ver** — iki yön eşit değildir: yalnız **yeni** yolu düşürmek geriye stage'lenmiş bir **silme** bırakır ve senin düz commit'in yabancı dosyayı HEAD'den siler; yalnız eskisini düşürmek dosyayı commit'ine sokar ama silmez.
- ⚠️ **Çakışmalı yola stage düşürme uygulanmaz — ve ölçüt `U` harfi DEĞİL, yolun çözülmemiş olmasıdır.** Ayırt edici `git ls-files -u`'dur: boş değilse orada listelenen yollar çakışmalıdır. Bir add/add çakışması `git status --short`'ta `AA` yazar — üstteki ilk-sütun ölçütünü ateşler ama hiçbir sütununda `U` yoktur, yani harfe bakan bir istisna onu kaçırır. Orada `git restore --staged` **exit 0 verip çakışmayı sessizce çözülmüş yapar** ve sonraki commit merge'ü öteki tarafın içeriği olmadan kapatır. Çakışmalı yol gördüğünde stage'e dokunma: **dur ve kullanıcıya sor.**
- **Aynı dosyada karışma:** dosya-bazlı add satır ayrıştıramaz. Pano/durum dokümanında (DURUM, PHASES vb. — bölümler oturum türüne göre zaten ayrıktır) karışma olağandır: yazmadan hemen önce taze oku, yalnız kendi bölümünü/satırlarını değiştir, kendin çöz, commit mesajında an. Kod veya içerik dokümanında ciddi yabancı değişiklikle iç içe geçtiysen dur ve kullanıcıya sor.
- **Ağaç-geneli yıkıcı komut kullanma:** `git checkout -- .`, `git reset --hard`, `git stash` paralel oturumun işini de siler — geri alma hep dosya bazlı yapılır. **Ama dosya bazlı olması tek başına yetmez:** `git checkout -- <dosya>` / `git restore <dosya>` o dosyadaki **commit'lenmemiş** işi de iz bırakmadan siler — sahada bir kez oldu. Geri alman gerekiyorsa ya **girdi** düzeyinde geri al ya da önce kendi işini `chore: WIP — …` ile kaydet. (Yalnız stage'i düşürmek yıkıcı değildir: `git restore --staged <dosya>` içeriğe dokunmaz.)
- **Dal değiştirmeden önce ağaç temiz olmalı:** `git switch`/`git checkout <dal>` çakışma yoksa **sessizce başarılı olur** ve commit'lenmemiş yabancı dosyaları yeni dalın ağacına taşır — paralel oturum bunu fark etmeden kendi dosyasını oraya commit'ler. Dal hareketinden önce `git status --porcelain` boş değilse **dur ve kullanıcıya sor**. (Rutin akışta dal değiştirilmez; bu yalnız yayın/acil düzeltme akışları içindir — GIT-STRATEJI.)
- **Push reddedilirse** büyük olasılıkla başka oturum önce push'lamıştır: `git fetch` + rebase et; gerçek çakışma çıkarsa kullanıcıya sor. **İstisna:** hata `no upstream branch` diyorsa bu paralel oturum değil **kurulum eksiğidir** (dalın uzak karşılığı hiç kurulmamış) — rebase etme, kullanıcıya bildir. Merge commit taşıyan bir dalda da rebase etme; o commit'leri düşürür.

---

## Commit Convention

```
feat(TASK-X.YY): kısa açıklama          # Yeni özellik
fix(TASK-X.YY): kısa açıklama           # Bug fix
refactor(TASK-X.YY): kısa açıklama      # Refactor
docs(TASK-X.YY): kısa açıklama          # Doküman değişikliği
test(TASK-X.YY): kısa açıklama          # Test ekleme/düzeltme
chore(TASK-X.YY): kısa açıklama         # Build, config vb.
```

**Quick mode** (`/devflow:quick` ile yapılan task dışı işler) scope'suz yazılır:
```
fix: kısa açıklama                      # Bug fix (quick mode)
feat: kısa açıklama                     # Küçük feature (quick mode)
```

**Faz oturumu** (faz döngüsü komutlarının ürettiği, task dışı faz-aşaması commit'leri) scope = `phase-N` yazılır:
```
docs(phase-N): <aşama> — kısa açıklama  # örn. docs(phase-3): research — technical research completed
```

Kurallar:
- Type prefix zorunlu
- Faz task'larında scope olarak task numarası (`TASK-X.YY`) yazılır
- Faz oturumu commit'lerinde scope `phase-N`, açıklama `<aşama> — ...` formundadır (`<aşama>` = discuss/research/plan/verify-plan/UAT/review)
- Quick mode'da scope yazılmaz
- Açıklama İngilizce, küçük harfle başlar, nokta ile bitmez

---
