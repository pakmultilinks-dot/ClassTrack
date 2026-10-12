import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { applyTheme } from "./components/ui/ThemeToggle";

const App = () => {
  useEffect(() => {
    applyTheme(localStorage.getItem("classtrack_theme") || "dark");
  }, []);

  return (
    <AppRoutes />
  );
};

export default App;
