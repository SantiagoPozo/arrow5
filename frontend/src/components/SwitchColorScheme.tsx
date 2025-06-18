import React, { useState, useEffect } from "react";
import "../styles/components/_SwitchColorScheme.sass"; // Import SASS styles

type ColorMode = "light" | "dark";

const ToggleColorMode: React.FC = () => {
  const [mode, setMode] = useState<ColorMode>("light");

  // Al montar, recuperar el modo almacenado o usar la preferencia del dispositivo.
  useEffect(() => {
    const storedMode = localStorage.getItem("colorMode") as ColorMode | null;
    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
      document.documentElement.setAttribute("data-theme", storedMode);
    } else {
      // Si no hay preferencia guardada, usa la media query para determinar el modo
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const defaultMode: ColorMode = prefersDark ? "dark" : "light";
      setMode(defaultMode);
      document.documentElement.setAttribute("data-theme", defaultMode);
      localStorage.setItem("colorMode", defaultMode);
    }
  }, []);

  // Función para alternar el modo de color
  const toggleMode = () => {
    const newMode: ColorMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("colorMode", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

  return (
    <button id="switch-color-mode" onClick={toggleMode}>
      {mode === "light" ? "☾" : "☼"}
    </button>
  );
};

export default ToggleColorMode;
