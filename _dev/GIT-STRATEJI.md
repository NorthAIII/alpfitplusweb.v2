# Alpfit Plus Web Sitesi v2 — Git Stratejisi

---

## Bu Doküman Hakkında

**GIT-STRATEJI.md** bu projenin git gerçekliğini ve kurallarını tutar: hangi dallar var, hangisinde çalışılır, yayın nasıl yapılır, acil düzeltme rotası nedir. Her oturum başında okunur (CLAUDE.md → Oturum Başlangıç Protokolü) — çünkü her oturum commit ve push kararı verir. Her projede bulunur: **beyan edilmiş "yok" ile hiç sorulmamış aynı şey değildir** — "tek dal, ayrı yayın hattı yok" da bilinçli bir karardır ve bir daha sorulmaz.

**Doğduğu yer:** `kickoff-verify` (kurulumda; dosya hiç yoksa eski-kurulum onarımı olarak da orada doğar). Sonradan değişebilir: `/devflow:quick` (her an, kullanıcı tetikler) ya da `prd-review` (versiyon sonu — proje canlıya çıktıysa strateji büyür).

<!-- KURAL: Bu dokümanı KURAN ya da DEĞİŞTİREN oturum, prosedürü motor tarafından okur:
     `.claude/commands/devflow/lib/git-strategy-kurulum.md` (probe → teşhis → teyit; değiştirmenin üç ek adımı).
     Tarif oraya aittir, buraya kopyalanmaz — her oturum okunan bu dosyaya yalnız BEYAN girer, onu üreten
     prosedür değil. Aşağıdaki bölümler doldurulur; boş bırakılan bölüm "henüz konuşulmadı" demektir, varsayma. -->

### Bilginin Doğru Evi — bu doküman NE tutmaz

Dal, merge, push ve yayın kuralı **yalnız burada** yaşar; başka dokümanda tekrarlanmaz (tekrar = drift, ve her strateji değişimi hizalama borcuna dönüşür).

- Commit mesajı formatı, commit kapsamı, paralel oturum disiplini → `CLAUDE.md` → Commit Stratejisi / Commit Convention
- Ortamın nasıl kurulduğu, servis/araç notları, erişim bilgileri → `MEMORY.md` → Ortam & Araç Notları
- Deploy'un nasıl yapıldığının detayı (platform ayarları, env değişkenleri) → `modules/M7-Yayin-ve-Altyapi.md`
- Neden bu strateji seçildi (karar gerekçesi) → `docs/DECISIONS.md`

Burada yalnız **"hangi dal, ne zaman, hangi kapıdan"** bilgisi durur.

---

## Uzak Bağlantı ve Dallar

**Uzak bağlantı:** `origin` → `git@github.com:NorthAIII/alpfitplusweb.v2.git` (GitHub, özel repo)

| Dal | Rolü | Ortam / Hedef | Ömrü |
|-----|------|---------------|------|
| `main` | Çalışma **ve** yayın (tek dal) | `alpfitplus-web-v2` Vercel projesi — her push git kaynaklı üretim dağıtımı; adres `alpfitplus-web-v2.vercel.app`, aşama `preview`, site `noindex` | Sabit |

<!-- KURAL: Dal adı VARSAYILMAZ, probe'dan yazılır (main / master / develop — projeye göre). Tek dallı proje bu
     tabloyu tek satır olarak tutar; geçerli ve tam bir cevaptır. Çalışma ile yayın ayrıldığında satır çoğalır
     (örn. çalışma dalı + yayın dalı + geçici acil-düzeltme dalı deseni). "Ortam/Hedef" sütunu dal modelinin
     ANLAMINI verir: bir dalı izleyen otomatik deploy varsa o dala yazmak canlıyı tetikler. -->

**Çalışma dalı:** `main` — oturumlar bu dalda çalışır.

---

## Commit ve Push

