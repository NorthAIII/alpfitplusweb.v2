# B-011: `alpfitplus.com` apex'te MX kaydı yok — KVKK başvuru adresi posta alamıyor

**Önem:** 🔴 | **Tip:** hata / altyapı | **Alan:** M7 — Yayın ve altyapı / M1 — Yasal metin
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** Sitede yayında olan ve yasal metinde **KVKK 11. madde başvuru kanalı** olarak gösterilen `destek@alpfitplus.com` adresi posta alabilmeli. `src/content/legal.ts:230` bu adres için "Başvurunuz en geç otuz gün içinde sonuçlandırılır" taahhüdünü veriyor; `:316` veri silme talebini (aynı otuz gün taahhüdü **iki** yerde geçiyor), `:48` ve `:391` genel iletişimi aynı adrese bağlıyor. Dayanak: 6698 sayılı KVKK'nın veri sorumlusuna başvuru yükümlülüğü ve `ILKELER.md` → "Gelen talep kaybolmaz".

**Gözlenen:** Apex alan adının **hiç MX kaydı yok**. İki bağımsız çözümleyici NOERROR + boş cevap (NODATA) döndürüyor; yalnız SOA geliyor. `@alpfitplus.com` ile biten hiçbir adres posta alamaz.

**Tazelik:** yeniden ölçüldü **2026-09-23** (TASK-2.20, DoH — `dns.google` + `cloudflare-dns.com`) — apex MX hâlâ **NODATA** (iki çözümleyici de yalnız SOA döndürüyor); apex TXT'te SPF ve site doğrulaması duruyor, `_dmarc` `p=reject; sp=reject; adkim=s; aspf=s` değişmedi. Bulgu 12 gündür aynı hâlde.

**Faz geçmişi:** Bulgu Faz 2'nin kapsamındaydı (TASK-2.20) ve fazın ölçülebilir yarısı **yapıldı** — yönerge, hedef küme teyidi, bozulmama tabanı ve bugünkü başarısızlık biçimi aşağıda. Kalan iki ayak (kayıtların girilmesi + gerçek test postası) kullanıcı tarafındaki bir DNS adımına bağlı olduğu için bulgu **kapsam kararıyla "Alan adı geçişi" fazına taşındı** (2026-09-23, kullanıcı kararı; gerekçe `phases/PHASE-2.md` → Kapsam Tartışması). ILKELER: proje-dışı/kullanıcı-tarafı iş fazı kilitlemez.

Bunun bir unutma olduğunu gösteren üç işaret var — gönderim tarafı kurulmuş, **alım tarafı kurulmamış**:
- `v=spf1 include:_spf.google.com -all` → Google Workspace gönderimi yetkilendirilmiş
- `google._domainkey.alpfitplus.com` → Workspace DKIM anahtarı yayında
- `google-site-verification=...` → alan adı Google'da doğrulanmış

Yani Workspace kurulmuş ama MX kaydı DNS'e hiç girilmemiş ya da sonradan düşmüş.

**Ölçüm not:** Aynı turda Resend gönderim zinciri de ölçüldü ve **sorunlu çıkmadı** — `resend._domainkey.alpfitplus.com` apex'te duruyor, yani DKIM `d=alpfitplus.com` hizalanır ve `adkim=s` katı hizalamayı geçer. Giden lead bildirimi bu yüzden DMARC `p=reject`'e takılmaz. Sorun yalnız **gelen** postadadır.

## Kanıt

