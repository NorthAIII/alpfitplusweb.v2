# TASK-1.10: Yasal metin — Aktarım ve Çerezler maddeleri

**Durum:** ⬜ Bekliyor
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1 kapsamındaki yasal metin (fazın kapsam kararı)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.09 ✅

---

## Hedef

Bu fazda doğan iki yeni veri akışını yasal metinlere yazmak: demo talebinin bir e-tablo tedarikçisinde saklanması ve çerezsiz, kimlik tanımlamayan ölçüm kullanılması. Task, `legal.ts`'deki Aktarım ve Çerezler maddeleri gerçek veri akışını doğru anlattığında tamamlanmış sayılır.

---

## Bağlam

Kapsam tartışmasının kararı: yasal metin dokunuşu bu fazın içinde. Bugünkü Aktarım maddesi yalnız "barındırma ve elektronik posta gönderimi" diyor — artık kişisel veri bir e-tabloda da duruyor. Çerezler maddesindeki "üçüncü taraf takip pikseli kullanmıyoruz… gerekli olmayan hiçbir çerez yerleştirmez" cümlesi Umami ile **hâlâ doğru** (çerez yok) ama **eksik**: ölçüm var, sağlayıcısı var, adı geçmiyor.

Fazın sonuna konmasının sebebi tek bir düzenlemede iki akışı da kapsamak. Önizleme `noindex` ve gerçek ziyaretçi trafiği almıyor; metnin gerçekle hizalanması için son an burasıdır — alan adı geçişinden (F7.5) önce kapanmış olur.

Bu değişiklik B-008'i (yasal metinler hukukçu onayı bekliyor) **kapatmaz**; metin hâlâ onay bekliyor, bu düzenleme o kapsamın içinde kalır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Yasal metin" maddesi (satır numaraları ve v1 ton örneği)
- `_dev/docs/CLAIMS.md` — iddia sınırı (yasal metin de iddiadır)
- `../Alpfitplus-website.v1/src/i18n/legal.ts` — Resend maddesinin ton örneği (salt okunur)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/BULGULAR.md` — B-008 kancası tazelenir (kapanmaz)

---

## Alt Görevler

- [ ] **1. Aktarım maddesini genişlet**
  - Bugünkü "barındırma ve elektronik posta gönderimi hizmeti aldığımız tedarikçilerimiz" ifadesine **kayıt tutma / e-tablo tedarikçisi (Google)** ve **ölçüm sağlayıcısı (Umami)** eklenir
  - "Pazarlama amacıyla satılmaz veya devredilmez" cümlesi korunur
  - Erişim kontrolü gerçeği: e-tabloya yalnız demo süreciyle ilgilenen hesap erişir
  - Dosya: `src/content/legal.ts`

- [ ] **2. Çerezler maddesini gerçeğe hizala**
  - Çerezsiz, kimlik tanımlamayan ölçüm kullanıldığı ve sağlayıcısı yazılır
  - "Reklam çerezi ve üçüncü taraf takip pikseli yok" beyanı korunur — hâlâ doğru
  - Ölçümün kişisel veri toplamadığı (IP saklanmadığı, çerez konmadığı) açıkça söylenir
  - Dosya: `src/content/legal.ts`

- [ ] **3. Metnin tutarlılığını denetle**
  - KVKK, Gizlilik ve Kullanım Koşulları metinlerinde aynı konuyu anlatan başka bir madde çelişmiyor mu — grep ile taranır
  - Ton v1'in Resend maddesindeki gibi somut kalır (kim, nerede, ne için); pazarlama dili girmez

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts              # Aktarım ve Çerezler maddeleri — zaten var
```

---

## Dikkat Noktaları

- **Metin `src/content/`'te değişir, bileşende değil** (kod kuralı; `LegalPage.tsx` içeriği okur, taşımaz).
- Sora'da **₺ yok** — yasal metne para birimi girerse Inter yedeği devrededir; yeni karakter girerse `font-guard.mjs` yakalar (STYLE-GUIDE).
- İddia sınırı yasal metinde de geçerli: rakam, müşteri sayısı, "canlı/sahada" ifadeleri girmez (`docs/CLAIMS.md`).
- **B-008 açık kalır** — bu düzenleme hukukçu onayının yerine geçmez, kapsamına girer. Bulguyu kapatma.
- Apex MX eksikliği yüzünden `destek@alpfitplus.com` posta alamıyor olabilir; metin bu adresi KVKK başvuru adresi olarak veriyor. **Bu task'ta adres değiştirilmez** — Gelen Kutusu'ndaki satır kullanıcı kararı bekliyor.

---

## Test Kriterleri

- [ ] `/kvkk`, `/gizlilik`, `/kullanim-kosullari` sayfaları açılıyor ve yeni metinler görünüyor
- [ ] `a11y.mjs` → TOPLAM SORUN: 0
- [ ] `font-guard.mjs` → kümede olmayan karakter yok
- [ ] `scan.mjs` üç yasal sayfada konsol temiz
- [ ] Metinde rakip adı, ROI, müşteri sayısı, "canlı/sahada" ifadesi yok (grep ile denetlendi)
- [ ] `docker compose exec web npm run build` hatasız geçer

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-11
