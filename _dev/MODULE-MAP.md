# MODULE-MAP — Modül ve Feature Haritası

**Amaç:** Projenin modüler yapısını ve feature haritasını özetlemek
**Ne zaman okunmalı:** Planlama ve review sırasında
**Not:** Modül detayları `modules/` klasöründeki ayrı dosyalardadır. Bu doküman sadece genel harita ve matristir.

---

## Modül Haritası

```
Alpfit Plus Web Sitesi v2
├── M1: İçerik ve İddia Kaynağı
│   ├── F1.1: Tek kaynak içerik ve iddia sabitleri  → Phase —
│   ├── F1.2: Metin tonu profesyonelleştirme         → Phase —
│   └── F1.3: Chat bilgi ağacı                        → Phase —
├── M2: Sayfalar ve Bölümler
│   ├── F2.1: Ana sayfa                               → Phase —
│   ├── F2.2: Alt sayfalar                            → Phase —
│   └── F2.3: Ortak yerleşim ve UI ilkelleri          → Phase —
├── M3: Lead Hattı
│   ├── F3.1: Demo formu ve talep ucu                 → Phase —
│   ├── F3.2: Dayanıklı kayıt hedefi                  → Phase 1
│   └── F3.3: E-posta bildirimi                       → Phase 1
├── M4: Site Asistanı
│   ├── F4.1: Hazır akış asistanı                     → Phase —
│   ├── F4.2: Claude bağlantısı                       → Phase —
│   └── F4.3: İddia sınırı test seti                  → Phase —
├── M5: Görsel Varlık Hattı
│   ├── F5.1: Ürün ekran görüntüsü hattı              → Phase —
│   ├── F5.2: Fotoğraf hattı                          → Phase —
│   ├── F5.3: Font daraltma                           → Phase —
│   └── F5.4: Marka varlıkları                        → Phase —
├── M6: Kalite Kapıları
│   ├── F6.1: Beş ölçüm betiği                        → Phase —
│   ├── F6.2: Tek komut                               → Phase —
│   ├── F6.3: CI — GitHub Actions                     → Phase —
│   └── F6.4: İddia sızıntı denetimi (metin)          → Phase —
└── M7: Yayın ve Altyapı
    ├── F7.1: Docker çalışma ortamı                   → Phase —
    ├── F7.2: Güvenlik başlıkları, sitemap, robots    → Phase —
    ├── F7.3: Vercel'de ayrı proje ve önizleme yayını → Phase 1
    ├── F7.4: Analitik olay sayımı                    → Phase 1
    └── F7.5: Alan adı geçişi ve 301 haritası         → Phase —
```

---

## Modüller Arası Bağımlılıklar

```
M1 ──► M2 ◄── M5
M1 ──► M4
M7 ──► M3        (lead hedefi env'de tanımlanır)
M7 ──► M4        (model anahtarı ve maliyet tavanı env'de)
M6 ──► M7        (yayın öncesi kapılar yeşil)
M6 ═══ hepsini kapılar
```

- **M1 → M2, M4:** Bileşenler ve asistan metni `src/content/`'ten okur; ton değişimi bileşene dokunmaz.
- **M5 → M2:** Ürün görseli, fotoğraf ve fontlar betikle üretilir, M2 tüketir.
- **M6 kesişen kaygı:** Her modülün değişikliği beş ölçümden geçer; ileride tek komut + CI.
- **M7 en sonda:** Lead hedefi, analitik ve model anahtarı yayın ortamında tanımlanır; alan adı geçişi v2.0'ı kapatır.

---

## Modül Dokümanları

| Modül | Doküman | Açıklama |
|-------|---------|----------|
| M1 | `modules/M1-Icerik-ve-Iddia-Kaynagi.md` | `src/content/*` tek kaynak; metin tonu; chat ağacı |
| M2 | `modules/M2-Sayfalar-ve-Bolumler.md` | Rotalar, 22 bölüm, yerleşim ve UI ilkelleri |
| M3 | `modules/M3-Lead-Hatti.md` | Demo formu, `/api/demo`, dayanıklı kayıt, e-posta, WhatsApp yedeği |
| M4 | `modules/M4-Site-Asistani.md` | Hazır akış asistanı; Claude bağlantısı; iddia test seti |
| M5 | `modules/M5-Gorsel-Varlik-Hatti.md` | render-product, photos-build, font-subset, brand-assets |
| M6 | `modules/M6-Kalite-Kapilari.md` | Beş ölçüm betiği; tek komut; CI; sızıntı denetimi; başlangıç ölçümü |
| M7 | `modules/M7-Yayin-ve-Altyapi.md` | Docker, Vercel ayrı proje, env, başlıklar, analitik, 301 haritası |

