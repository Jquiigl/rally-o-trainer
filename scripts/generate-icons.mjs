import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../public/brand-symbol.png', import.meta.url));
const output = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const squareLogo = sharp(source);
const png = { compressionLevel: 9, adaptiveFiltering: true };

await Promise.all([
  squareLogo.clone().resize(192, 192).png(png).toFile(output('pwa-192x192.png')),
  squareLogo.clone().resize(512, 512).png(png).toFile(output('pwa-512x512.png')),
  squareLogo.clone().resize(384, 384).extend({ top: 64, bottom: 64, left: 64, right: 64, background: '#062E24' }).png(png).toFile(output('pwa-maskable-512x512.png')),
  squareLogo.clone().resize(180, 180).png(png).toFile(output('apple-touch-icon.png'))
]);

console.log('Generated PWA icons from public/brand-symbol.png');
