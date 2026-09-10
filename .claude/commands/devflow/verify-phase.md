# DevFlow — Kullanıcı Kabul Testi (Verify Phase / UAT)

Bu komut fazdaki tüm task'lar tamamlandıktan sonra, otomatik doğrulama sonuçlarını (CI, otomatik araçlar) inceler ve UAT senaryolarıyla çıktıları kullanıcıyla birlikte test eder.

**Kullanım:** `/devflow:verify-phase [N]` — N = faz numarası (belirtilmezse DURUM.md'den aktif fazı al)

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/MODULE-MAP.md` — feature-faz matrisi, versiyon bilgisi
2. Aktif faz dokümanı (`_dev/phases/PHASE-N.md`) — milestone, kapsam tartışması, feature listesi
3. `_dev/QUALITY.md` — değerlendirme eksenleri (UAT senaryolarının kapsamını belirler)

**Göreve Göre (Adım 1 kayıt süpürmesi ve test senaryoları için oku)**
- Bu fazın task dokümanları → faz dokümanındaki task listesinden task numaralarını al, `_dev/tasks/` ve `_dev/tasks/archive/` klasörlerinde `TASK-N.*` dosyalarını oku
- `_dev/BULGULAR.md` → Adım 1 süpürmesi ve Adım 6 çözüm teyidi için oku (varsa; yoksa atla): bu fazın kapsamına dokunan Gelen Kutusu notları + işaretsiz açık bulgular + bu fazla ilişkili işaretli bulgular
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili `_dev/modules/MX-*.md` dosyalarını oku (kabul kriterleri ve edge case'ler için)

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Otomatik Kontroller

Otomatik doğrulama sonuçlarını incele. 1a/1b'nin kapsamı yalnız bu fazın değişiklikleri değil, **repo'nun güncel açık alert/failure durumudur — kaynağı hangi faz veya oturum olursa olsun**. Önceki oturumlarda kayda geçirilip çözülmemiş sorun/uyarıları da süpür — CI/tool olmasa da: `_dev/BULGULAR.md`'ye bak (kayıt kuralı → CLAUDE.md → Çalışma Prensipleri "Gördüğün sorunu düşürme"): **bu fazın kapsamına dokunan** Gelen Kutusu notları + Açık Bulgular'daki işaretsiz kayıtlar (`→ Faz N`/`→ TASK-X.YY` işaretliler zaten rotada — süpürme dışıdır, çözüm teyitleri Adım 6'da). **Faza dokunmayan kutu notlarına dokunma** — onların triyajı audit-product uzlaştırmasının işidir (dar-faz korunur). Süpürdüklerini 1d'deki bulgu notlarına dahil et. Kanvas mezuniyeti: Gelen Kutusu notu inceleme sonucu zaten çözülmüşse satırı **sil**; düzeltme task'ına dönüşünce (Adım 7) yine **sil** — bilgi artık task dokümanındadır. Süpürdüğün işaretsiz atomlu bulgu inceleme sonucu zaten çözülmüş çıkarsa aynı teyitle mezun et (Çözüm Kaydı + Durum `✅ Çözüldü` + arşiv + satır silme — BULGULAR kuralı). Task'a bağlanan atomlu bulgu silinmez: index satırına ve atomun Durum'una `→ TASK-X.YY` işlenir, çözüm teyidiyle arşivlenir. Yeniden çalıştırmada (Adım 10 kuralı) süpürdüğün kaydı faz task listesindeki mevcut düzeltme task'larıyla eşleştir — zaten task'a dönüşmüş kayıt için yeni task açma.

Bazı doğrulamalar zaten çalışmıştır (CI, bot'lar), güvenlik taramasını (1c) sen çalıştırırsın; 1c bu genişlemenin dışındadır — kendi tarifindeki faz-penceresiyle sınırlı kalır. Kontroller:

**a) CI/CD workflow sonuçları:**
CI/CD workflow'larının güncel durumunu kontrol et — yalnız bu fazın commit'leri değil: hâlâ açık/başarısız olan her workflow, hangi fazdan veya oturumdan kalmış olursa olsun. Projenin kullandığı git provider ve toolchain'e göre uygun aracı (CLI, API, web UI) belirleyip sonuçlara eriş. Başarısız olanların log'larını incele, kök nedeni anla.

**b) Otomatik analiz araçları:**
Projede çalışan otomatik araçların (bağımlılık tarayıcı, security scanner, code quality bot vb.) çıktılarını gözden geçir. Uyarı, öneri veya açılmış PR varsa not al. Projede hangi araç kullanılıyorsa onu tespit et ve sonuçlarına bak.

**c) Güvenlik taraması:**
Bu fazın değişikliklerini güvenlik merceğiyle kendin tara. Önce faz-penceresi diff'ini çıkar (N = bu komutun faz numarası — `[N]` parametresi, verilmediyse DURUM.md'deki aktif faz):

```bash
N=<faz no>; PREV=$((N-1))
ANCHOR=$(git log --format='%H %s' | grep -E -m1 "^[0-9a-f]+ docs\(phase-$PREV\): review" | cut -d' ' -f1)
FIRST=$(git log --reverse --format='%H %s' | grep -E -m1 "^[0-9a-f]+ [a-z]+\((phase-$N\):|TASK-$N\.)" | cut -d' ' -f1)
if   [ -n "$ANCHOR" ]; then RANGE="$ANCHOR..HEAD"   # birincil çapa: önceki fazın review'u → HEAD (aradaki quick commit'ler dahil)
elif [ -n "$FIRST"  ]; then RANGE="$FIRST^..HEAD"   # fallback: fazın ilk commit'inin parent'ı (Faz 1 / önceki faz review'suz)
else RANGE=""; echo "Hiç faz commit'i bulunamadı"   # dur: taramayı yapma, durumu kullanıcıya bildir
fi
[ -n "$RANGE" ] && git diff "$RANGE"
```

N'yi faz numarasıyla doldur, bloğun kalanını aynen çalıştır; tırnaklara ve kalıplara dokunma — çift tırnak `$N`/`$PREV` açılımı için gerekli, `\):` / `\.` guard'ları çift-haneli numaralarda (phase-1 ↔ phase-11, TASK-1. ↔ TASK-11.) yanlış eşleşmeyi önler. Çapa bilinçli olarak tam `phase-(N-1)` review'unu hedefler; "en son herhangi-faz review'u" gibi gevşek bir çapaya çevirme — düzeltme task'ları sonrası yeniden çalıştırmada pencereyi daraltır. Bu tarifte çapa sabit kalır, yeni fix commit'leri pencereye kendiliğinden girer. "Hiç faz commit'i bulunamadı" çıktısı görürsen dur ve durumu kullanıcıya bildir (muhtemel neden: yanlış faz numarası ya da konvansiyon-dışı commit geçmişi); yanıtına göre ilerle — faz numarası yanlışsa doğrusuyla yeniden dene, geçmiş konvansiyon-dışıysa kullanıcı onayıyla 1c'siz devam et.

Diff'i şu mercekle incele: injection (SQL / command / path traversal), auth/yetkilendirme atlaması, hardcoded secret, veri sızıntısı ve hassas veri loglama. Yalnız emin olduğun somut bulguları raporla — teorik/style bulgu yok. Sistem-seviyesi bak: tek başına güvenli görünen task değişiklikleri faz boyunca birikip etkileşime girince açık yaratabilir.

**d) Bulguları kaydet:**
Tespit ettiğin tüm bulguları (CI failure, bot önerisi, güvenlik taraması bulgusu) not al. Bu bulgular Adım 7'de (Düzeltme Task'ları) manuel test bulgularıyla birlikte değerlendirilecek. 1c'de bir baypas/açık yakaladıysan aynı sınıf-süpürme anlayışını diff üzerinde uygula — kardeş varyantları aynı taramada ara (anlayış → Adım 5a/5b'deki sınıf süpürmesi; UAT-tablosu mekaniği oraya aittir — 1c varyantları Adım 7'de task'ın Test Kriterleri'ne girer).

Süpürmenin ikinci tetiği bulgu değil **artefakt**: faz birden çok çağrı sitesince kullanılması beklenen yeni bir ortak kapı/yardımcı/invaryant tanıttıysa — **ya da mevcut bir ortak kapıyı/yardımcıyı/invaryantı yeni çağrı sitelerine yaymak fazın kendi işiyse** — onu **atlayan** çağrı sitesi kaldı mı diye bak. Arama yüzeyi diff hunk'ları değil **kaynaktır** — eski çağrılar diff'te görünmez: kapının doğduğu dosyayı bütün olarak oku, sonra korunan işlemin ham çağrılarını (eski fonksiyon/desen) ara. **En sık kaçan yer kapının kendi dosyasıdır**: kardeş modüller yeni yolu kullanır, oradaki eski çağrılar ham kalır. **Kapsanacak siteleri fazın listesi değil invaryantın kendisi belirler** — korunan işlemin çağrılarını say ve fazın dokunduklarıyla karşılaştır; fazın listesi zaten eksik olabilir, bu süpürmenin varlık nedeni odur. Sayım korunan işlemin çağrılarıyla sınırlıdır — süpürme o invaryantın sınıfını aşmaz, güvenlik evreninin tümüne açılmaz. Faz ne yeni bir artefakt üretti ne de mevcut birini yaymayı iş edindiyse bu soru düşer.

**Atlanan site için gösterilen istisnanın kendisi de okunur — tercih mi, iddia mı** (research-phase Adım 2 ayrımı; Adım 2c ile aynı ölçü): "bu siteyi bilerek dışarıda bıraktık / sonraki faza kaldı" bir **tercihtir**, süzer. "Orası zaten başka bir kapıyla korunuyor / o yol bu invaryanta tabi değil" bir **iddiadır** — süzen şey istisnanın söylenmiş olması değil iddianın **doğru olması**dır; sayım siteyi zaten önüne koymuştur, geriye o sitenin gerçekten korunup korunmadığını okumak kalır. Çürürse ya da ölçüm kurulamıyorsa süzmez, site Adım 7 triyajına gider. Aynı sınıf 1c'den de geldiyse tek bulguda birleştir.

**Önemli:** Projede CI/automated tool yoksa kullanıcıya kısaca bildir ve ilgili adımı (1a/1b) atla — 1c yalnız git gerektirir, her zaman çalıştırılır. Ama araştırma yapmadan "tool yok" diye geçme — projede gerçekten yoksa atla, varsa kontrol et. Read-only kontroller için kullanıcıya tek tek onay sorma, doğrudan çalıştır.

CI ciddi düzeyde başarısız olsa bile UAT'ye devam edilir; CI fix'i Adım 7'deki düzeltme task'ı setine dahil edilir.

### 2. Test Senaryolarını Çıkar

Şu kaynaklardan test senaryoları oluştur:

**a) Milestone kriterlerinden:**
Milestone'daki her kriter = en az bir test senaryosu. Cümlenin **altındaki not satırları kriterin parçasıdır**: `mekanizma: X → Y (araştırma kararı)` varsa senaryo Y'yi sınar, X'i değil (kaynak: `research-phase` Adım 4) — 2c'deki bayat-kriter ölçüsünün milestone tarafındaki karşılığı.

**b) Kapsam tartışmasındaki kararlardan:**
Kullanıcının aldığı her karar doğrulanabilir bir senaryoya dönüşür — ama **önce kararın türüne bak**: işi bu turun dışına çıkaran bir **tercih** senaryo doğurmaz, bir **iddia** ise senaryo iddiayı sınar; ayrımın ölçüsü ve kriterle kesiştiği hâl 2c'dedir, burada tekrarlanmaz.

**c) Feature kabul kriterlerinden:**
MODULE-MAP veya modül dokümanlarındaki kabul kriterleri. Bu fazın **kayıtlı bir kararı** (kapsam tartışması kararı, onaylı düzeltme task'ı) bir kriteri geçersizleştirdiyse senaryo karara göre yazılır — modül gövdesi bu anda henüz bayattır, hizalaması review-phase Adım 6'nın işidir; bayat kriterden ❌ üretme. Kararın kaydı yoksa sapma bulgudur, Adım 7 triyajına gider (review Adım 6 ile aynı ölçü). **Kaydın kendisi de okunur — tercih mi, iddia mı** (research-phase Adım 2 ayrımı): tercihin **erteleme** hâli ("yapmıyoruz / sonraya bıraktık") bu turda senaryo doğurmaz ama kriter de düşmez — review Adım 6'da 🟡 kalır; **kalıcı daralma** hâli ("bundan böyle böyle çalışacak / bilerek basit tutuyoruz") ertelenmiş değil **yürürlükte** bir davranıştır — yukarıdaki genel kural işler, senaryo karara göre yazılır ve gövdeyi review Adım 6 hizalar (aynı iki kol orada da ayrı ayrı yazılı: "Erteleme hizalama değildir"). "O kriter zaten başka yerde karşılanıyor" ise bir **iddiadır**: kriteri geçersizleştiren şey kaydın varlığı değil iddianın **doğru olması**dır — senaryo iddiayı sınar, kriteri sessizce düşürmez. Kayıt research'ten **sonra** doğduysa (onaylı düzeltme task'ı) hiç ölçülmemiştir; ürün zaten elinin altında olduğu için ölçümün en ucuz olduğu yer burasıdır

**d) Edge case'lerden:**
Task dokümanlarında belirtilen edge case'ler

**e) Adversarial senaryolardan:**
Bu fazda yaptıklarımızı kırmaya çalışan senaryolar. Faz bazlı bakış: "Bu fazda yaptıklarımızı kırmaya çalışsam ne olur?" Beklenmeyen girdiler, yetki dışı erişim denemeleri, hata durumları ve kurtarma, sınır değerleri. Checklist değil — fazın doğasına göre hangi adversarial senaryolar öne çıkıyorsa onları düşün.

**f) QUALITY.md eksenlerinden:**
QUALITY.md'deki değerlendirme eksenlerini sistematik gözden geçir; fazın doğasına göre hangileri bu faza dokunuyorsa kapsayan senaryolar üret — özellikle güvenlik dışı eksenler (performans, test kapsamı, bakım/sürdürülebilirlik, erişilebilirlik vb.). Bu (e)'deki adversarial bakışı ve Adım 1c'deki güvenlik taramasını **tekrarlamaz, tamamlar**: onların kapsamadığı kalite eksenlerinin UAT'de sistematik karşılığını verir.

**Ölçüm nesnesi üründür.** Yukarıdaki kaynaklar ürünün davranışını sınayan senaryolar üretir; fazın **kendi kayıt katmanı** (task/faz dokümanları, DURUM, BULGULAR ve önceki koşumların çıktıları) senaryo konusu değildir — ikiz sınırın öbür yarısı audit-docs'ta zaten yazılı ("kod kalitesi ve ürün davranışı audit-docs'un kapsamı dışı; faz penceresinde onlar için verify-phase"). Bu, kod-satırı-sıfır bir düzeltmeyi körleştirmez: kriter ürünün **davranışına** bakıyorsa senaryo olur, düzeltmenin kendi **kaydına** bakıyorsa olmaz. Kayıtta gördüğün kusuru da düşürme — evi Adım 7 triyajıdır (kapsam-dışı → BULGULAR Gelen Kutusu); Adım 1 süpürmesi ve Adım 6 çözüm teyidi bu cümleden etkilenmez, onlar kanvas rotasının kendisidir.

**Milestone'u cümle cümle tara** — senaryo doğurmayan bir kriteri "test edilecek bir şey gibi durmuyor" diye sessizce atlama. Kriter fazın kendi kayıt katmanına bakıyorsa (pratik ayraç `_dev/`: oradaki doküman fazın kaydıdır, ürün ağacındaki doküman üründür — örn. bulgu fazında "faza alınan bulguların hepsi kapandı", "PHASE-N eşiğin altına iner") ondan senaryo doğmaması eksiklik değildir. Ama **kriter düşmez, evi değişir**: kapanışta ölçülür — review-phase Adım 2'nin milestone kontrolü, kuralın review tarafındaki evi. Fazın bulgu kayıtları ayrıca Adım 1 + Adım 6 rotasında yürür; boyut tipi bir kriterin **ölçüm anı** ise review-phase Adım 5b'dir, Adım 2 değil (faz dokümanı son hâlini Adım 5'te alır).

### 3. Senaryoları Faz Dokümanına Yaz

Test senaryolarını hemen faz dokümanına (`_dev/phases/PHASE-N.md`) yaz — sonuçlar henüz boş (⬜), metadata (Geçen/Kalan) Adım 6'da dolar. PHASE template'inin **kanonik `## UAT Sonuçları` başlığını** kullan (ayrı bir "UAT Senaryoları" ara başlığı yaratma — oturum Adım 3-6 arası kesilse bile doküman template'e uygun kalır):

