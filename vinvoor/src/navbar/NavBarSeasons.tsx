import type { MouseEvent } from "react";
import { ArrowDropDown, Refresh } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { useSeasons, useSetSeason } from "../hooks/useSeasons";
import { useSettings } from "../hooks/useSettings";

export function NavBarSeasons() {
  const { data: seasons } = useSeasons();
  const { data: settings, refetch } = useSettings();
  const { setSeason } = useSetSeason();

  const currentSeason = seasons?.find(season => season.isCurrent)?.id ?? -1;

  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | undefined>(
    undefined,
  );

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(undefined);
  };

  const handleClickSeason = (id: number) => {
    setSeason(id, { onSuccess: () => void refetch() });
    handleCloseUserMenu();
  };

  const handleResetSeason = () =>
    setSeason(currentSeason, {
      onSuccess: () => void refetch(),
    });

  return (
    <>
      {seasons && settings && (
        <>
          <Button
            onClick={handleOpenUserMenu}
            endIcon={<ArrowDropDown />}
            size="small"
            variant="outlined"
            sx={{
              textTransform: "none",
              color: "secondary.contrastText",
              borderColor: "secondary.contrastText",
              borderRadius: "20px",
            }}
          >
            <Typography>
              {seasons.find(season => season.id === settings.season)?.name}
            </Typography>
          </Button>
          <IconButton
            onClick={handleResetSeason}
            size="small"
            disabled={settings.season === currentSeason}
            color="error"
          >
            <Refresh />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {seasons.map(season => (
              <MenuItem
                key={season.id}
                onClick={() => handleClickSeason(season.id)}
              >
                <Typography>{season.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </>
  );
}
