import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSeasons } from "../hooks/useSeasons";
import { usePatchSettings, useSettings } from "../hooks/useSettings";

const saveSuccess = "Settings saved successfully";
const saveFailure = "Unable to save settings";
const handleDeleteContent = (
  <Box>
    <Typography gutterBottom>
      Are you sure you want to delete all your data?
    </Typography>
    <Typography variant="h5" color="error.dark" mb={5}>
      This is irreversible!
    </Typography>
  </Box>
);

export const Settings = () => {
  const { data: settingsTruth, refetch } = useSettings();
  const { data: seasons } = useSeasons();
  if (!settingsTruth || !seasons) return null; // Can never happen

  const patchSettings = usePatchSettings();
  const [settings, setSettings] = useState({ ...settingsTruth });
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  const handleSeasonChange = (event: SelectChangeEvent) =>
    setSettings({
      ...settings,
      season: parseInt(event.target.value),
    });

  const handleSubmit = () => {
    patchSettings.mutate(settings, {
      onSuccess: () => {
        enqueueSnackbar(saveSuccess, { variant: "success" });
        void refetch();
      },
      onError: () => enqueueSnackbar(saveFailure, { variant: "error" }),
    });
  };

  const handleDelete = () => {
    confirm({
      title: "Delete data",
      content: handleDeleteContent,
      acknowledgement: "Delete all my data",
      confirmationText: "Delete",
      confirmationButtonProps: { color: "error" },
    })
      .then(() =>
        enqueueSnackbar("This is not possible yet", {
          variant: "error",
        }),
      )
      .catch(() => {
        // Required otherwise the confirm dialog will throw an error in the console
      });
  };

  useEffect(() => {
    setSettings({ ...settingsTruth, season: settingsTruth.season });
  }, [settingsTruth.season]);

  return (
    <Grid
      container
      alignItems="stretch"
      justifyContent="space-between"
      columnSpacing={4}
      rowSpacing={1}
    >
      <Grid item xs={12} sm={6}>
        <Paper elevation={4} sx={{ p: "10px" }}>
          <Stack direction="row" display="flex" alignItems="center">
            <Tooltip
              title="Season for which to display data for"
              placement="right"
            >
              <HelpCircleOutline
                sx={{
                  fontSize: "15px",
                }}
              />
            </Tooltip>
            <Typography>Select season:</Typography>
            <Select
              value={
                seasons
                  .find(season => season.id === settings.season)
                  ?.id.toString() ?? seasons[0].id.toString()
              }
              onChange={handleSeasonChange}
              sx={{ ml: "20px" }}
              size="small"
              variant="standard"
            >
              {seasons.map(season => (
                <MenuItem key={season.id} value={season.id}>
                  {season.name}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper elevation={4} sx={{ p: "10px", height: "100%" }}>
          <Stack
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Typography variant="body2">More settings coming soon!</Typography>
            <Typography variant="body2">...yay?</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sx={{ mt: "1rem" }}>
        <Button variant="outlined" fullWidth onClick={handleSubmit}>
          Save
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          color="error"
          onClick={handleDelete}
        >
          Delete data
        </Button>
      </Grid>
    </Grid>
  );
};
