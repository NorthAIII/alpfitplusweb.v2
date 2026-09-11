# B-017: Asistan panelinin erişilebilirlik katmanı eksik — dokunma hedefi, canlı bölge, odak ve klavye

**Önem:** 🟡 | **Tip:** hata / erişilebilirlik | **Alan:** M4 — Site asistanı (`src/components/layout/Assistant.tsx`)
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → Pazarlık Konusu Olmayanlar: *"Erişilebilirlik WCAG AA'nın altına düşmez — kontrast ve klavye erişimi eşiğin altına inmez, tema değişse de yeni sayfa eklense de."* `QUALITY.md` → 7: klavye navigasyonu, asistanda odak tuzağı olmaması, dokunma hedefleri ≥ 44 px. `modules/M4-Site-Asistani.md` → F4.1: *"Klavyeyle açılır, kapanır, gezilir."*

**Gözlenen:** Panel açılıp klavye ve ekran-okuyucu açısından ölçüldüğünde altı ayrı eksik çıktı. Hiçbiri paneli kullanılamaz yapmıyor, ama birlikte klavye ve ekran okuyucu kullanıcısı için kullanılabilirliği belirgin biçimde düşürüyorlar:

| # | Gözlem | Ölçüm |
|---|---|---|
| 1 | Konu seçme chip'leri dokunma hedefi eşiğinin altında | **28 px** (beşi de); "Baştan" 25 px; masaüstünde WhatsApp CTA 40 px |
| 2 | Mesaj akışı ekran okuyucuya duyurulmuyor | canlı bölge sayısı **0**, `role="log"` yok — yeni cevap sessizce geliyor |
| 3 | Kaydırılabilir mesaj akışına klavyeyle girilemiyor | `tabIndex: -1`, içerik 597 px / görünen 298 px — önceki mesajlara dönülemiyor (WCAG 2.1.1) |
| 4 | Seçeneğe Enter'la basınca odak `body`'ye düşüyor | `ask()` chip'leri 420 ms kaldırıyor, basılan düğme unmount oluyor, odak hedefi tanımlı değil |
| 5 | Sayfa başında iki yüzen düğme görünmez ama odaklanabilir | `opacity: 0; pointer-events: none`, ama `inert`/`aria-hidden`/`tabindex="-1"` yok — görünmez iki tab durağı |
| 6 | `role="dialog"` var, diyalog davranışı yok | `aria-modal` yok, `aria-labelledby` yok, panelde başlık öğesi yok, açılışta odak launcher'da kalıyor |

Ek ölçüm: launcher DOM'un sonunda olduğu için klavyeyle ona ulaşmak ana sayfada **62-67 Tab** sürüyor ve atlama yolu yok.

**Panelin doğru yaptıkları da kaydedilir** — bu bir "baştan yaz" bulgusu değil: Esc kapatıyor ve odağı launcher'a iade ediyor, odak tuzağı yok, panel içi 14 metin öğesinin hepsi WCAG AA kontrastını geçiyor (en düşük 6,04:1), `prefers-reduced-motion` saygı görüyor, 390 px'te panel ekranı taşırmıyor, sohbet rota değişiminde korunuyor. Eksik olan bir katman, temel değil.

6 numaralı kalem bir tasarım sorusuna bağlı ve bu yüzden düzeltme yönü kendiliğinden belli değil — Gelen Kutusu'na soru olarak da düştü: panel bilinçli olarak **modal olmayan** bir yardımcıysa `role="dialog"` yanlış seçim; modal ise odak taşınmalı ve arka plan `inert` olmalı. İkisinden biri seçilmeli, bugünkü hâl ikisinin arası.

## Kanıt

Playwright, dev sunucusu (3000), 1440×900 ve 390×844 — ölçümler iki genişlikte aynı.

```
Dokunma hedefleri (panel açık):
✗   52x 25px  "Baştan"
✗  124x 28px  "Fiyat nasıl işliyor?"
✗  151x 28px  "Verilerimi kim taşıyor?"
✗  194x 28px  "Turnike almam gerekiyor mu?"
✗  201x 28px  "Mobil uygulama ayrı ücretli mi?"
✗  147x 28px  "Ürün hangi aşamada?"
✓  334x 59px  WhatsApp CTA (mobil)      ✗ 352x 40px (masaüstü)
✓   52px      launcher ve WhatsApp FAB

ARIA anlık görüntüsü (panel açık):
{"role":"dialog","ariaModal":null,"ariaLabel":"Alpfit Plus asistanı",
 "ariaLabelledby":null,"liveRegions":0,"feedRole":null,"headings":[]}
{"mainInert":false,"mainAriaHidden":null,"bodyOverflow":"visible"}
{"scrollHeight":597,"clientHeight":298,"tabIndex":-1,"role":null,"label":null}

Sayfa başı (FAB gizli):
{"scrollY":0,"wrapOpacity":"0","wrapPointerEvents":"none",
 "launcherFocusable":true,"launcherAriaHidden":null,"launcherTabindex":null}

Chip'e Enter sonrası odak izleme:
  seçeneğe odak:              button "Fiyat nasıl işliyor?"  inPanel=true
  Enter sonrası (yazarken):   body                          inPanel=false
  cevap geldikten sonra:      body                          inPanel=false

Launcher'a klavyeyle ulaşma: 67. Tab (masaüstü) · 62. Tab (mobil)
```

Kaynak konumları: `src/components/layout/Assistant.tsx:157` (chip sınıfları `px-2 py-1 text-[0.6875rem]`), `:164` (akış kutusu), `:86-90` (gizli FAB koşulu), `:64-76` (`ask()`), `:136-143` (dialog ARIA'sı), `:232` ve `:245` (CTA dolguları).

Bu ihlallerin bugüne dek görünmemesinin sebebi [B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md): kapılar paneli hiç açmıyor.

## Kök Neden Yönü

Panel görsel ve etkileşim tarafı düşünülerek yazılmış; kontrast ve hareket tercihleri gibi **ölçülen** eksenlerde doğru davranıyor (proje o ölçümleri yapıyor), **ölçülmeyen** eksenlerde (canlı bölge, odak yönetimi, dokunma hedefi) eksik kalmış. Yani eksikliklerin dağılımı ölçüm kapsamının haritasını birebir izliyor — bulgunun B-015 ile aynı kökten geldiğinin işareti.

## Koruma Önerisi

- Düzeltmeler küçük ve birbirinden bağımsız: chip dolgusunu 44 px'e çıkar, akış kutusuna `role="log"` + `aria-live="polite"` + `tabIndex={0}` ver, `ask()` sonrası odağı akışa ya da ilk yeni chip'e taşı, gizli sarmalayıcıya `inert` ekle.
- `role="dialog"` kararı verildikten sonra (modal mı değil mi) ARIA buna göre tamamlanır — `aria-modal` + `aria-labelledby` + arka plan `inert`, ya da `role="dialog"` bırakılıp `role="complementary"` benzeri bir yardımcı rolüne geçilir.
- Kalıcı koruma B-015'in kendisidir: kapı paneli açık durumda ölçmeye başlarsa bu sınıf bir daha sessizce giremez. Bu bulgu düzeltilirken B-015 düzeltilmezse aynı hata yeni bir katmanda tekrar eder.

## Çözüm Kaydı

—
