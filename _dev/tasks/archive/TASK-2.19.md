# TASK-2.19: Yasal beyan testi — "12 ay" dalı komşu depodan okunur (B-060)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M6 — Kalite Kapıları
**Feature:** F1.1 (yasal içerik) · M3 F3.2 (saklama süresi depo tarafında)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.18 (test dosyası kurulu olmalı — bu task ona sekizinci dalı ekler)

---

## Hedef

Yayındaki **"12 ay" saklama** beyanını, mekanizmanın gerçekten yaşadığı yere — komşu depodaki `RETENTION_MONTHS` sabitine — bağlamak. `web` konteyneri bugün o yolu **görmüyor** (ölçüldü: `/app/../Alpfitplus-website.v1` yok).

Task, salt-okunur bağlama ve env kapısı kurulduğunda, dal anahtar tanımlıyken koştuğunda ve **anahtar tanımsızken atlandığında** (testin geri kalanı etkilenmeden) tamamlanmış sayılır.

---

## Bağlam

**Ölçülmüş kısıt** (research 2026-09-22): "12 ay"ın mekanizması `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` → `RETENTION_MONTHS = 12`; temizlik işi `retention.pb.js:30` günlük koşuyor. v1'in kendi testi bu dosyayı göreli yolla okuyabiliyordu çünkü orada **aynı depodaydı**; v2'de değil.

**Seçilen (b): salt-okunur bağlama + env kapısı.** `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:ro` bağlanır; test dalı bir env anahtarıyla açılır, anahtar tanımsızsa **atlanır**. Bu, depo sözleşme paketinin (`tests/lead-store.contract.test.ts`, TASK-1.13) zaten kurduğu desendir.

