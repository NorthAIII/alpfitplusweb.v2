# DevFlow — Proje Başlatma Oturum 2: Dokümanları Oluştur (Kickoff Docs)

Bu komut kickoff oturumunun ikinci adımıdır. İlk oturumda belirlenen yapıyı dokümanlarla somutlaştırır. `_dev/` klasörünü ve tüm temel dokümanları oluşturur. Re-kickoff modunda sadece etkilenen dokümanları günceller.

**Kullanım:** `/devflow:kickoff-docs`

**Ön Koşul:** `/devflow:kickoff` oturumu tamamlanmış olmalı.

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
Bu komut `_dev/` yapısını oluşturmak için çalışır; ilk çalıştırmada çekirdek protokol dokümanları ve CLAUDE.md henüz **yoktur**. Re-kickoff modunda CLAUDE.md varsa Oturum Başlangıç Protokolü uygulanır (eksik dosyalar atlanır).

### Zorunlu (hepsini oku)
1. `_dev/KICKOFF-NOTES.md` — Önceki oturumda alınan kararlar (modüller, fazlar, stack vb.)

### PRD Dokümanları (PRD varsa oku)
2. `_dev/PRD/VERSIONS.md` — Feature-versiyon haritası (MODULE-MAP'e Versiyon sütunu aktarmak için)
3. `_dev/PRD/features/` altındaki feature dokümanları — MODULE dokümanlarına bilgi aktarımı için

### Mevcut İlkeler (varsa oku)
- `_dev/ILKELER.md` — `prd` ya da `map-codebase` oluşturmuş olabilir. Adım 3'te koruyup/doldurmadan önce mevcut içeriği **oku** (template'ten yeniden üretip ezme).

### Template'ler (doküman oluştururken oku)
Her dokümanı oluştururken ilgili template'i `.claude/commands/devflow/templates/` klasöründen oku:
- `OVERVIEW.md` → template: `.claude/commands/devflow/templates/OVERVIEW.md`
- `ILKELER.md` → template: `.claude/commands/devflow/templates/ILKELER.md`
- `INDEX.md` → template: `.claude/commands/devflow/templates/INDEX.md`
- `DURUM.md` → template: `.claude/commands/devflow/templates/DURUM.md`
- `MODULE-MAP.md` → template: `.claude/commands/devflow/templates/MODULE-MAP.md`
- `PHASES.md` → template: `.claude/commands/devflow/templates/PHASES.md`
- `QUALITY.md` → template: `.claude/commands/devflow/templates/QUALITY.md`
- `TASKS-README.md` → template: `.claude/commands/devflow/templates/TASKS-README.md`
- `DECISIONS.md` → template: `.claude/commands/devflow/templates/DECISIONS.md`
- `MEMORY.md` → template: `.claude/commands/devflow/templates/MEMORY.md`
- Modül dokümanları → template: `.claude/commands/devflow/templates/MODULE.md`

---

## Akış seçimi — hangi bölüm koşar? (her şeyden önce belirle)

Aşağıda iki tam akış var; **hangisine gireceğini ölçerek belirle, önceki oturumun kip kararına güvenme** — o karar `kickoff`'ta kullanıcıyla verilir ama kapanış bloğu onu taşımaz. **Ölçüt tek ve kanoniktir: `_dev/DURUM.md` var mı?** Kanon o dosyanın yokluğunu zaten "proje başlatılmamıştır" diye okur (CLAUDE.md → Okuma onayı), ve onu üreten iki komut vardır: bu dosyanın İlk Kickoff akışı ve `map-codebase`.

- **DURUM.md varsa → Re-Kickoff.** Proje dokümanları duruyor; işin delta'yı onlara işlemektir. Üç ayak izi de buraya düşer ve üçü de doğrudur: kurulu proje · **brownfield girişi** (`map-codebase` → `prd` → re-kickoff — `map-codebase` DURUM'u üretir ama parent'ı bilinçle üretmez, onu `kickoff-verify` Adım 3 doğurur) · **eski kurulum** (CLAUDE.md'den önceki sürümler).
- **DURUM.md yoksa → İlk Kickoff.** Dokümanlar sıfırdan doğacaktır. `_dev/`'in kendisi bu hâlde de **dolu olabilir** ve bu normaldir: `kickoff` `KICKOFF-NOTES.md`'yi, `prd` ise `PRD/` ile `ILKELER.md`'yi bırakmış olur — bu yüzden ölçüt "`_dev/` dolu mu" değildir, o soru PRD'li greenfield'ı yanlış akışa sokar.

