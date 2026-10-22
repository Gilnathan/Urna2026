import { CandidatoId, VotoStats, TimelineStats, HourlyData } from "@/types";

// Início oficial: contagens zeradas
const INITIAL_STATS = {
  candidato22: 0,
  candidato13: 0,
  brancos: 0,
  nulos: 0,
  ultimos5min: 0,
};

function getCurrentHourSlot(): string {
  const d = new Date();
  const hora = String(d.getHours()).padStart(2, "0") + "h";
  return hora;
}

function getCurrentDateSlot(): string {
  const d = new Date();
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}`;
}

// In-Memory store serverless com custo ZERO
interface GlobalStore {
  votos22: number;
  votos13: number;
  brancos: number;
  nulos: number;
  ultimos5min: number;
  fingerprints: Set<string>;
  hourlyMap: Map<string, { votos22: number; votos13: number; totalHora: number; hora: string; data: string }>;
  last5MinVotes: number[];
}

declare global {
  // eslint-disable-next-line no-var
  var __URNA_STORE__: GlobalStore | undefined;
}

if (!globalThis.__URNA_STORE__) {
  const initialMap = new Map<string, { votos22: number; votos13: number; totalHora: number; hora: string; data: string }>();
  const currentKey = `${getCurrentDateSlot()} - ${getCurrentHourSlot()}`;
  initialMap.set(currentKey, {
    hora: getCurrentHourSlot(),
    data: getCurrentDateSlot(),
    votos22: 0,
    votos13: 0,
    totalHora: 0,
  });

  globalThis.__URNA_STORE__ = {
    votos22: INITIAL_STATS.candidato22,
    votos13: INITIAL_STATS.candidato13,
    brancos: INITIAL_STATS.brancos,
    nulos: INITIAL_STATS.nulos,
    ultimos5min: INITIAL_STATS.ultimos5min,
    fingerprints: new Set<string>(),
    hourlyMap: initialMap,
    last5MinVotes: [],
  };
}

const store = globalThis.__URNA_STORE__;

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function executeKv(command: string[]): Promise<any> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(`${KV_URL}/${command.join("/")}`, {
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch (err) {
    console.error("KV Error:", err);
    return null;
  }
}

export async function hasFingerprintVoted(fp: string): Promise<boolean> {
  if (!fp || fp.length < 5) return false;

  if (KV_URL && KV_TOKEN) {
    const isMember = await executeKv(["SISMEMBER", "urna:fps", encodeURIComponent(fp)]);
    if (isMember === 1) return true;
  }

  return store.fingerprints.has(fp);
}

export async function registerVote(voto: CandidatoId, fp: string): Promise<{ success: boolean; duplicate?: boolean }> {
  // Verificar duplicidade
  const already = await hasFingerprintVoted(fp);
  if (already) {
    return { success: false, duplicate: true };
  }

  // Registrar em KV gratuito da Vercel se configurado
  if (KV_URL && KV_TOKEN) {
    const added = await executeKv(["SADD", "urna:fps", encodeURIComponent(fp)]);
    if (added === 0) {
      return { success: false, duplicate: true };
    }

    if (voto === "22") await executeKv(["INCRBY", "urna:votos:22", "1"]);
    else if (voto === "13") await executeKv(["INCRBY", "urna:votos:13", "1"]);
    else if (voto === "BRANCO") await executeKv(["INCRBY", "urna:votos:branco", "1"]);
    else if (voto === "NULO") await executeKv(["INCRBY", "urna:votos:nulo", "1"]);
  }

  // Atualiza Store em memória
  store.fingerprints.add(fp);
  if (voto === "22") store.votos22 += 1;
  else if (voto === "13") store.votos13 += 1;
  else if (voto === "BRANCO") store.brancos += 1;
  else if (voto === "NULO") store.nulos += 1;

  // Atualiza janela móvel de votos nos últimos 5 min
  const now = Date.now();
  store.last5MinVotes.push(now);
  const fiveMinAgo = now - 5 * 60 * 1000;
  store.last5MinVotes = store.last5MinVotes.filter((t) => t >= fiveMinAgo);
  store.ultimos5min = store.last5MinVotes.length;

  // Atualiza bucket por hora
  const hourKey = `${getCurrentDateSlot()} - ${getCurrentHourSlot()}`;
  let bucket = store.hourlyMap.get(hourKey);
  if (!bucket) {
    bucket = {
      hora: getCurrentHourSlot(),
      data: getCurrentDateSlot(),
      votos22: 0,
      votos13: 0,
      totalHora: 0,
    };
    store.hourlyMap.set(hourKey, bucket);
  }

  if (voto === "22") bucket.votos22 += 1;
  if (voto === "13") bucket.votos13 += 1;
  bucket.totalHora += 1;

  return { success: true };
}

export async function getStats(): Promise<VotoStats> {
  let v22 = store.votos22;
  let v13 = store.votos13;
  let br = store.brancos;
  let nu = store.nulos;

  if (KV_URL && KV_TOKEN) {
    const [kv22, kv13, kvBr, kvNu] = await Promise.all([
      executeKv(["GET", "urna:votos:22"]),
      executeKv(["GET", "urna:votos:13"]),
      executeKv(["GET", "urna:votos:branco"]),
      executeKv(["GET", "urna:votos:nulo"]),
    ]);

    if (kv22 !== null) v22 = parseInt(kv22 || "0", 10);
    if (kv13 !== null) v13 = parseInt(kv13 || "0", 10);
    if (kvBr !== null) br = parseInt(kvBr || "0", 10);
    if (kvNu !== null) nu = parseInt(kvNu || "0", 10);
  }

  // Limpa janela dos 5 min
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;
  store.last5MinVotes = store.last5MinVotes.filter((t) => t >= fiveMinAgo);
  store.ultimos5min = store.last5MinVotes.length;

  const validos = v22 + v13;
  const total = validos + br + nu;

  const pct22Validos = validos > 0 ? (v22 / validos) * 100 : 0;
  const pct13Validos = validos > 0 ? (v13 / validos) * 100 : 0;

  const pct22Total = total > 0 ? (v22 / total) * 100 : 0;
  const pct13Total = total > 0 ? (v13 / total) * 100 : 0;
  const pctBrancosTotal = total > 0 ? (br / total) * 100 : 0;
  const pctNulosTotal = total > 0 ? (nu / total) * 100 : 0;

  return {
    total,
    validos,
    candidato22: v22,
    candidato13: v13,
    brancos: br,
    nulos: nu,
    ultimos5min: store.ultimos5min,
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
  const horas: HourlyData[] = Array.from(store.hourlyMap.values());
  let vitorias22 = 0;
  let vitorias13 = 0;

  let max22 = { votos: 0, periodo: "Nenhum voto ainda" };
  let max13 = { votos: 0, periodo: "Nenhum voto ainda" };
  let maxHora = { votos: 0, periodo: "Nenhum voto ainda" };

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