```markdown
## UAT Sonuçları

**Tarih:** [test sırasında]
**Toplam Senaryo:** X | **Geçen:** — | **Kalan:** —

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ⬜ | — |
| 2 | [Senaryo 2] | ⬜ | — |
| ... | ... | ... | ... |
```

> Not sütunundaki `→ TASK-X.YY` işaretini bu adımda **sen yazmazsın** — task numarası Adım 7'de doğar ve oraya geri işlenir.

Bu erken yazım, context dolması gibi olağan dışı durumlarda senaryoların kaybolmasını önler.

### 4. Test Modunu Sor

Senaryoları kullanıcıya göster ve test modunu sor:

```
📋 Bu faz için X test senaryosu hazırladım ve faz dokümanına yazdım.

Nasıl ilerleyelim?
  a) Manuel test — ben tek tek yönlendiririm, sen test edersin
  b) Otonom test — ben yapabildiğim testleri otonom çalıştırırım (kod, Playwright, API vb.),
     yapamadıklarım için sana sorarım
```

Kullanıcının tercihine göre Adım 5a veya 5b ile devam et.

### 5a. Manuel Test

Her senaryo için:

1. Kullanıcıya ne test edeceğini açıkla:
   ```
   🧪 Test 1/X: [Senaryo adı]
   Şunu dene: [Kullanıcının yapması gereken somut adımlar]
   Beklenen sonuç: [Ne olması gerekiyor]
   ```

