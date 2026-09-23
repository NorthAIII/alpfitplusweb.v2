# M3: Lead Hattı

**Sorumluluk:** Demo talebini almak, **önce dayanıklı kayda** yazmak, sonra e-postayla bildirmek; hiçbir talebi sessizce kaybetmemek.
**Bağımlılık:** M7 (hedef env değişkenleri ve sır yönetimi yayın ortamında tanımlanır)
**Sınır:** `DemoForm.tsx` (istemci), `src/app/api/demo/route.ts` (sunucu), WhatsApp yedeği, bal küpü, hız sınırı. Analitik olay sayımı M7'de (F7.4) tanımlanır, form yalnız olayı tetikler.

---

## Feature'lar

### F3.1: Demo formu ve talep ucu → Phase —

**Açıklama:** Form alanları (ad, kulüp, şube, telefon, e-posta, segment, mesaj, rıza) doğrulanır; bal küpü alanı botu eler; IP başına 10 dakikada 5 istek sınırı; hedef yoksa uç **başarılı dönmez** (503) ve form kullanıcıyı WhatsApp'a yönlendirir. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Bal küpü dolu istek 200 döner ama kayıt yazmaz (bot yanıltılır)
- Alan uzunluk sınırları (`MAX`) aşılınca değer sessizce kırpılır, istek reddedilmez; bozuk JSON gövdesi 400 döner
- 6. istek 429 döner
- Hiçbir hedef tanımlı değilse 503 döner; form WhatsApp bağlantısı gösterir, "gönderildi" demez
- Rıza kutusu işaretsizse istemci göndermez

**Bağımlılık:** M1 `CONTACT` (WhatsApp adresi)

**Edge Case'ler:**
- Hız sınırı bellek içi — çok örnekli çalışmada (Vercel) örnek başına sayar; ölçek büyürse paylaşımlı sayaca taşınır
- Form gönderimi sırasında ağ kesilirse istemci hatayı gösterir ve WhatsApp yolunu sunar

---

### F3.2: Dayanıklı kayıt hedefi → Phase 1

**Açıklama:** `LEAD_STORE_URL` + `LEAD_STORE_TOKEN` + `IP_HASH_SALT` (v1'in lead deposu, PocketBase `POST /lead`) veya yerel yedek `LEAD_FILE_PATH` (JSONL) yayın ortamında tanımlanır ve gerçek bir talep kayda düşer. TASK-1.14'te bağlandı ve yerel depo kopyasına karşı uçtan uca sınandı (`leads_preview`); canlı env girişi ve tek teyit isteği TASK-1.18'de. "Önizleme yayını, lead hattı ve analitik" faz konusunun parçası.

**Kabul Kriterleri:**
- Önizleme ortamından gönderilen gerçek bir demo talebi hedefte (depo koleksiyonu veya dosya) görünür
- Depo düşerse (5xx, zaman aşımı, `413`/`429` ya da sözleşme dışı yanıt — yalnız `201` kayıt sayılır) uç e-postaya geçmeden önce hatayı loglar; kayıt **ve** e-posta birlikte düşerse 503 döner ve form kullanıcıya WhatsApp yolunu gösterir
- Sır değerleri repoda yok; `.env.example` yalnız anahtar adlarını taşır
- **Hatta yeni bir hedef, yeni bir alan ya da yeni bir sağlayıcı girdiğinde `src/content/legal.ts` aynı işte gözden geçirilir** ve neyin değiştiği (ya da neden değişmediği) yazılır — B-024'ün kalıcı koruma kalemi, TASK-2.16'da buraya kondu. Gerekçe ölçülmüş: metin gerçeğin **arkasında** kalmadı, gerçek metnin **önünden** geçti (lead hedefi değişti, hız sınırı sonradan eklendi, `ip_hash` gövdeye girdi, onay e-postası açıldı — dördü de metne yansımadan yayında durdu). Kapının mekanik yarısı ayrı evdedir ([B-060](../bulgular/B-060-yasal-beyani-koruyan-kapi-yok.md) → TASK-2.18/2.19); bu kriter insan tarafını tutar

**Bağımlılık:** M7 F7.3 (Vercel projesi ve env)

**Edge Case'ler:**
- Vercel'de kalıcı disk yok — `LEAD_FILE_PATH` orada çalışmaz; birincil hedef depodur (`LEAD_STORE_URL`). Depo kodu v1 reposunda (dokunulmaz), yerel kopyası compose profili `lead` ile kurulur (TASK-1.17)
- Depo KVKK açısından kişisel veri tutar (12 ay saklama); yasal metinle tutarlı olmalı (M1 `legal.ts`, TASK-1.15)
- `ip_hash` = HMAC-SHA256(ip, `IP_HASH_SALT`); tuz tanımsızsa depo hiç denenmez (fail-closed), ham IP hiçbir yere yazılmaz

---

### F3.3: E-posta bildirimi → Phase 1

**Açıklama:** `RESEND_API_KEY` ile `DEMO_TO`'ya bildirim. İkincil; tek başına yeterli sayılır ama tercih edilmez. Aynı faz konusunda.

**Kabul Kriterleri:**
- Gerçek talep `DEMO_TO` adresine e-posta olarak gelir; gövde tüm alanları taşır — **karşılandı:** canlı turda Resend `delivered`, dokuz alan + `KVKK onayı` + `Ortam:` satırı ölçüldü (`phases/PHASE-1-UAT.md` #9); **gelen kutusu/spam yerleşimi** API'den ölçülemez, kullanıcı gözüne kaldı (#10)
- E-posta başarısız olsa bile dayanıklı kayıt yazıldıysa uç 200 döner
- **Ziyaretçi geçerli bir e-posta verdiyse talep sahibine de onay e-postası gider** (TASK-2.07, B-059): alıcı ziyaretçi, `reply_to` ekibin kutusu, metin `src/content/mail.ts` → `LEAD_CONFIRMATION`, gövde düz metin. İki gönderim **paralel**dir ve biri diğerini bloke etmez — **karşılandı:** yerel depoya karşı turda ikisi de `delivered`, sağlayıcı damgaları 214 ms arayla, uç 575 ms
- **Bildirim sonucu kayda geri yazılır:** `notify_team` ∈ `sent`/`failed`, `notify_lead` ∈ `sent`/`failed`/`skipped` (`skipped` = gönderilecek **geçerli** adres yoktu). Hiçbir v2 kaydı `pending` kalmaz — **karşılandı:** üç değerin üçü de gerçek depo hook'una yazılarak ölçüldü (TASK-2.07)
- Onay e-postası ziyaretçinin yanıtını **değiştirmez**: üç dalda da aynı `200` ve aynı gövde alanları; başarısızlık yalnız `notify_lead`'e düşer

**Bağımlılık:** F3.2

**Edge Case'ler:**
- `DEMO_FROM` alan adı doğrulanmamışsa sağlayıcı reddeder — alan adı geçişi öncesi doğrulama M7'de

---

## Teknik Notlar

- Tasarım gerekçesi v1 denetiminden: tek e-posta sağlayıcısına bağlı uç anahtar yokken her talebi hataya çevirip lead kaybetti; talebin kalıcı kaydı yoktu. Bu yüzden sıra: dayanıklı kayıt → e-posta → dürüst hata.
- Ayarlar `.env.example`; `runtime = "nodejs"`, `dynamic = "force-dynamic"`.
