# TASK-2.12: Riskli alt küme taraması — ürünün kendi "bugün yok" işaretlerinden (B-029)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1: Tek kaynak içerik ve iddia sabitleri
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.09 (beş bilinen kalem düzeltilmiş olmalı — tarama kalanı arar)

---

## Hedef

B-029'un beş kalemi bir **taban**; sınıfın kendisi ~124 present-tense yetenek cümlesi. Bu task o sınıfın **riskli alt kümesini** tarar: ürün deposunun kendi "bugün yok" işaretlerinden ("Yakında", "v1.5", "W8", "ertelendi") konu sözcükleri çıkarılır, sitede o konulara değen cümleler bulunur ve karşılıksız olanlar düzeltilir.

Task, tarama koşup çıktısı kayda geçtiğinde ve bulunan karşılıksız iddialar düzeltildiğinde tamamlanmış sayılır.

---

## Bağlam

**Ölçülmüş sınıf büyüklüğü** (research 2026-09-22): `src/content/product.ts` 10 modül × ~5 madde + 11 blurb, 4 rol × 5 madde + özet, 8 fayda; `src/content/segments.ts` 32 iddia bloğu — **~124 present-tense yetenek cümlesi**. B-029 beşini yanlış buldu, dördünü doğruladı, **kalanı hiç kontrol edilmedi**. Somut örnek: B-029'un 1. kalemi `product.ts:129/133/135` olarak sayılmış; aynı yeteneği `product.ts:23-24` (üye rolü maddeleri) ve `chat.ts:97` de present-tense anlatıyor ve bunlar listede yok.

**Kapsam kararı** (kullanıcı kararı, research 2026-09-22): ~124 cümlenin tamamı bu fazda doğrulanmaz — **riskli alt küme** taranır. Gerekçe: tam doğrulama (b) seçeneğiydi ve içerik mimarisinin yeniden kurulmasını gerektiriyor; bu faz iddianın doğruluğunu düzeltir.

**Yöntem (c):** ürün deposu bugün-yok kalemlerini **adıyla aranabilir** notlarda taşıyor — B-029 dördünü tam da böyle buldu. O notlardan konu sözcükleri çıkarılır, sitede o konulara değen cümleler taranır. Sonuç beş cümleden geniş, 124'ten dar bir alt kümedir.

**Kalıcı kapı bu fazda kurulmuyor:** ürün-deposu çapraz kontrolü M6 F6.4'ün kapsamı (`modules/M6-Kalite-Kapilari.md`). Bu task'ın taraması **bir kerelik ölçümdür**; çıktısı kayda geçer, betiği kalıcılaşmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md` → Kök Neden Yönü (ikinci katman: aranabilir notlar)
- `_dev/phases/PHASE-2.md` → Dikkat Edilecekler → "Beş karşılıksız yetenek iddiası bir taban, tavan değil"
- `_dev/docs/CLAIMS.md` — düzeltmenin sınırı
- `../Alpfit.v1` (salt okunur) — tarama kaynağı
- `_dev/tasks/TASK-2.08.md` → Oturum Kaydı — kademeler; bulunan kalem "yolda"ya taşınabilir

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-029-*.md` — **B-029 bu task'ta kapanır**; kapanış kaydı taranan ve **taranmayan** yüzeyi açıkça yazar (kalan yüzey kanvasta durur)
- `_dev/BULGULAR.md` → Gelen Kutusu — taramanın bulduğu ama bu fazın kapsamına girmeyen kalemler `[TASK-2.12]` işaretli satırlarla

---

## Alt Görevler

- [ ] **1. Konu sözcüklerini çıkar**
  - `../Alpfit.v1` içinde "Yakında", "v1.5", "W8", "ertelendi" gibi işaretleri taşıyan notlar bulunur (kod yorumu, i18n metni, servis başlığı)
  - Her nottan bir **konu sözcüğü kümesi** türetilir (ör. "ölçüm grafiği", "kampanya", "revoke", "iptal eşiği")

- [ ] **2. Sitede tara**
  - `src/content/*` ve bileşenlerde o konulara değen present-tense cümleler bulunur
  - Her vuruş üç sonuçtan birine ayrılır: **karşılıksız** (düzeltilecek) · **karşılığı var** (dokunulmaz) · **belirsiz** (kullanıcıya ya da kanvasa)

- [ ] **3. Karşılıksızları düzelt**
  - Düzeltme TASK-2.09'un deseniyle aynı: ya ifade daraltılır ya "yolda" işaretiyle ayrışır
  - **Kapsam kapısı:** bulgu sayısı task sınırını (1-3 dosya, tek oturum) aşarsa iş bölünür — `run-task` → plan revizyonu rotası işletilir, burada zorlanmaz

- [ ] **4. Kapsamı dürüstçe kaydet**
  - Taranan yüzey ve **taranmayan** yüzey rakamıyla yazılır (ör. "32 segment bloğunun N'si konu sözcüğüne değdi, kalanı taranmadı")
  - B-029'un kapanış kaydı bu ayrımı taşır — "hepsi doğrulandı" denmez

---

## Etkilenen Dosyalar

```
src/content/
├── product.ts      # taramanın bulduğu kalemler — zaten var
├── segments.ts     # taramanın bulduğu kalemler — zaten var
└── chat.ts         # taramanın bulduğu kalemler (ör. chat.ts:97) — zaten var
```

Tarama betiği scratchpad'de kalır; `research/`'e kalıcı dosya konmaz.

---

## Dikkat Noktaları

- **Bu bir keşif ayağıdır.** Çıktısı kalan task'ların doğruluğunu değiştirebilir; o hâlde `run-task`'ın plan revizyonu rotası işletilir (TASKS-README → Sorun Giderme). Kapsamı sessizce büyütme.
- **"Belirsiz" kalem uydurulmaz.** Ürün kodunda karşılığı bulunamayan ama yanlış olduğu da gösterilemeyen cümle kanvasa düşer, sessizce silinmez (`ILKELER.md` → "Kanıtsız iddia yayınlanmaz" tersine de çalışır: kanıtsız **silme** de yapılmaz).
- **Ürün kodu salt okunurdur.**
- **Tarama kalıcılaşmıyor** — kalıcı kapı M6 F6.4. Betiği `research/scripts/`'e koyma; o iş "Kalite kapıları otomatik" fazının.
- **Ton değişmez** (F1.2 başka faz).
- Taramanın **kaçırdıkları** da kayda değer: yöntem konu sözcüğüne dayanıyor, ürünün not tutmadığı bir eksik bu yolla bulunamaz — sınır kapanış kaydında yazılır.

---

## Test Kriterleri

- [ ] Tarama koştu; konu sözcüğü kümesi ve her kümenin site vuruşları **rakamıyla** dokümanda
- [ ] Her vuruş üç sonuçtan birine ayrıldı (karşılıksız / karşılığı var / belirsiz) ve karşılıksızların tamamı düzeltildi
- [ ] Bilinen çapa yeniden sınandı: `product.ts:23-24` ve `chat.ts:97` (B-029 kalem 1'in listede olmayan kardeşleri) tarama tarafından **bulundu** ve ele alındı
- [ ] Taranmayan yüzey açıkça yazıldı; B-029'un kapanış kaydı "hepsi doğrulandı" demiyor
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` dokunulan rotalarda konsol temiz
- [ ] Belirsiz kalanlar `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.12]` işaretiyle düştü

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
