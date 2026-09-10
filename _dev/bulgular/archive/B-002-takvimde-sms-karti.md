# B-002: Takvim ekranında "SMS + push gider" kartı — ürünün SMS ucu yok

**Önem:** 🟡 | **Tip:** iddia sızıntısı | **Alan:** M5 — Ürün ekran görüntüsü hattı
**Kaynak:** kickoff öncesi geliştirme oturumu | **Tarih:** 2026-09-10
**Durum:** ✅ Çözüldü

## Gözlem

Beklenen: Görsellerde ürünün bugün karşılamadığı iddia yok.

Gözlenen: Demo takvim ekranında "SMS + push gider" kartı vardı; ürünün SMS ucu yok.

## Kanıt

- Kaynak demo `takvim` ekranı, bildirim kartı

## Kök Neden Yönü

Demo ekranları ürünün hedef hâlini gösteriyor; bugünkü ürünle bire bir değil.

## Koruma Önerisi

Düğüm düşürme tablosu (`research/lib/`) — karşılanmayan iddia kartları DOM'dan kaldırılır; yeni demo sürümünde tablo yeniden gözden geçirilir.

## Çözüm Kaydı

Kart düşürme tablosuna eklendi, ekran yeniden üretildi (commit `bbcce04`). Kapanış kapsamı: bilinen kart; demo güncellenirse tablo yeniden kontrol edilir (M5 F5.1 edge case).
