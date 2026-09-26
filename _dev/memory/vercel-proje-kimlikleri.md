# Vercel proje kimlikleri ve CLI erişimi

**Vercel CLI kurulu ve oturum açık** — `/home/kivanc/.local/bin/vercel` (sürüm 59.15.1), hesap `northaiii`. `vercel login` tarayıcı doğrulaması istediği için ajan tarafından yapılamaz; oturum düşerse kullanıcı kendi terminalinde yeniler.

⚠️ **Kimlik dosyası snap sürümüne çivilidir ve sürüm kayar** (VS Code snap'i her güncellemede yeni bir `…/snap/code/<rev>/` açar). Sonucu sessiz değil ama **asıcıdır**: yanlış yolla her `vercel` çağrısı *"No existing credentials found. Starting login flow…"* deyip cihaz-giriş kodu basar ve **süresiz bekler**. Eski revizyondaki dosya da kalabilir ama token'ı geçersizdir (ölçüldü 2026-09-26: `264` → *"The specified token is not valid"*, `266` → `northaiii`; kabuğun `XDG_DATA_HOME`'u o oturumda boştu). Bugün çalışan:

```bash
XDG_DATA_HOME=/home/kivanc/snap/code/266/.local/share vercel <komut>
```

Sayı yine değişebilir: `find /home/kivanc -maxdepth 7 -name auth.json -path '*vercel*'` ile adayları bul, her birini `timeout 25 vercel whoami </dev/null` ile dene (timeout + boş stdin, asılmayı keser), `northaiii` döneni kullan.

CLI'ın kapsamadığı proje ayarları için REST API kullanılır — **en kısa yol `vercel api <yol>`** (CLI 59.26.0, beta): kimliği kendisi taşır, token'ı elle okumaya gerek kalmaz (`vercel api list` uçları listeler; ölçüldü 2026-09-26: proje ayarı, takım üyeleri, dağıtımlar, proje alan adları okundu). Çıktının başında CLI başlık satırı olur — JSON'u ilk `{`'dan itibaren ayrıştır. ⚠️ Proje okuması `env` dizisini de döndürür; yalnız `key`/`target`/`type` yazdır, değer alanını basma.

**`vercel env pull` `--sensitive` anahtarları maskeli döndürür** (ölçüldü 2026-09-23): `RESEND_API_KEY`, `LEAD_STORE_TOKEN`, `IP_HASH_SALT` çekilen dosyada gerçek değerle değil bir yer tutucuyla gelir (`re_` öneki yok); `DEMO_TO`/`DEMO_FROM`/`LEAD_STORE_URL` gibi hassas işaretlenmemişler okunabilir. Yerelde **gerçek gönderim** gereken bir ölçüm bu yüzden Vercel'den anahtar çekemez — yol, kasadan dar yetkili geçici anahtar üretip iş bitince silmektir ([Anahtar kasası](anahtar-kasasi-config-alpfit.md)).

## v2 projesi (bu repo)

| Alan | Değer |
|---|---|
| Proje | `alpfitplus-web-v2` |
| Proje ID | `prj_NoPQhEWkhvjbNUpR8ONgsx4O0CGy` |
| Takım | `north-ai` (NorthAI), ID `team_yzbzSzQDYGC9i0ccUqSb0zgQ` |
| Plan | `hobby` (API'den doğrulandı — analitik ve ticari kullanım kararlarının dayanağı) |
| Üretim adresi | `https://alpfitplus-web-v2.vercel.app` |
| Git bağlantısı | GitHub `NorthAIII/alpfitplusweb.v2`, repoId `1364745336`, üretim dalı `main` |

Dal modeli, yayın kuralı ve push'un ne tetiklediği burada **değil** → `GIT-STRATEJI.md`.

## `vercel project add` iki şeyi panel gibi yapmaz

Panelden içe aktarma çerçeve tespiti yapar, CLI'ın `project add`'i yapmaz — proje `framework: null` ("Other") doğar ve çıktı dizini sessizce `public` varsayılır. Kurulumdan sonra doğrula:

```
framework            → "nextjs" olmalı (yoksa PATCH /v9/projects/<id> ile yazılır)
autoExposeSystemEnvs → true olmalı (panelde "Enable access to System
                       Environment Variables"; CLI kurulumunda varsayılan açık)
```

`autoExposeSystemEnvs` kapalıysa `VERCEL`, `VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL` derlemede görünmez ve aşama türetimi (`src/lib/stage.ts`) sessizce `local` döner.

`vercel link` yan etki olarak repo köküne `.env.local` (yalnız `VERCEL_OIDC_TOKEN`) yazar. Kullanılmıyor; gitignore'lu ama **önce var olan bir `.env.local` varsa üzerine yazma riskini kontrol et**.

İlgili: [Vercel `output: "standalone"` ile derleme kırar](vercel-standalone-cikti-catismasi.md) · [Aşamaya bağlı davranışta "ara hâl" ayrıca sınanır](asama-bagimli-davranis-ara-hal-sinamasi.md)

## Dağıtımı commit'e bağlama — `vercel inspect` SHA basmaz (verify-phase, 2026-09-22)

`vercel inspect <url>` çıktısında `githubCommitSha` / dal / commit alanı **yoktur** (ölçüldü: `grep -i commit` boş).
Bir dağıtımın hangi commit'ten geldiğini kanıtlamak için iki yol var, ikisi de ucuz:

- **Zaman eşlemesi:** `vercel ls <proje> --scope <takım>` + `vercel inspect` → `created`; `git log -1 --format=%cI <sha>`.
  Aralık saniyeler mertebesindeyse bağ kuruludur (ölçüldü: commit 17:51:52 → dağıtım 17:51:58).
- **Davranış ayırt edicisi:** o commit'in değiştirdiği bir yüzeyi canlıda ölç (örn. TASK-1.20'den sonra `/kvkk`'nin
  `robots` meta'sı). Ölçümün kendisi zaten UAT senaryosuysa ek maliyet sıfırdır.

`vercel inspect` çıktısındaki **Aliases** bloğu üretim alias'ının (`alpfitplus-web-v2.vercel.app`) o dağıtıma bağlı
olup olmadığını gösterir — "son dağıtım Ready" tek başına "canlıda o var" demek değildir, alias'a bak.
