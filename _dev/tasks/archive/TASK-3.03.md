# TASK-3.03: Kapı zemini — 16 rota tek kaynaktan, yayın kopyası hedefi, çıkış kodu, kapsam eşiği

**Durum:** ✅ Tamamlandı
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** Yok

---

## Hedef

`a11y.mjs` ve `mobile-audit.mjs`'i **kapı** hâline getiren zemini kurmak: rota listesi tek kaynaktan türer (16 rota), ölçüm hedefi yayın kopyasıdır, eşik altı durumda betik **sıfır-olmayan çıkış kodu** döner, ve betik kendi **kapsamını** da eşikler (kaç sayfa gezdi, kaç eleman ölçtü, kaçını ölçemedi). Bu task'tan sonra iki betik de kırmızıya dönebilir hâle gelir — dedektörlerin kendisi sonraki task'larda gelir.

---

## Bağlam

B-030: beş kapının dördü eşik altında bile çıkış kodu 0 döndürüyor; M6 F6.1'in *"Eşik altı durumda sıfır-olmayan çıkış kodu döner"* kriteri ölçülmemiş. B-012: iki kapı rotaların yarısını hiç gezmiyor (`a11y` 8, `mobile-audit` 9; `font-guard` zaten 16). Kapsam kararı bu fazın kapı işini **a11y ve mobil ayağıyla** sınırladı — `perf` / `scan` / `font-guard`'ın çıkış kodu ve kapsam eşikleri "Kalite kapıları otomatik" fazında kalır.

Araştırma kararı (PHASE-3 → 4. yaklaşım): `sitemap.ts` araştırma konteynerinden **okunamaz** (konteyner yalnız `./research` dizinini görüyor), bu yüzden liste ayakta olan siteden `/sitemap.xml` ile HTTP üzerinden türetilir ve `/olmayan-sayfa` elle eklenir → ölçüldü: **15 + 1 = 16 rota**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3-ARASTIRMA.md` — 4. yaklaşım (rota kaynağı) + Teknik Kararlar (yayın kopyası)
- `_dev/bulgular/B-030-kapilar-kirmiziya-donemiyor.md` — eşik ve çıkış kodu kalemlerinin tamamı
- `_dev/bulgular/B-012-olcum-betikleri-rota-kapsami-eksik.md` — rota listelerinin bugünkü hâli
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — 3100'ün bayatlama mekanizması

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durum
- `_dev/modules/M6-Kalite-Kapilari.md` — F6.1'in kabul kriterleri artık ölçülü; rota kaynağı ve hedef değişikliği Teknik Notlar'a. F6.1'in Edge Case satırı bugün *"`perf.mjs` ve `font-guard.mjs` üretim konteyneri ayakta değilse…"* diyor — bu task'tan sonra kural **dört** betiği kapsar (`a11y` ve `mobile-audit` de 3100'e bakar), satır gerçeğe çekilir

---

## Alt Görevler

- [x] **1. Ortak rota kaynağı**
  - `research/lib/rotalar.mjs` (YENİ): `BASE`'e HTTP ile gidip `/sitemap.xml`'i ayrıştırır, yolları döndürür, `/olmayan-sayfa`'yı ekler
  - Liste 16'nın altına düşerse **hata fırlatır** (kapsam çökmesi sessiz geçmez)
  - `a11y.mjs` ve `mobile-audit.mjs` sabit `PAGES` dizilerini bırakıp bu kaynağı çağırır

- [x] **2. Hedef yayın kopyasına taşınır**
  - İki betikte de `const BASE = process.env.BASE || 'http://localhost:3100'` — `font-guard.mjs`'teki desenin aynısı
  - Varsayılan yayın kopyasıdır; `BASE` ile geliştirme sunucusuna yönlendirmek **bilinçli olarak açık** kalır (düzeltme task'larının ara doğrulaması için)

- [x] **3. Çıkış kodu**
  - İki betikte de eşik altı → `process.exitCode = 1`; geçme satırı ve çıkış kodu **aynı şeyi** söyler
  - Hedef erişilemezse yığın izi değil **cümle**: `Yayın kopyası 3100'de ayakta değil — ölçüm yapılmadı`

