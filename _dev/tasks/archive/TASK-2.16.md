# TASK-2.16: Yasal metinde işlenen veri gerçeği ve form onayının kapsamı (B-024 k.1, k.3, k.4)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M3 lead hattının gerçeği
**Feature:** F1.1 (yasal içerik) · M2 F2.2 (yasal sayfalar)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.07 önerilir (onay e-postası açıldıktan sonra onay metni son hâliyle yazılır)

---

## Hedef

Yasal metinlerin **işlenen veri** anlatımını ölçülmüş gerçeğe hizalamak ve form onay metninin kapsamını gerçekten işlenen alanlara genişletmek. Bugün üç yönde ayrışma var: IP ve `ip_hash` hiçbir metinde geçmiyor (oysa `ip_hash` depo gövdesine yazılıyor ve **12 ay** saklanıyor), "tarayıcı bilgisi" **fazlasını** söylüyor (artık hiçbir kalıcı kayda girmiyor), Gizlilik'in topladığı-veri listesi KVKK'nınkiyle ayrışık.

Task, üç kalem de metinde düzeldiğinde ve form onayı işlenen kategorileri kapsadığında tamamlanmış sayılır.

---

## Bağlam

Ölçülmüş hâl (audit-product 2026-09-22, `legal.ts` 315 satır kalem kalem okundu):

- **(1) IP / `ip_hash` — açık ve ağırlaşmış.** KVKK'nın işlenen-veri listesi (`legal.ts:59-63`) IP'yi saymıyor. Ama `route.ts:149` `ip_hash: hashIp(ip, salt)` **depo gövdesine yazıyor** ve kayıt 12 ay saklanıyor. IP'den türetilmiş kalıcı bir tanımlayıcı, metinde hiç anılmadan bir yıl saklanıyor. Ayrıca hız sınırı için ham IP on dakika bellekte tutuluyor.
- **(3) Ters yön de kırık.** `legal.ts:63` "tarayıcı bilgisi"ni işlenen veri sayıyor; `route.ts:139` yorumu *"env/ua/consent/at gövdeye GİRMEZ"* diyor, e-posta gövdesi de `ua` taşımıyor. `ua` yalnız `LEAD_FILE_PATH` yolunda kalıcılaşıyor, o da yayında tanımlı değil. **Liste fazlasını söylüyor.** Gizlilik'in topladığı-veri listesi (`legal.ts:182-185`) ise "işlem güvenliği verisi" satırını hiç taşımıyor — iki metin ayrışık.
- **(4) Onay kapsamı — hiç dokunulmamış.** `DemoForm.tsx:211-212` hâlâ yalnız *"İletişim bilgilerimin…"* diyor; uç ayrıca `club`, `branches`, `segment`, `message`, `at`, `env` ve `ip_hash` işliyor.

**Bu task'ın dışında kalanlar:** ölçüm (Umami/nginx) beyanları ve yurt dışı aktarım olgusu → TASK-2.17. Yurt dışı aktarımın **hukuki dayanağı** → hukukçu (B-008), bu fazda uydurulmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` — dört kalem, ölçümler, TASK-1.15'in kapattıkları
- `src/app/api/demo/route.ts` — gerçek akış (neyin gövdeye girdiği, neyin girmediği)
- `src/content/legal.ts` — KVKK aydınlatma + Gizlilik + kullanım koşulları
- `src/components/sections/DemoForm.tsx:200-215` — onay metni
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 edge case: "depo KVKK açısından kişisel veri tutar (12 ay saklama); yasal metinle tutarlı olmalı"

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/bulgular/B-024-*.md` — üç kalemin Çözüm Kaydı; atom **TASK-2.17'den sonra** kapanır (hukuki dayanak ayağı hukukçuda kalır ve bu ayrım kayda yazılır)
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 — "yeni hedef/alan → yasal metin gözden geçirildi" kriteri (bulgunun kalıcı koruma önerisi)

---

## Alt Görevler

- [x] **1. IP ve `ip_hash`'i metne yaz**
  - KVKK aydınlatmasının işlenen-veri listesine: hız sınırı için kısa süreli ham IP (amaç + süre) ve kayda giren **IP özeti** (`ip_hash`) + 12 ay saklama
  - Anlatım **olgu** düzeyinde kalır; uydurma süre ya da uydurma hukuki sebep yazılmaz

- [x] **2. "Tarayıcı bilgisi" fazlasını düzelt ve iki listeyi hizala**
  - `ua` kalıcı kayda girmiyorsa listeden çıkar ya da gerçekten girdiği yol (`LEAD_FILE_PATH`, yayında tanımsız) koşuluyla anlatılır
  - Gizlilik'in topladığı-veri listesi KVKK'nınkiyle aynı kategorileri sayar; **iki metin birbirini kesmez**

- [x] **3. Form onay metninin kapsamı**
  - Onay, gerçekten işlenen kategorileri kapsar: iletişim bilgileri + kulüp/şube/tip + mesaj + işlem güvenliği verisi
  - Metin kısa ve okunur kalır; `docs/STYLE-GUIDE.md` tonu korunur, hukuk jargonuna kaçmaz
  - TASK-2.07'nin onay e-postasıyla tutarlı (iletişim zaten onaylanmış bir amaç)

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts                          # KVKK + Gizlilik listeleri — zaten var
src/components/sections/
└── DemoForm.tsx                      # onay metni — zaten var
```

