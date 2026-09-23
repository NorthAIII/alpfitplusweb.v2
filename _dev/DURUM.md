# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — TASK-2.10 ✅: Yol haritasının **iki bileşen-içi kopyası kalktı**; `/ozellikler`'in üç kolonu ve Kurucu Programı'nın üç satırı `CAPABILITIES`'ten okuyor (B-040 kanıt komutu 15 → 10 satır, iki hedef ev **0**). Artık B-029'un dört kalemi ziyaretçiye **"yolda" olarak görünüyor**. Devralınan `nextVersion` devri ölçümle çürütüldü: ürünün sürüm haritası `yolda`'yı v1.5'in kapsamı saymıyor — alan açılmadı, başlıklar `STAGE_LABEL`'dan. Batarya 115 → 121.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; `destek@alpfitplus.com` test postası alıyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ (2026-09-23: bir task iptal, üç hedefli düzeltme) · task çalıştırma 9/19 (TASK-2.01 ✅, TASK-2.02 ✅, TASK-2.03 ❌ iptal, TASK-2.04 ✅, TASK-2.05 ✅, TASK-2.06 ✅, TASK-2.07 ✅, TASK-2.08 ✅, TASK-2.09 ✅, TASK-2.10 ✅). Sıra TASK-2.11'de.
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

**Task:** TASK-2.11 — Chat, SSS, fiyat ve karşılaştırma sayfası tek kaynaktan okur (B-040, B-014)
**Durum:** ⬜ Bekliyor
**İlerleme:** TASK-2.10 kapandı ve arşive gitti; `/ozellikler` ile Kurucu Programı artık `CAPABILITIES`'ten okuyor. Sıradaki adım `/devflow:run-task`. ⚠️ **Kalan dört ev TASK-2.11'in kapsamı** — B-040'ın kanıt komutu bugün **10 satır / 4 dosya** dönüyor; bunun **3'ü `product.ts`'in kendisidir (meşru tek kaynak) ve sayılmaz**, kapanış ölçütü kalan **7 satırın 0'a düşmesi**: `faq.ts` 3 · `chat.ts` 2 · `karsilastirma.ts` 2. Ayrıca `fiyat/page.tsx`'in `NOT_INCLUDED` listesi ve `chat.ts`'in modül sayımı (B-014) aynı task'ta. ⚠️ **`nextVersion` aranmasın — bilinçle açılmadı**; TASK-2.08'in devri ölçümle çürütüldü (`docs/DECISIONS.md` 2026-09-23), sitede sürüm numarası iddiasının çapası `../Alpfit.v1/_dev/PRD/VERSIONS.md`'dir.
**Not:**
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
| 2.11 | TASK-2.11 — Chat, SSS, fiyat ve karşılaştırma sayfası sabitten okur (B-040, B-014) | ⬜ Bekliyor |
| 2.12 | TASK-2.12 — Riskli alt küme taraması (B-029 kapanır) | ⬜ Bekliyor |
| 2.13 | TASK-2.13 — Ürün görseli temizliği: ad, Kampanyalar, Churn kartı (B-018) | ⬜ Bekliyor |
| 2.14 | TASK-2.14 — Denetimin ad dalı tablodan beslenir (B-018) | ⬜ Bekliyor |
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

### TASK-2.10 — `/ozellikler` ve Kurucu Programı tek kaynaktan okuyor (B-040)

**Durum:** ✅ Tamamlandı — 2026-09-23

**Detay:** `tasks/archive/TASK-2.10.md`

