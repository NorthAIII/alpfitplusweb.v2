# DevFlow — Hızlı İş (Quick Mode)

Bu komut faz döngüsü dışında tüm ad-hoc task'lar için kullanılır. Bug fix, küçük feature, config değişikliği, acil düzeltme gibi işleri DevFlow garantileriyle (commit, izleme) ama faz ağırlığı olmadan yapar. Task dışı her iş bu komutla yapılır.

**Kullanım:** `/devflow:quick` — Kullanıcıdan ne yapılacağını sor

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Quick mode için protokol dışında ek zorunlu dosya yoktur — istenen işe göre göreve-göre dosyalar okunur. **Göreve göre:** iş kanvasta kayıtlı bir bulguysa `_dev/BULGULAR.md` index'i + ilgili `_dev/bulgular/B-NNN-*.md` atomu okunur (kapanışta mezuniyet gerekir — Önemli Kurallar).

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Kullanıcıdan İşi Al

Önce `_dev/tasks/quick/` klasöründe Durum'u 🔄/⏸️ olan kayıt var mı bak (grep yeterli). Varsa (birden çoksa hepsini kısaca listele) kullanıcıya sor: "QUICK-NNN ([konu]) yarım duruyor — ona mı devam edelim, yeni iş mi?" Devam seçilirse o kaydı oku ("Son Yaklaşım" / "Sonraki Adım Detayı") ve kaldığı yerden sürdür — yeni QUICK dosyası açılmaz; kayıt ⏸️ ise DURUM'daki Duraklatma Notu'nu da "Duraklatma yok" haline döndür (template kuralı: devam edildiğinde silinir). Kullanıcı yarım kaydı artık sürdürmeyeceğini söylerse Durum'unu ❌ İptal yap — soru bir daha tekrarlanmaz; kayıt ⏸️ idiyse DURUM'daki Duraklatma Notu'nu da "Duraklatma yok" haline döndür (iptal de duraklatmayı kapatır).

Yeni işse kullanıcıya ne yapmak istediğini sor. Kısa ve net bir açıklama yeterli.

### 1b. İşin Türü (yalnız `_dev/GIT-STRATEJI.md`'de bir yayın hattı beyanlıysa)

Tek dallı projede **bu adım atlanır** — her iş çalışma dalında yapılır, tür diye bir şey yoktur.

Çalışma ve yayın dalı ayrıysa quick üç türden biridir; türü **iş başlamadan** belirle:

| Tür | Nerede | Akışın tarifi |
|-----|--------|----------------|
| **Çalışma quick'i** (varsayılan) | çalışma dalı | Bu dosyanın olağan akışı (Adım 2'den devam) |
| **Yayın** | çalışma dalı → yayın dalı | GIT-STRATEJI → Yayın |
| **Acil düzeltme** | GIT-STRATEJI'nin tarif ettiği rota | GIT-STRATEJI → Acil Düzeltme |

**Soruyu boş sorma — doldurup teyit ettir.** Protokol gereği DURUM'u zaten okudun; Versiyon Sonu Durumu `prd_review_bekliyor` ise ve yayın boşluğu varsa muhtemel tür **yayın**dır. Ölç, sonra sor.

Ölçüm tarifi `review-phase.md` → "Yayın boşluğu ölçümü" başlığındaki bash bloğudur — bloğu oradan oku ve **aynen çalıştır** (tek ev; iki kopya zamanla ayrışır). Sayı çıkmazsa "ölçemedim" de, sayı uydurma.

```
DURUM'da `prd_review_bekliyor` var ve <çalışma>, <yayın> dalının <ölçülen sayı> commit önünde —
bu bir **yayın** oturumu mu? (değilse: çalışma quick'i / acil düzeltme)
```

**Yayın ve acil düzeltme türlerinde:**
- Akışın adımları **GIT-STRATEJI'de yazılıdır** — buraya kopyalanmaz (tek ev). Oradaki sırayı **adım adım, her adımda kullanıcı onayı alarak** uygula.
- Bu iki tür **kullanıcı tetiklemesiyle** başlar; kendiliğinden başlatma.
- Doğrulama kapısı beyanlıysa (yayın öncesi bir şeyin yeşil olması gerekiyorsa) **atlanmaz**; ajan bekleyemiyorsa kullanıcının doğrulamasını bekle.
- Çakışma çıkarsa kendin çözme — hangi dosya, hangi satır, hangi taraf ne demek: kullanıcıya taşı.
- İş yine bir QUICK kaydı alır (Adım 3) — "ne zaman, hangi versiyon yayınlandı" sorusunun cevabı orada durur.

