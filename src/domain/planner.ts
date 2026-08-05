import type { Evidence, Location, ProgressResult, SignalContent, Side } from './types';
import { calculateProgress } from './progress';

export type Recommendation = {
  signal: SignalContent;
  side: Side;
  progress: ProgressResult;
  score: number;
  reason: string;
};

export function recommendSignals(
  availableSignals: SignalContent[],
  evidence: Evidence[],
  location: Location,
  now = Date.now(),
  availableMaterialIds?: string[]
): Recommendation[] {
  return availableSignals
    .filter((signal) => signal.locations.includes(location))
    .filter((signal) => !availableMaterialIds || signal.materials.every((material) =>
      !material.requiredForFinalExecution || availableMaterialIds.includes(material.id)))
    .flatMap((signal) => {
      const sides: Side[] = signal.trainingSideMode === 'both' ? ['left', 'right'] :
        signal.trainingSideMode === 'left-only' ? ['left'] :
        signal.trainingSideMode === 'right-only' ? ['right'] : ['not-applicable'];
      return sides.flatMap((side) => {
        const prerequisitesReady = signal.prerequisiteSignalIds.every((prerequisiteId) => {
          const prerequisite = availableSignals.find((candidate) => candidate.id === prerequisiteId);
          if (!prerequisite) return false;
          const prerequisiteSide: Side = prerequisite.trainingSideMode === 'not-applicable' ? 'not-applicable' :
            prerequisite.trainingSideMode === 'right-only' ? 'right' : prerequisite.trainingSideMode === 'left-only' ? 'left' : side;
          const prerequisiteProgress = calculateProgress(
            evidence.filter((item) => item.signalId === prerequisite.id && item.compatibilityKey === prerequisite.progressCompatibilityKey),
            prerequisiteSide,
            now
          );
          return prerequisiteProgress.state === 'learned' || prerequisiteProgress.state === 'consolidated';
        });
        if (!prerequisitesReady) return [];
        const progress = calculateProgress(
          evidence.filter((item) => item.signalId === signal.id && item.compatibilityKey === signal.progressCompatibilityKey),
          side,
          now
        );
        const due = progress.nextReviewAt !== null && progress.nextReviewAt <= now;
        const stateScore = progress.state === 'needs-review' ? 100 :
          progress.state === 'in-progress' ? (due ? 85 : 72) :
          progress.state === 'not-started' ? 60 :
          progress.state === 'learned' ? (due ? 78 : 32) : (due ? 52 : 12);
        const noSpecialMaterial = signal.materials.every((material) => !material.requiredForFinalExecution) ? 15 : 0;
        const score = stateScore + 20 + noSpecialMaterial;
        const reason = progress.state === 'needs-review' ? 'Toca repasarla por la evidencia reciente.' :
          progress.state === 'in-progress' ? `Sigue construyendo autonomía en el lado ${side === 'left' ? 'izquierdo' : 'derecho'}.` :
          progress.state === 'not-started' ? 'Es un siguiente paso disponible en este lugar.' :
          progress.state === 'learned' ? (due ? 'Toca una comprobación para consolidarla.' : 'Está aprendida y su próximo repaso aún no vence.') :
          due ? 'Toca un mantenimiento breve.' : 'Está consolidada; aparece como alternativa de mantenimiento.';
        return [{ signal, side, progress, score, reason }];
      });
    })
    .sort((a, b) => b.score - a.score || (a.progress.lastPracticedAt ?? 0) - (b.progress.lastPracticedAt ?? 0) ||
      a.signal.id.localeCompare(b.signal.id) || a.side.localeCompare(b.side));
}
