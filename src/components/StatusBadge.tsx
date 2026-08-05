import { progressLabel } from '../domain/progress';
import type { ProgressState } from '../domain/types';

export function StatusBadge({ state }: { state: ProgressState }) {
  return <span className={`status status--${state}`}>{progressLabel(state)}</span>;
}
