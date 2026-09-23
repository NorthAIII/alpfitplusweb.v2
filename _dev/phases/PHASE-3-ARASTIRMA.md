# Phase 3 — Araştırma Bulguları

← PHASE-3 · araştırma-detayı

> `_dev/phases/PHASE-3.md` → Araştırma Bulguları'nın bölme çocuğudur (plan-phase boyut ölçümü, 2026-09-23; faz **hâlâ aktifken** bölündü — task listesi yazıldığında parent 20.506 token ile kırmızı çizgiyi aştı). Parent'ta seçilen yaklaşımların, devralınan iddiaların ve teknik kararların **self-yeten özeti** ile bu dosyanın pointer'ı durur; **research-phase'in tam kaydı — değerlendirilen yaklaşımların karşılaştırması, devralınan dokuz iddianın ölçüm tablosu, tuzakların tam listesi ve tanımlayıcı kaynakları — buradadır.**
>
> Task dokümanları ölçüm rakamlarını ve tuzakları buradan okur; faz review'ı (`review-phase`) araştırma ↔ sonuç karşılaştırmasını buradan yapar.

---

> `/devflow:research-phase` oturumunda dolduruldu (2026-09-23). Bu turun bütün rakamları bu oturumda ölçüldü; devralınan rakamlar ayrıca **yeniden** ölçüldü (aşağıda → Devralınan iddiaların ölçümü).

### Değerlendirilen Yaklaşımlar

**1. Kontrast ölçümü — hesaplanmış stil mi, piksel mi**

- *Hesaplanmış stil (bugünkü model), kör noktalar yamayla kapatılır:* ucuz ama gradyan/fotoğraf zemini ve gradyanla boyanmış metin **yapısal olarak** temsil edilemez — tek renk yoktur, metnin rengi `transparent`'tır. Yama sayısı arttıkça `skipped` büyür, sıfır dar kalır.
- *Piksel ölçümü:* iki kare (normal / metni görünmez) farkından glif maskesi; **metin rengi CSS'ten**, zemin maskenin altındaki **gerçek pikselden**; ata opaklık çarpımı renge uygulanır.
- **Seçilen: piksel ölçümü.** Bu oturumda sıfırdan prototiplendi ve çalıştı: B-032'nin kayıtlı rakamlarını **birebir** yeniden üretti (kapanış paragrafı `p02=3,97 / min=3,83` — kayıt `3,97 / 3,83-3,90`; desenli zemin `p02=4,06 / min=3,95 / med=4,63` — kayıt birebir aynı). Tek değişiklikle B-031'in (1), (2) ve (3) numaralı kör noktalarını birden kapatıyor.

**2. Glif çekirdeğini kenar pikselinden ayırma — ölçülmüş tek doğru yol**

Prototipin ilk turu metin rengini **boyanan pikselden** aldı ve 100 ölçümün **95'ini** eşik altı gösterdi; rakamların `med`'i 17'ye çıkarken `p02`'si 1,1'de kalıyordu — yani okunan şey metin değil **antialias kenarıydı**. Glif gövdesini morfolojik erozyonla (4-komşu testi) ayıklamak ince yazıda işe yaramıyor: 11-15 px gövde metninin inmesi çoğu yerde tek piksel, iç pikseli yok. **Doğru yol:** fg CSS'ten gelir (antialias hiç karışmaz), piksel yalnız **zemini** verir. Bu düzeltmeden sonra aynı sayfalarda eşik altı 95 → 1'e düştü ve kalan tek kalem 404'teki dev rakamdı.

**3. Ölçüm penceresi — tek ekran mı, kaydırmalı mı**

Tek ekran (viewport) ölçümü B-032'nin kalemlerinin **hiçbirini** görmüyor; hepsi ilk ekranın altında (ölçüldü: 1440 px'te ilk ekranda ihlal 0, sayfa tamamında 21). **Seçilen:** sayfa `0,9 × viewport` adımlarla ekran ekran gezilir, her adımda iki kare alınır. Ana sayfa 1440 px'te 13 adım, `/ozellikler` 10 adım.

