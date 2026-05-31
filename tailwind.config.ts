import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)"],
        dm: ["var(--font-dm)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        brand: "#E8410A",
        "brand-light": "#FEE8DF",
        ink: "#0D0D0B",
        "ink-2": "#1A1A18",
        chalk: "#F7F4EF",
        "chalk-2": "#EDE9E2",
        muted: "#7A756E",
      },
    },
  },
  plugins: [],
};

export default config;
