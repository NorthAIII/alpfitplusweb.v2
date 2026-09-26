# TASK-4.08: JSON-LD'de v1'de olup v2'de düşen alanlar

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md) · tek kaynak M1
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** Yok

---

## Hedef

Kök yerleşimdeki yapılandırılmış veri bloğu (`jsonLd`) saf bir modüle taşınır — `src/lib/json-ld.ts` (YENİ) — ve v1'in canlıda taşıyıp v2'nin düşürdüğü alanlar geri konur, **hepsi tek kaynak sabitlerinden türeyerek**:

- `Organization.telephone` — E.164 (`+905359375955`), `CONTACT.phone.href`'ten türetilir; `contactPoint.telephone`'daki elle yazılmış `+90-535-937-59-55` de aynı türetime geçer (B-023'ün üçüncü biçimi kapanır);
- `Organization.email` — var olan bir sabitten (Karar Noktası);
- `Organization.sameAs` — `[CONTACT.instagram.href]`;
- `SoftwareApplication.url` — `SITE.url`;
- `offers.priceSpecification` — `UnitPriceSpecification`, fiyat `PRICING.firstBranch`, para birimi TRY, `valueAddedTaxIncluded: false`.

v1'in `hreflang` alternatifleri tek dil kararıyla **yazılmaz**; `Organization.logo` v1'de de yok, parite dışı.

Aynı işte **genel hata ekranının** elle yazılmış WhatsApp adresi (`src/app/global-error.tsx:80`, `https://wa.me/905359375955`) `CONTACT.whatsapp.href`'ten okunur — `src/` içinde numarayı elle yazan son yer budur (B-023) ve alt görev 4'ün "elle yazılmış telefon dizesi yok" taraması onu yakalar (kullanıcı onayı, verify-plan 2026-09-26). Tamam sayılır: Vitest alanları ve türetimi çiviliyor, tarama `src/` genelinde 0; 3100'de blok 15 sayfada geçerli JSON ve alanlar yerinde.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → Parite ve yüzey → JSON-LD paritesi (v1 canlıdan)
- `_dev/bulgular/B-042-paylasim-karti-ve-yayin-yuzeyi.md` — kalem 3 tablosu
- `_dev/bulgular/B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md` — telefonun elle yazılmış biçimi
- `src/app/layout.tsx:103-149` — bugünkü blok (satırlar plan anında; kullanmadan önce `grep -n` ile yeniden konumla)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/bulgular/B-042-…` → Çözüm Kaydı — kalem 3; `_dev/BULGULAR.md` index
- `_dev/bulgular/B-023-fiyat-ve-iletisim-tek-kaynak-disinda.md` → Çözüm Kaydı — bu task'ın kapattığı iletişim kalemleri (kısmi; kalanlar kalem kalem açık kalır); `_dev/BULGULAR.md` index
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` → F2.3 — kriter satırı

---

## Alt Görevler

- [ ] **0. Karar** — `Organization.email` (aşağıda); task başında kullanıcıya sorulur.
- [ ] **1. Modül** — `src/lib/json-ld.ts` (YENİ): bloğu üreten fonksiyon/sabit; `@id` referansları korunur.
- [ ] **2. Alanlar** — yukarıdaki beş kalem; E.164 türetimi `tel:` önekini atan tek fonksiyon.
- [ ] **3. Yerleşim** — `layout.tsx` modülü okur; `<script type="application/ld+json">` aynı yerde.
- [ ] **3b. Hata ekranı** — `global-error.tsx`'in WhatsApp bağlantısı `CONTACT.whatsapp.href`'ten. Dosya kök yerleşimin yerine geçer ve yönlendirici bağlamı isteyen bileşen kullanmaz (dosyanın kendi yorumu); `site.ts` salt veridir ve dosya zaten `@/lib/analytics`'ten içe aktarıyor — engel yok. Görünüş ve bağlantı değeri birebir aynı kalır.
- [ ] **4. Test** — `tests/json-ld.test.ts` (YENİ): iki telefon alanı da `CONTACT.phone.href`'ten; `sameAs` Instagram; `priceSpecification.valueAddedTaxIncluded === false` ve fiyat `PRICING.firstBranch`; `url` alanları; `src/` kaynağında elle yazılmış telefon dizesi yok (yorumlar ayıklanmış tarama, pozitif çapalı — memory: kapıyı ölçen kontrol de ölçülür).
- [ ] **5. Ölçüm** — 3100: blok `JSON.parse` geçer, 15 sayfada aynı, alanlar mevcut.

---

## Etkilenen Dosyalar

```
src/lib/json-ld.ts        # YENİ
src/app/layout.tsx        # blok modülden okunur
src/app/global-error.tsx  # WhatsApp adresi tek kaynaktan (tek satır)
tests/json-ld.test.ts     # YENİ
```

---

## Dikkat Noktaları

- v1'in `Organization.email`'i `info@kiwiailab.com` — v2'nin `CONTACT`'ında yok ve posta alıp almadığı ölçülmedi: **kopyalanmaz** (araştırma).
- Veri bloğu yürütülmez; CSP'ye takılmaz — TASK-4.12 ihlal sayımında ayrıca görülür.
- Sayfaya özgü düğüm (ör. `FAQPage`, 7 sayfada) bu task'ın konusu değil; kök blok değişirken onlar bozulmamalı (3100'de sayılır).
- Yapı ölçütü schema.org türleridir; Google'ın zengin sonuç aracı ajan tarafından koşulamaz — doğrulama yapı + tek kaynak testidir.

---

## Karar Noktaları

- **`Organization.email`:** (a) `CONTACT.support` — `destek@alpfitplus.com`, sitenin yayındaki iletişim adresi; B-011 kapanana dek posta almaz, ama B-011 geçişten önce kapanır (TASK-4.15) ve yapılandırılmış veri ancak canlıda okunur. (b) `CONTACT.sales` — `kivanc@kiwiailab.com`, bugün posta alıyor ama kişisel bir adres kurumsal kayda girer. **Öneri (a).** Kullanıcıya sorulur. (Bugün `contactPoint.email` zaten `CONTACT.sales`'i taşıyor — `layout.tsx:117`, satış iletişim noktası olarak — ve bu task onu değiştirmiyor; soru yalnız kurum düzeyindeki `Organization.email`'dir.)

---

## Test Kriterleri

- [ ] `tests/json-ld.test.ts` yeşil; `npm test` toplamı kayıtta
- [ ] Elle yazılmış telefon dizesi taraması `src/` genelinde 0 (`global-error.tsx` dahil; tek kaynak `src/content/site.ts` hariç) ve taramanın pozitif çapası (türetilmiş değerin kaynakta bulunduğu) yeşil
- [ ] 3100: 15 sayfada blok geçerli JSON; `Organization.telephone` `+905359375955`, `sameAs` Instagram, `priceSpecification` mevcut, `SoftwareApplication.url` mevcut
- [ ] `FAQPage` düğümü taşıyan sayfaların sayısı değişmedi

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-26
