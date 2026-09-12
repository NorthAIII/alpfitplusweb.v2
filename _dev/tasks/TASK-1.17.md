# TASK-1.17: Yerel prova ortamı — alıcı için n8n + Postgres (Bunker şeması)

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · hizmet ettiği yüzey M3
**Feature:** F3.2 provası — yerel ortam (M7 F7.1 Docker ortamının genişlemesi; feature matrisi değişmez)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.11 ✅ (giriş yolu, canlı sürümler, şema kaynağı, asgari tohum)

---

## Hedef

Demo talebi alıcısının canlıya çıkmadan önce kurulup sınanabileceği bir yerel ortam kurmak. `docker-compose.yml`'a ayrı bir profil eklenir; servisler canlıdaki sürümlerle aynı imaj etiketinden kalkar, Bunker şeması ve `alpfit` kiracısı asgari tohumla yüklenir.

Task, profil tek komutla ayağa kalkıp sağlıklı olduğunda, üç otomasyonun seçim sorguları yerel veritabanında çalıştığında ve varsayılan `web` servisi etkilenmediğinde tamamlanmış sayılır.

---

## Bağlam

2026-09-13'te önce "canlı sistemlerde çalışılır, yerel n8n kopyası kurulmaz" kararı verildi. Aynı gün kullanıcı bunu değiştirdi: alıcı önce **yerel kopyada** kurulup sınanır, sonra canlıya taşınır (`docs/DECISIONS.md` 2026-09-13 "Alıcı provası"). Sunucu kuralının "önce test" ilkesi böylece sunucuya dokunmadan karşılanır.

Hangi servislerin gerektiği TASK-1.11'in seçtiği yola bağlıdır:

- **n8n iş akışı yolu:** n8n + Postgres (Bunker şeması). Bu dokümanın varsayılan tarifi budur.
- **Bunker giriş ucu yolu:** Postgres + Bunker uygulaması yerelde. Uygulamanın nasıl koşacağını TASK-1.11 yazar; bu task o tarifi uygular.

