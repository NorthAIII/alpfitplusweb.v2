# TASK-3.25: Form hata verdiğinde açılan WhatsApp bağlantısı yazılanları taşır

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (modules/M3-Lead-Hatti.md)
**Feature:** F3.1 Demo formu ve talep ucu
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.16 ✅

---

## Hedef

Demo formu hedefe yazamayıp 503 döndüğünde kullanıcı WhatsApp'a yönlendiriliyor — ama **az önce yazdığı her şeyi elle yeniden yazmak zorunda**. Bağlantı `?text=` parametresiyle açıldığında mesaj kutusu ad, kulüp ve telefonla önceden dolu gelir. Huninin en kritik kurtarma noktası budur: form düştüğünde talebin kaybolmadığı tek yol.

Değişiklik **yalnız bu kurtarma bağlantısını** kapsar; sitedeki diğer WhatsApp bağlantıları bugünkü hâlinde kalır.

---

## Bağlam

B-022'nin ikincil önerisi. Kapsam tartışmasında (PHASE-3) *"aynı işte ucuz olduğu için kapsamda kalır"* denerek B-022'nin ana kalemiyle (mobilde ilk ekran) birlikte alınmıştı; `verify-plan` (2026-09-23) ikisini ayırdı: bu kalem **ayrı bir modülün** (M3 lead hattı) işi, ayrı dosyaya dokunuyor ve kişisel veriyi bağlantı adresine koyduğu için kendi çağrı-sitesi süpürmesini gerektiriyor. Ana kalem TASK-3.16'da kaldı.

Bugünkü davranış ölçüldü: `src/content/site.ts:21` → `https://wa.me/905359375955`, hiçbir yerde `?text=` yok. Bu adres sitede **12 dosyada** kullanılıyor (17 geçiş) — yani "tek kaynağa bir alan eklemek" burada sessizce on iki yüzeyi birden değiştirebilir.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md` — ikincil öneri ve gerekçesi
- `_dev/modules/M3-Lead-Hatti.md` — F3.1: 503 akışı ve WhatsApp yedeğinin bugünkü davranışı
- `_dev/memory/tek-kaynak-atlayan-cagri-sitesi-supurmesi.md` — tek kaynak tanıtan task kapanışta çağrı sitelerini süpürür
- `_dev/docs/CLAIMS.md` — `CONTACT` tek kaynak kuralı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M3-Lead-Hatti.md` — F3.1'in 503 akışına kurtarma bağlantısının yazılanları taşıdığı kriteri

---

## Alt Görevler