---

## Dikkat Noktaları

- **Metin koddan sonra yazılır, tersi değil.** Her cümle `route.ts`'in gerçek davranışına karşı doğrulanır; "olması gereken"i değil **olanı** anlatır (`legal.ts:8-11`'in kendi beyanı).
- **Hukuki sebep ve yurt dışı dayanağı bu task'ta yok** — hukukçunun işi (B-008). Faz metnin **olgu** tarafını yazar.
- **Onay metni uzarsa form dönüşümü etkilenir** (`ILKELER.md` → 1. eksen Dönüşüm): kısa ve anlaşılır tut; uzun hukuk metni linkte durur.
- **Mobil yerleşim:** onay metni uzarsa 320 px'te satır kırılması ve dokunma hedefi yeniden ölçülür (`mobile-audit.mjs`) — TASK-2.05/2.06'nın düzelttiği yüzeyle aynı form.
- **Font kümesi:** yeni karakter girerse `font-guard.mjs` yakalar.
- **B-060 bu metinleri çivileyecek** (TASK-2.18) — metin son hâlini almadan test yazılmaz; sıra bilinçli.

---

## Test Kriterleri

- [x] KVKK aydınlatmasının işlenen-veri listesi ham IP'yi (amaç + kısa süre) ve `ip_hash` + 12 ay saklamayı **anlatıyor**; cümleler `route.ts`'in davranışıyla satır satır eşleşiyor (eşleme tablosu dokümana)
- [x] "Tarayıcı bilgisi" kalemi gerçeğe uygun (çıkarıldı ya da koşuluyla anlatıldı); KVKK ve Gizlilik listeleri **aynı kategorileri** sayıyor
- [x] Form onay metni işlenen tüm kategorileri kapsıyor; `DemoForm`'un gönderdiği alanlarla karşılaştırma tablosu dokümanda
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `mobile-audit.mjs` yatay kaydırma: yok · `font-guard.mjs` kümede olmayan karakter yok
- [x] `scan.mjs` `/kvkk`, `/gizlilik` ve `/demo` konsol temiz
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [x] Hiçbir metinde uydurulmuş süre, sağlayıcı ya da hukuki dayanak yok (kalem kalem kontrol, dokümana)

---

## Risk ve Geri Dönüş Planı

