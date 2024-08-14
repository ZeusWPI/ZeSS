import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const Login: FC<ButtonProps> = props => {
  const url = import.meta.env.VITE_BACKEND_URL as string;

  const handleClick = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${url}/login`;
    document.body.appendChild(form);
    form.submit();
  };

  return <Button onClick={handleClick} {...props} />;
};
