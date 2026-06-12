import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#14202E",
        muted: "#5B6B7C",
        line: "#DDE3EA",
        cobalt: { DEFAULT: "#2447E0", soft: "#E8EDFF", deep: "#16307A" },
        amber: { DEFAULT: "#E89B1C", soft: "#FBF1DD" },
        danger: "#C7402D",
        ok: "#1E8A5A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,32,46,.05), 0 8px 24px rgba(20,32,46,.06)",
      },
    },
  },
  plugins: [],
};
export default config;
