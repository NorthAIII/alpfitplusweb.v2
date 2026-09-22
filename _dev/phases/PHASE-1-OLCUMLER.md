# Phase 1 — Ölçüm Detayı

← PHASE-1 · ölçüm-detayı

> `_dev/phases/PHASE-1.md` → Ölçümler'in bölme çocuğudur (TASK-1.06 oturumu, 2026-09-21; faz hâlâ aktifken bölündü — parent 17,3k token'a çıkmıştı ve geriye beş task + UAT + retrospektif vardı). Parent'ta hangi ölçümün alındığı ve sonucu **tek satırla** durur; **tam tablolar ve gerekçeler buradadır.** Yeni ölçüm bu dosyaya eklenir, parent'taki özet satırı birlikte güncellenir.

---

## Ölçümler

> Fazın yayın zinciri üzerinden alınmış ölçümleri. Rakam ve başlık listesi burada durur (QUALITY 6); icra detayı task dokümanlarında.

### Güvenlik başlıkları — Vercel yayın zinciri (TASK-1.03, 2026-09-11)

Adres `https://alpfitplus-web-v2.vercel.app`, dağıtım `1b1e464` (git kaynaklı, dal `main`). F7.2'nin F7.3'e devredilmiş kabul kriteri: başlıklar uygulamadan çıkıyor ve platform onları soymuyor.

| Başlık | Değer | Sonuç |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `X-Frame-Options` | `SAMEORIGIN` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | ✅ |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ tek değer |
| `X-Powered-By` | yok | ✅ (`poweredByHeader: false`) |

**Çift HSTS yok** — araştırmada beklenen çakışma gerçekleşmedi, Vercel kendi değerini eklemedi.

**Başlıklar önbellekten de geçiyor:** aynı beş başlık hem `x-vercel-cache: PRERENDER` (ilk istek) hem `HIT` (ikinci istek) yanıtında tam. QUALITY 2'nin "platform başlığı soyuyor, cache'ten baypas ettiriyor mu" sorusu ölçülerek kapandı.

### noindex üç katman — yayın zincirinde (TASK-1.03)

| Katman | Ölçüm | Sonuç |
|---|---|---|
| Başlık | `X-Robots-Tag: noindex, nofollow` — `/` ve `/sitemap.xml` | ✅ HTML-dışı yanıtta da var |
| `robots.txt` | `User-Agent: *` + `Disallow: /` | ✅ tam kapalı |
| HTML meta | `<meta name="robots" content="noindex, nofollow"/>` | ✅ |

Aşama `preview` türedi (üretim alan adı `.vercel.app` ile bitiyor). **Aşamanın `local` değil `preview` olduğunun kanıtı dağıtımın kendisidir:** `output` koşulu `VERCEL` sistem değişkenine bakıyor, o değişken tanımsız olsaydı standalone çıktı üretilir ve derleme yine ENOENT ile kırılırdı. Derlemenin geçmesi sistem env'lerinin derleme anında görünür olduğunu kanıtlıyor; proje ayarı da doğrudan okundu (`autoExposeSystemEnvs: true`). noindex'in açık olması bu ayrımı **tek başına gösteremez** — iki aşamada da kapalı olurdu (task dokümanının risk maddesindeki varsayım bu yönden eksikti).

### Diğer kalemler (TASK-1.03)

| Kalem | Ölçüm | Sonuç |
|---|---|---|
| Rota erişimi | `/`, `/ozellikler`, `/fiyat`, `/segmentler`, `/demo`, `/destek`, `/kvkk`, `/sitemap.xml` | 8/8 → 200 |
| Font önbelleği | `/fonts/inter-400-tr.woff2` → `public, max-age=31536000, immutable` | ✅ |
| `/api/demo` boş POST | 422 · `{"ok":false,"code":"missing",…}` | ✅ uç ayakta |
| TTFB (soğuk, ana sayfa) | 0,619 s | kayıt — eşik F7.4'te `perf.mjs` ile |
| v1 dokunulmadı | `https://alpfitplus.com/` → 200, `X-Robots-Tag` yok | ✅ |

