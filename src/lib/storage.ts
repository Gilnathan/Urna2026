import { CandidatoId, VotoStats, TimelineStats, HourlyData } from "@/types";
import { put, head } from "@vercel/blob";

const BLOB_FILE_NAME = "votes_state.json";

function getCurrentHourSlot(): string {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + "h";
}

function getCurrentDateSlot(): string {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

export interface PersistentData {
  votos22: number;
  votos13: number;
  brancos: number;
  nulos: number;
  fingerprints: string[];
  hourly: HourlyData[];
  last5MinVotes: number[];
  lastUpdated: number;
}

const DEFAULT_STATE: PersistentData = {
  votos22: 0,
  votos13: 0,
  brancos: 0,
  nulos: 0,
  fingerprints: [],
  hourly: [
    {
      hora: getCurrentHourSlot(),
      data: getCurrentDateSlot(),
      votos22: 0,
      votos13: 0,
      totalHora: 0,
    },
  ],
  last5MinVotes: [],
  lastUpdated: Date.now(),
};

// In-Memory cache para evitar requisições desnecessárias
let memoryState: PersistentData = { ...DEFAULT_STATE };
let memoryLoaded = false;
let blobUrl: string | null = null;

async function loadState(): Promise<PersistentData> {
  // Tenta ler do Vercel Blob se o token estiver presente
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      if (!blobUrl) {
        const blobDetails = await head(BLOB_FILE_NAME).catch(() => null);
        if (blobDetails?.url) {
          blobUrl = blobDetails.url;
        }
      }

      if (blobUrl) {
        const res = await fetch(`${blobUrl}?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const remoteData: PersistentData = await res.json();
          memoryState = remoteData;
          memoryLoaded = true;
          return memoryState;
        }
      }
    } catch (err) {
      console.warn("Aviso ao carregar do Vercel Blob:", err);
    }
  }

  return memoryState;
}

async function persistState(data: PersistentData): Promise<void> {
  memoryState = data;
  memoryLoaded = true;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(BLOB_FILE_NAME, JSON.stringify(data), {
        access: "public",
        addRandomSuffix: false,
      });
      blobUrl = blob.url;
    } catch (err) {
      console.error("Erro ao persistir no Vercel Blob:", err);
    }
  }
}

export async function hasFingerprintVoted(fp: string): Promise<boolean> {
  if (!fp || fp.length < 5) return false;
  const state = await loadState();
  return state.fingerprints.includes(fp);
}

export async function registerVote(
  voto: CandidatoId,
  fp: string
): Promise<{ success: boolean; duplicate?: boolean }> {
  const state = await loadState();

  // Verifica duplicidade
  if (state.fingerprints.includes(fp)) {
    return { success: false, duplicate: true };
  }

  // Incrementa contagem
  if (voto === "22") state.votos22 += 1;
  else if (voto === "13") state.votos13 += 1;
  else if (voto === "BRANCO") state.brancos += 1;
  else if (voto === "NULO") state.nulos += 1;

  state.fingerprints.push(fp);

  // Janela móvel de votos nos últimos 5 min
  const now = Date.now();
  state.last5MinVotes.push(now);
  const fiveMinAgo = now - 5 * 60 * 1000;
  state.last5MinVotes = state.last5MinVotes.filter((t) => t >= fiveMinAgo);

  // Registro de linha do tempo por hora
  const currentHora = getCurrentHourSlot();
  const currentData = getCurrentDateSlot();
  let hourSlot = state.hourly.find((h) => h.hora === currentHora && h.data === currentData);

  if (!hourSlot) {
    hourSlot = {
      hora: currentHora,
      data: currentData,
      votos22: 0,
      votos13: 0,
      totalHora: 0,
    };
    state.hourly.push(hourSlot);
  }

  if (voto === "22") hourSlot.votos22 += 1;
  if (voto === "13") hourSlot.votos13 += 1;
  hourSlot.totalHora += 1;

  state.lastUpdated = now;

  // Salva no Vercel Blob
  await persistState(state);

  return { success: true };
}

export async function getStats(): Promise<VotoStats> {
  const state = await loadState();

  // Limpa janela de 5 min
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;
  const ultimos5min = state.last5MinVotes.filter((t) => t >= fiveMinAgo).length;

  const validos = state.votos22 + state.votos13;
  const total = validos + state.brancos + state.nulos;

  const pct22Validos = validos > 0 ? (state.votos22 / validos) * 100 : 0;
  const pct13Validos = validos > 0 ? (state.votos13 / validos) * 100 : 0;

  const pct22Total = total > 0 ? (state.votos22 / total) * 100 : 0;
  const pct13Total = total > 0 ? (state.votos13 / total) * 100 : 0;
  const pctBrancosTotal = total > 0 ? (state.brancos / total) * 100 : 0;
  const pctNulosTotal = total > 0 ? (state.nulos / total) * 100 : 0;

  return {
    total,
    validos,
    candidato22: state.votos22,
    candidato13: state.votos13,
    brancos: state.brancos,
    nulos: state.nulos,
    ultimos5min,
    pct22Validos: Number(pct22Validos.toFixed(1)),
    pct13Validos: Number(pct13Validos.toFixed(1)),
    pct22Total: Number(pct22Total.toFixed(1)),
    pct13Total: Number(pct13Total.toFixed(1)),
    pctBrancosTotal: Number(pctBrancosTotal.toFixed(1)),
    pctNulosTotal: Number(pctNulosTotal.toFixed(1)),
    timestamp: now,
  };
}

export async function getTimelineStats(): Promise<TimelineStats> {
  const state = await loadState();
  const horas = state.hourly;

  let vitorias22 = 0;
  let vitorias13 = 0;
  let max22 = { votos: 0, periodo: "Aguardando votos" };
  let max13 = { votos: 0, periodo: "Aguardando votos" };
  let maxHora = { votos: 0, periodo: "Aguardando votos" };

  horas.forEach((h) => {
    if (h.votos22 > max22.votos) {
      max22 = { votos: h.votos22, periodo: `${h.data} - ${h.hora}` };
    }
    if (h.votos13 > max13.votos) {
      max13 = { votos: h.votos13, periodo: `${h.data} - ${h.hora}` };
    }
    if (h.totalHora > maxHora.votos) {
      maxHora = { votos: h.totalHora, periodo: `${h.data} - ${h.hora}` };
    }
    if (h.votos22 > h.votos13) {
      vitorias22 += 1;
    } else if (h.votos13 > h.votos22) {
      vitorias13 += 1;
    }
  });

  return {
    pico22: max22,
    pico13: max13,
    horaMaisMovimentada: maxHora,
    horasVencidas22: vitorias22,
    horasVencidas13: vitorias13,
    historicoHoras: horas,
  };
}

// Função de reset oficial se necessário
export async function resetDatabase(): Promise<void> {
  await persistState({ ...DEFAULT_STATE, lastUpdated: Date.now() });
}
