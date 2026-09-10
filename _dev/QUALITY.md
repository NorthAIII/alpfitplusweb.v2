# QUALITY — Kalite Eksenleri

**Amaç:** Planlama, icra ve değerlendirme aşamalarında göz önünde bulundurulacak kalite kontrol noktaları
**Ne zaman okunmalı:** Kalite eksenlerine dokunan her aşamada — araştırma ve planlama, task icrası, UAT ve faz review

---

## Kalite Eksenleri

Aşağıdaki eksenler bu proje için izlenir. Veritabanı odaklı maddeler çıkarıldı (veritabanı yok); dönüşüm, ölçülebilirlik ve iddia uyumu eklendi.

### 1. Modülerlik

- Metin bileşende değil `src/content/`'te mi? Bileşen içeriği okuyor mu, taşıyor mu?
- Bir bölüm değişikliği diğer bölümleri etkiliyor mu?
- Tekrar eden kod var mı? Ortak mantık (`ui/`) paylaşılıyor mu?
- Tek kaynak sabitleri (`PRODUCT_STATUS`, `PRICING`, `CONTACT`) başka yerde yeniden yazılmış mı?

**Kontrol sorusu:** "Bu parçayı bağımsız olarak değiştirebilir miyim?"

### 2. Güvenlik

- Form girdileri sunucuda doğrulanıp sınırlanıyor mu (uzunluk, tip)?
- Bal küpü ve hız sınırı yeni uçlarda da var mı (`/api/chat` dâhil)?
- Sırlar (lead hedefi, e-posta, model anahtarı) yalnız env'de mi; istemci paketine sızmıyor mu?
- Hata mesajları hedef adresi, dosya yolunu veya anahtarı sızdırmıyor mu?
- Güvenlik başlıkları Vercel serving zinciri üzerinden de gidiyor mu — platform başlığı soyuyor, cache'ten baypas ettiriyor mu?
- Kişisel veri (telefon, e-posta) modele veya analitiğe gitmiyor mu?

**Kontrol sorusu:** "Kötü niyetli bir kullanıcı bunu nasıl istismar edebilir?"

### 3. Bakım Maliyeti

- Kod okunabilir mi? Tek kişilik ekipte altı ay sonra anlaşılır mı?
- Ölçülmüş bir karar (kontrast değeri, font seçimi) CSS/kod yorumunda rakamıyla açıklanmış mı?
- Konfigürasyon hardcode değil, env veya `src/content/` sabitinde mi?
- Görsel elle mi kondu, betikle mi üretildi? (Elle konan görsel bakım borcudur.)
- Bağımlılıklar güncel ve az mı?

**Kontrol sorusu:** "6 ay sonra bunu değiştirmem gerekse ne kadar zor olur?"

### 4. Performans

- Sayfa ağırlığı ve LCP başlangıç çizgisini aşmıyor mu (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar)?
- Görseller `next/image`, doğru boyut ve format (avif/webp) ile mi geliyor?
- CLS sıfıra yakın mı — boyutu bildirilmemiş görsel, geç yüklenen font var mı?
- Fontlar daraltılmış kümede mi; yeni karakter kümeyi genişletmeden eklendi mi?
- Üçüncü taraf betik (analitik, model) sayfa ağırlığını ne kadar artırdı?

**Kontrol sorusu:** "Bu, mobil ağda ilk ziyarette de hızlı mı?"

### 5. Hata Yönetimi

- Bir hedef (webhook, e-posta, model) düşünce kullanıcı ne görüyor — sessiz kayıp var mı?
- Hata durumunda WhatsApp/telefon yolu sunuluyor mu?
- Ağ hatası, zaman aşımı ele alınıyor mu?
- Beklenmeyen hatalar loglanıyor mu (yayın ortamında görünür mü)?
- `global-error.tsx` ve 404 markalı ve erişilebilir mi?

**Kontrol sorusu:** "Bu işlem başarısız olursa ne olur?"

### 6. Test Kapsamı

- Değişiklik beş ölçümden (a11y, mobil, font, perf, tarama) geçti mi?
- Yeni yetenek kendi güvencesini getirdi mi (yeni uç → istek testi; yeni metin → sızıntı denetimi)?
- Ölçüm sonucu rakamıyla task/faz dokümanına yazıldı mı?
- Testler CI'da da koşuyor mu, yalnız yerelde mi?

**Kontrol sorusu:** "Bu kodu değiştirdikten sonra bir şeyin bozulup bozulmadığını nasıl bilirim?"

### 7. Erişilebilirlik

