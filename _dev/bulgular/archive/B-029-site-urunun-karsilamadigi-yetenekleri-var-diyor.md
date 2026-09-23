# B-029: Site, ürünün bugün karşılamadığı beş yeteneği "var" diye sunuyor

**Önem:** 🔴 | **Tip:** hata / iddia uyumu | **Alan:** M1 — İçerik ve iddia kaynağı (M2 render yüzeyleri)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** ✅ Çözüldü

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → ürün **pilot aşamada**; karşılanmayan iddia yayınlanmaz. `/ozellikler` sayfası bunu kendi bölüm başlığında taahhüt ediyor (`src/app/ozellikler/page.tsx:86`): *"Bu üç kolonu ayrı tutuyoruz. **Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz.**"* `ILKELER.md` → "Kanıtsız iddia yayınlanmaz".

**Gözlenen:** Beş yetenek iddiası ürün kodunda karşılıksız. Dördünde ürünün **kendi kaydı** bunu açıkça söylüyor.

| # | Sitenin dediği | Ürünün gerçeği | Render edildiği rotalar |
|---|---|---|---|
| 1 | "Bir üyenin üyeliği, PT geçmişi, **ölçümü**, ödemesi ve **diyetisyen notu** tek ekranda" (`product.ts:129`) + ✓ maddeleri `:133` "Ölçüm grafiği", `:135` "Diyetisyen programı ve dosyaları" | Ürün paneli o ekranın altında **"Yakında — Ölçüm grafiği ve diyetisyen notu bu fazda henüz yok — Üye 360 tam fazında (W8) gelecek."** kutusu render ediyor (`../Alpfit.v1/web/src/i18n/tr.json` → `member.upcoming`; render `MemberDetailPage.tsx:320-324`) | `/`, `/ozellikler`, `/segmentler/boks-dovus`, `/segmentler/cok-subeli-zincir` |
| 2 | "**İptal eşiğini siz belirlersiniz.**" (`segments.ts:71`) | Eşik kod sabiti: `backend/src/routes/reservations-cancel.ts:55` `CANCEL_THRESHOLD_MS = 24*60*60*1000`. Ayarlanabilirlik ürünün kendi notunda **v1.5 adayı** ve adıyla anılıyor (`backend/src/queue.ts:46-49`: *"Sabit varsayılan — ayarlanabilirliği kulüp-ölçekli ayar tablosuna bağlı ve o tablo v1.5 adayı … **iptal eşiği** · bekleme onay penceresi · hatırlatma öncesi süre birlikte"*). Sitede gerçek değer (24 saat) **hiç yazmıyor** | `/segmentler/pilates-reformer` |
| 3 | "Randevu, grup ve **üyelik bitişi push'u**" (`product.ts:214`), "Üyelik bitişine yaklaşan üyeye bildirim" (`:217`), "bitişe yaklaşan üyelere **bildirim gider**" (`segments.ts:207`) | `notification.service.ts`'in **12 gönderim fonksiyonunun hiçbiri** üyelik bitişi göndermiyor. Var olan tek şey rapor girdisi — `membership-expiry.service.ts:5-7`: *"bitişe yaklaşan üyeler **raporunun** girdisi. **İleride** churn paneli / push uyarısı için de yeniden kullanılabilir"*. Tüketicileri: okuma ucu + rapor üreticisi + ReportsPage; bildirim tüketicisi yok | `/`, `/ozellikler`, `/segmentler/crossfit` |
| 4 | "Yetkiler şube bazında verilir **ve geri alınır**" (`segments.ts:265`) | ⚠️ **ÇÜRÜTÜLDÜ — TASK-2.09, 2026-09-23.** Bu satır `revokeGrant`'in çağıranına bakıyordu ve o ölçüm doğru ama **eksik**: geri alma üretimde `revokeTemplate` üzerinden koşuyor — `accounts-update.ts:861` → `revokeTemplate` → `revokeGrant` → `permissionGrant.deleteMany`, uç `PATCH /accounts/:userId` (`server.ts:375`), paneli `web/src/lib/account-mutations.ts` çağırıyor. Şablon değişimi eski grant'ları **aynı transaction'da** siliyor (ürünün TASK-54.11 REPLACE yolu). Yani cümle **doğru** ve sitede kaldı. Gerçekten ertelenmiş olan: şablondan bağımsız **tek bir yetkiyi** sökmek | `/segmentler/cok-subeli-zincir` |
| 5 | "Toplu duyuru **ve kampanya**" ✓ maddesi (`product.ts:219`) | Ürün **broadcast** taşıyor (`routes/broadcasts.ts`, `BroadcastsPage.tsx`, rota `/duyurular`) — "toplu duyuru" doğru. `campaign`/`kampanya` adlı rota, sayfa ya da servis **yok**; `demo/kampanya.html` bir v1.5 konsepti ve `BULGULAR` → Bilinçli Tercihler onu *"karşılıkları ürünün v1.5'inde"* diye kaydetmiş. Aynı sayfa 110 satır aşağıda "Kampanya ve pazarlama derinleşmesi"ni **Yolda** kolonunda gösteriyor | `/`, `/ozellikler` |