### Canlı lead deposu bağlantısı (TASK-1.18, 2026-09-14)

Canlı depo `https://lead.alpfitplus.com` (v1'in PocketBase'i). Kayıt yazan istek yalnız yerel geliştirme sunucusundan, önizleme token'ıyla gitti; önizleme adresinden gerçek tur TASK-1.06'da.

| Kalem | Ölçüm | Sonuç |
|---|---|---|
| Sağlık | `GET /api/health` | ✅ 200 |
| Token kapısı | token'sız `POST /lead` | ✅ `401 {"error":"unauthorized"}`, kayıt yok |
| Uç yanıtı | `/demo` formu → `/api/demo` (yerel dev, canlı URL + önizleme token'ı) | ✅ `200 stored:true mailed:false`, 358 ms |
| Token → koleksiyon | canlı `data.db` salt-okunur okuma (SSH, `immutable=1`) | ✅ kayıt `leads_preview`'da, `env=preview`, `notify_team=failed`, `notify_lead=pending`, `ip_hash` 64 hex |
| Üretim koleksiyonu temiz | `leads`: bugünkü kayıt · `TASK-1.18%` · `test@example.com` | ✅ 0 · 0 · 0 |
| Yerel geri dönüş | yerel `leads_preview` sayımı canlı talep öncesi/sonrası 57/57; geri dönüş talebi sonrası 58; canlıda `geri donus` 0 | ✅ |
| Vercel env | `vercel env ls` | ✅ `LEAD_STORE_URL` (Config) · `LEAD_STORE_TOKEN` (Secret) · `IP_HASH_SALT` (Secret) — üçü Production + Preview |

**Canlıda iki test kaydı var:** 16:48:16Z'de başka bir oturumun kayıt bırakmadan koştuğu aynı test ve 20:09:03Z'de bu task'ın talebi. İkisi de `leads_preview`'da ve kalıyor; 12 aylık saklama cron'u siler. Vercel'deki token değeri geri okunamaz; önizleme adresinden ilk canlı kanıt TASK-1.06'nın turudur.

### Uçtan uca lead hattı — önizleme yüzeyinden (TASK-1.06, 2026-09-21)

Dağıtım `alpfitplus-web-v2-hz8zkhm2t` (`e35ede8` kodunun `RESEND_API_KEY` sonrası yeniden dağıtımı), adres `https://alpfitplus-web-v2.vercel.app`. Tek gerçek talep, gerçek tarayıcıdan (Chromium, `Pixel 7` mobil profili), 20:36:45Z.

| Kalem | Ölçüm | Sonuç |
|---|---|---|
| Uç yanıtı | tarayıcı ağ kaydı, `POST /api/demo` | ✅ `200 {"ok":true,"stored":true,"mailed":true}` |
| Depo kaydı | canlı `data.db` salt-okunur okuma (SSH, `mode=ro`) | ✅ `leads_preview` 12 → **13**, `leads` 2 → **2** |
| Kaydın alanları | `TASK-1.06%` kaydı, yalnız önizleme koleksiyonunda 1 adet | ✅ `env=preview` · `notify_team=sent` · `branches=2` · `Segment:` öneki · `ip_hash` 64 hex |
| E-posta gönderimi | Resend API kaydı `01a0c5af-…` | ✅ **`last_event: delivered`**, `…@eu-west-1.amazonses.com` |
| E-posta gövdesi | Resend API'den okundu | ✅ 9 alan + `KVKK onayı: verildi` + **`Ortam: preview`** |
| `reply_to` | lead'in adresi (`to`'dan farklı seçildi) | ✅ ölçüldü |
| Alan adı | Resend `GET /domains` | ✅ `alpfitplus.com` **verified**, `eu-west-1`, `sending: enabled` |
| Vercel env | `vercel env ls` | ✅ altı anahtar × Production + Preview (`RESEND_API_KEY` yeni, Secret) |
| Mobil (412 px) | tur sırasında ölçüldü | ✅ yatay kaydırma yok, konsol hatası yok |
| Regresyon | `npm test` (web konteyneri) | ✅ 3 dosya / 53 PASS + 1 skipped — TASK-1.18 tabanıyla aynı |

