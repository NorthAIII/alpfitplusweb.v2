# TASK-3.16: Mobilde ilk ekranda demoya çıkan bir yol

**Durum:** ⬜ Bekliyor
**Modül:** M2 — Sayfalar ve Bölümler (modules/M2-Sayfalar-ve-Bolumler.md)
**Feature:** F2.3 Ortak yerleşim ve UI ilkelleri
**Faz:** Phase 3 (phases/PHASE-3.md)
**Bağımlılıklar:** TASK-3.07 ✅ · TASK-3.08 ✅

---

## Hedef

Telefonda sayfa açıldığı anda görünen ekranda hiçbir demo/WhatsApp yüzeyi olmayan sayfaları kapatmak. **390 px'te 6 sayfa** boş (`/fiyat` · `/segmentler` · `/demo` · üç yasal sayfa); **320 px'te 16 sayfanın 13'ü** boş. Kullanıcının seçtiği iki hafif hamle uygulanır: hamburger'in yanına sade bir **"Demo" bağlantısı** ve yüzen düğmenin **görünme eşiğinin düşürülmesi**.

> B-022'nin ikincil önerisi — WhatsApp bağlantısının kullanıcının yazdıklarını taşıması — kapsamda ama **bu task'ta değil**: ayrı bir alanın (lead hattı, M3) işi, ayrı dosyaya dokunuyor ve kişisel veriyi bağlantıya koyduğu için kendi çağrı-sitesi süpürmesini gerektiriyor. Kendi task'ında: **TASK-3.25** (verify-plan bölmesi, 2026-09-23).

---

## Bağlam

B-022. İki mekanizma üst üste biniyor: Header'ın "Demo İste" + WhatsApp bloğu `hidden … lg:flex` (1024 px altında hiç render edilmiyor) ve yüzen düğme `scrollY > 480` olana kadar `opacity-0 pointer-events-none`. Sonuç: mobilde her zaman görünen tek dönüşüm affordance'ı hamburger düğmesi. Fiyatı görmeye gelen kulüp sahibi 7.678 px'lik sayfanın tepesinde tıklayacak bir şey bulamıyor.

Kullanıcı kararı (PHASE-3): *"Alt yapışkan çağrı çubuğu dönüşüme daha güçlü etki ederdi ama ekranın bir bölümünü sürekli kaplıyor ve sayfanın havasını değiştiriyor."* — **yapışkan alt çubuk istenmedi.** Seçilen iki değişiklik STYLE-GUIDE'ın reddettiği kalıpların hiçbirine girmiyor ve görünümü neredeyse değiştirmiyor.

**Huninin geri kalanı sağlam** ve bu kaydedilmiştir: 16 sayfanın hepsinde huniye çıkış var, 15 benzersiz iç bağlantının hepsi 200 dönüyor. Sorun yolun varlığı değil, mobilde **ilk anda görünürlüğü**.

---

## Referans Dokümanlar

**Okunması Gereken:**
- `_dev/bulgular/B-022-mobilde-ilk-ekranda-donusum-yuzeyi-yok.md` — ölçüm tablosu ve mekanizmalar
- `_dev/ILKELER.md` — En Yüksek Öncelikli Eksenler (dönüşüm birinci)
- `_dev/docs/STYLE-GUIDE.md` — kullanıcının reddettiği kalıplar

**Güncellenmesi Gereken (Task Sonunda):**
- `_dev/DURUM.md` · `_dev/phases/PHASE-3.md` — durum ve özet
- `_dev/modules/M2-Sayfalar-ve-Bolumler.md` — F2.3'e mobil ilk ekran kriteri

---

## Alt Görevler

- [ ] **1. Menünün yanına "Demo" bağlantısı**
  - Çapa: `src/components/layout/Header.tsx` — `hidden … lg:flex` bloğu (⚠️ `grep -n "lg:flex"` ile konumlan)
  - Mobilde hamburger'in yanında sade, metin tabanlı bir "Demo" bağlantısı; dokunma hedefi ≥ 44 px (TASK-3.08'in kritik kümesine giriyor)

- [ ] **2. Yüzen düğmenin eşiğini düşür**
  - Çapa: `src/components/layout/Assistant.tsx` — `scrollY > 480` (⚠️ `grep -n "scrollY"` ile konumlan)
  - Eşik ~120 px'e indirilir ya da mobilde eşiksiz gösterilir; karar ölçütü sayfanın tepesindeki görsel gürültü

- [ ] **3. Ölç**
  - 390 ve 320 px'te 16 sayfada ilk ekrandaki dönüşüm yüzeyi sayısı; hedef: hepsinde ≥ 1

---

## Etkilenen Dosyalar

```
src/components/layout/Header.tsx      # mobilde "Demo" bağlantısı
src/components/layout/Assistant.tsx   # yüzen düğmenin görünme eşiği
```

---

## Dikkat Noktaları

- **Yapışkan alt çubuk yapma.** Kullanıcı bilinçle reddetti.
- **Görünümü neredeyse değiştirmemek kararın parçası.** "Demo" bağlantısı rozet, parıltı ya da dolgu almaz — STYLE-GUIDE'ın reddettiği kalıplar.
- **Ölçüm ölçütü:** 390×844 bağlamında her sayfada `a[href='/demo'], a[href^='https://wa.me']` düğümlerinden `getBoundingClientRect().top < innerHeight` olanlar sayılır (B-022'nin yöntemi) — aynı yöntemle öncesi/sonrası ölçülür.
- **Bu kontrol kapıya GİRMİYOR.** Kapsam kararı fazın kapı işini kontrast + kırpma + dokunma hedefiyle sınırladı; ilk ekran kontrolü bu fazda **tek seferlik ölçümdür**. Kalıcı kapı isteniyorsa ayrı karardır (→ faz kapanışında kullanıcıya getirilir).
- **Gerçek telefonda doğrulama** faz sonundaki tura kalır — `kanal: UAT`.

---

## Test Kriterleri

- [ ] 390 px'te 16 sayfanın hepsinde ilk ekranda en az bir dönüşüm yüzeyi var (öncesi: 10/16)
- [ ] 320 px'te 16 sayfanın hepsinde en az bir dönüşüm yüzeyi var (öncesi: 3/16)
- [ ] "Demo" bağlantısının dokunma hedefi ≥ 44 px (`mobile-audit.mjs` kritik kümesinde temiz)
- [ ] Yüzen düğme sayfanın tepesinde görsel gürültü yaratmıyor (ekran görüntüsü, 390 px)
- [ ] Gerçek telefonda ilk ekran görünümü — `kanal: UAT`
- [ ] Beş ölçüm regresyon çizgisini koruyor

---

## Tamamlanma Kriterleri

- [ ] Tüm alt görevler tamamlandı
- [ ] Tüm test kriterleri karşılandı
- [ ] Git commit & push yapıldı (conventional commits formatı)
- [ ] Bu doküman güncellendi (oturum kaydı)
- [ ] DURUM.md güncellendi

---

## Oturum Kayıtları

---

**Oluşturulma:** 2026-09-23
