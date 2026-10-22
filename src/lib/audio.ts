// TSE Urna Eletrônica Sound Synthesizer via Web Audio API
// Synthesizes the authentic frequencies without external MP3 dependencies

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Som curto de clique de tecla numérica / botão (Bip simples)
 */
export function playKeyBeep(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1150, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch (err) {
    console.warn("Audio not supported or blocked:", err);
  }
}

/**
 * Som de erro / corrige
 */
export function playCorrigeBeep(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(450, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  } catch (err) {
    console.warn("Audio not supported or blocked:", err);
  }
}

/**
 * O clássico som de confirmação da urna eletrônica do TSE (Pililili + Som longo de FIM)
 * Sequência de bips rápidos seguido pelo sinal contínuo
 */
export function playUrnaConfirmationSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    // Sequência de 4 bips rápidos preparatórios
    const sequence = [
      { freq: 520, start: 0.00, dur: 0.07 },
      { freq: 650, start: 0.09, dur: 0.07 },
      { freq: 780, start: 0.18, dur: 0.07 },
      { freq: 950, start: 0.27, dur: 0.07 },
    ];

    sequence.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.freq, startTime + tone.start);

      gain.gain.setValueAtTime(0.22, startTime + tone.start);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + tone.start + tone.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + tone.start);
      osc.stop(startTime + tone.start + tone.dur);
    });

    // Som clássico prolongado de encerramento (FIM)
    const longToneStart = startTime + 0.38;
    const longToneDur = 1.35;

    const mainOsc = ctx.createOscillator();
    const mainGain = ctx.createGain();

    mainOsc.type = "sine";
    // Frequência padrão do som da urna brasileira em torno de 1050Hz
    mainOsc.frequency.setValueAtTime(1050, longToneStart);

    mainGain.gain.setValueAtTime(0.3, longToneStart);
    mainGain.gain.setValueAtTime(0.3, longToneStart + longToneDur - 0.15);
    mainGain.gain.exponentialRampToValueAtTime(0.0001, longToneStart + longToneDur);

    mainOsc.connect(mainGain);
    mainGain.connect(ctx.destination);

    mainOsc.start(longToneStart);
    mainOsc.stop(longToneStart + longToneDur);
  } catch (err) {
    console.warn("Audio confirmation failed:", err);
  }
}
