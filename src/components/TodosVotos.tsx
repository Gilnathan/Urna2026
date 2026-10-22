"use client";

import React from "react";
import { VotoStats } from "@/types";

interface TodosVotosProps {
  stats: VotoStats | null;
}

export function TodosVotos({ stats }: TodosVotosProps) {
  const formatNumber = (num: number) => num.toLocaleString("pt-BR");

  const rows = stats ? [
    {
      badge: "22",
      badgeBg: "bg-[#1d4ed8]",
      badgeText: "text-white",
      nome: "Flávio Bolsonaro",
      partido: "PL",
      pct: stats.pct22Total,
      votos: stats.candidato22,
      barBg: "bg-[#1d4ed8]",
    },
    {
      badge: "13",
      badgeBg: "bg-[#dc2626]",
      badgeText: "text-white",
      nome: "Lula",
      partido: "PT",
      pct: stats.pct13Total,
      votos: stats.candidato13,
      barBg: "bg-[#dc2626]",
    },
    {
      badge: "B",
      badgeBg: "bg-[#64748b]",
      badgeText: "text-white",
      nome: "Brancos",
      partido: "",
      pct: stats.pctBrancosTotal,
      votos: stats.brancos,
      barBg: "bg-[#94a3b8]",
    },
    {
      badge: "N",
      badgeBg: "bg-[#334155]",
      badgeText: "text-white",
      nome: "Nulos",
      partido: "",
      pct: stats.pctNulosTotal,
      votos: stats.nulos,
      barBg: "bg-[#475569]",
    },
  ] : [];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-4">
        TODOS OS VOTOS
      </h3>

      {!stats ? (
        <div className="py-6 text-center text-sm font-semibold text-slate-500 animate-pulse" role="status" aria-live="polite" aria-busy="true">
          Carregando votos computados...
        </div>
      ) : (
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.nome} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`${row.badgeBg} ${row.badgeText} text-[10px] font-black px-1.5 py-0.5 rounded min-w-[24px] text-center`}
                >
                  {row.badge}
                </span>
                <span className="font-bold text-slate-900">{row.nome}</span>
                {row.partido && (
                  <span className="text-slate-400 text-xs font-normal">
                    {row.partido}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-black text-slate-900 text-sm sm:text-base">
                  {row.pct.toFixed(1).replace(".", ",")}%
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatNumber(row.votos)} votos
                </span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`${row.barBg} h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, Math.max(0.5, row.pct))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Avisos e Rodapé da Seção */}
      <div className="mt-5 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
        <p>
          Placar ao vivo, atualizado a cada 10 segundos. <strong>Um voto por IP.</strong> O IP é transformado em um código anônimo e salvo no banco para impedir votos repetidos.
        </p>
        <p className="text-slate-400">
          Brincadeira / interativa. Não é pesquisa eleitoral, não tem registro no TSE e não tem valor estatístico.
        </p>
      </div>
    </div>
  );
}
