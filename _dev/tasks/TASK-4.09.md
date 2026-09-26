# TASK-4.09: B-065 (1/3) — JavaScript'siz gönderimin varacağı iki sonuç sayfası

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (modules/M3-Lead-Hatti.md)
**Feature:** F3.1 Demo formu ve talep ucu
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.07 ✅ (sayfalar paylaşım kartı yardımcısından geçer; süpürme kapısı onları görür)

---

## Hedef

JavaScript olmadan gönderilen formun (TASK-4.10'un 303'ü) varacağı iki sayfa: **talep alındı** ve **talep gönderilemedi** — öneri adresler `/demo/gonderildi` ve `/demo/gonderilemedi`. İkisi de `noindex`, site haritası dışı, tamamen sunucuda çizilir ve JavaScript gerektirmez.

Başarısızlık sayfası nedeni **sabit bir kod kümesinden** okur (`?neden=` → `missing` · `missing-contact` · `bad-contact` · `no-consent` · `rate-limited` · `no-sink` · `origin`); adreste **hiçbir kişisel veri** yoktur. Her iki sayfa da WhatsApp ve telefon yolunu, başarısızlıkta forma dönüşü sunar. Metinler `src/content/`'te.

Tamam sayılır: iki sayfa 3100'de 200 ve `noindex`; bütün neden kodları ve bilinmeyen kod doğru mesajı gösteriyor; a11y ve mobil kapıları iki sayfayı da ölçüp yeşil.

---

## Bağlam

B-065 (🔴): form `action`/`method` taşımıyor; JavaScript yokken tarayıcı varsayılanı **GET, aynı adrese** — talep hiçbir yere gitmiyor ve ad/telefon/e-posta adres çubuğuna yazılıyor. Araştırma sınıfı genişletti: sorun "JS kapalı" değil **hidrasyonsuz gönderim** (JS parçaları gecikirken basılan düğme de aynısını yapıyor; hızlı 3G'de pencere ~880 ms). Kullanıcı kararı (`docs/DECISIONS.md` 2026-09-26 md. 3): native POST + form kodlaması + 303 → iki sonuç sayfası. Bu task sayfaları, TASK-4.10 ucu, TASK-4.11 formu kurar.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-065-js-kapali-demo-formu-kisisel-veriyi-urlde-tasiyor.md`
- `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler (B-065) · `PHASE-4.md` → Teknik Kararlar 4
- `src/app/api/demo/route.ts` — uçtaki ret kodları ve `message` metinleri (bugün uçta satır içi)
- `src/components/sections/DemoForm.tsx` — JavaScript'li yoldaki başarı/hata cümleleri
- `_dev/bulgular/B-026-donus-suresi-vaadi-uc-farkli-ve-kanitsiz.md` — dönüş süresi vaadi yeni bir cümleyle çoğaltılmaz
- `_dev/docs/STYLE-GUIDE.md` — refleksler; `_dev/docs/CLAIMS.md`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M3-Lead-Hatti.md` → F3.1 — iki sonuç sayfasının varlığı ve sınırı (adreste kişisel veri yok)

---

## Alt Görevler

- [ ] **0. Karar** — sayfa adresleri ziyaretçiye görünür: öneri `/demo/gonderildi` · `/demo/gonderilemedi`; task başında kullanıcı teyidi.
- [ ] **1. Metinler** — `src/content/demo-sonuc.ts` (YENİ): iki sayfanın başlık ve gövdesi, neden kodu → mesaj sözlüğü, bilinmeyen kod için genel mesaj. Başarı cümlesi formun JavaScript'li yolundaki başarı cümlesiyle **aynı**; hata cümleleri uçtaki `message`'larla aynı cümleyse tek evde tutulur (TASK-4.10 ucu buradan okutur) — ikinci kopya açılmaz.
- [ ] **2. Sayfalar** — `src/app/demo/gonderildi/page.tsx` ve `src/app/demo/gonderilemedi/page.tsx` (YENİ): mevcut ilkellerle (bölüm, kap, düğme); `pageMeta` + `robots: { index: false }`. `?neden=` yalnız sözlük anahtarı olarak kullanılır, değeri ekrana basılmaz.
- [ ] **3. Yollar** — WhatsApp **sade** bağlantı (`CONTACT.whatsapp.href`; ön-doldurma adreste veri ister, bu yolda yok), telefon, başarısızlıkta "forma dön" (`/demo`).
- [ ] **4. Rota** — yeni klasörler → `docker compose restart web`; site haritasına **eklenmez**.
- [ ] **5. Ölçüm** — 3100 taze imaj: iki sayfa, her neden kodu; JavaScript kapalı ve açık tarayıcıda metin uzunluğu birebir (B-065'in progressive ölçütü).
- [ ] **6. Kapılar** — `ROTALAR` = site haritasının 16 rotası **+** iki sonuç sayfası (dar liste kapsam eşiğine takılır — M6 Teknik Notlar) ile `a11y.mjs` ve `mobile-audit.mjs`; yeni cümlelerin karakterleri font kümesinde (`font-guard.mjs` iki sayfayı rota kaynağından görmüyorsa karakterler `research/FONT-KARAKTER-KUMESI.txt`'e karşı ayrıca sınanır).

---

## Etkilenen Dosyalar

```
src/content/demo-sonuc.ts                 # YENİ — metinler ve neden sözlüğü
src/app/demo/gonderildi/page.tsx          # YENİ
src/app/demo/gonderilemedi/page.tsx       # YENİ
```

---

## Dikkat Noktaları

- **Yeni vaat yazılmaz.** Dönüş süresi, "hemen" gibi ifadeler formun bugünkü cümlesinde neyse o (B-026).
- Sayfalar site haritasında olmadığı için ölçüm kapılarının rota kaynağı (`research/lib/rotalar.mjs`) onları görmez — ölçüm `ROTALAR` ile (araştırma).
- Umami bu sayfalarda sayfa görüntülemesi sayar; `data-exclude-search` sorgu dizesini zaten atar ve neden kodu kişisel veri değildir.
- Tasarım: kullanıcının reddettiği kalıplar yok (parıltılı rozet, ikonlu kart ızgarası); başarı durumu için jenerik "onay ikonu + kutlama" kalıbı yerine formun mevcut sonuç kutusunun diline yakın, sade bir sayfa.
- Başlık hiyerarşisi: sayfa başına tek `h1` (a11y kapısı ölçer).

---

## Test Kriterleri

- [ ] 3100: iki sayfa 200; HTML robots meta `noindex`; site haritasında yoklar
- [ ] Yedi neden kodunun her biri kendi mesajını, bilinmeyen kod genel mesajı gösteriyor; adreste kişisel veri alanı yok
- [ ] JavaScript kapalı ve açık tarayıcıda iki sayfanın metin uzunluğu birebir
- [ ] `ROTALAR` (16 + 2) ile `a11y.mjs` TOPLAM SORUN **1** · çıkış 1 (B-063 kalemi hariç 0 — yeni sayfalarda 0), `mobile-audit.mjs` yeşil
- [ ] Yeni metnin karakterleri font kümesinde
- [ ] `npm test` yeşil (TASK-4.07'nin süpürme kapısı iki yeni sayfayı da sayıyor)

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

**Oluşturulma:** 2026-09-26
