import { Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { NavBar } from "./navbar/NavBar";
import { ThemeProvider } from "./theme/ThemeProvider";
import { UserProvider } from "./user/UserProvider";

export const App = () => {
    return (
        <ThemeProvider>
            <CssBaseline enableColorScheme>
                <UserProvider>
                    <NavBar />
                    <Container maxWidth="xl" sx={{ my: "2%" }}>
                        <Outlet />
                    </Container>
                </UserProvider>
            </CssBaseline>
        </ThemeProvider>
    );
};
