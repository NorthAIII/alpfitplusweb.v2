/** Favicon, app ikonu ve OG gorseli — logo isaretinden uretilir. */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = '/work/brand-out';
await mkdir(OUT, { recursive: true });

const mark = (size, radius) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${size}" height="${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#94D08E"/>
      <stop offset="55%" stop-color="#74B36F"/>
      <stop offset="100%" stop-color="#3E6B3C"/>
    </linearGradient>
  </defs>
  <rect width="40" height="40" rx="${radius}" fill="url(#g)"/>
  <g fill="none" stroke="#0C1A0B" stroke-opacity=".92" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11.6 28.4 19.1 11.9a1 1 0 0 1 1.82 0l3.02 6.64"/>
    <path d="M15.9 22.6h6.6"/>
    <path d="M27.4 23.1v7.2M23.8 26.7h7.2"/>
  </g>
</svg>`;

for (const [name, size, radius] of [
  ['icon-192.png', 192, 11.5],
  ['icon-512.png', 512, 11.5],
  ['icon-512-maskable.png', 512, 0],
  ['apple-touch-icon.png', 180, 0],
  ['favicon-32.png', 32, 9],
]) {
  await sharp(Buffer.from(mark(size, radius))).png().toFile(`${OUT}/${name}`);
  console.log('✓', name, size);
}

// OG gorseli 1200x630
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FBFBF9"/>
      <stop offset="100%" stop-color="#EEF5ED"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#94D08E"/>
      <stop offset="55%" stop-color="#74B36F"/>
      <stop offset="100%" stop-color="#3E6B3C"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.12" r="0.6">
      <stop offset="0%" stop-color="#94D08E" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#94D08E" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(88,80)">
    <g transform="scale(1.7)">
      <rect width="40" height="40" rx="11.5" fill="url(#g)"/>
      <g fill="none" stroke="#0C1A0B" stroke-opacity=".92" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11.6 28.4 19.1 11.9a1 1 0 0 1 1.82 0l3.02 6.64"/>
        <path d="M15.9 22.6h6.6"/>
        <path d="M27.4 23.1v7.2M23.8 26.7h7.2"/>
      </g>
    </g>
    <text x="86" y="46" font-family="DejaVu Sans, sans-serif" font-size="34" font-weight="700" fill="#171A15">Alpfit<tspan fill="#2F5A2E">&#160;Plus</tspan></text>
  </g>
  <text x="88" y="300" font-family="DejaVu Sans, sans-serif" font-size="72" font-weight="700" fill="#171A15">Kulübünüzün tüm işi</text>
  <text x="88" y="386" font-family="DejaVu Sans, sans-serif" font-size="72" font-weight="700" fill="#2F5A2E">tek platformda</text>
  <text x="88" y="452" font-family="DejaVu Sans, sans-serif" font-size="27" fill="#545B4D">Randevu · grup dersleri · üyelik · tahsilat · çok şube · diyetisyen</text>
  <g transform="translate(88,506)">
    <rect width="330" height="60" rx="14" fill="#74B36F"/>
    <text x="165" y="38" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="24" font-weight="700" fill="#0E100C">15 gün ücretsiz deneme</text>
    <text x="360" y="38" font-family="DejaVu Sans, sans-serif" font-size="24" fill="#545B4D">alpfitplus.com</text>
  </g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(`${OUT}/og.png`);
console.log('✓ og.png 1200x630');
