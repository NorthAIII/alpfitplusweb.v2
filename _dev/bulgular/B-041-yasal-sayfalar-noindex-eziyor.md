# B-041: Üç yasal sayfa noindex'in üçüncü katmanını eziyor — faz ölçüm tablosu bunu yeşil gösteriyor

**Önem:** 🟡 | **Tip:** hata / tutarsızlık | **Alan:** M7 — Yayın ve altyapı
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `next.config.ts:6-9` dosya yorumunun kendi kuralı: *"üç katman **tek koşuldan** okur, iki ayrı yerde iki koşul drift'tir."* `src/lib/stage.ts` aynı değişmezi tekrarlıyor. `phases/PHASE-1.md` → Ölçümler → "noindex üç katman — yayın zincirinde" tablosu **HTML meta ✅** diyor.

**Gözlenen:** Üç yasal sayfa aşama türetimini atlayıp sabit değer yazıyor ve **canlı önizlemede `index, follow` servis ediliyor**:

```
$ for p in kvkk gizlilik kullanim-kosullari fiyat; do
    curl -s "https://alpfitplus-web-v2.vercel.app/$p" | grep -o '<meta name="robots" content="[^"]*"'; done
  /kvkk                 → content="index, follow"      ← SIZINTI
  /gizlilik             → content="index, follow"      ← SIZINTI
  /kullanim-kosullari   → content="index, follow"      ← SIZINTI
  /fiyat                → content="noindex, nofollow"  ✅
```

Kaynak — üç dosyada aynı satır:
```
src/app/kvkk/page.tsx:9                 robots: { index: true, follow: true },
src/app/gizlilik/page.tsx:9             robots: { index: true, follow: true },
src/app/kullanim-kosullari/page.tsx:9   robots: { index: true, follow: true },
```
`src/app/layout.tsx:66` `robots: { index: isPublished, follow: isPublished }` (aşama-türetimli) sayfa `metadata`'sı tarafından **eziliyor** — Next.js'te sayfa metadata'sı kök layout'unkini geçersiz kılar.

**Bugünkü pratik etki düşük ve bu kaydedilir:** diğer iki katman ayakta — aynı üç adreste `X-Robots-Tag: noindex, nofollow` başlığı ölçüldü ve `robots.txt` tam `Disallow: /` diyor. Yani site bugün indekslenmiyor. Ama beyan edilen değişmez kırık, üç sayfa aşama kavramından **kalıcı olarak kopuk**, ve **faz ölçüm dokümanı bunu yeşil gösteriyor** — yani drift bir daha fark edilmeyecek biçimde kayda geçmiş.

Zamanlaması önemli: alan adı bağlandığı gün (F7.5) diğer iki katman `production` aşamasında kendiliğinden açılacak ve bu üç satır o gün **doğru** sonucu verecek. Yani hata canlıya çıkışta kendini gizler; bugün düzeltilmezse sessizce kalıcı olur.

## Kanıt

```
$ grep -n "robots" src/app/{kvkk,gizlilik,kullanim-kosullari}/page.tsx src/app/layout.tsx
src/app/kullanim-kosullari/page.tsx:9:  robots: { index: true, follow: true },
src/app/gizlilik/page.tsx:9:            robots: { index: true, follow: true },
src/app/kvkk/page.tsx:9:                robots: { index: true, follow: true },
src/app/layout.tsx:66:                  robots: { index: isPublished, follow: isPublished },

$ for p in kvkk gizlilik kullanim-kosullari; do curl -sI ".../$p" | grep -i '^x-robots-tag'; done
  → üçünde de: x-robots-tag: noindex, nofollow        (ikinci katman ayakta)
```
İki bağımsız pakette aynı sonuç ölçüldü (yayın yüzeyi turu + kod kalitesi turu).

## Kök Neden Yönü

Üç yasal sayfa büyük olasılıkla **kickoff öncesinde**, aşama türetimi (TASK-1.01/1.02) kurulmadan yazıldı ve o gün `index: true` doğru bir varsayılandı. Aşama türetimi geldiğinde `layout.tsx` güncellendi, sayfa-düzeyi geçersiz kılmalar taranmadı. Kapı tarafı da görmedi: `a11y.mjs`/`mobile-audit.mjs` meta etiketi ölçmüyor ve TASK-1.03'ün başlık ölçümü yalnız `/` ve `/sitemap.xml`'e bakmış — üç yasal sayfa o ölçümün kapsamında değildi ([B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md) ile aynı sınıf: kapsamsız bir yeşil geniş bir yeşil gibi okunmuş).

## Koruma Önerisi

- Üç satır **silinir** — sayfalar kök layout'un `isPublished` değerini miras alır ve tek-koşul değişmezi geri gelir. "Yasal sayfalar her aşamada indekslenebilir olsun" bilinçli bir karar ise o zaman `robots` değeri yine `deployStage`'den türetilmeli (`index: true` sabiti değil) ve gerekçe koda yazılmalı.
- `phases/PHASE-1.md` → Ölçümler → noindex tablosunun "HTML meta ✅" satırı **düzeltilir**; faz hâlâ aktif olduğu için bu bugün yapılabilir (tamamlandıktan sonra tarihsel doküman olur ve düzeltilemez).
- Kalıcı koruma: yayın kapısına **beklenen meta/başlık kümesi** kontrolü girer ve **her rotada** koşar — bugünkü üç katman zaten makine-okunur, tek eksik onu 15 rotada doğrulayan bir satır. Aynı kapı güvenlik başlıklarının sessizce düşmesini de yakalar (bu turda 31 adreste elle doğrulandı, kapı yok).

## Çözüm Kaydı

—
