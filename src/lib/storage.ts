import { CandidatoId, VotoStats, TimelineStats, HourlyData } from "@/types";
import { sql, ensureTableExists } from "./db";

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

export async function hasFingerprintVoted(fp: string): Promise<boolean> {
  if (!fp || fp.length < 5) return false;
  await ensureTableExists();

  const rows = await sql`
    SELECT id FROM votos WHERE fingerprint = ${fp} LIMIT 1;
  `;

  return rows.length > 0;
}

export async function registerVote(
  voto: CandidatoId,
  fp: string
): Promise<{ success: boolean; duplicate?: boolean }> {
  await ensureTableExists();

  try {
    // Inserção atômica com trava de unicidade no PostgreSQL
    const inserted = await sql`
      INSERT INTO votos (candidato, fingerprint)
      VALUES (${voto}, ${fp})
      ON CONFLICT (fingerprint) DO NOTHING
      RETURNING id;
    `;

    if (inserted.length === 0) {
      return { success: false, duplicate: true };
    }

    return { success: true };
  } catch (err: any) {
    if (err?.code === "23505") {
      // Unique violation
      return { success: false, duplicate: true };
    }
    console.error("Erro ao inserir voto no Neon Postgres:", err);
    throw err;
  }
}

export async function getStats(): Promise<VotoStats> {
  await ensureTableExists();

  const rows = await sql`
    SELECT 
      COALESCE(COUNT(*) FILTER (WHERE candidato = '22'), 0)::int AS v22,
      COALESCE(COUNT(*) FILTER (WHERE candidato = '13'), 0)::int AS v13,
      COALESCE(COUNT(*) FILTER (WHERE candidato = 'BRANCO'), 0)::int AS brancos,
      COALESCE(COUNT(*) FILTER (WHERE candidato = 'NULO'), 0)::int AS nulos,
      COALESCE(COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '60 seconds'), 0)::int AS ultimos60s,
      COALESCE(COUNT(*), 0)::int AS total
    FROM votos;
  `;

  const row = rows[0] || { v22: 0, v13: 0, brancos: 0, nulos: 0, ultimos60s: 0, total: 0 };
  const v22 = Number(row.v22 || 0);
  const v13 = Number(row.v13 || 0);
  const brancos = Number(row.brancos || 0);
  const nulos = Number(row.nulos || 0);
  const ultimos60s = Number(row.ultimos60s || 0);
  const total = Number(row.total || 0);

  const validos = v22 + v13;

  const pct22Validos = validos > 0 ? (v22 / validos) * 100 : 0;
  const pct13Validos = validos > 0 ? (v13 / validos) * 100 : 0;

  const pct22Total = total > 0 ? (v22 / total) * 100 : 0;
  const pct13Total = total > 0 ? (v13 / total) * 100 : 0;
  const pctBrancosTotal = total > 0 ? (brancos / total) * 100 : 0;
  const pctNulosTotal = total > 0 ? (nulos / total) * 100 : 0;

  return {
    total,
    validos,
    candidato22: v22,
    candidato13: v13,
    brancos,
    nulos,
    ultimos60s,
    pct22Validos: Number(pct22Validos.toFixed(1)),
    pct13Validos: Number(pct13Validos.toFixed(1)),
    pct22Total: Number(pct22Total.toFixed(1)),
    pct13Total: Number(pct13Total.toFixed(1)),
    pctBrancosTotal: Number(pctBrancosTotal.toFixed(1)),
    pctNulosTotal: Number(pctNulosTotal.toFixed(1)),
    timestamp: Date.now(),
  };
}

export async function getTimelineStats(): Promise<TimelineStats> {
  await ensureTableExists();

  const rows = await sql`
    SELECT 
      TO_CHAR(created_at, 'HH24"h"') AS hora,
      TO_CHAR(created_at, 'DD/MM') AS data,
      COALESCE(COUNT(*) FILTER (WHERE candidato = '22'), 0)::int AS votos22,
      COALESCE(COUNT(*) FILTER (WHERE candidato = '13'), 0)::int AS votos13,
      COUNT(*)::int AS total_hora
    FROM votos
    GROUP BY TO_CHAR(created_at, 'DD/MM'), TO_CHAR(created_at, 'HH24"h"')
    ORDER BY MIN(created_at) ASC;
  `;

  let horas: HourlyData[] = rows.map((r) => ({
    hora: r.hora,
    data: r.data,
    votos22: Number(r.votos22 || 0),
    votos13: Number(r.votos13 || 0),
    totalHora: Number(r.total_hora || 0),
  }));

  if (horas.length === 0) {
    horas = [
      {
        hora: getCurrentHourSlot(),
        data: getCurrentDateSlot(),
        votos22: 0,
        votos13: 0,
        totalHora: 0,
      },
    ];
  }

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
