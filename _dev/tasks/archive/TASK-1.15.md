# TASK-1.15: Yasal metin — kayıt yeri kendi sunucudaki lead deposu, ölçüm kendi Umami

**Durum:** ✅ Tamamlandı (2026-09-22)
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

- [x] **1. KVKK Aktarım maddesini hizala**
  - "Kayıt tutma" kalemi: Google elektronik tablo → kendi sunucumuzdaki lead deposu, Almanya. Erişim gerçeği ölçülene göre yazılır: "yalnızca yetkili yönetici hesabı erişir"
  - Madde "aktarım" diye açıldığı için kendi sunucunun **aktarım** mı **barındırma** mı sayılacağı dürüstçe kurulur. Kendi sunucu bir üçüncü kişi değildir ama barındırma sağlayıcısı üçüncü kişidir. İfade bu ayrımı bozmaz
  - Ölçüm paragrafı: "Umami" → aynı sunucudaki kendi Umami kurulumu; "kişisel verileriniz aktarılmaz" beyanı korunur
  - "Pazarlama amacıyla satılmaz veya devredilmez" cümlesi korunur
  - Dosya: `src/content/legal.ts`

- [x] **2. Saklama maddesini hizala**
  - Depo kaydı: oluşturulmasından 12 ay sonra otomatik silinir
  - Kalan kopyalar (ekip posta kutusundaki bildirim, e-posta sağlayıcısındaki ileti) ayrı cümlede; süre iddiası kurulmaz, olgu yazılır (v1 deseni)
  - "Talebiniz üzerine daha erken silinir" beyanı korunur. Depoda silme superuser panelinden elle yapılıyor, yani bu beyan bugün **karşılanabilir**
  - Dosya: `src/content/legal.ts`

