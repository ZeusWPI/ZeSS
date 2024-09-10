import { LeaderboardOutlined } from "@mui/icons-material";
import { AppBar, Box, Container, Toolbar } from "@mui/material";
import {
  CogOutline,
  CreditCardMultipleOutline,
  CreditCardScanOutline,
} from "mdi-material-ui";
import { useState } from "react";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { NavBarLogo } from "./NavBarLogo";
import { NavBarPages } from "./NavBarPages";
import { NavBarSandwich } from "./NavBarSandwich";
import { NavBarUserMenu } from "./NavBarUserMenu";
import { useUser } from "../hooks/useUser";

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
  const { data: user } = useUser();
  const [selectedPage, setSelectedPage] = useState<string>("");

  const screenSize = {
    mobile: { xs: "flex", md: "none" },
    desktop: { xs: "none", md: "flex" },
  };

  const handleSelectedPage = (page: string) => setSelectedPage(page);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Display either the ZeSS logo or a sandwich menu */}

          <Box sx={{ flexGrow: 1 }}>
            <NavBarLogo
              sx={{ display: screenSize.desktop }}
              selectedPage={selectedPage}
              handleSelectedPage={handleSelectedPage}
            />

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
                selectedPage={selectedPage}
                handleSelectedPage={handleSelectedPage}
              />
            )}

            <NavBarLogo sx={{ display: screenSize.mobile }} />
          </Box>

          {/* Display a dark mode switch and the user menu */}

          <Box sx={{ flexGrow: 0 }}>
            <DarkModeToggle />
            <NavBarUserMenu
              pageIcons={userMenuPages}
              selectedPage={selectedPage}
              handleSelectedPage={handleSelectedPage}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
