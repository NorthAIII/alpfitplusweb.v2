# TASK-[X.YY]: [Task Adı]

**Durum:** [kanonik kodlardan biri → `tasks/TASKS-README.md` → Durum Kodları]

<!-- KURAL: Durum alanı tek değer taşır ve değer kümesinin TEK KAYNAĞI TASKS-README → Durum Kodları'dır (⬜ Bekliyor · 🔄 Devam ediyor · ⏸️ Duraklatıldı · ✅ Tamamlandı · 🔴 Bloke · ❌ İptal). Buraya kısaltılmış bir menü kopyalama: kopya bir kez eksik yazıldı (⏸️/🔴/❌ düşmüştü) ve iki ev sessizce ayrıştı. -->
**Modül:** [Modül adı] (modules/MX-Ad.md referansı)
**Feature:** [Feature adı]
**Faz:** Phase [X] (phases/PHASE-X.md)
**Bağımlılıklar:** TASK-[X.YY] ✅ / Yok

---

## Hedef

[2-3 cümle: Bu task neyi başarmaya çalışıyor? Teknik olarak ne yapılacak? Ne zaman tamamlanmış sayılır?]

---

## Bağlam

<!-- OPSİYONEL: Bu bölüm sadece task'ın "neden"i açık değilse doldurulur. Basit task'lerde Hedef yeterliyse bu bölümü sil. Karmaşık kararların sonucu olan, mimari değişiklik içeren veya geçmişi bilmeden anlaşılamayacak task'lerde doldur. -->

[Neden bu task gerekli? Kapsam tartışmasından veya araştırmadan gelen ilgili kararlar ve dikkat noktaları.]

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/modules/MX-[AD].md` — [Neden okunmalı]
- `_dev/docs/[DOKUMAN].md` — [Neden okunmalı]

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` — Task durumu ve özet
- `_dev/phases/PHASE-X.md` — Task Listesi tablosunda durumu güncelle
- `_dev/docs/[DOKUMAN].md` — [Ne güncellenecek, varsa]
- `_dev/docs/DECISIONS.md` — [Önemli karar alındıysa]

---

## Alt Görevler

- [ ] **1. [Alt Görev Adı]**
  - [Yapılacak işlem detayı]
  - [Dosya: `path/to/file.ts`]

- [ ] **2. [Alt Görev Adı]**
  - [Yapılacak işlem detayı]
  - [Dosya: `path/to/file.ts`]

- [ ] **3. [Alt Görev Adı]**
  - [Yapılacak işlem detayı]

---

## Etkilenen Dosyalar

<!-- KURAL: Bu fazda OLUŞTURULAN her dosya "YENİ" ile işaretlenir; işaretsiz referans ZATEN-VAR olması beklenen kabul edilir. Bu ayrım, verify-plan'ın referans gerçeklik-kontrolünün temelidir. -->

```
[klasör]/
├── [dosya1.ts]      # [Ne değişecek — zaten var]
├── [dosya2.ts]      # YENİ
└── [dosya3.test.ts] # YENİ
```

---

## Dikkat Noktaları

- [Araştırma bulgularından gelen dikkat noktası]
- [Kapsam tartışmasından gelen tercih veya kısıtlama]
- [Edge case]
- [Bilinen tuzak]

---

## Test Kriterleri

<!-- KURAL: Kriter task'ın KENDİ OTURUMUNDA gözlenebilir olmalı — sonucu ancak push'tan sonra doğan kriter ("CI yeşil olmalı") yazılmaz, yerelde koşulabilir hâli yazılır (`<komut>` geçiyor). Yoksa task oturumu push'layıp CI'ı beklemek zorunda kalır. Yerelde eşi hiç yoksa kriteri gözlenebilir bir ara-çıktıya bağla (ör. "workflow dosyası şema doğrulamasından geçiyor"); kanal teyidi yine verify-phase → Otomatik Kontroller'e kalır. AMA DEVREDİLEN KANALI DOĞRU ADRESLE: kriterin sonucunu belirleyen katman yerel koşucunun ölçtüğü katmanın DIŞINDAYSA (gerçek tarayıcı yerleşimi/odağı/girdisi, canlı serving zinciri, gerçek cihaz/saat/ağ) kanal Otomatik Kontroller DEĞİLDİR — CI aynı katmanı koşar, aynı körlükle yeşil döner. O hâlde kriterin yanına `kanal: UAT` yaz; verify-phase Adım 4 kolu oradan seçer. -->

- [ ] [Test 1 — somut, doğrulanabilir]
- [ ] [Test 2 — edge case veya hata durumu]
- [ ] [Test 3 — entegrasyon kontrolü]

---

## Karar Noktaları

<!-- OPSİYONEL: Bu bölüm sadece task'ta birden fazla geçerli yaklaşım varsa veya kullanıcıya sorulması gereken bir karar varsa doldurulur. Karar noktası yoksa bu bölümü sil. -->

- **[Karar konusu]:** [Seçenek A] vs [Seçenek B] → [Önerilen / Kullanıcıya sorulacak]

---

## Risk ve Geri Dönüş Planı

<!-- OPSİYONEL: Bu bölüm sadece mevcut çalışan kodu değiştiren, migration içeren, veri kaybı riski olan veya geri dönüşü zor olan task'larda doldurulur. Düşük riskli task'larda bu bölümü sil. -->

- **[Risk]:** [Ne olabilir] → [Ne yapılır]
- **Rollback:** [Geri dönüş adımları]

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

### Oturum — [TARİH]

**Durum:** ✅ Tamamlandı / 🔄 Devam edecek / ⏸️ Duraklatıldı

**Yapılanlar:**
- [Tamamlanan alt görevler ve detaylar]

**Sorunlar:**
- [Sorun]: [Nasıl çözüldü]

**Kararlar:**
- [Karar]: [Gerekçe]
- docs/DECISIONS.md'ye eklendi: [Evet/Hayır]

**Kalan İşler:** (varsa)
- [kalan 1]

**Son Yaklaşım:** (pause/devam durumunda kritik)
[Son düşünülen yaklaşım, nerede kaldığının detayı]

**Sonraki Adım Detayı:** (pause/devam durumunda kritik)
[Devam edildiğinde tam olarak ne yapılacak, hangi dosyadan devam]

**Dosya Değişiklikleri:**
- `dosya.ts` → [Ne değişti]

**Test Sonuçları:**
<!-- KURAL: Ölçüm kimliğiyle yazılır — ne çalıştırıldı ve hangi kapsamda ("yalnız auth uçları", "serve tarafı hariç"). Ölçülmeyen ekseni kapsıyormuş gibi okunan çıplak iddia yazma: "X temiz" değil "X, Y kapsamında temiz". -->
- [Hangi testler çalıştı, sonuçlar]

---

<!-- Task tamamlanınca doldurulacak: -->

## Sonuç Özeti

**Tamamlanma Tarihi:** [Tarih]

**Ne Yapıldı:**
- [Kısa özet]

**Öğrenilenler:**
- [Varsa notlar]

---

**Oluşturulma:** [Tarih]
