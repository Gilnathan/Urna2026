// Client-side Device Fingerprinting & Vote Verification

export async function getDeviceFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "server-agent";

  try {
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const languages = (navigator.languages || [navigator.language]).join(",");
    const userAgent = navigator.userAgent || "";
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    // Canvas fingerprinting
    let canvasData = "";
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial', sans-serif";
        ctx.fillStyle = "#006437";
        ctx.fillText("URNA-2026-TSE-SECURITY-VOTE", 2, 2);
        ctx.fillStyle = "#ffd100";
        ctx.fillRect(100, 5, 50, 20);
        canvasData = canvas.toDataURL().slice(-50);
      }
    } catch {
      canvasData = "canvas-fallback";
    }

    const rawString = `${screenInfo}|${timezone}|${languages}|${userAgent}|${hardwareConcurrency}|${canvasData}`;

    // Hash with Web Crypto SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
  } catch (e) {
    return "fp_" + Math.random().toString(36).substring(2, 15);
  }
}

export function checkHasVotedLocally(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const local = localStorage.getItem("urna_2026_voted");
    const cookie = document.cookie.includes("urna_voted_token=");
    return Boolean(local || cookie);
  } catch {
    return false;
  }
}

export function recordLocalVote(candidato: string, fingerprint: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("urna_2026_voted", "true");
    localStorage.setItem("urna_2026_voto_escolha", candidato);
    localStorage.setItem("urna_2026_voto_data", new Date().toISOString());
    localStorage.setItem("urna_2026_fp", fingerprint);

    // Salva cookie por 365 dias
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `urna_voted_token=${fingerprint}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (err) {
    console.error("Erro ao gravar voto localmente:", err);
  }
}
