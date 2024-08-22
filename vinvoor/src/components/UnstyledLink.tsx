import { FC } from "react";
import { Link, LinkProps } from "react-router-dom";

export const UnstyledLink: FC<LinkProps> = props => {
  return (
    <Link {...props} style={{ color: "inherit", textDecoration: "none" }} />
  );
};
