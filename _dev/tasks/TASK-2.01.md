# TASK-2.01: Sunucudaki iki gerçeği ölç — nginx erişim kaydı ve `.env` parmak izi (B-024, B-058)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · çıktısı M1 yasal metnini de besler
**Feature:** F7.1 (B-058 döndürme kararı) · M1 F1.1 (B-024 ölçüm beyanı)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok — fazın ilk task'ı

---

## Hedef

Fazın iki metin/karar ayağının dayandığı **iki olguyu sunucudan salt-okunur ölçmek**: (1) ölçüm sunucusunun önündeki nginx erişim kaydı bugün ham IP tutuyor mu, rotasyon var mı; (2) bu makinedeki `.env`'in iki token'ı sunucudaki gerçek değerlerle **aynı mı**.

Task, iki ölçümün sonucu rakam/parmak-izi düzeyinde bu dokümana yazıldığında ve ikisinin kararları (yasal metnin ölçüm cümlesi nasıl yazılacak · anahtar döndürülecek mi) net hâle geldiğinde tamamlanmış sayılır. **Hiçbir sır değeri hiçbir yere yazılmaz** — yalnız SHA-256 önekleri karşılaştırılır.

---

## Bağlam

Fazın iki kalemi bilerek bu ölçüme bağlandı (research 2026-09-22, kullanıcı kararı — `phases/PHASE-2.md` → Teknik Kararlar):

- **B-024 / ölçüm beyanı.** `legal.ts:199` *"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"* ve `:116` *"bu ölçüme kişisel verileriniz aktarılmaz"* diyor. Ölçüm betiği kendi sunucumuzdan (`umami.kiwiailab.com`) yüklendiği için her ziyaretçinin ham IP'si önündeki nginx'in erişim kaydına düşüyor — v1 tarafında **2026-07-28**'de ölçüldü: `/dev/stdout` → Docker `json-file`, `/etc/docker/daemon.json` yok, yani rotasyon yok ve log sınırsız büyüyor (o gün 188 MB). **Bugünkü hâli ölçülmedi.** Metin uydurma süre vaadi veremez; ne yazılacağı bu ölçümden çıkar.
- **B-058 / döndürme kapsamı.** `.env`'in beş değeri bu makinede parmak izlendi: `LEAD_STORE_URL` yerel konteyneri gösteriyor, `LEAD_STORE_TOKEN` ile `LEAD_TOKEN_PREVIEW` bayt bayt aynı, `LEAD_TOKEN_PRODUCTION` ayrı bir 64-hex. Arşiv kayıtları ikisinin de bu makinede üretildiğini (TASK-1.17) ve canlı IP tuzunun Vercel'e boru içinden girilip hiçbir yere kaydedilmediğini (TASK-1.18) yazıyor — yani **imaja giren hiçbir değerin canlı olmadığı** sonucuna varıldı. Kesin teyit sunucudaki `/opt/alpfit-lead/.env` ile parmak izi karşılaştırmasıdır. Milestone'un "iki anahtar döndürülmüş" ayağı bu sonuca bağlıdır: **eşleşme yoksa döndürme düşer** ve ayak o gün yeniden yazılır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — sunucuya erişim yolu, salt-okunur kuralları, Umami kurulumu
- `../altyapi/vps/CLAUDE.md` — sunucu deposunun kendi kuralları (salt okunur)
- `_dev/bulgular/B-058-env-uretim-imajina-gomulu.md` — beş değerin bu makinedeki hâli
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` → "🔴 gerekçesi" bloğu — v1'in 2026-07-28 ölçümü
- `_dev/tasks/archive/TASK-1.17.md:146` ve `_dev/tasks/archive/TASK-1.18.md:150,184` — token ve tuz üretiminin kaydı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/docs/DECISIONS.md` — iki ölçümün kararı (ölçüm beyanı nasıl yazılacak · döndürme yapılacak mı)
- `_dev/BULGULAR.md` → Gelen Kutusu — nginx düzeltmesi gerekiyorsa altyapı tarafına tek satır (bu repo değil)

---

## Alt Görevler

- [ ] **1. Ölçüm sunucusunun erişim kaydını ölç (salt okuma)**
  - `umami.kiwiailab.com`'un önündeki nginx'in erişim kaydı bugün nereye yazıyor, ham IP taşıyor mu, dosya/journal boyutu ne, rotasyon (`/etc/docker/daemon.json`, `logrotate`) kurulmuş mu
  - Ölçüm **yalnız okur** — hiçbir dosya, servis ya da konfigürasyon değiştirilmez
  - Sonuç üç soruyu cevaplamalı: ham IP tutuluyor mu · ne kadar süre tutuluyor (rotasyon varsa penceresi) · ziyaretçi verisi başka bir tarafa gidiyor mu

