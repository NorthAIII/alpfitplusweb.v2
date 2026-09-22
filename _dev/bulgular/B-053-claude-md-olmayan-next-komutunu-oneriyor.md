# B-053: Kök `CLAUDE.md` motor şablonundan geride — olmayan `/devflow:next`'i öneriyor, `run-phase` yok, kapanış bloğu eski biçimde

**Önem:** 🟢 | **Tip:** tutarsızlık / doküman-drift | **Alan:** DevFlow doktrini (kök `CLAUDE.md`)
**Kaynak:** audit-product (Gelen Kutusu `[oturum triyajı]` notunun mezuniyeti) | **Tarih:** 2026-09-13
**Durum:** Açık

## Gözlem

**Beklenen:** Kök `CLAUDE.md`'nin "DevFlow Komutları" listesi ve "Oturum Kapanışı" kuralı, vendored motorun (`.claude/commands/devflow/`) gerçekten sunduğu komutlarla hizalı olmalı. Her oturumun son çıktısı bu kurala göre sıradaki komutu önerir.

**Gözlenen:** Motorda `next.md` yok, `run-phase.md` var. Kök `CLAUDE.md` ise:

- `:138`: *"Döngü-dışı oturumlarda (quick, audit-docs, audit-product, progress) varsayılan öneri `/devflow:next`'tir."* Var olmayan bir komutu önerir.
- `:197`: Yardımcı komutlar listesinde `next` var.
- `:82-83`: Okuma onayı kuralında "`next` istisnası" ve "`next` devretmeden durdu" dalları, var olmayan bir komutun davranışını tanımlıyor.
- `run-phase` hiçbir listede yok.

Motorun kendi şablonu (`templates/CLAUDE-MD.md`) ve komut dosyaları `devflow:next`'e atıf yapmıyor (grep: 0). Yani drift projenin kök dosyasında. Kutudaki not bunu rev `4e55308`'de görmüştü; drift o güncellemeden ve sonraki rev `ec8502b` güncellemesinden (`5800f3d`) sonra da duruyor.

**İkinci belirti — kapanış bloğunun biçimi (aynı kök neden):** motor şablonu (`templates/CLAUDE-MD.md:130-135`) dört satırlık blok tanımlıyor: `<✅|⚠️|⏸️>` sonuç · `📋 Sıradaki adım` · `→` gerekçe · `<⚠️|💡|✅> Açık kalemler` ile kapalı önek kümesi `engel:` / `önerilir:`, terfi kuralı ve ön-hazırlık (QUICK kaydı) kuralı. Kök `CLAUDE.md:129-132` ise iki satırlık eski biçimi tutuyor: `📋 Sıradaki adım` + `<⚠️|✅> Sıradaki oturumdan önce`, `💡` durumu ve `engel:` öneki yok. Komut dosyaları (ör. `audit-product.md` Adım 7) yeni biçimi yazıp kanon olarak "`CLAUDE.md` → Oturum Kapanışı"nı gösteriyor. Yani komut ile kanonu farklı blok tarif ediyor.

**Etkisi:** Kapanış bloğunu kuralın metnine göre yazan bir oturum kullanıcıya çalışmayan bir komut önerir. `audit-product` Adım 7 bunu DURUM'dan türeterek zaten aşıyor, ama kural metni o dalda da `next` diyor. Blok biçimi farkı da oturumdan oturuma tutarsız kapanışlar üretir: aynı durumda biri `⚠️ Sıradaki oturumdan önce`, öteki `💡 Açık kalemler: önerilir:` yazar.

## Kanıt

```
$ ls .claude/commands/devflow/ | grep -c "^next.md$"         → 0
$ ls .claude/commands/devflow/ | grep "run-phase"             → run-phase.md
$ grep -n "next\b\|run-phase" CLAUDE.md
82:  ... **`next` istisnası:** yalnız DURUM okuyup hedef komuta devreder ...
83:  ... ya da `next` devretmeden durdu ...
138: ... varsayılan öneri `/devflow:next`'tir.
197: **Yardımcı:** `next`, `quick`, `pause`, ...
$ grep -rln "devflow:next" .claude/commands/devflow/*.md .claude/commands/devflow/templates/CLAUDE-MD.md   → (boş)
```

## Kök Neden Yönü

Motor güncellemesi vendored klasörü yeniler, kök `CLAUDE.md`'yi yenilemez. Parent/çocuk hizası `audit-docs` (conform) mutabakatına kalıyor ve güncellemeden bu yana çalışmadı.

## Koruma Önerisi

- Rota: `/devflow:audit-docs` (conform). Kök `CLAUDE.md` motor şablonuna hizalanır.
- Kalıcı koruma DevFlow tarafında: motor güncellemesi sonrası kök dosyadaki komut adlarını `ls .claude/commands/devflow/*.md` kümesiyle karşılaştıran bir kontrol. Proje içinde düzeltilmez, DevFlow'a öneri olarak iletilir.

## Çözüm Kaydı

—

**Yeniden ölçüm (audit-product 2026-09-22) — açık ve atomda yazandan GENİŞ.**

Gerçek komut dosyaları (`ls .claude/commands/devflow/*.md`, 27 adet): `next.md` **yok**, `run-phase.md` **var**.

| | Kök `CLAUDE.md:197` | Şablon `templates/CLAUDE-MD.md:224` |
|---|---|---|
| Yardımcı satırı | `` `next` ``, quick, pause, … | `` `run-phase` ``, quick, pause, … |

`next` ayrıca `CLAUDE.md:138` (*"varsayılan öneri `/devflow:next`'tir"*), `:82` (*"`next` istisnası"*), `:83`'te geçiyor; **`run-phase` kök dosyada hiçbir listede yok**. PRD / Proje Başlatma / Faz Döngüsü satırları (`:194-196`) şablonla birebir aynı — drift yalnız Yardımcı satırında.

**İkinci belirti atomda yazandan büyük — kapanış bloğu:**

| | Kök `CLAUDE.md:126-138` | Şablon `:126-148` |
|---|---|---|
| Blok | **2 satır** (`📋` + `Sıradaki oturumdan önce`) | **4 satır** (sonuç · `📋` · `→` gerekçe · `Açık kalemler`) |
| Önek kümesi | yalnız `önerilir:` | `engel:` + `önerilir:` |
| `💡` durumu · terfi kuralı · "blok üretmeyen komutlar" · "nihai blok oturumun son sözüdür" | yok | var |

Komut dosyaları (`audit-product.md` Adım 7 dahil) şablonun 4 satırlık bloğunu kanon sayıp *"CLAUDE.md → Oturum Kapanışı"*na işaret ediyor, ama kök dosya eski biçimi tutuyor. Rota değişmedi: `/devflow:audit-docs`.
⚠️ Karşılaştırma **çalışma ağacı** hâliyle yapıldı; motor dosyaları bu sırada başka bir oturumun commit'lenmemiş değişikliklerini taşıyordu.
