# TASK-1.10: Yasal metin — Aktarım ve Çerezler maddeleri

**Durum:** ✅ Tamamlandı
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

- [x] **1. Aktarım maddesini genişlet**
  - Bugünkü "barındırma ve elektronik posta gönderimi hizmeti aldığımız tedarikçilerimiz" ifadesine **kayıt tutma / e-tablo tedarikçisi (Google)** ve **ölçüm sağlayıcısı (Umami)** eklenir
  - "Pazarlama amacıyla satılmaz veya devredilmez" cümlesi korunur
  - Erişim kontrolü gerçeği: e-tabloya yalnız demo süreciyle ilgilenen hesap erişir
  - Dosya: `src/content/legal.ts`

- [x] **2. Çerezler maddesini gerçeğe hizala**
  - Çerezsiz, kimlik tanımlamayan ölçüm kullanıldığı ve sağlayıcısı yazılır
  - "Reklam çerezi ve üçüncü taraf takip pikseli yok" beyanı korunur — hâlâ doğru
  - Ölçümün kişisel veri toplamadığı (IP saklanmadığı, çerez konmadığı) açıkça söylenir
  - Dosya: `src/content/legal.ts`

- [x] **3. Metnin tutarlılığını denetle**
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

- [x] `/kvkk`, `/gizlilik`, `/kullanim-kosullari` sayfaları açılıyor ve yeni metinler görünüyor
- [x] `a11y.mjs` → TOPLAM SORUN: 0
- [x] `font-guard.mjs` → kümede olmayan karakter yok
- [x] `scan.mjs` üç yasal sayfada konsol temiz
- [x] Metinde rakip adı, ROI, müşteri sayısı, "canlı/sahada" ifadesi yok (grep ile denetlendi)
- [x] `docker compose exec web npm run build` hatasız geçer

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-11

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Alt görev 1 ✅** — KVKK Aktarım maddesi tek paragraftan üç parçaya açıldı: giriş cümlesi, üç kalemli tedarikçi listesi (barındırma · elektronik posta gönderimi · **kayıt tutma, Google elektronik tablo**), ölçüm paragrafı ve "pazarlama amacıyla satılmaz" cümlesi. Erişim kontrolü gerçeği kayıt kaleminin içine yazıldı: "bu tabloya yalnızca demo süreciyle ilgilenen hesap erişebilir" — betik sahibinin hesabında koştuğu için bu bugün doğru.
- **Alt görev 2 ✅** — Gizlilik'teki "Çerezler" başlığı **"Çerezler ve ölçüm"** oldu ve iki paragraf eklendi: çerezsiz ölçüm hizmetinin adı (Umami), çerez koymadığı, IP saklamadığı, kişi olarak tanımlamadığı; ve ölçüme neyin gidip neyin gitmediği (sayfa ve bölüm gider; ad, telefon, e-posta, mesaj gitmez).
- **Alt görev 3 ✅** — Tutarlılık taraması üç metinde ve `src/content/` genelinde yapıldı (`çerez`, `takip pikseli`, `analitik`, `ölçüm`, `aktarıl`, `tedarikçi`, `üçüncü taraf`). İki düzeltme çıktı, ikisi de aşağıda "Sorunlar"da.
- Değişen iki metnin `updated` alanı 11 Eylül 2026'ya çekildi; Kullanım Koşulları'na dokunulmadığı için tarihi 10 Eylül'de kaldı.

**Sorunlar:**
- **Ölçüm sağlayıcısı "aktarım" kaleminin içine yazılamazdı.** Task tarifi Umami'yi Aktarım maddesine eklemeyi söylüyor, ama madde "kişisel verileriniz … aktarılabilir" diye açılıyor ve Umami'ye kişisel veri gitmiyor — listeye konsaydı metin **yanlış** beyan olurdu. Çözüm: sağlayıcı aynı maddede ama ayrı bir paragrafta duruyor ve cümle bunu açıkça söylüyor ("Bu hizmete kişisel verileriniz aktarılmaz"). Okuyucu sağlayıcıyı yine öğreniyor, beyan doğru kalıyor.
- **Korunan çerez cümlesi yeni paragrafla çelişik okunuyordu.** "Üçüncü taraf takip pikseli kullanmıyoruz" cümlesinin hemen ardından "çerezsiz bir ölçüm hizmeti kullanıyoruz" gelince sıradan okuyucu için ters düşüyordu. Cümle silinmedi, **keskinleştirildi**: "reklam çerezi, reklam ağı kodu veya sizi **siteler arasında izleyen** bir takip pikseli". İddia korundu, çelişki görüntüsü kalktı.

