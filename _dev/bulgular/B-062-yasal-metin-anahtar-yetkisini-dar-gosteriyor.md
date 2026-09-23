# B-062: Yasal metin depo anahtarının yetkisini olduğundan dar gösteriyor

**Önem:** 🟡 | **Tip:** tutarsızlık (yayındaki beyan ↔ ölçülen davranış) | **Alan:** M1 yasal metin / M3 lead hattı
**Kaynak:** TASK-2.18 (gözlem) · audit-product triyajı 2026-09-23 (atomlaştırma) | **Tarih:** 2026-09-23
**Durum:** → QUICK-002

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

[QUICK-002'de doldurulacak]