- [x] **4. Kapsam eşiği**
  - Çıktıya girer ve eşiklenir: gezilen rota sayısı (< 16 → kırmızı), ölçülen eleman sayısı (0 → kırmızı), `a11y` için ölçülemeyen (`skipped`) sayısı raporlanır
  - `TOPLAM SORUN: 0` satırı `16 sayfada 0` hâline gelir

- [x] **5. `a11y.mjs:112` teşhis satırı `fg`/`bg` değerlerini bassın**
  - Bugün `${x.color}` okuyor ve `undefined` yazıyor; nesnede `fg`/`bg` var (B-030 kalem e)

---

## Etkilenen Dosyalar

```
research/
├── lib/rotalar.mjs          # YENİ — sitemap.xml'den rota listesi
└── scripts/
    ├── a11y.mjs             # rota kaynağı, BASE, çıkış kodu, kapsam eşiği, teşhis satırı
    └── mobile-audit.mjs     # rota kaynağı, BASE, çıkış kodu, kapsam eşiği
```

---

## Dikkat Noktaları

- **Bu task'tan sonra `a11y.mjs` kırmızı koşacak ve bu beklenen sonuçtur:** 16 rotaya çıkınca 404'teki dev rakam (1,12:1) kapının görüş alanına girer. Kırmızı, kapının çalıştığının kanıtıdır — düzeltmesi TASK-3.13'te. CI yok, yani kırmızı hiçbir şeyi bloke etmez.
- **3100 bayat olabilir** (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir. Ölçmeden güvenme.
- **Kapının kendisi de ölçülür.** Çıkış kodunun gerçekten döndüğünü görmek için dayanağı bozup kırmızıyı gör: betiğin kopyasını boş sayfa sunan bir hedefe ya da olmayan bir rotaya çevir, `echo $?` ile doğrula. Dayanağı bozup kırmızıyı görmeden hiçbir dal çivilenmiş sayılmaz (`memory/urun-iddiasi-capa-dogrulamasi.md`).
- **HTTP durumu kontrolü bu fazın kapsamı dışındadır** (B-030 kalem c → "Kalite kapıları otomatik" fazı). Rota listesi `/sitemap.xml`'den geldiği için 404 riski zaten daralıyor; `/olmayan-sayfa` bilerek 404'tür.
- **`perf.mjs` ve `scan.mjs`'e dokunma** — onların çıkış kodu ve rota listesi kapsam dışı.

---

## Test Kriterleri

- [x] `docker compose --profile research run --rm research node scripts/a11y.mjs` → çıktı **16 sayfa** gezdiğini yazıyor
- [x] `docker compose --profile research run --rm research node scripts/mobile-audit.mjs` → çıktı **16 sayfa** gezdiğini yazıyor
- [x] İki betik de yayın kopyasını (3100) ölçüyor; `BASE=http://localhost:3000` ile geliştirme sunucusuna yönleniyor
- [x] Eşik altı bir koşumda `echo $?` → **1**; eşik üstünde → **0** (ikisi de gözlendi)
- [x] Hedef kapalıyken betik cümleyle duruyor, yığın izi basmıyor
- [x] Rota listesi 16'nın altına düştüğünde betik hata veriyor (kontrollü deneyle gözlendi)
- [x] `a11y.mjs` teşhis satırı artık renk değerlerini basıyor (`undefined` yok)

---

## Risk ve Geri Dönüş Planı

- **Rota listesi HTTP'ye bağlanıyor:** hedef ayakta değilse betik hiç koşamaz → cümleyle durma (alt görev 3) bunu karşılar; ayrıca `ROTALAR` env'i ile elle liste verilebilir kaçış yolu bırakılır.
- **Rollback:** iki betik de tek dosya; değişiklik `git checkout -- research/scripts/<betik>` ile dosya bazlı geri alınır (ağaç-geneli komut kullanılmaz).

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Ortak rota kaynağı doğdu** — `research/lib/rotalar.mjs`. Hedefin `/sitemap.xml`'ine HTTP ile gidiyor, `<loc>`'ların **yol** kısmını alıyor (adresler mutlak: `https://alpfitplus.com/...`, ham `loc` kullanılamazdı), yinelenenleri eliyor ve `/olmayan-sayfa`'yı ekliyor → **15 + 1 = 16**. Liste `BEKLENEN_ROTA = 16` tabanının altına düşerse cümleyle hata veriyor. Üst sınır yok: yeni sayfa eklenince liste kendiliğinden büyür.
- **`a11y.mjs` ve `mobile-audit.mjs` sabit `PAGES` dizilerini bıraktı** (8 ve 9 rota) ve bu kaynağı çağırıyor → ikisi de 16 rota. B-012'nin senkron kaybı kapandı: üç betiğin üçü de aynı listeyi görüyor.
- **Hedef yayın kopyasına taşındı** — `const BASE = process.env.BASE || 'http://localhost:3100'`, `font-guard.mjs`'teki desenin aynısı. `BASE` ile geliştirme sunucusuna yönlendirme bilinçli olarak açık.
- **Çıkış kodu kuruldu** — eşik altı → `process.exitCode = 1`. Geçme satırı ile çıkış kodu **tek bir `gecti` değişkeninden** türüyor, yani ikisi birbirinden kayamaz (B-030'un kök nedeni buydu: betik ölçüyordu ama sonucu bir karara bağlamıyordu).
- **Kapsam eşiği kuruldu** — çıktıya `KAPSAM:` satırı girdi: gezilen rota · ölçülen eleman · (a11y) ölçülemeyen / (mobil) ölçülen dokunma hedefi. Gezilen rota < 16 ya da ölçülen eleman = 0 → kırmızı. `TOPLAM SORUN: 0` satırı `16 sayfada TOPLAM SORUN: 0` oldu.
- **Tek rotanın düşmesi turu bitirmiyor ama sessiz de geçmiyor** — `page.goto` hatası yakalanıp cümleyle basılıyor, rota "gezilmedi" sayılıyor ve kapsam eşiği kırmızıya çeviriyor.
- **`a11y.mjs` teşhis satırı düzeldi** — `${x.color}` (hep `undefined`) yerine `metin rgb(...) / zemin rgb(...)`. Kontrast hatasını düzeltmek için gereken iki değer artık teşhis satırında duruyor (B-030 kalem e).
- **`mobile-audit.mjs` dosya başlığı ölçtüğüne indirildi** — başlık "taşan metin" sayıyordu, kod onu hiç ölçmüyordu (B-030 kalem d). Kırpılmış taşma dedektörü TASK-3.07'de gelecek ve o gün başlığa geri girecek; yorumda yazılı.

**Sorunlar:**
- **Yayın kopyası (3100) bayattı ve bu ölçüldü, varsayılmadı:** sunduğu site haritasının `lastmod`'u `2026-09-23T07:41Z`, oysa `a17ca7a` (yasal metin, 2026-09-23 19:11 +0300) daha yeni. Ayırt edici alanla doğrulandı — `/kvkk`'de *"bildirim ve onay e-postalarının"* ifadesi 3000'de **1**, 3100'de **0**. Konteyner bu oturumun değil (28 saattir ayakta, yabancı), o yüzden `--profile prod up -d --build` ile tazelenmedi; onun yerine **aynı kapı 3000'e karşı da koşuldu** ve iki koşum birebir aynı çıktı: 1906 eleman · 142 ölçülemeyen · 4 sorun. Yani bayatlığın bu turun rakamlarına etkisi **sıfır** (ölçüldü); etkisi olabilecek turlar için taze imaj borcu `_dev/BULGULAR.md`'de değil kapının kendi yorumunda ve M6 Teknik Notlar'da yazılı.
- **`/gecis` kapsama girince üç yeni kontrast ihlali göründü** (01 · 02 · 03 adım rakamları, 1,21:1) ve bunları kapsayan bir task yok — TASK-3.13 yalnız 404 ve çöküş sayfasını kapsıyor. Plan hatası değil, kapsam boşluğu: hiçbir task'ın doğruluğunu değiştirmiyor, yalnız bir düzeltme eksik kalıyor. Gelen Kutusu'na kaynak işaretli satır düşürüldü (`CLAUDE.md` → "Gördüğün sorunu düşürme").

**Kararlar:**
- **Hata cümlesi `BASE`'i parametreleştirdi:** task metni sabit *"Yayın kopyası 3100'de ayakta değil"* öneriyordu, ama `BASE` ile 3000'e yönlendirilmiş bir koşumda o cümle yanlış olurdu. Cümle hedefi kendisi yazıyor ve altına üç kurtarma satırı ekliyor (üretim konteynerini kaldır / `BASE` ile yönlen / `ROTALAR` ile elle liste ver). Gerekçe: cümlenin işi operatörü doğru yere göndermek.
- **`ROTALAR` kaçış yolu kaynağı değiştirir, eşiği değiştirmez.** Task'ın Risk bölümü elle liste verme yolunu istiyordu; o yol taban kontrolünü atlıyor (yoksa dar bir liste hiç kullanılamazdı) ama betiğin kendi kapsam eşiği yine sayıyor. Gerekçe: kaçış yolu fail-open bir delik olmamalı — ölçüldü, 2 rotalık listede kapı kırmızı döndü.
- **`a11y.mjs`'in `measured` sayacı yalnız kontrast oranı HESAPLANAN elemanları sayıyor** — atlananlar (gradyan zemin, şeffaf metin, `aria-hidden`) `skipped`'a gidiyor, sayaca girmiyor. Gerekçe: "0 eleman ölçüldü" eşiğinin anlamlı olması için sayaç *ölçümü* saymalı, *bakılanı* değil; aksi hâlde her şeyi atlayan bir kapı da "ölçtüm" derdi.
- **Kök `CLAUDE.md`'nin ölçüm tablosunda iki satır düzeltildi.** `mobile-audit.mjs`'in geçme şartı orada *"yatay kaydırma: yok"* yazıyordu; bu değişiklikten sonra kapı 278 sorunla kırmızı koşarken o şart hâlâ sağlanıyor — yani tablo **benim değişikliğim yüzünden** operatörü yanlış yönlendirir hâle geldi. İki satır geçme şartını çıkış koduna bağladı, ayrıca dört betiğin 3100'e baktığını söyleyen bir madde eklendi. Kapsam dışı kalan test-sayısı sapması (209 → 210) düzeltilmedi, Gelen Kutusu'na düştü.
- docs/DECISIONS.md'ye eklendi: **Hayır** — dördü de icra tercihi; geri dönüşü maliyetli bir sözleşme (ad, şema, API) bırakmıyorlar. Kalıcı sözleşme niteliğindeki iki kalem (rota kaynağı + yayın kopyası hedefi) zaten araştırma oturumunun **Teknik Kararlar**'ında kullanıcı kararı olarak duruyor; ikinci kez yazmak tekrar olurdu.

**Kalan İşler:**
- Yok. Kapının **dedektörleri** (piksel kontrast, gradyan metin dalı, başlık hiyerarşisi, kırpılmış taşma, dokunma hedefi kademesi) TASK-3.04–3.08'in işi; bu task yalnız zemini kurdu.

**Dosya Değişiklikleri:**
- `research/lib/rotalar.mjs` → **YENİ**. Sitemap'ten rota listesi, `ROTALAR` kaçış yolu, `BEKLENEN_ROTA = 16` tabanı, cümle-biçimli hatalar.
- `research/scripts/a11y.mjs` → rota kaynağı, `BASE` (3100 varsayılan), `measured` sayacı, kapsam eşiği, çıkış kodu, `goto` hata yakalama, teşhis satırında `fg`/`bg`.
- `research/scripts/mobile-audit.mjs` → aynı beşi + `geom`/`hedef` sayaçları; dosya başlığı ölçtüğüne indirildi.
- `CLAUDE.md` → ölçüm tablosunun iki satırı + 3100 maddesi.
- `_dev/modules/M6-Kalite-Kapilari.md` → F6.1 kabul kriterine kapsam eşiği maddesi, Durum notu, Edge Case dört betiğe genişledi, Teknik Notlar'a rota kaynağı ve hedef bloğu.
- `_dev/BULGULAR.md` → Gelen Kutusu'na iki satır; Son Güncelleme.

**Test Sonuçları:**

*Kapsam: iki betik de araştırma konteynerinde, yayın kopyasına (3100) ve geliştirme sunucusuna (3000) karşı koşuldu. Dedektör davranışı (kontrast yöntemi, kırpma, dokunma hedefi kademesi) bu turun kapsamı dışında — bu task zemini ölçer, dedektörü değil.*

**Önce / sonra (aynı betik, aynı makine):**

| Ölçüm | Önce (`b76e925`) | Sonra |
|---|---|---|
| `a11y.mjs` gezilen rota | **8** | **16** |
| `a11y.mjs` TOPLAM SORUN | 0 | **4** |
| `a11y.mjs` çıkış kodu | **0** | **1** |
| `mobile-audit.mjs` gezilen rota | **9** | **16** |
| `mobile-audit.mjs` TOPLAM SORUN | 157 | **278** |
| `mobile-audit.mjs` çıkış kodu | **0** | **1** |

**Kapı koşumları (yayın kopyası, 3100):**
- `a11y.mjs` → `KAPSAM: 16 rota gezildi · 1906 eleman ölçüldü · 142 ölçülemeyen` · `16 sayfada TOPLAM SORUN: 4` · `✗ KAPI KIRMIZI` · **çıkış kodu 1**. Dört sorun: `/gecis`'te üç adım rakamı (1,21:1, 36 px) + `/olmayan-sayfa`'da dev "404" (1,17:1, 112 px).
- `mobile-audit.mjs` → `KAPSAM: 16 rota gezildi · 6290 eleman ölçüldü · 621 dokunma hedefi ölçüldü` · `16 sayfada TOPLAM SORUN: 278` · **çıkış kodu 1**. Yatay kaydırma 16/16 rotada **yok**; taşan eleman yalnız `/demo`'da 3 (bal küpü, bilinçli).
- `BASE=http://localhost:3000` → iki betik de yönlendi (`Hedef:` satırı doğruladı); a11y 3000'de **birebir aynı** üç rakamı verdi (16 / 1906 / 142 / 4).

**Kalibrasyon kolu — "0 buldum" ile "bakmadım"ı ayıran ölçüm:** devralınan bir rakam yeniden üretildi. 404'ün dev rakamı **1,17:1** ölçüldü; B-032'nin kaydı **1,12–1,17:1**, B-012'ninki aynı aralık. Kapı gerçekten bakıyor.

**Kapının kendisi sınandı — dört sonda, hepsi yerelde ve oturum içinde:**

| Sonda | Ne yapıldı | Görülen |
|---|---|---|
| Bozuk girdi — hedef ölü | `BASE=http://localhost:3457` (port ölçülerek boş doğrulandı) | Cümle + üç kurtarma satırı, **yığın izi yok**, çıkış kodu **1** |
| Bozuk girdi — rota listesi çöktü | 3 `<loc>`'lu site haritası sunuldu | `Rota listesi çöktü: site haritası 3 rota verdi, toplam 4 — beklenen taban 16`, çıkış kodu **1** |
| **Boş kapsam** | Hedef 16 rotanın hepsinde ölçülebilir metin sunmadı (a11y: `h1` var ama `aria-hidden`; mobil: gövde boş) | `16 sayfada TOPLAM SORUN: 0` **ama** `✗ KAPSAM EŞİĞİ: 0 eleman ölçüldü` → çıkış kodu **1**. Fail-open tam burada görünürdü: sorun sayısı sıfır, yine de kırmızı |
| **Kontrol grubu (yeşil ayak)** | 16 rotanın hepsinde tek `h1` + beyaz üstüne siyah paragraf | `✓ KAPI YEŞİL — 16 sayfada 0`, çıkış kodu **0** — kapı yeşile *dönebiliyor*, yani kırmızı bir kilitlenme değil |

**Kaçış yolu fail-closed mi:** `ROTALAR=/destek,/kvkk` → `KAPSAM: 2 rota gezildi` · `✗ KAPSAM EŞİĞİ: gezilen rota 2 < beklenen 16` · çıkış kodu **1**. Elle liste kapıyı açmıyor.

**Sonda düzeneği:** dört sondanın üçü scratchpad'de duran statik bir siteyle koşuldu (`python3 -m http.server`, 127.0.0.1:3457). Kaynağa değil **girdiye** dokunuldu; repodaki betikler koşumların hepsinde değiştirilmeden çalıştı. Sunucu her sondadan sonra kapatıldı ve kapanma pozitif kontrolle ölçüldü (port `BOŞ` → `DOLU` → `BOŞ`).

**Regresyon:** `docker compose exec web npm test` → **210 geçti + 2 atlandı**, çıkış kodu 0 (env kapılı iki dal varsayılan koşumda atlanıyor — beklenen). Betikler Vitest kapsamında değil; bu koşum yalnız "başka bir şey kırılmadı" der.

---

**Oluşturulma:** 2026-09-23
