import packageData from '../../Contenido/published-signals.es.json';
import type { SignalContent } from '../domain/types';

export const CONTENT_PACKAGE_ID = packageData.packageId;
export const CONTENT_PACKAGE_VERSION = packageData.packageVersion;
export const signals = packageData.signals as SignalContent[];

export const signalById = new Map(signals.map((signal) => [signal.id, signal]));

export function getSignal(signalId: string): SignalContent {
  const signal = signalById.get(signalId);
  if (!signal) throw new Error(`Señal desconocida: ${signalId}`);
  return signal;
}
