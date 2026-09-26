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
| 1 | Önizleme yayını, lead hattı ve analitik | v2 ayrı Vercel projesinde önizlemede ve noindex; gerçek demo talebi v1'in lead deposunda (önizleme koleksiyonu) kayda düşüyor ve e-postayla geliyor; üç olay kendi Umami'de yüzey etiketiyle sayılıyor; v1'e dokunulmadı | ✅ Tamamlandı |
| 2 | Yayın öncesi düzeltmeler | Site ürünün yapamadığı hiçbir şeyi "var" demiyor (dayanak tek yetenek listesi); ürün görselinde gerçek kişi adı ve olmayan özellik yok, denetim bir sonrakini yakalıyor; yasal metin ölçülmüş veri akışını anlatıyor ve dört beyanı test çiviliyor; üretim imajında `.env` yok, prova hedefi açık ve imaja giren değerlerin hiçbirinin canlı olmadığı ölçüldü (döndürme gerekmedi); 320-412 px'te formun onayı ve hatası görünüyor, talep sahibine onay e-postası gidiyor, fiyat sayfasının mobil ana çağrısı 52 px | ✅ Tamamlandı |
| 3 | Görsel ve mobil iyileştirme | Site 320-1440 px'te, %200-%400 büyütmede, hareket azaltma açıkken, JS kapalıyken ve yatay tutuşta bölüm bölüm gezildi ve gerçek telefonda uçtan uca tur koşuldu; ölçülmüş beş kontrast ihlali ve 320 px'te kesilen içerik kalmadı; telefonda her sayfanın ilk ekranında demoya çıkan bir yol var ve dönüşüme dokunan her hedef ≥ 44 px; kontrast ve mobil kapıları 16 sayfanın hepsini geziyor, boyanan gerçek rengi ölçüyor, ölçemediğini sayıyor ve eşik altında kırmızıya dönüyor; ana sayfanın iki kart ızgarası reddedilen kalıptan çıktı, Roller sekmeleri doğru ekranı gösteriyor, yazı tipi kümesindeki her karakterin dosyada bulunduğu doğrulandı; beş ölçüm yeşil | ✅ Tamamlandı |

**Durum simgeleri:**
- 🔄 **Devam ediyor** — discuss-phase başladı (aktif faz)
- ✅ **Tamamlandı** — review-phase tamamlandı
- ⚠️ **Erken sonlandırıldı** — Versiyon erken sonlandırıldı

**Detaylar:** `phases/PHASE-X.md`

---

## Sıradaki Fazlar

> Yaklaşan faz konuları — **numarasız**. Faza girildiğinde (discuss-phase) buradan çıkar, numara (mevcut en büyük faz no + 1) alıp Faz Durumu tablosuna 🔄 olarak geçer.

**v2.0** (alan adı geçişiyle biter):

