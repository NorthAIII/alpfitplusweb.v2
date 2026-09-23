# B-060: Yayındaki yasal beyanların hiçbirini koruyan test yok — v1'de var, v2'ye taşınmadı

**Önem:** 🟡 | **Tip:** test-kapsamı / gerileme | **Alan:** M1 — İçerik (`src/content/legal.ts`) / M6 — Kalite kapıları
**Kaynak:** audit-product (Gelen Kutusu mezuniyeti: `[TASK-1.15]`) | **Tarih:** 2026-09-22
**Durum:** ✅ Çözüldü

## Gözlem

**Beklenen:** `src/content/legal.ts:8-11` dosyanın kendi beyanı: *"metinler sitenin **GERÇEK** veri akışını anlatır."* `ILKELER.md` → *"Kümülatif test altyapısı … her yeni yetenek kendi güvencesini de getirir"* ve *"Kanıtsız iddia yayınlanmaz"*. v1 aynı ihtiyacı **çözmüş**: `../Alpfitplus-website.v1/tests/server/legal-consistency.spec.ts:36-49` metni kopyalamadan ilişkiyi doğruluyor ve regex kayarsa sessizce geçmiyor, kırılıyor.

**Gözlenen:** v2'nin yayınladığı üç hukuki taahhüt, **başka evlerde yaşayan** olgulara dayanıyor ve hiçbirini bağlayan kapı yok:

| Yayındaki taahhüt | Dayandığı olgu | Olgunun evi | v2'de koruyan kapı |
|---|---|---|---|
| "12 ay" saklama (`legal.ts:129`) | `RETENTION_MONTHS = 12` | `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` (**başka repo**) | yok |
| "soru işaretinden sonrası ölçüme gitmez" (`legal.ts:203`) | `data-exclude-search="true"` (**tek öznitelik**) | `src/app/layout.tsx:181` | yok |
| "gerçek bir kişinin verisi gösterilmemektedir" (`legal.ts:302`) | render temizlik tabloları | `research/lib/screen-cleanup-v2.mjs` | yok (bkz. [B-044](B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md)) |

Ölçüm: `grep -rn "12 ay\|RETENTION\|retention\|legal\|LEGAL\|KVKK\|saklama" tests/` → **0 eşleşme**. `tests/` altında 6 dosya / 1.012 satır var (`analytics`, `api-demo`, `click-tracker`, `contact`, `lead-store.contract`, `stage`); hiçbiri `legal.ts`'e dokunmuyor. Repo genelinde `legal.ts`/`LEGAL_DOCS` referans eden tek dosya kendisi.

Beyanların bugünkü hâli **doğru** — üçü de ölçümle teyit edildi (`RETENTION_MONTHS` gerçekten 12; cron `retention.pb.js:30` günlük koşuyor; `data-exclude-search` önizlemede yerinde ve sorguyu siliyor). Sorun doğruluk değil **kırılganlık**: her biri tek bir satıra bağlı ve o satır düştüğü gün yayındaki metin sessizce yalan olur.

Bu bir **v1'den gerilemedir**: v1'de çalışan bir kapı v2'ye taşınmadı. Mekanizma başka bir repoda yaşadığı için v2'nin `npm test`'i sayıyı hiç görmüyor — ama v1 bunu tam da **metin okuyarak** çözmüş, yani şablon hazır.

## Kanıt

```
$ grep -n "RETENTION_MONTHS" ../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js
37: const RETENTION_MONTHS = 12;            (kullanım :200, dışa verim :224)
$ sed -n '30p;43p' ../Alpfitplus-website.v1/pocketbase/pb_hooks/retention.pb.js
30: cronAdd('lead-retention', '30 3 * * *', ...)      43: ['leads','leads_preview']
$ sed -n '36,49p' ../Alpfitplus-website.v1/tests/server/legal-consistency.spec.ts
   → lead_lib.js metin olarak okunuyor, DATA_RETENTION_MONTHS (v1 src/config/site.ts:105 = 12) ile eşleniyor

$ grep -rn "12 ay\|RETENTION\|retention\|legal\|LEGAL\|KVKK\|saklama" tests/ ; echo "exit=$?"
exit=1                                     ← 0 eşleşme
$ grep -n "data-exclude-search" src/app/layout.tsx
181:  data-exclude-search="true"
```

## Kök Neden Yönü

