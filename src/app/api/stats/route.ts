import { NextResponse } from "next/server";
import { getStats, getTimelineStats } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [stats, timeline] = await Promise.all([
      getStats(),
      getTimelineStats(),
    ]);

    return NextResponse.json(
      {
        success: true,
        stats,
        timeline,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Erro na API de stats:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao carregar estatísticas." },
      { status: 500 }
    );
  }
}
