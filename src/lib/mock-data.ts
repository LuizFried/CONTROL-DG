export interface RawRecord {
  id: string;
  character: string;
  player: string;
  count: number;
}

export const KNOWN_CHARACTERS = ['Soulreaper', 'Crash', 'Romero', 'Mardovik'] as const;
export const KNOWN_PILOTS = ['Hell', 'Velax', 'Beats', 'Tuzão'] as const;
export const MAX_DGS_PER_CHAR = 35;

export const MOCK_RECORDS: RawRecord[] = [
  // Soulreaper (ex: 28/35)
  { id: '1', character: 'Soulreaper', player: 'Hell', count: 12 },
  { id: '2', character: 'Soulreaper', player: 'Velax', count: 8 },
  { id: '3', character: 'Soulreaper', player: 'Beats', count: 5 },
  { id: '4', character: 'Soulreaper', player: 'Tuzão', count: 3 },

  // Crash (ex: 35/35 - Completo)
  { id: '5', character: 'Crash', player: 'Hell', count: 15 },
  { id: '6', character: 'Crash', player: 'Tuzão', count: 12 },
  { id: '7', character: 'Crash', player: 'Velax', count: 8 },

  // Romero (ex: 18/35)
  { id: '8', character: 'Romero', player: 'Beats', count: 10 },
  { id: '9', character: 'Romero', player: 'Hell', count: 8 },

  // Piratex (ex: 7/35)
  { id: '10', character: 'Mardovik', player: 'Velax', count: 4 },
  { id: '11', character: 'Mardovik', player: 'Tuzão', count: 3 },
];
