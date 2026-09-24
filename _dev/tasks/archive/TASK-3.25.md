# TASK-3.25: Form hata verdiğinde açılan WhatsApp bağlantısı yazılanları taşır

**Durum:** ✅ Tamamlandı
**Modül:** M3 — Lead Hattı (modules/M3-Lead-Hatti.md)
**Feature:** F3.1 Demo formu ve talep ucu
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.16 ✅

---

## Hedef

Demo formu hedefe yazamayıp 503 döndüğünde kullanıcı WhatsApp'a yönlendiriliyor — ama **az önce yazdığı her şeyi elle yeniden yazmak zorunda**. Bağlantı `?text=` parametresiyle açıldığında mesaj kutusu ad, kulüp ve telefonla önceden dolu gelir. Huninin en kritik kurtarma noktası budur: form düştüğünde talebin kaybolmadığı tek yol.

Değişiklik **yalnız bu kurtarma bağlantısını** kapsar; sitedeki diğer WhatsApp bağlantıları bugünkü hâlinde kalır.

---

## Bağlam

B-022'nin ikincil önerisi. Kapsam tartışmasında (PHASE-3) *"aynı işte ucuz olduğu için kapsamda kalır"* denerek B-022'nin ana kalemiyle (mobilde ilk ekran) birlikte alınmıştı; `verify-plan` (2026-09-23) ikisini ayırdı: bu kalem **ayrı bir modülün** (M3 lead hattı) işi, ayrı dosyaya dokunuyor ve kişisel veriyi bağlantı adresine koyduğu için kendi çağrı-sitesi süpürmesini gerektiriyor. Ana kalem TASK-3.16'da kaldı.

Bugünkü davranış ölçüldü: `src/content/site.ts:21` → `https://wa.me/905359375955`, hiçbir yerde `?text=` yok. Bu adres sitede **12 dosyada** kullanılıyor (17 geçiş) — yani "tek kaynağa bir alan eklemek" burada sessizce on iki yüzeyi birden değiştirebilir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md` — ikincil öneri ve gerekçesi
- `_dev/modules/M3-Lead-Hatti.md` — F3.1: 503 akışı ve WhatsApp yedeğinin bugünkü davranışı
- `_dev/memory/tek-kaynak-atlayan-cagri-sitesi-supurmesi.md` — tek kaynak tanıtan task kapanışta çağrı sitelerini süpürür
- `_dev/docs/CLAIMS.md` — `CONTACT` tek kaynak kuralı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M3-Lead-Hatti.md` — F3.1'in 503 akışına kurtarma bağlantısının yazılanları taşıdığı kriteri

---

## Alt Görevler

