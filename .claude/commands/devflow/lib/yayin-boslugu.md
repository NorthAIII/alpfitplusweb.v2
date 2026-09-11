# DevFlow — Yayın Boşluğu Ölçümü (yayin-boslugu)

> **Bu dosya doğrudan çağrılmaz** ve **lazy okunur** — ölçüm anı geldiğinde, çağrı başına bir kez. Üç çağıranı vardır: `review-phase` Adım 9'un **senaryo-testi dalı** ve **"proje tamamlandı" dalı**, bir de `quick` Adım 1b'nin **tür belirlemesi**. Ayrı dosyadır çünkü üç çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). Ölçüm ve yorumu **tek yerde** tanımlıdır — çağıran dosyalarda tekrar yazılmaz.

**Ne zaman:** **yalnız `_dev/GIT-STRATEJI.md`'de bir yayın hattı beyanlıysa** (çalışma ve yayın dalı ayrıysa). Tek dallı projede ölçüm atlanır — ölçülecek boşluk yoktur.

---

## Ölçüm

Versiyon kapanıyor — bu, çalışma dalında birikenlerin yayına çıkma anıdır. Beyan edilen dal adlarıyla ölç:

```bash
YAYIN=<GIT-STRATEJI'deki yayın dalı>; CALISMA=<GIT-STRATEJI'deki çalışma dalı>
git fetch --quiet origin "$YAYIN" 2>/dev/null   # başarısızsa sessiz geçilir; aşağıdaki uyarı bunu karşılar
REF=""
git rev-parse --verify --quiet "refs/remotes/origin/$YAYIN" >/dev/null 2>&1 && REF="refs/remotes/origin/$YAYIN"
[ -z "$REF" ] && git rev-parse --verify --quiet "refs/heads/$YAYIN" >/dev/null 2>&1 && REF="refs/heads/$YAYIN"
if [ -z "$REF" ]; then
  echo "ÖLÇÜLEMEDİ: yayın dalı ('$YAYIN') ne uzakta ne yerelde bulunamadı"
elif ! git rev-parse --verify --quiet "refs/heads/$CALISMA" >/dev/null 2>&1; then
  echo "ÖLÇÜLEMEDİ: çalışma dalı ('$CALISMA') yerelde bulunamadı"
else
  echo "kaynak: $REF"
  git log --oneline "$REF..refs/heads/$CALISMA" | wc -l   # yayınlanmamış commit sayısı
fi
```

**Sıra bilinçlidir: önce `origin/`, sonra yerel.** Ölçülen şey "yayınlanmış mı"dır, ve bunun gerçekliği uzakta durur — yayın başka bir kopyadan yapıldıysa yerel yayın dalı bayattır ve **şişmiş bir sayı** üretir, üstelik bu sayı sağlıklı görünür (aşağıdaki iki hata ağı onu yakalamaz). Yerel dala ancak uzakta hiç yoksa düşülür. `git fetch` bu yüzden ölçümün parçasıdır; başarısız olursa (çevrimdışı, yetki) komut sessizce devam eder — bu yüzden **`kaynak:` satırı basılır**: `origin/` bir ref'e bakıp fetch'in başarısız olduğundan şüpheleniyorsan sayıyı ölçüm değil tahmin say ve "ölçemedim" de.

**Tam ref yolları (`refs/heads/…` · `refs/remotes/…`) bilinçlidir:** çıplak ad, yayın dalıyla aynı adı taşıyan bir **tag**'e çözülüp yanlış sayı üretir.

---

## Sonucun yorumu

- **Sonuç > 0** → yayın henüz yapılmamış. Kullanıcıya sayıyı söyle; sıradaki adım **yayındır**, prd-review ondan **sonra** gelir (kayıt ve komut biçimi aşağıda). Gerekçe: yayın kod donmasına aittir, PRD defterinin kapanmasına değil — ve teslim DevFlow-dışıysa prd-review zaten bilinçli ertelenebilir, o bekleme yayını da bekletmemeli.
- **Sonuç = 0** → yayın zaten yapılmış; doğrudan prd-review öner.
- **Çıktı `ÖLÇÜLEMEDİ:` ile başlıyorsa** bu **0 değildir** — dal adı yanlış ya da dal yok demektir; "ölçemedim" de, nedenini kullanıcıya bildir, sayı uydurma. Aynısı boş çıktı için de geçerlidir.
- **Çıktıda `fatal` görürsen basılan sayı bir ölçüm değildir.** `| wc -l` **her zaman** bir sayı basar — `git log` hata verdiğinde bile `0` yazar. Yani "sayı basmadı mı" diye bakmak yetmez; `fatal` satırı varsa sonucu at ve yukarıdaki gibi bildir. (İki `rev-parse --verify` kapısı bu hâli normalde önler; kontrol, kapıların kaçırdığı vakalar içindir.)

