# /devflow:help — DevFlow Komut Rehberi

Kullanıcıya aşağıdaki bilgiyi göster. Bu komutta dosya okumaya gerek yok.

---

## DevFlow — Komutlar

### PRD (Proje Başlamadan Önce)
| Komut | Açıklama |
|-------|----------|
| `/devflow:prd` | İlk PRD oturumu — projeyi keşfet, PRD dokümanlarını oluştur |
| `/devflow:prd-refine` | PRD'yi derinleştir (tekrarlanabilir; kickoff öncesi + tüm versiyonlar bitince yeni versiyon tanımı) |
| `/devflow:prd-save` | PRD oturumunu kaydet — prd, prd-refine, prd-review oturumlarında kullanılır |
| `/devflow:prd-note` | Geliştirme sırasında not/analiz — fikirleri araştır ve kaydet |
| `/devflow:prd-review` | Versiyon sonrası PRD değerlendirmesi (zorunlu, tekrarlanabilir) |

### Proje Başlatma (Her Adım Ayrı Oturum)
| Komut | Açıklama |
|-------|----------|
| `/devflow:kickoff` | Oturum 1: Projeyi anla, modülleri belirle, fazları planla (PRD varsa okur, re-kickoff destekler) |
| `/devflow:kickoff-docs` | Oturum 2: `_dev/` yapısını oluştur, dokümanları doldur |
| `/devflow:kickoff-verify` | Oturum 3: Kontrol et, CLAUDE.md ve git stratejisini oluştur, eksikleri tamamla |
| `/devflow:map-codebase` | Mevcut kodu analiz et, `_dev/` yapısını otomatik oluştur (brownfield giriş) |

### Faz Döngüsü (Her Adım Ayrı Oturum)
| Komut | Açıklama |
|-------|----------|
| `/devflow:discuss-phase [N]` | Kapsam tartışması — gri alanları belirle, tercihleri topla, versiyon sonu tespiti |
| `/devflow:research-phase [N]` | Teknik araştırma — stack, yaklaşımlar, tuzaklar |
| `/devflow:plan-phase [N]` | Task yazımı |
| `/devflow:verify-plan [N]` | Task dokümanlarını review et, düzelt, onayla |
| `/devflow:run-task` | Sıradaki task'ı çalıştır (her oturumda 1 task) |
| `/devflow:verify-phase [N]` | Kullanıcı kabul testi (UAT) + adversarial test |
| `/devflow:review-phase [N]` | Faz review + retrospektif + kalite kontrol + kullanıcı yolculuğu |

### Yardımcı
| Komut | Açıklama |
|-------|----------|
| `/devflow:next` | Sıradaki adımı DURUM'dan bul ve çalıştır — faz döngüsünde komut takibini ortadan kaldırır |
| `/devflow:quick` | Ad-hoc task — faz döngüsü dışı hızlı iş. Projede bir yayın hattı beyanlıysa **yayın** ve **acil düzeltme** de bu komutun türleridir (akış: `_dev/GIT-STRATEJI.md`) |
| `/devflow:pause` | Oturumu durdur (faz döngüsü veya quick), handoff bilgisi yaz |
| `/devflow:resume` | Kaldığı yerden devam et |
| `/devflow:progress` | Proje durumunu göster |
| `/devflow:double-check` | Oturum sonu doküman kontrolü — değişiklikleri eleştirel gözle incele, hata/tutarsızlıkları yakala |
| `/devflow:audit-docs` | Proje-genişlikli doküman denetimi — artımlı (rolling) canvas; tur başına bir **paket** doküman (varsayılan 3), tek raporla **raporla, onayla, düzelt**; sürekli ilerleme için `/loop` |
| `/devflow:audit-product` | Proje-genişlikli **ürün** denetimi — projeyi kendi dokümanlarından anlar, kendi test/senaryolarını çalıştırır (kod değiştirmez); bulgular `_dev/BULGULAR.md` kanvasına. Çıplak çağrı = **derin tur** (çok-ajanlı, canlı ürün üzerinde); hafiflik istersen "hafif tur" de |
| `/devflow:step-by-step` | Tartışma modu — konuları teker teker aç, seçenek+öneri sun, karar bekle (herhangi bir oturumda çağrılabilir) |
| `/devflow:guide-me` | Eylem modu — uzun bir yapılacaklar listesini adım adım yürüt, her adım için devam sinyali bekle (herhangi bir oturumda çağrılabilir) |
| `/devflow:help` | Bu yardım metnini göster |

### Tipik Akış — Yeni Proje (PRD ile)
```
prd → prd-refine (tekrarla) → prd-save (opsiyonel)
  → kickoff → kickoff-docs → kickoff-verify
  → discuss-phase 1 → research-phase 1 → plan-phase 1 → verify-plan 1
  → run-task (tekrar) → verify-phase 1 → review-phase 1
  → discuss-phase 2 → ...
  → [versiyon sonu: teknik borç fazı → senaryo testi fazı]
  → prd-review → [değişiklik varsa: kickoff (re-kickoff)]
  → discuss-phase N → ...
```

### Tipik Akış — Yeni Proje (PRD'siz)
```
kickoff → kickoff-docs → kickoff-verify
  → discuss-phase 1 → research-phase 1 → plan-phase 1 → verify-plan 1
  → run-task (tekrar) → verify-phase 1 → review-phase 1
  → discuss-phase 2 → ...
```

