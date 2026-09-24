# MEMORY — Proje Hafızası (Index)

> Bu dosya proje hafızasının **index'idir** — her oturum başında okunur. Birikmiş
> öğrenimler tek tek `_dev/memory/<slug>.md` dosyalarında tutulur; buradaki her
> satır o dosyalara bir **pointer**dır (başlık + tek satırlık kanca). Bir öğrenimin
> detayı gerekince o an `memory/<slug>.md` okunur (lazy-load).
>
> Bu yapı şişmeyi önler: index ince kalır (hep yüklü), detay yalnızca gerekince okunur.

**Son Güncelleme:** 2026-09-24 — TASK-3.06: tarayıcı-ölçümü atomu bir tuzak daha kazandı, **yeni dosya açılmadı, index'e satır eklenmedi** (kanca genişletildi). Tuzak ekran ölçen **her** kapıyı vurur ve sessizce *sahte yeşil* üretir: "bu eleman görünür mü" sorusu tek `getComputedStyle` çağrısıyla ölçülemez — `display:none` bir **atadaysa** elemanın kendi hesaplanmış `display` değeri yine kendi değerini döndürür (kalıtılmaz), `visibility` ise kalıtıldığı için doğrudan okunur. Doğru ölçüt üçlüdür: `aria-hidden` ataları + `getClientRects()` + `visibility`. Teyit ölçütü süzgeçli/süzgeçsiz karşı-ölçümdür (ölçüldü: 368/16 → 320/0).

<!-- KURAL: Bu satır her güncellemede ÜZERİNE YAZILIR. "Önceki:" prefix ile kümülatif yığma YASAK (CLAUDE.md → Doküman Disiplini). -->

---

## Teknik Tuzaklar & Workaround'lar

<!-- Proje genelinde geçerli beklenmedik davranışlar/bug'lar ve çözümleri (pasif gözlem: "şu böyle davranır, dikkat"). Tekrar eden, eyleme/kontrole bağlı bir "şu adımda şu kontrolü yap" kuralıysa → Süreç Disiplinleri. -->

- [Vercel `output: "standalone"` ile derleme kırar](memory/vercel-standalone-cikti-catismasi.md) — Docker imajı standalone ister, Vercel iz dosyası bekler; `next.config.ts`'te koşul `process.env.VERCEL ? undefined : "standalone"`, yerel gözlem bu tuzağı göstermez

## Kullanıcı Tercihleri

<!-- Kullanıcının proje genelinde geçerli tercihleri (test yaklaşımı, kod stili, iletişim vb.) -->

- [Tasarım refleksleri — AI klişesi reddi](memory/kivanc-tasarim-tercihleri.md) — parıltı rozet, jenerik ikon kartı, sahte sosyal kanıt yasak; gerçek fotoğraf ve düzen çeşitliliği istiyor (tam liste STYLE-GUIDE)

## Ortam & Araç Notları

<!-- Environment, tooling, CI/CD, kalıcı operasyonel veri (VPS IP, repo path, folder yapısı) -->

