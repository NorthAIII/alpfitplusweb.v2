# Yerel lead deposu — Docker profili `lead`

Canlıdaki lead deposunun (`lead.alpfitplus.com`, v1'in PocketBase'i) birebir yerel kopyası — servis `lead-store`, `docker-compose.yml` içinde profil `lead` altında (TASK-1.17). Sözleşme, şema ve hook'ların tek evi `../Alpfitplus-website.v1/pocketbase/` (**salt okunur**); bu kayıt yalnız **yerel Docker işletimini** tutar.

## Komutlar

| İş | Komut |
|---|---|
| Ayağa kaldır / güncelle | `docker compose --profile lead up -d lead-store` |
| Durum | `docker compose --profile lead ps lead-store` |
| Log | `docker logs alpfitplus-lead-store` |
| **İndir** (servis + container) | `docker compose rm -sf lead-store` — veri **durur** (named volume) |
| **Sil** (veriyi de) | `docker compose rm -sf lead-store && docker volume rm alpfitplus-web_lead_store_data` |
| `web` içinden erişim | `docker compose exec web node -e "fetch('http://lead-store:8090/api/health').then(r=>r.text()).then(console.log)"` — imajda `wget`/`curl` yok |

**`docker compose down` KULLANILMAZ** — profil verilse de projenin tüm servislerini (`web` dâhil) indirir; `-v` ise `node_modules`/`next_cache` hacimlerini de siler. İndirme her zaman servis adıyla (`rm -sf lead-store`), silme her zaman hacim adıyla yapılır.

## Token'lar — yerel `.env`

`LEAD_TOKEN_PREVIEW` / `LEAD_TOKEN_PRODUCTION`, `docker-compose.yml`'de `${…:-}` (boş varsayılan) ile okunur — v1'in sunucudaki `${…:?}` deseni **burada kullanılmaz**, yoksa `.env`'i olmayan biri `docker compose up -d web`'i bile koşamaz. Üretim:

```bash
( umask 077; { echo "LEAD_TOKEN_PREVIEW=$(openssl rand -hex 32)"; \
               echo "LEAD_TOKEN_PRODUCTION=$(openssl rand -hex 32)"; } >> .env )
awk -F= '/^LEAD_TOKEN_/{print $1 " uzunluk=" length($2)}' .env    # deger degil, uzunluk dogrulanir
```

Bu tamamen yerel, rastgele üretilmiş değerlerdir — canlı `/opt/alpfit-lead/.env` token'larıyla hiçbir ilişkisi yoktur ve asla karıştırılmaz. `.env` `.gitignore`'da (`​.env*`), repoya girmez.

## Tuzaklar

1. **Token değişikliği `restart` ile gelmez.** `.env`'deki token değiştiğinde `docker compose --profile lead up -d lead-store` çalıştırılır (recreate) — `restart` eski env'i taşımaya devam eder, ölçüldü (TASK-1.17).
2. **`:ro` bağlı `pb_migrations` `serve`'ü engellemedi.** Hem `pb_hooks` hem `pb_migrations` v1'den salt okunur bağlanır (task kararı — v1'in sunucudaki kendi compose'u migrations'ı yazılabilir bağlar, panelden şema değişikliği için). İlk açılışta migration'lar `:ro` dizinden sorunsuz uygulandı, `--automigrate=false` gerekmedi. Gerekirse (ileride yeni migration eklenirse) fallback budur.
3. **Port host'a yayınlanmaz** (v1'in kendi deseni) — erişim yalnız compose ağı içinden `http://lead-store:8090`. Panelin (`/_/`) yerelden açılması gerekirse `ports` eklenir; bugün eklenmedi.
4. **Varsayılan `up`'ta kalkmaz** — profil `lead` açıkça verilmeden (`docker compose up -d` / `up -d web`) servis hiç oluşmaz, `web`'i etkilemez.
5. **Superuser yok, gerekmez.** İlk açılışta log'a tek kullanımlık installer bağlantısı düşer (v1'in canlı kurulumuyla aynı davranış) — panel testi gerekmedikçe göz ardı edilir.
6. **Shell'e export edilmiş ayni adli degisken `.env` dosyasini golgeler.** Docker Compose degisken onceligi: gercek shell/OS ortam degiskeni > `.env` dosyasi. `.env`'i `set -a; source .env; set +a` ile ayni shell'e yukleyip SONRA o shell'den `docker compose ... up -d lead-store` cagirirsan, `.env`'de degistirdigin (orn. bos birakilan) deger yok sayilir — compose hala export edilmis eski degeri kullanir, konteyner **sessizce yeniden yaratilmaz** ("Running" yazar, "Recreate" degil) ve token eskisi gibi kalir (TASK-1.13'te olculdu: `up -d` "basarili" gorundu ama container `Created` zaman damgasi degismedi, token uzunlugu eskisiyle ayniydi). Duzeltme: `.env`'i degistirip `lead-store`'u yeniden yaratacagin shell'de o degiskenleri **export etme** (ya da cagridan once `unset LEAD_TOKEN_PREVIEW LEAD_TOKEN_PRODUCTION`); token degerini baska bir amacla (orn. `docker compose exec -e ...`) kullanacaksan bunu **ayri** bir shell/adimda, `up -d` cagrisindan sonra yap. Recreate'i dogrulamak icin `docker inspect --format='{{.Created}}'` + konteyner icinde `env | awk` ile **deger degil uzunluk** kontrolu guvenilir.

## İlgili

`../Alpfitplus-website.v1/pocketbase/README.md` (kanonik sözleşme, canlı runbook) · [Kendi sunucu: lead deposu, n8n, Bunker ve Umami](kendi-sunucu-n8n-bunker-umami.md) (canlı adres ve env adları) · `_dev/tasks/archive/TASK-1.17.md` (kurulum task kaydı).
