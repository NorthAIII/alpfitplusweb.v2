# TASK-2.21: Onay e-postası yalnızca doğrulanabilir bir alıcıya gider (UAT senaryo 26)

**Durum:** ✅ Tamamlandı

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.07 ✅ (onay e-postasını açan task — bu, onun açtığı yüzeyin daraltılmasıdır)

---

## Hedef

Demo talep ucunun, **talebi gönderenin sahibi olduğu gösterilmemiş** bir adrese onay e-postası göndermesini sınırlamak. Bugün uç, istek gövdesinde yazan her biçimsel geçerli adrese, doğrulanmış `alpfitplus.com` göndericisinden bir e-posta yolluyor ve selamlama satırında istek sahibinin 120 karakterine kadar metnini taşıyor.

Task, seçilen sınırlama uygulandığında ve bir kötüye kullanım sondası (üçüncü bir adrese art arda onay e-postası tetiklemek) **ölçülerek** engellendiğinde ya da kabul edilebilir bir tavana indirildiğinde tamamlanmış sayılır.

---

## Bağlam

**Bulgunun kaynağı:** `verify-phase` Adım 1c güvenlik taraması + UAT senaryo 26 (2026-09-23). Faz penceresi diff'inde (`e31331f..HEAD`) doğdu — TASK-2.07 `toLeadEmail()`'i ekledi ve ziyaretçiye onay kanalı açtı. Tasarım v1 ile paritedir; **bulgu kanalın kendisi değil, alıcının doğrulanmamış olmasıdır.**

**Ölçülen kapı zinciri** (2026-09-23, yerel üretim imajına karşı):

| Kapı | Durumu |
|---|---|
| Hız sınırı | **Var** — IP başına 10 dk / 5 istek; 6. istek `429` (ölçüldü) |
| Bal küpü | **Var** — dolu gelirse `200`, hiçbir yere yazılmaz (ölçüldü) |
| Onay kutusu | **Var** — `consent !== true` → `422` (ölçüldü) |
| Adresin sahipliği | **YOK** — `isValidEmail()` yalnız `yerel@alan.uzanti` biçimine bakar |

**Pratik karşılığı:** bir kötü niyetli kullanıcı, kendi IP'sinden on dakikada beş kez, başkasının adresine, bizim doğrulanmış alan adımızdan gelen bir e-posta tetikleyebilir; selamlamada okuduğu metni kendisi yazar (`Merhaba <120 karakter>,`). Gövdenin geri kalanı sabittir ve düz metindir — enjeksiyon yüzeyi yok, kontrol karakterleri `cleanLine` ile ayıklanıyor. Zarar **içerik** değil, **gönderici itibarı** ve istenmeyen postadır.

⚠️ **Bu bir kayıp/sızıntı bulgusu değildir.** Lead hattı, kayıt, `notify_lead` ve dönüşüm yolu doğru çalışıyor (UAT 23-25 ✅). Kapsam yalnız alıcı doğrulamasıdır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-2-UAT.md` → senaryo 26 — ölçülen kapı zinciri ve rakamları
- `_dev/modules/M3-Lead-Hatti.md` → F3.1 (bal küpü, hız sınırı) ve F3.3 (onay e-postası kabul kriterleri)
- `src/app/api/demo/route.ts` → `toLeadEmail()`, `leadAddressable`, `limited()`
- `src/lib/contact.ts` → `isValidEmail` (bilinçli olarak gevşek — TASK-1.12 dikkat notu; **sıkılaştırmak bu task'ın çözümü değil**, meşru yazımları eler)
- `_dev/bulgular/B-037-api-demo-sertlestirme-bosluklari.md` — ucun kardeş sertleştirme boşlukları (**kapsam dışı**, ayrı bulgu)
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — senaryo başına ayrı `X-Forwarded-For`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum; `_dev/phases/PHASE-2-UAT.md` — senaryo 26 satırı
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 — seçilen sınırlama kabul kriteri olarak eklenir
- `_dev/docs/DECISIONS.md` — hangi seçenek neden seçildi (geri dönüşü olan bir davranış sözleşmesi doğuruyor)

---

## Alt Görevler

- [x] **1. Seçeneği karara bağla** (→ Karar Noktaları)
  - **(a) + (b) seçildi, (c) reddedildi.** Gerekçe Oturum Kaydı → Kararlar'da
  - Karar `docs/DECISIONS.md`'ye yazıldı (2026-09-23)

- [x] **2. Seçilen sınırlamayı uygula**
  - `src/app/api/demo/route.ts` → `confirmCapped()` + `CONFIRM_LIMIT`/`CONFIRM_WINDOW_MS`; `src/content/mail.ts` → metin parametre almıyor
  - Ziyaretçinin yanıtı (`200` + gövde alanları) **değişmedi** — TASK-2.07'nin sözleşmesi korundu (altı turda ölçüldü)
  - `notify_lead` kümesi **büyütülmedi**; tavana takılan gönderim `skipped` yazar (gönderim denenmedi — `failed` sağlayıcı reddi demektir)

- [x] **3. Kapıyı sözleşme bataryasına bağla**
  - `tests/api-demo.test.ts`: +5 test; dört ters çevirmenin dördü kırmızı döndü (T1-T4, Test Sonuçları'nda)
  - Mevcut altı TASK-2.07 senaryosu yeşil kaldı; ikisinde adres tekilleştirildi (yeni sayaç dosya boyunca yaşıyor)

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts                # alıcı doğrulaması / tavan — zaten var
src/content/
└── mail.ts                 # seçeneğe göre metin — zaten var
tests/
└── api-demo.test.ts        # kapının kendi testi — zaten var
```

