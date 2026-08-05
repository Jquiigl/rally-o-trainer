import { readFile, writeFile } from 'node:fs/promises';

const source = JSON.parse(await readFile(new URL('../Contenido/fci-signals.source.json', import.meta.url), 'utf8'));
const review = JSON.parse(await readFile(new URL('../Contenido/advanced-review.json', import.meta.url), 'utf8'));
const approvedCodes = new Set(review.approvedCodes);
const sourceByCode = new Map(source.signals.map((signal) => [signal.code, signal]));

// Redacción de trabajo en español. El propietario debe compararla con sourceDescriptionEn antes de publicarla.
const rows = [
  ['201','Dos medias vueltas, perro por detrás','El guía cambia 180 grados hacia el lado del perro mientras este rodea por detrás y recupera el junto. Tras avanzar entre 1 y 2 m, ambos repiten la acción y continúan en la dirección inicial.'],
  ['202','Doble media vuelta: derecha e izquierda','El binomio gira 180 grados a la derecha y avanza entre 1 y 2 m; después gira 180 grados a la izquierda y continúa en la dirección inicial.'],
  ['203','Doble media vuelta: izquierda y derecha','El binomio gira 180 grados a la izquierda y avanza entre 1 y 2 m; después gira 180 grados a la derecha y continúa en la dirección inicial.'],
  ['204','Parada, tumbado y sentado','El guía se detiene, el perro se sienta a su lado, pasa a tumbado y después vuelve a sentado. Mantiene el sentado hasta reanudar la marcha.'],
  ['205','Parada y de pie','El guía se detiene y el perro se sienta a su lado; después adopta la posición de pie y la mantiene hasta que el binomio avanza.'],
  ['206','Parada, de pie y sentado','Tras sentarse al detenerse el guía, el perro pasa a de pie y vuelve a sentado. Mantiene el sentado hasta la salida.'],
  ['207','Parada, de pie y tumbado','Tras sentarse al detenerse el guía, el perro pasa a de pie y después a tumbado. Mantiene el tumbado hasta la salida.'],
  ['208','Parada, de pie y rodear','El perro se sienta al detenerse, pasa a de pie y permanece inmóvil mientras el guía lo rodea y vuelve a su lado. Mantiene la posición hasta avanzar.'],
  ['209','Parada, frente y regreso por detrás','El perro se sienta junto al guía, pasa a sentado de frente y vuelve al lado izquierdo rodeando por la derecha y detrás del guía. Se sienta antes de avanzar.'],
  ['210','Parada, frente y regreso directo','El perro se sienta junto al guía, pasa a sentado de frente y vuelve directamente al lado izquierdo. Se sienta antes de avanzar.'],
  ['211','Parada, paso, giro derecho, paso y llamada','El perro permanece sentado mientras el guía avanza un paso, gira 90 grados a la derecha y avanza otro. Después acude al mismo lado de junto y se sienta.'],
  ['212','Parada, paso, giro izquierdo, paso y llamada','El perro permanece sentado mientras el guía avanza un paso, gira 90 grados a la izquierda y avanza otro. Después acude al mismo lado de junto y se sienta.'],
  ['213','Parada, media vuelta derecha y continuar','Tras una parada con sentado, guía y perro giran juntos 180 grados a la derecha sobre el sitio y continúan en dirección contraria.'],
  ['214','Parada, media vuelta izquierda y continuar','Tras una parada con sentado, guía y perro giran juntos 180 grados a la izquierda sobre el sitio y continúan en dirección contraria.'],
  ['215','Parada, media vuelta derecha y parada','Tras una parada con sentado, el binomio gira 180 grados a la derecha sobre el sitio y vuelve a detenerse con el perro sentado.'],
  ['216','Parada, media vuelta izquierda y parada','Tras una parada con sentado, el binomio gira 180 grados a la izquierda sobre el sitio y vuelve a detenerse con el perro sentado.'],
  ['217','Parada, giro derecho, un paso y parada','Tras sentarse al detenerse, el perro acompaña al guía en un giro de 90 grados a la derecha y un paso; vuelve a sentarse al parar.'],
  ['218','Parada, giro izquierdo, un paso y parada','Tras sentarse al detenerse, el perro acompaña al guía en un giro de 90 grados a la izquierda y un paso; vuelve a sentarse al parar.'],
  ['219','Parada: un paso de pie, dos sentado y tres tumbado','Desde sentado en junto, el binomio avanza uno, dos y tres pasos. El perro termina respectivamente de pie, sentado y tumbado en cada parada.'],
  ['220','Giro del perro','Mientras el binomio avanza, el perro realiza un círculo hacia delante y alejándose del guía, y recupera el junto.'],
  ['221','Ocho con distracciones','El binomio completa un ocho alrededor de dos conos separados entre 2,5 y 3 m y cruza tres veces la línea entre dos distracciones situadas entre ellos.'],
  ['222','Envío al salto','Desde la zona de la señal, situada 2 m antes del salto, el guía envía al perro por encima mientras continúa avanzando en paralelo y puede acelerar para reunirse con él.'],

  ['301','Un paso lateral a la derecha','En movimiento, el guía da un paso lateral a la derecha y el perro se desplaza simultáneamente, alineado y paralelo. El binomio continúa por la derecha de la señal.'],
  ['302','Un paso lateral a la izquierda','En movimiento, el guía da un paso lateral a la izquierda y el perro se desplaza simultáneamente, alineado y paralelo.'],
  ['303','Parada, paso lateral derecho y parada','Tras una parada con sentado, guía y perro dan un paso lateral a la derecha, alineados y en paralelo, y vuelven a detenerse con el perro sentado.'],
  ['304','Parada, paso lateral izquierdo y parada','Tras una parada con sentado, guía y perro dan un paso lateral a la izquierda, alineados y en paralelo, y vuelven a detenerse con el perro sentado.'],
  ['305','Parada, uno y dos pasos atrás con parada','Desde sentado en junto, guía y perro retroceden primero un paso y después dos, alineados y en paralelo. El perro se sienta tras cada tramo.'],
  ['306','Frente: uno atrás de pie, dos sentado y tres tumbado','Desde sentado de frente, el perro acompaña al guía hacia atrás uno, dos y tres pasos y termina respectivamente de pie, sentado y tumbado. Después vuelve sentado al lado izquierdo.'],
  ['307','De pie, media vuelta derecha y de pie','El guía se detiene con el perro de pie; ambos giran 180 grados a la derecha sobre el sitio y el perro termina de nuevo de pie.'],
  ['308','De pie, media vuelta izquierda y de pie','El guía se detiene con el perro de pie; ambos giran 180 grados a la izquierda sobre el sitio y el perro termina de nuevo de pie.'],
  ['309','De pie, rodear al guía y de pie','El perro queda de pie junto al guía, lo rodea hacia delante y vuelve a quedar de pie en el mismo lado hasta la salida.'],
  ['310','Giro interior de ambos','En movimiento, guía y perro giran simultáneamente 180 grados uno hacia el otro y continúan en dirección contraria, cambiando el lado de junto.'],
  ['311','Cambio de lado por detrás','En movimiento, el perro cambia de lado pasando por detrás del guía sin girar sobre sí mismo.'],
  ['312','Cambio de lado entre las piernas','El perro cambia de lado pasando entre las piernas del guía. El guía puede detenerse y levantar una pierna para facilitar un movimiento fluido.'],
  ['313','Media vuelta de ambos a la derecha','En movimiento, guía y perro realizan cada uno un giro cerrado y simultáneo de 180 grados a la derecha, continúan en sentido contrario y cambian el lado de junto.'],
  ['314','Media vuelta de ambos a la izquierda','En movimiento, guía y perro realizan cada uno un giro cerrado y simultáneo de 180 grados a la izquierda, continúan en sentido contrario y cambian el lado de junto.'],
  ['315','Parada y cambio de lado por detrás','Tras sentarse junto al guía, el perro cambia al otro lado pasando por detrás sin girar sobre sí mismo y vuelve a sentarse antes de avanzar.'],
  ['316','Parada y cambio de lado por delante','Tras sentarse junto al guía, el perro cambia al otro lado por delante, girando para completar el cambio, y vuelve a sentarse antes de avanzar.'],
  ['317','De pie en marcha y rodear','En movimiento, el perro queda de pie mientras el guía continúa sin pausa, lo rodea, vuelve a su lado y se detiene. El perro mantiene la posición hasta salir.'],
  ['318','Tumbado en marcha y rodear','En movimiento, el perro se tumba mientras el guía continúa sin pausa, lo rodea, vuelve a su lado y se detiene. El perro mantiene la posición hasta salir.'],
  ['319','Parada, de pie y avanzar sin el perro','El perro se sienta al detenerse y pasa a de pie. El guía avanza solo hacia el cono o la señal de llamada; la llamada correspondiente completa la secuencia.'],
  ['320','Envío a dos saltos','Desde la señal situada 2 m antes del primer salto, el guía envía al perro sobre dos saltos separados 4 m, en línea o con un ángulo máximo de 90 grados, mientras avanza en paralelo.'],
  ['321','Giro y llamada al junto','Esta llamada se sitúa entre 3 y 5 m después de 319, 408 o 409. El guía gira, se detiene y llama al perro directamente al lado izquierdo sin sentado; al llegar, ambos avanzan.'],
  ['322','Giro, llamada al frente y regreso por detrás','Esta llamada se sitúa entre 3 y 5 m después de 319, 408 o 409. El guía gira, llama al perro a sentado de frente y este vuelve al lado izquierdo rodeando por detrás y se sienta antes de avanzar.'],
  ['323','Giro, llamada al frente y regreso directo','Esta llamada se sitúa entre 3 y 5 m después de 319, 408 o 409. El guía gira, llama al perro a sentado de frente y este vuelve directamente al lado izquierdo y se sienta antes de avanzar.'],

  ['401','Dos pasos laterales a la derecha','En movimiento, el guía da dos pasos laterales a la derecha y el perro se desplaza simultáneamente, alineado y paralelo. El binomio continúa por la derecha de la señal.'],
  ['402','Dos pasos laterales a la izquierda','En movimiento, el guía da dos pasos laterales a la izquierda y el perro se desplaza simultáneamente, alineado y paralelo.'],
  ['403','Parada, dos pasos laterales derechos y parada','Tras una parada con sentado, guía y perro dan dos pasos laterales a la derecha, alineados y en paralelo, y el perro vuelve a sentarse.'],
  ['404','Parada, dos pasos laterales izquierdos y parada','Tras una parada con sentado, guía y perro dan dos pasos laterales a la izquierda, alineados y en paralelo, y el perro vuelve a sentarse.'],
  ['405','Giro exterior de ambos','En movimiento, guía y perro giran simultáneamente 180 grados alejándose uno del otro, continúan en dirección contraria y cambian el lado de junto.'],
  ['406','Cambio de lado por delante','En movimiento, el perro cambia de lado pasando por delante del guía sin girar sobre sí mismo.'],
  ['407','Rodear al guía','Mientras el binomio avanza, el perro rodea al guía hacia delante y recupera el lado de junto inicial.'],
  ['408','Sentado en marcha y avanzar','En movimiento, el perro se sienta mientras el guía continúa sin pausa hacia el cono o la señal de llamada; la llamada correspondiente completa la secuencia.'],
  ['409','Tumbado en marcha y avanzar','En movimiento, el perro se tumba mientras el guía continúa sin pausa hacia el cono o la señal de llamada; la llamada correspondiente completa la secuencia.'],
  ['410','Parada, envío al cono de pie y llamada','Tras una parada, el guía envía al perro a quedar de pie junto a un cono situado entre 3 y 5 m y hasta 90 grados; al menos una pata queda a menos de 1 m. El guía avanza a un punto de llamada separado al menos 2 m del cono y lo llama al mismo lado.'],
  ['411','Frente de pie, alejarse hacia atrás y llamada','El perro queda de pie frente al guía, retrocede al menos tres longitudes y vuelve a quedar de pie. El guía avanza junto a él y lo llama sin detenerse al lado izquierdo.'],
  ['412','Tres pasos hacia atrás','En movimiento, el guía da al menos tres pasos hacia atrás y el perro lo acompaña simultáneamente, alineado y paralelo; después ambos avanzan.'],
  ['413','Parada: uno atrás de pie, dos sentado y tres tumbado','Desde sentado en junto, guía y perro retroceden uno, dos y tres pasos y el perro termina respectivamente de pie, sentado y tumbado.'],
  ['414','Tres giros derechos con de pie, sentado y tumbado','Desde una parada, el binomio hace tres giros sucesivos de 90 grados a la derecha. El perro termina de pie, sentado y tumbado respectivamente; la dirección final queda 90 grados a la izquierda de la inicial.'],
  ['415','Tres giros izquierdos con de pie, sentado y tumbado','Desde una parada, el binomio hace tres giros sucesivos de 90 grados a la izquierda. El perro termina de pie, sentado y tumbado respectivamente; la dirección final queda 90 grados a la derecha de la inicial.'],
  ['416','Frente y pasos laterales izquierda-derecha','Desde sentado de frente, el perro acompaña un paso lateral del guía a la izquierda y otro a la derecha, sentándose tras cada uno. Después vuelve sentado al lado izquierdo.'],
  ['417','Giro izquierdo de 90° alrededor del cono','Con el perro inicialmente a la izquierda, el guía lo envía en movimiento a rodear en sentido horario un cono situado 1–2 m tras la señal. El perro inicia claramente el envío antes de que el guía alcance la señal; el guía gira 90 grados a la izquierda y termina con el perro a la derecha.'],
  ['418','Giro derecho de 90° alrededor del cono','Con el perro inicialmente a la derecha, el guía lo envía en movimiento a rodear en sentido antihorario un cono situado 1–2 m tras la señal. El perro inicia claramente el envío antes de que el guía alcance la señal; el guía gira 90 grados a la derecha y termina con el perro a la izquierda.'],
  ['419','Sentado en marcha y rodear','En movimiento, el perro se sienta mientras el guía continúa sin pausa, lo rodea, vuelve a su lado y se detiene. El perro permanece sentado hasta la salida.'],
  ['420','Parada y llamada sobre el salto','El perro se sienta junto a la señal situada 2 m antes del salto. El guía avanza solo, pasa el salto y llama al perro para que salte y vuelva al mismo lado de junto.'],
  ['421','Giro y llamada dirigida sobre el salto','Esta señal se coloca 8 m después de 319, 408 o 409. El salto queda a mitad, desplazado 2 m a izquierda o derecha. El guía gira y llama al perro sobre el salto al lado izquierdo sin sentado; después ambos avanzan.'],
  ['422','Giro, alejarse, sentado, tumbado y llamada','Esta señal se sitúa entre 3 y 5 m después de 319, 408 o 409. El guía gira y pide al perro retroceder al menos una longitud, sentarse y tumbarse; después lo llama al lado izquierdo, donde se sienta.']
];

