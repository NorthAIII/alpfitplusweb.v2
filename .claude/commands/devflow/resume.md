# DevFlow — Kaldığı Yerden Devam (Resume)

Bu komut duraklatılmış bir oturumu kaldığı yerden devam ettirmek için kullanılır.

**Kullanım:** `/devflow:resume`

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

> Not: `_dev/DURUM.md`'yi protokol kapsamında okurken duraklatma bilgisi ve aktif durumu tespit et.

### Komuta Özgü Ek Dosyalar

**Duruma Göre (DURUM.md'den belirle)**
- **Task duraklatılmışsa:** `_dev/tasks/TASK-X.YY.md` → oturum kaydındaki handoff bilgisini oku
- **Planlama duraklatılmışsa:** `_dev/phases/PHASE-N.md`
- **Review duraklatılmışsa:** `_dev/phases/PHASE-N.md` (QUALITY.md gerekmiyor — review-phase devraldığında onu kendi Zorunlu listesinde okur)
- **Quick duraklatılmışsa** (Duraklatma Notu'nda `Adım: quick`): notta işaret edilen `_dev/tasks/quick/QUICK-NNN-*.md` → "Son Yaklaşım", "Sonraki Adım Detayı" **ve varsa `**Tür:**` alanı** — tür akışın dalını belirler (`yayın` / `acil düzeltme` ise rota bu dosyanın değil `_dev/GIT-STRATEJI.md`'nin akışıdır), okunmazsa duraklatılmış bir yayın işi çalışma quick'i sanılır. Bu durumda DURUM'daki Aktif Faz → Adım'a bakma — o, faz döngüsünün korunan pozisyonudur; quick ondan bağımsız duraklatılmıştır

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan başlama; yazınca da durma — Adım 1'e geç.

### 1. Durumu Anla

DURUM.md'den:
- Hangi faz aktif?
- Hangi adımda duraklatıldı?
- Task oturumuysa: hangi task, ne kaldı?

### 2. Handoff Bilgisini Oku

- Task dokümanındaki son oturum kaydından "Son Yaklaşım" ve "Sonraki Adım Detayı"nı oku
- Quick duraklatılmışsa QUICK dosyasındaki "Son Yaklaşım" / "Sonraki Adım Detayı"nı oku
- Veya DURUM.md'deki duraklatma notunu oku

### 3. Kullanıcıya Durumu Özetle

```
📋 Kaldığınız yer:
- Faz: [N]
- Adım: [task çalıştırma / planlama / vb.]
- Detay: [ne kaldı]

Devam ediyorum...
```

Quick devralındıysa "Faz" satırı yerine "İş: QUICK-NNN ([konu])" yaz — faz döngüsü pozisyonu gösterilmez.

### 4. Kaldığı Yerden Devam Et

**Kapanış bloğunu devraldığın komut yazar** — `resume` ikinci bir blok yazmaz; Adım 3'ün `📋 Kaldığınız yer` özeti bir açılıştır, kapanış değildir (kanon: CLAUDE.md → Oturum Kapanışı).

İlgili komutun (run-task, plan-phase, quick vb.) akışını kaldığı yerden sürdür. Quick devralındıysa quick.md akışını sürdür — Adım 1'in devam/yeni sorusu atlanır (devam olduğu bellidir) ama **Adım 1b'nin kayda-bakma fıkrası atlanmaz**: türü kayıttan oku, yoksa 1b'yi olağan haliyle işlet.

**Kanonun duraklatma kapısı İKİ tetiklidir** — *"Duraklatma Notu doluysa **ya da** Aktif Task durumu `⏸️` ise"* (CLAUDE.md → Oturum Kapanışı, *"Türetmeden önce duraklatmaya bak"*) — ve birini kapatıp ötekini bırakmak kapıyı kapatmaz. İkisinin sahibi aynı değildir:
- **Duraklatma Notu her devirde sıfırlanır** — quick de, faz task'ı da, planlama/review adımı da: iş devralınınca *"Duraklatma yok"*a döndürülür (template kuralı: devam edildiğinde silinir).
- **Aktif Task → `Durum` alanına yalnız devralınan iş O TASK ise dokunulur** ve `⏸️` işin gerçek durumuna çekilir (kanonik kodlar: `tasks/TASKS-README.md` → Durum Kodları). **Quick devrinde bu alan korunur** — faz döngüsünün pozisyonudur ve quick ona bilinçle dokunmaz (`quick` Adım 4); orada gördüğün `⏸️` **beklenen hâldir** ve duruş sebebi değildir: duraklatılmış bir faz task'ının korunan izidir, Duraklatma Notu hangi işi devraldığını zaten söyler. **Duruş yalnız kaydın eksik olduğu hâlde doğar** ve ölçümü **Adım 1'de okuduğun hâle** bakar — oturuma girerkenki DURUM'a, yukarıdaki sıfırlamadan SONRAKİNE değil: Ölçüt notun doluluğu değil, **duraklatılan işi ADLANDIRAN bir kaydın bulunup bulunmadığıdır**: Duraklatma Notu oturum açılışında boşken bile Aktif Task bir task adı taşıyor **ve** o task dokümanında oturum kaydı varsa iş adlandırılmıştır — devral (aynı hüküm: aşağıdaki *Beklenmedik Oturum Kesintisi* md. 4-6). Ad da kayıt da yoksa duraklatılan işi söyleyen hiçbir şey yoktur. **Hangi işin duraklatıldığını varsayma** — dur ve sor (koşulun ve yasağın kaynağı: `lib/kosum-zemini.md` b, *"Not yokken `⏸️` görürsen … varsayımla `resume` dağıtma"*).

**Sıfırlamanın sahibi devralan ya da kapatan oturumdur, komutun adı değil** — `resume` bunun yalnız bir taşıyıcısıdır; kardeşlerini burada sayma, hükmü kendi akışında uygulayan komut zaten uygular. Atlanırsa tetik depoda ayakta kalır ve sonraki oturum — task ✅'lanıp arşive taşınmış olsa bile — yine `/devflow:resume`'a yollanır. Orkestratörlü koşumda bedel kulvara göre değişir (`run-phase` → Kulvar, Duraklatma Notu dalı): `task çalıştırma` / `review` değerinde bir tur `resume`'a gider ve ilerleme üretmez; `quick` ve tanınmayan değerlerde koşum **hiç tur açmaz** (ölçüt 13).

---

## Önemli Kurallar

- Handoff bilgisine güven — tekrar baştan başlama
- Eğer handoff bilgisi yetersizse, kullanıcıya sor
- Şüpheli durumlarda kullanıcıya ne kaldığını doğrula

---

## Beklenmedik Oturum Kesintisi

Oturum `/devflow:pause` ile değil, beklenmedik şekilde kesildiyse (crash, timeout, bağlantı kopması):

1. Yeni oturum aç
2. `/devflow:resume` çalıştır
3. Claude, DURUM.md'den durumu okur
4. Handoff bilgisi yoksa (pause yapılmamışsa), Claude durumu DURUM.md ve task dokümanından çıkarır
5. **`git status --porcelain` koşulur ve ağaçtaki kir bu dalda DEVRALINIR** — kesilen oturumun kendi yarım işidir. Kanonun *"oturum başında kirli olan dosyalar senin değildir"* kuralı (CLAUDE.md → Paralel Oturum Farkındalığı) **bu dalda uygulanmaz**: uygulanırsa devam eden oturum kendi öncülünün işini commit dışında bırakır ve o iş ilk temizlikte izsiz kaybolur. Aynı askı orkestratör tarafında da yazılı (`run-phase` Adım 6 · `lib/alt-ajan-brief.md` madde 6 — *"kir yabancıdır hâlini ölen turun kiri için kullanma"*). Kirin kesilen oturuma mı yoksa **paralel** bir oturuma mı ait olduğu ayırt edilemiyorsa dur ve kullanıcıya sor; sahiplik varsayılmaz.
6. Task dokümanında oturum kaydı varsa kaldığı yerden devam eder
7. Belirsizlik varsa kullanıcıya sorar
