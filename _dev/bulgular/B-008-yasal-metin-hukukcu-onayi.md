# B-008: Yasal metinler hukukçu onayı bekliyor

**Önem:** 🟡 | **Tip:** dış-aktör | **Alan:** M1 — İçerik (`src/content/legal.ts`)
**Kaynak:** kickoff (DURUM.md açık işler) | **Tarih:** 2026-09-11
**Durum:** Açık — **hiçbir fazı kilitlemez** (ILKELER → dış aktör kuralı)

## Gözlem

Beklenen: Gizlilik, KVKK ve kullanım koşulları metinleri hukukçu tarafından onaylanmış olmalı (yayına çıkmadan önce tercihen; alan adı geçişi milestone'una bağlanmadı).

Gözlenen: Metinler sitenin gerçek veri akışına göre (demo formu alanları, webhook/e-posta yolu, analitik yok) yazıldı; **"örnek metindir" ibaresi yok** — v1 denetiminin D-03 bulgusu bilinçle tekrarlanmadı. Onay henüz alınmadı.

## Kanıt

- `src/content/legal.ts` — üç metin
- v1 D-03: yasal sayfalar "örnek metindir" ibaresiyle yayındaydı

## Kök Neden Yönü

Dış aktör (hukukçu) bağımlılığı; proje içinde yapılacak iş yok.

## Koruma Önerisi

Lead hedefi (M3 F3.2) ve analitik (M7 F7.4) kararları verildiğinde `legal.ts` veri akışı bölümü **aynı task'ta** güncellenir; onay istenirken son hâli gönderilir.

## Çözüm Kaydı

—
