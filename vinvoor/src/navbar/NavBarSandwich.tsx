import MenuIcon from "@mui/icons-material/Menu";
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import { FC, MouseEvent, useState } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { PageIcon } from "./NavBar";

interface NavBarSandwichProps {
    pageIcons: readonly PageIcon[];
    sx?: SxProps<Theme>;
}

export const NavBarSandwich: FC<NavBarSandwichProps> = ({ pageIcons, sx }) => {
    const [anchorElNav, setAnchorElNav] = useState<undefined | HTMLElement>(
        undefined
    );

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(undefined);
    };

    return (
        <Box sx={{ ...sx }}>
            <IconButton
                onClick={handleOpenNavMenu}
                sx={{ color: "secondary.contrastText" }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
            >
                {pageIcons.map(({ page, icon }) => (
                    <UnstyledLink key={page} to={page.toLowerCase()}>
                        <MenuItem onClick={handleCloseNavMenu}>
                            {icon}
                            <Typography>{page}</Typography>
                        </MenuItem>
                    </UnstyledLink>
                ))}
            </Menu>
        </Box>
    );
};