- **Alan adı geçişi** — **Faz 2 kararı (2026-09-23): B-011 bu faza taşındı** — `destek@alpfitplus.com` posta almıyor (apex'te MX kaydı yok) ve yasal metin o adrese otuz gün taahhüdü veriyor; taahhüt tam da bu fazda, site alan adına bağlanınca gerçek olur. Kullanıcının Squarespace adımına bağlı olduğu için Faz 2'yi kilitlemedi (ILKELER); ölçülmüş yönerge, bozulmama tabanı ve kapanış ölçümünün sırası bulgunun atomunda hazır. `alpfitplus.com` v2'ye bakıyor; v1'in 20 adresinin (10 TR + 10 `/en/*`) hepsi 301 ile karşılığına gidiyor; v1 Vercel projesi arşivde ama silinmemiş; sitemap ve canonical tutarlı. Geçişten önce yayın kapısı (çalışma/yayın ayrımı, doğrulama) `GIT-STRATEJI.md`'ye yazıldı — bu sırada CI henüz yok. M7 F7.5'in "M6 F6.3 yeşil" bağımlılığı bu sırayla karşılanmıyor, faza girerken güncellenir; Umami'de v2 bu fazda v1'in `alpfitplus.com` site kaydına geçer — Production `NEXT_PUBLIC_UMAMI_WEBSITE_ID` v1 kaydının kimliğine çevrilir (`docs/DECISIONS.md` 2026-09-14 «Umami site kaydı»). Faz 2 kararı: B-059'un kalan ayakları (depo alanlarının kalıcı `pending` hâli, yasal metnin v1'den az bilgi vermesi) bu fazın v1 parite listesinde kalır.
- **Kalite kapıları otomatik** — Beş ölçüm tek komutla koşuyor; GitHub Actions her push'ta çalışıyor; eşik altı değişiklik (kontrast, yatay kaydırma, font kümesi, iddia sızıntısı) kırmızı. Faz 2 kararı: demo formunun kalıcı tarayıcı ölçüm betiği (320/390/1440 × hata türleri × odak × onay) tek komutun parçası olarak buraya girer. Faz 3 kararı (2026-09-23): B-030 ve B-012'nin **a11y/mobil ayakları** Faz 3'e alındı (çıkış kodu, kapsam eşiği, kırpılmış taşma, 16 rota); buraya kalanlar `perf.mjs` · `scan.mjs` · `font-guard.mjs`'in çıkış kodu ve rota listeleri, HTTP durumu kontrolü, hedef ölüyken cümleyle durma, depo şema kapısının varsayılanda kapalı olması, B-035 (ağırlık muhasebesi ve regresyon çizgisinin yeniden ölçümü) ve B-015 (açılan katmanların hiç ölçülmemesi).
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
| Faz 1 ✅ | 2026-09-22 | 19/19 task sonuçlandı (18 ✅ + 1 iptal); UAT 32/34; milestone kısmen — bkz. PHASE-1 |
| → Faz 2 | 2026-09-22 | Yayın öncesi düzeltmeler; kapsama sır sızıntısı (B-058) ve iki dönüşüm kalemi (B-034, B-055) eklendi. Sıradaki Fazlar'da **sıra değişti**: görsel ve mobil iyileştirme alan adı geçişinin önüne alındı |
| Faz 2 ✅ | 2026-09-23 | 21 task sonuçlandı (19 ✅ + 2 iptal); UAT 2 tur, 31/31; milestone tam. B-011 kapsam kararıyla alan adı geçişine taşındı (bulgu bilançosu 8/8) |
| → Faz 3 | 2026-09-23 | Görsel ve mobil iyileştirme; kapsam dokuz bulguya çıktı — devralınan üçlüye (B-032 · B-033 · B-031) kullanıcı kararıyla B-022 · B-046 · B-051 · B-057, kapı tarafında da B-030 ve B-012'nin a11y/mobil ayakları eklendi. Keşif turu fazın içinde: ekran turu başta, gerçek telefon turu sonda |
| Faz 3 ✅ | 2026-09-26 | 27 task sonuçlandı (26 ✅ + 1 iptal); UAT 2 tur, 32/40; **milestone kısmen — bkz. PHASE-3**. Dokuz bulgunun 4'ü arşive, 5'i kalan ayağıyla açık |

<!-- KURAL: Her geçiş için TEK satır + kısa not. Geçiş gerekçesi/detayı PHASE-N.md retrospektifindedir, burada tekrar edilmez. "Önceki:" prefix veya HTML comment ile detay yığma YASAK (CLAUDE.md → Doküman Disiplini). -->

---

**Son Güncelleme:** 2026-09-26 — **Faz 3 ✅ kapandı** (review-phase): 27 task sonuçlandı (26 ✅ + 1 ❌ İptal), UAT iki tur koştu (2. turda 40 senaryonun 32'si geçti, kalan sekizin hiçbiri ürün kusuru değil) ve düzeltme task'ı doğmadı. **Milestone kısmen** — üç ayak açık ve üçü de bilinçli daralma ya da doğrulama-kanalı yokluğu (*"beş ölçüm yeşil"* kayıtlı kullanıcı kararıyla · Roller'in diyetisyen ayağı TASK-3.24 ❌ İptal ile · gerçek telefon turu `kanal: UAT`); tam metin `phases/PHASE-3.md` → Kapanış notu. Retrospektif ve on eksenlik kalite kontrol `phases/PHASE-3-RETROSPEKTIF.md`'de (boyut kapısında bölündü). Faz 3'ün dokuz bulgusundan dördü arşive gitti, beşi kalan ayaklarıyla kanvasta açık.

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->
