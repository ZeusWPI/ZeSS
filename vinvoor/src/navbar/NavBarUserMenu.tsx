import { AccountCircle } from "@mui/icons-material";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import { FC, useContext, useState } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { UserContext } from "../user/UserProvider";

interface NavBarUserMenuProps {
    settings: string[];
}

export const NavBarUserMenu: FC<NavBarUserMenuProps> = ({ settings }) => {
    const { user } = useContext(UserContext);
    const [anchorElUser, setAnchorElUser] = useState<undefined | HTMLElement>(
        undefined
    );

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(undefined);
    };

    return (
        <>
            {user ? (
                <>
                    <Button
                        color="inherit"
                        onClick={handleOpenUserMenu}
                        sx={{
                            textTransform: "none",
                            color: "white",
                            borderColor: "white",
                            borderWidth: "2px",
                        }}
                    >
                        <AccountCircle sx={{ mr: "3px" }} />
                        <Typography variant="h6" sx={{ color: "white" }}>
                            {user.username}
                        </Typography>
                    </Button>
                    <Menu
                        sx={{ mt: "45px" }}
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
                            <UnstyledLink
                                key={setting}
                                to={setting.toLowerCase()}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Typography>{setting}</Typography>
                                </MenuItem>
                            </UnstyledLink>
                        ))}
                    </Menu>
                </>
            ) : (
                <UnstyledLink to="login">
                    <Button
                        color="inherit"
                        size="large"
                        sx={{
                            mt: "45px",
                            textTransform: "none",
                            my: 2,
                            color: "white",
                        }}
                    >
                        Login
                    </Button>
                </UnstyledLink>
            )}
        </>
    );
};
