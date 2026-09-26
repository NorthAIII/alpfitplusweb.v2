# TASK-4.18: Geçiş anı — yayın, üç canlı değer, alan adı taşıma, yeniden derleme, canlı ölçüm ve işaretli test talebi

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md) · M3 (canlı kayıt)
**Feature:** F7.5 Alan adı geçişi ve 301 haritası · F3.2 Dayanıklı kayıt · F7.4 Analitik
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** TASK-4.15 ✅ (gelen posta) · TASK-4.16 ✅ (ücretli plan) · TASK-4.17 ✅ (prova yeşil, envanter kesişimi tamam)

---

## Hedef

Kullanıcının **"şimdi"** tetiğiyle, komut satırından, **her adım öncesi ve sonrası ölçülerek**: yayın kapısı → `dev` → `main` birleştirmesi → Production env'in üç canlı değeri → apex ve `www` v1 projesinden v2'ye **tek çağrıyla** taşınır (`www` kalıcı 301) → **yeniden derleme** → geçiş betiği canlıya karşı `BEKLENEN_ASAMA=production` yeşil → işaretli tek test talebi canlı koleksiyona düştü ve ekip bildirimi gitti → kullanıcı onayıyla silindi. Geri dönüş kuralı adım adım hazır.

Tamam sayılır: milestone'un geçişe ait bütün kalemleri canlıda ölçülmüş; v1 projesi alan adlarından ayrılmış ama duruyor.

---

## Bağlam

