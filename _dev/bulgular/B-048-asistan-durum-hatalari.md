# B-048: Asistanda durum bozan yarış koşulu, mobilde okunmayan cevap ve JS kapalıyken hayalet düğmeler

**Önem:** 🟡 | **Tip:** hata | **Alan:** M4 — Site asistanı (`src/components/layout/Assistant.tsx`)
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `modules/M4-Site-Asistani.md` → F4.1: *"Her konu tıklanınca cevap ve bağlantılar görünür; çıkışsız düğüm yok"*, *"Klavyeyle açılır, kapanır, gezilir"*, edge-case: *"**JavaScript kapalıysa asistan görünmez**, sayfa çalışır."*

**Gözlenen — üç kalem.**

**(1) `reset()` bekleyen zamanlayıcıyı iptal etmiyor → durum bozuluyor.**
`ask()` (`:64-76`) cevabı 420 ms'lik bir `window.setTimeout` ile kuyruğa alıyor ve **tutamacı saklamıyor**; `reset()` (`:78-81`) yalnız `msgs` ve `chips`'i set ediyor, ne `typing`'i sıfırlıyor ne zamanlayıcıyı iptal ediyor. "Baştan" düğmesi o 420 ms boyunca ekranda duruyor, yani senaryo **gerçek bir kullanıcı için erişilebilir**. Ölçülen sonuç (iki kırılımda da aynı) — chip'e bas, 120 ms sonra "Baştan"a bas:
```
bot  = [intro1, intro2, "v1 hazır ve şu anda bir stüdyoda pilot…", "Kampanya derinleşmesi…", "Pilot sonucumuz…"]
user = []                                          ← sorusu olmayan YETİM cevap
chip = ["Verilerim nerede duruyor?", "Ücretsiz deneme var mı?"]   ← kök küme kayboldu
```
Yani sıfırlanmış açılış ekranına sorusu olmayan bir cevap düşüyor **ve** kök chip kümesi `asama.next` ile değişiyor — `donanim`, `fiyat`, `mobil`, `kurulum` bir daha erişilemez hâle geliyor.
Aynı kökün ikinci yüzü: `ask()`'ta `typing` muhafızı yok, yani aynı tick'te iki farklı chip işlenirse iki soru ve iki cevap üst üste gelip eşleşme bozuluyor (gerçek fareyle erişilmesi zor — chip'ler `setChips([])` ile anında sökülüyor; aynı chip'e hızlı çift tık **güvenli**, ölçüldü: tek kullanıcı balonu).

**(2) Mobilde `asama` düğümünün cevabı ekranda görünmüyor.** 20 ölçümün 19'unda akış dibe kayıyor (`atBottom: true`); tek istisna mobilde `asama`: son mesaj bloğu akış penceresinden **62 px yüksek** (`clientH` 298, blok ≈360), `sonMesajGörünür: false` — cevap gelir gelmez ilk paragrafı yukarıda kalıyor. Masaüstünde sınırda geçiyor (−8 px). Bu, [B-017](B-017-asistan-erisilebilirlik-katmani-eksik.md)'nin "akış `tabIndex:-1`, klavyeyle kaydırılamaz" bulgusuyla **bileşik**: klavye kullanıcısı o cevabın başını hiç okuyamıyor.

