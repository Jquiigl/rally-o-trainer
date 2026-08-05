import type { SignalContent } from '../domain/types';

export type OfficialSignSource = {
  authority: 'FCI' | 'RSCE';
  document: string;
  page: number;
  imagePath: string;
};

const rscePages: Record<string, number> = {
  '13': 8, '14': 8, '15': 8, '16': 8, '25': 8, '26': 8, '28': 8,
  '33': 9, '34': 9, '35': 9, '36': 9
};

export function getOfficialSignSource(signal: SignalContent): OfficialSignSource {
  if (signal.id.startsWith('fci:signal:')) {
    const code = Number(signal.officialNumber);
    const page = code >= 401 ? code - 326 : code >= 301 ? code - 250 : code >= 201 ? code - 173 : code - 96;
    return {
      authority: 'FCI',
      document: 'Señales Rally Obedience FCI - español',
      page,
      imagePath: `${import.meta.env.BASE_URL}signals/fci/${signal.officialNumber}.webp`
    };
  }

  const page = rscePages[signal.officialNumber];
  if (!page) throw new Error(`No hay señal oficial RSCE para ${signal.id}`);
  return {
    authority: 'RSCE',
    document: 'Reglamento de Pruebas de Rally Obedience de la RSCE 2026',
    page,
    imagePath: `${import.meta.env.BASE_URL}signals/rsce/${signal.officialNumber}.webp`
  };
}
