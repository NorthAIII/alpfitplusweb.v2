# Aşamaya bağlı davranışta "ara hâl" ayrıca sınanır

`deployStage`'e (`local` / `preview` / `production`) göre davranış değiştiren
her task, iki uçla yetinmez — **üç senaryo** koşar:

1. Yerel (`VERCEL` yok) → `local`
2. Gerçek alan adı (`VERCEL_ENV=production` + `alpfitplus.com`) → `production`
3. **Ara hâl:** `VERCEL_ENV=production` **ama** alan adı hâlâ `…vercel.app`
   → `preview`

Üçüncüsü projenin gerçek hâlidir ve M7 F7.5'e kadar öyle kalır: Git bağlı
projede `main` varsayılan üretim dalıdır, her push **production** dağıtımıdır ve
`VERCEL_ENV=production` döner (araştırmada çürütülen varsayım — `PHASE-1-ARASTIRMA.md`).
Koşul yanlışlıkla `VERCEL_ENV`'e bakacak şekilde yazılırsa **iki uçlu test bunu
göremez**: 1 ve 2 yeşil geçer, 3 sessizce fail-open olur.

Dördüncü senaryo fail-safe'i sınar: alan adı env'i **hiç tanımsız** → yine
`preview` beklenir (eksik bilgide kapalı kalma).

Ölçüm **serving katmanında** yapılır (curl ile gerçek yanıt), saf fonksiyon
düzeyinde değil — kusur yanıtın kendisinde doğar. Kurulumu:
[Alternatif env ile üretim derlemesi](alternatif-env-ile-uretim-derlemesi.md).

Faz 1'de üç tüketicinin üçü de bu sınamadan geçti: noindex üç katmanı
(TASK-1.02), lead `env` alanı (TASK-1.05), Umami `data-tag` (TASK-1.07) —
üçü de canlı önizlemede ara hâlde ölçüldü. Kural **F7.5'e (alan adı geçişi)
kadar geçerlidir**; o gün aşama kendiliğinden `production`'a döner ve ara hâl
projenin gerçek hâli olmaktan çıkar.

⚠️ Bu sınama **çağıranı** ölçer, **atlayanı** değil: bir yüzey türevi hiç
çağırmıyorsa üç senaryo da onu göremez →
[Tek kaynağı atlayan çağrı siteleri](tek-kaynak-atlayan-cagri-sitesi-supurmesi.md).
