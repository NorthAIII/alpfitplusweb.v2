# TASK-3.17: Dönüşüme dokunan 19 hedef 44 px'e çıkar

**Durum:** ✅ Tamamlandı
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.08 ✅ · TASK-3.16 ✅

---

## Hedef

TASK-3.08'in kurduğu kapının kritik kümesini yeşile çevirmek: **19 benzersiz dokunma hedefi** (16 sayfada 61 örnek) 44×44 CSS px'e çıkar. Gövde metni içi bağlantılar (≈ 324) ve alt bilgi linkleri **değişmez** — ölçülür, raporlanır, kırmızıya düşürmez.

---

## Bağlam

Kullanıcı kararı (PHASE-3): dokunma hedefi kuralı kademeli kurulur; 157 küçük hedefin çoğu gövde metni içi bağlantı ve hepsini 44 px'e çıkarmak satır aralıklarını açarak tipografiyi bozar.

Araştırmanın somutlaştırdığı kritik küme:

| Hedef | Ölçülen |
|---|---|
| Şube seçici butonları | 63-66 × **36** |
| "WhatsApp'tan sorun" | 172 × **20** |
| Telefon bağlantısı | 147 × **20** |
| Form alanı | 250 × **24** |
| **Onay kutusu** | **18 × 18** |

