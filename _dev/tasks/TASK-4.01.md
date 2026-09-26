# TASK-4.01: İki dallı yayın düzeni — çalışma ayrı dala geçer, canlıya çıkış kullanıcının tetiğine bağlanır

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (modules/M7-Yayin-ve-Altyapi.md)
**Feature:** F7.5 Alan adı geçişi (yayın düzeni) · F7.3 Vercel'de ayrı proje (dal önizlemesinin koruması)
**Faz:** Phase 4 (phases/PHASE-4.md)
**Bağımlılıklar:** Yok

---

## Hedef

Bugün `main` hem çalışma hem yayın dalı ve her push üretim dağıtımıdır. Alan adı bağlandığı gün bu, her faz commit'inin doğrudan canlıya çıkması demektir. Bu task düzeni ikiye ayırır: oturumlar yeni bir **çalışma dalında** (öneri `dev`, adı kullanıcı teyit eder) çalışır ve önizleme o dalın Vercel adresinde yaşar; `main`'e yalnız kullanıcının **"yayınla"** tetiğiyle, elle koşulan tam kontrol setinden sonra `--no-ff` birleştirme girer.

`_dev/GIT-STRATEJI.md` motorun kurulum tarifiyle yeniden yazılır; dal önizlemesinin Vercel girişli kaldığı ölçülür ve otomatik ölçümün o adrese erişmesi için **otomasyon atlatma anahtarı** üretilir. Tamam sayılır: `dev` uzakta var ve oturum o dalda, bir push dal önizlemesi üretti, önizleme anahtarsız girişe yönleniyor ve anahtarla 200 dönüyor, strateji dokümanı yeni modeli bütün zorunlu alanlarıyla beyan ediyor.

---

## Bağlam

Kapsam kararı (kullanıcı, 2026-09-26): yayın iki dala ayrılır, **sıra şartı olarak alan adı bağlanmadan önce** — yoksa geçişten sonraki ilk faz commit'i canlıya çıkar. Yayın kapısı "tam set, elle": beş ölçüm + test paketi + tip kontrolü yayın kopyasına karşı yeşil; `a11y`'nin kayıtlı B-063 kalemi hariç okunur. Geri dönüş kuralı: talep hattı ya da sitenin açılması bozuksa alan adı **hemen** v1'e geri taşınır, kısmi kırmızıda 30 dakika ileri düzeltme denenir.

Araştırma (2026-09-26): dal adresleri (`alpfitplus-web-v2-git-<dal>-north-ai.vercel.app`) ve dağıtıma özgü adresler bugün **302 → Vercel girişi** (proje koruması `all_except_custom_domains`); açık tek adres üretim `.vercel.app`'i. Dal önizlemesi girişli kalır (kullanıcı; `docs/DECISIONS.md` 2026-09-26 md. 6).

---

## Referans Dokümanlar

