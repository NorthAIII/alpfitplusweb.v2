# TASK-1.03: Vercel'de ayrı proje, env iskeleti ve başlık ölçümü

**Durum:** ⬜ Bekliyor
**Modül:** M7 — Yayın ve Altyapı (`modules/M7-Yayin-ve-Altyapi.md`)
**Feature:** F7.3: Vercel'de ayrı proje ve önizleme yayını
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.02 ✅ (noindex ilk dağıtımda yerinde olmalı)

---

## Hedef

v2 reposunu Vercel'de **v1'den bağımsız** yeni bir projeye bağlamak, ilk dağıtımı `<proje>.vercel.app` adresinde ayağa kaldırmak, o gün mevcut olan env değişkenlerini tanımlatmak ve güvenlik başlıklarını gerçek yayın zinciri üzerinden ölçmek. Task, önizleme adresi ayakta + noindex ölçülmüş + beş güvenlik başlığı doğrulanmış + GIT-STRATEJI yeni gerçeğe göre güncellenmiş olduğunda tamamlanmış sayılır.

---

## Bağlam

Projeyi **kullanıcı** açar (vercel.com/new → repo içe aktarma); CLI kurulamadı, gerek de yok. Oturumun işi adımları hazırlamak, ölçümü yapmak ve sonucu kayda geçirmek.

v1'in Vercel projesi `alpfitplus-website` **dokunulmazdır**; aynı hesapta farklı ad kullanılır (öneri: `alpfitplus-web-v2`). `alpfitplus.com` alan adı bu fazda bağlanmaz — o F7.5'in işi.

Bu task GIT-STRATEJI'yi de değiştirir: repo Vercel'e bağlandığı andan itibaren her `main` push bir dağıtım tetikler. Bugünkü "yayın hattı yok, otomatik deploy yok" beyanı artık doğru olmaz.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/phases/PHASE-1-ARASTIRMA.md` → "Deployment Protection", "Vercel Hobby ticari kullanıma kapalı", "Güvenlik başlıkları önizlemede ölçülür"
- `_dev/modules/M7-Yayin-ve-Altyapi.md` → F7.2 ve F7.3 kabul kriterleri
- `_dev/GIT-STRATEJI.md` — değiştirilecek beyan (korumalı doküman)
- `.claude/commands/devflow/lib/git-strategy-kurulum.md` — strateji değiştirmenin tarifi

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/GIT-STRATEJI.md` — **korumalı doküman**: değiştirmeden önce kullanıcıya bildir ve onay al
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi tablosunda durumu güncelle; başlık ölçümü sonucu

---

## Alt Görevler

