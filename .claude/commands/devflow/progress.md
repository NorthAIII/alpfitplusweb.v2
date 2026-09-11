# DevFlow — Proje Durumu (Progress)

Bu komut projenin genel durumunu görmek için kullanılır.

**Kullanım:** `/devflow:progress`

---

## Okunacak Dosyalar

### Oturum Başlangıç Protokolü (önce)
CLAUDE.md'deki Oturum Başlangıç Protokolü'nü uygula (çekirdek dokümanlar orada listelidir). Bu dosyalar aşağıda tekrarlanmaz.

### Komuta Özgü Ek Dosyalar

**Zorunlu (hepsini oku)**
1. `_dev/PHASES.md`
2. `_dev/MODULE-MAP.md`

> Not: Rapor alanlarının tamamı DURUM (protokol kapsamında okundu), PHASES ve MODULE-MAP'ten gelir; versiyon tanımlı değilse o satır "Versiyon tanımı yok" olur. **Kaynak dokümanın adı rapora yazılmaz** — kullanıcı o dosyaları okumaz (kanon: CLAUDE.md → Kullanıcının diliyle konuş). Faz milestone detayı gerekirse `_dev/phases/PHASE-N.md`'nin ilgili bölümünü **hedefli** oku — tüm faz kanvasını okuma.

---

## Yapılacaklar

**Adım 0 — Protokol & Okuma Onayı (her şeyden önce):** Yukarıdaki "Okunacak Dosyalar"ı oku, sonra tek satırlık okuma-onayını yaz (kural → CLAUDE.md: "Protokol ve `/devflow:` Komutları Arasındaki İlişki" → Okuma onayı). Onay yazılmadan raporu üretme; yazınca da durma — raporu hemen üret.

Kullanıcıya kısa ve net bir durum raporu sun:

```
📊 Proje Durumu

🔹 Aktif Versiyon: [vX.X]

🔹 Aktif Faz: Faz N — [ad]
   Milestone: [milestone açıklaması]
   Adım: [discuss / research / plan / verify-plan / task / verify / review]

🔹 Task İlerlemesi: X/Y tamamlandı
   ✅ Tamamlanan: [liste]
   🔄 Aktif: [aktif task]
   ⬜ Bekleyen: [liste]

🔹 Feature İlerlemesi: X/Y tamamlandı
   ✅ Tamamlanan: [liste]
   🟡 Kısmen: [liste]
   🔄 Devam eden: [liste]
   ⬜ Bekleyen: [liste]

🔹 Faz Özeti:
   Faz 1: ✅ Tamamlandı
   Faz 2: 🔄 Devam ediyor
   Sıradaki (henüz numara almamış): [konu], [konu]

📋 Sıradaki adım: /devflow:[ilgili komut]
   → [gerekçe — tek satır]
<⚠️|💡|✅> Açık kalemler: [önek: kalem] | yok
```

**Son iki satır oturum kapanış bloğudur** (kanon: CLAUDE.md → Oturum Kapanışı) — rapor onların üstündeki gövdedir.

- **Sıradaki komutu DURUM belirler; kaynak kanonun *"Faz döngüsünün sıradaki komutu"* maddesidir** (CLAUDE.md → Oturum Kapanışı; aynı kalıp: `quick` Adım 6). Eşleme tablosu tek başına yanıltır — dört özel durum orada yazılıdır. Türetme komut vermiyorsa (`Adım` **alanı yok** · tanınmayan değer · tablolarla çelişki · versiyon-geçişi sınırı, yani `Adım` boş **ve** Versiyon Sonu Durumu `prd_review_bekliyor` **değil**) **komut uydurma**: `📋 Sıradaki adım: yok — [bekleme koşulu]` yaz ve gördüğün hâli tek cümleyle söyle.
- **Devralınacak yarım/hazırlanmış quick varsa sıradaki adım odur** (`/devflow:quick QUICK-NNN`) — kanonun döngü-dışı varsayılanı yalnız böyle bir iş yokken faz döngüsünü gösterir. **Taramayı kanon emrediyor** (aynı madde) ve bu komutta atlanamaz: protokol o klasörü okutmaz, raporun kaynakları da (DURUM · PHASES · MODULE-MAP) kaydı hiç anmaz — yani taramayı atlarsan kural girdisiz kalır ve hazırlanmış iş bu oturumda görünmez.
- **`Açık kalemler` satırı bu komutta çoğu zaman `✅ … yok`tur** — progress salt-okunur bir rapordur, kendi işi yoktur. Satıra yalnız oturumda gerçekten dile getirilmiş bir iş girer; rapor sırasında görülen sapma satırın değil, `_dev/BULGULAR.md` → Gelen Kutusu'nun işidir (Çalışma Prensipleri #12).

---

## Önemli Kurallar

- Kısa ve öz tut — detay için ilgili dokümanları oku
- Sıradaki adımı mutlaka öner — belirleyemiyorsan uydurma, `yok — [bekleme koşulu]` yaz
