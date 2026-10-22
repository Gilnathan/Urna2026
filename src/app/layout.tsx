import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulação do 2º Turno - Urna 2026",
  description:
    "Simulador 1:1 de Urna Eletrônica Brasileira para o 2º Turno das Eleições Presidenciais 2026. Acompanhe a apuração em tempo real.",
  keywords: ["urna 2026", "simulador de urna", "eleições 2026", "segundo turno", "apuração ao vivo"],
  authors: [{ name: "Gilnathan de Araújo Reis", url: "https://www.gilnathanreis.com.br" }],
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
