# TASK-2.21: Onay e-postası yalnızca doğrulanabilir bir alıcıya gider (UAT senaryo 26)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.07 ✅ (onay e-postasını açan task — bu, onun açtığı yüzeyin daraltılmasıdır)

---

## Hedef

Demo talep ucunun, **talebi gönderenin sahibi olduğu gösterilmemiş** bir adrese onay e-postası göndermesini sınırlamak. Bugün uç, istek gövdesinde yazan her biçimsel geçerli adrese, doğrulanmış `alpfitplus.com` göndericisinden bir e-posta yolluyor ve selamlama satırında istek sahibinin 120 karakterine kadar metnini taşıyor.

Task, seçilen sınırlama uygulandığında ve bir kötüye kullanım sondası (üçüncü bir adrese art arda onay e-postası tetiklemek) **ölçülerek** engellendiğinde ya da kabul edilebilir bir tavana indirildiğinde tamamlanmış sayılır.

---

## Bağlam

**Bulgunun kaynağı:** `verify-phase` Adım 1c güvenlik taraması + UAT senaryo 26 (2026-09-23). Faz penceresi diff'inde (`e31331f..HEAD`) doğdu — TASK-2.07 `toLeadEmail()`'i ekledi ve ziyaretçiye onay kanalı açtı. Tasarım v1 ile paritedir; **bulgu kanalın kendisi değil, alıcının doğrulanmamış olmasıdır.**

**Ölçülen kapı zinciri** (2026-09-23, yerel üretim imajına karşı):

| Kapı | Durumu |
|---|---|
| Hız sınırı | **Var** — IP başına 10 dk / 5 istek; 6. istek `429` (ölçüldü) |
| Bal küpü | **Var** — dolu gelirse `200`, hiçbir yere yazılmaz (ölçüldü) |
| Onay kutusu | **Var** — `consent !== true` → `422` (ölçüldü) |
| Adresin sahipliği | **YOK** — `isValidEmail()` yalnız `yerel@alan.uzanti` biçimine bakar |

**Pratik karşılığı:** bir kötü niyetli kullanıcı, kendi IP'sinden on dakikada beş kez, başkasının adresine, bizim doğrulanmış alan adımızdan gelen bir e-posta tetikleyebilir; selamlamada okuduğu metni kendisi yazar (`Merhaba <120 karakter>,`). Gövdenin geri kalanı sabittir ve düz metindir — enjeksiyon yüzeyi yok, kontrol karakterleri `cleanLine` ile ayıklanıyor. Zarar **içerik** değil, **gönderici itibarı** ve istenmeyen postadır.

⚠️ **Bu bir kayıp/sızıntı bulgusu değildir.** Lead hattı, kayıt, `notify_lead` ve dönüşüm yolu doğru çalışıyor (UAT 23-25 ✅). Kapsam yalnız alıcı doğrulamasıdır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-2-UAT.md` → senaryo 26 — ölçülen kapı zinciri ve rakamları
- `_dev/modules/M3-Lead-Hatti.md` → F3.1 (bal küpü, hız sınırı) ve F3.3 (onay e-postası kabul kriterleri)
- `src/app/api/demo/route.ts` → `toLeadEmail()`, `leadAddressable`, `limited()`
- `src/lib/contact.ts` → `isValidEmail` (bilinçli olarak gevşek — TASK-1.12 dikkat notu; **sıkılaştırmak bu task'ın çözümü değil**, meşru yazımları eler)
- `_dev/bulgular/B-037-api-demo-sertlestirme-bosluklari.md` — ucun kardeş sertleştirme boşlukları (**kapsam dışı**, ayrı bulgu)
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — senaryo başına ayrı `X-Forwarded-For`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum; `_dev/phases/PHASE-2-UAT.md` — senaryo 26 satırı
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 — seçilen sınırlama kabul kriteri olarak eklenir
- `_dev/docs/DECISIONS.md` — hangi seçenek neden seçildi (geri dönüşü olan bir davranış sözleşmesi doğuruyor)

---

## Alt Görevler

- [ ] **1. Seçeneği kullanıcıyla karara bağla** (→ Karar Noktaları)
  - Üç seçenek aşağıda; ikisi ziyaretçinin akışına dokunmaz, biri dokunur
  - Karar `docs/DECISIONS.md`'ye yazılır

- [ ] **2. Seçilen sınırlamayı uygula**
  - Dosya: `src/app/api/demo/route.ts` (ve seçeneğe göre `src/content/mail.ts`)
  - Ziyaretçinin yanıtı (`200` + gövde alanları) **değişmez** — TASK-2.07'nin sözleşmesi korunur
  - `notify_lead`'in üç değeri korunur; yeni bir değer **icat edilmez** (alan adı geçişinde v1 ile aynı koleksiyon okunacak)

- [ ] **3. Kapıyı sözleşme bataryasına bağla**
  - `tests/api-demo.test.ts`: sınırlamanın devrede olduğu ve **devre dışı kaldığında kırmızı döndüğü** ters çevirmeyle gösterilir
  - Mevcut altı TASK-2.07 senaryosu yeşil kalmalı (regresyon yok)

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts                # alıcı doğrulaması / tavan — zaten var
src/content/
└── mail.ts                 # seçeneğe göre metin — zaten var
tests/
└── api-demo.test.ts        # kapının kendi testi — zaten var
```

