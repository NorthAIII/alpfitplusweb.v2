/**
 * v2 UZANTISI — v1'in temizlik tablosu (screen-cleanup.mjs) BIREBIR korunur, uzerine
 * yalnizca v2'de YENI acilan ekranlarin (grup, sube) ihtiyaci eklenir.
 *
 * Neden ayri dosya: v1'in tablosu olculmus bir ust kumedir ve dosya basligi onun
 * gerekcesini tasiyor. Govdesini duzenlemek o provenansi bulandirirdi. Burada
 * eklenen her satirin gerekcesi kendi yaninda durur.
 */
import {
  REPLACEMENTS as V1_REPLACEMENTS,
  INITIALS as V1_INITIALS,
  AVATAR_SELECTOR,
  DROP_NODES as V1_DROP_NODES,
  AUDIT_ALLOW as V1_AUDIT_ALLOW,
  BRAND_LEAK,
} from './screen-cleanup.mjs';

/** grup.html ve sube.html'de gecen, v1 tablosunda olmayan gercek sporcu adlari. */
const V2_REPLACEMENTS = [
  // grup.html
  ['Ferdi Kadıoğlu', 'Deniz A.'],
  ['Şehmus Hazer', 'Tolga B.'],
  ['Ferdi K.', 'Deniz A.'],
  ['Şehmus H.', 'Tolga B.'],
  // sube.html — antrenor kadrosu tam adla yaziliydi
  ['Melissa Vargas', 'Ege K.'],
  ['Hande Baladın', 'Nihan T.'],
  ['Cansu Özbay', 'Tuğçe A.'],
  ['İlkin Aydın', 'Berk S.'],
  ['Gizem Örge', 'Yasemin U.'],
  ['Simge Aköz', 'Cüneyt V.'],
];

export const REPLACEMENTS = [...V1_REPLACEMENTS, ...V2_REPLACEMENTS];
export const INITIALS = [
  ...V1_INITIALS,
  ['FK', 'DA'], ['ŞH', 'TB'],
  ['MV', 'EK'], ['HB', 'NT'], ['CÖ', 'TA'], ['İA', 'BS'], ['GÖ', 'YU'], ['SA', 'CV'],
];
export { AVATAR_SELECTOR, BRAND_LEAK };
export const DROP_NODES = { ...V1_DROP_NODES };

/**
 * Ortak kabuk etiketleri — her ekranda ayni sol menu ve ust bar var.
 * v1 bunlari her ekran icin tek tek yaziyordu; tekrari tek yere aliyoruz.
 */
const SHELL = ['Alpfit Plus', 'Genel Bakış', 'Grup Dersleri', 'Sahil Müdürü', 'Ana Sayfa', 'Tüm Şubeler'];

export const AUDIT_ALLOW = {
  ...V1_AUDIT_ALLOW,
  /**
   * grup.html — kapi ONCE bos listeyle kosuldu, raporladigi 12 tamlamanin her biri
   * kaynakta arandi. Iki tanesi gercek sporcu adiydi ve REPLACEMENTS'a tasindi;
   * kalan onu etiket, baslik veya buton adidir, kisi adi tasiyan yok.
   */
  grup: [
    ...SHELL,
    'Ders Tanımla',        // topbar butonu
    'Reformer Pilates',    // ders adi
    'Yoklamayı Kaydet',    // buton
    'Doluluk Raporu',      // kart basligi
    'Bekleme Listesine',   // "Bekleme Listesine Al" butonu
  ],
  /**
   * sube.html — ayni yontem. Kapinin raporladigi 16 tamlamadan ALTISI gercek
   * sporcu adiydi ve REPLACEMENTS'a tasindi; kalanlar kart basligi ve etikettir.
   */
  sube: [
    ...SHELL,
    'Şube Detayı',      // sayfa basligi
    'Şube Raporu',      // topbar butonu
    'Aylık Ciro',       // KPI etiketi
    'Aktif Üye',        // KPI etiketi
    'Gelir Kırılımı',   // kart basligi
    'Hedefe İlerleme',  // kart basligi
  ],
};

/**
 * v1'in `auditTexts`'i kendi modul kapsamindaki AUDIT_ALLOW'u kapatir, yani
 * buradaki genisletilmis listeyi GOREMEZ. Karar fonksiyonu bu yuzden burada
 * yeniden yazildi; iki dal (ad kalibi + marka sizintisi) ve saflik korunuyor.
 */
export function auditTexts(values, screenId) {
  const full = /[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,}/g;
  const allowed = new Set(AUDIT_ALLOW[screenId] ?? []);
  const names = new Set();
  const brands = new Set();
  for (const value of values) {
    for (const m of value.matchAll(full)) {
      const label = m[0].replace(/\s+/g, ' ');
      if (!allowed.has(label)) names.add(label);
    }
    if (BRAND_LEAK.test(value)) brands.add(value.trim().slice(0, 80));
  }
  return { names: [...names], brands: [...brands] };
}
