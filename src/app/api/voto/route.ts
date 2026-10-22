import { NextRequest, NextResponse } from "next/server";
import { registerVote, getStats } from "@/lib/storage";
import { CandidatoId } from "@/types";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voto } = body as { voto: CandidatoId };

    if (!voto || !["22", "13", "BRANCO", "NULO"].includes(voto)) {
      return NextResponse.json(
        { success: false, message: "Opção de voto inválida." },
        { status: 400 }
      );
    }

    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")?.trim()
      || forwardedFor?.split(",")[0]?.trim();

    if (!ip) {
      return NextResponse.json(
        { success: false, message: "Não foi possível identificar a conexão para registrar o voto." },
        { status: 503 }
      );
    }

    // O IP é resumido antes de ser persistido; o índice UNIQUE existente impede votos simultâneos duplicados.
    const voterKey = createHash("sha256").update(ip).digest("hex");
    const result = await registerVote(voto, voterKey);

    if (result.duplicate) {
      return NextResponse.json(
        {
          success: false,
          alreadyVoted: true,
          message: "Esta conexão já registrou um voto. Cada IP pode votar apenas uma vez.",
        },
        { status: 409 }
      );
    }

    const currentStats = await getStats();

    return NextResponse.json(
      {
        success: true,
        message: "Voto computado com sucesso!",
        stats: currentStats,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao processar voto:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao computar voto." },
      { status: 500 }
    );
  }
}
