"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { CANDIDATOS } from "@/lib/candidates";
import { playKeyBeep, playCorrigeBeep, playUrnaConfirmationSound } from "@/lib/audio";
import { getDeviceFingerprint, checkHasVotedLocally, recordLocalVote } from "@/lib/fingerprint";
import { CandidatoId, VotoStats } from "@/types";

interface UrnaProps {
  onVoteCompleted: (newStats: VotoStats) => void;
}

export function Urna({ onVoteCompleted }: UrnaProps) {
  const [digits, setDigits] = useState<string>("");
  const [isBranco, setIsBranco] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [urnaPhase, setUrnaPhase] = useState<"IDLE" | "GRAVANDO" | "FIM">("IDLE");
  const [hasAlreadyVoted, setHasAlreadyVoted] = useState<boolean>(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Verifica se o dispositivo já votou anteriormente
  useEffect(() => {
    if (checkHasVotedLocally()) {
      setHasAlreadyVoted(true);
    }
  }, []);

  const clearLocalVote = () => {
    try {
      localStorage.removeItem("urna_2026_voted");
      localStorage.removeItem("urna_2026_voto_escolha");
      localStorage.removeItem("urna_2026_voto_data");
      localStorage.removeItem("urna_2026_fp");
      document.cookie = "urna_voted_token=; path=/; max-age=0";
      setHasAlreadyVoted(false);
      setUrnaPhase("IDLE");
      setDigits("");
      setIsBranco(false);
      setNoticeMessage(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Candidato ativo com base nos dígitos
  const candidatoAtivo = digits.length === 2 ? CANDIDATOS[digits] : null;
  const isVotoNulo = digits.length === 2 && !candidatoAtivo;

  // Lógica de digitar número
  const handleDigit = useCallback(
    (digit: string) => {
      if (urnaPhase !== "IDLE" || hasAlreadyVoted) return;

      if (isBranco) {
        setIsBranco(false);
      }

      if (digits.length < 2) {
        playKeyBeep();
        setDigits((prev) => prev + digit);
      }
    },
    [digits, isBranco, urnaPhase, hasAlreadyVoted]
  );

  // Lógica da tecla BRANCO
  const handleBranco = useCallback(() => {
    if (urnaPhase !== "IDLE" || hasAlreadyVoted) return;

    if (digits.length === 0) {
      playKeyBeep();
      setIsBranco(true);
    }
  }, [digits, urnaPhase, hasAlreadyVoted]);

  // Lógica da tecla CORRIGE
  const handleCorrige = useCallback(() => {
    if (urnaPhase !== "IDLE" || hasAlreadyVoted) return;

    playCorrigeBeep();
    setDigits("");
    setIsBranco(false);
    setNoticeMessage(null);
  }, [urnaPhase, hasAlreadyVoted]);

  // Lógica da tecla CONFIRMA
  const handleConfirma = useCallback(async () => {
    if (urnaPhase !== "IDLE" || isSubmitting || hasAlreadyVoted) return;

    let votoTipo: CandidatoId | null = null;
    if (isBranco) {
      votoTipo = "BRANCO";
    } else if (digits === "22") {
      votoTipo = "22";
    } else if (digits === "13") {
      votoTipo = "13";
    } else if (digits.length === 2) {
      votoTipo = "NULO";
    }

    if (!votoTipo) {
      playCorrigeBeep();
      return;
    }

    setIsSubmitting(true);
    setUrnaPhase("GRAVANDO");

    try {
      const fingerprint = await getDeviceFingerprint();

      const response = await fetch("/api/voto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ voto: votoTipo, fingerprint }),
      });

      const data = await response.json();

      if (data.alreadyVoted) {
        setHasAlreadyVoted(true);
        setNoticeMessage("Este aparelho já computou um voto. Cada eleitor vota apenas 1 vez.");
        setUrnaPhase("IDLE");
        setIsSubmitting(false);
        return;
      }

      // Toca som clássico do TSE e avança para a tela "FIM"
      playUrnaConfirmationSound();
      setUrnaPhase("FIM");
      recordLocalVote(votoTipo, fingerprint);
      setHasAlreadyVoted(true);

      // Efeito de confete
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#006437", "#ffd100", "#002776", "#ffffff"],
      });

      if (data.stats) {
        onVoteCompleted(data.stats);
      }
    } catch (err) {
      console.error("Erro ao registrar voto:", err);
      playUrnaConfirmationSound();
      setUrnaPhase("FIM");
      recordLocalVote(votoTipo, "fallback_fp");
      setHasAlreadyVoted(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [urnaPhase, isSubmitting, hasAlreadyVoted, isBranco, digits, onVoteCompleted]);

  // Atalhos de teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasAlreadyVoted || urnaPhase !== "IDLE") return;

      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleConfirma();
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "Escape") {
        e.preventDefault();
        handleCorrige();
      } else if (e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleBranco();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleConfirma, handleCorrige, handleBranco, hasAlreadyVoted, urnaPhase]);

  return (
    <div className="w-full mb-8">
      {/* Alerta caso o usuário já tenha votado */}
      {hasAlreadyVoted && urnaPhase !== "FIM" && (
        <div className="mb-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg p-3 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <span>
              <strong>Voto já computado neste dispositivo!</strong> Para manter a precisão da simulação, votos repetidos são bloqueados.
            </span>
          </div>
          <button
            type="button"
            onClick={clearLocalVote}
            className="text-[11px] bg-amber-200/70 hover:bg-amber-300 text-amber-950 px-2 py-1 rounded font-bold transition-colors"
          >
            Liberar para novo teste
          </button>
        </div>
      )}

      {noticeMessage && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 rounded-lg p-3 text-xs sm:text-sm flex items-center justify-between">
          <span>{noticeMessage}</span>
          <button
            type="button"
            onClick={clearLocalVote}
            className="text-xs font-bold underline ml-2"
          >
            Limpar trava
          </button>
        </div>
      )}

      {/* Carcaça da Urna Eletrônica Brasileira */}
      <div className="relative mx-auto max-w-3xl bg-[#dedcd4] border-4 border-[#b8b5a8] rounded-2xl p-3 sm:p-6 shadow-2xl overflow-hidden">
        {/* Detalhe Superior da Carcaça: Logo e LED */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-600/20 flex items-center justify-center border border-amber-700/30">
              <span className="text-[10px] font-black text-amber-900">★</span>
            </div>
            <span className="text-[11px] font-bold tracking-widest text-[#5c5a53] uppercase">
              JUSTIÇA ELEITORAL
            </span>
          </div>
          {/* LED de atividade */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                urnaPhase === "GRAVANDO"
                  ? "bg-amber-500 animate-ping"
                  : urnaPhase === "FIM"
                  ? "bg-emerald-500"
                  : "bg-emerald-400"
              }`}
            />
            <span className="text-[9px] font-semibold text-[#7c7a72] uppercase">
              {urnaPhase === "GRAVANDO" ? "GRAVANDO" : "PRONTO"}
            </span>
          </div>
        </div>

        {/* Layout da Urna: Tela (LCD) à esquerda + Teclado à direita */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* TELA DE LCD DA URNA (Col 1-7) */}
          <div className="md:col-span-7 bg-[#f2efe7] border-4 border-[#33373d] rounded-lg p-3.5 sm:p-5 flex flex-col justify-between min-h-[310px] sm:min-h-[350px] shadow-inner relative select-none">
            {/* TELA: GRAVANDO */}
            {urnaPhase === "GRAVANDO" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wider animate-pulse font-mono">
                  GRAVANDO...
                </div>
                <div className="text-xs text-slate-500 mt-2">Aguarde a gravação do seu voto</div>
              </div>
            )}

            {/* TELA: FIM */}
            {urnaPhase === "FIM" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <div className="text-6xl sm:text-7xl font-black text-slate-900 tracking-widest font-mono">
                  FIM
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-700 tracking-wider mt-2 uppercase">
                  VOTOU
                </div>
                <div className="mt-4 px-3 py-1 bg-emerald-100 border border-emerald-300 rounded text-emerald-800 text-xs font-semibold">
                  ✓ Seu voto foi registrado com sucesso!
                </div>
              </div>
            )}

            {/* TELA: VOTAÇÃO NORMAL */}
            {urnaPhase === "IDLE" && (
              <>
                {/* Cabeçalho da Tela */}
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">
                        SEU VOTO PARA
                      </p>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                        PRESIDENTE
                      </h4>
                    </div>
                  </div>

                  {/* Campo de Dígitos */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Número:</span>
                    <div className="flex gap-1.5">
                      {/* Caixa Dígito 1 */}
                      <div className="w-8 h-11 sm:w-9 sm:h-12 border-2 border-slate-700 bg-white flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-slate-900 shadow-sm">
                        {digits[0] || (
                          <span className={digits.length === 0 ? "animate-pulse font-light text-slate-400" : ""}>
                            {digits.length === 0 ? "|" : ""}
                          </span>
                        )}
                      </div>
                      {/* Caixa Dígito 2 */}
                      <div className="w-8 h-11 sm:w-9 sm:h-12 border-2 border-slate-700 bg-white flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-slate-900 shadow-sm">
                        {digits[1] || (
                          <span className={digits.length === 1 ? "animate-pulse font-light text-slate-400" : ""}>
                            {digits.length === 1 ? "|" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informações do Candidato ou Mensagem */}
                  <div className="mt-3 min-h-[110px] relative">
                    {/* VOTO EM BRANCO */}
                    {isBranco && (
                      <div className="pt-4 text-center">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider animate-pulse">
                          VOTO EM BRANCO
                        </div>
                      </div>
                    )}

                    {/* VOTO NULO */}
                    {isVotoNulo && (
                      <div className="pt-2">
                        <div className="text-sm font-bold text-red-600">NÚMERO ERRADO</div>
                        <div className="text-lg font-black text-slate-900 animate-pulse mt-1">
                          VOTO NULO
                        </div>
                      </div>
                    )}

                    {/* CANDIDATO VÁLIDO */}
                    {candidatoAtivo && (
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 text-xs sm:text-sm text-slate-800 flex-1">
                          <div>
                            <span className="text-slate-500 font-medium">Nome: </span>
                            <strong className="text-slate-950 font-black">{candidatoAtivo.nome}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Partido: </span>
                            <strong className="text-slate-950 font-bold">{candidatoAtivo.partido}</strong>
                          </div>
                          <div className="text-[11px] sm:text-xs">
                            <span className="text-slate-500 font-medium">Vice: </span>
                            <span className="text-slate-800 font-semibold">{candidatoAtivo.vice}</span>
                          </div>
                        </div>

                        {/* Foto do Candidato na Tela da Urna */}
                        <div className="w-16 h-20 sm:w-20 sm:h-24 border border-slate-500 bg-white rounded overflow-hidden relative shrink-0 shadow-sm">
                          <Image
                            src={candidatoAtivo.foto}
                            alt={candidatoAtivo.nome}
                            fill
                            className="object-cover object-top"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                            Presidente
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dica inicial vazia */}
                    {!isBranco && digits.length === 0 && (
                      <p className="text-[11px] text-slate-500 italic pt-3">
                        Digite o número do seu candidato...
                      </p>
                    )}
                  </div>
                </div>

                {/* Rodapé de Instruções da Tela da Urna */}
                <div className="border-t-2 border-slate-700/60 pt-2 text-[10px] sm:text-[11px] text-slate-700 leading-tight">
                  <p className="font-semibold text-slate-800 mb-0.5">Aperte a tecla:</p>
                  <p className="text-emerald-800 font-medium">
                    • <strong>CONFIRMA</strong> para CONFIRMAR este voto
                  </p>
                  <p className="text-amber-800 font-medium">
                    • <strong>CORRIGE</strong> para REINICIAR este voto
                  </p>
                </div>
              </>
            )}
          </div>

          {/* TECLADO DA URNA (Col 8-12) */}
          <div className="md:col-span-5 bg-[#202328] rounded-lg p-3 sm:p-4 shadow-xl flex flex-col justify-between border border-[#141619]">
            {/* Logo Justiça Eleitoral no Teclado */}
            <div className="text-center pb-2 mb-1 border-b border-white/10">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                JUSTIÇA ELEITORAL
              </span>
            </div>

            {/* Grade Numérica 1-9 e 0 */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-[210px] mx-auto w-full my-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleDigit(num)}
                  disabled={hasAlreadyVoted || urnaPhase !== "IDLE"}
                  className="relative h-10 sm:h-11 bg-gradient-to-b from-[#2b2f36] to-[#1c1e22] text-white font-mono font-black text-lg sm:text-xl rounded shadow-[0_3px_0_#0f1012] active:translate-y-0.5 active:shadow-[0_1px_0_#0f1012] transition-transform flex items-center justify-center border-t border-white/10 disabled:opacity-50"
                >
                  {num}
                  {num === "5" && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-400" />
                  )}
                </button>
              ))}

              {/* Linha do Zero */}
              <div />
              <button
                type="button"
                onClick={() => handleDigit("0")}
                disabled={hasAlreadyVoted || urnaPhase !== "IDLE"}
                className="h-10 sm:h-11 bg-gradient-to-b from-[#2b2f36] to-[#1c1e22] text-white font-mono font-black text-lg sm:text-xl rounded shadow-[0_3px_0_#0f1012] active:translate-y-0.5 active:shadow-[0_1px_0_#0f1012] transition-transform flex items-center justify-center border-t border-white/10 disabled:opacity-50"
              >
                0
              </button>
              <div />
            </div>

            {/* Linha de Botões de Ação: BRANCO, CORRIGE, CONFIRMA */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-4 pt-3 border-t border-white/10 items-end">
              <button
                type="button"
                onClick={handleBranco}
                disabled={hasAlreadyVoted || urnaPhase !== "IDLE"}
                className="h-10 sm:h-11 bg-[#f8fafc] text-slate-900 font-extrabold text-[10px] sm:text-xs uppercase rounded shadow-[0_3px_0_#94a3b8] active:translate-y-0.5 active:shadow-[0_1px_0_#94a3b8] transition-transform flex items-center justify-center disabled:opacity-50"
              >
                BRANCO
              </button>

              <button
                type="button"
                onClick={handleCorrige}
                disabled={hasAlreadyVoted || urnaPhase !== "IDLE"}
                className="h-10 sm:h-11 bg-[#ea580c] hover:bg-[#d94e08] text-white font-extrabold text-[10px] sm:text-xs uppercase rounded shadow-[0_3px_0_#9a3412] active:translate-y-0.5 active:shadow-[0_1px_0_#9a3412] transition-transform flex items-center justify-center disabled:opacity-50"
              >
                CORRIGE
              </button>

              <button
                type="button"
                onClick={handleConfirma}
                disabled={hasAlreadyVoted || urnaPhase !== "IDLE" || isSubmitting}
                className="h-12 sm:h-13 bg-[#15803d] hover:bg-[#166534] text-white font-black text-xs sm:text-sm uppercase rounded shadow-[0_4px_0_#14532d] active:translate-y-0.5 active:shadow-[0_1px_0_#14532d] transition-transform flex items-center justify-center border-t border-emerald-400/40 disabled:opacity-50"
              >
                CONFIRMA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções Rápidas em Pílulas Abaixo da Urna */}
      <div className="mt-3 max-w-3xl mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-2 text-[11px] sm:text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-2.5 shadow-sm">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
            1
          </span>
          <span>
            Digite: <strong>22</strong> ou <strong>13</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
            2
          </span>
          <span>Confira a foto e o nome</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
            3
          </span>
          <span>
            Aperte: <strong>CONFIRMA</strong>
          </span>
        </div>

        <div className="w-full sm:w-auto text-[10px] text-slate-400 text-center sm:text-right border-t sm:border-t-0 pt-1 sm:pt-0">
          No teclado: <kbd className="bg-slate-100 px-1 py-0.5 rounded border text-slate-600">Enter</kbd> confirma,{" "}
          <kbd className="bg-slate-100 px-1 py-0.5 rounded border text-slate-600">Del</kbd> corrige,{" "}
          <kbd className="bg-slate-100 px-1 py-0.5 rounded border text-slate-600">B</kbd> branco
        </div>
      </div>
    </div>
  );
}
