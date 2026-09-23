# Ürün iddiası düzeltilirken bulgu yeniden ölçülür — ürünün kendi notu çapa değildir

**Ne zaman uygulanır:** Ziyaretçiye görünen bir olgu iddiasını ölçüme karşı doğrulayan ya da düzelten her iş. İki kol: (a) **ürün yeteneği** — `../Alpfit.v1`'e (salt okunur ürün kodu) karşı, B-029 sınıfı, `CAPABILITIES` kademeleri, TASK-2.12/2.14/2.15 gibi iddia taramaları, ileride M6 F6.4'ün sızıntı denetimi; (b) **yasal metin** — `src/content/legal.ts` ve form onayı, bu sitenin kendi koduna (`api/demo/route.ts`), depo sözleşmesine ve yayın env'ine karşı; B-024/B-060 sınıfı. Kural ikisinde de aynı, çünkü ikisi de "olmasi gerekeni" değil **olanı** anlatmak zorunda; yasal kolda bedeli daha ağır, çünkü orada cümle bir taahhüttür.

## Kural

**Yedi ayrı kural, yedisi de zorunlu:**

1. **Devralınan bulgu tablosu uygulanmadan önce yeniden ölçülür.** Ürün deposu bu sitenin fazlarından bağımsız ilerliyor; bir bulgu yazıldıktan sonra ürün o boşluğu kapatmış olabilir. Ölçüm ucuz, yanlış düzeltme pahalı — çünkü "düzeltme" bu projede *doğru bir cümleyi bozmak* anlamına gelebilir.
2. **Ürünün kendi erteleme notu (`v1.5` · `Yakında` · `ertelendi` · `W8`) tek başına kanıt değildir.** Not, kodu değişince güncellenmiyor. Karşılığı **çağrı grafiğiyle** doğrula: fonksiyonun üretim çağıranı var mı, çağıran bir HTTP ucuna bağlı mı, uç `server.ts`'te kayıtlı mı, paneli çağırıyor mu.

3. **Sitede bir SÜRÜM NUMARASI iddiası varsa çapası `../Alpfit.v1/_dev/PRD/VERSIONS.md`'dir** — kod yorumu değil. O dosya kendini *"Bu dosya source of truth"* ilan ediyor ve v1 / v1.5 / v2 kapsamlarını tablo hâlinde tutuyor. Kod yorumundaki *"v1.5 adayı"* bir **kapsam taahhüdü değildir**; bir kalemin ertelenmiş olması onu sıradaki sürümün kapsamına sokmaz.

4. **YERİNE yazdığın iddia da ölçülür — ve onu çivileyen kapı elle listeden değil gerçeğin kaynağından türetilir.** Bir karşılıksız cümleyi silmek işin yarısı; yerine gelen cümle de bir iddiadır ve aynı kapıdan geçmelidir. Elle yazılmış bir `toContain(...)` listesi burada **koruma değil kilittir**: yanlış cümleyi sabitler ve sonraki turlara "ölçülmüş" diye görünür.

5. **Yazdığın cümlenin KAPSAMI ölçtüğün alanı aşmamalı — ve kapsam ÖZNEDE saklıdır.** Aynı olgu iki cümleyle anlatılabilir ve biri doğru, öteki yanlış olur: *"tarayıcı bilgisini kaydetmiyoruz"* **bütün** yolları (platform logları, önündeki nginx, sağlayıcılar) kapsar, *"talebinizin kaydına yazılmaz"* yalnız ölçtüğün yolu. Ölçtüğün şey ikincisiyse birincisini yazma. Ölçüt mekanik: cümleyi yazdıktan sonra **öznesini sor** — "kim/ne?" sorusunun cevabı ölçümünün kapsamından geniş mi? Geniş olduğu her yerde ya kapsamı daralt ya o alanı da ölç. Aynı sınır olumsuz beyanlar için ekstra sıkıdır ("…yapmıyoruz", "…tutulmaz", "…gitmez"): olumsuz cümleyi doğrulamak için **her** yolu ölçmen gerekir, oysa olumlu cümle için bir yol yeter.