Şablonların ve yapının **doğru** kısmı ayrıca kaydedilir: üç yetki şablonu (`PATRON`/`SUBE_MUDURU`/`MUHASEBE`) gerçekten var ve panelde seçilebiliyor; bekleme listesi + sıradakine bildirim, yoklama düzeltme pencereleri (yönetim bu ay + önceki ay, antrenör 48 saat) ve aktiflik serisi + bildirim ürün koduna karşı **birebir doğrulandı**. Yani sınıf "site abartıyor" değil, **beş belirli cümle** karşılıksız.

## Kanıt

```
$ python3 -c "import json;d=json.load(open('../Alpfit.v1/web/src/i18n/tr.json'));print(d['member']['upcoming'])"
{'title': 'Yakında', 'note': 'Ölçüm grafiği ve diyetisyen notu bu fazda henüz yok — Üye 360 tam fazında (W8) gelecek.'}

$ grep -n "CANCEL_THRESHOLD" ../Alpfit.v1/backend/src/routes/reservations-cancel.ts
55:const CANCEL_THRESHOLD_MS = 24 * 60 * 60 * 1000;
$ grep -rn "24 saat\|eşik" src/            → (vuruş yok: gerçek değer sitede hiç yazılı değil)

$ grep -oE "export (async )?function send[A-Za-z]+" ../Alpfit.v1/backend/src/services/notification.service.ts | wc -l
12        → hiçbiri üyelik/bitiş bildirimi değil

$ grep -rn "revokeGrant" ../Alpfit.v1/backend/src ../Alpfit.v1/web/src
  → yalnız backend/src/auth/permission-templates.test.ts (10 satır); üretim çağıranı yok

$ ls ../Alpfit.v1/backend/src/routes/ ../Alpfit.v1/web/src/pages/ | grep -i "campaign\|kampanya"
  → YOK          ($ ls | grep -i broadcast → broadcasts.ts, BroadcastsPage.tsx)
```

## Kök Neden Yönü

Sitedeki yetenek iddialarını ürün deposuna karşı doğrulayan **hiçbir kapı yok**. Tek mekanizma `/ozellikler`'in "Yolda" kolonu ve o kolon **elle** tutuluyor — nitekim beşinci kalemde aynı sayfanın iki kolonu birbirini kesiyor. İddialar 2026-09-09/10'da yazıldı, ürün o tarihten sonra da gelişti; metin ile ürün arasında tek yönlü bir kopya ilişkisi var, geri besleme yok.

İkinci katman: ürün deposu bu bilgiyi **zaten yazılı** taşıyor — dört kalemin dördünde de karşılığı "v1.5", "W8", "ertelendi" gibi makine-okunur olmayan ama **adıyla aranabilir** notlarda duruyor. Yani doğrulama için gereken kaynak mevcut, bağ kurulmamış.

## Koruma Önerisi

