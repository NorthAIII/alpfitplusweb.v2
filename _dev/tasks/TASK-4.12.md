# TASK-4.12: CSP ve güvenlik başlıklarında v1 paritesi

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.2 Güvenlik başlıkları, sitemap, robots
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.11 ✅ (**sıra şartı:** B-065 CSP'den önce) · TASK-4.03 ✅ (başlık dalı)

---

## Hedef

v2'de hiç `Content-Security-Policy` yok; v1'de canlıda var (B-016). `next.config.ts` → `securityHeaders`:

- `Content-Security-Policy` = v1'in canlı politikası **birebir** (`'unsafe-inline'` dahil); geliştirme sunucusunda — yalnız `NODE_ENV !== "production"` iken — `script-src`'e `'unsafe-eval'` eklenir;
- `X-Frame-Options: DENY` (bugün `SAMEORIGIN`);
- `Permissions-Policy` v1 değeri (bugün terk edilmiş `interest-cohort` taşıyor);
- HSTS korunur.

Politikanın siteyi kırmadığı **ihlal sayımıyla** kanıtlanır. Tamam sayılır: betiğin başlık dalı 3100'de yeşil; 16 rota + etkileşimlerde `securitypolicyviolation` **0**; Umami'li bir derlemede de 0 ve ölçüm isteği gidiyor.

---

## Bağlam

`docs/DECISIONS.md` 2026-09-26 md. 4: nonce yolu Next'te her sayfayı dinamik render'a zorlar (statik üretim ve CDN önbelleği kaybolur); deneysel SRI satır içi RSC betiklerini kapsamaz; parite ölçütü v1'in bugün yaptığıdır. Teknik Kararlar 3: rapor-modu turu canlıda koşmaz — iki dal düzeni prova yüzeyini sağlar (3100 + dal önizlemesi).

**Sıra şartı:** B-065 önce (TASK-4.09–4.11) — native POST sayesinde yanlış bir CSP kuralı hidrasyonu durdursa bile form çalışır; ters sırada CSP'nin tek bir hatası her ziyaretçide B-065 sızıntısını üretirdi.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-016-csp-yok-v1den-gerileme.md`
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → Parite ve yüzey (CSP politikası ve v2'ye özgü sınanacaklar; HSTS'in ters yöndeki davranışı) · Kullanılacak Araçlar (`securitypolicyviolation` dinleyicisi)
- `research/lib/gecis-envanteri.mjs` — beklenen başlık değerleri (TASK-4.03)
- `_dev/memory/arastirma-konteynerinde-tarayici-olcumu.md`
- `tests/legal-consistency.test.ts` → dal 5 — `src/` içindeki dış host kümesi dondurulmuş listeyle birebir (CSP'nin izin verdiği dış host ile çelişmemeli)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/bulgular/B-016-…` → Çözüm Kaydı (politika + ihlal sayımı); `_dev/BULGULAR.md` index
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.2 kriteri: CSP + `DENY` + güncel `Permissions-Policy`

---

## Alt Görevler

- [ ] **0. Karar** — dal önizlemesindeki Vercel araç çubuğu (aşağıda); task başında kullanıcıya sorulur.
- [ ] **1. Politika tek sabitte** — dize betik envanterindeki beklenen değerle birebir; geliştirme koşulu (`'unsafe-eval'`) ayrı ve dar.
- [ ] **2. Diğer iki başlık** — `DENY` ve v1'in `Permissions-Policy`'si. Dosya yorumuna (D-14 gerekçesinin yanına) CSP'nin neden nonce değil sabit olduğu tek satırla.
- [ ] **3. Başlık testi** — `tests/guvenlik-basliklari.test.ts` (YENİ): `next.config.ts`'in `headers()` çıktısında üretim koşulunda politika v1 dizesiyle birebir ve `'unsafe-eval'` **yok**; geliştirme koşulunda var; `DENY` ve `Permissions-Policy` değerleri. (Tek komut/CI gelince bu test gerilemeyi kendiliğinden yakalar.)
- [ ] **4. İhlal sayımı** (araştırma konteyneri, betik scratchpad'de): sayfaya enjekte `securitypolicyviolation` dinleyicisi + konsol; 16 rota × 390/1440 + etkileşimler — asistan akışı, formun JS'li gönderimi (`page.route` ile uç taklidi), JS'siz native gönderim (`form-action 'self'`), WhatsApp bağlantısı, iki sonuç sayfası.
  - 3100 (Umami etiketi yok) ve **Umami'li kopya** — önizleme kimliğiyle derlenmiş (`NEXT_PUBLIC_UMAMI_WEBSITE_ID` sır değil; olaylar `data-tag=local` ile ayrışır): betik yükleniyor, olay isteği `connect-src`'e takılmıyor.
  - JSON-LD veri bloğu yürütülmez → ihlal üretmemeli; `next/image` ve `data:` görseller `img-src` içinde.
- [ ] **5. Geliştirme sunucusu** — 3000 CSP'li açılıyor, sıcak yenileme çalışıyor, `scan.mjs` konsol temiz.
- [ ] **6. Başlık dalı** — 3100 taze imaj → `gecis-dogrula.mjs` başlık dalı: her yanıt türünde 0 kırmızı.

---

## Etkilenen Dosyalar

```
next.config.ts                        # securityHeaders
tests/guvenlik-basliklari.test.ts     # YENİ
```

---

## Dikkat Noktaları

- `frame-ancestors 'none'` + `DENY`: site kendini çerçevelemiyor — ölçülür (sayfalarda iframe yok).
- WhatsApp `wa.me` bağlantısı bir gezinmedir; CSP gezinmeyi kısıtlamaz. Umami **tek dış host**tur — dal 5'in dondurulmuş listesiyle tutarlı olmalı.
- HSTS `includeSubDomains; preload` v1'den geniştir (araştırma) — korunur; önyükleme listesine başvuru **yapılmaz** (ayrı karar).
- Dal önizlemesinde ölçüm (gerçek Vercel zinciri + araç çubuğu kararı) TASK-4.17'nin kalemidir.
- `_dev/` dokümanları Tailwind taramasına dahil (STYLE-GUIDE → Düzen Tuzakları): kayda sınıf adı yazılacaksa bölerek yaz; bu task CSS'e dokunmaz ama 3100 imajı yeniden derlenir.

---

## Karar Noktaları

- **Dal önizlemesinde Vercel araç çubuğu (`vercel.live`) politikaya takılır:** (a) önizleme aşamasında `vercel.live`'a izin — politika aşamaya bağlı iki değer olur, canlıdaki v1 ile birebir kalır; (b) araç çubuğunu Vercel proje ayarından kapatmak — politika tek değer kalır, dal önizlemesinde ölçüm de temiz olur; (c) konsol gürültüsünü kabul etmek (yalnız önizlemede). **Öneri (b).** Kullanıcıya sorulur.

---

## Test Kriterleri

- [ ] `tests/guvenlik-basliklari.test.ts` yeşil; `npm test` toplamı kayıtta
- [ ] 3100 başlık dalı: her yanıt türünde CSP birebir, `DENY`, `Permissions-Policy` v1, HSTS — **0 kırmızı**
- [ ] İhlal sayımı: 3100'de 16 rota × 2 genişlik + etkileşim listesi → **0**; Umami'li kopyada **0** ve Umami'ye en az bir istek gitti (ağ kaydı)
- [ ] 3000'de `scan.mjs` konsol temiz
- [ ] 3100: `a11y.mjs` ve `mobile-audit.mjs` taban değerlerinde
- [ ] Dal önizlemesinde ihlal 0 — **TASK-4.17**'de (gerçek Vercel zinciri)

---

## Risk ve Geri Dönüş Planı

- **Politika bir yüzeyi sessizce kırar** (ör. asistanın bir akışı, geç yüklenen bir betik): ihlal sayımı etkileşim listesini kapsamadıkça yakalayamaz — liste task başında sitenin gerçek etkileşim yüzeylerinden (asistan ağacı, form, bağlantılar) çıkarılır.
- **Rollback:** `next.config.ts` dosya bazlı; B-065 önce çıktığı için talep hattı politikadan bağımsız ayaktadır.

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
