import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearPendingTrainingSelection,
  loadPendingTrainingSelection,
  resolveTrainingSignalIds,
  savePendingTrainingSelection
} from './pendingTraining';

describe('pending training selection', () => {
  beforeEach(() => clearPendingTrainingSelection());

  it('recovers selected signals when the route loses its query parameters', () => {
    savePendingTrainingSelection({
      signalIds: ['rsce:national:13', 'fci:signal:101'],
      preferredSignal: null,
      preferredSide: null,
      location: 'home',
      sides: { 'rsce:national:13': 'left' }
    });

    const pending = loadPendingTrainingSelection();
    expect(resolveTrainingSignalIds([], pending)).toEqual(['rsce:national:13', 'fci:signal:101']);
    expect(pending?.sides['rsce:national:13']).toBe('left');
  });

  it('keeps valid route parameters as the primary source', () => {
    savePendingTrainingSelection({
      signalIds: ['rsce:national:13'],
      preferredSignal: null,
      preferredSide: null,
      location: null,
      sides: {}
    });

    expect(resolveTrainingSignalIds(['fci:signal:101'], loadPendingTrainingSelection())).toEqual(['fci:signal:101']);
  });

  it('discards expired or malformed recovery data', () => {
    savePendingTrainingSelection({
      signalIds: ['rsce:national:13'],
      preferredSignal: null,
      preferredSide: null,
      location: null,
      sides: {}
    });
    expect(loadPendingTrainingSelection(Date.now() + 60 * 60 * 1_000 + 1)).toBeNull();

    window.localStorage.setItem('rally-o-trainer:pending-training-selection:v1', '{not-json');
    expect(loadPendingTrainingSelection()).toBeNull();
  });
});
