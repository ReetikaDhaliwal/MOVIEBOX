/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        backdrop: "#160F13",
        curtain: "#2B141C",
        velvet: "#6B1E2B",
        marquee: "#D4A94A",
        cream: "#F2E9DC",
        mauve: "#9C8390",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};