# TASK-2.17: Ölçüm ve aktarım beyanları ölçülene göre yazılır (B-024 k.2, ölçüm cümleleri)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1 (yasal içerik) · M7 F7.4 (analitik gerçeği)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.01 ✅ (nginx ölçümü **yapıldı** — sonucu aşağıda; metin ona göre yazılır) · TASK-2.16 (aynı dosya, listeler önce hizalanır)

---

## Hedef

Yasal metnin **ölçüm** ve **aktarım** beyanlarını ölçülmüş gerçeğe hizalamak. Bugün üç cümle fazlasını söylüyor: `legal.ts:199` *"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"*, `:116` *"bu ölçüme kişisel verileriniz aktarılmaz"*, `:68` *"Formu doldurmadan siteyi yalnızca gezdiğinizde, sizden kimlik veya iletişim verisi toplanmaz"* — oysa ölçüm betiği kendi sunucumuzdan yüklendiği için her ziyaretçinin ham IP'si önündeki nginx'in erişim kaydına düşüyor.

Aynı turda aktarım maddesinin **olgu** tarafı tamamlanır: tedarikçilerin hangi ülkede veri işlediği yazılır (e-posta sağlayıcısı bir aktarım hedefidir).

Task, üç ölçüm cümlesi TASK-2.01'in **ölçülmüş** bulgusuna göre yeniden yazıldığında ve tedarikçi ülkeleri olgu olarak anıldığında tamamlanmış sayılır.

---

## Bağlam

**Ölçüm yapıldı — metnin dayanağı artık tahmin değil rakam** (TASK-2.01, 2026-09-22; tam dökümü `tasks/archive/TASK-2.01.md`). Üç sorunun da cevabı ölçüldü:

| Soru | Ölçülen cevap |
|---|---|
| Ham IP tutuluyor mu? | **Evet.** `umami.kiwiailab.com`'un önündeki `bunker-nginx` gömülü `combined` biçimini işliyor; 592.375 satırın 592.183'ü ham IPv4 ile başlıyor, **5.580 benzersiz IP**, 490.980 satır ayrıca user-agent taşıyor |
| Ne kadar süre tutuluyor? | **Bugün sınır yok.** 155 MB / 603.025 satır / 31 günlük pencere ve büyüyor; rotasyon dosyası 0, logrotate ve kesen cron yok. Pencerenin başlangıcı bir rotasyon değil, 2026-08-23 elle disk temizliği |
| Başka bir tarafa gidiyor mu? | **Hayır.** Log gönderici ajan yok, hiçbir konteyner log dizinini bağlamıyor, Umami'nin şemasında IP sütunu yok (`session` yalnız türetilmiş ülke/bölge/şehir tutuyor) |

**Ölçümün ikinci bulgusu metnin süre yazmasını engelliyor:** sunucuda `daemon.json` bugün rotasyon **tanımlıyor** (`50m × 3`) ama `bunker-nginx` ondan önce oluşturulduğu için kural konteynere **inmiyor** — Docker'ın log ayarı geriye dönük değildir. Yani "rotasyon tanımlı" demek "rotasyon işliyor" demek değil; bugün geçerli bir saklama penceresi **yok**. Konteyner yeniden oluşturulursa ≈ 30 günlük bir pencere doğar, ama o iş `altyapi/vps` tarafındadır ve bu fazın kapsamı dışıdır (aşağı bak).

**Sonuç, metin için:** `legal.ts:199`'un *"IP adresinizi tutmaz"* cümlesi olduğu gibi yazılamaz **ve hiçbir süre vaadi verilemez**. "Bugün bir saklama sınırı yok" demek, uydurma bir süre yazmaktan dürüsttür (kullanıcı kararı, discuss 2026-09-22).

**Sunucu düzeltmesi (rotasyon / IP maskeleme) bu fazın işi değil** — altyapı tarafı (`altyapi/vps`), bu repo değil; fazı **kilitlemez** (`ILKELER.md` → proje-dışı iş faz bitişini kilitlemez). Faz yalnız ölçer ve metni ölçülene göre yazar.

