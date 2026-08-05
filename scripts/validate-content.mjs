import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const source = JSON.parse(readFileSync(new URL('Contenido/fci-signals.source.json', root), 'utf8'));
const p1 = JSON.parse(readFileSync(new URL('Contenido/p1-signals.es.json', root), 'utf8'));
const debutante = JSON.parse(readFileSync(new URL('Contenido/debutante-signals.es.json', root), 'utf8'));
const advanced = JSON.parse(readFileSync(new URL('Contenido/fci-groups-2-4.draft.es.json', root), 'utf8'));
const review = JSON.parse(readFileSync(new URL('Contenido/advanced-review.json', root), 'utf8'));
const published = JSON.parse(readFileSync(new URL('Contenido/published-signals.es.json', root), 'utf8'));
const progression = JSON.parse(readFileSync(new URL('Reglamento/progression.json', root), 'utf8'));
const approvedCodes = new Set(review.approvedCodes);
const rulesetIds = new Set(progression.rulesets.map((ruleset) => ruleset.id));

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(source.count === 91, `FCI source count must be 91, got ${source.count}`);
assert(source.signals.filter((signal) => signal.role === 'exercise').length === 89, 'FCI source must contain 89 exercises');

const sourceByCode = new Map(source.signals.map((signal) => [signal.code, signal]));
const ids = new Set();
const revisions = new Set();

for (const signal of debutante.signals) {
  assert(!ids.has(signal.id), `Duplicate id ${signal.id}`);
  assert(!revisions.has(signal.revisionId), `Duplicate revision ${signal.revisionId}`);
  ids.add(signal.id);
  revisions.add(signal.revisionId);
  if (signal.id.startsWith('fci:')) assert(sourceByCode.has(signal.officialNumber), `Missing source signal ${signal.officialNumber}`);
  assert(signal.editorialStatus === 'reviewed', `${signal.id} is not reviewed`);
  assert(signal.regulatoryDescription.length >= 40, `${signal.id} regulatory description too short`);
  assert(signal.plainExplanation.length >= 30, `${signal.id} plain explanation too short`);
  assert(signal.trainingAdvice.length >= 40, `${signal.id} training advice too short`);
  assert(signal.criteria.length >= 1 && signal.criteria.length <= 3, `${signal.id} must have 1-3 criteria`);
  assert(signal.locations.length > 0, `${signal.id} needs a location`);
  assert(signal.assignments.some((assignment) => assignment.regulationId === 'rsce:debutante'), `${signal.id} missing Debutante assignment`);
  for (const assignment of signal.assignments) assert(rulesetIds.has(assignment.regulationId), `${signal.id} references unknown ruleset ${assignment.regulationId}`);
  for (const prerequisite of signal.prerequisiteSignalIds) {
    assert(debutante.signals.some((candidate) => candidate.id === prerequisite), `${signal.id} prerequisite ${prerequisite} missing from Debutante package`);
  }
}

assert(p1.signals.length === 10, `P1 must contain 10 signals, got ${p1.signals.length}`);
assert(JSON.stringify(p1.signals.map((signal) => signal.officialNumber)) === JSON.stringify(['101','102','103','104','105','106','107','108','109','110']), 'P1 codes must be 101-110 in order');
assert(debutante.signals.length === 33, `Debutante package must contain 33 signals, got ${debutante.signals.length}`);
assert(debutante.signals.filter((signal) => signal.id.startsWith('fci:')).length === 22, 'Debutante package must contain 22 FCI group 1 signals');
assert(debutante.signals.filter((signal) => signal.id.startsWith('rsce:national:')).length === 11, 'Debutante package must contain 11 RSCE national signals');

const advancedCodes = new Set();
const allEditorialIds = new Set([...debutante.signals.map((signal) => signal.id), ...advanced.signals.map((signal) => signal.id)]);
for (const signal of advanced.signals) {
  assert(!advancedCodes.has(signal.officialNumber), `Duplicate advanced code ${signal.officialNumber}`);
  advancedCodes.add(signal.officialNumber);
  const original = sourceByCode.get(signal.officialNumber);
  assert(original?.role === 'exercise', `Missing advanced source signal ${signal.officialNumber}`);
  assert([2, 3, 4].includes(signal.exerciseGroup), `${signal.id} has invalid advanced group`);
  assert(signal.editorialStatus === (approvedCodes.has(signal.officialNumber) ? 'reviewed' : 'draft'), `${signal.id} status does not match owner approvals`);
  assert(signal.editorialReview?.ownerReviewRequired === !approvedCodes.has(signal.officialNumber), `${signal.id} owner review flag does not match approval`);
  assert(signal.editorialReview?.sourceDescriptionEn === original?.sourceDescriptionEn, `${signal.id} lost its comparison source`);
  assert(signal.regulatoryDescription.length >= 70, `${signal.id} regulatory draft too short`);
  assert(signal.plainExplanation.length >= 60, `${signal.id} simple explanation too short`);
  assert(signal.trainingAdvice.length >= 80, `${signal.id} training advice too short`);
  for (const prerequisite of signal.prerequisiteSignalIds) assert(allEditorialIds.has(prerequisite), `${signal.id} has unknown prerequisite ${prerequisite}`);
  for (const assignment of signal.assignments) assert(rulesetIds.has(assignment.regulationId), `${signal.id} references unknown ruleset ${assignment.regulationId}`);
}
assert(advanced.signals.length === 67, `Advanced package must contain 67 signals, got ${advanced.signals.length}`);
assert(advanced.signals.filter((signal) => signal.exerciseGroup === 2).length === 22, 'Group 2 must contain 22 signals');
assert(advanced.signals.filter((signal) => signal.exerciseGroup === 3).length === 23, 'Group 3 must contain 23 signals');
assert(advanced.signals.filter((signal) => signal.exerciseGroup === 4).length === 22, 'Group 4 must contain 22 signals');
assert(review.approvedCodes.length === approvedCodes.size, 'Advanced approval list contains duplicates');
for (const code of approvedCodes) assert(advancedCodes.has(code), `Approved advanced code ${code} does not exist`);
assert(published.signals.length === 33 + approvedCodes.size, `Published package must contain ${33 + approvedCodes.size} signals`);
assert(published.signals.every((signal) => signal.editorialStatus === 'reviewed' || signal.editorialStatus === 'published'), 'Published package contains unfinished content');
assert(progression.productPriority.join(',') === 'RSCE,FCI', 'Regulatory priority must remain RSCE then FCI');
assert(progression.consultationAlwaysOpen === true, 'Regulatory consultation must remain open');
assert(rulesetIds.size === 5, `Expected five product rulesets, got ${rulesetIds.size}`);
assert(progression.rulesets.map((ruleset) => ruleset.id).join(',') === 'rsce:debutante,rsce:grade-1,rsce:grade-2,rsce:grade-3,fci:international', 'Ruleset order or identity changed unexpectedly');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Content valid: ${source.count} FCI source entries, ${debutante.signals.length} reviewed Debutante signals, ${advanced.signals.length} advanced Spanish records and ${published.signals.length} published selections.`);
