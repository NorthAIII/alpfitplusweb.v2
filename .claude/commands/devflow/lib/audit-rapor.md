# DevFlow — Audit: Paket Raporu (audit-rapor)

> **Bu dosya doğrudan çağrılmaz** ve **lazy okunur** — raporu yazmadan önce, **tur başına bir kez**. İki çağıranı vardır: `audit-docs` Adım 4 (turun paket raporu) ve `lib/audit-conform.md` Adım 6 (S2 kulvarı aynı iskeleti kullanır). Ayrı dosyadır çünkü iki ayrı çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). İskelet ve format kuralları **tek yerde** tanımlıdır — çağıran dosyalarda tekrar yazılmaz.
>
> **Keşif ajanı bu dosyayı okumaz** — rapor yazmak orkestratörün işidir (`audit-docs` Adım 3 → doktrin). Ajanın çıktısı kalemin konumu ve dayanağıdır, raporun kendisi değil.

Rapor iki iş yapar: doğru cevabı kanonun/template'in yazdığı kurallı kalemleri **bildirir** (onaya sunmaz — CLAUDE.md → Onay Ölçütü; kanon o ölçütü henüz taşımıyorsa `audit-docs` → Kulvarın tabanı) ve gerçekten belirsiz olanları **sorar**. Dört kulvarı vardır: `🔧 Uygulanacak` · `❓ Karar` · `📁 Tarihsel` (yalnız rapor) · `🔗 Kapsam Dışı Borç`.

## İskelet + örnek

