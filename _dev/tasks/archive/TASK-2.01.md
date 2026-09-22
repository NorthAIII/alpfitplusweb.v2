# TASK-2.01: Sunucudaki iki gerçeği ölç — nginx erişim kaydı ve `.env` parmak izi (B-024, B-058)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · çıktısı M1 yasal metnini de besler
**Feature:** F7.1 (B-058 döndürme kararı) · M1 F1.1 (B-024 ölçüm beyanı)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok — fazın ilk task'ı

---

## Hedef

Fazın iki metin/karar ayağının dayandığı **iki olguyu sunucudan salt-okunur ölçmek**: (1) ölçüm sunucusunun önündeki nginx erişim kaydı bugün ham IP tutuyor mu, rotasyon var mı; (2) bu makinedeki `.env`'in iki token'ı sunucudaki gerçek değerlerle **aynı mı**.

Task, iki ölçümün sonucu rakam/parmak-izi düzeyinde bu dokümana yazıldığında ve ikisinin kararları (yasal metnin ölçüm cümlesi nasıl yazılacak · anahtar döndürülecek mi) net hâle geldiğinde tamamlanmış sayılır. **Hiçbir sır değeri hiçbir yere yazılmaz** — yalnız SHA-256 önekleri karşılaştırılır.

---

## Bağlam

Fazın iki kalemi bilerek bu ölçüme bağlandı (research 2026-09-22, kullanıcı kararı — `phases/PHASE-2.md` → Teknik Kararlar):

- **B-024 / ölçüm beyanı.** `legal.ts:199` *"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"* ve `:116` *"bu ölçüme kişisel verileriniz aktarılmaz"* diyor. Ölçüm betiği kendi sunucumuzdan (`umami.kiwiailab.com`) yüklendiği için her ziyaretçinin ham IP'si önündeki nginx'in erişim kaydına düşüyor — v1 tarafında **2026-07-28**'de ölçüldü: `/dev/stdout` → Docker `json-file`, `/etc/docker/daemon.json` yok, yani rotasyon yok ve log sınırsız büyüyor (o gün 188 MB). **Bugünkü hâli ölçülmedi.** Metin uydurma süre vaadi veremez; ne yazılacağı bu ölçümden çıkar.
- **B-058 / döndürme kapsamı.** `.env`'in beş değeri bu makinede parmak izlendi: `LEAD_STORE_URL` yerel konteyneri gösteriyor, `LEAD_STORE_TOKEN` ile `LEAD_TOKEN_PREVIEW` bayt bayt aynı, `LEAD_TOKEN_PRODUCTION` ayrı bir 64-hex. Arşiv kayıtları ikisinin de bu makinede üretildiğini (TASK-1.17) ve canlı IP tuzunun Vercel'e boru içinden girilip hiçbir yere kaydedilmediğini (TASK-1.18) yazıyor — yani **imaja giren hiçbir değerin canlı olmadığı** sonucuna varıldı. Kesin teyit sunucudaki `/opt/alpfit-lead/.env` ile parmak izi karşılaştırmasıdır. Milestone'un "iki anahtar döndürülmüş" ayağı bu sonuca bağlıdır: **eşleşme yoksa döndürme düşer** ve ayak o gün yeniden yazılır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — sunucuya erişim yolu, salt-okunur kuralları, Umami kurulumu
- `../altyapi/vps/CLAUDE.md` — sunucu deposunun kendi kuralları (salt okunur)
- `_dev/bulgular/archive/B-058-env-uretim-imajina-gomulu.md` — beş değerin bu makinedeki hâli
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` → "🔴 gerekçesi" bloğu — v1'in 2026-07-28 ölçümü
- `_dev/tasks/archive/TASK-1.17.md:146` ve `_dev/tasks/archive/TASK-1.18.md:150,184` — token ve tuz üretiminin kaydı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/docs/DECISIONS.md` — iki ölçümün kararı (ölçüm beyanı nasıl yazılacak · döndürme yapılacak mı)
- `_dev/BULGULAR.md` → Gelen Kutusu — nginx düzeltmesi gerekiyorsa altyapı tarafına tek satır (bu repo değil)

