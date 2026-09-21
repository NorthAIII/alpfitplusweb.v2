# B-011: `alpfitplus.com` apex'te MX kaydı yok — KVKK başvuru adresi posta alamıyor

**Önem:** 🔴 | **Tip:** hata / altyapı | **Alan:** M7 — Yayın ve altyapı / M1 — Yasal metin
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** Sitede yayında olan ve yasal metinde **KVKK 11. madde başvuru kanalı** olarak gösterilen `destek@alpfitplus.com` adresi posta alabilmeli. `src/content/legal.ts:133` bu adres için "Başvurunuz en geç otuz gün içinde sonuçlandırılır" taahhüdünü veriyor; `:198` veri silme talebini, `:48` ve `:273` genel iletişimi aynı adrese bağlıyor. Dayanak: 6698 sayılı KVKK'nın veri sorumlusuna başvuru yükümlülüğü ve `ILKELER.md` → "Gelen talep kaybolmaz".

**Gözlenen:** Apex alan adının **hiç MX kaydı yok**. İki bağımsız çözümleyici NOERROR + boş cevap (NODATA) döndürüyor; yalnız SOA geliyor. `@alpfitplus.com` ile biten hiçbir adres posta alamaz.

**Tazelik:** yeniden ölçüldü **2026-09-21** (TASK-1.06, DoH) — apex MX hâlâ **NODATA**; apex TXT'te SPF ve site doğrulaması duruyor, `_dmarc` `p=reject; sp=reject; adkim=s; aspf=s` değişmedi. Bulgu 10 gündür aynı hâlde.

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

Adresin sitedeki yerleri:
- `src/content/site.ts:22` — `CONTACT.support: "destek@alpfitplus.com"` (tek kaynak)
- `src/content/legal.ts:48` — KVKK metni, veri sorumlusu iletişimi
- `src/content/legal.ts:133` — **KVKK 11. madde başvuru kanalı**, otuz gün taahhüdü
- `src/content/legal.ts:198` — veri silme talebi kanalı
- `src/content/legal.ts:273` — kullanım koşulları iletişim

DNS yönetimi Squarespace'te (`nsd1.squarespacedns.com`) — kayıt kullanıcının hesabında girilecek.

## Kök Neden Yönü

Google Workspace kurulumu yarım kalmış: doğrulama, SPF ve DKIM girilmiş, **MX kayıtları girilmemiş**. Site tarafında bir kod hatası yok — `CONTACT.support` sabiti doğru çalışıyor, tek kaynak disiplini korunuyor; hata alan adının DNS bölgesinde.

İkinci katman: sitedeki bir iletişim adresinin gerçekten çalıştığını **hiçbir kapı doğrulamıyor**. Yasal metin, sabit ve DNS birbirinden bağımsız yaşıyor.

## Koruma Önerisi

- **`DEMO_TO` doğrulaması yapıldı — bu kalem kapandı (TASK-1.06, 2026-09-21):** `DEMO_TO` = `kivanc@kiwiailab.com`, yani `@alpfitplus.com` **değil**; `kiwiailab.com` beş Google MX kaydı taşıyor (bugün ölçüldü) ve uçtan uca tur Resend'de **`last_event: delivered`** verdi. Lead bildirimi bu yüzden apex MX eksikliğinden etkilenmiyor. **Bulgunun kendisi açık kalır** — sorun gelen postada: `destek@alpfitplus.com` hâlâ posta alamıyor.
- Kalite kapıları otomatikleşirken `DEMO_TO`'nun alan adı da MX kontrolüne girer — bugün doğru değer elle seçildi, kapı yok.
- Kalite kapıları otomatikleşirken (M6 F6.3/F6.4) `src/content/site.ts` → `CONTACT` içindeki her e-posta alan adı için MX varlığı kontrol edilir. Tek DNS sorgusu, kırmızıya düşerse yayın kapısını durdurur — sızıntı denetimiyle aynı kapıya girer.

## Çözüm Kaydı

—
