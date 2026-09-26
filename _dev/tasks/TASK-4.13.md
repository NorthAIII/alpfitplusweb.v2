# TASK-4.13: Yasal metin — WhatsApp ön-doldurma aktarımı yazılır; alıcı/ülke paritesi kapanır

**Durum:** ⬜ Bekliyor
**Modül:** M1 — İçerik ve İddia Kaynağı (modules/M1-Icerik-ve-Iddia-Kaynagi.md) · M3 Lead Hattı
**Feature:** F1.1 Tek kaynak içerik ve iddia sabitleri (yasal metin)
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** Yok (sıra: TASK-4.14 aynı bölümü düzenler ve onunla **aynı yayına** biner)

---

## Hedef

Form hedefe yazamayıp 503 döndüğünde gösterilen WhatsApp bağlantısı (TASK-3.25) mesaj kutusunu ad, kulüp ve telefonla önceden doldurur — ve bu veri bağlantıya tıklandığı anda, **mesaj gönderilmeden önce** Meta'nın sunucusuna gider. KVKK → Aktarım bunu bugün söylemiyor; üstelik hemen üstündeki cümle koşulsuz olumsuz: *"aşağıda saydığımız tedarikçiler dışında hiç kimseye veri gitmez."*

Aktarım listesine WhatsApp ayağı **olgu olarak** yazılır; olumsuz cümle ve "Bu listenin pratik karşılığı" paragrafı bu ayağı kapsayacak biçimde **öznesiyle** düzeltilir. Yeni bir test dalı beyanı ön-doldurmanın **gerçek alan kümesine** (fonksiyonun çıktısına) bağlar. B-059 kalem 3 "eksik kalem yok" ölçümüyle kapanır.

Tamam sayılır: metin + test dalı yeşil ve dalın negatif kontrolü görülmüş; iki bulgu kaydı kapanmış.

---

## Bağlam

`[TASK-3.25 SORU]` → seçenek (a) (kullanıcı, 2026-09-26): Aktarım'a WhatsApp ayağı yazılır. `docs/DECISIONS-2026-09-23..2026-09-23.md` «Yasal metin aktarımı olgu olarak yazar»: olgu yazılır, hukuki nitelendirme yazılmaz (B-008 — dayanak hukukçunun). Araştırma: B-059 kalem 3 **bayat** — TASK-2.17 Aktarım'ı rol + ülke dökümüyle yeniden yazmış; v1'in `RECIPIENTS` (5 kalem) ↔ v2 (4 kalem + Umami paragrafı) kalem kalem karşılaştırıldı, eksik yok.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/BULGULAR.md` → Gelen Kutusu `[TASK-3.25 SORU]` satırı (ölçüm ve seçenekler); `_dev/tasks/archive/TASK-3.25.md`
- `_dev/bulgular/B-059-alan-adi-gecisinde-v1-davranislari-geriler.md`
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → "B-059 kalem 3 → BAYAT" maddesi
- `src/content/legal.ts` — Aktarım bölümü ve üstündeki dayanak yorumu (plan anında `:122-199`; yeniden konumla)
- `src/content/site.ts` → `whatsappDraftHref` — ön-doldurmanın tek kaynağı
- `tests/legal-consistency.test.ts` — dal deseni (`claimOnce`, pozitif çapa, kontrol grubu)
- `_dev/memory/urun-iddiasi-capa-dogrulamasi.md` — **yerine yazdığın cümle de bir iddiadır**; kapsam öznede saklıdır; kapı gerçeğin kaynağından türetilir

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/bulgular/B-059-…` → Çözüm Kaydı (k3) + `Durum`; `_dev/BULGULAR.md` index + Gelen Kutusu'ndaki `[TASK-3.25 SORU]` satırının mezuniyeti (uygulandı)
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 kriterindeki "İlk örnek TASK-3.25 … metne dokunulmadı" cümlesi gerçekle hizalanır

---

## Alt Görevler

- [ ] **1. Olguyu ölç (devralma yok)**
  - `whatsappDraftHref`'e bütün form kaydı verildiğinde çıktıda hangi alanlar var (beklenen: ad · kulüp · telefon; e-posta ve mesaj girmez).
  - Bağlantının yalnız `no-sink`'te çizildiği (M3 F3.1).
  - `wa.me` bağlantısının ilk isteğinin sorguyu taşıdığı (yönlendirme zinciri `curl -sI` ile).
  - WhatsApp'ın Türkiye'deki kullanıcı için hizmet sağlayıcısı ve ülkesi — **sağlayıcının kendi gizlilik belgesinden**, kaynak + erişim tarihiyle (Resend satırının disiplini).
- [ ] **2. Metin** — Aktarım listesine WhatsApp ayağı (rol: talebi kaydedemediğimizde önerdiğimiz bağlantı, hangi alanlar, tıklama anında, ülke); olumsuz cümlenin öznesi; "pratik karşılığı" paragrafı. `legal.ts` dayanak yorumuna ölçüm (TASK-2.17 bloğunun biçimiyle).
- [ ] **3. Test dalı** — `tests/legal-consistency.test.ts` yeni dal: beyan KVKK'da tam bir kez; dayanak: metnin saydığı alan kümesi ↔ `whatsappDraftHref` çıktısındaki alan kümesi **iki yönlü** (elle `toContain` listesi değil). Negatif kontrol: fonksiyona geçici olarak e-posta eklenince dal kırmızı, geri alınınca yeşil.
- [ ] **4. Kalan cümleleri yeniden oku** — Gizlilik metninde WhatsApp'a değinen başka bir olumsuz beyan var mı (`grep`); varsa aynı özne sorusu.
- [ ] **5. Kayıtlar** — B-059 k3 kapanışı (araştırmadaki karşılaştırmaya çapa); Gelen Kutusu satırı; M3 F3.2.

---

## Etkilenen Dosyalar

```
src/content/legal.ts                  # Aktarım: WhatsApp ayağı, özne düzeltmesi, dayanak yorumu
tests/legal-consistency.test.ts       # yeni dal
```

---

## Dikkat Noktaları

- **Kapsam öznede saklıdır, olumsuz beyanda sınır daha sıkıdır** (memory): cümleyi yazdıktan sonra öznesini sor — "hiç kimseye veri gitmez" hangi yolu kapsıyor, hangisini kapsamıyor.
- Hukuki nitelendirme yazılmaz ("açık rıza ile", "zorunlu olarak" gibi); `legal.ts` başlığı: yayından önce hukuk danışmanı (B-008 — dış aktör, fazı kilitlemez).
- **Barındırma satırına ve dal 8'e dokunulmaz** — onlar TASK-4.14'ün (Frankfurt). İki task aynı bölümü sırayla düzenler; bu task önce koşar.
- `tests/legal-consistency.test.ts` dal 9 env kapılıdır — tam koşum `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` (bağlama `up -d web` ile gelir, `restart` ile gelmez — CLAUDE.md).
- `CLAIMS.md` tablosu etkilenmez.

---

## Test Kriterleri

- [ ] `npm test` yeşil (yeni dal dahil); dal 9'lu tam koşum yeşil
- [ ] Negatif kontrol gözlendi: fonksiyonun alan kümesi genişleyince dal kırmızı
- [ ] WhatsApp sağlayıcısının ülke beyanı kaynağı ve erişim tarihiyle `legal.ts` dayanak yorumunda
- [ ] 3100: `font-guard.mjs` iki dal yeşil; `/kvkk`'da a11y yeni kalem yok

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-26
