"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { PlacarAoVivo } from "@/components/PlacarAoVivo";
import { Urna } from "@/components/Urna";
import { TodosVotos } from "@/components/TodosVotos";
import { LinhaDoTempo } from "@/components/LinhaDoTempo";
import { ApoiePix, PIX_COPIA_COLA } from "@/components/ApoiePix";
import { Footer } from "@/components/Footer";
import { VotoStats, TimelineStats } from "@/types";
import { X, Copy, Check } from "lucide-react";

interface UrnaAppProps {
  initialStats: VotoStats;
  initialTimeline: TimelineStats;
  pixKey: string;
}

export function UrnaApp({ initialStats, initialTimeline, pixKey }: UrnaAppProps) {
  const [stats, setStats] = useState<VotoStats>(initialStats);
  const [timeline, setTimeline] = useState<TimelineStats>(initialTimeline);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedModal, setCopiedModal] = useState(false);

  // Polling automático a cada 20 segundos
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.timeline) setTimeline(data.timeline);
        }
      } catch (err) {
        console.error("Erro ao atualizar estatísticas:", err);
      }
    };

    const interval = setInterval(fetchLatest, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleVoteCompleted = (newStats: VotoStats) => {
    setStats(newStats);
  };

  const handleCopyModal = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedModal(true);
    setTimeout(() => setCopiedModal(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <Header pixKey={pixKey} onOpenQrModal={() => setShowQrModal(true)} />

        <main className="max-w-4xl mx-auto px-3 sm:px-6 py-5">
          {/* 1. Placar Ao Vivo (Header de Apuração) */}
          <PlacarAoVivo stats={stats} />

          {/* 2. Simulador de Urna Eletrônica */}
          <Urna onVoteCompleted={handleVoteCompleted} />

          {/* 3. Seção Todos os Votos */}
          <TodosVotos stats={stats} />

          {/* 4. Linha do Tempo e Gráfico */}
          <LinhaDoTempo timeline={timeline} />

          {/* 5. Seção de Apoio / Doação Pix */}
          <ApoiePix pixKey={pixKey} />
        </main>
      </div>

      {/* 6. Rodapé com Informações de Gilnathan de Araújo Reis */}
      <Footer />

      {/* Modal QR Code Pix Oficial */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl relative text-center">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-base font-bold text-slate-900 mb-1">QR Code Pix Oficial</h4>
            <p className="text-xs text-slate-500 mb-3">
              Beneficiário: <strong>GILNATHAN DE A REIS</strong>
            </p>

            <div className="relative w-52 h-52 mx-auto bg-slate-50 p-2 rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-3">
              <Image
                src="/pix-qrcode.jpg"
                alt="QR Code Pix"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleCopyModal(PIX_COPIA_COLA)}
                className="w-full bg-[#1f8c85] hover:bg-[#16706a] text-white py-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {copiedModal ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Pix Copia e Cola copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Pix Copia e Cola</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
