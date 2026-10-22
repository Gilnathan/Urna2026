import { UrnaApp } from "@/components/UrnaApp";
import { PIX_CHAVE_APOIO } from "@/components/ApoiePix";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <UrnaApp
      siteUrl="https://urna2026.vercel.app/"
      pixKey={PIX_CHAVE_APOIO}
    />
  );
}
