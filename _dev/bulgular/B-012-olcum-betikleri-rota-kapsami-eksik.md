# B-012: Erişilebilirlik ve mobil kapıları rotaların yarısını hiç ölçmüyor

**Önem:** 🟡 | **Tip:** test-kapsamı / kapı kör noktası | **Alan:** M6 — Kalite kapıları
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → "Erişilebilirlik WCAG AA'nın altına düşmez — kontrast ve klavye erişimi eşiğin altına inmez, **tema değişse de yeni sayfa eklense de**". `QUALITY.md` → 6 Test Kapsamı: "Değişiklik beş ölçümden geçti mi?" `M6-Kalite-Kapilari.md` başlangıç ölçümü tablosu kontrast ihlali ve yatay kaydırma için **0** diyor ve bunu "regresyon çizgisi" ilan ediyor.

**Gözlenen:** O sıfırlar sitenin tamamına ait değil. İki kapı rota listelerini sabit tutuyor ve listeler eksik kalmış:

| Betik | Gezdiği sayfa | Kapsamayan |
|---|---|---|
| `font-guard.mjs` | **16** | — (tam; 404 dâhil) |
| `mobile-audit.mjs` | 9 | 3 segment sayfası, `/kvkk`, `/gizlilik`, `/kullanim-kosullari`, 404 |
| `a11y.mjs` | 8 | 3 segment sayfası, `/gecis`, `/yazilim-secerken`, `/gizlilik`, `/kullanim-kosullari`, 404 |
| `perf.mjs` | 4 | temsili örnekleme — muhtemelen bilinçli, bu bulgunun kapsamı dışında |

Somut sonuç: **üç yasal sayfanın hiçbiri mobil kapısından geçmiyor**, ikisi erişilebilirlik kapısından da geçmiyor. Dört segment sayfasından yalnız biri ölçülüyor. 404 sayfası ikisinde de yok.

Aynı repodaki `font-guard.mjs` tam listeyi **zaten taşıyor** — yani doğru liste projede mevcut, diğer iki betik onunla hizalanmamış. Bu bir bilgi eksikliği değil, senkron kaybı.

## Kanıt

```
$ grep -n "const PAGES" research/scripts/a11y.mjs
4:const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler',
   '/segmentler/pilates-reformer', '/demo', '/destek', '/kvkk'];

$ grep -n "const PAGES" research/scripts/mobile-audit.mjs
3:const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler',
   '/segmentler/pilates-reformer', '/gecis', '/yazilim-secerken', '/demo', '/destek'];

$ sed -n '14,17p' research/scripts/font-guard.mjs
const PAGES = ['/', '/ozellikler', '/fiyat', '/segmentler', '/segmentler/pilates-reformer',
  '/segmentler/boks-dovus', '/segmentler/crossfit', '/segmentler/cok-subeli-zincir',
  '/gecis', '/yazilim-secerken',
  '/demo', '/destek', '/kvkk', '/gizlilik', '/kullanim-kosullari', '/olmayan-sayfa'];
```

Segment slug'ları `src/content/segments.ts:35,101,167,233` — dördü de yayında, biri ölçülüyor.

Risk azaltıcı (kaydedilir, bulguyu ortadan kaldırmaz): yasal sayfalar `src/components/sections/LegalPage.tsx` tek şablonundan, segment sayfaları `src/app/segmentler/[slug]/page.tsx` tek şablonundan türüyor. Yani **şablon** kapsanıyor; kapsanmayan, o şablona giren **içeriğin** kendisi — yasal metinlerin uzun paragrafları ve segmentlerin farklı uzunluktaki başlıkları kontrast ve taşma davranışını şablondan bağımsız değiştirebilir. Nitekim aynı sınıfın bir örneği bu turdan önce zaten yakalanmıştı: `FounderProgram` sessiz kırpması (Gelen Kutusu, TASK-1.07).

## Kök Neden Yönü

