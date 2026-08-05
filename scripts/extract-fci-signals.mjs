import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const inputPath = new URL('../tmp/pdfs/fci-rules.txt', import.meta.url);
const outputPath = new URL('../Contenido/fci-signals.source.json', import.meta.url);
const sourcePdfPath = new URL('../Fuentes oficiales/FCI-Rally-Obedience-Rules-2025.pdf', import.meta.url);

const raw = readFileSync(inputPath, 'utf8').replaceAll('\r', '');
const sourceChecksum = createHash('sha256').update(readFileSync(sourcePdfPath)).digest('hex');
const start = raw.indexOf('5.      DESCRIPTIONS OF THE FCI CLASS EXERCISE SIGNS');
const end = raw.indexOf('6.      JUDGING RULES', start);

if (start < 0 || end < 0) {
  throw new Error('Could not locate section 5 boundaries in the extracted FCI rules.');
}

const lines = raw.slice(start, end).split('\n');
const entries = [];
let current = null;
let pendingHeader = null;

function cleanLine(line) {
  return line
    .replace(/^\f/, '')
    .replace(/\s+Regulations and Rules for International FCI Rally Obedience Trials\s+\d+\s*\/\s*36\s*$/, '')
    .trim();
}

function finishCurrent() {
  if (!current) return;
  const description = current.descriptionLines
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!description) throw new Error(`Missing description for ${current.code}`);
  entries.push({
    code: current.code,
    group: /^\d/.test(current.code) ? Number(current.code[0]) : 'system',
    exerciseArea: current.area,
    officialNameEn: current.name,
    sourceDescriptionEn: description,
    sideMode:
      current.code === '417' ? 'left-only' :
      current.code === '418' ? 'right-only' :
      /^\d/.test(current.code) ? 'both' : 'not-applicable',
    role:
      current.code === 'START' ? 'start' :
      current.code === 'FINISH' ? 'finish' : 'exercise',
    editorialStatus: 'source-extracted'
  });
  current = null;
}

for (const originalLine of lines) {
  const line = cleanLine(originalLine);
  if (!line) continue;
  if (/^(5\.\d|SIGN\s+DESCRIPTION|Beforehand note|•)/.test(line)) continue;
  if (/^Regulations and Rules for International/.test(line)) continue;

  const headerStart = line.match(/^(START|FINISH|\d{3})\s+(.+)$/);
  if (headerStart) {
    const [, code, rest] = headerStart;
    const systemComplete = rest.match(/^\(([A-D])\)$/);
    const complete = rest.match(/^(.*)\s+\(([A-D])\)$/);
    if (systemComplete && (code === 'START' || code === 'FINISH')) {
      finishCurrent();
      current = { code, name: code, area: systemComplete[1], descriptionLines: [] };
      pendingHeader = null;
    } else if (complete) {
      finishCurrent();
      current = { code, name: complete[1].trim(), area: complete[2], descriptionLines: [] };
      pendingHeader = null;
    } else if (/^[A-Z0-9°×,.'’\- ]+$/.test(rest)) {
      finishCurrent();
      pendingHeader = { code, parts: [rest] };
    } else if (current) {
      current.descriptionLines.push(line);
    }
    continue;
  }

  if (pendingHeader) {
    const complete = line.match(/^(.*)\s+\(([A-D])\)$/);
    if (!complete) throw new Error(`Unexpected wrapped header for ${pendingHeader.code}: ${line}`);
    current = {
      code: pendingHeader.code,
      name: [...pendingHeader.parts, complete[1]].join(' ').replace(/\s+/g, ' ').trim(),
      area: complete[2],
      descriptionLines: []
    };
    pendingHeader = null;
    continue;
  }

  if (current) current.descriptionLines.push(line);
}

finishCurrent();

const expectedCodes = [
  'START', 'FINISH',
  ...Array.from({ length: 22 }, (_, index) => String(101 + index)),
  ...Array.from({ length: 22 }, (_, index) => String(201 + index)),
  ...Array.from({ length: 23 }, (_, index) => String(301 + index)),
  ...Array.from({ length: 22 }, (_, index) => String(401 + index))
];

const actualCodes = entries.map(({ code }) => code);
if (JSON.stringify(actualCodes) !== JSON.stringify(expectedCodes)) {
  const missing = expectedCodes.filter((code) => !actualCodes.includes(code));
  const extra = actualCodes.filter((code) => !expectedCodes.includes(code));
  throw new Error(`Unexpected signal inventory. Expected ${expectedCodes.length}, got ${actualCodes.length}. Missing: ${missing.join(', ')}. Extra: ${extra.join(', ')}.`);
}

mkdirSync(new URL('../Contenido/', import.meta.url), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify({
  schemaVersion: 1,
  source: {
    authority: 'FCI',
    title: 'Regulations and Rules for International FCI Rally Obedience Trials',
    effectiveFrom: '2025-02-01',
    language: 'en',
    localFile: 'Fuentes oficiales/FCI-Rally-Obedience-Rules-2025.pdf',
    sha256: sourceChecksum,
    extractionNote: 'Mechanical text extraction for editorial comparison; visual review remains mandatory.'
  },
  count: entries.length,
  signals: entries
}, null, 2)}\n`);

console.log(`Extracted ${entries.length} FCI entries to ${outputPath.pathname}`);