**Reddedilenler:** (a) sabiti v2'ye kopyalamak — bulgunun şikâyet ettiği tekrarın ta kendisi; (c) yerel depo konteynerinin API'sinden okumak — `npm test`'i ayakta bir servise bağlar.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-060-yasal-beyani-koruyan-kapi-yok.md` — "12 ay" satırı ve v1 şablonu
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #4
- `tests/lead-store.contract.test.ts` — **env kapısı deseninin örneği**; dosyanın başlık yorumu tam koşum komutunu taşıyor
- `docker-compose.yml` → `web` servisi bağlamaları · `.env.example`
- `../Alpfitplus-website.v1/pocketbase/pb_hooks/lead_lib.js:37` ve `retention.pb.js:30` (salt okunur)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-060-*.md` — **atom bu task'ta kapanır** (sekiz olgunun sekizi bağlandı)
- `README.md` (repo kökü) — dalın nasıl koşturulacağı, bağlama gerekliliği (sözleşme paketinin yanına)

---

## Alt Görevler

- [x] **1. Salt-okunur bağlama**
  - `docker-compose.yml` → `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:<hedef>:ro`
  - Komşu depo **dokunulmazdır**; bağlama `:ro` olmadan yazılmaz
  - Bağlama yoksa konteyner yine kalkmalı (compose bağlamayı zorunlu kılıyorsa yol ele alınır — kaynak dizin bu makinede var)

- [x] **2. Env kapısı ve dal**
  - `.env.example`'a **slot adı** eklenir (değer yazılmaz) — `CLAUDE.md` → Dokunulmazlar
  - Test dalı: anahtar tanımsızsa `skip`; tanımlıysa `lead_lib.js` **metin olarak** okunur, `RETENTION_MONTHS` bulunur ve `legal.ts`'in "12 ay" beyanıyla eşleşir
  - Sabit bulunamazsa test **kırılır** (sessiz geçme yok) — TASK-2.18'in kuralıyla aynı

- [x] **3. İki hâli de sına**
  - Anahtar tanımlı: dal koşuyor ve yeşil
  - Anahtar tanımsız: dal atlanıyor, `npm test`'in geri kalanı **etkilenmiyor** (sözleşme paketinin bugünkü davranışıyla aynı)

---

## Etkilenen Dosyalar

```
docker-compose.yml                 # web servisine :ro bağlama — zaten var
.env.example                       # yeni slot adı (değer yok) — zaten var
tests/
└── legal-consistency.test.ts      # sekizinci dal — zaten var (TASK-2.18'de doğdu)
README.md                          # koşum notu — zaten var
```

---

## Dikkat Noktaları

- **Komşu depo salt okunurdur** (`CLAUDE.md` → Dokunulmazlar). Bağlama `:ro`, test yalnız okur.
- **Anahtar tanımsızken `npm test` etkilenmemeli** — bu, sözleşme paketinin kurduğu sözleşmedir ve CI'ya girdiğinde (M6 F6.3) komşu depo orada olmayacağı için **şarttır**.
- **`import` değil, metin okuma.** v2 `lead_lib.js`'i import edemez (farklı çalışma zamanı — PocketBase hook'u); v1 de metin okuyarak çözmüş.
- **Bağlama eklemek `web` konteynerini yeniden kurmayı gerektirir** — yeni rota eklemenin `restart` gerektirmesiyle aynı sınıf tuzak; `up -d` ile gelir, `restart` ile gelmez.
- **`.env`'e değer yazma kararı kullanıcınındır** — task yalnız slot adını ve koşum komutunu belgeler.
- Dal adı ve anahtar adı sözleşme paketinin adlandırmasıyla **tutarlı** olsun (`LEAD_CONTRACT_URL` deseni) — iki kapı iki farklı sözlük kurmasın.

---

## Test Kriterleri

- [x] `docker compose up -d web` sonrası `pb_hooks` dizini konteyner içinden **okunabiliyor** ve salt okunur (yazma denemesi reddediliyor)
- [x] Anahtar tanımlıyken: dal koşuyor, `RETENTION_MONTHS = 12` ile `legal.ts`'in beyanı eşleşiyor, test yeşil
- [x] **Negatif kontrol:** sabit geçici olarak farklı bir değere çekildiğinde (kopya üzerinde) dal **kırmızı** dönüyor; sabit hiç bulunamadığında da kırılıyor (sessiz geçme yok)
- [x] Anahtar tanımsızken: dal atlanıyor ve `docker compose exec web npm test` geri kalanı yeşil (PASS/skip sayıları dokümana)
- [x] `.env.example` yalnız slot adını taşıyor, değer yok
- [x] `README.md` dalın nasıl koşturulacağını yazıyor (sözleşme paketinin yanında, aynı desende)
- [x] `npm run build` hatasız

---

## Risk ve Geri Dönüş Planı

- **Bağlama yolu başka makinede yoksa** compose kalkmayabilir → yol opsiyonel hâle getirilir ya da profile alınır; çözüm task oturumunda ölçülerek seçilir.
- **Rollback:** compose satırı ve test dalı geri alınır; TASK-2.18'in yedi dalı etkilenmez.

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
- **Salt-okunur bağlama.** `docker-compose.yml` → `web` servisine `../Alpfitplus-website.v1/pocketbase/pb_hooks:/opt/v1-pb-hooks:ro`. Kaynak, `lead-store` servisinin (TASK-1.17) zaten bağladığı klasörün aynısı — ikinci bir sözlük açılmadı. Bağlama `docker compose up -d web` ile geldi (`restart` getirmez, task dokümanı böyle diyordu, doğrulandı); `/proc/mounts` satırı `ro,relatime`.
- **Env kapısı.** `LEGAL_CONTRACT_HOOKS_DIR` — `.env.example`'a §6 olarak yalnız **slot adı** eklendi, değer yazılmadı. Adlandırma sözleşme paketinin desenini izliyor (`LEAD_CONTRACT_URL` → `<konu>_CONTRACT_<ne>`).
- **Dal 9 yazıldı** (`tests/legal-consistency.test.ts`): anahtar tanımsızsa `describe.skip`, tanımlıysa yedi test. Dosyanın baş yorumundaki kapsam cümlesi de güncellendi (artık "sekiz dal depo içi, dokuzuncusu çapraz depo").
- **README → yeni "Testler" bölümü:** iki env kapılı paket tek tabloda, dal 9'un tam koşum komutu ve `:ro` gerekçesi.
- **On dört negatif kontrol** koşturuldu (aşağıda), **on dördü de kırmızı** verdi.

**Sorunlar:**
- *Bağlama hedefi nereye?* `/app` deponun kendi bind-mount'u; içine açılan bir mount noktası host tarafında repoya **root sahipli boş dizin** bırakıyor. Ölçüldü (`/app/ic-baglama` repoda kaldı, `/opt/dis-baglama` hiçbir iz bırakmadı) → hedef `/opt/v1-pb-hooks`, yani `/app` dışında. Aynı sınıf tuzak `memory/arastirma-konteynerinde-tarayici-olcumu.md`'de `/work` için yazılıydı; atom `web` konteynerini de kapsayacak şekilde genişletildi.
- *Komşu depo yoksa konteyner kalkar mı?* Ölçüldü: compose eksik bind **kaynağını** root sahipli boş dizin olarak yaratır ve konteyner **yine kalkar**. Yani task kriteri karşılanıyor; boş bağlamada dal sessizce geçmiyor, "dayanak dosyası yok" diyerek kırılıyor (negatif kontrol 10-11).
- *Salt okunurluk nasıl ölçülür?* Yazma **denenmedi** — komşu depo canlı sitedir ve deneme başarılı olduğu anda yasağı çiğnerdi. `fs.accessSync(dir, W_OK)` `:ro` bağlamada `EROFS` fırlatıyor, `rw` bağlamada geçiyor (ölçüldü, uid 0) → kapı bunu kullanıyor, kontrol grubu depo kökü.
- *Negatif kontrol neyi bozacak?* Kaynağı bozmak yasak. `pb_hooks` scratchpad'e kopyalandı, mutasyonlar **kopyaya** uygulandı, test kopyaya `:ro` bağlanarak ayrı bir `docker run` konteynerinde koşturuldu. Tur sonunda kaynağın md5'i tur başıyla birebir aynı.

**Kararlar:**
- **Anahtar adı `LEGAL_CONTRACT_HOOKS_DIR`** (URL değil **dizin**): bağlama noktası bir klasör ve dal iki dosya okuyor (`lead_lib.js` + `retention.pb.js`). Tek dosya yolu verseydi ikinci dosya için ikinci bir anahtar ya da yol türetme gerekirdi.
- **Eksik/boş bağlama dosyanın TAMAMINI düşürür** (toplama hatası), yalnız dal 9'u değil. Bilinçli: anahtarı tanımlamak bilinçli bir eylemdir, yanlış yapılandırılmış kapının sessiz kalmasındansa yüksek sesle düşmesi yeğlendi — sözleşme paketi de (`assertLocalHost`) aynı davranışı taşıyor. Test yorumunda yazılı.
- **Beyan parçası ölçülen sayıdan TÜRETİLİYOR**, elle yazılmıyor (`oluşturulmasından ${ay} ay sonra…`). Yön olgu → metin; ters yön kapıyı kendi düzelttiği değere bağlayıp dairesel yapardı.
- **Bölüm geneli ay kontrolü eklendi** (Saklama süresi bölümündeki *her* `N ay` ölçülenle aynı olmalı). Gerekçe ölçümle geldi: negatif kontrol 14'te üç paragraftan yalnız biri güncellendiğinde **tek cümleye bakan kapı yeşil kaldı**, bu kontrol kırmızı verdi.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü olmayan bir sözleşme doğmadı; anahtar adı ve bağlama noktası compose/`.env.example`/test yorumunda kendi evinde yazılı.

**Kalan İşler:** yok.

**Son Yaklaşım:** Tamamlandı — kalan iş yok.

**Sonraki Adım Detayı:** Yok; sıradaki task TASK-2.20 (MX kayıtları, B-011).

**Dosya Değişiklikleri:**
- `docker-compose.yml` → `web` servisine `pb_hooks` `:ro` bağlaması + gerekçe yorumu (hedefin neden `/app` dışında olduğu, eksik kaynak davranışı, `:ro` zorunluluğu — üçü de ölçülmüş)
- `.env.example` → §6 `LEGAL_CONTRACT_HOOKS_DIR` slot adı (değer yok)
- `tests/legal-consistency.test.ts` → dal 9 (7 test) + `accessSync/constants` importu + baş yorumun kapsam cümlesi
- `README.md` → yeni "Testler" bölümü (iki env kapılı paketin tablosu + dal 9'un koşum komutu)
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` → bind-mount tuzağının `web`/`/app` ve **kaynak tarafı** genişlemesi; `_dev/MEMORY.md` kancası genelleştirildi (yeni satır açılmadı)
- `_dev/memory/urun-iddiasi-capa-dogrulamasi.md` → 8. kural: dokunulmaz komşu depoya karşı kapı yazarken negatif kontrol **kopya** üzerinde koşar

