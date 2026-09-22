# TASK-2.07: Talep sahibine onay e-postası ve `notify_lead`'in gerçek sonucu (B-059)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`)
**Feature:** F3.3: E-posta bildirimi
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.05 ✅ önerilir (ekran onayı düzeldikten sonra ikinci kanal eklenir — ikisi aynı dikişin iki yüzü)

---

## Hedef

Demo talebini gönderen ziyaretçiye **onay e-postası** göndermek (v1'de var, v2'de yok) ve depo kaydındaki `notify_lead` alanına gerçek sonucu yazmak: gönderildi / gönderilemedi / ziyaretçi e-posta vermedi.

Task, gerçek bir talepte hem ekibe hem talep sahibine e-posta gittiğinde, `notify_lead` kalıcı `pending` olmaktan çıktığında ve sözleşme bataryası üç durumu da sınadığında tamamlanmış sayılır.

---

## Bağlam

**Neden bu fazda:** Faz 1'in kapanışı ekran onayının mobilde görünmemesi (B-055) ile onay e-postasının yokluğunu **tek dikiş** olarak işaretlemişti — ikisi üst üste geldiğinde ziyaretçi talebinin ulaştığını hiçbir kanaldan öğrenemiyor. Ekran onayı bu fazda düzeldiği için e-posta ayağı da burada kapanır (kullanıcı kararı, discuss 2026-09-22). Altyapı kurulu (Resend, doğrulanmış alan adı), iş küçük.

**`notify_lead` kararı geçersiz kılındı** (kullanıcı kararı, research 2026-09-22): 2026-09-14 «Bildirim durumu» kararının dayanağı *"v2 talep sahibine e-posta göndermiyor"* idi; onay e-postası açıldığı için dayanak düştü. Alanın kalıcı `pending` kalması alan adı geçişinden sonra iki dönemin kaydını okunamaz kılardı — geçişten sonra v1 ve v2 **aynı koleksiyonu** paylaşacak. Yeni karar `docs/DECISIONS.md`'ye **yeni kayıt** olarak yazılır, eskisi geçersiz kılınır (append-only).

**v1'in karşılığı** (referans, salt okunur): `../Alpfitplus-website.v1/api/demo.ts:314-321` (`LEAD_CONFIRMATION`, `leadHtml`), `:339-345` (`to: [email]`, `reply_to: mailer.to`), `:358-360` (`notifyLead = !email ? 'skipped' : leadMailed ? 'sent' : 'failed'`), `:363-371` (PATCH gövdesi).

**B-059'un kalan iki ayağı bu fazda değil** — yasal metnin v1'den az bilgi vermesi ve depo alanlarının pariteler listesi alan adı geçişi fazında kalır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-059-alan-adi-gecisinde-v1-davranislari-geriler.md` — üç ayak, v1 satır çapaları
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 kabul kriterleri ve edge case'ler
- `_dev/docs/CLAIMS.md` — e-posta metni de bir iddia yüzeyidir (pilot cümlesi ve fiyat tek kaynaktan)
- `src/app/api/demo/route.ts:140-230` — depo yazımı, `notifyStore`, `toEmail`
- `tests/api-demo.test.ts` — sözleşme bataryasının bugünkü deseni
- `_dev/memory/hiz-sinirli-uca-test-bataryasi.md` — senaryo başına ayrı IP

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/docs/DECISIONS.md` — **yeni kayıt:** `notify_lead` gerçek sonucu taşır; 2026-09-14 kararı geçersiz kılındı (gerekçesiyle)
- `_dev/modules/M3-Lead-Hatti.md` → F3.3 — onay e-postası kabul kriteri olarak eklenir
- `_dev/bulgular/B-059-*.md` — (1) ve (2) ayaklarının Çözüm Kaydı; atom **açık kalır** (3. ayak geçiş fazında)

---

## Alt Görevler

