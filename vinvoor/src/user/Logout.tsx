import { Button, ButtonProps } from "@mui/material";
import { FC, useContext } from "react";
import { postApi } from "../util/fetch";
import { UserContext } from "../providers/UserProvider";

export const Logout: FC<ButtonProps> = props => {
  const { invalidateUser } = useContext(UserContext);
  const handleClick = () => {
    void postApi("logout").finally(() => invalidateUser());
  };

  return <Button onClick={handleClick} {...props} />;
};
