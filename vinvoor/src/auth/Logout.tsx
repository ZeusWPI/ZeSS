import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";
import { useLogout } from "../hooks/useUser";

export const Logout: FC<ButtonProps> = props => {
  const logout = useLogout();
  const handleClick = () => {
    logout.mutate();
  };

  return <Button onClick={handleClick} {...props} />;
};
