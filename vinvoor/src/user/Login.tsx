import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

export const Login: FC<ButtonProps> = props => {
  const baseUrl = import.meta.env.VITE_BASE_URL as string;

  const handleClick = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${baseUrl}/login`;
    document.body.appendChild(form);
    form.submit();
  };

  return <Button onClick={handleClick} {...props} />;
};
