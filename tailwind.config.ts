import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50:  "#F1FBF3",
          100: "#C8EDD0",
          200: "#9DD9AC",
          300: "#6DC487",
          400: "#3DAE62",
          500: "#2E8B4A",
          600: "#1F6835",
          700: "#144522",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.3" },
        },
      },
      animation: {
        ticker: "ticker 50s linear infinite",
        pulse2: "pulse2 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