```
📦 Denetim Turu: 3 doküman (filo: 3 ajan) — 5 uygulanacak · 2 soru · 1 tarihsel-rapor · 2 kapsam-dışı · excluded 12 · accepted 1
   D1  Proje dashboard'u    kırmızı çizgiyi aştı (~21.4k token)   _dev/DURUM.md
   D2  Ödeme modülü         konvansiyon eskimiş → migration       _dev/modules/M2-ODEME.md
   D3  Arşivlenmiş task     hiç denetlenmemiş (tarihsel)          _dev/tasks/archive/TASK-2.03.md

📄 D2 · Ödeme modülü   (_dev/modules/M2-ODEME.md — konvansiyon eskimiş → migration)
  🔧 Uygulanacak (bildirim — onay beklemiyorum)
     D2-1 · Ödeme özelliğinin "ne zaman bitmiş sayılır" ölçütleri açıklama metnine karışmış
        Sorun  : Dört ölçüt düz paragrafın içinde; sonraki oturum onları kriter olarak görmez.
        Yapılacak: Kendi başlığı altına, madde listesi olarak taşınacak — metin birebir korunur,
                   kopya bırakılmaz.
        Dayanak: Template — MODULE.md:15, feature bloğunun zorunlu alanı
     D2-2 · Doldurulmamış üç template yeri kalmış ("[Henüz yok]" ×2, tarih alanı → 2026-07-14)
        Dayanak: Template — production dokümanda template kalıntısı kalmaz   ← tek satırlık kalem
  ❓ Karar (sırayla açacağım)
     ?1 · Doküman ödeme sağlayıcısı olarak Iyzico diyor; kodda yalnız Stripe var.        nokta
          Dayanak: Gerçeklik — çapraz çelişki (M2-ODEME.md:9 ↔ src/payments/)
     ?2 · Dokümanda bir "Test Notları" bölümü var, template'te yok — sizin eklediğiniz
          bir bölüm mü, yoksa eski bir yapıdan mı kalmış?                             yapısal
          Dayanak: Proje-özgü — templates/MODULE.md'de karşılığı yok
  ⇒ D2 kapanınca touch.   (D1 bloğu aynı kalıpta — 2 kalem, yer için kısaltıldı;
    ⇒ "S1 kulvarı → touch yok")

📄 D3 · Arşivlenmiş task kaydı   (_dev/tasks/archive/TASK-2.03.md — hiç denetlenmemiş, tarihsel)
  🔧 Uygulanacak
     D3-1 · Başlığı eski biçimde; yeni biçime hizalanıyor, içerik değişmiyor.  tarihsel reformat
        Dayanak: Template — templates/TASK.md:1, başlık formatı (`# TASK-X.YY: …`)
  📁 Tarihsel (yalnız rapor): kayıttaki süre bilgisi commit geçmişiyle uyuşmuyor — arşiv
     kaydıdır, düzeltilmez; bilgi olarak bildiriyorum.
  ⇒ D3 kapanınca touch (tarihsel de S2'den geçer).

🔗 Kapsam Dışı Borç
   K1 · Doküman haritası olmayan bir dosyaya yönlendiriyor — dosya yeniden adlandırılmış.
        → link düzeltildi (INDEX.md:34 → docs/API-REFERANS.md), INDEX kendi commit'ini aldı
        Dayanak: Gerçeklik — eski yolda dosya yok, yeni yol diskte    (kap · tek hamle)
   K2 · Veritabanı: proje kimliği dokümanı SQLite diyor, kod ve karar kaydı PostgreSQL.
        Hangisi doğru? → soru (proje kimliği Korumalı Doküman'dır, kanıt kesin olsa da sorulur)
        Dayanak: Gerçeklik — OVERVIEW.md:18 ↔ docker-compose.yml:11 ↔ DECISIONS.md:22

▶ 5 kalem uygulanacak — istemediğin varsa numarayla söyle ("D2-1'i yapma" / sonradan "D2-1'i geri al");
  her doküman kendi commit'inde. Sonra ?1 → ?2'yi sırayla açacağım.
```

## Format kuralları

1. **Orantılılık.** Anatomi şablon değil, kalemin ağırlığına göre daralıp genişleyen bir çerçevedir — sorunu ve düzeltmesi tek cümlede anlaşılan kalem **tek satır** kalır, üç alanı zorlama. Zarf da orantılıdır: tek dokümanlı turda manifest düşer, `📄 <dokümanın işi> (<yol> — <gerekçe, kullanıcının diliyle>) — <kip>` başlığı yeter (kural 8), ID'ler `1, 2, …` olur — tek istisna `excluded N · accepted N` + varsa `üye değil N`: manifest düşse de tek satır olarak basılır (gerekçe: `audit-docs` Adım 1).
2. **Dayanak zorunlu ve kapalı kümedir:** `Template` (eşleşen template dosyası) · `KURAL` (dokümanın kendi `<!-- KURAL -->` yorumu ya da kaynağı olan CLAUDE.md disiplin bölümü — çapa: `CLAUDE.md:satır`; **bölünmüş projede doktrinin tam metni çocuktadır, çapa `_dev/claude/<AD>.md:satır` olur** — parent'taki özet çapa değildir) · `Gerçeklik` (kod / dosya sistemi / git / çekirdek doküman çapraz teyidi) · `Proje-özgü` (template'te karşılığı yok ya da template'ten bilinçli sapma öneriliyor). Her dayanak **çapasıyla** yazılır: `dosya:satır`, template bölüm adı, komut çıktısı veya commit hash'i. Çapa gösterilemiyorsa kalem bulgu değil **sorudur**. Dayanak satırı kullanıcının okuması için değil **izlenebilirlik** içindir (kural 3); kalemin kendisi çapasız da anlaşılmalı (kural 8).
3. **`Proje-özgü` dayanaklı kalem 🔧 kulvarına giremez** — tanımı gereği (kural 2) doğru cevabı ne template ne KURAL söylüyor; seçenekleriyle soruya iner. Onay Ölçütü'nün "kesim kurallı" koşulunun bu formattaki karşılığı budur: kullanıcı "sorulmadan uygulanan şey gerçekten kanondan mı geliyordu" sorusunu rapora bakarak cevaplar; formatın kendi kendini denetleyen kenarı budur ve sormayı bıraktığımız için **daha da kritiktir**. **`Gerçeklik` dayanağı ise tek başına kulvar belirlemez:** 🔧'e yalnız *ölçülebilir bir olguya* dayanan kap kalemi girer (eksik dosya, kırık bağ, ölçüm çıktısı); bir **iddianın** gerçekle çeliştiğini gösteren `Gerçeklik` kalemi içerik işlemidir → ❓. Örnek raporda ikisi de var: K1 (kırık link) 🔧, K2 (veritabanı çelişkisi) ❓.
4. **Tarihsel/sistem dokümanında rapor kulvarı (🔧/❓/📁) ayrımı içerik-koruyanlık eksenindedir** (biçim değişikliği o eksenin bir alt kümesidir, ölçütün kendisi değil) — 🔧 kulvarına yalnız **içerik-koruyan** kalemler girer: reformat/protokol-migration (`tarihsel reformat` etiketiyle) ve dondurulmamış dokümanın içerik-koruyan bölmesi (`tarihsel bölme` etiketiyle, kesimi kurallıysa — kesim ölçüsü boyut, sınır kayıt sınırı: `lib/audit-kurallar.md` → Tarihsel/sistem dokümanları → Hiç dondurulmayan). İçerik hatası, eksik bölüm, bayat bilgi **yalnız-rapordur** → `📁 Tarihsel` slotu. **`exclude` önerisi hiçbir hâlde 🔧'e girmez** — o bir susturma kararıdır, kap işlemi değil. **Boyut kaleminden hiçbir sınıfta doğmaz** — çıkış her sınıfta `accept-size`'dır (`lib/audit-mekanik.md` → Boyut kırmızı-çizgisi); ❓ olarak yalnız kullanıcının dokümanı denetim dışına alma kararı gündeme geldiğinde doğar. **Dondurulmamışta hiç doğmaz:** bölme uygulanmadıysa doğru kayıt `exclude` değil `accept-size`'dır — yaşayan doküman uygunluk denetiminden düşmemelidir.
5. **Kalem birimi konum değil nedendir** — aynı kökten doğan üç dokunuş tek kalemin alt maddeleridir; seçici geri alma onları bölmemeli.
6. **❓ kalemler raporda yalnız başlıktır** (+ `nokta` / `yapısal` ağırlık işareti). Gövdeleri **sırayla** açılır: bağlam → seçenekler+tradeoff → "önerim X, çünkü Y" → karar bekle (desen ve dil: `step-by-step` → Pratik dili kullan). Böylece sorulacakların listesi bir arada, soruların kendisi sırayla olur. **Orkestratörlü koşumda da (`run-phase` bir denetim turunu yetkilendirdiyse) bu sıra korunur:** paket başlık listesiyle döner, `❓` gövdeleri relay üzerinden sırayla açılır — turun "tek pakette döndür" kuralı başlıkları kapsar, gövdeleri değil. Kullanıcı bir kalemi "bilinçli böyle" diye kapatırsa cevabı **kalıcılaştır** — hedefe tek satırlık `<!-- KURAL: … (bilinçli) -->` yorumu; yoksa cold-start audit aynı soruyu sonraki turda yeniden sorar. **Boyut kaleminde iki kayıt vardır, ikisi de yazılır** (kanon: CLAUDE.md → Onay Ölçütü → Kaydın evi): *kap kararı* — bölme ertelendi/reddedildi — KURAL yorumuna, *boyut kabulü* — kalan doluluk kabul edildi — `accept-size`'a. İkincisi hash'e bağlıdır ve bilerek öyledir; doküman kırmızı çizginin altındaysa script onu zaten reddeder ve tek kayıt KURAL yorumu kalır.
7. **ID'ler efemerdir** — rapor-yereldir, tur kapanınca ölür, diske yazılmaz (BULGULAR'ın `B-NNN` numaralarıyla karıştırılmaz).
8. **Kalem kullanıcının diliyle yazılır** (kanon: CLAUDE.md → Kullanıcının diliyle konuş). Kullanıcı dokümanları okumaz: `Sorun`/`Yapılacak` satırları **pratikte neyin değiştiğini** söyler ("kod ve doküman farklı veritabanı söylüyor" — "M13 alanı template'e uymuyor" değil). Doküman adı, bölüm adı, alan adı ve satır numarası kalemin **`Dayanak` satırında** durur, sorunun gövdesinde değil. ❓ gövdeleri için bu zorunludur: kullanıcı ilgili dokümanı hiç açmadan karar verebilmeli.
9. **Kullanıcı bir kalemi istemiyorsa kayıt her hâlde düşer.** Sormayı bıraktığımız için "kullanıcı bunu bilerek istemiyor" bilgisinin **tek evi** bu kayıttır — düşmezse sıradaki tur aynı kalemi bir kez daha uygular. İki hâl vardır:
   - **Henüz uygulanmadıysa** (rapor okunurken ya da soru turunda "bunu yapma" dendi): uygulama yapılmaz, **kayıt yine yazılır**. Manifest sayısını da düzelt — rapor "uygulanacak" demişti.
   - **Uygulandıysa** ("geri al"): **önce değişikliği geri al, sonra kaydı yaz.** Sıra zorunludur: `accept-size` dokümanın **o anki** boyutuna bakar ve eşik altındaki dokümanı reddeder — bölme geri alınmadan çağrılırsa komut hata verir ve kayıt hiç düşmez.
   Kaydın evi **tek evdedir: CLAUDE.md → Onay Ölçütü → Kaydın evi.** Özeti: *kap kararı* (bölme ertelendi/reddedildi/geri alındı — parent `CLAUDE.md` bölmesi dahil, hepsi) → hedefe tek satırlık `<!-- KURAL: … (bilinçli) -->`; *boyut kabulü* (kalan doluluk) → `accept-size --reason "…"`, ve yalnız doküman kırmızı çizginin üstündeyse. Boyut kalemi ertelendiğinde **ikisi birden** yazılır. Birincisi hash'e bağlı değildir; `accept-size` doküman her değiştiğinde düşer, o yüzden **kabın kendisine dair bir kararı taşıyamaz** — kap kararının KURAL yorumunda durmasının nedeni budur (`lib/claude-md-bolme.md` → Hâl ayrımı). **Hedef Dokunulmaz Doküman ise** (`tasks/TASKS-README.md`) kayıt oraya yazılamaz — proje-özel ekleme yasaktır; karar `_dev/docs/DECISIONS.md`'ye tek satır olarak düşer. Bu kaydın okuyucusu dokümanın kendisi olamaz, o yüzden **kaydı yazarken dokümanın adını cümlenin içinde geç** (`tasks/TASKS-README.md`) — `audit-docs` Adım 3 onu o adla, tek grep'le arar; adsız yazılan kayıt hiç bulunmaz.

   **Uygulanmış bir kalem geri alınırken hamle üçtür:** geri al · kararı kaydet · **canvas'ı gerçekle uzlaştır**. Üçüncüsü atlanamaz: canvas'ın asıl kaynağı yerel `canvas.db`'dir ve commit'i revert etmek onu geri almaz — `reconcile` + `scan` çalıştır, doküman `touch` almışsa `invalidate --filter '<path>'` ile kuyruğa döndür.

## Akış

Rapor yazılır, soru varsa **sırayla** açılır (kural 6), sonra çağıranın uygulama adımına geçilir (`audit-docs` Adım 5). Soru yoksa rapordan sonra durmadan geç — kurallı kalem için "tamam" bekleme.