DNS over HTTPS ile iki bağımsız çözümleyici (sandbox'ta doğrudan UDP DNS kapalı, `dig @sunucu` sessiz boş döner — bu yöntem seçildi):

```
$ curl -s 'https://dns.google/resolve?name=alpfitplus.com&type=MX'
{"Status":0,...,"Question":[{"name":"alpfitplus.com.","type":15}],
 "Authority":[{"name":"alpfitplus.com.","type":6,...,
 "data":"nsd1.squarespacedns.com. cloud-dns-hostmaster.google.com. 1 21600 3600 259200 300"}]}
   → Answer YOK, yalnız SOA. NODATA.

$ curl -s -H 'accept: application/dns-json' \
    'https://cloudflare-dns.com/dns-query?name=alpfitplus.com&type=MX'
   → aynı sonuç: Answer yok, yalnız SOA.

$ curl -s 'https://dns.google/resolve?name=alpfitplus.com&type=TXT'
   → "v=spf1 include:_spf.google.com -all"
   → "google-site-verification=QmUYlQ4Hm8VgxtyRSgLfgnAKlQqiSlQ-VM0NAeE2YM8"

$ curl -s 'https://dns.google/resolve?name=_dmarc.alpfitplus.com&type=TXT'
   → "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s"
```

Adresin sitedeki yerleri (satır çapaları **2026-09-23'te yeniden ölçüldü** — TASK-2.16/2.17 yasal metni büyüttüğü için devralınan numaralar çürümüştü):
- `src/content/site.ts:24` — `CONTACT.support: "destek@alpfitplus.com"` (tek kaynak)
- `src/content/legal.ts:48` — KVKK metni, veri sorumlusu iletişimi
- `src/content/legal.ts:230` — **KVKK 11. madde başvuru kanalı**, otuz gün taahhüdü
- `src/content/legal.ts:316` — veri silme talebi kanalı, **aynı otuz gün taahhüdü**
- `src/content/legal.ts:391` — kullanım koşulları iletişim

Dördü de `CONTACT.support` sabiti üzerinden geçiyor — `src/` altında elle yazılmış tek bir `destek@alpfitplus` dizgesi yok (ölçüldü 2026-09-23). Tek-kaynak disiplinini `tests/legal-consistency.test.ts` dal 7 çiviliyor; adresin **posta aldığını** hiçbir kapı ölçmüyor ve ölçemiyor (evi M6 F6.3/F6.4).

DNS yönetimi Squarespace'te (`nsd1.squarespacedns.com`) — kayıt kullanıcının hesabında girilecek.

### Bugünkü başarısızlığın biçimi (ölçüldü 2026-09-23)

Apex'in `A` kaydı var: `76.76.21.21` (Vercel, TTL 14400; `AAAA` yok, iki çözümleyicide de aynı). MX yokken gönderen sunucu RFC'nin **örtük MX** kuralıyla bu A kaydına düşer — yani bugün `@alpfitplus.com`'a giden posta temiz bir *"bu alan posta kabul etmiyor"* reddi almıyor, **web sunucusunun IP'sine 25. porttan bağlanmayı deniyor** ve orada SMTP yok. Bulgunun "posta alamıyor" ifadesi doğru; biçimi budur.

### Ölçülen taban — 2026-09-23 (kayıt girilmeden ÖNCE)

Kayıtlar girildikten sonra *"duran TXT kayıtları bozulmadı"* koşulu **bu tabloya karşı** doğrulanır — tekrar ölçmeye gerek yok.

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

**Hedef küme tahmin değil kopya:** `kiwiailab.com` bugün beş MX kaydını aynı önceliklerle taşıyor (`1 aspmx` · `5 alt1` · `5 alt2` · `10 alt3` · `10 alt4`) ve o alan adına posta ulaşıyor (TASK-1.06'da uçtan uca ölçüldü).

## Kök Neden Yönü

Google Workspace kurulumu yarım kalmış: doğrulama, SPF ve DKIM girilmiş, **MX kayıtları girilmemiş**. Site tarafında bir kod hatası yok — `CONTACT.support` sabiti doğru çalışıyor, tek kaynak disiplini korunuyor; hata alan adının DNS bölgesinde.

**Ölçülen bağımsız destek (2026-09-23):** bölgenin SOA serisi hâlâ `1` ve hostmaster `cloud-dns-hostmaster.google.com` — bölge Google Domains'ten Squarespace'e taşındığından beri **hiç düzenlenmemiş**. Yani kayıt sonradan düşmedi, **hiç girilmedi**.

İkinci katman: sitedeki bir iletişim adresinin gerçekten çalıştığını **hiçbir kapı doğrulamıyor**. Yasal metin, sabit ve DNS birbirinden bağımsız yaşıyor.

## Çözüm Yolu (ölçülmüş — TASK-2.20'den mezun)

> Bu bölüm atom template'inde yoktur; **bilinçle eklendi.** Faz 2'nin ürettiği doğrulanmış yönerge ve ölçüm arşive gömülseydi kimseye görünmezdi (BULGULAR KURAL'ı: kalan iş yaşayan bir eve taşınır). Bu bulguyu ele alan faz buradan devam eder, sıfırdan başlamaz.

**Kullanıcı adımı iki tanedir — ikisi de gerekli.** Biri atlanırsa test postası yine düşer, ama sebebi farklı olur.

**1. Beş posta kaydını ekle** (Squarespace, yaklaşık iki dakika)

1. `account.squarespace.com/domains` adresini aç → **alpfitplus.com** → yan menüden **DNS**.
2. **Add preset** açılır menüsünden **Google Workspace MX**'i seç ve kaydet.

Bu hazır seçenek aşağıdaki beş kaydı kendiliğinden yazar — **Squarespace'in kendi yardım belgesinden doğrulandı** (hafızadan yazılmadı) ve kararlaştırılan kümeyle birebir örtüşüyor, yani beş satırı elle girmeye gerek yok:

| Host | Tür | Öncelik | Posta sunucusu |
|---|---|---|---|
| `@` | MX | 1 | `aspmx.l.google.com` |
| `@` | MX | 5 | `alt1.aspmx.l.google.com` |
| `@` | MX | 5 | `alt2.aspmx.l.google.com` |
| `@` | MX | 10 | `alt3.aspmx.l.google.com` |
| `@` | MX | 10 | `alt4.aspmx.l.google.com` |

*Hazır seçenek çıkmazsa elle:* aynı ekranda **Custom Records** → **Add record**; her satır için **Type** = `MX`, **Name** = `@`, **Priority** = tablodaki sayı, **Mail Server** = tablodaki sunucu adı.

⚠️ **Duran hiçbir kaydı silme.** Bölgede duran SPF, iki ayrı imza anahtarı ve doğrulama kaydı **giden** postayı ayakta tutuyor — demo talebi bildirimi bunlardan geçiyor. Posta kaydı eklemek onlara dokunmaz, ama yanlışlıkla silinirse giden posta da durur (bozulmama tabanı yukarıda, karşılaştırılabilir).

**2. Google tarafında kutunun açık olduğunu doğrula**

MX kaydı gelen postayı Google'a **yönlendirir**, kutuyu **açmaz**. Google yönetim ekranında `destek@alpfitplus.com`'un kullanıcı, takma ad (alias) ya da grup olarak tanımlı olduğu ayrıca doğrulanmalı — tanımlı değilse posta Google'a ulaşır ve *"böyle bir kullanıcı yok"* diye geri döner, kayıtlar doğru olsa bile.

**Kapanış ölçümü** (bulguyu ele alan fazın işi): (1) iki çözümleyiciyle DoH — beş kayıt ve öncelikleri; (2) yukarıdaki tabanın TXT/NS satırları birebir duruyor mu; (3) dışarıdan gerçek bir test postası ve **ulaştığının** teyidi (kullanıcı gözü); (4) giden posta yolunda regresyon yok (bir test talebiyle). ⏱️ İlk ölçüm boş dönerse *"girilmedi"* ile *"henüz yayılmadı"* ayrımı negatif önbellek süresiyle yapılır (SOA minimum **300 sn**) — tekrar ölç. Sandbox'ta doğrudan UDP DNS kapalı; `dig` sessiz boş döner, ölçüm **DoH** ile yapılır.

## Koruma Önerisi

- **`DEMO_TO` doğrulaması yapıldı — bu kalem kapandı (TASK-1.06, 2026-09-21):** `DEMO_TO` = `kivanc@kiwiailab.com`, yani `@alpfitplus.com` **değil**; `kiwiailab.com` beş Google MX kaydı taşıyor (bugün ölçüldü) ve uçtan uca tur Resend'de **`last_event: delivered`** verdi. Lead bildirimi bu yüzden apex MX eksikliğinden etkilenmiyor. **Bulgunun kendisi açık kalır** — sorun gelen postada: `destek@alpfitplus.com` hâlâ posta alamıyor.
- Kalite kapıları otomatikleşirken `DEMO_TO`'nun alan adı da MX kontrolüne girer — bugün doğru değer elle seçildi, kapı yok.
- Kalite kapıları otomatikleşirken (M6 F6.3/F6.4) `src/content/site.ts` → `CONTACT` içindeki her e-posta alan adı için MX varlığı kontrol edilir. Tek DNS sorgusu, kırmızıya düşerse yayın kapısını durdurur — sızıntı denetimiyle aynı kapıya girer.

## Çözüm Kaydı

—
