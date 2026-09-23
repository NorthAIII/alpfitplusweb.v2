# M1: İçerik ve İddia Kaynağı

**Sorumluluk:** Sitedeki tüm metin, fiyat, segment, SSS, yasal içerik ve chat ağacını **tek kaynaktan** sunmak; iddia sınırını kodda garanti etmek.
**Bağımlılık:** Yok (dayanak `../alpfit-plus-satis`, salt okunur)
**Sınır:** `src/content/*` dosyalarını kapsar (site, pricing, product, segments, faq, legal, gecis, karsilastirma, shots, chat). Bileşenlerin bu içeriği nasıl çizdiği M2, chat arayüzü M4, görsellerin üretimi M5'tir. Ne söylenip söylenemeyeceği `docs/CLAIMS.md`'de — burada tekrarlanmaz.

---

## Feature'lar

### F1.1: Tek kaynak içerik ve iddia sabitleri → Phase —

**Açıklama:** Ürün durumu `PRODUCT_STATUS`, fiyat `PRICING` + `monthlyFor()`, iletişim `CONTACT`, navigasyon `NAV` gibi sabitler `src/content/` altında tanımlı; bileşenler metni buradan okur. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Pilot cümlesi yalnız `site.ts` → `PRODUCT_STATUS` içinde geçer; `grep -r "pilot" src/components` başka bir cümle bulmaz
- Fiyat rakamı (1500, 1200, 3000, 15 gün) yalnız `pricing.ts` içinde yazılıdır; bileşenler ve `chat.ts` fonksiyondan hesaplar
- Rakip adı `src/` altında hiçbir dosyada geçmez
- Fiyat kıyası (`karsilastirma.ts`) yöntem + erişim tarihi taşır
- **Yetenek/yol haritası ayrımı yalnız `product.ts` → `CAPABILITIES` içinde tanımlıdır** (TASK-2.08); "bugün var" kademesine yalnız ürün koduna (`../Alpfit.v1`) karşı doğrulanmış kalem girer, karşılığı ölçülemeyen iddia "yolda" kademesinde durur. Kapı: `tests/capabilities.test.ts`
- **`PRODUCT_STATUS.modules` elle yazılmaz**, "bugün var" kademesinin modül düzeyli kalemlerinden türer (`moduleProse()`)
- Yol haritası kalemleri sabit **dışında** listelenmez; `grep` ile teyit edilir (B-040'ın kanıt komutu). **Altı tüketicinin altısı da bağlı** (TASK-2.10 + 2.11): `/ozellikler` · `FounderProgram` · `chat.ts` · `faq.ts` · `karsilastirma.ts` · `/fiyat`. Kanıt komutu bugün yalnız `product.ts`'in kendi 3 satırını buluyor (2 etiket + 1 yorum). Kapı: `tests/capabilities.test.ts` → tüketici ayağı (`yolda`+`sonra` etiketleri tüketici kaynağında geçmez; `simdi` bilinçle dışarıda — modül adları meta açıklamada meşru geçiyor)
- **Yayın kapısı (ters yön, TASK-2.11):** kalemi *adıyla anıp henüz olmadığını söyleyen* cümleler `upcomingCapability(id)` / `stageNote(id)` çağırır; kalem `simdi` kademesine taşındığında bu fonksiyonlar hata atar, yani modül yüklenmez ve derleme durur. Bir kalemi yayına almanın bedeli, onu anan cümleleri elden geçirmektir (`docs/DECISIONS.md` 2026-09-23). Ters yön (yeni kalem eklemek, `sonra` → `yolda`) etkilenmez
- **Pilot cümlesi ve modül sayımı** `site.ts` → `PRODUCT_STATUS` dışında hiçbir yerde yazılı değil (ölçüldü 2026-09-23: `grep -rn "stüdyoda pilot" src/` → yalnız sabit); `chat.ts` ve `faq.ts` sürüm adını da oradan alır (B-014 kapandı)
- **Sitede bir sürüm numarası iddiası** (`v1` · `v1.5`) ürünün sürüm haritasına çapalanır: `../Alpfit.v1/_dev/PRD/VERSIONS.md`. Kod yorumundaki *"v1.5 adayı / ertelendi"* kapsam taahhüdü değildir — `yolda` kademesi bir sürümün kapsamı **değil**, bu yüzden kademe başlıkları `STAGE_LABEL`'dan okunur ve `PRODUCT_STATUS.nextVersion` **açılmadı** (TASK-2.10, `docs/DECISIONS.md` 2026-09-23)

**Bağımlılık:** Yok

**Edge Case'ler:**
- Fiyat değiştiğinde `chat.ts` cevapları da değişmeli — fonksiyon çağrısıyla otomatik, sabit metin yazılmaz
- Kademe etiketleri **cümle-içi** biçimde saklanır; başlık `capabilityTitle()` ile türer (ters yön "QR" ve "Apple Health"i bozar). Türkçe büyütme şart: `iptal` → `İptal`
- `capabilityProse` "simdi" kademesini **tip düzeyinde** kabul etmez — o kademenin etiketleri kendi içlerinde virgül taşıyor, virgülle bağlanınca cümle okunamaz hale geliyor (ölçüldü)
- Sora'da ₺ yok; fiyat biçimlendirme (`tl()`) Inter yedeğine düşer — `STYLE-GUIDE.md`

---

### F1.2: Metin tonu profesyonelleştirme → Phase —

**Açıklama:** Kullanıcı 2026-09-11'de metin dilini "daha profesyonel" istedi. Metinler bilinçli olarak konuşma diline yakın yazıldı (hedef salon sahibi, komite değil); ton değişecekse bu gerekçe birlikte gözden geçirilir. **Ön koşul:** kullanıcıdan fazla samimi bulduğu örnek cümleler alınır.

**Kabul Kriterleri:**
- Kullanıcıdan en az bir "fazla samimi" örnek alındı ve yeni ton **tek sayfada** gösterilip onaylandı
- Onaylanan ton `src/content/` genelindeki tüm metin dosyalarına yayıldı; bileşen dosyalarında metin değişmedi
- `a11y.mjs` TOPLAM SORUN: 0, `scan.mjs` konsol temiz, `font-guard.mjs` kümede olmayan karakter yok (yeni karakter girdiyse küme genişletildi)
- `docs/CLAIMS.md` tablosuna aykırı yeni cümle yok

**Bağımlılık:** F1.1

**Edge Case'ler:**
- Şüpheli görülen üç yer, kullanıcıya sorulacak: `Chaos.tsx` başlığı *"Kulübünüzün asıl rakibi bir yazılım değil, dağınıklık"*; `PricingBlock.tsx` başlığı *"Paket yok, kademe yok, sürpriz yok"*; `gecis` sayfası girişi *"Kulüp sahipleri bize genelde 'sistemimiz kötü' demiyor. 'Alıştık' diyor."*
- Ton değişimi başlık uzunluğunu değiştirirse mobilde satır kırılması ve `min-w-0` tuzağı yeniden ölçülür (`mobile-audit.mjs`)
- Meta açıklamalar (`description`) ve OG metinleri de aynı tonda güncellenir

---

### F1.3: Chat bilgi ağacı → Phase —

**Açıklama:** `src/content/chat.ts` — site asistanının soru/cevap ağacı. Cevaplar sitedeki doğrulanmış iddialarla aynı sınırda, fiyatı `pricing.ts`'ten hesaplar, bilinmeyeni kişiye (WhatsApp/telefon) bağlar. İleride modelin sistem talimatının bilgi tabanı olur (M4 → F4.2). Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Her konunun cevabı `docs/CLAIMS.md` tablosuna uyar; "sadece bizde", ROI, müşteri sayısı geçmez
- Fiyat cevabı `monthlyFor()` çağırır, sabit rakam yazmaz
- Ağaçta çıkışsız düğüm yok: her konu ya devam sorusu ya kişiye bağlantı taşır

**Bağımlılık:** F1.1

**Edge Case'ler:**
- Metin tonu (F1.2) değişince ağaç cevapları da aynı tonda güncellenir — ağaç `src/content/` altındadır, kapsam dışı kalmaz

---

## Teknik Notlar

- İddia sınırı tablosu **burada değil**, `docs/CLAIMS.md`'de. `site.ts` başlığı ve README oraya atıf verir.
- `legal.ts` metinleri sitenin gerçek veri akışına göre yazıldı, "örnek metindir" ibaresi yok; hukukçu onayı açık — `BULGULAR.md` B-008.
- Kurucu Programı metni "ilk 5 kulüp" diyor, kontenjan sayacı yok — `BULGULAR.md` B-010.
