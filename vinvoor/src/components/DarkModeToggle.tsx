import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeProvider";

export const DarkModeToggle = () => {
    const { themeMode, toggleTheme } = useContext(ThemeContext);

    const handleThemeChange = () => {
        toggleTheme();
    };

    return (
        <Tooltip
            title={`Toggle ${themeMode === "light" ? "dark" : "light"} mode`}
            arrow
        >
            <IconButton onClick={handleThemeChange}>
                {themeMode === "light" ? (
                    <DarkModeOutlined />
                ) : (
                    <LightModeOutlined />
                )}
            </IconButton>
        </Tooltip>
    );
};
