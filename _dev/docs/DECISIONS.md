# DECISIONS — Karar Günlüğü

**Amaç:** Önemli mimari ve tasarım kararlarının kaydı. "Neden X yerine Y tercih edildi?" sorusunun cevabı burada.
**Ne zaman güncellenir:** Önemli bir teknik, mimari veya tasarım kararı alındığında.

> İddia sınırı (ne söylenir, ne söylenmez) burada değil → `CLAIMS.md`. Tasarım kuralları → `STYLE-GUIDE.md`. Buradaki kayıtlar onların **üzerine** gelen tercihlerdir.

<!-- KURAL: Bu günlük append-only'dir — yazılmış bir karar silinmez, düzeltilmez. Geçersizleşen karar YENİ bir kararla geçersiz kılınır. -->

---

## Kararlar

<!-- Her yeni karar aşağıdaki formatta en üste eklenir (en yeni en üstte) -->

### 2026-09-11 — Lead hedefi: Google Sheet; e-posta ikincil (Resend)

**Bağlam:** `/api/demo` webhook veya dosya hedefine yazıyor ama ikisi de tanımsız; Vercel'de kalıcı disk yok, dosya yolu yayında çalışmaz.

**Seçenekler:**
1. Google Sheet (Apps Script web app'e JSON POST) — ucuz, telefondan bakılır
2. Notion veritabanı — takip akışı orada yürür, kurulum daha fazla
3. Slack/WhatsApp mesajı — anlık ama kalıcı kayıt zayıf
4. Vercel Marketplace Postgres — en sağlam, tek kişilik ekibe fazla

**Karar:** 1 seçildi (kullanıcı). E-posta Resend ile ikincil kalır; `demo@alpfitplus.com` alan adı doğrulaması aynı fazda yapılır. Lead kaydına ortam alanı eklenir (test/gerçek ayrımı).

**Gerekçe:** ILKELER "gelen talep kaybolmaz": önce dayanıklı kayıt, sonra e-posta. Bakım kolaylığı: e-tablo kurulumu ve bakımı en düşük. KVKK: aktarım maddesine e-tablo tedarikçisi eklenir (B-008 kapsamında).

**İlgili Task/Faz:** Faz 1 (`phases/PHASE-1.md`)

---

### 2026-09-11 — Faz sırası (yeniden): yayın+lead+analitik → görsel/mobil → kalite kapıları → metin tonu → alan adı geçişi → asistan

**Bağlam:** Aynı gün alınan önceki sıra kararı metin tonunu ilk faz yapıyordu. discuss-phase'de metin tonunun ön koşulu (kullanıcının örnek cümleleri) hazır değildi; kullanıcı görsel ve mobil tarafı da geliştirmek istedi.

**Seçenekler:**
1. Metin tonuyla başla, örnekler gelene kadar bekle
2. Önce önizleme + lead + analitik; görsel/mobil incelemeyi önizleme adresi üzerinden gerçek telefonda yap; metin tonunu canlıya almadan hemen önceye al

**Karar:** 2 seçildi (kullanıcı). Önceki faz sırası kararı (2026-09-11, "metin tonu → yayın…") bu kararla geçersizdir. Yeni faz konusu "Görsel ve mobil iyileştirme" eklendi.

**Gerekçe:** Metin tonuna bağımlı faz yok; lead hattı ve ölçüm ILKELER'in pazarlıksız maddeleri ve bugün karşılanmıyor. Önizleme adresi telefonda incelemeyi mümkün kılar; görsel faz somut bulgularla açılır. Metin tonu yalnız `src/content/` (ve oraya taşınacak gömülü metin) değiştirir; kalite kapıları o zaman otomatik koşuyor olur.

**İlgili Task/Faz:** Faz 1 (`phases/PHASE-1.md`), `PHASES.md` → Sıradaki Fazlar

---

### 2026-09-11 — Rakip adı sitede geçmez

**Bağlam:** Fiyat sayfasındaki karşılaştırma bloğu bir rakibin adını yazıyordu.

**Seçenekler:**
1. Adı tut, kaynağı ve tarihi ekle — şeffaf ama karşılaştırmalı reklam riski
2. Adı kaldır, yöntem + erişim tarihi ile adsız kıyas — daha az somut ama güvenli

**Karar:** 2 seçildi; ad kaldırıldı (commit `cacea4c`).

**Gerekçe:** Türkiye'de karşılaştırmalı reklam mevzuatı sıkı; rekabet dosyasının kendi kuralı da "rakip iddialarını kendi davranışımıza çevir". Sınır `CLAIMS.md`'de.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-11 — Faz sırası: metin tonu → yayın+lead+analitik → kalite kapıları → alan adı geçişi → asistan

**Bağlam:** Kickoff'ta beş faz konusu çıktı; sıra belirlenmeliydi.

**Seçenekler:**
1. Önce yayın ve lead (dönüşüm ilkesi) — ama metin tonu değişecekse önizlemeye eski ton çıkar
2. Önce metin tonu (kısa, tek sayfada örnekle başlar), sonra yayın hattı

**Karar:** 2 seçildi. v2.0 alan adı geçişiyle biter (konu 1–4); asistanın Claude'a bağlanması v2.1.

**Gerekçe:** Metin tonu küçük ve kullanıcı onayına bağlı; önizleme yayını sonrasında içerik değişimi daha pahalı. Kalite kapıları alan adı geçişinden önce gelir ki geçiş kırmızıya düşmesin. Asistan modeli anahtar ve maliyet kararı gerektirir, v2.0'ı kilitlemez.

**İlgili Task/Faz:** Kickoff (PHASES.md → Sıradaki Fazlar)

---

### 2026-09-11 — Modül yapısı: 7 modül, M6 hepsini kapılar, M7 en sonda

**Bağlam:** DevFlow kickoff'ta kod tabanı modüllere bölündü.

**Karar:** M1 İçerik ve iddia kaynağı · M2 Sayfalar ve bölümler · M3 Lead hattı · M4 Site asistanı · M5 Görsel varlık hattı · M6 Kalite kapıları · M7 Yayın ve altyapı. Bağımlılık: M1→M2, M1→M4, M5→M2; M6 hepsini kapılar; M3 hedefi ve analitik M7'de tanımlanır.

**Gerekçe:** İçerik tek kaynak olduğundan M1 ayrıştı; görsel üretim ayrı bir hat (betikler + salt okunur ürün reposu) olduğundan M5 ayrıştı; kalite ve yayın kesişen kaygılar olduğundan modül olarak adlandırıldı ki faz konuları onlara bağlansın.

**İlgili Task/Faz:** Kickoff (MODULE-MAP.md)

---

### 2026-09-10 — Kiwi AI Lab imzası büyütüldü, footer'da kendi bandı

**Bağlam:** Üreticinin markası footer'da küçük bir satırdı.

**Karar:** Ayrı bant (`KiwiBand.tsx`), büyütüldü.

**Gerekçe:** Kullanıcı kararı; üretici kimliği güven unsuru, saklanmıyor.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Web sitesi hizmeti eklenmeyecek

**Bağlam:** Kulüplere web sitesi yapma hizmeti ürün paketine eklenebilir miydi?

**Karar:** Hayır, şimdilik eklenmiyor.

**Gerekçe:** Kullanıcı kararı; tek huni ve tek ürün mesajı korunuyor. Denetim süzgeci için `BULGULAR.md` → Bilinçli Tercihler.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Chatbot: önce hazır akış, sonra AI

**Bağlam:** Site asistanı için model bağlantısı mı, sabit karar ağacı mı?

**Seçenekler:**
1. Doğrudan Claude'a bağla — anahtar, maliyet tavanı ve iddia sınırı testi gerekir
2. Önce `src/content/chat.ts` karar ağacı; arayüz `/api/chat` ucuna bağlanacak şekilde kurulur

**Karar:** 2 seçildi. Ağaç ileride modelin sistem talimatının bilgi tabanı olur; tek kaynak korunur.

**Gerekçe:** Bugün model olmadan da faydalı; iddia sınırı sabit metinde garanti. Model faz konusu v2.1'de.

**İlgili Task/Faz:** Kickoff öncesi (commit `19cc44a`)

---

### 2026-09-10 — Fotoğraf: seçici ve atmosferik, gerçek salon görselleri

**Bağlam:** Stok fotoğraf mı, illüstrasyon mu, sahne fotoğrafı mı?

**Karar:** Pexels lisanslı gerçek salon fotoğrafları, az ve seçici; segment sayfalarında foto kahramanlar.

**Gerekçe:** Kullanıcı gerçek fotoğraf istiyor, klişe istemiyor (`STYLE-GUIDE.md`). Kaynaklar `research/FOTOGRAF-KAYNAKLARI.txt`.

**İlgili Task/Faz:** Kickoff öncesi (commit `e994a4a`)

---

### 2026-09-10 — Görsel ton: açık ve ferah, sage vurgulu

**Bağlam:** v1 farklı bir paletteydi; v2 sıfırdan.

**Karar:** Açık tema, `#74B36F` sage aksan, Sora + Inter. Karanlık tema yok.

**Gerekçe:** Kullanıcı kararı; butik kulüp sahibine ferah ve güvenilir görünüm. Tokenlar `STYLE-GUIDE.md`.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Büyüme sayfaları: önce segment sayfaları

**Bağlam:** Blog mu, segment sayfaları mı, geçiş rehberi mi?

**Karar:** Önce 4 segment sayfası; geçiş sayfası ve yazılım seçim rehberi 2026-09-11'de eklendi. Blog/changelog pilot sonucuna kadar yok.

**Gerekçe:** Segment sayfaları saha satışını doğrudan destekler; blog organik trafik varsayımı ister (`ILKELER.md` → Proje Ufku).

**İlgili Task/Faz:** Kickoff öncesi (commit `5977a99`)

---

### 2026-09-10 — Dil: yalnız Türkçe

**Bağlam:** v1'de dokuz `/en/*` sayfası vardı.

**Karar:** v2 tek dil. v1'in İngilizce adresleri alan adı geçişinde 301 ile Türkçe karşılığına yönlenir (M7 → F7.5).

**Gerekçe:** Hedef kitle Türkiye; ikinci dil bakım maliyeti tek kişilik ekibe ağır, dönüşüme katkısı kanıtsız.

**İlgili Task/Faz:** Kickoff öncesi

---

### 2026-09-10 — Fiyat sunumu: tek düz fiyat, katmanlı paket yok

**Bağlam:** Rakiplerin çoğu katmanlı paket sunuyor.

**Karar:** Şube başı tek fiyat, mobil uygulama dâhil, KDV hariç; şube sayısına göre hesaplayıcı. Kaynak `src/content/pricing.ts` (dayanak `../alpfit-plus-satis/fiyat/model.md`, kurucu kararı 2026-07-10).

**Gerekçe:** "Paket yok, kademe yok, sürpriz yok" satış mesajının kendisi; tek kaynak fiyatı bileşen ve chat ağacında tutarlı kılar.

**İlgili Task/Faz:** Kickoff öncesi

---
