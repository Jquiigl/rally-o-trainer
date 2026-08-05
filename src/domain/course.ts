export function validateCourseSignals(signalIds: string[]): string | null {
  if (signalIds.length < 1) return 'Añade al menos una señal.';
  if (signalIds.length > 10) return 'Este incremento admite un máximo de 10 señales.';
  const counts = new Map<string, number>();
  for (const signalId of signalIds) counts.set(signalId, (counts.get(signalId) ?? 0) + 1);
  if ([...counts.values()].some((count) => count > 2)) return 'Una señal puede aparecer como máximo dos veces.';
  return null;
}