### Tipik Akış — Mevcut Projeye PRD Ekleme
```
prd → prd-refine (tekrarla)
  → kickoff (re-kickoff modu) → kickoff-docs → kickoff-verify
  → discuss-phase N → ...
```

### Tipik Akış — Mevcut Projeye Giriş (Brownfield)
```
map-codebase
  → prd → prd-refine (opsiyonel) → kickoff (re-kickoff) → kickoff-docs → kickoff-verify
  → discuss-phase 1 → ...
```

> **Not:** Akış diyagramlarına dahil olmayan beş komut herhangi bir oturumda çağrılabilir:
> - `/devflow:double-check` — oturum sonunda (pause/prd-save/kapanış özeti öncesinde) bu oturumda düzenlenen dokümanları eleştirel gözle tekrar inceler. Kapsam: bu oturum.
> - `/devflow:audit-docs` — proje-genişlikli doküman denetimi, **artımlı (rolling)** çalışır: bir canvas sıradaki dokümanları seçer, çalıştırma başına bir **paket** işlenir (varsayılan 3 doküman; sürekli için `/loop`). Drift/şişme/soft-delete kalıntıları + statik doküman bayatlaması (gerçeklik mutabakatı) + DevFlow konvansiyonu değiştiğinde migration tek mekanizmada toplanır. Çok dokümanlı tur **filo turudur** (doküman başına salt-okunur keşif ajanı; yargı ve yazma tek elde). Tur tek **paket raporuyla** kapanır: her kalem `Sorun / Öneri / Dayanak` anatomisiyle yazılır — zorunlu olan `Dayanak` kapalı kümedir (`Template` / `KURAL` / `Gerçeklik` / `Proje-özgü` — proje-özgü olan mekanik değil, seçenekli soru olur); mekanik kalemler toplu onaylanır, kararlar sonra tek tek açılır (auto-fix yok). Tur dışındaki bir dokümanda görülen kanıtlı hata da rapora **kapsam-dışı borç** olarak girer. Komut yanına serbest tur talimatı yazılabilir ("5 doküman"). Faz/versiyon sonu, konvansiyon güncellemesi veya doküman karmaşası hissedildiğinde manuel çağrılır.
> - `/devflow:audit-product` — proje-genişlikli **ürün** denetimi: projenin dokümanlarından "olması gereken"i çıkarır (kabul kriterleri, davranış kuralları, ilkeler), kendi senaryolarını tasarlayıp çalıştırır (tarayıcı otomasyonu dahil; **kod değiştirmez**, prod'da salt-okunur). Fazların odağı dışında kalan sessiz drift'i yakalamak içindir. Doğrulanmış bulgular `_dev/BULGULAR.md` kanvasına birikir; faz döngüsünde ele alınır (discuss-phase → bulgu fazı). Komut yanına serbest "tur talimatı" yazılabilir (odak, notlar, o tura özel izinler). **İki mod:** çıplak çağrı = **derin tur** (varsayılan — çok-ajanlı keşif, canlı icra, düşmanca doğrulama); hafiflik istersen tur talimatında belirtirsin ("hafif tur") — kanıt standardı aynı kalır, yalnız efor ölçeği düşer. İlk turda ortam/araç zemini MEMORY'de eksikse bir kez sorar ve oraya yazar; zemin kayıtlıysa sormadan başlar. Manuel çağrılır.
> - `/devflow:step-by-step` — tartışmalı birden fazla konu olduğunda tartışma tarzını tek-tek moda çevirir; her konu için bağlam+seçenek+öneri sunar, karar bekler.
> - `/devflow:guide-me` — Claude bir önceki mesajda uzun bir eylem/yapılacaklar listesi verdiğinde, o listeyi adım adım yürütür: her adımı tek başına açar (banner'la `Adım N/Toplam`), kullanıcı devam sinyali (yaptım/tamam/ekran görüntüsü) verince sıradakine geçer. step-by-step'in eylem-modu eşi.

### Kurallar
- Faz döngüsünde sıradaki komutu kendin takip etmek yerine `/devflow:next` yazabilirsin — DURUM'dan doğru adımı bulup o komutu çalıştırır (kapsam: faz döngüsü; kickoff/PRD manuel)
- Her faz adımı ayrı oturumda çalışır — oturumlar arası bilgi aktarımı dokümanlar üzerinden olur
- Her oturum sonunda sıradaki adım önerilir
- Task oturumlarında sadece 1 task çalıştırılır
- Planlama oturumunda task çalıştırılmaz
- Bir seferde sadece 1 faz planlanır
- `_dev/` klasörü tüm proje dokümanlarını barındırır
- `_dev/PRD/` klasörü PRD dokümanlarını barındırır
- Git disiplini projeye özgüdür ve `_dev/GIT-STRATEJI.md`'de beyanlıdır — tek dal da geçerli bir cevaptır; strateji kurulumda belirlenir, versiyon sonunda yeniden değerlendirilir
- Versiyon ortasında PRD değişikliği yapılmaz — fikirler `/devflow:prd-note` ile kaydedilir
- Her versiyon sonunda teknik borç + senaryo testi fazları ve ardından zorunlu prd-review çalıştırılır
- Oturum beklenmedik şekilde kesildiyse → `/devflow:resume` ile kaldığı yerden devam et
- PRD oturumu kesildiyse → `/devflow:prd-save` ile kaydet
