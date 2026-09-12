# PHASES — Proje Fazları (Özet)

**Amaç:** Tüm fazların genel durumunu göstermek
**Not:** Her fazın detayları `phases/PHASE-X.md` dokümanındadır.

---

## Faz Numaralandırma Kuralı (Just-in-Time)

Faz numarası faza **girildiğinde** atanır (discuss-phase) — değeri her zaman *Faz Durumu tablosundaki en büyük faz no + 1* (tablo boşsa 1). Gelecek fazlar **önceden numaralanmaz**; ileriye dönük plan versiyon düzeyinde (PRD/VERSIONS.md feature→versiyon) + aşağıdaki numarasız "Sıradaki Fazlar" listesinde durur.

Faz numaraları **global, sürekli ve append-only**'dir — versiyon değişse bile sıfırlanmaz ve **hiçbir zaman yeniden numaralanmaz/kaydırılmaz**. Araya iş girdiğinde yapılacak tek şey yeni konuyu Sıradaki Fazlar'a uygun sıraya eklemektir; numara hiç verilmemiş olduğu için kaydırılacak bir şey de yoktur.

---

## Faz Durumu

> Bu tablo **yalnızca girilmiş fazları** içerir (discuss-phase başlamış: 🔄/✅/⚠️). Henüz girilmemiş fazlar numarasızdır ve "Sıradaki Fazlar" listesindedir.

| Faz | Konu | Milestone | Durum |
|-----|------|-----------|-------|
| 1 | Önizleme yayını, lead hattı ve analitik | v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi Bunker'a otomasyon tetiklemeden düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı | 🔄 Devam ediyor |

**Durum simgeleri:**
- 🔄 **Devam ediyor** — discuss-phase başladı (aktif faz)
- ✅ **Tamamlandı** — review-phase tamamlandı
- ⚠️ **Erken sonlandırıldı** — Versiyon erken sonlandırıldı

**Detaylar:** `phases/PHASE-X.md`

---

## Sıradaki Fazlar

> Yaklaşan faz konuları — **numarasız**. Faza girildiğinde (discuss-phase) buradan çıkar, numara (mevcut en büyük faz no + 1) alıp Faz Durumu tablosuna 🔄 olarak geçer.

**v2.0** (alan adı geçişiyle biter):

