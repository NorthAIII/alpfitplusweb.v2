# Alpfit Plus Web Sitesi v2 — Proje İlkeleri

---

## Bu Doküman Hakkında

**ILKELER.md** bu projenin yön-veren ilkelerini tutar — "kararsız kaldığında neye göre karar ver, neyi feda etme, bu projenin ufku ne?" Nadiren ve **bilinçli** değişir; karar-şekillendiren fazlarda (prd, prd-refine, prd-review, kickoff, discuss, research, plan) okunur ve önerileri yönlendirir. (Doğduğu yer akışa göre değişir: PRD akışında `prd`, PRD'siz akışta `kickoff-docs`, mevcut-kod projesinde `map-codebase`; projeye-özgü alanlar kullanıcıya sorularak dolar. İlk kickoff bu dosyayı yalnızca varsa okur.)

**Nasıl kullanılır:** Q&A fazlarında Claude gri alan sorularını boş sormak yerine, ilgili ilkeye göre cevabı önceden doldurur ve kullanıcıya **teyit ettirir**. Bir ilkeyle gerçek bir gerilim doğarsa (ilke X diyor ama bu durum Y gerektiriyor) açıkça kullanıcıya getirir — sessizce bir tarafı seçmez.

### Bilginin Doğru Evi — bu doküman NE tutmaz

ILKELER yalnızca **yön ve önceliği** taşır, mekanizmayı/detayı değil. Tekrar = drift kaynağı.

- Değerlendirme ekseni / "şunu iyi yaptık mı?" kontrolü → `QUALITY.md`
- Somut teknik kural (framework versiyonu, lint kuralı, isimlendirme) → `CLAUDE.md` → Projeye Özgü Kurallar
- Ürün vizyonu, feature, davranış kuralı → `_dev/PRD/` (bu projede PRD yok; feature davranışı `modules/`)
- Spesifik mimari/tasarım kararı → `docs/DECISIONS.md`
- İddia sınırının somut tablosu (ne söylenir, ne söylenmez) → `docs/CLAIMS.md`

Örnek: "Sırlar koda gömülmez, merkezi model" **ilkesi** burada yaşar; "şu vault'u, şu env-isim kuralını kullan" gibi somut mekanizma `CLAUDE.md` / `DECISIONS.md`'de.

---

## Temel İlkeler

Aşağıdakiler makul varsayılanlardır — projeye uymayanı çıkar, projeye özgü olanı ekle.

### Kalıcılık önceliği

En kalıcı ve ileriye dönük çözümü seç. Kısa vadeli hız uğruna uzun vadeli sağlamlığı feda etme; "şimdilik çalışıyor" bir bitiş kriteri değildir. İki yol arasında kararsızken daha sağlam olana eğil.

### Sır ve konfigürasyon yönetimi

Secret'lar ve ortama bağlı değerler koda gömülmez. Merkezi, değişken-tabanlı bir model kullanılır: aynı kod her ortamda farklı değerlerle çalışır.

### Kümülatif test altyapısı

Test atlanmaz. Test altyapısı her geliştirmeyle üstüne koyarak büyür — her yeni yetenek kendi güvencesini de getirir. Geriye dönük güven zamanla artmalı, azalmamalı.

**Bu projede bugünkü hâli (2026-09-11):** Beş ölçüm betiği var (a11y, mobil, font, perf, tarama) ama hepsi elle koşuyor; hiçbiri commit'i durdurmuyor, CI yok. İlke bugün **karşılanmıyor**; "Kalite kapıları otomatik" faz konusu bunu kapatır (`PHASES.md` → Sıradaki Fazlar).

---

## Bu Projeye Özgü

Kickoff/PRD sırasında kullanıcıya sorularak doldurulur. Boş bir alan "henüz konuşulmadı ya da ertelendi" demektir — varsayma, gerektiğinde kullanıcıya sor.

> v1 sitesinin (`../Alpfitplus-website.v1/_dev/ILKELER.md`) ilkeleri kickoff'ta (2026-09-11) aynen devralındı; tek ekleme "İddia sınırı ve rakip adsızlığı" maddesidir.

### Proje Ufku

**Belirsiz — pilot sonucuna bağlı.** Site bugün saha satışını destekleyen bir vitrindir; ilk müşteriler birebir ilişkiden gelecektir, organik trafik bir varsayım değildir. Uzun soluklu içerik yatırımı (blog, changelog, ikinci dil) pilot sonuçları netleşene kadar açılmaz.

Buna karşılık **mimari kararlar site yıllarca yaşayacakmış gibi verilir**: lead kaybetmeyen bir hat, tek kaynak konfigürasyon, token disiplini, test güvencesi. Ufkun belirsizliği kalitenin düşürülmesi için gerekçe değildir — belirsizlik *kapsamı* daraltır, *sağlamlığı* değil.

### En Yüksek Öncelikli Eksenler

Kararsız kalınan yerde sırasıyla bunlara göre tercih yapılır (eksen tanımları `QUALITY.md`'de):

1. **Dönüşüm** — Ziyaretçiyi talebe çevirmek ve hiçbir talebi kaybetmemek. İki seçenek arasında kalındığında dönüşümü artıran kazanır.
2. **Ölçülebilirlik** — Ne olduğunu görebilmek. Ölçülmeyen şey iyileştirilemez; yeni bir dönüşüm yüzeyi ölçümüyle birlikte gelir.
3. **Bakım kolaylığı** — Tek kişilik ekip gerçeği. Tek kaynak konfigürasyon, tekrar etmeyen içerik, test güvencesi; bugün ucuz olan değil, altı ay sonra ucuz olan seçilir.

### Pazarlık Konusu Olmayanlar

- **Versiyon bitirilebilir kalır.** Bir versiyon ancak bitiş koşulları yazılıysa ve tek kişilik ekiple erişilebilirse açılır. Kapsam büyüdüğünde versiyon uzatılmaz, **bölünür**. Proje-dışı bir aktöre bağlı iş (hukukçu onayı, logo, tüzel kimlik, kurucu programı kontenjanı) hiçbir versiyonun ya da fazın bitişini kilitlemeyecek şekilde yerleştirilir; `BULGULAR.md`'de açık iş olarak durur.
- **Kanıtsız iddia yayınlanmaz.** Referans, rakam ve rakip iddiası uydurulmaz; üçüncü taraf adı yazılı izinsiz yayınlanmaz. Kanıt yoksa alan boş bırakılır, doldurulmaz.
- **İddia sınırı ve rakip adsızlığı.** Söylenebilir/söylenemez tablosu tek kaynaktır (`docs/CLAIMS.md`; dayanağı `../alpfit-plus-satis/rekabet/ozet.md` + `fiyat/model.md`). Rakip adı sitede geçmez; fiyat kıyası yöntem + tarih ile adsız yayınlanır. Pilot iddiası `PRODUCT_STATUS`, fiyat `PRICING` dışında hiçbir yerde yazılmaz.
- **Gelen talep kaybolmaz.** Hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz; lead önce dayanıklı bir yere yazılır, e-posta ikincildir.
- **Erişilebilirlik WCAG AA'nın altına düşmez.** Kontrast ve klavye erişimi eşiğin altına inmez — tema değişse de, yeni sayfa eklense de.
- **Tek huni korunur.** Tüm çağrılar tek demo formuna gider; self-servis kayıt/deneme/ödeme akışı açılmaz.