- [x] **1. Ön-doldurulmuş adresi tek kaynakta üret**
  - Çapa: `src/content/site.ts` → `CONTACT.whatsapp` (⚠️ `grep -n "wa.me"` ile yeniden konumlan)
  - Taban `href` **değişmez**; yanına girdilerden adres üreten bir yardımcı eklenir (metin `src/content/`'te kurulur, bileşende değil — CLAUDE.md → Kod kuralları)
  - Mesaj gövdesi yalnız kullanıcının **kendi girdiği** alanlardan kurulur: ad, kulüp, telefon. Serbest mesaj alanı ve e-posta dâhil edilmez

- [x] **2. Yalnız 503 kurtarma bağlantısına bağla**
  - Çapa: `src/components/sections/DemoForm.tsx` — hedef yokken gösterilen WhatsApp yolu
  - Boş formda ya da alanlar boşken `?text=` eklenmez; bağlantı bugünkü sade hâline düşer

- [x] **3. Kalan çağrı sitelerini süpür**
  - `src/`'te `wa.me` geçen 12 dosya taranır; hiçbirinin ön-doldurma almadığı doğrulanır
  - Tıklama sayacı bağlantıyı `href.startsWith("https://wa.me")` ile tanıyor (`ClickTracker.tsx`) — sorgu eklenince eşleşme bozulmamalı, doğrula

- [x] **4. Kişisel verinin nereye gitmediğini doğrula**
  - Adres yalnız kullanıcının kendi cihazında açılan bağlantıda durur; ölçüme (Umami) ve kayda gitmez
  - Sayaç bugün yalnız yüzey adı gönderiyor (`track(EVENTS.whatsapp, surface)`) — bu davranış korunur, adres olaya **girmez**

---

## Etkilenen Dosyalar

```
src/content/site.ts                     # ön-doldurulmuş adresi üreten yardımcı (taban href değişmez)
src/components/sections/DemoForm.tsx    # 503 kurtarma bağlantısı yardımcıyı çağırır
```

---

## Dikkat Noktaları

- **Taban `href`'i değiştirme.** `CONTACT.whatsapp.href` 12 dosyada kullanılıyor; oraya `?text=` koymak sitedeki her WhatsApp bağlantısına — Header, Footer, Hero, SSS, 404, asistan — boş ya da yanlış bir ön-doldurma taşır. Ön-doldurma **çağrı yerinde** kurulur.
- **Kişisel veri adres satırına giriyor.** Sınır dar tutulur: yalnız kullanıcının kendi girdiği ad, kulüp ve telefon; serbest mesaj metni ve e-posta **girmez**. Adres kullanıcının kendi cihazında açılır, sunucuya ve ölçüme gitmez.
- **Yasal beyan kapısı `src/`'i tarıyor.** `tests/legal-consistency.test.ts` → dal 5 `src/` içindeki dış adres kümesini **dondurulmuş bir listeye** karşı sınıyor ve `wa.me` o listede; host değişmediği sürece kapı yeşil kalır, ama değişiklik sonrası batarya koşulmadan kapanma.
- **Sayaç desenini bozma.** `ClickTracker.tsx` `href.startsWith("https://wa.me")` ile eşleşiyor — sorgu parametresi bu deseni bozmaz, ama bağlantı başka bir biçimde kurulursa (örn. `api.whatsapp.com`) WhatsApp tıklamaları sessizce sayılmaz olur.
- **Metin `src/content/`'te kalır** — mesaj şablonu bileşende yazılmaz.
- **Gerçek telefonda deneme** faz sonundaki tura kalır — `kanal: UAT`.

---

## Test Kriterleri

- [x] Form 503 aldığında açılan WhatsApp bağlantısı kullanıcının girdiği ad/kulüp/telefonu taşıyor (yerel olarak, hedefsiz üretim konteynerine karşı denendi — `503 no-sink` hâli `memory/alternatif-env-ile-uretim-derlemesi.md`)
- [x] Alanlar boşken bağlantı `?text=` **taşımıyor** (boş şablon gönderilmiyor)
- [x] Serbest mesaj alanı ve e-posta adrese **girmiyor** (adres gözle okundu)
- [x] Kalan WhatsApp çağrı siteleri ön-doldurma almıyor: `src/`'te `wa.me` geçen 12 dosya grep'lendi, yalnız kurtarma bağlantısı `?text=` taşıyor
- [x] WhatsApp tıklama olayı hâlâ sayılıyor ve olayda **yalnız yüzey adı** var, adres yok (sayacın gönderdiği yük gözlendi)
- [x] `docker compose exec web npm test` geçiyor — `src/` taranıyor ve dış adres kümesi dondurulmuş listeyle birebir kalıyor
- [ ] Gerçek telefonda kurtarma yolu denendi — `kanal: UAT`
- [x] Beş ölçüm regresyon çizgisini koruyor

---

## Risk ve Geri Dönüş Planı

- **Risk:** ön-doldurma tek kaynağın tabanına yazılırsa 12 dosyadaki bağlantı sessizce değişir → alt görev 3'ün süpürmesi bunu yakalar; süpürme kapanış koşuludur, isteğe bağlı değil.
- **Rollback:** iki dosya; dosya bazlı geri alınır (ağaç-geneli komut kullanılmaz).

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı — **gerçek telefon ayağı hariç (`kanal: UAT`)**
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 — ön-doldurulmuş adres tek kaynakta.** `src/content/site.ts`'e `whatsappDraftHref(values)` + `WHATSAPP_DRAFT_FIELDS` + giriş cümlesi eklendi. Taban `CONTACT.whatsapp.href` **hiç değişmedi** (ölçüldü: sorgusuz, `https://wa.me/905359375955`). Mesaj metni `src/content/`'te, bileşende değil.
- **Alt görev 2 — yalnız 503'e bağlandı.** `DemoForm.tsx`'e `recoveryHref` durumu kondu; varsayılanı taban adres, yalnız uç `code === "no-sink"` döndüğünde ön-doldurulmuş sürüme yükseliyor. Hata kutusundaki bağlantı (`#demo-form-error` içindeki `<a>`) bu durumu okuyor. **7 senaryo × 2 genişlik = 14 kombinde ölçüldü:** `?text=` yalnız iki `no-sink` senaryosunda var; `missing` · `bad-contact` · `rate-limited` · ağ hatası · boş-alanlı `no-sink` beşinde de bağlantı sade kaldı.
- **Alt görev 3 — kalan çağrı siteleri süpürüldü.** `?text=` üreten tek yer `src/content/site.ts:86`. `CONTACT.whatsapp.href` 11 dosyada 18 kez geçiyor (3'ü site.ts'in kendi içinde), tek kaynağı **atlayan** tek yazım `global-error.tsx:80` — bugünkü hâlinde, ön-doldurma almıyor (zaten Gelen Kutusu'nda açık kalem). Sayaç deseni (`href.startsWith("https://wa.me")`) sorgudan etkilenmiyor: tıklama ölçüldü, 14 kombinin 14'ünde olay gitti.
- **Alt görev 4 — kişisel verinin nereye gitmediği doğrulandı.** Tıklama olayının yükü 14 kombinde de `{"surface":"demo-form"}` — adres yok. `track()` imzası zaten yalnız olay adı + yüzey alıyor (yasal kapı dal 2 bunu ayrıca çiviliyor).
- **Kapı yazıldı:** `tests/whatsapp-draft.test.ts` (9 test). Alan kümesini elle saymıyor — fonksiyona **tüm form kaydı** veriliyor ve çıktıda ne çıktığı ölçülüyor.

**Sorunlar:**
- **Hata kutusu hiçbir kapının görüş alanında değil**: `a11y.mjs` formu doldurmadığı için kutu DOM'a hiç girmiyor, `font-guard.mjs` de `body.innerText` okuduğu için görmüyor. Çözüm: kapının **kendi kütüphanesi** (`research/lib/piksel-kontrast.mjs`) elle koşuldu — kutu 503 hâline getirilip üç genişlikte ölçüldü.
- Elle koşumun tek adımlık kapsamı `/demo` @1440'ta ilgisiz bir paragrafta `p02 3,21` gösterdi; kapının kendisi (`ROTALAR=/demo`, 3 ekran adımı) aynı yapıda **0 ihlal** basıyor. Sebep: tek adımda paragraf ekrana tam sığmıyor ve kütüphane `kismiOranlar`a düşüyor (kötümser). Regresyon değil, ölçüm kapsamı artefaktı — kayda geçti.

**Kararlar:**
- **Ön-doldurma yalnız `no-sink` (503) hâline bağlandı; `rate-limited`, ağ hatası ve doğrulama hataları dışarıda.** Gerekçe: `no-sink` talebin **hiçbir hedefe yazılamadığı** hâldir, yani yazılanlar gerçekten kaybolur. Doğrulama hatalarında veri kaybolmaz (alan düzeltilip yeniden gönderilir); `rate-limited` ve ağ hatasında form dolu kalır ve tekrar denemek işler. Kapsamı genişletmek hiçbir şey kurtarmadan kişisel veriyi üçüncü tarafın adres satırına taşırdı. Task dokümanının adı da (`Form 503 verdiğinde…`) bu dar okumayı söylüyor.
- **Görünür etiket değişmedi** ("WhatsApp'tan yazın"). Gerekçe: yeni görünür metin, iki kapının da göremediği bir yüzeye (yalnız 503'te çizilen kutu) yeni bir kontrast/font borcu eklerdi; ön-doldurma zaten sessiz bir kolaylık, söz vermeye gerek yok.
- **`legal.ts`'e dokunulmadı — ve gerekçesi ölçüldü** (M3 F3.2'nin "neyin değiştiği ya da **neden değişmediği** yazılır" kriteri). Ölçüm aşağıda; yeni bir aktarım cümlesi yazmak ölçülmemiş bir hukuki nitelendirme olurdu (B-008: aktarımın hukuki dayanağı hukukçunun). Kayıt `BULGULAR.md` → Gelen Kutusu'na düştü.
- docs/DECISIONS.md'ye eklendi: **Hayır** — mekanizma geri alınabilir ve geriye sözleşme/şema bırakmıyor; kapsam kararı task dokümanında ve kodun kendi yorumunda duruyor.

**Kalan İşler:**
- Gerçek telefonda kurtarma yolunun denenmesi — `kanal: UAT` (faz sonundaki gerçek cihaz turu).
- **Yasal metin kararı kullanıcıya açık** (aşağıdaki ölçüm).

**Dosya Değişiklikleri:**
- `src/content/site.ts` → `WHATSAPP_DRAFT_FIELDS`, `whatsappDraftHref()`, giriş cümlesi ve alan tavanı (120 karakter) eklendi; `CONTACT` ve tabana **dokunulmadı**.
- `src/components/sections/DemoForm.tsx` → `recoveryHref` durumu; gönderim başında tabana düşüyor, `no-sink`'te ön-doldurulmuşa yükseliyor; hata kutusundaki `<a href>` bu durumu okuyor.
- `tests/whatsapp-draft.test.ts` → **yeni** (9 test).

**Test Sonuçları:**

<!-- Ölçüm kimliğiyle: hedef yayın kopyası (3100), hareket azaltma açık; gerçek cihaz kapsam dışı. -->

- **3100 tazelendi ve pozitif + negatif kontrolle doğrulandı:** `lastmod` 19:03:11.483Z → **19:40:55.134Z**; pozitif — `/demo` paketinde yeni dize `Bilgilerim:` **1** (HEAD kaynağında `git show 54e036c:src/content/site.ts | grep -c Bilgilerim` = **0**), `no-sink` dalı pakette **1**; negatif taraf — T16'nın `scrollY>120` eşiği **1**, `/demo`'da `>Demo<` **2**, `/`'de `sm:whitespace-nowrap` **17** (üçü de dokunulmadı).
- **Negatif kontrol (düzeltmeden ÖNCE, aynı hedefte, aynı betik):** 7 senaryo × 2 genişlik = **14/14 kombinde `?text=` YOK**, href sade `https://wa.me/905359375955`; kutu **140×17 px**; yapışkan çakışma **0**; olay `{"surface":"demo-form"}`.
- **Sonra:** aynı 14 kombin → `?text=` **yalnız 4'ünde** (gerçek 503 @320, @390 + taklit `no-sink` @320, @390). Çözülen gövde: `Merhaba, siteden demo talebi göndermek istedim ama form gönderilemedi. Bilgilerim: / Ad: … / Kulüp: … / Telefon: …`. **E-posta ve serbest mesaj adreste YOK** (gözle okundu + kapı ölçüyor). İki ardışık koşum **birebir** aynı çıktı (belirlenimlilik).
- **Gerçek uç ayağı:** 3100 hedefsiz (`LEAD_STORE_URL`/`LEAD_STORE_TOKEN`/`LEAD_FILE_PATH`/`RESEND_API_KEY`/`DEMO_TO`/`IP_HASH_SALT` altısı da **BOŞ** — ölçüldü), `POST /api/demo` **503 `no-sink`**. Tarayıcı turu kendi `X-Forwarded-For`unu taşıdı; kalan altı senaryo `page.route` ile taklit edildi — kota sayılmadı, canlı depoya kayıt yazılmadı.
- **Ürettiğim kapı sınandı (3 sonda, üçü de geri alındı ve `git diff` ile doğrulandı):** (1) **bozuk girdi** — `WHATSAPP_DRAFT_FIELDS`'e `email` + `message` sızdırıldı → **3 test kırmızı** (sızıntı, küme, boş-form dalı); (2) **boş kapsam** — `src/` yürüyüşü boş bir dizine çevrildi → dosya **fırlattı** (`kapsam bos`), "no tests" — sessiz yeşil yok; (3) **süpürme** — ikinci bir dosyaya `?text=` kondu → tek-yer dalı **kırmızı**.
- **Kontrast (iki kapının da görüş alanı dışı, kapının KENDİ piksel kütüphanesiyle elle ölçüldü, 320/390/1440):** hata metni 14px/400 **p02 4,96** (min 4,96 · med 4,96) · **kurtarma bağlantısı 14px/600 p02 4,96** · yandaki büyük düğme 16px/700 **p02 7,08** — gereken 4,5; üç genişlikte de birebir. **Font kapsaması sorusu düşüyor:** yeni görünür metin **yok**, taslak gövdesi `href` özniteliğinde durur ve `body.innerText`'e hiç girmez; `font-guard` **85.129 karakter / çıkış 0** (değişmedi).
- **Yapışkan katmanla çakışma:** kurtarma bağlantısı ↔ her görünür `fixed`/`sticky` katman → **0 çakışma**, 14 kombinin 14'ünde (bağlantı her seferinde ekran içinde).
- **Dokunma hedefi:** yeni hedef **eklenmedi**; mevcut satır-içi bağlantı önce de sonra da **140×17 px** (eşik altı). Kapı bu kutuyu hiç çizmediği için 250'ye girmiyor — TASK-3.17'nin 19'luk listesi de oynamadı.
- **Görünüş (DOM'da `href` geri alınarak, T13'ten beri kullanılan yöntem):** hata kutusu @320 **0 / 22.736 piksel**, @390 **0 / 22.348 piksel** fark; pozitif çapa — iki karenin href'i gerçekten farklıydı.
- **B-065 (JS kapalı GET düşüşü) — kötüleşmedi, iyileşmedi:** `<form>` etiketi HEAD ile **birebir** (`diff` boş; hâlâ `action`/`method` yok). JS kapalıyken gönderim `/demo?website=&name=Ay%C5%9Fe+Y%C4%B1lmaz&club=%C3%96rnek+Pilates+St%C3%BCdyo&phone=0555+111+22+33&…` GET'ine düşüyor, ekranda hata/başarı kutusu **yok** — 320 ve 390'da aynı. Bu turun tamamı JS yolunda (React durumu + olay işleyicisi) yaşıyor, JS kapalıyken hiç koşmuyor.
- **Kapılar:** `mobile-audit.mjs` 3100'e karşı 2 genişlik × 16 rota · 55 sn · `TOPLAM SORUN` **250**, çıkış **1** — T16'nın 54e036c'deki kaydıyla birebir. **Kova sızıntısı yok:** 6322 eleman · 2054 metin elemanı (taban 2054) · 638 dokunma hedefi · 5 kaydırılabilir kap · kritik hedef **305 ölçüldü / 125 eşik altı / 19 benzersiz** (taban 305) · gezinme 333/261 · kırpma 0 · şerit 0 · muafiyet kovaları (görsel gizli 0 · hareketli şerit 18 · kaydırılabilir 38 · dikey 0) birebir. **Hiçbir kapsam tabanı değişmedi** — bu tur ne eleman ne metin ekledi.
- `a11y.mjs` **6**, çıkış 1 — 16 rota / 105 adım / 1834 eleman / gradyan 19 (taban 19) / başlık 316 (taban 316), hepsi birebir.
- `perf.mjs` `/` masaüstü **141 KB / LCP 80 ms / CLS 0,005**, mobil **132 KB / LCP 60 ms / CLS 0** (M6 çizgisi 144 KB / 96 ms — altında).
- `scan.mjs` `/demo` @320 (6 kare) · `/demo` @390 (6 kare) · `/` @390 (20 kare) → **üçü de konsol temiz**.
- `npm test` **219 geçti + 2 atlandı** (önce 210 + 2; fark bu turun 9 yeni testi). `tsc --noEmit` **0**. `lint` **30 problem** — T16'nın kaydıyla aynı sayı, **yeni yok** (DemoForm'un iki kalemi HEAD'den gelen `WhatsApp'tan` kesme işaretleri, satır numaraları kaydı).
- **⚠️ Yasal metin ölçümü — karşılığı YOK (bildirim, düzeltme değil):** `legal.ts`'te "WhatsApp" **tam 1 kez** geçiyor ve o da `CONTACT.whatsapp.display`, yani **telefon numarası**, "Veri sorumlusu → İletişim" satırında. KVKK → Aktarım'ın tedarikçi listesi **dört kalem** (Vercel · Hetzner · Resend · Google Workspace) — WhatsApp/Meta yok; listenin hemen üstündeki cümle ise **koşulsuz olumsuz** bir beyan: *"…aşağıda saydığımız tedarikçiler dışında hiç kimseye veri gitmez."* "Yurt dışına aktarım" paragrafı da tam üç ayak sayıyor (ABD form ucu → Almanya sunucu → ABD e-posta). `wa.me` bir Meta yönlendiricisidir: bağlantıya tıklandığı anda sorgu (ad + kulüp + telefon) **mesaj gönderilmeden önce** Meta'nın sunucusuna gider. Hâlâ **doğru** kalan beyanlar da ölçüldü: "adres satırında soru işaretinden sonra gelen kısım ölçüme hiç gönderilmez" ve "Adınız, telefon numaranız… ölçüme gönderilmez" (olay yükü yalnız `surface`), "pazarlama amacıyla üçüncü taraflara satılmaz veya devredilmez". Karar kullanıcınındır (`legal.ts` başlığı: yayına çıkmadan önce hukuk danışmanı gözden geçirir; B-008).

**Kapsam:** yayın kopyası (3100), `reducedMotion: reduce`, 320/390 (kontrast ayrıca 1440); gerçek cihaz **kapsam dışı → `kanal: UAT`**; yasal nitelendirme **kapsam dışı → kullanıcı/hukukçu**.

---

**Oluşturulma:** 2026-09-23