- Yetenek iddiaları `src/content/` içinde tek bir **yetenek envanterine** bağlanır (`product.ts` → `ROADMAP`/`CAPABILITIES`, bkz. [B-040](B-040-urun-yol-haritasi-dort-evde.md)); "var" / "yolda" ayrımı tek yerden türer, dört ev birden düzenlenmez.
- M6 F6.4 (iddia sızıntı denetimi) kurulurken kapsamına **ürün-deposu çapraz kontrolü** girer: envanterdeki her "var" maddesi için `../Alpfit.v1` içinde adlandırılmış bir karşılık (rota/servis/ekran) aranır; bulunamayan madde kapıyı kırmızıya çeker. Bu, denetimin metin tarafıyla aynı listeyi paylaşabilir.
- Ürünün kendi "Yakında"/"v1.5" notları arama ölçütü olarak kullanılabilir — bugün elle bulundu, kapıya bağlanabilir.
- Kısa vade: beş cümle düzeltilene kadar `/ozellikler`'in "Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz" taahhüdü karşılanmıyor; düzeltme o sayfayı da kapsamalı.

## Çözüm Kaydı

**TASK-2.08 (2026-09-23)** — dayanak kuruldu: `src/content/product.ts` → `CAPABILITIES` (`simdi` 12 · `yolda` 7 · `sonra` 5). Beş kalemin hiçbiri "bugün var"da değil. Kapı `tests/capabilities.test.ts`.

**TASK-2.09 (2026-09-23)** — beş cümle ele alındı: **dördü düzeltildi, biri ölçümle çürütüldü.** Beşi de uygulamadan önce `../Alpfit.v1`'e karşı yeniden ölçüldü.

| # | Sonuç | Ne yapıldı |
|---|---|---|
| 1 | düzeltildi | `MODULES.uye360` blurb + `points`'ten "ölçüm" ve "diyetisyen notu" çıktı; yerlerine panelin ölçülen bölümleri geldi. İkisi de üründe **var** ama başka ekranlarda (üyenin mobilinde `MeasurementChart`, diyetisyen modülünde program/dosya) — karşılıksız olan "TEK EKRANDA toplanmış olmaları"ydı |
| 2 | düzeltildi | `segments.ts:71` "İptal eşiğini **siz belirlersiniz**" → "İptal eşiği **üründe sabit bir kuraldır**". Gerçek değer (24 saat) bilinçle **yazılmadı** — çapasız iddia doğururdu (gerekçe: `tasks/archive/TASK-2.09.md` → Karar Noktaları). Cümlenin geri kalanı ölçülüp doğru bulundu ve korundu |
| 3 | düzeltildi | `MODULES.bildirim` blurb + `points` ve `segments.ts:207`: "üyelik bitişi push'u" / "bildirim gider" düştü, "bitişe yaklaşan üyeler **panelde listelenir**" geldi. Yeniden ölçüm: gönderim fonksiyonu **12 değil 14** (ürün iki tane daha ekledi), hiçbiri hâlâ üyelik bitişi değil. Yerine ölçülen gerçek bildirim yazıldı: `sendComebackT2` (seri sıfırlandıktan T+2 gün) |
| 4 | **çürütüldü** | Cümle **doğru** — `segments.ts:265` değiştirilmedi. Detay yukarıdaki tabloda. `CAPABILITIES.yolda` → `yetki-geri-alma` etiketi gerçekten ertelenmiş olana daraltıldı: *"tek bir yetkinin şablon değiştirmeden geri alınması"* |
| 5 | düzeltildi | `MODULES.bildirim` → "Toplu duyuru ve kampanya" → "Toplu duyuru". **Sayfanın iç çelişkisi kapandı:** `/ozellikler`'de "kampanya" artık yalnız Yolda kolonunda (servisten ölçüldü: eski ifade 0) |

**Koruma Önerisi'nin durumu:** birinci madde (tek envanter) TASK-2.08'de kuruldu. **İkinci maddeye bir düzeltme gerekli:** ürünün kendi "v1.5 / Yakında / ertelendi" notları arama ölçütü olarak **tek başına yeterli değil** — `permission-templates.ts:15-17` bugün hâlâ "revoke ucu v1.5'e ertelendi … yollar da bundan **geçecek**" diyor, oysa `accounts-update.ts` bugün geçiyor. Not, **çağrı grafiğiyle** doğrulanmadan kullanılamaz; bu tam olarak 4. satırı yanlış yapan şeydi. (Süreç kuralı olarak: `_dev/memory/urun-iddiasi-capa-dogrulamasi.md`.)

