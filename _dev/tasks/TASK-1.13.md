# TASK-1.13: Alıcıyı yerel prova ortamında kur — `{ok:true}` sözleşmesi ve seçim sorgusu izolasyonu

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.11 ✅ (yol, sözleşme, izolasyon yöntemi — kullanıcı onaylı), TASK-1.17 ✅ (yerel prova ortamı), TASK-1.16 ✅ (test koşucusu)

---

## Hedef

TASK-1.11'de onaylanan alıcıyı **önce yerel prova ortamında** kurmak ve sözleşmesini kalıcı bir testle kanıtlamak. Alıcının davranışı:

- Kimlik doğrulamalı JSON POST'u `alpfit` kiracısına talep olarak yazar.
- Yalnız yazım başarılıysa `{ok:true}` döner, her hata yolunda JSON `{ok:false, code}` döner.
- Yazdığı kayıt üç satış otomasyonunun seçim sorgusuna girmez.

Task şu üç koşul sağlandığında tamamlanmış sayılır:

- Alıcı tanımı repoda (ya da TASK-1.11'in belirlediği yerde) versiyonlandı.
- Sözleşme test paketi yerel alıcıya karşı yeşil.
- Yazım hatası simüle edildiğinde paket kırmızıya dönüyor.

---

## Bağlam

Sitenin alıcı sözleşmesi TASK-1.05'ten beri sabittir: `toWebhook` JSON POST atar ve yanıtı üç kapıda doğrular (HTTP durumu, JSON gövde, `ok === true`). Apps Script'ten kalan ders alıcıdan bağımsızdır: **hata anında HTML ya da boş gövde dönen alıcı "kaydedildi" diye okunur ve talep sessizce kaybolur.** Her hata yolunun JSON dönmesi bu task'ın çekirdek kriteridir.

2026-09-13 kullanıcı kararı: alıcı önce yerel kopyada kurulur ve sınanır, sonra canlıya taşınır (TASK-1.18). Sözleşme testi **ortam adresinden bağımsız** yazılır; aynı paket TASK-1.18'de canlı adrese karşı koşar.

Kısıt (ölçüldü, `docs/DECISIONS.md` 2026-09-13): Bunker'ın talep tabloları soğuk e-posta dizisini, otomatik onayı ve model sınıflandırmasını besliyor. Yerelde kanıtlanabilen seçim sorgusu düzeyidir. Otomasyonların canlı çalışma zamanındaki davranışı TASK-1.18'de ölçülür.

E-posta bu alıcının işi **değildir**: site her talepte Resend'le gönderir (revizyon kararı 2026-09-13).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — sözleşme, izolasyon yöntemi, seçim sorguları, alıcı tanımının versiyonlanacağı yer
- `_dev/tasks/archive/TASK-1.17.md` → Oturum Kaydı — yerel ortamın komutları ve adresleri
- `_dev/tasks/archive/TASK-1.16.md` → test konumu ve komutu
- `src/app/api/demo/route.ts` → `toWebhook`, `type Lead`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle

---

## Alt Görevler

- [ ] **1. Alıcıyı yerelde kur**
  - TASK-1.11 sözleşmesine birebir: adres biçimi, kimlik doğrulama, gövde → kayıt eşlemesi (`env` dâhil), izolasyon değeri
  - Yazım başarılıysa `{ok:true}`. Kimlik yanlış/eksik, gövde bozuk/`null`, zorunlu alan eksik ya da yazım hatası → `{ok:false, code}` JSON (kod kısa; sır ve kişisel veri taşımaz)
  - n8n yolunda yanıt düğümü yazım düğümünden **sonra** gelir; hata dalı da JSON döner. Varsayılan hata yanıtı (HTML) sözleşme ihlalidir

- [ ] **2. Alıcı tanımını versiyonla**
  - n8n yolunda iş akışı dışa aktarımı (kimlik bilgisi değerleri **hariç**) TASK-1.11'in belirlediği yere yazılır; yerel ortam onu içe alarak kurulabilir olmalı
  - Bunker ucu yolunda değişiklik o repoda, o reponun kurallarıyla yapılır; bu task'ın commit'i yalnız bu repodaki dosyaları taşır
  - Dosya (n8n yolu, konum teyitli): `research/lead-lab/receiver.workflow.json` (YENİ)

- [ ] **3. Sözleşme test paketini yaz**
  - Adres ve kimlik env'den (`LEAD_RECEIVER_URL`, `LEAD_RECEIVER_TOKEN` gibi — adlar TASK-1.11 sözleşmesine göre). Env tanımsızsa paket **atlanır** ve atlandığını açıkça raporlar; varsayılan `npm test`'i kırmaz
  - Senaryolar aşağıdaki test kriterleriyle birebir. Kayıt sayımı yerel veritabanından okunur (canlıda TASK-1.18'de salt okunur sorguyla). Sayım test içinden yapılacaksa Postgres istemcisi yeni bir devDependency'dir; eklenmeden önce `psql` ile dışarıdan sayımın yetip yetmediği tartılır, karar gerekçesiyle Oturum Kaydı'na yazılır
  - Dosya: `tests/lead-receiver.contract.test.ts` (YENİ)

---

## Etkilenen Dosyalar

```
research/lead-lab/
└── receiver.workflow.json          # YENİ — alıcı tanımı (n8n yolu; kimlik değeri yok)
tests/
└── lead-receiver.contract.test.ts  # YENİ — ortamdan bağımsız sözleşme paketi
```

> Yol Bunker giriş ucuysa ilk dosya bu repoda doğmaz; alıcı kodu `../bunker-dashboard`'da değişir.

---

## Dikkat Noktaları

- **"Yazmadan `ok:true`" yok:** yanıt yazımın sonucuna bağlanır. Bu task'ın en değerli kriteri yazım hatası simülasyonudur.
- **Zaman aşımı:** sitenin `toWebhook`'u 8 saniyede keser; alıcının yanıt süresi ölçülüp yazılır.
- **Kişisel veri asgariliği:** IP kayda girmez. `ua` alanı TASK-1.11 eşlemesine göre yazılır ya da bilinçli düşer; karar Oturum Kaydı'na.
- **Dışa aktarımda sır yok:** n8n iş akışı dışa aktarımı kimlik bilgisi kimliklerini taşıyabilir. Değer taşımadığı `grep` ile doğrulanır; token, parola ya da bağlantı dizesi dosyaya girmez.
- **Otomasyon izolasyonu yerelde yalnız sorgu düzeyindedir.** Seçim sorgusuna girmemek, canlıda hiçbir iş tarafından dokunulmamayı kanıtlamaz; o kanıt TASK-1.18'dedir.
- Bu task e-posta göndermez; Bunker kendiliğinden bildirim üretiyorsa (TASK-1.11 bulgusu) karar orada verilmiş olmalı.

---

## Test Kriterleri

- [ ] Sözleşme paketi yerel alıcıya karşı (`docker compose --profile lead up -d`; env tanımlı) `npm test` içinde yeşil:
  - Doğru kimlik + geçerli gövde → HTTP 200, gövde tam olarak `{"ok":true}`, veritabanında **bir** kayıt (`alpfit`, `env=local`)
  - Yanlış kimlik ve kimliksiz istek → JSON `{"ok":false,…}`, kayıt sayısı değişmedi
  - Bozuk JSON ve `null` gövde → JSON `{"ok":false,…}`, kayıt yok, `content-type` JSON
  - Zorunlu alanı eksik gövde → TASK-1.11 sözleşmesindeki davranış
  - Arka arkaya 5 istek → 5 kayıt; en uzun yanıt süresi yazıldı ve 8 sn'nin çok altında
- [ ] **Ürettiğim kapıyı sınadım — yazım hatası:** yerel veritabanında yazım bilerek başarısız kılındığında (ör. hedef tabloya yazma yetkisi geri alınır ya da kısıt ihlali üretilir) yanıt `{"ok":false,…}` JSON; paket bu senaryoyu yakalıyor. Geri alınınca yeşil
- [ ] Test kaydı üç otomasyonun seçim sorgusuna (TASK-1.11) yerel veritabanında **girmiyor**; kontrol grubu olarak otomasyona girmesi beklenen bir kayıt aynı sorguda **görünüyor** (sorgu gerçekten seçiyor, her şeye boş dönmüyor)
- [ ] Env tanımsızken `npm test` sözleşme paketini atladığını raporluyor, çıkış kodu 0
- [ ] Versiyonlanan alıcı tanımı yerel ortama sıfırdan içe alınınca aynı paket yine yeşil (tanım kendi kendine yeter)
- [ ] Dışa aktarım dosyasında sır değeri yok (`grep` ile)

---

## Risk ve Geri Dönüş Planı

- **Yerel ortam canlıdan sapıyorsa** (şema, sürüm) yerel yeşil yanıltır → TASK-1.17'nin sürüm/şema karşılaştırması esas; sapma görülürse TASK-1.18'den önce kullanıcıya getirilir.
- **Rollback:** yalnız yerel; prova servisleri adıyla indirilir, prova hacmi adıyla silinir (`down` kullanılmaz — TASK-1.17 Dikkat Noktaları), iki dosya dosya bazlı geri alınır.

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
