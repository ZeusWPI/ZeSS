import {
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Cow, ExitRun, ShieldAccountOutline } from "mdi-material-ui";
import { FC, MouseEvent, useContext, useState } from "react";
import { UnstyledLink } from "../components/UnstyledLink";
import { UserContext } from "../providers/UserProvider";
import { Login } from "../user/Login";
import { Logout } from "../user/Logout";
import { PageIcon } from "./NavBar";

interface NavBarUserMenuProps {
  pageIcons: readonly PageIcon[];
  selectedPage: string;
  handleSelectedPage: (page: string) => void;
}

export const NavBarUserMenu: FC<NavBarUserMenuProps> = ({
  pageIcons,
  selectedPage,
  handleSelectedPage,
}) => {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const isBrowserView = useMediaQuery(theme.breakpoints.up("sm"));
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | undefined>(
    undefined,
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
              color: "secondary.contrastText",
              borderTop: "2px solid transparent",
              borderBottom: "2px solid transparent",
              ...(selectedPage === "user" && {
                borderBottom: theme =>
                  `2px solid ${theme.palette.secondary.main}`,
              }),
            }}
          >
            <ShieldAccountOutline sx={{ mr: "3px" }} />
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
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    if (isBrowserView) handleSelectedPage("user");
                  }}
                >
                  {icon}
                  <Typography>{page}</Typography>
                </MenuItem>
              </UnstyledLink>
            ))}
            <Divider />
            {user.admin && (
              <UnstyledLink to="admin">
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    if (isBrowserView) handleSelectedPage("user");
                  }}
                  sx={{
                    paddingX: "0",
                    justifyContent: "center",
                    backgroundColor: "error.dark",
                    "&:hover": {
                      backgroundColor: "error.light",
                    },
                  }}
                >
                  <Cow sx={{ mr: ".3rem", ml: "-12px" }} />
                  <Typography>Admin</Typography>
                </MenuItem>
              </UnstyledLink>
            )}
            <MenuItem
              onClick={handleCloseUserMenu}
              sx={{
                paddingX: "0",
                justifyContent: "center",
              }}
            >
              <Logout
                sx={{
                  color: "inherit",
                  textTransform: "none",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <ExitRun sx={{ mr: ".3rem", ml: "-9px" }} />
                {/* Hacky way to center it with the other icons */}
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
