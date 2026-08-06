import { describe, expect, it } from 'vitest';
import { getSignal } from './signals';
import { commonSignalErrors, trainingSignalCriteria } from './commonSignalErrors';

describe('common signal errors', () => {
  it('respects the required seated position before down in signal 102', () => {
    const errors = commonSignalErrors(getSignal('fci:signal:102'));
    expect(errors).toContain('Omitir el sentado previo al tumbado.');
    expect(errors).not.toContain('Sentar al perro antes de pedir el tumbado.');
  });

  it('uses the regulatory order and distance for signal 203', () => {
    const signal = getSignal('fci:signal:203');
    expect(trainingSignalCriteria(signal)).toEqual([
      'Giro de 180° primero a la izquierda.',
      'Avanza entre 1 y 2 m antes del segundo giro.',
      'Giro de 180° a la derecha y salida en la dirección inicial.'
    ]);
    expect(commonSignalErrors(signal)).toEqual([
      'Invertir el orden: primero izquierda y después derecha.',
      'No avanzar entre 1 y 2 m antes del segundo giro.',
      'Abrir los giros o no continuar en la dirección inicial.'
    ]);
  });
});
