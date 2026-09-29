export interface PilotRun {
  pilotName: string;
  count: number;
}

export interface CharacterProgress {
  name: string;
  totalDgs: number;
  maxDgs: number;
  remaining: number;
  percentage: number;
  pilots: PilotRun[];
}

export interface SimpleDashboardData {
  isMock: boolean;
  totalDgs: number;
  maxTotalDgs: number;
  characters: CharacterProgress[];
  lastUpdated: string;
}