**Test Sonuçları:**
- **Batarya, iki hâlde de ölçüldü.** Anahtar **tanımsız**: `npm test` **204 geçti + 2 atlandı** (taban 204 geçti + 1 atlandı; yeni atlanan dal 9'dur — *geçen* sayısı birebir aynı, yani bataryanın geri kalanı etkilenmedi). Anahtar **tanımlı**: **211 geçti + 1 atlandı**, `legal-consistency` dosyası 24 → **31 test**.
- **On dört negatif kontrolün on dördü kırmızı** (hepsi yerelde, oturum içinde). Düzeneğin **kendi pozitif çapası** önce koşturuldu: bozulmamış kopyayla çıkış 0 / 31 geçti — yani kırmızılar düzeneğin arızası değil. Düzenek ANSI temizliyor ve vitest özet satırını bulamazsa *arıza* veriyor (TASK-2.18'in fail-open dersi); her mutasyon ayrıca `cmp` ile "gerçekten uygulandı mı" diye doğrulanıyor.

  | # | Bozulan | Sonuç |
  |---|---|---|
  | 1 | `RETENTION_MONTHS` 12 → 6 | 2 kırmızı (türetilen parça + bölüm geneli) |
  | 2 | Sabitin adı değişti | 3 kırmızı |
  | 3 | Sabit yorum satırına alındı | 3 kırmızı (`^const` çapası yorumu saymıyor) |
  | 4 | Sabit ölü (`getUTCMonth() - 12`) | 1 kırmızı |
  | 5 | `module.exports`'tan düştü | 1 kırmızı |
  | 6 | Cron haftalığa çekildi (`* * 1`) | 1 kırmızı |
  | 7 | Cron işinin adı değişti | 1 kırmızı |
  | 8 | `retentionCutoff()` bağı koptu | 1 kırmızı |
  | 9 | `COLLECTIONS` yalnız `['leads']` | 1 kırmızı |
  | 10 | Bağlama **boş dizin** (anahtar tanımlı) | dosya düştü — atlanmadı |
  | 11 | `lead_lib.js` yok | dosya düştü — atlanmadı |
  | 12 | Bağlama **yazılabilir** (`rw`) | 1 kırmızı (salt-okunur kapısı) |
  | 13 | Metindeki süre 12 → 24 | 2 kırmızı |
  | 14 | Üç paragraftan **yalnız biri** güncellendi | 1 kırmızı — **yalnız** bölüm geneli kontrolü yakaladı |

- **Kapının kendi sondaları** (dosyanın içinde, her koşumda): desen sabit değil kaynaktan okuyor (`"… = 7;"` → `"7"`, boş değer ve yorum satırı eşleşmiyor) · "günlük mü" yargıcı haftalık/aylık/eksik-alanlı ifadeyi reddediyor · salt-okunur sondasının kontrol grubu depo kökü (yazılabilir olmalı).
- `docker compose exec web npx tsc --noEmit` çıkış **0**. Üretim derlemesi `docker compose build web-prod` çıkış **0**.
- **Kaynak dosyalarda kalıcı değişiklik yok:** `src/` ve `research/` altında tek satır değişmedi. 13-14 numaralı kontroller `src/content/legal.ts`'i geçici olarak bozdu; ikisi de scratchpad yedeğinden `cp` ile geri alındı ve **md5 ile doğrulandı** (`3abace90…`, `git diff` boş). `git checkout`/`git restore` kullanılmadı.
- **Komşu depo dokunulmadı:** `pb_hooks/lead_lib.js` ve `retention.pb.js` md5'leri tur başıyla birebir aynı (`0b48e280…`, `74359f52…`); o depodaki kirli dosyaların hiçbiri `pocketbase/` altında değil.
- **Beş ölçüm** (render edilen yüzey bu turda hiç değişmediği için rakamlar TASK-2.18'in tabanını bağımsız olarak doğruluyor): `a11y` 8 rota **TOPLAM SORUN 0** · `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir) · `font-guard` 16 sayfa / **85.015** karakter (taban birebir), eksik karakter yok · `scan` 390×844 `/kvkk` **9 kare / 7.373 px, konsol temiz** (taban birebir) · `perf` (3100) CLS ≤ 0,001, LCP 28-60 ms. **3100 bayatlık sondası:** üretim konteyneri saklama bölümünün üç cümlesini de döndürüyor (2/2/2 vuruş — render edilmiş DOM + RSC yükü), yani ölçülen yüzey güncel.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-23

**Ne Yapıldı:**
- Yayındaki *"12 ay saklıyoruz"* cümlesi, mekanizmanın gerçekten yaşadığı yere — komşu depodaki `RETENTION_MONTHS` sabitine — bağlandı. Sabit v2'ye **kopyalanmadı**: `web` servisi komşu deponun `pb_hooks` klasörünü **salt okunur** bağlıyor, dal metni oradan okuyor ve beyan parçasını **ölçülen sayıdan türetiyor**.
- Dal bir env anahtarının (`LEGAL_CONTRACT_HOOKS_DIR`) arkasında: tanımsızken atlanıyor ve bataryanın geri kalanı etkilenmiyor (204 geçen birebir korundu), tanımlıyken yedi test koşuyor (batarya 211).
- **B-060 kapandı** — atomun tablosundaki üç taahhüdün üçü de artık çivili; sekiz depo içi olgu TASK-2.18'de, dokuzuncu (çapraz depo) burada.

**Öğrenilenler:**
- **Bağlama hedefi `/app`'in dışında olmalı** — `/app` deponun kendi bind-mount'u, içine açılan mount noktası repoda root sahipli boş dizin bırakıyor (ölçüldü; `/work` tuzağının aynı sınıfı, memory atomu genişletildi).
- **Compose eksik bind kaynağını sessizce yaratır** ve konteyner yine kalkar — bu yüzden bağlamadan okuyan kapı fail-closed kurulur: boş dizin "dosya yok"tur, "sorun yok" değil.
- **Dokunulmaz bir depoya karşı kapı yazarken negatif kontrol kopya üzerinde koşar**, ve salt okunurluk **yazma denenmeden** ölçülür (`access(W_OK)` → `EROFS`).
- **Tek cümleye bakan kapı bölüm içi tutarsızlığı göremez:** üç paragraftan yalnız biri güncellendiğinde fragman kontrolü yeşil kaldı, bölüm geneli kontrolü kırmızı verdi. Kapının kapsamı beyanın kapsamı kadar geniş olmalı.

---

**Oluşturulma:** 2026-09-22
