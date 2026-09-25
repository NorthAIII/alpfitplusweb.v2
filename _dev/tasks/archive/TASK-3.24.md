# TASK-3.24: (koşullu) Diyetisyen ve antrenör telefon ekranları üretilir

**Durum:** ❌ İptal — ön koşul sağlanmadı (ölçüldü 2026-09-25), kullanıcı kararıyla iptal edildi
**Modül:** M5 — Görsel Varlık Hattı (modules/M5-Gorsel-Varlik-Hatti.md)
**Feature:** F5.1 Ürün ekran görüntüsü hattı · F2.1 Ana sayfa (Roller)
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.15 ✅ · **ürün deposuna iki ekranın eklenmiş olması (kullanıcıya bağlı)**

---

## Hedef

Ürünün demo destesine **diyetisyen** ve **antrenör telefonu** ekranları eklendiyse, görsel hattı ikisini de olağan biçimde üretir ve temizler; `Roles` eşlemesi ve rol `device` değerleri gerçeğe çekilir. Diyetisyen sekmesi ödünç görselden kurtulur, antrenör sekmesi telefon çerçevesinde gerçek bir telefon ekranı gösterir.

**⚠️ Bu task koşulludur ve fazı kilitlemez.** Ekranlar gelmediyse task **❌ İptal** işaretlenir, faz kapanır, ve B-046'nın iki ayağı kanvasta **açık** durur — "bilinçli tercih" kaydı yazılmaz.

---

## Bağlam

Kullanıcı kararı (PHASE-3 → Teknik Kararlar): *"Antrenör ve diyetisyen ekranları birlikte istenir: ürünün demo destesine iki ekran eklenecek, görsel hattı ikisini de olağan biçimde üretecek. Faz bu adıma kilitlenmez."*

**Neden iki ekran, bir değil** (araştırmada büyüdü): ürünün demo destesi tarandı — `.phone` yüzeyi **üç** dosyada var (`takvim.html` → üye, `grup.html` → üye, `patron-mobil.html` → patron). **Antrenör telefonu yok.** Antrenör rolü `device: "mobil"` olduğu için tek satırlık eşleme düzeltmesinden sonra da telefon çerçevesinde masaüstü panosu durur.