2. Kullanıcıdan sonuç bekle:
   - **Geçti** → bir sonraki senaryoya geç
   - **Kaldı** → sorunu detaylı sor, analiz et
   - **Kısmen** → çalışan ve çalışmayan kısımları ayır ve tabloda **iki ayrı satıra** böl (çalışan ✅, çalışmayan ❌ + Adım 7 rotası). UAT tablosunda "Kısmen" diye bir sonuç yoktur — tek satırda bırakmak hem Geçen/Kalan sayımını bozar hem de sonraki okuyucuya senaryo karşılanmış gibi görünür

3. Başarısız senaryolar için:
   - Sorunu analiz et (kullanıcıdan detay al)
   - Kök nedeni tespit etmeye çalış
   - **Adversarial/güvenlik senaryosu kaldıysa sınıfı süpür:** bulgu tek varyant değil, bir sınıfın ilk örneğidir. Sınıfı türet ve varyasyon eksenlerini **aynı turda** test et — eksen örnekleri: encoding türevleri, HTTP-metot yüzeyi, üretim-vs-serve tarafı (örnektir, sınır değil; kapsam fazın penceresidir, güvenlik evreninin tümü değil). Süpürülebilen varyantı otonom koş (kod/araç), gerekeni kullanıcıya yönlendir; türetilen varyantları UAT tablosuna satır olarak ekle (Adım 3'ün erken yazımı tur ortasında da geçerli) — yeniden koşumda sınıfın regresyon ağı olurlar.
   - Başarısız senaryoyu ve analizi not al (düzeltme task'ı Adım 7'de oluşturulacak)

### 5b. Otonom Test

Her senaryoyu otonom olarak çalıştırmaya çalış:

**Yapılabilecek testler (doğrudan çalıştır):**
- Kod çalıştırma (unit test, integration test, script)
- Playwright / browser otomasyon testleri
- API çağrıları (curl, fetch)
- CLI komutları ve çıktı doğrulama
- Dosya/veritabanı durumu kontrolü

**Yapılamayan testler (kullanıcıya sor):**
- Görsel doğrulama gerektiren (UI'ın "doğru görünüyor mu?")
- Fiziksel cihaz gerektiren
- Üçüncü parti servis/hesap gerektiren (kullanıcı credential'ları)
- Subjektif değerlendirme gerektiren (UX, kullanılabilirlik)

**Akış:**
1. Her senaryoyu sırayla al
2. Otonom çalıştırılabiliyorsa çalıştır, sonucu kaydet. **Otonom kolda probe'u yazan da yargılayan da sensin** (5a'da hakem kullanıcıdır): bir şeyin *olmadığını/engellendiğini* iddia eden senaryo — kapı, yetki, "sızıntı yok", "erişilemiyor" — yalnız yeşil olduğu için kanıtlanmış sayılmaz. ✅ yazmadan önce yeşili sına:
   - **Kontrol koş.** Aynı yolla **başarması gereken** bir çağrı yap ve başardığını gör (denetimdeki "boş grep tek başına kanıt değildir" ilkesinin UAT karşılığı). Kontrolü UAT tablosunun `Not` sütununa yaz — `kontrol: <ne koşuldu> → <görülen sonuç>` (örn. `kontrol: geçerli token'la aynı uç → 200`); **kanıt notu olmayan yokluk-iddialı satır ✅ sayılmaz** — bu hüküm aşağıdaki dallar için de geçerlidir.
   - **Kontrol başarması gerekirken o da engelleniyor/boş dönüyorsa** probe sistemi hiç sürmüyordur: sonuç ✅ değil **❌ (doğrulanamadı: test sürmüyor)** — bulgu üründe değil testtedir, olağan Adım 7 rotasına girer.
   - **Kontrol kurulamıyorsa** bir üst basamak, korunan kararı **saf karar noktasında** geçici ters çevirip kırmızıyı görmektir — yalnız **geri alınabilir ve iz bırakmayan** yerde: kalıcı yan etkili hiçbir noktaya (append-only kayıt/tablo, dış servis çağrısı, migration), **ortam/serving katmanına** (geri alma git'le yapılamaz) ve **prod'a** dokunulmaz. Ters çevirme ile geri alma **aynı adımda kapanır**; 5b'den çıkmadan `git status` ile ağacın sınama öncesi hâline döndüğünü teyit et. İzi `Not` sütununa yaz (`ters-çevirme: <ne kapatıldı> → <görülen kırmızı> → geri alındı`). Bu geçici sınama düzeltme değil **kanıttır**, "bu oturumda kod düzeltme yapılmaz" kuralını delmez.
   - **İkisi de kurulamıyorsa** senaryo otonom kolda kapanmaz: ✅ yazma, 3. maddeye düşür (kullanıcıya manuel doğrulat). Kullanıcı da doğrulayamıyorsa sonuç **❌ (doğrulanamadı: kanıt kurulamadı)**
3. Otonom çalıştırılamıyorsa kullanıcıya sor: ne yapması gerektiğini açıkla, sonucu al. Sonuç kısmiyse (otonom koşum da dahil) 5a'daki kural aynen geçerlidir: tabloda **iki ayrı satır**, "Kısmen" diye bir sonuç yoktur
4. Başarısız senaryolar için kök neden analizi yap ve not al (düzeltme task'ı Adım 7'de oluşturulacak). **`doğrulanamadı` sonuçları bu maddeyi tetiklemez** — süpürülecek ürün sınıfı yoktur, önce kanıt/probe kurulur; sınıf sorusu onarım sonrası turda sorulur. **Adversarial/güvenlik senaryosu kaldıysa sınıfı süpür** — bulgu bir sınıfın ilk örneğidir: sınıfı türet, varyasyon eksenlerini (encoding türevleri, HTTP-metot yüzeyi, üretim-vs-serve tarafı — örnektir, sınır değil) aynı turda koş, türetilen varyantları UAT tablosuna satır olarak ekle (kapsam fazın penceresi; Adım 3'ün erken yazımı tur ortasında da geçerli)

Her test sonucunu kullanıcıya bildir:
```
🧪 Test 1/X: [Senaryo adı] — ✅ Geçti (otonom)
🧪 Test 2/X: [Senaryo adı] — ❌ Kaldı (otonom) — [kısa hata açıklaması]
🧪 Test 3/X: [Senaryo adı] — 🔍 Manuel gerekli: [kullanıcıya ne yapacağını söyle]
```

### 6. Sonuçları Faz Dokümanına Güncelle

Adım 3'te aynı `## UAT Sonuçları` başlığı altına yazılan tabloyu sonuçlar ve metadata (Toplam/Geçen/Kalan) ile doldur — başlık yeniden adlandırılmaz:

```markdown
## UAT Sonuçları

**Tarih:** [tarih]
**Toplam Senaryo:** X | **Geçen:** Y | **Kalan:** Z

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | [Senaryo 1] | ✅ Geçti | — |
| 2 | [Senaryo 2] | ❌ Kaldı | [Sorun açıklaması] |
| 3 | [Senaryo 3] | ✅ Geçti | — |
| ... | ... | ... | ... |
```

Ayrıca Adım 1'de bulunan otomatik kontrol bulgularını da kayda al (kısa özetle; hangi düzeltme task'ına gittiğine ya da kapsam-dışı olarak BULGULAR Gelen Kutusu'na düştüğüne işaret et — ev seçimi Adım 7 triyajında). **Not sütununu bu adımda boş bırakman normaldir:** task numarası henüz yoktur, işareti Adım 7 tablo satırına geri yazar (orada adıyla emredilmiştir) — sen yalnız satırı ❌ olarak ve sorun açıklamasıyla kur.

**Bulgu çözüm teyidi (BULGULAR varsa):** Bu fazla ilişkili işaretli bulguların (`→ Faz N` / `→ TASK-X.YY`) düzeltmesi bu fazda yapılmış ve ilgili senaryo/kontrol ✅ geçtiyse çözüm teyit edilmiştir — senaryo/kontrol doğmayan (kod-satırı-sıfır) düzeltmede teyit kanıtı task arşivi/commit'tir (BULGULAR kuralı: "Çözüm teyidi kanıt ister"). Teyitliyse: atomun Çözüm Kaydı'nı doldur, Durum'unu `✅ Çözüldü` yap, atomu `bulgular/archive/`e taşı, index satırını sil (BULGULAR kuralı). Teyit edilemeyen işaretli bulgu olduğu gibi bekler. Çözüm Kaydı **kapanış kapsamıyla** yazılır (BULGULAR kuralı): bulgunun sınıfından sayılmamış bir yüzey kaldıysa onu kayda yaz ve **Adım 7 triyajına taşı** — arşiv donuktur, orada bırakılan kalan iş kimseye görünmez.

### 6b. Faz Dokümanı Boyut Kontrolü (önleyici bölme)

UAT senaryoları + sonuçları eklendiği için faz dokümanı bu oturumda büyüdü. Faz **hâlâ aktifken** tek-okuma sınırını koru (detay: CLAUDE.md → Doküman Disiplini → Boyut ve Bölünme):

- `bash .claude/commands/devflow/scripts/doc-scan.sh _dev/phases/PHASE-N.md` çalıştır. Kırmızı çizgiye (~20k token) yaklaştıysa/aştıysa CLAUDE.md → Boyut ve Bölünme'ye göre teşhis + çöz: **gerçek büyüme** (UAT yığını / araştırma detayı) → `PHASE-N-<EK>.md`'ye böl; **şişme** (icra detayı veya çalışma notu Task Listesi'ne sızmışsa — doğru ev `tasks/TASK-N.md`) → temizle.
- Yapısal bölme/temizlik **kullanıcıya önerilir, onayla uygulanır** — mekanik auto-split değil. Faz tamamlanınca (review ✅) bu pencere kapanır; eşik aşımı varsa şimdi çöz. Bu bir doküman-hijyen adımıdır — kaynak kodu/test davranışını değiştirmez, "bu oturumda kod düzeltme yapılmaz" kuralıyla çelişmez.

### 7. Düzeltme Task'ları (Varsa)

Şu kaynaklardan gelen bulgular değerlendirilir:
- **Adım 1**'de tespit edilen otomatik kontrol bulguları (CI failure'ları, bot önerileri, güvenlik taraması bulguları vb.)
- **Adım 6**'daki başarısız UAT senaryoları
- **Adım 1 ve 6**'daki bulgu çözüm teyidinde görülen **kapsanmayan yüzeyler** — kapanan bulgunun sınıfından sayılmamış kalan (BULGULAR kuralı: "Kapanış kapsamıyla yazılır"); fazın az önce kapattığı sınıfın devamı oldukları için tipik ev düzeltme task'ıdır, ölçüt yine aşağıdaki triyaj
- Fazın **kayıt katmanında** görülen kusurlar (Adım 2 glossu) — senaryo doğurmazlar; ürün davranışına dokunmadıkları için tipik ev Gelen Kutusu'dur

**Önce kapsam triyajı — her bulgu için evini seç.** Ölçüt kapsamdır, çaba değil: "küçük/kolay" bir kapsam-içi bulgu ertelenemez, "büyük/zor" bir kapsam-dışı bulgu task'laştırılmaz.
- **Kapsam-içi** → düzeltme task'ı (aşağıda). Başarısız UAT senaryoları ve 1c faz-penceresi bulguları tanım gereği kapsam-içidir; **CI failure da her zaman kapsam-içidir** — kırmızı CI repo sağlığıdır, kaynağı hangi faz olursa olsun ertelenmez.
- **Kapsam-dışı** (fazın milestone kriterlerine, UAT senaryolarına veya faz-penceresi diff'ine dokunmuyor — örn. başka fazdan kalma bot önerisi/uyarısı) → task AÇMA, fazı bekletme: `_dev/BULGULAR.md` Gelen Kutusu'na kaynak işaretli tek satır düş (`- [PHASE-N] ...`; kural → CLAUDE.md "Gördüğün sorunu düşürme") ve Adım 10 raporunda belirt. Düşürmeden önce kanvasa bak: aynı bulgu zaten kayıtlıysa (önceki koşumun kutu satırı ya da mevcut bulgu atomu) yeni satır düşme — yeniden-koşumlar çift kayıt üretmesin, mevcut kaydı raporda an. Bulgu kaybolmaz — kutu notunu audit-product uzlaştırması triyaj eder (atomlaşırsa bulgu fazına girebilir), kapsamına dokunan sonraki fazın verify süpürmesi devralır; faz temiz kapanır.

**Task oluştururken — önce oku:** `.claude/commands/devflow/templates/TASK.md`

- **Evini geriye işle (Adım 6'nın açık bıraktığı halka):** task numarası burada doğduğu için Adım 6 onu yazamamıştı. Task'ı oluşturur oluşturmaz (a) UAT Sonuçları tablosunda ilgili ❌ satırının **Not sütununa** `→ TASK-X.YY` yaz; (b) **Adım 1 ya da 6'nın** bulgu çözüm teyidinde **kapsanmayan yüzey** olarak kayda geçip arşive taşınan bir kalem bu task'a bağlandıysa, **task'ın kendi Test Kriterleri'ne** işle ve kaynak bulguyu orada **numarasıyla** an (`B-0NN`) — arşiv donuktur, **index satırı ise mezuniyeti yapan adımda silinmiştir** (BULGULAR kuralı: arşiv index'te ASLA listelenmez), yani geriye yazılacak tek ev task'ın kendisidir. Bu iki işaret yazılmadan Adım 8'e geçme — aksi halde faz ❌ satırı evsiz kapanır.
- Task dokümanını template'e uygun yaz
- Sorunun detaylı açıklamasını ekle (otomatik bulgu mu, UAT failure mı belirt)
- Beklenen davranışı yaz
- Sınıf süpürmesinden gelen bulguda task tek varyantı değil **sınıfı** kapatır — süpürülen varyantlar task'ın Test Kriterleri'ne girer
- Faz dokümanındaki task listesine ekle
- Bulgu Adım 1 süpürmesinden geldiyse BULGULAR'ı güncelle (Adım 1 kuralı): Gelen Kutusu notuysa satırı sil (evi artık bu task), atomlu açık bulguysa index satırına ve atomun Durum'una `→ TASK-X.YY` işle

### 8. DURUM.md Güncelle

- UAT ve otomatik kontrol sonuçlarını kısa özetle
- Düzeltme task'ları varsa: **Task Durumu (Aktif Faz)** tablosuna ⬜ olarak ekle, ilkini **Aktif Task** yap, **Adım** alanını `task` olarak güncelle (next/run-task'ın "hepsi ✅" savunma kontrolü düzeltme task'ını görebilsin diye tabloya ekleme şart)
- Tüm kontroller geçtiyse **Adım** alanını `review` olarak güncelle (kapsam-dışı DEFER kayıtları BULGULAR'da bekler — faz kapanışını etkilemez)

### 9. Git Commit & Push

Tüm doküman değişikliklerini commit & push yap:
```
docs(phase-N): UAT — user acceptance testing completed
```

### 10. Sıradaki Adımı Öner

**Tüm kontroller geçtiyse:**
```
✅ Verify-phase tamamlandı. Otomatik kontroller ve UAT'den geçildi.
(varsa) 📥 X kapsam-dışı bulgu BULGULAR Gelen Kutusu'na düşüldü — faz kapanışını etkilemez.
📋 Sıradaki adım: /devflow:review-phase
   → Faz review ve retrospektif için yeni bir oturum başlat.
```

**Düzeltme task'ları varsa:**
```
⚠️ Verify-phase tamamlandı. Otomatik kontroller ve UAT'den X bulgu — Y düzeltme task'ı oluşturuldu.
(varsa) 📥 Z kapsam-dışı bulgu BULGULAR Gelen Kutusu'na düşüldü — faz kapanışını etkilemez.
📋 Sıradaki adım: /devflow:run-task
   → Düzeltme task'larını çalıştırmak için yeni bir oturum başlat.
   → Düzeltmeler tamamlandıktan sonra **/devflow:verify-phase yeniden çalıştırılır** — bütün kontroller (otomatik + UAT) baştan yapılır, sadece daha önce başarısız olanlar değil.
```

---

## Önemli Kurallar

- Bu oturumda kod düzeltme yapılmaz — sadece test ve düzeltme task'ı oluşturma
