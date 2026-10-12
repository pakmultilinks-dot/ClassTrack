import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.classList.toggle("theme-light", theme === "light");
  root.classList.toggle("theme-dark", theme !== "light");
  root.style.colorScheme = theme === "light" ? "light" : "dark";
};

const ThemeToggle = ({ compact = false }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("classtrack_theme") || "dark");

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("classtrack_theme", theme);
  }, [theme]);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-brand-muted transition hover:border-brand-primary/50 hover:text-white ${
        compact ? "h-11 w-11 px-0" : "px-4 py-3"
      }`}
      aria-label="Toggle theme"
    >
      {isLight ? <FiMoon /> : <FiSun />}
      {!compact && (isLight ? "Dark Mode" : "Light Mode")}
    </button>
  );
};

export default ThemeToggle;
