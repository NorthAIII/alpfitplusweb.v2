# TASK-2.18: Yasal beyan testi — depo içindeki yedi olgu çivilenir (B-060)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M6 — Kalite Kapıları
**Feature:** F1.1 (yasal içerik) · M6 F6.4'ün öncülü
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.16 · TASK-2.17 (metin son hâlini almalı) · TASK-2.13, TASK-2.14 (görsel beyanın dayanağı)

---

## Hedef

Yayındaki yasal beyanların **depo içinden doğrulanabilen** olgularını bir test paketiyle çivilemek. Bugün `tests/` altında 6 dosya var ve hiçbiri `legal.ts`'e dokunmuyor (`grep` → **0 eşleşme**); her beyan tek bir satıra bağlı ve o satır düştüğü gün yayındaki metin **sessizce yalan** olur.

Task, yedi olgunun her biri için bir test dalı yazıldığında, dallar yeşil koştuğunda ve her dalın **sessizce geçmediği** (dayanak bulunamazsa kırıldığı) gösterildiğinde tamamlanmış sayılır. Sekizinci olgu — "12 ay" saklama — komşu depoda ve TASK-2.19'da.

---

## Bağlam

Araştırma sınıfı ölçtü: `legal.ts` satır satır okundu, koda/konfige bağlı **en az sekiz** olgu iddiası var — B-060'ın saydığı üçü + beş tane daha (`phases/PHASE-2.md` → Dikkat Edilecekler). Faz **sekizinin tamamını** bağlar (kullanıcı kararı); milestone'un "dört beyan" ifadesi bu yüzden **alt sınırdır**.

Bu task'ın kapsamı, depo içinden doğrulanabilen yedi olgu:

| # | Beyan | Dayanağının evi |
|---|---|---|
| 1 | "soru işaretinden sonrası ölçüme gitmez" | `src/app/layout.tsx:182` → `data-exclude-search="true"` |
| 2 | "adınız, telefonunuz, e-postanız ve mesajınız ölçüme gönderilmez" | `src/lib/analytics.ts` → `track()` yükü |
| 3 | "gerçek bir kişinin verisi gösterilmemektedir" | `research/lib/screen-cleanup-v2.mjs` temizlik + denetim dalları |
| 4 | "sitenin anahtarı yalnız yeni kayıt oluşturabilir, var olan kayıtları okuyamaz" + "dışarıya açık okuma kuralları kapalı" | `route.ts`'in depo kullanımı (yalnız `POST` + hedefli `PATCH`) |
| 5 | "ölçüm için üçüncü bir tarafa veri göndermiyoruz" | ölçüm ucunun kendi sunucumuz olması (`NEXT_PUBLIC_UMAMI_*`) |
| 6 | "çalışması için gerekli olmayan hiçbir çerez yerleştirmez" | `src/` içinde `cookie`/`localStorage`/`sessionStorage` kullanımının yokluğu |
| 7 | "otuz gün içinde sonuçlandırılır" — başvuru kanalı | `CONTACT.support` tek kaynağı (`site.ts:22`); adresin **posta alması** TASK-2.20'nin işi |

