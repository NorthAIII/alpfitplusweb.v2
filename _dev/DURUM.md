# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — TASK-2.14 ✅: Görsel denetimin ad dalı artık temizlik tablosundan türüyor (52 ad parçası + 13 avatar baş harfi; elle liste yok, hedef tarafı çıkarılıyor). İki-tam-sözcük kalıbı **kaldırılmadı, ikincil kaba ağa indirildi** — TASK-2.13'ün kendi kendini doğrulayan kapısı ona dayanıyor. Denetimin gördüğü kütlenin **bayat** olduğu ölçüldü ve düzeltildi (avatar senkronu öncesi 6 baş harfi, sonrası 0). İki boş-kapsam tabanı kondu. Kontrol gruplu sonda: B-018'in tarihsel tablosunda eski denetim çıkış 0 + sızıntılı görsel, yeni denetim çıkış 1. Çıktı 7/7 birebir aynı. Batarya 163 → 171.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; `destek@alpfitplus.com` test postası alıyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ (2026-09-23: bir task iptal, üç hedefli düzeltme) · task çalıştırma 13/19 (TASK-2.01 ✅, TASK-2.02 ✅, TASK-2.03 ❌ iptal, TASK-2.04 ✅, TASK-2.05 ✅, TASK-2.06 ✅, TASK-2.07 ✅, TASK-2.08 ✅, TASK-2.09 ✅, TASK-2.10 ✅, TASK-2.11 ✅, TASK-2.12 ✅, TASK-2.13 ✅, TASK-2.14 ✅). Sıra TASK-2.15'te.
**Faz Dokümanı:** `phases/PHASE-2.md` 🔄 (bölme çocuğu: `phases/PHASE-2-ARASTIRMA.md`) · önceki faz: `phases/PHASE-1.md` ✅

---

## Aktif Versiyon

**Versiyon:** v2.0
**Hedef:** Site alan adına geçer — metin tonu, önizleme yayını + lead hattı + analitik, kalite kapıları otomatik, alan adı geçişi (20 adres 301).
**Versiyon Sonu Durumu:** içerik_fazları

<!-- Versiyon geçişlerinde güncellenir. discuss-phase versiyon sonu tespitinde bu alanı okur. -->
<!-- Değerler: içerik_fazları | teknik_borç | senaryo_testi | prd_review_bekliyor -->
<!-- - içerik_fazları: Normal faz döngüsü devam ediyor -->
<!-- - teknik_borç: Teknik borç kapatma fazı aktif -->
<!-- - senaryo_testi: Senaryo testi fazı aktif -->
<!-- - prd_review_bekliyor: Her iki sabit faz tamamlandı; prd-review bekleniyor / yarım kalmış (prd-save ile bölünmüş) / bilinçli ertelenmiş (teslim DevFlow-dışıysa go-live sonrasına) — üçünde de sıradaki komut /devflow:prd-review olarak önerilir, çalıştırılmaz -->

---

<!-- KURAL: Aşağıdaki üç bölüm (Aktif Task · Task Durumu · Son Task Özetleri) ilk kickoff'ta doldurulamaz — henüz task yoktur. O hâlde içerikleri `— yok` kalır ve **bölümler SİLİNMEZ**; ilk task'le dolarlar. Bu bir template kalıntısı DEĞİLDİR — audit'in "placeholder sızıntısı" kalemi bu üç bölüme boşken uygulanmaz (kanon: .claude/commands/devflow/lib/audit-mekanik.md → Placeholder sızıntısı, koşullu kalem). -->

## Aktif Task

