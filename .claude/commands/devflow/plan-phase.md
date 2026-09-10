# DevFlow — Task Yazımı ve Plan Doğrulama (Plan Phase)

Bu komut feature'ları task'lara bölmek, task dokümanlarını yazmak ve planı doğrulamak için kullanılır.

**Kullanım:** `/devflow:plan-phase [N]` — N = faz numarası (belirtilmezse DURUM.md'den aktif fazı al)

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/MODULE-MAP.md`
2. `_dev/QUALITY.md`
3. `_dev/ILKELER.md` — Proje ilkeleri (task kapsamı ve kriterlerini yönlendirir)
4. `_dev/tasks/TASKS-README.md` — task format kuralları
5. Aktif faz dokümanı (`_dev/phases/PHASE-N.md`) — "Kapsam Tartışması" ve "Araştırma Bulguları" bölümlerini oku

**Göreve Göre (ilgili adımlarda okunacak)**
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili modülleri tespit et, `_dev/modules/MX-*.md` dosyalarını oku
- TASK template → **Adım 3'te** oku: `.claude/commands/devflow/templates/TASK.md`
- **Revizyon modunda** ("Yapılacaklar" girişindeki tespit): faz dokümanının Task Listesi + bu fazın TÜM task dokümanları — `_dev/tasks/` VE `_dev/tasks/archive/` (numara devamlılığı ve kapsam için) + kesilen task'ın Oturum Kaydı'ndaki revizyon gerekçesi (varsa)

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

**Revizyon modu tespiti:** DURUM'da Adım=`plan` ama bu fazın task dokümanları **zaten yazılmışsa** (Task Listesi dolu — ✅/🔄 task'lar dahil) bu bir **plan revizyonudur**: run-task revizyon gerektiğini tespit edip Adım'ı `plan`'a çekmiştir (plan hatası → kesilen task = DURUM'daki Aktif Task; keşif ayağının bulgusu → **kesilen task yoktur** — ayak ✅ kapanıp arşive gitmiştir, gerekçe onun Oturum Kaydı'ndadır ve Aktif Task sıradaki ⬜ task'a ilerlemiştir) ya da kullanıcı planı değiştirmek istemiştir (revizyon gerekçesini kullanıcıdan al). Bu modda:

- Revizyonu tetikleyen task'ın (kesilen task ya da ✅ kapanmış keşif ayağı — o arşivdedir) Oturum Kaydı'ndaki revizyon gerekçesini ve bu fazın tüm task dokümanlarını (**arşiv dahil**) oku.
- Sıfırdan plan yazma — yalnız **hedefli ekleme/düzenleme** yap.
- **Yeni task numarası = faz içindeki en büyük YY + 1 (arşivdekiler DAHİL sayılır)** — numara çakışması önlenir. Araya giren task'ı Task Listesi'nde **çalıştırma sırasındaki yerine** koy, Bağımlılıklar alanına öncüllerini yaz ve **etkilenen sonraki task'ların Bağımlılıklar alanına yeni task'ı ekle** (run-task'ın bağımlılık-durması gerçek güvenlik ağı olsun) — revizyon sonrası numara sırası çalıştırma sırasından sapabilir; **tablo sırası esastır** (kural evi: TASKS-README → Lineer Çalıştırma).
- **Kesilen task'la da hesaplaş** (keşif dalında kesilen task yoktur — bu madde düşer)**:** varsayımı değiştiyse Hedef/Alt Görevler'ini düzelt; hâlâ geçerliyse 🔄 kalır; geçersizleştiyse ❌ İptal işaretle + gerekiyorsa yerine yeni task. Revizyon bitince kesilen task'ın Oturum Kaydı'na tek satır düş: "plan revize edildi ([özet]) — task kaldığı yerden devam edebilir / iptal edildi".
- Çıkışta öneri (**karar kullanıcının, commit'ten önce alınır** — DURUM değişikliği aynı commit'e girer): yapısal değişiklik yaptıysan → verify-plan (DURUM Adım=`verify-plan`); tek küçük hedefli düzeltmeyse → doğrudan run-task (DURUM Adım=`task`; aktif task = **çalıştırma/tablo sırasındaki ilk tamamlanmamış task** — genelde kesilen 🔄 task'tır, ama revizyon onun önüne yeni bir öncül koyduysa önce o çalışır).
- Commit mesajı: `docs(phase-N): plan revision — [kısa açıklama]`.

Adım 1-8 normal akıştır; revizyon modunda yalnız yukarıdaki farklarla uygulanır.

### 1. Faz Bağlamını Topla

Faz dokümanından:
- **Kapsam tartışması kararları:** Kullanıcının tercihleri, kapsam dışı bırakılanlar
- **Araştırma bulguları:** Seçilen yaklaşımlar, dikkat edilecekler, kullanılacak araçlar
- **Milestone:** Fazın başarı kriteri
- **Feature listesi:** Yapılacak feature'lar

Modül dokümanlarından:
- Feature kabul kriterleri
- Edge case'ler
- Bağımlılıklar

### 2. Feature'ları Task'lara Böl

Her feature'ı küçük, otonom task'lara böl.

Bölerken **memory'deki "Süreç Disiplinleri"ni gözet** (varsa) — proje retrolarından çıkan planlama kuralları (örn. multi-touch entegrasyonu ayrı alt-task'lara böl) burada uygulanır.

**ILKELER.md'yi gözet:** Task'ları bölerken ve kriterleri yazarken proje ilkelerini taşı — kolaya kaçan değil kalıcı çözümü hedefleyen alt-görevler, sır/konfig ilkesini ihlal etmeyen kapsam, ilkenin gerektirdiği test kriterleri. Bir ilke task seviyesinde somutlaşıyorsa (örn. "test kümülatif büyür" → her task'ta test kriteri) bunu task dokümanına yansıt.

**Task Boyutu Kuralları:**
- Tek bir feature'ın tek bir somut parçasını yapar
- 1-3 dosya değişikliği ile tamamlanabilir
- Tek oturumda, durmadan bitirilecek boyutta
- "Önce şunu sonra bunu" diye ikiye bölünebiliyorsa → bölünmeli
- Task sayısının fazla olması sorun değil — küçük ve odaklı olması önemli

**Task Numaralama:** `TASK-X.YY` — X = faz numarası, YY = task sırası (01, 02, 03...)

**Task Sıralaması:**
- Bağımlılık sırası: Bir task bir öncekinin çıktısını gerektiriyorsa, önceki ilk gelir
- Mantıksal yapım sırası: Temel yapılar önce, detaylar sonra

### 3. Task Dokümanlarını Yaz

**Önce oku:** `.claude/commands/devflow/templates/TASK.md`

Her task için `_dev/tasks/TASK-X.YY.md` dosyası oluştur. Template'e uygun yaz.

**Opsiyonel bölümler:** Task template'indeki `<!-- OPSİYONEL -->` ile işaretli bölümler (Bağlam, Karar Noktaları, Risk ve Geri Dönüş Planı) sadece gerektiğinde doldurulur. Gerekmiyorsa bölümü tamamen sil — "Yok" veya "Düşük risk" gibi boş dolgu yazma. Bu context tasarrufu sağlar.
- **Bağlam:** Hedef bölümü tek başına yeterliyse silinilebilir. Karmaşık geçmişi olan veya mimari kararın sonucu olan task'larda doldur.
- **Karar Noktaları:** Birden fazla geçerli yaklaşım veya kullanıcıya sorulacak karar yoksa sil.
- **Risk ve Geri Dönüş Planı:** Mevcut kodu değiştirmeyen, migration içermeyen, geri dönüşü kolay task'larda sil.

**Task dokümanına mutlaka dahil et:**
- Kapsam tartışmasındaki ilgili kararları (referans veya somutlaştırma)
- Araştırma bulgularındaki ilgili dikkat noktalarını
- Modül dokümanlarındaki edge case'leri
- Somut test kriterleri
- Doğrulama adımları
- **Artifact referanslarının kaynağını işaretle:** Bir referansın (dosya yolu; Dikkat Noktaları'ndaki metric/uid/secret-slot/env-config anahtarı) bu fazda mı yaratılacağını yoksa zaten var olmasının mı beklendiğini netleştir — yaratılacak dosyaları Etkilenen Dosyalar'da `YENİ` ile işaretle. Zaten-var beklenen bir tanımlayıcıdan emin değilsen tahminle doldurma, kaynağını grep/oku (Çalışma Prensibi #11). Doğrulama verify-plan'da yapılır; burada yalnızca kaynağı belirt.

### 4. Hızlı Gözden Geçirme

Task dokümanları yazıldıktan sonra hızlı bir kontrol yap:
- Task numaralandırma ve bağımlılık sırası doğru mu?
- Zorunlu bölümler (Hedef, Alt Görevler, Test Kriterleri) doldurulmuş mu?
- Açıkça eksik veya hatalı bir şey var mı?

Hatalı bir şey fark edersen düzelt. **Detaylı doğrulama (milestone, gereksinim, kalite, tutarlılık kontrolleri) ayrı oturumda verify-plan'da yapılacak.**

### 5. Faz Dokümanını Güncelle

Faz dokümanındaki task listesini güncelle:

```markdown
## Task Listesi

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 1.01 | TASK-1.01 | ⬜ Bekliyor | [kısa açıklama] |
| 1.02 | TASK-1.02 | ⬜ Bekliyor | [kısa açıklama] |
| ... | ... | ... | ... |
```

### 6. DURUM.md Güncelle

- DURUM.md'deki **Adım** alanını `verify-plan` olarak güncelle (task yazımı tamamlandı, sıradaki adım plan review)
- Task durum tablosunu güncelle

### 7. Git Commit & Push

Tüm doküman değişikliklerini commit & push yap:
```
docs(phase-N): plan — X task documents created
```

### 8. Sıradaki Adımı Öner

```
✅ Planlama tamamlandı. X task dokümanı oluşturuldu.
📋 Sıradaki adım: /devflow:verify-plan
   → Task dokümanlarını review etmek için yeni bir oturum başlat.
```

---

## Önemli Kurallar

- Bu oturumda task çalıştırılmaz — sadece task dokümanları yazılır