**Özet:**
- **Yol haritasının iki bileşen-içi kopyası kalktı.** `/ozellikler`'in üç kolonu ve Kurucu Programı kartının üç durum satırı artık `product.ts` → `CAPABILITIES`'ten okuyor; elle yazılmış 18 kalemlik dizi ve iki düzyazı cümle silindi. B-040'ın kanıt komutu **15 → 10 satır / 6 → 4 dosya**, iki hedef ev **0**. Ayrışmanın kendisi de kapandı: *"Kurumsal üyelik"* dört kopyanın yalnız birindeyken artık **iki yüzeyde de** görünüyor. Görünüm değişmedi — kolon tonu (`STAGE_TONE`) bileşende kaldı, çünkü Tailwind sınıfı içerik değildir.
- **Asıl kazanç görünürlük.** `yolda` kademesi TASK-2.08/2.09'da 3 → 7 kaleme çıkmıştı ama site hâlâ 3'ünü gösteriyordu. Artık **B-029'un dört karşılıksız iddiası ziyaretçiye "yolda" olarak görünüyor** — yeşil ✓'li modül listesinde değil, kendi etiketli kolonunda. Sayfanın *"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"* taahhüdü yapısal olarak karşılanır oldu.
- **Devralınan `nextVersion` devri ölçümle çürütüldü — alan açılmadı.** Plan kartın orta satırına `"v1.5 yolda"` yazdıracaktı; bağlamadan önce ürünün sürüm haritası okundu (`../Alpfit.v1/_dev/PRD/VERSIONS.md`, kendi beyanıyla *source of truth*): ürünün **v1.5**'i `yolda` kademesinin yalnız **ilk üçünü** içeriyor, **v2**'si `sonra`'nın **beşini de birebir**, ama sonradan taşınan **dört B-029 kalemi haritanın hiçbir satırında yok**. Yedisine birden "v1.5" demek B-029'un ta kendisi olan çapasız iddiayı yeniden üretirdi; alt iki başlık sürüm numarası değil `STAGE_LABEL` taşıyor. Kural memory'ye, karar `docs/DECISIONS.md`'ye yazıldı (aynı günün 7. kararını geçersiz kılarak).

**Test:** `npm test` **121 geçti + 1 atlandı** (taban 115+1; +6 senaryo — `tests/capabilities.test.ts`'e tüketici ayağı). **Ürettiğim kapı iki sondayla sınandı** (ikisinde de kaynak değil **girdi** bozuldu; üç dosya scratchpad'e yedeklendi, `diff -q` ile birebir geri yüklendi): *bozuk girdi* — kolona sabiti atlayan elle bir kalem yazıldı → **1 kırmızı**, doğru testte; TASK-2.08'in 23 testi ve kardeş dosyanın ayağı bu sondada **yeşil kaldı** (sabit doğruyken tüketici ayrışabilir — yeni kapının gerekçesi budur). *Boş kapsam* — `yolda`+`sonra` boşaltıldı → **12 kırmızı**; kritik gözlem: bu sondada **iki "atlayan kalem taşımıyor" ayağı da yeşil kaldı** (aranacak etiket kalmayınca kapı hiçbir şeye bakmadan PASS basıyor) ve fail-open'ı `yasaklı etiket listesi dolu` yakaladı. Sonda sonrası batarya yeniden 121+1. `npx tsc --noEmit` çıkış 0. Üretim derlemesi builder katmanında hatasız, **23 rota** (taban birebir). **Serviste doğrulandı** (3100): `/ozellikler` yol haritası **24 kalem = 12+7+5**, sabitle sayı ve sıra birebir; kart **3 satır** (`v1 hazır` · `Yolda` · `Yol haritasında`); eski iki elle yazılmış cümle **0**, `"v1.5"` **0**. `a11y` 8 rota **TOPLAM SORUN 0**; `font-guard` 16 sayfa / 81.119 karakter, kümede olmayan karakter yok; `mobile-audit` **9/9 yatay kaydırma yok**, iki yüzeyde taşan eleman 0, dokunma hedefi **157** (taban birebir); `scan` 390×844 konsol temiz (`/` 20 kare · `/ozellikler` 16 kare). ⚠️ `perf` koşulmadı — yeni varlık/istek yok, ağırlık farkı `/` +483 B · `/ozellikler` +1.565 B.

---

### TASK-2.09 — Beş karşılıksız yetenek cümlesi: dördü düzeltildi, biri çürütüldü (B-029)

**Durum:** ✅ Tamamlandı — 2026-09-23
**Detay:** `tasks/archive/TASK-2.09.md`

