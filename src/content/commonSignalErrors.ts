import type { SignalContent } from '../domain/types';

type ErrorKind = 'down' | 'sit-down' | 'around' | 'turn-right' | 'turn-left' | 'speed-slow' | 'speed-fast' | 'speed-normal' | 'cones' | 'front' | 'steps';

function errorKind(code: string): ErrorKind | null {
  if (code === '101') return 'down';
  if (['102', '104'].includes(code)) return 'sit-down';
  if (['103', '35'].includes(code)) return 'around';
  if (['105', '107', '109', '111', '113', '114', '33'].includes(code)) return 'turn-right';
  if (['106', '108', '110', '112', '115', '34'].includes(code)) return 'turn-left';
  if (['116', '36'].includes(code)) return 'speed-slow';
  if (['117', '28'].includes(code)) return 'speed-fast';
  if (code === '118') return 'speed-normal';
  if (['119', '120', '121', '122'].includes(code)) return 'cones';
  if (['13', '14', '15', '16', '26'].includes(code)) return 'front';
  if (code === '25') return 'steps';
  return null;
}

const errorsByKind: Record<ErrorKind, string[]> = {
  down: ['Sentar al perro antes de pedir el tumbado.', 'Perder la posición paralela junto al guía.', 'Levantarse o salir antes de reanudar la marcha.'],
  'sit-down': ['Omitir el sentado previo al tumbado.', 'Tumbarse antes de completar una posición de sentado clara.', 'Levantarse o salir antes de reanudar la marcha.'],
  around: ['Mover las patas mientras el guía rodea.', 'Abrir demasiado la trayectoria alrededor del perro.', 'Reanudar la marcha sin recuperar una posición estable.'],
  'turn-right': ['Abrir el giro y convertirlo en una curva.', 'Que perro y guía giren en momentos diferentes.', 'Terminar desalineados o en una dirección incorrecta.'],
  'turn-left': ['Cerrar el giro invadiendo el espacio del perro.', 'Perder la posición de junto durante el ajuste.', 'Salir del giro sin recuperar dirección y ritmo.'],
  'speed-slow': ['No hacer visible el cambio de ritmo.', 'Frenar de golpe y generar tensión.', 'Volver al paso normal antes de la siguiente señal.'],
  'speed-fast': ['Acelerar antes de que el perro acompañe.', 'Que el perro se adelante o se separe del junto.', 'Reducir el ritmo antes de la siguiente indicación.'],
  'speed-normal': ['Hacer una transición poco clara.', 'Cambiar la posición del perro al ajustar el ritmo.', 'Confundir paso normal con paso lento.'],
  cones: ['Entrar por el lado equivocado.', 'Alterar el orden o saltarse un cono.', 'Perder el lado de junto al cambiar de curvatura.'],
  front: ['Quedar sentado de frente pero descentrado.', 'Usar una trayectoria de regreso distinta de la indicada.', 'Omitir o añadir una parada final que no corresponde.'],
  steps: ['Contar un número incorrecto de pasos.', 'Que el perro anticipe la parada o el sentado.', 'Perder la alineación al encadenar los tramos.']
};

const errorsBySignal: Record<string, string[]> = {
  '201': ['Que el perro no complete el rodeo por detrás en cada media vuelta.', 'Avanzar menos de 1 m o más de 2 m entre las dos acciones.', 'No recuperar el junto o la dirección inicial.'],
  '202': ['Invertir el orden: primero derecha y después izquierda.', 'No avanzar entre 1 y 2 m antes del segundo giro.', 'Abrir los giros o no continuar en la dirección inicial.'],
  '203': ['Invertir el orden: primero izquierda y después derecha.', 'No avanzar entre 1 y 2 m antes del segundo giro.', 'Abrir los giros o no continuar en la dirección inicial.'],
  '204': ['Omitir o alterar la secuencia sentado-tumbado-sentado.', 'Anticipar una posición antes de completar la anterior.', 'Reanudar la marcha sin un sentado final estable.']
};

const genericErrors = ['Alterar el orden de movimientos o posiciones indicado.', 'Perder la posición de junto durante la ejecución.', 'Continuar sin completar una posición final estable.'];

const criteriaBySignal: Record<string, string[]> = {
  '201': ['Media vuelta hacia el lado del perro.', 'El perro rodea por detrás y recupera el junto.', 'Avanza entre 1 y 2 m, repite y sale en la dirección inicial.'],
  '202': ['Giro de 180° primero a la derecha.', 'Avanza entre 1 y 2 m antes del segundo giro.', 'Giro de 180° a la izquierda y salida en la dirección inicial.'],
  '203': ['Giro de 180° primero a la izquierda.', 'Avanza entre 1 y 2 m antes del segundo giro.', 'Giro de 180° a la derecha y salida en la dirección inicial.'],
  '204': ['Secuencia sentado-tumbado-sentado.', 'Cada posición se completa antes de pedir la siguiente.', 'Mantiene el sentado final hasta reanudar la marcha.']
};

export function trainingSignalCriteria(signal: SignalContent): string[] {
  return criteriaBySignal[signal.officialNumber] ?? signal.criteria;
}

export function commonSignalErrors(signal: SignalContent): string[] {
  const specific = errorsBySignal[signal.officialNumber];
  if (specific) return specific;
  const kind = errorKind(signal.officialNumber);
  return kind ? errorsByKind[kind] : genericErrors;
}
