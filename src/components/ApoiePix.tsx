"use client";

import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

interface ApoiePixProps {
  pixKey?: string;
}

export const SITE_URL = "https://urna2026.vercel.app/";

export function ApoiePix({ pixKey }: ApoiePixProps) {
  const chaveExibida = pixKey || SITE_URL;
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          Apoie e Compartilhe a Urna 2026
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          O site é gratuito, anônimo e sem cadastro. Compartilhe o link com seus amigos e grupos para acompanhar a apuração.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Card Principal */}
        <div className="bg-[#f0f9f8] border border-[#a2dfd9] rounded-lg p-3.5 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#1f8c85] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
              <Share2 className="w-3 h-3" />
              LINK OFICIAL
            </span>
            <span className="text-xs font-bold text-slate-800">Link do Simulador</span>
          </div>

          {/* Input com o Link e Botão Copiar */}
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
                  <span>Copiar link</span>
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
