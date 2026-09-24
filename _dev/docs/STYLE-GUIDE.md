# STYLE-GUIDE — Tasarım Kuralları

**Amaç:** Görsel dil, tokenlar, tipografi tuzakları ve kullanıcının reflekslerinin tek evi. Yeni bölüm/sayfa tasarlayan ya da stil dokunan her oturum okur.
**Ne zaman okunmalı:** Her oturumda (projeye özgü sabit). UI'ya dokunmayan işte hızlı geçilir.
**Tokenların kaynağı:** `src/app/globals.css` → `@theme`. Buradaki değerler oradan **kopya değil özettir**; çelişkide CSS kazanır.

---

## Görsel Kimlik

- **Açık tema**, ferah, sage aksan. Karanlık tema yok.
- Fotoğraf: **gerçek salon görselleri**, seçici ve atmosferik (Pexels lisanslı; kaynaklar `research/FOTOGRAF-KAYNAKLARI.txt`; üretim `photos-build.mjs`).
- Ürün: **sahnelenmiş** ekran görüntüleri (`public/product/`, elle konmaz — `docs/CLAIMS.md`).
- Kiwi AI Lab imzası footer'da kendi bandında (`KiwiBand.tsx`), küçültülmez.

## Tokenlar (özet)

| Grup | Token | Değer / Not |
|---|---|---|
| Yüzey | `canvas` / `canvas-soft` / `surface` / `surface-2` | `#fbfbf9` / `#f4f5f1` / `#fff` / `#f7f8f4` |
| Mürekkep | `ink-deep` / `ink` / `muted` / `faint` | `#0e100c` / `#171a15` / `#545b4d` / `#68705e` — `faint` dört **düz** zeminde ≥ 4.71 kontrast, **koyulaştırma**; kompozisyonlu zeminde kullanılmaz (↓ `faint`in AA payı) |
| Çizgi | `line` / `line-2` | `#e5e7df` / `#d3d7ca` |
| Marka | `sage` / `sage-br` / `sage-deep` / `sage-ink` / `sage-wash` / `sage-wash-2` | `#74b36f` ana; metin için `sage-ink` `#2f5a2e` (açık zeminde `sage` metin olarak **kontrastı geçmez**) |
| Durum | `amber` / `amber-wash`, `neg` / `neg-wash` | `#8f5f10`, `#b34236` — kendi wash zeminlerinde ≥ 4.96 |
| Yarıçap | `radius-card` / `lg` / `xl` | 16 / 20 / 28 px |
| Gölge | `shadow-sm…xl`, `shadow-sage` | Mürekkep tabanlı, düşük opaklık |
| Hareket | `animate-marquee` (38 s), `animate-float` (7 s), `animate-pulse-ring` (2.6 s) | Reveal bileşeni giriş animasyonu için |

Yeni renk eklerken **kontrastı ölç** (`a11y.mjs`), rakamı CSS yorumuna yaz — mevcut token yorumları bu geleneği kurdu.

**Gradyan metin vurgusu** (`.text-gradient-sage`, TASK-3.11): açık zemindeki başlık vurgularının gradyanı `sage-deep` → `#41813d` → `#44943d`. Kapı gradyanın **en açık durağını** zemine karşı ölçer; eski üst duraklar (`sage` 2,28 · `sage-br` 1,64 canvas-soft üstünde) eşiği deliyordu, yenisi üç genişlikte **3,30-3,65** (gereken 3,0). Rampanın yönü korundu, yalnız açıklık aralığı sıkıştırıldı — ton 117→116→115, doygunluk 28→36→42, açıklık 33→37→41. ⚠️ **Düzeltme token'a değil sınıfa yapılır ve öyle kalmalı:** aynı `sage-br` otuzu aşkın yerde **koyu** zeminde kullanılıyor (Button, Icon, Footer, kapanış çağrısı bandı) ve orada parlaklığı doğrudur; iki inline gradyan vurgusu (`Solution` 8,92 · `FounderProgram` 9,84) da ondan beslenir ve geçer. **Kural genel:** bir marka renginin açık ve koyu zeminde farklı hükmü varsa düzeltme **kullanım sınıfına** iner, token'a değil.