> **Git stratejisinin kendisini kurmak/değiştirmek** de meşru bir quick işidir (örn. tek daldan çalışma+yayın ayrımına geçiş). Tarifi `.claude/commands/devflow/lib/git-strategy-kurulum.md`'dedir — probe, teyit, **doküman yeni doğduysa protokole bağlama** ve değiştirme durumunda üç ek adım (iz taraması, dış varsayımlar, ilk yayın penceresi) orada yazılıdır.

### 2. İşi Yap

- Kodu yaz
- Gerekirse test et
- İş bir doğrulama/kabul kapısı ürettiyse yeşilini sına — kural tek evde: `run-task` → Adım 3. Kaydı (ne koşuldu → ne görüldü) QUICK dosyasının **## Not** alanına yaz; quick'te "Test Sonuçları" alanı yoktur
- Kullanıcı oturum içinde ek iş eklerse aynı akışta devam et — yeni QUICK dosyası açma, mevcut iş kapsamını genişlet

### 3. Quick Task Kaydını Oluştur/Güncelle (Oturum Sonunda)

Kullanıcı oturum sonu sinyali verince (örn. "tamam", "kapat", "commit at"; veya `/devflow:pause` / `/devflow:double-check` çağrısı), `_dev/tasks/quick/` klasöründe işin QUICK dosyasını yaz. Devam oturumundaysan mevcut `QUICK-NNN` dosyasını güncelle — Yapılanlar/Değişen Dosyalar'a ekle, Durum'u ve Tarih'i tazele, yeni dosya açma:

**Dosya adı:** `QUICK-NNN-[konu].md` (NNN = sıralı numara, klasördeki son numaradan devam eder; [konu] = işin kısa, dosya sistemi-güvenli özeti — kebab-case, ASCII karakterli. Örnek: `QUICK-007-login-yonlendirme-hatasi.md`) Yeni numara yalnız **yeni iş** için açılır; devam oturumu mevcut dosyayı günceller.