- [ ] **2. `/opt/alpfit-lead/.env` ile parmak izi karşılaştırması**
  - Sunucuda `LEAD_TOKEN_PREVIEW` ve `LEAD_TOKEN_PRODUCTION` değerlerinin **SHA-256 öneki** alınır (tek satır, değer hiçbir zaman basılmaz)
  - Bu makinedeki `.env`'in aynı iki anahtarının önekiyle karşılaştırılır
  - Sonuç: **eşleşiyorsa** yereldeki değer canlıdır → döndürme gerekir (TASK-2.03 koşar); **eşleşmiyorsa** yereldeki değer canlı değildir → döndürme düşer, TASK-2.03 ❌ İptal edilir ve milestone'un o ayağı yeniden yazılır
  - `IP_HASH_SALT` ayrıca ölçülmez: TASK-1.18 canlı tuzun hiçbir yere kaydedilmediğini yazıyor; karşılaştırma yapılacak bir kaynak yok. Döndürme kararı iki token üzerinden verilir

- [ ] **3. Sonuçları kayda geçir**
  - İki ölçümün çıktısı bu dokümanın Oturum Kaydı'na **rakamıyla** yazılır
  - İki karar `docs/DECISIONS.md`'ye girer
  - nginx tarafında düzeltme (rotasyon / IP maskeleme) gerekiyorsa: **bu fazın işi değil** (kapsam dışı, `phases/PHASE-2.md`), `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.01]` işaretli tek satır düşer

---

## Etkilenen Dosyalar

```
_dev/
├── tasks/TASK-2.01.md        # ölçüm sonuçları — YENİ (bu doküman)
├── docs/DECISIONS.md         # iki karar — zaten var
└── BULGULAR.md               # gerekirse Gelen Kutusu satırı — zaten var
```

Kaynak kodda değişiklik yok — bu bir **keşif ayağıdır**.

---

## Dikkat Noktaları

- **Sır değeri hiçbir yere yazılmaz.** Ne task dokümanına, ne commit'e, ne komut geçmişine. Yalnız hash öneki karşılaştırılır (`sha256 | cut -c1-12` deseni). Bu kural `CLAUDE.md` → Dokunulmazlar ve Çalışma Prensibi #12'nin secret maddesidir.
- **Sunucuya yazma yok.** Ölçümün tamamı salt okumadır; `memory/kendi-sunucu-n8n-bunker-umami.md`'deki okuma-modu tuzağı (SQLite `immutable=1` vs `mode=ro`) bu task'ta da geçerli — yanlış mod sunucuya yazar.
- **Ölçüm bir "sonuç" değil "girdi" üretir.** Bu task hiçbir şeyi düzeltmez; iki sonraki task'ın (TASK-2.03 ve TASK-2.17) içeriğini belirler. Düzeltmeye girişme.
- **Eşleşme çıkarsa kapsam büyür:** yereldeki `LEAD_TOKEN_PRODUCTION` canlı token'sa v1'in canlı lead akışı da ilgilenir — o hâlde TASK-2.03 yazılırken v1 tarafının etkisi ayrıca konuşulur (kullanıcıya getirilir).
- **v1'in 2026-07-28 ölçümü bir taban, bugünün cevabı değil** — aradan iki ay geçti, `daemon.json` eklenmiş olabilir. Eski ölçümü kopyalama, yeniden ölç.

---

## Test Kriterleri

- [ ] nginx erişim kaydının bugünkü hâli üç soruya da cevap verecek şekilde ölçüldü (ham IP · saklama penceresi · üçüncü taraf) ve çıktı bu dokümanda **rakamıyla** duruyor
- [ ] İki token'ın sunucu↔yerel parmak izi karşılaştırması yapıldı; sonuç (eşleşti / eşleşmedi) yazılı ve **hiçbir değer görünmüyor**
- [ ] Sunucuda hiçbir dosya değişmedi — ölçüm komutlarının tamamı salt okuma (komutlar dokümanda listeli, doğrulanabilir)
- [ ] İki karar `docs/DECISIONS.md`'ye yazıldı; TASK-2.03'ün koşacağı ya da iptal edileceği net
- [ ] Repo ağacında sır sızıntısı yok: `git diff` çıktısında hiçbir 64-hex değer, token ya da tuz görünmüyor

---

## Karar Noktaları

- **Döndürme kapsamı:** parmak izi eşleşirse `LEAD_TOKEN_PRODUCTION` de kapsama girer mi (v1'in canlı akışını etkiler) → **kullanıcıya sorulacak**, ölçüm sonucuyla birlikte.

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
