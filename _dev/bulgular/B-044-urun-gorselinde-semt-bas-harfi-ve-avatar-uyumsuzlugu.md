# B-044: Ürün görselinde gerçek pilot semtinin baş harfleri duruyor; avatar-ad uyumsuzluğu yayınlanan üç görselde — denetim iki harfli jetona yapısal olarak kör

**Önem:** 🟡 | **Tip:** hata / iddia sızıntısı | **Alan:** M5 — Görsel varlık hattı
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `research/lib/screen-cleanup.mjs:60` tablonun kendi yazılı kuralı: *"**KURAL: hiçbir karede tam soyadı ve gerçek semt adı kalmayacak.**"* Şube eşlemelerinin yanındaki gerekçe (`:62`): *"**gerçek pilot şubelerini ifşa etmemek için** semt adı kullanmıyoruz; jenerik 'Merkez/Sahil/Vadi' hiçbir kulüple eşleşmez."* `modules/M5-Gorsel-Varlik-Hatti.md` → F5.1: *"kişi/yer temizliği (nötr adlar, **avatar baş harfleri senkron**)"*. `docs/CLAIMS.md`: *"sızıntı varsa üretim durur."*

**Gözlenen — üç ayrı kalem. Sekiz görselin tamamı gözle okundu; bu, [B-018](B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md)'in "kapsam notu"nu kapatır.**

**(1) Semt baş harfleri temizlenmiyor — gerçek pilot şubesi çıkarılabilir hâlde.**
`public/product/sube.webp`: şube adı **"Vadi"** (doğru, temizlenmiş), avatarı **"BŞ"**. Kaynak `../Alpfit.v1/demo/sube.html:142-148`:
```html
<div class="big-av" ...>BŞ</div>
<h2>Beşiktaş <span class="new">YENİ</span></h2>
```
`REPLACEMENTS:65` `['Beşiktaş', 'Vadi']` metni değiştiriyor. `AVATAR_SELECTOR` (`:96`) `.big-av`'ı **içeriyor**, yani düğüm ziyaret ediliyor — ama `INITIALS` tablosunun **on beş anahtarının tamamı kişi baş harfi**; semt girdisi yok. Sonuç: yayınlanan karede `BŞ` + "Vadi · İstanbul" + "Açılış: Şubat 2026 · 4 aylık" yan yana duruyor.
Sınıf sistemik: `patron-mobil.html:275,285,295` → **`TU`/Tuzla, `KA`/Kadıköy, `BŞ`/Beşiktaş** — üç semtin üçü de baş harfle. (patron-mobil bugün yayımlanmıyor; aynı tablo onu da üretiyor.)

**(2) Avatar seçicisi `.av` sınıfını hiç görmüyor — 25 düğüm haritanın dışında.**
`AVATAR_SELECTOR = '.avatar, .av-sm, .big-av'`. Kaynak sayımı: `grup.html` **17 × `class="av"`**, `takvim.html` **8 × `class="av"`**. Bu iki belge **üç yayın görseli** üretiyor (`grup.webp`; `takvim.html` → `takvim.webp` + `uye-telefon.webp`). Yayınlanan görsellerde gözle ölçülen sonuç:
```
grup.webp    : "Burak Ş."+DK   "Deniz A."+EÖ   "Tolga B."+BT
takvim.webp  : "Aslıhan A."+AK
```
Kaynak teyidi `grup.html:246-249`: `<span class="av">DK</span>` + `<div class="nm">Kenan Yıldız</div>`. `REPLACEMENTS` Kenan Yıldız → Burak Ş., `INITIALS` `KY→BŞ` — ama kaynak avatarı zaten `DK`, anahtar eşleşmiyor ve düğüm hiç ziyaret edilmediği için dokunulmuyor. `REPLACEMENTS:68` yorumunun kendi talimatı (*"baş harfleri INITIALS ile senkron tutun"*) karşılanmıyor.