Kapsam kararları: geçiş anını Claude yürütür, tetik kullanıcıda; v1 projesinden **yalnız alan adları** ayrılır, proje silinmez; alan adı bağlandıktan sonra **yeniden derleme zorunludur** (aşama derleme anında `VERCEL_PROJECT_PRODUCTION_URL`'den türüyor — `src/lib/stage.ts`); canlı kaydın kanıtı işaretli tek test talebidir çünkü iki koleksiyon da `201` döner ve yanlış token gerçek talepleri **sessizce** önizlemeye gönderir.

Araştırma → Sıra şartları: **env yaz → taşı → yeniden derle; arada `main`'e push olmaz.** Canlı token taşımadan önce bir derlemeye girerse `.vercel.app`'teki (aşama `preview`) her derleme canlı `leads` koleksiyonuna yazar. Taşıma → yeniden derleme penceresi ~20-30 sn (son 10 dağıtım 19-32 sn); o pencerede apex eski dağıtımı gösterir (aşama `preview` → `noindex` + `robots.txt Disallow`). Yeniden derleme **redeploy**'dur; eski dağıtımı **promote** etmek aşamayı değiştirmez.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/GIT-STRATEJI.md` → Yayın (akış) · Acil Düzeltme (geri dönüş) · Otonomi Sınırı
- `_dev/phases/PHASE-4.md` → Kapsam Tartışması (tamamı) · Araştırma Bulguları → Sıra şartları · Teknik Kararlar 1, 8 · `_dev/phases/PHASE-4-ARASTIRMA.md` → Dikkat Edilecekler → Sıra şartları ve Parite ve yüzey (env değerlerinin kaynağı, Umami kimliği, HSTS)
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5 Edge Case'ler — üç env değeri ve unutulursa ne olur
- `_dev/memory/vercel-proje-kimlikleri.md` — kimlik yolu, `vercel api`, proje/takım kimlikleri
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — sunucuya SSH, lead deposunda **salt-okunur** okuma modu (`-wal` varken `mode=ro`, yokken `immutable=1`)
- `_dev/tasks/archive/TASK-4.17.md` — prova tablosu

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`
- `_dev/GIT-STRATEJI.md` → Uzak Bağlantı ve Dallar: `main` artık `alpfitplus.com` (canlı) — korumalı, raporda tek satır
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.5
- `_dev/memory/vercel-proje-kimlikleri.md` — Production env kayıtlarının yapısı (anahtar/hedef, değer yok)

---

## Alt Görevler (akış — her adım kullanıcı onayıyla)

- [ ] **0. Ön koşul** — 4.15 · 4.16 · 4.17 ✅; ağaç temiz; kullanıcı "şimdi" dedi.
- [ ] **1. Yayın kapısı** — 3100 taze imaj (`dev` HEAD): `a11y.mjs` (TOPLAM SORUN 1 · çıkış 1 — B-063 kalemi hariç 0), `mobile-audit.mjs`, `font-guard.mjs`, `perf.mjs`, `scan.mjs`; `npm test`; tip kontrolü; geçiş betiği. Kırmızı → **dur**.
- [ ] **2. Yayın** — kullanıcı "yayınla" → GIT-STRATEJI → Yayın akışı. Üretim derlemesi Ready (aşama hâlâ `preview`, `.vercel.app`); betik `.vercel.app`'e karşı `BEKLENEN_ASAMA=preview`.
- [ ] **3. Env — derleme tetiklemeden:**
  - Paylaşılan `LEAD_STORE_TOKEN` ve `IP_HASH_SALT` kayıtları **`preview`'a daraltılır** (değer korunur).
  - `production` için yeni kayıtlar: `LEAD_STORE_TOKEN` ← sunucu `/opt/alpfit-lead/.env` → `LEAD_TOKEN_PRODUCTION` · `IP_HASH_SALT` ← v1 projesinin Production kaydı (tür `encrypted` → API ile okunur) · `NEXT_PUBLIC_UMAMI_WEBSITE_ID` = `66838f35-2adf-4da0-a21e-086f5f050dde` (sır değil). İki sır **boru hattıyla** taşınır — ekrana, dosyaya, kayda düşmez; çağrıların biçimi Vercel belgesinden doğrulanır.
  - Sonra anahtar/hedef/tür listesi (değer yok) → beklenen tabloyla karşılaştırma.
  - ⚠️ Bu adımla 5. adım arasında `main`'e push **yok**.
- [ ] **4. Taşıma** — `POST /v1/projects/{v1}/domains/alpfitplus.com/move` (gövde: v2 proje kimliği) ve `www.alpfitplus.com` (yönlendirme apex, `redirectStatusCode: 301`); çağrı gövdeleri belgeden doğrulanır. Öncesi ve sonrası iki projenin alan adı listesi.
- [ ] **5. Yeniden derleme** — v2'nin 2. adımdaki üretim dağıtımının **redeploy**'u → Ready.
- [ ] **6. Canlı ölçüm** — `BASE=https://alpfitplus.com`, `BEKLENEN_ASAMA=production`: yönlendirme (host grubu dahil — `www` 301, `.vercel.app` 301, `alpfitplus-website.vercel.app` → apex), başlık, dizin (üç katman açık, `robots.txt` site haritasını beyan ediyor), kart (canonical / `og:image` / site haritası 200 ve alan adı — B-027'nin canlı ayağı). HTML'de Umami etiketi v1 kimliğiyle ve `data-tag=production`.
- [ ] **7. Talep hattı** — canlıdan işaretli tek test talebi ("TEST — silinecek", kendine özgü e-posta adresi) → sunucuda **salt-okunur** teyit: kayıt `leads`'te (`leads_preview`'da değil), `env=production`, `ip_hash` dolu, `notify_team=sent`; Resend'de ekip bildirimi `delivered`. Silme yöntemi Karar Noktası; kullanıcı onayıyla silinir ve silindiği salt-okunur okumayla teyit edilir.
- [ ] **8. Geri dönüş kuralı** — 6 ya da 7'de **talep hattı ya da sitenin açılması** bozuksa aynı taşıma ucu tersine (hedef v1) **hemen**; kısmi kırmızıda (tek adres, tek başlık) 30 dk ileri düzeltme (`dev`'de düzelt → kapı → yayın), olmazsa geri.
- [ ] **9. v1 projesi** — alan adları ayrıldı, proje duruyor, `alpfitplus-website.vercel.app` ona bağlı (API).
- [ ] **10. Kayıtlar** — GIT-STRATEJI, M7, memory, DURUM.

