import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brasil: {
          green: "#006437",
          darkGreen: "#004825",
          yellow: "#ffd100",
          blue: "#002776",
        },
        urna: {
          case: "#dedcd4",
          caseDark: "#c7c4b8",
          screenBg: "#f4f3ec",
          screenBorder: "#383a42",
          keypadBg: "#22252a",
          keyDark: "#181a1d",
          branco: "#ffffff",
          corrige: "#e65100",
          confirma: "#008a3b",
        },
        candidato: {
          bolsonaro: "#1d4ed8",
          lula: "#dc2626",
          branco: "#94a3b8",
          nulo: "#475569",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
