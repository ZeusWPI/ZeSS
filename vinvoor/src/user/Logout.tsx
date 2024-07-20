import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const Logout: FC<ButtonProps> = (props) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleClick = () => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `${apiUrl}/logout`;
        document.body.appendChild(form);
        form.submit();
    };

    return <Button onClick={handleClick} {...props} />;
};
