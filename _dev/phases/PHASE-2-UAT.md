# Phase 2 — UAT Detayı

← PHASE-2 · uat

> `_dev/phases/PHASE-2.md` → UAT Sonuçları'nın bölme çocuğudur (verify-phase boyut kapısı, 2026-09-23; faz **hâlâ aktifken** bölündü — UAT tablosu ve otomatik kontrol dökümü yazıldığında parent 23.517 token'a çıkarak kırmızı çizgiyi aştı). Parent'ta sonucun **snapshot'ı** durur (tarih, sayı, ölçüm yüzeyi, kalan kalem — CLAUDE.md → Faz dokümanı hibrittir: "UAT sonuç tablosu — özet kalır"); **30 senaryonun tam tablosu ve otomatik kontrol dökümü buradadır.**

---

## UAT Sonuçları — tam tablo

**Tarih:** 2026-09-23
**Toplam Senaryo:** 30 | **Geçen:** 29 | **Kalan:** 1

| # | Senaryo | Sonuç | Not |
|---|---------|-------|-----|
| 1 | Altı yüzey (Kurucu Programı · /ozellikler · asistan · SSS · /fiyat · karşılaştırma) aynı yol haritası listesini gösteriyor; kalem sayısı ve sırası tek kaynakla birebir | ✅ Geçti | altı yüzey de 7 «yolda» + 5 «yol haritasında»; B-040 kanıt komutu `src/`'de 0 |
| 2 | B-029'un beş karşılıksız iddiası hiçbir yüzeyde "bugün var" olarak görünmüyor; eski ifadeler yayındaki HTML'de 0 | ✅ Geçti | sekiz eski ifadenin sekizi de 0 · kontrol: düzeltilmiş ifadeler 3/11/2/2/6 vuruş |
| 3 | Pilot cümlesi yalnız `PRODUCT_STATUS`'tan, fiyat yalnız `monthlyFor()`'dan geliyor; sitede rakip adı geçmiyor (CLAIMS sınırı) | ✅ Geçti | pilot cümlesi tek evde · fiyat rakamı yalnız `pricing.ts` · 13 marka adının 0'ı (tek vuruş «CrossFit» = segment adı) · kontrol: bilinen marka listede ve bulunabilir |
| 4 | **Adversarial:** bir yol haritası kalemi "bugün var"a taşındığında derleme ve servis duruyor (fail-closed yayın kapısı) | ✅ Geçti | `qr-turnike` → «bugün var»: 4 test dosyası modül düzeyinde düştü (211 → 33), dört rota HTTP 500 · ters-çevirme geri alındı |
| 5 | **Adversarial:** bir tüketiciye sabiti atlayan kalem elle yazıldığında test bataryası kırmızı dönüyor | ✅ Geçti | `/ozellikler`'e elle kalem: 1 kırmızı, doğru testte · ters-çevirme geri alındı |
| 6 | Yayındaki yedi ürün görselinde gerçek kişi adı, "Kampanyalar" menü girdisi ve karşılanmayan özellik kartı yok | ✅ Geçti | yedi görselin yedisi hattın taze çıktısıyla **md5 birebir** — yayındakiler denetimden geçmiş çıktının kendisi |
| 7 | **Adversarial:** kaynağa ad sızıntısı enjekte edildiğinde hat sıfır-olmayan kodla duruyor ve dosya yazmıyor | ✅ Geçti | ad eşlemesi çıkarıldı → çıkış 1, `grup.webp` **yazılmadı** (5 dosya) · kopya üzerinde, kaynak md5 değişmedi |
| 8 | **Adversarial:** kaynağa iddia dizgesi (ciro projeksiyonu / üstünlük rozeti) enjekte edildiğinde hat duruyor | ✅ Geçti | cockpit iddia kuralları söküldü → çıkış 1, **0 dosya**, 20 iddia bulgusu (B-018'in arızası birebir yeniden üretildi) |
| 9 | Denetimin kapsamı çökerse (sözlük · ad tablosu · toplanan metin kütlesi) hat yeşil koşmuyor, alt sınırda duruyor | ✅ Geçti | sözlük 4/16'ya budandı → **import anında** durdu, 0 dosya |
| 10 | Yayındaki yasal metin IP'nin iki kullanımını, 12 ay saklamayı, dört tedarikçinin ülkesini ve ölçüm sunucusunun erişim kaydını anlatıyor | ✅ Geçti | IP özeti 3 · on dakika 2 · 12 ay 6 · Washington D.C. 3 · Nürnberg 5 · İrlanda 3 · ekip kutusu 3 · erişim kaydı 6 · «silme süresi işletmiyoruz» 4 |
| 11 | Yasal metinde uydurulmuş süre, sağlayıcı ya da hukuki dayanak yok; her olgu cümlesinin koddaki karşılığı duruyor | ✅ Geçti | metindeki tek süreler «12 ay» ve «15 gün» — ikisi de ölçülü; uydurma madde numarası 0 |
| 12 | Dokuz dallık yasal beyan kapısı yeşil koşuyor (çapraz depo anahtarı tanımlıyken) | ✅ Geçti | 211 geçti + 1 atlandı (9 dal) |
| 13 | **Adversarial:** bir beyanın dayanağı bozulduğunda kapı kırmızı dönüyor — sessizce geçmiyor | ✅ Geçti | metin tarafı (12 → 24 ay) **2 kırmızı** (biri bölüm-geneli kontrolü) · kod tarafı (`data-exclude-search` sökülünce) **1 kırmızı** |
| 14 | Çapraz depo anahtarı tanımsızken dal atlanıyor ve bataryanın **geçen** sayısı birebir korunuyor | ✅ Geçti | anahtarsız 204 geçti + 2 atlandı — **geçen sayısı birebir** |
| 15 | Üretim imajında `/app/.env` yok; imaj genelinde hiçbir `.env` izi yok | ✅ Geçti | `/app/.env` yok, imaj genelinde hiçbir `.env` izi yok · **kontrol:** aynı glob `pack*`'te çıkış 0 |
| 16 | Yerel üretim provası hedefsiz: geçerli talep `503 no-sink` alıyor, hiçbir depoya satır yazılmıyor | ✅ Geçti | geçerli talep → `503 no-sink`; log «Depo yapılandırması eksik, kayıt denenmedi» · **kontrol:** `{}` → 422 (istek yolu sağlam) |
| 17 | Sırlar istemci paketine sızmıyor — üretim çıktısında token, tuz ya da API anahtarı yok | ✅ Geçti | `.next/static`'te 64-hex 0, anahtar adı 0 · **kontrol:** «alpfitplus» 3 dosyada bulunuyor |
| 18 | 320/360/390/412 px'te gönderim sonrası onay kutusu tam görünür ve yapışkan başlığın arkasında değil | ✅ Geçti | kanal: UAT · 4/4 genişlikte kutu tam görünür, üst kenarı tam **88 px** (= `scroll-padding-top`), odak `role=status` |
| 19 | Aynı dört genişlikte hatalı alan görsel işaret alıyor ve hata metni alanın hemen altında görünüyor | ✅ Geçti | kanal: UAT · 12/12 alan-eşlenen hâlde tek alan işaretli (yanlış alarm yok), görsel fark var, alan metni görünür, **kırık `aria-describedby` 0** |
| 20 | Odak hata türüne göre doğru yere gidiyor: boş alan · dolu-ama-bozuk alan · hata kutusu | ✅ Geçti | kanal: UAT · **16/16** odak doğru hedefte (boş alan · dolu-bozuk alan · hata kutusu) |
| 21 | Genel hata kutusu ve WhatsApp yedeği duruyor — hata anında bile talep yolu açık | ✅ Geçti | 16/16 hata hâlinde özet kutusu ve WhatsApp bağlantısı duruyor |
| 22 | Fiyat hesaplayıcısının mobil ana çağrısı altı rotada ≥ 52 px | ✅ Geçti | kanal: UAT · altı rotada 2'şer CTA, **12/12 örnek 52 px** |
| 23 | Talep sahibine onay e-postası gidiyor; `notify_lead` üç değerin doğrusunu taşıyor (`sent` / `skipped` / `failed`), hiçbir kayıt `pending` kalmıyor | ✅ Geçti | **ters-çevirme:** `notify_lead` «sent»e sabitlenince 4 kırmızı — dördü de kendi dalını adıyla söylüyor (failed/skipped/skipped/failed) |
| 24 | Onay gönderimi ziyaretçinin yanıtını değiştirmiyor: üç dalda da aynı `200` ve aynı gövde alanları | ✅ Geçti | aynı ters-çevirmede «uç yine 200 `stored:true`» testi kırmızı verdi → dal gerçekten ölçülüyor |
| 25 | Bal küpü dolu istek: kayıt yok, e-posta yok, HTTP `200` (bot yanıltması korunuyor) | ✅ Geçti | **ters-çevirme:** bal küpü kapısı sökülünce ilgili test kırmızı · canlı uçta bal küpü dolu istek 200, kayıt yok |
| 26 | **Adversarial / güvenlik:** uç, talep sahibinin yazdığı adrese doğrulama yapmadan e-posta gönderiyor mu — ve bunu hangi kapılar sınırlıyor? | ❌ Kaldı | **Uç, ziyaretçinin yazdığı adrese doğrulama yapmadan e-posta gönderiyor.** Doğrulanmış `alpfitplus.com` göndericisinden, selamlamada 120 karaktere kadar istek sahibinin metni. Sınırlayan kapılar ölçüldü: IP başına 10 dk / 5 istek (6. → 429), bal küpü, onay kutusu zorunlu. Adresin sahipliğini gösteren hiçbir kapı yok · **→ TASK-2.21** |
| 27 | Beş ölçüm başlangıç çizgisinin altında: a11y TOPLAM SORUN 0 · yatay kaydırma yok · eksik karakter yok · konsol temiz · ağırlık ve LCP | ✅ Geçti | a11y **TOPLAM SORUN 0** · mobile-audit **9/9 yatay kaydırma yok** (dokunma hedefi 157, taban birebir) · font-guard 16 sayfa / 85.015 karakter, eksik yok · scan `/demo` `/kvkk` `/fiyat` **konsol temiz** · perf 141/132 KB, LCP 88/60 ms, CLS 0,005/0 → çizgi 144/133 KB, 96 ms: **regresyon yok** |
| 28 | `npm test` yeşil, `tsc --noEmit` çıkış 0, üretim derlemesi hatasız | ✅ Geçti | batarya 211+1 · `tsc --noEmit` 0 · `docker compose build web-prod` 0 |
| 29 | Ölçüm yükünde kişisel veri yok; arama sorgusu ölçüme gitmiyor (`data-exclude-search`) | ✅ Geçti | **gerçek tarayıcıda, önizleme yüzeyinde:** `script.js` yüklendi, `data-website-id` VAR, `data-tag=preview`, `data-exclude-search="true"`, dış istek yalnız kendi Umami'miz (2 adet). ⚠️ curl sondası `afterInteractive` betiğini **göremiyor** — kör kalıyordu |
| 30 | Hata mesajları hedef adresini, dosya yolunu ya da anahtarı sızdırmıyor | ✅ Geçti | beş hata gövdesinde (422 ×3 · 400 · 503) hedef adresi, dosya yolu ya da anahtar yok |

---

### Otomatik Kontroller (Adım 1)

- **CI/CD yok** (M6 F6.3 gelecek) — `.github/workflows/` bulunmuyor. Bu repoda push sonrası tek otomatik sinyal **Vercel derlemesidir**: son 14 dağıtımın 14'ü de `Ready`, başarısız dağıtım yok.
- **Bağımlılık/güvenlik botu kurulu değil.** `npm audit` → **0 açık**. `npm outdated` dokuz paketi geride gösteriyor — kayıt zaten `BULGULAR.md` → Gelen Kutusu'nda (`[PHASE-1]`), ikinci satır açılmadı.
- **Güvenlik taraması (faz penceresi `e31331f..HEAD`, 27 commit / 96 dosya):** enjeksiyon (SQL/komut/yol), yetki atlaması, gömülü sır ve hassas veri loglaması **bulunmadı** — `console.error` çağrılarının hiçbiri IP, token ya da e-posta taşımıyor; `.next/static`'te sır izi yok; `cleanLine` C0 kontrol karakterlerini ayıklıyor, onay e-postası düz metin. **Bir bulgu çıktı:** senaryo 26 (aşağıda → TASK-2.21).
- **Artefakt süpürmesi:** fazın tanıttığı üç ortak kapı için *atlayan çağrı sitesi* arandı — yetenek tek kaynağı (altı tüketicinin altısı bağlı, kanıt komutu `src/`'de 0), görsel denetim (hattın tek girişi `render-product.mjs`, yedi ekranın yedisi denetimden geçiyor), `CONTACT.support` tek kaynağı (`src/`'de elle yazılmış adres yok). Atlayan site **bulunmadı**.
- **Kayıt süpürmesi:** Gelen Kutusu'nun bu faza dokunan satırları ve işaretsiz açık bulgular incelendi; çözülmüş çıkan olmadı. **B-013 yarı kapandı** — compose yorumundaki yanlış port (3001 → 3100) TASK-2.02'de düzeldi, `README.md:26` hâlâ 3001 diyor ve `--build` taşımıyor; atom tam kapanmadığı için mezun edilmedi.

---

