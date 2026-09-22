# TASK-2.14: Denetimin ad dalı temizlik tablosundan beslenir (B-018)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M5 — Görsel Varlık Hattı (`modules/M5-Gorsel-Varlik-Hatti.md`)
**Feature:** F5.1: Ürün ekran görüntüsü hattı
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.13 (temizlik önce oturur; güçlenen denetim yeşil koşabilmeli)

---

## Hedef

Görsel denetimin ad dalını **temizliğin kalıbından bağımsızlaştırmak**: `auditTexts` artık iki-tam-sözcük regex'iyle ad aramaz; `REPLACEMENTS`/`INITIALS` tablosundaki **her adın her parçasını** (ad, soyadı, kısaltılmış hâlleri) yasaklı sözcük olarak arar.

Task, denetim tablodan beslenip hat yeşil koştuğunda ve kasıtlı olarak enjekte edilen bir ad sızıntısını **yakaladığı** gösterildiğinde tamamlanmış sayılır.

---

## Bağlam

Kök neden ölçüldü: denetim, temizliğin kendi kalıbıyla **aynı varsayımı** paylaşıyor (ad = iki tam sözcük), dolayısıyla temizliğin kaçırdığını yapısal olarak göremiyor. *"Bağımsız olmayan bir denetim, denetim değil teyittir."*

- `screen-cleanup-v2.mjs:97` → `const full = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g`
- "Gizem Ö." ikinci sözcük tek harf olduğu için uymuyor; "Simge & Gizem" araya `&` girdiği için uymuyor.

**Seçilen yaklaşım (b)** (research 2026-09-22): denetim tablodan beslenir. Reddedilen (a) — ad kalıbını genişletmek: *"kalıbı büyütmek körlüğü taşır, kaldırmaz; tablo kaynağın gerçeğidir, regex bir tahmindir."*

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-018-urun-gorselinde-sizinti-denetimi-kacirdi.md` → Kök Neden Yönü + Koruma Önerisi
- `_dev/phases/PHASE-2.md` → Değerlendirilen Yaklaşımlar #2
- `research/lib/screen-cleanup-v2.mjs` → `auditTexts`, `AUDIT_ALLOW`, `SHELL`
- `research/lib/screen-cleanup.mjs` → `AUDIT_ALLOW`, `BRAND_LEAK` (v1 tablosu, gövdesi düzenlenmez)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/modules/M5-Gorsel-Varlik-Hatti.md` → F5.1 — denetimin yeni dalı kabul kriterine yansır

---

## Alt Görevler

- [ ] **1. Yasaklı ad sözcüklerini tablodan türet**
  - `REPLACEMENTS`'ın **kaynak** tarafındaki her adın her parçası (ad, soyadı) ve kısaltılmış hâlleri (`Gizem Ö.`, `G. Örge`) yasaklı küme olur
  - `INITIALS`'ın kaynak tarafı da kapsanır (avatar baş harfleri)
  - Küme **türetilir**, elle yazılmaz — tabloya yeni satır girdiğinde denetim kendiliğinden büyür

- [ ] **2. İki-tam-sözcük kalıbını kaldır (ya da ikincil dala indir)**
  - Ad dalı artık tablodan besleniyorsa regex'in asıl işi biter; korunacaksa **neden** korunduğu yorumla yazılır (ör. tabloya hiç girmemiş bir ad için kaba ağ)
  - `AUDIT_ALLOW`'un rolü korunur: kalıp dalı kalırsa izin listesi de kalır

- [ ] **3. Negatif kontrolle sına**
  - Kaynağa geçici olarak bir ad sızıntısı enjekte edilir (ör. `Gizem Ö.` dizgesi) ve denetimin **kırmızı** döndüğü, betiğin sıfır-olmayan kodla çıktığı ve dosya yazmadığı gösterilir
  - Enjeksiyon geri alınır; `../Alpfit.v1` **salt okunurdur** — enjeksiyon kaynak depoya değil, geçici bir kopyaya ya da değerler dizisine yapılır

---

## Etkilenen Dosyalar

```
research/lib/
└── screen-cleanup-v2.mjs      # auditTexts ad dalı tablodan türer — zaten var
```

---

## Dikkat Noktaları

- **Denetim yeşil olmalı ama körlük kapanmalı** — ikisi birlikte. "Yeşil" tek başına kanıt değil; negatif kontrol şart (Alt Görev 3).
- **`../Alpfit.v1` salt okunurdur.** Enjeksiyon oraya yapılmaz.
- **Yanlış alarm riski:** tablodaki nötr **hedef** adlar (`Yasemin U.`, `Cüneyt V.`) çıktıda meşru olarak bulunur — yasaklı küme yalnız **kaynak** taraftan türetilir, hedef taraftan değil. Bu ayrım karıştırılırsa hat hiç yeşile dönmez.
- **`AUDIT_ALLOW` genişletilirken ölçülür:** kapı önce boş izin listesiyle koşulur, raporladığı her kalem kaynakta aranır (v2 tablosunun `grup`/`sube` için kurduğu yöntem, `screen-cleanup-v2.mjs:63-88`). İzin listesine ölçmeden satır eklenmez.
- **İddia dalı bu task'ta değil** — TASK-2.15.
- `auditTexts` saf bir fonksiyondur; saflığı korunur (yan etki, dosya okuma yok).

---

## Test Kriterleri

- [ ] `auditTexts`'in ad dalı `REPLACEMENTS`/`INITIALS`'tan türüyor; elle yazılmış ad listesi yok
- [ ] Hat yeşil koşuyor: 7 `.webp`, denetim sızıntı bildirmiyor
- [ ] **Negatif kontrol:** enjekte edilen "Gizem Ö." dizgesi denetimi kırmızıya çekiyor, betik sıfır-olmayan kodla çıkıyor ve **dosya yazmıyor** (bugünkü kalıp bu dizgeyi kaçırıyordu — kanıt dokümana)
- [ ] İkinci negatif kontrol: "Simge & Gizem" biçimi de yakalanıyor
- [ ] Nötr hedef adlar (`Yasemin U.`, `Cüneyt V.`) yanlış alarm üretmiyor
- [ ] `AUDIT_ALLOW`'a eklenen her satırın gerekçesi yanında yazılı (eklenmişse)
- [ ] Çıktı görseller TASK-2.13'ün sonucuna göre **değişmedi** (denetim değişti, temizlik değil)

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
