import { useEffect } from "react";

export const Login = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        window.location.href = `${baseUrl}/login`;
    }, []);

    return <></>;
};
