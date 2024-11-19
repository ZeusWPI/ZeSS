import type { ButtonProps } from "@mui/material";
import type { FC } from "react";
import { Button } from "@mui/material";
import { useLogout } from "../hooks/useUser";

export const Logout: FC<ButtonProps> = (props) => {
  const logout = useLogout();
  const handleClick = () => {
    logout.mutate();
  };

  return <Button onClick={handleClick} {...props} />;
};
