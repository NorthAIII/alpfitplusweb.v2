# Doküman Kuralları

← CLAUDE.md · doktrin: doküman kuralları

> Bu dosya parent `CLAUDE.md`'nin bölme çocuğudur ve oraya **import edilir** (parent kökteyse `@_dev/claude/DOKUMAN-KURALLARI.md`, `.claude/` altındaysa `@../_dev/claude/DOKUMAN-KURALLARI.md` — göreli yolun tabanı parent'ın kendi klasörüdür) — içeriği her oturumda bağlamdadır. Parent'taki aynı adlı bölüm özet + pointer tutar; **tam metin burasıdır**. Doktrin dört kardeş dosyaya bölünmüştür (`DOKUMAN-KURALLARI` · `DOKUMAN-DISIPLINI` · `CALISMA-PRENSIPLERI` · `COMMIT`) ve **dördü de aynı anda bağlamdadır**; burada bulamadığın bir bölüm adı kardeş dosyadadır — tam listeyi parent'ın "Doktrin Dosyaları" bloğu tutar.

---

## Doküman Kuralları

**ÖNEMLİ:** Tüm geliştirme dokümanları `_dev/` klasöründedir. Projenin kendi dokümanlarıyla (README.md, docs/ vb.) KARIŞMAZ. `_dev/` izolasyonunu her zaman koru.

### Dokunulmaz Dokümanlar — çekirdek/sabit; rutin işte değiştirme:
- `_dev/tasks/TASKS-README.md` — DevFlow task-sistem **çekirdek protokolü**. "Dokunulmaz" = bu protokolün gövdesini yeniden yazma/silme (drift koruması); "hiçbir şey eklenemez" demek değil. Proje-özel süreç disiplini eklemek istiyorsan buraya değil, memory'nin "Süreç Disiplinleri" kategorisine yaz (→ `DOKUMAN-DISIPLINI.md` → Bilginin Doğru Evi).
- [PROJEYE_ÖZGÜ_SABİT_DOKÜMANLAR]

> **Bayatlama notu:** Statik/korumalı dokümanlar (yukarıdaki sabitler, OVERVIEW) rutin işte değişmez ama tam da hiç dokunulmadığı için zamanla gerçeklikten kopabilir (sessiz bayatlama). Çözüm dokunmamak değil, **bilinçli mutabakat**: `audit-docs` (ve versiyon sonu prd-review önerisi) gerçeklik-drift'ini tarar, bulguyu **açık onayınla** günceller. ILKELER değer/yön-temellidir — bayatlaması audit gerçeklik-mutabakatıyla değil, prd-review'da deneyimle bilinçli yeniden değerlendirmeyle ele alınır.
>
> **Tarihsel/append-only doküman kuralı:** `_dev/tasks/archive/*`, `_dev/bulgular/archive/*`, PHASES.md'de kapanış damgası (`✅` ya da `⚠️`) almış `_dev/phases/PHASE-N.md` (ve bölme çocukları `PHASE-N-*.md`), `_dev/docs/DECISIONS.md`, `_dev/tasks/TASKS-README.md` için **içerik dondurulur** ama **biçim güncellenebilir**. audit yalnızca **içerik-koruyan reformat** yapar (yeni template yapısına hizalama); anlam, kayıt ve sıra korunur; raporda **"tarihsel reformat"** olarak işaretlenir. İçeriği koruduğu için kap işlemidir → Onay Ölçütü'ne göre uygulanır ve bildirilir. DECISIONS'a yeni karar / `Superseded` etiketi audit'in işi değildir (`review-phase` / `prd-review`); audit yalnızca çelişki/drift fark ederse raporlar. TASKS-README'de çekirdek protokole hizalayan **protokol-migration** meşrudur (içerik-koruyan). Bunların dışında tarihsel dokümanın anlamına/sırasına dokunulmaz.

### Korumalı Dokümanlar — anlamını değiştirmeden önce kullanıcıya bildir, onay al:

