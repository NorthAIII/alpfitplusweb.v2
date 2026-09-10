# BULGULAR — Proje Sorun Kanvası (Index)

> Bu dosya PRD-altı sorun ve önerilerin **tek evi** ve index'idir. Kaynağı ne olursa olsun —
> audit-product turu ya da herhangi bir oturumda göz ucuyla görülen kapsam-dışı sorun —
> icra-düzeyi kayıt buraya düşer, başka eve dağılmaz. Bulguların detayı
> `_dev/bulgular/B-NNN-<slug>.md` atomlarında yaşar; buradaki her satır o atomlara
> pointer'dır (MEMORY index↔atom deseni: ince index hep okunur, detay gerekince lazy-load).

**Son Güncelleme:** 2026-09-11 — kickoff-docs: DURUM'daki açık işler ve kapatılmış yedi hata bulgu formatına taşındı (3 açık, 7 arşiv).

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->

---

## Gelen Kutusu

<!-- KURAL: Herhangi bir oturumda görülen kapsam-dışı sorun/uyarı — ve denetim turundan çıkan
     CEVAPLANMAMIŞ SORU — buraya KAYNAK İŞARETLİ tek satır düşer:
     `- [TASK-3.02] Ödeme sayfası konsolda 404 üretiyor (bkz. /api/coupons)`. Kaynak işareti: [TASK-X.YY] /
     [PHASE-N] / [QUICK-NNN] / [oturum türü] / [audit-product SORU]. Secret/credential DEĞERİ asla yazılmaz — yalnız konumu.
     Satır bir POINTER'dır: kanıtın tamamını değil YERİNİ yazar. Satır kanıtın GÖVDESİNİ taşımaya başladıysa
     (yeniden üretme adımları, ölçüm dökümü, kod alıntısı) bu bir disiplin ihlali değil TEŞHİSTİR: elinde not
     değil bulgu var; kanıtın evi atomdur (aşağıda "Bulgu Sistemi"), kutuya yalnız kancası düşer.
     Kardeş biçim: Açık Bulgular satırı da bir kancadır.
     PRD/vizyon düzeyi fikir buraya değil → prd-note (NOTES.md).
     Triyaj: audit-product uzlaştırması her notu sonuca bağlar (bulgu atomu / Bilinçli Tercihler / sil);
     verify-phase Adım 1 bu faza dokunanları süpürür; versiyon sonunda prd-review kutunun boş olup olmadığını
     HÜKME BAĞLAR (boş değilse ya uzlaştırma turu önerilir ya bilinçli erteleme gerekçesi yazılır) — kutunun
     TAMAMINI kapsayan tek zamanlı adım odur — tam dosyayı okumaz; sayar, SORU satırlarını listeler ve alınan
     cevabı satıra işler — çünkü audit-product tasarımı gereği zamana/döngüye bağlı değildir.
     `[audit-product SORU]` satırları KARAR bekler — incelemeyle kapanmaz; kullanıcı cevabı alınmadan düzeltme
     task'ına dönüştürülmez, cevap gelene dek kalır. Cevap alındığında satır SİLİNMEZ: **cevabı alan oturum** kancayı yazar —
     kaynak işaretinden hemen sonra `✅ **CEVAPLANDI** (<kim>, <oturum/tarih>) — <karar>` — ki triyaj aynı soruyu
     yeniden sormasın; silme yine triyajın işidir.
     Not task'a dönüştüğünde veya atomlaştığında satır
     SİLİNİR — bilgi yeni evine taşınmıştır (mezuniyet). Olgun hal: boş kutu. -->

- [kickoff SORU] Ana sayfa mobilde ~26.000 px; referans alınan rakip de benzer uzunlukta. Kısaltılsın mı? Karar kullanıcıda — tek başına içerik atılmadı (bkz. `modules/M2-Sayfalar-ve-Bolumler.md` F2.1)

## Açık Bulgular

