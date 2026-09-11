# B-040: Ürün yol haritası dört evde ve zaten ayrışmış; kullanım koşullarının taahhüdü tutmuyor

**Önem:** 🟡 | **Tip:** tutarsızlık / tek-kaynak ihlali | **Alan:** M1 — İçerik ve iddia kaynağı
**Kaynak:** audit-product | **Tarih:** 2026-09-12
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/CLAIMS.md` → Tek Kaynaklar: ürün durumu `site.ts` → `PRODUCT_STATUS`, *"pilot cümlesi başka hiçbir yerde yeniden yazılmaz"*. `src/content/legal.ts:263` (kullanım koşulları) ziyaretçiye şunu taahhüt ediyor: *"Yolda olan ve yol haritasında bulunan özellikler **ayrı ayrı belirtilir**."*

**Gözlenen:** "Yol haritası" listesi **dört ayrı yerde elle** yazılı ve **üçü birbirinden farklı**:

| Ev | Kalemler |
|---|---|
| `src/app/ozellikler/page.tsx:116-124` | Online ödeme · QR ve turnike · Apple Health ve Google Fit · yapay zekâ analiz · **Kurumsal üyelik** (5) |
| `src/components/sections/FounderProgram.tsx:94` | Online ödeme · QR ve turnike · Apple Health ve Google Fit · yapay zekâ analiz (4) |
| `src/content/chat.ts:127` | Online ödeme · QR ve turnike · yapay zekâ analiz (3) |
| `src/content/faq.ts:48` | Online ödeme · QR ve turnike · yapay zekâ analiz (3) |
| `src/app/fiyat/page.tsx:30-31` | "Online kart ile tahsilat (yol haritasında)" · "Turnike, QR ve parmak izi donanımı (yol haritasında)" |

**"Kurumsal üyelik" dört kopyanın yalnız birinde; "Apple Health ve Google Fit" ikisinde.** Hiçbiri `src/content/` sabiti değil. Bu bir **ürün durumu iddiası** ve CLAIMS kapsamında.

Aynı kökün ikinci yüzü: `PRODUCT_STATUS.modules` ürünün **on modülünün sekizini** sayıyor (Üye 360 ve Antrenör Performansı yok), ve o liste [B-014](B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md)'te kaydedildiği gibi `chat.ts:126`'da elle kopyalanmış. Ayrıca `PRODUCT_STATUS.short` ("Pilot aşamada") ve `PRODUCT_STATUS.version` ("v1") sabitlerinin **hiç tüketicisi yok** — "v1 hazır" metni `FounderProgram.tsx:83`'te elle yazılı.

**Kullanım koşullarının taahhüdü yapısal olarak korunmuyor:** `segments.ts` içinde "yolda" / "yol haritası" ifadesi **0 kez** geçiyor; ayrım yalnız ana sayfada (`faq.ts:48`) ve `/ozellikler`'de yapılıyor. Dört segment sayfası 5,4–9,2 bin piksel boyunca present-tense yetenek iddiası taşıyor ve hiçbirinde yol-haritası işareti yok. Bugün o sayfalardaki iddiaların doğrulananları gerçekten üründe var (dördü ürün koduna karşı sınandı, geçti) — yani **bugün yanlış beyan değil**; ama segment metnine bir yol-haritası özelliği girdiği gün hiçbir şey uyarmaz. [B-029](B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md) o sınıfın beş örneğini zaten ölçüyor.

## Kanıt

```
$ grep -rn "Online ödeme\|QR ve turnike\|Apple Health\|yapay zekâ analiz\|Kurumsal üyelik" src/
src/app/ozellikler/page.tsx:116-124   (5 kalem)
src/components/sections/FounderProgram.tsx:94   (4 kalem)
src/content/chat.ts:127               (3 kalem)
src/content/faq.ts:48                 (3 kalem)
src/app/fiyat/page.tsx:30-31          (2 kalem, "yol haritasında" ibaresiyle)

$ grep -c "yolda\|yol haritası" src/content/segments.ts      → 0
$ sed -n '263p' src/content/legal.ts
  → "Yolda olan ve yol haritasında bulunan özellikler ayrı ayrı belirtilir."
$ grep -rn "PRODUCT_STATUS.short\|PRODUCT_STATUS.version" src/ | grep -v content/site.ts   → (yok)
```

## Kök Neden Yönü

`PRODUCT_STATUS` **pilot cümlesi** için kurulmuş ve o alanda tek kaynak disiplini var; ama "bugün var / yolda" **ayrımı** için hiç sabit açılmamış. Dört yerin dördü aynı bilgiyi farklı bağlamda anlatmak için yazılmış (özellikler tablosu, kurucu programı, SSS, chat) ve biri sonradan büyütülmüş ("Kurumsal üyelik" eklenmiş), kardeşleri hizalanmamış. Klasik senkron kaybı — ve [B-039](B-039-metin-bilesende.md)'un doğrudan sonucu: iki kopya bileşende yaşıyor, yani `src/content/` düzenleyen biri onları hiç görmüyor.

## Koruma Önerisi

- `src/content/product.ts`'e tek bir yetenek/yol-haritası sabiti açılır (ör. `ROADMAP = { simdi, yolda, sonra }`); `ozellikler`, `FounderProgram`, `chat.ts`, `faq.ts` ve `fiyat/NOT_INCLUDED` oradan okur. Bu sabit aynı zamanda [B-029](B-029-site-urunun-karsilamadigi-yetenekleri-var-diyor.md)'un koruma önerisindeki ürün-deposu çapraz kontrolünün girdisi olur — iki bulgu tek yapıyla kapanır.
- `PRODUCT_STATUS.modules` ürünün gerçek modül listesiyle hizalanır (bugün 8/10) ya da alanın kapsamı adıyla daraltılır; `short` ve `version` ya tüketiciye bağlanır ya silinir ([B-047](B-047-bakim-borcu-envanteri.md)).
- Kullanım koşullarının taahhüdü iki yoldan biriyle karşılanır: ya segment metinlerindeki yol-haritası kalemleri işaretlenir, ya taahhüt kapsamına göre daraltılır (hukukçu onayı zaten bekliyor — [B-008](B-008-yasal-metin-hukukcu-onayi.md)).
- Kalıcı koruma M6 F6.4'ün doğal kapsamı: `ROADMAP` kalemlerinin sabit **dışında** geçtiği yerleri arayan bir kontrol; [B-014](B-014-chat-agaci-pilot-cumlesini-yeniden-yaziyor.md)'ün koruma önerisiyle aynı denetim.

## Çözüm Kaydı

—