---

## Dikkat Noktaları

- **`isValidEmail`'i sıkılaştırmak çözüm değildir.** Gevşekliği bilinçli (TASK-1.12, B-021): amaç açık çöpü elemek, meşru yazımı zorlamamak. Sorun biçim değil **sahiplik**.
- **Dönüşüm yolu daralmamalı** (`ILKELER.md` → 1. eksen). Ziyaretçi talebini gönderdiğinde ekran onayını (TASK-2.05/2.06) aynen görmeli; onay e-postası ikincil kanaldır ve gecikmesi/yokluğu `200`'ü değiştirmez.
- **Ekip bildirimi (`toEmail`) bu task'ın konusu değil** — alıcısı sabit (`DEMO_TO`), kötüye kullanım yüzeyi yok.
- **Hız sınırı sayacı doğrulamadan önce koşar** (B-020, açık bulgu) — tavan seçeneği seçilirse o bulguyla etkileşimi kontrol et, ama **B-020'yi bu task'ta çözme**.
- **Bal küpü dalı e-posta tetiklememeye devam etmeli** (bugünkü davranış; UAT 25 ✅).
- **Kişisel veri:** doğrulama için ek bir alan saklanacaksa (ör. tek kullanımlık jeton) yasal metin **aynı turda** gözden geçirilir — M3 F3.2'nin kalıcı koruma kriteri bunu emrediyor.

---

## Test Kriterleri