Yasal metin bir **içerik** dosyası olarak ele alınıyor, oysa davranışa bağlı bir sözleşme. Faz 1'in test disiplini uca ve saf fonksiyonlara uygulandı (`api-demo`, `contact`, `analytics`, `click-tracker`, `stage`) — metnin dayandığı olgular bu disiplinin dışında kaldı. [B-024](B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md)'ün kök nedeninin ikizi: *"yasal metni ürüne bağlayan bir kontrol noktası yok."*

## Koruma Önerisi

- v1'in testi **doğrudan taşınabilir**: `lead_lib.js` metin olarak okunur (v2 onu import edemez, farklı çalışma zamanı), `legal.ts`'teki "12 ay" ile eşlenir; sabit bulunamazsa test kırılır (sessiz geçme yok).
- İkinci dal aynı dosyada: `src/app/layout.tsx`'te `data-exclude-search="true"` varlığı — düştüğü an `legal.ts:203` yalan olur.
- Üçüncü dal render hattına ait ve [B-044](B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md) ile birlikte ele alınır.
- Tek dosya, `npm test`'e girer, ek bağımlılık istemez. Doğal evi M6'nın F6.4'ü (iddia sızıntı denetimi) ya da bağımsız bir `tests/legal-consistency.test.ts`'tir.

## Çözüm Kaydı

**TASK-2.18 + TASK-2.19 (2026-09-23) — atom kapandı: tablodaki üç taahhüdün üçü de çivili.**

### TASK-2.18 — depo içi sekiz olgu

`tests/legal-consistency.test.ts` açıldı: **8 dal / 24 test**, batarya 180 → **204** (dosya 8 → 9). v1'in yöntemi devralındı — metin **kopyalanmaz, ilişki doğrulanır**: her dal cümleden kısa ve ayırt edici bir parça alır, o parçanın ilgili dokümanda **tam bir kez** geçtiğini ölçer (0 da >1 de kırar), sonra dayanağı ayrıca ölçer.

Bu atomun tablosundaki üç taahhüdün **ikisi** kapandı:

| Yayındaki taahhüt | Bu turda kurulan kapı |
|---|---|
| "soru işaretinden sonrası ölçüme gitmez" | **dal 1** — `<Script>` etiketinin içinde `data-exclude-search="true"` + etiketin gerçekten ölçüm script'i olduğu (`src={UMAMI_SCRIPT_SRC}`) + `layout.tsx`'te tek `<Script>` |
| "gerçek bir kişinin verisi gösterilmemektedir" | **dal 3** — temizlik tabloları dolu + `deriveForbidden` tabanları + denetimin **52 ad parçasının ve 13 avatar baş harfinin tamamıyla** sondalanması + masum metnin bulguya düşmediği kontrol grubu |
| "12 ay" saklama | **açık** → TASK-2.19 (çapraz depo, salt-okunur bağlama + env kapısı) |

Beş dal daha eklendi (araştırmanın "en az sekiz olgu" ölçümü ve DURUM'un Not bloğu): form alanlarının ölçüme gitmemesi (davranışla — `track()` yükünün anahtar kümesi + izleyiciyi çağıran tek dosya) · sitenin depodan okumaması · ölçümün üçüncü tarafa gitmemesi (dondurulmuş dış host allowlist'i) · çerez/tarayıcı deposu yokluğu · başvuru adresinin `CONTACT.support`'tan gelmesi ve `legal.ts`'e elle yazılmamış olması · form ucu için bölge sabitlenmemiş olması.

**Sessiz geçme üç katmanda engellendi** (bu atomun kök nedeni buydu): iki yönlü `claimOnce` · her taramanın **boş kapsam bekçisi** (dosya sayısı tabanı + korpusta bilinen bir nişan dizesi) · karar fonksiyonlarının **pozitif çapa sondası**. **On iki negatif kontrolün on ikisi kırmızı verdi**; ikisi kapının **kendi** fail-open'ını buldu (dal 4 göreli URL'li depo okumasını, dal 2 cast'li doğrudan izleyici çağrısını kaçırıyordu) ve düzeltildi. Ayrıntı: `tasks/archive/TASK-2.18.md` → Test Sonuçları.

⚠️ **Kapsanmayan iki yüzey, kapının kendi `ÖLÇÜLEMEYEN` yorum bloklarında yazılı:** (1) depo **anahtarının yetki yüzeyi** ve koleksiyon kuralları komşu depoda yaşar — dal 4 yalnız *"sitenin kodu okuma yapmıyor"* yarısını çiviler; (2) başvuru adresinin gerçekten **posta alması** DNS olgusudur ve `npm test` ağ çağrısı yapmaz → TASK-2.20 / B-011.



