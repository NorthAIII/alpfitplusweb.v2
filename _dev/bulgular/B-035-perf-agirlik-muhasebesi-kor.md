# B-035: `perf.mjs` sayfa ağırlığı yalnız font ve görselleri sayıyor — ilan edilmiş regresyon çizgisi JS ve CSS'e kör

**Önem:** 🔴 | **Tip:** test-kapsamı / sahte yeşil | **Alan:** M6 — Kalite kapıları
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M6-Kalite-Kapilari.md` → Teknik Notlar, *"Ana sayfa ağırlığı | masaüstü **144 KB** · mobil **133 KB**"* ve tablonun altındaki cümle: *"Bu tablo **regresyon çizgisidir**: F6.2 tek komut bunları geçme eşiği olarak kullanır."* `QUALITY.md` → 4: *"Üçüncü taraf betik (analitik, model) sayfa ağırlığını ne kadar artırdı?"* `phases/PHASE-1.md` → F7.4 kapanışında *"`perf.mjs` ağırlık ve LCP/CLS başlangıç çizgisiyle kıyaslanır; artış rakamıyla task dokümanına yazılır."*

**Gözlenen:** `perf.mjs:29` ağırlığı `content-length` **başlığından** topluyor. Üretim imajında ölçüldü:

| | masaüstü | mobil |
|---|---|---|
| yanıt sayısı | 36 | 25 |
| `perf.mjs` yöntemi (`content-length` toplamı) | **144 KB** | **133 KB** |
| gerçek gövde (decode) toplamı | **1456 KB** | **1244 KB** |
| `content-length` başlığı **olmayan** yanıt | **28** | **17** |

`content-length` taşıyan 8 yanıtın **tamamı** 5 × woff2 + 3 × avif. Taşımayan 28: HTML belgesi, CSS, **14 JS chunk'ı**, 13 RSC yükü — gzip + chunked kodlama başlığı düşürüyor, `perf.mjs` onları **0 bayt** sayıyor.

M6'daki rakamlar (144/133) bu yöntemin çıktısıyla **birebir aynı**. Yani ilan edilmiş regresyon çizgisi fiilen "font + görsel ağırlığı"nı ölçüyor: fontlar tek başına 95 KB, yani raporlanan "ağırlığın" **%66'sı**. **500 KB'lık bir istemci kütüphanesi eklense rakam hiç oynamaz.**

Zamanlaması kritik: Faz 1'in analitik task'i (F7.4) tam bu rakama dayanarak "Umami 4,7 KB ekledi" kıyası yapacak. Umami bir JS betiği, yani yeni yöntemle **görünmez** olacak ve kıyas anlamsız bir yeşil verecek.

Üç ek kusur aynı betikte:
- **"Mobil" profili yalnız viewport.** `perf.mjs:9-12` `viewport`/`isMobile`/`deviceScaleFactor` değiştiriyor; `emulateNetworkConditions` ve CPU kısıtlaması yok. Çizgideki "mobil LCP/CLS" değerleri **masaüstü hızında, küçük ekranda** ölçülmüş sayılar.
- **Eşik ve çıkış kodu yok** — ölçtüğü hiçbir değeri bir sınırla karşılaştırmıyor ([B-030](B-030-kapilar-kirmiziya-donemiyor.md)).
- **Hedef sabit:** `perf.mjs:7` `const BASE = 'http://localhost:3100'` env ile değiştirilemiyor; kardeş `font-guard.mjs:13` `process.env.BASE` destekliyor. Üretim imajı bayatken ([B-019](B-019-uretim-konteyneri-bayat-olcumler-gecersiz.md)) `perf.mjs` başka bir hedefe yöneltilemiyor, yani bugün hiç anlamlı koşamıyor.

## Kanıt

```
$ sed -n '7p;9,12p;29p' research/scripts/perf.mjs
   7: const BASE = 'http://localhost:3100';            ← env yok
  29: ... += Number(r.headers()['content-length'] || 0) ...

# bayt muhasebesi bağımsız doğrulandı (3100 / "/"):
content-length toplamı        : 144 KB (masaüstü) · 133 KB (mobil)
gerçek gövde (decode) toplamı : 1456 KB           · 1244 KB
content-length BAŞLIĞI olmayan: 28 yanıt          · 17 yanıt
başlığı taşıyan 8 yanıt       : 5 × woff2 + 3 × avif   (tamamı)
```
Betik: `scratchpad/audit/perf-bayt-dogrulama.mjs`, `cl-kimde.mjs`. **`perf.mjs`'in kendisi koşturulmadı** (süre ölçümü bu turda kapsam dışı, hedef de bayat); yalnız bayt muhasebesi doğrulandı.

## Kök Neden Yönü

`content-length` bir **transfer** başlığıdır ve gzip + `Transfer-Encoding: chunked` altında yok olur. Ölçüm "ağırlık" istiyor ama transfer başlığından okuyor; modern bir Next.js sunucusunda bu yöntem yapısal olarak yalnız **önceden sıkıştırılmış ikili varlıkları** görebilir — font ve görsel tam olarak o sınıftır. Yani kusur bir unutma değil, yöntem seçiminin kaçınılmaz sonucu; rakamın makul görünmesi (144 KB gerçekten makul bir sayfa ağırlığı) hatayı gizlemiş.

## Koruma Önerisi

- Ağırlık `response.body()` uzunluğundan ya da CDP `Network.loadingFinished` → `encodedDataLength` üzerinden toplanır; ikisi de sıkıştırılmış gerçek transferi verir. İkiye ayırmak faydalı: **transfer edilen bayt** (ağ maliyeti) ve **decode edilen bayt** (ayrıştırma maliyeti).
- Çizgi **yeniden ölçülür** ve M6 → Teknik Notlar'daki 144/133 satırı düzeltilir; bugünkü hâliyle o satır yanıltıcı bir eşik.
- Ağırlık **tür kırılımıyla** raporlanır (HTML / CSS / JS / font / görsel) — "JS büyüdü" sinyali ancak böyle görünür.
- `BASE` env ile geçersiz kılınabilir olur ve betik hedefin tazeliğini doğrular (B-019'un koruma önerisiyle aynı iş).
- "Mobil" profili gerçekten mobil olacaksa ağ/CPU kısıtlaması eklenir; eklenmeyecekse çıktıdaki etiket "küçük ekran" olarak düzeltilir — bugünkü ad ölçmediği şeyi iddia ediyor.

## Çözüm Kaydı

—
