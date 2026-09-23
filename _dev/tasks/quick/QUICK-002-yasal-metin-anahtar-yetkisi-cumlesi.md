# QUICK-002: Yasal metindeki anahtar yetkisi cümlesi ölçülene daraltılır (B-062)

**Durum:** ⬜ Bekliyor
**Tür:** çalışma quick'i (yayın/acil düzeltme DEĞİL — çalışma dalında, olağan akış)
**Açıldı:** 2026-09-23 — audit-product triyajı
**Bulgu:** [B-062](../../bulgular/B-062-yasal-metin-anahtar-yetkisini-dar-gosteriyor.md)

---

## Neden

Yayındaki KVKK/Gizlilik metni depo anahtarını olduğundan **dar** gösteriyor: *"yalnızca yeni kayıt oluşturabilir"* diyor, ama uç aynı anahtarla var olan kayda `PATCH` de atıyor (onay e-postası gidince bildirim durumunu güncelliyor — TASK-2.07). Cümlenin *"okuyamaz"* yarısı doğru ve korunacak.

Kullanıcı kararı (2026-09-23, step-by-step): **cümle ölçülene daraltılır** — anahtarın yetkisini daraltıp cümleyi korumak (komşu deponun canlı yetki ayarına dokunmak) reddedildi, cümleyi tamamen kaldırmak da reddedildi (bugün doğru ve güven veren bilgiyi kaybettirirdi).

## Ne Yapılacak

1. **Cümleyi düzelt** — `src/content/legal.ts:160`, Gizlilik + KVKK ortak paragrafı. Bugünkü hâli:

   > "Kayıtları yalnızca yetkili yönetici hesabımız görebilir: veritabanının dışarıya açık okuma kuralları kapalıdır ve sitenin kullandığı anahtar yalnızca yeni kayıt oluşturabilir, var olan kayıtları okuyamaz."

   Hedef anlam: anahtar **yeni kayıt oluşturabilir** ve **oluşturduğu kaydın bildirim durumunu güncelleyebilir**; var olan kayıtları **okuyamaz**. Cümlenin son hâlini yazan tur, ziyaretçi diliyle kurar (teknik terim değil davranış) ve metnin geri kalanının tonunu bozmaz.

   ⚠️ Bu bir **olgu iddiasıdır**: yazmadan önce ucun depoya attığı HTTP yöntemlerinin kümesini yeniden ölç (`src/app/api/demo/route.ts` → tüm `fetch` çağrıları), cümleyi ölçülene göre kur. Hafızadan ya da bu kayıttan yazma — kayıt da devralınan bir özettir (`memory/urun-iddiasi-capa-dogrulamasi.md`).

2. **Kapıyı genişlet** — `tests/legal-consistency.test.ts` → dal 4. Bugün yalnız "site kodu okuma yapmıyor"u çiviliyor; ikinci ayak: ucun depoya attığı **yöntem kümesi** (`POST` + `PATCH`) metnin saydığı yetkilerle uyuşsun — küme büyüdüğünde test kırmızı dönsün. Negatif kontrolle sına (dayanağı boz, kırmızıyı gör, geri al — `git checkout`/`git restore` **kullanma**, yedekten `cp` + md5).

3. **B-062'yi kapat** — atomun Çözüm Kaydı'nı doldur, `**Durum:** ✅ Çözüldü` yap, atomu `_dev/bulgular/archive/`e **düz `mv`** ile taşı ve commit'e **eski yolu da** stage et; `_dev/BULGULAR.md`'deki index satırını sil ve açık bulgu sayacını tazele.

## Kapsam Dışı

- **Anahtarın gerçek yetkisini daraltmak** (komşu depoda `PATCH` ucunu kapatmak) — kullanıcı bu turda reddetti; ayrı bir gerekçeyle, kendi turunda konuşulur.
- **Anahtarın yetki yüzeyinin ölçülmesi** (koleksiyon kuralları) — komşu depoda yaşıyor, bu depodan ölçülemez; B-062'nin Koruma Önerisi bunu adıyla dışarıda bırakıyor.

## Test

- `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → taban **211 geçti + 1 atlandı**; yeni ayakla sayı artar, düşmez.
- `docker compose exec web npx tsc --noEmit` → çıkış 0.
- Metin değiştiği için `font-guard` (yeni karakter girdi mi) ve `a11y` (TOPLAM SORUN 0) koşar; `scan` yasal rotada konsol temizliğini doğrular.

## Sonuç

<!-- İş bitince doldurulur -->
