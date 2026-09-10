# KICKOFF-NOTES — Alpfit Plus Web Sitesi v2

**Tarih:** 2026-09-11
**Mod:** İlk kickoff, PRD'siz (kullanıcı kararı). `_dev/` daha önce elle açılmıştı,
yalnızca DURUM.md vardı. Bu dosya `kickoff-docs` oturumunda okunur, dokümanlara
aktarılır ve silinir.

---

## 1. Proje anlayışı (kullanıcı teyit etti)

- **Ne:** `alpfitplus.com` için sıfırdan yazılan tanıtım sitesi. Ürün Kiwi AI Lab'ın
  B2B spor kulübü yönetim yazılımı (Alpfit Plus), **pilot aşamasında**, bir stüdyoda test.
- **Kime:** Türkiye'deki butik kulüp sahipleri. Dört segment: reformer/pilates,
  boks/dövüş, CrossFit, çok şubeli zincir. Satın alma komitesi değil, salon sahibi.
- **Yığın:** Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind 4 · lucide-react ·
  Sora + Inter (daraltılmış) · Docker Compose · tek dil Türkçe. Ayrıntı README.md.
- **Bugünkü durum:** 16 sayfa, 23 rota, üretim derlemesi geçiyor. Ölçümler DURUM.md'de.
- **Kapsam dışı (kullanıcı kararı, DURUM.md):** web sitesi hizmeti, katmanlı paket,
  ikinci dil, sayı sayma istatistik bandı (pilot rakamı yok).
- **Dokunulmayacaklar:** `../Alpfitplus-website.v1` (canlı site), `../Alpfit.v1` (ürün),
  `../alpfit-plus-satis` (satış). Üçü de salt okunur.

### Kickoff'ta tespit edilen üç boşluk

1. **Analitik yok.** v1'de olay sayımı vardı; v2'de hiçbir izleme kodu yok. İlke
   eksenlerinde ölçülebilirlik ikinci sırada, boşluk büyük. → Faz konusu 2'ye girdi.
2. **v1 İngilizce sayfaları için yönlendirme planı yok.** v1'de dokuz `/en/*` sayfası var
   (`/en/`, demo, features, kvkk, pricing, privacy, segments, support, terms, 404); v2 yalnız
   Türkçe. Alan adı geçişinde 301 haritası şart. → Faz konusu 4'e girdi.
3. **Kalite kapıları elle koşuyor.** Beş ölçüm betiği var, hiçbiri commit'i durdurmuyor,
   test ve CI yok. → Faz konusu 3'e girdi.

---

## 2. Modül yapısı (onaylandı: "Uygun, böyle kalsın")

| Modül | Ad | Kapsam | Bugünkü durum |
|---|---|---|---|
| M1 | İçerik ve iddia kaynağı | `src/content/*` — site, pricing, product, segments, faq, legal, gecis, karsilastirma, shots, chat. PRODUCT_STATUS ve PRICING tek kaynak. | Var; metin tonu işi açık |
| M2 | Sayfalar ve bölümler | `src/app/*` rotalar, `src/components/sections/*` (22 bölüm), `layout/*`, `ui/*` | Var |
| M3 | Lead hattı | `DemoForm.tsx`, `src/app/api/demo/route.ts`, WhatsApp yedeği, bal küpü, hız sınırı | Kod var, hedef (`LEAD_WEBHOOK_URL` / `LEAD_FILE_PATH`) tanımsız |
| M4 | Site asistanı | `Assistant.tsx`, `src/content/chat.ts` karar ağacı, ileride `/api/chat` | Hazır akış var, model yok |
| M5 | Görsel varlık hattı | `research/scripts/`: render-product, photos-build, font-subset, brand-assets; `public/product`, `public/foto`, `public/fonts` | Var; logo geçici |
| M6 | Kalite kapıları | a11y, mobile-audit, font-guard, perf, scan; ileride tek komut + CI | Elle koşuyor |
| M7 | Yayın ve altyapı | Docker, Vercel (ayrı proje), env, güvenlik başlıkları (`next.config.ts`), sitemap/robots, 301 haritası, analitik | Vercel bağlantısı yok |

