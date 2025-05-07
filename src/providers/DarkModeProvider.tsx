import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { SetState } from "@/utils/types";

const STORAGE_KEY = "darkMode";

export const darkModeCtx = createContext<boolean>(false);
export const setDarkModeCtx = createContext<SetState<boolean>>(() => undefined);

export const useDarkMode = () => {
  return useContext(darkModeCtx);
};

export const useSetDarkMode = () => {
  return useContext(setDarkModeCtx);
};

export const DarkModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored === "true";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => {
      const newColorScheme = !!event.matches;

      setDarkMode(newColorScheme);
    };

    media.addEventListener("change", listener);
    return () => {
      media.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    // For Algolia DocSearch
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light",
    );
    // For TailwindCSS
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <darkModeCtx.Provider value={darkMode}>
      <setDarkModeCtx.Provider value={setDarkMode}>
        {children}
      </setDarkModeCtx.Provider>
    </darkModeCtx.Provider>
  );
};
