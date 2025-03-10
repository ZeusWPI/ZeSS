import { LeaderboardOutlined } from "@mui/icons-material";
import { AppBar, Box, Container, Toolbar, useMediaQuery } from "@mui/material";
import {
  CogOutline,
  CreditCardMultipleOutline,
  CreditCardScanOutline,
} from "mdi-material-ui";
import { useState } from "react";
import { BrowserView } from "../components/BrowserView";
import { DarkModeToggle } from "../components/DarkModeToggle";
import { useUser } from "../hooks/useUser";
import { NavBarLogo } from "./NavBarLogo";
import { NavBarPages } from "./NavBarPages";
import { NavBarSandwich } from "./NavBarSandwich";
import { NavBarSeasons } from "./NavBarSeasons";
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

export function NavBar() {
  const { data: user } = useUser();
  const [selectedPage, setSelectedPage] = useState<string>("");
  const showSeasons = useMediaQuery("(min-width:400px)");

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

          {/* Display a season selector */}

          {showSeasons && (
            <Box
              sx={{
                flexGrow: 0,
                mr: "20px",
                minWidth: "180px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <NavBarSeasons />
            </Box>
          )}

          {/* Display a dark mode switch and the user menu */}

          <Box>
            <BrowserView>
              <DarkModeToggle />
            </BrowserView>
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
}
