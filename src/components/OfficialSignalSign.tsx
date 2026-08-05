import { getOfficialSignSource } from '../content/officialSigns';
import type { SignalContent } from '../domain/types';

export function OfficialSignalSign({ signal, compact = false, className = '' }: { signal: SignalContent; compact?: boolean; className?: string }) {
  const source = getOfficialSignSource(signal);
  return <figure className={`official-sign${compact ? ' official-sign--compact' : ''}${className ? ` ${className}` : ''}`}>
    <img src={source.imagePath} alt={`Señal oficial ${source.authority} ${signal.officialNumber}: ${signal.name}`} loading={compact ? 'lazy' : 'eager'} />
    {!compact && <figcaption><strong>Señal oficial {source.authority}</strong><span>{source.document} · página {source.page}</span></figcaption>}
  </figure>;
}