**DKIM hizası gönderimin kendisiyle kanıtlandı:** `_dmarc` `p=reject; aspf=s` altında Resend'in zarf alanı (`send.`) SPF hizasını geçemez, dolayısıyla `delivered` ancak DKIM `d=alpfitplus.com` hizalı geçtiyse mümkündür. **API'den ölçülemeyen tek kalem** gelen kutusu/spam **yerleşimidir** — kullanıcı gözlemine bırakıldı.

**Resend hesabı v1 ile ortak:** aynı hesapta v1'in iki `alpfitplus-website-prod` anahtarı var, yani ücretsiz kota (100/gün, 3.000/ay) paylaşılıyor. v2'nin anahtarı ayrı ve dar yetkili: `alpfitplus-web-v2`, `sending_access`, `alpfitplus.com`'a bağlı.

**Canlıda üç test kaydı var** (`leads_preview`): 2026-09-14'ün ikisi ve bugünün TASK-1.06 turu. Üçü de kalıyor; 12 aylık saklama cron'u siler.

### Analitik yükü — ClickTracker + Umami betiği (TASK-1.09, 2026-09-22)

F7.4'ün "sayfa ağırlığı artışı ölçüldü" kabul kriteri. İki ayrı kaynaktan ölçüldü çünkü `perf.mjs`'in kendi ağırlık muhasebesi JS/CSS'e kör (B-035) — B-035 bu task'ta düzeltilmedi, kapsam notuyla etrafından dolaşıldı.

| Kalem | Yöntem | Sonuç |
|---|---|---|
| Ana sayfa ağırlığı (masaüstü) | `perf.mjs`, üretim konteyneri (3100), Umami tanımsız | 144 KB — başlangıç çizgisiyle (`M6-Kalite-Kapilari.md`) **birebir aynı** |
| Ana sayfa ağırlığı (mobil) | aynı | 133 KB — **birebir aynı** |
| LCP (masaüstü) | aynı | 96 ms — başlangıç çizgisiyle (96 ms) **birebir aynı** |
| CLS | aynı | 0,005 — başlangıç aralığında (0–0,005) |
| Umami betiği (`script.js`) | CDP `Network.loadingFinished` → `encodedDataLength`, gerçek website id'li izole konteyner (port 3200, `docker run` — repoya/dev sunucusuna dokunmayan rsync-scratchpad yolu), gerçek Chrome UA (B-056 (b)) | **2,56 KB** gzip, tel üzerinde |
| Bir olay isteği (`POST /api/send`) | aynı | **0,74 KB** gzip, tel üzerinde |
| CORS ön-uçuşu (`OPTIONS`, yalnız ilk istekte) | aynı | 0 B |

**Yöntem notu:** `performance.getEntriesByType("resource")`'ın `transferSize`'ı `umami.kiwiailab.com` çapraz-kökenli olduğu ve `Timing-Allow-Origin` başlığı taşımadığı için sessizce **0** döndü — bu yüzden CDP `Network` alanına geçildi (`encodedDataLength`, gerçek tel-üzeri bayt, başlıklar dahil). İzole konteynerdeki tek tıklama DOM sırasında **Header**'ın WhatsApp bağlantısına denk geldi (1440 px masaüstü görünümde `a[href^="https://wa.me"]` seçicisinin ilk eşleşmesi), `hero` değil — ölçümün amacı uçtan uca ileti + bayt boyutuydu, hangi yüzeyin panelde doğru etiketlendiğinin görsel teyidi hâlâ UAT'ın işi. İki `/api/send` isteği gözlendi: biri Umami'nin otomatik sayfa-görüntüleme olayı, biri `track()`'in gönderdiği `whatsapp` olayı — ikisi de 0,74 KB (gövde küçük ve sabit alan sayısı aynı). Konteyner ölçüm biter bitmez `docker rm -f` ile silindi, port 3200'ün boşaldığı pozitif kontrolle doğrulandı; dev sunucusuna (`.env`, `web` konteyneri) hiç dokunulmadı.