**Kararlar:**
- **Yurt dışına aktarım bu task'ta yazılmadı** (B-024'ün 2. maddesinin yarısı açık kaldı). Gerekçe: hangi sağlayıcının verisini hangi ülkede işlediği ve aktarımın hukuki dayanağı (açık rıza / standart sözleşme / taahhütname) hukukçu kararıdır — v1'in metni bu ayrımı açıkça yapıyor ("metin yalnız olguyu anlatır, güvence iddiası kurmaz"). Uydurmak yerine bulguya kayıt düşüldü.
- **Barındırma ve e-posta sağlayıcıları adlandırılmadı**, Google ve Umami adlandırıldı. Gerekçe: task kapsamı bu ikisini istiyor; diğer ikisini adlandırmak yurt dışı aktarım beyanını da zorunlu kılar ve yukarıdaki hukukçu kararına bağlanır.
- **Gizlilik'e de bir aktarım paragrafı eklendi** (tarifte yoktu): KVKK akışı anlatırken Gizlilik Politikası hiç anlatmıyordu, bu alt görev 3'ün kendi tutarlılık ölçütüne takıldı. Paragraf ayrıntıyı tekrarlamıyor, KVKK'nın Aktarım başlığına yönlendiriyor.
- docs/DECISIONS.md'ye eklendi: Hayır — metin düzenlemesi; mekanizma kararları (Google Sheet, Umami) zaten kayıtlı.

**Kalan İşler:**
- B-024'ün üç kalemi açık: IP ve hız sınırı amacı KVKK listesine, Gizlilik'in topladığı-veri listesine tarih/saat + tarayıcı bilgisi, form onay metninin genişletilmesi. Ayrıntı ve gerekçe bulgu atomunun Çözüm Kaydı'nda.
- B-008 (hukukçu onayı) açık — bu düzenleme onun yerine geçmez, kapsamına girer.

**Son Yaklaşım:**
Task tek dosyada bitti; pause olmadı. Metin `src/content/legal.ts`'te, bileşende değil — `LegalPage.tsx` okuyor, taşımıyor.

**Sonraki Adım Detayı:**
Yok — task kapandı. Fazda bekleyen TASK-1.06 canlı `/exec` adresine, TASK-1.07/1.08/1.09 ise analitik zincirine bağlı.

**Dosya Değişiklikleri:**
- `src/content/legal.ts` → KVKK Aktarım maddesi (liste + ölçüm paragrafı + erişim kontrolü); Gizlilik "Çerezler" → "Çerezler ve ölçüm" (iki yeni paragraf); Gizlilik "Verilerin kullanımı"na aktarım paragrafı; çerez cümlesi keskinleştirildi; KVKK ve Gizlilik `updated` → 11 Eylül 2026.
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` → Çözüm Kaydı yazıldı: hangi madde kapandı, hangi üçü neden açık kaldı. Bulgu **açık** kalıyor, index kancası zaten doğru (IP · yurt dışı aktarım · onay kapsamı) — `_dev/BULGULAR.md` index'ine bu yüzden dokunulmadı.

**Test Sonuçları:**
<!-- Kapsam: metin değişikliğinin ölçüm kapıları. Kapılar GELİŞTİRME sunucusuna (3000) karşı koştu; üretim konteyneri (3100) bu oturumda yeniden derlenmedi (B-019 — bayat) ve paralel bir oturum çalıştığı için yeniden derlenmesi de tercih edilmedi. -->
- `docker compose exec web npm run build` → hatasız, 23 rota derlendi. **Kapsam uyarısı:** ağaçta paralel bir oturumun commit'lenmemiş `layout.tsx` değişikliği duruyordu, derleme onu da kapsadı — yeşil, bu oturumun değişikliğinin tek başına kanıtı değil ama TypeScript ve prerender yolu temiz.
- `npx eslint src/content/legal.ts` → çıkış 0, uyarı yok.
- Üç yasal sayfa yeni metinle canlı doğrulandı (dev, 3000): `/kvkk` 200 + "Kayıt tutma: …" ve ölçüm paragrafı; `/gizlilik` 200 + "Çerezler ve ölçüm" başlığı, "IP adresinizi saklamaz", aktarım paragrafı; `/kullanim-kosullari` 200 ve tarihi 10 Eylül'de sabit (dokunulmadı).
- `a11y.mjs` → **TOPLAM SORUN: 0** (8 sayfa). **Kapsam:** betiğin sayfa listesi yasal metinlerden yalnız `/kvkk` taşıyor; `/gizlilik` ve `/kullanim-kosullari` bu kapıdan geçmedi — üçü aynı `LegalPage` bileşeninden ve aynı tokenlardan render ediliyor, ama ölçülmemiş olan ölçülmemiştir. Kapının rota kapsamı eksiği zaten kayıtlı (B-012).
- `font-guard.mjs` (BASE=3000) → **kümede olmayan karakter YOK**, 16 sayfa / 79.685 karakter tarandı. Yeni metinde yeni glif yok; kesme işareti düz `'` seçildi (dosyanın mevcut geleneği, `KVKK'nın`).
- `scan.mjs` üç yasal sayfada → **konsol temiz** (`/kvkk` 4 kare · 3.392 px, `/gizlilik` 3 kare · 2.689 px, `/kullanim-kosullari` 3 kare · 2.295 px).
- İddia sınırı taraması (`grep -iE "canlı|sahada|müşterilerimiz|ROI|yüzde|%|sadece bizde|[0-9]+ kulüp"` → `legal.ts`) → **eşleşme yok**. Rakip adı da geçmiyor.

---

**Oluşturulma:** 2026-09-11
