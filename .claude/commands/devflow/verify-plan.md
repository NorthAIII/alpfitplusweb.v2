# DevFlow — Plan Review ve Doğrulama (Verify Plan)

Bu komut plan-phase'den sonra, task dokümanlarını temiz context ile review etmek, hataları düzeltmek ve planı onaylatmak için kullanılır. Plan-phase'de yazılan task dokümanları aynı oturumda self-review edilir — bu komut ayrı oturumda, fresh context ile gerçek doğrulama yapar.

**Kullanım:** `/devflow:verify-plan [N]` — N = faz numarası (belirtilmezse DURUM.md'den aktif fazı al)

**Ön Koşul:** `/devflow:plan-phase` tamamlanmış olmalı.

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/tasks/TASKS-README.md` — task format / numaralama / boyut / lineer-çalıştırma kuralları (task'lar bu standarda karşı doğrulanır)
2. `_dev/MODULE-MAP.md`
3. `_dev/QUALITY.md`
4. Aktif faz dokümanı (`_dev/phases/PHASE-N.md`) — **Genel Bilgiler (milestone + altındaki not satırları)**, Kapsam Tartışması, Araştırma Bulguları ve Task Listesi bölümlerini oku
5. Bu fazın **tüm task dokümanları** — `_dev/tasks/` ve `_dev/tasks/archive/` klasörlerinde `TASK-N.*` dosyaları, hepsini oku (tamamlanmış task'lar arşivde olabilir)

**Göreve Göre (kontrol sırasında oku)**
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili `_dev/modules/MX-*.md` dosyalarını oku (kabul kriterleri ve edge case'ler için)
- Yeni task oluşturma/bölme gerekirse → TASK template: `.claude/commands/devflow/templates/TASK.md`

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Tüm Task Dokümanlarını Oku

Faz dokümanındaki task listesinden tüm task numaralarını al ve her birini oku. Bu adım kritik — temiz context ile tüm task'ları ilk kez okuyor olmalısın.

**Revizyon review'u:** plan revizyonundan geliyorsan (`plan revision` commit'i / task Oturum Kaydı'nda revizyon gerekçesi) tam yeniden-review yapma — kapsam **değişen/eklenen task'lar + onların diğer task'larla etkileşimleri**dir (orantılı review). Milestone kontrolü yine tüm plan üzerinden yapılır (arşiv dahil); numara düzeltmesi yalnız yeni task'larda — ✅/arşiv numaralarına dokunulmaz.

### 2. Mekanik Kontroller

Her task dokümanını şu açılardan kontrol et:

**a) Template Uygunluğu:**
- Zorunlu bölümler var mı? (Hedef, Alt Görevler, Etkilenen Dosyalar, Test Kriterleri, Tamamlanma Kriterleri)
- Opsiyonel bölümler gerekmediği halde doldurulmuş mu? (boş dolgu: "Yok", "Düşük risk" gibi)
- Format tutarlı mı?

**b) Referans ve Bağımlılık:**
- **Referans gerçeklik-kontrolü:** Somut referanslar (_dev dok refleri, kod yolları, Dikkat Noktaları'ndaki metric/uid/secret-slot/env-config tanımlayıcıları) gerçekle tutarlı mı? Yalnızca **zaten-var olması beklenenleri** doğrula — `YENİ` işaretli (büyük/küçük harf ve I/İ farkı önemsiz; niyeti tanı), önceki bir task'ın ürettiği (Adım 1'de tüm task'ları okudun, bu kümeyi kurabilirsin), bir output olarak eklenecek olanlar veya **aynı task'ın bu fazda yaratacağı dosya-dışı tanımlayıcılar (metric/uid/secret-slot/env-config)** muaftır — bu sonuncularda `YENİ` çapası yoktur (o işaret yalnız Etkilenen Dosyalar'dadır); bu fazda yaratılacaksa Dikkat Noktaları'nda "yeni" diye anılır, sen yalnız zaten-var beklenenleri grep'lersin. Kanal tipe göre: yol→`ls`/`grep`, in-repo tanımlayıcı→tanım sitesini `grep` (secret/env'de yalnızca slot **adı**, değer asla).
- Bağımlılıklar doğru mu? (TASK-X.03 → TASK-X.02'ye bağımlıysa, sıralama doğru mu?)
- Çapraz referanslar tutarlı mı?

**c) Yazım Kalitesi:**
- Typo ve tutarsızlıklar
- Alt görevler açık ve net mi?
- Test kriterleri somut ve doğrulanabilir mi — ve task'ın **kendi oturumunda** gözlenebilir mi? ("CI yeşil olmalı" gibi sonucu ancak push'tan sonra doğan kriter geçmez; kanon: `templates/TASK.md` → Test Kriterleri KURAL'ı). Kriter bir **ara-çıktıya** bağlanmışsa devredilen **kanalı yazılmış mı** — sonucu belirleyen katman yerel koşucunun ölçtüğü katmanın dışındaysa kanal Otomatik Kontroller değil `kanal: UAT`'tır (aynı KURAL; ölçüt research'in "Dikkat Edilecekler"indeki katman kaydıdır). Kanal eksikse ve katman ayrımı kayıttan okunabiliyorsa ekle (mekanik); okunamıyorsa Adım 4'e taşı.

**Mekanik sorunları doğrudan düzelt.** Bunlar için kullanıcıya sormaya gerek yok — doğru cevap belli. (İstisna: referans gerçeklik-kontrolünde bulunan **çakışma** mekanik değildir — Adım 4 onay raporuna gider (bkz. Önemli Kurallar); yalnızca _dev dok reflerindeki net typo mekanik kalır. Yerelde koşulabilir karşılığı olmayan bir test kriterinin yeniden yazımı da mekanik değildir → Adım 4.)

### 3. İçerik Kontrolleri

**a) Milestone Kontrolü:**
- Tüm task'ların toplamı milestone'u karşılıyor mu?
- Milestone'daki her kriter en az bir task'la eşleşiyor mu?
- Karşılanmayan kriter var mı?
- Arşivdeki ✅ task'lar da kapsama sayılır — tamamlanan işi kapsam dışı sanma
- **Milestone cümlesinin altındaki not satırlarını da oku** — `mekanizma: X → Y (araştırma/kapsam kararı)` biçiminde bir satır varsa kriter Y ile karşılanır; DURUM ve PHASES'teki kopyalar bilerek özgün cümleyi taşır, oradaki X'i arayıp "karşılanmıyor" deme (kaynak: `research-phase` Adım 4 / `discuss-phase` Adım 6)

**b) Gereksinim Kontrolü:**
- MODULE-MAP'teki feature kabul kriterleri task'larla örtüşüyor mu?
- Kapsam tartışmasındaki her karar en az bir task'a yansımış mı?
- Araştırma bulgularındaki "dikkat edilecekler" task'larda ele alınmış mı?
- Modül dokümanlarındaki edge case'ler task'larda karşılanmış mı?
- Plan **yeni bir veri üreten yüzey** açıyorsa (yeni alan, yeni kayıt, yeni dosya, yeni event), o verinin okunduğu **mevcut** yüzeyler sayıldı mı? — görüntüleme, rapor/export, bildirim/e-posta, başka modül. Sayımı planın listesinden yapma: yeni alanın adı henüz repoda yoktur — verinin **katıldığı kabı** ara (kayıt/model/tablo/event adı ya da kardeş bir mevcut alan) ve o kabı okuyan yüzeyleri say, sonra plandakiyle karşılaştır. Bu bir varlık doğrulaması değil **tüketici sayımıdır** (2b'nin referans gerçeklik-kontrolüyle karıştırma); planın listesi zaten eksik olabilir, kontrolün varlık nedeni odur. Kapsananlar task'lı olmalı; kapsanmayanlar Adım 4'e onay maddesi olarak çıkar — kapsam kararı kullanıcınındır, sessizce ne genişletilir ne ertelenir. Faz yeni veri üretmiyorsa (salt-okunur yüzey, iç refactor) **bu soru düşer**; kabı okuyan yüzey yoksa sıfırdır — tüketici icat edilmez.

**c) Kalite Kontrolü:**
- QUALITY.md'deki kalite eksenleri task'larda göz önünde tutulmuş mu?
- Test task'ları yeterli mi?
- Güvenlik, performans, hata yönetimi gibi kesişen konular planlanmış mı?

**d) Task'lar Arası Tutarlılık:**
- İki task aynı şeyi mi yapıyor? (çakışma)
- Task'lar arasında sahipsiz kalan alan var mı? (boşluk)
- Bir task çok büyük mü? (bölünmeli mi?)
- Bir task çok küçük mü? (bitişik task'la birleştirilmeli mi?)
- Sıralama mantıklı mı? (bağımlılık zinciri doğru mu?)
- Task'lar arası yaklaşım tutarlı mı? (bir task'ta A yolu, diğerinde çelişen B yolu yok mu?)

### 4. Sonuçları Raporla

Kullanıcıya iki kategoride rapor sun:

**Doğrudan düzeltilen mekanik sorunlar:**
```
🔧 Mekanik Düzeltmeler (X sorun düzeltildi):
- TASK-N.03: Eksik referans doküman eklendi
- TASK-N.07: Typo düzeltildi (alt görev 2)
- TASK-N.12: Bağımlılık sırası düzeltildi
```

**Onay gerektiren yapısal öneriler:**
```
📋 Yapısal Öneriler (kullanıcı onayı gerekli):

1. TASK-N.05 çok büyük — 2 ayrı task'a bölünmeli:
   - TASK-N.05a: [açıklama]
   - TASK-N.05b: [açıklama]
   Onaylıyor musun?

2. Milestone kriteri "[kriter]" hiçbir task'ta karşılanmıyor.
   Öneri: TASK-N.XX oluştur — [açıklama]
   Onaylıyor musun?

3. TASK-N.08 ve TASK-N.09 büyük ölçüde çakışıyor.
   Öneri: Birleştir — [açıklama]
   Onaylıyor musun?
```

**Sorun yoksa:**
```
✅ Plan review tamamlandı. X task dokümanı kontrol edildi, sorun bulunamadı.
```

### 5. Onaylanan Değişiklikleri Uygula

Kullanıcının onayladığı yapısal değişiklikleri uygula:
- Task dokümanlarını düzelt, böl veya birleştir
- Yeni task dokümanları oluştur (gerekirse)
- Faz dokümanındaki task listesini güncelle (yeni/değişen task'lar)
- Task numaralamayı düzelt (gerekirse)

⚠️ **Bu adımda doğan ya da değişen her numara için: numara = faz içindeki en büyük YY + 1, `_dev/tasks/archive/` DAHİL sayılır** (kural evi `plan-phase`; arşivi Zorunlu #5'te zaten okudun — sayılmazsa çakışan iki `TASK-X.YY` geri alınamaz, ve `TASKS-README` yalnız numaranın **biçimini** taşır). Arşiv **sayılır ama değiştirilmez** (Adım 1).

### 6. DURUM.md Güncelle

- **Adım** alanını `task` olarak güncelle (plan review tamamlandı, sıradaki adım task çalıştırma)
- Çalıştırma (tablo) sırasındaki **ilk tamamlanmamış** task'ı aktif işaretle — genelde kesilen 🔄 task'tır; revizyon onun önüne yeni bir öncül koyduysa önce o çalışır
- Task tablosunu güncelle (yeni/değişen task'lar varsa)

### 7. Git Commit & Push

Tüm doküman değişikliklerini commit & push yap — Adım 6 her turda DURUM'u güncellediği için commit edilecek değişiklik her zaman vardır (koşullu yazılırsa sorunsuz turda faz durumu commit'siz kalır):
```
docs(phase-N): verify-plan — plan review completed
```

### 8. Sıradaki Adımı Öner

```
✅ Plan review tamamlandı. X task dokümanı kontrol edildi.
   Mekanik düzeltme: Y | Yapısal değişiklik: Z
📋 Sıradaki adım: /devflow:run-task
   → Aktif task'ı (TASK-N.XX) çalıştırmak için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

Son satırın kuralı, önekleri ve amblemi: **CLAUDE.md → Oturum Kapanışı** (engelleyen kalem varsa `📋` satırı terfi eder).

---

## Önemli Kurallar

- **Referans gerçeklik-kontrolü güvenliği:** Boş grep tek başına bulgu değildir (Prensip #11) — tanım sitesinde açıkça farklı bir literal (rename) varsa bulgudur. Greplenemeyeni veya repo-dışını (vault slot, uzak dashboard metriği) **"doğrulanamadı"** diye işaretle; in-repo proxy'yi (.env.example) otorite yerine koyma, uydurma. Referans çakışması **mekanik düzeltme değildir** → Adım 4 onay raporuna gider; yalnızca _dev dok reflerindeki net typo mekanik kalır.
- Bu oturumda task çalıştırılmaz — sadece plan review ve düzeltme