Rota listesi üç betiğe elle kopyalanmış ve tek kaynağı yok. Yeni sayfa eklendiğinde hangi listelere gireceğini hatırlatan bir şey yok; `font-guard.mjs` bir noktada güncellenmiş, diğer ikisi kalmış.

Daha derin katman: ölçüm sonucu ("kontrast ihlali: 0") **hangi kapsamda** alındığını söylemiyor. Kapsamsız bir sıfır, tam kapsamlı bir sıfır gibi okunuyor — `M6-Kalite-Kapilari.md` başlangıç tablosunda tam da böyle okunmuş.

## Koruma Önerisi

- Rota listesi **tek kaynağa** bağlanır. Site zaten `src/app/sitemap.ts` üretiyor ve `src/content/segments.ts` slug'ları tutuyor; betikler listeyi oradan türetirse yeni sayfa otomatik kapsanır ve senkron kaybı tekrar edemez. 404 rotası listeye elle eklenir (sitemap'te olmaması doğrudur).
- Her ölçüm betiği çıktısına **gezdiği sayfa sayısını** yazar, "TOPLAM SORUN: 0" satırı "N sayfada 0" hâline gelir. F6.2 tek komut bu sayıyı da eşik olarak taşır — kapsam düşerse kapı kırmızıya döner.
- Bu iş M6 F6.2/F6.3 (tek komut + CI) kapsamına doğal olarak girer; oradaki task yazılırken liste tek-kaynak maddesi kabul kriterine konur.

**2026-09-12 ölçümü — bu atomun hipotezi sınandı ve DOĞRULANMADI; yerine ikinci bir kör nokta ölçüldü.**

Yukarıdaki "risk azaltıcı" paragrafı şunu öngörüyordu: *"kapsanmayan, o şablona giren **içeriğin** kendisi — yasal metinlerin uzun paragrafları ve segmentlerin farklı uzunluktaki başlıkları kontrast ve taşma davranışını şablondan bağımsız değiştirebilir."* Sekiz kör-nokta rotası 1440 / 390 / 320 px'te ölçüldü:

| Rota | yatay kaydırma | taşan eleman | sessiz kırpma | eşik altı kontrast |
|---|---|---|---|---|
| 4 segment (390 / 320) | yok / yok | 0 / 0 | 0 / 0 | 0 |
| 3 yasal (390 / 320) | yok / yok | 0 / 0 | 0 / 0 | 0 (en düşük 4,76) |
| 404 (390 / 320) | yok / yok | 0 / 0 | 0 / 0 | **1** (aşağıda) |

Yani şablona giren içerik davranışı **değiştirmiyor**; hipotez kapanabilir. Rota listesi boşluğunun somut bedeli tek bir yerde: **404 sayfasındaki "404" rakamı 1,12–1,17:1** (gereken 3,0) ve bir **h1 → h3 hiyerarşi atlaması** — ikisi de bugüne dek hiç ölçülmedi çünkü 404 iki kapının da listesinde yok. Kalemler [B-032](B-032-olculmus-aa-ihlalleri.md) ve [B-045](B-045-hata-yuzeyleri.md)'te. Sonuç: **rota listesi düzeltildiği gün `TOPLAM SORUN: 0` regresyon çizgisi kırılır.**

Buna karşılık aynı ölçüm bu atomun kapsamadığı **ikinci bir kör nokta** buldu ve o rota listesiyle kapanmıyor: kapının **yöntemi** — gradyan/şeffaf/opaklık atlaması (9 rotada 25 metin ölçüm dışı, **6'sı eşik altı**, ve ikisi kapının **zaten gezdiği** sayfalarda) ve başlık hiyerarşisini hiç kontrol etmemesi → [B-031](B-031-a11y-kontrast-yontemi-kor-noktalari.md). Elle tutulan rota kopyası sayısı da üç değil **beş**: `a11y.mjs`(8) · `mobile-audit.mjs`(9) · `font-guard.mjs`(16) · `sitemap.ts`(11+4) · `site.ts` NAV(4) — son ikisi ürün kodunda, bu atomun kapsamı dışında ama aynı tek-kaynak işine girer.

## Çözüm Kaydı

—
