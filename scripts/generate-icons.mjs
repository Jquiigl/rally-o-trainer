import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../public/brand-symbol.svg', import.meta.url));
const output = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

await Promise.all([
  sharp(source).resize(192, 192).png().toFile(output('pwa-192x192.png')),
  sharp(source).resize(512, 512).png().toFile(output('pwa-512x512.png')),
  sharp(source).resize(384, 384).extend({ top: 64, bottom: 64, left: 64, right: 64, background: '#062E24' }).png().toFile(output('pwa-maskable-512x512.png')),
  sharp(source).resize(180, 180).png().toFile(output('apple-touch-icon.png'))
]);

console.log('Generated PWA icons from public/brand-symbol.svg');