### TASK-2.19 — çapraz depo dalı: "12 ay" saklama

Tablonun **üçüncü ve son** taahhüdü kapandı. Yöntem atomun kendi Koruma Önerisi'nin dediğiydi — *"v1'in testi doğrudan taşınabilir"* — ama bir adım ileride: v1 sabiti kendi deposunda okuyabiliyordu, v2 okuyamaz. Çözüm **salt-okunur bağlama + env kapısı** (araştırma kararı, `PHASE-2.md` → Seçilen Yaklaşımlar 4):

- `docker-compose.yml` → `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:/opt/v1-pb-hooks:ro`. Hedef **`/app` dışında** — `/app` deponun kendi bind-mount'u ve içine açılan bir mount noktası repoda root sahipli boş dizin bırakıyor (ölçüldü 2026-09-23).
- **Dal 9**, `LEGAL_CONTRACT_HOOKS_DIR` tanımsızken `describe.skip` ile atlanıyor; bataryanın **geçen** sayısı birebir korunuyor (204 → 204, atlanan 1 → 2). Tanımlıyken yedi test koşuyor: batarya **211**, dosya 24 → **31 test**. CI'da (M6 F6.3) komşu depo bulunmayacağı için atlama şart.
- **Beyan parçası ölçülen sayıdan TÜRETİLİYOR** (`oluşturulmasından ${ay} ay sonra…`), elle yazılmıyor — yön olgu → metin. Ayrıca *"günlük çalışan"* ifadesi cron'un kendisine (`cronAdd('lead-retention', '30 3 * * *')` → her gün), sabit ölü olmadığı kesim hesabına (`getUTCMonth() - RETENTION_MONTHS`) ve temizliğin **iki koleksiyonu da** kapsadığına bağlandı.
- **Sessiz geçme kapatıldı:** anahtar tanımlıyken dosya yoksa/boşsa ya da bağlama **yazılabilirse** dal kırılıyor. Salt okunurluk `fs.accessSync(dir, W_OK)` ile ölçülüyor (`:ro` → `EROFS`) — yazma **denenmiyor**; komşu depo canlı sitedir ve başarılı bir deneme yasağı çiğnerdi.

**On dört negatif kontrolün on dördü kırmızı verdi.** Kaynak dokunulmaz olduğu için mutasyonlar `pb_hooks`'un scratchpad **kopyasına** uygulandı ve test kopyaya `:ro` bağlanarak koşturuldu; tur sonunda kaynağın md5'i tur başıyla birebir aynı. Düzeneğin kendi pozitif çapası önce koşturuldu (bozulmamış kopya → çıkış 0 / 31 geçti). Kontrollerden biri kazanç getirdi: üç paragraftan **yalnız biri** güncellendiğinde fragman kontrolü yeşil kaldı, yalnız **bölüm geneli** kontrolü kırmızı verdi — kapının kapsamı beyanın kapsamı kadar geniş olmalı.

⚠️ **Bu dalın ölçemedikleri** (kapının kendi `ÖLÇÜLEMEYEN` bloğunda yazılı): cron'un canlı depoda gerçekten koştuğu ve sildiği (ölçülen kaynak metnidir; `npm test` ağ çağrısı yapmaz) · bağlamanın bayat bir **kopya** değil gerçek mount olduğu · silme penceresinin aritmetiği (bağ ölçülüyor, hesap v1'in kendi testinin işi).

**Kapanış kapsamı:** atomun tablosundaki üç taahhüt kapandı. TASK-2.18'in iki `ÖLÇÜLEMEYEN` kalemi bu turda **değişmedi** ve yaşayan evlerinde duruyor: depo anahtarının **yetki yüzeyi** (komşu depo sözleşmesi — dal 9 hook'ların *metnini* okur, koleksiyon kurallarını değil; yan bulgu Gelen Kutusu'nda) ve başvuru adresinin gerçekten **posta alması** (DNS olgusu → TASK-2.20 / B-011).

⚠️ **Yan bulgu (bu atomun kapsamı değil, Gelen Kutusu'nda):** yayındaki *"anahtar **yalnızca yeni kayıt oluşturabilir**"* yarısı, ucun aynı anahtarla var olan kayda `PATCH` attığı gerçeğinden dar.
