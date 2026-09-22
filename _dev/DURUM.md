# DURUM — Proje Dashboard

**Son Güncelleme:** 2026-09-22 — verify-phase 2. tur: 34 senaryonun 32'si geçti, düzeltme task'ı doğmadı; kalan iki kalem kullanıcı gözü bekliyor (e-postanın gelen kutusu/spam ayrımı, Umami panel arayüzü). TASK-1.20'nin UAT'a devredilen canlı doğrulaması da kapandı — faz `review`'a hazır.

<!-- KURAL: Bu satır her oturum sonunda ÜZERİNE YAZILIR — tek satır, tek cümle. "Önceki:" / "Eski:" prefix ile kümülatif yığma YASAK; HTML comment'e sarma da yasak (CLAUDE.md → Doküman Disiplini). Tarih + kısa özet yeterli; detay için git log + ilgili PHASE/TASK dokümanları. Alan **yalnız burada, dokümanın başında** durur — dosyanın sonuna ikinci bir kopya açma (tek-değerli alan tek yerde; CLAUDE.md → Dokümantasyon İlkeleri). -->

---

## Aktif Faz

**Faz:** Phase 1 — Önizleme yayını, lead hattı ve analitik
**Milestone:** v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı.
**Adım:** review
**İlerleme:** 19/19 task tamamlandı (1 iptal: TASK-1.04); UAT 2. tur 32/34 geçti, yeni düzeltme task'ı yok — kalan 2 kalem `❌ doğrulanamadı` (kullanıcı gözü), faz kapanışını engellemiyor
**Faz Dokümanı:** `phases/PHASE-1.md`

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

