# B-026: Dönüş süresi üç farklı biçimde vaat ediliyor, biri canlı insan ima ediyor

**Önem:** 🟡 | **Tip:** tutarsızlık / iddia | **Alan:** M1 — İçerik / M4 — Site asistanı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → *"Kanıtsız iddia yayınlanmaz."* `docs/CLAIMS.md` → *"Bilinmeyen uydurulmaz."* Aynı vaat sitenin her yerinde aynı biçimde durmalı; ziyaretçiye söylenen şeyin arayüzde karşılığı olmalı.

**Gözlenen:** Üç ayrı dönüş süresi vaadi var ve biri diğerleriyle çelişiyor:

| Yer | Vaat |
|---|---|
| `src/components/layout/Assistant.tsx:151` | *"Genelde **birkaç dakika** içinde dönüyoruz"* — yeşil "çevrimiçi" noktasıyla, **bileşene gömülü** |
| `src/content/chat.ts:153` | *"WhatsApp'tan yazarsanız **aynı gün** dönüş yapıyoruz"* |
| `src/content/gecis.ts:94` | *"**aynı gün** dönüyoruz"* |
| `src/components/sections/DemoForm.tsx:59` | *"**En kısa sürede** size dönüp…"* |

Asistan panelindeki cümle üç açıdan sorunlu: sitenin geri kalanıyla çelişiyor (dakikalar vs aynı gün), günün saatinden bağımsız **koşulsuz** gösteriliyor, ve yanındaki yeşil nokta canlı bir destek hattı ima ediyor — oysa asistan bugün sabit bir karar ağacından cevap veriyor, arkasında bekleyen kimse yok.

**İkinci tutarsızlık, aynı panelde:** giriş mesajı *"…merak ettiklerinizi buradan **sorabilirsiniz**"* ve *"Cevabını bilmediğim bir şey **sorarsanız** sizi doğrudan ekibe bağlarım"* diyor. Ama panelde **serbest metin girişi yok** — ziyaretçi hiçbir şey soramıyor, yalnız hazır başlıklardan seçebiliyor. Canlı DOM'da panelde yalnız `button` ve `a` var; `input`, `textarea` ya da `form` yok.

Vaat edilen yetenek ile sunulan arayüz ayrışıyor. Bu, ürünün pilot aşamasında olduğunu dürüstçe söyleyen bir sitede tonla uyumsuz.

## Kanıt

```
$ grep -rn "birkaç dakika\|aynı gün\|En kısa sürede" src/
src/components/layout/Assistant.tsx:151   "Genelde birkaç dakika içinde dönüyoruz"
src/content/chat.ts:153                   "... WhatsApp'tan yazarsanız aynı gün dönüş yapıyoruz."
src/content/gecis.ts:94                   "... aynı gün dönüyoruz."
src/components/sections/DemoForm.tsx:59   "En kısa sürede size dönüp ..."

$ sed -n '149,152p' src/components/layout/Assistant.tsx
   <span className="size-1.5 rounded-full bg-sage" aria-hidden />
   Genelde birkaç dakika içinde dönüyoruz

$ sed -n '29,30p' src/content/chat.ts
   "...merak ettiklerinizi buradan sorabilirsiniz."
   "Cevabını bilmediğim bir şey sorarsanız sizi doğrudan ekibe bağlarım."
```
Panelin canlı DOM'u Playwright ile tarandı: serbest metin girdisi yok.

**Ağacın kendisi sınıra sadık** ve bu kaydedilir: on bir cevabın hiçbirinde rakip adı, "canlı/sahada", "müşterilerimiz", ROI, müşteri sayısı ya da "sadece bizde" yok; fiyat rakamlarının tamamı `monthlyFor()`'dan hesaplanıyor; çıkışsız dal yok; cevabı olmayan soru kişiye bağlanıyor. Sorun ağaçta değil, panelin **kabuk metinlerinde** — ve o metinler `src/content/` yerine bileşende yaşıyor, yani bu bulgu [B-023](B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md)'ün "metin bileşende" yüzeyinin bir örneği.

## Kök Neden Yönü

Panelin kabuğu bir canlı-destek arayüzü şablonundan türetilmiş görünüyor: yeşil çevrimiçi noktası, "birkaç dakika içinde dönüyoruz", "sorabilirsiniz" — üçü de canlı sohbet kalıbının standart parçaları. Ağaç sonradan bu kabuğun içine yerleşmiş, kabuk metinleri gözden geçirilmemiş.

## Koruma Önerisi

- Dönüş süresi **tek bir sabite** bağlanır (`src/content/site.ts` içinde, `CONTACT`'ın komşusu olabilir) ve dört yer de oradan okur. Değeri kullanıcı belirler — "aynı gün" siteye hâkim olan biçim.
- Panel kabuk metinleri `src/content/chat.ts`'e taşınır; "sorabilirsiniz" ifadesi arayüzün gerçekten sunduğu şeyi anlatacak biçimde düzeltilir ("aşağıdaki başlıklardan seçin" gibi) ya da serbest metin girişi eklenir. İkincisi M4 F4.2'nin (Claude bağlantısı) işidir, yani bugünkü doğru hamle metni düzeltmektir.
- Yeşil nokta ya kaldırılır ya da anlamı netleştirilir — canlı destek ima etmemeli.
- Kalıcı koruma M6 F6.4'ün kapsamına girer: dönüş süresi ifadelerinin sabit dışında geçtiği yerleri arayan kontrol, [B-014](B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md) ve B-023 ile aynı denetimdir.

## Çözüm Kaydı

—