const jumpCodes = new Set(['222','320','420','421']);
const coneCodes = new Set(['221','410','417','418']);
const sideCodes = new Set(['301','302','303','304','305','306','310','311','312','313','314','315','316','401','402','403','404','405','406','411','412','413','416','417','418']);
const distanceCodes = new Set(['211','212','222','305','306','317','318','319','320','321','322','323','408','409','410','411','419','420','421','422']);
const prerequisites = {
  '201':['fci:signal:113'], '202':['fci:signal:105','fci:signal:106'], '203':['fci:signal:105','fci:signal:106'],
  '204':['fci:signal:101','fci:signal:102'], '206':['fci:signal:205'], '207':['fci:signal:205','fci:signal:101'],
  '208':['fci:signal:205','fci:signal:103'], '209':['rsce:national:15'], '210':['rsce:national:16'],
  '211':['fci:signal:103','fci:signal:114'], '212':['fci:signal:103','fci:signal:115'], '213':['fci:signal:114'],
  '214':['fci:signal:115'], '215':['fci:signal:114'], '216':['fci:signal:115'], '217':['fci:signal:114'],
  '218':['fci:signal:115'], '219':['fci:signal:102','fci:signal:205'], '221':['fci:signal:121'],
  '303':['fci:signal:301'], '304':['fci:signal:302'], '305':['rsce:national:25'], '306':['rsce:national:26'],
  '307':['fci:signal:205','fci:signal:213'], '308':['fci:signal:205','fci:signal:214'], '309':['fci:signal:205'],
  '310':['fci:signal:113'], '313':['fci:signal:202'], '314':['fci:signal:203'], '315':['fci:signal:311'],
  '316':['fci:signal:312'], '317':['fci:signal:208'], '318':['fci:signal:104'], '319':['fci:signal:208'],
  '320':['fci:signal:222'], '321':['fci:signal:319'], '322':['fci:signal:319','fci:signal:209'], '323':['fci:signal:319','fci:signal:210'],
  '401':['fci:signal:301'], '402':['fci:signal:302'], '403':['fci:signal:303'], '404':['fci:signal:304'],
  '405':['fci:signal:310'], '406':['fci:signal:311'], '407':['fci:signal:309'], '408':['fci:signal:317'],
  '409':['fci:signal:318'], '410':['fci:signal:319'], '411':['fci:signal:306'], '412':['fci:signal:305'],
  '413':['fci:signal:305','fci:signal:219'], '414':['fci:signal:307','fci:signal:204'], '415':['fci:signal:308','fci:signal:204'],
  '416':['fci:signal:306'], '417':['fci:signal:311'], '418':['fci:signal:311'], '419':['fci:signal:408'],
  '420':['fci:signal:222','fci:signal:319'], '421':['fci:signal:320','fci:signal:321'], '422':['fci:signal:321','fci:signal:411']
};

