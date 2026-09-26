# TASK-4.14: Fonksiyon bölgesi Frankfurt — `vercel.json`, yasal metnin bölge cümlesi ve dal 8 aynı işte

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md) · M1 (yasal metin)
**Feature:** F7.3 Vercel'de ayrı proje · F1.1 (yasal metin)
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.13 ✅ (aynı Aktarım bölümünü sırayla düzenler) · TASK-4.01 ✅ (dal önizlemesi — "önce" ölçümü)

---

## Hedef

Form ucunun çalıştığı bölge Washington'dan (`iad1`) Frankfurt'a (`fra1`) taşınır — **depoda**: `vercel.json` (YENİ) → `{ "regions": ["fra1"] }`. Aynı işte:

- `legal.ts` → Barındırma satırı (*"Washington, D.C. bölgesindeki sunucularında çalışır"*) ve "Bu listenin pratik karşılığı" paragrafı (*"önce Amerika Birleşik Devletleri'ndeki form ucumuzda işlenir"*) Frankfurt'a göre yeniden yazılır — Vercel ABD merkezli kalır; **şirketin ülkesi ile işlemenin bölgesi ayrı sorulardır**.
- `tests/legal-consistency.test.ts` **dal 8 iki yönlü** yeniden yazılır: `vercel.json` → `regions` ile metnin bölge cümlesi eşlenir; bölge değişip metin kalırsa ya da metin değişip bölge kalırsa kırmızı.

Tamam sayılır: dal 8 yeşil ve iki yönlü negatif kontrolü görülmüş; "önce" gecikme çizgisi kayıtta. Bölgenin dağıtımda gerçekten `fra1` olduğu TASK-4.17'de ölçülür.

---

## Bağlam

Kullanıcı kararı 2026-09-23 (`BULGULAR.md` → Gelen Kutusu `[audit-product SORU]`), kapsam tartışmasında bu faza alındı. `docs/DECISIONS.md` 2026-09-26 md. 5: bölge **depoda** sabitlenir, panelde değil — yasal metnin bölge cümlesini çivileyen test yalnız depoyu görebilir; panel ayarı değişip metin eskide kalsa test yeşil kalırdı.

Bugünkü dal 8 **`vercel.json`'un yokluğunu** ve "Washington, D.C." parçasını çiviliyor — bölge değişince **tasarımı gereği** kırmızı döner. **Sıra şartı:** Frankfurt + yasal metin + dal 8 **aynı yayında** — iki dal düzeninde üçü aynı `dev` → `main` birleştirmesiyle çıkar (TASK-4.18).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Değerlendirilen Yaklaşımlar (fonksiyon bölgesi) · Dikkat Edilecekler → Sıra şartları ("Frankfurt + yasal metin + test dal 8 aynı yayında") · `PHASE-4.md` → Teknik Kararlar 5
- `src/content/legal.ts` — dayanak yorumu (TASK-2.17 ölçüm bloğu: "repoda `vercel.json` YOK") ve Aktarım bölümü
- `tests/legal-consistency.test.ts` → dal 8 (plan anında `:720-756`)
- `_dev/memory/vercel-proje-kimlikleri.md` — `vercel api`, atlatma anahtarının evi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/BULGULAR.md` → Gelen Kutusu `[audit-product SORU]` (Frankfurt) — uygulandı, mezun
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.3 — bölgenin evi (`vercel.json`) ve yasal metinle bağı

---

## Alt Görevler

- [ ] **1. "Önce" çizgisi** — `/api/demo` `422` yolu (kayıt yazmaz; ör. boş gövdeli geçerli JSON) ×3: `x-vercel-id` ve TTFB — üretim `.vercel.app` ve dal önizlemesi (atlatma başlığıyla). Araştırmanın değeri: `fra1::iad1::…`, TTFB 0,27-0,40 sn.
- [ ] **2. `vercel.json`** (YENİ) — yalnız `regions`. `vercel.ts` değil: tek alan için `@vercel/config` bağımlılığı gereksiz (araştırma).
- [ ] **3. Metin** — Barındırma satırı ve pratik karşılığı paragrafı; Frankfurt'un şehri/ülkesi Vercel'in bölge belgesinden (kaynak + erişim tarihi dayanak yorumuna). "Yurt dışına aktarım her talepte olan şeydir" cümlesi öznesiyle yeniden ölçülür: işleme Almanya'ya gelse de Vercel, Resend ve Google ABD merkezli — cümlenin doğru kalıp kalmadığı yazılarak gösterilir.
- [ ] **4. Dayanak yorumu** — TASK-2.17 bloğundaki "repoda `vercel.json` ve `preferredRegion` YOK" satırı gerçekle hizalanır.
- [ ] **5. Dal 8** — `vercel.json` okunur, `regions` tek eleman; eşleme (`fra1` → metin parçası) testte; parça KVKK'da tam bir kez; rota düzeyinde `preferredRegion` yok (mevcut dayanak korunur). Negatif kontroller: `regions` `iad1`'e çekilince kırmızı · metin eski cümleye dönünce kırmızı (ikisi de geçici değişiklikle, oturum içinde).
- [ ] **6. "Sonra" ölçümü devri** — bu task'ın push'u dal önizlemesine gider; fonksiyon bölgesinin `fra1` ve TTFB'nin ×3 ölçümü **TASK-4.17**'nin kalemidir (push oturumun son işidir, sonucu beklenmez — COMMIT.md).

---

## Etkilenen Dosyalar

```
vercel.json                           # YENİ — regions: ["fra1"]
src/content/legal.ts                  # Barındırma satırı, pratik karşılığı, dayanak yorumu
tests/legal-consistency.test.ts       # dal 8 iki yönlü
```

---

## Dikkat Noktaları

- Üç değişiklik **aynı commit'te** — ayrı commit'e bölünmez; aynı yayına binmeleri iki dal düzeninde bununla garanti olur.
- `vercel.json` Vercel derlemesini başka hiçbir şekilde etkilememeli (çerçeve tespiti, çıktı dizini, `output`) — yalnız `regions`; dal önizlemesi derlemesinin Ready olması TASK-4.17'de görülür.
- Bölge Hobby'de de değiştirilebilir (belge: Hobby tek bölge) — ücretli plana bağlı değildir.
- Resend, Hetzner, Google Workspace ve Umami satırları değişmez; TASK-4.13'ün WhatsApp ayağına dokunulmaz.
- Dal 9 env kapılıdır — tam koşum `-e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks` ile (CLAUDE.md).
- `422` yolu hız sınırı sayacına girer (IP başına 10 dk'da 5) — ölçüm üç istekle sınırlı kalır.

---

## Test Kriterleri

- [ ] `npm test` yeşil; dal 9'lu tam koşum yeşil
- [ ] Dal 8'in iki negatif kontrolü kırmızı görüldü (bölge kayması · metin kayması)
- [ ] "Önce" çizgisi kayıtta: iki hedefte `x-vercel-id` + TTFB ×3
- [ ] 3100: `font-guard.mjs` iki dal yeşil; `/kvkk` a11y yeni kalem yok
- [ ] Dağıtımda fonksiyon bölgesi `fra1` — **TASK-4.17**'de (gerçek Vercel zinciri)

---

## Risk ve Geri Dönüş Planı

- **`vercel.json` derlemeyi beklenmedik biçimde etkiler:** dal önizlemesinde görülür, canlıya çıkmadan (iki dal); geri alma `vercel.json` silinmesi + metin + dal 8'in birlikte geri alınmasıdır — üçü aynı commit olduğu için tek commit geri alınır (dosya bazlı).

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
