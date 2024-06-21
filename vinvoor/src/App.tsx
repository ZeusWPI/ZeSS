import { ThemeProvider } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./App.css";
import { NavBar } from "./navbar/NavBar";
import { theme } from "./theme/theme";
import { UserProvider } from "./user/UserProvider";

export const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <NavBar />
                <Outlet />
            </UserProvider>
        </ThemeProvider>
    );
};
