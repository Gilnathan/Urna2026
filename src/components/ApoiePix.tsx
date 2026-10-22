"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

interface ApoiePixProps {
  pixKey?: string;
}

export const PIX_COPIA_COLA =
  "00020101021126360014br.gov.bcb.pix0114589084490001325204000053039865802BR5919GILNATHAN DE A REIS6007ITABELA62070503***6304D8B8";

export const PIX_CHAVE_CNPJ = "58.908.449/0001-32";

export function ApoiePix({ pixKey }: ApoiePixProps) {
  const chaveExibida = pixKey || PIX_CHAVE_CNPJ;
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCopiaCola, setCopiedCopiaCola] = useState(false);
  const [copiedCrypto, setCopiedCrypto] = useState(false);

  const ethAddress = "0xCFB0D46981E7C1057D9727541E8058473D85A7E7";

  const handleCopy = (text: string, type: "key" | "copiaCola" | "crypto") => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === "copiaCola") {
      setCopiedCopiaCola(true);
      setTimeout(() => setCopiedCopiaCola(false), 2000);
    } else {
      setCopiedCrypto(true);
      setTimeout(() => setCopiedCrypto(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          Apoie a Urna 2026
        </h3>
        <p className="text-xs text-slate-600 mt-1">
          O site é gratuito e sem cadastro. Se quiser ajudar a manter o servidor no ar, qualquer valor ajuda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Lado Esquerdo: Dados do PIX e Cripto (Cols 1-8) */}
        <div className="md:col-span-8 space-y-4">
          {/* Card Principal Pix */}
          <div className="bg-[#f0f9f8] border border-[#a2dfd9] rounded-lg p-3.5 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#1f8c85] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                PIX
              </span>
              <span className="text-xs font-bold text-slate-800">Doe por Pix</span>
              <span className="text-[11px] text-slate-500">(CNPJ / Chave direta)</span>
            </div>

            {/* Input com a Chave e Botão Copiar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={chaveExibida}
                className="bg-white border border-[#a2dfd9] text-slate-700 font-mono text-xs rounded px-2.5 py-1.5 flex-1 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleCopy(chaveExibida, "key")}
                className="bg-[#1f8c85] hover:bg-[#16706a] text-white px-3 py-1.5 rounded font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Chave copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar chave</span>
                  </>
                )}
              </button>
            </div>

            {/* Botão Copiar Pix Copia e Cola */}
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => handleCopy(PIX_COPIA_COLA, "copiaCola")}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedCopiaCola ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Pix Copia e Cola copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar Pix copia e cola completo</span>
                  </>
                )}
              </button>
            </div>

            {/* Instruções do App Bancário */}
            <div className="mt-3 text-[11px] text-slate-600 leading-relaxed border-t border-[#c5ebe6] pt-2">
              Beneficiário: <strong>GILNATHAN DE A REIS</strong> (Itabela - BA).
              <br />
              No app do banco: <strong>Pix</strong> → <strong>Pagar com chave</strong> ou <strong>Pix copia e cola</strong>. No computador, aponte a câmera para o QR code ao lado.
            </div>
          </div>

          {/* Doação em Cripto */}
          <div className="text-xs text-slate-700">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              OU EM CRIPTO - ETHEREUM (ETH) OU PELA REDE ETHEREUM:
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 border border-slate-200 rounded px-2.5 py-1 font-mono text-[11px] text-slate-600 truncate flex-1">
                {ethAddress}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(ethAddress, "crypto")}
                className="bg-[#0b2b64] hover:bg-[#081e47] text-white px-2.5 py-1 rounded text-xs font-medium shrink-0 flex items-center gap-1 transition-colors"
              >
                {copiedCrypto ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Contato & Redes */}
          <div className="space-y-1 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span>Dúvidas:</span>
              <a
                href="mailto:gilthanreis@gmail.com"
                className="font-semibold text-slate-800 hover:underline"
              >
                gilthanreis@gmail.com
              </a>
            </div>
            <div>
              <span>Instagram: </span>
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
            Doações apoiam a infraestrutura do site e não têm vínculo com partidos ou campanhas.
          </p>
        </div>

        {/* Lado Direito: Imagem Oficial do QR Code Pix (Cols 9-12) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 border border-slate-200 rounded-lg bg-slate-50 text-center">
          <div className="relative w-44 h-44 bg-white p-2 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <Image
              src="/pix-qrcode.jpg"
              alt="QR Code Pix Gilnathan de A Reis"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <span className="text-[11px] font-bold text-slate-700 mt-2">
            QR Pix • leia no app do banco
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {chaveExibida}
          </span>
        </div>
      </div>
    </div>
  );
}
