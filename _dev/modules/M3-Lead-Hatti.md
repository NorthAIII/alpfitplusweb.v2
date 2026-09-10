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

**Açıklama:** `LEAD_WEBHOOK_URL` (JSON POST) veya `LEAD_FILE_PATH` (JSONL) yayın ortamında tanımlanır ve gerçek bir talep kayda düşer. Bugün ikisi de tanımsız; talep kaydedilmiyor. "Önizleme yayını, lead hattı ve analitik" faz konusunun parçası.

**Kabul Kriterleri:**
- Önizleme ortamından gönderilen gerçek bir demo talebi hedefte (webhook alıcısı veya dosya) görünür
- Webhook düşerse (5xx, zaman aşımı ya da sözleşme dışı yanıt) uç e-postaya geçmeden önce hatayı loglar; kayıt **ve** e-posta birlikte düşerse 503 döner ve form kullanıcıya WhatsApp yolunu gösterir
- Sır değerleri repoda yok; `.env.example` yalnız anahtar adlarını taşır

**Bağımlılık:** M7 F7.3 (Vercel projesi ve env)

**Edge Case'ler:**
- Vercel'de kalıcı disk yok — `LEAD_FILE_PATH` orada çalışmaz; hedef webhook olmalı (Google Apps Script, n8n, Make veya kendi ucu). Seçim discuss-phase'de kullanıcıya sorulur
- Webhook alıcısı KVKK açısından kişisel veri tutar; yasal metinle tutarlı olmalı (M1 `legal.ts`)

---

### F3.3: E-posta bildirimi → Phase 1

**Açıklama:** `RESEND_API_KEY` ile `DEMO_TO`'ya bildirim. İkincil; tek başına yeterli sayılır ama tercih edilmez. Aynı faz konusunda.

**Kabul Kriterleri:**
- Gerçek talep `DEMO_TO` adresine e-posta olarak gelir; gövde tüm alanları taşır
- E-posta başarısız olsa bile dayanıklı kayıt yazıldıysa uç 200 döner

**Bağımlılık:** F3.2

**Edge Case'ler:**
- `DEMO_FROM` alan adı doğrulanmamışsa sağlayıcı reddeder — alan adı geçişi öncesi doğrulama M7'de

---

## Teknik Notlar

- Tasarım gerekçesi v1 denetiminden: tek e-posta sağlayıcısına bağlı uç anahtar yokken her talebi hataya çevirip lead kaybetti; talebin kalıcı kaydı yoktu. Bu yüzden sıra: dayanıklı kayıt → e-posta → dürüst hata.
- Ayarlar `.env.example`; `runtime = "nodejs"`, `dynamic = "force-dynamic"`.
