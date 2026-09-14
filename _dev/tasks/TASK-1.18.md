# TASK-1.18: Canlı depo bağlantısı — Vercel env ve token → koleksiyon teyidi

**Durum:** ⬜ Bekliyor
**Modül:** M3 — Lead Hattı (`modules/M3-Lead-Hatti.md`) · altyapı M7
**Feature:** F3.2: Dayanıklı kayıt hedefi
**Faz:** Phase 1 (`phases/PHASE-1.md`)
**Bağımlılıklar:** TASK-1.14 ✅ (site depo adaptörüyle yerelde kanıtlı)

---

## Hedef

Sitenin depo adaptörünü canlı depoya (`https://lead.alpfitplus.com`) bağlayacak env değerlerini Vercel'e girdirmek. Girilen token'ın gerçekten **önizleme koleksiyonuna** (`leads_preview`) yazdığını tek bir test isteğiyle kanıtlamak. Kapsam:

- `LEAD_STORE_URL`, `LEAD_STORE_TOKEN` (önizleme token'ı) ve `IP_HASH_SALT` → `alpfitplus-web-v2`, Production + Preview.
- Canlı depoya kayıt yazmayan kimliksiz teyit.
- Yerel geliştirme sunucusundan canlı depoya **tek** test talebi. Kaydın `leads_preview`'da, `leads`'te olmadığı panelde görülür.

Task şu koşullar sağlandığında tamamlanmış sayılır:

- Üç anahtar Vercel'de iki ortamda da tanımlı (adla doğrulandı).
- Test talebi `stored:true` döndü ve panelde önizleme koleksiyonunda görüldü.
- Gerçek talep koleksiyonuna (`leads`) hiçbir şey yazılmadı.

---

## Bağlam

**2026-09-14 plan revizyonuyla yeniden yazıldı.** Eski hâli alıcıyı canlı sunucuya taşıyor, otomasyon izolasyonunu çalışma zamanında ölçüyordu. Yeni hedefte ikisi de yok. Depo iki aydır canlıda (2026-07-27). Soğuk otomasyondan ayrık olduğu kodla ve yedekle gösterildi (`docs/DECISIONS.md` 2026-09-14 → Gerekçe (a)). **Bu task sunucuya yazmaz.** v1'in reposuna, deposunun kodlarına ve Vercel projesine de dokunmaz.

Tek gerçek risk token'dır. v2'nin `main` push'u Vercel **production** ortamında koşar ama aşaması `preview`'dır (TASK-1.01). Production env'ine üretim token'ı girilirse önizlemedeki her test talebi v1'in gerçek taleplerinin durduğu `leads`'e düşer. Kural bu yüzden: alan adı geçişine (M7 F7.5) kadar **iki ortama da önizleme token'ı** (TASK-1.11 → Oturum 2026-09-14 → Kararlar).

Token koleksiyonu gövdeden değil kendisinden seçer. API bu yüzden hangi koleksiyona yazıldığını söylemez: `201` iki koleksiyonda da aynıdır. Ayrımın tek kanıtı panel ya da superuser okumasıdır. Kriterin kanalı bu yüzden UAT.

**Devralınan kriter:** TASK-1.05'in canlı alıcıya bağlı kriteri ("gerçek alıcıya giden talep kayda düşer ve `env` alanı `local` yazar") bu task'ındır. Yeni depoda karşılığı "kayıt `leads_preview`'da, `env=preview`"dir. Gerekçe TASK-1.14 → Dikkat Noktaları.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/tasks/archive/TASK-1.14.md` → Oturum Kaydı — adaptörün env anahtarları ve Karar Noktaları sonuçları
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` → Lead deposu, Sırlar
- `_dev/memory/vercel-proje-kimlikleri.md` — CLI erişimi, proje ve takım
- `../Alpfitplus-website.v1/pocketbase/README.md` → Sırlar, Uç nokta sözleşmesi (salt okunur)

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-1.md` — Task Listesi; canlı teyit sonucu → Ölçümler
- `_dev/memory/kendi-sunucu-n8n-bunker-umami.md` — v2 env'inin kurulu olduğu, token değerinin kaynağı (değer değil konum), `IP_HASH_SALT` kararı

---

## Alt Görevler

- [ ] **1. Değerlerin kaynağını kullanıcıyla netleştir**
  - `LEAD_STORE_URL` sır değil: `https://lead.alpfitplus.com`
  - `LEAD_STORE_TOKEN`: canlı depodaki `LEAD_TOKEN_PREVIEW`. Değer kullanıcıda: parola yöneticisi, sunucuda `/opt/alpfit-lead/.env` ya da v1 Vercel projesinin Preview env'i. Oturum değeri görmez
  - `IP_HASH_SALT`: Karar Noktası

- [ ] **2. Vercel env'i girilir**
  - Kullanıcı girer, ya da açık izniyle oturum `vercel env add` ile değeri ekrana basmadan ekler (TASK-1.07 emsali). Kapsam: `alpfitplus-web-v2`, Production + Preview. Development gerekmez
  - Oturum `vercel env ls` ile adları doğrular
  - Push ya da redeploy henüz **yapılmaz**. Önizleme adresindeki ilk gerçek tur TASK-1.06'nın, e-posta env'iyle birlikte

- [ ] **3. Canlı depoyu kayıt yazmadan yokla**
  - `GET https://lead.alpfitplus.com/api/health` → 200
  - Token'sız `POST /lead` (sahte gövde) → `401 {"error":"unauthorized"}`. Rota yüklü, token kapısı açık, kayıt yok (v1 README → "Dağıtım sonrası hızlı kontrol")

- [ ] **4. Tek test talebi: token → koleksiyon**
  - Yerel `.env` geçici olarak canlı `LEAD_STORE_URL` + önizleme token'ı + `IP_HASH_SALT`, sonra `docker compose restart web`. Değerler basılmaz
  - `/demo` formundan (araştırma konteyneri) **bir** talep: ad `TASK-1.18 test`, kulüp `Test Kulüp`, e-posta `test@example.com`, gerçek kişi verisi yok → başarı ekranı, uç `stored:true`
  - Kullanıcı `https://lead.alpfitplus.com/_/` panelinde kaydı `leads_preview`'da görür ve `leads`'te **olmadığını** teyit eder. Kanal UAT
  - Yerel `.env` sonra yerel depo değerlerine geri döner (`LEAD_STORE_URL=http://lead-store:8090`), `docker compose restart web`. **Geri dönüş teyidi zorunlu**: unutulursa yerel geliştirme her denemede canlı depoya yazar

- [ ] **5. Test kaydının akıbeti**
  - Kayıt önizleme koleksiyonunda ve 12 ay sonra saklama cron'uyla silinir. Kalsın mı panelden silinsin mi **kullanıcıya sorulur**; silme superuser işidir, oturum yapmaz

---

## Etkilenen Dosyalar

```
_dev/
├── phases/PHASE-1.md                          # canlı teyit sonucu → Ölçümler — zaten var
└── memory/kendi-sunucu-n8n-bunker-umami.md    # v2 env kurulumu, token kaynağı, tuz kararı — zaten var
```

> Kod değişikliği yok. Yerel `.env` gitignore'ludur ve task sonunda yerel depo değerlerine döner.

---

## Dikkat Noktaları

- **Üretim token'ı bu fazda hiçbir yere girilmez.** Production env'i dâhil. Yanlış token hatası sessizdir: `201` iki koleksiyonda aynı. Ayrımın tek kanıtı panel (alt görev 4).
- **Canlı deponun hız sınırı `ip_hash` başına saatte 5.** Bu task tek istek atar. Tekrar gerekirse aynı saatte beşi geçilmez, v1'in gerçek ziyaretçileri etkilenmez (ayrı `ip_hash`).
- **Sır hijyeni:** token ve tuz task dokümanına, commit'e, sohbete ya da loga yazılmaz. `vercel env ls` değer basmaz; `vercel env pull` **kullanılmaz** (değerleri diske döker).
- **v1 dokunulmaz:** v1'in Vercel projesi `alpfitplus-website` açılmaz, env'i değiştirilmez. Değer oradan okunacaksa bunu kullanıcı yapar.
- **Canlı depo v1'in üretim talebini de tutuyor.** Beklenmeyen bir yanıt (`500`, `413`, HTML) görülürse tekrar denenmez, dur ve sor.
- Kanal notu: alt görev 3 ve 4'ün kriterleri canlı serving zinciri ve canlı panel katmanındadır. Yerel koşucu ve CI göremez.

---

## Test Kriterleri

- [ ] `vercel env ls`: `LEAD_STORE_URL`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` Production **ve** Preview'de var, değer basılmadan — kanal: UAT
- [ ] Canlı `GET /api/health` → 200 ve token'sız `POST /lead` → `401 {"error":"unauthorized"}` — kanal: UAT
- [ ] Yerelden (dev, 3000) canlı depoya gönderilen tek test talebi → uç `200 stored:true`; kayıt panelde `leads_preview`'da, `env=preview`, alanlar doğru eşlenmiş; `leads`'te aynı kayıt yok (TASK-1.05'ten devralınan) — kanal: UAT
- [ ] Yerel `.env` task sonunda yerel depoya dönmüş: `docker compose exec web` içinden bir test talebi yerel `lead-store` kaydı üretiyor; canlı panelde ikinci kayıt yok — kanal (panel ayağı): UAT
- [ ] Task dokümanı, commit ve `_dev/` altında token ya da tuz değeri yok (`git diff` + `grep` ile)

---

## Karar Noktaları

- **`IP_HASH_SALT` değeri:** (a) v1'in canlı değeriyle aynı, (b) v2 için yeni rastgele (`openssl rand -hex 32`). **Önerilen: (b) bugün, (a) alan adı geçişinde.** v2 bugün yalnız önizleme koleksiyonuna yazıyor, v1'le ortak sayaç ya da `prior_count` sürekliliği gerekmiyor. v1'in sırrı yeni bir projeye kopyalanmamış olur. Alan adı geçişinde v2 v1'in yerini alınca aynı tuz, `ip_hash` sürekliliğini korur; o fazın env taşıma listesine not düşülür. Kullanıcıya teyit ettirilir.

---

## Risk ve Geri Dönüş Planı

- **Yanlış token (üretim) girilirse** → alt görev 4'te test kaydı `leads`'te görülür. Env hemen önizleme token'ıyla değiştirilir, kayıt kullanıcıya bildirilir (silme superuser işi). Önizleme dağıtımı henüz yeni env'i almadığı için gerçek talep akmamıştır.
- **Rollback:** Vercel'de üç anahtar kaldırılır. Uç bugünkü "kayıt yok → e-posta ya da 503" davranışına döner. Yerel `.env` yerel depoya döner.

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

**Oluşturulma:** 2026-09-13 (plan revizyonu) · **Yeniden yazıldı:** 2026-09-14 (plan revizyonu — alıcıyı canlıya taşıma yerine hazır deponun env bağlantısı ve token teyidi)
