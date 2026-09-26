# B-022: Mobilde ilk ekranda hiçbir dönüşüm yüzeyi yok — fiyat sayfasında 7.678 px boyunca tıklanacak şey yok

**Önem:** 🟡 | **Tip:** öneri-ui-ux / dönüşüm | **Alan:** M2 — Sayfalar ve bölümler (`Header.tsx`, `Assistant.tsx`)
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** ✅ Çözüldü

## Gözlem

**Beklenen:** `ILKELER.md` → En Yüksek Öncelikli Eksenler, 1: *"Dönüşüm — ziyaretçiyi talebe çevirmek."* `QUALITY.md` → 8: *"Her sayfa ve bölümden tek huniye net bir yol var mı?"* Hedef kitle butik kulüp sahipleri; bu kitle siteye ağırlıkla telefondan bakar.

**Gözlenen:** 390 px genişlikte, sayfa açıldığı anda görünen ekranda dört sayfada hiçbir demo/WhatsApp yüzeyi yok:

| Sayfa | İlk ekranda dönüşüm yüzeyi | Sayfa boyu (mobil) |
|---|---|---|
| `/fiyat` | **yok** | 7.678 px |
| `/segmentler` | **yok** | 6.409 px |
| `/demo` | **yok** | 4.412 px |
| `/kvkk`, `/gizlilik`, `/kullanim-kosullari` | **yok** | — |
| `/`, `/ozellikler`, `/gecis`, `/yazilim-secerken`, segment sayfaları | "Demo İste" görünür | — |

İki mekanizma üst üste biniyor:
- Header'daki "Demo İste" + WhatsApp bloğu `hidden … lg:flex` (`Header.tsx:88`) — **1024 px altında hiç render edilmiyor**.
- Yüzen WhatsApp düğmesi ve asistan `scrollY > 480` olana kadar `opacity-0 pointer-events-none` (`Assistant.tsx:42`).

Sonuç: mobilde her zaman görünen tek dönüşüm affordance'ı hamburger düğmesi. Fiyatı görmeye gelen kulüp sahibi, 7.678 px'lik sayfanın tepesinde tıklayacak hiçbir şey bulamıyor — kaydırması gerekiyor, hem de en az 480 px.

**Huninin geri kalanı sağlam** ve bu kaydedilmelidir: 16 sayfanın **hepsinde** huniye çıkış var, 404 ve yasal sayfalar dâhil. Toplanan 15 benzersiz iç bağlantının hepsi 200 dönüyor, kırık bağlantı ve ölü çapa yok, dış bağlantı biçimleri doğru. Sorun yolun varlığı değil, mobilde **ilk anda görünürlüğü**.

## Kanıt

```
$ sed -n '88p' src/components/layout/Header.tsx
   className="hidden items-center gap-2.5 lg:flex"      ← <1024px'te render yok

$ sed -n '42p' src/components/layout/Assistant.tsx
   scrollY > 480                                         ← FAB'ın görünme eşiği
```

Ölçüm: 390×844 Playwright bağlamında her sayfaya gidilip `a[href='/demo'], a[href^='https://wa.me']` düğümlerinden `getBoundingClientRect().top < innerHeight` olanlar sayıldı → yukarıdaki tabloda "yok" yazan sayfalarda sonuç **0**.

İlgili açık soru: ana sayfa mobilde 26.399 px ve uzunluk kararı zaten Gelen Kutusu'nda kullanıcıyı bekliyor (kickoff sorusu). Bu bulgu o kararla **aynı işte** ele alınabilir — mobil ilk ekran ve sayfa uzunluğu aynı deneyimin iki yüzü.

## Kök Neden Yönü

Header masaüstü için tasarlanmış, mobilde yer kazanmak için CTA gizlenmiş; yüzen düğme de "sayfanın tepesinde görsel gürültü olmasın" diye geciktirilmiş. İki tercih ayrı ayrı makul, birlikte mobil ilk ekranı boşaltıyor. İkisinin birleşik etkisini ölçen bir kapı yok.

`STYLE-GUIDE.md`'nin "kullanma" listesinde mobil yapışkan CTA çubuğuna dair bir yasak **yok** — yani bu kalıp kullanıcının reddettikleri arasında değil; ama seçilmiş de değil. Bu yüzden düzeltme yönü kullanıcı kararına bağlı, bulgu olarak kaydediliyor ama çözüm dayatılmıyor.

## Koruma Önerisi

- Seçenekler, en hafiften ağıra: hamburger düğmesinin yanına küçük bir "Demo" bağlantısı; FAB eşiğini düşürmek (480 → ~120 px) ya da mobilde eşiksiz göstermek; mobilde alt yapışkan CTA çubuğu. İlk ikisi tek satırlık değişiklik ve STYLE-GUIDE ile çelişmiyor.
- Kalıcı koruma: mobil kapısı "her sayfada ilk ekranda en az bir dönüşüm yüzeyi var mı" kontrolünü alır. Bugün `mobile-audit.mjs` yalnız taşma ve dokunma hedefi ölçüyor; bu kontrol dönüşüm eksenini ölçülebilir hâle getirir ve ILKELER'in birinci eksenine ilk otomatik kapıyı kazandırır.
- İkincil öneri (aynı işte ucuz): hata anındaki WhatsApp bağlantısı kullanıcının yazdıklarını taşımıyor — `wa.me` adresleri `?text=` parametresi kullanmıyor (`site.ts:19`). Form 503 aldığında kullanıcı ad, kulüp ve telefonunu elle yeniden yazmak zorunda; huninin en kritik kurtarma noktasında.

