"use client";

import React from "react";
import Image from "next/image";
import { VotoStats } from "@/types";

interface PlacarAoVivoProps {
  stats: VotoStats;
}

export function PlacarAoVivo({ stats }: PlacarAoVivoProps) {
  const formatNumber = (num: number) => num.toLocaleString("pt-BR");

  const hasValidos = stats.validos > 0;
  const bar22Width = hasValidos ? stats.pct22Validos : 50;
  const bar13Width = hasValidos ? stats.pct13Validos : 50;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-6">
      {/* Top Banner Azul Escuro */}
      <div className="bg-[#0b2b64] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-sm sm:text-base font-extrabold tracking-wide uppercase">
            APURAÇÃO • AO VIVO
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono font-bold text-sm sm:text-base tracking-tight">
            {formatNumber(stats.total)}
          </span>
          <span className="text-[11px] text-slate-300 ml-1">votos computados</span>
        </div>
      </div>

      {/* Indicador de votos recentes */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-1.5 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="font-semibold">{formatNumber(stats.ultimos5min)}</span>
        <span>votos nos últimos 5 minutos</span>
      </div>

      {/* Confronto Direto dos Candidatos */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 items-center gap-3 sm:gap-6">
          {/* Candidato 22: Flávio Bolsonaro */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded border border-slate-300 overflow-hidden shrink-0 bg-slate-100 shadow-sm">
              <Image
                src="/candidates/22.jpg"
                alt="Flávio Bolsonaro"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-[#1d4ed8] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                  22
                </span>
                <span className="text-xs text-slate-500 font-medium">PL</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                Flávio Bolsonaro
              </h3>
              <div className="text-2xl sm:text-4xl font-extrabold text-[#1d4ed8] mt-1 tracking-tight">
                {hasValidos ? `${stats.pct22Validos.toFixed(1).replace(".", ",")}%` : "0,0%"}
              </div>
            </div>
          </div>

          {/* Candidato 13: Lula */}
          <div className="flex items-center justify-end gap-3 text-right">
            <div className="min-w-0">
              <div className="flex items-center justify-end gap-1.5 mb-0.5">
                <span className="text-xs text-slate-500 font-medium">PT</span>
                <span className="bg-[#dc2626] text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                  13
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                Lula
              </h3>
              <div className="text-2xl sm:text-4xl font-extrabold text-[#dc2626] mt-1 tracking-tight">
                {hasValidos ? `${stats.pct13Validos.toFixed(1).replace(".", ",")}%` : "0,0%"}
              </div>
            </div>
            <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded border border-slate-300 overflow-hidden shrink-0 bg-slate-100 shadow-sm">
              <Image
                src="/candidates/13.jpg"
                alt="Lula"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>

        {/* Barra de Progresso Dividida */}
        <div className="mt-4">
          <div className="w-full h-3 sm:h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
            <div
              className={`${hasValidos ? "bg-[#1d4ed8]" : "bg-slate-300"} h-full transition-all duration-700 ease-out`}
              style={{ width: `${bar22Width}%` }}
              title={`Flávio Bolsonaro: ${hasValidos ? stats.pct22Validos : 0}%`}
            />
            <div
              className={`${hasValidos ? "bg-[#dc2626]" : "bg-slate-300"} h-full transition-all duration-700 ease-out`}
              style={{ width: `${bar13Width}%` }}
              title={`Lula: ${hasValidos ? stats.pct13Validos : 0}%`}
            />
          </div>
          <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
            Percentual de votos válidos, sem brancos e nulos, como o TSE calcula o resultado.
          </p>
        </div>
      </div>
    </div>
  );
}
