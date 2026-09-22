# TASK-1.19: Satır sonu ayıklama — e-posta konusu ve depo mesajı sahtelenemesin

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.06 ✅ (e-posta hattı yayın ortamında açıldı — açık olan yüzey bu task'ın konusu)

---

## Hedef

Ziyaretçinin yazdığı metnin, e-posta bildiriminin **konu satırını** ve depo kaydının **mesaj alanını** sahteleyememesini sağlamak: `clean()` bugün yalnız `trim` + uzunluk kırpma yapıyor, **iç satır sonlarını (`\n`, `\r`) ayıklamıyor**.

Task, aşağıdaki iki ölçüm yeşile döndüğünde tamamlanmış sayılır: (1) kulüp adına satır sonu konan bir talepte e-posta konusu tek satır kalıyor, (2) mesaj alanına konan sahte `Segment:` satırı depo kaydında ayırt edilebiliyor ya da imkânsız hâle geliyor.

---

## Bağlam

**UAT bulgusu (verify-phase, 2026-09-22 — Senaryo #26).** Ölçüm `web` konteynerinde, gerçek `POST /api/demo` işleyicisine karşı, sahte Resend alıcısıyla yapıldı:

```
kontrol      → subject = "Demo talebi — Form Spor Kulubu"           (tek satır)
enjeksiyon   → subject = "Demo talebi — Form Spor\nBcc: kurban@example.com"
depo mesajı  → "Segment: pilates\nmerhaba\nSegment: SAHTE"
```

Konu satırı `route.ts` içinde `` `Demo talebi — ${lead.club || lead.name}` `` ile kuruluyor ve doğrudan Resend'in JSON gövdesine giriyor. Sağlayıcının satır sonunu kırpıp kırpmadığı **ölçülmedi** (ölçmek gerçek e-posta göndermeyi gerektirirdi) — ama QUALITY 2'nin "form girdileri sunucuda doğrulanıp sınırlanıyor mu" ölçütü bizim tarafımızda karşılanmıyor: sağlayıcının davranışına güvenmek bir kapı değildir.

**Sınıfın kapsamı ölçüldü, sınırı belli:**
- `subject` ← `club` (ya da kulüp boşken `name`) — **açık**. Kulüp boşken uç zaten `422 missing` döndüğü için pratikte tek giriş `club`.
- depo `message` ← `Segment: ${segment}\n${message}` — **açık** (sahte `Segment:` satırı yazılabiliyor).
- e-posta gövdesindeki `Ad:` / `Şube:` / `Telefon:` satırları ← aynı sınıf (satır sonu ekleyen bir değer sahte bir alan satırı üretir).
- `reply_to` ← `email`, `isValidEmail` boşluk karakterini kabul etmiyor (`[^\s@]+@[^\s@]+\.[^\s@]+`) — **korunuyor**, dokunma.

Bu bir faz-penceresi bulgusudur: `subject` satırı fazdan eskidir ama e-posta yolunu yayın ortamında **bu faz açtı** (TASK-1.06, `RESEND_API_KEY`), yani sınıf bu fazda canlıya çıktı.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1.md` → UAT Sonuçları satır 26 — ölçümün kendisi
- `src/app/api/demo/route.ts` → `clean`, `toEmail`, `toStore`
- `src/lib/contact.ts` → `isValidEmail` (korunan kol; aynı deseni tekrar yazma)
- `_dev/QUALITY.md` → 2 Güvenlik, 5 Hata Yönetimi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle; UAT satır 26 yeniden koşulur

---

## Alt Görevler

- [ ] **1. Testleri önce yaz ve kırmızı gör**
  - `tests/api-demo.test.ts`: kulüp adında `\n` / `\r\n` → Resend gövdesindeki `subject` tek satır; mesajda sahte `Segment:` satırı → depo gövdesinde ayırt edilebilir
  - Kontrol grubu: olağan değerlerde konu ve mesaj bugünkü hâliyle aynı kalıyor (kapı her şeye kırmızı basmıyor)
  - Dosya: `tests/api-demo.test.ts`

- [ ] **2. Tek satırlık alanlarda satır sonunu ayıkla**
  - `clean()` **ikiye ayrılır**: tek satırlık alanlar (`name`, `club`, `phone`, `email`, `segment`, `branches`) için `\r`/`\n` (ve tercihen diğer kontrol karakterleri) boşluğa çevrilir ve tekrar `trim` + `slice` yapılır; `message` çok satırlı kalır (form `<textarea>`, satır sonu meşru)
  - Kırpma sırası ve `MAX` değerleri **değişmez** — kırpmadan önce ayıkla ki uzunluk sınırı ayıklanmış metne uygulansın
  - Dosya: `src/app/api/demo/route.ts`

- [ ] **3. Mesajın sahte `Segment:` satırını ele al**
  - Karar Noktası'nın sonucuna göre: ya `Segment:` etiketi mesaja karışmayan bir biçimde yazılır (ör. ayırıcı satır) ya da mesajdaki satır başı `Segment:` kalıbı etkisizleştirilir. **Mesajın kendisi kırpılmaz** — kullanıcı metni kaybolmamalı
  - Dosya: `src/app/api/demo/route.ts`

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts              # clean() tek-satır kolu, toEmail subject, toStore message — zaten var
tests/
└── api-demo.test.ts      # enjeksiyon senaryoları + kontrol grubu — zaten var
```

---

## Dikkat Noktaları

- **`message` çok satırlı kalmalı.** Form `<textarea>` sunuyor; satır sonunu oradan silmek gerçek bir talebi bozar.
- **`reply_to` zaten korunuyor** — `isValidEmail` boşluk kabul etmiyor. İkinci bir doğrulama yazma, tek kaynak `src/lib/contact.ts`.
- **Mevcut davranış korunur:** bal küpü sessiz 200, `MAX` kırpma, 422/400/429 kodları, "önce dayanıklı kayıt sonra e-posta" sırası, `503 no-sink` — hiçbiri değişmez.
- **Sağlayıcının ne yaptığını varsayma.** Kapı bizim tarafımızda kurulur; "Resend zaten temizliyordur" bir ölçüm değil bir tahmindir.
- Depo şeması `message` için 5000 karakter kabul ediyor; `Segment:` etiketi + 2000 karakterlik mesaj sınırın altında kalıyor, ayıklama bu payı bozmamalı.
- Sır hijyeni değişmez: log satırlarına yeni alan girmez.

---

## Test Kriterleri

- [ ] `docker compose exec web npm test` yeşil; yeni senaryolar:
  - kulüp adı `"Form Spor\nBcc: x@y.test"` → Resend gövdesindeki `subject` **tek satır**, `\n` ve `\r` içermiyor
  - kulüp adı `"Form Spor\r\nBcc: x@y.test"` → aynı sonuç (CR ayrı sınanır)
  - e-posta gövdesinde `Ad:`/`Şube:`/`Telefon:` satırlarının sayısı sabit — değer satır sonu taşısa da yeni alan satırı doğmuyor
  - mesajdaki sahte `Segment:` satırı depo kaydında gerçek etiketten ayırt edilebiliyor (Karar Noktası'nın seçtiği biçime göre)
  - **kontrol grubu:** olağan değerlerde `subject` ve depo `message` bugünkü hâliyle birebir aynı
- [ ] **Ürettiğim kapıyı sınadım — bozuk girdi:** yeni senaryolar kod değişmeden koşuldu ve kırmızı görüldü; değişiklik sonrası yeşil
- [ ] Regresyon: `tests/api-demo.test.ts` mevcut 28 senaryosu ve tüm suite (5 dosya / 61 PASS + 1 skipped) yeşil
- [ ] `docker compose exec web npm run build` hatasız; `npx eslint src/app/api/demo/route.ts tests/` temiz

---

## Karar Noktaları

- **Sahte `Segment:` satırı nasıl ele alınır:** (a) mesajdaki satır başı `Segment:` kalıbını etkisizleştir · (b) etiketi mesajdan görsel bir ayırıcıyla ayır (ör. `Segment: X` + `---` + mesaj) · (c) hiç ele alma, yalnız konu satırını düzelt. **Önerilen: (b)** — kullanıcı metnine dokunmaz, okuyan insan için ayrım nettir, depo şemasında kolon açmak gerekmez (v1'in deposu dokunulmaz).
- **Ayıklama biçimi:** satır sonunu (a) boşluğa çevir · (b) tamamen sil. **Önerilen: (a)** — "Form Spor\nStüdyo" değeri "Form Spor Stüdyo" olur, kelimeler birleşmez.

---

## Risk ve Geri Dönüş Planı

- **Fazla agresif ayıklama** meşru bir kulüp adını bozabilir (ör. çift boşluk) → ayıklama yalnız `\r`/`\n` ve kontrol karakterleriyle sınırlı kalır, kontrol grubu testi bunu korur.
- **Rollback:** tek ürün dosyası (`route.ts`) + tek test dosyası; dosya bazlı geri alma yeterli.

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

**Durum:** 🔄 Devam edecek

**Yapılanlar:**
- [Tamamlanan alt görevler ve detaylar]

---

**Oluşturulma:** 2026-09-22 (verify-phase UAT bulgusu — Senaryo #26)
