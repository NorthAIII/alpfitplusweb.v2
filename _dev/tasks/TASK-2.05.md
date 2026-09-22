# TASK-2.05: Demo formunda odak ve durum mekaniği — onay ve hata her telefonda görünür (B-055)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.1: Demo formu ve talep ucu
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok

---

## Hedef

Demo formunun **gönderim sonrası hâlini** her telefon genişliğinde görünür kılmak ve odağı hata türüne göre doğru yere taşımak. Bugün 320-360 px'te başarılı gönderimde ziyaretçi **hiçbir onay görmüyor** (kutu ekranın üstünde, yapışkan başlığın arkasında), hata kutusu ekranın 168-561 px altında kalıyor, `missing` hatasında odak **dolu** alana gidiyor ve eşlenmeyen kodlarda odak `body`'ye düşüyor.

Task, B-055'in altı mekanik ayağı (b, c, d, e, f, g) 320/360/390/412 px'te ölçülerek kapandığında tamamlanmış sayılır. **Görsel işaret ayağı (a) bu task'ta değil** — TASK-2.06.

---

## Bağlam

Sitenin birincil dönüşümü tamamlandığında 320-360 px'te kullanıcı hiçbir şey görmüyor: `role="status"` kutusu ("Talebiniz bize ulaştı") ekranın **üstünde** kalıyor (`top: −424 / bottom: 14` @ 320×568), kaydırma 6/6 örnekte sabit (`scrollY=1021`) — yani animasyon artığı değil, hiç kaydırma yok. `ILKELER.md`'nin 1. öncelik ekseni **Dönüşüm**'e doğrudan dokunuyor.