- [Vercel proje kimlikleri ve CLI erişimi](memory/vercel-proje-kimlikleri.md) — **her `vercel` çağrısına `XDG_DATA_HOME=/home/kivanc/snap/code/263/.local/share` ver**, yoksa komut cihaz-giriş akışında asılır; `vercel env pull` `--sensitive` anahtarları **maskeli** getirir (gerçek gönderim gereken ölçüm anahtarı Vercel'den çekemez); proje `alpfitplus-web-v2` / takım `north-ai` / plan `hobby`
- [Alternatif env ile üretim derlemesi ve `.env`'i kim okuyor](memory/alternatif-env-ile-uretim-derlemesi.md) — `.next` paylaşılan isimli hacim; üretim env'ini taklit eden derleme **ayrı** konteynerde (3200), sonra `docker compose restart web` (3001 kullanılmaz). **`docker compose exec … printenv` `.env`'den geleni GÖSTERMEZ** ama compose'un verdiğini gösterir — dev (3000) `.env`'i bind-mount'tan okur ve uç bağlıdır; **üretim provası (3100) TASK-2.02'den beri bilinçli HEDEFSİZ** (imajda `.env` yok, üç anahtar compose'da boş, uç `503 no-sink`). ⚠️ **`{}` POST'u hedefi ölçmez** — doğrulama kayıt yollarından önce koşar, her hâlde `422` döner; hedef yapılandırmadan öğrenilir, geçerli gövdeyle **değil** (o yazar). **Compose'da boş değer `.env`'i gölgeler** — Next yalnız hiç tanımlı olmayanı doldurur. **3100 bayat olabilir** — `perf.mjs`/`font-guard.mjs` oraya bakar, ölçmeden güvenme (yaşını ayırt edici bir alanla ölç, gerekirse HEAD'ten taze imaj derle)
- [Araştırma konteynerinde tarayıcı ölçümü](memory/arastirma-konteynerinde-tarayici-olcumu.md) — Playwright yalnız araştırma konteynerinde; betik scratchpad'e yazılıp `-v` ile mount edilir ve `--name` her koşumda farklı olur. ⚠️ **Bind mount hedefi, bind-mount edilmiş bir dizinin İÇİNE düşerse repoya root sahipli boş bir yer-tutucu bırakır** (ölçüldü — hem araştırmada `/work`, hem `web`'de `/app`; hedef `/opt/...` gibi dışarı yazılır, var olan bir dizinin üzerine bağlamak güvenlidir); **eksik bir bind KAYNAĞINI da compose sessizce root sahipli boş dizin olarak yaratır ve konteyner yine kalkar** — bağlamadan okuyan kapı bu yüzden fail-closed kurulur. Salt okunurluk `fs.accessSync(yol, W_OK)` ile ölçülür (`:ro` → `EROFS`), yazma DENENMEZ. ⚠️ **Bulamayan locator betiği yeşil bırakır** — üç ölçülmüş tuzak: aynı metin iki yerde · açık `role` niteliği rolü ezer · `next/image` `src`'i URL-kodlar (`img[src*="/product/"]` hiç eşleşmez); her koşumda "kaç eşleşme buldum" yazdır. ⚠️ **"Bu eleman görünür mü" tek `getComputedStyle` çağrısıyla ölçülmez** — `display` kalıtılmaz (atadaki `display:none` elemanın kendi değerini değiştirmez, render edilmişlik `getClientRects()` ile ölçülür), `visibility` kalıtılır; süzgeç yazan her dal süzgeçli/süzgeçsiz karşı-ölçüm koşturur (TASK-3.06). ⚠️ **Bir kapıyı sınamak için sahte hedef düzeneği de burada** — kaynağa değil girdiye dokunulur (TASK-3.03). ⚠️ **Ekran ekran gezen ölçümde DOM okuması ile kare AYNI ANI göstermeyebilir ve ikisi de sahte kırmızı üretir:** sitenin `scroll-behavior: smooth`'u hareket azaltmayla **kapanmaz** (kosma + her adımda oturmayı ölç), ve stil değişikliği bir sonraki **boyamaya** kadar kareye girmez — üstelik kısmen girer (iki `requestAnimationFrame` bekle). Teyit belirlenimliliktir: iki tur arasında oynayan rakam ölçümün oynadığını söyler (TASK-3.04)
- [Kendi sunucu: lead deposu, n8n, Bunker ve Umami](memory/kendi-sunucu-n8n-bunker-umami.md) — demo talebi v1'in PocketBase'ine yazılır, Bunker'a değil (soğuk e-posta tabloları); canlı kayıt teyidi panelle değil SSH + salt-okunur DB ile (kullanıcı panele bakamıyor). **Okuma modu yan dosyaya göre seçilir:** `-wal` yoksa `immutable=1`, varsa `mode=ro` — ters seçim ya sunucuya yazar ya son kaydı "yok" gösterir. **Umami'de "panelde görünüyor mu" sorusu da panelsiz ölçülür:** kurulumun kendi okuma API'si (login → Bearer) olay, yüzey ve ortam-etiketi kırılımını döndürür. **Ölçüm sunucusunun nginx'i ham IP tutuyor ve rotasyonsuz** (ölçüldü 2026-09-22) — `daemon.json`'da rotasyon görmek yetmez, Docker'ın log ayarı geriye dönük değildir; ölçüt konteynerin kendi `inspect` çıktısıdır
- [Anahtar kasası — `~/.config/alpfit/secrets.env`](memory/anahtar-kasasi-config-alpfit.md) — yönetim anahtarları repo dışında `600` bir dosyada (bugün `RESEND_ADMIN_KEY`); oturum panel adımını API ile yapar ve üretim için **dar yetkili** anahtarı kendisi üretir — değer hiçbir yere yazılmaz
- [Yerel lead deposu — Docker profili `lead`](memory/yerel-lead-deposu-docker-profili.md) — `docker compose --profile lead up -d lead-store`; indirme/silme servis+hacim adıyla (`down` YASAK); token değişimi `restart` değil `up -d` ile gelir; `.env`'deki `LEAD_TOKEN_*` tamamen yerel/rastgele

