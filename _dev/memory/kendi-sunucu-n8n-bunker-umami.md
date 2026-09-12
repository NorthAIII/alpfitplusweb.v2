# Kendi sunucu: n8n, Bunker ve Umami

Talep hattı ve analitik kullanıcının kendi Hetzner sunucusuna bağlanıyor (`docs/DECISIONS.md` 2026-09-13).
Sunucunun kendisi bu projenin değil — ayrıntı, erişim ve değişiklik kuralları `../altyapi/vps/CLAUDE.md`'de
(salt okunur kaynak). Sunucuya dokunan her iş oradaki "pazarlıksız kurallar"a uyar: önce yedek, önce test, sonra ölç.

## Adresler (2026-09-13 dışarıdan ölçüldü)

| Adres | Ne | Ölçüm |
|---|---|---|
| `n8n.kiwiailab.com` | İş akışları (webhook alıcısı adayı) | `/healthz` → 200 |
| `ops.kiwiailab.com` | Bunker satış paneli (çok kiracılı) | — |
| `alpfit.kiwiailab.com` | Bunker'ın `alpfit` kiracısının panel adresi | — |
| `umami.kiwiailab.com` | Kendi Umami (v1'in analitiği) | `/api/heartbeat` → 200 |

## Bunker — tuzak

- Kod ayrı repo: `../bunker-dashboard` (kendi kuralları `AGENTS.md`). `alpfit` bir kiracıdır (`tenants.slug`).
- **`leads` ve `staged_leads` otomasyonları besler:** soğuk e-posta dizisi (`outreach-sequence-tick`),
  otomatik onay (`triage-auto-approve`), model sınıflandırması (`lead-classify-tick`) — kaynak
  `docs/system-flow.md` ve `src/app/api/internal/`. Web sitesinden gelen demo talebi bu tablolara
  körlemesine yazılırsa talebi yapan kulübe **soğuk satış e-postası gidebilir**. Yazmadan önce giriş yolu
  ve otomasyon dışı tutma yöntemi doğrulanır.
- `/api/leads/intake` oturum isteyen **CSV içe aktarma** ucudur; web sitesi alıcısı olarak kullanılamaz.

## Sırlar

Sunucudaki kimlik bilgileri `/opt/bunker/.env` ve benzeri yerlerde durur. Değer ekrana basılmaz, repoya
ve dokümana yazılmaz; yalnız anahtar adı ve konumu yazılır.
