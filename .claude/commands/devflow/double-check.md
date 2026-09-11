# DevFlow — Oturum Sonu Doküman Kontrolü (Double Check)

Bu komut mevcut oturumda yapılan doküman değişikliklerini eleştirel gözle tekrar inceler. Oturumu kapatmadan önce hata, eksiklik ve tutarsızlıkları yakalamak içindir. Herhangi bir oturum tipinde çalışır.

**Kullanım:** `/devflow:double-check`

---

## Ne Zaman Kullanılır

Her DevFlow oturumunun son adımı olarak — ana komut (ör. `prd-refine`, `verify-phase`) tamamlandıktan ve sıradaki adımı önerdikten **sonra** çağrılır. Oturumdaki doküman değişikliklerini eleştirel gözle son kez inceler.

Genelde `/devflow:pause`, `/devflow:prd-save` veya oturum sonu özetinden **önce** çağrılır.

---

## Okunacak Dosyalar

### Göreve Göre
Bu oturumda düzenlenen veya oluşturulan dokümanları mevcut context üzerinden belirle. Kontrol sırasında bu dosyalarla ilgili çapraz referansları gerektiği kadar oku. **Sabit bir dosya listesi yok** — kapsam oturumun doğasına göre belirlenir.

---

## Yapılacaklar

### 1. Bu Oturumda Değişen Dokümanları Belirle

Mevcut context üzerinden bu oturumda düzenlenen, oluşturulan veya silinen doküman dosyalarını belirle. Bu dosyalar kontrolün merkezi olacak.

Eğer oturumda hiçbir doküman değişikliği tespit edilmezse kullanıcıya bildir: "Bu oturumda kontrol edilecek doküman değişikliği tespit edilemedi." ve komutu sonlandır.

### 2. Eleştirel Gözle İncele

Değişen dokümanları ve ilgili çapraz referansları fresh-read zihniyetiyle tekrar oku. **Sabit bir kontrol listesi yok** — serbest ve eleştirel düşün. Oturumun doğasına göre neye dikkat edeceğin değişir, kapsama sıkışma.

Varsayımda bulunma — şüpheli durumlarda kullanıcıya sor. Kafanın karıştığı her yeri sorguya açman beklenir.

### 3. Düzeltme ve Soru Sorma

`verify-plan`'in **iki kulvarlı** düzeltme kalıbını uygula — düzelt + bildir · sor + öneri sun. Kulvarların **adı ve sınırı burada farklıdır:** verify-plan task planlarını inceler, orada ayrım `mekanik ↔ yapısal`tır (bir task'ı bölmek plan kararıdır); bu komut o oturumda düzenlenen **dokümanları** inceler, yani sınırı **CLAUDE.md → Onay Ölçütü** çizer:

- **Kap işlemlerini doğrudan düzelt** — typo, placeholder kalıntısı, kırık referans, INDEX kayıt eksiği, kesimi kurallı bölme gibi doğru cevabı kanonun/template'in yazdığı düzeltmeler için kullanıcıya sorma gerekmez (kanon: CLAUDE.md → Onay Ölçütü; proje kanonu o ölçütü henüz taşımıyorsa taban `audit-docs` → Kulvarın tabanı'ndadır ve burada da geçerlidir)
- **İçerik işlemlerini kullanıcıya sor — ama önerisiz sorma.** Her kalem şu sırayı taşır: kısa bağlam → (gerçek bir ikilem varsa seçenekler + tradeoff) → **"önerim X, çünkü Y"** → karar bekle (desen ve dil: `step-by-step` → Pratik dili kullan). Açık uçlu "şurada şu tutarsızlığı gördüm, nasıl ilerleyelim?" tek başına yetmez — kullanıcı bir tartıcı bekler. Gerçekten bir tercihin yoksa onu da söyle ("ikisi de geçerli, şuna yatkınım, güçlü bir sebebim yok").
- **Kafanın karıştığı yerleri mutlaka sor** — varsayımla düzeltme yapma, emin değilsen sor

### 4. Rapor Sun

Kullanıcıya iki kategoride rapor ver:

