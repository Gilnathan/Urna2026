"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TimelineStats } from "@/types";

interface LinhaDoTempoProps {
  timeline: TimelineStats;
}

export function LinhaDoTempo({ timeline }: LinhaDoTempoProps) {
  const [showTable, setShowTable] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const formatNumber = (num: number) => num.toLocaleString("pt-BR");

  const horas = timeline.historicoHoras;
  const maxVotos = Math.max(...horas.map((h) => Math.max(h.votos22, h.votos13)), 800000);

  // Dimensões do SVG do gráfico
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingBottom = 30;
  const paddingTop = 20;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Gerar coordenadas dos pontos
  const points22 = horas.map((h, i) => {
    const x = paddingX + (i / (horas.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (h.votos22 / maxVotos) * chartHeight;
    return { x, y, val: h.votos22, hora: h.hora, data: h.data };
  });

  const points13 = horas.map((h, i) => {
    const x = paddingX + (i / (horas.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (h.votos13 / maxVotos) * chartHeight;
    return { x, y, val: h.votos13, hora: h.hora, data: h.data };
  });

  const pathD22 = points22.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const pathD13 = points13.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          Linha do tempo
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Votos recebidos por hora, no horário de brasília. Atualiza sozinho a cada 5 minutos.
        </p>
      </div>

      {/* 4 Cards de Métricas (KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        {/* Card 1: Pico do 22 */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#1d4ed8]" />
            <span>PICO DO 22</span>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {formatNumber(timeline.pico22.votos)}
            <span className="text-xs font-normal text-slate-400 ml-1">votos</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{timeline.pico22.periodo}</div>
        </div>

        {/* Card 2: Pico do 13 */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase">
            <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
            <span>PICO DO 13</span>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {formatNumber(timeline.pico13.votos)}
            <span className="text-xs font-normal text-slate-400 ml-1">votos</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{timeline.pico13.periodo}</div>
        </div>

        {/* Card 3: Hora Mais Movimentada */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-slate-600 uppercase">
            HORA MAIS MOVIMENTADA
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
            {formatNumber(timeline.horaMaisMovimentada.votos)}
            <span className="text-xs font-normal text-slate-400 ml-1">votos</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {timeline.horaMaisMovimentada.periodo}
          </div>
        </div>

        {/* Card 4: Quem Venceu Mais Horas */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="text-[10px] font-bold text-slate-600 uppercase">
            QUEM VENCEU MAIS HORAS
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 mt-1">
            <span className="text-[#1d4ed8]">22: {timeline.horasVencidas22}</span>
            <span className="text-slate-400 mx-1">•</span>
            <span className="text-[#dc2626]">13: {timeline.horasVencidas13}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 truncate">
            Última: 22/10 - 10h (13 passou na frente)
          </div>
        </div>
      </div>

      {/* Legenda do Gráfico */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[#1d4ed8] rounded-full" />
          <span>22 - Flávio Bolsonaro</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-1 bg-[#dc2626] rounded-full" />
          <span>13 - Lula</span>
        </div>
      </div>

      {/* Gráfico SVG Responsivo */}
      <div className="relative w-full bg-slate-50/70 border border-slate-100 rounded-lg p-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full min-w-[500px] h-[190px]"
          preserveAspectRatio="none"
        >
          {/* Linhas de Grade Horizontais */}
          {[0, 250000, 500000, 750000, 1000000].map((level) => {
            const y = paddingTop + chartHeight - (level / 1000000) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingX - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="8"
                  fill="#94a3b8"
                >
                  {level === 1000000 ? "1.000 mi" : level === 0 ? "0" : `${level / 1000} mil`}
                </text>
              </g>
            );
          })}

          {/* Linha 22 (Flávio Bolsonaro) */}
          <path
            d={pathD22}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Linha 13 (Lula) */}
          <path
            d={pathD13}
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pontos Interativos */}
          {points22.map((p, idx) => (
            <g
              key={`p22-${idx}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 5 : 3}
                fill="#1d4ed8"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {points13.map((p, idx) => (
            <g
              key={`p13-${idx}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 5 : 3}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Rótulos de Horas no Eixo X */}
          {horas.map((h, i) => {
            const x = paddingX + (i / (horas.length - 1)) * chartWidth;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
              >
                {h.hora}
              </text>
            );
          })}
        </svg>

        {/* Tooltip quando passa o mouse em um ponto */}
        {hoveredIndex !== null && horas[hoveredIndex] && (
          <div className="absolute top-3 right-4 bg-slate-900/95 text-white p-2 rounded shadow-lg text-[11px] pointer-events-none z-10">
            <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-1">
              {horas[hoveredIndex].data} • {horas[hoveredIndex].hora}
            </div>
            <div className="text-blue-400 font-semibold">
              22 (Flávio): {formatNumber(horas[hoveredIndex].votos22)} votos
            </div>
            <div className="text-red-400 font-semibold">
              13 (Lula): {formatNumber(horas[hoveredIndex].votos13)} votos
            </div>
          </div>
        )}
      </div>

      {/* Botão de Expansão da Tabela */}
      <div className="mt-4">
        <button
          onClick={() => setShowTable(!showTable)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          {showTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{showTable ? "Ocultar números hora a hora" : "Ver os números hora a hora"}</span>
        </button>

        {showTable && (
          <div className="mt-3 overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Hora</th>
                  <th className="py-2 px-3 text-[#1d4ed8]">Flávio Bolsonaro (22)</th>
                  <th className="py-2 px-3 text-[#dc2626]">Lula (13)</th>
                  <th className="py-2 px-3">Total Hora</th>
                  <th className="py-2 px-3 text-right">Liderança</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {horas.map((h, idx) => {
                  const lider = h.votos22 > h.votos13 ? "22" : "13";
                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-medium text-slate-700">
                        {h.data} - {h.hora}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-slate-800">
                        {formatNumber(h.votos22)}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-slate-800">
                        {formatNumber(h.votos13)}
                      </td>
                      <td className="py-1.5 px-3 font-mono text-slate-600">
                        {formatNumber(h.totalHora)}
                      </td>
                      <td className="py-1.5 px-3 text-right">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            lider === "22"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {lider} na frente
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
