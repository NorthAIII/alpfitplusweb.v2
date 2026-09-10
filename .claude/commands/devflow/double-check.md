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

`verify-plan` düzeltme kalıbını uygula:

- **Mekanik sorunları doğrudan düzelt** — typo, placeholder kalıntısı, kırık referans, INDEX kayıt eksiği gibi doğru cevabı belli olan düzeltmeler için kullanıcıya sorma gerekmez
- **Yapısal veya anlam etkileyen sorunları kullanıcıya sor — ama önerisiz sorma.** Her kalem şu sırayı taşır: kısa bağlam → (gerçek bir ikilem varsa seçenekler + tradeoff) → **"önerim X, çünkü Y"** → karar bekle (desen: `step-by-step`). Açık uçlu "şurada şu tutarsızlığı gördüm, nasıl ilerleyelim?" tek başına yetmez — kullanıcı bir tartıcı bekler. Gerçekten bir tercihin yoksa onu da söyle ("ikisi de geçerli, şuna yatkınım, güçlü bir sebebim yok").
- **Kafanın karıştığı yerleri mutlaka sor** — varsayımla düzeltme yapma, emin değilsen sor

### 4. Rapor Sun

Kullanıcıya iki kategoride rapor ver:

```
🔧 Doğrudan Düzeltilenler:
- [dosya]: [kısa açıklama]

❓ Sorularım / Dikkatine Sunarım:
- [dosya]: [sorun] → önerim: [X], çünkü [Y]   (gerçek ikilem varsa: (a) … / (b) …)
```

Birden fazla yapısal kalem varsa hepsi raporda yukarıdaki tek satırıyla (sorun + önerim) listelenir, sonra **sırayla** karara bağlanır: bir kalem kapanınca sonrakini aç. Sorulacakların listesi bir arada, kararlar tek tek olur — audit-docs'un soruları sırayla açma kalıbı; oradaki toplu onay kapısı burada yoktur, mekanik düzeltmeler zaten uygulanmış olarak raporlanır (Adım 3).

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

Oturum double-check ile kapanıyorsa son söz budur — ana komutun kapanış bloğunu (CLAUDE.md → Oturum Kapanışı) **«Sıradaki oturumdan önce» satırı dahil** birebir yinele (ardından `pause`/`prd-save` çalışacaksa nihai kapanış bloğunu o komut yazar):

```
📋 Sıradaki adım: /devflow:[ana komutun önerdiği komut]
   → [ana komutun verdiği gerekçe]
<⚠️|✅> Sıradaki oturumdan önce: [ana komutun bildirdiği iş] | yok
```

Ana komut kapanış bloğu üretmediyse bloğu DURUM'daki duruma göre kur — ama içerik uydurma: sıradaki komutu DURUM belirler, satıra yalnız oturumda gerçekten dile getirilmiş işler girer (amblem kuralı → CLAUDE.md → Oturum Kapanışı).

---

## Önemli Kurallar

- **Sadece bu oturumda yapılan değişikliklere odaklan** — tüm projeyi baştan taramaya çalışma
- **Sabit kontrol listesi yok** — eleştirel ve serbest düşün, kapsama sıkışma
- **Sadece dokümantasyon** — kod kalitesi bu komutun kapsamı dışında (onun için `verify-phase`, `review-phase` ve `simplify` var)
- **Varsayımda bulunma** — şüpheli durumlarda kullanıcıya sor
- **Değişiklik yapmadıysan commit atma**
- **Bu komut ana komutun akışına müdahale etmez** — oturumun son doğrulama adımıdır
- **Kapanış bloğunu kendin uydurma** — ana komutun bloğunu («Sıradaki oturumdan önce» satırı dahil) birebir yinele; ana komut blok üretmediyse DURUM'a göre kur, içerik icat etme
