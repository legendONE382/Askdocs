import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0b1020",
        panel: "#121a2f",
        accent: "#5ea1ff"
      }
    }
  },
  plugins: []
};

export default config;