⚠️ **Doktrin parent'ının varlığı bu ölçüte girmez.** Parent varken DURUM.md yoksa (biri `kickoff-verify` Adım 3'ü erken koşmuş ya da dosya silinmiş olabilir) hüküm yine **İlk Kickoff**'tur: eksik olan dokümanlardır ve bu akış tam onları doğurur — CLAUDE.md'ye hiç dokunmaz, parent'ın yeri `kickoff-verify` Adım 3'ün işidir. Buraya bir duruş kapısı koyma: o hâlin onarımı zaten bu akıştır, ve kullanıcıyı `kickoff-verify`'a yollamak boş bir tura mal olur — o komut kipini `_dev/DURUM.md`'nin Aktif Faz alanından ölçer ve dosya yokken **ÖLÇÜLEMEDİ**'ye düşüp durur.

⚠️ **Yanlış akış geri alınması pahalıdır:** İlk Kickoff'un Adım 3'ü DURUM'u `Phase 1 / discuss` diye yeniden kurar ve PHASES'in Faz Durumu tablosunu **boş başlatır** — kurulu bir projede bu, yürüyen fazın konumunu siler.

## Yapılacaklar — İlk Kickoff

### Adım 1: Önceki Oturumun Kararlarını Doğrula

`_dev/KICKOFF-NOTES.md` dosyasını oku. Kullanıcıya kısaca özetle:
- "Önceki oturumda şu yapıyı belirlemiştik: [özet]. Değişiklik var mı?"
- Değişiklik varsa not al, yoksa devam et.

### Adım 2: `_dev/` Yapısını Oluştur

Projenin repo'sunda aşağıdaki yapıyı oluştur:

```
_dev/
├── OVERVIEW.md
├── ILKELER.md             ← varsa (prd/map-codebase kurmuş) korunur; PRD'siz greenfield'da burada doğar
├── INDEX.md
├── DURUM.md               ← Aktif Versiyon alanı dahil
├── MEMORY.md              ← Proje hafızası index'i (boş template; memory/ ilk öğrenimde oluşur)
├── MODULE-MAP.md           ← Versiyon sütunu dahil
├── PHASES.md
├── QUALITY.md
├── modules/
│   ├── M1-ModulAdi.md      ← PRD'den bilgi aktarımı dahil
│   └── ...
├── phases/                 (boş)
├── docs/
│   └── DECISIONS.md
└── tasks/
    ├── TASKS-README.md
    ├── quick/
    └── archive/
```

### Adım 3: Dokümanları Doldur

Her dokümanı template'e uygun oluştur:

> **KURAL yorumlarını koru:** Template'teki `<!-- KURAL: ... -->` yorumları üretilen dokümana **olduğu gibi aktarılır** — silinmez. Bunlar dokümanın yapısal kuralının **tek kaynağıdır** (audit-docs onları ground-truth alır). Yalnızca `[placeholder]` yer tutucuları doldurulur; `<!-- OPSİYONEL -->` strip-işaretleri ihtiyaca göre işlenir.

**DURUM.md** — Başlangıç durumu. **"Aktif Versiyon" alanı eklenir** — PRD'deki ilk versiyon yazılır. **"Versiyon Sonu Durumu" alanı `içerik_fazları` olarak başlatılır.** Aktif faz: Phase 1 (ilk kickoff'ta boş Faz Durumu tablosunda max+1 = 1; bkz. PHASES.md → Faz Numaralandırma Kuralı), adım: "discuss".

**MODULE-MAP.md** — Feature-Faz Matrisi'ne **Versiyon sütunu eklenir**:
```
| Feature | Modül | Versiyon | Faz | Durum |
|---------|-------|----------|-----|-------|
| F1.1: [Feature] | M1 | v0.1 | — | ⬜ |
| F2.1: [Feature] | M2 | v0.5 | — | ⬜ |
```
Versiyon sütunu PRD'deki VERSIONS.md'den feature-versiyon eşleştirmesi aktarılarak doldurulur. **PRD yoksa Versiyon sütunu eklenmez** — versiyon takibi PRD'ye bağlıdır. **Faz sütunu bu oturumda tüm feature'larda `—`'dir** — feature'a faz numarası, o faza girildiğinde (discuss-phase) atanır (just-in-time; bkz. PHASES.md → Faz Numaralandırma Kuralı).

