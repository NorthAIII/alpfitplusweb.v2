# TASK-4.02: Geçiş doğrulama betiği (1/2) — v1'in adres envanteri ve tek atlamalı yönlendirme ölçümü

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md) · kapsam sözleşmesi M6 F6.1
**Feature:** F7.5 Alan adı geçişi ve 301 haritası
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.01 ✅ (dal önizlemesi ve atlatma anahtarı — betiğin ikinci hedefi)

---

## Hedef

Geçişin ölçüm kanalı olan betiğin ilk yarısı: `research/scripts/gecis-dogrula.mjs` ve envanter modülü. v1 canlısından ölçülen adres kümesinin **her kalemi** için beklenen durum kodunu, `Location`'ı, **tek atlamayı** ve hedefin 200'ünü ölçer; kendi kapsamını eşikler ve sıfır-olmayan çıkış koduyla kırmızıya düşer. Üç hedefe koşar: yerel yayın kopyası (3100, varsayılan) · dal önizlemesi (atlatma başlığıyla) · canlı.

Bu task yalnız **yönlendirme dalını** kurar; başlık, dizin ve paylaşım kartı dalları TASK-4.03. Tamam sayılır: betik 3100'e karşı koşar ve bugünkü gerçeği (kurallar henüz yok) **kırmızı** olarak, kalem kalem basar; kapsam eşiği ve iki negatif kontrol sınanmış.

---

## Bağlam

Kanal kullanıcı kararı (`docs/DECISIONS.md` 2026-09-26 md. 9): elle `curl` yerine betik, çünkü aynı ölçüm üç kez (yerel → dal önizlemesi → canlı, geçişin öncesi ve sonrası) koşacak ve yayın kapısının parçası olacak. Vitest bu katmanı ölçemez — Vercel kenarını, gerçek alan adını ve alan adı düzeyi yönlendirmeyi görmez (araştırma → Ölçüm katmanı).

**Kapı önce, düzeltme sonra** (Faz 3 deseni): TASK-4.04'ün 301 kuralları ve TASK-4.05'in ikonları bu betiğe karşı hem tanımlanır hem doğrulanır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler — **adres envanteri tablosu** (45 ayrık kalem + iki biçim) ve Ölçüm katmanı paragrafı
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 kabul kriterleri — EN → TR eşleme tablosu
- `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar → Rota kaynağı ve ölçüm hedefi — kapsam eşiği sözleşmesi, `BASE` deseni
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md` — konteynerde betik koşturma; "bulamayan betik yeşil bırakır"
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — 3100'ün bayatlığı ve tazeleme

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M6-Kalite-Kapilari.md` → Teknik Notlar — yeni betiğin adı, geçme şartı ve bugünkü (kırmızı) çizgisi; tek komut/CI'a devri "Kalite kapıları otomatik" fazına

---

## Alt Görevler

- [ ] **1. Envanter modülü** — `research/lib/gecis-envanteri.mjs` (YENİ)
  - PHASE-4 tablosunun her satırı veri olarak: grup · adres · beklenen (`200` | `301 → hedef` | `404` | `düşer`) · ölçüm tarihi (2026-09-26) ve kaynağı.
  - EN eşlemesi M7 F7.5 kriterinden: `/en/` ve `/en` → `/` · `/en/features` → `/ozellikler` · `/en/pricing` → `/fiyat` · `/en/segments` → `/segmentler` · `/en/demo` → `/demo` · `/en/support` → `/destek` · `/en/kvkk` → `/kvkk` · `/en/privacy` → `/gizlilik` · `/en/terms` → `/kullanim-kosullari`.
  - Biçim grubu: v1'in 18 sayfasının (TR 9 + EN 9; `/404` ve `/en/404` hariç) `/x/` ve `/x/index.html` hâlleri → **tek atlamada nihai hedef** (EN'de Türkçe karşılık; `/x/` bir ara durak değildir).
  - Host grubu (`www.alpfitplus.com` · `alpfitplus-web-v2.vercel.app` · `alpfitplus-website.vercel.app`) ayrı işaretlenir: yalnız canlı hedefte ve `HOST` kipinde ölçülür.
  - ⚠️ **Envanter uygulamadan türetilmez** — `next.config.ts`'ten ya da TASK-4.04'ün kural tablosundan okumak kapıyı kendini doğrulayan hâle getirir. Kâhin v1'in canlısıdır; ölçüldü ve donduruldu (memory `urun-iddiasi-capa-dogrulamasi.md` → kapı gerçeğin kaynağından türetilir).

- [ ] **2. Ek adres girişi** — `research/gecis-ek-adresler.txt` (YENİ; başlangıçta yalnız açıklama satırları)
  - Search Console'un dizin listesi ve Umami'nin en çok gezilen adresleri TASK-4.17'de buraya girer (satır başına yol + beklenen).
  - Beklentisi yazılmamış satır "sınıflandırılmamış" diye raporlanır ve **kırmızı** sayılır — sessiz geçmez.

- [ ] **3. Ölçüm çekirdeği** — `research/scripts/gecis-dogrula.mjs` (YENİ)
  - Her kalem: `redirect: manual` → kod + `Location`; 3xx ise hedefe **bir istek daha** → 200 ve 3xx değil (tek atlama). Göreli/mutlak `Location` normalize edilir; hedefin hostu beklenen host (canlıda `alpfitplus.com`, yerelde `BASE`'in hostu).
  - `404` beklenen kalem 404 döner, 200 değil (yumuşak 404 yakalanır).
  - `düşer` kalemleri (v1 yazı tipleri) raporlanır, kapıyı düşürmez.

- [ ] **4. Hedef ve kipler**
  - `BASE` env (varsayılan `http://localhost:3100`).
  - `VERCEL_AUTOMATION_BYPASS_SECRET` env tanımlıysa her isteğe `x-vercel-protection-bypass` başlığı — değer hiçbir çıktıya basılmaz.
  - `HOST` env → `Host` başlığını ezer (yerelde `.vercel.app` kuralını sınamak için; TASK-4.04). Node `fetch` `Host`'u ezmeye izin vermeyebilir — `node:http`/`https` isteğiyle yazılır ya da ölçülür.
  - Çıktı: grup başına ölçülen / geçen / kalan, kalem kalem kırmızılar; son satır `✓ KAPI YEŞİL — N kalem` ya da `✗ …`; çıkış kodu 0/1.