```markdown
# QUICK-NNN: [Kısa açıklama]

**Tarih:** [tarih]
**Durum:** ✅ Tamamlandı / 🔄 Devam edecek / ⏸️ Duraklatıldı / ❌ İptal

## Ne Yapılacak
[Kullanıcının açıklaması — oturumda eklenen ek iş varsa onu da kapsa]

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

İş bitmediyse (🔄/⏸️) son iki bölüm **zorunludur**; iş bittiyse (✅) bu iki bölüm dosyada bulunmaz — devam oturumunda ✅'a çekerken varsa sil. Durum ayrımı: **🔄 Devam edecek** = iş bitmedi, oturum normal kapandı — sonraki quick oturumu Adım 1'de devam etmeyi sorar; **⏸️ Duraklatıldı** = `/devflow:pause` ile duraklatıldı — DURUM'a Duraklatma Notu yazılır (not eksik kalsa bile Adım 1 taraması ⏸️'yi yakalar); **❌ İptal** = sürdürülmeyecek (Adım 1 taraması dışına çıkar).

### 4. DURUM.md Güncelle

DURUM.md'de aktif faz bilgisini bozmadan, quick task'ı yalnızca **"Son Güncelleme"** satırına kısaca not et. İstisna (Duraklatma Notu): duraklatılmış (⏸️) bir quick'i devralan ya da kapatan (❌ İptal / faza taşıma) oturum DURUM'daki **Duraklatma Notu**'nu "Duraklatma yok" haline döndürür (template kuralı: devam edildiğinde veya iş iptal edildiğinde silinir). **"Son Task Özetleri" bölümüne YAZMA** — orası DURUM KURAL'ına göre yalnız aktif fazın TASK-X.YY task'larına ayrılmıştır; quick task bir faz task'ı değildir ve tam kaydı zaten `quick/QUICK-NNN` dosyasındadır.

### 5. Git Commit & Push

Bu oturumun tüm değişikliklerini (kod + doküman) tek commit'te gönder (dosya-bazlı stage — CLAUDE.md → Paralel Oturum Farkındalığı).

**Push bu oturumun son işidir — kendi push'unun CI/workflow sonucunu bekleme;** kapanış bloğunu yaz ve oturumu kapat (kanon: CLAUDE.md → Commit Stratejisi). Uzak koşumun kapı-sahibi faz döngüsündeki bir sonraki `verify-phase` → Otomatik Kontroller'dir ve kapsamı repo-genelidir — kırık sürüyorsa orada görülür. **İstisna:** `_dev/GIT-STRATEJI.md`'de beyanlı yayın kapısı — yayın türünde o kapı Adım 1b'nin akışındadır. Projede push sonrası CI/kapanış teyidi isteyen **beyanlı bir kural** varsa (protokolde okuduğun memory → "Süreç Disiplinleri") ne sessizce uy ne sessizce ez: **kullanıcıya sor** — motor kuralı ile projenin sınanmış kuralı çatışıyorsa hakem odur. Gerekçe ve tam akış: `run-task` → Adım 8.

> **Yayın / acil düzeltme türünde** dal hareketleri Adım 1b'deki akışın parçasıdır ve orada tamamlanmıştır; burada yalnız bu oturumun QUICK kaydı ve DURUM güncellemesi **çalışma dalına** commit'lenir.

**Commit formatı (scope'suz — quick mode):**
```
fix: kısa açıklama
feat: kısa açıklama
chore: kısa açıklama
refactor: kısa açıklama
```

---

## Önemli Kurallar

- **1 iş = 1 QUICK dosya** (oturum sayısından bağımsız). Aynı oturumda ek iş gelirse mevcut iş kapsamını genişlet — yeni QUICK dosyası açma; iş sonraki oturuma sarkarsa aynı `QUICK-NNN` dosyası güncellenerek devam edilir, yeni numara yalnız yeni iş için
- Quick mode'da faz dokümanları oluşturulmaz/güncellenmez — **tek istisna** aşağıdaki "Tersi de meşrudur" kalemidir (koşulları orada)
- Quick task'lar archive'a taşınmaz — `_dev/tasks/quick/` içinde kalır
- İş **planlama/koordinasyon** gerektirmeye başladıysa (kapsam tartışması, çok-modüllü tasarım) → kullanıcıyı uyar, faz döngüsüne taşımayı öner. "Sadece uzun sürüyor" faz sebebi değildir — iş bitmediyse detaylı handoff yazıp (Son Yaklaşım / Sonraki Adım Detayı) sonraki oturumda devam et; pratik sinyal: ~3 oturumu geçiyorsa faz düşün (sayısal kural değil, turnusol). Faza taşınırsa QUICK kaydını kapat (Durum: ❌ İptal, Not'a "faza taşındı → PHASE-N" düş; kayıt ⏸️ idiyse Duraklatma Notu'nu da "Duraklatma yok" haline döndür)
- Eğer quick task bir feature'ın davranışını değiştiriyorsa (yeni davranış kuralı, kapsam değişikliği), kullanıcıyı uyar: "Bu değişiklik feature davranışını etkiliyor. `/devflow:prd-note` ile kaydetmeni öneririm, böylece PRD ve MODULE dokümanları versiyon sonunda güncellenebilir."
- İş sırasında kapsam dışı bir sorun/uyarı görürsen kullanıcıya bildir — quick zaten ad-hoc işin evidir: kullanıcı isterse çözümü aynı quick kapsamına almak meşrudur; almazsa oturum sonunda — Adım 3'te QUICK kaydını yazarken, NNN belli olduğunda — `_dev/BULGULAR.md` → Gelen Kutusu'na `[QUICK-NNN]` işaretli tek satır düş (kural → CLAUDE.md "Gördüğün sorunu düşürme")
- **Tersi de meşrudur:** kanvasta bekleyen bir bulguyu (`B-NNN`) faz döngüsünü beklemeden quick ile çözmek — ister oturum baştan onun için açılmış olsun ister iş sırasında kapsama alınsın. **İşaretli bulguya uzanma** (`→ Faz N` / `→ TASK-X.YY`): rotası canlıdır, quick'le kapatmak faz/task dokümanında ölü atıf bırakır — gerçekten gerekiyorsa önce kullanıcıya sor, onaylanırsa hedef faz/task dokümanındaki kaydı da kapat ("QUICK-NNN ile çözüldü"); faz ✅ ile donmuşsa ya da hedef task arşivlenmişse dokunma (tarihsel doküman), yalnız kullanıcıya bildir
- Quick kapsamına alınan bir bulguda (iki hâlde de: oturum baştan onun için açılmış olsun ya da iş sırasında kapsama alınmış olsun) **kapanışı kanvas kuralına göre yap** (`_dev/BULGULAR.md` → Bulgu Sistemi): atom mezun edilmezse çözülen bulgu index'te açık görünmeye devam eder
