# Kendi sunucu: lead deposu, n8n, Bunker ve Umami

Talep kaydı ve analitik kullanıcının kendi Hetzner sunucusunda (`178.104.140.36`, Almanya) duruyor (`docs/DECISIONS.md` 2026-09-13 Umami, 2026-09-14 lead hedefi).
Sunucunun kendisi bu projenin değil — ayrıntı, erişim ve değişiklik kuralları `../altyapi/vps/CLAUDE.md`'de
(salt okunur kaynak). Sunucuya dokunan her iş oradaki "pazarlıksız kurallar"a uyar: önce yedek, önce test, sonra ölç.

## Adresler (dışarıdan ölçüldü)

| Adres | Ne | Ölçüm |
|---|---|---|
| `lead.alpfitplus.com` | **Demo talebinin deposu** (v1'in PocketBase'i; v2 de buraya yazar) | `/api/health` → 200 (2026-09-14) |
| `n8n.kiwiailab.com` | İş akışları | `/healthz` → 200 (2026-09-13) |
| `ops.kiwiailab.com` | Bunker satış paneli (çok kiracılı) | — |
| `alpfit.kiwiailab.com` | Bunker'ın `alpfit` kiracısının panel adresi | — |
| `umami.kiwiailab.com` | Kendi Umami (v1'in analitiği) | `/api/heartbeat` → 200 (2026-09-13) |

## Lead deposu — PocketBase

- Kod, şema, hook ve sözleşmenin tek evi `../Alpfitplus-website.v1/pocketbase/` (**salt okunur**, bu projenin dokunulmazı) → `README.md` → "Uç nokta sözleşmesi". Sunucuda ayrı compose projesi `alpfit-lead` (`/opt/alpfit-lead/`), Bunker DB'sinden bağımsız SQLite.
- Sözleşme özü: `POST /lead` + `X-Lead-Token` başlığı; **token koleksiyonu seçer** (`leads` production · `leads_preview` preview); `ip_hash` zorunlu; başarı `201 {id, prior_count}` — `ok:true` **yok**; IP başına saatte 5 → `429`.
- Koleksiyon kuralları beşi de `null` (yalnız superuser) → Bunker ve n8n bu depoyu okumuyor (2026-09-14: kodda ve n8n yedeğinde referans 0). Yedek günlük 03:00 / 7 kopya; saklama 12 ay (cron).
- v2 env adları v1'le aynı: `LEAD_STORE_URL` · `LEAD_STORE_TOKEN` · `IP_HASH_SALT`. v2'nin `main`'i Vercel production env'inde ama aşaması `preview` → alan adı geçişine kadar **önizleme token'ı** girer.

## Bunker — tuzak

- Kanonik kod `../Bunker OS/bunker-dashboard` (`NorthAIII/bunker-os` monoreposu). `../bunker-dashboard` klonu bayat ve GitHub'da arşivli.
- **`leads` ve `staged_leads` soğuk e-posta otomasyonunu besler** (dizi, otomatik onay, sınıflandırma; `alpfit` canlı kampanyanın kiracısı). Demo talebi bu tablolara yazılmaz; "ayrı `source` değeri" izolasyon sağlamaz (kodla çürüdü). Kanıt: `tasks/archive/TASK-1.11-BUNKER-KESFI.md`.

## Canlıya dokunmadan ölçüm

Canlı Bunker DB/n8n okumak sandbox dışı SSH ister. Onun yerine masaüstündeki sunucu dışı yedek kullanılır: `~/vps-yedekler/bunker-YYYYMMDD-*.dump` (günlük, 90 gün). Dosya ağsız, tek kullanımlık `postgres:15-alpine` konteynerine `:ro` bağlanır; `pg_restore -l` / `--data-only --table=…` ile sayım yapılır. Satır verisi basılmaz, n8n iş akışları `workflow_entity` tablosundadır.

## Sırlar

Sunucudaki kimlik bilgileri `/opt/bunker/.env`, `/opt/alpfit-lead/` ve benzeri yerlerde durur. Değer ekrana basılmaz, repoya
ve dokümana yazılmaz; yalnız anahtar adı ve konumu yazılır.
