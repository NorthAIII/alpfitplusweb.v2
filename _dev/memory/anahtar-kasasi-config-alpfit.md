# Anahtar kasası — `~/.config/alpfit/secrets.env`

Yönetim düzeyi servis anahtarları **repo dışında**, bu dosyada durur. Karar ve gerekçe: `docs/DECISIONS.md` 2026-09-21 "Anahtar kasası".

| Kalem | Değer |
|---|---|
| Yol | `~/.config/alpfit/secrets.env` (`/home/kivanc/.config/alpfit/secrets.env`) |
| İzin | `600`, klasör `700` — yalnız kullanıcı okur |
| Biçim | `AD=deger` satırları; `set -a; . ~/.config/alpfit/secrets.env; set +a` ile yüklenir |
| Git | Repo dışında — `.gitignore`'a bile gerek yok, git göremez |

## İçindeki anahtarlar

- **`RESEND_ADMIN_KEY`** — Resend **Full access**. Alan adı durumu okumak (`GET /domains`), gönderim kaydı/gövdesi okumak (`GET /emails`, `GET /emails/:id`) ve **dar yetkili gönderim anahtarı üretmek** (`POST /api-keys`) için. Siteye hiç girmez.

Umami ve başka servislerin yönetim anahtarları da zamanla **bu aynı dosyaya** girer — her servis için ayrı kasa açılmaz.

## Neyi gereksiz kıldı

Kullanıcı web panellerine bakamıyor / nasıl yapılacağını bilmiyor (2026-09-14, 2026-09-21) ve her panel adımı bir koşum duruşuna mal oluyordu. Kasa sayesinde şunlar **oturumun kendi işi** oldu:

- Resend'de alan adı doğrulamasını **ölçmek** (panel ekranı yerine `GET /domains` → `verified`, bölge, `sending: enabled`).
- Ürün yüzeyi için **dar yetkili anahtar üretmek** ve Vercel'e girmek — TASK-1.06: `alpfitplus-web-v2`, `sending_access`, tek alan adına bağlı, `vercel env add … --sensitive`.
- E-postanın gerçekten gittiğini **kanıtlamak** (`last_event: delivered`, `reply_to`, gövde metni) — kullanıcının gelen kutusuna bakmasına gerek kalmadan.

## Kurallar

- **Değer hiçbir yere yazılmaz.** Dokümana, commit'e, log'a, sohbete değil — yalnız **anahtar adı ve konum**. Geçici dosya gerekiyorsa scratchpad'e `0600` ile yazılır ve iş biter bitmez `shred` edilir.
- **Kasadaki anahtar üretim yüzeyine girmez.** Site/Vercel yalnız dar yetkili iş anahtarı görür; yönetim anahtarı oturumun elinde kalır.
- **Kasa çalışma zamanı sırrı tutmaz.** Sitenin sırları Vercel env'inde ve yerel `.env`'de yaşar (`LEAD_STORE_*`, `IP_HASH_SALT`, `RESEND_API_KEY`…).
- **Yıkıcı API çağrısı kullanıcı kararıdır.** Anahtar silme, alan adı/DNS ayarı değiştirme, başka projelerin anahtarlarına dokunma kasanın yetkisiyle *mümkün* ama bu yetkiyle *serbest* değil.