**PHASES.md** — Faz Durumu tablosu **boş başlar** (henüz girilmiş faz yok). ⚠️ **Bu boşluk ölçülüyor:** `kickoff-verify` çağrı kipini bu tablodan belirler (ölçüt onun kendi *Çağrı kipi* bloğundadır) — tabloya burada bir satır yazılırsa ilk kurulumun kapanışı "hedefli onarım" sanılır — ve o çağrı çıplak olduğu için **hiçbir adım koşmaz**: CLAUDE.md, git stratejisi ve native memory yönlendirmesi doğmaz. Kickoff'ta taslaklanan yakın faz konularını (konu + milestone) numarasız **Sıradaki Fazlar** listesine yaz — ilk faz dahil hiçbiri önceden numaralanmaz. İlk faz, discuss-phase 1'de numara (1) alıp Faz Durumu tablosuna geçer (bkz. PHASES.md → Faz Numaralandırma Kuralı).

**MEMORY.md** — Template'ten oluştur (index formatı). Boş başlangıç — proje ilerledikçe öğrenimler `_dev/memory/<slug>.md` dosyalarına yazılıp index'e pointer eklenerek dolar. `memory/` klasörü ilk öğrenimde oluşur (şimdi boş klasör açma).

**ILKELER.md** — **Güvenlik ağı:** `prd` ya da `map-codebase` oluşturmuş olabilir → varsa olduğu gibi koru, kickoff bağlamında belirginleşen projeye-özgü ilkeleri (ufuk, öncelikli eksenler, pazarlık-konusu-olmayanlar) teyit edip doldur. **Dosya yoksa** (PRD'siz greenfield ya da elle-hazırlanmış PRD) **template'ten oluştur** — "Bu Projeye Özgü" alanları kickoff'ta kullanıcıya sorulan ilke cevaplarından (KICKOFF-NOTES) doldurulur; cevabı olmayan alanda template'in bracket prompt'unu ham bırakma — boş bırak ya da "henüz tanımlanmadı" yaz (boş = henüz konuşulmadı/ertelendi). Sınırı koru — yön/öncelik burada, somut teknik kural CLAUDE.md'de.

**Modül Dokümanları** — PRD'den bilgi aktarımı:
- PRD feature dokümanlarındaki **davranış kuralları** → MODULE dokümanlarındaki kabul kriterlerine dönüşür
- PRD feature dokümanlarındaki **edge case'ler** → MODULE dokümanlarına aktarılır
- PRD feature dokümanlarındaki **kullanıcı senaryoları** → MODULE dokümanlarında referans olarak yer alır
- PRD'deki **teknik kısıtlamalar ve tercihler** → ilgili MODULE dokümanlarına aktarılır
- Opsiyonel izlenebilirlik notu eklenebilir: `**PRD Referans:** _dev/PRD/features/xxx.md`
- **Çelişki veya belirsizlik varsa kullanıcıya sorulur** — sessizce bir tarafı tercih etme

**Diğer dokümanlar** — Mevcut davranışla aynı: OVERVIEW, INDEX, QUALITY, TASKS-README, DECISIONS.

### Adım 4: Projeye Özgü Dokümanlar

Önceki oturumda belirlenen ek dokümanları oluştur (STYLE-GUIDE, TECH-STACK, DATABASE vb.)

### Adım 5: INDEX.md'yi Güncelle

Oluşturulan tüm **içerik dokümanlarını** INDEX.md'ye ekle (modül, docs, PRD içerik, projeye özgü sabitler). ILKELER.md de INDEX'te yer alır (template'te zaten listeli). Task/faz gibi sıralı dokümanlar enumere edilmez — INDEX onlar için yalnızca klasör konumunu gösterir (bu oturumda zaten task/faz dokümanı oluşturulmaz).

### Adım 6: KICKOFF-NOTES.md'yi Sil

Tüm dokümanlar oluşturulduktan sonra `_dev/KICKOFF-NOTES.md` dosyasını sil. (Silmeden önce NOTES'taki tüm kararların — ilke cevapları dahil — dokümanlara aktarıldığından emin ol; aktarılmamış karar varken silme.)

### Adım 7: Git Commit & Push

Tüm oluşturulan dokümanları commit & push yap:
```
docs: kickoff-docs — project documents created
```

### Adım 8: Özet ve Sıradaki Adım

```
✅ Proje dokümanları oluşturuldu. KICKOFF-NOTES.md silindi.
📋 Sıradaki adım: /devflow:kickoff-verify
   → Oluşturulan dokümanları kontrol etmek ve CLAUDE.md'yi oluşturmak için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

⚠️ **İkinci cümle koşulludur — dosyayı gerçekten sildiysen yazılır.** Adım 6'nın guard'ı aktarılmamış bir karar yüzünden silmeyi durdurduysa cümle *"KICKOFF-NOTES.md duruyor — [aktarılamayan karar]"* olur. **Kalem `engel:` kulvarındadır ve bu terfi demektir:** işin bir DevFlow komutu vardır (`/devflow:kickoff-docs` — aktarım bu komutun kendi gövdesidir), yani `📋` ona geçer, `kickoff-verify` `→` satırında "ondan sonra" diye anılır ve kalem son satırda **tekrarlanmaz** (kanon: Oturum Kapanışı → Terfi kuralı; alıcı ev aynı hükmü veriyor: `kickoff-verify` → Adım 1 → *b) Doküman Bütünlüğü*). Olmamış bir silmeyi bildirmek, o komutun aynı dosyayı bir tur sonra yeniden bulmasıyla sonuçlanır ve kullanıcı iki kez "tamamlandı" görür. **Terfi ettiğin çağrı Re-Kickoff akışına düşer ve bu doğrudur** — dokümanlar artık vardır, kalan iş NOTES'taki kararı onlara işlemektir; aynı guard orada da silmeyi kapatır.

Son satırın kuralı, önekleri ve amblemi: **CLAUDE.md → Oturum Kapanışı** (engelleyen kalem varsa `📋` satırı terfi eder).

---

## Yapılacaklar — Re-Kickoff

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Re-kickoff modunda CLAUDE.md **varsa** Oturum Başlangıç Protokolü uygulanır (yukarıdaki "Okunacak Dosyalar") — uygula ve tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). **Yoksa** (brownfield girişi — yukarıdaki Akış seçimi'nin saydığı rota: `map-codebase` → `prd` → re-kickoff; parent'ı `kickoff-verify` Adım 3 doğurur) protokol atlanır ama **onay satırı yine yazılır**: olmayan çekirdek dosyalar `—` ile işaretlenir ve satırın biçimi için `templates/CLAUDE-MD.md` → "Okuma onayı" okunur (aynı kol kardeş komutta da yazılı: `kickoff` → Re-Kickoff Modu → Adım 0). Onay yazılmadan başlama; yazınca da durma — aşağıdaki Re-Kickoff akışına geç.

Re-kickoff sadece delta ile ilgilenir ve **merge prensibiyle** çalışır:
- **Mevcut bilgi korunur** — MODULE'lerde faz döngüsü sırasında eklenmiş bilgiler aynen kalır
- **Yeni bilgi eklenir** — PRD'den gelen yeni bilgiler eklenir
- **Her çelişki için kullanıcıya sorulur** — Claude kendi başına karar vermez

### Güncellenen Dokümanlar
- **MODULE-MAP.md** — Yeni modüller, kaldırılan feature'lar, değişen bağımlılıklar, versiyon güncellemeleri
- **PHASES.md** — Yeni faz konularını **Sıradaki Fazlar**'a (numarasız) ekle; numara faza girince atanır. Girilmiş/tamamlanmış fazlara (Faz Durumu tablosu) dokunma.
- **Etkilenen modül dokümanları** — PRD'den güncellenen bilgiler merge prensibiyle aktarılır
- **DURUM.md** — Aktif durumu güncelle; **Aktif Versiyon'u PRD'nin yeni durumuna göre belirle**: tamamlanan versiyon kapandıysa VERSIONS.md'deki feature-versiyon haritasından sıradaki versiyona ilerlet (sıradaki yoksa boş bırak); değişiklik hâlâ süren/yeniden-açılan versiyona aitse o versiyonu koru. Versiyon Sonu Durumu'nu `içerik_fazları` olarak sıfırla — mevcut değer `prd_review_bekliyor` ise sıfırlamadan önce dur ve kullanıcıyla teyit et: tamamlanan versiyonun prd-review'u yapılmamış ya da bilinçli ertelenmiş olabilir (zorunlu adım sessizce düşmesin)
- **INDEX.md** — Yeni içerik dokümanı (modül, docs, PRD içerik) eklendiyse güncelle (task/faz enumere edilmez)
- Gerekirse projeye özgü dokümanlar

### Dokunulmayan Dokümanlar
- Tamamlanmış faz dokümanları
- OVERVIEW.md (vizyon değişmediyse)
- ILKELER.md (ilkeler değişmediyse — değişiklik prd/prd-refine/prd-review'da bilinçli yapılır). **İstisna:** dosya hiç yoksa (eski kurulum) template'ten oluştur — "Bu Projeye Özgü" alanlarını kullanıcıya sorarak doldur, cevaplanmayan alan boş kalır; oluşturunca INDEX'e de ekle; var olana dokunmama kuralı aynen kalır
- Değişiklikten etkilenmeyen modül dokümanları
- DECISIONS.md (mevcut kararlar korunur)

### Re-Kickoff Sonrası

KICKOFF-NOTES.md'yi sil (silmeden önce aktarım kontrolü — bkz. İlk Kickoff → Adım 6), değişiklikleri commit & push yap:
```
docs: re-kickoff — documents updated
```

Sıradaki adımı öner:
```
✅ Re-kickoff tamamlandı. Değişiklikler dokümanlara yansıtıldı.
📋 Sıradaki adım: /devflow:kickoff-verify (re-kickoff kapanışı)
   → Güncellenen dokümanları kontrol etmek için yeni bir oturum başlat.
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

⚠️ **Bu bloğun ilk iki satırı koşulludur** (aynı koşulluluk İlk Kickoff → Adım 8'de) — blok her hâlde yazılır, yalnız içeriği değişir. Aktarım kontrolü (İlk Kickoff → Adım 6) aktarılmamış bir karar bulduysa özet satırı *"Re-kickoff dokümanlara yansıdı — KICKOFF-NOTES.md duruyor: [aktarılamayan karar]"* olur; kalem `engel:` kulvarındadır, yani `📋` **`/devflow:kickoff-docs`'a terfi eder** ve aşağıdaki kip notu o turda **yazılmaz** — notun işi `kickoff-verify`'a kip söylemektir, o tura gidilmiyor.

**Parantezli kip notu bu dalda zorunludur, süs değil** (kanon: CLAUDE.md → Oturum Kapanışı, *"Parantezli kip notu argüman değildir"*). Faz ortasında koşan re-kickoff — PRD ekleme yolu — Aktif Fazı boşaltmaz, yani `kickoff-verify` çağrıyı **hedefli onarım** kipinde karşılar ve orada çıplak çağrının çalıştıracak adımı yoktur. Notu düşürürsen o komut, senin adıyla gönderdiğin oturumda "ne aradın?" diye sormak zorunda kalır (alıcı ev: `kickoff-verify` → Çağrı kipi → çıplak çağrı fıkrası).

---

## Önemli Kurallar

- Bu oturumda task çalıştırma — sadece doküman oluşturma/güncelleme
- Template'lere uy ama projeye göre uyarla — placeholder bırakma
- Bilgi tekrarı yapma — her bilgi tek yerde olmalı
- `_dev/` izolasyonunu koru — projenin kendi dokümanlarıyla karıştırma
- Faz dokümanı (PHASE-1.md) bu oturumda OLUŞTURULMAZ — o discuss-phase'de oluşturulacak
- INDEX.md'ye sadece oluşturulmuş **içerik dokümanlarını** yaz (task/faz enumere edilmez, klasör konumu yeterli)
- PRD→MODULE aktarımında perspektif dönüşümü yap: PRD'deki serbest format davranış kuralı → MODULE'de test edilebilir kabul kriterine dönüşür
- Çelişki gördüğünde varsayım yapma, kullanıcıya sor
