#!/usr/bin/env bash
# DevFlow — Doküman tek-seferde-okunabilirlik analizörü
#
# Dokümanları OKUMADAN tarar; satır, karakter, token tahmini, en uzun satır ve
# uzun-satır sayısını raporlar, eşik aşanları BAYRAK sütununda işaretler.
# Amaç: bir dokümanın tek bir Read çağrısıyla (parçalı okumaya gerek kalmadan)
# okunabilir olup olmadığını mekanik olarak kestirmek.
#
# Kullanım:
#   doc-scan.sh <dosya> [<dosya> ...]      # verilen dosyaları tara
#   doc-scan.sh -d <dizin>                 # dizindeki tüm .md'leri tara (recursive)
#
# Eşikler (env değişkeniyle ayarlanır):
#   TOKEN_COMFORT (6000)   rahatlık bayrağı — YALNIZ GÖZLEM, iş emri DEĞİL: bu bandda
#                          boyut kalemi doğmaz (kanon: CLAUDE.md → Boyut ve Bölünme,
#                          "kırmızı çizginin altında boyut işi yoktur")
#   TOKEN_HARD    (20000)  kırmızı çizgi — tek-okuma riski (parçalı okuma gerekebilir).
#                          Üçlü teşhisin (temizle/böl/supap) tetiği YALNIZ budur.
#   LINE_FLAG     (400)    satır sayısı işaret fişeği (ikincil)
#   LONGLINE      (1500)   tek satır karakter işaret fişeği (ikincil). ÖLÇÜMDE MUAFİYET YOKTUR —
#                          tablo, kod bloğu, URL ve HTML yorum satırları da sayılır. Muafiyet
#                          ve kalemin doğup doğmadığı HÜKÜMDEDİR, burada değil (kanon:
#                          CLAUDE.md → Format ve Sıkıştırma → uzun-satır maddesi). Hüküm İKİ
#                          YARILIDIR: boyut yarısı bu bayraktan doğmaz, yapı yarısı CANLIDIR
#                          (`lib/audit-conform.md` → Adım 3(b)).
#
# Not: token tahmini kabadır (char / 1,69). Amaç kesin token değil, müdahale
# gereken dokümanı tespit etmektir. Asıl sinyal token/toplam boyut; satır sayısı
# ve uzun-satır ikincildir — birkaç çok uzun satır bile tek-okumayı bozabilir.
#
# Kalibrasyon (2026-07-24, 2026-08-08, yeniden ölçüldü 2026-08-09): Claude Code'un
# Read aracı içeriği GERÇEK (tescilli) tokenizer'la sayar ve tam 25.000 token
# üstünü tek okumada getirmez; oran içeriğe bağlıdır, birebir formülle
# çoğaltılamaz. Ölçüm: 1,695–2,272 char/token — 129 örneklem: 18.500–20.000
# bandındaki 124 dosyanın TAMAMI + sınıf tabanı için bant dışı 5 dosya (est
# 14k–23k). İngilizce doğal metinde ~3,5 (ilk bölen 3,5 İngilizce varsayımıydı —
# Türkçe filoda ~2× düşük tahmin üretiyordu).
# Bölen 1,69 ölçülen bandın alt ucuna yakındır ama GARANTİ DEĞİLDİR: motorun
# kendi templates/PHASE.md sınıfı 1,675 ölçüldü, yani tahmin gerçeğin ~%1 altında
# kalabilir. Kalan artığı TOKEN_HARD'ın payı soğurur (20.000 eşik ↔ ~25.000 Read
# tavanı). Önceki bölen 1,8 dağılımın ORTASIYDI (medyan 1,837), güvenli ucu değil:
# filoda 17 doküman "token-rahat" görünürken gerçekte 20.000'i aşıyordu — yani
# yanlış-negatif üretiyordu. Oran ile aksan yoğunluğu arasında güvenilir bir
# monotonluk YOKTUR (ölçüldü: en düşük oranlı sınıflardan ikisi filonun en az
# aksanlı sınıflarıdır); sınıfı belirleyen yapı/nesir karışımıdır.
# TOKEN_HARD 20.000 bu yüzden "sığmıyor" değil "sığmama RİSKİ" çizgisidir: ters
# test edildi (2026-08-08, bölen 1,8 iken): o gün ~21k tahmin edilen dosya tek
# Read'e tam sığdı, gerçeği 20.039'du. Aynı dosya bugünkü bölenle ~22,4k tahmin
# edilir — tahmin değişti, dosya değişmedi; geri-testi tekrarlarken sayıyı değil
# ölçüyü (gerçek 20.039 < 25.000 tavan) esas al.
# Yeniden kalibrasyon gerekirse (tokenizer/cap değişimi şüphesi): dokümanları
# birleştirip 25k token üstü tek dosya yap ve Read ile oku. PARTIAL çıktısı iki
# şeyi birden söyler ve TAVANI ARTIK TAHMİN ETMEK GEREKMEZ — araç onu kendisi
# yazar: "showing lines 1-174 of 649 total (55261 tokens, cap 25000)".
# ⚠️ Bildirilen N, GÖSTERİLEN DİLİMİN DEĞİL **TÜM DOSYANIN** token sayısıdır;
# oran = DOSYANIN TAMAMININ karakter sayısı / N. (Bu satır 2026-09-03'e kadar
# yanlış yazılmıştı ve sessizce yanılan cinstendi: dilim yorumuyla hesaplayan
# biri, sınırı çok aşan bir probe'da 0,52 gibi fiziken imkânsız — bir karakterden
# az bir token — ama sınırı AZ aşan bir probe'da 1,57 gibi makul GÖRÜNEN ve %14
# yanlış bir oran bulur. Aşağıdaki tarihsel sarım ölçümü zaten tüm-dosya
# yorumuyla hesaplanmıştı, yani not kendi tarifini yalanlıyordu.)
# Ölçüldü (2026-09-03, motor nesri): 46.810/25.729 = 1,8193 · 101.388/55.261 =
# 1,8347. Kırılma ampirik braketlendi: est 23.924 sığdı, est 27.698 (gerçek
# 25.729) kesildi. Dosyanın sarımını değiştirme: aynı 107.382 karakter dar ve
# geniş sarımda 63.767 vs 62.198 token ölçüldü.

