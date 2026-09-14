# TASK-1.06: E-posta hattını aç ve uçtan uca canlı tur — lead deposu + e-posta

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi (+ F3.2 kabulünün uçtan uca teyidi)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.18 ✅ (depo env'i Vercel'de, token → `leads_preview` teyitli)

---

## Hedef

Resend e-posta hattını yayın ortamında açmak ve lead hattının tamamını önizleme adresinden uçtan uca sınamak. Beklenen akış:

- Gerçek telefondan form gönderilir.
- Lead deposunda `leads_preview`'a kayıt düşer.
- `DEMO_TO`'ya bildirim gelir.

Task, tek bir gerçek talebin iki hedefe de ulaştığı ölçülüp kayda geçtiğinde tamamlanmış sayılır.

---

## Bağlam

**2026-09-14 plan revizyonuyla yeniden yazıldı.** Önceki hâli Bunker'a kayıt ve satış otomasyonlarının tetiklenmediğinin canlı ölçümünü bekliyordu. Hedef v1'in lead deposu oldu (`docs/DECISIONS.md` 2026-09-14). Deponun soğuk otomasyondan ayrık olduğu kodla ve yedekle gösterildi. Otomasyon izolasyonu ölçümü bu yüzden bu task'tan **çıktı**.

**Düşen hedef sınaması da çıktı.** Eski plan alıcıyı sunucu tarafında geçici kapatıyordu. Bu depo ise v1'in **canlı** taleplerini de tutuyor, kapatmak gerçek bir talebi kaybettirebilir. Aynı davranış iki katmanda zaten kanıtlanıyor: kayıt düşünce e-postaya geçiş ve ikisi birden düşünce 503, TASK-1.14'ün Vitest bataryasında; depo kapalıyken formun WhatsApp yolu, TASK-1.14'ün yerel turunda.

**E-postayı site gönderir**, her talepte (`docs/DECISIONS.md` 2026-09-13 "E-posta kaynağı"). Kayıt kendi sunucuda, bildirim Resend'de durur; ikisi birbirinden bağımsızdır. ILKELER'in "hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz" maddesinin somut hâli budur. `route.ts`'in e-posta mantığı değişmez.

Kod zaten yazılı: `toEmail` Resend HTTP API'sini kullanıyor. Eksik olan yayın ortamındaki `RESEND_API_KEY` (değer yalnız kullanıcıda; TASK-1.03 Kalan İşler). Araştırmada ölçüldü:

- Resend DNS kayıtları `alpfitplus.com`'da **zaten var** (DKIM, `send.` MX+SPF eu-west-1, DMARC `p=reject; adkim=s`).
- Katı hizalama yüzünden `DEMO_FROM` **tam `@alpfitplus.com`** olmalı.
- v1 aynı alan adından aynı sağlayıcıyla gönderiyor (`../Alpfitplus-website.v1/api/demo.ts:326-346`), yani yol canlıda çalışıyor.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Resend DNS kayıtları zaten var" ve "Apex MX yok"
- `_dev/tasks/archive/TASK-1.18.md` → Oturum Kaydı — env kurulumu, test kaydının akıbeti kararı
- `_dev/tasks/archive/TASK-1.14.md` → Oturum Kaydı — Karar Noktaları sonuçları (`segment` yeri, `notify_*`)
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 ve F3.3 kabul kriterleri
- `src/app/api/demo/route.ts` → `toEmail`, `toStore`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi; uçtan uca tur sonucu → Ölçümler
- `_dev/BULGULAR.md` — B-011 kancası ölçümle tazelenir (kapanmıyorsa); B-037'nin `x-forwarded-for` ölçümü (aşağıda) Gelen Kutusu'na tek satır

---

## Alt Görevler

- [ ] **1. Resend panelini teyit ettir** (kullanıcı)
  - `alpfitplus.com` **Verified**, bölge **eu-west-1**
  - Değilse kayıtlar panelde yeniden üretilir; **DKIM değeri panelden kopyalanır, elle yazılmaz**. DNS Squarespace'te; apex SPF (Google, `-all`) **dokunulmaz**