---

## Dikkat Noktaları

- **`isValidEmail`'i sıkılaştırmak çözüm değildir.** Gevşekliği bilinçli (TASK-1.12, B-021): amaç açık çöpü elemek, meşru yazımı zorlamamak. Sorun biçim değil **sahiplik**.
- **Dönüşüm yolu daralmamalı** (`ILKELER.md` → 1. eksen). Ziyaretçi talebini gönderdiğinde ekran onayını (TASK-2.05/2.06) aynen görmeli; onay e-postası ikincil kanaldır ve gecikmesi/yokluğu `200`'ü değiştirmez.
- **Ekip bildirimi (`toEmail`) bu task'ın konusu değil** — alıcısı sabit (`DEMO_TO`), kötüye kullanım yüzeyi yok.
- **Hız sınırı sayacı doğrulamadan önce koşar** (B-020, açık bulgu) — tavan seçeneği seçilirse o bulguyla etkileşimi kontrol et, ama **B-020'yi bu task'ta çözme**.
- **Bal küpü dalı e-posta tetiklememeye devam etmeli** (bugünkü davranış; UAT 25 ✅).
- **Kişisel veri:** doğrulama için ek bir alan saklanacaksa (ör. tek kullanımlık jeton) yasal metin **aynı turda** gözden geçirilir — M3 F3.2'nin kalıcı koruma kriteri bunu emrediyor.

---

## Test Kriterleri

- [ ] Sınırlama devredeyken: üçüncü bir adrese art arda onay e-postası tetikleme denemesi **engellenir ya da ölçülen tavana takılır** (rakamıyla dokümana)
- [ ] Meşru akış bozulmadı: geçerli e-postalı gerçek talepte onay e-postası gider ve `notify_lead: "sent"` yazılır
- [ ] Ziyaretçinin yanıtı üç dalda da aynı: `200` + aynı gövde alanları (TASK-2.07 sözleşmesi)
- [ ] Bal küpü dolu istek hâlâ `200`, kayıt yok, e-posta yok
- [ ] **Ters çevirme:** sınırlama devre dışı bırakıldığında ilgili test **kırmızı** döner (kapı kör değil); ters çevirme geri alınır ve ağaç md5 ile doğrulanır
- [ ] `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → taban **211 geçti + 1 atlandı**; yeni ayakla sayı artar, düşmez
- [ ] `docker compose exec web npx tsc --noEmit` çıkış 0 · `docker compose build web-prod` çıkış 0

---

## Karar Noktaları

- **Hangi sınırlama?** → **kullanıcıya sorulacak** (üçü de meşru, bedelleri farklı):
  - **(a) Adres başına tavan** — aynı alıcıya belirli bir pencerede en fazla N onay e-postası. Ziyaretçi akışı hiç değişmez; kötüye kullanım hacmini kırpar, tamamen kapatmaz. En ucuz.
  - **(b) Selamlamadaki serbest metni kaldır** — "Merhaba," ya da kulüp adı yerine sabit hitap. İstek sahibinin yazdığı metin alıcıya hiç ulaşmaz; e-posta yine gider. Kötüye kullanımı **içeriksiz** bırakır.
  - **(c) Onayı ikinci adıma bağla** — e-posta yalnız ziyaretçi bir doğrulama bağlantısına tıklayınca gider. En sağlamı, ama yeni bir durum ve yasal metin gözden geçirmesi getirir; dönüşüm yoluna dokunur.

---

## Risk ve Geri Dönüş Planı

- **(c) seçilirse onay e-postası gecikir** → ziyaretçi ekran onayını yine anında görür; `notify_lead` yeni durumu nasıl taşıyacağı karara bağlanır (v1 paritesi bozulmamalı).
- **Rollback:** tek dosya (`route.ts`); dosya bazlı geri alma yeterli, depo şeması değişmiyor.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- Task çalıştırıldığında doldurulur -->

---

**Oluşturulma:** 2026-09-23 (verify-phase, UAT senaryo 26)
