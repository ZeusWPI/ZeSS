import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { App } from "./App.tsx";
import { Cards } from "./cards/Cards.tsx";
import { ErrorPage } from "./errors/ErrorPage.tsx";
import { Leaderboard } from "./leaderboard/Leaderboard.tsx";
import { Scans } from "./scans/Scans.tsx";
import { ThemeProvider } from "./theme/ThemeProvider";
import { Login } from "./user/Login.tsx";
import { Logout } from "./user/Logout.tsx";
import { UserProvider } from "./user/UserProvider.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "logout",
                element: <Logout />,
            },
            {
                path: "scans",
                element: <Scans />,
            },
            {
                path: "cards",
                element: <Cards />,
            },
            {
                path: "leaderboard",
                element: <Leaderboard />,
            },
            {
                path: "settings",
                
            }
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <CssBaseline enableColorScheme>
                <UserProvider>
                    <ConfirmProvider>
                        <SnackbarProvider
                            anchorOrigin={{
                                horizontal: "center",
                                vertical: "top",
                            }}
                        >
                            <RouterProvider router={router} />
                        </SnackbarProvider>
                    </ConfirmProvider>
                </UserProvider>
            </CssBaseline>
        </ThemeProvider>
    </React.StrictMode>
);
