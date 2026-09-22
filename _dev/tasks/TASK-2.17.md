# TASK-2.17: Ölçüm ve aktarım beyanları ölçülene göre yazılır (B-024 k.2, ölçüm cümleleri)

**Durum:** ⬜ Bekliyor

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** M1 — İçerik ve İddia Kaynağı (`modules/M1-Icerik-ve-Iddia-Kaynagi.md`)
**Feature:** F1.1 (yasal içerik) · M7 F7.4 (analitik gerçeği)
**Faz:** Phase 2 (`phases/PHASE-2.md`)
**Bağımlılıklar:** TASK-2.01 (nginx ölçümü — metin ona göre yazılır) · TASK-2.16 (aynı dosya, listeler önce hizalanır)

---

## Hedef

Yasal metnin **ölçüm** ve **aktarım** beyanlarını ölçülmüş gerçeğe hizalamak. Bugün üç cümle fazlasını söylüyor: `legal.ts:199` *"Bu ölçüm … kayıtlarında IP adresinizi tutmaz"*, `:116` *"bu ölçüme kişisel verileriniz aktarılmaz"*, `:68` *"Formu doldurmadan siteyi yalnızca gezdiğinizde, sizden kimlik veya iletişim verisi toplanmaz"* — oysa ölçüm betiği kendi sunucumuzdan yüklendiği için her ziyaretçinin ham IP'si önündeki nginx'in erişim kaydına düşüyor.

Aynı turda aktarım maddesinin **olgu** tarafı tamamlanır: tedarikçilerin hangi ülkede veri işlediği yazılır (e-posta sağlayıcısı bir aktarım hedefidir).

Task, üç ölçüm cümlesi TASK-2.01'in bulgusuna göre yeniden yazıldığında ve tedarikçi ülkeleri olgu olarak anıldığında tamamlanmış sayılır.

---

## Bağlam

**Ölçümün zemini** (B-024, 2026-09-22): v1 tarafında 2026-07-28'de ölçüldü — `bunker-nginx` erişim kaydı `/dev/stdout` → Docker `json-file`, `daemon.json` yok, rotasyon yok, log sınırsız büyüyor (o gün 188 MB), içinde **her isteğin ham IP'si ve user-agent'ı** duruyor. Umami veritabanında IP sütunu olmaması bunu değiştirmiyor. O kaydın kendi cümlesi: *"Yasal metinde 'IP saklanmaz' cümlesi bu yüzden olduğu gibi yazılamaz; süre de yazılamaz, çünkü bugün sınırlı değil."*

**Bugünkü hâli TASK-2.01 ölçüyor.** Metin ona göre yazılır — uydurma süre vaadi verilmez (kullanıcı kararı, discuss 2026-09-22).

**Sunucu düzeltmesi (rotasyon / IP maskeleme) bu fazın işi değil** — altyapı tarafı (`altyapi/vps`), bu repo değil; fazı **kilitlemez** (`ILKELER.md` → proje-dışı iş faz bitişini kilitlemez). Faz yalnız ölçer ve metni ölçülene göre yazar.

