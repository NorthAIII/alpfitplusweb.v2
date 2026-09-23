# TASK-2.11: Chat, SSS, fiyat ve karşılaştırma sayfası tek kaynaktan okur (B-040, B-014)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri · F1.3: Chat bilgi ağacı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.08 (sabit) · TASK-2.10 önerilir (türetme fonksiyonu orada bir kez sınanmış olur)

---

## Hedef

Yol haritasının kalan kopyalarını kaldırmak. İki sınıf var:

- **Liste kopyaları (üç ev):** `chat.ts`'in "Ürün hangi aşamada?" cevabı, `faq.ts`'in aynı sorusu ve fiyat sayfasının `NOT_INCLUDED` listesindeki iki "(yol haritasında)" kalemi.
- **Tekil kalem cümleleri (beş yer, verify-plan 2026-09-22'de ölçüldü):** yol haritasındaki **tek bir kalemi** adıyla anan düzyazı cümleler — `karsilastirma.ts:80` ve `:125`, `chat.ts:87`, `faq.ts:24` ve `:40`. Hepsi bugün **doğru**; riski o kalem geldiği gün sessizce yanlışa dönmeleri.

İkisi de `product.ts`'teki sabitten türer. Task, bu evlerin hiçbirinde elle yazılmış yol-haritası kalemi kalmadığında ve chat ağacının modül sayımı `PRODUCT_STATUS`'tan geldiğinde tamamlanmış sayılır.

---

## Bağlam

Üç ev bugün üç farklı sayı taşıyor: `chat.ts:127` ve `faq.ts:48` üçer kalem ("Apple Health ve Google Fit" yok), fiyat sayfası iki kalem. Ayrıca `chat.ts:126` `PRODUCT_STATUS.modules`'ün sekiz modüllük düzyazısını **elle kopyalamış** — bu B-014'ün kendisi ve aynı hamlede kapanabilir.

Fiyat sayfasının listesi bir alt kümedir: `NOT_INCLUDED` yalnız "pakete dâhil değil" bağlamında iki kalemi anıyor. Sabitten **türetilir** ama kendi bağlam metnini (ücretlendirme) korur.

**Tekil cümleler B-040'ın tablosunda yok — verify-plan ölçtü.** Atomun kanıt komutu "yol haritası **listesi**" arıyordu; aynı komut bugün beş düzyazı cümleyi daha buluyor: karşılaştırma sayfasının "Turnike ya da kart okuyucu almak zorunda mıyım?" cevabı (`karsilastirma.ts:80`) ve "Turnike ve geçiş kontrolü ürünü değiliz" bloğu (`:125`), asistanın turnike cevabı (`chat.ts:87`), SSS'nin turnike (`faq.ts:24`) ve online ödeme (`:40`) cevapları. Beşi de kalemi **adıyla** anıyor ("QR ve turnike", "Online ödeme") ve hiçbiri sabite bağlı değil — yani B-040'ın kapanış ölçütü bu cümleler bağlanmadan geçemez (kullanıcı kararı, verify-plan 2026-09-22: ikisi de kapsama alındı).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-040-urun-yol-haritasi-dort-evde.md` · `_dev/bulgular/B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md`
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — sabit ve türetme fonksiyonu
- `_dev/docs/CLAIMS.md` → Tek Kaynaklar — chat cevaplarının sınırı; fiyat rakamı `monthlyFor()`'dan gelir
- `src/content/chat.ts:120-131` (liste) ve `:84-88` (tekil) · `src/content/faq.ts:46-49` (liste), `:22-25` ve `:38-41` (tekil) · `src/app/fiyat/page.tsx:29-34` · `src/content/karsilastirma.ts:77-82` (`COMPARE`) ve `:122-126` (`NOT_US`)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-040-*.md` — **B-040 bu task'ta kapanır** (beş evin beşi bağlandı); `_dev/bulgular/B-014-*.md` — modül sayımı ayağı kapanırsa Çözüm Kaydı

---

## Alt Görevler

- [x] **1. `chat.ts` "asama" düğümü**
  - Modül sayımı `PRODUCT_STATUS.modules`'ten, yolda/yol haritası kalemleri sabitten türer
  - Pilot cümlesi `PRODUCT_STATUS.sentence`'tan gelir (B-014'ün asıl şikâyeti)
  - Ağacın çıkış disiplini korunur: cevap ya devam sorusu ya kişiye bağlantı taşır (F1.3 kabul kriteri)

- [x] **2. `faq.ts` "Ürün hangi aşamada?"**
  - Aynı türetme; bugün zaten `PRODUCT_STATUS.sentence` kullanıyor, kalem listesi de sabitten gelir

- [x] **3. Fiyat sayfası `NOT_INCLUDED`**
  - "(yol haritasında)" ekli iki kalem sabitin yol-haritası kademesinden türer; kalan iki kalem (markalı uygulama, web sitesi yapımı) **yol haritası değil**, oldukları gibi kalır
  - Fiyat rakamları `PRICING`/`monthlyFor()`'dan gelmeye devam eder — bu task oraya dokunmaz

- [x] **4. Tekil kalem cümleleri sabitin adını okur**
  - Beş cümle (`karsilastirma.ts:80`, `:125`, `chat.ts:87`, `faq.ts:24`, `:40`) kalem adını elle yazmak yerine sabitten alır
  - **Cümleler yeniden yazılmaz** — yalnız kalem adı değişkenleşir; ton, uzunluk ve anlam aynı kalır (ton işi F1.2, başka faz)
  - Kalem sabitte "yolda"ya taşınırsa ya da adı değişirse cümle kendiliğinden hizalanır; gelecekte kalem "bugün var"a geçtiğinde cümlenin **kendisi** hâlâ elle gözden geçirilmeli — bu sınır Alt Görev 4'ün kod yorumuna yazılır

---

## Etkilenen Dosyalar

```
src/content/
├── chat.ts            # asama düğümü + turnike cevabı sabitten türer — zaten var
├── faq.ts             # aynı soru + turnike/online ödeme cevapları — zaten var
└── karsilastirma.ts   # COMPARE turnike satırı + NOT_US bloğu — zaten var
src/app/fiyat/
└── page.tsx           # NOT_INCLUDED'ın iki kalemi türetilir — zaten var
```

---

## Dikkat Noktaları

- **Chat cevabı bir iddia yüzeyidir.** `docs/CLAIMS.md` sınırı burada da geçerli; ileride model bağlandığında (M4 F4.2) bu ağaç sistem talimatının bilgi tabanı olur — yanlış kalem oraya da taşınır.
- **Düzyazı akıcı kalmalı.** Türetme virgülle bağlıyor; cümle sonu, "ve" bağlacı ve büyük harf başlangıcı türetme fonksiyonunda çözülür, çağrı yerinde elle düzeltilmez.
- **`NOT_INCLUDED` bir alt kümedir** — sabitin tamamını oraya dökme; fiyat bağlamına giren iki kalem türetilir.
- **Font kümesi:** yeni karakter girerse `font-guard.mjs` yakalar; küme `research/FONT-KARAKTER-KUMESI.txt` + `font-subset.mjs` ile genişletilir (`CLAUDE.md`).
- Asistan arayüzü (M4) bu task'ın konusu değil — yalnız ağacın içeriği değişir.
- **`karsilastirma.ts` kendi tek-kaynak disiplinini taşıyor** (`docs/CLAIMS.md` → Tek Kaynaklar: karşılaştırma **yöntemi ve erişim tarihi** zorunlu, rakip **adı yok**). Bu task orada yalnız yol-haritası kalem adını değişkenleştirir; yöntem, tarih ve "18 üründe rastlamadık" gibi kıyas cümlelerine **dokunmaz**.
- **Dört dosya, tek oturum.** Kapsam bilinçli olarak genişletildi (kullanıcı kararı, verify-plan 2026-09-22) çünkü B-040'ın kapanışı beş tekil cümle bağlanmadan ölçülemiyor. Beşi de aynı mekanik değişiklik — bölünecek bir "önce şunu sonra bunu" yok.

---

## Test Kriterleri

- [x] B-040'ın kanıt komutu (`grep -rn "Online ödeme\|QR ve turnike\|Apple Health\|yapay zekâ analiz\|Kurumsal üyelik" src/`) artık **yalnız sabiti** buluyor — liste evlerinin beşinde de, tekil cümlelerin beşinde de elle yazılmış kalem adı yok (bugünkü taban: 12 eşleşme, 7 dosya)
- [x] Beş tekil cümlenin metni **anlamca değişmedi**: değişiklik öncesi/sonrası render edilen cümleler yan yana dokümana yazıldı (yalnız kalem adı kaynağı değişti)
- [x] Chat ağacında "Ürün hangi aşamada?" cevabı sabitle ve `PRODUCT_STATUS` ile birebir uyumlu; ağaçta çıkışsız düğüm yok
- [x] Fiyat sayfasında "(yol haritasında)" kalemleri sabitten türüyor; fiyat rakamları hâlâ `monthlyFor()`'dan geliyor
- [x] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` `/`, `/fiyat` ve asistan açıkken konsol temiz
- [x] `docs/CLAIMS.md` tablosuna aykırı yeni cümle yok

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-23

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Yol haritasının kalan üç liste kopyası kalktı.** `chat.ts`'in "asama" düğümü, `faq.ts`'in "Ürün hangi aşamada?" cevabı ve `/fiyat`'ın `NOT_INCLUDED` listesi artık `product.ts` → `CAPABILITIES`'ten okuyor. `chat.ts` **ilk kez** `site.ts`'i import ediyor (B-014'ün asıl şikâyeti): sürüm adı `PRODUCT_STATUS.version`, pilot cümlesi `PRODUCT_STATUS.sentence`, modül sayımı `moduleProse()`.
- **Altı tekil kalem cümlesi kalem adını sabitten alıyor** (`chat.ts` 1 · `faq.ts` 2 · `karsilastirma.ts` 3). Plan beş cümle sayıyordu; altıncısı ölçümle çıktı — aşağıda.
- **Yeni yayın kapısı: `upcomingCapability(id)` + `stageNote(id)`** (`product.ts`). Kalem adını sabitten almak **adı** hizalar ama **cümleyi** hizalamaz: kalem yayınlandığı gün "bu bizde yok" diyen cümle sessizce yanlış olur. İki fonksiyon kalem `simdi` kademesine geçtiğinde **hata fırlatıyor** — yani modül yüklenmiyor, derleme ve servis duruyor. `stageNote` ayrıca parantez içi/cümle içi kademe ekini (`yolda` · `yol haritasında`) `STAGE_LABEL`'dan türetiyor, böylece kalem `sonra` → `yolda` taşınırsa cümleler kendiliğinden hizalanıyor.
- **Tüketici kapısı ikiden altıya çıktı** (`tests/capabilities.test.ts`): dört yeni ev listeye eklendi ve her tüketici artık kendi **içe aktarım biçimini** de çiviliyor (`src/content` göreli `./product`, sayfa/bileşen `@/content/product`) — tek kalıp aramak dördünü sessizce muaf tutardı.

