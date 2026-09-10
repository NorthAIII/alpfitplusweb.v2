# Alpfit Plus Web Sitesi v2 — Claude Code Talimatları

**Proje:** `alpfitplus.com` için sıfırdan yazılan yeni tanıtım sitesi
**Repo:** `/home/kivanc/projects/Alpfitplus website.v2` → github.com/NorthAIII/alpfitplusweb.v2 (özel)
**Durum:** `_dev/DURUM.md` ← **her oturumun başında bunu oku**

---

## Dil

Kullanıcıyla **Türkçe** konuş. Dokümanlar da Türkçe.

---

## 🔴 Dokunulmayacaklar

| Yol | Neden |
|-----|-------|
| `../Alpfitplus-website.v1` | **Canlı site.** Yalnızca okunur, asla değiştirilmez. |
| `../Alpfit.v1` | Ürünün kod tabanı. Yalnızca okunur (demo ekranları buradan render ediliyor). |
| `../alpfit-plus-satis` | Satış ve rekabet dosyaları. Yalnızca okunur, iddia sınırlarının kaynağı. |

Vercel'de v1'in projesi (`alpfitplus-website`) canlıdır. v2 **ayrı** bir proje olacak.

---

## 🔴 İddia sınırı — pazarlık konusu değil

Kaynak: `../alpfit-plus-satis/rekabet/ozet.md` + `fiyat/model.md`.

| Söylenebilir | Söylenemez |
|---|---|
| Diyetisyen modülü — 18 rakip üründe görülmedi | "Antrenör uygulaması sadece bizde" — FitSchedule ve Sportix'te de var |
| Ürün **pilot aşamada**, bir stüdyoda test ediliyor | "Sahada kullanılıyor", "canlı" |
| Şube başı tek fiyat, mobil uygulama dâhil | Herhangi bir ROI, müşteri sayısı veya yüzde iyileşme rakamı |
| Türkçe arayüz ve KVKK **var** | Türkçe ve KVKK'yı **fark** diye sunmak — yerli rakiplerin hepsinde var |

**Rakip adı sitede geçmez.** Türkiye'de karşılaştırmalı reklam mevzuatı sıkı;
ayrıca rekabet dosyasının kendi kuralı "rakip iddialarını kendi davranışımıza
çevir". Fiyat karşılaştırmaları yöntem + tarih ile, adsız yayınlanır.

Pilot iddiası **tek kaynaktan** gelir: `src/content/site.ts` → `PRODUCT_STATUS`.
Fiyat **tek kaynaktan** gelir: `src/content/pricing.ts`.

---

## Çalışma ortamı

Her şey Docker içinde koşar.

```bash
docker compose up -d web                 # geliştirme → localhost:3000
docker compose exec web npm run build    # üretim derlemesi
docker compose --profile prod up -d --build web-prod   # üretim → localhost:3100
```

> **Yeni bir rota klasörü eklediğinde `docker compose restart web` gerekir.**
> Bind-mount üzerinde Turbopack yeni dizinleri sıcak yakalamıyor. Bu tekrar
> tekrar unutuldu; 404 görüyorsan önce bunu dene.

**Port 3001 kullanılmaz**, makinede başka bir proje tutuyor. Üretim 3100'de.

---

## Ölçüm betikleri — iş bitmeden koştur

Hepsi araştırma konteynerinde:

```bash
docker compose --profile research run --rm research node scripts/<betik>
```

| Betik | Ne ölçer | Geçme şartı |
|---|---|---|
| `a11y.mjs` | Kontrast, h1, alt metni, adsız link/buton | TOPLAM SORUN: 0 |
| `mobile-audit.mjs` | Yatay kaydırma, dokunma hedefi | yatay kaydırma: yok |
| `font-guard.mjs` | Font kapsaması (üretim konteynerine karşı) | kümede olmayan karakter yok |
| `perf.mjs` | TTFB, FCP, LCP, CLS, sayfa ağırlığı | üretim konteyneri ayakta olmalı |
| `scan.mjs <yol> <etiket> <en> <boy>` | Sayfayı ekran ekran gezer, konsol hatası toplar | konsol temiz |
| `render-product.mjs` | Ürün ekran görüntülerini üretir | denetim: sızıntı yok |

**Ürün görselleri elle konmaz.** `render-product.mjs` üretir; eski marka,
gerçek sporcu adları ve karşılanmayan iddiaları temizler, marka izi taşıyan
görselleri siler. Bir sızıntı kalırsa **üretim durur**. Kaynak `../Alpfit.v1/demo`
salt-okunur bağlanır.

**Fotoğraflar** Pexels lisanslı. Kaynaklar `research/FOTOGRAF-KAYNAKLARI.txt`.

**Fontlar** siteye özel daraltıldı (153 karakter, 5 dosya, 95 KB). Yeni bir
karakter kullanırsan `font-guard.mjs` yakalar; kümeyi genişletmek için
`font-subset.mjs` yeniden koşturulur.

---

## Tasarım

- Açık tema, sage `#74B36F` aksan, Sora (başlık) + Inter (gövde)
- Tokenlar `src/app/globals.css` → `@theme`
- **Sora'da ₺ yok**, ölçüldü. `--font-display` yığınında Inter yedek duruyor, kaldırma.
- `position: sticky` kullanan bölümde bir üst katmanda `overflow-hidden` **olmamalı**, sessizce öldürür.
- Izgara öğesine `min-w-0` vermezsen içerik sütunu şişirir ve sayfa yatay kayar.

### Kullanıcının tasarım refleksleri
- Başlık üstü **parıltı ikonlu kapsül rozetten nefret ediyor** ("AI ile yapılan her sitede var"). Kullanma.
- Jenerik ikonlu kart ızgarası "amatör" buluyor. Bölüm tasarlarken düzen çeşitlendir.
- Gerçek fotoğraf, ürün sahneleme ve hareket istiyor.

---

## Git

Tek dal: `main`. Çalışma dalı yok, doğrudan `main`'e commit ve push.
Commit mesajları Türkçe, ne yapıldığını ve **neden** yapıldığını yazar;
ölçüm varsa rakamı da yazar.

---

## DevFlow

`.claude/commands/devflow/` kurulu ama **kickoff çalıştırılmadı**.
`_dev/` ağacı henüz tam değil — yalnızca `DURUM.md` var ve elle yazıldı.
Tam yapıyı kurmak için yeni bir oturumda `/devflow:kickoff` çalıştır.
