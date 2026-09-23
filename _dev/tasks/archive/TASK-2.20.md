# TASK-2.20: KVKK başvuru adresi posta alır — MX kayıtları ve test postası (B-011)

**Durum:** ❌ İptal

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
- `src/content/site.ts:24` (`CONTACT.support` tek kaynağı) · `src/content/legal.ts:48, 230, 316, 391` (adresin yasal metindeki dört yeri: başvuru kanalı `:230`, silme talebi `:316`) · `src/app/destek/page.tsx:35-36`
  ⚠️ Bu satır numaraları 2026-09-23'te **yeniden ölçüldü** — task yazılırken not edilen `site.ts:22` ve `legal.ts:48, 157, 234, 309` çürüdü (TASK-2.16/2.17 yasal metni büyüttü). Otuz gün taahhüdü **iki** yerde geçiyor (`:230` başvuru, `:316` silme), dördü de `CONTACT.support` üzerinden.
- `_dev/tasks/archive/TASK-1.06.md` — `DEMO_TO` doğrulaması ve DoH ölçüm deseni

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-011-*.md` — **atom bu task'ta kapanır**; koruma önerisinin MX-kapısı ayağı M6 F6.3/F6.4'e devredilir ve bu devir kayda yazılır
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 — geçiş öncesi alan adı kayıtlarının durumu

---

## Alt Görevler

- [x] **1. Kayıt kümesini yaz ve kullanıcıya ver** — ✅ 2026-09-23 (yönerge aşağıda, Oturum Kayıtları)
  - Beş MX kaydı, öncelikleriyle, Squarespace arayüzüne girilecek hâliyle (ana makine/host alanı dâhil)
  - Yönerge **kullanıcının diliyle** yazılır: hangi ekran, hangi alan, ne yazılacak — doküman adı ya da motor terimi kullanılmaz
  - Mevcut TXT kayıtlarına (SPF, DKIM, doğrulama) **dokunulmaz** uyarısı yönergede durur

- [ ] **2. Kullanıcı kaydı girdikten sonra ölç** — ⏸️ kayıt henüz girilmedi (ölçüldü 2026-09-23: apex MX hâlâ NODATA)
  - İki bağımsız çözümleyiciyle DoH: `dns.google` ve `cloudflare-dns.com` (sandbox'ta doğrudan UDP DNS kapalı, `dig` sessiz boş döner — bu yöntem ölçülmüş)
  - Beş kaydın beşi de görünüyor ve öncelikleri doğru
  - Yayılma gecikmesi olabilir (TTL 300) — ölçüm tekrarlanır

- [ ] **3. Gerçek test postası** — ⏸️ Alt Görev 2'ye bağlı
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

### Oturum — 2026-09-23

**Durum:** ⏸️ Duraklatıldı — Alt Görev 1 bitti, 2 ve 3 kullanıcının DNS adımını bekliyor (planlı el değişimi, engel değil)

**Yapılanlar:**
- **Bugünkü hâl ölçüldü, devralınmadı.** `alpfitplus.com` apex'inde MX kaydı **hâlâ yok**: iki bağımsız çözümleyici de `Status 0` + `Answer` yok + yalnız SOA döndürüyor (NODATA). Yani kullanıcı kaydı henüz girmedi ve task'ın öngörülmüş ⏸️ hâli geçerli.
- **Hedef küme tahmin değil kopya olarak doğrulandı.** `kiwiailab.com` bugün beş MX kaydı taşıyor ve öncelikleri birebir hedef kümeyle aynı: `1 aspmx.l.google.com` · `5 alt1` · `5 alt2` · `10 alt3` · `10 alt4`.
- **Bozulmama kanıtının tabanı alındı** (Test Kriteri 2 bunu gerektiriyor; kayıt girildikten sonra bu tabana karşı karşılaştırılacak) — aşağıdaki "Ölçülen taban" tablosu.
- **Bugünkü başarısızlık biçimi ölçüldü.** Apex'in `A` kaydı var: `76.76.21.21` (Vercel, TTL 14400; `AAAA` yok, iki çözümleyicide de aynı). MX yokken gönderen sunucu RFC'nin **örtük MX** kuralıyla bu A kaydına düşer — yani bugün `@alpfitplus.com`'a giden posta temiz bir "bu alan posta kabul etmiyor" reddi almıyor, **web sunucusunun IP'sine 25. porttan bağlanmayı deniyor** ve orada SMTP yok. Bulgunun "posta alamıyor" ifadesi doğru; biçimi bu.
- **Squarespace yönergesi kaynağından doğrulandı**, hafızadan yazılmadı: Squarespace'in kendi yardım belgesi **Add preset → Google Workspace MX** seçeneğinin tam olarak bu beş kaydı yazdığını söylüyor — yani kararlaştırılan küme ile hazır seçenek **birebir örtüşüyor** ve kullanıcının beş satırı elle girmesi gerekmiyor. Elle giriş yolu da yedek olarak yazıldı (alan adları: `Type` · `Name` · `Priority` · `Mail Server`, kök alan için `Name` = `@`).
- **Adresin koddaki çapası yeniden ölçüldü:** `CONTACT.support` = `destek@alpfitplus.com` (`site.ts:24`); yasal metinde dört yerde geçiyor (`legal.ts:48, 230, 316, 391`), **hepsi sabit üzerinden** — `src/` altında elle yazılmış tek bir `destek@alpfitplus` dizgesi yok.

---

#### Kullanıcıya yönerge — Squarespace'te yapılacaklar

> Bu bölüm kullanıcı içindir. Kayıtlar girildiğinde `/devflow:resume` ile ölçüm ve test postası ayağı koşar.

**1. Beş posta kaydını ekle (yaklaşık iki dakika)**

1. `account.squarespace.com/domains` adresini aç.
2. Listeden **alpfitplus.com**'a tıkla.
3. Yan menüden **DNS**'e gir.
4. **Add preset** açılır menüsünü aç.
5. Listeden **Google Workspace MX**'i seç ve kaydet.

Bu hazır seçenek aşağıdaki beş kaydı kendiliğinden yazar — tek tek girmen gerekmez:

| Host | Tür | Öncelik | Posta sunucusu |
|---|---|---|---|
| `@` | MX | 1 | `aspmx.l.google.com` |
| `@` | MX | 5 | `alt1.aspmx.l.google.com` |
| `@` | MX | 5 | `alt2.aspmx.l.google.com` |
| `@` | MX | 10 | `alt3.aspmx.l.google.com` |
| `@` | MX | 10 | `alt4.aspmx.l.google.com` |

**Hazır seçenek çıkmazsa elle:** aynı DNS ekranında aşağı in, **Custom Records** bölümünde **Add record**'a bas ve her satır için: **Type** = `MX`, **Name** = `@`, **Priority** = tablodaki sayı, **Mail Server** = tablodaki sunucu adı. Beş satır için beş kez.

⚠️ **Duran hiçbir kaydı silme.** Bugün bölgede duran SPF, iki ayrı imza anahtarı ve doğrulama kaydı **giden** postayı ayakta tutuyor — demo talebi bildirimi bunlardan geçiyor. Posta kaydı eklemek onlara dokunmaz, ama yanlışlıkla silinirse giden posta da durur. (Bozulmadığını ben ölçüp göstereceğim.)

**2. Google tarafında kutunun açık olduğundan emin ol**

Posta kaydı gelen postayı Google'a **yönlendirir**, ama kutuyu **açmaz**. Google yönetim ekranında `destek@alpfitplus.com`'un bir kullanıcı, takma ad (alias) ya da grup olarak tanımlı olduğunu doğrula. Tanımlı değilse posta Google'a ulaşır ve "böyle bir kullanıcı yok" diye geri döner — kayıtlar doğru olsa bile. Bu ikinci adım atlanırsa test postası yine başarısız olur, ama sebebi DNS olmaz.

**3. Haber ver**

İkisi bittiğinde `/devflow:resume` de. Ölçümü ve gerçek test postasını ben koştururum; senden yalnız postanın kutuya düştüğünü gözünle teyit etmen istenecek.

⏱️ Kayıt girildikten sonra beklemek gerekebilir: bölgenin "kayıt yok" cevabını önbellekte tutma süresi **5 dakika**, dünya geneline tam yayılma birkaç saati bulabilir. İlk ölçüm boş dönerse bu "girilmedi" değil "henüz yayılmadı" olabilir — tekrar ölçülür.

---

#### Ölçülen taban — 2026-09-23 (kayıt girilmeden ÖNCE)

Kayıt girildikten sonra Test Kriteri 2 ("TXT kayıtları değişmemiş") bu tabloya karşı doğrulanacak.

| Kayıt | Tür | TTL | Değer |
|---|---|---|---|
| `alpfitplus.com` | MX | — | **Answer yok (NODATA)** — iki çözümleyicide de yalnız SOA |
| `alpfitplus.com` | A | 14400 | `76.76.21.21` |
| `alpfitplus.com` | AAAA | — | Answer yok |
| `alpfitplus.com` | TXT | 14400 | `v=spf1 include:_spf.google.com -all` |
| `alpfitplus.com` | TXT | 14400 | `google-site-verification=QmUYlQ4Hm8VgxtyRSgLfgnAKlQqiSlQ-VM0NAeE2YM8` |
| `google._domainkey` | TXT | 300 | `v=DKIM1; k=rsa; p=MIIBIjANBgkq…` (2048 bit, RSA) |
| `resend._domainkey` | TXT | 14400 | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCcZDDJ2wB63…` (1024 bit) |
| `_dmarc` | TXT | 14400 | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` |
| `alpfitplus.com` | NS | 21600 | `nsd1` · `nsd2` · `nsd3` · `nsd4`.squarespacedns.com |
| `alpfitplus.com` | SOA | 21600 | `nsd1.squarespacedns.com. cloud-dns-hostmaster.google.com. 1 21600 3600 259200 300` |

Yöntem: DoH (`https://dns.google/resolve` ve `https://cloudflare-dns.com/dns-query`). MX ve apex A her iki çözümleyiciyle de ölçüldü ve aynı çıktı geldi; kalanlar `dns.google` ile. Sandbox'ta doğrudan UDP DNS kapalı — `dig` sessiz boş döner, bu yüzden DoH.

