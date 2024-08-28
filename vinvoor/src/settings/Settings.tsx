import { ChangeEvent, useState } from "react";
import { usePatchSettings, useSettings } from "../hooks/useSettings";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { adjustableSettings } from "../types/settings";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";

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
  if (!settingsTruth) return null; // Can never happen

  const patchSettings = usePatchSettings();
  const [settings, setSettings] = useState({ ...settingsTruth });
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = () => {
    patchSettings.mutate(
      {
        scanInOut: settings.scanInOut,
        leaderboard: settings.leaderboard,
        public: settings.public,
      },
      {
        onSuccess: () => {
          enqueueSnackbar(saveSuccess, { variant: "success" });
          void refetch();
        },
        onError: () => enqueueSnackbar(saveFailure, { variant: "error" }),
      },
    );
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

  return (
    <Grid
      container
      alignItems="stretch"
      justifyContent="space-between"
      columnSpacing={4}
      rowSpacing={1}
    >
      <Grid item xs={6}>
        <Paper elevation={4} sx={{ p: "10px" }}>
          <FormControl>
            {adjustableSettings.map(setting => (
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    checked={settings[setting.id] as boolean}
                    onChange={handleChange}
                    name={setting.id}
                  />
                }
                label={
                  <Box display="flex" color="primary.contrastText">
                    <Typography>{setting.name}</Typography>
                    <Tooltip title={setting.description} placement="right">
                      <HelpCircleOutline
                        sx={{
                          fontSize: "15px",
                          ml: ".3rem",
                        }}
                      />
                    </Tooltip>
                  </Box>
                }
                key={setting.id}
              />
            ))}
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={6}>
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