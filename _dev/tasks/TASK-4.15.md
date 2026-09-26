# TASK-4.15: B-011 — `destek@alpfitplus.com` posta alır (kullanıcının iki adımı + kapanış ölçümü)

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md) · M1 (yasal metnin başvuru adresi)
**Feature:** F7.5 Alan adı geçişi (Edge Case: apex'te MX kaydı yok)
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.01 ✅ (giden posta regresyon talebi dal önizlemesinden gönderilir)

---

## Hedef

`alpfitplus.com`'un hiç MX kaydı yok; yasal metnin KVKK başvuru ve silme talebi için **otuz gün taahhüdü** verdiği `destek@alpfitplus.com` posta alamıyor. Taahhüt, site alan adına bağlandığı anda ziyaretçiye görünür olur — bu yüzden bu task **TASK-4.18'den önce** kapanmalıdır.

İki adım kullanıcıdadır: Squarespace'te "Google Workspace MX" hazır seçeneği ve Google yönetim ekranında `destek@` kutusunun/takma adının var olduğunun doğrulanması. Claude atomdaki **kapanış ölçümünü** koşar. Tamam sayılır: beş MX kaydı iki çözümleyicide doğru önceliklerle, duran kayıtların tabanı birebir, dışarıdan gönderilen test postası kutuya ulaştı, giden posta yolunda regresyon yok; B-011 kapandı.

---

## Bağlam

Faz 2'nin ölçülebilir yarısı yapıldı (TASK-2.20): yönerge **Squarespace'in kendi belgesinden doğrulandı**, hedef küme `kiwiailab.com`'un çalışan kümesinin kopyası, bozulmama tabanı ölçüldü, bugünkü başarısızlığın biçimi (örtük MX → web sunucusunun IP'si) yazıldı. Bu task sıfırdan başlamaz: `bulgular/B-011-apex-mx-kaydi-yok.md` → Çözüm Yolu. Araştırma 2026-09-26'da apex MX'i hâlâ NODATA ölçtü.

Kapsam kararı: B-011 geçişten **önce** kapanır ve UAT senaryosudur.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-011-apex-mx-kaydi-yok.md` — **Çözüm Yolu** (kullanıcıya verilecek yönerge, ölçülen taban tablosu, kapanış ölçümünün dört adımı ve sırası)
- `_dev/memory/vercel-proje-kimlikleri.md` — atlatma anahtarının evi (regresyon talebi için)
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — regresyon talebinin kendi adresi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/bulgular/B-011-…` → Çözüm Kaydı + `Durum`; `_dev/BULGULAR.md` index
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 Edge Case satırı (kapandı, ölçümüyle)
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — canlı/gerçek hedefe giden test talebinin e-posta adresi kuralı (Resend test adresi; belgeden doğrulanan biçimiyle) — ilk kullanan task bu

---

## Alt Görevler

- [ ] **1. Kullanıcı adımları** — atomdaki yönergeyi kullanıcıya kısa ve pratik ver: (1) Squarespace → alan adı → DNS → "Add preset" → **Google Workspace MX**; (2) Google yönetim ekranında `destek@alpfitplus.com` kullanıcı, takma ad ya da grup olarak tanımlı. ⚠️ **Duran hiçbir kaydı silme** — giden posta (demo bildirimi) onlardan geçiyor.
- [ ] **2. MX ölçümü** — DoH, iki bağımsız çözümleyici (`dns.google` + `cloudflare-dns.com`): beş kayıt, öncelikler 1 / 5 / 5 / 10 / 10. Boş dönerse "girilmedi" ile "henüz yayılmadı" ayrımı negatif önbellek süresiyle (SOA minimum 300 sn) — tekrar ölç.
- [ ] **3. Taban karşılaştırması** — atomdaki tabloya karşı: apex TXT (SPF + site doğrulaması), `google._domainkey`, `resend._domainkey`, `_dmarc`, NS, A — birebir.
- [ ] **4. Gelen posta** — kullanıcı dışarıdan (kişisel bir adresten) `destek@alpfitplus.com`'a test postası gönderir ve kutuda görür.
- [ ] **5. Giden posta regresyonu** — dal önizlemesinden (atlatma başlığıyla) işaretli tek test talebi ("TEST — silinecek"): Resend'de ekip bildirimi `last_event: delivered`. Kayıt **önizleme** koleksiyonuna düşer (canlıya değil).
  - **E-posta alanı Resend'in kendi test adresidir** (`delivered@resend.dev` — biçim ve etiket desteği Resend belgesinden doğrulanır, tahminle yazılmaz); hayali bir alan adı (`example.com` gibi) **kullanılmaz** (kullanıcı kararı, verify-plan 2026-09-26). Gerekçe: talep sahibine onay e-postası da gider; hayali adrese giden posta geri döner ve bu hacimde tek bir geri dönüş bile `alpfitplus.com`'un gönderici itibarını düşürür. İlk canlı testte (TASK-1.18) `test@example.com` kullanılmıştı — o gün onay e-postası yoktu.
  - Onay e-postası tavanı adres başına 24 saatte 3 — aynı adres tekrar denenecekse sayılır (memory `hiz-sinirli-uca-test-bataryasi.md`).
- [ ] **6. Kayıtlar** — B-011 çözüm kaydı (dört adımın sonucu, tarihleriyle), BULGULAR index, M7 Edge Case.

---

## Etkilenen Dosyalar

```
_dev/bulgular/B-011-apex-mx-kaydi-yok.md
_dev/BULGULAR.md
_dev/modules/M7-Yayin-ve-Altyapi.md
_dev/memory/hiz-sinirli-uca-test-bataryasi.md   # canlı test adresi kuralı
```

Kod dosyası değişmez.

---

## Dikkat Noktaları

- **Kullanıcı adımı yapılmadan task koşamaz.** Adım gelene dek task 🔴 Bloke işaretlenir ve oturum kapanır; tablo sırası gereği sonraki task beklemeye girer — kullanıcıya bildirilir. Adımların **erkenden** (faz başında) yapılması DNS yayılması için de iyidir; plan oturumunun kapanış satırı bunu hatırlatır.
- Sandbox'ta doğrudan UDP DNS kapalı; `dig` sessiz boş döner — ölçüm **DoH** ile.
- `DEMO_TO` `kiwiailab.com`'dadır ve etkilenmez; sorun yalnız **gelen** postadadır.
- Test postasının kutuya ulaştığını ajan göremez — kanal kullanıcının gözüdür.

---

## Test Kriterleri

- [ ] DoH, iki çözümleyici: beş MX kaydı, öncelikler 1/5/5/10/10
- [ ] Taban tablosunun TXT / NS / A satırları birebir
- [ ] Dışarıdan gönderilen test postası `destek@` kutusuna ulaştı — **kanal: UAT** (kullanıcı gözü)
- [ ] Giden: regresyon talebinin ekip bildirimi Resend'de `delivered`; talep sahibine giden onay e-postası Resend'in test adresine ve `delivered` (geri dönüş yok)

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-26
