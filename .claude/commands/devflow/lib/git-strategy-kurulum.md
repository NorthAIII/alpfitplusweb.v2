# Git Stratejisi — Kurma ve Değiştirme Tarifi

> **Bu bir engine dosyasıdır** (motor tarafı, projeye kopyalanmaz). `_dev/GIT-STRATEJI.md` kurulurken ya da değiştirilirken **lazy okunur**. Çağıran yerler: `kickoff-verify` Adım 2b (kurulum + eski-kurulum onarımı) · `quick` (kullanıcı istediğinde, her an) · `prd-review` 1b (versiyon sonu eşik değerlendirmesi).
>
> Tarif burada yaşar, projenin dokümanına kopyalanmaz: her oturum okunan bir dosyaya yalnızca **beyan** girer, onu üreten prosedür değil.

---

## 1. Probe (kullanıcıya sormadan, salt-okunur)

```bash
git remote -v
git branch -a
git branch --show-current
ls .github/workflows/ 2>/dev/null
```

Ek olarak bak: deploy/hosting konfigürasyonu (`Dockerfile`, `vercel.json`, `netlify.toml`, `fly.toml`, coolify/compose dosyaları, workflow içindeki deploy job'ı) · README ya da OVERVIEW'da canlı URL izi.

## 2. Teşhis

Probe çıktısından `_dev/GIT-STRATEJI.md`'yi **doldurulmuş hâlde öner**. Boş soru sorma — cevabı doldur, teyit ettir.

## 3. Derinleşme koşulu

Ayrı çalışma/yayın dalı, yayın anı, acil düzeltme rotası ve doğrulama kapısı **yalnız** şu ikisinden biri tespit edilirse tek tek konuşulur: {canlı kullanıcı var} veya {bir dalı izleyen otomatik deploy var}. Aksi halde tek cümlelik teyit yeter ("tek dal, yayın hattı yok — böyle kaydediyorum, itirazın var mı?"). **Tören üretme.**

## 4. Doğrulama kapısı: varsayma, sına

Doküman "yayın öncesi CI beklenir" diyecekse iki şey **o an** sınanır:

- **Erişim:** ilgili komut gerçekten çalışıyor mu (örn. `gh run list --limit 1`). Çalışmıyorsa kural "ajan bekleyemez — yayın öncesi kullanıcı doğrular" biçiminde yazılır.
- **Sinyalin varlığı:** kapının beklendiği dal, ilgili workflow'un tetikleyici dal listesinde (`on:` bloğu) gerçekten yer alıyor mu. Yer almıyorsa ya workflow kullanıcı onayıyla hizalanır ya da kapı "bu dalda CI koşmuyor" notuyla dürüstçe yazılır.

Sınanmamış kural sessizce uygulanamaz hâle gelir — en tehlikeli hâli budur, çünkü yazılı olduğu için uygulandığı sanılır.

## 5. Değiştirme (örn. tek dal → çalışma+yayın ayrımı)

Kurma ile **aynı akıştır**; üç ek adımı vardır:

**(a) İz taraması.** `_dev/**` içinde dal/merge/deploy/push geçen yerleri tara; strateji bu dokümanın dışına sızmışsa oraları tek-ev kuralına göre temizle (pointer bırak). Doküman taşınıyorsa ona işaret eden **yol ve bölüm atıfları** da bu taramanın kapsamındadır. Atlanırsa her strateji değişimi dokümanlar arası hizalama borcuna dönüşür — sahada ölçülmüş bedeli 10 doküman + 2 workflow'luk bir yeniden yazımdı.

> Atıf yazarken **bölüm numarası değil bölüm adı** kullan (`GIT-STRATEJI → Yayın`, `§3` değil). Numaralı atıf her yeniden yapılandırmada kırılır ve aynı süpürmeyi bir daha gerektirir; adlı atıf kırılmaz. DevFlow'un dokümanlar-arası atıf konvansiyonu budur.

**(b) Dış varsayımlar.** CI workflow'larının dal listesi · deploy platformunun izlediği dal · bağımlılık botunun hedef dalı. Dal ekseninin dışında: **PR'dan veri türeten kapılar** (base ref ya da değişen dosya kümesiyle çalışan coverage/lint/diff kapıları) — akıştan PR çıkarsa bu kapıların tabanı da yeniden kurulmalıdır. Dal modeli değişince bu varsayımların hepsi bozulur.

**(c) İlk yayın penceresi.** Yeni yayın dalı çalışma dalının ucundan doğar; ilk yayına dek iki dal eşittir, yani "yayın dalı doğrulanmış sürümdür" güvencesi o pencerede henüz yoktur. Kullanıcıya söylenir.

## 6. Otonomi

Dal oluşturma/değiştirme komutları **kullanıcı onayıyla** çalıştırılır — adım adım, çıktı görünür. Yayın dalına dokunan hiçbir iş otonom başlamaz; tetiği kullanıcı çeker.

## 7. Doküman yeni doğduysa: protokole bağla

Dosya bu oturumda **ilk kez** oluşturulduysa, kök `CLAUDE.md`'nin Oturum Başlangıç Protokolü listesinde `_dev/GIT-STRATEJI.md` maddesi var mı bak — yoksa ekle (kaynak: CLAUDE-MD template'indeki 5. madde) ve `_dev/INDEX.md`'nin "Temel Dokümanlar" listesini de hizala.

**Bu adım atlanamaz.** Protokole bağlanmayan doküman her oturum okunmaz; okunmayınca üç kapının hiçbiri (dal doğrulaması, yayın boşluğu ölçümü, quick tür seçimi) ateşlemez — ve kural yazılı olduğu için uygulandığı sanılır. Sahada ölçülmüş kırılma sınıfı tam budur: kuralın var olması yetmez, okunmasını garanti eden ikinci bir mekanizma gerekir.

`kickoff-verify` yolunda CLAUDE.md zaten template'ten üretilir ve madde hazır gelir — oradan gelindiğinde bu adım bir **teyittir**, tekrar yazma.

> Kurulu bir projede motor yeni güncellendiyse CLAUDE.md'de bu maddenin dışında başka template-delta'ları da olabilir (dal yankısı, push hedefi, paralel oturum maddeleri). Onların sahibi `audit-docs` conformance turudur — burada tek tek aktarma; audit önerisini oturum kapanışının «Sıradaki oturumdan önce» satırına `önerilir:` önekiyle yaz.
