# STYLE-GUIDE — Tasarım Kuralları

**Amaç:** Görsel dil, tokenlar, tipografi tuzakları ve kullanıcının reflekslerinin tek evi. Yeni bölüm/sayfa tasarlayan ya da stil dokunan her oturum okur.
**Ne zaman okunmalı:** Her oturumda (projeye özgü sabit). UI'ya dokunmayan işte hızlı geçilir.
**Tokenların kaynağı:** `src/app/globals.css` → `@theme`. Buradaki değerler oradan **kopya değil özettir**; çelişkide CSS kazanır.

---

## Görsel Kimlik

- **Açık tema**, ferah, sage aksan. Karanlık tema yok.
- Fotoğraf: **gerçek salon görselleri**, seçici ve atmosferik (Pexels lisanslı; kaynaklar `research/FOTOGRAF-KAYNAKLARI.txt`; üretim `photos-build.mjs`).
- Ürün: **sahnelenmiş** ekran görüntüleri (`public/product/`, elle konmaz — `docs/CLAIMS.md`).
- Kiwi AI Lab imzası footer'da kendi bandında (`KiwiBand.tsx`), küçültülmez.

## Tokenlar (özet)

| Grup | Token | Değer / Not |
|---|---|---|
| Yüzey | `canvas` / `canvas-soft` / `surface` / `surface-2` | `#fbfbf9` / `#f4f5f1` / `#fff` / `#f7f8f4` |
| Mürekkep | `ink-deep` / `ink` / `muted` / `faint` | `#0e100c` / `#171a15` / `#545b4d` / `#68705e` — `faint` dört zeminde ≥ 4.71 kontrast, **koyulaştırma** |
| Çizgi | `line` / `line-2` | `#e5e7df` / `#d3d7ca` |
| Marka | `sage` / `sage-br` / `sage-deep` / `sage-ink` / `sage-wash` / `sage-wash-2` | `#74b36f` ana; metin için `sage-ink` `#2f5a2e` (açık zeminde `sage` metin olarak **kontrastı geçmez**) |
| Durum | `amber` / `amber-wash`, `neg` / `neg-wash` | `#8f5f10`, `#b34236` — kendi wash zeminlerinde ≥ 4.96 |
| Yarıçap | `radius-card` / `lg` / `xl` | 16 / 20 / 28 px |
| Gölge | `shadow-sm…xl`, `shadow-sage` | Mürekkep tabanlı, düşük opaklık |
| Hareket | `animate-marquee` (38 s), `animate-float` (7 s), `animate-pulse-ring` (2.6 s) | Reveal bileşeni giriş animasyonu için |

Yeni renk eklerken **kontrastı ölç** (`a11y.mjs`), rakamı CSS yorumuna yaz — mevcut token yorumları bu geleneği kurdu.

## Tipografi

- **Sora** başlık (700/800), **Inter** gövde (400/500/600). Self-host, siteye özel daraltılmış: 153 karakter, 5 dosya, 95 KB.
- **Sora'da ₺ (U+20BA) yok.** `--font-display` yığını `"Sora", "Inter", …` — Inter yedeği **kaldırılmaz**; fiyat rakamları böylece tek dilde kalır.
- Kümede olmayan bir karakter kullanırsan `font-guard.mjs` yakalar. Kümeyi genişletmek için `research/FONT-KARAKTER-KUMESI.txt` güncellenir ve `font-subset.mjs` yeniden koşturulur.
- `unicode-range` **kullanılmaz** — tek dosya zaten yalnızca gereken glifleri taşır.
- Başlıklar `letter-spacing: -0.022em`, `text-wrap: balance`; paragraflar `text-wrap: pretty`.

## Düzen Tuzakları (ölçülmüş, tekrar etmesin)

| Tuzak | Belirti | Kural |
|---|---|---|
| `position: sticky` bölümün üst katmanında `overflow-hidden` | Sticky sessizce ölür, hata yok | Sticky kullanan bölümün **hiçbir atasında** `overflow-hidden` olmaz; taşma kesimi bölümün kendi içinde çözülür |
| Izgara öğesinde `min-width: auto` varsayılanı | İçerik sütunu şişirir, sayfa yatay kayar (635 px / 390 px görüldü) | Grid/flex çocuğuna `min-w-0` ver; `mobile-audit.mjs` doğrular |
| Ekran üstü açıklama etiketi | Tam gösterdiği sayıyı örtüyordu | Ürün turunda **numaralı nokta** + kenarda açıklama; etiket görselin üstüne binmez |
| Hero'da telefon etiketi | Telefon mockup'ının üstüne biniyordu | Mockup ve etiket ayrı grid alanlarında |

## Kullanıcının Refleksleri

**Kullanma** ("AI ile yapılan her sitede var" — amatör ve şablon görünümü):
- Başlık üstünde **parıltı ikonlu kapsül rozet** (✨ + pill). Başlık kendi başına dursun ya da düz, ikonsuz üst etiket.
- Sparkles/Zap gibi "AI parıltısı" ikonlarını dekoratif kullanmak.
- **Jenerik ikonlu kart ızgarası** (3×N eşit kart, ikon + başlık + iki satır). Bölüm tasarlarken düzen çeşitlendir: sahne, liste, çizim, fotoğraf kırpma.
- Sahte logo şeridi, "Trusted by 10,000+", mor-mavi gradyan kartlar, gereksiz glassmorphism.
- Sayı sayma animasyonlu istatistik bandı — yalnız klişe değil, **rakam da yok** (`docs/CLAIMS.md`).

**İstiyor:**
- Gerçek fotoğraf, ürün sahneleme, hareket (Reveal, marquee, float), özel çizim (kaos bölümündeki WhatsApp/Excel/defter nesneleri gibi).
- Düzen çeşitliliği: her bölüm bir öncekinden farklı ritimde.

## Metin Tonu

Konuşma diline yakın, salon sahibine hitap; kurumsal jargon yok. Kullanıcı 2026-09-11'de "daha profesyonel" istedi — hangi cümlelerin fazla samimi geldiği henüz alınmadı; iş "Metin tonu" faz konusunda (`modules/M1-Icerik-ve-Iddia-Kaynagi.md` → F1.2). Ton `src/content/` altında değişir, bileşenlerde değil.

---

**Son Güncelleme:** 2026-09-11 — CLAUDE.md "Tasarım" bölümü, hafıza notu ve DURUM'daki ölçülmüş tuzaklar tek eve toplandı.
