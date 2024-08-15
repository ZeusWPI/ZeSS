import { Box, Button, SxProps, Theme, Typography } from "@mui/material";
import { FC } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { PageIcon } from "./NavBar";

interface NavBarPagesProps {
  pageIcons: readonly PageIcon[];
  sx?: SxProps<Theme>;
  selectedPage: string;
  handleSelectedPage: (page: string) => void;
}

export const NavBarPages: FC<NavBarPagesProps> = ({
  pageIcons,
  sx,
  selectedPage,
  handleSelectedPage,
}) => {
  return (
    <Box sx={{ ...sx }}>
      {pageIcons.map(({ page, icon }) => (
        <UnstyledLink key={page} to={page.toLowerCase()}>
          <Button
            onClick={() => handleSelectedPage(page)}
            sx={{
              color: "secondary.contrastText",
              borderTop: "2px solid transparent",
              borderBottom: "2px solid transparent",
              ...(selectedPage === page && {
                borderBottom: theme =>
                  `2px solid ${theme.palette.secondary.main}`,
              }),
              mr: 1,
            }}
          >
            {icon}

            <Typography>{page}</Typography>
          </Button>
        </UnstyledLink>
      ))}
    </Box>
  );
};