- **Commit:** her oturum sonunda, istisnasız (DevFlow'un izlenebilirlik çekirdeği — CLAUDE.md → Commit Stratejisi).
- **Push:** her commit sonrası `origin/main`'e.
- **Push artık repo dışına çıkar:** her push Vercel'de bir dağıtım başlatır ve önizleme adresini günceller. Bu bir **yayın değildir** (gerekçe → Yayın) ve push'u onaya bağlamaz — çalışma dalına push rutin ve otonom kalır.

<!-- KURAL: Bu bölüm commit'i KAPATAMAZ; commit metodun değişmezidir. Push koşulludur (remote yoksa ya da bilinçli
     olarak yerel tutuluyorsa yapılmaz). Çalışma dalına push RUTİNDİR ve otonomdur — her seferinde onay sorulmaz.
     Onay yalnız yayın dalına dokunulurken devreye girer (→ Otonomi Sınırı). Repo hiç yoksa bu bir strateji
     tercihi değil KURULUM EKSİĞİDİR: DevFlow'un izlenebilirlik çekirdeği commit'e dayanır — kullanıcıya bildir. -->

---

## Yayın

**Yayın hattı:** yok — ama otomatik dağıtım var. İkisi aynı şey değil: `main`'e her push `alpfitplus-web-v2` projesinde bir üretim dağıtımı üretir ve `https://alpfitplus-web-v2.vercel.app` adresini günceller, fakat o adres bir **önizleme yüzeyidir** — `alpfitplus.com` bağlı olmadığı için aşama `preview` türer ve site üç katmanda `noindex` kalır (ölçüldü: TASK-1.03). Bu yüzden ayrı bir yayın anı, yayın dalı ve doğrulama kapısı hâlâ yoktur; çalışma dalına push doğrudan geçerlidir.

Gerçek yayın alan adının bağlandığı gün doğar (M7 F7.5) — aynı push o günden sonra canlıyı etkileyecek ve bu bölüm o gün yeniden yazılacak. `alpfitplus.com` bugün hâlâ v1'in ayrı repodaki projesini (`alpfitplus-website`) gösterir.

