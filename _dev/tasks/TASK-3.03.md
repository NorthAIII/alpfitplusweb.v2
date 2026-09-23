# TASK-3.03: Kapı zemini — 16 rota tek kaynaktan, yayın kopyası hedefi, çıkış kodu, kapsam eşiği

**Durum:** ⬜ Bekliyor
**Modül:** M6 — Kalite Kapıları (modules/M6-Kalite-Kapilari.md)
**Feature:** F6.1 Beş ölçüm betiği
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** Yok

---

## Hedef

`a11y.mjs` ve `mobile-audit.mjs`'i **kapı** hâline getiren zemini kurmak: rota listesi tek kaynaktan türer (16 rota), ölçüm hedefi yayın kopyasıdır, eşik altı durumda betik **sıfır-olmayan çıkış kodu** döner, ve betik kendi **kapsamını** da eşikler (kaç sayfa gezdi, kaç eleman ölçtü, kaçını ölçemedi). Bu task'tan sonra iki betik de kırmızıya dönebilir hâle gelir — dedektörlerin kendisi sonraki task'larda gelir.

---

## Bağlam

B-030: beş kapının dördü eşik altında bile çıkış kodu 0 döndürüyor; M6 F6.1'in *"Eşik altı durumda sıfır-olmayan çıkış kodu döner"* kriteri ölçülmemiş. B-012: iki kapı rotaların yarısını hiç gezmiyor (`a11y` 8, `mobile-audit` 9; `font-guard` zaten 16). Kapsam kararı bu fazın kapı işini **a11y ve mobil ayağıyla** sınırladı — `perf` / `scan` / `font-guard`'ın çıkış kodu ve kapsam eşikleri "Kalite kapıları otomatik" fazında kalır.

