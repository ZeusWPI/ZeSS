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
import { FC, useState } from "react";
import { UnstyledLink } from "../components/UnstyledLink";

interface NavBarSandwichProps {
    pages: string[];
    sx?: SxProps<Theme>;
}

export const NavBarSandwich: FC<NavBarSandwichProps> = ({ pages, sx }) => {
    const [anchorElNav, setAnchorElNav] = useState<undefined | HTMLElement>(
        undefined
    );

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(undefined);
    };

    return (
        <Box sx={{ ...sx }}>
            <IconButton onClick={handleOpenNavMenu} sx={{ color: "white" }}>
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
                {pages.map((page) => (
                    <UnstyledLink key={page} to={page.toLowerCase()}>
                        <MenuItem onClick={handleCloseNavMenu}>
                            <Typography>{page}</Typography>
                        </MenuItem>
                    </UnstyledLink>
                ))}
            </Menu>
        </Box>
    );
};
