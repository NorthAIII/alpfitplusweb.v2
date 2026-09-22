# TASK-2.02: `.env` üretim imajından çıkar, yerel prova hedefini açıkça söyler (B-058)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.1: Docker çalışma ortamı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok (TASK-2.01'den bağımsız — bu ayak **koşulsuz** yapılır)

---

## Hedef

Üretim Docker imajının katmanında duran `.env` dosyasını çıkarmak ve `web-prod` konteynerinin neye bağlandığını **bilinçli** hâle getirmek. Bugün `.dockerignore:6` yalnız `.env*.local` yazıyor; bu kalıp `.env`'i eşlemiyor, `Dockerfile:27` `COPY . .` ile builder'a alıyor ve `:35` runner katmanına taşıyor.

Task, üretim imajında `/app/.env` **bulunmadığında** ve `docker-compose.yml`'de `web-prod`'un env'i açıkça yazıldığında (hedef yoksa uç dürüst `503` verdiğinde) tamamlanmış sayılır.

---

## Bağlam

Bulgu iki ayrı zarar ölçtü (`_dev/bulgular/B-058-env-uretim-imajina-gomulu.md`):

1. **Sır taşınabilir hâle geliyor** — `docker save` / `docker history` / registry push beş değeri imajla birlikte taşır. Bugün CI yok, registry yok, imaj bu makineden çıkmadı; risk **potansiyel**.
2. **Yerel üretim provası (3100) sessizce bir hedefe bağlı** — compose'da `web-prod` için `environment`/`env_file` olmamasına rağmen konteyner imajdan gelen `.env`'i okuyor ve `POST /api/demo` `{"ok":true,"stored":true}` dönüyor. Bugün hedef yerel `lead-store`; ama `.env`'in hedefi bir gün canlıya çevrilirse **her prova isteği canlı depoya yazar** ve bunu söyleyen hiçbir işaret yok. Ölçüm turları 3100'ü rutin hedef alıyor (`perf.mjs`, `font-guard.mjs`).

**Anahtar döndürme ayağı düştü ve B-058'in kalan tek işi bu task oldu** (plan revizyonu, 2026-09-23). TASK-2.01 sunucudaki `/opt/alpfit-lead/.env` ile yereldeki değerleri parmak iziyle karşılaştırdı: **eşleşme yok** — imaja giren hiçbir değer canlı bir sır değil, dolayısıyla döndürme gerekmiyor ve TASK-2.03 ❌ iptal edildi (`tasks/archive/TASK-2.03.md`). Buradaki iki düzeltme zaten koşulsuzdu; artık **atomu da bu task kapatıyor**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-058-env-uretim-imajina-gomulu.md` — kanıt ve koruma önerisi
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — **ölçüm tuzağı**: `docker compose exec … printenv` çalışan uygulamanın env'ini göstermez; hedefi tek `{}` POST'unun `503 no-sink` verip vermediğiyle ölç
- `_dev/memory/yerel-lead-deposu-docker-profili.md` — `lead-store` profili, `down` yasağı
- `Dockerfile`, `.dockerignore`, `docker-compose.yml`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.1 Edge Case'ler — `web-prod`'un env'i artık bilinçli (tek satır)
- `_dev/BULGULAR.md` + `_dev/bulgular/B-058-*.md` — **atom bu task'ta kapanır**. Kapanış kaydı üç şeyi birlikte yazar: iki düzeltme yapıldı · döndürme ayağı ölçümle düştü (TASK-2.01, eşleşme yok) · kalıcı kapı (her derlemeden sonra `ls /app/.env`) **M6 F6.2 tek komutuna devredildi**, bu fazda kurulmadı

---

## Alt Görevler

- [ ] **1. `.dockerignore`'u projenin sır politikasına göre düzelt**
  - `.env` ve `.env.*` eklenir, `!.env.example` istisnasıyla (örnek dosya repoda kalmalı ve imaja girmesi zararsızdır — değer taşımıyor)
  - Mevcut `.env*.local` satırı yeni kalıpların altında gereksizleşir; tekrarı bırakma
  - Dosya: `.dockerignore`

