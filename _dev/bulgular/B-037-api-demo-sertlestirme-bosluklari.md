# B-037: `/api/demo` sertleştirme boşlukları — kota istemcinin başlığıyla anahtarlanıyor, `null` gövde 500 veriyor, `content-type` hiç bakılmıyor

**Önem:** 🟡 | **Tip:** güvenlik / hata | **Alan:** M3 — Lead hattı (`src/app/api/demo/route.ts`)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `QUALITY.md` → 2 Güvenlik: *"Form girdileri sunucuda doğrulanıp sınırlanıyor mu? … Kötü niyetli bir kullanıcı bunu nasıl istismar edebilir?"* `M3-Lead-Hatti.md` → F3.1: *"Bozuk JSON gövdesi **400** döner"*, *"6. istek 429 döner"*. `phases/PHASE-1-ARASTIRMA.md` → Apps Script tuzağı: uç her yolda JSON döner.

**Gözlenen:** Dört boşluk; hepsi ölçüldü.

**(1) Hız sınırı istemcinin gönderebildiği başlıkla anahtarlanıyor ve zincirin yalnız ilk değeri okunuyor.**
`route.ts:181-184` sırası: `x-forwarded-for` (ilk değer) → `x-real-ip` → `"bilinmiyor"`. Yani **kolay taklit edilen başlık, daha güvenilir olanın önünde**. Yerelde tam bypass:
```
tek IP (aynı)             : 422 422 422 422 422 429     ← doğru davranış
her istek farklı XFF      : 422 422 422 422 422 422 422 422    ← 8/8 kabul, kota hiç devreye girmiyor
tükenmiş IP'nin önüne çöp : 10.99.9.1, 10.99.7.7 → 422  ← kova sıfırlandı
öncelik kanıtı            : XFF=temiz + x-real-ip=tükenmiş → 422 ·  XFF=tükenmiş → 429
```
Bu, ucun **tek** kötüye kullanım kontrolü. Sıra terstir: doğru kaynak platformun kendi başlığıdır (`x-real-ip` / `x-vercel-forwarded-for`).