- **Metin fazla teknikleşirse** ziyaretçi anlamaz ve form onayı dönüşümü düşürür → onay kısa kalır, ayrıntı KVKK sayfasında.
- **Rollback:** iki dosya, dosya bazlı geri alma yeterli; metin git history'de.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **IP ve `ip_hash` metne girdi (alt görev 1).** KVKK'nın işlenen-veri listesindeki "İşlem güvenliği verisi" kalemi artık *"talebin gönderildiği tarih ve saat ile IP adresinizden üretilen özet"* diyor; altına IP'nin **iki kullanımını** ayıran bir paragraf kondu — (a) on dakikalık pencerede talep sayan, yalnız geçici bellekte duran ve hiçbir kayda yazılmayan sayaç, (b) kayda giren, gizli anahtarla üretilen özet ve kaydın silinmesiyle birlikte silinmesi.
- **"Tarayıcı bilgisi" fazlası düzeltildi (alt görev 2).** Kalem listeden çıkarıldı; yerine kapsamı dar bir cümle geldi: bilgi talep işlenirken okunur ama **kayda yazılmaz ve bildirimde yer almaz**. Gizlilik'in topladığı-veri listesi KVKK'nınkiyle aynı kategorileri sayacak şekilde bir satır aldı (tarih, saat, IP özeti) + aynı tarayıcı-bilgisi cümlesinin kısa hâli ve KVKK'ya işaret.
- **İşleme amaçlarına iki kalem eklendi:** talebin alındığını e-posta ile bildirmek (TASK-2.07'nin onay e-postası) ve formun kötüye kullanımını önlemek (hız sınırı) — ikisi de işlenen verinin gerçek amacı, listede yoktu.
- **Saklama süresi maddesi onay e-postasını da sayıyor**, kopyaların nerede kaldığı alıcı bazında ayrıldı.
- **Form onayının kapsamı genişledi (alt görev 3).** Yeni metin: *"Aydınlatma metnini okudum. Formda verdiğim bilgilerin, talebin tarih ve saatiyle IP özetinin demo talebim için işlenmesine ve benimle iletişime geçilmesine izin veriyorum."*
- **Her iki belgenin `updated` damgası** 22 → 23 Eylül 2026.

**Sorunlar:**
- **Yazdığım bir beyan ölçümde yanlış çıktı ve düzeltildi.** İlk hâl *"Bu e-postaların kopyaları ekip posta kutumuzda ve … sağlayıcıda kalır"* diyordu; `route.ts` → `toLeadEmail` okunduğunda onay e-postasının **yalnız ziyaretçiye** gittiği, `reply_to`'nun ekip olduğu, yani ekip kutusuna **kopya düşmediği** görüldü. Cümle alıcı bazında ikiye ayrıldı.
- **İkinci fazla-söyleyen beyan yakalandı.** Gizlilik'e yazdığım *"Tarayıcınızın kendini tanıttığı bilgiyi kaydetmiyoruz"* kapsamsızdı — platform/altyapı logları bu turda **ölçülmedi** ve tam da B-024'ün Umami cümlesine yaptığı itiraz bu sınıftan. Cümle KVKK'daki gibi **talebin kaydına** daraltıldı.
- **Onay metninin ilk hâli fazla uzundu.** "İşlem güvenliği verilerinin (tarih, saat, IP özeti)" kalıbı 217 karakter tutuyor ve 320 px'te bloğu 5 → **7** satıra çıkarıyordu (ölçüldü). Dört aday tarayıcıda ölçülüp en kısası seçildi.

**Kararlar:**
- **Onay metninde "işlem güvenliği verisi" terimi kullanılmadı, üç kalem düz adıyla sayıldı.** Gerekçe ölçüm: terim 46 karakter ve 320 px'te bir satır daha götürüyor (217 krk / 7 satır ↔ 171 krk / 6 satır), karşılığında ziyaretçinin anlayabileceği bir şey eklemiyor — kategori adı zaten aynı cümledeki bağlantının ucundaki KVKK metninde duruyor. STYLE-GUIDE'ın jargon reddi ve QUALITY 8 (Dönüşüm) aynı yöne çekiyor. **docs/DECISIONS.md'ye eklendi: Hayır** (metin tercihi; geri dönüşü maliyetsiz, sözleşme/şema bırakmıyor).
- **Hiçbir süre, sağlayıcı adı ya da hukuki dayanak uydurulmadı.** Metne giren tek yeni süre "on dakika"dır ve `WINDOW_MS = 10 * 60 * 1000`'den gelir. "12 ay" zaten yazılıydı. Hukuki sebep bölümüne **dokunulmadı** — yeni amaç eklenmiş olsa da dayanağı hukukçunun işidir (B-008).
- **`ua` listeden çıkarıldı, koşullu anlatılmadı.** Task iki yol tanıyordu; ölçüm kesin çıktı (aşağıda), koşullu cümle ziyaretçiye olmayan bir ihtimali anlatırdı.
- **`notify_lead` alanı metne girmedi.** Ziyaretçinin verisi değil, bizim bildirim durumumuzun kaydı; "talep kayıtlarını tutmak" amacının içinde kalıyor. Yeni bir kategori açmak listeyi gerçekte olmayan bir veri türüyle şişirirdi.
- **`legal.ts:68` (yalnız gezen ziyaretçi) ve `:214` (Umami IP tutmaz) bilinçle bırakıldı** — ikisi de ölçüm hattının beyanı, evi TASK-2.17. Yazdığım cümleler **talep yoluna** daraltıldığı için çelişki üretmiyor.

**Dosya Değişiklikleri:**
- `src/content/legal.ts` → KVKK: işlenen-veri listesi kalemi, iki yeni paragraf (IP kullanımı + tarayıcı bilgisi), giriş cümlesi ("iletmiş olursunuz" → "işlenir", IP'yi ziyaretçi iletmiyor), amaç listesine iki kalem, saklama maddesine onay e-postası; PRIVACY: topladığımız-veri listesine bir satır, bir yeni paragraf, kullanım maddesine onay e-postası; iki belgenin `updated` damgası. Bölümün başına **ölçüm çapalarını** taşıyan yorum bloğu eklendi (TASK-2.18 bunları çivileyecek).
- `src/components/sections/DemoForm.tsx` → onay metni + kapsam kararını ve ölçüsünü yazan yorum.

**Test Sonuçları:**
- `npx tsc --noEmit` (`web` konteyneri) çıkış **0**. `npm test` **180 geçti + 1 atlandı** — taban 180+1 (TASK-2.15), **birebir**; bu task test eklemedi, sıra bilinçli (B-060 → TASK-2.18).
- **Üretim derlemesi:** `docker compose build web-prod` başarılı (imajın builder katmanı; `exec web npm run build` bilinçle kullanılmadı — `next_cache`'i ezer). İmaj yeniden ayağa kaldırıldı ve **tazeliği ölçüldü**: 3100'ün `/demo`'su yeni onay metnini, `/kvkk` yeni IP paragrafını, `/gizlilik` daraltılmış cümleyi döndürüyor.
- **Beş ölçüm:** `a11y` 8 rota **TOPLAM SORUN 0** · `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir) · `font-guard` 16 sayfa / **82.502** karakter (taban 81.118; metin büyüdü), kümede olmayan karakter **yok** · `scan` 390×844: `/kvkk` 8 kare, `/gizlilik` 6, `/demo` 6 — **üçünde de konsol temiz**.
- **Kapsam boşluğu ölçümle kapatıldı:** `/kvkk` ve `/gizlilik` `mobile-audit.mjs`'in rota listesinde **yok** (B-012). Değiştirdiğim üç sayfa ayrı bir sondayla **320/360/390/412** px'te ölçüldü: üçünde ve dört genişlikte de **yatay kaydırma yok**, `scrollWidth == clientWidth`. `/demo`'daki 3 "taşan" düğüm bal küpüdür (`left-[-9999px]`, `aria-hidden`) ve değişiklikten önce de vardı.
- **Onay bloğunun büyümesi kıyaslanarak ölçüldü — "önce" hatırlanmadı:** eski metin DOM'da geri konup yeniden ölçüldü (kaynak dosyaya dokunulmadı, geri yükleme doğrulandı). Karakter **138 → 171**; blok yüksekliği 320 px'te **114 → 137** px (5 → 6 satır), 360/390'da **91 → 114** (4 → 5), 412'de **91 → 91** (satır sayısı değişmedi). Satır yüksekliği 22,75 px.
- **Aday ölçümü (kararın dayanağı), 320 px:** eski 138 krk/5 satır · "işlem güvenliği verileri (…)" 217/7 · düz üç öğe 190/7 · seçilen 171/**6**.

**Eşleme tablosu — metin ↔ kod (test kriteri 1 ve 7):**

| Metindeki beyan | Çapa | Hâl |
|---|---|---|
| tarih ve saat | `route.ts` `lead.at` → ekip e-postası "Zaman:"; depo `created` autodate (v1 `pocketbase/README.md`) | doğrulandı |
| IP adresinizden üretilen özet | `route.ts` `hashIp()` = HMAC-SHA256(ip, `IP_HASH_SALT`), `toStore` gövdesinde `ip_hash` | **yeni** |
| on dakikalık pencerede sayan sayaç | `route.ts` `HITS` Map · `WINDOW_MS = 10*60*1000` · `LIMIT = 5` | **yeni** |
| sayaç yalnız geçici bellekte, kayda yazılmaz | `HITS` modül düzeyinde Map; `toStore` gövdesi, `toEmail`/`toLeadEmail` metinleri ve hiçbir `console.error` ham IP taşımıyor | **yeni** |
| özet aynı adresten gelen talepleri saymaya yarar | v1 `pocketbase/README.md` → `ip_hash` indeksi "hız sınırı sorgusu"; `429` = aynı `ip_hash` son 1 saatte 5 kayıt | **yeni** |
| kaydınız silindiğinde onunla birlikte silinir | `ip_hash` kaydın sütunu; `lead-retention` cron günlük 03:30 UTC, ölçüt `created < şimdi − 12 ay` | **yeni** |
| tarayıcı bilgisi kayda yazılmaz, bildirimde yer almaz | depo gövdesi beyaz listesi `ua` içermiyor (`route.ts` yorumu + gövde), iki e-posta metninde de yok; tek kalıcılaşma yolu `LEAD_FILE_PATH` ve o **yayında tanımsız** (ölçüldü 2026-09-23, `vercel env ls` → Production/Preview/Development'ta yok) | **düzeltme** (eskiden fazlasını söylüyordu) |
| geçerli adres verdiyseniz onay e-postası | `route.ts` `leadAddressable = isValidEmail(lead.email)`, `toLeadEmail` | **yeni** |
| onay e-postasının kopyası ekip kutusunda **değil** | `toLeadEmail` `to: [lead.email]`, `reply_to: team` | **yeni** |
| formun kötüye kullanımını önlemek | `limited(ip)` + deponun kendi `ip_hash` sayacı | **yeni** |

**Kapsam tablosu — form ne gönderiyor, onay ne kapsıyor (test kriteri 3):**

| Alan | Nereye gidiyor | Onay metni |
|---|---|---|
| `name` | depo · ekip e-postası · onay e-postasında hitap | "Formda verdiğim bilgiler" ✅ |
| `club` · `branches` · `segment` | depo (segment mesaj başında etiket) · ekip e-postası | ✅ |
| `phone` | depo · ekip e-postası | ✅ |
| `email` | depo · ekip e-postası (`reply_to`) · onay e-postasının **alıcısı** | ✅ + "benimle iletişime geçilmesine" |
| `message` | depo · ekip e-postası | ✅ |
| `at` | ekip e-postası; kayıtta `created` | "talebin tarih ve saati" ✅ **(yeni)** |
| ham IP → `ip_hash` | depo | "IP özeti" ✅ **(yeni)** |
| `consent` | ekip e-postası ("KVKK onayı") | onayın kendisi |
| `ua` | hiçbir kalıcı yere (yukarı bak) | kapsam gerekmiyor — kaydedilmiyor |
| `env` | ekip e-postası ("Ortam:") | ziyaretçinin verisi değil, dağıtım etiketi |
| `website` (bal küpü) | hiçbir yere — dolu gelirse uç erken `200` döner | — |

**Uydurma denetimi (test kriteri 7):** yeni metinde tek süre "on dakika" (`WINDOW_MS`), tek başka süre önceden yazılı "12 ay"; **sağlayıcı adı eklenmedi** (mevcut "e-postayı ileten sağlayıcı" adsız kaldı); **hukuki dayanak eklenmedi ve Hukuki sebep bölümüne dokunulmadı**.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-23

**Ne Yapıldı:**
- Yasal metinlerin işlenen-veri anlatımı ölçülmüş gerçeğe hizalandı: IP'nin iki kullanımı (bellekteki sayaç · kayda giren özet) ve 12 aylık ömrü yazıldı, karşılıksız kalan "tarayıcı bilgisi" kalemi düşürüldü, KVKK ve Gizlilik listeleri aynı kategorileri sayar hâle geldi, amaç listesi onay e-postasını ve hız sınırını kapsadı.
- Form onayı işlenen kategorileri kapsıyor; ölçülen bedeli 320 px'te tek satır.
- **B-024'ün 1., 3. ve 4. kalemi kapandı**; atom açık kalır — 2. kalemin yurt dışı yarısı TASK-2.17'de, hukuki dayanağı hukukçuda (B-008).

**Öğrenilenler:**
- **Yasal metinde "yerine yazdığın cümle de bir iddiadır" kuralı iki kez ateşledi.** Bu turda yazılan iki yeni beyan (onay e-postasının kopyası · tarayıcı bilgisi) ilk hâllerinde fazlasını söylüyordu ve ikisi de ancak **koda geri dönülünce** yakalandı. Kural memory'de (`memory/urun-iddiasi-capa-dogrulamasi.md`) ürün iddiası için yazılıydı; yasal metinde de birebir geçerli.
- **Metnin kapsamı cümlenin öznesinde saklanır.** "Kaydetmiyoruz" ile "talebinizin kaydına yazılmaz" arasındaki fark, ölçülen alan ile ölçülmeyen alan arasındaki farktır — B-024'ün Umami cümlesine itirazı tam olarak budur.

---

**Oluşturulma:** 2026-09-22
