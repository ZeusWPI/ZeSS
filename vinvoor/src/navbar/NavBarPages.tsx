import { Box, Button, SxProps, Theme } from "@mui/material";
import { FC } from "react";
import { UnstyledLink } from "../components/UnstyledLink";

interface NavBarPagesProps {
    pages: string[];
    sx?: SxProps<Theme>;
}

export const NavBarPages: FC<NavBarPagesProps> = ({ pages, sx }) => {
    return (
        <Box sx={{ ...sx }}>
            {pages.map((page) => (
                <UnstyledLink key={page} to={page.toLowerCase()}>
                    <Button
                        color="inherit"
                        sx={{
                            my: 2,
                            color: "white",
                            display: "block",
                        }}
                    >
                        {page}
                    </Button>
                </UnstyledLink>
            ))}
        </Box>
    );
};
