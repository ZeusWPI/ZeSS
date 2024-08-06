import { ThemeProvider as MUIThemeProvider } from "@mui/material";
import Cookies from "js-cookie";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { ThemeMode, themeModes } from "../theme";

interface ThemeProviderProps {
    children: ReactNode;
}

interface ThemeContextProps {
    themeMode: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
    themeMode: "light",
    setTheme: () => {},
});

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(
        (import.meta.env.VITE_DEFAULT_THEME_MODE as ThemeMode) || "light"
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
