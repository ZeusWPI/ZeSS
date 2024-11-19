import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmProvider } from "material-ui-confirm";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App.tsx";
import { Login } from "./auth/Login.tsx";
import { Logout } from "./auth/Logout.tsx";
import { Cards } from "./cards/Cards.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { ErrorPage } from "./errors/ErrorPage.tsx";
import { Leaderboard } from "./leaderboard/Leaderboard.tsx";
import { NavBar } from "./navbar/NavBar.tsx";
import { CustomSnackbarProvider } from "./providers/CustomSnackbarProvider.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { Scans } from "./scans/Scans.tsx";
import { Admin } from "./settings/admin/Admin.tsx";
import { SettingsOverview } from "./settings/SettingsOverview.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-tooltip/dist/react-tooltip.css";

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
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>
            <CustomSnackbarProvider>
              <RouterProvider router={router} />
            </CustomSnackbarProvider>
          </ConfirmProvider>
        </QueryClientProvider>
      </CssBaseline>
    </ThemeProvider>
  </React.StrictMode>,
);
