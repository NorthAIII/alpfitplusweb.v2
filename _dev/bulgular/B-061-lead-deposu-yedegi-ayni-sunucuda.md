# B-061: Lead deposunun tek yedeği aynı sunucuda ve aynı hacimde — sunucu kaybında lead de yedek de gider

**Önem:** 🟡 | **Tip:** öneri-altyapı / dayanıklılık | **Alan:** M3 — Lead hattı / M7 — Altyapı
**Kaynak:** audit-product (Gelen Kutusu mezuniyeti: `[TASK-1.06]`) | **Tarih:** 2026-09-22
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → Pazarlık Konusu Olmayanlar: *"Gelen talep kaybolmaz. Hiçbir demo talebi tek bir sağlayıcıya bağlı kalmaz; lead önce dayanıklı bir yere yazılır."* Bir yedeğin varlık nedeni, kaybedilen şeyden **ayrı** durmasıdır.

**Gözlenen:** Depo (v1'in PocketBase'i) günlük yedek alıyor ama yedek korumak istediği şeyle aynı yerde duruyor:

- Yedek zamanlı ve sınırlı: her gün 03:00, son 7 kopya (`../Alpfitplus-website.v1/pocketbase/README.md:38`, `:574`).
- **S3 kapalı** — yedekler `pb_data/backups/` içinde, yani `alpfit_pb_data` adlı **aynı named volume**'ün içinde (`README.md:32`).
- Sunucu, disk ya da hacim kaybında lead verisi ve yedeklerin yedisi birlikte gider. Sunucu dışı hiçbir kopya yok.

v2 bugün bu depoya yazıyor (TASK-1.18'den beri canlı) ve alan adı geçişinden sonra **tek** dayanıklı hedef o olacak — `LEAD_FILE_PATH` Vercel'de kalıcı disk olmadığı için devreye giremez, e-posta dayanıklı sayılmıyor (bkz. [B-025](B-025-calisma-zamani-alarm-yok.md)). Yani "tek bir sağlayıcıya bağlı kalmaz" ilkesi bugün **hedef** düzeyinde sağlanıyor, **dayanıklılık** düzeyinde sağlanmıyor.

Ek olarak: `../altyapi/vps/CLAUDE.md`'nin `alpfit-pocketbase` için yazdığı gerekçe (*"0 istek, dosya değişmiyor"*) bayat — depo kayıt taşıyor ve v2 buraya yazıyor. O dosya bu repoda değil; düzeltmesi sunucu projesinin işi.

## Kanıt

```
$ sed -n '32p;38p;574p' ../Alpfitplus-website.v1/pocketbase/README.md
32 : veri dizini → alpfit_pb_data (named volume)
38 : | Yedek | Her gün 03:00, son 7 kopya saklanır (PocketBase yerleşik, S3 kapalı) |
574: "Her gün 03:00'te yedek, son 7 kopya saklanır. S3 kapalı (yedekler pb_data/backups/ içinde)."
```
**Ölçülemeyen (sunucu erişimi gerekiyor, tahmin edilmedi):** cron'un canlıda bugün gerçekten koştuğu, `pb_data/backups/` içeriği ve gerçek kayıt sayısı.

## Kök Neden Yönü

Depo v1 için kuruldu ve o gün "0 istek, dosya değişmiyor" varsayımıyla yedek politikası minimumda bırakıldı. v2'nin bu depoya yazmaya başlaması (TASK-1.18) varsayımı geçersiz kıldı ama politikayı kimse yeniden açmadı.

## Koruma Önerisi

- En ucuz adım: PocketBase'in kendi S3 yedeği açılır (ayar düzeyinde iş) ya da günlük yedek sunucu dışına kopyalanır. İcra büyük olasılıkla `altyapi/vps` projesinin işidir; bu bulgu **kararın ve takibin** evidir.
- Geri dönüş sınanır: yedekten geri yükleme bir kez denenmeden yedek sayılmaz.
- F7.5 kabul kriterlerine tek satır: *"lead deposunun sunucu dışı bir kopyası var ve geri yükleme bir kez denendi."* Geçişten sonra depo tek dayanıklı hedeftir; kapının yeri orasıdır.

## Çözüm Kaydı

—
