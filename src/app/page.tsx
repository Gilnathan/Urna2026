import { getStats, getTimelineStats } from "@/lib/storage";
import { UrnaApp } from "@/components/UrnaApp";
import { PIX_CHAVE_APOIO } from "@/components/ApoiePix";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [initialStats, initialTimeline] = await Promise.all([
    getStats(),
    getTimelineStats(),
  ]);

  return (
    <UrnaApp
      initialStats={initialStats}
      initialTimeline={initialTimeline}
      siteUrl="https://urna2026.vercel.app/"
      pixKey={PIX_CHAVE_APOIO}
    />
  );
}
