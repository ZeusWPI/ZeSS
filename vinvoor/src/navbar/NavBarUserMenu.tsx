import { AccountCircle } from "@mui/icons-material";
import { Button, Menu, MenuItem, Typography } from "@mui/material";
import ExitRun from "mdi-material-ui/ExitRun";
import { FC, MouseEvent, useContext, useState } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { Login } from "../user/Login";
import { Logout } from "../user/Logout";
import { UserContext } from "../user/UserProvider";
import { PageIcon } from "./NavBar";

interface NavBarUserMenuProps {
    pageIcons: readonly PageIcon[];
}

export const NavBarUserMenu: FC<NavBarUserMenuProps> = ({ pageIcons }) => {
    const {
        userState: { user },
    } = useContext(UserContext);
    const [anchorElUser, setAnchorElUser] = useState<HTMLElement | undefined>(
        undefined
    );

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
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
                        onClick={handleOpenUserMenu}
                        sx={{
                            textTransform: "none",
                            color: "white",
                        }}
                    >
                        <AccountCircle sx={{ mr: "3px" }} />
                        <Typography variant="h6">{user.username}</Typography>
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
                        {pageIcons.map(({ page, icon }) => (
                            <UnstyledLink key={page} to={page.toLowerCase()}>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    {icon}
                                    <Typography>{page}</Typography>
                                </MenuItem>
                            </UnstyledLink>
                        ))}
                        <MenuItem>
                            <Logout>
                                <ExitRun sx={{ mr: ".3rem" }} />
                                <Typography>Logout</Typography>
                            </Logout>
                        </MenuItem>
                    </Menu>
                </>
            ) : (
                <Login sx={{ color: "inherit", size: "large" }}>
                    <Typography>Login</Typography>
                </Login>
            )}
        </>
    );
};
