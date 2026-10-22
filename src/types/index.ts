export type CandidatoId = "22" | "13" | "BRANCO" | "NULO";

export interface CandidatoInfo {
  numero: string;
  nome: string;
  partido: string;
  vice: string;
  foto: string;
  cor: string;
}

export interface VotoStats {
  total: number;
  validos: number;
  candidato22: number;
  candidato13: number;
  brancos: number;
  nulos: number;
  ultimos60s: number;
  pct22Validos: number;
  pct13Validos: number;
  pct22Total: number;
  pct13Total: number;
  pctBrancosTotal: number;
  pctNulosTotal: number;
  timestamp: number;
}

export interface HourlyData {
  hora: string;
  data: string;
  votos22: number;
  votos13: number;
  totalHora: number;
}

export interface TimelineStats {
  pico22: { votos: number; periodo: string };
  pico13: { votos: number; periodo: string };
  horaMaisMovimentada: { votos: number; periodo: string };
  horasVencidas22: number;
  horasVencidas13: number;
  historicoHoras: HourlyData[];
}

export interface VotePayload {
  voto: CandidatoId;
}

export interface VoteResult {
  success: boolean;
  message: string;
  stats?: VotoStats;
  alreadyVoted?: boolean;
}
