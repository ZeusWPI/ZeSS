import type { FC } from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";

export const UnstyledLink: FC<LinkProps> = (props) => {
  return (
    <Link {...props} style={{ color: "inherit", textDecoration: "none" }} />
  );
};