<!-- KURAL: Satır formatı: `- 🔴 [B-NNN — başlık](bulgular/B-NNN-<slug>.md) — tek satırlık kanca`
     (+ faza/task'a alındıysa satır sonuna ` → Faz N` veya ` → TASK-X.YY`).
     Sıralama = ele alınma önceliği (en üst en öncelikli). Önem işareti zorunlu: 🔴 kritik / 🟡 önemli / 🟢 iyileştirme.
     Kanca ~100 karakteri aşmaz — detay atomdadır, index ince kalır.
     YALNIZ açık bulgular listelenir: çözümü teyit edilen bulgunun atomu `bulgular/archive/`e taşınır ve
     satırı SİLİNİR (mezuniyet — iz bırakma); arşiv burada ASLA listelenmez (`ls _dev/bulgular/archive/` zaten görür).
     Faza/task'a alınan bulgu işaretini alır ve çözüm teyidine dek burada bekler (faz erken sonlansa bile kaybolmaz).
     Bu index bir kanvas dokümandır: BÖLÜNMEZ. Liste yönetilemeyecek kadar uzadıysa (rehber eşik ~30 açık bulgu —
     işaret fişeği, mahkûmiyet değil) bu bir triyaj çağrısıdır: stok eritilir/elenir, yapı değiştirilmez. -->

- 🟡 [B-008 — Yasal metinler hukukçu onayı bekliyor](bulgular/B-008-yasal-metin-hukukcu-onayi.md) — dış aktör; metinler gerçek veri akışına göre yazıldı, "örnek metindir" ibaresi yok
- 🟡 [B-010 — Kurucu Programı "ilk 5 kulüp" diyor, kontenjan takibi yok](bulgular/B-010-kurucu-programi-kontenjan.md) — kanıtsız kıtlık iddiasına dönüşme riski; kurucu kararı gerek
- 🟡 [B-009 — Logo geçici; favicon, app ikonu ve OG ondan türüyor](bulgular/B-009-logo-gecici.md) — dış aktör; kalıcı logo gelince `brand-assets.mjs` yeniden koşar

## Kapsama

<!-- KURAL: Alan satırları ÜZERİNE YAZILIR (append log değil). Alanlar projenin doğal bölgeleridir
     (modül/akış düzeyi — MODULE-MAP'le uyumlu ad kullan); audit-product her turun sonunda dokunduğu
     alanların satırını tazeler. Odak seçiminin veri kaynağı budur: en eski bakış + en riskli alan önce. -->

| Alan | Son Bakış | Not |
|------|-----------|-----|
| M1 İçerik ve iddia | 2026-09-11 | Kickoff öncesi elle denetim; rakip adı kaldırıldı. Otomatik sızıntı denetimi yok (M6 F6.4) |
| M2 Sayfalar | 2026-09-11 | Beş ölçüm yeşil (M6 başlangıç ölçümü); audit-product turu yapılmadı |
| M3 Lead hattı | 2026-09-11 | Kod var, hedef tanımsız — gerçek talep testi yapılmadı |
| M4 Asistan | — | Denetim yapılmadı |
| M5 Görsel hat | 2026-09-11 | render-product denetimi temiz; logo geçici (B-009) |
| M6 Kalite kapıları | 2026-09-11 | Elle koşuyor, CI yok |
| M7 Yayın | — | Vercel bağlantısı yok; başlıklar yalnız yerelde ölçüldü |

**Yarım tur:** [yok]

<!-- KURAL: Kesilen audit-product turu buraya TEK satır devam notu yazar (odak + nerede kalındı);
     turu tamamlayan/devralan oturum "[yok]"a döndürür. Kümülatif yığma yok. -->

## Bilinçli Tercihler

<!-- KURAL: Kullanıcının "bu bilinçli böyle / düzeltilmeyecek" dediği konuların tek satırlık kayıtları —
     sonraki turların aynı şeyi yeniden bulgulaştırmasını önler: `- [konu] — neden bilinçli (tarih)`.
     İlgili özellik projeden kalkınca satır silinir (uzlaştırma temizler). Mimari kararların evi burası
     değil → docs/DECISIONS.md; buradaki kayıt yalnız denetim süzgecidir. -->

- Sayı sayma animasyonlu istatistik bandı yok — pilot sonucu çıkmadı, yayınlanacak gerçek rakam yok; ayrıca klişe (2026-09-10)
- Web sitesi hizmeti sitede yok — kullanıcı kararı, tek ürün mesajı (2026-09-10; `docs/DECISIONS.md`)
- Ürün görsellerinde `churn.html` ve `kampanya.html` yok — karşılıkları ürünün v1.5'inde, bugünkü ürünün parçası değil (2026-09-10)
- Hız sınırı bellek içi, örnek başına — tek süreç için yeterli, ölçek büyürse taşınır (2026-09-10)
- Header'da "Giriş Yap" yok — `app.alpfitplus.com` yayında değil; v1 kararı (footer'a, ürün canlıya çıkınca) devralındı (2026-09-11)

---

## Bulgu Sistemi — Nasıl Çalışır?

- **Atom dosyası** (`_dev/bulgular/B-NNN-<slug>.md`): numara küresel ve append-only'dir — sıradaki numara = açık **ve arşiv** genelindeki en büyük NNN + 1 (numara asla yeniden kullanılmaz); slug kebab-case ve ASCII. Format:

  ```markdown
  # B-NNN: [Başlık]

  **Önem:** 🔴/🟡/🟢 | **Tip:** [hata / tutarsızlık / tekrar / öneri-ui-ux / öneri-altyapı / ...] | **Alan:** [modül/akış]
  **Kaynak:** [audit-product / TASK-X.YY / PHASE-N / QUICK-NNN / oturum türü] | **Tarih:** [tarih]
  **Durum:** Açık / → Faz N / → TASK-X.YY / ✅ Çözüldü

  ## Gözlem
  [Beklenen vs gözlenen — beklentinin dayanağıyla (kabul kriteri, davranış kuralı, ilke)]

  ## Kanıt
  [Hata: yeniden üretme adımları + file:line / komut çıktısı / konsol-network gözlemi.
   Öneri: gerekçe + somut gözlem + ILKELER uyumu.]

  ## Kök Neden Yönü
  [Biliniyorsa; tahminse "tahmin:" diye işaretle — semptomun kaynağına işaret eder]

  ## Koruma Önerisi
  [Bunu gelecekte ne otomatik yakalardı — test, kontrol, gözlemlenebilirlik; yoksa "—"]

  ## Çözüm Kaydı
  [Arşivlenirken doldurulur: ne yapıldı, hangi task/commit ile — kapanış kapsamıyla; kapsanmayan yüzey kaldıysa o da yazılır]
  ```

- **Yaşam döngüsü:** Gelen Kutusu satırı veya denetim bulgusu → atom + index'e öncelik-sıralı satır → faza/task'a alınınca index satırına işaret (`→ Faz N` / `→ TASK-X.YY`) ve atomun **Durum**'u aynı anda güncellenir (ikisi birlikte — tek taraflı güncelleme drift'tir) → çözüm teyidinde Çözüm Kaydı doldurulur, atomun **Durum**'u `✅ Çözüldü` yapılır, atom `bulgular/archive/`e taşınır, index satırı silinir. Çözüm teyidinin olağan evi **verify-phase Adım 6**'dır (düzeltmesi o fazda yapılıp UAT'den geçen bulgu); faz döngüsünü beklemeden quick ile çözülen bulguda mezuniyeti quick yapar (quick.md → Önemli Kurallar); audit-product uzlaştırması güvenlik ağıdır. Rotası ölen işaret (hedef faz/task çözümsüz kapanmış) uzlaştırmada kaldırılır — bulgu Açık'a döner. Arşivdeki atom **tarihsel dokümandır** — içeriği dondurulur (tarihsel doküman kuralı → CLAUDE.md).
- **Çözüm teyidi kanıt ister:** "muhtemelen çözüldü" arşivletmez — task arşivine/commit'e bak, gerekirse ürünü çalıştırıp doğrula.
- **Kapanış kapsamıyla yazılır:** bulgu çoğu zaman bir sınıfın ilk örneğidir ve düzeltme sınıfın bir bölümünü kapatır; çıplak "kapandı" cümlesi ölçülmemiş yüzeyleri de kapsıyormuş gibi okunur — "X, Y kapsamında kapandı" yaz (task dokümanlarının "Test Sonuçları" KURAL'ının kardeşi). Tam kapanış da bir iddiadır: ölçülmeden yazılmaz. **Kapsanmayan yüzey kaldıysa** Çözüm Kaydı bunu söyler ve kalan, yaşayan bir eve taşınır — arşiv tarihsel kayıttır, oraya bırakılan kalan iş kimseye görünmez; evini kapanışı yapan oturumun kendi kapsam triyajı seçer (verify-phase'te Adım 7).
- **Tip serbest, önem zorunlu:** tip raporlamayı netleştirir; önceliği önem işareti + index sırası belirler.
- **Sınırlar (yanlış-ev koruması):** PRD/vizyon düzeyi fikir → `prd-note` (NOTES.md). Proje-geneli öğrenim/tuzak → MEMORY. Mimari karar → docs/DECISIONS.md. Faz retrosuna ait ders → PHASE-N. Bu kanvas **icra-düzeyi sorun ve öneri** içindir.
- **Kim yazar:** Gelen Kutusu'na her oturum tek satır düşebilir. Kanvas işlemleri bulgularla çalışan oturumlarındır: audit-product (uzlaştırma + yeni bulgular + güvenlik-ağı arşiv/işaret temizliği), discuss-phase (faza alma işareti), verify-phase (faz-kapsamı süpürmesi ve kutu mezuniyetleri — Adım 1, task'a alma işareti — Adım 7, UAT-teyitli arşiv — Adım 6), quick (yalnız kapsamına aldığı bulgunun mezuniyeti), cevabı alan oturum (yalnız SORU satırına `✅ CEVAPLANDI` kancası; versiyon sonunda garantili olarak prd-review). Çok-ajanlı denetimde tek yazar orkestratördür.
