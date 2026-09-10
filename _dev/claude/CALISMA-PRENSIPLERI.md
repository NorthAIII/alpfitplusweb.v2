# Çalışma Prensipleri

← CLAUDE.md · doktrin: çalışma prensipleri

> Bu dosya kök `CLAUDE.md`'nin bölme çocuğudur ve oraya **import edilir** (`@_dev/claude/CALISMA-PRENSIPLERI.md`) — içeriği her oturumda bağlamdadır. Parent'taki aynı adlı bölüm özet + pointer tutar; **tam metin burasıdır**. Doktrin dört kardeş dosyaya bölünmüştür (`DOKUMAN-KURALLARI` · `DOKUMAN-DISIPLINI` · `CALISMA-PRENSIPLERI` · `COMMIT`) ve **dördü de aynı anda bağlamdadır**; burada bulamadığın bir bölüm adı kardeş dosyadadır — tam listeyi parent'ın "Doktrin Dosyaları" bloğu tutar.

---

## Çalışma Prensipleri

1. **Otonom çalış.** Task'ı al, tamamla, test et, commit at.
2. **Şüphede sor.** Belirsizlik, risk veya karar gerektiren durumlarda kullanıcıya danış. Yanlış bir şey yapmaktansa sormaktan çekinme.
3. **Halüsinasyon yapma.** Emin olmadığın şeyleri yazma/söyleme. Eksik bilgi, yanlış bilgiden iyidir.
4. **Acele etme.** Kararların sonuçlarını düşün. Sırf öneri vermek için öneri verme.
5. **Varsayımları sorgula.** Kullanıcının her şeyi doğru yaptığını varsayma, kontrol et.
6. **Bilgi havuzunu güncel tut.** Elde ettiğin bilgileri düzenli kaydet. Önemli kararları `_dev/docs/DECISIONS.md`'ye yaz.
7. **Test atlanmaz.** Her task'ın tamamlanma kriteri teste bağlıdır.
8. **Riskli komutlar çalıştırma.** Emin olmadığın komutları çalıştırma, kullanıcıya danış.
9. **`_dev/` izolasyonunu koru.** DevFlow dokümanlarını `_dev/` dışına koyma, projenin dokümanlarını `_dev/` içine koyma.
10. **Hiçbir dosya yarım veya atlanarak okunmaz.** Bir Read çağrısı dosyayı tam getirmezse — çıktıda truncate / **PARTIAL** / satır-limiti uyarısı görürsen ya da istediğin aralık eksik döndüyse — **kör deneme-yanılma yapma** (giderek daralan aralıkları rastgele deneme) ve **yarım okuyup sonraki işe geçme**. Kural `_dev/` ile sınırlı değil; kod ve dış dosyalar dahil her Read için geçerli. Sırayla:
    0. **PARTIAL'ı görünür işaretle (zorlayıcı kapı):** Tek satır yaz — `PARTIAL: <dosya> L<a>-<b> okundu · gerisi kalan — kurtarıyorum`. Bu notu yazmadan ve kalan satırların **tamamı** okunmadan başka işe geçemezsin. (Görünür kapı bilinçlidir: salt "tam oku" buyruğunun bir tavanı var — atlama refleksi ancak yazılması zorunlu bir çıktıyla kırılır.)
    1. **Mekanik haritala:** `bash .claude/commands/devflow/scripts/doc-scan.sh <dosya>` çalıştır. Bu script Read aracını kullanmaz (`wc`/`awk` ile çalışır), o yüzden Read'in açamadığı dosyayı bile tarar — satır sayısını, en yoğun bölgeyi (en uzun satır @ satır no) ve toplam boyutu verir.
    2. **Konumla:** `grep -n` ile ihtiyacın olan başlığı/bölgeyi bul.
    3. **Kalanı tamamla:** doc-scan'in gösterdiği yoğunluğa göre offset+limit ile dar, hedefli aralıklar oku (yoğun bölgede daha küçük pencere); **doc-scan'in verdiği son satıra kadar kapsanmamış satır kalmayana dek tekrarla** — başarı koşulu budur, "bir parça daha okudum" değil.
    4. **`_dev/` dokümanıysa işaretle:** Tek-okumaya sığmayan bir `_dev/` dokümanı aynı zamanda bir Boyut ve Bölünme ihlalidir — kullanıcıya teşhise göre müdahale öner (temizlik / bölme / supap-mezuniyeti — `DOKUMAN-DISIPLINI.md` → Boyut ve Bölünme). (Kod/dış dosyalarda bu adım yok — yalnız kurtar.)
    5. **Yine olmazsa dur:** Hedefli parçalı okuma da başarısızsa **dur, durumu kullanıcıya bildir, yardım iste** — eksik bilgiyle devam etme, atlama.
11. **Boşluk varsa önce araştır, sonra gerekirse sor.** Bilmediğin bir konu/dosya/kullanım/bağlam karşına çıktığında varsayımla doldurma — ilgili dokümanı oku, grep/find ile kodda ara, gerektiğinde web araştırması yap. Araştırma sonrasında hala net değilse kullanıcıya sor.
12. **Gördüğün sorunu düşürme.** Kapsam dışı bir sorun/uyarı (CI failure, bot uyarısı, bug) fark edersen işini kesme, kapsama alınmadıkça o an çözmeye de girişme — `_dev/BULGULAR.md` → **Gelen Kutusu**'na kaynak işaretli tek satır düş (`- [TASK-X.YY] ...`; işaret: `[TASK-X.YY]` / `[PHASE-N]` / `[QUICK-NNN]` / `[oturum türü]`. Dosya yoksa template'ten oluştur — `.claude/commands/devflow/templates/BULGULAR.md` — ve INDEX'e kaydet). Secret/credential değerini kayda asla yazma — yalnız konumunu. PRD/vizyon düzeyi fikir buraya değil → `/devflow:prd-note`. Bu kutuyu verify-phase Adım 1 süpürür (bu faza dokunanlar), audit-product uzlaştırması triyaj eder.

---

## Task Boyutu Felsefesi

**Task dokümanı detaylı, iş paketi küçük.**

- Az context = yüksek kalite
- Her task tek oturumda, dar odakla bitirilecek boyutta olmalı
- 1-3 dosya değişikliği ile tamamlanabilir
- "Önce şunu sonra bunu" diye ikiye bölünebiliyorsa → bölünmeli
- Task sayısının fazla olması sorun değil — küçük ve odaklı olması önemli
- Yan yana yapılması gereken işler aynı task'te olabilir

---

## Task Tamamlanma Sırası

Her task bittiğinde bu sıra izlenir (ATLANMAZ):
1. **Test** — Testleri çalıştır (yoksa yaz ve çalıştır)
2. **Task Dokümanı** — Oturum kaydı ekle, durumu güncelle
3. **DURUM.md ve Faz Dokümanı** — Aktif task pointer güncelle, task özeti ekle. Faz dokümanında task durumu güncelle.
4. **MEMORY** (gerekirse) — Beklenmeyen proje-geneli tuzak/öğrenim varsa `_dev/memory/<slug>.md` ekle/güncelle + MEMORY.md index'ini güncelle
5. **Archive** — Task bittiyse `_dev/tasks/archive/` klasörüne taşı
6. **Commit & Push** — Bu oturumun tüm değişikliklerini (kod + doküman) tek commit'te gönder (dosya-bazlı stage — Paralel Oturum Farkındalığı)
7. **Oturum Kapanır** — İkinci task'e geçilmez

---