**Aktarımın olgu tarafı:** `legal.ts:100` kayıt sunucusunun konumunu zaten yazıyor (Almanya, Nürnberg — TASK-1.15). Eksik olan tedarikçilerin ülkesi: v1'in ölçümü e-posta sağlayıcısının müşteri verisini **ABD'de** sakladığını kaydediyor (`../Alpfitplus-website.v1/_dev/memory/bunker-ortami.md:99-104`; İrlanda yalnız gönderim bölgesi). **Hukuki dayanak (KVKK m.9) bu fazda kurulmaz** — hukukçunun işi (B-008); metin olguyu söyler, sebebi hukukçuya bırakır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-2.01.md` → Oturum Kaydı — ölçümün tam dökümü (özeti yukarıdaki tabloda); metin bundan yazılır
- `_dev/bulgular/B-024-*.md` → "🔴 gerekçesi" ve "Yeniden ölçüm" blokları
- `../Alpfitplus-website.v1/_dev/memory/bunker-ortami.md:84-104` (salt okunur) — v1'in ölçümü, sağlayıcı veri konumu
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — Umami kurulumunun gerçeği
- `_dev/bulgular/B-059-*.md` → (3) — v1'in metni aktarım dökümünü yazıyor; geçişte gerileme olmasın
- `src/content/legal.ts:60-120, 180-215`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-024-*.md` — **atom bu task'ta kapanır**; kapanış kaydı **hukuki dayanak ayağının hukukçuda kaldığını** açıkça yazar (B-008'e bağlı)
- `_dev/docs/DECISIONS.md` — ölçüm beyanının nasıl yazıldığı ve neden süre vaadi verilmediği

---

## Alt Görevler

- [x] **1. Üç ölçüm cümlesini yeniden yaz**
  - `:199` "IP adresinizi tutmaz" · `:116` "kişisel verileriniz aktarılmaz" · `:68` "yalnızca gezdiğinizde … toplanmaz"
  - Yeni metin ölçüleni anlatır: ölçüm sisteminin **ön kapısındaki** erişim kaydında ziyaretçinin IP'si ve tarayıcı bilgisi tutuluyor, bugün bir **saklama sınırı yok** ve kayıt üçüncü bir tarafa gitmiyor
  - **Süre yazılmaz** — ölçüm bir pencere bulmadı; "şu kadar süre saklanır" cümlesi kurulmaz
  - Umami'nin kendi veritabanında IP tutmaması doğru bir olgudur ve korunur — ama "ölçüm" kelimesinin kapsamı daraltılır

- [x] **2. Aktarım maddesinin olgu tarafı**
  - Tedarikçi listesine (`legal.ts:104-112`) her birinin veri işleme ülkesi eklenir; e-posta sağlayıcısı **yurt dışı** aktarım hedefi olarak anılır
  - Hukuki sebep bölümü (`legal.ts:91`) **değişmez** — m.9 dayanağı hukukçuya bırakılır ve bu boşluk metinde dürüstçe durur (uydurulmaz)
  - `legal.ts:147`'deki "aktarıldığı üçüncü kişileri bilme" hakkı artık gerçek bir dökümle karşılanıyor