- [x] **3. Gizlilik metnini hizala**
  - "Çerezler ve ölçüm": ölçüm hizmeti kendi sunucumuzda çalışıyor. Çerez yok, IP saklanmıyor, kişi tanımlanmıyor beyanları TASK-1.07'nin gerçeğine göre korunur. "IP saklanmaz" yalnız Umami veritabanı için ölçüldü (nginx logu ölçülmedi, Gelen Kutusu). Cümle bu kapsamı aşmaz
  - "Verilerin kullanımı" paragrafı (`legal.ts:208`): "elektronik tablo hizmetinde (Google)" → kendi sunucudaki lead deposu; e-posta bildirimi cümlesi korunur (site Resend'le gönderiyor)
  - Değişen metinlerin `updated` alanı tazelenir
  - Dosya: `src/content/legal.ts`

- [x] **4. Tutarlılığı denetle**
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

- [x] `legal.ts`'te veri akışı bağlamında `Google` ve "elektronik tablo" eşleşmesi yok. Depo, konum, erişim, saklama ve Umami anlatımı ölçümlerle birebir; satır satır karşılaştırma tablosu Oturum Kaydı'nda (kaynak: TASK-1.11, TASK-1.07, v1 `pocketbase/README.md`)
- [x] Saklama maddesi depo için 12 ayı söylüyor, başka kopyalar için süre iddiası kurmuyor
- [x] `/kvkk`, `/gizlilik`, `/kullanim-kosullari` 200 ve yeni metin görünüyor
- [x] `a11y.mjs` → TOPLAM SORUN: 0 (kapsam: `/kvkk`)
- [x] `font-guard.mjs` → kümede olmayan karakter yok
- [x] `scan.mjs` üç yasal sayfada konsol temiz
- [x] İddia taraması (`canlı|sahada|müşterilerimiz|ROI|yüzde|%|sadece bizde|[0-9]+ kulüp`) `legal.ts`'te eşleşme vermiyor; rakip adı yok
- [x] `docker compose exec web npm run build` hatasız

---

## Karar Noktaları

- **Konum olgusu yazılsın mı:** ✅ **Önerilen seçildi** — konum olgu olarak yazıldı ("Almanya'da (Nürnberg) bir veri merkezinde durur"), hukuki dayanak yazılmadı, B-024'ün yurt dışı kalemine not düşüldü. Kullanıcıya sorulmadı: koşum açılışındaki duran yetkilendirme tercih bekleyen duruşları devrediyor ve task metninin kendi **Önerilen** seçeneği gerekçeliydi (TASK-1.14 emsali). **Alt karar:** barındırma sağlayıcısının ticari adı (Hetzner) yazılmadı — Karar Noktası "konum" diyor, sağlayıcı adı değil; TASK-1.10'un "altyapı tedarikçisi adlandırılmaz" çizgisi korundu. Konumun kendisi (ülke + şehir) ziyaretçiye anlam taşıdığı için yazıldı.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-22 (run-phase turu, alt ajan)

**Durum:** ✅ Tamamlandı

**Yapılanlar:**

- **Alt görev 1 ✅ — KVKK Aktarım maddesi.** Madde artık beş parça: (1) YENİ giriş paragrafı kaydın evini, konumunu ve erişimini anlatıyor; (2) korunan "tedarikçilerimize aktarılabilir" cümlesi; (3) liste — "Kayıt tutma: … Google elektronik tablo" kalemi **düştü**, yerine `Sunucu barındırma: kayıt veritabanımızın çalıştığı sunucunun bulunduğu veri merkezi` geldi; (4) ölçüm paragrafı kendi kuruluma çevrildi, "kişisel verileriniz aktarılmaz" beyanı korundu; (5) "pazarlama amacıyla satılmaz" cümlesi korundu.
  - **Aktarım/barındırma ayrımı dürüstçe kuruldu:** kaydın kendisi bir üçüncü kişiye gitmiyor (kendi sunucumuz), ama sunucunun durduğu veri merkezi bir tedarikçi — bu yüzden kayıt *listeden çıktı*, veri merkezi *listeye girdi*. Kayıt kaleminin listede kalması metni yanlış beyan yapardı (TASK-1.10'un Umami'yi listeye koymama gerekçesinin eşi).
- **Alt görev 2 ✅ — Saklama süresi.** "en fazla iki yıl" tek cümlesi iki paragrafa açıldı (v1 deseni): depo kaydı **12 ay**, günlük temizlik işiyle otomatik siliniyor + "talebiniz üzerine daha erken" beyanı korundu; ikinci paragraf diğer kopyaları (ekip posta kutusu, e-posta sağlayıcısı) **süre iddiası kurmadan** sayıyor ve "bugün için otomatik bir silme süresi işletmiyoruz" diyor.
- **Alt görev 3 ✅ — Gizlilik.** "Çerezler ve ölçüm" → ölçüm yazılımı kendi sunucumuzda; çerez/IP/kimlik beyanları TASK-1.07'nin ölçtüğü kapsamda korundu (IP cümlesi "kayıtlarında IP adresinizi tutmaz" diye **daraltıldı**, aşağı bak); ölçüme ne gittiği paragrafına sorgu dizesi olgusu eklendi. "Verilerin kullanımı" → "elektronik tablo hizmetinde (Google)" gitti, yerine kendi sunucudaki kayıt veritabanı; yönlendirme artık Saklama süresi başlığını da gösteriyor. KVKK ve Gizlilik `updated` → 22 Eylül 2026 (Kullanım Koşulları'na dokunulmadı, 10 Eylül'de kaldı).
- **Alt görev 4 ✅ — Tutarlılık.** `legal.ts` ve `src/` geneli tarandı (aşağı Test Sonuçları). Bir çelişki **bu oturumun kendi düzenlemesinden** doğdu ve kapatıldı: Gizlilik → Güvenlik "yalnızca demo süreciyle ilgilenen ekip üyeleri erişebilir" diyordu, yeni Aktarım paragrafı ise "yalnızca yetkili yönetici hesabımız" diyor. İkisi aynı olguyu iki farklı çerçevede anlatıyordu; Güvenlik cümlesi ölçülen hâle (`yalnızca yetkili yönetici hesabımız erişebilir`) hizalandı. Kullanım Koşulları'nda veri akışını anlatan madde yok — dokunulmadı.

**Cümle ↔ olgu karşılaştırması (test kriteri 1):**

| Metindeki ifade | Olgu | Kaynak — ölçüm |
|---|---|---|
| "kendi sunucumuzdaki bir kayıt veritabanına yazılır" | `POST ${LEAD_STORE_URL}/lead` → v1'in PocketBase deposu | **bu oturum:** `src/app/api/demo/route.ts:115-131` okundu; `getent hosts lead.alpfitplus.com` → `178.104.140.36` |
| "Sunucu bize aittir ve Almanya'da (Nürnberg) bir veri merkezinde durur" | `178.104.140.36` → RIPE RDAP `CLOUD-NBG1`, `country: DE`, kayıt sahibi *Hetzner Online GmbH* | **bu oturum:** RDAP GET (kimliksiz), 2026-09-22 |
| "kaydın kendisi bir üçüncü kişiye aktarılmaz" | Depo v1'in kendi sunucusunda; Bunker/n8n/rapor okuyucusu 0 | devralındı: TASK-1.11 → Oturum 2026-09-14 |
| "yalnızca yetkili yönetici hesabımız görebilir … okuma kuralları kapalıdır" | Koleksiyonun beş API kuralı da `null` → yalnız superuser | **bu oturum:** `pb_migrations/1785184594_created_leads_and_leads_preview.js:105-109` okundu |
| "sitenin kullandığı anahtar yalnızca yeni kayıt oluşturabilir, var olan kayıtları okuyamaz" | Token'la erişilen iki rota var — `POST /lead`, `PATCH /lead/{id}`; PATCH beyaz listesi yalnız `notify_*`. Okuma rotası yok | **bu oturum:** `pb_hooks/lead.pb.js:20,111` + `lead_lib.js:66-69,158` okundu |
| "oluşturulmasından 12 ay sonra, günlük çalışan bir temizlik işiyle otomatik olarak silinir" | `RETENTION_MONTHS = 12`; `cronAdd('lead-retention','30 3 * * *')`; `leads` **ve** `leads_preview` temizleniyor | **bu oturum:** `lead_lib.js:37`, `retention.pb.js` okundu; `pocketbase/README.md:42,265-277` |
| "Talebiniz ayrıca elektronik posta ile bize bildirilir … bir kopyası da e-postayı ileten sağlayıcıda kalır" | Resend `POST /emails` → `DEMO_TO`; gönderim `delivered` | **bu oturum:** `route.ts:201-237` okundu · devralındı: TASK-1.06 → Oturum 2026-09-21 |
| "bugün için otomatik bir silme süresi işletmiyoruz" (diğer kopyalar) | Tek silme mekanizması depo cron'u; posta kutusu ve gönderim sağlayıcısı için mekanizma yok | v1 `src/i18n/legal.ts:126-133` yorumunun aynı gerekçesi; repoda başka cron yok |
| "kayıt veritabanıyla aynı sunucuda kendi kurduğumuz … ölçüm yazılımı (Umami)" | `umami.kiwiailab.com` → `178.104.140.36` — **deponun IP'siyle aynı** | **bu oturum:** `getent hosts`, 2026-09-22 |
| "tarayıcınıza çerez yerleştirmez" | Üç sayfa gezildikten sonra bağlamda çerez sayısı 0; yanıtlarda `Set-Cookie` yok | devralındı: TASK-1.07 → 2026-09-22 ve 2026-09-21 kayıtları |
| "kayıtlarında IP adresinizi tutmaz" | Umami 3.1.0 şemasının `session` tablosunda IP sütunu yok | devralındı: `TASK-1.07-OTURUM-KAYITLARI.md:25` — **kapsam: Umami veritabanı**; nginx erişim logu ölçülmedi, cümle o kapsamı aşmıyor |
| "adres satırında soru işaretinden sonra gelen kısım ölçüme hiç gönderilmez" | `data-exclude-search="true"`; canlı yükte `url` = `/demo`, sorgu dizesi silinmiş | devralındı: TASK-1.07 → 2026-09-22 (B-056 kanıtı) |
| "Ölçüm için üçüncü bir tarafa veri göndermiyoruz" | `grep -rn "cloud.umami.is" src .env.example` → 0 eşleşme | devralındı: TASK-1.07 kriter 4 |

**Sorunlar:**
- **"IP adresinizi saklamaz" cümlesi olduğu gibi korunamazdı.** Eski cümle kapsamsızdı; ölçüm yalnız Umami'nin **veritabanı** için var (nginx erişim logu hiç ölçülmedi — Gelen Kutusu'ndaki `[TASK-1.07]` notu). Cümle silinmedi, **daraltıldı**: "kayıtlarında IP adresinizi tutmaz". Beyan artık ölçülen kapsamın tam sınırında duruyor.
- **Aktarım maddesindeki "Barındırma" kalemi iki farklı sağlayıcıyı tek satırda topluyordu.** Kaydın sunucusunun Almanya'da olduğunu yazınca, aynı satırda duran sitenin barındırılması da Almanya'daymış gibi okunuyordu (yanlış ima). Kalem ikiye ayrıldı: "Barındırma" (site + form ucu, adsız — TASK-1.10 çizgisi) ve "Sunucu barındırma" (kayıt veritabanının veri merkezi).