**Sorunlar:**
- **Altıncı cümle ölçümle çıktı — B-040'ın kanıt komutu harfe duyarlı.** Atomun grep'i `"Online ödeme"` (büyük O) arıyor; `karsilastirma.ts:129`'daki *"kartla **online ödeme** bugünkü sürümde yok"* küçük harfli olduğu için hiç görünmemişti. Yeni tüketici kapısı harfe **duyarsız** karşılaştırıyor ve satırı ilk koşumda yakaladı. Kapsama alındı ve bağlandı; cümlenin metni değişmedi.
- **Tarayıcı ölçümünde sessiz tuzak:** *"Ürün hangi aşamada?"* aynı sayfada **iki** düğme — biri asistan panelinde, biri SSS akordiyonunda. Locator `[role="dialog"]`'a daraltılmazsa tıklama **arkadaki SSS'ye** gidiyor, asistan hiç açılmıyor ve betik hatasız "temiz" diyor. İki koşum bu yüzden boş döndü; kural memory'ye yazıldı.

**Kararlar:**
- **Pilot cümlesi `faq.ts`'in zaten kullandığı desene çekildi.** Eski chat cümlesi *"v1 hazır **ve şu anda** bir stüdyoda…"* diye tek cümleydi; sabit büyük harfle başlıyor (*"Şu anda…"*), yani türetme ya sabiti küçültmeli ya cümleyi bölmeliydi. Küçültme için yeni bir yardımcı açmak yerine **repoda zaten onaylı olan** iki-cümle deseni seçildi (`faq.ts:48`'in kalıbı). Anlam aynı, ton aynı.
- **Chat'in yol haritası iki ayrı paragrafa bölündü.** `yolda` kademesi TASK-2.08/2.09'dan sonra 3 değil **7** kalem taşıyor; tek baloncukta okunmuyordu. `a` alanı zaten paragraf dizisi — bölme biçim kararıdır, içerik değişmedi.
- **`NOT_INCLUDED` kendi bağlam dilini korudu, sabitten yalnız KADEME türedi.** *"Online kart ile tahsilat"* ve *"Turnike, QR ve parmak izi donanımı"* kalemin sabitteki adından **geniştir** (ücretlendirme bağlamı) ve task bunu açıkça istiyordu. Türetilen şey parantez içi ibare; kalem `simdi`'ye geçerse `stageNote` derlemeyi durduruyor — "pakete dâhil değil" listesinde duran bir kalem sessizce yayınlanmış olmasın diye.
- **SSS sorusu adı türetiyor ama yayın kapısı TAŞIMIYOR.** *"Online ödeme alabiliyor muyum?"* satırı `capability()` kullanıyor, `upcomingCapability()` değil: kalem yayınlandığında **soru geçerli kalır**, değişen yalnız cevaptır. Kapı cevabın son cümlesinde duruyor.
- **Çıkış disiplini kapısı `capabilities.test.ts`'e kondu, ayrı dosya açılmadı.** "asama" düğümü bu turda baştan yazıldı ve F1.3'ün kabul kriteri *"ağaçta çıkışsız düğüm yok"*; kardeş kontrol hemen üstünde duruyor.