**4. Rota listesinin tek kaynağı — `sitemap.ts` import edilemez**

Araştırma konteyneri depoyu değil **yalnız `./research` dizinini** görüyor (`docker-compose.yml` → `research.volumes`), yani `src/app/sitemap.ts` ya da `src/content/segments.ts` doğrudan okunamaz. **Seçilen:** liste ayakta olan siteden `/sitemap.xml` ile HTTP üzerinden türetilir, `/olmayan-sayfa` elle eklenir. Ölçüldü: **15 + 1 = 16 rota** — hedeflenen kapsamın tam karşılığı, ve yeni sayfa eklendiğinde liste kendiliğinden büyür.

**5. Kırpılmış taşma dedektörü ve zorunlu muafiyeti**

Ölçüt: metin taşıyan düğümün sınır kutusu, onu kırpan atasının kutusunun **dışına** taşıyor mu. Ham hâliyle çalışmıyor — **muafiyetsiz 59 sahte pozitif** verdi (kayan tanıtım şeridi ve yatay kaydırılabilir kaplar bilerek kırpılır ve içerik zamanla/kaydırmayla erişilebilir). **Seçilen:** kırpan ata `overflow-x: auto|scroll` ise ya da düğümün ata zincirinde çalışan bir CSS animasyonu varsa kalem **muaf** sayılır ve ayrı sayılır. Muafiyetle birlikte sonuç: **320 px'te 19 gerçek kırpılmış düğüm, 390 px'te 0.**

**6. Hareket azaltma — kontrast ölçümünün ön koşulu, tercih değil**

Ata opaklık çarpımı uygulandığı anda `Reveal` sarmalayıcısının **geçiş ortası** opaklıkları ölçüme giriyor (ölçülen ara değerler: 0,459 · 0,618 · 0,666 · 0,711 · 0,818) ve sahte ihlaller üretiyor. B-031'in "Reveal kapıyı kör etmiyor" gözlemi **eski model için** doğruydu (orada yalnız elemanın kendi opaklığı okunuyordu); kör noktayı kapatmak bu sınıfı açıyor. **Seçilen:** kontrast ölçümü `prefers-reduced-motion: reduce` altında koşar. Aynı koşum **M2 F2.3'ün bugüne dek hiç ölçülmemiş kriterini de doğruladı**: hareket azaltma açıkken ara opaklık kalmıyor, yani Reveal tercihe gerçekten saygı gösteriyor.

### Kullanılacak Araçlar/Kütüphaneler

- **playwright** (araştırma konteynerinde kurulu, `Dockerfile.research`) — ekran görüntüsü, `reducedMotion`, `javaScriptEnabled`, `deviceScaleFactor`, viewport.
- **sharp** (aynı konteynerde kurulu) — ham piksel erişimi (`raw().toBuffer()`).
- **Yeni bağımlılık gerekmiyor.** Piksel yöntemi, kırpma dedektörü, zoom ve hareket-azaltma eksenlerinin hepsi bu ikisiyle kuruluyor — prototiplerle doğrulandı.

### Dikkat Edilecekler

**Devralınan iddiaların ölçümü** (kapsam bunların üzerine kurulmuştu; hepsi bu oturumda yeniden ölçüldü):