Araştırma kararı (PHASE-3 → 4. yaklaşım): `sitemap.ts` araştırma konteynerinden **okunamaz** (konteyner yalnız `./research` dizinini görüyor), bu yüzden liste ayakta olan siteden `/sitemap.xml` ile HTTP üzerinden türetilir ve `/olmayan-sayfa` elle eklenir → ölçüldü: **15 + 1 = 16 rota**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-3-ARASTIRMA.md` — 4. yaklaşım (rota kaynağı) + Teknik Kararlar (yayın kopyası)
- `_dev/bulgular/B-030-kapilar-kirmiziya-donemiyor.md` — eşik ve çıkış kodu kalemlerinin tamamı
- `_dev/bulgular/B-012-olcum-betikleri-rota-kapsami-eksik.md` — rota listelerinin bugünkü hâli
- `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` — 3100'ün bayatlama mekanizması

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-3.md` — Task Listesi tablosunda durum
- `_dev/modules/M6-Kalite-Kapilari.md` — F6.1'in kabul kriterleri artık ölçülü; rota kaynağı ve hedef değişikliği Teknik Notlar'a. F6.1'in Edge Case satırı bugün *"`perf.mjs` ve `font-guard.mjs` üretim konteyneri ayakta değilse…"* diyor — bu task'tan sonra kural **dört** betiği kapsar (`a11y` ve `mobile-audit` de 3100'e bakar), satır gerçeğe çekilir

---

## Alt Görevler

- [ ] **1. Ortak rota kaynağı**
  - `research/lib/rotalar.mjs` (YENİ): `BASE`'e HTTP ile gidip `/sitemap.xml`'i ayrıştırır, yolları döndürür, `/olmayan-sayfa`'yı ekler
  - Liste 16'nın altına düşerse **hata fırlatır** (kapsam çökmesi sessiz geçmez)
  - `a11y.mjs` ve `mobile-audit.mjs` sabit `PAGES` dizilerini bırakıp bu kaynağı çağırır

- [ ] **2. Hedef yayın kopyasına taşınır**
  - İki betikte de `const BASE = process.env.BASE || 'http://localhost:3100'` — `font-guard.mjs`'teki desenin aynısı
  - Varsayılan yayın kopyasıdır; `BASE` ile geliştirme sunucusuna yönlendirmek **bilinçli olarak açık** kalır (düzeltme task'larının ara doğrulaması için)

- [ ] **3. Çıkış kodu**
  - İki betikte de eşik altı → `process.exitCode = 1`; geçme satırı ve çıkış kodu **aynı şeyi** söyler
  - Hedef erişilemezse yığın izi değil **cümle**: `Yayın kopyası 3100'de ayakta değil — ölçüm yapılmadı`

- [ ] **4. Kapsam eşiği**
  - Çıktıya girer ve eşiklenir: gezilen rota sayısı (< 16 → kırmızı), ölçülen eleman sayısı (0 → kırmızı), `a11y` için ölçülemeyen (`skipped`) sayısı raporlanır
  - `TOPLAM SORUN: 0` satırı `16 sayfada 0` hâline gelir

- [ ] **5. `a11y.mjs:112` teşhis satırı `fg`/`bg` değerlerini bassın**
  - Bugün `${x.color}` okuyor ve `undefined` yazıyor; nesnede `fg`/`bg` var (B-030 kalem e)

---

## Etkilenen Dosyalar

```
research/
├── lib/rotalar.mjs          # YENİ — sitemap.xml'den rota listesi
└── scripts/
    ├── a11y.mjs             # rota kaynağı, BASE, çıkış kodu, kapsam eşiği, teşhis satırı
    └── mobile-audit.mjs     # rota kaynağı, BASE, çıkış kodu, kapsam eşiği
```

---

## Dikkat Noktaları

- **Bu task'tan sonra `a11y.mjs` kırmızı koşacak ve bu beklenen sonuçtur:** 16 rotaya çıkınca 404'teki dev rakam (1,12:1) kapının görüş alanına girer. Kırmızı, kapının çalıştığının kanıtıdır — düzeltmesi TASK-3.13'te. CI yok, yani kırmızı hiçbir şeyi bloke etmez.
- **3100 bayat olabilir** (B-019, mekanizması Faz 2'de taze kanıtlandı): `docker compose build web-prod` imajı tazeler ama **konteyneri yeniden yaratmaz** — `docker compose --profile prod up -d web-prod` gerekir. Ölçmeden güvenme.
- **Kapının kendisi de ölçülür.** Çıkış kodunun gerçekten döndüğünü görmek için dayanağı bozup kırmızıyı gör: betiğin kopyasını boş sayfa sunan bir hedefe ya da olmayan bir rotaya çevir, `echo $?` ile doğrula. Dayanağı bozup kırmızıyı görmeden hiçbir dal çivilenmiş sayılmaz (`memory/urun-iddiasi-capa-dogrulamasi.md`).
- **HTTP durumu kontrolü bu fazın kapsamı dışındadır** (B-030 kalem c → "Kalite kapıları otomatik" fazı). Rota listesi `/sitemap.xml`'den geldiği için 404 riski zaten daralıyor; `/olmayan-sayfa` bilerek 404'tür.
- **`perf.mjs` ve `scan.mjs`'e dokunma** — onların çıkış kodu ve rota listesi kapsam dışı.

---

## Test Kriterleri

- [ ] `docker compose --profile research run --rm research node scripts/a11y.mjs` → çıktı **16 sayfa** gezdiğini yazıyor
- [ ] `docker compose --profile research run --rm research node scripts/mobile-audit.mjs` → çıktı **16 sayfa** gezdiğini yazıyor
- [ ] İki betik de yayın kopyasını (3100) ölçüyor; `BASE=http://localhost:3000` ile geliştirme sunucusuna yönleniyor
- [ ] Eşik altı bir koşumda `echo $?` → **1**; eşik üstünde → **0** (ikisi de gözlendi)
- [ ] Hedef kapalıyken betik cümleyle duruyor, yığın izi basmıyor
- [ ] Rota listesi 16'nın altına düştüğünde betik hata veriyor (kontrollü deneyle gözlendi)
- [ ] `a11y.mjs` teşhis satırı artık renk değerlerini basıyor (`undefined` yok)

---

## Risk ve Geri Dönüş Planı

- **Rota listesi HTTP'ye bağlanıyor:** hedef ayakta değilse betik hiç koşamaz → cümleyle durma (alt görev 3) bunu karşılar; ayrıca `ROTALAR` env'i ile elle liste verilebilir kaçış yolu bırakılır.
- **Rollback:** iki betik de tek dosya; değişiklik `git checkout -- research/scripts/<betik>` ile dosya bazlı geri alınır (ağaç-geneli komut kullanılmaz).

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

**Oluşturulma:** 2026-09-23
