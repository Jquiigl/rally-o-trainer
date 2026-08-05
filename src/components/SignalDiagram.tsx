import { useId } from 'react';
import type { SignalContent } from '../domain/types';

type DiagramKind = 'down' | 'around' | 'turn-right' | 'turn-left' | 'speed-slow' | 'speed-fast' | 'speed-normal' | 'cones' | 'front' | 'steps';

function diagramKind(code: string): DiagramKind {
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

function Handler({ x, y }: { x: number; y: number }) {
  return <g aria-hidden="true"><circle cx={x} cy={y - 22} r="11" className="diagram-handler" /><path d={`M${x} ${y - 10}v42m-18-26h36m-27 54 9-28 9 28`} className="diagram-handler-line" /></g>;
}

function Dog({ x, y, down = false }: { x: number; y: number; down?: boolean }) {
  return <g aria-hidden="true" transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy={down ? 8 : 0} rx={down ? 28 : 18} ry={down ? 10 : 25} className="diagram-dog" />
    <circle cx={down ? 25 : 0} cy={down ? 3 : -27} r="11" className="diagram-dog-head" />
    <path d={down ? 'M29-5l5-9 4 11m-18-7-2-9-6 8' : 'M-7-34l-3-10 9 7m8 3 5-10 4 11'} className="diagram-dog-line" />
    {!down && <path d="M-11 22v17m22-17v17" className="diagram-dog-line" />}
  </g>;
}

export function SignalDiagram({ signal, compact = false }: { signal: SignalContent; compact?: boolean }) {
  const markerId = `arrow-${useId().replaceAll(':', '')}`;
  const kind = diagramKind(signal.officialNumber);
  return <figure className={`signal-diagram${compact ? ' signal-diagram--compact' : ''}`}>
    <svg viewBox="0 0 320 190" role="img" aria-label={`Esquema propio. ${signal.plainExplanation}`}>
      <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0v6l7-3z" className="diagram-arrow-head" /></marker></defs>
      <rect x="3" y="3" width="314" height="184" rx="20" className="diagram-board" />
      <text x="20" y="34" className="diagram-code">{signal.officialNumber}</text>
      {kind === 'down' && <><Handler x={115} y={86} /><Dog x={180} y={112} down /><path d="M205 130h58" className="diagram-path" markerEnd={`url(#${markerId})`} /></>}
      {kind === 'around' && <><Dog x={160} y={105} /><path d="M98 117a66 60 0 1 1 113-54" className="diagram-path diagram-path--dash" markerEnd={`url(#${markerId})`} /><Handler x={96} y={95} /></>}
      {kind === 'turn-right' && <><Handler x={134} y={91} /><Dog x={190} y={110} /><path d="M105 143a76 62 0 1 0 74-101" className="diagram-path" markerEnd={`url(#${markerId})`} /><text x="244" y="120" className="diagram-direction">D</text></>}
      {kind === 'turn-left' && <><Handler x={186} y={91} /><Dog x={130} y={110} /><path d="M215 143a76 62 0 1 1-74-101" className="diagram-path" markerEnd={`url(#${markerId})`} /><text x="56" y="120" className="diagram-direction">I</text></>}
      {['speed-slow', 'speed-fast', 'speed-normal'].includes(kind) && <><Handler x={105} y={88} /><Dog x={160} y={108} /><path d="M190 110h82" className="diagram-path" markerEnd={`url(#${markerId})`} />{Array.from({ length: kind === 'speed-fast' ? 3 : kind === 'speed-normal' ? 2 : 1 }, (_, index) => <path key={index} d={`M${205 + index * 18} 78h12`} className="diagram-speed" />)}</>}
      {kind === 'cones' && <><path d="M76 135 112 58l48 77 48-77 38 77" className="diagram-path" markerEnd={`url(#${markerId})`} />{[92, 160, 228].map((x) => <path key={x} d={`M${x - 10} 137h20l-10-30z`} className="diagram-cone" />)}</>}
      {kind === 'front' && <><Handler x={160} y={105} /><Dog x={160} y={56} /><path d="M187 60c70 22 65 90 9 99" className="diagram-path diagram-path--dash" markerEnd={`url(#${markerId})`} /></>}
      {kind === 'steps' && <><Handler x={78} y={92} /><Dog x={125} y={111} /><path d="M153 111h120" className="diagram-path" markerEnd={`url(#${markerId})`} />{[1, 2, 3].map((step, index) => <g key={step}><circle cx={174 + index * 35} cy="145" r="13" className="diagram-step" /><text x={174 + index * 35} y="150" textAnchor="middle" className="diagram-step-text">{step}</text></g>)}</>}
    </svg>
    {!compact && <figcaption>Esquema propio de la ejecución · No reproduce la señal oficial</figcaption>}
  </figure>;
}

const errorsByKind: Record<DiagramKind, string[]> = {
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
  return errorsByKind[diagramKind(signal.officialNumber)];
}