| # | Devralınan iddia | Sonuç |
|---|---|---|
| 1 | "Çalışan piksel-kontrast uygulaması ve kırpma dedektörü scratchpad'de bırakıldı, **devralınabilir**" (B-031, B-033) | **ÇÜRÜDÜ.** Adı geçen altı betiğin hiçbiri makinede yok (dosya sistemi geneli arandı). Scratchpad oturuma özgü. **İkisi de bu oturumda sıfırdan yazıldı** — task planı "devralınan kodu uyarla" değil "yaz" olarak boyutlanır |
| 2 | B-032 kalem 1/2/4/5 — soluk kartlar, kapanış paragrafı, desenli zemin, 404 rakamı | **DOĞRULANDI**, rakamlar birebir: soluk kart gövdesi 2,52-2,53 · etiket 2,98-3,00 · kapanış paragrafı `p02` 3,97 · desenli zemin `p02` 4,06 · 404 rakamı 1,12 |
| 3 | "**Ölçülmüş beş** kontrast ihlali" (milestone ve kapsam) | **EKSİK — gerçek küme daha geniş.** (a) soluk kartların **başlıkları** da eşik altı ve kayıttaki hiçbir rakamdan kötü: **1,13:1** (gereken 3) — "Gün, tek ekranda" · "Şubeler yan yana"; (b) iki yeni yüzey: "Kulübünüzün diyetisyeni aynı platformda…" **3,47** ve boks sayfasında "Gelmedi kolonu raporda ayrı" **3,65**; (c) gradyanla boyanmış metin 5 değil **11 benzersiz** yerde. Kullanıcı kararı: **hepsi düzelir** (→ Teknik Kararlar) |
| 4 | B-033 — 320 px'te içerik ve işlev kaybı, 390 px'te yok | **DOĞRULANDI:** 320 px'te **19** gerçek kırpılmış metin düğümü, 390 px'te **0**; 16 rotanın hiçbirinde yatay kaydırma yok (kapının bugünkü geçme şartı hâlâ sağlanıyor, yani kırpma yine sessiz). `Button.tsx`'in temel sınıfındaki `whitespace-nowrap` yerinde duruyor |
| 5 | B-022 — mobilde ilk ekranda dönüşüm yüzeyi yok (4 sayfa + 3 yasal) | **DOĞRULANDI ve genişledi.** 390 px'te tam olarak sayılan 6 sayfa: `/fiyat` · `/segmentler` · `/demo` · üç yasal sayfa. **320 px'te 16 sayfanın 13'ü** boş — dar telefonda sorun çok daha geniş. `Header.tsx:94` (`lg:flex`) ve `Assistant.tsx:43` (`scrollY > 480`) mekanizmaları yerinde |
| 6 | "157 küçük dokunma hedefi" (kademeli kural buna dayanıyordu) | **SINIFLANDIRILDI.** Alt bilgi ve içerik yolu dışarıda tutulduğunda **19 benzersiz kritik hedef** kalıyor (16 sayfada 61 örnek); gövde metni içi bağlantı **324**. Kritik kümenin tamamı somut: şube seçici butonları (63-66×36), "WhatsApp'tan sorun" (172×20), telefon bağlantısı (147×20), form alanı (250×24) ve **onay kutusu (18×18)** |
| 7 | B-046 — "Antrenör satırı **tek satırlık** bir hatadır, doğru ekran üretilen kümede **zaten var**" | **İDDİA EKSİK.** Doğru *içerik* var (`SHOTS.antrenor`) ama o görsel **1200×866 — bir masaüstü ekranı**; antrenör rolü `device: "mobil"`, yani tek satırlık düzeltmeden sonra da telefon çerçevesinde masaüstü panosu durur. Ürünün demo destesi tarandı: `.phone` yüzeyi **üç** dosyada var (`takvim.html` → üye, `grup.html` → üye, `patron-mobil.html` → patron) — **antrenör telefonu yok**. Kullanıcı kararı: diyetisyenle birlikte o da eklenecek |
| 8 | B-057/B-046 — "font preload HTML'de iki kez yazılmış (4 etiket)" | **ÇÜRÜDÜ.** Yayınlanan HTML'de font preload'u **2 etiket** (`inter-400`, `sora-800`); tekrar yok. Bu alt kalem kapsamdan düşer |
| 9 | B-051 — ızgaralar hakkında bilinçli tercih kaydı yok | **DOĞRULANDI**, bu kez karar günlüğünün **üç** dosyasının hepsinde arandı (aktif seri + iki arşiv aralığı): ikon ızgarası, `Benefits` ya da `Modules` hakkında kayıt yok. Izgaralar da yerinde (`Benefits` 8 kart / `lg:grid-cols-4`, `Modules` 5 kart / `lg:grid-cols-3`) |
| 10 | B-057 — segment LCP'si ve font takası | **Mekanizmalar kodda doğrulandı** (`priority` + `sizes="100vw"` dekoratif kahraman görselinde; hiçbir `@font-face`'te `size-adjust`/`ascent-override` yok). **Rakamlar doğrulanmadı** — kayıttaki ölçüm `147c5e8` dağıtımına ait ve Faz 2 o günden beri çok sayıda commit gönderdi. Düzeltme task'ı kendi öncesi/sonrası ölçümünü kendisi alır |
| 11 | B-046 — Sora'nın taşımadığı beş karakter | **Küme tarafı doğrulandı:** `₺` ve dört ok (`←↑→↓`) kümede **var** (153 karakter) ve font dosyaları daraltma commit'inden beri **hiç değişmedi** — yani beyan ↔ font sözleşmesindeki boşluk aynen duruyor |