**(3) Denetim bu sızıntı sınıflarına yapısal olarak kör — ölçüldü.**
`auditTexts()` yalnız **iki dal** taşıyor: iki-tam-sözcük ad kalıbı (`/[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g`) ve `weekend-plus` marka regex'i. 21 gerçek sızıntı dizgesi kalıba verildi, **20'si kör** (tek GÖRÜR: "Alpfit Plus" — o da izin listesinde):
```
KÖR: BŞ · TU · KA · DK · EÖ · BT · AK · Beşiktaş · "Simge & Gizem" · "Gizem Ö."
     "~₺110B/ay artabilir" · "+%34 geçen aya göre" · "en hızlı büyüyen şube"
     "Açılış: Şubat 2026 · 4 aylık" · "Şubede en yüksek öğrenci tutma oranı"
     "%91 3 aylık tutma" · "Kampanyalar" · "Yenileme & Churn" · "Ekipte: Mar 2023"
```
**B-018'in yazdığından keskin olan kök neden budur: iddia sızıntısı için hiç DAL YOK.** Yüzde, ciro, üstünlük, tarih ve yol-haritası kalemleri "kalıp kaçırdı" değil, **hiç kontrol edilmiyor**. Ek olarak `DROP_NODES` (karşılanmayan iddia düşürme) sekiz ekranın yalnız **üçünü** kapsıyor (`antrenor`, `takvim`, `uye-telefon`); `cockpit`, `finans`, `raporlar`, `grup`, `sube` için boş.