**Kararlar:**
- **Konum olgu olarak yazıldı, sağlayıcı adı yazılmadı** — gerekçe yukarı "Karar Noktaları".
- **Ölçüm kayıtları Saklama süresi maddesine EKLENMEDİ.** v1'in saklama listesi analitiği ve sunucu erişim kayıtlarını da sayıyor; v2'nin maddesi "demo talebinize ilişkin veriler" diye açılıyor ve ölçüm kayıtları bir demo talebine ait değil (Aktarım maddesi zaten "sizi kişi olarak tanımlamaz" diyor). Sunucu erişim kayıtları ise **ölçülmedi** — ölçülmemiş bir davranış yasal metne yazılmaz.
- **KVKK "İşlenen kişisel veriler" listesine dokunulmadı.** `ip_hash` ve IP kalemi B-024'ün 1. maddesi, bu task'ın kapsamı dışında (task Dikkat Noktaları). Yeni cümleler kayda **ne girdiğini saymıyor**, bu yüzden liste ile çelişmiyor. Not: uç `ua`'yı (tarayıcı bilgisi) hâlâ okuyor ama depo gövdesine ve e-posta metnine **koymuyor** (`route.ts:118-129`, `:215-229`) — yani KVKK listesi bugün olduğundan fazlasını sayıyor; kalem B-024 (3) ile aynı evde, Gelen Kutusu'na pointer düşüldü.
- docs/DECISIONS.md'ye eklendi: **Hayır** — metin hizalaması; dayandığı mekanizma kararları (lead hedefi 2026-09-14, kendi Umami 2026-09-13) zaten kayıtlı, yeni bir sözleşme doğmadı.

