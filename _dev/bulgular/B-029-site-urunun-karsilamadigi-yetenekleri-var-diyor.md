# B-029: Site, ürünün bugün karşılamadığı beş yeteneği "var" diye sunuyor

**Önem:** 🔴 | **Tip:** hata / iddia uyumu | **Alan:** M1 — İçerik ve iddia kaynağı (M2 render yüzeyleri)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → ürün **pilot aşamada**; karşılanmayan iddia yayınlanmaz. `/ozellikler` sayfası bunu kendi bölüm başlığında taahhüt ediyor (`src/app/ozellikler/page.tsx:86`): *"Bu üç kolonu ayrı tutuyoruz. **Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz.**"* `ILKELER.md` → "Kanıtsız iddia yayınlanmaz".

**Gözlenen:** Beş yetenek iddiası ürün kodunda karşılıksız. Dördünde ürünün **kendi kaydı** bunu açıkça söylüyor.

| # | Sitenin dediği | Ürünün gerçeği | Render edildiği rotalar |
|---|---|---|---|
| 1 | "Bir üyenin üyeliği, PT geçmişi, **ölçümü**, ödemesi ve **diyetisyen notu** tek ekranda" (`product.ts:129`) + ✓ maddeleri `:133` "Ölçüm grafiği", `:135` "Diyetisyen programı ve dosyaları" | Ürün paneli o ekranın altında **"Yakında — Ölçüm grafiği ve diyetisyen notu bu fazda henüz yok — Üye 360 tam fazında (W8) gelecek."** kutusu render ediyor (`../Alpfit.v1/web/src/i18n/tr.json` → `member.upcoming`; render `MemberDetailPage.tsx:320-324`) | `/`, `/ozellikler`, `/segmentler/boks-dovus`, `/segmentler/cok-subeli-zincir` |
| 2 | "**İptal eşiğini siz belirlersiniz.**" (`segments.ts:71`) | Eşik kod sabiti: `backend/src/routes/reservations-cancel.ts:55` `CANCEL_THRESHOLD_MS = 24*60*60*1000`. Ayarlanabilirlik ürünün kendi notunda **v1.5 adayı** ve adıyla anılıyor (`backend/src/queue.ts:46-49`: *"Sabit varsayılan — ayarlanabilirliği kulüp-ölçekli ayar tablosuna bağlı ve o tablo v1.5 adayı … **iptal eşiği** · bekleme onay penceresi · hatırlatma öncesi süre birlikte"*). Sitede gerçek değer (24 saat) **hiç yazmıyor** | `/segmentler/pilates-reformer` |
| 3 | "Randevu, grup ve **üyelik bitişi push'u**" (`product.ts:214`), "Üyelik bitişine yaklaşan üyeye bildirim" (`:217`), "bitişe yaklaşan üyelere **bildirim gider**" (`segments.ts:207`) | `notification.service.ts`'in **12 gönderim fonksiyonunun hiçbiri** üyelik bitişi göndermiyor. Var olan tek şey rapor girdisi — `membership-expiry.service.ts:5-7`: *"bitişe yaklaşan üyeler **raporunun** girdisi. **İleride** churn paneli / push uyarısı için de yeniden kullanılabilir"*. Tüketicileri: okuma ucu + rapor üreticisi + ReportsPage; bildirim tüketicisi yok | `/`, `/ozellikler`, `/segmentler/crossfit` |
| 4 | "Yetkiler şube bazında verilir **ve geri alınır**" (`segments.ts:265`) | `revokeGrant` yalnız kendi test dosyasından çağrılıyor; üretim çağıranı ve HTTP ucu yok. Ürünün kendi notu: `backend/src/auth/permission-templates.ts:15-17` *"Bu yalnız servis-katmanı kuralı; **revoke HTTP endpoint'i v1.5'e ertelendi**"* | `/segmentler/cok-subeli-zincir` |
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

—
