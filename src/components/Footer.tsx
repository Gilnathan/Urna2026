import React from "react";
import { Github, Globe, Instagram, Mail, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#004825] text-white border-t border-[#006437] mt-8 select-none">
      {/* Faixa Superior de Informações Legais */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-200 border-b border-emerald-800/60">
        <div>
          <span>Simulação para fins do entretenimento. </span>
          <strong className="text-yellow-300">Votos repetidos não contam.</strong>
          <span> • Contato: </span>
          <a href="mailto:gilthanreis@gmail.com" className="underline hover:text-white">
            gilthanreis@gmail.com
          </a>
        </div>
        <div>
          <span>2º turno: 25 de outubro de 2026 • </span>
          <span className="hover:underline cursor-pointer">Privacidade</span>
        </div>
      </div>

      {/* Faixa Principal de Assinatura do Desenvolvedor (Gilnathan de Araújo Reis) */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-slate-200">
            Desenvolvido por{" "}
            <strong className="text-white font-bold">Gilnathan de Araújo Reis</strong>
            <span className="text-emerald-300 font-medium"> (Desenvolvedor Full-Stack)</span>
          </span>
        </div>

        {/* Links Sociais e Portfólio */}
        <div className="flex items-center gap-4 text-emerald-100">
          <a
            href="https://github.com/Gilnathan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">github.com/Gilnathan</span>
          </a>

          <a
            href="https://instagram.com/gilnathan_dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@gilnathan_dev</span>
          </a>

          <a
            href="https://www.gilnathanreis.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">gilnathanreis.com.br</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
