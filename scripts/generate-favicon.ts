/**
 * Generate favicon.ico
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

async function generateFavicon() {
  const size = 32;
  const center = size / 2;

  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1" />
          <stop offset="100%" style="stop-color:#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="6" fill="url(#bg)" />
      <text x="${center}" y="${center + 4}" text-anchor="middle" font-family="Arial, sans-serif"
            font-size="14" font-weight="bold" fill="#ffffff">OC</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('✅ favicon.ico created!');
}

generateFavicon().catch(console.error);
