import { Box, Button, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { UnstyledLink } from "../components/UnstyledLink";

interface NavBarLogoProps {
    sx?: SxProps<Theme>;
}

export const NavBarLogo: FC<NavBarLogoProps> = ({ sx }) => {
    return (
        <Box display="flex">
            <UnstyledLink to="/">
                <Button
                    color="inherit"
                    sx={{
                        ...sx,
                        textTransform: "none",
                        color: "white",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            letterSpacing: ".3rem",
                            fontWeight: 700,
                        }}
                    >
                        ZeSS
                    </Typography>
                </Button>
            </UnstyledLink>
            <Box sx={{ flexGrow: 1 }} />
        </Box>
    );
};