- [ ] **1. Ön-doldurulmuş adresi tek kaynakta üret**
  - Çapa: `src/content/site.ts` → `CONTACT.whatsapp` (⚠️ `grep -n "wa.me"` ile yeniden konumlan)
  - Taban `href` **değişmez**; yanına girdilerden adres üreten bir yardımcı eklenir (metin `src/content/`'te kurulur, bileşende değil — CLAUDE.md → Kod kuralları)
  - Mesaj gövdesi yalnız kullanıcının **kendi girdiği** alanlardan kurulur: ad, kulüp, telefon. Serbest mesaj alanı ve e-posta dâhil edilmez

- [ ] **2. Yalnız 503 kurtarma bağlantısına bağla**
  - Çapa: `src/components/sections/DemoForm.tsx` — hedef yokken gösterilen WhatsApp yolu
  - Boş formda ya da alanlar boşken `?text=` eklenmez; bağlantı bugünkü sade hâline düşer

- [ ] **3. Kalan çağrı sitelerini süpür**
  - `src/`'te `wa.me` geçen 12 dosya taranır; hiçbirinin ön-doldurma almadığı doğrulanır
  - Tıklama sayacı bağlantıyı `href.startsWith("https://wa.me")` ile tanıyor (`ClickTracker.tsx`) — sorgu eklenince eşleşme bozulmamalı, doğrula

- [ ] **4. Kişisel verinin nereye gitmediğini doğrula**
  - Adres yalnız kullanıcının kendi cihazında açılan bağlantıda durur; ölçüme (Umami) ve kayda gitmez
  - Sayaç bugün yalnız yüzey adı gönderiyor (`track(EVENTS.whatsapp, surface)`) — bu davranış korunur, adres olaya **girmez**

---

## Etkilenen Dosyalar

```
src/content/site.ts                     # ön-doldurulmuş adresi üreten yardımcı (taban href değişmez)
src/components/sections/DemoForm.tsx    # 503 kurtarma bağlantısı yardımcıyı çağırır
```

---

## Dikkat Noktaları

- **Taban `href`'i değiştirme.** `CONTACT.whatsapp.href` 12 dosyada kullanılıyor; oraya `?text=` koymak sitedeki her WhatsApp bağlantısına — Header, Footer, Hero, SSS, 404, asistan — boş ya da yanlış bir ön-doldurma taşır. Ön-doldurma **çağrı yerinde** kurulur.
- **Kişisel veri adres satırına giriyor.** Sınır dar tutulur: yalnız kullanıcının kendi girdiği ad, kulüp ve telefon; serbest mesaj metni ve e-posta **girmez**. Adres kullanıcının kendi cihazında açılır, sunucuya ve ölçüme gitmez.
- **Yasal beyan kapısı `src/`'i tarıyor.** `tests/legal-consistency.test.ts` → dal 5 `src/` içindeki dış adres kümesini **dondurulmuş bir listeye** karşı sınıyor ve `wa.me` o listede; host değişmediği sürece kapı yeşil kalır, ama değişiklik sonrası batarya koşulmadan kapanma.
- **Sayaç desenini bozma.** `ClickTracker.tsx` `href.startsWith("https://wa.me")` ile eşleşiyor — sorgu parametresi bu deseni bozmaz, ama bağlantı başka bir biçimde kurulursa (örn. `api.whatsapp.com`) WhatsApp tıklamaları sessizce sayılmaz olur.
- **Metin `src/content/`'te kalır** — mesaj şablonu bileşende yazılmaz.
- **Gerçek telefonda deneme** faz sonundaki tura kalır — `kanal: UAT`.

---

## Test Kriterleri

- [ ] Form 503 aldığında açılan WhatsApp bağlantısı kullanıcının girdiği ad/kulüp/telefonu taşıyor (yerel olarak, hedefsiz üretim konteynerine karşı denendi — `503 no-sink` hâli `memory/alternatif-env-ile-uretim-derlemesi.md`)
- [ ] Alanlar boşken bağlantı `?text=` **taşımıyor** (boş şablon gönderilmiyor)
- [ ] Serbest mesaj alanı ve e-posta adrese **girmiyor** (adres gözle okundu)
- [ ] Kalan WhatsApp çağrı siteleri ön-doldurma almıyor: `src/`'te `wa.me` geçen 12 dosya grep'lendi, yalnız kurtarma bağlantısı `?text=` taşıyor
- [ ] WhatsApp tıklama olayı hâlâ sayılıyor ve olayda **yalnız yüzey adı** var, adres yok (sayacın gönderdiği yük gözlendi)
- [ ] `docker compose exec web npm test` geçiyor — `src/` taranıyor ve dış adres kümesi dondurulmuş listeyle birebir kalıyor
- [ ] Gerçek telefonda kurtarma yolu denendi — `kanal: UAT`
- [ ] Beş ölçüm regresyon çizgisini koruyor

---

## Risk ve Geri Dönüş Planı

- **Risk:** ön-doldurma tek kaynağın tabanına yazılırsa 12 dosyadaki bağlantı sessizce değişir → alt görev 3'ün süpürmesi bunu yakalar; süpürme kapanış koşuludur, isteğe bağlı değil.
- **Rollback:** iki dosya; dosya bazlı geri alınır (ağaç-geneli komut kullanılmaz).

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