---

## Feature-Faz Matrisi

| Feature | Modül | Versiyon | Faz | Durum |
|---------|-------|----------|-----|-------|
| F1.1: Tek kaynak içerik ve iddia sabitleri | M1 | v2.0 | — | ✅ |
| F1.2: Metin tonu profesyonelleştirme | M1 | v2.0 | — | ⬜ |
| F1.3: Chat bilgi ağacı | M1 | v2.0 | — | ✅ |
| F2.1: Ana sayfa | M2 | v2.0 | — | ✅ |
| F2.2: Alt sayfalar | M2 | v2.0 | — | ✅ |
| F2.3: Ortak yerleşim ve UI ilkelleri | M2 | v2.0 | — | ✅ |
| F3.1: Demo formu ve talep ucu | M3 | v2.0 | — | ✅ |
| F3.2: Dayanıklı kayıt hedefi | M3 | v2.0 | 1 | 🔄 |
| F3.3: E-posta bildirimi | M3 | v2.0 | 1 | 🔄 |
| F4.1: Hazır akış asistanı | M4 | v2.0 | — | ✅ |
| F4.2: Claude bağlantısı | M4 | v2.1 | — | ⬜ |
| F4.3: İddia sınırı test seti | M4 | v2.1 | — | ⬜ |
| F5.1: Ürün ekran görüntüsü hattı | M5 | v2.0 | — | ✅ |
| F5.2: Fotoğraf hattı | M5 | v2.0 | — | ✅ |
| F5.3: Font daraltma | M5 | v2.0 | — | ✅ |
| F5.4: Marka varlıkları | M5 | v2.0 | — | ✅ |
| F6.1: Beş ölçüm betiği | M6 | v2.0 | — | ✅ |
| F6.2: Tek komut | M6 | v2.0 | — | ⬜ |
| F6.3: CI — GitHub Actions | M6 | v2.0 | — | ⬜ |
| F6.4: İddia sızıntı denetimi (metin) | M6 | v2.0 | — | ⬜ |
| F7.1: Docker çalışma ortamı | M7 | v2.0 | — | ✅ |
| F7.2: Güvenlik başlıkları, sitemap, robots | M7 | v2.0 | — | ✅ |
| F7.3: Vercel'de ayrı proje ve önizleme yayını | M7 | v2.0 | 1 | 🔄 |
| F7.4: Analitik olay sayımı | M7 | v2.0 | 1 | 🔄 |
| F7.5: Alan adı geçişi ve 301 haritası | M7 | v2.0 | — | ⬜ |

**Durum simgeleri:**
- ⬜ **Bekliyor** — Fazı henüz başlamadı
- 🔄 **Devam ediyor** — Fazı aktif, task'lar çalışılıyor (discuss-phase'de faz başlatıldığında set edilir)
- 🟡 **Kısmen tamamlandı** — Bazı task'ları bitti ama tamamı değil (bazıları sonraki fazlara kaldı)
- ✅ **Tamamlandı** — Tüm kabul kriterleri karşılandı, UAT'tan geçti (review-phase'de set edilir)

> ✅ işaretli feature'lar **kickoff öncesi, DevFlow dışında** tamamlandı (2026-09-09 → 09-11); kanıt git log + başlangıç ölçümü (`modules/M6-Kalite-Kapilari.md` → Teknik Notlar). Faz sütunu yalnız girilmiş fazlar için dolu (Faz 1: F3.2, F3.3, F7.3, F7.4).
> Modül detayları (sorumluluk, feature kabul kriterleri, edge case'ler) → `modules/MX-ModulAdi.md`
> Versiyon sütunu PRD'den değil, kickoff versiyon planından (v2.0 = alan adı geçişiyle biter; v2.1 = asistan) aktarıldı — `docs/DECISIONS.md` 2026-09-11. Faz sütunu sadece planlanmış fazlar için doldurulur, henüz planlanmamış feature'lar "—" kalır.
