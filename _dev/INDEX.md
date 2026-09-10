# INDEX — Doküman Yol Haritası

**Amaç:** Hangi durumda hangi dokümanı okuyacağını bilmek

---

<!-- KURAL: INDEX iki tür kayıt tutar:
     1. İÇERİK DOKÜMANLARI (modules/, docs/, PRD içerik dosyaları, projeye özgü sabitler) → TEK TEK enumere edilir, her birinin ne içerdiği yazılır. Konumu ve içeriği öngörülemez; hangi alanda doküman olduğu yalnızca burada bilinir. Yeni içerik dokümanı oluşturulduğunda INDEX güncellenir. Sadece mevcut dokümanlar listelenir, oluşturulmamışlar yazılmaz.
     2. SIRALI/ÖNGÖRÜLEBİLİR DOKÜMANLAR (tasks/, phases/) → TEK TEK enumere EDİLMEZ. Sadece klasör konumu ve isim deseni belirtilir. Güncel liste zaten DURUM.md (aktif task, task durumu) ve PHASES.md (faz özeti)'nde tutulur — burada tekrar edilmez.
     3. BULGULAR.md oluşturulduğunda "Planlama Dokümanları" listesine tek satırla eklenir; bulgular/ klasörü ve atomları TEK TEK enumere EDİLMEZ — güncel liste zaten BULGULAR.md index'indedir (arşiv: ls _dev/bulgular/archive/).
     4. claude/ (CLAUDE.md doktrin çocukları) — proje bölünmüşse (`_dev/claude/` varsa) yalnızca aşağıdaki Doküman Hiyerarşisi ağacında görünür, bölünmemişse ağaca hiç yazılmaz; "Her Oturum Başında OKU" listelerine hiçbir hâlde GİRMEZ — kök CLAUDE.md onları @import ettiği için içerikleri zaten bağlamdadır, okuma listesine yazmak aynı metni ikinci kez okutur. Kesim motorda sabittir (templates/claude/), projede yeniden kararlaştırılmaz. -->
<!-- NOT: Tüm dokümanlar _dev/ klasöründedir. Aşağıdaki yollar _dev/ klasörüne göredir. -->

## Tüm Dokümanlar

### Temel Dokümanlar (Her Oturum Başında OKU)

1. **OVERVIEW.md** — Proje kimliği, stack, amaç, kapsam
2. **INDEX.md** — Bu dosya (navigasyon haritası)
3. **DURUM.md** — Dashboard (aktif faz, aktif task, son ilerleme)
4. **MEMORY.md** — Proje hafızası index'i (öğrenim pointer'ları; detay `memory/<slug>.md` dosyalarında, gerekince lazy-load). `memory/` dosyaları tek tek burada listelenmez — güncel liste MEMORY.md index'indedir.
5. **GIT-STRATEJI.md** — Dal modeli, çalışma dalı, commit/push, yayın ve acil düzeltme rotası (her oturum commit/push kararı verdiği için okunur). *kickoff-verify'da doğar; henüz yok.*

### Planlama Dokümanları (Planlama ve Review'da OKU)