**Yan gözlem (kayıt değil, not):** bölgenin SOA serisi hâlâ `1` ve hostmaster `cloud-dns-hostmaster.google.com` — bölge Google Domains'ten Squarespace'e taşınmış ve o gün bugün **hiç düzenlenmemiş**. Bu, B-011'in "MX unutuldu" kök neden yönünü bağımsız olarak destekliyor: kayıt sonradan düşmedi, hiç girilmedi.

---

**Sorunlar:**
- **Devralınan satır çapaları çürüdü** (task dokümanı `site.ts:22` ve `legal.ts:48, 157, 234, 309` diyordu): ölçülen hâl `site.ts:24` ve `legal.ts:48, 230, 316, 391`. Sebep TASK-2.16/2.17'nin yasal metni büyütmesi. **Nasıl çözüldü:** Referans Dokümanlar bölümü yeniden ölçülen değerlerle güncellendi ve neden kaydedildi. Ayrıca ortaya çıktı ki otuz gün taahhüdü **iki** yerde duruyor (başvuru `:230` + silme `:316`), task dokümanı bir tane sayıyordu.
- **Bugünkü hâl "temiz red" değilmiş.** Devralınan özet "adres posta alamıyor" diyordu; doğru ama eksik. Örtük MX kuralı yüzünden posta web sunucusunun IP'sine deneniyor. **Nasıl çözüldü:** A kaydı ölçüldü ve biçim yukarıya yazıldı; kullanıcı yönergesine de yansıdı (yalnız DNS değil, Google tarafındaki kutu da gerekiyor).

