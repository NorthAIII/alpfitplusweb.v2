# DURUM — Alpfit Plus Web Sitesi v2

**Son Güncelleme:** 2026-09-11 — Geçiş ve seçim rehberi sayfaları eklendi, rakip adı kaldırıldı, DevFlow kuruldu, devir belgeleri yazıldı. Sıradaki iş: metin tonu (örnek bekleniyor).

> Bu doküman **elle** yazıldı, DevFlow kickoff çalıştırılmadı. Yeni oturumda
> `/devflow:kickoff` ile tam yapı kurulabilir.

---

## Proje nedir

`alpfitplus.com` için sıfırdan yazılan yeni tanıtım sitesi. Alpfit Plus, Kiwi AI Lab'ın
ürünü: spor kulüpleri için B2B yönetim yazılımı. Hedef kitle Türkiye'deki butik
kulüpler (reformer/pilates, boks/dövüş, CrossFit, çok şubeli zincirler).

Canlı site (v1) `../Alpfitplus-website.v1` klasöründe ve **dokunulmuyor**.

---

## Yığın

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind 4 · lucide-react ·
Sora + Inter (siteye özel daraltılmış) · Docker Compose · tek dil (Türkçe).

---

## Bugün ne var

**16 sayfa:** ana sayfa, özellikler, fiyat, segmentler + 4 segment sayfası,
geçiş, yazılım seçerken, demo, destek, 3 yasal metin, 404, sitemap, robots.

**Ana sayfa bölümleri (sırayla):** hero · marquee · kaos (sorun) · çözüm ·
roller · modüller · ürün turu (yapışkan) · faydalar · neden biz · segmentler ·
nasıl çalışır · fiyat + hesaplayıcı · kurucu programı · SSS · kapanış CTA.

**Öne çıkan parçalar**
- Şube sayısına göre canlı **fiyat hesaplayıcı**
- **Yapışkan kaydırmalı ürün turu**, ekran üstünde numaralı işaretler
- **Site asistanı** — bugün model yok, `src/content/chat.ts` ağacından cevaplıyor.
  Arayüz sonradan `/api/chat` ucuna bağlanacak şekilde kuruldu.
- **Kaos bölümü** — WhatsApp, Excel, defter ve takvim nesneleri çizilmiş
- **Kiwi AI Lab imza bandı** footer'da

---

## Ölçülen durum

| Kontrol | Sonuç |
|---|---|
| Kontrast ihlali (a11y.mjs) | 0 |
| Yatay kaydırma, mobil (mobile-audit.mjs) | 0 |
| Font kapsaması (font-guard.mjs) | 16 sayfa, eksik karakter yok |
| Konsol hatası | 0 |
| Üretim derlemesi | 23 rota, geçiyor |
| Ana sayfa ağırlığı | masaüstü 144 KB · mobil 133 KB |
| Ana sayfa LCP | 96 ms (üretim konteyneri, yerel) |
| CLS | 0 – 0,005 |

---

## 🔴 Açık işler — kullanıcıya bağlı

1. **Vercel bağlantısı yok.** v2 için **ayrı** bir proje açılmalı; v1'in
   `alpfitplus-website` projesine dokunulmayacak. Yol: vercel.com/new → repoyu
   içe aktar. CLI kurulamadı (global npm izni yok), gerek de yok.
2. **Demo formunun hedefi tanımlı değil.** `LEAD_WEBHOOK_URL` veya
   `LEAD_FILE_PATH` verilmeden talep kaydedilmiyor. Uç bunu gizlemiyor:
   hiçbir hedef yoksa 503 dönüyor ve form kullanıcıyı WhatsApp'a yönlendiriyor.
   Ayrıntı `.env.example`.
