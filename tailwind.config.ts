import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sky: "#A9C8D1",
        paper: "#EFE4CC",
        ink: "#0F0F0F",
        gold: "#E8B931",
        "card-back": "#1F1F1F",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        hand: ['"Caveat"', "cursive"],
        sans: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
