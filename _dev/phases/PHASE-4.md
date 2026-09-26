# Phase 4: Alan adı geçişi

**Durum:** 🔄 Devam ediyor

<!-- Bu doküman faza girince (discuss-phase) oluşur; durum 🔄 ile başlar. Henüz girilmemiş fazların dokümanı/numarası olmaz — PHASES.md → Sıradaki Fazlar'da numarasız konu olarak durur. -->
<!-- KURAL: Yukarıdaki **Durum:** alanı tek değer taşır (menüden biri) ve PHASES.md'deki faz durumuyla AYNI olmalıdır. Yazan üç komut vardır: doğuşta discuss-phase (`🔄 Devam ediyor`), kapanışta — ikisi de son meşru anda — review-phase Adım 6 (`✅ Tamamlandı`, PHASES ✅ ile aynı anda) ve prd-review erken-sonlandırma arşivlemesi (`⚠️ Erken sonlandırıldı`). Faz ✅/⚠️ damgalandıktan sonra doküman tarihseldir — alan bir daha düzeltilemez, bu yüzden atlanamaz. -->
<!-- KURAL: Bu doküman tek-okunabilir kalmalı (CLAUDE.md → Boyut ve Bölünme). Doküman kırmızı çizgiyi (~20k token) **AŞARSA** (ölçüm dosya bazlıdır: `doc-scan.sh _dev/phases/PHASE-N.md` — tek bir bölümün değil, dokümanın tamamının tek Read'e sığması esastır) faz HÂLÂ AKTİFKEN `PHASE-N-<EK>.md`'ye bölünür (**ek BÜYÜK — parent'ın casing'ini izler**; geri-linkteki `<tip>` küçük harf kalır, o dosya adı değildir) — parent'ta self-yeten özet + pointer kalır, çocuğun başına `← PHASE-N · <tip>` geri-linki konur, içerik taşınıp silinir, parent o fazın mini-index'i olur. Kapanış damgasından (`✅` ya da `⚠️`) sonra bölme yasaktır; research-phase, verify-phase ve review-phase faz hâlâ aktifken boyutu kontrol eder (kanon: CLAUDE.md → Boyut ve Bölünme). Kesim dokümanın kendi `##` bölüm sınırından geçiyor ve tek sonuç veriyorsa (en az iki `##` sınırı, parent'ta gövde kalır) kalem kurallıdır — sorulmaz, uygulanır ve raporlanır; bölümleri gruplamak ya da ad icat etmek gerekiyorsa sorulur (CLAUDE.md → Onay Ölçütü). -->
<!-- KURAL: **Çizgiye YAKLAŞMAK iş değildir** — çizginin altında kalmak için kısaltma ya da erken bölme yapılmaz; gereken içerik önce yazılır (kanon: CLAUDE.md → Boyut ve Bölünme). Doküman eşiğin ALTINDAYSA (uygulanan bölme yerinde kaldı ya da temizlik onu altına indirdi — geri ALINAN bölme dokümanı çizginin ÜSTÜNE döndürür ve orada kayıt `accept-size`'dır) `accept-size` çağrılamaz: script boyut aşımı olmayan dokümanı reddeder. O hâlde verilmiş bir kap kararı varsa tek kayıt tek satırlık `<!-- KURAL: … (bilinçli) -->` yorumudur; kap kararı doğmadıysa kayıt da gerekmez. -->

---

## Genel Bilgiler

**Amaç:** `alpfitplus.com` v1'den alınıp v2'ye bağlanır ve v2.0'ın içerik tarafı bununla kapanır. Geçiş günü v2 v1'in yerini aldığı için v1'in bugün yapıp v2'nin yapmadığı her davranış o gün kaybolur; faz geçişin kendisiyle birlikte bu **paritenin** kapanmasını, canlıya çıkışın kapılı bir düzene girmesini ve yasal metnin yayından önce gerçek veri akışını anlatmasını kapsar.

**Milestone:** `alpfitplus.com` ve `www.alpfitplus.com` v2'ye bakıyor, site canlı alan adında dizine açık (üç `noindex` katmanı kalktı; `canonical`, site haritası ve paylaşım görseli canlı alan adını gösteriyor ve 200 dönüyor) ve `alpfitplus-web-v2.vercel.app` apex'e yönleniyor; v1'in canlı adres kümesinin her kalemi (bugün 27: 20 sayfa + 6 varlık adresi + `www`, Search Console'un dizin listesiyle kesiştirilmiş) ölçülerek 301 ile karşılığına gidiyor ve hedefi 200; işaretli tek test talebi canlı koleksiyona düştü ve silindi, ölçüm v1'in Umami kaydında sayılıyor; v1'in yapıp v2'nin yapmadığı her kalem (güvenlik başlıkları, yasal metnin alıcı/ülke dökümü, şirket bilgileri, ikon ve paylaşım görseli adresleri) taşındı ya da gerekçesiyle düşürüldü ve yasal metin WhatsApp aktarımını söylüyor; `destek@alpfitplus.com` posta alıyor; JavaScript kapalıyken form veriyi adres çubuğuna yazmıyor ve talebi sessizce kaybetmiyor; canlıya çıkış iki dallı ve elle koşulan tam kontrol setine bağlı (`GIT-STRATEJI.md`); proje ücretli planda, fonksiyonlar Frankfurt'ta; v1 Vercel projesi alan adından ayrıldı ama duruyor.

### Feature Listesi

(MODULE-MAP ve modules/ referansı)

Fazın **tek içerik feature'ı F7.5**'tir (MODULE-MAP'te Faz 4, 🔄). Parite ve yayın hazırlığı kalemleri tamamlanmış (✅) feature'lara dokunur; Faz 2/3 emsaliyle onların matris durumu değişmez, dokunuşun kaydı bu tablodur.

| Feature | Modül | Açıklama |
|---------|-------|----------|
| F7.5: Alan adı geçişi ve 301 haritası | M7-Yayin-ve-Altyapi | Apex + `www` taşıma; v1'in canlı adres kümesinin kalıcı yönlendirme haritası; Production'ın üç canlı değeri; v1 projesinin alan adından ayrılması (silinmez); geri dönüş kuralı. Bulgular: **B-043** (geçiş yüzeyi tablodan geniş) · **B-011** (apex'te posta kaydı yok) |
| F7.3: Vercel'de ayrı proje (✅, dokunulur) | M7-Yayin-ve-Altyapi | Ücretli plan · fonksiyon bölgesi Frankfurt (`[audit-product SORU]` 2026-09-23) · Preview ↔ Production ortam ayrımı · `.vercel.app` → apex yönlendirmesi · alan adı bağlandıktan sonra yeniden derleme |
| F7.2: Güvenlik başlıkları (✅, dokunulur) | M7-Yayin-ve-Altyapi | v1 paritesi: CSP, `X-Frame-Options: DENY`, güncel `Permissions-Policy` (**B-016**) |
| F7.4: Analitik olay sayımı (✅, dokunulur) | M7-Yayin-ve-Altyapi | Production'da v1'in `alpfitplus.com` Umami kaydı (`docs/DECISIONS-2026-09-14..2026-09-22.md` → 2026-09-14 «Umami site kaydı») |
| F3.2 / F3.3: Dayanıklı kayıt ve e-posta (✅, dokunulur) | M3-Lead-Hatti | Canlı depo token'ı + v1'in IP tuzu; canlı koleksiyonun işaretli tek test talebiyle kanıtı; `DEMO_FROM` alan adı doğrulaması |
| F3.1: Demo formu ve talep ucu (✅, dokunulur) | M3-Lead-Hatti | **B-065**: JavaScript kapalıyken form veri sızdırmaz ve talebi sessizce kaybetmez |
| F1.1: Tek kaynak içerik (✅, dokunulur) | M1-Icerik-ve-Iddia-Kaynagi | Yasal metin: ön-doldurulmuş WhatsApp bağlantısının aktarımı (`[TASK-3.25 SORU]` → seçenek a) + v1'in alıcı/ülke dökümü paritesi (**B-059** kalem 3) |
| F2.3: Ortak yerleşim (✅, dokunulur) | M2-Sayfalar-ve-Bolumler | JSON-LD'de v1'de olup v2'de düşen şirket ve teklif alanları (**B-042** yalnız kalem 3) |
| F5.4: Marka varlıkları (✅, dokunulur) | M5-Gorsel-Varlik-Hatti | `favicon.ico` / SVG / `apple-touch-icon` teslimi ve v1'in paylaşım görseli adresi (B-043'ün varlık satırları) |

**Geçişle ölçülerek teyit edilecek bulgu:** **B-027** — kart görseli, `canonical` ve site haritası bugün `alpfitplus.com`'u gösteriyor ve adres v2'ye geçtiği anda doğruya dönmesi beklenir; kanıt canlı alan adında ölçülür. Önizleme yüzeyinin kendi kartı kapsam dışıdır (↓).

---

## Kapsam Tartışması

> `/devflow:discuss-phase` oturumunda dolduruldu (2026-09-26). Kararların hepsi kullanıcıyla alındı; "varsayılan" olarak işaretlenenler kullanıcıya liste hâlinde sunulup onaylandı.

### Alınan Kararlar

- **Kapsam: geçiş + v1 paritesi.** Ölçüt: v1'in bugün canlıda yaptığı ve v2'nin yapmadığı her kalem ya **taşınır** ya **gerekçesiyle bilinçle düşürülür** (düşen kalem `BULGULAR.md` → Bilinçli Tercihler'e iner). Bugün bilinen liste: güvenlik başlıkları (B-016) · yasal metnin alıcı/ülke dökümü (B-059 kalem 3) · JSON-LD'nin düşen alanları (B-042 kalem 3) · varlık adresleri ve `www` (B-043) · v1'in kendi `.vercel.app` adresini apex'e yönlendirmesi ve `/404.html` kuralı (B-043). ⚠️ **Liste tamlığı iddia edilmez** — B-059'un kök nedeni paritenin hiçbir yerde kriter olmamasıydı; araştırma listeyi v1'in **canlısına** karşı yeniden çıkarır.
- **Lead hattından yalnız B-065 girer.** JavaScript kapalıyken form ad/telefon/e-postayı adres çubuğuna yazıyor ve talebi hiçbir yere göndermiyor; geçişten sonra gerçek ziyaretçi buna çarpar. B-037 · B-054 · B-020 kanvasta kalır (↓ Kapsam Dışı).
- **Yayın düzeni: iki dal.** Çalışma ayrı bir dalda sürer ve önizleme adresi orada yaşar; canlıya çıkış **yalnız kullanıcının "yayınla" tetiğiyle** çalışma dalının `main`'e birleştirilmesidir. `GIT-STRATEJI.md` korumalı dokümandır: değişim bir task içinde `.claude/commands/devflow/lib/git-strategy-kurulum.md` prosedürüyle (probe → teşhis → teyit) yapılır, dal adı orada teyit edilir (öneri `dev`) ve gerekçe o task'ta `docs/DECISIONS.md`'ye yazılır. ⚠️ **Sıra şartı:** dal ayrımı alan adı bağlanmadan **önce** kurulur — yoksa geçişten sonraki ilk faz commit'i doğrudan canlıya çıkar.
- **Yayın kapısı: tam set, elle.** Birleştirmeden önce beş ölçüm + test paketi + tip kontrolü yayın kopyasına karşı yeşil olmalı; `a11y`'nin kayıtlı tek kalemi (B-063, `/gecis` paragrafı — ölçümün kusuru) hariç okunur. Bu kapı F7.5'in *"M6 F6.3 yeşil"* bağımlılığının **yerine** geçer: CI sonraki fazda ("Kalite kapıları otomatik"), sıra Faz 2'de değişmişti.
- **Ortam ayrımı.** Vercel'de Preview ortamı bugünkü önizleme değerlerini taşır (önizleme koleksiyonunun token'ı, v2'nin kendi Umami kaydı); Production üç canlı değeri alır — `LEAD_STORE_TOKEN` canlı token · `IP_HASH_SALT` v1'in değeri · `NEXT_PUBLIC_UMAMI_WEBSITE_ID` v1'in `alpfitplus.com` kaydı. Test talepleri böylece canlı kayda hiç karışmaz. Üç değerin kendisi önceden kararlıydı (`modules/M7-Yayin-ve-Altyapi.md` → F7.5 Edge Case'ler); Faz 2 retrosunun kaydıyla **üçü de bu fazın UAT senaryosudur**. ⚠️ Önizleme adresinin korumasız kalması kararı (F7.3 Edge Case) dal önizlemesine taşınırken yeniden ölçülür.
- **Vercel planı: ücretli plana geçilir.** Ücretsiz plan ticari kullanıma kapalı ve canlı satış sitesinde askıya alma demo hunisini durdurur (ILKELER → Kalıcılık önceliği, Dönüşüm). Güncel ücreti araştırma ölçer, geçişi kullanıcı onaylar. `BULGULAR.md` → Bilinçli Tercihler'deki "Hobby'de kalır" satırı bu kararla güncellendi; geçiş yapılınca silinir.
- **Fonksiyon bölgesi Frankfurt** (kullanıcı kararı 2026-09-23, `BULGULAR.md` → Gelen Kutusu `[audit-product SORU]`) bu fazda uygulanır; `/api/demo` gecikmesi taşımadan önce ve sonra ölçülür.
- **Geçiş anını Claude yürütür, kullanıcının "şimdi" tetiğiyle.** Komut satırından adım adım, her adım öncesi/sonrası ölçülerek. v1 projesinden **yalnız alan adları** ayrılır; proje silinmez (CLAUDE.md → Dokunulmazlar). v1 projesine komut satırı erişimi yoksa o adım kullanıcının panel adımına düşer — araştırma ölçer.
- **Alan adı bağlandıktan sonra yeniden derleme zorunlu adımdır** (kodda doğrulandı): aşama derleme anında `VERCEL_PROJECT_PRODUCTION_URL`'den türüyor (`src/lib/stage.ts:26-30`, `NEXT_PUBLIC_DEPLOY_STAGE` olarak gömülür). Bağlanmadan önce derlenmiş dağıtım canlı alan adında da `preview` aşamasında ve üç katmanda `noindex` kalır.
- **Canlı kaydın kanıtı: işaretli tek test talebi, sonra silinir.** "TEST — silinecek" etiketli tek talep canlıdan gönderilir, sunucuda salt-okunur teyit edilir (okuma modu: `memory/kendi-sunucu-n8n-bunker-umami.md`), sonra kullanıcının onayıyla silinir; ekibe bir bildirim e-postası düşmesi beklenir. Gerekçe: iki koleksiyon da `201` döner ve yanlış token gerçek talepleri **sessizce** önizlemeye gönderir.
- **Yasal metin: WhatsApp aktarımı yazılır** (`[TASK-3.25 SORU]` → seçenek a). Aktarım bölümüne ön-doldurulmuş bağlantının tıklama anında Meta'ya ad/kulüp/telefon taşıdığı ayağı eklenir; v1'in alıcı/ülke dökümü (B-059 kalem 3) aynı işte taşınır. Olgu yazılır, hukuki nitelendirme yazılmaz (`docs/DECISIONS.md` 2026-09-23 «Yasal metin aktarımı olgu olarak yazar»); yazılan cümle de ölçülür (`memory/urun-iddiasi-capa-dogrulamasi.md`).
- **`www` ve `.vercel.app` kalıcı yönlendirmeyle apex'e** (varsayılan, onaylandı). `www` bugün v1'de **307** (geçici) veriyor; kalıcıya çevrilir. `alpfitplus-web-v2.vercel.app` → `alpfitplus.com`, v1'in kendi Vercel adresine yaptığının paritesi — aynı site iki adreste yayında kalmaz.
- **Geri dönüş kuralı.** Talep hattı ya da sitenin açılması bozuksa alan adı **hemen** v1 projesine geri bağlanır; kısmi kırmızıda (tek adres, tek başlık) 30 dakika ileri düzeltme denenir, olmazsa geri. `GIT-STRATEJI.md` → Acil Düzeltme'nin geri dönüş beyanı bu kuralla yazılır.
- **Harita doğrulaması tablodan geniştir.** 20 adreslik tablo tek başına ölçüt değildir: v1'in canlı adres kümesi (bugün 27 — B-043) + Umami'nin en çok gezilen sayfaları + Search Console'un dizin listesi kesiştirilir ve **her kalem** 301 → 200 olarak ölçülür.
- **B-011 (gelen posta) geçişten önce kapanır.** İki kullanıcı adımı (Squarespace'te "Google Workspace MX" hazır seçeneği + Google'da `destek@` kutusu ya da takma adı) alan adı taşımasından bağımsızdır; yasal metnin otuz gün taahhüdü site alan adına bağlandığı anda görünür olduğu için sıra budur. Doğrulanmış yönerge, bozulmama tabanı ve kapanış ölçümü atomda hazır (`bulgular/B-011-apex-mx-kaydi-yok.md` → Çözüm Yolu); UAT senaryosudur.

### Kullanıcı Tercihleri

- **Search Console erişimi kullanıcıda.** Geçişten önce dizindeki adres listesini kullanıcı çeker, geçişten sonra yeni site haritasını kullanıcı bildirir; Claude neye bakılacağını ve neyin bildirileceğini yazar.
- **Yayın kontrolleri hız için kısılmaz** — tam set (yayın başına ~15-20 dk) kabul edildi.
- **Geçişin ve yayının tetiği kullanıcıdadır**, icra Claude'dadır; plan değişikliği ve test kaydının silinmesi ayrıca kullanıcı onayı ister.

### Kapsam Dışı

- **CI (F6.3) ve tek komut (F6.2)** — "Kalite kapıları otomatik" fazı. Bu fazda kontroller elle koşar.
- **Lead hattının diğer kırmızıları** — B-037 (başka siteden gelen istek depoya yazıyor) · B-054 (çöp numara kayda geçiyor) · B-020 (hız sınırı geçerli talebi reddediyor); B-036'nın sessiz kayıp yolları da. Kanvasta kalır.
- **B-042'nin parite dışı kalemleri** — alt sayfaların kendi paylaşım kartı (`og:url`/`og:title`), `/foto` önbelleği, site haritası tarihleri, iki tema rengi.
- **Önizleme yüzeyinin kendi paylaşım kartı** (B-027'nin aşamaya göre `metadataBase` ayağı) — canlı alan adındaki kart geçişle ölçülür, önizlemedeki değil.
- **B-061 (depo yedeğinin sunucu dışı kopyası)** — icra sunucu projesinde (`altyapi/vps`); depo bugün de v1'in canlı kayıtlarını taşıyor, yani geçiş yeni bir risk doğurmuyor.
- **B-008 (hukukçu onayı)** — dış aktör, fazı kilitlemez (ILKELER).
- **Metin tonu** — ayrı faz, geçişten sonra. **B-025** (çalışma zamanı alarmı) da dışarıda.

---

## Araştırma Bulguları

> Bu bölüm `/devflow:research-phase` oturumunda doldurulur.

### Değerlendirilen Yaklaşımlar
- [Yaklaşım 1]: [Açıklama, artılar, eksiler]
- **Seçilen:** [Hangisi ve neden]

### Kullanılacak Araçlar/Kütüphaneler
- [Araç 1]: [Versiyon, ne için]

### Dikkat Edilecekler
- [Tuzak/Risk 1]: [Nasıl kaçınılacak]

### Teknik Kararlar
- [Karar 1]: [Gerekçe]

---

## Task Listesi

> Bu bölüm `/devflow:plan-phase` oturumunda doldurulur.

<!-- KURAL: Task Listesi yalnızca özet tablodur (#, Task, Durum, kısa açıklama). Task'ın icra detayı / oturum kaydı / çalışma notu buraya değil `tasks/TASK-N.md`'ye yazılır — bu bölüme sızan detay şişmedir, temizlenir (bölme değil). -->

| # | Task | Durum | Açıklama |
|---|------|-------|----------|
| 4.01 | TASK-4.01 | ⬜ Bekliyor | [kısa açıklama] |

**Durum simgeleri:** ⬜ Bekliyor | 🔄 Devam ediyor | ⏸️ Duraklatıldı | ✅ Tamamlandı | 🔴 Bloke | ❌ İptal

---

## UAT Sonuçları

> Bu bölüm `/devflow:verify-phase` oturumunda doldurulur.

**Tarih:** [tarih]
**Toplam Senaryo:** X | **Geçen:** Y | **Kalan:** Z

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ✅/❌ | [not] |

---

## Retrospektif

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur.

### Ne İyi Gitti?
- [Tekrarlanması gereken pratikler]

### Ne Kötü Gitti?
- [Sorunlar ve darboğazlar]

### Sonraki Faz İçin Öneriler

<!-- Alınan dersler ve tavsiyeler. Memory'den MEZUN EDİLEN öğrenimlerin çapalı tek satırlık kaydı da buraya düşer ("<öğrenim> artık <test/lint/CI/validator/guard> tarafından yakalanıyor — memory'den mezun edildi") — kanon: .claude/commands/devflow/lib/memory-sistemi.md → Supaplar. Kayıt faz ✅ damgalanmadan ÖNCE yazılır. -->
- [Alınan dersler, tavsiyeler]

### Task-Spesifik Teknik Öğrenimler

<!-- OPSİYONEL: Bu fazdaki task'larda öğrenilen ama proje genelinde geçerli olmayan teknik nüanslar (araç davranışı, framework bug'ı, vb.). MEMORY.md'nin değil, faz retrosunun evidir. Bu fazda böyle bir nüans çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

### DevFlow'a Öneri

<!-- OPSİYONEL: Bu fazda fark edilen, DevFlow yönteminin geneline dair (proje-özel OLMAYAN) iyileştirmeler — aracın kendisinin nasıl çalışması gerektiği. Buraya yazılır + kullanıcıya bildirilir; DevFlow'a ayrı oturumda taşınır. Disiplin çıkmadıysa bu alt bölümü tamamen sil. -->
- [...]

---

## Kalite Kontrol Sonuçları

> Bu bölüm `/devflow:review-phase` oturumunda doldurulur (`QUALITY.md`'nin on ekseni).

| Eksen | Durum | Not |
|-------|-------|-----|
| Modülerlik | ✅ / ⚠️ / ❌ | ... |
| Güvenlik | ✅ / ⚠️ / ❌ | ... |
| Bakım Maliyeti | ✅ / ⚠️ / ❌ | ... |
| Performans | ✅ / ⚠️ / ❌ | ... |
| Hata Yönetimi | ✅ / ⚠️ / ❌ | ... |
| Test Kapsamı | ✅ / ⚠️ / ❌ | ... |
| Erişilebilirlik | ✅ / N/A | ... |
| Dönüşüm | ✅ / ⚠️ / ❌ | ... |
| Ölçülebilirlik | ✅ / ⚠️ / ❌ | ... |
| İddia Uyumu | ✅ / ⚠️ / ❌ | ... |

---

**Oluşturulma:** 2026-09-26 (discuss-phase)
