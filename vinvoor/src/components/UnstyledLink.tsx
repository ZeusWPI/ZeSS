import { FC, HTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

interface UnstyledLinkProps {
    to: string;
    children: ReactNode;
    properties?: HTMLAttributes<HTMLAnchorElement>;
}

export const UnstyledLink: FC<UnstyledLinkProps> = ({
    to,
    children,
    properties,
}) => {
    return (
        <Link to={to} style={{ textDecoration: "none" }} {...properties}>
            {children}
        </Link>
    );
};
