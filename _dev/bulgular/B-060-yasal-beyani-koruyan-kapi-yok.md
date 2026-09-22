# B-060: Yayındaki yasal beyanların hiçbirini koruyan test yok — v1'de var, v2'ye taşınmadı

**Önem:** 🟡 | **Tip:** test-kapsamı / gerileme | **Alan:** M1 — İçerik (`src/content/legal.ts`) / M6 — Kalite kapıları
**Kaynak:** audit-product (Gelen Kutusu mezuniyeti: `[TASK-1.15]`) | **Tarih:** 2026-09-22
**Durum:** → Faz 2

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

—