**Yeni kapı:** `tests/iddia-metinleri.test.ts` (20 test) — beş kalemi **ziyaretçiye görünen yüzeylerde** (MODULES + SEGMENTS) çiviliyor. Boşluk gerçekti: sondada metne üç iddia geri yazıldığında `capabilities.test.ts` 23/23 yeşil kalırken yeni kapı 3 kırmızı verdi.

**TASK-2.12 (2026-09-23)** — **riskli alt küme taraması koştu; atom bu task'ta kapandı.**

*Yöntem.* Konu sözcükleri iki kaynaktan türetildi: (1) ürünün dağıtık erteleme notları ("Yakında" · "v1.5" · "W8" · "ertelendi" · "kapsam dışı") → 14 küme; (2) ürünün **kanonik sürüm haritası** `../Alpfit.v1/_dev/PRD/VERSIONS.md` → v1.5/v2 Feature Adayları → 13 küme. İkinci kaynak şarttı: dağıtık yorumların hiç göstermediği "öğrenci tutma göstergesi" ancak orada görünür. Yapısal ek kaynak: `web/src/shell/navConfig.ts`'in `status:'soon'` alanı ürünün **makine-okunur** "henüz yok" listesidir (bugün tek öğe `/ayarlar/yetki`) ve `yolda` → `yetki-geri-alma` yerleşimini bağımsız doğruladı.

*Taranan yüzey.* **66 kaynak dosya** (`src/**/*.ts` + `*.tsx`; `src/content/mail.ts` dâhil), **27 konu kümesi**, **129 benzersiz vuruş satırı** — 29'u kod yorumu, **98'i ziyaretçiye görünen metin**. Her vuruş üçe ayrıldı. Ek odak koşum: `segments.ts`'in **36 iddia parçası** × 12 yol-haritası kalem anahtarı.

*Sonuç — 2 karşılıksız, 1 belirsiz, kalanı karşılığı var.*

| Kalem | Sonuç | Ne yapıldı |
|---|---|---|
| `product.ts` raporlar → "Şube ve **tarih aralığı** filtresi" | **karşılıksız** | Ürün **tek ay** seçtiriyor; üç katmanda ölçüldü — `shared/src/reports-catalog.ts` (`monthRange` = "v1'de tek ay … gerçek başlangıç–bitiş aralığı v1.5"), `backend/src/routes/reports-export.ts:71` tek `month` parametresi (`:166-167`), `web/src/pages/ReportsPage.tsx:185` `<input type="month">`. → "Şube ve **ay** filtresi". **Şube ayağı doğru**, korundu. Yeni kalem açılmadı (aralık zaten `yolda` → `gelismis-raporlama`) |
| `shots.ts` antrenör görseli alt metni → "**öğrenci tutma**" | **karşılıksız** | Kelime **tüm ürün kod tabanında 0** kez geçiyor (backend/src + web/src + mobile/src + shared); sürüm haritası kalemi adıyla v1.5'e taşımış ("v1'de … hiç yapılmadı … Faz 45 … v1.5'e taşıdı"). Alt metni görüntüde **gerçekten duran** ve üründe **karşılığı olan** üç karta daraltıldı (aylık performans · haftalık doluluk · ciro kırılımı) |
| `site.ts:15` meta açıklaması → "tamamı tek panelde **ve mobilde**" | **belirsiz** | Üye ve antrenör mobil uygulaması **var**; ama yönetim paneli masaüstü-öncelikli (mobil tam responsive → v1.5) ve "Patron Mobil Özet" → v1.5. Cümle bütün olarak savunulabilir, sıkı okuması değil. **Uydurulmadı, silinmedi** → `BULGULAR.md` → Gelen Kutusu |
| `product.ts:23-24` (üye rolü), `chat.ts` "ölçüm grafiğini görür" | karşılığı var | B-029 k.1'in listede olmayan kardeşleri; ikisi de üyenin **kendi mobilini** anlatıyor (`MeasurementChart` + diyetisyen programı) — karşılıksız olan yalnız "tek ekranda toplanmaları"ydı ve o TASK-2.09'da düştü |
| `product.ts:38` antrenör "**ölçüm girişi** ve antrenman programı yazma" | karşılığı var | `POST /trainers/me/members/:memberId/measurements` (measurements.ts) + `POST /programs` · `/programs/:id/publish` (programs.ts, trainer). Diyetisyenin ölçüm **yazması** v1.5 — site zaten "okuma" diyor |
| `product.ts:168` "Şubeler arası ciro karşılaştırması" | karşılığı var | `branch-comparison` şablonu katalogda (`scope: 'club'`) |
| `segments.ts:291-292` "Üye bir **ana şubeye bağlıdır**" | karşılığı var | Çapraz-şube rezervasyon v1.5'te ertelenmiş; cümle bunu **doğru** söylüyor |
| `product.ts:460` "Otomatik hatırlatma ve bekleme listesi" | karşılığı var | v1 çekirdeği: tek hatırlatma + bekleme listesi + sıradakine bildirim. v1.5 olan *derinleşme* (çok-kanal, tekrarlı) iddia edilmiyor |
| WhatsApp (76 vuruş) | karşılığı var | Hepsi **bizim iletişim kanalımız**; ürünün WhatsApp bildirim kanalı (v1.5) hiçbir yerde iddia edilmiyor |

