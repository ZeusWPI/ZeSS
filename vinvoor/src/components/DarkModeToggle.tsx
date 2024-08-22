import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";

export const DarkModeToggle = () => {
  const { themeMode, setTheme } = useContext(ThemeContext);

  const handleThemeChange = () =>
    setTheme(themeMode === "light" ? "dark" : "light");

  return (
    <Tooltip
      title={`Toggle ${themeMode === "light" ? "dark" : "light"} mode`}
      arrow
    >
      <IconButton onClick={handleThemeChange}>
        {themeMode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
      </IconButton>
    </Tooltip>
  );
};
