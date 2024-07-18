import { LeaderboardOutlined } from "@mui/icons-material";
import { AppBar, Box, Container, Toolbar } from "@mui/material";
import {
    CogOutline,
    CreditCardMultipleOutline,
    CreditCardScanOutline,
} from "mdi-material-ui";
import { useContext } from "react";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { UserContext } from "../user/UserProvider";
import { NavBarLogo } from "./NavBarLogo";
import { NavBarPages } from "./NavBarPages";
import { NavBarSandwich } from "./NavBarSandwich";
import { NavBarUserMenu } from "./NavBarUserMenu";

export interface PageIcon {
    page: string;
    icon: JSX.Element;
}

const navBarPages: PageIcon[] = [
    { page: "Scans", icon: <CreditCardScanOutline sx={{ mr: ".3rem" }} /> },
    { page: "Cards", icon: <CreditCardMultipleOutline sx={{ mr: ".3rem" }} /> },
    { page: "Leaderboard", icon: <LeaderboardOutlined sx={{ mr: ".3rem" }} /> },
];

const userMenuPages: PageIcon[] = [
    { page: "Settings", icon: <CogOutline sx={{ mr: ".3rem" }} /> },
];

export const NavBar = () => {
    const {
        userState: { user },
    } = useContext(UserContext);

    const screenSize = {
        mobile: { xs: "flex", md: "none" },
        desktop: { xs: "none", md: "flex" },
    };

    return (
        <AppBar
            position="static"
            sx={{
                background:
                    "rgb(255,164,0) linear-gradient(45deg, rgba(255,164,0,1) 0%, rgba(255,127,0,1) 100%)",
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Display either the ZeSS logo or a sandwich menu */}

                    <Box sx={{ flexGrow: 1 }}>
                        <NavBarLogo sx={{ display: screenSize.desktop }} />

                        {user && (
                            <NavBarSandwich
                                pageIcons={navBarPages}
                                sx={{ display: screenSize.mobile }}
                            />
                        )}
                    </Box>

                    {/* Display either all the pages or the ZeSS logo */}

                    <Box sx={{ flexGrow: 1 }}>
                        {user && (
                            <NavBarPages
                                pageIcons={navBarPages}
                                sx={{ display: screenSize.desktop }}
                            />
                        )}

                        <NavBarLogo sx={{ display: screenSize.mobile }} />
                    </Box>

                    {/* Display a dark mode switch and the user menu */}

                    <Box sx={{ flexGrow: 0 }}>
                        <DarkModeToggle />
                        <NavBarUserMenu pageIcons={userMenuPages} />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
