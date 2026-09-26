# TASK-4.17: Geçiş provası — dal önizlemesinde tam ölçüm, adres envanterinin kesişimi, canlı değerlerin kaynaklarına erişim

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.5 Alan adı geçişi ve 301 haritası
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.01 → TASK-4.16 ✅ (hepsi — prova bütün değişikliklerin dal önizlemesindeki hâlini ölçer)

---

## Hedef

Geçiş gününden önce her şeyin **gerçek Vercel zincirinde** ölçüldüğü tur. Yerel yayın kopyası (3100) Vercel kenarını, fonksiyon bölgesini ve platformun başlık davranışını göremez; dal önizlemesi görür. Yedi ölçüm:

1. **Envanter kesişimi** — kullanıcının Search Console dizin listesi + Umami'nin (v1 kaydı) en çok gezilen adresleri envantere işlenir; her yeni adres sınıflandırılır.
2. **Geçiş betiği dal önizlemesine karşı** (`BEKLENEN_ASAMA=preview`, atlatma başlığı) — yönlendirme, başlık, dizin ve kart dalları yeşil (host grubu hariç — o canlıda ölçülür).
3. **CSP ihlal sayımı** dal önizlemesinde — Umami'nin önizleme kimliğiyle gerçek betik yüklüyken **0** (TASK-4.12'nin araç çubuğu kararı uygulanmış hâlde).
4. **Fonksiyon bölgesi** — `/api/demo` `422` yolu ×3: `x-vercel-id` fonksiyon ayağı `fra1`, TTFB; TASK-4.14'ün "önce" çizgisine karşı.
5. **B-065 native POST** dal önizlemesinde — geçersiz gönderim (kayıt yazmaz) → 303 → `/demo/gonderilemedi?neden=…`.
6. **Canlı değerlerin kaynaklarına erişim — değer okumadan:** sunucuda `/opt/alpfit-lead/.env` içinde `LEAD_TOKEN_PRODUCTION` anahtarı var (yalnız sayım) · v1 projesinde `IP_HASH_SALT`'ın Production kaydı var ve türü `encrypted` (yalnız anahtar/hedef/tür) · v2'de paylaşılan iki kaydın bugünkü hedefi `production` + `preview` · iki projenin alan adı listesi.
7. **Yayın kapısının tam seti** bir kez 3100'e karşı koşulur; süre ölçülür (kullanıcı tercihi: ~15-20 dk kabul edildi).

Tamam sayılır: yedi kalemin sonucu task dokümanında tabloda; kırmızılar ya bu task'ta kapandı (küçükse) ya plan revizyonuna yönlendirildi.

---

## Bağlam

Kapsam kararı: "Harita doğrulaması tablodan geniştir" — v1'in canlı adres kümesi + Umami'nin en çok gezilen sayfaları + Search Console'un dizin listesi kesiştirilir ve her kalem ölçülür. **Search Console erişimi kullanıcıdadır** (Kullanıcı Tercihleri). Teknik Kararlar 3: rapor-modu CSP turu canlıda yok, prova yüzeyi 3100 + dal önizlemesi.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4.md` → Araştırma Bulguları + `_dev/phases/PHASE-4-ARASTIRMA.md` (tamamı — prova onun ölçümlerini gerçek zincirde tekrarlar) · Kapsam → Kullanıcı Tercihleri
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — Umami okuma API'si (giriş → Bearer); sunucuya SSH
- `_dev/memory/vercel-proje-kimlikleri.md` — `vercel api`; dağıtımı commit'e bağlama (`vercel inspect` SHA basmaz → zaman eşlemesi)
- `_dev/GIT-STRATEJI.md` → Yayın — doğrulama kapısının içeriği
- TASK-4.02 → 4.16'nın arşivlenmiş dokümanları — her birinin "TASK-4.17'de" diye devrettiği kalemler

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 — kesişimle son hâlini alan envanterin sayısı

---

## Alt Görevler