**Kararlar:**
- **Gerçek bir "geri dönen posta" sınaması bu turda KOŞTURULMADI.** Gerekçe: bunun için kullanıcının kasasındaki yönetim anahtarından canlı yetkili geçici bir anahtar üretip bir dış servise gerçek bir gönderim yapmak gerekirdi; kanıtlayacağı olgu (MX yok → teslim yok) zaten iki bağımsız çözümleyiciyle ölçülü, ve başarısızlığın **sınıfı** A kaydı ölçümüyle ücretsiz belirlendi. Dış servis çağrısı, karşılığında yeni bir olgu vermediği yerde yapılmadı. docs/DECISIONS.md'ye eklendi: **Hayır** (tur-içi icra kararı, mimari sözleşme değil).
- **Kalıcı MX kapısı bu turda kurulmadı** — task dokümanının kendi sınırı: `CONTACT` içindeki her alan adı için MX kontrolü M6 F6.3/F6.4'ün işi. docs/DECISIONS.md'ye eklendi: **Hayır** (zaten kayıtlı sınır).
- **Yönerge hazır seçenek üzerine kuruldu**, beş satırlık elle giriş yedeğe alındı. Gerekçe: hazır seçeneğin yazdığı küme ile kararlaştırılan küme birebir aynı olduğu için elle giriş yalnız yazım hatası riski ekliyor.

