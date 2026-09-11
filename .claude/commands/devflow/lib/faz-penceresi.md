# DevFlow — Faz Penceresi Diff'i (faz-penceresi)

> **Bu dosya doğrudan çağrılmaz** ve **lazy okunur** — diff'e ihtiyaç duyulduğunda, çağrı başına bir kez. İki çağıranı vardır: `verify-phase` Adım 1c (güvenlik taraması) ve `review-phase` Adım 3 (Güvenlik ekseni + UAT tazeliği merceği). Ayrı dosyadır çünkü iki çağıranı vardır ve her çağıranın kendisi tek Read çağrısına sığmalıdır (kanon: CLAUDE.md → Boyut ve Bölünme). Çapa ve kalıplar **tek yerde** tanımlıdır — çağıran dosyalarda tekrar yazılmaz.

**Ne ölçer:** bu fazın açılışından HEAD'e kadar biriken **tüm** değişiklik — fazın kendi task commit'leri, aradaki quick oturumları ve düzeltme turları dahil.

---

## Blok

`N` = fazın numarası (`verify-phase`/`review-phase`'in `[N]` parametresi; verilmediyse DURUM.md'deki aktif faz). N'yi doldur, kalanını **aynen** çalıştır:

```bash
N=<faz no>; PREV=$((N-1))
ANCHOR=$(git log --format='%H %s' | grep -E -m1 "^[0-9a-f]+ docs\(phase-$PREV\): review" | cut -d' ' -f1)
FIRST=$(git log --reverse --format='%H %s' | grep -E -m1 "^[0-9a-f]+ [a-z]+\((phase-$N\):|TASK-$N\.)" | cut -d' ' -f1)
if   [ -n "$ANCHOR" ]; then RANGE="$ANCHOR..HEAD"   # birincil çapa: önceki fazın review'u → HEAD (aradaki quick commit'ler dahil)
elif [ -n "$FIRST"  ]; then RANGE="$FIRST^..HEAD"   # fallback: fazın ilk commit'inin parent'ı (Faz 1 / önceki faz review'suz)
else RANGE=""; echo "Hiç faz commit'i bulunamadı"   # dur: taramayı yapma, durumu kullanıcıya bildir
fi
[ -n "$RANGE" ] && git diff "$RANGE"
```

**Tırnaklara ve kalıplara dokunma:** çift tırnak `$N`/`$PREV` açılımı için gereklidir; `\):` / `\.` guard'ları çift-haneli numaralarda (phase-1 ↔ phase-11, TASK-1. ↔ TASK-11.) yanlış eşleşmeyi önler.

**Çapa bilinçli olarak tam `phase-(N-1)` review'unu hedefler** — "en son herhangi-faz review'u" gibi gevşek bir çapaya çevirme: düzeltme task'ları sonrası yeniden çalıştırmada pencereyi daraltır. Çapa sabit kaldığı için **sonradan giren fix commit'leri pencereye kendiliğinden girer**; ikinci koşumda pencere büyür, küçülmez.

**`Hiç faz commit'i bulunamadı` çıktısında dur** ve durumu kullanıcıya bildir (muhtemel neden: yanlış faz numarası ya da konvansiyon-dışı commit geçmişi). Yanıtına göre ilerle — faz numarası yanlışsa doğrusuyla yeniden dene, geçmiş konvansiyon-dışıysa kullanıcı onayıyla taramasız devam et.

---

## Pencerenin kapsamı üzerine

Diff **working tree'ye bakmaz, commit geçmişine bakar.** Fazın işi faz sonunda zaten commit & push'ludur; ağaçta kir varsa paralel bir oturuma aittir ve taranmaz (CLAUDE.md → **Paralel Oturum Farkındalığı**). Bu yüzden pending-diff üzerinde çalışan harici bir tarama bu kapının yerine geçmez.

Pencere **fazın kendi commit'leriyle sınırlı değildir**: çapa ile HEAD arasına giren her şey — meşru bir quick oturumu, paralel oturum, düzeltme turu — içeridedir. Bu bilinçlidir; iki çağıran da tam bu genişliğe dayanır (`review-phase` Adım 3'ün UAT-tazeliği merceği, araya giren ürün-kodu commit'lerini ancak böyle görebilir).
