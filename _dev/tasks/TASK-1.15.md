# TASK-1.15: Yasal metin — kayıt yeri kendi sunucudaki lead deposu, ölçüm kendi Umami

**Durum:** ⬜ Bekliyor
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1 kapsamındaki yasal metin (fazın kapsam kararı)
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.06 ✅ (talep hattı gerçekte böyle akıyor), TASK-1.07 ✅ (ölçüm gerçekte böyle), TASK-1.09 ✅ (fazın son kod task'ı)

---

## Hedef

`src/content/legal.ts`'teki veri akışı anlatımını fazın vardığı gerçeğe hizalamak:

- Demo talebi Google elektronik tablosunda değil, **kendi sunucumuzdaki lead deposunda** (Almanya) saklanıyor ve 12 ay sonra otomatik siliniyor.
- Ölçüm Umami Cloud'da değil, **aynı sunucudaki kendi Umami kurulumunda** yapılıyor.

Task şu koşullar sağlandığında tamamlanmış sayılır:

- KVKK Aktarım maddesi, Saklama maddesi, Gizlilik "Çerezler ve ölçüm" ve "Verilerin kullanımı" paragrafları gerçek akışı anlatıyor.
- Metinde Google adı veri akışı bağlamında kalmamış.
- Saklama beyanı deponun saklama süresiyle çelişmiyor.

---

## Bağlam

TASK-1.10 (✅, 2026-09-11) metni o günkü kararlara göre yazdı: kayıt tutma "tedarikçimizin (Google) elektronik tablo hizmetinde", ölçüm "Umami". İkisi de sonradan değişti:

- Analitik 2026-09-13'te kendi Umami oldu.
- Kayıt yeri 2026-09-14'te v1'in lead deposu oldu (`docs/DECISIONS.md`).

Metin bu yüzden artık **yanlış beyan** taşıyor (`legal.ts:107`, `:208`).

Deponun olguları ölçülmüş ve v1 reposunda yazılıdır. Uydurulacak bir şey yok:

- **Konum:** Hetzner, Nürnberg, Almanya (`178.104.140.36`, RDAP ülke DE; TASK-1.11 keşfi 5. madde).
- **Erişim:** depo koleksiyonlarının beş API kuralı `null`, yani okuma ve yazma yalnız superuser hesabıyla (panel `lead.alpfitplus.com/_/`). Site yalnız token'lı yazma ucunu kullanıyor.
- **Saklama:** kayıt oluşturulmasından 12 ay sonra günlük cron'la siliniyor (`../Alpfitplus-website.v1/pocketbase/README.md` → Saklama politikası; `lead_lib.js` → `RETENTION_MONTHS`).
- **Kayda ne girer:** ad, kulüp, telefon, e-posta, şube, mesaj, `ip_hash` (tuzlu özet, ham IP değil) ve bildirim durumu. `segment`'in yeri TASK-1.14 kararıdır.

v2'nin bugünkü Saklama maddesi "talebin sonuçlanmasından itibaren en fazla iki yıl" diyor (`legal.ts:125`). Depo 12 ayda siliyor. Cümle yanlış değil (12 ay iki yılın içinde) ama eksik. Ekip posta kutusundaki bildirim kopyası, Resend'deki e-posta ve Umami kayıtları o süreye bağlı değil. v1'in metni bunu kopya kopya ayırıyor (`../Alpfitplus-website.v1/src/i18n/legal.ts:128-140`), ton örneği oradan alınır.

Önizleme `noindex` ve gerçek ziyaretçi almıyor. Metnin gerçekle hizalanması için doğru an fazın sonu: iki akış da canlıda ölçülmüş olur ve alan adı geçişinden önce kapanır. Alan adı geçişini kilitleyen B-024'ün kalemleri bu task'ın **kapsamı değildir** (aşağıda).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.10.md` — önceki düzenlemenin kararları (sağlayıcı adlandırma, "aktarım" kaleminin sınırı, yurt dışı aktarımın neden yazılmadığı)
- `_dev/tasks/archive/TASK-1.11-BUNKER-KESFI.md` → 5. madde — sunucu konumunun ölçümü
- `_dev/tasks/archive/TASK-1.11.md` → Oturum 2026-09-14 — deponun erişim ve KVKK (c) sınıfı: silme/dışa aktarma superuser panelinden elle
- `_dev/tasks/archive/TASK-1.06.md` ve `TASK-1.14.md` → Oturum Kayıtları — kayda gerçekte ne girdiği (`segment` yeri, `notify_*`)
- `_dev/tasks/archive/TASK-1.07.md` → Oturum Kayıtları — Umami 3.1.0 çerez/IP ölçümü; Gelen Kutusu'ndaki iki `[TASK-1.07]` notu (nginx logları, oturum kaydı özelliği)
- `../Alpfitplus-website.v1/pocketbase/README.md` → Saklama politikası (salt okunur)
- `../Alpfitplus-website.v1/src/i18n/legal.ts` — aynı deponun ve aynı Umami'nin yayındaki anlatımı: aktarım listesi (`:99-101`), saklama kopyaları (`:128-140`) — ton ve olgu örneği (salt okunur)
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` — açık kalan kalemler (bu task kapatmaz)
- `_dev/docs/CLAIMS.md` — iddia sınırı (yasal metin de iddiadır)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` — Gözlem'deki "Google Apps Script → E-Tablo" hedef anlatımının bayatladığı Çözüm Kaydı taslağına not düşülür (bulgu açık kalır)

---

## Alt Görevler

- [ ] **1. KVKK Aktarım maddesini hizala**
  - "Kayıt tutma" kalemi: Google elektronik tablo → kendi sunucumuzdaki lead deposu, Almanya. Erişim gerçeği ölçülene göre yazılır: "yalnızca yetkili yönetici hesabı erişir"
  - Madde "aktarım" diye açıldığı için kendi sunucunun **aktarım** mı **barındırma** mı sayılacağı dürüstçe kurulur. Kendi sunucu bir üçüncü kişi değildir ama barındırma sağlayıcısı üçüncü kişidir. İfade bu ayrımı bozmaz
  - Ölçüm paragrafı: "Umami" → aynı sunucudaki kendi Umami kurulumu; "kişisel verileriniz aktarılmaz" beyanı korunur
  - "Pazarlama amacıyla satılmaz veya devredilmez" cümlesi korunur
  - Dosya: `src/content/legal.ts`

- [ ] **2. Saklama maddesini hizala**
  - Depo kaydı: oluşturulmasından 12 ay sonra otomatik silinir
  - Kalan kopyalar (ekip posta kutusundaki bildirim, e-posta sağlayıcısındaki ileti) ayrı cümlede; süre iddiası kurulmaz, olgu yazılır (v1 deseni)
  - "Talebiniz üzerine daha erken silinir" beyanı korunur. Depoda silme superuser panelinden elle yapılıyor, yani bu beyan bugün **karşılanabilir**
  - Dosya: `src/content/legal.ts`

- [ ] **3. Gizlilik metnini hizala**
  - "Çerezler ve ölçüm": ölçüm hizmeti kendi sunucumuzda çalışıyor. Çerez yok, IP saklanmıyor, kişi tanımlanmıyor beyanları TASK-1.07'nin gerçeğine göre korunur. "IP saklanmaz" yalnız Umami veritabanı için ölçüldü (nginx logu ölçülmedi, Gelen Kutusu). Cümle bu kapsamı aşmaz
  - "Verilerin kullanımı" paragrafı (`legal.ts:208`): "elektronik tablo hizmetinde (Google)" → kendi sunucudaki lead deposu; e-posta bildirimi cümlesi korunur (site Resend'le gönderiyor)
  - Değişen metinlerin `updated` alanı tazelenir
  - Dosya: `src/content/legal.ts`

- [ ] **4. Tutarlılığı denetle**
  - `grep -n -i "google\|tablo\|umami\|sunucu\|aktar\|sakla\|yıl\|ay " src/content/legal.ts` ve `src/content/` geneli: çelişen ya da bayat ifade kalmadı
  - Kullanım Koşulları'nda aynı konuyu anlatan madde varsa hizalı

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts              # Aktarım, Saklama, Çerezler ve ölçüm, Verilerin kullanımı — zaten var
```

---

## Dikkat Noktaları

- **Metin `src/content/`'te değişir, bileşende değil** (`LegalPage.tsx` okur, taşımaz).
- **B-024 ve B-008 bu task'ta kapanmaz.** Kapsam dışı kalanlar: yurt dışı aktarımın hukuki dayanağı (sunucu Almanya'da, yani kendi sunucu da yurt dışıdır), IP ve hız sınırı amacı, onay metninin kapsamı. Bunlar hukukçunun ya da "Yayın öncesi düzeltmeler" fazının işi. Bu task yalnız **olguyu** yazar: nerede, kim erişir, ne kadar kalır. Güvence ya da dayanak iddiası kurmaz (TASK-1.10 çizgisi).
- **v1'in metni olgu kaynağıdır, kopya kaynağı değil.** v1 yurt dışı aktarımı ve dayanağını açıkça yazıyor; v2'de o karar B-024'ün hukukçu kalemi. v1'den cümle taşınırken dayanak iddiası taşınmaz.
- **`ip_hash` KVKK listesine girer mi:** kayda tuzlu IP özeti giriyor. TASK-1.10'un listesi IP'yi anmıyor (B-024'ün IP kalemi). Bu task olguyu Aktarım/Saklama cümlesinde yanlış anlatmaz ama IP kalemini kapatmaya girişmez. Oturum Kaydı'na not.
- **Uydurulmaz:** Bağlam'daki olgulardan biri icrada farklı çıkarsa (ör. v1 `RETENTION_MONTHS` değişmiş) metne ölçülen yazılır, eksik bilgi kullanıcıya getirilir.
- İddia sınırı yasal metinde de geçerli: rakam, müşteri sayısı, "canlı/sahada" girmez (`docs/CLAIMS.md`). "12 ay" bir saklama süresidir, performans rakamı değil.
- Sora'da ₺ yok; yeni karakter girerse `font-guard.mjs` yakalar (STYLE-GUIDE). Kesme işareti düz `'` (dosyanın geleneği).
- `a11y.mjs` yasal metinlerden yalnız `/kvkk`'yı geziyor (B-012). `/gizlilik` ve `/kullanim-kosullari` ölçülmüş sayılmaz, test sonucuna kapsamıyla yazılır.

---

## Test Kriterleri

- [ ] `legal.ts`'te veri akışı bağlamında `Google` ve "elektronik tablo" eşleşmesi yok. Depo, konum, erişim, saklama ve Umami anlatımı ölçümlerle birebir; satır satır karşılaştırma tablosu Oturum Kaydı'nda (kaynak: TASK-1.11, TASK-1.07, v1 `pocketbase/README.md`)
- [ ] Saklama maddesi depo için 12 ayı söylüyor, başka kopyalar için süre iddiası kurmuyor
- [ ] `/kvkk`, `/gizlilik`, `/kullanim-kosullari` 200 ve yeni metin görünüyor
- [ ] `a11y.mjs` → TOPLAM SORUN: 0 (kapsam: `/kvkk`)
- [ ] `font-guard.mjs` → kümede olmayan karakter yok
- [ ] `scan.mjs` üç yasal sayfada konsol temiz
- [ ] İddia taraması (`canlı|sahada|müşterilerimiz|ROI|yüzde|%|sadece bizde|[0-9]+ kulüp`) `legal.ts`'te eşleşme vermiyor; rakip adı yok
- [ ] `docker compose exec web npm run build` hatasız

---

## Karar Noktaları

- **Konum olgusu yazılsın mı:** v1 deseni konumu olgu olarak yazıyor ("Almanya (Hetzner, Nürnberg)"). TASK-1.10 ise yurt dışı aktarımı hukukçu kararına bıraktı. **Önerilen:** konum olgu olarak yazılır, hukuki dayanak yazılmaz, B-024'ün yurt dışı kalemine not düşülür. Kullanıcıya teyit ettirilir.

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

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Güncellendi:** 2026-09-14 (plan revizyonu — kayıt yeri v1'in lead deposu, saklama maddesi kapsama girdi)
