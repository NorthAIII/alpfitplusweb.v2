# B-028: `npm run lint` repoda kırık — CI kurulduğu gün kapı ilk günden kırmızı doğar

**Önem:** 🟡 | **Tip:** hata / teknik borç | **Alan:** M6 — Kalite kapıları
**Kaynak:** audit-product (Gelen Kutusu triyajı, kaynak: TASK-1.01) | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** `ILKELER.md` → Kümülatif test altyapısı: *"Test altyapısı her geliştirmeyle üstüne koyarak büyür… Geriye dönük güven zamanla artmalı, azalmamalı."* M6 F6.3 GitHub Actions'ı her push'ta çalıştıracak.

**Gözlenen:** `npm run lint` bugün **30 problem** veriyor: 25 hata, 5 uyarı. Dağılım `src/components/sections/*.tsx`, `src/components/layout/*.tsx` ve `src/app/*` içinde.

Hataların ezici çoğunluğu `react/no-unescaped-entities` — Türkçe metinlerdeki kesme işareti (`'`). Bunun yanında `@typescript-eslint/no-unused-vars` (`ProductStory.tsx:106`, kullanılmayan `shot`) ve `react-hooks/set-state-in-effect` (`Header.tsx:27`) var.

Kırıklığın kendisi bugün zarar vermiyor — kapı henüz yok, kimse koşturmuyor. Zarar CI kurulduğu gün doğuyor: kapı ilk çalıştığında kırmızı doğar ve o an iki seçenek kalır — ya kapı devreye girmeden önce otuz kalem temizlenir, ya kural gevşetilir. İkincisi yapılırsa kapı doğduğu gün anlamını kaybeder.

`react-hooks/set-state-in-effect` kalemi diğerlerinden farklı: biçimsel değil, davranışsal bir uyarı (efekt içinde doğrudan `setState`). Temizlik sırasında bunun ayrı değerlendirilmesi gerekir; kesme işaretleri mekanik olarak düzeltilebilir.

## Kanıt

```
$ docker compose exec -T web npm run lint
...
/app/src/components/layout/Header.tsx
  27:19  error  Avoid calling setState() directly within an effect  react-hooks/set-state-in-effect
/app/src/components/layout/KiwiBand.tsx
  59:28  error  `'` can be escaped with `&apos;` ...   react/no-unescaped-entities
/app/src/components/sections/DemoForm.tsx
  60:19  error  ...  (4 kalem)
/app/src/components/sections/ProductStory.tsx
  106:9  warning  'shot' is assigned a value but never used  @typescript-eslint/no-unused-vars
...
✖ 30 problems (25 errors, 5 warnings)
```

Bu kayıt TASK-1.01 oturumunda Gelen Kutusu'na düşmüştü; bu turda **yeniden ölçüldü ve rakamlar birebir aynı** — yani araya giren dört task hiçbirini artırmamış ya da azaltmamış.

## Kök Neden Yönü

Lint hiç koşturulmadan geliştirme yapıldı; `package.json`'da `lint` betiği var ama ne commit öncesi kapı ne CI onu çağırıyor. Türkçe metin kesme işareti yoğun bir dil olduğu için `react/no-unescaped-entities` bu projede doğal olarak sık tetikleniyor — kural projeye göre ayarlanmamış.

## Koruma Önerisi

- Temizlik M6 F6.3'ten **önce** yapılır; sıra tersine dönerse kapı kırmızı doğar. Kesme işareti kalemleri mekanik (`&apos;` ya da typografik `’`), kullanılmayan değişken tek satır, `set-state-in-effect` ayrı bakılır.
- Alternatif bir karar da meşrudur: `react/no-unescaped-entities` Türkçe içerikli bir projede az değer üretiyor olabilir; kural bilinçle kapatılabilir. Ama bu bir **karar** olmalı ve `DECISIONS.md`'ye yazılmalı — bugün ne temizlenmiş ne kapatılmış, yalnız biriktirilmiş durumda.
- CI kurulduğunda lint kapının parçası olur; o günden sonra sayı sıfırda kalır.

## Çözüm Kaydı

—
