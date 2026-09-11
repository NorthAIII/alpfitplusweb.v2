# DevFlow — Memory Sistemi (memory-sistemi)

> **Bu dosya doğrudan çağrılmaz** ve **lazy okunur.** Memory'ye yazan ya da onu denetleyen her adımın tek referansıdır: `run-task` Adım 6 · `review-phase` Adım 6 · `discuss-phase` (ortam topolojisi) · `audit-product` Adım 2 ve `verify-phase` Adım 4 (ortam/araç zemini) · `kickoff-verify` Adım 5 (native göç) · `lib/audit-conform.md` Adım 3e · `lib/audit-mekanik.md` (index↔atom, kanca kalemi) · `templates/MEMORY.md`'nin "yazmadan önce oku" pointer'ı (projeye kopyalanır — pratikte en sık ateşleyen giriş) · `templates/CLAUDE-MD.md` → Memory Migration (doktrin, ilk kurulum).
>
> **Projenin `_dev/MEMORY.md`'sine kopyalanmaz.** Gerekçe ölçülebilir: MEMORY index'i Oturum Başlangıç Protokolü'nün zorunlu dosyalarındandır ve **her oturum tam okunur** — içine konan her karakter proje ömrü boyunca her oturumda yeniden ödenir. Yöntem anlatımı oraya değil buraya aittir (kanon: CLAUDE.md → Bilginin Doğru Evi). Projede yalnız index'in kendisi + kategorilerin `<!-- KURAL -->` yorumları durur.

---

## Neden index + atom

Öğrenimler tek tek `_dev/memory/<slug>.md` dosyalarında yaşar; `_dev/MEMORY.md` bunların **index'idir**. Her satır bir **pointer**dır: başlık + dosya + (hak ettiyse) tek satırlık **kanca**. Detay gerekince o an atom okunur (lazy-load).

Bu ayrımın tek amacı **index'i ince tutmaktır**. Index her oturum yüklüdür, atomlar değil — yani maliyet index tarafındadır ve orada biriken her şey sabit gidere dönüşür.

**Keşif başlıktan ve slug'dan yürür.** Bir bilgi dizinini tarayan okuyucunun ilk gördüğü şey dosya adlarıdır; içerik ancak gerekince açılır. Buradaki index de öyle çalışır: `- [Deploy akışı](memory/deploy.md)` satırı, o dosyanın ne zaman açılacağını **kancasız da** söyler. Bu yüzden **varsayılan biçim kancasızdır**; kanca bir hak, otomatik bir alan değil.

---

## Kanca disiplini

**Kanca hakkı testi — tek soru:** *bu bilgi dosya açılmadan bilinmezse oturum yanlış bir hamle yapar mı?*

- **Evet → kancalı satır.** Kanca bilginin kendisini taşır.
- **Hayır, yalnız "bilsem iyi olur" → kancasız katalog satırı.** Başlık + slug zaten ne zaman açılacağını söyler.

Pointer satırı üç sınıftan biridir; sınıf, kancanın **neyi** taşıyacağını (ya da hiç olmayacağını) belirler:

| Sınıf | Ne taşır | Rehber uzunluk |
|---|---|---|
| **A · Sabit** — her oturum geçerli kritik değer (paket yöneticisi, çalışma dizini, VPS IP, yasaklı komut) | değerin kendisi, tam | doğal olarak kısa; ~100 karakter |
| **B · Süreç disiplini** — "şu adımda şu kontrolü yap" | yalnız **tetik + eylem**; gerekçe, örnek ve istisna atomda kalır | ~150 karakter |
| **C · Katalog** — duruma özgü tuzak/öğrenim | kanca yok; gerekiyorsa 3-5 kelimelik "ne zaman lazım" işareti | — |

**Rehber eşikler (mahkûmiyet değil, işaret fişeği):** kanca ~200 karakteri aşmamalı; kancalı satırlar index'te **azınlıkta** kalmalı; toplam pointer ~40'ı aşarsa bu bir kümeleme çağrısıdır (aşağıdaki supaplar). Kardeş kanvasın normu daha da sıkıdır (`templates/BULGULAR.md` → "Kanca ~100 karakteri aşmaz") — MEMORY'de sınıf A'ya tanınan pay, kancanın orada dosya yerine geçmesindendir.

