import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import Cookies from "js-cookie";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./theme";

type ThemeMode = "light" | "dark";

interface ThemeProviderProps {
    children: ReactNode;
}

interface ThemeContextProps {
    themeMode: ThemeMode;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
    themeMode: "light",
    toggleTheme: () => {},
});

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(
        (import.meta.env.VITE_DEFAULT_THEME_MODE as ThemeMode) || "light"
    );

    const toggleTheme = () => {
        setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        Cookies.set("theme", themeMode === "light" ? "dark" : "light", {
            sameSite: "Lax",
        });
    };

    const theme = themeMode === "light" ? lightTheme : darkTheme;

    useEffect(() => {
        const storedTheme = Cookies.get("theme");

        if (storedTheme) {
            setThemeMode(storedTheme as ThemeMode);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
        </ThemeContext.Provider>
    );
};
