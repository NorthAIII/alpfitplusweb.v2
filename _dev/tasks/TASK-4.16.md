# TASK-4.16: Vercel ücretli plana geçiş

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.3 Vercel'de ayrı proje
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.01 ✅ (atlatma anahtarının geçişten sonra da geçerli olduğu ölçülür)

---

## Hedef

Takım `north-ai` Vercel'in ücretli planına geçer — ödeme adımı kullanıcıdadır. Claude geçişi API'den teyit eder ve hiçbir dağıtımın, erişim korumasının ya da proje ayarının bozulmadığını öncesi/sonrası ölçümüyle gösterir. "Hobby'de kalır" bilinçli tercih kaydı silinir; kimlik atomundaki plan alanı güncellenir.

Tamam sayılır: API'de takım planı ücretli; üretim `.vercel.app` açık ve 200, dal önizlemesi anahtarsız giriş / anahtarla 200; iki kayıt gerçekle hizalı.

---

## Bağlam

Kapsam kararı (kullanıcı, 2026-09-26): ücretsiz plan ticari kullanıma kapalı ve canlı bir satış sitesinde askıya alma demo hunisini durdurur (ILKELER → Kalıcılık önceliği, Dönüşüm). `BULGULAR.md` → Bilinçli Tercihler'deki Hobby satırı riski "yalnız önizleme süresince" kabul etmişti; o süre bu fazda biter. Araştırma (2026-09-26, vercel.com/pricing): koltuk başına aylık $20, $20 kullanım kredisi dahil; takım tek üyeli → **$20/ay**. **Plan takım bazındadır:** takımdaki 12 projenin tamamı (aralarında `kiwiailab.com`, `afrodia.com.tr`) ücretli plana geçer.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-4.md` → Kapsam Tartışması (Vercel planı) · `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → Parite ve yüzey → Ücretli plan
- `_dev/memory/vercel-proje-kimlikleri.md` — `vercel api`, kimlik yolu, proje tablosu
- `_dev/BULGULAR.md` → Bilinçli Tercihler — Hobby satırı

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/BULGULAR.md` → Bilinçli Tercihler — Hobby satırı **silinir** (geçiş yapıldı)
- `_dev/memory/vercel-proje-kimlikleri.md` → proje tablosu `Plan` satırı
- `_dev/docs/DECISIONS.md` — ücretli plan kararı (gerekçe: ticari kullanım; bedel ve takım geneli etkisi — 12 proje birden)
- `_dev/GIT-STRATEJI.md` — plan adı geçiyorsa (korumalı; raporda tek satır)

---

## Alt Görevler

- [ ] **1. Güncel ücreti teyit et** ve kullanıcıya pratik karşılığıyla söyle: aylık bedel, takımdaki bütün projelerin birlikte geçmesi, iptal edilirse ne olur. Onay al.
- [ ] **2. "Önce" ölçümü** — `vercel api`: takım planı; v2 proje ayarlarından `ssoProtection`, `resourceConfig.functionDefaultRegions`, üretim dalı; son iki dağıtım Ready; dal adresi anahtarsız 302 / anahtarla 200.
- [ ] **3. Kullanıcı adımı** — panelden yükseltme ve ödeme.
- [ ] **4. "Sonra" ölçümü** — 2. adımın aynısı; farklar kayda (özellikle erişim koruması varsayılanları).
- [ ] **5. Kayıtlar** — BULGULAR Hobby satırı, memory `Plan`, DECISIONS.

---

## Etkilenen Dosyalar

```
_dev/BULGULAR.md
_dev/memory/vercel-proje-kimlikleri.md
_dev/docs/DECISIONS.md
_dev/GIT-STRATEJI.md          # yalnız plan adı geçiyorsa
```

Kod dosyası değişmez.

---

## Dikkat Noktaları

- **Ödeme bilgisi ajan tarafından görülmez, istenmez;** adım tümüyle kullanıcının panelindedir.
- Kullanıcı adımı gelmezse task 🔴 Bloke; tablo sırası gereği sonraki task bekler. Geçiş anından (TASK-4.18) **önce** kapanmalı — ticari kullanım canlıyla başlar.
- Plan geçişi erişim koruması varsayılanlarını ya da fonksiyon ayarlarını değiştirebilir — varsayılmaz, öncesi/sonrası ölçülür.
- Frankfurt bölgesi ücretli plana bağlı **değildir** (Hobby de tek bölge seçebilir) — TASK-4.14'ün `vercel.json`'u iki planda da geçerli.
- `vercel api` proje okuması env dizisini de döndürür — yalnız `key`/`target`/`type` yazdır.

---

## Test Kriterleri

- [ ] API: takım planı ücretli (alan adı ve değeri kayıtta)
- [ ] Üretim `.vercel.app` → 200 (açık); dal adresi anahtarsız 302, anahtarla 200 — geçişten sonra da
- [ ] Öncesi/sonrası proje ayarı farkı kayıtta (fark yoksa "fark yok" açıkça)
- [ ] BULGULAR'da Hobby satırı yok; memory `Plan` satırı güncel

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