**Eşik göz kararıyla değil ölçülerek yakalanır.** Uzayan kancaların adayı tek komutla çıkar — `doc-scan.sh`'in uzun-satır işaret fişeğini kanca eşiğine indir:
```bash
LONGLINE=200 bash .claude/commands/devflow/scripts/doc-scan.sh _dev/MEMORY.md
```
Çıktının `>200` sütunu kaç satırın eşiği aştığını, `EN_UZUN` sütunu en uzununun satır numarasını (`@LNN`) verir. **Aday listesidir, hüküm değil:** ölçü satırın tamamını sayar (başlık + yol + kanca ≈ 40-50 karakter fazladan), ve üstteki açıklama bloğu ile kategori `<!-- KURAL -->` yorumları da pointer olmadıkları hâlde bayrağa girer. İşaretlenen satırları aç, gerçekten kanca olanları ayır. Ölçüm bu kalemin **tetiğidir** (kanon: CLAUDE.md → Onay Ölçütü → tetik gösterilebilir).

**Kısaltmadan önce atomun o bilgiyi gerçekten taşıdığını doğrula** — taşımıyorsa önce gövdeyi atoma taşı. Doğrulamadan kısaltmak, kanca tek kayıtsa mezuniyet değil **kayıptır**.

**Kanca gövdeye dönüştüyse bu bir disiplin ihlali değil, bir teşhistir:** ya bilgi sınıf C'ydi ve kanca hak etmiyordu, ya da atom yazılmamış ve kanca onun yerine geçiyor. İkisinde de çözüm aynı: gövdeyi atoma taşı, index'te tetik kalsın.

---

## Yeni öğrenim eklerken

