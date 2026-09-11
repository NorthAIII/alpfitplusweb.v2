# Vercel proje kimlikleri ve CLI erişimi

**Vercel CLI kurulu ve oturum açık** — `/home/kivanc/.local/bin/vercel` (sürüm 59.15.1), hesap `northaiii`. Kimlik dosyası `$XDG_DATA_HOME/com.vercel.cli/auth.json` (bu makinede `XDG_DATA_HOME=/home/kivanc/snap/code/263/.local/share`, yani `~/.local/share` **değil** — snap sandbox'ı yüzünden). `vercel login` tarayıcı doğrulaması istediği için ajan tarafından yapılamaz; oturum düşerse kullanıcı kendi terminalinde yeniler.

CLI'ın kapsamadığı proje ayarları için REST API kullanılır; token yukarıdaki `auth.json` içindedir ve **ekrana yazılmaz**.

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
