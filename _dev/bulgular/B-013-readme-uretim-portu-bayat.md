# B-013: README ve compose yorumu üretim imajını 3001'de gösteriyor, gerçek port 3100

**Önem:** 🟢 | **Tip:** tutarsızlık / doküman-gerçeklik | **Alan:** M7 — Yayın ve altyapı (çalışma ortamı)
**Kaynak:** audit-product | **Tarih:** 2026-09-11
**Durum:** Açık

## Gözlem

**Beklenen:** Repo kökündeki `README.md` yığının ve çalıştırma komutlarının tek evi (`INDEX.md` onu TECH-STACK yerine işaret ediyor). `CLAUDE.md` → Çalışma ortamı ve `MEMORY.md` → Ortam & Araç Notları ikisi de nettir: **port 3001 kullanılmaz, makinede başka bir proje tutuyor**; üretim imajı 3100'dedir.

**Gözlenen:** İki dosya hâlâ 3001 diyor. `docker-compose.yml` içindeki gerçek eşleme `3100:3000` olduğu için komut doğru çalışır ama yazılan adres yanlıştır.

Sonuç zararsız bir yazım hatası değil: 3001'e giden biri boş sayfa değil, **makinedeki başka bir projenin sitesini** görebilir ve onu bu projenin üretim imajı sanabilir. Yanlış adres, sessiz yanlış gözleme dönüşür.

README komutu ayrıca `--build` taşımıyor; `CLAUDE.md` aynı komutu `docker compose --profile prod up -d --build web-prod` olarak veriyor. Bayrak olmadan imaj yeniden derlenmez, yani README'yi izleyen kişi eski imajı ölçer.

## Kanıt

```
$ grep -n "3001" README.md docker-compose.yml
README.md:26:docker compose --profile prod up -d web-prod   # http://localhost:3001
docker-compose.yml:23:  # Uretim imajinin yerelde dogrulanmasi — http://localhost:3001

$ grep -n "3100" docker-compose.yml
      - "3100:3000"      # gerçek eşleme
```

Karşı kayıtlar: `CLAUDE.md` → "Port 3001 kullanılmaz — makinede başka bir proje tutuyor. Üretim 3100'de." · `_dev/memory/alternatif-env-ile-uretim-derlemesi.md` aynı kuralı taşır.

## Kök Neden Yönü

Port bir noktada 3001'den 3100'e taşınmış; `docker-compose.yml`'de değer güncellenmiş ama **yanındaki yorum** ve README güncellenmemiş. Klasik yorum-kod ayrışması.

## Koruma Önerisi

Değer ile yorumu ayrı tutmak yerine README, compose dosyasını tek kaynak sayabilir (yorum satırından portu tekrar etmemek). Daha ucuz ve yeterli olanı: M6 F6.2 tek komut kurulurken üretim konteynerine erişimi adresiyle birlikte kontrol eden bir satır eklenir — port değişirse kapı görür.

## Çözüm Kaydı

—
