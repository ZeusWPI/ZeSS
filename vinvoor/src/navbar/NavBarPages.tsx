import { Box, Button, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { PageIcon } from "./NavBar";

interface NavBarPagesProps {
    pageIcons: readonly PageIcon[];
    sx?: SxProps<Theme>;
}

export const NavBarPages: FC<NavBarPagesProps> = ({ pageIcons, sx }) => {
    return (
        <Box sx={{ ...sx }}>
            {pageIcons.map(({ page, icon }) => (
                <UnstyledLink key={page} to={page.toLowerCase()}>
                    <Button
                        sx={{
                            color: "white",
                        }}
                    >
                        {icon}

                        <Typography>{page}</Typography>
                    </Button>
                </UnstyledLink>
            ))}
        </Box>
    );
};
