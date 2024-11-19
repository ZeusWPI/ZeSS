import type { FC, ReactNode } from "react";
import type { ThemeMode } from "../themes/theme";
import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { themeModes } from "../themes/theme";

/* eslint-disable  react-refresh/only-export-components, react/no-unstable-context-value */
// TODO

interface ThemeProviderProps {
  children: ReactNode;
}

interface ThemeContextProps {
  themeMode: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  themeMode: "light",
  setTheme: () => {
    // No operation, placeholder function
  },
});

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  const setTheme = (theme: ThemeMode) => {
    setThemeMode(theme);
    Cookies.set("theme", theme as string, {
      sameSite: "Lax",
    });
  };

  useEffect(() => {
    const storedTheme = Cookies.get("theme");

    if (storedTheme) {
      setThemeMode(storedTheme as ThemeMode);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, setTheme }}>
      <MUIThemeProvider theme={themeModes[themeMode]}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
