import MenuIcon from "@mui/icons-material/Menu";
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "./types/User";

const pages = [];
const settings = ["Logout"];

interface Props {
    user: User | null;
}

export const NavBar: FC<Props> = ({ user }) => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <Button
                            sx={{
                                display: { xs: "none", md: "flex" },
                                textTransform: "none",
                                my: 2,
                                color: "white",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ letterSpacing: ".3rem", fontWeight: 700 }}
                            >
                                ZeSS
                            </Typography>
                        </Button>
                    </Link>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
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
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <Link
                                    id={page}
                                    to={page}
                                    style={{ textDecoration: "none" }}
                                >
                                    <MenuItem
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                    >
                                        <Typography textAlign="center">
                                            {page}
                                        </Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <Button
                                sx={{
                                    display: { xs: "flex", md: "none" },
                                    textTransform: "none",
                                    my: 2,
                                    color: "white",
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    noWrap
                                    sx={{
                                        mr: 2,
                                        letterSpacing: ".3rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    ZeSS
                                </Typography>
                            </Button>
                        </Link>
                    </Box>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map((page) => (
                            <Link
                                id={page}
                                to={page}
                                style={{ textDecoration: "none" }}
                            >
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                >
                                    {page}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {user ? (
                            <>
                                <Tooltip title="Open settings">
                                    <Button
                                        variant="outlined"
                                        onClick={handleOpenUserMenu}
                                        sx={{
                                            textTransform: "none",
                                            color: "white",
                                            borderColor: "white",
                                            borderWidth: "2px",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ color: "white" }}
                                        >
                                            {user.username}
                                        </Typography>
                                    </Button>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <Link
                                            id={setting}
                                            to={setting.toLocaleLowerCase()}
                                            style={{ textDecoration: "none" }}
                                        >
                                            <MenuItem
                                                key={setting}
                                                onClick={handleCloseUserMenu}
                                            >
                                                <Typography textAlign="center">
                                                    {setting}
                                                </Typography>
                                            </MenuItem>
                                        </Link>
                                    ))}
                                </Menu>
                            </>
                        ) : (
                            <Link to="Login" style={{ textDecoration: "none" }}>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{
                                        mt: "45px",
                                        textTransform: "none",
                                        my: 2,
                                        color: "white",
                                        borderColor: "white",
                                        borderWidth: "2px",
                                    }}
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