```
🔧 Doğrudan Düzeltilenler:
- [ne düzeltildi — pratik karşılığıyla]   ([dosya])

❓ Sorularım / Dikkatine Sunarım:
- [sorun — pratik karşılığıyla] → önerim: [X], çünkü [Y]   (gerçek ikilem varsa: (a) … / (b) …)   ([dosya])
```

Kalem **pratik karşılığıyla** yazılır, doküman koordinatıyla değil (kanon: CLAUDE.md → Kullanıcının diliyle konuş) — dosya adı satırın sonunda, izlenebilirlik için durur. Birden fazla soru varsa hepsi raporda yukarıdaki tek satırıyla (sorun + önerim) listelenir, sonra **sırayla** karara bağlanır: bir kalem kapanınca sonrakini aç. Sorulacakların listesi bir arada, kararlar tek tek olur — audit-docs ile aynı kalıp; ikisinde de kurallı düzeltmeler uygulanmış olarak raporlanır (Adım 3), ayrı bir onay turu yoktur.

Sorun bulunmadıysa:
```
✅ Double-check tamamlandı. Dokümanlarda hata/tutarsızlık tespit edilmedi.
```

### 5. Git Commit & Push

**Değişiklik yapıldıysa** commit & push yap:
```
docs: double-check — [kısa özet]
```

**Değişiklik yapılmadıysa** commit atma.

### 6. Kapanış Bloğunu Yinele

Oturum double-check ile kapanıyorsa son söz budur — ana komutun kapanış bloğunu (CLAUDE.md → Oturum Kapanışı) **özet satırı ve «Açık kalemler» satırı dahil** birebir yinele (ardından `pause`/`prd-save` çalışacaksa nihai kapanış bloğunu o komut yazar):

```
<✅|⚠️|⏸️> [ana komutun özet satırı — ana komut blok üretmediyse bu oturumun sonucu, tek cümle]
📋 Sıradaki adım: /devflow:[ana komutun önerdiği komut]
   → [ana komutun verdiği gerekçe]
<⚠️|💡|✅> Açık kalemler: [önek: ana komutun bildirdiği kalem] | yok
```

Ana komut kapanış bloğu üretmediyse bloğu DURUM'daki duruma göre kur — ama içerik uydurma: sıradaki komutu DURUM belirler, satıra yalnız oturumda gerçekten dile getirilmiş işler girer (amblem kuralı → CLAUDE.md → Oturum Kapanışı).

**Yineleme bloğu dondurmak değildir — bu komutun kendi çıktısı satıra girer.** Adım 3'te düzeltilemeyip kalan bir kalem (kullanıcı "sonra bakalım" dedi, ya da düzeltmesi bu oturumun kapsamı dışı çıktı) **yeni bir kalem doğurur**: kulvarına göre `engel:` / `önerilir:` önekiyle satıra ekle, amblemi yeniden hesapla. Kalem sıradaki adımı engelliyorsa kanonun **terfi kuralı** burada da işler — `📋` satırı ana komutun önerdiği komut değil, o işi yapan komut olur (evi quick ise kaydı **bu oturumda** aç: `Durum: ⬜ Bekliyor`, kanonun dört koşuluyla). Yasak olan **icat etmektir**, güncellemek değil: ana komutun kararını taşı, bu oturumda gerçekten doğan yükümlülüğü ekle.

---

## Önemli Kurallar

- **Sadece bu oturumda yapılan değişikliklere odaklan** — tüm projeyi baştan taramaya çalışma
- **Sabit kontrol listesi yok** — eleştirel ve serbest düşün, kapsama sıkışma
- **Sadece dokümantasyon** — kod kalitesi bu komutun kapsamı dışında (onun için `verify-phase`, `review-phase` ve `simplify` var)
- **Varsayımda bulunma** — şüpheli durumlarda kullanıcıya sor
- **Değişiklik yapmadıysan commit atma**
- **Bu komut ana komutun akışına müdahale etmez** — oturumun son doğrulama adımıdır
- **Kapanış bloğunu kendin uydurma** — ana komutun bloğunu (özet satırı ve «Açık kalemler» satırı dahil) birebir yinele; ana komut blok üretmediyse DURUM'a göre kur, içerik icat etme. **İstisna bu oturumun kendi doğurduğu yükümlülüktür** (Adım 6): o icat değil, olgudur — eklenir ve amblem yeniden hesaplanır