**Tuzaklar ve nasıl kaçınılacak:**

- **Metin rengini boyanan pikselden alma.** Antialias kenarı ölçümün %95'ini sahte kırmızı yapar (ölçüldü). fg CSS'ten, zemin pikselden.
- **Kırpma dedektörünü muafiyetsiz kurma.** Kayan tanıtım şeridi ve yatay kaydırılabilir kaplar 59 sahte pozitif üretir (ölçüldü).
- **Kontrastı hareket azaltma olmadan ölçme.** Reveal'in geçiş ortası opaklıkları ihlal gibi okunur (ölçüldü — beş ayrı ara değer).
- **Yapışkan ve sabit katmanlar ekran ekran ölçümde her adımda yeniden görünür** ve koordinatları kayar; prototipte bu sınıf ölçüm dışı bırakıldı (3 sayfada 335 örnek) — **ama bu bir çözüm değil, bir borç:** Header'ın gezinme bağlantıları böylece hiç ölçülmüyor. Kapı bu sınıfı **ayrı bir pasta**, kaydırma sıfırdayken ölçmeli.
- **Roller sekme şeridinin 320 px kalemi kırpma dedektörüne görünmez** — şerit yatay kaydırılabilir olduğu için muafiyete düşer. Ayrı ölçüt gerekir: kaydırılabilir şeritte **tek bir öğe** pencereden genişse kart hiçbir zaman tümüyle görünmez.
- **3100 bayat olabilir.** Kapılar artık yayın kopyasını ölçecek: `docker compose build web-prod` imajı tazeler ama konteyneri **yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir (`memory/alternatif-env-ile-uretim-derlemesi.md`).
- **Bulamayan seçici betiği yeşil bırakır.** Her ölçüm turu "kaç düğüm buldum" sayısını basmalı; prototiplerde bu kural uygulandı ve iki kez kör seçici yakalandı.

