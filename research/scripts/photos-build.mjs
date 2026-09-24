/**
 * Secilen fotograflari indir, kirp, webp'ye cevir.
 * Secim gozle yapildi (research/photos-out/adaylar/*.jpg kontakt sayfalari).
 * Olcut: ucuncu taraf marka/logo GORUNMEYECEK, yuz on planda olmayacak,
 * ton marka paletiyle (sage + komur) kavga etmeyecek.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = '/work/photos-out/final';
await mkdir(OUT, { recursive: true });

/** Kaynaklarin Pexels'ten alindigi gun (bkz. `Indirme tarihi` notu asagida). */
const KAYNAK_TARIHI = '2026-09-10';

// Her kaynak HANGI varyantlari uretir, artik ACIKCA yazili (TASK-3.20). Eskiden
// iki ad-hoc `continue` guardi vardi ve yalnizca "-wide yalniz salon-genis'e"
// kuralini tasiyordu; uctan fazla varyant girince o desen okunmaz hale geliyor.
const PICKS = [
  { slug: 'pilates-reformer', id: '11036671', v: ['', '-sm'],          not: 'Sirali reformer yataklari, pencereden gelen sicak isik. Kisi yok, marka yok.' },
  { slug: 'boks-dovus',       id: '5750886',  v: ['', '-sm'],          not: 'Bos boks salonu, asili kirmizi kum torbalari. Kisi yok, marka yok.' },
  { slug: 'crossfit',         id: '2261477',  v: ['', '-sm'],          not: 'Halter cekisi, kirpilmis ve loş. Yuz yok, marka yok.' },
  { slug: 'cok-subeli-zincir',id: '36833354', v: ['', '-sm', '-band'], not: 'Sade ve aydinlik studyo ic mekani. Kisi yok, marka yok.' },
  { slug: 'grup-dersi',       id: '6339386',  v: ['', '-sm', '-band'], not: 'Daire seklinde grup dersi, sicak ahsap duvar.' },
  { slug: 'salon-genis',      id: '7031705',  v: ['-wide'],            not: 'Genis modern salon, buyuk pencereler. Tam genislik bant icin.' },
];

// `-band` (TASK-3.20): LG'de acilan bant slotlari icin. Olcum (yayin kopyasi,
// 3100): /gecis bandi @1440 576×192 = 3,00:1 · HowItWorks bandi @1440 544×224 =
// 2,43:1; ikisi de 3:2 (`-sm`) kaynaklari `object-cover` ile aliyordu ve dikey
// pikselin %50,1 / %38,3'unu atiyordu. Oran `-wide` ile ayni (2,63:1) secildi ki
// hat tek bir "bant orani" tasisin. Genislik 1600: dpr2'de gereken 1152 / 1088,
// aday kovasi 1200 -> teslim/gereken 1,04 ve 1,10 (eskiden 0,69 ve 0,74).
const VARIANTS = {
  '':      { w: 1600, h: 1067, q: 76 },  // 3:2,    segment sayfasi kahramani
  '-sm':   { w: 800,  h: 534,  q: 74 },  // 3:2,    kart
  '-band': { w: 1600, h: 608,  q: 74 },  // 2,63:1, lg bant slotu
  '-wide': { w: 2000, h: 760,  q: 74 },  // 2,63:1, tam genislik bant
};

const lines = [
  'FOTOGRAF KAYNAKLARI',
  '',
  'Kaynak: Pexels (https://www.pexels.com)',
  'Lisans: Pexels License — ticari kullanim serbest, atif gerekmez.',
  'Not: Unsplash bot korumasi (HTTP 401) nedeniyle kaynak Pexels secildi.',
  // Tarih KAYNAGIN alindigi gundur, betigin kostugu gun degil. Hat olculdu ve
  // BAYT BAYT belirlenimli (TASK-3.20: 11 dosyanin 11'i md5 ile ayni cikti),
  // yani yeniden kosmak yeni bir indirme anlamina gelmiyor -- `new Date()`
  // yazmak lisans acisindan anlamli olan tek tarihi her kosumda siliyordu.
  // Bir PICK'in id'si degisirse bu tarih elle guncellenir.
  `Indirme tarihi: ${KAYNAK_TARIHI}`,
  '',
  'Secim olcutu: ucuncu taraf marka/logo gorunmeyecek, yuz on planda',
  'olmayacak, ton marka paletiyle kavga etmeyecek.',
  '',
];

for (const pick of PICKS) {
  const url = `https://images.pexels.com/photos/${pick.id}/pexels-photo-${pick.id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
  const res = await fetch(url);
  if (!res.ok) { console.log(`✗ ${pick.slug} → HTTP ${res.status}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(buf).metadata();

  const made = [];
  for (const suffix of pick.v) {
    const v = VARIANTS[suffix];
    if (!v) throw new Error(`${pick.slug}: tanimsiz varyant "${suffix}" — VARIANTS tablosunda yok.`);
    const out = `${OUT}/${pick.slug}${suffix}.webp`;
    const b = await sharp(buf)
      .resize(v.w, v.h, { fit: 'cover', position: 'attention' })
      .webp({ quality: v.q, effort: 5 })
      .toBuffer();
    await writeFile(out, b);
    made.push(`${pick.slug}${suffix}.webp ${v.w}×${v.h} ${Math.round(b.length / 1024)}KB`);
  }
  console.log(`✓ ${pick.slug.padEnd(19)} kaynak ${meta.width}×${meta.height} → ${made.length} boyut`);
  lines.push(
    `${pick.slug}`,
    `  Pexels id : ${pick.id}`,
    `  Sayfa     : https://www.pexels.com/photo/${pick.id}/`,
    `  Aciklama  : ${pick.not}`,
    `  Uretilen  : ${made.join(' · ')}`,
    '',
  );
}

await writeFile(`${OUT}/KAYNAK.txt`, lines.join('\n'));
console.log('\nKaynak notu →', `${OUT}/KAYNAK.txt`);
