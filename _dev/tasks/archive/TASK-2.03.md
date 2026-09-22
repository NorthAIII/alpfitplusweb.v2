# TASK-2.03: İki anahtarın döndürülmesi — koşullu (B-058)

**Durum:** ❌ İptal

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.1: Docker çalışma ortamı · M3 F3.2 (depo token'ı)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.01 (ölçüm kararı) · TASK-2.02 (sızıntı yolu kapalı olmalı, yoksa yeni değer aynı yoldan yine imaja girer)

---

## ⚠️ Bu task koşulludur

**TASK-2.01'in parmak izi karşılaştırması eşleşme bulursa koşar** (yereldeki değer canlıdır → döndürme gerekir).

**Eşleşme çıkmazsa** — yani yereldeki token'lar canlı değilse — bu task **❌ İptal** işaretlenir, gerekçesi Oturum Kaydı'na yazılır ve milestone'un "iki anahtar döndürülmüş" ayağı o gün kullanıcıyla yeniden yazılır (kullanıcı kararı, research 2026-09-22 → `docs/DECISIONS.md`). İptal bir eksiklik değil, ölçümün sonucudur.

---

## Hedef

`.env`'in üretim imajı katmanında durduğu süre boyunca **maruz kalmış** iki değeri yenilemek: lead deposunun **önizleme** token'ı ve `IP_HASH_SALT`. Yeni değerler üretilir, tüketicilerin hepsine (sunucudaki depo, Vercel ortamı, yerel `.env`) aynı turda taşınır ve lead hattı uçtan uca yeniden sınanır.

Task, gerçek bir demo talebi yeni anahtarlarla kayda düştüğünde ve eski token'ın artık kabul edilmediği ölçüldüğünde tamamlanmış sayılır.

---

## Bağlam

Döndürme kapsamı discuss'ta iki değerle sınırlandı (kullanıcı kararı):

- **`IP_HASH_SALT`** — v2 için TASK-1.18'de üretilmiş rastgele bir değer; v1'in değeri **değil**. Döndürmenin v1 kayıtlarıyla süreklilik bedeli yok. Tek etkisi: `leads_preview`'daki 15 test kaydının `ip_hash`'i yeni kayıtlarla karşılaştırılamaz olur — **bilinçli kabul** (`docs/DECISIONS.md`, DURUM → Aktif Task notu).
- **Lead deposunun önizleme token'ı** — sunucuda bir işlem; v1'in canlı akışı üretim token'ını kullandığı için etkilenmez.

`LEAD_TOKEN_PRODUCTION` kapsamda **değil** — kapsama girip girmeyeceği TASK-2.01'in Karar Noktası'dır (v1'in canlı akışını etkiler, kullanıcıya sorulur).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/TASK-2.01.md` → Oturum Kaydı — karşılaştırma sonucu ve kapsam kararı
- `_dev/memory/anahtar-kasasi-config-alpfit.md` — yönetim anahtarlarının evi; değer hiçbir yere yazılmaz
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — depo sunucusuna erişim
- `_dev/memory/vercel-proje-kimlikleri.md` — Vercel env girişi; **`vercel inspect` commit SHA basmaz**, dağıtım↔commit bağı davranışla kurulur
- `_dev/tasks/archive/TASK-1.18.md` — canlı env girişinin boru-içinden deseni (değer kaydedilmez)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/docs/DECISIONS.md` — döndürme yapıldı; `leads_preview` kayıtlarının `ip_hash` süreksizliği kayda geçer

---

## Alt Görevler

- [ ] **1. Yeni değerleri üret**
  - `openssl rand -hex 32` ile iki değer; üretim **boru içinde** kalır, terminale basılmaz, hiçbir dokümana yazılmaz
  - Parmak izi (SHA-256 öneki) alınır — sonraki adımların doğrulaması bununla yapılır

- [ ] **2. Sunucudaki depoya yeni önizleme token'ını tanıt**
  - Depo `../Alpfitplus-website.v1` reposunda ve **dokunulmaz**; işlem sunucudaki konfigürasyon tarafındadır
  - Eski token'ın artık `201` üretmediği ölçülür (yeni token `201`, eski token reddediliyor)

- [ ] **3. Tüketicileri aynı turda güncelle**
  - Vercel ortamı (önizleme/üretim ayrımına dikkat — `memory/vercel-proje-kimlikleri.md`)
  - Yerel `.env` (dosyanın kendisi dokunulmaz sayılır ama **değer taşıyıcısıdır**; güncelleme kullanıcı onayıyla ve değer basılmadan yapılır)
  - Yeni dağıtımın gerçekten yeni değeri taşıdığı **davranışla** doğrulanır, "son dağıtım Ready" yazısıyla değil

- [ ] **4. Lead hattını uçtan uca yeniden sına**
  - Önizleme adresinden gerçek bir demo talebi → depoda görünür, `ip_hash` yeni tuzla hesaplanmış
  - Eski tuzla üretilmiş bir `ip_hash`'in yeni kayıtlarla eşleşmediği ölçülür (beklenen süreksizlik, kanıtıyla)

---

## Etkilenen Dosyalar

```
(repo dosyası değişmez)
.env                    # yerel değerler — dokunulmaz dosya, değer güncellemesi kullanıcı onayıyla
_dev/docs/DECISIONS.md  # döndürme kaydı + ip_hash süreksizliği — zaten var
```

Sunucu ve Vercel tarafı repo dışıdır; komutlar ve sonuçları Oturum Kaydı'na yazılır.

---

## Dikkat Noktaları

- **Hiçbir değer hiçbir yere yazılmaz** — ne dokümana, ne commit'e, ne komut geçmişine. Doğrulama yalnız parmak iziyle.
- **Sıra önemlidir:** önce depo yeni token'ı kabul etmeli, sonra tüketiciler geçmeli. Ters sıra lead hattını kırar ve **gerçek talep kaybına** yol açar (`ILKELER.md` → "Gelen talep kaybolmaz").
- **`leads_preview`'daki 15 kaydın `ip_hash` bağı kopar** — bilinçli, kayıtlı. Bunu bir hata sanıp geri dönme.
- **TASK-2.02 önce bitmeli.** `.dockerignore` düzeltilmeden döndürülen değer aynı yoldan yine imaja girer; döndürme anlamsızlaşır.
- **v1'in canlı akışına dokunma.** Üretim token'ı kapsamda değil; kapsama alınacaksa kullanıcı kararı gerekir (TASK-2.01 Karar Noktası).
- **Dağıtım↔commit bağı zaman eşlemesiyle kurulmaz** — ayırt edici bir davranışla ölç (`memory/vercel-proje-kimlikleri.md`).

---

## Test Kriterleri

- [ ] Yeni önizleme token'ıyla depoya yazma `201` dönüyor; **eski token reddediliyor** (durum kodu dokümanda)
- [ ] Önizleme adresinden gönderilen gerçek bir demo talebi depoda görünüyor (kayıt kimliğiyle)
- [ ] Yeni kaydın `ip_hash`'i eski tuzla hesaplanandan **farklı** (beklenen süreksizlik, parmak iziyle gösterilir)
- [ ] `docker compose exec web npm test` yeşil; depo sözleşme paketi (`LEAD_CONTRACT_URL` tanımlıyken) yerel depoya karşı geçiyor
- [ ] `git diff` ve commit içeriğinde hiçbir 64-hex değer yok
- [ ] Üretim imajında `/app/.env` hâlâ yok (TASK-2.02 regresyonu yok)

---

## Risk ve Geri Dönüş Planı

- **Tüketicilerden biri atlanırsa lead hattı düşer** → uç `503` verir ve form WhatsApp yolunu gösterir (talep kaybolmaz, ama dönüşüm düşer). Alt Görev 4 bunu aynı oturumda yakalar.
- **Rollback:** eski token sunucuda geçici olarak yeniden kabul edilebilir hâle getirilir ve tüketiciler geri alınır; rollback yapılırsa döndürme **yapılmamış** sayılır ve milestone ayağı açık kalır.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Plan revizyonu — 2026-09-23

**Durum:** ❌ İptal — ön koşul ölçümle düştü; task hiç çalıştırılmadı, kod yazılmadı.

TASK-2.01'in parmak izi karşılaştırması (2026-09-22) sunucudaki `/opt/alpfit-lead/.env` ile yereldeki `.env` arasında **eşleşme bulmadı**: `LEAD_TOKEN_PREVIEW` ve `LEAD_TOKEN_PRODUCTION`'ın ikisi de canlı değerden farklı. Ölçülen dosyanın canlı kaynak olduğu, çalışan `alpfit-pocketbase` konteynerinin env'iyle ayrıca doğrulandı; yöntem iki kontrol grubuyla sınandı (çapraz makine + makine içi eşitlik), yani "eşleşmedi" sahte bir kırmızı değil.

Dolayısıyla **döndürülecek canlı anahtar yok** — bu task'ın varlık sebebi düştü. Sızmamış bir anahtarı döndürmek koruma değil, sunucuda bedeli olan bir işlem olurdu. `IP_HASH_SALT` de kapsamda değil: TASK-1.18 canlı tuzun boru içinde kalıp hiçbir yere kaydedilmediğini yazıyor, karşılaştırılacak kaynak yok.

**Kalan iş nereye gitti:** B-058'in koşulsuz ayağı (`.dockerignore` düzeltmesi ve `web-prod`'a bilinçli env) **TASK-2.02**'dedir; atom orada kapanır ve kapanış kaydı bu ölçümü anar. Milestone'un *"iki anahtar döndürülmüş"* ayağı, ölçümü de içerecek şekilde yeniden yazıldı (kullanıcı kararı, 2026-09-23). Ölçümün tamamı `tasks/archive/TASK-2.01.md`, kararlar `docs/DECISIONS.md` 2026-09-22.

**İptal bir eksiklik değil, ölçümün sonucudur** — bu task tam da bu ihtimal için koşullu yazılmıştı.

---

## Sonuç Özeti

**İptal Tarihi:** 2026-09-23 — kod yazılmadı; sunucuda, Vercel'de ve yerel `.env`'de hiçbir değer değişmedi.

---

**Oluşturulma:** 2026-09-22
