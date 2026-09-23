# TASK-3.23: `font-guard` ikinci dal kazanır — küme dosyasındaki her karakter woff2'de gerçekten var mı

**Durum:** ⬜ Bekliyor
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F5.3 Font daraltma
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.22 ✅

---

## Hedef

`font-guard.mjs` bugün yalnız *"site metni ⊆ küme dosyası"* doğruluyor. *"Küme ⊆ woff2 glifleri"* hiç doğrulanmıyor — yani üretim (`font-subset.mjs`) ile tüketim arasındaki **sözleşme** ölçülmüyor. İkinci dal eklenir: küme dosyasındaki her karakterin üretilen woff2'lerde gerçekten bulunduğu doğrulanır.

Ölçüldü: **Sora 700 ve Sora 800'de `₺` (U+20BA) ve dört ok (`←↑→↓`, U+2190-2193) yok** — ilki Unifont'a, okları Liberation Serif'e düşüyor. `₺`'nin yokluğu STYLE-GUIDE'da kayıtlı ve Inter yedeği bilinçli; **okların yokluğu hiçbir yerde kayıtlı değil.**

---

## Bağlam

B-046 kalem (4). Milestone bu dalı adıyla istiyor: *"yazı tipi kümesindeki her karakterin dosyada gerçekten bulunduğu doğrulandı."*

**Bugün vekil doğru ve bu kaydedilir:** dev sunucusuna karşı koşturulan eşdeğer ölçüm (16 sayfa, asistan paneli açık, 79.685 karakter) kümede olmayan karakter bulmadı — yani F5.3'ün mevcut kriteri karşılanıyor. Eksik olan, kümenin kendisinin fonta karşı doğrulanması.

**Küme tarafı doğrulandı** (araştırma): `₺` ve dört ok kümede **var** (153 karakter) ve font dosyaları daraltma commit'inden beri **hiç değişmedi** — yani beyan ↔ font sözleşmesindeki boşluk aynen duruyor.

**Kapsam notu:** `font-guard.mjs`'in çıkış kodu ve kapsam eşikleri bu fazın dışında ("Kalite kapıları otomatik") — betik zaten çıkış kodu veren tek kapı (`:52 process.exitCode = 1`), yeni dal aynı mekanizmayı kullanır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (4), ölçüm yöntemi (CDP `CSS.getPlatformFontsForNode`)
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.3 kabul kriterleri
- `_dev/docs/STYLE-GUIDE.md` — Sora'da ₺ yok, Inter yedeği kaldırılmaz

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.3'e ikinci dal kriteri
- `_dev/modules/M6-Kalite-Kapilari.md` — **regresyon çizgisi tablosu yenilenir** (aşağıda → Alt Görev 5)
- `_dev/docs/STYLE-GUIDE.md` — okların Sora'da bulunmadığı (bugün hiçbir yerde kayıtlı değil)

---

## Alt Görevler

- [ ] **1. İkinci dalı yaz**
  - Küme dosyasındaki her karakter için üretilen woff2'lerde glif var mı: `document.fonts.check()` ya da CDP `CSS.getPlatformFontsForNode` (yeni bağımlılık gerekmez)
  - Ölçüm **yedeksiz** `font-family` ile yapılır, yoksa yedek gerçeği örter (araştırmanın yöntemi: karakter başına bir `<span>`)
  - Her font dosyası ve ağırlığı ayrı ayrı sınanır (Sora 700 · Sora 800 · Inter 400/500/600)

