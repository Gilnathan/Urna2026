"use client";

import React, { useState } from "react";
import { Copy, Check, HeartHandshake } from "lucide-react";

interface ApoiePixProps {
  pixKey?: string;
}

export const PIX_CHAVE_APOIO = "23d48a5d-4dfc-4760-8177-400812e51497";

export function ApoiePix({ pixKey }: ApoiePixProps) {
  const chaveExibida = pixKey || PIX_CHAVE_APOIO;
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-br from-white via-emerald-50 to-amber-50 rounded-xl shadow-md border border-emerald-200 overflow-hidden mb-6">
      <div className="bg-emerald-800 text-white px-4 py-3 sm:px-6 flex items-center gap-2.5">
        <HeartHandshake className="w-5 h-5 text-amber-300 shrink-0" />
        <div>
          <h3 className="text-base sm:text-lg font-extrabold leading-tight">Apoie a Urna 2026</h3>
          <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5">
            Sua contribuição ajuda a manter o projeto no ar.
          </p>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6 max-w-3xl">
        {/* Card Principal */}
        <div className="bg-white/90 border-2 border-emerald-200 rounded-lg p-3.5 sm:p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wide">
              PIX
            </span>
            <span className="text-sm font-extrabold text-slate-900">Doe qualquer valor pela chave Pix</span>
          </div>

          {/* Input com a chave Pix e botão copiar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={chaveExibida}
              className="bg-white border border-[#a2dfd9] text-slate-800 font-mono text-xs rounded px-2.5 py-2 flex-1 select-all focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleCopy(chaveExibida)}
              className="bg-[#1f8c85] hover:bg-[#16706a] text-white px-4 py-2 rounded font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
            >
              {copiedKey ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado com sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar chave Pix</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contato & Redes */}
        <div className="space-y-1.5 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-2">
            <span>Dúvidas ou sugestões:</span>
            <a
              href="mailto:gilthanreis@gmail.com"
              className="font-semibold text-slate-800 hover:underline"
            >
              gilthanreis@gmail.com
            </a>
          </div>
          <div>
            <span>Instagram do desenvolvedor: </span>
            <a
              href="https://instagram.com/gilnathan_dev"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-pink-700 hover:underline"
            >
              @gilnathan_dev
            </a>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic pt-1">
          Simulação independente para fins de entretenimento sem vínculo com campanhas partidárias.
        </p>
      </div>
    </div>
  );
}
