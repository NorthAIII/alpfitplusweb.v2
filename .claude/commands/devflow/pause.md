# DevFlow — Oturumu Durdur (Pause)

Bu komut bir oturumu düzgünce durdurmak ve sonraki oturumda kaldığı yerden devam edebilmek için handoff bilgisi yazmak amacıyla kullanılır.

**Kullanım:** `/devflow:pause`

---

## Okunacak Dosyalar

pause oturum-sonu komutudur (double-check / prd-save ile aynı kategori): oturumda protokol zaten uygulanmıştır (ana komutun Adım 0'ı ya da komutsuz oturumun ilk proje sorusu — CLAUDE.md → Okuma onayı), çekirdek protokol dokümanları bağlamdadır — protokolü tekrar tetikleme; hiç uygulanmadıysa DURUM'u burada oku. Handoff, aktif durum (faz/adım/task) DURUM.md'nin bağlamdaki kopyasından okunarak canlı çalışma belleğinden yazılır. **Sabit ek dosya listesi yok.**

---

## Yapılacaklar

### 1. Aktif Çalışmayı Tespit Et

DURUM.md'den aktif durumu oku:
- Hangi faz aktif?
- Hangi adımdayız? (discuss, research, plan, verify-plan, task, verify, review)
- Aktif task var mı?
- Quick oturumu mu? (faz döngüsü dışı ad-hoc iş — bu oturumda quick akışı yürüyorsa DURUM'daki faz/task alanlarına bakma; onlar faz döngüsünün korunan pozisyonudur)
- Denetim oturumu mu? (audit-docs / audit-product — döngü dışı komutlar; bu oturumda denetim akışı yürüyorsa DURUM'daki faz/task alanlarına yine bakma — aynı korunan-pozisyon kuralı)
- İş üretmemiş oturum mu? (**ölçüt komutun varlığı değil işin varlığıdır**: faz/task/quick/denetim akışlarından hiçbiri yürümedi **ve devredilecek yarım iş yok** — komutsuz soru-cevap ya da yalnız rapor/tartışma komutu çalışmış oturum: `step-by-step`, `guide-me`, `progress`, devretmeden duran `next`. Oturumda kod/doküman değiştiyse ya da yarım kalmış iş varsa bu dal değildir, üstteki dallardan birine düşer. DURUM'daki faz/task alanlarına yine bakma — aynı korunan-pozisyon kuralı)

### 2. Handoff Bilgisi Yaz

**Task oturumundaysa** → Task dokümanının **Oturum Kayıtları** bölümüne `.claude/commands/devflow/templates/TASK.md` yapısına uygun, **Durum: ⏸️ Duraklatıldı** olan zengin bir kayıt yaz — yapı template'te tanımlıdır, burada tekrarlanmaz (tek-ev). Duraklatmada **"Son Yaklaşım"** ve **"Sonraki Adım Detayı"** alanları en kritik olanlardır, bunları dolu bırak.

**Quick oturumundaysa** → QUICK kaydını quick.md Adım 3'e göre oluştur/güncelle — **Durum: ⏸️ Duraklatıldı**, "Son Yaklaşım" ve "Sonraki Adım Detayı" dolu. Commit, bu dosyanın Adım 3'ündeki pause formatıyla atılır (quick.md Adım 5 formatı tamamlanan oturumlar içindir). Ayrıca DURUM.md'nin **Duraklatma Notu**'na kanonik bloğu yaz:
```
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** quick
> **Detay:** QUICK-NNN — [kısa açıklama]
> **Handoff:** QUICK dosyasında (Son Yaklaşım / Sonraki Adım Detayı)
```

**Denetim oturumundaysa** (audit-docs / audit-product) → DURUM'a **Duraklatma Notu YAZMA** — denetim kaldığı yerini kendi kanvasında tutar: audit-product'ta BULGULAR'ın **Yarım tur** satırını doldur (odak + nerede kalındı; o ana kadarki bulgular zaten kademeli yazılmıştır), audit-docs'ta ekstra kayıt gerekmez (`_dev/.audit/` cursor'ı kaldığı yeri bilir). Kullanıcıya bildir: devam için komutu yeniden çağırmak yeter.

**İş üretmemiş oturumdaysa** → hiçbir yere duraklatma kaydı yazılmaz: DURUM'a Duraklatma Notu YOK, task/QUICK dokümanına oturum kaydı YOK — duraklatılacak iş yoktur. Yalnız Adım 5'in kapanış bloğu yazılır; bu dalda **ilk iki satırı** şöyle olur: `⏸️ Oturum kapatıldı — bu oturum iş üretmedi, yazılacak handoff yok.` / `📋 Sıradaki adım: /devflow:next` (devralınacak yarım iş yok — döngü-dışı varsayılan, CLAUDE.md → Oturum Kapanışı). Üçüncü satır her dalda olduğu gibi yazılır.

**Faz döngüsünün planlama/review gibi bir adımındaysa** (task, quick, denetim ve iş-üretmemiş değil) → DURUM.md'nin **Duraklatma Notu** bölümünü o slotun kanonik formatına göre doldur (bkz. DURUM template → Duraklatma Notu):
```
> ⏸️ **Duraklatıldı:** [tarih]
> **Adım:** [planlama / review / vb.]
> **Detay:** [Nerede kalındı, ne yapılacak]
> **Handoff:** burada (planlama/review oturumu — ayrı task dokümanı yok)
```

### 3. Varsa Commit & Push

**Bu oturumdan** kaydedilmemiş değişiklik varsa commit & push yap (paralel oturumların kirli dosyalarını dahil etme — dosya-bazlı stage; kural → CLAUDE.md → Paralel Oturum Farkındalığı):
```
chore: WIP — pause at [kısa açıklama]
```

### 4. DURUM.md Güncelle

Aktif duruma duraklatma bilgisi ekle — hangi dalda yazılıp yazılmayacağı Adım 2'de tanımlıdır.

### 5. Kullanıcıya Bilgi Ver

```
⏸️ Oturum duraklatıldı. Handoff bilgisi yazıldı.
📋 Devam etmek için: /devflow:resume
<⚠️|✅> Sıradaki oturumdan önce: [iş — kim yapacak — nasıl] | yok
```

Son satırın amblemi ve yazım kuralı → CLAUDE.md → Oturum Kapanışı.

**Denetim oturumunda** ikinci satır şöyledir (resume denetim akışını bilmez — devam yolu komutun kendisidir):
```
📋 Devam etmek için: /devflow:audit-product   (veya /devflow:audit-docs — hangisi duraklatıldıysa)
```

---

## Önemli Kurallar

- Handoff bilgisi detaylı olmalı — sonraki oturum bu bilgiyle başlayacak
- "Son Yaklaşım" ve "Sonraki Adım Detayı" en kritik alanlar
- Varsa ara commit at — yarım değişiklik bırakma (kapsam: yalnız bu oturumun dosyaları)