**Araştırmanın ölçtüğü mekanizma (`phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #5):** `globals.css:124` zaten `scroll-padding-top: 5.5rem` (88 px) taşıyor ve yapışkan başlık `h-17` (68 px) — **offset altyapısı kurulu**. Eksik olan kaydırmanın kendisi: `state === "ok"` dalında form tamamen değişiyor, sayfa kısalıyor, tarayıcı `scrollY`'yi olduğu yerde bırakıyor ve `scroll-padding-top` hiç devreye girmiyor.

**Seçilen çözüm (b):** durum değişiminde sonuç öğesine **açık odak taşıma** (`tabIndex={-1}` + `focus()`); odak kaydırması `scroll-padding-top`'u zaten onurlandırır. `scroll-margin-top` **eklenmez** — mevcut genel ayarı yerelde ikizler ve iki yerden yönetilen bir offset doğurur (reddedilen (a) seçeneği). (g) ayağı — 412 px'te h1'in üst 40 px'inin başlığın arkasında kalması — aynı hamlede kapanır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-055-demo-formu-hata-akisi-mobilde-gorunmuyor.md` — altı ayak, ölçüm tabloları, koruma önerisindeki odak tablosu
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #5 ve Dikkat Edilecekler → "Tarayıcı katmanı bu fazda otomatik ölçülmüyor"
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — **çok senaryolu ölçümde her senaryo kendi IP'sini taşımalı**; `/api/demo` IP başına 10 dk / 5 istek sayar ve doğrulamadan önce çalışır
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — Playwright ölçümü
- `src/components/sections/DemoForm.tsx:20-28, 55-75, 195-235` · `src/app/globals.css:124`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/bulgular/B-055-*.md` — hangi ayakların kapandığı (a ayağı TASK-2.06'da; atom o task'ta kapanır)

---

## Alt Görevler

- [ ] **1. Sonuç öğelerine odak taşı (ayaklar b, f, g)**
  - Başarı kutusuna (`state === "ok"` dalı) ve hata kutusuna (`ERROR_ID`) `tabIndex={-1}` verilir; durum değiştiğinde `focus()` çağrılır
  - Odak taşıma **durum değişimine** bağlanır (render sonrası), gönderim fonksiyonunun içinde senkron değil
  - Yeni `scroll-margin-top` **eklenmez** — mevcut `scroll-padding-top: 5.5rem` yeterli (araştırma kararı)

- [ ] **2. Odak kuralını koda göre ayır (ayak c)**
  - Bugünkü kural (`DemoForm.tsx:61-62`) `bad-contact` için yazılmış ama tüm kodlara uygulanıyor. Hedef tablo:

    | Kod | Odak |
    |---|---|
    | `missing`, `missing-contact` | İlk **boş** alan |
    | `bad-contact` | İlk **dolu-ama-bozuk** alan |
    | Eşlenmeyen kodlar ve ağ hatası | Hata kutusu (`tabIndex={-1}` + `focus()`) |

  - Var olan kod yorumu güncellenir; yeni kuralın gerekçesi yanında durur

- [ ] **3. Eşlenmeyen kodlarda odağı kutuya taşı (ayak d)**
  - `no-sink` (503), `rate-limited` (429) ve `catch` dalı (ağ hatası): odak hata kutusuna
  - Bugün düğme `disabled` olunca odak `body`'ye düşüyor ve geri verilmiyor

- [ ] **4. Gönderim başında eski işaretleri sıfırla (ayak e)**
  - `setState("sending")` anında `invalidFields` sıfırlanır — bugün hata kutusu DOM'dan kalkarken alanlar hâlâ `aria-describedby="… demo-form-error"` gösteriyor ve o kimlik DOM'da yok

---

## Etkilenen Dosyalar

```
src/components/sections/
└── DemoForm.tsx      # odak taşıma, odak kuralı, sıfırlama — zaten var
```

`globals.css`'e dokunulmaz (mevcut `scroll-padding-top` kullanılır).

---

## Dikkat Noktaları

- **Hız sınırı bataryayı yanıltır.** `/api/demo` IP başına 10 dk / 5 istek sayar ve **doğrulamadan önce** çalışır; senaryo başına ayrı `X-Forwarded-For` gönderilmezse 6. istekten sonra sahte kırmızı okunur (`memory/hiz-sinirli-uca-test-bataryasi.md`).
- **Kaydırma ölçümü beklemeli.** Bulgunun kendi yöntemi: kaydırma tamamen durduktan sonra ölç (≥1500 ms, `scrollY` üç okumada sabit). `scroll-behavior: smooth` yüzünden erken okuma yanıltır.
- **`aria-invalid`'in yeniden gönderime kadar sürmesi kusur değil** (ARIA 1.2, GOV.UK deseni) — sıfırlama **gönderim başında** yapılır, kullanıcı yazarken değil.
- **Alan bazlı hata metni ve görsel işaret bu task'ta yok** (ayak a → TASK-2.06). Genel kutu özet olarak kalır.
- **Kalıcı tarayıcı betiği bu fazda yazılmıyor** — bilinçli kapsam kararı ("Kalite kapıları otomatik" fazı, M6 F6.2). Bu task'ın ölçümü scratchpad'e yazılan geçici betikle yapılır; rakamlar dokümana girer.
- 390/412'de onay zaten görünüyordu — düzeltme oraya **regresyon sokmamalı** (kontrol grubu).

---

## Test Kriterleri

- [ ] **Başarı yolu:** 320 / 360 / 390 / 412 px'te gönderim sonrası onay kutusu tamamen görünür ve yapışkan başlığın arkasında değil (kutu `top` ≥ 68 px; rakamlar dokümana) — kanal: UAT
- [ ] **Hata yolu:** aynı dört genişlikte hata kutusu görünür alanda (her hata türü için: `missing`, `missing-contact`, `bad-contact`, `no-consent`) — kanal: UAT
- [ ] **Odak tablosu:** `missing`'de **boş** alana, `bad-contact`'ta dolu-ama-bozuk alana, `no-sink`/`rate-limited`/ağ hatasında hata kutusuna odaklanıyor (senaryo başına ayrı IP ile) — kanal: UAT
- [ ] **(g):** 412 ve 390 px'te gönderim sonrası `<h1>` yapışkan başlığın arkasında değil — kanal: UAT
- [ ] **(e):** yeniden gönderim sırasında hiçbir alan DOM'da olmayan bir kimliği `aria-describedby` ile göstermiyor — kanal: UAT
- [ ] **Kontrol grubu:** 768 ve 1440 px'te davranış değişmedi (onay ve hata görünür, odak doğru) — kanal: UAT
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `mobile-audit.mjs` yatay kaydırma: yok · `scan.mjs` `/demo` konsol temiz
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız

---

## Risk ve Geri Dönüş Planı

- **Odak taşıma ekran okuyucuda gürültü yapabilir:** `role="status"` / `role="alert"` zaten duyuruyor; odak taşıma ikinci bir duyuru üretirse duyuru kipi gözden geçirilir (kutunun `aria-live` değeri, odak hedefi).
- **Rollback:** tek dosya, dosya bazlı geri alma yeterli.

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
