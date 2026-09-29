import { CharacterProgress, SimpleDashboardData, PilotRun } from '../types/dungeon';
import { KNOWN_CHARACTERS, KNOWN_PILOTS, MAX_DGS_PER_CHAR, MOCK_RECORDS, RawRecord } from './mock-data';

interface AirtableRawRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableApiResponse {
  records: AirtableRawRecord[];
  offset?: string;
}

function getFieldValue(fields: Record<string, unknown>, possibleKeys: string[]): unknown {
  const normalizedKeys = Object.keys(fields).map((k) => ({
    original: k,
    normalized: k.toLowerCase().replace(/[^a-z0-9]/g, ''),
  }));

  for (const key of possibleKeys) {
    const targetNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const match = normalizedKeys.find((k) => k.normalized === targetNorm);
    if (match && fields[match.original] !== undefined && fields[match.original] !== null) {
      return fields[match.original];
    }
  }
  return undefined;
}

function parseRecord(record: AirtableRawRecord): RawRecord | null {
  const f = record.fields;

  // Personagem
  const rawChar = getFieldValue(f, ['Personagem', 'Character', 'Nome', 'Char']);
  let character = '';
  if (typeof rawChar === 'string') character = rawChar.trim();
  else if (Array.isArray(rawChar) && rawChar.length > 0) character = String(rawChar[0]).trim();

  // Quem Fez
  const rawPlayer = getFieldValue(f, ['Quem Fez', 'Jogador', 'Piloto', 'Player', 'Feito Por']);
  let player = '';
  if (typeof rawPlayer === 'string') player = rawPlayer.trim();
  else if (Array.isArray(rawPlayer) && rawPlayer.length > 0) player = String(rawPlayer[0]).trim();

  // Se a linha estiver totalmente vazia no Airtable (linhas em branco padrão), ignora
  if (!character && !player) {
    return null;
  }

  // Quantidade
  const rawCount = getFieldValue(f, ['Quantidade', 'Qtd', 'DGs', 'Quantidade de DGs', 'Count', 'Runs']);
  let count = 1;
  if (typeof rawCount === 'number') count = rawCount;
  else if (typeof rawCount === 'string') {
    const parsed = parseInt(rawCount, 10);
    if (!isNaN(parsed) && parsed > 0) count = parsed;
  }

  return {
    id: record.id,
    character: character || 'Outro',
    player: player || 'Desconhecido',
    count: Math.max(1, count),
  };
}

// Normaliza o nome para bater mesmo com maiúsculas/minúsculas diferentes ou sem acento (ex: Tuzao x Tuzão)
function findMatchingKnown(name: string, knownList: readonly string[]): string {
  const strip = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const clean = strip(name);
  for (const k of knownList) {
    if (strip(k) === clean) return k;
  }
  return name.trim();
}

export function aggregateData(records: RawRecord[], isMock: boolean): SimpleDashboardData {
  // Inicializa mapa para os 4 personagens principais
  const charMap = new Map<string, Map<string, number>>();

  for (const charName of KNOWN_CHARACTERS) {
    const pilotMap = new Map<string, number>();
    for (const pilot of KNOWN_PILOTS) {
      pilotMap.set(pilot, 0);
    }
    charMap.set(charName, pilotMap);
  }

  // Processa todos os registros
  for (const record of records) {
    const matchedChar = findMatchingKnown(record.character, KNOWN_CHARACTERS);
    const matchedPilot = findMatchingKnown(record.player, KNOWN_PILOTS);

    if (!charMap.has(matchedChar)) {
      const pilotMap = new Map<string, number>();
      for (const pilot of KNOWN_PILOTS) {
        pilotMap.set(pilot, 0);
      }
      charMap.set(matchedChar, pilotMap);
    }

    const pilotMap = charMap.get(matchedChar)!;
    const currentCount = pilotMap.get(matchedPilot) || 0;
    pilotMap.set(matchedPilot, currentCount + record.count);
  }

  // Constrói lista de CharacterProgress
  const characters: CharacterProgress[] = [];
  let totalDgsGlobal = 0;

  // Garante a ordem dos 4 personagens solicitados
  const allCharNames = Array.from(charMap.keys());
  const orderedNames = [
    ...KNOWN_CHARACTERS.filter((c) => allCharNames.includes(c)),
    ...allCharNames.filter((c) => !KNOWN_CHARACTERS.includes(c as typeof KNOWN_CHARACTERS[number])),
  ];

  for (const name of orderedNames) {
    const pilotMap = charMap.get(name)!;
    let charTotal = 0;

    const pilots: PilotRun[] = [];

    // Primeiro adiciona os 4 pilotos conhecidos
    for (const knownPilot of KNOWN_PILOTS) {
      const count = pilotMap.get(knownPilot) || 0;
      charTotal += count;
      pilots.push({ pilotName: knownPilot, count });
    }

    // Depois qualquer outro piloto extra encontrado
    for (const [pName, count] of pilotMap.entries()) {
      if (!KNOWN_PILOTS.includes(pName as typeof KNOWN_PILOTS[number])) {
        charTotal += count;
        pilots.push({ pilotName: pName, count });
      }
    }

    totalDgsGlobal += charTotal;

    characters.push({
      name,
      totalDgs: charTotal,
      maxDgs: MAX_DGS_PER_CHAR,
      remaining: Math.max(0, MAX_DGS_PER_CHAR - charTotal),
      percentage: Math.min(100, Math.round((charTotal / MAX_DGS_PER_CHAR) * 100)),
      pilots,
    });
  }

  return {
    isMock,
    totalDgs: totalDgsGlobal,
    maxTotalDgs: characters.length * MAX_DGS_PER_CHAR,
    characters,
    lastUpdated: new Date().toISOString(),
  };
}

export async function fetchSimpleDashboardData(): Promise<SimpleDashboardData> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'DGs';

  if (!apiKey || !baseId) {
    return aggregateData(MOCK_RECORDS, true);
  }

  try {
    const allRecords: RawRecord[] = [];
    let offset: string | undefined = undefined;

    do {
      const url = new URL(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`);
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Sempre busca os dados mais recentes do Airtable em tempo real
      });

      if (!response.ok) {
        throw new Error(`Airtable API retornou erro ${response.status}`);
      }

      const data = (await response.json()) as AirtableApiResponse;
      if (Array.isArray(data.records)) {
        for (const raw of data.records) {
          const parsed = parseRecord(raw);
          if (parsed) {
            allRecords.push(parsed);
          }
        }
      }
      offset = data.offset;
    } while (offset);

    return aggregateData(allRecords, false);
  } catch (err) {
    console.error('Erro na API do Airtable, usando mock:', err);
    return aggregateData(MOCK_RECORDS, true);
  }
}
