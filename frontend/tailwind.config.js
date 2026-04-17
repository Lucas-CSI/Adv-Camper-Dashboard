/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        cyber: {
          bg:       "#0a0c10",
          surface:  "#10131a",
          card:     "#151820",
          border:   "#1e2330",
          accent:   "#00ff87",
          accent2:  "#00c4ff",
          danger:   "#ff4d6d",
          warning:  "#ffb830",
          muted:    "#4a5568",
          text:     "#e2e8f0",
          subtext:  "#8892a4",
        },
      },
      boxShadow: {
        glow:    "0 0 20px rgba(0,255,135,0.15)",
        glow2:   "0 0 20px rgba(0,196,255,0.15)",
        card:    "0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-up":    "fadeUp 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "scan":       "scan 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};