- [x] **3. Sunucu tarafını doğru eve kaydet**
  - Düzeltme gerekiyorsa (rotasyon / IP maskeleme) `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.17]` işaretli tek satır; iş `altyapi/vps` tarafına aittir
  - Bu satır fazı **kilitlemez**

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts                    # ölçüm cümleleri + tedarikçi ülkeleri — zaten var
_dev/docs/DECISIONS.md          # ölçüm beyanının kaydı — zaten var
_dev/BULGULAR.md                # gerekirse altyapı satırı — zaten var
```

---

## Dikkat Noktaları

- **Ölçülmemiş şey yazılmaz — ve ölçüm bir süre bulmadı.** Metin saklama süresi vaat etmez; "bugün bir sınır yok" der. Sunucuda rotasyon **tanımlı** olması yanıltmasın: kural o konteynere inmiyor (ölçüldü), yani yazıya dökülebilecek bir pencere yok.
- **Sağlayıcı veri konumu bayatlayabilir** — v1'in ölçümü 2026 tarihli; metin sağlayıcıyı adıyla ve ülkesiyle anarken kaynağı task kaydında durur. Emin olunamayan bir konum yazılmaz.
- **Hukuki sebep boşluğu bilinçlidir ve gizlenmez.** Metin olguyu söyler; dayanak hukukçu onayıyla gelir (B-008). Uydurma bir madde numarası yazma.
- **v1'den gerileme olmasın** (B-059 kalem 3): v1'in canlı metni aktarım dökümünü yazıyor — v2 geçiş gününde **daha az** bilgi vermemeli.
- **"Ölçüm" kelimesinin kapsamı** ziyaretçi için ölçüm sisteminin tamamıdır; cümleyi daraltırken ziyaretçinin anlayacağı dilde kal (`STYLE-GUIDE` → Metin Tonu).
- **B-060 bu cümleleri de çivileyecek** (TASK-2.18) — metin son hâlini burada alır.

---

## Test Kriterleri

- [x] Üç ölçüm cümlesi TASK-2.01'in bulgusuyla **çelişmiyor**; her cümlenin dayanağı ölçüm çıktısına çapalı (eşleme `legal.ts` Aktarım bölümünün üstündeki yorum bloğunda) — **ayrıca bu turda yeniden ölçüldü**, devralınan rakam kullanılmadı
- [x] Ölçüm kayıtları için **hiçbir saklama süresi** yazılmıyor (ölçüm bir pencere bulmadı); hiçbir cümlede ölçülmemiş sağlayıcı davranışı yok
- [x] Tedarikçi listesi her sağlayıcının veri işleme ülkesini söylüyor; e-posta sağlayıcısı yurt dışı aktarım hedefi olarak anılıyor
- [x] Hukuki sebep bölümü değişmedi ve eksikliği metinde dürüstçe duruyor (uydurma madde yok)
- [x] v1'in canlı metniyle karşılaştırma yapıldı: v2 hiçbir kalemde **daha az** bilgi vermiyor (B-059 kalem 3 çapası) — kalem kalem tablo aşağıda
- [x] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` üç yasal sayfada konsol temiz
- [x] `docker compose exec web npm test` yeşil · üretim derlemesi hatasız (`docker compose build web-prod` — `exec web npm run build` bilinçli kullanılmadı, `next_cache` çakışması)

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