**Task:** — yok (faz task döngüsü kapandı; UAT 2. turu düzeltme task'ı doğurmadı)
**Durum:** ✅ Faz `review` adımında
**İlerleme:** Fazdaki 19 task da sonuçlandı (18 ✅ + 1 ❌ iptal); UAT 2. tur **34 senaryo / 32 geçti / 2 doğrulanamadı**. Sıradaki adım `/devflow:review-phase`.
**Not:**
- **Kullanıcı gözü bekleyen iki kalem (iki UAT turunda da otonom kolda kapanmadı):** (1) e-postaların **gelen kutusunda mı spam'de mi** olduğu — gönderim tarafı üç turda da Resend `delivered`, DKIM hizalı, yerleşim API'den ölçülemez; (2) **Umami panelinin arayüzünde** v2 kaydının gözle görülmesi — verinin kendisi panelin kendi okuma API'siyle teyitli (2. turda sayfa görüntülemesi 10 → 13, `whatsapp` 5 → 7, `phone` 1 → 2, `demo-submit` 2 → 3; yüzeyler `hero`/`sss`/`footer`/`demo-form`).
- **Karar bekleyen 🔴 B-058:** `.dockerignore` `.env`'i dışlamıyor, beş sır üretim imajı katmanında — 2. turda taze derlenen imajda yeniden ölçüldü (dosya `/app/.env`, `600`, beş anahtar). Soru kullanıcıda: bu makinedeki `.env` üretim değerlerini mi taşıyor, imaj dışarı çıktıysa anahtarlar döndürülmeli mi?
- **UAT 2. turu canlı depoya bir kayıt daha bıraktı:** `leads_preview`'da `UAT2 Test Kulubu` (2026-09-22 15:01:23Z) — bilinçli, milestone'un kendi şartını ölçmek için; koleksiyon 14 → 15, `leads` 2 → 2. 12 aylık saklama işi siler.
- **Yerel `lead-store` konteyneri hâlâ ayakta** (ölçüldü 2026-09-22: `Up 2 days`, healthy) — kaldırma/erişim komutları `memory/yerel-lead-deposu-docker-profili.md`.

---

## Task Durumu (Aktif Faz)

| # | Task | Durum |
|---|------|-------|
| 1.01 | Aşama türetimi ve `deployStage` tek kaynağı | ✅ Tamamlandı |
| 1.02 | noindex üç katman tek kaynaktan | ✅ Tamamlandı |
| 1.03 | Vercel'de ayrı proje, env iskeleti ve başlık ölçümü | ✅ Tamamlandı |
| 1.04 | Google Sheet lead alıcısı — Apps Script web app | ❌ İptal |
| 1.05 | Demo ucunu sertleştir — JSON doğrulaması ve `env` alanı | ✅ Tamamlandı |
| 1.16 | Test koşucusu (Vitest) — mevcut elle testler kalıcı olur | ✅ Tamamlandı |
| 1.12 | İletişim biçimi doğrulaması (B-021) | ✅ Tamamlandı |
| 1.11 | Bunker keşfi — giriş yolu ve otomasyon dışı tutma | ✅ Tamamlandı |
| 1.17 | Yerel lead deposu — v1'in PocketBase'i salt okunur bağlı compose profili | ✅ Tamamlandı |
| 1.13 | Depo sözleşme paketi — yerel depoya karşı kalıcı test | ✅ Tamamlandı |
| 1.14 | Kayıt adaptörü — `toStore`, `.env.example`, Apps Script kalıntısı | ✅ Tamamlandı |
| 1.18 | Canlı depo bağlantısı — Vercel env ve token → koleksiyon teyidi | ✅ Tamamlandı |
| 1.06 | E-posta hattını aç ve uçtan uca canlı tur (depo + e-posta) | ✅ Tamamlandı |
| 1.07 | Kendi Umami'ye site kaydı ve tracker bağlantısı | ✅ Tamamlandı |
| 1.08 | Olay sarmalayıcı, yüzey sözlüğü ve `demo-submit` | ✅ Tamamlandı |
| 1.09 | Global tıklama dinleyicisi ve yüzey etiketleri | ✅ Tamamlandı |
| 1.10 | Yasal metin — Aktarım ve Çerezler maddeleri | ✅ Tamamlandı |
| 1.15 | Yasal metin hizası — lead deposu (12 ay) ve kendi Umami | ✅ Tamamlandı |
| 1.19 | Satır sonu ayıklama — e-posta konusu ve depo mesajı (UAT #26) | ✅ Tamamlandı |
| 1.20 | Yasal sayfaların noindex meta katmanı (UAT #33, B-041) | ✅ Tamamlandı |

**Durum Kodları:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## Son Task Özetleri

> **KURAL:** Sadece son 2 task özeti tutulur, daha eskileri **gerçekten silinir** (HTML comment'e sarma, "Önceki:" prefix, üstü çizili etiket yasak — detay için git log + arşivlenmiş task dokümanı). Her özet kısa formatlı: paragraf yasak, **bullet zorunlu**, "Özet" alanı max 3 bullet.

### TASK-1.20 — Yasal sayfaların noindex meta katmanı (2026-09-22)

**Durum:** ✅ Tamamlandı
**Özet:**
- Üç yasal sayfada (`kvkk`, `gizlilik`, `kullanim-kosullari`) sabit `robots: { index: true, follow: true }` satırı kaldırıldı — sayfa artık kök `layout.tsx`'teki `isPublished`/`deployStage` türevini miras alıyor, ikinci bir koşul yazılmadı.
- Devralma dört ortam senaryosunda (yerel · üretim simülasyonu · **ara hâl** `VERCEL_ENV=production`+`.vercel.app` · alan adı env'i tanımsız) serving katmanında, izole derlemeyle ölçüldü — dördü de beklenen sonucu verdi, fail-open yok.
- B-041 kapandı: Çözüm Kaydı yazıldı, atom `bulgular/archive/`e taşındı, index satırı silindi (Açık Bulgular 52 → 51). Fazdaki tüm task'lar sonuçlandı.

**Test:** Yerelde 16/16 rotada (404 dâhil) HTML meta + `X-Robots-Tag` + `robots.txt` regresyonsuz. `docker compose exec web npm test` → 5 dosya/**66 PASS** + 1 skipped (taban birebir). `tsc --noEmit` 0, eslint (3 dosya) 0. `npm run build` hatasız, 23 rota. `a11y.mjs` TOPLAM SORUN: 0, üç sayfada `scan.mjs` konsol temiz. Canlı önizleme doğrulaması bilinçli ertelendi — kanal UAT.
**Detay:** `tasks/archive/TASK-1.20.md`

### TASK-1.19 — Satır sonu ayıklama: e-posta konusu ve depo mesajı (2026-09-22)

**Durum:** ✅ Tamamlandı
**Özet:**
- `clean()` ikiye ayrıldı: yeni `cleanLine()` tek satırlık lead alanlarında (`name`, `club`, `phone`, `email`, `segment`, `branches`) tüm C0 kontrol karakterlerini (`\r`/`\n`/`\t` dâhil) ve DEL'i kırpmadan önce boşluğa çevirip tekrar `trim`+`slice` yapıyor; `message` (textarea) dokunulmadan çok satırlı kalıyor.
- `toStore()`'da segment etiketiyle mesaj arasına `---` ayırıcı satırı girdi (Karar Noktası (b)) — gerçek `Segment: X` etiketi her zaman ayırıcıdan hemen önceki tek satır, ziyaretçinin mesajına yazdığı sahte `Segment:` satırı ayırıcının altında kalıyor.
- UAT #26 kapandı: kulüp adına konan `\n`/`\r` artık Resend `subject`'ini ya da depo `Ad:`/`Şube:`/`Telefon:` satırlarını sahteleyemiyor.

**Test:** Bozuk girdi sınaması: `route.ts` geçici olarak eski hâline döndürüldü, 5 yeni senaryo kırmızı görüldü (28 diğer senaryo yeşil kaldı), düzeltme geri konunca 33/33 yeşil. `docker compose exec web npm test` tüm paket → 5 dosya/**66 PASS** + 1 skipped (taban 61+1'den +5). `tsc --noEmit` 0, eslint temiz. `npm run build` hatasız, 23 rota.
**Detay:** `tasks/archive/TASK-1.19.md`

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

**Aktif Task:** — yok (faz task döngüsü tamamlandı, UAT 2. tur geçti — sıradaki adım review-phase)
**Aktif Faz:** `phases/PHASE-1.md`
**Task Sistemi:** `tasks/TASKS-README.md`
**Açık bulgular ve kullanıcıya bağlı işler:** `BULGULAR.md`