**Aktarımın olgu tarafı:** `legal.ts:100` kayıt sunucusunun konumunu zaten yazıyor (Almanya, Nürnberg — TASK-1.15). Eksik olan tedarikçilerin ülkesi: v1'in ölçümü e-posta sağlayıcısının müşteri verisini **ABD'de** sakladığını kaydediyor (`../Alpfitplus-website.v1/_dev/memory/bunker-ortami.md:99-104`; İrlanda yalnız gönderim bölgesi). **Hukuki dayanak (KVKK m.9) bu fazda kurulmaz** — hukukçunun işi (B-008); metin olguyu söyler, sebebi hukukçuya bırakır.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/TASK-2.01.md` → Oturum Kaydı — **bugünkü nginx gerçeği**; metin bundan yazılır
- `_dev/bulgular/B-024-*.md` → "🔴 gerekçesi" ve "Yeniden ölçüm" blokları
- `../Alpfitplus-website.v1/_dev/memory/bunker-ortami.md:84-104` (salt okunur) — v1'in ölçümü, sağlayıcı veri konumu
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — Umami kurulumunun gerçeği
- `_dev/bulgular/B-059-*.md` → (3) — v1'in metni aktarım dökümünü yazıyor; geçişte gerileme olmasın
- `src/content/legal.ts:60-120, 180-215`

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — task durumu ve özet
- `_dev/phases/PHASE-2.md` — Task Listesi tablosunda durum
- `_dev/BULGULAR.md` + `_dev/bulgular/B-024-*.md` — **atom bu task'ta kapanır**; kapanış kaydı **hukuki dayanak ayağının hukukçuda kaldığını** açıkça yazar (B-008'e bağlı)
- `_dev/docs/DECISIONS.md` — ölçüm beyanının nasıl yazıldığı ve neden süre vaadi verilmediği

---

## Alt Görevler

- [ ] **1. Üç ölçüm cümlesini yeniden yaz**
  - `:199` "IP adresinizi tutmaz" · `:116` "kişisel verileriniz aktarılmaz" · `:68` "yalnızca gezdiğinizde … toplanmaz"
  - Yeni metin TASK-2.01'in ölçümünü anlatır: ölçüm sisteminin **ön kapısındaki** erişim kaydı, ne tutuluyor, ne kadar süre (ölçüldüyse; ölçülmediyse süre **yazılmaz**)
  - Umami'nin kendi veritabanında IP tutmaması doğru bir olgudur ve korunur — ama "ölçüm" kelimesinin kapsamı daraltılır

- [ ] **2. Aktarım maddesinin olgu tarafı**
  - Tedarikçi listesine (`legal.ts:104-112`) her birinin veri işleme ülkesi eklenir; e-posta sağlayıcısı **yurt dışı** aktarım hedefi olarak anılır
  - Hukuki sebep bölümü (`legal.ts:91`) **değişmez** — m.9 dayanağı hukukçuya bırakılır ve bu boşluk metinde dürüstçe durur (uydurulmaz)
  - `legal.ts:147`'deki "aktarıldığı üçüncü kişileri bilme" hakkı artık gerçek bir dökümle karşılanıyor

- [ ] **3. Sunucu tarafını doğru eve kaydet**
  - Düzeltme gerekiyorsa (rotasyon / IP maskeleme) `BULGULAR.md` → Gelen Kutusu'na `[TASK-2.17]` işaretli tek satır; iş `altyapi/vps` tarafına aittir
  - Bu satır fazı **kilitlemez**

---

## Etkilenen Dosyalar

```
src/content/
└── legal.ts                    # ölçüm cümleleri + tedarikçi ülkeleri — zaten var
_dev/docs/DECISIONS.md          # ölçüm beyanının kaydı — zaten var
_dev/BULGULAR.md                # gerekirse altyapı satırı — zaten var
```

---

## Dikkat Noktaları

- **Ölçülmemiş şey yazılmaz.** TASK-2.01 bir süre ölçmediyse metin süre vaat etmez; "bugün sınırlı değil" demek, uydurma bir süre yazmaktan dürüsttür.
- **Sağlayıcı veri konumu bayatlayabilir** — v1'in ölçümü 2026 tarihli; metin sağlayıcıyı adıyla ve ülkesiyle anarken kaynağı task kaydında durur. Emin olunamayan bir konum yazılmaz.
- **Hukuki sebep boşluğu bilinçlidir ve gizlenmez.** Metin olguyu söyler; dayanak hukukçu onayıyla gelir (B-008). Uydurma bir madde numarası yazma.
- **v1'den gerileme olmasın** (B-059 kalem 3): v1'in canlı metni aktarım dökümünü yazıyor — v2 geçiş gününde **daha az** bilgi vermemeli.
- **"Ölçüm" kelimesinin kapsamı** ziyaretçi için ölçüm sisteminin tamamıdır; cümleyi daraltırken ziyaretçinin anlayacağı dilde kal (`STYLE-GUIDE` → Metin Tonu).
- **B-060 bu cümleleri de çivileyecek** (TASK-2.18) — metin son hâlini burada alır.

---

## Test Kriterleri

- [ ] Üç ölçüm cümlesi TASK-2.01'in bulgusuyla **çelişmiyor**; her cümlenin dayanağı ölçüm çıktısına çapalı (eşleme dokümana)
- [ ] Hiçbir cümlede ölçülmemiş süre ya da ölçülmemiş sağlayıcı davranışı yok
- [ ] Tedarikçi listesi her sağlayıcının veri işleme ülkesini söylüyor; e-posta sağlayıcısı yurt dışı aktarım hedefi olarak anılıyor
- [ ] Hukuki sebep bölümü değişmedi ve eksikliği metinde dürüstçe duruyor (uydurma madde yok)
- [ ] v1'in canlı metniyle karşılaştırma yapıldı: v2 hiçbir kalemde **daha az** bilgi vermiyor (B-059 kalem 3 çapası)
- [ ] `a11y.mjs` TOPLAM SORUN: 0 · `font-guard.mjs` kümede olmayan karakter yok · `scan.mjs` üç yasal sayfada konsol temiz
- [ ] `docker compose exec web npm test` yeşil · `npm run build` hatasız

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
