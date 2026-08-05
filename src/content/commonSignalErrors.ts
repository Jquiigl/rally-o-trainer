import type { SignalContent } from '../domain/types';

type ErrorKind = 'down' | 'around' | 'turn-right' | 'turn-left' | 'speed-slow' | 'speed-fast' | 'speed-normal' | 'cones' | 'front' | 'steps';

function errorKind(code: string): ErrorKind {
  if (['101', '102', '104'].includes(code)) return 'down';
  if (['103', '35'].includes(code)) return 'around';
  if (['105', '107', '109', '111', '113', '114', '33'].includes(code)) return 'turn-right';
  if (['106', '108', '110', '112', '115', '34'].includes(code)) return 'turn-left';
  if (['116', '36'].includes(code)) return 'speed-slow';
  if (['117', '28'].includes(code)) return 'speed-fast';
  if (code === '118') return 'speed-normal';
  if (['119', '120', '121', '122'].includes(code)) return 'cones';
  if (['13', '14', '15', '16', '26'].includes(code)) return 'front';
  return 'steps';
}

const errorsByKind: Record<ErrorKind, string[]> = {
  down: ['Sentar al perro antes de pedir el tumbado.', 'Perder la posición paralela junto al guía.', 'Levantarse o salir antes de reanudar la marcha.'],
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

export function commonSignalErrors(signal: SignalContent): string[] {
  return errorsByKind[errorKind(signal.officialNumber)];
}