**Okunması Gereken:**
- `.claude/commands/devflow/lib/git-strategy-kurulum.md` — tarif: probe → teşhis → teyit + değiştirmenin üç ek adımı (iz taraması, dış varsayımlar, ilk yayın penceresi)
- `_dev/GIT-STRATEJI.md` — bugünkü beyan; bölümlerdeki KURAL yorumları yeni düzenin **zorunlu** alanlarını sayar
- `_dev/phases/PHASE-4.md` → Kapsam Tartışması (yayın düzeni, yayın kapısı, geri dönüş kuralı) · Araştırma Bulguları → Sıra şartları · Teknik Kararlar 6
- `_dev/memory/vercel-proje-kimlikleri.md` — `vercel` çağrısının kimlik yolu (asılmayı önler) ve `vercel api`
- `_dev/memory/anahtar-kasasi-config-alpfit.md` — atlatma anahtarının evi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/GIT-STRATEJI.md` — korumalı doküman; değişim bu task'ın onaylı kapsamıdır, raporda tek satırla bildirilir
- `_dev/docs/DECISIONS.md` — iki dal + yayın kapısı + geri dönüş kuralı (kapsamdaki kullanıcı kararlarının gerekçeli kaydı)
- `_dev/memory/vercel-proje-kimlikleri.md` — atlatma anahtarının **adı** ve kasadaki yeri (değer asla)
- `_dev/modules/M7-Yayin-ve-Altyapi.md` — F7.3 kriteri "`main`'e push önizlemeyi günceller" gerçekle hizalanır
- `_dev/DURUM.md` · `_dev/phases/PHASE-4.md`

---

## Alt Görevler

- [ ] **1. Ağacı ve dalı hazırla**
  - `git status --porcelain` boş değilse **dur ve kullanıcıya sor** — dal hareketi commit'lenmemiş yabancı dosyaları yeni dala taşır (COMMIT.md → Paralel Oturum Farkındalığı). Plan anında `.claude/commands/devflow/**` altında başka bir işin kirli dosyaları vardı.
  - Probe (salt okuma): `git remote -v` · `git branch -a` · `ls .github/workflows/` · deploy yapılandırması (bugün `vercel.json` yok).
  - Dal adını kullanıcıya teyit ettir (öneri `dev`). Onayla: `git switch -c dev` → `git push -u origin dev`.

- [ ] **2. Vercel tarafını ölç**
  - `vercel api` ile: üretim dalı hâlâ `main` (proje `link` alanı); `dev`'e push bir **Preview** dağıtımı üretti ve Ready; `main`'in son üretim dağıtımı değişmedi (aynı kimlik).
  - Preview hedefli env kayıtlarının dal önizlemesine gittiği — yalnız anahtar/hedef/tür listesi, değer basılmaz.
  - Dal adresi anahtarsız 302 → giriş.

- [ ] **3. Otomasyon atlatma anahtarı**
  - Vercel'in "Protection Bypass for Automation" ayarı; üretimin yolu (panel ya da `vercel api` ucu) Vercel belgesinden doğrulanır, tahminle yazılmaz.
  - Değer `~/.config/alpfit/secrets.env`'e (izin 600) yazılır — ad önerisi `VERCEL_AUTOMATION_BYPASS_SECRET` (Vercel'in kendi sistem değişkeniyle aynı ad; TASK-4.02'nin betiği bu adı okur). Repoya ve dokümana değer yazılmaz.
  - İki yön ölçülür: anahtarsız 302, `x-vercel-protection-bypass` başlığıyla 200 ve `X-Robots-Tag: noindex, nofollow` (aşama `preview`).

- [ ] **4. `GIT-STRATEJI.md`'yi yeni düzenle yeniden yaz**
  - **Uzak Bağlantı ve Dallar:** `dev` — çalışma, Preview, girişli dal adresi · `main` — yayın, Production, bugün `alpfitplus-web-v2.vercel.app`, geçişten sonra `alpfitplus.com`.
  - **Commit ve Push:** çalışma dalına commit & push rutin ve otonom; `main`'e doğrudan commit yok.
  - **Yayın:** yayın anı = kullanıcının "yayınla" tetiği · kim tetikler = kullanıcı · doğrulama kapısı = beş ölçüm + `npm test` + tip kontrolü yayın kopyasına (3100) karşı, `a11y`'nin B-063 kalemi hariç okunur, ~15-20 dk · akış: kapı → `git switch main` → `git merge --no-ff dev` → push → `git switch dev` → `git merge --ff-only main` → push · squash yok (KURAL gerekçesi) · sürüm damgası kullanılmıyor.
  - **Acil Düzeltme:** `quick`'in bir türü olarak yazılır (yeni kavram icat edilmez); düzeltme `dev`'de yapılır ve aynı kapıdan geçer. **Geri dönüş yönü:** kapsam kararının kuralı — talep hattı ya da site açılmıyorsa alan adı hemen v1 projesine geri taşınır (taşıma ucunun tersi), kısmi kırmızıda 30 dk ileri düzeltme.
  - **Bu Projeye Özgü Notlar:** atlatma anahtarının varlığı ve evi (değer değil) · CI yok · ilk yayın penceresi (aşağıda).
  - Tarifin 4. maddesi — **doğrulama kapısını varsayma, sına:** tip kontrolü komutu (`docker compose exec web npx tsc --noEmit`; projede `typecheck` betiği yok) task'ta koşulur, çıktısı kayda girer.

- [ ] **5. Tarifin üç ek adımı**
  - (a) İz taraması: `_dev/**` içinde `main`/push/yayın/dağıtım geçen yerler; strateji başka dokümana sızmışsa pointer'a indir. Bilinen aday: M7 F7.3 kriteri. (`memory/vercel-proje-kimlikleri.md`'deki "üretim dalı `main`" proje kimliğidir, kalır.)
  - (b) Dış varsayımlar: CI yok, bağımlılık botu yok, PR'dan veri türeten kapı yok — beyan edilir.
  - (c) İlk yayın penceresi kullanıcıya söylenir: ilk yayına (TASK-4.18) dek `main` ile `dev`'in eşit olduğu anda "yayın dalı doğrulanmış sürümdür" güvencesi henüz yoktur.

- [ ] **6. Karar kaydı** — `docs/DECISIONS.md`: iki dal, yayın kapısının içeriği, geri dönüş kuralı; gerekçeler kapsam tartışmasından.

---

## Etkilenen Dosyalar

```
_dev/
├── GIT-STRATEJI.md                     # yeniden yazılır (korumalı — onaylı kapsam)
├── docs/DECISIONS.md                   # yeni kayıt
├── memory/vercel-proje-kimlikleri.md   # atlatma anahtarının adı ve evi
└── modules/M7-Yayin-ve-Altyapi.md      # F7.3 kriter satırı
~/.config/alpfit/secrets.env            # repo dışı — anahtar değeri (600)
```

Kod dosyası değişmez.

---

## Dikkat Noktaları

- Bu task'ın commit'i **yeni dala** gider: oturum `main`'de açılır (bugünkü beyan), 1. alt görevde `dev`'e geçer, commit anındaki `git status -sb` `## dev...origin/dev` göstermeli ve beyan da `dev` olmalı. Bu task'tan sonra `main`'de açılan her oturum dal yankısında durur (CLAUDE.md kapısı) — kasıt budur.
- `main` bu task'tan sonra **ilk yayına kadar hareket etmez**; `alpfitplus-web-v2.vercel.app` bugünkü sürümde donar. Bilinçli: geçişe kadar açık adres budur ve `noindex`'tir.
- Geri dönüşün **komutu** TASK-4.18'in adımıdır; burada yalnız beyan yazılır.
- `vercel api` proje okuması env dizisini de döndürür — yalnız `key`/`target`/`type` yazdır.
- Dal adı `dev` seçilirse dal adresi `alpfitplus-web-v2-git-dev-north-ai.vercel.app` olur; TASK-4.04'ün host kuralının negatif kontrolü bu adı kullanır.
- Preview hedefli değerler bugün paylaşımlı kayıtlarda (`LEAD_STORE_TOKEN`, `IP_HASH_SALT` → hedef `production` + `preview`, değer önizleme token'ı): dal önizlemesi önizleme koleksiyonuna yazar. Canlı değerler TASK-4.18'in işi.

---

## Test Kriterleri

- [ ] `git ls-remote --heads origin` → `dev` ve `main`; `git status -sb` ilk satırı `## dev...origin/dev`
- [ ] `dev`'e push → Vercel'de Preview dağıtımı Ready; `main`'in son üretim dağıtımının kimliği değişmedi
- [ ] Dal adresi: anahtarsız **302** (Location Vercel girişi) · anahtarla **200** ve `X-Robots-Tag: noindex, nofollow`
- [ ] `GIT-STRATEJI.md`: KURAL yorumlarının saydığı zorunlu alanların hepsi dolu — yayın anı · kim tetikler · doğrulama kapısı · akış · merge yöntemi · geri dönüş yönü; tip kontrolü komutu koşuldu ve sonucu kayıtta
- [ ] Anahtar değeri repoda yok — kasadan okunan değerin ilk karakterleri `git grep` ile 0 eşleşme (değer ekrana basılmadan karşılaştırılır)

---

## Risk ve Geri Dönüş Planı

- **Yabancı kirli dosyaların yeni dala taşınması:** alt görev 1'in kapısı; ağaç temiz değilse dal hareketi yapılmaz.
- **Yanlış kurulan dal:** `dev` uzakta silinip yeniden açılır (kullanıcı onayıyla); `main`'e dokunulmadığı için canlıya etkisi yoktur.
- **Rollback:** `git switch main`; `GIT-STRATEJI.md` dosya bazlı git'ten geri alınır.

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
