import { access, readFile, readdir, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

async function walk(directory, prefix = '') {
  const names = await readdir(directory, { withFileTypes: true });
  const output = [];
  for (const entry of names) {
    const relative = `${prefix}${entry.name}`;
    if (entry.isDirectory()) output.push(...await walk(new URL(`${entry.name}/`, directory), `${relative}/`));
    else output.push(relative);
  }
  return output;
}

const files = await walk(dist);
const index = await readFile(new URL('index.html', dist), 'utf8');
const manifest = JSON.parse(await readFile(new URL('manifest.webmanifest', dist), 'utf8'));
const serviceWorker = await readFile(new URL('sw.js', dist), 'utf8');

assert(manifest.name === 'Rally O Trainer', 'Manifest has the wrong application name');
assert(manifest.display === 'standalone', 'Manifest must use standalone display');
assert(manifest.start_url === './#/', 'Manifest start_url must open the hash router');
assert(index.includes('viewport-fit=cover'), 'iOS safe-area viewport metadata is missing');
assert(index.includes('apple-mobile-web-app-capable'), 'iOS install metadata is missing');
assert(index.includes('manifest.webmanifest'), 'Manifest link is missing from index');
assert(serviceWorker.includes('SKIP_WAITING'), 'Service worker update message support is missing');
assert(serviceWorker.includes('index.html') && serviceWorker.includes('manifest.webmanifest'), 'Core shell is not precached');

for (const icon of manifest.icons) {
  assert(files.includes(icon.src), `Manifest icon ${icon.src} is missing`);
  await access(new URL(icon.src, dist));
}
for (const match of index.matchAll(/(?:src|href)="\.\/(assets\/[^"?]+)"/g)) assert(files.includes(match[1]), `Index asset ${match[1]} is missing`);
assert(!files.some((file) => file.endsWith('.pdf')), 'Official PDF sources must not be shipped in the PWA');
assert(!files.some((file) => /draft|source/i.test(file)), 'Draft or source content must not be shipped as a standalone asset');
const javascript = (await Promise.all(files.filter((file) => file.endsWith('.js') && file.startsWith('assets/')).map((file) => readFile(new URL(file, dist), 'utf8')))).join('\n');
assert(javascript.includes('Frente, regreso por detrás sin parada'), 'Reviewed RSCE content is missing from the bundle');
assert(!javascript.includes('Dos medias vueltas, perro por detrás'), 'Unapproved advanced content leaked into the bundle');

let totalBytes = 0;
for (const file of files) totalBytes += (await stat(new URL(file, dist))).size;
assert(totalBytes < 2_000_000, `PWA distribution is unexpectedly large: ${totalBytes} bytes`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
console.log(`PWA build valid: ${files.length} files, ${totalBytes} bytes, standalone manifest and offline shell.`);
