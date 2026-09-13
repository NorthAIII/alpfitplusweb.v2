# B-051: Ana sayfada üç ikon-kart ızgarası, kullanıcının reddettiği kalıbı tekrarlıyor

**Önem:** 🟡 | **Tip:** tutarsızlık / öneri-ui-ux | **Alan:** M2 — Sayfalar ve bölümler (F2.1 Ana sayfa)
**Kaynak:** audit-product (Gelen Kutusu `[TASK-1.07]` notunun mezuniyeti) | **Tarih:** 2026-09-13
**Durum:** Açık

## Gözlem

**Beklenen:** `docs/STYLE-GUIDE.md` → Kullanıcının Refleksleri → **Kullanma:** *"Jenerik ikonlu kart ızgarası (3×N eşit kart, ikon + başlık + iki satır). Bölüm tasarlarken düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma."* Aynı bölümün **İstiyor** maddesi: *"Düzen çeşitliliği: her bölüm bir öncekinden farklı ritimde."* Memory `kivanc-tasarim-tercihleri`: "jenerik ikon kartı yasak".

**Gözlenen:** Ana sayfanın orta bölümünde (`src/app/page.tsx:26-28`) aynı kalıp üç kez, arada yalnız ürün turu olacak şekilde diziliyor:

| Bölüm | Düzen | Kart içeriği |
|---|---|---|
| `Modules` öne çıkanlar (`Modules.tsx:34`) | `lg:grid-cols-3`, **5 kart** → masaüstünde 3 + 2, ikinci satır tırtıklı biter | `IconBox` + başlık + blurb + 4 madde |
| `Modules` kalanlar (`Modules.tsx:62`) | `lg:grid-cols-5` şerit, 5 öğe | `IconBox` + başlık + tek satır |
| `ProductStory` | yapışkan ürün turu (farklı ritim) | — |
| `Benefits` (`Benefits.tsx:19`) | `lg:grid-cols-4`, **8 eşit kart** | `IconBox` + başlık + iki satır gövde — tanımın birebir kendisi |

Toplam 18 `IconBox` karosu. `Benefits` STYLE-GUIDE'ın tarif ettiği kalıbın tam örneği; `Modules` ondan yalnız madde listesiyle ayrışıyor.

**Bilinçli tercih süzgeci:** `docs/DECISIONS.md`'de ikon ızgarası, `Modules` ya da `Benefits` hakkında kayıt yok (grep: 0). Kanvasın Bilinçli Tercihler bölümünde de yok. Bölümler kickoff öncesi (2026-09-09/10) yazıldı; STYLE-GUIDE'ın reddi 2026-09-11'de kayda geçti ve mevcut bölümlere geri uygulanmadı.

## Kanıt

```
$ sed -n '26,28p' src/app/page.tsx
      <Modules />
      <ProductStory />
      <Benefits />
$ grep -n "grid-cols\|IconBox name" src/components/sections/Modules.tsx src/components/sections/Benefits.tsx
Modules.tsx:34:  <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
Modules.tsx:43:    <IconBox name={m.icon} size="md" />
Modules.tsx:62:  <div className="mt-5 grid gap-4 ... sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
Modules.tsx:65:    <IconBox name={m.icon} size="sm" />
Benefits.tsx:19: <div className="mt-12 grid gap-px ... sm:grid-cols-2 lg:grid-cols-4">
Benefits.tsx:23:   <IconBox name={b.icon} size="md" />
$ awk 'NR>=80 && NR<228' src/content/product.ts | grep -c "featured: true"   → 5
$ awk 'NR>=228 && NR<272' src/content/product.ts | grep -c "icon:"          → 8
```

## Kök Neden Yönü

Tasarım refleksleri kayda geçtiğinde yeni bölümler için kural oldu, var olan bölümler bu kurala karşı hiç taranmadı. İlgili açık kayıt: Gelen Kutusu `[kickoff SORU]` (ana sayfa mobilde ~26.000 px). İki karar aynı yeniden düzenlemede birlikte ele alınabilir: `Benefits`'in 8 kartı aynı zamanda sayfa uzunluğunun bir kalemi.

## Koruma Önerisi

- Düzeltme yönü tasarım kararıdır, kullanıcıya getirilir: `Benefits` liste, sahne ya da ürün görseline bağlı anlatıma çevrilebilir; `Modules` öne çıkanların sayısı ızgaraya göre değil içeriğe göre seçilir (5 kart → ya 2+3 kurgusu ya farklı düzen).
- Mekanik koruma zayıf kalır (kalıp bir estetik yargı). En ucuz koruma: STYLE-GUIDE'a "ardışık iki bölüm aynı kart kalıbını kullanmaz" kuralı ve yeni bölüm senaryosunda (INDEX) bu kontrolün adımı.

## Çözüm Kaydı

—