**Kalan İşler:** Yok — task tam kapandı. B-024 ve B-008 bilerek açık kalıyor (hukukçu kalemleri).

**Son Yaklaşım:** N/A — pause olmadı, task tek oturumda bitti.

**Sonraki Adım Detayı:** N/A — fazın son task'ı. Sıradaki adım `/devflow:verify-phase`.

**Dosya Değişiklikleri:**
- `src/content/legal.ts` → KVKK Aktarım (yeni giriş paragrafı, liste kalemi değişimi, ölçüm paragrafı); KVKK Saklama süresi (12 ay + kopyalar paragrafı); Gizlilik "Çerezler ve ölçüm" iki paragraf; Gizlilik "Verilerin kullanımı"; Gizlilik "Güvenlik" erişim cümlesi; KVKK + Gizlilik `updated` → 22 Eylül 2026
- `_dev/bulgular/B-024-…md` → Çözüm Kaydı'na 2026-09-22 notu (hedef anlatımı bayatladı; bulgu **açık** kalıyor)
- `_dev/BULGULAR.md` → Gelen Kutusu'na iki `[TASK-1.15]` pointer satırı
- `_dev/DURUM.md`, `_dev/phases/PHASE-1.md` → 1.15 ✅, Adım `verify`

**Test Sonuçları:**
<!-- Kapsam: metin değişikliğinin ölçüm kapıları. Kapılar GELİŞTİRME sunucusuna (3000) karşı koştu; `web-prod` (3100) bu oturumda yeniden derlenmedi — bu oturumun başlatmadığı bir servis ve değişiklik yalnız içerik metni. -->
- **`docker compose exec web npm test`** → 5 dosya / **61 PASS** + 1 skipped (`lead-store.contract`, env kapısı kapalı). TASK-1.09 tabanıyla **birebir aynı**.
- **`npx tsc --noEmit`** → çıkış 0. **`npx eslint src/content/legal.ts`** → çıkış 0, çıktı yok.
- **`docker compose exec web npm run build`** → hatasız, **23 rota**. Ardından `docker compose restart web` (DURUM'daki ihtiyat notu); sunucu döndükten sonra `/kvkk` 200 ve yeni metin yerinde.
- **Üç yasal sayfa canlı doğrulandı (dev, 3000):** `/kvkk` 200 · `/gizlilik` 200 · `/kullanim-kosullari` 200. Her yeni cümle tek tek arandı ve **birer** kez bulundu; `Google`, "elektronik tablo" ve "en fazla iki yıl" **0** eşleşme. Kullanım Koşulları'nın tarihi 10 Eylül'de sabit (dokunulmadı).
- **`a11y.mjs`** → **TOPLAM SORUN: 0** (8 sayfa). **Kapsam:** yasal metinlerden yalnız `/kvkk` bu kapıdan geçiyor; `/gizlilik` ve `/kullanim-kosullari` ölçülmedi (B-012 — rota listesi eksiği, bu oturumun konusu değil).
- **`font-guard.mjs`** (BASE=3000, `network_mode: host`) → **kümede olmayan karakter YOK**; 16 sayfa / **80.487** karakter (TASK-1.10 tabanı 79.685 → +802, eklenen metin kadar). Yeni glif girmedi; kesme işareti düz `'` (dosyanın geleneği).
- **`scan.mjs` üç yasal sayfada → konsol temiz:** `/kvkk` 5 kare · 3.619 px (taban 4 kare · 3.392 px — metin uzadı), `/gizlilik` 3 kare · 2.689 px (taban aynı), `/kullanim-kosullari` 3 kare · 2.295 px (taban aynı).
- **`mobile-audit.mjs`** (kriter dışı regresyon kapısı) → 9 sayfada **yatay kaydırma: yok**, taşan eleman yalnız `/demo`'nun bal küpü (`left-[-9999px]`, bilinen). **Kapsam uyarısı:** betiğin rota listesi yasal sayfaların hiçbirini gezmiyor (B-012) — yani bu yeşil, bu oturumun değiştirdiği sayfaların kanıtı **değil**, yalnız regresyon yokluğunun.
- **İddia sınırı taraması** → `grep -inE "canlı|sahada|müşterilerimiz|ROI|yüzde|%|sadece bizde|[0-9]+ kulüp" src/content/legal.ts` → **eşleşme yok** (çıkış 1). Rakip adı da geçmiyor.
- **Tutarlılık taraması** → `grep -rni "google|elektronik tablo|e-tablo|spreadsheet" src/` → `legal.ts`'te **0**. `src/` genelinde kalan dört `Google` eşleşmesi veri akışı değil ürün/müşteri bağlamı: `ozellikler/page.tsx:121` ve `FounderProgram.tsx:94` "Apple Health ve Google Fit" (ürün entegrasyonu), `gecis.ts:42` "Excel veya Google Sheets" (kulübün bugün kullandığı araç), `Icon.tsx` `FileSpreadsheet` (ikon adı).
- **Kapı sınaması (run-task Adım 3, ikinci madde):** bu task bir doğrulama/kabul kapısı **üretmedi** (validator, lint kuralı, guard ya da "şu olmamalı" testi yok — çıktı yalnız metin). Madde düşer.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-22

**Ne Yapıldı:**
- `src/content/legal.ts`'teki veri akışı anlatımı fazın vardığı gerçeğe hizalandı: kayıt yeri Google elektronik tablosu değil **kendi sunucumuzdaki kayıt veritabanı** (Almanya, Nürnberg; yalnız yetkili yönetici hesabı okuyabiliyor), saklama **12 ay** (günlük temizlik işi), ölçüm **aynı sunucudaki kendi Umami kurulumu**.
- Saklama maddesi v1'in desenine geçti: süre iddiası yalnız silme mekanizması olan kopya için kuruldu, diğer kopyalar süre iddiası olmadan sayıldı.
- Metindeki her olgu bu oturumda ya doğrudan ölçüldü (RDAP, DNS, depo kaynak kodu, cron sabiti, API kuralları, rota beyaz listesi) ya da kaynağı işaretlenerek devralındı — karşılaştırma tablosu Oturum Kaydı'nda.

**Öğrenilenler:**
- "Aktarım" başlıklı bir madde kendi sunucumuzdaki kaydı **liste kalemi** olarak taşıyamıyor: kayıt aktarılmıyor, aktarılan şey sunucunun durduğu veri merkezinin hizmeti. Kalemi listeden çıkarıp veri merkezini listeye koymak metni hem doğru hem daha bilgilendirici yaptı — TASK-1.10'un Umami'yi listeye koymama kararının aynı ailesinden.
- Bir olguyu yazmak komşu bir cümleyi sessizce yanlış yapabiliyor: kaydın ülkesini yazmak, aynı listede adsız duran site barındırmasını da o ülkedeymiş gibi okuttu. Yeni olgu eklerken **çevresindeki cümlelerin imasını** da okumak gerekiyor.

---

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Güncellendi:** 2026-09-14 (plan revizyonu — kayıt yeri v1'in lead deposu, saklama maddesi kapsama girdi) · **Tamamlandı:** 2026-09-22
