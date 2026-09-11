# QUICK-001: `sube.webp` üretim hattından düşürülüp yayından çekilsin

**Tarih:** 2026-09-12
**Durum:** ✅ Tamamlandı

## Ne Yapılacak

**Ne:** `public/product/sube.webp` yayınlanan varlık kümesinden çıkarılsın. Dosya elle silinmez — `public/product/` betik çıktısıdır (kök `CLAUDE.md` → Dokunulmazlar). Yol: `research/scripts/render-product.mjs` içindeki `SCREENS` listesinden `sube` ekranını düşürmek, ardından hattı araştırma konteynerinde yeniden koşturmak. `src/content/shots.ts` → `SHOTS.sube` künyesi de kaldırılır (tüketicisi yok, ölçüldü).

**Neden:** Görsel, iddia sızıntısının üç ayrı sınıfını birden taşıyor ve **hiçbir sayfada gösterilmiyor** ama adresi yanıt veriyor (`/product/sube.webp` → 200, 62.494 B, canlı önizlemede doğrulandı):

- **Gerçek kişi adı:** "Şube özeti" kartında *"Simge & Gizem hocaların doluluğu düşük"* (kaynak `../Alpfit.v1/demo/sube.html:481`). `src/content/legal.ts:294` ziyaretçiye *"Gerçek bir kulübün veya kişinin verisi gösterilmemektedir"* diyor. → **B-018**
- **Ciro projeksiyonu ve üstünlük iddiası:** *"ciro tek başına ~₺110B/ay artabilir"*, *"+%34 geçen aya göre"*, *"227 üye · +30 bu ay (rekor)"*, *"★ en hızlı büyüyen şube"*, *"grubun en hızlısı"*. `docs/CLAIMS.md` ROI, yüzde iyileşme ve müşteri sayısını açıkça yasaklıyor. → **B-018**
- **Gerçek pilot semtinin baş harfleri:** şube adı "Vadi" olarak temizlenmiş ama avatarı **"BŞ"** (kaynak `sube.html:142-148`: `<div class="big-av">BŞ</div>` + `<h2>Beşiktaş</h2>`). Temizlik tablosunun kendi kuralı: *"hiçbir karede tam soyadı ve gerçek semt adı kalmayacak"* ve *"gerçek pilot şubelerini ifşa etmemek için semt adı kullanmıyoruz"*. Aynı karede "Vadi · İstanbul" ve "Açılış: Şubat 2026 · 4 aylık" da duruyor. → **B-044**

**Kullanıcı kararı (2026-09-12, audit-product turu):** "Çekilsin." Gerekçe: hiçbir sayfada gösterilmediği hâlde kamuya açık bir yüzey olarak duruyor; çekmek bu üç kalemin görünürlüğünü bugün kapatır ve M5 F5.1'in *"çıktı 8 `.webp`"* kriterini gerçek kullanımla (7 görsel) hizalar.

**Nerede:** `research/scripts/render-product.mjs` (`SCREENS` listesi) · `src/content/shots.ts` (`SHOTS.sube` künyesi) · hat koşumu sonrası `public/product/sube.webp` silinmiş olur.

**Ne zaman bitmiş sayılır:**
1. `render-product.mjs` `SCREENS` listesinde `sube` yok; hat araştırma konteynerinde koşturuldu ve **denetim sızıntı bulmadan** geçti (M5 F5.1: sızıntı varsa üretim durur).
2. `public/product/` altında 7 `.webp` var, `sube.webp` yok.
3. `src/content/shots.ts` → `SHOTS.sube` kaldırıldı ve `npx tsc --noEmit` ile `npm run build` temiz (tüketicisi olmadığı ölçüldü, ama teyit edilir).
4. Kaldırılan kriterin izi: M5 F5.1'in "çıktı 8 `.webp`" ifadesi 7'ye çekilir **ya da** neden 8 üretilip 7'sinin kullanıldığı yazılır. `modules/` korumalı doküman değil, ama değişiklik kullanıcıya bildirilir.

**Kapsam sınırı — bu iş B-018'i ve B-044'ü KAPATMAZ.** Yalnız `sube.webp`'in kamuya açık yüzeyini kaldırır. İki bulgu açık kalır, çünkü kök neden duruyor: `grup.webp`'te "Gizem Ö." **gösterilmeye devam ediyor** (ProductStory adım 2 → `/` ve `/ozellikler`), avatar-ad uyumsuzluğu `grup.webp` ve `takvim.webp`'te sürüyor, ve sızıntı denetimi 21 dizgenin 20'sine kör (iddia sızıntısı için hiç dalı yok). Bu iş bittiğinde iki atomun Çözüm Kaydı'na dokunulmaz; yalnız kapsamı daralan kalemler not edilebilir.

## Yapılanlar

