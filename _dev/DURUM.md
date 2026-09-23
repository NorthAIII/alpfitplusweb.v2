# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-23 — TASK-2.08 ✅: sitenin yetenek iddialarının dayanağı olan tek liste kuruldu (`src/content/product.ts` → `CAPABILITIES`; bugün var 12 · yolda 7 · yol haritasında 5). Ürünün karşılamadığı beş iddianın hiçbiri "bugün var" kademesinde değil; `PRODUCT_STATUS.modules` artık elle yazılmıyor, listeden türüyor ve bir kalem düzeltildi ("antrenör performansı" eklendi). `short` silindi, `version` kaldı. Batarya 72 → 95 test. **Tüketiciler henüz bağlanmadı** — sabiti atlayan 17 çağrı satırı / 6 dosya ölçüldü (TASK-2.10/2.11).

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 2 — Yayın öncesi düzeltmeler
**Milestone:** Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; `destek@alpfitplus.com` test postası alıyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px.
**Adım:** task
**İlerleme:** Kapsam tartışması ✅ · teknik araştırma ✅ · task yazımı ✅ (20 task, dokuz bulgu) · plan doğrulama ✅ · plan revizyonu ✅ (2026-09-23: bir task iptal, üç hedefli düzeltme) · task çalıştırma 7/19 (TASK-2.01 ✅, TASK-2.02 ✅, TASK-2.03 ❌ iptal, TASK-2.04 ✅, TASK-2.05 ✅, TASK-2.06 ✅, TASK-2.07 ✅, TASK-2.08 ✅). Sıra TASK-2.09'da.
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

**Task:** TASK-2.09 — Beş karşılıksız yetenek cümlesi düzeltilir (B-029)
**Durum:** ⬜ Bekliyor
**İlerleme:** TASK-2.08 kapandı ve arşive gitti; yetenek listesi (`product.ts` → `CAPABILITIES`) artık var ve ürünün karşılamadığı beş iddia orada "yolda" kademesinde duruyor. Sıradaki adım `/devflow:run-task`. TASK-2.09 o listeye **dayanarak** sitedeki beş yanlış cümleyi düzeltir. ⚠️ **Liste kuruldu ama tüketiciler bağlanmadı** (bilinçli, plan böyle): beş ev hâlâ kendi metnini yazıyor — sabiti atlayan **17 çağrı satırı / 6 dosya** ölçüldü (`ozellikler/page.tsx` 6 · `faq.ts` 3 · `karsilastirma.ts` 2 · `chat.ts` 2 · `FounderProgram.tsx` 2 · `fiyat/page.tsx` 2) ve bu sayı TASK-2.10 + 2.11'in kapanış ölçütüdür.
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
| 2.09 | TASK-2.09 — Beş karşılıksız yetenek cümlesi düzeltilir (B-029) | ⬜ Bekliyor |
| 2.10 | TASK-2.10 — `/ozellikler` ve Kurucu Programı sabitten okur (B-040) | ⬜ Bekliyor |
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

### TASK-2.08 — Yetenek ve yol haritası tek kaynağı: `product.ts` → `CAPABILITIES` (B-029, B-040)

**Durum:** ✅ Tamamlandı — 2026-09-23
**Detay:** `tasks/archive/TASK-2.08.md`