**Kalan İşler:** yok (bu task'ın kapsamında). Kapsanmayan ve **başka eve taşınan**: (a) B-040'ın *"segment metinlerinde yol-haritası işareti yok"* ayağı — `segments.ts`'te "yolda"/"yol haritası" bugün de **0** (ölçüldü), evi B-029 → TASK-2.12; (b) B-014'ün koruma önerisindeki *"rakip tarama rakamı dört evde iki biçimde"* örneği — Gelen Kutusu'na düştü.

**Dosya Değişiklikleri:**
- `src/content/product.ts` → `capabilityStage` · `upcomingCapability` · `stageNote` eklendi; `capability()` artık `CAPABILITY_STAGES` üzerinde dönüyor (örtük `Object.keys` sırası yerine açık sıra)
- `src/content/chat.ts` → `./site` ve `./product` import edildi; "asama" düğümü (4 paragraf) ve "donanim" düğümünün ikinci paragrafı türetiliyor
- `src/content/faq.ts` → `./product` import edildi; turnike cevabı, online ödeme sorusu + cevabı ve "Ürün hangi aşamada?" türetiliyor
- `src/content/karsilastirma.ts` → `./product` import edildi; `COMPARE` turnike satırı ve `NOT_US`'un iki bloğu türetiliyor
- `src/app/fiyat/page.tsx` → `NOT_INCLUDED`'ın iki kalemi kademesini sabitten okuyor
- `tests/capabilities.test.ts` → tüketici listesi 2 → 6, yayın kapısı bloğu, aşama cevabı eşliği, chat ağacı çıkış disiplini (+33 senaryo)
- `_dev/docs/DECISIONS.md` · `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` → yayın kapısı kararı, tarayıcı locator tuzağı

**Cümlelerin öncesi/sonrası (render edilmiş — ölçüldü):**

| Ev | Önce | Sonra |
|---|---|---|
| `chat.ts` donanım | "QR ve turnike ile giriş kontrolü yol haritasındadır, bugünkü ürünün parçası değildir." | **birebir aynı** |
| `faq.ts` turnike | "**Turnike ve QR** ile giriş kontrolü yol haritasındadır, …" | "**QR ve turnike ile giriş** kontrolü yol haritasındadır, …" (sabitin adı) |
| `faq.ts` online ödeme — soru | "Online ödeme alabiliyor muyum?" | **birebir aynı** |
| `faq.ts` online ödeme — cevap | "… Online ödeme yol haritasındadır." | **birebir aynı** |
| `karsilastirma.ts` COMPARE | "… QR ve turnike ile giriş yol haritamızda, bugünkü ürünün parçası değil." | **birebir aynı** |
| `karsilastirma.ts` NOT_US (turnike) | "… **QR ve turnike** yol haritamızda." | "… **QR ve turnike ile giriş** yol haritamızda." (+2 kelime) |
| `karsilastirma.ts` NOT_US (ödeme) — *altıncı, ölçümle çıktı* | "… kartla online ödeme bugünkü sürümde yok." | **birebir aynı** |
| `/fiyat` `NOT_INCLUDED` ×2 | "Online kart ile tahsilat (yol haritasında)" · "Turnike, QR ve parmak izi donanımı (yol haritasında)" | **ikisi de birebir aynı** |

Liste kopyalarında metin **bilerek** değişti (sabit bugün daha çok kalem taşıyor): chat + SSS'nin "yolda" sayımı **3 → 7**, "yol haritasında" sayımı **3 → 5**, chat'in modül sayımı **8 → 9** ("antrenör performansı" — karşılığı TASK-2.08'de ürün koduna karşı ölçülmüştü). Yani iki yüzey de artık `/ozellikler` ve Kurucu Programı ile **aynı** listeyi gösteriyor.

**Test Sonuçları:**
- `npm test` (web konteyneri): **154 geçti + 1 atlandı** (taban 121+1; **+33 senaryo**). `npx tsc --noEmit` çıkış **0**.
- **Ürettiğim kapı üç sondayla sınandı** (üçünde de **girdi** bozuldu, kaynak değil; iki dosya scratchpad'e yedeklendi, `diff -q` + `md5sum` ile birebir geri yüklendi):
  - **Bozuk girdi — tüketici kapısı:** `karsilastirma.ts`'in `NOT_US` bloğuna kalem adı elle geri yazıldı → **1 kırmızı**, doğru testte (`'src/content/karsilastirma.ts' sabiti atlayan kalem taşımıyor`). Aynı dosyanın *"okunuyor ve sabite bağlı"* ayağı bu sondada **yeşil kaldı** — dosya öteki iki cümlede hâlâ sabiti çağırıyor; bağlantı kontrolü tek başına yetmiyor, tarama ayağının gerekçesi budur.
  - **Bozuk girdi — yayın kapısı:** `qr-turnike` `sonra` → `simdi` taşındı (kalem yayınlanmış gibi). Kapı **modül yüklenirken** ateşledi: `tests/capabilities.test.ts` suite olarak düştü (*Error: "qr-turnike" artık "Bugün var" kademesinde — onu yol haritası kalemi gibi anan cümleler elden geçirilmeli*, `product.ts:436` ← `chat.ts:91`), ve **servis yüzeyi de düştü**: dev sunucusunda `/`, `/fiyat`, `/yazilim-secerken` üçü de **500**. Fail-closed ve gürültülü.
  - **Boş kapsam:** `yolda` kademesi boşaltıldı → **8 kırmızı**. Yakalayan iki bekçi: `yolda kademesi boş değil` ve `yasaklı etiket listesi dolu` (etiket sayısı 12 → 5, eşik 5). ⚠️ Bu sondada **yeşil kalan** ayaklar: `yolda kademesinin etiketleri virgül taşımıyor` (boş dizide döngü hiç dönmüyor — TASK-2.10'da da ölçülmüştü) ve bu turun `… iki kademeyi de sabitten sayıyor` ×2 ayağı (`toContain("")` boş dizgede daima geçer). İkisi de **silinmedi**: fail-open'ı yukarıdaki iki bekçi kapatıyor ve bu ayaklar dolu kapsamda gerçek işi ölçüyor.
  - Sonda sonrası ağaç `md5sum` ile birebir geri yüklendi, batarya yeniden **154 + 1**, `tsc` 0, üç rota 200.
- **B-040'ın kanıt komutu yeniden koşuldu** (atomdaki hâliyle): **10 → 3 satır**, **4 → 1 dosya**. Kalan 3'ün **üçü de `product.ts`'in kendisi** (2 etiket + 1 yorum — meşru tek kaynak); hedeflenen **7 satır 0'a düştü** (`faq.ts` 3 → 0 · `chat.ts` 2 → 0 · `karsilastirma.ts` 2 → 0). **Harfe duyarsız** süpürme (`product.ts` hariç) de yalnız **1** satır buluyor ve o bir yol haritası kalemi değil: `KiwiBand.tsx:59` — Kiwi AI Lab'ı anlatan *"yapay zekâ ve yazılım"*.
- Üretim imajı builder katmanında hatasız derlendi, 3100 yeni imaja alındı; dört rota 200.
- **Render teyidi 3100'de, gerçek servis çıktısından:** `/fiyat`'ın iki `NOT_INCLUDED` kalemi **birebir eski metin**; `/`'ın SSS'sinde aşama cevabı 7+5 kalem sayıyor; `/yazilim-secerken`'in üç cümlesi yerinde. Eski ifadeler üç sayfada **0**: "Turnike ve QR ile giriş kontrolü" · "Kampanya derinleşmesi" · "churn paneli" · "QR ve turnike girişi" · "yapay zekâ destekli analiz" · "v1 hazır ve şu anda" · "QR ve turnike yol haritamızda".
- **Asistan tarayıcıda açıldı** (araştırma konteyneri, 1440×900 ve 390×844): *"Ürün hangi aşamada?"* dört paragrafı da doğru türetiyor (sürüm + pilot + **9 modül** / 7 kalem "yolda" / 5 kalem "yol haritasında" / pilot-rakamı yok), *"Turnike almam gerekiyor mu?"* ikinci paragrafı birebir aynı. Çıkışlar yerinde (devam soruları + "Yol haritası" / "Ne var, ne yolda" bağlantısı). **İki yüzeyde de konsol temiz.**
- `a11y.mjs` 8 rota **TOPLAM SORUN: 0**. `font-guard.mjs` 16 sayfa / **81.129 karakter** (taban 81.119), kümede olmayan karakter **yok**. `mobile-audit.mjs` **9/9 rotada yatay kaydırma yok**, dokunma hedefi **157** (taban birebir); `/demo`'nun 3 taşan elemanı bal küpü (taban). `scan.mjs` 390×844 **konsol temiz**: `/` 20 kare · `/fiyat` 10 kare · `/yazilim-secerken` 12 kare.
- ⚠️ `perf.mjs` **koşulmadı**: yeni varlık ya da istek yok, değişen yalnız metin uzunluğu. Ölçülen sayfa ağırlıkları (3100): `/` 346.178 B · `/fiyat` 119.921 B · `/yazilim-secerken` 114.350 B · `/ozellikler` 175.014 B (bu turda dokunulmadı, TASK-2.10 ölçümüyle birebir).

---

## Sonuç Özeti

**Yol haritasının son dört evi de sabite bağlandı ve B-040 kapandı.** Chat ağacı, SSS, karşılaştırma sayfası ve fiyat sayfası artık `product.ts` → `CAPABILITIES`'ten okuyor; atomun kanıt komutu **10 → 3 satır** dönüyor ve kalan üçü sabitin kendisi. Aynı hamlede **B-014 de kapandı**: `chat.ts` ilk kez `site.ts`'i import ediyor, pilot cümlesi ve modül sayımı elle yazılmıyor — sitede pilot cümlesinin sabit dışında tek bir kopyası kalmadı (ölçüldü: 0).

**Kazanç yalnız tekillik değil, tutarlılık:** chat ve SSS dün 3+3 kalem sayarken `/ozellikler` 7+5 sayıyordu. Bugün dört yüzey de aynı listeyi gösteriyor — yani B-029'un dört karşılıksız iddiası **asistanın ve SSS'nin cevabında da** "yolda" olarak görünüyor.

**Yeni koruma ters yönü kapatıyor.** Bugüne kadarki kapılar *"kalem elle yazılmasın"* diyordu; `upcomingCapability`/`stageNote` bunun eşini kuruyor: adı sabitten alan bir cümle, kalem **yayınlandığı** gün hâlâ "bu bizde yok" diyor olabilir. Artık o gün derleme duruyor ve cümle elden geçiriliyor — sondada ölçüldü, servis yüzeyi 500'e düştü.

**Ölçüm bir kör nokta daha gösterdi:** B-040'ın kanıt komutu harfe duyarlı olduğu için altıncı bir cümleyi hiç görmemişti (`karsilastirma.ts`'in küçük harfli *"online ödeme"*'si). Yeni kapı harfe duyarsız tarıyor.

---

**Oluşturulma:** 2026-09-22