- **`SCREENS` listesinden `sube` düşürüldü** ve yerine **gerekçe yorumu** yazıldı: üç sızıntı sınıfı (`&` ile bağlı gerçek ilk ad, ciro/yüzde/üstünlük rozeti, gerçek semtin baş harfleri), denetimin üçüne de kör olduğu, ve **geri eklemenin koşulu** (B-018 + B-044'ün denetim dalları kapanmalı). Satırın neden yok olduğu dosyadan okunabilir — sonraki oturum onu geri eklemesin diye.
- **Hat araştırma konteynerinde yeniden koşturuldu** (`/demo` salt-okunur mount ile). 7 ekran üretildi, denetim sızıntı bulmadı, çıkış kodu 0. Yeni çıktılar mevcut yayınlanan dosyalarla **bayt bayt aynı** çıktı (hat belirlenimci) — yani `public/product/`'ta tek değişiklik `sube.webp`'in düşmesi, diğer 7 görsel dokunulmamış gibi duruyor.
- **`public/product/sube.webp` yayınlanan kümeden çıkarıldı** (`git rm`). `research/product-out/`'ta kalan bayat kopya da silindi — hat çıktı klasörünü temizlemiyor, duran dosya "hâlâ üretiliyor" gibi okunurdu.
- **`SHOTS.sube` künyesi kaldırıldı** (`src/content/shots.ts`). Künye 8'den 7'ye indi; tüketicisi olmadığı zaten ölçülmüştü, derleme teyit etti.
- **M5 F5.1 hizalandı:** kabul kriteri "Çıktı 8 `.webp`" → **7**; açıklamaya `sube.html`'in sonradan düşürüldüğü, Edge Case'lere gerekçe ve **geri ekleme koşulu** girdi.
- **B-018 ve B-044'e kapsam daralması notu işlendi** — ikisi de **Açık** kaldı, Çözüm Kaydı'na dokunulmadı. Notlar neyin kapandığını (yalnız `sube.webp`'in kamuya açık yüzeyi) ve neyin kapanmadığını (gösterilen `grup.webp`'teki "Gizem Ö.", avatar uyumsuzlukları, semt baş harfi sınıfı, iki dallı denetim) ayrı ayrı yazıyor. `BULGULAR.md`'de B-044'ün kancası gerçeğe çekildi — "Vadi/BŞ" artık yayınlanan bir karede değil, kanca yayınlanan uyumsuzluğu gösteriyor.

## Değişen Dosyalar

- `research/scripts/render-product.mjs` — `SCREENS`'ten `sube` düştü + gerekçe/geri-ekleme-koşulu yorumu
- `public/product/sube.webp` — **silindi** (hattın artık üretmediği varlık)
- `src/content/shots.ts` — `SHOTS.sube` künyesi kaldırıldı
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.1 kriteri 8 → 7, açıklama + edge case
- `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` — kapsam daralması notu (atom açık)
- `_dev/bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md` — kapsam daralması notu (atom açık)
- `_dev/BULGULAR.md` — B-044 kancası tazelendi, Son Güncelleme satırı

## Not

**Doğrulama — ne koşuldu, ne görüldü:**

| Kapı | Sonuç |
|---|---|
| `render-product.mjs` (araştırma konteyneri, `/demo` `:ro`) | 7 ekran üretildi, **denetim sızıntı bulmadı**, çıkış kodu **0** |
| `npx tsc --noEmit` (web konteyneri) | çıkış **0** |
| `npm run build` (yalıtılmış konteyner) | çıkış **0**, 23 rota üretildi |
| 16 rotanın HTML'i `sube.webp` referansı için tarandı | **0 referans**, 15 rota 200 + 404 sayfası 404 |
| `/product/sube.webp` | **404** (önce 200, 62.494 B) · `/product/grup.webp` hâlâ 200 |
| `scan.mjs /` ve `scan.mjs /ozellikler` (ürün turunu gösteren iki sayfa) | ikisinde de **konsol temiz** |
| `a11y.mjs` | **TOPLAM SORUN: 0** |

**Derleme paylaşılan `.next` hacmini ezmeden koşturuldu.** `docker-compose.yml`'de `.next` isimli bir hacim ve `web` servisiyle paylaşılıyor; oturum sırasında **paralel bir oturum TASK-1.07'yi çalıştırıyordu** ve geliştirme sunucusu ayaktaydı. Derleme bu yüzden `-v /app/.next` anonim hacmiyle yalıtılmış bir konteynerde koşturuldu — `docker compose restart web` gerekmedi, geliştirme sunucusu hiç kesilmedi. Ölçüldü: derlemeden sonra 3000 hâlâ 200 dönüyor.

**`AUDIT_ALLOW.sube` bilinçle bırakıldı** (`research/lib/screen-cleanup-v2.mjs`). Ekran listeden düştüğü için `auditTexts` artık o girdiyi hiç okumuyor — ölü ama zararsız: içindeki altı kalem ("Şube Detayı", "Aylık Ciro", "Gelir Kırılımı"…) masum etiketler, gerçek sızıntı dizgelerinin **hiçbiri** listede değil. Silmek, ekran hatta geri döndüğü gün yeniden çıkarılması gereken bir bilgiyi kaybettirirdi.

**Kapsam sınırı korundu:** `demo-shots.mjs` hâlâ `sube.html` yakalıyor ama o betik `research/out/` altına ham (temizlenmemiş) araştırma çıktısı yazıyor, yayın hattı değil — gitignore'da ve `public/`'e hiç dokunmuyor. Dokunulmadı.

Bulgu atomları: `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` · `_dev/bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md`. Hattın koşum tarifi ve konteyner kuralları: `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md`.