set -euo pipefail

TOKEN_COMFORT=${TOKEN_COMFORT:-6000}
TOKEN_HARD=${TOKEN_HARD:-20000}
LINE_FLAG=${LINE_FLAG:-400}
LONGLINE=${LONGLINE:-1500}

# --- Dosya listesini topla ---
files=()
if [ "${1:-}" = "-d" ]; then
  [ -n "${2:-}" ] || { echo "kullanım: doc-scan.sh -d <dizin>" >&2; exit 2; }
  [ -d "$2" ] || { echo "dizin yok: $2" >&2; exit 2; }
  # ⚠️ FAIL-OPEN KAPATILDI: `-d` tek dizin alır. Fazladan argüman sessizce atılırsa çıktı EKSİK olur
  # ama exit 0 döner — ölçüm aracında en kötü arıza budur ("boş çıktı 'sorun yok' değil 'bilgi yok'").
  [ "$#" -eq 2 ] || { echo "hata: -d tek dizin alır; fazladan argüman taranMAZ: ${*:3}" >&2
                      echo "      dizini ve dosyaları birlikte taramak için -d'yi bırak:" >&2
                      echo "      doc-scan.sh \$(git ls-files -co --exclude-standard '*.md')" >&2; exit 2; }
  while IFS= read -r f; do files+=("$f"); done < <(find "$2" -type f -name '*.md' | sort)
else
  files=("$@")
fi
[ "${#files[@]}" -gt 0 ] || { echo "kullanım: doc-scan.sh <dosya...> | -d <dizin>" >&2; exit 2; }

# --- Başlık ---
printf '%-46s %6s %9s %7s %12s %6s  %s\n' \
  "DOSYA" "SATIR" "KARAKTER" "~TOKEN" "EN_UZUN" ">${LONGLINE}" "BAYRAK"