function advice(code) {
  if (jumpCodes.has(code)) return 'Asegura primero un salto cómodo y seguro, con altura adecuada. Añade envío o llamada por separado y aumenta la distancia gradualmente, siempre con refuerzo positivo.';
  if (coneCodes.has(code)) return 'Presenta primero el patrón con referencias amplias y sin prisa. Refuerza la trayectoria correcta y reduce después gestos, distancia extra y ayudas visibles.';
  if (sideCodes.has(code)) return 'Construye el desplazamiento en pasos muy cortos y premia que hombros y cadera permanezcan alineados. Aumenta distancia solo cuando el movimiento sea fluido.';
  if (distanceCodes.has(code)) return 'Entrena por separado permanencia, movimiento del guía y llamada. Une dos elementos cada vez y vuelve a una distancia fácil si aparece anticipación.';
  return 'Divide la secuencia en posiciones y transiciones breves. Refuerza cada parte autónoma y encadénalas solo cuando el perro responda con fluidez y sin ayudas adicionales.';
}

function plain(name) {
  return `La secuencia que debes practicar es «${name.toLocaleLowerCase('es')}». Trabájala por partes y comprueba que cada posición o cambio ocurre en el orden indicado.`;
}

function assignmentsFor(group, code) {
  const ids = group === 2 ? ['rsce:grade-1','rsce:grade-2','rsce:grade-3','fci:international'] :
    group === 3 ? ['rsce:grade-2','rsce:grade-3','fci:international'] : ['rsce:grade-3','fci:international'];
  const regulatorySideMode = code === '417' ? 'left-only' : code === '418' ? 'right-only' : 'both';
  return ids.map((regulationId) => ({ regulationId, regulatorySideMode }));
}