- [ ] **5. Kapsam eşiği ve negatif kontroller**
  - Ölçülen kalem sayısı envanter büyüklüğünün altına düşerse (zaman aşımı, ağ hatası) kırmızı; **0 kalem kırmızıdır** (M6 F6.1).
  - (a) Boş envanterle çağrı → kırmızı; (b) bilinçli yanlış beklentili tek sonda kalemi → kırmızı. İkisi de koşulur, çıktısı kayda girer; sonda kalıcı değildir.

- [ ] **6. Başlangıç çizgisi** — 3100'e (taze imaj) karşı koş, bugünkü tabloyu kaydet: EN, tarama, head/og ve biçim kalemleri kırmızı; TR 9 sayfa + manifest 4 + ürün görseli 6 yeşil. TASK-4.04 ve 4.05 bu çizgiyi yeşile çevirir.

---

## Etkilenen Dosyalar

```
research/
├── lib/gecis-envanteri.mjs      # YENİ — dondurulmuş v1 envanteri + beklenenler
├── scripts/gecis-dogrula.mjs    # YENİ — ölçüm çekirdeği, kipler, eşik
└── gecis-ek-adresler.txt        # YENİ — Search Console / Umami eki (4.17 doldurur)
```

---

## Dikkat Noktaları

- Araştırma konteyneri depoyu değil yalnız `./research`'ü görür (`docker-compose.yml` → `research.volumes`) — `src/` import edilemez; envanterin bağımsızlığı zaten bunu ister.
- Konteyner `network_mode: host` — 3100 ve dış adresler erişilebilir; dış isteklere zaman aşımı tavanı yaz, aşılırsa kalem "ölçülemedi" olur ve kapsam eşiğine sayılır.
- 3100 bayat olabilir: koşmadan önce `docker compose build web-prod && docker compose --profile prod up -d web-prod` (build tek başına konteyneri yeniden yaratmaz).
- 3100'de aşama `local` — yönlendirme dalı aşamadan bağımsızdır; `.vercel.app` kuralı aşamaya bağlı olacağı için (TASK-4.04) yerelde ancak üretim benzeri derlemede ölçülür.
- Bugün Next'in kendi eğik-çizgi çevrimi **308** veriyor (`/fiyat/` → 308 → `/fiyat`); bu betik onu kırmızı sayar (beklenen 301, tek atlama) — doğru kırmızıdır.
- v1'in canlısı geçişten sonra apex'te yok; envanter bu yüzden dondurulur, çalışma anında v1'den türetilmez.

---

## Test Kriterleri

- [ ] 3100'e karşı koşum: çıkış kodu **1**; kırmızı listesi araştırma tablosunun "v2 bugün" sütunuyla kalem kalem örtüşüyor (ör. `/en/pricing` 404 · `/sitemap-index.xml` 404 · `/favicon.ico` 404 · `/fiyat/` 308)
- [ ] TR 9 sayfa + manifest 4 + ürün görseli 6 kalemi yeşil
- [ ] Kapsam satırı ölçülen kalem sayısını basıyor ve envanter büyüklüğüne eşit
- [ ] Negatif kontrol (a) boş envanter → kırmızı + çıkış 1; (b) yanlış beklenti → kırmızı — ikisi de gözlendi
- [ ] `HOST` kipinde isteğin `Host` başlığını gerçekten taşıdığı gösterildi (sunucunun yanıtında ayırt edilebilir bir izle)
- [ ] Atlatma değişkeni tanımlıyken çıktıda değer yok (`grep` ile)

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
