import { useEffect } from "react";

export const Logout = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        window.location.href = `${baseUrl}/logout`;
    }, []);

    return <></>;
};
