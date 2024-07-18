import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Paper,
    Tooltip,
    Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { HelpCircleOutline } from "mdi-material-ui";
import { useSnackbar } from "notistack";
import { ChangeEvent, useState } from "react";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { useFetch } from "../hooks/useFetch";
import {
    adjustableSettings,
    converSettingsJSON,
    Settings,
} from "../types/settings";
import { patchApi } from "../util/fetch";

const defaultSettings: Settings = {
    id: -1,
    createdAt: new Date(),
    scanInOut: false,
    leaderboard: false,
    public: false,
};

const saveSuccess = "Settings saved successfully";
const saveFailure = "Unable to save settings";
const handleDeleteContent = (
    <Box>
        <Typography gutterBottom>
            Are you sure you want to delete all your data?
        </Typography>
        <Typography variant="h5" color="error" mb={5}>
            This is irreversible!
        </Typography>
    </Box>
);

export const SettingsOverview = () => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const { loading } = useFetch<Settings>(
        "settings",
        setSettings,
        converSettingsJSON
    );
    const { enqueueSnackbar } = useSnackbar();
    const confirm = useConfirm();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSettings({
            ...settings,
            [event.target.name]: event.target.checked,
        });
    };

    const handleSubmit = () => {
        patchApi("settings", {
            scanInOut: settings.scanInOut,
            leaderboard: settings.leaderboard,
            public: settings.public,
        })
            .then(() => enqueueSnackbar(saveSuccess, { variant: "success" }))
            .catch((error) => enqueueSnackbar(error, { variant: "error" }));
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
                })
            )
            .catch(() => {});
    };

    return (
        <LoadingSkeleton loading={loading}>
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
                            {adjustableSettings.map((setting) => (
                                <FormControlLabel
                                    value="end"
                                    control={
                                        <Checkbox
                                            checked={
                                                settings[setting.id] as boolean
                                            }
                                            onChange={handleChange}
                                            name={setting.id}
                                        />
                                    }
                                    label={
                                        <Box display="flex">
                                            <Typography>
                                                {setting.name}
                                            </Typography>
                                            <Tooltip
                                                title={setting.description}
                                                placement="right"
                                            >
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
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                            width="100%"
                        >
                            <Typography variant="body2">
                                More settings coming soon!
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{ mt: "1rem" }}>
                    <Button variant="outlined" fullWidth onClick={handleSubmit}>
                        Save
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        fullWidth
                        color="error"
                        onClick={handleDelete}
                    >
                        Delete data
                    </Button>
                </Grid>
            </Grid>
        </LoadingSkeleton>
    );
};