const signals = rows.map(([code,name,regulatoryDescription]) => {
  const original = sourceByCode.get(code);
  if (!original) throw new Error(`Missing FCI source ${code}`);
  const materials = jumpCodes.has(code) ? [{ id:'jump', requiredForFinalExecution:true, usefulForLearning:false }] :
    coneCodes.has(code) ? [{ id:'cone', requiredForFinalExecution:true, usefulForLearning:false }] : [];
  return {
    id:`fci:signal:${code}`, revisionId:`fci:signal:${code}:2025-02-01:${approvedCodes.has(code)?'es-1':'es-draft-1'}`, officialNumber:code, name,
    exerciseGroup:original.group, exerciseArea:original.exerciseArea, regulatoryDescription, plainExplanation:plain(name),
    trainingAdvice:advice(code), criteria:['Orden y posiciones correctos','Movimiento coordinado y controlado','Final estable antes de continuar'],
    trainingSideMode:code === '417' ? 'left-only' : code === '418' ? 'right-only' : 'both', materials,
    locations:jumpCodes.has(code)||distanceCodes.has(code)?['outdoor-small','club']:['home','outdoor-small','club'],
    space:jumpCodes.has(code)||distanceCodes.has(code)?'medium':'short', skillIds:[], prerequisiteSignalIds:prerequisites[code] ?? [],
    assignments:assignmentsFor(original.group, code), progressCompatibilityKey:`fci-${code}-2025`, editorialStatus:approvedCodes.has(code)?'reviewed':'draft',
    editorialReview:{ ownerReviewRequired:!approvedCodes.has(code), sourceDescriptionEn:original.sourceDescriptionEn }
  };
});