**Neden diyetisyen ayrıca ağır:** `docs/CLAIMS.md` diyetisyen modülünü ürünün **tek "gerçek fark"ı** sayıyor (18 rakip üründe görülmedi) ve sitede o farkın kendi görüntüsü yok. Ürünün kendisinde diyetisyen ekranları var (`../Alpfit.v1/web/src/pages/DietitianMembersPage.tsx` vb.) — eksik olan demo destesi.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` — kalem (2) ve triyaj kaydı
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` — F5.1 kabul kriterleri ve sızıntı denetiminin dört dalı
- `_dev/docs/CLAIMS.md` — sızıntı denetimi, yasaklı ad/iddia sözlükleri
- `_dev/tasks/archive/TASK-3.15.md` — geçici çerçeve çözümü (geri alınacak)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/BULGULAR.md` — B-046'nın iki ayağı (kapanırsa çözüm kaydıyla)

---

## Alt Görevler

- [x] **0. Ön koşulu doğrula** — **ölçüldü 2026-09-25: İKİSİ DE YOK** (döküm → Oturum Kaydı). Task ❌ İptal edildi, alt görev 1-4 koşulmadı.
  - `../Alpfit.v1/demo/` altında diyetisyen ve antrenör telefonu ekranları var mı — yoksa task ❌ İptal edilir, gerekçe Oturum Kaydı'na yazılır, faz kapanışı engellenmez

- [ ] **1. Hattı koştur** — ⛔ koşulmadı (ön koşul sağlanmadı)
  - `docker compose --profile research run --rm research node scripts/render-product.mjs` (ürün deposu `:ro` mount ile)
  - Temizlik tablosu yeni ekranların ad/semt/marka/iddia kalemlerini kapsıyor mu — kapsamıyorsa tablo genişletilir

- [ ] **2. `shots.ts`'e yeni anahtarlar ve alt metinler** — ⛔ koşulmadı
  - Alt metin ekranın gerçekten gösterdiğini anlatır (iddia sınırı)

- [ ] **3. `Roles` eşlemesini ve `device` değerlerini gerçeğe çek** — ⛔ koşulmadı
  - TASK-3.15'in geçici çerçeve çözümü geri alınır; antrenör `device: "mobil"` ve gerçek telefon ekranı, diyetisyen kendi ekranı

- [ ] **4. Kabul kriterini güncelle** — ⛔ koşulmadı (F5.1 çıktı sayısı **7'de kaldı**)
  - F5.1 çıktı sayısı 7'den artar — `modules/M5-Gorsel-Varlik-Hatti.md` kriteri yeni sayıya çekilir

---

## Etkilenen Dosyalar

```
research/lib/screen-cleanup*.mjs          # temizlik tablosu genişlerse
public/product/*.webp                     # YENİ — betik çıktısı, elle konmaz
src/content/shots.ts                      # yeni anahtarlar ve alt metinler
src/components/sections/Roles.tsx         # eşleme + geçici çözümün geri alınması
src/content/product.ts                    # rol device değerleri
```

---

## Dikkat Noktaları

- **`../Alpfit.v1` dokunulmazdır** — salt okunur; ekranları kullanıcı ekler, bu oturum o depoya yazmaz.
- **Ürün görselleri elle konmaz.** `render-product.mjs` üretir; sızıntı kalırsa **üretim durur** (dört dallı denetim: ad, avatar baş harfi, eski marka, iddia).
- **Yeni ekran yeni sızıntı sınıfı getirebilir** — temizlik tablosuna satır girdiğinde yasaklı ad kümesi kendiliğinden büyür (TASK-2.14'ün deseni). `AUDIT_ALLOW` yalnız ikincil dalı kapatır.
- **Ad tablosu ile iddia tablosu ayrıdır** (`REPLACEMENTS` ↔ `CLAIM_REPLACEMENTS`) — iddia cümlesini ad tablosuna koyma; ölçüldü, yedi ekranı kırmızıya düşürüyor.
- **İddia sınırı:** yeni ekranlar ürünün bugün taşımadığı bir yeteneği göstermemeli; `CAPABILITIES.simdi` kapısı (`tests/capabilities.test.ts`) ve iddia sözlüğü (`research/lib/claim-leak.mjs`) bunu ölçer.
- **Gelmezse "bilinçli tercih" kaydı YAZILMAZ** — sonraki denetimlere yanlışlıkla "kapandı" sinyali verirdi.

---

## Test Kriterleri

- [ ] `render-product.mjs` sızıntı bulmadan tamamlandı; çıktı sayısı ve dosya adları task dokümanında
- [ ] Yeni ekranlarda eski marka, gerçek sporcu/semt adı ve karşılanmayan iddia yok (denetimin dört dalı da geçti)
- [ ] Antrenör sekmesi telefon çerçevesinde gerçek bir telefon ekranı gösteriyor (elle tıklanarak doğrulandı)
- [ ] Diyetisyen sekmesi kendi ekranını gösteriyor ve alt metni onu anlatıyor
- [ ] `docker compose exec web npm test` geçiyor (yetenek/iddia kapıları)
- [ ] `a11y.mjs` · `mobile-audit.mjs` · `font-guard.mjs` · `scan.mjs` temiz
- [ ] Sayfa ağırlığı ölçüldü (`perf.mjs`) — iki yeni görsel eklendi

---

## Risk ve Geri Dönüş Planı

- **Ekranlar gelmezse:** task ❌ İptal; TASK-3.15'in geçici çözümü yerinde kalır; B-046'nın iki ayağı kanvasta açık durur. Faz kapanışı etkilenmez.
- **Rollback:** üretilen görseller betik çıktısıdır; eşleme değişiklikleri dosya bazlı geri alınır.

---

## Tamamlanma Kriterleri

- [x] Tüm alt görevler tamamlandı (**ya da ön koşul sağlanmadığı için ❌ İptal edildi ve gerekçe yazıldı** — bu ayak işledi)
- [ ] Tüm test kriterleri karşılandı — ⛔ **düştü:** hiçbiri koşulamaz, ölçülecek çıktı üretilmedi
- [x] Git commit & push yapıldı (conventional commits formatı)
- [x] Bu doküman güncellendi (oturum kaydı)
- [x] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — 2026-09-25

**Durum:** ❌ İptal

**Yapılanlar:**
- **Alt görev 0 koşuldu ve ön koşul ÖLÇÜLDÜ — varsayılmadı.** `../Alpfit.v1/demo/` salt okunur biçimde tarandı (tek bayt yazılmadı): deste **13 HTML** taşıyor — 11 ekran yakalaması (`antrenor` · `takvim` · `grup` · `raporlar` · `finans` · `cockpit` · `sube` · `uye` · `churn` · `kampanya` · `patron-mobil`), `index.html` ve iki sunum dosyası (`sunum.html` · `sunum-tanitim.html`). **İki ekranın ikisi de YOK:**
  - **Diyetisyen ekranı yok.** `diyetisyen.html` diye bir dosya yok. "Diyetisyen" dizesi destede dört sınıfta geçiyor ve **hiçbiri bir ekran değil**: (a) 11 panel dosyasının hepsinde `:75`'teki kenar çubuğu menü kalemi `Diyetisyenler</a`; (b) `uye.html`'de veri alanı — `:420` `<span class="k">Diyetisyen</span><span class="v">Adem Bona</span>` ve `:488` `<h3>Diyetisyen Notu</h3>`; (c) baş sayısı satırları — `cockpit.html:208` *"+ 4 diyetisyen · 3 müdür"*, `sube.html:224` *"+ 1 diyetisyen · 1 müdür"*; (d) sunum slaytları (`sunum.html:557` *"4 rol: Üye · Antrenör · Diyetisyen · Yönetim"*, `:618` `<h3>Diyetisyen</h3>`). Yani ürünün rolü destede **anlatılıyor**, ekranı **yakalanmamış**.
  - **Antrenör telefonu yok.** `.phone` yüzeyi **tam üç** dosyada: `takvim.html` (1) · `grup.html` (1) · `patron-mobil.html` (1) — araştırmanın 2026-09-23'te ölçtüğü üçlünün aynısı. `antrenor.html` → **0**. Hattın bugün ürettiği tek telefon karesi de bunlardan türüyor (`render-product.mjs:50` → `uye-telefon.webp`, kaynağı `takvim.html`, `root: '.phone'`).
- **Destenin dokunulmadığı ölçüldü:** `git log -1 -- demo/` → `1fdeac3` *"chore: rebrand demo site Alpfit → Weekend Plus"*, **2026-06-21**; `git status --porcelain -- demo/` **boş** — yeni ya da izlenmeyen dosya yok. Yani deste araştırma turundan (2026-09-23) bu yana ve kullanıcının kararından önce **hiç değişmedi**; ön koşul geçici değil **kalıcı olarak** sağlanmadı.
- **TASK-3.15'in devrettiği iddia bağımsız olarak DOĞRULANDI ve dizesi düzeltildi.** T15 *"masaüstü yakalamalarının HEPSİ yönetim panelidir"* diyordu; kaynak tarafında ölçüldü ve doğru çıktı — **11 yakalamanın 11'i de aynı `class="userbox"` kabuğunu ve aynı rol etiketini taşıyor: `class="ur">Kadıköy Müdürü`.** Yani `antrenor.html` (`<title>` *"Antrenör Performansı"*, `<h1>` *"Antrenör Detayı"*) antrenörün kendi yüzeyi değil, **şube müdürünün antrenöre bakan ekranıdır**. ⚠️ **T15'in dizesi yalnız ÜRETİLEN karede geçerli:** kaynakta `YÖNETİM` ve `Zehra G. · Şube Müdürü` dizeleri **hiç yok** (grep → 0); onları `render-product.mjs`'in temizlik tablosu üretiyor (`Kadıköy` gerçek bir semt adı ve sızıntı denetiminin kapsamında). Olgu aynı, çapası farklı — sonraki turlar kaynakta `YÖNETİM` aramamalı.

**Sorunlar:**
- Yok. Ön koşul ölçülebildi, ölçüm kesin sonuç verdi ve karar zaten alınmıştı.

**Kararlar:**
- **KULLANICI KARARI (2026-09-25): *"İptal et, faza devam."*** Ekranları ürün deposuna ekleyecek olan kullanıcıydı (`../Alpfit.v1` bu oturumların **salt okunur** deposu — CLAUDE.md → Dokunulmazlar) ve eklemeyeceğine karar verdi. Task ❌ İptal; faz `verify-phase`'e geçer. **Ekranlar sonradan gelirse iş ayrı bir quick turudur** — bu task yeniden açılmaz, yeni task da yazılmaz (run-task task doğurmaz).
- **Bu bir "yapılmadı" kaydı değil, bir KARAR kaydıdır.** Gerekçesi *"ön koşul kalıcı olarak sağlanmadı + kullanıcı iptal etti"* ve ikisi de yukarıda ölçümüyle duruyor; kaydı okuyanın *"neden yapılmadı"* diye sormasına gerek kalmamalı.
- **B-046'nın diyetisyen ayağı kanvasta AÇIK kalır ve "bilinçli tercih" kaydı YAZILMAZ.** Task dokümanının kendi Dikkat Noktası bunu adıyla emrediyor: *"sonraki denetimlere yanlışlıkla 'kapandı' sinyali verirdi."* Sitenin tek *"gerçek fark"*ının (`docs/CLAIMS.md` → diyetisyen modülü, 18 rakip üründe görülmedi) kendi görüntüsü hâlâ yok ve bu bir açık borçtur, kapanmış bir tercih değil.
- **TASK-3.15'in geçici çözümü yerinde kalır** — Diyetisyen sekmesi `SHOTS.grup`'u göstermeye devam eder (alt metni görüntüde gerçekten duranı anlatıyor, sekmeyle çelişmiyor); antrenör sekmesi `SHOTS.antrenor` + orandan türeyen çerçeveyi korur. Hiçbir kod dosyasına dokunulmadı.
- **F5.1'in çıktı sayısı 7'de kaldı** — `modules/M5-Gorsel-Varlik-Hatti.md`'nin kabul kriteri **doğru olduğu gibi** duruyor, düzeltme gerekmiyor (alt görev 4 tam bu yüzden koşulmadı).
- docs/DECISIONS.md'ye eklendi: **Hayır.** Ölçü *geri dönüşün maliyeti* (CLAUDE.md → Bilginin Doğru Evi): bu karar bir sözleşme (ad/şema/API), bir anlam ya da biriken verinin yorumunu değiştirmiyor — ekranlar geldiği gün iş izsiz açılır. Kararın evi bu Oturum Kaydı + B-046'nın Çözüm Kaydı.

**Kalan İşler:**
- **Ürün deposunun demo destesine iki ekran eklenmesi** — diyetisyen ekranı ve antrenörün kendi telefon yüzeyi. Tetiği kullanıcı çeker, rotası **ayrı bir `/devflow:quick` turu**; eklendiği gün `render-product.mjs` ikisini de olağan biçimde üretir ve temizler. Kayıt: `bulgular/B-046-gorsel-teslim-katmani.md` → Çözüm Kaydı + `BULGULAR.md` → Gelen Kutusu.

**Son Yaklaşım:** — (pause değil, iptal; devam edilecek bir iş bırakılmadı)

**Sonraki Adım Detayı:** — (task yeniden açılmaz; ekranlar gelirse ayrı quick turu)

**Dosya Değişiklikleri:**
- **Kod dosyası değişmedi — sıfır.** `src/`, `public/`, `research/` altında tek bayt oynamadı (`git status --porcelain -- src/ public/ research/` → boş).
- `_dev/tasks/TASK-3.24.md` → ❌ İptal, bu oturum kaydı, alt görev ve tamamlanma kriteri işaretleri (sonra `tasks/archive/`e taşındı)
- `_dev/DURUM.md` → Aktif Task, Task Durumu tablosu (3.24 ❌), **Adım `task` → `verify`**, İlerleme, Son Task Özetleri, Son Güncelleme, Hızlı Erişim
- `_dev/phases/PHASE-3.md` → Task Listesi'nde 3.24 ❌ İptal + gerekçe satırı
- `_dev/bulgular/B-046-gorsel-teslim-katmani.md` → Çözüm Kaydı'na diyetisyen ayağının **açık kaldığı** ve kararın kaydı
- `_dev/BULGULAR.md` → B-046 kancası tazelendi, Gelen Kutusu'na iki ekranın quick rotası düştü, Son Güncelleme

**Test Sonuçları:**
<!-- Task ❌ İptal edildi ve hiçbir çıktı üretmedi; dokümanın Test Kriterleri'nin sekizi de koşulamaz (ölçülecek görsel, eşleme ya da kabul kriteri yok). Aşağıdakiler task'ın testi DEĞİL, fazın kapanışına giden rakamların teyidi. -->
- **Task'ın kendi test kriterleri KOŞULAMADI ve bu bir atlama değil, konusuzluktur** — sekiz kriterin sekizi de üretilecek görselin varlığına bağlı (`render-product.mjs` çıktısı, yeni alt metinler, sekmenin elle tıklanması); üretilecek görsel olmadığı için ölçülecek bir şey yok. Kod değişmediği için regresyon riski de yok.
- **Fazın kapanışına giden rakamlar teyit edildi (regresyon kontrolü, üçü de birebir):** `mobile-audit` 3100, 2 genişlik × 16 rota → **TOPLAM SORUN 0 · çıkış 0 · ✓ KAPI YEŞİL**; altı kapsam tabanının hiçbiri oynamadı (eleman **6253** · metin elemanı **2054** (taban 2054) · kritik hedef **305/0/0** (taban 305) · kap **5** (taban 5) · dokunma hedefi **638** · gezinme **333/261** → alt bilgi 256 · içerik yolu 4 · gövde metni 1 · kırpma **0** · şerit **0**). `a11y` 16 rota → **6 sorun · çıkış 1 · ✗ KAPI KIRMIZI** (beklenen hâl: altısı `/gecis`'in adlandıran task'ı olmayan kontrast kalemleri); 105 ekran adımı / **1834** eleman / gradyan **19-0** (taban 19) / başlık **316-0** (taban 316) / `alt'sız img: 0` / ölçülemeyen: yapışkan borcu 151 (B-063, kapsam dışı) · görünmez 43 · **kalan 0**. `docker compose exec web npm test` → **219 geçti + 2 atlandı** (iki env kapısı kapalı — beklenen).
- **Kapsam:** yargı **yayın kopyası (3100)**. **3100 tazelenmedi — gerekmedi ve bu ölçüldü:** site haritası `lastmod` **2026-09-25T01:05:55.970Z** = TASK-3.22'nin damgası (`src/`+`public/`'e son dokunan commit `632f99e`; T3.23'ün commit'i yalnız bir ölçüm betiğine dokundu, imaja girmez), pozitif kontrol `/` → `-sm.webp` × **68** (T24'ün ölçtüğü değerle birebir), negatif kontrol `salon-genis.webp` → **0**.
- **Ölçümün kendisi (ön koşul) yerelde ve salt okunur koşuldu:** `ls` · `grep` · `git log` · `git status` — `../Alpfit.v1/`'e tek bayt yazılmadı.

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** 2026-09-25 — ❌ **İptal** (tamamlanmadı; ön koşul kalıcı olarak sağlanmadı)

**Ne Yapıldı:**
- Ön koşul ölçüldü: ürünün demo destesinde **ne diyetisyen ekranı ne antrenör telefonu var** ve deste 2026-06-21'den beri hiç değişmemiş. Kullanıcı *"iptal et, faza devam"* dedi; task ❌ İptal işaretlendi, hiçbir kod dosyasına dokunulmadı.
- B-046'nın **diyetisyen ayağı kanvasta açık bırakıldı** — "bilinçli tercih" kaydı bilinçle yazılmadı; iki ekran eklenirse iş ayrı bir quick turudur.
- Fazın 25 task'ının tamamı kapandı (**24 ✅ + 1 ❌**); DURUM'un `Adım` alanı `verify`'a çekildi.

**Öğrenilenler:**
- **Koşullu bir task'ın iptali de ölçüm ister.** "Gelmedi" bir izlenimdir; *"deste 13 dosya, `.phone` üçünde, `diyetisyen.html` yok, git son dokunuş 2026-06-21, izlenmeyen dosya yok"* bir ölçümdür — ve yalnız ikincisi sonraki turun aynı soruyu yeniden sormasını önler.
- **Devralınan bir çapa doğru olgu için yanlış dize taşıyabilir.** T15'in *"yakalamaların hepsi yönetim paneli"* tespiti doğrulandı, ama kanıt dizesi (`YÖNETİM` · `Zehra G. · Şube Müdürü`) yalnız **üretilen** karede var; kaynakta karşılığı `class="ur">Kadıköy Müdürü`. Temizlik tablosundan geçen bir varlıkta kaynak ile çıktı **ayrı çapa kümesidir** — biri diğerinin yerine geçmez.

---

**Oluşturulma:** 2026-09-23
