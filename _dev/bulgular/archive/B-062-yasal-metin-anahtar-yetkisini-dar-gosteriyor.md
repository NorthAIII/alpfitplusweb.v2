# B-062: Yasal metin depo anahtarının yetkisini olduğundan dar gösteriyor

**Önem:** 🟡 | **Tip:** tutarsızlık (yayındaki beyan ↔ ölçülen davranış) | **Alan:** M1 yasal metin / M3 lead hattı
**Kaynak:** TASK-2.18 (gözlem) · audit-product triyajı 2026-09-23 (atomlaştırma) | **Tarih:** 2026-09-23
**Durum:** ✅ Çözüldü

## Gözlem

**Beklenen:** Yasal metnin her olgu iddiası ölçülen davranışa birebir oturur — faz 2'nin dokuz beyanı bu kuralla yazıldı ve dokuzu da `tests/legal-consistency.test.ts` ile çivilendi (dayanak: `docs/CLAIMS.md` → tek kaynaklar; `ILKELER.md` → "Kanıtsız iddia yayınlanmaz").

**Gözlenen:** Yayındaki KVKK/Gizlilik metni (`src/content/legal.ts:160`) şunu diyor:

> "Kayıtları yalnızca yetkili yönetici hesabımız görebilir: veritabanının dışarıya açık okuma kuralları kapalıdır ve sitenin kullandığı anahtar **yalnızca yeni kayıt oluşturabilir**, var olan kayıtları okuyamaz."

Cümlenin **"okuyamaz"** yarısı doğru ve çürütülmedi. **"Yalnızca yeni kayıt oluşturabilir"** yarısı ölçümle çürüdü: uç aynı anahtarla var olan kayda `PATCH` de atıyor.

Ziyaretçi açısından etki: metin anahtarı olduğundan **daha kısıtlı** gösteriyor, yani veri güvenliği iddiası gerçekte olduğundan güçlü okunuyor. Yanlış yön "eksik koruma" değil "fazla güvence" — ama yine de ölçülmeyen bir beyandır.

## Kanıt

- **Yazma ucu:** `src/app/api/demo/route.ts` → `notifyStore` bildirim durumunu (`notify_lead` / `notify_team`) var olan kayda `PATCH` ile yazıyor. Bu yol TASK-2.07'de (onay e-postası, commit `9f18a56`) **genişledi**: `notify_lead` artık kalıcı `pending` değil, gerçek sonucu taşıyor — yani `PATCH` bugün olağan akışta koşuyor.
- **Komşu deponun sözleşmesi:** `../Alpfitplus-website.v1/pocketbase` token'ın **iki** ucu açtığını yazıyor — `POST /lead` + `PATCH /lead/{id}`.
- **İlk gözlem:** TASK-2.18 (commit `4464a5d`) — kapının dal 4'ü bu yarıyı **bilerek** çivilemedi, çünkü anahtarın yetki yüzeyi komşu depoda yaşıyor ve bu depodan yalnız "sitenin kodu okuma yapmıyor" ölçülebiliyor. Ölçüm kaydı: `tasks/archive/TASK-2.18.md` → Kararlar.
- **Metnin yeri:** `src/content/legal.ts:160` (Gizlilik + KVKK ortak paragrafı).

## Kök Neden Yönü

Cümle TASK-1.15'te, uç henüz yalnız `POST` atarken yazıldı ve o gün **doğruydu**. TASK-2.07 bildirim durumunu geri yazan `PATCH` yolunu açtı; metin o turda gözden geçirilmedi çünkü turun nesnesi e-posta kanalıydı, yasal metin değil.

Sınıf: **bir davranış değişikliği, onu anlatan yayındaki cümleyi sessizce bayatlattı.** Faz 2'nin yasal metin kümesi (2.16–2.19) bu cümleyi kapsamına almadı — o küme "eksik anlatım"ı düzeltiyordu, "sonradan bayatlayan doğru cümle"yi değil.

## Koruma Önerisi

`tests/legal-consistency.test.ts`'in **dal 4'ü** bugün yalnız sitenin kodunun okuma yapmadığını çiviliyor. Aynı dala ikinci bir ayak eklenebilir: **ucun depoya attığı HTTP yöntemlerinin kümesi** (`POST` + `PATCH`) ile metnin saydığı yetkiler karşılaştırılır — yöntem kümesi büyüdüğünde test kırmızı döner. Bu, dalın hâlihazırda ölçtüğü şeyin (tüm `fetch` çağrılarının yöntem+URL kümesi) doğal genişlemesidir ve komşu depoya erişim gerektirmez.

