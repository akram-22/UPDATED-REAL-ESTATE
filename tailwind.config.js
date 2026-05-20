/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#c9a84c",
        navy: "#0f1f3d",
        cream: "#faf9f6",
        background: "#ffffff",
        foreground: "#0f1f3d",
        card: "#ffffff",
        border: "#e5e7eb",
        secondary: "#f3f4f6",
        muted: { foreground: "#6b7280" },
      },
      fontFamily: { serif: ["Georgia", "Times New Roman", "serif"] },
    },
  },
  plugins: [],
}