**Tanımlayıcıların kaynağı** (plan ve task'lar bu çapaları yeniden türetmez — ⚠️ satır numaraları faz ilerledikçe kayar, kullanmadan önce `grep -n` ile yeniden konumlandır):

| Tanımlayıcı | Kaynak |
|---|---|
| `research/scripts/a11y.mjs` · `mobile-audit.mjs` | repoda tanımlı — bu fazda değişecek iki kapı |
| Rota listesi (16) | repoda tanımlı: `src/app/sitemap.ts` + `src/content/segments.ts` → **`/sitemap.xml`** üzerinden okunur |
| `src/components/ui/Button.tsx` — temel sınıfta `whitespace-nowrap` | repoda tanımlı — B-033'ün tabanı |
| `src/components/sections/ProductStory.tsx:223` `lg:opacity-45` · `:156` `priority={i === 0}` (`hidden lg:block` içinde) · `:159` `opacity-0` (`aria-hidden` yok) | repoda tanımlı |
| `src/components/sections/FinalCta.tsx:31` `text-ink-deep/75` | repoda tanımlı — tek değişiklik beş sayfayı düzeltir |
| `src/app/globals.css:203` `.text-gradient-sage` | repoda tanımlı — 9 bölüm dosyasında kullanılıyor, 11 benzersiz metin |
| `src/app/not-found.tsx:14` dev rakam · `src/app/global-error.tsx` eşi | repoda tanımlı — `aria-hidden` **yok**; sayfanın `h1`'i hatayı zaten söylüyor (doğrulandı), yani dekoratif ilan bilgi kaybı üretmiyor |
| `src/components/sections/Roles.tsx:11-16` `VISUAL` eşlemesi · `src/content/shots.ts` yedi anahtar | repoda tanımlı |
| `src/components/layout/Header.tsx:94` (`lg:flex`) · `Assistant.tsx:43` (`scrollY > 480`) · `src/content/site.ts:21` (`wa.me`, `?text=` yok) | repoda tanımlı — B-022'nin üç mekanizması |
| `public/foto/salon-genis-wide.webp` (2000×760) | repoda **var ama öksüz** — hiçbir yerden referans verilmiyor; bant slotlarının adayı |
| Antrenör telefon ekranı · diyetisyen ekranı | **dış + yeni** — `../Alpfit.v1/demo/` (salt okunur, kullanıcı ekler); bugün deste sekiz ekran taşıyor ve ikisi de yok |
| `size-adjust` / `ascent-override` yedek yüz tanımları | **yeni** — `src/app/globals.css`'te bugün hiç yok |

### Teknik Kararlar

- **Kontrast ihlallerinin tamamı bu fazda düzelir** (kullanıcı kararı, 2026-09-23) — kayıtlı beş kalem değil, ölçümün bulduğu küme. Gerekçe: yeni kapı hepsini kırmızıya çevirecek; düzeltilmeyen kalem için kapıya adıyla muafiyet yazmak gerekirdi ve muafiyet listesi zamanla unutulur. **Milestone'un "beş" sayısı ölçümle eskidi; cümle yeniden yazılmaz**, gerçek küme bu bölümdeki tablodadır (3. satır).
- **Kontrast ve mobil kapıları yayın kopyasını ölçer** (kullanıcı kararı) — bugünkü geliştirme sunucusu hedefi yerine üretim konteyneri. Gerekçe: ölçülen ile yayınlanan aynı şey olur; bedeli her koşumdan önce imaj tazeliği ve bunun kendi tuzağı yukarıda yazılı.
- **Dokunma hedefi kuralının mekanik ölçütü:** buton · form alanı · sekme · menü (`header`/`nav`) · `/demo`, `wa.me` ve `tel:` hedefli bağlantılar **kırmızıya düşürür** (19 hedef); alt bilgi **ve içerik yolu** bağlantıları ölçülür ve raporlanır ama düşürmez (kullanıcı kararı — ikisi de gezinme yüzeyi, dönüşüm yüzeyi değil).
- **Antrenör ve diyetisyen ekranları birlikte istenir** (kullanıcı kararı): ürünün demo destesine iki ekran eklenecek, görsel hattı ikisini de olağan biçimde üretecek. **Faz bu adıma kilitlenmez** — gelmezse antrenör sekmesi tek satırlık düzeltmeyi alır (doğru içerik, hâlâ masaüstü çerçevede) ve iki kalem de kanvasta açık durur.
- **Kontrast ölçümü hareket azaltma altında koşar.** Bu bir eksen tercihi değil, ölçümün doğruluk koşulu (yukarıda 6. yaklaşım). Turun diğer üç yeni ekseni (%200/%400 büyütme, JavaScript kapalı, yatay tutuş) keşif turunda kalır ve kapıya girmez — kapsam kararı bu fazın kapı işini a11y/mobil ayağıyla sınırlamıştı.
- **Gradyanla boyanmış metin piksel yöntemiyle de ölçülemez** (rengi CSS'te yok) ve ayrı ele alınır: 11 benzersiz metnin rengi kaynağındaki en açık duraktan okunur ve zemine karşı sınanır. Bu sınıf kapıda **"ölçülemeyen"** değil, kendi dalı olarak sayılır — yoksa düzeltildikten sonra da eşikte görünmez kalır.