> **ÖLÇÜLDÜ (TASK-1.06, 2026-09-14 20:37Z) — belirsizlik kapandı, kalem yayın yüzeyinde 🟢'ye indi.** Önizlemeye altı `POST /api/demo` atıldı, her biri farklı sahte `X-Forwarded-For` (`203.0.113.1-6`) **ve** `X-Real-IP` (`198.51.100.1-6`) taşıyor; gövde `{}` seçildi ki istek 422'de kalsın ve canlı depoya kayıt düşmesin. Sonuç **`422 ×5` sonra `429`** — yani altı istek **tek** kovada sayıldı. Anahtarlar istemcinin başlığından gelseydi altısı ayrı kovada olurdu ve `429` hiç gelmezdi. Pencerede başka istek yok (log: 15 dk'da 6 kayıt).
> **Hüküm:** Vercel iki başlığı da istemciden almıyor, **üzerine yazıyor**. Kota yayın yüzeyinde sahte başlıkla atlatılamaz. **Docker yüzeyi (3000/3100) hâlâ tamamen bypass edilebilir** — kalem orada 🟡 kalır. Planlanan "istek logundaki gerçek IP ile karşılaştırma" yapılamadı (`vercel logs --json` alanlarında IP yok), yan kanal (kova paylaşımı) kullanıldı.
> **İkincil sonuç:** `toStore` adaptörü `ip_hash`'i aynı başlıktan üretiyor (TASK-1.14), yani canlı deponun saatlik `ip_hash` kotası da yayında taklit edilemiyor.

**(2) Kota veri yapısı iki ayrı arıza taşıyor** (`route.ts:50-57`, izole ölçüm):
```
    10 istek → dizi uzunluğu     10 · CPU    0 ms
  1000 istek → dizi uzunluğu   1000 · CPU    7 ms
  5000 istek → dizi uzunluğu   5000 · CPU  133 ms
 20000 istek → dizi uzunluğu  20000 · CPU 2474 ms      ← O(n²)
```
(a) `list.push(now)` **koşulsuz** — 429 ile reddedilen istek de sayaca yazılıyor; dizi pencere içinde sınırsız büyüyor ve her çağrı tüm diziyi `filter` ile kopyalıyor. (b) `if (HITS.size > 5000) HITS.clear()` **tüm haritayı** siliyor, yani 5001 farklı IP'lik bir sel **her meşru kullanıcının kotasını sıfırlıyor** (ölçüldü: kurban 5 istekle dolu → saldırgan 5001 IP → kurbanın sayacı silindi → `limited()` false). "Bellek içi, örnek başına" tercihi bilinçli (`BULGULAR` → Bilinçli Tercihler) ve **bu iki madde o tercihin kapsamında değil** — uygulama hatası.

**(3) `null` gövde HTTP 500 veriyor, gövde boş — "her yolda JSON" sözleşmesi kırılıyor.**
```
$ curl -s -i -X POST /api/demo -H 'content-type: application/json' --data-raw 'null'
HTTP/1.1 500 Internal Server Error … gövde: 0 bayt
⨯ TypeError: Cannot read properties of null (reading 'website')  at POST (route.ts:201:18)
```
`JSON.parse("null")` başarılı olduğu için `catch` devreye girmiyor. Diğer skalerler doğru: `42`, `"metin"`, `[]`, `{}` → 422. `route.ts:193` `let body: Record<string, unknown>` **yanıltıcı bir tip beyanı** — `req.json()` `any` döner, TS koruma vermiyor. Apps Script alıcısı bu kontrolü **zaten yapıyor** (`null` → `bad-json`), yani route kendi alıcısından geride.

**(4) `content-type` hiç bakılmıyor — kör ama yazan çapraz-site POST mümkün.**
`req.json()` gövde metnini content-type'a bakmadan ayrıştırıyor: başlık yok, `text/plain`, `x-www-form-urlencoded`, `charset=utf-16` → hepsi geçti. Bir HTML formu `enctype="text/plain"` ile **ön-kontrolsüz** çapraz-site POST atıp gövdeyi geçerli JSON'a dönüştürebiliyor. `Origin` yabancı olmasına rağmen istek kabul edildi:
```
$ curl -X POST -H 'content-type: text/plain' -H 'Origin: https://kotu.example' \
    --data-binary @csrf.txt /api/demo
{"ok":false,"code":"no-sink"}  [503]     ← doğrulamayı GEÇTİ; hedef bağlıysa satır düşerdi
```
`Origin`/`Sec-Fetch-Site` kontrolü yok, CSRF token yok. Saldırgan yanıtı okuyamaz (CORS başlığı yok) ama **yazabilir**: hedef bağlandığı gün herhangi bir kötü sayfa, ziyaretçisinin tarayıcısından e-tabloya satır yazdırabilir ve kurbanın IP kotasını harcar.

**Ek küçük kalem:** POST dışı yöntemler 405 dönüyor ama **`Allow` başlığı yok** (RFC 9110 405'te zorunlu tutar); `OPTIONS` doğru (`allow: OPTIONS, POST`). Gövde boyutu sınırsız: 20 MB tam okundu ve ayrıştırıldı, 413 yok, `content-length` kapısı yok (`MAX` yalnız ayrıştırmadan **sonra** kırpıyor, bellek koruması değil). Vercel platformu gövdeyi kendi sınırında kesiyor — hafifletici, ama yerel/self-hosted yüzeyde sınır yok.

**Doğru çalışanlar kaydedilir:** prototip kirletme (`__proto__`) etkisiz; sıkıştırılmış gövde dürüst 400; e-posta gövdesinde `html:` alanı **yok** (dolayısıyla e-posta XSS'i yok, `<script>` düz metin kalıyor); sır hijyeni temiz (`RESEND_API_KEY` yalnız `authorization` başlığında, hiçbir yanıtta/logda anahtar, hedef adres ya da kişisel veri yok).

## Kanıt

```
$ grep -n "x-forwarded-for\|x-real-ip\|limited(ip)\|HITS" src/app/api/demo/route.ts
181-184: ip = xff.split(',')[0] ?? x-real-ip ?? "bilinmiyor"
 50-57 : list.push(now)  ·  if (HITS.size > 5000) HITS.clear()
186    : if (limited(ip))         ← doğrulamadan ÖNCE
193    : let body: Record<string, unknown> = await req.json()
201    : if (clean(body.website, 100))    ← null'da patlıyor
```
Kota bypass, `null` gövde ve CSRF koşumları bu turda birebir tekrarlandı; yük ölçümü ayrı süreçte koştu (dev sunucusuna dokunulmadı).

## Kök Neden Yönü

Uç, **güvenilmeyen girdiyi doğrulama** konusunda özenli (tip, uzunluk, rıza, bal küpü, webhook sözleşmesi hepsi düşünülmüş) ama **güvenilmeyen bağlamı** hiç ele almıyor: isteğin nereden geldiği (`Origin`), nasıl geldiği (`content-type`), kim olduğu (`x-forwarded-for`) ve ne kadar olduğu (boyut) sorgulanmıyor. Dördü de "istek" nesnesinin gövdesi dışındaki yüzeyi ve o yüzey platformun sorumluluğuna bırakılmış — ama platform sınırı hiçbir yerde yazılı değil, dolayısıyla Docker yüzeyinde koruma hiç yok.

## Koruma Önerisi

- Kota anahtarı platformun kendi başlığından okunur (`x-real-ip`, Vercel'de `x-vercel-forwarded-for`); `x-forwarded-for` yalnız ikincil ve **son** kaynak olur. **Ölçüldü (TASK-1.06):** yayın yüzeyinde platform başlıkları eziyor, yani bu düzeltme artık yalnız **Docker/self-hosted** yüzeyi için gerekli — aciliyeti düştü, gerekçesi durdu.
- `list.push` yalnız kabul edilen isteği sayar; dizi pencere boyunca **sınırlanır** (ör. son N damga) ve `HITS.clear()` yerine süresi geçmiş anahtarlar budanır.
- `if (!body || typeof body !== "object" || Array.isArray(body))` → 400 `bad-json`; `body` tipi `unknown` yapılır. Alıcı betiğin zaten yaptığı kontrol route'a taşınır.
- `content-type` zorunlu tutulur (`application/json`) **ve** `Sec-Fetch-Site: same-origin` ya da `Origin` allow-list kontrolü eklenir. Bu, **hedef bağlanmadan önce** yapılmalı — sonrası e-tablo kirlenmesi demek.
- 405 yanıtına `Allow` eklenir; `content-length` üst sınırı konur.

## Çözüm Kaydı

—