- **Yayın öncesi düzeltmeler** — Alan adı geçişini kilitleyen dört bulgu kapandı ve UAT'ten geçti (`docs/DECISIONS.md` 2026-09-13):
  - B-029: site ürünün karşılamadığı hiçbir yeteneği "var" demiyor; iddialar ürün deposuna karşı yeniden sınandı.
  - B-018: ürün görsellerinde gerçek kişi adı, ciro projeksiyonu ve yol haritası özelliği yok; render hattının denetimi bu sınıfı yakalıyor.
  - B-024: yasal metin gerçek veri akışını eksiksiz anlatıyor (IP, aktarım, onay kapsamı).
  - B-011: KVKK başvuru adresi posta alıyor (MX ölçüldü) ya da metin posta alan bir adrese çevrildi.

  Hukukçu onayına bağlı kalem (B-008, B-024'ün yurt dışı aktarım dayanağı) fazı kilitlemez.
- **Alan adı geçişi** — `alpfitplus.com` v2'ye bakıyor; v1'in 20 adresinin (10 TR + 10 `/en/*`) hepsi 301 ile karşılığına gidiyor; v1 Vercel projesi arşivde ama silinmemiş; sitemap ve canonical tutarlı. Geçişten önce yayın kapısı (çalışma/yayın ayrımı, doğrulama) `GIT-STRATEJI.md`'ye yazıldı — bu sırada CI henüz yok. M7 F7.5'in "M6 F6.3 yeşil" bağımlılığı bu sırayla karşılanmıyor, faza girerken güncellenir; Umami site kaydı seçimi (v1 kaydı mı, v2 kaydı mı) bu fazda verilir.
- **Görsel ve mobil iyileştirme** — Site gerçek telefonda ve en az üç viewport'ta (küçük telefon, 390 px, tablet) bölüm bölüm gözle incelendi; bulgular BULGULAR'a düştü ve triyajı yapıldı; ana sayfa mobil uzunluğu kararı verildi (Gelen Kutusu sorusu); düzeltmeler sonrası beş ölçüm yeşil.
- **Kalite kapıları otomatik** — Beş ölçüm tek komutla koşuyor; GitHub Actions her push'ta çalışıyor; eşik altı değişiklik (kontrast, yatay kaydırma, font kümesi, iddia sızıntısı) kırmızı.
- **Metin tonu** — Kullanıcıdan fazla samimi bulduğu örnek cümleler alındı (M1 F1.2'deki üç şüpheli yer soruldu); tek sayfada örnek gösterildi ve onaylandı; ton `src/content/` geneline yayıldı (bileşenlerde gömülü metin de oraya taşındı); a11y/scan/font-guard yeşil. Alan adı geçişinden sonra gelir.
- Teknik borç kapatma (versiyon sonu sabit fazı)
- Senaryo testi (versiyon sonu sabit fazı) → ardından `/devflow:prd-review`

**v2.1:**

- **Asistan Claude'a bağlanır** — `/api/chat` ayakta; cevaplar iddia sınırını aşmıyor (test seti); maliyet tavanı ve anahtar yönetimi tanımlı; model düşerse hazır akış devreye giriyor.

<!-- KURAL: Bu liste YAKIN ufku tutar (örn. aktif versiyonun kalan fazları), uzak gelecek değil — uzak ileriye dönük plan PRD/VERSIONS.md'dedir. Numara YAZMA (numara faza girince damgalanır). Bir konu faza girince bu listeden silinir (mezuniyet — soft delete yasak: HTML comment/üstü çizili/"Önceki:" prefix yok). -->
<!-- NOT: VERSIONS.md feature→versiyon haritasını tekrar etme; burada faz konusu (geliştirme birimi) + milestone tutulur, feature listesi değil. -->
<!-- Sıradaki faz yoksa (proje/versiyon ucu) bu liste boş kalır. -->

Dış aktöre bağlı işler (hukukçu onayı, logo, kurucu programı kontenjanı) hiçbir fazın bitişini kilitlemez; `BULGULAR.md`'de açık bulgu olarak durur.

---

## Faz Geçiş Notları

**Faz geçişinde yapılacaklar:**
1. Faz review'ını tamamla (`/devflow:review-phase`)
2. Faz dokümanına retrospektif ve kalite kontrol sonuçlarını yaz
3. Milestone kriterlerini kontrol et
4. DURUM.md'yi güncelle
5. Tüm task'ların archive'da olduğunu doğrula
6. Sonraki fazı başlat (`/devflow:discuss-phase`)

**Kural:** Bir seferde sadece 1 faz planlanır. Sonraki faz, mevcut faz tamamlandıktan sonra planlanır.

**Versiyon Sonu Kuralı:** Her versiyonun içerik fazları tamamlandıktan sonra sırasıyla iki sabit faz yürütülür: (1) Teknik Borç Kapatma Fazı, (2) Senaryo Testi Fazı. Bu fazlar tamamlandıktan sonra zorunlu olarak `/devflow:prd-review` çalıştırılır. (Bu fazlar da diğerleri gibi faza girince numara alır — bkz. Faz Numaralandırma Kuralı.)

**Faz Mezuniyeti Kuralı:** PHASES.md kompakt kalır. Her faz tamamlandığında (review-phase sonrası ✅), detayları zaten `phases/PHASE-N.md`'dedir. PHASES.md'ye faz detayı, retrospektif özeti, alt-faz oturum izi veya task listesi yazma — bunlar PHASE-N.md'ye aittir. PHASES.md sadece Faz Durumu tablosu + Sıradaki Fazlar listesi + geçiş notları (kısa) içerir.

| Geçiş | Tarih | Not |
|--------|-------|-----|
| → Faz 1 | 2026-09-11 | İlk faza girildi; sıra değişti (DECISIONS 2026-09-11) |

<!-- KURAL: Her geçiş için TEK satır + kısa not. Geçiş gerekçesi/detayı PHASE-N.md retrospektifindedir, burada tekrar edilmez. "Önceki:" prefix veya HTML comment ile detay yığma YASAK (CLAUDE.md → Doküman Disiplini). -->

---

**Son Güncelleme:** 2026-09-13 — plan revizyonu: Faz 1 milestone'u Bunker ve kendi Umami'ye göre güncellendi; yeni konu "Yayın öncesi düzeltmeler" (B-029/B-018/B-024/B-011) alan adı geçişinin önüne girdi ve geçiş görsel/mobil, kalite kapıları ve metin tonunun önüne alındı.

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->