**Özet:**
- **Sitenin yetenek iddialarının artık tek bir dayanağı var.** "Bugün var / yolda / yol haritasında" ayrımı beş evde elle yazılı ve üçü birbirinden farklıyken, şimdi `src/content/product.ts` → `CAPABILITIES` içinde tek sabitte (12 · 7 · 5 kalem). Kalemler `{id, label, modul?}` — çağrı yeri kalemi indeksle değil **adıyla** çağırıyor (`capability("qr-turnike")`). **Ürünün karşılamadığı beş iddianın hiçbiri "bugün var" kademesinde değil**; beşi de "yolda"da ve yerleştirmeleri icat değil: dördünün ürünün kendi erteleme kaydında karşılığı var (Üye 360 tam fazı W8 · iptal eşiği v1.5 adayı · üyelik bitişi bildirimi churn panelinin ardında · yetki geri alma ucu v1.5'e ertelendi).
- **`PRODUCT_STATUS.modules` elle yazılmaktan çıktı, listeden türüyor** ve cümle **bir kalem düzeltildi**: "antrenör performansı" eklendi (eskisi ürünün on modülünün sekizini sayıyordu; karşılığı ürün kodunda ölçüldü — rota, servis ve panel sayfası var). "Üye 360" bilinçle dışarıda — ekran var ama iki kalemi ürünün kendi "Yakında" kutusunda. `short` silindi (sıfır tüketici, sıfır planlı tüketici), `version` kaldı (tüketicisi TASK-2.10'da doğacak). `nextVersion` **açılmadı**: tüketicisiz alan açmak `short`'u ölü borç yapan hatanın aynısı.
- **İki varsayım ölçümle düştü.** (1) "Liste → düzyazı türetmesi kayıpsız" planlanmıştı; ölçüldü ki "bugün var" kademesinde **değil** — o etiketler kendi içlerinde virgül taşıyor ve virgülle bağlanınca cümle okunamaz hale geliyor, bu yüzden türetme fonksiyonu o kademeyi **tip düzeyinde** kabul etmiyor. (2) Türkçe büyütme locale'siz `iptal` → `Iptal` üretiyor; `tr` locale'i testle çivilendi. **Tüketiciler bilinçle bağlanmadı** (plan böyle) — sabiti atlayan 17 çağrı satırı / 6 dosya ölçüldü, TASK-2.10 + 2.11'in kapanış ölçütü o sayıdır.

**Test:** `npm test` **95 geçti + 1 atlandı** (taban 72+1; +23 senaryo — yeni `tests/capabilities.test.ts`). **Ürettiğim kapı iki sondayla sınandı** (ikisinde de kaynak değil **girdi** bozuldu; dosya önce scratchpad'e yedeklendi, sonra birebir geri yüklendi — `diff -q` doğruladı): *bozuk girdi* — ürünün karşılamadığı "toplu duyuru ve kampanya" iddiası "bugün var" kademesine yeni kalem olarak yazıldı (id hiç taşınmadan, kusurun gerçekte oluşacağı yerde) → **1 kırmızı**, doğru testte; kimlik ayağı bu sondada yeşil kaldı ve bu bilinçli kontrol grubudur. *Boş kapsam* — kademe komple boşaltıldı → **3 kırmızı**; bu sondada beş metin kontrolü **yeşil kaldı**, "hiç bakmadan PASS basan kapı" tam olarak budur ve boş-kapsam bloğu o fail-open için var. Sonda sonrası batarya yeniden 95+1. `npx tsc --noEmit` çıkış 0. Üretim derlemesi imajın builder katmanında hatasız, **23 rota**; 3100 yeni imaja alındı (`/` 200 / 345.042 B, `/ozellikler` 200 / 173.503 B) ve değişen cümle **serviste doğrulandı** ("antrenör performansı" 1 kez, eski sıralama 0). `a11y` 8 rota **TOPLAM SORUN 0**; `font-guard` 16 sayfa / 80.509 karakter, kümede olmayan karakter yok; `scan` 390×844 `/` 20 kare ve `/ozellikler` 15 kare **konsol temiz**. ⚠️ `mobile-audit`/`perf` **koşulmadı** — değişiklik tek bir cümlenin içeriğine dokunuyor, yerleşim/ağırlık ekseni kapsam dışı.

---

### TASK-2.07 — Talep sahibine onay e-postası ve `notify_lead`'in gerçek sonucu (B-059)

**Durum:** ✅ Tamamlandı — 2026-09-23
**Detay:** `tasks/archive/TASK-2.07.md`

**Özet:**
- **Talep sahibi artık ikinci bir kanaldan da onay alıyor:** ekran kutusunun yanında bir e-posta. Metin `src/content/mail.ts`'te (yeni tek kaynak), dönüş süresi vaadi formun onay kutusundaki cümlenin **aynısı** — v1'in "(genelde 1 iş günü içinde)" parantezi taşınmadı, yeni süre icat edilmedi (B-026 büyümedi). Alıcı ziyaretçi, `reply_to` **ekibin kutusu**; gövde HTML değil düz metin (ziyaretçinin yazdığı ad doğrudan gövdeye giriyor).
- **`notify_lead` kalıcı `pending` olmaktan çıktı.** PATCH gövdesi `{notify_team, notify_lead}`; üç değerin **üçü de gerçek depo hook'una yazılarak** ölçüldü — `sent` (`2f0kswpek4ivyyd`), `skipped` (`4ih3pu3sd4m85kr`, ziyaretçi geçerli adres vermedi), `failed` (`g1jxcb84qmyvlyr`). Aynı sorgunun bir önceki kaydı (değişiklikten önce) `notify_lead: pending` — kontrol grubu. 2026-09-14 gerekçe yorumu silinmedi, dayanağının neden düştüğüyle birlikte güncellendi.
- **İki gönderim paralel ve birbirini bloke etmiyor:** sağlayıcı damgaları **214 ms** arayla düştü, uç süresi **575 ms**. Ziyaretçinin gördüğü yanıt üç dalda da değişmiyor (aynı `200`, aynı gövde alanları) — onay gönderimi `200`'ü `503` yapmıyor. **B-059'un iki ayağı kapandı**, atom açık kalıyor (üçüncü ayak alan adı geçişi fazında).

**Test:** `npm test` **72 geçti + 1 atlandı** (taban 66+1; +6 senaryo). **Kontrol grubu:** aynı batarya **kod değişmeden önce** koşuldu → **7 kırmızı**, yani yeni dallar gerçekten ölçüyor; tabanda yeşil kalan tek yeni senaryo "üç dalda da yanıt aynı"dır ve bilinçlidir (yanıt gövdesi değişmiyor). Uçtan uca tur **yerel `lead-store`'a karşı**, kendi geçici konteynerimde (üretim imajı, compose ağı, önizleme token'ı) — canlı `leads_preview` deposuna **hiçbir kayıt yazılmadı**; talep HTTP **200** `{ok:true,stored:true,mailed:true}`. Sağlayıcıda **iki e-posta da `delivered`** (onay `01a0cbda-b7b1-…`, ekip `01a0cbda-b734-…`); onayın gövdesi geri okundu: `from` `demo@alpfitplus.com`, `reply_to` ekip kutusu, `html` alanı boş. `skipped`/`failed` dalları geçersiz sağlayıcı anahtarıyla koşuldu — hiç e-posta gitmedi. `npx tsc --noEmit` çıkış 0; üretim derlemesi imajın builder katmanında hatasız, 3100 yeni imaja alındı (`/demo` HTTP 200 / **74.747 B** — TASK-2.06 ile birebir). ⚠️ `a11y`/`mobile-audit`/`scan`/`font-guard` **koşulmadı**: değişiklik render edilen hiçbir yüzeye dokunmuyor (`src/components/**` ve `src/app/**/page.tsx` değişmedi).

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

**Aktif Task:** `tasks/TASK-2.09.md` ⬜ — Beş karşılıksız yetenek cümlesi düzeltilir (B-029)
**Aktif Faz:** `phases/PHASE-2.md` 🔄 — Yayın öncesi düzeltmeler (araştırma detayı: `phases/PHASE-2-ARASTIRMA.md`) · son kapanan: `phases/PHASE-1.md` ✅
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
