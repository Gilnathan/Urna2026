import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://urna2026.vercel.app"),
  title: "Simulação do 2º Turno - Urna 2026",
  description:
    "Simulação independente do 2º turno da Urna 2026. Vote e acompanhe os resultados interativos em tempo real.",
  keywords: ["urna 2026", "simulador de urna", "eleições 2026", "segundo turno", "apuração ao vivo"],
  authors: [{ name: "Gilnathan de Araújo Reis", url: "https://www.gilnathanreis.com.br" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://urna2026.vercel.app/",
    siteName: "Urna 2026",
    title: "Simulação do 2º Turno - Urna 2026",
    description:
      "Simulação independente do 2º turno da Urna 2026. Vote e acompanhe os resultados interativos em tempo real.",
    images: [
      {
        url: "/pres-2t-2.jpg",
        width: 1600,
        height: 900,
        alt: "Eleição 2026 — simulação do segundo turno",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulação do 2º Turno - Urna 2026",
    description:
      "Simulação independente do 2º turno da Urna 2026. Vote e acompanhe os resultados interativos em tempo real.",
    images: ["/pres-2t-2.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-[#f0f2f5] antialiased">
        {children}
      </body>
    </html>
  );
}
