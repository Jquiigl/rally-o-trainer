import { readFile, writeFile } from 'node:fs/promises';

const debutante = JSON.parse(await readFile(new URL('../Contenido/debutante-signals.es.json', import.meta.url), 'utf8'));
const advanced = JSON.parse(await readFile(new URL('../Contenido/fci-groups-2-4.draft.es.json', import.meta.url), 'utf8'));
const advancedReviewed = advanced.signals.filter((signal) => signal.editorialStatus === 'reviewed' || signal.editorialStatus === 'published');
const output = {
  schemaVersion: 1,
  packageId: 'rally-o-trainer-published-es',
  packageVersion: `0.2.${advancedReviewed.length}`,
  language: 'es-ES',
  editorialStatus: 'published-selection',
  signals: [...debutante.signals, ...advancedReviewed]
};
await writeFile(new URL('../Contenido/published-signals.es.json', import.meta.url), `${JSON.stringify(output,null,2)}\n`);
console.log(`Built published package with ${output.signals.length} signals.`);
