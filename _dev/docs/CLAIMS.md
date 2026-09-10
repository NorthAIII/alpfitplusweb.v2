# CLAIMS — İddia Sınırı

**Amaç:** Sitede ne söylenebilir, ne söylenemez — **tek ev**. CLAUDE.md, README.md ve kod başlıkları buraya atıf verir, tabloyu tekrar etmez.
**Ne zaman okunmalı:** Her oturumda (projeye özgü sabit). Metin, chat ağacı, ürün görseli, fiyat veya meta açıklama değişen her işte.
**Dayanak (salt okunur):** `../alpfit-plus-satis/rekabet/ozet.md` (rakip taraması, 18 ürün) + `../alpfit-plus-satis/fiyat/model.md` (kurucu kararı 2026-07-10).
**İlke:** `ILKELER.md` → "Kanıtsız iddia yayınlanmaz" ve "İddia sınırı ve rakip adsızlığı". Bu doküman ilkenin somut tablosudur.

---

## Söylenebilir / Söylenemez

| Söylenebilir | Söylenemez | Neden |
|---|---|---|
| **Diyetisyen modülü** var | — | 18 rakip üründe görülmedi; gerçek fark |
| Antrenör mobil uygulaması **var** | "Antrenör uygulaması **sadece bizde**" | İki yerli rakipte de var |
| Ürün **pilot aşamada**, bir stüdyoda test ediliyor | "Sahada kullanılıyor", "canlı", "müşterilerimiz" | Pilot sonucu çıkmadı |
| Şube başı **tek fiyat**, mobil uygulama dâhil, KDV hariç | Herhangi bir **ROI**, müşteri sayısı, yüzde iyileşme, "X kulüp kullanıyor" | Yayınlanacak gerçek rakam yok |
| Türkçe arayüz ve KVKK uyumu **var** | Türkçe ve KVKK'yı **fark/üstünlük** diye sunmak | Yerli rakiplerin hepsinde var |
| Kurucu programı: ilk kulüplere özel koşul | Sahte kıtlık: sayaç, "son 2 yer" | Kontenjan takibi yok — bkz. `BULGULAR.md` B-010 |
| Fiyat kıyası: rakibin **yayınlanmış liste fiyatından bizim hesabımız**, erişim tarihiyle | Rakip **adı**; doğrulanmamış rakip fiyatı | Karşılaştırmalı reklam mevzuatı + rekabet dosyası kuralı |

**Rakip adı sitede geçmez.** Türkiye'de karşılaştırmalı reklam mevzuatı sıkı; ayrıca rekabet dosyasının kendi kuralı "rakip iddialarını kendi davranışımıza çevir". Rakip adı 2026-09-11'de fiyat sayfasından da kaldırıldı (`docs/DECISIONS.md`).

**Bilinmeyen uydurulmaz.** Chat ağacı ve ileride model: cevabı olmayan soru kişiye (WhatsApp/telefon) bağlanır.

---

## Tek Kaynaklar

| İddia | Tek kaynak | Kural |
|---|---|---|
| Ürün durumu (pilot) | `src/content/site.ts` → `PRODUCT_STATUS` | Pilot cümlesi başka hiçbir yerde **yeniden yazılmaz**; bileşenler bu sabiti okur |
| Fiyat, kurulum, deneme süresi, dâhil olanlar | `src/content/pricing.ts` → `PRICING`, `INCLUDED`, `monthlyFor()` | Rakam sadece burada; bileşen ve chat ağacı fonksiyondan hesaplar |
| Karşılaştırma yöntemi ve tarihi | `src/content/karsilastirma.ts` | Yöntem + erişim tarihi zorunlu, ad yok |
| Chat cevapları | `src/content/chat.ts` | Aynı sınır; model bağlandığında bu ağaç sistem talimatının bilgi tabanı olur |
| Ürün ekran görüntüleri | `research/scripts/render-product.mjs` + `research/lib/` temizlik tabloları | Eski marka, gerçek sporcu/semt adı, karşılanmayan iddia kartı temizlenir; sızıntı varsa **üretim durur** |

---

## Sızıntı Denetimi

Bugün elle: `render-product.mjs` görsel sızıntıyı keser; metin sızıntısı (rakip adı, "canlı", "sahada", yüzde, "müşterilerimiz") için otomatik denetim **yok**. "Kalite kapıları otomatik" faz konusu bunu M6'ya ekler (`modules/M6-Kalite-Kapilari.md` → F6.4).

---

**Son Güncelleme:** 2026-09-11 — Tablo CLAUDE.md, README.md ve site.ts başlığından tek eve taşındı.