const output = { schemaVersion:1, packageId:'rally-o-trainer-fci-advanced-es', packageVersion:'0.1.0', language:'es-ES', editorialStatus:signals.every((signal)=>signal.editorialStatus==='reviewed')?'reviewed':'mixed', sourceDocumentId:'fci-ro-2025', signals };
await writeFile(new URL('../Contenido/fci-groups-2-4.draft.es.json', import.meta.url), `${JSON.stringify(output,null,2)}\n`);
const checklist = ['# Revisión editorial de señales FCI · Grupos 2–4','',
  '> Cada casilla exige comparar nombre y descripción con el texto inglés conservado en el JSON y con la página visual del PDF oficial. Marcar una casilla no modifica automáticamente el estado técnico.',''];
for (const group of [2,3,4]) {
  checklist.push(`## Grupo ${group}`, '');
  for (const signal of signals.filter((item) => item.exerciseGroup === group)) {
    checklist.push(`- [${approvedCodes.has(signal.officialNumber) ? 'x' : ' '}] **${signal.officialNumber} · ${signal.name}** — regla, lenguaje sencillo, consejo, criterios, lado y material.`);
  }
  checklist.push('');
}
const allApproved = approvedCodes.size === signals.length;
checklist.push('## Cierre del lote','',
  `- [${allApproved ? 'x' : ' '}] Las 67 señales se han comprobado visualmente.`,
  `- [${allApproved ? 'x' : ' '}] Las excepciones 417 y 418 conservan su lado reglamentario.`,
  `- [${allApproved ? 'x' : ' '}] Saltos, conos y distancias coinciden con la fuente.`,
  `- [${allApproved ? 'x' : ' '}] Se han corregido falsos amigos y términos no naturales en español.`,
  `- [${allApproved ? 'x' : ' '}] Cada código aprobado se ha añadido a \`advanced-review.json\`.`,
  `- [${allApproved ? 'x' : ' '}] \`pnpm check\` confirma que el paquete publicado no contiene borradores.`);
await writeFile(new URL('../Contenido/REVISION-FCI-GRUPOS-2-4.md', import.meta.url), `${checklist.join('\n')}\n`);
console.log(`Built ${signals.length} advanced Spanish signals: ${approvedCodes.size} reviewed and ${signals.length-approvedCodes.size} drafts.`);
