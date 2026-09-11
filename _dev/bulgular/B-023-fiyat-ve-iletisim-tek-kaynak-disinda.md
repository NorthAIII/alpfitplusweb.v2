# B-023: Fiyat ve iletişim değerleri tek kaynağın dışında elle yazılmış — on iki yer

**Önem:** 🟡 | **Tip:** tutarsızlık / tek-kaynak ihlali | **Alan:** M1 — İçerik ve iddia kaynağı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → Tek Kaynaklar: fiyat, kurulum, deneme süresi ve dâhil olanlar yalnız `src/content/pricing.ts`'te; *"Rakam sadece burada; bileşen ve chat ağacı fonksiyondan hesaplar."* `modules/M1-Icerik-ve-Iddia-Kaynagi.md` → F1.1 kabul kriteri bunu rakamlarıyla yazıyor: *"Fiyat rakamı (1500, 1200, 3000, 15 gün) yalnız `pricing.ts` içinde yazılıdır."* İletişim bilgisinin tek evi `site.ts` → `CONTACT`.

**Gözlenen:** İki sınıfta toplam on iki ihlal var.

**Fiyat, kurulum ve deneme rakamları** — sekiz yer, biri bileşen içinde:

| Yer | Yazılı hâli |
|---|---|
| `src/content/faq.ts:36` | "İlk şube 1.500 ₺, ikinci şubeden itibaren her şube 1.200 ₺'dir" |
| `src/content/faq.ts:59` | "şube başına 3.000 ₺ olan kurulum ücreti" |
| `src/content/faq.ts:63` | "yaklaşık yüzde 14 avantaj" (türetilmiş değer) |
| `src/content/faq.ts:20`, `:70` | "15 günlük deneme" |
| `src/content/karsilastirma.ts:116` | "Önce 15 gün demo verisiyle deneyebilirsiniz" |
| `src/content/segments.ts:273`, `:288` | "İlk şube 1.500 ₺, ikinci şubeden itibaren 1.200 ₺" |
| `src/components/sections/WhyUs.tsx:32` | "İkinci şubeden itibaren şube başı 1.200 ₺" ← **bileşende** |
| `src/components/sections/FounderProgram.tsx:17-18` | "Yıllık peşinde 13 ay" / "12 ay öder, 13 ay kullanır" ← ticari koşul, `PRICING`'de **hiç yok** |

**İletişim bilgisi** — dört yer:

| Yer | Yazılı hâli |
|---|---|
| `src/app/global-error.tsx:72` | `href="https://wa.me/905359375955"` (Gelen Kutusu'nda kayıtlıydı, doğrulandı) |
| `src/app/layout.tsx` (JSON-LD) | `telephone: "+90-535-937-59-55"` — **arama motoruna giden yapılandırılmış veri** |
| `src/app/layout.tsx` (JSON-LD) | `addressLocality: "Tuzla", addressRegion: "İstanbul"` — `CONTACT.city` varken |
| `src/components/sections/ProductStory.tsx:142` | tarayıcı çerçevesinde elle `app.alpfitplus.com` — `SITE.appUrl` varken |

Bunlara bağlı ayrı bir çatlak: **`CONTACT.phone.display` hiçbir yerde kullanılmıyor.** Beş yerde `phone.href` ile `whatsapp.display` eşleştirilmiş — yani "Telefon" etiketli her kart WhatsApp biçimindeki numarayı gösteriyor (`Header.tsx:154`, `Footer.tsx:58`, `FinalCta.tsx:63`, `destek/page.tsx:27`, `demo/page.tsx:73`). Bugün iki numara aynı olduğu için görünmüyor; ayrıştıkları gün "Telefon" kartı yanlış numarayı gösterir ve `phone.display` güncellenip hiçbir yere yansımaz.

Fiyat rakamlarının hesaplandığı yerler **doğru** çalışıyor ve bu kaydedilir: hesaplayıcı, fiyat sayfası ve chat ağacı `monthlyFor()` üzerinden geliyor; ölçüldü, dört senaryoda da (1, 3, 5, 30 şube) sabitle tam tutarlı. Yani mekanizma sağlam, dışında kalan metinler sorun.

## Kanıt

```
$ grep -rnE "1\.?500|1\.?200|3\.?000|15 gün|15 günlük|13 ay|yüzde 14" src/ \
    --include=*.ts --include=*.tsx | grep -v "content/pricing.ts"
   → yukarıdaki sekiz satır

$ grep -rnE "905359375955|\+90-535|535 ?937|0535|wa\.me|tel:\+" src/ | grep -v "content/site.ts"
   → global-error.tsx:72, layout.tsx JSON-LD

$ grep -rn "phone.display" src/
   → (hiç kullanılmıyor)
```

`src/app/layout.tsx` şu an paralel bir oturumda değiştiği için satır numaraları kaymış olabilir; JSON-LD bloğunun kendisi `HEAD` sürümünden okundu.

## Kök Neden Yönü

Tek kaynak disiplini **sayısal hesaplama** yollarında uygulanmış (`monthlyFor()`, `tl()`), düz metin cümlelerde uygulanmamış. Aynı ayrım [B-014](B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md)'te de görülüyor: chat ağacı fiyatı fonksiyondan alıyor ama pilot cümlesini kopyalıyor. Kural "değer tek yerde" diye anlaşılmış, "cümle tek yerde" diye değil.

`FounderProgram`'daki "13 ay" bunun bir adım ötesi: `PRICING`'de karşılığı olmayan bir **ticari koşul** doğrudan bileşende yaşıyor.

## Koruma Önerisi

- Metinler sabitten şablonla kurulur — `faq.ts:48`'in `PRODUCT_STATUS.sentence` kullanımı ve `karsilastirma.ts`'in `ARASTIRMA` kullanımı bu desenin repodaki doğru örnekleri.
- "13 ay" gibi karşılığı olmayan ticari koşullar önce `PRICING`'e girer, sonra metin oradan okur.
- `CONTACT.phone.display` ya kullanılır ya kaldırılır — kullanılmayan bir sabit sessiz bir tuzaktır.
- Kalıcı koruma M6 F6.4'ün kapsamıdır ve [B-014](B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md) ile **aynı denetimdir**: `PRICING` ve `CONTACT` değerlerinin sabit dosyaları dışında geçtiği yerleri arayan bir kontrol. İki bulgu tek işte kapanır.
- Daha geniş bağlam: kullanıcıya görünen metnin önemli bir kısmı hâlâ `.tsx` içinde yaşıyor (Kurucu Programı, Neden Alpfit Plus, Kaos bölümü, adım listeleri, form etiketleri, fiyat ve özellik sayfalarının başlıkları). Bu yüzey bu bulgunun da, B-014'ün de, asistan metin tutarsızlığının da taşıyıcısı. Ayrı bir iş olarak ele alınması gerekebilir — "Metin tonu" faz konusu (M1 F1.2) zaten *"bileşenlerde gömülü metin de `src/content/`'e taşınır"* diyor, yani rotası hazır.

## Çözüm Kaydı

—
