# QUICK-002: Yasal metindeki anahtar yetkisi cümlesi ölçülene daraltılır (B-062)

**Durum:** ✅ Tamamlandı
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

## Yapılanlar

- **Ölçüm önce, iki taraftan** (kayıttan ve hafızadan yazılmadı): ucun depoya attığı yöntem kümesi `src/app/api/demo/route.ts`'in **dört `fetch` çağrısının tamamından** okundu — `toStore` → `POST /lead`, `notifyStore` → `PATCH /lead/{id}`, kalan ikisi Resend'e gidiyor; okuma çağrısı yok. Anahtarın açtığı rota kümesi komşu depodan (salt okunur) ayrıca ölçüldü: `pb_hooks/lead.pb.js` :20 `POST /lead` + :111 `PATCH /lead/{id}`, başka rota yok; `PATCH` beyaz listesi `lead_lib.js:69-70` → yalnız `notify_team` / `notify_lead`.
- **Cümle ölçülene göre yeniden kuruldu** (`src/content/legal.ts`, KVKK → Aktarım). Çürümeyen iki yarı (*"dışarıya açık okuma kuralları kapalıdır"* · *"var olan kayıtları okuyamaz"*) olduğu gibi korundu; ölçümün çapaları dosyanın Aktarım yorumuna yazıldı (TASK-2.17'nin kurduğu gelenek).
- **Kapı genişletildi** — `tests/legal-consistency.test.ts` dal 4'e ikinci ayak: metnin **saydığı yetkileri** yöntemlere bağlayan sözlük (`YETKI_IFADELERI`) + ölçülen yöntem kümesiyle **iki yönlü** karşılaştırma. Dal artık tavanı değil kullanımı çiviler; sınır `ÖLÇÜLEMEYEN` yorum bloğunda güncellendi.
- **B-062 kapatıldı** — Çözüm Kaydı dolduruldu, `**Durum:** ✅ Çözüldü`, atom düz `mv` ile `_dev/bulgular/archive/`e taşındı, `BULGULAR.md` index satırı silindi, açık bulgu sayacı 43 → 42 tazelendi.

## Değişen Dosyalar

- `src/content/legal.ts` — cümle + ölçüm çapası yorumu
- `tests/legal-consistency.test.ts` — dal 4 ikinci ayak (+1 test)
- `_dev/bulgular/B-062-…md` → `_dev/bulgular/archive/B-062-…md` (Çözüm Kaydı + Durum)
- `_dev/BULGULAR.md` — index satırı silindi, sayaç ve Son Güncelleme tazelendi, Gelen Kutusu'na `[QUICK-002]` satırı
- `_dev/DURUM.md` — Son Güncelleme

## Not

**Yayındaki cümlenin son hâli** (ziyaretçi diliyle, teknik terim değil davranış):

> "Kayıtları yalnızca yetkili yönetici hesabımız görebilir: veritabanının dışarıya açık okuma kuralları kapalıdır ve sitenin kullandığı anahtar yalnızca iki şey yapabilir — yeni bir talep kaydı oluşturabilir, bir de bildirim ve onay e-postalarının gönderilip gönderilmediğini kayda yazabilir; var olan kayıtları okuyamaz."

Üç yazım kararı: (a) *"yalnızca iki şey yapabilir"* çerçevesi seçildi çünkü eski kalıbı korumak (*"yalnızca yeni kayıt oluşturabilir, bir de…"*) kendi içinde çelişirdi; (b) güncellemenin **hedefi** yazılmadı (*"oluşturduğu kayda"* değil, *"kayda"*) — anahtarın yalnız kendi oluşturduğu kayda dokunabildiği bu depodan ölçülemez ve yazılsaydı B-062'nin sınıfının aynısı, yani ölçülmemiş bir **daraltma** olurdu; (c) *"bildirim ve onay e-postaları"* ikilisi `notify_team` + `notify_lead` alanlarına birebir oturuyor ve metnin Aktarım listesindeki *"talebinizin bize bildirilmesi ve size onay e-postası gönderilmesi"* ifadesiyle aynı sözcükleri kullanıyor.

**Negatif kontrol — üçü de kırmızı verdi**, üçü de scratchpad yedeğinden `cp` + md5 ile geri alındı (`git checkout`/`git restore` kullanılmadı):

| Sonda | Ne bozuldu | Görülen kırmızı |
|---|---|---|
| 1 | Cümle eski dar hâline döndürüldü | `claimOnce` (*«yeni bir talep kaydı oluşturabilir» ile eşleşen metin sayısı 0*) **ve** iki yönlü bağ (*uç depoya ["PATCH","POST"] yöntemleriyle gidiyor, KVKK metni ise [] yetkisini sayıyor*) |
| 2 | `POST` sözlükten düşürüldü | *karşılığı sayılmayan bir yöntemle gidiyor* dalı **tek başına** (1 failed / 31 passed) |
| 3 | Ucun `PATCH`'i `PUT`'a çevrildi | çağrı-çifti ölçümü (dış guard) kırıldı — davranış tarafının canlı olduğunun kanıtı |

Ayrıca duyarlılık çapası eklendi: ölçülen yöntem kümesi boş kalırsa iki karşılaştırma da bedava yeşil koşardı → `depoYontemleri.length > 0` kapısı.

## Sonuç

✅ Üç maddenin üçü de yapıldı.

**Ölçüm sonuçları** (hepsi bu turda koşuldu):

| Ölçüm | Sonuç |
|---|---|
| `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` | **217 geçti + 1 atlandı** (taban 216 + 1 → +1 yeni test) |
| `docker compose exec web npm test` (anahtarsız) | 210 geçti + 2 atlandı (taban 209 + 2) |
| `docker compose exec web npx tsc --noEmit` | çıkış **0** |
| `a11y.mjs` | **TOPLAM SORUN: 0** (`/kvkk` dâhil sekiz sayfa) |
| `scan.mjs /kvkk` | 6 kare · sayfa 4601 px · **konsol temiz** |
| `font-guard.mjs` | **kümede olmayan karakter YOK** (153 karakter · 16 sayfa · 85.129 karakter tarandı) |

⚠️ **Bu kaydın Test bölümündeki taban rakamı yanlıştı** — *"anahtarlı taban 211 geçti + 1 atlandı"* yazıyordu; ölçülen taban (HEAD `6f4eca9`) **216 + 1**'dir. Rakam kayıt açıldığında (audit-product triyajı) devralınmış, TASK-2.21'in eklediği testlerden önceki bir turdan kalmış olmalı. Yön doğruydu: sayı arttı, düşmedi.

⚠️ **`font-guard.mjs` 3100'e değil 3000'e karşı koşuldu** (`BASE` env'iyle). Gerekçe: üretim konteyneri bu turda bayat (07:41 imajı, güncel metni sunmuyor — B-019'un mekanizması) ve bu oturumun başlatmadığı bir servis; tazelemek için yeniden yaratmak gerekirdi. Ölçüm dev sunucusundaki **güncel** metni gezdi, yani kapsama iddiası yeni cümleyi gerçekten içeriyor.
