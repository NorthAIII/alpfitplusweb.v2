# B-064: `/yazilim-secerken` fiyat serisinde iki etiket üst üste biniyor, dar ekranda okunmaz oluyor

**Önem:** 🟡 | **Tip:** hata / erişilebilirlik-düzen | **Alan:** M2 — Sayfalar ve bölümler (F2.2 Alt sayfalar)
**Kaynak:** TASK-3.01 (genişlik turu) | **Tarih:** 2026-09-24
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → *"Erişilebilirlik WCAG AA'nın altına düşmez."* WCAG 1.4.10 reflow: 320 CSS px'te içerik ve işlev kaybolmadan akmalı. `QUALITY.md` → 7: metin okunabilir olmalı.

**Gözlenen:** `/yazilim-secerken` sayfasındaki fiyat aralığı serisinde (*"Fiyatların yoğunlaştığı aralık"* bölümünün üstündeki şerit) iki metin etiketi **aynı noktadan başlıyor ve üst üste biniyor**:

| Etiket | Konum (390 px) | Kutu | Konumlandırma |
|---|---|---|---|
| `Alpfit Plus 1.800 ₺` | x=48, y=1147 | 126×24 | `static` — sage dolgulu rozet (`bg-sage-wash px-2.5 py-1`) |
| `990 ₺` | x=48, y=1151 | 32×16 | `absolute -bottom-8 left-0 text-xs text-faint` |

İkisi de **x=48**'den başlıyor; soluk `990 ₺` ölçek etiketi rozetin dolgusunun içine düşüyor. Ekranda **"99Alpfit Plus 1.800 ₺"** gibi okunuyor — iki sayı da güvenilir okunmuyor.

**Genişliğe bağlı:** 320 · 390 · 412 px'te var; **768 ve 1440 px'te yok** (şerit genişleyince `990 ₺` rozetin soluna düşüyor). Yani kusur yalnız telefon genişliklerinde görünür.

**Neden bugüne dek görünmedi:** üç katman. (a) Sayfa yatay kaydırma üretmiyor, yani `mobile-audit.mjs`'in tek geçme şartı sağlanıyor ([B-030](B-030-kapilar-kirmiziya-donemiyor.md)). (b) Kırpılma değil **çakışma** olduğu için bu fazın kuracağı kırpma dedektörü de (TASK-3.07) onu görmez — kırpan ata yok, taşma yok. (c) `a11y.mjs` kontrastı ölçer, iki metnin birbirinin üstüne binmesini değil; piksel yöntemi (TASK-3.04) de metin rengini CSS'ten aldığı için üstteki glifi ayırt etmez.

## Kanıt

TASK-3.01 genişlik turu, 16 rota × 5 genişlik. Tur çıktısı (`ustuste_binen` kovası):

```
[3] "Alpfit Plus 1.800 ₺"  <>  "990 ₺"   oran=1.00
    yol: div.mt-12.rounded-lg.bg-surface > div.relative.mt-10.mb-16
         > div.absolute.-top-1.flex > span.mt-2.whitespace-nowrap…
    yer: 320px /yazilim-secerken · 390px /yazilim-secerken · 412px /yazilim-secerken
```

`oran=1.00` = küçük öğenin (32×16) alanının **tamamı** büyük öğenin sınır kutusunun içinde.

Sonda ölçümü (390×844, hareket azaltma):
```
{"txt":"Alpfit Plus 1.800 ₺","x":48,"y":1147,"w":126,"h":24,"pos":"static",
 "cls":"mt-2 whitespace-nowrap rounded-lg bg-sage-wash px-2.5 py-1 text-xs fon…"}
{"txt":"990 ₺","x":48,"y":1151,"w":32,"h":16,"pos":"absolute",
 "cls":"absolute -bottom-8 left-0 text-xs text-faint"}
```

Görsel teyit: hedef bölgeye kaydırılıp kırpılan ekran görüntüsünde çakışma gözle doğrulandı (oturum scratchpad'i; `git` dışı).

⚠️ Satır numarası verilmedi — çapa **sınıf dizisi ve metindir**; `grep -n "990\|bg-sage-wash" src/app/yazilim-secerken/page.tsx` ile konumlan (faz ilerledikçe satırlar kayar).

## Kök Neden Yönü

Ölçek etiketi (`990 ₺` = serinin alt ucu) `absolute … left-0` ile şeridin soluna çivilenmiş; işaretçi rozeti ise şerit üzerinde **değere göre** konumlanıyor. Dar ekranda şerit kısaldıkça işaretçi sola kayıyor ve sabit duran ölçek etiketiyle aynı yere geliyor. İki konumlandırma sistemi (akış + mutlak) aynı görsel bantta çakışma denetimi olmadan kullanılmış.

Aynı sınıf [B-033](B-033-320px-kurucu-programi-icerik-kaybi.md) ile akraba (dar ekranda düzen kusuru) ama mekanizması farklı: orada `min-content` taşması + `overflow-hidden`, burada mutlak konumlanmış iki etiketin çakışması.

## Koruma Önerisi

- Dar ekranda ölçek etiketlerinin (`990 ₺` / üst uç) işaretçi rozetiyle çakışmaması için: ölçek etiketleri `sm:` altında gizlenir, ya da rozet ölçek satırının **üstüne** ayrı bir satıra alınır, ya da işaretçinin minimum sol konumu ölçek etiketinin genişliği kadar itilir.
- **Kalıcı koruma — bu fazın kapılarının hiçbiri bu sınıfı görmüyor.** Kırpma dedektörü (TASK-3.07) taşma arar, kontrast kapısı (TASK-3.04) tek metnin rengini ölçer. Üst üste binme ayrı bir ölçüttür: *görünür metin yaprakları birbirinin sınır kutusunu belirli bir oranın üstünde örtüyor mu*. TASK-3.01'de kurulan dedektör 80 kombinde **4 aday** üretti ve **1'i gerçekti** — yani ölçüt çalışıyor ama sahte pozitifleri (satır-kutusu payı, döndürülmüş öğe, mockup içi mikro-tablo) elemeden kapıya girmemeli.

## Çözüm Kaydı

—
