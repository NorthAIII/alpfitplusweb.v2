# TASK-2.16: Yasal metinde işlenen veri gerçeği ve form onayının kapsamı (B-024 k.1, k.3, k.4)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`) · M3 lead hattının gerçeği
**Feature:** F1.1 (yasal içerik) · M2 F2.2 (yasal sayfalar)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.07 önerilir (onay e-postası açıldıktan sonra onay metni son hâliyle yazılır)

---

## Hedef

Yasal metinlerin **işlenen veri** anlatımını ölçülmüş gerçeğe hizalamak ve form onay metninin kapsamını gerçekten işlenen alanlara genişletmek. Bugün üç yönde ayrışma var: IP ve `ip_hash` hiçbir metinde geçmiyor (oysa `ip_hash` depo gövdesine yazılıyor ve **12 ay** saklanıyor), "tarayıcı bilgisi" **fazlasını** söylüyor (artık hiçbir kalıcı kayda girmiyor), Gizlilik'in topladığı-veri listesi KVKK'nınkiyle ayrışık.

Task, üç kalem de metinde düzeldiğinde ve form onayı işlenen kategorileri kapsadığında tamamlanmış sayılır.

---

## Bağlam

Ölçülmüş hâl (audit-product 2026-09-22, `legal.ts` 315 satır kalem kalem okundu):

- **(1) IP / `ip_hash` — açık ve ağırlaşmış.** KVKK'nın işlenen-veri listesi (`legal.ts:59-63`) IP'yi saymıyor. Ama `route.ts:128` `ip_hash: hashIp(ip, salt)` **depo gövdesine yazıyor** ve kayıt 12 ay saklanıyor. IP'den türetilmiş kalıcı bir tanımlayıcı, metinde hiç anılmadan bir yıl saklanıyor. Ayrıca hız sınırı için ham IP on dakika bellekte tutuluyor.
- **(3) Ters yön de kırık.** `legal.ts:63` "tarayıcı bilgisi"ni işlenen veri sayıyor; `route.ts:118` yorumu *"env/ua/consent/at gövdeye GİRMEZ"* diyor, e-posta gövdesi de `ua` taşımıyor. `ua` yalnız `LEAD_FILE_PATH` yolunda kalıcılaşıyor, o da yayında tanımlı değil. **Liste fazlasını söylüyor.** Gizlilik'in topladığı-veri listesi (`legal.ts:182-185`) ise "işlem güvenliği verisi" satırını hiç taşımıyor — iki metin ayrışık.
- **(4) Onay kapsamı — hiç dokunulmamış.** `DemoForm.tsx:211-212` hâlâ yalnız *"İletişim bilgilerimin…"* diyor; uç ayrıca `club`, `branches`, `segment`, `message`, `at`, `env` ve `ip_hash` işliyor.