**`faint`in AA payı ve kompozisyon kuralı** (TASK-3.12): Tablodaki *"dört zeminde ≥ 4.71"* beyanı **ölçümle doğrulandı** — `canvas-soft` üstünde desen ve gölge kapatıldığında `p02` = `min` = `med` = **4,71**. Eksik olan beyanın kendisi değil **payı**: eşik 4,5 olduğu için `faint`in marjı yalnız **0,21**, ve üstüne binen her katman bu payı yer. `Chaos`'ta ölçüldü: kartların `shadow-lg` gölgesi tek başına 4,71 → **4,47** (zaten AA altı), üstüne `bg-dotgrid` (opaklık 0,50) gelince **4,06**. ⚠️ **Deseni açmak çözüm değildir** — opaklık 0,50'den 0,12'ye indirildiğinde doku pratikte kayboluyor ama değer **4,47**'de kalıyor (ölçüldü), çünkü tavanı desen değil gölge belirliyor. **Kural:** desen, gölge ya da saydam kap gibi **kompozisyonla oluşan** bir zeminin üstünde `faint` kullanılmaz; bir tık koyu olan `muted` kullanılır (aynı yüzeyde **5,54**). Düz zeminde `faint` yerinde kalır ve dokunulmaz — `Hero`'nun `canvas` üstündeki üç `faint` kalemi 4,94-5,16 ile geçiyor. Bu, T11'in kuralının aynı ailesidir: düzeltme **kullanım yerine** iner, token'a değil.

