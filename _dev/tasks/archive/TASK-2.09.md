# TASK-2.09: Beş karşılıksız yetenek cümlesi düzeltilir (B-029)

**Durum:** ✅ Tamamlandı

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

- [x] **1. `product.ts`'teki üç kalem** (1, 3, 5)
  - Üye 360 ekran vaadi: ölçüm grafiği ve diyetisyen notunun **tek ekranda** olduğu iddiası düşer ya da "yolda" işaretiyle ayrışır
  - Üyelik bitişi: "push/bildirim gider" → ürünün gerçeği **rapor girdisi**; ifade ona döner
  - "Toplu duyuru ve kampanya" → yalnız toplu duyuru; kampanya "yolda" kademesinde kalır

- [x] **2. `segments.ts`'teki iki kalem** — biri düzeltildi, biri ölçümle doğrulanıp korundu (2, 4)
  - İptal eşiği: "siz belirlersiniz" → ürünün gerçeği sabit eşik. Gerçek değerin (24 saat) yazılıp yazılmayacağı Karar Noktası
  - Yetki: "verilir ve geri alınır" → geri alma bugün panelden yapılamıyor; ifade daraltılır

- [x] **3. Render edilen rotalarda gözle teyit**
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

- [x] Beş kalemin beşi de ürün koduna karşı yeniden doğrulandı ve sitedeki ifadesi karşılığa uygun (kalem kalem, çapasıyla dokümana)
- [x] `/ozellikler` sayfasında iç çelişki kalmadı: "Bugün var" kolonu ile "Yolda" kolonu aynı yeteneği iki yerde saymıyor
- [x] Düzeltilen ifadeler TASK-2.08'in kademeleriyle **tutarlı** (liste ile metin aynı şeyi söylüyor)
- [x] `docker compose exec web npm test` yeşil (115+1) · üretim derlemesi hatasız (imajın builder katmanı)
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` `/`, `/ozellikler` ve iki segment sayfasında konsol temiz
- [x] `docs/CLAIMS.md` tablosuna aykırı yeni cümle yok (ROI, "sadece bizde", müşteri sayısı, rakip adı)

---

## Karar Noktaları

- **İptal eşiğinin gerçek değeri (24 saat) sitede yazılsın mı?** Yazmak somutluk katar ama ürün değişince bayatlar → **KAPANDI (TASK-2.09): yazılmadı.** Değer ürün kodunda üç yerde sabit ve ayarlanabilirliği v1.5 adayı; sitede o rakamı ürüne bağlı tutan hiçbir kapı yok, yazıldığı an B-029'un kendisi olan "çapasız iddia" sınıfına girerdi. Cümlenin taşıması gereken bilgi (iade/yanma kuralı + üyenin sonucu önceden görmesi) ölçülüp korundu.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Beş kalemin beşi de ürün koduna karşı YENİDEN ölçüldü** (devralınan tablo uygulanmadan önce). Dördü doğrulandı ve sitedeki cümleleri düzeltildi; **beşincisi (yetki geri alma) ölçümle çürütüldü** — aşağıda "Kararlar".
- **`product.ts` → `MODULES.uye360`** (kalem 1): blurb'den "ölçümü" ve "diyetisyen notu" çıktı, `points`'ten "Ölçüm grafiği" ve "Diyetisyen programı ve dosyaları" çıktı; yerlerine panelin **ölçülen** bölümleri geldi ("Grup dersi kayıtları", "Kimlik bilgileri ve üyenin giriş kodu"). Madde sayısı 5'te kaldı (kardeş modüllerle aynı ızgara ritmi).
- **`product.ts` → `MODULES.bildirim`** (kalem 3 + 5): blurb "Randevu, grup ve **üyelik bitişi** push'u. Toplu duyuru **ve kampanya**…" → "Randevu, grup ve **geri çağırma** push'u. Toplu duyuru katmanı."; `points`'ten "Üyelik bitişine yaklaşan üyeye bildirim" ve "kampanya" çıktı, ölçülen **`sendComebackT2`** ("Serisi bozulan üyeye geri çağırma bildirimi") girdi.
- **`segments.ts:71`** (kalem 2): "İptal eşiğini **siz belirlersiniz**" → "İptal eşiği **üründe sabit bir kuraldır**". Cümlenin geri kalanı ölçülüp **doğru** bulundu ve korundu (iade/yanma hesabı + üyenin sonucu önceden görmesi).
- **`segments.ts:207`** (kalem 3'ün segment ayağı): "bitişe yaklaşan üyelere **bildirim gider**" → "serisi bozulan üyeye geri çağırma bildirimi gider. **Bitişe yaklaşan üyeler panelde listelenir.**" — doğru olan (liste) silinmedi, yanlış olan (bildirim) düzeltildi.
- **`segments.ts:265` DEĞİŞTİRİLMEDİ** (kalem 4) — ölçüm cümlenin doğru olduğunu gösterdi.
- **Yeni kapı: `tests/iddia-metinleri.test.ts`** (20 test). Mevcut `capabilities.test.ts` yalnız **sabiti** güdüyor; MODULES ve SEGMENTS kendi metinlerini hâlâ elle yazdığı için (bağlanmaları 2.10/2.11) sabit yeşilken metin karşılıksız iddiayı geri yazabilirdi. Sonda 1 bunu **kanıtladı**: metne üç iddia geri yazıldı, `capabilities.test.ts` **tamamen yeşil kaldı**, yeni kapı 3 kırmızı verdi.
- **`capabilities.test.ts`'te iki bayat olgu düzeltildi**: gönderim fonksiyonu sayısı 12 → **14**; `yetki-geri-alma`'nın gerekçesi ve yasaklı ifadeleri daraltıldı (eski geniş liste artık **doğru** olan cümleyi kırmızı yapardı — yanlış alarm).

**Sorunlar:**
- **Devralınan B-029 tablosunun 4. satırı ölçümde tutmadı.** B-029 yalnız `revokeGrant`'in çağıranına bakıp "üretim çağıranı yok → panelden geri alınamaz" demişti. Ölçüm: geri alma üretimde **`revokeTemplate`** üzerinden koşuyor — `accounts-update.ts:861` → `revokeTemplate` → `revokeGrant` → `permissionGrant.deleteMany`, uç `PATCH /accounts/:userId` (`server.ts:375`), paneli `web/src/lib/account-mutations.ts` çağırıyor, şablon değişimi eski grant'ları **aynı transaction'da** siliyor. Araya ürünün TASK-54.11'i (REPLACE yolu) girmiş.
- **Ürünün kendi notu da bayat:** `permission-templates.ts:15-17` hâlâ "revoke HTTP endpoint'i v1.5'e ertelendi … yollar da bundan **geçecek**" diyor, oysa `accounts-update.ts` bugün geçiyor. B-029'un "ürünün kendi erteleme notlarını arama ölçütü yap" önerisi bu yüzden **tek başına yeterli değil** — not, çağrı grafiğiyle doğrulanmadan kullanılamaz. (→ MEMORY, Süreç Disiplinleri.)
- Ertelenmiş olan **gerçekten ne**: şablondan bağımsız **tek bir yetkiyi** sökmek. `yolda` kalemi buna daraltıldı.

**Kararlar:**
- **Kalem 4'ün cümlesi DEĞİŞTİRİLMEDİ, liste düzeltildi.** Ölçüm cümleyi doğruluyor; onu "daraltmak" siteyi daha yanlış yapardı. Bunun yerine `CAPABILITIES.yolda` → `yetki-geri-alma` etiketi "şube yetkisinin panelden geri alınması" → **"tek bir yetkinin şablon değiştirmeden geri alınması"** oldu ve `simdi`'deki `cok-sube-cockpit` yorumundaki yanlış gerekçe düzeltildi. Böylece liste ile metin aynı şeyi söylüyor (Test Kriteri 3).
- **İptal eşiğinin gerçek değeri (24 saat) sitede YAZILMADI** (Karar Noktası). Gerekçe: (a) değer ürün kodunda **üç ayrı yerde** sabit ve ayarlanabilirliği v1.5 adayı — değişmesi planlı; (b) sitede o rakamı ürüne bağlı tutan **hiçbir kapı yok**, yani yazıldığı an B-029'un ta kendisi olan "çapasız iddia" sınıfına girer; (c) cümlenin taşıması gereken bilgi zaten korundu (iade/yanma kuralı + üyenin önceden görmesi), somutluk kaybı yok.
- **Kalem 1'de "işaretlemek" değil "çıkarmak" seçildi.** `/ozellikler` `m.points`'i **yeşil ✓ ikonuyla** basıyor; oraya "yolda" etiketli bir madde koymak görsel olarak yine "var" demek olurdu. Kalem zaten `CAPABILITIES.yolda` → `uye360-tam`'da duruyor ve 2.10 o kolonu sabitten basacak.
- **Kapı ayrı dosyaya yazıldı** (`iddia-metinleri.test.ts`), `capabilities.test.ts`'e eklenmedi: öznesi farklı (sabit ≠ ziyaretçiye görünen metin) ve o dosyanın başlık yorumu kendi kapsamını açıkça sabitle sınırlıyor.

**Kalan İşler:** yok (bu task'ın kapsamında). B-029 atomu **açık kalıyor** — risk alt kümesi taraması TASK-2.12.

**Dosya Değişiklikleri:**
- `src/content/product.ts` → `MODULES.uye360` ve `MODULES.bildirim` metinleri düzeltildi (gerekçeler ölçüm çapasıyla yorumda); `CAPABILITIES.yolda` → `yetki-geri-alma` etiketi daraltıldı; `simdi` → `cok-sube-cockpit` yorumu düzeltildi
- `src/content/segments.ts` → iki cümle düzeltildi (`:71`, `:207`); `:265` bilinçle **değişmedi**
- `tests/iddia-metinleri.test.ts` → **yeni**; B-029'un beş kaleminin ziyaretçiye görünen yüzeylerdeki kapısı (20 test)
- `tests/capabilities.test.ts` → iki bayat olgu düzeltildi (12→14; `yetki-geri-alma` gerekçesi + yasaklı listesi)

**Test Sonuçları:**
- `npm test` (web konteyneri): **115 geçti + 1 atlandı** (taban 95+1 — TASK-2.08 kapanışı; **+20 senaryo**). Atlanan, env kapısı kapalı depo sözleşme paketi.
- **Ürettiğim kapı iki sondayla sınandı** (ikisinde de **girdi** bozuldu, kapı değil; iki dosya önce scratchpad'e yedeklendi, sonra geri yüklendi — `diff -q` **iki sondadan sonra da birebir** doğruladı):
  - **Bozuk girdi:** üç karşılıksız iddia, kusurun gerçekte oluşacağı yere — ziyaretçiye görünen metnin kendisine — geri yazıldı ("Ölçüm grafiği" `uye360.points`'e, "Toplu duyuru ve kampanya" `bildirim.points`'e, "İptal eşiğini siz belirlersiniz" `segments.ts`'e). **3 kırmızı**, üçü de doğru testte (#1, #2, #5). ⚠️ **`capabilities.test.ts` bu sondada 23/23 yeşil kaldı** — yeni kapının neden ayrı bir dosya olarak gerektiğinin kanıtı budur: sabit kapısı metin regresyonunu göremiyor.
  - **Boş kapsam:** `MODULES` ve `SEGMENTS` boşaltıldı → **8 kırmızı**. Bu sondada **"…demiyor" biçimindeki 12 iddia kontrolü yeşil kaldı** (hasat boşken `not.toContain` boşuna geçer) — "hiç bakmadan PASS basan kapı" tam olarak budur ve boş-kapsam bloğu o fail-open için var.
  - Sonda sonrası batarya yeniden **115 geçti + 1 atlandı**.
- `npx tsc --noEmit` çıkış **0**.
- Üretim derlemesi imajın builder katmanında **hatasız**; 3100 yeni imaja alındı. Rotalar: `/` 200 / 344.982 B · `/ozellikler` 200 / 173.449 B · `/segmentler/pilates-reformer` 200 / 113.782 B · `/segmentler/crossfit` 200 / 113.412 B · `/segmentler/cok-subeli-zincir` 200 / 113.133 B.
- **Düzeltilen cümleler 3100'de servisten doğrulandı** (eski ifade 0, yeni ifade var): "Toplu duyuru ve kampanya" **0** (yalnız "Toplu duyuru" 5, "Kampanya ve pazarlama derinleşmesi" 3 — yani kampanya artık **sadece** Yolda kolonunda; `/ozellikler`'in iç çelişkisi kapandı) · "üyelik bitişi push" **0** / "geri çağırma push" **2** · "eşiğini siz belirlersiniz" **0** / "sabit bir kuraldır" **2** · "bitişe yaklaşan üyelere bildirim gider" **0** / "panelde listelenir" **2** · "verilir ve geri alınır" **2** (ölçümle doğru, korundu).
  - ⚠️ `/ozellikler`'de "Ölçüm grafiği" **1** kez hâlâ geçiyor ve bu **doğrudur**: o, Üye rolünün **mobil uygulama** maddesi (`ROLES`), Üye 360 paneli değil. Ürün kodunda karşılığı ölçüldü (`mobile/src/components/MeasurementChart.tsx`, `mobile/app/home/measurements.tsx`).
- `a11y.mjs` 8 rota **TOPLAM SORUN: 0**.
- `font-guard.mjs` 16 sayfa / **80.486** karakter — kümede olmayan karakter **yok** (taban 80.509; metin kısaldığı için düştü).
- `mobile-audit.mjs` **9/9 rotada yatay kaydırma: yok** (M6 başlangıç çizgisi karşılandı); dokunma hedefi toplamı **157** — TASK-1.09 · PHASE-1 UAT · 2.04 · 2.05 · 2.06 ile **birebir**, regresyon yok.
- `scan.mjs` 390×844 **konsol temiz**: `/` 20 kare / 26.477 px · `/ozellikler` 15 kare / 12.369 px · `/segmentler/pilates-reformer` 12 kare / 9.296 px · `/segmentler/crossfit` 11 kare / 9.215 px.
- ⚠️ `perf.mjs` **koşulmadı**: değişiklik yalnız metin içeriği; sayfa ağırlığı `/ozellikler`'de 173.503 → 173.449 B (−54 B), ağırlık ekseni kapsam dışı.

---

## Sonuç Özeti

B-029'un beş cümlesinden **dördü düzeltildi, biri ölçümle çürütüldü**.

Düzeltilen dördü: Üye 360 artık ölçüm grafiği ve diyetisyen notunu "tek ekranda" saymıyor (ikisi de üründe var ama **başka ekranlarda** — panelin kendi "Yakında" kutusu bunu yazıyor); iptal eşiği "siz belirlersiniz" olmaktan çıkıp ürünün gerçeği olan sabit kurala döndü; üyelik bitişi artık "bildirim gider" değil "panelde listelenir" (giden gerçek bildirim seri temelli geri çağırma — ölçüldü); "kampanya" modül metninden çıktı ve `/ozellikler`'in **iki kolonunun birbirini kestiği iç çelişki kapandı**.

Çürütülen beşincisi: "Yetkiler şube bazında verilir ve geri alınır" cümlesi **doğru** ve yerinde kaldı. B-029 yalnız `revokeGrant`'in çağıranına bakmıştı; geri alma üretimde `revokeTemplate` üzerinden koşuyor ve panelin şablon değişimi eski yetkileri aynı transaction'da siliyor. Gerçekten ertelenmiş olan, şablondan bağımsız **tek bir yetkiyi** sökmek — `yolda` kalemi buna daraltıldı.

Task kendi kapısını da getirdi: `tests/iddia-metinleri.test.ts` beş kalemi **ziyaretçiye görünen yüzeylerde** çiviliyor. Bu boşluk gerçekti ve sondayla gösterildi — metne üç iddia geri yazıldığında sabit kapısı 23/23 yeşil kalırken yeni kapı kırmızı verdi.

Ton değişmedi; yalnız doğruluk düzeldi. Karar Noktası kapandı: iptal eşiğinin 24 saatlik değeri sitede **yazılmadı** (çapasız iddia doğururdu).

---

**Oluşturulma:** 2026-09-22
**Tamamlanma:** 2026-09-23
