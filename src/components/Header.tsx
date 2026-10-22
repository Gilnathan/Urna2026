"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface HeaderProps {
  siteUrl: string;
}

export function Header({ siteUrl }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  // Contadores regressivos reais
  const [countdown25, setCountdown25] = useState({ dias: 2, horas: 21, min: 32, seg: 37 });
  const [countdown23, setCountdown23] = useState({ dias: 1, horas: 10, min: 52, seg: 37 });

  useEffect(() => {
    const target25 = new Date("2026-10-25T08:00:00-03:00").getTime();
    const target23 = new Date("2026-10-23T21:30:00-03:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();

      const diff25 = Math.max(0, target25 - now);
      const diff23 = Math.max(0, target23 - now);

      setCountdown25({
        dias: Math.floor(diff25 / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff25 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((diff25 % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((diff25 % (1000 * 60)) / 1000),
      });

      setCountdown23({
        dias: Math.floor(diff23 / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff23 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        min: Math.floor((diff23 % (1000 * 60 * 60)) / (1000 * 60)),
        seg: Math.floor((diff23 % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="w-full">
      {/* Top Banner com identidade visual do Brasil */}
      <div className="relative bg-[#006437] text-white pt-4 pb-4 px-3 sm:px-6 overflow-hidden shadow-md">
        {/* Bandeira estilizada ao fundo à direita */}
        <div className="absolute -top-10 -right-10 pointer-events-none opacity-90 select-none">
          <svg width="220" height="160" viewBox="0 0 220 160" fill="none">
            <polygon points="110,10 210,80 110,150 10,80" fill="#ffd100" />
            <circle cx="110" cy="80" r="42" fill="#002776" />
            <path
              d="M 75 75 Q 110 65 145 83"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-yellow-300">
            ELEIÇÕES 2026 • PRESIDENTE DA REPÚBLICA
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tracking-tight">
            Simulação do 2º turno
          </h1>

          {/* Cards de Contagem Regressiva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
            {/* Card 1: 25 OUT */}
            <div className="bg-white text-slate-800 rounded-lg p-2.5 flex items-center gap-3 shadow-sm border border-slate-100">
              <div className="bg-amber-400 text-slate-950 font-black px-2 py-1.5 rounded flex flex-col items-center justify-center min-w-[46px] leading-none">
                <span className="text-lg">25</span>
                <span className="text-[9px] uppercase tracking-tighter">OUT</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Domingo, 25 de outubro
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Urnas abrem às 8h (horário de Brasília)
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-800">
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown25.dias}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">dias</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown25.horas}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">h</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown25.min}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">m</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown25.seg}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: 23 OUT */}
            <div className="bg-white text-slate-800 rounded-lg p-2.5 flex items-center gap-3 shadow-sm border border-slate-100">
              <div className="bg-[#0b2545] text-white font-black px-2 py-1.5 rounded flex flex-col items-center justify-center min-w-[46px] leading-none">
                <span className="text-lg text-amber-300">23</span>
                <span className="text-[9px] uppercase tracking-tighter text-slate-200">OUT</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Debate na TV Globo
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Sexta, às 21h30 (horário de Brasília)
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-800">
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown23.dias}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">dias</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown23.horas}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">h</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown23.min}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">m</span>
                  </div>
                  <div className="text-center">
                    <span className="font-mono font-bold text-xs">{countdown23.seg}</span>
                    <span className="text-[9px] text-slate-400 ml-0.5">s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso Legal TSE */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-200 bg-black/20 backdrop-blur-sm px-2.5 py-1.5 rounded-md">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            <p>
              Brincadeira / interativa. Não é pesquisa eleitoral, não tem registro no TSE e não tem valor estatístico.
            </p>
          </div>
        </div>
      </div>

      {/* Faixa Superior com Link do Site */}
      <div className="bg-[#e8f4fd] border-b border-[#c8e2f8] py-2 px-3 sm:px-6 text-slate-700">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="bg-[#24a0ed] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              COMPARTILHE
            </span>
            <span>Compartilhe o site oficial da simulação</span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <input
              type="text"
              readOnly
              value={siteUrl}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700 font-mono text-[11px] w-full sm:w-64 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="bg-[#1f8c85] hover:bg-[#16706a] text-white px-3 py-1 rounded font-medium text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
