/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        dmsans: ["DM Sans", "sans-serif"]
      },
      colors: {
        brand: {
          primary: "#0D9488",
          secondary: "#F59E0B",
          dark: "#0A0F1A",
          card: "#0F1926",
          muted: "#94A3B8"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(13, 148, 136, 0.35)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "brand-radial": "radial-gradient(circle at top left, rgba(13, 148, 136, 0.35), transparent 32%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.28), transparent 28%)"
      }
    }
  },
  plugins: []
};
