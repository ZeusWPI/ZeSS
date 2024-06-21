import { Box, Button, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { UnstyledLink } from "../components/UnstyledLink";

interface NavBarPagesProps {
    pages: readonly string[];
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
                            color: "white",
                        }}
                    >
                        <Typography>{page}</Typography>
                    </Button>
                </UnstyledLink>
            ))}
        </Box>
    );
};
