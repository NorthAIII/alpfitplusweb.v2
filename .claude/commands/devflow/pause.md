# DevFlow — Oturumu Durdur (Pause)

Bu komut bir oturumu düzgünce durdurmak ve sonraki oturumda kaldığı yerden devam edebilmek için handoff bilgisi yazmak amacıyla kullanılır.

**Kullanım:** `/devflow:pause`

---

## Okunacak Dosyalar

pause oturum-sonu komutudur (double-check / prd-save ile aynı kategori): oturumda protokol zaten uygulanmıştır (ana komutun Adım 0'ı ya da komutsuz oturumun ilk proje sorusu — CLAUDE.md → Okuma onayı), çekirdek protokol dokümanları bağlamdadır — protokolü tekrar tetikleme; hiç uygulanmadıysa DURUM'u burada oku. Handoff, aktif durum (faz/adım/task) DURUM.md'nin bağlamdaki kopyasından okunarak canlı çalışma belleğinden yazılır. **Sabit ek dosya listesi yok.**

---

## Yapılacaklar

### 1. Aktif Çalışmayı Tespit Et

DURUM.md'den aktif durumu oku:
- Hangi faz aktif?
- Hangi adımdayız? (discuss, research, plan, verify-plan, task, verify, review)
- Aktif task var mı?
- Quick oturumu mu? (faz döngüsü dışı ad-hoc iş — bu oturumda quick akışı yürüyorsa DURUM'daki faz/task alanlarına **yazma**; onlar faz döngüsünün korunan pozisyonudur)
- Denetim oturumu mu? (audit-docs / audit-product — döngü dışı komutlar; bu oturumda denetim akışı yürüyorsa DURUM'daki faz/task alanlarına yine **yazma** — aynı korunan-pozisyon kuralı)
- Orkestratör oturumu mu? (`run-phase` — faz adımları **alt oturumlarda** koştu ve her biri kendi commit'ini aldı; bu oturumun devredecek yarım işi **yoktur**, çünkü işi o yapmadı. Bu dalı "iş üretmemiş oturum"dan ayıran şey budur: iş üretildi, ama sahibi bu oturum değil. DURUM'daki faz/task alanlarına **yazma** — onları alt oturumlar zaten yazdı ve doğru konumu taşıyorlar)
- İş üretmemiş oturum mu? (**ölçüt komutun varlığı değil işin varlığıdır**: faz/task/quick/denetim akışlarından hiçbiri yürümedi **ve devredilecek yarım iş yok** — komutsuz soru-cevap ya da yalnız rapor/tartışma komutu çalışmış oturum: `step-by-step`, `guide-me`, `progress`. Oturumda kod/doküman değiştiyse ya da yarım kalmış iş varsa bu dal değildir, üstteki dallardan birine düşer. DURUM'daki faz/task alanlarına yine **yazma** — aynı korunan-pozisyon kuralı; okumak yasak değildir, kapanış bloğunun `📋`'si oradan türer → Adım 2)

### 2. Handoff Bilgisi Yaz (+ DURUM yazımı)

**DURUM yazımları da bu adımda yapılır** — hangi dalda ne yazılacağı (ya da yazılmayacağı) aşağıdaki dalların her birinde tanımlıdır. Commit'ten (Adım 3) **önce** bitmiş olmalı; sonraya bırakılırsa duraklatma kaydı commit'in dışında kalır.

**Task oturumundaysa** → (i) Task dokümanının **Oturum Kayıtları** bölümüne `.claude/commands/devflow/templates/TASK.md` yapısına uygun, **Durum: ⏸️ Duraklatıldı** olan zengin bir kayıt yaz — yapı template'te tanımlıdır, burada tekrarlanmaz (tek-ev). Duraklatmada **"Son Yaklaşım"** ve **"Sonraki Adım Detayı"** alanları en kritik olanlardır, bunları dolu bırak. (ii) **DURUM'a Duraklatma Notu'nu da yaz** — kanonik formatta, `**Adım:** task çalıştırma` · `**Detay:** TASK-X.YY — [nerede kalındı]` · `**Handoff:** task dokümanında (Oturum Kayıtları)`. Bu satır atlanamaz: kanon sıradaki komutu duraklatılmış işte `Adım` alanından değil bu nottan türetir (CLAUDE.md → Oturum Kapanışı) ve **handoff'un adresini yalnız o taşır** (DURUM template → Duraklatma Notu, **Handoff** alanı bu dalı zaten öngörür). (iii) **DURUM'un Aktif Task → `Durum` alanını `⏸️ Duraklatıldı` yap.** Kanonun duraklatma kapısı **iki tetiklidir** — Duraklatma Notu **ya da** Aktif Task `⏸️` (`resume` Adım 4) — ve ikinci tetiğin yazıcısı burasıdır: notun tek yuvası bir quick pause'uyla ezilirse ya da devralan oturum notu *"Duraklatma yok"*a döndürürse faz task'ının duraklatması yalnız bu alanda ayakta kalır. ⚠️ **Bu dal faz/task alanlarına dokunan tek daldır** — aşağıdaki quick · denetim · orkestratör · iş-üretmemiş dallarının korunan-pozisyon yasağı buraya uygulanmaz; `run-task`'ın *"⏸️ yazma"* yasağı da uygulanmaz, o yasağın gerekçesi **plan revizyonunun pause OLMAMASIDIR** (run-task → Otonom Çalışma Kuralları).

**Quick oturumundaysa** → QUICK kaydını quick.md Adım 3'e göre oluştur/güncelle — **Durum: ⏸️ Duraklatıldı**, "Son Yaklaşım" ve "Sonraki Adım Detayı" dolu. Commit, bu dosyanın Adım 3'ündeki pause formatıyla atılır (quick.md Adım 5 formatı tamamlanan oturumlar içindir). Kapanış bloğu da quick'in değil bu dosyanın Adım 4'ünündür (quick.md Adım 6 → ⏸️ dalı bloğu bilerek yazmaz).

DURUM.md'de **iki yere** yazılır — faz/task alanlarına dokunmadan:
- **Son Güncelleme** satırına quick'i **numarasıyla ve durumuyla** not et (`QUICK-135 (login yönlendirme) ⏸️ duraklatıldı`). Bu satırın kuralı quick.md Adım 4'tedir; atlanırsa quick'in DURUM'daki tek izi kaybolur.
- **Duraklatma Notu**'na kanonik bloğu yaz. **Bu blok pause'a özgüdür** — quick.md Adım 4'e bakma: oradaki tek Duraklatma Notu cümlesi ("İstisna") **devralan ya da kapatan** oturumun notu *"Duraklatma yok"* haline döndürmesini anlatır, duraklatan oturumu bağlamaz. İkisini karıştırmak az önce yazdığın notu sıfırlar; not gidince `resume`'un kapısı ateşlenmez ve iş devralınamaz.
```
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** quick
> **Detay:** QUICK-NNN — [kısa açıklama]
> **Handoff:** QUICK dosyasında (Son Yaklaşım / Sonraki Adım Detayı)
```

**Denetim oturumundaysa** (audit-docs / audit-product) → DURUM'a **Duraklatma Notu YAZMA** — denetim kaldığı yerini kendi kanvasında tutar: audit-product'ta BULGULAR'ın **Yarım tur** satırını doldur (odak + nerede kalındı; o ana kadarki bulgular zaten kademeli yazılmıştır), audit-docs'ta ekstra kayıt gerekmez (`_dev/.audit/` cursor'ı kaldığı yeri bilir). Kullanıcıya bildir: devam için komutu yeniden çağırmak yeter.

**Orkestratör oturumundaysa** (`run-phase`) → DURUM'a **Duraklatma Notu YAZMA** (denetim dalıyla aynı gerekçe): koşumun kaldığı yeri DURUM'un kendi **Adım / Aktif Task** alanları zaten tutar ve onları alt oturumlar yazdı — buraya not düşmek sonraki oturumu olmayan bir yarım işe (`resume`'a) saptırır. Task/QUICK dokümanına da oturum kaydı yazma; yarım kalan bir alt oturum varsa kaydı **onun kendi** pause'u yazmıştır. ⚠️ **İstisna:** ağaçta bir alt oturumun bıraktığı kir varsa ve o oturumun kendi pause kaydı yoksa (ölen ajan — `run-phase` Adım 6) bu varsayım geçersizdir: kiri raporla ve kullanıcıya sor. Adım 4'te bu dalın **ilk satırı** `⏸️ Koşum durduruldu — adımları alt oturumlar yazdı, bu oturumun yazacağı handoff yok.` olur; `📋` satırının ölçütü "blok yazıldı mı"dır: koşum kendi kapanış bloğunu yazdıysa o satır **olduğu gibi yinelenir** — komut taşımayan `yok — <bekleme koşulu>` dalı dahil, üstüne yazma (aksi hâlde kullanıcı az önce durduğu duvara geri gönderilir; aynı gerekçe alttaki "iş üretmemiş oturum" dalında da yazılı). `/devflow:run-phase` yalnız koşum **hiç blok yazmadan** durdurulduysa yazılır (canlı müdahale, koşum ortasında pause).

**İş üretmemiş oturumdaysa** → hiçbir yere duraklatma kaydı yazılmaz: DURUM'a Duraklatma Notu YOK, task/QUICK dokümanına oturum kaydı YOK — duraklatılacak iş yoktur. Yalnız Adım 4'ün kapanış bloğu yazılır; bu dalda **ilk iki satırı** şöyle olur: `⏸️ Oturum kapatıldı — bu oturum iş üretmedi, yazılacak handoff yok.` / `📋 Sıradaki adım: /devflow:[faz döngüsünün DURUM'daki konumundan türeyen komut]` (döngü-dışı varsayılan, CLAUDE.md → Oturum Kapanışı; türetme komut vermiyorsa `yok — [bekleme koşulu]`). ⚠️ **Korunan-pozisyon kuralı buna engel değildir:** o kural DURUM'a *yazmayı* ve oradan handoff *üretmeyi* yasaklar — `📋` yalnız mevcut konumu okur, hiçbir şey değiştirmez. **Varsayılan ayrıca iki kez koşulludur.** (1) Oturumda duran komut **net bir sıradaki komut bildirdiyse** `📋` o komutu **yineler**; kendi türetmeni yazmak kullanıcıyı az önce durduğu duvara geri gönderir ve o komutun kararını ezer. (2) Böyle bir bildirim yoksa ve `_dev/tasks/quick/`'te devralınacak ⬜/🔄 bir kayıt varsa sıradaki adım odur (`/devflow:quick QUICK-NNN`). Son satır her dalda olduğu gibi yazılır.

**Faz döngüsünün planlama/review gibi bir adımındaysa** (yukarıdaki dalların hiçbirine düşmediyse) → DURUM.md'nin **Duraklatma Notu** bölümünü o slotun kanonik formatına göre doldur (bkz. DURUM template → Duraklatma Notu). ⚠️ **`verify` bu dalın dışındadır — not YAZMA:** UAT turunun handoff'u faz dokümanının UAT tablosudur (`verify-phase` Adım 3 dolu tabloyu devralır), ve `verify` ne bu notun sözlüğünde ne `resume`'un "Duruma Göre" listesinde tanımlıdır — yazılan not sahipsiz kalır. Nerede kalındığını kullanıcıya (orkestratörlü koşumda dönüş mesajına) ver; emir zaten böyle gelir → `run-phase` Adım 5.
```
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** [planlama / review / vb.]
> **Detay:** [Nerede kalındı, ne yapılacak]
> **Handoff:** burada (planlama/review oturumu — ayrı task dokümanı yok)
```

### 3. Varsa Commit & Push

**Bu oturumdan** kaydedilmemiş değişiklik varsa commit & push yap (paralel oturumların kirli dosyalarını dahil etme — dosya-bazlı stage; kural → CLAUDE.md → Paralel Oturum Farkındalığı). ⚠️ **Commit'ten hemen önce `git status -sb` koş** — kanonun commit-anı kapısının aleti odur ve dalı ile index'i birlikte gösterir; **kendiliğinden dışarıda kalan yalnız ağaçtaki kirdir**, ilk sütunu boşluk/`?` dışında bir **yabancı** satır varsa stage'ini düşür, çakışmalı yol varsa dur ve sor. ⚠️ **Bu oturumda arşive taşınmış bir dosya varsa** (bulgu atomu → `bulgular/archive/`, task dosyası → `tasks/archive/` — ölçüt taşımanın olması, dalın adı değil) **taşıma düz `mv`'dir ve commit'e ESKİ yolu da stage et**: silme index'e kendiliğinden yazılmaz, yalnız yeni yolu stage edersen HEAD'de iki kopya kalır ve silme kalıcı olarak stage'siz görünür. Bu adım o turların commit'ini devralır, şart burada da geçerlidir:
```
chore: WIP — pause at [kısa açıklama]
```

### 4. Kullanıcıya Bilgi Ver

```
⏸️ Oturum duraklatıldı. Handoff bilgisi yazıldı.
📋 Sıradaki adım: /devflow:resume
   → [nerede kalındı — tek satır]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

Son satırın amblemi (`engel:` → ⚠️ · yalnız `önerilir:` → 💡 · `yok` → ✅) ve yazım kuralı → CLAUDE.md → Oturum Kapanışı.

**Denetim oturumunda** `📋` satırı şöyledir (resume denetim akışını bilmez — devam yolu komutun kendisidir): duraklatılan komutu **tek başına** yaz — `📋 Sıradaki adım: /devflow:audit-docs` ya da `📋 Sıradaki adım: /devflow:audit-product`. İkisini "veya" ile birlikte yazma; hangisinin duraklatıldığını Adım 1'de zaten tespit ettin (kanon: satır tek komut taşır).

---

## Önemli Kurallar

- Handoff bilgisi detaylı olmalı — sonraki oturum bu bilgiyle başlayacak
- "Son Yaklaşım" ve "Sonraki Adım Detayı" en kritik alanlar
- Varsa ara commit at — yarım değişiklik bırakma (kapsam: yalnız bu oturumun dosyaları)
