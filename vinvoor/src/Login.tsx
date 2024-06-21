import { useEffect } from "react";

export const Login = () => {
    useEffect(() => {
        window.location.href = "http://localhost:4000/login";
    }, []);

    return <></>;
};
