import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { App } from "./App.tsx";
import { Cards } from "./cards/Cards.tsx";
import { ErrorPage } from "./errors/ErrorPage.tsx";
import { Leaderboard } from "./leaderboard/Leaderboard.tsx";
import { Login } from "./user/Login.tsx";
import { Logout } from "./user/Logout.tsx";

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
                path: "cards",
                element: <Cards />,
            },
            {
                path: "leaderboard",
                element: <Leaderboard />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
