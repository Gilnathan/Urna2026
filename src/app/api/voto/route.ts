import { NextRequest, NextResponse } from "next/server";
import { registerVote, getStats } from "@/lib/storage";
import { CandidatoId } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voto, fingerprint } = body as { voto: CandidatoId; fingerprint: string };

    if (!voto || !["22", "13", "BRANCO", "NULO"].includes(voto)) {
      return NextResponse.json(
        { success: false, message: "Opção de voto inválida." },
        { status: 400 }
      );
    }

    if (!fingerprint || typeof fingerprint !== "string" || fingerprint.length < 5) {
      return NextResponse.json(
        { success: false, message: "Identificador de dispositivo ausente." },
        { status: 400 }
      );
    }

    // Tenta registrar o voto persistentemente
    const result = await registerVote(voto, fingerprint);

    if (result.duplicate) {
      return NextResponse.json(
        {
          success: false,
          alreadyVoted: true,
          message: "Este dispositivo já computou um voto. Cada eleitor pode votar apenas uma vez.",
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