**Task:** TASK-2.15 — Yasaklı iddia sözlüğü + denetimin iddia dalı (B-018 kapanır)
**Durum:** ⬜ Bekliyor
**İlerleme:** TASK-2.14 kapandı ve arşive gitti; denetimin **ad** dalı artık tablodan besleniyor ve kontrol gruplu sondayla körlüğün kapandığı gösterildi. Geriye **iddia dalı** kaldı — B-018 orada kapanır. Sıradaki adım `/devflow:run-task`.
**Not:**
- ⚠️ **Yeni yayın kapısı var (TASK-2.11):** bir kalemi `yolda`/`sonra`'dan `simdi`'ye taşımak, o kalemi anan cümleler `upcomingCapability`/`stageNote` çağırdığı için **derlemeyi durdurur** — bilinçli fail-closed, cümleler elden geçirilsin diye (`docs/DECISIONS.md` 2026-09-23). Ters yön (yeni kalem `yolda`'ya eklemek) serbesttir.
- ⚠️ **TASK-2.15'in ön ölçümü hazır — denetimin iddia dalı HÂLÂ YOK.** TASK-2.14 ad dalını kapattı; yüzde, ciro, üstünlük, tarih ve yol-haritası kalemleri "kalıp kaçırdı" değil **hiç kontrol edilmiyor** (B-044 kalem 3: 21 dizge, 20'si kör). Sözlüğün evi ölçülmüş bir kısıt: `research/lib/` — araştırma konteyneri yalnız `research/`'ü, `web` konteyneri deponun tamamını görüyor, ortak gördükleri tek dizin orası (M6 F6.4 aynı dosyayı devralır).
- **TASK-2.14'ün bıraktığı desen — TASK-2.15 devralır:** yasaklı küme **türetilir, elle yazılmaz**; tablonun/kaynağın hedef tarafı çıkarılır (denetim kendi çıktısını sızıntı saymaz); kapıya **alt sınır** konur (`MIN_FORBIDDEN_PARTS/INITIALS` + `MIN_AUDIT_VALUES` — kapsam çökerse bedava yeşil koşmaz); kapı `tests/iddia-metinleri.test.ts`'e bağlanır. ⚠️ Araştırmanın uyarısı iddia dalı için geçerli: `₺…B/ay` · `+%NN` · "en hızlı" kalıpları ürünün **meşru** gösterge verisine de değer — ayraç *projeksiyon/üstünlük/büyüme kıyası* yasak, nötr gösterge serbest.
- **Görsel hattının bugünkü hâli:** `DROP_NODES` yedi ekranın **dördünü** kapsıyor (antrenör · raporlar · takvim · üye-telefon), `SHELL_DROP_NODES` yedisine birden biniyor. Denetim **üç dallı**: tablo-ad-parçası · tablo-avatar-baş-harfi · ikincil iki-tam-sözcük kalıbı (yalnız sonuncusu `AUDIT_ALLOW`'a tabi — bilinçli). `AVATAR_SELECTOR`'a `.av` **eklenmedi**: 25 düğüm haritanın dışında (B-044 k.2) ama eklemek çıktı görsellerini değiştirirdi, o iş bu fazın kapsam dışında. Ölçüm tabloları ve sonda çıktıları `tasks/archive/TASK-2.14.md`.
- ⚠️ **Ürün görseli alt metni artık mekanik bir kapıya bağlı:** `tests/iddia-metinleri.test.ts` `research/lib/screen-cleanup-v2.mjs`'i **import ediyor** ve "alt metin, hattın o ekrandan düşürdüğü kartı anamaz" kuralını koşuyor. Düşürme tablosuna kalem eklerken alt metinleri de gözden geçir, yoksa batarya düşer (bilinçli).
- ⚠️ **`nextVersion` aranmasın — bilinçle açılmadı** (`docs/DECISIONS.md` 2026-09-23); sitede sürüm numarası iddiasının çapası `../Alpfit.v1/_dev/PRD/VERSIONS.md`'dir.
- **Yerel üretim provası (3100) artık hedefsiz** (TASK-2.02): `web-prod`'a `LEAD_STORE_URL` / `LEAD_FILE_PATH` / `RESEND_API_KEY` açıkça **boş** veriliyor ve uç geçerli talebe `503 no-sink` dönüyor. Bu **doğru** davranıştır (M3 F3.1) — 3100'e POST atıp `stored:true` bekleyen bir iş önce `docker-compose.yml`'deki `web-prod` yorumunu okusun; gerçek depoya karşı prova `--profile lead` + `http://lead-store:8090` ile açılır. Derleme sonrası kalıcı `ls /app/.env` kapısı **kurulmadı**, M6 F6.2'ye devredildi.
- **Yasal metin için bağlayıcı ölçüm (TASK-2.01, 2026-09-22):** ölçüm sunucusunun erişim kaydı **ham IP tutuyor** (592.183/592.375 satır, 5.580 benzersiz IP) ve **bugün hiçbir saklama sınırı yok** (155 MB / 603.025 satır / 31 gün, rotasyon dosyası 0); üçüncü tarafa gitmiyor. Yani metin *"IP tutulmaz"* diyemez ve **hiçbir süre yazamaz** — cümlenin son hâli TASK-2.17'nin işi.
- **Rotasyon tanımlı ama konteynere inmiyor:** `daemon.json` `50m × 3` diyor, `bunker-nginx` ondan önce oluşturulduğu için kural uygulanmıyor. Düzeltme **bu reponun işi değil** (evi `altyapi/vps`) — `BULGULAR.md` → Gelen Kutusu'nda. Yapılırsa ≈ 30 günlük bir pencere doğar ve metin o gün bir süre yazabilir hâle gelir.
- **TASK-2.20 (MX kayıtları) kullanıcı eliyle ilerler** — DNS adımı Squarespace'te kullanıcıdadır; faz yönergeyi yazar, ölçer ve gerçek test postasıyla doğrular. Kullanıcı kaydı girmezse task ⏸️ duraklar, faz kilitlenmez.
- **Tarayıcı katmanlı kriterler `kanal: UAT` işaretli** (TASK-2.04 · 2.05 · 2.06 · 2.20; ilk üçü ölçülerek kapandı): projenin otomatik katmanı gerçek tarayıcı yerleşimini ve odağını ölçmüyor; kalıcı tarayıcı betiği bilinçli olarak "Kalite kapıları otomatik" fazına bırakıldı.
- **Faz 2 kapsamı dokuz bulgu:** B-029 · B-018 · B-024 · B-011 · B-058 · B-034 · B-055 · B-060 · B-059'un onay-e-postası ayağı (yan kazanç B-040). Tam gerekçe ve kapsam dışı listesi `phases/PHASE-2.md` → Kapsam Tartışması.
- **Sıra değişti:** "Görsel ve mobil iyileştirme" fazı alan adı geçişinin **önüne** alındı (kullanıcı kararı) — ölçülmüş AA kontrast ihlalleri (B-032) canlıya çıkmasın. B-032 · B-033 · B-031 o faza atandı.
- **Kullanıcı gözü bekleyen iki kalem (Faz 1 milestone'unun doğrulama ayakları, kapanışı engellemedi):** (1) `DEMO_TO`'ya giden e-postanın **gelen kutusunda mı spam'de mi** olduğu; (2) **Umami panelinin arayüzünde** v2 kaydının gözle görülmesi. İkisinin de ürün tarafı ölçüldü; kayıt `phases/PHASE-1.md` → Milestone kapanış notu.
- **Canlı depodaki test kayıtları:** `leads_preview` 15 kayıt (Faz 1'in bilinçli test turları; `leads` 2 → değişmedi). 12 aylık saklama işi siler. ⚠️ IP tuzu döndürülünce bu kayıtların `ip_hash`'i yeni kayıtlarla karşılaştırılamaz olur (bilinçli, `docs/DECISIONS.md`).
- **Yerel `lead-store` konteyneri hâlâ ayakta** (ölçüldü 2026-09-23: **88** test kaydı; TASK-2.07 üçü ekledi) — kaldırma/erişim komutları `memory/yerel-lead-deposu-docker-profili.md`.
- **Onay e-postası kodda açık ama yerelde anahtarsız:** `.env` yalnız beş depo anahtarı taşıyor, `RESEND_API_KEY` Vercel'de ve `--sensitive` (geri okunamaz). Gerçek gönderim gerektiren bir iş, kasa yordamıyla (`memory/anahtar-kasasi-config-alpfit.md`) dar yetkili geçici anahtar üretip iş bitince siler — TASK-2.07 böyle ölçtü.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 2.01 | TASK-2.01 — Sunucu ölçümü: nginx erişim kaydı + `.env` parmak izi (B-024, B-058) | ✅ Tamamlandı |
| 2.02 | TASK-2.02 — `.dockerignore` + `web-prod` bilinçli env (B-058) | ✅ Tamamlandı |
| 2.03 | TASK-2.03 — İki anahtarın döndürülmesi (B-058) | ❌ İptal — ön koşul ölçümle düştü (2026-09-23) |
| 2.04 | TASK-2.04 — Fiyat sayfasının mobil ana çağrısı 52 px'e döner (B-034) | ✅ Tamamlandı |
| 2.05 | TASK-2.05 — Demo formunda odak ve durum mekaniği (B-055 b·c·d·e·f·g) | ✅ Tamamlandı |
| 2.06 | TASK-2.06 — Alan bazlı hata metni ve `aria-invalid` işareti (B-055 a) | ✅ Tamamlandı |
| 2.07 | TASK-2.07 — Talep sahibine onay e-postası + `notify_lead` (B-059) | ✅ Tamamlandı |
| 2.08 | TASK-2.08 — Yetenek ve yol haritası tek kaynağı (B-029, B-040) | ✅ Tamamlandı |
| 2.09 | TASK-2.09 — Beş karşılıksız yetenek cümlesi düzeltilir (B-029) | ✅ Tamamlandı |
| 2.10 | TASK-2.10 — `/ozellikler` ve Kurucu Programı sabitten okur (B-040) | ✅ Tamamlandı |
| 2.11 | TASK-2.11 — Chat, SSS, fiyat ve karşılaştırma sayfası sabitten okur (B-040, B-014) | ✅ Tamamlandı |
| 2.12 | TASK-2.12 — Riskli alt küme taraması (B-029 kapanır) | ✅ Tamamlandı |
| 2.13 | TASK-2.13 — Ürün görseli temizliği: ad, Kampanyalar, Churn kartı (B-018) | ✅ Tamamlandı |
| 2.14 | TASK-2.14 — Denetimin ad dalı tablodan beslenir (B-018) | ✅ Tamamlandı |
| 2.15 | TASK-2.15 — Yasaklı iddia sözlüğü + denetimin iddia dalı (B-018 kapanır) | ⬜ Bekliyor |
| 2.16 | TASK-2.16 — Yasal metinde işlenen veri gerçeği + onay kapsamı (B-024) | ⬜ Bekliyor |
| 2.17 | TASK-2.17 — Ölçüm ve aktarım beyanları (B-024 kapanır) | ⬜ Bekliyor |
| 2.18 | TASK-2.18 — Yasal beyan testi — depo içi yedi olgu (B-060) | ⬜ Bekliyor |
| 2.19 | TASK-2.19 — Yasal beyan testi — çapraz depo "12 ay" dalı (B-060 kapanır) | ⬜ Bekliyor |
| 2.20 | TASK-2.20 — KVKK başvuru adresi: MX kayıtları ve test postası (B-011) | ⬜ Bekliyor |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

> Faz 1'in 19 task'ı `phases/PHASE-1.md` → Task Listesi'nde, dokümanları `tasks/archive/`te.

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-2.14 — Denetimin ad dalı tablodan besleniyor, körlük kontrol gruplu ölçümle kapandı

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.14.md`

**Özet:**
- **Denetim artık temizliğin varsayımını paylaşmıyor.** Yasaklı küme `REPLACEMENTS`/`INITIALS`'ın **kaynak** tarafından türüyor — 52 ad parçası + 13 avatar baş harfi, elle yazılmış liste yok; tabloya satır girdiği gün küme kendiliğinden büyür. Tablonun **hedef** tarafı çıkarılıyor, çünkü denetim kendi çıktısını sızıntı sayamaz: çıkarma olmasaydı `Plus` (⊂ "Alpfit Plus") yedi ekranı birden kırmızıya çekerdi; `Zehra` ve `Cansu` de bilinçle korunmuş ilk adlar. Ad parçası **alt dize**, baş harfi **tam jeton** aranıyor (`SA` ⊂ `SAHİL` kapıyı kullanılamaz kılardı).
- **İki-tam-sözcük kalıbı kaldırılmadı — ikincil kaba ağa indirildi, gerekçesi yazılı.** Tabloya **hiç girmemiş** bir adı yalnız o dal görebilir, ve TASK-2.13'ün kendi kendini doğrulayan kapısı ona dayanıyor (`'Öğrenci Tutma'` izin satırı türetilerek çıkarılmıştı). Kaldırmak o kapıyı sessizce sökerdi. `AUDIT_ALLOW` **yalnız** bu dalı kapatıyor; tablo dallarında izin yok — yanlış alarmın çaresi izin satırı değil tablonun düzeltilmesi (bilinçli fail-closed).
- **İki devralınan varsayım ölçümle düzeltildi.** (1) Task "INITIALS'ın kaynak tarafı da kapsanır" diyordu; olduğu gibi uygulansa `EK` yasaklanır ve iki ekran kırmızıya düşerdi — ölçüldü ki `takvim.html:166`'daki `EK` tam da "Melissa V." (→ **"Ege K."**) yanında, yani hedefin kendi baş harfi, sızıntı değil. Ad parçalarıyla **aynı** kural (hedef tarafı kazanır) çözdü. (2) Denetimin gördüğü kütle **bayattı**: `values` avatar senkronundan **önce** toplanıyordu — antrenör senkron öncesi 6 baş harfi raporluyor, sonrası 0. Toplama tüm mutasyonların sonuna alındı; `.av` sınıfına dokunulmadı (B-044 k.2, kapsam dışı — eklemek çıktıyı değiştirirdi).

**Test:** `npm test` **171 geçti + 1 atlandı** (taban 163+1; net **+8 senaryo**, yeni dosya açılmadı). `npx tsc --noEmit` çıkış 0. Hat yeşil (7 `.webp`, çıkış 0) ve **çıktı 7/7 `md5sum` ile `public/product/` ile birebir aynı** — kıyas hatırlanmadı, değişiklikten önce aynı dizine taban koşumu alındı ve o da 7/7 aynıydı. **Kapı beş sondayla sınandı, beşinde de kaynak değil GİRDİ bozuldu** (`../Alpfit.v1` hiç değiştirilmedi; `research/lib`'in kopyası `-v` ile bağlandı, çıktı ayrı dizine yazıldı; test sondasında dosya `md5sum -c` + `diff -q` ile birebir geri yüklendi): *(1) bozuk girdi, kontrol gruplu* — B-018'in tarihsel tablosu geri konunca **eski** denetim çıkış **0** verip sızıntılı `grup.webp`'i üretiyor (`fe0ba19…` ≠ temiz `3a4caac…`), **yeni** denetim aynı girdide `«Gizem» ⊂ "Gizem Ö. · 17:00 · 60 dk"` deyip çıkış **1**, görsel ve `manifest.json` **yazılmadı**; *(2) avatar dalı* — `AVATAR_SELECTOR` körelince antrenör 5 baş harfiyle kırmızı, çıkış 1; *(3) boş kapsam, tablo* — `REPLACEMENTS` boşalınca **import anında** `parça 16/40`, **0 dosya**, çıkış 1; *(4) boş kapsam, girdi* — metin yürüyüşü kırılınca `DENETİM KAPSAMSIZ — 0 metin değeri`, **ilk ekranda**, **0 dosya**, çıkış 1; *(5) test bloğu* — iki tablo dalı sökülünce batarya **2 kırmızı**, ⚠️ türetme ve boş-kapsam ayakları yeşil kaldı (doğru: onlar bağlantıyı değil `deriveForbidden`'ı ölçüyor) ve kontrol grubu olarak **silinmedi**. Sonda sonrası batarya yeniden 171+1, hat yeşil, çıktı yine 7/7 birebir. Kaynağa karşı yanlış alarm: 7 ekran, **859** metin değeri, tablo dallarından **0 vuruş**. ⚠️ **Beş ölçüm betiği koşulmadı ve gerekçesi ölçüldü:** `src/` ve `public/` altında tek bayt değişmedi (`git status --short -- src public` boş), değişen üç dosya `research/` ve `tests/` altında.

---

### TASK-2.13 — Ürün görselinin dört sızıntısı kapandı, devralınan bir alt metin çürütüldü

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.13.md`

**Özet:**
- **B-018'in dört kalemi de görüntüden kalktı.** "Gizem Ö." → "Yasemin U." (kaçıran şey tablo değil **kalıptı** — eşleme tam ada yazılmış, metinde kısaltılmış hâl geçiyordu); "Kampanyalar" menü girdisi **ekran başına değil ortak kabuk kuralı** olarak yazıldı (`SHELL_DROP_NODES`) ve **7/7** ekranda tam bir düğüm düşürdü; "Yenileme & Churn" kartı düştü (ızgara 6 → 5); **dördüncü kalem "Öğrenci Tutma" kartı** da düştü — TASK-2.12 metin tarafını kapatıp görüntüyü buraya devretmişti. Hat yeşil (7 `.webp`, çıkış 0, sızıntı yok), yedi çıktı **gözle okundu**. **Atom kapanmadı** — kök neden denetimde (TASK-2.14/2.15).
- **Devralınan alt metin ölçümle çürütüldü — asıl kazanç bu.** TASK-2.12 antrenör görselinin alt metnini *"aylık performans, **haftalık doluluk** ve **ciro kırılımı**"* yapmış ve o iki ifadeyi `toContain` ile **çivilemişti**. Ölçüldü: o iki kart bu görüntüde **TASK-14.06'dan beri yok** (aynı hat düşürüyor) ve ikisi de ürünün kendi kodunda reddedilmiş kalemler — yani düzeltme bir karşılıksız iddiayı **ikisiyle** değiştirip sabitlemişti. Metin gerçekte duran iki yüzeye çekildi ve **kapı türetilen bir kurala çevrildi**: *alt metin, hattın o ekrandan düşürdüğü hiçbir kartı anamaz* (çapalar `research/lib/`ten okunuyor).
- **Düşürme kendi kendini doğrulayan kapıya dönüştü.** `AUDIT_ALLOW`'daki ölü `'Öğrenci Tutma'` izin satırı v1'den **türetilerek** çıkarıldı; tamlama ad kalıbına uyduğu için kural kalkarsa denetim onu sızıntı sayıyor ve **üretim duruyor** (sondayla kanıtlandı, çıkış 1). ⚠️ Ama boş-kapsam sondası sınırı da verdi: **denetim üç kalemden yalnız 1'ini görüyor** — "Kampanyalar" tek sözcük, "Yenileme & Churn" `&` yüzünden görünmez; bugün kapatılan iki kalemin arkasında kapı **yok** (TASK-2.15'in ölçülmüş gerekçesi).

**Test:** `npm test` **163 geçti + 1 atlandı** (taban 160+1; net **+3** — bir yanlış senaryo silindi, dört yeni eklendi, yeni dosya açılmadı). `npx tsc --noEmit` çıkış 0. **Ürettiğim kapı dört sondayla sınandı** (dördünde de kaynak değil **girdi** bozuldu; hat sondaları kopya tabloyu `-v` ile bağlayıp çıktıyı ayrı dizine yazdı, depoya hiç dokunulmadı; test sondalarında iki dosya yedeklenip `md5sum -c` + `diff -q` ile birebir geri yüklendi — 9 dosya OK): *düşürme kuralı kalkarsa* → hat `DENETİM BAŞARISIZ — ad sızıntısı: ["Öğrenci Tutma"]`, **çıkış 1**; *kabuk çapası körelirse* → **ilk ekranda** `0 eşleşme`, **çıkış 1** (fail-closed); *alt metin kapısı* → TASK-2.12'nin tam metni geri yazıldı, **2 kırmızı** (yakalayan çapa `Doluluk`, tasarladığımdan bir kalem sıkı); *boş kapsam* → **2 kırmızı**, ⚠️ asıl döngü yeşil kaldı (bakacak çapası yok) ve kontrol grubu olarak **silinmedi**. Sonda sonrası batarya yeniden 163+1. **Sıra tuzağı negatif kontrolü:** 7 gerçek kaynak dizgesinin 7'si doğru, melez ad (`Yasemin Örge`) **0**; ⚠️ sondanın kendisi **çapa sondasıyla** sınandı (eşleme çıkarılınca melezi görüyor). Hat: **15 düşürme** (kabuk 7 + ekran-özel 8). **Serviste doğrulandı** (3100, imaj HEAD'ten yeniden derlendi): üç rota 200, görseller yeni bayt boyutlarıyla 200, çürütülen alt metin üç rotada **0**. **Tarayıcıda ölçüldü** (3100, 1440×900 **ve** 390×844): Roller → **Diyetisyen** sekmesi (`Roles.tsx:14` → `diyetisyen: SHOTS.antrenor`), alt metin birebir yeni, iki çürütülen ifade **false**, **iki yüzeyde de konsol temiz** — şarttı, `Roles` istemci bileşeni. `a11y` 8 rota **TOPLAM SORUN 0**; `mobile-audit` **9/9 yatay kaydırma yok**, dokunma hedefi **157** (taban birebir); `font-guard` 16 sayfa / **81.118** karakter (taban birebir); `scan` 390×844 konsol temiz (`/` 20 · `/ozellikler` 16 kare). **`perf` koşuldu** (görsel değişti): ana sayfa masaüstü **143 KB** / LCP **84 ms** / CLS **0,004**, mobil **133 KB** / LCP **60 ms** / CLS **0** — M6 çizgisi 144 KB · 133 KB · LCP 96 ms · CLS 0–0,005, **regresyon yok**. Görsel toplamı 275.172 → **264.962 B** (−10.210 B); boyutlar değişmedi, `uye-telefon.webp` bayt bayt aynı.

---

---

<!-- KURAL: **Detay:** yolu task'ın DURUMUNA bağlıdır. ✅ Tamamlandı ise task arşive taşınmıştır (run-task Adım 7) ve yol `tasks/archive/…`'dır; task hâlâ `_dev/tasks/` altındaysa (🔄 / ⏸️ / 🔴) canlı yol yazılır. Özet Adım 5'te yazılır, taşıma Adım 7'de yapılır — sırayı izleyip tamamlanan task'a canlı yol yazmak, commit anında kırık bir referans bırakır ve bir sonraki audit turu onu "kırık dosya referansı" kalemi olarak açar. -->

---

<!-- KURAL: Sadece son 2 task özeti tutulur, daha eskileri silinir (gerçek silme — HTML comment yasak). -->
<!-- KURAL: Sadece aktif fazın task'leri gösterilir. Geçmiş fazların bilgileri phases/ klasöründedir. -->
<!-- KURAL: "Son Tamamlanan Faz", "Son Tamamlanan Sprint" gibi ek özet bölümleri EKLEME — faz durum özeti PHASES.md'de, faz detayları PHASE-N.md'de. DURUM yalnızca aktif durum + son 2 task özeti. -->
<!-- KURAL: Faz alt-fazlarının (verify-plan/plan/research/discuss) ayrı oturum özetlerini DURUM'a yazma — onlar faz dokümanına ait. -->
<!-- KURAL: Üç proje-özgü yerleşim (bilinçli, audit-docs 2026-09-22 — template'e çekilmez): (1) task ADI `###` başlığında durur, ayrı `**Konu:**` alanı AÇILMAZ — alan eklemek adı iki yerde tutar ve drift doğurur; (2) `**Test:**` alanı ilk task'ten beri (TASK-1.01, 011b8ac) her özette var ve yerleşik proje desenidir — ölçüm rakamı kapanışın kanıtıdır, silinmez; (3) Hızlı Erişim dört satırdır, dördüncüsü `BULGULAR.md`'dir (template üç satır tanımlar). -->

## Duraklatma Notu

<!-- Bu bölüm sadece /devflow:pause kullanıldığında doldurulur. Devam edildiğinde veya iş iptal edildiğinde silinir. -->

> ⏸️ **Duraklatma yok** — Aktif çalışma devam ediyor.

<!-- Duraklatma durumunda format:
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** [task çalıştırma / planlama / review / quick / vb.]
> **Detay:** [Nerede kalındı, ne yapılacak]
> **Handoff:** [Task dokümanında mı, QUICK dosyasında mı, burada mı?]
-->

## Hızlı Erişim

**Aktif Task:** `tasks/TASK-2.15.md` ⬜ — Yasaklı iddia sözlüğü + denetimin iddia dalı (B-018 kapanır)
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (araştırma detayı: `phases/PHASE-2-ARASTIRMA.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
