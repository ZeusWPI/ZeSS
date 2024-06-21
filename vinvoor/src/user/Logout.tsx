import { useEffect } from "react";

export const Logout = () => {
    useEffect(() => {
        window.location.href = "http://localhost:4000/logout";
    }, []);

    return <></>;
};