**Dekoratif tipografi jesti `aria-hidden` alır — kontrastı yükseltilmez** (TASK-3.13, kullanıcı kararı): dev sıra numarası, dev hata rakamı gibi **bilgi taşımayan** iri rakamlar `sage-wash-2` gibi çok açık bir mürekkeple çizilir ve AA eşiğini yapısal olarak geçemez. Ölçüldü: `sage-wash-2` canvas üstünde **1,17** ve kompozisyon katmanlarının payı ihmal edilebilir (404'te desenin payı **tam 0**, ışık lekesininki **0,05**) — yani deseni açmak, gölgeyi kaldırmak gibi bir çare yok, tek seçenek rengi tanınmaz hâle getirmekti. Kural: bu jest `aria-hidden` taşır (ekran okuyucudan ve kontrast ölçümünden birlikte çıkar), rengi **dokunulmadan** kalır; bilgiyi sayfanın kendi `h1`'i/başlığı zaten söyler. Emsaller: `WhyUs.tsx` kart sıra numarası · `not-found.tsx` "404" · `global-error.tsx` "Hata". ⚠️ `/gecis`'in üç dev adım rakamı (`p02` 1,21) **aynı sınıf ve aynı renk** ama henüz `aria-hidden` almadı — adlandıran task yok, kayıt `BULGULAR.md` → Gelen Kutusu.

**Alt bilgi kolon başlıkları `h2`dir** (TASK-3.13): görsel olarak küçük büyük-harf etiket olmaları seviyeyi belirlemez — `Footer` 16 rotanın hepsinde çizildiği için seviyesi sayfa gövdesine bağımlı olamaz. Görünüş etkisi yok (`globals.css` `h1,h2,h3,h4`'ü aynı kurala bağlıyor; ölçüldü: 0 farklı piksel). **Genel kural:** her yerde çizilen ortak bir yüzeyde başlık seviyesi, o yüzeyin en zayıf bağlamına (gövdesinde hiç `h2` olmayan sayfa) göre seçilir.

**Form hatası deyimi** (TASK-2.06): geçersiz alan 2 px `neg` halka + `neg-wash` zemin alır, hata metni (`text-neg`) alanın **hemen altında** durur — renk tek işaret değildir (WCAG 1.4.1). Ölçülen kontrast: metin form zemininde 5,25 · alan zemininde 4,96 · halka 5,25 (gri halka 1,46). ⚠️ `aria-invalid:` varyantı Tailwind 4.3.3'te **yerleşik değil** ve tanımsızken sessizce hiçbir kural üretmez; `globals.css` → `@custom-variant aria-invalid` ile kayıtlıdır. Odak halkası kırmızının üstünde kalmalı (`aria-invalid:focus:`), yoksa geçersiz alanda odak görünmez olur.

## Tipografi

- **Sora** başlık (700/800), **Inter** gövde (400/500/600). Self-host, siteye özel daraltılmış: 153 karakter, 5 dosya, 95 KB.
- **Sora'da ₺ (U+20BA) yok.** `--font-display` yığını `"Sora", "Inter", …` — Inter yedeği **kaldırılmaz**; fiyat rakamları böylece tek dilde kalır.
- Kümede olmayan bir karakter kullanırsan `font-guard.mjs` yakalar. Kümeyi genişletmek için `research/FONT-KARAKTER-KUMESI.txt` güncellenir ve `font-subset.mjs` yeniden koşturulur.
- `unicode-range` **kullanılmaz** — tek dosya zaten yalnızca gereken glifleri taşır.
- Başlıklar `letter-spacing: -0.022em`, `text-wrap: balance`; paragraflar `text-wrap: pretty`.

## Düzen Tuzakları (ölçülmüş, tekrar etmesin)

| Tuzak | Belirti | Kural |
|---|---|---|
| `position: sticky` bölümün üst katmanında `overflow-hidden` | Sticky sessizce ölür, hata yok | Sticky kullanan bölümün **hiçbir atasında** `overflow-hidden` olmaz; taşma kesimi bölümün kendi içinde çözülür |
| Izgara öğesinde `min-width: auto` varsayılanı | İçerik sütunu şişirir, sayfa yatay kayar (635 px / 390 px görüldü) — ya da hiç kaymaz ve içerik **sessizce kesilir** (320 px'te ölçüldü) | Grid/flex çocuğuna `min-w-0` ver. `mobile-audit.mjs` bunu **artık gerçekten doğruluyor** (TASK-3.07): 320 ve 390 px'te doğrudan metin taşıyan her elemanın kutusu onu kesen atasının kutusuna karşı ölçülür, kesilen tek eleman kapıyı kırmızıya çevirir. Kaydırılabilir kap · kayan şerit · `sr-only` yüzey muaftır ve ayrı sayılır |
| Bir ilkelin **temel sınıfında** koşulsuz `whitespace-nowrap` | Etiketin min-content'i ağaçta yukarı yayılır: uzun CTA → dolgulu kart → ızgara track'i → bölümün `overflow-hidden`'ı içeriği sessizce keser (320 px'te 19 düğüm ölçüldü). Yan etki: aynı satırdaki ikon `shrink-0` yoksa 1 px'e ezilir | `Button` tabanında `sm:whitespace-nowrap` (< 640 px'te sarar, ≥ 640 px'te tek satır). Sabit yükseklikler iki satırı taşır (ölçüldü: 8 genişlikte dikey taşma 0). Bir çağrı sarmayı kaldırmıyorsa çözüm **o çağrıya** yerel `whitespace-nowrap` vermektir — tabana geri koymak değil |
| Kaydırılabilir şeritte sabit genişlikli kart | Kart pencereden geniş kalır ve **hiçbir zaman tümüyle görünmez** — sayfa yatay kaymadığı için sessizdir (Roller şeridinde 360 px'lik kartlar hem 320 hem 390 px'te ölçüldü) | Tavan **kabın görünür genişliğine** bağlanır, pencereye değil: `max-w-[calc(100%_-_3rem)]` (yüzde, esnek kabın içerik kutusuna göre çözülür — `mobile-audit.mjs`'in ölçütüyle aynı referans). Pay bırakılır ki sonraki karttan bir parça görünsün; `lg:` gibi şeridin dikeye döndüğü kırılımda tavan `max-w-none` ile kaldırılır |
| Ekran üstü açıklama etiketi | Tam gösterdiği sayıyı örtüyordu | Ürün turunda **numaralı nokta** + kenarda açıklama; etiket görselin üstüne binmez |
| Hero'da telefon etiketi | Telefon mockup'ının üstüne biniyordu | Mockup ve etiket ayrı grid alanlarında |

**`whitespace-nowrap` bir görsel tercih değil, min-content tabanıdır** (TASK-3.14): `Button`'ın temel sınıfındaki koşulsuz `nowrap` "Kurucu Programı için konuşalım" etiketine 314 px'lik kırılamaz bir taban veriyordu; `p-7` kartında 370 px'e çıkıyor, ızgara çocuğunun `min-width:auto` varsayılanı bunu track'e geçiriyor ve bölümün `overflow-hidden`'ı 320 px'te sağdan 70 px kesiyordu — **işlev kaybı**, çünkü kesilenler arasında CTA'nın kendi yazısı vardı. ⚠️ **Kırpmayı bitiren şey `min-w-0` değildi:** izolasyonda `min-w-0` tek başına kırpmayı 0'a indirdi ama etiketi buton kutusundan 19 px taşırdı (243 > 224); `nowrap`'in kalkması ise kartın min-content'ini 370 → **222**'ye düşürerek tabanı kökten kaldırdı. İkisi birlikte uygulanır ama roller ayrıdır: `nowrap` çözer, `min-w-0` savunma derinliğidir. **Sınır `sm:` ölçülerek seçildi:** tamamen kaldırmakla `sm:` ile sınırlamak 320/390 px'te birebir aynı (kırpma 19 → 0, hiçbir genişlikte dikey/yatay taşma yok), tek fark 1024 px'te — tamamen kaldırmak `/demo`'da iki butonu iki satıra düşürüyordu, `sm:` ise 640-1440 px'te bugünkü hâli **0 farklı piksel** ile koruyor (4 tam sayfa / 40 M piksel ölçüldü). WCAG 1.4.10 reflow'un genişliği ve bu projenin kapısı zaten ≤ 390 px'tir. **Bedeli yazılı:** ≥ 640 px'te tuzak yaşıyor ve onu ölçen kapı yok.

**Kaydırılabilir şeritte "sığıyor"un ölçüsü pencere değil KABIN GÖRÜNÜR GENİŞLİĞİDİR** (TASK-3.15): Roller şeridinin kartları 360 px'ti ve kayıt *"320 px'te sığmıyor, 390'da sığıyor"* diyordu — yanlış. Şeridin `clientWidth`'i 390 px penceresinde **350** (kapsayıcı dolgusu 2×20), yani kart orada da eksik görünüyordu; ölçülen ihlal iki genişlikte de aynıydı. Pencereye göre yazılan bir düzeltme 320'yi yeşile çevirip kapıyı 390'da kırmızı bırakırdı. **Kural:** kaydırılabilir bir kabın çocuğuna tavan konurken referans kabın kendisidir — yüzde tabanlı bir `max-width` esnek kabın **içerik kutusuna** göre çözülür ve `mobile-audit.mjs`'in ölçütüyle (`çocuk genişliği ≤ kabın clientWidth'i`) birebir aynı şeyi ölçer.

⚠️ **Tavanı `100%` yapmak kapıyı yeşile çevirir ama şeridi öldürür** (aynı tur, ölçüldü): ilk kart görünür alanı tam doldurduğunda sonraki kart gap kadar bile görünmez ve kalan sekmelerin varlığına dair **hiçbir ipucu kalmaz** — dört sekmeli bir şeritte bu, kapı geçerken işlev kaybetmektir. Bu yüzden tavan bir pay taşır (`calc(100% - 3rem)` → 8 px gap düşülünce **40 px** sonraki kart görünür). Bedeli, ihlalin olmadığı bir genişlikte de kartın daralmasıdır (412 px'te 360 → 324) ve bu bilinçlidir: ölçüldü, **hiçbir genişlikte dikey yerleşim kaymıyor** (şerit yüksekliği 118 px sabit, bölüm ve sayfa yüksekliği birebir) ve **≥ 640 px'te görünüş 0 farklı piksel** (6 kombin / 88,97 M piksel).

**Ürün ekranının çerçevesi rolün beyanından değil GÖRSELİN ORANINDAN türer** (TASK-3.15): `Roles` bölümünde telefon/tarayıcı çerçevesi seçimi `role.device`'a bağlıydı ve antrenör rolü `device: "mobil"` olduğu için 1200×866'lık bir masaüstü panosu telefon çerçevesine giriyordu (ölçüldü: 244×129 — okunmaz). Rolün `device` değerini "web"e çekmek çerçeveyi düzeltirdi **ama siteye yanlış bir cümle söyletirdi** (`faq.ts`, `gecis.ts` ve bölümün kendi lead cümlesi antrenörün kendi telefonundan çalıştığını yazıyor; `docs/CLAIMS.md` bunu söylenebilir sayıyor). **Kural:** rolün beyanı ürün gerçeğini söyler ve dokunulmaz; çerçeve, elde gerçekten duran görselin şeklini söyler (`shot.height > shot.width`). Yan kazanç: doğru yakalama üretildiği gün koşul kendiliğinden döner, geri alınacak geçici kod kalmaz.

**Dokunma hedefi 44 px — üç deyim, seçimi ELEMANIN DISPLAY'i belirler** (TASK-3.17): kapı hedefi *kontrolün kendi kutusundan* ölçer (sarmalayan `<label>`ın tıklanabilir alanından değil, TASK-3.08), yani `::before` ya da mutlak kaplama gibi **kutuyu büyütmeyen** genişletmeler kapıyı geçmez — ölçülen `getBoundingClientRect()`'tir. Sırayla:

| Hâl | Deyim | Ölçülen |
|---|---|---|
| Kutunun kendi zemini/halkası var (çip, buton) | `inline-flex min-h-11 items-center` — dolgu sınıfı (`py-*`) **kalkar** | 404 ve yasal çipler 40 → 44 · şube seçici 36 → 44; sayfa +8/+16 px |
| **Satır içi** bağlantı (`display:inline`) | yalnız `py-3.5` — dikey dolgu satır kutusunu **etkilemez**, telafi gerekmez | `konuşalım` 19 → 47 · içerik yolu `Ana sayfa` 17 → 45; sayfa boyu **birebir**, 0 farklı piksel |
| Blok/flex öğesi, görünüş değişmemeli | dolgu + **negatif margin telafisi** (`-my-3 py-3`) | kapanış çağrısı telefonu 20 → 44 · SSS WhatsApp'ı 20 → 44; sayfa boyu birebir, 0 farklı piksel |

⚠️ **Görünmez genişletmenin kendi fail-open'ı var: KOMŞULARLA ÇAKIŞMAYI AYRICA ÖLÇ.** Kapı tek tek kutuları ölçer, **çakışmayı görmez**; üst üste binen iki hedefte boyama sırası kazanır, yani üstte kalanın altındaki hedefin *gerçek* alanı kapının gördüğünden küçüktür. Aynı turda iki gerçek örnek ölçüldü ve ikisi de düzeltildi: (1) alt bilgideki iki dönüşüm bağlantısı yan yana ve **ikisi de** büyüdü — 30,5 px'lik akış yüksekliği + 12 px boşlukla adım 42,5 px iken iki 46,5 px'lik kutu birbirine **4 px** giriyordu; telafi `-my-2`'den `-my-1`'e çekildi (kutu 46,5 kalır, akıştaki yer 38,5'e çıkar, 4 px açık doğar, alt bilgi 16 px uzar). **Beş satır 42,5 px adımla dizilirken hepsine 44 px sığdırmak geometrik olarak mümkün değil** — seçim "görünmez ama çakışan" ile "biraz daha ferah ama gerçek" arasındadır. (2) Onay kutusunun 44 px'lik kutusu rıza cümlesindeki bağlantıya **1 px** giriyordu; kutu yatayda 4 px sola kaydırıldı (`-left-[1.0625rem] -right-[0.5625rem]`, genişlik 44'te kalır). Ölçüm: 16 rota × 2 genişlik, yapışkan katman içindeki hedefler hariç — **düzeltmeden önce 0, ara hâlde 1, bugün 0**.

**Onay kutusu: 18 px görünür, 44 px hedef — yerli çizim bırakılır** (TASK-3.17): ölçüldü ki `appearance: auto` iken tarayıcı onay kutusuna yazılan **dolguyu ve kenarlığı sıfırlıyor** (`padding:13px` verildiğinde hesaplanmış değer `0px`, kutu 18×18); `margin` uygulanıyor ama yerleşimi kaydırıyor, `width/height:44px` ise yerli çizimi de 44 px'e ölçekliyor. Yani kutuyu büyütmenin tek yolu `appearance: none`'dur ve görünür kutu elle çizilir: akışta 18 px'lik sarmalayıcı durur (eski `input`in yerini birebir alır), `input` **mutlak** konumlanır (akış dışı → telafi gerekmez), görünür kutu `peer-checked:` ile boyanır. **Hata deyimi parite ile korunur** — 2 px `neg` halka + alanın altında hata metni; `neg-wash` zemin **eklenmez**, yerli kutuda da yoktu. Odak: `input`in kendi `:focus-visible` konturu bastırılır (yoksa 44 px'lik görünmez kutunun etrafında çizilirdi) ve aynı kontur `peer-focus-visible:` ile görünür kutuya taşınır — kontur halkanın **dışında** çizildiği için kırmızının üstünde kalır. Ölçülen hâller: işaretsiz `line-2` 1 px halka · işaretli `#3e6b3c` zemin + 1 px halka · geçersiz `neg` **2 px** halka (işaretli ve işaretsiz hâlde) · odak `sage-deep` 2 px kontur; genişletilmiş hedef **gerçek** (görünür kutunun 10 px soluna/üstüne dokunmak işaretliyor, 25 px soluna dokunmak **işaretlemiyor** — negatif kontrol). ⚠️ **Bedeli yazılı:** `appearance: none` yerli çizimi bırakır, yani zorunlu renk kipinde (forced-colors) sistemin kendi kutu çizimi kaybolur — kalem `BULGULAR.md` → Gelen Kutusu'nda.

## Kullanıcının Refleksleri

**Kullanma** ("AI ile yapılan her sitede var" — amatör ve şablon görünümü):
- Başlık üstünde **parıltı ikonlu kapsül rozet** (✨ + pill). Başlık kendi başına dursun ya da düz, ikonsuz üst etiket.
- Sparkles/Zap gibi "AI parıltısı" ikonlarını dekoratif kullanmak.
- **Jenerik ikonlu kart ızgarası** (3×N eşit kart, ikon + başlık + iki satır). Bölüm tasarlarken düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma.
- Sahte logo şeridi, "Trusted by 10,000+", mor-mavi gradyan kartlar, gereksiz glassmorphism.
- Sayı sayma animasyonlu istatistik bandı — yalnız klişe değil, **rakam da yok** (`docs/CLAIMS.md`).

**İstiyor:**
- Gerçek fotoğraf, ürün sahneleme, hareket (Reveal, marquee, float), özel çizim (kaos bölümündeki WhatsApp/Excel/defter nesneleri gibi).
- Düzen çeşitliliği: her bölüm bir öncekinden farklı ritimde.

## Metin Tonu

Konuşma diline yakın, salon sahibine hitap; kurumsal jargon yok. Kullanıcı 2026-09-11'de "daha profesyonel" istedi — hangi cümlelerin fazla samimi geldiği henüz alınmadı; iş "Metin tonu" faz konusunda (`modules/M1-Icerik-ve-Iddia-Kaynagi.md` → F1.2). Ton `src/content/` altında değişir, bileşenlerde değil.

---

**Son Güncelleme:** 2026-09-24 — TASK-3.17: dokunma hedefi deyimi yazıldı — 44 px'i hangi yolla sağlayacağın elemanın `display`'ine bağlıdır (görünür kutuyu büyüt / satır içinde yalnız dolgu / dolgu + negatif margin telafisi), görünmez genişletmenin kendi fail-open'ı kayda geçti (komşu hedeflerle çakışmayı kapı görmez; iki gerçek örnek ölçülüp düzeltildi) ve onay kutusunun `appearance: none` gerekçesi + hata/odak deyiminin nasıl korunduğu yazıldı. Token değerlerine, tipografiye ve refleks listesine dokunulmadı.
