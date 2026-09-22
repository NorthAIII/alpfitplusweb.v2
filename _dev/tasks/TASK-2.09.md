# TASK-2.09: Beş karşılıksız yetenek cümlesi düzeltilir (B-029)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.08 (kademeler kurulmuş olmalı — düzeltme listeye dayanır)

---

## Hedef

Ürünün bugün karşılamadığı **beş yetenek iddiasını** sitede doğru hâle getirmek. Dördünde ürünün **kendi kaydı** karşılığın olmadığını açıkça söylüyor; beşincisinde aynı sayfanın iki kolonu birbirini kesiyor.

Task, beş kalemin beşi de ürün koduna karşı doğru ifadeye döndüğünde ve `/ozellikler`'in kendi taahhüdü (*"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"*) gerçekten karşılandığında tamamlanmış sayılır.

---

## Bağlam

Beş kalem ve ürün kodundaki karşılığı (B-029; audit-product 2026-09-22'de **5/5 hâlâ açık** olarak yeniden ölçüldü):

| # | Sitenin dediği | Ürünün gerçeği |
|---|---|---|
| 1 | "…ölçümü ve diyetisyen notu tek ekranda" (`product.ts:129`) + `:133` "Ölçüm grafiği", `:135` "Diyetisyen programı ve dosyaları" | Ürün paneli o ekranın altında **"Yakında — … Üye 360 tam fazında (W8) gelecek"** kutusu render ediyor |
| 2 | "İptal eşiğini siz belirlersiniz." (`segments.ts:71`) | Eşik kod sabiti (24 saat); ayarlanabilirlik ürünün kendi notunda **v1.5 adayı**. Sitede gerçek değer hiç yazmıyor |
| 3 | "üyelik bitişi push'u" (`product.ts:214`), "bitişe yaklaşan üyeye bildirim" (`:217`), "bildirim gider" (`segments.ts:207`) | 12 gönderim fonksiyonunun hiçbiri üyelik bitişi göndermiyor; var olan tek şey **rapor girdisi** |
| 4 | "Yetkiler şube bazında verilir **ve geri alınır**" (`segments.ts:265`) | `revokeGrant` yalnız kendi testinden çağrılıyor; **revoke HTTP ucu v1.5'e ertelendi** |
| 5 | "Toplu duyuru **ve kampanya**" (`product.ts:219`) | Broadcast var, "toplu duyuru" doğru; `campaign`/`kampanya` rota/sayfa/servis **yok**. Aynı sayfa 110 satır aşağıda "Kampanya ve pazarlama derinleşmesi"ni **Yolda** gösteriyor |

**Doğru olan kısım korunur:** üç yetki şablonu, bekleme listesi + sıradakine bildirim, yoklama düzeltme pencereleri ve aktiflik serisi ürün koduna karşı **birebir doğrulandı**. Sınıf "site abartıyor" değil, **beş belirli cümle** karşılıksız.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md` — tablo, kanıt komutları, render edildiği rotalar
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — kurulan kademeler ve granülerlik
- `_dev/docs/CLAIMS.md` — sınır; `_dev/docs/STYLE-GUIDE.md` → Metin Tonu (ton **değişmez**, yalnız doğruluk düzelir)
- `../Alpfit.v1` (salt okunur) — düzeltmenin dayanağı; gerekirse yeniden doğrulanır

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-029-*.md` — Çözüm Kaydı; atom **TASK-2.12'den sonra** kapanır (risk alt kümesi taraması onun işi)

---

## Alt Görevler

- [ ] **1. `product.ts`'teki üç kalem** (1, 3, 5)
  - Üye 360 ekran vaadi: ölçüm grafiği ve diyetisyen notunun **tek ekranda** olduğu iddiası düşer ya da "yolda" işaretiyle ayrışır
  - Üyelik bitişi: "push/bildirim gider" → ürünün gerçeği **rapor girdisi**; ifade ona döner
  - "Toplu duyuru ve kampanya" → yalnız toplu duyuru; kampanya "yolda" kademesinde kalır

- [ ] **2. `segments.ts`'teki iki kalem** (2, 4)
  - İptal eşiği: "siz belirlersiniz" → ürünün gerçeği sabit eşik. Gerçek değerin (24 saat) yazılıp yazılmayacağı Karar Noktası
  - Yetki: "verilir ve geri alınır" → geri alma bugün panelden yapılamıyor; ifade daraltılır

- [ ] **3. Render edilen rotalarda gözle teyit**
  - Beş kalem `/`, `/ozellikler` ve dört segment sayfasında görünüyor; düzeltme sonrası her birinin yüzeyi kontrol edilir
  - `/ozellikler`'in "Yolda" kolonuyla **çelişki kalmadığı** doğrulanır (5. kalemin kendi sayfasındaki iç çelişkisi)

---

## Etkilenen Dosyalar

```
src/content/
├── product.ts      # üç kalem (Üye 360 ekranı, üyelik bitişi, kampanya) — zaten var
└── segments.ts     # iki kalem (iptal eşiği, yetki geri alma) — zaten var
```

---

## Dikkat Noktaları

- **Ton değişmez, doğruluk düzelir.** Metin tonu işi (F1.2) bilinçli olarak **başka bir fazda** (`phases/PHASE-2.md` → Kapsam Dışı). Cümleyi yeniden yazarken üslubu koru.
- **Silmek tek seçenek değil:** bir yetenek "yolda" ise o işaretle kalabilir — `legal.ts:271`'in taahhüdü tam da bunu istiyor (*"ayrı ayrı belirtilir"*). Kaldırmakla işaretlemek arasında seçim kalem bazında yapılır ve gerekçesi task kaydına yazılır.
- **Gerçek değer yazmak yeni bir iddiadır.** "İptal eşiği 24 saattir" cümlesi ürün kodundan geliyor ama ürün değişirse bayatlar; yazılacaksa kaynağı anılır.
- **Ürün kodu salt okunurdur** (`../Alpfit.v1`) — orada hiçbir şey düzeltilmez.
- **Beş kalem bir taban, tavan değil.** Sınıfın tamamı ~124 present-tense yetenek cümlesi; tarama TASK-2.12'de. Burada kapsamı kendiliğinden genişletme.
- Segment sayfalarında "yolda / yol haritası" ifadesi bugün **0 kez** geçiyor (B-040) — bu task o boşluğu kapatmak zorunda değil, ama düzeltilen iki kalem oraya ilk işareti sokabilir.

---

## Test Kriterleri

- [ ] Beş kalemin beşi de ürün koduna karşı yeniden doğrulandı ve sitedeki ifadesi karşılığa uygun (kalem kalem, çapasıyla dokümana)
- [ ] `/ozellikler` sayfasında iç çelişki kalmadı: "Bugün var" kolonu ile "Yolda" kolonu aynı yeteneği iki yerde saymıyor
- [ ] Düzeltilen ifadeler TASK-2.08'in kademeleriyle **tutarlı** (liste ile metin aynı şeyi söylüyor)
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` `/`, `/ozellikler` ve iki segment sayfasında konsol temiz
- [ ] `docs/CLAIMS.md` tablosuna aykırı yeni cümle yok (ROI, "sadece bizde", müşteri sayısı, rakip adı)

---

## Karar Noktaları

- **İptal eşiğinin gerçek değeri (24 saat) sitede yazılsın mı?** Yazmak somutluk katar ama ürün değişince bayatlar → **kullanıcıya sorulacak** (task oturumunda, tek cümlelik pratik soruyla).

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- run-task dolduracak -->

---

## Sonuç Özeti

<!-- Task tamamlanınca doldurulacak -->

---

**Oluşturulma:** 2026-09-22