6. **İddianın KAYNAĞI da doğrulanır — devralınan bir ÖZET, devralınan bir iddia kadar risklidir.** Cümleyi kendi projenin bir gün önceki task'ından çıkan bir özete dayandırma; **ölçümün kendisine** dön. Özet tipik olarak yanlış değil **eksik** olur ve eksiklik ancak kaynakta görünür. Ayrıca aynı sağlayıcı için **iki ayrı ülke sorusu** vardır ve karıştırılırsa cümle yanlış olur: *nerede işliyor* (ölçülebilir: fonksiyon bölgesi, ağ kaydı, sağlayıcının kendi sözleşmesi) ile *şirket nerede* (yalnız "merkezli" demeye yeter). Bölge **ayarı** verinin evini söylemez.

7. **Yazdığın KAPI da ölçülür — ve onu ölçen kontrolün kendisi de.** Yeşil bir kapı, kapının koştuğunun kanıtı değildir: dayanağı **bozup kırmızıyı görmeden** hiçbir dal "çivilendi" sayılmaz. Üç mekanik körlük sahada ölçüldü ve üçü de yalnız negatif kontrolle göründü: (a) bir deseni **dosya genelinde** aramak **yorum satırlarını** da sayar — kapsamı sözdizimsel olarak daralt (etiketin/bloğun içine bak); (b) **iki jetonlu** desen, araya giren bir cast ya da destructure yüzünden kör kalır — deseni jetonların arasındaki **değişmez bağa** kur (`window.umami` değil `umami…​.track(`); (c) bir **önek/biçim süzgeci** aynı çağrının başka yazımını kaçırır — süzmek yerine **tam kümeyi** dondurulmuş bir listeyle karşılaştır (allowlist, denylist değil: denylist tanımı gereği fail-open'dır). Ayrıca **sondanın kendisi tek örnekli olmamalı** (tek örnek hangi sınıfı ölçtüğünü seçemez; kümenin tamamını koştur) ve **bir ayağın körlüğünü başka bir ayak örtebilir** — sondayı, öteki ayakları tetiklemeyecek biçimde kur. ⚠️ Son halka: **negatif kontrol düzeneğinin kendi pozitif çapası olmalı** — çıktı süzgeci bozulduğunda düzenek *hiçbir şey basmaz* ve bu "hata yok" diye okunur.

## Neden — ölçülmüş iki hâl (TASK-2.09, 2026-09-23)

**B-029'un 4. satırı bu iki kuralın ikisinden de düştü ve yanlıştı.**

- Bulgu `revokeGrant`'in çağıranına bakıp *"üretim çağıranı yok → yetki panelden geri alınamaz"* demişti. Doğru ama eksik: geri alma üretimde **`revokeTemplate`** üzerinden koşuyor — `accounts-update.ts:861` → `revokeTemplate` → `revokeGrant` → `permissionGrant.deleteMany`; uç `PATCH /accounts/:userId` (`server.ts:375`), paneli `web/src/lib/account-mutations.ts`. Araya ürünün TASK-54.11 REPLACE yolu girmişti.
- Ürünün **kendi notu da bayattı**: `permission-templates.ts:15-17` hâlâ *"revoke HTTP endpoint'i v1.5'e ertelendi … hesap silme / rol değişimi yolları da bundan **geçecek**"* diyor — gelecek kipiyle. `accounts-update.ts` bugün geçiyor.

Sonuç: plan o cümleyi "daraltmayı" öngörüyordu; ölçüm cümlenin **doğru** olduğunu gösterdi ve cümle yerinde bırakıldı. Ölçülmeseydi site *daha yanlış* hâle gelecekti.

**Aynı turda ikinci bir sayı da kaymıştı** (zararsız ama aynı sebep): `notification.service.ts`'in gönderim fonksiyonu sayısı bulguda 12, ölçümde **14** — ürün iki bildirim tipi eklemiş. Hüküm değişmedi (hiçbiri hâlâ üyelik bitişi değil), ama dokümana yazılan rakam ölçümden gelir, bulgudan değil.

## Neden — 3. kural (TASK-2.10, 2026-09-23)

Kurucu Programı kartı *"v1.5 yolda"* diyordu ve plan onu `PRODUCT_STATUS.nextVersion`'a bağlamayı devretmişti. Bağlamadan önce `VERSIONS.md` okundu:

- ürünün **v1.5** kapsamı = kampanya derinleşmesi · gelişmiş raporlama/Excel · bekleme listesi otomasyonu · churn paneli olgunlaşması → sitenin `yolda` kademesinin **yalnız ilk üçü**
- ürünün **v2** kapsamı = sitenin `sonra` kademesinin **beşi de, birebir** (kullanışlı çapa: o kademe için sürüm adı gerekirse "v2" doğrudur)
- `yolda`'ya sonradan taşınan **dört B-029 kalemi** haritanın **hiçbir satırında yok** — ikisinin kod yorumunda "v1.5 adayı" yazması yetmiyor

Yani kademe bir sürümün kapsamı değil; yedisine "v1.5" demek B-029'un kendi hatasını yeniden üretirdi. Kart başlığı sürüm numarası yerine `STAGE_LABEL`'a bağlandı ve `nextVersion` **hiç açılmadı** (karar: `docs/DECISIONS.md` 2026-09-23).

## Neden — 4. kural (TASK-2.13, 2026-09-23)

TASK-2.12, antrenör ürün görselinin `alt` metnindeki karşılıksız *"öğrenci tutma"* ifadesini doğru biçimde düşürdü — ama **yerine** *"aylık performans, **haftalık doluluk** ve **ciro kırılımı**"* yazdı ve son ikisini `tests/iddia-metinleri.test.ts`'te `toContain` ile **çiviledi**.

Bir tur sonra ölçüldü: o iki kart bu görüntüde **zaten yok.** Aynı üretim hattı onları **TASK-14.06'dan beri** düşürüyor (`DROP_NODES.antrenor`) ve gerekçesi ürünün kendi kodu — `trainer-performance.service.ts:7` *"FİNANSAL CİRO DEĞİL"*, `attendance-count.ts:11` doluluk % kapsam dışı. Yani düzeltme **bir karşılıksız iddiayı ikisiyle değiştirdi** ve üstüne bir kapı koyarak sabitledi; kapı yeşil olduğu için de "ölçülmüş" görünüyordu.

Kaçıran şey yöntemdi: yeni cümle **görüntüye karşı değil, beklentiye karşı** yazılmıştı. Çare kapının kaynağını değiştirmek oldu — kural artık *"alt metin, hattın o ekrandan **düşürdüğü** hiçbir kartı anamaz"* ve çapalar hattın kendi `DROP_NODES`/`SHELL_DROP_NODES` tablosundan okunuyor (`tests/iddia-metinleri.test.ts` → `research/lib/screen-cleanup-v2.mjs` import'u; `web` konteyneri deponun tamamını görür, araştırma konteyneri yalnız `research/`ü — bağ bu yüzden tek yönlü). Elle yazılan üç `toContain` bu kuralla değiştirildi; sonda, eski metni geri yazınca kırmızı verdiğini doğruladı.

## Neden — 5. kural (TASK-2.16, 2026-09-23)

Yasal metnin işlenen-veri anlatımı ölçülmüş gerçeğe hizalanırken **bu turda yazılan iki yeni beyan ilk hâlinde fazlasını söyledi** ve ikisi de ancak koda geri dönülünce yakalandı:

- *"Bu e-postaların kopyaları **ekip posta kutumuzda** ve e-postayı ileten sağlayıcıda kalır."* Ekip bildirimi için doğru, onay e-postası için **yanlış**: `toLeadEmail` yalnız ziyaretçiye gönderir, `reply_to` ekiptir — ekip kutusuna kopya düşmez. Cümle alıcı bazında ikiye ayrıldı.
- *"Tarayıcınızın kendini tanıttığı bilgiyi **kaydetmiyoruz**."* Ölçülen şey dardı: `ua` depo gövdesinin beyaz listesinde yok, iki e-posta metninde yok, tek kalıcılaşma yolu `LEAD_FILE_PATH` ve o yayında tanımsız. **Ölçülmeyen** şey genişti: platform/altyapı logları. Cümle *"talebinizin kaydına yazılmaz"* diye daraltıldı.

İkincisi özellikle öğreticidir çünkü **B-024'ün kendi itirazının sınıfıdır**: bulgu, sitenin *"bu ölçüm … IP adresinizi tutmaz"* cümlesini tam bu gerekçeyle çürütmüştü (ölçüm sisteminin önündeki nginx ham IP tutuyor). Aynı turda aynı hatayı yapmamak, ancak cümleyi yazdıktan sonra öznesini sormakla mümkün oldu.

**Yan kural — ölçülmemiş komşu cümleye dokunma, ama çelişki de üretme.** Aynı dosyada duran ve başka bir task'a ait iki cümle (`legal.ts` → Umami'nin IP'si · yalnız gezen ziyaretçi) bilinçle bırakıldı; yazılan yeni cümleler **talep yoluna** daraltıldığı için ikisiyle de kesişmedi. Kapsamı daraltmak yalnız doğruluk değil, **ayrıştırılabilirlik** de sağlıyor: 2.17 o cümleleri kendi ölçümüyle değiştirirken bu turun cümlelerine dokunmak zorunda kalmayacak.

## Neden — 6. kural (TASK-2.17, 2026-09-23)

Yasal metnin ölçüm cümlesi Umami'nin veritabanını anlatacaktı. Elde **aynı projenin bir gün önceki** ölçümünün özeti vardı (TASK-2.01): *"`session` yalnız türetilmiş ülke/bölge/şehir tutuyor."* Özet kullanılmadı, `information_schema` yeniden sorgulandı — ve özet **eksik** çıktı: IP sütunu gerçekten yok, ama `session` ayrıca `browser, os, device, screen, language` tutuyor. Yanlış değildi, **tam değildi**; olduğu gibi metne geçseydi B-024'ün kapattığı sınıfta yeni bir eksik beyan doğardı. Maliyet tek bir `SELECT`'ti.

**İkinci yarısı, aynı turun tedarikçi ülkeleri.** Dördü de kaynağından ölçüldü ve üç ayrı ölçüm türü gerekti: **canlı yanıt başlığı** (Vercel fonksiyonu `x-vercel-id` → `iad1`, üç koşumda da; repoda `vercel.json`/`preferredRegion` yokluğu ayrıca doğrulandı), **ağ kaydı** (RDAP → Hetzner / `CLOUD-NBG1` / DE), **sağlayıcının kendi sözleşmesi** (Resend DPA → ABD). Dördüncüsü (Google Workspace) yalnız MX'ten görüldüğü için metne sadece *"ABD merkezli"* girdi — veri bölgesi ölçülmediği için yazılmadı.

⚠️ **Bölge ayarı tuzağı sahada iki kez doğrulandı.** v1 bir kez *"Resend bölgesi İrlanda → veri AB'de"* diye yanlış sonuca varmıştı (`bunker-ortami.md`). Bu turda iki kalem **ayrı ayrı** ölçüldü: gönderim bölgesi gerçekten `eu-west-1` (İrlanda), ama sağlayıcının saklaması ABD. Metin ikisini ayrı cümlelerde yazar — birleştirmek yanlış olurdu, gönderim bölgesini hiç yazmamak ise v1'e göre gerileme.

## Neden — 7. kural (TASK-2.18, 2026-09-23)

Yasal beyanları çivileyen ilk kapı yazıldı (`tests/legal-consistency.test.ts`, 8 dal / 24 test). **On iki negatif kontrol koşuldu ve ikisi kapının kendi fail-open'ını buldu — ikisi de yazarken "doğru" görünüyordu:**

- **Dal 4** (site depodan okumuyor) depo çağrılarını `url.startsWith(STORE_URL)` ile süzüyordu. Uca **mutlak** URL'li bir okuma eklendiğinde kırmızı verdi; **göreli** URL'li aynı okuma (`fetch("/lead?limit=1")`) süzgecin dışına düştü ve kapı **yeşil** kaldı. Çare: süzmeyi bırakıp istek boyunca yapılan **tüm** `fetch` çağrılarının `(yöntem, URL)` kümesini dondurulmuş listeyle karşılaştırmak.
- **Dal 2**'nin yüzey ayağı (`/window\s*\.\s*umami/`) izleyiciyi doğrudan çağıran ikinci bir dosyayı arıyordu. Bir bileşen **TypeScript cast'iyle** çağırdığında (`(window as unknown as {…}).umami?.track(…)`) iki jeton ayrıştı ve desen kör kaldı — yani kişisel veri taşıyan doğrudan bir izleyici çağrısı kapıdan geçerdi. Çare: deseni jetonların arasındaki değişmez bağa kurmak (`/umami\s*\??\s*\.\s*track\s*\(/`), ki cast **ve** destructure biçimlerini birlikte yakalasın.

Üçüncü körlük ters yönde çıktı: **dal 1 yanlış kırmızı verdi.** `data-exclude-search="true"` dosya genelinde arandı ve 2 bulundu — biri gerçek öznitelik, biri dosyanın kendi JSDoc'undaki **yorum**. Bir yorum dayanak diye sayılacaktı. Çare kapsamı sözdizimsel daraltmak oldu (`<Script …/>` etiketinin içine bakmak), ki bu aynı zamanda özniteliğin **doğru** script'te durduğunu da ölçer.

Dördüncüsü sondanın kendisiydi: dal 3 tek bir yasaklı parçayla (`FORBIDDEN.parts[0]`) sondalanıyordu ve o değer **"Weekend"** çıktı — eski **marka** parçası, oysa dalın çivilediği cümle gerçek **kişi** verisi hakkında. Tek örnekli sonda hangi sınıfı ölçtüğünü seçemez; sonda 52 parçanın ve 13 avatar baş harfinin tamamına genişletildi. Sarmalayıcı bilerek küçük harfli seçildi ki denetimin "iki büyük harfli sözcük" kalıp ayağı devreye girip **tablo ayağının körlüğünü örtmesin**.

⚠️ **Beşincisi ve en sinsisi: sınama düzeneğinin kendisi fail-open koştu.** Negatif kontrolleri koşturan kabuk fonksiyonu vitest çıktısını ANSI kodları **temizlenmeden** grep'liyordu; hiçbir satır eşleşmedi ve ekrana **hiçbir şey** basılmadı. "Kırmızı satır yok" = "kontrol geçti" diye okunabilirdi. Düzeneğe pozitif çapa eklendi: vitest özet satırı her koşumda basılmalı, basılmıyorsa düzenek *arıza* verir. Kapıyı sınıyorsan, sınayanı da sına.

⚠️ **Altıncısı — kapının nesnesi DOKUNULMAZ bir komşu depodaysa, negatif kontrol KOPYA üzerinde koşar.** Kapı doğru kurulmuş sayılmak için dayanağın bozulduğunda kırmızı vermesi gerekir; ama `../Alpfitplus-website.v1`, `../Alpfit.v1` ve `../alpfit-plus-satis` salt okunurdur ve **kaynağı bozmak yasaktır**. Yol: klasörü scratchpad'e kopyala, kopyayı boz, testi kopyaya `:ro` bağlayarak koştur (`docker run` ile ayrı bir konteynerde — `compose exec` mount ekleyemez), sonra kaynağın md5'ini tur başıyla karşılaştır. Aynı turda **kapının kendisi de** komşu deponun salt okunur bağlandığını ölçmeli: `fs.accessSync(yol, W_OK)` `:ro` bağlamada `EROFS` verir ve **yazma denemeden** sorar — gerçek bir yazma denemesi başarılı olduğu anda zaten yasağı çiğnemiş olurdu. TASK-2.19'da on dört negatif kontrolün on dördü bu düzenekle kırmızı verdi; ikisi yalnız **metin tarafındaki** yarıyı bozarak alındı (yasal cümlenin sayısı) ve biri, üç paragraftan **yalnız birinin** güncellendiği hâli yakalayan bölüm-geneli kontrolün hakkını verdi — tek cümleye bakan kapı o hâlde yeşil kalıyordu.

## Pratik ölçüm deseni

```bash
# 1) Fonksiyonun GERCEK cagirani var mi (yorum ve test haric)
grep -rnE "fnAdi\s*\(" backend/src web/src | grep -v "\.test\."
# 2) Cagiran bir uca bagli mi, uc kayitli mi
grep -n "app\.\(get\|post\|patch\|put\|delete\)(" backend/src/routes/<dosya>.ts
grep -n "<rotaAdi>" backend/src/server.ts
# 3) Panel/mobil gercekten cagiriyor mu
grep -rn "<yol>" web/src/lib mobile/src/api
```

⚠️ **Yorum satırları `grep`'te çağrı gibi görünür** — 4. satırı yanlış yapan tuzağın ikinci yarısı buydu: `revokeGrant` geçen 20+ satırın hepsi yorum ya da testti, tek gerçek çağrı başka bir isimdeydi (`revokeTemplate`).

## Sınır

Bu kural "her şeyi baştan ölç" demek değil. Ölçülen, **düzeltilecek kalemin kendisidir**; bulgunun geri kalanı kapsamı genişletmez (kapsam genişletme yasağı task dokümanlarında ayrıca yazılı). Ölçüm çeliştiğinde bulgu atomunun ilgili satırı **düzeltilir** ve gerekçesi Çözüm Kaydı'na yazılır — bulgu yaşayan dokümandır.
