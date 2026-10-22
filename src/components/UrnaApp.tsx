"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PlacarAoVivo } from "@/components/PlacarAoVivo";
import { Urna } from "@/components/Urna";
import { TodosVotos } from "@/components/TodosVotos";
import { LinhaDoTempo } from "@/components/LinhaDoTempo";
import { ApoiePix } from "@/components/ApoiePix";
import { Footer } from "@/components/Footer";
import { VotoStats, TimelineStats } from "@/types";

interface UrnaAppProps {
  initialStats: VotoStats;
  initialTimeline: TimelineStats;
  pixKey: string;
}

export function UrnaApp({ initialStats, initialTimeline, pixKey }: UrnaAppProps) {
  const [stats, setStats] = useState<VotoStats>(initialStats);
  const [timeline, setTimeline] = useState<TimelineStats>(initialTimeline);

  // Polling automático sem cache a cada 10 segundos
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/stats?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            setStats((prev) => {
              if (data.stats.total >= prev.total) {
                return data.stats;
              }
              return prev;
            });
          }
          if (data.timeline) setTimeline(data.timeline);
        }
      } catch (err) {
        console.error("Erro ao atualizar estatísticas:", err);
      }
    };

    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleVoteCompleted = (newStats: VotoStats) => {
    setStats(newStats);
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <Header pixKey={pixKey} />

        <main className="max-w-4xl mx-auto px-3 sm:px-6 py-5">
          {/* 1. Placar Ao Vivo (Header de Apuração) */}
          <PlacarAoVivo stats={stats} />

          {/* 2. Simulador de Urna Eletrônica */}
          <Urna onVoteCompleted={handleVoteCompleted} />

          {/* 3. Seção Todos os Votos */}
          <TodosVotos stats={stats} />

          {/* 4. Linha do Tempo e Gráfico */}
          <LinhaDoTempo timeline={timeline} />

          {/* 5. Seção de Compartilhar / Link */}
          <ApoiePix pixKey={pixKey} />
        </main>
      </div>

      {/* 6. Rodapé com Informações de Gilnathan de Araújo Reis */}
      <Footer />
    </div>
  );
}
