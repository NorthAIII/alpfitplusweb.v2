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

const PICKS = [
  { slug: 'pilates-reformer', id: '11036671', not: 'Sirali reformer yataklari, pencereden gelen sicak isik. Kisi yok, marka yok.' },
  { slug: 'boks-dovus',       id: '5750886',  not: 'Bos boks salonu, asili kirmizi kum torbalari. Kisi yok, marka yok.' },
  { slug: 'crossfit',         id: '2261477',  not: 'Halter cekisi, kirpilmis ve loş. Yuz yok, marka yok.' },
  { slug: 'cok-subeli-zincir',id: '36833354', not: 'Sade ve aydinlik studyo ic mekani. Kisi yok, marka yok.' },
  { slug: 'grup-dersi',       id: '6339386',  not: 'Daire seklinde grup dersi, sicak ahsap duvar.' },
  { slug: 'salon-genis',      id: '7031705',  not: 'Genis modern salon, buyuk pencereler. Tam genislik bant icin.' },
];

const VARIANTS = [
  { suffix: '',        w: 1600, h: 1067, q: 76 },  // 3:2, segment sayfasi
  { suffix: '-sm',     w: 800,  h: 534,  q: 74 },  // 3:2, kart
  { suffix: '-wide',   w: 2000, h: 760,  q: 74 },  // genis bant
];

const lines = [
  'FOTOGRAF KAYNAKLARI',
  '',
  'Kaynak: Pexels (https://www.pexels.com)',
  'Lisans: Pexels License — ticari kullanim serbest, atif gerekmez.',
  'Not: Unsplash bot korumasi (HTTP 401) nedeniyle kaynak Pexels secildi.',
  `Indirme tarihi: ${new Date().toISOString().slice(0, 10)}`,
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
  for (const v of VARIANTS) {
    if (v.suffix === '-wide' && pick.slug !== 'salon-genis') continue;
    if (v.suffix !== '-wide' && pick.slug === 'salon-genis') continue;
    const out = `${OUT}/${pick.slug}${v.suffix}.webp`;
    const b = await sharp(buf)
      .resize(v.w, v.h, { fit: 'cover', position: 'attention' })
      .webp({ quality: v.q, effort: 5 })
      .toBuffer();
    await writeFile(out, b);
    made.push(`${pick.slug}${v.suffix}.webp ${v.w}×${v.h} ${Math.round(b.length / 1024)}KB`);
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