**Bu task'ın dışında kalanlar:** ölçüm (Umami/nginx) beyanları ve yurt dışı aktarım olgusu → TASK-2.17. Yurt dışı aktarımın **hukuki dayanağı** → hukukçu (B-008), bu fazda uydurulmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-024-yasal-metin-gercek-veri-akisini-eksik-anlatiyor.md` — dört kalem, ölçümler, TASK-1.15'in kapattıkları
- `src/app/api/demo/route.ts` — gerçek akış (neyin gövdeye girdiği, neyin girmediği)
- `src/content/legal.ts` — KVKK aydınlatma + Gizlilik + kullanım koşulları
- `src/components/sections/DemoForm.tsx:200-215` — onay metni
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 edge case: "depo KVKK açısından kişisel veri tutar (12 ay saklama); yasal metinle tutarlı olmalı"

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/bulgular/B-024-*.md` — üç kalemin Çözüm Kaydı; atom **TASK-2.17'den sonra** kapanır (hukuki dayanak ayağı hukukçuda kalır ve bu ayrım kayda yazılır)
- `_dev/modules/M3-Lead-Hatti.md` → F3.2 — "yeni hedef/alan → yasal metin gözden geçirildi" kriteri (bulgunun kalıcı koruma önerisi)

---

## Alt Görevler

- [ ] **1. IP ve `ip_hash`'i metne yaz**
  - KVKK aydınlatmasının işlenen-veri listesine: hız sınırı için kısa süreli ham IP (amaç + süre) ve kayda giren **IP özeti** (`ip_hash`) + 12 ay saklama
  - Anlatım **olgu** düzeyinde kalır; uydurma süre ya da uydurma hukuki sebep yazılmaz

- [ ] **2. "Tarayıcı bilgisi" fazlasını düzelt ve iki listeyi hizala**
  - `ua` kalıcı kayda girmiyorsa listeden çıkar ya da gerçekten girdiği yol (`LEAD_FILE_PATH`, yayında tanımsız) koşuluyla anlatılır
  - Gizlilik'in topladığı-veri listesi KVKK'nınkiyle aynı kategorileri sayar; **iki metin birbirini kesmez**

- [ ] **3. Form onay metninin kapsamı**
  - Onay, gerçekten işlenen kategorileri kapsar: iletişim bilgileri + kulüp/şube/tip + mesaj + işlem güvenliği verisi
  - Metin kısa ve okunur kalır; `docs/STYLE-GUIDE.md` tonu korunur, hukuk jargonuna kaçmaz
  - TASK-2.07'nin onay e-postasıyla tutarlı (iletişim zaten onaylanmış bir amaç)

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts                          # KVKK + Gizlilik listeleri — zaten var
src/components/sections/
└── DemoForm.tsx                      # onay metni — zaten var
```

---

## Dikkat Noktaları

- **Metin koddan sonra yazılır, tersi değil.** Her cümle `route.ts`'in gerçek davranışına karşı doğrulanır; "olması gereken"i değil **olanı** anlatır (`legal.ts:8-11`'in kendi beyanı).
- **Hukuki sebep ve yurt dışı dayanağı bu task'ta yok** — hukukçunun işi (B-008). Faz metnin **olgu** tarafını yazar.
- **Onay metni uzarsa form dönüşümü etkilenir** (`ILKELER.md` → 1. eksen Dönüşüm): kısa ve anlaşılır tut; uzun hukuk metni linkte durur.
- **Mobil yerleşim:** onay metni uzarsa 320 px'te satır kırılması ve dokunma hedefi yeniden ölçülür (`mobile-audit.mjs`) — TASK-2.05/2.06'nın düzelttiği yüzeyle aynı form.
- **Font kümesi:** yeni karakter girerse `font-guard.mjs` yakalar.
- **B-060 bu metinleri çivileyecek** (TASK-2.18) — metin son hâlini almadan test yazılmaz; sıra bilinçli.

---

## Test Kriterleri

- [ ] KVKK aydınlatmasının işlenen-veri listesi ham IP'yi (amaç + kısa süre) ve `ip_hash` + 12 ay saklamayı **anlatıyor**; cümleler `route.ts`'in davranışıyla satır satır eşleşiyor (eşleme tablosu dokümana)
- [ ] "Tarayıcı bilgisi" kalemi gerçeğe uygun (çıkarıldı ya da koşuluyla anlatıldı); KVKK ve Gizlilik listeleri **aynı kategorileri** sayıyor
- [ ] Form onay metni işlenen tüm kategorileri kapsıyor; `DemoForm`'un gönderdiği alanlarla karşılaştırma tablosu dokümanda
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `mobile-audit.mjs` yatay kaydırma: yok · `font-guard.mjs` kümede olmayan karakter yok
- [ ] `scan.mjs` `/kvkk`, `/gizlilik` ve `/demo` konsol temiz
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız
- [ ] Hiçbir metinde uydurulmuş süre, sağlayıcı ya da hukuki dayanak yok (kalem kalem kontrol, dokümana)

---

## Risk ve Geri Dönüş Planı

- **Metin fazla teknikleşirse** ziyaretçi anlamaz ve form onayı dönüşümü düşürür → onay kısa kalır, ayrıntı KVKK sayfasında.
- **Rollback:** iki dosya, dosya bazlı geri alma yeterli; metin git history'de.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

<!-- run-task dolduracak -->

---

## Sonuç Özeti

<!-- Task tamamlanınca doldurulacak -->

---

**Oluşturulma:** 2026-09-22