- [ ] **1. Onay e-postası**
  - Ziyaretçi e-posta verdiyse `toEmail` akışına ikinci bir gönderim eklenir: alıcı talep sahibi, `reply_to` ekip adresi
  - Metin `src/content/` tonuyla ve **iddia sınırıyla** uyumlu; dönüş süresi vaadi sitedeki mevcut vaatle **aynı** olmalı (üç farklı süre sorunu B-026'da kayıtlı — yeni bir süre icat etme)
  - Ekip bildirimi başarısız olsa bile talep sahibine gönderim denenir ve tersi; ikisi birbirini **bloke etmez**

- [ ] **2. `notify_lead`'i gerçek sonuçla yaz**
  - PATCH gövdesi `{notify_team, notify_lead}` olur; `notify_lead` ∈ `sent` / `failed` / `skipped` (ziyaretçi e-posta vermediyse)
  - `route.ts:161-167`'deki bugünkü gerekçe yorumu **silinmez, güncellenir** — neden değiştiğini (dayanağın düşmesini) yanında taşır

- [ ] **3. Sözleşme bataryasını genişlet**
  - `tests/api-demo.test.ts`: e-postalı talep → `notify_lead: "sent"` (gönderim başarılıysa), e-postasız talep → `"skipped"`, sağlayıcı reddederse → `"failed"`
  - Ziyaretçinin yanıtı (HTTP durumu) bu üç dalda da **değişmez** — onay e-postası dönüşü geciktirmez, `200`'ü `503` yapmaz

---

## Etkilenen Dosyalar

```
src/app/api/demo/
└── route.ts                # onay e-postası + notify_lead — zaten var
tests/
└── api-demo.test.ts        # üç dal için sözleşme senaryoları — zaten var
_dev/docs/DECISIONS.md      # notify_lead kararının yenisi — zaten var
```

---

## Dikkat Noktaları

- **Sıra değişmez:** dayanıklı kayıt → ekip bildirimi → talep sahibi onayı. Onay e-postası **hiçbir koşulda** kaydın önüne geçmez (`modules/M3-Lead-Hatti.md` → Teknik Notlar; v1 denetiminin dersi).
- **Ziyaretçinin yanıtını geciktirme.** Onay gönderimi ucun dönüş süresini uzatmamalı; zaman aşımı `toEmail`'in bugünkü deseniyle aynı sınırda kalır.
- **`DEMO_FROM` alan adı doğrulanmış olmalı** — değilse sağlayıcı reddeder (`modules/M3-Lead-Hatti.md` → F3.3 edge case). Reddin `notify_lead: "failed"` olarak kaydedilmesi beklenen davranıştır, hata değil.
- **Bal küpü dolu istek onay e-postası tetiklemez** — bugünkü kural: bal küpü 200 döner ama kayıt yazmaz; aynı dal e-posta da göndermemeli (bot doğrulaması sağlanmaz).
- **Kişisel veri:** e-posta gövdesi ölçüme ya da modele gitmez (`QUALITY.md` → 2 Güvenlik).
- **Yasal metin etkisi:** talep sahibine gönderim yeni bir işleme amacı değildir (iletişim zaten onaylanmış) ama TASK-2.16'nın onay metni kapsamı bu davranışla **tutarlı** olmalı — iki task birbirini kontrol eder.

---

## Test Kriterleri

- [ ] `docker compose exec web npm test` yeşil; `tests/api-demo.test.ts` üç yeni dalı (`sent` / `skipped` / `failed`) kapsıyor
- [ ] E-postalı gerçek talepte **iki** e-posta gidiyor: ekip adresine bildirim, talep sahibine onay (sağlayıcı yanıtı rakamıyla dokümana)
- [ ] E-postasız talepte tek e-posta gidiyor ve `notify_lead: "skipped"` yazılıyor
- [ ] Onay gönderimi başarısız olsa bile uç `200` dönüyor ve kayıt yazılmış durumda (fail-open yalnız **bildirim** katmanında)
- [ ] Bal küpü dolu istek: kayıt yok, onay e-postası yok, HTTP `200` (bot yanıltma korunuyor)
- [ ] Yerel depoya karşı uçtan uca tur: kayıtta `notify_lead` alanı `pending` **değil** (kayıt kimliğiyle dokümana)
- [ ] `npm run build` hatasız

---

## Risk ve Geri Dönüş Planı

- **İkinci gönderim ucun süresini uzatırsa** ziyaretçi bekler → gönderim ekip bildirimiyle paralel yapılır ya da yanıt sonrası tetiklenir; ölçüm (uç süresi) dokümana yazılır.
- **Rollback:** `route.ts` tek dosya; `notify_lead` alanı geri `pending`'e döner (depo şeması değişmiyor, veri kaybı yok).

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
