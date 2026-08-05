import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('Fuentes oficiales/manifest.json', root), 'utf8'));
const errors = [];
for (const document of manifest.documents) {
  const bytes = await readFile(new URL(`Fuentes oficiales/${document.file}`, root));
  const checksum = createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== document.bytes) errors.push(`${document.file}: expected ${document.bytes} bytes, got ${bytes.length}`);
  if (checksum !== document.sha256) errors.push(`${document.file}: checksum does not match manifest`);
}
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Official sources valid: ${manifest.documents.length} PDF files and checksums.`);