**v1'in şablonu hazır:** `../Alpfitplus-website.v1/tests/server/legal-consistency.spec.ts:36-49` metni kopyalamadan ilişkiyi doğruluyor ve regex kayarsa **sessizce geçmiyor, kırılıyor**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-060-yasal-beyani-koruyan-kapi-yok.md` — tablo, v1 şablonu, ölçüm
- `_dev/phases/PHASE-2.md` → Dikkat Edilecekler → "Üç yasal beyan da taban" (sekiz olgunun dökümü)
- `../Alpfitplus-website.v1/tests/server/legal-consistency.spec.ts` (salt okunur) — şablon
- `tests/api-demo.test.ts`, `tests/analytics.test.ts` — projenin test deseni
- `src/content/legal.ts` (TASK-2.16 ve 2.17 sonrası hâli)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/modules/M1-Icerik-ve-Iddia-Kaynagi.md` → Teknik Notlar — yasal metnin artık test kapısı var
- `_dev/bulgular/B-060-*.md` — yedi dalın Çözüm Kaydı; atom **TASK-2.19'da kapanır**

---

## Alt Görevler

- [x] **1. Test dosyasını kur**
  - `tests/legal-consistency.test.ts` — yedi olgu, yedi dal
  - Her dal **ilişkiyi** doğrular: metindeki iddia + koddaki dayanak birlikte okunur; metin kopyalanmaz

- [x] **2. Sessiz geçmeyi engelle**
  - Bir dalın dayanağı (öznitelik, sabit, dosya) bulunamazsa test **kırılır**, "eşleşme yok → geçti" olmaz
  - v1'in dersi bu: regex kayarsa sessizce geçen bir test, test değildir

- [x] **3. Her dalı negatif kontrolle sına**
  - Dayanak geçici olarak bozulduğunda (ör. `data-exclude-search` kaldırıldığında) ilgili dal **kırmızı** dönüyor
  - Yedi dalın yedisi için tek tek gösterilir; kontroller geri alınır

---

## Etkilenen Dosyalar

```
tests/
└── legal-consistency.test.ts      # YENİ — yedi olgu dalı
```

---

## Dikkat Noktaları

- **Metni kopyalama, ilişkiyi doğrula.** Testin içine yasal metnin tam cümlesini gömmek, metin her düzenlendiğinde testi kırar ve bakımcıyı testi gevşetmeye iter. v1'in yöntemi: dayanağı oku, metinle **eşleştir**.
- **Kapsam depo içidir.** "12 ay" dalı komşu depoya bağlı — TASK-2.19. Burada onu `skip` ile bırakma; o task kendi kapısını kurar.
- **Görsel beyan dalı (3)** TASK-2.13/2.14 sonrası anlamlıdır: temizlik tablosu ve denetim dalları yerindeyken doğrulanır. `web` konteyneri `research/`'ü görüyor (tüm depo bağlı), yani dosya okunabilir.
- **Başvuru adresi dalı (7)** yalnız **tek kaynak** disiplinini çiviler; adresin gerçekten posta aldığı DNS sorgusu gerektirir ve `npm test` ağ çağrısı yapmaz — MX kapısı M6 F6.3/F6.4'ün işidir (B-011 koruma önerisi). Bu sınır test dosyasının yorumuna yazılır.
- **Test `web` konteynerinde koşar** (`docker compose exec web npm test`), `environment: "node"`.
- **Ek bağımlılık yok** — Vitest 4 kurulu.

---

## Test Kriterleri

- [x] `tests/legal-consistency.test.ts` **sekiz** dal içeriyor; her dalın hangi beyanı hangi dayanağa bağladığı yorumda yazılı
- [x] `docker compose exec web npm test` yeşil; dosya sayısı **8 → 9** (task dokümanının "6 → 7"si bayattı), PASS **180 → 204**
- [x] **On iki negatif kontrol** koşuldu, on ikisi de kırmızı döndü (dayanak bozulduğunda ilgili dal kırılıyor) — kalem kalem dokümana
- [x] Hiçbir dal "eşleşme bulunamadı" durumunda sessizce geçmiyor (v1'in dersi; ayrıca bir kontrolle gösterilir)
- [x] Test yasal metnin tam cümlesini kopyalamıyor (ilişki doğrulaması)
- [x] Üretim derlemesi hatasız (`docker compose build web-prod`; `npm run build` `web` konteynerinde KOŞULMAZ — `next_cache` çakışması)

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
- `tests/legal-consistency.test.ts` açıldı — **sekiz dal, 24 test**. Her dal yayındaki bir cümleyi koddaki/konfigdeki bir olguya bağlar; metin **kopyalanmaz**, cümleden kısa ve ayırt edici bir parça alınıp o parçanın ilgili dokümanda **tam bir kez** geçtiği ölçülür (v1'in `legal-consistency.spec.ts` yöntemi).
- **Sekizinci dal task dokümanında yoktu, DURUM'un Not bloğundan geldi:** Vercel fonksiyon bölgesi cümlesinin (*"Washington, D.C. bölgesindeki sunucularında çalışır"*) depo içinden görülebilen yarısı — `vercel.json` ve `preferredRegion` **yokluğu**. Not bloğu 2.18/2.19'a sekiz olgu atıyor ve *"yalnız (1)'in yokluk yarısı ve (8) repo içinden görülür"* diyor; (1) task dokümanının yedisinde yoktu. Task dokümanı plan anında (2026-09-22) yazıldı, Not bloğu TASK-2.17'de (2026-09-23) — yenisi kazandı.
- Üç "boş kapsam bekçisi" testi eklendi: `src/` yürüyüşü dosya buldu mu · korpusta bilinen bir **nişan** dizesi (`data-exclude-search`) var mı · `claimOnce` helper'ı hem 0 hem >1 eşleşmede kırılıyor mu. Yokluğa dayanan üç dal (çerez, üçüncü taraf, bölge) bu bekçiyi ön koşul olarak ayrıca koşar.
- **On iki negatif kontrol** koşuldu (aşağıda tablo). Her biri bir dayanağı bozdu, ilgili dalın kırmızı döndüğü ölçüldü, dosya scratchpad kopyasından geri yüklendi ve geri yükleme **md5 ile doğrulandı**. Kırılmalar `git checkout`/`git restore` ile değil, yedekten `cp` ile geri alındı (yabancı oturum işi korunsun).

**Sorunlar:**
- **Dal 1 ilk sürümde yanlış kırmızı verdi:** `data-exclude-search="true"` dosya genelinde arandı ve **2** bulundu — biri gerçek öznitelik (`layout.tsx:182`), biri kendi JSDoc'undaki **yorum** (`:46`). Bir yorum, dayanak diye sayılacaktı. Çözüm: kapı artık `<Script …/>` etiketinin **içine** bakıyor; hem yorum yanıltmasını keser hem özniteliğin **doğru** script'te durduğunu ayrıca ölçer (`src={UMAMI_SCRIPT_SRC}` + tek `<Script>` kuralı).
- **Dal 4 ilk sürümü fail-open çıktı ve negatif kontrol yakaladı.** Depo çağrıları `url.startsWith(STORE_URL)` ile süzülüyordu; başka biçimde kurulmuş (göreli) bir okuma çağrısı süzgecin dışına düşüyor, kapı **yeşil** kalıyordu. Kapı artık istek boyunca yapılan **tüm** `fetch` çağrılarının `(yöntem, URL)` kümesini dondurulmuş listeyle karşılaştırıyor. İki biçim de (mutlak + göreli) ayrı ayrı kırmızı verdirildi.
- **Dal 2'nin ikinci ayağı da fail-open çıktı.** Desen `/window\s*\.\s*umami/` idi; araya bir TypeScript cast'i girince (`(window as unknown as {…}).umami?.track(…)`) iki jeton ayrışıyor ve desen kör kalıyordu — yani bir bileşen izleyiciyi doğrudan çağırıp yanına kişisel veri koyabilir, kapı görmezdi. Desen **çağrının kendisine** çevrildi (`/umami\s*\??\s*\.\s*track\s*\(/`); cast ve destructure biçimleri ayrı ayrı kırmızı verdirildi.
- **Negatif kontrol koşum düzeneğinin KENDİSİ bir tur fail-open koştu.** Çıktı ANSI kodları temizlenmeden grep'lendiği için hiçbir satır eşleşmedi ve ekrana **hiçbir şey** basılmadı — "hata yok" diye okunabilirdi. Düzeneğe pozitif çapa eklendi: vitest özet satırı her koşumda basılmalı, basılmazsa düzenek arıza verir.
- **Dal 3'ün sondası ilk sürümde tek örnekliydi** (`FORBIDDEN.parts[0]`) ve o değer **"Weekend"** çıktı — yani eski **marka** parçası, oysa dalın çivilediği cümle **gerçek kişi** verisi hakkında. Tek örnekli sonda hangi sınıfı ölçtüğünü seçemiyor; sonda **52 parçanın tamamına** ve ayrıca **13 avatar baş harfinin tamamına** genişletildi. Sarmalayıcı bilerek küçük harfli seçildi ki "iki büyük harfli sözcük" kalıp ayağı devreye girip tablo ayağının körlüğünü **örtmesin** (kontrol: kalıp ayağı bu sondada hiç tetiklenmiyor).

**Kararlar:**
- **Dal 4 beyanın yalnız ölçülebilen yarısını çiviliyor — bilinçli.** Yayındaki cümle iki şey söylüyor: (a) *"dışarıya açık okuma kuralları kapalıdır"*, (b) *"sitenin kullandığı anahtar yalnızca yeni kayıt oluşturabilir, var olan kayıtları okuyamaz"*. İkisi de **anahtarın/deponun yetkisi** hakkındadır ve o olgu komşu depoda yaşar (`../Alpfitplus-website.v1/pocketbase` → hook uçları + `List/View/Create/Update/Delete` kuralları). Bu depodan ölçülebilen tek şey **sitenin kendi kodunun okuma yapmadığı**dır ve dal tam onu çiviler. "Anahtar okuyamaz" ölçülmüş gibi bağlansaydı, devralınan bir beyan çivilenmiş olurdu — bu paketin tam da engellemek için var olduğu şey (memory → `urun-iddiasi-capa-dogrulamasi.md` 6. kural; brief'in TASK-2.19 uyarısı). Sınır dal 4'ün `ÖLÇÜLEMEYEN` yorum bloğunda yazılı.
- **Ölçüm sırasında yayındaki bir cümlenin DAR olduğu görüldü, düzeltme bu task'ta YAPILMADI.** Cümlenin *"yalnızca yeni kayıt oluşturabilir"* yarısı, ucun aynı anahtarla var olan kayda **PATCH** attığı gerçeğiyle örtüşmüyor (`route.ts` → `notifyStore`; v1 `pocketbase/README.md` token'ın **iki** ucu açtığını yazıyor: `POST /lead` + `PATCH /lead/{id}`). Yasal metin düzeltmesi bu task'ın "Etkilenen Dosyalar"ı dışında ve metin 2.16/2.17'de son hâlini almıştı → `BULGULAR.md` → Gelen Kutusu'na kaynak işaretli satır düşüldü (CLAUDE.md → "Gördüğün sorunu düşürme").
- **Dal 5 denylist değil allowlist kullanıyor.** Bilinen analitik sağlayıcılarını saymak fail-open olurdu (listede olmayan yeni sağlayıcı sessizce geçerdi); kapı `src/` içindeki **tüm** dış host kümesini dondurulmuş sekiz kalemle karşılaştırıyor. Yeni bir host girdiğinde kapı kırılır ve *"bu host ölçüm yapıyor mu?"* sorusu sorulur — v1'in "kapının kırılması soru sordurmak içindir" ilkesi.
- docs/DECISIONS.md'ye eklendi: **Hayır** — bu kararlar bir sözleşme/şema/ad bırakmıyor; geri dönüşü maliyetsiz test tasarımı tercihleri ve evleri bu oturum kaydı + kapının kendi yorumları.

**Kalan İşler:**
- "12 ay" saklama dalı (sekizinci olgu, çapraz depo) → **TASK-2.19**; B-060 atomu orada kapanır.

**Dosya Değişiklikleri:**
- `tests/legal-consistency.test.ts` → **YENİ**, 8 dal / 24 test. Kaynak dosyalarda **hiçbir** değişiklik yok: `git diff HEAD -- src/ research/` boş (negatif kontrol kırılmalarının tamamı geri alındı ve md5 ile doğrulandı).

**Test Sonuçları:**
- `docker compose exec web npm test` — **204 geçti + 1 atlandı** (taban 180 + 1; +24 yeni test, dosya 8 → 9). Atlanan hep aynı: `lead-store.contract` env kapısı (`LEAD_CONTRACT_URL` tanımsız).
- `docker compose exec web npx tsc --noEmit` — çıkış **0**. (`npx tsc` host'ta çalışmaz, TypeScript yalnız konteynerde.)
- Üretim derlemesi `docker compose build web-prod` — çıkış **0**.
- **Negatif kontrol tablosu — on iki kırılma, on iki kırmızı.** Her satır: kırılma → kırmızı dönen dal. Kırılma sonrası geri yükleme altı dosyanın da md5'iyle doğrulandı, `vercel.json` silindi, `git diff HEAD -- src/ research/` boş kaldı.

  | # | Bozulan dayanak | Kırmızı dönen dal |
  |---|---|---|
  | 1 | `layout.tsx`'ten `data-exclude-search="true"` özniteliği kaldırıldı | dal 1 |
  | 2 | `track()` yüküne ikinci alan eklendi (`{ surface, sonda }`) | dal 2 (davranış) |
  | 3a | `auditTexts` tablo/ad ayağı devre dışı (`if (false && …)`) | dal 3 (52 parça sondası) |
  | 3b | `auditTexts` avatar baş harfi ayağı devre dışı | dal 3 (13 jeton sondası) |
  | 4 | Uca **mutlak** URL'li depo okuması eklendi (`GET …/lead?limit=1`) | dal 4 |
  | 4b | Uca **göreli** URL'li depo okuması eklendi (`GET /lead?limit=1`) | dal 4 |
  | 5 | `src/`'e üçüncü taraf ölçüm host'u eklendi (`googletagmanager.com`) | dal 5 |
  | 6 | `src/`'e `localStorage.setItem(…)` eklendi | dal 6 |
  | 7 | Başvuru adresi `legal.ts`'e **elle** yazıldı (sabit atlandı) | dal 7 (kaynak ayağı) |
  | 8 | `vercel.json` oluşturuldu | dal 8 |
  | 9 | KVKK'nın *"otuz gün"* cümlesi *"kırk beş gün"* yapıldı | dal 7 (metin ayağı) + bekçi |
  | 10 | Bileşen izleyiciyi **cast** ile doğrudan çağırdı | dal 2 (yüzey) |
  | 10b | Bileşen izleyiciyi **destructure** ile doğrudan çağırdı | dal 2 (yüzey) |

  ⚠️ **Kontrol 4 ve 10 ilk koşumda YEŞİL kaldı** — ikisi de kapının kendi fail-open'ıydı, kapı düzeltildikten sonra kırmızı verdirildi. Yeşil kalan ayak **silinmedi**, dalın kapsamı genişletildi.
- **Beş ölçüm** (kapsam: `src/`, `research/` ve `public/` HEAD ile **birebir aynı** — `git diff HEAD` boş; yani render edilen yüzey TASK-2.17'nin ölçtüğüyle aynı, rakamlar bunu bağımsız olarak doğruluyor):
  - `a11y.mjs` — 8 rota, **TOPLAM SORUN 0**
  - `mobile-audit.mjs` — **9/9 yatay kaydırma yok** (VAR olan rota 0), dokunma hedefi **157** (taban birebir)
  - `font-guard.mjs` — 16 sayfa / **85.015** karakter (taban birebir), kümede olmayan karakter yok
  - `scan.mjs /kvkk 390×844` — 9 kare, sayfa 7.373 px, **konsol temiz**
  - `perf.mjs` (3100'e karşı) — masaüstü ve mobil kollarda CLS ≤ 0,001, LCP 28-280 ms, TTFB 2-4 ms
- **3100 bayatlık sondası:** üretim konteyneri TASK-2.17'de giren üç cümleyi de döndürüyor (*"Washington, D.C. bölgesindeki…"*, *"Ekip posta kutusu"*, *"bugün için otomatik bir silme süresi işletmiyoruz"* — üçü de 1 vuruş), yani ölçülen yüzey güncel. Konteyner **yeniden kaldırılmadı** (bu oturumun başlatmadığı bir servis ve `src/` HEAD ile aynı olduğu için servis edilen baytlar zaten ölçülmek istenen baytlar — varsayılmadı, ölçüldü).

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

Yayındaki yasal beyanların **depo içinden doğrulanabilen sekiz olgusu** bir test paketiyle çivilendi: `tests/legal-consistency.test.ts`, 8 dal / 24 test, `npm test` 180 → **204**. Paket metni kopyalamaz, **ilişkiyi** doğrular ve sessiz geçmeye karşı üç katmanı vardır (iki yönlü `claimOnce` · her taramanın boş-kapsam bekçisi · karar fonksiyonlarının pozitif çapa sondası).

**Kapının kendisi sınandı ve iki fail-open'ı bu sınama buldu:** dal 4 depo çağrılarını URL önekiyle süzdüğü için **göreli** bir okuma çağrısını kaçırıyordu; dal 2'nin yüzey deseni araya giren bir TypeScript cast'i yüzünden **doğrudan izleyici çağrısını** kaçırıyordu. İkisi de genişletildi ve on iki negatif kontrolün on ikisi kırmızı verdirildi. Ayrıca sınama düzeneğinin kendisi bir tur fail-open koştu (ANSI kodları yüzünden boş çıktı) ve ona da pozitif çapa eklendi.

**İki sınır bilerek çizildi:** (a) anahtarın yetki yüzeyi ve koleksiyon kuralları komşu depoda yaşar — dal 4 yalnız *"sitenin kodu okumuyor"* yarısını çiviler, *"anahtar okuyamaz"* devralınmış olarak **çivilenmedi**; (b) başvuru adresinin gerçekten posta aldığı DNS olgusudur ve `npm test` ağ çağrısı yapmaz → TASK-2.20. İkisi de kapının kendi `ÖLÇÜLEMEYEN` yorum bloklarında yazılı.

**Yan bulgu:** yayındaki *"anahtar yalnızca yeni kayıt oluşturabilir"* yarısı, ucun aynı anahtarla var olan kayda `PATCH` attığı gerçeğinden **dar** — metin düzeltmesi kapsam dışı olduğu için Gelen Kutusu'na düştü.

Sekizinci olgu ("12 ay" saklama, çapraz depo) TASK-2.19'un dalıdır; **B-060 orada kapanır.**

---

**Oluşturulma:** 2026-09-22
