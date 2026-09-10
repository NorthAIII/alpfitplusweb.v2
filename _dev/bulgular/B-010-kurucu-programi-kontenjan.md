# B-010: Kurucu Programı "ilk 5 kulüp" diyor, kontenjan takibi yok

**Önem:** 🟡 | **Tip:** tutarsızlık / iddia | **Alan:** M1 — İçerik / M2 `FounderProgram.tsx`
**Kaynak:** kickoff (DURUM.md açık işler) | **Tarih:** 2026-09-11
**Durum:** Açık — karar kurucuda

## Gözlem

Beklenen: Sitede yazan her sınırlı teklif takip edilebilir olmalı (`ILKELER` → Kanıtsız iddia yayınlanmaz; `docs/CLAIMS.md` → sahte kıtlık yok).

Gözlenen: Satış dosyalarında Kurucu Programı bir **görüşme kaldıracıydı**; siteye konması kurucunun onayıyla oldu. Metin "ilk 5 kulüp" diyor ama kontenjan sayacı, dolunca ne olacağı ve kimin saydığı tanımsız. Beşinci kulüpten sonra metin elle değişmezse kanıtsız iddiaya dönüşür.

## Kanıt

- `src/components/sections/FounderProgram.tsx` ve ilgili `src/content/` metni
- `../alpfit-plus-satis` — program görüşme aracı olarak tanımlı

## Kök Neden Yönü

İş kuralı (kontenjan, süre, dolunca davranış) yazılmadan pazarlama metni yayına alındı.

## Koruma Önerisi

Kontenjan `src/content/` sabitine (ör. `FOUNDER_PROGRAM.seats`, `filled`) bağlanır; `filled >= seats` olunca bölüm kendini "kapandı" hâline çevirir ya da gizlenir. Rakam güncellemesi tek satır olur. Sayaç göstermek **şart değil** — sahte kıtlık kalıbı `STYLE-GUIDE`'da yasak; sadece doğru kalması yeterli.

## Çözüm Kaydı

—