- **Alt görev 1 ✅ — üç ölçüm cümlesi (artı Gizlilik'teki ikizi) yeniden yazıldı.** Task'ın verdiği satır numaraları TASK-2.16'dan sonra kaymıştı; hedefler metinden bulundu: KVKK "yalnızca gezdiğinizde" (eski `:68`), KVKK Aktarım'ın Umami paragrafı (eski `:116`), Gizlilik "Çerezler ve ölçüm" (eski `:199`). **Dördüncü bir cümle eklendi:** Gizlilik'in "Topladığımız veriler" girişi (*"Siteyi yalnızca gezdiğinizde sizden kimlik veya iletişim bilgisi toplamıyoruz"*) KVKK'daki ikizin birebir aynısıdır ve aynı ölçüme bakar — üçünü düzeltip onu bırakmak, kanıtı düzeltilmiş bir metnin yanında düzeltilmemiş ikizini yayında tutmak olurdu.
  - Yeni anlatım üç şeyi söylüyor: ölçüm yazılımı **kendi sunucumuzdan yüklendiği için** her ziyarette o sunucunun erişim kaydına bir satır düşüyor; satırda **IP adresi ve tarayıcı bilgisi** var; kayıt sunucuda kalıyor, bir başkasına gitmiyor. **Hiçbir süre yazılmadı** — ölçüm bir pencere bulmadı; kullanılan kalıp dokümanın kendi yerleşik deyimi: *"bugün için otomatik bir silme süresi işletmiyoruz"*.
  - **Umami'nin kendi veritabanı hakkındaki doğru olgu korundu ama daraltıldı:** "bu ölçüm IP tutmaz" yerine "bu **yazılımın kendi veritabanında** IP adresiniz için bir alan yoktur". Kapsam öznede: eski cümle ziyaretçi için ölçüm sisteminin tamamını kapsıyordu, nginx onun ön kapısıdır.
  - Silinen iki iddia: *"kayıtlarında IP adresinizi tutmaz"* (ölçümle çelişiyordu) ve *"bu ölçüme kişisel verileriniz aktarılmaz"* (ham IP KVKK'da kişisel veridir). *"Kimlik tanımlamayan"* sıfatı da düştü — yeni paragrafın yanında çelişkili okunuyordu.

- **Alt görev 2 ✅ — aktarımın olgu tarafı yazıldı; dört tedarikçinin de ülkesi ölçüldü.** Liste rol + ülke gösteriyor, giriş cümlesi koşullu dilden (`aktarılabilir`) olgu diline (`aktarılır`) çevrildi ve altına v1'in `TRANSFER_FACT`'inin karşılığı kondu: *yurt dışına aktarım koşullu bir ihtimal değil, her demo talebinde olan şey.* **Dördüncü kalem (ekip posta kutusu) eklendi** — listede hiç yoktu, oysa bildirimin düştüğü yer orası.
- **Alt görev 3 ✅ — sunucu tarafı.** `BULGULAR.md` → Gelen Kutusu'nda `[TASK-2.01]` satırı **zaten duruyordu**; ikinci bir satır açmak aynı bilgiyi iki yere yazmak olurdu. Satır bu turun yeniden ölçümüyle tazelendi ve `[TASK-2.17]` işareti eklendi. İş hâlâ `altyapi/vps` tarafında ve fazı kilitlemiyor.

**Ölçüm — dört tedarikçinin ülkesi (hepsi bu turda, kaynağından):**

| Tedarikçi | Ölçüm | Sonuç |
|---|---|---|
| Barındırma (Vercel) | Repoda `vercel.json` ve `preferredRegion` **yok** → platform varsayılanı geçerli. Canlı: `/api/demo` yanıtının `x-vercel-id` başlığı **üç koşumda da** `fra1::iad1::…` | Fonksiyon **`iad1`** = us-east-1, **Washington, D.C., ABD** (Vercel'in kendi belgesi: *"Vercel Functions default to running in the iad1 (Washington, D.C., USA) region"*) |
| Sunucu barındırma | RDAP `178.104.140.36` | **Hetzner Online GmbH**, ağ adı `CLOUD-NBG1`, country **DE**; ters DNS `static.36.140.104.178.clients.your-server.de` → **Almanya, Nürnberg** |
| E-posta gönderimi (Resend) | Sağlayıcının **kendi** beyanı: `resend.com/legal/dpa` → *"Company's primary processing operations take place in the United States"*; `legal/privacy-policy` aynısını yazıyor | Saklama **ABD** |
| E-posta gönderim bölgesi | `GET api.resend.com/domains` (salt okuma, değer basılmadı) | `alpfitplus.com` → region **`eu-west-1` (İrlanda)**, status `verified` |
| Ekip posta kutusu | `DEMO_TO` Vercel'de **Config** (Secret değil); alan adı `kiwiailab.com`, MX = `aspmx.l.google.com` (+4 alt) | **Google Workspace**, ABD merkezli |

**Ölçüm — sunucu tarafı yeniden ölçüldü (salt okuma, 2026-09-23; TASK-2.01'in 2026-09-22 rakamı kopyalanmadı):**

| Kalem | TASK-2.01 (09-22) | Bu tur (09-23) |
|---|---|---|
| Erişim kaydı boyutu | 162.121.877 B | **165.414.271 B** |
| Satır | 603.025 | **615.853** |
| Ham IPv4 ile başlayan | 592.183 | **604.452** |
| Benzersiz IP | 5.580 | **5.647** |
| Pencere başlangıcı | 2026-08-22T22:29:38Z | **değişmedi** (yani rotasyon hiç olmadı) |
| Rotasyon dosyası (tüm ağaç) | 0 | **0** |
| `bunker-nginx` `LogConfig` | `{}` | **`{}`** |
| Log gönderici ajan / logrotate docker kuralı | 0 / 0 | **0 / 0** |

Sunucuda hiçbir şey değişmedi — komutların tamamı okuma (`docker inspect`, `wc`, `find`, `head`, `tail`, `psql` yalnız `SELECT`).

**Devralınan bir özet ölçümle düzeltildi — `session` tablosu sanıldığından fazlasını tutuyor.** TASK-2.01'in özeti *"`session` yalnız türetilmiş ülke/bölge/şehir tutuyor"* diyordu. Bu turda `information_schema` yeniden tarandı: IP sütunu gerçekten **yok** (tek iki eşleşme yine `board.description` / `report.description`, yani "descr**ip**tion" yanlış pozitifi) — ama `session`'ın sütunları `session_id, website_id, **browser, os, device, screen, language**, country, region, city, created_at, distinct_id`. Yani tarayıcı/işletim sistemi/cihaz/ekran/dil de orada duruyor. Metin **ölçülen tam listeye** göre yazıldı; devralınan yarım listeyle yazılsaydı yeni bir eksik beyan doğardı.

**v1 canlı metniyle kalem kalem karşılaştırma (B-059 k.3 çapası) — v2 hiçbir kalemde daha az bilgi vermiyor:**

| v1 `RECIPIENTS` kalemi | v2'deki karşılığı |
|---|---|
| Lead deposu — Almanya (Hetzner, Nürnberg) | ✅ Liste kalemi 2 + Aktarım'ın ilk paragrafı |
| Analitik (Umami) — Almanya, aynı sunucu | ✅ Liste kalemi 2 ("ve ölçüm yazılımımızın") + iki ölçüm paragrafı |
| Resend — gönderim İrlanda, saklama ABD | ✅ Liste kalemi 3, **iki yarısı da** — ve bu turda ikisi de ayrı ayrı ölçüldü |
| Google Workspace — ekip kutusu, ABD merkezli | ✅ Liste kalemi 4 (bu turda eklendi) |
| Vercel — barındırma ve form ucu, ABD merkezli | ✅ Liste kalemi 1, **daha güçlü**: bölge adıyla ölçülü (Washington, D.C.) |
| `TRANSFER_FACT` — her talepte gerçekleşir | ✅ Listenin altındaki paragraf |

v1'in yapıp v2'nin yapmadığı bir kalem **kalmadı**. İki yerde v2 daha ileride: fonksiyon bölgesi adıyla yazılı, ve erişim kaydının kendisi (v1'in metninde yok) anlatılıyor.

**Sorunlar:**
- **`npx tsc --noEmit` host'ta çalışmıyor** (TypeScript yalnız konteynerde kurulu, `npx` "not installed" diyor). Doğru koşum `docker compose exec -T web npx tsc --noEmit` → çıkış 0.
- **`vercel project inspect` 90 sn'de dönmedi** (`npx` üzerinden). Gerek kalmadı: bölge sorusu canlı yanıt başlığıyla zaten ölçüldü; `vercel env ls` yerel kurulu ikiliyle (`~/.local/bin/vercel`) 262 ms'de döndü.

**Kararlar:**
- **Süre yazılmadı, "bugün işletmiyoruz" yazıldı.** Ölçüm bir pencere bulmadı; uydurma süre yazmak yerine dokümanın e-posta kopyaları için zaten kullandığı deyim tekrarlandı. Ek olarak *"Bir silme süresi işletmeye başladığımızda bu metne yazılacaktır"* kondu — rotasyon düzeltilirse (`altyapi/vps`) metnin güncellenmesi gerektiğini ziyaretçiye değil, **bize** hatırlatan çapa.
- **Google Workspace için yalnız "ABD merkezli" yazıldı, "verisi ABD'de saklanır" yazılmadı.** Ölçtüğüm şey MX kaydı (kutu Google'da) ve şirketin merkezi; Workspace'in veri bölgesi ayarı **ölçülmedi**, o yüzden yazılmadı. v1 de tam bu sınırda duruyor.
- **Gönderim bölgesi ile saklama yeri ayrı cümlelerde.** v1'in kendi dersi (`bunker-ortami.md`): *"sağlayıcının bölge ayarı verinin evini söylemez"* — İrlanda seçimi bir kez "veri AB'de kalıyor" diye yanlış okunmuştu. İkisi bilerek yan yana ve ayrı yazıldı.
- **Hukuki sebep bölümüne dokunulmadı** (B-008). Metin olguyu söylüyor, m.9 dayanağını kurmuyor; v1'in canlı metni de dayanak kurmuyor, yani bu bir gerileme değil.
- **Gelen Kutusu'na ikinci satır açılmadı** — mevcut `[TASK-2.01]` satırı tazelendi.

**Kalan İşler:** Yok. B-024 bu turda kapandı ve arşive gitti; hukuki dayanak ayağı **B-008'de** devam ediyor. Metin son hâlini aldı — kapı TASK-2.18/2.19'un işi.

**Son Yaklaşım:** N/A — pause olmadı, task tek oturumda uçtan uca bitti.

**Sonraki Adım Detayı:** N/A — sıradaki task TASK-2.18 (yasal beyan testi, depo içi yedi olgu). Yazdığım beyanların çapaları `legal.ts`'te Aktarım bölümünün üstündeki yorum bloğunda kalem kalem duruyor; 2.18 kapısını oradan türetebilir.

**Dosya Değişiklikleri:**
- `src/content/legal.ts` → dört ölçüm cümlesi yeniden yazıldı, tedarikçi listesi ülkelerle genişletildi (3 → 4 kalem), aktarım olgusu paragrafı ve erişim-kaydı paragrafları eklendi, Saklama süresi'ne erişim kaydı kalemi girdi, Aktarım'ın üstüne ölçüm çapası yorum bloğu kondu
- `_dev/tasks/TASK-2.17.md` → bu oturum kaydı (sonra `archive/`e taşındı)
- `_dev/DURUM.md` → task durumu, özet, aktif task
- `_dev/phases/PHASE-2.md` → Task Listesi'nde 2.17 ✅
- `_dev/bulgular/B-024-*.md` → kapanış kaydı; `bulgular/archive/`e taşındı
- `_dev/BULGULAR.md` → B-024 satırı silindi, Gelen Kutusu'nun nginx satırı tazelendi, açık bulgu sayısı
- `_dev/docs/DECISIONS.md` → iki karar
- `_dev/memory/urun-iddiasi-capa-dogrulamasi.md` → devralınan **özetin** eksik olabileceği dersi

**Test Sonuçları:**
- `docker compose exec web npm test` → **180 geçti + 1 atlandı** (taban birebir; bu task test eklemedi — kapı bilinçle TASK-2.18'in işi, metin son hâlini almadan kapı yazılmaz).
- `docker compose exec web npx tsc --noEmit` → çıkış **0**.
- `docker compose build web-prod` → başarılı; imaj 3100'de yeniden kaldırıldı ve **tazeliği ölçüldü** (`/kvkk` ve `/gizlilik` yeni cümleleri döndürüyor; son düzenlemeden sonra ikinci kez derlendi ve "İrlanda bölgesinden" ibaresi 3100'de doğrulandı).
- `a11y.mjs` → 8 rota, **TOPLAM SORUN 0** (taban birebir).
- `mobile-audit.mjs` → **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir); `/demo`'daki 3 taşan eleman bilinen bal küpü kalemi.
- `font-guard.mjs` → 16 sayfa / **85.015 karakter** (taban 82.502; metin büyüdüğü için +2.513), kümede olmayan karakter **yok**.
- `scan.mjs` 390×844 → `/kvkk` 9 kare · `/gizlilik` 6 kare · `/kullanim-kosullari` 5 kare — **üçünde de konsol temiz**.
- ⚠️ **`/kvkk` ve `/gizlilik` `mobile-audit`'in rota listesinde yok** (B-012, açık bulgu; betiğe dokunulmadı): değişen üç sayfa ayrı bir sondayla **320/360/390/412** px'te ölçüldü → **12/12 yatay kaydırma yok**. Sonda `/work` **dışına** (`/probe.mjs`) bağlandı (memory'deki 0-baytlık-root-dosya tuzağı) ve repoda artık dosya kalmadığı ayrıca doğrulandı.
- **Bu task bir kapı üretmedi**, o yüzden "bozuk girdi / boş kapsam" sınaması düşer. Yerine geçen doğrulama, yazılan **her cümlenin kaynağına geri götürülmesidir**: dört tedarikçi ülkesi de sağlayıcının kendi beyanından ya da ağ kaydından ölçüldü, sunucu rakamları yeniden alındı ve devralınan bir özet (`session` sütunları) bu yolla yanlış bulunup düzeltildi.

---

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-23

**Ne Yapıldı:**
- Yasal metnin **ölçüm** beyanları ölçülene hizalandı: iki yanlış iddia (*"kayıtlarında IP adresinizi tutmaz"*, *"bu ölçüme kişisel verileriniz aktarılmaz"*) silindi; yerlerine ölçüm sunucusunun erişim kaydının IP ve tarayıcı bilgisi tuttuğu, kaydın sunucuda kaldığı ve **bugün bir silme süresi işletilmediği** yazıldı. Umami'nin kendi veritabanı hakkındaki doğru olgu korundu ama öznesi daraltıldı.
- Yasal metnin **aktarım** beyanı olgu hâline getirildi: tedarikçi listesi 3 → **4 kalem** (ekip posta kutusu eklendi), her kalem rolünü ve ülkesini söylüyor, giriş cümlesi `aktarılabilir` → `aktarılır`, altında *"yurt dışına aktarım her demo talebinde olan şeydir"* paragrafı.
- **Dört tedarikçinin ülkesi de bu turda kaynağından ölçüldü:** Vercel fonksiyonu `iad1` (Washington, D.C.), Hetzner `CLOUD-NBG1`/DE, Resend kendi DPA'sında ABD + gönderim `eu-west-1`, ekip kutusu Google MX. Sunucu rakamları da yeniden alındı.

**Öğrenilenler:**
- **Devralınan bir ÖZET, devralınan bir iddia kadar risklidir.** TASK-2.01'in *"`session` yalnız ülke/bölge/şehir tutuyor"* özeti eksikti — tablo ayrıca `browser/os/device/screen/language` tutuyor. Özet yanlış değildi, **tam değildi**; yasal metne olduğu gibi geçseydi yeni bir eksik beyan doğardı. Ölçümün kendisine geri dönmek, ölçümün özetine güvenmekten ucuzdu (tek `information_schema` sorgusu).
- **Bir sağlayıcı için iki ayrı ülke sorusu vardır ve karıştırılırsa metin yanlış olur:** *nerede işliyor* (Vercel → ABD, ölçüldü) ile *şirket nerede* (Google → ABD merkezli, ama veri bölgesi ölçülmedi). v1'in bir kez düştüğü tuzak buydu (İrlanda bölgesi → "veri AB'de"). Ölçülen hangisiyse cümle onu söyler; ötekini söylemez.

---

**Tamamlanma:** 2026-09-23

---

**Oluşturulma:** 2026-09-22
