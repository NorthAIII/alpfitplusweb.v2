# TASK-2.19: Yasal beyan testi — "12 ay" dalı komşu depodan okunur (B-060)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M6 — Kalite Kapıları
**Feature:** F1.1 (yasal içerik) · M3 F3.2 (saklama süresi depo tarafında)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.18 (test dosyası kurulu olmalı — bu task ona sekizinci dalı ekler)

---

## Hedef

Yayındaki **"12 ay" saklama** beyanını, mekanizmanın gerçekten yaşadığı yere — komşu depodaki `RETENTION_MONTHS` sabitine — bağlamak. `web` konteyneri bugün o yolu **görmüyor** (ölçüldü: `/app/../Alpfitplus-website.v1` yok).

Task, salt-okunur bağlama ve env kapısı kurulduğunda, dal anahtar tanımlıyken koştuğunda ve **anahtar tanımsızken atlandığında** (testin geri kalanı etkilenmeden) tamamlanmış sayılır.

---

## Bağlam

**Ölçülmüş kısıt** (research 2026-09-22): "12 ay"ın mekanizması `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` → `RETENTION_MONTHS = 12`; temizlik işi `retention.pb.js:30` günlük koşuyor. v1'in kendi testi bu dosyayı göreli yolla okuyabiliyordu çünkü orada **aynı depodaydı**; v2'de değil.

**Seçilen (b): salt-okunur bağlama + env kapısı.** `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:ro` bağlanır; test dalı bir env anahtarıyla açılır, anahtar tanımsızsa **atlanır**. Bu, depo sözleşme paketinin (`tests/lead-store.contract.test.ts`, TASK-1.13) zaten kurduğu desendir.

**Reddedilenler:** (a) sabiti v2'ye kopyalamak — bulgunun şikâyet ettiği tekrarın ta kendisi; (c) yerel depo konteynerinin API'sinden okumak — `npm test`'i ayakta bir servise bağlar.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-060-yasal-beyani-koruyan-kapi-yok.md` — "12 ay" satırı ve v1 şablonu
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #4
- `tests/lead-store.contract.test.ts` — **env kapısı deseninin örneği**; dosyanın başlık yorumu tam koşum komutunu taşıyor
- `docker-compose.yml` → `web` servisi bağlamaları · `.env.example`
- `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` ve `retention.pb.js:30` (salt okunur)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-060-*.md` — **atom bu task'ta kapanır** (sekiz olgunun sekizi bağlandı)
- `README.md` (repo kökü) — dalın nasıl koşturulacağı, bağlama gerekliliği (sözleşme paketinin yanına)

---

## Alt Görevler

- [ ] **1. Salt-okunur bağlama**
  - `docker-compose.yml` → `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:<hedef>:ro`
  - Komşu depo **dokunulmazdır**; bağlama `:ro` olmadan yazılmaz
  - Bağlama yoksa konteyner yine kalkmalı (compose bağlamayı zorunlu kılıyorsa yol ele alınır — kaynak dizin bu makinede var)

- [ ] **2. Env kapısı ve dal**
  - `.env.example`'a **slot adı** eklenir (değer yazılmaz) — `CLAUDE.md` → Dokunulmazlar
  - Test dalı: anahtar tanımsızsa `skip`; tanımlıysa `lead_lib.js` **metin olarak** okunur, `RETENTION_MONTHS` bulunur ve `legal.ts`'in "12 ay" beyanıyla eşleşir
  - Sabit bulunamazsa test **kırılır** (sessiz geçme yok) — TASK-2.18'in kuralıyla aynı

- [ ] **3. İki hâli de sına**
  - Anahtar tanımlı: dal koşuyor ve yeşil
  - Anahtar tanımsız: dal atlanıyor, `npm test`'in geri kalanı **etkilenmiyor** (sözleşme paketinin bugünkü davranışıyla aynı)

---

## Etkilenen Dosyalar

```
docker-compose.yml                 # web servisine :ro bağlama — zaten var
.env.example                       # yeni slot adı (değer yok) — zaten var
tests/
└── legal-consistency.test.ts      # sekizinci dal — zaten var (TASK-2.18'de doğdu)
README.md                          # koşum notu — zaten var
```

---

## Dikkat Noktaları

- **Komşu depo salt okunurdur** (`CLAUDE.md` → Dokunulmazlar). Bağlama `:ro`, test yalnız okur.
- **Anahtar tanımsızken `npm test` etkilenmemeli** — bu, sözleşme paketinin kurduğu sözleşmedir ve CI'ya girdiğinde (M6 F6.3) komşu depo orada olmayacağı için **şarttır**.
- **`import` değil, metin okuma.** v2 `lead_lib.js`'i import edemez (farklı çalışma zamanı — PocketBase hook'u); v1 de metin okuyarak çözmüş.
- **Bağlama eklemek `web` konteynerini yeniden kurmayı gerektirir** — yeni rota eklemenin `restart` gerektirmesiyle aynı sınıf tuzak; `up -d` ile gelir, `restart` ile gelmez.
- **`.env`'e değer yazma kararı kullanıcınındır** — task yalnız slot adını ve koşum komutunu belgeler.
- Dal adı ve anahtar adı sözleşme paketinin adlandırmasıyla **tutarlı** olsun (`LEAD_CONTRACT_URL` deseni) — iki kapı iki farklı sözlük kurmasın.

---

## Test Kriterleri

- [ ] `docker compose up -d web` sonrası `pb_hooks` dizini konteyner içinden **okunabiliyor** ve salt okunur (yazma denemesi reddediliyor)
- [ ] Anahtar tanımlıyken: dal koşuyor, `RETENTION_MONTHS = 12` ile `legal.ts`'in beyanı eşleşiyor, test yeşil
- [ ] **Negatif kontrol:** sabit geçici olarak farklı bir değere çekildiğinde (kopya üzerinde) dal **kırmızı** dönüyor; sabit hiç bulunamadığında da kırılıyor (sessiz geçme yok)
- [ ] Anahtar tanımsızken: dal atlanıyor ve `docker compose exec web npm test` geri kalanı yeşil (PASS/skip sayıları dokümana)
- [ ] `.env.example` yalnız slot adını taşıyor, değer yok
- [ ] `README.md` dalın nasıl koşturulacağını yazıyor (sözleşme paketinin yanında, aynı desende)
- [ ] `npm run build` hatasız

---

## Risk ve Geri Dönüş Planı

- **Bağlama yolu başka makinede yoksa** compose kalkmayabilir → yol opsiyonel hâle getirilir ya da profile alınır; çözüm task oturumunda ölçülerek seçilir.
- **Rollback:** compose satırı ve test dalı geri alınır; TASK-2.18'in yedi dalı etkilenmez.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- run-task dolduracak -->

---

## Sonuç Özeti

<!-- Task tamamlanınca doldurulacak -->

---

**Oluşturulma:** 2026-09-22
