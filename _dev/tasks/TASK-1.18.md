# TASK-1.18: Alıcıyı canlıya taşı — yedek, canlı sözleşme, otomasyon izolasyonu ve Vercel env

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`) · altyapı M7
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.13 ✅ (alıcı yerelde kanıtlı ve versiyonlu), TASK-1.14 ✅ (site yerel alıcıya bağlı)

---

## Hedef

Yerelde kanıtlanan alıcıyı canlı sunucuya taşımak ve siteyi ona bağlamak. Kapsam:

- Versiyonlanan tanımla canlıda kurulum (önce yedek).
- Aynı sözleşme paketinin canlı adrese karşı koşması.
- Talebin satış otomasyonlarına girmediğinin **çalışma zamanında** kanıtlanması.
- `LEAD_WEBHOOK_URL`'in (ve varsa kimlik anahtarının) Vercel'e girilmesi.

Task, sözleşme paketi canlıda yeşil olduğunda, test kaydına bir otomasyon döngüsü sonrası dokunulmadığı ölçüldüğünde ve yerelden canlı alıcıya giden talep Bunker'da `env=local` ile göründüğünde tamamlanmış sayılır.

---

## Bağlam

Kullanıcı kararı (2026-09-13): alıcı önce yerel kopyada kurulup sınanır (TASK-1.17, TASK-1.13), sonra canlıya taşınır. Bu task sunucuya **ilk kez yazan** task'tır. Kuralları pazarlıksızdır: önce yedek, önce test, sonra ölç (`../altyapi/vps/CLAUDE.md`).

Yerel prova sözleşmeyi ve seçim sorgusu düzeyindeki izolasyonu kanıtladı. Yerelin kanıtlayamadığı iki şey burada ölçülür: otomasyonların canlı döngüsünde kayda dokunulmaması ve gerçek ağ/TLS üzerinden yanıt.

**Devralınan kriter:** TASK-1.05'in canlı alıcıya bağlı tek kriteri ("gerçek alıcıya giden talep kayda düşer ve `env` alanı `local` yazar") iptal edilen TASK-1.04'e devredilmişti; artık bu task'ındır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.11.md` → Oturum Kaydı — otomasyon seçim sorguları, canlı erişim yolu
- `_dev/tasks/archive/TASK-1.13.md` → Oturum Kaydı — alıcı tanımının yeri, sözleşme paketi ve env adları
- `_dev/tasks/archive/TASK-1.14.md` → Oturum Kaydı — sitenin kimlik biçimi ve env anahtarları
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — adresler, sır kuralı
- `../altyapi/vps/CLAUDE.md` → "Değişiklik yaparken — pazarlıksız kurallar"
- `../bunker-dashboard/AGENTS.md` — yol Bunker giriş ucuysa dağıtım kuralları

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi; canlı sözleşme ölçüm tablosu → Ölçümler
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — canlı alıcının adı/konumu, kimlik anahtarının adı ve konumu (değer değil), geri dönüş komutu

---

## Alt Görevler

- [ ] **1. Önce yedek**
  - Değişecek yüzeyin yedeği: n8n iş akışı listesi dışa aktarımı ve/veya Bunker'ın ilgili tablo/şema yedeği
  - Geri dönüş komutu kurulumdan **önce** yazılır ve Oturum Kaydı'na not edilir

- [ ] **2. Canlıda kur**
  - Versiyonlanan tanım (TASK-1.13) içe alınır; canlı kopya ile repo kopyası birebir
  - Kimlik sırrı canlı için **yeniden üretilir** (tahmin edilemez, ≥ 32 karakter; yerel prova değeri kullanılmaz) ve yalnız sunucu tarafında durur

- [ ] **3. Sözleşme paketini canlıda koş**
  - `tests/lead-receiver.contract.test.ts` canlı adres ve kimlikle (env yalnız o komut için; `.env`'e canlı kimlik yazılmaz ya da yazıldıysa komuttan sonra geri alınır — karar Oturum Kaydı'na)
  - Test gövdeleri `env=local` taşır ve gerçek kişi verisi içermez

- [ ] **4. Otomasyon izolasyonunu çalışma zamanında kanıtla**
  - Test kaydı TASK-1.11'in salt okunur seçim sorgularına girmiyor
  - Otomasyonların en az bir döngüsü geçtikten sonra kaydın durum/sınıflandırma alanları değişmedi ve adrese gönderim kaydı yok

