import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#cc4e00",
        cream: "#f5f5dc",
        dark: "#0e0e0e",
        surface: "#141414",
        border: "#2a2a2a",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        "serif-body": ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-dot": "pulse-dot 1.5s ease-in-out infinite",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
