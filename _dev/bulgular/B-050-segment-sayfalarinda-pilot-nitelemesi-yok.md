# B-050: Dört segment sayfasında pilot nitelemesi hiç geçmiyor

**Önem:** 🟡 | **Tip:** eksik / iddia uyumu | **Alan:** M1 — İçerik ve iddia kaynağı (`src/content/segments.ts`)
**Kaynak:** audit-product (Gelen Kutusu SORU'sunun kullanıcı cevabıyla atomlaşması) | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → Söylenebilir sütununun ilk maddesi: *"Ürün **pilot aşamada**, bir stüdyoda test ediliyor"* ↔ söylenemez: *"Sahada kullanılıyor", "canlı", "müşterilerimiz"*. Tek Kaynaklar tablosu pilot cümlesini `site.ts` → `PRODUCT_STATUS`'e bağlıyor. `ILKELER.md` → "Kanıtsız iddia yayınlanmaz".

**Gözlenen:** `PRODUCT_STATUS` yalnız **iki yerde** render ediliyor ve ikisi de ana sayfada: `FounderProgram.tsx:84` ve `faq.ts:48` (grep tam). Dört segment sayfasında pilot nitelemesi **hiç geçmiyor**.

Bu bir boşluk, çünkü o dört sayfa tam olarak **giriş sayfası** olarak tasarlandı:
- `src/app/sitemap.ts:18` dördünü **0.8 önceliğiyle** listeliyor; yayın aşamasında `robots index:true` olacaklar.
- `docs/DECISIONS.md` (2026-09-10) onları *"saha satışını doğrudan destekleyen"* büyüme sayfaları diye tanımlıyor ve blog/changelog'un yerine bilinçle onları seçti.
- Her biri mobilde 9–9,2 bin piksel, masaüstünde 5,4–5,7 bin piksel **present-tense yetenek iddiası** taşıyor ("takip edilir", "bildirim gider", "geri alınır", "siz belirlersiniz").

`CLAIMS.md`'nin **yasakladığı** kelimeler bu sayfalarda yok — tarandı: rakip adı, "canlı", "sahada", "müşterilerimiz", ROI, müşteri sayısı, yüzde iyileşme, "sadece bizde" → 0 isabet. Yani açık bir ihlal değil. Ama **izin verdiği niteleme de yok**: arama sonucundan ya da paylaşılan bir bağlantıdan doğrudan `/segmentler/crossfit`'e gelen bir kulüp sahibi, ürünün pilot aşamada olduğunu hiçbir yerde görmeden sayfanın tamamını okuyabiliyor.

Aynı sayfalarda yetenek iddialarının beşi ürün koduna karşı **karşılıksız** çıktı ([B-029](B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md)); pilot nitelemesinin yokluğu o beş cümlenin ağırlığını doğrudan artırıyor — niteleme olsaydı okuyucu "yolda olabilir" diye okuyabilirdi.

**Kullanıcı kararı (2026-09-12):** pilot cümlesi giriş sayfalarına da girsin. Yani bu bir Bilinçli Tercih değil, kapatılacak bir boşluk.

## Kanıt

```
$ grep -rn "PRODUCT_STATUS" src/ | grep -v "content/site.ts"
src/components/sections/FounderProgram.tsx:84    (ana sayfa)
src/content/faq.ts:48                            (ana sayfa SSS)
  → segment sayfalarında tüketici yok

$ grep -cE "pilot|Pilot" src/content/segments.ts          → 0
$ grep -nE "canlı|sahada|müşterilerimiz|ROI|%[0-9]" src/content/segments.ts   → (iddia ihlali yok)
$ sed -n '18p' src/app/sitemap.ts
  → SEGMENTS.map(... priority: 0.8 ...)

Sayfa boyu (ölçüldü, 390 px): crossfit 8.290 · boks-dovus ~9.000 · pilates-reformer ~9.100 · cok-subeli-zincir ~9.200
```

## Kök Neden Yönü

Pilot cümlesi bir **ürün durumu** bilgisi olarak doğru kurulmuş (tek kaynak, tek ev) ama **yerleştirme** kararı sayfa değil bölüm düzeyinde alınmış: `FounderProgram` ve SSS ana sayfada duruyor, dolayısıyla niteleme de orada kalmış. Segment sayfaları sonradan (2026-09-10 kararıyla) giriş sayfası rolü kazandı; o rol değişimi nitelemenin yerleşimini yeniden sorgulatmadı.

İkinci katman: `legal.ts:263`'ün *"yolda olan özellikler ayrı ayrı belirtilir"* taahhüdü de aynı sayfalarda uygulanmıyor ([B-040](B-040-urun-yol-haritasi-dort-evde.md)). Yani segment metinleri iddia sınırının **iki** aracından da (pilot nitelemesi, yol-haritası işareti) yoksun — ikisi de ana sayfada var.

## Koruma Önerisi

- `PRODUCT_STATUS.sentence` dört segment sayfasına da girer. En doğal yer `PageHero` altı ya da sayfanın ilk yetenek bölümünün başı; `LegalPage.tsx`'in `doc.intro`'yu tek kaynaktan okuduğu desen emsal. Cümle **yeniden yazılmaz**, sabitten okunur (CLAIMS'in tek-kaynak kuralı).
- Aynı yerleşim kararı diğer giriş sayfaları için de verilir: `/gecis` ve `/yazilim-secerken` de sitemap'te ve arama sonucundan girilebilir; bu turda ölçülmediler (→ Kapsanmadı), ama aynı soruyu doğuruyorlar.
- `PRODUCT_STATUS.short` ("Pilot aşamada") bugün **hiç kullanılmıyor** ([B-047](B-047-bakim-borcu-envanteri.md)) — kısa hâl tam bu iş için biçilmiş kaftan, giriş sayfalarında uzun cümle ağır gelirse o tüketiciye bağlanır.
- Kalıcı koruma M6 F6.4'ün kapsamı: present-tense yetenek iddiası taşıyan her rotada pilot nitelemesinin bulunduğunu doğrulayan bir kontrol. Rota listesi `sitemap.ts`'ten türetilebilir, yani [B-012](B-012-olcum-betikleri-rota-kapsami-eksik.md)'nin tek-kaynak önerisiyle aynı yapıyı kullanır.

## Çözüm Kaydı

—