- [ ] **2. E-posta env'ini tamamla ve dağıt** (kullanıcı girer, oturum adları doğrular)
  - `RESEND_API_KEY` → Vercel Production + Preview. Değer oturuma gösterilmez
  - `DEMO_FROM` tam `…@alpfitplus.com` (alt alan değil); `DEMO_TO` `kivanc@kiwiailab.com` (Google MX'li, apex MX eksikliğinden etkilenmez)
  - Yeni dağıtım tetiklenir (redeploy ya da boş olmayan bir push). TASK-1.18'in depo env'i de bu dağıtımla ilk kez yayına girer. Dağıtımın env'i gördüğü doğrulanır

- [ ] **3. Önizlemeden gerçek talep gönder**
  - `https://alpfitplus-web-v2.vercel.app/demo` **gerçek telefondan** doldurulur. Mobil gözlemler BULGULAR'a düşer ("Görsel ve mobil iyileştirme" fazını besler)
  - Depo: kullanıcı panelde (`https://lead.alpfitplus.com/_/`) kaydı `leads_preview`'da görür. Alanlar doğru eşlenmiş, `segment` TASK-1.14 kararının yerinde, `notify_team` karara göre `sent` ya da `pending`
  - E-posta: gövde tüm alanları ve `Ortam: preview` satırını taşıyor, `reply_to` lead'in adresi

- [ ] **4. Ölçümü kayda geç**
  - Kayıt + e-posta kanıtı (zaman damgası, koleksiyon, `stored`/`mailed`, başlıkta DKIM sonucu) faz dokümanına → Ölçümler. Sır ve kişisel veri yazılmaz

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
- Resend ücretsiz katman: 100/gün, 3.000/ay — test hacmi sınırın çok altında. v1 aynı hesabı kullanıyorsa kota paylaşılır. Hesabın hangisi olduğu alt görev 1'de not edilir.
- **Gerçek talep canlı depoya kişisel veri yazar.** Önizleme koleksiyonunda durur ve 12 ay sonra saklama cron'uyla silinir. Akıbeti TASK-1.18'deki kullanıcı kararıyla aynı.
- **Canlı deponun hız sınırı `ip_hash` başına saatte 5.** Telefonla tekrar denemede aynı saatte beşi geçilmez. Geçilirse form `429` gösterir: bu arıza değil, sınırın çalıştığının işaretidir.
- **Sır değerleri** (Resend anahtarı, depo token'ı, tuz) task dokümanına, commit'e, sohbete yazılmaz.
- **Fırsat ölçümü (bulgu kapsamı değil):** B-037'nin (1) kalemi Vercel'in istemciden gelen `x-forwarded-for`'u üzerine yazıp yazmadığının bu turda bir istekle ölçülmesini istiyor. Adaptör `ip_hash`'i aynı başlıktan ürettiği için sonuç artık depo sınırını da ilgilendirir. Sahte XFF ile bir istek atılır, Vercel istek logundaki gerçek IP ile karşılaştırılır; sonuç Gelen Kutusu'na tek satır. Bu istek geçerli bir talep **olmamalı** (ör. rızasız, 422), yoksa canlı depoya ikinci kayıt düşer. Düzeltme **yapılmaz**.
- Kanal notu: bu task'ın kriterlerinin tamamı canlı serving zinciri, gerçek cihaz, gerçek gelen kutusu ve canlı depo panelinde. Yerel koşucu ve CI bunları göremez.

---

## Test Kriterleri

- [ ] Önizlemeden gönderilen gerçek talep lead deposunda `leads_preview`'da **bir** kayıt olarak görünür (`env=preview`); `leads`'te yok — kanal: UAT
- [ ] Aynı talep `DEMO_TO`'ya e-posta olarak gelir; gövde ad, kulüp, şube, segment, telefon, e-posta, mesaj, KVKK onayı, zaman ve `Ortam: preview` satırını taşır — kanal: UAT
- [ ] E-postanın `reply_to` alanı lead'in e-posta adresi — kanal: UAT
- [ ] E-posta spam klasörüne düşmüyor (DKIM/DMARC hizası; başlıkta `dkim=pass`) — kanal: UAT
- [ ] Uç yanıtı `200` ve `stored:true`, `mailed:true` (tarayıcı ağ kaydı ya da Vercel fonksiyon logu) — kanal: UAT
- [ ] `vercel env ls`: `RESEND_API_KEY`, `DEMO_TO`, `DEMO_FROM`, `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` Production + Preview'de var (değer basılmadan)

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

**Oluşturulma:** 2026-09-11 · **Yeniden yazıldı:** 2026-09-13 (plan revizyonu — hedef Bunker, e-posta site kaynaklı) · 2026-09-14 (plan revizyonu — hedef v1'in lead deposu; otomasyon izolasyonu ve düşen hedef sınaması çıktı)