**Bağımlılıklar:** M1 → M2, M1 → M4 (chat.ts bilgi tabanı), M5 → M2 (görseller),
M6 hepsini kapılar, M7 en sonda (M3 hedefi ve analitik M7'de tanımlanır).

**Bilgi tekrarı önlemi:** İddia sınırı tablosu bugün CLAUDE.md, README.md ve
`site.ts` başlığında üç kez yazılı. kickoff-docs'ta tek eve (CLAIMS) taşınır,
diğerleri ona atıf verir. Fiyat kuralları yalnız `pricing.ts` + `fiyat/model.md`
atfıyla durur.

---

## 3. Faz konuları (onaylandı: "Uygun, bu sırayla")

Numarasız — numara faza girince (discuss-phase) damgalanır.

| Sıra | Konu | Milestone (test edilebilir) | Versiyon |
|---|---|---|---|
| 1 | Metin tonu | Tek sayfada örnek gösterildi ve kullanıcı onayladı; ton `src/content/` geneline yayıldı; a11y/scan/font-guard yeşil. Ön koşul: kullanıcıdan fazla samimi bulduğu örnek cümleler alınır (DURUM.md'deki üç şüpheli yer sorulur). | v2.0 |
| 2 | Önizleme yayını, lead hattı ve analitik | v2 **ayrı** Vercel projesinde önizleme adresinde; gerçek bir demo talebi dayanıklı kayda düşüyor **ve** e-postayla geliyor; analitik olay sayımı çalışıyor (demo gönderimi, WhatsApp/telefon tıklaması yüzey etiketiyle sayılıyor). v1 projesine dokunulmadı. | v2.0 |
| 3 | Kalite kapıları otomatik | Beş ölçüm tek komutla koşuyor; GitHub Actions her push'ta çalışıyor; eşik altı değişiklik (kontrast, yatay kaydırma, font kümesi, iddia sızıntısı) kırmızı. | v2.0 |
| 4 | Alan adı geçişi | `alpfitplus.com` v2'ye bakıyor; v1'in yirmi adresinin (TR + `/en/*`) hepsi 301 ile karşılığına gidiyor; v1 Vercel projesi arşivde ama silinmemiş; sitemap ve canonical tutarlı. | v2.0 |
| 5 | Asistan Claude'a bağlanır | `/api/chat` ayakta; cevaplar iddia sınırını aşmıyor (test seti); maliyet tavanı ve anahtar yönetimi tanımlı; model düşerse hazır akış devreye giriyor. | v2.1 |

**Versiyon planı:** v2.0 = alan adı geçişiyle biter (konu 1–4). v2.1 = asistan ve
sonrası. Versiyon sonunda DevFlow'un sabit iki fazı (teknik borç kapatma, senaryo
testi) uygulanır.

**Dış aktöre bağlı işler** (yasal metin hukukçu onayı, logo, tüzel kimlik, kurucu
programı kontenjanı) hiçbir fazın bitişini kilitlemez; DURUM.md'de açık iş olarak durur.

---

## 4. İlkeler (onaylandı: "Devral, iddia sınırını ekle")

v1'in `_dev/ILKELER.md` → "Bu Projeye Özgü" bölümü aynen devralınır. kickoff-docs
template'ten oluştururken bu bölümü v1'den kopyalar ve aşağıdaki tek eklemeyi yapar.

### Proje ufku (v1'den)
Belirsiz, pilot sonucuna bağlı. Site saha satışını destekleyen vitrin; organik
trafik varsayım değil. Mimari kararlar yıllarca yaşayacakmış gibi verilir;
belirsizlik kapsamı daraltır, sağlamlığı değil.

### En yüksek öncelikli eksenler (v1'den)
1. Dönüşüm  2. Ölçülebilirlik  3. Bakım kolaylığı (tek kişilik ekip)

### Pazarlık konusu olmayanlar (v1'den + v2 eklemesi)
- Versiyon bitirilebilir kalır (bitiş kriteri yoksa açılmaz; büyürse bölünür).
- Kanıtsız iddia yayınlanmaz.
- Gelen talep kaybolmaz (önce dayanıklı kayıt, e-posta ikincil).
- Erişilebilirlik WCAG AA altına düşmez.
- Tek huni korunur (self-servis kayıt/ödeme yok).
- **[v2 eklemesi] İddia sınırı ve rakip adsızlığı.** Söylenebilir/söylenemez tablosu
  (`../alpfit-plus-satis/rekabet/ozet.md` + `fiyat/model.md`) tek kaynaktır; rakip adı
  sitede geçmez; fiyat kıyası yöntem + tarih ile adsız yayınlanır. Pilot iddiası
  `PRODUCT_STATUS`, fiyat `PRICING` dışında hiçbir yerde yazılmaz.

Temel ilkeler (kalıcılık, sır yönetimi, kümülatif test) template varsayılanıyla kalır.
Kümülatif test ilkesi bugün karşılanmıyor; faz konusu 3 bunu kapatır.

---

## 5. Projeye özgü dokümanlar (kickoff-docs oluşturur)

| Doküman | İçerik | Kaynağı |
|---|---|---|
| `docs/STYLE-GUIDE.md` | Tokenlar (`globals.css @theme`), Sora/Inter kuralları (₺ yok), sticky/overflow ve `min-w-0` tuzakları, kullanıcının nefret ettiği kalıplar (parıltı ikonlu kapsül rozet, jenerik ikon ızgarası, sahte logo şeridi), istediği kalıplar (gerçek fotoğraf, ürün sahneleme, hareket) | CLAUDE.md "Tasarım" + memory |
| `docs/CLAIMS.md` | İddia sınırı tablosunun tek evi; söylenebilir/söylenemez; rakip adsızlığı; kaynak dosya atıfları | CLAUDE.md "İddia sınırı", README, site.ts başlığı |
| `docs/DECISIONS.md` | DURUM.md "Kararlar" tablosu buraya taşınır (9 karar, tarihli) | DURUM.md |
| `BULGULAR.md` | DURUM.md "Yol boyunca bulunan hatalar" ve açık işler bulgu formatına dönüşür | DURUM.md |

TECH-STACK ayrı yazılmaz; README.md yığını zaten tutuyor, INDEX ona atıf verir.
Ölçüm betikleri tablosu CLAUDE.md'de kalır (çalıştırma kuralı, mekanizma).

---

## 6. kickoff-docs için notlar

- DURUM.md elle yazılmış; template'e geçirilirken içerik **korunur**, kararlar ve
  hatalar yukarıdaki dokümanlara taşınır, DURUM yalnız dashboard olarak kalır.
- CLAUDE.md zaten var ve kullanıcı diliyle yazılmış; kickoff-verify'da bölünürken
  "Dokunulmayacaklar" ve Docker uyarıları (rota klasörü → restart, port 3001 yasak)
  aynen kalır.
- Git: tek dal `main`, doğrudan commit ve push, Türkçe mesaj + neden + ölçüm rakamı.
  GIT-STRATEJI bunu yazar, değiştirmez.
- Rota sayısı (16 sayfa / 23 rota) ve ölçüm rakamları DURUM.md'den alınır, tekrar
  ölçülmez.
