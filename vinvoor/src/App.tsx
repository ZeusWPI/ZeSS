import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import "./App.css";
import { NavBar } from "./navbar/NavBar";
import { ThemeProvider } from "./theme/ThemeProvider";
import { UserProvider } from "./user/UserProvider";

export const App = () => {
    return (
        <ThemeProvider>
            <CssBaseline enableColorScheme>
                <UserProvider>
                    <NavBar />
                    <Outlet />
                </UserProvider>
            </CssBaseline>
        </ThemeProvider>
    );
};