- [ ] **5. Siteyi canlı alıcıya bağla**
  - Kullanıcı `LEAD_WEBHOOK_URL`'i (ve varsa kimlik anahtarını) Vercel'de `alpfitplus-web-v2`'ye **Production + Preview** kapsamında girer. Değer oturuma gösterilmez; oturum `vercel env ls` ile adı doğrular
  - Yerel `.env` (dev, 3000) geçici olarak canlı alıcıya çevrilir; bir test talebi gönderilir → Bunker'da `env=local`. Sonra `.env` yerel prova alıcısına geri döner

- [ ] **6. Test kayıtlarının akıbeti**
  - Bunker canlı satış panelidir: `env=local` işaretli test kayıtları kalsın mı silinsin mi **kullanıcıya sorulur**. Silinecekse yalnız bu task'ın ürettiği kayıtlar, kimlikleriyle

---

## Etkilenen Dosyalar

```
_dev/
├── phases/PHASE-1.md                          # canlı sözleşme ölçümü — zaten var
└── memory/kendi-sunucu-n8n-bunker-umami.md    # canlı alıcı adı/konumu, geri dönüş — zaten var
```

> Bu repoda kod değişikliği beklenmiyor. Canlı kurulum sunucuda (ya da Bunker ucu yolunda o reponun dağıtımıyla) yapılır.

---

## Dikkat Noktaları

- **Canlı sistem:** Bunker'ın diğer kiracıları ve v1'in Umami'si aynı sunucuda. Beklenmeyen bir şey görülürse dur ve sor.
- **Sır değeri** task dokümanına, commit'e, sohbete ya da loga yazılmaz. Canlı kimlik yerel prova kimliğinden **farklıdır**.
- **Env değişikliği yeni dağıtım ister:** Vercel'e girilen değer mevcut dağıtıma yansımaz. Önizleme turu TASK-1.06'dadır; o task yeni dağıtımı tetikler.
- İzolasyon canlıda tutmazsa alıcı **hemen** devre dışı bırakılır ve test kaydı temizlenir. Talebi otomasyon öncesi yakalayan yöntem yeniden tasarlanır: bu bir **plan revizyonu** gerekçesidir (DURUM Adım=`plan`).
- Kötüye kullanım: alıcı internete açıktır, kimlik doğrulaması tek kapıdır. Kimliksiz istek hiçbir yazım yoluna girmez; paketin red senaryoları bunu canlıda da ölçer.
- Kanal notu: kriterlerin tamamı canlı sunucu, canlı veritabanı ve Vercel katmanındadır; yerel koşucu ve CI göremez.

---

## Test Kriterleri

- [ ] Sözleşme paketi canlı adrese karşı yeşil: doğru kimlik → `{"ok":true}` + bir kayıt; yanlış/eksik kimlik, bozuk ve `null` gövde → JSON `ok:false`, kayıt yok; 5 ardışık istek → 5 kayıt ve yanıt süresi yazılı — kanal: UAT
- [ ] Canlı alıcı tanımı repo kopyasıyla birebir (dışa aktarım karşılaştırması) — kanal: UAT
- [ ] Test kaydı üç otomasyonun seçim sorgusuna girmiyor; bir döngü sonrası kayıt değişmemiş, gönderim kaydı yok — kanal: UAT
- [ ] Yerelden (dev, 3000) canlı alıcıya gönderilen talep Bunker'da `alpfit` kiracısına **bir** kayıt olarak düşüyor ve `env` = `local` (TASK-1.05'ten devralınan) — kanal: UAT
- [ ] `vercel env ls`: `LEAD_WEBHOOK_URL` (ve varsa kimlik anahtarı) Production + Preview'de var, değer basılmadan — kanal: UAT
- [ ] Yedek dosyası ve geri dönüş komutu Oturum Kaydı'nda yazılı; yedeğin okunabilir olduğu doğrulandı

---

## Risk ve Geri Dönüş Planı

- **Yanlış kiracıya ya da tabloya yazım** → kimlikli test kayıtları silinir, alıcı durdurulur; yedekten dönüş yalnız gerekiyorsa.
- **Vercel'e yanlış değer girilirse** her talep 503'e düşer ve kullanıcı WhatsApp yoluna yönlenir. Kayıp yok ama huni daralır; TASK-1.06'nın ilk ölçümü yakalar.
- **Rollback:** n8n'de iş akışı pasif hâle alınır (ya da Bunker ucunun dağıtımı geri alınır); Adım 1'deki yedek ve geri dönüş komutu. Vercel env'i kaldırmak hattı bugünkü 503 hâline döndürür.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-13 (plan revizyonu)