> Sınıfın koruduğu **anlam ve yöndür**. İçerik işlemi (bir iddianın/ilkenin/kuralın değişmesi) burada her zaman onay ister — kanıt kesin olsa bile. Kap işlemi (kırık bağ onarımı, placeholder kalıntısı, eksik bölüm/KURAL'ın geri konması) yapılır ama **asla sessizce değil**: raporda tek satırla bildirilir. Ölçütün tam metni → `DOKUMAN-DISIPLINI.md` → Onay Ölçütü.

- `_dev/OVERVIEW.md` — Proje kimliği (nadiren değişir). **Yalnızca statik bilgi** içerir (kimlik, stack, amaç, kapsam); dinamik bilgi (aktif faz/task, ilerleme, faz numarası) buraya yazılmaz — onların evi DURUM.md'dir.
- `_dev/ILKELER.md` — Proje ilkeleri (yön/öncelik; nadiren ve bilinçli değişir). Doğal güncelleme noktaları prd/prd-refine/prd-review (zaten interaktif). Karar-şekillendiren diğer fazlarda (kickoff/discuss/research/plan) **okunur ve önerileri yönlendirir ama sessizce değiştirilmez** — bir ilkenin değişmesi gerekiyorsa kullanıcıya getir. Yalnızca yön/öncelik tutar; somut teknik kural buraya değil "Projeye Özgü Kurallar"a, değerlendirme ekseni QUALITY'ye gider.
- `_dev/GIT-STRATEJI.md` — Dal modeli ve yayın kuralları (nadiren ve bilinçli değişir). Her oturumda **okunur ve uygulanır ama sessizce değiştirilmez**; strateji değişimi kendi akışıyla yapılır (kurulum `kickoff-verify`, sonradan `/devflow:quick` ya da `prd-review`).

### Rutin Güncellenen Dokümanlar:
- `_dev/INDEX.md` — Yeni **içerik dokümanı** (modül, docs, PRD içerik, projeye özgü sabit) oluşturulduğunda güncelle. Task/faz gibi sıralı dokümanlar INDEX'e enumere edilmez.
- `_dev/DURUM.md` — Her task sonunda güncelle
- Aktif task dokümanı — Her task sonunda güncelle

---

## Dokümantasyon İlkeleri

- **Doküman oluşturmaktan çekinme.** Gerekli gördüğün her bilgi kendi dokümanını hak eder.
- **Tekrarlayan bilgi yazma.** Bir bilgi tek yerde olmalı, diğer yerlerden referans ver.
- **İleriye dönük düşün.** Sonra lazım olacak bilgiler için şimdiden doküman aç.
- **INDEX.md'yi güncelle.** Yeni bir **içerik dokümanı** (modül, docs, PRD içerik, projeye özgü sabit) oluşturduğunda INDEX.md'ye ekle. Task ve faz dokümanları INDEX'te tek tek enumere edilmez — güncel listeleri DURUM.md ve PHASES.md'de tutulur, INDEX yalnızca klasör konumunu gösterir.
- **INDEX.md'ye sadece mevcut dokümanları yaz.** Henüz oluşturulmamış dokümanları referans etme.
- **Her şey `_dev/` içinde.** Yeni dokümanlar `_dev/` klasöründe oluşturulur.
- **Projeye özgü bilgileri `_dev/` içinde tut.**
  - Geliştirme sırasında öğrenilen her bilgi proje dokümanlarına yazılmalı — Claude Code'un local memory'si (`~/.claude/`) proje bilgisi için kullanılmaz.
  - Bilgi uygun dokümana gider: kararlar → `docs/DECISIONS.md`, kalite → `QUALITY.md`, vb. Başka dokümana uymayan öğrenimler → `_dev/memory/<slug>.md` (MEMORY.md index'ine pointer eklenir).
  - Böylece repo taşındığında hiçbir bilgi geride kalmaz.

---
