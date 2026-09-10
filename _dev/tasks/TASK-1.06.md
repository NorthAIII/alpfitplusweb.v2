# TASK-1.06: E-posta hattını doğrula ve uçtan uca gerçek lead testi

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi (+ F3.2 kabulünün uçtan uca teyidi)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.05 ✅

---

## Hedef

Resend gönderim hattının gerçekten çalıştığını doğrulamak ve lead hattının tamamını önizleme adresi üzerinden uçtan uca sınamak: form gönderilir, e-tabloya `env=preview` satırı düşer, `DEMO_TO` adresine bildirim gelir. Task, tek bir gerçek talebin her iki hedefe de ulaştığı ölçülerek kayda geçtiğinde tamamlanmış sayılır.

---

## Bağlam

Kod tarafı zaten yazılı — `toEmail` Resend HTTP API'sini kullanıyor, SDK yok. Bu task'ın işi kodu değiştirmek değil, **hattın gerçekliğini kanıtlamak**: DNS ve gönderici doğrulaması, sonra tek bir gerçek talep.

Araştırmada ölçüldü: Resend DNS kayıtları `alpfitplus.com`'da **zaten var** (DKIM, `send.` MX+SPF eu-west-1, DMARC `p=reject; adkim=s`). Yani kapsam tartışmasındaki "kayıtları oturum hazırlar, kullanıcı ekler" adımı büyük olasılıkla gereksiz; kalan iş panelde teyit.

DMARC katı hizalama (`adkim=s`) yüzünden `DEMO_FROM` **tam olarak `@alpfitplus.com`** olmalı — alt alan (`@send.alpfitplus.com`) reddedilir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Resend DNS kayıtları zaten var" ve "Apex MX yok"
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 kabul kriterleri
- `src/app/api/demo/route.ts` → `toEmail`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle; uçtan uca test sonucu
- `_dev/BULGULAR.md` — apex MX satırı doğrulanır/güncellenir (kapanmıyorsa kanca tazelenir)

---

## Alt Görevler

- [ ] **1. Resend panelini teyit ettir** (kullanıcı)
  - `alpfitplus.com` alan adı **Verified** görünüyor mu, bölge **eu-west-1** mi
  - Değilse: kayıtlar panelde yeniden üretilir; **DKIM değeri panelden kopyalanır, elle yazılmaz**; DNS Squarespace'te (NS `nsd1-4.squarespacedns.com`), apex SPF Google (`-all`) **dokunulmaz**

- [ ] **2. `DEMO_FROM` değerini doğrula**
  - Vercel env'inde `DEMO_FROM` tam `…@alpfitplus.com` (alt alan değil); DMARC `adkim=s` bunu şart koşuyor
  - `DEMO_TO` Google MX'li bir adres (`kivanc@kiwiailab.com`) — apex MX eksikliğinden etkilenmez

- [ ] **3. Önizlemeden gerçek talep gönder**
  - `https://<proje>.vercel.app/demo` üzerinden form doldurulur (gerçek telefondan; STYLE-GUIDE mobil gözlemi de burada yapılır, bulgular BULGULAR'a düşer)
  - E-tabloda satır: `env=preview`, tüm alanlar dolu
  - `DEMO_TO`'ya e-posta: gövde tüm alanları ve `Ortam: preview` satırını taşıyor, `reply_to` lead'in adresi

- [ ] **4. Düşen hedef davranışını sına**
  - Vercel env'inde `LEAD_WEBHOOK_URL` geçici olarak bozulur → talep yine 200 döner (e-posta yazdı) ve e-posta gelir; e-tabloya satır düşmez
  - Env geri alınır ve bir talep daha gönderilerek hattın döndüğü doğrulanır

- [ ] **5. Ölçümü kayda geç**
  - Satır + e-posta kanıtı (zaman damgası, `env` değeri) faz dokümanına yazılır; sır ve kişisel veri yazılmaz

---

## Etkilenen Dosyalar

```
_dev/
├── phases/PHASE-1.md     # uçtan uca test sonucu — zaten var
└── BULGULAR.md           # apex MX satırının güncel hâli — zaten var
```

> Kod değişikliği beklenmiyor. `DEMO_FROM` yanlış çıkarsa düzeltme env tarafındadır, repoda değil.

---

## Dikkat Noktaları

- **Apex MX yok** (iki çözümleyiciyle ölçüldü): `destek@alpfitplus.com` ve `demo@alpfitplus.com` posta **alamıyor** olabilir. Gönderim bundan etkilenmez, bildirim akışı da etkilenmez (`DEMO_TO` Google MX'li). Bu faz kapsamı değil — Gelen Kutusu'ndaki satır kapanmaz, yalnız doğrulanır.
- Resend ücretsiz katman: 100 e-posta/gün, 3.000/ay, 3 alan adı — test hacmi sınırın çok altında.
- Gerçek talep gönderilirken e-tabloya kişisel veri yazılır; test satırı `env=preview` etiketiyle ayrılır ve silinmesi gerekmez (kapsam kararı).
- Sır değerleri (Resend anahtarı, webhook URL'si) task dokümanına veya commit'e **yazılmaz**.
- 4. alt görevdeki env bozma işlemi **kullanıcı tarafından** yapılır ve hemen geri alınır; unutulursa gerçek lead kaybı riski doğar — geri alma testi zorunludur.

---

## Test Kriterleri

- [ ] Önizlemeden gönderilen gerçek talep e-tabloda görünür ve `env` sütunu `preview` yazar
- [ ] Aynı talep `DEMO_TO` adresine e-posta olarak gelir; gövde ad, kulüp, şube, segment, telefon, e-posta, mesaj, KVKK onayı, zaman ve `Ortam: preview` satırını taşır
- [ ] E-postanın `reply_to` alanı lead'in e-posta adresi (yanıtla doğrudan lead'e gidiyor)
- [ ] E-posta spam klasörüne düşmüyor (DMARC/DKIM hizası çalışıyor)
- [ ] Webhook bozukken talep **200** döner ve e-posta gelir (F3.3 kabul kriteri: kayıt yazılamasa bile e-posta yeterli sayılmaz — tersi: e-posta yazdıysa 200)
- [ ] Env geri alındıktan sonra gönderilen talep her iki hedefe de ulaşır

---

## Karar Noktaları

- **`Idempotency-Key` başlığı:** Resend tekrar gönderimde çift e-postayı önler (24 saat, ≤256 karakter; `lead.at + club` türevi). **Öneri: eklenmesin** — form otomatik tekrar denemiyor, kullanıcının bilerek iki kez göndermesi de meşru bir sinyal. Kullanıcı isterse tek satırlık ek; kararı bu task'ta al ve gerekçesini Oturum Kaydı'na yaz.

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

**Oluşturulma:** 2026-09-11
