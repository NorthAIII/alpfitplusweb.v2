# TASK-1.15: Yasal metin — kayıt yeri kendi sunucu, ölçüm kendi Umami

**Durum:** ⬜ Bekliyor
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1 kapsamındaki yasal metin (fazın kapsam kararı)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.06 ✅ (talep hattı gerçekte böyle akıyor), TASK-1.07 ✅ (ölçüm gerçekte böyle), TASK-1.09 ✅ (fazın son kod task'ı)

---

## Hedef

`src/content/legal.ts`'teki veri akışı anlatımını 2026-09-13 revizyonundan sonraki gerçeğe hizalamak:

- Demo talebi Google elektronik tablosunda değil, **kendi sunucumuzdaki talep kayıt sisteminde** saklanıyor.
- Ölçüm Umami Cloud'da değil, **aynı sunucudaki kendi Umami kurulumunda** yapılıyor.

Task, KVKK Aktarım maddesi, Gizlilik "Çerezler ve ölçüm" ve "Verilerin kullanımı" paragrafları gerçek akışı anlattığında ve metinde Google adı veri akışı bağlamında kalmadığında tamamlanmış sayılır.

---

## Bağlam

TASK-1.10 (✅, 2026-09-11) metni o günkü kararlara göre yazdı: kayıt tutma "tedarikçimizin (Google) elektronik tablo hizmetinde", ölçüm "Umami". İki karar 2026-09-13'te değişti (`docs/DECISIONS.md`), metin artık **yanlış beyan** taşıyor (`legal.ts:107`, `:208`).

Önizleme `noindex` ve gerçek ziyaretçi almıyor. Metnin gerçekle hizalanması için doğru an fazın sonudur: iki akış da canlıda ölçülmüş olur ve alan adı geçişinden önce kapanır. Alan adı geçişini kilitleyen B-024'ün kalemleri bu task'ın **kapsamı değildir** (aşağıda).

Somut girdiler TASK-1.11'in keşfinden gelir: sunucunun ülkesi ve talep kaydına erişen hesaplar. v1'in tonu örnek alınır: "Kendi sunucumuzdaki analitik (Umami) — Almanya (aynı sunucu)" (alıntı `docs/DECISIONS.md` 2026-09-13).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.10.md` — önceki düzenlemenin kararları (sağlayıcı adlandırma, "aktarım" kaleminin sınırı, yurt dışı aktarımın neden yazılmadığı)
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — sunucu konumu, talep kaydına erişen hesaplar, yedek durumu, KVKK silme/dışa aktarma kapsamı (envanterin (c) sınıfı)
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` — açık kalan üç kalem (bu task kapatmaz)
- `_dev/docs/CLAIMS.md` — iddia sınırı (yasal metin de iddiadır)
- `../Alpfitplus-website.v1/src/i18n/legal.ts` — kendi sunucu ve Umami maddelerinin ton örneği (salt okunur)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` — Gözlem'deki "Google Apps Script → E-Tablo" hedef anlatımının bayatladığı Çözüm Kaydı taslağına not düşülür (bulgu açık kalır)

---

## Alt Görevler

- [ ] **1. KVKK Aktarım maddesini hizala**
  - "Kayıt tutma" kalemi: Google elektronik tablo → kendi sunucumuzdaki talep kayıt sistemi. Konum ve erişim gerçeği TASK-1.11'deki ölçüme göre yazılır ("yalnızca demo süreciyle ilgilenen hesap/ekip")
  - Madde "aktarım" diye açıldığı için kendi sunucu **aktarım** mı **barındırma** mı sayılacağı dürüstçe kurulur. Kendi sunucu bir üçüncü kişi değildir ama barındırma sağlayıcısı üçüncü kişidir. İfade bu ayrımı bozmaz
  - Ölçüm paragrafı: "Umami" → aynı sunucudaki kendi Umami kurulumu; "kişisel verileriniz aktarılmaz" beyanı korunur
  - "Pazarlama amacıyla satılmaz veya devredilmez" cümlesi korunur
  - Dosya: `src/content/legal.ts`

- [ ] **2. Gizlilik metnini hizala**
  - "Çerezler ve ölçüm": ölçüm hizmeti kendi sunucumuzda çalışıyor; çerez yok, IP saklanmıyor, kişi tanımlanmıyor beyanları TASK-1.07'nin gerçeğine göre korunur (kendi kurulumun IP saklamadığı teyit edilmiş olmalı)
  - "Verilerin kullanımı" paragrafı (`legal.ts:208`): "elektronik tablo hizmetinde (Google)" → kendi sunucu; e-posta bildirimi cümlesi korunur (site Resend'le gönderiyor)
  - Değişen metinlerin `updated` alanı tazelenir
  - Dosya: `src/content/legal.ts`

- [ ] **3. Tutarlılığı denetle**
  - `grep -n -i "google\|tablo\|umami\|sunucu\|aktar" src/content/legal.ts` ve `src/content/` geneli: çelişen ya da bayat ifade kalmadı
  - Kullanım Koşulları'nda aynı konuyu anlatan madde varsa hizalı

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts              # Aktarım maddesi, Çerezler ve ölçüm, Verilerin kullanımı — zaten var
```

---

## Dikkat Noktaları

- **Metin `src/content/`'te değişir, bileşende değil** (`LegalPage.tsx` okur, taşımaz).
- **B-024 ve B-008 bu task'ta kapanmaz.** Yurt dışı aktarımın hukuki dayanağı (sunucu Almanya'daysa kendi sunucu da yurt dışıdır), IP ve hız sınırı amacı ve onay metninin kapsamı hukukçu ya da "Yayın öncesi düzeltmeler" fazının işi. Bu task yalnız **olguyu** yazar (nerede, kim erişir); güvence ya da dayanak iddiası kurmaz (TASK-1.10 çizgisi).
- **Uydurulmaz:** konum ve erişim bilgisi TASK-1.11'de ölçülmemişse metne yazılmaz; eksik bilgi kullanıcıya getirilir.
- İddia sınırı yasal metinde de geçerli: rakam, müşteri sayısı, "canlı/sahada" girmez (`docs/CLAIMS.md`).
- Sora'da ₺ yok; yeni karakter girerse `font-guard.mjs` yakalar (STYLE-GUIDE). Kesme işareti düz `'` (dosyanın geleneği).
- `a11y.mjs` yasal metinlerden yalnız `/kvkk`'yı geziyor (B-012). `/gizlilik` ve `/kullanim-kosullari` ölçülmüş sayılmaz, test sonucuna kapsamıyla yazılır.

---

## Test Kriterleri

- [ ] `legal.ts`'te veri akışı bağlamında `Google` ve "elektronik tablo" eşleşmesi yok; kendi sunucu ve kendi Umami anlatımı TASK-1.11 ve TASK-1.07 ölçümleriyle birebir (satır satır karşılaştırma Oturum Kaydı'nda)
- [ ] `/kvkk`, `/gizlilik`, `/kullanim-kosullari` 200 ve yeni metin görünüyor
- [ ] `a11y.mjs` → TOPLAM SORUN: 0 (kapsam: `/kvkk`)
- [ ] `font-guard.mjs` → kümede olmayan karakter yok
- [ ] `scan.mjs` üç yasal sayfada konsol temiz
- [ ] İddia taraması (`canlı|sahada|müşterilerimiz|ROI|yüzde|%|sadece bizde|[0-9]+ kulüp`) `legal.ts`'te eşleşme vermiyor; rakip adı yok
- [ ] `docker compose exec web npm run build` hatasız

---

## Karar Noktaları

- **Konum olgusu yazılsın mı:** v1 deseni konumu olgu olarak yazıyor ("Almanya (aynı sunucu)"). TASK-1.10 ise yurt dışı aktarımı hukukçu kararına bıraktı. **Önerilen:** konum olgu olarak yazılır, hukuki dayanak yazılmaz, B-024'ün yurt dışı kalemine not düşülür. Kullanıcıya teyit ettirilir.

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

**Oluşturulma:** 2026-09-13 (plan revizyonu)