**(3) JS kapalıyken asistanın iki tetiği SSR çıktısında duruyor ve `inert` değil.** F4.1'in edge-case'i **göze** uyuyor (panel DOM'da hiç yok, sayfa çalışıyor ✓) ama erişilebilirlik ağacına uymuyor:
```
javaScriptEnabled:false, /  →  fab kapsayıcı 1 · buton 1 · WhatsApp bağlantısı 1
SSR HTML: <div class="fixed bottom-5 right-5 … pointer-events-none translate-y-4 opacity-0">
            <a href="https://wa.me/…" aria-label="WhatsApp'tan yazın">
            <button aria-expanded="false" aria-controls="asistan-panel" aria-label="Asistana sor">
  → inert / aria-hidden / hidden / tabindex="-1" YOK
```
Yani JS kapalı bir klavye ya da ekran-okuyucu kullanıcısı **görünmez** bir "Asistana sor" düğmesine odaklanabiliyor (Enter hiçbir şey yapmaz) ve **görünmez bir WhatsApp bağlantısına Enter basıp `wa.me`'ye gidebiliyor**. B-017 bu iki hayalet düğmeyi JS açıkken saptamıştı; JS kapalıyken bunlar asistanın **tek** hâli oluyor. Playwright ikisini de `isVisible() = true` ve gerçek kutulu (`54×52 @ 316,788`) görüyor — `opacity:0` erişilebilirlik ağacından düşürmüyor.
Aynı sınıftan küçük bir kalem: launcher `aria-controls="asistan-panel"` taşıyor ama panel koşullu render edildiği için **kapalı durumda o id DOM'da yok** (ölçüldü: `hedefVar: false`) — B-017'nin `role="dialog"` listesinde bu madde yok.

**Ağacın ve panelin doğru yaptıkları ayrıca kaydedilir — tam gezinti yapıldı.** 10 düğüm iki kırılımda da **10/10 doğru render ediyor**, 0 başarısız: kullanıcı balonu `topic.q`, bot paragrafları `topic.a` birebir, link href'leri ve chip kümeleri beklenen değerde. Kodda var olup arayüzde görünmeyen dal **yok**, arayüzde çıkmaz sokak **yok**; ulaşılamaz düğüm 0, çıkışsız düğüm 0, kırık link referansı 0 (M1 F1.3 ve M4 F4.1 kriterleri geçiyor). "Baştan" boşta tam sıfırlama yapıyor. `/demo` bağlantısı yalnız `deneme` düğümünde ve en uzun yol **3 tık**. İddia sınırı taraması: 47 metin parçası / 3.517 karakter, 28 rakip adı + 9 yasaklı kalıp → **TOPLAM İSABET 0**; `chat.ts` kaynağında 3+ haneli sayı literali **0**, tüm rakamlar `PRICING`/`monthlyFor()`'dan. Asistan hiçbir ağ isteği yapmıyor (20 düğüm gezintisinde tek istek çıkmadı).

## Kanıt

```
$ sed -n '64,81p' src/components/layout/Assistant.tsx
  64: function ask(id) { … setTyping(true); window.setTimeout(() => { … }, 420); }   ← tutamaç saklanmıyor
  78: function reset() { setMsgs([…CHAT_INTRO]); setChips(CHAT_ROOT); }              ← typing ve timeout dokunulmuyor

$ curl -s http://localhost:3000/kvkk | grep -o 'aria-label="Asistana sor"'
  → SSR çıktısında var (opacity-0 pointer-events-none sarmalayıcı içinde, inert yok)

mobil `asama`: clientH=298 · blok≈360 · atBottom=false · sonMesajGörünür=false
```
Gezinti, yarış ve JS-kapalı koşumları scratchpad'de (`asistan-gezinti.mjs`, `asistan-rotalar.mjs`, `asistan-klavye.mjs`).

## Kök Neden Yönü

Üçü de **durum ve görünürlüğün iki ayrı yerde tutulmasından** doğuyor. `ask()` zaman-gecikmeli bir yan etki kuruyor ama `reset()` o yan etkiden habersiz — React'te klasik iptal-edilmemiş zamanlayıcı deseni. Akış kaydırması `useEffect` ile `msgs` değişiminde tetikleniyor ama blok yüksekliği o anda henüz ölçülmemiş olabiliyor. Ve görünürlük **yalnız görsel katmanda** (`opacity` + `pointer-events`) kurulmuş; erişilebilirlik ağacı ve klavye için karşılığı (`inert`) hiç eklenmemiş — B-017 bunu bir kalem olarak kaydetmişti, JS-kapalı hâl aynı eksikliğin en keskin sonucu.

## Koruma Önerisi

- `ask()` zamanlayıcı tutamacını bir ref'te tutar; `reset()` onu `clearTimeout` eder ve `typing`'i sıfırlar. `ask()` başına `if (typing) return` muhafızı ikinci yüzü de kapatır.
- Akış kaydırması `msgs` değişiminden sonra **blok yüksekliği ölçüldükten** sonra tetiklenir (ör. `requestAnimationFrame` ya da `scrollIntoView` son mesaj öğesine) ve akış kutusu `tabIndex={0}` alır (B-017'nin aynı kalemi) — ikisi birlikte mobilde `asama` cevabının okunabilirliğini bitiriyor.
- Yüzen düğme sarmalayıcısı gizli hâlde `inert` alır (B-017'nin önerdiği tek satır). Bu, JS açıkken iki hayalet tab durağını, JS kapalıyken asistanın tamamını erişilebilirlik ağacından düşürür ve F4.1'in edge-case'i tam anlamıyla karşılanır.
- `aria-controls` ya panel her zaman render edilip `hidden` ile gizlenerek gerçek bir hedefe bağlanır ya kapalı durumda özniteliği kaldırılır.
- Kalıcı koruma [B-015](B-015-kalite-kapilari-etkilesim-durumunu-olcmuyor.md)'in kendisidir: kapı paneli açık durumda ölçmeye başlarsa bu sınıf bir daha sessizce giremez. Yarış koşulu için ek olarak tek bir etkileşim senaryosu yeter ("chip → 120 ms → Baştan → kök chip kümesi bekleniyor").

## Çözüm Kaydı

—