<!-- KURAL: Çalışma ve yayın ayrıldığında bu bölüm şunları yazılı hâle getirir ve hepsi ZORUNLUDUR:
     · YAYIN ANI — hangi olay yayını başlatır (DevFlow'un doğal adayı: versiyon sonu, `prd_review_bekliyor` penceresi).
     · KİM TETİKLER — kullanıcı (varsayılan); motor yalnız hatırlatır.
     · DOĞRULAMA KAPISI — yayından önce ne yeşil olmalı, kim bekler (sınanmış hâliyle; bkz. doldurma tarifi md. 4).
     · AKIŞ — çalıştırılacak komutlar, sırayla, adım adım onayla.
     · Merge yöntemi seçilirken: SQUASH KULLANILMAZ. Squash, çalışma dalının commit'lerini yayın dalında görünmez
       kılar; bu hem bir sonraki yayın merge'inde çakışma üretir hem `docs(phase-N): review` çapa satırlarını yayın
       dalında doğurmadığı için verify-phase'in faz-penceresi taramasını kırar. `--no-ff` merge çalışma dalının
       commit'lerini aynı hash'lerle taşır; ardından çalışma dalı `--ff-only` ile eşitlenir ve force push gerekmez.
     · Sürüm damgası (tag) isteğe bağlıdır; kullanılacaksa adı DURUM'daki versiyon etiketinden OTOMATİK TÜRETİLMEZ
       (boşluk içeren etiketler geçerli tag adı değildir) — kullanıcıdan alınır. -->

---

## Acil Düzeltme

Ayrı rota yok — düzeltme çalışma dalında yapılır ve olağan akışla ilerler (`/devflow:quick`).

**Geri dönüş yönü:** ileri düzeltme — `main`'de düzelt, push et; commit geri alma yalnız dosya bazlıdır. Alan adı geçişinden (M7 F7.5) sonra yayın bozulursa alan adı v1'in Vercel projesine geri bağlanır — v1 projesi bu yüzden arşivlenir, silinmez; platform adımları `modules/M7-Yayin-ve-Altyapi.md`.

<!-- KURAL: Yayın hattı olan projede burası "yayın dalındaki acil arıza"nın rotasını yazar: nereden dallanılır,
     hangi kapıdan geçer, düzeltme çalışma dalına nasıl geri taşınır. Yeni bir kavram (örn. "hotfix") İCAT ETME —
     DevFlow'un mevcut `quick` kavramının bir TÜRÜ olarak yaz; ikinci bir sözlük iki ayrı disiplin doğurur.
     "Geri dönüş yönü" ileri rotanın eşidir ve BEYANI ZORUNLUDUR: yayın bozulduğunda önceki sürüme mi dönülür,
     yoksa hep ileri düzeltmeyle mi gidilir? "Tanımlı değil" geçerli bir cevaptır — ama arıza anında değil,
     şimdi verilmiş bilinçli bir cevap olur. Platform detayı (nasıl deploy geri alınır) buraya değil → docs/. -->

---

## Otonomi Sınırı ve Çakışma

- **Çalışma dalında motor otonomdur:** task, quick, doküman, commit, push — onay sorulmaz.
- **Yayın dalına dokunan hiçbir iş otonom başlamaz.** Tetiği kullanıcı çeker; akış adım adım onayla ilerler.
- **Eksik altyapıyı motor kendi kurmaz** (olmayan dal, kurulu olmayan remote): kullanıcıya bildirir, onayıyla kurar.
- **Çakışmayı (conflict) motor tek başına çözmez:** hangi dosya, hangi satır, hangi taraf ne anlama geliyor — kullanıcıya taşır, kararı kullanıcı verir.

<!-- KURAL: Sınır komut/dosya listesiyle değil, DAL bazında çizilir — "şu dala dokunmak kullanıcı işidir". Gerekçe:
     çalışma dalına yanlış push geri alınabilir; yayın dalına push canlıyı etkileyebilir ve geri alınamaz. -->

---

## Bu Projeye Özgü Notlar

<!-- KURAL: Ölçüt — yalnız DAL / MERGE / YAYIN kararını etkileyen ayrıntı buraya. Tipik adaylar: doğrulama süresi,
     dal↔ortam eşleşmesinin nüansları, yayını etkileyen workflow davranışları, dış araçların (bağımlılık botu vb.)
     açtığı istekler ve nasıl ele alındıkları. Kararı etkilemeyen ortam/araç notu ve genel tuzak buraya değil
     (→ Bilginin Doğru Evi). Doldurulacak başlık yoksa bölüm boş kalır — uydurma başlık açma.
     Bu bölüm zamanla şişerse dokümanın tamamı CLAUDE.md → Boyut ve Bölünme kuralına tabidir — bölünür. -->

- **Vercel bağlantısı kuruldu** (TASK-1.03, 2026-09-11): proje `alpfitplus-web-v2`, takım `north-ai`, plan `hobby`, GitHub bağlantısı `NorthAIII/alpfitplusweb.v2`, üretim dalı `main`. **F7.5 (alan adı geçişi) aynı push'u canlıya çevirecek** — o günden önce çalışma/yayın ayrımı, yayın anı ve doğrulama kapısı yeniden konuşulur (`/devflow:quick` ya da v2.0 sonu `prd-review`).
- **CI yok** (M6 F6.3 gelecek). Bugün doğrulama kapısı yerel ölçüm betikleridir (CLAUDE.md → Ölçüm betikleri); push öncesi kapı yoktur, ölçüm task tamamlama sırasının test adımında koşar. Push **sonrası** tek otomatik sinyal Vercel derlemesidir: kırmızıysa dağıtım yayımlanmaz ve önceki dağıtım ayakta kalır, yani kırık bir commit önizleme adresini düşürmez — ama sessizce de geçmez, adres eski sürümde donar.

---

**Son Güncelleme:** 2026-09-11 — TASK-1.03: `main` artık `alpfitplus-web-v2` Vercel projesine bağlı, her push git kaynaklı üretim dağıtımı üretiyor; alan adı bağlı olmadığı için yayın hattı hâlâ yok (adres `noindex` önizleme yüzeyi), F7.5'te yeniden yazılacak.

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->
