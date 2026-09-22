# TASK-2.10: `/ozellikler` ve Kurucu Programı tek kaynaktan okur (B-040)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M2 render yüzeyi
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.08 (sabit) · TASK-2.09 (düzeltilmiş kalemler)

---

## Hedef

Yol haritasının **iki bileşen-içi kopyasını** kaldırmak: `/ozellikler` sayfasının üç kolonu ve `FounderProgram`'ın üç `StatusRow`'u artık `product.ts`'teki sabitten okur.

Task, iki dosyada da elle yazılmış kalem listesi kalmadığında ve render edilen metin sabitle birebir uyuştuğunda tamamlanmış sayılır.

---

## Bağlam

İki kopya **bileşende** yaşıyor — yani `src/content/` düzenleyen biri onları hiç görmüyor (B-039'un doğrudan sonucu). Ayrışma birebir ölçülü: `/ozellikler` 5 yol-haritası kalemi sayıyor, `FounderProgram` 4 ("Kurumsal üyelik" yok).

`FounderProgram.tsx:83`'te ayrıca elle yazılmış bir **"v1 hazır"** başlığı var; `PRODUCT_STATUS.version` ve `.short` alanlarının bugün hiç tüketicisi yok. TASK-2.08'in kararı bu task'ta uygulanır (bağlanır ya da silinmiş olur).

**Kurucu Programı bölümünün altındaki "yüzde kaç ciro artışı söylemiyoruz" paragrafı korunur** — o, iddia sınırının kendi beyanıdır (`FounderProgram.tsx:99-101`).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-040-urun-yol-haritasi-dort-evde.md` — ayrışma tablosu
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — sabitin adı, kademeleri ve türetme fonksiyonu
- `_dev/docs/STYLE-GUIDE.md` — kullanıcının reddettiği kalıplar (kolon kartlarının görünümü **değişmez**)
- `src/app/ozellikler/page.tsx:80-140` · `src/components/sections/FounderProgram.tsx:78-100`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum

---

## Alt Görevler

- [ ] **1. `/ozellikler` üç kolonunu sabitten besle**
  - `page.tsx:96-124` içindeki elle yazılmış `items` dizileri kalkar; kolonlar sabitin üç kademesinden okur
  - Kolon etiketleri ("Bugün var" / "Yolda" / "Yol haritasında") ve görünüm **değişmez**
  - Bölüm başlığındaki taahhüt (*"Yolda olan bir şeyi bugün varmış gibi anlatmıyoruz"*) yerinde kalır ve artık yapısal olarak karşılanır

- [ ] **2. `FounderProgram`'ın üç satırını sabitten besle**
  - `StatusRow` gövdeleri düzyazı; sabitin kalemleri türetme fonksiyonuyla virgülle bağlanır
  - "v1 hazır" başlığı TASK-2.08'in kararına göre `PRODUCT_STATUS`'tan okur ya da elle kalır (karar oradaysa uygulanır)

- [ ] **3. Render teyidi**
  - İki yüzeyde de kalem sayısı ve sırası sabitle aynı; "Kurumsal üyelik" artık **iki yüzeyde de** görünüyor (ya da sabitte yoksa hiçbirinde)

---

## Etkilenen Dosyalar

```
src/app/ozellikler/
└── page.tsx                            # üç kolon sabitten okur — zaten var
src/components/sections/
└── FounderProgram.tsx                  # üç StatusRow sabitten okur — zaten var
```

---

## Dikkat Noktaları

- **Görünüm değişmez.** Bu bir içerik-kaynağı işidir; kart düzeni, renkler ve `Reveal` animasyonu aynı kalır. Kullanıcının reddettiği kalıplara kayma (jenerik ikon kartı, rozet) olmaz — `docs/STYLE-GUIDE.md`.
- **Metin uzunluğu değişirse mobil satır kırılması yeniden ölçülür** (`min-w-0` tuzağı, `mobile-audit.mjs`).
- **Sabitte olmayan bir kalemi bileşende ekleme.** Ayrışmanın kaynağı tam olarak buydu.
- `FounderProgram` koyu zeminde çalışıyor — metin uzunluğu artarsa kontrastı değil **yerleşimi** kontrol et (`a11y.mjs` kontrastı zaten ölçüyor).

---

## Test Kriterleri

- [ ] `grep` ile teyit: `ozellikler/page.tsx` ve `FounderProgram.tsx` içinde elle yazılmış yol-haritası kalemi **kalmadı** (B-040'ın kanıt komutu yeniden koşulur, iki ev düşmüş olmalı)
- [ ] İki yüzeyde render edilen kalemler sabitle birebir aynı (sayı ve sıra dokümana yazılır)
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız (23 rota)
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` `/` ve `/ozellikler` konsol temiz
- [ ] `mobile-audit.mjs` yatay kaydırma: yok (390 px'te iki yüzey de kontrol edildi)

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
