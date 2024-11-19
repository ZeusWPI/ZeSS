import type { ButtonProps } from "@mui/material";
import type { FC } from "react";
import { Button } from "@mui/material";

export const Login: FC<ButtonProps> = (props) => {
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