---

## Ölçümden sonra (yalnız `review-phase` çağrısında)

**Akışı kesme** — ölçüm bir kapı değil, hatırlatmadır: yayının kendisi GIT-STRATEJI'de yaşar ve tetiği kullanıcı çeker; komut zinciri yazma. Hatırlatma kapanış bloğunun **`📋` satırında** durur (Adım 9'un dalı yazar); **«Açık kalemler» satırına ayrıca yazma** — terfi eden iş iki satırda tekrarlanmaz (kanon: CLAUDE.md → Oturum Kapanışı → **Terfi kuralı**).

**Ölçüm > 0 ise QUICK kaydını burada aç** — kanonun **Ön-hazırlık** kuralı tam bu hâl içindir. `Durum: ⬜ Bekliyor`; "Ne Yapılacak" = **ölçülen sayı + iki dalın adı + yayınlanan versiyon**, artı **çağıran dala göre bir sıra hükmü**:

- **Senaryo-testi dalında** → *"prd-review bundan sonra gelir"*. Hüküm yazılmazsa sonraki oturum sırayı bilemez — kanonun Terfi kuralı onu oradan okur (CLAUDE.md → Oturum Kapanışı).
- **"Proje tamamlandı" dalında** → prd-review sırada **değildir**: o dalda Adım 6 Versiyon Sonu Durumu'nu ilerletmez ve Adım 9'un bloğu zaten *"yok — proje tamamlandı"* der. Oraya *"yayın son iştir; yayından sonra sırada bir DevFlow adımı yok"* yaz. Yanlış hüküm yazılırsa sonraki oturumun kapanış bloğu onu öncelik hükmü sanıp var olmayan bir adıma yönlendirir ve kayıt, kendisini üreten komutun kapanışıyla çelişir.

`**Tür:**` satırını **yazma** (türü işi başlatan oturum ölçer — `quick` Adım 1b). Kayıt iki iş görür: `📋` kimlik argümanı taşır (`/devflow:quick QUICK-NNN`) ve ölçüm yazıya geçer — yayın DURUM'da iz bırakmaz, sonraki oturum onu yalnız bu kayıttan görür.

**Kaydı commit'siz bırakma.** Bu ölçüm bilerek çağıranın commit adımından **sonra** yapılır: daha önce ölçülürse sayı o commit'i saymaz ve bir eksik çıkar. Dolayısıyla kayıt, kanonun ön-hazırlık kuralındaki istisnaya düşer (CLAUDE.md → Oturum Kapanışı → **Ön-hazırlık**): dosyayı yazdıktan sonra **yalnız onu** stage'le, tek ek commit at ve push'la — `docs: quick — yayın kaydı açıldı (QUICK-NNN)`. Ağaçta izlenmeyen bırakılırsa yayın borcunun tek kalıcı izi kaybolur; sonraki oturum onu Paralel Oturum Farkındalığı gereği "benim değil" sayar.

*(Bu ölçüm olmadığında görülen saha davranışı: versiyon kapanışları arka arkaya birikip yayın dalına hiç taşınmıyor ve bu ancak aylar sonra fark ediliyor.)*

> **Teslim DevFlow-dışıysa (go-live/mağaza onayı/müşteri kabulü beklemede):** prd-review'u teslim sonrasına bilinçli erteleme seçeneğini kullanıcıya hatırlat — teslim deneyimi (ilk kullanıcı tepkisi, mağaza reddi) değerlendirmeye girdi olur. State `prd_review_bekliyor`'da güvenle bekler (kapanış bloğu prd-review'u önerir, kimse çalıştırmaz); erteleme atlama değildir, zorunluluk kalkmaz.

> **`quick` Adım 1b çağrısında** bu bölüm işlemez: orada ölçüm yalnız tür sorusunu doldurmak içindir (kayıt zaten Adım 3'te doğar, `📋` satırını quick kendi Adım 6'sında yazar).
