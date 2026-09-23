# B-059: Alan adı geçişinde v1'in lead hattı ve yasal metin davranışları sessizce geriler

**Önem:** 🟡 | **Tip:** tutarsızlık / gerileme | **Alan:** M7 — F7.5 Alan adı geçişi / M3 — Lead hattı / M1 — Yasal metin
**Kaynak:** audit-product (Gelen Kutusu mezuniyeti: `[PHASE-1 plan revizyonu]` + `[TASK-1.15]`) | **Tarih:** 2026-09-22
**Durum:** Kısmen çözüldü — (1) ve (2) Faz 2'de kapandı (TASK-2.07, 2026-09-23); **(3) açık**, alan adı geçişi fazının parite listesinde

## Gözlem

**Beklenen:** F7.5'te v2, `alpfitplus.com`'da v1'in yerini alır. Yer değiştirme bir **gerileme** üretmemelidir: `ILKELER.md` → *"Gelen talep kaybolmaz"*, *"Kanıtsız iddia yayınlanmaz"*; `PHASES.md` → Alan adı geçişi milestone'u yalnız 301 haritasını ve sitemap'i sayıyor, davranış paritesini saymıyor.

**Gözlenen:** Üç davranış bugün yalnız v1'de var ve geçiş gününde kaybolacak. Üçü de ölçüldü.

**(1) Talep sahibine onay e-postası yok.** v1'in ucu ekibe ek olarak **talep sahibine** de bir onay e-postası gönderiyor (*"1 iş günü içinde dönüş"*): `../Alpfitplus-website.v1/api/demo.ts:314-321` (`LEAD_CONFIRMATION`, `leadHtml`), `:339-345` (`to: [email]`, `reply_to: mailer.to`). v2 yalnız ekibe gönderiyor. Ziyaretçi tarafında bu görünür bir hizmet kaybıdır.

**(2) `notify_lead` kalıcı olarak `pending` kalır.** v1 bildirim sonucunu depo kaydına geri yazıyor: `:358-360` (`notifyLead = !email ? 'skipped' : leadMailed ? 'sent' : 'failed'`), `:363-371` (PATCH `{notify_team, notify_lead}`). v2'nin PATCH gövdesi yalnız `{notify_team}` (`src/app/api/demo/route.ts:178`) ve bu **bilinçli** (`:161-167` gerekçeli: v1'in "ziyaretçi e-posta vermedi" anlamıyla karışmasın). Ama geçişten sonra ikisi **aynı koleksiyonu** paylaşacak: v2 kayıtları kalıcı olarak `pending` görünecek ve alanın anlamı okunamaz hâle gelecek.

**(3) Yayındaki yasal metin geriler.** v1'in canlı metni yurt dışı aktarımını ve alıcı dökümünü açıkça yazıyor (`../Alpfitplus-website.v1/src/i18n/legal.ts` → `RECIPIENTS`, `TRANSFER_FACT`); v2 yalnız kaydın bulunduğu ülkeyi olgu olarak söylüyor, aktarımın dayanağını ve tedarikçilerin ülkelerini kurmuyor (bkz. [B-024](B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md) kalem 2). Geçiş günü ziyaretçi bugün gördüğünden **daha az** bilgilendirilmiş bir metin görür.

## Kanıt

```
$ sed -n '314,321p;339,345p;358,360p;363,371p' ../Alpfitplus-website.v1/api/demo.ts
$ sed -n '161,167p;178p' src/app/api/demo/route.ts
$ grep -n "RECIPIENTS\|TRANSFER_FACT" ../Alpfitplus-website.v1/src/i18n/legal.ts
```
(1) ve (2) için v1 satırları 2026-09-22'de birebir doğrulandı; v2'nin karşılığı kodda yok. (3) v1 **kaynağından** doğrulandı; v1'in yayındaki hâli bu turda çekilmedi.

## Kök Neden Yönü

Faz 1 v2'yi **kendi başına** doğru kurdu; v1 ile kıyas yalnız kayıt şeması düzeyinde yapıldı (TASK-1.13/1.14 sözleşme paketi). Davranış paritesi bir kabul kriteri olarak hiçbir yerde yazılı değil — ne M3'ün ne M7 F7.5'in kriterlerinde geçiyor.

## Koruma Önerisi

- Üç kalem **F7.5'in kapsam tartışmasına** girer ve orada bilinçli karara bağlanır: hangisi taşınacak, hangisi bilerek düşürülecek (düşen kalem `BULGULAR` → Bilinçli Tercihler'e iner).
- F7.5 kabul kriterlerine tek satır eklenir: *"v1'in lead hattı ve yasal metin davranışları kalem kalem karşılaştırıldı; taşınmayan her kalem gerekçesiyle kayıtlı."*
- (2) için ucuz çözüm: v2 `notify_lead`'i `skipped` yazar (anlamı doğru: v2 talep sahibine göndermiyor), `pending` bırakmaz.

## Çözüm Kaydı

**(1) ve (2) kapandı — TASK-2.07, 2026-09-23** (`tasks/archive/TASK-2.07.md`).

- **(1) Onay e-postası açıldı.** `src/app/api/demo/route.ts` → `toLeadEmail()`; alıcı talep sahibi, `reply_to` ekibin kutusu (`DEMO_TO`), metin `src/content/mail.ts` → `LEAD_CONFIRMATION` (düz metin). Ekip bildirimiyle **paralel** gider, biri diğerini bloke etmez. Ölçüldü: yerel depoya karşı gerçek turda iki e-posta da Resend'de **`delivered`** (onay `01a0cbda-b7b1-…`, ekip `01a0cbda-b734-…`), damgalar 214 ms arayla. v1'in *"genelde 1 iş günü içinde"* parantezi **taşınmadı** — dönüş süresi vaadi sitenin formundaki cümleyle aynı tutuldu, yeni bir süre icat edilmedi ([B-026](B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md) büyümedi).
- **(2) `notify_lead` gerçek sonucu taşıyor.** PATCH gövdesi artık `{notify_team, notify_lead}`. Üç değerin üçü de gerçek depo hook'una yazılarak ölçüldü: `sent` · `skipped` (geçerli adres yok) · `failed`. Koruma önerisindeki "ucuz çözüm" (hep `skipped` yaz) **uygulanmadı** — dayanağı düştü: v2 artık gerçekten gönderdiği için alanın anlamı v1'inkiyle aynı (karar: `docs/DECISIONS.md` 2026-09-22 «Onay e-postası açılınca `notify_lead` gerçek sonucu taşır»).

**(3) açık kalıyor** — yasal metnin v1'e göre gerilemesi F7.5'in parite listesinde; koruma önerisinin F7.5 kabul kriteri satırı da orada karara bağlanır.