M2 F2.3 zaten *"Dokunma hedefleri ≥ 44 px"* diyordu; ölçülmemişti.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3.md` — Teknik Kararlar (mekanik ölçüt)
- `_dev/phases/PHASE-3-ARASTIRMA.md` — devralınan iddiaların ölçüm tablosu, 6. satır (kritik hedeflerin ölçülen kutuları)
- `_dev/docs/STYLE-GUIDE.md` — form hatası deyimi (TASK-2.06); onay kutusuna dokunurken o deyim korunur
- `_dev/modules/M3-Lead-Hatti.md` — form davranışı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/docs/STYLE-GUIDE.md` — dokunma hedefi deyimi (44 px'in nasıl sağlandığı: dolgu mu, `::before` genişletme mi)

---

## Alt Görevler

- [x] **1. Listeyi kapıdan al**
  - `mobile-audit.mjs` kritik kümesini benzersiz olarak basıyor (TASK-3.08); düzeltme listesi **o çıktıdır**, bu dokümandaki tablo yalnız tanıma içindir

- [x] **2. Hedefleri büyüt**
  - Tercih sırası: görünür kutuyu büyütmek (dolgu) → görünmez tıklama alanı genişletmek (`::before` / mutlak kaplama) → yerleşimi değiştirmek
  - Görsel ağırlık değişmemeli: gövde metni içindeki "WhatsApp'tan sorun" ve telefon bağlantısı dolguyla büyürse satır aralığı bozulur — bu ikisi için genişletilmiş tıklama alanı uygundur

- [x] **3. Onay kutusu**
  - 18×18 → ≥ 44 px tıklama alanı; TASK-2.06'nın form hatası deyimi (`neg` halka + `neg-wash` zemin + alan altında hata metni) **korunur**
  - Etiketin tıklanabilirliği hedefe sayılıyorsa ölçütü kapının çıktısıyla uyumlu olsun

- [x] **4. Form alanları ve şube seçici**
  - Form alanı 250×24 → yükseklik ≥ 44; şube seçici butonları 36 → 44

---

## Etkilenen Dosyalar

```
src/components/ui/Button.tsx                     # buton boyut ölçekleri (gerekirse)
src/components/sections/DemoForm.tsx             # form alanları, onay kutusu
src/components/sections/PriceCalculator.tsx      # şube seçici butonları
src/components/sections/<gövde metni bağlantıları>  # kapı çıktısından belirlenir
```

---

## Dikkat Noktaları

- **Gövde metni içi bağlantılara dokunma.** Kullanıcı kararı açık: ölçülür, raporlanır, düşürmez. Onları 44 px'e çıkarmak tipografiyi bozar.
- **"WhatsApp'tan sorun" ve telefon bağlantısı kritik kümededir** (`wa.me` / `tel:` hedefli) — gövde metninin *içinde* dursalar bile. Çözüm dolgu değil, genişletilmiş tıklama alanı.
- **Form hatası deyimi korunur** — onay kutusunun görünümü değişirken `aria-invalid` varyantı ve odak halkası sırası bozulmamalı (STYLE-GUIDE'da ölçülmüş: kırmızının üstünde kalan odak halkası).
- **44 px CSS px'tir**, cihaz pikseli değil — `deviceScaleFactor: 2` ölçümü yanıltmaz ama betiğin hangi birimi bastığı kontrol edilir.
- **Kapı yayın kopyasını ölçüyor** — `docker compose --profile prod up -d web-prod`.
- **TASK-3.16'nın "Demo" bağlantısı da bu kümededir** — bu yüzden bağımlılık.

---

## Test Kriterleri

- [x] `mobile-audit.mjs` kritik kümesinde eşik altı **0**; çıkış kodu **0** (`TOPLAM SORUN: 250 → 0`)
- [x] Gövde metni içi bağlantılar hâlâ raporlanıyor — gezinme kulvarı **333 ölçüldü / 261 eşik altı** ve alt kovaları **birebir** (gövde metni 1 · içerik yolu 4 · alt bilgi 256); kritik nüfus da **305**'te sabit (taban 305), yani seçici körleşmedi
- [x] Onay kutusu **44×44** (görünür kutu 18×18); genişletilmiş hedef **gerçek** (10 px sol/üst dokunuş işaretliyor, 25 px sol **işaretlemiyor** — negatif kontrol). Geçersiz hâl `page.route` ile üretildi: **2 px `neg` halka** + `aria-describedby` + alan altında hata metni — deyim parite ile korundu
- [x] Şube seçici **36 → 44** (beşi de, 6 rota); form alanları zaten 302×47 idi ve dokunulmadı — kritik kümeye formdan giren tek kalem onay kutusuydu (araştırmanın *"form alanı 250×24"* kalemi T8'de çürümüştü)
- [x] Yatay kaydırma **16 rota × 2 genişlikte 0**. Görünmez olması gereken altı kalemde DOM'da geri alarak ölçüldü: **0 farklı piksel** (pozitif çapa — geri alınca kutular gerçekten küçüldü). Görünür üç değişiklik bilinçli ve ölçülü: çipler 40 → 44, şube seçici 36 → 44, alt bilgi iletişim satırları +8 px
- [ ] Gerçek telefonda dokunma denemesi — **`kanal: UAT`** (kapsam dışı, `verify-phase`)
- [x] Beş ölçüm çizgide: `a11y` **6** (hepsi `/gecis`, bu task'ın kalemi değil) · `font-guard` çıkış **0** (85.129 karakter, birebir) · `perf` `/` masaüstü **141 KB / LCP 80 ms / CLS 0,005**, mobil **132 KB / LCP 64 ms / CLS 0** · `scan` üç rotada konsol temiz · `npm test` **219 + 2 atlandı**

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı
- [x] Tüm test kriterleri karşılandı (biri hariç: gerçek telefon turu → `kanal: UAT`)
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-24

**Durum:** ✅ Tamamlandı

**Yapılanlar:**
- **Düzeltme listesi kapıdan alındı** (alt görev 1): `mobile-audit.mjs` 3100'e karşı koşuldu, **19 benzersiz / 125 örnek / her iki genişlikte aynı**, `TOPLAM SORUN: 250` · çıkış 1. Bu doküman tablosu yalnız tanıma içindi ve iki kalemi **çürüktü** (aşağıda).
- **19 benzersiz kalemin hepsi ≥ 44×44'e çıktı**, dokuz dosyada. Kapı: **250 → 0**, çıkış **1 → 0**, `✓ KAPI YEŞİL`.
- **Deyim seçimi elemanın `display`'ine bağlandı** ve üçü de ölçülerek seçildi — kaynağa yazmadan önce yayın kopyasına CSS **enjekte** edilip 9 aday ölçüldü (T10'un yöntemi), hepsi tuttu:
  - *Görünür kutu büyür* (`inline-flex min-h-11 items-center`, `py-*` kalkar): 404 çipleri · yasal metin çipleri · şube seçici. Kutunun kendi zemini ve halkası olduğu için gizli hedef alanı yanıltıcı olurdu.
  - *Satır içi bağlantı* (yalnız `py-3.5`): dikey dolgu satır kutusunu etkilemez, telafi **gerekmez** — `konuşalım`, içerik yolu `Ana sayfa`, mobil menüdeki telefon bağlantısı.
  - *Dolgu + negatif margin telafisi*: kapanış çağrısı telefonu, SSS'nin WhatsApp bağlantısı, alt bilgi iletişim satırları, segment içerik yolundaki `Segmentler` (o `<li>` `flex` olduğu için bağlantı blokluyor).
- **Onay kutusu `appearance: none` ile yeniden kuruldu** — ölçüm başka yol bırakmadı (aşağıda). Akışta 18 px sarmalayıcı, `input` **mutlak** (akış dışı → telafi yok), görünür kutu `peer-checked:` ile boyanıyor.
- **Kapı dışı iki kalem elle ölçülüp düzeltildi:** mobil menüdeki telefon bağlantısı (panel yalnız menü açıkken render ediliyor, kapı etkileşimsiz hâl ölçüyor — B-015) **17 → 45**, panel boyu **441 → 441** ve görünüş **0 farklı piksel**.
- `docs/STYLE-GUIDE.md`'ye dokunma hedefi deyimi + onay kutusu gerekçesi yazıldı (task bunu çıktı olarak sayıyordu).

**Sorunlar:**
- **Onay kutusunda dolgu ÇALIŞMIYOR — ve bunu ancak ölçüm gösterdi.** `appearance: auto` iken tarayıcı kutuya yazılan **dolguyu ve kenarlığı sıfırlıyor**: `padding:13px` verildiğinde hesaplanmış değer `0px` okundu, kutu 18×18 kaldı (aynı deneme `margin:-13px`i **uyguladı** ve yerleşimi kaydırdı — etiket 113,75 → 91, gönder düğmesi 22,75 px yukarı). `width/height:44px` kutuyu büyütüyor ama yerli çizimi de 44 px'e ölçekliyor. Çözüm: `appearance: none` + elle çizilen görünür kutu. **Hata deyimi parite ile korundu** (2 px `neg` halka + alan altında hata metni; `neg-wash` zemin eklenmedi — yerli kutuda da yoktu), odak konturu `input`ta bastırılıp görünür kutuya taşındı (yoksa 44 px'lik görünmez kutunun etrafında çizilirdi).
- **Görünmez genişletme kapıyı kandırabiliyor — iki gerçek örnek ölçüldü ve ikisi de düzeltildi.** Kapı tek tek kutuları ölçer, **çakışmayı görmez**; üst üste binen iki hedefte boyama sırası kazanır. (1) Alt bilgideki iki dönüşüm bağlantısı yan yana ve ikisi de büyüdü: 30,5 px akış yüksekliği + 12 px boşluk = 42,5 px adım iken iki 46,5 px'lik kutu birbirine **4 px** giriyordu — WhatsApp bağlantısının gerçek hedefi 42,5'e düşerdi, kapı 46,5 görüp yeşil basardı. Telafi `-my-2` → `-my-1` (kutu 46,5 kalır, akıştaki yer 38,5'e çıkar, 4 px açık doğar, alt bilgi 16 px uzar). **Beş satırı 42,5 px adımla dizip hepsine 44 px sığdırmak geometrik olarak mümkün değil.** (2) Onay kutusunun 44 px'lik kutusu rıza cümlesindeki bağlantıya **1 px** giriyordu; kutu yatayda 4 px sola kaydırıldı. Ölçüm 16 rota × 2 genişlik, yapışkan katman içindekiler hariç: **düzeltmeden önce 0 → ara hâlde 1 → bugün 0.**
- **Kendi ölçüm düzeneğim iki kez yanılttı, ikisi de yakalandı.** (a) İlk kare karşılaştırmasında kırpmayı **büyüttüğüm elemanın kendi kutusuna** çapaladım; kutu yukarı doğru büyüyünce kare kaydı ve `finalcta` %92, `konuşalım` %18 fark gösterdi — dokunmadığım bir ataya çapalayıp DOM'da geri alarak ölçünce ikisi de **0 farklı piksel** çıktı. (b) Sayfa boyu taramasında geri-alma seçicim (`main a[href^='tel:']`) `/demo` ve `/destek`'te **dokunmadığım** bağlantıların kendi dolgusunu da sıfırlamış, o iki rota +44/+64 px görünmüştü; dar seçiçle gerçek değer **+16** (yalnız alt bilgi) ve o bağlantıların kutuları **68,0 / 142,5 / 122,5** px'te birebir.

**Kararlar:**
- **Alt bilgi gezinme bağlantıları (256 kalem) DEĞİŞMEDİ, yalnız `/demo` bağlantısı büyüdü.** Gerekçe kullanıcı kararı (PHASE-3): alt bilgi linkleri ölçülür, raporlanır, düşürmez. Ayrım `href`e bakar ve iki dal **çakışmasız** yazıldı (`-my-1 py-2` / `-my-2 py-3`) — aynı yardımcının iki değerini tek sınıf dizesine koymak sırayı CSS üretim düzenine bırakırdı.
- **Alt bilgi 16 px uzadı, bilinçli.** Seçim "görünmez ama çakışan hedef" ile "4 px daha ferah ama gerçek hedef" arasındaydı; ikincisi seçildi çünkü birincisi tam da bu task'ın ürettiği şeyde bir fail-open bırakırdı.
- **Çipler görünür olarak büyüdü** (404/yasal 40 → 44, şube 36 → 44). Tercih sırasının birincisi bu; çipin kendi zemini ve halkası varken hedefi gizlemek yanıltıcı olurdu. Bedeli ölçüldü: sayfa +8 / +16 px, sarma noktaları ve köşe biçimi birebir.
- **`appearance: none`in bedeli yazıldı, kapatılmadı:** zorunlu renk kipinde (forced-colors) sistemin kendi kutu çizimi kaybolur → `BULGULAR.md` Gelen Kutusu.
- docs/DECISIONS.md'ye eklendi: **Hayır** — geri dönüşü pahalı bir sözleşme/şema değişikliği yok; kural ve gerekçeler STYLE-GUIDE'ın dokunma hedefi deyiminde (tek ev) ve kod yorumlarında duruyor.

**Kalan İşler:**
- Gerçek telefonda dokunma denemesi — `kanal: UAT` (`verify-phase`).

**Son Yaklaşım:** —
**Sonraki Adım Detayı:** —

**Dosya Değişiklikleri:**
- `src/components/layout/Footer.tsx` → WhatsApp ve telefon bağlantıları `-my-1 py-3` (kutu 38,5 → **46,5**, akıştaki yer 30,5 → 38,5, komşularıyla 4 px açık); kolon bağlantıları `href`e göre ikiye ayrıldı, yalnız `/demo` `-my-2 py-3` (72×38,5 → **72×46,5**); `cn` import edildi
- `src/components/sections/FinalCta.tsx` → telefon bağlantısı `-my-3 py-3` (147×20 → **147×44**, sayfa boyu birebir)
- `src/components/sections/Faq.tsx` → WhatsApp bağlantısı `mt-3` kalktı, `-mb-3 py-3` geldi (172×20 → **172×44**, kart boyu birebir)
- `src/components/sections/PageHero.tsx` → içerik yolu `Ana sayfa` `py-3.5` (66×17 → **66×45**, 10 rota)
- `src/app/segmentler/[slug]/page.tsx` → `Ana sayfa` `py-3.5` (66×17 → **66×45**), `Segmentler` `-my-3.5 py-3.5` (75×20 → **75×48**; o `<li>` `flex` olduğu için telafi şart)
- `src/app/not-found.tsx` → öne çıkan sayfa çipleri `inline-flex min-h-11 items-center`, `py-2.5` kalktı (40 → **44**)
- `src/components/sections/LegalPage.tsx` → diğer yasal metin çipleri aynı kalıp (40 → **44**)
- `src/app/yazilim-secerken/page.tsx` → `konuşalım` `py-3.5` (73×19 → **73×47**, satır aralığı birebir)
- `src/components/sections/PriceCalculator.tsx` → şube kısayolları `inline-flex min-h-11 items-center`, `py-2.5` kalktı (63-66×36 → **63-66×44**)
- `src/components/sections/DemoForm.tsx` → onay kutusu `appearance: none` ile yeniden kuruldu: 18 px sarmalayıcı + mutlak `input` (**44×44**, yatayda 4 px sola kaydırılmış) + `peer-*` ile boyanan görünür kutu; `accent-[#3e6b3c]` ve `aria-invalid:` halkası kalktı, yerine `peer-checked:` / koşullu halka ve `peer-focus-visible:` kontur
- `src/components/layout/Header.tsx` → mobil menüdeki telefon bağlantısı `py-3.5` (127×17 → **127×45**; kapı bu paneli hiç görmüyor, elle ölçüldü)
- `_dev/docs/STYLE-GUIDE.md` → dokunma hedefi deyimi (üç hâl + çakışma uyarısı) ve onay kutusu gerekçesi

**Test Sonuçları:**
- **`mobile-audit.mjs`** (3100, 2 genişlik × 16 rota, 55 sn): `TOPLAM SORUN` **250 → 0**, çıkış **1 → 0**, `✓ KAPI YEŞİL`. Kritik kulvar **305 ölçüldü / 0 eşik altı / 0 benzersiz** (taban 305, oynamadı); alt kovaları **menü 61 · buton 111 · dönüşüm bağlantısı 125 · form alanı 8** (bağımsız ölçümle doğrulandı).
- **Negatif kontrol:** düzeltmeden önce aynı betik aynı hedefte (HEAD `ce3feb6`, 3100 taze) **250 / 19 benzersiz / 125 eşik altı** bastı — iki genişlikte birebir.
- **Kova sızıntısı yok:** metin elemanı **2054 → 2054** (taban 2054) · dokunma hedefi 638 → 638 · gezinme **333 / 261 eşik altı** ve alt kovaları birebir (gövde metni 1 · içerik yolu 4 · alt bilgi 256) · kaydırılabilir kap 5 → 5 · kırpma 0 → 0 · şerit 0 → 0 · muafiyet kovaları birebir. **Hiçbir kapsam tabanı değiştirilmedi.** Tek fark: eleman **6322 → 6326**, tamamı `/demo`'da (251 → 255) ve tam hesaplı — 2 yeni `<span>` + Check ikonunun 2 düğümü.
- **19 kalemin sonra-ölçüsü** (kapının sınıflandırıcısının birebir kopyasıyla, eşik süzgeci olmadan, 16 rota × 2 genişlik — **19/19 bulundu**, körleşme yok): `+90 535 937 59 55` 147×20 ve 280/350×39 → **147×44 ve 280/350×47** · `Demo İste` 72×39 ve 99×40 → **72×47 ve 99×44** · `Telefonla arayın` 280/350×39 → **280/350×46,5** · `Ana sayfa` 66×17 → **66×45** · `1/2/3/5/6 şube` 63-66×36 → **63-66×44** · `WhatsApp'tan sorun` 172×20 → **172×44** · `Segmentler` 75×20 ve 108×40 → **75×48 ve 108×44** · `Gizlilik Politikası` 144×40 → **144×44** · `Kullanım Koşulları` 152×40 → **152×44** · `KVKK Aydınlatma Metni` 193×40 → **193×44** · `konuşalım` 73×19 → **73×47** · `#consent` 18×18 → **44×44** · `Özellikler` 96×40 → **96×44** · `Fiyat` 65×40 → **65×44** · `Geçiş` 70×40 → **70×44**.
- **Hedef ↔ hedef çakışması** (16 rota × 2 genişlik, yapışkan katman içindekiler hariç): düzeltmeden önce **0** → ara hâlde **1** (alt bilgi çifti @320/@390) → onay kutusu kaleminde **1** → bugün **0**. Alt bilgi açıklıkları ölçüldü: WhatsApp ↔ telefon **4 px**, telefon ↔ e-posta **4 px**.
- **Yapışkan katman:** akıştaki hiçbir hedef başka bir akış hedefiyle çakışmıyor; yapışkan başlığın altından geçen içerik ayrı kulvar (a11y'nin raporladığı 151 kalemlik B-063 borcu, bu fazın kapsamı dışı) ve bu turda **oynamadı**.
- **`Button` yükseklik dengesi (TASK-3.14'ün ölçüsü) birebir:** 160 Button ölçüldü, saran **320'de 13 · 390'da 1 · 640'ta 0 · 1024'te 0**, dikey taşma **0**, yatay taşma **0** — dört genişlikte de.
- **Görünüş:** görünmez olması gereken altı kalem DOM'da geri alınarak ölçüldü ve hepsinde **0 farklı piksel** (kapanış çağrısı @320 0/156.000 ve @390 0/192.400 · `konuşalım` 0/180.000 · SSS kartı 0/192.000 · alt bilgi iletişim bloğu 0/384.000 · segment içerik yolu 0/132.000) — **pozitif çapa:** geri alınca kutular gerçekten küçüldü (44 → 20, 47 → 19, 46,5 → 38,5, 48 → 20). Mobil menü 0/312.000. Görünür üç değişiklik: 404 çipleri 32.570/228.000 · yasal çipler 20.942/180.000 · fiyat hesaplayıcı 28.531/276.000 (@320) ve 24.242/331.200 (@390) · onay kutusu **505/232.000 (%0,22)** ve 505/217.600 (%0,23) — fark kutunun kendisiyle sınırlı, metin konumu birebir · alt bilgi iletişim bloğu 15.677/422.400 (@320) ve 17.742/514.800 (@390), tamamı alttaki satırların 8 px kaymasından.
- **Sayfa boyu, 16 rotanın hepsinde** (DOM'da geri alınarak): alt bilgi **+16 px** her rotada; fiyat hesaplayıcı taşıyan 6 rotada ayrıca **+16**; çip taşıyan 4 rotada ayrıca **+8** (390'da bazıları +4, satır sayısı farkı). Toplam +452/+460 px. **Yatay kaydırma: 16 rota × 2 genişlikte 0.**
- **Onay kutusunun hâlleri** (320 ve 390'da birebir): hedef **44×44**, görünür kutu **18×18**; işaretsiz zemin `#fff` + **1 px `#d3d7ca`** halka · işaretli zemin **`#3e6b3c`** + 1 px `#3e6b3c` halka, işaret rengi `#fbfbf9` · geçersiz **2 px `#b34236`** halka (hem işaretli hem işaretsiz hâlde) · odak **`#3e6b3c` 2 px kontur**, görünür kutunun üstünde. `aria-invalid="true"` + `aria-describedby="consent-error"` + alan altında hata metni. **Genişletilmiş hedef gerçek:** görünür kutunun 10 px soluna ve 10 px üstüne dokunmak işaretliyor/kaldırıyor; **25 px soluna dokunmak işaretlemiyor** (negatif kontrol). Klavye `Space` çalışıyor. Geçersiz hâl `page.route` ile üretildi — kota sayılmadı, canlı depoya kayıt yazılmadı.
- **Regresyon:** `a11y.mjs` **6**, çıkış 1 — hepsi `/gecis`, bu task'ın kalemi değil; kapsam birebir (16 rota / 105 adım / 1834 eleman / gradyan 19 taban 19 / başlık 316 taban 316) · `font-guard` çıkış **0** (153 karakterlik küme, 16 sayfa, **85.129** karakter — birebir) · `perf` `/` masaüstü **141 KB / LCP 80 ms / CLS 0,005**, mobil **132 KB / LCP 64 ms / CLS 0**, `/demo` 73 KB (iki koşum, ikincisi raporlandı) · `scan` `/demo` @320 · `/` @390 · `/kvkk` @320 **üçü de konsol temiz** · `npm test` **219 geçti + 2 atlandı** (taban birebir) · `tsc --noEmit` **0** · `lint` **30 problem, yeni yok**.
- **3100 tazelendi ve pozitif + negatif kontrolle doğrulandı:** `lastmod` 19:40:55Z → **20:42:16Z**; pozitif — `/demo` paketinde `peer-checked` **3**, `-inset-[0.8125rem]` **1**, yayınlanan CSS'te `.min-h-11{min-height:calc(var(--spacing) * 11)}` ve beş `peer` kuralı (`:is(:where(.peer):checked~*)`) var, `accent-[#3e6b3c]` **0** (kalkmalıydı, kalktı) ve `min-h-11` HEAD kaynağında **0** kez geçiyordu; negatif — `scrollY>120` **1**, `Bilgilerim:` **1** (T16 ve T17'nin kalemleri yerinde).
- **Kapsam:** yayın kopyası (3100), `reducedMotion: reduce`, 320/390 px (Button dengesi ayrıca 640/1024). **Gerçek cihaz kapsam dışı → `kanal: UAT`.** Etkileşimli yüzeyler (mobil menü paneli, onay kutusunun hâlleri) kapının görüş alanı dışında ve **elle** ölçüldü.

---

---

**Oluşturulma:** 2026-09-23