**Yerel prova neyi kanıtlamaz:** canlı otomasyonların **çalışma zamanı** davranışını (tick'ler yerelde koşmaz), gerçek ağı ve TLS'i. Yerelde kanıtlanan sözleşme ve seçim sorgusu düzeyidir. Canlı kanıt TASK-1.18'dedir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — seçilen yol, canlıdaki n8n/Postgres sürümleri, şema kaynağı, otomasyon seçim sorguları
- `docker-compose.yml` — mevcut servisler ve profil deseni (`prod`, `research`)
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — sır kuralı
- `../bunker-dashboard` — şema kaynağı (migration dosyaları; **salt okunur**)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/memory/` — yerel prova ortamının ayağa kaldırma/indirme komutları ve tuzakları (yeni kayıt + MEMORY.md index'i)
- `CLAUDE.md` → Projeye Özgü Kurallar → "Çalışma ortamı — Docker" bloğuna profil komutu — kök doktrin dosyası; kullanıcıya bildirilir

---

## Alt Görevler

- [ ] **1. Compose profilini ekle**
  - Profil adı önerisi `lead`; servisler varsayılan `up`'ta **kalkmaz**
  - Postgres: canlıyla aynı ana sürüm, isimli hacim, host'a **yayınlanmaz** (compose ağı içi)
  - n8n: canlıyla aynı imaj etiketi, yerel Postgres'e bağlı; arayüz gerekiyorsa yalnız `127.0.0.1`'e yayınlanır. Port 3001 kullanılmaz, 3000/3100/3200 çakışmaz
  - Kimlik değerleri env'den (`.env`, gitignore'lu); anahtar adları `.env.example`'a girer, değer girmez
  - Dosyalar: `docker-compose.yml`, `.env.example`

- [ ] **2. Şemayı ve asgari tohumu yükle**
  - Bunker şeması TASK-1.11'in gösterdiği kaynaktan (migration dosyaları ya da salt okunur şema dökümü) uygulanır. `../bunker-dashboard` salt okunur bağlanır, içine yazılmaz
  - Asgari tohum: `alpfit` kiracısı ve üç otomasyonun seçim sorgularını koşturmaya yetecek kayıtlar. **Gerçek kişi verisi yok**; canlı veritabanından veri kopyalanmaz
  - Dosya: `research/lead-lab/seed.sql` (YENİ; konum TASK-1.11'in alıcı versiyonlama kararıyla birlikte teyit edilir)

- [ ] **3. Web'den erişimi doğrula**
  - `web` konteyneri alıcıya compose ağı üzerinden ulaşabiliyor (ör. `http://n8n:5678/`). TASK-1.14'ün yerel uçtan uca turu buna dayanır

---

## Etkilenen Dosyalar

```
./
├── docker-compose.yml    # lead profili: postgres + n8n — zaten var
└── .env.example          # yerel prova anahtar adları — zaten var
research/lead-lab/
└── seed.sql              # YENİ — alpfit kiracısı + seçim sorguları için asgari tohum
```

---

## Dikkat Noktaları

- **Sürüm eşitliği:** imaj etiketleri canlıyla aynı olmazsa yerel yeşil canlıda anlamsızdır. Etiketler TASK-1.11'in okuduğu değerlerden yazılır, `latest` kullanılmaz.
- **Şema kayması:** Bunker şeması canlıda migration'lardan farklıysa (elle yapılmış değişiklik) yerel kopya yanlış güven verir. TASK-1.11'in salt okunur şema karşılaştırması esas alınır; fark varsa Oturum Kaydı'na.
- **n8n lisansı:** n8n "Sustainable Use License" ile ücretsiz self-host edilir (iç kullanım). Postgres ücretsiz. Yeni ücretli bileşen yok.
- **`.env.example` çakışması:** bu dosyada TASK-1.07'nin Umami bloğu commit'lenmiş olmalı. Değilse dosya bazlı commit yabancı işi süpürür — dur ve sor.
- **`down` kullanılmaz:** `docker compose down` profil verilse de projenin **tüm** servislerini (`web` dâhil) kaldırır; `-v` ise compose dosyasındaki isimli hacimleri, yani `node_modules` ve `next_cache`'i de siler. Prova ortamı yalnız servis adıyla indirilir (`docker compose rm -sf <prova servisleri>`), prova hacmi adıyla silinir (`docker volume rm <proje>_<hacim>`).
- Umami'nin yerel kopyası **kurulmaz**: analitik canlı kurulumda `data-tag=local` ile ayrılıyor (TASK-1.07), prova gereği yok.

---

## Test Kriterleri

- [ ] `docker compose --profile lead up -d` → Postgres ve n8n sağlıklı (n8n `/healthz` 200, `pg_isready` başarılı)
- [ ] Yerel veritabanında Bunker tabloları var ve `alpfit` kiracısı tohumlu; üç otomasyonun seçim sorguları (TASK-1.11) yerelde hatasız çalışıyor
- [ ] `web` konteynerinden alıcı servisine compose ağı üzerinden istek ulaşıyor
- [ ] Varsayılan `docker compose up -d web` profil servislerini **başlatmıyor**; geliştirme sunucusu 3000'de 200
- [ ] Servis imaj etiketleri canlıdaki sürümlerle aynı (TASK-1.11 kaydıyla karşılaştırma)
- [ ] Prova servisleri adıyla indirildikten (`docker compose rm -sf <prova servisleri>`) sonra `web` hâlâ ayakta ve `node_modules` / `next_cache` hacimleri yerinde (`docker volume ls`)
- [ ] `.env.example`'da yalnız anahtar adları; `docker-compose.yml`'da kimlik değeri yok (`grep` ile)

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-13 (plan revizyonu)