**Kalan İşler:**
- Alt Görev 2 — kullanıcı kaydı girdikten sonra iki çözümleyiciyle ölçüm (beş kayıt + öncelikler) ve TXT tabanının bozulmadığının gösterilmesi
- Alt Görev 3 — dışarıdan gerçek test postası ve ulaştığının teyidi (`kanal: UAT` — kullanıcı gözü)
- Test Kriteri 4 — giden posta yolunda regresyon olmadığının bir test talebiyle teyidi
- Kapanışta: `BULGULAR.md` + `bulgular/B-011-*.md` atomunun kapatılması ve MX-kapısı ayağının M6 F6.3/F6.4'e devrinin kayda geçmesi · `modules/M7-Yayin-ve-Altyapi.md` → F7.5 kayıt durumu

**Son Yaklaşım:**
Task'ın ölçülebilir yarısı bitti: bugünkü hâl, hedef küme, bozulmama tabanı ve başarısızlık biçimi ölçüldü; kullanıcı yönergesi kaynağından doğrulanmış hâliyle yazıldı. Kalan yarı **tek bir dış girdiye** bağlı: Squarespace'te beş MX kaydının girilmesi ve Google tarafında `destek@alpfitplus.com` kutusunun açık olması. İkisi de kullanıcının elinde; repo tarafında yapılacak bir iş kalmadı.

**Sonraki Adım Detayı:**
`/devflow:resume` ile devam edilir. Sıra: (1) `curl -s 'https://dns.google/resolve?name=alpfitplus.com&type=MX'` ve `cloudflare-dns.com` eşdeğeri — beş kaydın beşi ve öncelikleri; (2) yukarıdaki "Ölçülen taban" tablosunun TXT/NS satırlarını yeniden ölç ve birebir aynı olduklarını göster (Test Kriteri 2); (3) dışarıdan `destek@alpfitplus.com`'a gerçek test postası ve ulaştığının teyidi — gerçek gönderim gerekiyorsa anahtar kasası yordamı (`memory/anahtar-kasasi-config-alpfit.md`: üret → kullan → **sil**); (4) giden posta regresyon teyidi; (5) B-011 atomunun kapanışı ve M7 F7.5 notu. İlk ölçüm boş dönerse "girilmedi" ile "yayılmadı" ayrımı 5 dakikalık negatif önbellek süresiyle yapılır — tekrar ölç.

**Dosya Değişiklikleri:**
- `_dev/tasks/TASK-2.20.md` → durum ⏸️, alt görev işaretleri, çürüyen satır çapalarının düzeltilmesi, bu oturum kaydı (yönerge + ölçülen taban)
- **Kaynak kodda ve `research/` altında değişiklik yok** — task zaten "repo dosyası değişmez" diyor; DNS bölgesi Squarespace'te

**Test Sonuçları:**
- `docker compose exec -e LEGAL_CONTRACT_HOOKS_DIR=/opt/v1-pb-hooks web npm test` → **211 geçti + 1 atlandı** (8 dosya geçti, 1 atlandı), süre 213 ms. Tur 19'un anahtarlı tabanıyla **birebir** — bu tur kod değiştirmediği için beklenen sonuç budur ve tabanı bağımsız doğrular.
- **Kapsam uyarısı:** bu batarya adresin **posta aldığını ölçmez** ve ölçemez. `tests/legal-consistency.test.ts` dal 7 yalnız *başvuru adresinin `CONTACT.support`'tan geldiğini ve `legal.ts`'e elle yazılmadığını* çiviliyor (ölçüldü: `legal.ts` sabiti kullanıyor, elle yazılmış adres yok); `tests/contact.test.ts`'in 20 testi ise telefon/e-posta **biçim** doğrulamasıdır, alan adına hiç bakmaz. MX olgusunun kapısı bilerek yok — evi M6 F6.3/F6.4.
- **Beş ölçüm betiği koşturulmadı** — gerekçe: render edilen yüzey bu turda hiç değişmedi (`src/` ve `research/` altında tek satır yok), ölçecekleri şey tur 19'un tabanıyla aynı girdiden doğar.

