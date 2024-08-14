import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const Logout: FC<ButtonProps> = props => {
  const url = import.meta.env.VITE_BACKEND_URL as string;

  const handleClick = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${url}/logout`;
    document.body.appendChild(form);
    form.submit();
  };

  return <Button onClick={handleClick} {...props} />;
};