1. **Önce mevcut atomlara bak — gerekmedikçe yeni dosya açma.** Konusu var olan bir atomun kapsamına giriyorsa oraya yaz; index'e yeni satır eklenmez. Index'in maliyeti satır sayısıdır, atomun boyutu değil.
2. Gerçekten yeni bir konuysa `_dev/memory/<slug>.md` oluştur — düz markdown (`# Başlık` + gövde), frontmatter yok. Slug kebab-case ve açıklayıcı olsun (`mawk-unicode-tuzagi`): slug **keşif kapısıdır**, kancanın yerini o tutar. Klasör ilk öğrenim yazıldığında oluşur.
3. `_dev/MEMORY.md` index'inde ilgili kategori altına pointer satırını ekle/güncelle — **kanca hakkı testinden geçtiyse** kancasıyla, geçmediyse kancasız.
4. İlgili başka bir memory'ye `[Başlık](diğer-slug.md)` ile link verilebilir.
5. **Kategori altındaki `- [Henüz yok]` satırını ilk pointer'la birlikte sil** (kategori tekrar boşalırsa geri konur) ve `_dev/MEMORY.md`'nin **Son Güncelleme** satırını üzerine yaz (tarih + eklenen/değişen öğrenimin tek cümlesi, ~250 karakter; "Önceki:" ile yığma yasak — template KURAL'ı).
6. Bir memory dosyası **kendisi** gerçekten büyürse CLAUDE.md → Boyut ve Bölünme'ye göre alt-dosyaya böl — ama bunun index'i **büyüttüğünü** bil (çocuk da kaydedilir). Bölmek index şişmesinin çaresi değildir; çaresi aşağıdaki supaplardır.

---

## Supaplar — index nasıl incelir

Birikimli her dokümanın bir supabı vardır (VERSIONS→`versions/`, NOTES→prd-review, BULGULAR→triyaj). MEMORY'nin supapları şunlardır — üçü de **silmeye** dayanır, arşive değil: index'ten düşen bir öğrenimin tarihi git history'dedir, ayrı bir arşiv evi açmak soft-delete yasağıyla çelişir.

1. **Kümeleme.** Aynı konunun etrafındaki öğrenimleri tek atomda topla, index'te tek satıra indir. En güçlü kaldıraç budur: index maliyeti pointer **sayısıyla** doğrusaldır, atom boyutuyla değil.
2. **Kodlanmış öğrenim mezun edilir.** Bir tuzak artık bir **test, lint kuralı, CI kapısı, validator ya da guard** tarafından yakalanıyorsa hatırlanmasına gerek yoktur — kapının kendisi o hafızadır. Pointer'ı **ve** atomu sil; mezuniyeti tetikleyen kapıyı **çapasıyla** an — kaydın evi çağırana göre değişir ve **üçü de vardır:** task icrasında task dokümanının oturum kaydı · faz kapanışında `phases/PHASE-N.md` → Retrospektif → Sonraki Faz İçin Öneriler · **`audit-docs` turunda `_dev/docs/DECISIONS.md`'ye tek satır** (o oturumda ne aktif bir task ne bir faz kapanışı vardır; aynı emsal: hedefi kaydı taşıyamayan kalemin kaydı da oraya düşer — `audit-docs` Adım 3). Metin her üçünde aynı: *"<öğrenim> artık <test/lint/CI kapısı> tarafından yakalanıyor — memory'den mezun edildi."* **Kaydın evi yoksa mezuniyet de yapılmaz** — kalem raporlanır ve faz kapanışına yönlendirilir; tur raporu kayıt değildir (kanon: CLAUDE.md → Onay Ölçütü → "Bildirim onayın yerine geçer, kaydın yerine geçmez"). (Ölçüt mekanik yakalamadır: bilgiyi başka bir dokümana taşımak mezuniyet değil ev değişikliğidir ve toplam yükü azaltmaz.)
3. **Bayat budama.** Geçersizleşen ya da sonradan yanlış çıkan öğrenim hem atomdan hem index'ten **gerçekten silinir** — soft-delete yok, tarih koruma gerekçesi değil (kanon: CLAUDE.md → Çıkarma Disiplini).

**Üç supap da silmeden önce gelen bağları kontrol eder** — tek komutla: `grep -rn '<slug>\.md' _dev/memory/ _dev/MEMORY.md`. İki link biçimi vardır ve grep ikisini de yakalar: index'te `(memory/<slug>.md)`, kardeş atomda `(<slug>.md)`. Silinen atoma işaret eden kardeşler aynı hamlede güncellenir — kümelemede yeni atoma yönlendirilir, mezuniyet/budamada satır kaldırılır. Aksi halde audit'in **Kırık dosya referansı** kalemi bir sonraki turda onu açar (`lib/audit-mekanik.md`; index↔atom kontrolü yalnız kırık *pointer* ve *yetim dosya* bakar, atom→atom bağına bakmaz).

**Ekleyen çıkarmaya da bakar.** Memory'ye **öğrenim** yazan her adım (`run-task` Adım 6 · `review-phase` Adım 6), satırını eklerken index'e bir kez göz atar: kancası gövdeye dönmüş, konusu bir başkasıyla birleşebilecek ya da artık bir kapıyla yakalanan bir kayıt varsa aynı oturumda kapatılır. Supabı ayrı bir tura bırakmak, index'i yalnız büyüyen bir doküman yapar.

**İstisna — zemin yazan adımlar** (ölçüt: adım **öğrenim** değil **ortam/araç zemini** yazıyorsa muaftır; bugün `audit-product` Adım 2 · `discuss-phase` Adım 0b'nin ortam topolojisi · `verify-phase` Adım 4'ün araç envanteri — sayıya değil ölçüte bak): onlar öğrenim değil **ortam/araç zemini** kaydeder ve tam supap turu onların işi değildir (evi yukarıdaki iki adım + `audit-docs`). Onları bağlayan yalnız **kanca hakkı testi ve sınıflardır** — kendi yazdıkları satır index'i şişirmesin diye; başkasının satırını denetlemek için tur açmazlar. Muafiyet dar ve bilinçlidir: o oturumlar sistemin bütününü değil tek bir kategoriyi görür.

**Index bölünmez** (kanon: CLAUDE.md → Boyut ve Bölünme → Bölünmeyen dokümanlar) — değeri tek ince yüzey olmasıdır. Eşiği zorluyorsa teşhis her zaman ya şişmedir ya meşru birikim: ikisinin de çaresi yukarıdaki supaplardır, bölme değil.

---

## Kategoriler

Index beş kategori taşır ve sınırları `_dev/MEMORY.md`'deki `<!-- KURAL -->` yorumlarında özetlidir. Ayrımı en çok karışan ikisi şudur:

- **Teknik Tuzaklar & Workaround'lar** — **pasif gözlem:** "şu böyle davranır, dikkat". Bir davranışı tarif eder, bir adım emretmez.
- **Süreç Disiplinleri** — **aktif, adıma-bağlı kural:** "şu adımda şu kontrolü yap". Uygulama anı planlamada (task bölme) ve task icrası/closure'ındadır; kanca sınıf B olduğu için o anı **tetikte** belli eder.

Ölçüt tek cümlelik: **bir kayıt eylem/kontrol içeriyorsa disiplindir**, yalnız bir gözlem taşıyorsa tuzaktır.

İkinci karışan çift **Teknik Tuzaklar ↔ Çapraz Öğrenimler**'dir; ikisi de "proje geneli" olduğu için ad ayırmaz. Ölçüt yine tek cümlelik: bir **davranış ya da bug** tarif ediyorsa (araç/framework böyle davranıyor) Teknik Tuzak; bir **yöntem ya da karar dersi** taşıyorsa (şu yaklaşım şu yüzden işe yaradı/yaramadı) Çapraz Öğrenim.

Süreç Disiplinleri'nin iki sınırı vardır: tek seferlik task nüansı **değildir** (o → faz retrosu), kalite ekseni **değildir** (o → `QUALITY.md`) — tekrar eden bir süreç kuralıdır. Ve yalnızca **bu projeye özgü** olanlar buraya yazılır: DevFlow yönteminin geneline dair olanlar faz retrospektifinin "DevFlow'a Öneri" bölümüne yazılıp kullanıcıya bildirilir (`review-phase` triyajı).

---

## Bu sisteme ne yazılır, ne yazılmaz?

Memory sistemi **kalıcı/operasyonel veri ve çapraz öğrenimler** içindir. Drift'in en büyük kaynağı yanlış-ev sorunudur: task icra detayları, oturum logları veya aktif durum bilgisi buraya yazılırsa sistem şişer ve gerçek değeri (proje genelinde geçerli bilgi) kaybolur.

### TUTULAN içerik

- Başka dokümana uymayan ama kaybedilmemesi gereken kalıcı bilgiler
- Geliştirme sırasında keşfedilen, **proje genelinde geçerli** tuzaklar ve workaround'lar
- Kullanıcının proje genelindeki **operasyonel/teknik** tercihleri (kod stili, iletişim, araç/test-aracı tercihleri vb.) — **yön/öncelik düzeyindeki ilkeler buraya değil → `ILKELER.md`** (kalıcılık önceliği, sır/konfig politikası, test felsefesi, proje ufku)
- Ortam ve araçlarla ilgili pratik notlar (CI özellikleri, deployment ortam notları) — **dal/merge/yayın kuralı buraya değil → `GIT-STRATEJI.md`**
- Fazlar arası geçerliliği olan çapraz öğrenimler
- Retrospektiften çıkan, **bu projeye özgü** süreç disiplinleri (tekrar eden iş-akışı kontrolleri; planlama/icra sırasında uygulanır) → "Süreç Disiplinleri" kategorisi
- Sabit konfigürasyon değerleri ve kalıcı operasyonel veri (VPS IP, hesap email, repo path, folder yapısı)
- Mimari karar **özetleri** — detay `docs/DECISIONS.md`'de
- Secret kategori isimleri (örn. "STRIPE_SECRET_KEY .env'de tutulur") — **değer ASLA yazılmaz**

### YASAK içerik (bunlar başka dokümanlara aittir — memory yanlış evdir)

- **Task icrası sırasında öğrenilen teknik nüanslar** (mawk vs gawk gibi araç davranışı, framework bug'ı, vb.) → `phases/PHASE-N.md` retrospektifinin "Task-Spesifik Teknik Öğrenimler" alt bölümü
- **Oturum logları, "şu oturumda şu yapıldı" tarzı kayıt** → git log + ilgili PHASE/TASK dokümanları
- **Aktif faz/task durumu, ilerleme, son task özetleri** → `DURUM.md` (DURUM'a "Son Tamamlanan Faz" gibi ek özet bölümü EKLENMEZ — detay: CLAUDE.md → Bilginin Doğru Evi)
- **Diğer bilgi sınıfları** (mimari karar detayı, proje yapısı/kimliği, yön-veren ilkeler, kalite kuralları, faz retrospektifi) → her birinin evi kanonik yönlendirmede: CLAUDE.md → Bilginin Doğru Evi

### Çıkarma disiplini

CLAUDE.md → Doküman Disiplini bölümü baskındır. Özet:

- Geçersizleşen bilgi tarihi yanında yazılı olsa bile **silinir** — tarih koruma gerekçesi değildir.
- "Önceki:" / "Eski:" prefix ile paragraf merdiveni YASAK; her güncelleme üzerine yazma yapar.
- HTML comment'e sarma (`<!-- removed -->`, `<!-- legacy-... -->`), üstü çizili etiket (`~~...~~`) gibi yumuşak silme yöntemleri YASAK; gerçek silme yapılır (git log zaten her şeyi tutar).
