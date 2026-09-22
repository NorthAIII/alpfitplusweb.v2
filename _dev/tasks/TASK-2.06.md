# TASK-2.06: Hatalı alan kendi üstünde görünür — alan bazlı hata metni ve işaret (B-055 a)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.1: Demo formu ve talep ucu
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.05 (odak ve durum mekaniği önce oturur; bu task onun üstüne görsel katmanı koyar)

---

## Hedef

Gören kullanıcının **hangi alanın hatalı olduğunu alanın kendisinde** görmesini sağlamak: hatalı alan görsel işaret alır ve hata metni alanın hemen altında durur. Bugün hatanın tek görsel ifadesi formun sonundaki kutu; odakta olmayan geçersiz alanla geçerli alanın hesaplanmış stili **8 özellikte, 4 genişlikte tıpatıp aynı** (`farklar: []`).

Task, `aria-invalid="true"` taşıyan alan dört genişlikte de ölçülebilir bir görsel farkla ayrıştığında ve alan bazlı hata metni `aria-describedby` ile alanın **kendi** hata düğümünü gösterdiğinde tamamlanmış sayılır.

---

## Bağlam

B-055'in (a) ayağı: `src/` içinde `[aria-invalid]`, `:invalid`, `data-invalid` seçicisi **yok**; sunulan CSS'te bu seçicilerle kural sayısı 0. Tek eşleşme Tailwind preflight'ın Firefox'un yerel kırmızı işaretini **kapatan** `:-moz-ui-invalid { box-shadow: none }` kuralı — yani bugün varsayılan tarayıcı işareti de bilerek kapalı ve yerine bir şey konmamış.

WCAG 3.3.1'in "metinle tanımla" ayağı bugün sağlanıyor (kutu metni hangi alanın bozuk olduğunu söylüyor), eksik olan alanın kendisindeki işaret ve yakınlık.

**Araç (`phases/PHASE-2.md` → Kullanılacak Araçlar):** Tailwind CSS 4'ün `aria-invalid:` varyantı — yeni seçici ya da eklenti gerekmez; renk `neg` / `neg-wash` tokenlarından gelir ve **kontrastı `a11y.mjs` ile ölçülüp rakamıyla CSS yorumuna yazılır** (STYLE-GUIDE geleneği).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-055-demo-formu-hata-akisi-mobilde-gorunmuyor.md` → (a) ayağı ve koruma önerisi
- `_dev/docs/STYLE-GUIDE.md` — `neg` / `neg-wash` tokenları, "yeni renk eklerken kontrastı ölç, rakamı yoruma yaz"
- `src/components/sections/DemoForm.tsx:195-200` (`field` sınıf dizgesi), `:270-310` (alan bileşeni, `describedBy` kurulumu)
- `src/app/globals.css` → `@theme` (token değerleri; çelişkide CSS kazanır)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-055-*.md` — **atom bu task'ta kapanır** (altı mekanik ayak TASK-2.05'te, görsel ayak burada); Çözüm Kaydı iki task'ı birlikte anar
- `_dev/docs/STYLE-GUIDE.md` — yeni hata durumu deyimi tek satır (ölçülen kontrast rakamıyla)

---

## Alt Görevler

- [ ] **1. `aria-invalid` alanına görsel işaret ver**
  - Alan bileşeninin `field` sınıf dizgesine `aria-invalid:` varyantıyla `neg` tabanlı halka/kenar eklenir
  - **Odakta olmayan** geçersiz alan da ayrışmalı — bugünkü körlük tam olarak orada (ölçüm odakta olmayan alanla yapıldı)
  - Rıza kutusu (`consent`) da kapsanır — o da `aria-invalid` taşıyor
  - Kontrast ölçülür, rakam sınıfın yanındaki yoruma yazılır

- [ ] **2. Alan bazlı hata metni**
  - Her alanın kendi hata düğümü (`<alan>-error`) olur; `aria-describedby` genel kutu kimliği yerine **kendi** düğümünü gösterir (ipucu düğümü korunur)
  - Metin uçtan gelen mesajdan türer; **uç mesajını bileşende yeniden yazma** (bugünkü kural: "mesaj metni uçtan gelir, burada tekrarlanmaz")
  - Genel kutu **özet olarak kalır** (koruma önerisi böyle diyor) ve WhatsApp yolunu taşımaya devam eder

- [ ] **3. Dört genişlikte ölç**
  - Geçersiz ve geçerli alanın 8 özelliği karşılaştırılır (`boxShadow, borderColor, borderWidth, backgroundColor, color, outlineColor, outlineWidth, outlineStyle`) — bulgunun kendi yöntemiyle, farkın **var** olduğu gösterilir

---

## Etkilenen Dosyalar

```
src/components/sections/
└── DemoForm.tsx            # aria-invalid stili + alan bazlı hata düğümü — zaten var
src/app/
└── globals.css             # yalnız gerekirse (token/varyant tanımı) — zaten var
```

---

## Dikkat Noktaları

- **Renk tek işaret olamaz.** WCAG 1.4.1: hata yalnız kırmızı kenarla anlatılmaz — metin zaten var (alan bazlı düğüm), ikisi birlikte çalışır.
- **`neg` açık zeminde ölçülmeli.** `STYLE-GUIDE` `neg` için `neg-wash` zemininde ≥ 4.96 ölçmüş; alan zemini `surface` (beyaz) — **yeniden ölç**, kopyalama.
- **Preflight'ın `:-moz-ui-invalid` kapatması yerinde kalır** — yerel tarayıcı işaretini geri açmak temayla çelişir; işaret bizim tokenımızdan gelir.
- **`aria-describedby` zinciri bozulmasın:** alanın ipucu (`<alan>-hint`) ve hata düğümü birlikte listelenir; boşken öznitelik hiç yazılmaz (bugünkü desen).
- TASK-2.05'in sıfırlama ayağı (e) bu düğümleri de kapsar — gönderim başında hata düğümleri DOM'dan kalkarken `aria-describedby` de temizlenmeli.

---

## Test Kriterleri

- [ ] Odakta **olmayan** geçersiz alan ile geçerli alan 8 özellikte karşılaştırıldığında 320/360/390/412 px'te **fark var** (bugünkü `farklar: []` sonucunun tersi; çıktı dokümana) — kanal: UAT
- [ ] Her hata türünde (`missing`, `missing-contact`, `bad-contact`, `no-consent`) hatalı alanın hemen altında metin görünüyor ve `aria-describedby` **DOM'da var olan** kendi düğümünü gösteriyor — kanal: UAT
- [ ] Genel hata kutusu hâlâ duruyor ve WhatsApp bağlantısı çalışıyor (dönüşüm yolu kapanmadı) — kanal: UAT
- [ ] `a11y.mjs` TOPLAM SORUN: 0; hata durumundaki metin ve kenar renginin kontrastı **rakamıyla** ölçüldü ve CSS yorumuna yazıldı (≥ 4.5 metin)
- [ ] `mobile-audit.mjs` yatay kaydırma: yok · `scan.mjs` `/demo` konsol temiz
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [ ] TASK-2.05'in altı ayağında regresyon yok (odak tablosu ve görünürlük yeniden ölçüldü) — kanal: UAT

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