3. **Yasal metinler hukukçu onayı bekliyor.** Metinler sitenin gerçek veri
   akışına göre yazıldı, "örnek metindir" ibaresi **yok** (v1'in D-03 bulgusu).
4. **Logo geçici.** `src/components/layout/Logo.tsx` içinde üretilmiş bir
   işaret var; favicon, app ikonu ve OG görseli ondan türetiliyor.
5. **Kurucu Programı sitede yayında.** Satış dosyalarında bu bir görüşme
   kaldıracıydı; siteye konması kurucunun onayıyla oldu ama kontenjan sayacı
   yok, "ilk 5 kulüp" diye geçiyor.

---

## 🟡 Açık işler — teknik

1. **Asistan AI'ya bağlanacak.** Karar verildi: önce hazır akış, sonra Claude.
   Arayüz hazır, `src/content/chat.ts` ağacı modelin bilgi tabanı olacak.
   Anahtar ve maliyet netleşmeli.
2. **Metin dili daha profesyonel istendi** (2026-09-11, kullanıcı).
   Kullanıcı bu talebi onayladı ama hangi cümlelerin fazla samimi geldiğini
   henüz belirtmedi. **İlk iş: örnek iste.**

   Metinler bilinçli olarak konuşma diline yakın yazıldı; hedef kitle kurumsal
   bir satın alma komitesi değil, salon sahibi. Ton değişecekse bu gerekçe
   birlikte gözden geçirilmeli.

   Şüpheli görülen üç yer (yeni oturumda kullanıcıya sorulacak):
   - `Chaos.tsx` başlığı: *"Kulübünüzün asıl rakibi bir yazılım değil, dağınıklık"*
   - `PricingBlock.tsx` başlığı: *"Paket yok, kademe yok, sürpriz yok"*
   - `gecis` sayfası girişi: *"Kulüp sahipleri bize genelde 'sistemimiz kötü'
     demiyor. 'Alıştık' diyor."*

   **Yöntem:** önce TEK sayfada dene ve göster, kullanıcı beğenirse hepsine yay.
   Ton tek tek dosyalarda değil, `src/content/` altındaki metin dosyalarında
   değişir — bileşenler metni oradan okuyor.
3. **Ana sayfa mobilde ~26.000 px.** Referans alınan rakip de benzer uzunlukta.
   Kısaltma kararı kullanıcıya bırakıldı, tek başına içerik atılmadı.
4. **Sayı sayma animasyonlu istatistik bandı yapılmadı.** Bilinçli: pilot
   sonucu çıkmadığı için yayınlanacak gerçek rakam yok.
5. **Web sitesi hizmeti eklenmedi.** Kullanıcı kararı: şimdilik hayır.

---

## Kararlar (kullanıcı onaylı)

| Konu | Karar | Tarih |
|---|---|---|
| Fiyat sunumu | Tek düz fiyat, katmanlı paket yok | 2026-09-10 |
| Dil | Yalnız Türkçe | 2026-09-10 |
| Büyüme sayfaları | Önce segment sayfaları; geçiş ve seçim rehberi sonra eklendi | 2026-09-10/11 |
| Görsel ton | Açık ve ferah, sage vurgulu | 2026-09-10 |
| Fotoğraf | Seçici ve atmosferik, gerçek salon görselleri | 2026-09-10 |
| Chatbot | Önce hazır akış, sonra AI | 2026-09-10 |
| Web sitesi hizmeti | Eklenmeyecek | 2026-09-10 |
| Kiwi AI Lab imzası | Büyütüldü, footer'da kendi bandı | 2026-09-10 |
| Rakip adı | Sitede geçmeyecek, fiyat sayfasından da kaldırıldı | 2026-09-11 |

---

## Yol boyunca bulunan ve kapatılan gerçek hatalar

Bunlar tekrar etmesin diye yazılı:

1. **Eski kulüp logosu 8 ürün ekranının 8'inde de duruyordu.** Metin denetimi
   göremiyordu çünkü bir `<img>`. Artık görsel denetimi de var.
2. **Takvim ekranında "SMS + push gider" kartı** vardı; ürünün SMS ucu yok.
   Düşürüldü.
3. **Ana sayfa mobilde yatay kayıyordu** (635 px / 390 px). Sebep: ızgara
   öğesinin `min-width: auto` varsayılanı.
4. **`position: sticky` iki bölümde de ölüydü**, üst katmandaki
   `overflow-hidden` yüzünden.
5. **Sora fontunda ₺ yok.** Ölçüldü, `--font-display` yığınına Inter eklendi.
6. **Fontlar sayfa ağırlığının %82'siydi** (219 KB). 95 KB'a indi.
7. **Ekran üstü açıklama etiketleri** tam da gösterdikleri sayıları örtüyordu.
   Numaralı noktaya çevrildi.