## Çapraz Öğrenimler

<!-- Faz arası taşınan, tek faza/dokümana ait olmayan dersler -->

- [Henüz yok]

## Süreç Disiplinleri

<!-- Retrospektiften çıkan, proje genelinde geçerli "şunu yaparken şu kontrolü her zaman yap" tipi iş-akışı kuralları. Uygulama anı: planlamada (task bölme) ve task icrası/closure'ında göz önünde tutulur — kanca'yı buna göre yaz ki ilgili anda hatırlansın.
     Sınır: tek seferlik task nüansı DEĞİL (o → faz retrosu); kalite ekseni DEĞİL (o → QUALITY); tekrar eden bir süreç kuralıdır. Teknik Tuzaktan farkı: tuzak pasif bir gözlemdir ("şu böyle davranır, dikkat"); disiplin aktif, adıma-bağlı bir kuraldır ("şu adımda şu kontrolü yap") — bir kayıt eylem/kontrol içeriyorsa disiplindir. Yalnızca BU projeye özgü olanlar buraya yazılır — DevFlow yönteminin geneline dair olanlar faz retrosuna "DevFlow'a Öneri" olarak yazılıp kullanıcıya bildirilir (review-phase triyajı). -->

- [Aşamaya bağlı davranışta "ara hâl" ayrıca sınanır](memory/asama-bagimli-davranis-ara-hal-sinamasi.md) — `deployStage`'e göre davranan her task `VERCEL_ENV=production` + `…vercel.app` hâlini de koşar (projenin F7.5'e kadarki gerçek hâli); iki uçlu test bu fail-open'ı göremez
- [Sayaçlı uca test bataryası — her senaryo kendi IP'sini VE kendi adresini taşır](memory/hiz-sinirli-uca-test-bataryasi.md) — `/api/demo`'da **iki** modül-kapsamlı sayaç var ve ikisi de süreç boyunca yaşar: IP başına 10 dk / 5 istek (doğrulamadan **önce** koşar) ve onay e-postasının **adres başına 24 saatte 3** tavanı; çok senaryolu batarya senaryo başına ayrı `X-Forwarded-For` **ve** ayrı e-posta adresi kullanmazsa ölçmek istediğiyle ilgisiz bir yerde sahte kırmızı okur (ikisi de ölçüldü); **arayüz ölçen tarayıcı turu ucu `page.route` ile taklit eder** — kota saymaz, canlı depoya test kaydı yazılmaz
- [Olgu iddiası düzeltilirken bulgu yeniden ölçülür](memory/urun-iddiasi-capa-dogrulamasi.md) — iki kolda da geçerli: **ürün yeteneği** (`../Alpfit.v1`) ve **yasal metin** (`legal.ts` + form onayı, kendi kodumuza/env'imize karşı). Devralınan tablo **uygulanmadan önce** yeniden ölçülür; ürünün kendi "v1.5 / Yakında / ertelendi" notu **tek başına kanıt değildir** (bayatlıyor), karşılık çağrı grafiğiyle doğrulanır — yorum ve test satırları grep'te çağrı gibi görünür. Ölçülmeden "düzeltmek" doğru bir cümleyi bozabilir: TASK-2.09'da tam bu oldu. ⚠️ **YERİNE yazdığın cümle de bir iddiadır ve ayrıca ölçülür** — elle yazılmış bir `toContain` listesiyle çivilemek koruma değil kilittir (TASK-2.12); kapı gerçeğin kaynağından türetilir. ⚠️ **Kapsam öznede saklıdır:** "kaydetmiyoruz" ölçmediğin yolları da kapsar, "talebinizin kaydına yazılmaz" kapsamaz — cümleyi yazdıktan sonra öznesini sor; olumsuz beyanda sınır daha sıkı (TASK-2.16'da iki yeni beyan ilk hâlinde fazlasını söyledi). ⚠️ **İddianın KAYNAĞI da doğrulanır:** devralınan bir **özet** devralınan bir iddia kadar riskli ve tipik olarak yanlış değil **eksik** olur (TASK-2.01'in "`session` yalnız ülke/bölge/şehir" özeti; tablo ayrıca `browser/os/device/screen/language` tutuyor) — ölçümün özetine değil ölçümün kendisine dön. Sağlayıcı için *nerede işliyor* ile *şirket nerede* ayrı sorulardır ve **bölge ayarı verinin evini söylemez**. ⚠️ **Task dokümanının kendi `dosya:satır` çapaları da kayar** — plan anında yazılır, aynı fazın sonraki task'ları dosyayı büyütür; kullanmadan önce `grep -n` ile yeniden konumla, task dokümanı ↔ DURUM Not bloğu çelişirse **taze olan kazanır**. ⚠️ **Yazdığın KAPI da ölçülür — ve onu ölçen kontrol de:** dayanağı bozup kırmızıyı görmeden hiçbir dal çivilenmiş sayılmaz; dosya genelinde aranan desen yorumları sayar, iki jetonlu desen cast'le kör kalır, önek süzgeci başka yazımı kaçırır, tek örnekli sonda sınıf seçemez, ve negatif kontrol düzeneğinin kendi pozitif çapası olmalı (TASK-2.18'de beşi de ölçüldü). ⚠️ **Kapının sonucu kadar KAPSAMI da eşiklenir ve YEŞİL ayağı da sınanır** — yoksa "hiçbir şey ölçmedim" ile "sorun bulmadım" aynı yeşili basar (TASK-3.03; iki sondanın kurulumu atomda)
- [Tek kaynağı atlayan çağrı siteleri kapanışta sayılır](memory/tek-kaynak-atlayan-cagri-sitesi-supurmesi.md) — tek kaynak tanıtan/değiştiren task, kapanışta kaynağı **atlayan** yazımları grep'ler; saf fonksiyon testi bu sınıfı göremez (TASK-1.20)

---

## Memory Sistemi — Nasıl Çalışır?

- **Index satırı:** `- [Başlık](memory/<slug>.md) — tek satırlık kanca`. Slug kebab-case ve açıklayıcı olsun (örn. `mawk-unicode-tuzagi`).
- **Kendi kendine yeten kanca.** Her zaman geçerli olması gereken kritik bilgide (örn. "paket yöneticisi pnpm, npm değil") kancayı **tam** yaz — böylece dosya açılmadan da bilgi her oturum görünür. Yalnızca duruma-özgü veya uzun detayda kanca "buraya bak" olur, gövde dosyada durur.
- **Memory dosyası** (`_dev/memory/<slug>.md`): düz markdown — `# Başlık` + gövde. Frontmatter yok. İlgili başka bir memory'ye `[Başlık](diğer-slug.md)` ile link verilebilir. Klasör ilk öğrenim yazıldığında oluşur.
- **Yeni öğrenim eklerken:**
  1. `_dev/memory/<slug>.md` oluştur — ya da aynı konu varsa **mevcudu güncelle** (dedup, yeni dosya açma).
  2. `_dev/MEMORY.md` index'inde ilgili kategori altına pointer satırını ekle/güncelle.
  3. Bayatlayan öğrenimi hem dosyadan hem index'ten **sil** (soft-delete yok — git history zaten tutar).
  4. Bir memory dosyası kendisi gerçekten büyürse CLAUDE.md → Boyut ve Bölünme'ye göre alt-dosyaya böl.

---

## Bu Sisteme Ne Yazılır, Ne Yazılmaz?

Memory sistemi (MEMORY.md index + `memory/` dosyaları) **kalıcı/operasyonel veri ve çapraz öğrenimler** içindir. Drift'in en büyük kaynağı yanlış-ev sorunudur: task icra detayları, oturum logları veya aktif durum bilgisi buraya yazılırsa sistem şişer ve gerçek değeri (proje genelinde geçerli bilgi) kaybolur.

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

### Çıkarma Disiplini

CLAUDE.md → Doküman Disiplini bölümü baskındır. Özet:
- Geçersizleşen bilgi tarihi yanında yazılı olsa bile **silinir** — tarih koruma gerekçesi değildir.
- "Önceki:" / "Eski:" prefix ile paragraf merdiveni YASAK; her güncelleme üzerine yazma yapar.
- HTML comment'e sarma (`<!-- removed -->`, `<!-- legacy-... -->`), üstü çizili etiket (`~~...~~`) gibi yumuşak silme yöntemleri YASAK; gerçek silme yapılır (git log zaten her şeyi tutar).
