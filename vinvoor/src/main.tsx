import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { App } from "./App.tsx";
import { Cards } from "./cards/Cards.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { ErrorPage } from "./errors/ErrorPage.tsx";
import { Leaderboard } from "./leaderboard/Leaderboard.tsx";
import { CustomSnackbarProvider } from "./providers/CustomSnackbarProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { UserProvider } from "./providers/UserProvider.tsx";
import { Scans } from "./scans/Scans.tsx";
import { Admin } from "./settings/admin/Admin.tsx";
import { SettingsOverview } from "./settings/SettingsOverview.tsx";
import { Login } from "./user/Login.tsx";
import { Logout } from "./user/Logout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NavBar } from "./navbar/NavBar.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: (
      <>
        <NavBar />
        <ErrorPage />
      </>
    ),
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
        element: <SettingsOverview />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CssBaseline enableColorScheme>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <ConfirmProvider>
              <CustomSnackbarProvider>
                <RouterProvider router={router} />
              </CustomSnackbarProvider>
            </ConfirmProvider>
          </QueryClientProvider>
        </UserProvider>
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>,
);