---

## Etkilenen Dosyalar

```
_dev/GIT-STRATEJI.md                    # main → alpfitplus.com (canlı)
_dev/modules/M7-Yayin-ve-Altyapi.md
_dev/memory/vercel-proje-kimlikleri.md
```

Kod dosyası değişmez (değişiklik gerekirse 8. adımın ileri düzeltme rotası).

---

## Dikkat Noktaları

- **Yayın dalına dokunan iş otonom başlamaz** (GIT-STRATEJI → Otonomi Sınırı): her adım kullanıcı onayıyla; taşıma ve test kaydının silinmesi **ayrıca** onay ister (Kullanıcı Tercihleri).
- Değerler hiçbir çıktıya, dosyaya ya da kayda basılmaz; `vercel api` env dizisinden yalnız anahtar/hedef/tür.
- Canlı token yanlışsa talepler **sessizce** önizlemeye gider (iki koleksiyon da `201`) — 7. adımın koleksiyon teyidi bu yüzden şarttır, "201 döndü" yetmez.
- HSTS `includeSubDomains; preload` apex'te devreye girer: `www` ve `lead` HTTPS (araştırma ölçtü), `app.` NXDOMAIN. Önyükleme listesine başvuru yapılmaz.
- Google `robots.txt`'yi ~24 saat önbellekleyebilir; pencereye denk gelen tarama bir gün gecikebilir (risk kabul — araştırma). Yeni site haritasının bildirimi TASK-4.19.
- Bu oturumun kendi commit'i `dev`'e gider; `main`'deki birleştirme commit'i 2. adımda push edilmiştir (akışın parçası).
- Umami sayımının v1 kaydında görünmesi ve Search Console bildirimi zaman ister — TASK-4.19.

---

## Karar Noktaları

- **Test kaydının silinmesi** (canlı depoya yazmaktır; superuser kimliği projede yok): (a) kullanıcı depo panelinden siler; (b) geçici bir yönetici hesabıyla API üzerinden silinir, hesap hemen kaldırılır; (c) sunucuda veritabanına doğrudan yazma. **Öneri (a)** — (c) canlı veritabanına ajan yazması demektir. Task başında kullanıcıya sorulur.

---

## Test Kriterleri

- [ ] Yayın kapısı yeşil (a11y'nin B-063 kalemi hariç okunarak); `main` = `dev` birleştirmesi `--no-ff`
- [ ] Env tablosu: iki paylaşılan kayıt yalnız `preview`; `production`'da üç yeni kayıt; hiçbir değer basılmadı — **kanal: UAT** (üç değerin üçü de fazın UAT senaryosu — Faz 2 retrosunun kaydı)
- [ ] Taşıma sonrası: apex ve `www` v2 projesinde; `www` → apex **301**; v1 projesi duruyor
- [ ] Canlı betik: **✓ KAPI YEŞİL** (host grubu dahil); aşama `production`, üç `noindex` katmanı kalktı
- [ ] Test talebi `leads` koleksiyonunda (`leads_preview`'da değil), `env=production`; bildirim `delivered`; kullanıcı onayıyla silindi ve silindiği teyit edildi — **kanal: UAT**
- [ ] Geri dönüşe gerek kalmadı — ya da kalmışsa hangi adımda, hangi gerekçeyle ve geri taşımanın ölçümü kayıtta

---

## Risk ve Geri Dönüş Planı

- **Talep hattı ya da site bozuk:** alan adı aynı uçla v1'e geri taşınır (DNS değişmez, apex zaten Vercel'e bakıyor — B-043); v1 dağıtımı hiç dokunulmadığı için olduğu gibi ayağa kalkar.
- **Env yanlış:** yeniden derlemeden önce anahtar/hedef tablosuyla yakalanır; derlemeden sonra yakalanırsa düzelt → yeniden derle (arada gelen talepler önizleme koleksiyonunda aranır).
- **Rollback (kod):** `main`'de ileri düzeltme; dosya bazlı geri alma — ağaç-geneli komut yok.

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
