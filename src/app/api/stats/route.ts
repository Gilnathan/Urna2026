import { NextResponse } from "next/server";
import { getStats, getTimelineStats } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [stats, timeline] = await Promise.all([
      getStats(),
      getTimelineStats(),
    ]);

    return NextResponse.json({
      success: true,
      stats,
      timeline,
    });
  } catch (error) {
    console.error("Erro na API de stats:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao carregar estatísticas." },
      { status: 500 }
    );
  }
}
