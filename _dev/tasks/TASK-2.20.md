# TASK-2.20: KVKK başvuru adresi posta alır — MX kayıtları ve test postası (B-011)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`) · M1 yasal metin
**Feature:** F7.5'in ön koşulu (feature bu fazda açılmaz)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** Yok (diğer task'lardan bağımsız; DNS adımı kullanıcıda)

---

## Hedef

`destek@alpfitplus.com` adresinin **posta alabilmesini** sağlamak. Apex alan adının bugün **hiç MX kaydı yok** (iki bağımsız çözümleyici NODATA; 2026-09-21'de yeniden ölçüldü) — yasal metin bu adrese KVKK 11. madde başvuru kanalı olarak **otuz gün taahhüdü** veriyor.

Task, MX kayıtları girildiğinde, iki çözümleyiciden ölçüldüğünde ve **gerçek bir test postası** adrese ulaştığında tamamlanmış sayılır.

---

## Bağlam

Google Workspace'in **yarısı zaten kurulu** — gönderim tarafı çalışıyor, alım tarafı kurulmamış:

- `v=spf1 include:_spf.google.com -all` → gönderim yetkilendirilmiş
- `google._domainkey.alpfitplus.com` → Workspace DKIM yayında
- `google-site-verification=…` → alan adı doğrulanmış
- **MX yok** → `@alpfitplus.com` ile biten hiçbir adres posta alamaz

**Alternatif reddedildi** (kullanıcı kararı, discuss 2026-09-22): başvuru adresini başka bir şirketin alan adına çevirmek — KVKK başvuru kanalı şirketin **kendi** alan adında kalır.

**Seçilen kayıt kümesi:** klasik beş kayıtlı Google kümesi (`1 aspmx.l.google.com` + `5 alt1/alt2` + `10 alt3/alt4`) — bu hesapta bugün çalıştığı **ölçüldü** (`kiwiailab.com`), yani hedef küme tahmin değil kopya. Modern tek kayıtlı küme (`smtp.google.com`) de geçerliydi ama ölçülmüş olan tercih edildi.

**DNS adımı kullanıcıdadır** — yönetim Squarespace'te (`nsd1.squarespacedns.com`). Faz yönergeyi yazar, kaydı ölçer ve test postasıyla doğrular.

**Giden posta etkilenmiyor:** `resend._domainkey.alpfitplus.com` apex'te duruyor, DKIM hizalanıyor, lead bildirimi DMARC `p=reject`'e takılmıyor. Sorun yalnız **gelen** postada.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-011-apex-mx-kaydi-yok.md` — ölçüm yöntemi (DoH), adresin sitedeki beş yeri, SPF/DKIM/DMARC durumu
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #6 — seçilen küme ve gerekçesi
- `src/content/site.ts:22` (`CONTACT.support` tek kaynağı) · `src/content/legal.ts:133, 198, 273`
- `_dev/tasks/archive/TASK-1.06.md` — `DEMO_TO` doğrulaması ve DoH ölçüm deseni

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-011-*.md` — **atom bu task'ta kapanır**; koruma önerisinin MX-kapısı ayağı M6 F6.3/F6.4'e devredilir ve bu devir kayda yazılır
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 — geçiş öncesi alan adı kayıtlarının durumu

---

## Alt Görevler

- [ ] **1. Kayıt kümesini yaz ve kullanıcıya ver**
  - Beş MX kaydı, öncelikleriyle, Squarespace arayüzüne girilecek hâliyle (ana makine/host alanı dâhil)
  - Yönerge **kullanıcının diliyle** yazılır: hangi ekran, hangi alan, ne yazılacak — doküman adı ya da motor terimi kullanılmaz
  - Mevcut TXT kayıtlarına (SPF, DKIM, doğrulama) **dokunulmaz** uyarısı yönergede durur

- [ ] **2. Kullanıcı kaydı girdikten sonra ölç**
  - İki bağımsız çözümleyiciyle DoH: `dns.google` ve `cloudflare-dns.com` (sandbox'ta doğrudan UDP DNS kapalı, `dig` sessiz boş döner — bu yöntem ölçülmüş)
  - Beş kaydın beşi de görünüyor ve öncelikleri doğru
  - Yayılma gecikmesi olabilir (TTL 300) — ölçüm tekrarlanır

- [ ] **3. Gerçek test postası**
  - Dışarıdan `destek@alpfitplus.com` adresine bir e-posta gönderilir ve **ulaştığı** doğrulanır (kullanıcı gözüyle ya da Workspace tarafından)
  - Bu, kaydın yalnız DNS'te değil **uçtan uca** çalıştığının tek kanıtıdır

---

## Etkilenen Dosyalar

```
(repo dosyası değişmez — DNS bölgesi Squarespace'te)
_dev/tasks/TASK-2.20.md        # yönerge, ölçüm çıktıları, test postası kaydı — YENİ (bu doküman)
_dev/modules/M7-Yayin-ve-Altyapi.md   # F7.5 öncesi kayıt durumu — zaten var
```

---

## Dikkat Noktaları

- **DNS adımı kullanıcıdadır.** Kullanıcı kaydı girene kadar Alt Görev 2-3 koşamaz; o hâlde task ⏸️ duraklatılır (`/devflow:pause`) ve oturum kapanış bloğuna iş düşer. **Bu bir engel değil, planlı bir el değişimidir** (`ILKELER.md` → proje-dışı/kullanıcı-tarafı iş fazı kilitlemez).
- **Mevcut TXT kayıtlarına dokunulmaz** — SPF, DKIM ve site doğrulaması giden postayı ayakta tutuyor; yanlışlıkla silinirse lead bildirimi DMARC'a takılır.
- **`dig` bu ortamda yanıltır** (sessiz boş döner) — ölçüm DoH ile yapılır.
- **`DEMO_TO` etkilenmiyor** — o `kiwiailab.com` adresinde ve beş MX kaydı taşıyor (TASK-1.06'da ölçüldü). Bu task oraya dokunmaz.
- **Kalıcı kapı bu fazda kurulmuyor:** `CONTACT` içindeki her e-posta alan adı için MX kontrolü M6 F6.3/F6.4'ün işi (B-011 koruma önerisi). TASK-2.18'in 7. dalı yalnız tek-kaynak disiplinini çiviler.
- **Yayılma gecikmesi** yüzünden ilk ölçüm boş dönebilir; "kayıt girilmedi" ile "henüz yayılmadı" ayrımı TTL'e bakarak yapılır.

---

## Test Kriterleri

- [ ] `dns.google` ve `cloudflare-dns.com` sorguları apex MX için **beş kaydı** da döndürüyor; öncelikler doğru (çıktı dokümana)
- [ ] Apex TXT kayıtları **değişmemiş**: SPF, `google._domainkey`, `resend._domainkey`, site doğrulaması ve `_dmarc` aynen duruyor (ölçülerek gösterilir)
- [ ] `destek@alpfitplus.com` adresine dışarıdan gönderilen gerçek bir test postası **ulaştı** (gönderim zamanı ve alıcı teyidi dokümanda) — kanal: UAT (kullanıcı gözü gerekiyorsa açıkça yazılır)
- [ ] Giden posta yolunda regresyon yok: lead bildirimi e-postası hâlâ ulaşıyor (bir test talebiyle teyit)
- [ ] `legal.ts`'in otuz gün taahhüdü artık karşılanabilir durumda — adres gerçekten posta alıyor

---

## Risk ve Geri Dönüş Planı

- **Yanlış MX kümesi girilirse** gelen posta reddedilir ve bu sessizdir → test postası tam olarak bunu yakalar; ölçüm yapılmadan task kapatılmaz.
- **Rollback:** kayıtlar Squarespace'ten geri alınabilir; giden posta kayıtlarına dokunulmadığı için gönderim tarafı hiçbir hâlde etkilenmez.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- run-task dolduracak -->

---

## Sonuç Özeti

<!-- Task tamamlanınca doldurulacak -->

---

**Oluşturulma:** 2026-09-22