- Semantik HTML; sayfada tek h1, başlık hiyerarşisi atlamıyor mu?
- Renk kontrastı WCAG AA (≥ 4.5 metin, ≥ 3 büyük metin) — yeni renk ölçüldü mü?
- Klavye navigasyonu; asistan ve mobil menüde odak tuzağı yok mu?
- Form elemanlarında label, hata mesajları alanla ilişkili mi?
- Tüm görsellerde alt metni; dekoratif olanlar boş alt mı?
- Dokunma hedefleri ≥ 44 px; `prefers-reduced-motion` saygı görüyor mu?

**Kontrol sorusu:** "Fareyi olmayan veya ekranı göremeyen biri bunu kullanabilir mi?"

### 8. Dönüşüm

- Her sayfa ve bölümden tek huniye (demo formu / WhatsApp) net bir yol var mı?
- CTA metni ne olacağını söylüyor mu ("Demo isteyin" gibi), jenerik mi?
- Form kısa mı; zorunlu alan gerçekten zorunlu mu?
- Hata anında bile talep yolu açık mı (WhatsApp yedeği)?
- Metin tonu hedef kitleye (salon sahibi) mi, komiteye mi hitap ediyor?

**Kontrol sorusu:** "Bu değişiklik bir salon sahibinin demo istemesini kolaylaştırıyor mu, zorlaştırıyor mu?"

### 9. Ölçülebilirlik

- Yeni dönüşüm yüzeyi (buton, bağlantı, form) olay sayımıyla mı geldi?
- Olay etiketi yüzeyi ayırt ediyor mu (hero / fiyat / footer / asistan)?
- Ölçüm KVKK ile uyumlu mu; yasal metin bunu anlatıyor mu?

**Kontrol sorusu:** "Bunun işe yarayıp yaramadığını iki hafta sonra nereden göreceğim?"

### 10. İddia Uyumu

- Yeni metin, meta açıklama, chat cevabı, ürün görseli `docs/CLAIMS.md` tablosuna uyuyor mu?
- Rakip adı, "canlı/sahada", ROI, müşteri sayısı, "sadece bizde" geçiyor mu?
- Pilot cümlesi ve fiyat tek kaynaktan mı geliyor?
- Fiyat kıyası yöntem + tarih taşıyor mu?

**Kontrol sorusu:** "Bu cümleyi satış dosyasıyla yan yana koysam çelişir mi?"

---

## Projeye Özgü Eksenler

Ekleme ve çıkarma yukarıda yapıldı: 8 Dönüşüm, 9 Ölçülebilirlik, 10 İddia Uyumu bu projeye özgüdür; veritabanı maddeleri çıkarıldı. Yerelleştirme ekseni yok (tek dil kararı — `docs/DECISIONS.md`).

> **Öncelik sıralaması burada değil → `ILKELER.md`:** Bu doküman eksenleri *tanımlar* (ne kontrol edilir). Hangi eksenin bu projede diğerlerinin önüne geçtiği (öncelik/sıralama) `ILKELER.md` → "En Yüksek Öncelikli Eksenler"de tutulur. Buraya öncelik ifadesi yazma — tekrar drift kaynağıdır.

---

## Kalite Kontrol Sonuçlarının Kaydı

Faz review'ı tamamlandığında, kalite kontrol sonuçları ilgili faz dokümanına (`phases/PHASE-X.md`) yazılır. QUALITY.md sadece eksenleri tanımlar, sonuçlar faz dokümanlarında tutulur. Ölçüm betikleri ve geçme şartları `CLAUDE.md`'de; başlangıç çizgisi `modules/M6-Kalite-Kapilari.md`'de.

---

## Kalite Eksenlerinin Kullanım Noktaları

| Aşama | Nasıl Kullanılır |
|-------|-----------------|
| **Kapsam Tartışması** | Kalite beklentileri ILKELER (öncelik eksenleri) üzerinden belirlenir — QUALITY eksenleri araştırmadan itibaren okunur/uygulanır (discuss-phase QUALITY.md okumaz) |
| **Araştırma** | Yaklaşımlar seçilirken kalite eksenlerinin etkisi değerlendirilir |
| **Task Yazımı** | Task'ın test kriterleri ve kabul koşulları kalite eksenlerini yansıtmalı |
| **Task Çalıştırma** | Kod yazarken ilgili eksenler göz önünde tutulur |
| **UAT** | Test senaryolarında kalite beklentileri doğrulanır |
| **Faz Review** | Her kalite ekseni sistematik olarak kontrol edilir |
