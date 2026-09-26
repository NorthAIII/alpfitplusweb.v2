# TASK-4.19: Geçiş sonrası — ölçümün v1 kaydında sayılması, yeni site haritasının bildirimi, bulgu kapanışları

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.5 Alan adı geçişi · F7.4 Analitik olay sayımı
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.18 ✅ — ve geçişin üzerinden **gerçek trafik görecek kadar zaman** geçmiş olmalı (öneri: en az bir gün)

---

## Hedef

Geçişin zaman isteyen kalemleri ve kayıt kapanışları:

1. **Umami** — canlı trafik v1'in `alpfitplus.com` kaydında (`66838f35-…`) `data-tag=production` ile sayılıyor; v2'nin önizleme kaydına canlı trafik düşmüyor (okuma API'si).
2. **Search Console** — kullanıcı yeni site haritasını (`https://alpfitplus.com/sitemap.xml`) bildirir; Claude neyin bildirileceğini ve sonraki günlerde neye bakılacağını (dizin kapsamı, yönlendirme raporu, eski site haritası adresinin 301'i) yazar.
3. **Kararlılık** — geçiş betiği canlıda ikinci kez (farklı gün) **✓ KAPI YEŞİL**; `/api/demo` canlı gecikmesi (`422` yolu ×3, fonksiyon ayağı `fra1`).
4. **Bulgu kapanışları** — B-043 · B-016 · B-042 (kalem 1 ve 3; parite dışı kalemler açık kalır) · B-065 (açık kalemi varsa) · B-027 (canlı ayağı; önizleme kartı açık kalır): atomların Çözüm Kayıtları ölçümleriyle, BULGULAR index.
5. **Modül hizası** — M7 F7.5 kabul kriterleri gerçekle: "20 adres" → ölçülen envanter (45 kalem + iki biçim + kesişim ekleri), tek atlama, `/404` ailesi; parite kriteri satırı (↓ 6).
6. **Bilinçle bırakılan parite kalemlerinin kaydı** — kapsam kararı (PHASE-4 → Kapsam Tartışması, ilk madde): v1'in yapıp v2'nin bilinçle yapmadığı her kalem `BULGULAR.md` → Bilinçli Tercihler'e gerekçesiyle iner; sonraki denetimler onları yeniden bulgulaştırmaz (kullanıcı onayı, verify-plan 2026-09-26).

Tamam sayılır: altı kalem ölçülmüş ya da (Search Console gibi) kullanıcıya bağlı kalan açıkça işaretlenmiş.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — Umami okuma API'si (giriş → Bearer); kullanıcı panele bakamıyor
- `_dev/tasks/archive/TASK-4.18.md` — canlı ölçümün ilk koşumu
- `_dev/bulgular/B-043-…` · `B-016-…` · `B-042-…` · `B-065-…` · `B-027-…` — kapanacak kalemlerin tam listesi (hangi kalem açık kalır)
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.4, F7.5

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- Beş bulgu atomu + `_dev/BULGULAR.md` index
- `_dev/BULGULAR.md` → Bilinçli Tercihler — bırakılan parite kalemleri (↓ alt görev 6)
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 kabul kriterleri

---

## Alt Görevler

- [ ] **1. Umami** — iki kaydın (v1 canlı, v2 önizleme) geçiş anından bu yana sayfa görüntülemesi ve olayları; ortam etiketi kırılımı.
- [ ] **2. Search Console** — kullanıcıya bildirilecek adres ve bakılacak raporlar; kullanıcı bildirir ve sonucu söyler. Gelmezse kalem "kullanıcıya bağlı iş" olarak BULGULAR'a düşer — fazı kilitlemez (ILKELER).
- [ ] **3. Kararlılık** — betik canlıda; gecikme ölçümü.
- [ ] **4. Bulgular** — her atomda hangi kalemin kapandığı, hangisinin neden açık kaldığı, ölçüm çapası.
- [ ] **5. M7 F7.5** — kriterler; parite kriteri satırı eklenir (B-059 → Koruma Önerisi'nin önerdiği satır, fazın gerçeğiyle): *"v1'in canlıda yaptığı her davranış kalem kalem karşılaştırıldı; taşınmayan her kalem gerekçesiyle `BULGULAR.md` → Bilinçli Tercihler'de."*
- [ ] **6. Bilinçli Tercihler** — bırakılan her kalem tek satır, KURAL biçimiyle (`- [konu] — neden bilinçli (tarih)`). Bugün bilinen dört kalem:
  - v1'in yazı tipi adresleri (`/fonts/*-latin-*.woff2`, 4 referanslı) → 404 — yalnız v1'in kendi HTML'i referans veriyordu (araştırma, `PHASE-4-ARASTIRMA.md` → adres envanteri);
  - `hreflang` alternatifleri yok — tek dil kararı (TASK-4.08);
  - `/404` ailesi: v1'de `/en/404` **200**, `/404.html` **308** veriyordu; v2'de üçü de **404** — ana sayfaya yönlendirmek "yumuşak 404" sayılır (kullanıcı, `docs/DECISIONS.md` 2026-09-26 md. 2);
  - Umami `data-domains` kullanılmıyor — ortam ayrımı `data-tag` ile (`layout.tsx`'teki yorum).
  - ⚠️ **Liste tamlığı iddia edilmez:** kaynak TASK-4.02 envanterindeki `düşer` beklentili kalemler + TASK-4.17 kesişiminde "kural gerekmez" diye sınıflanan adresler + fazın task kayıtlarında "taşınmadı" denen her davranıştır — satırlar bu üç kaynaktan sayılarak yazılır.

---

## Etkilenen Dosyalar

```
_dev/bulgular/B-043-…  B-016-…  B-042-…  B-065-…  B-027-…
_dev/BULGULAR.md
_dev/modules/M7-Yayin-ve-Altyapi.md
```

Kod dosyası değişmez.

---

## Dikkat Noktaları

- **B-042'nin parite dışı kalemleri açık kalır** (`/foto` önbelleği, `lastmod`, iki tema rengi, `Organization.logo`) — atomda kalem kalem; kapanmış gibi yazılmaz.
- **B-027'nin önizleme ayağı açık kalır** (aşamaya göre `metadataBase` — kapsam dışı).
- Faz ve feature'ların ✅ damgası bu task'ın işi değil (review-phase); milestone cümlesi de burada değişmez.
- Reklam engelleyiciler sayımı eksiltir (M7 F7.4 Edge Case) — Umami rakamı bir alt sınırdır.
- Umami API'sinden okunan değerlerde kişisel veri yok; kayda yalnız sayılar girer.

---

## Test Kriterleri

- [ ] Umami: v1 kaydında geçiş sonrası `production` etiketli sayım > 0; v2 önizleme kaydına canlı adresli sayım 0
- [ ] Canlı betik ikinci koşum **✓ KAPI YEŞİL**; `x-vercel-id` fonksiyon ayağı `fra1`
- [ ] Site haritası bildirimi yapıldı — **kanal: UAT** (kullanıcının Search Console hesabı)
- [ ] Beş atomun durumu ölçümle hizalı; açık kalan kalemler gerekçeli
- [ ] Bilinçli Tercihler'de bırakılan her parite kalemi tek satır ve gerekçeli; sayısı üç kaynağın (envanterin `düşer` kalemleri · kesişimde kuralsız bırakılanlar · task kayıtlarındaki "taşınmadı") toplamıyla eşit; M7 F7.5'te parite kriteri satırı var

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
