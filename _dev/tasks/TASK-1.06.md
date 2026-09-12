# TASK-1.06: E-posta hattını aç ve uçtan uca canlı tur — Bunker + e-posta, otomasyon tetiklenmeden

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi (+ F3.2 kabulünün uçtan uca teyidi)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.18 ✅ (alıcı canlıda, `LEAD_WEBHOOK_URL` Vercel'de tanımlı)

---

## Hedef

Resend e-posta hattını yayın ortamında açmak ve lead hattının tamamını önizleme adresi üzerinden uçtan uca sınamak. Beklenen akış:

- Gerçek telefondan form gönderilir.
- Bunker'da `alpfit` kiracısına `env=preview` kaydı düşer.
- `DEMO_TO`'ya bildirim gelir.
- Talep **hiçbir satış otomasyonunu tetiklemez**.

Task, tek bir gerçek talebin iki hedefe de ulaştığı ve otomasyonlara girmediği ölçülerek kayda geçtiğinde tamamlanmış sayılır. Düşen hedef davranışı da aynı turda sınanır.

---

## Bağlam

**2026-09-13 plan revizyonuyla yeniden yazıldı.** Eski hâli Google e-tablosuna satır bekliyordu. Hedef Bunker oldu (`docs/DECISIONS.md` 2026-09-13).

**E-postayı site gönderir**, her talepte (revizyon kararı). Kayıt kendi sunucuda, bildirim Resend'de durur; ikisi birbirinden bağımsızdır. Sunucu düşerse e-posta yine gelir, Resend düşerse kayıt yine kalır. ILKELER'in "hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz" maddesinin somut hâli budur. `route.ts`'in e-posta mantığı değişmez.

Kod zaten yazılı: `toEmail` Resend HTTP API'sini kullanıyor. Eksik olan yayın ortamındaki `RESEND_API_KEY` (değer yalnız kullanıcıda; TASK-1.03 Kalan İşler). Araştırmada ölçüldü:

- Resend DNS kayıtları `alpfitplus.com`'da **zaten var** (DKIM, `send.` MX+SPF eu-west-1, DMARC `p=reject; adkim=s`).
- Katı hizalama yüzünden `DEMO_FROM` **tam `@alpfitplus.com`** olmalı.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Resend DNS kayıtları zaten var" ve "Apex MX yok"
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — otomasyon seçim koşulları ve salt okunur sorgular
- `_dev/tasks/archive/TASK-1.18.md` → Oturum Kaydı — canlı alıcının devre dışı bırakılma yolu, test kayıtlarının akıbeti kararı
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 ve F3.3 kabul kriterleri
- `src/app/api/demo/route.ts` → `toEmail`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi; uçtan uca tur sonucu → Ölçümler
- `_dev/BULGULAR.md` — B-011 kancası ölçümle tazelenir (kapanmıyorsa); B-037'nin `x-forwarded-for` ölçümü (aşağıda) Gelen Kutusu'na tek satır

---

## Alt Görevler

- [ ] **1. Resend panelini teyit ettir** (kullanıcı)
  - `alpfitplus.com` **Verified**, bölge **eu-west-1**
  - Değilse kayıtlar panelde yeniden üretilir; **DKIM değeri panelden kopyalanır, elle yazılmaz**. DNS Squarespace'te; apex SPF (Google, `-all`) **dokunulmaz**

- [ ] **2. E-posta env'ini tamamla** (kullanıcı girer, oturum adları doğrular)
  - `RESEND_API_KEY` → Vercel Production + Preview. Değer oturuma gösterilmez
  - `DEMO_FROM` tam `…@alpfitplus.com` (alt alan değil); `DEMO_TO` `kivanc@kiwiailab.com` (Google MX'li, apex MX eksikliğinden etkilenmez)
  - Env sonrası yeni dağıtım tetiklenir (redeploy ya da boş olmayan bir push); dağıtımın env'i gördüğü doğrulanır

- [ ] **3. Önizlemeden gerçek talep gönder**
  - `https://alpfitplus-web-v2.vercel.app/demo` **gerçek telefondan** doldurulur. Mobil gözlemler BULGULAR'a düşer ("Görsel ve mobil iyileştirme" fazını besler)
  - Bunker'da kayıt: `alpfit` kiracısı, `env=preview`, tüm alanlar dolu ve doğru eşlenmiş
  - E-posta: gövde tüm alanları ve `Ortam: preview` satırını taşıyor, `reply_to` lead'in adresi

- [ ] **4. Otomasyon izolasyonunu canlı talepte teyit et**
  - TASK-1.11'in salt okunur seçim sorguları: kayıt envanterdeki gönderen/eylem yapan yolların hiçbirine girmiyor
  - Otomasyonların en az bir döngüsü sonrası kayıt değişmemiş; talepteki e-posta adresine giden gönderim kaydı yok

- [ ] **5. Düşen hedef davranışını sına**
  - Alıcı **sunucu tarafında** geçici devre dışı (TASK-1.18'deki yol; Vercel env bozup yeniden dağıtmaktan hızlı ve daha az riskli) → talep 200, `stored:false`, `mailed:true`; e-posta gelir, kayıt düşmez
  - Alıcı geri açılır, bir talep daha → iki hedef de ulaşır
  - **Geri açma teyidi zorunlu** — unutulursa gerçek talep yalnız e-postaya kalır

- [ ] **6. Ölçümü kayda geç**
  - Kayıt + e-posta kanıtı (zaman damgası, `env`, otomasyon sorgu sonuçları) faz dokümanına → Ölçümler. Sır ve kişisel veri yazılmaz

---

## Etkilenen Dosyalar

```
_dev/
├── phases/PHASE-1.md     # uçtan uca tur sonucu — zaten var
└── BULGULAR.md           # B-011 kancası, B-037 ölçüm satırı — zaten var
```

> Kod değişikliği beklenmiyor. `DEMO_FROM` yanlış çıkarsa düzeltme env tarafındadır.

---

## Dikkat Noktaları

- **Apex MX yok** (B-011): `destek@` ve `demo@alpfitplus.com` posta alamıyor olabilir. Gönderim ve bildirim akışı etkilenmez (`DEMO_TO` Google MX'li). Bulgu bu fazda kapanmaz; "Yayın öncesi düzeltmeler" fazının kilitleyen bulgusudur.
- Resend ücretsiz katman: 100/gün, 3.000/ay — test hacmi sınırın çok altında.
- Gerçek talep Bunker'a kişisel veri yazar. `env=preview` ile ayrılır; akıbeti TASK-1.18'deki kullanıcı kararına göre.
- **Sır değerleri** (Resend anahtarı, alıcı adresi, kimlik) task dokümanına, commit'e, sohbete yazılmaz.
- **Fırsat ölçümü (bulgu kapsamı değil):** B-037'nin (1) kalemi Vercel'in istemciden gelen `x-forwarded-for`'u üzerine yazıp yazmadığının bu turda bir istekle ölçülmesini istiyor. Sahte XFF ile bir istek atılır, Vercel istek logundaki gerçek IP ile karşılaştırılır; sonuç Gelen Kutusu'na tek satır. Düzeltme **yapılmaz**.
- Kanal notu: bu task'ın kriterlerinin tamamı canlı serving zinciri, gerçek cihaz, gerçek gelen kutusu ve canlı veritabanı katmanındadır. Yerel koşucu ve CI bunları göremez.

---

## Test Kriterleri

- [ ] Önizlemeden gönderilen gerçek talep Bunker'da `alpfit` kiracısında **bir** kayıt olarak görünür ve `env` = `preview` — kanal: UAT
- [ ] Aynı talep `DEMO_TO`'ya e-posta olarak gelir; gövde ad, kulüp, şube, segment, telefon, e-posta, mesaj, KVKK onayı, zaman ve `Ortam: preview` satırını taşır — kanal: UAT
- [ ] E-postanın `reply_to` alanı lead'in e-posta adresi — kanal: UAT
- [ ] E-posta spam klasörüne düşmüyor (DKIM/DMARC hizası; başlıkta `dkim=pass`) — kanal: UAT
- [ ] Kayıt TASK-1.11 envanterindeki gönderen/eylem yapan yolların seçim sorgusuna girmiyor, bir döngü sonrası değişmemiş, gönderim kaydı yok — kanal: UAT
- [ ] Alıcı devre dışıyken talep **200** (`stored:false`, `mailed:true`) ve e-posta gelir; kayıt yok (F3.3 kabulü: e-posta yazdıysa 200) — kanal: UAT
- [ ] Alıcı geri açıldıktan sonra gönderilen talep iki hedefe de ulaşır — kanal: UAT
- [ ] `vercel env ls`: `RESEND_API_KEY`, `DEMO_TO`, `DEMO_FROM`, `LEAD_WEBHOOK_URL` (ve varsa TASK-1.14'ün kimlik anahtarı) Production + Preview'de var (değer basılmadan)

---

## Karar Noktaları

- **`Idempotency-Key` başlığı:** Resend tekrar gönderimde çift e-postayı önler (24 saat, ≤256 karakter; `lead.at + club` türevi). **Öneri: eklenmesin.** Form otomatik tekrar denemiyor; kullanıcının bilerek iki kez göndermesi de meşru bir sinyal. Kullanıcı isterse tek satırlık ek; karar ve gerekçe Oturum Kaydı'na.

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

**Oluşturulma:** 2026-09-11 · **Yeniden yazıldı:** 2026-09-13 (plan revizyonu — hedef Bunker, e-posta site kaynaklı)
