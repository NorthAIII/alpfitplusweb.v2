# DevFlow — Teknik Araştırma (Research Phase)

Bu komut faz için teknik araştırma yapmak ve bulguları kaydetmek için kullanılır. Kapsam tartışmasındaki kararlar araştırmayı yönlendirir.

**Kullanım:** `/devflow:research-phase [N]` — N = faz numarası (belirtilmezse DURUM.md'den aktif fazı al)

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/QUALITY.md` — yaklaşımların karşılaştırıldığı kalite eksenleri (Adım 2'de uygulanır)
2. `_dev/ILKELER.md` — Proje ilkeleri (yaklaşım seçimini yönlendirir)
3. Aktif faz dokümanı (`_dev/phases/PHASE-N.md`) — özellikle "Kapsam Tartışması" bölümünü oku

**Göreve Göre (araştırma konusuna göre oku)**
- Fazın modül dokümanları → MODULE-MAP.md'den bu fazın feature'larına bak, ilgili modülleri tespit et, `_dev/modules/MX-*.md` dosyalarını oku
- Mevcut teknik dokümanlar → INDEX.md'den araştırma konusuyla ilgili `_dev/docs/` dosyalarını tespit et ve oku (TECH-STACK, DATABASE, API vb.)
- `_dev/PHASES.md` → gerekirse oku (aktif faz DURUM'dan, kapsam PHASE-N'den gelir)
- `_dev/BULGULAR.md` → varsa bak: bu faza bulgu alınmışsa index'te ` → Faz N` işaretli satırlar durur; yalnız o satırların atomlarını oku (`_dev/bulgular/B-*.md`). Kapsam-daraltan iddiaların gerekçesi atomda yaşar, faz dokümanına yalnız sonucu geçmiş olabilir (Adım 2 → "Devraldığın daralmayı ölç"). İşaretli satır yoksa atom açma

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Araştırma Alanlarını Belirle

Faz kapsamı ve kapsam tartışmasındaki kararları analiz ederek araştırılması gereken konuları belirle:

**Tipik araştırma alanları:**
- **Stack/Kütüphane araştırması:** Kapsam tartışmasında belirlenen ihtiyaçlara uygun araç ve kütüphaneler
- **Mimari yaklaşımlar:** Feature'ların nasıl yapılandırılacağı, pattern'ler
- **Bilinen sorunlar ve tuzaklar:** Seçilen teknolojilerin yaygın hataları
- **Best practice'ler:** Benzer uygulamalarda kanıtlanmış yaklaşımlar
- **Performans ve ölçeklenebilirlik:** Seçilen yaklaşımın sınırları
- **Güvenlik:** Feature'a özgü güvenlik riskleri

### 2. Araştırmayı Yap

Her alan için:
1. Konuyu araştır
2. Alternatif yaklaşımları QUALITY.md'deki kalite eksenleri açısından karşılaştır
3. Önerisini gerekçesiyle belirle
4. Dikkat edilmesi gereken noktaları not al

**Kurallar:**
- Kapsam tartışmasındaki kararları baz al (mesela "kart layout" kararı varsa, kart component yaklaşımlarını araştır)
- Mevcut projede zaten kullanılan teknolojilerle uyumu göz önünde bulundur (OVERVIEW.md'deki stack)
- Sadece bu faz için gerekli olanları araştır, kapsamı aşma

**Devraldığın daralmayı ölç.** Yukarıdaki ilk kural kararları baz almanı söyler — ama her daralma bir karar değildir. Okuduğun bir kayıt bir yüzeyi, dosyayı ya da varyantı işin dışında bırakıyorsa ayır: **tercih mi, iddia mı?** "Bu fazda yapmıyoruz / sonraya bırakıyoruz / bilerek basit tutuyoruz" bir tercihtir, dayanağı kullanıcıdır — ölçülmez. "Orası zaten doğru / etkilenmiyor / o sınıf kapalı" bir **iddiadır**, dayanağı gerçektir — ölçülür. Bir satır ikisini birden taşıyorsa ("sonraya bırakıldı, zaten çalışıyor") kararı değil **gerekçedeki iddiayı** ölçersin.

**Nasıl ve nereye:** Deseni kaydın saydığı yerlerde değil **sınıfın kendisinde** ara, sonra kaydın saydığıyla karşılaştır — "üç yüzey" mi, dokuz mu? Yokluk iddiasında boş grep tek başına kanıt değildir (Çalışma Prensibi #11). Sonucu ölçüsüyle birlikte **"Dikkat Edilecekler"e** yaz — Adım 4'teki "Tanımlayıcı kaynağını kaydet" kuralıyla aynı ev; "Kapsam Tartışması" discuss-phase'in alanıdır, oraya yazılmaz. İddia **doğrulanırsa** daralma dayanağını kazanmıştır. **Çürürse ya da ölçüm kurulamıyorsa** (`doğrulanamadı`) kapsam kendiliğinden genişlemez: sonuç Adım 3'ün karar noktalarına girer, daraltmayı kullanıcı bilerek seçer. Devralınan bir iddiayı sınamak "kapsamı aşma" değildir: kapsamın gerçek olup olmadığını görmektir. Ve bunu **burada** yaparsın çünkü sonraki adımlar yazılanı denetler; yazılmayanı yakalayabilecek kapılar hem geç hem dardır — verify-phase'in artefakt süpürmesi koşulludur (ortada ortak bir kapı/invaryant yoksa hiç ateşlemez), verify Adım 2c ve review Adım 6 yalnız **kriteri olan** bir yüzeyi görebilir, audit-product'ın süzgeci ise faz kapandıktan çok sonra. Burada ölçmenin bedeli en düşük, kapsaması en geniştir.

### 3. Önemli Kararları Belirle

Araştırma sırasında ortaya çıkan karar noktalarını kullanıcıya sun:
- Birden fazla geçerli yaklaşım varsa seçenekleri sun
- Her seçeneğin artı/eksi yönlerini belirt
- Önerisini söyle ama kararı kullanıcıya bırak
- **ILKELER.md'ye göre öner:** Önerini projenin ilkeleriyle hizala (örn. kalıcılık önceliği → daha sağlam yaklaşıma eğil; öncelikli eksenler → o ekseni güçlendiren yaklaşımı öne çıkar). Bir yaklaşım bir ilkeyle çelişiyorsa bunu açıkça belirt.

**Milestone'u adıyla bağlayan karar.** Bu turun bir kararı, milestone cümlesinde **adıyla anılan** bir mekanizmayı/alanı değiştiriyorsa (cümle X der, sen Y'yi seçtin) bunu karar noktasının yanında söyle. Cümle **yeniden yazılmaz** — Adım 4'te faz dokümanında milestone'un altına tek satır düşülür: `mekanizma: X → Y (araştırma kararı)`. Not oraya konur çünkü kriteri okuyan kapılar (verify-plan Adım 3a, verify-phase Adım 2a) cümlenin kendisine bakar; aynı bilgi "Teknik Kararlar"a yazıldığında o kapılara ulaşmaz. PHASES ve DURUM'daki kopyalar özgün taahhüdü taşımaya devam eder, dokunulmaz (review-phase Adım 2 ile aynı ölçü; ölçüm sonuçlarının evi yine "Dikkat Edilecekler"dir — bu tek satır ayrıdır).

Ölçüt **ad kaymasıdır, kapsam değil:** hedef aynı kalıp yolu değiştiyse not düşülür; hedefin kendisi küçülüyorsa (bir ayak düşüyor, ölçüt gevşiyor) bu not değil **karardır** — yukarıdaki gibi kullanıcıya sunulur, faz ortasında sessizce daraltılmaz. Milestone hiçbir mekanizma adı anmıyorsa bu soru düşer.

### 4. Faz Dokümanını Güncelle

Araştırma tamamlandığında, faz dokümanına (`_dev/phases/PHASE-N.md`) "Araştırma Bulguları" bölümünü yaz:

```markdown
## Araştırma Bulguları

### Değerlendirilen Yaklaşımlar
- [Yaklaşım 1]: [Açıklama, artılar, eksiler]
- [Yaklaşım 2]: [Açıklama, artılar, eksiler]
- **Seçilen:** [Hangisi ve neden]

### Kullanılacak Araçlar/Kütüphaneler
- [Araç 1]: [Versiyon, ne için kullanılacak]
- [Araç 2]: [Versiyon, ne için kullanılacak]

### Dikkat Edilecekler
- [Tuzak/Risk 1]: [Nasıl kaçınılacak]
- [Tuzak/Risk 2]: [Nasıl kaçınılacak]

### Teknik Kararlar
- [Karar 1]: [Gerekçe]
- [Karar 2]: [Gerekçe]
```

**Milestone not satırı (varsa):** Adım 3'te bir ad kayması tespit ettiysen, tek satırı burada düş — `## Genel Bilgiler`deki Milestone cümlesinin **altına**, cümlenin kendisine dokunmadan.

**Tanımlayıcı kaynağını kaydet:** Araştırma bulgularında (özellikle "Dikkat Edilecekler") somut bir precondition tanımlayıcı — metric/uid/secret-slot/env-config anahtarı veya somut dosya/modül yolu — andığında, **nereden geldiğini** de yanına yaz: repoda zaten tanımlıysa tanım sitesi (`path`/sembol), bu fazda yaratılacaksa "yeni", dış sistemdeyse (vault slot, uzak dashboard) "dış". Yerini bilmiyorsan tahminle doldurma — hedefli bir `grep` ile bak, sonra kaydet (Çalışma Prensibi #11). Bu **kayıttır, doğrulama değil**: sen yalnız bildiğini işaretlersin, referansın gerçekle tutarlılığını verify-plan doğrular. Böylece research'te doğan tek bir tanımlayıcı N task'a akarken kaynağı bir kez burada sabitlenir — plan-phase kaynak-işaretini, verify-plan referans gerçeklik-kontrolünü buradan besler, her task'ta yeniden türetmez. Secret/env'de yalnız slot **adını** yaz, değeri asla.

### 4b. Faz Dokümanı Boyut Kontrolü (önleyici bölme)

"Araştırma Bulguları" faz dokümanının en hacimli bloklarından biridir; bu oturumda dokümanı belirgin büyütebilir. Faz **hâlâ aktifken** tek-okuma sınırını koru (detay: CLAUDE.md → Doküman Disiplini → Boyut ve Bölünme):

- `bash .claude/commands/devflow/scripts/doc-scan.sh _dev/phases/PHASE-N.md` çalıştır. Kırmızı çizgiye (~20k token) yaklaştıysa/aştıysa CLAUDE.md → Boyut ve Bölünme'ye göre teşhis + çöz: **gerçek büyüme** (araştırma detayı) → `PHASE-N-<EK>.md`'ye böl; **şişme** (yanlış-ev) → temizle.
- Yapısal bölme/temizlik **kullanıcıya önerilir, onayla uygulanır** — mekanik auto-split değil. Bu bir doküman-hijyen adımıdır, kaynak kodu değiştirmez.

### 5. Gerekirse docs/ Güncelle

Araştırmadan çıkan kalıcı bilgileri (veritabanı yapısı, API tasarımı vb.) ilgili `_dev/docs/` dokümanlarına yaz. Önemli kararları `_dev/docs/DECISIONS.md`'ye ekle (append-only; mevcut log okunmaz).

### 6. DURUM.md Güncelle

DURUM.md'deki **Adım** alanını `plan` olarak güncelle (araştırma tamamlandı, sıradaki adım planlama).

### 7. Git Commit & Push

Tüm doküman değişikliklerini commit & push yap:
```
docs(phase-N): research — technical research completed
```

### 8. Sıradaki Adımı Öner

```
✅ Araştırma tamamlandı. Bulgular faz dokümanına yazıldı.
📋 Sıradaki adım: /devflow:plan-phase
   → Task yazımı için yeni bir oturum başlat.
```

---

## Önemli Kurallar

- Bu oturumda task yazılmaz — sadece araştırma yapılır
- Araştırma bulgularını somut ve uygulanabilir tut (genel bilgi değil, bu projeye özgü)