printf '%.0s-' $(seq 1 104); printf '\n'

# --- Satırları üret (diziye topla ki sayaçlar pipeline subshell'inde kaybolmasın) ---
rows=()
flagged=0
total=0
for f in "${files[@]}"; do
  if [ ! -f "$f" ] || [ ! -r "$f" ]; then
    printf 'uyarı: atlandı (yok/okunamaz): %s\n' "$f" >&2
    continue
  fi
  total=$((total + 1))
  lines=$(awk 'END{print NR}' "$f")           # newline'sız son satırı da sayar (wc -l saymaz)
  # KARAKTER ve en-uzun-satır aynı python3 geçişinde, locale'den BAĞIMSIZ sayılır
  # (utf-8 + newline='' — audit-canvas.py sayımıyla birebir hizalı; C locale'de
  # wc -m bayt sayarak sapıyordu). python3 yoksa fallback: wc -m (locale'e bağlı)
  # + awk — mawk length() BAYT sayar, çok-baytlı satırlarda metrikleri abartabilir.
  if command -v python3 >/dev/null 2>&1; then
    out=$(python3 -c '
import sys
m=ma=l=tot=0
for i,line in enumerate(open(sys.argv[1],encoding="utf-8",errors="replace",newline=""),1):
    tot+=len(line)
    n=len(line.rstrip("\r\n"))
    if n>m: m,ma=n,i
    if n>int(sys.argv[2]): l+=1
print(tot,m,ma,l)' "$f" "$LONGLINE") || { echo "uyarı: sayım başarısız, atlandı: $f" >&2; total=$((total - 1)); continue; }
    read -r chars maxlen maxat longn <<<"$out"
  else
    chars=$(wc -m < "$f" | tr -d ' ')
    read -r maxlen maxat longn <<<"$(awk -v t="$LONGLINE" '
      { if (length($0) > m) { m = length($0); ma = NR } if (length($0) > t) l++ }
      END { print m + 0, ma + 0, l + 0 }' "$f")"
  fi
  esttok=$(( chars * 100 / 169 ))             # ~ char / 1,69 (kalibrasyon: başlık notu)

  flag=""
  if   (( esttok > TOKEN_HARD ));    then flag="${flag}TOKEN-SERT "
  elif (( esttok > TOKEN_COMFORT )); then flag="${flag}token-rahat "; fi
  if (( lines  > LINE_FLAG )); then flag="${flag}satır "; fi
  if (( maxlen > LONGLINE  )); then flag="${flag}uzun-satır(L${maxat}) "; fi
  [ -n "$flag" ] && flagged=$((flagged + 1))

  # token'ı sıralama anahtarı olarak başa koy (sonra cut ile düşür)
  rows+=("$(printf '%012d\t%-46s %6s %9s %7s %9s@L%-4s %6s  %s' \
    "$esttok" "$f" "$lines" "$chars" "$esttok" "$maxlen" "$maxat" "$longn" "$flag")")
done

# token'a göre azalan sırala, sıralama anahtarını düşür
[ "${#rows[@]}" -gt 0 ] && printf '%s\n' "${rows[@]}" | sort -rn | cut -f2-

# --- Özet ---
printf '%.0s-' $(seq 1 104); printf '\n'
printf '%d doküman tarandı, %d tanesi bayraklı (eşik: ~%d/%d token, %d satır, %d karakter/satır).\n' \
  "$total" "$flagged" "$TOKEN_COMFORT" "$TOKEN_HARD" "$LINE_FLAG" "$LONGLINE"

# Hiç doküman taranamadıysa (tüm yollar atlandı/bulunamadı) non-zero çık —
# açık dosya-listesi modunu -d modunun boş-küme davranışıyla tutarlı kıl.
[ "$total" -gt 0 ] || { echo "uyarı: hiç doküman taranamadı (tüm yollar atlandı/bulunamadı)" >&2; exit 2; }