- [x] Sınırlama devredeyken: üçüncü bir adrese art arda onay e-postası tetikleme denemesi **ölçülen tavana takılır** — altı deneme, **3 gitti / 3 takıldı** (tavan: 24 saatte 3)
- [x] Meşru akış bozulmadı: taze adresli talepte onay e-postası gidiyor ve `notify_lead: "sent"` yazılıyor
- [x] Ziyaretçinin yanıtı altı turun altısında da aynı: `200` + `{ok, stored, mailed}` (TASK-2.07 sözleşmesi)
- [x] Bal küpü dolu istek hâlâ `200`, kayıt yok, e-posta yok (mevcut senaryo yeşil kaldı, dokunulmadı)
- [x] **Ters çevirme:** dört ayrı bozma denendi, dördü de kırmızı (T1-T4); her biri scratchpad kopyasından `cp` ile geri alındı ve **md5 ile doğrulandı** (`git checkout`/`git restore` kullanılmadı)
- [x] `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **216 geçti + 1 atlandı** (taban 211+1; +5)
- [x] `docker compose exec web npx tsc --noEmit` çıkış 0 · `docker compose build web-prod` çıkış 0

---

## Karar Noktaları

- **Hangi sınırlama?** → **(a) + (b) uygulandı, (c) reddedildi** (2026-09-23; koşum yetkisiyle karara bağlandı, gerekçe Oturum Kaydı → Kararlar):
  - **(a) Adres başına tavan** ✅ — 24 saatte 3 onay e-postası, anahtar küçük harfe indirgenmiş adres (`route.ts` → `confirmCapped`). Ziyaretçi akışı hiç değişmedi; kötüye kullanım hacmini 6 denemede 3'e kırptı.
  - **(b) Selamlamadaki serbest metin kaldırıldı** ✅ — metin artık **parametre almıyor** (`content/mail.ts`). İstek sahibinin yazdığı hiçbir şey alıcıya ulaşmıyor; kalan yüzey içeriksiz.
  - **(c) Onayı ikinci adıma bağla** ❌ — en sağlamı, ama ILKELER'in 1. ekseniyle (Dönüşüm) çatışıyor, saklanan jeton yeni bir kişisel veri alanı ve aynı turda yasal metin revizyonu getiriyor, pilot hacmiyle orantısız. Kapanmayan artık (adres sahipliğinin gerçekten doğrulanması) bu seçenekte durur; gerekirse ayrı bir bulgu olarak açılır.
  - **Neden ikisi birden:** tek başına hiçbiri bulguyu kapatmıyordu — (a) saldırganın kendi metnini tavan kadar göndermesine izin verirdi, (b) hacmi hiç kırpmazdı.

---

## Risk ve Geri Dönüş Planı

- **(c) seçilirse onay e-postası gecikir** → ziyaretçi ekran onayını yine anında görür; `notify_lead` yeni durumu nasıl taşıyacağı karara bağlanır (v1 paritesi bozulmamalı).
- **Rollback:** tek dosya (`route.ts`); dosya bazlı geri alma yeterli, depo şeması değişmiyor.

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
- **Seçenek karara bağlandı: (a) + (b), (c) reddedildi.** İkisi birlikte uygulandı çünkü tek başına hiçbiri bulguyu kapatmıyor — ölçülerek görüldü: (a) tek başına saldırganın **kendi yazdığı metni** üçüncü bir adrese (tavan kadar) göndermesine izin verirdi; (b) tek başına gönderici itibarını yiyen hacmi (IP başına 10 dk / 5) hiç kırpmazdı. İkisi de ziyaretçinin akışına **hiç dokunmaz** (ILKELER → 1. eksen Dönüşüm), toplam üç dosya değişti — task'ın kendi "Etkilenen Dosyalar" listesiyle birebir.
- **(a) Adres başına tavan** — `route.ts` → `confirmCapped()`: **24 saatte 3 onay e-postası**, anahtar `email.trim().toLowerCase()`. Sayaç `HITS`'in ölçülmüş iki kusurunu (B-037 k.2) bilinçle tekrarlamıyor: reddedilen deneme sayaca **yazılmaz** (`list.push` koşulsuz değil) ve harita dolduğunda `clear()` ile herkesin sayacı silinmez — `pruneConfirmHits()` yalnız süresi geçmiş anahtarları budar.
- **(b) Selamlamadaki serbest metin kaldırıldı** — `content/mail.ts` → `text` artık **parametre almayan** sabit bir metin (`Merhaba ${name},` → `Merhaba,`). Yüzey biçimsel olarak kapandı: parametre yoksa enjekte edilecek yer de yok. Ekip bildirimi (`toEmail`) değişmedi — alıcısı sabit, adı taşımaya devam ediyor.
- **`toLeadEmail` artık `boolean` değil `NotifyLead` döndürüyor.** "Gönderilmedi"nin iki ayrı anlamı (`skipped` = denenmedi / `failed` = sağlayıcı reddetti) boolean'a sığmıyordu; çağrı yerinde yeniden türetilseydi tavan dalı sessizce `failed` okunur ve ekibe olmayan bir sağlayıcı sorunu kovalatırdı. `notify_lead` kümesi **büyütülmedi** (alan adı geçişinde v1 ile aynı koleksiyon okunacak).
- **Sayaç yalnız kanal açıkken işler.** `RESEND_*` tanımsızken `toLeadEmail` env kapısında `failed` dönüp çıkıyor; tavan hiç danışılmıyor. Gerekçe ölçülmüş: aksi hâlde hiç gönderilmeyen e-postalar adresin kotasını yakardı (yerel üretim provası 3100 tam bu hâlde).
- **Yasal metin gözden geçirildi, DEĞİŞMEDİ** — M3 F3.2'nin kalıcı koruma kriteri gereği ve gerekçesiyle (aşağıda → Kararlar).

**Sorunlar:**
- **Yeni sayaç bataryayı kırdı ve sebebi ilk bakışta görünmüyordu.** `validPayload()` varsayılan e-postası sabitti (`ayse@example.com`) ve mail kanalını açan **yedi** senaryo aynı adresi kullanıyordu; tavan dosyanın ortasında doluyor, TASK-2.07'nin ilk senaryosu 2 yerine 1 e-posta görüyordu (sahte kırmızı). Çözüm mevcut senaryoları tek tek düzenlemek değil, **varsayılanı her çağrıda tekilleştirmek** oldu (`talep-${++payloadSeq}@example.com`) — adresin değeri hiçbir ölçümün konusu değil, konu olduğu senaryolar kendi adresini zaten açıkça yazıyor. Adresini açıkça yazan iki senaryoda (`onay-red@` / `ekip-red@`) tekilleştirme elle yapıldı. Bu, memory'deki "her senaryo kendi IP'sini taşır" disiplininin **ikinci sayaç için** eşidir ve dosya başlığına yazıldı.

**Kararlar:**
- **(a) + (b) birlikte, (c) hayır**: (c) — onayı bir doğrulama bağlantısına bağlamak — en sağlamı ama ILKELER'in 1. ekseniyle (Dönüşüm) doğrudan çatışıyor, yeni bir durum + saklanan jeton (yani **kişisel veri**) + aynı turda yasal metin revizyonu getiriyor ve pilot aşamadaki bir tanıtım sitesinin bugünkü hacmiyle orantısız. (a)+(b) bedeli üç dosya ve sıfır akış değişikliği.
- **Tavan 24 saatte 3**: meşru bir talep sahibine bir onay yeter; "gitmedi mi acaba" diye iki kez daha gönderen gerçek kullanıcı da kapsanır. Tavana takılmanın ziyaretçiye **hiçbir bedeli yok** — ekran onayı, kayıt ve ekip bildirimi değişmiyor, kırpılan yalnız ikincil kanal.
- **Alt-adresleme normalleştirilmedi** (`ad+etiket@…`, nokta varyantları): o normalleştirme farklı iki **gerçek** adresi aynı sayaca koyup meşru bir onayı düşürebilirdi. Bilinen artık olarak `route.ts` yorumunda yazılı; kalan yüzey (b) sayesinde **içeriksizdir**.
- **Yasal metin (`legal.ts`) bu turda DEĞİŞMEDİ** — M3 F3.2'nin tetiği (*"yeni bir hedef, yeni bir alan ya da yeni bir sağlayıcı"*) ateşlemiyor: yeni hedef yok, kayda yeni alan **yazılmıyor**, sağlayıcı aynı. Metnin yaşayan cümleleri tek tek kontrol edildi ve hiçbiri yanlışlaşmıyor: IP paragrafının öznesi *"IP adresiniz"*dir (*"iki yerde kullanılır"* iddiası IP'ye dairdir, e-postaya değil) ve İşleme amaçları listesi zaten *"Formun kötüye kullanılmasını önlemek: aynı adresten gelen talep sayısını sınırlamak"* diyor. Adres yalnız sunucunun geçici belleğinde tutuluyor, hiçbir kayda yazılmıyor. Metne cümle **eklenmedi** çünkü her yeni olgu cümlesi kendi mekanik çapasını ister (B-060 disiplini) ve tetik ateşlemediği hâlde 10. dal açmak kapsamı büyütürdü.
- docs/DECISIONS.md'ye eklendi: **Evet** (2026-09-23 — «Onay e-postasının alıcısı doğrulanmıyor: tavan + içeriksiz metin»)

**Kalan İşler:**
- Yok. Kapsam dışı kalan kardeş kalemler zaten ayrı bulgularda: uç sertleştirme (B-037), hız sınırı sayacının doğrulamadan önce koşması (B-020).

**Dosya Değişiklikleri:**
- `src/app/api/demo/route.ts` → `CONFIRM_LIMIT`/`CONFIRM_WINDOW_MS`/`CONFIRM_HITS` + `confirmCapped()` + `pruneConfirmHits()` eklendi; `toLeadEmail` `Promise<NotifyLead>` döndürüyor ve env kapısından sonra tavana danışıyor; çağrı yeri `notifyLead`'i yeniden türetmiyor; `NotifyLead` yorumu `skipped`'in ikinci anlamını yazıyor
- `src/content/mail.ts` → `text` parametreli fonksiyondan sabit metne döndü (`Merhaba,`); yorum yüzeyin neden kapatıldığını yazıyor
- `tests/api-demo.test.ts` → +5 test (yeni describe); `validPayload()` varsayılan adresi tekilleşti; iki mevcut senaryonun adresi ayrıştırıldı; onay metni iddiası ters çevrildi (`toContain(ad)` → `not.toContain(ad)`); dosya başlığına ikinci sayaç disiplini yazıldı

**Test Sonuçları:**
- **Batarya (tam kapsam, çapraz depo anahtarı tanımlı):** `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **216 geçti + 1 atlandı** (taban 211+1). Anahtarsız koşum **209 geçti + 2 atlandı** (taban 204+2) — *geçen* sayısı iki modda da tam **+5**, düşen yok. `api-demo.test.ts` 39 → **44 test**.
- **Kötüye kullanım sondası (ölçüm, uç seviyesinde):** aynı üçüncü adrese **altı** istek, her biri ayrı `X-Forwarded-For` (IP sayacı karışmasın diye) → **3 onay e-postası gitti, 3'ü tavana takıldı**; takılanların üçü de `notify_lead: "skipped"` yazdı, altısında da ziyaretçi `200` + `{ok, stored, mailed}` gördü ve ekip bildirimi **altı kez** gitti.
- **Ters çevirme — dört bozma, dördü kırmızı** (hepsi scratchpad kopyasından `cp` ile geri alındı, md5 her seferinde tur başıyla birebir):
  - **T1 — tavan söküldü** (`confirmCapped` çağrısı kaldırıldı): **2 kırmızı** (kötüye kullanım sondası + büyük/küçük harf senaryosu).
  - **T2 — BOŞ KAPSAM: onay hiç gönderilmiyor** (`toLeadEmail` koşulsuz `skipped`): **9 kırmızı**. Bu, kapının pozitif çapasıdır — hiçbir şey göndermeyen bir uç "tavan çalışıyor" ölçümünü bedavaya geçemiyor.
  - **T3 — serbest metin geri kondu** (selamlamaya `lead.name` enjekte edildi): **2 kırmızı** (adversarial metin senaryosu + TASK-2.07'nin tek-kaynak senaryosu).
  - **T4 — anahtar küçük harfe indirgenmiyor** (`toLowerCase()` çıkarıldı): **1 kırmızı**, tam da yazım-değiştirerek-atlatma senaryosu.
- **Tip ve derleme:** `docker compose exec web npx tsc --noEmit` çıkış **0**; `docker compose build web-prod` çıkış **0**.
- **Beş ölçüm betiği KOŞTURULMADI — kapsamı bu turda boş.** Değişen üç dosyanın hiçbiri render edilen yüzeye girmiyor: `src/content/mail.ts`'i **yalnız** `api/demo/route.ts` import ediyor (ölçüldü: `src/` genelinde başka tüketici yok, kalan iki eşleşme yorum satırı), `route.ts` ise bir API ucu, sayfa değil. a11y / mobile-audit / font-guard / scan / perf'ün ölçtüğü 16 sayfanın çıktısı bu turda değişmedi; geçerli taban TASK-2.19'un koşumudur.
- **ÖLÇÜLEMEYEN — canlı gönderim sondası yapılmadı ve yapılamazdı.** Tavan yalnız `RESEND_*` tanımlıyken işler; yerelde anahtar yok (`.env` beş depo anahtarı taşıyor, `RESEND_API_KEY` Vercel'de ve `--sensitive`). Gerçek bir sonda üçüncü bir adrese **gerçek e-posta** göndermek demekti — yani tam da engellediğimiz davranış. Sayacın **istekler arası yaşadığı** olgusu ayrıca ölçülmedi çünkü aynı modüldeki kardeşi `HITS` için canlı olarak zaten ölçülmüştü (TASK-1.06 / B-037: önizlemede 6. istek `429`); `CONFIRM_HITS` birebir aynı modül kapsamında tanımlı. **Bilinen sınır:** sayaç bellek içi ve örnek başınadır — `HITS` ile aynı bilinçli tercih (BULGULAR → Bilinçli Tercihler).

---

---

**Oluşturulma:** 2026-09-23 (verify-phase, UAT senaryo 26)
