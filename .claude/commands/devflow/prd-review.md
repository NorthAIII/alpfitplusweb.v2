# DevFlow — Versiyon Sonrası PRD Değerlendirmesi (PRD Review)

Bu komut bir versiyonu tamamladıktan (veya erken sonlandırdıktan) sonra, edinilen deneyimle PRD'yi yeniden değerlendirmek için kullanılır. Her versiyon geçişinde zorunlu olarak çalıştırılır. Tekrarlanabilirdir.

**Kullanım:** `/devflow:prd-review`

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/PRD/SESSION-NOTES.md` — PRD çalışma durumu notları
2. `_dev/PRD/NOTES.md` — Versiyon boyunca biriken notlar (varsa)
3. `_dev/PRD/VERSIONS.md` — Feature-versiyon haritası
4. `_dev/PHASES.md` — Tamamlanan fazlar
5. `_dev/ILKELER.md` — Proje ilkeleri (deneyimle yeniden değerlendirilir; güncellemeye açık)
6. `_dev/MODULE-MAP.md` — Adım 1 VERSIONS uzlaştırması için (versiyon içinde doğan feature tespiti; 2c'de Durum sütunu güncellemesi)

**Göreve Göre (değerlendirme sırasında oku)**
- Esnek içerik dosyaları → `_dev/PRD/` altındaki tüm `.md` dosyaları
- Feature dosyaları → `_dev/PRD/features/` altındaki dokümanlar
- Versiyon detay dosyaları → `_dev/PRD/versions/` (varsa)

---

## Ne Zaman Kullanılır

- Versiyon sonu sabit fazları (teknik borç + senaryo testi) tamamlandıktan sonra → **zorunlu**
- Erken versiyon sonlandırma durumunda → yarım kalan tasklar arşivlendikten sonra doğrudan çalıştırılır
- **Fiziksel teslim DevFlow-dışında ve beklemedeyse** (deploy/go-live, mağaza onayı, müşteri kabulü) → prd-review teslim sonrasına **bilinçli ertelenebilir**; teslim deneyimi değerlendirmeye girdi olur. State `prd_review_bekliyor`'da güvenle bekler — erteleme atlama değildir, zorunluluk kalkmaz
- **Kanonik kural:** Versiyon sonu PRD işi kaç oturum sürerse sürsün **prd-review'dur** — tek oturumda bitmezse `/devflow:prd-save` ile kaydedilip yine prd-review ile devam edilir. prd-refine yalnız iki yerde yaşar: **(a)** her (re-)kickoff **öncesi** PRD olgunlaştırma; **(b)** tüm planlanan versiyonlar bitince yeni versiyon tanımlama (2b yolu). Canlı versiyon döngüsü içinde ve versiyon-sonu değerlendirmesinde prd-refine kullanılmaz (versiyon içi PRD fikirleri `/devflow:prd-note` ile birikir).

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Durum Değerlendirmesi

Tamamlanan versiyonu değerlendir:
- Ne planlanmıştı vs ne tamamlandı
- Geliştirme sürecinde ne öğrenildi
- NOTES.md'deki biriken notları ele al — hepsini gözden geçir
- **VERSIONS.md'yi gerçekle uzlaştır** — uzlaştırmanın tek sahibi bu adımdır (faz döngüsü dosyaya dokunmaz): versiyon içinde doğan feature'lar (MODULE-MAP'te olup haritada olmayanlar) ve kayan/iptal olanlar haritaya işlenir; durum işareti/sütunu sızmışsa temizlenir (harita plandır — kendi KURAL'ı). 2b'nin sıradaki-versiyon tespiti ve re-kickoff'un Aktif Versiyon ilerletmesi bu haritaya dayanır

Kullanıcıya durum tespiti sun ve sor: "Herhangi bir değişiklik veya eklemek istediğin bir şey var mı?"

### 1b. Statik Doküman Mutabakatını Öner

Versiyon boyunca statik dokümanlara (OVERVIEW, projeye-özgü sabitler) rutin işte dokunulmadı — bu yüzden sessizce gerçeklikten kopmuş olabilirler. Versiyon sonu, bunun doğal kontrol noktasıdır.

Kullanıcıya **`/devflow:audit-docs` çalıştırmasını öner** (statik gerçeklik mutabakatı + versiyon boyunca birikmiş drift). audit artık artımlı (rolling/canvas) çalışır — sürekli ilerleme için `/loop /devflow:audit-docs` formunu hatırlat, raporla+onayla disiplini değişmedi. Bu oturumda inline yapma — audit fresh oturumlarda daha sağlıklı çalışır (cold-start avantajı). Hatırlatmanın görünür yeri oturum kapanış bloğunun «Sıradaki oturumdan önce» satırıdır (`önerilir:` önekiyle; CLAUDE.md → Oturum Kapanışı) — laf arasında bırakma.

Ürün tarafı için de versiyon sonu doğal bir denetim anıdır — **`/devflow:audit-product`'ı da hatırlat** (proje-geneli ürün denetimi: fazların odağı dışında kalan sessiz drift'i arar; bulgular `_dev/BULGULAR.md` kanvasına birikir, faz döngüsünde ele alınır). Aynı fresh-oturum **ve kapanış-bloğu** kuralı geçerli — hatırlatma `önerilir:` önekiyle «Sıradaki oturumdan önce» satırına düşer.

**Gelen Kutusu bu turda hükme bağlanır — hatırlatma değil.** Kanvasın Gelen Kutusu'na hemen her oturum yazabilir ama **hiçbir komut onu bütünüyle okumaz** (`verify-phase` Adım 1 yalnız o faza dokunanları süpürür): kutunun tamamını triyaj eden tek sahip `audit-product` uzlaştırmasıdır ve o, tasarımı gereği zamana/döngüye bağlı değildir — kimse çağırmazsa kutu monoton büyür. Versiyon sonu, çağrının garantili tek anıdır. Kutuyu **say** — tam dosyayı okuman gerekmez:

```bash
test -f _dev/BULGULAR.md && sed -n '/^## Gelen Kutusu/,/^## /p' _dev/BULGULAR.md \
  | grep -E '^- (\*\*)?\[' | grep -vcE '^- (\*\*)?\[Henüz yok\]' || true
