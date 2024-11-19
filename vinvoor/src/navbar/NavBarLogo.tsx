import type { SxProps, Theme } from "@mui/material";
import type { FC } from "react";
import { Box, Button, Typography } from "@mui/material";
import { HexagonSlice6 } from "mdi-material-ui";
import { useContext } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { ThemeContext } from "../providers/ThemeProvider";

interface NavBarLogoProps {
  sx?: SxProps<Theme>;
  selectedPage?: string;
  handleSelectedPage?: (page: string) => void;
}

const CLICK_AMOUNT = 10;
const CLICK_TIME_MS = 1000;

let pressedAmount = 0;
let startTimePress = 0;

export const NavBarLogo: FC<NavBarLogoProps> = ({
  sx,
  selectedPage,
  handleSelectedPage,
}) => {
  const { setTheme } = useContext(ThemeContext);
  const handleClick = () => {
    if (handleSelectedPage)
      handleSelectedPage("home");

    if (pressedAmount < CLICK_AMOUNT) {
      if (pressedAmount === 0)
        startTimePress = Date.now();

      pressedAmount++;

      if (
        pressedAmount === CLICK_AMOUNT
        && Date.now() - startTimePress <= CLICK_TIME_MS
      ) {
        setTheme("kak");
      }
    }
  };

  return (
    <Box display="flex">
      <UnstyledLink to="/">
        <Button
          color="inherit"
          onClick={handleClick}
          sx={{
            ...sx,
            textTransform: "none",
            color: "secondary.contrastText",
            borderTop: "2px solid transparent",
            borderBottom: "2px solid transparent",
            ...(selectedPage === "home" && {
              borderBottom: theme =>
                `2px solid ${theme.palette.secondary.main}`,
            }),
          }}
        >
          <HexagonSlice6 sx={{ mr: ".3rem" }} />
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