**Özet:**
- **Sitenin ürüne uymayan dört cümlesi düzeldi, tonu değişmeden.** Üye 360 artık "ölçüm grafiği ve diyetisyen notu **tek ekranda**" demiyor — ikisi de üründe **var** ama başka ekranlarda (üyenin mobilinde, diyetisyen modülünde); panelin kendi "Yakında" kutusu bunu zaten yazıyordu. İptal eşiği "**siz belirlersiniz**" olmaktan çıkıp ürünün gerçeği olan sabit kurala döndü. Üyelik bitişi "**bildirim gider**" değil artık "**panelde listelenir**" (giden gerçek bildirim seri temelli geri çağırma — ölçüldü). "Kampanya" modül metninden çıktı ve **`/ozellikler`'in iki kolonunun birbirini kestiği iç çelişki kapandı** (servisten ölçüldü: eski ifade 0, kampanya artık yalnız Yolda kolonunda).
- **Beşinci kalem ölçümle çürütüldü — cümle doğruymuş ve yerinde kaldı.** "Yetkiler şube bazında verilir **ve geri alınır**": bulgu yalnız `revokeGrant`'in çağıranına bakıp "yok" demişti, oysa geri alma üretimde **başka bir isim** üzerinden koşuyor: `revokeTemplate` (`accounts-update.ts:861`, uç `PATCH /accounts/:userId`, paneli çağırıyor) ve şablon değişimi eski yetkileri aynı transaction'da siliyor. Gerçekten ertelenmiş olan **tek bir yetkiyi şablondan bağımsız sökmek**; `yolda` kalemi buna daraltıldı. Ölçülmeseydi doğru bir cümle bozulacaktı. **İptal eşiğinin 24 saatlik değeri bilinçle yazılmadı** — sitede o rakamı ürüne bağlı tutan kapı yok, yazılsa B-029'un kendisi olan çapasız iddia sınıfına girerdi.
- **Yeni kapı ziyaretçiye görünen metni güdüyor:** `tests/iddia-metinleri.test.ts`. Boşluk gerçekti ve sondayla gösterildi — metne üç iddia geri yazıldığında TASK-2.08'in sabit kapısı **23/23 yeşil kaldı**, yeni kapı 3 kırmızı verdi. Bulgu atomunun bayat satırı ve ürünün kendi bayat notu memory'ye süreç kuralı olarak yazıldı.

**Test:** `npm test` **115 geçti + 1 atlandı** (taban 95+1; +20 senaryo — yeni `tests/iddia-metinleri.test.ts`). **Ürettiğim kapı iki sondayla sınandı** (ikisinde de kaynak değil **girdi** bozuldu; iki dosya scratchpad'e yedeklendi, sonra `diff -q` ile birebir geri yüklendi): *bozuk girdi* — üç karşılıksız iddia ziyaretçiye görünen metnin kendisine geri yazıldı → **3 kırmızı**, üçü de doğru testte; sabit kapısı aynı sondada 23/23 yeşil kaldı ve bu, yeni kapının neden ayrı gerektiğinin kanıtıdır. *Boş kapsam* — `MODULES` + `SEGMENTS` boşaltıldı → **8 kırmızı**; bu sondada "…demiyor" biçimindeki **12 kontrol yeşil kaldı**, fail-open tam olarak orada. Sonda sonrası batarya yeniden 115+1. `npx tsc --noEmit` çıkış 0. Üretim derlemesi imajın builder katmanında hatasız; 3100 yeni imaja alındı ve beş rota 200 (`/` 344.982 B, `/ozellikler` 173.449 B, üç segment sayfası). **Düzeltilen cümleler serviste doğrulandı** (eski ifadeler 0, yeni ifadeler yerinde). `a11y` 8 rota **TOPLAM SORUN 0**; `font-guard` 16 sayfa / 80.486 karakter, kümede olmayan karakter yok; `mobile-audit` **9/9 rotada yatay kaydırma yok**, dokunma hedefi **157** (taban birebir); `scan` 390×844 dört rota **konsol temiz**. ⚠️ `perf` koşulmadı — değişiklik yalnız metin içeriği (`/ozellikler` −54 B).

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

**Aktif Task:** `tasks/TASK-2.11.md` ⬜ — Chat, SSS, fiyat ve karşılaştırma sayfası tek kaynaktan okur (B-040, B-014)
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (araştırma detayı: `phases/PHASE-2-ARASTIRMA.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