---

### Oturum — 2026-09-23 (kapanış)

**Durum:** ❌ İptal — task bitirilmedi; **konusu kapsam kararıyla fazdan çıktı**, işin kendisi iptal edilmedi.

**Ne oldu:** Faz 2'nin yeniden kapsam tartışmasında (`/devflow:discuss-phase`, 2026-09-23) kullanıcı B-011'i **"Alan adı geçişi" fazına taşıdı**. Gerekçe ILKELER'in pazarlıksız maddesidir: bu task'ın kalan iki ayağı (beş MX kaydının girilmesi + gerçek test postası) **kullanıcı tarafındaki bir DNS adımına** bağlıydı ve proje-dışı/kullanıcı-tarafı iş hiçbir fazın bitişini kilitleyemez. Hedef faz keyfi seçilmedi: bu task'ın kendi Feature alanı zaten *"F7.5'in ön koşulu"* diyordu ve otuz gün taahhüdü ancak site `alpfitplus.com`'a bağlandığında birine görünür hâle gelir — bugün site noindex bir önizleme adresinde, alan adını hâlâ v1 sunuyor. Fazın milestone'undan *"`destek@alpfitplus.com` test postası alıyor"* ayağı bu kararla düştü.

**Üretilen iş kaybolmadı — mezun edildi.** Bu turun ölçülmüş çıktısının tamamı `_dev/bulgular/B-011-apex-mx-kaydi-yok.md` atomuna taşındı, çünkü arşiv tarihsel bir kayıttır ve oraya bırakılan kalan iş kimseye görünmez (BULGULAR → Bulgu Sistemi kuralı). Atoma giden dört şey: **(1)** Squarespace yönergesi (kaynağından doğrulanmış **Add preset → Google Workspace MX** yolu + beş satırlık elle giriş yedeği + "duran kaydı silme" uyarısı), **(2)** ikinci kullanıcı adımı (Google'da kutunun/takma adın var olması — MX postayı yönlendirir, kutuyu açmaz), **(3)** bozulmama tabanı tablosu (TXT/NS/SOA, TTL'leriyle) ve **(4)** bugünkü başarısızlık biçimi (apex A `76.76.21.21` → **örtük MX** ile web IP'sine 25. port denemesi, temiz red değil). Kapanış ölçümünün beş adımlık sırası ve negatif önbellek ayrımı da atoma yazıldı. Atomun **Durum**'u `→ Faz 2`'den **Açık**'a döndü ve index satırından faz işareti kalktı.

**Yan kazanç — çürük çapalar atoma da işlendi.** Bu turda ölçülen doğru satır numaraları artık bulgunun kendi evinde duruyor: `site.ts:22` → **`:24`**, `legal.ts:133/198/273` → **`:230/316/391`**; ayrıca otuz gün taahhüdünün **iki** yerde durduğu (başvuru `:230` + silme `:316`) yazıldı. Atom bunu taşımasaydı sonraki faz aynı çürük çapalarla başlayacaktı.

**Kod değişikliği yok** — task zaten "repo dosyası değişmez" diyor; DNS bölgesi Squarespace'te. Bu kapanış turunda `src/` ve `research/` altında tek satır değişmedi ve test koşturulmadı: kod değişmediği için ölçecek yeni bir şey yok, tur 19'un anahtarlı tabanı (**211 geçti + 1 atlandı**) geçerli kalır.

---

## Sonuç Özeti

**❌ İptal — 2026-09-23.** Task'ın ölçülebilir yarısı yapıldı (yönerge kaynağından doğrulandı; bugünkü hâl, hedef küme, bozulmama tabanı ve başarısızlık biçimi ölçüldü); bitirilemeyen yarısı tek bir dış girdiye — kullanıcının Squarespace DNS adımına — bağlıydı. Kapsam kararıyla B-011 "Alan adı geçişi" fazına taşındı, üretilen ölçülmüş zemin bulgunun atomuna mezun edildi. **Bulgu açık kalır**; hiçbir şey kaybolmadı, yalnızca evi değişti.

---

**Oluşturulma:** 2026-09-22