- [ ] **2. `web-prod`'a bilinçli env ver**
  - `docker-compose.yml` → `web-prod` bloğuna açık `environment:` (ya da `env_file:`) eklenir; **ne verildiği yorumla gerekçelenir**
  - Varsayılan tutum: yerel prova **yerel** `lead-store`'u hedefler ya da hiç hedef almaz. Hedef verilmezse uç `503 no-sink` döner — bu **doğru** davranıştır (F3.1 kabul kriteri) ve provanın sessizce bir yere yazmasından üstündür
  - Dosya: `docker-compose.yml`

- [ ] **3. İmajı yeniden derle ve ölç**
  - `docker compose --profile prod up -d --build web-prod`
  - `docker run --rm --entrypoint sh <imaj> -c 'ls -la /app/.env'` → **bulunamadı** dönmeli
  - 3100 ayakta ve sağlıklı; hedef davranışı `{}` POST'uyla ölçülür (yukarıdaki memory tuzağı)

---

## Etkilenen Dosyalar

```
.dockerignore                  # .env ve .env.* + !.env.example — zaten var
docker-compose.yml             # web-prod'a bilinçli environment/env_file — zaten var
_dev/modules/M7-Yayin-ve-Altyapi.md   # F7.1 edge case tek satır — zaten var
```

---

## Dikkat Noktaları

- **`.env` dosyasının kendisine dokunma** — `CLAUDE.md` → Dokunulmazlar. Bu task dosyanın **imaja girmesini** engeller, içeriğini değiştirmez.
- **`printenv` yanıltır.** `docker compose exec web-prod printenv LEAD_STORE_URL` boş dönse de uç `stored:true` verebilir — Next `.env`'i `/app`'ten kendi dotenv'iyle okur. Ölçümü **uç davranışıyla** yap (`memory/alternatif-env-ile-uretim-derlemesi.md`).
- **3100 bayat olabilir.** Aynı memory notu: `perf.mjs`/`font-guard.mjs` oraya bakar; bu task zaten yeniden derliyor, ama ölçmeden güvenme.
- **`lead-store` profili ayrı kalkar** (`--profile lead`) ve host portu yayınlamaz; `web-prod`'a hedef verilecekse adres compose ağı içinden (`http://lead-store:8090`) yazılır.
- **Kalıcı kapı bu fazda kurulmuyor.** Atomun koruma önerisindeki *"derleme sonrası tek komut"* kapısı M6 F6.2'nin (tek komut) işidir; burada aynı komut **bir kerelik** ölçüm olarak koşar ve sonucu dokümana yazılır. Kapanış kaydı bu devri açıkça söyler, yoksa atom kapanırken kapı sessizce kaybolur.
- **Dev tarafı (`web`, 3000) bu task'ın konusu değil** — bind-mount üzerinden `.env`'i okuması beklenen davranıştır.

---

## Test Kriterleri

- [ ] `docker run --rm --entrypoint sh <üretim imajı> -c 'ls -la /app/.env'` → dosya **yok** (çıkış kodu sıfır-olmayan ya da "No such file")
- [ ] Aynı imajda `.env.example` varlığı sorun değil; başka hiçbir `.env*` dosyası yok (`ls -la /app/.env*` çıktısı dokümana yazılır)
- [ ] `docker compose --profile prod up -d --build web-prod` sonrası 3100 ayakta; ana sayfa 200 dönüyor
- [ ] `POST http://localhost:3100/api/demo` ile hedef davranışı ölçüldü ve **compose'da yazana eşit**: hedef verildiyse `stored:true`, verilmediyse `503 no-sink` (rakamıyla dokümana yazılır)
- [ ] `docker compose exec web npm test` yeşil (taban: 6 dosya, Faz 1 kapanışındaki sayı); `npm run build` hatasız
- [ ] `git status` çıktısında `.env` yok — dosya hâlâ izlenmiyor

---

## Risk ve Geri Dönüş Planı

- **`web-prod` env'siz kalırsa ölçüm betikleri kırılabilir:** `perf.mjs` ve `font-guard.mjs` yalnız sayfa render'ına bakıyor, lead hedefine değil — beklenen etki yok; yine de ikisi bu task'ta koşulup teyit edilir.
- **Rollback:** iki satırlık değişiklik, dosya bazlı geri alma yeterli; imaj yeniden derlenir.

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