---

## Alt Görevler

- [x] **1. Ölçüm sunucusunun erişim kaydını ölç (salt okuma)**
  - `umami.kiwiailab.com`'un önündeki nginx'in erişim kaydı bugün nereye yazıyor, ham IP taşıyor mu, dosya/journal boyutu ne, rotasyon (`/etc/docker/daemon.json`, `logrotate`) kurulmuş mu
  - Ölçüm **yalnız okur** — hiçbir dosya, servis ya da konfigürasyon değiştirilmez
  - Sonuç üç soruyu cevaplamalı: ham IP tutuluyor mu · ne kadar süre tutuluyor (rotasyon varsa penceresi) · ziyaretçi verisi başka bir tarafa gidiyor mu

- [x] **2. `/opt/alpfit-lead/.env` ile parmak izi karşılaştırması**
  - Sunucuda `LEAD_TOKEN_PREVIEW` ve `LEAD_TOKEN_PRODUCTION` değerlerinin **SHA-256 öneki** alınır (tek satır, değer hiçbir zaman basılmaz)
  - Bu makinedeki `.env`'in aynı iki anahtarının önekiyle karşılaştırılır
  - Sonuç: **eşleşiyorsa** yereldeki değer canlıdır → döndürme gerekir (TASK-2.03 koşar); **eşleşmiyorsa** yereldeki değer canlı değildir → döndürme düşer, TASK-2.03 ❌ İptal edilir ve milestone'un o ayağı yeniden yazılır
  - `IP_HASH_SALT` ayrıca ölçülmez: TASK-1.18 canlı tuzun hiçbir yere kaydedilmediğini yazıyor; karşılaştırma yapılacak bir kaynak yok. Döndürme kararı iki token üzerinden verilir

- [x] **3. Sonuçları kayda geçir**
  - İki ölçümün çıktısı bu dokümanın Oturum Kaydı'na **rakamıyla** yazılır
  - İki karar `docs/DECISIONS.md`'ye girer
  - nginx tarafında düzeltme (rotasyon / IP maskeleme) gerekiyorsa: **bu fazın işi değil** (kapsam dışı, `phases/PHASE-2.md`), `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.01]` işaretli tek satır düşer

---

## Etkilenen Dosyalar

```
_dev/
├── tasks/TASK-2.01.md        # ölçüm sonuçları — YENİ (bu doküman)
├── docs/DECISIONS.md         # iki karar — zaten var
└── BULGULAR.md               # gerekirse Gelen Kutusu satırı — zaten var
```

Kaynak kodda değişiklik yok — bu bir **keşif ayağıdır**.

---

## Dikkat Noktaları

- **Sır değeri hiçbir yere yazılmaz.** Ne task dokümanına, ne commit'e, ne komut geçmişine. Yalnız hash öneki karşılaştırılır (`sha256 | cut -c1-12` deseni). Bu kural `CLAUDE.md` → Dokunulmazlar ve Çalışma Prensibi #12'nin secret maddesidir.
- **Sunucuya yazma yok.** Ölçümün tamamı salt okumadır; `memory/kendi-sunucu-n8n-bunker-umami.md`'deki okuma-modu tuzağı (SQLite `immutable=1` vs `mode=ro`) bu task'ta da geçerli — yanlış mod sunucuya yazar.
- **Ölçüm bir "sonuç" değil "girdi" üretir.** Bu task hiçbir şeyi düzeltmez; iki sonraki task'ın (TASK-2.03 ve TASK-2.17) içeriğini belirler. Düzeltmeye girişme.
- **Eşleşme çıkarsa kapsam büyür:** yereldeki `LEAD_TOKEN_PRODUCTION` canlı token'sa v1'in canlı lead akışı da ilgilenir — o hâlde TASK-2.03 yazılırken v1 tarafının etkisi ayrıca konuşulur (kullanıcıya getirilir).
- **v1'in 2026-07-28 ölçümü bir taban, bugünün cevabı değil** — aradan iki ay geçti, `daemon.json` eklenmiş olabilir. Eski ölçümü kopyalama, yeniden ölç.

