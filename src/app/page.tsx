import { getStats, getTimelineStats } from "@/lib/storage";
import { UrnaApp } from "@/components/UrnaApp";
import { SITE_URL } from "@/components/ApoiePix";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [initialStats, initialTimeline] = await Promise.all([
    getStats(),
    getTimelineStats(),
  ]);

  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || SITE_URL;

  return (
    <UrnaApp
      initialStats={initialStats}
      initialTimeline={initialTimeline}
      pixKey={pixKey}
    />
  );
}