Anahtarın **gerçek** yetki yüzeyi (koleksiyon kuralları) bu depodan ölçülemez; onun kapısı komşu depodadır ve bu öneri onu kapsamaz.

## Çözüm Kaydı

**QUICK-002 (2026-09-23) — kapandı: cümle ölçülene daraltıldı ve kapı ikinci ayağını aldı.**

**Ölçüm önce yapıldı, iki taraftan** (devralınan özet kullanılmadı — `memory/urun-iddiasi-capa-dogrulamasi.md`):

| Ne ölçüldü | Nereden | Sonuç |
|---|---|---|
| Ucun depoya attığı yöntem kümesi | `src/app/api/demo/route.ts` — dosyadaki dört `fetch` çağrısının tamamı | `toStore` → `POST /lead` · `notifyStore` → `PATCH /lead/{id}`; diğer ikisi Resend'e gidiyor, depoya değil. Okuma çağrısı **yok** |
| Anahtarın açtığı rota kümesi | `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead.pb.js` (salt okunur) | Token'la açılan **tam iki** rota: `routerAdd('POST','/lead')` :20 + `routerAdd('PATCH','/lead/{id}')` :111. `GET`/`DELETE` rotası yok |
| `PATCH`'in yazabildiği alanlar | `pb_hooks/lead_lib.js:69-70` | Beyaz liste yalnız `notify_team` (`sent`/`failed`) + `notify_lead` (`sent`/`failed`/`skipped`) |

**Yeni cümle** (`src/content/legal.ts`, KVKK → Aktarım): *"…sitenin kullandığı anahtar yalnızca iki şey yapabilir — yeni bir talep kaydı oluşturabilir, bir de bildirim ve onay e-postalarının gönderilip gönderilmediğini kayda yazabilir; var olan kayıtları okuyamaz."* Çürümeyen *"okuyamaz"* yarısı ve *"dışarıya açık okuma kuralları kapalıdır"* yarısı olduğu gibi korundu. Ölçümün çapaları `legal.ts`'in Aktarım yorumuna yazıldı (dosyanın TASK-2.17'de kurduğu gelenek).

**Kapı** — bu atomun Koruma Önerisi uygulandı: `tests/legal-consistency.test.ts` dal 4'e ikinci ayak eklendi. Dal artık metnin **saydığı yetkileri** yöntemlere bağlayan bir sözlük taşıyor (`YETKI_IFADELERI`) ve ölçülen yöntem kümesiyle **iki yönlü** karşılaştırıyor: sözlükte karşılığı olmayan bir yöntem kullanılırsa *"metin bu yetkiyi saymıyor"*, metin daraltılır/genişletilirse *"ikisi ayrıştı"* diye kırılır. Batarya 216 → **217 geçti** (+1 test; `LEGAL_CONTRACT_HOOKS_DIR` tanımlıyken, 1 atlandı — komşu depo sözleşme paketi).

**Üç negatif kontrolün üçü de kırmızı verdi:** (1) cümle eski dar hâline döndürüldü → hem `claimOnce` hem iki yönlü karşılaştırma kırıldı (*"uc depoya ["PATCH","POST"] yontemleriyle gidiyor, KVKK metni ise [] yetkisini sayiyor"*); (2) `POST` sözlükten düşürüldü → *"karşılığı sayılmayan bir yöntem"* dalı tek başına kırıldı; (3) ucun `PATCH`'i `PUT`'a çevrildi → çağrı-çifti ölçümü kırıldı. Üçü de scratchpad yedeğinden `cp` + md5 ile geri alındı (`git checkout`/`git restore` kullanılmadı).

**Kapsanmayan yüzey — bilinçli, bu atomun Koruma Önerisi onu zaten dışarıda bırakıyordu:** kapı **tavanı değil kullanımı** çiviler. Ölçtüğü şey "sitenin kodu depoya hangi yöntemlerle gidiyor"dur; "anahtar bundan fazlasını yapamaz" değil. Sınır dal 4'ün `ÖLÇÜLEMEYEN` yorum bloğunda güncellenmiş hâliyle yazılı. Cümledeki *"yalnızca"* sözcüğü bugün komşu deponun hook'larından ölçüldü (yukarıdaki tablo) ama bu depoda **yaşayan bir kapısı yok** — rota kümesinin çivilenebilirliği Gelen Kutusu'na `[QUICK-002]` işaretiyle düşüldü.