- [ ] **1. Search Console listesi** — task başında kullanıcıdan istenir: dizindeki adreslerin dışa aktarımı (Claude neyin, hangi rapordan çekileceğini yazar). Gelmezse 2-7 koşar, kesişim kalemi 🔴 kalır ve **TASK-4.18'i bloklar**.
- [ ] **2. Umami** — v1 kaydının (`66838f35-…`) 2026-07-01'den bugüne en çok gezilen adresleri (okuma API'si).
- [ ] **3. Sınıflandırma** — iki listenin envanterde olmayan her adresi `research/gecis-ek-adresler.txt`'e beklentisiyle; karşılığı olmayan eski bir yol çıkarsa kural gerekip gerekmediği ölçülür. Küçük bir ekleme (tabloya bir satır) bu task'ta `src/lib/yonlendirmeler.ts`'e girer; yapısal bir ihtiyaç plan revizyonudur (TASKS-README → Sorun Giderme).
- [ ] **4. Dal önizlemesinin tazeliği** — son dağıtımın `dev` HEAD'i taşıdığı zaman eşlemesiyle gösterilir.
- [ ] **5. Ölçümler 2-5** (Hedef'teki liste) — betik, ihlal sayımı, bölge, native POST.
- [ ] **6. Kaynak erişimi** (Hedef madde 6) — hiçbir değer basılmaz: sunucuda `grep -c '^LEAD_TOKEN_PRODUCTION=' /opt/alpfit-lead/.env`; Vercel'de yalnız anahtar/hedef/tür.
- [ ] **7. Yayın kapısı provası** — 3100 taze imaj (`dev` HEAD): beş ölçüm + `npm test` + tip kontrolü + geçiş betiği; süre.
- [ ] **8. Rapor tablosu** — kalem · hedef · sonuç · rakam; kırmızıların yönü.

---

## Etkilenen Dosyalar

```
research/gecis-ek-adresler.txt     # Search Console + Umami kesişiminden sınıflandırılmış adresler
research/lib/gecis-envanteri.mjs   # yalnız yeni bir grup/beklenti türü gerekirse
src/lib/yonlendirmeler.ts          # yalnız küçük bir kural eklemesi gerekirse
```

---

## Dikkat Noktaları

- Dal önizlemesi Vercel girişlidir — her istek atlatma başlığıyla; değer hiçbir çıktıya basılmaz.
- Dal önizlemesinde aşama `preview`: üç `noindex` katmanı **kapalı** beklenir; `og:image` alan adı `alpfitplus.com`'u gösterir ve geçişten önce v1'e gider — kart dalının 200 ölçümü görselin **yolunu** dal adresine karşı ölçer (TASK-4.03'ün ayrımı).
- `422` yolu hız sınırı sayacına girer (IP başına 10 dk'da 5) — bölge ölçümü üç istekle, native POST denemesi ayrı bir anda.
- Native POST denemesi **geçersiz** gönderimle yapılır — önizleme deposuna kayıt yazılmaz.
- Umami'de kullanıcı panele bakamıyor; soru panelsiz, okuma API'siyle ölçülür (memory).
- Bu task canlıya hiçbir şey yazmaz ve alan adına dokunmaz.

---

## Test Kriterleri

- [ ] Envanter: Search Console + Umami listesinin **her** adresi sınıflandırılmış; betik ek adresleri de ölçüyor ve kapsam satırında sayıyor
- [ ] Dal önizlemesi: geçiş betiği (host grubu hariç) **✓ KAPI YEŞİL**
- [ ] Dal önizlemesi: CSP ihlali **0**, Umami isteği gitti
- [ ] `x-vercel-id` fonksiyon ayağı `fra1` (üç istekte); TTFB ×3 "önce" çizgisiyle yan yana
- [ ] Native POST: 303 → `/demo/gonderilemedi?neden=…`, adreste kişisel veri yok
- [ ] Kaynak erişimi: üç kalemin varlığı ölçüldü, hiçbir değer basılmadı
- [ ] Yayın kapısı provası 3100'de yeşil (a11y'nin B-063 kalemi hariç okunur); süre kayıtta

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