- [ ] **1. Kullanıcı adımlarını hazırla ve birlikte yürüt**
  - vercel.com/new → `NorthAIII/alpfitplusweb.v2` içe aktarılır; proje adı `alpfitplus-web-v2` (v1'in `alpfitplus-website` projesine dokunulmaz)
  - Framework: Next.js (otomatik); Root Directory kök; build komutu varsayılan
  - **"Enable access to System Environment Variables" açık olmalı** — `VERCEL`, `VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL` derlemede görünmezse aşama türetimi (TASK-1.01) yanlış çalışır
  - Alan adı **eklenmez**

- [ ] **2. O gün mevcut env değişkenlerini tanımlat**
  - `RESEND_API_KEY`, `DEMO_TO`, `DEMO_FROM` (değerler kullanıcıda; oturum değerleri görmez, yalnız anahtar adlarını söyler)
  - `LEAD_FILE_PATH` **tanımlanmaz** (Vercel'de kalıcı disk yok)
  - `LEAD_WEBHOOK_URL` ve `NEXT_PUBLIC_UMAMI_WEBSITE_ID` bu task'ta **yok** — kendi task'larında (1.04 / 1.07) eklenir

- [ ] **3. Dağıtımı ve aşama türetimini doğrula**
  - `<proje>.vercel.app` açılıyor, 23 rota erişilebilir (ana sayfa + birkaç alt sayfa gözle)
  - Aşama `preview` türemiş olmalı — kanıtı `robots.txt` ve `X-Robots-Tag` (TASK-1.02 katmanları)

- [ ] **4. Güvenlik başlıklarını yayın zinciri üzerinden ölç**
  - `curl -sI https://<proje>.vercel.app/` → beş başlık + HSTS + `X-Robots-Tag`
  - Ölçüm çıktısı faz dokümanına yazılır (M7 F7.2'nin F7.3'e devredilmiş kabul kriteri)

- [ ] **5. GIT-STRATEJI'yi güncelle** (kullanıcı onayıyla)
  - "Ortam / Hedef" sütunu: `main` → `alpfitplus-web-v2` Vercel projesi, her push dağıtım
  - "Yayın" bölümü: alan adı bağlı olmadığı için yayın anı hâlâ yok; site `noindex`, aşama `preview`. F7.5'te bu değişecek
  - "Bu Projeye Özgü Notlar" içindeki "Vercel bağlantısı bu stratejiyi değiştirecek" maddesi gerçekleşmiş hâline göre tazelenir

---

## Etkilenen Dosyalar

```
_dev/
├── GIT-STRATEJI.md       # dal↔ortam eşleşmesi ve yayın beyanı — zaten var (KORUMALI)
└── phases/PHASE-1.md     # başlık ölçümü sonucu — zaten var
```

> Kod değişikliği yok; bu task platform kurulumu ve ölçümdür.

---

## Dikkat Noktaları

- **v1'e dokunulmaz.** `alpfitplus-website` projesi ve `alpfitplus.com` DNS'i bu task'ta hiç açılmaz.
- `<proje>.vercel.app` bu modelde **üretim** alan adıdır ve Hobby'de herkese açıktır (Standard Protection üretim alan adlarını korumaz) — kapsam kararı bunu zaten istiyor. Dağıtım-özel `<proje>-<hash>.vercel.app` adresleri korumalı olabilir; telefon testi üretim adresinden yapılır.
- Vercel Hobby **ticari kullanıma kapalı** (adil kullanım metni: "ürün veya hizmet satışının reklamı" ticari sayılır). Kullanıcı riski bilerek kabul etti — `BULGULAR.md` → Bilinçli Tercihler; F7.5 kapsam tartışmasında yeniden konuşulur. Bu task'ta karar açılmaz.
- Vercel kendi HSTS'ini ekleyebilir; **çift HSTS değeri görülürse not edilir, çakışma sayılmaz**.
- Sır değerleri repoya, task dokümanına veya commit mesajına **yazılmaz** — yalnız anahtar adları.
- Ölçüm sonucu rakamıyla/başlık listesiyle faz dokümanına yazılır (QUALITY 6).

---

## Test Kriterleri

- [ ] `https://<proje>.vercel.app/` 200 döner; ana sayfa, `/fiyat`, `/demo`, `/destek` gözle açılıyor
- [ ] `curl -sI https://<proje>.vercel.app/` çıktısında `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` var
- [ ] Aynı çıktıda `X-Robots-Tag: noindex, nofollow` var (aşama `preview` türedi)
- [ ] `curl -s https://<proje>.vercel.app/robots.txt` → `Disallow: /`
- [ ] `curl -sI https://<proje>.vercel.app/fonts/inter-400-tr.woff2` → `Cache-Control: public, max-age=31536000, immutable`
- [ ] `/api/demo`'ya boş POST → 400/422 (uç ayakta; hedefsiz 503 davranışı TASK-1.05/1.06'da sınanır)
- [ ] v1 projesi ve `alpfitplus.com` yanıtları değişmedi (v1 ana sayfası hâlâ 200)

---

## Risk ve Geri Dönüş Planı

- **Yanlış hesap/proje seçimi:** v1 projesinin ayarlarına dokunma riski → proje adı ve repo adı içe aktarma ekranında yüksek sesle teyit edilir.
- **Sistem env kutusu kapalı kalırsa:** aşama `local` türer, noindex katmanları yine kapalı kalır (güvenli yön) ama lead `env` alanı ve Umami etiketi yanlış olur → Test kriterlerindeki `X-Robots-Tag` kontrolü bunu yakalar.
- **Rollback:** Vercel projesi silinebilir; repoda değişiklik yalnız GIT-STRATEJI'dir, dosya bazlı geri alınır.

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** [durum]

**Yapılanlar:**
- [...]

---

**Oluşturulma:** 2026-09-11
