# TASK-2.18: Yasal beyan testi — depo içindeki yedi olgu çivilenir (B-060)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M6 — Kalite Kapıları
**Feature:** F1.1 (yasal içerik) · M6 F6.4'ün öncülü
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.16 · TASK-2.17 (metin son hâlini almalı) · TASK-2.13, TASK-2.14 (görsel beyanın dayanağı)

---

## Hedef

Yayındaki yasal beyanların **depo içinden doğrulanabilen** olgularını bir test paketiyle çivilemek. Bugün `tests/` altında 6 dosya var ve hiçbiri `legal.ts`'e dokunmuyor (`grep` → **0 eşleşme**); her beyan tek bir satıra bağlı ve o satır düştüğü gün yayındaki metin **sessizce yalan** olur.

Task, yedi olgunun her biri için bir test dalı yazıldığında, dallar yeşil koştuğunda ve her dalın **sessizce geçmediği** (dayanak bulunamazsa kırıldığı) gösterildiğinde tamamlanmış sayılır. Sekizinci olgu — "12 ay" saklama — komşu depoda ve TASK-2.19'da.

---

## Bağlam

Araştırma sınıfı ölçtü: `legal.ts` satır satır okundu, koda/konfige bağlı **en az sekiz** olgu iddiası var — B-060'ın saydığı üçü + beş tane daha (`phases/PHASE-2.md` → Dikkat Edilecekler). Faz **sekizinin tamamını** bağlar (kullanıcı kararı); milestone'un "dört beyan" ifadesi bu yüzden **alt sınırdır**.

Bu task'ın kapsamı, depo içinden doğrulanabilen yedi olgu:

| # | Beyan | Dayanağının evi |
|---|---|---|
| 1 | "soru işaretinden sonrası ölçüme gitmez" | `src/app/layout.tsx:182` → `data-exclude-search="true"` |
| 2 | "adınız, telefonunuz, e-postanız ve mesajınız ölçüme gönderilmez" | `src/lib/analytics.ts` → `track()` yükü |
| 3 | "gerçek bir kişinin verisi gösterilmemektedir" | `research/lib/screen-cleanup-v2.mjs` temizlik + denetim dalları |
| 4 | "sitenin anahtarı yalnız yeni kayıt oluşturabilir, var olan kayıtları okuyamaz" + "dışarıya açık okuma kuralları kapalı" | `route.ts`'in depo kullanımı (yalnız `POST` + hedefli `PATCH`) |
| 5 | "ölçüm için üçüncü bir tarafa veri göndermiyoruz" | ölçüm ucunun kendi sunucumuz olması (`NEXT_PUBLIC_UMAMI_*`) |
| 6 | "çalışması için gerekli olmayan hiçbir çerez yerleştirmez" | `src/` içinde `cookie`/`localStorage`/`sessionStorage` kullanımının yokluğu |
| 7 | "otuz gün içinde sonuçlandırılır" — başvuru kanalı | `CONTACT.support` tek kaynağı (`site.ts:22`); adresin **posta alması** TASK-2.20'nin işi |

**v1'in şablonu hazır:** `../Alpfitplus-website.v1/tests/server/legal-consistency.spec.ts:36-49` metni kopyalamadan ilişkiyi doğruluyor ve regex kayarsa **sessizce geçmiyor, kırılıyor**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-060-yasal-beyani-koruyan-kapi-yok.md` — tablo, v1 şablonu, ölçüm
- `_dev/phases/PHASE-2.md` → Dikkat Edilecekler → "Üç yasal beyan da taban" (sekiz olgunun dökümü)
- `../Alpfitplus-website.v1/tests/server/legal-consistency.spec.ts` (salt okunur) — şablon
- `tests/api-demo.test.ts`, `tests/analytics.test.ts` — projenin test deseni
- `src/content/legal.ts` (TASK-2.16 ve 2.17 sonrası hâli)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/modules/M1-Icerik-ve-Iddia-Kaynagi.md` → Teknik Notlar — yasal metnin artık test kapısı var
- `_dev/bulgular/B-060-*.md` — yedi dalın Çözüm Kaydı; atom **TASK-2.19'da kapanır**

---

## Alt Görevler

- [ ] **1. Test dosyasını kur**
  - `tests/legal-consistency.test.ts` — yedi olgu, yedi dal
  - Her dal **ilişkiyi** doğrular: metindeki iddia + koddaki dayanak birlikte okunur; metin kopyalanmaz

- [ ] **2. Sessiz geçmeyi engelle**
  - Bir dalın dayanağı (öznitelik, sabit, dosya) bulunamazsa test **kırılır**, "eşleşme yok → geçti" olmaz
  - v1'in dersi bu: regex kayarsa sessizce geçen bir test, test değildir

- [ ] **3. Her dalı negatif kontrolle sına**
  - Dayanak geçici olarak bozulduğunda (ör. `data-exclude-search` kaldırıldığında) ilgili dal **kırmızı** dönüyor
  - Yedi dalın yedisi için tek tek gösterilir; kontroller geri alınır

---

## Etkilenen Dosyalar

```
tests/
└── legal-consistency.test.ts      # YENİ — yedi olgu dalı
```

---

## Dikkat Noktaları

- **Metni kopyalama, ilişkiyi doğrula.** Testin içine yasal metnin tam cümlesini gömmek, metin her düzenlendiğinde testi kırar ve bakımcıyı testi gevşetmeye iter. v1'in yöntemi: dayanağı oku, metinle **eşleştir**.
- **Kapsam depo içidir.** "12 ay" dalı komşu depoya bağlı — TASK-2.19. Burada onu `skip` ile bırakma; o task kendi kapısını kurar.
- **Görsel beyan dalı (3)** TASK-2.13/2.14 sonrası anlamlıdır: temizlik tablosu ve denetim dalları yerindeyken doğrulanır. `web` konteyneri `research/`'ü görüyor (tüm depo bağlı), yani dosya okunabilir.
- **Başvuru adresi dalı (7)** yalnız **tek kaynak** disiplinini çiviler; adresin gerçekten posta aldığı DNS sorgusu gerektirir ve `npm test` ağ çağrısı yapmaz — MX kapısı M6 F6.3/F6.4'ün işidir (B-011 koruma önerisi). Bu sınır test dosyasının yorumuna yazılır.
- **Test `web` konteynerinde koşar** (`docker compose exec web npm test`), `environment: "node"`.
- **Ek bağımlılık yok** — Vitest 4 kurulu.

---

## Test Kriterleri

- [ ] `tests/legal-consistency.test.ts` yedi dal içeriyor; her dalın hangi beyanı hangi dayanağa bağladığı yorumda yazılı
- [ ] `docker compose exec web npm test` yeşil; dosya sayısı 6 → 7, PASS sayısı dokümana yazılır
- [ ] **Yedi negatif kontrolün yedisi** kırmızı döndü (dayanak bozulduğunda ilgili dal kırılıyor) — kalem kalem dokümana
- [ ] Hiçbir dal "eşleşme bulunamadı" durumunda sessizce geçmiyor (v1'in dersi; ayrıca bir kontrolle gösterilir)
- [ ] Test yasal metnin tam cümlesini kopyalamıyor (ilişki doğrulaması)
- [ ] `npm run build` hatasız

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