```

Desen kaynak işaretini **kalın yazılmış hâliyle de** sayar (`- **[audit-product] …`) — iki biçim de meşrudur, dar desen kalemleri sessizce görünmez kılar.

**Komut bir sayı basmazsa bu 0 değildir** — kanvas hiç doğmamış demektir (dosya yok); o da geçerli bir sonuçtur, bir şey yapma. Sonuç 0 ise de bir şey yapma. 0 değilse **iki çıkıştan biri** yazılır, üçüncüsü yoktur:

- **(a)** uzlaştırma turu önerilir. **Yeni satır açma** — Adım 1b zaten `audit-product`'ı `önerilir:` önekiyle kapanış bloğuna yazdırıyor; sayıyı ve gerekçeyi **o satıra** ekle: `önerilir: /devflow:audit-product — Gelen Kutusu: N not`. (Fresh-oturum kuralı: bu oturumda inline triyaj yapma.)
- **(b)** triyaj bilinçle erteleniyorsa **gerekçesi** aynı satıra yazılır: `… — Gelen Kutusu: N not (ertelendi: <gerekçe>)`.

Sayımı Adım 1'in durum tespitini **sunmadan önce** koş ve sayıyı o sunuma bir kalem olarak kat (reçete burada, ölçüm anı orada). Kutuyu bu adımda sen boşaltmazsın; hükmün konusu kutunun **görünmez kalmaması**dır.

> **`[audit-product SORU]` satırları ayrıdır:** KARAR bekler, incelemeyle kapanmaz (BULGULAR kuralı). Sayı 0'dan büyükse bunları **listele** — kutunun tamamını açmadan:
> ```bash
> grep -nE '^- (\*\*)?\[audit-product SORU' _dev/BULGULAR.md | grep -v 'CEVAPLANDI'
> ```
> Satır-başı çapası zorunludur (çapasız desen bölümün kendi `<!-- KURAL -->` yorumunu da getirir); kapanış köşeli parantezi ise deseme **girmez** — `[audit-product SORU/zemin]` gibi nitelenmiş kalemler kaybolur.
>
> İkinci grep cevaplanmışları eler; kalanlar **bu turda kullanıcıya sorulur** (versiyon sonu, cevap almanın doğal anıdır) — liste uzunsa başlıkları birlikte sun, cevapları tek turda al. **Alınan cevabı satıra SEN işlersin** — satır silinmez, kaynak işaretinden hemen sonra işaretlenir: `- [audit-product SORU] ✅ **CEVAPLANDI** (<kim>, <oturum/tarih>) — <karar>`. Yalnız o satırı düzelt (yukarıdaki `-n` satır numarasını verir; hedefli oku, dosyayı baştan sona açma) ve Adım 3'te commit'e kat. Böylece uzlaştırma turu aynı soruyu yeniden sormaz; boşaltmak yine onun işidir. Cevapsız SORU bir sonraki versiyona taşınıyorsa kendi eki yazılır — (a)/(b) ayrımını bozmaz: `… (K cevapsız SORU taşındı: <gerekçe>)`.

**Git stratejisi mutabakatı (bu oturumda yapılır):** `_dev/GIT-STRATEJI.md` bir **eşik dokümanıdır** — projenin evresi değiştiğinde (ilk gerçek kullanıcı, canlıya çıkış, bir dalı izleyen otomatik deploy'un devreye girmesi) stratejinin *ağırlığı* değişir ama *metni* kendiliğinden değişmez. Versiyon sonu bunun doğal kontrol noktasıdır; başka hiçbir komut bu soruyu sormaz.

Tek soru yeter: **bu versiyonla proje bir eşik geçti mi?** (canlıya çıktı · gerçek kullanıcı aldı · deploy bağı kuruldu · başka biri commit atmaya başladı). Cevap evet ise strateji büyütülür — tarif `.claude/commands/devflow/lib/git-strategy-kurulum.md`'dedir (değiştirme akışı, md. 5); *tek daldan çalışma+yayın ayrımına geçiş bu oturumda kararlaştırılıp uygulaması `/devflow:quick` ile yapılabilir.* Eşik geçilmediyse "baktık, değiştirmedik" — bilinçli kayıt, dokümanın "Son Güncelleme" satırına düşer.

**README mutabakatı (bu oturumda yapılır):** Projenin kök README'si de statik-bayatlama sınıfındadır ama audit'in tarama seti (kök CLAUDE.md + `_dev/**`) dışında kaldığı için audit kapsamına girmez — tek sahibi bu adımdır. Kontrol et: README var mı ve tamamlanan versiyonun gerçekliğini anlatıyor mu? Çıta tek cümledir: **projeyi hiç bilmeyen bir okuyucu — insan ya da Claude — README'den projenin ne işe yaradığını, nasıl kurulup çalıştırıldığını ve genel mimarisini anlayabilmeli.** Delta küçükse kullanıcı onayıyla bu oturumda güncelle; büyükse kapsamı kullanıcıyla netleştir. README projenin kendi dokümanıdır — öner + onayla, sessizce ezme; sabit bölüm listesi/şablon dayatma, çıta cümlesi yeter.

### 2a. Değişiklik Varsa

- Kullanıcının nereleri değiştirmek istediğini anla
- Analist perspektifinden yaklaşarak değişiklikleri sorgula ve yol göster
- Perspektif bazlı sorgulama yaklaşımı kullan (deneyimle yeniden değerlendirme odaklı)
- İlgili PRD dokümanlarını güncelle
- **Proje ilkeleri değiştiyse ILKELER.md'yi güncelle:** Versiyon deneyimi bir ilkeyi yanlış çıkardıysa veya yeni bir öncelik/ufuk netleştiyse ILKELER.md'ye yansıt. Sınırı koru — yön/öncelik burada, vizyon/feature PRD'de
- Gerekirse web araştırması yap
- Ele alınan notları NOTES.md'den **sil** — ilgili bilgi PRD dokümanlarına aktarılmış olur
- SESSION-NOTES.md'yi güncelle (prd.md'deki SESSION-NOTES güncelleme kurallarına göre)
- **DURUM.md'deki Versiyon Sonu Durumu'nu `içerik_fazları` olarak sıfırla** (2b/2c ile simetrik; Aktif Versiyon re-kickoff'ta belirlenir). Aksi halde state `prd_review_bekliyor`'da kalır ve `/next` kullanıcıyı tamamladığı prd-review'a geri yönlendirir; sıfırlama sonrası `/next` doğru biçimde durup-sorar (next.md). Re-kickoff'tan önce doğrudan discuss-phase çalıştırılırsa, discuss-phase Adım 0'daki boş-Adım guard'ı tamamlanmış versiyonu yakalar (durur ve sorar; olağan rota re-kickoff) — **bu guard, 2a'nın (2b'nin aksine) Aktif Versiyon'u ilerletmeyip tamamlanan versiyonda bırakmasına dayanır; değişmemeli.**
  - **Zamanlama:** bu sıfırlama **yalnız review'un tamamlandığı oturumda** yapılır — oturum `/devflow:prd-save` ile bölünüyorsa YAPILMAZ. State `prd_review_bekliyor` kaldıkça `/next` devam oturumu için prd-review'u önerir (çalıştırmaz; next.md) — yukarıdaki "geri yönlendirme"nin istenen yüzü budur: yarım review için doğru, tamamlanmış review için sıfırlamanın önlediği hata. Erken sıfırlama + bölünme, devam akışını yarım review üstünden re-kickoff'a saptırır.

Oturum sonunda sıradaki adımı öner:
```
✅ PRD review tamamlandı. Değişiklikler PRD'ye yansıtıldı.
📋 Sıradaki adım: /devflow:kickoff
   → Değişiklikleri proje yapısına yansıtmak için re-kickoff oturumu başlat.
```

### 2b. Değişiklik Yoksa

- "Baktık, değiştirmedik" kararını SESSION-NOTES.md'ye kayıt altına al
- NOTES.md'deki ele alınan notları **sil**
- SESSION-NOTES.md'yi güncelle (prd.md'deki SESSION-NOTES güncelleme kurallarına göre)
- **DURUM.md'deki Aktif Versiyonu sıradaki versiyona güncelle** (VERSIONS.md'den sıradaki versiyonu belirle). Sıradaki versiyon yoksa Aktif Versiyon alanını boş bırak.
- **DURUM.md'deki Versiyon Sonu Durumu'nu `içerik_fazları` olarak sıfırla**

Sıradaki adımı öner:

**Sıradaki versiyon varsa:**
```
✅ PRD review tamamlandı. Değişiklik yapılmadı — bilinçli karar olarak kaydedildi.
   Aktif versiyon [vX.X]'e güncellendi.
📋 Sıradaki adım: /devflow:discuss-phase
   → Sıradaki versiyonun ilk fazının kapsam tartışması için yeni bir oturum başlat.
      Faz numarası just-in-time atanır (Faz Durumu tablosundaki en büyük faz no + 1); faz önceden numaralanmaz (bkz. PHASES.md → Faz Numaralandırma Kuralı).
```

**Sıradaki versiyon yoksa:**
```
✅ PRD review tamamlandı. Değişiklik yapılmadı — bilinçli karar olarak kaydedildi.
   Tüm planlanan versiyonlar tamamlandı.
📋 Sıradaki adım: yok — yeni versiyon planlanması bekleniyor.
   Hazır olduğunda: /devflow:prd-refine ile yeni versiyon tanımlayıp /devflow:kickoff ile re-kickoff yapılabilir.
```

### 2c. Erken Sonlandırma Sonrası

**Önce arşivleme yap:**
- Commit edilmemiş değişiklikler varsa WIP commit yap: `chore: WIP — early termination at [kısa açıklama]`
- Tamamlanmamış task dosyalarını `_dev/tasks/archive/`'a taşı
- Her tamamlanmamış task dosyasının başına şu notu ekle: "⚠️ Bu task erken sonlandırma nedeniyle tamamlanmadı."
- Faz dokümanına (`_dev/phases/PHASE-N.md`) "Erken Sonlandırma" bölümü ekle: hangi tasklar tamamlandı, hangileri yapılmadı, neden sonlandırıldı — ve aynı dosyanın **ilk satırındaki `**Durum:**` alanını `⚠️ Erken sonlandırıldı` yap** (template `PHASE.md:3`; PHASES ile aynı değer, tek yazım anı burasıdır — sonrasında doküman tarihsel sayılır)
- PHASES.md'deki erken sonlandırılan fazın durumunu `⚠️ Erken sonlandırıldı` olarak güncelle
- MODULE-MAP.md'deki kısmen tamamlanmış feature'ların Durum sütununu `🟡` olarak güncelle
- DURUM.md'deki Versiyon Sonu Durumu'nu `içerik_fazları` olarak sıfırla

**Sonra değerlendirme yap:**
- Tamamlanan fazları ve arşivlenen (tamamlanmamış) taskları gözden geçir
- Neden erken sonlandırıldığını kullanıcıyla tartış
- PRD'yi buna göre güncelle
- Erken sonlandırma bir ilkeyi etkilediyse (yön/öncelik/ufuk yanlış çıktı) ILKELER.md'yi de güncelle — sınırı koru (yön/öncelik burada, vizyon/feature PRD'de)

Sıradaki adım: re-kickoff (Aktif Versiyon ve faz yapısı re-kickoff sırasında güncellenecek)
```
✅ PRD review tamamlandı. Erken sonlandırma sonrası PRD güncellendi.
📋 Sıradaki adım: /devflow:kickoff
   → Re-kickoff ile proje yapısını güncelle.
```

### 3. Git Commit & Push

Tüm doküman değişikliklerini (PRD dokümanları, SESSION-NOTES.md, NOTES.md, DURUM.md, güncellendiyse kök README.md ve GIT-STRATEJI.md; cevap kancası yazıldıysa `_dev/BULGULAR.md`) commit & push yap:
```
docs: prd-review — version review completed
```

---

## Önemli Kurallar

- Bu oturum her versiyon geçişinde zorunludur — atlanamaz
- Tekrarlanabilir: tek oturumda bitmezse `/devflow:prd-save` ile kaydet, tekrar çalıştır
- Biriken notlar (NOTES.md) ana girdi — hepsini ele al
- **Konuya araştırarak gel** — prd.md → Önemli Kurallar'daki prensibe göre çalış.
- Değişiklik kararını kullanıcıya bırak, dayatma yapma
- "Değişiklik yok" da bilinçli bir karardır ve kayıt altına alınır
- Ele alınan notlar NOTES.md'den silinir — NOTES.md'de sadece henüz işlenmemiş notlar kalır
- Context dolmadan önce kaydetmeyi öner (`/devflow:prd-save`)