## Çözüm Kaydı

**Kapandı — Faz 3, TASK-3.16 (ana kalem) + TASK-3.25 (ikincil öneri); çözüm teyidi `verify-phase` 2026-09-26 (UAT senaryo 11 ve 25/26).**

**Ana kalem — Koruma Önerisi'nin "en hafiften ağıra" listesinin ilk iki maddesi uygulandı, üçüncüsü (mobil alt yapışkan CTA çubuğu) kullanıcı kararıyla **istenmedi**:** hamburger'in yanına `lg:` altında görünen sade bir **"Demo"** bağlantısı kondu (etiket "Demo İste" **değil** "Demo" — 320 px'te başlıktaki kap 280 px, logo 132,41 + hamburger 44 alıyor; "Demo İste" satırı taşırdı, "Demo" 11,6 px payla sığıyor) ve yüzen düğmenin görünme eşiği düşürüldü.

**Teyit ölçümü (yayın kopyası 3100, 2026-09-26) — dokuz eksende 16/16, boş ekran 0:**

| Eksen | Boş ekran |
|---|---|
| 320×568 · 390×844 · 412×915 · 768×1024 | 0/16 · 0/16 · 0/16 · 0/16 |
| %200 büyütme 640×512 · %400 büyütme 320×256 | 0/16 · 0/16 |
| yatay 844×390 · yatay 915×412 | 0/16 · 0/16 |
| 1440×900 | 0/16 |

Kullanılabilirlik ölçütü çıplak varlık değil: render edilmiş (`getClientRects()`) · `visibility` görünür · **etkin (ata zinciri çarpımı) opaklık > 0** · `pointer-events` açık · kutusu ilk görüntü penceresini kesiyor. `kontrol:` eksen başına **174 dönüşüm bağlantısı** tarandı — sonda bulamayan bir seçici yüzünden yeşil kalmadı.

⚠️ **Atomun tablosu eksikti ve bu ölçülerek düzeltildi:** kayıt 390 px'te 4 sayfa + 3 yasal sayfa sayıyordu; TASK-3.01'in turu **320 px'te 16 sayfanın 13'ünde** boşluk buldu ve boşluk **412 px'te 6/16, 768 px'te 5/16** olarak da sürüyordu. Düzeltme hepsini birden kapsadı çünkü Header'ın mobil kolu `lg:` altındaki **her** genişlikte görünür.

**İkincil öneri de kapandı — TASK-3.25.** Atom *"hata anındaki WhatsApp bağlantısı kullanıcının yazdıklarını taşımıyor, `wa.me` adresleri `?text=` kullanmıyor"* diyordu. `site.ts`'e `whatsappDraftHref()` eklendi: ad · kulüp · telefon taşınır, `encodeURIComponent`, alan başına 120 karakter tavanı; **taban `CONTACT.whatsapp.href` değişmedi** (ölçüldü: `CONTACT.whatsapp` 12 dosyada 23 kez geçiyor, 15'i `.href` — tabana `?text=` koymak sitedeki her WhatsApp bağlantısına yanlış bir ön-doldurma taşırdı), ön-doldurma **çağrı yerinde** kurulur ve **yalnız 503 `no-sink`** dalında. Kapı `tests/whatsapp-draft.test.ts` (9 test) ve davranıştan ölçer, sabit listeden değil.

⚠️ **Kapsanmayan yüzey — ikincil önerinin açtığı yasal kalem:** ön-doldurulan kişisel veri tıklama anında bir Meta yönlendiricisine (`wa.me`) gidiyor ama `legal.ts` → KVKK → Aktarım **dört tedarikçi** sayıyor (Vercel · Hetzner · Resend · Google Workspace) ve üstündeki cümle koşulsuz olumsuz. Metne **dokunulmadı** (hukuki nitelendirme hukukçunun — B-008). **Kullanıcı kararı bekliyor**, üç seçenek `BULGULAR.md` → Gelen Kutusu `[TASK-3.25 SORU]`'da; site `noindex` önizlemede olduğu için yayını bloke etmiyor ama **yayından önce kapanmalı**.

**Koruma Önerisi'nin kalıcı ayağı GERÇEKLEŞMEDİ ve bu bilinçli:** *"mobil kapısı 'her sayfada ilk ekranda en az bir dönüşüm yüzeyi var mı' kontrolünü alır"* — fazın kapı işi kontrast + kırpma + dokunma hedefiyle sınırlı tutuldu (kapsam kararı), yani bu ölçüm **tek seferliktir** ve kalıcı kapı ayrı bir karardır (evi "Kalite kapıları otomatik" fazı). Kriterin bugünkü hâli `modules/M2-Sayfalar-ve-Bolumler.md` → F2.3'te yazılı.
