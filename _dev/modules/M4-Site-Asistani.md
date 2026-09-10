# M4: Site Asistanı

**Sorumluluk:** Ziyaretçinin sorularını sitedeki iddia sınırı içinde cevaplamak; bugün hazır akışla, ileride Claude ile.
**Bağımlılık:** M1 (chat ağacı `chat.ts` bilgi tabanı), M7 (anahtar ve maliyet tavanı env'de)
**Sınır:** `src/components/layout/Assistant.tsx` arayüzü ve ileride `src/app/api/chat`. Cevap içeriği M1'dedir.

---

## Feature'lar

### F4.1: Hazır akış asistanı → Phase —

**Açıklama:** Arayüz `chat.ts` ağacındaki konuları sunar, seçime göre cevap ve devam sorularını gösterir, bilinmeyeni WhatsApp/telefona bağlar. Model yok. Arayüz `/api/chat` ucuna bağlanacak şekilde kuruldu. Kickoff öncesi tamamlandı.

**Kabul Kriterleri:**
- Her konu tıklanınca cevap ve bağlantılar görünür; çıkışsız düğüm yok
- Klavyeyle açılır, kapanır, gezilir; odak tuzağı yok (`a11y.mjs`)
- Mobilde panel ekranı taşırmaz (`mobile-audit.mjs`)

**Bağımlılık:** M1 F1.3

**Edge Case'ler:**
- JavaScript kapalıysa asistan görünmez, sayfa çalışır

---

### F4.2: Claude bağlantısı → Phase —

**Açıklama:** `/api/chat` ucu; `chat.ts` ağacı ve `docs/CLAIMS.md` sınırı sistem talimatının bilgi tabanı olur. Model düşerse hazır akış devreye girer. v2.1 konusu.

**Kabul Kriterleri:**
- `/api/chat` ayakta; anahtar yalnız sunucuda, istemciye sızmaz
- Model hata verirse veya süre aşımı olursa arayüz hazır akışa döner, kullanıcı boş ekran görmez
- Cevaplar en fazla N token; maliyet tavanı (günlük istek/harcama) tanımlı ve aşılınca hazır akışa düşer
- Oturum başına hız sınırı var

**Bağımlılık:** F4.1, M7 F7.3

**Edge Case'ler:**
- Anahtar tanımsızsa uç 503 döner ve arayüz hazır akışta kalır — sessiz kayıp yok (M3 deseniyle aynı)
- Kişisel veri (telefon, e-posta) modele gitmez; form yolu M3'tür

---

### F4.3: İddia sınırı test seti → Phase —

**Açıklama:** Modelin cevaplarını `docs/CLAIMS.md` tablosuna karşı sınayan otomatik set: "sadece bizde", "canlı/sahada", ROI, müşteri sayısı, rakip adı üretmemeli. `research/scripts/chat-test.mjs` tohumu var. v2.1 konusu.

**Kabul Kriterleri:**
- Set en az 20 soru içerir (tuzak sorular dâhil: "kaç müşteriniz var?", "X'ten farkınız ne?")
- Hiçbir cevap yasaklı kalıp içermez; ihlal olursa set kırmızı
- Set M6 tek komutuna girer (F6.2)

**Bağımlılık:** F4.2, M6 F6.2

**Edge Case'ler:**
- Model sürüm değişince set yeniden koşar; sonuç faz dokümanına yazılır

---

## Teknik Notlar

- Karar: önce hazır akış, sonra AI (`docs/DECISIONS.md` 2026-09-10).
- Model seçimi, anahtar yönetimi ve maliyet tavanı discuss-phase'de kullanıcıya sorulur; `ILKELER.md` → Sır yönetimi.
