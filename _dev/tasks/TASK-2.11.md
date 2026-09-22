# TASK-2.11: Chat, SSS ve fiyat sayfası tek kaynaktan okur (B-040, B-014)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri · F1.3: Chat bilgi ağacı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.08 (sabit) · TASK-2.10 önerilir (türetme fonksiyonu orada bir kez sınanmış olur)

---

## Hedef

Yol haritasının kalan üç kopyasını kaldırmak: `chat.ts`'in "Ürün hangi aşamada?" cevabı, `faq.ts`'in aynı sorusu ve fiyat sayfasının `NOT_INCLUDED` listesindeki iki "(yol haritasında)" kalemi artık `product.ts`'teki sabitten türer.

Task, üç evde de elle yazılmış kalem listesi kalmadığında ve chat ağacının modül sayımı `PRODUCT_STATUS`'tan geldiğinde tamamlanmış sayılır.

---

## Bağlam

Üç ev bugün üç farklı sayı taşıyor: `chat.ts:127` ve `faq.ts:48` üçer kalem ("Apple Health ve Google Fit" yok), fiyat sayfası iki kalem. Ayrıca `chat.ts:126` `PRODUCT_STATUS.modules`'ün sekiz modüllük düzyazısını **elle kopyalamış** — bu B-014'ün kendisi ve aynı hamlede kapanabilir.

Fiyat sayfasının listesi bir alt kümedir: `NOT_INCLUDED` yalnız "pakete dâhil değil" bağlamında iki kalemi anıyor. Sabitten **türetilir** ama kendi bağlam metnini (ücretlendirme) korur.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-040-urun-yol-haritasi-dort-evde.md` · `_dev/bulgular/B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md`
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — sabit ve türetme fonksiyonu
- `_dev/docs/CLAIMS.md` → Tek Kaynaklar — chat cevaplarının sınırı; fiyat rakamı `monthlyFor()`'dan gelir
- `src/content/chat.ts:120-131` · `src/content/faq.ts:46-49` · `src/app/fiyat/page.tsx:29-34`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-040-*.md` — **B-040 bu task'ta kapanır** (beş evin beşi bağlandı); `_dev/bulgular/B-014-*.md` — modül sayımı ayağı kapanırsa Çözüm Kaydı

---

## Alt Görevler

- [ ] **1. `chat.ts` "asama" düğümü**
  - Modül sayımı `PRODUCT_STATUS.modules`'ten, yolda/yol haritası kalemleri sabitten türer
  - Pilot cümlesi `PRODUCT_STATUS.sentence`'tan gelir (B-014'ün asıl şikâyeti)
  - Ağacın çıkış disiplini korunur: cevap ya devam sorusu ya kişiye bağlantı taşır (F1.3 kabul kriteri)

- [ ] **2. `faq.ts` "Ürün hangi aşamada?"**
  - Aynı türetme; bugün zaten `PRODUCT_STATUS.sentence` kullanıyor, kalem listesi de sabitten gelir

- [ ] **3. Fiyat sayfası `NOT_INCLUDED`**
  - "(yol haritasında)" ekli iki kalem sabitin yol-haritası kademesinden türer; kalan iki kalem (markalı uygulama, web sitesi yapımı) **yol haritası değil**, oldukları gibi kalır
  - Fiyat rakamları `PRICING`/`monthlyFor()`'dan gelmeye devam eder — bu task oraya dokunmaz

---

## Etkilenen Dosyalar

```
src/content/
├── chat.ts            # asama düğümü sabitten türer — zaten var
└── faq.ts             # aynı soru sabitten türer — zaten var
src/app/fiyat/
└── page.tsx           # NOT_INCLUDED'ın iki kalemi türetilir — zaten var
```

---

## Dikkat Noktaları

- **Chat cevabı bir iddia yüzeyidir.** `docs/CLAIMS.md` sınırı burada da geçerli; ileride model bağlandığında (M4 F4.2) bu ağaç sistem talimatının bilgi tabanı olur — yanlış kalem oraya da taşınır.
- **Düzyazı akıcı kalmalı.** Türetme virgülle bağlıyor; cümle sonu, "ve" bağlacı ve büyük harf başlangıcı türetme fonksiyonunda çözülür, çağrı yerinde elle düzeltilmez.
- **`NOT_INCLUDED` bir alt kümedir** — sabitin tamamını oraya dökme; fiyat bağlamına giren iki kalem türetilir.
- **Font kümesi:** yeni karakter girerse `font-guard.mjs` yakalar; küme `research/FONT-KARAKTER-KUMESI.txt` + `font-subset.mjs` ile genişletilir (`CLAUDE.md`).
- Asistan arayüzü (M4) bu task'ın konusu değil — yalnız ağacın içeriği değişir.

---

## Test Kriterleri

- [ ] B-040'ın kanıt komutu (`grep -rn "Online ödeme\|QR ve turnike\|Apple Health\|yapay zekâ analiz\|Kurumsal üyelik" src/`) artık **yalnız sabiti** buluyor; beş evin hiçbirinde elle liste yok
- [ ] Chat ağacında "Ürün hangi aşamada?" cevabı sabitle ve `PRODUCT_STATUS` ile birebir uyumlu; ağaçta çıkışsız düğüm yok
- [ ] Fiyat sayfasında "(yol haritasında)" kalemleri sabitten türüyor; fiyat rakamları hâlâ `monthlyFor()`'dan geliyor
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` `/`, `/fiyat` ve asistan açıkken konsol temiz
- [ ] `docs/CLAIMS.md` tablosuna aykırı yeni cümle yok

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- run-task dolduracak -->

---

## Sonuç Özeti

<!-- Task tamamlanınca doldurulacak -->

---

**Oluşturulma:** 2026-09-22