- [ ] **2. Muafiyet listesi**
  - Bilinçli yedeklenen karakterler adıyla durur (bugün `₺` — Inter yedeği bilinçli, STYLE-GUIDE'da kayıtlı)
  - Muafiyet **adıyla** yazılır, sınıf olarak değil

- [ ] **3. Dört oku karara bağla**
  - İki yol: kümeden düşürmek (sitede kullanılmıyorsa) ya da fontu yeniden üretmek
  - Önce ölç: oklar site metninde gerçekten geçiyor mu? Geçmiyorsa kümeden düşürmek doğru yol
  - Küme değişirse `font-subset.mjs` yeniden koşar

- [ ] **4. Raporla**
  - Çıktı: `küme: N karakter · woff2'de eksik: M (muaf: K)`; muaf olmayan eksik > 0 → çıkış kodu 1

- [ ] **5. Regresyon çizgisini yeni yöntemle yeniden yaz**
  - `modules/M6-Kalite-Kapilari.md` → Teknik Notlar'daki başlangıç tablosu 2026-09-11'de, **8 rotada ve eski yöntemle** ölçüldü; "Kontrast ihlali: 0" ve "Yatay kaydırma: 0" satırları bu fazdan sonra çok daha geniş bir şeyi anlatıyor (16 rota · piksel kontrastı · gradyan metin dalı · başlık hiyerarşisi · kırpılmış taşma · iki kulvarlı dokunma hedefi)
  - Bu task fazın **son kapı task'ıdır** ve bütün düzeltmelerden sonra koşar — satırları dürüstçe yeniden ölçebilecek tek yer burası
  - Üç a11y/mobil satırı yeniden ölçülüp **kapsamıyla birlikte** yazılır ("16 rotada, piksel yöntemiyle"); font satırı bu task'ın kendi ölçümünden gelir. Dokunulmayan satırlar (perf, ağırlık, CLS, üretim derlemesi) **olduğu gibi kalır** — onların yöntemi bu fazda değişmedi (B-035 kapsam dışı)
  - Gerekçe: bir sonraki faz (F6.2 tek komut) eşiklerini doğrudan bu tablodan alacak

---

## Etkilenen Dosyalar

```
research/scripts/font-guard.mjs        # ikinci dal + muafiyet listesi
research/FONT-KARAKTER-KUMESI.txt      # oklar düşürülürse
public/fonts/                          # font-subset.mjs yeniden koşarsa (betik çıktısı, elle düzenlenmez)
```

---

## Dikkat Noktaları

- **`public/fonts/` elle düzenlenmez** — `font-subset.mjs` üretir (CLAUDE.md → Dokunulmazlar).
- **Yedeksiz ölçüm şart.** Yedekli `font-family` ile ölçersen `₺` Inter'den gelir ve Sora'da varmış gibi görünür.
- **CDP bazı karakterlerde boş liste döndürebilir** (araştırmada iki karakterde oldu, sonuçsuz) — sonuçsuz kalemler **ayrı** raporlanır, "var" sayılmaz.
- **`₺`'nin fiilî hâli:** `--font-display` + `font-weight:800` bağlamında `₺` Inter SemiBold (600), yanındaki rakamlar Sora ExtraBold (800). Yedek çalışıyor (sistem fontuna düşmüyor) ama aynı satırda hem aile hem **ağırlık** değişiyor. Bu bir gözlemdir; düzeltmesi bu task'ın kapsamı değil — kayda geçer.
- **Küme küçülürse font yeniden üretilir ve ağırlık değişir** — `perf.mjs` ile ölçülür (bugün 5 dosya, 95 KB).
- **`font-guard` yayın kopyasını ölçüyor** (zaten öyle) — `docker compose --profile prod up -d web-prod`; `BASE` env'i ile yönlendirilebilir.

---

## Test Kriterleri

- [ ] İkinci dal koşuyor ve küme dosyasındaki 153 karakterin hepsini font dosyalarına karşı sınıyor
- [ ] Sora 700/800'de dört okun eksikliği yakalanıyor (dal kurulduğunda kırmızı dönüyor)
- [ ] `₺` muafiyet listesinde adıyla duruyor ve kırmızıya düşürmüyor
- [ ] Oklar karara bağlandı; kümeden düşürüldüyse `font-subset.mjs` koştu ve font dosyaları yeniden üretildi
- [ ] Muaf olmayan eksik kalmadığında çıkış kodu **0**; deneysel olarak kümeye olmayan bir karakter eklendiğinde **1**
- [ ] Birinci dal (site metni ⊆ küme) hâlâ çalışıyor ve 16 sayfada eksik karakter bulmuyor
- [ ] Font ağırlığı ölçüldü (`perf.mjs`); 95 KB tabanına göre değişim rakamıyla kaydedildi
- [ ] M6'daki regresyon çizgisinin a11y/mobil/font satırları yeni yöntemle yeniden ölçülüp **kapsam ibaresiyle** yazıldı; dokunulmayan satırlar değişmedi

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

**Oluşturulma:** 2026-09-23
