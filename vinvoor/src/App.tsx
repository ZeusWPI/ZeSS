import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { NavBar } from "./NavBar";
import { User } from "./types/User";

export const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const sessionId = Cookies.get("session_id");

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        fetch("http://localhost:4000/api/user", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch(() => Cookies.remove("session_id"));
    }, [sessionId]);

    return (
        <>
            <NavBar user={user} />
            <Outlet />
        </>
    );
};