6. **MODULE-MAP.md** — Modül ve feature haritası (özet/index)
7. **PHASES.md** — Faz durum özeti + sıradaki fazlar
8. **QUALITY.md** — Kalite eksenleri ve kontrol noktaları
9. **ILKELER.md** — Proje ilkeleri / yön (prd, prd-refine, prd-review, kickoff, discuss, research, plan'da OKU; ilk kickoff yalnızca varsa)
10. **BULGULAR.md** — Proje sorun kanvası index'i: açık bulgular, kullanıcıya bağlı işler, bilinçli tercihler (atomlar `bulgular/`, arşiv `bulgular/archive/`)

### Projeye Özgü Sabitler (Her Oturumda OKU)

<!-- KURAL: Giriş kriteri CLAUDE.md → Oturum Başlangıç Protokolü'ndeki sabit-doküman KURAL'ıdır (görevden bağımsız, gerçekten her oturum yön veren). Bu bölüm CLAUDE.md'deki listenin aynasıdır — ikisi birlikte güncellenir. -->

| Doküman | İçerik |
|---------|--------|
| `docs/CLAIMS.md` | İddia sınırı — ne söylenir, ne söylenmez; rakip adsızlığı; tek kaynak sabitleri (`PRODUCT_STATUS`, `PRICING`) |
| `docs/STYLE-GUIDE.md` | Tasarım tokenları özeti, tipografi (Sora'da ₺ yok), düzen tuzakları (sticky/overflow, `min-w-0`), kullanıcının nefret ettiği ve istediği kalıplar |

### PRD Dokümanları (PRD Oturumlarında OKU)

Bu projede PRD yok (kullanıcı kararı, kickoff 2026-09-11). Feature davranışı ve kabul kriterleri doğrudan `modules/` dokümanlarında; versiyon planı `PHASES.md` → Sıradaki Fazlar ve `docs/DECISIONS.md`.

### Modül Dokümanları (İlgili Modül Gerektiğinde OKU)

| Doküman | Modül |
|---------|-------|
| `modules/M1-Icerik-ve-Iddia-Kaynagi.md` | M1 — `src/content/*` tek kaynak; metin tonu işi (üç şüpheli cümle); chat ağacı |
| `modules/M2-Sayfalar-ve-Bolumler.md` | M2 — Rotalar, 22 bölüm, yerleşim ve UI ilkelleri |
| `modules/M3-Lead-Hatti.md` | M3 — Demo formu, `/api/demo`, dayanıklı kayıt, e-posta, WhatsApp yedeği |
| `modules/M4-Site-Asistani.md` | M4 — Hazır akış asistanı; Claude bağlantısı; iddia test seti |
| `modules/M5-Gorsel-Varlik-Hatti.md` | M5 — render-product, photos-build, font-subset, brand-assets |
| `modules/M6-Kalite-Kapilari.md` | M6 — Beş ölçüm betiği; tek komut; CI; sızıntı denetimi; **başlangıç ölçümü** (regresyon çizgisi) |
| `modules/M7-Yayin-ve-Altyapi.md` | M7 — Docker, Vercel ayrı proje, env, başlıklar, analitik, 301 haritası (20 adres) |

### Faz Dokümanları (Aktif Faz OKU)

`phases/` klasöründe `PHASE-N.md` deseninde. Tek tek listelenmez — güncel faz listesi ve durumları **PHASES.md**'de, aktif faz **DURUM.md**'de.

### Task Dokümanları (Task Çalıştırırken OKU)

- **tasks/TASKS-README.md** — Task sistemi kuralları
- `tasks/TASK-X.YY.md` — Aktif task; tek tek listelenmez, güncel task **DURUM.md**'de
- `tasks/archive/` — Tamamlanmış task'lar (aynı isim deseni)
- `tasks/quick/` — Ad-hoc quick task kayıtları

### Bilgi Havuzu (İhtiyaca Göre)

| Doküman | İçerik |
|---------|--------|
| `docs/DECISIONS.md` | Karar günlüğü — fiyat sunumu, tek dil, chatbot sırası, fotoğraf, faz sırası, modül yapısı, rakip adsızlığı (tarihli) |
| `../README.md` (repo kökü) | Yığın, çalıştırma komutları, araştırma konteyneri, ürün görseli hattı — ayrı TECH-STACK yazılmadı |
| `../CLAUDE.md` (repo kökü) | Ölçüm betikleri tablosu ve geçme şartları, Docker uyarıları, dokunulmayacaklar |

---

## Senaryolar — Hangi Durumda Ne Oku?

> Bu senaryolar kaba okuma rehberidir (Zorunlu/Göreve-Göre ayrımı yapmaz). Bir `/devflow:` komutu çalışırken **yetkili kaynak o komutun kendi "Okunacak Dosyalar" bölümüdür**; çelişki olursa komut dosyası kazanır.

### SENARYO: Geliştirme Sırasında Not (prd-note)
1. Temel dokümanlar
2. Konuyla ilgili proje dosyaları (PRD yok; PRD/vizyon düzeyi fikir yine prd-note ile `PRD/NOTES.md`'ye düşer — dosya ilk notta oluşur)

### SENARYO: Task Çalıştırma
1. Temel dokümanlar
2. Projeye özgü sabitler (CLAIMS, STYLE-GUIDE)
3. tasks/TASKS-README.md
4. QUALITY.md — kod yazarken kalite eksenleri
5. tasks/[AKTİF-TASK].md
6. Task dokümanındaki "Referans Dokümanlar" bölümündeki dokümanlar
7. INDEX'ten göreve göre ek dokümanlar

### SENARYO: Kapsam Tartışması (Discuss Phase)
1. Temel dokümanlar
2. ILKELER.md — proje ilkeleri (gri alan kararlarını yönlendirir)
3. MODULE-MAP.md
4. PHASES.md — Faz Durumu tablosu (faz no = max+1), Sıradaki Fazlar, faz promosyonu (Adım 6 buraya yazar)
5. Fazın kapsadığı modül dokümanları (modules/)
6. BULGULAR.md — faza alınabilecek açık bulgular
7. Aktif faz dokümanı (phases/PHASE-X.md)
8. Önceki fazın retrospektifi (varsa)

### SENARYO: Teknik Araştırma (Research Phase)
1. Temel dokümanlar
2. QUALITY.md
3. ILKELER.md — proje ilkeleri (yaklaşım seçimini yönlendirir)
4. Aktif faz dokümanı — özellikle "Kapsam Tartışması" bölümü
5. Fazın kapsadığı modül dokümanları (modules/)
6. İlgili docs/ dokümanları
7. Göreve göre: PHASES.md (gerekirse)

### SENARYO: Faz Planlama (Plan Phase)
1. Temel dokümanlar
2. MODULE-MAP.md
3. Aktif faz dokümanı — "Kapsam Tartışması" ve "Araştırma Bulguları"
4. Fazın kapsadığı modül dokümanları (modules/)
5. QUALITY.md
6. ILKELER.md — proje ilkeleri (task kapsamı ve kriterlerini yönlendirir)
7. tasks/TASKS-README.md — task format kuralları
8. `.claude/commands/devflow/templates/TASK.md` — task template

### SENARYO: Faz Review
1. Temel dokümanlar
2. MODULE-MAP.md
3. Aktif faz dokümanı (tüm bölümler)
4. QUALITY.md
5. PHASES.md — faz durum tablosu (faz tamamlamayı işaretle, geçiş notu yaz)
6. Bu fazdaki tüm task dokümanları (archive dahil)
7. Kaynak kodu inceleme

### SENARYO: Hata Düzeltme / Bilgi Sorgulama
1. Temel dokümanlar
2. İlgili modül ve docs/ dokümanları

### SENARYO: Quick Mode (Ad-hoc Task)
1. Temel dokümanlar
2. İlgili modül ve docs/ dokümanları (işe göre)
3. `tasks/quick/` — mevcut quick task kayıtları (gerekirse)

### SENARYO: Metin, chat cevabı veya meta değişikliği (projeye özgü)
1. Temel dokümanlar
2. `docs/CLAIMS.md` — sınır
3. `modules/M1-Icerik-ve-Iddia-Kaynagi.md` — tek kaynak sabitleri ve ton
4. Değişiklik sonrası: `a11y.mjs`, `font-guard.mjs`, `scan.mjs` (CLAUDE.md → Ölçüm betikleri)

### SENARYO: Yeni bölüm / sayfa tasarımı (projeye özgü)
1. Temel dokümanlar
2. `docs/STYLE-GUIDE.md` — tokenlar, tuzaklar, kullanıcının refleksleri
3. `modules/M2-Sayfalar-ve-Bolumler.md`, görsel gerekiyorsa `modules/M5-Gorsel-Varlik-Hatti.md`
4. Değişiklik sonrası: beş ölçüm (CLAUDE.md → Ölçüm betikleri)

---

## Doküman Hiyerarşisi

```
proje-repo/
├── CLAUDE.md ⭐ (repo kökünde — her oturum otomatik okunur)
├── README.md                # yığın, çalıştırma, görsel hattı (TECH-STACK yerine)
│
└── _dev/
    ├── OVERVIEW.md ⭐
    ├── ILKELER.md            # proje ilkeleri (karar fazlarında okunur)
    ├── INDEX.md ⭐
    ├── DURUM.md ⭐
    ├── MEMORY.md ⭐           # proje hafızası index'i
    ├── GIT-STRATEJI.md ⭐     # kickoff-verify'da doğar
    ├── memory/               # öğrenim dosyaları (ilk öğrenimde oluşur, lazy-load)
    ├── BULGULAR.md           # proje sorun kanvası index'i
    ├── bulgular/             # bulgu atomları + archive/
    ├── MODULE-MAP.md
    ├── PHASES.md
    ├── QUALITY.md
    │
    ├── modules/
    │   ├── M1-Icerik-ve-Iddia-Kaynagi.md
    │   ├── M2-Sayfalar-ve-Bolumler.md
    │   ├── M3-Lead-Hatti.md
    │   ├── M4-Site-Asistani.md
    │   ├── M5-Gorsel-Varlik-Hatti.md
    │   ├── M6-Kalite-Kapilari.md
    │   └── M7-Yayin-ve-Altyapi.md
    │
    ├── phases/
    │   └── PHASE-N.md        # discuss-phase'de oluşur
    │
    ├── tasks/
    │   ├── TASKS-README.md
    │   ├── TASK-X.YY.md (aktif)
    │   ├── quick/ (ad-hoc task'lar)
    │   └── archive/ (tamamlanan)
    │
    └── docs/
        ├── CLAIMS.md
        ├── STYLE-GUIDE.md
        └── DECISIONS.md
```

---

## Hızlı Erişim

**DevFlow Dokümanları:** `_dev/`
**Kaynak Kod:** `src/` (`app/` rotalar, `components/` ui·layout·sections, `content/` tek kaynak)
**Çalışan Uygulama:** `http://localhost:3000` (dev) · `http://localhost:3100` (üretim imajı)

---

**Son Güncelleme:** 2026-09-11 — kickoff-docs: 7 modül dokümanı, CLAIMS, STYLE-GUIDE, DECISIONS, BULGULAR ve iki projeye özgü senaryo eklendi.

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->
<!-- KURAL: Tamamlanmış fazların task arşiv listesini INDEX'e ekleme — `ls _dev/tasks/archive/` zaten görür. INDEX yalnızca aktif klasör konumlarını gösterir; statik liste dokümanı değildir. -->
