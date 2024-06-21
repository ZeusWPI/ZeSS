import { AppBar, Box, Container, Toolbar } from "@mui/material";
import { useContext } from "react";
import { UserContext } from "../user/UserProvider";
import { NavBarLogo } from "./NavBarLogo";
import { NavBarPages } from "./NavBarPages";
import { NavBarSandwich } from "./NavBarSandwich";
import { NavBarUserMenu } from "./NavBarUserMenu";

const pages = ["Cards"];
const settings = ["Logout"];

export const NavBar = () => {
    const { user } = useContext(UserContext);

    const screenSize = {
        mobile: { xs: "flex", md: "none" },
        desktop: { xs: "none", md: "flex" },
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Display either the ZeSS logo or a sandwich menu */}

                    <Box sx={{ flexGrow: 1 }}>
                        <NavBarLogo sx={{ display: screenSize.desktop }} />

                        {user && (
                            <NavBarSandwich
                                pages={pages}
                                sx={{ display: screenSize.mobile }}
                            />
                        )}
                    </Box>

                    {/* Display either all the pages or the ZeSS logo */}

                    <Box sx={{ flexGrow: 1 }}>
                        {user && (
                            <NavBarPages
                                pages={pages}
                                sx={{ display: screenSize.desktop }}
                            />
                        )}

                        <NavBarLogo sx={{ display: screenSize.mobile }} />
                    </Box>

                    {/* Display the user menu */}

                    <Box sx={{ flexGrow: 0 }}>
                        <NavBarUserMenu settings={settings} />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
