# QUICK-001: `sube.webp` üretim hattından düşürülüp yayından çekilsin

**Tarih:** 2026-09-12
**Durum:** ⬜ Bekliyor

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

## Değişen Dosyalar

## Not

Bulgu atomları: `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` · `_dev/bulgular/B-044-urun-gorselinde-semt-bas-harfi-ve-avatar-uyumsuzlugu.md`. Hattın koşum tarifi ve konteyner kuralları: `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md`.