**Sekiz görselin tam envanteri** (B-018'in üç sınıfı dışındakiler **kalın**):

| Görsel | Kalemler |
|---|---|
| `cockpit.webp` | **"Vadi · Alpfit Plus · 4 aylık"** · "+%12,4"/"+%8"/"+%11"/"+%34 geçen aya göre" · "842 Aktif Üye · +71 bu ay yeni" · ₺2,14M / ₺910.000 / ₺820.000 / ₺410.000 /ay · "en hızlı" rozeti · "1. ciro"/"2. ciro" · **"3 şube · Haziran 2026"** · "Kampanyalar" nav |
| `takvim.webp` | **"Aslıhan A."+AK uyumsuzluğu** · "Kampanyalar" nav · "%84 doluluk oranı" |
| `finans.webp` | **"Ciro Trendi · son 6 ay" (Oca→Haz altı aylık geçmiş)** · "+%12,4" · "%59/%29/%12 pay" · ₺2.140.000 · "Haziran 2026" · "Kampanyalar" nav |
| `antrenor.webp` | **"Ekipte: Mar 2023"** · **"★ Şubede 1."** · "Aktif · PT + Reformer" · **"%91 3 aylık tutma" + "Şubede en yüksek öğrenci tutma oranı"** · "son 6 ay" · öğrenci devam %95/%92/%88/%80/%74 · "Kampanyalar" nav |
| `raporlar.webp` | "Yenileme & Churn" kartı (B-018) · "Kampanyalar" nav · **`shots.ts:49` alt metni bu kartı hiç anmıyor** |
| `sube.webp` | **"BŞ" avatarı (kalem 1)** · "Açılış: Şubat 2026 · 4 aylık" · "Aktif · Alpfit Plus konsepti" · "★ en hızlı büyüyen şube" · "+%34" · "227 · +30 bu ay **(rekor)**" · "Aylık Ciro Trendi · açılıştan bugüne" · "Hedefe İlerleme Q2 2026" · "Simge & Gizem" (B-018) · "~₺110B/ay artabilir" (B-018) · "grubun en hızlısı" |
| `grup.webp` | "Gizem Ö." (B-018) · **üç avatar uyumsuzluğu (kalem 2)** · "Kampanyalar" nav · doluluk %96/%88/%71/%64/%81 · ₺68.400 |
| `uye-telefon.webp` | **temiz.** Tek not: üçüncü antrenör kartı sağ kenarda kırpık ("Tu…") — kaydırılabilir sıra izlenimi, muhtemelen bilinçli |

"Kampanyalar" nav girdisi sekiz görselden **yedisinde** (uye-telefon hariç) — B-018 teyit.

**Etki kalibrasyonu — önemli:** `sube.webp` **hiçbir sayfada render edilmiyor**. `SHOTS.sube` tanımlı ama tüketicisi yok (`grep -rn "SHOTS\." src/` → 7 görsel kullanılıyor, `sube` yok) ve 15 rotanın hiçbirinin HTML'inde `sube.webp` geçmiyor. Yani kalem 1'in ve B-018'in en ağır sızıntılarının **görünür yüzeyi yok**; dosya yalnız `/product/sube.webp` adresinden **200 dönüyor** (62.494 B, canlı önizlemede doğrulandı). Kalem 2 ise **gösterilen** görselleri etkiliyor: `grup.webp` ProductStory adım 2 olarak `/` ve `/ozellikler`'de, `takvim.webp` adım 1 ve Roller sekmesinde.

## Kanıt

```
$ grep -oE 'class="(avatar|av|av-sm|big-av)"' ../Alpfit.v1/demo/grup.html | sort | uniq -c
     17 class="av"        1 class="avatar"
$ grep -oE 'class="(avatar|av|av-sm|big-av)"' ../Alpfit.v1/demo/takvim.html | sort | uniq -c
      8 class="av"        1 class="avatar"
$ sed -n '96p' research/lib/screen-cleanup.mjs
export const AVATAR_SELECTOR = '.avatar, .av-sm, .big-av';       ← .av YOK

$ grep -n "big-av" -A4 ../Alpfit.v1/demo/sube.html | grep -E "BŞ|Beşiktaş"
145:  BŞ
148:  <h2>Beşiktaş <span class="new">YENİ</span></h2>
$ grep -n "TU\|KA\|BŞ" -A3 ../Alpfit.v1/demo/patron-mobil.html | grep -E "Tuzla|Kadıköy|Beşiktaş"
277: Tuzla     287: Kadıköy     298: Beşiktaş

$ node scratchpad/audit/regex-probe.mjs      # 21 dizge, auditTexts kalıbına karşı
  → 20 KÖR, 1 GÖRÜR ("Alpfit Plus", izinli)

$ grep -rn "SHOTS.sube" src/                 → (yok)
$ curl -so /dev/null -w "%{http_code} %{size_download}\n" .../product/sube.webp   → 200 62494
```

## Kök Neden Yönü

Temizlik hattı **metin** için tasarlanmış ve o katmanda özenli: eşleme tablosu uzundan kısaya sıralanıyor, izin listeleri ölçülerek doldurulmuş, gerekçeler yazılı. İki boşluk yapısal:

- **Baş harf ayrı bir bilgi türü ve tabloda yalnız kişiler için var.** Semt eşlemesi metni değiştiriyor, baş harf karşılığı hiç düşünülmemiş — çünkü baş harf "ad" gibi görünmüyor. Aynı nedenle `.av` sınıfı seçiciye girmemiş: seçici üç sınıf adıyla elle yazılmış ve dördüncüsü kaynağın en kalabalık avatar sınıfı.
- **Denetim, temizliğin kalıbını paylaşıyor.** B-018 bunu "bağımsız olmayan bir denetim, denetim değil teyittir" diye yazmıştı; ölçüm o teşhisi doğruluyor ve bir adım ötesine taşıyor: denetimin iki dalı var, sızıntı sınıfları **beş**. İki harfli jeton, tek sözcüklü semt adı, `&` ile bağlı ad ve kısaltılmış ad ad-dalının dışında; yüzde/ciro/üstünlük/tarih hiçbir dalın içinde değil.

## Koruma Önerisi

- `AVATAR_SELECTOR`'a `.av` eklenir; ama daha sağlamı **seçici listesini terk etmek**: 1-3 karakterlik büyük-harf metin düğümlerinin tamamı avatar adayı sayılıp eşleme tablosundan geçirilir.
- `INITIALS` tablosu `REPLACEMENTS`'tan **türetilir**: her eşlemenin hem kaynak hem hedef adının baş harfleri otomatik üretilir (kişi **ve semt**). Tablo zaten adları biliyor; baş harfi elle yazmak bu boşluğun kaynağı.
- **Denetim bağımsızlaşır ve dalları çoğalır:** (a) eşleme tablosundaki her adın ve semtin **her parçası** — tam, kısaltılmış ve baş harf hâlleriyle — yasaklı sözcük listesi olur; (b) iddia sözlüğü eklenir (`₺…B/ay`, `+%NN`, `en hızlı`, `en yüksek`, `rekor`, `Şubede 1.`, `son N ay`, `Açılış: …`, `Ekipte: …`); (c) yol-haritası kalemleri `src/content/`'teki envanterden ([B-040](B-040-urun-yol-haritasi-dort-evde.md)) okunur ve nav girdisi/kart olarak görünürse kırmızıya döner. Bu sözlük M6 F6.4'ün metin tarafıyla **aynı listeyi** paylaşabilir.
- `DROP_NODES` sekiz ekranı da kapsar (bugün üçü).
- **Bugün yapılabilecek en ucuz iş:** `sube.webp` yayından çekilir (`render-product.mjs`'in `SCREENS` listesinden düşürülerek — `public/` elle düzenlenmez). Bu, B-018'in ve kalem 1'in kamuya açık yüzeyini kapatır; "çıktı 8 `.webp`" kriteri de kullanımla hizalanır.
- Düzeltme sonrası **sekiz görselin tamamı** yeniden denetlenir; yukarıdaki envanter kapanış kapsamının ölçütüdür.

**2026-09-12 kapsam daralması (QUICK-001) — atom AÇIK kalır.**

`sube` ekranı `render-product.mjs`'in `SCREENS` listesinden düşürüldü ve `public/product/sube.webp` yayınlanan kümeden çıktı (`/product/sube.webp` → **404**). Bu **yalnız kalem 1'in yayınlanan örneğini** kaldırır: "Vadi" yazan karedeki `BŞ` avatarı artık üretilmiyor.

**Kapanmayan — bu yüzden atom açık:**
- **Kalem 1 sınıf olarak duruyor.** `INITIALS` tablosunda hâlâ semt girdisi yok; `patron-mobil.html`'deki `TU`/Tuzla, `KA`/Kadıköy, `BŞ`/Beşiktaş aynı tablodan üretilir. Ekran bugün yayımlanmıyor, ama hatta girdiği gün aynı sızıntıyla gelir.
- **Kalem 2 hiç etkilenmedi** ve **gösterilen** görselleri etkiliyor: `grup.webp`'te üç uyumsuzluk (`"Burak Ş."+DK`, `"Deniz A."+EÖ`, `"Tolga B."+BT`), `takvim.webp`'te bir (`"Aslıhan A."+AK`). `AVATAR_SELECTOR` hâlâ `.av` sınıfını görmüyor — 25 düğüm haritanın dışında.
- **Kalem 3 hiç etkilenmedi.** Denetim hâlâ iki dallı; ekran düşürmek dal açmaz.

Yukarıdaki envanter tablosunun `sube.webp` satırı bugünden itibaren **tarihsel** okunur — o ekran artık üretilmiyor. Kalan yedi satır kapanış kapsamının ölçütü olmayı sürdürür. Koruma Önerisi'ndeki *"bugün yapılabilecek en ucuz iş"* maddesi **yapıldı**; listedeki diğer maddeler açık.

## Çözüm Kaydı

—