---

## Test Kriterleri

- [x] nginx erişim kaydının bugünkü hâli üç soruya da cevap verecek şekilde ölçüldü (ham IP · saklama penceresi · üçüncü taraf) ve çıktı bu dokümanda **rakamıyla** duruyor
- [x] İki token'ın sunucu↔yerel parmak izi karşılaştırması yapıldı; sonuç (eşleşti / eşleşmedi) yazılı ve **hiçbir değer görünmüyor**
- [x] Sunucuda hiçbir dosya değişmedi — ölçüm komutlarının tamamı salt okuma (komutlar dokümanda listeli, doğrulanabilir)
- [x] İki karar `docs/DECISIONS.md`'ye yazıldı; TASK-2.03'ün koşacağı ya da iptal edileceği net
- [x] Repo ağacında sır sızıntısı yok: `git diff` çıktısında hiçbir 64-hex değer, token ya da tuz görünmüyor

---

## Karar Noktaları

- **Döndürme kapsamı:** parmak izi eşleşirse `LEAD_TOKEN_PRODUCTION` de kapsama girer mi (v1'in canlı akışını etkiler) → **kullanıcıya sorulacak**, ölçüm sonucuyla birlikte.
  - **✅ Düştü (2026-09-22):** parmak izi **eşleşmedi**, yani yereldeki hiçbir değer canlı değil — döndürme gündeme hiç gelmiyor ve v1'in canlı akışı bu işten etkilenmiyor. Sorulacak bir kapsam kalmadı. Geriye kalan kullanıcı kalemi ayrı: TASK-2.03'ün iptali ve milestone'un *"iki anahtar döndürülmüş"* ayağının yeniden yazılması (plan revizyonu).

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-22

**Durum:** ✅ Tamamlandı

**Yapılanlar:**

- **Alt görev 1 ✅ — ölçüm sunucusunun erişim kaydı (salt okuma, `ssh root@178.104.140.36`).** Üç sorunun da cevabı ölçüldü:
  - **Ham IP tutuluyor mu → EVET.** `umami.kiwiailab.com`'un önündeki `bunker-nginx` (`nginx:alpine`) bağlı tuttuğu `/opt/bunker/nginx/nginx.conf` içinde **0** adet `access_log`/`log_format` direktifi var, yani nginx'in **gömülü `combined` biçimi** işliyor; `/var/log/nginx/access.log` → `/dev/stdout` sembolik bağı (konteynerde doğrulandı) çıktıyı Docker `json-file` sürücüsüne veriyor. Ölçüm: **592.375** stdout satırının **592.183**'ü ham IPv4 ile başlıyor, **5.580 benzersiz IP**, **490.980** satır ayrıca user-agent taşıyor (IPv6 ile başlayan 0). Umami sunucu bloğunun (`nginx.conf:262-293`) kendi `access_log`'u yok — http düzeyindeki varsayılanı miras alıyor.
  - **Ne kadar süre tutuluyor → BUGÜN SINIR YOK.** Dosya **155 MB** (162.121.877 bayt), **603.025 satır**, penceresi **2026-08-22T22:29:38Z → 2026-09-22T21:53:39Z** (31 gün) ve büyümeye devam ediyor. Bu pencerenin başlangıcı bir rotasyon değil, `../altyapi/vps/CLAUDE.md`'de kayıtlı **2026-08-23 elle disk temizliğidir**.
  - **Ziyaretçi verisi başka bir tarafa gidiyor mu → HAYIR.** Log gönderici ajan yok (konteyner 0, host süreci 0 — promtail/vector/filebeat/fluentd/datadog tarandı), hiçbir konteyner `/var/lib/docker/containers`'ı mount etmiyor, Umami konteynerinde `NEXT_TELEMETRY_DISABLED=1`. Umami'nin kendi şemasında **IP sütunu yok** (`information_schema` taraması; tek iki eşleşme `board.description`/`report.description`, yani "descr**ip**tion" yanlış pozitifi), `session` tablosu yalnız türetilmiş `country, region, city` tutuyor. nginx umami bloğu `X-Real-IP $remote_addr` ve `X-Forwarded-For` başlıklarını **iletiyor** — ama aynı sunucuda kalıyor ve kalıcılaşmıyor.

- **Alt görev 1'in ana bulgusu — v1'in 2026-07-28 ölçümü artık yanlış gerekçeyle doğru.** O ölçüm "`/etc/docker/daemon.json` yok, yani rotasyon yok" diyordu. **Bugün `daemon.json` VAR** (mtime 2026-08-28 20:57:47) ve `json-file` + `max-size 50m` + `max-file 3` yazıyor — **ama `bunker-nginx`'e uygulanmıyor**, çünkü konteyner **2026-04-15T04:58:49**'da, yani daemon.json'dan **önce** oluşturulmuş ve `HostConfig.LogConfig.Config` değeri boş (`{}`). Sonuç değişmedi (rotasyon yok), sebebi değişti.
  - **Kesim ölçüldü, tahmin edilmedi:** daemon.json mtime'ından **sonra** oluşturulan 5 konteynerin hepsi `{"max-file":"3","max-size":"50m"}` taşıyor, **önce** oluşturulan 11 konteynerin hepsi `{}`. Sınırın kendisi de kanıtlı: `alpfit-garage` 2026-08-28T20:52:05'te, daemon.json'dan **5 dakika 42 saniye önce** oluşturulmuş → `{}`.
  - Tüm ağaçta rotasyon dosyası (`*-json.log.N`) sayısı **0**; `/etc/logrotate.d/` altındaki 14 kuralın hiçbiri docker'a bakmıyor; cron/timer'da kesme yok — güvenlik denetimi (`bunker-guvenlik-denetim.sh:207`) toplam MB'yi yalnız **ölçüyor**, kesmiyor.
  - **Pratik karşılığı:** konteyner yeniden oluşturulursa tavan 50m × 3 = 150 MB olur; bugünkü hıza göre (155 MB / 31 gün) bu **≈ 30 günlük** bir pencere demektir. Bugün böyle bir pencere **yok** — metin bir süre vaadi veremez.

- **Alt görev 2 ✅ — parmak izi karşılaştırması. Sonuç: EŞLEŞME YOK.** Hiçbir değer basılmadı; yalnız SHA-256'nın ilk 12 karakteri ve uzunluk karşılaştırıldı.

  | Anahtar | Sunucu `/opt/alpfit-lead/.env` | Yerel `.env` | Sonuç |
  |---|---|---|---|
  | `LEAD_TOKEN_PREVIEW` | `0dc073b889b4` (64) | `1a5c428e4b47` (64) | ✗ eşleşmiyor |
  | `LEAD_TOKEN_PRODUCTION` | `257900c72d3d` (64) | `ace3e073f68a` (64) | ✗ eşleşmiyor |

  - **Ölçtüğüm dosya gerçekten canlı kaynak:** `alpfit-pocketbase` konteynerinin **çalışan env'i** dosyayla birebir aynı iki parmak izini verdi (`0dc073b889b4` / `257900c72d3d`), yani dosya bayat değil. Konteynerin compose kaynağı da aynı dizin (`/opt/alpfit-lead/docker-compose.yml`).
  - `IP_HASH_SALT` task planına uygun olarak ayrıca ölçülmedi — TASK-1.18 canlı tuzun boru içinde kalıp hiçbir yere kaydedilmediğini yazıyor, karşılaştırılacak kaynak yok.
  - Yan ölçüm (B-058'i teyit eder): yerel `LEAD_STORE_TOKEN` ile yerel `LEAD_TOKEN_PREVIEW` **aynı parmak izini** veriyor (`1a5c428e4b47`), ve `LEAD_STORE_URL` = `http://lead-store:8090` — yani site bugün yerel konteynere yazıyor.

- **Alt görev 3 ✅ — kayıt.** İki karar `docs/DECISIONS.md`'ye yazıldı; nginx tarafındaki düzeltme bu fazın işi olmadığı için `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.01]` işaretli tek satır düştü.

**Sorunlar:**
- **İlk `psql` denemesi `role "bunker" does not exist` ile düştü** — kullanıcı adı varsayılmıştı. Çözüm: ad tahmin edilmedi, Umami konteynerinin `DATABASE_URL`'inden **yalnız kullanıcı ve veritabanı adı** ayrıştırıldı (parola hiçbir zaman basılmadı, `urlparse` çıktısının yalnız iki alanı yazdırıldı) → `bunker_user` / `umami`.

**Kararlar:**
- **Döndürme YAPILMAZ; TASK-2.03'ün ön koşulu düştü.** Gerekçe: iki token da sunucudaki canlı değerle eşleşmiyor ve ölçtüğüm dosyanın canlı kaynak olduğu çalışan konteynerin env'iyle ayrıca doğrulandı. Sızmamış bir anahtarı döndürmek koruma değil, sunucuda bedeli olan bir işlem olurdu (2026-09-22 research kararının kendi gerekçesi).
- **Yasal metnin ölçüm cümlesi "IP tutulmaz" diyemez ve bir süre vaadi veremez.** Gerekçe: ölçüm ham IP'nin tutulduğunu ve bugün hiçbir saklama sınırı olmadığını gösteriyor. Cümlenin kendisi TASK-2.17'nin işi; bu task yalnız dayanağı sabitledi.
- docs/DECISIONS.md'ye eklendi: **Evet** — iki kayıt (ölçüm beyanının dayanağı · döndürmenin iptali).

**Kalan İşler:** Yok — keşif ayağı kendi işini bitirdi. Ürettiği iki girdi TASK-2.17 (metin) ve TASK-2.03 (iptal kararı) tarafından tüketilecek; ikincisi plan revizyonuna gider (aşağıda).

**Son Yaklaşım:** N/A — pause olmadı, task tek oturumda uçtan uca bitti.

**Sonraki Adım Detayı:** N/A — keşif bulgusu TASK-2.03'ün ön koşulunu düşürdüğü ve milestone'un *"iki anahtar döndürülmüş"* ayağının kullanıcıyla yeniden yazılması gerektiği için DURUM'un `Adım` alanı `plan`'a çekildi; devralan oturum `/devflow:plan-phase` (revizyon modu).

**Dosya Değişiklikleri:**
- Kaynak kodda değişiklik **yok** — bu bir keşif ayağı.
- `_dev/tasks/TASK-2.01.md` → ölçüm sonuçları ve oturum kaydı (bu doküman)
- `_dev/docs/DECISIONS.md` → iki karar eklendi
- `_dev/DURUM.md` → task durumu, özet, `Adım` alanı `plan`
- `_dev/phases/PHASE-2.md` → Task Listesi'nde 2.01 ✅
- `_dev/BULGULAR.md` → Gelen Kutusu'na nginx rotasyon satırı

**Test Sonuçları:**
- **Kod testi koşulmadı ve koşulmaması doğrudur** — task kaynak kodda hiçbir şey değiştirmiyor (keşif ayağı), yani `npm test` ve beş ölçüm betiği bu turda regresyon kapsamı taşımıyor. Bu turun "testi" ölçümün kendisinin doğrulanmasıdır (aşağıdaki iki kontrol grubu).
- **Kontrol grubu 1 — çapraz makine (yöntem eşleşmeyi yakalıyor mu).** Aynı bilinen girdi (`devflow-kontrol-2026-09-22`) iki makinede de aynı parmak izini verdi: yerel `5bff3c05b9bd` = sunucu `5bff3c05b9bd`. Yani "eşleşmedi" sonucu iki farklı kabuğun farklı normalleştirmesinden doğan sahte bir kırmızı **değil**; eşleşme olsaydı görülürdü.
- **Kontrol grubu 2 — makine içi eşitlik.** Yerel `LEAD_STORE_TOKEN` ve `LEAD_TOKEN_PREVIEW` gerçekten aynı değer ve karşılaştırma bunu **aynı** parmak iziyle (`1a5c428e4b47`) gösterdi — yani yöntem eşitliği pozitif olarak tespit ediyor.
- **Salt-okuma doğrulaması (sunucuda hiçbir şey değişmedi).** Ölçüm öncesi/sonrası mtime'lar: `/opt/alpfit-lead/.env` 2026-07-27 21:10:32 · `/etc/docker/daemon.json` 2026-08-28 20:57:47 · `/opt/bunker/nginx/nginx.conf` 2026-09-12 11:18:21 — üçü de değişmedi. 20 konteynerin 20'si ayakta; `bunker-nginx` ve `alpfit-pocketbase` `RestartCount=0`, `StartedAt` 2026-09-14T16:03:29 (ölçümden etkilenmedi). Kullanılan komutların tamamı okuma: `ls`, `stat`, `cat`, `grep`, `sed`, `head`, `tail`, `wc`, `du`, `docker ps/inspect/exec`, `psql` yalnız `SELECT` (`information_schema`).
- **Sır sızıntısı kapısı:** repo ağacında hiçbir 64-hex değer, token ya da tuz yok — commit öncesi `git diff` taramasıyla doğrulandı (aşağıdaki Sonuç Özeti'nde rakamı).

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-22

**Ne Yapıldı:**
- Ölçüm sunucusunun erişim kaydı salt-okuma ile ölçüldü: **ham IP tutuluyor** (592.183/592.375 satır, 5.580 benzersiz IP), **saklama sınırı yok** (155 MB / 603.025 satır / 31 gün, rotasyon dosyası 0), **üçüncü tarafa gitmiyor** (gönderici ajan yok, Umami şemasında IP sütunu yok).
- `daemon.json` bugün rotasyon tanımlıyor ama `bunker-nginx` ondan **önce** oluşturulduğu için kural konteynere inmiyor; kesim 11 eski / 5 yeni konteyner üzerinde ve 5 dakikalık sınır örneğiyle (`alpfit-garage`) kanıtlandı.
- İki token'ın sunucu↔yerel parmak izi karşılaştırıldı: **eşleşme yok**; ölçülen dosyanın canlı kaynak olduğu çalışan konteynerin env'iyle ayrıca doğrulandı. Hiçbir değer hiçbir yere yazılmadı.

**Öğrenilenler:**
- **Docker'ın `daemon.json` log ayarı geçmişe dönük değildir.** Ayar konteyner **oluşturulurken** çözülüp `HostConfig.LogConfig.Config`'e yazılır; `restart` bunu yeniden çözmez, yalnız yeniden oluşturma (`up -d --force-recreate`) çözer. Bu yüzden "daemon.json'da rotasyon var" beyanı tek başına rotasyonun işlediğini **göstermez** — ölçüt konteynerin kendi `inspect` çıktısıdır. Sahada iki ayrı kayıt (v1'in 2026-07-28 ölçümü ve bugünkü daemon.json) aynı sonuca zıt gerekçelerle varıyordu; ayırt eden ölçüm bu oldu.
- **İki makine arasında parmak izi karşılaştırırken kontrol grubu şart.** "Eşleşmedi" sonucu, iki tarafın farklı normalleştirmesinden (CR, tırnak, sondaki yeni satır) doğan sahte bir kırmızı olabilir; bilinen ortak bir girdiyi iki tarafta da hash'lemek bunu bir satırda eler.

---

**Oluşturulma:** 2026-09-22