*B-040'tan devralınan 2. ayak — ölçümle çürütüldü.* *"`segments.ts`'te 'yolda'/'yol haritası' ifadesi 0"* bir boşluk sanılıyordu. 36 iddia parçası 12 kalem anahtarına karşı tarandı: **0 gerçek vuruş** (tek vuruş yanlış pozitif — *"Karar için tek ekran yok"* kulübün bugünkü **derdini** anlatıyor). İşaretin yokluğu **doğru sonuçtur**: TASK-2.09 iki segment cümlesini işaret ekleyerek değil **ifadeyi daraltarak** düzeltmişti, geriye işaret gerektiren cümle kalmadı.

*Yöntemin kendi kusuru ve düzeltilmesi (kayda değer).* Taramanın ilk sürümü konu kalıplarını **iki kavramın aynı satırda** bulunması olarak kurmuştu; dizi elemanları ayrı satırlarda olduğu için bu atomun adıyla saydığı iki çapayı (`product.ts:23-24` ve `chat.ts`'in "ölçüm grafiğini görür" cümlesi) **hiç görmedi** ve 21 vuruşla "temiz" gibi okunuyordu. Kalıplar tek kavrama indirildi ve taramanın içine bir **çapa sondası** (bilinen pozitifleri görüyor mu) kondu → **121 vuruş, 3/3 BULUNDU**. Ders tur 9'un harf-duyarlılığı dersinin kardeşidir: bir tarama kapısını **granülerliği** de sessizce kör edebilir.

**⚠️ TARANMAYAN YÜZEY — "hepsi doğrulandı" DENMİYOR.** Yöntem **konu sözcüğü** temellidir: ürünün kendi notlarında ya da sürüm haritasında **kaydı olmayan** bir eksik bu yolla **bulunamaz**. Sınıfın tamamı (~124 present-tense yetenek cümlesi) tek tek ürün koduna karşı doğrulanmadı; `product.ts` BENEFITS başlıkları, 16 `pains` maddesi ve `karsilastirma.ts`'in 18 satırlık yöntem tablosu yalnız bir konu sözcüğüne değdikleri ölçüde tarandı. Kalan yüzey **yaşayan eve** taşındı: kalıcı ürün-deposu çapraz kontrolü **M6 F6.4**'ün kapsamındadır (`modules/M6-Kalite-Kapilari.md`) ve bu taramanın konu-sözcüğü yöntemi ile `navConfig.ts`'in `status:'soon'` alanı oraya girdi olarak kaydedildi.

**Yeni kapı:** `tests/iddia-metinleri.test.ts` +6 senaryo (yeni dosya açılmadı) — iki düzeltilen cümleyi çiviliyor, biri boş-kapsam bekçisi. İki sondayla kırmızı görüldü; batarya 154 → **160**. Tarama betiği **kalıcılaşmadı** (scratchpad'de kaldı — task'ın kendi kuralı).

**Kapanmayan ve başka eve taşınan:** görüntünün kendisi hâlâ "Öğrenci Tutma" kartını render ediyor (`antrenor.webp`, kaynağı `demo/antrenor.html`) — bu bir **görsel sızıntısıdır**, evi **B-018** (TASK-2.13 temizlik, TASK-2.15 denetimin iddia dalı); Gelen Kutusu'na `[TASK-2.12]` işaretiyle düştü.
