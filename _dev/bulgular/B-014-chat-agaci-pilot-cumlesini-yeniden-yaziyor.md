# B-014: Chat ağacı pilot cümlesini ve modül listesini tek kaynaktan değil, elle yazıyor

**Önem:** 🔴 | **Tip:** tutarsızlık / tek-kaynak ihlali | **Alan:** M1 — İçerik ve iddia kaynağı / M4 — Site asistanı
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → Tek Kaynaklar tablosu, ürün durumu satırı: *"Pilot cümlesi başka hiçbir yerde **yeniden yazılmaz**; bileşenler bu sabiti okur."* Kaynak `src/content/site.ts` → `PRODUCT_STATUS`. Aynı tablonun chat satırı da chat ağacını **aynı sınıra** bağlıyor ve şunu ekliyor: *"model bağlandığında bu ağaç sistem talimatının bilgi tabanı olur."* `ILKELER.md` bu maddeyi "Pazarlık Konusu Olmayanlar" altında tutuyor.

**Gözlenen:** `src/content/chat.ts` `site.ts`'i **hiç import etmiyor**. Tek importu `./pricing`. "Ürün hangi aşamada?" cevabı hem pilot cümlesini hem modül listesini elle tekrar ediyor — ikisi de `PRODUCT_STATUS` içinde zaten duruyor.

Kardeş dosya `src/content/faq.ts` aynı soruyu **doğru** cevaplıyor: sabiti şablon içine gömüyor. Yani desen repoda mevcut ve çalışıyor; chat ağacı onun dışında kalmış.

Sonuç: `PRODUCT_STATUS.sentence` değiştiği gün sıkça sorulan sorular güncellenir, asistan **eski iddiayı söylemeye devam eder** — ve kimse fark etmez, çünkü bu sınıf için otomatik denetim yok (`CLAIMS.md` → Sızıntı Denetimi, M6 F6.4 henüz yapılmadı). Ürün pilottan çıktığı an, yani cümlenin değişmesinin en kritik olduğu an, sapma tam olarak burada doğar.

## Kanıt

```
$ grep -n "^import" src/content/chat.ts
14:import { PRICING, monthlyFor, tl } from "./pricing";
   → site.ts / PRODUCT_STATUS importu YOK

$ sed -n '126p' src/content/chat.ts
"v1 hazır ve şu anda bir stüdyoda pilot olarak test ediliyor. Randevu, grup
 dersleri, üyelik ve paket, finans ve ciro, çok şube cockpit, raporlar,
 diyetisyen modülü ve bildirimler bugün çalışıyor."

$ sed -n '41p;43p' src/content/site.ts
sentence: "Şu anda bir stüdyoda pilot olarak test ediliyor.",
modules: "Randevu, grup dersleri, üyelik ve paket, finans ve ciro, çok şube
          cockpit, raporlar, diyetisyen modülü ve bildirimler.",

$ sed -n '48p' src/content/faq.ts
a: `v1 hazır. ${PRODUCT_STATUS.sentence} Kampanya derinleşmesi, ...`
   → doğru desen, aynı klasörde
```

**Sınırı koruyan yanı da kaydedilir:** aynı cevabın üçüncü satırı *"Pilot sonucumuz henüz çıkmadı, bu yüzden size ciro artışı gibi bir rakam söylemiyoruz"* diyor (`chat.ts:128`). Yani ağaç iddia sınırını **içerik olarak** biliyor; kırık olan mekanizma, niyet değil. Fiyat tarafı da doğru kurulmuş — chat'teki bütün rakamlar `PRICING`/`monthlyFor()` üzerinden hesaplanıyor, orada ihlal yok.

## Kök Neden Yönü

`chat.ts` yazılırken fiyat sabiti bağlanmış ama ürün durumu sabiti bağlanmamış. Tek kaynak kuralı dosya düzeyinde değil, alan düzeyinde uygulanmış: sayısal olan bağlanmış, cümle olan kopyalanmış.

## Koruma Önerisi

- `chat.ts` `PRODUCT_STATUS`'ü import eder ve cevabı `faq.ts` gibi şablonla kurar. Tek satırlık düzeltme, sonrasında sapma imkânsız.
- Kalıcı koruma M6 F6.4'ün (iddia sızıntı denetimi) doğal kapsamı: `PRODUCT_STATUS.sentence` ve `PRICING` değerlerinin **sabit dışında** geçtiği yerleri arayan bir kontrol. Bu bulgu o denetimin ilk gerçek test vakasıdır — denetim yazıldığında bunu yakalamalı.
- Aynı sınıfın ikinci örneği bu turda ayrıca gözlendi: rakip tarama rakamı dört ayrı yerde, iki farklı biçimde yazılı (`chat.ts:107` ve `WhyUs.tsx:17` "9 yerli ve 9 global" derken `product.ts:187` ve `karsilastirma.ts:74` "18" diyor). Aynı denetim onu da kapsamalı.

## Çözüm Kaydı

—
