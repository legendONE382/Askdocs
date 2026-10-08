import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0b1020",
        panel: "#111827",
        accent: "#5ea1ff",
        "accent-soft": "rgba(94,161,255,0.12)",
        muted: "#94a3b8",
        subtle: "#64748b"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"]
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
